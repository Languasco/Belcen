
var app = angular.module('appGestion',
    ['ngRoute', 'appGestion.auxiliarServices', 'angularFileUpload',
        'appGestion.loginController', 'appGestion.loginServices',
        'appGestion.productosController', 'appGestion.productosServices',
        'appGestion.productoCategoriaServices', 'appGestion.productoLineaServices',
        'appGestion.productoMarcaServices', 'appGestion.umServices',
        'appGestion.productoModeloServices', 'appGestion.productoSubLineaServices',
        'appGestion.IngresoGuiasController', 'appGestion.IngresoGuiasOrdenCompraController',
        'appGestion.AlmacenServices', 'appGestion.LocalesServices', 'appGestion.LocalesController', 'appGestion.IngresoGuiasServices',
        'appGestion.ProveedorServices', 'appGestion.accesosController', 'appGestion.AccesosServices', 'appGestion.UsuariosServices',
        'appGestion.AlmacenesController', 'appGestion.EmpresaServices', 'appGestion.AuditarServices',
        'appGestion.ClienteController', 'appGestion.ClienteServices',
        'appGestion.CanalesNegocioController', 'appGestion.CanalServices',
        'appGestion.UbigeoServices', 'appGestion.GiroServices', 'appGestion.GirosNegocioController',
        'appGestion.PersonalController', 'appGestion.PersonalServices',
        'appGestion.PerfilServices', 'appGestion.CargoServices', 'appGestion.CargoController', 'appGestion.ProveedorController',
        'appGestion.MonedaServices', 'appGestion.TransferenciasController', 'appGestion.IngresoTransferenciasCompraController', 'appGestion.StockAlmacenServices',
        'appGestion.VehiculoServices', 'appGestion.VehiculosController', 'appGestion.TransportistaServices', 'appGestion.TransportistaController',
        'appGestion.productoCategoriaServices', 'appGestion.productoLineaServices', 'appGestion.productoSubLineaServices',
        'appGestion.productoMarcaServices', 'appGestion.UnidadController',
        'appGestion.productocategoriaController', 'appGestion.productomarcaController', 'appGestion.productolineaController',
        'appGestion.productomarcamodeloController', 'appGestion.ProductoSubLineaController',
        'appGestion.productoModeloServices', 'appGestion.productoSubLineaServices',
        'appGestion.ListaPreciosController', 'appGestion.ListaPrecioServices',
        'appGestion.DocumentoVentaController', 'appGestion.DocumentoVentaServices',
        'appGestion.EstadosServices', 'appGestion.TipoDocumentoServices', 'appGestion.TipoDocController',
        'appGestion.PuntoVentaServices', 'appGestion.PuntoVentaController',
        'appGestion.PagoVendedorController', 'appGestion.PagosVendedorServices', 'appGestion.GrupoCabServices', 'appGestion.GrupoDetServices',
        'appGestion.GrupoDetController',
        'appGestion.VendedorServices', 'appGestion.VendedorController', 'appGestion.FormapagoServices', 'appGestion.FormaPagoController',
        'appGestion.StockController', 'appGestion.StockServices',
        'appGestion.CancelacionDocVendedorController', 'appGestion.CancelacionDocVendedorServices',
        'appGestion.StockAlmacenServices', 'appGestion.IngresoTransferenciasServices', 'appGestion.AprobacionTransferenciasController',
        'appGestion.UsuarioLocalController', 'appGestion.UsuarioLocalServices',
        'appGestion.UsuarioAlmacenController', 'appGestion.UsuarioAlmacenServices',
        'appGestion.PedidosController', 'appGestion.PedidosServices', 'appGestion.CondicionFacturacionServices',
        'appGestion.Cliente_IIController', 'appGestion.Cliente_IIServices',
        'appGestion.Pedidos_DirectoController',
        'appGestion.NotaCreditoDebitoController', 'appGestion.NotaCreditoDebitoServices',
        'appGestion.RegistroVentasController', 'appGestion.RegistroVentasServices',
        'appGestion.ResumenVentasController', 'appGestion.ResumenVentasServices',
        'appGestion.PedidosAprobacionController', 'appGestion.CancelacionMasivaDocumentosController',
        'appGestion.CancelacionMasivaController', 'appGestion.CancelacionMasivaServices',
        'appGestion.Reenvio_DocumentosController', 'appGestion.Reenvio_DocumentosServices',
        'appGestion.cancelacion_x_documentoController', 'appGestion.cancelacion_x_documentoServices',
        'appGestion.EntregaPedidoController', 'appGestion.EntregaPedidoServices',
        'appGestion.ExportarPedidoController', 'appGestion.ExportarServices',
        'appGestion.ImportarPedidoController', 'appGestion.ImportarServices',
        'appGestion.AprobarDevolucionController', 'appGestion.AprobarDevolucionServices',
        'appGestion.ReporteCoberturaController', 'appGestion.ReporteCoberturaServices',
        'appGestion.ReporteKpiController',
        'appGestion.ImportarStockAlmacenController', 'appGestion.ImportarStockAlmacenServices',
        'appGestion.HabilitarUsuarioController', 'appGestion.HabilitarUsuarioServices',
        'appGestion.ImportarPrecioController', 'appGestion.ImportarPrecioServices',
        'appGestion.ReporteStockController',
        'appGestion.PromocionesController', 'appGestion.PromocionesServices',
        'appGestion.RevisionPedidoController', 'appGestion.RevisionPedidoServices',
        'appGestion.ConsolidadoController', 'appGestion.ConsolidadoServices',
        'appGestion.ReimpresionController', 'appGestion.ReimpresionServices',
        'appGestion.DocumentosManualesController', 'appGestion.DocumentosManualesServices',
        'appGestion.IngresoFacturasController', 'appGestion.IngresoFacturasServices',
        'appGestion.UsuarioController', 'appGestion.UsuarioServices',
        'appGestion.ArqueoCajaController', 'appGestion.ArqueoCajaServices',
        'appGestion.Documentos_MasivosController', 'appGestion.Documentos_MasivosServices', 'appGestion.KardexAlmacenController',
        'appGestion.AnexosServices', 'appGestion.RutasVentasServices', 'appGestion.ZonasVentasServices', 'appGestion.UsuariosController',
        'appGestion.ZonasVentasController', 'appGestion.RutasVentasController', 'appGestion.AnexosController',
        'appGestion.BancosServices', 'appGestion.BancosController',
        'appGestion.CobranzaReporteService', 'appGestion.CobranzaReporteController', 'appGestion.CobranzaManualService', 'appGestion.CobranzaManualController',
        'appGestion.AnularDocumentosController',
        'appGestion.TransaccionesController', 'appGestion.TransaccionesServices',
        'appGestion.envioSunatNotasCreditoDebitoController',
        'appGestion.transferenciasNewController', 'appGestion.transferenciasNewServices',
        'appGestion.Pedidos_IIController',
        'appGestion.ReporteContableController', 'appGestion.ReporteContableServices',
        'appGestion.anularNumeroController',
        'appGestion.estadoDocumentoController',
        'appGestion.transformacionProductosController', 'appGestion.transformacionProductosServices',
        'appGestion.HistoricoFacturacionController', 'appGestion.HistoricoFacturacionServices',
        'appGestion.importarAjusteInventarioController', 'appGestion.importarAjusteInventarioServices',
        'appGestion.VentaAcumuladaController', 'appGestion.VentaAcumuladaServices',

    ])
    .constant('urlApi', 'http://192.168.0.109:8083/api/')


    .config(function ($httpProvider) {
        //var auth = $base64.encode("client:secret");
        //$httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;
    })

    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .directive('numbersOnlyd', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');
                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })

        .directive('numbersOnlydd', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        if (text) {
                            var transformedInput = text.replace(/[^0-9-]/g, '');
                            if (transformedInput !== text) {
                                ngModelCtrl.$setViewValue(transformedInput);
                                ngModelCtrl.$render();
                            }
                            return transformedInput;
                        }
                        return undefined;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        })
    .directive('onFileChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.onFileChange);

                element.bind('change', function () {
                    scope.$apply(function () {
                        var files = element[0].files;
                        if (files) {
                            onChangeHandler(files);
                        }
                    });

                });

            }
        };
    })
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attr.onFinishRender);
                    });
                }
            }
        };
    })
    .filter('iif', function () {
        return function (input, trueValue, falseValue) {
            return input ? trueValue : falseValue;
        };
    })



    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/Home', {
                templateUrl: 'Home/Home',
                controller: 'ctrlHome'
            })
            // CREANDO VISTAS DE MANTENIMEINTO
            .when('/Login', {
                templateUrl: '/Login/LoginIndex',
                controller: 'ctrlLogin'
            })
            .when('/Almacen', {
                templateUrl: '/HomeAlmacen/HomeAlmacen',
                controller: 'ctrlHomeAlmacen'
            })
            .when('/ProductosAlmacen', {
                templateUrl: '/MantenimientoAlmacen/ProductosAlmacen',
                controller: 'ctrlProductosAlmacen'
            })
            .when('/IngresoGuias/:tipoM', {
                templateUrl: '/Procesos/IngresoGuias',
                controller: 'CtrlIngresoGuias'
            })
            .when('/IngresoGuiasOrdenCompra', {
                templateUrl: '/Procesos/IngresoGuiasOrdenCompra',
                controller: 'CtrlIngresoGuiasOrdenCompraController'
            })
            .when('/Transferencias', {
                templateUrl: '/Procesos/Transferencias',
                controller: 'CtrlTransferencias'
            })
            .when('/IngresoTransferencias', {
                templateUrl: '/Procesos/IngresoTransferencias',
                controller: 'CtrlIngresoTransferenciasController'
            })
            .when('/Almacenes', {
                templateUrl: '/MantenimientoAlmacen/Almacenes_index',
                controller: 'ctrlAlmacenes'
            })
            .when('/Clientes', {
                templateUrl: '/MantenimientoAlmacen/Clientes_index',
                controller: 'ctrlCliente'
            })
            .when('/Personal', {
                templateUrl: '/MantenimientoAlmacen/Personal_index',
                controller: 'ctrlPersonal'
            })
            .when('/AprobacionTransferencias', {
                templateUrl: '/Procesos/AprobacionTransferencias',
                controller: 'CtrlAprobacionTransferenciasController'
            })
            .when('/Proveedor', {
                templateUrl: '/MantenimientoAlmacen/Proveedor_index',
                controller: 'CtrlProveedor'
            })
            .when('/UnidadMedidaAlmacen', {
                templateUrl: '/MantenimientoAlmacen/UnidadDeMedidaAlmacen',
                controller: 'ctrlUnidadMedida'
            })
            .when('/CategoriaProducto', {
                templateUrl: '/MantenimientoAlmacen/CategoriaProductoAlmacen',
                controller: 'ctrlCategoriaProducto'
            })
            .when('/ProductoMarca', {
                templateUrl: '/MantenimientoAlmacen/ProductoMarcaAlmacen',
                controller: 'ctrlProductoMarca'
            })
            .when('/ProductoLinea', {
                templateUrl: '/MantenimientoAlmacen/ProductoLineaAlmacen',
                controller: 'ctrlProductoLinea'
            })
            .when('/ProductoModelo', {
                templateUrl: '/MantenimientoAlmacen/ProductoModeloMarcaAlmacen',
                controller: 'ctrlProductoModelo'
            })
            .when('/Stock', {
                templateUrl: '/ReportesAlmacen/Stock_index',
                controller: 'ctrlStock'
            })
            .when('/Kardex', {
                templateUrl: '/ReportesAlmacen/KardexAlmacen',
                controller: 'ctrlKardex'
            })
            .when('/ProductoSubLinea', {
                templateUrl: '/MantenimientoAlmacen/ProductoSubLineaAlamacen',
                controller: 'ctrlProductoSubLinea'
            })
            // -----COMERCIAL
            .when('/CanalNegocio', {
                templateUrl: '/MantenimientoAlmacen/CanalesNegocio_index',
                controller: 'CtrlCanal'
            })
            .when('/GirosNegocio', {
                templateUrl: '/MantenimientoAlmacen/GirosNegorio_index',
                controller: 'CtrlGiro'
            })
            .when('/Puntoventa', {
                templateUrl: '/MantenimientoAlmacen/PuntoVenta_index',
                controller: 'CtrlPuntoVenta'
            })
            .when('/TipoDocumento', {
                templateUrl: '/MantenimientoAlmacen/TipoDocumento_index',
                controller: 'CtrlTipoD'
            })
            .when('/Clientes_II', {
                templateUrl: '/MantenimientoAlmacen/Clientes_II_index',
                controller: 'CtrlCliente_II'
            })

            //----FACTURACION
            .when('/Facturacion', {
                templateUrl: '/HomeFacturacion/HomeFacturacion',
                controller: 'ctrlHomeFacturacion'
            })
            .when('/ListaPrecio', {
                templateUrl: '/ProcesosFacturacion/ListaPrecio_index',
                controller: 'ctrlListaPrecios'
            })
            .when('/GeneracionDocumentos', {
                templateUrl: '/ProcesosFacturacion/GeneracionDocumentoVenta_Index',
                controller: 'ctrlDocumentoVenta'
            })
            .when('/PagosVendedor', {
                templateUrl: '/ReportesFacturacion/PagosVendedor_index',
                controller: 'ctrlPagoVendedor'
            })
            .when('/CancelacionDocumentosVendedor', {
                templateUrl: '/ProcesosFacturacion/CancelacionDocVendedor_index',
                controller: 'ctrlCancelacionDocVendedor'
            })
            .when('/Generacion_Masiva_Documentos', {
                templateUrl: '/ProcesosFacturacion/GeneracionMasivaDocumentos_Index',
                controller: 'ctrlDocumentos_Masivos'
            })
            .when('/Generacion_Masiva_Documentos_new', {
                templateUrl: '/ProcesosFacturacion/GeneracionMasivaDocumentos_new',
                controller: 'ctrlDocumentos_Masivos'
            })
            .when('/Pedidos', {
                templateUrl: '/ProcesosFacturacion/Pedidos_Index',
                controller: 'CtrlPedidos'
            })
            .when('/Pedidos_new', {
                templateUrl: '/ProcesosFacturacion/Pedidos_new',
                controller: 'CtrlPedidos'
            })
            .when('/Pedidos_Aprobacion', {
                templateUrl: '/ProcesosFacturacion/Pedidos_Aprobacion_Index',
                controller: 'CtrlPedidosAprobacion'
            })
            .when('/Pedidos_Directo', {
                templateUrl: '/ProcesosFacturacion/Pedidos_Directo_Index',
                controller: 'CtrlPedidos_Directo'
            })
            .when('/Pedidos_Directo_new', {
                templateUrl: '/ProcesosFacturacion/Pedidos_Directo_new',
                controller: 'CtrlPedidos_Directo'
            })
            .when('/CancelacionMasivaDocumentos', {
                templateUrl: '/ProcesosFacturacion/CancelacionMasivaDocumentos_index',
                controller: 'CtrlCancelacionMasivaDocumentos'
            })
            .when('/NotaCreditoDebito', {
                templateUrl: '/ProcesosFacturacion/NotaCreditoDebito_Index',
                controller: 'CtrlNotaCreditoDebito'
            })
            .when('/NotaCreditoDebito_new', {
                templateUrl: '/ProcesosFacturacion/NotaCreditoDebito_new',
                controller: 'CtrlNotaCreditoDebito'
            })
            .when('/RegistroVentas', {
                templateUrl: '/ReportesFacturacion/RegistroVentas_Index',
                controller: 'CtrlRegistroVentas'
            })
            .when('/ResumenVentas', {
                templateUrl: '/ReportesFacturacion/ResumenVentas_Index',
                controller: 'CtrlResumenVentas'
            })
            .when('/Reenvio_doc_electronicos', {
                templateUrl: '/ProcesosFacturacion/ReenvioDocumentos_Index',
                controller: 'Ctrl_Reenvio_Documentos'
            })
            .when('/Reenvio_doc_electronicos_new', {
                templateUrl: '/ProcesosFacturacion/ReenvioDocumentos_new',
                controller: 'Ctrl_Reenvio_Documentos'
            })
            

            // -------SERVICIOS 
            .when('/Transportista', {
                templateUrl: '/MantenimientoAlmacen/Transportista_index',
                controller: 'CtrlTransportista'
            })
            .when('/Vehiculos', {
                templateUrl: '/MantenimientoAlmacen/Vehiculo_index',
                controller: 'CtrlVehiculo'
            })
            .when('/Local', {
                templateUrl: '/MantenimientoAlmacen/locales_index',
                controller: 'CtrlLocal'
            })
            .when('/Vendedor', {
                templateUrl: '/MantenimientoAlmacen/Vendedor_index',
                controller: 'CtrlVendedor'
            })
            .when('/Cargo', {
                templateUrl: '/MantenimientoAlmacen/Cargo_index',
                controller: 'CtrlCargo'
            })
            .when('/FormaPago', {
                templateUrl: '/MantenimientoAlmacen/FormaPago_index',
                controller: 'CtrlPago'
            })
            .when('/GrupoDet', {
                templateUrl: '/MantenimientoAlmacen/GrupoDet_index',
                controller: 'CtrlDet'
            })
            //COBRANZAS
            .when('/cancelacion_masiva', {
                templateUrl: '/Cobranza/Cancelacion_masiva',
                controller: 'Ctrl_CancelacionMasiva'
            })
            .when('/cancelacion_x_documento', {
                templateUrl: '/Cobranza/Cancelacion_x_documento',
                controller: 'Ctrl_cancelacion_x_documento'
            })
            .when('/ReporteCobranza', {
                templateUrl: '/Cobranza/ReporteCobranza_index',
                controller: 'CtrlCobranzaReporte'
            })
            .when('/CobranzaManual', {
                templateUrl: '/Cobranza/GeneracionManual_index',
                controller: 'CtrlCobranzaManual'
            })
            .when('/AnularDocumento', {
                templateUrl: '/Cobranza/AnularDocumento_index',
                controller: 'CtrlAnularDocumento'
            })
            // ADMINISTACIÓN DE USUARIO 

            .when('/AdministracionUsuario', {
                templateUrl: '/HomeAdministracion/HomeAdministracion',
                controller: 'ctrlHomeAdministracion'
            })
            .when('/AccesosUsuarios', {
                templateUrl: '/HomeAdministracion/AccesosUsuario',
                controller: 'ctrlAccesosUsuarios'
            })
            .when('/UsuarioLocal', {
                templateUrl: '/HomeAdministracion/UsuarioLocal_index',
                controller: 'ctrlUsuarioLocal'
            })
            .when('/UsuarioAlmacen', {
                templateUrl: '/HomeAdministracion/UsuarioAlmacen_index',
                controller: 'ctrlUsuarioAlmacen'
            })
            // MANTENIMIENTOS
            .when('/Usuario', {
                templateUrl: '/Mantenimiento/Usuario_index',
                controller: 'ctrlUsuarios'
            })
            .when('/RutasVentas', {
                templateUrl: '/Mantenimiento/RutasVentas_index',
                controller: 'ctrlRutasVentas'
            })
            .when('/ZonasVentas', {
                templateUrl: '/Mantenimiento/ZonasVentas_index',
                controller: 'ctrlZonasVentas'
            })
            .when('/Anexos', {
                templateUrl: '/Mantenimiento/Anexos_index',
                controller: 'ctrlAnexos'
            })
            .when('/Bancos', {
                templateUrl: '/Mantenimiento/Bancos_index',
                controller: 'ctrlBancos'
            })
            // REPARTOS 
            .when('/Reparto', {
                templateUrl: '/HomeReparto/HomeReparto',
                controller: 'ctrlHomeReparto'
            })
            .when('/EntregaPedido', {
                templateUrl: '/ProcesosReparto/EntregaReparto_index',
                controller: 'ctrlEntregaPedido'
            })
            .when('/ExportarPedido', {
                templateUrl: '/ProcesosReparto/ExportaPedido_index',
                controller: 'ctrlExportarPedido'
            })
            .when('/ImportarPedido', {
                templateUrl: '/ProcesosReparto/ImportaPedido_index',
                controller: 'CtrlImportarPedido'
            })
            .when('/AprobarDevolucion', {
                templateUrl: '/ProcesosReparto/AprobarDevolucion_index',
                controller: 'CtrlAprobarDevolucion'
            })
            .when('/reporteCobertura', {
                templateUrl: '/ReportesReparto/reporteCobertura_index',
                controller: 'CtrlReporteCobertura'
            })
            .when('/reportekpi', {
                templateUrl: '/ReportesReparto/reporteKpi_index',
                controller: 'CtrlReporteKpi'
            })
            .when('/ImportarStockAlmacen', {
                templateUrl: '/ProcesosReparto/ImportaStockAlmacen_index',
                controller: 'CtrlImportarStockAlmacen'
            })
            .when('/HabilitarUsuario', {
                templateUrl: '/ProcesosReparto/HabilitarUsuario_index',
                controller: 'CtrlHabilitarUsuario'
            })
            .when('/ImportarPrecio', {
                templateUrl: '/ProcesosReparto/ImportarPrecio_index',
                controller: 'CtrlImportarPrecio'
            })
            .when('/reporteStock', {
                templateUrl: '/ReportesReparto/reporteStock_index',
                controller: 'CtrlReporteStock'
            })
            .when('/Promociones', {
                templateUrl: '/ProcesosFacturacion/Promociones_index',
                controller: 'CtrlPromociones'
            })
            .when('/RevisionPedido', {
                templateUrl: '/ProcesosFacturacion/RevisionPedidos_index',
                controller: 'CtrlRevisionPedido'
            })
            .when('/Consolidado', {
                templateUrl: '/ProcesosFacturacion/ConsolidadoMercaderia_index',
                controller: 'ConsolidadoController'
            })
            .when('/Reimpresion', {
                templateUrl: '/ProcesosFacturacion/ReimpresionDocumentos_index',
                controller: 'ReimpresionController'
            })
            .when('/DocumentosManuales', {
                templateUrl: '/ProcesosFacturacion/DocumentosManuales_index',
                controller: 'DocumentosManualesController'
            })
            .when('/ingresoFacturas', {
                templateUrl: '/Procesos/IngresoFacturas',
                controller: 'IngresoFacturasController'
            })
            .when('/ArqueoCaja', {
                templateUrl: '/ProcesosFacturacion/ArqueoCaja_index',
                controller: 'ArqueoCajaController'
            })
            .when('/consultaTransacciones', {
                templateUrl: '/ReportesAlmacen/consultaTransacciones',
                controller: 'TransaccionesController'
            })
            .when('/envioSunatNotasCreditoDebito', {
                templateUrl: '/ProcesosFacturacion/envioSunatNotasCreditoDebito_index',
                controller: 'envioSunatNotasCreditoDebitoController'
            })
            .when('/TransferenciasNew', {
                templateUrl: '/Procesos/transferenciasNew',
                controller: 'transferenciasNewController'
            })
            .when('/Pedidos_II', {
                templateUrl: '/ProcesosFacturacion/Pedidos_II',
                controller: 'Pedidos_IIController'
            })
            .when('/ReporteContable', {
                templateUrl: '/ReportesFacturacion/ReporteContable_Index',
                controller: 'ReporteContableController'
            })
            .when('/AnularNumero', {
                templateUrl: '/ProcesosFacturacion/anularNumero_index',
                controller: 'anularNumeroController'
            })
            .when('/estadoDocumento', {
                templateUrl: '/ReportesFacturacion/estadoDocumento_index',
                controller: 'estadoDocumentoController'
            })
            .when('/cambiarContrasenia', {
                templateUrl: '/HomeAdministracion/cambioContrasenia_index',
                controller: 'UsuarioController'
            })
            .when('/tranformacionProductos', {
                templateUrl: '/Procesos/transformacionProductos_index',
                controller: 'transformacionProductosController'
            })
            .when('/HistoricoFacturacion', {
                templateUrl: '/ReportesFacturacion/HistoricoFacturacion_index',
                controller: 'HistoricoFacturacionController'
            })
            .when('/importarAjusteInventario', {
                templateUrl: '/Procesos/importarAjusteInventario_index',
                controller: 'importarAjusteInventarioController'
            })
            .when('/ventaAcumulada', {
                templateUrl: '/ReportesFacturacion/ventaAcumulada_index',
                controller: 'VentaAcumuladaController'
            })
            .otherwise({
                redirectTo: '/Login'
            });
    })
    .directive('numbersOnlyg', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9-]/g, '');
                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })
    .directive('numbersOnly', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');
                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })
    .directive('numbersOnlyd', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9.]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })
    // FUNCIONES JAVASCRIPT 
    .controller('ctrlHome', function (auxiliarServices, $location, $timeout, $scope) {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        var menu = document.getElementById('side-menu');
        menu.style.display = "none";
        var header = document.getElementById('HeaderPage');
        header.style.display = "";
        auxiliarServices.changeTitle("Bienvenido al Software Gestion");

        $scope.changeView = function () {
            $location.path('/Almacen');
        };

        $scope.showLoader = true;
        $timeout(function () {
            $scope.showLoader = false;
            auxiliarServices.menuHideShow(1);
        }, 1000);


    })
    .controller('ctrlIndex', function (auxiliarServices, $location, $scope, $timeout, loginServices) {

        $scope.showLoader = false;
        var userPermission;
        var template = $location.$$path;
        var header = document.getElementById('HeaderPage');
        var menu = document.getElementById('side-menu');

        if (template !== "/Login") {
            if (!auxiliarServices.validateUserLog()) {
                $location.path('/Login');
                return;
            }
            // HABILITAMOS MENU Y HEADER   
            header.style.display = "";
            menu.style.display = "";
            var parenId = localStorage.getItem('valueParenId');
            userPermission = auxiliarServices.getUserPermission(parenId);
            $scope.listPermission = userPermission;
            auxiliarServices.changeNameUser();

        } else {
            // HINHABILITAMOS MENU Y HEADER
            header.style.display = "none";
            menu.style.display = "none";
        }
        $scope.changeView = function (value) {

            //-----asignando el modulo -----
            auxiliarServices.set_moduloElegido(value);

            if (value === 1) {
                userPermission = auxiliarServices.getUserPermission(value); 
                $timeout(function () {
                    $scope.listPermission = userPermission;
                }, 100);
                $location.path('/AdministracionUsuario');
            } else if (value === 2) {

                userPermission = auxiliarServices.getUserPermission(value);
                $timeout(function () {
                    $scope.listPermission = userPermission;
                }, 100);
                $location.path('/Almacen');
            } else if (value === 3) {

                userPermission = auxiliarServices.getUserPermission(value);

                $timeout(function () {
                    $scope.listPermission = userPermission;
                }, 100);
                $location.path('/Facturacion');
            }
            else if (value === 4) {
                userPermission = auxiliarServices.getUserPermission(value);
                $timeout(function () {
                    $scope.listPermission = userPermission;
                    $location.path('/Pedidos_Directo');
                }, 100);

            }
            else if (value === 5) {
                userPermission = auxiliarServices.getUserPermission(value);
                $timeout(function () {
                    $scope.listPermission = userPermission;
                    $location.path('/Pedidos_Directo_new');
                }, 100);
            }
            else if (value === 75) {
                userPermission = auxiliarServices.getUserPermission(value);
                $timeout(function () {
                    $scope.listPermission = userPermission;
                    $location.path('/Reparto');
                }, 100);

            }

            localStorage.setItem('valueParenId', value);
            auxiliarServices.menuHideShow(2);
        };

        $scope.closeSession = function () {
            $scope.showLoader = true;
            //-----cerrando la sesion ---
            const idUsuario = auxiliarServices.getUserId();
 
            loginServices.get_ActivarDesactivarSesion(idUsuario, 0)
                .then((result) => {
                    if (result == "OK" || result == '"OK') {
                        $timeout(function () {
                            $scope.showLoader = false;
                            auxiliarServices.closeSession();
                            $location.path('/Login');
                        }, 1000);
                    }
                }, (err) => {
                    console.log('err');
                    console.log(err);
                })
        };
    })
    .controller('ctrlHomeAlmacen', function (auxiliarServices, $scope) {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }

        auxiliarServices.changeTitle("Inicio - Almacen");
        var menu = document.getElementById('side-menu');
        menu.style.display = "";


    })
    .controller('ctrlHomeFacturacion', function (auxiliarServices, $scope) {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.changeTitle("Inicio - Facturación");
        var menu = document.getElementById('side-menu');
        menu.style.display = "";


    })
    .controller('ctrlHomeAdministracion', function (auxiliarServices, $scope) {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.changeTitle("Inicio - Administración");
        var menu = document.getElementById('side-menu');
        menu.style.display = "";
    })
    .controller('ctrlHomeReparto', function (auxiliarServices, $scope) {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.changeTitle("Inicio - Reparto");
        var menu = document.getElementById('side-menu');
           menu.style.display = "";
    });

function soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode;
    return key >= 48 && key <= 57 || key === 8;
}

function Latter(e) {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    especiales = "8-37-39-46";

    tecla_especial = false;
    for (var i in especiales) {
        if (key === especiales[i]) {
            tecla_especial = true;
            break;
        }
    }
    if (letras.indexOf(tecla) === -1 && !tecla_especial) {
        return false;
    }
}

$(document).click(function () {
    $("#borrar").click(borrar);
    function borrar() {
        $("#").val('') && $("#").val('') &&
                $("#").val('') && $("#").val('') && $("#").val('') && $("#").val('');
    }

});


function Numbers(e) {
    var keynum = window.event ? window.event.keyCode : e.which;
    if (keynum === 8 || keynum === 46);
    return true;
}





