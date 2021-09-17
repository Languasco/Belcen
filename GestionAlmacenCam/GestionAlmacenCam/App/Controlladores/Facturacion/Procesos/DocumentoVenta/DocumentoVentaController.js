var app = angular.module('appGestion.DocumentoVentaController', [])
app.controller('ctrlDocumentoVenta', function ($scope, loginServices, $location, $timeout, auxiliarServices, DocumentoVentaServices, EstadosServices, TipoDocumentoServices, PuntoVentaServices) {
    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

 
        auxiliarServices.changeTitle("Generacion de Documento de Venta");
        $scope.titleModal = "Generacion de Documento de Venta";
        $scope.disabledContent = "";
        $scope.loaderSave = false;
        $scope.get_ListandoPuntoVenta();
    }


    $scope.Objeto_ParametroFiltro = {
        puntoventa: 0,
        vendedor: 0,
        documVenta: 0,
        estado: 0
    }

    $scope.Lista_PuntoVenta = [];
    $scope.get_ListandoPuntoVenta = function () {
        $scope.loaderSave = true;
        PuntoVentaServices.getPuntoVenta()
            .then(function (data) {
            $scope.loaderSave = false;
            $scope.Lista_PuntoVenta = [];
            $scope.Lista_PuntoVenta = data;
            $scope.get_ListandoVendedores();
        }, function (err) {
            console.log(err);
        })
    }

    $scope.Lista_Vendedor = [];
    $scope.get_ListandoVendedores = function () {
        $scope.loaderSave = true;
        DocumentoVentaServices.get_Vendedores().then(function (data) {
            $scope.loaderSave = false;
            $scope.Lista_Vendedor = [];
            $scope.Lista_Vendedor = data;
            $scope.get_ListandoDocumentoVenta();
        }, function (err) {
            console.log(err);
        })
    }

    $scope.Lista_TipoDocumento = [];
    $scope.get_ListandoDocumentoVenta = function () {
        $scope.loaderSave = true;
        TipoDocumentoServices.getTipoDocumento().then(function (data) {
            $scope.loaderSave = false;
            var list = [];
            data.forEach(function (item, index) {
                
                if (item.id_TipoDocumento == 1 || item.id_TipoDocumento == 2 || item.id_TipoDocumento == 7) {
                    list.push(item);
                }
            })
            $scope.Lista_TipoDocumento = [];
            $scope.Lista_TipoDocumento = list;

            $scope.get_ListandoEstados();

        }, function (err) {
            console.log(err);
        })
    }

    $scope.Lista_Estados = [];
    $scope.get_ListandoEstados = function () {
        $scope.loaderSave = true;
        EstadosServices.getEstados().then(function (data) {
            $scope.loaderSave = false;
            var listE = [];
            data.forEach(function (item, index) {
                if (item.id_Estado == 7 || item.id_Estado == 8) {
                    listE.push(item);
                }
            })
            $scope.Lista_Estados = [];
            $scope.Lista_Estados = listE;

            setTimeout(function () {
                $(".selectFiltros").select2();
                $('#cbo_puntoventa').val("0").trigger('change.select2');
                $('#cbo_vendedor').val("0").trigger('change.select2');
                $('#cbo_docVenta').val("0").trigger('change.select2');
                $('#cbo_estado').val("0").trigger('change.select2');
            }, 500);


        }, function (err) {
            console.log(err);
        })
    }


    //Lista los Pedidos
    var oTable;
    $scope.List_Pedidos = [];
    $scope.Listando_Pedidos = function () {

        if (DocumentoVentaServices.validate($scope.Objeto_ParametroFiltro) == false) {
            return false;
        }
        $scope.loaderSave = true;
        $scope.checkedAll = false;
        DocumentoVentaServices.getListaPedido($scope.Objeto_ParametroFiltro).then(function (data) {

            $scope.List_Pedidos = [];
            $scope.List_Pedidos = data;
            $timeout(function () {
                $scope.loaderSave = false;
                if (oTable == null) {
                    oTable = 'data'
                    auxiliarServices.initFooTable('tablaDocVenta', 'inputSearch');
                } else {
                    $('#tablaDocVenta').trigger('footable_initialize');
                }
            }, 1000)
        })
    }

    //METODO PARA CHEKED ALL
    $scope.checkedAll = false;
    $scope.checkedAll_ListaPedidos = function (checked) {      
        if (checked) {
            angular.forEach($scope.List_Pedidos, function (child) {
                if (child.disabled == true) {
                    child.checkeado = false;
                } else {
                    child.checkeado = true;
                }      
            })
        } else {
            angular.forEach($scope.List_Pedidos, function (child) {         
                child.checkeado = false;         
            })
        }        
    }

    //obteniendo todos los chekeados
    function ListaMarcoCheck() {
        var List_id = [];
        for (var i = 0; i < $scope.List_Pedidos.length; i++) {
            if ($scope.List_Pedidos[i].checkeado == true) {
                List_id.push($scope.List_Pedidos[i].id_Pedido_Cab)
            }

        }
        return List_id;
    }

    function MarcoCheck() {
        var flag_marco = false;
        for (var i = 0; i < $scope.List_Pedidos.length; i++) {
            if ($scope.List_Pedidos[i].checkeado == true) {
                flag_marco = true;
                break;
            }
        }
        return flag_marco;
    }

    $scope.GenerarDocumento = function () {

        var list_Doc = [];
        var flag_marco = false;
        var id_usuario = '';

        flag_marco = MarcoCheck();
        if (flag_marco == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Debe de seleccionar al menos un registro', 'error', '#ff6849', 1500);
            return;
        }

        list_Doc = ListaMarcoCheck();

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Actualizar la Cancelacion.',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                id_usuario = auxiliarServices.getUserId();

                $scope.loaderSave = true;
                DocumentoVentaServices.getUpdatePedidos(list_Doc, id_usuario)
                  .then(function (data) {
                      console.log(data)
                      $scope.loaderSave = false;

                      if (data != null) {
                          data.forEach(function (item, index) {
                              for (var i = 0; i < $scope.List_Pedidos.length; i++) {
                                  if ($scope.List_Pedidos[i].id_Pedido_Cab == item.id_Pedido_Cab) {
                                      $scope.List_Pedidos[i].Numero_Documento = item.Numero_Documento
                                      $scope.List_Pedidos[i].Classdisabled = "disabled";
                                      $scope.List_Pedidos[i].disabled = true;
                                      $scope.List_Pedidos[i].checkeado = false;
                                  }
                              }
                          })
                          $timeout(function () {
                              if (oTable == null) {
                                  oTable = 'data'
                                  auxiliarServices.initFooTable('tablaDocVenta', 'inputSearch');
                              } else {
                                  $('#tablaDocVenta').trigger('footable_initialize');
                              }
                              let params = {
                                  type: 'alert',
                                  title: 'Excelente !',
                                  text: 'Se realizó Correctamente la Operación !'
                              }
                              auxiliarServices.initSweetAlert(params).then(function (res) {
       
                              });
                              $scope.loaderDet = false;
                          }, 500)
                      }
                      else {
                          auxiliarServices.NotificationMessage('Sistemas', 'Ocurrio un error en el Proceso de Generacion', 'error', '#ff6849', 1500);
                          $scope.loaderSave = true;
                      }
                  })

            }
        });

    }
        
    
})