var app = angular.module('appGestion.CancelacionMasivaDocumentosController', []);
app.controller('CtrlCancelacionMasivaDocumentos', function ($scope, loginServices, $location, $timeout, auxiliarServices, $q, PedidosServices, EstadosServices, LocalesServices,Cliente_IIServices, GrupoDetServices, Documentos_MasivosServices, NotaCreditoDebitoServices ,VehiculoServices, AlmacenServices, TipoDocumentoServices, PersonalServices, PuntoVentaServices, CondicionFacturacionServices) {

    $scope.loaderfiltros = false;
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        auxiliarServices.changeTitle("Cancelación Masiva de Documentos");
        $scope.titleModal = "Generación de Pedidos";
        $scope.get_Listando_Locales();

    };

    $scope.Objeto_ParametroFiltro = {
        id_local: '0',
        id_almacen: '0',
        fecha_ini: auxiliarServices.getDateNow(),
        fecha_ini_aux: '',
        fecha_fin: auxiliarServices.getDateNow(),
        fecha_fin_aux: '',
        id_Vendedor: '0',
        id_estado: '0',
        pagina: 10
    };

    $('document').ready(function () {
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy'
            });
        }, 500);
    });


    $scope.loader_modal = false;
    $scope.disabledProd = "";

    $scope.disabledCabecera = "";
    $scope.disabledDetalle = "disabledContent";

    $scope.disablelocalAlmacen = "";

    $scope.Lista_Local = [];
    $scope.get_Listando_Locales = function () {
        $scope.loaderfiltros = true;
        LocalesServices.get_Locales_Usuario(auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Local = [];
                $scope.Lista_Local = data;
                setTimeout(function () {
                    $(".selectFiltros").select2();
                    $('#cbo_local').val("0").trigger('change.select2');
                }, 500);

                $scope.Listando_Vendedores();
            }, function (err) {
                console.log(err);
            });
    };

    $scope.Lista_Almacen = [];
    $scope.change_Local_Almacen = function (idlocal) {
        $scope.loaderfiltros = true;
        AlmacenServices.get_ListadoAlmacenes_Local_Usuario(idlocal, auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Almacen = [];
                $scope.Lista_Almacen = data;
                setTimeout(function () {
                    $('#cbo_almacen').val("0").trigger('change.select2');
                }, 300);
            }, function (err) {
                console.log(err);
            });
    };

    $scope.Lista_Almacen_pedido = [];
    $scope.change_Local_Almacen_pedido = function (idlocal, id_Almacen) {
        $scope.loader_modal = true;

        AlmacenServices.get_ListadoAlmacenes_Local_Usuario(idlocal, auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loader_modal = false;
                $scope.Lista_Almacen_pedido = [];
                $scope.Lista_Almacen_pedido = data;
                if ($scope.Lista_Almacen_pedido !== null || $scope.Lista_Almacen_pedido !== undefined || $scope.Lista_Almacen_pedido !== '' || $scope.Lista_Almacen_pedido !== []) {
                    $scope.objeto_parametros.id_Almacen = String($scope.Lista_Almacen_pedido[0].id_Almacen);
                    setTimeout(function () {
                        $scope.objeto_parametros.id_Almacen = String(id_Almacen);
                        $('#cbo_almacen_pedido').val(String(id_Almacen)).trigger('change.select2');
                    }, 300);
                } else {
                    setTimeout(function () {
                        $scope.objeto_parametros.id_Almacen = '0';
                        $('#cbo_almacen_pedido').val("0").trigger('change.select2');
                    }, 300);
                }

            }, function (err) {
                console.log(err);
            });
    };

    $scope.Lista_Almacen_pedido = [];
    $scope.change_Local_Almacen_pedido_new = function () {
        $scope.loader_modal = true;
        var e = document.getElementById("cbo_local_pedido");
        var id_LocalPedido = e.options[e.selectedIndex].value;
        AlmacenServices.get_ListadoAlmacenes_Local_Usuario(id_LocalPedido, auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loader_modal = false;
                $scope.Lista_Almacen_pedido = [];
                $scope.Lista_Almacen_pedido = data;

                let almacen = [];
                almacen = $scope.Lista_Almacen_pedido;

                if (almacen.length ==0) {
                    setTimeout(function () {
                        $scope.objeto_parametros.id_Almacen = '0';
                        $('#cbo_almacen_pedido').val("0").trigger('change.select2');
                    }, 300);
                } else {
                    $scope.objeto_parametros.id_Almacen = String($scope.Lista_Almacen_pedido[0].id_Almacen);
                    setTimeout(function () {
                        $scope.objeto_parametros.id_Almacen = String($scope.Lista_Almacen_pedido[0].id_Almacen);
                        $('#cbo_almacen_pedido').val(String($scope.Lista_Almacen_pedido[0].id_Almacen)).trigger('change.select2');
                    }, 300);
                }

            }, function (err) {
                console.log(err);
            });
    };

    $scope.Lista_Vendedor = [];
    $scope.Listando_Vendedores = function () {
        $scope.loaderfiltros = true;
        PersonalServices.getPersonales()
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Vendedor = [];
                $scope.Lista_Vendedor = data;

                $scope.Listando_Punto_Venta();

            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Lista_PuntoVenta = [];
    $scope.Listando_Punto_Venta = function () {
        $scope.loaderfiltros = true;
        PuntoVentaServices.getPuntoVenta(0)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_PuntoVenta = [];
                $scope.Lista_PuntoVenta = data;

                $scope.Listando_CondicionFacturacion();

            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };


    $scope.Lista_CondicionFact = [];
    $scope.Listando_CondicionFacturacion = function () {
        $scope.loaderfiltros = true;
        GrupoDetServices.getGrupoTabla_Det(5)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_CondicionFact = [];
                $scope.Lista_CondicionFact = data;

                $scope.Listando_TipoDocumento();
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };


    $scope.Lista_TipoDoc = [];
    $scope.Listando_TipoDocumento = function () {
        $scope.loaderfiltros = true;
        TipoDocumentoServices.getTipoDocumento(0)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_TipoDoc = [];

                for (var i = 0; i < data.length; i++) {
                    if (data[i].id_TipoDocumento == 1 || data[i].id_TipoDocumento == 2 || data[i].id_TipoDocumento == 3) {
                        console.log(data[i].id_TipoDocumento);
                        $scope.Lista_TipoDoc.push(data[i]);
                    }
                }
                $scope.Listando_Vehiculo();

            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Lista_Vehiculo = [];
    $scope.Listando_Vehiculo = function () {
        $scope.loaderfiltros = true;
        VehiculoServices.getVehiculo(0)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Vehiculo = [];
                $scope.Lista_Vehiculo = data;

                $scope.Listando_Bancos();
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Lista_Bancos = [];
    $scope.Listando_Bancos = function () {
        $scope.loaderfiltros = true;
        GrupoDetServices.getGrupoTabla_Det(6)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Bancos = [];
                $scope.Lista_Bancos = data;
                $scope.Listando_TipoCliente();
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Lista_TipoCliente = [];
    $scope.Listando_TipoCliente = function () {
        $scope.loaderfiltros = true;
        GrupoDetServices.getGrupoTabla_Det(1)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_TipoCliente = [];
                $scope.Lista_TipoCliente = data;

                $scope.Listando_Departamentos();
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };


    $scope.Lista_Distrito = [];
    $scope.change_provincia_distrito = function (id_provincia, distrito) {
        if (id_provincia == 0) {
            $scope.Lista_Distrito = [];
            $scope.objeto_parametros_cliente.id_distrito = '0';

            setTimeout(function () {
                $('#cbo_distrito').val("0").trigger('change.select2');
            }, 500);
        } else {
            $scope.loaderfiltros = true;
            PedidosServices.get_Distrito(id_provincia)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Distrito = [];
                $scope.Lista_Distrito = data;

                if (distrito == 0) {
                    $scope.objeto_parametros_cliente.id_distrito = '0';
                    setTimeout(function () {
                        $('#cbo_distrito').val(0).trigger('change.select2');
                    }, 500);
                } else {
                    $scope.objeto_parametros_cliente.id_distrito = distrito;
                    setTimeout(function () {
                        $('#cbo_distrito').val(distrito).trigger('change.select2');
                    }, 500);
                }

            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            })
        }

    }
       
    $scope.Lista_Estados = [];
    $scope.Listando_Estados = function () {
        $scope.loaderfiltros = true;
        EstadosServices.getEstados()
            .then(function (data) {
                $scope.loaderfiltros = false;
                var listE = [];
                data.forEach(function (item, index) {
                    if (item.tipoProceso_estado === 'P' || item.tipoProceso_estado === 'p' || item.tipoProceso_estado == 'P' || item.tipoProceso_estado == 'p') {
                        listE.push(item);
                    }
                });
                $scope.Lista_Estados = [];
                $scope.Lista_Estados = listE;
                setTimeout(function () {
                    $(".selectModal").select2();
                }, 500);
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Lista_Departamentos = [];
    $scope.Listando_Departamentos = function () {
        $scope.loader = true;
        PedidosServices.get_departamentos()
            .then(function (data) {
                $scope.loader = false;
                for (item of data) {
                    $scope.Lista_Departamentos.push({
                        codigo_detalleTabla: parseInt(item.codigo_detalleTabla),
                        descripcion_grupoTabla: item.descripcion_grupoTabla
                    })
                }

                $scope.Listando_Estados();

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }
       
    $scope.Lista_Provincia = [];
    $scope.change_departamento_provincia = function (id_departamento, id_provincia) {

        console.log(id_departamento + ' : ' + id_provincia);

        if (id_departamento == 0) {
            $scope.Lista_Provincia = [];
            $scope.objeto_parametros_cliente.id_Provincia = '0';

            setTimeout(function () {
                $('#cbo_provincia').val("0").trigger('change.select2');
            }, 500);
        } else {

            $scope.loaderSave = true;
            PedidosServices.get_Provincia(id_departamento)
                .then(function (data) {
                    $scope.loaderSave = false;
                    $scope.Lista_Provincia = [];
                    $scope.Lista_Provincia = data;

                    if (id_provincia == 0) {
                        $scope.objeto_parametros_cliente.id_Provincia = '0';
                        setTimeout(function () {
                            $('#cbo_provincia').val(0).trigger('change.select2');
                        }, 500);
                    } else {
                        $scope.objeto_parametros_cliente.id_Provincia = id_provincia;
                        setTimeout(function () {
                            $('#cbo_provincia').val(id_provincia).trigger('change.select2');
                        }, 500);
                    }

                }, function (err) {
                    $scope.loaderSave = false;
                    console.log(err);
                })


        }
    }

    $scope.Lista_documento = [];
    $scope.Listando_Tipodocumento = function () {
        $scope.loader = true;
        GrupoDetServices.getGrupoTabla_Det(2)
        .then(function (data) {
            $scope.loader = false;
            $scope.Lista_documento = [];
            $scope.Lista_documento = data;
        }, function (err) {
            $scope.loader = false;
            console.log(err);
        })
    }
    $scope.Listando_Tipodocumento();



    $scope.change_TipoDocumento = function () {
        $scope.objeto_parametros_cliente.nroDoc_Cliente = '';
        $scope.objeto_parametros_cliente.nombres_Cliente = '';
    }
    
    $scope.onSearchChange = function () {
        if ($scope.objeto_parametros_cliente.id_DocumentoIdentidad === undefined || $scope.objeto_parametros_cliente.id_DocumentoIdentidad === null || $scope.objeto_parametros_cliente.id_DocumentoIdentidad === '' || $scope.objeto_parametros_cliente.id_DocumentoIdentidad === 0 || $scope.objeto_parametros_cliente.id_DocumentoIdentidad === '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Es necesario seleccionar un tipo de Documento, previamente', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.objeto_parametros_cliente.id_DocumentoIdentidad == 20 || $scope.objeto_parametros_cliente.id_DocumentoIdentidad == '20') {  // dni
            var txt_nrodoc = document.getElementById('txt_nrodoc').value;
            var cbo_provincia = document.getElementById('cbo_provincia');

            let res = '';
            $scope.showLoaderSaveModalFiltro = true;
            Cliente_IIServices.getPersonal_Dni_Data(txt_nrodoc)
                .then(function (data) {
                    $scope.showLoaderSaveModalFiltro = false;
                    res = data.split("|");
                    if (res[0] == '' || res[0] == undefined || res[0] == null) {
                        auxiliarServices.NotificationMessage('Sistemas', 'DNI no encontrado en Padrón Electoral, verifique..', 'error', '#ff6849', 1500);
                        $scope.objeto_parametros_cliente.nombres_Cliente = '';

                    } else {
                        $scope.objeto_parametros_cliente.nombres_Cliente = res[0] + ' ' + res[1] + ' ' + res[2];
                        $timeout(function () {
                            cbo_provincia.focus();
                            $('#cbo_departamento').select2('open');
                        }, 200);
                    }

                }, function (error) {
                    console.log(error);
                });
        }
    };

    
    $scope.enterFocus = function (type, name) {
        if (type === 1) {
            $('#' + name + '').focus();
            $('#' + name + '').select();

        } else if (type === 2) {
            $('#' + name + '').select2('open');
        }
    };

    $scope.list = $scope.Lista_DataCabecera;
    $scope.config = {
        itemsPerPage: 5,
        fillLastPage: true
    };

    //var e = document.getElementById("PageOption");
    //var optionPage = e.options[e.selectedIndex].value;

    //$scope.pageOptionRegistro = optionPage;
    $scope.ChangeOption = function () {
        auxiliarServices.initFooTable('data_cabecera', 'inputSearch');
    };

    var oTable;
    $scope.Lista_DataCabecera = [];
    $scope.Listando_InformacionPedidos = function () {

        if (PedidosServices.validate_filtros($scope.Objeto_ParametroFiltro) === false) {
            return;
        }
        $scope.Objeto_ParametroFiltro.fecha_ini_aux = '';
        $scope.Objeto_ParametroFiltro.fecha_fin_aux = '';

        //$scope.Objeto_ParametroFiltro.fecha_ini_aux = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fecha_ini);
        //$scope.Objeto_ParametroFiltro.fecha_fin_aux = auxiliarServices.changeFormatDate(2, $scope.Objeto_ParametroFiltro.fecha_fin);

        $scope.Objeto_ParametroFiltro.fecha_ini_aux = $scope.Objeto_ParametroFiltro.fecha_ini;
        $scope.Objeto_ParametroFiltro.fecha_fin_aux = $scope.Objeto_ParametroFiltro.fecha_fin;

        $scope.loaderfiltros = true;
        PedidosServices.get_Pedidos_Aprobacion($scope.Objeto_ParametroFiltro)
            .then(function (data) {
                console.log(data);
                $scope.Lista_DataCabecera = [];
                $scope.Lista_DataCabecera = data;
                $timeout(function () {
                    $scope.loaderfiltros = false;
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('data_cabecera', 'inputSearch');
                    } else {
                        $('#data_cabecera').trigger('footable_initialize');
                    }
                }, 1000);
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Flag_modoEdicion = false;
    $scope.objeto_parametros = {
        id_Pedido_Cab: '0',
        id_empresa: '0',
        id_Local: '0',
        Numero_Pedido: '',
        codigoInterno_Suministro: '',
        nrodoc_cliente: '',
        nombres_Cliente: '',
        id_Almacen: '0',
        id_TipoDocumento: '0',
        id_PuntoVenta: '0',
        id_cuadrilla: '1',
        id_PersonalVendedor: '0',
        id_FormaPago: '0',
        id_moneda: '1',
        fechaEmision_Pedido_Cab: '',
        tipoCambio_Pedido_Cab: '',
        codigoInterno_Cliente: '',
        direccion_Pedido_Cab: '',
        fechaEntrega_Pedido_Cab: '',
        porcentajeIGV_Pedido_Cab: '',
        imprimeGuiaRemision_Pedido_Cab: '',
        observaciones_Pedido_Cab: '',
        estado: '6',
        Sub_Total_Pedido_Cab: '',
        total_Igv_Pedido_Cab: '',
        total_Neto_Pedido_Cab: '',
        Numero_Documento: '',
        serie: '',
        num_doc: '',
        fechaFactura_Pedido_Cab: '',
        usuario_creacion: '0',
        TipoGuiaRemision: '0'
    };
    $scope.clean = function () {
        $scope.objeto_parametros.id_Pedido_Cab = '0';
        $scope.objeto_parametros.id_empresa = '1';
        $scope.objeto_parametros.id_Local = '0';
        $scope.objeto_parametros.Numero_Pedido = '';
        $scope.objeto_parametros.codigoInterno_Suministro = '';
        $scope.objeto_parametros.nrodoc_cliente = '';
        $scope.objeto_parametros.nombres_Cliente = '';
        $scope.objeto_parametros.id_Almacen = '0';
        $scope.objeto_parametros.id_TipoDocumento = '0';
        $scope.objeto_parametros.id_PuntoVenta = '0';
        $scope.objeto_parametros.id_cuadrilla = '1';
        $scope.objeto_parametros.id_PersonalVendedor = '0';
        $scope.objeto_parametros.id_FormaPago = '0';
        $scope.objeto_parametros.id_moneda = '1';
        $scope.objeto_parametros.fechaEmision_Pedido_Cab = '';

        $scope.objeto_parametros.tipoCambio_Pedido_Cab = '0';
        $scope.objeto_parametros.codigoInterno_Cliente = '';
        $scope.objeto_parametros.direccion_Pedido_Cab = '';
        $scope.objeto_parametros.fechaEntrega_Pedido_Cab = '';

        $scope.objeto_parametros.porcentajeIGV_Pedido_Cab = '18';
        $scope.objeto_parametros.imprimeGuiaRemision_Pedido_Cab = '';
        $scope.objeto_parametros.observaciones_Pedido_Cab = '';
        $scope.objeto_parametros.estado = '6';
        $scope.objeto_parametros.Sub_Total_Pedido_Cab = '0';
        $scope.objeto_parametros.total_Igv_Pedido_Cab = '0';
        $scope.objeto_parametros.total_Neto_Pedido_Cab = '0';
        $scope.objeto_parametros.Numero_Documento = '';

        $scope.objeto_parametros.serie = '';
        $scope.objeto_parametros.num_doc = '';
        $scope.objeto_parametros.fechaFactura_Pedido_Cab = '';
        $scope.objeto_parametros.TipoGuiaRemision = '0';

        $scope.Lista_Almacen_pedido = [];
        $scope.objeto_parametros.usuario_creacion = auxiliarServices.getUserId();
        $timeout(function () {

            $('#cbo_local_pedido').val("0").trigger('change.select2');
            $('#cbo_almacen_pedido').val("0").trigger('change.select2');

            $('#cbo_vendedor').val("0").trigger('change.select2');
            $('#cbo_puntoVenta').val("0").trigger('change.select2');
            $('#cbo_cond_facturacion').val("0").trigger('change.select2');
            $('#cbo_TipoDoc').val("0").trigger('change.select2');
            $('#cbo_vehiculo').val("0").trigger('change.select2');
        }, 200);
    };

    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.clean_detail();
        $scope.Lista_DataDetalle = [];
        $scope.Flag_modoEdicion = false;
        $scope.Flag_modoEdicion_detalle = false;
        $scope.disabledCabecera = "";
        $scope.disablelocalAlmacen = "";
        $scope.disabledDetalle = "disabledContent";
        $scope.CalculoTotales_General();

        $('#btnGuardarCab').attr("disabled", false);
        $('#btn_generaCancelacion').attr("disabled", false);

        $('#modalMantenimiento').modal('show');
        $timeout(function () {
            $('#txt_cod_cliente').focus().select();
        }, 1000);
        $scope.tituloProceso = 'Generar Cancelacion';
        $("#cbo_TipoDoc").prop('disabled', false);
        $("#txt_serie").prop('disabled', true);
        $("#txt_num_doc").prop('disabled', true);

    };

    $scope.nuevaGuia = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $scope.disabledCabecera = "";
        $scope.disablelocalAlmacen = "";
        $scope.disabledDetalle = "disabledContent";
        $scope.Lista_DataDetalle = [];
        $scope.clean_detail();
        $scope.Flag_modoEdicion_detalle = false;
        $scope.disabledProd = "";
        $scope.CalculoTotales_General();

        var chk_transporrte_new = document.getElementById('chk_transporrte');
        chk_transporrte_new.checked = false;
        $scope.tituloProceso = 'Generar Cancelacion';
    };

    $scope.Buscar_Cliente = function () {
        $scope.objeto_parametros.codigoInterno_Suministro = '';
        $scope.objeto_parametros.nombres_Cliente = '';
        $scope.objeto_parametros.codigoInterno_Cliente = '';
        $scope.objeto_parametros.direccion_Pedido_Cab = '';
        if ($scope.objeto_parametros.nrodoc_cliente === '' || $scope.objeto_parametros.nrodoc_cliente === null || $scope.objeto_parametros.nrodoc_cliente === undefined) {
            return;
        }

        $scope.loader_modal = true;
        PedidosServices.get_Search_Cliente($scope.objeto_parametros.nrodoc_cliente)
            .then(function (data) {
                $scope.loader_modal = false;
                var indicador = false;
                for (var i = 0; i < data.length; i++) {
                    indicador = true;
                    break;
                }
                if (indicador === false) {
                    $timeout(function () {
                        $scope.objeto_parametros.id_PersonalVendedor = '0';
                        $('#cbo_vendedor').val('0').trigger('change.select2');
                    }, 200);
                    return;
                } else {
                    $scope.objeto_parametros.codigoInterno_Suministro = data[0].codigoInterno_Cliente;
                    $scope.objeto_parametros.nombres_Cliente = data[0].nombres_Cliente + '  -  ' + data[0].direccion_referencia;
                    $scope.objeto_parametros.codigoInterno_Cliente = data[0].codigoInterno_Cliente;
                    $scope.objeto_parametros.direccion_Pedido_Cab = data[0].direccion_referencia;
                    $scope.objeto_parametros.id_PersonalVendedor = String(data[0].id_PersonalVendedor);
                    $timeout(function () {
                        $('#cbo_vendedor').val(String(data[0].id_PersonalVendedor)).trigger('change.select2');
                    }, 200);
                }
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };
    var objAux;
    function getCodUniq() {
        // CAPTURANDO FECHA ACTUAL
        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1;
        var yyyy = hoy.getFullYear();
        var hour = hoy.getHours();
        var minuts = hoy.getMinutes();
        var second = hoy.getSeconds();
        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }
        hoy = yyyy + '' + mm + '' + dd + '' + hour + '' + minuts + '' + second;
        // GENERANDO CODIGO ALEATORIO
        var codigoAle = Math.floor(Math.random() * 1000000);
        // CODIGO DEL USUARIO LOGEADO
        var dataUser = auxiliarServices.getUserId();
        return dataUser + '_' + codigoAle + '_' + hoy;
    }

    $scope.Guardar_Pedido_Cab = function () {

        if (PedidosServices.validate_Cabecera($scope.objeto_parametros) === false) {
            return;
        }
        var fechaOrigen = $scope.objeto_parametros.fechaEmision_Pedido_Cab;
        $scope.objeto_parametros.fechaEmision_Pedido_Cab = auxiliarServices.changeFormatDate(2, fechaOrigen);
        $scope.objeto_parametros.fechaEntrega_Pedido_Cab = auxiliarServices.changeFormatDate(2, fechaOrigen);
        $scope.objeto_parametros.fechaFactura_Pedido_Cab = auxiliarServices.changeFormatDate(2, fechaOrigen);

        $scope.objeto_parametros.Numero_Documento = $scope.objeto_parametros.serie + '-' + $scope.objeto_parametros.num_doc;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo

            $scope.objeto_parametros.Numero_Pedido = getCodUniq();

            if ($scope.objeto_parametros.id_TipoDocumento == "3") {
                var chk_transporrte = document.getElementById('chk_transporrte');

                if (chk_transporrte.checked == true) {
                    $scope.objeto_parametros.TipoGuiaRemision = '1';

                } else {
                    $scope.objeto_parametros.TipoGuiaRemision = '0';
                }

                $scope.objeto_parametros.serie = auxiliarServices.Formatear_CerosIzquierda(parseInt($scope.objeto_parametros.serie), 4);
                $scope.objeto_parametros.num_doc = auxiliarServices.Formatear_CerosIzquierda(parseInt($scope.objeto_parametros.num_doc), 7);
                $scope.objeto_parametros.Numero_Documento = $scope.objeto_parametros.serie + '-' + $scope.objeto_parametros.num_doc;

                let generandoDocumento = async () => {
                    let res = await PedidosServices.validar_NroDocumento_Pedido($scope.objeto_parametros.Numero_Documento, $scope.objeto_parametros.id_TipoDocumento)

                    if (res !== 0) {
                        auxiliarServices.NotificationMessage('Sistemas', 'El nro de Documento ya se encuentra registrado en el sistema, verifique', 'error', '#ff6849', 1500);
                        return;
                    } else {
                        $scope.loader_modal = true;
                        $('#btnGuardarCab').attr("disabled", true);

                        let res_save = await PedidosServices.save_Pedido($scope.objeto_parametros);

                        $scope.disabledDetalle = "";
                        $scope.Lista_DataCabecera.push(res_save);
                        $scope.objeto_parametros.id_Pedido_Cab = res_save.id_Pedido_Cab;

                        $("#cbo_TipoDoc").prop('disabled', true);

                        $scope.objeto_parametros.fechaEmision_Pedido_Cab = fechaOrigen;
                        $scope.Flag_modoEdicion = true;
                        objAux = res_save;
                        $timeout(function () {
                            $('#btnGuardarCab').attr("disabled", false);
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Proceso de Registro realizado correctamente !'
                            };
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });
                            $scope.loader_modal = false;
                        }, 500);
                    }
                }

                ///----ejecutando proceso---
                generandoDocumento()
                    .catch((error) => {
                        alert(error);
                    })
            }
            else {
                ////-----guardando el pedido----
                $scope.loader_modal = true;
                $('#btnGuardarCab').attr("disabled", true);
                PedidosServices.save_Pedido($scope.objeto_parametros)
                    .then(function (data) {
                        $scope.disabledDetalle = "";
                        $scope.Lista_DataCabecera.push(data);
                        $scope.objeto_parametros.id_Pedido_Cab = data.id_Pedido_Cab;

                        $("#cbo_TipoDoc").prop('disabled', true);

                        $scope.objeto_parametros.fechaEmision_Pedido_Cab = fechaOrigen;
                        $scope.Flag_modoEdicion = true;
                        objAux = data;
                        $timeout(function () {
                            $('#btnGuardarCab').attr("disabled", false);
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Proceso de Registro realizado correctamente !'
                            };
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });
                            $scope.loader_modal = false;
                        }, 500);
                    }, function (error) {
                        $timeout(function () {
                            let paramsErr = {
                                type: 'error',
                                title: 'Error !',
                                text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                            };
                            auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                            });
                            $scope.loader_modal = false;
                            console.log(err);
                        }, 500);
                    });
            }
        } else {  //actualizar
            $scope.loader_modal = true;
            $scope.objeto_parametros.Numero_Documento = $scope.objeto_parametros.serie + '-' + $scope.objeto_parametros.num_doc;

            PedidosServices.update_Pedido($scope.objeto_parametros)
                .then(function (data) {
                    $scope.loader_modal = false;
                    if (data == "OK") {
                        var indexList = $scope.Lista_DataCabecera.indexOf(objAux);

                        $scope.Lista_DataCabecera[indexList].codigo_cliente = $scope.objeto_parametros.id_empresa;
                        $scope.Lista_DataCabecera[indexList].id_Local = $scope.objeto_parametros.id_Local;
                        $scope.Lista_DataCabecera[indexList].Numero_Pedido = $scope.objeto_parametros.Numero_Pedido;
                        $scope.Lista_DataCabecera[indexList].codigoInterno_Suministro = $scope.objeto_parametros.codigoInterno_Suministro;
                        $scope.Lista_DataCabecera[indexList].nroDoc_Cliente = $scope.objeto_parametros.nrodoc_cliente;
                        $scope.Lista_DataCabecera[indexList].nombres_Cliente = $scope.objeto_parametros.nombres_Cliente;
                        $scope.Lista_DataCabecera[indexList].id_Almacen = $scope.objeto_parametros.id_Almacen;
                        $scope.Lista_DataCabecera[indexList].id_TipoDocumento = $scope.objeto_parametros.id_TipoDocumento;
                        $scope.Lista_DataCabecera[indexList].id_PuntoVenta = $scope.objeto_parametros.id_PuntoVenta;
                        $scope.Lista_DataCabecera[indexList].id_cuadrilla = $scope.objeto_parametros.id_cuadrilla;
                        $scope.Lista_DataCabecera[indexList].id_PersonalVendedor = $scope.objeto_parametros.id_PersonalVendedor;
                        $scope.Lista_DataCabecera[indexList].id_FormaPago = $scope.objeto_parametros.id_FormaPago;
                        $scope.Lista_DataCabecera[indexList].id_moneda = $scope.objeto_parametros.id_moneda;
                        $scope.Lista_DataCabecera[indexList].fechaEmision_Pedido_Cab = $scope.objeto_parametros.fechaEmision_Pedido_Cab;

                        $scope.Lista_DataCabecera[indexList].tipoCambio_Pedido_Cab = $scope.objeto_parametros.tipoCambio_Pedido_Cab;
                        $scope.Lista_DataCabecera[indexList].codigoInterno_Cliente = $scope.objeto_parametros.codigoInterno_Cliente;
                        $scope.Lista_DataCabecera[indexList].direccion_Pedido_Cab = $scope.objeto_parametros.direccion_Pedido_Cab;
                        $scope.Lista_DataCabecera[indexList].fechaEntrega_Pedido_Cab = $scope.objeto_parametros.fechaEntrega_Pedido_Cab;

                        $scope.Lista_DataCabecera[indexList].porcentajeIGV_Pedido_Cab = $scope.objeto_parametros.porcentajeIGV_Pedido_Cab;
                        $scope.Lista_DataCabecera[indexList].imprimeGuiaRemision_Pedido_Cab = $scope.objeto_parametros.imprimeGuiaRemision_Pedido_Cab;
                        $scope.Lista_DataCabecera[indexList].observaciones_Pedido_Cab = $scope.objeto_parametros.observaciones_Pedido_Cab;
                        $scope.Lista_DataCabecera[indexList].estado = $scope.objeto_parametros.estado;
                        $scope.Lista_DataCabecera[indexList].Sub_Total_Pedido_Cab = $scope.objeto_parametros.Sub_Total_Pedido_Cab;
                        $scope.Lista_DataCabecera[indexList].total_Igv_Pedido_Cab = $scope.objeto_parametros.total_Igv_Pedido_Cab;
                        $scope.Lista_DataCabecera[indexList].total_Neto_Pedido_Cab = $scope.objeto_parametros.total_Neto_Pedido_Cab;
                        $scope.Lista_DataCabecera[indexList].Numero_Documento = $scope.objeto_parametros.Numero_Documento;
                        $scope.Lista_DataCabecera[indexList].fechaFactura_Pedido_Cab = $scope.objeto_parametros.fechaFactura_Pedido_Cab;


                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Actualizacion realizado correctamente !'
                            };
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });

                        }, 500);
                    } else {
                        $timeout(function () {
                            let paramsErr = {
                                type: 'error',
                                title: 'Error !',
                                text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                            };
                            auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                            });

                            console.log(err);
                        }, 500);
                    }
                }, function (error) {
                    console.log(error);
                });
        }
    };

    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;

        $scope.Lista_DataDetalle = [];
        $scope.clean_detail();
        $scope.Flag_modoEdicion_detalle = false;
        $scope.disabledProd = "";
        $('#modalMantenimiento').modal('show');
        $("#cbo_TipoDoc").prop('disabled', true);

        $("#txt_serie").prop('disabled', false);
        $("#txt_num_doc").prop('disabled', false);

        $scope.EdicionRegistros(obj);
    };


    $scope.EdicionRegistros = function (obj) {
        objAux = '';
        objAux = obj;

        if (obj.estado === 6) {
            $scope.disabledCabecera = "";
            $scope.disabledDetalle = "";
        } else {
            $scope.disabledCabecera = "disabledContent";
            $scope.disabledDetalle = "disabledContent";
        }

        $scope.objeto_parametros.id_Pedido_Cab = obj.id_Pedido_Cab;
        $scope.objeto_parametros.id_empresa = obj.id_empresa;
        $scope.objeto_parametros.id_Local = obj.id_Local;
        //---listando Almacenes por Local

        $scope.objeto_parametros.Numero_Pedido = obj.Numero_Pedido;
        $scope.objeto_parametros.codigoInterno_Suministro = obj.codigoInterno_Suministro;
        $scope.objeto_parametros.nrodoc_cliente = obj.nroDoc_Cliente;
        $scope.objeto_parametros.nombres_Cliente = obj.nombres_Cliente;
        $scope.objeto_parametros.id_Almacen = obj.id_Almacen;
        $scope.objeto_parametros.id_TipoDocumento = obj.id_TipoDocumento;
        $scope.objeto_parametros.id_PuntoVenta = obj.id_PuntoVenta;
        $scope.objeto_parametros.id_cuadrilla = obj.id_cuadrilla;
        $scope.objeto_parametros.id_PersonalVendedor = obj.id_PersonalVendedor;
        $scope.objeto_parametros.id_FormaPago = obj.id_FormaPago;
        $scope.objeto_parametros.id_moneda = obj.id_moneda;
        $scope.objeto_parametros.fechaEmision_Pedido_Cab = obj.fechaEmision_Pedido_Cab;

        $scope.objeto_parametros.tipoCambio_Pedido_Cab = obj.tipoCambio_Pedido_Cab;
        $scope.objeto_parametros.codigoInterno_Cliente = obj.codigoInterno_Cliente;
        $scope.objeto_parametros.direccion_Pedido_Cab = obj.direccion_Pedido_Cab;
        $scope.objeto_parametros.fechaEntrega_Pedido_Cab = obj.fechaEntrega_Pedido_Cab;

        $scope.objeto_parametros.porcentajeIGV_Pedido_Cab = obj.porcentajeIGV_Pedido_Cab;
        $scope.objeto_parametros.imprimeGuiaRemision_Pedido_Cab = obj.imprimeGuiaRemision_Pedido_Cab;
        $scope.objeto_parametros.observaciones_Pedido_Cab = obj.observaciones_Pedido_Cab;
        $scope.objeto_parametros.estado = obj.estado;
        $scope.objeto_parametros.Sub_Total_Pedido_Cab = obj.Sub_Total_Pedido_Cab;
        $scope.objeto_parametros.total_Igv_Pedido_Cab = obj.total_Igv_Pedido_Cab;
        $scope.objeto_parametros.total_Neto_Pedido_Cab = obj.total_Neto_Pedido_Cab;

        if (obj.Numero_Documento === undefined || obj.Numero_Documento === '' || obj.Numero_Documento === null) {
            $scope.objeto_parametros.Numero_Documento = '';
            $scope.objeto_parametros.serie = '';
            $scope.objeto_parametros.num_doc = '';
        } else {
            var Obj_NumDocumento = obj.Numero_Documento.split("-");
            $scope.objeto_parametros.serie = Obj_NumDocumento[0];
            $scope.objeto_parametros.num_doc = Obj_NumDocumento[1];
            $scope.objeto_parametros.Numero_Documento = obj.Numero_Documento;
        }

        $scope.objeto_parametros.fechaFactura_Pedido_Cab = obj.fechaFactura_Pedido_Cab;
        $scope.objeto_parametros.TipoGuiaRemision = obj.TipoGuiaRemision;

        var chk_transporrte = document.getElementById('chk_transporrte');
        $timeout(function () {
            $('#cbo_local_pedido').val(obj.id_Local).trigger('change.select2');

            $scope.change_Local_Almacen_pedido(obj.id_Local, obj.id_Almacen);

            $('#cbo_vendedor').val(obj.id_PersonalVendedor).trigger('change.select2');
            $('#cbo_puntoVenta').val(obj.id_PuntoVenta).trigger('change.select2');
            $('#cbo_cond_facturacion').val(obj.id_FormaPago).trigger('change.select2');
            $('#cbo_TipoDoc').val(obj.id_TipoDocumento).trigger('change.select2');
            $('#cbo_vehiculo').val("0").trigger('change.select2');
            $('#cbo_almacen_pedido').val(obj.id_Almacen).trigger('change.select2');
            $('#txt_cod_cliente').focus().select();

            if (obj.TipoGuiaRemision === "1") {
                chk_transporrte.checked = true;
            } else {
                chk_transporrte.checked = false;
            }

        }, 1500);

        //--relacion de los detalles del Producto
        $scope.Listando_InformacionPedidos_detalle();
    };

    $scope.objeto_parametros_detalle = {
        id_Pedido_Det: '0',
        id_Pedido_Cab: '0',
        item_Pedido_Det: '1',
        id_Producto: '0',
        codigo1_Producto: '',
        nombre_Producto: '',
        precioVenta_Pedido_Det: '',
        porcentajeDescuento_Pedido_Det: '0',
        Descuento_Pedido_Det: '0',
        cantidad_Pedido_Det: '',
        porcentajeIGV_Pedido_Det: '0',
        total_Pedido_Det: '',
        Numero_Pedido: '',
        stock: '0'
    };



    $scope.clean_detail = function () {
        $scope.objeto_parametros_detalle.id_Pedido_Det = '0';
        $scope.objeto_parametros_detalle.id_Pedido_Cab = $scope.objeto_parametros.id_Pedido_Cab;
        $scope.objeto_parametros_detalle.item_Pedido_Det = '1';
        $scope.objeto_parametros_detalle.id_Producto = '0';
        $scope.objeto_parametros_detalle.codigo1_Producto = '';
        $scope.objeto_parametros_detalle.nombre_Producto = '';
        $scope.objeto_parametros_detalle.precioVenta_Pedido_Det = '';
        $scope.objeto_parametros_detalle.porcentajeDescuento_Pedido_Det = '0';
        $scope.objeto_parametros_detalle.Descuento_Pedido_Det = '0';
        $scope.objeto_parametros_detalle.cantidad_Pedido_Det = '';
        $scope.objeto_parametros_detalle.porcentajeIGV_Pedido_Det = '0';
        $scope.objeto_parametros_detalle.total_Pedido_Det = '';
        $scope.objeto_parametros_detalle.Numero_Pedido = $scope.objeto_parametros.Numero_Pedido;
        $scope.objeto_parametros_detalle.stock = '0';

    };

    $scope.Flag_modoEdicion_detalle = false;

    $scope.nuevaGuia_det = function () {
        $scope.clean_detail();
        $scope.Flag_modoEdicion_detalle = false;
        $scope.disabledProd = "";
        $timeout(function () {
            $('#txt_cod_producto').focus().select();
        });
    };

    $scope.Buscar_Producto = function () {

        $scope.objeto_parametros_detalle.id_Producto = '0';
        $scope.objeto_parametros_detalle.nombre_Producto = '';
        $scope.objeto_parametros_detalle.precioVenta_Pedido_Det = '';
        $scope.objeto_parametros_detalle.stock = '';

        $scope.Calculo_Importe();

        if ($scope.objeto_parametros.id_Local === '0' || $scope.objeto_parametros.id_Local === '' || $scope.objeto_parametros.id_Local === null || $scope.objeto_parametros.id_Local === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Local', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros.id_Almacen === '0' || $scope.objeto_parametros.id_Almacen === '' || $scope.objeto_parametros.id_Almacen === null || $scope.objeto_parametros.id_Almacen === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacen', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.objeto_parametros_detalle.codigo1_Producto === '' || $scope.objeto_parametros_detalle.codigo1_Producto === null || $scope.objeto_parametros_detalle.codigo1_Producto === undefined) {
            return;
        }

        var e = document.getElementById("cbo_local_pedido");
        var id_LocalPedido = e.options[e.selectedIndex].value;

        var d = document.getElementById("cbo_almacen_pedido");
        var id_AlmacenPedido = d.options[d.selectedIndex].value;

        $scope.loader_modal = true;
        PedidosServices.get_Search_Producto(id_LocalPedido, id_AlmacenPedido, $scope.objeto_parametros_detalle.codigo1_Producto)
            .then(function (data) {
                $scope.loader_modal = false;
                var indicador = false;
                for (var i = 0; i < data.length; i++) {
                    indicador = true;
                    break;
                }

                if (indicador === false) {
                    auxiliarServices.NotificationMessage('Sistemas', 'No hay Stock o Codigo Incorrecto, verifique..', 'error', '#ff6849', 1500);
                    return;
                }

                $scope.objeto_parametros_detalle.id_Producto = data[0].id_producto;
                $scope.objeto_parametros_detalle.nombre_Producto = data[0].descripcion_producto + ' - ' + data[0].unidadMedida + ' - ' + data[0].nombre_marcaproducto;
                $scope.objeto_parametros_detalle.precioVenta_Pedido_Det = data[0].precioventa_listaprecios;
                $scope.objeto_parametros_detalle.stock = data[0].Stock;

                $scope.Calculo_Importe();

                $timeout(function () {
                    $('#txt_cantidad').focus().select();
                });

            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Calculo_Importe = function () {
        var cant = 0;
        var prec = 0;

        if ($scope.objeto_parametros_detalle.cantidad_Pedido_Det === '' || $scope.objeto_parametros_detalle.cantidad_Pedido_Det === null || $scope.objeto_parametros_detalle.cantidad_Pedido_Det === undefined) {
            cant = 0;
        } else {
            cant = $scope.objeto_parametros_detalle.cantidad_Pedido_Det;
        }

        if ($scope.objeto_parametros_detalle.precioVenta_Pedido_Det === '' || $scope.objeto_parametros_detalle.precioVenta_Pedido_Det === null || $scope.objeto_parametros_detalle.precioVenta_Pedido_Det === undefined) {
            cant = 0;
        } else {
            prec = $scope.objeto_parametros_detalle.precioVenta_Pedido_Det;
        }
        return $scope.objeto_parametros_detalle.total_Pedido_Det = parseFloat(cant) * parseFloat(prec);

    };

    $scope.Guardar_Pedido_Det = function () {

        $scope.objeto_parametros_detalle.id_Pedido_Cab = $scope.objeto_parametros.id_Pedido_Cab;
        $scope.objeto_parametros_detalle.Numero_Pedido = $scope.objeto_parametros.Numero_Pedido;

        if (PedidosServices.validate_detalle($scope.objeto_parametros_detalle) == false) {
            return;
        }
        if (parseFloat($scope.objeto_parametros_detalle.stock) <= 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Este producto no tiene stock', 'error', '#ff6849', 2000);
            return;
        }
        if (parseFloat($scope.objeto_parametros_detalle.cantidad_Pedido_Det) > parseFloat($scope.objeto_parametros_detalle.stock)) {
            auxiliarServices.NotificationMessage('Sistemas', 'La cantidad supera el Stock disponible, verifique', 'error', '#ff6849', 2000);
            return;
        }
        if ($scope.Flag_modoEdicion_detalle === false) { // nuevo registroo detalle

            //--Validando
            if (Existencia_Producto($scope.objeto_parametros_detalle.id_Producto) == true) {
                $timeout(function () {
                    $('#txt_cod_producto').focus().select();
                });
                return;
            }

            $scope.loader_modal = true;
            $('#btnGuardarDet').attr("disabled", true);
            PedidosServices.save_Pedido_Detalle($scope.objeto_parametros_detalle)
                .then(function (data) {
                    $scope.Listando_InformacionPedidos_detalle();
                    $('#btnGuardarDet').attr("disabled", false);
                    $scope.loader_modal = false;

                    //---limpiando--
                    $scope.nuevaGuia_det();
                }, function (error) {
                    $('#btnGuardarDet').attr("disabled", false);
                    $timeout(function () {
                        let paramsErr = {
                            type: 'error',
                            title: 'Error !',
                            text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                        };
                        auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                        });
                        $scope.loader_modal = false;
                        console.log(err);
                    }, 500);
                });

        } else {  //actualizar detalle

            $scope.loader_modal = true;
            $('#btnGuardarDet').attr("disabled", true);
            PedidosServices.update_Pedido_Detalle($scope.objeto_parametros_detalle)
                .then(function (data) {
                    $scope.loader_modal = false;
                    if (data === "OK") {
                        $scope.Listando_InformacionPedidos_detalle();
                        $('#btnGuardarDet').attr("disabled", false);
                        //---limpiando--
                        $scope.nuevaGuia_det();
                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Actualizacion realizado correctamente !'
                            };
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });

                        }, 500);
                    } else {
                        $('#btnGuardarDet').attr("disabled", false);
                        $timeout(function () {
                            let paramsErr = {
                                type: 'error',
                                title: 'Error !',
                                text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                            };
                            auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                            });

                            console.log(err);
                        }, 500);
                    }
                }, function (error) {
                    $('#btnGuardarDet').attr("disabled", false);
                    console.log(error);
                });

        }
    };

    function Existencia_Producto(id_producto) {
        var result = false;
        $scope.Lista_DataDetalle.forEach(function (item, index) {
            if (item.id_Producto === id_producto) {
                auxiliarServices.NotificationMessage('Sistemas', 'El Producto ya se encuentra registrado, verifique.!', 'error', '#ff6849', 2000);
                result = true;
            }
        });
        return result;
    }

    $scope.Lista_DataDetalle = [];
    $scope.Listando_InformacionPedidos_detalle = function () {
        $scope.loader_modal = true;
        PedidosServices.get_Pedidos_detalle($scope.objeto_parametros.Numero_Pedido)
            .then(function (data) {
                $scope.loader_modal = false;
                $scope.Lista_DataDetalle = [];
                $scope.Lista_DataDetalle = data;
                $scope.CalculoTotales_General();
                var indicador = false;
                for (var i = 0; i < $scope.Lista_DataDetalle.length; i++) {
                    indicador = true;
                    break;
                }

                if (indicador === false) {
                    $scope.disablelocalAlmacen = "";
                } else {
                    $scope.disablelocalAlmacen = "disabledContent";
                }
            }, function (err) {
                $scope.loader_modal = false;
                console.log(err);
                $scope.CalculoTotales_General();
            });
    };

    $scope.EliminarPedido_detalle = function (index, obj_detalle) {
        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Eliminar el Registro.',
            type: 'confirmationAlert'
        };
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res === true) {
                PedidosServices.set_Delete_Pedido_Detalle(obj_detalle.id_Pedido_Det, obj_detalle.Numero_Pedido)
                    .then(function (data) {
                        //----limpiando--
                        $scope.nuevaGuia_det();
                        if (data === "OK") {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'El Registro se Elimino correctamente !'
                            };
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });
                            $scope.Lista_DataDetalle.splice(index, 1);
                            $scope.CalculoTotales_General();
                            var indicador = false;
                            for (var i = 0; i < $scope.Lista_DataDetalle.length; i++) {
                                indicador = true;
                                break;
                            }

                            if (indicador === false) {
                                $scope.disablelocalAlmacen = "";
                            } else {
                                $scope.disablelocalAlmacen = "disabledContent";
                            }

                        } else {
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(data);
                        }
                    }, function (err) {
                        console.log(err);
                    });
            }
        });

    };

    $scope.Buscar_Producto_Edicion = function (obj_detalle) {
        //---limpiando--
        $scope.clean_detail();
        $scope.Flag_modoEdicion_detalle = true;
        $scope.disabledProd = "disabledContent";

        $scope.objeto_parametros_detalle.id_Pedido_Det = obj_detalle.id_Pedido_Det;
        $scope.objeto_parametros_detalle.id_Producto = obj_detalle.id_Producto;
        $scope.objeto_parametros_detalle.codigo1_Producto = obj_detalle.codigo1_Producto;
        $scope.objeto_parametros_detalle.nombre_Producto = obj_detalle.nombre_Producto + ' - ' + obj_detalle.nombre_UnidadMedida;
        $scope.objeto_parametros_detalle.cantidad_Pedido_Det = obj_detalle.cantidad_Pedido_Det;
        $scope.objeto_parametros_detalle.precioVenta_Pedido_Det = obj_detalle.precioVenta_Pedido_Det;

        $scope.Calculo_Importe();

        if ($scope.objeto_parametros.id_Local === '0' || $scope.objeto_parametros.id_Local === '' || $scope.objeto_parametros.id_Local === null || $scope.objeto_parametros.id_Local === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Local', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.objeto_parametros.id_Almacen === '0' || $scope.objeto_parametros.id_Almacen === '' || $scope.objeto_parametros.id_Almacen === null || $scope.objeto_parametros.id_Almacen === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacen', 'error', '#ff6849', 1500);
            return;
        }

        if (obj_detalle.codigo1_Producto === '' || obj_detalle.codigo1_Producto === null || obj_detalle.codigo1_Producto === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos no se cargo la informacion del Producto, Actualice la pagina y continue..', 'error', '#ff6849', 1500);
            return;
        }

        $scope.loader_modal = true;
        PedidosServices.get_Search_Producto($scope.objeto_parametros.id_Local, $scope.objeto_parametros.id_Almacen, obj_detalle.codigo1_Producto)
            .then(function (data) {
                $scope.loader_modal = false;
                var indicador = false;
                for (var i = 0; i < data.length; i++) {
                    indicador = true;
                    break;
                }

                if (indicador === false) {
                    auxiliarServices.NotificationMessage('Sistemas', 'No hay Stock ..', 'error', '#ff6849', 1500);
                    $scope.objeto_parametros_detalle.stock = '0';
                    return;
                }

                $scope.objeto_parametros_detalle.precioVenta_Pedido_Det = data[0].precioventa_listaprecios;
                $scope.objeto_parametros_detalle.stock = data[0].Stock;

                $scope.Calculo_Importe();

                $timeout(function () {
                    $('#txt_cantidad').focus().select();
                });


            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.SubTotal_G = 0;
    $scope.Igv_G = 0;
    $scope.Total_G = 0;

    $scope.CalculoTotales_General = function () {

        $scope.SubTotal_G = 0;
        $scope.Igv_G = 0;
        $scope.Total_G = 0;

        var subTotal = 0;
        var igv = 0;
        var neto = 0;

        for (var i = 0; i < $scope.Lista_DataDetalle.length; i++) {
            subTotal += parseFloat($scope.Lista_DataDetalle[i].total_Pedido_Det);
        }

        neto = parseFloat(subTotal / 1.18);

        $scope.SubTotal_G = parseFloat(neto).toFixed(2);
        $scope.Igv_G = parseFloat(subTotal - neto).toFixed(2);
        $scope.Total_G = parseFloat(subTotal).toFixed(2);


        ///--- de forma inversa cuando el Precio del Producto ya tiene IGV
        //for (var i = 0; i < $scope.Lista_DataDetalle.length; i++) {
        //    total += parseFloat($scope.Lista_DataDetalle[i].total_Pedido_Det);
        //}
        //subTotal = parseFloat(total / 1.18);
        //igv = parseFloat(subTotal * 0.18);

        //$scope.SubTotal_G = parseFloat(subTotal).toFixed(2);
        //$scope.Igv_G = parseFloat(igv).toFixed(2);
        //$scope.Total_G = parseFloat(Math.round(total * 100) / 100).toFixed(2);

        return true;
    };

    $scope.Open_New_Modal_AyudaCliente = function () {

        var regionDetalle = document.getElementById('regionDetalle');
        $('#txt_busquedaCliente').val('');
        $scope.Lista_Busqueda_Cliente = [];
        regionDetalle.style.display = 'none';
        $('#modalAyuda_Cliente').modal('show');
        $timeout(function () {
            regionDetalle.style.display = 'none';
            $('#txt_busquedaCliente').focus().select();
        }, 500);
    };

    var oTable_Cli;
    $scope.loader_modal_ayuda = false;
    $scope.Lista_Busqueda_Cliente = [];
    $scope.Ayuda_BuscarCliente = function () {
        var txt_busquedaCliente = document.getElementById('txt_busquedaCliente').value;
        var regionDetalle = document.getElementById('regionDetalle');

        $scope.loader_modal_ayuda = true;
        PedidosServices.get_Ayuda_Buscar_Cliente(txt_busquedaCliente)
            .then(function (data) {
                $scope.loader_modal_ayuda = false;


                $scope.Lista_Busqueda_Cliente = [];
                $scope.Lista_Busqueda_Cliente = data;

                $timeout(function () {
                    regionDetalle.style.display = '';
                    $scope.loader_modal_ayuda = false;
                    if (oTable_Cli !== 'data') {
                        oTable_Cli = 'data';
                        auxiliarServices.initFooTable('tbl_busquedaCliente', 'inputSearch_C');
                    } else {
                        $('#tbl_busquedaCliente').trigger('footable_initialize');
                    }
                }, 800);

            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Agregar_Cliente = function (obj) {

        $scope.objeto_parametros.codigoInterno_Suministro = obj.codigoInterno_Cliente;
        $scope.objeto_parametros.nrodoc_cliente = obj.nroDoc_Cliente;
        $scope.objeto_parametros.nombres_Cliente = obj.nombres_Cliente + '  -  ' + obj.direccion_referencia;
        $scope.objeto_parametros.codigoInterno_Cliente = obj.codigoInterno_Cliente;
        $scope.objeto_parametros.direccion_Pedido_Cab = obj.direccion_referencia;
        $scope.objeto_parametros.id_PersonalVendedor = String(obj.id_PersonalVendedor);
        $('#modalAyuda_Cliente').modal('hide');
        $timeout(function () {
            $('#cbo_vendedor').val(String(obj.id_PersonalVendedor)).trigger('change.select2');
        }, 200);
    };


    $scope.Open_New_Modal_AyudaProducto = function () {

        var regionDetalle_Producto = document.getElementById('regionDetalle_Producto');
        $('#txt_busquedaProducto').val('');
        $scope.Lista_Busqueda_Producto = [];
        regionDetalle_Producto.style.display = 'none';
        $('#modalAyuda_Producto').modal('show');
        $timeout(function () {
            regionDetalle_Producto.style.display = 'none';
            $('#txt_busquedaProducto').focus().select();
        }, 800);
    };

    var oTable_Prod;

    $scope.Lista_Busqueda_Producto = [];
    $scope.Ayuda_BuscarProducto = function () {
        if ($scope.objeto_parametros.id_Local === 0 || $scope.objeto_parametros.id_Local === '0' || $scope.objeto_parametros.id_Local === null || $scope.objeto_parametros.id_Local === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Local', 'error', '#ff6849', 1500);
            return;
        }

        var txt_busquedaProducto = document.getElementById('txt_busquedaProducto').value;
        var regionDetalle_Producto = document.getElementById('regionDetalle_Producto');


        var e = document.getElementById("cbo_local_pedido");
        var id_LocalPedido = e.options[e.selectedIndex].value;

        var d = document.getElementById("cbo_almacen_pedido");
        var id_AlmacenPedido = d.options[d.selectedIndex].value;

        $scope.loader_modal_ayuda = true;
        PedidosServices.get_Ayuda_Buscar_Producto(id_LocalPedido, id_AlmacenPedido, txt_busquedaProducto)
            .then(function (data) {

                $scope.loader_modal_ayuda = false;
                $scope.Lista_Busqueda_Producto = [];
                $scope.Lista_Busqueda_Producto = data;

                $timeout(function () {
                    $scope.loaderfiltros = false;
                    regionDetalle_Producto.style.display = '';
                    if (oTable_Prod == null) {
                        oTable_Prod = 'data';
                        auxiliarServices.initFooTable('tbl_busquedaProducto', 'inputSearch_P');
                    } else {
                        $('#tbl_busquedaProducto').trigger('footable_initialize');
                    }
                }, 800);

            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };

    $scope.Agregar_Producto = function (obj) {
        $scope.objeto_parametros_detalle.id_Producto = obj.id_producto;
        $scope.objeto_parametros_detalle.codigo1_Producto = obj.codigoInterno;
        $scope.objeto_parametros_detalle.nombre_Producto = obj.descripcion_producto + ' - ' + obj.unidadMedida + ' - ' + obj.nombre_marcaproducto;
        $scope.objeto_parametros_detalle.precioVenta_Pedido_Det = obj.precioventa_listaprecios;
        $scope.objeto_parametros_detalle.stock = obj.Stock;
        $('#modalAyuda_Producto').modal('hide');

        $timeout(function () {
            $('#txt_cantidad').focus().select();
        }, 800);
    };

    $scope.GenerarFacturacion = function () {
        var indicador = false;
        for (var i = 0; i < $scope.Lista_DataDetalle.length; i++) {
            indicador = true;
            break;
        }

        if (indicador == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Pedido Incompleto, debe de ingresar al menos un Detalle del Pedido.', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.objeto_parametros.Numero_Documento == '0000000' || $scope.objeto_parametros.Numero_Documento ==  '0000000' || $scope.objeto_parametros.Numero_Documento === null || $scope.objeto_parametros.Numero_Documento === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nro de Documento, luego Guarde la Cabecera del Pedido. ', 'error', '#ff6849', 2000);
            return;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Generar la Cancelacion.',
            type: 'confirmationAlert'
        };

        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loader_modal = true;
                $('#btn_generaCancelacion').attr("disabled", true);
                PedidosServices.set_GenerandoFacturacion($scope.objeto_parametros.Numero_Pedido, auxiliarServices.getUserId())
                    .then(function (data) {
                        $scope.loader_modal = false;                        
                        var res = data.split("|");
                        console.log(data);

                        if (res[0] == "OK") {
                            $('#btn_generaCancelacion').attr("disabled", false);

                            $scope.disabledCabecera = "disabledContent";
                            $scope.disabledDetalle = "disabledContent";

                            let Obj_NumDocumento = res[1].split("-");
                            $scope.objeto_parametros.serie = Obj_NumDocumento[0];
                            $scope.objeto_parametros.num_doc = Obj_NumDocumento[1];
                            $scope.objeto_parametros.Numero_Documento = res[1];

                            if ($scope.objeto_parametros.id_TipoDocumento == 1 || $scope.objeto_parametros.id_TipoDocumento == '1' || $scope.objeto_parametros.id_TipoDocumento == 2 || $scope.objeto_parametros.id_TipoDocumento == '2') {
                                $scope.generarDocu_Facturacion_Electronica($scope.objeto_parametros.id_TipoDocumento, $scope.objeto_parametros.Numero_Documento);
                                //----modal de cancelaciones----
                                setTimeout(function () {
                                    $scope.AbrirModal_Pagos();
                                }, 6000);
                            } else if ($scope.objeto_parametros.id_TipoDocumento == 3 || $scope.objeto_parametros.id_TipoDocumento == '3') {                                
                                var chk_transporrte = document.getElementById('chk_transporrte');
                                
                                //---generando la impresion de la factura              
                                $scope.generarVistaPreliminar_Sunat($scope.objeto_parametros.id_TipoDocumento, $scope.objeto_parametros.Numero_Documento)
                
                                if (chk_transporrte.checked == true) {
 
                                } else {
                                    setTimeout(function () {
                                        $scope.AbrirModal_Pagos();
                                    }, 2000);
                                }
                            }
                            //------actualizando la informacion de los pedidos
                            $scope.Listando_InformacionPedidos();
                        } else {
                            $('#btn_generaCancelacion').attr("disabled", false);
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(data);
                        }

                    }, function (error) {
                        $scope.loader_modal = false;
                        console.log(error);
                        $('#btn_generaCancelacion').attr("disabled", false);
                    });
            }
        });
    };


    $scope.generarDocu_Facturacion_Electronica = function (id_tipoDoc, nroDocumento) {
        $scope.loader_modal = true;
        Documentos_MasivosServices.Generar_Documentos_Electronicos_Individual(id_tipoDoc, nroDocumento)
            .then(function (res) {
                $scope.loader_modal = false;
                if (res.length == 0) {
                    return;
                }
                var cabContent = [];

                var idCab = null;
                var detConent = res;
                var indexAux = -1;
                res.forEach(function (item, index) {
                    if (idCab !== item.idcab) {
                        indexAux++;
                        cabContent.push({
                            ID: indexAux,
                            idcab: item.idcab,
                            nro_doc: item.nro_doc,
                            fecha_emision: item.fecha_emision,
                            fecha_vencimiento: item.fecha_vencimiento,
                            hora_emision: item.hora_emision,
                            tipo_doc_sunat: item.tipo_doc_sunat,
                            tipo_moneda_sunat: item.tipo_moneda_sunat,
                            ruc_empresa_emite: item.ruc_empresa_emite,
                            razon_social_emite: item.razon_social_emite,
                            tipo_doc_identidad_emite: item.tipo_doc_identidad_emite,
                            razon_social_receptora: item.razon_social_receptora,
                            ruc_empresa_receptora: item.ruc_empresa_receptora,
                            tipo_doc_identidad_receptora: item.tipo_doc_identidad_receptora,
                            monto_total_igv: item.monto_total_igv,
                            monto_total_inafecto: item.monto_total_inafecto,
                            monto_sub_total: item.monto_sub_total,
                            monto_total: item.monto_total,
                            nombreArchivo: item.nombreArchivo,

                            departamento_emite: item.departamento_emite,
                            provincia_emite: item.provincia_emite,
                            distrito_emite: item.distrito_emite,
                            calle_emite: item.calle_emite,
                            departamento_receptora: item.departamento_receptora,
                            provincia_receptora: item.provincia_receptora,
                            distrito_receptora: item.distrito_receptora,
                            calle_receptora: item.calle_receptora,
                            correo_receptora: item.correo_receptora,                                                
                            identificador: item.identificador,
                            cod_unidad: item.cod_unidad,

                            codigo_tipo_oper: item.codigo_tipo_oper,
                            cod_establecimiento: item.cod_establecimiento,
                            DETCONTENT: []
                        });
                        detConent.forEach(function (itemdet) {
                            if (itemdet.idcab === cabContent[indexAux].idcab) {
                                cabContent[indexAux].DETCONTENT.push(itemdet);
                            }
                        });
                    }
                    idCab = item.idcab;
                });

                if (id_tipoDoc == 1 || id_tipoDoc == '1') {
                    get_Json_Facturacion_Electronica(cabContent);
                } else if (id_tipoDoc == 2 || id_tipoDoc == '2') {
                    get_Json_Boleta_Electronica(cabContent);
                }
            }, function (err) {
                $scope.loader_modal = false;
                console.log(err);
            });
    };



     ////------ NUEVO FORMATO FACTURA  2.1 comprobantes actualizados la version nueva ---------

    var get_Json_Facturacion_Electronica = function (cab) {

        var acum = 1;
        var nroLetra = '';
        var x = 1;

        var IndiceGlobal = cab.length;

        var ejecutarConsulta = function (indice) {
            if (IndiceGlobal == indice) {
                return;
            }

            var InvoiceLine_aux = [];
            cab[indice].DETCONTENT.forEach(function (itemDet, indexDet) {

                InvoiceLine_aux.push({
                    "ID": [
                        {
                            "IdentifierContent": acum
                        }
                    ],
                    "Note": [
                        {
                            "TextContent": cab[indice].cod_unidad
                        }
                    ],
                    "InvoicedQuantity": [
                        {
                            "QuantityContent": itemDet.cantidad,
                            "QuantityUnitCode": itemDet.cod_unidad_sunat,
                            "QuantityUnitCodeListIdentifier": "UN/ECE rec 20",
                            "QuantityUnitCodeListAgencyNameText": "United Nations Economic Commission for Europe"
                        }
                    ],
                    "LineExtensionAmount": [
                        {
                            "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                            "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                        }
                    ],
                    "PricingReference": [
                        {
                            "AlternativeConditionPrice": [
                                {
                                    "PriceAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                        }
                                    ],
                                    "PriceTypeCode": [
                                        {
                                            "CodeContent": "01",
                                            "CodeListNameText": "SUNAT:Indicador de Tipo de Precio",
                                            "CodeListAgencyNameText": "PE:SUNAT",
                                            "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "TaxTotal": [
                        {
                            "TaxAmount": [
                                {
                                    "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                    "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                }
                            ],
                            "TaxSubtotal": [
                                {
                                    "TaxableAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                        }
                                    ],
                                    "TaxAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                        }
                                    ],
                                    "TaxCategory": [
                                        {
                                            "Percent": [
                                                {
                                                    "NumericContent": 18.00
                                                }
                                            ],
                                            "TaxExemptionReasonCode": [
                                                {
                                                    "CodeContent": "10",
                                                    "CodeListAgencyNameText": "PE:SUNAT",
                                                    "CodeListNameText": "Afectacion del IGV",
                                                    "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
                                                }
                                            ],
                                            "TaxScheme": [
                                                {
                                                    "ID": [
                                                        {
                                                            "IdentifierContent": "1000",
                                                            "IdentificationSchemeNameText": "Codigo de tributos",
                                                            "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                            "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                        }
                                                    ],
                                                    "Name": [
                                                        {
                                                            "TextContent": "IGV"
                                                        }
                                                    ],
                                                    "TaxTypeCode": [
                                                        {
                                                            "CodeContent": "VAT"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "Item": [
                        {
                            "Description": [
                                {
                                    "TextContent": itemDet.nombre_producto
                                }
                            ],
                            "SellersItemIdentification": [
                                {
                                    "ID": [
                                        {
                                            "IdentifierContent": itemDet.codigo_producto
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "Price": [
                        {
                            "PriceAmount": [
                                {
                                    "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),
                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                }
                            ]
                        }
                    ]
                });

                acum = acum + 1;
            })

            nroLetra = NumeroALetras(cab[indice].monto_total);

            var json_Facturacion = {
                "_D": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
                "_S": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
                "_B": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
                "_E": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
                "Invoice": [
                    {
                        "UBLVersionID": [
                            {
                                "IdentifierContent": "2.1"
                            }
                        ],
                        "CustomizationID": [
                            {
                                "IdentifierContent": "2.0"
                            }
                        ],
                        "ID": [
                            {
                                "IdentifierContent": cab[indice].nro_doc
                            }
                        ],
                        "IssueDate": [
                            {
                                "DateContent": cab[indice].fecha_emision
                            }
                        ],
                        "IssueTime": [
                            {
                                "DateTimeContent": cab[indice].hora_emision
                            }
                        ],
                        "InvoiceTypeCode": [
                            {
                                "CodeContent": cab[indice].tipo_doc_sunat,
                                "CodeListNameText": "Tipo de Documento",
                                "CodeListSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo51",
                                "CodeListIdentifier": cab[indice].codigo_tipo_oper, //--- falta agregar al procedimiento
                                "CodeNameText": "Tipo de Operacion",
                                "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
                                "CodeListAgencyNameText": "PE:SUNAT"
                            }
                        ],
                        "Note": [
                            {
                                "TextContent": nroLetra,
                                "LanguageLocaleIdentifier": "1000"
                            }
                        ],
                        "DocumentCurrencyCode": [
                            {
                                "CodeContent": cab[indice].tipo_moneda_sunat,
                                "CodeListIdentifier": "ISO 4217 Alpha",
                                "CodeListNameText": "Currency",
                                "CodeListAgencyNameText": "United Nations Economic Commission for Europe"
                            }
                        ],
                        "LineCountNumeric": [
                            {
                                "NumericContent": cab[indice].DETCONTENT.length
                            }
                        ],
                        "Signature": [
                            {
                                "ID": [
                                    {
                                        "IdentifierContent": "IDSignature"
                                    }
                                ],
                                "SignatoryParty": [
                                    {
                                        "PartyIdentification": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": cab[indice].ruc_empresa_emite
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyName": [
                                            {
                                                "Name": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_emite
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "DigitalSignatureAttachment": [
                                    {
                                        "ExternalReference": [
                                            {
                                                "URI": [
                                                    {
                                                        "TextContent": "IDSignature"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],                      

                        "AccountingSupplierParty": [
                            {
                                "Party": [
                                    {
                                        "PartyIdentification": [ // Tipo de documento y número de documento del Emisor.
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": cab[indice].ruc_empresa_emite,
                                                        "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_emite,
                                                        "IdentificationSchemeNameText": "Documento de Identidad",
                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyName": [ // Va el nombre comercial del Emisor.
                                            {
                                                "Name": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_emites
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyLegalEntity": [
                                            {
                                                "RegistrationName": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_emite
                                                    }
                                                ],
                                                "RegistrationAddress": [ // Va la dirección completa y detallada del Emisor.
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": "150111",
                                                                "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                "IdentificationSchemeNameText": "Ubigeos"
                                                            }
                                                        ],
                                                        "AddressTypeCode": [ // Nueva información de la dirección , va el código de establecimiento del Emisor, es mandatorio.
                                                            {
                                                                "CodeContent": cab[indice].cod_establecimiento,
                                                                "CodeListAgencyNameText": "PE:SUNAT",
                                                                "CodeListNameText": "Establecimientos anexos"
                                                            }
                                                        ],
                                                        "CityName": [
                                                            {
                                                                "TextContent": cab[indice].departamento_emite
                                                            }
                                                        ],
                                                        "CountrySubentity": [
                                                            {
                                                                "TextContent": cab[indice].provincia_emite
                                                            }
                                                        ],
                                                        "District": [
                                                            {
                                                                "TextContent": cab[indice].distrito_emite
                                                            }
                                                        ],
                                                        "AddressLine": [
                                                            {
                                                                "Line": [
                                                                    {
                                                                        "TextContent": cab[indice].calle_emite
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        "Country": [ // Va el código de país del Emisor.
                                                            {
                                                                "IdentificationCode": [
                                                                    {
                                                                        "CodeContent": "PE",
                                                                        "CodeListIdentifier": "ISO 3166-1",
                                                                        "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                        "CodeListNameText": "Country"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "AccountingCustomerParty": [
                            {
                                "Party": [  // Tipo de documento y número de documento del Receptor.
                                    {
                                        "PartyIdentification": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": cab[indice].ruc_empresa_receptora,
                                                        "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_receptora,
                                                        "IdentificationSchemeNameText": "Documento de Identidad",
                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyName": [
                                            {
                                                "Name": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_receptora
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyLegalEntity": [
                                            {
                                                "RegistrationName": [ // Va la razón social del Receptor.
                                                    {
                                                        "TextContent": cab[indice].razon_social_receptora
                                                    }
                                                ],
                                                "RegistrationAddress": [ //Va la dirección completa y detallada del Receptor.
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": "140124",
                                                                "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                "IdentificationSchemeNameText": "Ubigeos"
                                                            }
                                                        ],
                                                        "CityName": [
                                                            {
                                                                "TextContent": cab[indice].departamento_receptora
                                                            }
                                                        ],
                                                        "CountrySubentity": [
                                                            {
                                                                "TextContent": cab[indice].provincia_receptora
                                                            }
                                                        ],
                                                        "District": [
                                                            {
                                                                "TextContent": cab[indice].distrito_receptora
                                                            }
                                                        ],
                                                        "AddressLine": [  //Va la dirección del Receptor.
                                                            {
                                                                "Line": [
                                                                    {
                                                                        "TextContent": cab[indice].calle_receptora
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        "Country": [
                                                            {
                                                                "IdentificationCode": [
                                                                    {
                                                                        "CodeContent": "PE",
                                                                        "CodeListIdentifier": "ISO 3166-1",
                                                                        "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                        "CodeListNameText": "Country"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "Contact": [
                                            {
                                                "ElectronicMail": [
                                                    {
                                                        "TextContent": cab[indice].correo_receptora
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],

                        "TaxTotal": [
                            {
                                "TaxAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ],
                                "TaxSubtotal": [
                                    {
                                        "TaxableAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total)).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxCategory": [
                                            {
                                                "TaxScheme": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": "1000",
                                                                "IdentificationSchemeNameText": "Codigo de tributos",
                                                                "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                            }
                                                        ],
                                                        "Name": [
                                                            {
                                                                "TextContent": "IGV"
                                                            }
                                                        ],
                                                        "TaxTypeCode": [
                                                            {
                                                                "CodeContent": "VAT"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "LegalMonetaryTotal": [
                            {
                                "LineExtensionAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ],
                                "TaxInclusiveAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ],
                                "PayableAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ]
                            }
                        ],
                        "InvoiceLine": InvoiceLine_aux
                    }
                ]
            }
            ///---- fin variable json

            /// guardando el servidor el archivo creado---

            $scope.loader_modal = true;
            console.log(cab[indice].nombreArchivo + ' : ' + cab[indice].idcab);
            //console.log(JSON.stringify(json_Facturacion))
            //return;

            generate_json_file(JSON.stringify(json_Facturacion), cab[indice].nombreArchivo, cab[indice].idcab)
                .then(function (res) {
                    //$scope.loader_modal = false;
                    //----pasamos al siguiente documento
                    ejecutarConsulta((indice + 1));

                    //---generando la impresion de la factura
                    setTimeout(function () {
                        $scope.generarVistaPreliminar_Sunat($scope.objeto_parametros.id_TipoDocumento, $scope.objeto_parametros.Numero_Documento)
                    }, 6000);

                }, function (error) {

                    $scope.loader_modal = false;
                    console.log(error)
                    alert(error)
                    //----pasamos al siguiente documento
                    ejecutarConsulta((indice + 1));
                })
        }

        ejecutarConsulta(0);


    }    

    ////---------------------------------------------------------------------- 
    

   ////------ NUEVO FORMATO   BOLETA  2.1 comprobantes actualizados  ---------

    var get_Json_Boleta_Electronica = function (cab) {
        var acum = 1;
        var nroLetra = '';
        var x = 1;

        var IndiceGlobal = cab.length;

        var ejecutarConsulta = function (indice) {
            if (IndiceGlobal == indice) {
                return;
            }
            var InvoiceLine_aux = [];
            cab[indice].DETCONTENT.forEach(function (itemDet, indexDet) {

                InvoiceLine_aux.push({
                    "ID": [
                        {
                            "IdentifierContent": acum
                        }
                    ],
                    "Note": [
                        {
                            "TextContent": cab[indice].cod_unidad
                        }
                    ],
                    "InvoicedQuantity": [
                        {
                            "QuantityContent": itemDet.cantidad,
                            "QuantityUnitCode": itemDet.cod_unidad_sunat,
                            "QuantityUnitCodeListIdentifier": "UN/ECE rec 20",
                            "QuantityUnitCodeListAgencyNameText": "United Nations Economic Commission for Europe"
                        }
                    ],
                    "LineExtensionAmount": [
                        {
                            "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                        }
                    ],
                    "PricingReference": [
                        {
                            "AlternativeConditionPrice": [
                                {
                                    "PriceAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                        }
                                    ],
                                    "PriceTypeCode": [
                                        {
                                            "CodeContent": "01",
                                            "CodeListNameText": "SUNAT:Indicador de Tipo de Precio",
                                            "CodeListAgencyNameText": "PE:SUNAT",
                                            "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "TaxTotal": [
                        {
                            "TaxAmount": [
                                {
                                    "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                }
                            ],
                            "TaxSubtotal": [
                                {
                                    "TaxableAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                        }
                                    ],
                                    "TaxAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                        }
                                    ],
                                    "TaxCategory": [
                                        {
                                            "Percent": [
                                                {
                                                    "NumericContent": 18.00
                                                }
                                            ],

                                            "TaxExemptionReasonCode": [
                                                {
                                                    "CodeContent": "10",
                                                    "CodeListAgencyNameText": "PE:SUNAT",
                                                    "CodeListNameText": "Afectacion del IGV",
                                                    "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
                                                }
                                            ],
                                            "TaxScheme": [
                                                {
                                                    "ID": [
                                                        {
                                                            "IdentifierContent": "1000",
                                                            "IdentificationSchemeNameText": "Codigo de tributos",
                                                            "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                            "IdentificationSchemeAgencyNameText": "PE:SUNAT"

                                                        }
                                                    ],
                                                    "Name": [
                                                        {
                                                            "TextContent": "IGV"
                                                        }
                                                    ],
                                                    "TaxTypeCode": [
                                                        {
                                                            "CodeContent": "VAT"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "Item": [
                        {
                            "Description": [
                                {
                                    "TextContent": itemDet.nombre_producto
                                }
                            ],
                            "SellersItemIdentification": [
                                {
                                    "ID": [
                                        {
                                            "IdentifierContent": itemDet.codigo_producto
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "Price": [
                        {
                            "PriceAmount": [
                                {
                                    "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),
                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                }
                            ]
                        }
                    ]
                });

                acum = acum + 1;

            })

            nroLetra = NumeroALetras(cab[indice].monto_total);

            var json_Boletas = {
                "_D": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
                "_S": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
                "_B": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
                "_E": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
                "Invoice": [
                    {
                        "UBLVersionID": [
                            {
                                "IdentifierContent": "2.1"
                            }
                        ],
                        "CustomizationID": [
                            {
                                "IdentifierContent": "2.0"
                            }
                        ],
                        "ID": [
                            {
                                "IdentifierContent": cab[indice].nro_doc
                            }
                        ],
                        "IssueDate": [
                            {
                                "DateContent": cab[indice].fecha_emision
                            }
                        ],
                        "IssueTime": [
                            {
                                "DateTimeContent": cab[indice].hora_emision
                            }
                        ],
                        "InvoiceTypeCode": [
                            {
                                "CodeContent": cab[indice].tipo_doc_sunat,
                                "CodeListNameText": "Tipo de Documento",
                                "CodeListSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo51",
                                "CodeListIdentifier": cab[indice].codigo_tipo_oper, 
                                "CodeNameText": "Tipo de Operacion",
                                "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
                                "CodeListAgencyNameText": "PE:SUNAT"
                            }
                        ],

                        "Note": [
                            {
                                "TextContent": nroLetra,
                                "LanguageLocaleIdentifier": "1000"
                            }
                        ],
                        "DocumentCurrencyCode": [
                            {
                                "CodeContent": cab[indice].tipo_moneda_sunat,
                                "CodeListIdentifier": "ISO 4217 Alpha",
                                "CodeListNameText": "Currency",
                                "CodeListAgencyNameText": "United Nations Economic Commission for Europe"
                            }
                        ],
                        "LineCountNumeric": [
                            {
                                "NumericContent": cab[indice].DETCONTENT.length
                            }
                        ],
                        "Signature": [
                            {
                                "ID": [
                                    {
                                        "IdentifierContent": "IDSignature"
                                    }
                                ],
                                "SignatoryParty": [
                                    {
                                        "PartyIdentification": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": cab[indice].ruc_empresa_emite
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyName": [
                                            {
                                                "Name": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_emite
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "DigitalSignatureAttachment": [
                                    {
                                        "ExternalReference": [
                                            {
                                                "URI": [
                                                    {
                                                        "TextContent": "IDSignature"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],                       

                        "AccountingSupplierParty": [
                            {
                                "Party": [
                                    {
                                        "PartyIdentification": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": cab[indice].ruc_empresa_emite,
                                                        "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_emite,
                                                        "IdentificationSchemeNameText": "Documento de Identidad",
                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyName": [
                                            {
                                                "Name": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_emite
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyLegalEntity": [
                                            {
                                                "RegistrationName": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_emite
                                                    }
                                                ],
                                                "RegistrationAddress": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": "150111",
                                                                "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                "IdentificationSchemeNameText": "Ubigeos"
                                                            }
                                                        ],
                                                        "AddressTypeCode": [
                                                            {
                                                                "CodeContent": cab[indice].cod_establecimiento,
                                                                "CodeListAgencyNameText": "PE:SUNAT",
                                                                "CodeListNameText": "Establecimientos anexos"
                                                            }
                                                        ],
                                                        "CityName": [
                                                            {
                                                                "TextContent": cab[indice].departamento_emite
                                                            }
                                                        ],
                                                        "CountrySubentity": [
                                                            {
                                                                "TextContent": cab[indice].provincia_emite
                                                            }
                                                        ],
                                                        "District": [
                                                            {
                                                                "TextContent": cab[indice].distrito_emite
                                                            }
                                                        ],
                                                        "AddressLine": [
                                                            {
                                                                "Line": [
                                                                    {
                                                                        "TextContent": cab[indice].calle_emite
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        "Country": [
                                                            {
                                                                "IdentificationCode": [
                                                                    {
                                                                        "CodeContent": "PE",
                                                                        "CodeListIdentifier": "ISO 3166-1",
                                                                        "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                        "CodeListNameText": "Country"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],                                       
                        "AccountingCustomerParty": [
                            {
                                "Party": [
                                    {
                                        "PartyIdentification": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": cab[indice].ruc_empresa_receptora,
                                                        "IdentificationSchemeIdentifier": "1",
                                                        "IdentificationSchemeNameText": "Documento de Identidad",
                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyName": [
                                            {
                                                "Name": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_receptora
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyLegalEntity": [
                                            {
                                                "RegistrationName": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_receptora
                                                    }
                                                ],
                                                "RegistrationAddress": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": "150103",
                                                                "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                "IdentificationSchemeNameText": "Ubigeos"
                                                            }
                                                        ],
                                                        "CityName": [
                                                            {
                                                                "TextContent": cab[indice].departamento_receptora
                                                            }
                                                        ],
                                                        "CountrySubentity": [
                                                            {
                                                                "TextContent": cab[indice].provincia_receptora
                                                            }
                                                        ],
                                                        "District": [
                                                            {
                                                                "TextContent": cab[indice].distrito_receptora
                                                            }
                                                        ],
                                                        "AddressLine": [
                                                            {
                                                                "Line": [
                                                                    {
                                                                        "TextContent": cab[indice].calle_receptora
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        "Country": [
                                                            {
                                                                "IdentificationCode": [
                                                                    {
                                                                        "CodeContent": "PE",
                                                                        "CodeListIdentifier": "ISO 3166-1",
                                                                        "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                        "CodeListNameText": "Country"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "Contact": [
                                            {
                                                "ElectronicMail": [
                                                    {
                                                        "TextContent": cab[indice].correo_receptora
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
 
                        "TaxTotal": [
                            {
                                "TaxAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ],
                                "TaxSubtotal": [
                                    {
                                        "TaxableAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxCategory": [
                                            {
                                                "TaxScheme": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": "1000",
                                                                "IdentificationSchemeNameText": "Codigo de tributos",
                                                                "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                            }
                                                        ],
                                                        "Name": [
                                                            {
                                                                "TextContent": "IGV"
                                                            }
                                                        ],
                                                        "TaxTypeCode": [
                                                            {
                                                                "CodeContent": "VAT"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]

                                    }
                                ]
                            }
                        ],
                        "LegalMonetaryTotal": [
                            {
                                "LineExtensionAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ],
                                "TaxInclusiveAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ],
                                "PayableAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ]
                            }
                        ],
                        "InvoiceLine": InvoiceLine_aux

                    }
                ]
            }

            ///---- fin variable json Boleta
            /// guardando el servidor el archivo creado---

            $scope.loader_modal = true;
            console.log(cab[indice].nombreArchivo + ' : ' + cab[indice].idcab);
            generate_json_file(JSON.stringify(json_Boletas), cab[indice].nombreArchivo, cab[indice].idcab)
                .then(function (res) {
                    //$scope.loader_modal = false;
                    //----pasamos la siguiente documento
                    ejecutarConsulta((indice + 1));

                    //---generando la impresion de la factura
                    setTimeout(function () {
                        $scope.generarVistaPreliminar_Sunat($scope.objeto_parametros.id_TipoDocumento, $scope.objeto_parametros.Numero_Documento)
                    }, 6000);

                }, function (error) {
                    $scope.loader_modal = false;
                    console.log(error);
                    alert(error);
                    //----pasamos la siguiente documento
                    ejecutarConsulta((indice + 1));
                })
        }

        ejecutarConsulta(0);
    }

    ///----------------------------------------------------------------------- 


    var get_Json_Facturacion_Electronica_1_1 = function (cab) {
        var acum = 1;
        var nroLetra = '';
        var x = 1;

        var IndiceGlobal = cab.length;

        var ejecutarConsulta = function (indice) {
            if (IndiceGlobal == indice) {
                return;
            }

            var InvoiceLine_aux = [];
            cab[indice].DETCONTENT.forEach(function (itemDet, indexDet) {

                InvoiceLine_aux.push({
                    "ID": [
                        {
                            "IdentifierContent": acum
                        }
                    ],
                    "Note": [
                        {
                            "TextContent": cab[indice].cod_unidad
                        }
                    ],
                    "InvoicedQuantity": [
                        {
                            "QuantityContent": itemDet.cantidad,
                            "QuantityUnitCode": itemDet.cod_unidad_sunat,
                            "QuantityUnitCodeListIdentifier": "UN/ECE rec 20",
                            "QuantityUnitCodeListAgencyNameText": "United Nations Economic Commission for Europe"
                        }
                    ],
                    "LineExtensionAmount": [
                        {
                            "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                            "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                        }
                    ],
                    "PricingReference": [
                        {
                            "AlternativeConditionPrice": [
                                {
                                    "PriceAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                        }
                                    ],
                                    "PriceTypeCode": [
                                        {
                                            "CodeContent": "01",
                                            "CodeListNameText": "SUNAT:Indicador de Tipo de Precio",
                                            "CodeListAgencyNameText": "PE:SUNAT",
                                            "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "TaxTotal": [
                        {
                            "TaxAmount": [
                                {
                                    "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                    "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                }
                            ],
                            "TaxSubtotal": [
                                {
                                    "TaxableAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                        }
                                    ],
                                    "TaxAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                        }
                                    ],
                                    "TaxCategory": [
                                        {
                                            "ID": [
                                                {
                                                    "IdentifierContent": "S",
                                                    "IdentificationSchemeIdentifier": "UN/ECE 5305",
                                                    "IdentificationSchemeNameText": "Tax Category Identifier",
                                                    "IdentificationSchemeAgencyNameText": "United Nations Economic Commission for Europe"
                                                }
                                            ],
                                            "TaxExemptionReasonCode": [
                                                {
                                                    "CodeContent": "10",
                                                    "CodeListAgencyNameText": "PE:SUNAT",
                                                    "CodeListNameText": "SUNAT:Codigo de Tipo de Afectación del IGV",
                                                    "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
                                                }
                                            ],
                                            "TaxScheme": [
                                                {
                                                    "ID": [
                                                        {
                                                            "IdentifierContent": "1000",
                                                            "IdentificationSchemeIdentifier": "UN/ECE 5153",
                                                            "IdentificationSchemeAgencyIdentifier": "6"
                                                        }
                                                    ],
                                                    "Name": [
                                                        {
                                                            "TextContent": "IGV"
                                                        }
                                                    ],
                                                    "TaxTypeCode": [
                                                        {
                                                            "CodeContent": "VAT"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "Item": [
                        {
                            "Description": [
                                {
                                    "TextContent": itemDet.nombre_producto
                                }
                            ],
                            "SellersItemIdentification": [
                                {
                                    "ID": [
                                        {
                                            "IdentifierContent": itemDet.codigo_producto
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "Price": [
                        {
                            "PriceAmount": [
                                {
                                    "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),
                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                }
                            ]
                        }
                    ]
                });

                acum = acum + 1;
            })

            nroLetra = NumeroALetras(cab[indice].monto_total);

            var json_Facturacion = {
                "_D": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
                "_S": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
                "_B": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
                "_E": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
                "Invoice": [
                    {
                        "UBLVersionID": [
                            {
                                "IdentifierContent": "2.1"
                            }
                        ],
                        "CustomizationID": [
                            {
                                "IdentifierContent": "2.0"
                            }
                        ],
                        "ProfileID": [
                            {
                                "IdentifierContent": cab[indice].identificador,
                                "IdentificationSchemeNameText": "SUNAT:Identificador de Tipo de Operación",
                                "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo17"
                            }
                        ],
                        "ID": [
                            {
                                "IdentifierContent": cab[indice].nro_doc
                            }
                        ],
                        "IssueDate": [
                            {
                                "DateContent": cab[indice].fecha_emision
                            }
                        ],
                        "IssueTime": [
                            {
                                "DateTimeContent": cab[indice].hora_emision
                            }
                        ],
                        "InvoiceTypeCode": [
                            {
                                "CodeContent": cab[indice].tipo_doc_sunat,
                                "CodeListSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
                                "CodeListNameText": "SUNAT:Identificador de Tipo de Documento",
                                "CodeListAgencyNameText": "PE:SUNAT"
                            }
                        ],
                        "Note": [
                            {
                                "TextContent": nroLetra,
                                "LanguageLocaleIdentifier": "1000"
                            }
                        ],
                        "DocumentCurrencyCode": [
                            {
                                "CodeContent": cab[indice].tipo_moneda_sunat,
                                "CodeListIdentifier": "ISO 4217 Alpha",
                                "CodeListNameText": "Currency",
                                "CodeListAgencyNameText": "United Nations Economic Commission for Europe"
                            }
                        ],
                        "LineCountNumeric": [
                            {
                                "NumericContent": cab[indice].DETCONTENT.length
                            }
                        ],
                        "Signature": [
                            {
                                "ID": [
                                    {
                                        "IdentifierContent": "IDSignature"
                                    }
                                ],
                                "SignatoryParty": [
                                    {
                                        "PartyIdentification": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": cab[indice].ruc_empresa_emite
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyName": [
                                            {
                                                "Name": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_emite
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "DigitalSignatureAttachment": [
                                    {
                                        "ExternalReference": [
                                            {
                                                "URI": [
                                                    {
                                                        "TextContent": "IDSignature"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "AccountingSupplierParty": [
                            {
                                "Party": [
                                    {
                                        "PartyName": [
                                            {
                                                "Name": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_emite
                                                    }
                                                ]
                                            }
                                        ],
                                        "PostalAddress": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": "150122"
                                                    }
                                                ],
                                                "StreetName": [
                                                    {
                                                        "TextContent": cab[indice].calle_emite
                                                    }
                                                ],
                                                "CityName": [
                                                    {
                                                        "TextContent": cab[indice].departamento_emite
                                                    }
                                                ],
                                                "CountrySubentity": [
                                                    {
                                                        "TextContent": cab[indice].provincia_emite
                                                    }
                                                ],
                                                "District": [
                                                    {
                                                        "TextContent": cab[indice].distrito_emite
                                                    }
                                                ],
                                                "Country": [
                                                    {
                                                        "IdentificationCode": [
                                                            {
                                                                "IdentifierContent": "PE"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyTaxScheme": [
                                            {
                                                "RegistrationName": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_emite
                                                    }
                                                ],
                                                "CompanyID": [
                                                    {
                                                        "IdentifierContent": cab[indice].ruc_empresa_emite,
                                                        "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_emite,
                                                        "IdentificationSchemeNameText": "SUNAT:Identificador de Documento de Identidad",
                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                    }
                                                ],
                                                "RegistrationAddress": [
                                                    {
                                                        "AddressTypeCode": [
                                                            {
                                                                "CodeContent": "0001"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "TaxScheme": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": "-"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "AccountingCustomerParty": [
                            {
                                "Party": [
                                    {
                                        "PostalAddress": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": "150115"
                                                    }
                                                ],
                                                "StreetName": [
                                                    {
                                                        "TextContent": cab[indice].calle_receptora
                                                    }
                                                ],
                                                "CityName": [
                                                    {
                                                        "TextContent": cab[indice].departamento_receptora
                                                    }
                                                ],
                                                "CountrySubentity": [
                                                    {
                                                        "TextContent": cab[indice].provincia_receptora
                                                    }
                                                ],
                                                "District": [
                                                    {
                                                        "TextContent": cab[indice].distrito_receptora
                                                    }
                                                ],
                                                "Country": [
                                                    {
                                                        "IdentificationCode": [
                                                            {
                                                                "IdentifierContent": "PE"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyTaxScheme": [
                                            {
                                                "RegistrationName": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_receptora
                                                    }
                                                ],
                                                "CompanyID": [
                                                    {
                                                        "IdentifierContent": cab[indice].ruc_empresa_receptora,
                                                        "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_receptora,
                                                        "IdentificationSchemeNameText": "SUNAT:Identificador de Documento de Identidad",
                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                    }
                                                ],
                                                "RegistrationAddress": [
                                                    {
                                                        "AddressTypeCode": [
                                                            {
                                                                "CodeContent": "0001"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "TaxScheme": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": "-"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "Contact": [
                                            {
                                                "ElectronicMail": [
                                                    {
                                                        "TextContent": cab[indice].correo_receptora
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "PaymentMeans": [
                            {
                                "PaymentMeansCode": [
                                    {
                                        "CodeContent": "01"
                                    }
                                ],
                                "PaymentDueDate": [
                                    {
                                        "DateContent": cab[indice].fecha_vencimiento
                                    }
                                ]
                            }
                        ],
                        "TaxTotal": [
                            {
                                "TaxAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ],
                                "TaxSubtotal": [
                                    {
                                        "TaxableAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxCategory": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": "S",
                                                        "IdentificationSchemeIdentifier": "UN/ECE 5305",
                                                        "IdentificationSchemeNameText": "Tax Category Identifier",
                                                        "IdentificationSchemeAgencyNameText": "United Nations Economic Commission for Europe"
                                                    }
                                                ],
                                                "Percent": [
                                                    {
                                                        "NumericContent": 18
                                                    }
                                                ],
                                                "TaxScheme": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": "1000",
                                                                "IdentificationSchemeIdentifier": "UN/ECE 5153",
                                                                "IdentificationSchemeAgencyIdentifier": "6"
                                                            }
                                                        ],
                                                        "Name": [
                                                            {
                                                                "TextContent": "IGV"
                                                            }
                                                        ],
                                                        "TaxTypeCode": [
                                                            {
                                                                "CodeContent": "VAT"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "LegalMonetaryTotal": [
                            {
                                "LineExtensionAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ],
                                "TaxInclusiveAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ],
                                "PayableAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ]
                            }
                        ],
                        "InvoiceLine": InvoiceLine_aux
                    }
                ]
            }
            ///---- fin variable json

            /// guardando el servidor el archivo creado---

            $scope.loader_modal = true;
            console.log(cab[indice].nombreArchivo + ' : ' + cab[indice].idcab);
            //console.log(JSON.stringify(json_Facturacion))
            //return;

            generate_json_file(JSON.stringify(json_Facturacion), cab[indice].nombreArchivo, cab[indice].idcab)
            .then(function (res) {
                //$scope.loader_modal = false;
                //----pasamos al siguiente documento
                ejecutarConsulta((indice + 1));

                //---generando la impresion de la factura
                setTimeout(function () {
                    $scope.generarVistaPreliminar_Sunat($scope.objeto_parametros.id_TipoDocumento, $scope.objeto_parametros.Numero_Documento)
                }, 6000);

            }, function (error) {

                $scope.loader_modal = false;
                console.log(error)
                alert(error)
                //----pasamos al siguiente documento
                ejecutarConsulta((indice + 1));
            })
        }

        ejecutarConsulta(0);


    }

    var generate_json_file = function (json_Facturacion, nombreArchivo, idCab) {
        var q = $q.defer();
        Documentos_MasivosServices.GenerarArchivo_Json(json_Facturacion, nombreArchivo, idCab,0)
        .then(function (resultado) {
            q.resolve('success');
            console.log('resultado');
            console.log(resultado);
        }, function (eror) {
            q.reject(err);
            console.log(eror);
        })
        return q.promise;
    }

    var get_Json_Boleta_Electronica_1_1 = function (cab) {
        var acum = 1;
        var nroLetra = '';
        var x = 1;

        var IndiceGlobal = cab.length;

        var ejecutarConsulta = function (indice) {
            if (IndiceGlobal == indice) {
                return;
            }
            var InvoiceLine_aux = [];
            cab[indice].DETCONTENT.forEach(function (itemDet, indexDet) {

                InvoiceLine_aux.push({
                    "ID": [
                        {
                            "IdentifierContent": acum
                        }
                    ],
                    "Note": [
                        {
                            "TextContent": cab[indice].cod_unidad
                        }
                    ],
                    "InvoicedQuantity": [
                        {
                            "QuantityContent": itemDet.cantidad,
                            "QuantityUnitCode": itemDet.cod_unidad_sunat,
                            "QuantityUnitCodeListIdentifier": "UN/ECE rec 20",
                            "QuantityUnitCodeListAgencyNameText": "United Nations Economic Commission for Europe"
                        }
                    ],
                    "LineExtensionAmount": [
                        {
                            "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                        }
                    ],
                    "PricingReference": [
                        {
                            "AlternativeConditionPrice": [
                                {
                                    "PriceAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                        }
                                    ],
                                    "PriceTypeCode": [
                                        {
                                            "CodeContent": "01",
                                            "CodeListNameText": "SUNAT:Indicador de Tipo de Precio",
                                            "CodeListAgencyNameText": "PE:SUNAT",
                                            "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "TaxTotal": [
                        {
                            "TaxAmount": [
                                {
                                    "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                }
                            ],
                            "TaxSubtotal": [
                                {
                                    "TaxableAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                        }
                                    ],
                                    "TaxAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                        }
                                    ],
                                    "TaxCategory": [
                                        {
                                            "ID": [
                                                {
                                                    "IdentifierContent": "S",
                                                    "IdentificationSchemeIdentifier": "UN/ECE 5305",
                                                    "IdentificationSchemeNameText": "Tax Category Identifier",
                                                    "IdentificationSchemeAgencyNameText": "United Nations Economic Commission for Europe"
                                                }
                                            ],
                                            "TaxExemptionReasonCode": [
                                                {
                                                    "CodeContent": "10",
                                                    "CodeListAgencyNameText": "PE:SUNAT",
                                                    "CodeListNameText": "SUNAT:Codigo de Tipo de Afectación del IGV",
                                                    "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
                                                }
                                            ],
                                            "TaxScheme": [
                                                {
                                                    "ID": [
                                                        {
                                                            "IdentifierContent": "1000",
                                                            "IdentificationSchemeIdentifier": "UN/ECE 5153",
                                                            "IdentificationSchemeAgencyIdentifier": "6"
                                                        }
                                                    ],
                                                    "Name": [
                                                        {
                                                            "TextContent": "IGV"
                                                        }
                                                    ],
                                                    "TaxTypeCode": [
                                                        {
                                                            "CodeContent": "VAT"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "Item": [
                        {
                            "Description": [
                                {
                                    "TextContent": itemDet.nombre_producto
                                }
                            ],
                            "SellersItemIdentification": [
                                {
                                    "ID": [
                                        {
                                            "IdentifierContent": itemDet.codigo_producto
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "Price": [
                        {
                            "PriceAmount": [
                                {
                                    "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),
                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                }
                            ]
                        }
                    ]
                });

                acum = acum + 1;

            })

            nroLetra = NumeroALetras(cab[indice].monto_total);

            var json_Boletas = {
                "_D": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
                "_S": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
                "_B": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
                "_E": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
                "Invoice": [
                    {
                        "UBLVersionID": [
                            {
                                "IdentifierContent": "2.1"
                            }
                        ],
                        "CustomizationID": [
                            {
                                "IdentifierContent": "2.0"
                            }
                        ],
                        "ProfileID": [
                            {
                                "IdentifierContent": cab[indice].identificador,
                                "IdentificationSchemeNameText": "SUNAT:Identificador de Tipo de Operación",
                                "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo17"
                            }
                        ],
                        "ID": [
                            {
                                "IdentifierContent": cab[indice].nro_doc
                            }
                        ],
                        "IssueDate": [
                            {
                                "DateContent": cab[indice].fecha_emision
                            }
                        ],
                        "IssueTime": [
                            {
                                "DateTimeContent": cab[indice].hora_emision
                            }
                        ],
                        "InvoiceTypeCode": [
                            {
                                "CodeContent": cab[indice].tipo_doc_sunat,
                                "CodeListSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
                                "CodeListNameText": "SUNAT:Identificador de Tipo de Documento",
                                "CodeListAgencyNameText": "PE:SUNAT"
                            }
                        ],
                        "Note": [
                            {
                                "TextContent": nroLetra,
                                "LanguageLocaleIdentifier": "1000"
                            }
                        ],
                        "DocumentCurrencyCode": [
                            {
                                "CodeContent": cab[indice].tipo_moneda_sunat,
                                "CodeListIdentifier": "ISO 4217 Alpha",
                                "CodeListNameText": "Currency",
                                "CodeListAgencyNameText": "United Nations Economic Commission for Europe"
                            }
                        ],
                        "LineCountNumeric": [
                            {
                                "NumericContent": cab[indice].DETCONTENT.length
                            }
                        ],
                        "Signature": [
                            {
                                "ID": [
                                    {
                                        "IdentifierContent": "IDSignature"
                                    }
                                ],
                                "SignatoryParty": [
                                    {
                                        "PartyIdentification": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": cab[indice].ruc_empresa_emite
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyName": [
                                            {
                                                "Name": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_emite
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "DigitalSignatureAttachment": [
                                    {
                                        "ExternalReference": [
                                            {
                                                "URI": [
                                                    {
                                                        "TextContent": "IDSignature"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "AccountingSupplierParty": [
                            {
                                "Party": [
                                    {
                                        "PartyName": [
                                            {
                                                "Name": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_emite
                                                    }
                                                ]
                                            }
                                        ],
                                        "PostalAddress": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": "150122"
                                                    }
                                                ],
                                                "StreetName": [
                                                    {
                                                        "TextContent": cab[indice].calle_emite
                                                    }
                                                ],
                                                "CityName": [
                                                    {
                                                        "TextContent": cab[indice].departamento_emite
                                                    }
                                                ],
                                                "CountrySubentity": [
                                                    {
                                                        "TextContent": cab[indice].provincia_emite
                                                    }
                                                ],
                                                "District": [
                                                    {
                                                        "TextContent": cab[indice].distrito_emite
                                                    }
                                                ],
                                                "Country": [
                                                    {
                                                        "IdentificationCode": [
                                                            {
                                                                "IdentifierContent": "PE"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyTaxScheme": [
                                            {
                                                "RegistrationName": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_emite
                                                    }
                                                ],
                                                "CompanyID": [
                                                    {
                                                        "IdentifierContent": cab[indice].ruc_empresa_emite,
                                                        "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_emite,
                                                        "IdentificationSchemeNameText": "SUNAT:Identificador de Documento de Identidad",
                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                    }
                                                ],
                                                "RegistrationAddress": [
                                                    {
                                                        "AddressTypeCode": [
                                                            {
                                                                "CodeContent": "0001"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "TaxScheme": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": "-"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "AccountingCustomerParty": [
                            {
                                "Party": [
                                    {
                                        "PostalAddress": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": "150115"
                                                    }
                                                ],
                                                "StreetName": [
                                                    {
                                                        "TextContent": cab[indice].calle_receptora
                                                    }
                                                ]
                                            }
                                        ],
                                        "PartyTaxScheme": [
                                            {
                                                "RegistrationName": [
                                                    {
                                                        "TextContent": cab[indice].razon_social_receptora
                                                    }
                                                ],
                                                "CompanyID": [
                                                    {
                                                        "IdentifierContent": cab[indice].ruc_empresa_receptora,
                                                        "IdentificationSchemeIdentifier": "1",
                                                        "IdentificationSchemeNameText": "SUNAT:Identificador de Documento de Identidad",
                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                    }
                                                ],
                                                "RegistrationAddress": [
                                                    {
                                                        "AddressTypeCode": [
                                                            {
                                                                "CodeContent": "0001"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "TaxScheme": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": "-"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "Contact": [
                                            {
                                                "ElectronicMail": [
                                                    {
                                                        "TextContent": cab[indice].correo_receptora
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "PaymentMeans": [
                            {
                                "PaymentMeansCode": [
                                    {
                                        "CodeContent": "01"
                                    }
                                ],
                                "PaymentDueDate": [
                                    {
                                        "DateContent": cab[indice].fecha_vencimiento
                                    }
                                ]
                            }
                        ],
                        "TaxTotal": [
                            {
                                "TaxAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ],
                                "TaxSubtotal": [
                                    {
                                        "TaxableAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_total_inafecto * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxCategory": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": "S",
                                                        "IdentificationSchemeIdentifier": "UN/ECE 5305",
                                                        "IdentificationSchemeNameText": "Tax Category Identifier",
                                                        "IdentificationSchemeAgencyNameText": "United Nations Economic Commission for Europe"
                                                    }
                                                ],
                                                "Percent": [
                                                    {
                                                        "NumericContent": 18
                                                    }
                                                ],
                                                "TaxScheme": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": "1000",
                                                                "IdentificationSchemeIdentifier": "UN/ECE 5153",
                                                                "IdentificationSchemeAgencyIdentifier": "6"
                                                            }
                                                        ],
                                                        "Name": [
                                                            {
                                                                "TextContent": "IGV"
                                                            }
                                                        ],
                                                        "TaxTypeCode": [
                                                            {
                                                                "CodeContent": "VAT"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "LegalMonetaryTotal": [
                            {
                                "LineExtensionAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ],
                                "TaxInclusiveAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ],
                                "PayableAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                    }
                                ]
                            }
                        ],
                        "InvoiceLine": InvoiceLine_aux

                    }
                ]
            }

            ///---- fin variable json Boleta
            /// guardando el servidor el archivo creado---

            $scope.loader_modal = true;
            console.log(cab[indice].nombreArchivo + ' : ' + cab[indice].idcab);
            generate_json_file(JSON.stringify(json_Boletas), cab[indice].nombreArchivo, cab[indice].idcab)
            .then(function (res) {
                //$scope.loader_modal = false;
                //----pasamos la siguiente documento
                ejecutarConsulta((indice + 1));
                
                //---generando la impresion de la factura
                setTimeout(function () {
                    $scope.generarVistaPreliminar_Sunat($scope.objeto_parametros.id_TipoDocumento, $scope.objeto_parametros.Numero_Documento)
                }, 6000);

            }, function (error) {
                $scope.loader_modal = false;
                console.log(error);
                alert(error);
                //----pasamos la siguiente documento
                ejecutarConsulta((indice + 1));
            })
        }

        ejecutarConsulta(0);
    }


    $scope.AbrirModal_Pagos = function () {
        $scope.clean_Pagos();
        $('#modalPagos').modal('show');
    };

    $scope.objeto_parametros_pagos = {
        nroPedido: '',
        codRef: '',
        totalpago: '0',
        pagoCueta: '0',
        Saldo: '0',
        check_cuenta: '0',
        id_formaPago: '0',
        id_banco: '0',
        fechaOperacion: '0',
        nroOperacion: ''
    };

    $scope.disabledDeposito = 'disabledContent';
    $scope.disabledCuenta = 'disabledContent';

    $scope.clean_Pagos = function () {
        var rb_efectivo = document.getElementById('rb_efectivo');
        var chk_pago = document.getElementById('chk_pago');

        $scope.disabledDeposito = 'disabledContent';
        $scope.disabledCuenta = 'disabledContent';

        $scope.objeto_parametros_pagos.nroPedido = $scope.objeto_parametros.Numero_Pedido;
        $scope.objeto_parametros_pagos.codRef = '';
        $scope.objeto_parametros_pagos.totalpago = $scope.Total_G;
        $scope.objeto_parametros_pagos.pagoCueta = $scope.Total_G;
        $scope.objeto_parametros_pagos.Saldo = '0';
        $scope.objeto_parametros_pagos.check_cuenta = '0';
        $scope.objeto_parametros_pagos.id_formaPago = '0';
        $scope.objeto_parametros_pagos.id_banco = '0';
        $scope.objeto_parametros_pagos.fechaOperacion = '';
        $scope.objeto_parametros_pagos.nroOperacion = '';
        $timeout(function () {
            rb_efectivo.checked = true;
            chk_pago.checked = true;
            $('#cbo_banco').val("0").trigger('change.select2');
        }, 300);
        $scope.Calculo_Saldo();
    };

    $scope.change_habilitarPagoCuenta = function (opcion) {
        var chk_pago = document.getElementById('chk_pago');

        if (chk_pago.checked === true) {
            $scope.disabledCuenta = 'disabledContent';
        } else {
            $scope.disabledCuenta = '';
            $timeout(function () {
                $('#txt_pagoCuenta').focus().select();
            });
        }
    };

    $scope.change_habilitarDeposito = function () {
        var rb_efectivo = document.getElementById('rb_efectivo');
        var rb_deposito = document.getElementById('rb_deposito');

        if (rb_efectivo.checked === true) {
            $scope.disabledDeposito = 'disabledContent';
        }
        if (rb_deposito.checked === true) {
            $scope.disabledDeposito = '';
        }

        $timeout(function () {
            $('#cbo_banco').val("0").trigger('change.select2');
        }, 300);
    };


    $scope.Calculo_Saldo = function () {
        var saldo = $scope.objeto_parametros_pagos.totalpago - $scope.objeto_parametros_pagos.pagoCueta;
        $scope.objeto_parametros_pagos.Saldo = parseFloat(Math.round(saldo * 100) / 100).toFixed(2);
        return true;
    };

    $scope.GuardarPago = function () {

        var rb_deposito = document.getElementById('rb_deposito');
        if (isNaN($scope.objeto_parametros_pagos.pagoCueta) === true) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese un Valor correcto, verifique', 'error', '#ff6849', 1500);
            $timeout(function () {
                $('#txt_pagoCuenta').focus().select();
            });
            return;
        } else {
            if ($scope.objeto_parametros_pagos.pagoCueta === 0 || $scope.objeto_parametros_pagos.pagoCueta === '0' || $scope.objeto_parametros_pagos.pagoCueta === null || $scope.objeto_parametros_pagos.pagoCueta === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Pago a Cuenta', 'error', '#ff6849', 1500);
                return;
            } else {
                if ($scope.objeto_parametros_pagos.pagoCueta < 0) {
                    auxiliarServices.NotificationMessage('Sistemas', 'El pago a Cuenta debe de ser mayor a Cero {0} ', 'error', '#ff6849', 1500);
                    return;
                }
            }
        }

        if (parseFloat($scope.objeto_parametros_pagos.pagoCueta) > parseFloat($scope.objeto_parametros_pagos.totalpago)) {
            auxiliarServices.NotificationMessage('Sistemas', 'El Pago a Cuenta supera el Importe Total, verifique', 'error', '#ff6849', 2000);
            $timeout(function () {
                $('#txt_pagoCuenta').focus().select();
            });
            return;
        }

        $scope.objeto_parametros_pagos.id_formaPago = '0';
        if (rb_deposito.checked === true) {
            $scope.objeto_parametros_pagos.id_formaPago = '0';
            if ($scope.objeto_parametros_pagos.id_banco === null || $scope.objeto_parametros_pagos.id_banco === undefined || $scope.objeto_parametros_pagos.id_banco === 0 || $scope.objeto_parametros_pagos.id_banco === '0') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese seleccione el Banco', 'error', '#ff6849', 1500);
                return false;
            }
            if ($scope.objeto_parametros_pagos.fechaOperacion === 0 || $scope.objeto_parametros_pagos.fechaOperacion === '0' || $scope.objeto_parametros_pagos.fechaOperacion === null || $scope.objeto_parametros_pagos.fechaOperacion === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha de la Operacion', 'error', '#ff6849', 1500);
                return false;
            }
            if ($scope.objeto_parametros_pagos.nroOperacion === 0 || $scope.objeto_parametros_pagos.nroOperacion === '0' || $scope.objeto_parametros_pagos.nroOperacion === null || $scope.objeto_parametros_pagos.nroOperacion === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nro de Operacion', 'error', '#ff6849', 1500);
                return false;
            }
        }
           
        $scope.objeto_parametros_pagos.codRef = getCodUniq();
        
        var params = {
            title: "Desea continuar ?",
            text: 'Esta por generar un Pago, verifique. Una vez enviado no hay marcha atras.',
            type: 'confirmationAlert'
        };

        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res === true) {

                $scope.loader_modal_ayuda = true;
                PedidosServices.set_Generando_Pagos($scope.objeto_parametros_pagos)
                    .then(function (data) {
                        $scope.loader_modal_ayuda = false;
                        if (data === "OK") {

                            $('#modalPagos').modal('hide');
                            $scope.Listando_InformacionPedidos();

                            $timeout(function () {
                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Pago realizado correctamente..!'
                                };
                                auxiliarServices.initSweetAlert(params).then(function (res) {

                                });

                            }, 500);
                        } else {
                            $timeout(function () {
                                let paramsErr = {
                                    type: 'error',
                                    title: 'Error !',
                                    text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                                };
                                auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                                });

                                console.log(err);
                            }, 500);
                        }



                    }, function (error) {
                        $timeout(function () {
                            let paramsErr = {
                                type: 'error',
                                title: 'Error !',
                                text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                            };
                            auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                            });
                            $scope.loader_modal = false;
                            console.log(err);
                        }, 500);
                    });
            } 
        });
    };

    $scope.AbrirModal_Mant_Clientes = function () {
        $scope.clean_MantCliente();
        $('#modalManClientes').modal('show');
    };

    $scope.objeto_parametros_cliente = {
        id_cliente: '0',
        id_empresa: '1',
        codigoInterno_Cliente: '',
        id_TipoCliente: '0',
        id_DocumentoIdentidad: '0',
        nroDoc_Cliente: '',
        nombres_Cliente: '',
        id_departamento:'0',
        id_distrito: '0',
        id_Provincia: '0',
        direccion_referencia: '',
        id_PersonalVendedor: '0',
        estado: '1',
        usuario_creacion: '',
        cond_facturacion: '0'
    };

    $scope.clean_MantCliente = function () {

        $scope.objeto_parametros_cliente.id_cliente = '0';
        $scope.objeto_parametros_cliente.id_empresa = '1';
        $scope.objeto_parametros_cliente.codigoInterno_Cliente = '';
        $scope.objeto_parametros_cliente.id_TipoCliente = '0';
        $scope.objeto_parametros_cliente.id_DocumentoIdentidad = '0';
        $scope.objeto_parametros_cliente.nroDoc_Cliente = '';
        $scope.objeto_parametros_cliente.nombres_Cliente = '';
        $scope.objeto_parametros_cliente.id_departamento = '0';
        $scope.objeto_parametros_cliente.id_distrito = '0';
        $scope.objeto_parametros_cliente.id_Provincia = '0';
        $scope.objeto_parametros_cliente.direccion_referencia = '';
        $scope.objeto_parametros_cliente.id_PersonalVendedor = '0';
        $scope.objeto_parametros_cliente.estado = '1';
        $scope.objeto_parametros_cliente.usuario_creacion = auxiliarServices.getUserId();
        $scope.objeto_parametros_cliente.cond_facturacion = '0';

        $timeout(function () {
            $('#cbo_tipocliente').val("0").trigger('change.select2');
            $('#cbo_departamento').val("0").trigger('change.select2');
            $('#cbo_provincia').val("0").trigger('change.select2');
            $('#cbo_distrito').val("0").trigger('change.select2');
            $('#cbo_personalVendedor').val("0").trigger('change.select2');
            $('#cbo_condFacturacion').val("0").trigger('change.select2');
            $('#cbo_tipoDoc').val("0").trigger('change.select2');
        }, 300);
    };

    $scope.GuardarCliente = function () {
        if ($scope.objeto_parametros_cliente.id_TipoCliente === 0 || $scope.objeto_parametros_cliente.id_TipoCliente === '0' || $scope.objeto_parametros_cliente.id_TipoCliente === null || $scope.objeto_parametros_cliente.id_TipoCliente === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Tipo de Cliente', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.id_DocumentoIdentidad == 0 || $scope.objeto_parametros_cliente.id_DocumentoIdentidad == '0' || $scope.objeto_parametros_cliente.id_DocumentoIdentidad == null || $scope.objeto_parametros_cliente.id_DocumentoIdentidad == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Documento de Identidad', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.nroDoc_Cliente === 0 || $scope.objeto_parametros_cliente.nroDoc_Cliente === '0' || $scope.objeto_parametros_cliente.nroDoc_Cliente === null || $scope.objeto_parametros_cliente.nroDoc_Cliente === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el nro de Documento', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.nombres_Cliente === null || $scope.objeto_parametros_cliente.nombres_Cliente === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese los datos del Cliente', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.id_departamento == 0 || $scope.objeto_parametros_cliente.id_departamento == '0' || $scope.objeto_parametros_cliente.id_departamento == null || $scope.objeto_parametros_cliente.id_departamento == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Departamento', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.id_Provincia === 0 || $scope.objeto_parametros_cliente.id_Provincia === '0' || $scope.objeto_parametros_cliente.id_Provincia === null || $scope.objeto_parametros_cliente.id_Provincia === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Provincia', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.id_distrito === 0 || $scope.objeto_parametros_cliente.id_distrito === '0' || $scope.objeto_parametros_cliente.id_distrito === null || $scope.objeto_parametros_cliente.id_distrito === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Distrito', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.objeto_parametros_cliente.direccion_referencia === null || $scope.objeto_parametros_cliente.direccion_referencia === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Dirección', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.objeto_parametros_cliente.id_PersonalVendedor === 0 || $scope.objeto_parametros_cliente.id_PersonalVendedor === '0' || $scope.objeto_parametros_cliente.id_PersonalVendedor === null || $scope.objeto_parametros_cliente.id_PersonalVendedor === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Vendedor', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.cond_facturacion === 0 || $scope.objeto_parametros_cliente.cond_facturacion === '0' || $scope.objeto_parametros_cliente.cond_facturacion === null || $scope.objeto_parametros_cliente.cond_facturacion === '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Condicion de Facturación', 'error', '#ff6849', 1500);
            return;
        }

        $scope.loader_modal_ayuda = true;
        PedidosServices.get_ValidandoExistencia_Cliente($scope.objeto_parametros_cliente.nroDoc_Cliente)
            .then(function (data) {
                $scope.loader_modal_ayuda = false;
                var indicador = false;
                for (var i = 0; i < data.length; i++) {
                    indicador = true;
                    break;
                }
                if (indicador === true) {
                    auxiliarServices.NotificationMessage('Sistemas', 'El nro de Documento ya se encuentra Registrado en el sistema, verifique..', 'error', '#ff6849', 1800);
                    return;
                }

                $scope.loader_modal_ayuda = true;
                $scope.objeto_parametros_cliente.codigoInterno_Cliente = getCodUniq();

                PedidosServices.set_GuardandoCliente($scope.objeto_parametros_cliente)
                    .then(function (data) {
                        $scope.loader_modal_ayuda = false;
                        $scope.objeto_parametros.codigoInterno_Suministro = data.codigoInterno_Cliente;
                        $scope.objeto_parametros.nrodoc_cliente = data.nroDoc_Cliente;
                        $scope.objeto_parametros.nombres_Cliente = data.nombres_Cliente + '  -  ' + data.direccion_referencia;
                        $scope.objeto_parametros.codigoInterno_Cliente = data.codigoInterno_Cliente;
                        $scope.objeto_parametros.direccion_Pedido_Cab = data.direccion_referencia;
                        $scope.objeto_parametros.id_PersonalVendedor = String(data.id_PersonalVendedor);

                        $('#modalManClientes').modal('hide');
                        $timeout(function () {
                            $('#cbo_vendedor').val(String(data.id_PersonalVendedor)).trigger('change.select2');
                        }, 200);

                    }, function (error) {
                        console.log(error);
                    });


            }, function (error) {
                $timeout(function () {
                    let paramsErr = {
                        type: 'error',
                        title: 'Error !',
                        text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                    };
                    auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                    });
                    $scope.loader_modal = false;
                    console.log(err);
                }, 500);
            });


    };

    $scope.generarDocuImprimir = function () {
        Documentos_MasivosServices.ImprimirDocumentos_individual($scope.objeto_parametros.Numero_Documento, $scope.objeto_parametros.id_TipoDocumento)
            .then(function (res) {
                if (res.length === 0) {
                    return;
                }
                var cabContent = [];

                var idCab = null;
                var detConent = res;
                console.log(res);
                var indexAux = -1;
                res.forEach(function (item, index) {
                    if (idCab !== item.IDCAB) {
                        indexAux++;
                        cabContent.push({
                            ID: indexAux,
                            IDCAB: item.IDCAB,
                            FECHA: item.FECHA,
                            PAGO: item.PAGO,
                            FECHAVEN: item.FECHAVEN,
                            EMPRESA: item.EMPRESA,
                            DIRECCION: item.DIRECCION,
                            RUC: item.RUC,
                            GUIA: item.GUIA,
                            OBSERVACION: item.OBSERVACION,
                            DETCONTENT: []
                        });
                        detConent.forEach(function (itemdet) {
                            if (itemdet.IDCAB === cabContent[indexAux].IDCAB) {
                                cabContent[indexAux].DETCONTENT.push(itemdet);
                            }
                        });
                    }
                    idCab = item.IDCAB;
                });
                generarPDFMultiple(parseInt($scope.objeto_parametros.id_TipoDocumento), cabContent);


            }, function (err) {
                console.log(err);
            });
    };

    $scope.generarVistaPreliminar = function (TipoDoc, NroDocumento) {
        Documentos_MasivosServices.ImprimirDocumentos_individual(NroDocumento, TipoDoc)
            .then(function (res) {
                if (res.length === 0) {
                    return;
                }
                var cabContent = [];

                var idCab = null;
                var detConent = res;
                console.log(res);
                var indexAux = -1;
                res.forEach(function (item, index) {
                    if (idCab !== item.IDCAB) {
                        indexAux++;
                        cabContent.push({
                            ID: indexAux,
                            IDCAB: item.IDCAB,
                            FECHA: item.FECHA,
                            PAGO: item.PAGO,
                            FECHAVEN: item.FECHAVEN,
                            EMPRESA: item.EMPRESA,
                            DIRECCION: item.DIRECCION,
                            RUC: item.RUC,
                            GUIA: item.GUIA,
                            OBSERVACION: item.OBSERVACION,
                            DETCONTENT: []
                        });
                        detConent.forEach(function (itemdet) {
                            if (itemdet.IDCAB === cabContent[indexAux].IDCAB) {
                                cabContent[indexAux].DETCONTENT.push(itemdet);
                            }
                        });
                    }
                    idCab = item.IDCAB;
                });

                generarPDFMultiple_Preliminar(parseInt(TipoDoc), cabContent);


            }, function (err) {
                console.log(err);
            });
    };

    generarPDFMultiple_Preliminar = function (TipoDoc, cab) {
        if (TipoDoc === 1) {
            getPdfFacturacion(cab);
        } else if (TipoDoc === 2) {
            getPdfBoleta(cab);
        } else if (TipoDoc === 3) {
            getPdfGuiaRemision(cab);
        }
    };

    generarPDFMultiple = function (TipoDoc, cab) {
        if (TipoDoc === 1) {
            getPdfFacturacion(cab);
        } else if (TipoDoc === 2) {
            getPdfBoleta(cab);
        } else if (TipoDoc === 3) {
            getPdfGuiaRemision(cab);
        }
    };

    var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    var getPdfFacturacion = function (cab) {
        var doc = new jsPDF('p', 'pt', 'letter');
        var nroGuia = "";

        cab.forEach(function (item, index) {

            var x = 130;
            var y = 60;
            // CABECERA
            doc.setFontSize(10);
            doc.setFont("courier");
            doc.setFontType("normal");
            // 
            var fechaNow = item.FECHAVEN;
            var diaNow = fechaNow.split("/")[0];
            var mesNow = meses[parseInt(fechaNow.split("/")[1]) - 1];
            var añoNow = fechaNow.split("/")[2];
            nroGuia = item.GUIA;
            //doc.text(y + 370, x - 30, item.GUIA);
            doc.setFontSize(9);
            //
            var splitDireccion = doc.splitTextToSize(item.DIRECCION, 310);

            var tamaño = splitDireccion.length;


            doc.text(y - 25, x - 10, diaNow);
            doc.text(y + 35, x - 10, mesNow);
            doc.text(y + 140, x - 10, añoNow);
            doc.text(y + 130, x, 'Cond Pag: ' + item.PAGO)
            //doc.text(y + 280, x, 'Fecha Ven : ' + item.FECHA)
            doc.text(y + 10, x + 10, item.EMPRESA);
            if (tamaño >= 2) {
                doc.text(y + 10, x + 27, splitDireccion);
            } else {
                doc.text(y + 10, x + 30, splitDireccion);
            }
            doc.text(y + 375, x + 10, item.RUC);
            doc.text(y + 425, x + 30, item.OBSERVACION);

            // FIN DE CABECERA
            // AJUSTAMOS LOS PARAMETROS X PARA SEGUIR EN EL DETALLE
            x += 80;
            y -= 30;
            // DETALLE
            var totalDet = 0;
            var igvDet = 0;
            var totalPagar = 0;
            var nroLetra;
            doc.setFontSize(9);
            item.DETCONTENT.forEach(function (itemDet, indexDet) {
                var cantidad = parseFloat(itemDet.CANTIDAD).toFixed(2);
                var precio = parseFloat(itemDet.PRECIO).toFixed(2);
                var importe = parseFloat(itemDet.IMPORTE).toFixed(2);

                var splitTitle = doc.splitTextToSize(itemDet.NOMBRE_PRODUCTO, 330);

                //doc.text(y + 50, x, itemDet.UNIDAD)
                doc.setFontSize(8);
                doc.text(y + 65, x - 10, splitTitle);
                doc.setFontSize(9);
                doc.text(y, x - 10, String(cantidad));
                doc.text(y + 390, x - 10, String(precio));
                doc.text(y + 465, x - 10, String(importe));

                var espacio = splitTitle.length;
                if (espacio >= 2) {
                    x += 18;
                } else {
                    x += 11;
                }

                totalDet += parseFloat(itemDet.IMPORTE);
            });
            //igvDet = parseFloat(totalDet) * 0.18;
            //totalPagar = parseFloat(totalDet) + parseFloat(igvDet);
            //nroLetra = NumeroALetras(totalPagar);
            //// FORMATEAMOS TOTALES            
            //totalDet = auxiliarServices.formatearNumero(totalDet, 2);
            //igvDet = auxiliarServices.formatearNumero(igvDet, 2);
            //totalPagar = auxiliarServices.formatearNumero(totalPagar, 2);

            //// FORMATEAMOS TOTALES            
            //totalDet = auxiliarServices.formatearNumero(totalDet, 2);
            //igvDet = auxiliarServices.formatearNumero(igvDet, 2);
            //totalPagar = auxiliarServices.formatearNumero(totalPagar, 2);
            //// FIN DE DETALLE

            // FORMATEAMOS TOTALES  
            /*
            totalPagar = parseFloat(totalDet);
            igvDet = parseFloat(totalDet) * 0.18;
            totalDet = parseFloat(totalDet) - parseFloat(igvDet);
    
    
            totalDet = auxiliarServices.formatearNumero(totalDet, 2);
            igvDet = auxiliarServices.formatearNumero(igvDet, 2);
            totalPagar = auxiliarServices.formatearNumero(totalPagar, 2);
            */
            doc.setFontSize(9);

            totalPagar = totalDet;

            totalDet = totalDet / 1.18;
            totalDet = auxiliarServices.formatearNumero(totalDet, 2);

            igvDet = totalPagar / 1.18 * 0.18;
            igvDet = auxiliarServices.formatearNumero(igvDet, 2);

            nroLetra = NumeroALetras(totalPagar);
            totalPagar = auxiliarServices.formatearNumero(totalPagar, 2);

            // FIN DE DETALLE

            // FOOTER
            x = 330;
            y = 100;
            doc.text(y, x, nroLetra);
            doc.text(y + 400, x + 30, String(totalDet));
            doc.text(y + 340, x + 50, String("18%"));
            doc.text(y + 400, x + 50, String(igvDet));
            doc.text(y + 400, x + 70, String(totalPagar));
            // FIN DE FOOTER            
            if (index !== cab.length - 1) {
                doc.addPage();
            }
            // RESET PARAMS
            x = 100;
            y = 130;
        });
        doc.output('dataurlnewwindow');
        doc.output('save', nroGuia + '.pdf');
    };

    var getPdfBoleta = function (cab) {


        var doc = new jsPDF('p', 'pt', 'letter');
        var nroGuia = "";

        cab.forEach(function (item, index) {

            var x = 130;
            var y = 60;
            // CABECERA
            doc.setFont("courier");
            doc.setFontType("normal");
            //doc.setTextColor(40);
            // 
            var fechaNow = auxiliarServices.getDateNow();
            nroGuia = item.GUIA;
            //doc.text(y + 370, x - 30, item.GUIA);
            var splitDireccion = doc.splitTextToSize(item.DIRECCION, 310);
            var tamaño = splitDireccion.length;
            doc.setFontSize(9);
            doc.text(y + 18, x + 4, item.EMPRESA);
            if (tamaño >= 2) {
                doc.text(y + 18, x + 21, splitDireccion);
            } else {
                doc.text(y + 18, x + 24, splitDireccion);
            }
            doc.text(y + 400, x + 4, item.FECHAVEN);
            doc.text(y + 400, x + 24, item.RUC);




            // FIN DE CABECERA
            // AJUSTAMOS LOS PARAMETROS X PARA SEGUIR EN EL DETALLE
            x += 60;
            y -= 30;
            // DETALLE
            var totalDet = 0;
            var igvDet = 0;
            var totalPagar = 0;
            var nroLetra;
            item.DETCONTENT.forEach(function (itemDet, indexDet) {
                var cantidad = parseFloat(itemDet.CANTIDAD).toFixed(2);
                var precio = parseFloat(itemDet.PRECIO).toFixed(2);
                var importe = parseFloat(itemDet.IMPORTE).toFixed(2);

                var splitTitle = doc.splitTextToSize(itemDet.NOMBRE_PRODUCTO, 350);

                doc.text(y, x + 10, String(cantidad));
                //doc.text(y + 50, x, itemDet.UNIDAD)
                doc.setFontSize(8);
                doc.text(y + 70, x + 10, splitTitle);
                doc.setFontSize(9);
                doc.text(y + 395, x + 10, String(precio));
                doc.text(y + 465, x + 10, String(importe));
                var espacio = splitTitle.length;
                if (espacio >= 2) {
                    x += 18;
                } else {
                    x += 11;
                }

                totalDet += parseFloat(itemDet.IMPORTE);
            });

            totalPagar = parseFloat(totalDet);
            igvDet = parseFloat(totalDet) * 0.18;
            totalDet = parseFloat(totalDet) - parseFloat(igvDet);

            totalDet = auxiliarServices.formatearNumero(totalDet, 2);
            igvDet = auxiliarServices.formatearNumero(igvDet, 2);
            totalPagar = auxiliarServices.formatearNumero(totalPagar, 2);
            nroLetra = NumeroALetras(totalPagar);
            // FIN DE DETALLE

            // FOOTER
            x = 330;
            y = 100;
            //doc.text(y + 400, x + 30, String(totalDet));
            //doc.text(y + 400, x + 50, String(igvDet));
            doc.text(y + 400, x + 60, String(totalPagar));
            // FIN DE FOOTER            
            if (index !== cab.length - 1) {
                doc.addPage();
            }

            // RESET PARAMS
            x = 100;
            y = 130;
        });
        doc.output('dataurlnewwindow');
        doc.output('save', nroGuia + '.pdf');
    };

    var getPdfGuiaRemision = function (cab) {
        var doc = new jsPDF('p', 'pt', 'letter');
        var nroGuia = "";
        cab.forEach(function (item, index) {

            var x = 100;
            var y = 60;
            // CABECERA
            doc.setFontSize(9);
            doc.setFont("courier");
            doc.setFontType("normal");
            //doc.setTextColor(40);
            // 
            var fechaNow = auxiliarServices.getDateNow();
            nroGuia = item.GUIA;

            var splitDireccion = doc.splitTextToSize(item.DIRECCION, 310);

            var tamaño = splitDireccion.length;
            //doc.text(y + 130, x, 'Cond Pag: ' + item.PAGO)
            //doc.text(y + 280, x, 'Fecha Ven : ' + item.FECHA)
            doc.text(y + 10, x + 13, item.EMPRESA);
            //doc.text(y + 50, x + 43, item.DIRECCION)
            if (tamaño >= 2) {
                doc.text(y + 50, x + 23, splitDireccion);
            } else {
                doc.text(y + 50, x + 27, splitDireccion);
            }
            //doc.text(y + 50, x + 43, "Av. La Cultura N° 701");
            //doc.text(y + 10, x + 59, String(item.Numero_Documento));
            doc.text(y + 420, x + 29, item.FECHAVEN);
            doc.text(y + 370, x + 43, item.FECHAVEN);
            doc.text(y + 10, x + 59, item.RUC);
            //doc.text(y + 300, x + 59, "Salida de Notas");
            //doc.text(y + 410, x + 59, item.RUC);

            //doc.text(y + 280, x + 39, item.GUIA)
            //doc.text(y + 370, x + 14, item.GUIA);

            //var splitTitle = doc.splitTextToSize("JTjhxtgjhugjhgfjhfthjfhfhfhgfhgfhgfhfhfhgfhgfh hhhhhhhhhh", 180);
            //doc.text(y + 320, x + 14, splitTitle);
            // FIN DE CABECERA
            // AJUSTAMOS LOS PARAMETROS X PARA SEGUIR EN EL DETALLE
            x += 158;
            y -= 30;
            // DETALLE
            var totalDet = 0;
            var igvDet = 0;
            var totalPagar = 0;
            var nroLetra;

            item.DETCONTENT.forEach(function (itemDet, indexDet) {
                var cantidad = parseFloat(itemDet.CANTIDAD).toFixed(2);
                var precio = parseFloat(itemDet.PRECIO).toFixed(2);
                var importe = parseFloat(itemDet.IMPORTE).toFixed(2);

                var splitTitle = doc.splitTextToSize(itemDet.NOMBRE_PRODUCTO, 420);
                var itemIndex = indexDet + 1;

                doc.text(y + 1, x, String(itemIndex));
                doc.text(y + 30, x, String(cantidad));
                doc.text(y + 83, x, itemDet.UNIDAD);
                doc.setFontSize(8);
                doc.text(y + 140, x, splitTitle);
                //doc.text(y + 375, x, precio);
                //doc.text(y + 465, x, importe);
                var espacio = splitTitle.length;
                if (espacio >= 2) {
                    x += 18;
                } else {
                    x += 11;
                }

                totalDet += parseFloat(itemDet.IMPORTE);
            });
            doc.setFontSize(9);
            igvDet = parseFloat(totalDet) * 0.18;
            totalPagar = parseFloat(totalDet) + parseFloat(igvDet);
            nroLetra = NumeroALetras(totalPagar);
            // FORMATEAMOS TOTALES            
            totalDet = auxiliarServices.formatearNumero(totalDet, 2);
            igvDet = auxiliarServices.formatearNumero(igvDet, 2);
            totalPagar = auxiliarServices.formatearNumero(totalPagar, 2);
            // FIN DE DETALLE

            // FOOTER
            x = 330;
            y = 100;
            //doc.text(y, x, nroLetra);
            //doc.text(y + 400, x + 30, String(totalDet));
            //doc.text(y + 400, x + 50, String(igvDet));
            //doc.text(y + 400, x + 70, String(totalPagar));
            // FIN DE FOOTER            
            if (index !== cab.length - 1) {
                doc.addPage();
            }

            // RESET PARAMS
            x = 100;
            y = 130;
        });
        doc.output('dataurlnewwindow');
        doc.output('save', nroGuia + '.pdf');
    };

    $scope.Rechazar_Pedido = function (obj) {
   
        if (auxiliarServices.getAnularDoc() === 1) {
            if (parseInt(obj.estado) === 27 || parseInt(obj.estado) === 12) {
                return;
            }

            var params = {
                title: "Desea continuar ?",
                text: 'Esta por Rechazar el Pedido.',
                type: 'confirmationAlert'
            };

            auxiliarServices.initSweetAlert(params).then(function (res) {
                if (res === true) {
                    $scope.loaderfiltros = true;
                    PedidosServices.set_aprobar_Pedido(obj.Numero_Pedido, obj.id_TipoDocumento, auxiliarServices.getUserId(),12)
                        .then(function (data) {
                            $scope.loaderfiltros = false;
                            if (data === "OK") {
                                // cambiando de estado
                                var index = $scope.Lista_DataCabecera.indexOf(obj);
                                $scope.Lista_DataCabecera.splice(index, 1);                                
                                //$scope.Lista_DataCabecera[index].estado = 12;


                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Se rechazó el Pedido Correctamente. !'
                                };
                                auxiliarServices.initSweetAlert(params).then(function (res) {

                                });

                            } else {
                                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                                alert(data);
                            }
                        }, function (error) {
                            $scope.loaderfiltros = false;
                            console.log(error);
                        });
                }
            });
        } else {
            auxiliarServices.NotificationMessage('Sistemas', 'No tienes permiso para rechazar el pedido', 'error', '#ff6849', 2000);
        }

    };



    $scope.Aprobar_Pedido = function (obj) {
   
        if (auxiliarServices.getAnularDoc() === 1) {
            if (parseInt(obj.estado) === 27 || parseInt(obj.estado) === 12) {
                return;
            }

            var params = {
                title: "Desea continuar ?",
                text: 'Esta por Aprobar el Pedido.',
                type: 'confirmationAlert'
            };

            auxiliarServices.initSweetAlert(params).then(function (res) {
                if (res === true) {
                    $scope.loaderfiltros = true;
                    PedidosServices.set_aprobar_Pedido(obj.Numero_Pedido, obj.id_TipoDocumento, auxiliarServices.getUserId(),6)
                        .then(function (data) {
                            $scope.loaderfiltros = false;
                            if (data === "OK") {
                                // cambiando de estado
                                var index = $scope.Lista_DataCabecera.indexOf(obj);
                                $scope.Lista_DataCabecera.splice(index, 1);                                
                                //$scope.Lista_DataCabecera[index].estado = 12;


                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Se aprobó el Pedido Correctamente. !'
                                };
                                auxiliarServices.initSweetAlert(params).then(function (res) {

                                });

                            } else {
                                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                                alert(data);
                            }
                        }, function (error) {
                            $scope.loaderfiltros = false;
                            console.log(error);
                        });
                }
            });
        } else {
            auxiliarServices.NotificationMessage('Sistemas', 'No tienes permiso para rechazar el pedido', 'error', '#ff6849', 2000);
        }

    };

    $scope.Lista_SaldoPendiente = [];
    $scope.AbrirModal_PagosPendientes = function (obj_data) {
        $('#modalPagos').modal('show');
        ///---obteniendo el saldoPendiente del pedido
        $scope.loader_modal_ayuda = true;
        PedidosServices.get_SaldoCuenta_Pedido(obj_data.id_Pedido_Cab)
            .then(function (data) {
                $scope.loader_modal_ayuda = false;
                $scope.objeto_parametros.Numero_Pedido = obj_data.Numero_Pedido;
                $scope.Total_G = 0;
                for (var i = 0; i < data.length; i++) {
                    $scope.objeto_parametros.Numero_Pedido = obj_data.Numero_Pedido;
                    $scope.Total_G = data[i].saldoCuenta;
                    break;
                }
                $scope.clean_Pagos();
            }, function (err) {
                $scope.loader_modal_ayuda = false;
                console.log(err);
            });
    };

    $scope.generarVistaPreliminar_Sunat = function (TipoDoc, NroDocumento) {
        $scope.loader_modal = true;
        Documentos_MasivosServices.ImprimirDocumentos_individual(NroDocumento, TipoDoc)
            .then(function (res) {
                console.log(res);
                $scope.loader_modal = false;
                if (res.length == 0) {
                    return;
                }
                var cabContent = [];

                var idCab = null;
                var detConent = res;
                var indexAux = -1;
                res.forEach(function (item, index) {
                    if (idCab !== item.IDCAB) {
                        indexAux++;
                        cabContent.push({
                            ID: indexAux,
                            IDCAB: item.IDCAB,
                            FECHA: item.FECHA,
                            PAGO: item.PAGO,
                            FECHAVEN: item.FECHAVEN,
                            EMPRESA: item.EMPRESA,
                            DIRECCION: item.DIRECCION,
                            NRO_DOC: item.NRO_DOC,
                            RUC: item.RUC,
                            GUIA: item.GUIA,
                            OBSERVACION: item.OBSERVACION,
                            CODIGO_RQ: item.CODIGO_RQ,

                            RUC_EMPRESA_EMITE: item.RUC_EMPRESA_EMITE,
                            RAZON_SOCIAL_EMITE: item.RAZON_SOCIAL_EMITE,
                            DEPARTAMENTO_EMITE: item.DEPARTAMENTO_EMITE,
                            
                            PROVINCIA_EMITE: item.PROVINCIA_EMITE,
                            DISTRITO_EMITE: item.DISTRITO_EMITE,
                            CALLE_EMITE: item.CALLE_EMITE,
                            DETCONTENT: []
                        });
                        detConent.forEach(function (itemdet) {
                            if (itemdet.IDCAB === cabContent[indexAux].IDCAB) {
                                cabContent[indexAux].DETCONTENT.push(itemdet);
                            }
                        });
                    }
                    idCab = item.IDCAB;
                });

                console.log(TipoDoc);
                if (TipoDoc == 1 || TipoDoc == '1') {
                    $scope.pdf_facturacionElectronica_factura(cabContent);
                }
                if (TipoDoc == 2 || TipoDoc == '2') {
                    $scope.pdf_facturacionElectronica_boleta(cabContent);
                }
                if (TipoDoc == 3 || TipoDoc == '3') {
                    getPdfGuiaRemision(cabContent);
                }

            }, function (err) {
                $scope.loader_modal = false;
                console.log(err);
            });
    };

    $scope.pdf_facturacionElectronica_factura = function (cab) {

        var doc = new jsPDF();
        var altura = 20;
        var splitTitle = "";
        var direcc = '';
        var codCab = "";
        var totalDet = 0;
        var igvDet = 0;
        var totalPagar = 0;
        var nroLetra;
        var subtotal = 0;
        var precioUnit = 0;

        var IndiceGlobal = cab.length;

        var ejecutarConsulta = function (indice) {

            if (IndiceGlobal == indice) {
                return;
            }
            altura = 20;
            splitTitle = "";

            direcc = "";
            // CABECERA DEL DOCUMENTO
            doc.setFont("courier");
            doc.setFontType("bold");
            doc.setFontSize(9);
            doc.text(20, 20, cab[indice].RAZON_SOCIAL_EMITE);
            doc.setFontSize(7);
            doc.setFontType("normal");

            direcc = doc.splitTextToSize(cab[indice].CALLE_EMITE, 100);
            doc.text(20, 24, direcc)

            if (direcc.length >= 2) {
                doc.text(20, 32, cab[indice].DISTRITO_EMITE + ' ' + cab[indice].PROVINCIA_EMITE + ' ' + cab[indice].DEPARTAMENTO_EMITE);
                doc.text(20, 36, 'Cel. 992 847 948');
                doc.text(20, 40, 'Email: corporacion.belcen@gmail.com');
            } else {
                doc.text(20, 28, cab[indice].DISTRITO_EMITE + ' ' + cab[indice].PROVINCIA_EMITE + ' ' + cab[indice].DEPARTAMENTO_EMITE);
                doc.text(20, 32, 'Cel. 992 847 948');
                doc.text(20, 36, 'Email: corporacion.belcen@gmail.com');
            }

            //---    dibujando un rectangulo    -----
            doc.roundedRect(140, altura, 60, 20, 3, 3)

            doc.text(157, 28, 'RUC : ' + cab[indice].RUC_EMPRESA_EMITE);
 
            doc.setFontSize(10);
            doc.text(150, 32, 'FACTURA ELECTRÓNICA');
            doc.setFontSize(7);
            doc.text(157, 36, 'Nro: ' + String(cab[indice].NRO_DOC));
            //---  Fin de dibujando un rectangulo    -----
            altura = 55;
            //---    dibujando un rectangulo    -----
            doc.roundedRect(10, altura - 5, 190, 16, 2, 2)
            doc.text(13, altura, 'CLIENTE : ' + String(cab[indice].EMPRESA)); doc.text(140, altura, 'MONEDA : SOLES'); doc.text(175, altura, 'IGV :  % 18');
            altura += 4;
            doc.text(13, altura, 'RUC : ' + String(cab[indice].RUC));
            altura += 4;
            doc.text(13, altura, 'DIRECCION : ' + String(cab[indice].DIRECCION));
            altura += 4;
            //---  Fin de dibujando un rectangulo    -----
            altura = 80;
            //---    dibujando un rectangulo    -----
            doc.roundedRect(10, altura - 5, 190, 12, 2, 2)
            doc.setFontType("bold");
            doc.text(15, altura, 'Fecha de Emision');
            doc.line(45, altura - 5, 45, altura + 7) // vertical line
            doc.text(50, altura, 'Condicion de Pago');
            doc.line(82, altura - 5, 82, altura + 7) // vertical line
            doc.text(90, altura, 'Orden de Compra');
            doc.line(118, altura - 5, 118, altura + 7) // vertical line
            doc.text(124, altura, 'Fecha de Vencimiento');
            doc.line(160, altura - 5, 160, altura + 7) // vertical line
            doc.text(164, altura, 'Nro Guia de Remision');
            altura += 4;
            doc.setFontType("normal");
            doc.text(17, altura, String(cab[indice].FECHA));
            doc.text(52, altura, String(cab[indice].PAGO));
            doc.text(90, altura, '');
            doc.text(127, altura, String(cab[indice].FECHAVEN));
            //doc.text(168, altura, String(cab[indice].GUIA));
            //---  Fin de dibujando un rectangulo    -----
            altura = 105;
            //---    dibujando un rectangulo    -----
            doc.setFillColor(197, 191, 191)
            doc.roundedRect(10, altura - 5, 190, 8, 2, 2, 'F')

            doc.setDrawColor(197, 191, 191) // color lines
            doc.text(12, altura, 'CODIGO'); doc.text(27, altura, 'CANT'); doc.text(38, altura, 'UNID.'); doc.text(80, altura, 'DESCRIPCION.'); doc.text(148, altura, 'V. UNIT.'); doc.text(165, altura, 'DSCTO.'); doc.text(187, altura, 'P. VENTA');
            altura += 6;
            // FIN DE LA CABECERA DEL DOCUMENTO 

            totalDet = 0;
            igvDet = 0;
            totalPagar = 0;
            nroLetra = '';


            cab[indice].DETCONTENT.forEach(function (itemDet, indexDet) {
                splitTitle = doc.splitTextToSize(itemDet.NOMBRE_PRODUCTO, 92);

                doc.text(12, altura, String(itemDet.CODIGO_PROD));
                doc.writeText(25, altura, auxiliarServices.formatearNumero(itemDet.CANTIDAD, 2), { align: 'right', width: 8 });
                doc.text(37, altura, String(itemDet.UNIDAD));
                doc.text(50, altura, splitTitle);
   
                precioUnit = 0;
                precioUnit = (itemDet.PRECIO / 1.18);
                doc.writeText(140, altura, auxiliarServices.formatearNumero(precioUnit, 2), { align: 'right', width: 18 });
                doc.text(165, altura, '0.00');

                subtotal = 0;
                subtotal = (itemDet.IMPORTE / 1.18);
                doc.writeText(180, altura, auxiliarServices.formatearNumero(subtotal, 2), { align: 'right', width: 20 });

                if (splitTitle.length >= 2) {
                    altura += 4;
                }
                doc.setDrawColor(197, 191, 191) // color lines
                doc.line(10, altura + 1, 200, altura + 1) // horizontal line
                altura += 4;
                totalDet += parseFloat(itemDet.IMPORTE);
            });
            // ---- montos  totales del documento
            totalPagar = totalDet;
            totalDet = totalDet / 1.18;
            totalDet = auxiliarServices.formatearNumero(totalDet, 2);
            igvDet = totalPagar / 1.18 * 0.18;
            igvDet = auxiliarServices.formatearNumero(igvDet, 2);
            nroLetra = NumeroALetras(totalPagar);
            totalPagar = auxiliarServices.formatearNumero(totalPagar, 2);
            altura += 4;

            doc.setFontType("bold");
            doc.setFontSize(8);
            doc.text(162, altura, 'SUB TOTAL :'); doc.writeText(180, altura, totalDet, { align: 'right', width: 20 });
            altura += 4;
            doc.text(171, altura, 'IGV :'); doc.writeText(180, altura, igvDet, { align: 'right', width: 20 });
            altura += 4;
            doc.text(168, altura, 'TOTAL :'); doc.writeText(180, altura, auxiliarServices.formatearNumero(totalPagar, 2), { align: 'right', width: 20 });

            altura += 6;
            doc.roundedRect(10, altura, 190, 6, 2, 2)
            doc.text(12, altura + 3.5, 'SON: ' + nroLetra);
            // ---- fin de montos  totales del documento
            var generarPdf = function () {
                var string = doc.output('datauristring');
                var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
                var x = window.open();
                x.document.open();
                x.document.write(iframe);
                x.document.close();

                setTimeout(function () {
                    doc.save('Factura_' + cab[indice].NRO_DOC + '.pdf');
                    var blob = doc.output("blob");
                    var blobURL = URL.createObjectURL(blob);
                    var downloadLink = document.getElementById('pdf-download-link');
                    downloadLink.href = blobURL;
                }, 0);

            }
            //----validacion si no existe la imagen del codigo qr ---
            if (cab[indice].CODIGO_RQ.indexOf(".gif") <= -1) {
                if (codCab != cab[indice].IDCAB) {
                    if (indice == cab.length - 1) {
                        generarPdf();
                        return;
                    } else {
                        doc.addPage();
                        ejecutarConsulta((indice + 1));
                    }
                }
                codCab = cab[indice].IDCAB;
            } else {
                var imgData = String(cab[indice].CODIGO_RQ);
                //var imgData = String('../content/img/1047.gif');
                var img = new Image;
                img.onload = function () {
                    doc.addImage(this, 'JPEG', 85, 250, 40, 30);
                    if (codCab != cab[indice].IDCAB) {
                        if (indice == cab.length - 1) {
                            generarPdf();
                            return;
                        } else {
                            doc.addPage();
                            ejecutarConsulta((indice + 1));
                        }
                    }
                    codCab = cab[indice].IDCAB;
                };
                img.crossOrigin = "";
                img.src = imgData;

                doc.text(40, 285, ' Representación impresa de la factura electrónica, consulte en www.efact.pe');               
            }
        }

        ejecutarConsulta(0);

    }

    $scope.pdf_facturacionElectronica_boleta = function (cab) {

        var doc = new jsPDF();
        var altura = 20;
        var splitTitle = "";
        var direcc = "";
        var codCab = "";
        var totalDet = 0;
        var igvDet = 0;
        var totalPagar = 0;
        var nroLetra;
        var subtotal = 0;
        var precioUnit = 0;

        var IndiceGlobal = cab.length;

        var ejecutarConsulta = function (indice) {

            if (IndiceGlobal == indice) {
                return;
            }
            altura = 20;
            splitTitle = "";
            direcc = "";
            // CABECERA DEL DOCUMENTO
            doc.setFont("courier");
            doc.setFontType("bold");
            doc.setFontSize(9);
            doc.text(20, 20, cab[indice].RAZON_SOCIAL_EMITE);
            doc.setFontSize(7);
            doc.setFontType("normal");

            direcc = doc.splitTextToSize(cab[indice].CALLE_EMITE, 100);
            doc.text(20, 24, direcc)

            if (direcc.length >= 2) {
                doc.text(20, 32, cab[indice].DISTRITO_EMITE + ' ' + cab[indice].PROVINCIA_EMITE + ' ' + cab[indice].DEPARTAMENTO_EMITE);
                doc.text(20, 36, 'Cel. 992 847 948');
                doc.text(20, 40, 'Email: corporacion.belcen@gmail.com');
            } else {
                doc.text(20, 28, cab[indice].DISTRITO_EMITE + ' ' + cab[indice].PROVINCIA_EMITE + ' ' + cab[indice].DEPARTAMENTO_EMITE);
                doc.text(20, 32, 'Cel. 992 847 948');
                doc.text(20, 36, 'Email: corporacion.belcen@gmail.com');
            }

            //---    dibujando un rectangulo    -----
            doc.roundedRect(140, altura, 60, 20, 3, 3)

            doc.text(157, 28, 'RUC : ' + cab[indice].RUC_EMPRESA_EMITE);
            doc.setFontSize(9);
            doc.text(144, 32, 'BOLETA DE VENTA ELECTRÓNICA');
            doc.setFontSize(7);
            doc.text(157, 36, 'Nro: ' + String(cab[indice].NRO_DOC));
            //---  Fin de dibujando un rectangulo    -----
            altura = 55;
            //---    dibujando un rectangulo    -----
            doc.roundedRect(10, altura - 5, 190, 16, 2, 2)
            doc.text(13, altura, 'CLIENTE : ' + String(cab[indice].EMPRESA)); doc.text(140, altura, 'MONEDA : SOLES'); doc.text(175, altura, 'IGV :  % 18');
            altura += 4;
            doc.text(13, altura, 'DOC. IDENTIDAD : ' + String(cab[indice].RUC));
            altura += 4;
            doc.text(13, altura, 'DIRECCION : ' + String(cab[indice].DIRECCION));
            altura += 4;
            //---  Fin de dibujando un rectangulo    -----
            altura = 80;
            //---    dibujando un rectangulo    -----
            doc.roundedRect(10, altura - 5, 190, 12, 2, 2)
            doc.setFontType("bold");
            doc.text(15, altura, 'Fecha de Emision');
            doc.line(45, altura - 5, 45, altura + 7) // vertical line
            doc.text(50, altura, 'Condicion de Pago');
            doc.line(82, altura - 5, 82, altura + 7) // vertical line
            doc.text(90, altura, 'Orden de Compra');
            doc.line(118, altura - 5, 118, altura + 7) // vertical line
            doc.text(124, altura, 'Fecha de Vencimiento');
            doc.line(160, altura - 5, 160, altura + 7) // vertical line
            doc.text(164, altura, 'Nro Guia de Remision');
            altura += 4;
            doc.setFontType("normal");
            doc.text(17, altura, String(cab[indice].FECHA));
            doc.text(52, altura, String(cab[indice].PAGO));
            doc.text(90, altura, '');
            doc.text(127, altura, String(cab[indice].FECHAVEN));
            //doc.text(168, altura, String(cab[indice].GUIA));
            //---  Fin de dibujando un rectangulo    -----
            altura = 105;
            //---    dibujando un rectangulo    -----
            doc.setFillColor(197, 191, 191)
            doc.roundedRect(10, altura - 5, 190, 8, 2, 2, 'F')

            doc.setDrawColor(197, 191, 191) // color lines
            doc.text(12, altura, 'CODIGO'); doc.text(27, altura, 'CANT'); doc.text(38, altura, 'UNID.'); doc.text(80, altura, 'DESCRIPCION.'); doc.text(148, altura, 'V. UNIT.'); doc.text(165, altura, 'DSCTO.'); doc.text(187, altura, 'P. VENTA');
            altura += 6;
            // FIN DE LA CABECERA DEL DOCUMENTO 

            totalDet = 0;
            igvDet = 0;
            totalPagar = 0;
            nroLetra = '';

            cab[indice].DETCONTENT.forEach(function (itemDet, indexDet) {
                splitTitle = doc.splitTextToSize(itemDet.NOMBRE_PRODUCTO, 92);

                doc.text(12, altura, String(itemDet.CODIGO_PROD));
                doc.writeText(25, altura, auxiliarServices.formatearNumero(itemDet.CANTIDAD, 2), { align: 'right', width: 8 });
                doc.text(37, altura, String(itemDet.UNIDAD));
                doc.text(50, altura, splitTitle);

                precioUnit = 0;
                precioUnit = (itemDet.PRECIO / 1.18);
                doc.writeText(140, altura, auxiliarServices.formatearNumero(precioUnit, 2), { align: 'right', width: 18 });
                doc.text(165, altura, '0.00');

                subtotal = 0;
                subtotal = (itemDet.IMPORTE / 1.18);
                doc.writeText(180, altura, auxiliarServices.formatearNumero(subtotal, 2), { align: 'right', width: 20 });

                if (splitTitle.length >= 2) {
                    altura += 4;
                }
                doc.setDrawColor(197, 191, 191) // color lines
                doc.line(10, altura + 1, 200, altura + 1) // horizontal line
                altura += 4;
                totalDet += parseFloat(itemDet.IMPORTE);
            });
            // ---- montos  totales del documento
            totalPagar = totalDet;
            totalDet = totalDet / 1.18;
            totalDet = auxiliarServices.formatearNumero(totalDet, 2);
            igvDet = totalPagar / 1.18 * 0.18;
            igvDet = auxiliarServices.formatearNumero(igvDet, 2);
            nroLetra = NumeroALetras(totalPagar);
            totalPagar = auxiliarServices.formatearNumero(totalPagar, 2);
            altura += 4;

            doc.setFontType("bold");
            doc.setFontSize(8);
            doc.text(162, altura, 'SUB TOTAL :'); doc.writeText(180, altura, totalDet, { align: 'right', width: 20 });
            altura += 4;
            doc.text(171, altura, 'IGV :'); doc.writeText(180, altura, igvDet, { align: 'right', width: 20 });
            altura += 4;
            doc.text(168, altura, 'TOTAL :'); doc.writeText(180, altura, auxiliarServices.formatearNumero(totalPagar, 2), { align: 'right', width: 20 });

            altura += 6;
            doc.roundedRect(10, altura, 190, 6, 2, 2)
            doc.text(12, altura + 3.5, 'SON: ' + nroLetra);
            // ---- fin de montos  totales del documento
            var generarPdf = function () {
                var string = doc.output('datauristring');
                var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
                var x = window.open();
                x.document.open();
                x.document.write(iframe);
                x.document.close();

                setTimeout(function () {
                    doc.save('Boleta_' + cab[indice].NRO_DOC + '.pdf');
                    var blob = doc.output("blob");
                    var blobURL = URL.createObjectURL(blob);
                    var downloadLink = document.getElementById('pdf-download-link');
                    downloadLink.href = blobURL;
                }, 0);

            }
            //----validacion si no existe la imagen del codigo qr ---
            if (cab[indice].CODIGO_RQ.indexOf(".gif") <= -1) {
                if (codCab != cab[indice].IDCAB) {
                    if (indice == cab.length - 1) {
                        console.log('generarPdf')
                        generarPdf();
                        return;
                    } else {
                        console.log('else')
                        console.log()
                        doc.addPage();
                        ejecutarConsulta((indice + 1));
                    }
                }
                codCab = cab[indice].IDCAB;
            } else {

                console.log(String(cab[indice].CODIGO_RQ));
                var imgData = String(cab[indice].CODIGO_RQ);
                //var imgData = String('../content/img/1047.gif');

                var img = new Image;
                img.onload = function () {
                    doc.addImage(this, 'JPEG', 85, 250, 40, 30);
                    if (codCab != cab[indice].IDCAB) {
                        if (indice == cab.length - 1) {
                            generarPdf();
                            return;
                        } else {
                            doc.addPage();
                            ejecutarConsulta((indice + 1));
                        }
                    }
                    codCab = cab[indice].IDCAB;
                };
                img.crossOrigin = "";
                img.src = imgData;

                doc.text(40, 285, ' Representación impresa de la factura electrónica, consulte en www.efact.pe');
            }
        }

        ejecutarConsulta(0);

    }


    $scope.tituloProceso = 'Generar Cancelacion';
    $scope.Change_TipoDoc_Numeracion = function () {

        $scope.objeto_parametros.Numero_Documento = '';
        $scope.objeto_parametros.serie = '';
        $scope.objeto_parametros.num_doc = '';
         
        if ($scope.objeto_parametros.id_TipoDocumento == 3 || $scope.objeto_parametros.id_TipoDocumento == '3') {
            $("#txt_serie").prop('disabled', false);
            $("#txt_num_doc").prop('disabled', false);

            var chk_transporrte = document.getElementById('chk_transporrte');
            if (chk_transporrte.checked == true) {
                $scope.tituloProceso = 'Generar Documento';
            } else {
                $scope.tituloProceso = 'Generar Cancelacion';
            } 

        } else {
            if ($scope.objeto_parametros.id_Local == 0 || $scope.objeto_parametros.id_Local == '0') {
                auxiliarServices.NotificationMessage('Sistemas', 'Es necesario que seleccione un Local para obtener la numeracion, verifique', 'error', '#ff6849', 2000);
                return;
            }
            if ($scope.objeto_parametros.id_TipoDocumento == 0 || $scope.objeto_parametros.id_TipoDocumento == '0') {
                return;
            }

            $("#txt_serie").prop('disabled', true);
            $("#txt_num_doc").prop('disabled', true);

            $scope.loaderfiltros = true;
            NotaCreditoDebitoServices.get_NumeracionAutomatica($scope.objeto_parametros.id_Local, $scope.objeto_parametros.id_TipoDocumento, 0)
                .then(function (data) {
                    $scope.loaderfiltros = false;

                    if (data.length == 0) {
                        auxiliarServices.NotificationMessage('Sistemas', 'No se configuro ninguna Serie para ese Local, verifique', 'error', '#ff6849', 2000);
                        return;
                    }
                    $scope.objeto_parametros.serie = data[0].serie_correlativo;
                    $scope.objeto_parametros.num_doc = '0000000';
                }, function (err) {
                    $scope.loaderfiltros = false;
                    console.log(err);
                });
        }




    };

    $scope.change_transporte = function (valor) {
        if (valor == 1) {
            $scope.tituloProceso = 'Generar Documento';
        } else {
            $scope.tituloProceso = 'Generar Cancelacion';
        }
    }


    $scope.re_enviar_sunat = function () {
        const tipo = '2';
        const numerodoc = '0001-0000152';

        $scope.generarDocu_Facturacion_Electronica(tipo, numerodoc )
    }


});