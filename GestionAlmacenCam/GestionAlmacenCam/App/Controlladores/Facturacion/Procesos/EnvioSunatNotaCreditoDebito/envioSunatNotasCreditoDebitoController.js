var app = angular.module('appGestion.envioSunatNotasCreditoDebitoController', [])

app.controller('envioSunatNotasCreditoDebitoController', function ($scope, $q, loginServices, $location, $timeout, auxiliarServices, RevisionPedidoServices, Reenvio_DocumentosServices, AlmacenServices, LocalesServices, EstadosServices, TipoDocumentoServices, PuntoVentaServices, Documentos_MasivosServices, DocumentoVentaServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        auxiliarServices.changeTitle("ENVIO SUNAT ( Notas de Crédito - Notas Débito ) ");
        $scope.titleModal = "Envio Sunat de Documentos Electronicos";
        $scope.disabledContent = "";
        $scope.loaderSave = false;
        $scope.get_Listando_Locales();
 
 
    }

    $('document').ready(function () {
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy',
            });
            $(".selectFiltros").select2();
        }, 100);

        $("#id_alertas").hide(500);
    });

    $scope.enterFocus = function (type, name) {
        if (type === 1) {
            $('#' + name + '').focus();
            $('#' + name + '').select();

        } else if (type === 2) {
            $('#' + name + '').select2('open');
        }
    };

    $scope.Lista_Estados = [];
    $scope.get_ListandoEstados = function () {
        $scope.loaderSave = true;
        EstadosServices.getEstados().then(function (data) {
            $scope.loaderSave = false;
            var listE = [];
            data.forEach(function (item, index) {
                if (item.id_Estado == 7 || item.id_Estado == 8) {
                    listE.push(item);
                }
            })
            $scope.Lista_Estados = [];
            $scope.Lista_Estados = listE;

            setTimeout(function () {
                //$(".selectFiltros").select2();
                $('#cbo_puntoventa').val("0").trigger('change.select2');
                $('#cbo_vendedor').val("0").trigger('change.select2');
                $('#cbo_docVenta').val("0").trigger('change.select2');
                $('#cbo_estado').val("0").trigger('change.select2');
                $('#cbo_placa').val("0").trigger('change.select2');
            }, 500);


        }, function (err) {
            console.log(err);
        })
    }

    //------- error de enviar documentos electronicos ---

    $scope.Lista_Local = [];
    $scope.get_Listando_Locales = function () {
        $scope.loader_modal = true;
        Documentos_MasivosServices.get_zonasUsuario(auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loader_modal = false;
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
                $scope.loader_modal = false;
                console.log(err);
            });
    };

    $scope.Lista_Almacen = [];
    $scope.change_Local_Almacen = function (idlocal) {
        $scope.loader_modal = true;
        AlmacenServices.get_ListadoAlmacenes_Local_Usuario(idlocal, auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loader_modal = false;
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
                $scope.loader_modal = false;
                console.log(err);
            });
    };

    $scope.lista_anexos = [];
    $scope.change_almacen_anexo = function (idAlmacen) {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_Anexos_Almacen(idAlmacen).then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {
                $scope.lista_anexos = [];
                $scope.lista_anexos = res.data;
                $timeout(function () {
                    $('#cbo_anexo').val('0').trigger('change.select2');
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
 
    $scope.Objeto_ParametroFiltro = {
        id_local: '0',
        id_almacen: '0',
        id_Anexos: '0',
        usuario: auxiliarServices.getUserId(),
    }
 
    $scope.listadetalle_documentos = [];
    $scope.listando_documentosNotasCreditoDebito = function () {

        //if ($scope.Objeto_ParametroFiltro.id_local == '0' || $scope.Objeto_ParametroFiltro.id_local == 0) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la zona', 'error', '#ff6849', 1500);
        //    return;
        //}
 
        $scope.loader_modal = true;
        $scope.listando_documentos_erroneos = '';
        $scope.checkedAll = false;
        document.getElementById("form_detalle").style.display = "none";
        Reenvio_DocumentosServices.get_documentosNotasCreditoDebito($scope.Objeto_ParametroFiltro)
            .then(function (data) {

                if (data.length > 0) {
                    $('#btn_cancelar').attr("disabled", false);
                } else {
                    $('#btn_cancelar').attr("disabled", true);
                    document.getElementById("form_detalle").style.display = "none";
                }

                $scope.listadetalle_documentos = data;
                $timeout(function () {
                    $scope.loader_modal = false;
                    $("#tbl_detalle").tableHeadFixer({ "left": 4 });
                    document.getElementById("form_detalle").style.display = "";
                }, 500);

            }, function (error) {
                $scope.loader_modal = false;
                console.log(error);
            })
    }
 
    $scope.NombreTipoDocumento = '...'
 
    function MarcoCheck() {
        var flag_marco = false;
        for (obj_datos of $scope.listadetalle_documentos) {
            if (obj_datos.checkeado == true) {
                flag_marco = true;
                break;
            }
        }
        return flag_marco;
    }
 

    // METODO PARA CHEKED ALL
    $scope.checkedAll = false;
    $scope.checkedAll_doc = function (checked) {
        if (checked) {
            angular.forEach($scope.listadetalle_documentos, function (child) {
                child.checkeado = true;
            })
        } else {
            angular.forEach($scope.listadetalle_documentos, function (child) {
                child.checkeado = false;
            })
        }
    }
 
    ////------------------------------------------------------------
    ////---- NUEVA VERSION DE FACTURACION ELECTRONICA CON NUBE-FACT
    ////-----------------------------------------------------------/////
 
    $scope.generando_reenvio_Documentos_new = function () {
        if ($scope.listadetalle_documentos == null || $scope.listadetalle_documentos.length == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'No hay Documentos para Generar..', 'error', '#ff6849', 1500);
            return;
        }

        flag_marco = MarcoCheck();
        if (flag_marco == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione al menos un registro', 'error', '#ff6849', 1500);
            return;
        }

        var lista_documentos_Renviar = [];

        for (obj of $scope.listadetalle_documentos) {
            if (obj.checkeado == true) {
                lista_documentos_Renviar.push(obj)
            }
        }


        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Enviar los Documentos nuevamente a la sunat, este proceso puede demorar un poco..',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {

                var CantDocumentosGlobal = lista_documentos_Renviar.length;
                var id_tipoDoc = 0;
                $('#btn_cancelar').attr("disabled", true);

                $("#id_alertas").show(100);

                var GenerarDocumentosVentas = function (index) {
                    if (CantDocumentosGlobal == index) {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso de Registro realizado correctamente !'
                        };
                        auxiliarServices.initSweetAlert(params).then(function (res) {

                        });
                        $scope.NombreTipoDocumento = '';
                        $scope.loader_modal = false;
                        $("#id_alertas").hide(1000);
                        $scope.listando_documentosNotasCreditoDebito();
                        return;
                    }

                    id_tipoDoc = lista_documentos_Renviar[index].id_TipoDocumento;
                    $scope.NombreTipoDocumento = 'Enviando a la sunat el Nro. Doc :' + lista_documentos_Renviar[index].Numero_Documento;
                    $scope.loader_modal = true; 
                    Documentos_MasivosServices.generarFacturacion_notasCreditoDebito(lista_documentos_Renviar[index].id_TipoDocumento, lista_documentos_Renviar[index].Numero_Documento, lista_documentos_Renviar[index].id_Factura_Cab_Referencia)
                        .then(function (res) {
                            $scope.loader_modal = false;
                            if (res.ok) {

                            } else {
                                auxiliarServices.NotificationMessage('Sistemas', res.data, 'error', '#ff6849', 3000);
                                $scope.NombreTipoDocumento = 'Error al Enviar el Nro. Doc ' + lista_documentos_Renviar[index].Numero_Documento;
                            }

                            GenerarDocumentosVentas((index + 1));
                        }, function (error) {
                            console.log('error');
                            console.log(error)
                            $scope.loader_modal = false;
                            auxiliarServices.NotificationMessage('Sistemas', 'Se produjo un error al Enviar a la Sunat el Nro. Doc : ' + $scope.Numero_Documento, 'error', '#ff6849', 3000);
                            $scope.NombreTipoDocumento = 'Error al Enviar el Nro. Doc :' + lista_documentos_Renviar[index].Numero_Documento;
                            GenerarDocumentosVentas(index + 1);
                        })
               
                }

                GenerarDocumentosVentas(0);
            }
        });

    }




    ////--------------------------------------------------------------------
    ////---- FIN DE NUEVA VERSION DE FACTURACION ELECTRONICA CON NUBE-FACT
    ////----------------------------------------------------------------/////





})