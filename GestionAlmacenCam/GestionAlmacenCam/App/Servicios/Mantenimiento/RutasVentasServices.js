angular.module('appGestion.RutasVentasServices', [])

.factory('RutasVentasServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getRutasVentas = function () {
        var q = $q.defer();
        var url = urlApi + "tblRutasVentas";

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

    Result.searchRutasVentas = function (obj) {
        var q = $q.defer();
        var url = urlApi + "tblRutasVentas";

        parametros = obj.id_zona +'|'+ obj.id_supervisor +'|'+ obj.id_estado +'|'+ obj.buscar_ruta
        parameters = {
            opcion: 2,
            filtro: parametros
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

    Result.getPersonal = function () {
        var q = $q.defer();
        var url = urlApi + "tblRutasVentas";

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

    Result.getZonas = function () {
        var q = $q.defer();
        var url = urlApi + "tblRutasVentas";

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


    Result.ValidacionGeneral = function (objeto_parametros) {

        if (objeto_parametros.nombreRutaVta == null || objeto_parametros.nombreRutaVta == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Ingrese mombre de ruta', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_Personal_Vendedor == null || objeto_parametros.id_Personal_Vendedor == '' || objeto_parametros.id_Personal_Vendedor == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Ingrese un personal vendedor', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_ZonaVta == null || objeto_parametros.id_ZonaVta == '' || objeto_parametros.id_ZonaVta == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Ingrese zona de ventas', 'error', '#ff6849', 1500);
            return false;
        }
        
    }

    Result.save_RutasVentas = function (params) {
        let url = urlApi + 'tblRutasVentas';
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

    Result.update_RutasVentas = function (object) {

        let url = urlApi + "tblRutasVentas/" + object.id_RutaVta;
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


    Result.delete_RutasVentas = function (id) {
        let url = urlApi + 'tblRutasVentas/' + id;
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