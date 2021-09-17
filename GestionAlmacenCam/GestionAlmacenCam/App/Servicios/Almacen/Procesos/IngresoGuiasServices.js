angular.module('appGestion.IngresoGuiasServices', [])

.factory('IngresoGuiasServices', function (urlApi, $http, $q, $http, $timeout) {

    var Result = {};

    Result.getGuiasOrdenCompra = function (filter) {

        var q = $q.defer();
        var url = urlApi + "tblAlmGuiasCab";
        $http.get(url, {
            params: {
                filter: filter,
                option : 1
            }
        }).success(function (res) {
            
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }
    Result.validarGuiasOrdenCompra = function (params, option) {

       var q = $q.defer();
        console.log(option);
        if (option == "update") {
            q.resolve(false);
        }
        var url = urlApi + "tblAlmGuiasCab";
        $http.get(url,{params : params}).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }


    Result.saveGuiasOrdenCompra = function (obj) {
/*        console.log(JSON.stringify(obj)) */
        var q = $q.defer();
        var url = urlApi + "tblAlmGuiasCab";
        $http.post(url, obj).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.changeStatusGuiasOrdenCompra = function (params) {
        var q = $q.defer();
        var url = urlApi + "tblAlmGuiasCab";
        $http.delete(url, { params : params}).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }



    Result.getGuiasOrdenCompraDet = function (params) {
        var q = $q.defer();
        var url = urlApi + "tblAlmGuiasDet";
        $http.get(url,{params: params}).success(function (res) {            
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.DeleteGuiasOrdenCompraDet = function (idGuiaDet) {
        var q = $q.defer();
        var url = urlApi + "tblAlmGuiasDet/" + idGuiaDet;
        $http.delete(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.updateGuiasOrdenCompraDet = function (obj) {        
        var q = $q.defer();
        var url = urlApi + "tblAlmGuiasDet/" + obj.id_GuiaDet;
        $http.put(url, obj).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.saveGuiasOrdenCompraDet = function (obj) {
        var q = $q.defer();
        var url = urlApi + "tblAlmGuiasDet";
        $http.post(url, obj).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.set_actualizando_Precio = function (id_guiaDet, precio) {
        let url = urlApi + 'tblAlmGuiasDet';
        var parameters;
        var q = $q.defer();

        var parametros = id_guiaDet + '|' + precio;
        parameters = {
            opcion: 1,
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

    Result.set_habilitandoGuia = function (id_guiaCab, idUsuario) {
        let url = urlApi + 'tblAlmGuiasDet';
        var parameters;
        var q = $q.defer();

        var parametros = id_guiaCab + '|' + idUsuario;
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


    return Result;
});