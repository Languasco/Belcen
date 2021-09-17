var app = angular.module('appGestion.Reenvio_DocumentosController', [])

app.controller('Ctrl_Reenvio_Documentos', function ($scope, $q, loginServices, $location, $timeout, auxiliarServices, RevisionPedidoServices, Reenvio_DocumentosServices, AlmacenServices, LocalesServices, EstadosServices, TipoDocumentoServices, PuntoVentaServices, Documentos_MasivosServices, DocumentoVentaServices) {

    $scope.initAll = function () {
        if (!auxiliarServices.validateUserLog()) {
            $location.path('/Login');
            return;
        }
        auxiliarServices.menuHideShow(2);

        auxiliarServices.changeTitle("Reenvio de Documentos");
        $scope.titleModal = "Reenvio de Documentos Electronicos";
        $scope.disabledContent = "";
        $scope.loaderSave = false;
        $scope.Listando_TipoDocumento();
    }

    $('document').ready(function () {
        $timeout(function () {
            $('.datepicker').datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy',
            });
            $(".selectFiltros").select2();
        }, 100);

        $("#id_alertas").hide(500);
    });

    $scope.enterFocus = function (type, name) {
        if (type === 1) {
            $('#' + name + '').focus();
            $('#' + name + '').select();

        } else if (type === 2) {
            $('#' + name + '').select2('open');
        }
    };
       
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
                //$(".selectFiltros").select2();
                $('#cbo_puntoventa').val("0").trigger('change.select2');
                $('#cbo_vendedor').val("0").trigger('change.select2');
                $('#cbo_docVenta').val("0").trigger('change.select2');
                $('#cbo_estado').val("0").trigger('change.select2');
                $('#cbo_placa').val("0").trigger('change.select2');
            }, 500);


        }, function (err) {
            console.log(err);
        })
    }

 


    $scope.Lista_Vendedor = [];
    $scope.change_Local_vendedor = function (idlocal) {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_vendedorLocal(idlocal)
            .then(function (res) {
                $scope.loaderFiltro = false;

                if (res.ok == true) {
                    $scope.Lista_Vendedor = [];
                    $scope.Lista_Vendedor = res.data;

                    setTimeout(function () {
                        $scope.Objeto_ParametroFiltro.id_vendedor = '0';
                        $('#cbo_vendedor').val("0").trigger('change.select2');
                    }, 0);
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderFiltro = false;
                console.log(err);
            });
    };

    $scope.Lista_Transportista = [];
    $scope.change_Local_transportista = function (idlocal) {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_transportistaLocal(idlocal)
            .then(function (res) {
                $scope.loaderFiltro = false;

                if (res.ok == true) {
                    $scope.Lista_Transportista = [];
                    $scope.Lista_Transportista = res.data;

                    setTimeout(function () {
                        $scope.Objeto_ParametroFiltro.id_transportista = '0';
                        $('#cboTransportista').val("0").trigger('change.select2');
                    }, 0);
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderFiltro = false;
                console.log(err);
            });
    };
         
    $scope.Objeto_ParametroFiltro = {
        id_ZonaVta: '0',
        id_almacen: '0',
        vendedor: '0', 
        id_Anexos: '0',
        id_transportista: '0',
        id_TipoDocumento: '0',
        usuario: auxiliarServices.getUserId(),
    }


    $scope.Lista_TipoDoc = [];
    $scope.Listando_TipoDocumento = function () {
        $scope.loaderSave = true;
        TipoDocumentoServices.getTipoDocumento(0)
            .then(function (data) {
                $scope.loaderSave = false;
                $scope.Lista_TipoDoc = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id_TipoDocumento == 1 || data[i].id_TipoDocumento == 2 || data[i].id_TipoDocumento == 14 || data[i].id_TipoDocumento == 15) {
                        $scope.Lista_TipoDoc.push(data[i]);
                    }
                }
            }, function (err) {
                $scope.loaderSave = false;
                console.log(err);
            });
    };

    $scope.listadetalle_documentos = [];
    $scope.listando_all_documentos_erroneos = function () {
 
        $scope.loader_modal = true;
        $scope.listando_documentos_erroneos = '';
        $scope.checkedAll = false;
        document.getElementById("form_detalle").style.display = "none";
        Reenvio_DocumentosServices.Listando_Documento_erroneos($scope.Objeto_ParametroFiltro)
            .then(function (data) {
 
            if (data.length > 0) {
               $('#btn_cancelar').attr("disabled", false);
            } else {
                $('#btn_cancelar').attr("disabled", true);
                document.getElementById("form_detalle").style.display = "none";
            }

            $scope.listadetalle_documentos = data;
            $timeout(function () {
                $scope.loader_modal = false;
                $("#tbl_detalle").tableHeadFixer({ "left": 4 });
                document.getElementById("form_detalle").style.display = "";
            }, 500);

        }, function (error) {
            $scope.loader_modal = false;
            console.log(error);
        })
    }
    
    
    $scope.NombreTipoDocumento='...'

    $scope.generando_reenvio_Documentos = function () {
        if ($scope.listadetalle_documentos == null || $scope.listadetalle_documentos.length == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'No hay Documentos para Generar..', 'error', '#ff6849', 1500);
            return;
        }

        flag_marco = MarcoCheck();
        if (flag_marco == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione al menos un registro', 'error', '#ff6849', 1500);
            return;
        }

        var lista_documentos_Renviar = [];

        for (obj of $scope.listadetalle_documentos) {
            if (obj.checkeado ==true) {
                lista_documentos_Renviar.push(obj)
            }
        }



        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Enviar los Documentos nuevamente a la sunat, este proceso puede demorar un poco..',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {

                var CantDocumentosGlobal = lista_documentos_Renviar.length;
                var id_tipoDoc = 0;
                $('#btn_cancelar').attr("disabled", true);

                $("#id_alertas").show(100);

                var GenerarDocumentosVentas = function (index) {
                    if (CantDocumentosGlobal == index) {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso de Registro realizado correctamente !'
                        };
                        auxiliarServices.initSweetAlert(params).then(function (res) {

                        });
                        $scope.NombreTipoDocumento = '';
                        $scope.loader_modal = false;
                        $("#id_alertas").hide(1000);
                        return;
                    }

                    id_tipoDoc = lista_documentos_Renviar[index].id_TipoDocumento;
                    $scope.NombreTipoDocumento = 'Enviando a la sunat el Nro. Doc :' + lista_documentos_Renviar[index].Numero_Documento;
                    $scope.loader_modal = true;

                    if (id_tipoDoc == 1 || id_tipoDoc == '1' || id_tipoDoc == 2 || id_tipoDoc == '2') {
                        Documentos_MasivosServices.Generar_Documentos_Electronicos_Individual(lista_documentos_Renviar[index].id_TipoDocumento, lista_documentos_Renviar[index].Numero_Documento)
                            .then(function (data) {
                                $scope.loader_modal = false;

                                if (data == 0) {
                                    //------ejecutando----
                                    GenerarDocumentosVentas((index + 1))
                                } else {
                                    var idCab = null;
                                    var detConent = data;
                                    var cabContent = [];
                                    var indexAux = -1;

                                    data.forEach(function (item, index) {
                                        if (idCab !== item.idcab) {
                                            indexAux++;
                                            cabContent.push({
                                                ID: indexAux,
                                                idcab: item.idcab,
                                                nro_doc: item.nro_doc,
                                                fecha_emision: item.fecha_emision,
                                                fecha_vencimiento: item.fecha_vencimiento,
                                                hora_emision: item.hora_emision,
                                                tipo_doc_sunat: item.tipo_doc_sunat,
                                                tipo_moneda_sunat: item.tipo_moneda_sunat,
                                                ruc_empresa_emite: item.ruc_empresa_emite,
                                                razon_social_emite: item.razon_social_emite,
                                                tipo_doc_identidad_emite: item.tipo_doc_identidad_emite,
                                                razon_social_receptora: item.razon_social_receptora,
                                                ruc_empresa_receptora: item.ruc_empresa_receptora,
                                                tipo_doc_identidad_receptora: item.tipo_doc_identidad_receptora,
                                                monto_total_igv: item.monto_total_igv,
                                                monto_total_inafecto: item.monto_total_inafecto,
                                                monto_sub_total: item.monto_sub_total,
                                                monto_total: item.monto_total,
                                                nombreArchivo: item.nombreArchivo,

                                                departamento_emite: item.departamento_emite,
                                                provincia_emite: item.provincia_emite,
                                                distrito_emite: item.distrito_emite,
                                                calle_emite: item.calle_emite,
                                                departamento_receptora: item.departamento_receptora,
                                                provincia_receptora: item.provincia_receptora,
                                                distrito_receptora: item.distrito_receptora,
                                                calle_receptora: item.calle_receptora,
                                                correo_receptora: item.correo_receptora,
                                                identificador: item.identificador,
                                                cod_unidad: item.cod_unidad,

                                                codigo_tipo_oper: item.codigo_tipo_oper,
                                                cod_establecimiento: item.cod_establecimiento,

                                                cod_tributo: item.cod_tributo,
                                                nom_tributo: item.nom_tributo,
                                                tipo_tributo: item.tipo_tributo,
                                                porc_igv: item.porc_igv,
                                                cod_impuesto: item.cod_impuesto,

                                                DETCONTENT: []
                                            });
                                            detConent.forEach(function (itemdet) {
                                                if (itemdet.idcab === cabContent[indexAux].idcab) {
                                                    cabContent[indexAux].DETCONTENT.push(itemdet);
                                                }
                                            });
                                        }
                                        idCab = item.idcab;
                                    });

                                    if (id_tipoDoc == 1 || id_tipoDoc == '1') {
                                        get_Json_Facturacion_Electronica(cabContent, '01')
                                            .then((res) => {
                                                GenerarDocumentosVentas((index + 1))
                                            }, (e) => {
                                                GenerarDocumentosVentas((index + 1))
                                            })
                                    }
                                    else if (id_tipoDoc == 2 || id_tipoDoc == '2') {
                                        get_Json_Boleta_Electronica(cabContent, '03')
                                            .then((res) => {
                                                GenerarDocumentosVentas((index + 1))
                                            }, (e) => {
                                                GenerarDocumentosVentas((index + 1))
                                            })
                                    }
                                }

                            }, function (error) {
                                $scope.loader_modal = false;
                                auxiliarServices.NotificationMessage('Sistemas', 'Se produjo un error al Enviar a la Sunat el Nro. Doc : ' + $scope.Numero_Documento, 'error', '#ff6849', 3000);
                                $scope.NombreTipoDocumento = 'Error al Enviar el Nro. Doc ' + lista_documentos_Renviar[index].Numero_Documento;
                                GenerarDocumentosVentas(index + 1);
                                })
                    }
                    else if (id_tipoDoc == 14 || id_tipoDoc == '14' || id_tipoDoc == 15 || id_tipoDoc == '15') { 
                        Documentos_MasivosServices.Generar_Documentos_Electronicos_Individual_notas(lista_documentos_Renviar[index].id_TipoDocumento, lista_documentos_Renviar[index].Numero_Documento, lista_documentos_Renviar[index].id_Factura_Cab_Referencia )
                            .then(function (data) {
                                $scope.loader_modal = false;

                                if (data == 0) {
                                    //------ejecutando----
                                    GenerarDocumentosVentas((index + 1))
                                } else {
                                    var idCab = null;
                                    var detConent = data;
                                    var cabContent = [];
                                    var indexAux = -1;

                                    data.forEach(function (item, index) {
                                        if (idCab !== item.idcab) {
                                            indexAux++;
                                            cabContent.push({
                                                ID: indexAux,
                                                idcab: item.idcab,
                                                nro_doc: item.nro_doc,
                                                fecha_emision: item.fecha_emision,
                                                fecha_vencimiento: item.fecha_vencimiento,
                                                hora_emision: item.hora_emision,
                                                tipo_doc_sunat: item.tipo_doc_sunat,
                                                tipo_moneda_sunat: item.tipo_moneda_sunat,
                                                ruc_empresa_emite: item.ruc_empresa_emite,
                                                razon_social_emite: item.razon_social_emite,
                                                tipo_doc_identidad_emite: item.tipo_doc_identidad_emite,
                                                razon_social_receptora: item.razon_social_receptora,
                                                ruc_empresa_receptora: item.ruc_empresa_receptora,
                                                tipo_doc_identidad_receptora: item.tipo_doc_identidad_receptora,
                                                monto_total_igv: item.monto_total_igv,
                                                monto_total_inafecto: item.monto_total_inafecto,
                                                monto_sub_total: item.monto_sub_total,
                                                monto_total: item.monto_total,
                                                nombreArchivo: item.nombreArchivo,
                                                departamento_emite: item.departamento_emite,
                                                provincia_emite: item.provincia_emite,
                                                distrito_emite: item.distrito_emite,
                                                calle_emite: item.calle_emite,
                                                departamento_receptora: item.departamento_receptora,
                                                provincia_receptora: item.provincia_receptora,
                                                distrito_receptora: item.distrito_receptora,
                                                calle_receptora: item.calle_receptora,
                                                correo_receptora: item.correo_receptora,

                                                codigo_operacion: item.codigo_operacion,
                                                descripcion_operacion: item.descripcion_operacion,
                                                nro_doc_ref: item.nro_doc_ref,
                                                identificador: item.identificador,
                                                cod_unidad: item.cod_unidad,

                                                codigo_tipo_oper: item.codigo_tipo_oper,
                                                cod_establecimiento: item.cod_establecimiento,
                                                fecha_ref: item.fecha_ref,

                                                cod_tributo: item.cod_tributo,
                                                nom_tributo: item.nom_tributo,
                                                tipo_tributo: item.tipo_tributo,
                                                porc_igv: item.porc_igv,
                                                cod_impuesto: item.cod_impuesto,

                                                DETCONTENT: []
                                            });
                                            detConent.forEach(function (itemdet) {
                                                if (itemdet.idcab === cabContent[indexAux].idcab) {
                                                    cabContent[indexAux].DETCONTENT.push(itemdet);
                                                }
                                            });
                                        }
                                        idCab = item.idcab;
                                    });

                                    if (id_tipoDoc == 14 || id_tipoDoc == '14') {
                                        get_Json_Nota_Credito_Electronica(cabContent, '07')
                                            .then((res) => {
                                                GenerarDocumentosVentas((index + 1))
                                            }, (e) => {
                                                GenerarDocumentosVentas((index + 1))
                                            })
                                    }
                                    else if (id_tipoDoc == 15 || id_tipoDoc == '15') {
                                        get_Json_Nota_Debito_Electronica(cabContent, '08')
                                            .then((res) => {
                                                GenerarDocumentosVentas((index + 1))
                                            }, (e) => {
                                                GenerarDocumentosVentas((index + 1))
                                            })
                                    }
                                }

                            }, function (error) {
                                $scope.loader_modal = false;
                                auxiliarServices.NotificationMessage('Sistemas', 'Se produjo un error al Enviar a la Sunat el Nro. Doc : ' + $scope.Numero_Documento, 'error', '#ff6849', 3000);
                                $scope.NombreTipoDocumento = 'Error al Enviar el Nro. Doc :' + lista_documentos_Renviar[index].Numero_Documento;
                                GenerarDocumentosVentas(index + 1);
                            })
                    }
                }

                GenerarDocumentosVentas(0);
            }
        });
                              
    }
    
    function MarcoCheck() {
        var flag_marco = false; 
        for (obj_datos of $scope.listadetalle_documentos) {
            if (obj_datos.checkeado == true) {
                flag_marco = true;
                break;
            }
        }
        return flag_marco;
    }


    //------ version 2 -----
    var get_Json_Facturacion_Electronica = function (cab, tipoDoc_sunat) {
        var acum = 1;
        var nroLetra = '';
        var x = 1;

        //console.log('entroo factuaras')
        var IndiceGlobal = cab.length;

        return new Promise(resolve => {
            var ejecutarConsulta = function (indice) {
                if (IndiceGlobal == indice) {
                    resolve("OK");
                    return
                }

                if (cab[indice].tipo_doc_sunat == tipoDoc_sunat) {
                    var InvoiceLine_aux = [];
                    cab[indice].DETCONTENT.forEach(function (itemDet, indexDet) {

                        if (cab[indice].cod_impuesto == '31') {  /// BONIFICACION
                            //------ inicio bonificacion Facturas---
                            InvoiceLine_aux.push({
                                "ID": [
                                    {
                                        "IdentifierContent": acum
                                    }
                                ],
                                "Note": [
                                    {
                                        "TextContent": cab[indice].cod_unidad
                                    }
                                ],
                                "InvoicedQuantity": [
                                    {
                                        "QuantityContent": itemDet.cantidad,
                                        "QuantityUnitCode": itemDet.cod_unidad_sunat,
                                        "QuantityUnitCodeListIdentifier": "UN/ECE rec 20",
                                        "QuantityUnitCodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                    }
                                ],
                                "LineExtensionAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                    }
                                ],
                                "PricingReference": [
                                    {
                                        "AlternativeConditionPrice": [
                                            {
                                                "PriceAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),
                                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                    }
                                                ],
                                                "PriceTypeCode": [
                                                    {
                                                        "CodeContent": "02",
                                                        "CodeListNameText": "SUNAT:Indicador de Tipo de Precio",
                                                        "CodeListAgencyNameText": "PE:SUNAT",
                                                        "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "TaxTotal": [
                                    {
                                        "TaxAmount": [
                                            {
                                                "AmountContent": "0",
                                                "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxSubtotal": [
                                            {
                                                "TaxableAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                    }
                                                ],
                                                "TaxAmount": [
                                                    {
                                                        "AmountContent": "0",
                                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                    }
                                                ],
                                                "TaxCategory": [
                                                    {
                                                        "Percent": [
                                                            {
                                                                "NumericContent": cab[indice].porc_igv
                                                            }
                                                        ],
                                                        "TaxExemptionReasonCode": [
                                                            {
                                                                "CodeContent": cab[indice].cod_impuesto,
                                                                "CodeListAgencyNameText": "PE:SUNAT",
                                                                "CodeListNameText": "Afectacion del IGV",
                                                                "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
                                                            }
                                                        ],
                                                        "TaxScheme": [
                                                            {
                                                                "ID": [
                                                                    {
                                                                        "IdentifierContent": cab[indice].cod_tributo,
                                                                        "IdentificationSchemeNameText": "Codigo de tributos",
                                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                    }
                                                                ],
                                                                "Name": [
                                                                    {
                                                                        "TextContent": cab[indice].nom_tributo
                                                                    }
                                                                ],
                                                                "TaxTypeCode": [
                                                                    {
                                                                        "CodeContent": cab[indice].tipo_tributo
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "Item": [
                                    {
                                        "Description": [
                                            {
                                                "TextContent": itemDet.nombre_producto
                                            }
                                        ],
                                        "SellersItemIdentification": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": itemDet.codigo_producto
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "Price": [
                                    {
                                        "PriceAmount": [
                                            {
                                                "AmountContent": 0,
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ]
                                    }
                                ]
                            });
                            //------ fin bonificacion Facturas ---
                        } else { /// normal gravadas
                             InvoiceLine_aux.push({
                            "ID": [
                                {
                                    "IdentifierContent": acum
                                }
                            ],
                            "Note": [
                                {
                                    "TextContent": cab[indice].cod_unidad
                                }
                            ],
                            "InvoicedQuantity": [
                                {
                                    "QuantityContent": itemDet.cantidad,
                                    "QuantityUnitCode": itemDet.cod_unidad_sunat,
                                    "QuantityUnitCodeListIdentifier": "UN/ECE rec 20",
                                    "QuantityUnitCodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                }
                            ],
                            "LineExtensionAmount": [
                                {
                                    "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                                    "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                }
                            ],
                            "PricingReference": [
                                {
                                    "AlternativeConditionPrice": [
                                        {
                                            "PriceAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                }
                                            ],
                                            "PriceTypeCode": [
                                                {
                                                    "CodeContent": "01",
                                                    "CodeListNameText": "SUNAT:Indicador de Tipo de Precio",
                                                    "CodeListAgencyNameText": "PE:SUNAT",
                                                    "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "TaxTotal": [
                                {
                                    "TaxAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                        }
                                    ],
                                    "TaxSubtotal": [
                                        {
                                            "TaxableAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxCategory": [
                                                {
                                                    "Percent": [
                                                        {
                                                            "NumericContent": cab[indice].porc_igv
                                                        }
                                                    ],
                                                    "TaxExemptionReasonCode": [
                                                        {
                                                            "CodeContent": cab[indice].cod_impuesto,
                                                            "CodeListAgencyNameText": "PE:SUNAT",
                                                            "CodeListNameText": "Afectacion del IGV",
                                                            "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
                                                        }
                                                    ],
                                                    "TaxScheme": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].cod_tributo,
                                                                    "IdentificationSchemeNameText": "Codigo de tributos",
                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                }
                                                            ],
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].nom_tributo
                                                                }
                                                            ],
                                                            "TaxTypeCode": [
                                                                {
                                                                    "CodeContent": cab[indice].tipo_tributo
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "Item": [
                                {
                                    "Description": [
                                        {
                                            "TextContent": itemDet.nombre_producto
                                        }
                                    ],
                                    "SellersItemIdentification": [
                                        {
                                            "ID": [
                                                {
                                                    "IdentifierContent": itemDet.codigo_producto
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "Price": [
                                {
                                    "PriceAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                        }
                                    ]
                                }
                            ]
                        });
                        }         

                        acum = acum + 1;
                    })

                    nroLetra = NumeroALetras(cab[indice].monto_total);
                    var json_Facturacion = '';
                    if (cab[indice].cod_impuesto == '31') {  /// BONIFICACION
                        //------ inicio bonificacion Facturacion ---
                        json_Facturacion = {
                            "_D": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
                            "_S": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
                            "_B": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
                            "_E": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
                            "Invoice": [
                                {
                                    "UBLVersionID": [
                                        {
                                            "IdentifierContent": "2.1"
                                        }
                                    ],
                                    "CustomizationID": [
                                        {
                                            "IdentifierContent": "2.0"
                                        }
                                    ],
                                    "ID": [
                                        {
                                            "IdentifierContent": cab[indice].nro_doc
                                        }
                                    ],
                                    "IssueDate": [
                                        {
                                            "DateContent": cab[indice].fecha_emision
                                        }
                                    ],
                                    "IssueTime": [
                                        {
                                            "DateTimeContent": cab[indice].hora_emision
                                        }
                                    ],
                                    "InvoiceTypeCode": [
                                        {
                                            "CodeContent": cab[indice].tipo_doc_sunat,
                                            "CodeListNameText": "Tipo de Documento",
                                            "CodeListSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo51",
                                            "CodeListIdentifier": cab[indice].codigo_tipo_oper, //--- falta agregar al procedimiento
                                            "CodeNameText": "Tipo de Operacion",
                                            "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
                                            "CodeListAgencyNameText": "PE:SUNAT"
                                        }
                                    ],
                                    "Note": [
                                        {
                                            "TextContent": nroLetra,
                                            "LanguageLocaleIdentifier": "1000"
                                        }
                                    ],
                                    "DocumentCurrencyCode": [
                                        {
                                            "CodeContent": cab[indice].tipo_moneda_sunat,
                                            "CodeListIdentifier": "ISO 4217 Alpha",
                                            "CodeListNameText": "Currency",
                                            "CodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                        }
                                    ],
                                    "LineCountNumeric": [
                                        {
                                            "NumericContent": cab[indice].DETCONTENT.length
                                        }
                                    ],
                                    "Signature": [
                                        {
                                            "ID": [
                                                {
                                                    "IdentifierContent": "IDSignature"
                                                }
                                            ],
                                            "SignatoryParty": [
                                                {
                                                    "PartyIdentification": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_emite
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emite
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            "DigitalSignatureAttachment": [
                                                {
                                                    "ExternalReference": [
                                                        {
                                                            "URI": [
                                                                {
                                                                    "TextContent": "IDSignature"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],

                                    "AccountingSupplierParty": [
                                        {
                                            "Party": [
                                                {
                                                    "PartyIdentification": [ // Tipo de documento y número de documento del Emisor.
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_emite,
                                                                    "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_emite,
                                                                    "IdentificationSchemeNameText": "Documento de Identidad",
                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [ // Va el nombre comercial del Emisor.
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emites
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyLegalEntity": [
                                                        {
                                                            "RegistrationName": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emite
                                                                }
                                                            ],
                                                            "RegistrationAddress": [ // Va la dirección completa y detallada del Emisor.
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": "150111",
                                                                            "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                            "IdentificationSchemeNameText": "Ubigeos"
                                                                        }
                                                                    ],
                                                                    "AddressTypeCode": [ // Nueva información de la dirección , va el código de establecimiento del Emisor, es mandatorio.
                                                                        {
                                                                            "CodeContent": cab[indice].cod_establecimiento,
                                                                            "CodeListAgencyNameText": "PE:SUNAT",
                                                                            "CodeListNameText": "Establecimientos anexos"
                                                                        }
                                                                    ],
                                                                    "CityName": [
                                                                        {
                                                                            "TextContent": cab[indice].departamento_emite
                                                                        }
                                                                    ],
                                                                    "CountrySubentity": [
                                                                        {
                                                                            "TextContent": cab[indice].provincia_emite
                                                                        }
                                                                    ],
                                                                    "District": [
                                                                        {
                                                                            "TextContent": cab[indice].distrito_emite
                                                                        }
                                                                    ],
                                                                    "AddressLine": [
                                                                        {
                                                                            "Line": [
                                                                                {
                                                                                    "TextContent": cab[indice].calle_emite
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    "Country": [ // Va el código de país del Emisor.
                                                                        {
                                                                            "IdentificationCode": [
                                                                                {
                                                                                    "CodeContent": "PE",
                                                                                    "CodeListIdentifier": "ISO 3166-1",
                                                                                    "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                    "CodeListNameText": "Country"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    "AccountingCustomerParty": [
                                        {
                                            "Party": [  // Tipo de documento y número de documento del Receptor.
                                                {
                                                    "PartyIdentification": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_receptora,
                                                                    "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_receptora,
                                                                    "IdentificationSchemeNameText": "Documento de Identidad",
                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_receptora
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyLegalEntity": [
                                                        {
                                                            "RegistrationName": [ // Va la razón social del Receptor.
                                                                {
                                                                    "TextContent": cab[indice].razon_social_receptora
                                                                }
                                                            ],
                                                            "RegistrationAddress": [ //Va la dirección completa y detallada del Receptor.
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": "140124",
                                                                            "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                            "IdentificationSchemeNameText": "Ubigeos"
                                                                        }
                                                                    ],
                                                                    "CityName": [
                                                                        {
                                                                            "TextContent": cab[indice].departamento_receptora
                                                                        }
                                                                    ],
                                                                    "CountrySubentity": [
                                                                        {
                                                                            "TextContent": cab[indice].provincia_receptora
                                                                        }
                                                                    ],
                                                                    "District": [
                                                                        {
                                                                            "TextContent": cab[indice].distrito_receptora
                                                                        }
                                                                    ],
                                                                    "AddressLine": [  //Va la dirección del Receptor.
                                                                        {
                                                                            "Line": [
                                                                                {
                                                                                    "TextContent": cab[indice].calle_receptora
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    "Country": [
                                                                        {
                                                                            "IdentificationCode": [
                                                                                {
                                                                                    "CodeContent": "PE",
                                                                                    "CodeListIdentifier": "ISO 3166-1",
                                                                                    "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                    "CodeListNameText": "Country"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "Contact": [
                                                        {
                                                            "ElectronicMail": [
                                                                {
                                                                    "TextContent": cab[indice].correo_receptora
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],

                                    "TaxTotal": [
                                        {
                                            "TaxAmount": [
                                                {
                                                    "AmountContent": "0",
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxSubtotal": [
                                                {
                                                    "TaxableAmount": [
                                                        {
                                                            "AmountContent": parseFloat(Math.round(cab[indice].monto_total)).toFixed(2),
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ],
                                                    "TaxAmount": [
                                                        {
                                                            "AmountContent": "0",
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ],
                                                    "TaxCategory": [
                                                        {
                                                            "TaxScheme": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": cab[indice].cod_tributo,
                                                                            "IdentificationSchemeNameText": "Codigo de tributos",
                                                                            "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                            "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                        }
                                                                    ],
                                                                    "Name": [
                                                                        {
                                                                            "TextContent": cab[indice].nom_tributo
                                                                        }
                                                                    ],
                                                                    "TaxTypeCode": [
                                                                        {
                                                                            "CodeContent": cab[indice].tipo_tributo
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    "LegalMonetaryTotal": [
                                        {
                                            "LineExtensionAmount": [
                                                {
                                                    "AmountContent": "0",
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxInclusiveAmount": [
                                                {
                                                    "AmountContent": "0",
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "PayableAmount": [
                                                {
                                                    "AmountContent": "0",
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ]
                                        }
                                    ],
                                    "InvoiceLine": InvoiceLine_aux
                                }
                            ]
                        }
                        //------ fin bonificacion ---
                    } else {
                        json_Facturacion = {
                        "_D": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
                        "_S": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
                        "_B": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
                        "_E": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
                        "Invoice": [
                            {
                                "UBLVersionID": [
                                    {
                                        "IdentifierContent": "2.1"
                                    }
                                ],
                                "CustomizationID": [
                                    {
                                        "IdentifierContent": "2.0"
                                    }
                                ],
                                "ID": [
                                    {
                                        "IdentifierContent": cab[indice].nro_doc
                                    }
                                ],
                                "IssueDate": [
                                    {
                                        "DateContent": cab[indice].fecha_emision
                                    }
                                ],
                                "IssueTime": [
                                    {
                                        "DateTimeContent": cab[indice].hora_emision
                                    }
                                ],
                                "InvoiceTypeCode": [
                                    {
                                        "CodeContent": cab[indice].tipo_doc_sunat,
                                        "CodeListNameText": "Tipo de Documento",
                                        "CodeListSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo51",
                                        "CodeListIdentifier": cab[indice].codigo_tipo_oper, //--- falta agregar al procedimiento
                                        "CodeNameText": "Tipo de Operacion",
                                        "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
                                        "CodeListAgencyNameText": "PE:SUNAT"
                                    }
                                ],
                                "Note": [
                                    {
                                        "TextContent": nroLetra,
                                        "LanguageLocaleIdentifier": "1000"
                                    }
                                ],
                                "DocumentCurrencyCode": [
                                    {
                                        "CodeContent": cab[indice].tipo_moneda_sunat,
                                        "CodeListIdentifier": "ISO 4217 Alpha",
                                        "CodeListNameText": "Currency",
                                        "CodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                    }
                                ],
                                "LineCountNumeric": [
                                    {
                                        "NumericContent": cab[indice].DETCONTENT.length
                                    }
                                ],
                                "Signature": [
                                    {
                                        "ID": [
                                            {
                                                "IdentifierContent": "IDSignature"
                                            }
                                        ],
                                        "SignatoryParty": [
                                            {
                                                "PartyIdentification": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": cab[indice].ruc_empresa_emite
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "PartyName": [
                                                    {
                                                        "Name": [
                                                            {
                                                                "TextContent": cab[indice].razon_social_emite
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "DigitalSignatureAttachment": [
                                            {
                                                "ExternalReference": [
                                                    {
                                                        "URI": [
                                                            {
                                                                "TextContent": "IDSignature"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],

                                "AccountingSupplierParty": [
                                    {
                                        "Party": [
                                            {
                                                "PartyIdentification": [ // Tipo de documento y número de documento del Emisor.
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": cab[indice].ruc_empresa_emite,
                                                                "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_emite,
                                                                "IdentificationSchemeNameText": "Documento de Identidad",
                                                                "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "PartyName": [ // Va el nombre comercial del Emisor.
                                                    {
                                                        "Name": [
                                                            {
                                                                "TextContent": cab[indice].razon_social_emites
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "PartyLegalEntity": [
                                                    {
                                                        "RegistrationName": [
                                                            {
                                                                "TextContent": cab[indice].razon_social_emite
                                                            }
                                                        ],
                                                        "RegistrationAddress": [ // Va la dirección completa y detallada del Emisor.
                                                            {
                                                                "ID": [
                                                                    {
                                                                        "IdentifierContent": "150111",
                                                                        "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                        "IdentificationSchemeNameText": "Ubigeos"
                                                                    }
                                                                ],
                                                                "AddressTypeCode": [ // Nueva información de la dirección , va el código de establecimiento del Emisor, es mandatorio.
                                                                    {
                                                                        "CodeContent": cab[indice].cod_establecimiento,
                                                                        "CodeListAgencyNameText": "PE:SUNAT",
                                                                        "CodeListNameText": "Establecimientos anexos"
                                                                    }
                                                                ],
                                                                "CityName": [
                                                                    {
                                                                        "TextContent": cab[indice].departamento_emite
                                                                    }
                                                                ],
                                                                "CountrySubentity": [
                                                                    {
                                                                        "TextContent": cab[indice].provincia_emite
                                                                    }
                                                                ],
                                                                "District": [
                                                                    {
                                                                        "TextContent": cab[indice].distrito_emite
                                                                    }
                                                                ],
                                                                "AddressLine": [
                                                                    {
                                                                        "Line": [
                                                                            {
                                                                                "TextContent": cab[indice].calle_emite
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "Country": [ // Va el código de país del Emisor.
                                                                    {
                                                                        "IdentificationCode": [
                                                                            {
                                                                                "CodeContent": "PE",
                                                                                "CodeListIdentifier": "ISO 3166-1",
                                                                                "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                "CodeListNameText": "Country"
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "AccountingCustomerParty": [
                                    {
                                        "Party": [  // Tipo de documento y número de documento del Receptor.
                                            {
                                                "PartyIdentification": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": cab[indice].ruc_empresa_receptora,
                                                                "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_receptora,
                                                                "IdentificationSchemeNameText": "Documento de Identidad",
                                                                "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "PartyName": [
                                                    {
                                                        "Name": [
                                                            {
                                                                "TextContent": cab[indice].razon_social_receptora
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "PartyLegalEntity": [
                                                    {
                                                        "RegistrationName": [ // Va la razón social del Receptor.
                                                            {
                                                                "TextContent": cab[indice].razon_social_receptora
                                                            }
                                                        ],
                                                        "RegistrationAddress": [ //Va la dirección completa y detallada del Receptor.
                                                            {
                                                                "ID": [
                                                                    {
                                                                        "IdentifierContent": "140124",
                                                                        "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                        "IdentificationSchemeNameText": "Ubigeos"
                                                                    }
                                                                ],
                                                                "CityName": [
                                                                    {
                                                                        "TextContent": cab[indice].departamento_receptora
                                                                    }
                                                                ],
                                                                "CountrySubentity": [
                                                                    {
                                                                        "TextContent": cab[indice].provincia_receptora
                                                                    }
                                                                ],
                                                                "District": [
                                                                    {
                                                                        "TextContent": cab[indice].distrito_receptora
                                                                    }
                                                                ],
                                                                "AddressLine": [  //Va la dirección del Receptor.
                                                                    {
                                                                        "Line": [
                                                                            {
                                                                                "TextContent": cab[indice].calle_receptora
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "Country": [
                                                                    {
                                                                        "IdentificationCode": [
                                                                            {
                                                                                "CodeContent": "PE",
                                                                                "CodeListIdentifier": "ISO 3166-1",
                                                                                "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                "CodeListNameText": "Country"
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "Contact": [
                                                    {
                                                        "ElectronicMail": [
                                                            {
                                                                "TextContent": cab[indice].correo_receptora
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],

                                "TaxTotal": [
                                    {
                                        "TaxAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxSubtotal": [
                                            {
                                                "TaxableAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total)).toFixed(2),
                                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                    }
                                                ],
                                                "TaxAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                    }
                                                ],
                                                "TaxCategory": [
                                                    {
                                                        "TaxScheme": [
                                                            {
                                                                "ID": [
                                                                    {
                                                                        "IdentifierContent": cab[indice].cod_tributo,
                                                                        "IdentificationSchemeNameText": "Codigo de tributos",
                                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                    }
                                                                ],
                                                                "Name": [
                                                                    {
                                                                        "TextContent": cab[indice].nom_tributo
                                                                    }
                                                                ],
                                                                "TaxTypeCode": [
                                                                    {
                                                                        "CodeContent": cab[indice].tipo_tributo
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "LegalMonetaryTotal": [
                                    {
                                        "LineExtensionAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxInclusiveAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "PayableAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ]
                                    }
                                ],
                                "InvoiceLine": InvoiceLine_aux
                            }
                        ]
                    }
                    }            

                    console.log(cab[indice].nombreArchivo + ' : ' + cab[indice].idcab);
                    //console.log(JSON.stringify(json_Facturacion)) 
                    generate_json_file(JSON.stringify(json_Facturacion), cab[indice].nombreArchivo, cab[indice].idcab)
                        .then(function (res) {
                            //----pasamos la siguiente documento
                            ejecutarConsulta((indice + 1));
                        }, function (error) {
                            console.log(error)
                            //----pasamos la siguiente documento
                            ejecutarConsulta((indice + 1));
                        })

                } else {
                    ejecutarConsulta((indice + 1));
                }
            }

            ejecutarConsulta(0);
        });
    }
    
    var get_Json_Boleta_Electronica = function (cab, tipoDoc_sunat) {
        var acum = 1;
        var nroLetra = '';
        var x = 1;

        var IndiceGlobal = cab.length;

        return new Promise(resolve => {
            var ejecutarConsulta = function (indice) {
                if (IndiceGlobal == indice) {
                    resolve("OK");
                    return
                }

                if (cab[indice].tipo_doc_sunat == tipoDoc_sunat) {

                    var InvoiceLine_aux = [];
                    cab[indice].DETCONTENT.forEach(function (itemDet, indexDet) {

                        if (cab[indice].cod_impuesto == '31') {  /// BONIFICACION
                            //------ inicio bonificacion Boletas ---
                              InvoiceLine_aux.push({
                                        "ID": [
                                            {
                                                "IdentifierContent": acum
                                            }
                                        ],
                                        "Note": [
                                            {
                                                "TextContent": cab[indice].cod_unidad
                                            }
                                        ],
                                        "InvoicedQuantity": [
                                            {
                                                "QuantityContent": itemDet.cantidad,
                                                "QuantityUnitCode": itemDet.cod_unidad_sunat,
                                                "QuantityUnitCodeListIdentifier": "UN/ECE rec 20",
                                                "QuantityUnitCodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                            }
                                        ],
                                        "LineExtensionAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "PricingReference": [
                                            {
                                                "AlternativeConditionPrice": [
                                                    {
                                                        "PriceAmount": [
                                                            {
                                                                "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),
                                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                            }
                                                        ],
                                                        "PriceTypeCode": [
                                                            {
                                                                "CodeContent": "02",
                                                                "CodeListNameText": "Tipo de Precio",
                                                                "CodeListAgencyNameText": "PE:SUNAT",
                                                                "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "TaxTotal": [
                                            {
                                                "TaxAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                    }
                                                ],
                                                "TaxSubtotal": [
                                                    {
                                                        "TaxableAmount": [
                                                            {
                                                                "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                            }
                                                        ],
                                                        "TaxAmount": [
                                                            {
                                                                "AmountContent": '0',
                                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                            }
                                                        ],
                                                        "TaxCategory": [
                                                            {
                                                                "Percent": [
                                                                    {
                                                                        "NumericContent": cab[indice].porc_igv,
                                                                    }
                                                                ],

                                                                "TaxExemptionReasonCode": [
                                                                    {
                                                                        "CodeContent": cab[indice].cod_impuesto,
                                                                        "CodeListAgencyNameText": "PE:SUNAT",
                                                                        "CodeListNameText": "Afectacion del IGV",
                                                                        "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
                                                                    }
                                                                ],
                                                                "TaxScheme": [
                                                                    {
                                                                        "ID": [
                                                                            {
                                                                                "IdentifierContent": cab[indice].cod_tributo,
                                                                                "IdentificationSchemeNameText": "Codigo de tributos",
                                                                                "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                                "IdentificationSchemeAgencyNameText": "PE:SUNAT"

                                                                            }
                                                                        ],
                                                                        "Name": [
                                                                            {
                                                                                "TextContent": cab[indice].nom_tributo
                                                                            }
                                                                        ],
                                                                        "TaxTypeCode": [
                                                                            {
                                                                                "CodeContent": cab[indice].tipo_tributo
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "Item": [
                                            {
                                                "Description": [
                                                    {
                                                        "TextContent": itemDet.nombre_producto
                                                    }
                                                ],
                                                "SellersItemIdentification": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": itemDet.codigo_producto
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "Price": [
                                            {
                                                "PriceAmount": [
                                                    {
                                                        "AmountContent": 0,
                                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                    }
                                                ]
                                            }
                                        ]
                                    });
                          //------ Fin de bonificacion  Boletas ---
                        } else {
                             InvoiceLine_aux.push({
                            "ID": [
                                {
                                    "IdentifierContent": acum
                                }
                            ],
                            "Note": [
                                {
                                    "TextContent": cab[indice].cod_unidad
                                }
                            ],
                            "InvoicedQuantity": [
                                {
                                    "QuantityContent": itemDet.cantidad,
                                    "QuantityUnitCode": itemDet.cod_unidad_sunat,
                                    "QuantityUnitCodeListIdentifier": "UN/ECE rec 20",
                                    "QuantityUnitCodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                }
                            ],
                            "LineExtensionAmount": [
                                {
                                    "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                }
                            ],
                            "PricingReference": [
                                {
                                    "AlternativeConditionPrice": [
                                        {
                                            "PriceAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "PriceTypeCode": [
                                                {
                                                    "CodeContent": "01",
                                                    "CodeListNameText": "SUNAT:Indicador de Tipo de Precio",
                                                    "CodeListAgencyNameText": "PE:SUNAT",
                                                    "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "TaxTotal": [
                                {
                                    "TaxAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                        }
                                    ],
                                    "TaxSubtotal": [
                                        {
                                            "TaxableAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxCategory": [
                                                {
                                                    "Percent": [
                                                        {
                                                            "NumericContent": cab[indice].porc_igv 
                                                        }
                                                    ],

                                                    "TaxExemptionReasonCode": [
                                                        {
                                                            "CodeContent": "10",
                                                            "CodeListAgencyNameText": "PE:SUNAT",
                                                            "CodeListNameText": "Afectacion del IGV",
                                                            "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
                                                        }
                                                    ],
                                                    "TaxScheme": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].cod_tributo,
                                                                    "IdentificationSchemeNameText": "Codigo de tributos",
                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT"

                                                                }
                                                            ],
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].nom_tributo
                                                                }
                                                            ],
                                                            "TaxTypeCode": [
                                                                {
                                                                    "CodeContent": cab[indice].tipo_tributo
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "Item": [
                                {
                                    "Description": [
                                        {
                                            "TextContent": itemDet.nombre_producto
                                        }
                                    ],
                                    "SellersItemIdentification": [
                                        {
                                            "ID": [
                                                {
                                                    "IdentifierContent": itemDet.codigo_producto
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "Price": [
                                {
                                    "PriceAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                        }
                                    ]
                                }
                            ]
                        });
                        }
                        acum = acum + 1;

                    })

                    nroLetra = NumeroALetras(cab[indice].monto_total);
                    var json_Boletas = '';

                    if (cab[indice].cod_impuesto == '31') {  /// BONIFICACION
                        //------ inicio bonificacion ---
                          json_Boletas = {
                                    "_D": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
                                    "_S": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
                                    "_B": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
                                    "_E": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
                                    "Invoice": [
                                        {
                                            "UBLVersionID": [
                                                {
                                                    "IdentifierContent": "2.1"
                                                }
                                            ],
                                            "CustomizationID": [
                                                {
                                                    "IdentifierContent": "2.0"
                                                }
                                            ],
                                            "ID": [
                                                {
                                                    "IdentifierContent": cab[indice].nro_doc
                                                }
                                            ],
                                            "IssueDate": [
                                                {
                                                    "DateContent": cab[indice].fecha_emision
                                                }
                                            ],
                                            "IssueTime": [
                                                {
                                                    "DateTimeContent": cab[indice].hora_emision
                                                }
                                            ],
                                            "InvoiceTypeCode": [
                                                {
                                                    "CodeContent": cab[indice].tipo_doc_sunat,
                                                    "CodeListNameText": "Tipo de Documento",
                                                    "CodeListSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo51",
                                                    "CodeListIdentifier": cab[indice].codigo_tipo_oper,
                                                    "CodeNameText": "Tipo de Operacion",
                                                    "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
                                                    "CodeListAgencyNameText": "PE:SUNAT"
                                                }
                                            ],

                                            "Note": [
                                                {
                                                    "TextContent": nroLetra,
                                                    "LanguageLocaleIdentifier": "1000"
                                                }
                                            ],
                                            "DocumentCurrencyCode": [
                                                {
                                                    "CodeContent": cab[indice].tipo_moneda_sunat,
                                                    "CodeListIdentifier": "ISO 4217 Alpha",
                                                    "CodeListNameText": "Currency",
                                                    "CodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                                }
                                            ],
                                            "LineCountNumeric": [
                                                {
                                                    "NumericContent": cab[indice].DETCONTENT.length
                                                }
                                            ],
                                            "Signature": [
                                                {
                                                    "ID": [
                                                        {
                                                            "IdentifierContent": "IDSignature"
                                                        }
                                                    ],
                                                    "SignatoryParty": [
                                                        {
                                                            "PartyIdentification": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": cab[indice].ruc_empresa_emite
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            "PartyName": [
                                                                {
                                                                    "Name": [
                                                                        {
                                                                            "TextContent": cab[indice].razon_social_emite
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "DigitalSignatureAttachment": [
                                                        {
                                                            "ExternalReference": [
                                                                {
                                                                    "URI": [
                                                                        {
                                                                            "TextContent": "IDSignature"
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],

                                            "AccountingSupplierParty": [
                                                {
                                                    "Party": [
                                                        {
                                                            "PartyIdentification": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": cab[indice].ruc_empresa_emite,
                                                                            "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_emite,
                                                                            "IdentificationSchemeNameText": "Documento de Identidad",
                                                                            "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                            "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            "PartyName": [
                                                                {
                                                                    "Name": [
                                                                        {
                                                                            "TextContent": cab[indice].razon_social_emite
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            "PartyLegalEntity": [
                                                                {
                                                                    "RegistrationName": [
                                                                        {
                                                                            "TextContent": cab[indice].razon_social_emite
                                                                        }
                                                                    ],
                                                                    "RegistrationAddress": [
                                                                        {
                                                                            "ID": [
                                                                                {
                                                                                    "IdentifierContent": "150111",
                                                                                    "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                                    "IdentificationSchemeNameText": "Ubigeos"
                                                                                }
                                                                            ],
                                                                            "AddressTypeCode": [
                                                                                {
                                                                                    "CodeContent": cab[indice].cod_establecimiento,
                                                                                    "CodeListAgencyNameText": "PE:SUNAT",
                                                                                    "CodeListNameText": "Establecimientos anexos"
                                                                                }
                                                                            ],
                                                                            "CityName": [
                                                                                {
                                                                                    "TextContent": cab[indice].departamento_emite
                                                                                }
                                                                            ],
                                                                            "CountrySubentity": [
                                                                                {
                                                                                    "TextContent": cab[indice].provincia_emite
                                                                                }
                                                                            ],
                                                                            "District": [
                                                                                {
                                                                                    "TextContent": cab[indice].distrito_emite
                                                                                }
                                                                            ],
                                                                            "AddressLine": [
                                                                                {
                                                                                    "Line": [
                                                                                        {
                                                                                            "TextContent": cab[indice].calle_emite
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ],
                                                                            "Country": [
                                                                                {
                                                                                    "IdentificationCode": [
                                                                                        {
                                                                                            "CodeContent": "PE",
                                                                                            "CodeListIdentifier": "ISO 3166-1",
                                                                                            "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                            "CodeListNameText": "Country"
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            "AccountingCustomerParty": [
                                                {
                                                    "Party": [
                                                        {
                                                            "PartyIdentification": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": cab[indice].ruc_empresa_receptora,
                                                                            "IdentificationSchemeIdentifier": "1",
                                                                            "IdentificationSchemeNameText": "Documento de Identidad",
                                                                            "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                            "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            "PartyName": [
                                                                {
                                                                    "Name": [
                                                                        {
                                                                            "TextContent": cab[indice].razon_social_receptora
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            "PartyLegalEntity": [
                                                                {
                                                                    "RegistrationName": [
                                                                        {
                                                                            "TextContent": cab[indice].razon_social_receptora
                                                                        }
                                                                    ],
                                                                    "RegistrationAddress": [
                                                                        {
                                                                            "ID": [
                                                                                {
                                                                                    "IdentifierContent": "150103",
                                                                                    "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                                    "IdentificationSchemeNameText": "Ubigeos"
                                                                                }
                                                                            ],
                                                                            "CityName": [
                                                                                {
                                                                                    "TextContent": cab[indice].departamento_receptora
                                                                                }
                                                                            ],
                                                                            "CountrySubentity": [
                                                                                {
                                                                                    "TextContent": cab[indice].provincia_receptora
                                                                                }
                                                                            ],
                                                                            "District": [
                                                                                {
                                                                                    "TextContent": cab[indice].distrito_receptora
                                                                                }
                                                                            ],
                                                                            "AddressLine": [
                                                                                {
                                                                                    "Line": [
                                                                                        {
                                                                                            "TextContent": cab[indice].calle_receptora
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ],
                                                                            "Country": [
                                                                                {
                                                                                    "IdentificationCode": [
                                                                                        {
                                                                                            "CodeContent": "PE",
                                                                                            "CodeListIdentifier": "ISO 3166-1",
                                                                                            "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                            "CodeListNameText": "Country"
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            "Contact": [
                                                                {
                                                                    "ElectronicMail": [
                                                                        {
                                                                            "TextContent": cab[indice].correo_receptora
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],

                                            "TaxTotal": [
                                                {
                                                    "TaxAmount": [
                                                        {
                                                            "AmountContent": "0",
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ],
                                                    "TaxSubtotal": [
                                                        {
                                                            "TaxableAmount": [
                                                                {
                                                                    "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                                }
                                                            ],
                                                            "TaxAmount": [
                                                                {
                                                                    "AmountContent": "0",
                                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                                }
                                                            ],
                                                            "TaxCategory": [
                                                                {
                                                                    "TaxScheme": [
                                                                        {
                                                                            "ID": [
                                                                                {
                                                                                    "IdentifierContent": cab[indice].cod_tributo,
                                                                                    "IdentificationSchemeNameText": "Codigo de tributos",
                                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                                }
                                                                            ],
                                                                            "Name": [
                                                                                {
                                                                                    "TextContent": cab[indice].nom_tributo
                                                                                }
                                                                            ],
                                                                            "TaxTypeCode": [
                                                                                {
                                                                                    "CodeContent": cab[indice].tipo_tributo
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]

                                                        }
                                                    ]
                                                }
                                            ],
                                            "LegalMonetaryTotal": [
                                                {
                                                    "LineExtensionAmount": [
                                                        {
                                                            "AmountContent": "0",
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ],
                                                    "TaxInclusiveAmount": [
                                                        {
                                                            "AmountContent": "0",
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ],
                                                    "PayableAmount": [
                                                        {
                                                            "AmountContent": "0",
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ]
                                                }
                                            ],
                                            "InvoiceLine": InvoiceLine_aux

                                        }
                                    ]
                                }
                        //------ Fin de  bonificacion ---
                    } else { ////NORMAL Y LAS INAFECTAS
                         json_Boletas = {
                        "_D": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
                        "_S": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
                        "_B": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
                        "_E": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
                        "Invoice": [
                            {
                                "UBLVersionID": [
                                    {
                                        "IdentifierContent": "2.1"
                                    }
                                ],
                                "CustomizationID": [
                                    {
                                        "IdentifierContent": "2.0"
                                    }
                                ],
                                "ID": [
                                    {
                                        "IdentifierContent": cab[indice].nro_doc
                                    }
                                ],
                                "IssueDate": [
                                    {
                                        "DateContent": cab[indice].fecha_emision
                                    }
                                ],
                                "IssueTime": [
                                    {
                                        "DateTimeContent": cab[indice].hora_emision
                                    }
                                ],
                                "InvoiceTypeCode": [
                                    {
                                        "CodeContent": cab[indice].tipo_doc_sunat,
                                        "CodeListNameText": "Tipo de Documento",
                                        "CodeListSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo51",
                                        "CodeListIdentifier": cab[indice].codigo_tipo_oper,
                                        "CodeNameText": "Tipo de Operacion",
                                        "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
                                        "CodeListAgencyNameText": "PE:SUNAT"
                                    }
                                ],

                                "Note": [
                                    {
                                        "TextContent": nroLetra,
                                        "LanguageLocaleIdentifier": "1000"
                                    }
                                ],
                                "DocumentCurrencyCode": [
                                    {
                                        "CodeContent": cab[indice].tipo_moneda_sunat,
                                        "CodeListIdentifier": "ISO 4217 Alpha",
                                        "CodeListNameText": "Currency",
                                        "CodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                    }
                                ],
                                "LineCountNumeric": [
                                    {
                                        "NumericContent": cab[indice].DETCONTENT.length
                                    }
                                ],
                                "Signature": [
                                    {
                                        "ID": [
                                            {
                                                "IdentifierContent": "IDSignature"
                                            }
                                        ],
                                        "SignatoryParty": [
                                            {
                                                "PartyIdentification": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": cab[indice].ruc_empresa_emite
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "PartyName": [
                                                    {
                                                        "Name": [
                                                            {
                                                                "TextContent": cab[indice].razon_social_emite
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "DigitalSignatureAttachment": [
                                            {
                                                "ExternalReference": [
                                                    {
                                                        "URI": [
                                                            {
                                                                "TextContent": "IDSignature"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],

                                "AccountingSupplierParty": [
                                    {
                                        "Party": [
                                            {
                                                "PartyIdentification": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": cab[indice].ruc_empresa_emite,
                                                                "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_emite,
                                                                "IdentificationSchemeNameText": "Documento de Identidad",
                                                                "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "PartyName": [
                                                    {
                                                        "Name": [
                                                            {
                                                                "TextContent": cab[indice].razon_social_emite
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "PartyLegalEntity": [
                                                    {
                                                        "RegistrationName": [
                                                            {
                                                                "TextContent": cab[indice].razon_social_emite
                                                            }
                                                        ],
                                                        "RegistrationAddress": [
                                                            {
                                                                "ID": [
                                                                    {
                                                                        "IdentifierContent": "150111",
                                                                        "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                        "IdentificationSchemeNameText": "Ubigeos"
                                                                    }
                                                                ],
                                                                "AddressTypeCode": [
                                                                    {
                                                                        "CodeContent": cab[indice].cod_establecimiento,
                                                                        "CodeListAgencyNameText": "PE:SUNAT",
                                                                        "CodeListNameText": "Establecimientos anexos"
                                                                    }
                                                                ],
                                                                "CityName": [
                                                                    {
                                                                        "TextContent": cab[indice].departamento_emite
                                                                    }
                                                                ],
                                                                "CountrySubentity": [
                                                                    {
                                                                        "TextContent": cab[indice].provincia_emite
                                                                    }
                                                                ],
                                                                "District": [
                                                                    {
                                                                        "TextContent": cab[indice].distrito_emite
                                                                    }
                                                                ],
                                                                "AddressLine": [
                                                                    {
                                                                        "Line": [
                                                                            {
                                                                                "TextContent": cab[indice].calle_emite
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "Country": [
                                                                    {
                                                                        "IdentificationCode": [
                                                                            {
                                                                                "CodeContent": "PE",
                                                                                "CodeListIdentifier": "ISO 3166-1",
                                                                                "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                "CodeListNameText": "Country"
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "AccountingCustomerParty": [
                                    {
                                        "Party": [
                                            {
                                                "PartyIdentification": [
                                                    {
                                                        "ID": [
                                                            {
                                                                "IdentifierContent": cab[indice].ruc_empresa_receptora,
                                                                "IdentificationSchemeIdentifier": "1",
                                                                "IdentificationSchemeNameText": "Documento de Identidad",
                                                                "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "PartyName": [
                                                    {
                                                        "Name": [
                                                            {
                                                                "TextContent": cab[indice].razon_social_receptora
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "PartyLegalEntity": [
                                                    {
                                                        "RegistrationName": [
                                                            {
                                                                "TextContent": cab[indice].razon_social_receptora
                                                            }
                                                        ],
                                                        "RegistrationAddress": [
                                                            {
                                                                "ID": [
                                                                    {
                                                                        "IdentifierContent": "150103",
                                                                        "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                        "IdentificationSchemeNameText": "Ubigeos"
                                                                    }
                                                                ],
                                                                "CityName": [
                                                                    {
                                                                        "TextContent": cab[indice].departamento_receptora
                                                                    }
                                                                ],
                                                                "CountrySubentity": [
                                                                    {
                                                                        "TextContent": cab[indice].provincia_receptora
                                                                    }
                                                                ],
                                                                "District": [
                                                                    {
                                                                        "TextContent": cab[indice].distrito_receptora
                                                                    }
                                                                ],
                                                                "AddressLine": [
                                                                    {
                                                                        "Line": [
                                                                            {
                                                                                "TextContent": cab[indice].calle_receptora
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "Country": [
                                                                    {
                                                                        "IdentificationCode": [
                                                                            {
                                                                                "CodeContent": "PE",
                                                                                "CodeListIdentifier": "ISO 3166-1",
                                                                                "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                "CodeListNameText": "Country"
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "Contact": [
                                                    {
                                                        "ElectronicMail": [
                                                            {
                                                                "TextContent": cab[indice].correo_receptora
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],

                                "TaxTotal": [
                                    {
                                        "TaxAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxSubtotal": [
                                            {
                                                "TaxableAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total * 100) / 100).toFixed(2),
                                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                    }
                                                ],
                                                "TaxAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                                        "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                    }
                                                ],
                                                "TaxCategory": [
                                                    {
                                                        "TaxScheme": [
                                                            {
                                                                "ID": [
                                                                    {
                                                                        "IdentifierContent": cab[indice].cod_tributo,
                                                                        "IdentificationSchemeNameText": "Codigo de tributos",
                                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                    }
                                                                ],
                                                                "Name": [
                                                                    {
                                                                        "TextContent": cab[indice].nom_tributo
                                                                    }
                                                                ],
                                                                "TaxTypeCode": [
                                                                    {
                                                                        "CodeContent": cab[indice].tipo_tributo
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]

                                            }
                                        ]
                                    }
                                ],
                                "LegalMonetaryTotal": [
                                    {
                                        "LineExtensionAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxInclusiveAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ],
                                        "PayableAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                            }
                                        ]
                                    }
                                ],
                                "InvoiceLine": InvoiceLine_aux

                            }
                        ]
                    }
                    }        

                    console.log(cab[indice].nombreArchivo + ' : ' + cab[indice].idcab);
                    ////console.log(JSON.stringify(json_Boletas))
                    generate_json_file(JSON.stringify(json_Boletas), cab[indice].nombreArchivo, cab[indice].idcab)
                        .then(function (res) {
                            //----pasamos la siguiente documento
                            ejecutarConsulta((indice + 1));
                        }, function (error) {
                            console.log(error)
                            //----pasamos la siguiente documento
                            ejecutarConsulta((indice + 1));
                        })

                } else {
                    ejecutarConsulta((indice + 1));
                }

                ///---- fin variable json Boleta
            }

            ejecutarConsulta(0);
        });
    }
     
    
    var get_Json_Nota_Credito_Electronica = function (cab, tipoDoc_sunat) {
        var acum = 1;
        var nroLetra = '';
        var x = 1;

        var IndiceGlobal = cab.length;

        return new Promise(resolve => {
            var ejecutarConsulta = function (indice) {
                if (IndiceGlobal == indice) {
                    resolve("OK");
                    return
                }

                if (cab[indice].tipo_doc_sunat == tipoDoc_sunat) {

                    var InvoiceLine_aux = [];
                    cab[indice].DETCONTENT.forEach(function (itemDet, indexDet) {

                        if (cab[indice].cod_impuesto == '31') {  /// BONIFICACION
                            //------ inicio bonificacion Facturas---
                            InvoiceLine_aux.push({
                                "ID": [
                                    {
                                        "IdentifierContent": acum
                                    }
                                ],
                                "Note": [
                                    {
                                        "TextContent": cab[indice].cod_unidad
                                    }
                                ],
                                "CreditedQuantity": [
                                    {
                                        "QuantityContent": itemDet.cantidad,
                                        "QuantityUnitCode": itemDet.cod_unidad_sunat,
                                        "QuantityUnitCodeListIdentifier": "UN/ECE rec 20",
                                        "QuantityUnitCodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                    }
                                ],
                                "LineExtensionAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                    }
                                ],
                                "PricingReference": [
                                    {
                                        "AlternativeConditionPrice": [
                                            {
                                                "PriceAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),
                                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                    }
                                                ],
                                                "PriceTypeCode": [
                                                    {
                                                        "CodeContent": "02",
                                                        "CodeListNameText": "Tipo de Precio",
                                                        "CodeListAgencyNameText": "PE:SUNAT",
                                                        "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],

                                "TaxTotal": [
                                    {
                                        "TaxAmount": [
                                            {
                                                "AmountContent": "0",
                                                "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxSubtotal": [
                                            {
                                                "TaxableAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                    }
                                                ],
                                                "TaxAmount": [
                                                    {
                                                        "AmountContent": "0",
                                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                    }
                                                ],
                                                "TaxCategory": [
                                                    {
                                                        "Percent": [
                                                            {
                                                                "NumericContent": cab[indice].porc_igv
                                                            }
                                                        ],
                                                        "TaxExemptionReasonCode": [
                                                            {
                                                                "CodeContent": cab[indice].cod_impuesto,
                                                                "CodeListAgencyNameText": "PE:SUNAT",
                                                                "CodeListNameText": "Afectacion del IGV",
                                                                "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
                                                            }
                                                        ],
                                                        "TaxScheme": [
                                                            {
                                                                "ID": [
                                                                    {
                                                                        "IdentifierContent": cab[indice].cod_tributo,
                                                                        "IdentificationSchemeNameText": "Codigo de tributos",
                                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                    }
                                                                ],
                                                                "Name": [
                                                                    {
                                                                        "TextContent": cab[indice].nom_tributo
                                                                    }
                                                                ],
                                                                "TaxTypeCode": [
                                                                    {
                                                                        "CodeContent": cab[indice].tipo_tributo
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "Item": [
                                    {
                                        "Description": [
                                            {
                                                "TextContent": itemDet.nombre_producto
                                            }
                                        ],
                                        "SellersItemIdentification": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": itemDet.codigo_producto
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "Price": [
                                    {
                                        "PriceAmount": [
                                            {
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat,
                                                "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),

                                            }
                                        ]
                                    }
                                ]
                            });
                            //------ fin bonificacion Facturas---
                        } else {
                             InvoiceLine_aux.push({
                            "ID": [
                                {
                                    "IdentifierContent": acum
                                }
                            ],
                            "Note": [
                                {
                                    "TextContent": cab[indice].cod_unidad
                                }
                            ],
                            "CreditedQuantity": [
                                {
                                    "QuantityContent": itemDet.cantidad,
                                    "QuantityUnitCode": itemDet.cod_unidad_sunat,
                                    "QuantityUnitCodeListIdentifier": "UN/ECE rec 20",
                                    "QuantityUnitCodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                }
                            ],
                            "LineExtensionAmount": [
                                {
                                    "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                                    "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                }
                            ],
                            "PricingReference": [
                                {
                                    "AlternativeConditionPrice": [
                                        {
                                            "PriceAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                }
                                            ],
                                            "PriceTypeCode": [
                                                {
                                                    "CodeContent": "01",
                                                    "CodeListNameText": "Tipo de Precio",
                                                    "CodeListAgencyNameText": "PE:SUNAT",
                                                    "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],

                            "TaxTotal": [
                                {
                                    "TaxAmount": [
                                        {
                                            "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                            "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                        }
                                    ],
                                    "TaxSubtotal": [
                                        {
                                            "TaxableAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxCategory": [
                                                {
                                                    "Percent": [
                                                        {
                                                            "NumericContent": cab[indice].porc_igv
                                                        }
                                                    ],
                                                    "TaxExemptionReasonCode": [
                                                        {
                                                            "CodeContent": cab[indice].cod_impuesto, 
                                                            "CodeListAgencyNameText": "PE:SUNAT",
                                                            "CodeListNameText": "Afectacion del IGV",
                                                            "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
                                                        }
                                                    ],
                                                    "TaxScheme": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].cod_tributo,
                                                                    "IdentificationSchemeNameText": "Codigo de tributos",
                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                }
                                                            ],
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].nom_tributo
                                                                }
                                                            ],
                                                            "TaxTypeCode": [
                                                                {
                                                                    "CodeContent": cab[indice].tipo_tributo
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "Item": [
                                {
                                    "Description": [
                                        {
                                            "TextContent": itemDet.nombre_producto
                                        }
                                    ],
                                    "SellersItemIdentification": [
                                        {
                                            "ID": [
                                                {
                                                    "IdentifierContent": itemDet.codigo_producto
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "Price": [
                                {
                                    "PriceAmount": [
                                        {
                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat,
                                            "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),

                                        }
                                    ]
                                }
                            ]
                        });
                        }


                        acum = acum + 1;

                    })

                    nroLetra = NumeroALetras(cab[indice].monto_total);
                    var json_NotaCredito = '';

                    if (cab[indice].cod_impuesto == '31') {  /// BONIFICACION
                        //------ inicio bonificacion Facturacion ---
                        json_NotaCredito = {
                            "_D": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
                            "_S": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
                            "_B": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
                            "_E": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
                            "Invoice": [
                                {
                                    "UBLVersionID": [
                                        {
                                            "IdentifierContent": "2.1"
                                        }
                                    ],
                                    "CustomizationID": [
                                        {
                                            "IdentifierContent": "2.0"
                                        }
                                    ],
                                    "ID": [
                                        {
                                            "IdentifierContent": cab[indice].nro_doc
                                        }
                                    ],
                                    "IssueDate": [
                                        {
                                            "DateContent": cab[indice].fecha_emision
                                        }
                                    ],
                                    "IssueTime": [
                                        {
                                            "DateTimeContent": cab[indice].hora_emision
                                        }
                                    ],
                                    "InvoiceTypeCode": [
                                        {
                                            "CodeContent": cab[indice].tipo_doc_sunat,
                                            "CodeListNameText": "Tipo de Documento",
                                            "CodeListSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo51",
                                            "CodeListIdentifier": cab[indice].codigo_tipo_oper, //--- falta agregar al procedimiento
                                            "CodeNameText": "Tipo de Operacion",
                                            "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
                                            "CodeListAgencyNameText": "PE:SUNAT"
                                        }
                                    ],
                                    "Note": [
                                        {
                                            "TextContent": nroLetra,
                                            "LanguageLocaleIdentifier": "1000"
                                        }
                                    ],
                                    "DocumentCurrencyCode": [
                                        {
                                            "CodeContent": cab[indice].tipo_moneda_sunat,
                                            "CodeListIdentifier": "ISO 4217 Alpha",
                                            "CodeListNameText": "Currency",
                                            "CodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                        }
                                    ],
                                    "LineCountNumeric": [
                                        {
                                            "NumericContent": cab[indice].DETCONTENT.length
                                        }
                                    ],
                                    "Signature": [
                                        {
                                            "ID": [
                                                {
                                                    "IdentifierContent": "IDSignature"
                                                }
                                            ],
                                            "SignatoryParty": [
                                                {
                                                    "PartyIdentification": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_emite
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emite
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            "DigitalSignatureAttachment": [
                                                {
                                                    "ExternalReference": [
                                                        {
                                                            "URI": [
                                                                {
                                                                    "TextContent": "IDSignature"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],

                                    "AccountingSupplierParty": [
                                        {
                                            "Party": [
                                                {
                                                    "PartyIdentification": [ // Tipo de documento y número de documento del Emisor.
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_emite,
                                                                    "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_emite,
                                                                    "IdentificationSchemeNameText": "Documento de Identidad",
                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [ // Va el nombre comercial del Emisor.
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emites
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyLegalEntity": [
                                                        {
                                                            "RegistrationName": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emite
                                                                }
                                                            ],
                                                            "RegistrationAddress": [ // Va la dirección completa y detallada del Emisor.
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": "150111",
                                                                            "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                            "IdentificationSchemeNameText": "Ubigeos"
                                                                        }
                                                                    ],
                                                                    "AddressTypeCode": [ // Nueva información de la dirección , va el código de establecimiento del Emisor, es mandatorio.
                                                                        {
                                                                            "CodeContent": cab[indice].cod_establecimiento,
                                                                            "CodeListAgencyNameText": "PE:SUNAT",
                                                                            "CodeListNameText": "Establecimientos anexos"
                                                                        }
                                                                    ],
                                                                    "CityName": [
                                                                        {
                                                                            "TextContent": cab[indice].departamento_emite
                                                                        }
                                                                    ],
                                                                    "CountrySubentity": [
                                                                        {
                                                                            "TextContent": cab[indice].provincia_emite
                                                                        }
                                                                    ],
                                                                    "District": [
                                                                        {
                                                                            "TextContent": cab[indice].distrito_emite
                                                                        }
                                                                    ],
                                                                    "AddressLine": [
                                                                        {
                                                                            "Line": [
                                                                                {
                                                                                    "TextContent": cab[indice].calle_emite
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    "Country": [ // Va el código de país del Emisor.
                                                                        {
                                                                            "IdentificationCode": [
                                                                                {
                                                                                    "CodeContent": "PE",
                                                                                    "CodeListIdentifier": "ISO 3166-1",
                                                                                    "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                    "CodeListNameText": "Country"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    "AccountingCustomerParty": [
                                        {
                                            "Party": [  // Tipo de documento y número de documento del Receptor.
                                                {
                                                    "PartyIdentification": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_receptora,
                                                                    "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_receptora,
                                                                    "IdentificationSchemeNameText": "Documento de Identidad",
                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_receptora
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyLegalEntity": [
                                                        {
                                                            "RegistrationName": [ // Va la razón social del Receptor.
                                                                {
                                                                    "TextContent": cab[indice].razon_social_receptora
                                                                }
                                                            ],
                                                            "RegistrationAddress": [ //Va la dirección completa y detallada del Receptor.
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": "140124",
                                                                            "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                            "IdentificationSchemeNameText": "Ubigeos"
                                                                        }
                                                                    ],
                                                                    "CityName": [
                                                                        {
                                                                            "TextContent": cab[indice].departamento_receptora
                                                                        }
                                                                    ],
                                                                    "CountrySubentity": [
                                                                        {
                                                                            "TextContent": cab[indice].provincia_receptora
                                                                        }
                                                                    ],
                                                                    "District": [
                                                                        {
                                                                            "TextContent": cab[indice].distrito_receptora
                                                                        }
                                                                    ],
                                                                    "AddressLine": [  //Va la dirección del Receptor.
                                                                        {
                                                                            "Line": [
                                                                                {
                                                                                    "TextContent": cab[indice].calle_receptora
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    "Country": [
                                                                        {
                                                                            "IdentificationCode": [
                                                                                {
                                                                                    "CodeContent": "PE",
                                                                                    "CodeListIdentifier": "ISO 3166-1",
                                                                                    "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                    "CodeListNameText": "Country"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "Contact": [
                                                        {
                                                            "ElectronicMail": [
                                                                {
                                                                    "TextContent": cab[indice].correo_receptora
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],

                                    "TaxTotal": [
                                        {
                                            "TaxAmount": [
                                                {
                                                    "AmountContent": "0",
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxSubtotal": [
                                                {
                                                    "TaxableAmount": [
                                                        {
                                                            "AmountContent": parseFloat(Math.round(cab[indice].monto_total)).toFixed(2),
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ],
                                                    "TaxAmount": [
                                                        {
                                                            "AmountContent": "0",
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ],
                                                    "TaxCategory": [
                                                        {
                                                            "TaxScheme": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": cab[indice].cod_tributo,
                                                                            "IdentificationSchemeNameText": "Codigo de tributos",
                                                                            "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                            "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                        }
                                                                    ],
                                                                    "Name": [
                                                                        {
                                                                            "TextContent": cab[indice].nom_tributo
                                                                        }
                                                                    ],
                                                                    "TaxTypeCode": [
                                                                        {
                                                                            "CodeContent": cab[indice].tipo_tributo
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    "LegalMonetaryTotal": [
                                        {
                                            "LineExtensionAmount": [
                                                {
                                                    "AmountContent": "0",
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxInclusiveAmount": [
                                                {
                                                    "AmountContent": "0",
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "PayableAmount": [
                                                {
                                                    "AmountContent": "0",
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ]
                                        }
                                    ],
                                    "InvoiceLine": InvoiceLine_aux
                                }
                            ]
                        }
                        //------ fin bonificacion ---
                    } else {  ////NORMAL Y LAS INAFECTAS
                        json_NotaCredito = {
                            "_D": "urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2",
                            "_S": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
                            "_B": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
                            "_E": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
                            "CreditNote": [
                                {
                                    "UBLVersionID": [
                                        {
                                            "IdentifierContent": "2.1"
                                        }
                                    ],
                                    "CustomizationID": [
                                        {
                                            "IdentifierContent": "2.0"
                                        }
                                    ],
                                    "ID": [
                                        {
                                            "IdentifierContent": cab[indice].nro_doc
                                        }
                                    ],
                                    "IssueDate": [
                                        {
                                            "DateContent": cab[indice].fecha_emision
                                        }
                                    ],
                                    "IssueTime": [
                                        {
                                            "DateTimeContent": cab[indice].hora_emision
                                        }
                                    ],
                                    "Note": [
                                        {
                                            "TextContent": nroLetra,
                                            "LanguageLocaleIdentifier": "1000"
                                        }
                                    ],
                                    "DocumentCurrencyCode": [
                                        {
                                            "CodeContent": cab[indice].tipo_moneda_sunat,
                                            "CodeListIdentifier": "ISO 4217 Alpha",
                                            "CodeListNameText": "Currency",
                                            "CodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                        }
                                    ],
                                    "DiscrepancyResponse": [
                                        {

                                            "ResponseCode": [
                                                {
                                                    "CodeContent": cab[indice].codigo_operacion,
                                                    "CodeListAgencyNameText": "PE:SUNAT",
                                                    "CodeListNameText": "Tipo de nota de credito",
                                                    "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo09"
                                                }
                                            ],
                                            "Description": [
                                                {
                                                    "TextContent": cab[indice].descripcion_operacion
                                                }
                                            ]
                                        }
                                    ],

                                    "BillingReference": [
                                        {
                                            "InvoiceDocumentReference": [
                                                {
                                                    "ID": [
                                                        {
                                                            "IdentifierContent": cab[indice].nro_doc_ref
                                                        }
                                                    ],
                                                    "IssueDate": [
                                                        {
                                                            "DateContent": cab[indice].fecha_ref
                                                        }
                                                    ],
                                                    "DocumentTypeCode": [
                                                        {
                                                            "CodeContent": cab[indice].identificador,
                                                            "CodeListNameText": "Tipo de Documento",
                                                            "CodeListSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
                                                            "CodeListAgencyNameText": "PE:SUNAT"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],

                                    "Signature": [
                                        {
                                            "ID": [
                                                {
                                                    "IdentifierContent": "IDSignature"
                                                }
                                            ],
                                            "SignatoryParty": [
                                                {
                                                    "PartyIdentification": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_emite
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emite
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            "DigitalSignatureAttachment": [
                                                {
                                                    "ExternalReference": [
                                                        {
                                                            "URI": [
                                                                {
                                                                    "TextContent": "IDSignature"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    "AccountingSupplierParty": [
                                        {
                                            "Party": [
                                                {
                                                    "PartyIdentification": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_emite,
                                                                    "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_emite,
                                                                    "IdentificationSchemeNameText": "Documento de Identidad",
                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emite
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyLegalEntity": [
                                                        {
                                                            "RegistrationName": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emite
                                                                }
                                                            ],
                                                            "RegistrationAddress": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": "150111",
                                                                            "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                            "IdentificationSchemeNameText": "Ubigeos"
                                                                        }
                                                                    ],
                                                                    "AddressTypeCode": [
                                                                        {
                                                                            "CodeContent": cab[indice].cod_establecimiento,
                                                                            "CodeListAgencyNameText": "PE:SUNAT",
                                                                            "CodeListNameText": "Establecimientos anexos"
                                                                        }
                                                                    ],
                                                                    "CityName": [
                                                                        {
                                                                            "TextContent": cab[indice].departamento_emite
                                                                        }
                                                                    ],
                                                                    "CountrySubentity": [
                                                                        {
                                                                            "TextContent": cab[indice].provincia_emite
                                                                        }
                                                                    ],
                                                                    "District": [
                                                                        {
                                                                            "TextContent": cab[indice].distrito_emite
                                                                        }
                                                                    ],
                                                                    "AddressLine": [
                                                                        {
                                                                            "Line": [
                                                                                {
                                                                                    "TextContent": cab[indice].calle_emite
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    "Country": [
                                                                        {
                                                                            "IdentificationCode": [
                                                                                {
                                                                                    "CodeContent": "PE",
                                                                                    "CodeListIdentifier": "ISO 3166-1",
                                                                                    "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                    "CodeListNameText": "Country"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],

                                    "AccountingCustomerParty": [
                                        {
                                            "Party": [
                                                {
                                                    "PartyIdentification": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_receptora,
                                                                    "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_receptora,
                                                                    "IdentificationSchemeNameText": "Documento de Identidad",
                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_receptora
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyLegalEntity": [
                                                        {
                                                            "RegistrationName": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_receptora
                                                                }
                                                            ],
                                                            "RegistrationAddress": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": "140124",
                                                                            "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                            "IdentificationSchemeNameText": "Ubigeos"
                                                                        }
                                                                    ],
                                                                    "CityName": [
                                                                        {
                                                                            "TextContent": cab[indice].departamento_receptora
                                                                        }
                                                                    ],
                                                                    "CountrySubentity": [
                                                                        {
                                                                            "TextContent": cab[indice].provincia_receptora
                                                                        }
                                                                    ],
                                                                    "District": [
                                                                        {
                                                                            "TextContent": cab[indice].distrito_receptora
                                                                        }
                                                                    ],
                                                                    "AddressLine": [
                                                                        {
                                                                            "Line": [
                                                                                {
                                                                                    "TextContent": cab[indice].calle_receptora
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    "Country": [
                                                                        {
                                                                            "IdentificationCode": [
                                                                                {
                                                                                    "CodeContent": "PE",
                                                                                    "CodeListIdentifier": "ISO 3166-1",
                                                                                    "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                    "CodeListNameText": "Country"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "Contact": [
                                                        {
                                                            "ElectronicMail": [
                                                                {
                                                                    "TextContent": cab[indice].correo_receptora
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],

                                    "TaxTotal": [
                                        {
                                            "TaxAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxSubtotal": [
                                                {
                                                    "TaxableAmount": [
                                                        {
                                                            "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total * 100) / 100).toFixed(2),
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ],
                                                    "TaxAmount": [
                                                        {
                                                            "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ],
                                                    "TaxCategory": [
                                                        {
                                                            "TaxScheme": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": cab[indice].cod_tributo,
                                                                            "IdentificationSchemeNameText": "Codigo de tributos",
                                                                            "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                            "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                        }
                                                                    ],
                                                                    "Name": [
                                                                        {
                                                                            "TextContent": cab[indice].nom_tributo
                                                                        }
                                                                    ],
                                                                    "TaxTypeCode": [
                                                                        {
                                                                            "CodeContent": cab[indice].tipo_tributo
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]

                                                }
                                            ]
                                        }
                                    ],
                                    "LegalMonetaryTotal": [
                                        {
                                            "LineExtensionAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxInclusiveAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "PayableAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ]
                                        }
                                    ],
                                    "CreditNoteLine": InvoiceLine_aux
                                }
                            ]
                        }
                    }
                    console.log(cab[indice].nombreArchivo + ' : ' + cab[indice].idcab);
                    //console.log(JSON.stringify(json_NotaCredito))               

                    generate_json_file(JSON.stringify(json_NotaCredito), cab[indice].nombreArchivo, cab[indice].idcab)
                        .then(function (res) {
                            //----pasamos la siguiente documento
                            ejecutarConsulta((indice + 1));
                        }, function (error) {
                            console.log(error)
                            //----pasamos la siguiente documento
                            ejecutarConsulta((indice + 1));
                        })

                } else {
                    ejecutarConsulta((indice + 1));
                }

                ///---- fin variable json Boleta
            }

            ejecutarConsulta(0);
        });
    }

    var get_Json_Nota_Debito_Electronica = function (cab, tipoDoc_sunat) {
        var acum = 1;
        var nroLetra = '';
        var x = 1;

        var IndiceGlobal = cab.length;

        return new Promise(resolve => {
            var ejecutarConsulta = function (indice) {
                if (IndiceGlobal == indice) {
                    resolve("OK");
                    return
                }

                if (cab[indice].tipo_doc_sunat == tipoDoc_sunat) {

                    var InvoiceLine_aux = [];
                    cab[indice].DETCONTENT.forEach(function (itemDet, indexDet) {

                        if (cab[indice].cod_impuesto == '31') {  /// BONIFICACION
                            //------ inicio bonificacion Facturas---

                            InvoiceLine_aux.push({
                                "ID": [
                                    {
                                        "IdentifierContent": acum
                                    }
                                ],
                                "Note": [
                                    {
                                        "TextContent": cab[indice].cod_unidad
                                    }
                                ],
                                "DebitedQuantity": [
                                    {
                                        "QuantityContent": itemDet.cantidad,
                                        "QuantityUnitCode": itemDet.cod_unidad_sunat,
                                        "QuantityUnitCodeListIdentifier": "UN/ECE rec 20",
                                        "QuantityUnitCodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                    }
                                ],
                                "LineExtensionAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                    }
                                ],
                                "PricingReference": [
                                    {
                                        "AlternativeConditionPrice": [
                                            {
                                                "PriceAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),
                                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                    }
                                                ],
                                                "PriceTypeCode": [
                                                    {
                                                        "CodeContent": "02",
                                                        "CodeListNameText": "Tipo de Precio",
                                                        "CodeListAgencyNameText": "PE:SUNAT",
                                                        "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "TaxTotal": [
                                    {
                                        "TaxAmount": [
                                            {
                                                "AmountContent": "0",
                                                "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxSubtotal": [
                                            {
                                                "TaxableAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                    }
                                                ],
                                                "TaxAmount": [
                                                    {
                                                        "AmountContent": "0",
                                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                    }
                                                ],
                                                "TaxCategory": [
                                                    {
                                                        "Percent": [
                                                            {
                                                                "NumericContent": cab[indice].porc_igv
                                                            }
                                                        ],
                                                        "TaxExemptionReasonCode": [
                                                            {
                                                                "CodeContent": cab[indice].cod_impuesto,
                                                                "CodeListAgencyNameText": "PE:SUNAT",
                                                                "CodeListNameText": "Afectacion del IGV",
                                                                "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
                                                            }
                                                        ],
                                                        "TaxScheme": [
                                                            {
                                                                "ID": [
                                                                    {
                                                                        "IdentifierContent": cab[indice].cod_tributo,
                                                                        "IdentificationSchemeNameText": "Codigo de tributos",
                                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                    }
                                                                ],
                                                                "Name": [
                                                                    {
                                                                        "TextContent": cab[indice].nom_tributo
                                                                    }
                                                                ],
                                                                "TaxTypeCode": [
                                                                    {
                                                                        "CodeContent": cab[indice].tipo_tributo
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "Item": [
                                    {
                                        "Description": [
                                            {
                                                "TextContent": itemDet.nombre_producto
                                            }
                                        ],
                                        "SellersItemIdentification": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": itemDet.codigo_producto
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "Price": [
                                    {
                                        "PriceAmount": [
                                            {
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat,
                                                "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),

                                            }
                                        ]
                                    }
                                ]
                            });

                            //------ inicio bonificacion Facturas---
                        } else {
                            InvoiceLine_aux.push({
                                "ID": [
                                    {
                                        "IdentifierContent": acum
                                    }
                                ],
                                "Note": [
                                    {
                                        "TextContent": cab[indice].cod_unidad
                                    }
                                ],
                                "CreditedQuantity": [
                                    {
                                        "QuantityContent": itemDet.cantidad,
                                        "QuantityUnitCode": itemDet.cod_unidad_sunat,
                                        "QuantityUnitCodeListIdentifier": "UN/ECE rec 20",
                                        "QuantityUnitCodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                    }
                                ],
                                "LineExtensionAmount": [
                                    {
                                        "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                    }
                                ],
                                "PricingReference": [
                                    {
                                        "AlternativeConditionPrice": [
                                            {
                                                "PriceAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(itemDet.monto_total_det * 100) / 100).toFixed(2),
                                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                    }
                                                ],
                                                "PriceTypeCode": [
                                                    {
                                                        "CodeContent": "01",
                                                        "CodeListNameText": "Tipo de Precio",
                                                        "CodeListAgencyNameText": "PE:SUNAT",
                                                        "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],

                                "TaxTotal": [
                                    {
                                        "TaxAmount": [
                                            {
                                                "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                                "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                            }
                                        ],
                                        "TaxSubtotal": [
                                            {
                                                "TaxableAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(itemDet.monto_sub_total_det * 100) / 100).toFixed(2),
                                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                    }
                                                ],
                                                "TaxAmount": [
                                                    {
                                                        "AmountContent": parseFloat(Math.round(itemDet.monto_total_igv_det * 100) / 100).toFixed(2),
                                                        "AmountCurrencyIdentifier": itemDet.tipo_moneda_sunat
                                                    }
                                                ],
                                                "TaxCategory": [
                                                    {
                                                        "Percent": [
                                                            {
                                                                "NumericContent": cab[indice].porc_igv
                                                            }
                                                        ],
                                                        "TaxExemptionReasonCode": [
                                                            {
                                                                "CodeContent": cab[indice].cod_impuesto,
                                                                "CodeListAgencyNameText": "PE:SUNAT",
                                                                "CodeListNameText": "Afectacion del IGV",
                                                                "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07"
                                                            }
                                                        ],
                                                        "TaxScheme": [
                                                            {
                                                                "ID": [
                                                                    {
                                                                        "IdentifierContent": cab[indice].cod_tributo,
                                                                        "IdentificationSchemeNameText": "Codigo de tributos",
                                                                        "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                        "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                    }
                                                                ],
                                                                "Name": [
                                                                    {
                                                                        "TextContent": cab[indice].nom_tributo
                                                                    }
                                                                ],
                                                                "TaxTypeCode": [
                                                                    {
                                                                        "CodeContent": cab[indice].tipo_tributo
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "Item": [
                                    {
                                        "Description": [
                                            {
                                                "TextContent": itemDet.nombre_producto
                                            }
                                        ],
                                        "SellersItemIdentification": [
                                            {
                                                "ID": [
                                                    {
                                                        "IdentifierContent": itemDet.codigo_producto
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "Price": [
                                    {
                                        "PriceAmount": [
                                            {
                                                "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat,
                                                "AmountContent": parseFloat(Math.round(itemDet.precio_venta * 100) / 100).toFixed(2),

                                            }
                                        ]
                                    }
                                ]
                            });
                        }
                        acum = acum + 1;

                    })

                    nroLetra = NumeroALetras(cab[indice].monto_total);
                    var json_NotaDebito = '';

                    if (cab[indice].cod_impuesto == '31') {  /// BONIFICACION
                        //------ inicio bonificacion Facturas---
                        json_NotaDebito = {
                            "_D": "urn:oasis:names:specification:ubl:schema:xsd:DebitNote-2",
                            "_S": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
                            "_B": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
                            "_E": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
                            "DebitNote": [
                                {
                                    "UBLVersionID": [
                                        {
                                            "IdentifierContent": "2.1"
                                        }
                                    ],
                                    "CustomizationID": [
                                        {
                                            "IdentifierContent": "2.0"
                                        }
                                    ],
                                    "ID": [
                                        {
                                            "IdentifierContent": cab[indice].nro_doc
                                        }
                                    ],
                                    "IssueDate": [
                                        {
                                            "DateContent": cab[indice].fecha_emision
                                        }
                                    ],
                                    "IssueTime": [
                                        {
                                            "DateTimeContent": cab[indice].hora_emision
                                        }
                                    ],
                                    "Note": [
                                        {
                                            "TextContent": nroLetra,
                                            "LanguageLocaleIdentifier": "1000"
                                        }
                                    ],
                                    "DocumentCurrencyCode": [
                                        {
                                            "CodeContent": cab[indice].tipo_moneda_sunat,
                                            "CodeListIdentifier": "ISO 4217 Alpha",
                                            "CodeListNameText": "Currency",
                                            "CodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                        }
                                    ],
                                    "DiscrepancyResponse": [
                                        {
                                            "ResponseCode": [
                                                {
                                                    "CodeContent": cab[indice].codigo_operacion,
                                                    "CodeListAgencyNameText": "PE:SUNAT",
                                                    "CodeListNameText": "Tipo de nota de debito",
                                                    "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo10"
                                                }
                                            ],
                                            "Description": [
                                                {
                                                    "TextContent": cab[indice].descripcion_operacion
                                                }
                                            ]
                                        }
                                    ],
                                    "BillingReference": [
                                        {
                                            "InvoiceDocumentReference": [
                                                {
                                                    "ID": [
                                                        {
                                                            "IdentifierContent": cab[indice].nro_doc_ref
                                                        }
                                                    ],
                                                    "IssueDate": [
                                                        {
                                                            "DateContent": cab[indice].fecha_ref
                                                        }
                                                    ],
                                                    "DocumentTypeCode": [
                                                        {
                                                            "CodeContent": cab[indice].identificador,
                                                            "CodeListNameText": "Tipo de Documento",
                                                            "CodeListSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
                                                            "CodeListAgencyNameText": "PE:SUNAT"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],

                                    "Signature": [
                                        {
                                            "ID": [
                                                {
                                                    "IdentifierContent": "IDSignature"
                                                }
                                            ],
                                            "SignatoryParty": [
                                                {
                                                    "PartyIdentification": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_emite
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emite
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            "DigitalSignatureAttachment": [
                                                {
                                                    "ExternalReference": [
                                                        {
                                                            "URI": [
                                                                {
                                                                    "TextContent": "IDSignature"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],

                                    "AccountingSupplierParty": [
                                        {
                                            "Party": [
                                                {
                                                    "PartyIdentification": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_emite,
                                                                    "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_emite,
                                                                    "IdentificationSchemeNameText": "Documento de Identidad",
                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emite
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyLegalEntity": [
                                                        {
                                                            "RegistrationName": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emite
                                                                }
                                                            ],
                                                            "RegistrationAddress": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": "150111",
                                                                            "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                            "IdentificationSchemeNameText": "Ubigeos"
                                                                        }
                                                                    ],
                                                                    "AddressTypeCode": [
                                                                        {
                                                                            "CodeContent": cab[indice].cod_establecimiento,
                                                                            "CodeListAgencyNameText": "PE:SUNAT",
                                                                            "CodeListNameText": "Establecimientos anexos"
                                                                        }
                                                                    ],
                                                                    "CityName": [
                                                                        {
                                                                            "TextContent": cab[indice].departamento_emite
                                                                        }
                                                                    ],
                                                                    "CountrySubentity": [
                                                                        {
                                                                            "TextContent": cab[indice].provincia_emite
                                                                        }
                                                                    ],
                                                                    "District": [
                                                                        {
                                                                            "TextContent": cab[indice].distrito_emite
                                                                        }
                                                                    ],
                                                                    "AddressLine": [
                                                                        {
                                                                            "Line": [
                                                                                {
                                                                                    "TextContent": cab[indice].calle_emite
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    "Country": [
                                                                        {
                                                                            "IdentificationCode": [
                                                                                {
                                                                                    "CodeContent": "PE",
                                                                                    "CodeListIdentifier": "ISO 3166-1",
                                                                                    "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                    "CodeListNameText": "Country"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],


                                    "AccountingCustomerParty": [
                                        {
                                            "Party": [
                                                {
                                                    "PartyIdentification": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_receptora,
                                                                    "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_receptora,
                                                                    "IdentificationSchemeNameText": "Documento de Identidad",
                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_receptora
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyLegalEntity": [
                                                        {
                                                            "RegistrationName": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_receptora
                                                                }
                                                            ],
                                                            "RegistrationAddress": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": "140124",
                                                                            "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                            "IdentificationSchemeNameText": "Ubigeos"
                                                                        }
                                                                    ],
                                                                    "CityName": [
                                                                        {
                                                                            "TextContent": cab[indice].departamento_receptora
                                                                        }
                                                                    ],
                                                                    "CountrySubentity": [
                                                                        {
                                                                            "TextContent": cab[indice].provincia_receptora
                                                                        }
                                                                    ],
                                                                    "District": [
                                                                        {
                                                                            "TextContent": cab[indice].distrito_receptora
                                                                        }
                                                                    ],
                                                                    "AddressLine": [
                                                                        {
                                                                            "Line": [
                                                                                {
                                                                                    "TextContent": cab[indice].calle_receptora
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    "Country": [
                                                                        {
                                                                            "IdentificationCode": [
                                                                                {
                                                                                    "CodeContent": "PE",
                                                                                    "CodeListIdentifier": "ISO 3166-1",
                                                                                    "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                    "CodeListNameText": "Country"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "Contact": [
                                                        {
                                                            "ElectronicMail": [
                                                                {
                                                                    "TextContent": cab[indice].correo_receptora
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],

                                    "TaxTotal": [
                                        {
                                            "TaxAmount": [
                                                {
                                                    "AmountContent": "0",
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxSubtotal": [
                                                {
                                                    "TaxableAmount": [
                                                        {
                                                            "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ],
                                                    "TaxAmount": [
                                                        {
                                                            "AmountContent": "0",
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ],
                                                    "TaxCategory": [
                                                        {
                                                            "TaxScheme": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": cab[indice].cod_tributo,
                                                                            "IdentificationSchemeNameText": "Codigo de tributos",
                                                                            "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                            "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                        }
                                                                    ],
                                                                    "Name": [
                                                                        {
                                                                            "TextContent": cab[indice].nom_tributo
                                                                        }
                                                                    ],
                                                                    "TaxTypeCode": [
                                                                        {
                                                                            "CodeContent": cab[indice].tipo_tributo
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    "RequestedMonetaryTotal": [
                                        {
                                            "LineExtensionAmount": [
                                                {
                                                    "AmountContent": "0",
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxInclusiveAmount": [
                                                {
                                                    "AmountContent": "0",
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "PayableAmount": [
                                                {
                                                    "AmountContent": "0",
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ]
                                        }
                                    ],
                                    "DebitNoteLine": InvoiceLine_aux
                                }
                            ]
                        }
                        //------ inicio bonificacion Facturas---
                    }
                    else {
                        json_NotaDebito = {
                            "_D": "urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2",
                            "_S": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
                            "_B": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
                            "_E": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
                            "CreditNote": [
                                {
                                    "UBLVersionID": [
                                        {
                                            "IdentifierContent": "2.1"
                                        }
                                    ],
                                    "CustomizationID": [
                                        {
                                            "IdentifierContent": "2.0"
                                        }
                                    ],
                                    "ID": [
                                        {
                                            "IdentifierContent": cab[indice].nro_doc
                                        }
                                    ],
                                    "IssueDate": [
                                        {
                                            "DateContent": cab[indice].fecha_emision
                                        }
                                    ],
                                    "IssueTime": [
                                        {
                                            "DateTimeContent": cab[indice].hora_emision
                                        }
                                    ],
                                    "Note": [
                                        {
                                            "TextContent": nroLetra,
                                            "LanguageLocaleIdentifier": "1000"
                                        }
                                    ],
                                    "DocumentCurrencyCode": [
                                        {
                                            "CodeContent": cab[indice].tipo_moneda_sunat,
                                            "CodeListIdentifier": "ISO 4217 Alpha",
                                            "CodeListNameText": "Currency",
                                            "CodeListAgencyNameText": "United Nations Economic Commission for Europe"
                                        }
                                    ],
                                    "DiscrepancyResponse": [
                                        {

                                            "ResponseCode": [
                                                {
                                                    "CodeContent": cab[indice].codigo_operacion,
                                                    "CodeListAgencyNameText": "PE:SUNAT",
                                                    "CodeListNameText": "Tipo de nota de credito",
                                                    "CodeListUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo09"
                                                }
                                            ],
                                            "Description": [
                                                {
                                                    "TextContent": cab[indice].descripcion_operacion
                                                }
                                            ]
                                        }
                                    ],

                                    "BillingReference": [
                                        {
                                            "InvoiceDocumentReference": [
                                                {
                                                    "ID": [
                                                        {
                                                            "IdentifierContent": cab[indice].nro_doc_ref
                                                        }
                                                    ],
                                                    "IssueDate": [
                                                        {
                                                            "DateContent": cab[indice].fecha_ref
                                                        }
                                                    ],
                                                    "DocumentTypeCode": [
                                                        {
                                                            "CodeContent": cab[indice].identificador,
                                                            "CodeListNameText": "Tipo de Documento",
                                                            "CodeListSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01",
                                                            "CodeListAgencyNameText": "PE:SUNAT"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],

                                    "Signature": [
                                        {
                                            "ID": [
                                                {
                                                    "IdentifierContent": "IDSignature"
                                                }
                                            ],
                                            "SignatoryParty": [
                                                {
                                                    "PartyIdentification": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_emite
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emite
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            "DigitalSignatureAttachment": [
                                                {
                                                    "ExternalReference": [
                                                        {
                                                            "URI": [
                                                                {
                                                                    "TextContent": "IDSignature"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    "AccountingSupplierParty": [
                                        {
                                            "Party": [
                                                {
                                                    "PartyIdentification": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_emite,
                                                                    "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_emite,
                                                                    "IdentificationSchemeNameText": "Documento de Identidad",
                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emite
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyLegalEntity": [
                                                        {
                                                            "RegistrationName": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_emite
                                                                }
                                                            ],
                                                            "RegistrationAddress": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": "150111",
                                                                            "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                            "IdentificationSchemeNameText": "Ubigeos"
                                                                        }
                                                                    ],
                                                                    "AddressTypeCode": [
                                                                        {
                                                                            "CodeContent": cab[indice].cod_establecimiento,
                                                                            "CodeListAgencyNameText": "PE:SUNAT",
                                                                            "CodeListNameText": "Establecimientos anexos"
                                                                        }
                                                                    ],
                                                                    "CityName": [
                                                                        {
                                                                            "TextContent": cab[indice].departamento_emite
                                                                        }
                                                                    ],
                                                                    "CountrySubentity": [
                                                                        {
                                                                            "TextContent": cab[indice].provincia_emite
                                                                        }
                                                                    ],
                                                                    "District": [
                                                                        {
                                                                            "TextContent": cab[indice].distrito_emite
                                                                        }
                                                                    ],
                                                                    "AddressLine": [
                                                                        {
                                                                            "Line": [
                                                                                {
                                                                                    "TextContent": cab[indice].calle_emite
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    "Country": [
                                                                        {
                                                                            "IdentificationCode": [
                                                                                {
                                                                                    "CodeContent": "PE",
                                                                                    "CodeListIdentifier": "ISO 3166-1",
                                                                                    "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                    "CodeListNameText": "Country"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],

                                    "AccountingCustomerParty": [
                                        {
                                            "Party": [
                                                {
                                                    "PartyIdentification": [
                                                        {
                                                            "ID": [
                                                                {
                                                                    "IdentifierContent": cab[indice].ruc_empresa_receptora,
                                                                    "IdentificationSchemeIdentifier": cab[indice].tipo_doc_identidad_receptora,
                                                                    "IdentificationSchemeNameText": "Documento de Identidad",
                                                                    "IdentificationSchemeAgencyNameText": "PE:SUNAT",
                                                                    "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06"
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyName": [
                                                        {
                                                            "Name": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_receptora
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "PartyLegalEntity": [
                                                        {
                                                            "RegistrationName": [
                                                                {
                                                                    "TextContent": cab[indice].razon_social_receptora
                                                                }
                                                            ],
                                                            "RegistrationAddress": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": "140124",
                                                                            "IdentificationSchemeAgencyNameText": "PE:INEI",
                                                                            "IdentificationSchemeNameText": "Ubigeos"
                                                                        }
                                                                    ],
                                                                    "CityName": [
                                                                        {
                                                                            "TextContent": cab[indice].departamento_receptora
                                                                        }
                                                                    ],
                                                                    "CountrySubentity": [
                                                                        {
                                                                            "TextContent": cab[indice].provincia_receptora
                                                                        }
                                                                    ],
                                                                    "District": [
                                                                        {
                                                                            "TextContent": cab[indice].distrito_receptora
                                                                        }
                                                                    ],
                                                                    "AddressLine": [
                                                                        {
                                                                            "Line": [
                                                                                {
                                                                                    "TextContent": cab[indice].calle_receptora
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    "Country": [
                                                                        {
                                                                            "IdentificationCode": [
                                                                                {
                                                                                    "CodeContent": "PE",
                                                                                    "CodeListIdentifier": "ISO 3166-1",
                                                                                    "CodeListAgencyNameText": "United Nations Economic Commission for Europe",
                                                                                    "CodeListNameText": "Country"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "Contact": [
                                                        {
                                                            "ElectronicMail": [
                                                                {
                                                                    "TextContent": cab[indice].correo_receptora
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],

                                    "TaxTotal": [
                                        {
                                            "TaxAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxSubtotal": [
                                                {
                                                    "TaxableAmount": [
                                                        {
                                                            "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total * 100) / 100).toFixed(2),
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ],
                                                    "TaxAmount": [
                                                        {
                                                            "AmountContent": parseFloat(Math.round(cab[indice].monto_total_igv * 100) / 100).toFixed(2),
                                                            "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                        }
                                                    ],
                                                    "TaxCategory": [
                                                        {
                                                            "TaxScheme": [
                                                                {
                                                                    "ID": [
                                                                        {
                                                                            "IdentifierContent": cab[indice].cod_tributo,
                                                                            "IdentificationSchemeNameText": "Codigo de tributos",
                                                                            "IdentificationSchemeUniformResourceIdentifier": "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05",
                                                                            "IdentificationSchemeAgencyNameText": "PE:SUNAT"
                                                                        }
                                                                    ],
                                                                    "Name": [
                                                                        {
                                                                            "TextContent": cab[indice].nom_tributo
                                                                        }
                                                                    ],
                                                                    "TaxTypeCode": [
                                                                        {
                                                                            "CodeContent": cab[indice].tipo_tributo
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]

                                                }
                                            ]
                                        }
                                    ],
                                    "LegalMonetaryTotal": [
                                        {
                                            "LineExtensionAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(cab[indice].monto_sub_total * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "TaxInclusiveAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ],
                                            "PayableAmount": [
                                                {
                                                    "AmountContent": parseFloat(Math.round(cab[indice].monto_total * 100) / 100).toFixed(2),
                                                    "AmountCurrencyIdentifier": cab[indice].tipo_moneda_sunat
                                                }
                                            ]
                                        }
                                    ],
                                    "CreditNoteLine": InvoiceLine_aux
                                }
                            ]
                        }
                    }

                    console.log(cab[indice].nombreArchivo + ' : ' + cab[indice].idcab);
                    //console.log(JSON.stringify(json_NotaDebito))
                    generate_json_file(JSON.stringify(json_NotaDebito), cab[indice].nombreArchivo, cab[indice].idcab)
                        .then(function (res) {
                            //----pasamos la siguiente documento
                            ejecutarConsulta((indice + 1));
                        }, function (error) {
                            console.log(error)
                            //----pasamos la siguiente documento
                            ejecutarConsulta((indice + 1));
                        })

                } else {
                    ejecutarConsulta((indice + 1));
                }

                ///---- fin variable json Boleta
            }

            ejecutarConsulta(0);
        });
    }

    //------fin de version 2 -----

    var generate_json_file = function (json_Facturacion, nombreArchivo, idCab) {
        var q = $q.defer();
        $scope.loader_modal = true;
        Reenvio_DocumentosServices.GenerarArchivo_Json(json_Facturacion, nombreArchivo, idCab, 0)
            .then(function (resultado) {
                $scope.loader_modal = false;
                q.resolve('success');
                console.log('resultado');
                console.log(resultado);
            }, function (eror) {
                $scope.loader_modal = false;
                q.reject(err);
                console.log(eror);
            })
        return q.promise;
    }


    // METODO PARA CHEKED ALL
    $scope.checkedAll = false;
    $scope.checkedAll_doc = function (checked) {
        if (checked) {
            angular.forEach($scope.listadetalle_documentos, function (child) {
                child.checkeado = true;
            })
        } else {
            angular.forEach($scope.listadetalle_documentos, function (child) {
                child.checkeado = false;
            })
        }
    }



    ////------------------------------------------------------------
    ////---- NUEVA VERSION DE FACTURACION ELECTRONICA CON NUBE-FACT
    ////-----------------------------------------------------------/////


    $scope.generando_reenvio_Documentos_new = function () {
        if ($scope.listadetalle_documentos == null || $scope.listadetalle_documentos.length == 0) {
            auxiliarServices.NotificationMessage('Sistemas', 'No hay Documentos para Generar..', 'error', '#ff6849', 1500);
            return;
        }

        flag_marco = MarcoCheck();
        if (flag_marco == false) {
            auxiliarServices.NotificationMessage('Sistemas', 'Por favor seleccione al menos un registro', 'error', '#ff6849', 1500);
            return;
        }

        var lista_documentos_Renviar = [];

        for (obj of $scope.listadetalle_documentos) {
            if (obj.checkeado == true) {
                lista_documentos_Renviar.push(obj)
            }
        }

        var params = {
            title: "Desea continuar ?",
            text: 'Esta por Enviar los Documentos nuevamente a la sunat, este proceso puede demorar un poco..',
            type: 'confirmationAlert',
        }
        auxiliarServices.initSweetAlert(params).then(function (res) {
            if (res == true) {

                var CantDocumentosGlobal = lista_documentos_Renviar.length;
                var id_tipoDoc = 0;
                $('#btn_cancelar').attr("disabled", true);

                $("#id_alertas").show(100);

                var GenerarDocumentosVentas = function (index) {
                    if (CantDocumentosGlobal == index) {
                        let params = {
                            type: 'alert',
                            title: 'Excelente !',
                            text: 'Proceso de Registro realizado correctamente !'
                        };
                        auxiliarServices.initSweetAlert(params).then(function (res) {

                        });
                        $scope.NombreTipoDocumento = '';
                        $scope.loader_modal = false;
                        $("#id_alertas").hide(1000);
                        $scope.listando_all_documentos_erroneos();
                        return;
                    }
                    id_tipoDoc = lista_documentos_Renviar[index].id_TipoDocumento;
                    $scope.NombreTipoDocumento = 'Enviando a la sunat el Nro. Doc :' + lista_documentos_Renviar[index].Numero_Documento;
                    $scope.loader_modal = true;

                    if (id_tipoDoc == 1 || id_tipoDoc == '1' || id_tipoDoc == 2 || id_tipoDoc == '2') {
                        Documentos_MasivosServices.generarFacturacion_boletasFacturas(lista_documentos_Renviar[index].id_TipoDocumento, lista_documentos_Renviar[index].Numero_Documento)
                            .then(function (res) {

                                console.log('generarFacturacion_boletasFacturas')
                                console.log(res)

                                $scope.loader_modal = false;
                                if (res.ok) {

                                } else {                              
                                    auxiliarServices.NotificationMessage('Sistemas', res.data, 'error', '#ff6849', 3000);
                                    $scope.NombreTipoDocumento = 'Error al Enviar el Nro. Doc ' + lista_documentos_Renviar[index].Numero_Documento;
                                }    
                                GenerarDocumentosVentas((index + 1));

                            }, function (error) {
                                $scope.loader_modal = false;
                                auxiliarServices.NotificationMessage('Sistemas', 'Se produjo un error al Enviar a la Sunat el Nro. Doc : ' + $scope.Numero_Documento, 'error', '#ff6849', 3000);
                                $scope.NombreTipoDocumento = 'Error al Enviar el Nro. Doc ' + lista_documentos_Renviar[index].Numero_Documento;
                                GenerarDocumentosVentas(index + 1);
                            })
                    }
                    else if (id_tipoDoc == 14 || id_tipoDoc == '14' || id_tipoDoc == 15 || id_tipoDoc == '15') {
                        console.log(lista_documentos_Renviar[index].id_Factura_Cab_Referencia)
                        Documentos_MasivosServices.generarFacturacion_notasCreditoDebito(lista_documentos_Renviar[index].id_TipoDocumento, lista_documentos_Renviar[index].Numero_Documento, lista_documentos_Renviar[index].id_Factura_Cab_Referencia)
                            .then(function (res) {
 
                                $scope.loader_modal = false;
                                if (res.ok) {

                                } else {
                                    auxiliarServices.NotificationMessage('Sistemas', res.data, 'error', '#ff6849', 3000);
                                    $scope.NombreTipoDocumento = 'Error al Enviar el Nro. Doc ' + lista_documentos_Renviar[index].Numero_Documento;
                                } 

                                GenerarDocumentosVentas((index + 1));
                            }, function (error) {
                                console.log('error');
                                console.log(error)
                                $scope.loader_modal = false;
                                auxiliarServices.NotificationMessage('Sistemas', 'Se produjo un error al Enviar a la Sunat el Nro. Doc : ' + $scope.Numero_Documento, 'error', '#ff6849', 3000);
                                $scope.NombreTipoDocumento = 'Error al Enviar el Nro. Doc :' + lista_documentos_Renviar[index].Numero_Documento;
                                GenerarDocumentosVentas(index + 1);
                            })
                    }
                }

                GenerarDocumentosVentas(0);
            }
        });

    }


 

    ////--------------------------------------------------------------------
    ////---- FIN DE NUEVA VERSION DE FACTURACION ELECTRONICA CON NUBE-FACT
    ////----------------------------------------------------------------/////



    $scope.lista_anexos = [];
    $scope.lista_anexosModal = [];
    $scope.listados_anexos = function () {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_Anexos_Usuario_modulo(auxiliarServices.getUserId()).then(function (res) {
            $scope.loaderFiltro = false;

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
            $scope.loaderFiltro = false;
            console.log(err);
        });
    };
    $scope.listados_anexos();


    $scope.Lista_Almacen = [];
    $scope.change_anexo_Almacen_filtro = function (idAnexo) {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_almacenes_anexos_modulo(idAnexo, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderfiltros = false;
                if (res.ok == true) {
                    $scope.Lista_Almacen = [];
                    $scope.Lista_Almacen = res.data;
                    setTimeout(function () {
                        $scope.Objeto_ParametroFiltro.id_almacen = '0';
                        $('#cbo_almacen').val("0").trigger('change.select2');
                    }, 0);
                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }
            }, function (err) {
                $scope.loaderFiltro = false;
                console.log(err);
            });
    };



    $scope.Lista_zonasFiltro = [];
    $scope.get_changeAnexoZonasFiltro = function (id_Anexos) {
        $scope.loaderFiltro = true;
        RevisionPedidoServices.get_Zonas_anexos_modulo(id_Anexos, auxiliarServices.getUserId())
            .then(function (res) {
                $scope.loaderFiltro = false;
                if (res.ok == true) {
                    $scope.Lista_zonasFiltro = [];
                    $scope.Lista_zonasFiltro = res.data;

                    $timeout(function () {
                        $scope.Objeto_ParametroFiltro.id_ZonaVta = '0';
                        $('#cbo_zonasFiltro').val("0").trigger('change.select2');
                    })

                } else {
                    auxiliarServices.NotificationMessage('Sistemas', 'Lo sentimos se produjo un error', 'error', '#ff6849', 2000);
                    alert(res.data);
                }

            }, function (err) {
                $scope.loaderFiltro = false;
                console.log(err);
            });
    };




     
})