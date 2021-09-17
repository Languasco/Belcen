angular.module('appGestion.productoSubLineaServices', [])

.factory('productoSubLineaServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};

    Result.getProductoSubLinea = function () {
        var q = $q.defer();
        var url = urlApi + "tblAlmProductoSubLinea";
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }


    Result.getProductSLinea = function (idLinea) {
        var q = $q.defer();
        var url = urlApi + "tblAlmProductoSubLinea/" + idLinea;
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }
   

    Result.ValidacionGeneral = function (objeto_parametros) {

        if (objeto_parametros.id_categoriaProducto == 0 || objeto_parametros.id_categoriaProducto == '0' || objeto_parametros.id_categoriaProducto == null || objeto_parametros.id_categoriaProducto == '') {
        auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Categoria del Producto', 'error', '#ff6849', 1500);

        return false;

        }
        else if (objeto_parametros.id_lineaProducto == 0 || objeto_parametros.id_lineaProducto == '0' || objeto_parametros.id_lineaProducto == null || objeto_parametros.id_lineaProducto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione Linea del Producto', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.codigo_SubLinea == 0 || objeto_parametros.codigo_SubLinea == '0' || objeto_parametros.codigo_SubLinea == null || objeto_parametros.codigo_SubLinea == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo de productoSubLinea', 'error', '#ff6849', 1500);

            return false;
        }
        else if (objeto_parametros.nombre_SubLinea == null || objeto_parametros.nombre_SubLinea == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nombre  de productoSubLinea', 'error', '#ff6849', 1500);

            return false;
        }
        else if (objeto_parametros.abreviatura_SubLinea == null || objeto_parametros.abreviatura_SubLinea == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Abreviatura  de productoSubLinea', 'error', '#ff6849', 1500);

            return false;
        }
        
    }

    Result.save_ProductoSubLinea = function (params) {

        console.log('params')
        console.log(params)

        let url = urlApi + 'tblAlmProductoSubLinea'
        var q = $q.defer();
        $http.post(url, params)
        .success(function (res) {
            q.resolve(res);
        })
        .error(function (err) {
            q.reject(err);
        })
        return q.promise;
    }

    Result.update_ProductoSubLinea = function (object) {
        let url = urlApi + "tblAlmProductoSubLinea/" + object.id_subLineaProducto;
        var q = $q.defer();
        $http.put(url, object)
        .success(function (result) {
            q.resolve(result);
        })
        .error(function (err) {
            q.reject(err);
        })
        return q.promise;
    }


    Result.anular_ProductoSubLinea = function (id) {

        let url = urlApi + 'tblAlmProductoSubLinea/' + id;

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