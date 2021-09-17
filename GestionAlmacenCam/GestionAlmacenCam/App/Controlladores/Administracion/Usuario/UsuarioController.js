var app = angular.module('appGestion.UsuarioController', [])

app.controller('UsuarioController', function ($scope, loginServices, $location, $timeout, auxiliarServices, UsuarioServices, CargoServices, PerfilServices) {

    $('document').ready(function () {
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy',
            });
        }, 500);
    });

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;
        auxiliarServices.changeTitle("Matenimiento de Usuario");
        $scope.titleModal = "Registro de Usuario";
        $scope.disabledContent = "";
        $scope.loaderSave = false;

        setTimeout(function () {
            $(".select_modal").select2();
        },0);
        
        $scope.get_listStatus();
        $scope.get_ListandoUsuarios();
    }

    $scope.Objeto_ParametroFiltro = {
        id_estado : 0
    }

    $scope.listStatus = [];
    $scope.get_listStatus = function () {
        $scope.listStatus.push(
            { id: -1, descripcion: '[ ----   Todos  --- ]' },
            { id: 1, descripcion: 'Activos' },
            { id: 2, descripcion: 'Anulados' }
        )
        $scope.Objeto_ParametroFiltro.id_estado= '1';
        setTimeout(function () {
           $('#cboestadoFilter').val(String('1')).trigger('change.select2');
        }, 100);

    }
       
    $scope.Lista_Usuarios = [];
    $scope.get_ListandoUsuarios = function () {
        $scope.loader = true;
        UsuarioServices.getUsuarios($scope.Objeto_ParametroFiltro.id_estado)
            .then(function (res) {
                $scope.loader = false;
                $scope.Lista_Usuarios = [];

                if (res.ok == true) {
                    $scope.Lista_Usuarios = res.data;
                    $timeout(function () {
                        auxiliarServices.initFooTable('tbl_usuario', 'inputSearch');
                    }, 500)
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
        }, function (err) {
            console.log(err);
        })
    }
     
    $scope.Lista_TipoPersonal = [];
    $scope.get_Listando_TipoPersonal = function () {
        $scope.Lista_TipoPersonal.push({
            id: '1',
            des: 'PROPIO'
        })
        $scope.Lista_TipoPersonal.push({
            id: '2',
            des: 'CONTRATA'
        })
    }
    $scope.get_Listando_TipoPersonal();


    $scope.Lista_Cargo = [];
    $scope.get_ListandoCargos = function () {
        $scope.loader = true;
        CargoServices.getCargos().then(function (data) {
            $scope.loader = false;
            $scope.Lista_Cargo = [];
            $scope.Lista_Cargo = data;
        }, function (err) {
            console.log(err);
        })
    }
    $scope.get_ListandoCargos();

    $scope.Lista_Perfil = [];
    $scope.get_ListandoPerfiles = function () {
        $scope.loader = true;
        PerfilServices.getPerfiles().then(function (data) {
            $scope.loader = false;
            $scope.Lista_Perfil = [];
            $scope.Lista_Perfil = data; 
        }, function (err) {
            console.log(err);
        })
    }
    $scope.get_ListandoPerfiles();

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
                         '<h2  style="text-align:center;">' + ' Reporte Personal ' + '</h2>' +
                         //<p  style="text-align:center; font-size: 17px;">Desde : ' + txtFechaDesde + ' Hasta : ' + txtFechaHasta + ' </p>' +
                         '<table>{table}</table>' +
                         '</body>' +
                         '</html>',

            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },
              format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

        var table = $('#tbl_usuario'),
                     ctx = { worksheet: 'ReportePersonal', table: table.html() };

        var link = document.createElement("a");
        link.download = "ReportePersonal.xls";
        link.href = uri + base64(format(template, ctx));
        link.click()

    }


    $scope.Flag_modoEdicion = false;

    $scope.objeto_parametros = {
        id_Usuario: '0',
        nrodoc_usuario: '',
        apellidos_usuario: '',
        nombres_usuario: '',
        email_usuario: '',
        Adm_Usuario: 'Ad',
        Sys_Usuario: 'Sy',
        id_Cargo: '0',
        id_Area: '0',
        tipo_usuario: '0',
        id_Empresa_Pertenece: '1',
        login_usuario: '',
        contrasenia_usuario: '',
        id_Perfil: '0',
        estado: '0',
        Acceso_Movil_Tipo: 'S', 
        usuario_creacion: '0',
    }
       

    $scope.clean = function () {
        var nroDoc_personal = document.getElementById('nroDoc_personal')

        $scope.objeto_parametros.id_Usuario = '0';
        $scope.objeto_parametros.nrodoc_usuario = '',
        $scope.objeto_parametros.apellidos_usuario = '',
        $scope.objeto_parametros.nombres_usuario = '',
        $scope.objeto_parametros.email_usuario = '',
        $scope.objeto_parametros.Adm_Usuario = 'Ad';
        $scope.objeto_parametros.Sys_Usuario = 'Sy';
        $scope.objeto_parametros.id_Cargo = '0';
        $scope.objeto_parametros.id_Area = '0';
        $scope.objeto_parametros.tipo_usuario = '0';
        $scope.objeto_parametros.id_Empresa_Pertenece = '1';
        $scope.objeto_parametros.login_usuario = '',
        $scope.objeto_parametros.contrasenia_usuario = '',
        $scope.objeto_parametros.id_Perfil = '0';
        $scope.objeto_parametros.Acceso_Movil_Tipo = 'S';

        $scope.objeto_parametros.estado =1;
        $scope.objeto_parametros.usuario_creacion = auxiliarServices.getUserId();

        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';

        $scope.objEstados_Envio.activo = true;
        $scope.objEstados_Envio.text = 'SI';
        $scope.objEstados_Envio.colorText = '#2c5ca9';

        setTimeout(function () {
            nroDoc_personal.disabled = false;
            $('.select_modal').val("0").trigger('change.select2');
        }, 100);
    }

    $scope.objEstados = {
        activo: true,
        text: 'Activo',
        colorText: '#2c5ca9'
    }

    $scope.changeStatus = function (status) {
        if (status) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = "ACTIVO";
            $scope.objEstados.colorText = "#2c5ca9";
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "INACTIVO";
            $scope.objEstados.colorText = "#b3192c";
        }
    }

    $scope.objEstados_Envio = {
        activo: true,
        text: 'SI',
        colorText: '#2c5ca9'
    }

    $scope.changeStatus_Envio = function (status) {
        if (status) {
            $scope.objEstados_Envio.activo = true;
            $scope.objEstados_Envio.text = "SI";
            $scope.objEstados_Envio.colorText = "#2c5ca9";
        } else {
            $scope.objEstados_Envio.activo = false;
            $scope.objEstados_Envio.text = "NO";
            $scope.objEstados_Envio.colorText = "#b3192c";
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

    var objAux;

    $scope.EdicionRegistros = function (obj) {

       objAux = '';
        objAux = obj;
        var nroDoc_personal = document.getElementById('nroDoc_personal')

        $scope.objeto_parametros.id_Usuario = obj.id_Usuario;
        $scope.objeto_parametros.nrodoc_usuario = obj.nrodoc_usuario;
        $scope.objeto_parametros.apellidos_usuario = obj.apellidos_usuario;
        $scope.objeto_parametros.nombres_usuario = obj.nombres_usuario;
        $scope.objeto_parametros.email_usuario = obj.email_usuario;

        $scope.objeto_parametros.Adm_Usuario = 'Ad';
        $scope.objeto_parametros.Sys_Usuario = 'Sy';
        $scope.objeto_parametros.id_Cargo = obj.id_Cargo;
        $scope.objeto_parametros.id_Area = obj.id_Area;
        $scope.objeto_parametros.tipo_usuario = obj.tipo_usuario;
        $scope.objeto_parametros.id_Empresa_Pertenece = '1';

        $scope.objeto_parametros.login_usuario = obj.login_usuario;
        $scope.objeto_parametros.contrasenia_usuario = obj.contrasenia_usuario;
        $scope.objeto_parametros.id_Perfil = obj.id_Perfil;
        $scope.objeto_parametros.Acceso_Movil_Tipo = 'S';
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

        if (obj.envio_enlinea_personal == 'SI') {
            $scope.objEstados_Envio.activo = true;
            $scope.objEstados_Envio.text = 'SI';
            $scope.objEstados_Envio.colorText = '#2c5ca9';
        } else {
            $scope.objEstados_Envio.activo = false;
            $scope.objEstados_Envio.text = "NO";
            $scope.objEstados_Envio.colorText = "#b3192c";
        }

        setTimeout(function () {
            nroDoc_personal.disabled = true;
            $('#cbo_id_cargo_personal').val(String(obj.id_Cargo)).trigger('change.select2');
            $('#cbo_tip_usuario').val(String(obj.tipo_usuario)).trigger('change.select2');
            $('#cbo_id_perfil').val(String(obj.id_Perfil)).trigger('change.select2');
        }, 100); 
    }

    $scope.GuardarRegistro = function () {
        if (UsuarioServices.ValidacionGeneral($scope.objeto_parametros) == false) {
            return;
        }

        $scope.objeto_parametros.estado = $scope.objEstados.activo == true ? 1 : 0;
        $scope.objeto_parametros.envio_enlinea_personal = $scope.objEstados_Envio.activo == true ? 'SI' : 'NO';
        
        if ($scope.Flag_modoEdicion == false) { // nuevo registroo
            //---validando que el codigo sea unico---
            if (ValidarCodigo($scope.objeto_parametros.nrodoc_usuario) == true) {
                auxiliarServices.NotificationMessage('Sistemas', 'El Nro de Documento ya se agregó, verifique', 'error', '#ff6849',2000);
                return;
            }
            $scope.loaderSave = true;
            UsuarioServices.save_usuario($scope.objeto_parametros)
            .then(function (data) {
 
            }, function (error) {
 
            })

        } else {  //actualizar

            $scope.loaderSave = true;
            UsuarioServices.update_usuario($scope.objeto_parametros)
            .then(function (data) {
                 
            }, function (error) {
                console.log(error);
            })

        }
    }
    
    function ValidarCodigo(nro_doc) {
        var estado = false;
        for (var i = 0; i < $scope.Lista_Usuarios.length; i++) {
            if (nro_doc == $scope.Lista_Usuarios[i].nrodoc_usuario) {
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
            text: 'Esta por anular el usuario.',
            type: 'warning',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res==true) {
                UsuarioServices.anular_Personal(item.id_personal)
                   .then(function (res) {
                       var index = $scope.Lista_Usuarios.indexOf(item);
                       $scope.Lista_Usuarios[index].estado = 0;
                   })
            }
        });
    }
 
})