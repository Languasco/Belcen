angular.module('appGestion.PagosVendedorServices', [])

.factory('PagosVendedorServices', function (urlApi, $http, $q, $timeout, auxiliarServices) {

    var Result = {};

    Result.get_Vendedores = function () {
        let url = urlApi + 'PagosVendedor';
        var parameters;
        var q = $q.defer();

        // cargo Vendedor=6
        var parametros = 6;
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

    Result.validate = function (params) {
        if (params.vendedor === 0 || params.vendedor === '0' || params.vendedor === null || params.vendedor === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un vendedor', 'error', '#ff6849', 1500);
            return false;
        }
        else if (params.fecha_ini === 0 || params.fecha_ini === '0' || params.fecha_ini === null || params.fecha_ini === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Fecha Inicial', 'error', '#ff6849', 1500);
            return false;
        }
        else if (params.fecha_fin === 0 || params.fecha_fin === '0' || params.fecha_fin === null || params.fecha_fin === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Fecha Final', 'error', '#ff6849', 1500);
            return false;
        }
    };

    Result.getGenerarReporte = function (obj) {

        let idBusqueda = 0;
        if (obj.opcion == 1) {
            idBusqueda = obj.id_cliente;
        }
        if (obj.opcion == 4) {
            idBusqueda = obj.id_busqueda;
        }

        let url = urlApi + 'PagosVendedor';
        var parameters;
        var q = $q.defer();
        var parametros = obj.opcion + '|' + idBusqueda+ '|' + obj.nro_doc + '|' + obj.fecha_ini_aux + '|' + obj.fecha_fin_aux + '|' + obj.idAnexo + '|' + obj.idZonaVentas;

        parameters = {
            opcion: 5,
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

    Result.getGenerarReporteCierreVenta = function (obj) {

        let idBusqueda = 0;
        if (obj.opcion == 1) {
            idBusqueda = obj.id_cliente;
        }
        if (obj.opcion == 4) {
            idBusqueda = obj.id_busqueda;
        }


        let url = urlApi + 'PagosVendedor';
        var parameters;
        var q = $q.defer();
        var parametros = obj.opcion + '|' + idBusqueda + '|' + obj.nro_doc + '|' + obj.fecha_ini_aux + '|' + obj.fecha_fin_aux + '|' + obj.idAnexo + '|' + obj.idZonaVentas;

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

    Result.get_MostrandoRelacionVoucher = function (idFactura) {

        let url = urlApi + 'PagosVendedor';
        var parameters;
        var q = $q.defer();
        var parametros = idFactura;

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

    Result.getGenerarExcel = function (obj) {

        let idBusqueda = 0;
        if (obj.opcion == 1) {
            idBusqueda = obj.id_cliente;
        }
        if (obj.opcion == 4) {
            idBusqueda = obj.id_busqueda;
        }

        let url = urlApi + 'PagosVendedor';
        var parameters;
        var q = $q.defer();
        var parametros = obj.opcion + '|' + idBusqueda + '|' + obj.nro_doc + '|' + obj.fecha_ini_aux + '|' + obj.fecha_fin_aux + '|' + obj.idAnexo + '|' + obj.idZonaVentas;

        parameters = {
            opcion: 6,
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

    Result.get_ayuda_busquedaVendedores = function (textoBusqueda, id_zona) {
 
        let url = urlApi + 'PagosVendedor';
        var parameters;
        var q = $q.defer();
        var parametros = textoBusqueda + '|' + id_zona

        parameters = {
            opcion: 7,
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

    Result.get_reporteEstadosDocumentos = function (obj) {

        let idBusqueda = 0;
        if (obj.opcion == 1) {
            idBusqueda = obj.id_cliente;
        }
        if (obj.opcion == 4) {
            idBusqueda = obj.id_busqueda;
        }

        let url = urlApi + 'PagosVendedor';
        var parameters;
        var q = $q.defer();
        var parametros = obj.opcion + '|' + idBusqueda + '|' + obj.nro_doc + '|' + obj.fecha_ini_aux + '|' + obj.fecha_fin_aux + '|' + obj.idAnexo + '|' + obj.idZonaVentas;

        parameters = {
            opcion: 8,
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