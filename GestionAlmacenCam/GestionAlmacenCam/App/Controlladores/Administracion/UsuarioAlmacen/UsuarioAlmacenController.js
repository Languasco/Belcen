var app = angular.module('appGestion.UsuarioAlmacenController', [])

app.controller('ctrlUsuarioAlmacen', function ($scope, loginServices, $location, $timeout, auxiliarServices, LocalesServices, UsuarioAlmacenServices) {
    

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        $scope.loader = true;
        auxiliarServices.changeTitle("Usuario Almacen");
        $scope.titleModal = "Usuario Almacen";
        $scope.loaderSave = false;
        $scope.get_Listando_Usuarios();
    }
    

    $scope.Lista_Usuarios = [];
    var oTable_user;
    $scope.get_Listando_Usuarios = function () { 
        $scope.loader = true;
        UsuarioAlmacenServices.get_Usuarios()
            .then(function (res) {
                $scope.Lista_Usuarios = res;
                $scope.loader = false;
                //$timeout(function () {
                //    auxiliarServices.initFooTable('tbl_usuarios', 'inputSearch_user');
                //}, 500)

                //if (oTable_user == null) {
                //    oTable_user = 'data';
                //    auxiliarServices.initFooTable('tbl_usuarios', 'inputSearch_user');
                //} else {
                //    ///---- limpiando el filtrooo en la ayuda ---
                //    $('#tbl_usuarios').trigger('footable_filter', {
                //        filter: $("#inputSearch_user").val()
                //    });
                //}
            }, function (err) {
                console.log(err);
            });     
    }
     
    $scope.Lista_Almacenes = [];
    $scope.Change_usuario_Almacen = function (check, usuario) {
        if (check == true) {
            $scope.loader = true;
            UsuarioAlmacenServices.get_Usuarios_Almacen(usuario)
                .then(function (res) {
                    $scope.Lista_Almacenes = res;
                    $scope.loader = false;
                    //$timeout(function () {
                    //    auxiliarServices.initFooTable('tbl_almacen', 'inputSearch_almacen');
                    //}, 500)
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

    function ListaMarcoCheck_Almacen() {
        var List_id = [];
        for (var i = 0; i < $scope.Lista_Almacenes.length; i++) {
            if ($scope.Lista_Almacenes[i].checkeado == true) {
                List_id.push($scope.Lista_Almacenes[i].id_Almacen)
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

    function MarcoCheck_Almacen() {
        var flag_marco = false;
        for (var i = 0; i < $scope.Lista_Almacenes.length; i++) {
            if ($scope.Lista_Almacenes[i].checkeado == true) {
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
 
        flag_marco_user = MarcoCheck_User();
        if (flag_marco_user == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Debe de seleccionar al menos un Usuario', 'error', '#ff6849', 1500);
            return;
        }

        flag_marco_almaceb = MarcoCheck_Almacen();
        if (flag_marco_almaceb == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Debe de seleccionar al menos un Almacen', 'error', '#ff6849', 1500);
            return;
        }
        
        list_User = ListaMarcoCheck();
        list_Almacen = ListaMarcoCheck_Almacen();
        $scope.loader = true;
        UsuarioAlmacenServices.set_save_user_Almacen(list_User.join(), list_Almacen.join(), auxiliarServices.getUserId())
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