var app = angular.module('appGestion.productocategoriaController', [])

app.controller('ctrlCategoriaProducto', function ($scope, loginServices, $location, auxiliarServices, $timeout, productoCategoriaServices, AuditarServices) {



    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Categoria Producto");
        $scope.titleModal = "Registro de Producto Categoria";
        $scope.disabledContent = "";
        $scope.loaderSave = false;
        $scope.get_Listando_CategoriaProducto();


        $scope.get_listStatus();
        setTimeout(function () {
            $(".select_modal").select2();
            $scope.estados = '0';
            $('#cboestadoFilter').val(String('0')).trigger('change.select2');
        }, 200);


    }
    var oTable;
    $scope.Lista_CategoriaProd = [];
    $scope.get_Listando_CategoriaProducto = function () {
        setTimeout(function () {
            $scope.loader = true;
            productoCategoriaServices.getProductoCategoria()
                .then(function (res) {
                $scope.Lista_CategoriaProd = res;                
                $scope.loader = false;
            
                $timeout(function () {
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('tblCategoriaProducto', 'inputSearch');
                    } else {
                        $('#tblCategoriaProducto').trigger('footable_initialize');
                    }
                }, 500);
            }, function (err) {
                console.log(err);
            });
        }, 50);
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
                         '<h2  style="text-align:center;">' + ' Reporte Categoria Producto' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tblCategoriaProducto'),
                     ctx = { worksheet: 'ReporteCaterogiaProducto', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReporteCategoriaProducto.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

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

    $scope.objProductoCategoria = {
        id_categoriaProducto: 0,
        codgoCategoria: '',
        nombre_Categoria: '',
        abreviacion_Categoria: '',
        estado: 1,
        usuario_Creacion: 1
    }


    $scope.clean = function () {

        $scope.objProductoCategoria.id_categoriaProducto = 0;
        $scope.objProductoCategoria.codgoCategoria = '';
        $scope.objProductoCategoria.nombre_Categoria = '';
        $scope.objProductoCategoria.abreviacion_Categoria = '';
        $scope.objProductoCategoria.estado = 1;
        $scope.objProductoCategoria.usuario_Creacion = 1;
        $('.selectModal').val("0").trigger('change.select2');
        $scope.objEstados.activo = true;
        $scope.objEstados.text = "Activo";
        $scope.objEstados.colorText = "#2c5ca9"

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

    $('#ModalCategoriaProducto').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#txcat_pro').focus();
        }, 500)

    });

    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $('#ModalCategoriaProducto').modal('show');
    }

    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;

        $scope.EdicionRegistros(obj);
        $('#ModalCategoriaProducto').modal('show');

    }

    $scope.EdicionRegistros = function (item) {

        $scope.flag_editar = true;
        $scope.objProductoCategoria.id_categoriaProducto = item.id_categoriaProducto;
        $scope.objProductoCategoria.codgoCategoria = item.codgoCategoria;
        $scope.objProductoCategoria.nombre_Categoria = item.nombre_Categoria;
        $scope.objProductoCategoria.abreviacion_Categoria = item.abreviacion_Categoria;
        $scope.objProductoCategoria.estado = item.estado;
        $scope.objProductoCategoria.usuario_Creacion = 1;
        if (item.estado == 1) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = 'Activo';
            $scope.objEstados.colorText = '#2c5ca9';
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }


    }
    $scope.validarCodiCategoria = function () {
        var result = false;
        $scope.Lista_CategoriaProd.forEach(function (item, index) {
            if (item.codgoCategoria == $scope.objProductoCategoria.codgoCategoria) {
                result = true;
            }
        })
        //console.log(result);
        return result;
    }

    $scope.GuardarRegistro = function () {
        if (productoCategoriaServices.ValidacionGeneral($scope.objProductoCategoria) == false) {
            return;
        }

        $scope.objProductoCategoria.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo

            if ($scope.validarCodiCategoria() == true) {
                auxiliarServices.NotificationMessage('Sistemas', 'El Codigo ingresado ya existe, Vuelva a Ingresar', 'error', '#ff6849', 1800);
                return;

            }
            $scope.loaderSave = true;
            productoCategoriaServices.saveProductoCategoria($scope.objProductoCategoria)
            .then(function (data) {
                $scope.Lista_CategoriaProd.push(data);
                $scope.get_Listando_CategoriaProducto();
                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                        $('#ModalCategoriaProducto').modal('hide');
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
                    console.log(err);
                }, 500)
            })

        } else {  //actualizar


            $scope.loaderSave = true;
            productoCategoriaServices.updateProductoCategoria($scope.objProductoCategoria)
            .then(function (data) {

                if (data == "Ok") {
                    $scope.Lista_CategoriaProd.push(data);
                    $scope.get_Listando_CategoriaProducto();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {
                            $('#ModalCategoriaProducto').modal('hide');
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
                            $('#ModalCategoriaProducto').modal('hide');
                        });
                        $scope.loaderSave = false;
                        console.log(err);
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
            text: 'Esta por anular una Categoria del producto',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                productoCategoriaServices.anular_CategoriaProducto(item.id_categoriaProducto)
                .then(function (res) {
                    var index = $scope.Lista_CategoriaProd.indexOf(item);
                    $scope.Lista_CategoriaProd[index].estado = 0;

                })
            }
        });
    }

    $scope.getAuditoria = function (item) {

        var fechaEdicion = auxiliarServices.formatDate(item.fecha_Edicion);
        var fechaCreacion = auxiliarServices.formatDate(item.fecha_Creacion);
        var usuedicion = "";
        var usucreacion = "";

        AuditarServices.getAuditar(item.usuario_Edicion).then(function (data) {
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
        var addrow = $("#tblCategoriaProducto")
        $("#tblCategoriaProducto").footable();

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
            $('#txtnom_cat').focus();
        }
    }

    //ng-keydown="ValidateEnterC($event);"
    $scope.ValidateEnterC = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtabre_cat').focus();
        }
    }


})