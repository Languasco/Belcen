angular.module('appGestion.umServices', [])

.factory('umServices', function (urlApi, $http, $q, $http, $timeout,auxiliarServices) {

    var Result = {};
    Result.getUnidadMedida = function (params) {
        var q = $q.defer();
        var url = urlApi + "tblAlmUnidadMedida";
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.get_unidadMedida = function (idUnidad) {
        var q = $q.defer();
        var url = urlApi + "tblAlmUnidadMedida/" + idUnidad;
        console.log(url);
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }


    Result.ValidacionGeneral = function (objeto_parametros) {
        if (objeto_parametros.codigo_UnidadMedida == null || objeto_parametros.codigo_UnidadMedida == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Codigo de la Unidad Medida', 'error', '#ff6849', 1500);
            return false;
        }

        else if (objeto_parametros.nombre_UnidadMedida == null || objeto_parametros.nombre_UnidadMedida == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nombre de la Unidad Medida', 'error', '#ff6849', 1500);
            return false;
        }

        else if (objeto_parametros.abreviatura_UnidadMedida == null || objeto_parametros.abreviatura_UnidadMedida == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Abriviacion de Unidad Medida', 'error', '#ff6849', 1500);
            return false;
        }


    }

    Result.saveUnidadMedidas = function (params) {
        var q = $q.defer();
        var url = urlApi + "tblAlmUnidadMedida";

        $http.post(url, params).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.update_UnidadMedida = function (object) {

        let url = urlApi + "tblAlmUnidadMedida/" + object.id_unidadMedida;
        var q = $q.defer();
        $http.put(url, object)
        .success(function (result) {
            console.log(result);
            q.resolve(result);
        })
        .error(function (err) {
            q.reject(err);
        })
        return q.promise;
    }




    Result.anular_UnidadMedida = function (id) {
        let url = urlApi + 'tblAlmUnidadMedida/' + id;
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