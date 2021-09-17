angular.module('appGestion.DocumentoVentaServices', [])

.factory('DocumentoVentaServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    //Result.getAlmacenes = function () {
    //    var q = $q.defer();
    //    var url = urlApi + "tblAlmAlmacen";
    //    $http.get(url).success(function (res) {
    //        q.resolve(res);
    //    }).error(function (err) {
    //        q.reject(err);
    //    });
    //    return q.promise;
    //}

    Result.get_clientess = function () {
        let url = urlApi + 'DocumentoVenta'
        var parameters;
        var q = $q.defer();

        // cargo Vendedor=6
        var parametros = 6
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

    Result.get_Vendedores= function () {
        let url = urlApi + 'DocumentoVenta'
        var parameters;
        var q = $q.defer();

        // cargo Vendedor=6
        var parametros = 6  
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

    Result.validate = function (params) {
        if (params.puntoventa == 0 || params.puntoventa == '0' || params.puntoventa == null || params.puntoventa == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Punto de Venta', 'error', '#ff6849', 1500);
            return false ;
        } 
        else if (params.documVenta == 0 || params.documVenta == '0' || params.documVenta == null || params.documVenta == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Documento de Venta', 'error', '#ff6849', 1500);
            return false ;
        }
        else if (params.estado == 0 || params.estado == '0' || params.estado == null || params.estado == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Estado', 'error', '#ff6849', 1500);
            return false;
        }
    }
 
    Result.getListaPedido = function (obj) {

        let url = urlApi + 'DocumentoVenta'
        var parameters;
        var q = $q.defer();
        var parametros = obj.puntoventa + '|' + obj.vendedor + '|' + obj.documVenta + '|' + obj.estado;

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
    
    Result.getUpdatePedidos = function (obj_pedidos, id_usuario) {

        let url = urlApi + 'DocumentoVenta'
        var parameters;
        var q = $q.defer();
        var parametros = obj_pedidos.toString()+ '|' + id_usuario

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
    
    return Result;
});