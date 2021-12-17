var app = angular.module('appGestion.loginController', []);

app.controller('ctrlLogin', function ($scope, auxiliarServices, loginServices, $location, $timeout) {

    $(document).ready(function () {
        auxiliarServices.menuHideShow(2);
    });
    // VALIDAMOS SI EXISTE UN USUARIO LOGEADO
    var resultValidacion = auxiliarServices.validateUserLog();

    //let socket = io.connect('http://192.168.0.6:3000', { secure: true });

    //var conectarSocket = () => {
    //    return socket.on('connect', function () {
    //        console.log('Conectado al servidor desde web');
    //    });
    //};

    //var desconectarSocket = () => {
    //    // escuchar
    //    return socket.on('disconnect', function () {
    //        console.log('Perdimos conexión con el servidor');
    //    });
    //};


    //var RecibiendoNotificacionServidor = () => {
    //    // Escuchar información
    //    return socket.on('NotificacionSesion', (data) => {
    //         console.log(data)
    //    })
    //};

    //var RecibiendoMensajes = () => {
    //    // Escuchar información
    //    return socket.on('mensaje', (data, callback) => {
    //        console.log(data)
    //    })
    //};
     

    //conectarSocket();
    //desconectarSocket();
    //RecibiendoNotificacionServidor();
    //RecibiendoMensajes();
 
    if (resultValidacion) {
        $location.path('/Home');
        return;
    }


    var header = document.getElementById('HeaderPage');
    var menu = document.getElementById('side-menu');
    header.style.display = "none";
    menu.style.display = "none";
    $scope.paramsSesion = {
        usuario: '',
        pass: ''
    };
    $scope.paramsLoad = {
        showLoader: false
    };
    var template = $location.$$path;
    $scope.IniciarSesion = function () {
 
        $scope.paramsLoad.showLoader = true;
        var params = {
            option: 1,
            filters: $scope.paramsSesion.usuario + '|' + $scope.paramsSesion.pass
        };
        loginServices.initSession(params)
            .then(function (res) { 
                if (res.ok == true) {
                        $timeout(function () {
                            // HABILITAMOS MENU Y HEADER
                            header.style.display = "";
                            menu.style.display = "";
                            $location.path('/Home');
                            auxiliarServices.saveUserPermission(res.data);
                            auxiliarServices.changeNameUser();
                        }, 1000);
                } else  {
                    $scope.paramsLoad.showLoader = false;
                    $.toast({
                        heading: 'Sistemas',
                        text: res.data,
                        position: 'top-right',
                        loaderBg: '#008efa',
                        icon: 'error',
                        hideAfter: 3500,
                        stack: 6
                    });
                }

        }, function (err) {
            $timeout(function () {
                console.log(err);
                $scope.paramsLoad.showLoader = false;
                $.toast({
                    heading: 'Error al iniciar sesión',
                    text: 'Ocurrio un problema con la conexion, volver a intentar !!',
                    position: 'top-right',
                    loaderBg: '#008efa',
                    icon: 'error',
                    hideAfter: 3500,
                    stack: 6
                });
            }, 2000);

            });             
    };


    $scope.retrieveEmail = '';
    $scope.openModal_recuperarPassword = function () {
        $('#modalRecuperar').modal('show');
        $scope.retrieveEmail = '';
    }

    $scope.set_recuperarPassword_Email = function () {

        if ($scope.retrieveEmail.trim() == '') {
            $.toast({
                heading: 'Sistemas',
                text: 'Tiene que ingresar el correo con el que se Registro en el sistema',
                position: 'top-right',
                loaderBg: '#008efa',
                icon: 'error',
                hideAfter: 3500,
                stack: 6
            });
            return 
        }

        var params = {
            title: "Sistemas",
            text: 'Esta por enviar ? .',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
 
                $scope.loaderSaveD = true;
                loginServices.set_recuperarPassword_Email($scope.retrieveEmail.trim())
                    .then(function (res) {

                        if (res.ok == true) {
                            $scope.loaderSaveD = false;
                            $('#modalRecuperar').modal('hide');
                            $timeout(function () {
                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Correo enviado correctamente !'
                                }
                                auxiliarServices.initSweetAlert(params).then(function (res) {
                                });

                            }, 500)

                        } else {
                            $scope.loaderSaveD = false; 
                            alert(JSON.stringify(res.data));
                        }
                    }, function (error) {
                        $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                        $scope.loaderSaveD = false;
                        console.log(error)
                    })
            }
        });




    }










});