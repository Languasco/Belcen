angular.module('appGestion.productoLineaServices', [])

.factory('productoLineaServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getProductoLineas = function () {
        var q = $q.defer();
        var url = urlApi + "tblAlmProductoLinea"; 

        $http.get(url).success(function (res) {

            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }
   
    Result.getProductLinea = function (idL) {
        var q = $q.defer();
        var url = urlApi + "tblAlmProductoLinea/" + idL;
        //console.log(url);
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }


    Result.ValidacionGeneral = function (objeto_parametros) {
        if (objeto_parametros.id_categoriaProducto == 0 || objeto_parametros.id_categoriaProducto == '0' || objeto_parametros.id_categoriaProducto == null || objeto_parametros.id_categoriaProducto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Categoria', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.codigo_linea == null || objeto_parametros.codigo_linea == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo de Linea', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.nombre_linea == null || objeto_parametros.nombre_linea == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nombre de  Linea', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.abreviatura_linea == null || objeto_parametros.abreviatura_linea == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese abreviatura de Linea', 'error', '#ff6849', 1500);
            return false;
        }

    }



    Result.getProductoLinea = function (idCategoria) {
        var q = $q.defer();
        var url = urlApi + "tblAlmProductoLinea/" + idCategoria;

        $http.get(url).success(function (res) {
            console.log(res);
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

   

    Result.saveProductoLinea = function (params) {
        var q = $q.defer();
        var url = urlApi + "tblAlmProductoLinea";

        $http.post(url, params).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.updateProductoLinea = function (object) {

        let url = urlApi + "tblAlmProductoLinea/" + object.id_lineaProducto;
        var q = $q.defer();
        $http.put(url, object).success(function (result) {
            q.resolve(result);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.anular_productoLinea = function (id) {

        console.log("id es :" + id)
        let url = urlApi + "tblAlmProductoLinea/" + id;

        var q = $q.defer();
        $http.delete(url)
        .success(function (res) {
            q.resolve(res);
        })
        .error(function (err) {
            q.reject(err);
        })
        return q.promise;
    }

    return Result;
});