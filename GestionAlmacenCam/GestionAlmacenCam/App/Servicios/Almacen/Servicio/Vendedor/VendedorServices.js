angular.module('appGestion.VendedorServices', [])

.factory('VendedorServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getVendedor = function (id) {
        let url = urlApi + 'tbl_vendedor'
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

        if (objeto_parametros.nombreVendedor == null || objeto_parametros.nombreVendedor == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nombre_Vendedor', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.ape_PaternoVendedor == null || objeto_parametros.ape_PaternoVendedor == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el primero Apellido', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.ape_MaternoVendedor == null || objeto_parametros.ape_MaternoVendedor == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el segundo Apellido', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.documentoVendedor == null || objeto_parametros.documentoVendedor == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Documento_Vendedor   ', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.ubicacionVendedor == null || objeto_parametros.ubicacionVendedor == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Direccion_Vendedor', 'error', '#ff6849', 1500);
            return false;
        }
    }

    Result.save_Vendedor = function (params) {

        let url = urlApi + 'tbl_vendedor'
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

    Result.update_Vendedor = function (object) {

        let url = urlApi + "tbl_vendedor/" + object.id_vendedor;
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


    Result.anular_Vendedor = function (id) {
        let url = urlApi + 'tbl_vendedor/' + id;

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