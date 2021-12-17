angular.module('appGestion.loginServices', [])

.factory('loginServices', function (urlApi, $http, $q, $http, $timeout) {

    var Result = {};
    Result.initSession = function (params) 
    {
        var q = $q.defer();
        var url = urlApi + "UsuarioAccesos";
        $http.get(url, {
            params: params
        }).success(function (res) {
 
            if (res == null) {
                q.reject("failet");
            } else {
                q.resolve(res);
            };            
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }


    Result.get_ActivarDesactivarSesion = function (idUsuario, estado) {
        let url = urlApi + 'UsuarioAccesos'
        var parameters;
        var q = $q.defer();

        var parametros = idUsuario + '|' + estado;

        console.log(parametros)

        parameters = {
            option: 5,
            filters: parametros
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

    Result.set_recuperarPassword_Email = function (emailRecuperacion) {
        let url = urlApi + 'UsuarioAccesos'
        var parameters;
        var q = $q.defer();

        var parametros = emailRecuperacion
        parameters = {
            option: 6,
            filters: parametros
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