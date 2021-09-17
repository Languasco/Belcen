angular.module('appGestion.UsuariosServices', [])

    .factory('UsuariosServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getUsuarios = function () {
        var q = $q.defer();
        var url = urlApi + "tblUsuarios";

        parameters = {
            opcion: 1,
            filtro: ""
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

    Result.search_Usuarios = function (search, obj) {
        var q = $q.defer();
        var url = urlApi + "tblUsuarios";

        var parametros = search + '|' + obj.acceso + '|' + obj.estado;
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

        Result.search_UsuariosAcceso = function (search) {
            var q = $q.defer();
            var url = urlApi + "tblUsuarios";

            var parametros = search + '|1|0';
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

    Result.ValidacionGeneral = function (obj) {

        if (obj.nro_doc == null || obj.nro_doc == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Ingrese Nro de documento', 'error', '#ff6849', 1500);
            return false;
        }
        else if (obj.nombres == null || obj.nombres == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Ingrese mombre de Usuario', 'error', '#ff6849', 1500);
            return false;
        }
        else if (obj.apellidos == null || obj.apellidos == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Ingrese apellido de usuario', 'error', '#ff6849', 1500);
            return false;
        }

    }

    Result.save_usuario = function (params) {
        let url = urlApi + 'tblUsuarios';
        var q = $q.defer();
        console.log(params);
        $http.post(url, params)
            .success(function (res) {
                q.resolve(res);
            })
            .error(function (err) {
                q.reject(err);
            })
        return q.promise;
        }

        Result.validar_nroDocumentoUsuario = function (nroDocumento) {
            let url = urlApi + 'Cancelacion_masiva_doc';
            var parameters;
            var q = $q.defer();

            var parametros = nroDocumento
            parameters = {
                opcion: 12,
                filtro: parametros
            };

            console.log(parametros)

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


        Result.update_usuario = function (obj) {
        let url = urlApi + "tblUsuarios/actualizar";
        var q = $q.defer();

        $http({
            method: 'POST',
            url: url,
            data: obj
        }).success(function (result) {
            q.resolve(result);
        }).error(function (err) {

            q.reject(err);
        })
        return q.promise;
    }

        Result.anular_usuario = function (nro_doc, userId) {
            let url = urlApi + 'tblUsuarios?nro_doc=' + nro_doc + '&userId=' + userId;
        var q = $q.defer();
        $http.delete(url)
            .success(function (res) {
                q.resolve(res);
            })
            .error(function (err) {
                q.reject(err);
            })
        return q.promise;
        }

    return Result;
});