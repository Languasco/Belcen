angular.module('appGestion.EntregaPedidoServices', [])
.factory('EntregaPedidoServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {
    var Result = {};
    
    Result.getListarRutaEntregaPedidos = function (obj) {

        let url = urlApi + 'EntregaPedido'
        var parameters;
        var q = $q.defer();

        var parametros = obj.id_local + '|' + obj.id_almacen + '|' + obj.id_Vendedor + '|' + obj.id_transportista + '|' + obj.fecha_ini;

        parameters = {
            opcion: 1,
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

    Result.getListarVendedores = function (obj) {
        let url = urlApi + 'EntregaPedido'
        var parameters;
        var q = $q.defer();
        var parametros = obj.id_Vendedor + '|' + obj.fecha_ini + '|' + obj.fecha_fin;
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



    Result.getListarTransportista = function (obj) {
        let url = urlApi + 'EntregaPedido'
        var parameters;
        var q = $q.defer();
        var parametros = 3
        parameters = {
            opcion: 4,
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
