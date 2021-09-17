angular.module('appGestion.TipoDocumentoServices', [])

.factory('TipoDocumentoServices', function (urlApi, $http, $q, $http, $timeout,auxiliarServices ) {

    var Result = {};
    Result.getTipoDocumento = function (id) {
        let url = urlApi + 'TblTipoDocumentos'
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

        if (objeto_parametros.codigoInterno_TipoDocumento == null || objeto_parametros.codigoInterno_TipoDocumento == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Codigo TipoDoc', 'error', '#ff6849', 1500);
            return false;

        }
        else if (objeto_parametros.TipoDocumento == null || objeto_parametros.TipoDocumento == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el TipoDocumento', 'error', '#ff6849', 1500);
            return false;

        }
        else if (objeto_parametros.codigoSunat_TipoDocumento == null || objeto_parametros.codigoSunat_TipoDocumento == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el CodigoSunat TipoDoc', 'error', '#ff6849', 1500);
            return false;
        }

        else if (objeto_parametros.Descripcion_TipoDocumento == null || objeto_parametros.Descripcion_TipoDocumento == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Descripcion de TipoDocumento', 'error', '#ff6849', 1500);
            return false;
        }
    }

    Result.save_TipoDocumento = function (params) {

        let url = urlApi + 'TblTipoDocumentos'
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

    Result.update_TipoDocumento = function (object) {

        let url = urlApi + "TblTipoDocumentos/" + object.id_TipoDocumento;
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


    Result.anular_TipoDocumento = function (id) {
        let url = urlApi + 'TblTipoDocumentos/' + id;

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