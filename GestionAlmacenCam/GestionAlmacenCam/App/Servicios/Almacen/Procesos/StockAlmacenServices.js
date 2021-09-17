angular.module('appGestion.StockAlmacenServices', [])

.factory('StockAlmacenServices', function (urlApi, $http, $q, $http, $timeout) {

    var Result = {};

    Result.getStockAlmacen = function (params) {
        var q = $q.defer();
        var url = urlApi + "StockAlmacen";
        console.log(params);
        $http.get(url, { params: params }).success(function (res) {

            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }


    Result.SaveMaterialRecepcion = function (params) {
        console.log(JSON.stringify(params));
        var q = $q.defer();
        var url = urlApi + "SaveMaterialRecepcion";
        $http.get(url, { params: params }).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.SaveTransferencia = function (params) {
        var q = $q.defer();
        var url = urlApi + "SaveTransferencia";
        $http.post(url, params).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }




    return Result;
});