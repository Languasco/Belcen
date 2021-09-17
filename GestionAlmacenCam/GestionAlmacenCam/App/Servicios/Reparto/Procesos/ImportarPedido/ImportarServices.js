angular.module('appGestion.ImportarServices', [])
    .factory('ImportarServices', function (urlApi, $http, $q, $http, $timeout, $upload) {

    var Result = {};

        Result.uploadFileExcel_usuario = function (obj, id_usuario) {
            let url = urlApi + 'ImportarPedido'
            var parameters;
            var q = $q.defer();
            var parametros = obj.id_local + '|' + obj.id_almacen + '|' + obj.id_Vendedor + '|' + obj.fecha_ini + '|' + obj.fecha_fin + '|' + id_usuario;
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


        Result.uploadFileExcel_pedidos = function (files, usuario, fechaAsigna, idLocal) {
            var uploadUrl = urlApi + 'ImportarPedido/post_archivoExcel_importarPedido';
            var q = $q.defer();

            $upload.upload({
                url: uploadUrl,
                method: "POST",
                params: {
                    idUsuario: usuario,
                    fechaAsignacion: fechaAsigna,
                    idLocal: idLocal
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


                 
    return Result;
    });
