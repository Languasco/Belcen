var app = angular.module('appGestion.GirosNegocioController', [])

app.controller('CtrlGiro', function ($scope, loginServices, $location, $timeout, auxiliarServices, AuditarServices, GiroServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Giros del Negocio :");
        $scope.titleModal = "Registro de Giros del Negocio";
        $scope.loaderSave = false;
        $scope.get_Giros_Negocio();

        $scope.get_listStatus();
        setTimeout(function () {
            $(".select_modal").select2();
            $scope.estados = '0';
            $('#cboestadoFilter').val(String('0')).trigger('change.select2');
        }, 200);
    }

    $scope.ListandoGirosN = [];
    var oTable;
    $scope.get_Giros_Negocio = function()
    {
        $scope.loader = true;
        GiroServices.getGiroNegocio()
        .then(function (res) {
            $scope.ListandoGirosN = [];
            $scope.ListandoGirosN = res;
            $scope.loader = false;
    
            $timeout(function () {
                if (oTable !== 'data') {
                    oTable = 'data';
                    auxiliarServices.initFooTable('tbl_girosN', 'inputSearch');
                } else {
                    $('#tbl_girosN').trigger('footable_initialize');
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
                         '<h2  style="text-align:center;">' + ' ReporteGiroNegocio ' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tbl_girosN'),
                     ctx = { worksheet: 'ReporteGiroNegocio', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReporteGiroNegocio.xls";
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

    $scope.objeto_parametros = {
        id_GiroNegocio: 0,
        Nombre_GiroNegocio: '',
        descripcion_GiroNegocio: '',
        abreviatura_GiroNegocio: '',
        estado: 1,
        usuario_Creacion: 1
    }
       

    $scope.clean = function () {

        $scope.objeto_parametros.id_GiroNegocio = 0;
        $scope.objeto_parametros.Nombre_GiroNegocio = '';
        $scope.objeto_parametros.descripcion_GiroNegocio = '';
        $scope.objeto_parametros.abreviatura_GiroNegocio = '';
        $scope.objeto_parametros.estado =1;
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

    $('#modalGiroNegocio').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#txtNombre_GN').focus();
        }, 500)

    });

    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $('#modalGiroNegocio').modal('show');
    }
    
    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;        
       
        $scope.EdicionRegistros(obj);
        $('#modalGiroNegocio').modal('show');
 
    }

   
    $scope.EdicionRegistros = function (obj) {
        $scope.loaderProd = true;
        $scope.Flag_modoEdicion = true;
        $scope.objeto_parametros.id_GiroNegocio = obj.id_GiroNegocio;
        $scope.objeto_parametros.Nombre_GiroNegocio = obj.Nombre_GiroNegocio;
        $scope.objeto_parametros.descripcion_GiroNegocio = obj.descripcion_GiroNegocio;
        $scope.objeto_parametros.abreviatura_GiroNegocio = obj.abreviatura_GiroNegocio;
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
    
    $scope.GuardarRegistro = function () {

        if (GiroServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }
        
        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            $scope.loaderSave = true;
            GiroServices.save_GirosNegocio($scope.objeto_parametros)
            .then(function (data) {
                console.log(data);
                $scope.ListandoGirosN.push(data);
                $scope.get_Giros_Negocio();
                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                        $('#modalGiroNegocio').modal('hide');
                    });
                    $scope.loaderSave = false;
                }, 500)
            }, function (error) {
                console.log(error);
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
            GiroServices.update_GirosNegocio($scope.objeto_parametros)
            .then(function (data) {
                if (data == "OK") {
                    $scope.ListandoGirosN.push(data);
                    $scope.get_Giros_Negocio();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params)
                            .then(function (res) {
                                $('#modalGiroNegocio').modal('hide');
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
                            $('#modalGiroNegocio').modal('hide');
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
            text: 'Esta por anular el CanalNegocio',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res==true) {
                GiroServices.anular_GirosNegocio(item.id_GiroNegocio)
                   .then(function (res) {
                       var index = $scope.ListandoGirosN.indexOf(item);
                       $scope.ListandoGirosN[index].estado = 0;
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
        var addrow = $("#tbl_girosN")
        $("#tbl_girosN").footable();

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

    //ng-keydown="ValidateEnterGN($event);"
    $scope.ValidateEnterGN = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtAbrevi_GN').focus();
        }
    }

    //ng-keydown="ValidateEnterN($event);"
    $scope.ValidateEnterN = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtdescr_GN').focus();
        }
    }

})