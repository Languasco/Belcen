var app = angular.module('appGestion.StockController', [])
app.controller('ctrlStock', function ($scope, loginServices, $location, $timeout, auxiliarServices, StockServices, AlmacenServices, LocalesServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        auxiliarServices.changeTitle("Reporte de Stock");
        $scope.titleModal = "Reporte de Stock";
        $scope.loaderSave = false;
        $scope.get_ListandoLocales();
    }

    $('document').ready(function () {
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy',
            });
        }, 500);
    });
    $scope.listTipoReporte = [
        { id: 1, des: 'General' },
        { id: 2, des: 'Por Local' },
        { id: 3, des: 'Por Almacen' }
    ]
    $scope.Objeto_ParametroFiltro = {
        tipo: '1',
        local: '0',
        almacen: '0',
        fecha: auxiliarServices.getDateNow(),
        fecha_aux: '',
        idMaterial : '0'
    }
    $timeout(function () {
        $('#cbo_tipo').val("1").trigger('change.select2');
    })




    $scope.Lista_Locales = [];
    $scope.get_ListandoLocales = function () {
        $scope.loaderSave = true;
        LocalesServices.getLocales().then(function (data) {
            $scope.loaderSave = false;
            $scope.Lista_Locales = [];
            $scope.Lista_Locales = data;
            setTimeout(function () {
                $(".selectFiltros").select2();
                $('#cbo_local').val("0").trigger('change.select2');
                $('#cbo_almacen').val("0").trigger('change.select2');
            }, 500);
        }, function (err) {
            console.log(err);
        })
    }

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
       })
    }

    $scope.change_LocalesAlmacen = function () {
        var id_local = $scope.Objeto_ParametroFiltro.local;
        $scope.get_ListandoAlmacenes(id_local);
    }


    $scope.GenerarReporte = function (value) {
 

        if (StockServices.validate($scope.Objeto_ParametroFiltro) === false) {
            return;
        }
        $scope.loaderSave = true;
        $scope.Objeto_ParametroFiltro.fecha_aux = '';
        $scope.Objeto_ParametroFiltro.fecha_aux = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fecha);

        StockServices.getGenerarReportePDF_Stock(1, $scope.Objeto_ParametroFiltro)
            .then(function (data) {
                $scope.loaderSave = false;
                console.log(data);
                if (value === 1) {
                    Pdf_ReporteStock(data, $scope.Objeto_ParametroFiltro.fecha_aux, 1)
                } else {
                    console.log(data);
                    $scope.listDataReporte = data;

                }

            }, function (err) {
                $scope.loaderSave = false;
                console.log(err);
            });
    };

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $timeout(function () {
            $scope.ExportarToExcel();
        }, 100);
    });

    $scope.ExportarToExcel = function () {        // CAPTURAMOS EL TIPO DE TRANSACCIÓN PARA GENERAR LA CABECERA AL REPORTE

        var Cabecera;
        if ($scope.Objeto_ParametroFiltro.tipo == 1) {
            Cabecera = "STOCK GENERAL";
        }
        else if ($scope.Objeto_ParametroFiltro.tipo == 2) {
            Cabecera = "STOCK POR LOCAL";
        }
        else if ($scope.Objeto_ParametroFiltro.tipo == 3) {
            Cabecera = "STOCK POR ALMACEN";
        }


        var uri = 'data:application/vnd.ms-excel;base64,',
              template = '<html lang="es"  xmlns:o="urn:schemas-microsoft-com:office:office"' +
                         'xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
                         '<head>' +
                         '<meta charset="utf-8">' +
                         '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Reporte</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
                         '<style>' +

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
                         ' <p  style="text-align:center; font-size: 17px;">Fecha : ' + $scope.Objeto_ParametroFiltro.fecha +' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tblReport'),
                     ctx = { worksheet: 'descar123', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReporteStock.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()
        $scope.loaderSave = false;

    }



    function Pdf_ReporteStock(items, fecha, TipoReporte) {
        var TituloReporte = '';
        var Posic_Titulo = '';

        if ($scope.Objeto_ParametroFiltro.tipo == 1) {
            TituloReporte = "STOCK GENERAL";
        }
        else if ($scope.Objeto_ParametroFiltro.tipo == 2) {
            TituloReporte = "STOCK POR LOCAL";
        }
        else if ($scope.Objeto_ParametroFiltro.tipo == 3) {
            TituloReporte = "STOCK POR ALMACEN";
        }

        var doc = new jsPDF('l', 'pt');


        var ColumnasReporte = getColumnsReporteStock(TipoReporte);

        var header = function (data) {
            doc.setFontSize(8);
            doc.setFont("helvetica");
            doc.setTextColor(40);
            doc.text(40, 27, 'Corporación Belcen E.I.R.L.')
            doc.setTextColor(0);
            doc.setFontSize(8);
            doc.text(760, 27, getDateHoyR())
            doc.text(753, 35, Hora_Reporte())
            doc.setFontSize(18);
            if ($scope.Objeto_ParametroFiltro.tipo == 1) {
                TituloReporte = "STOCK GENERAL";
            }
            else if ($scope.Objeto_ParametroFiltro.tipo == 2) {
                TituloReporte = "STOCK POR LOCAL";
            }
            else if ($scope.Objeto_ParametroFiltro.tipo == 3) {
                TituloReporte = "STOCK POR ALMACEN";
            }
            doc.text(320, 53, TituloReporte);
            doc.setFontSize(8);
            doc.setFontType("normal");
            doc.text(350, 73, 'A LA FECHA:'); doc.text(410, 73, String(fecha));

        };

        //Titulo inicial del documento
        doc.setProperties({
            title: TituloReporte,
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
        doc.output('save', 'ReportStock.pdf');
    };


    var getColumnsReporteStock = function (TipoReporte) {
        var Columnas;
        // por stock almacen
        if (TipoReporte == 1) {
            if ($scope.Objeto_ParametroFiltro.tipo == 1) {
                Columnas = [
                    { title: "CODIGO", dataKey: "codigo" },
                    { title: "DESCRIPCION", dataKey: "descripcion" },
                    { title: "MARCA", dataKey: "MARCA" },
                    { title: "RUBRO", dataKey: "rubro" },
                    { title: "U.M", dataKey: "um" },
                    { title: "INGRESOS", dataKey: "ingresos" },
                    { title: "SALIDAS", dataKey: "salidas" },
                    { title: "STOCK", dataKey: "stock" }
                ];
            } else if ($scope.Objeto_ParametroFiltro.tipo == 2) {
                Columnas = [
                    { title: "LOCAL", dataKey: "local" },
                    { title: "CODIGO", dataKey: "codigo" },
                    { title: "DESCRIPCION", dataKey: "descripcion" },
                    { title: "MARCA", dataKey: "MARCA" },
                    { title: "RUBRO", dataKey: "rubro" },
                    { title: "U.M", dataKey: "um" },
                    { title: "INGRESOS", dataKey: "ingresos" },
                    { title: "SALIDAS", dataKey: "salidas" },
                    { title: "STOCK", dataKey: "stock" }
                ];
            } else if ($scope.Objeto_ParametroFiltro.tipo == 3) {
                Columnas = [
                    { title: "ALMACEN", dataKey: "almacen" },
                    { title: "CODIGO", dataKey: "codigo" },
                    { title: "DESCRIPCION", dataKey: "descripcion" },
                    { title: "MARCA", dataKey: "MARCA" },
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
        var Formato_hora
        marcacion = new Date()
        Hora = marcacion.getHours()
        Minutos = marcacion.getMinutes()
        Segundos = marcacion.getSeconds()

        dn = "a.m"
        if (Hora > 12) {
            dn = "p.m"
            Hora = Hora - 12
        }
        if (Hora == 0)
            Hora = 12
        /* Si la Hora, los Minutos o los Segundos son Menores o igual a 9, le añadimos un 0 */
        if (Hora <= 9) Hora = "0" + Hora
        if (Minutos <= 9) Minutos = "0" + Minutos
        if (Segundos <= 9) Segundos = "0" + Segundos

        /* En Reloj le indicamos la Hora, los Minutos y los Segundos */
        Formato_hora = Hora + ":" + Minutos + ":" + Segundos + " " + dn

        return Formato_hora
    }

    function getDateHoyR() {
        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1; //hoy es 0!
        var yyyy = hoy.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        hoy = dd + '/' + mm + '/' + yyyy;

        return hoy;
    }

})