var app = angular.module('appGestion.PromocionesController', [])

app.controller('CtrlPromociones', function ($scope, loginServices, $location, $timeout, auxiliarServices, RevisionPedidoServices, GrupoDetServices, Cliente_IIServices, PromocionesServices) {
    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;
 
        auxiliarServices.changeTitle("Promociones");
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

    //----- variables Globales

    $scope.Flag_modoEdicion == false;
    $scope.idPromocion_Global = 0;

    $scope.Flag_modoEdicion_Config = false;
    $scope.idConfiguracion_Global = 0;

    $scope.Flag_modoEdicion_CanastaCab = false;
    $scope.Flag_modoEdicion_CanastaDet = false;
    $scope.idCanasta_Global = 0;
    $scope.AccionBotonCanasta = '';

    $scope.Objeto_Parametro_Filtro = {
        idEstado: '0',
        fechaIni: auxiliarServices.formatDateNow(),
        fechaFin: auxiliarServices.formatDateNow(),
    }


    $scope.Objeto_Parametro =  {
        id_Promocion: '0',
        codigoPromocion: '',
        id_ActividadPromocion: '0',
        nombrePromocion: '',
        descripcionPromocion: '',
        fechaVigenciaDesde:   auxiliarServices.formatDateNow(),
        fechaVigenciaHasta: auxiliarServices.formatDateNow(),
        topesUnidadesInicio: '',
        topesUnidadesFin: '',
        id_CanalNegocio: '0',
        id_FormaPago: '0',
        estado: '1',        
        usuario_creacion:auxiliarServices.getUserId()
    }

    $scope.Objeto_Parametro_Conf = {
        id_Productos_Configuracion: '0',
        id_Promocion: '0',
        id_Canasta: '0',
        descripcion_Canasta: '',

        id_Producto: '0',
        codigo_Producto: '',
        descripcion_Producto: '',

        id_unidadMedida: '0',
        descripcion_unidadMedida: '',
        cantidad_Promocion: '',
        estado: '1',
        usuario_creacion: auxiliarServices.getUserId()
    }  


    $scope.Objeto_Parametro_Canasta = { 
        id_Canasta: '0',
        descripcionCanasta: '',
        estado: '1',
        usuario_creacion: auxiliarServices.getUserId()
    }



    $scope.Objeto_Parametro_Canasta_Det = {
        id_CanastaDet: '0',
        id_Canasta : '0',
        id_Producto: '0',
        codigo_Producto: '',
        descripcion_Producto: '',
        descripcion_unidadMedida : '',
        estado : '1',
        usuario_creacion: auxiliarServices.getUserId()
    }


    $scope.actividades = []; 
    $scope.listadoActividades = function () {
        $scope.loader = true;
        PromocionesServices.get_actividades()
        .then(function (res) {
            $scope.loader = false;
            if (res.ok == true) {
                $scope.actividades = [];
                $scope.actividades = res.data;
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
            setTimeout(function () {
                $('#cboActividad').val("0").trigger('change.select2');
            }, 100);
        })
    }
    $scope.listadoActividades();

    $scope.lista_anexos = [];
    $scope.listados_anexos = function () {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_Anexos_Usuarios(auxiliarServices.getUserId()).then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {
                $scope.lista_anexos = [];
                $scope.lista_anexos = res.data;
                $timeout(function () {
                    $('#cboCanales').val('0').trigger('change.select2');
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


    $scope.Lista_CondicionFact = [];
    $scope.Listando_CondicionFacturacion = function () {
        $scope.loader = true;
        GrupoDetServices.getGrupoTabla_Det(5)
            .then(function (data) {
                $scope.loader = false;
                $scope.Lista_CondicionFact = [];
                $scope.Lista_CondicionFact = data;
                setTimeout(function () {
                    $('#cboFormaPago').val("0").trigger('change.select2');
                }, 100);
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }
    $scope.Listando_CondicionFacturacion();


    $scope.estados = [];
    $scope.listadoEstados = function () {
        $scope.loader = true;
        PromocionesServices.get_estados()
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.estados = [];
                    $scope.estados = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
                setTimeout(function () {
                    $('#cboCanales').val("0").trigger('change.select2');
                }, 100);
            })
    }
    $scope.listadoEstados();


    var oTableCab;

    $scope.promocionesCab = [];
    $scope.listandoPromocionesCab = function () {

        const idEstado = $scope.Objeto_Parametro_Filtro.idEstado;
        const fechaIni = auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_Filtro.fechaIni);
        const fechaFin = auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_Filtro.fechaFin);

        $scope.loaderFiltro = true;
        PromocionesServices.get_promocionesCab(idEstado, fechaIni, fechaFin )
            .then(function (res) {
                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    $scope.promocionesCab = [];
                    $scope.promocionesCab = res.data;
                    $timeout(function () {
                        $scope.loader = false;
                        if (oTableCab == null) {
                            oTableCab = 'data'
                            auxiliarServices.initFooTable('tablaPromociones', '');
                        } else {
                            $('#tablaPromociones').trigger('footable_initialize');
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
     
    $scope.limpiarPromocionesCab = function () {
 
        $scope.Objeto_Parametro.id_Promocion = '0';
        $scope.Objeto_Parametro.codigoPromocion = '';
        $scope.Objeto_Parametro.id_ActividadPromocion = '0';
        $scope.Objeto_Parametro.nombrePromocion = '';
        $scope.Objeto_Parametro.descripcionPromocion = '';
        $scope.Objeto_Parametro.fechaVigenciaDesde = auxiliarServices.formatDateNow(),
        $scope.Objeto_Parametro.fechaVigenciaHasta = auxiliarServices.formatDateNow(),
        $scope.Objeto_Parametro.topesUnidadesInicio = '';
        $scope.Objeto_Parametro.topesUnidadesFin = '';
        $scope.Objeto_Parametro.id_CanalNegocio = '0';
        $scope.Objeto_Parametro.id_FormaPago = '0';
        $scope.Objeto_Parametro.estado = '1';
        $scope.Objeto_Parametro.usuario_creacion = auxiliarServices.getUserId();


        $timeout(function () {
            $('#cboActividad').val("0").trigger('change.select2');
            $('#cboCanales').val("0").trigger('change.select2');
            $('#cboFormaPago').val("0").trigger('change.select2');
        }, 300);
    }

    $scope.limpiarConfiguraciones= function () {
        $scope.Objeto_Parametro_Conf.id_Productos_Configuracion = '0';
        $scope.Objeto_Parametro_Conf.id_Promocion = $scope.idPromocion_Global;
        $scope.Objeto_Parametro_Conf.id_Canasta = '0';
        $scope.Objeto_Parametro_Conf.descripcion_Canasta = '';

        $scope.Objeto_Parametro_Conf.id_Producto = '0';
        $scope.Objeto_Parametro_Conf.codigo_Producto = '';
        $scope.Objeto_Parametro_Conf.descripcion_Producto = '';
        $scope.Objeto_Parametro_Conf.id_unidadMedida = '0';
        $scope.Objeto_Parametro_Conf.descripcion_unidadMedida = '';

        $scope.Objeto_Parametro_Conf.cantidad_Promocion = '0';
        $scope.Objeto_Parametro_Conf.estado = '1';
        $scope.Objeto_Parametro_Conf.usuario_creacion = auxiliarServices.getUserId();
    }
         

    $scope.Open_New_Modal = function () {
        $scope.Flag_modoEdicion = false;
        $scope.idPromocion_Global = 0;
        $scope.limpiarPromocionesCab();
        $scope.nuevoConfiguracion()
        $('#modalMantenimiento').modal('show');
    }

         
    $scope.EdicionRegistros = function (obj) {

        $scope.Flag_modoEdicion = true;
        $scope.idPromocion_Global = obj.id_Promocion;

        $('#modalMantenimiento').modal('show');
 
        $scope.Objeto_Parametro.id_Promocion = obj.id_Promocion;
        $scope.Objeto_Parametro.codigoPromocion = obj.codigoPromocion;
        $scope.Objeto_Parametro.id_ActividadPromocion = obj.id_ActividadPromocion;
        $scope.Objeto_Parametro.nombrePromocion = obj.nombrePromocion;
        $scope.Objeto_Parametro.descripcionPromocion = obj.descripcionPromocion;
        $scope.Objeto_Parametro.id_CanalNegocio = String(obj.id_CanalNegocio);
        $scope.Objeto_Parametro.fechaVigenciaDesde = obj.fechaVigenciaDesde;
        $scope.Objeto_Parametro.fechaVigenciaHasta = obj.fechaVigenciaHasta;
        $scope.Objeto_Parametro.topesUnidadesInicio = obj.topesUnidadesInicio;
        $scope.Objeto_Parametro.topesUnidadesFin = obj.topesUnidadesFin;


        $scope.Objeto_Parametro.id_FormaPago = obj.id_FormaPago;
        $scope.Objeto_Parametro.estado = obj.estado;
        $scope.Objeto_Parametro.usuario_creacion = auxiliarServices.getUserId();
 
        setTimeout(function () {
            $('#cboActividad').val(obj.id_ActividadPromocion).trigger('change.select2');
            $('#cboCanales').val(String(obj.id_CanalNegocio)).trigger('change.select2');
            $('#cboFormaPago').val(obj.id_FormaPago).trigger('change.select2');
        }, 500);
 

        ///---Configuración de la Promoción
        $scope.listandoConfiguracionDet();
        $scope.nuevoConfiguracion()

    }


    $scope.guardarPromociones = function () {

        if ($scope.Objeto_Parametro.id_ActividadPromocion == '0' || $scope.Objeto_Parametro.id_ActividadPromocion == 0 ) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Actividad', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro.nombrePromocion == '' || $scope.Objeto_Parametro.nombrePromocion == null || $scope.Objeto_Parametro.nombrePromocion == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el nombre de la Promoción', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.descripcionPromocion == '' || $scope.Objeto_Parametro.descripcionPromocion == null || $scope.Objeto_Parametro.descripcionPromocion == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la descripcion de Promoción', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.fechaVigenciaDesde == '' || $scope.Objeto_Parametro.fechaVigenciaDesde == null || $scope.Objeto_Parametro.fechaVigenciaDesde == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la fecha inicial de la Vigencia', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.fechaVigenciaHasta == '' || $scope.Objeto_Parametro.fechaVigenciaHasta == null || $scope.Objeto_Parametro.fechaVigenciaHasta == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la fecha final de la Vigencia', 'error', '#ff6849', 1500);
            return false;
        }
 
        if ($scope.Objeto_Parametro.topesUnidadesInicio == '0' || $scope.Objeto_Parametro.topesUnidadesInicio == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Tope Inicio', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.topesUnidadesFin == '0' || $scope.Objeto_Parametro.topesUnidadesFin == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Tope Final', 'error', '#ff6849', 1500);
            return false;
        }

        const fechaVigenteIni = auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro.fechaVigenciaDesde);
        const fechaVigenteFin = auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro.fechaVigenciaHasta);

                                    
        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            $scope.loaderSave = true;
            PromocionesServices.save_promociones($scope.Objeto_Parametro, fechaVigenteIni, fechaVigenteFin)
                .then(function (res) {
                    $scope.loaderSave = false;
  
                    if (res.ok == true) {
                        $scope.idPromocion_Global = res.data;
                        $scope.Flag_modoEdicion = true;
                        $scope.listandoPromocionesCab();
                        $scope.nuevoConfiguracion();

                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                        return;
                    }              
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso de Registro realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {
                     
                        });
                        $scope.loaderSave = false;
                    }, 500)
                }, function (error) {
                    $timeout(function () {
                        let paramsErr = {
                            type: 'error',
                            title: 'Error !',
                            text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                        }
                        auxiliarServices.initSweetAlert(paramsErr)
                            .then(function (res) {

                            });
                        $scope.loaderSave = false;
                        console.log(err);
                    }, 500)
                })

        } else {  //actualizar

            $scope.loaderSave = true;
            PromocionesServices.update_promociones($scope.Objeto_Parametro, fechaVigenteIni, fechaVigenteFin)
                .then(function (res) {

                    $scope.loaderSave = false;
                    if (res.ok == true) {              
                        $scope.listandoPromocionesCab();
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                        return
                    }   

                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        };
                        auxiliarServices.initSweetAlert(params).then(function (res) {

                        });

                    }, 500);

                }, function (error) {
                    $scope.loaderSave = false;
                    console.log(error);
                })

        }
    }

    $scope.anularPromociones = function (item) {

        if (item.estado == 0 || item.estado == '0') {
            return;
        }
        var params = {
            title: "Desea continuar ?",
            text: 'Esta por anular la Promocion',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderFiltro = true;
                PromocionesServices.set_anularPromocion(item.id_Promocion)
                    .then(function (res) {
                        $scope.loaderFiltro = false;
                        if (res.ok == true) {
                            var index = $scope.promocionesCab.indexOf(item);
                            $scope.promocionesCab[index].estado = 0;
                        } else {
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(res.data);
                        }
                    })
            }
        });
    }
    
    $scope.BuscarCanasta = function () {
        
        $scope.Objeto_Parametro_Conf.descripcion_Canasta = '';
        if ($scope.Objeto_Parametro_Conf.id_Canasta === '0' || $scope.Objeto_Parametro_Conf.id_Canasta === '' || $scope.Objeto_Parametro_Conf.id_Canasta === null || $scope.Objeto_Parametro_Conf.id_Canasta === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo de la Canasta', 'error', '#ff6849', 1500);
            return;
        } 

        $scope.loaderSave = true;
        PromocionesServices.get_buscarCanastaID($scope.Objeto_Parametro_Conf.id_Canasta)
            .then(function (res) {
                $scope.loaderSave = false;
                if (res.ok == true) {
                    if (res.data.length > 0) {
                        $scope.Objeto_Parametro_Conf.descripcion_Canasta = res.data[0].descripcion;
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'No se encontro resultado con el Codigo de Canasta ingresado, verifique.', 'error', '#ff6849', 3000);
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

    $scope.BuscarProducto = function () {

        if ($scope.Objeto_Parametro_Conf.codigo_Producto === '0' || $scope.Objeto_Parametro_Conf.codigo_Producto === '' || $scope.Objeto_Parametro_Conf.codigo_Producto === null || $scope.Objeto_Parametro_Conf.codigo_Producto === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo del Producto', 'error', '#ff6849', 1500);
            return;
        }

        $scope.Objeto_Parametro_Conf.id_Producto = '0';
        $scope.Objeto_Parametro_Conf.descripcion_Producto = '';
        $scope.Objeto_Parametro_Conf.id_unidadMedida = '0';
        $scope.Objeto_Parametro_Conf.descripcion_unidadMedida = '';
        $scope.Objeto_Parametro_Conf.cantidad_Promocion = '';


        $scope.loaderSave = true;
        PromocionesServices.get_buscarCodigoProducto($scope.Objeto_Parametro_Conf.codigo_Producto)
            .then(function (res) {
                $scope.loaderSave = false;
                if (res.ok == true) {
                    if (res.data.length > 0) {
                        $scope.Objeto_Parametro_Conf.id_Producto = res.data[0].id;
                        $scope.Objeto_Parametro_Conf.descripcion_Producto = res.data[0].descripcion;
                        $scope.Objeto_Parametro_Conf.id_unidadMedida = res.data[0].id_um;
                        $scope.Objeto_Parametro_Conf.descripcion_unidadMedida = res.data[0].descripcion_um;

                        $timeout(function () {
                            $('#txtCantConf').focus().select();
                        }, 0);

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


    $scope.Open_New_Modal_AyudaProducto = function (opcion) {

        $scope.opcionBusqueda = opcion;
        var regionDetalle_Producto = document.getElementById('regionDetalle_Producto');
        $('#txt_busquedaProducto').val('');
        $scope.Lista_Busqueda_Producto = [];
        regionDetalle_Producto.style.display = 'none';
        $('#modalAyuda_Producto').modal('show');

        $scope.Flag_movLote = false;
        $timeout(function () {
            regionDetalle_Producto.style.display = 'none';
            $('#txt_busquedaProducto').focus().select();
        }, 800);
    };

    var oTable_Prod;
    $scope.opcionBusqueda = '';

    $scope.Lista_Busqueda_Producto = [];
    $scope.Ayuda_BuscarProducto = function () {

        var txt_busquedaProducto = document.getElementById('txt_busquedaProducto').value;
        var regionDetalle_Producto = document.getElementById('regionDetalle_Producto');

        $scope.loader_modal_ayuda = true;
        PromocionesServices.get_Ayuda_Buscar_Producto_normal(txt_busquedaProducto, auxiliarServices.getUserId())
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

        console.log(obj)

        if ( $scope.opcionBusqueda == 'bonificacion') {
            $scope.Objeto_Parametro_Conf.id_Producto = obj.id_producto;
            $scope.Objeto_Parametro_Conf.codigo_Producto = obj.codigoInterno;
            $scope.Objeto_Parametro_Conf.descripcion_Producto = obj.descripcion_producto;
            $scope.Objeto_Parametro_Conf.id_unidadMedida = obj.Id_Unidad;
            $scope.Objeto_Parametro_Conf.descripcion_unidadMedida = obj.unidadMedida;

            $('#modalAyuda_Producto').modal('hide');
            $timeout(function () {
                $('#txtCantConf').focus().select();
            }, 500);
        }
        if ($scope.opcionBusqueda == 'detalleCanasta') { 

            $scope.Objeto_Parametro_Canasta_Det.id_Producto = obj.id_producto; 
            $scope.Objeto_Parametro_Canasta_Det.codigo_Producto = obj.codigoInterno;
            $scope.Objeto_Parametro_Canasta_Det.descripcion_Producto = obj.descripcion_producto;
            $scope.Objeto_Parametro_Canasta_Det.descripcion_unidadMedida = obj.unidadMedida;

            $('#modalAyuda_Producto').modal('hide');
            $timeout(function () {
                $('#txtCantConf').focus().select();
            }, 500);
        }


    };





    $scope.nuevoConfiguracion = function () {
        $scope.Flag_modoEdicion_Config = false;
        $scope.idConfiguracion_Global = 0;
        $scope.limpiarConfiguraciones();
    }

    $scope.guardarConfiguraciones = function () {
        

        if ($scope.Objeto_Parametro_Conf.id_Canasta == '0' || $scope.Objeto_Parametro_Conf.id_Canasta == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el código de la Canasta', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Conf.descripcion_Canasta == '' || $scope.Objeto_Parametro_Conf.descripcion_Canasta == null || $scope.Objeto_Parametro_Conf.descripcion_Canasta == undefined  ) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Canasta', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Conf.codigo_Producto == '' || $scope.Objeto_Parametro_Conf.codigo_Producto == null || $scope.Objeto_Parametro_Conf.codigo_Producto == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor busque el Producto, por medio del código', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Conf.id_Producto == '0' || $scope.Objeto_Parametro_Conf.id_Producto == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione Enter o el boton buscar para buscar el producto ', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_Conf.descripcion_Producto == '' || $scope.Objeto_Parametro_Conf.descripcion_Producto == null || $scope.Objeto_Parametro_Conf.descripcion_Producto == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione Enter o el boton buscar para buscar el producto', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Conf.cantidad_Promocion == '' || $scope.Objeto_Parametro_Conf.cantidad_Promocion == null || $scope.Objeto_Parametro_Conf.cantidad_Promocion == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la cantidad', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Conf.cantidad_Promocion == '0' || $scope.Objeto_Parametro_Conf.cantidad_Promocion == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese una cantidad positiva', 'error', '#ff6849', 1500);
            return false;
        }

        $scope.Objeto_Parametro_Conf.id_Promocion = $scope.idPromocion_Global; 

        if ($scope.Flag_modoEdicion_Config == false) {
            if ($scope.producto_configuracion_Ya_agregrado($scope.Objeto_Parametro_Conf.id_Producto)) {
                auxiliarServices.NotificationMessage('Sistemas', 'El producto ya se encuentra agregado, verifique..', 'error', '#ff6849', 1500);
                return false;
            }
        }

        if ($scope.Flag_modoEdicion_Config == false) { // nuevo registroo 
            $scope.loaderSave = true;
            PromocionesServices.save_configuracion($scope.Objeto_Parametro_Conf)
                .then(function (res) {
                    $scope.loaderSave = false;
                    
                    if (res.ok == true) {
                        $scope.nuevoConfiguracion();
                        $scope.listandoConfiguracionDet();
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }
                }, function (error) {
                    $scope.loaderSave = false;
                    alert(error);
                })

        } else {  //actualizar
            $scope.loaderSave = true;
            PromocionesServices.update_configuracion($scope.Objeto_Parametro_Conf)
                .then(function (res) {
                    $scope.loaderSave = false;
                    if (res.ok == true) {
                        $scope.nuevoConfiguracion();
                        $scope.listandoConfiguracionDet();
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }

                }, function (error) {
                    $scope.loaderSave = false;
                    alert(error);
                })

        }
    }
    
    var oTable;
    $scope.configuracionDet = [];
    $scope.listandoConfiguracionDet = function () {
        $scope.loaderSave = true;
        $scope.configuracionDet = [];
        PromocionesServices.get_configuracionDetalle($scope.idPromocion_Global)
            .then(function (res) {
                $scope.loaderSave = false; 
                if (res.ok == true) {
                    $scope.configuracionDet = [];
                    $scope.configuracionDet = res.data; 
                    $timeout(function () {
                        $scope.loader = false;
                        if (oTable == null) {
                            oTable = 'data'
                            auxiliarServices.initFooTable('tablaConfiguracion', '');
                        } else {
                            $('#tablaConfiguracion').trigger('footable_initialize');
                        }
                    }, 500)

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

 
            }, function (error) {
                    $scope.loaderSave = false;
                console.log(error)
            })
    }

    $scope.editarConfiguracion = function (obj) {

        $scope.Flag_modoEdicion_Config = true;
        $scope.idConfiguracion_Global = obj.id_Productos_Configuracion;
               
        $scope.Objeto_Parametro_Conf.id_Productos_Configuracion = obj.id_Productos_Configuracion
        $scope.Objeto_Parametro_Conf.id_Promocion = $scope.idPromocion_Global;
        $scope.Objeto_Parametro_Conf.id_Canasta = obj.id_Canasta;
        $scope.Objeto_Parametro_Conf.descripcion_Canasta = obj.descripcion_Canasta;

        $scope.Objeto_Parametro_Conf.id_Producto = obj.id_Producto;
        $scope.Objeto_Parametro_Conf.codigo_Producto = obj.codigo_Producto;
        $scope.Objeto_Parametro_Conf.descripcion_Producto = obj.descripcion_Producto;
        $scope.Objeto_Parametro_Conf.id_unidadMedida = obj.id_unidadMedida;
        $scope.Objeto_Parametro_Conf.descripcion_unidadMedida = obj.descripcion_unidadMedida;

        $scope.Objeto_Parametro_Conf.cantidad_Promocion = obj.cantidad_Promocion;
        $scope.Objeto_Parametro_Conf.estado = obj.estado;
        $scope.Objeto_Parametro_Conf.usuario_creacion = auxiliarServices.getUserId(); 
    }

    $scope.producto_configuracion_Ya_agregrado = function (idProducto) {

        const producto = $scope.configuracionDet.find((prod) => prod.id_Producto == idProducto);
        console.log(producto)

        if (producto) {
            return true;
        } else {
            return false;
        }
    }

    $scope.anularConfiguracion = function (item) {


        if (item.estado == 0 || item.estado == '0') {
            return;
        }
        var params = {
            title: "Desea continuar ?",
            text: 'Esta por anular la Configuracion de la Promocion',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderFiltro = true;
                PromocionesServices.set_anularConfiguracion(item.id_Productos_Configuracion)
                    .then(function (res) {
                        $scope.loaderFiltro = false;
                        if (res.ok == true) {
                            var index = $scope.configuracionDet.indexOf(item);
                            $scope.configuracionDet[index].estado = 0;
                        } else {
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(res.data);
                        }
                    })
            }
        });
    }

    
    //MANTENIMIENTO DE CANASTAS

    $scope.updateTable = function (value) {
        $timeout(function () {
            $('#tablaPromociones').trigger('footable_initialize');
        })
    } 


    $scope.Open_New_ModalCanasta = function () {

        if ($scope.Objeto_Parametro_Conf.id_Canasta == '0' || $scope.Objeto_Parametro_Conf.id_Canasta == 0 || $scope.Objeto_Parametro_Conf.id_Canasta == '' || $scope.Objeto_Parametro_Conf.id_Canasta == null) {

            $scope.nuevoCanastas_Cab();
            $scope.nuevoCanastas_Det();
            $scope.canastasDet = [];
            $('#modalCanastas').modal('show');
            $scope.AccionBotonCanasta = 'Grabar';


        } else {
            
            $('#modalCanastas').modal('show');
            $scope.AccionBotonCanasta = 'Actualizar';
            $scope.Flag_modoEdicion_CanastaCab = true;
            //desabilitar
            //$("#btnGrabarCab").prop('disabled', true);

            $scope.idCanasta_Global = $scope.Objeto_Parametro_Conf.id_Canasta;
            $scope.Objeto_Parametro_Canasta.id_Canasta = $scope.Objeto_Parametro_Conf.id_Canasta;
            $scope.Objeto_Parametro_Canasta.descripcionCanasta = $scope.Objeto_Parametro_Conf.descripcion_Canasta;

            $scope.nuevoCanastas_Det();
            $scope.listandoCanastasDet();
        }


    }

    $scope.nuevoCanastas_Det = function () {     
        $scope.Flag_modoEdicion_CanastaDet = false;
        $scope.limpiarCanastasDet();
    } 



    $scope.nuevoCanastas_Cab = function () {
        $scope.Flag_modoEdicion_CanastaCab = false;

        //---- habilitar
        $("#btnGrabarCab").prop('disabled', false);
        $scope.AccionBotonCanasta = 'Grabar'
        $scope.limpiarCanastasCab();
        $scope.canastasDet = [];
        $scope.idCanasta_Global = 0;
 
    } 

    $scope.limpiarCanastasCab = function () {
        $scope.Objeto_Parametro_Canasta.id_Canasta = '0'; 
        $scope.Objeto_Parametro_Canasta.descripcionCanasta = ''; 
        $scope.Objeto_Parametro_Canasta.estado = '1';
        $scope.Objeto_Parametro_Canasta.usuario_creacion = auxiliarServices.getUserId();
    }



    $scope.limpiarCanastasDet = function () {

        $scope.Objeto_Parametro_Canasta_Det.id_CanastaDet = '0';
        $scope.Objeto_Parametro_Canasta_Det.id_Canasta = $scope.Objeto_Parametro_Canasta.id_Canasta ;
        $scope.Objeto_Parametro_Canasta_Det.id_Producto = '0';
        $scope.Objeto_Parametro_Canasta_Det.codigo_Producto = '';
        $scope.Objeto_Parametro_Canasta_Det.descripcion_Producto = '';
        $scope.Objeto_Parametro_Canasta_Det.descripcion_unidadMedida = '';
        $scope.Objeto_Parametro_Canasta_Det.estado = '1';
 
        $scope.Objeto_Parametro_Canasta_Det.usuario_creacion = auxiliarServices.getUserId();
    }

    var oTableCanasta;
    $scope.canastasDet = [];
    $scope.listandoCanastasDet = function () {
        $scope.loaderSave = true;
        $scope.canastasDet = [];
        PromocionesServices.get_canastaDetalle($scope.idCanasta_Global)
            .then(function (res) {
                $scope.loaderSave = false;
                if (res.ok == true) {
                    $scope.canastasDet = [];
                    $scope.canastasDet = res.data;
                    $timeout(function () {
                        $scope.loader = false;
                        if (oTableCanasta == null) {
                            oTableCanasta = 'data'
                            auxiliarServices.initFooTable('tablaCanasta', '');
                        } else {
                            $('#tablaCanasta').trigger('footable_initialize');
                        }
                    }, 500)

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderSave = false;
                console.log(error)
            })
    }

    $scope.BuscarProductoCanasta = function () {

        if ($scope.Objeto_Parametro_Canasta_Det.codigo_Producto === '0' || $scope.Objeto_Parametro_Canasta_Det.codigo_Producto === '' || $scope.Objeto_Parametro_Canasta_Det.codigo_Producto === null || $scope.Objeto_Parametro_Canasta_Det.codigo_Producto === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo del Producto', 'error', '#ff6849', 1500);
            return;
        }
        $scope.Objeto_Parametro_Canasta_Det.id_Producto = '0';
        $scope.Objeto_Parametro_Canasta_Det.descripcion_Producto = '';
        $scope.Objeto_Parametro_Canasta_Det.descripcion_unidadMedida = ''

        $scope.loaderSave = true;
        PromocionesServices.get_buscarCodigoProducto($scope.Objeto_Parametro_Canasta_Det.codigo_Producto)
            .then(function (res) {
                $scope.loaderSave = false;
                if (res.ok == true) {
                    if (res.data.length > 0) {
                        $scope.Objeto_Parametro_Canasta_Det.id_Producto = res.data[0].id;
                        $scope.Objeto_Parametro_Canasta_Det.descripcion_Producto = res.data[0].descripcion;
                        $scope.Objeto_Parametro_Canasta_Det.descripcion_unidadMedida = res.data[0].descripcion_um;
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

    $scope.producto_canasta_Ya_agregrado = function (idProducto) {

        const producto = $scope.canastasDet.find((prod) => prod.id_Producto == idProducto);
        console.log(producto)

        if (producto) {
            return true;
        } else {
            return false;
        }
    }
    
    $scope.guardarProductoCanasta_Det = function () {
        
        if ($scope.Objeto_Parametro_Canasta_Det.id_Canasta == '0' || $scope.Objeto_Parametro_Canasta_Det.id_Canasta == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Primero grabe la Canasta', 'error', '#ff6849', 1500);
            return false;
        }
        //if ($scope.Objeto_Parametro_Canasta_Det.descripcion_Canasta == '' || $scope.Objeto_Parametro_Canasta_Det.descripcion_Canasta == null || $scope.Objeto_Parametro_Canasta_Det.descripcion_Canasta == undefined) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Canasta', 'error', '#ff6849', 1500);
        //    return false;
        //}

        if ($scope.Objeto_Parametro_Canasta_Det.codigo_Producto == '' || $scope.Objeto_Parametro_Canasta_Det.codigo_Producto == null || $scope.Objeto_Parametro_Canasta_Det.codigo_Producto == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor busque el Producto, por medio del código', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Canasta_Det.id_Producto == '0' || $scope.Objeto_Parametro_Canasta_Det.id_Producto == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione Enter o el boton buscar para buscar el producto ', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_Canasta_Det.descripcion_Producto == '' || $scope.Objeto_Parametro_Canasta_Det.descripcion_Producto == null || $scope.Objeto_Parametro_Canasta_Det.descripcion_Producto == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione Enter o el boton buscar para buscar el producto', 'error', '#ff6849', 1500);
            return false;
        }  

        if ($scope.Flag_modoEdicion_CanastaDet == false) {
            if ($scope.producto_canasta_Ya_agregrado($scope.Objeto_Parametro_Canasta_Det.id_Producto)) {
                auxiliarServices.NotificationMessage('Sistemas', 'El producto ya se encuentra agregado, verifique..', 'error', '#ff6849', 1500);
                return false;
            }
        }

        if ($scope.Flag_modoEdicion_CanastaDet == false) { // nuevo registroo 
            $scope.loaderSave = true;
            PromocionesServices.save_productoCanastaDet($scope.Objeto_Parametro_Canasta_Det)
                .then(function (res) {
                    console.log(res)
                    $scope.loaderSave = false;
                    if (res.ok == true) {
                        $scope.nuevoCanastas_Det();
                        $scope.listandoCanastasDet();
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }
                }, function (error) {
                        console.log(error)
                    $scope.loaderSave = false;
                    alert(JSON.stringify(error));
                })

        } else {  //actualizar
 
            $scope.loaderSave = true;
            PromocionesServices.update_productoCanastaDet($scope.Objeto_Parametro_Canasta_Det)
                .then(function (res) {
                    console.log(res);
                    $scope.loaderSave = false;
                    if (res.ok == true) {
                        $scope.nuevoCanastas_Det();
                        $scope.listandoCanastasDet();
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }

                }, function (error) {
                        console.log(error)
                        $scope.loaderSave = false;
                        alert(JSON.stringify(error));
                })

        }
    }

    $scope.editarProductoCanasta = function (obj) {

        $scope.Flag_modoEdicion_CanastaDet = true;

        $scope.Objeto_Parametro_Canasta_Det.id_CanastaDet = obj.id_CanastaDet;
        $scope.Objeto_Parametro_Canasta_Det.id_Canasta = obj.id_Canasta;
        $scope.Objeto_Parametro_Canasta_Det.id_Producto = obj.id_Producto;
        $scope.Objeto_Parametro_Canasta_Det.codigo_Producto = obj.codigo_Producto;
        $scope.Objeto_Parametro_Canasta_Det.descripcion_Producto = obj.descripcion_Producto;
        $scope.Objeto_Parametro_Canasta_Det.descripcion_unidadMedida = obj.descripcion_unidadMedida;
        $scope.Objeto_Parametro_Canasta_Det.estado = obj.estado;
        $scope.Objeto_Parametro_Canasta_Det.usuario_creacion = auxiliarServices.getUserId();

    }
           
    $scope.guardarProductoCanasta_Cab = function () {
        if ($scope.Objeto_Parametro_Canasta.descripcionCanasta == '' || $scope.Objeto_Parametro_Canasta.descripcionCanasta == null || $scope.Objeto_Parametro_Canasta.descripcionCanasta == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la descripcion de la Canasta', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Flag_modoEdicion_CanastaCab == false) { // nuevo registroo 
            $scope.loaderSave = true;
            PromocionesServices.save_productoCanastaCab($scope.Objeto_Parametro_Canasta)
                .then(function (res) {
                    $scope.loaderSave = false;
                    if (res.ok == true) {
                        $scope.Objeto_Parametro_Canasta.id_Canasta = res.data; 
                        $scope.idCanasta_Global = res.data;

                        $scope.nuevoCanastas_Det();

                        //---- desabilitar
                        $("#btnGrabarCab").prop('disabled', true); 
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }
                }, function (error) {
                    console.log(error)
                    $scope.loaderSave = false;
                    alert(JSON.stringify(error));
                })

        } else {  //actualizar

            $scope.loaderSave = true;
            PromocionesServices.update_productoCanastaCab($scope.Objeto_Parametro_Canasta)
                .then(function (res) {
                    $scope.loaderSave = false;
                    if (res.ok == true) {
                        $scope.nuevoCanastas_Det();
                        $scope.listandoCanastasDet();
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }

                }, function (error) {
                    console.log(error)
                    $scope.loaderSave = false;
                    alert(JSON.stringify(error));
                })

        }
    }

    
     
})
