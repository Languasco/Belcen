var app = angular.module('appGestion.ImportarStockAlmacenController', [])
app.controller('CtrlImportarStockAlmacen', function ($scope, $location, $timeout, auxiliarServices, ImportarServices, LocalesServices, ImportarStockAlmacenServices ) {    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2); 
        auxiliarServices.changeTitle("Importar Stock por Almacén");
        $scope.titleModal = "Importar Stock por Almacén";
        $scope.loaderSave = false; 
        var btnSubir = document.getElementById('btnSubir');

       $timeout(function () {
           btnSubir.disabled = false;  
        }, 500);
    } 
    
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
    
    $scope.Objeto_ParametroFiltro = {
        id_almacen : '0'
    };         

    $scope.myFile;
    $scope.NameArchivo = ' Ningun Archivo Seleccionado.';
    $scope.onFilesSelected = function (files) {
        $scope.myFile = files;
        $scope.NameArchivo = files[0].name;
    };



    $scope.Lista_Almacen = [];
    $scope.get_Listando_Locales = function () {
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
    
    $scope.get_Listando_Locales();



    $scope.uploadFile = function () {
        if ($scope.Objeto_ParametroFiltro.id_almacen == 0 || $scope.Objeto_ParametroFiltro.id_almacen == '0' || $scope.Objeto_ParametroFiltro.id_almacen == null || $scope.Objeto_ParametroFiltro.id_almacen == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Almacen ', 'error', '#ff6849', 2000);
            return;
        }


        if ($scope.myFile === undefined || $scope.myFile === '' || $scope.myFile === null) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por Favor seleccione el Archivo', 'error', '#ff6849', 2500);
            return;
        }
        var btnSubir = document.getElementById('btnSubir');

        $scope.loaderfiltros = true;
        ImportarStockAlmacenServices.uploadFileExcel_stockAlmacen($scope.myFile, auxiliarServices.getUserId(),$scope.Objeto_ParametroFiltro.id_almacen )
            .then(function (data) {
                $scope.loaderfiltros = false;
                if (data.ok == true || data == 'true') {

                    btnSubir.disabled = true; 
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Se cargó el archivo correctamente !'
                    };
                    auxiliarServices.initSweetAlert(params).then(function (res) {

                    });
                    $scope.myFile = null;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error.', 'error', '#ff6849', 2500);
                    alert(data.data);
                }
            }, function (error) {
                $scope.loaderfiltros = false;
                alert(error.ExceptionMessage)
            });
    };

    $scope.limpiar = function () {
        $scope.myFile = null;
        $scope.NameArchivo = ' Ningun Archivo Seleccionado.';
        $scope.Objeto_ParametroFiltro.fecha_ini =  auxiliarServices.getDateNow();
    };


    $scope.downloadFormat = function () {
        window.open('../belcen/Content/format/FORMATO_STOCK_DIARIO.xlsx', '_blank');
    }


     
})