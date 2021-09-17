var app = angular.module('appGestion.TransferenciasController', []);

app.controller('CtrlTransferencias', function ($scope, loginServices, LocalesServices, IngresoTransferenciasServices, AlmacenServices, $location, $timeout, auxiliarServices, EstadosServices) {

 
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

       
        // FUNCIÓN PARA CAMBIAR DE TITULO AL PAGE PRINCIPAL
        auxiliarServices.changeTitle("Listado de Transferencias");
        // INICIALIZAMOS EL SELECT BUSCADOR

        //$('#ModalProducto').modal('show');
        $scope.titleModal = "Registro de Productos";
        // INICIALIZAMOS LISTA DE LOS SELECT LOCALES Y ALMACENES

        $scope.disabledContent = "";

        $timeout(function () {
            $(".selectFiltros").select2();
        },0);
 


        $('.datepicker').datepicker({
            autoclose: true,
            todayHighlight: true,
            format: 'dd/mm/yyyy'
        });


        let objParamsFormulario;
        if (localStorage.getItem('ParamsFormularioTransferencia')) {
            objParamsFormulario = JSON.parse(localStorage.getItem("ParamsFormularioTransferencia"));
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
                    $scope.getTransferencias();
                }, 500);

            }, 0);

        } else {
            $scope.getLocales();
            $scope.getEstado();
        } 


    };


    $scope.refrescandoFormulario = function (idLocal, idAlmacen, idEstado) {
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
                                    const tipoEstado = 'T';
                                    EstadosServices.getEstadosByTipo(tipoEstado)
                                        .then(function (res) {
                                            $scope.listEstados = res;
                                            setTimeout(function () {
                                                $('#filterEstado').val(String(idEstado)).trigger('change.select2');

                                                //----- listando toda la informacion ----
                                                $scope.getTransferencias();
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




    $scope.getEstado = function () {
        var tipo = "T"; // TIPO TRANSFERENCIAS
        EstadosServices.getEstadosByTipo(tipo).then(function (res) {
 
            $scope.listEstado = res;
            setTimeout(function () {
                $('#selectEstado').val(String('0')).trigger('change.select2');
            }, 0);
        }, function (err) {
            console.log(err);
        });
    };

    $scope.objFilter = {
        idLocal: "0",
        idAlmacen: "0",
        idEstado: "0",
        fechaini: auxiliarServices.getDateNow(),
        fechafin: auxiliarServices.getDateNow()
    };
    var oTable;
    $scope.getTransferencias = function () {
        
        let objParamsFormulario = {
            idLocal: $scope.objFilter.idLocal,
            idAlmacen: $scope.objFilter.idAlmacen,
            idEstado: $scope.objFilter.idEstado,
            fechaini: $scope.objFilter.fechaini,
            fechafin: $scope.objFilter.fechafin,
            busqueda: $scope.objFilter.busqueda,
        }

        localStorage.setItem('ParamsFormularioTransferencia', JSON.stringify(objParamsFormulario));


        $scope.loaderProd = true;
        var p = $scope.objFilter;
        var filter = p.idLocal + '|' + p.idAlmacen + '|' + p.idEstado + '|' + auxiliarServices.changeFormatDate(2, p.fechaini) + '|' + auxiliarServices.changeFormatDate(2, p.fechafin);

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

                });
                $scope.listTransferencias = res;

                console.log(res)

                $timeout(function () {
                    $scope.loaderProd = false;
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
 

    $scope.listLocales = [];
    $scope.getLocales = function () {
        $scope.loaderfiltros = true;
        LocalesServices.get_Locales_Usuario(auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.listLocales = [];
                $scope.listLocales = data;
                setTimeout(function () { 
                    $('#selectLocales').val("0").trigger('change.select2'); 
                }, 0);

            }, function (err) {
                console.log(err);
            });
    };


    $scope.changeSelect = function (select, idSelect) {
        if (select === "locales") {
            AlmacenServices.getAlmacenesLocal(idSelect)
                .then(function (res) {
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

        { nombre: 'Nueva Transferencia', icon: 'ti-file text-purple', eventClick: 1 }
        // { nombre: 'Modificar Folio Sigetrama', icon: 'ti-cloud-up text-danger', eventClick: '4' },
        // { nombre: 'Exportar', icon: 'ti-search text-purple', eventClick: '5' },

    ];

    $scope.fucntionClickOptions = function (value, item) {

        var params;
        if (value === 1 || value === '1') {
           $location.path('/IngresoTransferencias');
            params = {
                option: 'save',
                value: value,
                idLocal: $scope.objFilter.idLocal,
                idAlmacen: $scope.objFilter.idAlmacen,
                objCab: ''
            };
            auxiliarServices.paramsTransferencias('save', params);
        } else if (value === 2 || value === '2') {
            $location.path('/IngresoTransferencias');
            params = {
                option: 'update',
                value: value,
                idLocal: $scope.objFilter.idLocal,
                idAlmacen: $scope.objFilter.idAlmacen,
                objCab: item
            };
            auxiliarServices.paramsTransferencias('save', params);
        }

    };

    $('#ModalProducto').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#codigointerno').focus();
        }, 500);

    });



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
            doc.line(560,  alt, 48, alt );
            alt += 10;
        }
         
        doc.setLineWidth(1);
        doc.setFontType("bold");
        sum = sum.toFixed(2);
        doc.text(480, alt + 4, 'TOTAL :');
        doc.writeText(530, alt + 4, sum , { align: 'right', width: 25 });
        
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



});