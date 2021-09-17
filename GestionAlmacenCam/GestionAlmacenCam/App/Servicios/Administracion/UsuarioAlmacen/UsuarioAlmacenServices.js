angular.module('appGestion.UsuarioAlmacenServices', [])

.factory('UsuarioAlmacenServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
   
    Result.get_Usuarios = function () {
        let url = urlApi + 'UsuarioAlmacen'
        var parameters;
        var q = $q.defer();
        var parametros = '';
        parameters = {
            opcion: 1,
            filtro: parametros
        }
        $http({
            method: 'GET',
            url: url,
            params: parameters
        }).success(function (result) {
            q.resolve(result);
        }).error(function (err) {

            q.reject(err);
        })
        return q.promise;
    }

    Result.get_Usuarios_Almacen = function (id_usuario) {
        let url = urlApi + 'UsuarioAlmacen'
        var parameters;
        var q = $q.defer();
        var parametros = id_usuario;
        parameters = {
            opcion: 2,
            filtro: parametros
        }
        $http({
            method: 'GET',
            url: url,
            params: parameters
        }).success(function (result) {
            q.resolve(result);
        }).error(function (err) {

            q.reject(err);
        })
        return q.promise;
    }

    Result.set_save_user_Almacen = function (obj_user, obj_almacen ,  id_usuario) {
        let url = urlApi + 'UsuarioAlmacen'
        var parameters;
        var q = $q.defer();
        var parametros = obj_user + '|' + obj_almacen + '|' + id_usuario;
        parameters = {
            opcion: 3,
            filtro: parametros
        }
        $http({
            method: 'GET',
            url: url,
            params: parameters
        }).success(function (result) {
            q.resolve(result);
        }).error(function (err) {
            q.reject(err);
        })
        return q.promise;
    }

    return Result;
});