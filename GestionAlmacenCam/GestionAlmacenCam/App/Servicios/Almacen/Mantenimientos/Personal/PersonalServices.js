angular.module('appGestion.PersonalServices', [])

.factory('PersonalServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};

    Result.getPersonales = function () {
        var q = $q.defer();
        var url = urlApi + "tblPersonal";
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.getAlmacenesLocal = function (idLocal) {
        var q = $q.defer();
        var url = urlApi + "tblPersonal/" + idLocal;
 
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
        if (objeto_parametros.nroDoc_personal == 0 || objeto_parametros.nroDoc_personal == '0' || objeto_parametros.nroDoc_personal == null || objeto_parametros.nroDoc_personal == '') {
                 auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el nro de Documento de Identidad', 'error', '#ff6849', 1500);
                 return false;
        }
        else if (objeto_parametros.tipoDoc_personal == 0 || objeto_parametros.tipoDoc_personal == '0' || objeto_parametros.tipoDoc_personal == null || objeto_parametros.tip_personal == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo Documento de Identidad', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.apellidos_personal == null || objeto_parametros.apellidos_personal == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el apellido del Personal', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.nombres_personal == null || objeto_parametros.nombres_personal == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nombre del Personal', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.tip_personal == 0 || objeto_parametros.tip_personal == '0' || objeto_parametros.tip_personal == null || objeto_parametros.tip_personal == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Personal', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_cargo_personal == 0 || objeto_parametros.id_cargo_personal == '0' || objeto_parametros.id_cargo_personal == null || objeto_parametros.id_cargo_personal == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Cargo', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_perfil == 0 || objeto_parametros.id_perfil == '0' || objeto_parametros.id_perfil == null || objeto_parametros.id_perfil == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Perfil', 'error', '#ff6849', 1500);
            return false;
        }
        //else if (objeto_parametros.fecha_cese == 0 || objeto_parametros.fecha_cese == '0' || objeto_parametros.fecha_cese == null || objeto_parametros.fecha_cese == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese un Fecha de Cese', 'error', '#ff6849', 1500);
        //    return false;
        //} 
   }

    Result.save_Personal = function (params) {

        console.log('params')
        console.log(params)

        let url = urlApi + 'tblPersonal'
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

    Result.update_Personal = function (object) {

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


    Result.anular_Personal = function (id) {

        let url = urlApi + 'tblPersonal/' + id;

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