angular.module('appGestion.RevisionPedidoServices', [])
    .factory('RevisionPedidoServices', function ($http, $q, urlApi) {
        var Result = {};

        Result.get_estados = function () {
            let url = urlApi + 'RevisionPedido'
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

        Result.get_revisionPedidosCab = function (id_local, id_almacen, id_vendedor, id_Anexos, fechaIni, fechaFin, id_transportista, id_estado, flagFueraRuta) {
            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = id_local + '|' + id_almacen + '|' + id_vendedor + '|' + id_Anexos + '|' + fechaIni + '|' + fechaFin + '|' + id_transportista + '|' + id_estado + '|' + flagFueraRuta;
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


        Result.get_aprobarRevisionPedidos = function (idPedidosMasivos, idUsuario, { id_Anexos, id_ZonaVta, id_almacen}) {
            const filtro = idUsuario + '|' + id_Anexos + '|' + id_ZonaVta + '|' + id_almacen;
            let url = urlApi + 'RevisionPedido/post_aprobarRevisiones?filtro=' + filtro
            var q = $q.defer();
            $http.post(url, idPedidosMasivos)
                .success(function (res) {
                    q.resolve(res);
                })
                .error(function (err) {
                    q.reject(err);
                })
            return q.promise;
        }

        Result.get_generarDespacho_pdf = function (idPedidosMasivos, fechaIni, fechaFin, idUsuario) {
            const filtro = fechaIni + '|' + fechaFin + '|' + idUsuario;
            let url = urlApi + 'RevisionPedido/post_despachosPDF?filtro=' + filtro
            var q = $q.defer();
            $http.post(url, idPedidosMasivos)
                .success(function (res) {
                    q.resolve(res);
                })
                .error(function (err) {
                    q.reject(err);
                })
            return q.promise;
        }

        Result.get_Anexos_Usuarios = function (idUsuario) {

            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = idUsuario;
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

        Result.get_locales_Usuarios = function (idUsuario) {

            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = idUsuario;
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

        Result.get_almacen_anexo_local = function (id_Anexos, id_Local,idUsuario) {

            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexos + '|' + id_Local + '|' + idUsuario;
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

        Result.get_Zonas_anexo_local_almacen = function (id_Anexos, id_Local, id_Almacen,idUsuario) {

            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = id_Anexos + '|' + id_Local + '|' + id_Almacen + '|' + idUsuario;
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

        Result.get_Anexos_Almacen = function (idAlmacen) {

           let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = idAlmacen;
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
        
        Result.get_vendedorLocal = function (idLocal) {

            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = idLocal;
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

        Result.get_transportistaLocal = function (idLocal) {

            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = idLocal;
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

        Result.get_informacionPedidosID = function (idPedido) {
            let url = urlApi + 'Pedidos'
            var parameters;
            var q = $q.defer();

            var parametros = idPedido;
            parameters = {
                opcion: 36,
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
        
        Result.get_AnexosZona = function (idZona) {

            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();

            var parametros = idZona;
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

        Result.get_Anexos_Usuario_modulo = function (idUsuario) {

            let url = urlApi + 'RevisionPedido'
            var parameters;
            var q = $q.defer();
            var parametros = idUsuario;
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

        Result.get_Zonas_anexos_modulo = function (id_Anexos, idUsuario) {

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

        Result.get_almacenes_anexos_modulo = function (id_Anexos, id_usuario) {

            let url = urlApi + 'MantenimientoAlmacen'
            var parameters;
            var q = $q.defer();
            var parametros = id_Anexos + '|' + id_usuario;

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


    return Result;
})