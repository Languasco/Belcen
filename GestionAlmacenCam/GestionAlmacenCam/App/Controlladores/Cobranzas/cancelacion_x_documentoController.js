var app = angular.module('appGestion.cancelacion_x_documentoController', [])
app.controller('Ctrl_cancelacion_x_documento', function ($scope, loginServices, $location, $timeout, auxiliarServices, TipoDocumentoServices, GrupoDetServices, cancelacion_x_documentoServices, PagosVendedorServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        auxiliarServices.changeTitle("Registro de Cancelacion por Documento");
        $scope.titleModal = "Registro de Cancelacion por Documento"
        $scope.loaderSave = false;
        $scope.Listando_TipoDocumento();
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
        }, 100);

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
        id_TipoDocumento: '0',
        serie: '',
        num_doc: '',
        usuario: auxiliarServices.getUserId(),
    }

    $scope.objeto_parametros_pagos = {
        id_factura_cab: '',
        codRef: '',
        totalpago: '0',
        pagoCueta: '0',
        Saldo: '0',
        check_cuenta: '0',
        id_formaPago: '0',
        id_banco: '0',
        fechaOperacion: '0',
        nroOperacion: ''
    };
       
    $scope.Lista_TipoDoc = [];
    $scope.Listando_TipoDocumento = function () {
        $scope.loaderSave = true;
        TipoDocumentoServices.getTipoDocumento()
            .then(function (data) {
 
                $scope.loaderSave = false;
                $scope.Lista_TipoDoc = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id_TipoDocumento == 1 || data[i].id_TipoDocumento == 2 || data[i].id_TipoDocumento == 14 || data[i].id_TipoDocumento == 15) {
                        $scope.Lista_TipoDoc.push(data[i]);
                    }
                }
            }, function (err) {
                $scope.loaderSave = false;
                console.log(err);
            });
    };
       
    $scope.enterFocus = function (type, name) {
        if (type === 1) {
            $('#' + name + '').focus();
            $('#' + name + '').select();

        } else if (type === 2) {
            $('#' + name + '').select2('open');
        }
    };
          
    $scope.formateando = function (option) {
        if (option == 1) {
            if ($scope.Objeto_ParametroFiltro.serie == '' || $scope.Objeto_ParametroFiltro.serie == null || $scope.Objeto_ParametroFiltro.serie == undefined) {
                return;
            }
            $scope.Objeto_ParametroFiltro.serie = auxiliarServices.Formatear_CerosIzquierda(parseInt($scope.Objeto_ParametroFiltro.serie), 4);
        } else {
            if ($scope.Objeto_ParametroFiltro.num_doc == '' || $scope.Objeto_ParametroFiltro.num_doc == null || $scope.Objeto_ParametroFiltro.num_doc ==undefined) {
                return;
            }
            $scope.Objeto_ParametroFiltro.num_doc = auxiliarServices.Formatear_CerosIzquierda(parseInt($scope.Objeto_ParametroFiltro.num_doc), 7);
        }
    }

    var id_facturaglobal = 0;
    $scope.listadetalle_documentos = []
    $scope.actualizar_informacion = function () {

        if ($scope.Objeto_ParametroFiltro.id_TipoDocumento == undefined || $scope.Objeto_ParametroFiltro.id_TipoDocumento == null || $scope.Objeto_ParametroFiltro.id_TipoDocumento == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Tipo de documento', 'error', '#ff6849', 1500);
            return;
        }
        else if ($scope.Objeto_ParametroFiltro.serie == 0 || $scope.Objeto_ParametroFiltro.serie == '0' || $scope.Objeto_ParametroFiltro.serie == null || $scope.Objeto_ParametroFiltro.serie == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la serie del Documento', 'error', '#ff6849', 1500);
            return false;
        }
        else if ($scope.Objeto_ParametroFiltro.num_doc == 0 || $scope.Objeto_ParametroFiltro.num_doc == '0' || $scope.Objeto_ParametroFiltro.num_doc == null || $scope.Objeto_ParametroFiltro.num_doc == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el número del Documento', 'error', '#ff6849', 1500);
            return false;
        }

        $scope.Objeto_ParametroFiltro.serie = auxiliarServices.Formatear_CerosIzquierda(parseInt($scope.Objeto_ParametroFiltro.serie), 4);
        $scope.Objeto_ParametroFiltro.num_doc = auxiliarServices.Formatear_CerosIzquierda(parseInt($scope.Objeto_ParametroFiltro.num_doc), 7);


        $('#btn_descartar').attr("disabled", true);
        document.getElementById("form_detalle").style.display = "none";
        $scope.loaderSave = true;
        id_facturaglobal = 0;
        cancelacion_x_documentoServices.mostrando_registro_pagos($scope.Objeto_ParametroFiltro)
            .then(function (data) {       
                if (data.length > 0) {
                    id_facturaglobal = data[0].id_Factura_Cab;
                    $('#btn_cancelar').attr("disabled", false);
                } else {
                    document.getElementById("form_detalle").style.display = "none";
                }
                $scope.listadetalle_documentos = [];
                $scope.listadetalle_documentos = data;
                $timeout(function () {
                    $scope.loaderSave = false;
                    $("#tbl_detalle").tableHeadFixer({ "left": 3 });
                    document.getElementById("form_detalle").style.display = "";
                }, 1000);

                $scope.leyendas();
            }, function (err) {
                $scope.loaderSave = false;
                $('#btn_cancelar').attr("disabled", true);
                console.log(err);
            })
    }
    

    $scope.changeFocusInput = function (id) {
        var doc = document.getElementById(id);
        $timeout(function () {
            doc.focus();
        }, 100);
    }
    

    $scope.Total_documentos = 0;
    $scope.Total_factura = 0;
    $scope.Total_pendientes = 0;
    $scope.Total_pago =0

    $scope.leyendas = function () {

        $scope.Total_documentos = 0;
        $scope.Total_factura = 0;
        $scope.Total_pendientes = 0;
        $scope.Total_pago = 0
 
        var pago_factura = 0;

        if ($scope.listadetalle_documentos.length > 0) {
            for (obj of $scope.listadetalle_documentos) {
                if (obj.id_estado ==1) {
                    pago_factura = (pago_factura + parseFloat(obj.pago_factura));
                }      
            }

            $scope.Total_documentos = $scope.listadetalle_documentos.length;
            $scope.Total_factura = $scope.listadetalle_documentos[0].importe_total;
            $scope.Total_pago = pago_factura
            $scope.Total_pendientes = $scope.listadetalle_documentos[0].saldo_pendiente;
        }

    }

    $scope.SubTotal_G = 0;
    $scope.Igv_G = 0;
    $scope.Total_G = 0;


    $scope.AbrirModal_Pagos = function () {
        $scope.clean_Pagos();
        $('#modalPagos').modal('show');
    };

 

    $scope.disabledDeposito = 'disabledContent';
    $scope.disabledCuenta = 'disabledContent';
       

    $scope.Lista_SaldoPendiente = [];
    $scope.AbrirModal_PagosPendientes = function () {        
        if ($scope.Total_pendientes == undefined || $scope.Total_pendientes == null || $scope.Total_pendientes == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'No se cargo el saldo pendiente, actualice..', 'error', '#ff6849', 2500);
            return;
        }
        if ($scope.Total_pendientes == 0 || $scope.Total_pendientes == '0' ) {
            auxiliarServices.NotificationMessage('Sistemas', 'No se tiene saldo pendiente, se canceló la Totalidad del documento', 'error', '#ff6849', 2500);
            return;
        }
        if (parseFloat($scope.Total_pendientes) < 0 )  {
            auxiliarServices.NotificationMessage('Sistemas', 'No se tiene saldo pendiente, se canceló la Totalidad del documento', 'error', '#ff6849', 2500);
            return ;
        }

        $('#modalPagos').modal('show');
        ///---obteniendo el saldoPendiente del pedido
        $scope.loader_modal_ayuda = true;
        cancelacion_x_documentoServices.get_SaldoCuenta_Factura(id_facturaglobal)
            .then(function (data) {
                console.log(data);
                $scope.loader_modal_ayuda = false;
                $scope.Total_G = 0;
                for (var i = 0; i < data.length; i++) {
                    $scope.Total_G = data[i].saldoCuenta;
                    break;
                }
                $scope.clean_Pagos();
            }, function (err) {
                $scope.loader_modal_ayuda = false;
                console.log(err);
            });
    };

    $scope.clean_Pagos = function () {
        var rb_efectivo = document.getElementById('rb_efectivo');
        var chk_pago = document.getElementById('chk_pago');

        $scope.disabledDeposito = 'disabledContent';
        $scope.disabledCuenta = 'disabledContent';

        $scope.objeto_parametros_pagos.id_factura_cab = id_facturaglobal;
        $scope.objeto_parametros_pagos.codRef = '';
        $scope.objeto_parametros_pagos.totalpago = $scope.Total_G;
        $scope.objeto_parametros_pagos.pagoCueta = $scope.Total_G;
        $scope.objeto_parametros_pagos.Saldo = '0';
        $scope.objeto_parametros_pagos.check_cuenta = '0';
        $scope.objeto_parametros_pagos.id_formaPago = '0';
        $scope.objeto_parametros_pagos.id_banco = '0';
        $scope.objeto_parametros_pagos.fechaOperacion = '';
        $scope.objeto_parametros_pagos.nroOperacion = '';
        $timeout(function () {
            rb_efectivo.checked = true;
            chk_pago.checked = true;
            $('#cbo_banco').val("0").trigger('change.select2');
        }, 300);
        $scope.Calculo_Saldo();
    };


    $scope.change_habilitarPagoCuenta = function (opcion) {
        var chk_pago = document.getElementById('chk_pago');

        if (chk_pago.checked === true) {
            $scope.disabledCuenta = 'disabledContent';
        } else {
            $scope.disabledCuenta = '';
            $timeout(function () {
                $('#txt_pagoCuenta').focus().select();
            });
        }
    };

    $scope.change_habilitarDeposito = function () {
        var rb_efectivo = document.getElementById('rb_efectivo');
        var rb_deposito = document.getElementById('rb_deposito');

        if (rb_efectivo.checked === true) {
            $scope.disabledDeposito = 'disabledContent';
        }
        if (rb_deposito.checked === true) {
            $scope.disabledDeposito = '';
        }

        $timeout(function () {
            $('#cbo_banco').val("0").trigger('change.select2');
        }, 300);
    };


    $scope.Calculo_Saldo = function () {
        var saldo = $scope.objeto_parametros_pagos.totalpago - $scope.objeto_parametros_pagos.pagoCueta;
        $scope.objeto_parametros_pagos.Saldo = parseFloat(Math.round(saldo * 100) / 100).toFixed(2);
        return true;
    };

    $scope.GuardarPago = function () {

        var rb_deposito = document.getElementById('rb_deposito');
        if (isNaN($scope.objeto_parametros_pagos.pagoCueta) === true) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese un Valor correcto, verifique', 'error', '#ff6849', 1500);
            $timeout(function () {
                $('#txt_pagoCuenta').focus().select();
            });
            return;
        } else {
            if ($scope.objeto_parametros_pagos.pagoCueta === 0 || $scope.objeto_parametros_pagos.pagoCueta === '0' || $scope.objeto_parametros_pagos.pagoCueta === null || $scope.objeto_parametros_pagos.pagoCueta === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Pago a Cuenta', 'error', '#ff6849', 1500);
                return;
            } else {
                if ($scope.objeto_parametros_pagos.pagoCueta < 0) {
                    auxiliarServices.NotificationMessage('Sistemas', 'El pago a Cuenta debe de ser mayor a Cero {0} ', 'error', '#ff6849', 1500);
                    return;
                }
            }
        }

        if (parseFloat($scope.objeto_parametros_pagos.pagoCueta) > parseFloat($scope.objeto_parametros_pagos.totalpago)) {
            auxiliarServices.NotificationMessage('Sistemas', 'El Pago a Cuenta supera el Importe Total, verifique', 'error', '#ff6849', 2000);
            $timeout(function () {
                $('#txt_pagoCuenta').focus().select();
            });
            return;
        }

        $scope.objeto_parametros_pagos.id_formaPago = '0';
        if (rb_deposito.checked === true) {
            $scope.objeto_parametros_pagos.id_formaPago = '0';
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
        }
        $scope.objeto_parametros_pagos.id_factura_cab = id_facturaglobal;
        $scope.objeto_parametros_pagos.codRef = getCodUniq();

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por generar un Pago, verifique. Una vez enviado no hay marcha atras.',
            type: 'confirmationAlert'
        };

        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res === true) {

                $scope.loader_modal_ayuda = true;
                cancelacion_x_documentoServices.set_Generando_Cancelacion($scope.objeto_parametros_pagos)
                    .then(function (data) {
                        $scope.loader_modal_ayuda = false;
                        if (data === "OK") { 
                            $scope.actualizar_informacion();
                            $('#modalPagos').modal('hide');
                            $timeout(function () {
                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Pago realizado correctamente..!'
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



                    }, function (error) {
                        $timeout(function () {
                            let paramsErr = {
                                type: 'error',
                                title: 'Error !',
                                text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                            };
                            auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                            });
                            $scope.loader_modal = false;
                            console.log(err);
                        }, 500);
                    });
            }
        });
    };


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
        return 'CI_' + dataUser + '_' + codigoAle + '_' + hoy;
    }


    $scope.anulando_Pago = function (obj) {
        if (auxiliarServices.getAnularDoc() == 1) {
            if (parseInt(obj.estado) == 16 || parseInt(obj.estado) =='16') {
                return;
            }

            var params = {
                title: "Desea continuar ?",
                text: 'Esta por Anular el Pago.',
                type: 'confirmationAlert'
            };

            auxiliarServices.initSweetAlert(params).then(function (res) {
                if (res === true) {
                    $scope.loaderfiltros = true;
                    cancelacion_x_documentoServices.set_rechazar_Pago(obj.id_cancelacion_cab, obj.id_Factura_Cab, auxiliarServices.getUserId())
                        .then(function (data) {
                            $scope.loaderfiltros = false;
                            if (data === "OK") {
                                // cambiando de estado
                                var index = $scope.listadetalle_documentos.indexOf(obj);
                                $scope.listadetalle_documentos[index].id_estado = 16;
                                $scope.listadetalle_documentos[index].estado = 'Anulado';
 
                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Se rechazó el Pedido Correctamente. !'
                                };
                                auxiliarServices.initSweetAlert(params).then(function (res) {

                                });

                            } else {
                                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                                alert(data);
                            }
                        }, function (error) {
                            $scope.loaderfiltros = false;
                            console.log(error);
                        });
                }
            });
        } else {
            auxiliarServices.NotificationMessage('Sistemas', 'No tienes permiso para rechazar el Pago', 'error', '#ff6849', 2000);
        }

    };

    $scope.MostrarImagen = function (nro_ref) {
        $('#fotos').modal();
        cancelacion_x_documentoServices.get_Mostrando_imagenVoucher(nro_ref)
            .then(function (data) {
                $scope.loaderSave = false;
                pictures = $scope.pictures = [];
                for (var i = 0; i < data.length; i++) {
                    pictures.push({
                        url: data[i].url
                    });
                }

            }, function (err) {
                console.log(err);
            });
    };


})

