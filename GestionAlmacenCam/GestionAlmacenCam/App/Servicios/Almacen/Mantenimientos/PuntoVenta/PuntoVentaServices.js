angular.module('appGestion.PuntoVentaServices', [])

.factory('PuntoVentaServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getPuntoVenta = function (id) {
        let url = urlApi + 'tblCom_PuntoVenta'
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

        if (objeto_parametros.id_Empresa == 0 || objeto_parametros.id_Empresa == '0' || objeto_parametros.id_Empresa == null || objeto_parametros.id_Empresa == '') {
        auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Empresa', 'error', '#ff6849', 1500);
          return false;

        }
        else if (objeto_parametros.direccion_PuntoVenta == null || objeto_parametros.direccion_PuntoVenta == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Direccion_PuntoVenta', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.descripcion_PuntoVenta == null || objeto_parametros.descripcion_PuntoVenta == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Descripcion_PuntoVenta', 'error', '#ff6849', 1500);
            return false;
        }
    }

    Result.save_puntoVenta = function (params) {

        let url = urlApi + 'tblCom_PuntoVenta'
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

    Result.update_puntoVenta = function (object) {

        let url = urlApi + "tblCom_PuntoVenta/" + object.id_PuntoVenta;
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


    Result.anular_puntoVenta = function (id) {
        let url = urlApi + 'tblCom_PuntoVenta/' + id;

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