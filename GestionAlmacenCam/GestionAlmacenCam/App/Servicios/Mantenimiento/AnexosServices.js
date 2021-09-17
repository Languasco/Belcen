angular.module('appGestion.AnexosServices', [])

.factory('AnexosServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};

    Result.get_anexos = function () {
        var q = $q.defer();
        var url = urlApi + "tblAnexos";

        parameters = {
            opcion: 1,
            filtro: ""
        }

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

    Result.search_anexos = function (obj) {
        var q = $q.defer();
        var url = urlApi + "tblAnexos";

        parametros = obj.id_estado + '|' + obj.buscar_anexo
        parameters = {
            opcion: 2,
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

        if (objeto_parametros.nombreAnexo == null || objeto_parametros.nombreAnexo == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Ingrese nombre de anexo', 'error', '#ff6849', 1500);
            return false;
        }
        
    }

    Result.save_anexo = function (params) {
        let url = urlApi + 'tblAnexos';
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

    Result.update_anexo = function (object) {

        let url = urlApi + "tblAnexos/" + object.id_Anexos;
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


    Result.delete_anexo = function (id) {
        let url = urlApi + 'tblAnexos/' + id;
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