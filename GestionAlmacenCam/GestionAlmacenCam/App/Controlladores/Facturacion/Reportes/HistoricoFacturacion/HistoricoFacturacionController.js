var app = angular.module('appGestion.HistoricoFacturacionController', []);
app.controller('HistoricoFacturacionController', function ($scope, $location, $timeout, auxiliarServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        auxiliarServices.changeTitle("Histórico Facturación");
        $scope.titleModal = "Histórico Facturación";
        $scope.loaderSave = false;

        $timeout(function () {
            $(".selectFiltros").select2();
        }, 0);
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
        }, 0);

        $timeout(function () {
            $scope.Objeto_ParametroFiltro.tipoBusqueda = 0;
            $('#cbo_tipoBusqueda').val(String('1')).trigger('change.select2');
        }, 100);


    });

    $scope.Objeto_ParametroFiltro = {
        fecha_ini: auxiliarServices.getDateNow(),
        fecha_fin: auxiliarServices.getDateNow(),
        tipoBusqueda: 0,
        codigoNroDoc: '',
        razonSocial: '',
        direccionEntrega: '',
        credito : ''
    };

 


});