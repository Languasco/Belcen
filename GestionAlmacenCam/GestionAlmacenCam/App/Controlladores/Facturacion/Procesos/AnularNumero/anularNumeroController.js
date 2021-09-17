var app = angular.module('appGestion.anularNumeroController', [])

app.controller('anularNumeroController', function ($scope, $location, $timeout, auxiliarServices, Documentos_MasivosServices, CobranzaManualServices ) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
 
        auxiliarServices.changeTitle("Anular Número");
        $scope.titleModal = "Anular Número";
        $scope.loaderfiltros = true;

        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy'
            });
        }, 0);

        setTimeout(function () {
            $(".selectFiltros").select2();
        }, 0);
    } 

    $scope.Objeto_Parametro_filtro = {
        id_ZonaVta: '0',
        fechaIni: auxiliarServices.getDateNow(),
        fechaFin: auxiliarServices.getDateNow(),
        serie: '',
        numero: '',
        usuario_creacion: auxiliarServices.getUserId(),
    };

    

    $scope.Lista_zonasFiltro = [];
    $scope.get_Listando_Zonas= function () {
        $scope.loaderfiltros = true;
        Documentos_MasivosServices.get_zonasUsuario(auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderfiltros = false;
                if (res.ok == true) {
                    $scope.Lista_zonasFiltro = [];
                    $scope.Lista_zonasFiltro = res.data;
                    $timeout(function () {
                        $scope.Objeto_Parametro_filtro.id_ZonaVta = '0';
                        $('#cbo_zonasFiltro').val("0").trigger('change.select2');
                    })
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                console.log(err);
            });
    };
    $scope.get_Listando_Zonas();



    $scope.AnularNumero = function () {

        if ($scope.Objeto_Parametro_filtro.id_ZonaVta == 0) {
            return auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Zona de Venta', 'error', '#ff6849', 2000);
        }
        if ($scope.Objeto_Parametro_filtro.serie == '' || $scope.Objeto_Parametro_filtro.serie == null || $scope.Objeto_Parametro_filtro.serie == undefined) {
            return auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese un Nro. de Serie', 'error', '#ff6849', 2000);
        }
        if ($scope.Objeto_Parametro_filtro.numero == '' || $scope.Objeto_Parametro_filtro.numero == null || $scope.Objeto_Parametro_filtro.numero == undefined) {
            return auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese un Nro. de Documento', 'error', '#ff6849', 2000);
        }

        $scope.loaderfiltros = true;
        CobranzaManualServices.set_anularNumero($scope.Objeto_Parametro_filtro)
            .then(function (res) {
                $scope.loaderfiltros = false;
                if (res.ok == true) {
                    let params = {
                        type: 'alert', title: 'Excelente !', text: 'Proceso de Registro realizado correctamente !'
                    };
                    auxiliarServices.initSweetAlert(params).then(function (res) {

                    });

                    $timeout(function () {
                        $('#cbo_zonasFiltro').val('0').trigger('change.select2');
                        $('#dtp_fechaIni').datepicker('setDate', new Date());
                        $('#dtp_fechaFin').datepicker('setDate', new Date());
                    });

                    $scope.Objeto_Parametro_filtro = {
                        id_ZonaVta: '0',
                        fechaIni: auxiliarServices.getDateNow(),
                        fechaFin: auxiliarServices.getDateNow(),
                        serie: '',
                        numero: '',
                        usuario_creacion: auxiliarServices.getUserId(),
                    };

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
 
            })
    }



 

})

