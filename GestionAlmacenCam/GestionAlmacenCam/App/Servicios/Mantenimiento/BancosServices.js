angular.module('appGestion.BancosServices', [])

.factory('BancosServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};

    Result.get_bancos = function () {
        var q = $q.defer();
        var url = urlApi + "tblBancos";


        $http({
            method: 'GET',
            url: url
        }).success(function (result) {
            q.resolve(result);
        }).error(function (err) {

            q.reject(err);
        })
        return q.promise;

    }

    Result.search_bancos = function (obj) {
        var q = $q.defer();
        var url = urlApi + "tblBancos";

        parametros = obj.id_estado + '|' + obj.buscar_banco
        parameters = {
            opcion: 1,
            filtro: parametros
        }

        console.log(parametros);

        $http({
            method: 'GET',
            url: url,
            params: parameters
        }).success(function (result) {
            q.resolve(result);
        }).error(function (err) {

            q.reject(err);
        })
        return q.promise;

    }

    Result.ValidacionGeneral = function (objeto_parametros) {

        if (objeto_parametros.nombreBanco == null || objeto_parametros.nombreBanco == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Ingrese nombre de banco', 'error', '#ff6849', 1500);
            return false;
        }
        
    }

    Result.save_banco = function (params) {
        let url = urlApi + 'tblBancos';
        var q = $q.defer();
        $http.post(url, params)
        .success(function (res) {
            q.resolve(res);
        })
        .error(function (err) {
            q.reject(err);
        })
        return q.promise;
    }

    Result.update_banco = function (object) {

        let url = urlApi + "tblBancos/" + object.id_Banco;
        var q = $q.defer();
        $http.put(url, object)
        .success(function (result) {
            q.resolve(result);
        })
        .error(function (err) {
            q.reject(err);
        })
        return q.promise;
    }


    Result.delete_banco = function (id) {
        let url = urlApi + 'tblBancos/' + id;
        var q = $q.defer();
        $http.delete(url)
        .success(function (res) {
            q.resolve(res);
        })
        .error(function (err) {
            q.reject(err);
        })
        return q.promise;
    }
 
    return Result;
});