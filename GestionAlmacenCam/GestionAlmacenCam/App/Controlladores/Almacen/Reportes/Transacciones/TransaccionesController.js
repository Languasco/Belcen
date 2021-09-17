var app = angular.module('appGestion.TransaccionesController', []);
app.controller('TransaccionesController', function ($scope, $location, $timeout, auxiliarServices, TransaccionesServices, RevisionPedidoServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loaderFiltro = false;

        auxiliarServices.changeTitle("Consulta de Transacciones");
        $scope.titleModal = "Consulta de Transacciones";
  
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy'
            });
        }, 0);

        setTimeout(function () {
            $(".selectFiltros").select2();
            $(".selectModal").select2();
        }, 100);
    }

    $scope.Objeto_Parametro_Filtro = { 
        anexo: '0',
        almacen: '0',
        tipoReporte: '1',
        fechaIni: auxiliarServices.formatDateNow(),
        fechaFin: auxiliarServices.formatDateNow(),
        idProducto : '0',
        codigoProducto: '',
        descripcionProducto: ''
    }

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


    $scope.Lista_Almacen = [];
    $scope.listados_changeAlmacenes = function (id_Anexos) {

        $scope.loaderFiltro = true;
        TransaccionesServices.get_almacen_anexo(id_Anexos, auxiliarServices.getUserId())
            .then(function (res) {

                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    $scope.Lista_Almacen = [];
                    $scope.Lista_Almacen = res.data;
                    $timeout(function () {
                        $scope.Objeto_Parametro_Filtro.almacen = '0';
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


    $scope.BuscarProducto = function () {

        if ($scope.Objeto_Parametro_Filtro.codigoProducto === '0' || $scope.Objeto_Parametro_Filtro.codigoProducto === '' || $scope.Objeto_Parametro_Filtro.codigoProducto === null || $scope.Objeto_Parametro_Filtro.codigoProducto === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo del Producto', 'error', '#ff6849', 1500);
            return;
        }

        $scope.Objeto_Parametro_Filtro.idProducto = '0';
        $scope.Objeto_Parametro_Filtro.descripcionProducto = '';
 
        $scope.loaderSave = true;
        TransaccionesServices.get_buscarProducto($scope.Objeto_Parametro_Filtro.anexo, $scope.Objeto_Parametro_Filtro.almacen, $scope.Objeto_Parametro_Filtro.codigoProducto)
            .then(function (res) {
                $scope.loaderSave = false;
                if (res.ok == true) {
                    if (res.data.length > 0) {
                        $scope.Objeto_Parametro_Filtro.idProducto = res.data[0].idProducto;
                        $scope.Objeto_Parametro_Filtro.descripcionProducto = res.data[0].descripcionProducto;
 
                        $timeout(function () {
                            $('#btnDescargar').focus().select();
                        }, 0);

                    } else {
                        $scope.Objeto_Parametro_Filtro.idProducto = '0';
                        $scope.Objeto_Parametro_Filtro.descripcionProducto = 'No se encontró información con el Código ingresado';
                        auxiliarServices.NotificationMessage('Sistemas', 'No se encontro resultado con el codigo del Producto ingresado, verifique.', 'error', '#ff6849', 3000);
                    }
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderSave = false;
                console.log(err);
            });
    };

    $scope.descargarExcel_transacciones = function () {
        $scope.loaderSaveD = true;
        TransaccionesServices.get_descargarExcel($scope.Objeto_Parametro_Filtro.anexo, $scope.Objeto_Parametro_Filtro.almacen, $scope.Objeto_Parametro_Filtro.fechaIni, $scope.Objeto_Parametro_Filtro.fechaFin, $scope.Objeto_Parametro_Filtro.tipoReporte, $scope.Objeto_Parametro_Filtro.codigoProducto)
            .then(function (res) {
                if (res.ok == true) {
                    $scope.loaderSaveD = false;

                    const id_link = document.getElementById('id_link');
                    setTimeout(function () {
                        id_link.href = res.data;
                        id_link.click();
                    }, 0);

                } else {
                    $scope.loaderSaveD = false;
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                $scope.loaderSaveD = false;
                console.log(error)
            })
    }


 
});
