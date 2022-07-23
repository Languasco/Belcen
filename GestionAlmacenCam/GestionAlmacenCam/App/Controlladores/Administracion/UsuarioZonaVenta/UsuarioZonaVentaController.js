var app = angular.module('appGestion.UsuarioZonaVentaController', [])

app.controller('UsuarioZonaVentaController', function ($scope, $location,  auxiliarServices, LocalesServices, UsuarioZonaVentaServices) {
    

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Usuario Zona Venta");
        $scope.titleModal = "Usuario Zona de venta ";
        $scope.loaderSave = false;

        setTimeout(function () {
            $(".selectFiltros").select2();
        }, 100);

        $scope.get_Listando_Usuarios();
    }

    $scope.Objeto_Parametro_Filtro = {
        idLocal: "0",
        idUsuario: 0
    };
    
    $scope.Lista_Usuarios = [];
    $scope.get_Listando_Usuarios = function () { 
        $scope.loader = true;
        UsuarioZonaVentaServices.get_Usuarios()
            .then(function (res) {
                $scope.Lista_Usuarios = res;
                $scope.loader = false;
            }, function (err) {
                console.log(err);
            });     
    }

    $scope.listLocales = [];
    $scope.getLocales = function () {
        $scope.loader = true;
        LocalesServices.get_Locales_Usuario($scope.id_usuario_Global)
            .then(function (data) {
                $scope.loader = false;
                $scope.listLocales = [];
                $scope.listLocales = data;
                setTimeout(function () {
                    $('#selectLocales').val("0").trigger('change.select2');
                }, 0);

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            });
    };
    $scope.getLocales();

         

    $scope.Change_usuario = function (check, usuario) {
        if (check == true) {
            $scope.Objeto_Parametro_Filtro.idUsuario = usuario;
        } else {
            $scope.Objeto_Parametro_Filtro.idUsuario = 0;
        }
    }   


    $scope.lista_zonasUsuarios = [];
    $scope.Change_local_zona = function (idLocal) {

        if (idLocal == '0' || idLocal == 0) {
            $scope.lista_zonasUsuarios = [];
            return 
        }

        if ($scope.Objeto_Parametro_Filtro.idUsuario == '0' || $scope.Objeto_Parametro_Filtro.idUsuario == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor primero seleccione el Usuario', 'error', '#008000', 5000);
            $scope.Objeto_Parametro_Filtro.idLocal = "0";

            setTimeout(function () {
                $('#selectLocales').val("0").trigger('change.select2');
            }, 0);

            return;
        }
 
        $scope.loader = true;
        UsuarioZonaVentaServices.get_Usuarios_localZonas($scope.Objeto_Parametro_Filtro.idUsuario, $scope.Objeto_Parametro_Filtro.idLocal  )
        .then(function (res) {
            $scope.lista_zonasUsuarios = res;
            $scope.loader = false;
        }, function (err) {
            console.log(err);
        });
 
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

    function ListaMarcoCheck_zonas() {
        var List_id = [];
        for (var i = 0; i < $scope.lista_zonasUsuarios.length; i++) {
            if ($scope.lista_zonasUsuarios[i].checkeado == true) {
                List_id.push($scope.lista_zonasUsuarios[i].id_ZonaVta)
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

    function MarcoCheck_zona() {
        var flag_marco = false;
        for (var i = 0; i < $scope.lista_zonasUsuarios.length; i++) {
            if ($scope.lista_zonasUsuarios[i].checkeado == true) {
                flag_marco = true;
                break;
            }
        }
        return flag_marco;
    }


    $scope.guardar_informacion = function () {
        var list_User = [];
        var list_Almacen = [];
        var flag_marco_user = false;
        var flag_marco_almaceb = false;


        if ($scope.Objeto_Parametro_Filtro.idLocal == '0' || $scope.Objeto_Parametro_Filtro.idLocal == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Local ', 'error', '#008000', 5000);
            return;
        }

 
        flag_marco_user = MarcoCheck_User();
        if (flag_marco_user == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Debe de seleccionar al menos un Usuario', 'error', '#ff6849', 1500);
            return;
        }

        flag_marco_almaceb = MarcoCheck_zona();
        if (flag_marco_almaceb == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Debe de seleccionar al menos una Zona de Venta', 'error', '#ff6849', 1500);
            return;
        }
        
        list_User = ListaMarcoCheck();
        list_zonas = ListaMarcoCheck_zonas();

        $scope.loader = true;
        UsuarioZonaVentaServices.set_save_user_zonas(list_User.join(), list_zonas.join(), auxiliarServices.getUserId(), $scope.Objeto_Parametro_Filtro.idLocal  )
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

    $scope.doSearch = function (tipo) {

        let tableReg = null;
        let searchText = null;

        if (tipo =='usuario') {
              tableReg = document.getElementById('tbl_usuarios');
              searchText = document.getElementById('inputSearch_user').value.toLowerCase();
        }
        if (tipo == 'almacen') {
              tableReg = document.getElementById('tbl_almacen');
              searchText = document.getElementById('inputSearch_almacen').value.toLowerCase();
        }


        for (var i = 1; i < tableReg.rows.length; i++) {
            var cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
            var found = false;
            for (var j = 0; j < cellsOfRow.length && !found; j++) {
                var compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1)) {
                    found = true;
                }
            }
            if (found) {
                tableReg.rows[i].style.display = '';
            } else {
                tableReg.rows[i].style.display = 'none';
            }
        }
    }

        
})