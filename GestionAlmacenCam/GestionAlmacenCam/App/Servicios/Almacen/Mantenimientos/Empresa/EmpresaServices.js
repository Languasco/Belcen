angular.module('appGestion.EmpresaServices', [])

.factory('EmpresaServices', function (urlApi, $http, $q, $http, $timeout) {

    var Result = {};
    Result.getEmpresa = function () {
        var q = $q.defer();
        var url = urlApi + "tblEmpresas";
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }
    

    return Result;
});