angular.module('appGestion.StockServices', [])

.factory('StockServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};

    Result.get_Vendedores = function () {
        let url = urlApi + 'PagosVendedor'
        var parameters;
        var q = $q.defer();

        // cargo Vendedor=6
        var parametros = 6
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
        
    Result.validate = function (params) {
        if (params.fecha == 0 || params.fecha == '0' || params.fecha == null || params.fecha == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Fecha', 'error', '#ff6849', 1500);
            return false;
        }
    }

    Result.validate_new = function (params) {
        if (params.fecha == 0 || params.fecha == '0' || params.fecha == null || params.fecha == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Fecha', 'error', '#ff6849', 1500);
            return false;
        }
        else if (params.fecha_fin == 0 || params.fecha_fin == '0' || params.fecha_fin == null || params.fecha_fin == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Fecha Final', 'error', '#ff6849', 1500);
            return false;
        }
        else if (params.idMaterial == 0 || params.idMaterial == '0' || params.idMaterial == null || params.idMaterial == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Material', 'error', '#ff6849', 1500);
            return false;
        }
    }

    Result.getGenerarReportePDF_Stock = function (opcion, obj) {

        let url = urlApi + 'Stock'
        var parameters;
        var q = $q.defer();

        var parametros = obj.fecha_aux + '|' + obj.local + '|' + obj.almacen + '|' + obj.tipo + '|' + obj.idMaterial;

        parameters = {
            opcion: opcion,
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
    
    Result.getKardexReporte = function (fechaini,fechafin,id_material) {

        let url = urlApi + 'Kardex'
        var parameters;
        var q = $q.defer();
        parameters = {
            fechaini : fechaini,
            fechafin: fechafin,
            id_material : id_material
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
    
    Result.getKardexReporte_new = function (obj_data) {
        let url = urlApi + 'Kardex'
        var parameters;
        var q = $q.defer();
        parameters = {
            fechaini: obj_data.fecha,
            fechafin: obj_data.fecha_fin,
            id_material: obj_data.idMaterial,
            tipo: obj_data.tipo,
            local: obj_data.local,
            almacen: obj_data.almacen,
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


    Result.getKardexReporte_todo = function (obj_data) {
        let url = urlApi + 'Kardex'
        var parameters;
        var q = $q.defer();
        parameters = {
            fechaini: obj_data.fecha,
            fechafin: obj_data.fecha_fin,            
            tipo: obj_data.tipo,
            local: obj_data.local,
            almacen: obj_data.almacen,
            idMaterial: obj_data.idMaterial,
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

    return Result;
});