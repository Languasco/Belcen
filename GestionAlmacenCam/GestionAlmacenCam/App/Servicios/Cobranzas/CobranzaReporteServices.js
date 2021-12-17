angular.module('appGestion.CobranzaReporteService', [])

    .factory('CobranzaReporteServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

        var Result = {};

        Result.get_anexo = function () {
            var q = $q.defer();
            var url = urlApi + "CobranzaReporte";

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

        Result.get_zonaVentas = function () {
            var q = $q.defer();
            var url = urlApi + "CobranzaReporte";

            parameters = {
                opcion: 2,
                filtro: ''
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


        Result.get_vendedor = function () {
            var q = $q.defer();
            var url = urlApi + "CobranzaReporte";

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


        Result.get_reporteCobranza = function (obj) { 

            var q = $q.defer();
            var url = urlApi + "CobranzaReporte";
            var parametros = obj.idAnexo + "|" + obj.idZonaVentas + "|" + obj.idVendedor + "|" + obj.buscar + "|" + obj.fechaIni + "|" + obj.fechaFin

            parameters = {
                opcion: 4,
                filtro: parametros
            }

            console.log(parameters);
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

        Result.download_reporteCobranza = function (obj) {
            var q = $q.defer();
            var url = urlApi + "CobranzaReporte";
            var parametros = obj.idAnexo + "|" + obj.idZonaVentas + "|" + obj.idVendedor + "|" + obj.buscar + "|" + obj.fechaIni + "|" + obj.fechaFin +"|"+ obj.idUsuario

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

        Result.get_reporteCobranzaPDF= function (fechaInicial, fechaFinal, nroDoc) {
            let url = urlApi + 'Cancelacion_masiva_doc'
            var parameters;
            var q = $q.defer();

            var parametros = fechaInicial + '|' + fechaFinal + '|' + nroDoc;
            parameters = {
                opcion: 11,
                filtro: parametros
            }
            console.log(parametros)
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