var app = angular.module('appGestion.VehiculosController', [])

app.controller('CtrlVehiculo', function ($scope, loginServices, $location, $timeout, auxiliarServices, AuditarServices, VehiculoServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Vehiculos");
        $scope.titleModal = "Registro de Transportista";
        $scope.loaderSave = false;

        $scope.Get_ListVehiculos();
        $scope.get_listStatus();

        setTimeout(function () {
            $(".select_modal").select2();
            $scope.estados = '0';
            $('#cboestadoFilter').val(String('0')).trigger('change.select2');
        }, 200);


    }

    $scope.listStatus = [];
    $scope.get_listStatus = function () {
        $scope.listStatus.push(
            { id: 0, descripcion: '[ ----   Todos  --- ]' },
            { id: 1, descripcion: 'Activos' },
            { id: 2, descripcion: 'Anulados' }
            )
    }

    $scope.listVehiculos = [];
    $scope.Get_ListVehiculos = function()
    {
        $scope.loader = true;
        VehiculoServices.getVehiculo()
        .then(function (res) {
            $scope.listVehiculos = [];
            $scope.listVehiculos = res;
            $scope.loader = false;
            $timeout(function () {
                auxiliarServices.initFooTable('tbl_Vehiculo', 'inputSearch');
            }, 500)
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
                         '<h2  style="text-align:center;">' + ' Reporte Vehiculos' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tbl_Vehiculo'),
                     ctx = { worksheet: 'ReporteVehiculos', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReporteVehiculos.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }
    $scope.Flag_modoEdicion = false;

    $scope.objeto_parametros = {
        id_vehiculo: 0,
        vehiculo_Placa: '',
        marca_Vehiculo: '',
        modelo_Vehiculo: '',
        descripcion_vehiculo: '',
        estado: 1,
        usuario_Creacion: 1,
    }
       

    $scope.clean = function () {

        $scope.objeto_parametros.id_vehiculo = 0;
        $scope.objeto_parametros.vehiculo_Placa = '';
        $scope.objeto_parametros.marca_Vehiculo = '';
        $scope.objeto_parametros.modelo_Vehiculo = '';
        $scope.objeto_parametros.descripcion_vehiculo = '';
        $scope.objeto_parametros.estado =1;
        $scope.objeto_parametros.usuario_Creacion = 1;


        $('.selectModal').val("0").trigger('change.select2');
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
    $('#ModalVehiculos').on('shown.bs.modal', function (e) {
        $(".selectModal").select2();
        $timeout(function () {
            $scope.showBodyModal = true;
            $('#txtplaca_veh').focus();
        }, 500)

    });

    $scope.Open_New_Modal = function () {
        $scope.clean();
        $scope.Flag_modoEdicion = false;
        $('#ModalVehiculos').modal('show');
    }
    
    $scope.Open_Update_Modal = function (obj) {
        $scope.clean();
        $scope.Flag_modoEdicion = true;        
       
        $scope.EdicionRegistros(obj);
        $('#ModalVehiculos').modal('show');
 
    }

    $scope.validarPlacaVehiculo = function () {
        var result = false;
        $scope.listVehiculos.forEach(function (item, index) {
            if (item.vehiculo_Placa == $scope.objeto_parametros.vehiculo_Placa) {
                result = true;
            }
        })
        return result;
    }

   
    $scope.EdicionRegistros = function (obj) {
        $scope.loaderProd = true;
        $scope.Flag_modoEdicion = true;
        $scope.objeto_parametros.id_vehiculo = obj.id_vehiculo;
        $scope.objeto_parametros.vehiculo_Placa = obj.vehiculo_Placa;
        $scope.objeto_parametros.marca_Vehiculo = obj.marca_Vehiculo;
        $scope.objeto_parametros.modelo_Vehiculo = obj.modelo_Vehiculo;
        $scope.objeto_parametros.descripcion_vehiculo = obj.descripcion_vehiculo;
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

    }

    $scope.GuardarRegistro = function () {

        if (VehiculoServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }
        
        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;

        if ($scope.Flag_modoEdicion == false) { // nuevo registroo

            if ($scope.validarPlacaVehiculo() == true) {
                auxiliarServices.NotificationMessage('Sistemas', 'Placa ingresado del vehiculo ya existe, Vuelva a Ingresar', 'error', '#ff6849', 1800);
                return;

            }
            $scope.loaderSave = true;
            VehiculoServices.save_vehiculos($scope.objeto_parametros)
            .then(function (data) {
                $scope.listVehiculos.push(data);
                $scope.Get_ListVehiculos();
                $timeout(function () {
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de Registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {
                        $('#ModalVehiculos').modal('hide');
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
            VehiculoServices.update_vehiculos($scope.objeto_parametros)
            .then(function (data) {
                if (data == "Ok") {
                    $scope.listVehiculos.push(data);
                    $scope.Get_ListVehiculos();
                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Actualizacion realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params)
                            .then(function (res) {
                                $('#ModalVehiculos').modal('hide');
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
                            $('#ModalVehiculos').modal('hide');
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
            text: 'Esta por anular un Vehiculo',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res==true) {
                VehiculoServices.anular_vehiculos(item.id_vehiculo)
                   .then(function (res) {
                       var index = $scope.listVehiculos.indexOf(item);
                       $scope.listVehiculos[index].estado = 0;
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
        var addrow = $("#tbl_Vehiculo")
        $("#tbl_Vehiculo").footable();

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
    

    $scope.Validationletter = function (event) {

        let keyCode = (event.keyCode ? event.keyCode : event.which);
        if (!(keyCode < 48 || keyCode > 57)) {

            event.preventDefault();
            auxiliarServices.NotificationMessage('Alerta..!', 'El Sistema solo Permite Ingreso de Letras...!', 'error', '#ff6849', 1500);
        }

    };

    $scope.ValidateEnterM = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtmarca_veh').focus();
        }
    }

    $scope.ValidateEnterMo = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtmodelo_veh').focus();
        }
    }

    $scope.ValidateEnterD = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $('#txtdescr_veh').focus();
        }
    }

   
   
})