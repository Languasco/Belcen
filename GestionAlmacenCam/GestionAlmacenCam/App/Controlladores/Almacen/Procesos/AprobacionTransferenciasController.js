var app = angular.module('appGestion.AprobacionTransferenciasController', [])

app.controller('CtrlAprobacionTransferenciasController', function ($scope, IngresoTransferenciasServices, auxiliarServices, ProveedorServices, $timeout, LocalesServices, AlmacenServices, TransportistaServices, VehiculoServices) {
    $scope.loaderPage = true;
    $scope.loaderDet = false;
    $scope.initAll = function () {
        $scope.loaderPage = true;
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        auxiliarServices.changeTitle("Aprobación de Transferencias");
        $scope.getLocales(1);
 
        $scope.Listando_Transportista();
        $timeout(function () {
            $scope.loaderPage = false;
            $('.filterLocales').select2();
            $('.filterAlmacen').select2();
        }, 0)
    };

    $scope.objFilter = {
        id_Local: "0",
        id_Almacen: '0',
        opcion: '1'
    }

    $('document').ready(function () {
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy',
            });
        }, 500);
    });

    $scope.getLocales = function (value) {
        LocalesServices.get_Locales_Usuario(auxiliarServices.getUserId())
        .then(function (res) {

            $scope.listLocales = res;
            //$('.filterLocales').select2();
            //$('.filterAlmacen').select2();
        }, function (err) {
            console.log(err);
        })
    };

    $scope.getTransferencias = function () {

        if ($scope.objFilter.id_Local == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por  favor seleccione un Local', 'error', '#ff6849', 3000);            
            return
        }
        if ($scope.objFilter.id_Almacen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por  favor seleccione un Almacen', 'error', '#ff6849', 3000); 
            return
        }

        //var filter = $scope.objFilter.id_Local + '|' + $scope.objFilter.id_Almacen + '|' + $scope.objFilter.opcion;
        $scope.loaderDet = true;      
        IngresoTransferenciasServices.getTransferencias_new($scope.objFilter.id_Local, $scope.objFilter.id_Almacen, $scope.objFilter.opcion )
       .then(function (res) {
            $scope.loaderDet = false;
 
            res.forEach(function (item, index) {
                if (item.estado == 1) {
                    item['desEstado'] = "Generado";
                    item['colorEstado'] = "success";
                } else if (item.estado == 0) {
                    item['desEstado'] = "Anulado";
                    item['colorEstado'] = "danger";
                } else if (item.estado == 24) {
                    item['desEstado'] = "Generado";
                    item['colorEstado'] = "info";
                }
            });
           $scope.listTransferencias = res;
           $scope.listMaterialesTransf = [];

            console.log($scope.listTransferencias);
            $timeout(function () { auxiliarServices.initFooTable('tblProductos', 'inputSearch'); }, 1000)

       }, function (err) {
           $scope.loaderProd = false;
            console.log(err);
        });
    };
    
    $scope.changeSelect = function (idSelect) {
        $scope.loaderCab = true;
        console.log(idSelect);
        AlmacenServices.getAlmacenesLocal(idSelect).then(function (res) {
            // SI NO DEVUELVE NINGUN ALMACEN DE ESTE LOCAL, LIMPIAMOS Y REGRESAMOS VALOR ALMACEN A 0
            console.log(res);
            if (res.length == 0) {
                $scope.listAlmacenesEntrega = [];
                $scope.objFilter.id_Almacen= "0";
                $timeout(function () {
                    $('#selectAlmacenEntrega').val("0").trigger('change.select2');
                    $scope.loaderCab = false;
                })
                return;
            }            
            // SI DEVUELVE VALORES ENTONCES LLENAMOS SELECT ALMACEN Y SELECCIONAMOS EL PRIMER VALOR
            $scope.listAlmacenesEntrega = res;

            var newValue;

            // CUANDO ES NUEVO
            newValue = String(res[0].id_Almacen);
            $scope.objFilter.id_Almacen= newValue;
            // TRAEMOS EL STOCK                    
            //$scope.loaderDet = true;

            $timeout(function () {
                $('#selectAlmacenEntrega').val(newValue).trigger('change.select2');
                $scope.loaderCab = false;
            });
        }, function (err) {
            console.log(err);
        });
    }

    $scope.listMaterialesTransf =[]
    $scope.GetDetalleTransferencia = function (obj) {
        $scope.loaderDet = true;
        IngresoTransferenciasServices.get_DetalleTransferencia(obj.Id_AlmTranCab)
        .then(function (data) {
 
            $scope.loaderDet = false;
            $scope.listMaterialesTransf = []
            $scope.listMaterialesTransf = data;
            $timeout(function () { auxiliarServices.initFooTable('tbl_DetalleTransf', 'inputSearch'); }, 1000)
        }, function (error) {
            $scope.loaderDet = false;
            console.log(error)
        })        
    }


    $scope.objeto_parametros = {
        serie: '',
        nroDocumento: '',
        fecha_emision: '',
        fecha_emisionAux:'',
        id_Transportista: 0,
        rucTransportista: '',
        id_vehiculo: 0,
        vehiculo_Placa: '',
        id_Proveedor: 0,
        direccion_Proveedor: '',
        fecha_traslado: '',
        fecha_trasladoAux:''
    }

    $scope.clean = function () {
 
        $scope.objeto_parametros.serie = '';
        $scope.objeto_parametros.nroDocumento = '';
        $scope.objeto_parametros.fecha_emision = '';
        $scope.objeto_parametros.fecha_emisionAux = '';        
        $scope.objeto_parametros.id_Transportista = '0';
        $scope.objeto_parametros.rucTransportista = '';
        $scope.objeto_parametros.id_vehiculo = '0';
        $scope.objeto_parametros.vehiculo_Placa = '';
        $scope.objeto_parametros.id_Proveedor = '0';
        $scope.objeto_parametros.direccion_Proveedor = '';
        $scope.objeto_parametros.fecha_traslado = '';
        $scope.objeto_parametros.fecha_trasladoAux = '';

        setTimeout(function () { 
            $('#cbo_transportista').val("0").trigger('change.select2');
            $('#cbo_vehiculo').val("0").trigger('change.select2');
            $('#cbo_proveedor').val("0").trigger('change.select2');
        }, 100);
    }
    
    $scope.Lista_Transportista = [];
    $scope.Listando_Transportista = function () {
        TransportistaServices.getTransportista().then(function (data) {

            $scope.Lista_Transportista = [];
            $scope.Lista_Transportista = data;
            $scope.Listando_Vehiculo();

        }, function (err) {
            console.log(err);
        })
    };

    $scope.Lista_Vehiculo = [];
    $scope.Listando_Vehiculo = function (value) {
        VehiculoServices.getVehiculo().then(function (data) {
            $scope.Lista_Vehiculo = [];
            $scope.Lista_Vehiculo = data;
            $scope.Listando_Proveedor();
        }, function (err) {
            console.log(err);
        })
    };

    $scope.Lista_Proveedor = [];
    $scope.Listando_Proveedor= function (value) {
        ProveedorServices.getProveedores()
            .then(function (data) {
            $scope.Lista_Proveedor = [];
            $scope.Lista_Proveedor = data;
            $timeout(function () {
                $(".selectModal").select2();
            })
        }, function (err) {
            console.log(err);
        })
    };


    var Id_AlmTranCab_Global = '0';
    $scope.approveTransfer = function (obj) {
        Id_AlmTranCab_Global = 0;
        Id_AlmTranCab_Global = obj.Id_AlmTranCab;
        
        let GenerarAprobarTransferencia_SinGuia = function () {
            $scope.loaderDet = true;
            var user = auxiliarServices.getUserId();
            IngresoTransferenciasServices.get_AprobarTransferencia_SinGuia(Id_AlmTranCab_Global, user)
            .then(function (data) {
                if (data == "OK") {
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso de Registro realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {

                        });
                        $scope.loaderDet = false;
                    }, 500)

                    //---Refrescando la informacion--
                    $scope.getTransferencias();
                } else {
                    $timeout(function () {
                        let paramsErr = {
                            type: 'error',
                            title: 'Error !',
                            text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                        }
                        auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                        });
                        $scope.loaderSave = false;
                        console.log(err);
                    }, 500)
                }
            }, function (error) {
                console.log(error)
            })
        }
         
        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Aprobar la Transferencia.',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                GenerarAprobarTransferencia_SinGuia(obj);
            }
        });
 

    }

    $scope.change_Proveedor = function () {
        if ($scope.objeto_parametros.id_Proveedor == '0' || $scope.objeto_parametros.id_Proveedor == 0) {
            $scope.objeto_parametros.direccion_Proveedor = '';
            return;
        }

        for (var i = 0; i < $scope.Lista_Proveedor.length; i++) {
            if ( parseInt($scope.Lista_Proveedor[i].id_Proveedor) == parseInt($scope.objeto_parametros.id_Proveedor)) {
                $scope.objeto_parametros.direccion_Proveedor = $scope.Lista_Proveedor[i].direccion_Proveedor;
            }
        }
    }

    $scope.Generate_GuiaRemision = function () {
        if (IngresoTransferenciasServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }
        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Aprobar Transferencia y Generar la Guia.',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                ///----validacio del nro de Guia----
                IngresoTransferenciasServices.get_ValidarNroGuia($scope.objeto_parametros)
                .then(function (data) {
                    if (data == 0) {
                        $scope.loaderDet = true;
                        var user = auxiliarServices.getUserId();

                        $scope.objeto_parametros.fecha_emisionAux = auxiliarServices.changeFormatDate(2, $scope.objeto_parametros.fecha_emision);
                        $scope.objeto_parametros.fecha_trasladoAux = auxiliarServices.changeFormatDate(2, $scope.objeto_parametros.fecha_traslado);

                        IngresoTransferenciasServices.get_AprobarTransferencia_conGuia(Id_AlmTranCab_Global, user, $scope.objeto_parametros)
                        .then(function (data) {
                            if (data == "OK") {
                                $timeout(function () {
                                    let params = {
                                        type: 'alert',
                                        title: 'Excelente !',
                                        text: 'Proceso de Registro realizado correctamente !'
                                    }
                                    auxiliarServices.initSweetAlert(params).then(function (res) {
                                        $('#modalAprobar').modal('hide');
                                    });
                                    $scope.loaderDet = false;
                                }, 500)

                                //---Refrescando la informacion--
                                $scope.getTransferencias();
                            } else {
                                $timeout(function () {
                                    let paramsErr = {
                                        type: 'error',
                                        title: 'Error !',
                                        text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                                    }
                                    auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                                    });
                                    $scope.loaderSave = false;
                                    console.log(data);
                                }, 500)
                            }
                        }, function (error) {
                            console.log(error)
                        })


                    } else {
                            auxiliarServices.NotificationMessage('Sistemas', 'El nro de Documento de la Guia ya existe, verifique ', 'error', '#ff6849', 1500);        
                    }
                }, function (error) {
                    console.log(error)
                })


            }
        });
    }

    $scope.repulseTransfer = function (obj) {
        Id_AlmTranCab_Global = 0;
        Id_AlmTranCab_Global = obj.Id_AlmTranCab;


        var user = auxiliarServices.getUserId();
        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Rechazar la Transferencia.',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderDet = true;
                IngresoTransferenciasServices.get_RechazarTransferencia(Id_AlmTranCab_Global, user)
                .then(function (data) {
                    if (data == "OK") {
                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Se rechazó la Transferencia Correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });
                            $scope.loaderDet = false;
                        }, 500)

                        //---Refrescando la informacion--
                        $scope.getTransferencias();
                    } else {
                        $timeout(function () {
                            let paramsErr = {
                                type: 'error',
                                title: 'Error !',
                                text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                            }
                            auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                            });
                            $scope.loaderSave = false;
                            console.log(err);
                        }, 500)
                    }
                }, function (error) {
                    console.log(error)
                })
            }
        });
    }

    $scope.ValidacionNroGuia = function (objeto_parametros) {
        IngresoTransferenciasServices.get_ValidarNroGuia(objeto_parametros)
        .then(function (data) {
            if (data == 0) {
                alert('sin registro')
            } else {
                alert('ya se genero guia ')
            }
        }, function (error) {
            console.log(error)
        })          
    }


    $scope.modificarCantidad = function (item) {

        console.log(item)

        const idCab = item.Id_AlmTranCab;
        const idDet = item.Id_AlmTranDet;
        const cant = item.cantidad_ingresada;

        if (parseFloat(cant) < 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese una cantidad Positiva', 'error', '#ff6849', 2000); 
            return;
        }

        var params = {
            title: "Desea Actualizar ?",
            text: 'Esta seguro de  cambiar la Cantidad de la Transferencia.',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {

                $scope.loaderCab = true;
                IngresoTransferenciasServices.set_modificar_cantTransferencia(idCab, idDet, cant, auxiliarServices.getUserId())
                    .then(function (res) {

                        $scope.loaderCab = false;
                        if (res.ok == true) {
                            $timeout(function () {
                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Actualizado realizado correctamente !'
                                }
                                auxiliarServices.initSweetAlert(params).then(function (res) {
                                });
                            }, 500)
                        } else {
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(res.data);
                        }
                    }, function (error) {
                        $scope.loaderCab = false;
                        alert(error);
                    })
 
            }
        });




    }


})



