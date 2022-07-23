angular.module('appGestion.UsuarioZonaVentaServices', [])

    .factory('UsuarioZonaVentaServices', function (urlApi, $http, $q, $http) {

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

    Result.set_save_user_zonas = function (obj_user, obj_zonas , id_usuario, id_local ) {
        let url = urlApi + 'UsuarioAlmacen'
        var parameters;
        var q = $q.defer();
        var parametros = obj_user + '|' + obj_zonas + '|' + id_usuario + '|' + id_local;
        parameters = {
            opcion: 5,
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

    Result.get_Usuarios_localZonas = function (id_usuario, id_local ) {
        let url = urlApi + 'UsuarioAlmacen'
        var parameters;
        var q = $q.defer();
        var parametros = id_usuario + '|' + id_local;

        parameters = {
            opcion: 4,
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