angular.module('appGestion.ClienteServices', [])

.factory('ClienteServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
   
    Result.getClientes = function () {
        var q = $q.defer();
        var url = urlApi + "tblCom_Cliente";
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }


 
    Result.ValidacionGeneral = function (objeto_parametros) {
        if (objeto_parametros.codigo_cliente == null || objeto_parametros.codigo_cliente == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Codigo del Cliente', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.tipoDocumento == 0 || objeto_parametros.tipoDocumento == '0' || objeto_parametros.tipoDocumento == null || objeto_parametros.tipoDocumento == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Documento', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.nroDocumento == 0 || objeto_parametros.nroDocumento == '0' || objeto_parametros.nroDocumento == null || objeto_parametros.nroDocumento == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el nro de Documento', 'error', '#ff6849', 1500);
            return false;
        }

        else if (objeto_parametros.razonSocial_Cliente == null || objeto_parametros.razonSocial_Cliente == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Razon Social  del Cliente', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.razonComercial_Cliente == null || objeto_parametros.razonComercial_Cliente == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Razon Comercial del Cliente', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_GiroNegocio == 0 || objeto_parametros.id_GiroNegocio == '0' || objeto_parametros.id_GiroNegocio == null || objeto_parametros.id_GiroNegocio == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Giro del Negocio', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_CanalNegocio == 0 || objeto_parametros.id_CanalNegocio == '0' || objeto_parametros.id_CanalNegocio == null || objeto_parametros.id_CanalNegocio == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Canal del Negocio', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.direccion_Cliente == null || objeto_parametros.direccion_Cliente == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Direccion del Cliente', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_ubigeo == 0 || objeto_parametros.id_ubigeo == '0' || objeto_parametros.id_ubigeo == null || objeto_parametros.id_ubigeo == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Ubigeo', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.direccionEntrega_Cliente == null || objeto_parametros.direccionEntrega_Cliente == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor  ingrese la Direccion de Entrega del Cliente', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_ubigeoEntrega == 0 || objeto_parametros.id_ubigeoEntrega == '0' || objeto_parametros.id_ubigeoEntrega == null || objeto_parametros.id_ubigeoEntrega == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Ubigeo de Entrega', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.importeMaximoCredito_Cliente == 0 || objeto_parametros.importeMaximoCredito_Cliente == '0' || objeto_parametros.importeMaximoCredito_Cliente == null || objeto_parametros.importeMaximoCredito_Cliente == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el importe maximo', 'error', '#ff6849', 1500);
            return false;
        }

   }

    Result.save_Cliente = function (params) {
        let url = urlApi + 'tblCom_Cliente'
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

    Result.update_Cliente = function (object) {

        let url = urlApi + "tblCom_Cliente/" + object.id_cliente;
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


    Result.anular_Cliente = function (id) {

        let url = urlApi + 'tblCom_Cliente/' + id;

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