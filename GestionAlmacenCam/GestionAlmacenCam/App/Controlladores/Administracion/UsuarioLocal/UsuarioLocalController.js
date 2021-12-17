var app = angular.module('appGestion.UsuarioLocalController', [])

app.controller('ctrlUsuarioLocal', function ($scope, loginServices, $location, $timeout, auxiliarServices, LocalesServices, UsuarioLocalServices) {
    

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
 

        $scope.loader = true;
        auxiliarServices.changeTitle("Usuario Local");
        $scope.titleModal = "Usuario Local";
        $scope.loaderSave = false;
        $scope.get_Listando_Usuarios();
    }
    

    $scope.Lista_Usuarios = [];
    $scope.get_Listando_Usuarios = function () { 
        $scope.loader = true;
        UsuarioLocalServices.get_Usuarios()
            .then(function (res) {
                $scope.Lista_Usuarios = res;
                $scope.loader = false;
                $timeout(function () {
                    auxiliarServices.initFooTable('tbl_usuarios', 'inputSearch_user');
                }, 500)
            }, function (err) {
                console.log(err);
            });     
    }
     
    $scope.Lista_Locales = [];
    $scope.Change_usuario_Locales = function (check, usuario) {      
        if (check == true) {
            $scope.loader = true;
            UsuarioLocalServices.get_Usuarios_Locales(usuario)
                .then(function (res) {
                    $scope.Lista_Locales = res;
                    $scope.loader = false;
                    $timeout(function () {
                        auxiliarServices.initFooTable('tbl_locales', 'inputSearch_locales');
                    }, 500)
                }, function (err) {
                    console.log(err);
                });
        } 
    }   
       


    function ListaMarcoCheck() {
        var List_id = [];
        for (var i = 0; i < $scope.Lista_Usuarios.length; i++) {
            if ($scope.Lista_Usuarios[i].checkeado == true) {
                List_id.push($scope.Lista_Usuarios[i].id_Usuario)
            }

        }
        return List_id;
    }

    function ListaMarcoCheck_Local() {
        var List_id = [];
        for (var i = 0; i < $scope.Lista_Locales.length; i++) {
            if ($scope.Lista_Locales[i].checkeado == true) {
                List_id.push($scope.Lista_Locales[i].id_Local)
            }

        }
        return List_id;
    }

    function MarcoCheck_User() {
        var flag_marco = false;
        for (var i = 0; i < $scope.Lista_Usuarios.length; i++) {
            if ($scope.Lista_Usuarios[i].checkeado == true) {
                flag_marco = true;
                break;
            }
        }
        return flag_marco;
    }

    function MarcoCheck_Local() {
        var flag_marco = false;
        for (var i = 0; i < $scope.Lista_Locales.length; i++) {
            if ($scope.Lista_Locales[i].checkeado == true) {
                flag_marco = true;
                break;
            }
        }
        return flag_marco;
    }


    $scope.guardar_informacion = function () {
        var list_User = [];
        var list_Local = [];
        var flag_marco_user = false;
        var flag_marco_local = false;
 
        flag_marco_user = MarcoCheck_User();
        if (flag_marco_user == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Debe de seleccionar al menos un Usuario', 'error', '#ff6849', 1500);
            return;
        }

        flag_marco_local = MarcoCheck_Local();
        if (flag_marco_local == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Debe de seleccionar al menos un Local', 'error', '#ff6849', 1500);
            return;
        }
        
        list_User = ListaMarcoCheck();
        list_Local = ListaMarcoCheck_Local();
        $scope.loader = true;
        UsuarioLocalServices.set_save_user_local(list_User.join(),  list_Local.join() , auxiliarServices.getUserId())
        .then(function (data) {
            $scope.loader = false;
            if (data == 'OK' || data == '"OK"') {
                let params = {
                    type: 'alert',
                    title: 'Excelente !',
                    text: 'Se realizó Correctamente la Operación !'
                }
                auxiliarServices.initSweetAlert(params).then(function (res) {

                });
            } else {
                alert(data);
            }
        }, function (error) {
            console.log(error)
        })

    }

        
})