angular.module('appGestion.transformacionProductosServices', [])

    .factory('transformacionProductosServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

        var Result = {};

        Result.mostrarInformacion = function (id_local, id_almacen, id_estado, fechaIni, fechaFin) {

            let url = urlApi + 'TransformacionProductos'
            var parameters;
            var q = $q.defer();

            var parametros = id_local + '|' + id_almacen + '|' + id_estado + '|' + fechaIni + '|' + fechaFin;
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

        Result.set_save_update_transformacionProductosCab = function (obj) {
            let url = urlApi + 'TransformacionProductos'
            var parameters;
            var q = $q.defer();

            var parametros = obj.id_GuiaCab + '|' + obj.idLocal + '|' + obj.idAlmacen + '|' + obj.idTipoDoc + '|' + obj.nroDoc + '|' + obj.fechaDoc + '|' + obj.idProveedor + '|' + obj.usuario_creacion ;
            parameters = {
                opcion: 2,
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

        Result.save_update_transformacionProductoDet = function (params) {

            console.log( JSON.stringify(params))

            let url = urlApi + 'TransformacionProductos/PostTransformacionProductos'
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

        Result.get_transformacionesProductoDetalle = function (id_GuiaCab) {

             let url = urlApi + 'TransformacionProductos'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaCab ;
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
                  
        Result.set_eliminarTransformacionProducto_Detalle = function (id_GuiaDet) {

            let url = urlApi + 'TransformacionProductos'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaDet;
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

        Result.get_transformacionesProductoCab_edicion = function (id_GuiaCab) {

            let url = urlApi + 'TransformacionProductos'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaCab;
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

        Result.set_cerrarTransformacionProducto = function (id_GuiaCab, id_usuario) {

            let url = urlApi + 'TransformacionProductos'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaCab + '|' + id_usuario;
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

        Result.set_reactivarTransformacionProducto = function (id_GuiaCab, id_usuario) {

            let url = urlApi + 'TransformacionProductos'
            var parameters;
            var q = $q.defer();

            var parametros = id_GuiaCab + '|' + id_usuario;
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
 




    return Result;
});