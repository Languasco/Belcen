angular.module('appGestion.productosServices', [])

    .factory('productosServices', function (urlApi, $http, $q, $http, $upload, auxiliarServices) {

    var Result = {};
        Result.getProductos = function (params) {
        var q = $q.defer();
        var url = urlApi + "tbl_Alm_Producto";

        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

        Result.get_productoMarca = function (idMarca, idEstado) {
         var q = $q.defer();
        //var url = urlApi + "tbl_Alm_Producto/" + idMarca;
        var url = urlApi + "tbl_Alm_Producto/" + idMarca + "?idEstado=" + idEstado;
        
 
        $http.get(url).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }

    Result.getProductosByFilter = function (params) {
        var q = $q.defer();
        var url = urlApi + "tbl_Alm_Producto";
        console.log(params);
        $http.get(url, {params : params}).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }
    Result.saveProductos = function (params) {
        var q = $q.defer();
        var url = urlApi + "tbl_Alm_Producto";

        console.log(params)

        $http.post(url,params).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });
        return q.promise;
    }


    //subiendo la imagen del producto

    Result.uploadFile_imageProducto = function (files, usuario, id_producto) {
        var uploadUrl = urlApi + 'tbl_Alm_Producto/UploadImageProduct';
        var q = $q.defer();
        $upload.upload({
            url: uploadUrl,
            method: "POST",
            params: {
                idProducto: id_producto,
                idUsuario: usuario,
            },
            file: files
        }).success(function (data, status, headers, config) {
            q.resolve(data);
        }).error(function (data, status, headers, config) {
            q.reject(data);
        }).progress(function (evt) {
            var progressn = parseInt(100.0 * evt.loaded / evt.total);
            q.notify(progressn);
        });

        return q.promise;
    };





    Result.update_Producto = function (object) {
        let url = urlApi + "tbl_Alm_Producto/" + object.id_Producto;
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


    Result.anular_producto = function (id) {

        let url = urlApi + 'tbl_Alm_Producto/' + id;

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

   
    Result.ValidacionGeneral = function (objeto_parametros) {
        if (objeto_parametros.codigo1_Producto == null || objeto_parametros.codigo1_Producto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo de Producto', 'error', '#ff6849', 1500);

            return false;
        }
        else if (objeto_parametros.nombre_Producto == null || objeto_parametros.nombre_Producto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el nombre del Producto', 'error', '#ff6849', 1500);

            return false;
        }

        else if (objeto_parametros.id_unidadMedida == 0 || objeto_parametros.id_unidadMedida == '0' || objeto_parametros.id_unidadMedida == null || objeto_parametros.id_unidadMedida == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Unidad Medida', 'error', '#ff6849', 1500);

            return false;

        }
        else if (objeto_parametros.id_categoriaProducto == 0 || objeto_parametros.id_categoriaProducto == '0' || objeto_parametros.id_categoriaProducto == null || objeto_parametros.id_categoriaProducto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Categoria', 'error', '#ff6849', 1500);
            return false;
        }
        else if (objeto_parametros.id_lineaProducto == 0 || objeto_parametros.id_lineaProducto == '0' || objeto_parametros.id_lineaProducto == null || objeto_parametros.id_lineaProducto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione Linea para el Product', 'error', '#ff6849', 1500);

            return false;
        }
        else if (objeto_parametros.id_subLineaProducto == 0 || objeto_parametros.id_subLineaProducto == '0' || objeto_parametros.id_subLineaProducto == null || objeto_parametros.id_subLineaProducto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione SubLinea ', 'error', '#ff6849', 1500);

            return false;
        }
        else if (objeto_parametros.id_marcaProducto == 0 || objeto_parametros.id_marcaProducto == '0' || objeto_parametros.id_marcaProducto == null || objeto_parametros.id_marcaProducto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Marca ', 'error', '#ff6849', 1500);

            return false;
        }
        else if (objeto_parametros.id_modeloProducto == 0 || objeto_parametros.id_modeloProducto == '0' || objeto_parametros.id_modeloProducto == null || objeto_parametros.id_modeloProducto == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione Modelo ', 'error', '#ff6849', 1500);

            return false;
        }
        //else if (objeto_parametros.preciocompra_producto == null || objeto_parametros.preciocompra_producto == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el precio menor Horizontal', 'error', '#ff6849', 1500);
        //    return false;
        //}
        //else if (objeto_parametros.precioventa_producto == null || objeto_parametros.precioventa_producto == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el precio mayor Horizontal', 'error', '#ff6849', 1500);
        //    return false;
        //}
        //else if (objeto_parametros.precioventa_producto == null || objeto_parametros.RangoCaja_Horizontal == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el rango de caja Horizontal', 'error', '#ff6849', 1500);
        //    return false;
        //}

        //else if (objeto_parametros.precioMay_Menor == null || objeto_parametros.precioMay_Menor == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el precio menor Mayorista', 'error', '#ff6849', 1500);
        //    return false;
        //}
        //else if (objeto_parametros.precioMay_Mayor == null || objeto_parametros.precioMay_Mayor == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el precio mayor Mayorista', 'error', '#ff6849', 1500);
        //    return false;
        //}
        //else if (objeto_parametros.RangoCaja_Mayorista == null || objeto_parametros.RangoCaja_Mayorista == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el rango de caja Mayorista', 'error', '#ff6849', 1500);
        //    return false;
        //}
 

    }



    Result.getListaPrecioProducto = function (idProducto) {
        let url = urlApi + 'TblCliente'
        var parameters;
        var q = $q.defer();

        var parametros = idProducto;
        parameters = {
            opcion: 11,
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