var app = angular.module('appGestion.CobranzaReporteController', [])
app.controller('CtrlCobranzaReporte', function ($scope, ReimpresionServices, $location, $timeout, auxiliarServices, CobranzaReporteServices, ArqueoCajaServices, RevisionPedidoServices ) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        auxiliarServices.changeTitle("Reporte de Cobranza");
        $scope.titleModal = "Reporte de Cobranza";
        $scope.loaderSave = false;
        $scope.loader = false;

        $timeout(function () {
            $('#cbo_anexoFiltro').val('0').trigger('change.select2');
            $('#cbo_zonaVenta').val('0').trigger('change.select2');
            $('#cbo_vendedor').val('0').trigger('change.select2');
        })

        $scope.getAnexos();
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
        buscar: '',
        fechaIni: auxiliarServices.getDateNow(),
        fechaFin: auxiliarServices.getDateNow(),
        idUsuario: auxiliarServices.getUserId(),
    }

    $scope.loader = false;

    $scope.lista_anexos = [];
    $scope.getAnexos = function () {
        $scope.loaderFiltro = true;
        CobranzaReporteServices.get_anexo().then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {
                $scope.lista_anexos = [];
                $scope.lista_anexos = res.data;
                $timeout(function () {
                    $('#cbo_anexoFiltro').val('0').trigger('change.select2');
                })
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
            }
        }, function (err) {
            $scope.loaderFiltro = false;
            console.log(err);
        });
    };

    $scope.lista_reporte = [];
    $scope.getReporte = function () {

        if ($scope.parametros_filtro.idAnexo == '0' || $scope.parametros_filtro.idAnexo == 0  ) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Anexo', 'error', '#ff6849', 2000);
            return;
        }
        if ($scope.parametros_filtro.idZonaVentas == '0' || $scope.parametros_filtro.idZonaVentas == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Zona', 'error', '#ff6849', 2000);
            return;
        }

        $scope.loaderFiltro = true;
        CobranzaReporteServices.get_reporteCobranza($scope.parametros_filtro).then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {
                $scope.lista_reporte = [];
                $scope.lista_reporte = res.data;
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
            }
        }, function (err) {
            $scope.loaderFiltro = false;
        });
    };

    $scope.downloadReporte = function () {

        if ($scope.parametros_filtro.idVendedor == '0' || $scope.parametros_filtro.idVendedor == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Vendedor', 'error', '#ff6849', 2000);
            return;
        }

        var id_link = document.getElementById('id_link');

        $scope.loader = true;
        CobranzaReporteServices.download_reporteCobranza($scope.parametros_filtro)
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    id_link.href = res.data.replace(/["']/g, "");
                    id_link.click();
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error.', 'error', '#ff6849', 1500);
                }
            }, function (error) {
                    $scope.loader = false;
            });
    }


    $scope.reporteCobranzasPDF = function (objCobranza) {

        if ($scope.parametros_filtro.fechaIni == '' || $scope.parametros_filtro.fechaIni == null) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor selecciona la Fecha Inicial', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.parametros_filtro.fechaFin == '' || $scope.parametros_filtro.fechaFin == null) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor selecciona la Fecha Final', 'error', '#ff6849', 1500);
            return false;
        }

        console.log(objCobranza)

        const fechaIni = $scope.parametros_filtro.fechaIni;
        const fechaFin = $scope.parametros_filtro.fechaFin;
        const nroDoc = objCobranza.serie + '-' + objCobranza.numero;
       /*  const nroDoc = 'B020-9';*/

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por generar el archivo',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderFiltro = true;
                CobranzaReporteServices.get_reporteCobranzaPDF(fechaIni, fechaFin, nroDoc)
                    .then(function (res) {
                        $scope.loaderFiltro = false;
                        if (res.ok) {
                            if (res.data.length > 0) {
                                GenerarReporte(res.data, fechaIni, fechaFin, nroDoc);
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

        var imgData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4RDuRXhpZgAATU0AKgAAAAgABAE7AAIAAAAMAAAISodpAAQAAAABAAAIVpydAAEAAAAYAAAQzuocAAcAAAgMAAAAPgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERlc2Fycm9sbG8yAAAFkAMAAgAAABQAABCkkAQAAgAAABQAABC4kpEAAgAAAAMzMwAAkpIAAgAAAAMzMwAA6hwABwAACAwAAAiYAAAAABzqAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAxODowMToxNiAxNTowNzoxNAAyMDE4OjAxOjE2IDE1OjA3OjE0AAAARABlAHMAYQByAHIAbwBsAGwAbwAyAAAA/+ELHmh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iLz48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+PHhtcDpDcmVhdGVEYXRlPjIwMTgtMDEtMTZUMTU6MDc6MTQuMzMzPC94bXA6Q3JlYXRlRGF0ZT48L3JkZjpEZXNjcmlwdGlvbj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+PGRjOmNyZWF0b3I+PHJkZjpTZXEgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOmxpPkRlc2Fycm9sbG8yPC9yZGY6bGk+PC9yZGY6U2VxPg0KCQkJPC9kYzpjcmVhdG9yPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0n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';

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
            doc.text(62, 18, String(titulo));

            doc.setFontSize(7);
            doc.text(198, 15, String(auxiliarServices.getDateNow()));
            doc.text(198, 19, String(auxiliarServices.getHourNow()));

            doc.setFontSize(8);
            doc.text(72, 24, String(data[0].subTitulo1));
            doc.text(72, 27, String(data[0].subTitulo2));

            doc.rect(5, 30, 205, 18);
            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(85, 34, 'CONTROL DE PAGOS');
            doc.line(5, 35.5, 210, 35.5); // horizontal line 
            doc.setFontSize(7);
            doc.text(7, 39, String("NUMERO DOCUMENTO :   " + nroRecibo));
            doc.line(5, 39.7, 210, 39.7); // horizontal line 
            doc.text(7, 43, String("RESPONSABLE DE COBRANZA : " + String(data[0].responsableCobranza)));
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
            doc.text(95, altura + 2, 'MONTO');
            doc.line(115, altura - 4, 115, altura + 6); // Linea Vertical
            doc.text(120, altura + 2, 'TIPO-PAG');
            doc.line(140, altura - 4, 140, altura + 6); // Linea Vertical
            doc.text(145, altura + 2, 'A CUENTA');
            doc.line(165, altura - 4, 165, altura + 6); // Linea Vertical
            doc.text(174, altura + 2, 'TOTAL');
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
            doc.save('Cobranzas.pdf');
            var blob = doc.output("blob");
            var blobURL = URL.createObjectURL(blob);
            var downloadLink = document.getElementById('pdf-download-link');
            downloadLink.href = blobURL;
        }, 0);
    }

    $scope.Lista_zonasFiltro = [];
    $scope.listados_changeAnexoZonasFiltro = function (id_Anexos) {
        $scope.loaderFiltro = true;
        ArqueoCajaServices.get_Zonas_anexos(id_Anexos, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    $scope.Lista_zonasFiltro = [];
                    $scope.Lista_zonasFiltro = res.data;

                    $timeout(function () {
                        $scope.parametros_filtro.idZonaVentas = '0';
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


    $scope.Lista_Vendedor = [];
    $scope.change_Zona_vendedor = function (idZona) {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_vendedorLocal(idZona)
            .then(function (res) {
                $scope.loaderFiltro = false;

                if (res.ok == true) {
                    $scope.Lista_Vendedor = [];
                    $scope.Lista_Vendedor = res.data;

                    setTimeout(function () {
                        $scope.parametros_filtro.idVendedor = '0';
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

 