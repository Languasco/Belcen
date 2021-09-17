var app = angular.module('appGestion.TipoDocController', [])

app.controller('CtrlTipoD', function ($scope, loginServices, $location, $timeout, auxiliarServices, AuditarServices,TipoDocumentoServices ) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Tipo de Documento");
        $scope.titleModal = "Registro de TipoDocumento ";
        $scope.loaderSave = false;
        $scope.get_Tipo_Documento();


        $scope.get_listStatus();
        setTimeout(function () {
            $(".select_modal").select2();
            $scope.estados = '0';
            $('#cboestadoFilter').val(String('0')).trigger('change.select2');
        }, 200);
    }

    $scope.ListandoTipoD = [];
    $scope.get_Tipo_Documento = function()
    {
        $scope.loader = true;
        TipoDocumentoServices.getTipoDocumento()
        .then(function (res) {
            $scope.ListandoTipoD = [];
            $scope.ListandoTipoD = res;
            $scope.loader = false;
            $timeout(function () {
                auxiliarServices.initFooTable('tbl_TipoDocumento', 'inputSearch');
            }, 500)
        }, function (err) {
            console.log(err);
        });
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
        id_TipoDocumento: 0,
        codigoInterno_TipoDocumento: '',
        TipoDocumento: '',
        Descripcion_TipoDocumento:'',
        codigoSunat_TipoDocumento: '',
        AfectoRetencion_TipoDocumento:'',
        estado: 1,
        usuario_creacion: 1,
    }
       

    $scope.clean = function () {

        $scope.objeto_parametros.id_TipoDocumento = 0;
        $scope.objeto_parametros.codigoInterno_TipoDocumento = '';
        $scope.objeto_parametros.TipoDocumento = '';
        $scope.objeto_parametros.Descripcion_TipoDocumento = '';
        $scope.objeto_parametros.codigoSunat_TipoDocumento = '';
        $scope.objeto_parametros.AfectoRetencion_TipoDocumento = '';
        $scope.objeto_parametros.estado =1;
        $scope.objeto_parametros.usuario_creacion = 1;


        $('.selectModal').val("0").trigger('change.select2');
        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';
      
        $scope.objEstados_Retencion.activo = true;
        $scope.objEstados_Retencion.text = 'SI';
        $scope.objEstados_Retencion.colorText = '#2c5ca9';
       

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
    $scope.objEstados_Retencion = {
        activo: true,
        text: 'SI',
        colorText: '#2c5ca9'
    }
    $scope.changeStatus_Envio = function (status) {
        if (status) {
            $scope.objEstados_Retencion.activo = true;
            $scope.objEstados_Retencion.text = "SI";
            $scope.objEstados_Retencion.colorText = "#2c5ca9";
        } else {
            $scope.objEstados_Retencion.activo = false;
            $scope.objEstados_Retencion.text = "NO";
            $scope.objEstados_Retencion.colorText = "#b3192c";
        }
    }

    $('#ModalTipoDocumento').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#txt_codigo').focus();
        }, 500)

    });
    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $('#ModalTipoDocumento').modal('show');
    }
    
    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;        
       
        $scope.EdicionRegistros(obj);
        $('#ModalTipoDocumento').modal('show');
 
    }

   
    $scope.EdicionRegistros = function (obj) {
        $scope.loaderProd = true;
        $scope.Flag_modoEdicion = true;
        $scope.objeto_parametros.id_TipoDocumento = obj.id_TipoDocumento;
        $scope.objeto_parametros.codigoInterno_TipoDocumento = obj.codigoInterno_TipoDocumento;
        $scope.objeto_parametros.TipoDocumento = obj.TipoDocumento;
        $scope.objeto_parametros.Descripcion_TipoDocumento = obj.Descripcion_TipoDocumento;
        $scope.objeto_parametros.codigoSunat_TipoDocumento = obj.codigoSunat_TipoDocumento;
        $scope.objeto_parametros.AfectoRetencion_TipoDocumento = obj.AfectoRetencion_TipoDocumento;
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

        if (obj.AfectoRetencion_TipoDocumento == 'SI') {
            $scope.objEstados_Retencion.activo = true;
            $scope.objEstados_Retencion.text = 'SI';
            $scope.objEstados_Retencion.colorText = '#2c5ca9';
        } else {
            $scope.objEstados_Retencion.activo = false;
            $scope.objEstados_Retencion.text = "NO";
            $scope.objEstados_Retencion.colorText = "#b3192c";
        }
        

    }

    // VALIDACION DE CODIGO INTERNO DE TIPO DE DOCUMENTO
    $scope.validarCodigoInterno= function () {
        var result = false;
        $scope.ListandoTipoD.forEach(function (item, index) {
            if (item.codigoInterno_TipoDocumento == $scope.objeto_parametros.codigoInterno_TipoDocumento) {
                result = true;
            }
        })
        return result;
    }

    // VALIDACION DE CODIGO SUNAT DE TIPO DE DOCUMENTO
    $scope.validarCodSunat = function () {
        var result = false;
        $scope.ListandoTipoD.forEach(function (item, index) {
            if (item.codigoSunat_TipoDocumento == $scope.objeto_parametros.codigoSunat_TipoDocumento) {
                result = true;
            }
        })
        return result;
    }

    $scope.GuardarRegistro = function () {

        if (TipoDocumentoServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }
        
        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;
        $scope.objeto_parametros.AfectoRetencion_TipoDocumento = $scope.objEstados_Retencion.activo == true ? 'SI' : 'NO';
        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            
            if ($scope.validarCodigoInterno() == true) {
                auxiliarServices.NotificationMessage('Sistemas', 'El codigo ingresado ya existe, Vuelva a ingresar', 'error', '#ff6849', 1800);
                return;

            }
            if ($scope.validarCodSunat() == true) {
                auxiliarServices.NotificationMessage('Sistemas', 'El codigo sunat ingresado ya existe, Vuelva a ingresar', 'error', '#ff6849', 1800);
                return;

            }
            $scope.loaderSave = true;
            TipoDocumentoServices.save_TipoDocumento($scope.objeto_parametros)
            .then(function (data) {
                $scope.ListandoTipoD.push(data);
                $scope.get_Tipo_Documento();
                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                        $('#ModalTipoDocumento').modal('hide');
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
            TipoDocumentoServices.update_TipoDocumento($scope.objeto_parametros)
            .then(function (data) {
                if (data == "Ok") {
                    $scope.ListandoTipoD.push(data);
                    $scope.get_Tipo_Documento();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params)
                            .then(function (res) {
                                $('#ModalTipoDocumento').modal('hide');
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
                            $('#ModalTipoDocumento').modal('hide');
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
            text: 'Esta por anular el TipoDocumento',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res==true) {
                TipoDocumentoServices.anular_TipoDocumento(item.id_TipoDocumento)
                   .then(function (res) {
                       var index = $scope.ListandoTipoD.indexOf(item);
                       $scope.ListandoTipoD[index].estado = 0;
                   })
            }
        });
    }
     
    $scope.getAuditoria = function (item) {

        var fechaEdicion = auxiliarServices.formatDate(item.fecha_edicion);
        var fechaCreacion = auxiliarServices.formatDate(item.usuario_creacion);
        var usuedicion = "";
        var usucreacion = "";

        AuditarServices.getAuditar(item.usuario_edicion).then(function (data) {
            usuedicion = data[0].nombre_personal + " " + data[0].apellido_personal;
            AuditarServices.getAuditar(item.usuario_creacion).then(function (res) {
                usucreacion = res[0].nombre_personal + " " + res[0].apellido_personal;

                var message = "Fecha Creación : " + fechaCreacion + "</br>" +
                              "Usuario Creación : " + usucreacion + "</br>" +
                              "Fecha Edición : " + fechaEdicion + "</br>" +
                              "Usuario Edición : " + usuedicion + "</br>"
                auxiliarServices.NotificationMessage('Sistemas', message, 'success', '#008000', 5000);

            })
        })

    }
    
   


    // FISTRO  DE ESTADO EN LA TABLA PRINCIPAL --TODOS--- ---ACTIVOS-----   ---ANULADOS-----
    $scope.estados = '0';
    $scope.changeEstado = function (res) {

        $scope.filterStatus(res);
    }


    $scope.filterStatus = function (status) {
        var addrow = $("#tbl_TipoDocumento")
        $("#tbl_TipoDocumento").footable();

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

    //ng-keydown="ValidateEntertipoD($event);"
    $scope.ValidateEntertipoD = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txt_tipoD').focus();
        }
    }

    //ng-keydown="ValidateEnterC($event);"
    $scope.ValidateEnterC = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtCodigo_sun').focus();
        }
    }
    //ng-keydown="ValidateEnterD($event);"
    $scope.ValidateEnterD = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtDesc_tipoD').focus();
        }
    }


})