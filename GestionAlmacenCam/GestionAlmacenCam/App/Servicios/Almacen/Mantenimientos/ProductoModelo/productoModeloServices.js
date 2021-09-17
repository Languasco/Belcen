angular.module('appGestion.productoModeloServices', [])

.factory('productoModeloServices', function (urlApi, $http, $q, $http, $timeout,auxiliarServices) {

    var Result = {};
    Result.getProductoModeloMarca = function (params) {
        var q = $q.defer();
        var url = urlApi + "tbl_Alm_ProductoModeloMarca";

        $http.get(url).success(function (res) {
      
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }
    Result.getProductoModelo = function (params) {
        var q = $q.defer();
        var url = urlApi + "tbl_Alm_ProductoModeloMarca";

        $http.get(url).success(function (res) {

            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }


    Result.get_marcaProducto = function (idMarca) {
        var q = $q.defer();
        var url = urlApi + "tbl_Alm_ProductoModeloMarca/" + idMarca;
        //console.log(url);
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }



    Result.ValidacionGeneral = function (objProductoModeloMarca) {

        if (objProductoModeloMarca.id_marcaProducto == 0 || objProductoModeloMarca.id_marcaProducto == '0' || objProductoModeloMarca.id_marcaProducto == null || objProductoModeloMarca.id_marcaProducto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Marca del Producto', 'error', '#ff6849', 1500);
            return false;
        
        }
        else if (objProductoModeloMarca.codigo_modeloProducto == null || objProductoModeloMarca.codigo_modeloProducto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Codigo de Modelo Marca Producto', 'error', '#ff6849', 1500);
            return false;
        }

        else if (objProductoModeloMarca.nombre_modeloProducto == null || objProductoModeloMarca.nombre_modeloProducto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nombre de Modelo  Marca del producto', 'error', '#ff6849', 1500);
            return false;
        }

        //else if (objProductoModeloMarca.abreviatura_modeloProducto == null || objProductoModeloMarca.abreviatura_modeloProducto == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Abreviacion de Modelo Marca del producto', 'error', '#ff6849', 1500);
        //    return false;
        //}

    }

    Result.saveProductoModeloMarca = function (params) {
        var q = $q.defer();
        var url = urlApi + "tbl_Alm_ProductoModeloMarca";

        $http.post(url, params).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.UpdateProductoModeloMarca= function (object) {
        
        let url = urlApi + "tbl_Alm_ProductoModeloMarca/" + object.id_modeloProducto;
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


    Result.anular_productoModelo = function (id) {

        let url = urlApi + "tbl_Alm_ProductoModeloMarca/" + id;

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