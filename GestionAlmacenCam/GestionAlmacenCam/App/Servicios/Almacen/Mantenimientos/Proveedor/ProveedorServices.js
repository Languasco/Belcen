angular.module('appGestion.ProveedorServices', [])

.factory('ProveedorServices', function (urlApi, $http, $q, $http, $timeout,auxiliarServices) {

    var Result = {};

    Result.getProveedores = function () {
        var q = $q.defer();
        var url = urlApi + "tblAlmProveedor";
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.getProveedor = function (params) {
        var q = $q.defer();
        var url = urlApi + "tblAlmProveedor";
        console.log(params);
        $http.get(url, { params : params}).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }


    Result.ValidacionGeneral = function (objeto_Parametros) {
        if (objeto_Parametros.nroDocumento_Proveedor == null || objeto_Parametros.nroDocumento_Proveedor == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el nro de Documento', 'error', '#ff6849', 1500);
            return false;
        }

        if (String(objeto_Parametros.nroDocumento_Proveedor).length< 11) {
            auxiliarServices.NotificationMessage('Sistemas', 'El nro de Documento tiene que ser de 11 digitos', 'error', '#ff6849', 1500);
            return false;
        }     
        else if (objeto_Parametros.razonSocial_Proveedor == null || objeto_Parametros.razonSocial_Proveedor == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Razon Social  del Proveedor', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_Parametros.direccion_Proveedor == null || objeto_Parametros.direccion_Proveedor == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Direccion de Proveedor', 'error', '#ff6849', 1500);
            return false;
        }

        //else if (objeto_Parametros.telefono1_Proveedor == null || objeto_Parametros.telefono1_Proveedor == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Telefono del Proveedor', 'error', '#ff6849', 1500);
        //    return false;
        //}

        //else if (objeto_Parametros.email_Proveedor == null || objeto_Parametros.email_Proveedor == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el correo electrónico', 'error', '#ff6849', 1500);
        //    return false;
        //}
        
        //else if (objeto_Parametros.contacto_Proveedor == null || objeto_Parametros.contacto_Proveedor == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor  ingrese Contacto del Proveedor', 'error', '#ff6849', 1500);
        //    return false;
        //}
                     
    }

    Result.save_Proveedor = function (params) {
        let url = urlApi + 'tblAlmProveedor'
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

    Result.update_Proveedor = function (object) {

        let url = urlApi + "tblAlmProveedor/" + object.id_Proveedor;
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


    Result.anular_Proveedor = function (id) {

        let url = urlApi + 'tblAlmProveedor/' + id;

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