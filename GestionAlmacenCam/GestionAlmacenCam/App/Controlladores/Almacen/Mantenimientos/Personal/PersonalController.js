var app = angular.module('appGestion.PersonalController', [])

app.controller('ctrlPersonal', function ($scope, loginServices, $location, $timeout, auxiliarServices, PersonalServices, AuditarServices, CargoServices, PerfilServices) {
    

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Personal");
        $scope.titleModal = "Registro de Personal";
        $scope.disabledContent = "";
        $scope.loaderSave = false;


        $scope.get_ListandoCargos();
        $scope.get_ListandoPersonales();
        $scope.get_listStatus();
        setTimeout(function () {
            //$(".select_modal").select2();            
            $('#cboestadoFilter').val(String('0')).trigger('change.select2');
        }, 200);
    }
    
    $scope.listStatus = [];
    $scope.get_listStatus = function () {
        $scope.listStatus.push(
            { id: 0, descripcion: '[ ----   Todos  --- ]' },
            { id: 1, descripcion: 'Activos' },
            { id: 2, descripcion: 'Anulados' }
            )
    }
    $scope.changeEstado = function (res) {
        console.log(res);
        $scope.filterStatus(res);
    }
    $scope.filterStatus = function (status) {
        var addrow = $("#tbl_personal")
        $("#tbl_personal").footable();

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
    $scope.Lista_Personal = [];
    $scope.get_ListandoPersonales = function () {
        $scope.loader = true;
        PersonalServices.getPersonales().then(function (data) {
            $scope.loader = false;
            $scope.Lista_Personal = [];
            $scope.Lista_Personal = data;
            $timeout(function () { auxiliarServices.initFooTable('tbl_personal', 'inputSearch'); }, 500)
        }, function (err) {
            console.log(err);
        })
    }


 

    $('document').ready(function () {
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy',
            });
        }, 500);
    });


    $scope.Lista_TipoDoc = [];
    $scope.get_Listando_TipoDocumentos = function () {
        $scope.Lista_TipoDoc.push({
            id: 'DNI',
            des: 'DNI'
        })
        $scope.Lista_TipoDoc.push({
            id: 'CARNT',
            des: 'CARNET'
        })
        $timeout(function () {
            $(".select_modals").select2();
        })
    }
    $scope.get_Listando_TipoDocumentos();

    $scope.Lista_TipoPersonal = [];
    $scope.get_Listando_TipoPersonal = function () {
        $scope.Lista_TipoPersonal.push({
            id: '1',
            des: 'COBERTURA'
        })
        $scope.Lista_TipoPersonal.push({
            id: '2',
            des: 'MAYORISTA'
        })
        $timeout(function () {
            $(".select_modalss").select2();
        })
    }

    $scope.get_Listando_TipoPersonal();


    $scope.Lista_Cargo = [];
    $scope.get_ListandoCargos = function () {
        $scope.loader = true;
        CargoServices.getCargos().then(function (data) {
            $scope.loader = false;
            $scope.Lista_Cargo = [];
            $scope.Lista_Cargo = data;

            $scope.get_ListandoPerfiles();
        }, function (err) {
            console.log(err);
        })
    }

    $scope.Lista_Perfil = [];
    $scope.get_ListandoPerfiles = function () {
        $scope.loader = true;
        PerfilServices.getPerfiles().then(function (data) {
            $scope.loader = false;
            $scope.Lista_Perfil = [];
            $scope.Lista_Perfil = data;
            $timeout(function () {
                $(".select_modal").select2();
            })
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
                         '<h2  style="text-align:center;">' + ' Reporte Personal ' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tbl_personal'),
                     ctx = { worksheet: 'ReportePersonal', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReportePersonal.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }

    $scope.Flag_modoEdicion = false;

    $scope.objeto_parametros = {
        id_personal:'0', 
        nroDoc_personal:'', 
        tipoDoc_personal:'', 
        apellidos_personal:'', 
        nombres_personal:'', 
        tip_personal:'0', 
        id_cargo_personal:'0',
        fotoUrl_personal:'', 
        nroCelular_personal:'', 
        email_personal:'', 
        nombreUsario_personal:'', 
        contrasenia_personal:'', 
        envio_enlinea_personal:'',
        id_perfil: '0',
        codigo_personal: '',
        //fecha_cese:'', 
        estado:'1', 
        usuario_creacion :0
    }
       

    $scope.clean = function () {

        var nroDoc_personal = document.getElementById('nroDoc_personal')

        $scope.objeto_parametros.id_personal = '0';
        $scope.objeto_parametros.nroDoc_personal = '';
        $scope.objeto_parametros.tipoDoc_personal = '0';
        $scope.objeto_parametros.apellidos_personal = '';
        $scope.objeto_parametros.nombres_personal = '';
        $scope.objeto_parametros.tip_personal = '0';
        $scope.objeto_parametros.id_cargo_personal = '0';
        $scope.objeto_parametros.fotoUrl_personal = '';
        $scope.objeto_parametros.nroCelular_personal = '';
        $scope.objeto_parametros.email_personal = '';
        $scope.objeto_parametros.nombreUsario_personal = '';
        $scope.objeto_parametros.contrasenia_personal = '';
        $scope.objeto_parametros.envio_enlinea_personal = '';
        $scope.objeto_parametros.id_perfil = '0';
        $scope.objeto_parametros.codigo_personal = '';
        //$scope.objeto_parametros.fecha_cese = auxiliarServices.formatDateNow();
 
        $scope.objeto_parametros.estado =1;
        $scope.objeto_parametros.usuario_Creacion = auxiliarServices.getUserId();

        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';

        $scope.objEstados_Envio.activo = true;
        $scope.objEstados_Envio.text = 'SI';
        $scope.objEstados_Envio.colorText = '#2c5ca9';

        setTimeout(function () {
            nroDoc_personal.disabled = false;
            $('#cbo_tipoDoc_personal').val("0").trigger('change.select2');
            $('#cbo_id_cargo_personal').val("0").trigger('change.select2');
            $('#cbo_tip_personal').val("0").trigger('change.select2');
            $('#cbo_id_perfil').val("0").trigger('change.select2');
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

    $scope.objEstados_Envio = {
        activo: true,
        text: 'SI',
        colorText: '#2c5ca9'
    }

    $scope.changeStatus_Envio = function (status) {
        if (status) {
            $scope.objEstados_Envio.activo = true;
            $scope.objEstados_Envio.text = "SI";
            $scope.objEstados_Envio.colorText = "#2c5ca9";
        } else {
            $scope.objEstados_Envio.activo = false;
            $scope.objEstados_Envio.text = "NO";
            $scope.objEstados_Envio.colorText = "#b3192c";
        }
    }


    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $('#modalMantenimiento').modal('show');
    }
    
    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;        
       
        $scope.EdicionRegistros(obj);
        $('#modalMantenimiento').modal('show');
 
    }

    var objAux;

    $scope.EdicionRegistros = function (obj) {

       objAux = '';
        objAux = obj;
        var nroDoc_personal = document.getElementById('nroDoc_personal')
 
        $scope.objeto_parametros.id_personal = obj.id_personal;
        $scope.objeto_parametros.nroDoc_personal = obj.nroDoc_personal;
        $scope.objeto_parametros.tipoDoc_personal = obj.tipoDoc_personal;
        $scope.objeto_parametros.apellidos_personal = obj.apellidos_personal;
        $scope.objeto_parametros.nombres_personal = obj.nombres_personal;

        $scope.objeto_parametros.tip_personal = String(obj.tip_personal);
        $scope.objeto_parametros.id_cargo_personal = obj.id_cargo_personal;
        $scope.objeto_parametros.fotoUrl_personal = obj.fotoUrl_personal;
        $scope.objeto_parametros.nroCelular_personal = obj.nroCelular_personal;
        $scope.objeto_parametros.email_personal = obj.email_personal;

        $scope.objeto_parametros.nombreUsario_personal = obj.nombreUsario_personal;
        $scope.objeto_parametros.contrasenia_personal = obj.contrasenia_personal;
        $scope.objeto_parametros.envio_enlinea_personal = obj.envio_enlinea_personal;
        $scope.objeto_parametros.id_perfil = obj.id_perfil;

        $scope.objeto_parametros.codigo_personal = obj.codigo_personal;

        //$scope.objeto_parametros.fecha_cese = auxiliarServices.formatDateNotime(obj.fecha_cese);
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

        if (obj.envio_enlinea_personal == 'SI') {
            $scope.objEstados_Envio.activo = true;
            $scope.objEstados_Envio.text = 'SI';
            $scope.objEstados_Envio.colorText = '#2c5ca9';
        } else {
            $scope.objEstados_Envio.activo = false;
            $scope.objEstados_Envio.text = "NO";
            $scope.objEstados_Envio.colorText = "#b3192c";
        }

        setTimeout(function () {
            nroDoc_personal.disabled = true;
            $('#cbo_tipoDoc_personal').val(obj.tipoDoc_personal).trigger('change.select2');
            $('#cbo_id_cargo_personal').val(obj.id_cargo_personal).trigger('change.select2');
            $('#cbo_tip_personal').val(String(obj.tip_personal)).trigger('change.select2');
            $('#cbo_id_perfil').val(obj.id_perfil).trigger('change.select2');
        }, 100); 
    }

    $scope.GuardarRegistro = function () {
        if (PersonalServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }

        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;
        $scope.objeto_parametros.envio_enlinea_personal = $scope.objEstados_Envio.activo == true ? 'SI' : 'NO';

      


        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            //---validando que el codigo sea unico---
            if (ValidarCodigo($scope.objeto_parametros.nroDoc_personal) == true) {
                auxiliarServices.NotificationMessage('Sistemas', 'El Nro de Documento ya se agregó, verifique', 'error', '#ff6849',2000);
                return;
            }
            $scope.loaderSave = true;
            PersonalServices.save_Personal($scope.objeto_parametros)
            .then(function (data) {
                $scope.Lista_Personal.push(data);
                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                        $('#modalMantenimiento').modal('hide');
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
            PersonalServices.update_Personal($scope.objeto_parametros)
            .then(function (data) {
                
                //$scope.objeto_parametros.fecha_cese = auxiliarServices.formatDateNotime($scope.objeto_parametros.fecha_cese);

                if (data == "OK") {
                    var indexList = $scope.Lista_Personal.indexOf(objAux);

                    $scope.Lista_Personal[indexList].id_personal = $scope.objeto_parametros.id_personal;
                    $scope.Lista_Personal[indexList].nroDoc_personal = $scope.objeto_parametros.nroDoc_personal;
                    $scope.Lista_Personal[indexList].tipoDoc_personal = $scope.objeto_parametros.tipoDoc_personal;
                    $scope.Lista_Personal[indexList].apellidos_personal = $scope.objeto_parametros.apellidos_personal;
                    $scope.Lista_Personal[indexList].nombres_personal = $scope.objeto_parametros.nombres_personal;

                    $scope.Lista_Personal[indexList].tip_personal = $scope.objeto_parametros.tip_personal;
                    $scope.Lista_Personal[indexList].id_cargo_personal = $scope.objeto_parametros.id_cargo_personal;
                    $scope.Lista_Personal[indexList].fotoUrl_personal = $scope.objeto_parametros.fotoUrl_personal;
                    $scope.Lista_Personal[indexList].nroCelular_personal = $scope.objeto_parametros.nroCelular_personal;
                    $scope.Lista_Personal[indexList].email_personal = $scope.objeto_parametros.email_personal;

                    $scope.Lista_Personal[indexList].codigo_personal = $scope.objeto_parametros.codigo_personal;

                    $scope.Lista_Personal[indexList].nombreUsario_personal = $scope.objeto_parametros.nombreUsario_personal;
                    $scope.Lista_Personal[indexList].contrasenia_personal = $scope.objeto_parametros.contrasenia_personal;
                    $scope.Lista_Personal[indexList].envio_enlinea_personal = $scope.objeto_parametros.envio_enlinea_personal;
                    $scope.Lista_Personal[indexList].id_perfil = $scope.objeto_parametros.id_perfil;

                    //$scope.Lista_Personal[indexList].fecha_cese = $scope.objeto_parametros.fecha_cese;
                    $scope.Lista_Personal[indexList].estado = $scope.objeto_parametros.estado;


                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {
                            $('#modalMantenimiento').modal('hide');
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

                        });
                        $scope.loaderSave = false;
                        console.log(err);
                    }, 500)
                }
            }, function (error) {
                    $scope.loaderSave = false;
                    console.log(error);
            })

        }
    }
    
    function ValidarCodigo(nro_doc) {
        var estado = false;
        for (var i = 0; i < $scope.Lista_Personal.length; i++) {
            if (nro_doc == $scope.Lista_Personal[i].nroDoc_personal) {
                estado = true;
                break;
            }
        }
        return estado;
    }
    
    $scope.getAnular = function (item) {

        if (item.estado == 0 || item.estado == '0') {
            return;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por anular el Personal.',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res==true) {
                PersonalServices.anular_Personal(item.id_personal)
                   .then(function (res) {
                       var index = $scope.Lista_Personal.indexOf(item);
                       $scope.Lista_Personal[index].estado = 0;
                   })
            }
        });
    }
     
    $scope.getAuditoria = function (item) {
        var usuario_edicion = auxiliarServices.formatDate(item.usuario_edicion);
        var usuario_creacion = auxiliarServices.formatDate(item.usuario_creacion);
        var usuedicion = "";
        var usucreacion = "";
        
        AuditarServices.getAuditar(item.usuario_edicion).then(function (data) {
            usuedicion = data[0].nombre_personal + " " + data[0].apellido_personal;
            AuditarServices.getAuditar(item.usuario_creacion).then(function (res) {
                usucreacion = res[0].nombre_personal + " " + res[0].apellido_personal;

                var message = "Fecha Creación : " + usuario_creacion + "</br>" +
                              "Usuario Creación : " + usucreacion + "</br>" +
                              "Fecha Edición : " + usuario_edicion + "</br>" +
                              "Usuario Edición : " + usuedicion + "</br>"
                auxiliarServices.NotificationMessage('Sistemas', message, 'success', '#008000', 5000);

            })
        })

    }
    
})