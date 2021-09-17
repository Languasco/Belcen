angular.module('appGestion.CondicionFacturacionServices', [])

.factory('CondicionFacturacionServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getCondicionFacturacion = function (id) {
        let url = urlApi + 'tblCom_CondicionFacturacion'
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
     return Result;
});