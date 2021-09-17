angular.module('appGestion.ImportarPrecioServices', [])
    .factory('ImportarPrecioServices', function (urlApi, $http, $q, $http, $timeout, $upload) {

    var Result = {};

        Result.uploadFileExcel_precio = function (files, _usuario, _tipoImportacion) {
            var uploadUrl = urlApi + 'ImportarPedido/post_archivoExcel_precio';
            var q = $q.defer();

            $upload.upload({
                url: uploadUrl,
                method: "POST",
                params: {
                    idUsuario: _usuario,
                    tipoImportacion: _tipoImportacion,
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
