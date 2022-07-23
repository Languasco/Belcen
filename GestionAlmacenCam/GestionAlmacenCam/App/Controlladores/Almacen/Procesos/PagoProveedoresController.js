var app = angular.module('appGestion.PagoProveedoresController', [])

app.controller('PagoProveedoresController', function ($scope, $location, GrupoDetServices,  $timeout, auxiliarServices, ReimpresionServices, ProveedorServices,PagoProveedoresServices) {
    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;
 
        auxiliarServices.changeTitle("Registro de Pagos a Proveedores");
        $scope.titleModal = "Registro de Pagos a Proveedores";
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
    $scope.Flag_modoEdicion = false;
        
    $scope.disabledEncabezado = "disabledContent";
    $scope.disabledProd = "disabledContent";
    $scope.disabledForm = "disabledContent";
 
    $scope.Flag_modoEdicion_Det = false;

    $scope.listadetalle_documentos = []
    $scope.listBusqueda = [];
           
    $scope.Objeto_Parametro_Filtro = {
        id_Proveedor: '',
        nroDocumento_Proveedor: '',
        razonSocial_Proveedor: '.....',
        tipoReporte:'0',
        id_tipoDoc: '0',
        nro_documento : ''
    };
    
 
    $scope.lista_documentos = [];
    $scope.listandoDocumentos = function () {
        $scope.loaderFiltro = true;
        ReimpresionServices.get_tipoDocumentos().then(function (res) {
            $scope.loaderFiltro = false;
            if (res.ok == true) {
                $scope.lista_documentos = [];
                $scope.lista_documentos = res.data.filter((d) => (d.id == 1 || d.id == 2))

                $timeout(function () {
                    $('#cboTipoDoc').val('0').trigger('change.select2');
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
    $scope.listandoDocumentos();


    document.querySelector("#buscar").onkeyup = function () {
        $TableFilter("#tbl_detalle", this.value);
    }

    $TableFilter = function (id, value) {
        var rows = document.querySelectorAll(id + ' tbody tr');

        for (var i = 0; i < rows.length; i++) {
            var showRow = false;

            var row = rows[i];
            row.style.display = 'none';

            for (var x = 0; x < row.childElementCount; x++) {
                if (row.children[x].textContent.toLowerCase().indexOf(value.toLowerCase().trim()) > -1) {
                    showRow = true;
                    break;
                }
            }

            if (showRow) {
                row.style.display = null;
            }
        }
    }


    $scope.checkedAll = false;

    $scope.listadetalle_documentos = []
    $scope.actualizar_informacion = function () {

        if ($scope.Objeto_Parametro_Filtro.id_Proveedor == 0 || $scope.Objeto_Parametro_Filtro.id_Proveedor == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor busque el Proveedor..', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.Objeto_Parametro_Filtro.nroDocumento_Proveedor == undefined || $scope.Objeto_Parametro_Filtro.nroDocumento_Proveedor == null || $scope.Objeto_Parametro_Filtro.nroDocumento_Proveedor == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor busque el Proveedor..', 'error', '#ff6849', 1500);
            return;
        }
  
        document.getElementById("form_detalle").style.display = "none";
        $scope.loaderFiltro = true;
        $scope.checkedAll = false;

        PagoProveedoresServices.get_mostrandoInformacion($scope.Objeto_Parametro_Filtro)
            .then(function (res) {         
                if (res.data.length > 0) {
                    $('#btn_cancelar').attr("disabled", false);
                } else {
                    document.getElementById("form_detalle").style.display = "none";
                }

                $scope.listadetalle_documentos = [];
                $scope.listadetalle_documentos = res.data;

                $scope.calculo_totalGeneral();

                $timeout(function () {
                    $scope.loaderFiltro = false;
                    $("#tbl_detalle").tableHeadFixer({ "left": 6 });
                    document.getElementById("form_detalle").style.display = "";
                }, 1000);            


            }, function (err) {
                $scope.loaderFiltro = false;
                $('#btn_cancelar').attr("disabled", true);
            })
    }


    $scope.Lista_Bancos = [];
    $scope.Listando_Bancos = function () {
        $scope.loaderfiltros = true;
        GrupoDetServices.getGrupoTabla_Det(6)
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Bancos = [];
                $scope.Lista_Bancos = data;
                setTimeout(function () {
                    $('#cbo_banco').val("0").trigger('change.select2');
                }, 300);

            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };
    $scope.Listando_Bancos();

    $scope.marcarTodos = function (checked) {
        if (checked) {
            angular.forEach($scope.listadetalle_documentos, function (child) {
                child.checkeado = true;
            })
        } else {
            angular.forEach($scope.listadetalle_documentos, function (child) {
                child.checkeado = false;
            })
        }
    }


    $scope.getProveedorByDoc = function () {

        $scope.loaderFiltro = true;
        var params = {
            filter: $scope.Objeto_Parametro_Filtro.nroDocumento_Proveedor
        }
        ProveedorServices.getProveedor(params).then(function (res) {
            $timeout(function () {
                $scope.loaderFiltro = false;
                if (res.length == 0) {
                    $scope.Objeto_Parametro_Filtro.razonSocial_Proveedor = "";
                    $scope.Objeto_Parametro_Filtro.id_Proveedor = 0;
                    auxiliarServices.NotificationMessage('Sistemas', 'No se encontro el Proveedor', 'error', '#ff6849', 1500);
                    return false;
                } else {
                    $scope.Objeto_Parametro_Filtro.razonSocial_Proveedor = res[0].razonSocial_Proveedor;
                    $scope.Objeto_Parametro_Filtro.id_Proveedor = res[0].id_Proveedor;
                }
            }, 0)
        }, function (err) {
            $scope.loaderFiltro = true;
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


    }

    $scope.selectId = function (item) {
        console.log(item)
        // PROVEEDORES
        $('#ModalSearch').modal('hide');
        $scope.Objeto_Parametro_Filtro.razonSocial_Proveedor = item.descripcion;
        $scope.Objeto_Parametro_Filtro.nroDocumento_Proveedor = item.codigo;
        $scope.Objeto_Parametro_Filtro.id_Proveedor = item.id_select;
    }


    $scope.imgProducto = "../content/img/sinImagen.jpg";
    $scope.files = [];
    $scope.objetoPago_Global = {};

    $scope.changeImagen = function (event) {
        var filesTemporal = event.target.files; //FileList object       
        var fileE = [];
        for (var i = 0; i < event.target.files.length; i++) { //for multiple files          
            fileE.push({
                'file': filesTemporal[i]
            })

        }
        $scope.files = fileE;

        $timeout(function () {
            $scope.showFileName = false;
        }, 0);
    };



    $scope.objeto_parametros_pagos = {
        id_GuiaCab: '0',
        id_formaPago: '0',
        id_banco: '0',
        fechaOperacion: auxiliarServices.getDateNow(),
        nroOperacion: '',
        nameFile: '',
        monto_Pago: '0'
    };

    $scope.tituloModalPago = '';
    $scope.docSeleccionado = '';


    $scope.clean_Pagos = function () {
        $scope.objeto_parametros_pagos.id_GuiaCab = '0';
        $scope.objeto_parametros_pagos.id_formaPago = '0';
        $scope.objeto_parametros_pagos.id_banco = '0';
        $scope.objeto_parametros_pagos.fechaOperacion = auxiliarServices.getDateNow();
        $scope.objeto_parametros_pagos.nroOperacion = '';
        $scope.objeto_parametros_pagos.monto_Pago = '0';        

        var rb_efectivo = document.getElementById('rb_efectivo');

        $timeout(function () {
            $('#cbo_banco').val("0").trigger('change.select2');
            $('#dtp_FechaOper').datepicker('setDate', new Date());

            rb_efectivo.checked = true;
            $scope.disabledDeposito = false;
        }, 0);

        //---- adjuntar pagos -----
        $scope.files = [];
        $scope.imgProducto = "../content/img/sinImagen.jpg";
        $("#inputFileOpen").val('');
    };

    $scope.titleFile = 'Adjuntar Documento';

    $scope.change_habilitarDeposito = function (opcion) {

        var rb_efectivo = document.getElementById('rb_efectivo');
        var rb_deposito = document.getElementById('rb_deposito');

        if (rb_efectivo.checked === true) {
            $scope.disabledDeposito = false;
        }
        if (rb_deposito.checked === true) {
            $scope.disabledDeposito = true;
        } 
    };


    $scope.tipoPago_Global = '';
    $scope.AbrirModal_Pagos = function (opcion, obj_data) {


        $scope.tipoPago_Global = opcion;


        if (opcion == 'I') { //---- individual
            if (obj_data.saldoPendienteEditado == '' || obj_data.saldoPendienteEditado == '0') {
                auxiliarServices.NotificationMessage('Sistemas', 'Tiene que ingresar el Saldo para poder Pagar, verifique..', 'error', '#ff6849', 1500);
                return;
            }
            if (parseFloat(obj_data.saldoPendienteEditado) <= 0) {
                auxiliarServices.NotificationMessage('Sistemas', 'El Saldo a Pagar tiene que ser un valor positivo, verifique..', 'error', '#ff6849', 1500);
                return;
            }

            if (parseFloat(obj_data.saldoPendienteEditado) > parseFloat(obj_data.saldoPendiente)) {
                auxiliarServices.NotificationMessage('Sistemas', 'El Saldo a Pagar no puede ser mayor a : ' + parseFloat(obj_data.saldoPendiente), 'error', '#ff6849', 1500);
                return;
            }       

            $scope.objetoPago_Global = obj_data;

            $scope.docSeleccionado = '(*)  Pago de la ' + obj_data.tipoDoc + ' : ' + obj_data.numero;
            $scope.tituloModalPago = 'REGISTRO DE PAGO';
        }

        if (opcion == 'M') { //---- masivo

            const docMasiv = $scope.listadetalle_documentos.filter((doc) => doc.checkeado == true);

            $scope.docSeleccionado =  (docMasiv.length) +' Documentos Seleccionados';
            $scope.tituloModalPago = 'REGISTRO DE PAGO MASIVO';

            var flag_marco = false;

            flag_marco = MarcoCheck();
            if (flag_marco == false) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione al menos un registro', 'error', '#ff6849', 1500);
                return;
            }


            for (obj_datos of $scope.listadetalle_documentos) {
                if (obj_datos.checkeado == true) {

                    if (obj_datos.saldoPendienteEditado == 0 || obj_datos.saldoPendienteEditado == '0' || obj_datos.saldoPendienteEditado == null || obj_datos.saldoPendienteEditado == '') {
                        auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Importe a pagar, verifique ' + obj_datos.tipoDoc + ' : ' + obj_datos.numero , 'error', '#ff6849', 3000);
                        return;
                    } else {
                        if (parseFloat(obj_datos.saldoPendienteEditado) < 0) {
                            auxiliarServices.NotificationMessage('Sistemas', 'El importe a Pagar debe de ser mayor a Cero {0}, verifique ' + obj_datos.tipoDoc + ' : ' + obj_datos.numero , 'error', '#ff6849', 3000);
                            return;
                        }
                    }

                    if (parseFloat(obj_datos.saldoPendienteEditado) > parseFloat(obj_datos.saldoPendiente)) {
                        auxiliarServices.NotificationMessage('Sistemas', 'El Saldo a Pagar no puede ser mayor a : ' + parseFloat(obj_datos.saldoPendiente) + ' verifique ' + obj_datos.tipoDoc + ' : ' + obj_datos.numero, 'error', '#ff6849', 3000);
                        return;
                    }
                }
            }
        }

        $scope.clean_Pagos();
        $timeout(function () {
            $('#modalPagos').modal('show');
        }, 0);
    }

    function MarcoCheck() {
        var flag_marco = false;
        for (obj_datos of $scope.listadetalle_documentos) {
            if (obj_datos.checkeado == true) {
                flag_marco = true;
                break;
            }
        }
        return flag_marco;
    }

    $scope.GuardarDeposito = async function () {
 
        var rb_efectivo = document.getElementById('rb_efectivo');
        var rb_deposito = document.getElementById('rb_deposito');
        var flag_opcion = '';

        if (rb_efectivo.checked === true) {
            flag_opcion = 'E';
        }
        if (rb_deposito.checked === true) {
            flag_opcion = 'D';
        }

        if (flag_opcion == 'D') {
            if ($scope.objeto_parametros_pagos.id_banco === null || $scope.objeto_parametros_pagos.id_banco === 0 || $scope.objeto_parametros_pagos.id_banco === '0') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese seleccione el Banco', 'error', '#ff6849', 1500);
                return false;
            }
            if ($scope.objeto_parametros_pagos.fechaOperacion === null || $scope.objeto_parametros_pagos.fechaOperacion === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha de la Operacion', 'error', '#ff6849', 1500);
                return false;
            }
            if ($scope.objeto_parametros_pagos.nroOperacion === 0 || $scope.objeto_parametros_pagos.nroOperacion === '0' || $scope.objeto_parametros_pagos.nroOperacion === null || $scope.objeto_parametros_pagos.nroOperacion === '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nro de Operacion', 'error', '#ff6849', 1500);
                return false;
            }

            $scope.loaderfiltros = true;
            const { ok, data } = await PagoProveedoresServices.validar_nroOperacion($scope.objeto_parametros_pagos.id_banco, $scope.objeto_parametros_pagos.nroOperacion, $scope.objeto_parametros_pagos.fechaOperacion);
            $scope.loaderfiltros = false;
            $scope.$apply();

            if (ok) {
                if (data[0].cantRegistro > 0) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos ese numero de operacion ya se registro con anterioridad', 'error', '#ff6849', 1500);
                    return false;
                }
            } else {
                auxiliarServices.NotificationMessage('Sistemas', data, 'error', '#ff6849', 3000);
                return false;
            }

            if (Object.keys($scope.files).length === 0) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor tiene que adjuntar algun voucher o comprobante ..', 'error', '#ff6849', 3500);
                return false;
            }
            $scope.objeto_parametros_pagos.id_formaPago = '2'; //----deposito

        } else { /// EFECTIVO 
            $scope.objeto_parametros_pagos.id_formaPago = '1';//----efectivo
            $scope.objeto_parametros_pagos.id_banco = '0';
            $scope.objeto_parametros_pagos.fechaOperacion = '';
            $scope.objeto_parametros_pagos.nroOperacion = '';
        }

        if ($scope.tipoPago_Global == 'I') {  //--- INDIVIDUAL

            $scope.objeto_parametros_pagos.id_GuiaCab = $scope.objetoPago_Global.id_GuiaCab;
            $scope.objeto_parametros_pagos.monto_Pago = $scope.objetoPago_Global.saldoPendienteEditado;

            $scope.loaderModal = true;
            PagoProveedoresServices.guardar_pagoIndividual($scope.objeto_parametros_pagos, $scope.id_usuario_Global,0)
                .then(function (res) {
                    $scope.loaderModal = false;
                    if (res.ok == true) {
                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Pago realizado correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params).then(function (res) {
                            });
                        }, 100)

                        const idPago = res.data;
                        if ($scope.files.length > 0) {
                            $scope.upload_imageComprobantePagos(idPago,0);
                        }

                        $scope.actualizar_informacion();

                        $timeout(function () {
                            $('#modalPagos').modal('hide');
                        }, 0)

                    } else {
                        $scope.loaderModal = false;
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }
                }, function (error) {
                    $scope.loaderModal = false;
                    console.log(error)
                })
        }
        if ($scope.tipoPago_Global == 'M') {  //--- MASIVO

            let listPagos = [];
            listPagos = $scope.listadetalle_documentos.filter((doc) => doc.checkeado == true)
                .map((p) => {
                    return { 'id_GuiaCab': p.id_GuiaCab, 'monto_Pago': p.saldoPendienteEditado}
                });

            const cantRegPagar = listPagos.length;
            var idPagosRealizado = [];
             
            ejecutandoPagoMasivo = (index) => {
                if (cantRegPagar == index) {

                    $timeout(function () {
                        let params = {
                            type: 'alert', title: 'Excelente !', text: 'Pago Masivo realizado correctamente.. !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {
                        });
                    }, 100)

                    if ($scope.files.length > 0) {
                        if (idPagosRealizado.length > 0) {
                            $scope.upload_imageComprobantePagos(idPagosRealizado.join(),1 );
                        }
                    }

                    $scope.actualizar_informacion();

                    $timeout(function () {
                        $('#modalPagos').modal('hide');
                    }, 0)

                    return
                }
 
                //++++++ GENERAR PAGO MASIVO ++++++

                $scope.objeto_parametros_pagos.id_GuiaCab = listPagos[index].id_GuiaCab;
                $scope.objeto_parametros_pagos.monto_Pago = listPagos[index].monto_Pago;

                $scope.loaderModal = true;
                PagoProveedoresServices.guardar_pagoIndividual($scope.objeto_parametros_pagos, $scope.id_usuario_Global,1)
                    .then(function (res) {
                        $scope.loaderModal = false;
                        if (res.ok == true) {
                            idPagosRealizado.push(res.data);
                            ejecutandoPagoMasivo(index + 1);
                        } else {
                            $scope.loaderModal = false;
                            alert(res.data);
                            ejecutandoPagoMasivo(index + 1);
                        }
                    }, function (error) {
                        $scope.loaderModal = false;
                        console.log(error);
                        ejecutandoPagoMasivo(index + 1);
                    })

                //++++++ FIN DE GENERAR PAGO MASIVO  
            }

            ejecutandoPagoMasivo(0);
        }
    }

    $scope.upload_imageComprobantePagos = function (idPago, esMasivo) {

        console.log('enviando imgagen')
        $scope.loader = true;
        PagoProveedoresServices.uploadFile_imageComprobantePagos($scope.files[0].file, idPago, $scope.id_usuario_Global, esMasivo )
            .then(function (res) {

                $scope.loader = false;
                if (res.ok == false) {
                    auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error almacenando la imagen.', 'error', '#ff6849', 2500);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loader = false;
                alert(error)
            });
    };


    $scope.totalPagar = 0;
    $scope.totalPendiente = 0;

    $scope.calculo_totalGeneral = function () { 
        let totalPago = 0;
        let totalPendiente = 0;

        for (obj of $scope.listadetalle_documentos) { 
            totalPago += Number(obj.totalPagar);
            totalPendiente += Number(obj.saldoPendienteEditado);
        }

        $scope.totalPagar = parseFloat(totalPago).toFixed(2);
        $scope.totalPendiente = parseFloat(totalPendiente).toFixed(2); 
    }



    $scope.Calculo_Saldo = function (obj_datos, id_enfoque) {

        if (isNaN(obj_datos.saldoPendienteEditado) == true) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese un Valor correcto, verifique', 'error', '#ff6849', 1500);
        } else {
            if (obj_datos.saldoPendienteEditado == 0 || obj_datos.saldoPendienteEditado == '0' || obj_datos.saldoPendienteEditado == null || obj_datos.saldoPendienteEditado == '') {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Importe a pagar no puede ser Cero {0} , verifique ', 'error', '#ff6849', 3000);
                return;
            } else {
                if (obj_datos.saldoPendienteEditado < 0) {
                    auxiliarServices.NotificationMessage('Sistemas', 'El importe a Pagar debe de ser mayor a Cero {0} ', 'error', '#ff6849', 3000);
                    return;
                }
            }
        }
        if (parseFloat(obj_datos.saldoPendienteEditado) > parseFloat(obj_datos.saldoPendiente)) {
            auxiliarServices.NotificationMessage('Sistemas', 'El Saldo a Pagar no puede ser mayor a : ' + parseFloat(obj_datos.saldoPendiente) + '  verifique..' ,'error', '#ff6849', 3000);
            return;
        }

        $scope.calculo_totalGeneral();
    };


    $scope.changeFocusInput = function (id) {
        var doc = document.getElementById(id);
        $timeout(function () {
            doc.focus();
        }, 100);
    }

    $scope.check_marca = function (id, option) {
        var doc = document.getElementById(id);
        $timeout(function () {
            doc.checked = option;
        }, 100);
    }

    $scope.KeyDown_saldo = function (keyEvent, obj_datos, id_enfoque) {
        if (keyEvent.which == 13) {
            if (obj_datos.saldoPendienteEditado == undefined || obj_datos.saldoPendienteEditado == '' || obj_datos.saldoPendienteEditado == '0' || obj_datos.saldoPendienteEditado == '0') {
                obj_datos.checkeado = false;
                //$scope.check_marca('chk_' + parseInt(id_enfoque), false)
                $scope.changeFocusInput('id_' + (parseInt(id_enfoque) + 1))
            } else {
                obj_datos.checkeado = true;
                //$scope.check_marca('chk_' + parseInt(id_enfoque), true)
                $scope.changeFocusInput('id_' + (parseInt(id_enfoque) + 1))
            }
            $scope.calculo_totalGeneral();
        }
    }

    $scope.detallePagos = [];
    $scope.AbrirModal_DetallePagos = function (obj_data) {

        $scope.objetoPago_Global = obj_data;

        $scope.loaderModal = true;
        PagoProveedoresServices.get_detallePagos(obj_data.id_GuiaCab).then(function (res) {
            $scope.loaderModal = false;
            if (res.ok == true) {
                $scope.detallePagos = res.data;

                $timeout(function () {
                    $('#modalDetallePagos').modal('show');
                }, 0);


            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
        }, function (err) {
            $scope.loaderModal = false;
            console.log(err);
        });


    }


    $scope.descargar_voucher = function (obj) {
        const id_link = document.getElementById('id_link');
        setTimeout(function () {
            id_link.href = obj.urlArchivoPago;
            id_link.click();
        }, 0);
    }
 


         
})
