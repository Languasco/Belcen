angular.module('appGestion.LocalesServices', [])

.factory('LocalesServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getLocales = function (params) {
        var q = $q.defer();
        var url = urlApi + "tblLocales";
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.get_Locales_Usuario = function (id_usuario) {

        let url = urlApi + 'tblLocales'
        var parameters;
        var q = $q.defer();
        var parametros = id_usuario

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

        if (objeto_parametros.nombre_Local == null || objeto_parametros.nombre_Local == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nombre del local', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.direccion_Local == null || objeto_parametros.direccion_Local == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Direccion local', 'error', '#ff6849', 1500);
            return false;
        }
    }

    Result.save_Local = function (params) {
        let url = urlApi + 'tblLocales';
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

    Result.update_Local = function (object) {

        let url = urlApi + "tblLocales/" + object.id_Local;
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


    Result.delete_Local = function (id) {
        let url = urlApi + 'tblLocales/' + id;

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