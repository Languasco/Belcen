var app = angular.module('appGestion.accesosController', [])

app.controller('ctrlAccesosUsuarios', function ($scope, auxiliarServices, AccesosServices, UsuariosServices, $timeout) {
    var allPermissonUsuario = [];
    var allPermissonUsuarioByOption = [];
    $scope.showLoader = true;
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        auxiliarServices.changeTitle("Accesos de Usuario");
        $scope.getAllAccesos();
    }

    $scope.getAllAccesos = function () {
        var params = {
            option: 2,
            filters: '0'
        }
        AccesosServices.getAccesosUsuarios(params).then(function (res) {
            console.log(res);
            var dataTreewiew = []
            getListWeb = function (listWeb) {
                var listWebReturn = [];
                listWeb.forEach(function (item, index) {
                    allPermissonUsuario.push(item);
                    listWebReturn.push({
                        text: item.nombre_page,
                        icon: 'fa fa-file',
                        href: '#grandchild' + (index + 1),
                        tags: ['0'],
                        id: 'ok123' + (index + 1),
                        nodeId: '123ke'
                    })
                })
                return listWebReturn;
            };

            res.listPermisos.forEach(function (item, index) {
                allPermissonUsuario.push({
                    id_opcion: item.id_opcion,
                    nombre_page: item.page_principal
                });
                dataTreewiew.push({
                    text: item.page_principal,
                    href: '#parent' + (index + 1),
                    tags: ['0'],
                    nodes: getListWeb(item.listWeb),
                });
            });
            $('#treeViewAccesos').treeview({
                levels: 99,
                selectedBackColor: "#2c4d6dde",
                onhoverColor: "rgba(0, 0, 0, 0.05)",
                expandIcon: 'ti-plus',
                collapseIcon: 'ti-minus',
                nodeIcon: 'fa fa-folder',
                data: dataTreewiew
            });
            executeEventListener();
            $scope.getUsuarios();
        }, function (err) {
            console.log(err);
        })
    };

    $scope.listPermisosWeb = [
        { id: 0, value: 'IP', text: 'Imprimir los Reportes', check: false },
        { id: 1, value: 'ER', text: 'Exportar Reportes', check: false },
        { id: 2, value: 'AP', text: 'Auditoria de Procesos', check: false },
        { id: 3, value: 'AR', text: 'Agregar/Activar Registros', check: false },
        { id: 4, value: 'MR', text: 'Modificar Registros Existentes', check: false },
        { id: 5, value: 'ARE', text: 'Anular Registros Existentes', check: false },
        { id: 6, value: 'PD', text: 'Procesar Datos', check: false },
        
    ]
    executeEventListener = function () {
        document.getElementById("treeViewAccesos").addEventListener("click", functionClick);
    }

    $scope.getUsuarios = function () {
        UsuariosServices.getUsuarios().then(function (res) {
            if (res.ok == true) {
                if (res.data.length > 0) {
                    res.data.forEach(function (item, index) {
                        item['check'] = false;
                    });
                    $scope.listUsuarios = res.data;
                }
            }
            $timeout(function () {
                auxiliarServices.initFooTable('tblUsuarios');
                $scope.showLoader = false;
            }, 100)

        }, function (err) {
            console.log(err);
        })
    }
    $scope.loaderSearch = false;

    $scope.searchStr = '';
    $scope.$watch('searchStr', function (tmpStr) {
        if (!tmpStr || tmpStr.length == 0)
            return 0;
        $timeout(function () {

            // if searchStr is still the same..
            // go ahead and retrieve the data
            if (tmpStr === $scope.searchStr) {
                $scope.loaderSearch = true;
                UsuariosServices.search_UsuariosAcceso(tmpStr).then(function (res) {
                    $scope.loaderSearch = false;
                    $scope.listUsuarios = [];
                    if (res.ok == true) {
                        if (res.data.length > 0) {
                            res.data.forEach(function (item, index) {
                                item['check'] = false;
                            });
                            $scope.listUsuarios = res.data;
                        }
                    }
                    $timeout(function () {
                        auxiliarServices.initFooTable('tblUsuarios');
                        $scope.showLoader = false;
                    }, 100)

                }, function (err) { 
                        $scope.loaderSearch = false;
                })
            }
        }, 700);
    });

    var deschecked = function () {
        $scope.listUsuarios.forEach(function (item, index) {
            item.check = false;
        });
    }
    var idParentAux;
    var functionClick = function (e) {
        $scope.showLoader2 = true;
        var nomPage = e.target.innerText;
        if (e.target.innerText.length == 0) {
            return;
        };
        // BUSCAMOS EL ID DEL PERMISO FILTRANDO POR SU NOMBRE
        allPermissonUsuario.forEach(function (item, index) {

            if (item.nombre_page == nomPage) {

                idParentAux = item.id_opcion;
                return;
            }
        });

        var nameOption = e.target.innerText;
        var params = {
            option: 3,
            filters: idParentAux
        };
        // DESCHECKEA TODAS LAS OPCIONES
        deschecked();
        //
        AccesosServices.getAccesosUsuarios(params).then(function (res) {
            allPermissonUsuarioByOption = res;
            res.forEach(function (itemres) {
                $scope.listUsuarios.forEach(function (itemusu) {
                    if (itemusu.id_Usuario == itemres.id_Usuario) {
                        itemusu.check = true;
                    }
                });
            });
            $scope.showLoader2 = false;
        }, function (err) {
            console.log(err);
        })
    }
    var eventosAux;    
    var itemUserAux;
    $scope.openModal = function (itemUser) {
        itemUserAux = itemUser;
        eventosAux = null;        
        allPermissonUsuarioByOption.forEach(function (item) {
            if (idParentAux == item.id_Opcion && item.id_Usuario == itemUser.id_Usuario) {                
                eventosAux = item.eventos;
                return;
            } 
        });
        $scope.showBodyModal = false;
        $('#ModalPermisos').modal('show');
    };
    $('#ModalPermisos').on('shown.bs.modal', function (e) {
        $scope.listPermisosWeb.forEach(function (itemc) {
            itemc.check = false;
        })
        if (eventosAux != null) {
            eventosAux = eventosAux.split(',');            
            $scope.listPermisosWeb.forEach(function (item,index) {
                for (var i = 0; i < eventosAux.length; i++) {
                    if (eventosAux[i] == item.value) {
                        item.check = true;                        
                    }
                }
            });
            
        }
        $timeout(function () {
            $scope.showBodyModal = true;
        }, 500)

    });

    $scope.savePermisson = function () {
        $scope.loaderSave = true;
        $scope.disabledContent = "disabledContent";
        var idUsuario = itemUserAux.id_Usuario;
        var idOpcion = idParentAux;
        var newEventos = "";        
        $scope.listPermisosWeb.forEach(function (item) {
            if (item.check) {
                newEventos += item.value + ',';
            }
        });
        newEventos = newEventos.substring(0, newEventos.length - 1);
        
        var paramsSave = {
            option: 4,
            filters : idUsuario + '|' + idOpcion + '|' + newEventos,
        }
        AccesosServices.getAccesosUsuarios(paramsSave).then(function (res) {
            var params = {
                option: 3,
                filters: idParentAux
            };
            // DESCHECKEA TODAS LAS OPCIONES
            deschecked();
            //
            AccesosServices.getAccesosUsuarios(params).then(function (res) {
                allPermissonUsuarioByOption = res;
                res.forEach(function (itemres) {
                    $scope.listUsuarios.forEach(function (itemusu) {
                        if (itemusu.id_Usuario == itemres.id_Usuario) {
                            itemusu.check = true;
                        }
                    });
                });
                $timeout(function () {
                    $scope.loaderSave = false;
                    $scope.disabledContent = "";
                    let params = {
                        type: 'alert',
                        title: 'Excelente !',
                        text: 'Proceso de registro realizado correctamente !'
                    }
                    auxiliarServices.initSweetAlert(params).then(function (res) {

                        //resetInput();
                    });
                }, 500);
            }, function (err) {
                console.log(err);
            })
     
        }, function (err) {
            console.log(err);
        })
        
    }
    $scope.changeStatus = function (item) {
        console.log(item);
    }


})