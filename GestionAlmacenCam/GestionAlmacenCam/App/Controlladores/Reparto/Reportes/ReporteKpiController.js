var app = angular.module('appGestion.ReporteKpiController', [])
app.controller('CtrlReporteKpi', function ($scope, $location, $timeout, auxiliarServices,  LocalesServices, PersonalServices, AlmacenServices, ReporteCoberturaServices ) {    

 

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2); 
        auxiliarServices.changeTitle("Reporte especial de ventas KPI");
        $scope.titleModal = "Reporte de Total de Productos";
        $scope.loaderSave = false; 

        setTimeout(function () {
            $(".selectFiltros").select2();
        }, 100);
        $scope.get_Listando_Locales();

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
        id_local: '0',
        fecha_ini: auxiliarServices.getDateNow(),
        fecha_fin: auxiliarServices.getDateNow(),
        fecha_cierre: auxiliarServices.getDateNow(),
        drop: '',
        efectividad: '',
        distribucion : ''
    };
    
    $scope.Lista_Local = [];
    $scope.get_Listando_Locales = function () {
        $scope.loaderfiltros = true;
        LocalesServices.get_Locales_Usuario(auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Local = [];
                $scope.Lista_Local = data;
                setTimeout(function () {
                    $('#cbo_local').val("0").trigger('change.select2');
                }, 100);
            }, function (err) {
                console.log(err);
            });
    };

 
 
           
    $scope.descargarReporteKpi= function () {
        var id_link = document.getElementById('id_link');
        //if ($scope.Objeto_ParametroFiltro.id_local == 0 || $scope.Objeto_ParametroFiltro.id_local == '0') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Local, verifique', 'error', '#ff6849', 1500);
        //    return;
        //}
        //if ($scope.Objeto_ParametroFiltro.id_Vendedor == 0 || $scope.Objeto_ParametroFiltro.id_Vendedor == '0') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Vendedor, verifique', 'error', '#ff6849', 1500);
        //    return;
        //}

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
        ReporteCoberturaServices.get_descargarReporteKpi($scope.Objeto_ParametroFiltro, auxiliarServices.getUserId())
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