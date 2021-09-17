angular.module('appGestion.ResumenVentasServices', [])
    .factory('ResumenVentasServices', function (urlApi, $http, $q, $timeout, auxiliarServices) {

        var Result = {};

    Result.getResumen_Ventas_Excel = function (obj) {
        let url = urlApi + 'RegistroVentas';
        var parameters;
        var q = $q.defer();
        var parametros = obj.id_PuntoVenta + '|' + obj.id_lineaProducto + '|' + obj.id_marcaProducto + '|' + obj.id_Tiporep + '|' + obj.fecha_ini + '|' + obj.fecha_fin + '|' + obj.id_usuario;
        parameters = {
            opcion: 2,
            filtro: parametros
        };

        console.log(parameters)

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