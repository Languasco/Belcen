angular.module('appGestion.IngresoFacturasServices', [])
    .factory('IngresoFacturasServices', function ($http, $q, urlApi) {
        var Result = {};

        Result.get_actividades = function () {
            let url = urlApi + 'Promociones'
            var parameters;
            var q = $q.defer();

            var parametros = '';
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

        Result.get_ingresosFacturas = function (id_local, id_almacen, id_estado, fecha_ini, fecha_fin, id_proveedor) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_local + '|' + id_almacen + '|' + id_estado + '|' + fecha_ini + '|' + fecha_fin + '|' + id_proveedor;
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
               
        Result.save_ingresosFacturas = function (params) {
            let url = urlApi + 'IngresoFacturas/PostTbl_Fac_Facturas_Compras_cab'
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

        Result.update_ingresosFacturas = function (params) {             
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

        Result.set_eliminar_guiaDetalle = function (id_GuiaDet, idUsuario) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaDet + '|' + idUsuario;
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

        Result.set_cerrarGuia = function (idGuiaCab, idUsuario) {
            let url = urlApi + 'IngresoFacturas'
            var parameters;
            var q = $q.defer();

            var parametros = idGuiaCab + '|' + idUsuario;
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

    return Result;
})