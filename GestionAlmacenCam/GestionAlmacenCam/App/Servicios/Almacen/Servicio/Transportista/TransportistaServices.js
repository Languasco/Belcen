angular.module('appGestion.TransportistaServices', [])

.factory('TransportistaServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getTransportista = function (id) {
        let url = urlApi + 'tblTransportista';
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

        if (objeto_parametros.id_vehiculo == 0 || objeto_parametros.id_vehiculo == '0' || objeto_parametros.id_vehiculo == null || objeto_parametros.id_vehiculo == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Vehiculo', 'error', '#ff6849', 1500);
            return false;

        }
        else if (objeto_parametros.nombre_Transportista == null || objeto_parametros.nombre_Transportista == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nombre y Apellidos del Transpo', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.documento_Transportista == null || objeto_parametros.documento_Transportista == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Docuemento del Transpo', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.telefono_Transportista == null || objeto_parametros.telefono_Transportista == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Telefono del Transpo', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.direcion_Transportista == null || objeto_parametros.direcion_Transportista == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Direccion del Transpo', 'error', '#ff6849', 1500);
            return false;
        }
    }

    Result.save_transportista = function (params) {
        let url = urlApi + 'tblTransportista'
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

    Result.update_transportista = function (object) {
        let url = urlApi + "tblTransportista/" + object.id_Transportista;
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


    Result.anular_transportista = function (id) {
        let url = urlApi + 'tblTransportista/' + id;

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