angular.module('appGestion.productoCategoriaServices', [])

.factory('productoCategoriaServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

  
    var Result = {};
    Result.getProductoCategoria = function (params) {

        var q = $q.defer();
        var url = urlApi + "tblAlmProductoCategoria"; 

        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.getCategorias = function (idcategoria) {
        var q = $q.defer();
        var url = urlApi + "tblAlmProductoCategoria/" + idcategoria;
        //console.log(url);
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }


    Result.ValidacionGeneral = function (objProductoCategoria) {
        if (objProductoCategoria.codgoCategoria == null || objProductoCategoria.codgoCategoria == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Codigo de la Categoria Producto', 'error', '#ff6849', 1500);
            return false;
        }

        else if (objProductoCategoria.nombre_Categoria == null || objProductoCategoria.nombre_Categoria == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nombre de la Categoria Producto', 'error', '#ff6849', 1500);
            return false;
        }

        else if (objProductoCategoria.abreviacion_Categoria == null || objProductoCategoria.abreviacion_Categoria == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Abriviacion de la  Categoria Producto', 'error', '#ff6849', 1500);
            return false;
        }


    }


    Result.saveProductoCategoria = function (params) {
        var q = $q.defer();
        var url = urlApi + "tblAlmProductoCategoria";

        $http.post(url, params).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.updateProductoCategoria = function (object) {

        let url = urlApi + "tblAlmProductoCategoria/" + object.id_categoriaProducto;
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

    Result.anular_CategoriaProducto = function (id) {

        let url = urlApi + "tblAlmProductoCategoria/" + id;

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