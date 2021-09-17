angular.module('appGestion.cancelacion_x_documentoServices', [])
.factory('cancelacion_x_documentoServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};


    Result.mostrando_registro_pagos = function (obj_data) {
         let url = urlApi + 'Cancelacion_masiva_doc'
        var parameters;
        var q = $q.defer();

                var parametros = obj_data.id_TipoDocumento + '|' + obj_data.serie + '-' + obj_data.num_doc;
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

     Result.set_guardando_Detalle_Pagos = function (List_data) {
         let url = urlApi + 'Cancelacion_masiva_doc/set_guardandoPagos';
         var q = $q.defer();

         $http.post(url, List_data)
             .success(function (res) {
                 q.resolve(res);
             })
             .error(function (err) {
                 q.reject(err);
             });
         return q.promise;
     }

     Result.set_descartando_Detalle_Pagos = function (id_usuario) {
         let url = urlApi + 'Cancelacion_masiva_doc'
         var parameters;
         var q = $q.defer();

         var parametros = id_usuario;
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


    Result.get_SaldoCuenta_Factura = function (id_factura) {
        let url = urlApi + 'Cancelacion_masiva_doc'
        var parameters;
        var q = $q.defer();

        var parametros = id_factura;
        parameters = {
            opcion: 4,
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

    Result.set_Generando_Cancelacion = function (obj) {
        let url = urlApi + 'Cancelacion_masiva_doc';
        var parameters;
        var q = $q.defer();

        var parametros = obj.id_factura_cab + '|' + obj.codRef + '|' + obj.totalpago + '|' + obj.pagoCueta + '|' + obj.id_formaPago + '|' + obj.id_banco + '|' + obj.fechaOperacion + '|' + obj.nroOperacion;
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

    Result.set_rechazar_Pago = function (id_cancelacion, id_factura, usuario) {
        let url = urlApi + 'Cancelacion_masiva_doc';
        var parameters;
        var q = $q.defer();

        var parametros = id_cancelacion + '|' + id_factura + '|' + usuario;
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



    Result.get_Mostrando_imagenVoucher = function (nro_ref) {

        let url = urlApi + 'Cancelacion_masiva_doc';
        var parameters;
        var q = $q.defer();
        var parametros = nro_ref;

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


    return Result;
});