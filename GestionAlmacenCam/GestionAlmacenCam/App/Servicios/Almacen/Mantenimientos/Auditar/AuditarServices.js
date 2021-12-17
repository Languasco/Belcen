angular.module('appGestion.AuditarServices', [])

.factory('AuditarServices', function (urlApi, $http, $q, $http, $timeout) {

    var Result = {};
    Result.getAuditar = function (id) {
        let url = urlApi + 'Auditar/' + id
        console.log(url)
        var q = $q.defer();
        $http.get(url)
        .success(function (result) {
            q.resolve(result);
        })
        .error(function (err) {
            q.reject(err);
        })
        return q.promise;
    }

    Result.getAuditoria = function (id_usuario, id_usuario_edicion) {
        let url = urlApi + 'Auditar'
        var parameters;
        var q = $q.defer();

        var parametros = id_usuario + '|' + id_usuario_edicion;
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
    

    return Result;
});