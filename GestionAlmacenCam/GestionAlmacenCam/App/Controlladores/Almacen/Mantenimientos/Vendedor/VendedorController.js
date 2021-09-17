var app = angular.module('appGestion.VendedorController', [])

app.controller('CtrlVendedor', function ($scope, loginServices, $location, $timeout, auxiliarServices, AuditarServices, VendedorServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de los Vendedores");
        $scope.titleModal = "Registro del Vendedor";
        $scope.loaderSave = false;

        $scope.getlistVendedor();
    }

    $scope.listVendedor = [];
    $scope.getlistVendedor = function()
    {
        $scope.loader = true;
        VendedorServices.getVendedor()
        .then(function (res) {
            $scope.listVendedor = [];
            $scope.listVendedor = res;
            $scope.loader = false;
            $timeout(function () {
                auxiliarServices.initFooTable('tbl_Vendedor', 'inputSearch');
            }, 500)
        }, function (err) {
            console.log(err);
        });
    }
  
    $scope.Flag_modoEdicion = false;

    $scope.objeto_parametros = {
        id_vendedor: 0,
        ape_PaternoVendedor: '',
        ape_MaternoVendedor: '',
        nombreVendedor: '',
        ubicacionVendedor: '',
        documentoVendedor:'',
        estado: 1,
        usuario_Creacion: 1,
    }
       

    $scope.clean = function () {

        $scope.objeto_parametros.id_vendedor = 0;
        $scope.objeto_parametros.ape_PaternoVendedor = '';
        $scope.objeto_parametros.ape_MaternoVendedor = '';
        $scope.objeto_parametros.nombreVendedor = '';
        $scope.objeto_parametros.ubicacionVendedor = '';
        $scope.objeto_parametros.documentoVendedor = '';
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


    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $('#Modalvendedor').modal('show');
        
    }
    $('#Modalvendedor').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#txtnombre_vend').focus();
        }, 500)

    });

    
    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;        
       
        $scope.EdicionRegistros(obj);
        $('#Modalvendedor').modal('show');
 
    }

   
    $scope.EdicionRegistros = function (obj) {
        $scope.loaderProd = true;
        $scope.Flag_modoEdicion = true;
        $scope.objeto_parametros.id_vendedor = obj.id_vendedor;
        $scope.objeto_parametros.ape_PaternoVendedor = obj.ape_PaternoVendedor;
        $scope.objeto_parametros.ape_MaternoVendedor = obj.ape_MaternoVendedor;
        $scope.objeto_parametros.nombreVendedor = obj.nombreVendedor;
        $scope.objeto_parametros.ubicacionVendedor = obj.ubicacionVendedor;
        $scope.objeto_parametros.documentoVendedor = obj.documentoVendedor;
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

        if (VendedorServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }
        
        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            $scope.loaderSave = true;
            VendedorServices.save_Vendedor($scope.objeto_parametros)
            .then(function (data) {
                $scope.listVendedor.push(data);
                $scope.getlistVendedor();
                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                        $('#Modalvendedor').modal('hide');
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
            VendedorServices.update_Vendedor($scope.objeto_parametros)
            .then(function (data) {
                if (data == "Ok") {
                    $scope.listVendedor.push(data);
                    $scope.getlistVendedor();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params)
                            .then(function (res) {
                                $('#Modalvendedor').modal('hide');
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
                            $('#Modalvendedor').modal('hide');
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
            text: 'Esta por anular un vendedor',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res==true) {
                VendedorServices.anular_Vendedor(item.id_vendedor)
                   .then(function (res) {
                       var index = $scope.listVendedor.indexOf(item);
                       $scope.listVendedor[index].estado = 0;
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
    $scope.Validationletter = function (event) {
        var keys = {

        };
        for (var index in keys) {
            if (!keys.hasOwnProperty(index)) continue;
            if (event.charCode== keys[index] || event.keyCode == keys[index]) {

                return;
            }
        }
        event.preventDefault();
        auxiliarServices.NotificationMessage('Alerta..!', 'Por favor ingrese solo Letras...', 'error', '#ff6849', 1500);
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
                if (event.which == 13) {
                    $('#txtdescr_veh').focus();
                }
                return;
            }
        }
        event.preventDefault();
        auxiliarServices.NotificationMessage('Alerta..!', 'Por favor ingrese solo Numeros...', 'error', '#ff6849', 1500);
    };
    


    $scope.keypress1 = function(ev)
    {
        if(ev.which==13)
        {
            $('#txtapellP_vend').focus();
        }
    }
    $scope.keypress2 = function (ev) {
        if (ev.which == 13) {
            $('#txtapellm_vend').focus();
        }
    }
    $scope.keypress3 = function (ev) {
        if (ev.which == 13) {
            $('#txtdoc_veh').focus();
        }
    }
    $scope.keypress3 = function (ev) {
        if (ev.which == 13) {
            $('#txtdoc_veh').focus();
        }
    }
    $scope.keypress4 = function (ev) {
        if (ev.which == 13) {
            $('#btn-save').focus();
        }
    }

    $scope.estados = 0;
    $scope.changeEstado = function (res) {

        $scope.filterStatus(res);
    }


    $scope.filterStatus = function (status) {
        var addrow = $("#tbl_Vendedor")
        $("#tbl_Vendedor").footable();

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