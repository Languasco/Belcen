var app = angular.module('appGestion.BancosController', [])

app.controller('ctrlBancos', function ($scope, loginServices, $location, $timeout, auxiliarServices, BancosServices,AuditarServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Bancos");
        $scope.getEstados();

        $scope.titleModal = "Banco";
        $scope.loaderSave = false;
        $scope.getBancos();

        setTimeout(function () {
            $(".select_modal").select2();
            $('#filtro_estado').val(String('1')).trigger('change.select2');
        }, 200);
    }

    $scope.ListaBancos = [];
    var oTable;
    $scope.getBancos = function () {
        $scope.loader = true;
        BancosServices.get_bancos()
            .then(function (res) {
                $scope.ListaBancos = [];
                $scope.ListaBancos = res;
                $scope.loader = false;

                $timeout(function () {
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('tbl_banco', 'inputSearch');
                    } else {
                        $('#tbl_banco').trigger('footable_initialize');
                    }
                }, 500);
            }, function (err) {
                console.log(err);
            });
    }

    $scope.searchBancos = function () {
        $scope.loader = true;
        BancosServices.search_bancos($scope.Objeto_ParametroFiltro)
            .then(function (res) {
                $scope.ListaBancos = [];
                $scope.ListaBancos = res;
                $scope.loader = false;

                if (oTable !== 'data') {
                    oTable = 'data';
                    auxiliarServices.initFooTable('tbl_banco', 'inputSearch');
                } else {
                    $('#tbl_banco').trigger('footable_initialize');
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
                         '<h2  style="text-align:center;">' + ' Reporte de Bancos ' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tbl_banco'),
                     ctx = { worksheet: 'ReporteBanco', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReporteBanco.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }


    $scope.Flag_modoEdicion = false;

    $scope.Objeto_ParametroFiltro = {
        id_estado: 1,
        buscar_banco: ''
    }

    $scope.objeto_parametros = {
        id_Banco: 0,
        nombreBanco: '',
        estado: 1,
        usuario_creacion: auxiliarServices.getUserId(),
        usuario_edicion: auxiliarServices.getUserId()
    }
       

    $scope.clean = function () {
        $scope.objeto_parametros.id_Banco = 0;
        $scope.objeto_parametros.nombreBanco = '';
        $scope.objeto_parametros.estado = 1;
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
            $scope.objeto_parametros.estado = 1;
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
            $scope.objeto_parametros.estado = 0;
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

        $scope.objeto_parametros.id_Banco = obj.id_Banco;
        $scope.objeto_parametros.nombreBanco = obj.nombreBanco;
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
            $('#estado').val(String(obj.estado)).trigger('change.select2');
        }, 100); 
    }

    $scope.GuardarRegistro = function () {

        if (BancosServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }
       

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            $scope.loaderSave = true;
            BancosServices.save_banco($scope.objeto_parametros)
                .then(function (data) {
                    $scope.ListaBancos.push(data);
                    $scope.getBancos();
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
            BancosServices.update_banco($scope.objeto_parametros)
                .then(function (data) {
                if (data == "Ok") {
                    $scope.ListaBancos.push(data);
                    $scope.getBancos();
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
            text: 'Esta por anular',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                BancosServices.delete_banco(item.id_Banco)
                    .then(function (res) {
                        var index = $scope.ListaBancos.indexOf(item);
                        $scope.ListaBancos[index].estado = 0;
                   })
            }
        });
    }
     
    $scope.getAuditoria = function (item) {

        var fechaEdicion = auxiliarServices.formatDate(item.fecha_Edicion);
        var fechaCreacion = auxiliarServices.formatDate(item.fecha_Creacion);
        var usuedicion = "";
        var usucreacion = "";

        BancosServices.getAuditar(item.usuario_Edicion).then(function (data) {
            usuedicion = data[0].nombre_personal + " " + data[0].apellido_personal;
            BancosServices.getAuditar(item.usuario_Creacion).then(function (res) {
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