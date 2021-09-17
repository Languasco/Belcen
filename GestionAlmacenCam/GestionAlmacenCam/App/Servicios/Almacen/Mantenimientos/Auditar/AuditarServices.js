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
    

    return Result;
});