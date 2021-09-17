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


    return Result;
});