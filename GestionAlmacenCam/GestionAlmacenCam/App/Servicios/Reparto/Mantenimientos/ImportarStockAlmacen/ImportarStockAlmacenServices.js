angular.module('appGestion.ImportarStockAlmacenServices', [])
    .factory('ImportarStockAlmacenServices', function (urlApi, $http, $q, $http, $timeout, $upload) {

    var Result = {};

        Result.get_almacenesGeneral = function ( id_usuario) {
            let url = urlApi + 'ImportarPedido'
            var parameters;
            var q = $q.defer();
            var parametros = id_usuario;
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
        
        Result.uploadFileExcel_stockAlmacen = function (files, usuario, id_almacen) {
            var uploadUrl = urlApi + 'ImportarPedido/post_archivoExcel_stockAlmacen';
            var q = $q.defer();

            $upload.upload({
                url: uploadUrl,
                method: "POST",
                params: {
                    idUsuario: usuario,
                    idAlmacen: id_almacen
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
