var app = angular.module('appGestion.productosController', []);

app.controller('ctrlProductosAlmacen', function ($scope, loginServices, $location, productoModeloServices, ListaPrecioServices, productoMarcaServices, productoLineaServices, productoSubLineaServices, $timeout, auxiliarServices, productosServices, productoCategoriaServices, umServices, AuditarServices) {

 

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Producto ");
        $scope.titleModal = "Registro de Producto";

        $scope.loaderSave = false;
        $scope.loader = true;
        //$scope.get_ProductosList();
        $scope.get_Listando_Categoria();
        $scope.get_ListandoCategoria();

        $scope.changeSelectMarca(0,1);
        //$scope.get_Listando_linea();
        $scope.get_Listando_MarcaModa();
        $scope.get_Listando_UnidadModal();

        $scope.get_listStatus();
        setTimeout(function () {
            $(".select_modal").select2();
            $scope.estados = '1';
            $('#cboestadoFilter').val(String('1')).trigger('change.select2');
        }, 200);
    };


    $scope.Producto = [];
    $scope.get_ProductosList = function () {
 
        $scope.loader = true;
        productosServices.getProductos()
            .then(function (data) {
                $scope.loader = false;
                $scope.Producto = [];
                $scope.Producto = data; 
                //$timeout(function () { auxiliarServices.initFooTable('tblProductos', 'inputSearch'); }, 500);
                $timeout(function () {
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('tblProductos', 'inputSearch');
                    } else {
                        $('#tblProductos').trigger('footable_initialize');
                    }
                }, 1000);

            }, function (err) {
                console.log(err);
            });
    };

    var oTable;
    $scope.changeSelectMarca = function (id_marca, idEstado) {

        if (idEstado == 0) {
            idEstado = '';
        }
        if (idEstado == 2) {
            idEstado = '0';
        }

        $scope.loader = true;
        productosServices.get_productoMarca(id_marca, idEstado)
            .then(function (data) {
                $scope.loader = false;
                $scope.Producto = [];
                $scope.Producto = data;
                $timeout(function () {
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('tblProductos', 'inputSearch');
                    } else {
                        $('#tblProductos').trigger('footable_initialize');
                    }
                }, 1000);
            });
    };

    $scope.Lista_Categoria = [];
    $scope.get_Listando_Categoria = function () {
        $scope.loader = true;
        productoCategoriaServices.getProductoCategoria()
            .then(function (res) {
                $scope.loader = false;
                $scope.Lista_Categoria = [];
                $scope.Lista_Categoria = res;
                $scope.get_Listando_UnidadMe();
                $timeout(function () {
                });
            }, function (err) {
                console.log(err);
            });
    };


    $scope.ListaUnidadMedida = [];
    $scope.get_Listando_UnidadMe = function () {
        $scope.loader = true;
        umServices.getUnidadMedida()
            .then(function (res) {
                $scope.loader = false;
                $scope.ListaUnidadMedida = [];
                $scope.ListaUnidadMedida = res;
                $scope.get_Listando_Marca();
                $timeout(function () {
                });
            }, function (err) {
                console.log(err);
            });
    };

    $scope.ListaMarca = [];
    $scope.get_Listando_Marca = function () {
        $scope.loader = true;
        productoMarcaServices.getProductoMarca()
            .then(function (res) {
                $scope.loader = false;
                $scope.ListaMarca = [];
                $scope.ListaMarca = res;
                $timeout(function () {
                    $(".selectFiltros").select2();
                    $('#cbo_categoria').val("0").trigger('change.select2');
                    $('#cbo_unidad').val("0").trigger('change.select2');
                    $('#cbo_marca').val("0").trigger('change.select2');
                });
            }, function (err) {
                console.log(err);
            });
    };
       
    // CARGADO DE DATOS DE MODAL 
    $scope.ListaUnidadMedidaModal = [];
    $scope.get_Listando_UnidadModal = function () {
        $scope.loader = true;
        umServices.getUnidadMedida()
            .then(function (res) {
                $scope.loader = false;
                $scope.ListaUnidadMedidaModal = [];
                $scope.ListaUnidadMedidaModal = res;
                $scope.get_Listando_Marca();
                $timeout(function () {
                    $(".filterUnidadMedida").select2();
                    $('#cbo_categoria').val("0").trigger('change.select2');
                });
            }, function (err) {
                console.log(err);
            });
    };



    $scope.ListaCategoriaModal = [];
    $scope.get_ListandoCategoria = function () {
        $scope.loader = true;
        productoCategoriaServices.getProductoCategoria()
            .then(function (res) {
                $scope.loader = false;
                $scope.ListaCategoriaModal = [];
                $scope.ListaCategoriaModal = res;
                $timeout(function () {
                    $('.filterCategoria').select2();
                    $('.filterProdLinea').select2();
                    $('.filterProdSubLinea').select2();
                });
            }, function (err) {
                console.log(err);
            });
    };

    $scope.ListaMarcaModal = [];
    $scope.get_Listando_MarcaModa = function () {
        $scope.loader = true;
        productoMarcaServices.getProductoMarca()
            .then(function (res) {
                $scope.loader = false;
                $scope.ListaMarcaModal = [];
                $scope.ListaMarcaModal = res;
                $timeout(function () {
                    $(".selectFiltros").select2();
                    $('#cbo_marcaModal').val("0").trigger('change.select2');
                });
            }, function (err) {
                console.log(err);
            });
    };

    $scope.listStatus = [];
    $scope.get_listStatus = function () {
        $scope.listStatus.push(
            { id: 0, descripcion: '[ ----   Todos  --- ]' },
            { id: 1, descripcion: 'Activos' },
            { id: 2, descripcion: 'Anulados' }
        );
    };


    idProducto_Global = 0;


    // CAHNGESELECT PARA CALCULAR EL FACTOR DE LAS UNIDADES MEDIDAS 
    $scope.changeSelectsUnidad = function (select, idSelect) {
        if (select === "unidad") {
            umServices.get_unidadMedida(idSelect)
                .then(function (res) {
                    if (res.length === 0) {
                        $scope.Lista_UnidadMedida = [];
                        $scope.objeto_parametros.id_unidadMedida = "0";
                        $timeout(function () {
                            $('#cbo_unidad').val("0").trigger('change.select2');
                            $('#cbo_unidad1').val("0").trigger('change.select2');
                            $('#cbo_unidad2').val("0").trigger('change.select2');
                        });

                        return;
                    }
                    $scope.Lista_UnidadMedida = res;
                    if ($scope.Flag_modoEdicion === true) {
                        $timeout(function () {
                            $('#cbo_unidad1').val($scope.objeto_parametros.id_unidadMedida).trigger('change.select2');
                            $('#cbo_unidad2').val($scope.objeto_parametros.id_unidadMedida).trigger('change.select2');
                        });

                        return;
                    }

                    var newValue = String(res[0].id_unidadMedida);
                    $scope.objeto_parametros.id_unidadMedida = newValue;

                    $timeout(function () {
                        $('#cbo_unidad1').val(newValue).trigger('change.select2');
                        $('#cbo_unidad2').val(newValue).trigger('change.select2');
                    });
                }, function (err) {
                    console.log(err);
                });
        }
    };

    // CHANGESELECT PARA SELECCIONAR MODELOMARCA DEL PRODUCTO
    $scope.changeSelects = function (select, idSelect) {
        if (select === "marca") {
            productoModeloServices.get_marcaProducto(idSelect)
                .then(function (res) {
                    if (res.length === 0) {
                        $scope.Lista_ModeloMarca = [];
                        $scope.objeto_parametros.id_modeloProducto = "0";
                        $timeout(function () {
                            $('#cbo_marcaModal').val("0").trigger('change.select2');
                            $('#cbo_modeloPro').val("0").trigger('change.select2');
                        });

                        return;
                    }
                    $scope.Lista_ModeloMarca = res;
                    if ($scope.Flag_modoEdicion === true) {
                        $timeout(function () {
                            $('#cbo_modeloPro').val($scope.objeto_parametros.id_modeloProducto).trigger('change.select2');
                        });

                        return;
                    }

                    var newValue = String(res[0].id_modeloProducto);
                    $scope.objeto_parametros.id_modeloProducto = newValue;

                    $timeout(function () {
                        $('#cbo_modeloPro').val(newValue).trigger('change.select2');
                    });
                }, function (err) {
                    console.log(err);
                });
        }
    };

    $scope.objEstados = {
        activo: true,
        text: 'Activo',
        colorText: '#2c5ca9'
    };

    $scope.changeStatus = function (status) {
        if (status) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = "ACTIVO";
            $scope.objEstados.colorText = "#2c5ca9";
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "INACTIVO";
            $scope.objEstados.colorText = "#b3192c";
        }
    };

    $('#ModalProducto').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#txtcod_1').focus();
        }, 500);

    });

    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $scope.idProducto_Global = 0 
        $('#ModalProducto').modal('show');

    };

    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;
        $scope.EdicionRegistros(obj);
        $('#ModalProducto').modal('show');

    };

    $scope.imgProducto = "../content/img/sinImagen.jpg"; 
    $scope.openFile = function () {
        $('#inputFileOpen').click();
    };

    $scope.files = {};
    $scope.changeImagen = function (event) {
        var filesTemporal = event.target.files; //FileList object
        for (var i = 0; i < filesTemporal.length; i++) { //for multiple files          
            (function (file) {
                var name = file;
                var reader = new FileReader();
                reader.onload = function (e) {
                    let urlImage = e.target;
                    $scope.files = {
                        'file': name,
                        'namefile': name.name,
                        'urlfile': urlImage['result'],
                    }
                    $scope.imgProducto = urlImage['result'];
                    $scope.$apply();       
                }
                reader.readAsDataURL(file);
            })(filesTemporal[i]);
        }
    };
    

    $scope.Flag_modoEdicion = false;

    $scope.objeto_parametros = {
        id_Producto: 0,
        codigo1_Producto: '',
        codigo2_Producto: '',
        CodigoBarra_Producto: '',
        nombre_Producto: '',
        descripcion_producto: '',
        abreviatura_Producto: '',
        preciocompra_producto: '',
        precioventa_producto: '',

        precioMay_Menor: '',
        precioMay_Mayor: '',

        RangoCaja_Horizontal: '',
        RangoCaja_Mayorista: '',
        
        id_unidadMedida: '0',
        url_foto_Producto: '',
        peso_Producto: '',
        id_categoriaProducto: '0',
        id_lineaProducto: '0',
        id_subLineaProducto: '0',
        id_marcaProducto: '0',
        id_modeloProducto: '0',
        tiempoVida_Producto: '',
        stockminimo_Producto: '',
        id_UnidadMedidaAlm: '0',
        factorMultiplicacion_Alm: '',
        factorDivisor_Alm: '',
        id_UnidadMedidaVta: '0',
        factorMultiplicacion_Vta: '',
        factorDivisor_Vta: '',
        estado: 1,
        usuario_Creacion: 1,

        afectoIGV: false,
        afectoISC: false,
        aplicaDetraccion: false,

        aplicaPercepcion: false,
        movLote: false,
        aplicaFecVence: false,
        stockMinimo: '0',

        id_unidadMedida_Cobertura: '0',
        id_unidadMedida_Mayorista: '0',
    };


    $scope.clean = function () {
        $scope.objeto_parametros.id_Producto = 0;
        $scope.objeto_parametros.codigo1_Producto = '';
        $scope.objeto_parametros.codigo2_Producto = '';
        $scope.objeto_parametros.CodigoBarra_Producto = '';
        $scope.objeto_parametros.nombre_Producto = '';
        $scope.objeto_parametros.descripcion_producto = '';
        $scope.objeto_parametros.abreviatura_Producto = '';
        
        $scope.objeto_parametros.preciocompra_producto = '';
        $scope.objeto_parametros.precioventa_producto = '';
        $scope.objeto_parametros.precioMay_Menor = '';
        $scope.objeto_parametros.precioMay_Mayor = '';
        $scope.objeto_parametros.RangoCaja_Horizontal = '';
        $scope.objeto_parametros.RangoCaja_Mayorista = '';
        
        $scope.objeto_parametros.factorMultiplicacion_Alm = '';
        $scope.objeto_parametros.factorDivisor_Alm = '';
        $scope.objeto_parametros.factorMultiplicacion_Vta = '';
        $scope.objeto_parametros.factorDivisor_Vta = '';
        $scope.objeto_parametros.id_unidadMedida = '0';
        $scope.objeto_parametros.url_foto_Producto = '';
        $scope.objeto_parametros.peso_Producto = '';
        $scope.objeto_parametros.id_categoriaProducto = '0';
        $scope.objeto_parametros.id_lineaProducto = '0';
        $scope.objeto_parametros.id_subLineaProducto = '0';
        $scope.objeto_parametros.id_marcaProducto = '0';
        $scope.objeto_parametros.id_modeloProducto = '0';
        $scope.objeto_parametros.tiempoVida_Producto = '';
        $scope.objeto_parametros.stockminimo_Producto = '';
        $scope.objeto_parametros.id_UnidadMedidaAlm = '0';
        $scope.objeto_parametros.factorMultiplicacion_Alm = '';
        $scope.objeto_parametros.factorDivisor_Alm = '';
        $scope.objeto_parametros.id_UnidadMedidaVta = '0';
        $scope.objeto_parametros.factorMultiplicacion_Vta = "";
        $scope.objeto_parametros.factorDivisor_Vta = '';
        $scope.objeto_parametros.estado = 1;
        $scope.objeto_parametros.usuario_Creacion = 1;
        
        $scope.objeto_parametros.afectoIGV = false;
        $scope.objeto_parametros.afectoISC = false;
        $scope.objeto_parametros.aplicaDetraccion = false;
        $scope.objeto_parametros.aplicaPercepcion = false;
        $scope.objeto_parametros.movLote = false;
        $scope.objeto_parametros.aplicaFecVence = false;
        $scope.objeto_parametros.stockMinimo = '0';

        $scope.objeto_parametros.id_unidadMedida_Cobertura = '0';
        $scope.objeto_parametros.id_unidadMedida_Mayorista = '0';


        $('.selectModal').val("0").trigger('change.select2');
        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';


        setTimeout(function () {
            $('#cbo_unidad').val("0").trigger('change.select2');
            $('#cbo_categoria').val("0").trigger('change.select2');
            $('#cbo_tipo_linea').val("0").trigger('change.select2');
            $('#cbo_tipo_Sublinea').val("0").trigger('change.select2');
            $('#cbo_marcaModal').val("0").trigger('change.select2');
            $('#cbo_modeloPro').val("0").trigger('change.select2');
            $('#cbo_unidadModal').val("0").trigger('change.select2');
            $('#cbo_categoriaModal').val("0").trigger('change.select2');

            $('#cbo_cobertura').val("0").trigger('change.select2');
            $('#cbo_mayorista').val("0").trigger('change.select2');


        }, 100);

        $scope.files = {};
        $scope.imgProducto = "../content/img/sinImagen.jpg"; 
        $("#inputFileOpen").val('');

    };


    $scope.changeSelect = function (select, idSelect) {
        if (select === "categorias") {
            productoLineaServices.getProductLinea(idSelect)
                .then(function (res) {
                    if (res.length === 0) {
                        $scope.Lista_LineaProducto = [];
                        $scope.Lista_SubLineaProducto = [];
                        $scope.objeto_parametros.id_lineaProducto = "0";
                        $timeout(function () {
                            $('#cbo_categoriaModal').val("0").trigger('change.select2');
                            $('#cbo_tipo_linea').val("0").trigger('change.select2');
                            $('#cbo_tipo_Sublinea').val("0").trigger('change.select2');
                        });

                        return;
                    }
                    $scope.Lista_LineaProducto = res;
                    if ($scope.Flag_modoEdicion === true) {
                        $timeout(function () {
                            $('#cbo_tipo_linea').val($scope.objeto_parametros.id_lineaProducto).trigger('change.select2');
                            $scope.changeSelect('linea', $scope.objeto_parametros.id_lineaProducto);
                        });

                        return;
                    }

                    var newValue = String(res[0].id_lineaProducto);
                    $scope.objeto_parametros.id_lineaProducto = newValue;

                    $timeout(function () {
                        $('#cbo_tipo_linea').val(newValue).trigger('change.select2');
                        $scope.changeSelect('linea', newValue);
                    });
                }, function (err) {
                    console.log(err);
                });
        } else if (select === "linea") {
            productoSubLineaServices.getProductSLinea(idSelect)
                .then(function (res) {
                    if (res.length === 0) {
                        $scope.Lista_SubLineaProducto = [];
                        $scope.objeto_parametros.id_subLineaProducto = "0";
                        $timeout(function () {
                            $('#cbo_tipo_Sublinea').val("0").trigger('change.select2');
                        });

                        return;
                    }
                    $scope.Lista_SubLineaProducto = res;
                    if ($scope.Flag_modoEdicion === true) {
                        $timeout(function () {
                            $('#cbo_tipo_Sublinea').val($scope.objeto_parametros.id_subLineaProducto).trigger('change.select2');
                        });

                        return;
                    }
                    var newValue = String(res[0].id_subLineaProducto);
                    $scope.objeto_parametros.id_subLineaProducto = newValue;

                    $timeout(function () {
                        $('#cbo_tipo_Sublinea').val(newValue).trigger('change.select2');
                    });
                }, function (err) {
                    console.log(err);
                });
        }
    };

    var objAux;

    $scope.EdicionRegistros = function (obj) {
 

        objAux = '';
        objAux = obj;

        $scope.idProducto_Global = obj.id_Producto;

        $scope.objeto_parametros.id_Producto = obj.id_Producto;
        $scope.objeto_parametros.codigo1_Producto = obj.codigo1_Producto;
        $scope.objeto_parametros.codigo2_Producto = obj.codigo2_Producto;
        $scope.objeto_parametros.CodigoBarra_Producto = obj.CodigoBarra_Producto;
        $scope.objeto_parametros.nombre_Producto = obj.nombre_Producto;
        $scope.objeto_parametros.descripcion_producto = obj.descripcion_producto;
        $scope.objeto_parametros.preciocompra_producto = obj.preciocompra_producto;
        $scope.objeto_parametros.precioventa_producto = obj.precioventa_producto;

        $scope.objeto_parametros.precioMay_Menor = obj.precioMay_Menor;
        $scope.objeto_parametros.precioMay_Mayor = obj.precioMay_Mayor;

        $scope.objeto_parametros.RangoCaja_Horizontal = obj.RangoCaja_Horizontal;
        $scope.objeto_parametros.RangoCaja_Mayorista = obj.RangoCaja_Mayorista;

        $scope.objeto_parametros.abreviatura_Producto = obj.abreviatura_Producto;
        $scope.objeto_parametros.id_unidadMedida = obj.id_unidadMedida;
        $scope.objeto_parametros.peso_Producto = obj.peso_Producto;
        $scope.objeto_parametros.id_categoriaProducto = obj.id_categoriaProducto;
        $scope.objeto_parametros.id_lineaProducto = obj.id_lineaProducto;
        $scope.objeto_parametros.id_subLineaProducto = obj.id_subLineaProducto;
        $scope.objeto_parametros.id_marcaProducto = obj.id_marcaProducto;
        $scope.objeto_parametros.id_modeloProducto = obj.id_modeloProducto;
        $scope.objeto_parametros.tiempoVida_Producto = obj.tiempoVida_Producto;
        $scope.objeto_parametros.stockminimo_Producto = obj.stockminimo_Producto;
        $scope.objeto_parametros.factorMultiplicacion_Alm = obj.factorMultiplicacion_Alm;
        $scope.objeto_parametros.factorDivisor_Alm = obj.factorDivisor_Alm;
        $scope.objeto_parametros.factorMultiplicacion_Vta = obj.factorMultiplicacion_Vta;
        $scope.objeto_parametros.factorDivisor_Vta = obj.factorDivisor_Vta;


        $scope.objeto_parametros.afectoIGV = (obj.afectoIGV==1)?true :false ;
        $scope.objeto_parametros.afectoISC = (obj.afectoISC == 1) ? true : false ;
        $scope.objeto_parametros.aplicaDetraccion = (obj.aplicaDetraccion == 1) ? true : false  ;
        $scope.objeto_parametros.aplicaPercepcion = (obj.aplicaPercepcion == 1) ? true : false ;
        $scope.objeto_parametros.movLote = (obj.movLote == 1) ? true : false ;
        $scope.objeto_parametros.aplicaFecVence = (obj.aplicaFecVence == 1) ? true : false  ;
        $scope.objeto_parametros.stockMinimo = obj.stockMinimo;

        $scope.objeto_parametros.id_unidadMedida_Cobertura = String(obj.id_unidadMedida_Cobertura);
        $scope.objeto_parametros.id_unidadMedida_Mayorista = String(obj.id_unidadMedida_Mayorista);



        $scope.objeto_parametros.usuario_Creacion = 1;
        $scope.objeto_parametros.estado = obj.estado;

        $scope.changeSelect('categorias', $scope.objeto_parametros.id_categoriaProducto);
        $scope.changeSelects('marca', $scope.objeto_parametros.id_marcaProducto);
        //$scope.changeSelectsUnidad('unidad', $scope.objeto_parametros.id_unidadMedida);


        $scope.imgProducto = obj.url_foto_Producto;

        if (obj.estado === 1) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = 'Activo';
            $scope.objEstados.colorText = '#2c5ca9';
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }
        setTimeout(function () {
            $('#cbo_unidadModal').val(obj.id_unidadMedida).trigger('change.select2');
            $('#cbo_categoriaModal').val(obj.id_categoriaProducto).trigger('change.select2');
            $('#cbo_tipo_linea').val(obj.id_lineaProducto).trigger('change.select2');
            $('#cbo_tipo_Sublinea').val(obj.id_subLineaProducto).trigger('change.select2');
            $('#cbo_marcaModal').val(obj.id_marcaProducto).trigger('change.select2');
            $('#cbo_modeloPro').val(obj.id_modeloProducto).trigger('change.select2');

            $('#cbo_cobertura').val(String(obj.id_unidadMedida_Cobertura) ).trigger('change.select2');
            $('#cbo_mayorista').val(String(obj.id_unidadMedida_Mayorista)  ).trigger('change.select2');
        }, 100);

    };

    $scope.validarCodProducto = function () {
        var result = false;
        $scope.Producto.forEach(function (item, index) {
            if (item.codigo1_Producto === $scope.objeto_parametros.codigo1_Producto) {

                result = true;
            }
        });

        return result;
    };
    $scope.validarCodBarraProducto = function () {
        var result = false;
        $scope.Producto.forEach(function (item, index) {
            if (item.CodigoBarra_Producto === $scope.objeto_parametros.CodigoBarra_Producto) {

                result = true;
            }
        });

        return result;
    };


    var pressButton = false;
    $scope.GuardarRegistro = function () { 

        if (pressButton) {
            return;
        }
        pressButton = true;
        if (productosServices.ValidacionGeneral($scope.objeto_parametros) === false) {
            pressButton = false;
            return;
        }
          

        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;
        $scope.objeto_parametros.afectoIGV = $scope.objeto_parametros.afectoIGV == true ? 1 : 0;
        $scope.objeto_parametros.aplicaDetraccion = $scope.objeto_parametros.aplicaDetraccion == true ? 1 : 0;
        $scope.objeto_parametros.movLote = $scope.objeto_parametros.movLote == true ? 1 : 0;

        $scope.objeto_parametros.afectoISC = $scope.objeto_parametros.afectoISC == true ? 1 : 0;
        $scope.objeto_parametros.aplicaPercepcion = $scope.objeto_parametros.aplicaPercepcion == true ? 1 : 0;
        $scope.objeto_parametros.aplicaFecVence = $scope.objeto_parametros.aplicaFecVence == true ? 1 : 0;
        

        if ($scope.Flag_modoEdicion === false) { // nuevo registroo
            if ($scope.validarCodProducto() === true) {
                auxiliarServices.NotificationMessage('Sistemas', 'El codigo del Producto ingresado ya existe, Vuelva a Ingresar', 'error', '#ff6849', 2000);
                pressButton = false;
                return;
            }
            if ($scope.validarCodBarraProducto() === true) {
                auxiliarServices.NotificationMessage('Sistemas', 'El codigo de  Barra del Producto ingresado ya existe, Vuelva a Ingresar', 'error', '#ff6849', 2000);
                pressButton = false;
                return;
            }
            $scope.loaderSave = true;
            productosServices.saveProductos($scope.objeto_parametros)
                .then(function (data) {

                    $scope.objeto_parametros.afectoIGV = $scope.objeto_parametros.afectoIGV == 1 ? true : false;
                    $scope.objeto_parametros.aplicaDetraccion = $scope.objeto_parametros.aplicaDetraccion == 1 ? true : false;
                    $scope.objeto_parametros.movLote = $scope.objeto_parametros.movLote == 1 ? true : false;
                    $scope.objeto_parametros.afectoISC = $scope.objeto_parametros.afectoISC == 1 ? true : false;
                    $scope.objeto_parametros.aplicaPercepcion = $scope.objeto_parametros.aplicaPercepcion == 1 ? true : false;
                    $scope.objeto_parametros.aplicaFecVence = $scope.objeto_parametros.aplicaFecVence == 1 ? true : false;

                    $scope.Producto.push(data);
                    $scope.get_ProductosList();

                    ///----almacenando la imagen en el servidor
                    $scope.upload_imageProduct(data.id_Producto);

                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso de Registro realizado correctamente !'
                        };
                        auxiliarServices.initSweetAlert(params).then(function (res) {
                            $('#ModalProducto').modal('hide');
                            var e = document.getElementById('cbo_marca');
                            var MarcaSelect = e.options[e.selectedIndex].value;
                            $scope.changeSelectMarca(MarcaSelect,1);
                        });
                        pressButton = false;
                        $scope.loaderSave = false;
                    }, 500);

                }, function (error) {
                        $scope.objeto_parametros.afectoIGV = $scope.objeto_parametros.afectoIGV == 1 ? true : false;
                        $scope.objeto_parametros.aplicaDetraccion = $scope.objeto_parametros.aplicaDetraccion == 1 ? true : false;
                        $scope.objeto_parametros.movLote = $scope.objeto_parametros.movLote == 1 ? true : false;
                        $scope.objeto_parametros.afectoISC = $scope.objeto_parametros.afectoISC == 1 ? true : false;
                        $scope.objeto_parametros.aplicaPercepcion = $scope.objeto_parametros.aplicaPercepcion == 1 ? true : false;
                        $scope.objeto_parametros.aplicaFecVence = $scope.objeto_parametros.aplicaFecVence == 1 ? true : false;

                    $timeout(function () {
                        pressButton = false;
                        let paramsErr = {
                            type: 'error',
                            title: 'Error !',
                            text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                        };
                        auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                        });
                        $scope.loaderSave = false;
                        console.log(error);
                    }, 500);
                });

        } else {  //actualizar

            $scope.loaderSave = true;
            productosServices.update_Producto($scope.objeto_parametros)
                .then(function (data) {

                    $scope.objeto_parametros.afectoIGV = $scope.objeto_parametros.afectoIGV == 1 ? true : false;
                    $scope.objeto_parametros.aplicaDetraccion = $scope.objeto_parametros.aplicaDetraccion == 1 ? true : false;
                    $scope.objeto_parametros.movLote = $scope.objeto_parametros.movLote == 1 ? true : false;
                    $scope.objeto_parametros.afectoISC = $scope.objeto_parametros.afectoISC == 1 ? true : false;
                    $scope.objeto_parametros.aplicaPercepcion = $scope.objeto_parametros.aplicaPercepcion == 1 ? true : false;
                    $scope.objeto_parametros.aplicaFecVence = $scope.objeto_parametros.aplicaFecVence == 1 ? true : false;

                    if (data === "Ok") {
                        $scope.Producto.push(data);

                        ///----almacenando la imagen en el servidor
                        $scope.upload_imageProduct($scope.objeto_parametros.id_Producto);

                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Actualizacion realizado correctamente !'
                            };
                            pressButton = false;
                            auxiliarServices.initSweetAlert(params)
                                .then(function (res) {
                                    $('#ModalProducto').modal('hide');
                                    var e = document.getElementById('cbo_marca');
                                    var MarcaSelect = e.options[e.selectedIndex].value;
                                    $scope.changeSelectMarca(MarcaSelect,1);
                                });
                            $scope.loaderSave = false;
                        }, 500);
                    } else {
                        pressButton = false;
                        $timeout(function () {
                            let paramsErr = {
                                type: 'error',
                                title: 'Error !',
                                text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                            };
                            auxiliarServices.initSweetAlert(paramsErr).then(function (res) {
                                $('#ModalProducto').modal('hide');
                                var e = document.getElementById('cbo_marca');
                                var MarcaSelect = e.options[e.selectedIndex].value;
                                $scope.changeSelectMarca(MarcaSelect,1);
                            });
                            $scope.loaderSave = false;
                        }, 500);
                    }
                }, function (error) {

                        $scope.objeto_parametros.afectoIGV = $scope.objeto_parametros.afectoIGV == 1 ? true : false;
                        $scope.objeto_parametros.aplicaDetraccion = $scope.objeto_parametros.aplicaDetraccion == 1 ? true : false;
                        $scope.objeto_parametros.movLote = $scope.objeto_parametros.movLote == 1 ? true : false;
                        $scope.objeto_parametros.afectoISC = $scope.objeto_parametros.afectoISC == 1 ? true : false;
                        $scope.objeto_parametros.aplicaPercepcion = $scope.objeto_parametros.aplicaPercepcion == 1 ? true : false;
                        $scope.objeto_parametros.aplicaFecVence = $scope.objeto_parametros.aplicaFecVence == 1 ? true : false;

                    pressButton = false;
                    console.log(error);
                });

        }
    };


    $scope.upload_imageProduct = function (id_producto) {

        if (Object.keys($scope.files).length === 0) {
            return;
        } 
        console.log('entro save imagen')
        $scope.loaderSave = true;
        productosServices.uploadFile_imageProducto($scope.files.file, auxiliarServices.getUserId(), id_producto )
            .then(function (res) {
                $scope.loaderSave = false;
                if (res.ok == false ) {
                    auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error almacenando la imagen.', 'error', '#ff6849', 2500);
                    alert(res.data);
                }
            }, function (error) {
                    $scope.loaderSave = false;
                alert(error.ExceptionMessage)
            });
    };


    $scope.getAnular = function (item) {

        if (item.estado === 0 || item.estado === '0') {
            return;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por anular un Porducto',
            type: 'warning'
        };
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res === true) {
                productosServices.anular_producto(item.id_Producto)
                    .then(function (res) {
                        var index = $scope.Producto.indexOf(item);
                        $scope.Producto[index].estado = 0;
                    });
            }
        });
    };

    $scope.getAuditoria = function (item) {
        var usuario_edicion = auxiliarServices.formatDate(item.usuario_Edicion);
        var usuario_creacion = auxiliarServices.formatDate(item.usuario_Creacion);
        var usuedicion = "";
        var usucreacion = "";
        AuditarServices.getAuditar(item.usuario_Edicion).then(function (data) {
            usuedicion = data[0].nombre_personal + " " + data[0].apellido_personal;
            AuditarServices.getAuditar(item.usuario_Creacion).then(function (res) {
                usucreacion = res[0].nombre_personal + " " + res[0].apellido_personal;

                var message = "Fecha Creación : " + usuario_creacion + "</br>" +
                    "Usuario Creación : " + usucreacion + "</br>" +
                    "Fecha Edición : " + usuario_edicion + "</br>" +
                    "Usuario Edición : " + usuedicion + "</br>";
                auxiliarServices.NotificationMessage('Sistemas', message, 'success', '#008000', 5000);

            });
        });

    };


    $scope.estados = '1';
    $scope.changeEstado = function (status) {
         $scope.changeSelectMarca($scope.objeto_parametros.id_marcaProducto, status); 

    };


    $scope.filterStatus = function (status) {

        alert(status);

        var addrow = $("#tblProductos");
        $("#tblProductos").footable();

        if (status === 0) {
            status = '';
        }
        else if (status === 1) {
            status = 'Activado';
        }
        else if (status === 2) {
            status = 'Anulado';
        }

        addrow.trigger('footable_filter', {
            filter: status
        });

    };

    // VALIDAR CAMPOS SOLO PARA LETRAS
    // ng-keypress="Validationletter($event);"
    $scope.Validationletter = function (event) {

        let keyCode = event.keyCode ? event.keyCode : event.which;
        if (!(keyCode < 48 || keyCode > 57)) {
            event.preventDefault();
            auxiliarServices.NotificationMessage('Alerta..!', 'El Sistema solo Permite Ingreso de Letras...!', 'error', '#ff6849', 1500);
        }

    };

    // VALIDAR CAMPOS SOLO PARA NUMEROS 
    //ng-keypress="ValidationNumber($event);"
    $scope.ValidationNumber = function (event) {
        var keys = {
            'up': 38, 'right': 39, 'down': 40, 'left': 37,
            'escape': 27, 'backspace': 8, 'tab': 9, 'enter': 13, 'del': 46,
            '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57
        };
        for (var index in keys) {
            if (!keys.hasOwnProperty(index)) continue;
            if (event.charCode === keys[index] || event.keyCode === keys[index]) {
                return;
            }

        }
        event.preventDefault();
        auxiliarServices.NotificationMessage('Alerta..!', 'Por favor ingrese solo Numeros...', 'error', '#ff6849', 1500);
    };

    //ng-keydown="ValidationEnterFocus($event);"
    $scope.ValidationEnterFocus = function ($event, id) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            if (id === "txtnombre_pro") {
                $scope.objeto_parametros.codigo2_Producto = $scope.objeto_parametros.codigo1_Producto;
                $scope.objeto_parametros.CodigoBarra_Producto = $scope.objeto_parametros.codigo1_Producto;
            }
            $('#' + id).focus();
        }
    };

    $scope.ExportarToExcel = function () {
     


        var uri = 'data:application/vnd.ms-excel;base64,',
              template = '<html lang="es"  xmlns:o="urn:schemas-microsoft-com:office:office"' +
                         'xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
                         '<head>' +
                         '<meta charset="utf-8">' +
                         '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Reporte</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
                         '<style>' +

                        ' table, td, th {' +
                              ' border: 1px solid rgba(0, 0, 0, 0.11);' +
                              ' }' +
             ' th {' +
                  'background-color: #4CAF50;' +
                  'color: white;' +
             ' }' +
                       ' </style> </head>' +
                         '<body>' +
                         '<h2  style="text-align:center;">' +' Reporte Productos '+ '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tblReport'),
                     ctx = { worksheet: 'ReporteProductos', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReporteProductos.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }

    $scope.OpenModal_listaPrecio = function () {
        if ($scope.idProducto_Global > 0 ) {
            //$scope.clean();             
            setTimeout(() => {
                $('#ModalPrecioProducto').modal('show');
            }, 500);
           $scope.Listando_Precios($scope.idProducto_Global)

        }
    };

    $scope.cerrarModal = function () {
        $('#ModalPrecioProducto').modal('hide');
    }
    
    $scope.ListaPrecios = [];
    $scope.Listando_Precios = function (idProducto) {
        $scope.loader = true;
        productosServices.getListaPrecioProducto(idProducto)
            .then(function (res) {

                console.log(res)
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.ListaPrecios = [];
                    $scope.ListaPrecios = res.data;                

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }
  

});



























