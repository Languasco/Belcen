var app = angular.module('appGestion.ExportarPedidoController', [])
app.controller('ctrlExportarPedido', function ($scope, $location, $timeout, auxiliarServices, ExportarServices, LocalesServices, PersonalServices, AlmacenServices  ) {    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2); 
        auxiliarServices.changeTitle("Exportar Pedidos");
        $scope.titleModal = "Exportar Pedidos";
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
        id_almacen: '0',
        id_Vendedor: '0',
        fecha_ini: auxiliarServices.getDateNow(),
        fecha_fin: auxiliarServices.getDateNow()
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

                $scope.Listando_Vendedores();
            }, function (err) {
                console.log(err);
            });
    };

    $scope.Lista_Vendedor = [];
    $scope.Listando_Vendedores = function () {
        $scope.loaderfiltros = true;
        PersonalServices.getPersonales()
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Vendedor = [];
                $scope.Lista_Vendedor = data;
 
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };
    $scope.Lista_Almacen = [];
    $scope.change_Local_Almacen = function (idlocal) {
        $scope.loaderfiltros = true;
        AlmacenServices.get_ListadoAlmacenes_Local_Usuario(idlocal, auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Almacen = [];
                $scope.Lista_Almacen = data;
                setTimeout(function () {
                    $('#cbo_almacen').val("0").trigger('change.select2');
                }, 300);
            }, function (err) {
                console.log(err);
            });
    };
           
    $scope.descargarPedidos = function () {
        var id_link = document.getElementById('id_link');
        //if ($scope.Objeto_ParametroFiltro.id_local == 0 || $scope.Objeto_ParametroFiltro.id_local == '0') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Local, verifique', 'error', '#ff6849', 1500);
        //    return;
        //}
        //if ($scope.Objeto_ParametroFiltro.id_Vendedor == 0 || $scope.Objeto_ParametroFiltro.id_Vendedor == '0') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Vendedor, verifique', 'error', '#ff6849', 1500);
        //    return;
        //}

        //if ($scope.Objeto_ParametroFiltro.fecha_ini == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Fecha Inicial, verifique', 'error', '#ff6849', 1500);
        //    return;
        //}
        //if ($scope.Objeto_ParametroFiltro.fecha_fin == '') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Fecha Final, verifique', 'error', '#ff6849', 1500);
        //    return;
        //}
        $scope.loaderfiltros = true;
        ExportarServices.get_descargarPedidos($scope.Objeto_ParametroFiltro, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderfiltros = false;
                console.log(res);
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



    $scope.descargarPedidos_texto = function () {
        var id_link = document.getElementById('id_link');
        if ($scope.Objeto_ParametroFiltro.id_local == 0 || $scope.Objeto_ParametroFiltro.id_local == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Local, verifique', 'error', '#ff6849', 1500);
            return;
        } 

        if ($scope.Objeto_ParametroFiltro.fecha_ini == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Fecha Inicial, verifique', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.Objeto_ParametroFiltro.fecha_fin == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Fecha Final, verifique', 'error', '#ff6849', 1500);
            return;
        }
        $scope.loaderfiltros = true;
        ExportarServices.get_descargarPedidos_txt($scope.Objeto_ParametroFiltro, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderfiltros = false;
                console.log(res);
                if (res.ok == true) {
                    id_link.href = res.data.replace(/["']/g, "");
                    id_link.click();
       
                    //$scope.saveDoc('julio.txt', res.data)

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error.', 'error', '#ff6849', 1500);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderfiltros = false;
                console.log(error)
            });
    }

    $scope.saveDoc = function (filename, data) {
        var blob = new Blob([data], {
            type: 'text/csv'
        });
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }
 

     
})