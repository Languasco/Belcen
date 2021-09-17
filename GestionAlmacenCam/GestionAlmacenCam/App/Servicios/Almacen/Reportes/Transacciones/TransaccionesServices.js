angular.module('appGestion.TransaccionesServices', [])

    .factory('TransaccionesServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};


    Result.get_almacen_anexo = function (id_Anexos, idUsuario) {
        let url = urlApi + 'ConsultaTransacciones'
        var parameters;
        var q = $q.defer();

        var parametros = id_Anexos + '|' +  idUsuario;
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

        Result.get_buscarProducto = function (id_Anexos, id_almacen, cod_producto) {

            let url = urlApi + 'ConsultaTransacciones'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexos + '|' + id_almacen + '|' + cod_producto;
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

        Result.get_descargarExcel = function (id_Anexos, id_almacen, fechaInicial, fechaFinal, tipoReporte, cod_producto) {

            let url = urlApi + 'ConsultaTransacciones'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexos + '|' + id_almacen + '|' + fechaInicial + '|' + fechaFinal + '|' + tipoReporte + '|' + cod_producto;

            console.log(parametros)

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