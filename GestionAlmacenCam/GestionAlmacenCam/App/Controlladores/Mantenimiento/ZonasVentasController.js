var app = angular.module('appGestion.ZonasVentasController', [])

app.controller('ctrlZonasVentas', function ($scope, loginServices, $location, $timeout, auxiliarServices, ZonasVentasServices ,AuditarServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

 
        auxiliarServices.changeTitle("Matenimiento Zona de Ventas");
        $scope.titleModal = "Zona de Ventas";
 
        $scope.getEstados();
        $scope.getLocales();
        $scope.getAnexos();
        $scope.getSupervisor();
        $scope.getTransportista();

        setTimeout(function () {
            $(".select_modal").select2();
            $scope.estados = '0';
            $('#filtro_estado').val(String('1')).trigger('change.select2');
        }, 200);
    }

    $scope.getAuditorias = function (item) {

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


    $scope.ListaZonasVentas = [];
    var oTable;

    $scope.getZonasVentas = function () {
        $scope.loader = true;
        ZonasVentasServices.get_zonasVentas()
            .then(function (res) {
                $scope.ListaZonasVentas = [];
                $scope.ListaZonasVentas = res;
                $scope.loader = false;

                $timeout(function () {
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('tbl_zonasVentas', 'inputSearch');
                    } else {
                        $('#tbl_zonasVentas').trigger('footable_initialize');
                    }
                }, 500);
            }, function (err) {
                console.log(err);
            });
    }

    $scope.searchZonasVentas = function () {
        $scope.loader = true;
        ZonasVentasServices.search_zonasVentas($scope.Objeto_ParametroFiltro)
            .then(function (res) {

                if (res.ok) {
                    $scope.ListaZonasVentas = [];
                    $scope.ListaZonasVentas = res.data;
                    $scope.loader = false;

                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('tbl_zonasVentas', 'inputSearch');
                    } else {
                        $('#tbl_zonasVentas').trigger('footable_initialize');
                    }
                } else {
                    alert(JSON.stringify(res.data))
                }


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

    $scope.ListaLocales = [];
    $scope.getLocales = function () {
        ZonasVentasServices.get_locales()
            .then(function (res) {
                $scope.ListaLocales = [];
                $scope.ListaLocales = res;
            }, function (err) {
                console.log(err);
            });
    }

    $scope.ListaAnexos = [];
    $scope.getAnexos= function () {
        ZonasVentasServices.get_anexos()
            .then(function (res) {
                $scope.ListaAnexos = [];
                $scope.ListaAnexos = res;
            }, function (err) {
                console.log(err);
            });
    }

    $scope.ListaSupervisor = [];
    $scope.getSupervisor = function () {
        ZonasVentasServices.get_supervisor()
            .then(function (res) {
                $scope.ListaSupervisor = [];
                $scope.ListaSupervisor = res;
            }, function (err) {
                console.log(err);
            });
    }

    $scope.ListaTransportista = [];
    $scope.getTransportista = function () {
        ZonasVentasServices.get_transportista()
            .then(function (res) {
                $scope.ListaTransportista = [];
                $scope.ListaTransportista = res;
            }, function (err) {
                console.log(err);
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
                         '<h2  style="text-align:center;">' + ' Reporte Zonas de Ventas' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tbl_zonasVentas'),
                     ctx = { worksheet: 'ReporteZonaVentas', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReporteZonaVentas.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }


    $scope.Flag_modoEdicion = false;

    $scope.Objeto_ParametroFiltro = {
        id_local: '0',
        id_anexo: '0',
        id_estado: 1,
        buscar_zona: ''
    }

    $scope.objeto_parametros = {
        id_ZonaVta: 0,
        id_Local: 0,
        nombre_Local: '',
        ID_ANEXOS: 0,
        nombreAnexo: '',
        nombreZonaVta: '',
        id_Personal_Supervisor: 0,
        personal_supervisor: '',
        id_Transportista: 0,
        nombre_Transportista: '',
        id_CanalNegocio: 0,
        obj_dropsize: '',
        obj_efectividad: '',
        obj_distribucion: '',
        estado: 1,
        usuario_creacion: auxiliarServices.getUserId(),
        usuario_edicion: auxiliarServices.getUserId()
    }
       

    $scope.clean = function () {

        $scope.objeto_parametros.id_ZonaVta = 0;
        $scope.objeto_parametros.id_Local = 0;
        $scope.objeto_parametros.nombre_Local = '';
        $scope.objeto_parametros.ID_ANEXOS = 0;
        $scope.objeto_parametros.nombreAnexo = '';
        $scope.objeto_parametros.nombreZonaVta = '';
        $scope.objeto_parametros.id_Personal_Supervisor = 0;
        $scope.objeto_parametros.personal_supervisor = '';
        $scope.objeto_parametros.id_Transportista = 0;
        $scope.objeto_parametros.nombre_Transportista = '';
        $scope.objeto_parametros.id_CanalNegocio = 0;
        $scope.objeto_parametros.obj_dropsize = '';
        $scope.objeto_parametros.obj_efectividad = '';
        $scope.objeto_parametros.obj_distribucion = '';
        $scope.objeto_parametros.estado = 1;

        $('.select_modal').val("0").trigger('change.select2');

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
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }
    }

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

   
    $scope.EdicionRegistros = function (obj) {
        $scope.loaderProd = true;
        $scope.Flag_modoEdicion = true;

        $scope.objeto_parametros.id_ZonaVta = obj.id_ZonaVta;
        $scope.objeto_parametros.id_Local = obj.id_Local;
        $scope.objeto_parametros.nombre_Local = obj.nombre_Local;
        $scope.objeto_parametros.ID_ANEXOS = obj.ID_ANEXOS;
        $scope.objeto_parametros.nombreAnexo = obj.nombreAnexo;
        $scope.objeto_parametros.nombreZonaVta = obj.nombreZonaVta;
        $scope.objeto_parametros.id_Personal_Supervisor = obj.id_Personal_Supervisor;
        $scope.objeto_parametros.personal_supervisor = obj.personal_supervisor;
        $scope.objeto_parametros.id_Transportista = obj.id_Transportista;
        $scope.objeto_parametros.nombre_Transportista = obj.nombre_Transportista;
        $scope.objeto_parametros.id_CanalNegocio = obj.id_CanalNegocio;
        $scope.objeto_parametros.obj_dropsize = obj.obj_dropsize;
        $scope.objeto_parametros.obj_efectividad = obj.obj_efectividad;
        $scope.objeto_parametros.obj_distribucion = obj.obj_distribucion;
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
            $('#id_Local').val(String(obj.id_Local)).trigger('change.select2');
            $('#ID_ANEXOS').val(String(obj.ID_ANEXOS)).trigger('change.select2');
            $('#id_Personal_Supervisor').val(String(obj.id_Personal_Supervisor)).trigger('change.select2');
            $('#id_Transportista').val(String(obj.id_Transportista)).trigger('change.select2');
        }, 100);
    }

    $scope.GuardarRegistro = function () {

        if (ZonasVentasServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }
        
        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            $scope.loaderSave = true;
            ZonasVentasServices.save_ZonasVentas($scope.objeto_parametros)
                .then(function (data) {
                    $scope.ListaZonasVentas.push(data);
                    $scope.getZonasVentas();
                    $timeout(function () {
                        $('#modalMantenimiento').modal('hide');
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Registro realizado correctamente !'
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
                        $('#modalMantenimiento').modal('hide');
                    });
                    $scope.loaderSave = false;
                    console.log(err);
                }, 500)
            })

        } else {  //actualizar

            $scope.loaderSave = true;
            ZonasVentasServices.update_ZonasVentas($scope.objeto_parametros)
            .then(function (data) {
                if (data == "OK") {
                    $scope.ListaZonasVentas.push(data);
                    $scope.searchZonasVentas();
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
                        let paramsErr = {
                            type: 'error',
                            title: 'Error !',
                            text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                        }
                        auxiliarServices.initSweetAlert(paramsErr).then(function (res) {
                            $('#modalMantenimiento').modal('hide');
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
            text: 'Esta por anular la Zona de Ventas',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res==true) {
                ZonasVentasServices.delete_ZonasVentas(item.id_ZonaVta)
                    .then(function (res) {
                        var index = $scope.ListaZonasVentas.indexOf(item);
                        $scope.ListaZonasVentas[index].estado = 0;
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

    $scope.estados = '0';
    $scope.changeEstado = function (res) {

        $scope.filterStatus(res);
    }


    $scope.filterStatus = function (status) {
        var addrow = $("#tbl_canalesN")
        $("#tbl_canalesN").footable();

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

})