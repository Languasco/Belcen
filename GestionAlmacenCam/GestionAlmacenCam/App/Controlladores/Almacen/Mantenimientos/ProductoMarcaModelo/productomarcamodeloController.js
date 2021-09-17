var app = angular.module('appGestion.productomarcamodeloController', [])

app.controller('ctrlProductoModelo', function ($scope, loginServices, $location, productoModeloServices, productoMarcaServices, $timeout, auxiliarServices, AuditarServices) {

    $scope.loadInitProductoModelo = true;

    $scope.initAll = function () {
        $scope.loaderProd = true;
        $scope.showBodyModal = false;
        auxiliarServices.changeTitle("Matenimiento de Producto Marca Modelo");
        $scope.titleModal = "Registro de Modelo Marca Producto";
        $scope.getProductoModelo();

        // INICIALIZAMOS LOS SELECTS ( COMBOS )S
        $scope.getProductoMarca();

        $timeout(function () {
            $scope.loadInitProductoModelo = false;
        }, 2000)


        $scope.get_listStatus();
        setTimeout(function () {
            $(".select_modal").select2();
            $scope.estados = '0';
            $('#cboestadoFilter').val(String('0')).trigger('change.select2');
        }, 200);
    }
    // DEVUELVE EL MODELO DE MARCA DEL PRODUCTO
    $scope.listProModelo = [];
    var oTable;
    $scope.getProductoModelo = function () {
        productoModeloServices.getProductoModeloMarca()
            .then(function (res) {
                $scope.listProModelo = [];
                $scope.listProModelo = res;            
                $timeout(function () {
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('tblProductoModelo', 'inputSearch');
                    } else {
                        $('#tblProductoModelo').trigger('footable_initialize');
                    }
                }, 500);
            }, function (err) {
                console.log(err);
            })
    }

    // DEVUELVE LAS MARCAS DE PRODUCTO
    $scope.listProductoMarca = [];
    $scope.getProductoMarca = function () {
        productoMarcaServices.getProductoMarca()
            .then(function (res) {
                $scope.listProductoMarca = [];
                $scope.listProductoMarca = res;
            }, function (err) {
                console.log(err);
            })
    }

    $scope.listStatus = [];
    $scope.get_listStatus = function () {
        $scope.listStatus.push(
            { id: 0, descripcion: '[ ----   Todos  --- ]' },
            { id: 1, descripcion: 'Activos' },
            { id: 2, descripcion: 'Anulados' }
            )
    }

    $('#ModalModeloProducto').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $scope.showBodyModal = false;
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#codigointerno').focus();
        }, 500)

    });

    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.showBodyModal = false;
        $('#ModalModeloProducto').modal('show');
        $timeout(function () {
            $scope.showBodyModal = true;
        }, 1000);
    }


    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.flag_editar = true;
        $scope.editarProductoModeloMarca(obj);
        $('#ModalModeloProducto').modal('show');

    }

    $scope.objEstados = {
        activo: true,
        text: 'Activo',
        colorText: '#2c5ca9'
    }

    $scope.changeStatus = function (status) {
        if (status) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = "Activo";
            $scope.objEstados.colorText = "#2c5ca9";
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }
    }

    $scope.validarCodModeloMarc = function () {
        var result = false;
        $scope.listProModelo.forEach(function (item, index) {
            if (item.codigo_modeloProducto == $scope.objProductoModeloMarca.codigo_modeloProducto) {
                result = true;
            }
        })
        //console.log(result);
        return result;
    }
    // OBJETO QUE NOS CARGA DATOS AL MODAL PARA ACTUALIZAR 
    $scope.editarProductoModeloMarca = function (item) {
        $scope.loaderProd = true;
        $scope.flag_editar = true;
        $scope.objProductoModeloMarca.id_modeloProducto = item.id_modeloProducto;
        $scope.objProductoModeloMarca.id_marcaProducto = item.id_marcaProducto;
        $scope.objProductoModeloMarca.codigo_modeloProducto = item.codigo_modeloProducto;
        $scope.objProductoModeloMarca.nombre_modeloProducto = item.nombre_modeloProducto;
        $scope.objProductoModeloMarca.abreviatura_modeloProducto = item.abreviatura_modeloProducto;
        $scope.objProductoModeloMarca.estado = item.estado;
        $scope.objProductoModeloMarca.usuario_Creacion = 1;

        if (item.estado == 1) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = 'Activo';
            $scope.objEstados.colorText = '#2c5ca9';
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }

        setTimeout(function () {
            $('#combMarca').val(item.id_marcaProducto).trigger('change.select2');
        }, 100)



    }
    // OBJETO PARA REGISTRAR NUEVO MODELO PRODUCTO

    $scope.objProductoModeloMarca = {
        id_modeloProducto: 0,
        id_marcaProducto: '0',
        codigo_modeloProducto: '',
        nombre_modeloProducto: '',
        abreviatura_modeloProducto: '',
        estado: 1,
        usuario_Creacion: 1,
    }

    $scope.clean = function () {

        $scope.objProductoModeloMarca.id_modeloProducto = 0;
        $scope.objProductoModeloMarca.id_marcaProducto = '0';
        $scope.objProductoModeloMarca.codigo_modeloProducto = '';
        $scope.objProductoModeloMarca.nombre_modeloProducto = '';
        $scope.objProductoModeloMarca.abreviatura_modeloProducto = '';
        $scope.objProductoModeloMarca.estado = 1;
        $scope.objProductoModeloMarca.usuario_Creacion = 1;


        $('.selectModal').val("0").trigger('change.select2');
        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';


    }


    // FUNCIÓN PARA GUARDAR Y ACTUALIZAR LOS DATOS 
    $scope.flag_editar = false;

    $scope.saveProductoModeloMarca = function () {

        if (productoModeloServices.ValidacionGeneral($scope.objProductoModeloMarca) == false) {
            return;
        }

        $scope.objProductoModeloMarca.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.flag_editar == false) //FUNCION PARA REGISTRA LOS DATOS DE PRODUCTO MODELO MARCA 
        {
            if ($scope.validarCodModeloMarc() == true) {
                auxiliarServices.NotificationMessage('Sistemas', 'El Codigo  ingresado ya existe, Vuelva a Ingresar', 'error', '#ff6849', 1800);
                return;

            }
            $scope.loaderSave = true;

            productoModeloServices.saveProductoModeloMarca($scope.objProductoModeloMarca)
                .then(function (res) {
                    $scope.listProModelo.push(res);
                    $scope.getProductoModelo();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso de registro realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {
                            $('#ModalModeloProducto').modal('hide');
                            //resetInput();
                        });
                        //$scope.disabledContent = "";
                        $scope.loaderSave = false;
                    }, 1000)
                }, function (err) {
                    $timeout(function () {
                        let paramsErr = {
                            type: 'error',
                            title: 'Error !',
                            text: 'Los campos se encuentran vacios verifique... !!'
                        }
                        auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                        });
                        $scope.disabledContent = "";
                        $scope.loaderSave = false;
                        console.log(err);
                    }, 1000)
                });

        } else { //FUNCION PARA ACTUALIZAR LOS DATOS DE PRODUCTO MODELO MARCA 

            $scope.loaderSave = true;
            productoModeloServices.UpdateProductoModeloMarca($scope.objProductoModeloMarca)
                .then(function (res) {
                    $scope.listProModelo.push(res);
                    $scope.getProductoModelo();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso de Actualizacion se realizó correctamente !'
                        }

                        auxiliarServices.initSweetAlert(params).then(function (res) {
                            $('#ModalModeloProducto').modal('hide');
                            // resetInput();
                        });
                        //$scope.disabledContent = "";
                        $scope.loaderSave = false;

                    }, 1000)
                }, function (err) {
                    $timeout(function () {
                        let paramsErr = {
                            type: 'error',
                            title: 'Error !',
                            text: 'Ocurrio un problema con la conexión !!'
                        }
                        auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                        });
                        $scope.disabledContent = "";
                        $scope.loaderSave = false;
                        console.log(err);
                    }, 1000)
                });



        }
    }



    $scope.getAnular = function (item) {

        console.log(item);

        if (item.estado == 0 || item.estado == '0') {
            return;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por anular Producto Modelo Marca',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                productoModeloServices.anular_productoModelo(item.id_modeloProducto)
                .then(function (res) {
                    var index = $scope.listProModelo.indexOf(item);
                    $scope.listProModelo[index].estado = 0;
                })
            }
        });
    }

    $scope.getAuditoria = function (item) {

        var fechaEdicion = auxiliarServices.formatDate(item.fecha_Edicion);
        var fechaCreacion = auxiliarServices.formatDate(item.fecha_Creacion);
        var usuedicion = "";
        var usucreacion = "";

        AuditarServices.getAuditar(item.usuario_Edicion)
            .then(function (data) {
                usuedicion = data[0].nombre_personal + " " + data[0].apellido_personal;

                AuditarServices.getAuditar(item.usuario_Creacion).then(function (res) {
                    usucreacion = res[0].nombre_personal + " " + res[0].apellido_personal;

                    var message = "Fecha Creación : " + fechaCreacion + "</br>" +
                                  "Usuario Creación : " + usucreacion + "</br>" +
                                  "Fecha Edición : " + fechaEdicion + "</br>" +
                                  "Usuario Edición : " + usuedicion + "</br>"
                    auxiliarServices.NotificationMessage('Sistemas', message, 'success', '#008000', 5000);

                })
            })

    }



    $scope.estados = '0';
    $scope.changeEstado = function (res) {

        $scope.filterStatus(res);
    }


    $scope.filterStatus = function (status) {
        var addrow = $("#tblProductoModelo")
        $("#tblProductoModelo").footable();

        if (status == 0) {
            status = '';
        }
        else if (status == 1) {
            status = 'Activado';
        }
        else if (status == 2) {
            status = 'Anulado';
        }

        addrow.trigger('footable_filter', {
            filter: status
        });

    }
    // VALIDAR CAMPOS SOLO PARA LETRAS
    // ng-keypress="Validationletter($event);"
    $scope.Validationletter = function (event) {

        let keyCode = (event.keyCode ? event.keyCode : event.which);
        if (!(keyCode < 48 || keyCode > 57)) {
            event.preventDefault();
            auxiliarServices.NotificationMessage('Alerta..!', 'El Sistema solo Permite Ingreso de Letras...!', 'error', '#ff6849', 1500);
        }

    };

    // VALIDAR CAMPOS SOLO PARA NUMEROS 
    //ng-keypress="ValidationNumber($event);"
    $scope.ValidationNumber = function (event) {
        var keys = {
            'up': 38, 'right': 39, 'down': 40, 'left': 37,
            'escape': 27, 'backspace': 8, 'tab': 9, 'enter': 13, 'del': 46,
            '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57, 'dash': 189, 'subtract': 109
        };
        for (var index in keys) {
            if (!keys.hasOwnProperty(index)) continue;
            if (event.charCode == keys[index] || event.keyCode == keys[index]) {
                return;
            }

        }
        event.preventDefault();
        auxiliarServices.NotificationMessage('Alerta..!', 'Por favor ingrese solo Numeros...', 'error', '#ff6849', 1500);
    };

    //ng-keydown="ValidateEnterN($event);"
    $scope.ValidateEnterN = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtnombre').focus();
        }
    }

    //ng-keydown="ValidateEnterDes($event);"
    $scope.ValidateEnterDes = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtdes_m').focus();
        }
    }

    $scope.ExportarToExcel = function () {



        var uri = 'data:application/vnd.ms-excel;base64,',
              template = '<html lang="es"  xmlns:o="urn:schemas-microsoft-com:office:office"' +
                         'xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
                         '<head>' +
                         '<meta charset="utf-8">' +
                         '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Reporte</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
                         '<style>' +

                        ' table, td, th {' +
                              ' border: 1px solid rgba(0, 0, 0, 0.11);' +
                              ' }' +
             ' th {' +
                  'background-color: #4CAF50;' +
                  'color: white;' +
             ' }' +
                       ' </style> </head>' +
                         '<body>' +
                         '<h2  style="text-align:center;">' + ' Reporte Productos Modelo' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tblProductoModelo'),
                     ctx = { worksheet: 'ReporteProductosModelo', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReporteProductosModelo.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }
})