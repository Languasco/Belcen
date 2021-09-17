var app = angular.module('appGestion.AnularDocumentosController', [])
app.controller('CtrlAnularDocumento', function ($scope, $location, $timeout, auxiliarServices, CobranzaReporteServices, CobranzaManualServices, Documentos_MasivosServices, AlmacenServices, RevisionPedidoServices ) {
    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2); 
        auxiliarServices.changeTitle("ANULACION DE DOCUMENTOS");

        $scope.titleModal = "Cobranza Manual";
        $scope.loading = false;

        setTimeout(function () {
            $(".selectFiltros").select2();
        }, 100);

        $timeout(function () {
            $('#cbo_zonaVenta').val('0').trigger('change.select2');
            $('#cbo_anexo').val('0').trigger('change.select2');
            $('#cbo_almacen').val('0').trigger('change.select2');
            $('#cbo_tipoDoc').val('0').trigger('change.select2');
        })

/*        $scope.getAnexos();*/
        $scope.getZonaVentas();
        $scope.getTipoDoc();

    }

    $scope.objeto_parametros = {
        id_zonaVenta: '0',
        id_almacen:'0',
        id_anexo: '0',
        id_tipoDoc: '0',
        serie: '',
        numero: '',
        id_usuario: auxiliarServices.getUserId()
    }

    $scope.lista_anexos = [];
    $scope.getAnexos = function () {
        $scope.loading = true;
        CobranzaReporteServices.get_anexo().then(function (res) {
            $scope.loading = false;
            if (res.ok == true) {
                $scope.lista_anexos = [];
                $scope.lista_anexos = res.data;
                $timeout(function () {
                    $('#cbo_anexo').val('0').trigger('change.select2');
                })
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
            }
        }, function (err) {
                $scope.loading = false;
            console.log(err);
        });
    };
    
    $scope.lista_almacenes = [];
    $scope.change_Local_Almacen = function (idlocal) {
        $scope.loaderFiltro = true;
        AlmacenServices.get_ListadoAlmacenes_Local_Usuario(idlocal, auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderFiltro = false;
                $scope.lista_almacenes = [];
                $scope.lista_almacenes = data;
                setTimeout(function () {
                    $scope.objeto_parametros.id_almacen = '0';
                    $('#cbo_almacen').val("0").trigger('change.select2');

                    $scope.lista_anexos = [];
                    $scope.objeto_parametros.id_anexo = '0';
                    $('#cbo_anexo').val('0').trigger('change.select2');
                }, 0);
            }, function (err) {
                $scope.loaderFiltro = false;
                console.log(err);
            });
    };

    $scope.lista_anexos = [];
    $scope.change_almacen_anexo = function (idAlmacen) {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_Anexos_Almacen(idAlmacen).then(function (res) {
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




    $scope.Lista_Zona = [];
    $scope.getZonaVentas = function () {
        $scope.loaderFiltro = true;
        Documentos_MasivosServices.get_zonasUsuario(auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    $scope.Lista_Zona = [];
                    $scope.Lista_Zona = res.data;
                    $timeout(function () {
                        $scope.objeto_parametros.id_zonaVenta = '0';
                        $('#cbo_zonaVenta').val("0").trigger('change.select2');
                    })
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                console.log(err);
            });
    };
 
    

    $scope.lista_tipoDoc = [];
    $scope.getTipoDoc = function () {
        $scope.loading = true;
        CobranzaManualServices.get_tipoDoc().then(function (res) {
            $scope.loading = false;
            if (res.ok == true) {
                $scope.lista_tipoDoc = [];
                $scope.lista_tipoDoc = res.data;
                $timeout(function () {
                    $('#cbo_tipoDoc').val('0').trigger('change.select2');
                })
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
            }
        }, function (err) {
                $scope.loading = false;
            console.log(err);
        });
    };
    


    $scope.AnularDocumento = function () {

        if ($scope.objeto_parametros.id_zonaVenta == 0) {
            return auxiliarServices.NotificationMessage('Sistemas', 'Seleccione un Zona de Venta', 'error', '#ff6849', 2000);
        }
        if ($scope.objeto_parametros.id_almacen == 0) {
            return auxiliarServices.NotificationMessage('Sistemas', 'Seleccione un Almacen', 'error', '#ff6849', 2000);
        }
        if ($scope.objeto_parametros.id_anexo == 0) {
            return auxiliarServices.NotificationMessage('Sistemas', 'Seleccione un Anexo', 'error', '#ff6849', 2000);
        }
        if ($scope.objeto_parametros.id_tipoDoc == 0) {
            return auxiliarServices.NotificationMessage('Sistemas', 'Seleccione Tipo de Documento', 'error', '#ff6849', 2000);
        }
        if ($scope.objeto_parametros.serie == '' || $scope.objeto_parametros.serie == null || $scope.objeto_parametros.serie == undefined) {
            return auxiliarServices.NotificationMessage('Sistemas', 'Ingrese una Serie', 'error', '#ff6849', 2000);
        }
        if ($scope.objeto_parametros.numero == '' || $scope.objeto_parametros.numero == null || $scope.objeto_parametros.numero == undefined) {
            return auxiliarServices.NotificationMessage('Sistemas', 'Ingrese un Nro. de Documento', 'error', '#ff6849', 2000);
        }
        $scope.loading = true;

        CobranzaManualServices.anular_documento($scope.objeto_parametros)
            .then(function (data) {
                $timeout(function () {
                    $('#modalMantenimiento').modal('hide');
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Se anulo correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {

                    });
                    $scope.loading = false;
                }, 500)
            }, function (error) {
                $timeout(function () {
                    let paramsErr = {
                        type: 'error',
                        title: 'Error !',
                        text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                    }
                    auxiliarServices.initSweetAlert(paramsErr).then(function (res) {
                        $('#modalMantenimiento').modal('hide');
                    });
                    $scope.loading = false;
                    console.log(err);
                }, 500)
            })
    }

})

 