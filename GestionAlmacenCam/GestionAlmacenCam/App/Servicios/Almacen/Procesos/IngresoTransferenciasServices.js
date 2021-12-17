angular.module('appGestion.IngresoTransferenciasServices', [])

.factory('IngresoTransferenciasServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};

    Result.getTransferencias = function (params) {
        var q = $q.defer();
        var url = urlApi + "tblAlmTransferenciaCab";
        $http.get(url, {params : params}).success(function (res) {
            
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.getTransferencias_new = function (id_Local, id_Almacen, opcion) {
        let url = urlApi + 'AprobarTransferencia'
        var parameters;
        var q = $q.defer();

        var parametros = id_Local + '|' + id_Almacen + '|' + opcion;
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


    
    Result.ValidacionGeneral = function (objeto_parametros) {
        if (objeto_parametros.serie == 0 || objeto_parametros.serie == '0' || objeto_parametros.serie == null || objeto_parametros.serie == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Serie', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.nroDocumento == 0 || objeto_parametros.nroDocumento == '0' || objeto_parametros.nroDocumento == null || objeto_parametros.nroDocumento == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el nro de Documento', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.fecha_emision == null || objeto_parametros.fecha_emision == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha de Emision', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_Transportista == 0 || objeto_parametros.id_Transportista == '0' || objeto_parametros.id_Transportista == null || objeto_parametros.id_Transportista == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Transportista', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_vehiculo == 0 || objeto_parametros.id_vehiculo == '0' || objeto_parametros.id_vehiculo == null || objeto_parametros.id_vehiculo == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Vehiculo', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_Proveedor == 0 || objeto_parametros.id_Proveedor == '0' || objeto_parametros.id_Proveedor == null || objeto_parametros.id_Proveedor == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Proveedor', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.fecha_traslado == null || objeto_parametros.fecha_traslado == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha de Traslado', 'error', '#ff6849', 1500);
            return false;
        }
     }
    
    Result.getTransferenciasDet = function (params) {
        var q = $q.defer();
        var url = urlApi + "tblAlmTransferenciaDet";
        $http.get(url, { params : params}).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }


    Result.get_DetalleTransferencia = function (Id_AlmTranCab) {
        let url = urlApi + 'AprobarTransferencia'
        var parameters;
        var q = $q.defer();

        var parametros = Id_AlmTranCab;
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

    Result.get_AprobarTransferencia_SinGuia = function (Id_AlmTranCab, id_usuario) {
        let url = urlApi + 'AprobarTransferencia'
        var parameters;
        var q = $q.defer();

        var parametros = Id_AlmTranCab + '|'+  id_usuario;
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

    Result.get_AprobarTransferencia_conGuia = function (Id_AlmTranCab, id_usuario,obj ) {
        let url = urlApi + 'AprobarTransferencia'
        var parameters;
        var q = $q.defer();

        var parametros = Id_AlmTranCab + '|' + id_usuario + '|' + obj.serie + '|' + obj.nroDocumento + '|' + obj.fecha_emisionAux + '|' + obj.id_Transportista + '|' + obj.id_vehiculo + '|' + obj.id_Proveedor + '|' + obj.fecha_trasladoAux;
        parameters = {
            opcion: 3,
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

    Result.get_RechazarTransferencia = function (Id_AlmTranCab, id_usuario) {
        let url = urlApi + 'AprobarTransferencia'
        var parameters;
        var q = $q.defer();

        var parametros = Id_AlmTranCab + '|' + id_usuario;
        parameters = {
            opcion:4,
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
    
    Result.get_ValidarNroGuia = function (obj) {
        let url = urlApi + 'AprobarTransferencia'
        var parameters;
        var q = $q.defer();

        var parametros = obj.serie + '-' + obj.nroDocumento + '|' + obj.id_Proveedor;
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
       
    Result.get_impresion_transferencias = function (Id_AlmTranCab, id_estado) {
        let url = urlApi + 'AprobarTransferencia'
        var parameters;
        var q = $q.defer();

        var parametros = Id_AlmTranCab + '|' + id_estado;
        parameters = {
            opcion: 6,
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

    Result.get_generar_Guia_transferencia = function (Id_AlmTranCab, id_usuario, obj) {
        let url = urlApi + 'AprobarTransferencia'
        var parameters;
        var q = $q.defer();

        var parametros = Id_AlmTranCab + '|' + id_usuario + '|' + obj.serie + '|' + obj.nroDocumento + '|' + obj.fecha_emisionAux + '|' + obj.id_Transportista + '|' + obj.id_vehiculo + '|' + obj.id_Proveedor + '|' + obj.fecha_trasladoAux;
        parameters = {
            opcion: 7,
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

    Result.set_modificar_cantTransferencia = function (idCab, idDet, cant, idUsuario) {
        let url = urlApi + 'AprobarTransferencia'
        var parameters;
        var q = $q.defer();

        var parametros = idCab + '|' + idDet + '|' + cant + '|' + idUsuario;
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

    return Result;
});