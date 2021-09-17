var app = angular.module('appGestion.IngresoGuiasOrdenCompraController', [])

app.controller('CtrlIngresoGuiasOrdenCompraController', function ($scope, $q, TipoDocumentoServices, LocalesServices, AlmacenServices, ProveedorServices, MonedaServices, auxiliarServices, $location, $timeout, productosServices, IngresoGuiasServices, auxiliarServices) {
    $scope.loaderPage = true;
    $scope.disabledGuiaAux = "";

    $scope.flagLote_Global = false;

    $scope.objSaveGuias = {
        id_GuiaCab: 0,
        id_Empresa: 1,
        id_Movimiento: 1,
        TipoMovimiento: 'I',
        id_Almacen: "0",
        id_Local: "0",
        numero_GuiaCab: '', //*
        fechaEmision_GuiaCabAux: '',
        fechaEmision_GuiaCab: '',
        id_PuntoVenta: 1,
        id_Moneda: '1',
        tipoCambio_GuiaCab: '',
        numeroDocReferencia_GuiaCab: '',
        id_Proveedor: 0,
        nroDocumento_Proveedor: '',
        razonSocial_Proveedor: '',
        obs_GuiaCab: '',
        id_cliente: 1,
        rucCliente: '',
        id_Transportista: 0,
        rucTransportista: '',
        id_vehiculo: 0,
        vehiculo_Placa: '',
        direccion_Destinatario_GuiaCab: '',
        fechaTraslado_GuiaCab: '',
        Obs_Anulacion_GuiaCab: '',
        estado: 3,
        usuario_creacion: auxiliarServices.getUserId(),
        id_tipo_documento: '0',
        nro_documento: '',
        fecha_emision: '',
        fecha_emision_aux: auxiliarServices.getDateNow(),
        nro_guia_remision: '',
        fecha_guia: '',
        fecha_guia_aux: '',
        fecha_emision_oc: '',
        fecha_emision_oc_aux: '',
        nro_orden_compra: ''
    }

    $scope.changeTipoDocumento = function (id) {
        // ID = 3 = GUIA
        if (id == 3) {
            $scope.disabledGuiaAux = "disabledContent";
            $scope.objSaveGuias.nro_guia_remision = $scope.objSaveGuias.nro_documento;
        } else {
            $scope.disabledGuiaAux = "";
        }
    }

    $scope.presNroDocumento = function (id) {
        // ID = 3 = GUIA
        if (id == 3) {           
            $scope.objSaveGuias.nro_guia_remision = $scope.objSaveGuias.nro_documento;
        }
    }

    $scope.nuevaGuia = function () {
        $timeout(function () {
            document.getElementById('txtNroGuia').focus();
            document.getElementById('txtNroGuia').select();
        }, 500);

        $scope.objSaveGuias = {
            id_GuiaCab: 0,
            id_Empresa: 1,
            id_Movimiento: 1,
            TipoMovimiento: 'I',
            id_Almacen: "0",
            id_Local: "0",
            numero_GuiaCab: '', //*
            fechaEmision_GuiaCabAux: '',
            fechaEmision_GuiaCab: '',
            id_PuntoVenta: 1,
            id_Moneda: '1',
            tipoCambio_GuiaCab: '',
            numeroDocReferencia_GuiaCab: '',
            id_Proveedor: 0,
            nroDocumento_Proveedor: '',
            razonSocial_Proveedor: '',
            obs_GuiaCab: '',
            id_cliente: 1,
            rucCliente: '',
            id_Transportista: 0,
            rucTransportista: '',
            id_vehiculo: 0,
            vehiculo_Placa: '',
            direccion_Destinatario_GuiaCab: '',
            fechaTraslado_GuiaCab: '',
            Obs_Anulacion_GuiaCab: '',
            estado: 3,
            usuario_creacion: auxiliarServices.getUserId(),
            id_tipo_documento: '0',
            nro_documento: '',
            fecha_emision: '',
            fecha_emision_aux: auxiliarServices.getDateNow()    ,
            nro_guia_remision: '',
            fecha_guia: '',
            fecha_guia_aux: '',
            fecha_emision_oc: '',
            fecha_emision_oc_aux: '',
            nro_orden_compra: ''
        }

        newValue = String($scope.listLocales[0].id_Local);
        $scope.objSaveGuias.id_Local = newValue;

        $timeout(function () {
            $('#selectLocales').val(newValue).trigger('change.select2');
            $scope.changeSelect('locales', newValue, null);
        })
        $scope.listProductosDet = [];
        $scope.disabledCab = "";
        $scope.disabledGuia = false;
        var params = {
            option: 'save',
            value: 1,
            idLocal: 1,
            idAlmacen: 1,
            objCab: '',
            tipoMovimiento_Global: $scope.tipoMovimiento_Global
        }
        auxiliarServices.paramsGuias('save', params);
        $scope.guiaCerrada = true;

        if ($scope.tipoMovimiento_Global == 2) {

            $scope.objSaveGuias.fecha_emision_aux = auxiliarServices.getDateNow();
            $scope.objSaveGuias.id_Proveedor = 1;
            $scope.objSaveGuias.nroDocumento_Proveedor = '20601832616';
            $scope.objSaveGuias.razonSocial_Proveedor = 'CORPORACION BELCEN S.A.C. - BELCEN S.A.C.';
            $scope.disabledProveedor = 'disabledContent'
        }

        $timeout(function () {
            $("#txtNroDocumento").removeClass("disabledContent")
        }, 500);

    }

    $scope.editarProducto = function (item) { 

        console.log(item)

        $scope.textSaveDet = "Actualizar";
        $scope.objSaveGuiasDet = item;
 
        if (item.movLote == 1) {
            $scope.flagLote_Global = true;
            if (item.fechaProduccion.length > 10) {
                $scope.objSaveGuiasDet.fechaProduccion = auxiliarServices.getDateFormated(item.fechaProduccion)
                $scope.objSaveGuiasDet.fechaVencimiento = auxiliarServices.getDateFormated(item.fechaVencimiento)
            }
        } else {

            if ($scope.tipoMovimiento_Global == 2) {
                $scope.flagLote_Global = true;
            } else {
                $scope.flagLote_Global = false;
            }

/*            $scope.flagLote_Global = false;*/
            $scope.objSaveGuiasDet.nroLote = ''
            $scope.objSaveGuiasDet.fechaProduccion = ''
            $scope.objSaveGuiasDet.fechaVencimiento = ''        
        }  
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy',
            });
        }, 0)

        const idUM = (!$scope.objSaveGuiasDet.id_UnidadMedida_Ingreso) ? '0' : $scope.objSaveGuiasDet.id_UnidadMedida_Ingreso;
        const descUM = $scope.objSaveGuiasDet.nombre_UnidadMedidaI;

        $scope.objSaveGuiasDet.id_UnidadMedida_Ingreso = idUM;

        $scope.ListaUnidadMedidaModal = [];
        if (idUM > 0) {

            $scope.ListaUnidadMedidaModal.push({ id_unidadMedida: idUM, nombre_UnidadMedida: descUM });

            if (parseInt(idUM) > 1) {
                $scope.ListaUnidadMedidaModal.push({ id_unidadMedida: '1', nombre_UnidadMedida: 'UNIDAD' });
            }
        }
        $timeout(function () {

            $('#txtCantidad').focus().select();
            $('#cbo_unidadModal').val(idUM).trigger('change.select2');


            //if (item.movLote == 1) {
            //    $('#txtidLote').focus().select();
            //} else {
            //    $('#txtCantidad').focus().select();
            //}
        });
    }

    $scope.validarGuiasOrdenCompra = function () {
        $scope.loaderValidacion = true;
        var params = {
            nroGuia: $scope.objSaveGuias.nro_documento
        };
        IngresoGuiasServices.validarGuiasOrdenCompra(params).then(function (res) {
            $timeout(function () {
                console.log(res);
                if (res) {
                    showErorCab(1, 'Nro de Guia ya se encuentra registrado !');
                    $('#txtNroDocumento').focus().select();
                } else {
                    $scope.enterFocus(1, 'txtFechaRemision');
                }
                $scope.loaderValidacion = false;
            })
        })
    }
    var showErorCab = function (value, text) {
        if (value == 1) {
            $("#errorCab").fadeToggle(350);
            $scope.textErrorCab = text;
            $timeout(function () {
                $("#errorCab").fadeToggle(350);
            }, 2500)
        } else if (value == 2) {
            $("#errorCab2").fadeToggle(350);
            $scope.textErrorCab = text;
            $timeout(function () {
                $("#errorCab2").fadeToggle(350);
            }, 2500)
        }

    }
    $scope.eliminarProducto = function (item) {
        $scope.loaderDet = true;
        IngresoGuiasServices.DeleteGuiasOrdenCompraDet(item.id_GuiaDet).then(function (res) {
            $timeout(function () {
                var index = $scope.listProductosDet.indexOf(item);
                $scope.listProductosDet.splice(index, 1)
                $scope.loaderDet = false;
            }, 500);
        }, function (err) {
            $scope.loaderDet = false;
        })
    }
    var getGuiasOrdenCompraDet = function (idGuiaCAb) {
        $scope.loaderDet = true;
        var params = {
            idGuiaCAb: idGuiaCAb
        }
        IngresoGuiasServices.getGuiasOrdenCompraDet(params).then(function (res) {
 
            res.forEach(function (item, index) {
                var importe = parseFloat(item.cantidad_GuiaDet) * parseFloat(item.precioCosto_GuiaDet);
                item['importe_GuiaDet'] = auxiliarServices.formatearNumero(importe, 2);
            })
            $scope.listProductosDet = res;

            console.log($scope.listProductosDet)

            $timeout(function () {
                $scope.loaderDet = false;
            }, 500)
        }, function (err) {
            console.log(err);
        })
    }
    var objCabParams;

    $scope.titleButton = '';
    $scope.initAll = function () {

        const { tipoMovimiento_Global, option } = auxiliarServices.paramsGuias('get');
        $scope.tipoMovimiento_Global = tipoMovimiento_Global;
        //tipoMovimiento = 1    INGRESO POR ORDEN COMPRA
        //tipoMovimiento = 2    INGRESO PRODUCTO TERMINADO 
        
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
 
        auxiliarServices.menuHideShow(2);
        $scope.textSaveDet = "Guardar";
        $scope.disabledDet = "disabledContent";

        $scope.getMonedas();
        getTipoDocumento();

        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy',
            });
            $(".selectModal").select2();            

            //if ($scope.tipoMovimiento_Global == 2) {
            //    $scope.objSaveGuias.id_Proveedor = 1;
            //    $scope.objSaveGuias.nroDocumento_Proveedor = '20601832616';
            //    $scope.objSaveGuias.razonSocial_Proveedor = 'CORPORACION BELCEN S.A.C. - BELCEN S.A.C.';
            //    $scope.disabledProveedor = 'disabledContent'
            //}
        }, 0);

        $scope.objSaveGuias.fechaEmision_GuiaCabAux = auxiliarServices.getDateNow();
        
        if ($scope.tipoMovimiento_Global == 1) {
            $scope.titleButton = 'Guia';
            auxiliarServices.changeTitle(" Registro de Ingreso de Guias ");
        }
        else if ($scope.tipoMovimiento_Global == 2) {
            $scope.titleButton = 'Informe';
            auxiliarServices.changeTitle(" Listado de Ingreso de Productos ");
            $scope.objSaveGuias.fecha_emision_aux = auxiliarServices.getDateNow();
            $scope.objSaveGuias.id_Proveedor = 1;
            $scope.objSaveGuias.nroDocumento_Proveedor = '20601832616';
            $scope.objSaveGuias.razonSocial_Proveedor = 'CORPORACION BELCEN S.A.C. - BELCEN S.A.C.';
            $scope.disabledProveedor = 'disabledContent'
        }


        if (option == 'update') {
            editGuia();
        } else {
            paramsGuia = auxiliarServices.paramsGuias('get');
            $scope.getLocales(1);
            $timeout(function () {
                $scope.guiaCerrada = true;
                document.getElementById('txtNroGuia').focus();
                document.getElementById('txtNroGuia').select();
            }, 0)
                                 
            $timeout(function () {
                $scope.objSaveGuias.id_Moneda = String('1');
                $('#selectMoneda').val(String('1')).trigger('change.select2');
            }, 500);

        }

    };
    
    var paramsGuia;
    var editGuia = function () {
        paramsGuia = auxiliarServices.paramsGuias('get');
        //console.log(paramsGuia.objCab);
        if (paramsGuia.option == "update") {

            $scope.disabledGuia = "disabledContent";
            $scope.disabledDet = "";
            $scope.objSaveGuias = paramsGuia.objCab;

            $timeout(function () {

                $scope.objSaveGuias.fechaEmision_GuiaCabAux = $scope.objSaveGuias.fechaEmision_GuiaCab;
                $scope.objSaveGuias.fecha_emision_aux = $scope.objSaveGuias.fecha_emision;
                $scope.objSaveGuias.fecha_guia_aux = $scope.objSaveGuias.fecha_guia;
                $scope.objSaveGuias.fecha_emision_oc_aux = ($scope.objSaveGuias.fecha_emision_oc == '01/01/0001') ? null : $scope.objSaveGuias.fecha_emision_oc;
                $scope.objSaveGuias.id_Moneda = String($scope.objSaveGuias.id_Moneda);
                console.log(String($scope.objSaveGuias.id_Moneda));

                $('#selectMoneda').val(String($scope.objSaveGuias.id_Moneda)).trigger('change.select2');
                $('#selectTipoDoc').val(String($scope.objSaveGuias.id_tipo_documento)).trigger('change.select2');

                $scope.getLocales(2);

     
                $("#txtNroDocumento").addClass("disabledContent")


            }, 500);

 

            getGuiasOrdenCompraDet($scope.objSaveGuias.id_GuiaCab);

            // VALIDAMOS IS LA GUIA ESTA CERRADA O NO

            if (paramsGuia.objCab.estado != 3) {
                // GUIA CERRADA
                $scope.guiaCerrada = true;
                $scope.disabledCab = "disabledContent";
                $scope.disabledDet = "disabledContent";
                $scope.disabledProducto = "disabledContent";
            } else {

                // GUIA NO CERRADA
                $scope.disabledCab = "";
                $scope.disabledDet = "";
            }

        } else {
            $scope.getLocales(1);
            $timeout(function () {
                $scope.guiaCerrada = true;
                document.getElementById('txtNroGuia').focus();
                document.getElementById('txtNroGuia').select();
            }, 0)

        };

    }

    $scope.getProductos = function () {
        productosServices.getProductos().then(function (res) {
            $scope.listProductos = res;
            $scope.loaderProd = false;
            $timeout(function () { auxiliarServices.initFooTable('tblProductos', ''); }, 1000)

        }, function (err) {
            console.log(err);
        });
    };

    var getParamsGuias = function () {
        var paramsGuias = auxiliarServices.paramsGuias('get');

    }

    $scope.getMonedas = function () {
        MonedaServices.getMonedas().then(function (res) {
            $scope.loaderPage = false;
            $scope.listMonedas = res;
        }, function (err) {
            console.log(err);
        })
    }

    $scope.getProveedorByDoc = function () {
        $scope.loaderProveedor = true;
        $scope.disabledProveedor = "disabledContent";
        var params = {
            filter: $scope.objSaveGuias.nroDocumento_Proveedor
        }
        ProveedorServices.getProveedor(params).then(function (res) {

            $timeout(function () {
                $scope.disabledProveedor = "";
                $scope.loaderProveedor = false;
                console.log(res.length);
                if (res.length == 0) {
                    $scope.enterFocus(1, 'txtProveedor');
                    $scope.objSaveGuias.razonSocial_Proveedor = "";
                    $scope.objSaveGuias.id_Proveedor = 0;
                    showErorCab(1, 'No se encontró proveedor !');
                } else {
                    $scope.enterFocus(2, 'selectMoneda');
                    $scope.objSaveGuias.razonSocial_Proveedor = res[0].razonSocial_Proveedor;
                    $scope.objSaveGuias.id_Proveedor = res[0].id_Proveedor;
                }
            }, 500)
        }, function (err) {
            console.log(err);
        });
    }

    $scope.saveTblAlmGuiaCab = function () {
        var o = $scope.objSaveGuias;
        console.log(o);

        if (o.id_tipo_documento <= 0) {
            showErorCab(1, 'Ingresar un tipo de Documento !');
            $('#selectTipoDoc').select().focus();
            return;
        }

        else if ($scope.tipoMovimiento_Global ==1 &&  o.nro_documento.length == 0) {
            showErorCab(1, 'Ingresar un Nro de Documento!');
            $('#txtNroDocumento').focus();
            return;
        }
        else if ($scope.tipoMovimiento_Global == 1 &&  o.nro_guia_remision.length == 0) {
            showErorCab(1, 'Ingresar un Nro de Remisión!');
            $('#txtNroGuiaRemi').focus();
            return; // txtFechaGuia
        }
        else if ( o.fecha_emision_aux.length == 0) {
            showErorCab(1, 'Ingresar una Fecha de Emisión!');
            $timeout(function () {
                $('#txtFechaRemision').focus();
            }, 1000)

            return;
        }
        else if ($scope.tipoMovimiento_Global == 1 &&  o.fecha_guia_aux.length == 0) {
            showErorCab(1, 'Ingresar una Fecha de Guia!');
            $timeout(function () {
                $('#txtFechaGuia').focus();
            }, 1000)

            return;
        }
        else if (o.id_Proveedor <= 0) {
            showErorCab(2, 'Ingresar un proveedor !');
            $('#txtProveedor').focus();
            return;
        } else if ($scope.tipoMovimiento_Global == 1 &&  o.id_Moneda <= 0) {
            showErorCab(2, 'Ingresar un tipo de moneda !');
            $timeout(function () {
                $scope.enterFocus(2, 'selectMoneda');
            }, 1000);
            return;
        }
        //else if ($scope.tipoMovimiento_Global == 1 &&  o.tipoCambio_GuiaCab.length == 0) {
        //    showErorCab(2, 'Ingresar un tipo de Cambio');
        //    $('#txtTipCambio').focus();
        //    return;
        //};
        var params = {
            nroGuia: $scope.objSaveGuias.nro_documento
        };

        $scope.disabledDet = "disabledContent";


        if ($scope.tipoMovimiento_Global == 1) {
            IngresoGuiasServices.validarGuiasOrdenCompra(params, paramsGuia.option)
                .then(function (res) {
                    $timeout(function () {
                        if (res) {
                            showErorCab(1, 'Nro de Guia ya se encuentra registrado !');
                            $('#txtNroGuia').focus().select();
                            return;
                        } else {
                            $scope.loaderCab = true;
                            $scope.objSaveGuias.fechaEmision_GuiaCab = auxiliarServices.changeFormatDate(2, $scope.objSaveGuias.fecha_emision_aux);
                            $scope.objSaveGuias.fecha_emision = auxiliarServices.changeFormatDate(2, $scope.objSaveGuias.fecha_emision_aux);
                            $scope.objSaveGuias.fecha_emision_oc = ($scope.objSaveGuias.fecha_emision_oc_aux == null || $scope.objSaveGuias.fecha_emision_oc_aux == '' ) ? null :  auxiliarServices.changeFormatDate(2, $scope.objSaveGuias.fecha_emision_oc_aux);
                            $scope.objSaveGuias.fecha_guia = auxiliarServices.changeFormatDate(2, $scope.objSaveGuias.fecha_guia_aux);
                            $scope.objSaveGuias.fecha_creacion = null;
                            $scope.objSaveGuias.usuario_creacion = auxiliarServices.getUserId();

                            $scope.objSaveGuias.tipoCambio_GuiaCab = ($scope.objSaveGuias.tipoCambio_GuiaCab == '' || $scope.objSaveGuias.tipoCambio_GuiaCab == undefined) ? 1 : $scope.objSaveGuias.tipoCambio_GuiaCab ;

                            IngresoGuiasServices.saveGuiasOrdenCompra($scope.objSaveGuias).then(function (res) {
                                $timeout(function () {
                                    $scope.loaderCab = false;
                                    let paramsaux = {
                                        type: 'alert',
                                        title: 'Excelente !',
                                        text: 'Proceso realizado correctamente !'
                                    };
                                    $scope.guiaCerrada = false;
                                    // HABILITAMOS EL DETALLE
                                    $scope.disabledDet = "";
                                    $scope.disabledProducto = "";
                                    $scope.disabledGuia = "disabledContent";
                                    $scope.objSaveGuias.id_GuiaCab = res.id_GuiaCab;
                                    paramsGuia.option = "update";
                                    auxiliarServices.initSweetAlert(paramsaux).then(function (res) {
                                        // ANY COD
                                        $scope.enterFocus(1, 'txtMatricula');
                                    });
                                }, 500);


                            }, function (er) {


                                    console.log('saliendo con error ')
                                    console.log(er)

                                $scope.loaderCab = false;
                                $scope.disabledCab = "";

                                let paramsErr = {
                                    type: 'error',
                                    title: 'Error !',
                                    text: 'Ocurrio un problema con la conexión !!'
                                }
                                auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                                });
                            });
                        };
                    })
                })

        }
        if ($scope.tipoMovimiento_Global == 2) { //----- PRODUCTO TERMINADO

            $scope.loaderCab = true;
            $scope.objSaveGuias.fechaEmision_GuiaCab = auxiliarServices.changeFormatDate(2, $scope.objSaveGuias.fecha_emision_aux);
            $scope.objSaveGuias.fecha_emision = auxiliarServices.changeFormatDate(2, $scope.objSaveGuias.fecha_emision_aux);
            $scope.objSaveGuias.fecha_emision_oc = null;
            $scope.objSaveGuias.fecha_guia = null;
            $scope.objSaveGuias.id_Moneda = '1';

            $scope.objSaveGuias.fecha_creacion = null;
            $scope.objSaveGuias.usuario_creacion = auxiliarServices.getUserId();

            IngresoGuiasServices.saveGuiasOrdenCompra($scope.objSaveGuias).then(function (res) {

                $timeout(function () {
                    $scope.loaderCab = false;
                    let paramsaux = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso realizado correctamente !'
                    };
                    $scope.guiaCerrada = false;
                    // HABILITAMOS EL DETALLE
                    $scope.disabledDet = "";
                    $scope.disabledProducto = "";
                    $scope.disabledGuia = "disabledContent";

                    $scope.objSaveGuias.id_GuiaCab = res.id_GuiaCab;
                    paramsGuia.option = "update";
                    auxiliarServices.initSweetAlert(paramsaux).then(function (res) {
                        $scope.enterFocus(1, 'txtMatricula');
                    });
                }, 500);
            }, function (er) {
                $scope.loaderCab = false;
                $scope.disabledCab = "";

                let paramsErr = {
                    type: 'error',
                    title: 'Error !',
                    text: 'Ocurrio un problema con la conexión !!'
                }
                auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                });
            });

        }
    }
    // PROCEDIMIENTOS DE DETALLE


    $scope.objSaveGuiasDet = {
        id_GuiaDet: 0,
        id_GuiaCab: 0,
        item_GuiaDet: 0,
        id_Producto: 0,
        codigo1_Producto: '',
        nombre_Producto: '',
        abreviatura_Producto: '',
        nombre_marcaproducto: '',
        precioCosto_GuiaDet: 0,
        cantidad_GuiaDet: 0,
        importe_GuiaDet: 0,
        usuario_Creacion: auxiliarServices.getUserId(),
        nombre_UnidadMedida: '',
        nroLote: '',
        fechaProduccion: '',
        fechaVencimiento: '',
        id_UnidadMedida_Ingreso : '0'
    }

    $scope.ListaUnidadMedidaModal = [];

    $scope.getProductoByFilter = function () {
        $scope.loaderProducto = true;
        $scope.disabledProducto = "disabledContent";
        var params = {
            filter: $scope.objSaveGuiasDet.codigo1_Producto
        }

        productosServices.getProductosByFilter(params).then(function (res) {

            if (res.length == 0) {
                $scope.objSaveGuiasDet.id_Producto = 0;
                $scope.objSaveGuiasDet.nombre_Producto = "";
                $scope.objSaveGuiasDet.abreviatura_Producto = "";
                $scope.objSaveGuiasDet.precioCosto_GuiaDet = 0;
                $scope.objSaveGuiasDet.nombre_UnidadMedida = "";
                $scope.objSaveGuiasDet.nombre_marcaproducto = "";
                $scope.objSaveGuiasDet.id_UnidadMedida_Ingreso = '0';

                $scope.enterFocus(1, 'txtMatricula');
                showMessageError();
                $scope.textError = "No se encuentra codigo de producto.";
                $scope.flagLote_Global = false;                

            } else {
                $scope.objSaveGuiasDet.id_Producto = res[0].id_Producto;
                $scope.objSaveGuiasDet.nombre_Producto = res[0].nombre_Producto + ' - ' + res[0].nombre_marcaproducto;
                $scope.objSaveGuiasDet.abreviatura_Producto = res[0].abreviatura_Producto;
                $scope.objSaveGuiasDet.nombre_UnidadMedida = res[0].nombre_UnidadMedida;
                $scope.objSaveGuiasDet.nombre_marcaproducto = res[0].nombre_marcaproducto;
                $scope.objSaveGuiasDet.precioCosto_GuiaDet = res[0].preciocompra_producto == null ? 0 : res[0].preciocompra_producto;

                ////-----------------------

                const idUM = (!res[0].id_unidadMedida) ? '0' : res[0].id_unidadMedida;
                const descUM = res[0].nombre_UnidadMedida;

                $scope.objSaveGuiasDet.id_UnidadMedida_Ingreso = idUM;

                $scope.ListaUnidadMedidaModal = [];
                if (idUM > 0) {

                    $scope.ListaUnidadMedidaModal.push({ id_unidadMedida: idUM, nombre_UnidadMedida: descUM });

                    if (parseInt(idUM)  > 1) {                
                        $scope.ListaUnidadMedidaModal.push( { id_unidadMedida: '1', nombre_UnidadMedida: 'UNIDAD' } );
                    }
                }

                ///-----
                
                if (res[0].movLote == 1) {
                    $scope.flagLote_Global = true;
                } else {

                    if ($scope.tipoMovimiento_Global == 2) {
                        $scope.flagLote_Global = true;
                    } else {
                        $scope.flagLote_Global = false;
                    }

                    //$scope.flagLote_Global = false;
                }      

                $timeout(function () {
                    $('.datepicker').datepicker({
                        autoclose: true,
                        todayHighlight: true,
                        format: 'dd/mm/yyyy',
                    });
                }, 0)

                $timeout(function () {
                    $('#txtCantidad').focus().select();
                    $('#cbo_unidadModal').val(idUM).trigger('change.select2');
               });
            }
            $scope.disabledProducto = "";
            $scope.loaderProducto = false;

        }, function (err) {
            console.log(err);
        });
    }

    $scope.enterFocusII = function (name) {
        if (name == 'btnGuardarDet') {
            if ($scope.flagLote_Global == true) {
                $('#txtidLote').focus().select();
            } else {
                $('#' + name + '').focus();
                $('#' + name + '').select();
            }
        } 
    };


    $scope.calculoImporteGuiaDet = function () {
        let o = $scope.objSaveGuiasDet;
        o.importe_GuiaDet = parseFloat(o.cantidad_GuiaDet) * parseFloat(o.precioCosto_GuiaDet);
        //o.importe_GuiaDet = auxiliarServices.formatearNumero(o.importe_GuiaDet, 2);
        o.importe_GuiaDet = (o.importe_GuiaDet).toFixed(4);
    };

    $scope.listProductosDet = [];

    $scope.limpiarDetGuia = function () {
        $scope.objSaveGuiasDet = {
            id_GuiaDet: 0,
            id_GuiaCab: 0,
            item_GuiaDet: 0,
            id_Producto: 0,
            codigo1_Producto: '',
            nombre_Producto: '',
            abreviatura_Producto: '',
            precioCosto_GuiaDet: 0,
            cantidad_GuiaDet: 0,
            importe_GuiaDet: 0,
            usuario_Creacion: auxiliarServices.getUserId(),
            nombre_marcaproducto: '',
            nombre_UnidadMedida: '',
            nroLote: '',
            fechaProduccion: '',
            fechaVencimiento: '',
            id_UnidadMedida_Ingreso : '0'
        }
        $scope.textSaveDet = "Guardar";
    }

    var showMessageError = function () {
        $("#errorDet").fadeToggle(350);
        $timeout(function () {
            $("#errorDet").fadeToggle(350);
        }, 3500)
    }

    $(".myadmin-alert .closed").click(function (event) {
        $(this).parents(".myadmin-alert").fadeToggle(350);

        return false;
    });

    var ValidarCodigoRepetido = function () {
        var cond = false;
        //$scope.listProductosDet.forEach(function (item, index) {
        //    if ($scope.objSaveGuiasDet.id_Producto == item.id_Producto && $scope.objSaveGuiasDet.id_UnidadMedida_Ingreso == item.id_UnidadMedida_Ingreso && $scope.objSaveGuiasDet.nroLote == item.nroLote ) {
        //        cond = true;
        //    }
        //})
        return cond;
    }
    var saveOne = true;
    $scope.saveTblAlmGuiaDet = function () {
        if (!saveOne) {
            return;
        }
        if ($scope.objSaveGuiasDet.id_Producto == 0) {
            showMessageError();
            $scope.textError = "Ingresar un codigo de Producto";
            saveOne = true;
            return;
        } else if ($scope.objSaveGuiasDet.cantidad_GuiaDet <= 0) {
            showMessageError();
            $scope.textError = "Cantidad ingresada incorrecta !";
            saveOne = true;
            return;
        }

        if ($scope.flagLote_Global == true) {
            if ($scope.objSaveGuiasDet.nroLote == null || $scope.objSaveGuiasDet.nroLote == '' ) {
                showMessageError();
                $scope.textError = "Por favor ingrese el Nro Lote";
                saveOne = true;
                return;
            } else if ($scope.objSaveGuiasDet.fechaProduccion == null || $scope.objSaveGuiasDet.fechaProduccion == '' || $scope.objSaveGuiasDet.fechaProduccion == undefined) {
                showMessageError();
                $scope.textError = "Por favor ingrese la Fecha de Producción !";
                saveOne = true;
                return;
            } else if ($scope.objSaveGuiasDet.fechaVencimiento == null || $scope.objSaveGuiasDet.fechaVencimiento == '' || $scope.objSaveGuiasDet.fechaVencimiento == undefined) {
                showMessageError();
                $scope.textError = "Por favor ingrese la Fecha de Vencimiento !";
                saveOne = true;
                return;
            }
        }

        const fechaProduccion = $scope.objSaveGuiasDet.fechaProduccion;
        const fechaVencimiento = $scope.objSaveGuiasDet.fechaVencimiento;

        $scope.objSaveGuiasDet.fechaProduccion = auxiliarServices.changeFormatDate(2, fechaProduccion);
        $scope.objSaveGuiasDet.fechaVencimiento = auxiliarServices.changeFormatDate(2, fechaVencimiento);

        $scope.loaderDet = true;
        $scope.disabledDet = "disabledContent";

        saveOne = false;

        if ($scope.textSaveDet == "Guardar") {
            $scope.objSaveGuiasDet.id_GuiaCab = $scope.objSaveGuias.id_GuiaCab;
            //$scope.objSaveGuiasDet.id_GuiaCab = 2  
            if (ValidarCodigoRepetido()) {
                showMessageError();
                $scope.textError = "Codigo de Producto ya se encuentra registrado, verifique la Unidad Medida o el Nro Lote !";
                $scope.loaderDet = false;
                $scope.disabledDet = "";
                saveOne = true;
                $scope.objSaveGuiasDet.fechaProduccion = fechaProduccion;
                $scope.objSaveGuiasDet.fechaVencimiento = fechaVencimiento;

                return;
            }
            IngresoGuiasServices.saveGuiasOrdenCompraDet($scope.objSaveGuiasDet).then(function (res) {

                console.log('saveGuiasOrdenCompraDet')
                console.log(res)

                $scope.objSaveGuiasDet.fechaProduccion = fechaProduccion;
                $scope.objSaveGuiasDet.fechaVencimiento = fechaVencimiento;

                $timeout(function () {
                    //$scope.objSaveGuiasDet.id_GuiaDet = res.id_GuiaDet;
                    //$scope.listProductosDet.push($scope.objSaveGuiasDet);

                    getGuiasOrdenCompraDet($scope.objSaveGuias.id_GuiaCab);

                    $scope.limpiarDetGuia();
                    $scope.loaderDet = false;
                    $scope.flagLote_Global = false;
                    $scope.disabledDet = "";
                    $scope.enterFocus(1, 'txtMatricula');
                    saveOne = true;
                }, 500);

            }, function (err) {

                $scope.objSaveGuiasDet.fechaProduccion = fechaProduccion;
                $scope.objSaveGuiasDet.fechaVencimiento = fechaVencimiento;

                saveOne = true;
                $scope.loaderDet = false;
                $scope.disabledDet = "";
                console.log(err);
            })
        } else {
            IngresoGuiasServices.updateGuiasOrdenCompraDet($scope.objSaveGuiasDet).then(function () {

                $scope.objSaveGuiasDet.fechaProduccion = fechaProduccion;
                $scope.objSaveGuiasDet.fechaVencimiento = fechaVencimiento;

                $timeout(function () {
                    $scope.limpiarDetGuia();
                    saveOne = true;
                    $scope.loaderDet = false;
                    $scope.flagLote_Global = false;
                    $scope.disabledDet = "";
                    $scope.enterFocus(1, 'txtMatricula');
                }, 500)
            }, function (err) {

                $scope.objSaveGuiasDet.fechaProduccion = fechaProduccion;
                $scope.objSaveGuiasDet.fechaVencimiento = fechaVencimiento;
                console.log(err);
                $scope.loaderDet = false;
                $scope.disabledDet = "";
                saveOne = true;
            })

        }

    }

    $scope.listBusqueda = [];
    $scope.valueAux;

    $scope.limpiandoDetalle = function () {
        $scope.limpiarDetGuia();
        $scope.flagLote_Global = false;
        $scope.ListaUnidadMedidaModal = [];
        $timeout(function () {
            $('#txtMatricula').focus().select();
            $('#cbo_unidadModal').val('0').trigger('change.select2');
        });
    }

    var oTable;
    var oTableP;

    $scope.ModalSearch = function (value) {
        var filter = document.getElementById('inputSearch');
        $timeout(function () {
            $scope.searchFilter = '';
            filter.value = "";
        }, 0)
        $scope.valueAux = value;

        if (value == 1) {
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

        } else if (value == 2) {
            $scope.showProv = true;
            $scope.loaderModal = true;
            $scope.titleModal = "Busqueda de Productos";
            $scope.flagLote_Global = false;
            $('#ModalSearch').modal('show');

            $timeout(function () {
                var params = {  filter: filter.value } 

                $scope.listBusqueda = [];
                productosServices.getProductosByFilter(params).then(function (res) {

                    let dataBD = []

                    res.forEach(function (item, index) {
                         dataBD.push({
                            id: index,
                            id_select: item.id_Producto,
                            codigo: item.codigo1_Producto,
                            descripcion: item.nombre_Producto,
                            marca: item.nombre_marcaproducto,
                            abreviatura_Producto: item.abreviatura_Producto,
                            nombre_marcaproducto: item.nombre_marcaproducto,
                            nombre_UnidadMedida: item.nombre_UnidadMedida,
                            precioCosto_GuiaDet: item.precioCosto_GuiaDet,
                            preciocompra_producto: item.preciocompra_producto == null ? 0 : item.preciocompra_producto,
                            movLote: item.movLote,
                            id_UnidadMedida_Ingreso: item.id_unidadMedida,
                        });
                    });

                    $scope.listBusqueda = [];
                    $scope.listBusqueda = dataBD;

                    $timeout(function () {
                        if (oTableP !== 'data') {
                            auxiliarServices.initFooTable('tblFiltro', 'inputSearch');
                        } else {
                            $('#tblFiltro').trigger('footable_initialize'); 
                        } 
                    }, 500);

                    $scope.loaderModal = false;
                });

            }, 500);

        }
    }

    $scope.selectId = function (item) {

        $scope.flagLote_Global = false;
        if ($scope.valueAux == 1) {
            // PROVEEDORES
            $('#ModalSearch').modal('hide');
            $scope.objSaveGuias.razonSocial_Proveedor = item.descripcion;
            $scope.objSaveGuias.nroDocumento_Proveedor = item.codigo;
            $scope.objSaveGuias.id_Proveedor = item.id_select;        

            $timeout(function () {
                $scope.enterFocus(2, 'selectMoneda');
            }, 500);
        } else if ($scope.valueAux == 2) {
            // PROVEEDORES
            $('#ModalSearch').modal('hide');
            $scope.objSaveGuiasDet.nombre_Producto = item.descripcion;
            $scope.objSaveGuiasDet.codigo1_Producto = item.codigo;
            $scope.objSaveGuiasDet.id_Producto = item.id_select;

            $scope.objSaveGuiasDet.abreviatura_Producto = item.abreviatura_Producto;
            $scope.objSaveGuiasDet.nombre_UnidadMedida = item.nombre_UnidadMedida;
            $scope.objSaveGuiasDet.nombre_marcaproducto = item.nombre_marcaproducto;
            $scope.objSaveGuiasDet.precioCosto_GuiaDet = item.preciocompra_producto;

            ////-----------------------

            const idUM = (!item.id_UnidadMedida_Ingreso) ? '0' : item.id_UnidadMedida_Ingreso;
            const descUM = item.nombre_UnidadMedida;

            $scope.objSaveGuiasDet.id_UnidadMedida_Ingreso = idUM;
            $scope.ListaUnidadMedidaModal = [];

            if (idUM > 0) {

                $scope.ListaUnidadMedidaModal.push({ id_unidadMedida: idUM, nombre_UnidadMedida: descUM });

                if (parseInt(idUM) > 1) {
                    $scope.ListaUnidadMedidaModal.push({ id_unidadMedida: '1', nombre_UnidadMedida: 'UNIDAD' });
                }
            }

                ///-----

            
            if (item.movLote == 1) {
                $scope.flagLote_Global = true;
            } else {
                if ($scope.tipoMovimiento_Global == 2) {
                    $scope.flagLote_Global = true;
                } else {
                    $scope.flagLote_Global = false;
                }
/*                $scope.flagLote_Global = false;*/
            } 

            $timeout(function () {
                $('.datepicker').datepicker({
                    autoclose: true,
                    todayHighlight: true,
                    format: 'dd/mm/yyyy',
                });
            }, 0)

            $timeout(function () {
                $('#txtCantidad').focus().select();
                $('#cbo_unidadModal').val(idUM).trigger('change.select2');

                //if (res[0].movLote == 1) {
                //    $('#txtidLote').focus().select();
                //} else {
                //    $('#txtCantidad').focus().select();
                //} 
            }, 500);
        }
    }

    $scope.enterFocus = function (type, name) {
        if (type == 1) {
            $('#' + name + '').focus();
            $('#' + name + '').select();

        } else if (type == 2) {
            $('#' + name + '').select2('open');
        }
    };

    $scope.changeMoneda = function () {
        $scope.enterFocus(1, 'txtTipCambio');
    };

    $scope.volverGuia = function () {
        $location.path('/IngresoGuias/'+ $scope.tipoMovimiento_Global);
    };

    $scope.cerrarGuia = function () {

        if ($scope.listProductosDet.length == 0 ) {
            auxiliarServices.NotificationMessage('Sistemas', 'Tiene que agregar el Detalle de la Guia' , 'error', '#ff6849', 3000);
            return;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta seguro de cerrar ' + $scope.titleButton,
            type: 'confirmationAlert'
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {

            if (res) {
                $scope.loaderCab = true;
                $scope.disabledCab = "disabledContent";
                $scope.disabledDet = "disabledContent";
                var params = {
                    id: $scope.objSaveGuias.id_GuiaCab,
                    estado: 5
                }
                IngresoGuiasServices.changeStatusGuiasOrdenCompra(params).then(function (res) {
                    if (res == "success") {
                        $scope.loaderCab = false;
                        $scope.guiaCerrada = true;
                        swal("Guia Cerrada!", "Acaba de cerrar una guia.", "success");
                    } else {
                        swal("Error", "Ocurrio un error con la conexión , volver a intentar", "error");
                        $scope.loaderCab = false;
                        $scope.disabledCab = "";
                        $scope.disabledDet = "";
                    }
                }, function (err) {
                    console.log(err);
                })

            } else {
                $scope.loaderCab = false;
                $scope.disabledCab = "";
                $scope.disabledDet = "";
                swal("Cancelado", "Guia no cerrada", "error");
            }
        });
    }

    $scope.listLocales = [];
    $scope.getLocales = function (value) {
        LocalesServices.get_Locales_Usuario(auxiliarServices.getUserId())
            .then(function (data) {
                $scope.listLocales = [];
                $scope.listLocales = data;

                $('.filterLocales').select2();
                $('.filterAlmacen').select2();

                var newValue;

                if (value == 1) {
                    newValue = String(data[0].id_Local);
                    $scope.objSaveGuias.id_Local = newValue;
                } else {
                    newValue = String($scope.objSaveGuias.id_Local)
                }
                $timeout(function () {
                    $('#selectLocales').val(newValue).trigger('change.select2');
                    $scope.changeSelect('locales', newValue, value);
                })
            }, function (err) {
                console.log(err);
            });
    };

    $scope.changeSelect = function (select, idSelect, value) {
        if (select == "locales") {
            AlmacenServices.getAlmacenesLocal(idSelect).then(function (res) {
                // SI NO DEVUELVE NINGUN ALMACEN DE ESTE LOCAL, LIMPIAMOS Y REGRESAMOS VALOR ALMACEN A 0
                if (res.length == 0) {
                    $scope.listAlmacenes = [];
                    $scope.objSaveGuias.id_Almacen = "0";
                    $timeout(function () {
                        $('#selectLocales').val("0").trigger('change.select2');
                        $('#selectAlmacen').val("0").trigger('change.select2');
                    })
                    return;
                }
                //
                // SI DEVUELVE VALORES ENTONCES LLENAMOS SELECT ALMACEN Y SELECCIONAMOS EL PRIMER VALOR
                $scope.listAlmacenes = res;
 
                var newValue;
                if (value == 2) {
                    newValue = String($scope.objSaveGuias.id_Almacen);
                } else {
                    newValue = String(res[0].id_Almacen);
                    $scope.objSaveGuias.id_Almacen = newValue;
                }
                $timeout(function () {
                    $('#selectAlmacen').val(newValue).trigger('change.select2');
                });
            }, function (err) {
                console.log(err);
            });
        }
    }

    var id_GuiaDet_Global = 0;

    var objGlobal;
    $scope.abrir_modalPrecio = function (obj) {
        id_GuiaDet_Global = 0;
        id_GuiaDet_Global = obj.id_GuiaDet;
        objGlobal = obj;

        var txt_precioEdit = document.getElementById('txt_precioEdit');
        $('#modal_precio').modal('show');

        $timeout(function () {
            txt_precioEdit.value = '';
            txt_precioEdit.value = obj.precioCosto_GuiaDet;
            txt_precioEdit.focus();
        }, 200);
    }

    $scope.Actualizar_Precio = function () {
        var txt_precioEdit = document.getElementById('txt_precioEdit');

        if (isNaN(txt_precioEdit.value)) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingresar un valor numerico.', 'error', '#ff6849', 1500);
            return;
        }

        if (txt_precioEdit.value == undefined || txt_precioEdit.value == null || txt_precioEdit.value == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Es necesario ingresar un Precio', 'error', '#ff6849', 1500);
            return;
        }

        if (txt_precioEdit.value <= 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Es necesario ingresar un Precio mayor a cero (0)', 'error', '#ff6849', 1500);
            return;
        }

        IngresoGuiasServices.set_actualizando_Precio(id_GuiaDet_Global, txt_precioEdit.value)
        .then(function (data) {

            if (data == 'OK' || data == '"OK"') {
                $timeout(function () {

                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Actualizacion realizado correctamente..!'
                    };
                    auxiliarServices.initSweetAlert(params).then(function (res) {

                    });

                    $('#modal_precio').modal('hide');
                }, 200);

                let index = $scope.listProductosDet.indexOf(objGlobal);

                let cant = $scope.listProductosDet[index].cantidad_GuiaDet;
                let prec = Number(txt_precioEdit.value);
                let total = (cant * prec)
    
                $scope.listProductosDet[index].precioCosto_GuiaDet = prec;
                $scope.listProductosDet[index].importe_GuiaDet = parseFloat(total).toFixed(2);

            } else {
                alert(data)
            }
        }, function (error) {
            console.log(error);
        });

    }

    var getTipoDocumento = function () {
        TipoDocumentoServices.getTipoDocumento().then(function (res) {
                 
            if ($scope.tipoMovimiento_Global == 1) {
                $scope.listTipoDocumentos = res;

                $scope.objSaveGuias.id_tipo_documento = 3;
                $timeout(function () {
                    $('#selectTipoDoc').val(String($scope.objSaveGuias.id_tipo_documento)).trigger('change.select2');
                    $scope.changeTipoDocumento($scope.objSaveGuias.id_tipo_documento);
                })
            }
            if ($scope.tipoMovimiento_Global == 2) {


                $scope.listTipoDocumentos = res.filter(d => (d.id_TipoDocumento==16));

                $scope.objSaveGuias.id_tipo_documento = String('16');
                $timeout(function () {
                    $('#selectTipoDoc').val(String($scope.objSaveGuias.id_tipo_documento)).trigger('change.select2');
                    $scope.changeTipoDocumento($scope.objSaveGuias.id_tipo_documento);
                })
            }


        }, function (err) {
            console.log(err);
        })
    }

})