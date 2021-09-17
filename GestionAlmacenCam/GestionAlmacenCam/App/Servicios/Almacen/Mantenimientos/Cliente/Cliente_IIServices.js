angular.module('appGestion.Cliente_IIServices', [])

.factory('Cliente_IIServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
   
    Result.getClientes = function () {
        var q = $q.defer();
        var url = urlApi + "TblCliente";
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.listadoClientes = function (objCliente) {
        let url = urlApi + 'TblCliente'
        var parameters;
        var q = $q.defer();

        var parametros = objCliente.id_TipoCliente + '|' + objCliente.doc_identidad + '|' + objCliente.razon_social + '|' + objCliente.id_zona + '|' + objCliente.id_vendedor + '|' + objCliente.id_condicionPago + '|' + objCliente.direccion_entrega + '|' + objCliente.id_estado ;
        parameters = {
            opcion: 1,
            filtro: parametros
        }

        console.log(objCliente)
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
         
    Result.save_Cliente = function (params) {
        let url = urlApi + 'TblCliente'
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

        let url = urlApi + "TblCliente/" + object.id_cliente;
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

        let url = urlApi + 'TblCliente/' + id;

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
    
    Result.getPersonal_Dni_Data = function (Dni_Personal) {
        let url = urlApi + 'TblCliente';
        var parameters;
        var q = $q.defer();

        var parametros = Dni_Personal;

        parameters = {
            opcion: 2,
            filtro: parametros
        };
        $http({
            method: 'GET',
            url: url,
            params: parameters
        }).success(function (result) {
            q.resolve(result);
        }).error(function (err) {

            q.reject(err);
        });
        return q.promise;
    };
    
    Result.getGirosNegocio = function () {
        let url = urlApi + 'TblCliente'
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

    Result.getCanalesNegocio = function () {
        let url = urlApi + 'TblCliente'
        var parameters;
        var q = $q.defer();

        var parametros = '';
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
    
    Result.getZona = function () {
        let url = urlApi + 'TblCliente'
        var parameters;
        var q = $q.defer();

        var parametros = '';
        parameters = {
            opcion: 5,
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

    Result.getRuta = function () {
        let url = urlApi + 'TblCliente'
        var parameters;
        var q = $q.defer();

        var parametros = '';
        parameters = {
            opcion: 6,
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
    
    Result.getVendedores = function (idRuta) {
        let url = urlApi + 'TblCliente'
        var parameters;
        var q = $q.defer();

        var parametros = idRuta;
        parameters = {
            opcion: 7,
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

    Result.getSupervisor = function (idRuta) {
        let url = urlApi + 'TblCliente'
        var parameters;
        var q = $q.defer();

        var parametros = idRuta;
        parameters = {
            opcion: 8,
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
    
    Result.grabar_DistribucionCliente = function (idCliente_Global, id_ZonaVta, id_RutaVta, idVendedor, idSupervisor, secuencia_Cliente, disDiaVisita, motivodeNocompra, productoInteres) {
        let url = urlApi + 'TblCliente'
        var parameters;
        var q = $q.defer();

        var parametros = idCliente_Global + '|' + id_ZonaVta + '|' + id_RutaVta + '|' + idVendedor + '|' + idSupervisor + '|' + secuencia_Cliente + '|' + disDiaVisita + '|' + motivodeNocompra + '|' + productoInteres;
        parameters = {
            opcion: 9,
            filtro: parametros
        }

        console.log(parametros)

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

    Result.grabar_creditoCobranzaCliente = function (idCliente_Global, importeMaxCredido, obsrealizaCobranza, cond_facturacion ) {
        let url = urlApi + 'TblCliente'
        var parameters;
        var q = $q.defer();

        var parametros = idCliente_Global + '|' + importeMaxCredido + '|' + obsrealizaCobranza + '|' + cond_facturacion;
        parameters = {
            opcion: 10,
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