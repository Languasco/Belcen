angular.module('appGestion.importarAjusteInventarioServices', [])
    .factory('importarAjusteInventarioServices', function (urlApi, $http, $q, $http, $timeout, $upload) {

    var Result = {};

        Result.get_tipoMovimientos = function (id_usuario) {

            let url = urlApi + 'ImportarPedido'
            var parameters;
            var q = $q.defer();
            var parametros = id_usuario;
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
        
        Result.uploadFileExcel_ajusteInventario = function (files, usuario, { idLocal, idAlmacen, fecha, idMovimiento, nroDoc}) {
            var uploadUrl = urlApi + 'ImportarPedido/post_archivoExcel_ajusteInventario';
            var q = $q.defer();

            $upload.upload({
                url: uploadUrl,
                method: "POST",
                params: {
                    idUsuario: usuario,
                },
                file: files[0]
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


        Result.set_grabarAjusteInventario = function (usuario, { idLocal, idAlmacen, fecha, idMovimiento, nroDoc }) {

            let url = urlApi + 'ImportarPedido'
            var parameters;
            var q = $q.defer();
            var parametros = usuario + '|' + idLocal + '|' + idAlmacen + '|' + fecha + '|' + idMovimiento + '|' + nroDoc  ;
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
    });
