angular.module('appGestion.CargoServices', [])

.factory('CargoServices', function (urlApi, $http, $q, $http, $timeout, auxiliarServices) {

    var Result = {};
    Result.getCargos = function () {
        var q = $q.defer();
        var url = urlApi + "TblCargo";
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;

    }

    Result.getStatus = function (staus) {
        var q = $q.defer();
        var url = urlApi + "TblCargo/" + staus;
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;

    }


    Result.ValidacionGeneral = function (objeto_parametros) {

        if (objeto_parametros.codigoInterno_CargoPersonal == null || objeto_parametros.codigoInterno_CargoPersonal == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Codigo del Cargo_Personal', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.descripcion_CargoPersonal == null || objeto_parametros.descripcion_CargoPersonal == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Tipo de Cargo_Personal', 'error', '#ff6849', 1500);
            return false;
        }
        
    }

    Result.save_Cargo = function (params) {
        let url = urlApi + 'TblCargo';
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

    Result.update_Cargo = function (object) {

        let url = urlApi + "TblCargo/" + object.id_CargoPersonal;
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


    Result.delete_Cargo = function (id) {
        let url = urlApi + 'TblCargo/' + id;
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