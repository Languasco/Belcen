var app = angular.module('appGestion.PagoVendedorController', []);
app.controller('ctrlPagoVendedor', function ($scope, loginServices, $location, $timeout, auxiliarServices, PagosVendedorServices, PedidosServices, CobranzaReporteServices, ArqueoCajaServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        auxiliarServices.changeTitle("Reporte de Cuentas por Cobrar");
        $scope.titleModal = "Reporte de Cuentas por Cobrar";
        $scope.loaderSave = false;
    };

    $('document').ready(function () {

        const idModulo = auxiliarServices.get_moduloElegido();

        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy'
            });

            lightbox.option({
                'resizeDuration': 200,
                'wrapAround': true
            });
            $(".selectFiltros").select2();
        }, 0);
    });

    $scope.Objeto_ParametroFiltro = {
        vendedor: 0,
        fecha_ini: auxiliarServices.getDateNow(),
        fecha_ini_aux: '',
        fecha_fin: auxiliarServices.getDateNow(),
        fecha_fin_aux: '',
        opcion: 1,
        id_cliente: 0,
        nro_doc: '',
        nombres_Cliente: '',
        nombre_clienteMostrar: 'Buscar Cliente',
        fechaInicio: auxiliarServices.getDateNow(),
        fechaFin: auxiliarServices.getDateNow(),
        idAnexo: '0',
        idZonaVentas: '0',

        id_busqueda: 0,
        descripcion_busqueda: '',
        label_boton: 'Buscar Vendedor',
    };


    $scope.Lista_Vendedor = [];
    $scope.get_ListandoVendedores = function () {
        $scope.loaderSave = true;
        PagosVendedorServices.get_Vendedores().then(function (data) {
            $scope.loaderSave = false;
            $scope.Lista_Vendedor = [];
            $scope.Lista_Vendedor = data;
            setTimeout(function () {
                $(".selectFiltros").select2();
                $('#cbo_vendedor').val("0").trigger('change.select2');
            }, 500);
        }, function (err) {
            console.log(err);
        });
    };

    $scope.Lista_PagosVendedor = [];

    var oTable;

    const validacionesGenerales = ()=>{
        if ($scope.Objeto_ParametroFiltro.idAnexo == '0' || $scope.Objeto_ParametroFiltro.idAnexo == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Anexo', 'error', '#ff6849', 2000);
            return false;
        }
        if ($scope.Objeto_ParametroFiltro.idZonaVentas == '0' || $scope.Objeto_ParametroFiltro.idZonaVentas == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Zona', 'error', '#ff6849', 2000);
            return false;
        }


        if ($scope.Objeto_ParametroFiltro.opcion === 1 || $scope.Objeto_ParametroFiltro.opcion === '1') {

            //if ($scope.Objeto_ParametroFiltro.id_cliente === 0 || $scope.Objeto_ParametroFiltro.id_cliente === '0') {
            //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un cliente', 'error', '#ff6849', 1500);
            //    return false;
            //}
            $scope.Objeto_ParametroFiltro.fecha_ini_aux = '';
            $scope.Objeto_ParametroFiltro.fecha_fin_aux = '';
            $scope.Objeto_ParametroFiltro.fecha_ini_aux = $scope.Objeto_ParametroFiltro.fechaInicio;
            $scope.Objeto_ParametroFiltro.fecha_fin_aux = $scope.Objeto_ParametroFiltro.fechaFin;

        } else if ($scope.Objeto_ParametroFiltro.opcion === 2 || $scope.Objeto_ParametroFiltro.opcion === '2') {

            if ($scope.Objeto_ParametroFiltro.nro_doc === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese un N° Doc.', 'error', '#ff6849', 1500);
                return false;
            }

            $scope.Objeto_ParametroFiltro.fecha_ini_aux = '';
            $scope.Objeto_ParametroFiltro.fecha_fin_aux = '';
            $scope.Objeto_ParametroFiltro.fecha_ini_aux = $scope.Objeto_ParametroFiltro.fecha_ini;
            $scope.Objeto_ParametroFiltro.fecha_fin_aux = $scope.Objeto_ParametroFiltro.fecha_fin;

        } else if ($scope.Objeto_ParametroFiltro.opcion === 3 || $scope.Objeto_ParametroFiltro.opcion === '3') {

            $scope.Objeto_ParametroFiltro.fecha_ini_aux = '';
            $scope.Objeto_ParametroFiltro.fecha_fin_aux = '';
            $scope.Objeto_ParametroFiltro.fecha_ini_aux = $scope.Objeto_ParametroFiltro.fecha_ini;
            $scope.Objeto_ParametroFiltro.fecha_fin_aux = $scope.Objeto_ParametroFiltro.fecha_fin;

        } else if ($scope.Objeto_ParametroFiltro.opcion === 4 || $scope.Objeto_ParametroFiltro.opcion === '4') {

            //if ($scope.Objeto_ParametroFiltro.id_busqueda === 0 || $scope.Objeto_ParametroFiltro.id_busqueda === '0') {
            //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Vendedor', 'error', '#ff6849', 1500);
            //    return false;
            //}
            $scope.Objeto_ParametroFiltro.fecha_ini_aux = $scope.Objeto_ParametroFiltro.fechaInicio;
            $scope.Objeto_ParametroFiltro.fecha_fin_aux = $scope.Objeto_ParametroFiltro.fechaFin;

        }
        return true;
    }

    $scope.GenerarReporte = function () {

        
        if (validacionesGenerales() == false) {
            return
        }

        $scope.loaderSave = true;
        $scope.Objeto_ParametroFiltro.nro_doc = $scope.Objeto_ParametroFiltro.nro_doc;

        console.log($scope.Objeto_ParametroFiltro);
        PagosVendedorServices.getGenerarReporte($scope.Objeto_ParametroFiltro)
            .then(function (data) {
                $scope.Lista_PagosVendedor = [];
                $scope.Lista_PagosVendedor = data;
                console.log(data);
                $timeout(function () {
                    $scope.loaderSave = false;
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('tablaPagosVendedor', 'inputSearch');
                    } else {
                        $('#tablaPagosVendedor').trigger('footable_initialize');
                    }
                }, 1000);

            }, function (err) {
                console.log(err);
            });
    };

    $scope.ClienteChecked = function () {
        $scope.Lista_PagosVendedor = [];

        $scope.Objeto_ParametroFiltro.id_cliente = 0;
        $scope.Objeto_ParametroFiltro.nombres_Cliente = '';
        $scope.Objeto_ParametroFiltro.nombre_clienteMostrar = 'Buscar Cliente';
        $scope.Objeto_ParametroFiltro.nombres_Cliente = '';

        $scope.Objeto_ParametroFiltro.id_busqueda = 0;
        $scope.Objeto_ParametroFiltro.descripcion_busqueda = '';
        $scope.Objeto_ParametroFiltro.label_boton = 'Buscar Vendedor';
    };

    $scope.GenerarCierreVentas = function () {

        if (validacionesGenerales() == false) {
            return
        }

        $scope.loaderSave = true;
        $scope.Objeto_ParametroFiltro.nro_doc = $scope.Objeto_ParametroFiltro.nro_doc;

        PagosVendedorServices.getGenerarReporteCierreVenta($scope.Objeto_ParametroFiltro)
            .then(function (data) {
                $scope.loaderSave = false;
                GenerarReporte(data, $scope.Objeto_ParametroFiltro.opcion, $scope.Objeto_ParametroFiltro.nombres_Cliente, $scope.Objeto_ParametroFiltro.nro_doc, $scope.Objeto_ParametroFiltro.fecha_ini_aux, $scope.Objeto_ParametroFiltro.fecha_fin_aux);
            }, function (err) {
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

                regionDetalle.style.display = '';
                $scope.Lista_Busqueda_Cliente = [];
                $scope.Lista_Busqueda_Cliente = data;

                $timeout(function () {
                    $scope.loaderfiltros = false;
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

        console.log(obj)
        
        $scope.Objeto_ParametroFiltro.id_cliente = obj.id_cliente;
        $scope.Objeto_ParametroFiltro.nombres_Cliente = obj.nombres_Cliente;
        $scope.Objeto_ParametroFiltro.nombre_clienteMostrar = obj.nombres_Cliente;
        $('#modalAyuda_Cliente').modal('hide');
        $timeout(function () {
            $('#cbo_vendedor').val(String(obj.id_PersonalVendedor)).trigger('change.select2');
        }, 200);
    };

    function GenerarReporte(data,opcion,nombreCliente,nroDoc, fechaini, fechafin) {

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
            doc.text(62, 20, String(titulo));

            doc.setFontSize(7);
            doc.text(198, 20, String(auxiliarServices.getDateNow()));
            doc.text(198, 24, String(auxiliarServices.getHourNow()));

            doc.setFontSize(8);
            doc.text(67, 24, String("992 847 948 / 943 050 726 - E-mail: jmvillasol@hotmail.com"));
            doc.text(77, 27, String("Mza. W Lote Coop. 27 de Abril - Lima - Lima - Santa Anita"));

            doc.rect(5, 35, 205, 9);
            doc.setFontSize(7);
            doc.setFontType("bold");
            if (opcion === 1 || opcion === '1') {
                doc.text(7, 38.5, String("CLIENTE :   " + nombreCliente).toUpperCase());
                doc.line(5, 39.5, 210, 39.5); // horizontal line 
                doc.text(7, 43, String("FECHAS       :   " + fechaini + ' AL ' + fechafin));
            } else if (opcion === 2 || opcion === '2') {
                doc.text(7, 38.5, String("N° Doc :   " + nroDoc).toUpperCase());
            } else if (opcion === 3 || opcion === '3') {
                doc.line(5, 39.5, 210, 39.5); // horizontal line 
                doc.text(7, 43, String("FECHAS       :   " + fechaini + ' AL ' + fechafin));

            }
            doc.setFontSize(8);
            doc.setFont("helvetica");
            doc.setFontType("bold");
            altura = altura + 4;
            doc.rect(5, altura, 205, 10);
            altura = altura + 4;
            doc.setFontSize(6);
            doc.setFontType("bold");

            doc.text(8, altura + 2, 'FECHA');
            doc.line(20, altura - 4, 20, altura + 6); // Linea Vertical
            doc.text(24, altura + 2, 'NRO-DOC');
            doc.line(38, altura - 4, 38, altura + 6); // Linea Vertical
            if (opcion === 1 || opcion === '1') {
                doc.text(60, altura + 2, 'VENDEDOR');
            } else {
                doc.text(60, altura + 2, 'CLIENTE');
            }
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
            if (opcion === 1 || opcion === '1') {
                doc.text(39, altura, String(data[i1].Vendedor));
            } else {
                doc.text(39, altura, String(data[i1].razonSocial_Cliente));
            }
            doc.line(90, altura - 4, 90, altura); // Linea Vertical 
            //doc.text(93, altura, String(data[i].monto))
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

    function esEntero(numero) {
        var indicador = false;

        if (numero % 1 === 0) {
            indicador = true;
        }
        return indicador;
    }

    var pictures = $scope.pictures = [];

    $scope.MostrarImagen = function (id_Factura) {
        $('#fotos').modal();
        PagosVendedorServices.get_MostrandoRelacionVoucher(id_Factura)
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
    $scope.getAnexos();

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
                        $scope.Objeto_ParametroFiltro.idZonaVentas = '0';
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

    $scope.descargarExcel = function () {
        if (validacionesGenerales() == false) {
            return
        }

        var id_link = document.getElementById('id_link');
        $scope.loaderSave = true;
        $scope.Objeto_ParametroFiltro.nro_doc = $scope.Objeto_ParametroFiltro.nro_doc;

        PagosVendedorServices.getGenerarExcel($scope.Objeto_ParametroFiltro)
            .then(function (res) {
                $scope.loaderSave = false;
                console.log(res);
                if (res.ok) {
                    id_link.href = res.data;
                    id_link.click();
                } else {
                    alert(JSON.stringify(res.data))
                    auxiliarServices.NotificationMessage('Sistemas', res.data, 'error', '#ff6849', 1500);
                }
            }, function (err) {
                console.log(err);
            });



    }

    $scope.Open_New_Modal_Ayuda = function () {

        if ($scope.Objeto_ParametroFiltro.idZonaVentas == 0 || $scope.Objeto_ParametroFiltro.idZonaVentas == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Zona', 'error', '#ff6849', 2000);
            return
        }

        var regionDetalleBusqueda = document.getElementById('regionDetalleBusqueda');
        $('#txt_busqueda').val('');
        $scope.ListaDetalleBusqueda = [];
        regionDetalleBusqueda.style.display = 'none';
        $('#modalAyuda').modal('show');

        $timeout(function () {
            regionDetalleBusqueda.style.display = 'none';
            $('#txt_busqueda').focus().select();
        }, 500);
    };


    var oTable_busqueda;
    $scope.ListaDetalleBusqueda = [];

    $scope.Ayuda_busqueda = function () {
        var txt_busqueda = document.getElementById('txt_busqueda').value;
        var regionDetalleBusqueda = document.getElementById('regionDetalleBusqueda');

        $scope.loader_modal_ayuda = true;
        PagosVendedorServices.get_ayuda_busquedaVendedores(txt_busqueda, $scope.Objeto_ParametroFiltro.idZonaVentas)
            .then(function (res) {
                if (res.ok == true) {
                    $scope.loader_modal_ayuda = false;

                    regionDetalleBusqueda.style.display = '';
                    $scope.ListaDetalleBusqueda = [];
                    $scope.ListaDetalleBusqueda = res.data;

                    $timeout(function () {
                        $scope.loaderfiltros = false;
                        if (oTable_busqueda !== 'data') {
                            oTable_busqueda = 'data';
                            auxiliarServices.initFooTable('tbl_busqueda', '');
                        } else {
                            $('#tbl_busqueda').trigger('footable_initialize');
                        }
                    }, 500);
                } else {

                    alert(JSON.stringify(res.data))
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                }
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Agregar_busqueda = function (obj) {
        $scope.Objeto_ParametroFiltro.id_busqueda = obj.id,
        $scope.Objeto_ParametroFiltro.descripcion_busqueda = obj.descripcion,
        $scope.Objeto_ParametroFiltro.label_boton = obj.descripcion,
        $('#modalAyuda').modal('hide'); 
    };



});