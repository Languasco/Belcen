

var app = angular.module('appGestion.ProductoSubLineaController', [])

app.controller('ctrlProductoSubLinea', function ($scope, loginServices, $location, productoCategoriaServices, productoLineaServices, productoSubLineaServices, productoLineaServices, $timeout, productoLineaServices, auxiliarServices, AuditarServices) {


    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Producto SubLinea");
        $scope.titleModal = "Registro de ProductoSubLinea";
        $scope.disabledContent = "";
        $scope.loaderSave = false;
        $scope.ListadoproductoSubLinea();
        $scope.get_Listando_Categoria();
        //$scope.get_Listando_linea();

        $scope.get_listStatus();
        setTimeout(function () {
            $(".select_modal").select2();
            $scope.estados = '0';
            $('#cboestadoFilter').val(String('0')).trigger('change.select2');
        }, 200);
    }

    $scope.ProductoSubLinea = [];
    var oTable;
    $scope.ListadoproductoSubLinea = function () {
        $scope.loader = true;
        productoSubLineaServices.getProductoSubLinea()
            .then(function (data) {
            $scope.loader = false;
            $scope.ProductoSubLinea = [];
            $scope.ProductoSubLinea = data;
   

            $timeout(function () {
                if (oTable !== 'data') {
                    oTable = 'data';
                    auxiliarServices.initFooTable('tbl_productoSubLinea', 'inputSearch');
                } else {
                    $('#tbl_productoSubLinea').trigger('footable_initialize');
                }
            }, 500);
        }, function (err) {
            console.log(err);
        })
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
                         '<h2  style="text-align:center;">' + ' Reporte Productos Sub Linea' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tbl_productoSubLinea'),
                     ctx = { worksheet: 'ReporteProductoSubLinea', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReporteProductoSubLinea.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }
    $scope.Lista_Categoria = [];
    $scope.get_Listando_Categoria = function () {
        $scope.loader = true;
        productoCategoriaServices.getProductoCategoria()
            .then(function (res) {
                $scope.loader = false;
                $scope.Lista_Categoria = [];
                $scope.Lista_Categoria = res;
                $timeout(function () {
                    $('.filterCategoria').select2();
                    $('.filterProdLinea').select2();
                })
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


    $scope.Flag_modoEdicion = false;

    $scope.objeto_parametros = {
        id_subLineaProducto: 1,
        id_categoriaProducto: '0',
        id_lineaProducto: '0',
        codigo_SubLinea: '',
        nombre_SubLinea: '',
        abreviatura_SubLinea: '',
        estado: 1,
        usuario_Creacion: 1,
    }


    $scope.clean = function () {

        //var nroDoc_personal = document.getElementById('nroDoc_personal')

        $scope.objeto_parametros.id_subLineaProducto = 1;
        $scope.objeto_parametros.id_categoriaProducto = '0';
        $scope.objeto_parametros.id_lineaProducto = '0';
        $scope.objeto_parametros.codigo_SubLinea = ''
        $scope.objeto_parametros.nombre_personal = '';
        $scope.objeto_parametros.abreviatura_SubLinea = '';
        $scope.objeto_parametros.estado = 1;
        $scope.objeto_parametros.usuario_Creacion = 1;


        setTimeout(function () {

            $('#cbo_categoria').val("0").trigger('change.select2');
            $('#cbo_tipo_linea').val("0").trigger('change.select2');
        }, 100);
    }

    $scope.objEstados = {
        activo: true,
        text: 'Activo',
        colorText: '#2c5ca9'
    }

    $scope.changeStatus = function (status) {
        if (status) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = "ACTIVO";
            $scope.objEstados.colorText = "#2c5ca9";
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "INACTIVO";
            $scope.objEstados.colorText = "#b3192c";
        }
    }

    $('#ModalProductoSubLinea').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#codigo_lineaP').focus();
        }, 500)

    });

    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $('#ModalProductoSubLinea').modal('show');
    }

    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;
        $scope.EdicionRegistros(obj);
        $('#ModalProductoSubLinea').modal('show');

    }

    $scope.validarCodiSubLinea = function () {
        var result = false;
        $scope.ProductoSubLinea.forEach(function (item, index) {
            if (item.codigo_SubLinea == $scope.objeto_parametros.codigo_SubLinea) {
                result = true;
            }
        })
        
        return result;
    }


    $scope.changeSelect = function (select, idSelect) {
        if (select == "categorias") {
            productoLineaServices.getProductLinea(idSelect)
                .then(function (res) {
                    if (res.length == 0) {
                        $scope.Lista_LineaProducto = [];
                        $scope.objeto_parametros.id_lineaProducto = "0";
                        $timeout(function () {
                            $('#cbo_categoria').val("0").trigger('change.select2');
                            $('#cbo_tipo_linea').val("0").trigger('change.select2');
                        })

                        return;
                    }
                    $scope.Lista_LineaProducto = res;
                    if ($scope.Flag_modoEdicion == true) {
                        $timeout(function () {
                            $('#cbo_tipo_linea').val($scope.objeto_parametros.id_lineaProducto).trigger('change.select2');
                        })
                        
                        return;
                    }

                    var newValue = String(res[0].id_lineaProducto);
                    $scope.objeto_parametros.id_lineaProducto = newValue;
                  
                    $timeout(function () {
                        $('#cbo_tipo_linea').val(newValue).trigger('change.select2');
                    });
                }, function (err) {
                    console.log(err);
                });
        }
    }

    var objAux;

    $scope.EdicionRegistros = function (obj) {

        objAux = '';
        objAux = obj;

        $scope.objeto_parametros.id_subLineaProducto = obj.id_subLineaProducto;
        $scope.objeto_parametros.id_categoriaProducto = obj.id_categoriaProducto;
        $scope.objeto_parametros.id_lineaProducto = obj.id_lineaProducto;
        $scope.objeto_parametros.codigo_SubLinea = obj.codigo_SubLinea;
        $scope.objeto_parametros.nombre_SubLinea = obj.nombre_SubLinea;
        $scope.objeto_parametros.abreviatura_SubLinea = obj.abreviatura_SubLinea;

        $scope.objeto_parametros.usuario_Creacion = 1;
        $scope.objeto_parametros.estado = obj.estado;

        $scope.changeSelect('categorias', $scope.objeto_parametros.id_categoriaProducto);

        if (obj.estado == 1) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = 'Activo';
            $scope.objEstados.colorText = '#2c5ca9';
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }
        setTimeout(function () {
            $('#cbo_categoria').val(obj.id_categoriaProducto).trigger('change.select2');
        }, 100);

    }

    $scope.GuardarRegistro = function () {
        if (productoSubLineaServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }

        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;
        if ($scope.Flag_modoEdicion == false) { // nuevo registroo

            if ($scope.validarCodiSubLinea() == true) {
                auxiliarServices.NotificationMessage('Sistemas', 'El Codigo ingresado ya existe, Vuelva a ingresar', 'error', '#ff6849', 1800);
                return;

            }
            $scope.loaderSave = true;
            productoSubLineaServices.save_ProductoSubLinea($scope.objeto_parametros)
            .then(function (data) {
                $scope.ProductoSubLinea.push(data);
                $scope.ListadoproductoSubLinea();
                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                        $('#ModalProductoSubLinea').modal('hide');
                    });
                    $scope.loaderSave = false;
                }, 500)
            }, function (error) {
                $timeout(function () {
                    let paramsErr = {
                        type: 'error',
                        title: 'Error !',
                        text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                    }
                    auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                    });
                    $scope.loaderSave = false;
                    console.log(error);
                }, 500)
            })

        } else {  //actualizar

            $scope.loaderSave = true;
            productoSubLineaServices.update_ProductoSubLinea($scope.objeto_parametros)
            .then(function (data) {
                if (data == "OK") {
                    $scope.ProductoSubLinea.push(data);
                    $scope.ListadoproductoSubLinea();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params)
                            .then(function (res) {
                                $('#ModalProductoSubLinea').modal('hide');
                            });
                        $scope.loaderSave = false;
                    }, 500)
                } else {
                    $timeout(function () {
                        let paramsErr = {
                            type: 'error',
                            title: 'Error !',
                            text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                        }
                        auxiliarServices.initSweetAlert(paramsErr).then(function (res) {
                            $('#ModalProductoSubLinea').modal('hide');
                        });
                        $scope.loaderSave = false;
                    }, 500)
                }
            }, function (error) {
                console.log(error);
            })

        }
    }



    $scope.getAnular = function (item) {

        if (item.estado == 0 || item.estado == '0') {
            return;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por anular un transportista',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                productoSubLineaServices.anular_ProductoSubLinea(item.id_subLineaProducto)
                   .then(function (res) {
                       var index = $scope.ProductoSubLinea.indexOf(item);
                       $scope.ProductoSubLinea[index].estado = 0;
                   })
            }
        });
    }

    $scope.getAuditoria = function (item) {
        var usuario_edicion = auxiliarServices.formatDate(item.usuario_Edicion);
        var usuario_creacion = auxiliarServices.formatDate(item.usuario_Creacion);
        var usuedicion = "";
        var usucreacion = "";
        AuditarServices.getAuditar(item.usuario_Edicion).then(function (data) {
            usuedicion = data[0].nombre_personal + " " + data[0].apellido_personal;
            AuditarServices.getAuditar(item.usuario_Creacion).then(function (res) {
                usucreacion = res[0].nombre_personal + " " + res[0].apellido_personal;

                var message = "Fecha Creación : " + usuario_creacion + "</br>" +
                              "Usuario Creación : " + usucreacion + "</br>" +
                              "Fecha Edición : " + usuario_edicion + "</br>" +
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
        var addrow = $("#tbl_productoSubLinea")
        $("#tbl_productoSubLinea").footable();

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
            '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57
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

    //ng-keydown="ValidateEnterP($event);"
    $scope.ValidateEnterP = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#nombre_lineaP').focus();
        }
    }

    //ng-keydown="ValidateEnterLinea($event);"
    $scope.ValidateEnterLinea = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#abre_lineaP').focus();
        }
    }
    


})