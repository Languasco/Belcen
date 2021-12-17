var app = angular.module('appGestion.ConsolidadoController', [])

app.controller('ConsolidadoController', function ($scope, $location, $timeout, auxiliarServices, Documentos_MasivosServices, ConsolidadoServices,   RevisionPedidoServices) {
    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;
 
        auxiliarServices.changeTitle("Consolidado de Mercaderia");
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

    $scope.Flag_modoEdicion == false;
    $scope.idPromocion_Global = 0;

    $scope.Flag_modoEdicion_Config = false;
    $scope.idConfiguracion_Global = 0;

    $scope.Flag_modoEdicion_Canasta = false;
    $scope.idCanasta_Global = 0;

    $scope.flagFueraRuta = 0;
    $scope.checkedAll = false;
       
    $scope.Objeto_ParametroFiltro = {
        fechaIni: auxiliarServices.formatDateNow(),
        fechaFin: auxiliarServices.formatDateNow(),
        id_zona: '0',
        id_transportista: '0',
        id_vendedor: '0',
    }
     
    $scope.Lista_Local = [];
    $scope.get_Listando_Zonas = function () {
        $scope.loaderFiltro = true;
        Documentos_MasivosServices.get_zonasUsuario(auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderFiltro = false;
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
    $scope.get_Listando_Zonas();
  
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
           
    $scope.reporteDespacho = function () {

        if ($scope.Objeto_ParametroFiltro.id_zona == '0' || $scope.Objeto_ParametroFiltro.id_zona == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor selecciona la Zona', 'error', '#ff6849', 1500);
            return false;
        }
            

        const fechaIni = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fechaIni);
        const fechaFin = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fechaFin);

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Generar el Consolidado de Mercadería en PDF',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderFiltro = true;
                ConsolidadoServices.get_generarConsolidadoMercaderia_pdf(fechaIni, fechaFin, $scope.Objeto_ParametroFiltro.id_zona, $scope.Objeto_ParametroFiltro.id_transportista, auxiliarServices.getUserId(), $scope.Objeto_ParametroFiltro.id_vendedor  ).then(function (res) {
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

        const subTituloDetalle = () => {
            //------- cabecera del detalle del pdf -----

            doc.line(6, altura + 1.5, 205, altura + 1.5) // horizontal line
            altura = altura + 6;

            /*            doc.text(8, altura, 'CÓDIGO'); doc.text(28, altura, 'DESCRIPCIÓN DE ARTÍCULO'); doc.text(115, altura, 'CANT.VENTA'); doc.text(138, altura, 'CANT.EQUIVALENTE'); doc.text(172, altura, 'IMPORTE'); doc.text(190, altura, 'PESO TOTAL');*/
            doc.text(8, altura, 'CÓDIGO'); doc.text(28, altura, 'DESCRIPCIÓN DE ARTÍCULO'); doc.text(133, altura, 'CANT.VENTA'); doc.text(157, altura, 'CANT.EQUIVALENTE'); doc.text(193, altura, 'IMPORTE');   
            altura = altura + 2;
            doc.line(6, altura + 1.5, 207, altura + 1.5) // horizontal line
            altura = altura + 4;

            doc.setFontType("normal");
            doc.setFontSize(7.5);
        }

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


            ////------- cabecera del detalle del pdf -----

            //doc.line(6, altura + 1.5, 205, altura + 1.5) // horizontal line
            //altura = altura + 6;

            //doc.text(8, altura, 'CÓDIGO'); doc.text(28, altura, 'DESCRIPCIÓN DE ARTÍCULO'); doc.text(115, altura, 'CANT.VENTA'); doc.text(138, altura, 'CANT.EQUIVALENTE'); doc.text(172, altura, 'IMPORTE'); doc.text(190, altura, 'PESO TOTAL');
            //altura = altura + 2;
            //doc.line(6, altura + 1.5, 207, altura + 1.5) // horizontal line
            //altura = altura + 4;

            //doc.setFontType("normal");
            //doc.setFontSize(7.5);
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

                subTituloDetalle();
            } 

            if (idTransportista == pedidos[i].idTransportista) {

                //doc.text(6, altura, pedidos[i].codigoProducto);
                //splitTitle = doc.splitTextToSize(String(pedidos[i].descripcionProducto.trim()), 85);
                //doc.text(24, altura, splitTitle);
                //doc.writeText(123, altura, auxiliarServices.formatearNumero(pedidos[i].cantidadVenta, 2), { align: 'right', width: 8 });
                //doc.writeText(155, altura, pedidos[i].cantidadEquivalente, { align: 'right', width: 8 });
                //doc.writeText(175, altura, auxiliarServices.formatearNumero(pedidos[i].importe, 2), { align: 'right', width: 8 });
                //doc.writeText(195, altura, auxiliarServices.formatearNumero(pedidos[i].pesoTotal, 2), { align: 'right', width: 8 });


                doc.text(6, altura, pedidos[i].codigoProducto);
                splitTitle = doc.splitTextToSize(String(pedidos[i].descripcionProducto.trim()), 100);
                doc.text(24, altura, splitTitle);
                doc.writeText(140, altura, auxiliarServices.formatearNumero(pedidos[i].cantidadVenta, 2), { align: 'right', width: 8 });
                doc.writeText(155, altura, pedidos[i].cantidadEquivalente, { align: 'left', width: 8 });
                doc.writeText(197, altura, auxiliarServices.formatearNumero(pedidos[i].importe, 2), { align: 'right', width: 8 });
 


                espacio = 0;
                espacio = (splitTitle.length == 1) ? 4.5 : 8; 

                altura = altura + espacio;

                if (altura >= 268) {
                    //--Paginacion
                    nroPag = nroPag + 1;
                    doc.addPage();
                    altura = 18;
                    cabeceraReporte(nroPag);

                    subTituloDetalle();
                }

                //footer del Reporte
                if (i == pedidos.length - 1) {

                    altura = altura + 10;

                    if (altura >= 268) {
                        doc.addPage();
                        altura = 18;
                    }

                    doc.setFontType("bold");
                    //doc.text(20, altura, 'TOTAL TRANSPORTISTA');
                    //doc.text(110, altura, 'IMPORTE');
                    //doc.text(160, altura, 'PESO');
                    //doc.writeText(70, altura, auxiliarServices.formatearNumero(totalRegistro, 2) , { align: 'right', width: 8 });
                    //doc.writeText(140, altura, auxiliarServices.formatearNumero(totalImporte, 2) , { align: 'right', width: 8 });
                    //doc.writeText(190, altura, auxiliarServices.formatearNumero(totalPeso, 2), { align: 'right', width: 8 });

                    doc.text(50, altura, 'TOTAL TRANSPORTISTA');
                    doc.text(160, altura, 'IMPORTE');
       
                    doc.writeText(100, altura, auxiliarServices.formatearNumero(totalRegistro, 2), { align: 'right', width: 8 });
                    doc.writeText(197, altura, auxiliarServices.formatearNumero(totalImporte, 2), { align: 'right', width: 8 });
 
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
    
    $scope.reporteLiquidacionTransportista = function () {

        if ($scope.Objeto_ParametroFiltro.id_zona == '0' || $scope.Objeto_ParametroFiltro.id_zona == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor selecciona la Zona', 'error', '#ff6849', 1500);
            return false;
        }

        const fechaIni = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fechaIni);
        const fechaFin = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fechaFin);

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Generar el archivo PDF',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderFiltro = true;
                ConsolidadoServices.get_generarLiquidacionTransportista_pdf(fechaIni, fechaFin, $scope.Objeto_ParametroFiltro.id_zona, $scope.Objeto_ParametroFiltro.id_transportista, auxiliarServices.getUserId(), $scope.Objeto_ParametroFiltro.id_vendedor ).then(function (res) {
                    $scope.loaderFiltro = false;
                    console.log(res);
                    if (res.ok == true) {

                        if (res.data.length > 0) {
                            $scope.generarPDF_liquidacionTransportista(res.data, fechaIni, fechaFin);
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
    
    $scope.generarPDF_liquidacionTransportista = function (pedidos, fechaIni, fechaFin, resumenPedidos) {

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
            doc.text(50, altura, pedidos[0].tituloReporte);
            altura = altura + 6;
            doc.setFontType("normal");
            doc.setFontType("bold");
            doc.setFontSize(7);
            doc.text(75, altura, pedidos[0].subTituloReporte1);
            altura = altura + 4;
            doc.text(75, altura, pedidos[0].subTituloReporte2);
            altura = altura + 4;
            doc.text(75, altura, pedidos[0].subTituloReporte3);
            altura = altura + 8;
            //------- fin de cabecera del pdf -----


            //------- cabecera del detalle del pdf -----
            doc.setFontSize(9);
            doc.text(8, altura, pedidos[0].transportista);
            doc.setFontSize(7);
            altura = altura + 2;

            doc.line(4, altura + 1.5, 205, altura + 1.5) // horizontal line
            altura = altura + 6;

            doc.text(6, altura, 'T.DOC.DOCTO'); doc.text(28, altura, 'CODCLIENTE'); doc.text(50, altura, 'NOMBRE / RAZON SOCIAL');
            doc.text(103, altura, 'P.VENTA'); doc.text(118, altura, 'F.PAGO'); doc.text(130, altura, 'PROD'); doc.text(139, altura, 'CONTADO');
            doc.text(151, altura, 'CREDIT'); doc.text(163, altura, 'DEVOL.'); doc.text(176, altura, 'OBSERV.'); doc.text(200, altura, 'DEUDA.'); 
            altura = altura + 2;
            doc.line(4, altura + 1.5, 207, altura + 1.5) // horizontal line
            altura = altura + 4;

            doc.setFontType("normal");
            doc.setFontSize(7);
        }
        cabeceraReporte(nroPag);

        let idVendedor = 0
        let splitTitle = '';
        let splitTitle2 = '';
        let espacio = 0;

        let totalRegistro = 0;
        let totalImporte = 0;
        let totalPeso = 0;

        //-----  calculo de totales 
        //totalRegistro = pedidos.length;
        //pedidos.forEach(pedido => {
        //    totalImporte += (!pedido.importe) ? 0 : parseFloat(pedido.importe);
        //    totalPeso += (!pedido.pesoTotal) ? 0 : parseFloat(pedido.pesoTotal);
        //})
 
        for (var i = 0; i < pedidos.length; i++) {

            if (idVendedor != pedidos[i].idVendedor) {

                idVendedor = pedidos[i].idVendedor;

                doc.setFontSize(8.5);
                doc.setFontType("bold");
                altura = altura + 2;
                doc.line(4, altura - 4.2, 100, altura - 4.2) // horizontal line
                doc.text(8, altura, 'VENDEDOR : ' + pedidos[i].vendedor)
                doc.line(4, altura + 1.5, 100, altura + 1.5) // horizontal line
                doc.setFontType("normal");
                doc.setFontSize(7);

                altura = altura + 6;
            }

            if (idVendedor == pedidos[i].idVendedor) {

                doc.text(4, altura, pedidos[i].TipoNroDoc);
                doc.text(32, altura, pedidos[i].codigoCliente);

                splitTitle = doc.splitTextToSize(String(pedidos[i].nombreRazonSocial.trim()), 58);
                doc.text(48, altura, splitTitle);

                doc.writeText(105, altura, auxiliarServices.formatearNumero(pedidos[i].precioVenta, 2), { align: 'right', width: 8 });
                doc.text(116, altura, pedidos[i].formaPago);

                doc.writeText(129, altura,  String(pedidos[i].cantProducto), { align: 'right', width: 8 });

                doc.text(142, altura, String(pedidos[i].contado));
                doc.text(152, altura, String(pedidos[i].credito));
                doc.text(162, altura, String(pedidos[i].devolucion));

                splitTitle2 = doc.splitTextToSize(String(pedidos[i].observacion.trim()), 20);
                doc.text(173, altura, splitTitle2); 

                console.log(splitTitle2.length)
 
                doc.writeText(200, altura, auxiliarServices.formatearNumero(pedidos[i].deuda, 2), { align: 'right', width: 8 });

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
                //if (i == pedidos.length - 1) {

                //    altura = altura + 10;

                //    if (altura >= 268) {
                //        doc.addPage();
                //        altura = 18;
                //    }

                //    doc.setFontType("bold");
                //    doc.text(20, altura, 'TOTAL TRANSPORTISTA'); doc.text(110, altura, 'IMPORTE'); doc.text(160, altura, 'PESO');
                //    doc.writeText(70, altura, auxiliarServices.formatearNumero(totalRegistro, 2), { align: 'right', width: 8 });
                //    doc.writeText(140, altura, auxiliarServices.formatearNumero(totalImporte, 2), { align: 'right', width: 8 });
                //    doc.writeText(190, altura, auxiliarServices.formatearNumero(totalPeso, 2), { align: 'right', width: 8 });
                //    altura = altura + 10;

                //    nroPag = nroPag + 1;
                //    doc.addPage();
                //    altura = 18;
 
                //}
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

            doc.save(ale+'.pdf');
            var blob = doc.output("blob");
            var blobURL = URL.createObjectURL(blob);
            var downloadLink = document.getElementById('pdf-download-link');
            downloadLink.href = blobURL;
        }, 0);


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

    $scope.reportePlanillaCobranza = function () {

        if ($scope.Objeto_ParametroFiltro.id_zona == '0' || $scope.Objeto_ParametroFiltro.id_zona == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor selecciona la Zona', 'error', '#ff6849', 1500);
            return false;
        }
        
        //const fechaIni = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fechaIni);
        //const fechaFin = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fechaFin);
        const fechaIni =  $scope.Objeto_ParametroFiltro.fechaIni;
        const fechaFin =  $scope.Objeto_ParametroFiltro.fechaFin;

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Generar la Planilla de Cobranza en PDF',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderFiltro = true;
                ConsolidadoServices.get_generarPlanillaCobranza_pdf(fechaIni, fechaFin, $scope.Objeto_ParametroFiltro.id_zona, $scope.Objeto_ParametroFiltro.id_transportista, auxiliarServices.getUserId(), $scope.Objeto_ParametroFiltro.id_vendedor).then(function (res) {
                    $scope.loaderFiltro = false;

                    console.log(res);
                    if (res.ok == true) {

                        if (res.data.length > 0) {
                            $scope.generarPDF_planillaCobranza(res.data, fechaIni, fechaFin );
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

    $scope.generarPDF_planillaCobranza = function (pedidos ) {

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


    $scope.generarConsolidado_guiaRemisionSunat = function ( ) {

        if ($scope.Objeto_ParametroFiltro.id_zona == '0' || $scope.Objeto_ParametroFiltro.id_zona == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor selecciona la Zona', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_ParametroFiltro.id_transportista == '0' || $scope.Objeto_ParametroFiltro.id_transportista == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor selecciona un transportista', 'error', '#ff6849', 1500);
            return false;
        }

        const fechaIni = $scope.Objeto_ParametroFiltro.fechaIni;
        const fechaFin = $scope.Objeto_ParametroFiltro.fechaFin;

        ////const idGuia = 687;
        ////$scope.get_guiaRemisionImpresion(idGuia);

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Generar la guía de Remisión Electrónica',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loader_modal = true;
                ConsolidadoServices.get_generarConsolidado_envio_guiaRemisionSunat(fechaIni, fechaFin, $scope.Objeto_ParametroFiltro.id_zona, $scope.Objeto_ParametroFiltro.id_transportista, auxiliarServices.getUserId())
                    .then(function (res) {
                        $scope.loader_modal = false;
                        if (res.ok == true) {

                            const idGuia = res.data;
                            $scope.get_guiaRemisionImpresion(idGuia);
 
                        } else {
                            $scope.loader_modal = false;
                            alert(JSON.stringify(res.data));
                        }
                    }, function (err) {
                        $scope.loader_modal = false;
                        alert(JSON.stringify(err));
                    });
            }
        });
    }

    $scope.get_guiaRemisionImpresion = function (idGuia) {
        $scope.loader_modal = true;
        ConsolidadoServices.get_guiaRemisionSunat_impresion(idGuia)
            .then(function (res) {
                $scope.loader_modal = false;

                if (res.ok == true) {

                    if (res.data.length == 0) {
                        auxiliarServices.NotificationMessage('Sistemas', 'No hay informacion para generar la impresion de la Guia de Remision', 'error', '#ff6849', 1500);
                        return;
                    }

                    //---- no se pueden imprimir documentos que no se hallan enviado correctamente a la sunat
                    if (res.data[0].guia_electronica_pdf == null || res.data[0].guia_electronica_pdf == undefined || res.data[0].guia_electronica_pdf == '') {
                        alert(`Hubo un error en el envio de la Guia  a la sunat  idGuia ${idGuia}  : ${res.data[0].guia_electronica_alertas}`);
                        return;
                    }

                    $scope.pdf_facturacionElectronica_GuiaRemision(res.data);
                } else {
                    $scope.loader_modal = false;
                    alert(JSON.stringify(res.data));
                }
            }, function (err) {
                $scope.loader_modal = false;
                alert(JSON.stringify(err));
            });
    }
    
    $scope.pdf_facturacionElectronica_GuiaRemision = function (listGuia) {

        var doc = new jsPDF();
        var altura = 20;
        var splitTitle = "";
        let anchoRect = 0;
        let largRect = 0;

        var imgData = 'data:image/png;base64,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'
        doc.addImage(imgData, 'JPEG', 6, 2, 30, 15)

        doc.setFont("courier");
        //doc.setFontType("bold");
        doc.setFontSize(7);

        splitTitle = doc.splitTextToSize(String(listGuia[0].establecimiento).trim(), 95);
        if (splitTitle.length >= 2) {
            altura += (splitTitle.length * 2)
        }
        doc.text(6, altura, splitTitle);

        altura += 4

        splitTitle = '';
        splitTitle = doc.splitTextToSize(String(listGuia[0].domicilioFiscal).trim(), 95);
        if (splitTitle.length >= 2) {
            altura += (splitTitle.length * 2)
        }
        doc.text(6, altura, splitTitle);
        altura += 9

        anchoRect = 100;
        largRect = 7;
        doc.roundedRect(4, 37, anchoRect, largRect, 3, 3)
        doc.text(6, altura, 'Fecha Emision : ' + String(listGuia[0].fechaEmision)); doc.text(50, altura, 'Fecha Inicio Traslado : ' + String(listGuia[0].fechaInicioTraslado));

        altura += 10

        doc.setFontSize(20);
        doc.setFontType("bold");

        anchoRect = 95;
        largRect = 40;

        doc.roundedRect(110, 4, anchoRect, largRect, 3, 3)
        doc.text(122, 13, String(listGuia[0].ruc));

        doc.setFontSize(11);
        doc.setFillColor(197, 191, 191)
        doc.roundedRect(110, 18, anchoRect, 11, 1, 1, 'F')

        doc.text(114, 25, String(listGuia[0].comprobante));
        doc.setFontSize(20);
        doc.text(134, 38, String(listGuia[0].nroComprobante));

        doc.setFontSize(8);
        doc.setFontType("normal");

        //---- lado IZQUIERDO -- -----
        anchoRect = 100;
        largRect = 6;
        doc.setFillColor(197, 191, 191)
        doc.roundedRect(4, altura - 4, anchoRect, largRect, 1, 1, 'FD')
        doc.setFontType("bold");
        doc.text(35, altura, 'DOMICILIO DE PARTIDA');
        doc.setFontType("normal");
        doc.roundedRect(4, altura + 2, anchoRect, largRect + 5, 1, 1)
        altura += 5

        splitTitle = '';
        splitTitle = doc.splitTextToSize(String(listGuia[0].direccionPartida).trim(), 95);
        if (splitTitle.length >= 2) {
            //altura += 1
        }
        doc.text(6, altura, splitTitle);
        altura += 6

        ///--- - lado DERECHO ----

        altura = 51

        anchoRect = 100;
        largRect = 6;
        doc.setFillColor(197, 191, 191)
        doc.roundedRect(105, altura - 4, anchoRect, largRect, 1, 1, 'FD')
        doc.setFontType("bold");
        doc.text(135, altura, 'DOMICILIO DE LLEGADA');
        doc.setFontType("normal");
        doc.roundedRect(105, altura + 2, anchoRect, largRect + 5, 1, 1)
        altura += 5

        splitTitle = '';
        splitTitle = doc.splitTextToSize(String(listGuia[0].direccionLlegada).trim(), 95);
        if (splitTitle.length >= 2) {
            //altura += 1
        }
        doc.text(107, altura, splitTitle);
        altura += 12


        //---- lado IZQUIERDO DESTINATARIO  -----

        altura = 70

        anchoRect = 100;
        largRect = 6;
        doc.setFillColor(197, 191, 191)
        doc.roundedRect(4, altura - 4, anchoRect, largRect, 1, 1, 'FD')
        doc.setFontType("bold");
        doc.text(45, altura, 'DESTINATARIO');
        doc.setFontType("normal");
        doc.roundedRect(4, altura + 2, anchoRect, largRect + 9, 1, 1)
        altura += 5

        splitTitle = '';
        splitTitle = doc.splitTextToSize(String(listGuia[0].razonSocialDestinatario).trim(), 95);


        if (splitTitle.length == 1) {
            doc.text(6, altura + 2, splitTitle);
            altura += 6
        }
        if (splitTitle.length >= 2) {
            doc.text(6, altura, splitTitle);
            altura += 6
        }
        altura += 3
        doc.text(6, altura, String(listGuia[0].rucDestinatario)); doc.text(48, altura, String(listGuia[0].nroOCDestinatario));


        //---- lado DERECHO DESTINATARIO  -----

        altura = 70
        anchoRect = 100;
        largRect = 6;

        doc.setFillColor(197, 191, 191)
        doc.roundedRect(105, altura - 4, anchoRect, largRect, 1, 1, 'FD')
        doc.setFontType("bold");
        doc.text(115, altura, 'UNIDAD DE TRANSPORTE / CONDUCTOR');
        doc.setFontType("normal");
        doc.roundedRect(105, altura + 2, anchoRect, largRect + 9, 1, 1)
        altura += 6
        doc.text(107, altura, String(listGuia[0].marcaNroPlaca).trim());
        altura += 4
        doc.text(107, altura, String(listGuia[0].nroConstInscripcion).trim());
        altura += 4
        doc.text(107, altura, String(listGuia[0].nroLicenciaConducir).trim());


        ///----- DETALLES DE LA GUIA ----- 

        altura = 95

        anchoRect = 200;
        largRect = 6;
        doc.setFillColor(197, 191, 191)
        doc.roundedRect(4, altura - 4, anchoRect, largRect, 1, 1, 'FD')
        doc.setFontType("bold");
        doc.text(10, altura, 'CANTIDAD'); doc.text(28, altura, 'UND.MED.'); doc.text(90, altura, 'DESCRIPCION'); doc.text(190, altura, 'PESO');
        doc.setFontType("normal");
        doc.roundedRect(4, altura + 2, anchoRect, largRect + 138, 1, 1)
        altura += 6

        for (item of listGuia) {
            doc.writeText(13, altura, auxiliarServices.formatearNumero(String(item.cantidad).trim(), 2), { align: 'right', width: 10 });
            doc.text(31, altura, String(item.unidadMedida).trim());
            doc.text(43, altura, String(item.descripcion).trim());
            doc.text(196, altura, String(item.peso).trim());
            altura += 1
            doc.line(6, altura + 1, 203, altura + 1) // horizontal line
            altura += 5
        }




        ///----- FIN DE DETALLES DE LA GUIA ----- 





        //---- FOOTER lado IZQUIERDO -- -----

        altura = 250;

        doc.setFontSize(7);
        anchoRect = 65;
        largRect = 6;

        doc.setFillColor(197, 191, 191)
        doc.roundedRect(4, altura - 4, anchoRect, largRect, 1, 1, 'FD')
        doc.setFontType("bold");
        doc.text(23, altura, 'TRANSPORTISTA');
        doc.setFontType("normal");
        doc.roundedRect(4, altura + 2, anchoRect, largRect + 5, 1, 1)
        altura += 5

        splitTitle = '';
        splitTitle = doc.splitTextToSize(String(listGuia[0].nombreTransportista).trim(), 60);

        if (splitTitle.length == 1) {
            doc.text(6, altura + 2, splitTitle);
            altura += 6
        }
        if (splitTitle.length >= 2) {
            doc.text(6, altura, splitTitle);
            altura += 6
        }
        doc.text(6, altura, String(listGuia[0].rucTransportista).trim());
        altura += 8


        anchoRect = 65;
        largRect = 6;

        doc.setFillColor(197, 191, 191)
        doc.roundedRect(4, altura - 4, anchoRect, largRect, 1, 1, 'FD')
        doc.setFontType("bold");
        doc.text(20, altura, 'COMPROBANTE DE PAGO');
        doc.setFontType("normal");
        doc.roundedRect(4, altura + 2, anchoRect, largRect + 4, 1, 1)
        altura += 5
        doc.text(6, altura, String(listGuia[0].tipoComprobantePago).trim());
        altura += 4
        doc.text(6, altura, String(listGuia[0].nroComprobantePago).trim());

        ///------------

        //---- FOOTER lado DERECHO -- -----

        altura = 250;
        anchoRect = 75;
        largRect = 6;

        doc.setFillColor(197, 191, 191)
        doc.roundedRect(70, altura - 4, anchoRect, largRect, 1, 1, 'FD')
        doc.setFontType("bold");
        doc.text(90, altura, 'MOTIVO DE TRASLADO');
        doc.setFontType("normal");
        doc.roundedRect(70, altura + 2, anchoRect, largRect + 35, 1, 1)
        altura += 5
        doc.text(71, altura, '1. Venta'); doc.roundedRect(140, altura - 2, 4, 3, 0, 0); doc.text(141.5, altura + 0.5, String(listGuia[0].motivoVenta).trim());
        altura += 4
        doc.text(71, altura, '2. Venta sujeta a confirmacion del comprador'); doc.roundedRect(140, altura - 2, 4, 3, 0, 0); doc.text(141.5, altura + 0.5, String(listGuia[0].motivoVentaSujeta).trim());
        altura += 4
        doc.text(71, altura, '3. Compra'); doc.roundedRect(140, altura - 2, 4, 3, 0, 0); doc.text(141.5, altura + 0.5, String(listGuia[0].compra).trim());
        altura += 4
        doc.text(71, altura, '4. Consignacion'); doc.roundedRect(140, altura - 2, 4, 3, 0, 0); doc.text(141.5, altura + 0.5, String(listGuia[0].consignacion).trim());
        altura += 4
        doc.text(71, altura, '5. Devolucion'); doc.roundedRect(140, altura - 2, 4, 3, 0, 0); doc.text(141.5, altura + 0.5, String(listGuia[0].devolucion).trim());
        altura += 4
        doc.text(71, altura, '6. Traslado entre establecimientos de una ');
        altura += 3
        doc.text(75, altura, ' misma empresa '); doc.roundedRect(140, altura - 4, 4, 4, 0, 0); doc.text(141.5, altura - 1, String(listGuia[0].trasladoEstablecimientos).trim());
        altura += 4
        doc.text(71, altura, '7. Traslado de bienes para transformacion'); doc.roundedRect(140, altura - 2, 4, 3, 0, 0); doc.text(141.5, altura + 0.5, String(listGuia[0].trasladoBienes).trim());
        altura += 4
        doc.text(71, altura, '8. Recojo de bienes'); doc.roundedRect(140, altura - 2, 4, 3, 0, 0); doc.text(141.5, altura + 0.5, String(listGuia[0].recojobienes).trim());
        altura += 4
        doc.text(71, altura, '9. Otros : '); doc.text(87, altura, String(listGuia[0].otros).trim());

        altura = 250;
        anchoRect = 60;
        largRect = 6;





        doc.roundedRect(146, altura - 4, anchoRect, largRect + 30, 1, 1)

        doc.text(146, altura + 12, '________________________________________');
        doc.text(158, altura + 16, 'Conformidad del Cliente');

        doc.setFontType("bold");
        doc.setFontSize(10);
        doc.text(157, altura + 30, 'CORPORACION BELCEN');
        doc.roundedRect(146, altura + 26, anchoRect, largRect, 1, 1)


        var string = doc.output('datauristring');
        var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
        var x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();




    }


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
           
})
