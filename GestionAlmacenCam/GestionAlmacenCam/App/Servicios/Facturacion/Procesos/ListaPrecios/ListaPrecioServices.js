angular.module('appGestion.ListaPrecioServices', [])

.factory('ListaPrecioServices', function ($http, $q, urlApi) {
    var Result = {};

    Result.updateListaPrecio = function (object, objcombo) {
       let url = urlApi + "TblFac_ListaPrecios/" + object.id_listaPrecio;
        obj_listaprecion = {
            id_empresa :object.id_empresa,
            id_Producto: object.id_Producto,
            id_listaPrecios: object.id_listaPrecio,
            precioVenta_listaPrecios: object.precioventa,
            aplicaDescuento_listaPrecios:  object.aplicadescuento ,
            porcentajeDescuento_listaPrecios: object.porcentajedescuento,
            usuario_creacion: objcombo.usuario,
            id_PuntoVenta: objcombo.puntoventa
        }
        var q = $q.defer();
        $http.put(url, obj_listaprecion)
        .success(function (result) {
            q.resolve(result);
        })
        .error(function (err) {
            q.reject(err);
        })
        return q.promise;
    }

    Result.getListaPrecioParametro = function (obj) {  
        let url = urlApi + 'TblFac_ListaPrecios'
        var obj_listaprecio;
        var parameters;
        var q = $q.defer();
        obj_listaprecio = {
            puntoventa: obj.puntoventa,
            categoria: obj.categoria,
            canalNegocio: obj.id_CanalNegocio   
        }
        parameters = {          
            condicion:1,
            parametros: JSON.stringify(obj_listaprecio)
        }
        $http({
            method: 'GET',
            url: url,
            params: parameters
        }).success(function (result) {
            q.resolve(result);
        }).error(function (err) {
            console.log(err)
            q.reject(err);
        })
        return q.promise;
    }

    Result.getListaProductoNuevo = function (obj) {
        let url = urlApi + 'TblFac_ListaPrecios'
        var obj_listaprecio;
        var parameters;
        var q = $q.defer();
        obj_listaprecio = {
            puntoventa: obj.puntoventa,
            categoria: obj.categoria,
            canalNegocio: obj.id_CanalNegocio
        }
        parameters = {
            condicion: 2,
            parametros: JSON.stringify(obj_listaprecio)
        }
        $http({
            method: 'GET',
            url: url,
            params: parameters
        }).success(function (result) {
            q.resolve(result);
        }).error(function (err) {
            console.log('err')
            q.reject(err);
        })
        return q.promise;
    }

    return Result;
})