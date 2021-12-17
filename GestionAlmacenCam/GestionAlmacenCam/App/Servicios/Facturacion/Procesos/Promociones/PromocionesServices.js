angular.module('appGestion.PromocionesServices', [])
    .factory('PromocionesServices', function ($http, $q, urlApi) {
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

        Result.get_promocionesCab = function (idEstado, fechaIni, fechaFin) {
            let url = urlApi + 'Promociones'
            var parameters;
            var q = $q.defer();

            var parametros = idEstado + '|' + fechaIni + '|' + fechaFin;
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
               
        Result.save_promociones = function (params, fechaIni, fechaFinal) {

            const objData = {
                id_Promocion: params.id_Promocion ,
                codigoPromocion: params.codigoPromocion,
                id_ActividadPromocion: params.id_ActividadPromocion,
                nombrePromocion: params.nombrePromocion,
                descripcionPromocion: params.descripcionPromocion,
                fechaVigenciaDesde: fechaIni,
                fechaVigenciaHasta: fechaFinal,
                topesUnidadesInicio: params.topesUnidadesInicio,
                topesUnidadesFin: params.topesUnidadesFin,
                id_CanalNegocio: params.id_CanalNegocio,
                id_FormaPago: params.id_FormaPago,
                estado: params.estado,
                usuario_creacion: params.usuario_creacion
            }

            let url = urlApi + 'Promociones/Posttbl_Promocion_Productos'
            var q = $q.defer();
            $http.post(url, objData)
            .success(function (res) {
                q.resolve(res);
            })
            .error(function (err) {
                q.reject(err);
            })
            return q.promise;
        }

        Result.update_promociones = function (params, fechaIni, fechaFinal) {

            const objData = {
                id_Promocion: params.id_Promocion,
                codigoPromocion: params.codigoPromocion,
                id_ActividadPromocion: params.id_ActividadPromocion,
                nombrePromocion: params.nombrePromocion,
                descripcionPromocion: params.descripcionPromocion,
                fechaVigenciaDesde: fechaIni,
                fechaVigenciaHasta: fechaFinal,
                topesUnidadesInicio: params.topesUnidadesInicio,
                topesUnidadesFin: params.topesUnidadesFin,
                id_CanalNegocio: params.id_CanalNegocio,
                id_FormaPago: params.id_FormaPago,
                estado: params.estado,
                usuario_creacion: params.usuario_creacion
            }

            console.log(objData)

            let url = urlApi + "Promociones/Puttbl_Promocion_Productos/?id=" + params.id_Promocion;
            var q = $q.defer();
            $http.put(url, objData)
            .success(function (result) {
                q.resolve(result);
            })
            .error(function (err) {
                q.reject(err);
            })
            return q.promise;
        }

        Result.get_buscarCanastaID = function (idCanasta) {
            let url = urlApi + 'Promociones'
            var parameters;
            var q = $q.defer();

            var parametros = idCanasta;
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
        
        Result.get_buscarCodigoProducto = function (codigoProducto) {
            let url = urlApi + 'Promociones'
            var parameters;
            var q = $q.defer();

            var parametros = codigoProducto;
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

        Result.save_configuracion = function (params) {
            let url = urlApi + 'Promociones/Posttbl_Promocion_Productos_Configuracion'
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
        
        Result.update_configuracion = function (params) { 

            let url = urlApi + 'Promociones/Puttbl_Promocion_Productos_Configuracion?id=' + params.id_Productos_Configuracion ;
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

        Result.get_configuracionDetalle = function (idPromocion, idCanasta) {
            let url = urlApi + 'Promociones'
            var parameters;
            var q = $q.defer();

            var parametros = idPromocion + '|' + idCanasta;
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

        Result.set_anularPromocion = function (idPromocion) {
            let url = urlApi + 'Promociones'
            var parameters;
            var q = $q.defer();

            var parametros = idPromocion;
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

        Result.set_anularConfiguracion = function (id_Productos_Configuracion) {
            let url = urlApi + 'Promociones'
            var parameters;
            var q = $q.defer();

            var parametros = id_Productos_Configuracion;
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

        Result.get_estados = function () {
            let url = urlApi + 'Promociones'
            var parameters;
            var q = $q.defer();

            var parametros = '';
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

        Result.get_canastaDetalle = function (idCanasta) {

           let url = urlApi + 'Promociones'
            var parameters;
            var q = $q.defer();

            var parametros = idCanasta;
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
               
        Result.save_productoCanastaCab = function (params) {

            console.log('save_productoCanastaCab')
            console.log(JSON.stringify(params))

            let url = urlApi + 'Promociones/Posttbl_Promocion_ProductosCanastas'
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

        Result.update_productoCanastaCab = function (params) {

            let url = urlApi + 'Promociones/Putttbl_Promocion_ProductosCanastas?id=' + params.id_Canasta;
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
        
        Result.save_productoCanastaDet = function (params) {

            let url = urlApi + 'Promociones/Posttbl_Promocion_ProductosCanastas_det'
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

        Result.update_productoCanastaDet = function (params) {

            let url = urlApi + 'Promociones/Putttbl_Promocion_ProductosCanastas_det?id=' + params.id_CanastaDet;
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

        Result.get_Ayuda_Buscar_Producto_normal = function (Consulta, id_usuario) {
            let url = urlApi + 'Pedidos';
            var parameters;
            var q = $q.defer();

            var parametros = Consulta + '|' + id_usuario;

            console.log(parametros);

            parameters = {
                opcion: 40,
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