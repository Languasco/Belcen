var app = angular.module('appGestion.GrupoDetController', [])

app.controller('CtrlDet', function ($scope, loginServices, $location, $timeout, auxiliarServices, AuditarServices, GrupoDetServices, GrupoCabServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de GrupoTabla_Det");
        $scope.titleModal = "Registro de GrupoTabla_Det";
        $scope.loaderSave = false;
        $scope.get_Listando_GrupoCab();
        $scope.get_Lista_datCabModal();
        $(".filterEstado").select2();
    }

    $scope.Lista_datCabModal = [];
    $scope.get_Lista_datCabModal = function () {
        $scope.loader = true;
        GrupoCabServices.getGrupoCab()
            .then(function (res) {
                $scope.loader = false;
                $scope.Lista_datCabModal = [];
                $scope.Lista_datCabModal = res;
                $timeout(function () {
                    $(".select_modal").select2();
                })
            }, function (err) {
                console.log(err);
            })
    }

    $scope.Lista_GrupoCab = [];
    $scope.get_Listando_GrupoCab = function () {
        $scope.loader = true;
        GrupoCabServices.getGrupoCab()
            .then(function (res) {
                $scope.loader = false;
                $scope.Lista_GrupoCab = [];
                $scope.Lista_GrupoCab = res;
                $timeout(function () {
                    $(".select_modal").select2();
                })
            }, function (err) {
                console.log(err);
            })
    }

    $scope.tbl_GrupoTablaCab = [];
    var oTable;
    $scope.changeSelect = function (select, idSelect) {
        if (select == "GrupoTabla_Cab") {
            
            GrupoDetServices.getGrupoTabla_Det(idSelect)
            .then(function (data) {
                if (data == '')
                {
                    auxiliarServices.NotificationMessage('Sistemas', 'El tipo de tabla se encuentra sin Datos', 'error', '#ff6849', 1500);
                } else {

                    $scope.loader = false;
                    $scope.tbl_GrupoTablaCab = [];
                    $scope.tbl_GrupoTablaCab = data;
                    $timeout(function () {
                        if (oTable == null) {
                            oTable = 'data'
                            auxiliarServices.initFooTable('tbl_GrupoTablaCab', 'inputSearch');
                        } else {
                            $('#tbl_GrupoTablaCab').trigger('footable_initialize');
                        }
                    }, 500)
                }
            }, function (err) {
                console.log(err);
            })
        }
    }


    $scope.Flag_modoEdicion = false;

    $scope.objeto_parametros = {
        id_detalleTabla: 0,
        id_grupoTabla: '0',
        codigo_detalleTabla: '',
        descripcion_grupoTabla: '',
        estado: 1,
        usuario_Creacion: 1,

    }
       

    $scope.clean = function () {

        $scope.objeto_parametros.id_detalleTabla = 0;
        $scope.objeto_parametros.id_grupoTabla = '0';
        $scope.objeto_parametros.codigo_detalleTabla = '';
        $scope.objeto_parametros.descripcion_grupoTabla = '';

        $scope.objeto_parametros.estado = 1;
        $scope.objeto_parametros.usuario_Creacion = 1;


        $('.selectModal').val("0").trigger('change.select2');
        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';
        setTimeout(function () {
            $('#cbo_grupoCab').val("0").trigger('change.select2');
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
    $('#ModalGrupoTable').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#txtdesc_tab').focus();
        }, 500)

    });

    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $('#ModalGrupoTable').modal('show');
    }

    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;
        $scope.EdicionRegistros(obj);
        $('#ModalGrupoTable').modal('show');

    }

    $scope.EdicionRegistros = function (obj) {
        $scope.loaderProd = true;
        $scope.Flag_modoEdicion = true;
        $scope.objeto_parametros.id_detalleTabla = obj.id_detalleTabla;
        $scope.objeto_parametros.id_grupoTabla = obj.id_grupoTabla;
        $scope.objeto_parametros.codigo_detalleTabla = obj.codigo_detalleTabla;
        $scope.objeto_parametros.descripcion_grupoTabla = obj.descripcion_grupoTabla;
        $scope.objeto_parametros.estado = obj.estado;
        $scope.objeto_parametros.usuario_Creacion = obj.usuario_Creacion;
        //$scope.changeSelect('GrupoTabla_Cab', $scope.objeto_parametros.id_grupoTabla);

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
            $('#cbo_grupoCabModal').val(obj.id_grupoTabla).trigger('change.select2');
        }, 1000);

    }

    $scope.GuardarRegistro = function () {

        if (GrupoDetServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }

        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            $scope.loaderSave = true;
            GrupoDetServices.save_GrupoTabla_Det($scope.objeto_parametros)
            .then(function (data) {
                $scope.tbl_GrupoTablaCab.push(data);

                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                        $('#ModalGrupoTable').modal('hide');
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

            
            GrupoDetServices.update_GrupoTabla_Det($scope.objeto_parametros)
            .then(function (data) {
                console.log("Los datos son :" + data)
                if (data == "Ok") {
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params)
                            .then(function (res) {
                                $('#ModalGrupoTable').modal('hide');
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
                            $('#ModalGrupoTable').modal('hide');
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
            text: 'Esta por anular un GrupoTabla_Det',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                GrupoDetServices.anular_GrupoTabla_Det(item.id_detalleTabla)
                   .then(function (res) {
                       var index = $scope.tbl_GrupoTablaCab.indexOf(item);
                       $scope.tbl_GrupoTablaCab[index].estado = 0;
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
            if (event.charCode == keys[index] || event.keyCode == keys[index]) {

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
                    $('#txtcod_tab').focus();
                }
                return;
            }
        }
        event.preventDefault();
        auxiliarServices.NotificationMessage('Alerta..!', 'Por favor ingrese solo Numeros...', 'error', '#ff6849', 1500);
    };


})