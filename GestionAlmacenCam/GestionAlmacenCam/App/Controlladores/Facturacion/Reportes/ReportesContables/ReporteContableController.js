﻿var app = angular.module('appGestion.ReporteContableController', []);

app.controller('ReporteContableController', function ($scope, ReporteContableServices, $location, $timeout, auxiliarServices, RevisionPedidoServices) {

 
    $scope.loaderfiltros = false;
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {  
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        auxiliarServices.changeTitle("Reporte Contable");

        setTimeout(function () {
            $(".selectFiltros").select2();
        }, 0);
    };

    $scope.Objeto_ParametroFiltro = {
        id_anexo: '0',
        fecha_ini: auxiliarServices.getDateNow(),
        fecha_fin: auxiliarServices.getDateNow(),
        opcion_reporte : 1
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

    $scope.lista_anexos = [];
    $scope.listandoAnexos = function () {
        $scope.loaderfiltros = true;
        RevisionPedidoServices.get_Anexos_Usuarios(auxiliarServices.getUserId()).then(function (res) {
            $scope.loaderfiltros = false;
            if (res.ok == true) {
                $scope.lista_anexos = [];
                $scope.lista_anexos = res.data;
                $timeout(function () {
                    $('#cbo_anexo').val('0').trigger('change.select2');
                })
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
        }, function (err) {
            $scope.loaderfiltros = false;
            console.log(err);
        });
    };
    $scope.listandoAnexos();
 

    $scope.descargarExcel_contable = function () {

        var id_link = document.getElementById('id_link');
        $scope.loaderFiltro = true;
        ReporteContableServices.get_descargar_reporteContable_excel($scope.Objeto_ParametroFiltro.id_anexo, $scope.Objeto_ParametroFiltro.fecha_ini, $scope.Objeto_ParametroFiltro.fecha_fin, $scope.Objeto_ParametroFiltro.opcion_reporte, auxiliarServices.getUserId())
            .then(function (res) {
                console.log(res)
                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    id_link.href = res.data.replace(/["']/g, "");
                    id_link.click();
                } else {
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderFiltro = false;
                console.log(error)
            })
    }
     
});