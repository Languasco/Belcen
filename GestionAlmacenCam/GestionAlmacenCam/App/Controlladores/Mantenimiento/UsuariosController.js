var app = angular.module('appGestion.UsuariosController', [])

app.controller('ctrlUsuarios', function ($scope, loginServices, $location, $timeout, auxiliarServices, UsuariosServices, CargoServices, PerfilServices) {

    $('document').ready(function () {
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy',
            });
        }, 500);
    });

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Usuario");
        $scope.titleModal = "Usuario";
        $scope.disabledContent = "";
        $scope.loaderSave = false;

        setTimeout(function () {
            $(".select_modal").select2();
            $('#cbo_tip_personal').val("0").trigger('change.select2');
        },0);
        
        $scope.get_listStatus();
        $scope.getListAcceso();
        $scope.get_ListandoUsuarios();
    }

    $scope.Objeto_ParametroFiltro = {
        buscar: '',
        acceso: 1,
        estado: 1
    }

    $scope.listStatus = [];
    $scope.get_listStatus = function () {
        $scope.listStatus.push(
            { id: 0, descripcion: '[ ----   Todos  --- ]' },
            { id: 1, descripcion: 'Activos' },
            { id: 2, descripcion: 'Anulados' }
        )
        $scope.Objeto_ParametroFiltro.id_estado= '1';
        setTimeout(function () {
           $('#cboestadoFilter').val(String('1')).trigger('change.select2');
        }, 100);

    }

    $scope.listAccess = [];
    $scope.getListAcceso = function () {
        $scope.listAccess.push(
            { id: 1, descripcion: 'Web' },
            { id: 2, descripcion: 'Movil' }
        )
        $scope.Objeto_ParametroFiltro.id_estado = '1';
        setTimeout(function () {
            $('#cboaccesoFilter').val(String('1')).trigger('change.select2');
        }, 100);

    }
       
    $scope.Lista_Usuarios = [];
    var oTable;
    $scope.get_ListandoUsuarios = function () {
        $scope.loader = true;
        UsuariosServices.getUsuarios()
            .then(function (res) {
                $scope.loader = false;
                $scope.Lista_Usuarios = [];
                if (res.ok == true) {
                    $scope.Lista_Usuarios = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                }
            }, function (err) {
                    $scope.loader = false;
        })
    }

    $scope.searchStr = '';
    $scope.$watch('searchStr', function (tmpStr) {
        //if (!tmpStr || tmpStr.length == 0)
        //    return 0;
        $timeout(function () {

            // if searchStr is still the same..
            // go ahead and retrieve the data
            if (tmpStr === $scope.searchStr) {
                $scope.get_BuscarUsuarios();
            }
        }, 700);
    });


    $scope.get_BuscarUsuarios = function () {
        $scope.loader = true;
        var searchStr = document.getElementById('searchStr').value;

        UsuariosServices.search_Usuarios(searchStr, $scope.Objeto_ParametroFiltro)
            .then(function (res) {
                $scope.loader = false;
                $scope.Lista_Usuarios = [];

                if (res.ok == true) {
                    $scope.Lista_Usuarios = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                }
            }, function (err) {
                    $scope.loader = false;
                console.log(err);
            })
    }

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
            des: 'Cobertura'
        })
        $scope.Lista_TipoPersonal.push({
            id: '2',
            des: 'Mayorista'
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
        }, function (err) {
            console.log(err);
        })
    }
    $scope.get_ListandoCargos();

    $scope.Lista_Perfil = [];
    $scope.get_ListandoPerfiles = function () {
        $scope.loader = true;
        PerfilServices.getPerfiles().then(function (data) {
            $scope.loader = false;
            $scope.Lista_Perfil = [];
            $scope.Lista_Perfil = data; 
        }, function (err) {
            console.log(err);
        })
    }
    $scope.get_ListandoPerfiles();


    $scope.Flag_modoEdicion = false;

    $scope.objeto_parametros = {
        id_Usuario : 0,
        nro_doc: '',
        tipo_doc: '0',
        apellidos: '',
        nombres: '',
        email: '',
        nro_celular: '',
        adm: 'Ad',
        sys: 'Sy',
        id_cargo: '0',
        id_area: '0',
        tipo: '0',
        id_empresa_pertence: '1',
        fotourl: '',
        login_usuario: '',
        contrasenia_usuario: '',
        id_perfil: '0',
        codigo: '',
        estado: '0',
        acceso_web: true,
        acceso_movil: false,
        usuario_creacion: '0',
        fecha_creacion: '',
        fecha_cese: '',
        usuario_edicion: '',
        fecha_edicion: ''
    }
       

    $scope.clean = function () {
        var nro_doc = document.getElementById('nro_doc')

        
        $scope.objeto_parametros.id_Usuario = '0';
        $scope.objeto_parametros.nro_doc = '';
        $scope.objeto_parametros.tipo_doc = '0';
        $scope.objeto_parametros.apellidos = '';
        $scope.objeto_parametros.nombres = '';
        $scope.objeto_parametros.email = '';
        $scope.objeto_parametros.nro_celular = '';
        $scope.objeto_parametros.adm = 'Ad';
        $scope.objeto_parametros.sys = 'Sy';
        $scope.objeto_parametros.id_cargo = '0';
        $scope.objeto_parametros.id_area = '0';
        $scope.objeto_parametros.tipo = '0';
        $scope.objeto_parametros.id_empresa_pertence = '1';
        $scope.objeto_parametros.login_usuario = '';
        $scope.objeto_parametros.contrasenia_usuario = '';
        $scope.objeto_parametros.id_perfil = '0';
        $scope.objeto_parametros.codigo = '';
        $scope.objeto_parametros.fotourl = '';
        $scope.objeto_parametros.fecha_cese = auxiliarServices.getDateNow();
        $scope.objeto_parametros.acceso_web = true;
        $scope.objeto_parametros.acceso_movil = false;
        

        $scope.objeto_parametros.estado = 1;
        $scope.objeto_parametros.usuario_creacion = auxiliarServices.getUserId();

        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';

        $scope.objEstados_Envio.activo = true;
        $scope.objEstados_Envio.text = 'SI';
        $scope.objEstados_Envio.colorText = '#2c5ca9';

        setTimeout(function () {
            nro_doc.disabled = false;
            $('.select_modal').val("0").trigger('change.select2');
            $('#cbo_tipoDoc_personal').val("0").trigger('change.select2');
            $('#cbo_tip_personal').val("0").trigger('change.select2');
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

    $scope.objAcceso = {
        web: true,
        movil: false
    }

    $scope.accessWeb = function (status) {
        if (status) {
            $scope.objeto_parametros.acceso_web = true;
        } else {
            $scope.objeto_parametros.acceso_web = false;
        }
    }


    $scope.accessMovil = function (status) {
        if (status) {
            setTimeout(function () {
                $(".select_modal_type").select2();
                $('.select_modal_type').val(String($scope.objeto_parametros.tipo)).trigger('change.select2');
            }, 0);
            $scope.objeto_parametros.acceso_movil = true;
        } else {
            $scope.objeto_parametros.acceso_movil = false;
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
        var nro_doc = document.getElementById('nro_doc');

        $scope.objeto_parametros.id_Usuario = obj.id_Usuario;
        $scope.objeto_parametros.nro_doc = obj.nro_doc;
        $scope.objeto_parametros.tipo_doc = obj.tipo_doc;
        $scope.objeto_parametros.apellidos = obj.apellidos;
        $scope.objeto_parametros.nombres = obj.nombres;
        $scope.objeto_parametros.email = obj.email;

        $scope.objeto_parametros.adm = 'Ad';
        $scope.objeto_parametros.sys = 'Sy';
        $scope.objeto_parametros.id_cargo = obj.id_cargo;
        $scope.objeto_parametros.id_area = obj.id_area;
        $scope.objeto_parametros.tipo = obj.tipo;
        $scope.objeto_parametros.id_empresa_pertence = '1';

        $scope.objeto_parametros.login_usuario = obj.login_usuario;
        $scope.objeto_parametros.contrasenia_usuario = obj.contrasenia_usuario;
        $scope.objeto_parametros.id_perfil = obj.id_perfil;
        $scope.objeto_parametros.codigo = obj.codigo;
        $scope.objeto_parametros.estado = obj.estado;

        $scope.objeto_parametros.acceso_web = obj.acceso_web;
        $scope.objeto_parametros.acceso_movil = obj.acceso_movil;

        $scope.objeto_parametros.fecha_cese = obj.fecha_cese;

        $scope.objeto_parametros.fecha_creacion = obj.fecha_creacion;
        $scope.objeto_parametros.usuario_edicion = auxiliarServices.getUserId();


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
            nro_doc.disabled = true;
            $('#cbo_tipoDoc_personal').val(obj.tipo_doc).trigger('change.select2');
            $('#cbo_id_cargo_personal').val(String(obj.id_cargo)).trigger('change.select2');
            $('#cbo_tip_usuario').val(String(obj.tipo)).trigger('change.select2');
            $('#cbo_id_perfil').val(String(obj.id_perfil)).trigger('change.select2');
            $('#cbo_tip_personal').val(String(obj.tipo)).trigger('change.select2');
        }, 100); 

        $scope.accessWeb(getBool(obj.acceso_web));
        $scope.accessMovil(getBool(obj.acceso_movil));
    }

    function getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }

    $scope.GuardarRegistro = async function () {
        if (UsuariosServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }

        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;
        $scope.objeto_parametros.envio_en_linea = $scope.objEstados_Envio.activo == true ? 'SI' : 'NO';
        
        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
 
            //------verificando el nro documento ----  
            $scope.loaderSave = true;
            const { ok, data } = await UsuariosServices.validar_nroDocumentoUsuario($scope.objeto_parametros.nro_doc);
            $scope.loaderSave = false;
            $scope.$apply();

            if (ok) {
                if (data[0].cantRegistro >= 1) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos el número de Documento ya se registro con anterioridad, verifique', 'error', '#ff6849', 1500);
                    return false;
                }
            } else {
                auxiliarServices.NotificationMessage('Sistemas', data, 'error', '#ff6849', 3000);
                return false;
            }             

            $scope.loaderSave = true;
            UsuariosServices.save_usuario($scope.objeto_parametros)
                .then(function (data) {
                    $scope.loaderSave = false;
                    if (data.ok === true) {
                        $scope.get_ListandoUsuarios();
                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Se agrego correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params)
                                .then(function (res) {
                                    $('#modalMantenimiento').modal('hide');
                                });
                        }, 500)
                    } else {
                        $timeout(function () {
                            let paramsErr = {
                                type: 'error',
                                title: 'Error !',
                                text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                            }
                            auxiliarServices.initSweetAlert(paramsErr).then(function (res) {
                                $('#modalMantenimiento').modal('hide');
                            });
                        }, 500)
                    }
            }, function (error) {
                        $scope.loaderSave = false;
                        auxiliarServices.NotificationMessage('Sistemas', error, 'error', '#ff6849', 2000);
            })

        } else {  //actualizar

            $scope.loaderSave = true;
            UsuariosServices.update_usuario($scope.objeto_parametros)
                .then(function (data) {
                    $scope.loaderSave = false;
                    if (data.ok === true) {
                        $scope.get_ListandoUsuarios();
                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Actualizacion realizado correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params)
                                .then(function (res) {
                                    $('#modalMantenimiento').modal('hide');
                                });
                        }, 500)
                    } else {
                        $timeout(function () {
                            let paramsErr = {
                                type: 'error',
                                title: 'Error !',
                                text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                            }
                            auxiliarServices.initSweetAlert(paramsErr).then(function (res) {
                                $('#modalMantenimiento').modal('hide');
                            });
                        }, 500)
                    }
            }, function (error) {
                    $scope.loaderSave = false;
                    console.log(error);
                auxiliarServices.NotificationMessage('Sistemas', error, 'error', '#ff6849', 2000);
                
            })

        }
    }
    
    function ValidarCodigo(nro_doc) {
        var estado = false;
        for (var i = 0; i < $scope.Lista_Usuarios.length; i++) {
            if (nro_doc == $scope.Lista_Usuarios[i].nro_doc) {
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
            text: 'Esta por anular el usuario.',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                UsuariosServices.anular_usuario(item.nro_doc, auxiliarServices.getUserId())
                   .then(function (res) {
                       var index = $scope.Lista_Usuarios.indexOf(item);
                       $scope.Lista_Usuarios[index].estado = 0;
                   })
            }
        });
    }
 
})