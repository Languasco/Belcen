var app = angular.module('appGestion.RegistroVentasController', []);
app.controller('CtrlRegistroVentas', function ($scope, loginServices, $location, $timeout, auxiliarServices, Documentos_MasivosServices, RevisionPedidoServices, AlmacenServices, RegistroVentasServices, TipoDocumentoServices) {

 
    $scope.loaderfiltros = false;
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {  
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        auxiliarServices.changeTitle("Registro de Ventas");
    };

    $scope.Objeto_ParametroFiltro = {
        id_Anexos: '0',
        id_local: '0',
        id_almacen: '0',
        id_zona : '0',
        fecha_ini: auxiliarServices.getDateNow(),
        fecha_fin: auxiliarServices.getDateNow(),
        id_TipoDocumento :'0'
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
        }, 0);
    });



    $scope.lista_anexos = [];
    $scope.listados_anexos = function () {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_Anexos_Usuarios(auxiliarServices.getUserId()).then(function (res) {
            $scope.loaderFiltro = false;
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
            $scope.loaderFiltro = false;
            console.log(err);
        });
    };
    $scope.listados_anexos();
          
    $scope.Lista_Local = [];
    $scope.get_Listando_Locales = function () {
        $scope.loaderfiltro = true;
        RevisionPedidoServices.get_locales_Usuarios(auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderfiltro = false;
                if (res.ok == true) {
                    $scope.Lista_Local = [];
                    $scope.Lista_Local = res.data;
                    $timeout(function () {
                        $scope.Objeto_ParametroFiltro.id_local = '0';
                        $('#cbo_local').val("0").trigger('change.select2');
                    })
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                    $scope.loaderfiltro = false;
                console.log(err);
            });
    };
    $scope.get_Listando_Locales();
  
       
    $scope.Lista_Almacen = [];
    $scope.listados_changeAlmacenes = function (id_Anexos, id_Local) {

        console.log(id_Anexos + ' : ' + id_Local)

        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_almacen_anexo_local(id_Anexos, id_Local,  auxiliarServices.getUserId())
            .then(function (res) {

                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    $scope.Lista_Almacen = [];
                    $scope.Lista_Almacen = res.data;
                    $timeout(function () {
                        $scope.Objeto_ParametroFiltro.id_almacen = '0';
                        $('#cbo_almacen').val("0").trigger('change.select2');
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

    $scope.Lista_zonas = [];
    $scope.listados_changeZonas = function (id_Anexos, id_Local, id_Almacen) {

        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_Zonas_anexo_local_almacen(id_Anexos, id_Local, id_Almacen, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    $scope.Lista_zonas = [];
                    $scope.Lista_zonas = res.data;
                    $timeout(function () {
                        $scope.Objeto_ParametroFiltro.id_zona = '0';
                        $('#cbo_zonas').val("0").trigger('change.select2');
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


    $scope.Lista_TipoDoc = [];
    $scope.Listando_TipoDocumento = function () {
        $scope.loaderfiltro = true;
        TipoDocumentoServices.getTipoDocumento(0)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_TipoDoc = [];

                for (var i = 0; i < data.length; i++) {
                    if (data[i].id_TipoDocumento == 1 || data[i].id_TipoDocumento == 2 || data[i].id_TipoDocumento == 14 || data[i].id_TipoDocumento == 15) {
                        $scope.Lista_TipoDoc.push(data[i]);
                    }
                }

                setTimeout(function () {
                    $('#cbo_TipoDoc').val("0").trigger('change.select2');
                }, 0);

            }, function (err) {
                    $scope.loaderfiltro = false;
                console.log(err);
            });
    };

    $scope.Listando_TipoDocumento();

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

        $scope.loaderFiltro = true;
        RegistroVentasServices.getRegistro_Ventas($scope.Objeto_ParametroFiltro)
            .then(function (data) {
                $scope.loaderfiltro = false;
                var res = data.split('|');

                if (res[0] == 0 || res[0] == "0") {
                    auxiliarServices.NotificationMessage('Sistemas', 'No hay informacion para mostrar.', 'error', '#ff6849', 1500);
                } else if (res[0] == -1 || res[0] == "-1") {
                    alert(res[1]);
                }
                else {
                    id_link.href = res[1].replace(/["']/g, "");
                    id_link.click();
                }
 
            }, function (err) {
                    $scope.loaderFiltro = false;
                console.log(err);
            });
    }

    $scope.mostrar_documentos = function () {

        if ($scope.Objeto_ParametroFiltro.fecha_ini == 0 || $scope.Objeto_ParametroFiltro.fecha_ini == '0' || $scope.Objeto_ParametroFiltro.fecha_ini == null || $scope.Objeto_ParametroFiltro.fecha_ini == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la fecha inicial', 'error', '#ff6849', 2000);
            return;
        }
        else if ($scope.Objeto_ParametroFiltro.fecha_fin == 0 || $scope.Objeto_ParametroFiltro.fecha_fin == '0' || $scope.Objeto_ParametroFiltro.fecha_fin == null || $scope.Objeto_ParametroFiltro.fecha_fin == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la fecha final', 'error', '#ff6849', 2000);
            return;
        }
        var id_link = document.getElementById('id_link');
        $scope.loaderFiltro = true;
        RegistroVentasServices.getReporteDocumentos($scope.Objeto_ParametroFiltro, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderFiltro = false;
                if (res.ok) {
                    id_link.href = res.data;
                    id_link.click();
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', res.data, 'error', '#ff6849', 1500);
                }
            }, function (err) {
                    $scope.loaderFiltro = false;
                console.log(err);
            });
    }

    $scope.mostrar_productos = function () {

        if ($scope.Objeto_ParametroFiltro.fecha_ini == 0 || $scope.Objeto_ParametroFiltro.fecha_ini == '0' || $scope.Objeto_ParametroFiltro.fecha_ini == null || $scope.Objeto_ParametroFiltro.fecha_ini == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la fecha inicial', 'error', '#ff6849', 2000);
            return;
        }
        else if ($scope.Objeto_ParametroFiltro.fecha_fin == 0 || $scope.Objeto_ParametroFiltro.fecha_fin == '0' || $scope.Objeto_ParametroFiltro.fecha_fin == null || $scope.Objeto_ParametroFiltro.fecha_fin == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la fecha final', 'error', '#ff6849', 2000);
            return;
        }
        var id_link = document.getElementById('id_link');
        $scope.loaderFiltro = true;
        RegistroVentasServices.getReporteProductos($scope.Objeto_ParametroFiltro, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderFiltro = false;
                if (res.ok) {
                    id_link.href = res.data;
                    id_link.click();
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', res.data, 'error', '#ff6849', 1500);
                }
 

            }, function (err) {
                $scope.loaderFiltro = false;
                console.log(err);
            });
    }

     
});