var app = angular.module('appGestion.IngresoFacturasController', [])

app.controller('IngresoFacturasController', function ($scope, LocalesServices, $location, ProveedorServices, $timeout, auxiliarServices, AlmacenServices, GrupoDetServices,EstadosServices, TipoDocumentoServices, IngresoFacturasServices) {


    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;
 
        auxiliarServices.changeTitle("Ingreso de Facturas por Compra");
        $scope.titleModal = "Registro de Promociones";
        $scope.disabledContent = "";
        $scope.loaderSave = false;

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

    //--- variables Globales

    $scope.id_GuiaCab_Global = 0; 
    $scope.Flag_modoEdicion = false;
    $scope.disabledProd = "disabledContent";
    $scope.disabledForm = "disabledContent";
       
     $scope.Objeto_Parametro_Filtro = {
        idLocal: "0",
        idAlmacen: "0",
        idEstado: "0",
        fechaIni: auxiliarServices.getDateNow(),
         fechaFin: auxiliarServices.getDateNow(),
         id_Proveedor: "0",
    };

    $scope.Objeto_Parametro = {
        id_GuiaCab: '', //----
        id_Empresa: '', //----
        //id_Movimiento: '',
        //TipoMovimiento: '',
        id_Local: '0',//----
        id_Almacen: '0',//----
        //numero_GuiaCab: '',
        //fechaEmision_GuiaCab: '',
        //id_PuntoVenta: '',
        id_Moneda: '', //----
        tipoCambio_GuiaCab: '',//----
        //numeroDocReferencia_GuiaCab: '',

        id_Proveedor: '',//----
        razonSocial_Proveedor: '',//----
        nroDocumento_Proveedor: '',//----

        obs_GuiaCab: '',//----

        //id_cliente: '',
        //rucCliente: '',
        //id_Transportista: '',
        //rucTransportista: '',
        //id_vehiculo: '',
        //vehiculo_Placa: '',
        //direccion_Destinatario_GuiaCab: '',
        //fechaTraslado_GuiaCab: '',
        //Obs_Anulacion_GuiaCab: '',
        estado: '3',
        usuario_creacion: '',
        //fecha_creacion: '',
        //usuario_edicion: '',
        //fecha_edicion: '',

        id_tipo_documento: '',//----
        nro_documento: '',//----
        fecha_emision: '',//----
        //nro_guia_remision: '',
        //fecha_guia: '',
        fecha_emision_oc: '',//----
        nro_orden_compra: '',//----

        id_CondicionPago: '0',//----
        id_Banco: '0',//----
        nroCuenta: '',//----
        CCINro: '',       //----     
        flag_tipo_facturacion: '1' //----
    }

    $scope.blank = function () {

        $scope.Objeto_Parametro.id_GuiaCab = '0'; //----
        $scope.Objeto_Parametro.id_Empresa = '1'; //---- 
        //$scope.Objeto_Parametro.id_Movimiento = '';
        //$scope.Objeto_Parametro.TipoMovimiento = '';
        $scope.Objeto_Parametro.id_Local = '0'; //----
        $scope.Objeto_Parametro.id_Almacen = '0'; //----

        //$scope.Objeto_Parametro.numero_GuiaCab = '';
        //$scope.Objeto_Parametro.fechaEmision_GuiaCab = '';
        //$scope.Objeto_Parametro.id_PuntoVenta = '';
        $scope.Objeto_Parametro.id_Moneda = '1';//----
        $scope.Objeto_Parametro.tipoCambio_GuiaCab = ''; //----
        //$scope.Objeto_Parametro.numeroDocReferencia_GuiaCab = '';

        $scope.Objeto_Parametro.id_Proveedor = '0'; //----
        $scope.Objeto_Parametro.razonSocial_Proveedor = ''; //----
        $scope.Objeto_Parametro.nroDocumento_Proveedor = ''; //----

        $scope.Objeto_Parametro.obs_GuiaCab = ''; //----

        //$scope.Objeto_Parametro.id_cliente = '';
        //$scope.Objeto_Parametro.rucCliente = '';
        //$scope.Objeto_Parametro.id_Transportista = '';
        //$scope.Objeto_Parametro.rucTransportista = '';
        //$scope.Objeto_Parametro.id_vehiculo = '';
        //$scope.Objeto_Parametro.vehiculo_Placa = '';
        //$scope.Objeto_Parametro.direccion_Destinatario_GuiaCab = '';
        //$scope.Objeto_Parametro.fechaTraslado_GuiaCab = '';
        //$scope.Objeto_Parametro.Obs_Anulacion_GuiaCab = '';
        $scope.Objeto_Parametro.estado = '3';
        $scope.Objeto_Parametro.usuario_creacion = auxiliarServices.getUserId();
        //$scope.Objeto_Parametro.fecha_creacion = '';
        //$scope.Objeto_Parametro.usuario_edicion = '';
        //$scope.Objeto_Parametro.fecha_edicion = '';

        $scope.Objeto_Parametro.id_tipo_documento = '0'; //----
        $scope.Objeto_Parametro.nro_documento = ''; //----
        $scope.Objeto_Parametro.fecha_emision = null ; //----
        //$scope.Objeto_Parametro.nro_guia_remision = '';
        //$scope.Objeto_Parametro.fecha_guia = '';
        $scope.Objeto_Parametro.fecha_emision_oc = null; //----
        $scope.Objeto_Parametro.nro_orden_compra = ''; //----

        $scope.Objeto_Parametro.id_CondicionPago = '0'; //----
        $scope.Objeto_Parametro.id_Banco = '0'; //----
        $scope.Objeto_Parametro.nroCuenta = ''; //----
        $scope.Objeto_Parametro.CCINro = ''; //----
        $scope.Objeto_Parametro.flag_tipo_facturacion = '1'; //----

        

        $timeout(function () {
            $('#cboLocal').val("0").trigger('change.select2');
            $('#cboAlmacen').val("0").trigger('change.select2');
            $('#cboTipoDoc').val("0").trigger('change.select2');

            $('#cbo_cond_facturacion').val('0').trigger('change.select2');
            $('#cbo_banco').val('0').trigger('change.select2');
            $('#cboMoneda').val('1').trigger('change.select2');

        }, 0);
    }


    $scope.listLocales = [];
    $scope.getLocales = function () {
        $scope.loaderFiltro = true;
        LocalesServices.get_Locales_Usuario(auxiliarServices.getUserId())
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
        if (select === "locales") {
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
        }
        if (select === "localesModal") {
            AlmacenServices.getAlmacenesLocal(idSelect).then(function (res) {
                // SI NO DEVUELVE NINGUN ALMACEN DE ESTE LOCAL, LIMPIAMOS Y REGRESAMOS VALOR ALMACEN A 0
                if (res.length === 0) {
                    $scope.listAlmacenes = [];
                    $scope.Objeto_Parametro.id_Almacen = "0";
                    $timeout(function () {
                        $('#cboLocal').val("0").trigger('change.select2');
                        $('#cboAlmacen').val("0").trigger('change.select2');
                    });
                    return;
                }
                //
                // SI DEVUELVE VALORES ENTONCES LLENAMOS SELECT ALMACEN Y SELECCIONAMOS EL PRIMER VALOR
                $scope.listAlmacenes = res;
                var newValue = String(res[0].id_Almacen);
                $scope.Objeto_Parametro.id_Almacen = newValue;
                $timeout(function () {
                    $('#cboAlmacen').val(newValue).trigger('change.select2');
                });
            }, function (err) {
                console.log(err);
            });
        }
    };

    $scope.getEstados = function () {
        var tipoEstado = 'GALM';
        $scope.loaderFiltro = true;
        EstadosServices.getEstadosByTipo(tipoEstado).then(function (res) {
            $scope.loaderFiltro = false;
            $scope.listEstados = res.filter(e => e.id_Estado == 3 || e.id_Estado == 4 || e.id_Estado == 5 );
        }, function (err) {
                $scope.loaderFiltro = false;
            console.log(err);
        });
    };
    $scope.getEstados();
    
    $scope.getTipoDocumento = function () {
        TipoDocumentoServices.getTipoDocumento().then(function (res) {
            $scope.listTipoDocumentos = res;
            $scope.Objeto_Parametro.id_tipo_documento = 1;
            $timeout(function () {
                $('#cboTipoDoc').val(String($scope.Objeto_Parametro.id_tipo_documento)).trigger('change.select2');
                //$scope.changeTipoDocumento($scope.Objeto_Parametro.id_tipo_documento);
            })
        }, function (err) {
            console.log(err);
        })
    }
    $scope.getTipoDocumento();

    $scope.Lista_CondicionFact = [];
    $scope.Listando_CondicionFacturacion = function () {
        $scope.loaderfiltros = true;
        GrupoDetServices.getGrupoTabla_Det(11)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_CondicionFact = [];
                $scope.Lista_CondicionFact = data;
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };
    $scope.Listando_CondicionFacturacion();

    $scope.Lista_Bancos = [];
    $scope.Listando_Bancos = function () {
        $scope.loaderfiltros = true;
        GrupoDetServices.getGrupoTabla_Det(6)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Bancos = [];
                $scope.Lista_Bancos = data;
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };
    $scope.Listando_Bancos();


    $scope.Lista_Proveedor = [];
    $scope.Listando_Proveedor = function () {
        ProveedorServices.getProveedores()
            .then(function (data) {
                console.log(data);
                $scope.Lista_Proveedor = [];
                $scope.Lista_Proveedor = data.filter((p)=> p.estado ==1);
            }, function (err) {
                console.log(err);
            })
    };
    $scope.Listando_Proveedor();

    var oTableCab;

    $scope.ingresoFacturasCab = [];
    $scope.mostrandoInformacion_ingresoFacturas = function () {

        //const idEstado = $scope.Objeto_Parametro_Filtro.idEstado;
        //const fechaIni = auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_Filtro.fechaIni);
        //const fechaFin = auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_Filtro.fechaFin);

        $scope.loaderFiltro = true;
        IngresoFacturasServices.get_ingresosFacturas($scope.Objeto_Parametro_Filtro.idLocal, $scope.Objeto_Parametro_Filtro.idAlmacen, $scope.Objeto_Parametro_Filtro.idEstado, $scope.Objeto_Parametro_Filtro.fechaIni, $scope.Objeto_Parametro_Filtro.fechaFin, $scope.Objeto_Parametro_Filtro.id_Proveedor)
            .then(function (res) {
                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    $scope.ingresoFacturasCab = [];
                    $scope.ingresoFacturasCab = res.data;
                    $timeout(function () {
                        $scope.loader = false;
                        if (oTableCab == null) {
                            oTableCab = 'data'
                            auxiliarServices.initFooTable('tablaIngresoFacturas', '');
                        } else {
                            $('#tablaIngresoFacturas').trigger('footable_initialize');
                        }
                    }, 500)

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderFiltro = false;
                console.log(error)
            })
    }

    $scope.Open_New_Modal = function () {
        $scope.nuevaIngreso();
        $scope.disabledForm = "";
        $('#modalMantenimiento').modal('show');
        $scope.calculoTotales();
    }

    $scope.nuevaIngreso = function () {
        $scope.Flag_modoEdicion = false;
        $scope.id_GuiaCab_Global = 0;
        $scope.blank();
        $scope.disabledProd = "disabledContent";

        $scope.guiasDet = [];
 
    }
     

    $scope.getProveedorByDoc = function () {
 
        $scope.disabledProveedor = "disabledContent";
        var params = {
            filter: $scope.Objeto_Parametro.nroDocumento_Proveedor
        }
        ProveedorServices.getProveedor(params).then(function (res) {
            $timeout(function () {
                if (res.length == 0) {
                    $scope.Objeto_Parametro.razonSocial_Proveedor = "";
                    $scope.Objeto_Parametro.id_Proveedor = 0;
                    auxiliarServices.NotificationMessage('Sistemas', 'No se encontro el Proveedor', 'error', '#ff6849', 1500);
                    return false;
                } else { 
                    $scope.Objeto_Parametro.razonSocial_Proveedor = res[0].razonSocial_Proveedor;
                    $scope.Objeto_Parametro.id_Proveedor = res[0].id_Proveedor;
                }
            }, 0)
        }, function (err) {
            console.log(err);
        });
    }

    var oTable;

    $scope.ModalSearch = function (value) {
        var filter = document.getElementById('inputSearch');
        $timeout(function () {
            $scope.searchFilter = '';
            filter.value = "";
        }, 100)
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
            var params = {
                filter: filter.value
            }
            $scope.listBusqueda = [];
            productosServices.getProductosByFilter(params).then(function (res) {
                res.forEach(function (item, index) {

                    $scope.listBusqueda.push({
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
                        movLote: item.movLote
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
    }

    $scope.selectId = function (item) {

        $scope.flagLote_Global = false;
        if ($scope.valueAux == 1) {
            // PROVEEDORES
            $('#ModalSearch').modal('hide');
            $scope.Objeto_Parametro.razonSocial_Proveedor = item.descripcion;
            $scope.Objeto_Parametro.nroDocumento_Proveedor = item.codigo;
            $scope.Objeto_Parametro.id_Proveedor = item.id_select;

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

            if (item.movLote == 1) {
                $scope.flagLote_Global = true;
            } else {
                $scope.flagLote_Global = false;
            }

            $timeout(function () {
                $('.datepicker').datepicker({
                    autoclose: true,
                    todayHighlight: true,
                    format: 'dd/mm/yyyy',
                });
            }, 0)

            $timeout(function () {
                $scope.enterFocus(1, 'txtCantidad');
            }, 500);
        }
    }

    $scope.saveUpdate = async function () {
        
        if ($scope.Objeto_Parametro.id_Local == '0' || $scope.Objeto_Parametro.id_Local == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Local', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.id_Almacen == '0' || $scope.Objeto_Parametro.id_Almacen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Almacén', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.id_tipo_documento == '0' || $scope.Objeto_Parametro.id_tipo_documento == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Documento', 'error', '#ff6849', 1500);
            return false;
        }                             
        if ($scope.Objeto_Parametro.nro_documento == '' || $scope.Objeto_Parametro.nro_documento == null || $scope.Objeto_Parametro.nro_documento == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el nro de documento', 'error', '#ff6849', 1500);
            return false;
        }     
        if ($scope.Objeto_Parametro.fecha_emision == '' || $scope.Objeto_Parametro.fecha_emision == null || $scope.Objeto_Parametro.fecha_emision == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la fecha emision', 'error', '#ff6849', 1500);
            return false;
        } 
        if ($scope.Objeto_Parametro.id_Proveedor == '0' || $scope.Objeto_Parametro.id_Proveedor == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor busque el Proveedor por el Nro de Ruc', 'error', '#ff6849', 1500);
            return false;
        }         

        if ($scope.Flag_modoEdicion == false) {
            const { ok, data } = await IngresoFacturasServices.get_verificarNroDoc($scope.Objeto_Parametro.id_tipo_documento, $scope.Objeto_Parametro.nro_documento, $scope.Objeto_Parametro.id_Proveedor)
            $scope.$apply();

            if (ok) {
                if (data[0].cantRegistro > 0) {
                    auxiliarServices.NotificationMessage('Sistemas', 'El nro de Documento ya se encuentra registrado, verifique..', 'error', '#ff6849', 2000);
                    return false;
                }
            } else {
                auxiliarServices.NotificationMessage('Sistemas', data, 'error', '#ff6849', 3000);
                return false;
            }
        }


        const fechaEmision = $scope.Objeto_Parametro.fecha_emision;
        const fechaEmisionOC = $scope.Objeto_Parametro.fecha_emision_oc;
        
        $scope.Objeto_Parametro.fecha_emision = (!$scope.Objeto_Parametro.fecha_emision) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro.fecha_emision);  
        $scope.Objeto_Parametro.fecha_emision_oc = (!$scope.Objeto_Parametro.fecha_emision_oc) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro.fecha_emision_oc);
                
        if ($scope.Flag_modoEdicion == false) { // nuevo registroo 
            $scope.loaderSave = true;
            IngresoFacturasServices.save_ingresosFacturas($scope.Objeto_Parametro)
            .then(function (res) {
                $scope.loaderSave = false;
                $scope.Flag_modoEdicion = true;

                $scope.Objeto_Parametro.fecha_emision = fechaEmision;
                $scope.Objeto_Parametro.fecha_emision_oc = fechaEmisionOC;

                if (res.ok == true) {
                    $scope.Objeto_Parametro.id_GuiaCab = res.data;
                    $scope.id_GuiaCab_Global = res.data;

                    $scope.disabledProd = "";
                    $scope.mostrandoInformacion_ingresoFacturas();

                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso de Registro realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {
                        });

                    }, 500)

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {

                $scope.Objeto_Parametro.fecha_emision = fechaEmision;
                $scope.Objeto_Parametro.fecha_emision_oc = fechaEmisionOC;

                $scope.loaderSave = false;
                alert(error);
            })
        } else {  //actualizar
            $scope.loaderSave = true;
            IngresoFacturasServices.update_ingresosFacturas($scope.Objeto_Parametro)
            .then(function (res) {
                $scope.loaderSave = false;

                $scope.Objeto_Parametro.fecha_emision = fechaEmision;
                $scope.Objeto_Parametro.fecha_emision_oc = fechaEmisionOC;

                if (res.ok == true) {       
                    $scope.disabledProd = "";
                    $scope.mostrandoInformacion_ingresoFacturas();
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Actualización realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                    });

                }, 500)

            }, function (error) {

                $scope.Objeto_Parametro.fecha_emision = fechaEmision;
                $scope.Objeto_Parametro.fecha_emision_oc = fechaEmisionOC;

                $scope.loaderSave = false;
                alert(error);
            })
        }
    }
         
    $scope.Open_New_Modal_agregarGuias = function () {

        //if ($scope.id_GuiaCab_Global == 0) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'NO se tiene el Id de la Cabecera del Documento, Grabe primero la cabecera por favor ..', 'error', '#ff6849', 2500);
        //    return false;
        //}

        if ($scope.Objeto_Parametro.id_Almacen == '0' || $scope.Objeto_Parametro.id_Almacen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Almacén', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro.id_Proveedor == '0' || $scope.Objeto_Parametro.id_Proveedor == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Proveedor, ingrese el ruc y luego presione Enter', 'error', '#ff6849', 1500);
            return false;
        }


        $scope.checkedAll = false;
        const consulta = document.getElementById('txt_busqueda');
        consulta.value = "";
               
        $scope.guiasCab = [];
        oTableGuiasCab == null
        $('#modalGuias').modal('show'); 
 
    }

    // METODO PARA CHEKED ALL
    $scope.checkedAll = false;
    $scope.marcarTodos = function (checked) {
        if (checked) {
            angular.forEach($scope.guiasCab, function (child) {
                child.checkeado = true;
            })
        } else {
            angular.forEach($scope.guiasCab, function (child) {
                child.checkeado = false;
            })
        }
    }
    
    var oTableGuiasCab;
    $scope.guiasCab = [];

    $scope.mostrar_guiasCab = function () {

        const consulta = document.getElementById('txt_busqueda').value;
        $scope.checkedAll = false;

        $scope.loaderSaveD = true;
        $scope.guiasCab = [];
        IngresoFacturasServices.get_guiasCab(consulta, auxiliarServices.getUserId(), $scope.Objeto_Parametro.id_Almacen, $scope.Objeto_Parametro.id_Proveedor )
            .then(function (res) {
                $scope.loaderSaveD = false;
 
                if (res.ok == true) {
                    $scope.guiasCab = res.data;

                    $timeout(function () {
                        $scope.loader = false;
                        if (oTableGuiasCab == null) {
                            oTableGuiasCab = 'data'
                            auxiliarServices.initFooTable('tablaGuias', '');
                        } else {
                            //$('#tablaGuias').trigger('footable_initialize');
                            oTableGuiasCab = 'data'
                            auxiliarServices.initFooTable('tablaGuias', '');
                        }
                    }, 500)

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                    $scope.loaderSaveD = false;
                console.log(error)
            })
    }
    
    function MarcoCheck() {
        var flag_marco = false;
        for (var i = 0; i < $scope.guiasCab.length; i++) {
            if ($scope.guiasCab[i].checkeado == true) {
                flag_marco = true;
                break;
            }
        }
        return flag_marco;
    }

    function ListaMarcoCheck() {
        var List_id = [];
        for (var i = 0; i < $scope.guiasCab.length; i++) {
            if ($scope.guiasCab[i].checkeado == true) {
                List_id.push($scope.guiasCab[i].id_guia)
            }

        }
        return List_id;
    }
         
    $scope.agregarMasivo = function () {
        var idGuiasMasivos = [];
        var flag_marco_user = false;

        flag_marco_user = MarcoCheck();
        if (flag_marco_user == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor marque al menos un Item', 'error', '#ff6849', 1500);
            return;
        }
        idGuiasMasivos = ListaMarcoCheck();

        var params = {
            title: "Desea continuar ?",
            text: 'Agregar las Guias marcadas',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderSaveD = true;
                IngresoFacturasServices.set_agregarGuiasCab(idGuiasMasivos, auxiliarServices.getUserId(), $scope.id_GuiaCab_Global)
                .then(function (res) {
                    $scope.loaderSaveD = false;
                    console.log(res);
                    if (res.ok == true) {
                        $('#modalGuias').modal('hide');
                        $scope.mostrar_guiasDetalle();
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(JSON.stringify(res.data));
                    }
                }, function (err) {
                        $scope.loaderSaveD = false;
                    console.log(err);
                })
            }
        });
    }
       
    var oTableGuiasDet;
    $scope.guiasDet = [];

    $scope.mostrar_guiasDetalle = function () {

        $scope.loaderSave = true;
        $scope.guiasDet = [];
        IngresoFacturasServices.get_guiasDetalle($scope.id_GuiaCab_Global)
            .then(function (res) {

                $scope.loaderSave = false;
                if (res.ok == true) {
                    $scope.guiasDet = res.data;

                    $timeout(function () {
                        $scope.loader = false;
                        if (oTableGuiasDet == null) {
                            oTableGuiasDet = 'data'
                            auxiliarServices.initFooTable('tablaGuiasDetalle', '');
                        } else {
                            $('#tablaGuiasDetalle').trigger('footable_initialize');
                        }
                    }, 500)

                    $scope.calculoTotales();

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderSave = false;
                console.log(error)
            })
    }
    
    $scope.editarCantidad_guiaDet = function (objDetalle) {

        const cantGuia = (objDetalle.cantidad == null) ? 0 : Number(objDetalle.cantidad);
        const cantModif = (objDetalle.modificacionesCantidad == null) ? 0 : Number(objDetalle.modificacionesCantidad);
        const precioModif = (objDetalle.modificacionesPrecio == null) ? 0 : Number(objDetalle.modificacionesPrecio);

        if (cantModif > cantGuia ) {
            auxiliarServices.NotificationMessage('Sistemas', 'La cantidad ingresada supera a la cantidad de la Guía', 'error', '#ff6849', 3000);
            return;
        }

        if (cantModif <=0) {
            auxiliarServices.NotificationMessage('Sistemas', 'La cantidad ingresada debe ser mayor a cero', 'error', '#ff6849', 3000);
            return;
        }
        
        $scope.loaderSave = true;
        IngresoFacturasServices.set_actualizar_guiaDetalleCantidad(objDetalle.id_GuiaDet, cantModif ,  auxiliarServices.getUserId() )
            .then(function (res) {
                $scope.loaderSave = false;
                console.log(res);
                if (res.ok == true) {
                    objDetalle.importe = (cantModif * precioModif).toFixed(2);
                    auxiliarServices.NotificationMessage('Sistemas', 'Se actualizo correctamente', 'info', '#49e0ff ', 2000);
                    $scope.calculoTotales();
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(JSON.stringify(res.data));
                }
            }, function (err) {
                    $scope.loaderSave = false;
                console.log(err);
            })
    }

    $scope.eliminar_detalleGuia = function (objDetalle) {
        var params = {
            title: "Desea continuar ?",
            text: 'Esta a punto de eliminar el registro',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderSave = true;
                IngresoFacturasServices.set_eliminar_guiaDetalle(objDetalle.id_GuiaDet, auxiliarServices.getUserId() )
                    .then(function (res) {
                        $scope.loaderSave = false; 
                        if (res.ok == true) {
                            auxiliarServices.NotificationMessage('Sistemas', 'Se elimino correctamente', 'info', '#49e0ff ', 2000);
                             $scope.mostrar_guiasDetalle();
                        } else {
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(JSON.stringify(res.data));
                        }
                    }, function (err) {
                            $scope.loaderSave = false;
                        console.log(err);
                    })
            }
        });   
    }
    
    $scope.EdicionRegistros = function (obj) {

        $scope.Flag_modoEdicion = true;
        $scope.id_GuiaCab_Global = obj.id_GuiaCab;
        
        $scope.loaderSave = true; 
        IngresoFacturasServices.get_guiasCabeceraEdicion($scope.id_GuiaCab_Global)
            .then(function (res) {
                $scope.loaderSave = false;
                console.log(res)
                if (res.ok == true) {   

                    if (res.data.length > 0) {    

                        const objCab = res.data[0];
                        
                        $scope.Objeto_Parametro.id_Empresa = String(objCab.id_Empresa);
                        $scope.Objeto_Parametro.id_Local = String(objCab.id_Local);
                        $scope.Objeto_Parametro.id_Almacen = String(objCab.id_Almacen);
                        $scope.Objeto_Parametro.id_Moneda = String(objCab.id_Moneda);
                        $scope.Objeto_Parametro.tipoCambio_GuiaCab = String(objCab.tipoCambio_GuiaCab);

                        $scope.Objeto_Parametro.id_Proveedor = String(objCab.id_Proveedor);
                        $scope.Objeto_Parametro.razonSocial_Proveedor = String(objCab.razonSocial_Proveedor);
                        $scope.Objeto_Parametro.nroDocumento_Proveedor = String(objCab.nroDocumento_Proveedor);
                        $scope.Objeto_Parametro.obs_GuiaCab = String(objCab.obs_GuiaCab);
                        $scope.Objeto_Parametro.estado = String(objCab.estado);

                        $scope.Objeto_Parametro.id_tipo_documento = String(objCab.id_tipo_documento);
                        $scope.Objeto_Parametro.nro_documento = String(objCab.nro_documento);
                        $scope.Objeto_Parametro.fecha_emision = (!objCab.fecha_emision)? null : String(objCab.fecha_emision);
                        $scope.Objeto_Parametro.fecha_emision_oc = (!objCab.fecha_emision_oc) ? null : String(objCab.fecha_emision_oc);
                        $scope.Objeto_Parametro.nro_orden_compra = String(objCab.nro_orden_compra);

                        $scope.Objeto_Parametro.id_CondicionPago = String(objCab.id_CondicionPago);
                        $scope.Objeto_Parametro.id_Banco = String(objCab.id_Banco);
                        $scope.Objeto_Parametro.nroCuenta = String(objCab.nroCuenta);
                        $scope.Objeto_Parametro.CCINro = String(objCab.CCINro);
                        $scope.Objeto_Parametro.flag_tipo_facturacion = String(objCab.flag_tipo_facturacion);


                        $scope.disabledProd = "";
                        $scope.disabledForm = "";
           
                        if ($scope.Objeto_Parametro.estado == '3') {      
                            $scope.disabledForm = "";
                        } else {
                            $scope.disabledForm = "disabledContent";
                        }

                        $timeout(function () {
                            $('#cboLocal').val(String(objCab.id_Local)).trigger('change.select2');
                            //$('#cboAlmacen').val(String(objCab.id_Almacen)).trigger('change.select2');
                            $scope.change_localAlmacen(String(objCab.id_Local), String(objCab.id_Almacen));

                            $('#cboTipoDoc').val(String(objCab.id_tipo_documento)).trigger('change.select2');
                            $('#cbo_cond_facturacion').val(String(objCab.id_CondicionPago)).trigger('change.select2');
                            $('#cbo_banco').val(String(objCab.id_Banco)).trigger('change.select2');
                            $('#cboMoneda').val(String(objCab.id_Moneda)).trigger('change.select2');
                            $('#cbo_tipo_Factura').val(String(objCab.flag_tipo_facturacion)).trigger('change.select2');
                        }, 0);

                        $scope.mostrar_guiasDetalle();

                        $timeout(function () {
                            $('#modalMantenimiento').modal('show');
                        }, 0)

                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'No hay información para mostrar', 'error', '#ff6849', 1500);
                        return false;
                    }

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderSave = false;
                console.log(error)
            })
    }

    $scope.change_localAlmacen = function (idLocal, idAlmacen) {
 
        AlmacenServices.getAlmacenesLocal(idLocal).then(function (res) {
                $scope.listAlmacenes = [];
                $scope.listAlmacenes = res;
                $timeout(function () {
                    $('#cboAlmacen').val(String(idAlmacen)).trigger('change.select2');
                });                
            }, function (err) {
                console.log(err);
            });
  
 
    };

    $scope.cerrar_Guia = function () {
        var params = {
            title: "Desea continuar ?",
            text: 'Esta a punto de cerrar la Factura',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderSave = true;
                IngresoFacturasServices.set_cerrarGuia($scope.id_GuiaCab_Global, auxiliarServices.getUserId() )
                    .then(function (res) {
                        $scope.loaderSave = false;
                        if (res.ok == true) {

                            $('#modalMantenimiento').modal('hide');
                            $scope.mostrandoInformacion_ingresoFacturas();

                            $timeout(function () {
                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Proceso de Registro realizado correctamente !'
                                }
                                auxiliarServices.initSweetAlert(params).then(function (res) {
                                });

                            }, 500)

                        } else {
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(JSON.stringify(res.data));
                        }
                    }, function (err) {
                        $scope.loaderSave = false;
                        console.log(err);
                    })
            }
        });
    }


    $scope.editarPrecio_guiaDet = function (objDetalle) {

        const cantModif = (objDetalle.modificacionesCantidad == null) ? 0 : Number(objDetalle.modificacionesCantidad);
        const precioModif = (objDetalle.modificacionesPrecio == null) ? 0 : Number(objDetalle.modificacionesPrecio);
        
        if (precioModif <= 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'El precion  debe ser mayor a cero', 'error', '#ff6849', 3000);
            return;
        }

        $scope.loaderSave = true;
        IngresoFacturasServices.set_actualizar_guiaDetallePrecio(objDetalle.id_GuiaDet, precioModif, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderSave = false;
                console.log(res);
                if (res.ok == true) {

                    objDetalle.importe = (cantModif * precioModif).toFixed(2);
                    auxiliarServices.NotificationMessage('Sistemas', 'Se actualizo correctamente', 'info', '#49e0ff ', 2000);
                    $scope.calculoTotales();

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(JSON.stringify(res.data));
                }
            }, function (err) {
                $scope.loaderSave = false;
                console.log(err);
            })
    }

    $scope.SubTotal = 0;
    $scope.IgvTotal = 0;
    $scope.Total = 0;


    $scope.calculoTotales = function () {

        let neto = 0;
        $scope.SubTotal = 0;
        $scope.IgvTotal = 0;
        $scope.Total = 0;

        for (item of $scope.guiasDet) {
            neto += (item.importe == null) ? 0 : Number(item.importe) ;
        }
        
        $scope.SubTotal = parseFloat(neto / 1.18).toFixed(2);
        $scope.IgvTotal = parseFloat(neto - $scope.SubTotal).toFixed(2);
        $scope.Total = parseFloat(neto).toFixed(2);
               
    }
 

    $scope.descargarExcel = function () {
 
        var id_link = document.getElementById('id_link');
        $scope.loaderFiltro = true;
        IngresoFacturasServices.get_descargarIngresoFacturasExcel($scope.Objeto_Parametro_Filtro.idLocal, $scope.Objeto_Parametro_Filtro.idAlmacen, $scope.Objeto_Parametro_Filtro.idEstado, $scope.Objeto_Parametro_Filtro.fechaIni, $scope.Objeto_Parametro_Filtro.fechaFin, $scope.Objeto_Parametro_Filtro.id_Proveedor)
            .then(function (res) {
                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    id_link.href = res.data.replace(/["']/g, "");
                    id_link.click();
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderFiltro = false;
                console.log(error)
            })
    }

    $scope.verificarNroDoc = function () {

        if ($scope.Objeto_Parametro.id_tipo_documento == '0' || $scope.Objeto_Parametro.id_tipo_documento == 0) {
            return;
        }

        if ($scope.Objeto_Parametro.nro_documento == '' || $scope.Objeto_Parametro.nro_documento == null) {
            return;
        }
        if ($scope.Objeto_Parametro.id_Proveedor == '0' || $scope.Objeto_Parametro.id_Proveedor == 0) {
            return;
        }
    
        IngresoFacturasServices.get_verificarNroDoc($scope.Objeto_Parametro.id_tipo_documento , $scope.Objeto_Parametro.nro_documento, $scope.Objeto_Parametro.id_Proveedor)
            .then(function (res) {
                if (res.ok == true) {
                    if (res.data[0].cant > 0) {
                        auxiliarServices.NotificationMessage('Sistemas', 'El nro de Documento ya se encuentra registrado, verifique..', 'error', '#ff6849', 2000);
                    }
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                console.log(error)
            })
    }



    $scope.anular_ingreoFactura = function (obj) {

        if (parseInt(obj.idEstado) != 3  ) {
            return;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Anular el Documento.',
            type: 'confirmationAlert'
        };

        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res === true) {
                $scope.loaderFiltro = true;
                IngresoFacturasServices.get_anularDocumento(obj.id_GuiaCab, auxiliarServices.getUserId())
                    .then(function (res) {
                        $scope.loaderFiltro = false;
                        if (res.ok == true) {

                            $scope.loaderFiltro = false;
                            var index = $scope.ingresoFacturasCab.indexOf(obj);
                            $scope.ingresoFacturasCab[index].idEstado = 4;
                            $scope.ingresoFacturasCab[index].descripcionEstado = 'Anulado';

                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Se rechazó el Documento Correctamente. !'
                            };
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });
                        } else {
                            $scope.loaderFiltro = false;
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(res.data);
                        }
                    }, function (error) {
                        $scope.loaderFiltro = false;
                        console.log(error);
                    });
            }
        });


    };




     
})
