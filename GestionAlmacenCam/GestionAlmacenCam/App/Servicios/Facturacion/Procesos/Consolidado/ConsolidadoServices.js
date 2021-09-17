angular.module('appGestion.ConsolidadoServices', [])
    .factory('ConsolidadoServices', function ($http, $q, urlApi) {
        var Result = {};
        

        Result.get_generarConsolidadoMercaderia_pdf = function (fechaIni, fechaFin, id_zona, id_transportista, idUsuario, idVendedor) {

            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = fechaIni + '|' + fechaFin + '|' + id_zona + '|' + id_transportista + '|' + idUsuario + '|' + idVendedor;
            parameters = {
                opcion: 6,
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

        Result.get_generarLiquidacionTransportista_pdf = function (fechaIni, fechaFin, id_zona, id_transportista, idUsuario, idVendedor) {

            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = fechaIni + '|' + fechaFin + '|' + id_zona + '|' + id_transportista + '|' + idUsuario + '|' + idVendedor;
            parameters = {
                opcion: 9,
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

        Result.get_generarPlanillaCobranza_pdf = function (fechaIni, fechaFin, id_zona, id_transportista, idUsuario, idVendedor) {

            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = fechaIni + '|' + fechaFin + '|' + id_zona + '|' + id_transportista + '|' + idUsuario + '|' + idVendedor;
            parameters = {
                opcion: 14,
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

        Result.get_generarConsolidado_envio_guiaRemisionSunat  = function (fechaIni, fechaFin, id_zona, id_transportista, idUsuario) {

            let url = urlApi + 'Pedidos'
            var parameters;
            var q = $q.defer();
            var parametros = fechaIni + '|' + fechaFin + '|' + id_zona + '|' + id_transportista + '|' + idUsuario; 

            parameters = {
                opcion: 45,
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
            })
            return q.promise;
        }


        Result.get_guiaRemisionSunat_impresion = function (idGuia) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
            var parametros = idGuia;

            parameters = {
                opcion: 24,
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
            })
            return q.promise;
        }


    return Result;
})