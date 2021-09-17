angular.module('appGestion.UbigeoServices', [])

.factory('UbigeoServices', function (urlApi, $http, $q, $http, $timeout) {

    var Result = {};
    Result.getUbigeo = function (id) {
        let url = urlApi + 'tblUbigeo'
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