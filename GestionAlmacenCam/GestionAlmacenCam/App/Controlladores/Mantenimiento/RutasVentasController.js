var app = angular.module('appGestion.RutasVentasController', [])

app.controller('ctrlRutasVentas', function ($scope, loginServices, $location, $timeout, auxiliarServices, EstadosServices, RutasVentasServices,AuditarServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

/*        $scope.loader = true;*/
        auxiliarServices.changeTitle("Matenimiento Rutas de Ventas");
        $scope.titleModal = "Rutas de Ventas";
        $scope.loaderSave = false;
        $scope.get_personal();
        $scope.get_zonas();
        $scope.getEstados();
      
        setTimeout(function () {
            $(".select_modal").select2();
            $scope.estados = '1';
            $('#filtro_zona_venta').val(String('')).trigger('change.select2');
            $('#filtro_personal_supérvisor').val(String('')).trigger('change.select2');
            $('#filtro_estado').val(String('1')).trigger('change.select2');
        }, 0);

    }


    $scope.getAuditorias = function (item) {

        console.log(item)

        const uCreacion = (!item.usuario_creacion) ? 0 : item.usuario_creacion;
        const uEdicion = (!item.usuario_edicion) ? 0 : item.usuario_edicion;

        const fechaCreacion = auxiliarServices.formatDate(item.fecha_creacion);
        const fechaEdicion = (!item.fecha_edicion) ? '' : auxiliarServices.formatDate(item.fecha_edicion);

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



    $scope.ListaRutasVentas = [];
    var oTable;

    $scope.get_rutasVentas = function()
    {
        $scope.loader = true;
        RutasVentasServices.getRutasVentas()
        .then(function (res) {
            $scope.ListaRutasVentas = [];
            $scope.ListaRutasVentas = res;
            $scope.loader = false;
      
            $timeout(function () {
                if (oTable !== 'data') {
                    oTable = 'data';
                    auxiliarServices.initFooTable('tbl_rutasVentas', 'inputSearch');
                } else {
                    $('#tbl_rutasVentas').trigger('footable_initialize');
                }
            }, 500);
        }, function (err) {
            console.log(err);
        });
    }

    $scope.search_rutasVentas = function () {
 
        $scope.loader = true;
        RutasVentasServices.searchRutasVentas($scope.Objeto_ParametroFiltro)
            .then(function (res) {
                 if (res.ok == true) {
                    $scope.ListaRutasVentas = [];
                    $scope.ListaRutasVentas = res.data;
                    $timeout(function () {
                        $scope.loader = false;
                        if (oTable == null) {
                            oTable = 'data'
                            auxiliarServices.initFooTable('tbl_rutasVentas', 'inputSearch');
                        } else {
                            $('#tbl_rutasVentas').trigger('footable_initialize');
                        }
                    }, 500)

                 } else {
                     $scope.loader = false;
                    alert(JSON.stringify(res.data));
                }
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            });
    }


    $scope.ListaPersonal = [];
    $scope.get_personal = function () {
        RutasVentasServices.getPersonal()
            .then(function (res) {
                $scope.ListaPersonal = [];
                $scope.ListaPersonal = res;
            }, function (err) {
                console.log(err);
            });
    }

    $scope.ListaZonas = [];
    $scope.get_zonas = function () {
        RutasVentasServices.getZonas()
            .then(function (res) {
                $scope.ListaZonas = [];
                $scope.ListaZonas = res;
            }, function (err) {
                console.log(err);
            });
    }

    $scope.listaEstados = [];
    $scope.getEstados = function () {
        $scope.listaEstados.push(
            { id: 0, descripcion: 'Anulados' },
            { id: 1, descripcion: 'Activos' }
        )
    }



    $scope.Flag_modoEdicion = false;

    $scope.Objeto_ParametroFiltro = {
        id_zona: '0',
        id_supervisor: '0',
        id_estado: 1,
        buscar_ruta: ''
    }

    $scope.objeto_parametros = {
        id_RutaVta: 0,
        nombreRutaVta: '',
        id_Personal_Vendedor: 0,
        personal_vendedor_nombre: '',
        id_ZonaVta: 0,
        nombreZonaVta: '',
        id_Personal_Supervisor: 0,
        personal_supervisor_nombre: '',
        id_CanalNegocio: 0,
        meta_vtauni: 0,
        meta_vtasol: 0,
        DropSize: 0,
        ObjEfectividad: 0,
        ObjAcumVisitas: 0,
        ObjDistribucion: 0,
        ObjNewClientes: 0,
        estado: 1,
        usuario_creacion: auxiliarServices.getUserId(),
        usuario_edicion: auxiliarServices.getUserId()
    }
       

    $scope.clean = function () {

        $scope.objeto_parametros.id_RutaVta = 0;
        $scope.objeto_parametros.nombreRutaVta = '';
        $scope.objeto_parametros.id_Personal_Vendedor = 0;
        $scope.objeto_parametros.id_ZonaVta = 0;
        $scope.objeto_parametros.id_Personal_Supervisor = 0;
        $scope.objeto_parametros.id_CanalNegocio = 0,
        $scope.objeto_parametros.meta_vtauni = '',
        $scope.objeto_parametros.meta_vtasol = '',
        $scope.objeto_parametros.ObjEfectividad = '',
        $scope.objeto_parametros.ObjAcumVisitas = '',
        $scope.objeto_parametros.ObjDistribucion = '',
        $scope.objeto_parametros.ObjNewClientes ='',
        $scope.objeto_parametros.DropSize = '',

        $scope.objeto_parametros.estado = 1;
        $('.select_modal').val("0").trigger('change.select2');

        setTimeout(function () {
            $('#estado').val(String(1)).trigger('change.select2');
        }, 100); 

        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';
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
            $scope.objEstados.text = "Anulado";
            $scope.objEstados.colorText = "#b3192c";
        }
    }
    $('#modalMantenimiento').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#Nombre_CanalNegocio').focus();
        }, 500)

    });

    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $('#modalMantenimiento').modal('show');
    }
    
    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;        
       
        $scope.EdicionRegistros(obj);
        $('#modalMantenimiento').modal('show');
 
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
                '<h2  style="text-align:center;">' + ' Reporte Rutas de Ventas ' + '</h2>' +
                //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                '<table>{table}</table>' +
                '</body>' +
                '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
            format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tbl_rutasVentas'),
            ctx = { worksheet: 'ReporteRutasVentas', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReporteRutasVentas.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }


   
    $scope.EdicionRegistros = function (obj) {
        $scope.loaderProd = true;
        $scope.Flag_modoEdicion = true;

        $scope.objeto_parametros.id_RutaVta = obj.id_RutaVta;
        $scope.objeto_parametros.nombreRutaVta = obj.nombreRutaVta;
        $scope.objeto_parametros.id_Personal_Vendedor = obj.id_Personal_Vendedor;
        $scope.objeto_parametros.id_ZonaVta = obj.id_ZonaVta;
        $scope.objeto_parametros.id_Personal_Supervisor = obj.id_Personal_Supervisor;
        $scope.objeto_parametros.id_CanalNegocio = obj.id_CanalNegocio;
        $scope.objeto_parametros.meta_vtauni = obj.meta_vtauni;
        $scope.objeto_parametros.meta_vtasol = obj.meta_vtasol;
        $scope.objeto_parametros.ObjEfectividad = obj.ObjEfectividad;
        $scope.objeto_parametros.ObjAcumVisitas = obj.ObjAcumVisitas;
        $scope.objeto_parametros.ObjDistribucion = obj.ObjDistribucion;
        $scope.objeto_parametros.ObjNewClientes = obj.ObjNewClientes;
        $scope.objeto_parametros.DropSize = obj.DropSize;

        $scope.objeto_parametros.estado = obj.estado;


        if (obj.estado == 1) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = 'Activo';
            $scope.objEstados.colorText = '#2c5ca9';
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }

        setTimeout(function () {
            $('#personal_vendedor').val(String(obj.id_Personal_Vendedor)).trigger('change.select2');
            $('#zona_venta').val(String(obj.id_ZonaVta)).trigger('change.select2');
            $('#personal_supérvisor').val(String(obj.id_Personal_Supervisor)).trigger('change.select2');
            $('#estado').val(String(obj.estado)).trigger('change.select2');
        }, 100); 

    }

    $scope.GuardarRegistro = function () {

        if (RutasVentasServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            $scope.loaderSave = true;
            RutasVentasServices.save_RutasVentas($scope.objeto_parametros)
                .then(function (data) {
                $scope.ListaRutasVentas.push(data);
                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                        $('#modalCanalNegocio').modal('hide');
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

        } else {  //actualizar

            $scope.loaderSave = true;
            RutasVentasServices.update_RutasVentas($scope.objeto_parametros)
            .then(function (data) {
                if (data == "OK") {
                    $scope.search_rutasVentas();
                    $timeout(function () {
                        $('#modalMantenimiento').modal('hide');
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params)
                            .then(function (res) {
                                
                            });
                        $scope.loaderSave = false;
                    }, 500)
                } else {
                    $timeout(function () {
                        $('#modalMantenimiento').modal('hide');
                        let paramsErr = {
                            type: 'error',
                            title: 'Error !',
                            text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                        }
                        auxiliarServices.initSweetAlert(paramsErr).then(function (res) {
                        });
                        $scope.loaderSave = false;
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
            text: 'Esta por anular el Ruta de Ventas',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res==true) {
                RutasVentasServices.delete_RutasVentas(item.id_RutaVta)
                    .then(function (res) {
                        var index = $scope.ListaRutasVentas.indexOf(item);
                        $scope.ListaRutasVentas[index].estado = 0;
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

})