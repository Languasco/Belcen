var app = angular.module('appGestion.transformacionProductosController', []);
app.controller('transformacionProductosController', function ($scope, PedidosServices, AuditarServices, TransportistaServices, transformacionProductosServices, VehiculoServices, ProveedorServices, LocalesServices, IngresoTransferenciasServices, AlmacenServices, $location, $timeout, auxiliarServices, EstadosServices, transferenciasNewServices, TipoDocumentoServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;

        auxiliarServices.changeTitle("Transformacion de Productos");
        $scope.titleModal = "Transformacion de Productos";
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
    $scope.id_GuiaDet_Global = 0;

    $scope.Flag_modoEdicion = false;
    $scope.Flag_modoEdicion_Det = false;
    $scope.disabledProd = "disabledContent";
    $scope.disabledCab = "disabledContent";
    $scope.disabledForm = "disabledContent";
    $scope.disabledEdicion = "";

    $scope.getAuditorias = function (item) {

        const uCreacion = (!item.usuario_creacion) ? 0 : item.usuario_creacion;
        const uEdicion = (!item.usuario_edicion) ? 0 : item.usuario_edicion;

        const fechaCreacion = (item.fecha_creacion);
        const fechaEdicion = (item.fecha_edicion) ;

        if (uCreacion == 0 && uEdicion == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'No hay informacion para mostrar', 'success', '#008000', 5000);
            return;
        }

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

 

    $scope.id_usuario_Global = auxiliarServices.getUserId()

    $scope.Objeto_Parametro_Filtro = {
        idLocal: "0",
        idAlmacen: "0",
        idEstado: "0",
        fechaIni: auxiliarServices.getDateNow(),
        fechaFin: auxiliarServices.getDateNow(),
    };

    $scope.Objeto_Parametro = {
        id_GuiaCab : '0',
        idLocal: '0',
        idAlmacen: '0',
        idTipoDoc: '13',
        nroDoc: '',
        fechaDoc: auxiliarServices.getDateNow(),
        idProveedor: '1',
        nroRuc: '20601832616',
        descripcionProveedor: 'CORPORACION BELCEN S.A.C. -BELCEN S.A.C.',
        usuario_creacion: $scope.id_usuario_Global,
    }

    $scope.Objeto_Parametro_Detalle = {

        id_GuiaCab: '0',
        id_GuiaDet: '0',
        idProductoOrigen: '0',
        codigoProductoOrigen: '',
        descripcionProductoOrigen: '',

        idUMOrigen: '0',
        descripcionUMOrigen: '',

        nroLoteOrigen: '',
        fechaProduccionOrigen: null,
        fechaVencimientoOrigen: null,
        stock: '0',
        factorMultiplicacion_TransOrigen : '0',

        idProductoDestino: '0',
        codigoProductoDestino: '',
        descripcionProductoDestino: '',

        idUMDestino: '0',
        descripcionUMDestino: '',

        nroLoteDestino: '',
        fechaProduccionDestino: null,
        fechaVencimientoDestino: null,
        factorMultiplicacion_TransDestino: '0',
        cantidad: '0',
        usuario_creacion: $scope.id_usuario_Global,
    }



    $scope.enterFocus = function (type, name) {
        if (type == 1) {
            $('#' + name + '').focus();
            $('#' + name + '').select();

        } else if (type == 2) {
            $('#' + name + '').select2('open');
        }
    };



    $scope.listLocales = [];
    $scope.getLocales = function () {
        $scope.loaderFiltro = true;
        LocalesServices.get_Locales_Usuario($scope.id_usuario_Global)
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
            AlmacenServices.getAlmacenesLocal(idSelect)
                .then(function (res) {
                    if (res.length === 0) {
                        $scope.listAlmacenes = [];
                        $scope.Objeto_Parametro.id_Almacen = "0";
                        $timeout(function () {
                            $('#cboLocal').val("0").trigger('change.select2');
                            $('#cboAlmacen').val("0").trigger('change.select2');
                        });
                        return;
                    }
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

    $scope.listAlmacenes = [];
    $scope.listAlmacenesDestino = [];

    $scope.change_almacenLocal = function (tipoAlmacen, idLocal, idAlmacen) {
        var newValue = '';
        $scope.loaderSave = true;
        AlmacenServices.getAlmacenesLocal(idLocal)
            .then(function (res) {                 
                $scope.loaderSave = false;
                    if (tipoAlmacen =='ORIGEN') {
                        $scope.listAlmacenes = [];
                        $scope.listAlmacenes = res;

                        newValue = '0';
                        if (res.length === 0) {
                            $scope.Objeto_Parametro.idAlmacen = newValue;
                        } else {
                            newValue = String(idAlmacen);
                            $scope.Objeto_Parametro.idAlmacen = newValue ;
                        }     

                        $timeout(function () {
                            $('#cboAlmacen').val(newValue).trigger('change.select2');
                        });
                    } 
            }, function (err) {
                $scope.loaderSave = false;
                console.log(err);
            });
    }


    $scope.getEstados = function () {
        var tipoEstado = 'T';
        $scope.loaderFiltro = true;
        EstadosServices.getEstadosByTipo(tipoEstado).then(function (res) {
            $scope.loaderFiltro = false;
            $scope.listEstados = res;
        }, function (err) {
            $scope.loaderFiltro = false;
            console.log(err);
        });
    };
    $scope.getEstados();


    var oTableCab;

    $scope.listTransformacionProductos = [];
    $scope.listTransformacionProducto_Det = [];

    $scope.mostrandoInformacion = function () {
        $scope.loaderFiltro = true;

        let fechaIni = auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_Filtro.fechaIni);
        let fechaFin = auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_Filtro.fechaFin);

        transformacionProductosServices.mostrarInformacion($scope.Objeto_Parametro_Filtro.idLocal , $scope.Objeto_Parametro_Filtro.idAlmacen , $scope.Objeto_Parametro_Filtro.idEstado , fechaIni , fechaFin)
            .then(function (res) {

                $scope.listTransformacionProductos = [];
                if (res.ok == true) {
                    $scope.listTransformacionProductos = res.data;
                    $timeout(function () {
                        $scope.loaderFiltro = false;

                        $('#inputSearchF').val('');
                        if (oTableCab == null) {
                            oTableCab = 'data'
                            auxiliarServices.initFooTable('tblTransferencias', 'inputSearchF');
                        } else {
                            $('#tblTransferencias').trigger('footable_filter', {
                                filter: $("#inputSearchF").val()
                            });
                        }
                    }, 500)
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderFiltro = false;
                console.log(err);
            });


    }

    $scope.Get_impresion_transferencias = function (obj) {
        if (obj.estado == 25 || obj.estado == '25' || obj.estado == 26 || obj.estado == '26') {
            IngresoTransferenciasServices.get_impresion_transferencias(obj.Id_AlmTranCab, obj.estado)
                .then(function (data) {
                    console.log(data);
                    Impresion_Pdf(data, obj.estado);
                }, function (e) {
                    console.log(e)
                });
        } else {
            auxiliarServices.NotificationMessage('Sistemas', 'Solo se puede imprimir las transferencias Aprobadas o Rechazadas..', 'error', '#ff6849', 1500);
            return;
        }
    }

    function Impresion_Pdf(data, Estado) {
        var doc = new jsPDF({ unit: 'pt', lineHeight: 1.5, orientation: 'p' });
        var pos = 50;
        var alt = 195
        var cantidad = 0;
        var splitTitle = '';

        doc.setFont('courier')
        doc.setFontType("bold");
        doc.setFontSize(7);
        doc.setTextColor(190, 0, 0);
        doc.text(20, 25, 'CORPORACION BELCEN S.A.C. - BELCEN S.A.C.')
        doc.setTextColor(0);
        doc.setFontSize(8);
        doc.text(460, 25, getDateHoyR() + '  ' + Hora_Reporte())
        doc.setTextColor(0);
        doc.setFontSize(10);
        doc.text(200, 50, 'TRANSFERENCIA ENTRE ALMACENES');
        doc.setFontSize(8);
        // LINEA PARA SUBRAYAR
        doc.setLineWidth(1);
        doc.line(360, 53, 208, 53);
        doc.text(60, 80, 'Nro. Transf :' + data[0].NroDocumento);
        doc.text(200, 80, 'Fecha :' + data[0].FechaEmision);

        if (Estado == 25) {
            console.log('25555')
            doc.text(340, 80, 'Estado : APROBADO');
        } else if (Estado == 26) {
            console.log('26666')
            doc.text(340, 80, 'Estado : RECHAZADO');
        }

        var position = 50;
        doc.text(60, 95, 'Observacion : ' + data[0].Observacion);
        // PRIMERA LINEA SEPARADORA
        doc.setLineWidth(1);
        doc.line(560, 150 - position, 48, 150 - position);

        // DATOS SUB CABECERA //
        doc.setFontSize(9);
        // CAMBIAMOS A CURSIVA
        doc.text(100, 165 - position, 'Datos de Origen');
        doc.text(370, 165 - position, 'Datos de Destino');
        doc.setFontSize(8);
        // CAMBIAMOS A NORMAL
        doc.setFontType("normal");
        doc.text(60, 183 - position, 'Local Origen : ' + data[0].LocalOrigen);
        doc.text(60, 198 - position, 'Almacen Origen : ' + data[0].AlmacenOrigen);
        doc.text(320, 183 - position, 'Local Destino : ' + data[0].LocalDestino);
        doc.text(320, 198 - position, 'Almacen Destino : ' + data[0].AlmacenDestino);
        var adictp = 0;
        position = 80;
        // CABECERA
        doc.setLineWidth(1);
        doc.line(560, 250 - position + adictp, 48, 250 - position + adictp);
        doc.setFontType("bold");
        doc.text(50, 260 - position + adictp, 'Item');
        doc.text(75, 260 - position + adictp, 'Codigo');
        doc.text(200, 260 - position + adictp, 'Descripción');
        doc.text(350, 260 - position + adictp, 'UM');
        doc.text(380, 260 - position + adictp, 'Categoria');
        doc.text(440, 260 - position + adictp, 'Marca');
        doc.text(510, 260 - position + adictp, 'Cantidad');
        doc.setFontSize(7);
        doc.setFontType("normal");
        doc.setLineWidth(1);
        doc.line(560, 265 - position + adictp, 48, 265 - position + adictp);

        var x, y, sum;
        sum = 0;
        var n
        y = 273 - position + adictp;

        for (var i = 0; i < data.length; i++) {
            splitTitle = doc.splitTextToSize(data[i].Descripcion, 230);

            doc.text(pos, alt, String(i + 1));
            doc.text(pos + 20, alt, data[i].Codigo);
            doc.text(pos + 65, alt, splitTitle);
            doc.text(pos + 300, alt, data[i].UM);
            doc.text(pos + 330, alt, data[i].Categoria);
            doc.text(pos + 390, alt, data[i].Marca);
            cantidad = parseFloat(data[i].Cantidad)
            cantidad = cantidad.toFixed(2);
            doc.writeText(pos + 480, alt, cantidad, { align: 'right', width: 25 });

            if (splitTitle.length >= 2) {
                alt += (splitTitle.length * 8)
            }
            sum += parseFloat(cantidad);
            alt += 3;
            doc.line(560, alt, 48, alt);
            alt += 10;
        }

        doc.setLineWidth(1);
        doc.setFontType("bold");
        sum = sum.toFixed(2);
        doc.text(480, alt + 4, 'TOTAL :');
        doc.writeText(530, alt + 4, sum, { align: 'right', width: 25 });

        //doc.setTextColor(0);
        //doc.line(140, 780, 25, 780);
        ////doc.text(46, 790, data[0].usuarioCrea);
        //doc.text(65, 800, 'Digitador');
        ////doc.text(46, 810, data[0].fechaCrea);

        doc.setTextColor(0);
        doc.line(140, 780, 25, 780);
        doc.text(65, 800, 'Aprobador');

        if (Estado == 25) {
            doc.text(30, 790, data[0].UsuarioAprueba);
            doc.text(46, 810, data[0].FechaAprueba);
        }
        //doc.line(240, 780, 350, 780);
        //doc.text(265, 800, 'Aprobador');
        //if (Estado == 25) {
        //    doc.text(240, 790, data[0].UsuarioAprueba);
        //    doc.text(246, 810, data[0].FechaAprueba);
        //}
        doc.text(480, 800, 'Rechazado');
        doc.line(440, 780, 550, 780);
        if (Estado == 26) {
            doc.text(440, 790, data[0].UsuarioRechaza);
            doc.text(446, 810, data[0].FechaRechaza);
        }
        // CARGAMOS EL REPORTE . . .

        doc.save('Transferencia_' + data[0].NroDocumento + '.pdf');
    }

    function getDateHoyR() {

        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1; //hoy es 0!
        var yyyy = hoy.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        hoy = dd + '/' + mm + '/' + yyyy;

        return hoy;
    }

    function Hora_Reporte() {

        var Formato_hora
        marcacion = new Date()
        Hora = marcacion.getHours()
        Minutos = marcacion.getMinutes()
        Segundos = marcacion.getSeconds()

        dn = "a.m"
        if (Hora > 12) {
            dn = "p.m"
            Hora = Hora - 12
        }
        if (Hora == 0)
            Hora = 12
        /* Si la Hora, los Minutos o los Segundos son Menores o igual a 9, le añadimos un 0 */
        if (Hora <= 9) Hora = "0" + Hora
        if (Minutos <= 9) Minutos = "0" + Minutos
        if (Segundos <= 9) Segundos = "0" + Segundos

        /* En Reloj le indicamos la Hora, los Minutos y los Segundos */
        Formato_hora = Hora + ":" + Minutos + ":" + Segundos + " " + dn

        return Formato_hora
    }

    $scope.Open_New_Modal = function () {
        $scope.nuevaTransformacionCab();
        $scope.disabledForm = "";
        $scope.disabledCab = "";
        $scope.disabledProd = "disabledContent";

        $scope.nuevoTransformacionDet();
        $('#modalMantenimiento').modal('show');
    }

    $scope.nuevoTransformacionProducto = function () {
        $scope.nuevaTransformacionCab();
        $scope.disabledForm = "";
        $scope.nuevoTransformacionDet();
    }
     
    $scope.nuevaTransformacionCab = function () {
        $scope.Flag_modoEdicion = false;
        $scope.id_GuiaCab_Global = 0;
        $scope.blank();
        $scope.disabledForm = "";
        $scope.disabledCab = "";
        $scope.disabledProd = "disabledContent";

        $scope.listTransformacionProducto_Det = [];
    }

    $scope.blank = function () {

        $scope.Objeto_Parametro = {
            id_GuiaCab: '0',
            idLocal: '0',
            idAlmacen: '0',
            idTipoDoc: '13',
            nroDoc: '',
            fechaDoc: auxiliarServices.getDateNow(),
            idProveedor: '1',
            nroRuc: '20601832616',
            descripcionProveedor: 'CORPORACION BELCEN S.A.C. -BELCEN S.A.C.',
            usuario_creacion: $scope.id_usuario_Global,
        }

        $timeout(function () {
            $('#cboLocal').val("0").trigger('change.select2');
            $('#cboAlmacen').val("0").trigger('change.select2');
            $('#cboTipoDoc').val("13").trigger('change.select2'); 
            $('#dtpFechaDoc').datepicker('setDate', new Date());
        }, 100);
    }

    $scope.saveUpdate = async function () {
        
        if ($scope.Objeto_Parametro.idLocal == '0' || $scope.Objeto_Parametro.idLocal == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Local ', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.idAlmacen == '0' || $scope.Objeto_Parametro.idAlmacen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacén', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.idTipoDoc == '0' || $scope.Objeto_Parametro.idTipoDoc == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Documento' , 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.nroDoc == '' || $scope.Objeto_Parametro.nroDoc == null || $scope.Objeto_Parametro.nroDoc == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nro de Documento', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro.fechaDoc == '' || $scope.Objeto_Parametro.fechaDoc == null || $scope.Objeto_Parametro.fechaDoc == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la fecha emision', 'error', '#ff6849', 1500);
            return false;
        }
                
        //if ($scope.Flag_modoEdicion == false) {
        //    const { ok, data } = await IngresoFacturasServices.get_verificarNroDoc($scope.Objeto_Parametro.id_tipo_documento, $scope.Objeto_Parametro.nro_documento, $scope.Objeto_Parametro.id_Proveedor)
        //    $scope.$apply();

        //    if (ok) {
        //        if (data[0].cantRegistro > 0) {
        //            auxiliarServices.NotificationMessage('Sistemas', 'El nro de Documento ya se encuentra registrado, verifique..', 'error', '#ff6849', 2000);
        //            return false;
        //        }
        //    } else {
        //        auxiliarServices.NotificationMessage('Sistemas', data, 'error', '#ff6849', 3000);
        //        return false;
        //    }
        //}

        const fechaEmision = $scope.Objeto_Parametro.fechaDoc;
        $scope.Objeto_Parametro.fechaDoc = (!$scope.Objeto_Parametro.fechaDoc) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro.fechaDoc);

        $scope.loaderSave = true;
        transformacionProductosServices.set_save_update_transformacionProductosCab($scope.Objeto_Parametro)
            .then(function (res) {

                $scope.loaderSave = false;
                $scope.Flag_modoEdicion = true;
                $scope.Objeto_Parametro.fechaDoc = fechaEmision;

                if (res.ok == true) {
                    $scope.Objeto_Parametro.id_GuiaCab = res.data;
                    $scope.id_GuiaCab_Global = res.data;

                    $scope.disabledCab = "disabledContent";
                    $scope.disabledProd = "";
                    $scope.mostrandoInformacion();

                    $timeout(function () {
                        let msj = ($scope.Flag_modoEdicion == true) ? 'Actualizacion Realizada Correctamente' : 'Transformacion de Producto Generada Correctamente';
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: msj
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {
                        });
                    }, 0)

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.Objeto_Parametro.fechaDoc = fechaEmision;
                $scope.loaderSave = false;
                alert(error);
            })
       
    }


    $scope.opcionBusquedaProducto_Global = '';
    let stock_Global = 0;
    let factor_Global = 0;
    let idUnidad_Global = 0;
    let precioVenta_Global = 0;


    $scope.BuscarProducto = function (opcion) {

        if ($scope.Objeto_Parametro.idLocal == '0' || $scope.Objeto_Parametro.idLocal == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Local', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.idAlmacen == '0' || $scope.Objeto_Parametro.idAlmacen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacén', 'error', '#ff6849', 1500);
            return false;
        }

        $scope.opcionBusquedaProducto_Global = opcion;

        if (opcion === 'ORIGEN') {
            if ($scope.Objeto_Parametro_Detalle.codigoProductoOrigen === '0' || $scope.Objeto_Parametro_Detalle.codigoProductoOrigen === '' || $scope.Objeto_Parametro_Detalle.codigoProductoOrigen === null || $scope.Objeto_Parametro_Detalle.codigoProductoOrigen === undefined) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo del Producto Origen', 'error', '#ff6849', 1500);
                return;
            }

            $scope.Objeto_Parametro_Detalle.idProductoOrigen = '0';
            $scope.Objeto_Parametro_Detalle.descripcionProductoOrigen = '';
            $scope.Objeto_Parametro_Detalle.idUMOrigen = '';
            $scope.Objeto_Parametro_Detalle.descripcionUMOrigen = '';

            $scope.Objeto_Parametro_Detalle.nroLoteOrigen = '';
            $scope.Objeto_Parametro_Detalle.fechaProduccionOrigen = null;
            $scope.Objeto_Parametro_Detalle.fechaVencimientoOrigen = null;
            $scope.Objeto_Parametro_Detalle.stock = '0';
            $scope.Objeto_Parametro_Detalle.factorMultiplicacion_TransOrigen = '0';

        }
        if (opcion === 'DESTINO') {
            if ($scope.Objeto_Parametro_Detalle.codigoProductoDestino === '0' || $scope.Objeto_Parametro_Detalle.codigoProductoDestino === '' || $scope.Objeto_Parametro_Detalle.codigoProductoDestino === null || $scope.Objeto_Parametro_Detalle.codigoProductoDestino === undefined) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo del Producto Destino', 'error', '#ff6849', 1500);
                return;
            }

            $scope.Objeto_Parametro_Detalle.idProductoDestino = '0';
            $scope.Objeto_Parametro_Detalle.descripcionProductoDestino = '';
            $scope.Objeto_Parametro_Detalle.idUMDestino = '';
            $scope.Objeto_Parametro_Detalle.descripcionUMDestino = '';

            $scope.Objeto_Parametro_Detalle.nroLoteDestino = '';
            $scope.Objeto_Parametro_Detalle.fechaProduccionDestino = null;
            $scope.Objeto_Parametro_Detalle.fechaVencimientoDestino = null;
            $scope.Objeto_Parametro_Detalle.cantidad = '0';
            $scope.Objeto_Parametro_Detalle.factorMultiplicacion_TransDestino = '0';
        }

        let codigoProd = (opcion === 'ORIGEN') ? $scope.Objeto_Parametro_Detalle.codigoProductoOrigen : $scope.Objeto_Parametro_Detalle.codigoProductoDestino;

        $scope.loaderSave = true;
        transferenciasNewServices.get_buscarProducto_codigoNew($scope.Objeto_Parametro.idLocal, $scope.Objeto_Parametro.idAlmacen, codigoProd, $scope.id_usuario_Global, opcion)
            .then(function (res) {
                $scope.loaderSave = false;

                if (res.ok == true) {
                    if (res.data.length > 0) {

                        if (res.data.length == 1) {

                            if (opcion === 'ORIGEN') {
                                $scope.Objeto_Parametro_Detalle.idProductoOrigen = res.data[0].id_Producto;
                                $scope.Objeto_Parametro_Detalle.descripcionProductoOrigen = res.data[0].descripcion_Producto;
                                $scope.Objeto_Parametro_Detalle.idUMOrigen = res.data[0].id_unidadMedida;
                                $scope.Objeto_Parametro_Detalle.descripcionUMOrigen = res.data[0].descripcion_unidadMedida;

                                $scope.Objeto_Parametro_Detalle.nroLoteOrigen = res.data[0].nro_lote;
                                $scope.Objeto_Parametro_Detalle.fechaProduccionOrigen = res.data[0].fecha_Produccion;
                                $scope.Objeto_Parametro_Detalle.fechaVencimientoOrigen = res.data[0].fecha_Vencimiento;
                                $scope.Objeto_Parametro_Detalle.stock = res.data[0].stock;
                                $scope.Objeto_Parametro_Detalle.factorMultiplicacion_TransOrigen = res.data[0].factorMultiplicacion_Trans;

                                const idUM = (!res.data[0].id_unidadMedida) ? '0' : res.data[0].id_unidadMedida;
                                const FactMulti = (!res.data[0].factorMultiplicacion_Trans) ? '0' : res.data[0].factorMultiplicacion_Trans;
                
                                idUnidad_Global = idUM;
                                factor_Global = FactMulti;
                                stock_Global = res.data[0].stock;

                                $timeout(function () {
                                    $('#txt_cod_productoDestino').focus().select();
                                }, 0);
                            }
                            if (opcion === 'DESTINO') {
                                $scope.Objeto_Parametro_Detalle.idProductoDestino = res.data[0].id_Producto;
                                $scope.Objeto_Parametro_Detalle.descripcionProductoDestino = res.data[0].descripcion_Producto;
                                $scope.Objeto_Parametro_Detalle.idUMDestino = String(res.data[0].id_unidadMedida);
                                $scope.Objeto_Parametro_Detalle.descripcionUMDestino = res.data[0].descripcion_unidadMedida;

                                //$scope.Objeto_Parametro_Detalle.nroLoteDestino = res.data[0].nro_lote;
                                //$scope.Objeto_Parametro_Detalle.fechaProduccionDestino = res.data[0].fecha_Produccion;
                                //$scope.Objeto_Parametro_Detalle.fechaVencimientoDestino = res.data[0].fecha_Vencimiento;
                                $scope.Objeto_Parametro_Detalle.cantidad = 0;
                                $scope.Objeto_Parametro_Detalle.factorMultiplicacion_TransDestino = res.data[0].factorMultiplicacion_Trans;
                                $scope.UnidadesMedidaModal(auxiliarServices.getUserId(), res.data[0].id_Producto, String(res.data[0].id_unidadMedida));
 
                            }

                        } else {

                            var regionDetalle_Producto = document.getElementById('regionDetalle_Producto');
                            $('#txt_busquedaProducto').val(codigoProd);

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


    $scope.limpiarDetalle = function () {

        $scope.Objeto_Parametro_Detalle = {

            id_GuiaCab: $scope.id_GuiaCab_Global,
            id_GuiaDet: '0',
            idProductoOrigen: '0',
            codigoProductoOrigen: '',
            descripcionProductoOrigen: '',

            idUMOrigen: '0',
            descripcionUMOrigen: '',
            nroLoteOrigen: '',
            fechaProduccionOrigen: null,
            fechaVencimientoOrigen: null,
            stock: '0',
            factorMultiplicacion_TransOrigen: '0',

            idProductoDestino: '0',
            codigoProductoDestino: '',
            descripcionProductoDestino: '',
            idUMDestino: '0',
            descripcionUMDestino: '',
            nroLoteDestino: '',
            fechaProduccionDestino: null,
            fechaVencimientoDestino: null,
            factorMultiplicacion_TransDestino: '0',
            cantidad: '0',
            usuario_creacion: $scope.id_usuario_Global,
        }

        $timeout(function () {
            $('#cbo_unidadModal').val("0").trigger('change.select2');
            $('#dtpFechaProduccionDestino').datepicker('setDate', null);
            $('#dtpFechaVencimientoDestino').datepicker('setDate', null);
        }, 100);

    }

    $scope.nuevoTransformacionDet = function () {
        $scope.Flag_modoEdicion_Det = false;
        $scope.disabledEdicion = "";
        $scope.id_GuiaDet_Global = 0;
        $scope.limpiarDetalle();
    }

    $scope.Open_New_Modal_AyudaProducto = function (opcion) {
        var regionDetalle_Producto = document.getElementById('regionDetalle_Producto');
        $('#txt_busquedaProducto').val('');

        $scope.opcionBusquedaProducto_Global = opcion;

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

        if ($scope.Objeto_Parametro.idLocal == '0' || $scope.Objeto_Parametro.idLocal == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Local', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.idAlmacen == '0' || $scope.Objeto_Parametro.idAlmacen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacén', 'error', '#ff6849', 1500);
            return false;
        }

        const filtroProducto = document.getElementById('txt_busquedaProducto').value;
        let regionDetalle_Producto = document.getElementById('regionDetalle_Producto');


        $scope.loader_modal_ayuda = true;
        transferenciasNewServices.get_buscarProducto_todosNew($scope.Objeto_Parametro.idLocal, $scope.Objeto_Parametro.idAlmacen, filtroProducto, $scope.id_usuario_Global, $scope.opcionBusquedaProducto_Global )
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
                        auxiliarServices.NotificationMessage('Sistemas', 'No se encontro resultado con el codigo del Producto ingresado, verifique.', 'error', '#ff6849', 3000);
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

    $scope.Agregar_Producto = function ({ id_Producto, codigo_Producto, descripcion_Producto, id_unidadMedida, descripcion_unidadMedida, nro_lote, fecha_Produccion, fecha_Vencimiento, stock, factorMultiplicacion_Trans }) {

        if ($scope.opcionBusquedaProducto_Global == 'ORIGEN') {

            if (isNaN(stock)) {
                auxiliarServices.NotificationMessage('Sistemas', 'El valor del Stock no es un Número', 'error', '#ff6849', 3000);
            }

            if (stock <= 0) {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos no hay Stock disponible..', 'error', '#ff6849', 3000);
            }

            $scope.Objeto_Parametro_Detalle.idProductoOrigen = id_Producto;
            $scope.Objeto_Parametro_Detalle.codigoProductoOrigen = codigo_Producto;
            $scope.Objeto_Parametro_Detalle.descripcionProductoOrigen = descripcion_Producto;
            $scope.Objeto_Parametro_Detalle.idUMOrigen = id_unidadMedida;
            $scope.Objeto_Parametro_Detalle.descripcionUMOrigen = descripcion_unidadMedida;

            $scope.Objeto_Parametro_Detalle.nroLoteOrigen = nro_lote;
            $scope.Objeto_Parametro_Detalle.fechaProduccionOrigen = fecha_Produccion;
            $scope.Objeto_Parametro_Detalle.fechaVencimientoOrigen = fecha_Vencimiento;
            $scope.Objeto_Parametro_Detalle.stock = stock;
            $scope.Objeto_Parametro_Detalle.factorMultiplicacion_TransOrigen = factorMultiplicacion_Trans;

            $('#modalAyuda_Producto').modal('hide');
            $timeout(function () {
                $('#txt_cod_productoDestino').focus().select();
            }, 500);
        }
        if ($scope.opcionBusquedaProducto_Global == 'DESTINO') {

            $scope.Objeto_Parametro_Detalle.idProductoDestino = id_Producto;
            $scope.Objeto_Parametro_Detalle.codigoProductoDestino = codigo_Producto;

            $scope.Objeto_Parametro_Detalle.descripcionProductoDestino = descripcion_Producto;
            $scope.Objeto_Parametro_Detalle.idUMDestino = id_unidadMedida;
            $scope.Objeto_Parametro_Detalle.descripcionUMDestino = descripcion_unidadMedida;

            $scope.Objeto_Parametro_Detalle.nroLoteDestino = nro_lote;
            $scope.Objeto_Parametro_Detalle.fechaProduccionDestino = fecha_Produccion;
            $scope.Objeto_Parametro_Detalle.fechaVencimientoDestino = fecha_Vencimiento;
            $scope.Objeto_Parametro_Detalle.cantidad = 0;
            $scope.Objeto_Parametro_Detalle.factorMultiplicacion_TransDestino = factorMultiplicacion_Trans;

            $('#modalAyuda_Producto').modal('hide');
 
            $scope.UnidadesMedidaModal(auxiliarServices.getUserId(), id_Producto, String(id_unidadMedida));
 
            //$timeout(function () {
            //    $('#txtCantDet').focus().select();
            //}, 500);

        }
    };

    $scope.guardarTransformacionProducto_Det = function () {
 

        if ($scope.id_GuiaCab_Global == '0' || $scope.id_GuiaCab_Global == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'No se cargó el ID principal, actualice su página e intente nuevamente..', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.codigoProductoOrigen == '' || $scope.Objeto_Parametro_Detalle.codigoProductoOrigen == null || $scope.Objeto_Parametro_Detalle.codigoProductoOrigen == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor busque el Producto Origen, por medio del código', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.idProductoOrigen == '0' || $scope.Objeto_Parametro_Detalle.idProductoOrigen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione Enter o el boton buscar para buscar el Producto Origen ', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.descripcionProductoOrigen == '' || $scope.Objeto_Parametro_Detalle.descripcionProductoOrigen == null || $scope.Objeto_Parametro_Detalle.descripcionProductoOrigen == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione Enter o el boton buscar para buscar el Producto', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.codigoProductoDestino == '' || $scope.Objeto_Parametro_Detalle.codigoProductoDestino == null || $scope.Objeto_Parametro_Detalle.codigoProductoDestino == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor busque el Producto Destino, por medio del código', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.idProductoDestino == '0' || $scope.Objeto_Parametro_Detalle.idProductoDestino == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione Enter o el boton buscar para buscar el Producto Destino ', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.descripcionProductoDestino == '' || $scope.Objeto_Parametro_Detalle.descripcionProductoDestino == null || $scope.Objeto_Parametro_Detalle.descripcionProductoDestino == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione Enter o el boton buscar para buscar el Producto Destino', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.idUMDestino == '0' || $scope.Objeto_Parametro_Detalle.idUMDestino == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Unidad de Medida del Destino ', 'error', '#ff6849', 1500);
            return false;
        }



         //if ($scope.Flag_modoEdicion_Det == false) {
        //    if ($scope.producto_Ya_agregrado($scope.Objeto_Parametro_Detalle.idProductoOrigen, $scope.Objeto_Parametro_Detalle.idUMOrigen, $scope.Objeto_Parametro_Detalle.nroLoteOrigen, $scope.Objeto_Parametro_Detalle.fechaProduccionOrigen )) {
        //        auxiliarServices.NotificationMessage('Sistemas', 'El Producto Origen ya se encuentra agregado, verifique..', 'error', '#ff6849', 1500);
        //        return false;
        //    }
        //}

        if ($scope.Objeto_Parametro_Detalle.cantidad == '0' || $scope.Objeto_Parametro_Detalle.cantidad == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese una Cantidad ', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_Detalle.cantidad  < 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese una Cantidad Positiva', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.stock == 0 || $scope.Objeto_Parametro_Detalle.stock == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos no hay Stock disponible..', 'error', '#ff6849', 3000);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.stock < $scope.Objeto_Parametro_Detalle.cantidad ) {
            auxiliarServices.NotificationMessage('Sistemas', 'La cantidad Supera el Stock, verifique.', 'error', '#ff6849', 3000);
            return false;
        }

        $scope.Objeto_Parametro_Detalle.id_GuiaCab = $scope.id_GuiaCab_Global;

        const fechaProduccionOrigen = $scope.Objeto_Parametro_Detalle.fechaProduccionOrigen;
        const fechaVencimientoOrigen = $scope.Objeto_Parametro_Detalle.fechaVencimientoOrigen;

        const fechaProduccionDestino = $scope.Objeto_Parametro_Detalle.fechaProduccionDestino;
        const fechaVencimientoDestino = $scope.Objeto_Parametro_Detalle.fechaVencimientoDestino;

        $scope.Objeto_Parametro_Detalle.fechaProduccionOrigen = (fechaProduccionOrigen == null) ? null : auxiliarServices.changeFormatDate(2, fechaProduccionOrigen);
        $scope.Objeto_Parametro_Detalle.fechaVencimientoOrigen = (fechaVencimientoOrigen == null) ? null : auxiliarServices.changeFormatDate(2, fechaVencimientoOrigen);

        $scope.Objeto_Parametro_Detalle.fechaProduccionDestino = (fechaProduccionDestino == null) ? null : auxiliarServices.changeFormatDate(2, fechaProduccionDestino);
        $scope.Objeto_Parametro_Detalle.fechaVencimientoDestino = (fechaVencimientoDestino == null) ? null : auxiliarServices.changeFormatDate(2, fechaVencimientoDestino);

  
        $scope.loaderSave = true;
        transformacionProductosServices.save_update_transformacionProductoDet($scope.Objeto_Parametro_Detalle )
        .then(function (res) {

            $scope.loaderSave = false;
            $scope.Objeto_Parametro_Detalle.fechaProduccionOrigen = fechaProduccionOrigen;
            $scope.Objeto_Parametro_Detalle.fechaVencimientoOrigen = fechaVencimientoOrigen;

            $scope.Objeto_Parametro_Detalle.fechaProduccionDestino = fechaProduccionDestino;
            $scope.Objeto_Parametro_Detalle.fechaVencimientoDestino = fechaVencimientoDestino;

            if (res.ok == true) {
                $scope.nuevoTransformacionDet();
                $scope.listandoTransformacionDetalle();
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
        }, function (error) {

            $scope.Objeto_Parametro_Detalle.fechaProduccionOrigen = fechaProduccionOrigen;
            $scope.Objeto_Parametro_Detalle.fechaVencimientoOrigen = fechaVencimientoOrigen;

            $scope.Objeto_Parametro_Detalle.fechaProduccionDestino = fechaProduccionDestino;
            $scope.Objeto_Parametro_Detalle.fechaVencimientoDestino = fechaVencimientoDestino;

            $scope.loaderSave = false;
            alert(JSON.stringify(error));
        })

         
    }

    $scope.producto_Ya_agregrado = function (idProducto, idUnidad, nroLote,fechaProduccion) {
        const producto = $scope.listTransformacionProducto_Det.find((prod) => prod.id_Producto == idProducto && prod.id_unidadMedida == idUnidad && prod.nro_lote == nroLote && prod.fecha_Produccion == fechaProduccion );
        return (producto) ? true : false;
    }
     
    $scope.listTransformacionProducto_Det = [];
    $scope.listandoTransformacionDetalle = function () {

        if ($scope.id_GuiaCab_Global == '0' || $scope.id_GuiaCab_Global == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Primero la cabecera de la Transformacion del Producto', 'error', '#ff6849', 1500);
            return false;
        }

        $scope.loaderSave = true;
        $scope.listTransformacionProducto_Det = [];
        transformacionProductosServices.get_transformacionesProductoDetalle($scope.id_GuiaCab_Global)
            .then(function (res) {
                $scope.loaderSave = false;
                if (res.ok == true) {
                    $scope.listTransformacionProducto_Det = [];
                    $scope.listTransformacionProducto_Det = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderSave = false;
                console.log(error)
            })
    }

    $scope.editarTransformacionProducto = function ({ id_GuiaCab, id_GuiaDet, idProductoOrigen, codigoProductoOrigen, descripcionProductoOrigen, idUMOrigen, descripcionUMOrigen, nroLoteOrigen, fechaProduccionOrigen, fechaVencimientoOrigen, stock, factorMultiplicacion_TransOrigen, idProductoDestino, codigoProductoDestino, descripcionProductoDestino, idUMDestino, descripcionUMDestino, nroLoteDestino, fechaProduccionDestino, fechaVencimientoDestino, factorMultiplicacion_TransDestino, cantidad}) {

        $scope.Flag_modoEdicion_Det = true;
        $scope.disabledEdicion = "disabledContent";

        $scope.Objeto_Parametro_Detalle = {
            id_GuiaCab,
            id_GuiaDet,
            idProductoOrigen,
            codigoProductoOrigen,
            descripcionProductoOrigen,

            idUMOrigen,
            descripcionUMOrigen,

            nroLoteOrigen,
            fechaProduccionOrigen,
            fechaVencimientoOrigen,
            stock,
            factorMultiplicacion_TransOrigen,

            idProductoDestino,
            codigoProductoDestino,
            descripcionProductoDestino,

            idUMDestino,
            descripcionUMDestino,

            nroLoteDestino,
            fechaProduccionDestino,
            fechaVencimientoDestino,
            factorMultiplicacion_TransDestino,
            cantidad,
            usuario_creacion: $scope.id_usuario_Global,
        }

        console.log($scope.Objeto_Parametro_Detalle);
        $scope.UnidadesMedidaModal(auxiliarServices.getUserId(), idProductoDestino, String(idUMDestino));


        //$scope.loaderSave = true;
        //transferenciasNewServices.get_buscarProducto_edicion($scope.Objeto_Parametro.idLocal, $scope.Objeto_Parametro.idAlmacen, $scope.Objeto_Parametro_Detalle.id_Material, $scope.Objeto_Parametro_Detalle.id_UnidadMedida_Ingreso, $scope.Objeto_Parametro_Detalle.nroLote, $scope.id_usuario_Global, $scope.Objeto_Parametro_Detalle.fechaProduccion)
        //    .then(function (res) {
        //        $scope.loaderSave = false;

        //        if (res.ok == true) {
        //            if (res.data.length > 0) {

        //                let stockBD = (res.data[0].stock + cantidad_TranferenciaDet);
        //                $scope.Objeto_Parametro_Detalle.stock = stockBD;

        //            } else {
        //                auxiliarServices.NotificationMessage('Sistemas', 'No se encontro resultado con el codigo del Producto ingresado, verifique.', 'error', '#ff6849', 3000);
        //            }

        //            $timeout(function () {
        //                $('#txtCantDet').focus().select();
        //            }, 0);

        //        } else {
        //            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
        //            alert(res.data);
        //        }
        //    }, function (err) {
        //        $scope.loaderSave = false;
        //        console.log(err);
        //    });
    }

    $scope.eliminarTransformacionProducto = function (item) {
         var params = {
            title: "Desea continuar ?",
            text: 'Esta por eliminar el registro',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderFiltro = true;
                transformacionProductosServices.set_eliminarTransformacionProducto_Detalle(item.id_GuiaDet)
                    .then(function (res) {
                        $scope.loaderFiltro = false;
                        if (res.ok == true) {
                            var index = $scope.listTransformacionProducto_Det.indexOf(item);
                            if (index !== -1) {
                                $scope.listTransformacionProducto_Det.splice(index, 1);

                                if ($scope.listTransformacionProducto_Det.length ==0) {
                                    $timeout(function () {
                                        $scope.disabledCab = ""
                                    }, 500)
                                }
                            }
                        } else {
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(JSON.stringify(res.data));
                        }
                    })
            }
        });
    }

    $scope.EdicionRegistros = function (obj) {

        $scope.Flag_modoEdicion = true;
        $scope.id_GuiaCab_Global = obj.id_GuiaCab;

        $('#modalMantenimiento').modal('show');

        $scope.loaderSave = true;
        $scope.listTransformacionProducto_Det = [];
        transformacionProductosServices.get_transformacionesProductoCab_edicion($scope.id_GuiaCab_Global)
            .then(function (res) {
                $scope.loaderSave = false;
                if (res.ok == true) {

                    console.log(res.data);
                    const { id_GuiaCab, idLocal, idAlmacen, idTipoDoc, nroDoc, fechaDoc, idProveedor, nroRuc, descripcionProveedor } = res.data[0];
                    $scope.Objeto_Parametro = {
                        id_GuiaCab,
                        idLocal,
                        idAlmacen,
                        idTipoDoc,
                        nroDoc ,
                        fechaDoc,
                        idProveedor,
                        nroRuc,
                        descripcionProveedor,
                        usuario_creacion: $scope.id_usuario_Global,
                    }

                   $timeout(function () {
                       $('#cboLocal').val(String(idLocal)).trigger('change.select2');
                       $('#cboAlmacen').val(String(idAlmacen)).trigger('change.select2');
                        $('#cboTipoDoc').val("13").trigger('change.select2');
                       $('#dtpFechaDoc').datepicker('setDate', fechaDoc);
                    }, 0);


                    $scope.change_almacenLocal('ORIGEN', String(idLocal), String(idAlmacen)); 
                    $scope.nuevoTransformacionDet();
                    $scope.listandoTransformacionDetalle();

                    $timeout(function () {
                        if (obj.estado == '3') {
                            $scope.disabledCab = "disabledContent";
                            $scope.disabledProd = "";
                            $scope.disabledForm = "";
                        } else {
                            $scope.disabledCab = "disabledContent";
                            $scope.disabledProd = "disabledContent";
                            $scope.disabledForm = "disabledContent";
                        }
                    }, 500);
 
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderSave = false;
                console.log(error)
            })

    }

    //$scope.cerrarTransferencias = function () {
    //    if ($scope.Objeto_Parametro.idLocal != $scope.Objeto_Parametro.destino_id_Local) {

    //        $scope.clean();
    //        $('#modalAprobar').modal('show');

    //    } else {
    //        var params = {
    //            title: "Desea continuar ?",
    //            text: 'Esta por Cerrar la Transferencia',
    //            type: 'confirmationAlert',
    //        }
    //        auxiliarServices.initSweetAlert(params).then(function (res) {
    //            if (res == true) {
    //                $scope.loaderSave = true;
    //                transferenciasNewServices.set_cerrarTransferencia($scope.id_GuiaCab_Global, $scope.id_usuario_Global  )
    //                    .then(function (res) {
    //                        $scope.loaderSave = false;
    //                        if (res.ok == true) {
    //                            $timeout(function () {
    //                                let params = {
    //                                    type: 'alert',
    //                                    title: 'Excelente !',
    //                                    text: 'Proceso de Registro realizado correctamente !'
    //                                }
    //                                auxiliarServices.initSweetAlert(params).then(function (res) {
    //                                });
    //                            }, 500)

    //                            $('#modalMantenimiento').modal('hide');
    //                            $scope.mostrandoInformacion();

    //                        } else {
    //                            $scope.loaderSave = false;
    //                            alert(JSON.stringify(res.data));
    //                        }
    //                    }, function (error) {
    //                        $scope.loaderSave = false;
    //                        alert(JSON.stringify(error));
    //                    })
    //            }
    //        });
    //    }
    //}


    //---metodos de la  Guia

    $scope.Lista_Transportista = [];
    $scope.Listando_Transportista = function () {
        TransportistaServices.getTransportista().then(function (data) {
            $scope.Lista_Transportista = [];
            $scope.Lista_Transportista = data;
        }, function (err) {
            console.log(err);
        })
    };
    $scope.Listando_Transportista();

    $scope.Lista_Vehiculo = [];
    $scope.Listando_Vehiculo = function (value) {
        VehiculoServices.getVehiculo().then(function (data) {
            $scope.Lista_Vehiculo = [];
            $scope.Lista_Vehiculo = data;
        }, function (err) {
            console.log(err);
        })
    };
    $scope.Listando_Vehiculo();

    $scope.Lista_Proveedor = [];
    $scope.Listando_Proveedor = function (value) {
        ProveedorServices.getProveedores()
            .then(function (data) {
                $scope.Lista_Proveedor = [];
                $scope.Lista_Proveedor = data;
            }, function (err) {
                console.log(err);
            })
    };
    $scope.Listando_Proveedor();

    $scope.change_Proveedor = function () {
        if ($scope.objeto_parametros.id_Proveedor == '0' || $scope.objeto_parametros.id_Proveedor == 0) {
            $scope.objeto_parametros.direccion_Proveedor = '';
            return;
        }

        for (var i = 0; i < $scope.Lista_Proveedor.length; i++) {
            if (parseInt($scope.Lista_Proveedor[i].id_Proveedor) == parseInt($scope.objeto_parametros.id_Proveedor)) {
                $scope.objeto_parametros.direccion_Proveedor = $scope.Lista_Proveedor[i].direccion_Proveedor;
            }
        }
    }

    $scope.objeto_parametros = {
        serie: '',
        nroDocumento: '',
        fecha_emision: '',
        fecha_emisionAux: '',
        id_Transportista: 0,
        rucTransportista: '',
        id_vehiculo: 0,
        vehiculo_Placa: '',
        id_Proveedor: 0,
        direccion_Proveedor: '',
        fecha_traslado: '',
        fecha_trasladoAux: ''
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


    $scope.Generate_GuiaRemision = function () {
        if (IngresoTransferenciasServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }
        var params = {
            title: "Desea continuar ?",
            text: 'Es por Cerrar la Transferencia y Generar la Guía.',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {

                const generarGuiaRemision_Transf = () => {

                    $scope.objeto_parametros.fecha_emisionAux = auxiliarServices.changeFormatDate(2, $scope.objeto_parametros.fecha_emision);
                    $scope.objeto_parametros.fecha_trasladoAux = auxiliarServices.changeFormatDate(2, $scope.objeto_parametros.fecha_traslado);

                    IngresoTransferenciasServices.get_generar_Guia_transferencia( $scope.id_GuiaCab_Global, $scope.id_usuario_Global, $scope.objeto_parametros)
                        .then(function (res) {
                            $scope.loaderSave = false;
                            $scope.loaderCab = false;
                            if (res.ok == true) {


                                $('#modalMantenimiento').modal('hide');
                                $('#modalAprobar').modal('hide');

                                $scope.mostrandoInformacion();

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
                                $scope.loader_modal = false;
                                alert(JSON.stringify(res.data));
                            }
                        }, function (error) {
                            $scope.loaderSave = false;
                            $scope.loaderCab = false;
                            alert('ERROR AL GENERAR GUIA  : ' + JSON.stringify(error));
                        })
                }

                ///----validacio del nro de Guia----
                $scope.loaderSave = true;
                IngresoTransferenciasServices.get_ValidarNroGuia($scope.objeto_parametros)
                    .then(function (data) {
                        $scope.loaderSave = false;
                        if (data == 0) {
                            generarGuiaRemision_Transf();
                        } else {
                            auxiliarServices.NotificationMessage('Sistemas', 'El nro de Documento de la Guia ya existe, verifique ', 'error', '#ff6849', 1500);
                        }
                    }, function (error) {
                        $scope.loaderSave = false;
                        alert(JSON.stringify(error));
                    })
            }
        });
    }

 
    $scope.reactivarTransferencia = function (item) {
        if (item.NroDocumento_Alm_Guias_Ingreso == '' || item.NroDocumento_Alm_Guias_Ingreso  == null ) {
            var params = {
                title: "Desea continuar ?",
                text: 'Esta por Reactivar la Transferencia ?',
                type: 'confirmationAlert',
            }
            auxiliarServices.initSweetAlert(params).then(function (res) {
                if (res == true) {

                    $scope.loaderSave = true;
                    transferenciasNewServices.set_reactivarTransferencia(item.Id_AlmTranCab,'N', $scope.id_usuario_Global)
                        .then(function (res) {
                            $scope.loaderSave = false;
                            if (res.ok == true) {
                                $timeout(function () {
                                    let params = {
                                        type: 'alert',
                                        title: 'Excelente !',
                                        text: 'Reactivado realizado correctamente !'
                                    }
                                    auxiliarServices.initSweetAlert(params).then(function (res) {
                                    });
                                }, 500)

                                $scope.mostrandoInformacion();

                            } else {
                                $scope.loaderSave = false;
                                alert(JSON.stringify(res.data));
                            }
                        }, function (error) {
                            $scope.loaderSave = false;
                            alert(JSON.stringify(error));
                        })

                }
            });

        } else { //// Poseen Guia de Remision ----

            var params = {
                title: "Desea continuar ?",
                text: 'La Transferencia, tiene asociada una Guía de Remisión, para Reactivar es necesario Anular la Guía ?',
                type: 'confirmationAlert',
            }
            auxiliarServices.initSweetAlert(params).then(function (res) {
                if (res == true) {

                    $scope.loaderSave = true;
                    transferenciasNewServices.set_reactivarTransferencia(item.Id_AlmTranCab, 'S', $scope.id_usuario_Global)
                        .then(function (res) {
                            $scope.loaderSave = false;
                            if (res.ok == true) {
                                $timeout(function () {
                                    let params = {
                                        type: 'alert',
                                        title: 'Excelente !',
                                        text: 'Reactivado realizado correctamente !'
                                    }
                                    auxiliarServices.initSweetAlert(params).then(function (res) {
                                    });
                                }, 500)

                                $scope.mostrandoInformacion();

                            } else {
                                $scope.loaderSave = false;
                                alert(JSON.stringify(res.data));
                            }
                        }, function (error) {
                            $scope.loaderSave = false;
                            alert(JSON.stringify(error));
                        })

                }
            });

        }




    };
    $scope.Listando_Proveedor();



    ////----- PARTE FINAL ----


    //auxiliarServices.getUserId(), data[0].id_producto
    $scope.UnidadesMedidaModal = function (id_usuario, id_producto, idUM) {

        //------ unidad de medida en linea -----
        $scope.ListaUnidadMedidaModal = [];
        PedidosServices.get_unidadMedidasFactor(id_usuario, id_producto)
            .then((res) => {

                if (res.ok == true) {
                    $scope.ListaUnidadMedidaModal = res.data;

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

                $timeout(function () {
                    $scope.$apply();

                    const umd = $scope.ListaUnidadMedidaModal.find(m => m.id_unidadMedida == idUM);

                    if (umd) {
                        $('#cbo_unidadModal').val(String(idUM)).trigger('change.select2');
                    } else {
                        $scope.Objeto_Parametro_Detalle.idUMDestino = '0';
                        $('#cbo_unidadModal').val('0').trigger('change.select2');
                    }
        
                    $('#txtCantDet').focus().select();
                }, 0);
            });
                //------Fin unidad de medida en linea -----
    }

    $scope.tipoDocumento= function () {
        TipoDocumentoServices.getTipoDocumento()
        .then(function (res) {

            $scope.listTipoDocumentos = res.filter(d => (d.id_TipoDocumento == 13));
            
            $timeout(function () {
                $scope.Objeto_Parametro.idTipoDoc = String('13');
                $('#cboTipoDoc').val(String('13')).trigger('change.select2');
            },1000)
        
        }, function (err) {
            console.log(err);
        })
    }
    $scope.tipoDocumento();

    $scope.ListaUnidadMedidaModal = [];
    $scope.change_unidadStock = function () {
        if ($scope.Objeto_Parametro_Detalle.idUMDestino == '0') {
            $scope.Objeto_Parametro_Detalle.stock = stock_Global;
            $scope.Objeto_Parametro_Detalle.factorMultiplicacion_TransOrigen = factor_Global;
            /*  $scope.Objeto_Parametro_Detalle.precioVenta_Pedido_Det = 0;*/
        } else {

            const { id_unidadMedida, nombre_UnidadMedida, factor_UnidadMedida } = $scope.ListaUnidadMedidaModal.find((u) => u.id_unidadMedida == $scope.Objeto_Parametro_Detalle.idUMDestino);

            $scope.Objeto_Parametro_Detalle.factorMultiplicacion_TransOrigen = factor_UnidadMedida;

            if (idUnidad_Global != id_unidadMedida) {
                $scope.Objeto_Parametro_Detalle.stock = (stock_Global * factor_Global / factor_UnidadMedida).toFixed(2)
                //$scope.Objeto_Parametro_Detalle.precioVenta_Pedido_Det = (precioVenta_Global / factor_Global * factor_UnidadMedida).toFixed(4)
            }
            else {
                $scope.Objeto_Parametro_Detalle.stock = stock_Global;
                $scope.Objeto_Parametro_Detalle.factorMultiplicacion_TransOrigen = factor_Global;
                //$scope.Objeto_Parametro_Detalle.precioVenta_Pedido_Det = precioVenta_Global;
            }
        }
    }

    $scope.cerrarTransformacionProducto = function () {

        if ($scope.id_GuiaCab_Global == '0' || $scope.id_GuiaCab_Global == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'No se cargó el ID principal, actualice su página e intente nuevamente..', 'error', '#ff6849', 1500);
            return false;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Cerrar la Transformacion del Producto',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderSave = true;
                transformacionProductosServices.set_cerrarTransformacionProducto($scope.id_GuiaCab_Global, $scope.id_usuario_Global)
                    .then(function (res) {
                        $scope.loaderSave = false;
                        if (res.ok == true) {
                            $timeout(function () {
                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Proceso de Registro realizado correctamente !'
                                }
                                auxiliarServices.initSweetAlert(params).then(function (res) {
                                });
                            }, 500)

                            $('#modalMantenimiento').modal('hide');
                            $scope.mostrandoInformacion();

                        } else {
                            $scope.loaderSave = false;
                            alert(JSON.stringify(res.data));
                        }
                    }, function (error) {
                        $scope.loaderSave = false;
                        alert(JSON.stringify(error));
                    })
            }
        });
   
    }


    $scope.reactivarTransformacionProducto = function (obj) {

        if (obj.id_GuiaCab == '0' || obj.id_GuiaCab == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'No se cargó el ID principal, actualice su página e intente nuevamente..', 'error', '#ff6849', 1500);
            return false;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Reactivar la Transformación del Producto',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderSave = true;
                transformacionProductosServices.set_reactivarTransformacionProducto(obj.id_GuiaCab, $scope.id_usuario_Global)
                    .then(function (res) {
                        $scope.loaderSave = false;
                        if (res.ok == true) {
                            $timeout(function () {
                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Reactivado correctamente !'
                                }
                                auxiliarServices.initSweetAlert(params).then(function (res) {
                                });
                            }, 500)

                            $scope.mostrandoInformacion();

                        } else {
                            $scope.loaderSave = false;
                            alert(JSON.stringify(res.data));
                        }
                    }, function (error) {
                        $scope.loaderSave = false;
                        alert(JSON.stringify(error));
                    })
            }
        });

    }


});