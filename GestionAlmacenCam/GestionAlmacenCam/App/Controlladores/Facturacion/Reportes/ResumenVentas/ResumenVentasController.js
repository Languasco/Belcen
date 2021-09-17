var app = angular.module('appGestion.ResumenVentasController', []);

app.controller('CtrlResumenVentas', function ($scope, loginServices, $location, $timeout, auxiliarServices, PuntoVentaServices, LocalesServices, productoCategoriaServices, ResumenVentasServices, productoMarcaServices) {

 
    $scope.loaderfiltros = false;
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {  
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        auxiliarServices.changeTitle("Resumen de Ventas");
        $scope.get_Listando_Locales();
        $scope.getProductoCategorias();
        $scope.get_Listando_Marca();
    };

    $scope.Objeto_ParametroFiltro = {
        id_PuntoVenta: '0',
        id_lineaProducto: '0',
        id_marcaProducto:'0',
        fecha_ini: auxiliarServices.getDateNow(),
        fecha_fin: auxiliarServices.getDateNow(),
        id_Tiporep: '1',
        id_usuario : 0
    };

    $('document').ready(function () {
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy'
            });
        }, 500);

        setTimeout(function () {
            $(".selectFiltros").select2();
        }, 100);
    });

    $scope.Lista_PuntoVenta = [];
    $scope.Listando_Punto_Venta = function () {
        $scope.loaderfiltros = true;
        PuntoVentaServices.getPuntoVenta(0)
            .then(function (data) { 
                $scope.loaderfiltros = false;
                $scope.Lista_PuntoVenta = [];
                $scope.Lista_PuntoVenta = data;
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };


    $scope.Lista_Local = [];
    $scope.get_Listando_Locales = function () {
        $scope.loaderfiltros = true;
        LocalesServices.get_Locales_Usuario(auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Local = [];
                $scope.Lista_Local = data;
 
            }, function (err) {
                console.log(err);
            });
    };



    
    $scope.lista_Linea = [];
    $scope.getProductoCategorias = function () {
        $scope.loaderfiltros = true;
        productoCategoriaServices.getProductoCategoria().
            then(function (res) {
                $scope.loaderfiltros = false;
                $scope.lista_Linea = [];
                $scope.lista_Linea = res;


            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            })
    } 

    $scope.ListaMarca = [];
    $scope.get_Listando_Marca = function () {
        $scope.loader = true;
        productoMarcaServices.getProductoMarca()
            .then(function (res) {
                $scope.loader = false;
                $scope.ListaMarca = [];
                $scope.ListaMarca = res;

                setTimeout(function () {
                    //$('#cbo_puntoVenta').val("0").trigger('change.select2');
                    $('#cbo_local').val("0").trigger('change.select2');
                    $('#cbo_linea').val("0").trigger('change.select2');
                    $('#cbo_marca').val("0").trigger('change.select2');
                    $('#cbo_Tiporep').val("1").trigger('change.select2');
                }, 300);

            }, function (err) {
                console.log(err);
            });
    };


    $scope.mostrar_Reporte = function () {
 

        if ($scope.Objeto_ParametroFiltro.fecha_ini == 0 || $scope.Objeto_ParametroFiltro.fecha_ini == '0' || $scope.Objeto_ParametroFiltro.fecha_ini == null || $scope.Objeto_ParametroFiltro.fecha_ini == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la fecha inicial', 'error', '#ff6849', 2000);
            return;
        }
        else if ($scope.Objeto_ParametroFiltro.fecha_fin == 0 || $scope.Objeto_ParametroFiltro.fecha_fin == '0' || $scope.Objeto_ParametroFiltro.fecha_fin == null || $scope.Objeto_ParametroFiltro.fecha_fin == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la fecha final', 'error', '#ff6849', 2000);
            return;
        }
        var id_link = document.getElementById('id_link');

        $scope.Objeto_ParametroFiltro.id_usuario = auxiliarServices.getUserId();

        $scope.loaderfiltros = true;
        ResumenVentasServices.getResumen_Ventas_Excel($scope.Objeto_ParametroFiltro)
            .then(function (data) {

                $scope.loaderfiltros = false;
                var res = data.split('|');

                if (res[0] == 0 || res[0] == "0") {
                    auxiliarServices.NotificationMessage('Sistemas', 'No hay informacion para mostrar.', 'error', '#ff6849', 1500);
                    return;
                } else if (res[0] == -1 || res[0] == "-1") {
                    alert(res[1]);
                }
                else {
                    id_link.href = res[1].replace(/["']/g, "");
                    id_link.click();
                } 
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    }
     
});