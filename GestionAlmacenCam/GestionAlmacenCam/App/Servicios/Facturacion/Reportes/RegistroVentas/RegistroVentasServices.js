angular.module('appGestion.RegistroVentasServices', [])

.factory('RegistroVentasServices', function (urlApi, $http, $q, $timeout, auxiliarServices) {

    var Result = {};
    Result.getRegistro_Ventas = function (obj) {
        let url = urlApi + 'RegistroVentas';
        var parameters;
        var q = $q.defer();
        var parametros = obj.id_local + '|' + obj.id_almacen + '|' + obj.id_TipoDocumento + '|' + obj.fecha_ini + '|' + obj.fecha_fin;
        parameters = {
            opcion: 1,
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

    Result.getReporteDocumentos = function (obj, idUsuario) {
        let url = urlApi + 'RegistroVentas';
        var parameters;
        var q = $q.defer();
        var parametros = obj.id_Anexos + '|' + obj.id_local + '|' + obj.id_almacen + '|' + obj.id_zona + '|' + obj.fecha_ini + '|' + obj.fecha_fin + '|' + obj.id_TipoDocumento + '|' + idUsuario;
        parameters = {
            opcion: 3,
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

    Result.getReporteProductos = function (obj, idUsuario) {
        let url = urlApi + 'RegistroVentas';
        var parameters;
        var q = $q.defer();
        var parametros = obj.id_Anexos + '|' + obj.id_local + '|' + obj.id_almacen + '|' + obj.id_zona + '|' + obj.fecha_ini + '|' + obj.fecha_fin + '|' + obj.id_TipoDocumento + '|' + idUsuario;
        parameters = {
            opcion: 4,
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