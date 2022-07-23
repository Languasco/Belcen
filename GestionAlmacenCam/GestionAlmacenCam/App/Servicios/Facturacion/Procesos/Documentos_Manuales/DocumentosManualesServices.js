angular.module('appGestion.DocumentosManualesServices', [])
    .factory('DocumentosManualesServices', function (urlApi, $http, $q, $timeout, auxiliarServices) {

    var Result = {};
 
        Result.verificacionNumeroCorrelativo = function (id_Anexos, id_TipoDocumento, Numero_Documento) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexos + '|' + id_TipoDocumento + '|' + Numero_Documento;
            parameters = {
                opcion: 38,
                filtro: parametros
            };

            console.log(parametros)

            $http({
                method: 'GET',
                url: url,
                params: parameters
            }).success(function (result) {
                q.resolve(result);
            }).error(function (err) {
                q.reject(err);
            });
            return q.promise;
        };

        Result.set_GenerandoFacturacionManual = function (idPedido, usuario, flag_tipo_facturacion) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = idPedido + '|' + usuario + '|' + flag_tipo_facturacion;

            parameters = {
                opcion: 39,
                filtro: parametros
            };
            $http({
                method: 'GET',
                url: url,
                params: parameters
            }).success(function (result) {
                q.resolve(result);
            }).error(function (err) {

                q.reject(err);
            });
            return q.promise;
        };

        Result.get_PedidosManual = function (obj_data) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = obj_data.id_ZonaVta + '|' + obj_data.id_almacen + '|' + obj_data.fecha_ini_aux + '|' + obj_data.fecha_fin_aux + '|' + obj_data.id_Vendedor + '|' + obj_data.id_estado + '|' + obj_data.id_Anexos;
            parameters = {
                opcion: 43,
                filtro: parametros
            };

            $http({
                method: 'GET',
                url: url,
                params: parameters
            }).success(function (result) {
                q.resolve(result);
            }).error(function (err) {
                q.reject(err);
            });
            return q.promise;
        };

    return Result;
});