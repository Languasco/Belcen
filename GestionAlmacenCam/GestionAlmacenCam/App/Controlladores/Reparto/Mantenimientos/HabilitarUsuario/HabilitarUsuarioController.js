var app = angular.module('appGestion.HabilitarUsuarioController', [])
app.controller('CtrlHabilitarUsuario', function ($scope, $location, $timeout, auxiliarServices, HabilitarUsuarioServices ) {    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2); 
        auxiliarServices.changeTitle("Habilitar Usuario");
        $scope.titleModal = "Habilitar Usuario";
        $scope.loaderSave = false; 
 

 
    } 
    
    $('document').ready(function () {
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy'
            });
        }, 500);

 

    });
    
    $scope.Objeto_ParametroFiltro = {
        opcion: '1',
        id_login : '0',
        login: '',
        descripcion_login : ''
    };         
         
    $scope.buscarLogin = function () {
        if ($scope.Objeto_ParametroFiltro.login == 0 || $scope.Objeto_ParametroFiltro.login == '0' || $scope.Objeto_ParametroFiltro.login == null || $scope.Objeto_ParametroFiltro.login == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el login a buscar ', 'error', '#ff6849', 2000);
            return;
        }

        $scope.loaderfiltros = true;
        HabilitarUsuarioServices.get_buscarLogin($scope.Objeto_ParametroFiltro.opcion, $scope.Objeto_ParametroFiltro.login ,  auxiliarServices.getUserId())
            .then(function (res) {              
                $scope.loaderfiltros = false;
                console.log(res);

                if (res.ok == true) {

                    if (res.data.length > 0) {
                        const { id_login, descripcion_login } = res.data[0];

                        $scope.Objeto_ParametroFiltro.id_login = id_login;
                        $scope.Objeto_ParametroFiltro.descripcion_login = descripcion_login;
                    } else {

                        $scope.Objeto_ParametroFiltro.id_login = '0';
                        $scope.Objeto_ParametroFiltro.descripcion_login = 'No existe informacion con el login ingresado..'
                    }      

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', res.data , 2000);
                    return;
                }

        


            }, function (err) {
                console.log(err);
            });
    };
    
    $scope.activarUsuario = function () {
        if ($scope.Objeto_ParametroFiltro.login == 0 || $scope.Objeto_ParametroFiltro.login == '0' || $scope.Objeto_ParametroFiltro.login == null || $scope.Objeto_ParametroFiltro.login == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el login a buscar ', 'error', '#ff6849', 2000);
            return;
        }

        if ($scope.Objeto_ParametroFiltro.id_login == 0 || $scope.Objeto_ParametroFiltro.id_login == '0' || $scope.Objeto_ParametroFiltro.id_login == null || $scope.Objeto_ParametroFiltro.id_login == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione el boton Buscar.. ', 'error', '#ff6849', 2000);
            return;
        }


        $scope.loaderfiltros = true;
        HabilitarUsuarioServices.get_activarUsuario($scope.Objeto_ParametroFiltro.opcion, $scope.Objeto_ParametroFiltro.id_login, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderfiltros = false;
                console.log(res);

                if (res.ok == true) {


                    $scope.Objeto_ParametroFiltro = {
                        opcion: '1',
                        id_login: '0',
                        login: '',
                        descripcion_login: ''
                    };


                    $timeout(function () {
                        $scope.loaderSave = false;
                        $scope.disabledContent = "";
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {

                            //resetInput();
                        });
                    }, 500);


                } else {
                    auxiliarServices.NotificationMessage('Sistemas', res.data, 2000);
                    return;
                }




            }, function (err) {
                console.log(err);
            });
    };

     

     
})