var app = angular.module('appGestion.ProveedorController', [])

app.controller('CtrlProveedor', function ($scope, GrupoDetServices, $location, $timeout, ProveedorServices,auxiliarServices, AuditarServices) {


    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Proveedores");
        $scope.titleModal = "Registro de Proveedores";
        $scope.disabledContent = "";
        $scope.loaderSave = false;
        $(".filterEstado").select2();

        $scope.get_listando_Proveedores();
        $scope.get_listStatus();
        setTimeout(function () {
            $(".select_modal").select2();
            $scope.estados = '0';
            $('#cboestadoFilter').val(String('0')).trigger('change.select2');
            $('#cboMoneda').val(String('1')).trigger('change.select2');            
        }, 200);
    }

    $scope.Lista_Proveedores = [];
    var oTable;
    $scope.get_listando_Proveedores = function () {
        setTimeout(function () {
            $scope.loader = true;
            ProveedorServices.getProveedores()
                .then(function (res) {

                    console.log(res);

                $scope.Lista_Proveedores = [];
                $scope.Lista_Proveedores = res;
                $scope.loader = false;
          
                $timeout(function () {
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('tbl_proveedor', 'inputSearch');
                    } else {
                        $('#tbl_proveedor').trigger('footable_initialize');
                    }
                }, 500);
            }, function (err) {
                console.log(err);
            });
        }, 50);
    }

    $scope.Lista_CondicionFact = [];
    $scope.Listando_CondicionFacturacion = function () {
        $scope.loaderfiltros = true;
        GrupoDetServices.getGrupoTabla_Det(5)
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
                         '<h2  style="text-align:center;">' + ' Reporte Proveedor' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tbl_proveedor'),
                     ctx = { worksheet: 'ReportePRoveedor', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReportePRoveedor.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }
    $scope.Flag_ModoEdicion = false;
    
    $scope.objeto_Parametros = {
        id_Proveedor: 0,
        nroDocumento_Proveedor: '',
        tipoPersona_Proveedor: '',
        razonSocial_Proveedor: '',
        direccion_Proveedor: '',
        telefono1_Proveedor: '',
        telefono2_Proveedor: '',
        contacto_Proveedor: '',
        estado: 0,
        usuario_Creacion: 0,
        id_CondicionPago: '0',
        id_Banco: '0',
        id_Moneda: '1',
        nroCuenta: '',
        CCINro: '',
        email_Proveedor: '' 
    }

    $scope.clean = function () {
        $scope.objeto_Parametros.id_Proveedor = 0;
        $scope.objeto_Parametros.nroDocumento_Proveedor = '';
        $scope.objeto_Parametros.tipoPersona_Proveedor = '';
        $scope.objeto_Parametros.razonSocial_Proveedor = '';
        $scope.objeto_Parametros.direccion_Proveedor = '';
        $scope.objeto_Parametros.telefono1_Proveedor = '';
        $scope.objeto_Parametros.telefono2_Proveedor = '';
        $scope.objeto_Parametros.contacto_Proveedor = '';
        $scope.objeto_Parametros.estado = 1;
        $scope.objeto_Parametros.usuario_Creacion = 1;
        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';

        $scope.objeto_Parametros.id_CondicionPago = '0';
        $scope.objeto_Parametros.id_Banco = '0';
        $scope.objeto_Parametros.id_Moneda = '1';
        $scope.objeto_Parametros.nroCuenta = '';
        $scope.objeto_Parametros.CCINro = '';
        $scope.objeto_Parametros.email_Proveedor = '';
        
        $timeout(function () {
            $('#cbo_cond_facturacion').val('0').trigger('change.select2');
            $('#cbo_banco').val('0').trigger('change.select2');
            $('#cboMoneda').val('1').trigger('change.select2');
        }, 0);

    }

    $scope.objEstados = {
        activo: true,
        text: 'Activo',
        colorText: '#2c5ca9'
    }

    $scope.changeStatus = function (status) {
        if (status) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = "Activo";
            $scope.objEstados.colorText = "#2c5ca9";
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }
    }

    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $('#modalProveedores').modal('show');
        $scope.validarRuc('');

        let txtnumero_doc = document.getElementById("txtnumero_doc");
               
        $timeout(function () {
            txtnumero_doc.classList.remove("disabledContent");
        }, 100);
    }

    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;

        $('#modalProveedores').modal('show');
        $timeout(function () {
            $scope.EdicionRegistros(obj);
        }, 100);



    }

    var objAux;
    $scope.EdicionRegistros = function (obj) {

        objAux = '';
        objAux = obj;

        $scope.objeto_Parametros.id_Proveedor = obj.id_Proveedor;
        $scope.objeto_Parametros.nroDocumento_Proveedor = obj.nroDocumento_Proveedor;
        $scope.objeto_Parametros.tipoPersona_Proveedor = obj.tipoPersona_Proveedor;
        $scope.objeto_Parametros.razonSocial_Proveedor = obj.razonSocial_Proveedor;
        $scope.objeto_Parametros.telefono1_Proveedor = obj.telefono1_Proveedor;
        $scope.objeto_Parametros.telefono2_Proveedor = obj.telefono2_Proveedor;
        $scope.objeto_Parametros.contacto_Proveedor = obj.contacto_Proveedor;
        $scope.objeto_Parametros.direccion_Proveedor = obj.direccion_Proveedor;

        $scope.objeto_Parametros.id_CondicionPago = String(obj.id_CondicionPago);
        $scope.objeto_Parametros.id_Banco = String(obj.id_Banco);
        $scope.objeto_Parametros.id_Moneda = String(obj.id_Moneda);

        $scope.objeto_Parametros.nroCuenta = obj.nroCuenta;
        $scope.objeto_Parametros.CCINro = obj.CCINro;
        $scope.objeto_Parametros.email_Proveedor = obj.email_Proveedor;

        $scope.validarRuc(obj.nroDocumento_Proveedor);

        if (obj.estado == 1) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = 'Activo';
            $scope.objEstados.colorText = '#2c5ca9';
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }
        let txtnumero_doc = document.getElementById("txtnumero_doc"); 

        $timeout(function () {
            txtnumero_doc.classList.add("disabledContent");

            $('#cbo_cond_facturacion').val(String(obj.id_CondicionPago)).trigger('change.select2');
            $('#cbo_banco').val(String(obj.id_Banco)).trigger('change.select2');
            $('#cboMoneda').val(String(obj.id_Moneda)).trigger('change.select2');
        }, 200);

    }

    $scope.GuardarRegistro = function () {

        if (ProveedorServices.ValidacionGeneral($scope.objeto_Parametros) == false) {
            return;
        }

        $scope.objeto_Parametros.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            
            const saveProveedor = () => {
                $scope.loaderSave = true;
                ProveedorServices.save_Proveedor($scope.objeto_Parametros)
                    .then(function (data) {
                        $scope.get_listando_Proveedores();
                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Proceso de Registro realizado correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params).then(function (res) {
                                $('#modalProveedores').modal('hide');
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
                            auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                            });
                            $scope.loaderSave = false;
                            console.log(err);
                        }, 500)
                    })
            }

            if ($scope.flagRucValido == false) {
                var params = {
                    title: "Desea continuar ?",
                    text: 'Aunque el Ruc no es Valido.',
                    type: 'confirmationAlert',
                }
                auxiliarServices.initSweetAlert(params).then(function (res) {
                    if (res == true) {
                        saveProveedor();
                    }
                });
            } else {
                saveProveedor();
            }         
        } else {  //actualizar

            $scope.loaderSave = true;
            ProveedorServices.update_Proveedor($scope.objeto_Parametros)
            .then(function (data) {

                if (data == "OK") {
 
                    $scope.get_listando_Proveedores();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {
                            $('#modalProveedores').modal('hide');
                        });
                        $scope.loaderSave = false;
                    }, 500)
                } else {
                    $timeout(function () {
                        let paramsErr = {
                            type: 'error',
                            title: 'Error !',
                            text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                        }
                        auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                        });
                        $scope.loaderSave = false;
                        console.log(err);
                    }, 500)
                }
            }, function (error) {
                console.log(error);
            })

        }
    }
    

    $scope.getAnular = function (item) {

        if (item.estado == 0 || item.estado == '0') {
            return;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por anular el Proveedor.',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                ProveedorServices.anular_Proveedor(item.id_Proveedor)
                .then(function (res) {
                    var index = $scope.Lista_Proveedores.indexOf(item);
                    $scope.Lista_Proveedores[index].estado = 0;
                })
            }
        });
    }


    $scope.getAuditoria = function (item) {

        var fechaEdicion = auxiliarServices.formatDate(item.fecha_Edicion);
        var fechaCreacion = auxiliarServices.formatDate(item.fecha_Creacion);
        var usuedicion = "";
        var usucreacion = "";

        AuditarServices.getAuditar(item.usuario_Edicion).then(function (data) {
            usuedicion = data[0].nombre_personal + " " + data[0].apellido_personal;
            AuditarServices.getAuditar(item.usuario_Creacion).then(function (res) {
                usucreacion = res[0].nombre_personal + " " + res[0].apellido_personal;

                var message = "Fecha Creación : " + fechaCreacion + "</br>" +
                              "Usuario Creación : " + usucreacion + "</br>" +
                              "Fecha Edición : " + fechaEdicion + "</br>" +
                              "Usuario Edición : " + usuedicion + "</br>"
                auxiliarServices.NotificationMessage('Sistemas', message, 'success', '#008000', 5000);

            })
        })

    }

    $scope.listStatus = [];
    $scope.get_listStatus = function () {
        $scope.listStatus.push(
            { id: 0, descripcion: '[ ----   Todos  --- ]' },
            { id: 1, descripcion: 'Activos' },
            { id: 2, descripcion: 'Anulados' }
            )
    }
    // FILTRO  DE ESTADO EN LA TABLA PRINCIPAL --TODOS--- ---ACTIVOS-----   ---ANULADOS-----
    $scope.estados = 0;
    $scope.changeEstado = function (res) {

        $scope.filterStatus(res);
    }


    $scope.filterStatus = function (status) {
        var addrow = $("#tbl_proveedor")
        $("#tbl_proveedor").footable();

        if (status == 0) {
            status = '';
        }
        else if (status == 1) {
            status = 'Activado';
        }
        else if (status == 2) {
            status = 'Anulado';
        }

        addrow.trigger('footable_filter', {
            filter: status
        });

    }


    $scope.flagRucValido = false;
    $scope.validarRuc = function (valorRuc) {

        let resultado = document.getElementById("resultado"); 
        let ruc = valorRuc.replace(/[-.,[\]()\s]+/g, "");

        const mensajeRes = (ruc, valido) => {
            if (valido == "Válido") {
                resultado.classList.add("ok");
            } else {
                resultado.classList.remove("ok");
            }
            resultado.innerText = "RUC: " + ruc + "\nFormato: " + valido;
        }

        if (valorRuc == '' || valorRuc == null || valorRuc == undefined) {
            mensajeRes(ruc, "No válido");
            $scope.flagRucValido = false;
            return;
        }        
        //Es entero?    
        if ((ruc = Number(ruc)) && ruc % 1 === 0 && rucValido(ruc)) { 
            mensajeRes(ruc, "Válido");
            $scope.flagRucValido = true;
        } else {
            mensajeRes(ruc, "No válido");
            $scope.flagRucValido = false;
        }
    }

    // Devuelve un booleano si es un RUC válido
    // (deben ser 11 dígitos sin otro caracter en el medio)
    function rucValido(ruc) {
        //11 dígitos y empieza en 10,15,16,17 o 20
        if (!(ruc >= 1e10 && ruc < 11e9
            || ruc >= 15e9 && ruc < 18e9
            || ruc >= 2e10 && ruc < 21e9))
            return false;

        for (var suma = -(ruc % 10 < 2), i = 0; i < 11; i++, ruc = ruc / 10 | 0)
            suma += (ruc % 10) * (i % 7 + (i / 7 | 0) + 1);
        return suma % 11 === 0;

    }
 





})