var app = angular.module('appGestion.KardexAlmacenController', []);
app.controller('ctrlKardex', function ($scope, transferenciasNewServices , $location, $timeout, productosServices, auxiliarServices, StockServices, AlmacenServices, LocalesServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        auxiliarServices.changeTitle("Reporte de Kardex");
        $scope.titleModal = "Reporte de Kardex";
        $scope.loaderSave = false;

        $timeout(function () {
            $(".selectFiltros").select2();
        }, 0);

        $scope.get_ListandoLocales();
    };

    $('document').ready(function () {
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy'
            });
        }, 500);
    });
    $scope.listTipoReporte = [
        { id: 1, des: 'Kardex por Unidades' },
        { id: 2, des: 'Kardex Valorizado' }
    ];

    $scope.Objeto_ParametroFiltro = {
        tipo: '1',
        local: '0',
        almacen: '0',
        fecha: auxiliarServices.getDateNow(),
        fecha_fin: auxiliarServices.getDateNow(),
        idMaterial: '0'
    };

    $timeout(function () {
        $('#cbo_tipo').val("1").trigger('change.select2');
    });

    $scope.Lista_Locales = [];
    $scope.get_ListandoLocales = function () {
        $scope.loaderSave = true;
        LocalesServices.get_Locales_Usuario(auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderSave = false;
                $scope.Lista_Locales = [];
                $scope.Lista_Locales = data;
                setTimeout(function () {
                    $('#cbo_local').val("0").trigger('change.select2');
                    $('#cbo_almacen').val("0").trigger('change.select2');
                }, 500);
            }, function (err) {
                console.log(err);
            });
    };

    $scope.Lista_Almacenes = [];
    $scope.get_ListandoAlmacenes = function (id_local) {
        $scope.loaderSave = true;
        AlmacenServices.getAlmacenesLocal(id_local)
            .then(function (data) {
                $scope.Lista_Almacenes = [];
                $scope.Lista_Almacenes = data;
                $scope.Objeto_ParametroFiltro.almacen = '0';
                $scope.loaderSave = false;
                setTimeout(function () {
                    $scope.loaderSave = false;
                    $('#cbo_almacen').val("0").trigger('change.select2');

                }, 800);
            }, function (err) {
                console.log(err);
            });
    };

    $scope.change_LocalesAlmacen = function () {
        var id_local = $scope.Objeto_ParametroFiltro.local;
        $scope.get_ListandoAlmacenes(id_local);
    };

    $scope.objSaveGuiasDet = {
        id_Producto: '0',
        nombre_Producto: '',
        codigo1_Producto: '',
        descripcion_unidadMedida : ''
    };
    //$scope.getProductoByFilter = function () {
    //    $scope.loaderProducto = true;
    //    $scope.disabledProducto = "disabledContent";
    //    var params = {
    //        filter: $scope.objSaveGuiasDet.codigo1_Producto
    //    };
    //    console.log(params);
    //    productosServices.getProductosByFilter(params).then(function (res) {

    //        if (res.length === 0) {
    //            $scope.objSaveGuiasDet.id_Producto = 0;
    //            $scope.objSaveGuiasDet.nombre_Producto = "";
    //            $scope.objSaveGuiasDet.abreviatura_Producto = "";
    //            $scope.Objeto_ParametroFiltro.idMaterial = 0;
    //            $scope.objSaveGuiasDet.descripcion_unidadMedida = "";
    //            $scope.textError = "No se encuentra codigo de producto.";
    //        } else {
    //            $scope.objSaveGuiasDet.id_Producto = res[0].id_Producto;
    //            $scope.objSaveGuiasDet.nombre_Producto = res[0].nombre_Producto;
    //            $scope.Objeto_ParametroFiltro.idMaterial = res[0].id_Producto;
    //            $scope.objSaveGuiasDet.descripcion_unidadMedida = res[0].nombre_UnidadMedida;
    //        }
    //        $scope.disabledProducto = "";
    //        $scope.loaderProducto = false;

    //    }, function (err) {
    //        console.log(err);
    //    });
    //};

    $scope.change_tipoReporte = function (opcion) {
        console.log($scope.Objeto_ParametroFiltro.tipo);
        $scope.listKardex = [];
    };

    var getDateAnterior = function (today) {

        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = dd + '/' + mm + '/' + yyyy;
        return today;
    }

    var saldoInicial = 1;
    $scope.saldoInicialR = 0;
    $scope.GenerarReporte = function (value) {

        var fechaActual = $('#txtFechaEmision').val();
        fechaActual = fechaActual.split('/');
        fechaActual = fechaActual[2] + '-' + fechaActual[1] + '-' + fechaActual[0];

        let hoy = new Date(fechaActual);

        let undia = 1000 * 60 * 24
        let resta = hoy.getTime() - undia;
        let fechaanterior = new Date(resta);
        $scope.fechaAcnterior = getDateAnterior(fechaanterior);

        saldoInicial = 0;
        if (StockServices.validate_new($scope.Objeto_ParametroFiltro) === false) {
            return;
        }
        $scope.loaderSave = true;
        //$scope.Objeto_ParametroFiltro.fecha_aux = '';
        //$scope.Objeto_ParametroFiltro.fecha_aux = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fecha);

        StockServices.getKardexReporte_new($scope.Objeto_ParametroFiltro)
            .then(function (data) {
                console.log('getKardexReporte_new')
                console.log(data)

                $scope.loaderSave = false;
                $scope.listKardex = data;                
                $scope.saldoInicialR = $scope.listKardex[0].saldoinicial.length == 0 ? 0 : $scope.listKardex[0].saldoinicial;
                data.forEach(function (item, index) {
                    var nroDoc = item.nrodoc.split('-');

                    item['serie'] = nroDoc[0];
                    item['nrodoc'] = nroDoc[1];

                    if ($scope.Objeto_ParametroFiltro.tipo == 1 || $scope.Objeto_ParametroFiltro.tipo == '1') {  //// unidades
                        if (item.tipo == 'I') {
                            item['I_cantidad'] = parseFloat(item.cantidad).toFixed(2);
                            item['I_precio'] = parseFloat(item.precio).toFixed(2);
                            item['I_costo_total'] = 0;
                            saldoInicial = parseFloat(saldoInicial) + parseFloat(item.cantidad);
                            item['cantidad_final'] = (parseFloat($scope.saldoInicialR) + parseFloat(saldoInicial.toFixed(2))).toFixed(2);

                        } else if (item.tipo == 'S') {
                            item['S_cantidad'] = parseFloat(item.cantidad).toFixed(2);
                            item['S_precio'] = parseFloat(item.precio).toFixed(2);
                            item['S_costo_total'] = 0;
                            saldoInicial = parseFloat(saldoInicial) - parseFloat(item.cantidad);
                            item['cantidad_final'] = (parseFloat($scope.saldoInicialR) + parseFloat(saldoInicial.toFixed(2))).toFixed(2);

                        }
                    } else {   //// valorizado

                        if (item.tipo == 'I') {

                            item['I_cantidad'] = parseFloat(item.cantidad).toFixed(2);
                            item['I_precio'] = parseFloat(item.precio).toFixed(2);
                            item['I_costo_total'] = parseFloat(item.costoTotal).toFixed(2);
                            saldoInicial = parseFloat(saldoInicial) + parseFloat(item.cantidad);
                            item['cantidad_final'] = parseFloat($scope.saldoInicialR) + parseFloat(saldoInicial.toFixed(2));
                        } else if (item.tipo == 'S') {
                            item['S_cantidad'] = parseFloat(item.cantidad).toFixed(2);
                            item['S_precio'] = parseFloat(item.precio).toFixed(2);
                            item['S_costo_total'] = parseFloat(item.costoTotal).toFixed(2);
                            saldoInicial = parseFloat(saldoInicial) - parseFloat(item.cantidad);
                            item['cantidad_final'] = parseFloat($scope.saldoInicialR) + parseFloat(saldoInicial.toFixed(2));
                        }
                    }

                });

                $scope.saldoFinalR = $scope.listKardex[$scope.listKardex.length - 1].cantidad_final;

            }, function (err) {
                $scope.loaderSave = false;
                console.log(err);
            });
    };


    $scope.GenerarReporteValorizado = function () {
        $scope.loaderSave = true;
       StockServices.getKardexReporte_todo($scope.Objeto_ParametroFiltro )
            .then(function (data) {
                $scope.loaderSave = false;
                var result = data.split('|');
                if (result[0] == 0) {

                } else if (result[0] == 1) {
                    var link = document.createElement("a");
                    link.download = "kardex";
                    link.href = result[1];
                    link.click();
                }
            }, function (err) {
                $scope.loaderSave = false;
                console.log(err);
            });
    };

    $scope.GenerarReporteValorizado_Todo = function () {
        $scope.loaderSave = true;
        StockServices.get_ReporteValorizado_Todo($scope.Objeto_ParametroFiltro)
            .then(function (data) {

                console.log(data)
                $scope.loaderSave = false;
                var result = data.split('|');
                if (result[0] == 0) {

                } else if (result[0] == 1) {
                    var link = document.createElement("a");
                    link.download = "kardexTodo";
                    link.href = result[1];
                    link.click();
                }
            }, function (err) {
                $scope.loaderSave = false;
                console.log(err);
            });
    };

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $timeout(function () {
            auxiliarServices.initFooTable('tblReport', 'inputSearch');
            // $scope.ExportarToExcel();
        }, 100);
    });

    $scope.ExportarToExcel = function (value) {        // CAPTURAMOS EL TIPO DE TRANSACCIÓN PARA GENERAR LA CABECERA AL REPORTE

        var Cabecera = "REPORTE KARDEX";
        /*if ($scope.Objeto_ParametroFiltro.tipo === 1) {
            Cabecera = "KARDEX GENERAL";
        }
        else if ($scope.Objeto_ParametroFiltro.tipo === 2) {
            Cabecera = "STOCK POR LOCAL";
        }
        else if ($scope.Objeto_ParametroFiltro.tipo === 3) {
            Cabecera = "STOCK POR ALMACEN";
        }*/


        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html lang="es"  xmlns:o="urn:schemas-microsoft-com:office:office"' +
                'xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
                '<head>' +
                '<meta charset="utf-8">' +
                '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Reporte</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
                '<style>' +
                ' .labelProducto {background-color:beige !important  }' +
                ' table, td, th {' +
                ' border: 1px solid rgba(0, 0, 0, 0.11);' +
                ' }' +
                ' th {' +
                'background-color: #4CAF50;' +
                'color: white;' +
                ' }' +
                ' </style> </head>' +
                '<body>' +
                '<h2  style="text-align:center;">' + Cabecera + '</h2>' +
                ' <p  style="text-align:center; font-size: 15px;">Fecha : ' + $scope.Objeto_ParametroFiltro.fecha + ' </p>' +
                ' <p class= "labelProducto"  style="text-align:center; font-size: 17px; background-color:beige !important">' + $scope.objSaveGuiasDet.codigo1_Producto + ' : ' + $scope.objSaveGuiasDet.nombre_Producto + ' </p>' +
                '<table>{table}</table>' +
                '</body>' +
                '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); };

        format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; });
        };
        var table;
     
        if (value == 1) {
            if ($scope.Objeto_ParametroFiltro.tipo == 1) {
                table = $('#tblReport222');
                ctx = { worksheet: 'descar123', table: table.html() };
                

            } else {
                table = $('#tblReport111');
                ctx = { worksheet: 'descar123', table: table.html() };
            }
        } /*else {

            table = $('#tblReportTodo');
            ctx = { worksheet: 'descar123', table: table.html() };

        }*/

        console.log(table);
        var link = document.createElement("a");
        link.download = "ReporteKardex.xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
        $scope.loaderSave = false;

    };

    function Pdf_ReporteStock(items, fecha, TipoReporte) {
        var TituloReporte = '';
        var Posic_Titulo = '';

        if ($scope.Objeto_ParametroFiltro.tipo === 1) {
            TituloReporte = "STOCK GENERAL";
        }
        else if ($scope.Objeto_ParametroFiltro.tipo === 2) {
            TituloReporte = "STOCK POR LOCAL";
        }
        else if ($scope.Objeto_ParametroFiltro.tipo === 3) {
            TituloReporte = "STOCK POR ALMACEN";
        }

        var doc = new jsPDF('l', 'pt');


        var ColumnasReporte = getColumnsReporteStock(TipoReporte);

        var header = function (data) {
            doc.setFontSize(8);
            doc.setFont("helvetica");
            doc.setTextColor(40);
            doc.text(40, 27, 'Corporación Belcen E.I.R.L.');
            doc.setTextColor(0);
            doc.setFontSize(8);
            doc.text(760, 27, getDateHoyR());
            doc.text(753, 35, Hora_Reporte());
            doc.setFontSize(18);
            if ($scope.Objeto_ParametroFiltro.tipo === 1) {
                TituloReporte = "STOCK GENERAL";
            }
            else if ($scope.Objeto_ParametroFiltro.tipo === 2) {
                TituloReporte = "STOCK POR LOCAL";
            }
            else if ($scope.Objeto_ParametroFiltro.tipo === 3) {
                TituloReporte = "STOCK POR ALMACEN";
            }
            doc.text(320, 53, TituloReporte);
            doc.setFontSize(8);
            doc.setFontType("normal");
            doc.text(350, 73, 'A LA FECHA:'); doc.text(410, 73, String(fecha));

        };

        //Titulo inicial del documento
        doc.setProperties({
            title: TituloReporte
        });

        var totalPagesExp = "{total_pages_count_string}";
        var footer = function (data) {
            var str = "Pag. " + data.pageCount;
            if (typeof doc.putTotalPages === 'function') {
                str = str + " de " + totalPagesExp;
            }
            doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 20);
        };

        doc.autoTable(ColumnasReporte, items, {
            startY: 78,
            margin: { horizontal: 10 },
            styles: { cellPadding: 2 },
            theme: 'grid',
            headerStyles: {
                rowHeight: 15,
                fontSize: 8
            },
            bodyStyles: {
                rowHeight: 12,
                fontSize: 8,
                valign: 'middle'
            },
            columnStyles: { text: { columnWidth: 200 } },
            beforePageContent: header,
            afterPageContent: footer,
            margin: { top: 80 },
            createdCell: function (cell, data) {
                if (data.column.dataKey === 'ingresos' || data.column.dataKey === 'salidas' || data.column.dataKey === 'stock') {
                    cell.styles.halign = 'right';
                }
            }
        });

        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }

        doc.output('dataurlnewwindow');
        doc.output('save', 'Kardex.pdf');
    }

    var getColumnsReporteStock = function (TipoReporte) {
        var Columnas;
        // por stock almacen
        if (TipoReporte === 1) {
            if ($scope.Objeto_ParametroFiltro.tipo === 1) {
                Columnas = [
                    { title: "CODIGO", dataKey: "codigo" },
                    { title: "DESCRIPCION", dataKey: "descripcion" },
                    { title: "RUBRO", dataKey: "rubro" },
                    { title: "U.M", dataKey: "um" },
                    { title: "INGRESOS", dataKey: "ingresos" },
                    { title: "SALIDAS", dataKey: "salidas" },
                    { title: "STOCK", dataKey: "stock" }
                ];
            } else if ($scope.Objeto_ParametroFiltro.tipo === 2) {
                Columnas = [
                    { title: "LOCAL", dataKey: "local" },
                    { title: "CODIGO", dataKey: "codigo" },
                    { title: "DESCRIPCION", dataKey: "descripcion" },
                    { title: "RUBRO", dataKey: "rubro" },
                    { title: "U.M", dataKey: "um" },
                    { title: "INGRESOS", dataKey: "ingresos" },
                    { title: "SALIDAS", dataKey: "salidas" },
                    { title: "STOCK", dataKey: "stock" }
                ];
            } else if ($scope.Objeto_ParametroFiltro.tipo === 3) {
                Columnas = [
                    { title: "ALMACEN", dataKey: "almacen" },
                    { title: "CODIGO", dataKey: "codigo" },
                    { title: "DESCRIPCION", dataKey: "descripcion" },
                    { title: "RUBRO", dataKey: "rubro" },
                    { title: "U.M", dataKey: "um" },
                    { title: "INGRESOS", dataKey: "ingresos" },
                    { title: "SALIDAS", dataKey: "salidas" },
                    { title: "STOCK", dataKey: "stock" }
                ];
            }

        }
        return Columnas;
    };

    function Hora_Reporte() {
        var Formato_hora;
        marcacion = new Date();
        Hora = marcacion.getHours();
        Minutos = marcacion.getMinutes();
        Segundos = marcacion.getSeconds();

        dn = "a.m";
        if (Hora > 12) {
            dn = "p.m";
            Hora = Hora - 12;
        }
        if (Hora === 0)
            Hora = 12;
        /* Si la Hora, los Minutos o los Segundos son Menores o igual a 9, le añadimos un 0 */
        if (Hora <= 9) Hora = "0" + Hora;
        if (Minutos <= 9) Minutos = "0" + Minutos;
        if (Segundos <= 9) Segundos = "0" + Segundos;

        /* En Reloj le indicamos la Hora, los Minutos y los Segundos */
        Formato_hora = Hora + ":" + Minutos + ":" + Segundos + " " + dn;

        return Formato_hora;
    }

    function getDateHoyR() {
        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1; //hoy es 0!
        var yyyy = hoy.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }
        hoy = dd + '/' + mm + '/' + yyyy;

        return hoy;
    }

    $scope.change_todosProductos = function (valor) {
        if (valor == true) {
            $('#btn_visualizar').attr("disabled", true);
        } else {
            $('#btn_visualizar').attr("disabled", false);
        }
    }

    $scope.Open_New_Modal_AyudaProducto = function () {

        //if ($scope.Objeto_ParametroFiltro.local == '0' || $scope.Objeto_ParametroFiltro.local == 0) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Local', 'error', '#ff6849', 1500);
        //    return;
        //}
        //if ($scope.Objeto_ParametroFiltro.almacen == '0' || $scope.Objeto_ParametroFiltro.almacen == 0) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacén', 'error', '#ff6849', 1500);
        //    return;
        //}


        var regionDetalle_Producto = document.getElementById('regionDetalle_Producto');
        $('#txt_busquedaProducto').val('');

        $scope.Lista_Busqueda_Producto = [];
        regionDetalle_Producto.style.display = 'none';
        $('#modalAyuda_Producto').modal('show');

        $timeout(function () {
            $('#inputSearch').val('');
            $scope.search_P = '';
        }, 0);

        $timeout(function () {
            regionDetalle_Producto.style.display = 'none';
            $('#txt_busquedaProducto').focus().select();
        }, 800);
    };


    var oTable_Prod;
    $scope.opcionBusqueda = '';

    $scope.Lista_Busqueda_Producto = [];
    $scope.Ayuda_BuscarProducto = function () {

        //if ($scope.Objeto_ParametroFiltro.local == '0' || $scope.Objeto_ParametroFiltro.local == 0) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Local', 'error', '#ff6849', 1500);
        //    return false;
        //}
        //if ($scope.Objeto_ParametroFiltro.almacen == '0' || $scope.Objeto_ParametroFiltro.almacen == 0) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacén', 'error', '#ff6849', 1500);
        //    return false;
        //}

        const filtroProducto = document.getElementById('txt_busquedaProducto').value;
        let regionDetalle_Producto = document.getElementById('regionDetalle_Producto');
        $scope.loader_modal_ayuda = true;
        StockServices.get_buscarProducto_AyudaModal($scope.Objeto_ParametroFiltro.local, $scope.Objeto_ParametroFiltro.almacen, filtroProducto, auxiliarServices.getUserId())
            .then(function (res) {

                $scope.loader_modal_ayuda = false;
                $scope.Lista_Busqueda_Producto = [];

                if (res.ok == true) {
                    if (res.data.length > 0) {

                        $scope.Lista_Busqueda_Producto = res.data;

                        $timeout(function () {
                            $scope.loaderfiltros = false;
                            regionDetalle_Producto.style.display = '';

                            if (oTable_Prod == null) {
                                oTable_Prod = 'data';
                                auxiliarServices.initFooTable('tbl_busquedaProducto', 'inputSearch');
                            } else {
                                ///---- limpiando el filtrooo en la ayuda ---
                                $('#tbl_busquedaProducto').trigger('footable_filter', {
                                    filter: $("#inputSearch").val()
                                });
                            }
                        }, 800);
        
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'No se encontro resultado, verifique.', 'error', '#ff6849', 3000);
                    }
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Agregar_Producto = function ({ id_Producto, codigo_Producto, descripcion_Producto, id_unidadMedida, descripcion_unidadMedida  }) {
        $scope.objSaveGuiasDet.id_Producto = id_Producto;
        $scope.objSaveGuiasDet.codigo1_Producto = codigo_Producto;
        $scope.objSaveGuiasDet.nombre_Producto = descripcion_Producto + ' - ' + descripcion_unidadMedida;
        $scope.Objeto_ParametroFiltro.idMaterial = id_Producto;
        $scope.objSaveGuiasDet.descripcion_unidadMedida = descripcion_unidadMedida;

        $timeout(function () {
            $('#modalAyuda_Producto').modal('hide');
        }, 500);

    };
     

    $scope.getProductoByFilter = function () {

        if ($scope.objSaveGuiasDet.codigo1_Producto == '' || $scope.objSaveGuiasDet.codigo1_Producto == null) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el código del Producto', 'error', '#ff6849', 1500);
            return;
        }

        const filtroProducto = $scope.objSaveGuiasDet.codigo1_Producto;
        $scope.loader_modal_ayuda = true;
        StockServices.get_buscarProducto_AyudaModal($scope.Objeto_ParametroFiltro.local, $scope.Objeto_ParametroFiltro.almacen, filtroProducto, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loader_modal_ayuda = false;      

                if (res.ok == true) {
                    if (res.data.length > 0) {

                        if (res.data.length == 1) {

                            const { id_Producto, codigo_Producto, descripcion_Producto, id_unidadMedida, descripcion_unidadMedida } = res.data[0];

                            $scope.objSaveGuiasDet.id_Producto = id_Producto;
                            $scope.objSaveGuiasDet.codigo1_Producto = codigo_Producto;
                            $scope.objSaveGuiasDet.nombre_Producto = descripcion_Producto + ' - ' + descripcion_unidadMedida;
                            $scope.Objeto_ParametroFiltro.idMaterial = id_Producto;
                            $scope.objSaveGuiasDet.descripcion_unidadMedida = descripcion_unidadMedida;

                        } else {

                            var regionDetalle_Producto = document.getElementById('regionDetalle_Producto');
                            $('#txt_busquedaProducto').val(filtroProducto);

                            $scope.Lista_Busqueda_Producto = [];
                            regionDetalle_Producto.style.display = 'none';
                            $('#modalAyuda_Producto').modal('show');

                            $scope.Lista_Busqueda_Producto = res.data;

                            $timeout(function () {
                                $('#inputSearch').val('');
                                $scope.search_P = '';
                            }, 0);

                            $timeout(function () {
                                regionDetalle_Producto.style.display = '';

                                if (oTable_Prod == null) {
                                    oTable_Prod = 'data';
                                    auxiliarServices.initFooTable('tbl_busquedaProducto', 'inputSearch');
                                } else {
                                    ///---- limpiando el filtrooo en la ayuda ---
                                    $('#tbl_busquedaProducto').trigger('footable_filter', {
                                        filter: $("#inputSearch").val()
                                    });
                                }
                            }, 500);
                        }
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'No se encontro resultados, verifique.', 'error', '#ff6849', 3000);
                    }
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };



});
