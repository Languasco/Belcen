angular.module('appGestion.CobranzaManualService', [])

    .factory('CobranzaManualServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

        var Result = {};

        Result.get_almacen = function (idAnexo) {

            var q = $q.defer();
            var url = urlApi + "CobranzaManual";

            parameters = {
                opcion: 2,
                filtro: idAnexo
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

        Result.get_tipoDoc = function () {

            var q = $q.defer();
            var url = urlApi + "CobranzaManual";

            parameters = {
                opcion: 3,
                filtro: ""
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

        Result.get_puntoVenta = function () {

            var q = $q.defer();
            var url = urlApi + "CobranzaManual";

            parameters = {
                opcion: 4,
                filtro: ""
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

        Result.get_cobranza = function (obj) {

            var q = $q.defer();
            var url = urlApi + "CobranzaManual";
            var parametros = obj.idAnexo + "|" + obj.idZonaVentas + "|" + obj.idVendedor + "|" + obj.fechaIni + "|" + obj.fechaFin

            parameters = {
                opcion: 1,
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


        Result.add_cobranza = function (obj) {

            var q = $q.defer();
            var url = urlApi + "CobranzaManual/agregar";

            $http({
                method: 'POST',
                url: url,
                params: obj
            }).success(function (result) {
                q.resolve(result);
            }).error(function (err) {
                q.reject(err);
            })
            return q.promise;
        }

        Result.update_cobranza = function (obj) {

            var q = $q.defer();
            var url = urlApi + "CobranzaManual/actualizar";

            $http({
                method: 'POST',
                url: url,
                params: obj
            }).success(function (result) {
                q.resolve(result);
            }).error(function (err) {
                q.reject(err);
            })
            return q.promise;
        }

        Result.anular_cobranza = function (id) {
            let url = urlApi + 'CobranzaManual/' + id;
            var q = $q.defer();
            $http.delete(url)
                .success(function (res) {
                    q.resolve(res);
                })
                .error(function (err) {
                    q.reject(err);
                })
            return q.promise;
        }

        //Result.anular_documento = function (obj) {
        //    var q = $q.defer();
        //    var url = urlApi + "documentoFactura/anular";

        //    $http({
        //        method: 'POST',
        //        url: url,
        //        params: obj
        //    }).success(function (result) {
        //        q.resolve(result);
        //    }).error(function (err) {
        //        q.reject(err);
        //    })
        //    return q.promise;
        //}

        Result.anular_documento = function (obj) {
            let url = urlApi + 'documentoFactura/anular'
            var q = $q.defer();
            $http.post(url, obj)
                .success(function (res) {
                    q.resolve(res);
                })
                .error(function (err) {
                    q.reject(err);
                })
            return q.promise;
        }

        Result.ValidacionGeneral = function (objeto_parametros) {
            if (objeto_parametros.id_Anexo == 0) {
                auxiliarServices.NotificationMessage('Sistemas', 'Seleccione un anexo', 'error', '#ff6849', 1500);
                return false;
            }
            else if (objeto_parametros.id_ZonaVta == 0) {
                auxiliarServices.NotificationMessage('Sistemas', 'Seleccione una Zona de Venta', 'error', '#ff6849', 1500);
                return false;
            }
            else if (objeto_parametros.id_Almacen == 0) {
                auxiliarServices.NotificationMessage('Sistemas', 'Seleccione un Almacen', 'error', '#ff6849', 1500);
                return false;
            }
            else if (objeto_parametros.id_cliente == 0) {
                auxiliarServices.NotificationMessage('Sistemas', 'Ingrese un Cliente', 'error', '#ff6849', 1500);
                return false;
            }
            else if (objeto_parametros.nro_Serie == '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Ingrese una serie', 'error', '#ff6849', 1500);
                return false;
            }
            else if (objeto_parametros.numero == '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Ingrese un numero', 'error', '#ff6849', 1500);
                return false;
            }
        }

        Result.set_anularNumero = function ({ id_ZonaVta, fechaIni, fechaFin, serie, numero, usuario_creacion}) {
            let url = urlApi + 'Cancelacion_masiva_doc';
            var parameters;
            var q = $q.defer();

            var parametros = id_ZonaVta + '|' + fechaIni + '|' + fechaFin + '|' + serie + '|' + numero + '|' + usuario_creacion;
            console.log(parametros)

            parameters = {
                opcion: 13,
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