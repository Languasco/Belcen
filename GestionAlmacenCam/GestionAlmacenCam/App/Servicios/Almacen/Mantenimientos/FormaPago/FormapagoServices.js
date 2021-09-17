angular.module('appGestion.FormapagoServices', [])

.factory('FormapagoServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getFormaPago = function (id) {
        let url = urlApi + 'tblCom_FormaPago';
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

    Result.ValidacionGeneral = function (objeto_parametros)
    {
        if (objeto_parametros.descripcion_FromaPag == null || objeto_parametros.descripcion_FromaPag == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el tipo Pago', 'error', '#ff6849', 1500);
           
            return false;
        }
    }

    Result.save_formaPago = function (params) {
        let url = urlApi + 'tblCom_FormaPago';
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

    Result.update_formaPago = function (object) {
        let url = urlApi + "tblCom_FormaPago/" + object.id_FormaPag;
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


    Result.anular_formaPago = function (id) {
        let url = urlApi + 'tblCom_FormaPago/' + id;

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