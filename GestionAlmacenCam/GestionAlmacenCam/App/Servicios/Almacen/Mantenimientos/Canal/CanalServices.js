angular.module('appGestion.CanalServices', [])

.factory('CanalServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getCanalNegocio = function (id) {
        let url = urlApi + 'tblCom_Canales_Negocio'
        console.log(url)
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

    Result.ValidacionGeneral = function (objeto_parametros) {
        
        if (objeto_parametros.Nombre_CanalNegocio == null || objeto_parametros.Nombre_CanalNegocio == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nombre_CanalNegocio', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.abreviatura_CanalNegocio == null || objeto_parametros.abreviatura_CanalNegocio == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Abreviatura_CanalNegocio', 'error', '#ff6849', 1500);
            return false;
        }
        //else if (objeto_parametros.descripcion_CanalNegocio == null || objeto_parametros.descripcion_CanalNegocio == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Descripcion_CanalNegocio', 'error', '#ff6849', 1500);
        //    return false;
        //}
    }

    Result.save_canalNegocio = function (params) {

        let url = urlApi + 'tblCom_Canales_Negocio'
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

    Result.update_canalNegocio = function (object) {

        let url = urlApi + "tblCom_Canales_Negocio/" + object.id_CanalNegocio;
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


    Result.anular_canalNegocio = function (id) {
        let url = urlApi + 'tblCom_Canales_Negocio/' + id;

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