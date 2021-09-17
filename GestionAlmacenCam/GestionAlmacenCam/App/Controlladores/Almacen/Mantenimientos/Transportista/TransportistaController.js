var app = angular.module('appGestion.TransportistaController', [])

app.controller('CtrlTransportista', function ($scope, loginServices, $location, $timeout, auxiliarServices, AuditarServices, TransportistaServices, VehiculoServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Transportistas");
        $scope.titleModal = "Registro de Transportista";
        $scope.loaderSave = false;
        $scope.get_Transportistas();
        $scope.get_Listando_Vehiculo();


        $scope.get_listStatus();
        setTimeout(function () {
            $(".select_modal").select2();
            $scope.estados = '0';
            $('#cboestadoFilter').val(String('0')).trigger('change.select2');
        }, 200);
       
    }
    $scope.listandoTrans = [];
    var oTable;
    $scope.get_Transportistas = function()
    {
        $scope.loader = true;
        TransportistaServices.getTransportista()
        .then(function (res) {
            $scope.listandoTrans = [];
            $scope.listandoTrans = res;
            $scope.loader = false;
      
            $timeout(function () {
                if (oTable !== 'data') {
                    oTable = 'data';
                    auxiliarServices.initFooTable('tbl_Transportits', 'inputSearch');
                } else {
                    $('#tbl_Transportits').trigger('footable_initialize');
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
                         '<h2  style="text-align:center;">' + ' Reporte Transportistas' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tbl_Transportits'),
                     ctx = { worksheet: 'ReporteTransportistas', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReporteTransportistas.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }
    $scope.Lista_Vehiculos = [];
    $scope.get_Listando_Vehiculo = function () {
        $scope.loader = true;
        VehiculoServices.getVehiculo()
            .then(function (res) {
                $scope.loader = false;
                $scope.Lista_Vehiculos = [];
                $scope.Lista_Vehiculos = res;
                $timeout(function () {
                    $(".select_modal").select2();
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
        id_Transportista: 0,
        id_vehiculo: '0',
        nombre_Transportista: '',
        documento_Transportista: '',
        telefono_Transportista: '',
        direcion_Transportista:'',
        estado: 1,
        usuario_Creacion: 1,
    }
       

    $scope.clean = function () {

        $scope.objeto_parametros.id_Transportista = 0;
        $scope.objeto_parametros.id_vehiculo = '0';
        $scope.objeto_parametros.nombre_Transportista = '';
        $scope.objeto_parametros.documento_Transportista = '';
        $scope.objeto_parametros.telefono_Transportista = '';
        $scope.objeto_parametros.direcion_Transportista = '';
        $scope.objeto_parametros.estado =1;
        $scope.objeto_parametros.usuario_Creacion = 1;


        $('.selectModal').val("0").trigger('change.select2');
        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';
      
        setTimeout(function () {
            $('#cbo_vehiculo').val("0").trigger('change.select2'); 
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
            $scope.objEstados.text = "Activo";
            $scope.objEstados.colorText = "#2c5ca9";
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }
    }


    $('#ModalTransp').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#txtnombre_vend').focus();
        }, 500)

    });

  

    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $('#ModalTransp').modal('show');
    }
    
    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;        
       
        $scope.EdicionRegistros(obj);
        $('#ModalTransp').modal('show');
 
    }

   
     $scope.validarDocumentoTrans = function () {
        var result = false;
        $scope.listandoTrans.forEach(function (item, index) {
            if (item.documento_Transportista == $scope.objeto_parametros.documento_Transportista) {
                result = true;
            }
        })
        //console.log(result);
        return result;
    }

    $scope.EdicionRegistros = function (obj) {
        $scope.loaderProd = true;
        $scope.Flag_modoEdicion = true;
        $scope.objeto_parametros.id_Transportista = obj.id_Transportista;
        $scope.objeto_parametros.id_vehiculo = obj.id_vehiculo;
        $scope.objeto_parametros.nombre_Transportista = obj.nombre_Transportista;
        $scope.objeto_parametros.documento_Transportista = obj.documento_Transportista;
        $scope.objeto_parametros.telefono_Transportista = obj.telefono_Transportista;
        $scope.objeto_parametros.direcion_Transportista = obj.direcion_Transportista;
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
        setTimeout(function () {
            $('#cbo_vehiculo').val(obj.id_vehiculo).trigger('change.select2');
        }, 100);

    }


    $scope.GuardarRegistro = function () {
        
        if (TransportistaServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }
        
        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo

            if ($scope.validarDocumentoTrans() == true)
            {
                auxiliarServices.NotificationMessage('Sistemas', 'El Documento ingresado ya existe, Vuelva a Ingresar', 'error', '#ff6849', 1800);
                return;

            }
            $scope.loaderSave = true;
            TransportistaServices.save_transportista($scope.objeto_parametros)
            .then(function (data) {
                $scope.listandoTrans.push(data);
                $scope.get_Transportistas();
                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                        $('#ModalTransp').modal('hide');
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
            TransportistaServices.update_transportista($scope.objeto_parametros)
            .then(function (data) {
                if (data == "Ok") {
                    $scope.listandoTrans.push(data);
                    $scope.get_Transportistas();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params)
                            .then(function (res) {
                                $('#ModalTransp').modal('hide');
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
                            $('#ModalTransp').modal('hide');
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
            if (res==true) {
                TransportistaServices.anular_transportista(item.id_Transportista)
                   .then(function (res) {
                       var index = $scope.listandoTrans.indexOf(item);
                       $scope.listandoTrans[index].estado = 0;
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
        var addrow = $("#tbl_Transportits")
        $("#tbl_Transportits").footable();

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

    //ng-keydown="ValidateEnter($event);"
    $scope.ValidateEnterN = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtnombre_trans').focus();
        }
    }

    //ng-keydown="ValidateEnter($event);"
    $scope.ValidateEnterC = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtcel_trs').focus();
        }
    }
    //ng-keydown="ValidateEnter($event);"
    $scope.ValidateEnterD = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtdirec_trs').focus();
        }
    }


})