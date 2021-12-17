
var app = angular.module('appGestion.Cliente_IIController', [])

app.controller('CtrlCliente_II', function ($scope, RevisionPedidoServices, Documentos_MasivosServices ,  $location, $timeout, auxiliarServices, Cliente_IIServices, GrupoDetServices, PedidosServices, PersonalServices, AuditarServices) {


    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Lista de Clientes");
        $scope.titleModal = "Registro de Cliente";
        $scope.loaderSave = false;
        
        setTimeout(function () {
            $(".selectFiltros").select2();   
            $(".selectModal").select2();              
            $scope.estados="0";
            $('#cboestadoFilter').val(String('0')).trigger('change.select2');
        }, 0);
 

        $scope.get_listStatus();
        $scope.Listando_TipoCliente();
    }

    $scope.Objeto_Parametro_Filtro = {
        id_TipoCliente: '0',
        doc_identidad: '',
        razon_social: '',

        id_zona: '0',
        id_vendedor: '0',
        id_condicionPago: '0',

        direccion_entrega: '',
        id_estado: '1',
    }


    $scope.actualizarTabla = function(){
        $('#tbl_clientes').trigger('footable_initialize');
    }
    var oTable;


    $scope.Lista_Zona = [];
    $scope.get_ListandoZonas = function () {
        $scope.loader = true;
        Documentos_MasivosServices.get_zonasUsuario(auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.Lista_Zona = [];
                    $scope.Lista_Zona = res.data;
                    $timeout(function () {
                        $scope.Objeto_Parametro_Filtro.id_zona = '0';
                        $('#cbo_zona').val("0").trigger('change.select2');
                    })
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                    $scope.loader = false;
                console.log(err);
            });
    };
    $scope.get_ListandoZonas();

    $scope.Lista_VendedorFiltro = [];
    $scope.change_Zona_vendedor = function (idZona) {
        $scope.loader = true;
        RevisionPedidoServices.get_vendedorLocal(idZona)
            .then(function (res) {
                $scope.loader = false;

                if (res.ok == true) {
                    $scope.Lista_VendedorFiltro = [];
                    $scope.Lista_VendedorFiltro = res.data;

                    setTimeout(function () {
                        $scope.Objeto_Parametro_Filtro.id_vendedor = '0';
                        $('#cbo_vendedor').val("0").trigger('change.select2');
                    }, 0);
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderFiltro = false;
                console.log(err);
            });
    };




    $scope.Lista_Clientes = [];
    $scope.get_Listando_Clientes = function () {
        
        const ejecutandoConsultaClientes = () => {
            $scope.loader = true;
            Cliente_IIServices.listadoClientes($scope.Objeto_Parametro_Filtro)
                .then(function (res) {
                    $scope.Lista_Clientes = res.data;
                    $timeout(function () {
                        $scope.loader = false;
                        if (oTable == null) {
                            oTable = 'data'
                            auxiliarServices.initFooTable('tbl_clientes', '');
                        } else {
                            $('#tbl_clientes').trigger('footable_initialize');
                        }
                    }, 500)
                }, function (err) {
                    console.log(err);
                });
        }


        if ($scope.Objeto_Parametro_Filtro.id_TipoCliente == '0' && $scope.Objeto_Parametro_Filtro.doc_identidad == '' && $scope.Objeto_Parametro_Filtro.razon_social == '' && $scope.Objeto_Parametro_Filtro.id_zona == '0' &&
            $scope.Objeto_Parametro_Filtro.id_vendedor == '0' && $scope.Objeto_Parametro_Filtro.id_condicionPago == '0' && $scope.Objeto_Parametro_Filtro.direccion_entrega == '' &&
            $scope.Objeto_Parametro_Filtro.id_estado == '0') {

            var params = {
                title: "Desea continuar ?",
                text: 'No selecciono ningun filtro,la respuesta va a tardar varios minutos',
                type: 'confirmationAlert',
            }
            auxiliarServices.initSweetAlert(params).then(function (res) {
                if (res == true) {
                    ejecutandoConsultaClientes();
                }
            });

        } else {
            ejecutandoConsultaClientes();
        }



 

    }
        
    $scope.listStatus = [];
    $scope.get_listStatus = function () {
        $scope.listStatus.push(
            { id: -1, descripcion: '[ ----   Todos  --- ]' },
            { id: 1, descripcion: 'Activos' },
            { id: 0, descripcion: 'Anulados' }
        )
    }
    $scope.changeEstado = function (res) {
        console.log(res);
        $scope.filterStatus(res);
    }
    $scope.filterStatus = function (status) {
        var addrow = $("#tbl_clientes")
        $("#tbl_clientes").footable();

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
                         '<h2  style="text-align:center;">' + ' Reporte Clientes ' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tbl_clientes'),
                     ctx = { worksheet: 'Reportecliente', table: table.html() };

        var link = document.createElement("a");
        link.download = "Reportecliente.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }

    $scope.Lista_TipoCliente = [];
    $scope.Listando_TipoCliente = function () {
        $scope.loader = true;
        GrupoDetServices.getGrupoTabla_Det(1)
            .then(function (data) {
                $scope.loader = false;
                $scope.Lista_TipoCliente = [];
                $scope.Lista_TipoCliente = data;
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }

    

    $scope.Lista_Distrito = [];
    $scope.change_provincia_distrito = function (id_provincia, distrito) {
        if (id_provincia == 0) {
            $scope.Lista_Distrito = [];
            $scope.objeto_parametros_cliente.id_distrito = '0';

            setTimeout(function () {
                $('#cbo_distrito').val("0").trigger('change.select2');
            }, 500);
        } else {
            $scope.loaderSave = true;
            PedidosServices.get_Distrito(id_provincia)
                .then(function (data) {
                    $scope.loaderSave = false;
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
                    $scope.loaderSave = false;
                    console.log(err);
                })
        }

    }
                
    $scope.Lista_CondicionFact = [];
    $scope.Listando_CondicionFacturacion = function () {
        $scope.loader = true;
        GrupoDetServices.getGrupoTabla_Det(5)
            .then(function (data) {
                $scope.loader = false;
                $scope.Lista_CondicionFact = [];
                $scope.Lista_CondicionFact = data;

                $scope.Listando_Tipodocumento();
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }
    $scope.Listando_CondicionFacturacion();

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
       
    $scope.ListaGiroNegocio = [];
    $scope.Listando_Giros = function () {
        $scope.loader = true;
        Cliente_IIServices.getGirosNegocio()
            .then(function (res) {
 
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.ListaGiroNegocio = [];
                    $scope.ListaGiroNegocio = res.data; 
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }
    $scope.Listando_Giros();

    $scope.ListaCanalesNegocio = [];
    $scope.Listando_Canales = function () {
        $scope.loader = true;
        Cliente_IIServices.getCanalesNegocio()
            .then(function (res) {
      
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.ListaCanalesNegocio = [];
                    $scope.ListaCanalesNegocio = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }
    $scope.Listando_Canales();
    
    $scope.ListaZonas = [];
    $scope.Listando_Zonas = function () {
        $scope.loader = true;
        Cliente_IIServices.getZona()
            .then(function (res) {
                console.log(res)
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.ListaZonas = [];
                    $scope.ListaZonas = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }
    $scope.Listando_Zonas();

    $scope.ListaRutas = [];
    $scope.Listando_Rutas = function () {
        $scope.loader = true;
        Cliente_IIServices.getRuta()
            .then(function (res) { 
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.ListaRutas = [];
                    $scope.ListaRutas = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }
    $scope.Listando_Rutas();
    
    $scope.changeRuta = function (idRuta) {
        if (idRuta == '0' || idRuta == 0) {
            $scope.Lista_Vendedor = [];
            $scope.ListaSupervisores = [];
            return
        }

        $scope.Listando_Vendedores(idRuta);
        $scope.Listando_Supervisores(idRuta);
    }
    
    $scope.ListaSupervisores = [];
    $scope.Listando_Supervisores = function (idRuta) {
        $scope.loader = true;
        Cliente_IIServices.getSupervisor(idRuta)
            .then(function (res) { 
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.ListaSupervisores = [];
                    $scope.ListaSupervisores = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }

    $scope.Lista_Vendedor = [];
    $scope.Listando_Vendedores = function (idRuta) {
        $scope.loader = true;
        Cliente_IIServices.getVendedores(idRuta)
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.Lista_Vendedor = [];
                    $scope.Lista_Vendedor = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }
              
    
    $scope.objeto_parametros_cliente = {
        id_cliente: '0',
        id_empresa: '1',
        codigoInterno_Cliente: '',
        id_TipoCliente: '0',
        id_DocumentoIdentidad: '0',
        nroDoc_Cliente: '',
        nombres_Cliente: '',
        email_Cliente: '',
        id_Provincia: '0',
        id_distrito: '0',
        id_departamento: '0',
        direccion_Cliente: '',
        id_PersonalVendedor: '0',
        estado: '1',
        usuario_creacion : '',
        cond_facturacion : '0',

        latitud_Cliente : '',
        longitud_Cliente : '',
        id_GiroNegocio :  '0',
        id_CanalNegocio: '0',
        direccion_referencia: '',
        nroTelefono_Cliente: '',
 

        id_ZonaVta: '0',
        id_RutaVta: '0',
        id_Personal_Supervisor: '0',
        secuencia_Cliente: '',
        disDiaVisita: '0',
        motivodeNocompra: '',
        productoInteres: '',
        importeMaxCredido: '',
        obsrealizaCobranza: '',



    }


    $scope.Flag_modoEdicion = false;

    $scope.clean_MantCliente = function () {
        //$scope.objeto_parametros_cliente.id_cliente = '0';
        $scope.objeto_parametros_cliente.id_empresa = '1';
        $scope.objeto_parametros_cliente.codigoInterno_Cliente = '';
        $scope.objeto_parametros_cliente.id_TipoCliente = '0';
        $scope.objeto_parametros_cliente.id_DocumentoIdentidad = '0';
        $scope.objeto_parametros_cliente.nroDoc_Cliente = '';
        $scope.objeto_parametros_cliente.nombres_Cliente = '';
        $scope.objeto_parametros_cliente.email_Cliente = '';
        
        $scope.objeto_parametros_cliente.id_distrito = '0';
        $scope.objeto_parametros_cliente.id_Provincia = '0';
        $scope.objeto_parametros_cliente.id_departamento = '0';

        $scope.objeto_parametros_cliente.direccion_Cliente = '';
        $scope.objeto_parametros_cliente.id_PersonalVendedor = '0';
        $scope.objeto_parametros_cliente.estado = '1';
        $scope.objeto_parametros_cliente.usuario_creacion = auxiliarServices.getUserId();
        $scope.objeto_parametros_cliente.cond_facturacion = '0';

        $scope.objeto_parametros_cliente.latitud_Cliente = '';
        $scope.objeto_parametros_cliente.longitud_Cliente = '';
        $scope.objeto_parametros_cliente.id_GiroNegocio = '';
        $scope.objeto_parametros_cliente.id_CanalNegocio = '';
        $scope.objeto_parametros_cliente.direccion_referencia = '';
        $scope.objeto_parametros_cliente.nroTelefono_Cliente = '';
        
        $scope.objeto_parametros_cliente.id_ZonaVta= '0';
        $scope.objeto_parametros_cliente.id_RutaVta = '0';
        $scope.objeto_parametros_cliente.id_Personal_Supervisor = '0';
        $scope.objeto_parametros_cliente.secuencia_Cliente = '';
        $scope.objeto_parametros_cliente.disDiaVisita = '0';
        $scope.objeto_parametros_cliente.motivodeNocompra = '';
        $scope.objeto_parametros_cliente.productoInteres = '';
        $scope.objeto_parametros_cliente.importeMaxCredido = '';
        $scope.objeto_parametros_cliente.obsrealizaCobranza = '';


        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';

        $timeout(function () {
            $('#cbo_tipocliente').val("0").trigger('change.select2');
            $('#cbo_departamento').val("0").trigger('change.select2');
            $('#cbo_provincia').val("0").trigger('change.select2');
            $('#cbo_distrito').val("0").trigger('change.select2');
            //$('#cbo_personalVendedor').val("0").trigger('change.select2');
            $('#cbo_tipoDoc').val("0").trigger('change.select2');
            $('#cbo_condFacturacion').val("0").trigger('change.select2'); 
            $('#cboGiro').val(parseInt("0")).trigger('change.select2');
            $('#cboCanales').val(parseInt("0")).trigger('change.select2');
            $('#cboZona').val(parseInt("0")).trigger('change.select2');
            $('#cboRuta').val(parseInt("0")).trigger('change.select2');
            $('#cboVendedor').val(parseInt("0")).trigger('change.select2');
            $('#cboSupervisor').val(parseInt("0")).trigger('change.select2');
            $('#cobDiaVisita').val(parseInt("0")).trigger('change.select2');            
        }, 300);
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
        $scope.clean_MantCliente();
        $scope.Flag_modoEdicion = false;
        $scope.idCliente_Global = 0;
        $scope.tab = 1;
        $('#modalMantenimiento').modal('show');

        //-----validar ruc
        $scope.validarRuc('');
        let txt_nrodoc = document.getElementById("txt_nrodoc");
        let cbo_tipoDoc = document.getElementById("cbo_tipoDoc");

        $timeout(function () {
            txt_nrodoc.classList.remove("disabledContent");
            cbo_tipoDoc.classList.remove("disabledContent");
            $scope.showRuc = false;
        }, 100);
    }

    $scope.Open_Update_Modal = function (obj) {
        $scope.clean_MantCliente();
        $scope.Flag_modoEdicion = true;

        $scope.EdicionRegistros(obj);
        $scope.tab = 1;
        $('#modalMantenimiento').modal('show');

    }

    var objAux;
    $scope.EdicionRegistros = function (obj) {
        objAux = '';
        objAux = obj;

        $scope.idCliente_Global = obj.id_cliente;

        $scope.objeto_parametros_cliente.id_cliente = obj.id_cliente;
        $scope.objeto_parametros_cliente.id_empresa = obj.id_empresa;
        $scope.objeto_parametros_cliente.codigoInterno_Cliente = obj.codigoInterno_Cliente;
        $scope.objeto_parametros_cliente.id_TipoCliente = obj.id_TipoCliente;
        $scope.objeto_parametros_cliente.id_DocumentoIdentidad = obj.id_DocumentoIdentidad;
        $scope.objeto_parametros_cliente.nroDoc_Cliente = obj.nroDoc_Cliente;
        $scope.objeto_parametros_cliente.nombres_Cliente = obj.nombres_Cliente;
        $scope.objeto_parametros_cliente.email_Cliente = obj.email_Cliente;        

        $scope.objeto_parametros_cliente.id_departamento = obj.id_departamento;
        $scope.objeto_parametros_cliente.id_Provincia = obj.id_Provincia;
        $scope.objeto_parametros_cliente.id_distrito = obj.id_distrito;

        $scope.objeto_parametros_cliente.direccion_Cliente = obj.direccion_Cliente;
        $scope.objeto_parametros_cliente.estado = obj.estado;
        $scope.objeto_parametros_cliente.usuario_creacion = auxiliarServices.getUserId();
        $scope.objeto_parametros_cliente.cond_facturacion = obj.cond_facturacion;

        $scope.objeto_parametros_cliente.latitud_Cliente = obj.latitud_Cliente;
        $scope.objeto_parametros_cliente.longitud_Cliente = obj.longitud_Cliente;
        $scope.objeto_parametros_cliente.id_GiroNegocio = obj.id_GiroNegocio;
        $scope.objeto_parametros_cliente.id_CanalNegocio = obj.id_CanalNegocio;
        $scope.objeto_parametros_cliente.direccion_referencia = obj.direccion_referencia;
        $scope.objeto_parametros_cliente.nroTelefono_Cliente = obj.nroTelefono_Cliente;
        
        $scope.objeto_parametros_cliente.id_ZonaVta = obj.id_ZonaVta;
        $scope.objeto_parametros_cliente.id_RutaVta = obj.id_RutaVta;

        $scope.changeRuta(obj.id_RutaVta);

        $scope.objeto_parametros_cliente.id_Personal_Supervisor = String(obj.id_Personal_Supervisor);
        $scope.objeto_parametros_cliente.id_PersonalVendedor = obj.id_PersonalVendedor;

        $scope.objeto_parametros_cliente.secuencia_Cliente = obj.secuencia_Cliente;
        $scope.objeto_parametros_cliente.disDiaVisita = String(obj.disDiaVisita);
        $scope.objeto_parametros_cliente.motivodeNocompra = obj.motivodeNocompra;
        $scope.objeto_parametros_cliente.productoInteres = obj.productoInteres;
        $scope.objeto_parametros_cliente.importeMaxCredido = obj.importeMaxCredido;
        $scope.objeto_parametros_cliente.obsrealizaCobranza = obj.obsrealizaCobranza;


        $scope.validarRuc(obj.nroDoc_Cliente);


        if (obj.estado == 1) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = 'Activo';
            $scope.objEstados.colorText = '#2c5ca9';
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }

        let txt_nrodoc = document.getElementById("txt_nrodoc");
        let cbo_tipoDoc = document.getElementById("cbo_tipoDoc");

        setTimeout(function () {
            $('#cbo_tipocliente').val(obj.id_TipoCliente).trigger('change.select2');
            $('#cbo_departamento').val(parseInt(obj.id_departamento)).trigger('change.select2');
            $('#cbo_provincia').val(obj.id_Provincia).trigger('change.select2');
            $scope.change_departamento_provincia(obj.id_departamento,obj.id_Provincia);
            //$('#cbo_personalVendedor').val(obj.id_PersonalVendedor).trigger('change.select2');
            $('#cbo_condFacturacion').val(obj.cond_facturacion).trigger('change.select2');
            $('#cbo_tipoDoc').val(parseInt(obj.id_DocumentoIdentidad)).trigger('change.select2');

            $('#cboGiro').val(parseInt(obj.id_GiroNegocio)).trigger('change.select2');
            $('#cboCanales').val(parseInt(obj.id_CanalNegocio)).trigger('change.select2');      

            $('#cboZona').val(parseInt(obj.id_ZonaVta)).trigger('change.select2');
            $('#cboRuta').val(parseInt(obj.id_RutaVta)).trigger('change.select2');

            $('#cboVendedor').val(parseInt(obj.id_PersonalVendedor)).trigger('change.select2');
            $('#cboSupervisor').val(parseInt(obj.id_Personal_Supervisor)).trigger('change.select2');
            $('#cobDiaVisita').val(parseInt(obj.disDiaVisita)).trigger('change.select2');
            txt_nrodoc.classList.add("disabledContent");
            cbo_tipoDoc.classList.add("disabledContent");


        }, 600);





        setTimeout(function () {
             $scope.change_provincia_distrito(obj.id_Provincia, obj.id_distrito);
        }, 1500);

    }


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
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        hoy = yyyy + '' + mm + '' + dd + '' + hour + '' + minuts + '' + second;
        // GENERANDO CODIGO ALEATORIO
        var codigoAle = Math.floor(Math.random() * 1000000);
        // CODIGO DEL USUARIO LOGEADO
        var dataUser = auxiliarServices.getUserId();
        return dataUser + '_' + codigoAle + '_' + hoy;
    }

    $scope.idCliente_Global = 0;

    $scope.GuardarRegistro = function () {

        if ($scope.objeto_parametros_cliente.id_TipoCliente == 0 || $scope.objeto_parametros_cliente.id_TipoCliente == '0' || $scope.objeto_parametros_cliente.id_TipoCliente == null || $scope.objeto_parametros_cliente.id_TipoCliente == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Tipo de Cliente', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.id_DocumentoIdentidad == 0 || $scope.objeto_parametros_cliente.id_DocumentoIdentidad == '0' || $scope.objeto_parametros_cliente.id_DocumentoIdentidad == null || $scope.objeto_parametros_cliente.id_DocumentoIdentidad == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Documento de Identidad', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.objeto_parametros_cliente.id_GiroNegocio == 0 || $scope.objeto_parametros_cliente.id_GiroNegocio == '0' || $scope.objeto_parametros_cliente.id_GiroNegocio == null || $scope.objeto_parametros_cliente.id_GiroNegocio == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Giro del Negocio', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.objeto_parametros_cliente.id_CanalNegocio == 0 || $scope.objeto_parametros_cliente.id_CanalNegocio == '0' || $scope.objeto_parametros_cliente.id_CanalNegocio == null || $scope.objeto_parametros_cliente.id_CanalNegocio == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Canal del Negocio', 'error', '#ff6849', 1500);
            return;
        }


        if ($scope.objeto_parametros_cliente.nroDoc_Cliente == 0 || $scope.objeto_parametros_cliente.nroDoc_Cliente == '0' || $scope.objeto_parametros_cliente.nroDoc_Cliente == null || $scope.objeto_parametros_cliente.nroDoc_Cliente == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el nro de Documento', 'error', '#ff6849', 1500);
            return;
        }
 

        if ($scope.objeto_parametros_cliente.nombres_Cliente == null || $scope.objeto_parametros_cliente.nombres_Cliente == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese los datos del Cliente', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.id_departamento == 0 || $scope.objeto_parametros_cliente.id_departamento == '0' || $scope.objeto_parametros_cliente.id_departamento == null || $scope.objeto_parametros_cliente.id_departamento == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Departamento', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.id_Provincia == 0 || $scope.objeto_parametros_cliente.id_Provincia == '0' || $scope.objeto_parametros_cliente.id_Provincia == null || $scope.objeto_parametros_cliente.id_Provincia == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Provincia', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.id_distrito == 0 || $scope.objeto_parametros_cliente.id_distrito == '0' || $scope.objeto_parametros_cliente.id_distrito == null || $scope.objeto_parametros_cliente.id_distrito == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Distrito', 'error', '#ff6849', 1500);
            return;
        }

        if ($scope.objeto_parametros_cliente.direccion_Cliente == null || $scope.objeto_parametros_cliente.direccion_Cliente == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Dirección', 'error', '#ff6849', 1500);
            return;
        }


        $scope.objeto_parametros_cliente.id_Personal_Supervisor = ($scope.objeto_parametros_cliente.id_Personal_Supervisor == null ) ? 0 : $scope.objeto_parametros_cliente.id_Personal_Supervisor;


        console.log($scope.objeto_parametros_cliente)


        if ($scope.Flag_modoEdicion == false) { // nuevo registroo

            const guardarClientes = () => {
                //---validando que el codigo sea unico---
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

                        $scope.objeto_parametros_cliente.estado = $scope.objEstados.activo == true ? 1 : 0;
                        $scope.objeto_parametros_cliente.codigoInterno_Cliente = getCodUniq();
                        $scope.loaderSave = true;
                        Cliente_IIServices.save_Cliente($scope.objeto_parametros_cliente)
                            .then(function (data) {

                                $scope.get_Listando_Clientes();
                                $scope.idCliente_Global = data.id_cliente;

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
                                    auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                                    });
                                    $scope.loaderSave = false;
                                    console.log(err);
                                }, 500)
                            })

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

            if ($scope.objeto_parametros_cliente.id_DocumentoIdentidad == 21) { ///---- ruc
                if ($scope.flagRucValido == false) {
                    var params = {
                        title: "Desea continuar ?",
                        text: 'Aunque el Ruc no es Valido.',
                        type: 'confirmationAlert',
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                        if (res == true) {
                            guardarClientes();
                        }
                    });
                } else { 
                    guardarClientes();
                }
            } else {///---- otro tipo de documento --
                guardarClientes();
            }

        } else {  //actualizar

            alert('entrooo')

            $scope.objeto_parametros_cliente.estado = $scope.objEstados.activo == true ? 1 : 0;
            $scope.loaderSave = true;
            Cliente_IIServices.update_Cliente($scope.objeto_parametros_cliente)
                .then(function (data) {

                    if (data == "OK") {
                        $scope.get_Listando_Clientes();
                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Actualizacion realizado correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params).then(function (res) {
                                $('#modalMantenimiento').modal('hide');
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
       
    $scope.GuardarDistribucion = function () {   

        if ($scope.idCliente_Global == 0 || $scope.idCliente_Global == '0' ) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor primero grabe la ficha de DATOS GENERALES', 'error', '#ff6849', 1500);
            return 
        }

        if ($scope.objeto_parametros_cliente.id_ZonaVta == 0 || $scope.objeto_parametros_cliente.id_ZonaVta == '0' || $scope.objeto_parametros_cliente.id_ZonaVta == null || $scope.objeto_parametros_cliente.id_ZonaVta == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Zona', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.id_RutaVta == 0 || $scope.objeto_parametros_cliente.id_RutaVta == '0' || $scope.objeto_parametros_cliente.id_RutaVta == null || $scope.objeto_parametros_cliente.id_RutaVta == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Ruta', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.id_PersonalVendedor == 0 || $scope.objeto_parametros_cliente.id_PersonalVendedor == '0' ) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Vendedor', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.id_Personal_Supervisor == 0 || $scope.objeto_parametros_cliente.id_Personal_Supervisor == '0' ) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Supervisor', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.secuencia_Cliente == 0 || $scope.objeto_parametros_cliente.secuencia_Cliente == '0' || $scope.objeto_parametros_cliente.secuencia_Cliente == null || $scope.objeto_parametros_cliente.secuencia_Cliente == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Supervisor', 'error', '#ff6849', 1500);
            return;
        }

        
  
        $scope.loaderSave = true;
        Cliente_IIServices.grabar_DistribucionCliente($scope.idCliente_Global, $scope.objeto_parametros_cliente.id_ZonaVta, $scope.objeto_parametros_cliente.id_RutaVta, $scope.objeto_parametros_cliente.id_PersonalVendedor,
                                                      $scope.objeto_parametros_cliente.id_Personal_Supervisor, $scope.objeto_parametros_cliente.secuencia_Cliente, $scope.objeto_parametros_cliente.disDiaVisita, $scope.objeto_parametros_cliente.motivodeNocompra, $scope.objeto_parametros_cliente.productoInteres)
            .then(function (res) {
                console.log(res)
                if (res.ok == true) {
                    $scope.get_Listando_Clientes();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {
 
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


    $scope.GuardarCreditoCobranza = function () {

        if ($scope.idCliente_Global == 0 || $scope.idCliente_Global == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor primero grabe la ficha de DATOS GENERALES', 'error', '#ff6849', 1500);
            return
        }
 
        if ($scope.objeto_parametros_cliente.importeMaxCredido == 0 || $scope.objeto_parametros_cliente.importeMaxCredido == '0' || $scope.objeto_parametros_cliente.importeMaxCredido == null || $scope.objeto_parametros_cliente.importeMaxCredido == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Importe Maximo', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.obsrealizaCobranza == null || $scope.objeto_parametros_cliente.obsrealizaCobranza == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese Observaciones para la Cobranza', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.objeto_parametros_cliente.cond_facturacion == 0 || $scope.objeto_parametros_cliente.cond_facturacion == '0' || $scope.objeto_parametros_cliente.cond_facturacion == null || $scope.objeto_parametros_cliente.cond_facturacion == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Condicion de Facturacion', 'error', '#ff6849', 1500);
            return;
        }

        $scope.loaderSave = true;
        Cliente_IIServices.grabar_creditoCobranzaCliente($scope.idCliente_Global, $scope.objeto_parametros_cliente.importeMaxCredido, $scope.objeto_parametros_cliente.obsrealizaCobranza, $scope.objeto_parametros_cliente.cond_facturacion)
            .then(function (res) {
                console.log(res)
                if (res.ok == true) {
                    $scope.get_Listando_Clientes();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {

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



    function ValidarNroDocumento(nroDoc_Cliente) {
        var estado = false;
        for (var i = 0; i < $scope.Lista_Clientes.length; i++) {
            if (nroDoc_Cliente == $scope.Lista_Clientes[i].nroDoc_Cliente) {
                estado = true;
                break;
            }
        }
        return estado;
    }

    $scope.getAnular = function (item) {
        if (item.estado == 0 || item.estado == '0') {
            return;
        }
        var params = {
            title: "Desea continuar ?",
            text: 'Esta por anular el Cliente.',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                Cliente_IIServices.anular_Cliente(item.id_cliente)
                    .then(function (res) {
                        var index = $scope.Lista_Clientes.indexOf(item);
                        $scope.Lista_Clientes[index].estado = 0;
                    })
            }
        });
    }

    $scope.getAuditoria = function (item) {
        var fechaEdicion = auxiliarServices.formatDate(item.fecha_edicion);
        var fechaCreacion = auxiliarServices.formatDate(item.usuario_creacion);
        var usuedicion = "";
        var usucreacion = "";

        AuditarServices.getAuditar(item.usuario_edicion).then(function (data) {
            usuedicion = data[0].nombre_personal + " " + data[0].apellido_personal;
            AuditarServices.getAuditar(item.usuario_creacion).then(function (res) {
                usucreacion = res[0].nombre_personal + " " + res[0].apellido_personal;

                var message = "Fecha Creación : " + fechaCreacion + "</br>" +
                    "Usuario Creación : " + usucreacion + "</br>" +
                    "Fecha Edición : " + fechaEdicion + "</br>" +
                    "Usuario Edición : " + usuedicion + "</br>"
                auxiliarServices.NotificationMessage('Sistemas', message, 'success', '#008000', 5000);

            })
        })

    }
    $scope.showRuc = false;

    $scope.change_TipoDocumento = function () {
        $scope.objeto_parametros_cliente.nroDoc_Cliente = '';
        $scope.objeto_parametros_cliente.nombres_Cliente = '';

        let resultado = document.getElementById("resultado");
        if ($scope.objeto_parametros_cliente.id_DocumentoIdentidad == 21) {
            $scope.showRuc = true;
            $scope.validarRuc('');
        } else {
            $scope.showRuc = false;
        }

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
                            $('#cbo_provincia').select2('open');
                        }, 200);
                    }

                }, function (error) {
                    console.log(error);
                });
        }
        //else if ($scope.objeto_parametros_cliente.id_DocumentoIdentidad == 21 || $scope.objeto_parametros_cliente.id_DocumentoIdentidad == '21') {  // ruc
        //    if (VerificaRuc($scope.objeto_parametros_cliente.nroDoc_Cliente) == false) {
        //        auxiliarServices.NotificationMessage('Sistemas', 'El nro de R.u.c ingresado es incorrecto, verifique..', 'error', '#ff6849', 2500);
        //        return;
        //    } else {
        //        $scope.enterFocus(1, 'txt_nombresCliente');
        //    }
        //}
    };


    $scope.enterFocus = function (type, name) {
        if (type === 1) {
            $('#' + name + '').focus();
            $('#' + name + '').select();

        } else if (type === 2) {
            $('#' + name + '').select2('open');
        }
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
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }
    $scope.Listando_Departamentos();

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

    function rucValido(ruc) {
        if (!(ruc >= 1e10 && ruc < 11e9
            || ruc >= 15e9 && ruc < 18e9
            || ruc >= 2e10 && ruc < 21e9))
            return false;

        for (var suma = -(ruc % 10 < 2), i = 0; i < 11; i++ , ruc = ruc / 10 | 0)
            suma += (ruc % 10) * (i % 7 + (i / 7 | 0) + 1);
        return suma % 11 === 0;

    }
    function validarInput(value) {
        var ruc = value.replace(/[-.,[\]()\s]+/g, ""),
            valido;
        //Es entero?    
        if ((ruc = Number(ruc)) && ruc % 1 === 0
            && rucValido(ruc)) { // ⬅ ⬅ ⬅ ⬅ Acá se comprueba
            valido = true;
        } else {
            valido = false;
        }
        return valido;
    }
 

    function VerificaRuc(cad) {
        var Pos = [10];
        var i;
        var Valor;
        var valorB;
        var VerificaRuc = true;
        cad = cad.trim();

        for (let i = 0; i <= 10; i++) {
            if (i == 0) {
                Pos[i] = cad.substring(i, 1);
            } else {
                Pos[i] = cad.substring(i, 1 + i);
            }
        }
        Valor = Pos[0] * 5 + Pos[1] * 4 + Pos[2] * 3 + Pos[3] * 2 + Pos[4] * 7 + Pos[5] * 6 + Pos[6] * 5 + Pos[7] * 4 + Pos[8] * 3 + Pos[9] * 2;
        valorB = (Valor / 11);
        valorB = parseInt(valorB);
        Valor = 11 - (Valor - (valorB * 11));

        if (Valor == 10) {
            Valor = 0;
            VerificaRuc = false
        } else if (Valor == 11) {
            Valor = 1;
            VerificaRuc = false
        }

        if (Pos[10] != Valor) {
            VerificaRuc = false;
        }

        return VerificaRuc;
    }


    /// Configuracion Tabcontrl Enfoque
    $scope.tab = 1;
    $scope.setTab = function (newTab) {
        $scope.tab = newTab;
    };

    $scope.isSet = function (tabNum) {
        return $scope.tab === tabNum;
    };
    //-----------------------

    $scope.abrirModalMapa = function () {

        const latitud = $scope.objeto_parametros_cliente.latitud_Cliente;
        const longitud = $scope.objeto_parametros_cliente.longitud_Cliente;
        
        if (latitud == '' || latitud == null || latitud == undefined) {
             return 
        } else {
            $('#modalMapa').modal('show');
        }
    }


    $(document).ready(function () {
        var map = null;
        var myMarker;
        var myLatlng;

        function initializeGMap(lat, lng) {
            myLatlng = new google.maps.LatLng(lat, lng);

            var myOptions = {
                zoom: 12,
                zoomControl: true,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

            myMarker = new google.maps.Marker({
                position: myLatlng,
            });
            myMarker.setMap(map); 
        }

        // Re-init map before show modal
        $('#modalMapa').on('show.bs.modal', function (event) {

            const latitud = $scope.objeto_parametros_cliente.latitud_Cliente;
            const longitud = $scope.objeto_parametros_cliente.longitud_Cliente;
 
            initializeGMap(latitud, longitud);
            $("#location-map").css("width", "100%");
            $("#map_canvas").css("width", "100%");
        });

        // Trigger map resize event after modal shown
        $('#modalMapa').on('shown.bs.modal', function () {
            google.maps.event.trigger(map, "resize");
            map.setCenter(myLatlng);
        });
    });



    $scope.flagRucValido = false;
    $scope.validarRuc = function (valorRuc) {

        if ($scope.objeto_parametros_cliente.id_DocumentoIdentidad != 21   ) {
            return;
        }
        $scope.showRuc = true;
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