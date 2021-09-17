var app = angular.module('appGestion.IngresoGuiasController', []);

app.controller('CtrlIngresoGuias', function ($scope, $routeParams, LocalesServices, EstadosServices, IngresoGuiasServices, AlmacenServices, $location, $timeout, auxiliarServices, productosServices) {


    var idUsuario_Global = 0;
    $scope.idPerfil_Global  = 0;

    $scope.initAll = function () {     

        //tipoMovimiento = 1    INGRESO POR ORDEN COMPRA
        //tipoMovimiento = 2    INGRESO PRODUCTO TERMINADO

        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        //$scope.loaderProd = true;

        // FUNCIÓN PARA CAMBIAR DE TITULO AL PAGE PRINCIPAL

        $scope.tipoMovimiento_Global = $routeParams.tipoM;

        idUsuario_Global = auxiliarServices.getUserId();
        $scope.idPerfil_Global = auxiliarServices.getPerfilId();

        if ($scope.tipoMovimiento_Global == 1 ) {
            auxiliarServices.changeTitle("Listado de Ingreso de Productos");
        }
        else if ($scope.tipoMovimiento_Global == 2) {
            auxiliarServices.changeTitle("Registro de Producto Terminado ");
        }

        // INICIALIZAMOS EL SELECT BUSCADOR

        //$('#ModalProducto').modal('show');
        $scope.titleModal = "Registro de Productos";
        // INICIALIZAMOS LISTA DE LOS SELECT LOCALES Y ALMACENES
        //$scope.getLocales();
        //$scope.getEstados();
 
        $scope.disabledContent = "";
        $scope.loaderSave = false;
        $timeout(function () {
            $(".filterCat").select2();
            $(".selectFiltros").select2();
        });

        let objParamsFormulario;


        if ($scope.tipoMovimiento_Global == 1) {
            if (localStorage.getItem('ParamsFormularioIngreso1')) {
                objParamsFormulario = JSON.parse(localStorage.getItem("ParamsFormularioIngreso1"));
            } 
        }
        else if ($scope.tipoMovimiento_Global == 2) {
            if (localStorage.getItem('ParamsFormularioIngreso2')) {
                objParamsFormulario = JSON.parse(localStorage.getItem("ParamsFormularioIngreso2"));
            } 
        }
        if (objParamsFormulario) {
            $timeout(function () {

                $scope.objFilter.idLocal = String(objParamsFormulario.idLocal);
                $scope.objFilter.idAlmacen = String(objParamsFormulario.idAlmacen);
                $scope.objFilter.idEstado = String(objParamsFormulario.idEstado);
                $scope.objFilter.fechaini = String(objParamsFormulario.fechaini);
                $scope.objFilter.fechafin = String(objParamsFormulario.fechafin);

                $scope.refrescandoFormulario(objParamsFormulario.idLocal, objParamsFormulario.idAlmacen, objParamsFormulario.idEstado);

                $timeout(function () {
                    $scope.getGuiasOrdenCompra();
                }, 1000);

            }, 0);

        } else {
            $scope.getLocales(0,0);
            $scope.getEstados(0);
        }    
    };
    
    $scope.refrescandoFormulario = function (idLocal, idAlmacen, idEstado ) {
          //---- listado locales------
        $scope.loaderfiltros = true;
        LocalesServices.get_Locales_Usuario(auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.listLocales = [];
                $scope.listLocales = data;
                setTimeout(function () {
                    $('#selectLocales').val(String(idLocal)).trigger('change.select2');
                    if (idLocal > 0) {
                        //---- listado almacenaes por local ------
                        AlmacenServices.getAlmacenesLocal(idLocal)
                            .then(function (res) {
                                $scope.listAlmacenes = [];
                                $scope.listAlmacenes = res;
                                $timeout(function () {
                                    $('#selectAlmacen').val(String(idAlmacen)).trigger('change.select2');

                                    //---- listado estados ------
                                    var tipoEstado = 'GALM';
                                    EstadosServices.getEstadosByTipo(tipoEstado)
                                        .then(function (res) {
                                            $scope.listEstados = res;
                                            setTimeout(function () {
                                                $('#selectEstado').val(String(idEstado)).trigger('change.select2');

                                                //----- listando toda la informacion ----
                                                $scope.getGuiasOrdenCompra();
                                            }, 0);
                                        }, function (err) {
                                            console.log(err);
                                        });
                                }, 0);
                            })
                    }
                }, 0);
            }, function (err) {
                console.log(err);
            });
    }

    $scope.objFilter = {
        idLocal: "0",
        idAlmacen: "0",
        idEstado: "0",
        fechaini: auxiliarServices.getDateNow(),
        fechaini_aux: '',
        fechafin: auxiliarServices.getDateNow(),
        fechafin_aux: '',
        busqueda:''
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
    var oTable;
    $scope.getGuiasOrdenCompra = function () {
        var p = $scope.objFilter;
        
        if (p.idLocal === 0 || p.idLocal === '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Local', 'error', '#ff6849', 1500);
            return false;
        }
        if (p.idAlmacen === 0 || p.idAlmacen === '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacén', 'error', '#ff6849', 1500);
            return false;
        }
               
        $scope.objFilter.fechaini_aux = '';
        $scope.objFilter.fechafin_aux = '';

        $scope.objFilter.fechaini_aux = auxiliarServices.changeFormatDate(2, $scope.objFilter.fechaini);
        $scope.objFilter.fechafin_aux = auxiliarServices.changeFormatDate(2, $scope.objFilter.fechafin);

        var filters = p.idLocal + '|' + p.idAlmacen + '|' + p.idEstado + '|' + p.fechaini_aux + '|' + p.fechafin_aux + '|' + $scope.tipoMovimiento_Global;


        let objParamsFormulario = {
            idLocal: $scope.objFilter.idLocal,
            idAlmacen: $scope.objFilter.idAlmacen,
            idEstado: $scope.objFilter.idEstado,
            fechaini: $scope.objFilter.fechaini,
            fechafin: $scope.objFilter.fechafin,
            busqueda: $scope.objFilter.busqueda,
        }

        if ($scope.tipoMovimiento_Global == 1) {
            localStorage.setItem('ParamsFormularioIngreso1', JSON.stringify(objParamsFormulario));
        }
        else if ($scope.tipoMovimiento_Global == 2) {
            localStorage.setItem('ParamsFormularioIngreso2', JSON.stringify(objParamsFormulario));
        }             


        $scope.loaderProd = true;
        IngresoGuiasServices.getGuiasOrdenCompra(filters).then(function (res) {
            res.forEach(function (item, index) {
                if (item.estado === 3) {
                    item['desEstado'] = "Generado";
                    item['colorEstado'] = "success";
                } else if (item.estado === 4) {
                    item['desEstado'] = "Anulado";
                    item['colorEstado'] = "danger";
                } else if (item.estado === 5) {
                    item['desEstado'] = "Cerrado";
                    item['colorEstado'] = "info";
                }
            });
            $scope.listGuiasCompras = res;
            $scope.loaderProd = false;
            $timeout(function () {
                if (oTable !== 'res') {
                    oTable = 'res';
                    auxiliarServices.initFooTable('tblProductos', 'inputSearch');
                } else {
                    $('#tblProductos').trigger('footable_initialize');
                }
            }, 1000);

        }, function (err) {
            console.log(err);
        });
    };

    $scope.getAnular = function (item) {
        if (item.estado === 4 || item.estado === '4') {
            return;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por anular la guia',
            type: 'warning'
        };
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res === true) {

                var params = {
                    id: item.id_GuiaCab,
                    estado : 4
                }
                IngresoGuiasServices.changeStatusGuiasOrdenCompra(params)
                    .then(function (res) {
                        var index = $scope.listGuiasCompras.indexOf(item);
                        $scope.listGuiasCompras[index].estado = 4;
                    });
            }
        });
    };

    $scope.getEstados = function (idEstado) {
        var tipoEstado = 'GALM';
        EstadosServices.getEstadosByTipo(tipoEstado)
        .then(function (res) {
            $scope.listEstados = res;
            setTimeout(function () {
                $('#selectEstado').val(String(idEstado)).trigger('change.select2');
            }, 0);
        }, function (err) {
            console.log(err);
        });
    };
    
    $scope.listLocales = [];
    $scope.getLocales = function (idLocal, idAlmacen) {
        $scope.loaderfiltros = true;
        LocalesServices.get_Locales_Usuario(auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.listLocales = [];
                $scope.listLocales = data;
                setTimeout(function () {
                    $('#selectLocales').val(String(idLocal)).trigger('change.select2');
                    if (idLocal > 0) {
                        $scope.change_localAlmacen(idLocal, idAlmacen);
                    }
                }, 0);

            }, function (err) {
                console.log(err);
            });
    };


    $scope.change_localAlmacen = function(idLocal, idAlmacen) {
        AlmacenServices.getAlmacenesLocal(idLocal)
            .then(function (res) {
                $scope.listAlmacenes = [];
                $scope.listAlmacenes = res;
                    $timeout(function () {
                        $('#selectAlmacen').val(String(idAlmacen)).trigger('change.select2');
                    },0);

            })
    }


    $scope.changeSelect = function (select, idSelect) {
        if (select === "locales") {
            AlmacenServices.getAlmacenesLocal(idSelect).then(function (res) {
                // SI NO DEVUELVE NINGUN ALMACEN DE ESTE LOCAL, LIMPIAMOS Y REGRESAMOS VALOR ALMACEN A 0
                if (res.length === 0) {
                    $scope.listAlmacenes = [];
                    $scope.objFilter.idAlmacen = "0";
                    $timeout(function () {
                        $('#selectLocales').val("0").trigger('change.select2');
                        $('#selectAlmacen').val("0").trigger('change.select2');
                    });
                    return;
                }
                //
                // SI DEVUELVE VALORES ENTONCES LLENAMOS SELECT ALMACEN Y SELECCIONAMOS EL PRIMER VALOR
                $scope.listAlmacenes = res;
                var newValue = String(res[0].id_Almacen);
                $scope.objFilter.idAlmacen = newValue;
                $timeout(function () {
                    $('#selectAlmacen').val(newValue).trigger('change.select2');
                });
            }, function (err) {
                console.log(err);
            });
        }
    };

    $scope.listOptionsMenu = [

    { nombre: 'Ingreso de Compra', icon: 'ti-file text-purple', eventClick: '1' },
    //{ nombre: 'Imp. Guias Compra', icon: 'ti-cloud-up text-danger', eventClick: '4' },
    //{ nombre: 'Vista Previa', icon: 'ti-search text-purple', eventClick: '5' },

    ];

    $scope.fucntionClickOptions = function (value, item) {
        var params;
        if (value === 1 || value === '1') {
            $location.path('/IngresoGuiasOrdenCompra');
            params = {
                option: 'save',
                value: value,
                idLocal: $scope.objFilter.idLocal,
                idAlmacen: $scope.objFilter.idAlmacen,
                objCab: '',
                tipoMovimiento_Global : $scope.tipoMovimiento_Global

            };
            auxiliarServices.paramsGuias('save', params);

        } else if (value === 2 || value === '2') {
            $location.path('/IngresoGuiasOrdenCompra');
            params = {
                option: 'update',
                value: value,
                idLocal: $scope.objFilter.idLocal,
                idAlmacen: $scope.objFilter.idAlmacen,
                objCab: item,
                tipoMovimiento_Global: $scope.tipoMovimiento_Global
            };
            auxiliarServices.paramsGuias('save', params);
        }

    };

    $('#ModalProducto').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#codigointerno').focus();
        }, 500);
    });

    $scope.getDataToPdf = function (item) {
        console.log(item);
        var params = {
            idGuiaCAb: item.id_GuiaCab
        }
        IngresoGuiasServices.getGuiasOrdenCompraDet(params).then(function (res) {

            res.forEach(function (item, index) {
                var importe = parseFloat(item.cantidad_GuiaDet) * parseFloat(item.precioCosto_GuiaDet);
                item['importe_GuiaDet'] = auxiliarServices.formatearNumero(importe, 2);
            })

            generatePdf(item, res);
            $timeout(function () {
                $scope.loaderDet = false;
            }, 500)
        }, function (err) {
            console.log(err);
        })
    }
    var generatePdf = function (item, itemDet) {

        console.log(item);
        console.log(itemDet);
        var doc = new jsPDF();
        var altura = 15;
        var alturaHeader = 15;
        //doc.setFont("courier");
        doc.setFontType("bold");
        doc.setFontSize(9);
        doc.text(alturaHeader, 20, "COBRA PERÚ");
        doc.setFontSize(8);
        doc.setFontType("normal");
        doc.text(180, 20, auxiliarServices.getDateNow());
        doc.text(180, 26, auxiliarServices.getHourNow());
        doc.setFontType("bold");
        doc.text(160, 32, "Cod. Interno : " + String(item.id_GuiaCab));
        doc.text(85, 32, "INGRESO POR COMPRAS");
        doc.line(85, 33, 120, 33) // horizontal line

        // NOMBRE DE CABECERA 1

        doc.text(alturaHeader, 45, "Número Interno");
        doc.setFontType("normal");
        doc.text(alturaHeader, 50, "Tipo de Documento");
        doc.text(alturaHeader, 55, "Numero de Documento");
        doc.text(alturaHeader, 60, "Fecha de Documento");
        doc.text(alturaHeader, 65, "Guia de Remisión");
        doc.text(alturaHeader, 70, "Fecha de Emisión");
        doc.text(alturaHeader, 75, "Fecha de Digitación");
        doc.text(alturaHeader, 80, "Digitador");

        // DATOS DE CABECERA 1
        alturaHeader += 30;
        doc.text(alturaHeader, 45, ": " + String(item.id_GuiaCab));
        doc.setFontType("normal");
        doc.text(alturaHeader, 50, ": " + String(item.des_tipo_documento));
        doc.text(alturaHeader, 55, ": " + String(item.nro_documento));
        doc.text(alturaHeader, 60, ": " + String(item.fechaEmision_GuiaCab));
        doc.text(alturaHeader, 65, ": " + String(item.nro_guia_remision));
        doc.text(alturaHeader, 70, ": " + String(item.fecha_emision));
        doc.text(alturaHeader, 75, ": " + String(item.fecha_creacion));
        doc.text(alturaHeader, 80, ": " + String(item.usuario_creacion));
        // NOMBRES CABECERA 2
        alturaHeader += 65;
        doc.text(alturaHeader, 45, "Movimiento");
        doc.text(alturaHeader, 50, "Moneda");
        doc.text(alturaHeader, 55, "Orden de Compra");
        doc.text(alturaHeader, 60, "Proveedor");
        doc.text(alturaHeader, 70, "Almacen");
        doc.text(alturaHeader, 75, "Estado");
        doc.text(alturaHeader, 80, "Observación");

        // DATOS CABECERA 2
        alturaHeader += 30;
        doc.text(alturaHeader, 45, ": " + String(item.des_movimiento));
        doc.setFontType("normal");
        doc.text(alturaHeader, 50, ": " + item.des_moneda);
        doc.text(alturaHeader, 55, ": " + item.nro_orden_compra);
        doc.text(alturaHeader, 60, ": " + String(item.razonSocial_Proveedor).substring(0, 25));
        doc.text(alturaHeader + 1, 64, " " + String(item.razonSocial_Proveedor).substring(25, String(item.razonSocial_Proveedor).length));
        doc.text(alturaHeader, 70, ": " + String(item.descripcion_Almacen));
        doc.text(alturaHeader, 75, ": " + item.des_estado);
        doc.text(alturaHeader, 80, ": " + item.obs_GuiaCab);

        // DETALLE
        var xDetalle = 15;
        var yDetalle = 90;
        doc.line(xDetalle, yDetalle, 199, yDetalle) // horizontal line

        doc.setFontType("bold");


        doc.text(xDetalle + 5, yDetalle + 7, "Matricula");



        doc.text(xDetalle + 45, yDetalle + 7, "Descripción");

        doc.text(xDetalle + 90, yDetalle + 5, "UM");


        doc.text(xDetalle + 100, yDetalle + 5, "Cantidad");

        doc.text(xDetalle + 120, yDetalle + 5, "Importes Ingresados");
        doc.setFontSize(7);
        doc.text(xDetalle + 120, yDetalle + 10, "Precio");

        doc.text(xDetalle + 135, yDetalle + 10, "Sub Total");



        doc.setFontSize(8);

        doc.text(xDetalle + 154, yDetalle + 5, "Importes en Soles");
        doc.line(xDetalle + 116, yDetalle + 7, 199, yDetalle + 7) // horizontal line

        doc.setFontSize(7);
        doc.text(xDetalle + 154, yDetalle + 10, "Precio");

        doc.text(xDetalle + 168, yDetalle + 10, "Sub Total");



        doc.setFontSize(8);
        yDetalle += 13;

        doc.line(xDetalle, yDetalle, 199, yDetalle) // horizontal line



        // DETALLE
        doc.setFontType("normal");

        yDetalleAux = yDetalle + 5;
        doc.setFontSize(7);
        itemDet.forEach(function (row, indx) {


            doc.text(xDetalle + 5, yDetalleAux, row.codigo1_Producto);
            doc.text(xDetalle + 25, yDetalleAux, String(row.abreviatura_Producto).substring(0, 30));

            doc.setFontSize(6);
            doc.text(xDetalle + 89, yDetalleAux, String(row.abreviatura_UnidadMedida));
            doc.setFontSize(7);
            doc.text(xDetalle + 105, yDetalleAux, String(row.cantidad_GuiaDet));
            doc.text(xDetalle + 121, yDetalleAux, String(parseFloat(row.precioCosto_GuiaDet).toFixed(2)));
            doc.text(xDetalle + 135, yDetalleAux, String((parseFloat(row.cantidad_GuiaDet) * parseFloat(row.precioCosto_GuiaDet)).toFixed(2)));


            doc.text(xDetalle + 155, yDetalleAux, String(parseFloat(row.precioCosto_GuiaDet).toFixed(2)));
            doc.text(xDetalle + 168, yDetalleAux, String((parseFloat(row.cantidad_GuiaDet) * parseFloat(row.precioCosto_GuiaDet)).toFixed(2)));

            doc.line(xDetalle, yDetalleAux + 2, 199, yDetalleAux + 2) // horizontal line
            yDetalleAux += 6;

        })

        yDetalleAux -= 4;
        doc.line(xDetalle, yDetalle - 13, xDetalle, yDetalleAux) // Vertical line

        doc.line(xDetalle + 22, yDetalle - 13, xDetalle + 22, yDetalleAux) // Vertical line
        doc.line(xDetalle + 87, yDetalle - 13, xDetalle + 87, yDetalleAux) // Vertical line
        doc.line(xDetalle + 97, yDetalle - 13, xDetalle + 97, yDetalleAux) // Vertical line

        doc.line(xDetalle + 116, yDetalle - 13, xDetalle + 116, yDetalleAux) // Vertical line
        doc.line(xDetalle + 132, yDetalle + 7 - 13, xDetalle + 132, yDetalleAux) // Vertical line
        doc.line(xDetalle + 150, yDetalle - 13, xDetalle + 150, yDetalleAux) // Vertical line
        doc.line(xDetalle + 166, yDetalle + 7 - 13, xDetalle + 166, yDetalleAux) // Vertical line
        doc.line(xDetalle + 184, yDetalle - 13, xDetalle + 184, yDetalleAux) // Vertical line


        var generarPdf = function () {
            var string = doc.output('datauristring');
            var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
            var x = window.open();
            x.document.open();
            x.document.write(iframe);
            x.document.close();

            setTimeout(function () {
                doc.save('Reporte.pdf');

            }, 0);

        }
        generarPdf();
    }

    $scope.getHabilitarGuia = function (item) {
        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Habilitar la guia Nro : ' + item.nro_guia_remision ,
            type: 'confirmationAlert'
        };
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res === true) {
                IngresoGuiasServices.set_habilitandoGuia(item.id_GuiaCab, idUsuario_Global )
                    .then(function (res) {
                        $scope.getGuiasOrdenCompra();
                    });
            }
        });
    };



})