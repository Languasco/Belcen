angular.module('appGestion.GiroServices', [])

.factory('GiroServices', function (urlApi, $http, $q, $http, $timeout,auxiliarServices) {

    var Result = {};
    Result.getGiroNegocio = function (id) {
        let url = urlApi + 'tblCom_Giros_Negocio'
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

        if (objeto_parametros.Nombre_GiroNegocio == null || objeto_parametros.Nombre_GiroNegocio == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nombre_GiroNegocio', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.abreviatura_GiroNegocio == null || objeto_parametros.abreviatura_GiroNegocio == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Abreviatura_GiroNegocio', 'error', '#ff6849', 1500);
            return false;
        }
        //else if (objeto_parametros.descripcion_GiroNegocio == null || objeto_parametros.descripcion_GiroNegocio == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Descripcion_GiroNegocio', 'error', '#ff6849', 1500);
        //    return false;
        //}
    }

    Result.save_GirosNegocio = function (params) {

        let url = urlApi + 'tblCom_Giros_Negocio'
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

    Result.update_GirosNegocio = function (object) {

        let url = urlApi + "tblCom_Giros_Negocio/" + object.id_GiroNegocio;
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


    Result.anular_GirosNegocio = function (id) {
        let url = urlApi + 'tblCom_Giros_Negocio/' + id;

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