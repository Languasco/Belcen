var app = angular.module('appGestion.ClienteController', [])

app.controller('ctrlCliente', function ($scope, loginServices, $location, $timeout, auxiliarServices, LocalesServices, ClienteServices, EmpresaServices, AuditarServices, UbigeoServices, GiroServices,CanalServices) {
    

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Clientes");
        $scope.titleModal = "Registro de Cliente";
        $scope.loaderSave = false;
        $scope.get_Listando_Clientes();
        $scope.get_Listando_TipoDocumentos();
    }
    

    $scope.Lista_Clientes = [];
    $scope.get_Listando_Clientes = function () { 
            $scope.loader = true;
            ClienteServices.getClientes()
                .then(function (res) {
                $scope.Lista_Clientes = res;
                $scope.loader = false;
                $timeout(function () {
                    auxiliarServices.initFooTable('tbl_clientes', 'inputSearch');
                }, 500)
            }, function (err) {
                console.log(err);
            });     
    }

    $scope.Lista_TipoDoc = [];
    $scope.get_Listando_TipoDocumentos = function () { 
        $scope.Lista_TipoDoc.push({
            id:'DNI',
            des:'DNI'
        })
        $scope.Lista_TipoDoc.push({
            id: 'CARNET',
            des: 'CARNET'
        })

        $scope.get_Listando_GiroNegocio();
    }
        
    
    $scope.Lista_Giro = [];    
    $scope.get_Listando_GiroNegocio = function () {
        $scope.loader = true;
        GiroServices.getGiroNegocio().then(function (data) {
            $scope.loader = false;
            $scope.Lista_Giro = [];
            $scope.Lista_Giro = data;
            $scope.get_Listando_CanalNegocio();
        }, function (err) {
            console.log(err);
        })
    }

    $scope.Lista_Canal = [];
    $scope.get_Listando_CanalNegocio = function () {
        $scope.loader = true;
        CanalServices.getCanalNegocio().then(function (data) {
            $scope.loader = false;
            $scope.Lista_Canal = [];
            $scope.Lista_Canal = data;
            $scope.get_Listando_Ubigeos();
        }, function (err) {
            console.log(err);
        })
    }


    $scope.Lista_Ubigeo = [];
    $scope.Lista_UbigeoEntrega = [];

    $scope.get_Listando_Ubigeos = function () {
        $scope.loader = true;
        UbigeoServices.getUbigeo().then(function (data) {
            $scope.loader = false;
            $scope.Lista_Ubigeo = [];
            $scope.Lista_UbigeoEntrega = [];

            $scope.Lista_Ubigeo = data;
            $scope.Lista_UbigeoEntrega = data;
            
            $timeout(function () {
                $(".selectModal").select2();
            })

        }, function (err) {
            console.log(err);
        })
    }
 

    $scope.Flag_modoEdicion = false;

    $scope.objeto_parametros = {
        id_cliente:'0', 
        codigo_cliente:'', 
        tipoDocumento:'', 
        nroDocumento:'', 
        razonSocial_Cliente:'', 
        razonComercial_Cliente:'', 
        contacto_Cliente:'', 
        id_GiroNegocio:'0', 
        id_CanalNegocio:'0', 
        direccion_Cliente:'', 
        id_ubigeo:'0', 
        referencia_Cliente:'', 
        direccionEntrega_Cliente:'', 
        id_ubigeoEntrega:'0', 
        referenciaEntrega_Cliente:'', 
        telefono1_Cliente:'',
        telefono2_Cliente:'',
        email_Cliente:'', 
        importeMaximoCredito_Cliente:'',
        estado:0 ,
        usuario_Creacion:0,
    }
       

    $scope.clean = function () {
        var txtcodigoCliente = document.getElementById('txtcodigoCliente')
        $scope.objeto_parametros.id_cliente = '0';
        $scope.objeto_parametros.codigo_cliente = '';
        $scope.objeto_parametros.tipoDocumento = '';
        $scope.objeto_parametros.nroDocumento = '';
        $scope.objeto_parametros.razonSocial_Cliente = '';
        $scope.objeto_parametros.razonComercial_Cliente = '';
        $scope.objeto_parametros.contacto_Cliente = '';
        $scope.objeto_parametros.id_GiroNegocio = '0';
        $scope.objeto_parametros.id_CanalNegocio = '0';
        $scope.objeto_parametros.direccion_Cliente = '';
        $scope.objeto_parametros.id_ubigeo = '0';
        $scope.objeto_parametros.referencia_Cliente = '';
        $scope.objeto_parametros.direccionEntrega_Cliente = '';
        $scope.objeto_parametros.id_ubigeoEntrega = '0';
        $scope.objeto_parametros.referenciaEntrega_Cliente = '';
        $scope.objeto_parametros.telefono1_Cliente = '';
        $scope.objeto_parametros.telefono2_Cliente = '';
        $scope.objeto_parametros.email_Cliente = '';
        $scope.objeto_parametros.importeMaximoCredito_Cliente = '0';

        $scope.objeto_parametros.estado =1;
        $scope.objeto_parametros.usuario_Creacion = auxiliarServices.getUserId();
        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';
      
        setTimeout(function () {
            txtcodigoCliente.disabled = false;
            $('#cbo_tipoDoc').val("0").trigger('change.select2');
            $('#cbo_giroNegocio').val("0").trigger('change.select2');
            $('#cbo_canalnegocio').val("0").trigger('change.select2');

            $('#cbo_ubigeo').val("0").trigger('change.select2');
            $('#cbo_ubigeoEntrega').val("0").trigger('change.select2');
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

        var txtcodigoCliente = document.getElementById('txtcodigoCliente')
        $scope.objeto_parametros.id_cliente = obj.id_cliente;
        $scope.objeto_parametros.codigo_cliente = obj.codigo_cliente;
        $scope.objeto_parametros.tipoDocumento = obj.tipoDocumento;
        $scope.objeto_parametros.nroDocumento = obj.nroDocumento;
        $scope.objeto_parametros.razonSocial_Cliente = obj.razonSocial_Cliente;
        $scope.objeto_parametros.razonComercial_Cliente = obj.razonComercial_Cliente;

        $scope.objeto_parametros.contacto_Cliente = obj.contacto_Cliente;
        $scope.objeto_parametros.id_GiroNegocio = obj.id_GiroNegocio;
        $scope.objeto_parametros.id_CanalNegocio = obj.id_CanalNegocio;
        $scope.objeto_parametros.direccion_Cliente = obj.direccion_Cliente;
        $scope.objeto_parametros.id_ubigeo = obj.id_ubigeo;

        $scope.objeto_parametros.referencia_Cliente = obj.referencia_Cliente;
        $scope.objeto_parametros.direccionEntrega_Cliente = obj.direccionEntrega_Cliente;
        $scope.objeto_parametros.id_ubigeoEntrega = obj.id_ubigeoEntrega;
        $scope.objeto_parametros.referenciaEntrega_Cliente = obj.referenciaEntrega_Cliente;

        $scope.objeto_parametros.telefono1_Cliente = obj.telefono1_Cliente;
        $scope.objeto_parametros.telefono2_Cliente = obj.telefono2_Cliente;
        $scope.objeto_parametros.email_Cliente = obj.email_Cliente;
        $scope.objeto_parametros.importeMaximoCredito_Cliente = obj.importeMaximoCredito_Cliente;

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
            txtcodigoCliente.disabled = true;
            $('#cbo_tipoDoc').val(obj.tipoDocumento).trigger('change.select2');
            $('#cbo_giroNegocio').val(obj.id_GiroNegocio).trigger('change.select2');
            $('#cbo_canalnegocio').val(obj.id_CanalNegocio).trigger('change.select2');

            $('#cbo_ubigeo').val(obj.id_ubigeo).trigger('change.select2');
            $('#cbo_ubigeoEntrega').val(String(obj.id_ubigeoEntrega)).trigger('change.select2');
        }, 100); 
    }

    $scope.GuardarRegistro = function () {

        if (ClienteServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }
        
        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            //---validando que el codigo sea unico---
            if (ValidarCodigo($scope.objeto_parametros.codigo_cliente) == true) {
                auxiliarServices.NotificationMessage('Sistemas', 'El codigo ya se agregó, verifique', 'error', '#ff6849',2000);
                return;
            }
            $scope.loaderSave = true;
            ClienteServices.save_Cliente($scope.objeto_parametros)
            .then(function (data) {
                $scope.Lista_Clientes.push(data);
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
                    console.log(err);
                }, 500)
            })

        } else {  //actualizar

            $scope.loaderSave = true;
            ClienteServices.update_Cliente($scope.objeto_parametros)
            .then(function (data) {
                
                if (data == "OK") {

                    var indexList = $scope.Lista_Clientes.indexOf(objAux);

                    $scope.Lista_Clientes[indexList].id_cliente = $scope.objeto_parametros.id_cliente;
                    $scope.Lista_Clientes[indexList].codigo_cliente = $scope.objeto_parametros.codigo_cliente;
                    $scope.Lista_Clientes[indexList].tipoDocumento = $scope.objeto_parametros.tipoDocumento;
                    $scope.Lista_Clientes[indexList].nroDocumento = $scope.objeto_parametros.nroDocumento;
                    $scope.Lista_Clientes[indexList].razonSocial_Cliente = $scope.objeto_parametros.razonSocial_Cliente;
                    $scope.Lista_Clientes[indexList].razonComercial_Cliente = $scope.objeto_parametros.razonComercial_Cliente;
 
                    $scope.Lista_Clientes[indexList].contacto_Cliente = $scope.objeto_parametros.contacto_Cliente;
                    $scope.Lista_Clientes[indexList].id_GiroNegocio = $scope.objeto_parametros.id_GiroNegocio;
                    $scope.Lista_Clientes[indexList].id_CanalNegocio = $scope.objeto_parametros.id_CanalNegocio;
                    $scope.Lista_Clientes[indexList].direccion_Cliente = $scope.objeto_parametros.direccion_Cliente;
                    $scope.Lista_Clientes[indexList].id_ubigeo = $scope.objeto_parametros.id_ubigeo;
 
                    $scope.Lista_Clientes[indexList].referencia_Cliente = $scope.objeto_parametros.referencia_Cliente;
                    $scope.Lista_Clientes[indexList].direccionEntrega_Cliente = $scope.objeto_parametros.direccionEntrega_Cliente;
                    $scope.Lista_Clientes[indexList].id_ubigeoEntrega = $scope.objeto_parametros.id_ubigeoEntrega;
                    $scope.Lista_Clientes[indexList].referenciaEntrega_Cliente = $scope.objeto_parametros.referenciaEntrega_Cliente;
    
                    $scope.Lista_Clientes[indexList].telefono1_Cliente = $scope.objeto_parametros.telefono1_Cliente;
                    $scope.Lista_Clientes[indexList].telefono2_Cliente = $scope.objeto_parametros.telefono2_Cliente;
                    $scope.Lista_Clientes[indexList].email_Cliente = $scope.objeto_parametros.email_Cliente;
                    $scope.Lista_Clientes[indexList].importeMaximoCredito_Cliente = $scope.objeto_parametros.importeMaximoCredito_Cliente;
                    $scope.Lista_Clientes[indexList].estado = $scope.objeto_parametros.estado;
 
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
        for (var i = 0; i < $scope.Lista_Clientes.length; i++) {
            if (codigo == $scope.Lista_Clientes[i].codigo_cliente) {
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
            text: 'Esta por anular el Cliente.',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res==true) {
                ClienteServices.anular_Cliente(item.id_cliente)
                   .then(function (res) {
                       var index = $scope.Lista_Clientes.indexOf(item);
                       $scope.Lista_Clientes[index].estado = 0;
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