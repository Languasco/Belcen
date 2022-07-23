angular.module('appGestion.AccesosServices', [])

.factory('AccesosServices', function (urlApi, $http, $q, $http, $timeout) {

    var Result = {};
    Result.getAccesosUsuarios = function (params) {
        var q = $q.defer();
        var url = urlApi + "UsuarioAccesos";
        console.log(url,params);
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


 

    Result.set_quitarAccesoMenu = function (idParent, idUsuario) {

        let url = urlApi + 'UsuarioAccesos'
        var parameters;
        var q = $q.defer();

        var parametros = idParent + '|' + idUsuario;
        parameters = {
            option: 7,
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