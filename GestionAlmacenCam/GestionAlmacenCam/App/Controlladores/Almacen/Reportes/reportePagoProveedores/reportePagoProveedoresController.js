var app = angular.module('appGestion.reportePagoProveedoresController', [])

app.controller('reportePagoProveedoresController', function ($scope, $location, $timeout, auxiliarServices, ReimpresionServices, ProveedorServices, PagoProveedoresServices) {
    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;
 
        auxiliarServices.changeTitle("Reporte Pagos Proveedores");
        $scope.titleModal = "Reporte Pago de Proveedores";
        $scope.disabledContent = "";
        $scope.loaderSave = false;

        $scope.id_usuario_Global = auxiliarServices.getUserId();

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
        }, 0);
    }

    //--- variables Globales

    $scope.id_usuario_Global = 0; 
    $scope.Flag_modoEdicion = false;
        
    $scope.disabledEncabezado = "disabledContent";
    $scope.disabledProd = "disabledContent";
    $scope.disabledForm = "disabledContent";
 
    $scope.Flag_modoEdicion_Det = false;

    $scope.listadetalle_documentos = []
    $scope.listBusqueda = [];
           
    $scope.Objeto_Parametro_Filtro = {
        tipoReporte: '1',
        id_Proveedor: '1',
        nroDocumento_Proveedor: '20601832616',
        razonSocial_Proveedor: '',
        tipoDocumentos: '1',
        idUsuario: $scope.id_usuario_Global
    };
         
    var oTable;
    $scope.ModalSearch = function (value) {
        var filter = document.getElementById('inputSearch');
        $timeout(function () {
            $scope.searchFilter = '';
            filter.value = "";
        }, 100)
        $scope.valueAux = value;

        $('#ModalSearch').modal('show');

        $scope.showProv = true;
        $scope.loaderModal = true;
        $scope.titleModal = "Busqueda de Proveedores";

        var params = {
            filter: filter.value
        }
        $scope.listBusqueda = [];
        ProveedorServices.getProveedor(params)
            .then(function (res) {

                res.forEach(function (item, index) {
                    $scope.listBusqueda.push({
                        id: index,
                        id_select: item.id_Proveedor,
                        codigo: item.nroDocumento_Proveedor,
                        descripcion: item.razonSocial_Proveedor
                    });
                });
                $timeout(function () {
                    filter.focus();
                }, 500)
                $timeout(function () {
                    if (oTable !== 'res') {
                        oTable = 'res';
                        auxiliarServices.initFooTable('tblFiltro', 'inputSearch');
                    } else {
                        $('#tblFiltro').trigger('footable_initialize');
                    }
                });
                $scope.loaderModal = false;
            });


    }

    $scope.getProveedorByDoc = function () {

        $scope.loaderFiltro = true;
        var params = {
            filter: $scope.Objeto_Parametro_Filtro.nroDocumento_Proveedor
        }
        ProveedorServices.getProveedor(params).then(function (res) {
            $timeout(function () {
                $scope.loaderFiltro = false;
                if (res.length == 0) {
                    $scope.Objeto_Parametro_Filtro.razonSocial_Proveedor = "";
                    $scope.Objeto_Parametro_Filtro.id_Proveedor = 0;
                    auxiliarServices.NotificationMessage('Sistemas', 'No se encontro el Proveedor', 'error', '#ff6849', 1500);
                    return false;
                } else {
                    $scope.Objeto_Parametro_Filtro.razonSocial_Proveedor = res[0].razonSocial_Proveedor;
                    $scope.Objeto_Parametro_Filtro.id_Proveedor = res[0].id_Proveedor;
                }
            }, 0)
        }, function (err) {
            $scope.loaderFiltro = true;
            console.log(err);
        });
    }

    $scope.disabledContent = '';

    $scope.change_TipoReporte = function () {
        if ($scope.Objeto_Parametro_Filtro.tipoReporte == 1) {
            $scope.disabledContent = '';
        }
        if ($scope.Objeto_Parametro_Filtro.tipoReporte == 2) {
            $scope.disabledContent = 'disabledContent';
            $scope.Objeto_Parametro_Filtro.id_Proveedor = '0';
            $scope.Objeto_Parametro_Filtro.nroDocumento_Proveedor = '';
            $scope.Objeto_Parametro_Filtro.razonSocial_Proveedor = '';
        }
    }

    $scope.lista_documentos = [];
    $scope.descargar_reportePagoProveedores = function () {

        if ($scope.Objeto_Parametro_Filtro.tipoReporte == 2) {
 
            if ($scope.Objeto_Parametro_Filtro.id_Proveedor == 0 || $scope.Objeto_Parametro_Filtro.id_Proveedor == '0') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor busque el Proveedor..', 'error', '#ff6849', 1500);
                return;
            }

            if ($scope.Objeto_Parametro_Filtro.nroDocumento_Proveedor == undefined || $scope.Objeto_Parametro_Filtro.nroDocumento_Proveedor == null || $scope.Objeto_Parametro_Filtro.nroDocumento_Proveedor == '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor busque el Proveedor..', 'error', '#ff6849', 1500);
                return;
            }

        }


        $scope.loaderFiltro = true;
        PagoProveedoresServices.get_descargarReportePagosProveedores($scope.Objeto_Parametro_Filtro).then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {
                window.open(res.data);
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
        }, function (err) {
            $scope.loaderFiltro = false;
            console.log(err);
        });
    };
 


         
})
