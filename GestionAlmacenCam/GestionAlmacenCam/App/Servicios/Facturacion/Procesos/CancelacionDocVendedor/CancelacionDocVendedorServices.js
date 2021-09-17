angular.module('appGestion.CancelacionDocVendedorServices', [])

.factory('CancelacionDocVendedorServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};

    Result.get_Vendedores = function () {
        let url = urlApi + 'PagosVendedor'
        var parameters;
        var q = $q.defer();

        // cargo Vendedor=6
        var parametros = 6
        parameters = {
            opcion: 1,
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

    Result.validate = function (params) {
        if (params.vendedor == 0 || params.vendedor == '0' || params.vendedor == null || params.vendedor == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un vendedor', 'error', '#ff6849', 1500);
            return false;
        }
        else if (params.fecha_ini == 0 || params.fecha_ini == '0' || params.fecha_ini == null || params.fecha_ini == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Fecha Inicial', 'error', '#ff6849', 1500);
            return false;
        }
    }

    Result.getGenerarReporte = function (obj) {

        let url = urlApi + 'CancelacionDocumentoVenta'
        var parameters;
        var q = $q.defer();
        var parametros = obj.vendedor + '|' + obj.fecha_ini_aux;

        parameters = {
            opcion: 2,
            filtro: parametros
        }
        console.log(parameters)

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

    Result.getUpdateCancelacion= function (obj_facturas, id_usuario) {

        let url = urlApi + 'CancelacionDocumentoVenta'
        var parameters;
        var q = $q.defer();
        var parametros = obj_facturas.toString() + '|' + id_usuario

        parameters = {
            opcion: 3,
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

   
    return Result;
});