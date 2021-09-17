angular.module('appGestion.GrupoDetServices', [])

.factory('GrupoDetServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getGrupoCab = function () {
        let url = urlApi + 'TblGrupoTabla_Det';
        var q = $q.defer();
        $http.get(url)
        .success(function (result) {
            q.resolve(result);
        })
        .error(function (err) {
            q.reject(err);
        })
        return q.promise;
    }

    Result.getGrupoTabla_Det = function (id) {
        var q = $q.defer();
        var url = urlApi + "TblGrupoTabla_Det/" + id;
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }
    Result.ValidacionGeneral = function (objeto_parametros) {

        if (objeto_parametros.id_grupoTabla == 0 || objeto_parametros.id_grupoTabla == '0' || objeto_parametros.id_grupoTabla == null || objeto_parametros.id_grupoTabla == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Grupo de Tabla_Cab', 'error', '#ff6849', 1500);
            return false;

        }
        else if (objeto_parametros.descripcion_grupoTabla == null || objeto_parametros.descripcion_grupoTabla == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Descripcion de GrupoTabla', 'error', '#ff6849', 1500);
            return false;
        }
    }

    Result.save_GrupoTabla_Det = function (params) {
        let url = urlApi + 'TblGrupoTabla_Det';
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

    Result.update_GrupoTabla_Det = function (object) {
        let url = urlApi + "TblGrupoTabla_Det/" + object.id_detalleTabla;
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


    Result.anular_GrupoTabla_Det = function (id) {
        let url = urlApi + 'TblGrupoTabla_Det/' + id;

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