angular.module('appGestion.ZonasVentasServices', [])

.factory('ZonasVentasServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.get_zonasVentas = function () {
        var q = $q.defer();
        var url = urlApi + "tblZonasVentas";

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

    Result.search_zonasVentas = function (obj) {
        var q = $q.defer();
        var url = urlApi + "tblZonasVentas";

        parametros = obj.id_local + '|' + obj.id_anexo + '|' + obj.id_estado + '|' + obj.buscar_zona
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

    Result.get_transportista = function () {
        var q = $q.defer();
        var url = urlApi + "tblZonasVentas";

        parameters = {
            opcion: 3,
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

    Result.get_anexos = function () {
        var q = $q.defer();
        var url = urlApi + "tblZonasVentas";

        parameters = {
            opcion: 4,
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

    Result.get_supervisor = function () {
        var q = $q.defer();
        var url = urlApi + "tblZonasVentas";

        parameters = {
            opcion: 5,
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


    Result.get_locales = function () {
        var q = $q.defer();
        var url = urlApi + "tblZonasVentas";

        parameters = {
            opcion: 6,
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

    Result.ValidacionGeneral = function (objeto_parametros) {

        if (objeto_parametros.nombreZonaVta == null || objeto_parametros.nombreZonaVta == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Ingrese nombre de zona', 'error', '#ff6849', 1500);
            return false;
        }
        
    }

    Result.save_ZonasVentas = function (params) {
        let url = urlApi + 'tblZonasVentas';
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

    Result.update_ZonasVentas = function (object) {

        let url = urlApi + "tblZonasVentas/" + object.id_ZonaVta;
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


    Result.delete_ZonasVentas = function (id) {
        let url = urlApi + 'tblZonasVentas/' + id;
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