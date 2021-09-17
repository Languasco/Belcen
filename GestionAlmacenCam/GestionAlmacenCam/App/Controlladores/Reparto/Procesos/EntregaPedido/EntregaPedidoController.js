var app = angular.module('appGestion.EntregaPedidoController', [])
app.controller('ctrlEntregaPedido', function ($scope, $location, $timeout, auxiliarServices, EntregaPedidoServices, LocalesServices, PersonalServices, AlmacenServices  ) {    
    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2); 
        auxiliarServices.changeTitle("Entrega de Pedidos");
        $scope.titleModal = "Entrega de Pedidos";
        $scope.loaderSave = false; 

        setTimeout(function () {
            $(".selectFiltros").select2();
        }, 100);
        $scope.get_Listando_Locales();
        $scope.get_Listando_Transportistas();    
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
        id_local: '0',
        id_almacen: '0',
        id_Vendedor: '0',
        id_transportista: '0',
        fecha_ini: auxiliarServices.getDateNow(),
        fecha_fin: auxiliarServices.getDateNow()
    };
    
    $scope.Lista_Local = [];
    $scope.get_Listando_Locales = function () {
        $scope.loaderfiltros = true;
        LocalesServices.get_Locales_Usuario(auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Local = [];
                $scope.Lista_Local = data;
                setTimeout(function () {
                    $('#cbo_local').val("0").trigger('change.select2');
                }, 100);

                $scope.Listando_Vendedores();
            }, function (err) {
                console.log(err);
            });
    };


    $scope.Lista_Transportista = [];
    $scope.get_Listando_Transportistas = function () {
        $scope.loaderfiltros = true;
        EntregaPedidoServices.getListarTransportista()
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Transportista = [];
                $scope.Lista_Transportista = data;
                setTimeout(function () {
                    $('#cbo_transportista').val("0").trigger('change.select2');
                }, 100);
            }, function (err) {
                console.log(err);
            });
    };


    $scope.Lista_Vendedor = [];
    $scope.Listando_Vendedores = function () {
        $scope.loaderfiltros = true;
        PersonalServices.getPersonales()
            .then(function (data) {
                $scope.Lista_Vendedor = [];
                for (obj of data) {
                    if (obj.id_cargo_personal == 6 || obj.id_cargo_personal == '6') {
                        $scope.Lista_Vendedor.push(obj);
                    }
                }
                $scope.loaderfiltros = false; 
            }, function (err) {
                $scope.loaderfiltros = false;
                console.log(err);
            });
    };
    $scope.Lista_Almacen = [];
    $scope.change_Local_Almacen = function (idlocal) {
        $scope.loaderfiltros = true;
        AlmacenServices.get_ListadoAlmacenes_Local_Usuario(idlocal, auxiliarServices.getUserId())
            .then(function (data) {
                $scope.loaderfiltros = false;
                $scope.Lista_Almacen = [];
                $scope.Lista_Almacen = data;
                setTimeout(function () {
                    $('#cbo_almacen').val("0").trigger('change.select2');
                }, 300);
            }, function (err) {
                console.log(err);
            });
    };
           
    $scope.initController = function () {
        InicializarMapa();
        RemoveMarker(null);
        RemoveLine(null);

    }

    //Inicializar el Mapa
    $scope.markers = [];
    var myCoordinates = [];
    var id_marker = 0;
    var Polyline;

    ////cargando el mapa inicialmente
    var directionsService;
    var directionsDisplay;

    function InicializarMapa() {
        directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer; 
        //directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: "#800080", strokeWeight: 5 }, suppressMarkers: true })

        $scope.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: { lat: -12.046374, lng: -77.0427934 },
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_CENTER
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            scaleControl: true,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            }
        });

        directionsDisplay.setMap($scope.map);

        ///---- configuracion para mostrar el trafico---
        //trafficLayer = new google.maps.TrafficLayer();
        //trafficLayer.setMap($scope.map);


    };
    
    var infoWindow = new google.maps.InfoWindow();


    let myLatlngOrigen;
    let myLatlngDestino;

 
         
    var createMarker = function (info, opcion) {
        if (opcion == 1) { // Datos del pedido

            if (info.grupo == 0) { /// Datos del vehiculo
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(info.latitud_Pedido_Cab, info.longitud_Pedido_Cab),
                    title: 'TRANSPORTISTA',
                    //icon: '../belcen/Content//vehiculo.png',
                    icon: '../Content//vehiculo.png',
                    id: ++id_marker,
                });
                marker.content = '<div class="infoWindowContent"> Transportista : ' + info.apellidos_personal
                    + '<br/> Latitud : ' + info.latitud_Pedido_Cab
                    + '<br/> Longitud : ' + info.longitud_Pedido_Cab
                    + ' </div>';

            } else {

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(info.latitud_Pedido_Cab, info.longitud_Pedido_Cab),
                    //title: info.apellidos_personal,
                    title: 'N° Pedido : ' + info.Numero_Pedido,
                    //icon: '../belcen/Content/img/car.png',
                    icon: '../Content/img/car.png',
                    id: ++id_marker,
                });

                if (myLatlngOrigen) {
                    marker.content = '<div class="infoWindowContent"> Cliente : ' + info.apellidosNombre_Cliente
                        + '<br /> Dirección : ' + info.direccion_Pedido_Cab
                        + '<br/> Vendedor : ' + info.apellidos_personal
                        + '<br/> Latitud : ' + info.latitud_Pedido_Cab
                        + '<br/> Longitud : ' + info.longitud_Pedido_Cab
                        + '<br/><div class="text-center"> <button  id="btn' + info.id_Pedido_Cab + '" class="btn btn-xs btn-danger">Ver Ruta</button> <div>'
                        + ' </div>';
                } else {
                    marker.content = '<div class="infoWindowContent"> Cliente : ' + info.apellidosNombre_Cliente
                        + '<br /> Dirección : ' + info.direccion_Pedido_Cab
                        + '<br/> Vendedor : ' + info.apellidos_personal
                        + '<br/> Latitud : ' + info.latitud_Pedido_Cab
                        + '<br/> Longitud : ' + info.longitud_Pedido_Cab
                        + ' </div>';
                } 


            } 
        }
        google.maps.event.addListener(marker, 'click', function (e) {
            infoWindow.setContent('<h4><b>' + marker.title + '</b></h4>' + marker.content);
            infoWindow.open($scope.map, marker);
        });

        google.maps.event.addListener(infoWindow, 'domready', function () { 
            if (document.getElementById('btn' + info.id_Pedido_Cab)) { 
                google.maps.event.addDomListener(document.getElementById('btn' + info.id_Pedido_Cab), 'click', function () {  
                    if (myLatlngOrigen) {
                        myLatlngDestino = new google.maps.LatLng(info.latitud_Pedido_Cab, info.longitud_Pedido_Cab);
                        $scope.abrirModalRutas()
                    } else {
                        alert('No hay informacion del Transportista no se puede mostrar ninguna ruta..')
                        console.log('No existe');
                    }        
                });
                return
            } else {
                return
            }
        })
        $scope.markers.push(marker);

    }
       
       
    function getDirections(event) {
        console.log("getDirections");
        event.stop();
    }

    var CreateLineas = function (obj_coordenadas, flagOptimizar) {
        if (flagOptimizar == false) {
            Polyline = new google.maps.Polyline(
                {
                    path: obj_coordenadas,
                    strokeColor: '#ff0000',
                    strokeOpacity: 0.7,
                    strokeWeight: 1
                });

        } else {
            Polyline = new google.maps.Polyline(
                {
                    path: obj_coordenadas,
                    strokeColor: '#ff0000',
                    strokeOpacity: 0.7,
                    strokeWeight: 1,
                    icons: [{
                        icon: {
                            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                        },
                        offset: '25px',
                        repeat: '50px'
                    }]
                });
        }
        Polyline.setMap($scope.map);
    }

    $scope.openInfoWindow = function (e, selectedMarker) {
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }
    
    function RemoveMarker(map) {
        for (var i = 0; i < $scope.markers.length; i++) {
            $scope.markers[i].setMap(map);
        }
    }

    function RemoveLine(map) {
        if (Polyline != undefined) {
            Polyline.setMap(map);
        }
    }

    function MostrarUbicacionesMap(obj_Lista, opcion, flagOptimizar) {
        //1 = registro de pedidos
        //2 = registro de vendedores
        //3 = registro de vehiculos

        for (i = 0; i < obj_Lista.length; i++) {
            createMarker(obj_Lista[i], opcion);
            if (opcion == 1) {
                myCoordinates.push({ lat: parseFloat(obj_Lista[i].latitud_Pedido_Cab), lng: parseFloat(obj_Lista[i].longitud_Pedido_Cab) });
            }
        }
        if (opcion == 1) {
            CreateLineas(myCoordinates, flagOptimizar)
        }
    }
    
    $scope.ListaRelacionPedidos = [];
    var oTable;

    $scope.OptimizarRutasPedidos = function () {
        id_marker = 0;

        if ($scope.Objeto_ParametroFiltro.id_local == 0 || $scope.Objeto_ParametroFiltro.id_local == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Local, verifique', 'error', '#ff6849', 1500);
            return;
        }
        //if ($scope.Objeto_ParametroFiltro.id_Vendedor == 0 || $scope.Objeto_ParametroFiltro.id_Vendedor == '0') {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Vendedor, verifique', 'error', '#ff6849', 1500);
        //    return;
        //}
        if ($scope.Objeto_ParametroFiltro.id_transportista == 0 || $scope.Objeto_ParametroFiltro.id_transportista == '0') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un transportista, verifique', 'error', '#ff6849', 1500);
            return;
        }
        if ($scope.Objeto_ParametroFiltro.fecha_ini == '') {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Fecha Inicial, verifique', 'error', '#ff6849', 1500);
            return;
        }

        InicializarMapa();
        RemoveMarker(null);
        RemoveLine(null);
        $scope.markers = [];
        myCoordinates = [];

        $scope.showLoaderSave = true;
        directionsVisible = false;

        EntregaPedidoServices.getListarRutaEntregaPedidos($scope.Objeto_ParametroFiltro)
            .then(function (res) {  

                $scope.ListaRelacionPedidos = [];
                $scope.ListaRelacionPedidos = res.data;
                $timeout(function () {
                    $scope.showLoaderSave = false;
                    if (oTable !== 'data') {
                        oTable = 'data';
                        auxiliarServices.initFooTable('tbl_pedidos', 'inputSearch');
                    } else {
                        $('#tbl_pedidos').trigger('footable_initialize');
                    }
                }, 1000);
                $scope.rutaEntregaMasiva(res.data);

            }, function (error) { 
                $scope.showLoaderSave = false;
                console.log(error)
            });

        var MostrarInformacionVendedores = function (obj_dataPedidos) {
            EntregaPedidoServices.getListarVendedores($scope.Objeto_ParametroFiltro)
                .then(function (data) {
                    $scope.showLoaderSave = false;
                    MostrarUbicacionesMap(data, 2, true)
                    $timeout(function () {
                        MostrarPosicionActual();
                    }, 800)

                    $scope.ListaRelacionPedidos = [];
                    $scope.ListaRelacionPedidos = obj_dataPedidos;
                    $timeout(function () {
                        if (oTable !== 'data') {
                            oTable = 'data';
                            auxiliarServices.initFooTable('tbl_pedidos', 'inputSearch');
                        } else {
                            $('#tbl_pedidos').trigger('footable_initialize');
                        }
                    }, 1000);

                }, function (error) {
                    $scope.showLoaderSave = false;
                    console.log(error)
                });
        }

        var MostrarPosicionActual = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(coordenadas, errores, { maximumAge: 50000, timeout: 20000, enableHighAccuracy: true });
            } else {
                alert('Oops! Tu navegador no soporta Geolocalización. Podria probarlo en Google Chrome.');
            }
        };
    }       


    var posicionActual = [];

    function coordenadas(position) {

        posicionActual = [];
        LatitugGeoloc = '';
        LongitudGeoloc = '';

        posicionActual.push({
            latitudActual: position.coords.latitude,
            longitudActual: position.coords.longitude
        })

        LatitugGeoloc = position.coords.latitude;
        LongitudGeoloc = position.coords.longitude;

        //Mostrando el Icono en el mapa 
        for (var i = 0; i < posicionActual.length; i++) {
            createMarker(posicionActual[i], 3);
        }
    };

    function errores(error) {
        switch (error.code) {
            case error.TIMEOUT:
                alert("Browser geolocation error !\n\nTimeout.");
                break;
            case error.PERMISSION_DENIED:
                if (error.message.indexOf("Only secure origins are allowed") == 0) {
                    APIGeolocation();
                }
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Browser geolocation error !\n\nPosition unavailable.");
                break;
        }
    };

    function APIGeolocation() {
        jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyB46M5tvv5gb8JlAy0XLQl4XWVwZQUtCa4", function (success) {
            coordenadas({ coords: { latitude: success.location.lat, longitude: success.location.lng } });
        })
            .fail(function (err) {
                alert("API Geolocation error! \n\n" + err);
            });
    };

    $scope.rutaEntregaMasiva = function () { 
        directionsService = new google.maps.DirectionsService;

        if (directionsDisplay != null) {
            directionsDisplay.setMap(null);
            directionsDisplay = null;
        }
 
        var List_direcciones = [];
        var maxRecorrido2 = 0;
        var Index_Global = 0;

        myLatlngOrigen = null;
        for (var i = 0; i < $scope.ListaRelacionPedidos.length; i++) {
            if ($scope.ListaRelacionPedidos[i].grupo == 0 || $scope.ListaRelacionPedidos[i].grupo == '0') {
                myLatlngOrigen = new google.maps.LatLng($scope.ListaRelacionPedidos[i].latitud_Pedido_Cab, $scope.ListaRelacionPedidos[i].longitud_Pedido_Cab);
            }
            List_direcciones.push({ lat: parseFloat($scope.ListaRelacionPedidos[i].latitud_Pedido_Cab), lng: parseFloat($scope.ListaRelacionPedidos[i].longitud_Pedido_Cab), name: 'Station ' + i })
        }
        // Divide route to several List_Particionada_direcc because max List_direcciones limit is 25 (23 waypoints + 1 origin + 1 destination)
        for (var i = 0, List_Particionada_direcc = [], max = 25 - 1; i < List_direcciones.length; i = i + max) {
            List_Particionada_direcc.push(List_direcciones.slice(i, i + max + 1));
        }
        maxRecorrido2 = List_Particionada_direcc.length;

        // Service callback to process service results
        var service_callback = function (response, status) {
            if (status != 'OK') {
                console.log('Directions request failed due to ' + status);
                if (status == 'OVER_QUERY_LIMIT') {
                    setTimeout(function () {
                        // Google maps service la Misma Busqueda
                        Ejecutando_Busqueda_Direccion_google(Index_Global)
                    }, 1000);
                } else {
                    // Google maps service siguiente Busqueda
                    Ejecutando_Busqueda_Direccion_google(Index_Global + 1)
                }
            } else {
                directionsDisplay = new google.maps.DirectionsRenderer();
                directionsDisplay.setMap($scope.map);
                directionsDisplay.setDirections(response);              
                //directionsDisplay.setOptions({ suppressMarkers: true, preserveViewport: true });
                // Google maps service siguiente Busqueda
                Ejecutando_Busqueda_Direccion_google(Index_Global + 1)
            }
        };

        var Ejecutando_Busqueda_Direccion_google = function (index) {
            Index_Global = index;
            if (index == maxRecorrido2) {
                for (var i = 0; i < $scope.ListaRelacionPedidos.length; i++) {
                    createMarker($scope.ListaRelacionPedidos[i], 1);                     
                }
                return;
            }
            // Waypoints does not include first station (origin) and last station (destination)
            var waypoints = [];
            for (var j = 1; j < List_Particionada_direcc[index].length - 1; j++) {
                waypoints.push({ location: List_Particionada_direcc[index][j], stopover: true });
            }
            // Service options
            var service_options = {
                origin: List_Particionada_direcc[index][0],
                destination: List_Particionada_direcc[index][List_Particionada_direcc[index].length - 1],
                waypoints: waypoints,
                travelMode: google.maps.DirectionsTravelMode.DRIVING,
                optimizeWaypoints: true
            };
            // Send request
            directionsService.route(service_options, service_callback);
        }
        
        if ($scope.ListaRelacionPedidos.length > 0) {
            // Google maps service
            Ejecutando_Busqueda_Direccion_google(0)
        }             
    }

 
    $scope.abrirModalRutas = function() {
        $('#myModal').modal('show');
    }
       
    $('#myModal').on('show.bs.modal', function (event) {
        InicializarMapa_Modal();
        $("#location-map").css("width", "100%");
        $("#mapModal").css("width", "100%");
        $scope.ListaRutas = [];

    });

    // Trigger map resize event after modal shown


    $scope.ListaRutas = [];
    $scope.cargarRutas = function (rutes) {
            $scope.$apply(function () {
                $scope.ListaRutas = rutes;
                return $scope.ListaRutas;
            });
    }    

    $('#myModal').on('shown.bs.modal', function () {
        google.maps.event.trigger($scope.mapModal, "resize");


        $("#guiaRuta").empty();
        $scope.showOpciones = true;
        //map.setCenter(myLatlng);     
        //let myLatlngOrigen = new google.maps.LatLng('-12.0147779', '-77.0533777');
        //let myLatlngDestino = new google.maps.LatLng('-11.8963042', '-77.0194769');
                
        var service_options = {
            origin: myLatlngOrigen,
            destination: myLatlngDestino,
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
            drivingOptions: {
                departureTime: new Date(Date.now()),   
                trafficModel: 'optimistic'
            },
            provideRouteAlternatives: true,
            durationInTraffic: true,
            optimizeWaypoints: true,
            //avoidHighways: true,
            //avoidTolls: true,
        } 

        ServiceModal.route(service_options, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                //---con alternativa al trafico                               
                //directionsModal = new google.maps.DirectionsRenderer();
                //directionsModal.setDirections(response);
                //directionsModal.setMap($scope.mapModal);
                //directionsModal.setPanel(panel);

                $scope.cargarRutas(response);                                
                for (var i = 0, len = response.routes.length; i < len; i++) {
                    if (i == 0) {    
                       new google.maps.DirectionsRenderer(
                            {
                                polylineOptions: { strokeColor: "#800080", strokeWeight: 4 },
                                map: $scope.mapModal,
                                directions: response,
                                routeIndex: i
                            });                     
                    }
                    else if (i == 1) {
                        new google.maps.DirectionsRenderer(
                            {
                                polylineOptions: { strokeColor: "#aaaaaa", strokeWeight: 4 },
                                map: $scope.mapModal,
                                directions: response,
                                routeIndex: i
                            });
                    } 
                    else {
                        new google.maps.DirectionsRenderer({
                            polylineOptions: { strokeColor: "#74ccef", strokeWeight: 6 },
                            map: $scope.mapModal,
                            directions: response,
                            routeIndex: i
                        });
                    }
                }
            } else {
                alert('Se ha producido un error en la solicitud de' + status);
            }
        }); 
    });
     ////- MODAL MAPA 
    ////cargando el mapa inicialmente
    var ServiceModal;
    var directionsModal;
    var trafficLayer;


    function InicializarMapa_Modal() {
        ServiceModal = new google.maps.DirectionsService;
        directionsModal = new google.maps.DirectionsRenderer;

        $scope.mapModal = new google.maps.Map(document.getElementById('mapModal'), {
            zoom: 12,
            center: { lat: -12.046374, lng: -77.0427934 },
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_CENTER
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            scaleControl: true,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            }
        });

        directionsModal.setMap($scope.mapModal);


        trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap($scope.mapModal);

        /////---- configuracion para mostrar el trafico---
        //trafficLayer = new google.maps.TrafficLayer();
        //var control = document.getElementById('traffic-wpr');

        //google.maps.event.addDomListener(control, 'click', function () {
        //    trafficLayer.setMap(trafficLayer.getMap() ? null : $scope.mapModal);
        //});
    };       
    //// FIN DE MODAL MAPA

    $scope.recorridos = [];
    $scope.showOpciones = true;
    var direccionesRutas;

    $scope.mostrarRutaElegida = function (ruta, index) {
        InicializarMapa_Modal()

        $scope.recorridos = $scope.ListaRutas.routes[index].legs[0].steps;

        if (index == 0) {
            directionsModal = new google.maps.DirectionsRenderer(
                {
                    polylineOptions: { strokeColor: "#800080", strokeWeight: 4 },
                    map: $scope.mapModal,
                    directions: $scope.ListaRutas,
                    routeIndex: index
                });
        }
        else if (index == 1) {
            directionsModal = new google.maps.DirectionsRenderer(
                {
                    polylineOptions: { strokeColor: "#aaaaaa", strokeWeight: 4 },
                    map: $scope.mapModal,
                    directions: $scope.ListaRutas,
                    routeIndex: index
                });
        }
        else {
            directionsModal = new google.maps.DirectionsRenderer({
                polylineOptions: { strokeColor: "#74ccef", strokeWeight: 6 },
                map: $scope.mapModal,
                directions: $scope.ListaRutas,
                routeIndex: index
            });
        }

 
        $("#guiaRuta").empty();
        direccionesRutas = '<div class="card"><h4><b> Ruta ' + (index + 1) + '</b> </h4>   <b> Distancia : </b> ' + ruta.legs[0].distance.text + ' <b> Tiempo : </b> ' + ruta.legs[0].duration_in_traffic.text + '</div><hr/> ';

        var i = 1;
        for (obj of $scope.recorridos) {
            direccionesRutas += i +'  - ' + obj.instructions + ' <hr style="margin-top: 1px;margin-bottom: 2px;">';
            i += 1;
        }
 
        $scope.showOpciones = false;
        $('#guiaRuta').append(direccionesRutas);

    }

    $scope.mostrarTodasRutas = function () {


        $scope.showOpciones = true;
        directionsModal.setMap(null);
        for (var i = 0; i < $scope.ListaRutas.routes.length; i++) {
            if (i == 0) {
                directionsModal = new google.maps.DirectionsRenderer(
                    {
                        polylineOptions: { strokeColor: "#800080", strokeWeight: 4 },
                        map: $scope.mapModal,
                        directions: $scope.ListaRutas,
                        routeIndex: i
                    });
            }
            else if (i == 1) {
                directionsModal = new google.maps.DirectionsRenderer(
                    {
                        polylineOptions: { strokeColor: "#aaaaaa", strokeWeight: 4 },
                        map: $scope.mapModal,
                        directions: $scope.ListaRutas,
                        routeIndex: i
                    });
            }
            else {
                directionsModal = new google.maps.DirectionsRenderer({
                    polylineOptions: { strokeColor: "#74ccef", strokeWeight: 6 },
                    map: $scope.mapModal,
                    directions: $scope.ListaRutas,
                    routeIndex: i
                });
            }
        }
    }

     
})