angular.module('appGestion.UsuarioServices', [])
    .factory('UsuarioServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};        
    Result.getUsuarios = function (id_estado) {

            let url = urlApi + 'tblUsuarios'
            var parameters;
            var q = $q.defer();
            var parametros = id_estado

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

    Result.getAlmacenesLocal = function (idLocal) {
        var q = $q.defer();
        var url = urlApi + "tblPersonal/" + idLocal;
        console.log(url);
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }
    
    Result.get_ListadoAlmacenes = function (id_local) {

        let url = urlApi + 'MantenimientoAlmacen'
        var parameters;
        var q = $q.defer();
        var parametros = id_local

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

    Result.ValidacionGeneral = function (objeto_parametros) {
        if (objeto_parametros.nrodoc_usuario == 0 || objeto_parametros.nrodoc_usuario == '0' || objeto_parametros.nrodoc_usuario == null || objeto_parametros.nrodoc_usuario == '') {
                 auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el nro de Documento de Identidad', 'error', '#ff6849', 1500);
                 return false;
        }
        else if (objeto_parametros.tipo_usuario == 0 || objeto_parametros.tipo_usuario == '0' || objeto_parametros.tipo_usuario == null || objeto_parametros.tip_personal == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo Documento de Identidad', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.apellidos_usuario == null || objeto_parametros.apellidos_usuario == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el apellido del Personal', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.nombres_usuario == null || objeto_parametros.nombres_usuario == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nombre del Personal', 'error', '#ff6849', 1500);
            return false;
        }
         else if (objeto_parametros.id_Cargo == 0 || objeto_parametros.id_Cargo == '0' || objeto_parametros.id_Cargo == null || objeto_parametros.id_Cargo == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Cargo', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_Perfil == 0 || objeto_parametros.id_Perfil == '0' || objeto_parametros.id_Perfil == null || objeto_parametros.id_Perfil == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Perfil', 'error', '#ff6849', 1500);
            return false;
        }
   }

    Result.save_usuario = function (params) {

 
    }

    Result.update_usuario = function (object) {

        let url = urlApi + "tblPersonal/" + object.id_personal;
        var q = $q.defer();
        $http.put(url, object)
        .success(function (result) {
            q.resolve(result);
        })
        .error(function (err) {
            q.reject(err);
        })
        return q.promise;
    }


        Result.set_cambiandoPassword = function ({ password, idUsuario}) {

            let url = urlApi + 'MantenimientoAlmacen'
            var parameters;
            var q = $q.defer();
            var parametros = password + '|'  + idUsuario;

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


    return Result;
});