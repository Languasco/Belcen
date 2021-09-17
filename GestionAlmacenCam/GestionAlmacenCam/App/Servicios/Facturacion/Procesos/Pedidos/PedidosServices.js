angular.module('appGestion.PedidosServices', [])
    .factory('PedidosServices', function (urlApi, $http, $q, $upload, auxiliarServices) {

    var Result = {};

        Result.get_Pedidos = function (obj_data) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = obj_data.id_ZonaVta + '|' + obj_data.id_almacen + '|' + obj_data.fecha_ini_aux + '|' + obj_data.fecha_fin_aux + '|' + obj_data.id_Vendedor + '|' + obj_data.id_estado + '|' + obj_data.id_Anexos;
            parameters = {
                opcion: 1,
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

        Result.get_Pedidos_Aprobacion = function (obj_data) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = obj_data.id_local + '|' + obj_data.id_almacen + '|' + obj_data.fecha_ini_aux + '|' + obj_data.fecha_fin_aux + '|' + obj_data.id_Vendedor + '|' + obj_data.id_estado;
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
 
            if (params.id_ZonaVta === 0 || params.id_ZonaVta === '0' || params.id_ZonaVta === null || params.id_ZonaVta === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Zona', 'error', '#ff6849', 1500);
                return false;
            }
            else if (params.id_Almacen === 0 || params.id_Almacen === '0' || params.id_Almacen === null || params.id_Almacen === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacen', 'error', '#ff6849', 1500);
                return false;
            }
            else if (params.nrodoc_cliente === 0 || params.nrodoc_cliente === '0' || params.nrodoc_cliente === null || params.nrodoc_cliente === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el nro de Documento del Cliente', 'error', '#ff6849', 1500);
                return false;
            }
            else if (params.id_cliente === 0 || params.id_cliente === '0' || params.id_cliente === null || params.id_cliente === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el nro de Documento del Cliente', 'error', '#ff6849', 1500);
                return false;
            }
            else if (params.id_PersonalVendedor === 0 || params.id_PersonalVendedor === '0' || params.id_PersonalVendedor === null || params.id_PersonalVendedor === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Vendedor', 'error', '#ff6849', 1500);
                return false;
            }
            //else if (params.id_CanalNegocio === 0 || params.id_CanalNegocio === '0' || params.id_CanalNegocio === null || params.id_CanalNegocio === '') {
            //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Canal de Negocio', 'error', '#ff6849', 1500);
            //    return false;
            //}
            else if (params.id_FormaPago === 0 || params.id_FormaPago === '0' || params.id_FormaPago === null || params.id_FormaPago === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Condicion de Facturacion', 'error', '#ff6849', 1500);
                return false;
            }
            else if (params.id_TipoDocumento === 0 || params.id_TipoDocumento === '0' || params.id_TipoDocumento === null || params.id_TipoDocumento === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Documento', 'error', '#ff6849', 1500);
                return false;
            }

            if (params.id_TipoDocumento == 1 || params.id_TipoDocumento == 2) {
                if (params.nrodoc_cliente.length == 8 && params.id_TipoDocumento == 1) {
                    auxiliarServices.NotificationMessage('Sistemas', 'El Tipo de documento no coincide con el Nro. documento del Cliente', 'error', '#ff6849', 2500);
                    return false;
                }
                if (params.nrodoc_cliente.length == 11 && params.id_TipoDocumento == 2) {
                    auxiliarServices.NotificationMessage('Sistemas', 'El Tipo de documento no coincide con el Nro. documento del Cliente', 'error', '#ff6849', 2500);
                    return false;
                }
            } 
            else if (params.fechaEmision_Pedido_Cab == 0 || params.fechaEmision_Pedido_Cab == '0' || params.fechaEmision_Pedido_Cab == null || params.fechaEmision_Pedido_Cab == '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha del Documento', 'error', '#ff6849', 1500);
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

            console.log('update_Pedido')
            console.log(object)

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

        Result.get_Search_Producto = function (id_Almacen, cod_producto, id_usuario) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_Almacen + '|' + cod_producto + '|' + id_usuario;
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


        Result.get_Search_Producto_pasaje = function (id_Almacen, cod_producto, id_usuario) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_Almacen + '|' + cod_producto + '|' + id_usuario;
            parameters = {
                opcion: 48,
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



        Result.get_Search_Producto_manual = function (id_Almacen, cod_producto, id_usuario) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_Almacen + '|' + cod_producto + '|' + id_usuario;
            parameters = {
                opcion: 41,
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
            });
            return q.promise;
        };

    
        Result.validate_detalle = function (params) {
            if (params.id_Pedido_Cab == 0 || params.id_Pedido_Cab == '0' || params.id_Pedido_Cab == null || params.id_Pedido_Cab == '') {
                auxiliarServices.NotificationMessage('Sistemas', 'No se cargo el código de la cabecera correctamente, por favor Actualice su página..', 'error', '#ff6849', 1500);
                return false;
            }
            else if (params.id_Producto == 0 || params.id_Producto == '0' || params.id_Producto == null || params.id_Producto == '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo del Producto', 'error', '#ff6849', 1500);
                $('#txt_cod_producto').focus().select();
                return false;
            }
            else if (params.codigo1_Producto === 0 || params.codigo1_Producto === '0' || params.codigo1_Producto === null || params.codigo1_Producto === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo del Producto', 'error', '#ff6849', 1500);
                $('#txt_cod_producto').focus().select();
                return false;
            }


            if (isNaN(params.cantidad_Pedido_Det) === true) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese un Valor correcto para la Cantidad, verifique', 'error', '#ff6849', 1500);
            } else {
                if (params.cantidad_Pedido_Det === 0 || params.cantidad_Pedido_Det === '0' || params.cantidad_Pedido_Det === null || params.cantidad_Pedido_Det === '') {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese La cantidad', 'error', '#ff6849', 1500);
                    return false;
                } else {
                    if (params.cantidad_Pedido_Det < 0) {
                        auxiliarServices.NotificationMessage('Sistemas', 'La cantidad debe de ser mayor a Cero {0} ', 'error', '#ff6849', 1500);
                        return false;
                    }
                }
            }

            if (isNaN(params.precioVenta_Pedido_Det) === true) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese un Valor correcto, verifique', 'error', '#ff6849', 1500);
            } else {
                if (params.precioVenta_Pedido_Det === 0 || params.precioVenta_Pedido_Det === '0' || params.precioVenta_Pedido_Det === null || params.precioVenta_Pedido_Det === '') {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Precio', 'error', '#ff6849', 1500);
                    return false;
                } else {
                    if (params.precioVenta_Pedido_Det < 0) {
                        auxiliarServices.NotificationMessage('Sistemas', 'El precio debe de ser mayor a Cero {0} ', 'error', '#ff6849', 1500);
                        return false;
                    }
                }
            }

            //if (params.stock === 0 || params.stock === '0' || params.stock === null || params.stock === '') {
            //    auxiliarServices.NotificationMessage('Sistemas', 'No hay Stock para este Producto, verifique', 'error', '#ff6849', 1500);
            //    return false;

            //} else {
            //    if (params.stock < 0) {
            //        auxiliarServices.NotificationMessage('Sistemas', 'No hay Stock para este Producto, verifique', 'error', '#ff6849', 1500);
            //        return false;
            //    }
            //}

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

        Result.get_Pedidos_detalle = function (idPedidoCab) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = idPedidoCab;
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

        Result.get_Ayuda_Buscar_Producto = function (id_Almacen, Consulta, id_usuario) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_Almacen + '|' + Consulta + '|' + id_usuario;
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


        Result.get_Ayuda_Buscar_Producto_pasaje = function (id_Almacen, Consulta, id_usuario) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_Almacen + '|' + Consulta + '|' + id_usuario;
            parameters = {
                opcion: 47,
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



        Result.get_Ayuda_Buscar_Producto_Manual = function (id_Almacen, Consulta, id_usuario) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_Almacen + '|' + Consulta + '|' + id_usuario;
            parameters = {
                opcion: 42,
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

        //---- se modifico para Nubefact agrego flag_tipo_facturacion --

        Result.set_GenerandoFacturacion = function (idPedido, usuario, flag_tipo_facturacion) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = idPedido + '|' + usuario + '|' + flag_tipo_facturacion;

            console.log(parametros)

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

            var parametros = obj.id_Pedido_Cab + '|' + obj.codRef + '|' + obj.totalpago + '|' + obj.pagoCueta + '|' + obj.id_formaPago + '|' + obj.id_banco + '|' + obj.fechaOperacion + '|' + obj.nroOperacion;
            parameters = {
                opcion: 9,
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

        Result.get_Provincia = function (id_departamento) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_departamento;
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

        Result.get_departamentos = function () {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = '';
            parameters = {
                opcion: 25,
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


        Result.get_codigo_establecimiento = function () {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = '';
            parameters = {
                opcion: 29,
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
                filtro: nroDocumento + "|" + tipoDoc
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

        Result.set_anular_Pedido = function (id_Pedido_Cab, usuario) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_Pedido_Cab + '|' + usuario;
            parameters = {
                opcion: 37,
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


        Result.set_aprobar_Pedido = function (numeroDoc, tipoDoc, usuario,estado) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = numeroDoc + '|' + tipoDoc + '|' + usuario + '|' + estado;
            parameters = {
                opcion: 28,
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

        Result.validar_NroDocumento_Factura = function (nroDocumento, tipoDoc) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = nroDocumento;
            parameters = {
                opcion: 21,
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


        Result.Actualizar_flag_Exonerada = function (id_Pedido_Cab, exonerada) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_Pedido_Cab + '|' + exonerada;
            parameters = {
                opcion: 30,
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

        Result.Actualizar_flag_tipo_facturacion = function (id_Pedido_Cab, tipoFact) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_Pedido_Cab + '|' + tipoFact;
            parameters = {
                opcion: 31,
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
               
        Result.validar_nroOperacion = function (id_banco, nroOperacion, fechaOperacion) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_banco + '|' + nroOperacion + '|' + fechaOperacion;
            parameters = {
                opcion: 44,
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

        //subiendo la imagen del  voucher

        Result.uploadFile_imageComprobante = function (files, usuario, id_Pedido_Cab, idFacturaCab, idPago ) {
            var uploadUrl = urlApi + 'Pedidos/UploadImageVoucher';
            var q = $q.defer();
            $upload.upload({
                url: uploadUrl,
                method: "POST",
                params: {
                    idPedidoCab: id_Pedido_Cab,
                    idUsuario: usuario,
                    idFacturaCab: idFacturaCab,
                    idPago: idPago
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


        Result.uploadFile_imageComprobante_masivo = function (files, id_Factura_Cab, cod_masivo, idUsuario) {

 

            var uploadUrl = urlApi + 'Pedidos/UploadImageVoucher_II';
            var q = $q.defer();
            $upload.upload({
                url: uploadUrl,
                method: "POST",
                params: {
                    id_Factura_Cab: id_Factura_Cab,
                    cod_masivo: cod_masivo,
                    id_usuario: idUsuario
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

        Result.Imprimir_guiaRemisionSunat = function (nrodocumento, tipoDoc) {

            let url = urlApi + 'GeneracionMasiva_Documentos'
            var parameters;
            var q = $q.defer();
            var parametros = nrodocumento + '|' + tipoDoc;

            console.log('impresion ' + nrodocumento)

            parameters = {
                opcion: 23,
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


        Result.get_unidadMedidasFactor = function (  id_usuario, id_material ) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = id_usuario + '|' + id_material;

            parameters = {
                opcion: 46,
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



        ///-----COMBOS DE FACTURACION -----
        Result.get_anexo_final = function () {
            var q = $q.defer();
            var url = urlApi + "CobranzaReporte";

            parameters = {
                opcion: 1,
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


        Result.get_Zonas_anexos = function (id_Anexos, idUsuario) {

            let url = urlApi + 'tblArqueoCaja_Cab'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexos + '|' + idUsuario;
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



    return Result;
});