angular.module('appGestion.ReporteContableServices', [])
    .factory('ReporteContableServices', function (urlApi, $http, $q) {

        var Result = {}; 
        Result.get_descargar_reporteContable_excel = function (id_anexo, fecha_ini, fecha_fin, opcion_reporte, id_usuario) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_anexo + '|' + fecha_ini + '|' + fecha_fin + '|' + opcion_reporte + '|' + id_usuario;
            parameters = {
                opcion: 12,
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