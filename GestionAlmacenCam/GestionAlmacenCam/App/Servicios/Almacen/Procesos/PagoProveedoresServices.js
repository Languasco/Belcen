angular.module('appGestion.PagoProveedoresServices', [])
    .factory('PagoProveedoresServices', function ($http, $q, $upload, urlApi) {
        var Result = {};
        Result.get_TipoOrden_usuario = function (idUsuario) {

            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = idUsuario;
            parameters = {
                opcion: 14,
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

        Result.get_mostrandoInformacion = function (obj) {

            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = obj.id_Proveedor + '|' + obj.tipoReporte + '|' + obj.id_tipoDoc + '|' + obj.nro_documento;
            parameters = {
                opcion: 23,
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

        Result.validar_nroOperacion = function (id_banco, nroOperacion, fechaOperacion) {
            let url = urlApi + 'IngresoFacturas';
            var parameters;
            var q = $q.defer();

            var parametros = id_banco + '|' + nroOperacion + '|' + fechaOperacion;
            parameters = {
                opcion: 24,
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


        Result.guardar_pagoIndividual = function ({ id_GuiaCab, id_formaPago, id_banco, fechaOperacion, nroOperacion, monto_Pago }, id_usuario , esMasivo) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaCab + '|' + id_formaPago + '|' + id_banco + '|' + fechaOperacion + '|' + nroOperacion + '|' + monto_Pago + '|' + id_usuario + '|' + esMasivo;
            parameters = {
                opcion: 25,
                filtro: parametros
            }

            console.log(parameters)

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

        Result.uploadFile_imageComprobantePagos = function (files, idPago, usuario, esMasivo) {
            var uploadUrl = urlApi + 'IngresoFacturas/UploadVoucherPago';
            var q = $q.defer();
            $upload.upload({
                url: uploadUrl,
                method: "POST",
                params: {
                    idPago: idPago,
                    idUsuario: usuario,
                    esMasivo: esMasivo,
                },
                file: files
            }).success(function (data, status, headers, config) {
                q.resolve(data);
            }).error(function (data, status, headers, config) {
                q.reject(data);
            }).progress(function (evt) {
                var progressn = parseInt(100.0 * evt.loaded / evt.total);
                q.notify(progressn);
            });

            return q.promise;
        };

        Result.get_detallePagos = function (id_GuiaCab) {
            let url = urlApi + 'IngresoFacturas';
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaCab;
            parameters = {
                opcion: 26,
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


        Result.get_descargarReportePagosProveedores = function ({ tipoReporte, id_Proveedor, tipoDocumentos, idUsuario  }) {
            let url = urlApi + 'IngresoFacturas';
            var parameters;
            var q = $q.defer();

            var parametros = tipoReporte + '|' + id_Proveedor + '|' +  tipoDocumentos + '|' + idUsuario ;
            parameters = {
                opcion: 27,
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
})