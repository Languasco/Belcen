var app = angular.module('appGestion.ReporteStockController', [])
app.controller('CtrlReporteStock', function ($scope, $location, $timeout, auxiliarServices, ImportarStockAlmacenServices, ReporteCoberturaServices ) {    

 

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2); 
        auxiliarServices.changeTitle("Reporte Stock");
        $scope.titleModal = "Reporte de Stock";
        $scope.loaderSave = false; 

        setTimeout(function () {
            $(".selectFiltros").select2();
        }, 100);
        $scope.get_ListandoAlmacenes();

    } 
    
    $('document').ready(function () {
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy'
            });
        }, 500);
    });
    
    $scope.Objeto_ParametroFiltro = {
        id_almacen: '0' 
    };


    $scope.Lista_Almacen = [];
    $scope.get_ListandoAlmacenes = function () {
        $scope.loaderfiltros = true;
        ImportarStockAlmacenServices.get_almacenesGeneral(auxiliarServices.getUserId())
            .then(function (res) {

                $scope.loaderfiltros = false;
                $scope.Lista_Almacen = [];
                $scope.Lista_Almacen = res.data;

            }, function (err) {
                console.log(err);
            });
    };


    //---informacion de las notas de Las Facturas ----

    var oTable;
    $scope.Lista_DataCabecera = [];
    $scope.MostrarReporteStock = function () {

        if ($scope.Objeto_ParametroFiltro.id_almacen == 0 || $scope.Objeto_ParametroFiltro.id_almacen == '0' || $scope.Objeto_ParametroFiltro.id_almacen == null || $scope.Objeto_ParametroFiltro.id_almacen == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor selecciona el almacen ', 'error', '#ff6849', 2000);
            return;
        }
        $scope.loaderfiltros = true;
        ReporteCoberturaServices.get_reporteStock($scope.Objeto_ParametroFiltro.id_almacen, auxiliarServices.getUserId()  )
            .then(function (data) {
                $scope.Lista_DataCabecera = [];
                $scope.Lista_DataCabecera = data;
                $timeout(function () {
                    $scope.loaderfiltros = false;
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('data_cabecera', 'inputSearch');
                    } else {
                        $('#data_cabecera').trigger('footable_initialize');
                    }
                }, 1000);
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };
    ///----- fin de listando informacion de Facturas


 
    
 
 
           
    $scope.descargarReporteStock= function () {
        var id_link = document.getElementById('id_link');
        if ($scope.Objeto_ParametroFiltro.fecha_ini == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Fecha Inicial, verifique', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.Objeto_ParametroFiltro.fecha_fin == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Fecha Final, verifique', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.Objeto_ParametroFiltro.fecha_cierre == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Fecha Final, verifique', 'error', '#ff6849', 1500);
            return;
        }

        $scope.loaderfiltros = true;
        ReporteCoberturaServices.get_descargarReporteStock($scope.Objeto_ParametroFiltro.id_almacen, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderfiltros = false;
                if (res.ok == true) {
                    id_link.href = res.data.replace(/["']/g, "");
                    id_link.click();
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error.', 'error', '#ff6849', 1500);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderfiltros = false;
                console.log(error)
            });
    }    
 

     
})