angular.module('appGestion.AlmacenServices', [])

.factory('AlmacenServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getAlmacenes = function () {
        var q = $q.defer();
        var url = urlApi + "tblAlmAlmacen";
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.getAlmacenesLocal = function (idLocal) {
        var q = $q.defer();
        var url = urlApi + "tblAlmAlmacen/" + idLocal;
        console.log(url);
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }
    
    Result.get_ListadoAlmacenes = function (id_local) {

        let url = urlApi + 'MantenimientoAlmacen'
        var parameters;
        var q = $q.defer();
        var parametros = id_local

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

    Result.get_ListadoAlmacenes_Local_Usuario = function (id_local, id_usuario) {
        let url = urlApi + 'MantenimientoAlmacen'
        var parameters;
        var q = $q.defer();
        var parametros = id_local + '|' + id_usuario;

        parameters = {
            opcion: 2,
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
        if (objeto_parametros.id_Anexos == 0 || objeto_parametros.id_Anexos == '0' || objeto_parametros.id_Anexos == null || objeto_parametros.id_Anexos == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Anexo', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_Local == 0 || objeto_parametros.id_Local == '0' || objeto_parametros.id_Local == null || objeto_parametros.id_Local == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Local', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.codigo_Almacen == 0 || objeto_parametros.codigo_Almacen == '0' || objeto_parametros.codigo_Almacen == null || objeto_parametros.codigo_Almacen == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo del Almacen', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.descripcion_Almacen == null || objeto_parametros.descripcion_Almacen == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la descripcion del almacen', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.direccion_Almacen == null || objeto_parametros.direccion_Almacen == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la direccion del almacen', 'error', '#ff6849', 1500);
            return false;
        } 
        else if (objeto_parametros.id_departamento == 0 || objeto_parametros.id_departamento == '0' || objeto_parametros.id_departamento == null || objeto_parametros.id_departamento == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Departamento', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_provincia == 0 || objeto_parametros.id_provincia == '0' || objeto_parametros.id_provincia == null || objeto_parametros.id_provincia == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Provincia', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_distrito == 0 || objeto_parametros.id_distrito == '0' || objeto_parametros.id_distrito == null || objeto_parametros.id_distrito == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Distrito', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.direccion_serie_sunat == null || objeto_parametros.direccion_serie_sunat == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la direccion para la Sunat', 'error', '#ff6849', 1500);
            return false;
        } 
        else if (objeto_parametros.cod_establecimiento == null || objeto_parametros.cod_establecimiento == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Código de Establecimiento', 'error', '#ff6849', 1500);
            return false;
        } 

   }

    Result.save_Almacenes = function (params) {
        let url = urlApi + 'tblAlmAlmacen'
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

    Result.update_Almacenes = function (object) {

        let url = urlApi + "tblAlmAlmacen/" + object.id_Almacen;
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


    Result.anular_Almacenes = function (id) {

        let url = urlApi + 'tblAlmAlmacen/' + id;

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

    Result.getAnexos = function () {
        let url = urlApi + 'MantenimientoAlmacen'
        var parameters;
        var q = $q.defer();

        var parametros = '';
        parameters = {
            opcion: 3,
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

    Result.get_almacenesZona= function (id_zona, id_usuario) {

        let url = urlApi + 'MantenimientoAlmacen'
        var parameters;
        var q = $q.defer();
        var parametros = id_zona + '|' + id_usuario;

        parameters = {
            opcion: 4,
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



    return Result;
});