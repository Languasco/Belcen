angular.module('appGestion.MonedaServices', [])

.factory('MonedaServices', function (urlApi, $http, $q, $http, $timeout) {

    var Result = {};
    Result.getMonedas = function (params) {
        var q = $q.defer();
        var url = urlApi + "tblMoneda";
        $http.get(url, { params : params}).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }
    return Result;
});