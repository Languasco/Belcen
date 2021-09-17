angular.module('appGestion.AprobarDevolucionServices', [])
    .factory('AprobarDevolucionServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {
    var Result = {}; 

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

        Result.getActualizarPedidos_Cab = function (obj) {
            let url = urlApi + 'EntregaPedido'
            var parameters;
            var q = $q.defer();

            var parametros = obj.id_local + '|' + obj.id_almacen + '|' + obj.id_Vendedor + '|' + obj.id_transportista + '|' + obj.id_tipoEntrega + '|' + obj.fecha_ini;

            parameters = {
                opcion: 5,
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

        Result.getActualizarPedidos_Det = function (idpedidoCab) {
            let url = urlApi + 'EntregaPedido'
            var parameters;
            var q = $q.defer();

            var parametros = idpedidoCab

            parameters = {
                opcion: 6,
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

        Result.setGenerarAprobacionDevolucion = function (id_Pedido_Cab, fechaTransaccion, nroNotaCredito, usuario) {
            let url = urlApi + 'EntregaPedido'
            var parameters;
            var q = $q.defer();

            var parametros = id_Pedido_Cab + '|' + fechaTransaccion + '|' + nroNotaCredito + '|' + usuario;

            parameters = {
                opcion: 7,
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
