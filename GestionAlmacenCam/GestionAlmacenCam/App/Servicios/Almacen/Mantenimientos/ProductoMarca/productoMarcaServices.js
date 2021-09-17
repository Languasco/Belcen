angular.module('appGestion.productoMarcaServices', [])

.factory('productoMarcaServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

  

    var Result = {};
    Result.getProductoMarca = function (params) {
        var q = $q.defer();
        var url = urlApi + "tblAlmProductoMarca"; 

        $http.get(url).success(function (res) {

            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    
    Result.getProductoestatus = function (status) {
        var q = $q.defer();
        var url = urlApi + "tblAlmProductoMarca/" + status;
        //console.log(url);
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.ValidacionGeneral = function (objeto_parametros) {
        if (objeto_parametros.codigo_marcaproducto == null || objeto_parametros.codigo_marcaproducto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Codigo de la Marca Producto', 'error', '#ff6849', 1500);
            return false;
        }

        else if (objeto_parametros.nombre_marcaproducto == null || objeto_parametros.nombre_marcaproducto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nombre de la Marca del producto', 'error', '#ff6849', 1500);
            return false;
        }

        //else if (objeto_parametros.abreviatura_marcaproducto == null || objeto_parametros.abreviatura_marcaproducto == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Abriviacion de Marca', 'error', '#ff6849', 1500);
        //    return false;
        //}


    }

    Result.saveProductoMarcas = function (params) {
        var q = $q.defer();
        var url = urlApi + "tblAlmProductoMarca";
        $http.post(url, params).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.updateProductoMarca = function (object) {
        let url = urlApi + "tblAlmProductoMarca/" + object.id_marcaProducto;
        var q = $q.defer();
        $http.put(url, object).success(function (result) {
            q.resolve(result);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }


    Result.anular_productoMarca = function (id) {

        let url = urlApi + 'tblAlmProductoMarca/' + id;

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