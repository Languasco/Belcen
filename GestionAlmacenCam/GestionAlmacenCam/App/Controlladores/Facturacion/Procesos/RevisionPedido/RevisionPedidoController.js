var app = angular.module('appGestion.RevisionPedidoController', [])

app.controller('CtrlRevisionPedido', function ($scope, $location, $timeout, auxiliarServices, Documentos_MasivosServices, PedidosServices, NotaCreditoDebitoServices, VehiculoServices , TipoDocumentoServices, AlmacenServices, PersonalServices, RevisionPedidoServices, GrupoDetServices) {
    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;
 
        auxiliarServices.changeTitle("Revisión de Pedidos");
        $scope.titleModal = "Registro de Promociones";
        $scope.disabledContent = "";
        $scope.loaderSave = false;

        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy'
            });
        }, 0);

        setTimeout(function () {
            $(".selectFiltros").select2();
            $(".selectModal").select2();
        }, 100);
    }

    //----- variables Globales
     
    $scope.idPromocion_Global = 0;

    $scope.Flag_modoEdicion_Config = false;
    $scope.idConfiguracion_Global = 0;

    $scope.Flag_modoEdicion_Canasta = false;
    $scope.idCanasta_Global = 0;

    $scope.flagFueraRuta = 0;
    $scope.checkedAll = false;
       
    $scope.Objeto_ParametroFiltro = {
        id_ZonaVta: '0',
        id_almacen: '0',
        id_vendedor: '0',
        id_Anexos: '0',
        id_transportista: '0',
        id_estado: '8',
        fechaIni: auxiliarServices.formatDateNow(),
        fechaFin: auxiliarServices.formatDateNow(),

        nroPedido: '0',
        valorBruto: '0',
        totalIGV: '0',
        totalNeto: '0',
    }

    $scope.objeto_parametros = {
        id_Pedido_Cab: '0',
        id_empresa: '0',
        id_Local: '0',
        Numero_Pedido: '',
        id_cliente: '0',
        codigoInterno_Suministro: '',
        nrodoc_cliente: '',
        nombres_Cliente: '',
        id_Almacen: '0',
        id_TipoDocumento: '0',
        id_PuntoVenta: '1',
        id_CanalNegocio: '0',
        id_cuadrilla: '1',
        id_PersonalVendedor: '0',
        id_FormaPago: '0',
        id_moneda: '1',
        fechaEmision_Pedido_Cab: '',
        tipoCambio_Pedido_Cab: '',
        codigoInterno_Cliente: '',
        direccion_Pedido_Cab: '',
        fechaEntrega_Pedido_Cab: '',
        porcentajeIGV_Pedido_Cab: '',
        imprimeGuiaRemision_Pedido_Cab: '',
        observaciones_Pedido_Cab: '',
        estado: '6',
        Sub_Total_Pedido_Cab: '',
        total_Igv_Pedido_Cab: '',
        total_Neto_Pedido_Cab: '',
        Numero_Documento: '',
        serie: '',
        num_doc: '',
        fechaFactura_Pedido_Cab: '',
        usuario_creacion: '0',
        TipoGuiaRemision: '0',
        flag_exonerada_igv: '',
        flag_tipo_facturacion: '1',
    };
 
    
    $scope.estados = [];
    $scope.listadoEstados = function () {
        $scope.loader = true;
        RevisionPedidoServices.get_estados()
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.estados = [];
                    $scope.estados = res.data;

                    setTimeout(function () {
                        $('#cboEstado').val("8").trigger('change.select2');
                    }, 100);

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            })
    }
    $scope.listadoEstados();
 
 
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

        
    var oTableCab;
    $scope.revisionPedidosCab = [];
    $scope.listandoRevisionesPedidoCab = function (flagFueraRuta) {

        $scope.flagFueraRuta = flagFueraRuta;

        if ($scope.Objeto_ParametroFiltro.id_ZonaVta == '0' || $scope.Objeto_ParametroFiltro.id_ZonaVta == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor selecciona la Zona', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_ParametroFiltro.id_almacen == '0' || $scope.Objeto_ParametroFiltro.id_almacen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacen', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_ParametroFiltro.id_Anexos == '0' || $scope.Objeto_ParametroFiltro.id_Anexos == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Anexo', 'error', '#ff6849', 1500);
            return false;
        }
         
        const fechaIni = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fechaIni);
        const fechaFin = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fechaFin);

        $scope.loaderFiltro = true;
        $scope.checkedAll = false;

        RevisionPedidoServices.get_revisionPedidosCab($scope.Objeto_ParametroFiltro.id_ZonaVta, $scope.Objeto_ParametroFiltro.id_almacen, $scope.Objeto_ParametroFiltro.id_vendedor, $scope.Objeto_ParametroFiltro.id_Anexos, fechaIni, fechaFin, $scope.Objeto_ParametroFiltro.id_transportista, $scope.Objeto_ParametroFiltro.id_estado, flagFueraRuta)
            .then(function (res) {
                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    $scope.revisionPedidosCab = [];
                    $scope.revisionPedidosCab = res.data;

                    $scope.calculoTotales();
                    $timeout(function () {
                        $scope.loader = false;
                        if (oTableCab == null) {
                            oTableCab = 'data'
                            auxiliarServices.initFooTable('tablaRevisiones', '');
                        } else {
                            $('#tablaRevisiones').trigger('footable_initialize');
                        }
                    }, 500)
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                    $scope.loaderFiltro = false;
                console.log(error)
            })
    }
    
    $scope.calculoTotales = function () {

        let nroPedido = 0;
        let valorBruto = 0;
        let totalIGV = 0;
        let totalNeto = 0;

        for (var i = 0; i < $scope.revisionPedidosCab.length; i++) {
            valorBruto += parseFloat($scope.revisionPedidosCab[i].valorBruto);
            totalIGV += parseFloat($scope.revisionPedidosCab[i].igv);
            totalNeto += parseFloat($scope.revisionPedidosCab[i].importeNeto);
        }

        $scope.Objeto_ParametroFiltro.nroPedido = $scope.revisionPedidosCab.length;

        $scope.Objeto_ParametroFiltro.valorBruto = valorBruto.toFixed(2);
        $scope.Objeto_ParametroFiltro.totalIGV = totalIGV.toFixed(2);
        $scope.Objeto_ParametroFiltro.totalNeto = totalNeto.toFixed(2);

    }
    
    $scope.aprobarPedidos = function () {
        var listPedidos = [];
        var flag_marco_user = false;

        flag_marco_user = MarcoCheck();
        if (flag_marco_user == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor marque al menos un Item', 'error', '#ff6849', 1500);
            return;
        }
        listPedidos = ListaMarcoCheck();    
        var params = {
            title: "Desea continuar ?",
            text: 'Enviar a Aprobar',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
         $scope.loaderFiltro = true;
        RevisionPedidoServices.get_aprobarRevisionPedidos(listPedidos, auxiliarServices.getUserId()).then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {

                $scope.listandoRevisionesPedidoCab($scope.flagFueraRuta);
                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {

                    });
                }, 500)
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

    function MarcoCheck() {
        var flag_marco = false;
        for (var i = 0; i < $scope.revisionPedidosCab.length; i++) {
            if ($scope.revisionPedidosCab[i].checkeado == true) {
                flag_marco = true;
                break;
            }
        }
        return flag_marco;
    }
    
    function ListaMarcoCheck() {
        var List_id = [];
        for (var i = 0; i < $scope.revisionPedidosCab.length; i++) {
            if ($scope.revisionPedidosCab[i].checkeado == true) {
                List_id.push($scope.revisionPedidosCab[i].id_Pedido_Cab)
            }

        }
        return List_id;
    }

    // METODO PARA CHEKED ALL
    $scope.checkedAll = false;
    $scope.marcarTodos = function (checked) {
        if (checked) {
            angular.forEach($scope.revisionPedidosCab, function (child) {
                child.checkeado = true;
            })
        } else {
            angular.forEach($scope.revisionPedidosCab, function (child) {
                child.checkeado = false;
            })
        }
    }
       
    $scope.reporteDespacho = function () {
        var listPedidos = [];
        var flag_marco_user = false;

        flag_marco_user = MarcoCheck();
        if (flag_marco_user == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor marque al menos un Item', 'error', '#ff6849', 1500);
            return;
        }
        listPedidos = ListaMarcoCheck();


        const fechaIni = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fechaIni);
        const fechaFin = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fechaFin);

        var params = {
            title: "Desea continuar ?",
            text: 'Generar Despacho PDF',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderFiltro = true;
                RevisionPedidoServices.get_generarDespacho_pdf(listPedidos, fechaIni, fechaFin, auxiliarServices.getUserId()).then(function (res) {
                    $scope.loaderFiltro = false;

                    console.log(res);
                    if (res.ok == true) {
                        $scope.generarPDF_despacho(res.data.cabecera, fechaIni, fechaFin, res.data.resumen );
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

    $scope.generarPDF_despacho = function (pedidos, fechaIni, fechaFin, resumenPedidos) {

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

            doc.setFontSize(11);
            doc.setFont("courier");
            doc.setFontType("bold");
            doc.text(20, altura, pedidos[0].tituloReporte);
            altura = altura + 6;
            doc.setFontType("normal");
            doc.setFontType("bold");
            doc.setFontSize(8);
            doc.text(60, altura, 'Fecha Emision desde ' + fechaIni + ' hasta ' + fechaFin);
            altura = altura + 6;
            //------- fin de cabecera del pdf -----


            //------- cabecera del detalle del pdf -----

            doc.line(6, altura + 1.5, 205, altura + 1.5) // horizontal line
            altura = altura + 6;

            doc.text(8, altura, 'CÓDIGO'); doc.text(28, altura, 'DESCRIPCIÓN DE ARTÍCULO'); doc.text(115, altura, 'CANT.VENTA'); doc.text(138, altura, 'CANT.EQUIVALENTE'); doc.text(172, altura, 'IMPORTE'); doc.text(190, altura, 'PESO TOTAL');
            altura = altura + 2;
            doc.line(6, altura + 1.5, 207, altura + 1.5) // horizontal line
            altura = altura + 4;

            doc.setFontType("normal");
            doc.setFontSize(7.5);
        }

        const cabeceraReporteResumen = (nroPag) => {
            //------- cabecera del pdf -----
            doc.setFontSize(7.5);
            doc.text(8, 9, pedidos[0].empresa);
            doc.text(8, 12, pedidos[0].sede);


            doc.text(192, 7, auxiliarServices.getDateNow());
            doc.text(192, 10, auxiliarServices.getHourNow());
            doc.text(192, 13, String('Pag. ' + nroPag));

            doc.setFontSize(11);
            doc.setFont("courier");
            doc.setFontType("bold");
            doc.text(20, altura, pedidos[0].tituloReporte);
            altura = altura + 6;
            doc.setFontType("normal");
            doc.setFontType("bold");
            doc.setFontSize(8);
            doc.text(60, altura, 'Fecha Emision desde ' + fechaIni + ' hasta ' + fechaFin);
            altura = altura + 6;
            //------- fin de cabecera del pdf -----
            doc.setFontType("normal");
            doc.setFontSize(7.5);
        }
        
        cabeceraReporte(nroPag);

        let idTransportista = 0
        let splitTitle = '';
        let espacio = 0;

        let totalRegistro = 0;
        let totalImporte = 0;
        let totalPeso = 0;

        let totalDetventa = 0;
        let totalDetMonto = 0;
        let totalDetNroDoc = 0;
        let totalDetClientes = 0;
        let totalDetCartera = 0;

        //-----  calculo de totales 
        totalRegistro = pedidos.length; 
        pedidos.forEach(pedido => {
            totalImporte += (!pedido.importe) ? 0 : parseFloat(pedido.importe);
            totalPeso += (!pedido.pesoTotal) ? 0 : parseFloat(pedido.pesoTotal);
        })

        //-----  calculo de totales  resumen ---
        resumenPedidos.forEach(pedido => {
            totalDetventa += (!pedido.valorVenta) ? 0 : parseFloat(pedido.valorVenta);
            totalDetMonto += (!pedido.monto) ? 0 : parseFloat(pedido.monto);
            totalDetNroDoc += (!pedido.nroDoc) ? 0 : parseFloat(pedido.nroDoc);
            totalDetClientes += (!pedido.nroClientes) ? 0 : parseFloat(pedido.nroClientes);
            totalDetCartera += (!pedido.cartera) ? 0 : parseFloat(pedido.cartera);
        })

        const resumenReporte = () => {
            doc.setFontType("bold");
            doc.text(8, altura, 'TRANSPORTISTA'); doc.text(50, altura, 'VENDEDOR'); doc.text(105, altura, 'VALOR VTA'); doc.text(130, altura, 'MONTO'); doc.text(150, altura, 'NRO DOC'); doc.text(165, altura, 'NRO CLIENTES'); doc.text(190, altura, 'CARTERA');
            altura = altura + 6; 
            doc.setFontType("normal");

            for (var i = 0; i < resumenPedidos.length; i++) {
                doc.text(6, altura, resumenPedidos[i].transportista);
                doc.text(40, altura, resumenPedidos[i].descripcionVendedor);
                doc.writeText(110, altura, auxiliarServices.formatearNumero(resumenPedidos[i].valorVenta, 2), { align: 'right', width: 8 });
                doc.writeText(130, altura, auxiliarServices.formatearNumero(resumenPedidos[i].monto, 2), { align: 'right', width: 8 });
                doc.writeText(155, altura, auxiliarServices.formatearNumero(resumenPedidos[i].nroDoc, 2), { align: 'right', width: 4 });
                doc.writeText(180, altura, auxiliarServices.formatearNumero(resumenPedidos[i].nroClientes, 2), { align: 'right', width: 4 });
                doc.writeText(200, altura, auxiliarServices.formatearNumero(resumenPedidos[i].cartera, 2), { align: 'right', width: 4 });
                altura = altura + 6;
            }

            doc.line(6, altura, 205, altura + 1.5) // horizontal line
            doc.setFontType("bold");
            altura = altura + 6;
            doc.writeText(110, altura, auxiliarServices.formatearNumero(totalDetventa, 2), { align: 'right', width: 8 });
            doc.writeText(130, altura, auxiliarServices.formatearNumero(totalDetMonto, 2), { align: 'right', width: 8 });
            doc.writeText(155, altura, auxiliarServices.formatearNumero(totalDetNroDoc, 2), { align: 'right', width: 4 });
            doc.writeText(180, altura, auxiliarServices.formatearNumero(totalDetClientes, 2), { align: 'right', width: 4 });
            doc.writeText(200, altura, auxiliarServices.formatearNumero(totalDetCartera, 2), { align: 'right', width: 4 });

            altura = altura + 30;

            doc.line(50, altura, 95, altura);       doc.line(110, altura, 155, altura); // horizontal line 
            altura = altura + 2;
            doc.text(63, altura, 'Vo Bo Almacen'); doc.text(120, altura, 'RECIBI CONFORME')
        }

        for (var i = 0; i < pedidos.length; i++) {

            if (idTransportista != pedidos[i].idTransportista) {

                idTransportista = pedidos[i].idTransportista;

                doc.setFontSize(8.5);
                doc.setFontType("bold");
                altura = altura + 2; 
                doc.text(10, altura, 'Transportista : ' + pedidos[i].idTransportista + ' : ' + pedidos[i].transportista)
                doc.line(6, altura + 1.5, 100, altura + 1.5) // horizontal line
                doc.setFontType("normal");
                doc.setFontSize(7.5);

                altura = altura + 6;    
            } 

            if (idTransportista == pedidos[i].idTransportista) {

                doc.text(6, altura, pedidos[i].codigoProducto);
                splitTitle = doc.splitTextToSize(String(pedidos[i].descripcionProducto.trim()), 85);
                doc.text(24, altura, splitTitle);
                doc.writeText(123, altura, auxiliarServices.formatearNumero(pedidos[i].cantidadVenta, 2), { align: 'right', width: 8 });
                doc.writeText(155, altura, pedidos[i].cantidadEquivalente, { align: 'right', width: 8 });
                doc.writeText(175, altura, auxiliarServices.formatearNumero(pedidos[i].importe, 2), { align: 'right', width: 8 });
                doc.writeText(195, altura, auxiliarServices.formatearNumero(pedidos[i].pesoTotal, 2), { align: 'right', width: 8 });

                espacio = 0;
                espacio = (splitTitle.length == 1) ? 4.5 : 8; 

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

                    doc.setFontType("bold");
                    doc.text(20, altura, 'TOTAL TRANSPORTISTA'); doc.text(110, altura, 'IMPORTE'); doc.text(160, altura, 'PESO');
                    doc.writeText(70, altura, auxiliarServices.formatearNumero(totalRegistro, 2) , { align: 'right', width: 8 });
                    doc.writeText(140, altura, auxiliarServices.formatearNumero(totalImporte, 2) , { align: 'right', width: 8 });
                    doc.writeText(190, altura, auxiliarServices.formatearNumero(totalPeso, 2), { align: 'right', width: 8 });
                    altura = altura + 10;

                    nroPag = nroPag + 1;
                    doc.addPage();
                    altura = 18;
                    cabeceraReporteResumen(nroPag);

                    resumenReporte();
                }
            }        
        }

        var string = doc.output('datauristring');
        var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
        var x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();

            
    }

    $scope.verPedido = function () {
        $('#modalMantenimiento').modal('show');
    }


    //-----------------------------
    ///---- TODO LO DE PEDIDOS -----
    ////----------------------------


    $scope.Flag_modoEdicion = false;
    $scope.objeto_parametros = {
        id_Pedido_Cab: '0',
        id_empresa: '0',
        id_Local: '0',
        Numero_Pedido: '',
        id_cliente: '0',
        codigoInterno_Suministro: '',
        nrodoc_cliente: '',
        nombres_Cliente: '',
        id_Almacen: '0',
        id_TipoDocumento: '0',
        id_PuntoVenta: '1',
        id_CanalNegocio: '1',
        id_cuadrilla: '1',
        id_PersonalVendedor: '0',
        id_FormaPago: '0',
        id_moneda: '1',
        fechaEmision_Pedido_Cab: '',
        tipoCambio_Pedido_Cab: '',
        codigoInterno_Cliente: '',
        direccion_Pedido_Cab: '',
        fechaEntrega_Pedido_Cab: '',
        porcentajeIGV_Pedido_Cab: '',
        imprimeGuiaRemision_Pedido_Cab: '',
        observaciones_Pedido_Cab: '',
        estado: '6',
        Sub_Total_Pedido_Cab: '',
        total_Igv_Pedido_Cab: '',
        total_Neto_Pedido_Cab: '',
        Numero_Documento: '',
        serie: '',
        num_doc: '',
        fechaFactura_Pedido_Cab: '',
        usuario_creacion: '0',
        TipoGuiaRemision: '0',
        flag_exonerada_igv: '',
        flag_tipo_facturacion: '1',
        id_Anexos: '0',
        id_ZonaVta: '0',
        id_PersonalTransportista: '0',
    };


    $scope.Lista_Almacen_pedido = [];
    $scope.change_Local_Almacen_pedido_new = function (idlocal) {
        $scope.loader_modal = true;
        AlmacenServices.get_almacenesZona(idlocal, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loader_modal = false;

                if (res.ok == true) {
                    $scope.Lista_Almacen_pedido = [];
                    $scope.Lista_Almacen_pedido = res.data;
                    setTimeout(function () {
                        if (res.data.length > 0) {
                            $scope.objeto_parametros.id_Almacen = String(res.data[0].id_Almacen);
                            $('#cbo_almacen_pedido').val(String(res.data[0].id_Almacen)).trigger('change.select2');
                            $scope.change_almacen_anexo_pedido(res.data[0].id_Almacen);
                        } else {
                            $scope.objeto_parametros.id_Almacen = '0';
                            $('#cbo_almacen_pedido').val("0").trigger('change.select2');
                        }

                        $scope.lista_anexos = [];
                        $scope.objeto_parametros.id_Anexos = '0';
                        $('#cbo_anexo').val('0').trigger('change.select2');

                    }, 0);
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                $scope.loader_modal = false;
                console.log(err);
            });
    };

    $scope.Lista_Vendedor_pedido = [];
    $scope.change_Local_vendedor_pedido = function (idlocal) {
        $scope.loader_modal = true;
        RevisionPedidoServices.get_vendedorLocal(idlocal)
            .then(function (res) {
                $scope.loader_modal = false;

                if (res.ok == true) {
                    $scope.Lista_Vendedor_pedido = [];
                    $scope.Lista_Vendedor_pedido = res.data;

                    setTimeout(function () {
                        $scope.objeto_parametros.id_PersonalVendedor = '0';
                        $('#cbo_vendedor_pedido').val("0").trigger('change.select2');
                    }, 0);
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loader_modal = false;
                console.log(err);
            });
    };

    $scope.Lista_Transportista_pedido = [];
    $scope.change_Local_transportista_pedido = function (idlocal) {
        $scope.loader_modal = true;
        RevisionPedidoServices.get_transportistaLocal(idlocal)
            .then(function (res) {
                $scope.loader_modal = false;
                if (res.ok == true) {
                    $scope.Lista_Transportista_pedido = [];
                    $scope.Lista_Transportista_pedido = res.data;

                    setTimeout(function () {
                        $scope.objeto_parametros.id_PersonalTransportista = '0';
                        $('#cbo_vehiculo').val("0").trigger('change.select2');
                    }, 0);
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loader_modal = false;
                console.log(err);
            });
    };

    $scope.lista_anexos_pedido = [];
    $scope.change_almacen_anexo_pedido = function (idAlmacen) {
        $scope.loader_modal = true;
        RevisionPedidoServices.get_Anexos_Almacen(idAlmacen).then(function (res) {
            $scope.loader_modal = false;
            if (res.ok == true) {
                $scope.lista_anexos_pedido = [];
                $scope.lista_anexos_pedido = res.data;

                $timeout(function () {
                    if (res.data.length > 0) {
                        $scope.objeto_parametros.id_Anexos = String(res.data[0].id);
                        $('#cbo_anexo_pedido').val(String(res.data[0].id)).trigger('change.select2');
                    } else {
                        $scope.objeto_parametros.id_Anexos = '0';
                        $('#cbo_anexo_pedido').val('0').trigger('change.select2');
                    }
                })


            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
        }, function (err) {
            $scope.loader_modal = false;
            console.log(err);
        });
    }

    $scope.Lista_CondicionFact = [];
    $scope.Listando_CondicionFacturacion = function () {
        $scope.loaderfiltros = true;
        GrupoDetServices.getGrupoTabla_Det(5)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_CondicionFact = [];
                $scope.Lista_CondicionFact = data;     
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };
    $scope.Listando_CondicionFacturacion();


    $scope.Lista_TipoDoc = [];
    $scope.Listando_TipoDocumento = function () {
        $scope.loaderfiltros = true;
        TipoDocumentoServices.getTipoDocumento(0)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_TipoDoc = [];

                for (var i = 0; i < data.length; i++) {
                    if (data[i].id_TipoDocumento == 1 || data[i].id_TipoDocumento == 2  ) {
                        console.log(data[i].id_TipoDocumento);
                        $scope.Lista_TipoDoc.push(data[i]);
                    }
                }
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Listando_TipoDocumento();
       
    $scope.Buscar_Cliente = function () {
        $scope.objeto_parametros.id_cliente = '0';
        $scope.objeto_parametros.codigoInterno_Suministro = '';
        $scope.objeto_parametros.nombres_Cliente = '';
        $scope.objeto_parametros.codigoInterno_Cliente = '';
        $scope.objeto_parametros.direccion_Pedido_Cab = '';
        if ($scope.objeto_parametros.nrodoc_cliente === '' || $scope.objeto_parametros.nrodoc_cliente === null || $scope.objeto_parametros.nrodoc_cliente === undefined) {
            return;
        }

        $scope.loader_modal = true;
        PedidosServices.get_Search_Cliente($scope.objeto_parametros.nrodoc_cliente)
            .then(function (data) {

                $scope.loader_modal = false;
                var indicador = false;
                for (var i = 0; i < data.length; i++) {
                    indicador = true;
                    break;
                }
                if (indicador === false) {

                    //return;
                } else {
                    $scope.objeto_parametros.id_cliente = data[0].id_cliente;
                    $scope.objeto_parametros.codigoInterno_Suministro = data[0].codigoInterno_Cliente;
                    $scope.objeto_parametros.nombres_Cliente = data[0].nombres_Cliente + '  -  ' + data[0].direccion_referencia;
                    $scope.objeto_parametros.codigoInterno_Cliente = data[0].codigoInterno_Cliente;
                    $scope.objeto_parametros.direccion_Pedido_Cab = data[0].direccion_referencia;
                }
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Open_New_Modal_AyudaCliente = function () {

        var regionDetalle = document.getElementById('regionDetalle');
        $('#txt_busquedaCliente').val('');
        $scope.Lista_Busqueda_Cliente = [];
        regionDetalle.style.display = 'none';
        $('#modalAyuda_Cliente').modal('show');
        $timeout(function () {
            regionDetalle.style.display = 'none';
            $('#txt_busquedaCliente').focus().select();
        }, 500);
    };

    $scope.tituloProceso = 'Generar Cancelacion';
    $scope.Change_TipoDoc_Numeracion = function () {
        $scope.objeto_parametros.Numero_Documento = '';
        $scope.objeto_parametros.serie = '';
        $scope.objeto_parametros.num_doc = '';

        if ($scope.objeto_parametros.id_TipoDocumento == 3 || $scope.objeto_parametros.id_TipoDocumento == '3') {
            $("#txt_serie").prop('disabled', false);
            $("#txt_num_doc").prop('disabled', false);

            //var chk_transporrte = document.getElementById('chk_transporrte');
            //if (chk_transporrte.checked == true) {
            //    $scope.tituloProceso = 'Generar Documento';
            //} else {
            //    $scope.tituloProceso = 'Generar Cancelacion';
            //}

        } else {
            if ($scope.objeto_parametros.id_Anexos == 0 || $scope.objeto_parametros.id_Anexos == '0') {
                auxiliarServices.NotificationMessage('Sistemas', 'Es necesario que seleccione un Anexo para obtener la numeracion, verifique', 'error', '#ff6849', 2000);
                return;
            }
            if ($scope.objeto_parametros.id_TipoDocumento == 0 || $scope.objeto_parametros.id_TipoDocumento == '0') {
                return;
            }

            $("#txt_serie").prop('disabled', true);
            $("#txt_num_doc").prop('disabled', true);

            $scope.loaderfiltros = true;
            NotaCreditoDebitoServices.get_NumeracionAutomatica($scope.objeto_parametros.id_Anexos, $scope.objeto_parametros.id_TipoDocumento, 0)
                .then(function (data) {
                    $scope.loaderfiltros = false;

                    if (data.length == 0) {
                        auxiliarServices.NotificationMessage('Sistemas', 'No se configuro ninguna Serie para ese Local, verifique', 'error', '#ff6849', 2000);
                        return;
                    }
                    $scope.objeto_parametros.serie = data[0].serie_correlativo;
                    $scope.objeto_parametros.num_doc = '0000000';
                }, function (err) {
                    $scope.loaderfiltros = false;
                    console.log(err);
                });
        }




    };

    $scope.Guardar_Pedido_Cab = function () {

        if (PedidosServices.validate_Cabecera($scope.objeto_parametros) === false) {
            return;
        }
        var fechaOrigen = $scope.objeto_parametros.fechaEmision_Pedido_Cab;

        if (fechaOrigen == 0 || fechaOrigen == '0' || fechaOrigen == null || fechaOrigen == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha del Documento', 'error', '#ff6849', 1500);
            return false;
        }

        $scope.objeto_parametros.fechaEmision_Pedido_Cab = auxiliarServices.changeFormatDate(2, fechaOrigen);
        $scope.objeto_parametros.fechaEntrega_Pedido_Cab = auxiliarServices.changeFormatDate(2, fechaOrigen);
        $scope.objeto_parametros.fechaFactura_Pedido_Cab = auxiliarServices.changeFormatDate(2, fechaOrigen);

        $scope.objeto_parametros.Numero_Documento = $scope.objeto_parametros.serie + '-' + $scope.objeto_parametros.num_doc;

        var chk_exonerada = document.getElementById('chk_exonerada');
        if (chk_exonerada.checked == true) {
            $scope.objeto_parametros.flag_exonerada_igv = 'S';
        } else {
            $scope.objeto_parametros.flag_exonerada_igv = '';
        }

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo

            //$scope.objeto_parametros.Numero_Pedido = getCodUniq();
            $scope.objeto_parametros.Numero_Pedido = '';

            if ($scope.objeto_parametros.id_TipoDocumento == "3") {
                //var chk_transporrte = document.getElementById('chk_transporrte');

                //if (chk_transporrte.checked == true) {
                //    $scope.objeto_parametros.TipoGuiaRemision = '1';

                //} else {
                //    $scope.objeto_parametros.TipoGuiaRemision = '0';
                //}

                $scope.objeto_parametros.serie = auxiliarServices.Formatear_CerosIzquierda(parseInt($scope.objeto_parametros.serie), 4);
                $scope.objeto_parametros.num_doc = auxiliarServices.Formatear_CerosIzquierda(parseInt($scope.objeto_parametros.num_doc), 7);
                $scope.objeto_parametros.Numero_Documento = $scope.objeto_parametros.serie + '-' + $scope.objeto_parametros.num_doc;

                let generandoDocumento = async () => {
                    let res = await PedidosServices.validar_NroDocumento_Pedido($scope.objeto_parametros.Numero_Documento, $scope.objeto_parametros.id_TipoDocumento)

                    if (res !== 0) {
                        auxiliarServices.NotificationMessage('Sistemas', 'El nro de Documento ya se encuentra registrado en el sistema, verifique', 'error', '#ff6849', 1500);
                        return;
                    } else {
                        $scope.loader_modal = true;
                        $('#btnGuardarCab').attr("disabled", true);

                        let res_save = await PedidosServices.save_Pedido($scope.objeto_parametros);

                        $scope.disabledDetalle = "";
                        $scope.Lista_DataCabecera.push(res_save);
                        $scope.objeto_parametros.id_Pedido_Cab = res_save.id_Pedido_Cab;

                        //$("#cbo_TipoDoc").prop('disabled', true);

                        $scope.objeto_parametros.fechaEmision_Pedido_Cab = fechaOrigen;
                        $scope.Flag_modoEdicion = true;
                        objAux = res_save;
                        $timeout(function () {
                            $('#btnGuardarCab').attr("disabled", false);
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Proceso de Registro realizado correctamente !'
                            };
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });
                            $scope.loader_modal = false;
                        }, 500);
                    }
                }

                ///----ejecutando proceso---
                generandoDocumento()
                    .catch((error) => {
                        alert(error);
                    })
            }
            else {
                ////-----guardando el pedido----
                $scope.loader_modal = true;
                $('#btnGuardarCab').attr("disabled", true);
                PedidosServices.save_Pedido($scope.objeto_parametros)
                    .then(function (data) {
                        $scope.disabledDetalle = "";
                        $scope.Lista_DataCabecera.push(data);
                        $scope.objeto_parametros.id_Pedido_Cab = data.id_Pedido_Cab;

                        //$("#cbo_TipoDoc").prop('disabled', true);
                        $scope.objeto_parametros.fechaEmision_Pedido_Cab = fechaOrigen;
                        $scope.Flag_modoEdicion = true;
                        objAux = data;
                        $timeout(function () {
                            $('#btnGuardarCab').attr("disabled", false);
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Proceso de Registro realizado correctamente !'
                            };
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });
                            $scope.loader_modal = false;
                        }, 500);
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
                            alert(JSON.stringify(error));
                        }, 500);
                    });
            }
        } else {  //actualizar
            $scope.loader_modal = true;
            $scope.objeto_parametros.Numero_Documento = $scope.objeto_parametros.serie + '-' + $scope.objeto_parametros.num_doc;

            PedidosServices.update_Pedido($scope.objeto_parametros)
                .then(function (data) {
                    $scope.loader_modal = false;
                    if (data == "OK") {
                        $scope.listandoRevisionesPedidoCab($scope.flagFueraRuta)
                         $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Actualizacion realizado correctamente !'
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
                    console.log(error);
                });
        }
    };

    $scope.nuevaGuia = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $scope.disabledCabecera = "";
        $scope.disablelocalAlmacen = "";
        $scope.disabledDetalle = "disabledContent";
        $scope.Lista_DataDetalle = [];
        $scope.clean_detail();
        $scope.Flag_modoEdicion_detalle = false;
        $scope.disabledProd = "";
        $scope.CalculoTotales_General_new();

        //var chk_transporrte_new = document.getElementById('chk_transporrte');
        //chk_transporrte_new.checked = false;
        //$scope.tituloProceso = 'Generar Cancelacion';
    };
    
    $scope.CalculoTotales_General_new = function () {

        $scope.SubTotal_G = 0;
        $scope.Igv_G = 0;
        $scope.Total_G = 0;

        var subTotal = 0;
        var igv = 0;
        var neto = 0;

        for (var i = 0; i < $scope.Lista_DataDetalle.length; i++) {
            subTotal += parseFloat($scope.Lista_DataDetalle[i].total_Pedido_Det);
        }

        if ($scope.objeto_parametros.flag_tipo_facturacion == '1') { /// Gravado - Operación Onerosa
            neto = parseFloat(subTotal / 1.18);

            $scope.SubTotal_G = parseFloat(neto).toFixed(2);
            $scope.Igv_G = parseFloat(subTotal - neto).toFixed(2);
            $scope.Total_G = parseFloat(subTotal).toFixed(2);
        }
        else if ($scope.objeto_parametros.flag_tipo_facturacion == '2') {  // Exonerado - Operación Onerosa
            $scope.SubTotal_G = parseFloat(subTotal).toFixed(2);
            $scope.Igv_G = 0
            $scope.Total_G = parseFloat(subTotal).toFixed(2);
        }
        else if ($scope.objeto_parametros.flag_tipo_facturacion == '3') { // Inafecto – Retiro por Bonificación 
            $scope.SubTotal_G = 0
            $scope.Igv_G = 0
            $scope.Total_G = parseFloat(subTotal).toFixed(2);
        }
        return true;
    };


    var oTable_Cli;
    $scope.loader_modal_ayuda = false;
    $scope.Lista_Busqueda_Cliente = [];
    $scope.Ayuda_BuscarCliente = function () {
        var txt_busquedaCliente = document.getElementById('txt_busquedaCliente').value;
        var regionDetalle = document.getElementById('regionDetalle');

        $scope.loader_modal_ayuda = true;
        PedidosServices.get_Ayuda_Buscar_Cliente(txt_busquedaCliente)
            .then(function (data) {
                $scope.loader_modal_ayuda = false;
                $scope.Lista_Busqueda_Cliente = [];
                $scope.Lista_Busqueda_Cliente = data;

                $timeout(function () {
                    regionDetalle.style.display = '';
                    $scope.loader_modal_ayuda = false;
                    if (oTable_Cli !== 'data') {
                        oTable_Cli = 'data';
                        auxiliarServices.initFooTable('tbl_busquedaCliente', 'inputSearch_C');
                    } else {
                        $('#tbl_busquedaCliente').trigger('footable_initialize');
                    }
                }, 800);

            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Agregar_Cliente = function (obj) {
        $scope.objeto_parametros.id_cliente = obj.id_cliente;
        $scope.objeto_parametros.codigoInterno_Suministro = obj.codigoInterno_Cliente;
        $scope.objeto_parametros.nrodoc_cliente = obj.nroDoc_Cliente;
        $scope.objeto_parametros.nombres_Cliente = obj.nombres_Cliente + '  -  ' + obj.direccion_referencia;
        $scope.objeto_parametros.codigoInterno_Cliente = obj.codigoInterno_Cliente;
        $scope.objeto_parametros.direccion_Pedido_Cab = obj.direccion_referencia;
        $('#modalAyuda_Cliente').modal('hide');
    };

    let stock_Global = 0;
    let factor_Global = 0;

    $scope.Buscar_Producto = function () {

        $scope.objeto_parametros_detalle.id_Producto = '0';
        $scope.objeto_parametros_detalle.nombre_Producto = '';
        $scope.objeto_parametros_detalle.precioVenta_Pedido_Det = '';
        $scope.objeto_parametros_detalle.stock = '';
        $scope.objeto_parametros_detalle.nroLote = '';
        $scope.objeto_parametros_detalle.id_UnidadMedida_Venta = '0';
        $scope.objeto_parametros_detalle.factorMultiplicacion_Venta = '0';

        $scope.Calculo_Importe();

        if ($scope.objeto_parametros.id_Almacen === '0' || $scope.objeto_parametros.id_Almacen === '' || $scope.objeto_parametros.id_Almacen === null || $scope.objeto_parametros.id_Almacen === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacen', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.objeto_parametros_detalle.codigo1_Producto === '' || $scope.objeto_parametros_detalle.codigo1_Producto === null || $scope.objeto_parametros_detalle.codigo1_Producto === undefined) {
            return;
        }

        var e = document.getElementById("cbo_local_pedido");
        var id_LocalPedido = e.options[e.selectedIndex].value;

        var d = document.getElementById("cbo_almacen_pedido");
        var id_AlmacenPedido = d.options[d.selectedIndex].value;

        $scope.loader_modal = true;
        PedidosServices.get_Search_Producto(id_AlmacenPedido, $scope.objeto_parametros_detalle.codigo1_Producto, auxiliarServices.getUserId())
            .then(function (data) {

                $scope.loader_modal = false;
                var indicador = false;
                for (var i = 0; i < data.length; i++) {
                    indicador = true;
                    break;
                }

                if (indicador === false) {
                    auxiliarServices.NotificationMessage('Sistemas', 'No hay Stock o Codigo Incorrecto, verifique..', 'error', '#ff6849', 1500);
                    return;
                }

                $scope.objeto_parametros_detalle.id_Producto = data[0].id_producto;
                $scope.objeto_parametros_detalle.nombre_Producto = data[0].descripcion_producto;
                $scope.objeto_parametros_detalle.precioVenta_Pedido_Det = data[0].precioventa_listaprecios;
                $scope.objeto_parametros_detalle.stock = data[0].Stock;


                const idUM = (!data[0].Id_Unidad) ? '0' : data[0].Id_Unidad;
                const FactMulti = (!data[0].factorVenta) ? '0' : data[0].factorVenta;

                $scope.objeto_parametros_detalle.id_UnidadMedida_Venta = idUM;
                $scope.objeto_parametros_detalle.factorMultiplicacion_Venta = parseFloat(FactMulti).toFixed(2);

                stock_Global = data[0].Stock;
                factor_Global = FactMulti;

                $scope.objeto_parametros_detalle.nroLote = data[0].nroLote;
                $scope.ListaUnidadMedidaModal = [];

                if (idUM > 0) {
                    if (parseInt(idUM) == 1) {
                        $scope.ListaUnidadMedidaModal.push({ id_unidadMedida: data[0].Id_Unidad, nombre_UnidadMedida: data[0].unidadMedida });
                    } else {
                        $scope.ListaUnidadMedidaModal.push(
                            { id_unidadMedida: data[0].Id_Unidad, nombre_UnidadMedida: data[0].unidadMedida },
                            { id_unidadMedida: '1', nombre_UnidadMedida: 'UNIDAD' }
                        );
                    }
                }
                $scope.Flag_movLote = (data[0].movLote == 1) ? true : false;
                $scope.Calculo_Importe();

                $timeout(function () {
                    $('#cbo_unidadModal').val(idUM).trigger('change.select2');
                    if (data[0].movLote == 1) {
                        $('#txt_nroLote').focus().select();
                    } else {
                        $('#txt_cantidad').focus().select();
                    }
                });

            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

   $scope.Open_New_Modal_AyudaProducto = function () {

        var regionDetalle_Producto = document.getElementById('regionDetalle_Producto');
        $('#txt_busquedaProducto').val('');
        $scope.Lista_Busqueda_Producto = [];
        regionDetalle_Producto.style.display = 'none';
        $('#modalAyuda_Producto').modal('show');

        $scope.Flag_movLote = false;
        $timeout(function () {
            regionDetalle_Producto.style.display = 'none';
            $('#txt_busquedaProducto').focus().select();
        }, 800);
    };

    var oTable_Prod;

    $scope.Lista_Busqueda_Producto = [];
    $scope.Ayuda_BuscarProducto = function () {

        var txt_busquedaProducto = document.getElementById('txt_busquedaProducto').value;
        var regionDetalle_Producto = document.getElementById('regionDetalle_Producto');


        var e = document.getElementById("cbo_local_pedido");
        var id_LocalPedido = e.options[e.selectedIndex].value;

        var d = document.getElementById("cbo_almacen_pedido");
        var id_AlmacenPedido = d.options[d.selectedIndex].value;

        $scope.loader_modal_ayuda = true;
        PedidosServices.get_Ayuda_Buscar_Producto(id_AlmacenPedido, txt_busquedaProducto, auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loader_modal_ayuda = false;
                $scope.Lista_Busqueda_Producto = [];
                $scope.Lista_Busqueda_Producto = data;

                $timeout(function () {
                    $scope.loaderfiltros = false;
                    regionDetalle_Producto.style.display = '';
                    if (oTable_Prod == null) {
                        oTable_Prod = 'data';
                        auxiliarServices.initFooTable('tbl_busquedaProducto', 'inputSearch_P');
                    } else {
                        $('#tbl_busquedaProducto').trigger('footable_initialize');
                    }
                }, 800);

            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Agregar_Producto = function (obj) {

        $scope.objeto_parametros_detalle.id_Producto = obj.id_producto;
        $scope.objeto_parametros_detalle.codigo1_Producto = obj.codigoInterno;
        $scope.objeto_parametros_detalle.nombre_Producto = obj.descripcion_producto + ' - ' + obj.unidadMedida + ' - ' + obj.nombre_marcaproducto;
        $scope.objeto_parametros_detalle.precioVenta_Pedido_Det = obj.precioventa_listaprecios;
        $scope.objeto_parametros_detalle.stock = obj.Stock;
        $scope.objeto_parametros_detalle.nroLote = obj.nroLote;

        $scope.Flag_movLote = (obj.movLote == 1) ? true : false;

        const idUM = (!obj.Id_Unidad) ? '0' : obj.Id_Unidad;
        const FactMulti = (!obj.factorVenta) ? '0' : obj.factorVenta;

        $scope.objeto_parametros_detalle.id_UnidadMedida_Venta = idUM;
        $scope.objeto_parametros_detalle.factorMultiplicacion_Venta = parseFloat(FactMulti).toFixed(2);

        stock_Global = obj.Stock;
        factor_Global = FactMulti;

        $scope.objeto_parametros_detalle.nroLote = obj.nroLote;
        $scope.ListaUnidadMedidaModal = [];

        if (idUM > 0) {
            if (parseInt(idUM) == 1) {
                $scope.ListaUnidadMedidaModal.push({ id_unidadMedida: obj.Id_Unidad, nombre_UnidadMedida: obj.unidadMedida });
            } else {
                $scope.ListaUnidadMedidaModal.push(
                    { id_unidadMedida: obj.Id_Unidad, nombre_UnidadMedida: obj.unidadMedida },
                    { id_unidadMedida: '1', nombre_UnidadMedida: 'UNIDAD' }
                );
            }
        }

        $('#modalAyuda_Producto').modal('hide');

        $timeout(function () {
            $('#cbo_unidadModal').val(idUM).trigger('change.select2');
            if (obj.movLote == 1) {
                $('#txt_nroLote').focus().select();
            } else {
                $('#txt_cantidad').focus().select();
            }
        }, 800);

    };

    $scope.change_unidadStock = function () {
        if ($scope.objeto_parametros_detalle.id_UnidadMedida_Venta == '0') {
            $scope.objeto_parametros_detalle.stock = stock_Global;
        } else {
            if ($scope.objeto_parametros_detalle.id_UnidadMedida_Venta == '1') {
                $scope.objeto_parametros_detalle.stock = (stock_Global * factor_Global);
            } else {
                console.log('bbb')
                console.log(stock_Global + ':' + factor_Global)
                $scope.objeto_parametros_detalle.stock = (stock_Global);
            }
        }
    }

    $scope.Calculo_Importe = function () {
        var cant = 0;
        var prec = 0;

        if ($scope.objeto_parametros_detalle.cantidad_Pedido_Det === '' || $scope.objeto_parametros_detalle.cantidad_Pedido_Det === null || $scope.objeto_parametros_detalle.cantidad_Pedido_Det === undefined) {
            cant = 0;
        } else {
            cant = $scope.objeto_parametros_detalle.cantidad_Pedido_Det;
        }

        if ($scope.objeto_parametros_detalle.precioVenta_Pedido_Det === '' || $scope.objeto_parametros_detalle.precioVenta_Pedido_Det === null || $scope.objeto_parametros_detalle.precioVenta_Pedido_Det === undefined) {
            cant = 0;
        } else {
            prec = $scope.objeto_parametros_detalle.precioVenta_Pedido_Det;
        }

        let totalX = parseFloat(cant) * parseFloat(prec);
        totalX = totalX.toFixed(2);

        return $scope.objeto_parametros_detalle.total_Pedido_Det = totalX;

    };


    $scope.Buscar_Producto_Edicion = function (obj_detalle) {

        //---limpiando--
        $scope.clean_detail();
        $scope.Flag_modoEdicion_detalle = true;
        $scope.disabledProd = "disabledContent";

        $scope.cantBD = obj_detalle.cantidad_Pedido_Det;

        $scope.objeto_parametros_detalle.id_Pedido_Det = obj_detalle.id_Pedido_Det;
        $scope.objeto_parametros_detalle.id_Producto = obj_detalle.id_Producto;
        $scope.objeto_parametros_detalle.codigo1_Producto = obj_detalle.codigo1_Producto;
        $scope.objeto_parametros_detalle.nombre_Producto = obj_detalle.nombre_Producto + ' - ' + obj_detalle.nombre_UnidadMedida;
        $scope.objeto_parametros_detalle.cantidad_Pedido_Det = obj_detalle.cantidad_Pedido_Det;
        $scope.objeto_parametros_detalle.precioVenta_Pedido_Det = obj_detalle.precioVenta_Pedido_Det;
        $scope.objeto_parametros_detalle.nroLote = obj_detalle.nroLote;
        $scope.Flag_movLote = (obj_detalle.movLote == 1) ? true : false;

        $scope.objeto_parametros_detalle.id_UnidadMedida_Venta = String(obj_detalle.id_UnidadMedida_Venta);
        $scope.objeto_parametros_detalle.factorMultiplicacion_Venta = obj_detalle.factorMultiplicacion_Venta;

        factor_Global = obj_detalle.factorMultiplicacion_Venta;

        const idUM = (!obj_detalle.id_UnidadMedida_Venta) ? '0' : obj_detalle.id_UnidadMedida_Venta;
        $scope.ListaUnidadMedidaModal = [];

        if (idUM > 0) {
            if (parseInt(idUM) == 1) {
                $scope.ListaUnidadMedidaModal.push({ id_unidadMedida: obj_detalle.id_UnidadMedida_Venta, nombre_UnidadMedida: obj_detalle.nombre_UnidadMedida_Venta });
            } else {
                $scope.ListaUnidadMedidaModal.push(
                    { id_unidadMedida: obj_detalle.id_UnidadMedida_Venta, nombre_UnidadMedida: obj_detalle.nombre_UnidadMedida_Venta },
                    { id_unidadMedida: '1', nombre_UnidadMedida: 'UNIDAD' }
                );
            }
        }
        $timeout(function () {
            $('#cbo_unidadModal').val(String($scope.objeto_parametros_detalle.id_UnidadMedida_Venta)).trigger('change.select2');
        }, 0);


        $scope.Calculo_Importe();

        if ($scope.objeto_parametros.id_Almacen === '0' || $scope.objeto_parametros.id_Almacen === '' || $scope.objeto_parametros.id_Almacen === null || $scope.objeto_parametros.id_Almacen === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacen', 'error', '#ff6849', 1500);
            return;
        }

        if (obj_detalle.codigo1_Producto === '' || obj_detalle.codigo1_Producto === null || obj_detalle.codigo1_Producto === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos no se cargo la informacion del Producto, Actualice la pagina y continue..', 'error', '#ff6849', 1500);
            return;
        }

        $scope.loader_modal = true;
        PedidosServices.get_Search_Producto($scope.objeto_parametros.id_Almacen, obj_detalle.codigo1_Producto, auxiliarServices.getUserId())
            .then(function (data) {

                $scope.loader_modal = false;
                var indicador = false;
                for (var i = 0; i < data.length; i++) {
                    indicador = true;
                    break;
                }

                if (indicador === false) {
                    //auxiliarServices.NotificationMessage('Sistemas', 'No hay Stock ..', 'error', '#ff6849', 1500);
                    $scope.objeto_parametros_detalle.stock = '0';
                    return;
                }

                let idUnidadOrigen = data[0].Id_Unidad
                stock_Global = data[0].Stock;

                if (idUM != idUnidadOrigen) {
                    $scope.objeto_parametros_detalle.stock = (stock_Global * factor_Global)
                }
                else {
                    $scope.objeto_parametros_detalle.stock = stock_Global;
                }

                $scope.objeto_parametros_detalle.nroLote = data[0].nroLote;
                $scope.Flag_movLote = (data[0].movLote == 1) ? true : false;
                $scope.Calculo_Importe();

                $timeout(function () {
                    if (data[0].movLote == 1) {
                        $('#txt_nroLote').focus().select();
                    } else {
                        $('#txt_cantidad').focus().select();
                    }
                });
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.EliminarPedido_detalle = function (index, obj_detalle) {
        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Eliminar el Registro.',
            type: 'confirmationAlert'
        };
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res === true) {
                PedidosServices.set_Delete_Pedido_Detalle(obj_detalle.id_Pedido_Det, obj_detalle.Numero_Pedido)
                    .then(function (data) {
                        //----limpiando--
                        $scope.nuevaGuia_det();
                        if (data === "OK") {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'El Registro se Elimino correctamente !'
                            };
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });
                            $scope.Lista_DataDetalle.splice(index, 1);
                            $scope.CalculoTotales_General_new();
                            var indicador = false;
                            for (var i = 0; i < $scope.Lista_DataDetalle.length; i++) {
                                indicador = true;
                                break;
                            }

                            if (indicador === false) {
                                $scope.disablelocalAlmacen = "";
                            } else {
                                $scope.disablelocalAlmacen = "disabledContent";
                            }

                        } else {
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(data);
                        }
                    }, function (err) {
                        console.log(err);
                    });
            }
        });

    };
    
    $scope.cambiar_Facturacion = function (tipo) {

        if ($scope.objeto_parametros.id_Pedido_Cab == '' || $scope.objeto_parametros.id_Pedido_Cab == 0 || $scope.objeto_parametros.id_Pedido_Cab == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor primero grabe el Documento, para continuar', 'error', '#ff6849', 2000);
            $scope.objeto_parametros.flag_tipo_facturacion = '1';
            $timeout(function () {
                $('#cbo_tipo_Factura').val("1").trigger('change.select2');
            }, 200);
        } else {
            $scope.Actualizar_flag_Tipo_facturacion(tipo);
        }
    }
    
    $scope.Actualizar_flag_Tipo_facturacion = function (tipoFactura) {
        $scope.loader_modal = true;
        PedidosServices.Actualizar_flag_tipo_facturacion($scope.objeto_parametros.id_Pedido_Cab, tipoFactura)
            .then(function (ok) {
                $scope.loader_modal = false;
                $scope.CalculoTotales_General_new();
            }, function (error) {
                $scope.loader_modal = false;
                console.log('error');
                console.log(error);
            })
    }
    
    $scope.CalculoTotales_General_new = function () {

        $scope.SubTotal_G = 0;
        $scope.Igv_G = 0;
        $scope.Total_G = 0;

        var subTotal = 0;
        var igv = 0;
        var neto = 0;

        for (var i = 0; i < $scope.Lista_DataDetalle.length; i++) {
            subTotal += parseFloat($scope.Lista_DataDetalle[i].total_Pedido_Det);
        }

        if ($scope.objeto_parametros.flag_tipo_facturacion == '1') { /// Gravado - Operación Onerosa
            neto = parseFloat(subTotal / 1.18);

            $scope.SubTotal_G = parseFloat(neto).toFixed(2);
            $scope.Igv_G = parseFloat(subTotal - neto).toFixed(2);
            $scope.Total_G = parseFloat(subTotal).toFixed(2);
        }
        else if ($scope.objeto_parametros.flag_tipo_facturacion == '2') {  // Exonerado - Operación Onerosa
            $scope.SubTotal_G = parseFloat(subTotal).toFixed(2);
            $scope.Igv_G = 0
            $scope.Total_G = parseFloat(subTotal).toFixed(2);
        }
        else if ($scope.objeto_parametros.flag_tipo_facturacion == '3') { // Inafecto – Retiro por Bonificación 
            $scope.SubTotal_G = 0
            $scope.Igv_G = 0
            $scope.Total_G = parseFloat(subTotal).toFixed(2);
        }
        return true;
    };
    
    $scope.objeto_parametros_detalle = {
        id_Pedido_Det: '0',
        id_Pedido_Cab: '0',
        item_Pedido_Det: '1',
        id_Producto: '0',
        codigo1_Producto: '',
        nombre_Producto: '',
        precioVenta_Pedido_Det: '',
        porcentajeDescuento_Pedido_Det: '0',
        Descuento_Pedido_Det: '0',
        cantidad_Pedido_Det: '',
        porcentajeIGV_Pedido_Det: '0',
        total_Pedido_Det: '',
        Numero_Pedido: '',
        stock: '0',
        nroLote: '',
        id_UnidadMedida_Venta: '0',
        factorMultiplicacion_Venta: '0',
    };
    
    $scope.clean_detail = function () {
        $scope.objeto_parametros_detalle.id_Pedido_Det = '0';
        $scope.objeto_parametros_detalle.id_Pedido_Cab = $scope.objeto_parametros.id_Pedido_Cab;
        $scope.objeto_parametros_detalle.item_Pedido_Det = '1';
        $scope.objeto_parametros_detalle.id_Producto = '0';
        $scope.objeto_parametros_detalle.codigo1_Producto = '';
        $scope.objeto_parametros_detalle.nombre_Producto = '';
        $scope.objeto_parametros_detalle.precioVenta_Pedido_Det = '';
        $scope.objeto_parametros_detalle.porcentajeDescuento_Pedido_Det = '0';
        $scope.objeto_parametros_detalle.Descuento_Pedido_Det = '0';
        $scope.objeto_parametros_detalle.cantidad_Pedido_Det = '';
        $scope.objeto_parametros_detalle.porcentajeIGV_Pedido_Det = '0';
        $scope.objeto_parametros_detalle.total_Pedido_Det = '';
        $scope.objeto_parametros_detalle.Numero_Pedido = $scope.objeto_parametros.Numero_Pedido;
        $scope.objeto_parametros_detalle.stock = '0';
        $scope.objeto_parametros_detalle.nroLote = '';
        $scope.objeto_parametros_detalle.id_UnidadMedida_Venta = '0';
        $scope.objeto_parametros_detalle.factorMultiplicacion_Venta = '0';

    };

    $scope.nuevaGuia_det = function () {
        $scope.clean_detail();
        $scope.Flag_modoEdicion_detalle = false;
        $scope.disabledProd = "";
        $scope.Flag_movLote = false;
        $scope.ListaUnidadMedidaModal = [];
        $scope.cantBD = 0;
        $timeout(function () {
            $('#txt_cod_producto').focus().select();
            $('#cbo_unidadModal').val('0').trigger('change.select2');
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

    $scope.clean = function () {
        var chk_exonerada = document.getElementById('chk_exonerada');
        var cbo_tipo_Factura = document.getElementById('cbo_tipo_Factura');
        $scope.objeto_parametros.id_Pedido_Cab = '0';
        $scope.objeto_parametros.id_empresa = '1';
        $scope.objeto_parametros.id_Local = '0';
        $scope.objeto_parametros.Numero_Pedido = '';
        $scope.objeto_parametros.id_cliente = '0';
        $scope.objeto_parametros.codigoInterno_Suministro = '';
        $scope.objeto_parametros.nrodoc_cliente = '';
        $scope.objeto_parametros.nombres_Cliente = '';
        $scope.objeto_parametros.id_Almacen = '0';
        $scope.objeto_parametros.id_TipoDocumento = '0';
        $scope.objeto_parametros.id_PuntoVenta = '1';
        $scope.objeto_parametros.id_CanalNegocio = '0';


        $scope.objeto_parametros.id_cuadrilla = '1';
        $scope.objeto_parametros.id_PersonalVendedor = '0';
        $scope.objeto_parametros.id_FormaPago = '0';
        $scope.objeto_parametros.id_moneda = '1';
        $scope.objeto_parametros.fechaEmision_Pedido_Cab = '';

        $scope.objeto_parametros.tipoCambio_Pedido_Cab = '0';
        $scope.objeto_parametros.codigoInterno_Cliente = '';
        $scope.objeto_parametros.direccion_Pedido_Cab = '';
        $scope.objeto_parametros.fechaEntrega_Pedido_Cab = '';

        $scope.objeto_parametros.porcentajeIGV_Pedido_Cab = '18';
        $scope.objeto_parametros.imprimeGuiaRemision_Pedido_Cab = '';
        $scope.objeto_parametros.observaciones_Pedido_Cab = '';
        $scope.objeto_parametros.estado = '6';
        $scope.objeto_parametros.Sub_Total_Pedido_Cab = '0';
        $scope.objeto_parametros.total_Igv_Pedido_Cab = '0';
        $scope.objeto_parametros.total_Neto_Pedido_Cab = '0';
        $scope.objeto_parametros.Numero_Documento = '';

        $scope.objeto_parametros.serie = '';
        $scope.objeto_parametros.num_doc = '';
        $scope.objeto_parametros.fechaFactura_Pedido_Cab = '';
        $scope.objeto_parametros.TipoGuiaRemision = '0';
        $scope.objeto_parametros.flag_exonerada_igv = '0';
        $scope.objeto_parametros.flag_tipo_facturacion = '1';

        $scope.objeto_parametros.id_Anexos = '0';
        $scope.objeto_parametros.id_ZonaVta = '0';
        $scope.objeto_parametros.id_PersonalTransportista = '0';

        $scope.Lista_zonasModal = [];
        $scope.Lista_Almacen_pedido = [];
        $scope.Lista_Vendedor_pedido = [];
        $scope.Lista_Transportista_pedido = [];

        $scope.objeto_parametros.usuario_creacion = auxiliarServices.getUserId();
        $timeout(function () {
            chk_exonerada.checked = false;
            $('#cbo_tipo_Factura').val("1").trigger('change.select2');
            $('#cbo_local_pedido').val("0").trigger('change.select2');
            $('#cbo_almacen_pedido').val("0").trigger('change.select2');
            $('#cbo_vendedor_pedido').val("0").trigger('change.select2');
            $('#cbo_puntoVenta').val("0").trigger('change.select2');
            $('#cbo_cond_facturacion').val("0").trigger('change.select2');
            $('#cbo_TipoDoc').val("0").trigger('change.select2');
            $('#cbo_vehiculo').val("0").trigger('change.select2');
            $('#cbo_anexo_pedido').val("0").trigger('change.select2');
        }, 200);
    };

    function Existencia_Producto(id_producto) {
        var result = false;
        $scope.Lista_DataDetalle.forEach(function (item, index) {
            if (item.id_Producto === id_producto) {
                auxiliarServices.NotificationMessage('Sistemas', 'El Producto ya se encuentra registrado, verifique.!', 'error', '#ff6849', 2000);
                result = true;
            }
        });
        return result;
    }


    $scope.cantBD = 0;

    $scope.Guardar_Pedido_Det = function () {

        $scope.objeto_parametros_detalle.id_Pedido_Cab = $scope.objeto_parametros.id_Pedido_Cab;
        $scope.objeto_parametros_detalle.Numero_Pedido = $scope.objeto_parametros.Numero_Pedido;

        if (PedidosServices.validate_detalle($scope.objeto_parametros_detalle) == false) {
            return;
        }

        if ($scope.Flag_modoEdicion_detalle === false) {


            if ($scope.objeto_parametros_detalle.stock === 0 || $scope.objeto_parametros_detalle.stock === '0' || $scope.objeto_parametros_detalle.stock === null || $scope.objeto_parametros_detalle.stock === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'No hay Stock para este Producto, verifique', 'error', '#ff6849', 1500);
                return false;
            }

            if (parseFloat($scope.objeto_parametros_detalle.stock) <= 0) {
                auxiliarServices.NotificationMessage('Sistemas', 'Este producto no tiene stock', 'error', '#ff6849', 2000);
                return;
            }

            if (parseFloat($scope.objeto_parametros_detalle.cantidad_Pedido_Det) > parseFloat($scope.objeto_parametros_detalle.stock)) {
                auxiliarServices.NotificationMessage('Sistemas', 'La cantidad supera el Stock disponible, verifique', 'error', '#ff6849', 2000);
                return;
            }

        } else {

            if ($scope.cantBD != Number($scope.objeto_parametros_detalle.cantidad_Pedido_Det)) {

                if ($scope.objeto_parametros_detalle.stock === 0 || $scope.objeto_parametros_detalle.stock === '0' || $scope.objeto_parametros_detalle.stock === null || $scope.objeto_parametros_detalle.stock === '') {
                    auxiliarServices.NotificationMessage('Sistemas', 'No hay Stock para este Producto, verifique', 'error', '#ff6849', 1500);
                    return false;
                } else {
                    if ($scope.objeto_parametros_detalle.stock < 0) {
                        auxiliarServices.NotificationMessage('Sistemas', 'No hay Stock para este Producto, verifique', 'error', '#ff6849', 1500);
                        return false;
                    }
                }       


                if (parseFloat($scope.objeto_parametros_detalle.cantidad_Pedido_Det) > parseFloat($scope.objeto_parametros_detalle.stock)) {
                    auxiliarServices.NotificationMessage('Sistemas', 'La cantidad supera el Stock disponible, verifique', 'error', '#ff6849', 2000);
                    return;
                }
            }
        }


        if ($scope.Flag_movLote == 1) {
            if ($scope.objeto_parametros_detalle.nroLote == '' || $scope.objeto_parametros_detalle.nroLote == undefined) {
                auxiliarServices.NotificationMessage('Sistemas', 'Es necesario ingresar un Nro de Lote', 'error', '#ff6849', 2000);
                return;
            }
        }
        if ($scope.objeto_parametros_detalle.id_UnidadMedida_Venta == '' || $scope.objeto_parametros_detalle.id_UnidadMedida_Venta == null || $scope.objeto_parametros_detalle.id_UnidadMedida_Venta == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Es necesario elegir una Unidad de Medida', 'error', '#ff6849', 2000);
            return;
        }



        if ($scope.Flag_modoEdicion_detalle === false) { // nuevo registroo detalle

            //--Validando
            if (Existencia_Producto($scope.objeto_parametros_detalle.id_Producto) == true) {
                $timeout(function () {
                    $('#txt_cod_producto').focus().select();
                });
                return;
            }

            $scope.loader_modal = true;
            $('#btnGuardarDet').attr("disabled", true);
            PedidosServices.save_Pedido_Detalle($scope.objeto_parametros_detalle)
                .then(function (data) {
                    $scope.Listando_InformacionPedidos_detalle();
                    $('#btnGuardarDet').attr("disabled", false);
                    $scope.loader_modal = false;

                    //---limpiando--
                    $scope.nuevaGuia_det();
                }, function (error) {
                    $('#btnGuardarDet').attr("disabled", false);
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

        } else {  //actualizar detalle

            $scope.loader_modal = true;
            $('#btnGuardarDet').attr("disabled", true);
            PedidosServices.update_Pedido_Detalle($scope.objeto_parametros_detalle)
                .then(function (data) {
                    $scope.loader_modal = false;
                    if (data === "OK") {
                        $scope.Listando_InformacionPedidos_detalle();
                        $('#btnGuardarDet').attr("disabled", false);
                        //---limpiando--
                        $scope.nuevaGuia_det();
                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Actualizacion realizado correctamente !'
                            };
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });

                        }, 500);
                    } else {
                        $('#btnGuardarDet').attr("disabled", false);
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
                    $('#btnGuardarDet').attr("disabled", false);
                    console.log(error);
                });

        }
    };

    $scope.Open_Update_Modal = function (obj) {

        $scope.clean();
        $scope.Flag_modoEdicion = true;

        $scope.Lista_DataDetalle = []; 
        $scope.nuevaGuia_det();
        $scope.Flag_modoEdicion_detalle = false;
        $scope.disabledProd = "";

        //$("#cbo_TipoDoc").prop('disabled', true);
        $("#txt_serie").prop('disabled', false);
        $("#txt_num_doc").prop('disabled', false);

        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_informacionPedidosID(obj.id_Pedido_Cab)
            .then(function (res) {
                $scope.loaderFiltro = false;
 
                if (res.length > 0) {
                    $scope.EdicionRegistros(res[0]);
                    $('#modalMantenimiento').modal('show');
                }
            }, function (err) {
                    $scope.loaderFiltro = false;
                console.log(err);
            });
 
    }

    $scope.EdicionRegistros = function (obj) {
        objAux = '';
        objAux = obj;
        //var chk_transporrte = document.getElementById('chk_transporrte');
        var chk_exonerada = document.getElementById('chk_exonerada');
 
        $scope.disabledCabecera = "";
        $scope.disabledDetalle = "";  

        $scope.objeto_parametros.id_Pedido_Cab = obj.id_Pedido_Cab;
        $scope.objeto_parametros.id_empresa = obj.id_empresa;
        $scope.objeto_parametros.id_Local = obj.id_Local;
        //---listando Almacenes por Local

        $scope.objeto_parametros.Numero_Pedido = obj.Numero_Pedido;
        $scope.objeto_parametros.id_cliente = obj.id_cliente;
        $scope.objeto_parametros.codigoInterno_Suministro = obj.codigoInterno_Suministro;
        $scope.objeto_parametros.nrodoc_cliente = obj.nroDoc_Cliente;
        $scope.objeto_parametros.nombres_Cliente = obj.nombres_Cliente;
        $scope.objeto_parametros.id_Almacen = obj.id_Almacen;
        $scope.objeto_parametros.id_TipoDocumento = obj.id_TipoDocumento;
        $scope.objeto_parametros.id_PuntoVenta = obj.id_PuntoVenta;
        $scope.objeto_parametros.id_CanalNegocio = obj.id_CanalNegocio;

        $scope.objeto_parametros.id_cuadrilla = obj.id_cuadrilla;
        $scope.objeto_parametros.id_PersonalVendedor = obj.id_PersonalVendedor;
        $scope.objeto_parametros.id_FormaPago = String(obj.id_FormaPago);
        $scope.objeto_parametros.id_moneda = obj.id_moneda;
        $scope.objeto_parametros.fechaEmision_Pedido_Cab = obj.fechaEmision_Pedido_Cab;

        $scope.objeto_parametros.tipoCambio_Pedido_Cab = obj.tipoCambio_Pedido_Cab;
        $scope.objeto_parametros.codigoInterno_Cliente = obj.codigoInterno_Cliente;
        $scope.objeto_parametros.direccion_Pedido_Cab = obj.direccion_Pedido_Cab;
        $scope.objeto_parametros.fechaEntrega_Pedido_Cab = obj.fechaEntrega_Pedido_Cab;

        $scope.objeto_parametros.porcentajeIGV_Pedido_Cab = obj.porcentajeIGV_Pedido_Cab;
        $scope.objeto_parametros.imprimeGuiaRemision_Pedido_Cab = obj.imprimeGuiaRemision_Pedido_Cab;
        $scope.objeto_parametros.observaciones_Pedido_Cab = obj.observaciones_Pedido_Cab;
        $scope.objeto_parametros.estado = obj.estado;
        $scope.objeto_parametros.Sub_Total_Pedido_Cab = obj.Sub_Total_Pedido_Cab;
        $scope.objeto_parametros.total_Igv_Pedido_Cab = obj.total_Igv_Pedido_Cab;
        $scope.objeto_parametros.total_Neto_Pedido_Cab = obj.total_Neto_Pedido_Cab;

        if (obj.Numero_Documento === undefined || obj.Numero_Documento === '' || obj.Numero_Documento === null) {
            $scope.objeto_parametros.Numero_Documento = '';
            $scope.objeto_parametros.serie = '';
            $scope.objeto_parametros.num_doc = '';
        } else {
            var Obj_NumDocumento = obj.Numero_Documento.split("-");
            $scope.objeto_parametros.serie = Obj_NumDocumento[0];
            $scope.objeto_parametros.num_doc = Obj_NumDocumento[1];
            $scope.objeto_parametros.Numero_Documento = obj.Numero_Documento;
        }

        $scope.objeto_parametros.fechaFactura_Pedido_Cab = obj.fechaFactura_Pedido_Cab;
        $scope.objeto_parametros.TipoGuiaRemision = obj.TipoGuiaRemision;
        $scope.objeto_parametros.flag_exonerada_igv = obj.flag_exonerada_igv;

        $scope.objeto_parametros.id_Anexos = obj.id_Anexos;;
        $scope.objeto_parametros.id_ZonaVta = obj.id_ZonaVta;;
        $scope.objeto_parametros.id_PersonalTransportista = obj.id_PersonalTransportista;;

        $scope.objeto_parametros.flag_tipo_facturacion = (obj.flag_tipo_facturacion == '' || obj.flag_tipo_facturacion == null) ? '1' : obj.flag_tipo_facturacion;

        $timeout(function () {
            if (obj.flag_exonerada_igv == "S") {
                chk_exonerada.checked = true;
            } else {
                chk_exonerada.checked = false;
            }
        }, 200);

        $timeout(function () {
            $('#cbo_tipo_Factura').val(obj.flag_tipo_facturacion).trigger('change.select2');
            $('#cbo_anexo_pedido').val(String(obj.id_Anexos)).trigger('change.select2');
            $scope.edicionComboDependientes(obj.id_ZonaVta, obj.id_Almacen, obj.id_Anexos, obj.id_PersonalVendedor, obj.id_PersonalTransportista)

            $('#cbo_cond_facturacion').val(String(obj.id_FormaPago)).trigger('change.select2');
            $('#cbo_TipoDoc').val(obj.id_TipoDocumento).trigger('change.select2');
            $('#txt_cod_cliente').focus().select();

            //if (obj.TipoGuiaRemision === "1") {
            //    chk_transporrte.checked = true;
            //} else {
            //    chk_transporrte.checked = false;
            //}

            if (obj.flag_exonerada_igv == "S") {
                chk_exonerada.checked = true;
            } else {
                chk_exonerada.checked = false;
            }
        }, 500);


        $timeout(function () {
            //--relacion de los detalles del Producto
            $scope.Listando_InformacionPedidos_detalle();
        }, 500);

    };

    $scope.Lista_DataDetalle = [];
    $scope.Listando_InformacionPedidos_detalle = function () {
        $scope.loader_modal = true;
        PedidosServices.get_Pedidos_detalle($scope.objeto_parametros.id_Pedido_Cab)
            .then(function (data) {
                $scope.loader_modal = false;
                $scope.Lista_DataDetalle = [];
                $scope.Lista_DataDetalle = data;
                $scope.CalculoTotales_General_new();
                var indicador = false;
                for (var i = 0; i < $scope.Lista_DataDetalle.length; i++) {
                    indicador = true;
                    break;
                }

                if (indicador === false) {
                    $scope.disablelocalAlmacen = "";
                } else {
                    $scope.disablelocalAlmacen = "disabledContent";
                }
            }, function (err) {
                $scope.loader_modal = false;
                console.log(err);
                $scope.CalculoTotales_General_new();
            });
    };

 

    $scope.Rechazar_Pedido = function (obj) {

 
            if (parseInt(obj.estado) === 27 || parseInt(obj.estado) === 12) {
                return;
            }

            var params = {
                title: "Desea continuar ?",
                text: 'Esta por Rechazar el Pedido.',
                type: 'confirmationAlert'
            };

            auxiliarServices.initSweetAlert(params).then(function (res) {
                if (res === true) {
                    $scope.loaderFiltro = true;
                    PedidosServices.set_anular_Pedido(obj.id_Pedido_Cab, auxiliarServices.getUserId())
                        .then(function (data) {
                            $scope.loaderFiltro = false;
                            if (data === "OK") {
                                // cambiando de estado
                                var index = $scope.revisionPedidosCab.indexOf(obj);
                                $scope.revisionPedidosCab[index].estado = 12;

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
                                $scope.loaderFiltro = false;
                            console.log(error);
                        });
                }
            });
 

    };



     //-----------------------------
    ///---- FIN TODO LO DE PEDIDOS -----
    ////----------------------------




    $scope.lista_anexos = [];
    $scope.lista_anexosModal = [];
    $scope.listados_anexos = function () {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_Anexos_Usuario_modulo(auxiliarServices.getUserId()).then(function (res) {
            $scope.loaderFiltro = false;

            if (res.ok == true) {
                $scope.lista_anexos = [];
                $scope.lista_anexosModal = [];
                $scope.lista_anexos = res.data;
                $scope.lista_anexosModal = res.data;
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
    $scope.listados_anexos();


    $scope.Lista_zonasFiltro = [];
    $scope.get_changeAnexoZonasFiltro = function (id_Anexos) {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_Zonas_anexos_modulo(id_Anexos, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    $scope.Lista_zonasFiltro = [];
                    $scope.Lista_zonasFiltro = res.data;

                    $timeout(function () {
                        $scope.Objeto_ParametroFiltro.id_ZonaVta = '0';
                        $('#cbo_zonasFiltro').val("0").trigger('change.select2');
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

    $scope.Lista_zonasModal = [];
    $scope.get_changeAnexoZonasModal = function (id_Anexos) {
        $scope.loader_modal = true;
        RevisionPedidoServices.get_Zonas_anexos_modulo(id_Anexos, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loader_modal = false;
                if (res.ok == true) {
                    $scope.Lista_zonasModal = [];
                    $scope.Lista_zonasModal = res.data;
                    $timeout(function () {
                        const idZona = $scope.Lista_zonasModal.length > 0 ? String(res.data[0].id) : '0'
                        $scope.objeto_parametros.id_ZonaVta = idZona;
                        $('#cbo_local_pedido').val(idZona).trigger('change.select2');

                        $scope.change_Local_vendedor_pedido(idZona);
                        $scope.change_Local_transportista_pedido(idZona);
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

    $scope.Lista_Almacen_pedido = [];
    $scope.change_anexo_Almacen_modal = function (idAnexo) {
        $scope.loader_modal = true;
        RevisionPedidoServices.get_almacenes_anexos_modulo(idAnexo, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loader_modal = false;
                if (res.ok == true) {
                    $scope.Lista_Almacen_pedido = [];
                    $scope.Lista_Almacen_pedido = res.data;
                    setTimeout(function () {
                        $scope.objeto_parametros.id_Almacen = '0';
                        $('#cbo_almacen_pedido').val("0").trigger('change.select2');
                    }, 0);
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loader_modal = false;
                console.log(err);
            });
    };

    $scope.edicionComboDependientes = async function (idZona, idAlmacen, id_Anexos, id_PersonalVendedor, id_PersonalTransportista) {
 
        const consultaZona = async () => {
            const resZona = await RevisionPedidoServices.get_Zonas_anexos_modulo(id_Anexos, auxiliarServices.getUserId())
            if (resZona.ok == true) {
                $scope.Lista_zonasModal = [];
                $scope.Lista_zonasModal = resZona.data;
                $timeout(function () {
                    const idZona = $scope.Lista_zonasModal.length > 0 ? String(resZona.data[0].id) : '0'
                    $scope.objeto_parametros.id_ZonaVta = idZona;
                    $('#cbo_local_pedido').val(idZona).trigger('change.select2');
                }, 800)
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(resZona.data);
            }
        }

        const consultandoAlmacen = async () => {
            const resAlma = await RevisionPedidoServices.get_almacenes_anexos_modulo(id_Anexos, auxiliarServices.getUserId())

            if (resAlma.ok == true) {
                $scope.Lista_Almacen_pedido = [];
                $scope.Lista_Almacen_pedido = resAlma.data;

                setTimeout(function () {
                    $scope.objeto_parametros.id_Almacen = idAlmacen;
                    $('#cbo_almacen_pedido').val(idAlmacen).trigger('change.select2');
                }, 500);
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(resAlma.data);
            }
        }

        const consultaVendedor = async () => {
            const resVendedor = await RevisionPedidoServices.get_vendedorLocal(idZona)

            if (resVendedor.ok == true) {
                $scope.Lista_Vendedor_pedido = [];
                $scope.Lista_Vendedor_pedido = resVendedor.data;

                setTimeout(function () {
                    $scope.objeto_parametros.id_PersonalVendedor = id_PersonalVendedor;
                    $('#cbo_vendedor_pedido').val(id_PersonalVendedor).trigger('change.select2');
                }, 1000);
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(resVendedor.data);
            }
        }

        const consultaTransportista = async () => {
            const resTransportista = await RevisionPedidoServices.get_transportistaLocal(idZona)

            if (resTransportista.ok == true) {
                $scope.Lista_Transportista_pedido = [];
                $scope.Lista_Transportista_pedido = resTransportista.data;
                let idTransp = (id_PersonalTransportista == '') ? '0' : String(id_PersonalTransportista);
                $scope.objeto_parametros.id_PersonalTransportista = idTransp;
                setTimeout(function () {
                    $('#cbo_vehiculo').val(idTransp).trigger('change.select2');
                }, 1000);
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(resTransportista.data);
            }
        }

        consultaZona();
        consultandoAlmacen();
        consultaVendedor();
        consultaTransportista();
    }


    $scope.Lista_Almacen = [];
    $scope.change_anexo_Almacen_filtro = function (idAnexo) {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_almacenes_anexos_modulo(idAnexo, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderfiltros = false;
                if (res.ok == true) {
                    $scope.Lista_Almacen = [];
                    $scope.Lista_Almacen = res.data;
                    setTimeout(function () {
                        $scope.Objeto_ParametroFiltro.id_almacen = '0';
                        $('#cbo_almacen').val("0").trigger('change.select2');
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

           
})
