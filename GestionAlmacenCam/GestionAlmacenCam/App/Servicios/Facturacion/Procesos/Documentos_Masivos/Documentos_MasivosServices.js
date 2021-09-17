angular.module('appGestion.Documentos_MasivosServices', [ ])
.factory('Documentos_MasivosServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

        var Result = {};

        Result.validate = function (params) {
            if (params.puntoventa == 0 || params.puntoventa == '0' || params.puntoventa == null || params.puntoventa == '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Punto de Venta', 'error', '#ff6849', 1500);
                return false;
            }
            else if (params.vendedor == 0 || params.vendedor == '0' || params.vendedor == null || params.vendedor == '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Vendedor', 'error', '#ff6849', 1500);
                return false;
            }
            else if (params.fecha == '' || params.fecha == null) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Fecha', 'error', '#ff6849', 1500);
                return false;
            }
    }

    Result.validate_II = function (params) {
        if (params.id_ZonaVta == 0 || params.id_ZonaVta == '0' || params.id_ZonaVta == null || params.id_ZonaVta == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Zona de Venta', 'error', '#ff6849', 1500);
            return false;
        }
        else if (params.id_almacen == 0 || params.id_almacen == '0' || params.id_almacen == null || params.id_almacen == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacen', 'error', '#ff6849', 1500);
            return false;
        }
        else if (params.id_transportista == 0 || params.id_transportista == '0' || params.id_transportista == null || params.id_transportista == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Transportista', 'error', '#ff6849', 1500);
            return false;
        }
        else if (params.fecha == '' || params.fecha == null) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Fecha', 'error', '#ff6849', 1500);
            return false;
        }
    }

        Result.validateImpresion = function (params) {
            if (params.puntoventa == 0 || params.puntoventa == '0' || params.puntoventa == null || params.puntoventa == '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Punto de Venta', 'error', '#ff6849', 1500);
                return false;
            }
            else if (params.vendedor == 0 || params.vendedor == '0' || params.vendedor == null || params.vendedor == '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Vendedor', 'error', '#ff6849', 1500);
                return false;
            }
            else if (params.fecha == '' || params.fecha == null) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Fecha Venta', 'error', '#ff6849', 1500);
                return false;
            }
            else if (params.fecha_Factura == '' || params.fecha_Factura == null) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Fecha de Facturacion', 'error', '#ff6849', 1500);
                return false;
            }
        }

        Result.Generar_Documento = function (opcion, obj) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
            var parametros = obj.puntoventa + '|' + obj.estado + '|' + obj.vendedor + '|' + obj.documVenta + '|' + obj.fecha;

            parameters = {
                opcion: opcion,
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
            })
            return q.promise;
        }

        Result.ImprimirDocumentos = function (opcion, obj) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
            var parametros = obj.puntoventa + '|' + obj.estado + '|' + obj.vendedor + '|' + obj.documVenta + '|' + obj.fecha_Factura;

            parameters = {
                opcion: opcion,
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
            })
            return q.promise;
        }

        Result.GenerarDocumentosVentas = function (obj, id_tipoDoc, serie, cantidad, correlativo_ini, fechaFactura) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
            var parametros = obj.puntoventa + '|' + obj.vendedor + '|' + obj.fecha + '|' + obj.fecha_Factura + '|' + obj.usuario + '|' + id_tipoDoc + '|' + serie + '|' + cantidad + '|' + correlativo_ini;

            parameters = {
                opcion: 4,
                filtro: parametros
            };

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

        Result.ImprimirDocumentos_individual = function (nrodocumento, tipoDoc) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
            var parametros = nrodocumento + '|' + tipoDoc;

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
            })
            return q.promise;
    }

    Result.ImprimirDocumentos_individual_new = function (nrodocumento, tipoDoc) {

        let url = urlApi + 'GeneracionMasiva_Documentos'
        var parameters;
        var q = $q.defer();
        var parametros = nrodocumento + '|' + tipoDoc;

        console.log('impresion ' + nrodocumento)

        parameters = {
            opcion: 21,
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
        })
        return q.promise;
    }


        Result.ImprimirDocumentos_individual_notas = function (nrodocumento, tipoDoc, idfacturas) {

        let url = urlApi + 'GeneracionMasiva_Documentos'
        var parameters;
        var q = $q.defer();
        var parametros = nrodocumento + '|' + tipoDoc + '|' + idfacturas;

        parameters = {
            opcion: 15,
            filtro: parametros
        };

        console.log(parameters);

        $http({
            method: 'GET',
            url: url,
            params: parameters
        }).success(function (result) {
            console.log(result);
            q.resolve(result);
            }).error(function (err) {
                console.log(err);
            q.reject(err);
        })
        return q.promise;
    }

        Result.get_Relacion_Pedidos = function (obj, obj_filtro) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
            var parametros = obj_filtro.id_ZonaVta + '|' + obj_filtro.id_almacen + '|' + obj_filtro.vendedor + '|' + obj.fecha_emision + '|' + obj.id_TipoDocumento + '|' + obj_filtro.id_Anexos + '|' + obj_filtro.id_transportista;

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
            })
            return q.promise;
        }

    Result.get_Relacion_Pedidos_Detalle = function (id_Pedido_Cab) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
        var parametros = id_Pedido_Cab;

        console.log(id_Pedido_Cab)

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
            })
            return q.promise;
        }

    Result.update_Pedido_Detalle = function (id_pedidoDet, precio, id_Pedido_Cab) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
        var parametros = id_pedidoDet + '|' + precio + '|' + id_Pedido_Cab;

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
            })
            return q.promise;
        }

        Result.set_Pedido_Flag_GeneraGuia = function (opcion, Numero_Pedido) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
            var parametros = opcion + '|' + Numero_Pedido;

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
            })
            return q.promise;
        }

    Result.set_Pedido_Flag_ImprimePedido = function (opcion, id_Pedido_Cab) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
        var parametros = opcion + '|' + id_Pedido_Cab;

            parameters = {
                opcion: 10,
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
            })
            return q.promise;
    }

        Result.ImprimirDocumentos_Masivo_II = function (id_usuario, tipoDoc) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
            var parametros = id_usuario + '|' + tipoDoc;

            parameters = {
                opcion: 19,
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
            })
            return q.promise;
        }


        Result.ImprimirDocumentos_Masivo = function (opcion, Numero_Pedido) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
            var parametros = opcion + '|' + Numero_Pedido;

            parameters = {
                opcion: 11,
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
            })
            return q.promise;
        }
        
        Result.Generar_Documentos_Electronicos = function (tipoDoc, idUsuario) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
            var parametros = tipoDoc + '|' + idUsuario;

            parameters = {
                opcion: 12,
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
            })
            return q.promise;
        }

        Result.Generar_Documentos_Electronicos_Individual = function (tipoDoc, nroDocumento) {
   
            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
            var parametros = tipoDoc + '|' + nroDocumento;

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
            })
            return q.promise;
    }


    Result.Generar_Documentos_Electronicos_Individual_notas = function (tipoDoc, nroDocumento, id_cab_Referencia) {

        let url = urlApi + 'GeneracionMasiva_Documentos'
        var parameters;
        var q = $q.defer();
        var parametros = tipoDoc + '|' + nroDocumento + '|' + id_cab_Referencia;

        parameters = {
            opcion: 16,
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
        })
        return q.promise;
    }

    Result.GenerarArchivo_Json = function (Json_formato, nombreDoc, idCab, flag_anulacion) {
            //let url = urlApi + 'GeneracionMasiva_Documentos?nombreArchivo=' + nombreDoc + '&idCab=' + idCab;
            let url = urlApi + 'GeneracionMasiva_Documentos?nombreArchivo=' + nombreDoc + '&idCab=' + idCab + '&flagAnulacion=' + flag_anulacion;
            var q = $q.defer();
             
            $http.post(url, Json_formato)
            .success(function (res) {
                q.resolve(res);
            })
            .error(function (err) {
                q.reject(err);
            });
            return q.promise;
        };
    
    Result.Generar_Documentos_Electronicos_Individual_Anulacion = function (tipoDoc, nroDocumento) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
            var parametros = tipoDoc + '|' + nroDocumento;

            parameters = {
                opcion: 14,
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
            })
            return q.promise;
    }

    Result.Listando_Documento_Movil = function (obj) {

        let url = urlApi + 'GeneracionMasiva_Documentos'
        var parameters;
        var q = $q.defer();
        var parametros = obj.id_ZonaVta + '|' + obj.id_almacen + '|' + obj.vendedor + '|' + obj.fecha + '|' + obj.id_Anexos + '|' + obj.id_transportista;

        parameters = {
            opcion: 17,
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
        })
        return q.promise;
    }
       
    Result.GenerarDocumentosVentas_II = function (obj_filtro, id_TipoDocumento, usuario) {

        let url = urlApi + 'GeneracionMasiva_Documentos'
        var parameters;
        var q = $q.defer();
        var parametros = obj_filtro.id_ZonaVta + '|' + obj_filtro.id_almacen + '|' + obj_filtro.vendedor + '|' + obj_filtro.fecha + '|' + id_TipoDocumento + '|' + usuario + '|' + obj_filtro.fecha_Factura + '|' + obj_filtro.serie + '-' + obj_filtro.num_doc + '|' + obj_filtro.numero_pedido + '|' + obj_filtro.id_Anexos + '|' + obj_filtro.id_transportista;

        console.log(parametros)
 
        parameters = {
            opcion: 18,
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
        })
        return q.promise;
    }


    Result.Obtner_facturas_Generadas_Masivos = function (idUsuario) {

        let url = urlApi + 'GeneracionMasiva_Documentos'
        var parameters;
        var q = $q.defer();
        var parametros = idUsuario;

        parameters = {
            opcion: 20,
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
        })
        return q.promise;
    }


        ////------------------------------------------------------------
    ////---- NUEVA VERSION DE FACTURACION ELECTRONICA CON NUBE-FACT
    ////-----------------------------------------------------------/////
      

        Result.GenerarArchivo_Json_new = function (TipoDoc, nroDocumento, idcab) { 
            let url = urlApi + 'Comprobantes_Electronicos?TipoDoc=' + TipoDoc + '&nroDocumento=' + nroDocumento + '&idcab=' + idcab 
            var q = $q.defer();

            $http.post(url)
                .success(function (res) {
                    q.resolve(res);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
    };

    Result.generarFacturacion_boletasFacturas = function (TipoDoc, nroDocumento) {
            let url = urlApi + 'Pedidos'
            var parameters;
            var q = $q.defer();
            var parametros = TipoDoc + '|' + nroDocumento ;

            parameters = {
                opcion: 32,
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
            })
            return q.promise;
    }

    Result.generarFacturacion_notasCreditoDebito = function (TipoDoc, nroDocumento, id_Factura_Cab_Ref) {
        let url = urlApi + 'Pedidos'
        var parameters;
        var q = $q.defer();
        var parametros = TipoDoc + '|' + nroDocumento + '|' + id_Factura_Cab_Ref;

        parameters = {
            opcion: 33,
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
        })
        return q.promise;
    }

    Result.generarFacturacion_boletasFacturas_masivas = function (idUsuario) {

        let url = urlApi + 'Pedidos'
        var parameters;
        var q = $q.defer();
        var parametros = idUsuario  

        parameters = {
            opcion: 34,
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
        })
        return q.promise;
    }


        ////------------------------------------------------------------
    ////---- FIN DE NUEVA VERSION DE FACTURACION ELECTRONICA CON NUBE-FACT
    ////------------------------------------------------------------------/////

    Result.get_zonasUsuario = function (idUsuario) {

        let url = urlApi + 'GeneracionMasiva_Documentos'
        var parameters;
        var q = $q.defer();

        var parametros = idUsuario;
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




             
        return Result;
    });