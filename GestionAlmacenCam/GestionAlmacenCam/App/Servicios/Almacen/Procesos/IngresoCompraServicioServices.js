angular.module('appGestion.IngresoCompraServicioServices', [])
    .factory('IngresoCompraServicioServices', function ($http, $q, $upload, urlApi) {
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

        Result.get_ingresosFacturas = function (id_tipoOrden, id_anexo, id_almacen, id_estado, fecha_ini, fecha_fin, id_proveedor) {

            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var parameters;
            var q = $q.defer();

            var parametros = id_tipoOrden + '|' + id_anexo + '|' + id_almacen + '|' + id_estado + '|' + fecha_ini + '|' + fecha_fin + '|' + id_proveedor;


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

        Result.uploadFile_imageComprobante = function (files, idGuiaCab, usuario) {
            var uploadUrl = urlApi + 'IngresoFacturas/UploadImageVoucher';
            var q = $q.defer();
            $upload.upload({
                url: uploadUrl,
                method: "POST",
                params: {
                    idGuiaCab: idGuiaCab,
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

        Result.get_unidadMedidaCompraServicio = function () {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = '';
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
               
        Result.save_ingresosFacturas = function (params) {
            let url = urlApi + 'IngresoFacturas/PostTbl_Fac_Facturas_Compras_cab'
            var q = $q.defer();
            console.log(params)

            $http.post(url, params)
            .success(function (res) {
                q.resolve(res);
            })
            .error(function (err) {
                q.reject(err);
            })
            return q.promise;
        }

        Result.update_ingresosFacturas = function (params) {

            console.log(params)

            let url = urlApi + "IngresoFacturas/PutTbl_Fac_Facturas_Compras_cab/?id=" + params.id_GuiaCab;
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


        Result.get_buscarProducto_codigo = function (id_TipoOrden, id_anexos, id_Almacen, codigo_Producto, id_usuario) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_TipoOrden + '|' + id_anexos + '|' + id_Almacen + '|' + codigo_Producto + '|' + id_usuario;
            parameters = {
                opcion: 17,
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


        Result.get_buscarProducto_Modal = function (id_TipoOrden, id_anexos, id_Almacen, filtro_Producto, id_usuario) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_TipoOrden + '|' + id_anexos + '|' + id_Almacen + '|' + filtro_Producto + '|' + id_usuario;
            parameters = {
                opcion: 18,
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


        Result.save_ingresosFacturas_detalle = function (id_GuiaCab, objDetalle, id_TipoOrden, id_usuario) {

            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaCab + '|' + objDetalle.idProducto + '|' + objDetalle.codigoProducto + '|' + objDetalle.descripcionProducto + '|' + objDetalle.idUnidadMedida + '|' + objDetalle.cantidad + '|' + objDetalle.precio + '|' + objDetalle.importe + '|' + id_TipoOrden + '|' + id_usuario;
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


        Result.get_guiasDetalle_comprasServicios = function (id_GuiaCab) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaCab
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

        Result.update_ingresosFacturas_detalle = function (id_GuiaDet, objDetalle, id_usuario) {

            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaDet + '|' + objDetalle.idProducto + '|' + objDetalle.codigoProducto + '|' + objDetalle.descripcionProducto + '|' + objDetalle.idUnidadMedida + '|' + objDetalle.cantidad + '|' + objDetalle.precio + '|' + objDetalle.importe + '|' +  id_usuario;

            console.log(parametros)

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

        Result.set_eliminar_guiaDetalleCompraServicio = function (id_GuiaDet, idUsuario) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaDet + '|' + idUsuario;
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


        Result.get_guiasCabeceraEdicion = function (id_GuiaCab) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaCab
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

        Result.get_anularDocumento = function (id_GuiaCab, id_usuario) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaCab + '|' + id_usuario;
            parameters = {
                opcion: 11,
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


        Result.get_anularDocumento_comprasServicio = function (id_GuiaCab, id_usuario) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaCab + '|' + id_usuario;
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




        Result.get_guiasCab = function (consulta, idUsuario, idAlmacen, idProveedor ) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = consulta + '|' + idUsuario + '|' + idAlmacen + '|' + idProveedor;
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

        Result.set_agregarGuiasCab = function (idGuiasMasivos, idUsuario, id_GuiaCab) {

            const filtro = idUsuario + '|' + id_GuiaCab;
            let url = urlApi + 'IngresoFacturas/post_agregarGuiasCab?filtro=' + filtro
            var q = $q.defer();
            $http.post(url, idGuiasMasivos)
                .success(function (res) {
                    q.resolve(res);
                })
                .error(function (err) {
                    q.reject(err);
                })
            return q.promise;
        } 

        Result.get_guiasDetalle = function (id_GuiaCab) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaCab  
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






        Result.set_actualizar_guiaDetalleCantidad = function (id_GuiaDet, cantidadModif, idUsuario) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaDet + '|' + cantidadModif + '|' + idUsuario;
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




        Result.set_cerrarGuiacompraServicio = function (idGuiaCab, idUsuario) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = idGuiaCab + '|' + idUsuario;
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




        Result.set_actualizar_guiaDetallePrecio = function (id_GuiaDet, precioModif, idUsuario) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaDet + '|' + precioModif + '|' + idUsuario;
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

        Result.get_descargarIngresoFacturasExcel = function (id_local, id_almacen, id_estado, fecha_ini, fecha_fin, id_proveedor) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_local + '|' + id_almacen + '|' + id_estado + '|' + fecha_ini + '|' + fecha_fin + '|' + id_proveedor;
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

        Result.get_verificarNroDoc = function (tipo_documento, nro_documento, id_Proveedor ) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = tipo_documento + '|' + nro_documento + '|' + id_Proveedor;
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



        Result.get_descargar_IngresoFacturasCompraServicioExcel = function(id_tipoOrden, id_anexo, id_almacen, id_estado, fecha_ini, fecha_fin, id_proveedor) {
 
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_tipoOrden + '|' + id_anexo + '|' + id_almacen + '|' + id_estado + '|' + fecha_ini + '|' + fecha_fin + '|' + id_proveedor;

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



    return Result;
})