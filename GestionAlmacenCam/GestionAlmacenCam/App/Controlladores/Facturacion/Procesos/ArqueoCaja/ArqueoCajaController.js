var app = angular.module('appGestion.ArqueoCajaController', [])

app.controller('ArqueoCajaController', function ($scope, AuditarServices, RevisionPedidoServices, $location, ArqueoCajaServices, $timeout, auxiliarServices, GrupoDetServices, ProveedorServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);
 
        auxiliarServices.changeTitle("Arqueo de Caja");
        $scope.titleModal = "Arqueo de Caja";
        $scope.disabledContent = "";
        $scope.disabledContent = "";
        $scope.loaderSaveD = true;

        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy'
            });
        }, 0);

        setTimeout(function () {
            $(".selectFiltros").select2();
            $(".selectModal").select2();
        }, 100);
    }

    $scope.getAuditorias = function (item) {

        console.log(item)

        const uCreacion = (!item.usuario_creacion) ? 0 : item.usuario_creacion;
        const uEdicion = (!item.usuario_edicion) ? 0 : item.usuario_edicion;

        const fechaCreacion = auxiliarServices.formatDate(item.fecha_creacion);
        const fechaEdicion = (!item.fecha_edicion) ? '' : auxiliarServices.formatDate(item.fecha_edicion);

        if (uCreacion == 0 && uEdicion == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'No hay informacion para mostrar', 'success', '#008000', 5000);
            return;
        }

        AuditarServices.getAuditoria(uCreacion, uEdicion)
            .then(function (res) {
                if (res.ok) {
                    let usuarioCreacion = res.data[0].descripcion;
                    let usuarioEdicion = (res.data.length == 1) ? '' : res.data[1].descripcion;

                    var message = "Fecha Creación : " + fechaCreacion + "</br>" +
                        "Usuario Creación : " + usuarioCreacion + "</br>" +
                        "Fecha Edición : " + fechaEdicion + "</br>" +
                        "Usuario Edición : " + usuarioEdicion + "</br>"
                    auxiliarServices.NotificationMessage('Sistemas', message, 'success', '#008000', 5000);
                }
            })
    }

    //--- variables Globales

    $scope.id_ArqueoCaja_Global = 0; 
    $scope.Flag_modoEdicion = false;
    $scope.Flag_modoEdicionProveedor = false;
    $scope.Flag_modoEdicionDeposito = false;
    $scope.Flag_modoEdicionPagos = false;
    $scope.Flag_modoEdicionEgresos = false;
    $scope.Flag_modoEdicionCobranzas = false;

    $scope.disabledContent = '';
    $scope.disabledCabecera = "disabledContent";
 
    $scope.id_usuario_Global = auxiliarServices.getUserId();
    $scope.facturasVentas = [];
    $scope.boletasVentas = [];
    $scope.files = [];
    $scope.showFileName = false;
    $scope.showDeposit = false;
 
 

    /// Configuracion Tabcontrl Enfoque
    $scope.tab = 1;
    $scope.setTab = function (newTab) {

        if (newTab == 1) {
            $scope.disabledCabecera = "disabledContent";
            $scope.id_ArqueoCaja_Global = 0;
        }

        $scope.tab = newTab;
    };

    $scope.isSet = function (tabNum) {
        return $scope.tab === tabNum;
    };
    //-----------------------


    $scope.lista_anexos = [];
    $scope.lista_anexosModal = [];
    $scope.listados_anexos = function () {
        $scope.loaderSaveD = true;
        RevisionPedidoServices.get_Anexos_Usuarios(auxiliarServices.getUserId()).then(function (res) {
            $scope.loaderSaveD = false;
            if (res.ok == true) {
                $scope.lista_anexos = [];
                $scope.lista_anexosModal = [];
                $scope.lista_anexos = res.data;
                $scope.lista_anexosModal = res.data;
                $timeout(function () {
                    $('#cbo_anexo').val('0').trigger('change.select2');
                })
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
        }, function (err) {
                $scope.loaderSaveD = false;
            console.log(err);
        });
    };
    $scope.listados_anexos();

    $scope.Lista_zonas = [];
    $scope.listados_changeAnexoZonas = function (id_Anexos, idZona, idCC) {
        $scope.loader = true;
        ArqueoCajaServices.get_Zonas_anexos(id_Anexos, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.Lista_zonas = [];
                    $scope.Lista_zonas = res.data;
 
                    $timeout(function () {
                        $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta = idZona;
                        $('#cbo_zonas').val(idZona).trigger('change.select2');
                    })


                    $scope.listados_changeCentroCosto_anexos(id_Anexos, idCC);

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                    $scope.loader = false;
                console.log(err);
            });
    };


    $scope.Lista_zonasFiltro = [];
    $scope.listados_changeAnexoZonasArqueo = function () {

        const id_Anexos = $scope.Objeto_Parametro_arqueoCaja.id_Anexo;
        $scope.loader = true;
        ArqueoCajaServices.get_Zonas_anexos(id_Anexos, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loader = false;
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
                $scope.loader = false;
                console.log(err);
            });
    };

    $scope.Lista_centroCosto = [];
    $scope.listados_changeCentroCosto_anexos = function (idAnexos, idCC) {
        $scope.loader = true;
        ArqueoCajaServices.get_CentroCosto_anexos(idAnexos, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.Lista_centroCosto = [];
                    $scope.Lista_centroCosto = res.data;

                    $timeout(function () {
                        $scope.Objeto_Parametro_arqueoCaja.id_CC = idCC;
                        $('#cbo_centroCosto').val(idCC).trigger('change.select2');
                    }) 

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            });
    };


    $scope.Lista_centroCostoFiltro = [];
    $scope.listados_changeCentroCosto_anexosFiltro = function (idAnexos) {
        $scope.loader = true;
        ArqueoCajaServices.get_CentroCosto_anexos(idAnexos, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.Lista_centroCostoFiltro = [];
                    $scope.Lista_centroCostoFiltro = res.data;

                    $timeout(function () {
                        $scope.Objeto_Parametro_filtro.id_CC = '0';
                        $('#cbo_centroCostoFiltro').val("0").trigger('change.select2');
                    })

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            });
    };


    $scope.Lista_centroCostoModal = [];
    $scope.listados_changeCentroCosto_anexosPagos = function (idAnexos, idCentroCosto) {
        $scope.loader = true;
        ArqueoCajaServices.get_CentroCosto_anexos(idAnexos, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.Lista_centroCostoModal = [];
                    $scope.Lista_centroCostoModal = res.data;
                    $timeout(function () { 
                        $scope.Objeto_Parametro_pagos.id_CC_Destino = String(idCentroCosto);
                        $('#cbo_centroCostoPago').val(String(idCentroCosto)).trigger('change.select2');
                    })
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            });
    };

    $scope.listados_changeCentroCosto_anexosEgresos = function (idAnexos, idCentroCosto) {
        $scope.loader = true;
        ArqueoCajaServices.get_CentroCosto_anexos(idAnexos, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.Lista_centroCostoModal = [];
                    $scope.Lista_centroCostoModal = res.data;
                    $timeout(function () {
                        $scope.Objeto_Parametro_pagos.id_CC_Destino = String(idCentroCosto);
                        $('#cbo_centroCostoEgreso').val(String(idCentroCosto)).trigger('change.select2');
                    })
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            });
    };

    $scope.lista_rinde = [];
    $scope.lista_responsable = [];
    $scope.lista_supervisor = [];

    $scope.listados_personales = function () {
        $scope.loaderSaveD = true;
        ArqueoCajaServices.get_personalesArqueo($scope.id_usuario_Global).then(function (res) {
            $scope.loaderSaveD = false;

            $scope.lista_rinde = [];
            $scope.lista_responsable = [];
            $scope.lista_supervisor = [];

            if (res.ok == true) {

                const personales = res.data;
                const rindes = personales.filter((rinde) => rinde.id_cargo == 1);
                const responsables = personales.filter((rinde) => rinde.id_cargo == 3);
                const supervisores = personales.filter((rinde) => rinde.id_cargo == 6);

                $scope.lista_rinde = rindes;
                $scope.lista_responsable = responsables;
                $scope.lista_supervisor = supervisores;

                //$timeout(function () {
                //    $('#cbo_anexo').val('0').trigger('change.select2');
                //})
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
        }, function (err) {
            $scope.loaderSaveD = false;
            console.log(err);
        });
    };
    $scope.listados_personales();


    $scope.lista_billeteReparto = [];
    $scope.lista_monedasReparto = [];

    $scope.lista_billeteCaja = [];
    $scope.lista_monedasCaja = [];

    $scope.listados_monedasBilletes = function () {
        $scope.loaderSaveD = true;
        ArqueoCajaServices.get_billetesMonedasArqueo($scope.id_usuario_Global).then(function (res) {
            $scope.loaderSaveD = false;

            $scope.lista_billeteReparto = [];
            $scope.lista_monedasReparto = [];
            $scope.lista_billeteCaja = [];
            $scope.lista_monedasCaja = [];

            if (res.ok == true) {

                let listaBilletesMonedas = res.data;

                for (var i = 0; i < listaBilletesMonedas.length; i++) {
                    if (listaBilletesMonedas[i].tipo_BilleteMoneda == 'B') { 
                        $scope.lista_billeteReparto.push({
                            id: Math.random(), id_BilleteMoneda: listaBilletesMonedas[i].id_BilleteMoneda, tipo_BilleteMoneda: listaBilletesMonedas[i].tipo_BilleteMoneda, valor_BilleteMoneda: listaBilletesMonedas[i].valor_BilleteMoneda,
                            estado: listaBilletesMonedas[i].estado, cantidad: listaBilletesMonedas[i].cantidad, importe: listaBilletesMonedas[i].importe,
                        });

                        $scope.lista_billeteCaja.push({
                            id: Math.random(), id_BilleteMoneda: listaBilletesMonedas[i].id_BilleteMoneda, tipo_BilleteMoneda: listaBilletesMonedas[i].tipo_BilleteMoneda, valor_BilleteMoneda: listaBilletesMonedas[i].valor_BilleteMoneda,
                            estado: listaBilletesMonedas[i].estado, cantidad: listaBilletesMonedas[i].cantidad, importe: listaBilletesMonedas[i].importe,
                        });
                    }
                }

                for (var i = 0; i < listaBilletesMonedas.length; i++) {
                    if (listaBilletesMonedas[i].tipo_BilleteMoneda == 'M') { 
                        $scope.lista_monedasReparto.push({
                            id: Math.random(), id_BilleteMoneda: listaBilletesMonedas[i].id_BilleteMoneda, tipo_BilleteMoneda: listaBilletesMonedas[i].tipo_BilleteMoneda, valor_BilleteMoneda: listaBilletesMonedas[i].valor_BilleteMoneda,
                            estado: listaBilletesMonedas[i].estado, cantidad: listaBilletesMonedas[i].cantidad, importe: listaBilletesMonedas[i].importe,
                        })
                        $scope.lista_monedasCaja.push({
                            id: Math.random(), id_BilleteMoneda: listaBilletesMonedas[i].id_BilleteMoneda, tipo_BilleteMoneda: listaBilletesMonedas[i].tipo_BilleteMoneda, valor_BilleteMoneda: listaBilletesMonedas[i].valor_BilleteMoneda,
                            estado: listaBilletesMonedas[i].estado, cantidad: listaBilletesMonedas[i].cantidad, importe: listaBilletesMonedas[i].importe,
                        })
                    }
                }
  
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
        }, function (err) {
            $scope.loaderSaveD = false;
            console.log(err);
        });
    };
    //$scope.listados_monedasBilletes();

    $scope.Lista_Bancos = [];
    $scope.Listando_Bancos = function () {
        GrupoDetServices.getGrupoTabla_Det(6)
            .then(function (data) {
                $scope.Lista_Bancos = [];
                $scope.Lista_Bancos = data;
                $timeout(function () {
                    $('#cbo_banco').val('0').trigger('change.select2');
                })
            }, function (err) {
                console.log(err);
            });
    };
    $scope.Listando_Bancos();


    $scope.Lista_CondicionFact = [];
    $scope.Listando_CondicionFacturacion = function () {
        GrupoDetServices.getGrupoTabla_Det(5)
            .then(function (data) {
                $scope.Lista_CondicionFact = [];
                $scope.Lista_CondicionFact = data;
            }, function (err) {
                console.log(err);
            });
    };
    $scope.Listando_CondicionFacturacion();

    $scope.Lista_proveedorModal = [];
    $scope.listados_proveedores = function () {
        $scope.loader = true;
        ArqueoCajaServices.get_Proveedores($scope.id_usuario_Global)
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.Lista_proveedorModal = [];
                    $scope.Lista_proveedorModal = res.data;
                    $timeout(function () {
                        $scope.Objeto_Parametro_pagos.idProveedor = '0';
                        $('#cbo_proveedorPago').val("0").trigger('change.select2');
                    })
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                $scope.loader = false;
                console.log(err);
            });
    };
    $scope.listados_proveedores();

    $scope.depositos = [];
    $scope.ResumenDepositos = [];

    $scope.listados_depositos = function (id_arqueoCaja) {
        $scope.loader = true;
        ArqueoCajaServices.get_depositos(id_arqueoCaja, $scope.id_usuario_Global)
            .then(function (res) {
               $scope.loader = false;
                if (res.ok == true) {
                    $scope.depositos = [];
                    $scope.ResumenDepositos = [];

                    $scope.depositos = res.data;

                    if ($scope.depositos.length > 0) {

                        let bancos = [];
                        res.data.forEach((item) => {
                            if (!bancos.includes(item.descripcionBanco)) {
                                bancos.push(item.descripcionBanco);
                            }
                        })

                        let importe = 0;
                        for (banco of bancos) {
                            importe = 0;
                            for (deposito of $scope.depositos) {
                                if (banco == deposito.descripcionBanco) {
                                    importe += deposito.importe_Deposito;
                                }
                            }
                            $scope.ResumenDepositos.push({
                                banco: banco,
                                importe: importe
                            })
                        }
                        let total = 0;
                        $scope.ResumenDepositos.forEach(function (a) { total += a.importe})

                        $scope.ResumenDepositos.push({
                            banco: 'SUMATORIA',
                            importe: total
                        })
                    }

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            });
    };
 

    $scope.pagos = [];
    $scope.listados_pagos = function (id_ArqueoCaja) {
        $scope.loader = true;
        ArqueoCajaServices.get_pagos(id_ArqueoCaja, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.pagos = [];
                    $scope.pagos = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            });
    };
 

    $scope.egresos = [];
    $scope.ResumenEgresos = [];

    $scope.listados_egresos = function (id_ArqueoCaja) {
        $scope.loader = true;
        ArqueoCajaServices.get_egresos(id_ArqueoCaja, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.egresos = [];
                    $scope.ResumenEgresos = [];
                    $scope.egresos = res.data;
 
                    const dataBD = res.data.filter(e => e.grupo == 0);

                    if ($scope.egresos.length > 0) {
                        let tipoDocumentos = [];
                        dataBD.forEach((item) => {
                            if (!tipoDocumentos.includes(item.tipoDocumento)) {
                                tipoDocumentos.push(item.tipoDocumento);
                            }
                        })             

                        let importe = 0;
                        for (doc of tipoDocumentos) {
                            importe = 0;
                            for (egreso of dataBD) {
                                if (doc == egreso.tipoDocumento) {
                                    importe += egreso.importe_Egreso;
                                }
                            }
                            $scope.ResumenEgresos.push({
                                tipoDocumento: doc,
                                importe: importe
                            })
                        }

                        let total = 0;
                        $scope.ResumenEgresos.forEach(function (a) { total += a.importe });

                        $scope.ResumenEgresos.push({
                            tipoDocumento: 'SUMATORIA',
                            importe: total
                        })
                    }                  
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            });
    };
    
    $scope.tiposEgresos = [];
    $scope.listado_tipoEgresos = function () {
        $scope.loader = true;
        ArqueoCajaServices.get_tiposEgresos_Usuario($scope.id_usuario_Global )
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.tiposEgresos = [];
                    $scope.tiposEgresos = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            });
    };
    $scope.listado_tipoEgresos();

    $scope.tiposDocumentos = [];
    $scope.listado_tipoDocumentos = function () {
        $scope.loader = true;
        ArqueoCajaServices.get_tiposDocumentos()
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    $scope.tiposDocumentos = [];
                    $scope.tiposDocumentos = res.data;
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            });
    };
    $scope.listado_tipoDocumentos();

    $scope.cobranzas = [];
    $scope.cobranzas_resumen = [];

    $scope.devoluciones = [];
    $scope.mostrandoInformacion_cobranzas = function () {

        if ($scope.Objeto_Parametro_arqueoCaja.id_Anexo == '0' || $scope.Objeto_Parametro_arqueoCaja.id_Anexo == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Anexo que esta en el Ficha Datos Generales', 'error', '#ff6849', 1500);
            return false;
        }
        //if ($scope.Objeto_Parametro_arqueoCaja.id_ZonaVta == '0' || $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta == 0) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Zona que esta en el Ficha Datos Generales', 'error', '#ff6849', 1500);
        //    return false;
        //}
        if ($scope.Objeto_Parametro_arqueoCaja.id_CC == '0' || $scope.Objeto_Parametro_arqueoCaja.id_CC == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Centro Costo que esta en el Ficha Datos Generales', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == '' || $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == null || $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha Arqueo', 'error', '#ff6849', 1500);
            return false;
        } 

        const fechaArqueoCaja = $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja;
        $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = (!$scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja);

        $scope.loaderSaveD = true;
        $scope.cobranzas = [];
        $scope.cobranzas_II = [];
        $scope.cobranzas_resumen = [];
 
        ArqueoCajaServices.get_informacionVentas_cobranzas($scope.Objeto_Parametro_arqueoCaja.id_Anexo, $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta, $scope.Objeto_Parametro_arqueoCaja.id_CC, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja, $scope.id_usuario_Global)
            .then(function (res) {

                $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;

                if (res.ok == true) {

                    $scope.loaderSaveD = false;
                    $scope.cobranzas = res.data.cobranzas;
                    $scope.cobranzas_II = res.data.cobranzas_II;
                    $scope.cobranzas_resumen = res.data.cobranzas_resumen;

                } else {
                    $scope.loaderSaveD = false;
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                    $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                $scope.loaderSaveD = false;
                console.log(error)
            })
    }

    $scope.totalCobranzas = 0;
    $scope.totalCobranzas_II = 0;
    $scope.totalDevoluciones = 0;
    $scope.totalDevoluciones_II = 0;

 

 

    $scope.Objeto_Parametro_filtro = {
        id_Anexo: '0',
        id_ZonaVta: '0',
        id_CC: '0',
        fechaIni: auxiliarServices.getDateNow(),
        fechaFin: auxiliarServices.getDateNow(),
        id_estado: '0',
        usuario_creacion: $scope.id_usuario_Global,
    };
                   
    $scope.Objeto_Parametro_arqueoCaja = {
         id_ArqueoCaja: '0',
         id_ZonaVta: '0',
         id_Anexo: '0',
         id_CC: '0',
         fechaArqueoCaja: auxiliarServices.getDateNow(),
         nroArqueoCaja: '',
         id_Personal_Rinde: '0',
         id_Personal_Responsable: '0',
         id_Personal_Supervisor: '0',
         fechaSaldoInicial: '',
         importeSaldoInicial: '',
         estado: '38',
         usuario_creacion: $scope.id_usuario_Global,
    };

    $scope.Objeto_Parametro_deposito = {
        id_ArqueoCaja_Deposito: '0',
        id_ArqueoCaja: '0',
        fecha_Deposito: auxiliarServices.getDateNow(),
        id_Banco: '0',
        nroOperario: '',
        importe_Deposito: '',
        adjuntarArchivo: '',
        observaciones: '',
        estado: '1',
        usuario_creacion: $scope.id_usuario_Global,
    };

    $scope.Objeto_Parametro_pagos = {
        id_ArqueoCaja_Egresos: '0',
        id_ArqueoCaja: '0',
        fecha_Registro: auxiliarServices.getDateNow(),
        id_Anexo_Destino: '0',
        id_CC_Destino: '0',
        id_MedioPago: '0',
        id_Banco: '0',
        nroOperario: '',
        adjuntarArchivo: '',
        importe_Deposito: '',
        idProveedor: '0',
        documentoReferencia: '',
        observaciones: '',
        estado: '1',
        usuario_creacion: $scope.id_usuario_Global
    };

    $scope.Objeto_Parametro_egresos = {
        id_ArqueoCaja_Egresos: '0',
        id_ArqueoCaja: '0',
        id_TipoEgreso: '0',
        id_ZonaEgreso: '0',

        fecha_Registro: auxiliarServices.getDateNow(),
        id_Anexo_Destino: '0',
        id_CC_Destino: '0',
        id_TipoDocumento: '0',
        serieDocumento: '',
        numeroDocumento: '',
        rucProveedor: '',
        razonsocialProveedor: '',
        importe_Egreso: '',
        descripcionEgreso: '',
        id_TipoDocumento2: '0',
        adjuntarArchivoEgreso: '',
        nombreServidor: '',
        observacionesEgreso: '',
        estado: '1',
        usuario_creacion: $scope.id_usuario_Global
    };

    $scope.Objeto_Parametro_cobranzas = {
        id_ArqueoCaja_Cobranza: '0',
        id_ArqueoCaja: '0',
        id_zona: '0',
        fecha_cobranza: auxiliarServices.getDateNow(),
        id_Factura_Cab: '0',
        id_TipoDocumento: '0',
        serie_Documento: '',
        numero_Documento: '',
        importe_Documento: '',
        cliente_Documento: '',
        id_MedidoPago: '1',
        id_Banco: '0',
        nro_operacionBanco: '',
        adjuntarArchivoBanco: '',
        nombreArchivoServidor: '',
        importePago: '',
        observaciones: '',
        estado: '1',
        usuario_creacion: $scope.id_usuario_Global
    };

    $scope.blank_depositos = function () {
        $scope.Flag_modoEdicionDeposito = false;
        $scope.showFileName = false;

        $scope.Objeto_Parametro_deposito = {
            id_ArqueoCaja_Deposito: '0',
            id_ArqueoCaja: $scope.id_ArqueoCaja_Global,
            fecha_Deposito: auxiliarServices.getDateNow(),
            id_Banco: '0',
            nroOperario: '',
            importe_Deposito: '',
            adjuntarArchivo: '',
            observaciones: '',
            estado: '1',
            usuario_creacion: $scope.id_usuario_Global,
        };

        $timeout(function () {
            $('#cbo_banco').val("0").trigger('change.select2');
            $('#dtp_fechaDeposito').datepicker('setDate', new Date());
        }, 0);

        $scope.files = [];       
        $("#inputFileOpen").val('');

    }

    $scope.blank_pagos = function () {
        $scope.Flag_modoEdicionPagos = false;
        $scope.showFileName = false;

        $scope.Objeto_Parametro_pagos = {
            id_ArqueoCaja_Egresos: '0',
            id_ArqueoCaja: $scope.id_ArqueoCaja_Global,
            fecha_Registro: auxiliarServices.getDateNow(),
            id_Anexo_Destino: '0',
            id_CC_Destino: '0',
            id_MedioPago: '1',
            id_Banco: '0',
            nroOperario: '',
            adjuntarArchivo: '',
            importe_Deposito: '',
            idProveedor: '0',
            documentoReferencia: '',
            observaciones: '',
            estado: '1',
            usuario_creacion: $scope.id_usuario_Global
        };

        $timeout(function () {
            $('#cbo_anexoPago').val("0").trigger('change.select2');
            $('#cbo_centroCostoPago').val("0").trigger('change.select2');
            $('#cbo_medioPago').val("1").trigger('change.select2');
            $('#cbo_bancoPago').val("0").trigger('change.select2');
            $('#cbo_proveedorPago').val("0").trigger('change.select2');

            $('#dtp_fechaPago').datepicker('setDate', new Date());
            $("#cbo_medioPago").removeClass("disabledContent");
        }, 0);

        $scope.files = [];
        $("#inputFileOpenPago").val('');

    }

    $scope.blank_egresos = function () {
        $scope.Flag_modoEdicionEgresos = false;
        $scope.showFileName = false;

        $scope.Objeto_Parametro_egresos = {
            id_ArqueoCaja_Egresos: '0',
            id_ArqueoCaja: '0',
            id_TipoEgreso: '0',
            id_ZonaEgreso: '0',
            fecha_Registro: auxiliarServices.getDateNow(),
            id_Anexo_Destino: '0',
            id_CC_Destino: '0',
            id_TipoDocumento: '0',
            serieDocumento: '',
            numeroDocumento: '',
            rucProveedor: '',
            razonsocialProveedor: '',
            importe_Egreso: '',
            descripcionEgreso: '',
            id_TipoDocumento2: '0',
            adjuntarArchivoEgreso: '',
            nombreServidor: '',
            observacionesEgreso: '',
            estado: '1',
            usuario_creacion: $scope.id_usuario_Global
        };

        $timeout(function () {
            $('#cbo_anexoEgreso').val("0").trigger('change.select2');
            $('#cbo_centroCostoEgreso').val("0").trigger('change.select2');
            $('#cbo_tipoEgreso').val("0").trigger('change.select2');
            $('#cbo_zonaEgreso').val("0").trigger('change.select2');
            $('#cbo_tipoDocumento').val("0").trigger('change.select2');
            $('#cbo_tipoDocumento2').val("0").trigger('change.select2');

            $('#dtp_fechaEgreso').datepicker('setDate', new Date());

        }, 0);

        $scope.files = [];
        $("#inputFileOpenEgreso").val('');

    }
                
    $scope.Open_New_Modal = function () {
        //$scope.nuevaIngreso();
        //$scope.disabledForm = "";
        //$('#modalMantenimiento').modal('show');
        //$scope.calculoTotales();
    }

          
    $scope.saveUpdate_arqueoCaja = function () {
        
        if ($scope.Objeto_Parametro_arqueoCaja.id_Anexo == '0' || $scope.Objeto_Parametro_arqueoCaja.id_Anexo == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Anexo', 'error', '#ff6849', 1500);
            return false;
        }
        //if ($scope.Objeto_Parametro_arqueoCaja.id_ZonaVta == '0' || $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta == 0) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Zona', 'error', '#ff6849', 1500);
        //    return false;
        //}
        if ($scope.Objeto_Parametro_arqueoCaja.id_CC == '0' || $scope.Objeto_Parametro_arqueoCaja.id_CC == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Centro Costo', 'error', '#ff6849', 1500);
            return false;
        }      
        if ($scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == '' || $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == null || $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha Arqueo', 'error', '#ff6849', 1500);
            return false;
        } 

        const fechaDia = auxiliarServices.getDateNow();

        if ($scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja > fechaDia) {
            
            auxiliarServices.NotificationMessage('Sistemas', 'La fecha de Arqueo Caja es mayor a la Fecha Actual', 'error', '#ff6849', 1500);
            return false;
        }


        if ($scope.Objeto_Parametro_arqueoCaja.id_Personal_Rinde == '0' || $scope.Objeto_Parametro_arqueoCaja.id_Personal_Rinde == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Rinde', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_arqueoCaja.id_Personal_Responsable == '0' || $scope.Objeto_Parametro_arqueoCaja.id_Personal_Responsable == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Responsable', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_arqueoCaja.id_Personal_Supervisor == '0' || $scope.Objeto_Parametro_arqueoCaja.id_Personal_Supervisor == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Supervisor', 'error', '#ff6849', 1500);
            return false;
        }
    
        if ($scope.Objeto_Parametro_arqueoCaja.fechaSaldoInicial == '' || $scope.Objeto_Parametro_arqueoCaja.fechaSaldoInicial == null || $scope.Objeto_Parametro_arqueoCaja.fechaSaldoInicial == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha del Saldo', 'error', '#ff6849', 1500);
            return false;
        } 
        if ($scope.Objeto_Parametro_arqueoCaja.importeSaldoInicial == '' || $scope.Objeto_Parametro_arqueoCaja.importeSaldoInicial == null) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Importe del Saldo Inicial', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_arqueoCaja.importeSaldoInicial == '0'  ) {
            auxiliarServices.NotificationMessage('Sistemas', 'El Importe del Saldo Inicial debe ser mayor a cero', 'error', '#ff6849', 1500);
            return false;
        }


        var params = {
            title: "Desea Grabar ?",
            text: 'Esta seguro de Grabar el Arqueo.',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {

                const fechaArqueoCaja = $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja;
                const fechaSaldoInicial = $scope.Objeto_Parametro_arqueoCaja.fechaSaldoInicial;

                $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = (!$scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja);
                $scope.Objeto_Parametro_arqueoCaja.fechaSaldoInicial = (!$scope.Objeto_Parametro_arqueoCaja.fechaSaldoInicial) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_arqueoCaja.fechaSaldoInicial);

                if ($scope.Flag_modoEdicion == false) { // nuevo registroo 

                    $scope.loaderSaveD = true;
                    ArqueoCajaServices.save_arqueoCaja_Cab($scope.Objeto_Parametro_arqueoCaja)
                        .then(function (res) {

                            $scope.loaderSaveD = false;
                            $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                            $scope.Objeto_Parametro_arqueoCaja.fechaSaldoInicial = fechaSaldoInicial;

                            if (res.ok == true) {

                                let resBackend = res.data;
                                let resBackendF = resBackend.split("|");

                                $scope.Objeto_Parametro_arqueoCaja.id_ArqueoCaja = resBackendF[0];
                                $scope.Objeto_Parametro_arqueoCaja.nroArqueoCaja = resBackendF[1];
                                $scope.id_ArqueoCaja_Global = resBackendF[0];

                                $scope.Flag_modoEdicion = true;

                                $scope.disabledContent = "disabledContent";

                                $timeout(function () {
                                    let params = {
                                        type: 'alert',
                                        title: 'Excelente !',
                                        text: 'Proceso de Registro realizado correctamente !'
                                    }
                                    auxiliarServices.initSweetAlert(params).then(function (res) {
                                    });
                                }, 500)

                                $scope.mostrandoInformacion_arqueosCaja();

                            } else {
                                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                                alert(res.data);
                            }
                        }, function (error) {
                            $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                            $scope.Objeto_Parametro_arqueoCaja.fechaSaldoInicial = fechaSaldoInicial;

                            $scope.loaderSaveD = false;
                            alert(error);
                        })

                } else {  //actualizar

                    $scope.loaderSaveD = true;
                    ArqueoCajaServices.update_arqueoCaja_Cab($scope.Objeto_Parametro_arqueoCaja)
                        .then(function (res) {

                            $scope.loaderSaveD = false;
                            $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                            $scope.Objeto_Parametro_arqueoCaja.fechaSaldoInicial = fechaSaldoInicial;

                            if (res.ok == true) {

                                $timeout(function () {
                                    let params = {
                                        type: 'alert',
                                        title: 'Excelente !',
                                        text: 'Actualizado realizado correctamente !'
                                    }
                                    auxiliarServices.initSweetAlert(params).then(function (res) {
                                    });
                                }, 500)

                            } else {
                                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                                alert(res.data);
                            }
                        }, function (error) {
                            $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                            $scope.Objeto_Parametro_arqueoCaja.fechaSaldoInicial = fechaSaldoInicial;

                            $scope.loaderSaveD = false;
                            alert(error);
                        })

                }
            }
        });


        
       
    }

    $scope.changeFocusInput = function (id) {
        var doc = document.getElementById(id);
        $timeout(function () {
            doc.focus();
        }, 0)
    }

    $scope.calcularTotales_fila = function (Opcion, unidadMonetaria, obj, id_enfoque) {


        const idZona = $scope.Objeto_Parametro_filtro.id_ZonaVta;

        if (idZona == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Zona', 'error', '#ff6849', 1500);
            return false;
        }

        if (Opcion == 'R') { // reparto
            if (unidadMonetaria == 'B') { // billete
                for (item of $scope.lista_billeteReparto) {
                    if (item.id_BilleteMoneda == obj.id_BilleteMoneda && item.tipo_BilleteMoneda == 'B') {
                        let cant = (!item.cantidad) ? 0 : item.cantidad;
                        let valor = (!item.valor_BilleteMoneda) ? 0 : item.valor_BilleteMoneda;

                        item.importe = (Number(cant) * Number(valor)).toFixed(2);  

                        $scope.save_monedasBillete($scope.id_ArqueoCaja_Global, 1, item.id_BilleteMoneda, Number(cant), Number(valor), item.importe, idZona)

                        $scope.changeFocusInput('id_BR_' + (id_enfoque + 1))

                        break;
                    }
                }
            } else {// monedas
                for (item of $scope.lista_monedasReparto) {

                    if (item.id_BilleteMoneda == obj.id_BilleteMoneda && item.tipo_BilleteMoneda == 'M') {
                        let cant = (!item.cantidad) ? 0 : item.cantidad;
                        let valor = (!item.valor_BilleteMoneda) ? 0 : item.valor_BilleteMoneda;

                        item.importe = (Number(cant) * Number(valor)).toFixed(2);

                        $scope.save_monedasBillete($scope.id_ArqueoCaja_Global, 1, item.id_BilleteMoneda, Number(cant), Number(valor), item.importe, idZona)

                        $scope.changeFocusInput('id_MR_' + (id_enfoque + 1))

                        break;
                    }
                }
            }
        }
        if (Opcion == 'C') { // cajaChica
            if (unidadMonetaria == 'B') { // billete
                for (itemB of $scope.lista_billeteCaja) {

                    if (itemB.id_BilleteMoneda == obj.id_BilleteMoneda && itemB.tipo_BilleteMoneda == 'B') {
                        let cant = (!itemB.cantidad) ? 0 : itemB.cantidad;
                        let valor = (!itemB.valor_BilleteMoneda) ? 0 : itemB.valor_BilleteMoneda;

                        itemB.importe = (Number(cant) * Number(valor)).toFixed(2);

                        $scope.save_monedasBillete($scope.id_ArqueoCaja_Global, 2, itemB.id_BilleteMoneda, Number(cant), Number(valor), itemB.importe, 0)

                        $scope.changeFocusInput('id_BC_' + (id_enfoque + 1))

                        break;
                    }
                }
            } else {// monedas
                for (itemM of $scope.lista_monedasCaja) {

                    if (itemM.id_BilleteMoneda == obj.id_BilleteMoneda) {
                        let cant = (!itemM.cantidad) ? 0 : itemM.cantidad;
                        let valor = (!itemM.valor_BilleteMoneda) ? 0 : itemM.valor_BilleteMoneda;

                        itemM.importe = (Number(cant) * Number(valor)).toFixed(2);

                        $scope.save_monedasBillete($scope.id_ArqueoCaja_Global, 2, itemM.id_BilleteMoneda, Number(cant), Number(valor), itemM.importe, 0)

                        $scope.changeFocusInput('id_MC_' + (id_enfoque + 1))

                        break;
                    }
                }
            }
        }
        $scope.calcularTotales_general();
    }

    $scope.totalBR = 0;
    $scope.totalMR = 0;

    $scope.totalBC = 0;
    $scope.totalMC = 0;

    $scope.totalReparto = 0;
    $scope.totalCajaChica = 0;

    
    $scope.calcularTotales_general = function () {
        let totalBR = 0;
        let totalMR = 0;

        let totalBC = 0;
        let totalMC = 0;

        for (item of $scope.lista_billeteReparto) {
            totalBR = totalBR + Number(item.importe);
        }
        $scope.totalBR = totalBR;

        for (item of $scope.lista_monedasReparto) {
            totalMR = totalMR + Number(item.importe);
        }
        $scope.totalMR = totalMR;

        $scope.totalReparto = (totalBR + totalMR );


        for (item of $scope.lista_billeteCaja) {
            totalBC = totalBC + Number(item.importe);
        }
        $scope.totalBC = totalBC;

        for (item of $scope.lista_monedasCaja) {
            totalMC = totalMC + Number(item.importe);
        }
        $scope.totalMC = totalMC;

        $scope.totalCajaChica = (totalBC + totalMC).toFixed(2);
        $scope.totalMC = totalMC.toFixed(2);
    }

    $scope.save_monedasBillete = function (id_ArqueoCaja, id_Tipo, id_BilleteMoneda, cantidad_Billete, valor_Billete, total_Billete, idZona) {

        //id_Tipo == 1 es reparto  ,  id_Tipo == 2 es Caja Chica 
        $scope.loaderSaveD = true;
        ArqueoCajaServices.save_billetesMonedasArqueo(id_ArqueoCaja, id_Tipo, id_BilleteMoneda, cantidad_Billete, valor_Billete, total_Billete, $scope.id_usuario_Global, idZona ).then(function (res) {
            $scope.loaderSaveD = false;
            if (res.ok == true) {
                auxiliarServices.NotificationMessage('Sistemas', 'Proceso realizado correctamente', 'success', '#008000', 5000);
                return false;
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
        }, function (err) {
            $scope.loaderSaveD = false;
            console.log(err);
        });


    }

    $scope.mostrandoInformacion_ventas = function () {


        if ($scope.Objeto_Parametro_arqueoCaja.id_Anexo == '0' || $scope.Objeto_Parametro_arqueoCaja.id_Anexo == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Anexo que esta en el Ficha Datos Generales', 'error', '#ff6849', 1500);
            return false;
        }
        //if ($scope.Objeto_Parametro_arqueoCaja.id_ZonaVta == '0' || $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta == 0) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Zona que esta en el Ficha Datos Generales', 'error', '#ff6849', 1500);
        //    return false;
        //}
        if ($scope.Objeto_Parametro_arqueoCaja.id_CC == '0' || $scope.Objeto_Parametro_arqueoCaja.id_CC == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Centro Costo que esta en el Ficha Datos Generales', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == '' || $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == null || $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha Arqueo', 'error', '#ff6849', 1500);
            return false;
        } 


        const fechaArqueoCaja = $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja;
        $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = (!$scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja);  

        $scope.loaderSaveD = true;
        $scope.facturasVentas = [];
        $scope.boletasVentas = [];
        

        ArqueoCajaServices.get_informacionVentas_boletasFacturas($scope.Objeto_Parametro_arqueoCaja.id_Anexo, $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta, $scope.Objeto_Parametro_arqueoCaja.id_CC, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja, $scope.id_usuario_Global)
            .then(function (res) {

                $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;

                if (res.ok == true) {
                    $scope.loaderSaveD = false;
                    $scope.facturasVentas = [];
                    $scope.boletasVentas = [];

                    $scope.facturasVentas = res.data.filter((f) => f.idTipoDoc == 1);
                    $scope.boletasVentas = res.data.filter((f) => f.idTipoDoc == 2);

                    $scope.totalVentasDocumentos();

               } else {
                    $scope.loaderSaveD = false;
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                    $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                    $scope.loaderSaveD = false;
                console.log(error)
            })
    }

    $scope.totalVentaFactura = 0;
    $scope.totalVentaBoleta = 0;
    $scope.totalVenta = 0;
    $scope.totalContado = 0;
    $scope.totalCredito = 0;

    $scope.totalVentasDocumentos = function () {
 
        let fact = 0; 
        let bolet = 0; 
        let cont = 0; 
        let cred = 0; 

        for (item of $scope.facturasVentas) {
            if (item.idTipoDoc == 1) {
                fact += (!item.importeTotal) ? 0 : item.importeTotal;
            }
        }
        for (item of $scope.boletasVentas) {
            if (item.idTipoDoc == 2) {
                bolet += (!item.importeTotal) ? 0 : item.importeTotal;
            }
        }

        // totales por forma de Pago 
        for (item of $scope.facturasVentas) {
            if (item.idCondicionPago == 26) {
                cont += (!item.importeTotal) ? 0 : item.importeTotal;
            } else {
                cred += (!item.importeTotal) ? 0 : item.importeTotal;
            }
        }


        for (item of $scope.boletasVentas) {
            if (item.idCondicionPago == 26) {
                cont += (!item.importeTotal) ? 0 : item.importeTotal;
            }
            else {
                cred += (!item.importeTotal) ? 0 : item.importeTotal;
            }
        }


        $scope.totalVentaFactura = fact.toFixed(2); 
        $scope.totalVentaBoleta = bolet.toFixed(2); 
        $scope.totalContado = cont.toFixed(2); 
        $scope.totalCredito = cred.toFixed(2); 

        $scope.totalVenta = (fact + bolet).toFixed(2);



    }

    $scope.guardarInformacion_ventas = function () {
        var params = {
            title: "Desea Grabar ?",
            text: 'Esta por almacenar la informacion de las ventas.',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert (params).then(function (res) {
            if (res == true) {

                if ($scope.Objeto_Parametro_arqueoCaja.id_Anexo == '0' || $scope.Objeto_Parametro_arqueoCaja.id_Anexo == 0) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Anexo', 'error', '#ff6849', 1500);
                    return false;
                }
                //if ($scope.Objeto_Parametro_arqueoCaja.id_ZonaVta == '0' || $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta == 0) {
                //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Zona', 'error', '#ff6849', 1500);
                //    return false;
                //}
                if ($scope.Objeto_Parametro_arqueoCaja.id_CC == '0' || $scope.Objeto_Parametro_arqueoCaja.id_CC == 0) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Centro Costo', 'error', '#ff6849', 1500);
                    return false;
                }
                if ($scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == '' || $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == null || $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == undefined) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha Arqueo', 'error', '#ff6849', 1500);
                    return false;
                }


                const fechaArqueoCaja = $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja;
                $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = (!$scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja);

                $scope.loaderSaveD = true;
                ArqueoCajaServices.set_almacenar_informacionVentas_boletasFacturas($scope.Objeto_Parametro_arqueoCaja.id_Anexo, $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta, $scope.Objeto_Parametro_arqueoCaja.id_CC, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja, $scope.id_ArqueoCaja_Global, $scope.id_usuario_Global)
                    .then(function (res) {

                        $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;

                        if (res.ok == true) {
                            $scope.loaderSaveD = false;
                            $timeout(function () {
                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Proceso de Registro realizado correctamente !'
                                }
                                auxiliarServices.initSweetAlert(params).then(function (res) {
                                });

                            }, 500)
                        } else {
                            $scope.loaderSaveD = false;
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(res.data);
                        }
                    }, function (error) {
                       $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                        $scope.loaderSaveD = false;
                        console.log(error)
                    })
            }
        });
 
    }

    $scope.openModal_depositos = function () {
        $('#modalDeposito').modal('show');
        $scope.showFileName = false;
        $scope.titleFile = 'Adjuntar Documento';

        $scope.blank_depositos();
    }

    $scope.closeModal_depositos = function () {
        $('#modalDeposito').modal('hide');
    }

    $scope.closeModal_pagos = function () {
        $('#modalPagoProveedor').modal('hide');
    }

    $scope.guardarInformacion_depositos = async function () {

        if ($scope.Objeto_Parametro_deposito.fecha_Deposito == '' || $scope.Objeto_Parametro_deposito.fecha_Deposito == null || $scope.Objeto_Parametro_deposito.fecha_Deposito == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha Deposito', 'error', '#ff6849', 1500);
            return false;
        } 
        if ($scope.Objeto_Parametro_deposito.id_Banco == '0' || $scope.Objeto_Parametro_deposito.id_Banco == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Banco', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_deposito.nroOperario == '' || $scope.Objeto_Parametro_deposito.nroOperario == null || $scope.Objeto_Parametro_deposito.nroOperario == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nro Operacion', 'error', '#ff6849', 1500);
            return false;
        }

        const fechaDia = auxiliarServices.getDateNow();

        if ($scope.Objeto_Parametro_deposito.fecha_Deposito > fechaDia) {

            auxiliarServices.NotificationMessage('Sistemas', 'La fecha de Depósito es mayor a la Fecha Actual, verifique', 'error', '#ff6849', 1500);
            return false;
        }



        const fecha_Deposito = $scope.Objeto_Parametro_deposito.fecha_Deposito;
        $scope.Objeto_Parametro_deposito.fecha_Deposito = (!$scope.Objeto_Parametro_deposito.fecha_Deposito) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_deposito.fecha_Deposito);

        if ($scope.Flag_modoEdicionDeposito == false) {
            $scope.loader = true;
            const { ok, data } = await ArqueoCajaServices.validar_nroOperacion($scope.Objeto_Parametro_deposito.id_Banco, $scope.Objeto_Parametro_deposito.nroOperario, $scope.Objeto_Parametro_deposito.fecha_Deposito);
            $scope.loader = false;
            $scope.$apply();

            if (ok) {
                if (data[0].cantRegistro == 1) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos este número de operación ya se registro con anterioridad', 'error', '#ff6849', 1500);
                    return false;
                }
            } else {
                auxiliarServices.NotificationMessage('Sistemas', data, 'error', '#ff6849', 3000);
                return false;
            }
        }

        if ($scope.Objeto_Parametro_deposito.importe_Deposito == '' || $scope.Objeto_Parametro_deposito.importe_Deposito == null || $scope.Objeto_Parametro_deposito.importe_Deposito == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el importe', 'error', '#ff6849', 1500);
            return false;
        }

        if ( $scope.Objeto_Parametro_deposito.importe_Deposito <= 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'El importe debe ser mayor  a cero', 'error', '#ff6849', 1500);
            return false;
        }
 
        $scope.loaderSaveD = true;
        $scope.Objeto_Parametro_deposito.id_ArqueoCaja = $scope.id_ArqueoCaja_Global;


        if ($scope.Flag_modoEdicionDeposito == false) { ///--- nuevo registroo -------
            ArqueoCajaServices.save_depositosArqueo($scope.Objeto_Parametro_deposito)
            .then(function (res) {

                $scope.Objeto_Parametro_deposito.fecha_Deposito = fecha_Deposito;
                if (res.ok == true) {
                    $scope.loaderSaveD = false;

                    const id_ArqueoCajaDeposito = res.data;

                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso de Registro realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {
                        });
                    }, 100)

                    if ($scope.files.length > 0) {
                        $scope.upload_imageComprobante(id_ArqueoCajaDeposito);
                    }  
                    $scope.blank_depositos();
                    $scope.closeModal_depositos();

                    $timeout(function () {
                        $scope.listados_depositos($scope.id_ArqueoCaja_Global);
                    }, 2000)

                } else {
                    $scope.loaderSaveD = false;
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.Objeto_Parametro_deposito.fecha_Deposito = fecha_Deposito;
                $scope.loaderSaveD = false;
                console.log(error)
            })
        } else { ///--- edicion registroo -------
 
            ArqueoCajaServices.update_depositosArqueo($scope.Objeto_Parametro_deposito)
                .then(function (res) {

                    $scope.Objeto_Parametro_deposito.fecha_Deposito = fecha_Deposito;

                    if (res.ok == true) {
                        $scope.loaderSaveD = false;

                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Proceso de Actualización realizado correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params).then(function (res) {
                            });
                        }, 100)

                        const id_ArqueoCajaDeposito = $scope.Objeto_Parametro_deposito.id_ArqueoCaja_Deposito;

                        if ($scope.files.length > 0) {
                            $scope.upload_imageComprobante(id_ArqueoCajaDeposito);
                        }  

                        $scope.blank_depositos();
                        $scope.closeModal_depositos();

                        $timeout(function () {
                            $scope.listados_depositos($scope.id_ArqueoCaja_Global);
                        }, 1500)

                    } else {
                        $scope.loaderSaveD = false;
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }
                }, function (error) {
                    $scope.Objeto_Parametro_deposito.fecha_Deposito = fecha_Deposito;
                    $scope.loaderSaveD = false;
                    console.log(error)
                })
        }
    }

    $scope.EdicionRegistros_depositos = function (obj) {

        $scope.Flag_modoEdicionDeposito = true;
        $scope.Objeto_Parametro_deposito = {
            id_ArqueoCaja_Deposito: obj.id_ArqueoCaja_Deposito,
            id_ArqueoCaja: obj.id_ArqueoCaja,
            fecha_Deposito: obj.fecha_Deposito,
            id_Banco: obj.id_Banco,
            nroOperario: obj.nroOperario,
            importe_Deposito: obj.importe_Deposito,
            adjuntarArchivo: obj.adjuntarArchivo,
            observaciones: obj.observaciones,
            estado: obj.estado,
            usuario_creacion: $scope.id_usuario_Global,
        };

        $scope.files = [];
        $("#inputFileOpen").val('');

        if (obj.adjuntarArchivo == '' || obj.adjuntarArchivo == null) {
            $scope.titleFile = 'Adjuntar Documento';
            $scope.showFileName = false;
        } else {
            $scope.showFileName = true;
            $scope.titleFile = 'Reemplazar Documento';
        }

        $timeout(function () {
            $('#modalDeposito').modal('show');
            $('#dtp_fechaDeposito').datepicker('setDate', new Date($scope.Objeto_Parametro_deposito.fecha_Deposito));
            $('#cbo_banco').val(obj.id_Banco).trigger('change.select2');
        }, 0);

    };

    $scope.changeImagen = function (event) {

        var filesTemporal = event.target.files; //FileList object       
        var fileE = [];
        for (var i = 0; i < event.target.files.length; i++) { //for multiple files          
            fileE.push({
                'file': filesTemporal[i]
            })

        }
        $scope.files = fileE;
        console.log($scope.files)
    };

    $scope.upload_imageComprobante = function (id_ArqueoCaja_Deposito) {

        console.log('enviando imgagen')
        $scope.loader = true;
        ArqueoCajaServices.uploadFile_imageComprobante($scope.files[0].file, id_ArqueoCaja_Deposito, $scope.id_usuario_Global)
            .then(function (res) {

                $scope.loader = false;
                if (res.ok == false) {
                    auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error almacenando la imagen.', 'error', '#ff6849', 2500);
                    alert(res.data);
                }
            }, function (error) {
                    $scope.loader = false;
                alert(error.ExceptionMessage)
            });
    };

    $scope.upload_imageComprobantePagos = function (id_ArqueoCajaEgresos) {

        console.log('enviando imgagen')
        $scope.loader = true;
        ArqueoCajaServices.uploadFile_imageComprobantePagos($scope.files[0].file, id_ArqueoCajaEgresos, $scope.id_usuario_Global)
            .then(function (res) {

                $scope.loader = false;
                if (res.ok == false) {
                    auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error almacenando la imagen.', 'error', '#ff6849', 2500);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loader = false;
                    alert(error)
            });
    };

    $scope.upload_imageComprobanteEgresos = function (id_ArqueoCajaEgresos) {
        console.log('enviando imagen')
        $scope.loader = true;
        ArqueoCajaServices.uploadFile_imageComprobanteEgresos($scope.files[0].file, id_ArqueoCajaEgresos, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == false) {
                    auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error almacenando la imagen.', 'error', '#ff6849', 2500);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loader = false;
                alert(error)
            });
    };

    $scope.descargarComprobanteDeposito = function (obj) { 
        //window.open(obj.urlImagen, '_blank');
        const id_link = document.getElementById('id_link');
        setTimeout(function () {
            id_link.href = obj.urlImagen;
            id_link.click();
        }, 0);    }

    $scope.openModal_pagoProveedor = function () {
        $('#modalPagoProveedor').modal('show');
        $scope.showFileName = false;
        $scope.showDeposit = false;

        $scope.titleFile = 'Adjuntar Documento';
        $scope.blank_pagos();
    }

    $scope.guardarInformacion_pagosProveedor = async function () {

        if ($scope.Objeto_Parametro_pagos.fecha_Registro == '' || $scope.Objeto_Parametro_pagos.fecha_Registro == null || $scope.Objeto_Parametro_pagos.fecha_Registro == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha Deposito', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_pagos.id_Anexo_Destino == '0' || $scope.Objeto_Parametro_pagos.id_Anexo_Destino == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Anexo', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_pagos.id_CC_Destino == '0' || $scope.Objeto_Parametro_pagos.id_CC_Destino == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Centro de Costo', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_pagos.id_MedioPago == '0' || $scope.Objeto_Parametro_pagos.id_MedioPago == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el medio de Pago', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_pagos.id_MedioPago == 2 || $scope.Objeto_Parametro_pagos.id_MedioPago == '2') { ///-- deposito 
            if ($scope.Objeto_Parametro_pagos.id_Banco == '0' || $scope.Objeto_Parametro_pagos.id_Banco == 0) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Banco', 'error', '#ff6849', 1500);
                return false;
            }
            if ($scope.Objeto_Parametro_pagos.nroOperario == '' || $scope.Objeto_Parametro_pagos.nroOperario == null || $scope.Objeto_Parametro_pagos.nroOperario == undefined) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nro Operacion', 'error', '#ff6849', 1500);
                return false;
            }
        }  

        if ($scope.Objeto_Parametro_pagos.idProveedor == '0' || $scope.Objeto_Parametro_pagos.idProveedor == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el proveedor', 'error', '#ff6849', 1500);
            return false;
        }


        const fechaDia = auxiliarServices.getDateNow();

        if ($scope.Objeto_Parametro_pagos.fecha_Registro > fechaDia) {

            auxiliarServices.NotificationMessage('Sistemas', 'La Fecha es mayor a la Fecha Actual, verifique', 'error', '#ff6849', 1500);
            return false;
        }

        const fecha_Registro = $scope.Objeto_Parametro_pagos.fecha_Registro;
        $scope.Objeto_Parametro_pagos.fecha_Registro = (!$scope.Objeto_Parametro_pagos.fecha_Registro) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_pagos.fecha_Registro);

        if ($scope.Flag_modoEdicionPagos == false ) {
            if ($scope.Objeto_Parametro_pagos.id_MedioPago == 2 || $scope.Objeto_Parametro_pagos.id_MedioPago == '2') { ///-- deposito 
                $scope.loader = true;
                const { ok, data } = await ArqueoCajaServices.validar_nroOperacionPagos($scope.Objeto_Parametro_pagos.id_Banco, $scope.Objeto_Parametro_pagos.nroOperario, $scope.Objeto_Parametro_pagos.fecha_Registro);
                $scope.loader = false;
                $scope.$apply();

                if (ok) {
                    if (data[0].cantRegistro == 1) {
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos este número de operación ya se registro con anterioridad', 'error', '#ff6849', 1500);
                        return false;
                    }
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', data, 'error', '#ff6849', 3000);
                    return false;
                }
            }
        }

        if ($scope.Objeto_Parametro_pagos.importe_Deposito == '' || $scope.Objeto_Parametro_pagos.importe_Deposito == null || $scope.Objeto_Parametro_pagos.importe_Deposito == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el importe', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_pagos.importe_Deposito <= 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'El importe debe ser mayor  a cero', 'error', '#ff6849', 1500);
            return false;
        }

        $scope.loaderSaveD = true;
        $scope.Objeto_Parametro_pagos.id_ArqueoCaja = $scope.id_ArqueoCaja_Global;


        if ($scope.Flag_modoEdicionPagos == false) { ///--- nuevo registroo -------
            ArqueoCajaServices.save_pagosArqueo($scope.Objeto_Parametro_pagos)
                .then(function (res) {

                    $scope.Objeto_Parametro_pagos.fecha_Registro = fecha_Registro;
                    if (res.ok == true) {
                        $scope.loaderSaveD = false;

                        const id_ArqueoCajaEgresos = res.data;

                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Proceso de Registro realizado correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params).then(function (res) {
                            });
                        }, 100)

                        if ($scope.files.length > 0) {
                            $scope.upload_imageComprobantePagos(id_ArqueoCajaEgresos);
                        }
                        $scope.blank_pagos();
                        $scope.closeModal_pagos();

                        $timeout(function () {
                            $scope.listados_pagos($scope.id_ArqueoCaja_Global);
                        }, 1500)

                    } else {
                        $scope.loaderSaveD = false;
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }
                }, function (error) {
                    $scope.Objeto_Parametro_pagos.fecha_Registro = fecha_Registro;
                    $scope.loaderSaveD = false;
                    console.log(error)
                })
        } else { ///--- edicion registroo -------

            ArqueoCajaServices.update_pagosArqueo($scope.Objeto_Parametro_pagos)
                .then(function (res) {

                    $scope.Objeto_Parametro_pagos.fecha_Registro = fecha_Registro;

                    if (res.ok == true) {
                        $scope.loaderSaveD = false;

                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Proceso de Actualización realizado correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params).then(function (res) {
                            });
                        }, 100)

                        const id_ArqueoCajaEgresos = $scope.Objeto_Parametro_pagos.id_ArqueoCaja_Egresos;

                        if ($scope.files.length > 0) {
                            $scope.upload_imageComprobantePagos(id_ArqueoCajaEgresos);
                        }

                        $scope.blank_pagos();
                        $scope.closeModal_pagos();

                        $timeout(function () {
                            $scope.listados_pagos($scope.id_ArqueoCaja_Global);
                        }, 1500)

                    } else {
                        $scope.loaderSaveD = false;
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }
                }, function (error) {
                    $scope.Objeto_Parametro_pagos.fecha_Registro = fecha_Registro;
                    $scope.loaderSaveD = false;
                    console.log(error)
                })
        }
    }

    $scope.EdicionRegistros_pagos = function (obj) {

        $scope.Flag_modoEdicionPagos = true;
        $scope.files = [];
        $("#inputFileOpenPago").val('');

        $scope.Objeto_Parametro_pagos = {
            id_ArqueoCaja_Egresos: obj.id_ArqueoCaja_Egresos,
            id_ArqueoCaja: obj.id_ArqueoCaja,
            fecha_Registro: obj.fecha_Registro,
            id_Anexo_Destino: obj.id_Anexo_Destino,
            id_CC_Destino: obj.id_CC_Destino,
            id_MedioPago: obj.id_MedioPago,
            id_Banco: obj.id_Banco,

            nroOperario: obj.nroOperario,
            adjuntarArchivo: obj.adjuntarArchivo,
            importe_Deposito: obj.importe_Deposito,
            idProveedor: obj.idProveedor,
            documentoReferencia: obj.documentoReferencia,
            observaciones: obj.observaciones,
            estado: obj.estado,
            usuario_creacion: $scope.id_usuario_Global
        };

        $scope.listados_changeCentroCosto_anexosPagos(obj.id_Anexo_Destino, obj.id_CC_Destino);


         
        if (obj.adjuntarArchivo == '' || obj.adjuntarArchivo == null) {
            $scope.titleFile = 'Adjuntar Documento';
            $scope.showFileName = false;
        } else {
            $scope.showFileName = true;
            $scope.titleFile = 'Reemplazar Documento';
        }

        if ($scope.Objeto_Parametro_pagos.id_MedioPago == 1 || $scope.Objeto_Parametro_pagos.id_MedioPago == '1') {
            $scope.showDeposit = false;
            $scope.Objeto_Parametro_pagos.id_Banco = '0';
            $scope.Objeto_Parametro_pagos.nroOperario = '';
        } else {
            $scope.showDeposit = true;
            $scope.Objeto_Parametro_pagos.nroOperario = '';
        } 

        $timeout(function () {
            $('#modalPagoProveedor').modal('show');
            $('#dtp_fechaPago').datepicker('setDate', new Date($scope.Objeto_Parametro_pagos.fecha_Registro));

            $('#cbo_anexoPago').val(obj.id_Anexo_Destino).trigger('change.select2');
            //$('#cbo_centroCostoPago').val(obj.id_CC_Destino).trigger('change.select2');
            $('#cbo_medioPago').val(obj.id_MedioPago).trigger('change.select2');
            $('#cbo_bancoPago').val(obj.id_Banco).trigger('change.select2');
            $('#cbo_proveedorPago').val(obj.idProveedor).trigger('change.select2');
            $("#cbo_medioPago").addClass("disabledContent");

        }, 0);

    };

    $scope.change_medioPago = function (idMedioPago) {

        if (idMedioPago == 1) {
            $scope.showDeposit = false;
            $timeout(function () {
                $scope.Objeto_Parametro_pagos.id_Banco = '0';
                $scope.Objeto_Parametro_pagos.nroOperario = '';
                $('#cbo_bancoPago').val("0").trigger('change.select2');
                $scope.files = [];
                $("#inputFileOpenPago").val('');
            }, 0);
        } else {
            $scope.showDeposit = true;
            $timeout(function () {
                $scope.Objeto_Parametro_pagos.id_Banco = '0';
                $scope.Objeto_Parametro_pagos.nroOperario = '';
                $('#cbo_bancoPago').val("0").trigger('change.select2');
            }, 0);
        }      
    }


    $scope.openModal_egresos = function () {
        $('#modalEgresos').modal('show');
        $scope.showFileName = false;
        $scope.titleFile = 'Adjuntar Documento';
        $scope.blank_egresos();

    }

    $scope.consultarRuc = function (nroRuc) {

        $scope.Objeto_Parametro_egresos.rucProveedor = '';
        $scope.Objeto_Parametro_egresos.razonsocialProveedor = '';

        if (nroRuc == '' || nroRuc == null || nroRuc == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el nro de Ruc', 'error', '#ff6849', 1500);
            return false;
        }

        $scope.loader = true;
        ArqueoCajaServices.get_consultaRuc(nroRuc.trim(), $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == true) {
                    console.log(res.data)

                    if (res.data.length > 0) {
                        $scope.Objeto_Parametro_egresos.rucProveedor = res.data[0].ruc  ;
                        $scope.Objeto_Parametro_egresos.razonsocialProveedor = res.data[0].razonSocial ;
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'No hay informacion con el Nro de Ruc ingresado ..', 'error', '#ff6849', 1500);
                        return false;
                    }
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loader = false;
                console.log(err);
            });



    }

    $scope.closeModal_egresos = function () {
        $('#modalEgresos').modal('hide');
    }

    $scope.guardarInformacion_egresos = async function () {

        if ($scope.Objeto_Parametro_egresos.id_TipoEgreso == '0' || $scope.Objeto_Parametro_egresos.id_TipoEgreso == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo Egreso', 'error', '#ff6849', 1500);
            return false;
        } else {
            if ($scope.Objeto_Parametro_egresos.id_TipoEgreso == '452' || $scope.Objeto_Parametro_egresos.id_TipoEgreso == 452) {
                if ($scope.Objeto_Parametro_egresos.id_ZonaEgreso == '0' || $scope.Objeto_Parametro_egresos.id_ZonaEgreso == 0) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Zona', 'error', '#ff6849', 1500);
                    return false;
                }
            }
        }

        if ($scope.Objeto_Parametro_egresos.fecha_Registro == '' || $scope.Objeto_Parametro_egresos.fecha_Registro == null || $scope.Objeto_Parametro_egresos.fecha_Registro == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha Egreso', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_egresos.id_Anexo_Destino == '0' || $scope.Objeto_Parametro_egresos.id_Anexo_Destino == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Anexo', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_egresos.id_CC_Destino == '0' || $scope.Objeto_Parametro_egresos.id_CC_Destino == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Centro de Costo', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_egresos.id_TipoDocumento == '0' || $scope.Objeto_Parametro_egresos.id_TipoDocumento == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo Documento', 'error', '#ff6849', 1500);
            return false;
        }  

        if ($scope.Objeto_Parametro_egresos.serieDocumento == '' || $scope.Objeto_Parametro_egresos.serieDocumento == null || $scope.Objeto_Parametro_egresos.serieDocumento == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la serie', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_egresos.numeroDocumento == '' || $scope.Objeto_Parametro_egresos.numeroDocumento == null || $scope.Objeto_Parametro_egresos.numeroDocumento == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el numero de documento', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_egresos.id_TipoDocumento == '1' || $scope.Objeto_Parametro_egresos.id_TipoDocumento == 1) { ///----obligatorio el ruc cuando es factura----
            if ($scope.Objeto_Parametro_egresos.rucProveedor == '' || $scope.Objeto_Parametro_egresos.rucProveedor == null || $scope.Objeto_Parametro_egresos.rucProveedor == undefined) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Nro Ruc del Proveedor y presione enter', 'error', '#ff6849', 1500);
                return false;
            }

            if ($scope.Objeto_Parametro_egresos.razonsocialProveedor.trim() == '' || $scope.Objeto_Parametro_egresos.razonsocialProveedor.trim() == null || $scope.Objeto_Parametro_egresos.razonsocialProveedor.trim() == undefined) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione enter para validar el nro Ruc..', 'error', '#ff6849', 1500);
                return false;
            }
        } else {

            if ($scope.Objeto_Parametro_egresos.razonsocialProveedor != '' || $scope.Objeto_Parametro_egresos.razonsocialProveedor != null || $scope.Objeto_Parametro_egresos.razonsocialProveedor != undefined) {
                if ($scope.Objeto_Parametro_egresos.rucProveedor == '' || $scope.Objeto_Parametro_egresos.rucProveedor == null || $scope.Objeto_Parametro_egresos.rucProveedor == undefined) {
                    $scope.Objeto_Parametro_egresos.razonsocialProveedor = '';
                }
            }

            if ($scope.Objeto_Parametro_egresos.rucProveedor.trim() != '') {
                if ($scope.Objeto_Parametro_egresos.razonsocialProveedor.trim() == '' || $scope.Objeto_Parametro_egresos.razonsocialProveedor.trim() == null || $scope.Objeto_Parametro_egresos.razonsocialProveedor.trim() == undefined) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor presione enter para validar el nro Ruc o no lo ingrese ..', 'error', '#ff6849', 1500);
                    return false;
                }
            }
        } 
        const fechaDia = auxiliarServices.getDateNow();
        if ($scope.Objeto_Parametro_egresos.fecha_Registro > fechaDia) {
            auxiliarServices.NotificationMessage('Sistemas', 'La Fecha es mayor a la Fecha Actual, verifique', 'error', '#ff6849', 1500);
            return false;
        }

        //if ($scope.Flag_modoEdicionEgresos == false) {
 
        //    $scope.loader = true;
        //    const { ok, data } = await ArqueoCajaServices.validar_nroOperacionPagos($scope.Objeto_Parametro_egresos.id_Banco, $scope.Objeto_Parametro_egresos.nroOperario, $scope.Objeto_Parametro_egresos.fecha_Registro);
        //    $scope.loader = false;
        //    $scope.$apply();

        //    if (ok) {
        //        if (data[0].cantRegistro == 1) {
        //            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos este número de operación ya se registro con anterioriodad', 'error', '#ff6849', 1500);
        //            return false;
        //        }
        //    } else {
        //        auxiliarServices.NotificationMessage('Sistemas', data, 'error', '#ff6849', 3000);
        //        return false;
        //    }
        
        //}

        if ($scope.Objeto_Parametro_egresos.importe_Egreso == '' || $scope.Objeto_Parametro_egresos.importe_Egreso == null || $scope.Objeto_Parametro_egresos.importe_Egreso == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el importe', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_egresos.importe_Egreso <= 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'El importe debe ser mayor  a cero', 'error', '#ff6849', 1500);
            return false;
        }

        const fecha_Registro = $scope.Objeto_Parametro_egresos.fecha_Registro;
        $scope.Objeto_Parametro_egresos.fecha_Registro = (!$scope.Objeto_Parametro_egresos.fecha_Registro) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_egresos.fecha_Registro);

        $scope.loaderSaveD = true;
        $scope.Objeto_Parametro_egresos.id_ArqueoCaja = $scope.id_ArqueoCaja_Global;

        if ($scope.Flag_modoEdicionEgresos == false) { ///--- nuevo registroo egresos -------
            ArqueoCajaServices.save_egresosArqueo($scope.Objeto_Parametro_egresos)
                .then(function (res) {

                    $scope.Objeto_Parametro_egresos.fecha_Registro = fecha_Registro;
                    if (res.ok == true) {
                        $scope.loaderSaveD = false;

                        const id_ArqueoCajaEgresos = res.data;

                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Proceso de Registro realizado correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params).then(function (res) {
                            });
                        }, 100)

                        if ($scope.files.length > 0) {
                            $scope.upload_imageComprobanteEgresos(id_ArqueoCajaEgresos);
                        }
                        $scope.blank_egresos();
                        $scope.closeModal_egresos();

                        $timeout(function () {
                            $scope.listados_egresos($scope.id_ArqueoCaja_Global);
                        }, 1500)

                    } else {
                        $scope.loaderSaveD = false;
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }
                }, function (error) {
                    $scope.Objeto_Parametro_egresos.fecha_Registro = fecha_Registro;
                    $scope.loaderSaveD = false;
                    console.log(error)
                })
        } else { ///--- edicion registroo egresos -------

            ArqueoCajaServices.update_egresosArqueo($scope.Objeto_Parametro_egresos)
                .then(function (res) {

                    $scope.Objeto_Parametro_egresos.fecha_Registro = fecha_Registro;

                    if (res.ok == true) {
                        $scope.loaderSaveD = false;

                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Proceso de Actualización realizado correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params).then(function (res) {
                            });
                        }, 100)

                        const id_ArqueoCajaEgresos = $scope.Objeto_Parametro_egresos.id_ArqueoCaja_Egresos;

                        if ($scope.files.length > 0) {
                            $scope.upload_imageComprobanteEgresos(id_ArqueoCajaEgresos);
                        }

                        $scope.blank_egresos();
                        $scope.closeModal_egresos();

                        $timeout(function () {
                            $scope.listados_egresos($scope.id_ArqueoCaja_Global);
                        }, 1500)

                    } else {
                        $scope.loaderSaveD = false;
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }
                }, function (error) {
                    $scope.Objeto_Parametro_egresos.fecha_Registro = fecha_Registro;
                    $scope.loaderSaveD = false;
                    console.log(error)
                })
        }
    }

    $scope.EdicionRegistros_egresos = function (obj) {

        $scope.Flag_modoEdicionEgresos = true;
        $scope.files = [];
        $("#inputFileOpenEgreso").val('');

        $scope.Objeto_Parametro_egresos = {
            id_ArqueoCaja_Egresos: obj.id_ArqueoCaja_Egresos,
            id_ArqueoCaja: obj.id_ArqueoCaja,
            id_TipoEgreso: String(obj.id_TipoEgreso),
            id_ZonaEgreso: String(obj.id_ZonaEgreso),

            fecha_Registro: obj.fecha_Registro,
            id_Anexo_Destino: String(obj.id_Anexo_Destino),
            id_CC_Destino: String(obj.id_CC_Destino),

            id_TipoDocumento: String(obj.id_TipoDocumento),
            serieDocumento: obj.serieDocumento,
            numeroDocumento: obj.numeroDocumento,
            rucProveedor: obj.rucProveedor,
            razonsocialProveedor: obj.razonsocialProveedor,

            importe_Egreso: obj.importe_Egreso,
            descripcionEgreso: obj.descripcionEgreso,
            id_TipoDocumento2: String(obj.id_TipoDocumento2),
            adjuntarArchivoEgreso: obj.adjuntarArchivoEgreso,
            nombreServidor: obj.nombreServidor,
            observacionesEgreso: obj.observacionesEgreso,
            estado: obj.estado,
            usuario_creacion: $scope.id_usuario_Global
        };
        $scope.listados_changeCentroCosto_anexosEgresos(obj.id_Anexo_Destino, obj.id_CC_Destino);



        if (obj.adjuntarArchivoEgreso == '' || obj.adjuntarArchivoEgreso == null) {
            $scope.titleFile = 'Adjuntar Documento';
            $scope.showFileName = false;
        } else {
            $scope.showFileName = true;
            $scope.titleFile = 'Reemplazar Documento';
        }


        $timeout(function () {
            $('#modalEgresos').modal('show');
            $('#dtp_fechaEgreso').datepicker('setDate', new Date($scope.Objeto_Parametro_egresos.fecha_Registro));

            $('#cbo_anexoEgreso').val(obj.id_Anexo_Destino).trigger('change.select2');
            $('#cbo_centroCostoEgreso').val(obj.id_CC_Destino).trigger('change.select2');
            $('#cbo_tipoEgreso').val(String(obj.id_TipoEgreso)).trigger('change.select2');
            $('#cbo_zonaEgreso').val(String(obj.id_ZonaEgreso)).trigger('change.select2');

            $('#cbo_tipoDocumento').val(obj.id_TipoDocumento).trigger('change.select2');
            $('#cbo_tipoDocumento2').val(obj.id_TipoDocumento2).trigger('change.select2');

        }, 0);

    };

    $scope.guardarInformacion_cobranzasDevoluciones = function () {

        var params = {
            title: "Desea Grabar ?",
            text: 'Esta por almacenar la informacion .',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                const fechaArqueoCaja = $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja;
                $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = (!$scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja);

                $scope.loaderSaveD = true;
                $scope.facturasVentas = [];
                $scope.boletasVentas = [];

                ArqueoCajaServices.set_almacenar_informacionVentas_cobranzasDevoluciones($scope.Objeto_Parametro_arqueoCaja.id_Anexo, $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta, $scope.Objeto_Parametro_arqueoCaja.id_CC, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja, $scope.id_ArqueoCaja_Global, $scope.id_usuario_Global)
                    .then(function (res) {

                        $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;

                        if (res.ok == true) {
                            $scope.loaderSaveD = false;
                            $timeout(function () {
                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Proceso de Registro realizado correctamente !'
                                }
                                auxiliarServices.initSweetAlert(params).then(function (res) {
                                });

                            }, 500)
                        } else {
                            $scope.loaderSaveD = false;
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(res.data);
                        }
                    }, function (error) {
                        $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                        $scope.loaderSaveD = false;
                        console.log(error)
                    })
            }
        });



    }

    $scope.cerrar_arqueoCaja = function () {

        var params = {
            title: "Desea Grabar ?",
            text: 'Esta seguro porque una vez cerrado no hay marcha Atras',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {

                if ($scope.Objeto_Parametro_arqueoCaja.id_Anexo == '0' || $scope.Objeto_Parametro_arqueoCaja.id_Anexo == 0) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Anexo', 'error', '#ff6849', 1500);
                    return false;
                }
                //if ($scope.Objeto_Parametro_arqueoCaja.id_ZonaVta == '0' || $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta == 0) {
                //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Zona', 'error', '#ff6849', 1500);
                //    return false;
                //}
                if ($scope.Objeto_Parametro_arqueoCaja.id_CC == '0' || $scope.Objeto_Parametro_arqueoCaja.id_CC == 0) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Centro Costo', 'error', '#ff6849', 1500);
                    return false;
                }
                if ($scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == '' || $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == null || $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == undefined) {
                    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha Arqueo', 'error', '#ff6849', 1500);
                    return false;
                }


                const fechaArqueoCaja = $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja;
                $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = (!$scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja);

                $scope.loaderSaveD = true;
                ArqueoCajaServices.set_cerrar_arqueoCajaCab($scope.Objeto_Parametro_arqueoCaja.id_Anexo, $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta, $scope.Objeto_Parametro_arqueoCaja.id_CC, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja, $scope.id_ArqueoCaja_Global, $scope.id_usuario_Global)
                    .then(function (res) {

                        $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;

                        if (res.ok == true) {
                            $scope.loaderSaveD = false;
                            $scope.nuevoArqueoCaja();
                            $timeout(function () {
                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Proceso de Registro realizado correctamente !'
                                }
                                auxiliarServices.initSweetAlert(params).then(function (res) {
                                });

                            }, 500)
                        } else {
                            $scope.loaderSaveD = false;
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(res.data);
                        }
                    }, function (error) {
                        $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                        $scope.loaderSaveD = false;
                        console.log(error)
                    })
            }
        });

    }

    $scope.descargarExcel_arqueoCaja = function () {
        $scope.loaderSaveD = true;
        ArqueoCajaServices.get_excelArqueoCaja($scope.id_ArqueoCaja_Global, $scope.id_usuario_Global)
            .then(function (res) {
                 if (res.ok == true) {
                    $scope.loaderSaveD = false;

                     const id_link = document.getElementById('id_link');
                     setTimeout(function () {
                         id_link.href = res.data;
                         id_link.click();
                     }, 0);             

                } else {
                    $scope.loaderSaveD = false;
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                $scope.loaderSaveD = false;
                console.log(error)
            })
    }
  
    $scope.mostrandoInformacion_Devoluciones = function () {

        if ($scope.Objeto_Parametro_arqueoCaja.id_Anexo == '0' || $scope.Objeto_Parametro_arqueoCaja.id_Anexo == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Anexo que esta en el Ficha Datos Generales', 'error', '#ff6849', 1500);
            return false;
        }
        //if ($scope.Objeto_Parametro_arqueoCaja.id_ZonaVta == '0' || $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta == 0) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Zona que esta en el Ficha Datos Generales', 'error', '#ff6849', 1500);
        //    return false;
        //}
        if ($scope.Objeto_Parametro_arqueoCaja.id_CC == '0' || $scope.Objeto_Parametro_arqueoCaja.id_CC == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Centro Costo que esta en el Ficha Datos Generales', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == '' || $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == null || $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha Arqueo', 'error', '#ff6849', 1500);
            return false;
        }

        const fechaArqueoCaja = $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja;
        $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = (!$scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja);

        $scope.loaderSaveD = true;
        $scope.devoluciones = []; 

        ArqueoCajaServices.get_informacionVentas_Devoluciones($scope.Objeto_Parametro_arqueoCaja.id_Anexo, $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta, $scope.Objeto_Parametro_arqueoCaja.id_CC, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loaderSaveD = false;
                $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;

                if (res.ok == true) {            
                    $scope.devoluciones = res.data.Devoluciones; 
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                $scope.loaderSaveD = false;
                console.log(error)
            })
    }

    $scope.guardarInformacion_Devoluciones = function () {

        var params = {
            title: "Desea Grabar ?",
            text: 'Esta por almacenar la informacion .',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {
                const fechaArqueoCaja = $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja;
                $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = (!$scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja);

                $scope.loaderSaveD = true;
                $scope.facturasVentas = [];
                $scope.boletasVentas = [];

                ArqueoCajaServices.set_almacenar_informacionVentas_Devoluciones($scope.Objeto_Parametro_arqueoCaja.id_Anexo, $scope.Objeto_Parametro_arqueoCaja.id_ZonaVta, $scope.Objeto_Parametro_arqueoCaja.id_CC, $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja, $scope.id_ArqueoCaja_Global, $scope.id_usuario_Global)
                    .then(function (res) {

                        $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;

                        if (res.ok == true) {
                            $scope.loaderSaveD = false;
                            $timeout(function () {
                                let params = {
                                    type: 'alert',
                                    title: 'Excelente !',
                                    text: 'Proceso de Registro realizado correctamente !'
                                }
                                auxiliarServices.initSweetAlert(params).then(function (res) {
                                });

                            }, 500)
                        } else {
                            $scope.loaderSaveD = false;
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(res.data);
                        }
                    }, function (error) {
                        $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                        $scope.loaderSaveD = false;
                        console.log(error)
                    })
            }
        });



    }

    $scope.lista_estados = []; 
    $scope.listados_estados= function () {
        $scope.loaderSaveD = true;
        ArqueoCajaServices.get_estados($scope.id_usuario_Global).then(function (res) {
            $scope.loaderSaveD = false;
            if (res.ok == true) {
                $scope.lista_estados = [];
                $scope.lista_estados = res.data;
                $timeout(function () {
                    $('#cbo_estado').val('0').trigger('change.select2');
                })
            } else {
                auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                alert(res.data);
            }
        }, function (err) {
            $scope.loaderSaveD = false;
            console.log(err);
        });
    };
    $scope.listados_estados();

    $scope.nuevoArqueoCaja = function () {
        $scope.limpiando_ArqueoCaja();
        $scope.inicializandoCombosArqueo();
    }

    $scope.limpiando_ArqueoCaja = function () {

        //-----bloqueando las fichas 
        $scope.disabledCabecera = "";
        $scope.id_ArqueoCaja_Global = 0;
        $scope.Flag_modoEdicion = false;
        $scope.Flag_modoEdicionDeposito = false;
        $scope.Flag_modoEdicionPagos = false;
        $scope.Flag_modoEdicionEgresos = false;
        $scope.disabledContent = '';

        $scope.files = [];
        $scope.showFileName = false;
        $scope.showDeposit = false;

       $scope.listados_monedasBilletes();

        $scope.facturasVentas = [];
        $scope.boletasVentas = [];

        $scope.depositos = [];
        $scope.ResumenDepositos = [];

        $scope.pagos = [];

        $scope.egresos = [];
        $scope.ResumenEgresos = [];

        $scope.cobranzas = [];
        $scope.cobranzas_II = [];
        $scope.cobranzas_resumen = [];

        $scope.devoluciones = [];

        $scope.calcularTotales_general();
        $scope.totalVentasDocumentos(); 

        //----enfoncando el Tab General
        $scope.setTab(2)
    }

    $scope.inicializandoCombosArqueo = function () {
        $scope.Objeto_Parametro_arqueoCaja = {
            id_ArqueoCaja: '0',
            id_ZonaVta: '0',
            id_Anexo: '0',
            id_CC: '0',
            fechaArqueoCaja: auxiliarServices.getDateNow(),
            nroArqueoCaja: '',
            id_Personal_Rinde: '0',
            id_Personal_Responsable: '0',
            id_Personal_Supervisor: '0',
            fechaSaldoInicial: '',
            importeSaldoInicial: '',
            estado: '38',
            usuario_creacion: $scope.id_usuario_Global,
        };

        $timeout(function () {
            $('#cbo_anexo').val("0").trigger('change.select2');
            $('#cbo_zonas').val("0").trigger('change.select2');
            $('#cbo_centroCosto').val("0").trigger('change.select2');

            $('#cbo_rinde').val('0').trigger('change.select2');
            $('#cbo_responsable').val('0').trigger('change.select2');
            $('#cbo_supervisor').val('0').trigger('change.select2');
        }, 0);
    }

    $scope.lista_arqueosCab = [];
    $scope.mostrandoInformacion_arqueosCaja = function () {

        if ($scope.Objeto_Parametro_filtro.id_Anexo == '0' || $scope.Objeto_Parametro_filtro.id_Anexo == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione un Anexo ', 'error', '#ff6849', 1500);
            return false;
        }
        //if ($scope.Objeto_Parametro_filtro.id_ZonaVta == '0' || $scope.Objeto_Parametro_filtro.id_ZonaVta == 0) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione una Zona ', 'error', '#ff6849', 1500);
        //    return false;
        //}
        if ($scope.Objeto_Parametro_filtro.id_CC == '0' || $scope.Objeto_Parametro_filtro.id_CC == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Centro Costo', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_filtro.fechaIni == '' || $scope.Objeto_Parametro_filtro.fechaIni == null || $scope.Objeto_Parametro_filtro.fechaIni == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha Arqueo Inicial', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_filtro.fechaFin == '' || $scope.Objeto_Parametro_filtro.fechaFin == null || $scope.Objeto_Parametro_filtro.fechaFin == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha Arqueo Final', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_filtro.id_estado == '0' || $scope.Objeto_Parametro_filtro.id_estado == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor el Estado', 'error', '#ff6849', 1500);
            return false;
        }

        const fechaIni = (!$scope.Objeto_Parametro_filtro.fechaIni) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_filtro.fechaIni);
        const fechaFin = (!$scope.Objeto_Parametro_filtro.fechaFin) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_filtro.fechaFin);

        $scope.loaderSaveD = true;
        $scope.lista_arqueosCab = [];

        ArqueoCajaServices.get_listados_arqueoCajaCab($scope.Objeto_Parametro_filtro.id_Anexo, 0 , $scope.Objeto_Parametro_filtro.id_CC, fechaIni, fechaFin, $scope.Objeto_Parametro_filtro.id_estado, $scope.id_usuario_Global)
            .then(function (res) {

                if (res.ok == true) {
                    $scope.loaderSaveD = false;
                    $scope.lista_arqueosCab = res.data;
                } else {
                    $scope.loaderSaveD = false;
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {

                $scope.loaderSaveD = false;
                console.log(error)
            })
    }

    $scope.EdicionRegistros_arqueoCajaCab = function (obj) {

        console.log(obj)

       $scope.limpiando_ArqueoCaja();
        $timeout(function () {

            $scope.id_ArqueoCaja_Global = obj.id_ArqueoCaja;

           $scope.mostrandoInformacion_arqueosCajaEdicion(obj.id_ArqueoCaja);
           $scope.mostrar_arqueoCajaCab_billetesMonedas_edicion();
           $scope.mostrar_arqueoCajaCab_ventas_edicion(obj.id_ArqueoCaja);
           $scope.listados_depositos(obj.id_ArqueoCaja);
           $scope.listados_pagos(obj.id_ArqueoCaja);
           $scope.listados_egresos(obj.id_ArqueoCaja);
           $scope.mostrar_arqueoCajaCab_cobranzas_edicion(obj.id_ArqueoCaja);
           $scope.mostrar_arqueoCajaCab_devoluciones_edicion(obj.id_ArqueoCaja);
       }, 500);

    };

    $scope.mostrandoInformacion_arqueosCajaEdicion = function () {
        $scope.loaderSaveD = true;
        ArqueoCajaServices.get_arqueoCajaCab_edicion($scope.id_ArqueoCaja_Global, $scope.id_usuario_Global)
            .then(function (res) {

                if (res.ok == true) {
                    $scope.loaderSaveD = false;
                    const { id_ArqueoCaja, id_ZonaVta, id_Anexo, id_CC, fechaArqueoCaja, nroArqueoCaja,  id_Personal_Rinde, id_Personal_Responsable, id_Personal_Supervisor, fechaSaldoInicial, importeSaldoInicial, estado  } = res.data[0];

                    $scope.Objeto_Parametro_arqueoCaja = {
                        id_ArqueoCaja,
                        id_ZonaVta ,
                        id_Anexo,
                        id_CC,
                        fechaArqueoCaja,
                        nroArqueoCaja,
                        id_Personal_Rinde ,
                        id_Personal_Responsable,
                        id_Personal_Supervisor,
                        fechaSaldoInicial,
                        importeSaldoInicial,
                        estado,
                        usuario_creacion: $scope.id_usuario_Global,
                    };

                    $scope.disabledContent = "disabledContent";

                     $timeout(function () {
                         $('#dtpFechaArqueo').datepicker('setDate', new Date($scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja));
                         $('#dtpFechaSaldoIni').datepicker('setDate', new Date($scope.Objeto_Parametro_arqueoCaja.fechaSaldoInicial));

                         $('#cbo_anexo').val(id_Anexo).trigger('change.select2'); 
                         $scope.listados_changeAnexoZonas(id_Anexo, id_ZonaVta, id_CC);
                         $scope.listados_changeAnexoZonasArqueo();

                         $('#cbo_rinde').val(id_Personal_Rinde).trigger('change.select2');
                         $('#cbo_responsable').val(id_Personal_Responsable).trigger('change.select2');
                         $('#cbo_supervisor').val(id_Personal_Supervisor).trigger('change.select2');

                      }, 0);

                } else {
                    $scope.loaderSaveD = false;
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {

                $scope.loaderSaveD = false;
                console.log(error)
            })
    }

    $scope.mostrar_arqueoCajaCab_billetesMonedas_edicion = function () {

        const idZona = $scope.Objeto_Parametro_filtro.id_ZonaVta;

        for (item of $scope.lista_billeteReparto) {
                item.cantidad = '';
                item.importe = '';
        }
        for (item of $scope.lista_monedasReparto) {
            item.cantidad = '';
            item.importe = '';
        }
        for (item of $scope.lista_billeteCaja) {
            item.cantidad = '';
            item.importe = '';
        }
        for (item of $scope.lista_monedasCaja) {
            item.cantidad = '';
            item.importe = '';
        }

        $scope.loaderSaveD = true;
        ArqueoCajaServices.get_arqueoCaja_monedasBilletes_edicion($scope.id_ArqueoCaja_Global, $scope.id_usuario_Global, idZona)
            .then(function (res) {
 
                if (res.ok == true) {
                    $scope.loaderSaveD = false;

                    for (var i = 0; i < res.data.length; i++) {

                         //---- REPARTO ----
                        if (res.data[i].id_Tipo == 1) {

                            if (res.data[i].tipo_BilleteMoneda == 'B') {
                                for (item of $scope.lista_billeteReparto) {
                                    if (res.data[i].id_BilleteMoneda == item.id_BilleteMoneda ) {
                                        item.cantidad = res.data[i].cantidad_Billete;
                                        item.importe = res.data[i].total_Billete;
                                    }
                                }
                            }

                            if (res.data[i].tipo_BilleteMoneda == 'M') {
                                for (item of $scope.lista_monedasReparto) {
                                    if (res.data[i].id_BilleteMoneda == item.id_BilleteMoneda) {
                                        item.cantidad = res.data[i].cantidad_Billete;
                                        item.importe = res.data[i].total_Billete;
                                    }
                                }
                            }

                        }
                        //---- CAJA CHICA ----
                        if (res.data[i].id_Tipo == 2) {

                            if (res.data[i].tipo_BilleteMoneda == 'B') {
                                for (item of $scope.lista_billeteCaja) {
                                    if (res.data[i].id_BilleteMoneda == item.id_BilleteMoneda) {
                                        item.cantidad = res.data[i].cantidad_Billete;
                                        item.importe = res.data[i].total_Billete;
                                    }
                                }
                            }

                            if (res.data[i].tipo_BilleteMoneda == 'M') {
                                for (item of $scope.lista_monedasCaja) {
                                    if (res.data[i].id_BilleteMoneda == item.id_BilleteMoneda) {
                                        item.cantidad = res.data[i].cantidad_Billete;
                                        item.importe = res.data[i].total_Billete;
                                    }
                                }
                            }

                        }

                    }

                    $scope.calcularTotales_general();

                } else {
                    $scope.loaderSaveD = false;
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderSaveD = false;
                console.log(error)
            })
    }

    $scope.mostrar_arqueoCajaCab_ventas_edicion = function (id_ArqueoCaja) {
 
        $scope.loaderSaveD = true;
        $scope.facturasVentas = [];
        $scope.boletasVentas = [];

        ArqueoCajaServices.get_arqueoCaja_ventas_edicion(id_ArqueoCaja, $scope.id_usuario_Global)
            .then(function (res) {

                if (res.ok == true) {
                    $scope.loaderSaveD = false;
                    $scope.facturasVentas = [];
                    $scope.boletasVentas = [];

                    $scope.facturasVentas = res.data.filter((f) => f.idTipoDoc == 1);
                    $scope.boletasVentas = res.data.filter((f) => f.idTipoDoc == 2);

                    $scope.totalVentasDocumentos();

                } else {
                    $scope.loaderSaveD = false;
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderSaveD = false;
                console.log(error)
            })
    }

    //---- pendiente
    $scope.mostrar_arqueoCajaCab_cobranzas_edicion = function (id_ArqueoCaja) {
        $scope.loaderCD = true;
        $scope.cobranzas = [];
        $scope.cobranzas_resumen = [];

        ArqueoCajaServices.get_arqueoCaja_cobranzas_edicion( id_ArqueoCaja, $scope.id_usuario_Global)
            .then(function (res) {
                if (res.ok == true) {
                    $scope.loaderCD = false;
                    $scope.cobranzas = res.data.cobranzas;
                    $scope.cobranzas_resumen = res.data.cobranzas_resumen;
                } else {
                    $scope.loaderCD = false;
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.Objeto_Parametro_arqueoCaja.fechaArqueoCaja = fechaArqueoCaja;
                $scope.loaderCD = false;
                console.log(error)
            })
    }

    $scope.mostrar_arqueoCajaCab_devoluciones_edicion = function (id_ArqueoCaja) { 
        $scope.loaderCD = true;
        $scope.devoluciones = [];

        ArqueoCajaServices.get_arqueoCaja_devoluciones_edicion(id_ArqueoCaja, $scope.id_usuario_Global)
            .then(function (res) {
                if (res.ok == true) {
                    $scope.loaderCD = false;
                    $scope.devoluciones = res.data.Devoluciones;
                } else {
                    $scope.loaderCD = false;
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loaderCD = false;
                console.log(error)
            })
    }

    $scope.anular_arqueoCaja = function (obj) {
 
        if (parseInt(obj.idEstado) === 39 || parseInt(obj.idEstado) === 40) {
            return;
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Anular el arqueo Caja.',
            type: 'confirmationAlert'
        };

        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res === true) {
                $scope.loaderCD = true;
                ArqueoCajaServices.set_arqueoCaja_anular(obj.id_ArqueoCaja, $scope.id_usuario_Global )
                    .then(function (res) {
                        $scope.loaderCD = false;
                        if (res.ok == true) {

 

                            $scope.loaderCD = false;
                            var index = $scope.lista_arqueosCab.indexOf(obj);
                            $scope.lista_arqueosCab[index].idEstado = 40;
                            $scope.lista_arqueosCab[index].descripcionEstado = 'Anulado';

                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Se rechazó el Pedido Correctamente. !'
                            };
                            auxiliarServices.initSweetAlert(params).then(function (res) {

                            });
                        } else {
                            $scope.loaderCD = false;
                            auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                            alert(res.data);
                        }


 
                    }, function (error) {
                        $scope.loaderCD = false;
                        console.log(error);
                    });
            }
        });
 

    };

    ///-- mantenimiento de proveedores
    $scope.Open_New_ModalProveedor = function () {
        $scope.clean();
        $scope.Flag_modoEdicionProveedor = false;
        $('#modalProveedores').modal('show');
        $scope.validarRuc('');

        let txtnumero_doc = document.getElementById("txtnumero_doc");

        $timeout(function () {
            txtnumero_doc.classList.remove("disabledContent");
        }, 100);
    }

    $scope.objeto_Parametros = {
        id_Proveedor: 0,
        nroDocumento_Proveedor: '',
        tipoPersona_Proveedor: '',
        razonSocial_Proveedor: '',
        direccion_Proveedor: '',
        telefono1_Proveedor: '',
        telefono2_Proveedor: '',
        contacto_Proveedor: '',
        estado: 0,
        usuario_Creacion: 0,
        id_CondicionPago: '0',
        id_Banco: '0',
        id_Moneda: '1',
        nroCuenta: '',
        CCINro: '',
        email_Proveedor: ''
    }

    $scope.clean = function () {
        $scope.objeto_Parametros.id_Proveedor = 0;
        $scope.objeto_Parametros.nroDocumento_Proveedor = '';
        $scope.objeto_Parametros.tipoPersona_Proveedor = '';
        $scope.objeto_Parametros.razonSocial_Proveedor = '';
        $scope.objeto_Parametros.direccion_Proveedor = '';
        $scope.objeto_Parametros.telefono1_Proveedor = '';
        $scope.objeto_Parametros.telefono2_Proveedor = '';
        $scope.objeto_Parametros.contacto_Proveedor = '';
        $scope.objeto_Parametros.estado = 1;
        $scope.objeto_Parametros.usuario_Creacion = 1;
        $scope.objEstados.activo = true;
        $scope.objEstados.text = 'Activo';
        $scope.objEstados.colorText = '#2c5ca9';

        $scope.objeto_Parametros.id_CondicionPago = '0';
        $scope.objeto_Parametros.id_Banco = '0';
        $scope.objeto_Parametros.id_Moneda = '1';
        $scope.objeto_Parametros.nroCuenta = '';
        $scope.objeto_Parametros.CCINro = '';
        $scope.objeto_Parametros.email_Proveedor = '';

        $timeout(function () {
            $('#cbo_cond_facturacion').val('0').trigger('change.select2');
            $('#cbo_bancoProveedor').val('0').trigger('change.select2');
            $('#cboMoneda').val('1').trigger('change.select2');
        }, 0);
    }

    $scope.flagRucValido = false;
    $scope.validarRuc = function (valorRuc) {

        let resultado = document.getElementById("resultado");
        let ruc = valorRuc.replace(/[-.,[\]()\s]+/g, "");

        const mensajeRes = (ruc, valido) => {
            if (valido == "Válido") {
                resultado.classList.add("ok");
            } else {
                resultado.classList.remove("ok");
            }
            resultado.innerText = "RUC: " + ruc + "\nFormato: " + valido;
        }

        if (valorRuc == '' || valorRuc == null || valorRuc == undefined) {
            mensajeRes(ruc, "No válido");
            $scope.flagRucValido = false;
            return;
        }
        //Es entero?    
        if ((ruc = Number(ruc)) && ruc % 1 === 0 && rucValido(ruc)) {
            mensajeRes(ruc, "Válido");
            $scope.flagRucValido = true;
        } else {
            mensajeRes(ruc, "No válido");
            $scope.flagRucValido = false;
        }
    }

    // Devuelve un booleano si es un RUC válido
    // (deben ser 11 dígitos sin otro caracter en el medio)
    function rucValido(ruc) {
        //11 dígitos y empieza en 10,15,16,17 o 20
        if (!(ruc >= 1e10 && ruc < 11e9
            || ruc >= 15e9 && ruc < 18e9
            || ruc >= 2e10 && ruc < 21e9))
            return false;

        for (var suma = -(ruc % 10 < 2), i = 0; i < 11; i++, ruc = ruc / 10 | 0)
            suma += (ruc % 10) * (i % 7 + (i / 7 | 0) + 1);
        return suma % 11 === 0;

    }

    $scope.objEstados = {
        activo: true,
        text: 'Activo',
        colorText: '#2c5ca9'
    }

    $scope.changeStatus = function (status) {
        if (status) {
            $scope.objEstados.activo = true;
            $scope.objEstados.text = "Activo";
            $scope.objEstados.colorText = "#2c5ca9";
        } else {
            $scope.objEstados.activo = false;
            $scope.objEstados.text = "Inactivo";
            $scope.objEstados.colorText = "#b3192c";
        }
    }

    $scope.GuardarRegistro = function () {

        if (ProveedorServices.ValidacionGeneral($scope.objeto_Parametros) == false) {
            return;
        }
        $scope.objeto_Parametros.estado = $scope.objEstados.activo == true ? 1 : 0;
        
        const saveProveedor = () => {
            $scope.loaderSave = true;
            ProveedorServices.save_Proveedor($scope.objeto_Parametros)
                .then(function (data) {

                    $scope.Objeto_Parametro_egresos.rucProveedor = $scope.objeto_Parametros.nroDocumento_Proveedor;
                    $scope.Objeto_Parametro_egresos.razonsocialProveedor = $scope.objeto_Parametros.razonSocial_Proveedor

                    $timeout(function () {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso de Registro realizado correctamente !'
                        }
                        auxiliarServices.initSweetAlert(params).then(function (res) {
                            $('#modalProveedores').modal('hide');
                        });
                        $scope.loaderSave = false;
                    }, 500)
                }, function (error) {
                    $timeout(function () {
                        let paramsErr = {
                            type: 'error',
                            title: 'Error !',
                            text: 'Ocurrio un problema con la conexión, vuelva a intentarlo. !!'
                        }
                        auxiliarServices.initSweetAlert(paramsErr).then(function (res) {

                        });
                        $scope.loaderSave = false;
                        console.log(err);
                    }, 500)
                })
        }

        if ($scope.flagRucValido == false) {
            var params = {
                title: "Desea continuar ?",
                text: 'Aunque el Ruc no es Valido.',
                type: 'confirmationAlert',
            }
            auxiliarServices.initSweetAlert(params).then(function (res) {
                if (res == true) {
                    saveProveedor();
                }
            });
        } else {
            saveProveedor();
        }       
    }


    //----- COBRANZAS -----


    $scope.blank_cobranzas = function () {
        $scope.Flag_modoEdicionCobranzas = false;
        $scope.showFileName = false;

        $scope.Objeto_Parametro_cobranzas = {
            id_ArqueoCaja_Cobranza: '0',
            id_ArqueoCaja: '0',
            id_zona: '0',
            fecha_cobranza: auxiliarServices.getDateNow(),
            id_Factura_Cab: '0',
            id_TipoDocumento: '0',
            serie_Documento: '',
            numero_Documento: '',
            importe_Documento: '',
            cliente_Documento: '',
            id_MedidoPago: '1',
            id_Banco: '0',
            nro_operacionBanco: '',
            adjuntarArchivoBanco: '',
            nombreArchivoServidor: '',
            importePago: '',
            observaciones: '',
            estado: '1',
            usuario_creacion: $scope.id_usuario_Global
        };

        $timeout(function () {       
            $('#cbo_zonaCobranza').val("0").trigger('change.select2');
            $('#cbo_tipoDocumentoCobranza').val("0").trigger('change.select2');
            $('#cbo_medioPagoCobranza').val("1").trigger('change.select2');

            $('#cbo_bancoCobranza').val("0").trigger('change.select2');
            $('#dtp_fechaCobranza').datepicker('setDate', new Date());
        }, 0);

        $scope.files = [];
        $("#inputFileOpenCobranza").val('');

    }

    $scope.changeImagen_cobranza = function (event) {

        var filesTemporal = event.target.files; //FileList object       
        var fileE = [];
        for (var i = 0; i < event.target.files.length; i++) { //for multiple files          
            fileE.push({
                'file': filesTemporal[i]
            })

        }
        $scope.files = fileE;
        console.log($scope.files)
    };

    $scope.openModal_cobranzas = function () {
        $('#modalCobranzas').modal('show');
        $scope.showFileName = false;
        $scope.titleFile = 'Adjuntar Documento';
        $scope.blank_cobranzas();
    }

    $scope.change_medioPagoCobranza = function (idMedioPago) {
        if (idMedioPago == 1) {
            $scope.showDeposit = false;
            $timeout(function () {
                $scope.Objeto_Parametro_cobranzas.id_Banco = '0';
                $scope.Objeto_Parametro_cobranzas.nro_operacionBanco = '';
                $('#cbo_bancoCobranza').val("0").trigger('change.select2');
                $scope.files = [];
                $("#inputFileOpenCobranza").val('');
            }, 0);
        } else {
            $scope.showDeposit = true;
            $timeout(function () {
                $scope.Objeto_Parametro_cobranzas.id_Banco = '0';
                $scope.Objeto_Parametro_cobranzas.nro_operacionBanco = '';
                $('#cbo_bancoCobranza').val("0").trigger('change.select2');
            }, 0);
        }
    }

    $scope.closeModal_cobranzas = function () {
        $('#modalCobranzas').modal('hide');
    }

    $scope.guardarInformacion_cobranzas = async function () {

        $scope.Objeto_Parametro_cobranzas.id_zona = $scope.Objeto_Parametro_filtro.id_ZonaVta
        if ($scope.Objeto_Parametro_cobranzas.id_zona == '0' || $scope.Objeto_Parametro_cobranzas.id_zona == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Zona', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_cobranzas.id_TipoDocumento == '0' || $scope.Objeto_Parametro_cobranzas.id_TipoDocumento == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Documento', 'error', '#ff6849', 1500);
            return false;
        } 
        if ($scope.Objeto_Parametro_cobranzas.serie_Documento == '' || $scope.Objeto_Parametro_cobranzas.serie_Documento == null || $scope.Objeto_Parametro_cobranzas.serie_Documento == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Serie', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_cobranzas.numero_Documento == '' || $scope.Objeto_Parametro_cobranzas.numero_Documento == null || $scope.Objeto_Parametro_cobranzas.numero_Documento == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el numero de Documento', 'error', '#ff6849', 1500);
            return false;
        }
        //if ($scope.Objeto_Parametro_cobranzas.id_Factura_Cab == '0' || $scope.Objeto_Parametro_cobranzas.id_Factura_Cab == 0) {
        //    auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el la serie y el numero del documento luego presione la tecla Enter', 'error', '#ff6849', 1500);
        //    return false;
        //}

        if ($scope.Objeto_Parametro_cobranzas.fecha_cobranza == '' || $scope.Objeto_Parametro_cobranzas.fecha_cobranza == null || $scope.Objeto_Parametro_cobranzas.fecha_cobranza == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Fecha  de la Cobranza', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_cobranzas.id_MedidoPago == '2' || $scope.Objeto_Parametro_cobranzas.id_MedidoPago == 2) {
            if ($scope.Objeto_Parametro_cobranzas.id_Banco == '0' || $scope.Objeto_Parametro_cobranzas.id_Banco == 0) {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Banco', 'error', '#ff6849', 1500);
                return false;
            }
            if ($scope.Objeto_Parametro_cobranzas.nro_operacionBanco == '')  {
                auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el numero de Operación', 'error', '#ff6849', 1500);
                return false;
            }
        }

        if ($scope.Objeto_Parametro_cobranzas.importePago == '' || $scope.Objeto_Parametro_cobranzas.importePago == null || $scope.Objeto_Parametro_cobranzas.importePago == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el Importe de la Cobranza', 'error', '#ff6849', 1500);
            return false;
        }

        if ($scope.Objeto_Parametro_cobranzas.importePago <= 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'El importe debe ser mayor  a cero', 'error', '#ff6849', 1500);
            return false;
        }

        const fecha_Registro = $scope.Objeto_Parametro_cobranzas.fecha_cobranza;
        $scope.Objeto_Parametro_cobranzas.fecha_cobranza = (!$scope.Objeto_Parametro_cobranzas.fecha_cobranza) ? null : auxiliarServices.changeFormatDate(2, $scope.Objeto_Parametro_cobranzas.fecha_cobranza);

        $scope.loaderSaveD = true;
        $scope.Objeto_Parametro_cobranzas.id_ArqueoCaja = $scope.id_ArqueoCaja_Global;

        if ($scope.Flag_modoEdicionCobranzas == false) { ///--- nuevo registroo egresos -------
            ArqueoCajaServices.save_cobranzasArqueo($scope.Objeto_Parametro_cobranzas)
                .then(function (res) {

                    $scope.Objeto_Parametro_cobranzas.fecha_cobranza = fecha_Registro;
                    if (res.ok == true) {
                        $scope.loaderSaveD = false;

                        const id_ArqueoCajaCobranza = res.data;

                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Proceso de Registro realizado correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params).then(function (res) {
                            });
                        }, 100)

                        if ($scope.files.length > 0) {
                            $scope.upload_imageComprobanteCobranza(id_ArqueoCajaCobranza);
                        }
                        $scope.blank_cobranzas();
                        $scope.closeModal_cobranzas();

                        $timeout(function () {
                            $scope.mostrar_arqueoCajaCab_cobranzas_edicion($scope.id_ArqueoCaja_Global);
                        }, 1500)

                    } else {
                        $scope.loaderSaveD = false;
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }
                }, function (error) {
                    $scope.Objeto_Parametro_cobranzas.fecha_cobranza = fecha_Registro;
                    $scope.loaderSaveD = false;
                    console.log(error)
                })
        } else { ///--- edicion registroo egresos -------

            ArqueoCajaServices.update_cobranzaArqueo($scope.Objeto_Parametro_cobranzas)
                .then(function (res) {

                    $scope.Objeto_Parametro_cobranzas.fecha_cobranza = fecha_Registro;

                    if (res.ok == true) {
                        $scope.loaderSaveD = false;

                        $timeout(function () {
                            let params = {
                                type: 'alert',
                                title: 'Excelente !',
                                text: 'Proceso de Actualización realizado correctamente !'
                            }
                            auxiliarServices.initSweetAlert(params).then(function (res) {
                            });
                        }, 100)

                        const id_ArqueoCajaCobranza = $scope.Objeto_Parametro_cobranzas.id_ArqueoCaja_Egresos;

                        if ($scope.files.length > 0) {
                            $scope.upload_imageComprobanteCobranza(id_ArqueoCajaCobranza);
                        }

                        $scope.blank_cobranzas();
                        $scope.closeModal_cobranzas();

                        $timeout(function () {
                            $scope.mostrar_arqueoCajaCab_cobranzas_edicion($scope.id_ArqueoCaja_Global);
                        }, 1500)

                    } else {
                        $scope.loaderSaveD = false;
                        auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                        alert(res.data);
                    }
                }, function (error) {
                    $scope.Objeto_Parametro_cobranzas.fecha_cobranza = fecha_Registro;
                    $scope.loaderSaveD = false;
                    console.log(error)
                })
        }
    }

    $scope.upload_imageComprobanteCobranza = function (id_ArqueoCajaCobranza) {
        console.log('enviando imagen COBRANZA')
        $scope.loader = true;
        ArqueoCajaServices.uploadFile_imageComprobanteCobranza($scope.files[0].file, id_ArqueoCajaCobranza, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loader = false;
                if (res.ok == false) {
                    auxiliarServices.NotificationMessage('Sistemas', 'se ha producido un error almacenando la imagen.', 'error', '#ff6849', 2500);
                    alert(res.data);
                }
            }, function (error) {
                $scope.loader = false;
                alert(error)
            });
    };

    $scope.buscarDocumentoCobranza = function () {

        $scope.Objeto_Parametro_cobranzas.id_zona = $scope.Objeto_Parametro_filtro.id_ZonaVta;
        console.log($scope.Objeto_Parametro_filtro.id_ZonaVta)

        if ($scope.Objeto_Parametro_cobranzas.id_zona == '0' || $scope.Objeto_Parametro_cobranzas.id_zona == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione la Zona', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_cobranzas.id_TipoDocumento == '0' || $scope.Objeto_Parametro_cobranzas.id_TipoDocumento == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione el Tipo de Documento', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_cobranzas.serie_Documento == '' || $scope.Objeto_Parametro_cobranzas.serie_Documento == null || $scope.Objeto_Parametro_cobranzas.serie_Documento == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese la Serie', 'error', '#ff6849', 1500);
            return false;
        }
        if ($scope.Objeto_Parametro_cobranzas.numero_Documento == '' || $scope.Objeto_Parametro_cobranzas.numero_Documento == null || $scope.Objeto_Parametro_cobranzas.numero_Documento == undefined) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor ingrese el numero de Documento', 'error', '#ff6849', 1500);
            return false;
        }
        $scope.loaderSaveD = true;

        $scope.Objeto_Parametro_cobranzas.id_Factura_Cab = '0';
        $scope.Objeto_Parametro_cobranzas.importe_Documento = '';
        $scope.Objeto_Parametro_cobranzas.cliente_Documento = '';

        ArqueoCajaServices.set_arqueoCaja_cobranzaBuscarDocumento($scope.Objeto_Parametro_cobranzas , $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loaderSaveD = false;
                if (res.ok == true) {
                    if (res.data.length > 0) {
                        $scope.Objeto_Parametro_cobranzas.id_Factura_Cab = res.data[0].id_Factura_Cab;
                        $scope.Objeto_Parametro_cobranzas.importe_Documento = res.data[0].importeDocumento;
                        $scope.Objeto_Parametro_cobranzas.cliente_Documento = res.data[0].clienteDocumento;
                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'No se encontro informacion del Documento, verifique por favor', 'error', '#ff6849', 1500);
                    }

                } else {
                    alert(JSON.stringify(res.data));
                }
            }, function (error) {
                $scope.loaderSaveD = false;
                alert(error)
            });
    }

    $scope.EdicionRegistros_cobranzas= function (obj) {

        $scope.Flag_modoEdicionCobranzas = true;
        $scope.files = [];
        $("#inputFileOpenCobranza").val('');


        $scope.loaderSaveD = true;
        ArqueoCajaServices.set_arqueoCaja_cobranzaEdicion(obj.id_ArqueoCaja_Cobranza, $scope.id_usuario_Global)
            .then(function (res) {
                $scope.loaderSaveD = false;
                if (res.ok == true) {
                    if (res.data.length > 0) {

                        const { id_ArqueoCaja_Cobranza, id_ArqueoCaja, id_zona, fecha_cobranza, id_Factura_Cab, id_TipoDocumento, serie_Documento, numero_Documento, importe_Documento, cliente_Documento, id_MedidoPago, id_Banco,
                            nro_operacionBanco, adjuntarArchivoBanco, nombreArchivoServidor, importePago, observaciones, estado
                        } = res.data[0];

                        $scope.Objeto_Parametro_filtro.id_ZonaVta = String(id_zona);

                        $scope.Objeto_Parametro_cobranzas = {
                            id_ArqueoCaja_Cobranza,
                            id_ArqueoCaja,
                            id_zona: String(id_zona),
                            fecha_cobranza,
                            id_Factura_Cab,
                            id_TipoDocumento: String(id_TipoDocumento),
                            serie_Documento,
                            numero_Documento,
                            importe_Documento,
                            cliente_Documento,
                            id_MedidoPago: String(id_MedidoPago),
                            id_Banco: String(id_Banco),
                            nro_operacionBanco,
                            adjuntarArchivoBanco,
                            nombreArchivoServidor,
                            importePago,
                            observaciones,
                            estado,
                            usuario_creacion: $scope.id_usuario_Global
                        };                                           

                        if (adjuntarArchivoBanco == '' || adjuntarArchivoBanco == null) {
                            $scope.titleFile = 'Adjuntar Documento';
                            $scope.showFileName = false;
                        } else {
                            $scope.showFileName = true;
                            $scope.titleFile = 'Reemplazar Documento';
                        }

                        $timeout(function () {
                            $('#modalCobranzas').modal('show');
                            $('#dtp_fechaCobranza').datepicker('setDate', new Date(fecha_cobranza));

                            $('#cbo_zonaCobranza').val(String(id_zona)).trigger('change.select2');
                            $('#cbo_tipoDocumentoCobranza').val(String(id_TipoDocumento)).trigger('change.select2');
                            $('#cbo_medioPagoCobranza').val(String(id_MedidoPago)).trigger('change.select2');
                            $('#cbo_bancoCobranza').val(String(id_Banco)).trigger('change.select2');
                        }, 0);

                    } else {
                        auxiliarServices.NotificationMessage('Sistemas', 'No hay informacion ', 'error', '#ff6849', 1500);
                    }

                    console.log($scope.Objeto_Parametro_cobranzas )

                } else {
                    alert(JSON.stringify(res.data));
                }
            }, function (error) {
                $scope.loaderSaveD = false;
                alert(error)
            });
    };


})

