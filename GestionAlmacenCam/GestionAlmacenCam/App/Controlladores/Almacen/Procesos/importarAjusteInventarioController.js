var app = angular.module('appGestion.importarAjusteInventarioController', [])
app.controller('importarAjusteInventarioController', function ($scope, $location, $timeout, auxiliarServices, AlmacenServices, LocalesServices, importarAjusteInventarioServices ) {
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }

         auxiliarServices.menuHideShow(2); 
        auxiliarServices.changeTitle("Importar Ajuste Inventario");
        $scope.titleModal = "Importar Ajuste Inventario";
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
    
    $scope.Objeto_Parametro_Filtro = {
        idLocal: "0",
        idAlmacen: "0",
        fecha: auxiliarServices.getDateNow(),
        idMovimiento: '0',
        nroDoc : ''
    };

    $scope.myFile;
    $scope.NameArchivo = ' Ningun Archivo Seleccionado.';
    $scope.onFilesSelected = function (files) {
        $scope.myFile = files;
        $scope.NameArchivo = files[0].name;
    };

    $scope.tiposMovimientos = [];
    $scope.get_Listando_tipoMovimiento= function () {
        $scope.loaderfiltros = true;
        importarAjusteInventarioServices.get_tipoMovimientos(auxiliarServices.getUserId())
            .then(function (res) {

                if (res.ok == true) {
                    $scope.loaderfiltros = false;
                    $scope.tiposMovimientos = [];
                    $scope.tiposMovimientos = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }             


            }, function (err) {
                console.log(err);
            });
    };    
    $scope.get_Listando_tipoMovimiento();

    $scope.listLocales = [];
    $scope.getLocales = function () {
        $scope.loaderFiltro = true;
        LocalesServices.get_Locales_Usuario($scope.id_usuario_Global)
            .then(function (data) {
                $scope.loaderFiltro = false;
                $scope.listLocales = [];
                $scope.listLocales = data;
                setTimeout(function () {
                    $('#selectLocales').val("0").trigger('change.select2');
                }, 500);

            }, function (err) {
                console.log(err);
            });
    };
    $scope.getLocales();

    $scope.changeSelect = function (select, idSelect) { 
            AlmacenServices.getAlmacenesLocal(idSelect).then(function (res) {
                // SI NO DEVUELVE NINGUN ALMACEN DE ESTE LOCAL, LIMPIAMOS Y REGRESAMOS VALOR ALMACEN A 0
                if (res.length === 0) {
                    $scope.listAlmacenes = [];
                    $scope.Objeto_Parametro_Filtro.idAlmacen = "0";
                    $timeout(function () {
                        $('#selectLocales').val("0").trigger('change.select2');
                        $('#selectAlmacen').val("0").trigger('change.select2');
                        console.log(321321);
                    });
                    return;
                }
                //
                // SI DEVUELVE VALORES ENTONCES LLENAMOS SELECT ALMACEN Y SELECCIONAMOS EL PRIMER VALOR
                $scope.listAlmacenes = res;
                var newValue = String(res[0].id_Almacen);
                $scope.Objeto_Parametro_Filtro.idAlmacen = newValue;
                $timeout(function () {
                    $('#selectAlmacen').val(newValue).trigger('change.select2');
                });
            }, function (err) {
                console.log(err);
            });
    };

    $scope.list_ajusteInventario = [];

    $scope.flagError = false;

    $scope.uploadFile = function () {
        if ($scope.Objeto_Parametro_Filtro.idLocal == 0 || $scope.Objeto_Parametro_Filtro.idLocal == '0' || $scope.Objeto_Parametro_Filtro.idLocal == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccionar un Local ', 'error', '#ff6849', 2000);
            return;
        }
        if ($scope.Objeto_Parametro_Filtro.idAlmacen == 0 || $scope.Objeto_Parametro_Filtro.idAlmacen == '0' || $scope.Objeto_Parametro_Filtro.idAlmacen == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccionar un Almacen ', 'error', '#ff6849', 2000);
            return;
        }
        if ($scope.Objeto_Parametro_Filtro.fecha == null || $scope.Objeto_Parametro_Filtro.fecha == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Fecha ', 'error', '#ff6849', 2000);
            return;
        }
        if ($scope.Objeto_Parametro_Filtro.idMovimiento == 0 || $scope.Objeto_Parametro_Filtro.idMovimiento == '0' || $scope.Objeto_Parametro_Filtro.idMovimiento == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Movimiento ', 'error', '#ff6849', 2000);
            return;
        }
        if ($scope.Objeto_Parametro_Filtro.nroDoc == null || $scope.Objeto_Parametro_Filtro.nroDoc == '' || $scope.Objeto_Parametro_Filtro.nroDoc == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nro de Documento', 'error', '#ff6849', 2000);
            return;
        }

        if ($scope.myFile === undefined || $scope.myFile === '' || $scope.myFile === null) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por Favor seleccione el Archivo', 'error', '#ff6849', 2500);
            return;
        }
        var btnSubir = document.getElementById('btnSubir');

        $scope.loaderfiltros = true;
        importarAjusteInventarioServices.uploadFileExcel_ajusteInventario($scope.myFile, auxiliarServices.getUserId(), $scope.Objeto_Parametro_Filtro  )
            .then(function (res) {
                $scope.loaderfiltros = false;
                if (res.ok == true) {
                    $scope.list_ajusteInventario = res.data;
                    btnSubir.disabled = true;
                    auxiliarServices.NotificationMessage('Sistemas', 'El archivo se cargo en el servidor', 'success', '#ff6849', 2000);

                    $scope.flagError = false;
                    for (item of $scope.list_ajusteInventario) {
                        if (item.idError > 0) {
                            alert('El archivo que cargó presenta error, corrijalo por favor')
                            $scope.flagError = true;
                            break;
                        }
                    }
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error.', 'error', '#ff6849', 2500);
                    alert(data.data);
                }
            }, function (error) {
                $scope.loaderfiltros = false;
                alert(error.ExceptionMessage)
            });
    };

    $scope.downloadFormat = function () {
        window.open('../belcen/Content/format/FORMATO_IMPORTACION_AJUSTE.xlsx', '_blank');
    }
    
    $scope.guardar_informacionAjusteInventario = function () {

        var params = {
            title: "Desea Grabar ?",
            text: 'Esta seguro porque una vez enviado no hay marcha Atras',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {

                if ($scope.Objeto_Parametro_Filtro.idLocal == 0 || $scope.Objeto_Parametro_Filtro.idLocal == '0' || $scope.Objeto_Parametro_Filtro.idLocal == '') {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccionar un Local ', 'error', '#ff6849', 2000);
                    return;
                }
                if ($scope.Objeto_Parametro_Filtro.idAlmacen == 0 || $scope.Objeto_Parametro_Filtro.idAlmacen == '0' || $scope.Objeto_Parametro_Filtro.idAlmacen == '') {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccionar un Almacen ', 'error', '#ff6849', 2000);
                    return;
                }
                if ($scope.Objeto_Parametro_Filtro.fecha == null || $scope.Objeto_Parametro_Filtro.fecha == '') {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Fecha ', 'error', '#ff6849', 2000);
                    return;
                }
                if ($scope.Objeto_Parametro_Filtro.idMovimiento == 0 || $scope.Objeto_Parametro_Filtro.idMovimiento == '0' || $scope.Objeto_Parametro_Filtro.idMovimiento == '') {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Movimiento ', 'error', '#ff6849', 2000);
                    return;
                }
                if ($scope.Objeto_Parametro_Filtro.nroDoc == null || $scope.Objeto_Parametro_Filtro.nroDoc == '' || $scope.Objeto_Parametro_Filtro.nroDoc == undefined) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nro de Documento', 'error', '#ff6849', 2000);
                    return;
                }

                if ($scope.myFile === undefined || $scope.myFile === '' || $scope.myFile === null) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por Favor seleccione el Archivo', 'error', '#ff6849', 2500);
                    return;
                }
                let btnGrabar = document.getElementById('btnGrabar');

                $scope.loaderfiltros = true;
                importarAjusteInventarioServices.set_grabarAjusteInventario(auxiliarServices.getUserId(), $scope.Objeto_Parametro_Filtro)
                    .then(function (res) {
                        $scope.loaderfiltros = false;
                        console.log(res);
                        if (res.ok == true) {
                            btnGrabar.disabled = true;
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Se grabó el archivo correctamente !'
                            };
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });
                        } else {
                            auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error.', 'error', '#ff6849', 2500);
                            alert(data.data);
                        }
                    }, function (error) {
                        $scope.loaderfiltros = false;
                        alert(error.ExceptionMessage)
                    });
 
            }
        });

    }

     
})