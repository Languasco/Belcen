var app = angular.module('appGestion.AnexosController', [])

app.controller('ctrlAnexos', function ($scope, loginServices, $location, $timeout, auxiliarServices, EstadosServices, AnexosServices,AuditarServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Anexos");
        $scope.get_Estados();

        $scope.titleModal = "Anexo";
        $scope.loaderSave = false;
        $scope.getAnexos();

        setTimeout(function () {
            $(".select_modal").select2();
            $('#filtro_estado').val(String('1')).trigger('change.select2');
        }, 200);
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

    $scope.ListaAnexos = [];
    var oTable;
    $scope.getAnexos = function () {
        $scope.loader = true;
        AnexosServices.get_anexos()
            .then(function (res) {
                $scope.ListaAnexos = [];
                $scope.ListaAnexos = res;
                $scope.loader = false;

                $timeout(function () {
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('tbl_anexo', 'inputSearch');
                    } else {
                        $('#tbl_anexo').trigger('footable_initialize');
                    }
                }, 500);
            }, function (err) {
                console.log(err);
            });
    }

    $scope.searchAnexos = function () {
        $scope.loader = true;
        AnexosServices.search_anexos($scope.Objeto_ParametroFiltro)
            .then(function (res) {
                $scope.ListaAnexos = [];
                $scope.ListaAnexos = res;
                $scope.loader = false;

                if (oTable !== 'data') {
                    oTable = 'data';
                    auxiliarServices.initFooTable('tbl_anexo', 'inputSearch');
                } else {
                    $('#tbl_anexo').trigger('footable_initialize');
                }
            }, function (err) {
                console.log(err);
            });
    }

    $scope.listaEstados = [];
    $scope.get_Estados = function () {
        $scope.listaEstados.push(
            { id: 0, descripcion: 'Anulados' },
            { id: 1, descripcion: 'Activos' }
        )
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
                         '<h2  style="text-align:center;">' + ' Reporte de Anexos ' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tbl_anexo'),
                     ctx = { worksheet: 'ReporteAnexo', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReporteAnexo.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }


    $scope.Flag_modoEdicion = false;

    $scope.Objeto_ParametroFiltro = {
        id_estado: 1,
        buscar_anexo: ''
    }

    $scope.objeto_parametros = {
        id_Anexos: 0,
        nombreGrupo: '',
        nombreAnexo: '',
        nombre_estado: '',
        direccionAnexo: '',
        emailAnexo: '',
        celularAnexo: '',
        estado: 0,
        RUTA: '',
        TOKEN: '',
        usuario_creacion: auxiliarServices.getUserId(),
        usuario_edicion: auxiliarServices.getUserId()
    }
       

    $scope.clean = function () {
        $scope.objeto_parametros.id_Anexos = 0;
        $scope.objeto_parametros.nombreGrupo = '';
        $scope.objeto_parametros.nombreAnexo = '';
        $scope.objeto_parametros.estado = 0;
        $scope.objeto_parametros.nombre_estado = '';
        $scope.objeto_parametros.direccionAnexo = '';
        $scope.objeto_parametros.emailAnexo = '';
        $scope.objeto_parametros.celularAnexo = '';
        $scope.objeto_parametros.RUTA = '';
        $scope.objeto_parametros.TOKEN = '';
        $scope.objeto_parametros.usuario_creacion = 0;
        $scope.objeto_parametros.usuario_edicion = 0;

        $('.selectModal').val("0").trigger('change.select2');

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
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }
    }
    $('#modalMantenimiento').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#nombreGrupo').focus();
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

   
    $scope.EdicionRegistros = function (obj) {
        $scope.loaderProd = true;
        $scope.Flag_modoEdicion = true;

        $scope.objeto_parametros.id_Anexos = obj.id_Anexos;
        $scope.objeto_parametros.nombreGrupo = obj.nombreGrupo;
        $scope.objeto_parametros.nombreAnexo = obj.nombreAnexo;
        $scope.objeto_parametros.estado = obj.estado;
        $scope.objeto_parametros.nombre_estado = obj.nombre_estado;
        $scope.objeto_parametros.direccionAnexo = obj.direccionAnexo;
        $scope.objeto_parametros.emailAnexo = obj.emailAnexo;
        $scope.objeto_parametros.celularAnexo = obj.celularAnexo;
        $scope.objeto_parametros.RUTA = obj.RUTA;
        $scope.objeto_parametros.TOKEN = obj.TOKEN;

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
            $('#estado').val(String(obj.estado)).trigger('change.select2');
        }, 100); 
    }

    $scope.GuardarRegistro = function () {

        if (AnexosServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }
       

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            $scope.loaderSave = true;
            AnexosServices.save_anexo($scope.objeto_parametros)
            .then(function (data) {
                $scope.ListaAnexos.push(data);
                $scope.getAnexos();
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

                    });
                    $scope.loaderSave = false;
                    console.log(err);
                }, 500)
            })

        } else {  //actualizar

            $scope.loaderSave = true;
            AnexosServices.update_anexo($scope.objeto_parametros)
                .then(function (data) {
                    console.log(data);
                if (data == "Ok") {
                    $scope.ListaAnexos.push(data);
                    $scope.searchAnexos();
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
            text: 'Esta por anular el Anexo',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                AnexosServices.delete_anexo(item.id_Anexos)
                    .then(function (res) {
                        var index = $scope.ListaAnexos.indexOf(item);
                        $scope.ListaAnexos[index].estado = 0;
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