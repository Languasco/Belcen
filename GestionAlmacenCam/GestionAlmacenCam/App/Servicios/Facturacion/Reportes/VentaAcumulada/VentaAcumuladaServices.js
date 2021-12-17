angular.module('appGestion.VentaAcumuladaServices', [])
    .factory('VentaAcumuladaServices', function (urlApi, $http, $q) {

        var Result = {}; 
        Result.get_descargar_reporteVentaAcumulada_excel = function (id_anexo, fecha_ini, fecha_fin, id_usuario) {

            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_anexo + '|' + fecha_ini + '|' + fecha_fin  + '|' + id_usuario;
            parameters = {
                opcion: 13,
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