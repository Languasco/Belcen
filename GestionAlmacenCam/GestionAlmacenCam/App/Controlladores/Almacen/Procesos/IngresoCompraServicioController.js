var app = angular.module('appGestion.IngresoCompraServicioController', [])

app.controller('IngresoCompraServicioController', function ($scope, RevisionPedidoServices, $location, ProveedorServices, $timeout, auxiliarServices,  GrupoDetServices, EstadosServices, TipoDocumentoServices, IngresoCompraServicioServices, AuditarServices) {
    

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;
 
        auxiliarServices.changeTitle("Ingreso de Facturas por Compra o Servicio");
        $scope.titleModal = "Registro de Promociones";
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
    $scope.id_GuiaCab_Global = 0;
    $scope.id_GuiaDet_Global = 0;
    $scope.Flag_modoEdicion = false;

    
    $scope.disabledEncabezado = "disabledContent";
    $scope.disabledProd = "disabledContent";
    $scope.disabledForm = "disabledContent";
    $scope.files = [];
    $scope.Flag_modoEdicion_Det = false;
       
    $scope.Objeto_Parametro_Filtro = {
        idTipoOrden: "0",
        idAnexo: "0",
        idLocal: "0",
        idAlmacen: "0",
        idEstado: "0",
        fechaIni: auxiliarServices.getDateNow(),
        fechaFin: auxiliarServices.getDateNow(),
        id_Proveedor: "0",
    };


    $scope.getAuditorias = function (item) { 

        const uCreacion = (!item.usuario_creacion) ? 0 : item.usuario_creacion;
        const uEdicion = (!item.usuario_edicion) ? 0 : item.usuario_edicion;

        const fechaCreacion = item.fecha_creacion;
        const fechaEdicion = item.fecha_edicion;

        AuditarServices.getAuditoria(uCreacion, uEdicion)
            .then(function (res) {

                if (res.ok) {
                    let usuarioCreacion = res.data[0].descripcion;
                    let usuarioEdicion = (res.data.length == 1) ? '' : res.data[1].descripcion;

                    var message = "Fecha Creación : " + fechaCreacion + "</br>" +
                        "Usuario Creación : " + usuarioCreacion + "</br>" +
                        "Fecha Edición : " + fechaEdicion + "</br>" +
                        "Usuario Edición : " + usuarioEdicion + "</br>"
                    auxiliarServices.NotificationMessage('Sistemas', message, 'success', '#008000', 5000);
                }
            })
    }




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
        flag_tipo_facturacion: '1', //----

        id_TipoOrden: '0',
        id_anexos: '0',
        porDetraccion: '',
        ExoneradaIGV: false,
        porRetencion: '',
        nombreArchivo_Adjunto: '',
    }

    $scope.Objeto_Parametro_Detalle = {
        idProducto: '0',
        codigoProducto: '',
        descripcionProducto: '',
        idUnidadMedida: '0',
        cantidad: '0',
        precio: '0',
        importe: '0',
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

        $scope.Objeto_Parametro.id_TipoOrden = '0';
        $scope.Objeto_Parametro.id_anexos = '0';
        $scope.Objeto_Parametro.porDetraccion = '';
        $scope.Objeto_Parametro.ExoneradaIGV = false;
        $scope.Objeto_Parametro.porRetencion = '';
        $scope.Objeto_Parametro.nombreArchivo_Adjunto = '';        
        

        $timeout(function () {
            $('#cbo_tipoOrdenModal').val("0").trigger('change.select2');
            $('#cbo_anexoModal').val("0").trigger('change.select2');
            $('#cbo_almacenModal').val("0").trigger('change.select2');

            $('#cboTipoDoc').val("0").trigger('change.select2');
            $('#cbo_cond_facturacion').val('0').trigger('change.select2');
            $('#cbo_banco').val('0').trigger('change.select2');
            $('#cboMoneda').val('1').trigger('change.select2');
            $('#txtFechaEmision').datepicker('setDate', new Date());
        }, 0);
    }
 
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

        //if ($scope.Objeto_Parametro_Filtro.idAnexo == '0' ) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Anexo', 'error', '#ff6849', 3000);
        //    return;
        //}
        //if ($scope.Objeto_Parametro_Filtro.idAlmacen == '0') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Almacen', 'error', '#ff6849', 3000);
        //    return;
        //}

        $scope.loaderFiltro = true;
        IngresoCompraServicioServices.get_ingresosFacturas($scope.Objeto_Parametro_Filtro.idTipoOrden, $scope.Objeto_Parametro_Filtro.idAnexo, $scope.Objeto_Parametro_Filtro.idAlmacen, $scope.Objeto_Parametro_Filtro.idEstado, $scope.Objeto_Parametro_Filtro.fechaIni, $scope.Objeto_Parametro_Filtro.fechaFin, $scope.Objeto_Parametro_Filtro.id_Proveedor)
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

    $scope.showFileName = false;

    $scope.Open_New_Modal = function () {
        $scope.nuevaIngreso();
        $scope.disabledForm = "";
        $scope.disabledProd = "disabledContent";
        $('#modalMantenimiento').modal('show');
    }

    $scope.nuevaIngreso = function () {
        $scope.Flag_modoEdicion = false;
        $scope.showFileName = false;
        $scope.id_GuiaCab_Global = 0;
        $scope.blank();
        $scope.disabledProd = "disabledContent";
        $scope.disabledEncabezado = "";

        $scope.titleFile = 'Adjuntar Documento';
        $scope.files = [];
        $("#inputFileOpen").val('');
        $scope.guiasDet = [];
        $scope.nuevoDet();
        $scope.calculoTotales(true);
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
 
        
        if ($scope.Objeto_Parametro.id_TipoOrden == '0' || $scope.Objeto_Parametro.id_TipoOrden == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Tipo de Orden', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.id_anexos == '0' || $scope.Objeto_Parametro.id_anexos == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Anexo', 'error', '#ff6849', 1500);
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
            const { ok, data } = await IngresoCompraServicioServices.get_verificarNroDoc($scope.Objeto_Parametro.id_tipo_documento, $scope.Objeto_Parametro.nro_documento, $scope.Objeto_Parametro.id_Proveedor)
            $scope.$apply();

            if (ok) {
                if (data[0].cant > 0) {
                    auxiliarServices.NotificationMessage('Sistemas', 'El nro de Documento : ' + $scope.Objeto_Parametro.nro_documento + '  ya se encuentra registrado, verifique..', 'error', '#ff6849', 2000);
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
            IngresoCompraServicioServices.save_ingresosFacturas({ ...$scope.Objeto_Parametro, ExoneradaIGV: ($scope.Objeto_Parametro.ExoneradaIGV)? 1 : 0 } )
            .then(function (res) {
                $scope.loaderSave = false;
                $scope.Flag_modoEdicion = true;

                $scope.Objeto_Parametro.fecha_emision = fechaEmision;
                $scope.Objeto_Parametro.fecha_emision_oc = fechaEmisionOC;

                if (res.ok == true) {

                    $scope.Objeto_Parametro.id_GuiaCab = res.data;
                    $scope.id_GuiaCab_Global = res.data;
                    $scope.disabledProd = "";

                    //---almacenando al voucher ----
                    if ($scope.files.length > 0) {
                        $scope.upload_imageComprobante($scope.id_GuiaCab_Global);
                    }

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
            IngresoCompraServicioServices.update_ingresosFacturas({ ...$scope.Objeto_Parametro, ExoneradaIGV: ($scope.Objeto_Parametro.ExoneradaIGV) ? 1 : 0 } )
            .then(function (res) {
                $scope.loaderSave = false;

                $scope.Objeto_Parametro.fecha_emision = fechaEmision;
                $scope.Objeto_Parametro.fecha_emision_oc = fechaEmisionOC;

                if (res.ok == true) {       
                    $scope.disabledProd = "";

                    //---almacenando al voucher ----
                    if ($scope.files.length > 0) {
                        $scope.upload_imageComprobante($scope.id_GuiaCab_Global);
                    }

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

    $scope.upload_imageComprobante = function (idGuiaCab) {
        console.log('enviando imagen')
        $scope.loaderSave = true;
        IngresoCompraServicioServices.uploadFile_imageComprobante($scope.files[0].file, idGuiaCab, $scope.id_usuario_Global)
            .then(function (res) {

                $scope.loaderSave = false;
                if (res.ok == false) {
                    auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error almacenando la imagen.', 'error', '#ff6849', 2500);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderSave = false;
                alert(error.ExceptionMessage)
            });
    };


    
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
         
  
    var oTableGuiasDet;
    $scope.guiasDet = [];

    $scope.mostrar_guiasDetalle = function () {

        $scope.loaderSave = true;
        $scope.guiasDet = [];
        IngresoCompraServicioServices.get_guiasDetalle_comprasServicios($scope.id_GuiaCab_Global)
            .then(function (res) {
                $scope.loaderSave = false;
                if (res.ok == true) {
                    $scope.guiasDet = res.data;
                    $scope.calculoTotales(false);

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderSave = false;
                console.log(error)
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
                IngresoCompraServicioServices.set_eliminar_guiaDetalleCompraServicio(objDetalle.id_GuiaDet, auxiliarServices.getUserId() )
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
        IngresoCompraServicioServices.get_guiasCabeceraEdicion($scope.id_GuiaCab_Global)
            .then(function (res) {
                $scope.loaderSave = false;
                console.log(res)
                if (res.ok == true) {   

                    if (res.data.length > 0) {    

                        const objCab = res.data[0];

                        $scope.Objeto_Parametro.id_GuiaCab = obj.id_GuiaCab;
                        $scope.Objeto_Parametro.id_Empresa = String(objCab.id_Empresa);
                        $scope.Objeto_Parametro.id_Local = String(objCab.id_Local);
    /*                    $scope.Objeto_Parametro.id_Almacen = String(objCab.id_Almacen);*/
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

                        $scope.Objeto_Parametro.id_TipoOrden = String(objCab.id_TipoOrden);
                        $scope.Objeto_Parametro.id_anexos = String(objCab.id_anexos);
                        $scope.Objeto_Parametro.porDetraccion = String(objCab.porDetraccion);
                        $scope.Objeto_Parametro.ExoneradaIGV =  String(objCab.ExoneradaIGV) == 1 ? true:false ;
                        $scope.Objeto_Parametro.porRetencion = String(objCab.porRetencion);
                        $scope.Objeto_Parametro.nombreArchivo_Adjunto = String(objCab.nombreArchivo_Adjunto);

                        $scope.titleFile = 'Reemplazar Documento';


                        $scope.disabledProd = "";
                        $scope.disabledForm = "";
                        $scope.showFileName = true;
                        $scope.showFileName = true;
           
                        if ($scope.Objeto_Parametro.estado == '3') {      
                            $scope.disabledForm = "";
                        } else {
                            $scope.disabledForm = "disabledContent";
                        }

                        $timeout(function () {                            
                            $('#cbo_tipoOrdenModal').val($scope.Objeto_Parametro.id_TipoOrden).trigger('change.select2');
                            $('#cbo_anexoModal').val($scope.Objeto_Parametro.id_anexos).trigger('change.select2');

                            $scope.change_anexo_AlmacenModal($scope.Objeto_Parametro.id_anexos, String(objCab.id_Almacen))
 
                            $('#cboTipoDoc').val(String(objCab.id_tipo_documento)).trigger('change.select2');
                            $('#cbo_cond_facturacion').val(String(objCab.id_CondicionPago)).trigger('change.select2');
                            $('#cbo_banco').val(String(objCab.id_Banco)).trigger('change.select2');
                            $('#cboMoneda').val(String(objCab.id_Moneda)).trigger('change.select2');
                            $('#cbo_tipo_Factura').val(String(objCab.flag_tipo_facturacion)).trigger('change.select2');
                            $('#txtFechaEmision').datepicker('setDate', $scope.Objeto_Parametro.fecha_emision);

                            $scope.disabledEncabezado = "disabledContent";


                        }, 0);

                        $scope.nuevoDet();
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

    $scope.cerrar_Guia = function () {
        var params = {
            title: "Desea continuar ?",
            text: 'Esta a punto de cerrar el Documento',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderSave = true;
                IngresoCompraServicioServices.set_cerrarGuiacompraServicio($scope.id_GuiaCab_Global, auxiliarServices.getUserId() )
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

 
    $scope.SubTotal = 0;
    $scope.IgvTotal = 0;
    $scope.Total = 0;

    $scope.DetraccionG = 0;
    $scope.RetencionG = 0;
    $scope.TotalPagarG = 0;

    $scope.calculoTotales = function (inicial) {

        $scope.SubTotal = '0.00';
        $scope.IgvTotal = '0.00';
        $scope.Total = '0.00';

        $scope.DetraccionG = '0.00';
        $scope.RetencionG = '0.00';
        $scope.TotalPagarG = '0.00';

        if (inicial == false) {
            if ($scope.guiasDet.length > 0) {
                $scope.SubTotal = parseFloat($scope.guiasDet[0].subTotal).toFixed(2);
                $scope.IgvTotal = parseFloat($scope.guiasDet[0].totalIgv).toFixed(2);
                $scope.Total = parseFloat($scope.guiasDet[0].total).toFixed(2);

                $scope.DetraccionG = parseFloat($scope.guiasDet[0].TotDetraccion).toFixed(2);
                $scope.RetencionG = parseFloat($scope.guiasDet[0].TotRetencion).toFixed(2);
                $scope.TotalPagarG = parseFloat($scope.guiasDet[0].TotPago).toFixed(2);

            }
        }
    }
 

    $scope.descargarExcel = function () {
 
        var id_link = document.getElementById('id_link');
        $scope.loaderFiltro = true;        
        IngresoCompraServicioServices.get_descargar_IngresoFacturasCompraServicioExcel($scope.Objeto_Parametro_Filtro.idTipoOrden, $scope.Objeto_Parametro_Filtro.idAnexo, $scope.Objeto_Parametro_Filtro.idAlmacen, $scope.Objeto_Parametro_Filtro.idEstado, $scope.Objeto_Parametro_Filtro.fechaIni, $scope.Objeto_Parametro_Filtro.fechaFin, $scope.Objeto_Parametro_Filtro.id_Proveedor)
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
    
        IngresoCompraServicioServices.get_verificarNroDoc($scope.Objeto_Parametro.id_tipo_documento , $scope.Objeto_Parametro.nro_documento, $scope.Objeto_Parametro.id_Proveedor)
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
                IngresoCompraServicioServices.get_anularDocumento(obj.id_GuiaCab, auxiliarServices.getUserId())
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



    $scope.anular_ingreoFacturaCompraServicio = function (obj) {

        if (parseInt(obj.idEstado) != 3) {
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
                IngresoCompraServicioServices.get_anularDocumento_comprasServicio(obj.id_GuiaCab, auxiliarServices.getUserId())
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

    

    $scope.listaTipoOrden = [];
    $scope.listaTipoOrdenModal = [];

    $scope.listados_tipoOrden = function () {
        $scope.loaderFiltro = true;
        IngresoCompraServicioServices.get_TipoOrden_usuario(auxiliarServices.getUserId()).then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {
                $scope.listaTipoOrden = [];
                $scope.listaTipoOrdenModal = [];
                $scope.listaTipoOrden = res.data;
                $scope.listaTipoOrdenModal = res.data;
                $timeout(function () {
                    $('#cbo_tipoOrden').val('0').trigger('change.select2');
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
    $scope.listados_tipoOrden();

    $scope.lista_anexos = [];
    $scope.lista_anexosModal = [];
    $scope.listados_anexos = function () {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_Anexos_Usuario_modulo(auxiliarServices.getUserId()).then(function (res) {
            $scope.loaderFiltro = false;

            if (res.ok == true) {
                $scope.lista_anexos = [];
                $scope.lista_anexosModal = [];
                $scope.lista_anexos = res.data;
                $scope.lista_anexosModal = res.data;
                $timeout(function () {

                    $scope.Objeto_Parametro_Filtro.idAnexo = '0';
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
    $scope.change_anexo_Almacen_filtro = function (idAnexo) {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_almacenes_anexos_modulo(idAnexo, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    $scope.Lista_Almacen = [];
                    $scope.Lista_Almacen = res.data;
                    setTimeout(function () {
                        $scope.Objeto_Parametro_Filtro.idAlmacen = '0';
                        $('#cbo_almacen').val("0").trigger('change.select2');
                    }, 0);
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderFiltro = false;
                console.log(err);
            });
    };


    $scope.Lista_AlmacenModal = [];
    $scope.change_anexo_AlmacenModal = function (idAnexo, idAlmacen) {
        $scope.loaderSave = true;
        RevisionPedidoServices.get_almacenes_anexos_modulo(idAnexo, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderSave = false;
                if (res.ok == true) {
                    $scope.Lista_AlmacenModal = [];
                    $scope.Lista_AlmacenModal = res.data;

                    $scope.Objeto_Parametro.id_Almacen = String(idAlmacen);
                    setTimeout(function () { 
             /*           $scope.Objeto_Parametro.id_Almacen = String(idAlmacen);*/
                        $('#cbo_almacenModal').val($scope.Objeto_Parametro.id_Almacen ).trigger('change.select2');
                    }, 0);
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderSave = false;
                console.log(err);
            });
    };


    $scope.ListaUnidadMedidas = [];
    $scope.unidadMedidas = function (idAnexo) {
        $scope.loaderFiltro = true;
        IngresoCompraServicioServices.get_unidadMedidaCompraServicio(idAnexo, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    $scope.ListaUnidadMedidas = [];
                    $scope.ListaUnidadMedidas = res.data;
                    //setTimeout(function () {
                    //    $scope.Objeto_Parametro_Filtro.idAlmacen = '0';
                    //    $('#cbo_almacen').val("0").trigger('change.select2');
                    //}, 0);
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderFiltro = false;
                console.log(err);
            });
    };
    $scope.unidadMedidas();

    $scope.changeImagen = function (event) {

        var filesTemporal = event.target.files; //FileList object       
        var fileE = [];
        for (var i = 0; i < event.target.files.length; i++) { //for multiple files          
            fileE.push({
                'file': filesTemporal[i]
            })

        }
        $scope.files = fileE;
        console.log($scope.files)
    };

    $scope.limpiarDetalle = function () {
        $scope.Objeto_Parametro_Detalle = {
            idProducto: '0',
            codigoProducto: '',
            descripcionProducto: '',
            idUnidadMedida: '0',
            cantidad: '',
            precio: '',
            importe: '0',
        }
        $timeout(function () {
            $('#cbo_UM').val("0").trigger('change.select2');
        }, 0);
    }

    $scope.nuevoDet = function () {
        $scope.Flag_modoEdicion_Det = false;
        $scope.disabledEdicion = "";
        $scope.id_GuiaDet_Global = 0;
        $scope.limpiarDetalle();
    }

    $scope.BuscarProducto = function () {

        if ($scope.Objeto_Parametro.id_TipoOrden == '0' || $scope.Objeto_Parametro.id_TipoOrden == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Orden', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.id_anexos == '0' || $scope.Objeto_Parametro.id_anexos == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Anexo', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.id_Almacen == '0' || $scope.Objeto_Parametro.id_Almacen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacén', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_Detalle.codigoProducto === '0' || $scope.Objeto_Parametro_Detalle.codigoProducto === '' || $scope.Objeto_Parametro_Detalle.codigoProducto === null || $scope.Objeto_Parametro_Detalle.codigoProducto === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo del Producto', 'error', '#ff6849', 1500);
            return;
        }

        $scope.Objeto_Parametro_Detalle.idProducto = '0';
        $scope.Objeto_Parametro_Detalle.descripcionProducto = '';
        $scope.Objeto_Parametro_Detalle.idUnidadMedida = '0';
        $scope.Objeto_Parametro_Detalle.cantidad = '';
        $scope.Objeto_Parametro_Detalle.precio = '';
        $scope.Objeto_Parametro_Detalle.importe = '0'; 

        $scope.loaderSave = true;
        IngresoCompraServicioServices.get_buscarProducto_codigo($scope.Objeto_Parametro.id_TipoOrden, $scope.Objeto_Parametro.id_anexos, $scope.Objeto_Parametro.id_Almacen, $scope.Objeto_Parametro_Detalle.codigoProducto, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loaderSave = false;

                if (res.ok == true) {
                    if (res.data.length > 0) {

                        if (res.data.length == 1) {         

                            $scope.Objeto_Parametro_Detalle.idProducto = res.data[0].id_Producto;
                            $scope.Objeto_Parametro_Detalle.descripcionProducto = res.data[0].descripcion_producto;
                            $scope.Objeto_Parametro_Detalle.idUnidadMedida = String(res.data[0].id_unidadMedida);
                            $scope.Objeto_Parametro_Detalle.cantidad = '';
                            $scope.Objeto_Parametro_Detalle.precio = '';
                            $scope.Objeto_Parametro_Detalle.importe = '0';

                            $timeout(function () {
                                $('#cbo_UM').val($scope.Objeto_Parametro_Detalle.idUnidadMedida).trigger('change.select2');
                                $('#txtCantDet').focus().select();
                            }, 0);

                        } else {

                            var regionDetalle_Producto = document.getElementById('regionDetalle_Producto');
                            $('#txt_busquedaProducto').val($scope.Objeto_Parametro_Detalle.codigoProducto);

                            $scope.Lista_Busqueda_Producto = [];
                            regionDetalle_Producto.style.display = 'none';
                            $('#modalAyuda_Producto').modal('show');

                            $scope.Lista_Busqueda_Producto = res.data;

                            $timeout(function () {
                                $('#inputSearch').val('');
                                $scope.search_P = '';
                            }, 0);

                            $timeout(function () {
                                regionDetalle_Producto.style.display = '';

                                if (oTable_Prod == null) {
                                    oTable_Prod = 'data';
                                    auxiliarServices.initFooTable('tbl_busquedaProducto', 'inputSearch');
                                } else {
                                    ///---- limpiando el filtrooo en la ayuda ---
                                    $('#tbl_busquedaProducto').trigger('footable_filter', {
                                        filter: $("#inputSearch").val()
                                    });
                                }
                            }, 500);
                        }
                    } else {
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

    $scope.Open_New_Modal_AyudaProducto = function () {

        var regionDetalle_Producto = document.getElementById('regionDetalle_Producto');
        $('#txt_busquedaProducto').val('');
        $scope.Lista_Busqueda_Producto = [];
        regionDetalle_Producto.style.display = 'none';
        $('#modalAyuda_Producto').modal('show');

        $timeout(function () {
            $('#inputSearch').val('');
            $scope.search_P = '';
        }, 0);

        $timeout(function () {
            regionDetalle_Producto.style.display = 'none';
            $('#txt_busquedaProducto').focus().select();
        }, 800);
    };

    var oTable_Prod;
    $scope.opcionBusqueda = '';

    $scope.Lista_Busqueda_Producto = [];
    $scope.Ayuda_BuscarProducto = function () {

        if ($scope.Objeto_Parametro.id_TipoOrden == '0' || $scope.Objeto_Parametro.id_TipoOrden == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Orden', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.id_anexos == '0' || $scope.Objeto_Parametro.id_anexos == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Anexo', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.id_Almacen == '0' || $scope.Objeto_Parametro.id_Almacen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacén', 'error', '#ff6849', 1500);
            return false;
        }

        const filtroProducto = document.getElementById('txt_busquedaProducto').value;

        if (filtroProducto === '0' || filtroProducto === '' || filtroProducto === null || filtroProducto === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese un dato para Buscar', 'error', '#ff6849', 1500);
            return;
        }

        let regionDetalle_Producto = document.getElementById('regionDetalle_Producto');


        $scope.loader_modal_ayuda = true;
        IngresoCompraServicioServices.get_buscarProducto_Modal($scope.Objeto_Parametro.id_TipoOrden, $scope.Objeto_Parametro.id_anexos, $scope.Objeto_Parametro.id_Almacen, filtroProducto, $scope.id_usuario_Global)
            .then(function (res) {

                $scope.loader_modal_ayuda = false;
                $scope.Lista_Busqueda_Producto = [];

                if (res.ok == true) {
                    if (res.data.length > 0) {

                        $scope.Lista_Busqueda_Producto = res.data;

                        $timeout(function () {
                            $scope.loaderfiltros = false;
                            regionDetalle_Producto.style.display = '';

                            if (oTable_Prod == null) {
                                oTable_Prod = 'data';
                                auxiliarServices.initFooTable('tbl_busquedaProducto', 'inputSearch');
                            } else {
                                ///---- limpiando el filtrooo en la ayuda ---
                                $('#tbl_busquedaProducto').trigger('footable_filter', {
                                    filter: $("#inputSearch").val()
                                });
                            }
                        }, 800);

                        $timeout(function () {
                            $('#txtCantDet').focus().select();
                        }, 0);
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'No se encontro resultado con el dato ingresado, verifique.', 'error', '#ff6849', 3000);
                    }
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Agregar_Producto = function ({ id_Producto, codigo1_Producto, descripcion_producto, id_unidadMedida, descripcion_unidadMedida }) {        
        $scope.Objeto_Parametro_Detalle.idProducto = id_Producto;
        $scope.Objeto_Parametro_Detalle.codigoProducto = codigo1_Producto;
        $scope.Objeto_Parametro_Detalle.descripcionProducto = descripcion_producto;
        $scope.Objeto_Parametro_Detalle.idUnidadMedida = String(id_unidadMedida);
        $scope.Objeto_Parametro_Detalle.cantidad = '';
        $scope.Objeto_Parametro_Detalle.precio = '';
        $scope.Objeto_Parametro_Detalle.importe = '0';

        $('#modalAyuda_Producto').modal('hide');
        $timeout(function () {
            $('#cbo_UM').val($scope.Objeto_Parametro_Detalle.idUnidadMedida).trigger('change.select2');
            $('#txtCantDet').focus().select();
        }, 500);
    };


    $scope.Calculo_Importe = function () {
        var cant = 0;
        var prec = 0;

        if ($scope.Objeto_Parametro_Detalle.cantidad === '' || $scope.Objeto_Parametro_Detalle.cantidad === null || $scope.Objeto_Parametro_Detalle.cantidad === undefined) {
            cant = 0;
        } else {
            cant = $scope.Objeto_Parametro_Detalle.cantidad;
        }

        if ($scope.Objeto_Parametro_Detalle.precio === '' || $scope.Objeto_Parametro_Detalle.precio === null || $scope.Objeto_Parametro_Detalle.precio === undefined) {
            cant = 0;
        } else {
            prec = $scope.Objeto_Parametro_Detalle.precio;
        }

        let totalX = parseFloat(cant) * parseFloat(prec);
        totalX = totalX.toFixed(2);

        return $scope.Objeto_Parametro_Detalle.importe = totalX;

    };


    $scope.guardarActualizar_Det = function () {

        if ($scope.id_GuiaCab_Global == '0' || $scope.id_GuiaCab_Global == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Primero Grabe la cabecera del Documento', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.id_TipoOrden == 1) { //--- la orden de compra es obligatorio ----

            if ($scope.Objeto_Parametro_Detalle.codigoProducto == '' || $scope.Objeto_Parametro_Detalle.codigoProducto == null || $scope.Objeto_Parametro_Detalle.codigoProducto == undefined) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor busque el Producto, por medio del código', 'error', '#ff6849', 1500);
                return false;
            }

            if ($scope.Objeto_Parametro_Detalle.idProducto == '0' || $scope.Objeto_Parametro_Detalle.idProducto == 0) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione Enter o el boton buscar para buscar el producto ', 'error', '#ff6849', 1500);
                return false;
            }


            if ($scope.Objeto_Parametro_Detalle.descripcionProducto == '' || $scope.Objeto_Parametro_Detalle.descripcionProducto == null || $scope.Objeto_Parametro_Detalle.descripcionProducto == undefined) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione Enter o el boton buscar para buscar el producto', 'error', '#ff6849', 1500);
                return false;
            }

        } else {  ///--- la orden de servicio es obligatorio la descrippcion ----
            if ($scope.Objeto_Parametro_Detalle.descripcionProducto == '' || $scope.Objeto_Parametro_Detalle.descripcionProducto == null || $scope.Objeto_Parametro_Detalle.descripcionProducto == undefined) {
                auxiliarServices.NotificationMessage('Sistemas', 'Ingrese o busque el Servicio por favor', 'error', '#ff6849', 1500);
                return false;
            }
        }

        if ($scope.Flag_modoEdicion_Det == false) {
            if ($scope.producto_Ya_agregrado($scope.Objeto_Parametro_Detalle.idProducto)) {
                auxiliarServices.NotificationMessage('Sistemas', 'El Producto o servicio ya se encuentra agregado, verifique..', 'error', '#ff6849', 1500);
                return false;
            }
        }

        if ($scope.Objeto_Parametro_Detalle.cantidad == '' || $scope.Objeto_Parametro_Detalle.cantidad == null) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese una Cantidad ', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_Detalle.cantidad < 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese una Cantidad Positiva', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.precio == '' || $scope.Objeto_Parametro_Detalle.precio == null ) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el precio', 'error', '#ff6849', 3000);
            return false;
        }

        if ($scope.Flag_modoEdicion_Det == false) { // nuevo registroo
            $scope.loaderSave = true;
            IngresoCompraServicioServices.save_ingresosFacturas_detalle($scope.id_GuiaCab_Global, $scope.Objeto_Parametro_Detalle, $scope.Objeto_Parametro.id_TipoOrden, $scope.id_usuario_Global)
                .then(function (res) {

                    $scope.loaderSave = false;
                     if (res.ok == true) {
                         $scope.nuevoDet();
                         $scope.mostrar_guiasDetalle();

                        //$timeout(function () {
                        //    if ($scope.guiasDet.length > 0) {
                        //        $scope.disabledCab = "disabledContent";
                        //    } else {
                        //        $scope.disabledCab = "";
                        //    }
                        //}, 500);

                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }
                }, function (error) {
                    $scope.loaderSave = false;
                    alert(JSON.stringify(error));
                })

        } else {  //actualizar

            $scope.loaderSave = true;
            IngresoCompraServicioServices.update_ingresosFacturas_detalle($scope.id_GuiaDet_Global, $scope.Objeto_Parametro_Detalle, $scope.Objeto_Parametro.id_TipoOrden, $scope.id_usuario_Global)
                .then(function (res) {
                    console.log(res);
                    $scope.loaderSave = false;
                    if (res.ok == true) {
                        $scope.nuevoDet();
                        $scope.mostrar_guiasDetalle();
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }

                }, function (error) {
                    $scope.loaderSave = false;
                    alert(JSON.stringify(error));
                })

        }
    }


    $scope.producto_Ya_agregrado = function (idProducto) {
        const producto = $scope.guiasDet.find((prod) => prod.idProducto == idProducto );
        return (producto) ? true : false;
    }

    $scope.enterFocus = function (type, name) {
        if (type == 1) {
            $('#' + name + '').focus();
            $('#' + name + '').select();

        } else if (type == 2) {
            $('#' + name + '').select2('open');
        }
    };


    $scope.editar_detalleGuia = function ({ id_guiacab, id_GuiaDet, idProducto, codigoProducto, descripcionProducto, idUnidadMedida, descripcionUnidadMedida, cantidad, precio, importe }) {

        $scope.id_GuiaDet_Global = id_GuiaDet;
        $scope.Flag_modoEdicion_Det = true;
        $scope.disabledEdicion = "disabledContent";

        $scope.Objeto_Parametro_Detalle = {
            idProducto,
            codigoProducto,
            descripcionProducto,
            idUnidadMedida: String(idUnidadMedida),
            cantidad,
            precio,
            importe,
        }

        $timeout(function () {
            $('#cbo_UM').val($scope.Objeto_Parametro_Detalle.idUnidadMedida).trigger('change.select2');
            $('#txtCantDet').focus().select();
        }, 0);

    }



     
})
