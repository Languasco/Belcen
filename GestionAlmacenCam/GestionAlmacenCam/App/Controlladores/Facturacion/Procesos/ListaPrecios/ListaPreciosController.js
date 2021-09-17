var app = angular.module('appGestion.ListaPreciosController', [])

app.controller('ctrlListaPrecios', function ($scope, loginServices, $location, $timeout, auxiliarServices, ListaPrecioServices, productoCategoriaServices, Cliente_IIServices) {


    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
        $scope.loader = true;
 
        auxiliarServices.changeTitle("Lista de Precios");
        $scope.titleModal = "Registro de Lista de Precios";
        $scope.disabledContent = "";
        $scope.loaderSave = false;

        setTimeout(function () {
            $(".selectFiltros").select2();
        }, 100);

        $scope.Lista_Categoria();
    }

    $scope.Objeto_Parametro =  {
        puntoventa : '1',
        categoria : '0',
        id_CanalNegocio : '0',
        usuario:auxiliarServices.getUserId()
    }

    $scope.List_Precio = [];

    //combo categoria
    $scope.Lista_Categoria = function () {
        $scope.loader = true;
        productoCategoriaServices.getProductoCategoria().then(function (data) {
            $scope.loader = false;
            $scope.List_Categoria = [];
            $scope.List_Categoria = data;
            setTimeout(function () {
                $('#cbo_categoria').val("0").trigger('change.select2');
            }, 100);
        })
    }


    $scope.ListaCanalesNegocio = [];
    $scope.Listando_Canales = function () {
        $scope.loader = true;
        Cliente_IIServices.getCanalesNegocio()
            .then(function (res) {

                $scope.loader = false;
                if (res.ok == true) {
                    $scope.ListaCanalesNegocio = [];
                    $scope.ListaCanalesNegocio = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
                setTimeout(function () {
                    $('#cboCanales').val("0").trigger('change.select2');
                }, 100);

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            })
    }
    $scope.Listando_Canales();




    var oTable;

    $scope.Lista_Precio = function () {

        if ($scope.Objeto_Parametro.id_CanalNegocio == 0 || $scope.Objeto_Parametro.id_CanalNegocio == '0' || $scope.Objeto_Parametro.id_CanalNegocio == null || $scope.Objeto_Parametro.id_CanalNegocio == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Canal del Negocio', 'error', '#ff6849', 1500);
            return;
        } 

        if ($scope.Objeto_Parametro.categoria == 0 || $scope.Objeto_Parametro.categoria == '0' || $scope.Objeto_Parametro.categoria == null || $scope.Objeto_Parametro.categoria == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Categoria', 'error', '#ff6849', 1500);
            return;
        } 


        $scope.loader = true;
        ListaPrecioServices.getListaPrecioParametro($scope.Objeto_Parametro)
            .then(function (data) {

                console.log(data);

            $scope.List_Precio = [];
            $scope.List_Precio = data;
            $timeout(function () {
                $scope.loader = false;
                if (oTable == null) {
                    oTable='data'
                    auxiliarServices.initFooTable('tablaListaPrecio', 'inputSearch');
                } else {
                    $('#tablaListaPrecio').trigger('footable_initialize');
                }
            }, 1000)
       }, function (error) {
           console.log(error)
       })
    }


    ////precioventa
    $scope.showInput = function (id) {
        $('.inputPrecioventa').hide();
        $('#input' + String(id))
            .show()
            .focus()
            .select();
        $('.labelPrecioventa').show();
        $('#label' + String(id)).hide();
    }

    ////precio venta
    $scope.hideInput = function (id,obj) {
        $('#input' + String(id)).hide();
        $('#label' + String(id)).show();
        console.log(obj)
        ListaPrecioServices.updateListaPrecio(obj, $scope.Objeto_Parametro)
    }

    /**********APLICA DESCUENTO**************/
    //aplica descuento
    $scope.showInputAD = function (id) {
        $('.inputaplicadescuento').hide();
        $('#apldescuento' + String(id))
            .show()
            .focus()
            .select();
        $('.labelaplicadescuento').show();
        $('#labelAD' + String(id)).hide();

    }
    //aplica descuento
    $scope.hideInputAD = function (id, obj) {
        $('#apldescuento' + String(id)).hide();
        $('#labelAD' + String(id)).show();
        ListaPrecioServices.updateListaPrecio(obj, $scope.Objeto_Parametro)
    }

    /************PORCENTAGE DESCUENTO*********/
    $scope.showInputPD = function (id) {
        $('.inputporcentagedescuento').hide();
        $('#porcdescuento' + String(id))
            .show()
            .focus()
            .select();
        $('.labelporcentajedescuento').show();
        $('#labelPD' + String(id)).hide();
    }
    //precio venta
    $scope.hideInputPD = function (id, obj) {
        $('#porcdescuento' + String(id)).hide();
        $('#labelPD' + String(id)).show();
        ListaPrecioServices.updateListaPrecio(obj, $scope.Objeto_Parametro)
    }

    ////verifica la lista de los productos nuevos
    $scope.LisProductoNuevos = function () {


        if ($scope.Objeto_Parametro.id_CanalNegocio == 0 || $scope.Objeto_Parametro.id_CanalNegocio == '0' || $scope.Objeto_Parametro.id_CanalNegocio == null || $scope.Objeto_Parametro.id_CanalNegocio == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Canal del Negocio', 'error', '#ff6849', 1500);
            return;
        } 

        if ($scope.Objeto_Parametro.categoria == 0 || $scope.Objeto_Parametro.categoria == '0' || $scope.Objeto_Parametro.categoria == null || $scope.Objeto_Parametro.categoria == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Categoria', 'error', '#ff6849', 1500);
            return;
        }

        var anadirProductos =  function(){
            ///---Añadiendo los productos nuevos
            $scope.loader = true;

            $scope.Objeto_Parametro.usuario = auxiliarServices.getUserId();
            ListaPrecioServices.getListaProductoNuevo($scope.Objeto_Parametro)
                .then(function (data) {



                data.forEach(function (item, index) {
                    $scope.List_Precio.push(item);
                })
                $timeout(function () {
                    if (oTable == null) {
                        auxiliarServices.initFooTable('tablaListaPrecio', 'inputSearch');
                    } else {
                        $('#tablaListaPrecio').trigger('footable_initialize');
                    }
                    $scope.loader = false;
                }, 1000)
            })
            ///---Fin  Añadiendo los productos nuevos
        }

         $scope.loader = true;
         ListaPrecioServices.getListaPrecioParametro($scope.Objeto_Parametro)
         .then(function (data) {
               $scope.loader = false;
               $scope.List_Precio = [];
               $scope.List_Precio = data;
               $timeout(function () {
                   anadirProductos();
               }, 100)
           }, function (error) {
               console.log(error)
           })
    }

})
