angular.module('appGestion.ReimpresionServices', [])
    .factory('ReimpresionServices', function ($http, $q, urlApi) {
        var Result = {};

        Result.get_estados = function () {
            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = '';
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

        Result.get_tipoDocumentos = function () {
            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = '';
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
        
        Result.get_facturasCab = function (id_zona, id_almacen, id_vendedor, id_Anexos, fechaIni, fechaFin, id_transportista, id_tipoDoc) {
            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = id_zona + '|' + id_almacen + '|' + id_vendedor + '|' + id_Anexos + '|' + fechaIni + '|' + fechaFin + '|' + id_transportista + '|' + id_tipoDoc;
            parameters = {
                opcion: 8,
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

        Result.get_generarReimpresionDoc_pdf = function (idFacturasMasivos, id_tipoDoc , idUsuario) {

            const filtro = id_tipoDoc + '|' + idUsuario;
            let url = urlApi + 'RevisionPedido/post_reImpresionDocumentos?filtro=' + filtro;

            console.log(idFacturasMasivos)

            var q = $q.defer();
            $http.post(url, idFacturasMasivos)
                .success(function (res) {
                    q.resolve(res);
                })
                .error(function (err) {
                    q.reject(err);
                })
            return q.promise;
        }

    return Result;
})