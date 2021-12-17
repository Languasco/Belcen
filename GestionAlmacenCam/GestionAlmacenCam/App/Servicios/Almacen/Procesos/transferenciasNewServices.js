angular.module('appGestion.transferenciasNewServices', [])

    .factory('transferenciasNewServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

        var Result = {};

        Result.set_save_update_transferenciasCab = function (objTransferencia) {

            let url = urlApi + 'TransferenciasNew'
            var parameters;
            var q = $q.defer();

                var parametros = objTransferencia.Id_AlmTranCab + '|' + objTransferencia.nro_Transferencia + '|' + objTransferencia.fechaEmision_TranferenciaCab + '|' + objTransferencia.obs_TranferenciaCab + '|' + objTransferencia.origen_id_Local + '|' + objTransferencia.origen_id_Almacen + '|' + objTransferencia.destino_id_Local + '|' + objTransferencia.destino_id_Almacen + '|' + objTransferencia.usuario_creacion;
            parameters = {
                opcion: 1,
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

        Result.get_buscarProducto_codigo = function (origen_id_Local, origen_id_Almacen, codigo_Producto, id_usuario ) {

            let url = urlApi + 'TransferenciasNew'
            var parameters;
            var q = $q.defer();

            var parametros = origen_id_Local + '|' + origen_id_Almacen + '|'+ codigo_Producto + '|' + id_usuario;
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

        Result.get_buscarProducto_codigoNew = function (origen_id_Local, origen_id_Almacen, codigo_Producto, id_usuario, opcionBusc) {

            let url = urlApi + 'TransferenciasNew'
            var parameters;
            var q = $q.defer();

            var parametros = origen_id_Local + '|' + origen_id_Almacen + '|' + codigo_Producto + '|' + id_usuario;

            parameters = {
                opcion: (opcionBusc ==='ORIGEN') ? 2 : 9,
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



        Result.get_buscarProducto_todos = function (origen_id_Local, origen_id_Almacen, filtroBusqueda , id_usuario) {

            let url = urlApi + 'TransferenciasNew'
            var parameters;
            var q = $q.defer();

            var parametros = origen_id_Local + '|' + origen_id_Almacen + '|' + filtroBusqueda + '|' + id_usuario;
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



        Result.get_buscarProducto_todosNew = function (origen_id_Local, origen_id_Almacen, filtroBusqueda, id_usuario, opcionBusc) {

            let url = urlApi + 'TransferenciasNew'
            var parameters;
            var q = $q.defer();

            var parametros = origen_id_Local + '|' + origen_id_Almacen + '|' + filtroBusqueda + '|' + id_usuario;
            parameters = {
                opcion: (opcionBusc === 'ORIGEN') ? 3 : 9,
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



        Result.save_transferenciasDet = function (params) {

            let url = urlApi + 'TransferenciasNew/Posttbl_transferencias_det'
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

        Result.update_transferenciasDet = function (params) {

            let url = urlApi + 'TransferenciasNew/Putttbl_transferencias_det?id=' + params.Id_AlmTranDet;
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

        Result.get_transferenciasDetalle= function (id_transferenciaCab) {

            let url = urlApi + 'TransferenciasNew'
            var parameters;
            var q = $q.defer();

            var parametros = id_transferenciaCab ;
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

        Result.get_buscarProducto_edicion = function (origen_id_Local, origen_id_Almacen, id_Material, id_UnidadMedida_Ingreso, nroLote, id_usuario, fechaProduccion) {

            let url = urlApi + 'TransferenciasNew'
            var parameters;
            var q = $q.defer();

            var parametros = origen_id_Local + '|' + origen_id_Almacen + '|' + id_Material + '|' + id_UnidadMedida_Ingreso + '|' + nroLote + '|' + id_usuario + '|' + fechaProduccion;
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

        Result.set_eliminarTransferenciaDet = function (Id_AlmTranDet) {

            let url = urlApi + 'TransferenciasNew'
            var parameters;
            var q = $q.defer();

            var parametros = Id_AlmTranDet;
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

        Result.set_cerrarTransferencia = function (id_transferenciaCab, id_usuario) {

            let url = urlApi + 'TransferenciasNew'
            var parameters;
            var q = $q.defer();

            var parametros = id_transferenciaCab + '|' + id_usuario;
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

        Result.set_reactivarTransferencia = function (id_transferenciaCab, flagGuia, id_usuario) {

            let url = urlApi + 'TransferenciasNew'
            var parameters;
            var q = $q.defer();

            var parametros = id_transferenciaCab + '|' + flagGuia + '|' + id_usuario;
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




    return Result;
});