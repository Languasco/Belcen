var app = angular.module('appGestion.UnidadController', [])

app.controller('ctrlUnidadMedida', function ($scope, loginServices, $location, $timeout, auxiliarServices, AuditarServices, umServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Unidad Medida");
        $scope.titleModal = "Registro de Unidad Medida";
        $scope.loaderSave = false;
        $(".filterEstado").select2();

        $scope.get_Uniad_Medida();

        $scope.get_listStatus();
        setTimeout(function () {
            $(".select_modal").select2();
            $scope.estados = '0';
            $('#cboestadoFilter').val(String('0')).trigger('change.select2');
        }, 200);
    }
    var oTable;
    $scope.listUnidadMedida = [];
    $scope.get_Uniad_Medida = function () {
        $scope.loader = true;
        umServices.getUnidadMedida()
        .then(function (res) {
            $scope.listUnidadMedida = [];
            $scope.listUnidadMedida = res;
            $scope.loader = false;
    
            $timeout(function () {
                if (oTable !== 'data') {
                    oTable = 'data';
                    auxiliarServices.initFooTable('tblUnidadMedida', 'inputSearch');
                } else {
                    $('#tblUnidadMedida').trigger('footable_initialize');
                }
            }, 500);
        }, function (err) {
            console.log(err);
        });
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
                         '<h2  style="text-align:center;">' + ' Reporte Unidad Medida' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tblUnidadMedida'),
                     ctx = { worksheet: 'ReporteUnidadMedida', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReporteUnidadMedida.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }
    $scope.Flag_modoEdicion = false;

    $scope.objeto_parametros = {
        id_unidadMedida: 0,
        codigo_UnidadMedida: '',
        nombre_UnidadMedida: '',
        abreviatura_UnidadMedida: '',
        estado: 1,
        usuario_Creacion: 1,
    }


    $scope.clean = function () {

        $scope.objeto_parametros.id_unidadMedida = 0;
        $scope.objeto_parametros.codigo_UnidadMedida = '';
        $scope.objeto_parametros.nombre_UnidadMedida = '';
        $scope.objeto_parametros.abreviatura_UnidadMedida = '';
        $scope.objeto_parametros.estado = 1;
        $scope.objeto_parametros.usuario_Creacion = 1;


        $('.selectModal').val("0").trigger('change.select2');
        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';


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



    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $('#ModalUnidadMedida').modal('show');

    }
    $('#ModalUnidadMedida').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#txtuni_med').focus();
        }, 500)

    });


    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;
        $scope.EdicionRegistros(obj);
        $('#ModalUnidadMedida').modal('show');

    }
    $scope.listStatus = [];
    $scope.get_listStatus = function () {
        $scope.listStatus.push(
            { id: 0, descripcion: '[ ----   Todos  --- ]' },
            { id: 1, descripcion: 'Activos' },
            { id: 2, descripcion: 'Anulados' }
            )
    }

    $scope.EdicionRegistros = function (obj) {
        $scope.loaderProd = true;
        $scope.Flag_modoEdicion = true;
        $scope.objeto_parametros.id_unidadMedida = obj.id_unidadMedida;
        $scope.objeto_parametros.codigo_UnidadMedida = obj.codigo_UnidadMedida;
        $scope.objeto_parametros.nombre_UnidadMedida = obj.nombre_UnidadMedida;
        $scope.objeto_parametros.abreviatura_UnidadMedida = obj.abreviatura_UnidadMedida;
        $scope.objeto_parametros.estado = obj.estado;

        if (obj.estado == 1) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = 'Activo';
            $scope.objEstados.colorText = '#2c5ca9';
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }

    }

    $scope.validarCodigoUnidad = function () {
        var result = false;
        $scope.listUnidadMedida.forEach(function (item, index) {
            if (item.codigo_UnidadMedida == $scope.objeto_parametros.codigo_UnidadMedida) {
                result = true;
            }
        })
        //console.log(result);
        return result;
    }

    $scope.GuardarRegistro = function () {

        if (umServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }

        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo

            if ($scope.validarCodigoUnidad() == true) {
                auxiliarServices.NotificationMessage('Sistemas', 'El Codigo ingresado ya existe, Vuelva a Ingresar', 'error', '#ff6849', 1800);
                return;

            }
            $scope.loaderSave = true;
            umServices.saveUnidadMedidas($scope.objeto_parametros)
            .then(function (data) {
                $scope.listUnidadMedida.push(data);
                $scope.get_Uniad_Medida();
                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                        $('#ModalUnidadMedida').modal('hide');
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
                    auxiliarServices.initSweetAlert(paramsErr)
                        .then(function (res) {

                        });
                    $scope.loaderSave = false;
                    console.log(err);
                }, 500)
            })

        } else {  //actualizar

            $scope.loaderSave = true;
            umServices.update_UnidadMedida($scope.objeto_parametros)
            .then(function (data) {
                if (data == "OK") {
                    $scope.listUnidadMedida.push(data);
                    $scope.get_Uniad_Medida();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params)
                            .then(function (res) {
                                $('#ModalUnidadMedida').modal('hide');
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
                            $('#ModalUnidadMedida').modal('hide');
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
            text: 'Esta por anular una Unidad Medida',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                umServices.anular_UnidadMedida(item.id_unidadMedida)
                   .then(function (res) {
                       var index = $scope.listUnidadMedida.indexOf(item);
                       $scope.listUnidadMedida[index].estado = 0;
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

    //ng-keydown="ValidateEnterUni($event);"
    $scope.ValidateEnterUni = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtnombre_uni').focus();
        }
    }

    //ng-keydown="ValidateEnterC($event);"
    $scope.ValidateEnterC = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtabre_uni').focus();
        }
    }

    // FISTRO  DE ESTADO EN LA TABLA PRINCIPAL --TODOS--- ---ACTIVOS-----   ---ANULADOS-----
    $scope.estados = '0';
    $scope.changeEstado = function (res) {

        $scope.filterStatus(res);
    }


    $scope.filterStatus = function (status) {
        var addrow = $("#tblUnidadMedida")
        $("#tblUnidadMedida").footable();

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

})