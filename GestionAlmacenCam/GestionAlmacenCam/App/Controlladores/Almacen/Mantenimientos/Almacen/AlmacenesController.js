var app = angular.module('appGestion.AlmacenesController', [])

app.controller('ctrlAlmacenes', function ($scope, loginServices, $location, $timeout, auxiliarServices, LocalesServices, AlmacenServices, EmpresaServices, AuditarServices, PedidosServices) {
    

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Almacenes");
        $scope.titleModal = "Registro de Almacenes";
        $scope.disabledContent = "";
        $scope.loaderSave = false;
        $scope.get_ListandoLocales();
        setTimeout(function () {
            $(".selectModal").select2();
        }, 500);
    }
    
    $scope.Lista_local = [];
    $scope.Lista_locales = [];
    
    $scope.get_ListandoLocales = function () {
        $scope.loader = true;
        LocalesServices.getLocales().then(function (data) {
            $scope.loader = false;
            $scope.Lista_local = [];
            $scope.Lista_locales = [];
            $scope.Lista_local = data;
            $scope.Lista_locales = data;

            $timeout(function () {
                $(".select_local").select2();
                $(".select_locales").select2();
                $('#cbo_local').val("0").trigger('change.select2');
                //$scope.get_ListandoEmpresas()
                 $scope.get_listando_anexos()
            })

        }, function (err) {
            console.log(err);
        })
    }

    $scope.id_locales = 0;
    $scope.change_Locales = function () {
        $scope.get_Listando_Almacenes();
    }

    $scope.Lista_Almacenes = [];
    var oTable;
    $scope.get_Listando_Almacenes = function () {
        var id_local = document.getElementById('cbo_local').value;
        setTimeout(function () {
            $scope.loader = true;
            AlmacenServices.get_ListadoAlmacenes(id_local).then(function (res) {
                $scope.Lista_Almacenes = [];
                $scope.Lista_Almacenes = res;
                $timeout(function () {
                    $scope.loader = false;
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('tbl_Almacenes', 'inputSearch');
                    } else {
                        $('#data_cabecera').trigger('footable_initialize');
                    }
                }, 500);
            }, function (err) {
                console.log(err);
            });
        }, 50);
    }

    $scope.Lista_Empresas = [];
    $scope.get_ListandoEmpresas = function () {
        $scope.loader = true;
        EmpresaServices.getEmpresa().then(function (data) {
            $scope.loader = false;
            $scope.Lista_Empresas = [];
            $scope.Lista_Empresas = data;
            $timeout(function () {
                $(".select_empresas").select2();
                $scope.get_Listando_Almacenes();
            })
        }, function (err) {
            console.log(err);
        })
    }


    $scope.lista_anexos = [];
    $scope.get_listando_anexos = function () {
        $scope.loader = true;
        AlmacenServices.getAnexos().then(function (res) { 
            $scope.loader = false;
            if (res.ok == true) {
                $scope.lista_anexos = [];
                $scope.lista_anexos = res.data;

                $timeout(function () {
                    $(".selectAnexo").select2();
                    $('#cbo_anexo').val('0').trigger('change.select2');
                    $scope.get_Listando_Almacenes();
                })

            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
        }, function (err) {
            console.log(err);
        })
    }



    

    $scope.enterFocus = function (type, name) {
        if (type === 1) {
            $('#' + name + '').focus();
            $('#' + name + '').select();

        } else if (type === 2) {
            $('#' + name + '').select2('open');
        }
    };

    $scope.Lista_Departamentos = [];
    $scope.Listando_Departamentos = function () {
        $scope.loader = true;
        PedidosServices.get_departamentos()
            .then(function (data) {
                $scope.loader = false;
                for (item of data) {
                    $scope.Lista_Departamentos.push({
                        codigo_detalleTabla: parseInt(item.codigo_detalleTabla),
                        descripcion_grupoTabla: item.descripcion_grupoTabla
                    })
                }
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }
    $scope.Listando_Departamentos();

    $scope.Lista_establecimientos = [];
    $scope.Listando_Establecimientos = function () {
        $scope.loader = true;
        PedidosServices.get_codigo_establecimiento()
            .then(function (data) { 
                $scope.loader = false;
                for (item of data) {
                    $scope.Lista_establecimientos.push({
                        codigo_detalleTabla: item.codigo_detalleTabla.trim(),
                        descripcion_grupoTabla: item.descripcion_grupoTabla
                    })
                }
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }
    $scope.Listando_Establecimientos();


    $scope.Lista_Provincia = [];
    $scope.change_departamento_provincia = function (id_departamento, id_provincia) {
        if (id_departamento == 0) {
            $scope.Lista_Provincia = [];
            $scope.objeto_parametros.id_provincia = '0';

            setTimeout(function () {
                $('#cbo_provincia').val("0").trigger('change.select2');
            }, 500);
        } else {
            $scope.loaderSave = true;
            PedidosServices.get_Provincia(id_departamento)
                .then(function (data) {
                    $scope.loaderSave = false;
                    $scope.Lista_Provincia = [];
                    $scope.Lista_Provincia = data;

                    if (id_provincia == 0) {
                        $scope.objeto_parametros.id_provincia = '0';
                        setTimeout(function () {
                            $('#cbo_provincia').val(0).trigger('change.select2');
                        }, 500);
                    } else {
                        $scope.objeto_parametros.id_provincia = id_provincia;
                        setTimeout(function () {
                            $('#cbo_provincia').val(id_provincia).trigger('change.select2');
                        }, 500);
                    }

                }, function (err) {
                    $scope.loaderSave = false;
                    console.log(err);
                })
        }
    }


    $scope.Lista_Distrito = [];
    $scope.change_provincia_distrito = function (id_provincia, distrito) {
        if (id_provincia == 0) {
            $scope.Lista_Distrito = [];
            $scope.objeto_parametros.id_distrito = '0';

            setTimeout(function () {
                $('#cbo_distrito').val("0").trigger('change.select2');
            }, 500);
        } else {
            $scope.loaderSave = true;
            PedidosServices.get_Distrito(id_provincia)
                .then(function (data) {
                    $scope.loaderSave = false;
                    $scope.Lista_Distrito = [];
                    $scope.Lista_Distrito = data;

                    if (distrito == 0) {
                        $scope.objeto_parametros.id_distrito = '0';
                        setTimeout(function () {
                            $('#cbo_distrito').val(0).trigger('change.select2');
                        }, 500);
                    } else {
                        $scope.objeto_parametros.id_distrito = distrito;
                        setTimeout(function () {
                            $('#cbo_distrito').val(distrito).trigger('change.select2');
                        }, 500);
                    }

                }, function (err) {
                    $scope.loaderSave = false;
                    console.log(err);
                })
        }

    }



    $scope.Flag_modoEdicion = false;

    $scope.objeto_parametros = {
        id_Almacen:0, 
        id_Empresa: 1, 
        id_Anexos : '0',
        id_Local:0 , 
        codigo_Almacen:'',
        descripcion_Almacen:'',
        direccion_Almacen:'',
        matNormal_Almacen:'',
        matBaja_Almacen:'' ,
        matConsignacion_Almacen:'' ,
        estado: 0,
        id_provincia: '0',
        id_distrito: '0',
        id_departamento: '0',
        direccion_serie_sunat : '',
        cod_establecimiento : '0',
        usuario_Creacion: 0,

        pedidosMovil_Almacen: '0',
        ventaMayorista: '0',
    }
       

    $scope.clean = function () {

        var txtcodigo = document.getElementById('txtcodigo')
        var rb_normales = document.getElementById('rb_normales')
        $scope.objeto_parametros.id_Almacen = 0;
        $scope.objeto_parametros.id_Empresa = 1;
        $scope.objeto_parametros.id_Anexos = '0';
        

        $scope.objeto_parametros.id_Local =0;
        $scope.objeto_parametros.codigo_Almacen ='';
        $scope.objeto_parametros.descripcion_Almacen ='';
        $scope.objeto_parametros.direccion_Almacen ='';
        $scope.objeto_parametros.matNormal_Almacen ='NO';
        $scope.objeto_parametros.matBaja_Almacen ='NO';
        $scope.objeto_parametros.matConsignacion_Almacen = 'NO';

        $scope.objeto_parametros.id_provincia = '0';
        $scope.objeto_parametros.id_distrito = '0';
        $scope.objeto_parametros.id_departamento = '0';
        $scope.objeto_parametros.direccion_serie_sunat = '';
        $scope.objeto_parametros.cod_establecimiento = '0';

        $scope.objeto_parametros.pedidosMovil_Almacen = '0';
        $scope.objeto_parametros.ventaMayorista = '0';

        $scope.objeto_parametros.estado =1;
        $scope.objeto_parametros.usuario_Creacion = auxiliarServices.getUserId();
        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';
        rb_normales.checked = true

        setTimeout(function () {
            txtcodigo.disabled = false;
            $('#cbo_empresas').val("0").trigger('change.select2');
            $('#cbo_locales').val("0").trigger('change.select2');

            $('#cbo_departamento').val("0").trigger('change.select2');
            $('#cbo_provincia').val("0").trigger('change.select2');
            $('#cbo_distrito').val("0").trigger('change.select2');
            $('#cbo_establecimientos').val("0").trigger('change.select2');

            $('#cbo_pedidoMovil').val('0').trigger('change.select2');
            $('#cbo_venta').val('0').trigger('change.select2');

        }, 200);
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
        $('#modalMantenimiento').modal('show');
    }
    
    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;        
       
        $scope.EdicionRegistros(obj);
        $('#modalMantenimiento').modal('show');
 
    }

    $scope.EdicionRegistros = function (obj) {
        var txtcodigo = document.getElementById('txtcodigo')
        var rb_normales = document.getElementById('rb_normales')
        var rb_baja = document.getElementById('rb_baja')

        $scope.objeto_parametros.id_Almacen = obj.id_Almacen;
        $scope.objeto_parametros.id_Empresa = obj.id_Empresa;

        $scope.objeto_parametros.id_Anexos = obj.id_Anexos;;
        $scope.objeto_parametros.id_Local = obj.id_Local;
        $scope.objeto_parametros.codigo_Almacen = obj.codigo_Almacen;
        $scope.objeto_parametros.descripcion_Almacen = obj.descripcion_Almacen;
        $scope.objeto_parametros.direccion_Almacen = obj.direccion_Almacen;
        $scope.objeto_parametros.matNormal_Almacen = obj.matNormal_Almacen;
        $scope.objeto_parametros.matBaja_Almacen = obj.matBaja_Almacen;
        $scope.objeto_parametros.matConsignacion_Almacen = obj.matConsignacion_Almacen;
        $scope.objeto_parametros.estado = obj.estado;
        
        $scope.objeto_parametros.id_provincia = obj.id_provincia;
        $scope.objeto_parametros.id_distrito = obj.id_distrito;
        $scope.objeto_parametros.id_departamento = obj.id_departamento;
        $scope.objeto_parametros.cod_establecimiento = obj.cod_establecimiento;
        $scope.objeto_parametros.direccion_serie_sunat = obj.direccion_serie_sunat;


        $scope.objeto_parametros.pedidosMovil_Almacen = obj.pedidosMovil_Almacen;
        $scope.objeto_parametros.ventaMayorista = obj.ventaMayorista;


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
            txtcodigo.disabled = true;
            //$('#cbo_empresas').val(String(obj.id_Empresa)).trigger('change.select2');

            $('#cbo_anexo').val(String(obj.id_Anexos)).trigger('change.select2');
            $('#cbo_locales').val(String(obj.id_Local)).trigger('change.select2');

            if (obj.matNormal_Almacen == 'SI' || obj.matNormal_Almacen == 'si') {
                rb_normales.checked = true;
            }
            else if (obj.matBaja_Almacen == 'SI' || obj.matBaja_Almacen == 'si') {
                rb_baja.checked = true;
            }

            $('#cbo_departamento').val(parseInt(obj.id_departamento)).trigger('change.select2');
            $('#cbo_provincia').val(obj.id_provincia).trigger('change.select2');
            $('#cbo_establecimientos').val(obj.cod_establecimiento).trigger('change.select2');


            $('#cbo_pedidoMovil').val(String(obj.pedidosMovil_Almacen)).trigger('change.select2');
            $('#cbo_venta').val(String(obj.ventaMayorista)).trigger('change.select2');


            $scope.change_departamento_provincia(obj.id_departamento, obj.id_provincia); 
        }, 600);

        setTimeout(function () {
            $scope.change_provincia_distrito(obj.id_provincia, obj.id_distrito);
        }, 1500);


    }

    $scope.GuardarRegistro = function () {

        var rb_normales = document.getElementById('rb_normales')
        var rb_baja = document.getElementById('rb_baja')

        if (AlmacenServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }
        /// obteniendo el valor de los radios
        if (rb_normales.checked == true) {
            $scope.objeto_parametros.matNormal_Almacen = 'SI';
            $scope.objeto_parametros.matBaja_Almacen = 'NO';

        } else if (rb_baja.checked == true) {
            $scope.objeto_parametros.matBaja_Almacen = 'SI';
            $scope.objeto_parametros.matNormal_Almacen = 'NO';
        }
        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            //---validando que el codigo sea unico---
            if (ValidarCodigo($scope.objeto_parametros.codigo_Almacen) == true) {
                auxiliarServices.NotificationMessage('Sistemas', 'El codigo ya se agregó, verifique', 'error', '#ff6849',2000);
                return;
            }
            $scope.loaderSave = true;
            AlmacenServices.save_Almacenes($scope.objeto_parametros)
                .then(function (data) {
                $scope.get_Listando_Almacenes();
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
            }, function (err) {
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
            AlmacenServices.update_Almacenes($scope.objeto_parametros)
            .then(function (data) {
                
                if (data == "OK") {

                    $scope.get_Listando_Almacenes();
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
                console.log(error);
            })

        }
    }
    
    function ValidarCodigo(codigo) {
        var estado = false;
        for (var i = 0; i < $scope.Lista_Almacenes.length; i++) {
            if (codigo == $scope.Lista_Almacenes[i].codigo_Almacen) {
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
            text: 'Esta por anular el Almacen.',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res==true) {
                   AlmacenServices.anular_Almacenes(item.id_Almacen)
                   .then(function (res) {
                       var index = $scope.Lista_Almacenes.indexOf(item);
                       $scope.Lista_Almacenes[index].estado = 0;
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
    
})