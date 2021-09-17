angular.module('appGestion.HabilitarUsuarioServices', [])
    .factory('HabilitarUsuarioServices', function (urlApi, $http, $q, $http, $timeout, $upload) {

    var Result = {};

        Result.get_buscarLogin = function ( opcion, login,  id_usuario) {
            let url = urlApi + 'ImportarPedido'
            var parameters;
            var q = $q.defer();
            var parametros = opcion + '|' + login + '|' + id_usuario;
            parameters = {
                opcion: 2,
                filtro: parametros
            }

            console.log(parametros)
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
        
        Result.get_activarUsuario = function (opcion, id_login, id_usuario) {
            let url = urlApi + 'ImportarPedido'
            var parameters;
            var q = $q.defer();
            var parametros = opcion + '|' + id_login + '|' + id_usuario;
            parameters = {
                opcion: 3,
                filtro: parametros
            }

            console.log(parametros)
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
