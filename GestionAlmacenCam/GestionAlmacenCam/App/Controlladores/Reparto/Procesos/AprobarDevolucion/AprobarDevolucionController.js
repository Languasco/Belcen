var app = angular.module('appGestion.AprobarDevolucionController', [])
app.controller('CtrlAprobarDevolucion', function ($scope, $location, $timeout, auxiliarServices, EntregaPedidoServices, AprobarDevolucionServices, LocalesServices, PersonalServices, AlmacenServices  ) {    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');

            return;
        }
        auxiliarServices.menuHideShow(2); 
        auxiliarServices.changeTitle("Listado de Pedidos a Aprobar");
        $scope.loaderSave = false; 

        setTimeout(function () {
            $(".selectFiltros").select2();
            $("#btnAprobar").prop('disabled', true);
        }, 100);
        $scope.get_Listando_Locales();
        $scope.get_Listando_Transportistas();    

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
        id_local: '1',
        id_almacen: '1',
        id_Vendedor: '0',
        id_transportista: '0',
        id_tipoEntrega: '0',
        fecha_ini: auxiliarServices.getDateNow(),
        fecha_aprobacion: auxiliarServices.getDateNow(),
        numero_notacredito: ''
    };

    $scope.seleccionado = 0;   
    
    $scope.Lista_Local = [];
    $scope.get_Listando_Locales = function () {
        $scope.loaderfiltros = true;
        LocalesServices.get_Locales_Usuario(auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Local = [];
                $scope.Lista_Local = data;
                setTimeout(function () {
                    $('#cbo_local').val("1").trigger('change.select2');
                }, 100);
                $scope.change_Local_Almacen(1)
                $scope.Listando_Vendedores();
            }, function (err) {
                console.log(err);
            });
    };


    $scope.Lista_Transportista = [];
    $scope.get_Listando_Transportistas = function () {
        $scope.loaderfiltros = true;
        EntregaPedidoServices.getListarTransportista()
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Transportista = [];
                $scope.Lista_Transportista = data;
                setTimeout(function () {
                    $('#cbo_transportista').val("0").trigger('change.select2');
                }, 100);
            }, function (err) {
                console.log(err);
            });
    };


    $scope.Lista_Vendedor = [];
    $scope.Listando_Vendedores = function () {
        $scope.loaderfiltros = true;
        PersonalServices.getPersonales()
            .then(function (data) {
                $scope.Lista_Vendedor = [];
                for (obj of data) {
                    if (obj.id_cargo_personal == 6 || obj.id_cargo_personal == '6') {
                        $scope.Lista_Vendedor.push(obj);
                    }
                }
                $scope.loaderfiltros = false; 
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
                    $('#cbo_almacen').val("1").trigger('change.select2');
                }, 300);
            }, function (err) {
                console.log(err);
            });
    };


    $scope.listaPedido_Cab = [];
    $scope.listaPedido_Det = [];
    $scope.loaderfiltrosDet = false;

    $scope.ActualizarPedidosCab = function () {
        if ($scope.Objeto_ParametroFiltro.id_local == 0 || $scope.Objeto_ParametroFiltro.id_local == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Local, verifique', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.Objeto_ParametroFiltro.id_almacen == 0 || $scope.Objeto_ParametroFiltro.id_almacen == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Almacen, verifique', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.Objeto_ParametroFiltro.fecha_ini == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Fecha, verifique', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.Objeto_ParametroFiltro.id_tipoEntrega == 0 || $scope.Objeto_ParametroFiltro.id_tipoEntrega == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Tipo de Entrega, verifique', 'error', '#ff6849', 1500);
            return;
        }


        document.getElementById("form_cabecera").style.display = "none";
        document.getElementById("form_detalle").style.display = "none";

        $scope.loaderfiltros = true;
        id_Pedido_Cab_GLOBAL = 0
        $scope.seleccionado = 0;
        AprobarDevolucionServices.getActualizarPedidos_Cab($scope.Objeto_ParametroFiltro)
            .then(function (res) {
                $scope.loaderfiltros = false;
                if (res.ok == true) {
                    $scope.listaPedido_Cab = [];
                    $scope.listaPedido_Det = [];
                    $scope.listaPedido_Cab = res.data;
                    document.getElementById("form_cabecera").style.display = "";
                    $timeout(function () {
                        $("#tbl_cabecera").tableHeadFixer({ "left": 4 });
                    }, 500);
                } else {
                    document.getElementById("form_cabecera").style.display = "none";
                    auxiliarServices.NotificationMessage('Sistemas', 'Ocurrio un error', 'error', '#ff6849', 1500);
                    alert(res.data)
                }

            }, function (error) {
                $scope.loaderfiltros = false;
                console.log(error)
            });
    }      

    var id_Pedido_Cab_GLOBAL = 0;
    $scope.ActualizarPedidosDet = function (obj) {

        id_Pedido_Cab_GLOBAL = obj.id_Pedido_Cab;
        $scope.seleccionado = id_Pedido_Cab_GLOBAL;
 
        $scope.loaderfiltrosDet = true;
        document.getElementById("form_detalle").style.display = "none";
        AprobarDevolucionServices.getActualizarPedidos_Det(obj.id_Pedido_Cab)
            .then(function (res) {
                $scope.loaderfiltrosDet = false;
                if (res.ok == true) {
                    $scope.listaPedido_Det = [];
                    $scope.listaPedido_Det = res.data;
                    document.getElementById("form_detalle").style.display = "";

                    $timeout(function () {
                        $("#tbl_detalle").tableHeadFixer({ "left": 3 });
                    }, 500);

                } else {
                    document.getElementById("form_detalle").style.display = "none";
                    auxiliarServices.NotificationMessage('Sistemas', 'Ocurrio un error', 'error', '#ff6849', 1500);
                    alert(res.data)
                }

            }, function (error) {
                $scope.loaderfiltrosDet = false;
                console.log(error)
            });
    }  


    $scope.AbrirModal_AprobarDevolucion = function () {
        $('#dtp_fecha_aprobar').datepicker('setDate', null);
        console.log('entro modal')
        $scope.Objeto_ParametroFiltro.fecha_aprobacion = auxiliarServices.getDateNow();
        $scope.Objeto_ParametroFiltro.numero_notacredito = '';

        $('#modalAprobarDevolucion').modal('show');
    };


    $scope.generar_AprobarDevolucion = function () {  

        if (id_Pedido_Cab_GLOBAL == '' || id_Pedido_Cab_GLOBAL == 0 || id_Pedido_Cab_GLOBAL == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Pedido ', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.Objeto_ParametroFiltro.fecha_aprobacion == '' || $scope.Objeto_ParametroFiltro.fecha_aprobacion == 0 || $scope.Objeto_ParametroFiltro.fecha_aprobacion == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la fecha de Aprobacion, verifique', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.Objeto_ParametroFiltro.numero_notacredito == '' || $scope.Objeto_ParametroFiltro.numero_notacredito == 0 || $scope.Objeto_ParametroFiltro.numero_notacredito == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el número de nota de credito, verifique', 'error', '#ff6849', 1500);
            return;
        }

        $scope.loaderfiltros = true; 
        AprobarDevolucionServices.setGenerarAprobacionDevolucion(id_Pedido_Cab_GLOBAL, $scope.Objeto_ParametroFiltro.fecha_aprobacion, $scope.Objeto_ParametroFiltro.numero_notacredito, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderfiltros = false;
                if (res == "OK") {
                    id_Pedido_Cab_GLOBAL = 0;
                    $scope.seleccionado = 0;

                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'La Aprobacion de la Devolucion se realizo correctamente.. !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {

                    });
                    $scope.ActualizarPedidosCab();
                    $('#modalAprobarDevolucion').modal('hide');
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Ocurrio un error', 'error', '#ff6849', 1500);
                    alert(res)
                }
            }, function (error) {
                $scope.loaderfiltros = false;
                console.log(error)
            });
    }

    $scope.change_aprobar = function (tipoEntrega) {
        if (tipoEntrega == 0) {
            $("#btnAprobar").prop('disabled', true);
            return;
        } else {
            if (tipoEntrega == 1) {
                $("#btnAprobar").prop('disabled', true);
            } else {
                $("#btnAprobar").prop('disabled', false);
            }   
        }
    }
  

    
})