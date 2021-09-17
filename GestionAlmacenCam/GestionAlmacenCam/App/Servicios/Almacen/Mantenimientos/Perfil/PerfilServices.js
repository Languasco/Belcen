angular.module('appGestion.PerfilServices', [])

.factory('PerfilServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getPerfiles = function () {
        var q = $q.defer();
        var url = urlApi + "tblPerfil";
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }
 
    return Result;
});