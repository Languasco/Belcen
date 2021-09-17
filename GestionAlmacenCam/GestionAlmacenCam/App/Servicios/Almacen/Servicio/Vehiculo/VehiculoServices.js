angular.module('appGestion.VehiculoServices', [])

.factory('VehiculoServices', function (urlApi, $http, $q, $http, $timeout,auxiliarServices) {

    var Result = {};
    Result.getVehiculo = function (id) {
        let url = urlApi + 'tblVehiculo'
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

        if (objeto_parametros.vehiculo_Placa == null || objeto_parametros.vehiculo_Placa == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la placa del Vehiculo', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.marca_Vehiculo == null || objeto_parametros.marca_Vehiculo == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la marca del Vehiculo', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.modelo_Vehiculo == null || objeto_parametros.modelo_Vehiculo == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el modelo del Vehiculo', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.descripcion_vehiculo == null || objeto_parametros.descripcion_vehiculo == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la descripcion del Vehiculo', 'error', '#ff6849', 1500);
            return false;
        }
    }

    Result.save_vehiculos = function (params) {

        let url = urlApi + 'tblVehiculo'
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

    Result.update_vehiculos = function (object) {

        let url = urlApi + "tblVehiculo/" + object.id_vehiculo;
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


    Result.anular_vehiculos = function (id) {
        let url = urlApi + 'tblVehiculo/' + id;

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