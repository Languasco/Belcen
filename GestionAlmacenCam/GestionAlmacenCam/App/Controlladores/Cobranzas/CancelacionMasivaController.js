var app = angular.module('appGestion.CancelacionMasivaController', [])
app.controller('Ctrl_CancelacionMasiva', function ($scope, ReimpresionServices, $location, $timeout, auxiliarServices, PagosVendedorServices, ConsolidadoServices, PedidosServices,Documentos_MasivosServices, RevisionPedidoServices, AlmacenServices, GrupoDetServices,  CancelacionMasivaServices) {
    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2); 
        auxiliarServices.changeTitle("Registro de Cobranza");
        $scope.titleModal = "Registro de Cobranza";
        $scope.loaderSave = false;
        $scope.get_Listando_Locales();
        $scope.configuraTipoResponsable(1);
    }
    

    $('document').ready(function () {
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy',
            });
            $(".selectFiltros").select2();
            $('#btn_cancelar').attr("disabled", true);
        }, 0);

    });

    $scope.Lista_Bancos = [];
    $scope.Listando_Bancos = function () {
        $scope.loaderfiltros = true;
        GrupoDetServices.getGrupoTabla_Det(6)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Bancos = [];
                $scope.Lista_Bancos = data;
                setTimeout(function () {
                    $('#cbo_banco').val("0").trigger('change.select2');
                }, 300);
 
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };
    $scope.Listando_Bancos();
          
    $scope.Objeto_ParametroFiltro = {
        id_local: '0',
        id_almacen: '0',
        id_Anexos: '0',
        vendedor: '0',
        id_transportista: '0', 
        id_tipoDoc: '0', 
        fechaIni: auxiliarServices.getDateNow(),
        fechaFin: auxiliarServices.getDateNow(),

        fecha_cancelacion: auxiliarServices.getDateNow(),
        usuario: auxiliarServices.getUserId(),
        tipoResponsable: '1',
        nroRecibo: '',
        vendedor_cobranza: '0',
        id_transportista_cobranza: '0', 

    }
       
    $scope.objeto_parametros_pagos = { 
        id_formaPago: '0',
        id_banco: '0',
        fechaOperacion: auxiliarServices.getDateNow(),
        nroOperacion: '',
        nameFile : ''
    };
     //----- combos 
    $scope.Lista_Local = [];
    $scope.get_Listando_Locales = function () {
        $scope.loaderfiltros = true;
        Documentos_MasivosServices.get_zonasUsuario(auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderfiltros = false;
                if (res.ok == true) {
                    $scope.Lista_Local = [];
                    $scope.Lista_Local = res.data;
                    $timeout(function () {
                        $scope.Objeto_ParametroFiltro.id_local = '0';
                        $('#cbo_local').val("0").trigger('change.select2');
                    })
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                console.log(err);
            });
    };

    $scope.Lista_Almacen = [];
    $scope.change_Local_Almacen = function (idlocal) {
        $scope.loaderfiltros = true;
        AlmacenServices.get_ListadoAlmacenes_Local_Usuario(idlocal, auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Almacen = [];
                $scope.Lista_Almacen = data;

                $scope.Objeto_ParametroFiltro.id_almacen = '0';
                $scope.Objeto_ParametroFiltro.id_Anexos = '0';

                setTimeout(function () {
                    $('#cbo_almacen').val('0').trigger('change.select2');
                    $scope.lista_anexos = [];
                    $('#cbo_anexo').val('0').trigger('change.select2');
                }, 0);


            }, function (err) {
                console.log(err);
            });
    };

    //$scope.lista_anexos = [];
    //$scope.change_almacen_anexo = function (idAlmacen) {
    //    $scope.loaderFiltro = true;
    //    RevisionPedidoServices.get_Anexos_Almacen(idAlmacen).then(function (res) {
    //        $scope.loaderFiltro = false;
    //        if (res.ok == true) {
    //            $scope.lista_anexos = [];
    //            $scope.lista_anexos = res.data;
    //            $timeout(function () {
    //                $('#cbo_anexo').val('0').trigger('change.select2');
    //            })

    //        } else {
    //            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
    //            alert(res.data);
    //        }
    //    }, function (err) {
    //        $scope.loaderFiltro = false;
    //        console.log(err);
    //    });
    //};


    $scope.lista_anexos = [];
    $scope.change_zona_anexo = function (idZona) {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_AnexosZona(idZona).then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {
    
                $scope.lista_anexos = res.data;  
                setTimeout(function () {
                    $scope.Objeto_ParametroFiltro.id_Anexos = '0';
                    $('#cbo_anexo').val("0").trigger('change.select2');
                }, 100);

            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
        }, function (err) {
            $scope.loaderFiltro = false;
            console.log(err);
        });
    };

         
    $scope.Lista_Vendedor = [];
    $scope.change_Local_vendedor = function (idlocal) {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_vendedorLocal(idlocal)
            .then(function (res) {
                $scope.loaderFiltro = false;

                if (res.ok == true) {
                    $scope.Lista_Vendedor = [];
                    $scope.Lista_Vendedor = res.data;

                    setTimeout(function () {
                        $scope.Objeto_ParametroFiltro.id_vendedor = '0';
                        $('#cbo_vendedor').val("0").trigger('change.select2');
                    }, 0);
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderFiltro = false;
                console.log(err);
            });
    };

    $scope.Lista_Transportista = [];
    $scope.change_Local_transportista = function (idlocal) {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_transportistaLocal(idlocal)
            .then(function (res) {
                $scope.loaderFiltro = false;

                if (res.ok == true) {
                    $scope.Lista_Transportista = [];
                    $scope.Lista_Transportista = res.data;

                    setTimeout(function () {
                        $scope.Objeto_ParametroFiltro.id_transportista = '0';
                        $('#cboTransportista').val("0").trigger('change.select2');
                    }, 0);
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderFiltro = false;
                console.log(err);
            });
    };

    $scope.lista_documentos = [];
    $scope.listandoDocumentos = function () {
        $scope.loaderFiltro = true;
        ReimpresionServices.get_tipoDocumentos().then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {
                $scope.lista_documentos = [];
                $scope.lista_documentos =  res.data.filter((d) => (d.id == 1 || d.id == 2)) 

                $timeout(function () {
                    $('#cboTipoDoc').val('0').trigger('change.select2');
                })
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
        }, function (err) {
            $scope.loaderFiltro = false;
            console.log(err);
        });
    };
    $scope.listandoDocumentos();

         //----- fin de  combos       


    $scope.checkedAll = false;

    $scope.listadetalle_documentos = []
    $scope.actualizar_informacion = function () {

        if ($scope.Objeto_ParametroFiltro.id_local == undefined || $scope.Objeto_ParametroFiltro.id_local == null || $scope.Objeto_ParametroFiltro.id_local == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Zona', 'error', '#ff6849', 1500);
            return;
        }
        else if ($scope.Objeto_ParametroFiltro.id_Anexos == undefined || $scope.Objeto_ParametroFiltro.id_Anexos == null || $scope.Objeto_ParametroFiltro.id_Anexos == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Anexo', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.Objeto_ParametroFiltro.id_transportista == undefined || $scope.Objeto_ParametroFiltro.id_transportista == null || $scope.Objeto_ParametroFiltro.id_transportista == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Transportista', 'error', '#ff6849', 1500);
            return;
        }

 
        $('#btn_descartar').attr("disabled", true);
        document.getElementById("form_detalle").style.display = "none";
        $scope.loaderfiltros = true;
        $scope.checkedAll = false;

        CancelacionMasivaServices.mostrando_lista_documentos($scope.Objeto_ParametroFiltro)
            .then(function (data) {
 
                if (data.length > 0) {
                    $('#btn_cancelar').attr("disabled", false);
                } else {
                    document.getElementById("form_detalle").style.display = "none";
                }

                $scope.listadetalle_documentos = [];
                $scope.listadetalle_documentos = data;
                $timeout(function () { 
                    $scope.loaderfiltros = false;
                    $("#tbl_detalle").tableHeadFixer({ "left": 3 }); 
                    document.getElementById("form_detalle").style.display = "";
                }, 1000);

                $scope.checkedAll = true;
                $scope.marcarTodos(true);

                $scope.leyendas();
            }, function (err) {
                    $scope.loaderfiltros = false;
                $('#btn_cancelar').attr("disabled", true);
                    console.log(err);
                    $scope.leyendas();
            })
    }

    $scope.KeyDown_saldo = function (keyEvent, obj_datos, id_enfoque) {
        if (keyEvent.which == 13) { 
            if (obj_datos.saldo_pendiente == undefined || obj_datos.saldo_pendiente == '' || obj_datos.saldo_pendiente == null || obj_datos.saldo_pendiente == undefined) {
                obj_datos.cancelar = false;
                $scope.check_marca('chk_' + parseInt(id_enfoque), false)
                $scope.changeFocusInput('id_' + (parseInt(id_enfoque) + 1))
            } else {
                obj_datos.cancelar = true;
                $scope.check_marca('chk_' + parseInt(id_enfoque), true)
                $scope.changeFocusInput('id_' + (parseInt(id_enfoque) + 1))
            }     
            $scope.leyendas();
        }
    }

    $scope.changeFocusInput = function (id) {
        var doc = document.getElementById(id);
        $timeout(function () {
            doc.focus();
        },100);
    }

    $scope.check_marca = function (id, option) {
        var doc = document.getElementById(id);
        $timeout(function () {
            doc.checked = option;
        }, 100);
    }    

    $scope.formatearCeldas = function (valor) {
        return isNaN(valor) ? valor : parseFloat(valor).toFixed(2);
    }

    $scope.Calculo_Saldo = function (obj_datos, id_enfoque) { 

        obj_datos.nuevo_saldo = obj_datos.saldo_pendiente - obj_datos.importe_pagar;

        if (isNaN(obj_datos.importe_pagar) == true) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese un Valor correcto, verifique', 'error', '#ff6849', 1500);
        } else {
            if (obj_datos.importe_pagar == 0 || obj_datos.importe_pagar == '0' || obj_datos.importe_pagar == null || obj_datos.importe_pagar == '') {
                return;
            } else {
                if (obj_datos.importe_pagar < 0) {
                    auxiliarServices.NotificationMessage('Sistemas', 'El importe a Pagar debe de ser mayor a Cero {0} ', 'error', '#ff6849', 1500);
                    return;
                }
            }
        }

        if (parseFloat(obj_datos.importe_pagar) > parseFloat(obj_datos.saldo_pendiente)) {
            auxiliarServices.NotificationMessage('Sistemas', 'El importe a pagar supera el Saldo pendiente, verifique', 'error', '#ff6849', 2000);
            return;
        }

        $scope.leyendas();
 
    };
    
    $scope.clean_Pagos = function () {
        $scope.objeto_parametros_pagos.id_formaPago = '0';
        $scope.objeto_parametros_pagos.id_banco = '0';
        $scope.objeto_parametros_pagos.fechaOperacion = auxiliarServices.getDateNow();
        $scope.objeto_parametros_pagos.nroOperacion = '';
        $timeout(function () {
            $('#cbo_banco').val("0").trigger('change.select2');
        }, 300);

        //---- adjuntar pagos -----
        $scope.files = [];
        $scope.imgProducto = "../content/img/sinImagen.jpg";
        $("#inputFileOpen").val('');

    };

    var id_factura_global;
    var obj_Global_Principal;

    $scope.showFileName = false;
    $scope.titleFile = 'Adjuntar Documento';

    $scope.AbrirModal_Pagos = function (obj_data) {         

        if (obj_data.cancelar == false) {
            obj_data.cancelar = true;
        }

        var rb_efectivo = document.getElementById('rb_efectivo');
        var rb_deposito = document.getElementById('rb_deposito');
        $scope.disabledDeposito = 'disabledContent';

        $('#modalPagos').modal('show');
        obj_Global_Principal = obj_data;
        id_factura_global = obj_data.id_Factura_Cab;

        if (obj_data.id_banco == 0) {
            $scope.clean_Pagos();

            $scope.objeto_parametros_pagos.nameFile = '';
            $scope.showFileName = false;
            $scope.titleFile = 'Adjuntar Documento';

            $timeout(function () {
                rb_efectivo.checked = true;
            }, 300);
        } else {

            $scope.files = [];
            $("#inputFileOpen").val('');
            $scope.objeto_parametros_pagos.id_formaPago = 0
            $scope.objeto_parametros_pagos.id_banco = obj_data.id_banco;
            $scope.objeto_parametros_pagos.fechaOperacion = obj_data.fechaOperacion;
            $scope.objeto_parametros_pagos.nroOperacion = obj_data.nroOperacion;
             
            $scope.disabledDeposito = '';               

            if (obj_data.file.name) {
                $scope.objeto_parametros_pagos.nameFile = obj_data.file.name;
                $scope.showFileName = true;
                $scope.titleFile = 'Reemplazar Documento';
            } else {
                $scope.objeto_parametros_pagos.nameFile = '';
                $scope.showFileName = false;
                $scope.titleFile = 'Adjuntar Documento';
            }

            $timeout(function () {
                rb_deposito.checked = true;
                $('#cbo_banco').val(obj_data.id_banco).trigger('change.select2');
            }, 300);
        }
    };

    $scope.change_habilitarDeposito = function (opcion) { 
        
        var rb_efectivo = document.getElementById('rb_efectivo');
        var rb_deposito = document.getElementById('rb_deposito');

        if (rb_efectivo.checked === true) {
            $scope.disabledDeposito = 'disabledContent';
        }
        if (rb_deposito.checked === true) {
            $scope.disabledDeposito = '';
        }
        id_factura_global = obj_Global_Principal.id_Factura_Cab;

        if (opcion == 1) {
            $scope.clean_Pagos();
        } else {
            $scope.cargar_Depositos(obj_Global_Principal);
        }
    };

    $scope.cargar_Depositos = function (obj_data) {
        if (obj_data.id_banco == 0) {
            $scope.clean_Pagos();
        } else {
            $scope.objeto_parametros_pagos.id_formaPago = 0
            $scope.objeto_parametros_pagos.id_banco = obj_data.id_banco;
            $scope.objeto_parametros_pagos.fechaOperacion = obj_data.fechaOperacion;
            $scope.objeto_parametros_pagos.nroOperacion = obj_data.nroOperacion;

            if (obj_data.file.name) {
                $scope.objeto_parametros_pagos.nameFile = obj_data.file.name;
                $scope.showFileName = true;
                $scope.titleFile = 'Reemplazar Documento';
            } else {
                $scope.objeto_parametros_pagos.nameFile = '';
                $scope.showFileName = false;
                $scope.titleFile = 'Adjuntar Documento';
            }

            $timeout(function () {
                $('#cbo_banco').val(obj_data.id_banco).trigger('change.select2');
            }, 300);
        }
        $('#modalPagos').modal('show');
    };

    $scope.GuardarDeposito = async function () {
        var rb_efectivo = document.getElementById('rb_efectivo');
        var rb_deposito = document.getElementById('rb_deposito');
        var flag_opcion = '';

        if (rb_efectivo.checked === true) {
            flag_opcion = 'E';
        }
        if (rb_deposito.checked === true) {
            flag_opcion = 'D';
        }

        if (flag_opcion == 'D') {
            if ($scope.objeto_parametros_pagos.id_banco === null || $scope.objeto_parametros_pagos.id_banco === undefined || $scope.objeto_parametros_pagos.id_banco === 0 || $scope.objeto_parametros_pagos.id_banco === '0') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese seleccione el Banco', 'error', '#ff6849', 1500);
                return false;
            }
            if ($scope.objeto_parametros_pagos.fechaOperacion === 0 || $scope.objeto_parametros_pagos.fechaOperacion === '0' || $scope.objeto_parametros_pagos.fechaOperacion === null || $scope.objeto_parametros_pagos.fechaOperacion === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha de la Operacion', 'error', '#ff6849', 1500);
                return false;
            }
            if ($scope.objeto_parametros_pagos.nroOperacion === 0 || $scope.objeto_parametros_pagos.nroOperacion === '0' || $scope.objeto_parametros_pagos.nroOperacion === null || $scope.objeto_parametros_pagos.nroOperacion === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nro de Operacion', 'error', '#ff6849', 1500);
                return false;
            }

            $scope.loaderfiltros = true;
            const { ok, data } = await PedidosServices.validar_nroOperacion($scope.objeto_parametros_pagos.id_banco, $scope.objeto_parametros_pagos.nroOperacion, $scope.objeto_parametros_pagos.fechaOperacion);
            $scope.loaderfiltros = false;
            $scope.$apply();  

            if (ok) {
                if (data[0].cantRegistro == 1) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos ese numero de operacion ya se registro con anterioridad', 'error', '#ff6849', 1500);
                    return false;
                }
            } else {
                auxiliarServices.NotificationMessage('Sistemas', data, 'error', '#ff6849', 3000);
                return false;
            }

            if (Object.keys($scope.files).length === 0) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor tiene que adjuntar algun voucher o comprobante ..', 'error', '#ff6849', 3500);
                return false;
            } 

            let flagExiste = false;
            for (obj_datos of $scope.listadetalle_documentos) {
                if (obj_datos.cancelar == true) {
                    if (obj_datos.FormaPago == 'DEPOSITO') {
                        if (obj_datos.nroOperacion == $scope.objeto_parametros_pagos.nroOperacion) {
                            flagExiste = true;
                            break;
                        }
                    }
                }
            } 

            if (flagExiste == true) {
                auxiliarServices.NotificationMessage('Sistemas', 'Ya se agrego el Número de Operacion con Anterioridad', 'error', '#ff6849', 3500);
                return false;
            }
        } 

        for (obj_datos of $scope.listadetalle_documentos) {  
            if (obj_datos.id_Factura_Cab == id_factura_global) {
                if (flag_opcion == 'E') {                 
                    obj_datos.id_formaPago = 0
                    obj_datos.id_banco = 0;
                    obj_datos.fechaOperacion = '';
                    obj_datos.nroOperacion = '';
                    obj_datos.FormaPago = 'EFECTIVO';
                    obj_datos.cancelar = true;
                } else {
                    obj_datos.id_formaPago = 0
                    obj_datos.id_banco = $scope.objeto_parametros_pagos.id_banco;
                    obj_datos.fechaOperacion = $scope.objeto_parametros_pagos.fechaOperacion;
                    obj_datos.nroOperacion = $scope.objeto_parametros_pagos.nroOperacion;
                    obj_datos.FormaPago = 'DEPOSITO';
                    obj_datos.cancelar = true;
                    obj_datos.file = $scope.files[0].file
                }
            }
        }
        $scope.leyendas();
        $('#modalPagos').modal('hide');
    }


    $scope.upload_imageComprobanteMasivo = function (listPagos) {
 
        const cant = listPagos.length ;
        const ejecutarEnvioVoucher = (index) => {

            console.log(index +'=='+ cant)
            if (index == cant ) {
                return
            }
            $scope.loaderfiltros = true;
            PedidosServices.uploadFile_imageComprobante_masivo(listPagos[index].file, listPagos[index].id_Factura_Cab, listPagos[index].cod_masivo, auxiliarServices.getUserId())
                .then(function (res) {
                    console.log('uploadFile_imageComprobante Masivo');
                    console.log(res);
                    $scope.loaderfiltros = false;
                    if (res.ok == false) {
                        auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error almacenando la imagen.', 'error', '#ff6849', 2500);
                        alert(res.data);
                    }
                }, function (error) {
                    $scope.loaderfiltros = false;
                    alert(error.ExceptionMessage)
                });             


            ejecutarEnvioVoucher(index + 1);

        }

        ejecutarEnvioVoucher(0)
    }
    
    $scope.generar_cancelacion_masiva = async function () {

        var flag_marco = false;
        let List_codigo = [];
        let listPagos = [];

        flag_marco = MarcoCheck();
        if (flag_marco == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione al menos un registro', 'error', '#ff6849', 1500);
            return ;
        }

        for (obj_datos of $scope.listadetalle_documentos) {
            if (obj_datos.cancelar == true) {                      

                if (obj_datos.importe_pagar == 0 || obj_datos.importe_pagar == '0' || obj_datos.importe_pagar == null || obj_datos.importe_pagar == '') {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Importe a pagar, verifique Nro-Doc :  ' + obj_datos.nro_doc , 'error', '#ff6849', 3000);
                    return;
                } else {
                    if (parseFloat(obj_datos.importe_pagar) < 0) {
                        auxiliarServices.NotificationMessage('Sistemas', 'El importe a Pagar debe de ser mayor a Cero {0} ', 'error', '#ff6849', 3000);
                        return;
                    }  
                }

                if (parseFloat(obj_datos.importe_pagar) > parseFloat(obj_datos.saldo_pendiente)) {
                    auxiliarServices.NotificationMessage('Sistemas', 'El importe a pagar supera el Saldo pendiente,  verifique Nro-Doc :  ' + obj_datos.nro_doc , 'error', '#ff6849', 3000);
                    return;
                }
            }
        }
        
        if ($scope.Objeto_ParametroFiltro.tipoResponsable == '1' || $scope.Objeto_ParametroFiltro.tipoResponsable == 1) {
            if ($scope.Objeto_ParametroFiltro.vendedor_cobranza == undefined || $scope.Objeto_ParametroFiltro.vendedor_cobranza == null || $scope.Objeto_ParametroFiltro.vendedor_cobranza == '0') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Responsable Cobranza Vendedor', 'error', '#ff6849', 1500);
                return;
            }
        }
        if ($scope.Objeto_ParametroFiltro.tipoResponsable == '2' || $scope.Objeto_ParametroFiltro.tipoResponsable == 2) {
            if ($scope.Objeto_ParametroFiltro.id_transportista_cobranza == undefined || $scope.Objeto_ParametroFiltro.id_transportista_cobranza == null || $scope.Objeto_ParametroFiltro.id_transportista_cobranza == '0') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Responsable Cobranza Transportista', 'error', '#ff6849', 1500);
                return;
            }
        }
        if ($scope.Objeto_ParametroFiltro.fecha_cancelacion == '0' || $scope.Objeto_ParametroFiltro.fecha_cancelacion == null || $scope.Objeto_ParametroFiltro.fecha_cancelacion == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha del Pago. ' , 'error', '#ff6849', 3000);
            return;
        }  
        if ($scope.Objeto_ParametroFiltro.nroRecibo === 0 || $scope.Objeto_ParametroFiltro.nroRecibo === '0' || $scope.Objeto_ParametroFiltro.nroRecibo === null || $scope.Objeto_ParametroFiltro.nroRecibo === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nro de Recibo', 'error', '#ff6849', 1500);
            return false;
        }

        const fechaDia = auxiliarServices.getDateNow();

        if ($scope.Objeto_ParametroFiltro.fecha_cancelacion != fechaDia) {
            var params = {
                title: "Desea continuar ?",
                text: 'Aunque la fecha de Cancelación es diferente a la fecha Actual',
                type: 'confirmationAlert'
            };
            const fechaVerifi = await auxiliarServices.initSweetAlert(params).then(function (res) { return res });
            if (fechaVerifi == false) {
                return false;
            }
        }

        //------verificando el nro recibo ----
        $scope.loader_modal_ayuda = true;
        const { ok, data } = await CancelacionMasivaServices.validar_nroRecibo($scope.Objeto_ParametroFiltro.id_local, $scope.Objeto_ParametroFiltro.nroRecibo );
        $scope.loader_modal_ayuda = false;
        $scope.$apply();

        if (ok) {
            if (data[0].cantRegistro > 1) {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos ese numero de recibo ya se registro con anterioridad', 'error', '#ff6849', 1500);
                return false;
            }
        } else {
            auxiliarServices.NotificationMessage('Sistemas', data, 'error', '#ff6849', 3000);
            return false;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por generar la Cancelación masiva, verifique. Una vez enviado no hay marcha atras.',
            type: 'confirmationAlert'
        };

        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res === true) {

                $('#btn_cancelar').attr("disabled", true);

                let codMasivo = getCodUniq();
                codMasivo = 'M_' + codMasivo;

                List_codigo = ListaMarcoCheck(codMasivo);
                listPagos = ListaAgregoDeposito(codMasivo);                
                
                $scope.loaderfiltros = true;
                CancelacionMasivaServices.set_guardando_Detalle_Pagos(List_codigo)
                .then(function (data) {
                    $scope.loaderfiltros = false;
                    if (data == "OK") {
                                                                     
                        if (listPagos.length > 0) {
                            //---- almacenando las imagenes ----
                            $scope.upload_imageComprobanteMasivo(listPagos);
                            $scope.actualizar_informacion();
                        } else {
                            $scope.actualizar_informacion();
                        }

                        $scope.Objeto_ParametroFiltro.tipoResponsable = 1;
                        $scope.Objeto_ParametroFiltro.vendedor_cobranza = '0';
                        $scope.Objeto_ParametroFiltro.id_transportista_cobranza = '0';
                        $scope.Objeto_ParametroFiltro.fecha_cancelacion = auxiliarServices.getDateNow();
                        $scope.Objeto_ParametroFiltro.nroRecibo = ''                         
                        $scope.configuraTipoResponsable(1);

                        $('#btn_descartar').attr("disabled", false);
                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Proceso de cancelación masiva  realizada correctamente !'
                            };
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });
                        }, 500);


                    } else { 
                        $('#btn_cancelar').attr("disabled", false);
                        $('#btn_descartar').attr("disabled", true);
                        $timeout(function () {
                            let paramsErr = {
                                type: 'error',
                                title: 'Error !',
                                text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                            };
                            auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                            });

                            console.log(err);
                        }, 500);
                    }
                }, function (err) {
                        $scope.loaderfiltros = false;
                    console.log(err);
                });
            }
        });
    }
    
    function MarcoCheck() {
        var flag_marco = false;
        for (obj_datos of $scope.listadetalle_documentos) {
            if (obj_datos.cancelar == true) {
                flag_marco = true;
                break;
            }
        }
        return flag_marco;
    }
 
    function getCodUniq() {
        // CAPTURANDO FECHA ACTUAL
        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1;
        var yyyy = hoy.getFullYear();
        var hour = hoy.getHours();
        var minuts = hoy.getMinutes();
        var second = hoy.getSeconds();
        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }
        hoy = yyyy + '' + mm + '' + dd + '' + hour + '' + minuts + '' + second;
        // GENERANDO CODIGO ALEATORIO
        var codigoAle = Math.floor(Math.random() * 1000000);
        // CODIGO DEL USUARIO LOGEADO
        var dataUser = auxiliarServices.getUserId();
        return 'C_'+dataUser + '_' + codigoAle + '_' + hoy;
    }
    
    function ListaMarcoCheck(codMasivo) {
        var List_id = [];
        let ac = 0;

        for (obj_datos of $scope.listadetalle_documentos) {
            if (obj_datos.cancelar == true) {

                let codRef = getCodUniq();
                ac = ac + 1;
                List_id.push({
                    id_Factura_Cab: obj_datos.id_Factura_Cab,
                    cod_ref: ac + '_' + codRef,
                    fecha_cancelacion: $scope.Objeto_ParametroFiltro.fecha_cancelacion,
                    saldo_pendiente: parseFloat(obj_datos.saldo_pendiente),
                    importe_pagar: parseFloat(obj_datos.importe_pagar),
                    fechaOperacion: obj_datos.fechaOperacion,
                    nroOperacion: obj_datos.nroOperacion,
                    id_banco: obj_datos.id_banco,
                    id_usuario: auxiliarServices.getUserId(),
                    nro_recibo: $scope.Objeto_ParametroFiltro.nroRecibo,
                    cod_masivo: codMasivo,
                    id_vendedor: $scope.Objeto_ParametroFiltro.vendedor_cobranza,
                    id_transportista: $scope.Objeto_ParametroFiltro.id_transportista_cobranza
                })
            }
        }
        return List_id;
    }

    function ListaAgregoDeposito(codMasivo) {
        let listPagos = [];
        for (obj_datos of $scope.listadetalle_documentos) {
            if (obj_datos.cancelar == true) {
                if (obj_datos.FormaPago == 'DEPOSITO') {
                    listPagos.push({
                        id_Factura_Cab: obj_datos.id_Factura_Cab,
                        file: obj_datos.file,
                        cod_masivo: codMasivo
                    });
                }
            }
        } 
        return listPagos;
    }
          
    document.querySelector("#buscar").onkeyup = function () {
        $TableFilter("#tbl_detalle", this.value);
    }

    $TableFilter = function (id, value) {
        var rows = document.querySelectorAll(id + ' tbody tr');

        for (var i = 0; i < rows.length; i++) {
            var showRow = false;

            var row = rows[i];
            row.style.display = 'none';

            for (var x = 0; x < row.childElementCount; x++) {
                if (row.children[x].textContent.toLowerCase().indexOf(value.toLowerCase().trim()) > -1) {
                    showRow = true;
                    break;
                }
            }

            if (showRow) {
                row.style.display = null;
            }
        }
    }
    
    $scope.generar_rechazo_cancelacion_masiva = function () { 

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Rechazar las cancelaciones que habia realizado. Una vez enviado no hay marcha atras.',
            type: 'confirmationAlert'
        };

        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res === true) {

                $scope.loaderSave = true;
                CancelacionMasivaServices.set_descartando_Detalle_Pagos(auxiliarServices.getUserId())
                    .then(function (data) {
                        console.log('set_descartando_Detalle_Pagos')
                        console.log(data)
                        $scope.loaderSave = false;
                        if (data == "OK") { 
                            $('#btn_descartar').attr("disabled", true);
                            $timeout(function () {
                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Proceso de Rechazar las Cancelaciones realizada correctamente !'
                                };
                                auxiliarServices.initSweetAlert(params).then(function (res) {

                                });
                            }, 500);
                        } else {
 
                            $timeout(function () {
                                let paramsErr = {
                                    type: 'error',
                                    title: 'Error !',
                                    text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                                };
                                auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                                });

                                console.log(err);
                            }, 500);
                        }
                    }, function (err) {
                        console.log(err);
                    });
            }
        });
    }
     
    $scope.marcarTodos = function (checked) {
        if (checked) {
            angular.forEach($scope.listadetalle_documentos, function (child) {
                child.cancelar = true;
            })
        } else {
            angular.forEach($scope.listadetalle_documentos, function (child) {
                child.cancelar = false;
            })
        }

        $scope.leyendas();
    }

    $scope.Total_documentos = 0;
    $scope.Total_marcados = 0;
    $scope.Total_pendientes = 0;
       
    $scope.MontoFacturado = 0;
    $scope.TotalPagos = 0;
    $scope.Saldo = 0;

    $scope.leyendas = function () {
        $scope.Total_documentos = $scope.listadetalle_documentos.length;
        var marcados = 0;
        let totalPago = 0;
        let montoFac = 0;

        for (obj of $scope.listadetalle_documentos) {
            if (obj.cancelar == true) {
                marcados += 1;
                totalPago += Number(obj.importe_pagar);
                montoFac += Number(obj.saldo_pendiente);
            }
        }
               
        $scope.Total_marcados = marcados;
        $scope.Total_pendientes = ($scope.Total_documentos - $scope.Total_marcados);
        
        $scope.MontoFacturado = parseFloat(montoFac).toFixed(2);
        $scope.TotalPagos = parseFloat(totalPago).toFixed(2);
        
        $scope.Saldo = parseFloat($scope.MontoFacturado - $scope.TotalPagos).toFixed(2);

    }

    function getCodUniq() {
        // CAPTURANDO FECHA ACTUAL
        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1;
        var yyyy = hoy.getFullYear();
        var hour = hoy.getHours();
        var minuts = hoy.getMinutes();
        var second = hoy.getSeconds();
        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }
        hoy = yyyy + '' + mm + '' + dd + '' + hour + '' + minuts + '' + second;
        // GENERANDO CODIGO ALEATORIO
        var codigoAle = Math.floor(Math.random() * 1000000);
        // CODIGO DEL USUARIO LOGEADO
        var dataUser = auxiliarServices.getUserId();
        return dataUser + '_' + codigoAle + '_' + hoy;
    }


    //------- pagos adjuntar imagenen ----

    $scope.imgProducto = "../content/img/sinImagen.jpg";
    $scope.files = [];

    $scope.changeImagen = function (event) {
        var filesTemporal = event.target.files; //FileList object       
        var fileE = [];
        for (var i = 0; i < event.target.files.length; i++) { //for multiple files          
            fileE.push({
                'file': filesTemporal[i]
            })

        }
        $scope.files = fileE;

        $timeout(function () {
            $scope.showFileName = false;
        }, 0);
    };

 
       
    $scope.changeTipoResponsable = function () {
        $scope.configuraTipoResponsable($scope.Objeto_ParametroFiltro.tipoResponsable);
    }

    $scope.configuraTipoResponsable = function (tipoResponsable) {
 
        if (tipoResponsable == 1) {

            $scope.Objeto_ParametroFiltro.id_transportista_cobranza = '0'; 
            $scope.Objeto_ParametroFiltro.vendedor_cobranza = '0';
            $timeout(function () {
                $("#cbo_vendedor_cobranza").select2();
                $('#cbo_vendedor_cobranza').val('0').trigger('change.select2');
            }, 0);

        }
        if (tipoResponsable == 2) {

            $scope.Objeto_ParametroFiltro.vendedor_cobranza = '0';
            $scope.Objeto_ParametroFiltro.id_transportista_cobranza = '0';
            $timeout(function () {
                $("#cboTransportista_cobranza").select2();
                $('#cboTransportista_cobranza').val('0').trigger('change.select2');
            }, 0);

        }
    }


    var oTablePagos;
    $scope.detalle_otrosPagos = [];
    $scope.detallePagos = [];

    $scope.objPago_Global;

    $scope.abrir_modal_detallePagos = function (obj_data) {

        id_factura_global = obj_data.id_Factura_Cab;
        $scope.objPago_Global = obj_data;

        console.log($scope.objPago_Global)

        $('#modalDetallePagos').modal('show');
        $scope.mostrarOcultar();

        $scope.loaderSave = true;
        CancelacionMasivaServices.get_detalladoDocumentos(id_factura_global)
            .then(function (res) {
                $scope.loaderSave = false;
                if (res.ok == true) {
                    $scope.detallePagos = [];
                    $scope.detallePagos = res.data.dt_detallePagos;
                    $timeout(function () {
                        $scope.loaderSave = false;
                        if (oTablePagos == null) {
                            oTablePagos = 'data'
                            auxiliarServices.initFooTable('tablaPagos', '');
                        } else {
                            $('#tablaPagos').trigger('footable_initialize');
                        }
                    }, 500)
                    $scope.detalle_otrosPagos = [];
                    $scope.detalle_otrosPagos = res.data.dt_detalleOtros;
                    $timeout(function () {
                        $scope.loaderSave = false; 
                        auxiliarServices.initFooTable('tabla_OtrosPagos', ''); 
                    }, 500)
                    $scope.totalModal();

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                    $scope.loaderSave = false;
                console.log(error);
            })
    }
    
    $scope.TotalDetalleOtrosPagos = 0;
    $scope.TotalDetallePagos = 0;

    $scope.TOT_GENERAL = 0;
    $scope.TOT_FACTURA = 0;
    $scope.TOT_SALDO = 0;
    
    $scope.totalModal = function () {
        let totPag = 0;
        let totPagOtro = 0;

        $scope.TotalDetalleOtrosPagos = 0;
        $scope.TotalDetallePagos = 0;
        $scope.TOT_GENERAL = 0;
        $scope.TOT_FACTURA = 0;
        $scope.TOT_SALDO = 0;


        for (item of $scope.detallePagos) {
            totPag += Number(item.importePagar)
        }
        $scope.TotalDetallePagos = parseFloat(totPag).toFixed(2);

        for (item of $scope.detalle_otrosPagos) {
            totPagOtro += Number(item.importePagar)
        }
        $scope.TotalDetalleOtrosPagos = parseFloat(totPagOtro).toFixed(2);

        $scope.TOT_GENERAL = parseFloat(totPag + totPagOtro).toFixed(2);
        $scope.TOT_FACTURA = parseFloat($scope.objPago_Global.importe_pagar).toFixed(2);
        $scope.TOT_SALDO = parseFloat($scope.TOT_GENERAL - $scope.TOT_FACTURA).toFixed(2);;
    }
       
    $scope.descargar_detallePagosVoucher = function (obj_data) {
        console.log(obj_data.url)
        const id_link = document.getElementById('id_link');
        setTimeout(function () {
            id_link.href = obj_data.url;
            id_link.click();
        }, 0);
    }
       
    $scope.reportePlanillaCobranza = function () {

        if ($scope.Objeto_ParametroFiltro.id_local == '0' || $scope.Objeto_ParametroFiltro.id_local == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor selecciona la Zona', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_ParametroFiltro.fecha == '' || $scope.Objeto_ParametroFiltro.fecha == null) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor selecciona la Fecha', 'error', '#ff6849', 1500);
            return false;
        }

        const fechaIni = $scope.Objeto_ParametroFiltro.fecha;
        const fechaFin = $scope.Objeto_ParametroFiltro.fecha;

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Generar la Planilla de Cobranza en PDF',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderFiltro = true;
                ConsolidadoServices.get_generarPlanillaCobranza_pdf(fechaIni, fechaFin, $scope.Objeto_ParametroFiltro.id_local, $scope.Objeto_ParametroFiltro.id_transportista, auxiliarServices.getUserId()).then(function (res) {
                    $scope.loaderFiltro = false;

                    if (res.ok == true) {
                        if (res.data.length > 0) {
                            $scope.generarPDF_planillaCobranza(res.data, fechaIni, fechaFin);
                        } else {
                            auxiliarServices.NotificationMessage('Sistemas', 'No hay información para mostrar', 'error', '#ff6849', 1500);
                            return false;
                        }
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(JSON.stringify(res.data));
                    }
                }, function (err) {
                    $scope.loaderFiltro = false;
                    console.log(err);
                })
            }
        });
    }

    $scope.generarPDF_planillaCobranza = function (pedidos) {

        var doc = new jsPDF()
        var altura = 18;
        let nroPag = 1;

        const cabeceraReporte = (nroPag) => {
            //------- cabecera del pdf -----
            doc.setFontSize(7.5);
            doc.text(8, 9, pedidos[0].empresa);
            doc.text(8, 12, pedidos[0].sede);


            doc.text(192, 7, auxiliarServices.getDateNow());
            doc.text(192, 10, auxiliarServices.getHourNow());
            doc.text(192, 13, String('Pag. ' + nroPag));

            doc.setFontSize(13);
            doc.setFont("courier");
            doc.setFontType("bold");
            doc.text(50, altura, pedidos[0].tituloReporte);
            altura = altura + 6;
            doc.setFontType("normal");
            doc.setFontType("bold");
            doc.setFontSize(10);
            doc.text(75, altura, pedidos[0].subTituloReporte);

            altura = altura + 8;
            //------- fin de cabecera del pdf -----


            //------- cabecera del detalle del pdf -----

            doc.setFontSize(6.5);


            doc.line(4, altura + 1.5, 205, altura + 1.5) // horizontal line
            altura = altura + 6;

            doc.text(5, altura, 'DOCUMENTO'); doc.text(28, altura, 'F.EMISION'); doc.text(45, altura, 'F.VENCIM');
            doc.text(62, altura, 'MON'); doc.text(72, altura, 'VENDEDOR'); doc.text(100, altura, 'CLIENTE'); doc.text(140, altura, 'SALDO PEND');
            doc.text(157, altura, 'MONTO PAGO'); doc.text(174, altura, 'TIPO PAGO'); doc.text(192, altura, 'CHEQUE.');
            altura = altura + 2;
            doc.line(4, altura + 1.5, 207, altura + 1.5) // horizontal line
            altura = altura + 4;

            doc.setFontType("normal");
            doc.setFontSize(7);
        }
        cabeceraReporte(nroPag);

        let idTransportista = 0
        let splitTitle = '';
        let splitTitle2 = '';
        let espacio = 0;

        let totalRegistro = 0;
        let saldoPendiente = 0;
        let montoPago = 0;

        //-----  calculo de totales 
        totalRegistro = pedidos.length;
        pedidos.forEach(pedido => {
            saldoPendiente += (!pedido.saldoPendiente) ? 0 : parseFloat(pedido.saldoPendiente);
            montoPago += (!pedido.montoPago) ? 0 : parseFloat(pedido.montoPago);
        })

        for (var i = 0; i < pedidos.length; i++) {

            if (idTransportista != pedidos[i].idTransportista) {

                idTransportista = pedidos[i].idTransportista;

                doc.setFontSize(8.5);
                doc.setFontType("bold");
                altura = altura + 2;
                doc.line(4, altura - 4.2, 100, altura - 4.2) // horizontal line
                doc.text(8, altura, 'TRANSPORTISTA : ' + pedidos[i].transportista)
                doc.line(4, altura + 1.5, 100, altura + 1.5) // horizontal line
                doc.setFontType("normal");
                doc.setFontSize(7);

                altura = altura + 6;
            }

            if (idTransportista == pedidos[i].idTransportista) {

                doc.text(3, altura, pedidos[i].documento);
                doc.text(28, altura, pedidos[i].fechaEmision);
                doc.text(45, altura, pedidos[i].fechaVencimiento);
                doc.text(62, altura, pedidos[i].Moneda);
                doc.text(67, altura, pedidos[i].vendedor);

                splitTitle = doc.splitTextToSize(String(pedidos[i].cliente.trim()), 54);
                doc.text(91, altura, splitTitle);

                doc.writeText(147, altura, auxiliarServices.formatearNumero(pedidos[i].saldoPendiente, 2), { align: 'right', width: 8 });
                doc.writeText(162, altura, String(pedidos[i].montoPago), { align: 'right', width: 8 });

                doc.text(172, altura, String(pedidos[i].tipoPago));
                splitTitle2 = doc.splitTextToSize(String(pedidos[i].cheque.trim()), 20);
                doc.text(190, altura, splitTitle2);
                espacio = 0;
                //espacio = (splitTitle.length == 1) ? 4.5 : 8;

                if (splitTitle.length == 1) {
                    espacio = 4.5;
                    if (splitTitle2.length > 1) {
                        espacio = 8;
                    }
                } else {
                    espacio = 8;
                }

                altura = altura + espacio;

                if (altura >= 268) {
                    //--Paginacion
                    nroPag = nroPag + 1;
                    doc.addPage();
                    altura = 18;
                    cabeceraReporte(nroPag);
                }

                //footer del Reporte
                if (i == pedidos.length - 1) {

                    altura = altura + 10;

                    if (altura >= 268) {
                        doc.addPage();
                        altura = 18;
                    }
                    doc.line(140, altura - 5, 170, altura - 5) // horizontal line

                    doc.setFontType("bold");
                    doc.text(20, altura, 'NUMERO DE DOCUMENTO: ' + totalRegistro);
                    doc.writeText(120, altura, String('MONTO TOTAL'));
                    doc.writeText(147, altura, auxiliarServices.formatearNumero(saldoPendiente, 2), { align: 'right', width: 8 });
                    doc.writeText(162, altura, auxiliarServices.formatearNumero(montoPago, 2), { align: 'right', width: 8 });
                    altura = altura + 10;

                    nroPag = nroPag + 1;
                    doc.addPage();
                    altura = 18;

                }
            }
        }

        var string = doc.output('datauristring');
        var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
        var x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();


        setTimeout(function () {
            const ale = getCodUniq();

            doc.save(ale + '.pdf');
            var blob = doc.output("blob");
            var blobURL = URL.createObjectURL(blob);
            var downloadLink = document.getElementById('pdf-download-link');
            downloadLink.href = blobURL;
        }, 0);


    }
         
    $scope.reporteCierreVentas = function () {

        if ($scope.Objeto_ParametroFiltro.fechaIni == '' || $scope.Objeto_ParametroFiltro.fechaIni == null) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor selecciona la Fecha Inicial', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_ParametroFiltro.fechaFin == '' || $scope.Objeto_ParametroFiltro.fechaFin == null) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor selecciona la Fecha Final', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_ParametroFiltro.nroRecibo == '' || $scope.Objeto_ParametroFiltro.nroRecibo == null) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nro Recibo', 'error', '#ff6849', 1500);
            return false;
        }

        const fechaIni = $scope.Objeto_ParametroFiltro.fechaIni;
        const fechaFin = $scope.Objeto_ParametroFiltro.fechaFin;

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por generar el archivo',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderFiltro = true;            
                CancelacionMasivaServices.get_reporteCierreVenta(fechaIni, fechaFin, $scope.Objeto_ParametroFiltro.nroRecibo)
                    .then(function (res) {
                        $scope.loaderFiltro = false;
                        if (res.ok) {

                            if (res.data.length > 0) {
                                GenerarReporte(res.data, fechaIni, fechaFin, $scope.Objeto_ParametroFiltro.nroRecibo);
                            } else {
                                auxiliarServices.NotificationMessage('Sistemas', 'No hay informacion para Generar el Reporte, verifique las Fechas o el Nro Recibo ..', 'error', '#ff6849', 3500);
                            }

                        } else {
                            alert(JSON.stringify(res.data));
                        }
                    }, function (err) {
                        $scope.loaderFiltro = false;
                        console.log(err);
                    });

            }
        });
    }

    function esEntero(numero) {
        var indicador = false;

        if (numero % 1 === 0) {
            indicador = true;
        }
        return indicador;
    }

    function GenerarReporte(data, fechaini, fechafin, nroRecibo) {

        var altura = 40;
        var TotalPagoCuenta = 0;
        var nroPag = 0;

        var imgData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4RDuRXhpZgAATU0AKgAAAAgABAE7AAIAAAAMAAAISodpAAQAAAABAAAIVpydAAEAAAAYAAAQzuocAAcAAAgMAAAAPgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERlc2Fycm9sbG8yAAAFkAMAAgAAABQAABCkkAQAAgAAABQAABC4kpEAAgAAAAMzMwAAkpIAAgAAAAMzMwAA6hwABwAACAwAAAiYAAAAABzqAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAxODowMToxNiAxNTowNzoxNAAyMDE4OjAxOjE2IDE1OjA3OjE0AAAARABlAHMAYQByAHIAbwBsAGwAbwAyAAAA/+ELHmh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iLz48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+PHhtcDpDcmVhdGVEYXRlPjIwMTgtMDEtMTZUMTU6MDc6MTQuMzMzPC94bXA6Q3JlYXRlRGF0ZT48L3JkZjpEZXNjcmlwdGlvbj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+PGRjOmNyZWF0b3I+PHJkZjpTZXEgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOmxpPkRlc2Fycm9sbG8yPC9yZGY6bGk+PC9yZGY6U2VxPg0KCQkJPC9kYzpjcmVhdG9yPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0ndyc/Pv/bAEMABwUFBgUEBwYFBggHBwgKEQsKCQkKFQ8QDBEYFRoZGBUYFxseJyEbHSUdFxgiLiIlKCkrLCsaIC8zLyoyJyorKv/bAEMBBwgICgkKFAsLFCocGBwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKv/AABEIACkAbQMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APpGimSypBE0krBUUZJPauTuvGUpbdawrHDu2oXGWkPsOwrGpWhS+ImUlHc6+isTS/EH2uQQ3sawSnphuvsR2NT654hsfDtrFPqTSKkr7F2IWOcZ/pTp1YVVeLJlVhGDnJ2SNSiue0rxxomsagtlazSJcOPkSaIpu9hnvVa4+I2g2t3NbSvc+ZC5R9sBIBBwa1MPruGUeb2it6nVUVz8njXSIodOldpguokiD90cnDbefTk1t3NzDZ2slxcyLFDEpZ3Y8KBQbRrU535ZJ23/ADJaK5W1+I/h67vktUnmQyNtSSSIqhP17fjU+q+OdG0bUpLC9acTxgFgkJYcjI5/Ggx+u4Zx5/aK2250dFc4vjrRn0aXVA1wLaGUQsTCQ24jI4qzeeLNKstLs9Qlldre9YLC0aFskjuO1Bf1qg1fnW19+nc2qKTcC23POM4paDoMvXYHubPyg4jj2ku55/Tv3rnjo8Zl8y1mLSwQKIhIuACe+fXkn611l7F5kPIyB1Ht0NZqWwQ8ckrtz6jsf6V4+Ldqj0MJp3OZsrZ45isilWU4YHqDW34jsU1jRbIT4O1w3I74Ip11Dm5QouXkUZ9z0rSultobe1trhZHJOFCew5P0rzsHCrJ1VTdtF9/T8DnVNzU4PYxRpYbxRaX+omKeaNQsZhGNvXGfXrUdhpM9pqmoTafPbwNPKWkMqg55J/rW2Rp9hqEMJR/NkI2nqFJyBn64NOFpZT3k8eyQvHgu2eMnnivQ9litNVvtd9u9h/Vle9tb3/DuZGuaWL2fSpbt45JLc5LqOCdwPH5Vo+IoYtT0Oe2SRWDFSwBzwCKWKTTbvTWnAkENqCTuyCBgN/I06FrGKzNzHHIVkbyShGWzu24x9a0UcS3JXVpLvqtPTuX7H4tFaW/3WKg0zRP7Bsra8toZYoQpVdvRscniqtzpbf8ACWy31nJFDM0YXdIuRjaBj9K1ZINPs72CN0cvK2EGcgH370+SKzu9SkiZJDKoG5hwoOAcfXGKUo4uUEtE01s3211t1JlQTS0WlvwM3WdPlv8Aw69vfzQzt5ytmNcDHasibw8IbKHTZCrQRTCeLI6ZHP8An610i/Y1024by28tJjGVDElmDbR+Zp15dWH2C2up1kaNh8mwcgYzz+ANRUpYiaupJOy6+bv09CamGjN8zWtrGigbznz0wMcVLTFQBy2T83bNPr14ppHeHWoDaoWyvHtU9FTOlCp8SAgS0jWfzcZfGB7VJLBFMF86NH2nK7lBwfWn0U404QVooLEbQRPKsrxo0ifdYqCV+hpwRQzMFALfeIHWnUVYEMFnBbW/kQRKkeMFQOv19acsESRrGsaBFIKqFGB+FSUUrICN4IpJFkeNGdPusVBI+hpfJi87zvLXzSNu/aM49M0+iiyAjMERjaMxIUckspUYYnrmhreFo1RokKKMBSowOMfyqSiiyAKKKKYH/9k=';

        var doc = new jsPDF("", "mm", "letter");
        doc.setProperties({
            title: 'Reporte Cierre de Ventas'
        });

        for (var i = 0; i < data.length; i++) {
            TotalPagoCuenta += parseFloat(data[i].pago_recibo_cuenta);
        }

        var cabeceraReporte = function () {

            var col = 8;
            var row = 10;
            var width = 40;
            var height = 18;

            doc.addImage(imgData, 'JPEG', col, row, width, height);

            doc.setFontSize(17);
            titulo = "COMERCIALIZACIÓN DE ALIMENTOS";
            doc.text(62, 16, String(titulo));

            doc.setFontSize(7);
            doc.text(198, 15, String(auxiliarServices.getDateNow()));
            doc.text(198, 19, String(auxiliarServices.getHourNow()));

            doc.setFontSize(8);

            doc.text(88, 21, String(data[0].subTitulo1));
            doc.text(72, 24, String(data[0].subTitulo2));
            doc.text(72, 27, String(data[0].subTitulo3)); 

            doc.rect(5, 30, 205, 18);
            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(85, 34, 'CONTROL DE PAGOS');
            doc.line(5, 35.5, 210, 35.5); // horizontal line 
            doc.setFontSize(7);
            doc.text(7, 39, String("NUMERO RECIBO :   " + nroRecibo)); 
            doc.line(5, 39.7, 210, 39.7); // horizontal line 
            doc.text(7, 43, String("RESPONSABLE DE COBRANZA : " + String(data[0].responsableCobranza) ));
            doc.line(5, 43.8, 210, 43.8); // horizontal line 
            doc.text(7, 47, String("FECHAS       :   " + fechaini + ' AL ' + fechafin)); 
 
            doc.setFontSize(8);
            doc.setFont("helvetica");
            doc.setFontType("bold");
            altura = altura + 8;

            doc.rect(5, altura, 205, 10);
            altura = altura + 4;
            doc.setFontSize(6);
            doc.setFontType("bold");

            doc.text(8, altura + 2, 'FECHA');
            doc.line(20, altura - 4, 20, altura + 6); // Linea Vertical
            doc.text(24, altura + 2, 'NRO-DOC');
            doc.line(38, altura - 4, 38, altura + 6); // Linea Vertical 
            doc.text(60, altura + 2, 'CLIENTE'); 
            doc.line(90, altura - 4, 90, altura + 6); // Linea Vertical
            doc.text(92, altura + 2, 'IMPORTE FACTURA');
            doc.line(115, altura - 4, 115, altura + 6); // Linea Vertical
            doc.text(120, altura + 2, 'TIPO-PAG');
            doc.line(140, altura - 4, 140, altura + 6); // Linea Vertical
            doc.text(152, altura + 2, 'A CUENTA');
            doc.line(165, altura - 4, 165, altura + 6); // Linea Vertical
            doc.text(170, altura + 2, 'DEUDA TOTAL');
            doc.line(190, altura - 4, 190, altura + 6); // Linea Vertical
            doc.text(193, altura + 2, 'NRO-VOUCHER');

            altura = altura + 10;
            doc.setFontType("normal");
        };

        var TotalFormateado = function (Valor, altura, posic) {

            var TotalFormato = 0;
            var Resultado = parseFloat(Math.round(Valor * 100) / 100).toFixed(2);

            if (esEntero(Resultado)) {
                TotalFormato = auxiliarServices.formatNumber.new(Resultado);
            }
            else {
                TotalFormato = auxiliarServices.formatNumber.new(Resultado);
                var cant_dec = TotalFormato.split(".");
                if (cant_dec[1].length === 1) {
                    TotalFormato = TotalFormato + '0';
                }
            }

            switch (String(TotalFormato).length) {
                case 1:
                    doc.text(posic, altura, String(TotalFormato));
                    break;
                case 2:
                    posic = posic - 1;
                    doc.text(posic, altura, String(TotalFormato));
                    break;
                case 3:
                    posic = posic - 2;
                    doc.text(posic, altura, String(TotalFormato));
                    break;
                case 4:
                    posic = posic - 3;
                    doc.text(posic, altura, String(TotalFormato));
                    break;
                case 5:
                    posic = posic - 4;
                    doc.text(posic, altura, String(TotalFormato));
                    break;
                case 6:
                    posic = posic - 5;
                    doc.text(posic, altura, String(TotalFormato));
                    break;
                case 7:
                    posic = posic - 6;
                    doc.text(posic, altura, String(TotalFormato));
                    break;
                case 8:
                    posic = posic - 7;
                    doc.text(posic, altura, String(TotalFormato));
                    break;
                case 9:
                    posic = posic - 8;
                    doc.text(posic, altura, String(TotalFormato));
                    break;
                case 10:
                    posic = posic - 9.5;
                    doc.text(posic, altura, String(TotalFormato));
                    break;
                case 11:
                    posic = posic - 10.5;
                    doc.text(posic, altura, String(TotalFormato));
                    break;
                case 12:
                    posic = posic - 11;
                    doc.text(posic, altura, String(TotalFormato));
                    break;
                case 13:
                    posic = posic - 12;
                    doc.text(posic, altura, String(TotalFormato));
                    break;
                default:
                    posic = posic - 13.5;
                    doc.text(posic, altura, String(TotalFormato));
            }
        };

        cabeceraReporte();
        for (var i1 = 0; i1 < data.length; i1++) {
            doc.line(5, altura - 4, 5, altura); // Linea Vertical 
            doc.text(6, altura, String(data[i1].fechaemision));
            doc.line(20, altura - 4, 20, altura); // Linea Vertical 
            doc.text(22, altura, String(data[i1].nrodoc));
            doc.line(38, altura - 4, 38, altura); // Linea Vertical 
            doc.text(39, altura, String(data[i1].Cliente));
            doc.line(90, altura - 4, 90, altura); // Linea Vertical 
 
            TotalFormateado(data[i1].monto, altura, 111);
            doc.line(115, altura - 4, 115, altura); // Linea Vertical 
            doc.text(120, altura, String(data[i1].tipo));
            doc.line(140, altura - 4, 140, altura); // Linea Vertical 
            TotalFormateado(data[i1].pago_recibo_cuenta, altura, 162);
            doc.line(165, altura - 4, 165, altura); // Linea Vertical 
            TotalFormateado(data[i1].saldo_total, altura, 187);
            doc.line(190, altura - 4, 190, altura); // Linea Vertical 
            doc.text(195, altura, String(data[i1].nrovoucher));
            doc.line(210, altura - 4, 210, altura); // Linea Vertical 

            altura = altura + 1;
            doc.line(5, altura, 210, altura); // horizontal line 
            altura = altura + 3;

            if (altura >= 230) {
                //--Paginacion
                nroPag = nroPag + 1;
                doc.text(200, 270, String('PAG. ' + nroPag));
                //--Fin de Paginacion

                doc.addPage();
                altura = 40;
                cabeceraReporte();
            }
            //footer del Reporte
            if (i1 === data.length - 1) {
                doc.setFontType("bold");
                doc.text(115, altura - 0.5, String("TOTAL RECIBIDO S/."));
                doc.line(140, altura - 4, 140, altura); // Linea Vertical  
                TotalFormateado(TotalPagoCuenta, altura - 0.5, 162);
                doc.line(165, altura - 4, 165, altura); // Linea Vertical
                altura = altura + 0.5;
                doc.line(140, altura, 165, altura); // horizontal line 
            }
        }

        altura = 260;
        doc.line(15, altura - 3, 50, altura - 3); // horizontal line 
        doc.text(20, altura, String("FIRMA DEL VENDEDOR"));
        doc.line(168, altura - 3, 205, altura - 3); // horizontal line 
        doc.text(173, altura, String("FIRMA DE ADMINISTRACION"));
        //Paginacion
        nroPag = nroPag + 1;
        doc.setFontType("normal");
        doc.text(200, 270, String('PAG. ' + nroPag));
        //--Fin de Paginacion

        // CARGAMOS EL REPORTE . . .
        //doc.output('dataurlnewwindow');
        var string = doc.output('datauristring');
        var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
        var x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();

        setTimeout(function () {
            doc.save('CierreVentas.pdf');
            var blob = doc.output("blob");
            var blobURL = URL.createObjectURL(blob);
            var downloadLink = document.getElementById('pdf-download-link');
            downloadLink.href = blobURL;
        }, 0);
    }

    $scope.showOtrosDoc = true;
    $scope.labelOtrosDoc = '';
    $scope.mostrarOcultar = function () {

        if ($scope.showOtrosDoc == false) {
            $('#formOtrosDoc').show(); //muestro mediante id
            $scope.showOtrosDoc = true;
            $scope.labelOtrosDoc = 'Ocultar';
        } else {
            $('#formOtrosDoc').hide(); //muestro mediante id
            $scope.showOtrosDoc = false;
            $scope.labelOtrosDoc = 'Mostrar';
        }
    }

    $scope.change_vendedor = function (idVendedor) {
        $scope.Objeto_ParametroFiltro.vendedor_cobranza = String(idVendedor);

        $timeout(function () {
            $('#cbo_vendedor_cobranza').val(String(idVendedor)).trigger('change.select2');
        }, 0);


    }


})

 