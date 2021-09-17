var app = angular.module('appGestion.transferenciasNewController', []);
app.controller('transferenciasNewController', function ($scope, TransportistaServices, VehiculoServices, ProveedorServices, LocalesServices, IngresoTransferenciasServices, AlmacenServices, $location, $timeout, auxiliarServices, EstadosServices, transferenciasNewServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;

        auxiliarServices.changeTitle("Transferencias New");
        $scope.titleModal = "Registro de Transferencias";
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

    $scope.id_TranferenciaCab_Global = 0;
    $scope.id_TranferenciaDet_Global = 0;

    $scope.Flag_modoEdicion = false;
    $scope.Flag_modoEdicion_Det = false;
    $scope.disabledProd = "disabledContent";
    $scope.disabledCab = "disabledContent";
    $scope.disabledForm = "disabledContent";
    $scope.disabledEdicion = "";
 

    $scope.id_usuario_Global = auxiliarServices.getUserId()

    $scope.Objeto_Parametro_Filtro = {
        idLocal: "0",
        idAlmacen: "0",
        idEstado: "0",
        fechaIni: auxiliarServices.getDateNow(),
        fechaFin: auxiliarServices.getDateNow(),
    };

    $scope.Objeto_Parametro = {
        Id_AlmTranCab: '0',
        id_Alm_TipoSolicitud: '0',
        nro_Transferencia: '',
        fechaEmision_TranferenciaCab: auxiliarServices.getDateNow(),
        id_TipoTransaccion: '0',
        origen_id_Local: '0',
        origen_id_Almacen: '0',
        destino_id_Local: '0',
        destino_id_Almacen: '0',
        obs_TranferenciaCab: '',
        usuarioAprueba_TranferenciaCab: '0',
        fechaAprueba_TranferenciaCab: '0',
        usuarioRechaza_TranferenciaCab: '0',
        fechaRechaza_TranferenciaCab: '0',
        flagAprobado_TranferenciaCab: '',
        Id_AlmGuiaCab_Ingreso: '0',
        NroDocumento_Alm_Guias_Ingreso: '',
        Id_AlmGuiaCab_Salida: '0',
        NroDocumento_Alm_Guias_Salida: '',
        estado: '24',
        usuario_creacion: $scope.id_usuario_Global,
    }

    $scope.Objeto_Parametro_Detalle = {
        Id_AlmTranDet: '0',
        Id_AlmTranCab: '0',
        id_Material: '0',
        codigo_Producto: '',
        descripcion_Producto: '',
        descripcion_unidadMedida : '',
        item_TranferenciaDet: '1',
        cantidad_TranferenciaDet: '',
        estado: '1',
        usuario_creacion: $scope.id_usuario_Global,
        nroLote: '',
        id_UnidadMedida_Ingreso: '0',
        fechaProduccion: null,
        fechaVencimiento: null,
        stock: '0',
        factorMultiplicacion_Trans : 0

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
                            $scope.Objeto_Parametro.origen_id_Almacen = newValue;
                        } else {
                            newValue = String(idAlmacen);
                            $scope.Objeto_Parametro.origen_id_Almacen = newValue ;
                        }     

                        $timeout(function () {
                            $('#cboAlmacen').val(newValue).trigger('change.select2');
                        });
                    }
                    if (tipoAlmacen == 'DESTINO') {
                        $scope.listAlmacenesDestino = [];
                        $scope.listAlmacenesDestino = res;

                        newValue = '0';
                        if (res.length === 0) {
                            $scope.Objeto_Parametro.destino_id_Almacen = newValue;
                        } else {
                            newValue = String(idAlmacen);
                            $scope.Objeto_Parametro.destino_id_Almacen = newValue;
                        }

                        $timeout(function () {
                            $('#cboAlmacenDestino').val(newValue).trigger('change.select2');
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

    $scope.listTransferencias = [];
    $scope.listTransferencias_Det = [];

    $scope.mostrandoInformacion = function () {
        $scope.loaderFiltro = true;
        var p = $scope.Objeto_Parametro_Filtro;
        var filter = p.idLocal + '|' + p.idAlmacen + '|' + p.idEstado + '|' + auxiliarServices.changeFormatDate(2, p.fechaIni) + '|' + auxiliarServices.changeFormatDate(2, p.fechaFin);
        var params = {
            value: "1",
            filter: filter
        };
        IngresoTransferenciasServices.getTransferencias(params)
            .then(function (res) {
                res.forEach(function (item, index) {
                    if (item.estado === 24) {
                        item['desEstado'] = "Generado";
                        item['colorEstado'] = "success";
                    } else if (item.estado === 26) {
                        item['desEstado'] = "Rechazado";
                        item['colorEstado'] = "danger";
                    } else if (item.estado === 25) {
                        item['desEstado'] = "Aprobado";
                        item['colorEstado'] = "info";
                    }
                    else if (item.estado === 37) {
                        item['desEstado'] = "Por Aprobar";
                        item['colorEstado'] = "primary";
                    }
                });

                $scope.listTransferencias = [];
                $scope.listTransferencias = res;
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
        $scope.nuevaTransferencia();
        $scope.disabledForm = "";
        $scope.disabledCab = "";
        $scope.disabledProd = "disabledContent";

        $scope.nuevoDet();
        $('#modalMantenimiento').modal('show');
    }

    $scope.nuevoTranferenciaCab_Det = function () {
        $scope.nuevaTransferencia();
        $scope.disabledForm = "";
        $scope.nuevoDet();
    }
     


    $scope.nuevaTransferencia = function () {
        $scope.Flag_modoEdicion = false;
        $scope.id_TranferenciaCab_Global = 0;
        $scope.blank();
        $scope.disabledForm = "";
        $scope.disabledCab = "";
        $scope.disabledProd = "disabledContent";

        $scope.listTransferencias_Det = [];
    }

    $scope.blank = function () {
        $scope.Objeto_Parametro = {
            Id_AlmTranCab: '0',
            id_Alm_TipoSolicitud: '1',
            nro_Transferencia: '',
            fechaEmision_TranferenciaCab: auxiliarServices.getDateNow(),
            id_TipoTransaccion: '0',
            origen_id_Local: '0',
            origen_id_Almacen: '0',
            destino_id_Local: '0',
            destino_id_Almacen: '0',
            obs_TranferenciaCab: '',
            //usuarioAprueba_TranferenciaCab: '0',
            //fechaAprueba_TranferenciaCab: '0',
            //usuarioRechaza_TranferenciaCab: '0',
            //fechaRechaza_TranferenciaCab: '0',
            //flagAprobado_TranferenciaCab: '',
            //Id_AlmGuiaCab_Ingreso: '0',
            //NroDocumento_Alm_Guias_Ingreso: '',
            //Id_AlmGuiaCab_Salida: '0',
            //NroDocumento_Alm_Guias_Salida: '',
            estado: '25',
            usuario_creacion: $scope.id_usuario_Global,
        }

 

        $timeout(function () {
            $('#cboLocal').val("0").trigger('change.select2');
            $('#cboAlmacen').val("0").trigger('change.select2');
            $('#cboLocalDestino').val("0").trigger('change.select2');
            $('#cboAlmacenDestino').val('0').trigger('change.select2');
            $('#txtFechaEmision').datepicker('setDate', new Date());
        }, 0);
    }

    $scope.saveUpdate = async function () {

        if ($scope.Objeto_Parametro.fechaEmision_TranferenciaCab == '' || $scope.Objeto_Parametro.fechaEmision_TranferenciaCab == null || $scope.Objeto_Parametro.fechaEmision_TranferenciaCab == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la fecha emision', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro.origen_id_Local == '0' || $scope.Objeto_Parametro.origen_id_Local == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Local de Origen', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.origen_id_Almacen == '0' || $scope.Objeto_Parametro.origen_id_Almacen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacén de  Origen', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro.destino_id_Local == '0' || $scope.Objeto_Parametro.destino_id_Local == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el  Local de Destino', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.destino_id_Almacen == '0' || $scope.Objeto_Parametro.destino_id_Almacen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacén de Destino' , 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro.origen_id_Almacen == $scope.Objeto_Parametro.destino_id_Almacen) {
            showErorCab(3, 'Almacen de Origen y Destino no pueden ser iguales, favor de verificar.');
            return;
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


        const fechaEmision = $scope.Objeto_Parametro.fechaEmision_TranferenciaCab;
        $scope.Objeto_Parametro.fechaEmision_TranferenciaCab = (!$scope.Objeto_Parametro.fechaEmision_TranferenciaCab) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro.fechaEmision_TranferenciaCab);
 
        $scope.loaderSave = true;
        transferenciasNewServices.set_save_update_transferenciasCab($scope.Objeto_Parametro)
            .then(function (res) {

                $scope.loaderSave = false;
                $scope.Flag_modoEdicion = true;
                $scope.Objeto_Parametro.fechaEmision_TranferenciaCab = fechaEmision;

                if (res.ok == true) {
                    $scope.Objeto_Parametro.Id_AlmTranCab = res.data;
                    $scope.id_TranferenciaCab_Global = res.data;

                    $scope.disabledCab = "disabledContent";
                    $scope.disabledProd = "";
                    $scope.mostrandoInformacion();

                    $timeout(function () {
                        let msj = ($scope.Flag_modoEdicion == true) ? 'Actualizacion Realizada Correctamente' : 'Transferencia Generada Correctamente';
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
                $scope.Objeto_Parametro.fechaEmision_TranferenciaCab = fechaEmision;
                $scope.loaderSave = false;
                alert(error);
            })
       
    }

    $scope.BuscarProducto = function () {

        if ($scope.Objeto_Parametro.origen_id_Local == '0' || $scope.Objeto_Parametro.origen_id_Local == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Local de Origen', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.origen_id_Almacen == '0' || $scope.Objeto_Parametro.origen_id_Almacen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacén de  Origen', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.codigo_Producto === '0' || $scope.Objeto_Parametro_Detalle.codigo_Producto === '' || $scope.Objeto_Parametro_Detalle.codigo_Producto === null || $scope.Objeto_Parametro_Detalle.codigo_Producto === undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el codigo del Producto', 'error', '#ff6849', 1500);
            return;
        }

        $scope.Objeto_Parametro_Detalle.id_Material = '0';
        $scope.Objeto_Parametro_Detalle.descripcion_Producto = '';
        $scope.Objeto_Parametro_Detalle.id_UnidadMedida_Ingreso = '0';
        $scope.Objeto_Parametro_Detalle.descripcion_unidadMedida = '';
        $scope.Objeto_Parametro_Detalle.cantidad_TranferenciaDet = '';

        $scope.Objeto_Parametro_Detalle.nroLote = '';
        $scope.Objeto_Parametro_Detalle.fechaProduccion = '';
        $scope.Objeto_Parametro_Detalle.fechaVencimiento = '';
        $scope.Objeto_Parametro_Detalle.stock = '0';
        $scope.Objeto_Parametro_Detalle.factorMultiplicacion_Trans = '0';
        
         
        $scope.loaderSave = true;
        transferenciasNewServices.get_buscarProducto_codigo($scope.Objeto_Parametro.origen_id_Local, $scope.Objeto_Parametro.origen_id_Almacen, $scope.Objeto_Parametro_Detalle.codigo_Producto, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loaderSave = false;

                if (res.ok == true) {
                    if (res.data.length > 0) {

                        if (res.data.length == 1) {
                            $scope.Objeto_Parametro_Detalle.id_Material = res.data[0].id_Producto;
                            $scope.Objeto_Parametro_Detalle.descripcion_Producto = res.data[0].descripcion_Producto;
                            $scope.Objeto_Parametro_Detalle.id_UnidadMedida_Ingreso = res.data[0].id_unidadMedida;
                            $scope.Objeto_Parametro_Detalle.descripcion_unidadMedida = res.data[0].descripcion_unidadMedida;

                            $scope.Objeto_Parametro_Detalle.nroLote = res.data[0].nro_lote;
                            $scope.Objeto_Parametro_Detalle.fechaProduccion = res.data[0].fecha_Produccion;
                            $scope.Objeto_Parametro_Detalle.fechaVencimiento = res.data[0].fecha_Vencimiento;
                            $scope.Objeto_Parametro_Detalle.stock = res.data[0].stock;
                            $scope.Objeto_Parametro_Detalle.factorMultiplicacion_Trans = res.data[0].factorMultiplicacion_Trans;

                            $timeout(function () {
                                $('#txtCantDet').focus().select();
                            }, 0);
                        } else {

                            var regionDetalle_Producto = document.getElementById('regionDetalle_Producto');
                            $('#txt_busquedaProducto').val($scope.Objeto_Parametro_Detalle.codigo_Producto);

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
            Id_AlmTranDet: '0',
            Id_AlmTranCab: $scope.id_TranferenciaCab_Global,
            id_Material: '0',
            codigo_Producto: '',
            descripcion_Producto: '',
            descripcion_unidadMedida: '',
            item_TranferenciaDet: '1',
            cantidad_TranferenciaDet: '',
            estado: '1',
            usuario_creacion: $scope.id_usuario_Global,
            nroLote: '',
            id_UnidadMedida_Ingreso: '0',
            fechaProduccion: null,
            fechaVencimiento: null,
            stock: '0',
            factorMultiplicacion_Trans : 0
        }
    }

    $scope.nuevoDet = function () {
        $scope.Flag_modoEdicion_Det = false;
        $scope.disabledEdicion = "";
        $scope.id_TranferenciaDet_Global = 0;
        $scope.limpiarDetalle();
    }

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

        if ($scope.Objeto_Parametro.origen_id_Local == '0' || $scope.Objeto_Parametro.origen_id_Local == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Local de Origen', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro.origen_id_Almacen == '0' || $scope.Objeto_Parametro.origen_id_Almacen == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Almacén de  Origen', 'error', '#ff6849', 1500);
            return false;
        }

        const filtroProducto = document.getElementById('txt_busquedaProducto').value;
        let regionDetalle_Producto = document.getElementById('regionDetalle_Producto');


        $scope.loader_modal_ayuda = true;
        transferenciasNewServices.get_buscarProducto_todos($scope.Objeto_Parametro.origen_id_Local, $scope.Objeto_Parametro.origen_id_Almacen, filtroProducto , $scope.id_usuario_Global )
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

        if (isNaN(stock)) {
            auxiliarServices.NotificationMessage('Sistemas', 'El valor del Stock no es un Número', 'error', '#ff6849', 3000);
        }

        if (stock <= 0 ) {
            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos no hay Stock disponible..', 'error', '#ff6849', 3000);
        }
 
        $scope.Objeto_Parametro_Detalle.id_Material = id_Producto;
        $scope.Objeto_Parametro_Detalle.codigo_Producto =  codigo_Producto;
        
        $scope.Objeto_Parametro_Detalle.descripcion_Producto = descripcion_Producto;
        $scope.Objeto_Parametro_Detalle.id_UnidadMedida_Ingreso = id_unidadMedida;
        $scope.Objeto_Parametro_Detalle.descripcion_unidadMedida =  descripcion_unidadMedida;

        $scope.Objeto_Parametro_Detalle.nroLote = nro_lote;
        $scope.Objeto_Parametro_Detalle.fechaProduccion =  fecha_Produccion;
        $scope.Objeto_Parametro_Detalle.fechaVencimiento = fecha_Vencimiento;
        $scope.Objeto_Parametro_Detalle.stock = stock;
        $scope.Objeto_Parametro_Detalle.factorMultiplicacion_Trans = factorMultiplicacion_Trans;

        $('#modalAyuda_Producto').modal('hide');
        $timeout(function () {
            $('#txtCantDet').focus().select();
        }, 500); 


    };

    $scope.guardarTransferencia_Det = function () {

        if ($scope.id_TranferenciaCab_Global == '0' || $scope.id_TranferenciaCab_Global == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Primero la cabecera de la Transferencia', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.codigo_Producto == '' || $scope.Objeto_Parametro_Detalle.codigo_Producto == null || $scope.Objeto_Parametro_Detalle.codigo_Producto == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor busque el Producto, por medio del código', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.id_Material == '0' || $scope.Objeto_Parametro_Detalle.id_Material == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione Enter o el boton buscar para buscar el producto ', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.descripcion_Producto == '' || $scope.Objeto_Parametro_Detalle.descripcion_Producto == null || $scope.Objeto_Parametro_Detalle.descripcion_Producto == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione Enter o el boton buscar para buscar el producto', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Flag_modoEdicion_Det == false) {
            if ($scope.producto_Ya_agregrado($scope.Objeto_Parametro_Detalle.id_Material, $scope.Objeto_Parametro_Detalle.id_UnidadMedida_Ingreso, $scope.Objeto_Parametro_Detalle.nroLote, $scope.Objeto_Parametro_Detalle.fechaProduccion )) {
                auxiliarServices.NotificationMessage('Sistemas', 'El producto ya se encuentra agregado, verifique..', 'error', '#ff6849', 1500);
                return false;
            }
        }

        if ($scope.Objeto_Parametro_Detalle.cantidad_TranferenciaDet == '0' || $scope.Objeto_Parametro_Detalle.cantidad_TranferenciaDet == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese una Cantidad ', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_Detalle.cantidad_TranferenciaDet  < 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese una Cantidad Positiva', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.stock == 0 || $scope.Objeto_Parametro_Detalle.stock == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos no hay Stock disponible..', 'error', '#ff6849', 3000);
            return false;
        }

        if ($scope.Objeto_Parametro_Detalle.stock < $scope.Objeto_Parametro_Detalle.cantidad_TranferenciaDet ) {
            auxiliarServices.NotificationMessage('Sistemas', 'La cantidad Supera el Stock, verifique.', 'error', '#ff6849', 3000);
            return false;
        }

        $scope.Objeto_Parametro_Detalle.Id_AlmTranCab = $scope.id_TranferenciaCab_Global;

        const fechaProduccion = $scope.Objeto_Parametro_Detalle.fechaProduccion;
        const fechaVencimiento = $scope.Objeto_Parametro_Detalle.fechaVencimiento;

        $scope.Objeto_Parametro_Detalle.fechaProduccion = (fechaProduccion == null) ? null :  auxiliarServices.changeFormatDate(2, fechaProduccion);
        $scope.Objeto_Parametro_Detalle.fechaVencimiento = (fechaVencimiento == null) ? null :   auxiliarServices.changeFormatDate(2, fechaVencimiento);



        if ($scope.Flag_modoEdicion_Det == false) { // nuevo registroo
            $scope.loaderSave = true;
            transferenciasNewServices.save_transferenciasDet($scope.Objeto_Parametro_Detalle )
                .then(function (res) {
                    console.log(res)
                    $scope.loaderSave = false;

                    $scope.Objeto_Parametro_Detalle.fechaProduccion = fechaProduccion;
                    $scope.Objeto_Parametro_Detalle.fechaVencimiento = fechaVencimiento;

                    if (res.ok == true) {
                        $scope.nuevoDet();
                        $scope.listandoTransferenciasDet();

                        $timeout(function () { 
                            if ($scope.listTransferencias_Det.length > 0) {
                                $scope.disabledCab = "disabledContent";
                            } else {
                                $scope.disabledCab = "";
                            }        
                        }, 500);

                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }
                }, function (error) {

                    $scope.Objeto_Parametro_Detalle.fechaProduccion = fechaProduccion;
                    $scope.Objeto_Parametro_Detalle.fechaVencimiento = fechaVencimiento;
                    $scope.loaderSave = false;
                    alert(JSON.stringify(error));
                })

        } else {  //actualizar

            $scope.loaderSave = true;
            transferenciasNewServices.update_transferenciasDet($scope.Objeto_Parametro_Detalle)
                .then(function (res) {
                    console.log(res);
                    $scope.Objeto_Parametro_Detalle.fechaProduccion = fechaProduccion;
                    $scope.Objeto_Parametro_Detalle.fechaVencimiento = fechaVencimiento;

                    $scope.loaderSave = false;
                    if (res.ok == true) {
                        $scope.nuevoDet();
                        $scope.listandoTransferenciasDet();
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }

                }, function (error) {
                    $scope.Objeto_Parametro_Detalle.fechaProduccion = fechaProduccion;
                    $scope.Objeto_Parametro_Detalle.fechaVencimiento = fechaVencimiento;
                    $scope.loaderSave = false;
                    alert(JSON.stringify(error));
                })

        }
    }

    $scope.producto_Ya_agregrado = function (idProducto, idUnidad, nroLote,fechaProduccion) {
        const producto = $scope.listTransferencias_Det.find((prod) => prod.id_Producto == idProducto && prod.id_unidadMedida == idUnidad && prod.nro_lote == nroLote && prod.fecha_Produccion == fechaProduccion );
        return (producto) ? true : false;
    }
     
    $scope.listTransferencias_Det = [];
    $scope.listandoTransferenciasDet = function () {

        $scope.loaderSave = true;
        $scope.listTransferencias_Det = [];
        transferenciasNewServices.get_transferenciasDetalle($scope.id_TranferenciaCab_Global)
            .then(function (res) {
                $scope.loaderSave = false;
                if (res.ok == true) {
                    $scope.listTransferencias_Det = [];
                    $scope.listTransferencias_Det = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderSave = false;
                console.log(error)
            })
    }

    $scope.editarTransferencia = function ({ Id_AlmTranDet, id_Producto, codigo_Producto, descripcion_Producto, cantidad_TranferenciaDet, id_unidadMedida, descripcion_unidadMedida, nro_lote, fecha_Produccion, fecha_Vencimiento, stock, factorMultiplicacion_Trans }) {

        $scope.Flag_modoEdicion_Det = true;
        $scope.disabledEdicion = "disabledContent";

        $scope.Objeto_Parametro_Detalle.Id_AlmTranDet = Id_AlmTranDet;
        $scope.Objeto_Parametro_Detalle.id_Material = id_Producto;
        $scope.Objeto_Parametro_Detalle.codigo_Producto = codigo_Producto;

        $scope.Objeto_Parametro_Detalle.descripcion_Producto = descripcion_Producto  ;
        $scope.Objeto_Parametro_Detalle.id_UnidadMedida_Ingreso =  id_unidadMedida;
        $scope.Objeto_Parametro_Detalle.descripcion_unidadMedida = descripcion_unidadMedida;

        $scope.Objeto_Parametro_Detalle.cantidad_TranferenciaDet = cantidad_TranferenciaDet;

        $scope.Objeto_Parametro_Detalle.nroLote =  nro_lote;
        $scope.Objeto_Parametro_Detalle.fechaProduccion = fecha_Produccion;
        $scope.Objeto_Parametro_Detalle.fechaVencimiento =  fecha_Vencimiento;
        $scope.Objeto_Parametro_Detalle.stock = cantidad_TranferenciaDet;
        $scope.Objeto_Parametro_Detalle.factorMultiplicacion_Trans = factorMultiplicacion_Trans;

        $scope.loaderSave = true;
        transferenciasNewServices.get_buscarProducto_edicion($scope.Objeto_Parametro.origen_id_Local, $scope.Objeto_Parametro.origen_id_Almacen, $scope.Objeto_Parametro_Detalle.id_Material, $scope.Objeto_Parametro_Detalle.id_UnidadMedida_Ingreso, $scope.Objeto_Parametro_Detalle.nroLote, $scope.id_usuario_Global, $scope.Objeto_Parametro_Detalle.fechaProduccion)
            .then(function (res) {
                $scope.loaderSave = false;

                if (res.ok == true) {
                    if (res.data.length > 0) {

                        let stockBD = (res.data[0].stock + cantidad_TranferenciaDet);
                        $scope.Objeto_Parametro_Detalle.stock = stockBD;

                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'No se encontro resultado con el codigo del Producto ingresado, verifique.', 'error', '#ff6849', 3000);
                    }

                    $timeout(function () {
                        $('#txtCantDet').focus().select();
                    }, 0);

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderSave = false;
                console.log(err);
            });




    }

    $scope.eliminarTransferencia = function (item) {

        if (item.estado == 26 || item.estado == '26') {
            return;
        }
        var params = {
            title: "Desea continuar ?",
            text: 'Esta por eliminar el registro',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                $scope.loaderFiltro = true;
                transferenciasNewServices.set_eliminarTransferenciaDet(item.Id_AlmTranDet)
                    .then(function (res) {
                        $scope.loaderFiltro = false;
                        if (res.ok == true) {
                            var index = $scope.listTransferencias_Det.indexOf(item);
                            if (index !== -1) {
                                $scope.listTransferencias_Det.splice(index, 1);

                                $timeout(function () {
                                    if ($scope.listTransferencias_Det.length > 0) {
                                        $scope.disabledCab = "disabledContent";
                                    } else {
                                        $scope.disabledCab = "";
                                    }
                                }, 500);

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
        $scope.id_TranferenciaCab_Global = obj.Id_AlmTranCab;

        $('#modalMantenimiento').modal('show');

        $scope.Objeto_Parametro = {
            Id_AlmTranCab: obj.Id_AlmTranCab,
            id_Alm_TipoSolicitud: '1',
            nro_Transferencia: obj.nro_transaccion,
            fechaEmision_TranferenciaCab: obj.fechaEmision_TranferenciaCab,
            id_TipoTransaccion: '1',
            origen_id_Local: obj.origen_id_Local ,
            origen_id_Almacen: obj.origen_id_Almacen,
            destino_id_Local: obj.destino_id_Local,
            destino_id_Almacen: obj.destino_id_Almacen,
            obs_TranferenciaCab: obj.obs_TranferenciaCab,
            estado: obj.estado,
            usuario_creacion: $scope.id_usuario_Global,
        }

        $timeout(function () {
            $('#cboLocal').val(String(obj.origen_id_Local)).trigger('change.select2');
            $('#cboLocalDestino').val(String(obj.destino_id_Local)).trigger('change.select2');
            $('#txtFechaEmision').datepicker('setDate', obj.fechaEmision_TranferenciaCab);

        }, 0);

        $scope.change_almacenLocal('ORIGEN', String(obj.origen_id_Local), String(obj.origen_id_Almacen));
        $scope.change_almacenLocal('DESTINO', String(obj.destino_id_Local), String(obj.destino_id_Almacen))

        $scope.nuevoDet();
        $scope.listandoTransferenciasDet();

        $timeout(function () { 
            if (obj.estado == '24') {
                $scope.disabledForm = "";
                if ($scope.listTransferencias_Det.length > 0) {
                    $scope.disabledCab = "disabledContent";
                } else {
                    $scope.disabledCab = "";
                }
                $scope.disabledProd = "";
            } else {
                $scope.disabledForm = "disabledContent";
            }
        }, 500);

    }

    $scope.cerrarTransferencias = function () {
        if ($scope.Objeto_Parametro.origen_id_Local != $scope.Objeto_Parametro.destino_id_Local) {

            $scope.clean();
            $('#modalAprobar').modal('show');

        } else {

            var params = {
                title: "Desea continuar ?",
                text: 'Esta por Cerrar la Transferencia',
                type: 'confirmationAlert',
            }
            auxiliarServices.initSweetAlert(params).then(function (res) {
                if (res == true) {
                    $scope.loaderSave = true;
                    transferenciasNewServices.set_cerrarTransferencia($scope.id_TranferenciaCab_Global, $scope.id_usuario_Global  )
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
    }


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
            $scope.Listando_Proveedor();
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

                    IngresoTransferenciasServices.get_generar_Guia_transferencia( $scope.id_TranferenciaCab_Global, $scope.id_usuario_Global, $scope.objeto_parametros)
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


});