angular.module('appGestion.EstadosServices', [])

.factory('EstadosServices', function (urlApi, $http, $q, $http, $timeout) {

    var Result = {};
    Result.getEstados = function (id) {
        let url = urlApi + 'tblEstados'
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


    Result.getEstadosByTipo = function (tipo) {
        let url = urlApi + 'tblEstados'
        var q = $q.defer();
        $http.get(url, {
            params: {
                tipoProceso: tipo
            }
        })
        .success(function (result) {
            q.resolve(result);
        })
        .error(function (err) {
            q.reject(err);
        })
        return q.promise;
    }


    return Result;
});