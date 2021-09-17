angular.module('appGestion.ArqueoCajaServices', [])
    .factory('ArqueoCajaServices', function ($http, $q, $upload, urlApi) {
        var Result = {};

        Result.get_Zonas_anexos = function (id_Anexos, idUsuario ) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexos + '|' +  idUsuario;
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

        Result.get_CentroCosto_anexos = function (idAnexos, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = idAnexos + '|' + idUsuario;
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

        Result.get_estados = function (idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros =  idUsuario;
            parameters = {
                opcion: 25,
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

        Result.get_Proveedores = function (idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros =  idUsuario;
            parameters = {
                opcion: 10,
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

        Result.get_personalesArqueo = function ( idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros =  idUsuario;
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

        Result.get_ingresosFacturas = function (id_local, id_almacen, id_estado, fecha_ini, fecha_fin) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_local + '|' + id_almacen + '|' + id_estado + '|' + fecha_ini + '|' + fecha_fin;
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
               
        Result.save_arqueoCaja_Cab = function (params) {
            let url = urlApi + 'Arqueocaja/Posttbl_ArqueoCaja_Cab'
            var q = $q.defer();
            $http.post(url, params)
            .success(function (res) {
                q.resolve(res);
            })
            .error(function (err) {
                q.reject(err);
            })
            return q.promise;
        }

        Result.update_arqueoCaja_Cab = function (params) {             
            let url = urlApi + "Arqueocaja/Puttbl_ArqueoCaja_Cab/?id=" + params.id_ArqueoCaja;
            var q = $q.defer();
            $http.put(url, params)
            .success(function (result) {
                q.resolve(result);
            })
            .error(function (err) {
                q.reject(err);
            })
            return q.promise;
        }

        Result.get_billetesMonedasArqueo = function (idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = idUsuario;
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

        Result.save_billetesMonedasArqueo = function (id_ArqueoCaja, id_Tipo, id_BilleteMoneda, cantidad_Billete, valor_Billete, total_Billete , idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_ArqueoCaja + '|' + id_Tipo + '|' + id_BilleteMoneda + '|' + cantidad_Billete + '|' + valor_Billete + '|' + total_Billete + '|' + idUsuario;
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

        Result.get_informacionVentas_boletasFacturas = function (id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexo + '|' + id_ZonaVta + '|' + id_CC + '|' + fechaArqueoCaja + '|' + idUsuario;
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

        Result.set_almacenar_informacionVentas_boletasFacturas = function (id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja, id_ArqueoCaja , idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexo + '|' + id_ZonaVta + '|' + id_CC + '|' + fechaArqueoCaja + '|' + id_ArqueoCaja  + '|' + idUsuario;
            parameters = {
                opcion: 7,
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

        Result.get_depositos = function (id_ArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_ArqueoCaja  +'|'+  idUsuario;
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

        Result.validar_nroOperacion = function (id_banco, nroOperacion, fechaOperacion) {
            let url = urlApi + 'tblArqueoCaja_Cab';
            var parameters;
            var q = $q.defer();

            var parametros = id_banco + '|' + nroOperacion + '|' + fechaOperacion;

            console.log('validar_nroOperacion')
            console.log(parametros)

            parameters = {
                opcion: 9,
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

        Result.save_depositosArqueo = function (params) {
            let url = urlApi + 'tblArqueoCaja_Depositos/Posttbl_ArqueoCaja_Depositos'
            var q = $q.defer();
            $http.post(url, params)
                .success(function (res) {
                    q.resolve(res);
                })
                .error(function (err) {
                    q.reject(err);
                })
            return q.promise;
        }

        Result.update_depositosArqueo = function (object) {
            let url = urlApi + "tblArqueoCaja_Depositos/Puttbl_ArqueoCaja_Depositos?id=" + object.id_ArqueoCaja_Deposito
            var q = $q.defer();
            $http.put(url, object)
                .success(function (result) {
                    q.resolve(result);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
        };

        Result.uploadFile_imageComprobante = function (files, id_ArqueoCaja_Deposito, usuario ) {
            var uploadUrl = urlApi + 'tblArqueoCaja_Depositos/UploadImageVoucherDeposito';
            var q = $q.defer();
            $upload.upload({
                url: uploadUrl,
                method: "POST",
                params: {
                    idArqueoCaja_Deposito: id_ArqueoCaja_Deposito,
                    idUsuario: usuario,
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

        Result.validar_nroOperacionPagos = function (id_banco, nroOperacion, fechaOperacion) {
            let url = urlApi + 'tblArqueoCaja_Cab';
            var parameters;
            var q = $q.defer();

            var parametros = id_banco + '|' + nroOperacion + '|' + fechaOperacion;

            console.log('validar_nroOperacion')
            console.log(parametros)

            parameters = {
                opcion: 9,
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

        Result.save_pagosArqueo = function (params) {

            let url = urlApi + 'tblArqueoCaja_PagoProveedor/Posttbl_ArqueoCaja_PagoProveedor'
            var q = $q.defer();
            $http.post(url, params)
                .success(function (res) {
                    q.resolve(res);
                })
                .error(function (err) {
                    q.reject(err);
                })
            return q.promise;
        }

        Result.update_pagosArqueo = function (object) {

            let url = urlApi + "tbl_ArqueoCaja_PagoProveedor/Puttbl_ArqueoCaja_PagoProveedor?id=" + object.id_ArqueoCaja_Egresos
            var q = $q.defer();
            $http.put(url, object)
                .success(function (result) {
                    q.resolve(result);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
        };

        Result.get_pagos = function (id_ArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_ArqueoCaja + '|' + idUsuario;
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

        Result.uploadFile_imageComprobantePagos = function (files, id_ArqueoCajaEgresos, usuario) {
            var uploadUrl = urlApi + 'tblArqueoCaja_PagoProveedor/UploadImageVoucherPago';
            var q = $q.defer();
            $upload.upload({
                url: uploadUrl,
                method: "POST",
                params: {
                    id_ArqueoCajaEgresos: id_ArqueoCajaEgresos,
                    idUsuario: usuario,
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

        Result.get_tiposEgresos = function () {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = ''
            parameters = {
                opcion: 13,
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

        Result.get_tiposDocumentos = function () {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = ''
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

        Result.get_consultaRuc= function (nroRuc,idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = nroRuc + '|' + idUsuario
            parameters = {
                opcion: 15,
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

        Result.save_egresosArqueo = function (params) {

            let url = urlApi + 'tbl_ArqueoCaja_Egresos/Posttbl_ArqueoCaja_Egresos'
            var q = $q.defer();
            $http.post(url, params)
                .success(function (res) {
                    q.resolve(res);
                })
                .error(function (err) {
                    q.reject(err);
                })
            return q.promise;
        }

        Result.update_egresosArqueo = function (object) {

            let url = urlApi + "tbl_ArqueoCaja_Egresos/Puttbl_ArqueoCaja_Egresos?id=" + object.id_ArqueoCaja_Egresos
            var q = $q.defer();
            $http.put(url, object)
                .success(function (result) {
                    q.resolve(result);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
        };

        Result.uploadFile_imageComprobanteEgresos = function (files, id_ArqueoCajaEgresos, usuario) {

           var uploadUrl = urlApi + 'tbl_ArqueoCaja_Egresos/UploadImageVoucherEgresos';
            var q = $q.defer();
            $upload.upload({
                url: uploadUrl,
                method: "POST",
                params: {
                    id_ArqueoCaja_Egresos: id_ArqueoCajaEgresos,
                    idUsuario: usuario,
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

        Result.get_egresos = function (id_ArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_ArqueoCaja + '|' + idUsuario;
            parameters = {
                opcion: 16,
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

        Result.get_informacionVentas_cobranzasDevoluciones = function (id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexo + '|' + id_ZonaVta + '|' + id_CC + '|' + fechaArqueoCaja + '|' + idUsuario;
            parameters = {
                opcion: 19,
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

        Result.set_almacenar_informacionVentas_cobranzasDevoluciones = function (id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja, id_ArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexo + '|' + id_ZonaVta + '|' + id_CC + '|' + fechaArqueoCaja + '|' + id_ArqueoCaja + '|' + idUsuario;
            parameters = {
                opcion: 20,
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

        Result.set_cerrar_arqueoCajaCab = function (id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja, id_ArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexo + '|' + id_ZonaVta + '|' + id_CC + '|' + fechaArqueoCaja + '|' + id_ArqueoCaja + '|' + idUsuario;
            parameters = {
                opcion: 21,
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

        Result.get_excelArqueoCaja = function (id_ArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_ArqueoCaja + '|' + idUsuario;
            parameters = {
                opcion: 22,
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

        Result.get_informacionVentas_Devoluciones = function (id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexo + '|' + id_ZonaVta + '|' + id_CC + '|' + fechaArqueoCaja + '|' + idUsuario;
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

        Result.set_almacenar_informacionVentas_Devoluciones = function (id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja, id_ArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexo + '|' + id_ZonaVta + '|' + id_CC + '|' + fechaArqueoCaja + '|' + id_ArqueoCaja + '|' + idUsuario;
            parameters = {
                opcion: 24,
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

        Result.get_listados_arqueoCajaCab = function (id_Anexo, id_ZonaVta, id_CC, fechaIni, fechaFin, id_estado, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexo + '|' + id_ZonaVta + '|' + id_CC + '|' + fechaIni + '|' + fechaFin + '|' + id_estado + '|' + idUsuario;
            parameters = {
                opcion: 26,
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

        Result.get_arqueoCajaCab_edicion = function (id_ArqueoCaja , idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_ArqueoCaja + '|' +   idUsuario;
            parameters = {
                opcion: 27,
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

        Result.get_arqueoCaja_monedasBilletes_edicion = function (id_ArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_ArqueoCaja + '|' + idUsuario;
            parameters = {
                opcion: 28,
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

        Result.get_arqueoCaja_ventas_edicion = function (id_ArqueoCaja , idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_ArqueoCaja + '|' + idUsuario;
            parameters = {
                opcion: 29,
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

        Result.get_arqueoCaja_cobranzas_edicion = function (id_ArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_ArqueoCaja + '|' + idUsuario;
            parameters = {
                opcion: 30,
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

        Result.get_arqueoCaja_devoluciones_edicion = function (id_ArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_ArqueoCaja + '|' + idUsuario;
            parameters = {
                opcion: 31,
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

        Result.set_arqueoCaja_anular = function (id_ArqueoCaja, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_ArqueoCaja + '|' + idUsuario;
            parameters = {
                opcion: 32,
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
})