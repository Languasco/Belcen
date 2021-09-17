angular.module('appGestion.NotaCreditoDebitoServices', [])
    .factory('NotaCreditoDebitoServices', function (urlApi, $http, $q, $timeout, auxiliarServices) {

    var Result = {};

        Result.get_Facturas = function (obj_data) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = obj_data.id_ZonaVta + '|' + obj_data.id_almacen + '|' + obj_data.fecha_ini_aux + '|' + obj_data.fecha_fin_aux + '|' + obj_data.nroDoc + '|' + obj_data.id_Anexos + '|' + obj_data.id_transportista;
            parameters = {
                opcion: 17,
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

        Result.validate_filtros = function (params) {
            if (params.fecha_ini === 0 || params.fecha_ini === '0' || params.fecha_ini === null || params.fecha_ini === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Fecha Inicial', 'error', '#ff6849', 1500);
                return false;
            }
            else if (params.fecha_fin === 0 || params.fecha_fin === '0' || params.fecha_fin === null || params.fecha_fin === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Fecha Final', 'error', '#ff6849', 1500);
                return false;
            }
        };
    
        Result.get_Search_Cliente = function (nro_cliente) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = nro_cliente;
            parameters = {
                opcion: 2,
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
    
        Result.validate_Cabecera = function (params) {

              if (params.id_TipoDocumento_notas === 0 || params.id_TipoDocumento_notas === '0' || params.id_TipoDocumento_notas === null || params.id_TipoDocumento_notas === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Documento de la Nota de Crédito-Débito', 'error', '#ff6849', 1500);
                return false;
              }
              else if (params.serie_Notas === 0 || params.serie_Notas === '0' || params.tipoOperacionSunat === null || params.serie_Notas === '') {
                  auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la serie', 'error', '#ff6849', 1500);
                  return false;
              }
              else if (params.num_doc_Notas === 0 || params.num_doc_Notas === '0' || params.num_doc_Notas === null || params.num_doc_Notas === '') {
                  auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nro de Documento', 'error', '#ff6849', 1500);
                  return false;
              }
              else if (params.fechaEmision_Factura_Cab_Notas === 0 || params.fechaEmision_Factura_Cab_Notas === '0' || params.fechaEmision_Factura_Cab_Notas === null || params.fechaEmision_Factura_Cab_Notas === '') {
                  auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese o seleccione la fecha del documento', 'error', '#ff6849', 1500);
                  return false;
              }
              else if (params.tipoOperacionSunat === 0 || params.tipoOperacionSunat === '0' || params.tipoOperacionSunat === null || params.tipoOperacionSunat === '') {
                  auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el tipo de Operación', 'error', '#ff6849', 1500);
                  return false;
              }

        };

        Result.save_Pedido = function (params) {
            let url = urlApi + 'Pedidos';
            var q = $q.defer();
            $http.post(url, params)
                .success(function (res) {
                    q.resolve(res);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
        };

        Result.update_Pedido = function (object) {

            let url = urlApi + "Pedidos/" + object.id_Pedido_Cab;
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

        Result.update_Pedido = function (object) {

            let url = urlApi + "Pedidos/" + object.id_Pedido_Cab;
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

        Result.get_Search_Producto = function (id_local, id_Almacen, cod_producto) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_local + '|' + id_Almacen + '|' + cod_producto;
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
    
        Result.validate_detalle = function (params) {
            if (params.id_Producto === 0 || params.id_Producto === '0' || params.id_Producto === null || params.id_Producto === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo del Producto', 'error', '#ff6849', 1500);
                $('#txt_cod_producto').focus().select();
                return false;
            }
            else if (params.codigo1_Producto === 0 || params.codigo1_Producto === '0' || params.codigo1_Producto === null || params.codigo1_Producto === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo del Producto', 'error', '#ff6849', 1500);
                $('#txt_cod_producto').focus().select();
                return false;
            }


            if (isNaN(params.cantidad_Factura_Det) === true) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese un Valor correcto para la Cantidad, verifique', 'error', '#ff6849', 1500);
            } else {
                //if (params.cantidad_Factura_Det === 0 || params.cantidad_Factura_Det === '0' || params.cantidad_Factura_Det === null || params.cantidad_Factura_Det === '') {
                //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese La cantidad', 'error', '#ff6849', 1500);
                //    return false;
                //} else {
                //    if (params.cantidad_Factura_Det < 0) {
                //        auxiliarServices.NotificationMessage('Sistemas', 'La cantidad debe de ser mayor a Cero {0} ', 'error', '#ff6849', 1500);
                //        return false;
                //    }
                //}
            }

            if (isNaN(params.precioVenta_Factura_Det) === true) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese un Valor correcto, verifique', 'error', '#ff6849', 1500);
            } else {
                if (params.precioVenta_Factura_Det === 0 || params.precioVenta_Factura_Det === '0' || params.precioVenta_Factura_Det === null || params.precioVenta_Factura_Det === '') {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Precio', 'error', '#ff6849', 1500);
                    return false;
                } else {
                    if (params.precioVenta_Factura_Det < 0) {
                        auxiliarServices.NotificationMessage('Sistemas', 'El precio debe de ser mayor a Cero {0} ', 'error', '#ff6849', 1500);
                        return false;
                    }
                }
            }
        };

        Result.save_Pedido_Detalle = function (params) {
            let url = urlApi + 'TblFac_Pedidos_Det';
            var q = $q.defer();
            $http.post(url, params)
                .success(function (res) {
                    q.resolve(res);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
        };

        Result.get_Facturas_detalle = function (id_Factura_Cab) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_Factura_Cab;
            parameters = {
                opcion: 18,
                filtro: parametros
            };
            console.log('parametros detalle : ' , parameters);
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

        Result.get_NotasCredito_detalle = function (id_Factura_Cab) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_Factura_Cab;
            parameters = {
                opcion: 26,
                filtro: parametros
            };
            console.log('parametros detalle : ', parameters);
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


        Result.set_Delete_Pedido_Detalle = function (id_PedidoDet, nroPedido) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_PedidoDet + '|' + nroPedido;
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

        Result.update_Pedido_Detalle = function (object) {

            let url = urlApi + "TblFac_Pedidos_Det/" + object.id_Pedido_Det;
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

        Result.get_Ayuda_Buscar_Cliente = function (Consulta) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = Consulta;
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

        Result.get_Ayuda_Buscar_Producto = function (id_local,id_Almacen, Consulta) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_local + '|' + id_Almacen + '|' + Consulta;
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

        Result.set_GenerandoFacturacion = function (numeroPedido, usuario) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = numeroPedido + '|' + usuario;
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
            
        Result.set_Generando_Pagos = function (obj) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = obj.nroPedido + '|' + obj.codRef + '|' + obj.totalpago + '|' + obj.pagoCueta + '|' + obj.id_formaPago + '|' + obj.id_banco + '|' + obj.fechaOperacion + '|' + obj.nroOperacion;
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

        Result.get_Distrito = function (id_provincia) {
           
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();
            var parametros = id_provincia;
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
            });
            return q.promise;
        };

        Result.get_Provincia = function () {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = '';
            parameters = {
                opcion: 15,
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
        
        Result.get_ValidandoExistencia_Cliente = function (nroDoc) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = nroDoc;
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
            });
            return q.promise;
        };
    
        Result.set_GuardandoCliente = function (params) {
            let url = urlApi + 'TblCliente';
            var q = $q.defer();
            $http.post(url, params)
                .success(function (res) {
                    q.resolve(res);
                })
                .error(function (err) {
                    q.reject(err);
                });
            return q.promise;
        }; 
        
        Result.validar_NroDocumento_Pedido = function (nroDocumento, tipoDoc) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = nroDocumento;
            parameters = {
                opcion: 12,
                filtro: parametros + "|" + tipoDoc
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

        Result.set_rechazar_Pedido = function (numeroDoc, tipoDoc, usuario) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = numeroDoc + '|' + tipoDoc + '|' + usuario;
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


        Result.generar_documento_nota = function (params) {       
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();
            $http({
                method: 'GET',
                url: url,
                params: params
            }).success(function (result) {
                q.resolve(result);
            }).error(function (err) {
                q.reject(err);
            });
            return q.promise;
        };

        Result.get_SaldoCuenta_Pedido = function (id_PedidoCab) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_PedidoCab;
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
            });
            return q.promise;
        };

        Result.get_TipoOperacionSunat = function (id_tipoDoc) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_tipoDoc;
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
            });
            return q.promise;
        };


        Result.set_AlmacenandoDetalle_notas = function (List_data) {
            let url = urlApi + 'Pedidos/set_DetalleNotas';
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

        Result.get_Documentos_NotasCredito = function (obj_data) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = obj_data.id_ZonaVta + '|' + obj_data.id_almacen + '|' + obj_data.fecha_ini_aux + '|' + obj_data.fecha_fin_aux + '|' + obj_data.nroDoc + '|' + obj_data.id_Anexos + '|' + obj_data.id_transportista;
            parameters = {
                opcion: 23,
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
            });
            return q.promise;
        };

        Result.get_NumeracionAutomatica = function (id_anexo, id_tipoDoc, id_tipoDoc_Ref) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_anexo + '|' + id_tipoDoc + '|' + id_tipoDoc_Ref;
            parameters = {
                opcion: 24,
                filtro: parametros
            };
            console.log('get_NumeracionAutomatica')
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


        Result.get_resumenProductos_excel = function (obj_data) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = obj_data.id_ZonaVta + '|' + obj_data.id_almacen + '|' + obj_data.fecha_ini_aux + '|' + obj_data.fecha_fin_aux + '|' + obj_data.nroDoc + '|' + obj_data.id_Anexos + '|' + obj_data.id_transportista;
            parameters = {
                opcion: 35,
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

 


    return Result;
});