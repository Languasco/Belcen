angular.module('appGestion.ReporteCoberturaServices', [])
    .factory('ReporteCoberturaServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};         
        
    Result.get_descargarReporteCobertura = function (obj, id_usuario) {
            let url = urlApi + 'ReportePedidos'
        var parameters;
        var q = $q.defer();
        var parametros = obj.id_local + '|' + obj.id_almacen + '|' + obj.id_Vendedor + '|' + obj.fecha_ini + '|' + id_usuario;
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

        Result.get_descargarReporteKpi = function (obj, id_usuario) {
            let url = urlApi + 'ReportePedidos'
            var parameters;
            var q = $q.defer();
            var parametros = obj.id_local + '|' + obj.fecha_ini + '|' + obj.fecha_fin + '|' + obj.fecha_cierre + '|' + obj.drop +  '|' + obj.efectividad + '|' + obj.distribucion + '|' + id_usuario;

            console.log(parametros)

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

        Result.get_reporteStock = function (id_almacen, id_usuario) {
            let url = urlApi + 'ReportePedidos'
            var parameters;
            var q = $q.defer();
            var parametros = id_almacen + '|' + id_usuario;
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

        Result.get_descargarReporteStock = function (id_almacen, id_usuario) {
            let url = urlApi + 'ReportePedidos'
            var parameters;
            var q = $q.defer();
            var parametros = id_almacen + '|' + id_usuario;
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
