var app = angular.module('appGestion.CobranzaManualController', [])
app.controller('CtrlCobranzaManual', function ($scope, $location, $timeout, auxiliarServices, CobranzaReporteServices, CobranzaManualServices, PedidosServices, GrupoDetServices, TipoDocumentoServices) {
    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2); 
        auxiliarServices.changeTitle("REGISTRO DE COBRANZA MANUAL");
        $scope.titleModal = "Cobranza Manual";
        $scope.loaderSave = false;

        $timeout(function () {
            $('#cbo_anexo').val('0').trigger('change.select2');
            $('#cbo_zonaVenta').val('0').trigger('change.select2');
            $('#cbo_vendedor').val('0').trigger('change.select2');

            $('#m_anexo').val('0').trigger('change.select2');
            $('#m_zonaVenta').val('0').trigger('change.select2');
            $('#m_almacen').val('0').trigger('change.select2');

            $('#m_vendedor').val('0').trigger('change.select2');
            $('#m_puntoVenta').val('0').trigger('change.select2');
            $('#m_condicion').val('0').trigger('change.select2');
            $('#m_vehiculo').val('0').trigger('change.select2');
        })
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

    $scope.parametros_filtro = {
        idAnexo: '0',
        idZonaVentas: '0',
        idVendedor: '0',
        fechaIni: auxiliarServices.getDateNow(),
        fechaFin: auxiliarServices.getDateNow(),
        idUsuario: auxiliarServices.getUserId(),
    }

    $scope.objeto_parametros = {
        id_Factura_Cab: '',
        id_empresa: '',
        Numero_Documento: '',
        id_TipoDocumento: '',
        tipo_doc: '',
        id_PuntoVenta: '',
        id_FormaPago: '',
        diasVencimiento_Factura_Cab: '',
        tipoCambio_Factura_Cab: '',
        id_cuadrilla: '',
        id_PersonalVendedor: '',
        vendedor: '',
        fechaEmision_Factura_Cab: auxiliarServices.getDateNow(),
        id_cliente: '',
        doc_cliente: '',
        nombres_Cliente: '',
        direccion_Factura_Cab: '',
        fechaEntrega_Factura_Cab: '',
        porcentajeIGV_Factura_Cab: '',
        imprimeGuiaRemision_Factura_Cab: '',
        observaciones_Factura_Cab: '',
        Sub_Total_Factura_Cab: '',
        total_Igv_Factura_Cab: '',
        total_Neto_Factura_Cab: '',
        id_Pedido_Cab: '',
        id_Almacen: '',
        id_Guia_Cab: '',
        numero_Guia_Cab: '',
        total_pagos_Factura_Cab: '',
        total_NotaCredito_Factura_Cab: '',
        id_MotivoAnulacion: '',
        estado: '',
        fecha_edicion: '',
        codigoInterno_Cliente: '',
        codigoInterno_Suministro: '',
        factura_electronica_cdr: '',
        factura_electronica_xml: '',
        factura_electronica_pdf: '',
        factura_electronica_QR: '',
        afectoStock: '',
        flag_tipo_facturacion: '',
        nro_Serie: '',
        numero: '',
        id_Anexo: '0',
        id_Transportista: 0,
        id_ZonaVta: 0,
        zonaVenta: '',
        usuario_creacion: auxiliarServices.getUserId(),
        usuario_edicion: auxiliarServices.getUserId()
    }

    $scope.clean = function () {
        $scope.objeto_parametros.id_Factura_Cab = 0;
        $scope.objeto_parametros.id_empresa = 0;
        $scope.objeto_parametros.Numero_Documento = '';
        $scope.objeto_parametros.id_TipoDocumento = 0;
        $scope.objeto_parametros.tipo_doc = '';
        $scope.objeto_parametros.id_PuntoVenta = 0;
        $scope.objeto_parametros.id_FormaPago = 0;
        $scope.objeto_parametros.diasVencimiento_Factura_Cab = '';
        $scope.objeto_parametros.tipoCambio_Factura_Cab = '';
        $scope.objeto_parametros.id_cuadrilla = 0;
        $scope.objeto_parametros.id_PersonalVendedor = 0;
        $scope.objeto_parametros.vendedor = '';
        $scope.objeto_parametros.fechaEmision_Factura_Cab = auxiliarServices.getDateNow();
        $scope.objeto_parametros.id_cliente = 0;
        $scope.objeto_parametros.doc_cliente = '';
        $scope.objeto_parametros.nombres_Cliente = '';
        $scope.objeto_parametros.direccion_Factura_Cab = '';
        $scope.objeto_parametros.fechaEntrega_Factura_Cab = '';
        $scope.objeto_parametros.porcentajeIGV_Factura_Cab = '';
        $scope.objeto_parametros.imprimeGuiaRemision_Factura_Cab = '';
        $scope.objeto_parametros.observaciones_Factura_Cab = '';
        $scope.objeto_parametros.Sub_Total_Factura_Cab = '';
        $scope.objeto_parametros.total_Igv_Factura_Cab = '';
        $scope.objeto_parametros.total_Neto_Factura_Cab = '';
        $scope.objeto_parametros.id_Pedido_Cab = '';
        $scope.objeto_parametros.id_Almacen = '';
        $scope.objeto_parametros.id_Guia_Cab = '';
        $scope.objeto_parametros.numero_Guia_Cab = '';
        $scope.objeto_parametros.total_pagos_Factura_Cab = '';
        $scope.objeto_parametros.total_NotaCredito_Factura_Cab = '';
        $scope.objeto_parametros.id_MotivoAnulacion = '';
        $scope.objeto_parametros.estado = 1;
        $scope.objeto_parametros.fecha_edicion = '';
        $scope.objeto_parametros.codigoInterno_Cliente = '';
        $scope.objeto_parametros.codigoInterno_Suministro = '';
        $scope.objeto_parametros.factura_electronica_cdr = '';
        $scope.objeto_parametros.factura_electronica_xml = '';
        $scope.objeto_parametros.factura_electronica_pdf = '';
        $scope.objeto_parametros.factura_electronica_QR = '';
        $scope.objeto_parametros.afectoStock = '';
        $scope.objeto_parametros.flag_tipo_facturacion = '';
        $scope.objeto_parametros.nro_Serie = '';
        $scope.objeto_parametros.numero = '';
        $scope.objeto_parametros.id_Anexo = '0';
        $scope.objeto_parametros.id_Transportista = 0;
        $scope.objeto_parametros.id_ZonaVta = 0;
        $scope.objeto_parametros.zonaVenta = '';
        $scope.objeto_parametros.usuario_edicion = auxiliarServices.getUserId();

        $('.select_modal').val("0").trigger('change.select2');

        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';

        $timeout(function () {
            $('#m_anexo').val('0').trigger('change.select2');
            $('#m_zonaVenta').val('0').trigger('change.select2');
            $('#m_almacen').val('0').trigger('change.select2');

            $('#m_vendedor').val('0').trigger('change.select2');
            $('#m_puntoVenta').val('0').trigger('change.select2');
            $('#m_condicion').val('0').trigger('change.select2');
            $('#m_tipoDoc').val('0').trigger('change.select2');
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

    $scope.Open_New_Content = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
    }


    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;

        $scope.EdicionRegistros(obj);
        $('#modalMantenimiento').modal('show');

    }

    $scope.lista_anexos = [];
    $scope.getAnexos = function () {
        $scope.loaderFiltro = true;
        CobranzaReporteServices.get_anexo().then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {
                $scope.lista_anexos = [];
                $scope.lista_anexos = res.data;
                $timeout(function () {
                    $('#cbo_anexo').val('0').trigger('change.select2');
                    $('#m_anexo').val('0').trigger('change.select2');
                })
            } else {
                //auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
            }
        }, function (err) {
            $scope.loaderFiltro = false;
            console.log(err);
        });
    };
    $scope.getAnexos();

    $scope.lista_almacenes = [];
    $scope.getAlmacenes = function (id) {
        $scope.loaderFiltro = true;
        CobranzaManualServices.get_almacen(id).then(function (res) {
            $scope.loaderFiltro = false;
            console.log(res.data);
            if (res.ok == true) {
                $scope.lista_almacenes = [];
                $scope.lista_almacenes = res.data;
                $timeout(function () {
                    $('#m_almacen').val('0').trigger('change.select2');
                })
            } else {
                //auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
            }
        }, function (err) {
            $scope.loaderFiltro = false;
            console.log(err);
        });
    };


    $scope.lista_zonaVentas = [];
    $scope.getZonaVentas = function () {
        $scope.loaderFiltro = true;
        CobranzaReporteServices.get_zonaVentas().then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {
                $scope.lista_zonaVentas = [];
                $scope.lista_zonaVentas = res.data;
                $timeout(function () {
                    $('#cbo_zonaVenta').val('0').trigger('change.select2');
                    $('#m_zonaVenta').val('0').trigger('change.select2');
                })
            } else {
                //auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
            }
        }, function (err) {
            $scope.loaderFiltro = false;
            console.log(err);
        });
    };
    $scope.getZonaVentas();


    $scope.lista_vendedor = [];
    $scope.getVendedor = function () {
        $scope.loaderFiltro = true;
        CobranzaReporteServices.get_vendedor().then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {
                $scope.lista_vendedor = [];
                $scope.lista_vendedor = res.data;
                $timeout(function () {
                    $('#cbo_vendedor').val('0').trigger('change.select2');
                    $('#m_vendedor').val('0').trigger('change.select2');
                })
            } else {
                //auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
            }
        }, function (err) {
            $scope.loaderFiltro = false;
            console.log(err);
        });
    };
    $scope.getVendedor();

    $scope.lista_puntoVenta = [];
    $scope.getPuntoVenta = function () {
        $scope.loaderFiltro = true;
        CobranzaManualServices.get_puntoVenta().then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {
                $scope.lista_puntoVenta = [];
                $scope.lista_puntoVenta = res.data;
                $timeout(function () {
                    $('#cbo_puntoVenta').val('0').trigger('change.select2');
                })
            } else {
                //auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
            }
        }, function (err) {
            $scope.loaderFiltro = false;
            console.log(err);
        });
    };
    $scope.getPuntoVenta();


    $scope.Lista_CondicionFact = [];
    $scope.Listando_CondicionFacturacion = function () {
        $scope.loaderFiltro = true;
        GrupoDetServices.getGrupoTabla_Det(5)
            .then(function (data) {
                $scope.loaderFiltro = false;
                $scope.Lista_CondicionFact = [];
                $scope.Lista_CondicionFact = data;

                $scope.Listando_TipoDocumento();
            }, function (err) {
                    $scope.loaderFiltro = false;
                console.log(err);
            });
    };
    $scope.Listando_CondicionFacturacion();

    $scope.Lista_TipoDoc = [];
    $scope.Listando_TipoDocumento = function () {
        $scope.loaderFiltro = true;
        TipoDocumentoServices.getTipoDocumento(0)
            .then(function (data) {
                $scope.loaderFiltro = false;
                $scope.Lista_TipoDoc = [];

                for (var i = 0; i < data.length; i++) {
                    if (data[i].id_TipoDocumento == 1 || data[i].id_TipoDocumento == 2) {
                        console.log(data[i].id_TipoDocumento);
                        $scope.Lista_TipoDoc.push(data[i]);
                    }
                }
            }, function (err) {
                    $scope.loaderFiltro = false;
                console.log(err);
            });
    };


    $scope.loader = false;
    var oTable;

    $scope.lista_cobranza = [];
    $scope.getCobranzaManual = function () {
        $scope.loader = true;
        CobranzaManualServices.get_cobranza($scope.parametros_filtro).then(function (res) {
            $scope.loader = false;
            if (res.ok == true) {
                console.log(res.data);
                $scope.lista_cobranza = [];
                $scope.lista_cobranza = res.data;

                $timeout(function () {
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('tbl_cobranzaManual', 'inputSearch');
                    } else {
                        $('#tbl_cobranzaManual').trigger('footable_initialize');
                    }
                }, 500);
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
            }
        }, function (err) {
                $scope.loader = false;
        });
    };


    $scope.loader_modal = false;
    $scope.Buscar_Cliente = function () {
        $scope.objeto_parametros.codigoInterno_Suministro = '';
        $scope.objeto_parametros.nombres_Cliente = '';
        $scope.objeto_parametros.codigoInterno_Cliente = '';
        $scope.objeto_parametros.direccion_Factura_Cab = '';
        if ($scope.objeto_parametros.doc_cliente == '' || $scope.objeto_parametros.doc_cliente == null || $scope.objeto_parametros.doc_cliente == undefined) {
            return;
        }

        $scope.loader_modal = true;
        PedidosServices.get_Search_Cliente($scope.objeto_parametros.doc_cliente)
            .then(function (data) {
                $scope.loader_modal = false;
                var indicador = false;
                for (var i = 0; i < data.length; i++) {
                    indicador = true;
                    break;
                }
                if (indicador === false) {
                    $timeout(function () {
                        $scope.objeto_parametros.id_PersonalVendedor = '0';
                        $('#m_vendedor').val('0').trigger('change.select2');
                    }, 200);
                    return;
                } else {
                    $scope.objeto_parametros.codigoInterno_Suministro = data[0].codigoInterno_Cliente;
                    $scope.objeto_parametros.nombres_Cliente = data[0].nombres_Cliente + '  -  ' + data[0].direccion_referencia;
                    $scope.objeto_parametros.codigoInterno_Cliente = data[0].codigoInterno_Cliente;
                    $scope.objeto_parametros.direccion_Pedido_Cab = data[0].direccion_referencia;
                    $scope.objeto_parametros.id_PersonalVendedor = String(data[0].id_PersonalVendedor);
                    $timeout(function () {
                        $('#m_vendedor').val(String(data[0].id_PersonalVendedor)).trigger('change.select2');
                    }, 200);
                }
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Agregar_Cliente = function (obj) {

        $scope.objeto_parametros.id_cliente = obj.id_cliente;
        $scope.objeto_parametros.codigoInterno_Suministro = obj.codigoInterno_Cliente;
        $scope.objeto_parametros.doc_cliente = obj.nroDoc_Cliente;
        $scope.objeto_parametros.nombres_Cliente = obj.nombres_Cliente + '  -  ' + obj.direccion_referencia;
        $scope.objeto_parametros.codigoInterno_Cliente = obj.codigoInterno_Cliente;
        $scope.objeto_parametros.direccion_Pedido_Cab = obj.direccion_referencia;

        $scope.objeto_parametros.id_PersonalVendedor = obj.id_PersonalVendedor;
        $timeout(function () {
            $('#m_vendedor').val(String(obj.id_PersonalVendedor)).trigger('change.select2');
        }, 200);

        $('#modalAyuda_Cliente').modal('hide');
    };

    $scope.EdicionRegistros = function (obj) {
        $scope.loaderProd = true;
        $scope.Flag_modoEdicion = true;

        $scope.objeto_parametros.id_Factura_Cab = obj.id_Factura_Cab;
        $scope.objeto_parametros.id_empresa = obj.id_empresa;
        $scope.objeto_parametros.Numero_Documento = obj.Numero_Documento;
        $scope.objeto_parametros.id_TipoDocumento = obj.id_TipoDocumento;
        $scope.objeto_parametros.tipo_doc = obj.tipo_doc;
        $scope.objeto_parametros.id_PuntoVenta = obj.id_PuntoVenta;
        $scope.objeto_parametros.id_FormaPago = obj.id_FormaPago;
        $scope.objeto_parametros.diasVencimiento_Factura_Cab = obj.diasVencimiento_Factura_Cab;
        $scope.objeto_parametros.tipoCambio_Factura_Cab = obj.tipoCambio_Factura_Cab;
        $scope.objeto_parametros.id_cuadrilla = obj.id_cuadrilla;
        $scope.objeto_parametros.id_PersonalVendedor = obj.id_PersonalVendedor;
        $scope.objeto_parametros.vendedor = obj.vendedor;
        $scope.objeto_parametros.fechaEmision_Factura_Cab = obj.fechaEmision_Factura_Cab;
        $scope.objeto_parametros.id_cliente = obj.id_cliente;
        $scope.objeto_parametros.doc_cliente = obj.doc_cliente;
        $scope.objeto_parametros.nombres_Cliente = obj.nombres_Cliente;
        $scope.objeto_parametros.direccion_Factura_Cab = obj.direccion_Factura_Cab;
        $scope.objeto_parametros.fechaEntrega_Factura_Cab = obj.fechaEntrega_Factura_Cab;
        $scope.objeto_parametros.porcentajeIGV_Factura_Cab = obj.porcentajeIGV_Factura_Cab;
        $scope.objeto_parametros.imprimeGuiaRemision_Factura_Cab = obj.imprimeGuiaRemision_Factura_Cab;
        $scope.objeto_parametros.observaciones_Factura_Cab = obj.observaciones_Factura_Cab;
        $scope.objeto_parametros.Sub_Total_Factura_Cab = obj.Sub_Total_Factura_Cab;
        $scope.objeto_parametros.total_Igv_Factura_Cab = obj.total_Igv_Factura_Cab;
        $scope.objeto_parametros.total_Neto_Factura_Cab = obj.total_Neto_Factura_Cab;
        $scope.objeto_parametros.id_Pedido_Cab = obj.id_Pedido_Cab;
        $scope.objeto_parametros.id_Almacen = obj.id_Almacen;
        $scope.objeto_parametros.id_Guia_Cab = obj.id_Guia_Cab;
        $scope.objeto_parametros.numero_Guia_Cab = obj.numero_Guia_Cab;
        $scope.objeto_parametros.total_pagos_Factura_Cab = obj.total_pagos_Factura_Cab;
        $scope.objeto_parametros.total_NotaCredito_Factura_Cab = obj.total_NotaCredito_Factura_Cab;
        $scope.objeto_parametros.id_MotivoAnulacion = obj.id_MotivoAnulacion;
        $scope.objeto_parametros.estado = obj.estado;
        $scope.objeto_parametros.fecha_edicion = obj.fecha_edicion;
        $scope.objeto_parametros.codigoInterno_Cliente = obj.codigoInterno_Cliente;
        $scope.objeto_parametros.codigoInterno_Suministro = obj.codigoInterno_Suministro;
        $scope.objeto_parametros.factura_electronica_cdr = obj.factura_electronica_cdr;
        $scope.objeto_parametros.factura_electronica_xml = obj.factura_electronica_xml;
        $scope.objeto_parametros.factura_electronica_pdf = obj.factura_electronica_pdf;
        $scope.objeto_parametros.factura_electronica_QR = obj.factura_electronica_QR;
        $scope.objeto_parametros.afectoStock = obj.afectoStock;
        $scope.objeto_parametros.flag_tipo_facturacion = obj.flag_tipo_facturacion;
        $scope.objeto_parametros.nro_Serie = obj.nro_Serie;
        $scope.objeto_parametros.numero = obj.numero;
        $scope.objeto_parametros.id_Anexo = obj.id_Anexo;
        $scope.objeto_parametros.id_Transportista = obj.id_Transportista;
        $scope.objeto_parametros.id_ZonaVta = obj.id_ZonaVta;
        $scope.objeto_parametros.zonaVenta = obj.zonaVenta;
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

        $timeout(function () {
            chk_exonerada.checked = false;

            $('#m_anexo').val(obj.id_Anexo).trigger('change.select2');
            $('#m_zonaVenta').val(obj.id_ZonaVta).trigger('change.select2');
            $('#m_almacen').val(obj.id_Almacen).trigger('change.select2');

            $('#m_vendedor').val(obj.id_PersonalVendedor).trigger('change.select2');
            $('#m_puntoVenta').val(obj.id_PuntoVenta).trigger('change.select2');
            $('#m_condicion').val(obj.id_FormaPago).trigger('change.select2');
            $('#m_tipoDoc').val(obj.id_TipoDocumento).trigger('change.select2');
        }, 200);
    }


    $scope.Open_New_Modal_AyudaCliente = function () {

        $('#searchStr').val('');
        $scope.Lista_Busqueda_Cliente = [];
        $scope.Ayuda_BuscarCliente();
        $('#modalAyuda_Cliente').modal('show');
        $timeout(function () {
            $('#searchStr').focus().select();
        }, 500);
    };
    $scope.loaderSearch = false;

    $scope.searchStr = '';
    $scope.$watch('searchStr', function (tmpStr) {
        if (!tmpStr || tmpStr.length == 0)
            return 0;
        $timeout(function () {

            // if searchStr is still the same..
            // go ahead and retrieve the data
            if (tmpStr === $scope.searchStr) {
                $scope.loaderSearch = true;
                PedidosServices.get_Ayuda_Buscar_Cliente(tmpStr)
                    .then(function (data) {
                        $scope.loaderSearch = false;
                        $scope.Lista_Busqueda_Cliente = [];
                        $scope.Lista_Busqueda_Cliente = data;
                    }, function (err) {
                         $scope.loaderSearch = false;
                         console.log(err);
                    });
            }
        }, 700);
    });

    $scope.loader_modal_ayuda = false;
    $scope.Lista_Busqueda_Cliente = [];
    $scope.Ayuda_BuscarCliente = function () {
        var searchStr = document.getElementById('searchStr').value;

        $scope.loader_modal_ayuda = true;
        PedidosServices.get_Ayuda_Buscar_Cliente(searchStr)
            .then(function (data) {
                $scope.loader_modal_ayuda = false;

                $scope.Lista_Busqueda_Cliente = [];
                $scope.Lista_Busqueda_Cliente = data;

            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };


    $scope.GuardarRegistro = function () {
        if (CobranzaManualServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }

        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            $scope.loaderSave = true;
            CobranzaManualServices.add_cobranza($scope.objeto_parametros)
                .then(function (data) {
                    $scope.ListaZonasVentas.push(data);
                    $scope.getZonasVentas();
                    $timeout(function () {
                        $('#modalMantenimiento').modal('hide');
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Registro realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {

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
                            $('#modalMantenimiento').modal('hide');
                        });
                        $scope.loaderSave = false;
                        console.log(err);
                    }, 500)
                })

        } else {  //actualizar

            $scope.loaderSave = true;
            CobranzaManualServices.update_cobranza($scope.objeto_parametros)
                .then(function (data) {
                    if (data == "OK") {
                        $scope.ListaZonasVentas.push(data);
                        $scope.searchZonasVentas();
                        $timeout(function () {
                            $('#modalMantenimiento').modal('hide');
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Actualizacion realizado correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params)
                                .then(function (res) {
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
                                $('#modalMantenimiento').modal('hide');
                            });
                            $scope.loaderSave = false;
                        }, 500)
                    }
                }, function (error) {
                    console.log(error);
                })

        }
    }

    $scope.enterFocus = function (type, name) {
        if (type === 1) {
            $('#' + name + '').focus();
            $('#' + name + '').select();

        } else if (type === 2) {
            $('#' + name + '').select2('open');
        }
    };


    $scope.getAnular = function (item) {

        if (item.estado == 0 || item.estado == '0') {
            return;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por anular Cobranza Manual',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                CobranzaManualServices.anular_cobranza(item.id_Factura_Cab)
                    .then(function (res) {
                        var index = $scope.lista_cobranza.indexOf(item);
                        $scope.lista_cobranza[index].estado = 0;
                    })
            }
        });
    }



})

 