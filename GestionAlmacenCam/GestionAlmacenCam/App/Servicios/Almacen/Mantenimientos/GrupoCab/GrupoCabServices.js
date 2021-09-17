angular.module('appGestion.GrupoCabServices', [])

.factory('GrupoCabServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getGrupoCab = function () {
        let url = urlApi + 'TblGrupoTabla_Cab';
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

    return Result;
});