var app = angular.module('appGestion.ImportarPrecioController', [])
app.controller('CtrlImportarPrecio', function ($scope, $location, $timeout, auxiliarServices, ImportarPrecioServices ) {    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2); 
        auxiliarServices.changeTitle("Importar Precio");
        $scope.titleModal = "Importar Precio";
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
        tipoImportacion: '1',
    };         

    $scope.myFile;
    $scope.NameArchivo = ' Ningun Archivo Seleccionado.';
    $scope.onFilesSelected = function (files) {
        $scope.myFile = files;
        $scope.NameArchivo = files[0].name;
    };

     $scope.uploadFile = function () {
 

        if ($scope.myFile === undefined || $scope.myFile === '' || $scope.myFile === null) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por Favor seleccione el Archivo', 'error', '#ff6849', 2500);
            return;
        }
        var btnSubir = document.getElementById('btnSubir');

        $scope.loaderfiltros = true;
         ImportarPrecioServices.uploadFileExcel_precio($scope.myFile, auxiliarServices.getUserId(), $scope.Objeto_ParametroFiltro.tipoImportacion )
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
    };


    $scope.downloadFormat = function () {
        window.open('../belcen/Content/format/FORMATO_IMPORTAR_PRECIO.xlsx', '_blank');
    }


     
})