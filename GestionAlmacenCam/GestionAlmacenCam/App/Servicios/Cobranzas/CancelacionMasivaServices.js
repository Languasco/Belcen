angular.module('appGestion.CancelacionMasivaServices', [])

 .factory('CancelacionMasivaServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};

     Result.mostrando_lista_documentos = function (obj) {

        let url = urlApi + 'Cancelacion_masiva_doc'
        var parameters;
         var q = $q.defer();
         var parametros = obj.id_local + '|' + obj.id_almacen + '|' + obj.id_Anexos + '|' + obj.vendedor + '|' + obj.id_transportista + '|' + obj.id_tipoDoc + '|' + obj.tipoResponsable + '|' + obj.fechaIni + '|' + obj.fechaFin;

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

     Result.validar_nroRecibo = function (idZona, nroRecibo) {
         let url = urlApi + 'Cancelacion_masiva_doc';
         var parameters;
         var q = $q.defer();

         var parametros = idZona + '|' + nroRecibo;
         parameters = {
             opcion: 8,
             filtro: parametros
         };

         console.log(parametros)

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

     Result.get_detalladoDocumentos = function (id_facturaCab) {
         let url = urlApi + 'Cancelacion_masiva_doc'
         var parameters;
         var q = $q.defer();

         var parametros = id_facturaCab;
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

     Result.get_reporteCierreVenta = function (fechaInicial, fechaFinal, nroRecibo) {
         let url = urlApi + 'Cancelacion_masiva_doc'
         var parameters;
         var q = $q.defer();

         var parametros = fechaInicial + '|' + fechaFinal + '|' + nroRecibo ;
         parameters = {
             opcion: 10,
             filtro: parametros
         }
         console.log(parametros)
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