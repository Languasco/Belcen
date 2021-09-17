var app = angular.module('appGestion.CargoController', [])

app.controller('CtrlCargo', function ($scope, loginServices, $location, $timeout, auxiliarServices, AuditarServices, CargoServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Cargo");
        $scope.titleModal = "Registro de Cargo";
        $scope.loaderSave = false;
        $(".filterEstado").select2();
        $scope.getlistCargos();

        $scope.get_listStatus();

        setTimeout(function () {
            $(".select_modal").select2();
            $scope.estados = '0';
            $('#cboestadoFilter').val(String('0')).trigger('change.select2');
        }, 200);
    }

    $scope.listCargo = [];
    $scope.getlistCargos = function()
    {
        $scope.loader = true;
        CargoServices.getCargos()
        .then(function (res) {
            $scope.listCargo = [];
            $scope.listCargo = res;
            $scope.loader = false;
            $timeout(function () {
                auxiliarServices.initFooTable('tbl_cargos', 'inputSearch');
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
        id_CargoPersonal: 0,
        codigoInterno_CargoPersonal: '',
        descripcion_CargoPersonal: '',
        estado: 1,
        usuario_creacion: 1,
    }
       

    $scope.clean = function () {

        $scope.objeto_parametros.id_CargoPersonal = 0;
        $scope.objeto_parametros.codigoInterno_CargoPersonal = '';
        $scope.objeto_parametros.descripcion_CargoPersonal = '';
        $scope.objeto_parametros.estado = 1;
        $scope.objeto_parametros.usuario_creacion = 1;


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


    $('#ModalCargo').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#txtcod_cargoPer').focus();
        }, 500)

    });
    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $('#ModalCargo').modal('show');
    }
    
    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;  
        $scope.EdicionRegistros(obj);
        $('#ModalCargo').modal('show');
 
    }

   
    $scope.EdicionRegistros = function (obj) {
        $scope.loaderProd = true;
        $scope.Flag_modoEdicion = true;
        $scope.objeto_parametros.id_CargoPersonal = obj.id_CargoPersonal;
        $scope.objeto_parametros.codigoInterno_CargoPersonal = obj.codigoInterno_CargoPersonal;
        $scope.objeto_parametros.descripcion_CargoPersonal = obj.descripcion_CargoPersonal;
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

        if (CargoServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }
        
        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            $scope.loaderSave = true;
            CargoServices.save_Cargo($scope.objeto_parametros)
            .then(function (data) {
                $scope.listCargo.push(data);
                $scope.getlistCargos();
             
                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                        $('#ModalCargo').modal('hide');
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
            CargoServices.update_Cargo($scope.objeto_parametros)
            .then(function (data) {
                if (data == "Ok") {
                    $scope.listCargo.push(data);
                    $scope.getlistCargos();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params)
                            .then(function (res) {
                                $('#ModalCargo').modal('hide');
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
                            $('#ModalCargo').modal('hide');
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
            text: 'Esta por anular un cargo',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params)
            .then(function (res) {
                if (res == true) {
                    CargoServices.delete_Cargo(item.id_CargoPersonal)
                   .then(function (res) {
                       var index = $scope.listCargo.indexOf(item);
                       $scope.listCargo[index].estado = 0;
                       $scope.getlistCargos();
                   })
            }
        });
    }
     
    $scope.getAuditoria = function (item) {

        var fechaEdicion = auxiliarServices.formatDate(item.fecha_Eedicion);
        var fechaCreacion = auxiliarServices.formatDate(item.fecha_creacion);
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


    

    $scope.estados = '0';
    $scope.changeEstado = function (res) {

        $scope.filterStatus(res);
    }

    $scope.filterStatus = function (status) {
        var addrow = $("#tbl_cargos")
        $("#tbl_cargos").footable();

        if(status==0)
        {
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
                if (event.which === 13) {
                    $('#txtcargo_per').focus();
                }
                return;
            }

        }
        event.preventDefault();
        auxiliarServices.NotificationMessage('Alerta..!', 'Por favor ingrese solo Numeros...', 'error', '#ff6849', 1500);
    };


})