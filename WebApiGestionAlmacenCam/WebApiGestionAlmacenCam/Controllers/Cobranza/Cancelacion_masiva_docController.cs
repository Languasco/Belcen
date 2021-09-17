using Entidades;
using Entidades.Cobranzas;
using Negocio.Cobranza;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Cobranza
{
    [EnableCors("*", "*", "*")]
    public class Cancelacion_masiva_docController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetCancelacionDocumentos(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
 
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_Anexos = Convert.ToInt32(parametros[2].ToString());
                    
                    int vendedor = Convert.ToInt32(parametros[3].ToString());
                    int id_transportista = Convert.ToInt32(parametros[4].ToString());
                    int id_tipoDoc = Convert.ToInt32(parametros[5].ToString());
                    int id_tipoResponsable = Convert.ToInt32(parametros[6].ToString());

                    string fechaIni = parametros[7].ToString();
                    string fechaFin = parametros[8].ToString();


                    Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                    resul = obj_negocio.Listando_Documentos_Cancelar(id_local, id_almacen, id_Anexos, vendedor, id_transportista, id_tipoDoc, id_tipoResponsable, fechaIni, fechaFin);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int id_usuario = Convert.ToInt32(parametros[0].ToString());
 
                    Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                    resul = obj_negocio.Set_rechazando_Cancelaciones(id_usuario);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');

                    int id_tipodoc = Convert.ToInt32(parametros[0].ToString());
                    string nro_documento = parametros[1].ToString();

                    Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                    resul = obj_negocio.Listando_registro_pagos(id_tipodoc, nro_documento);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int id_factura = Convert.ToInt32(parametros[0].ToString());
 
                    Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                    resul = obj_negocio.get_SaldoCuenta_Factura(id_factura);
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');

                    int id_factura = Convert.ToInt32(parametros[0].ToString());
                    string codRef = parametros[1].ToString();

                    decimal totalpago = Convert.ToDecimal(parametros[2].ToString());
                    decimal pagoCueta = Convert.ToDecimal(parametros[3].ToString());

                    int id_formaPago = Convert.ToInt32(parametros[4].ToString());
                    int id_banco = Convert.ToInt32(parametros[5].ToString());

                    string fechaOperacion = parametros[6].ToString();
                    string nroOperacion = parametros[7].ToString();

                    Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                    resul = obj_negocio.Set_Generando_Cancelacion(id_factura, codRef, totalpago, pagoCueta, id_formaPago, id_banco, fechaOperacion, nroOperacion);

                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    int id_cancelacion = Convert.ToInt32(parametros[0].ToString());
                    int id_factura = Convert.ToInt32(parametros[1].ToString());
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                    resul = obj_negocio.Set_anulandoPago_individual(id_cancelacion,id_factura, id_usuario);
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    string nro_ref =  parametros[0].ToString();

                    Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                    resul = obj_negocio.get_ListaFotos_voucher(nro_ref);
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    int idzona = Convert.ToInt32(parametros[0].ToString());
                    string nroRecibo = parametros[1].ToString();
                                       
                    Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                    resul = obj_negocio.get_verificarNroRecibo(idzona, nroRecibo);
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int id_facturaCab = Convert.ToInt32(parametros[0].ToString());

                    Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                    resul = obj_negocio.get_detalladoDocumentos(id_facturaCab);
                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');

                    string fechaInicial = parametros[0].ToString();
                    string fechaFinal = parametros[1].ToString();
                    string nroRecibo = parametros[2].ToString();

                    Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                    resul = obj_negocio.get_cierreVentas(fechaInicial, fechaFinal , nroRecibo);
                }
                else if (opcion == 11)
                {
                    string[] parametros = filtro.Split('|');

                    string fechaInicial = parametros[0].ToString();
                    string fechaFinal = parametros[1].ToString();
                    string nroDoc = parametros[2].ToString();

                    Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                    resul = obj_negocio.get_reporteCobranzasPDF(fechaInicial, fechaFinal, nroDoc);
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');
                    string nroDocumento = parametros[0].ToString();

                    Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                    resul = obj_negocio.get_verificarNro_documentoUsuario(nroDocumento);
                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');

                    int id_ZonaVta = Convert.ToInt32(parametros[0].ToString());
                    string fechaInicial = parametros[1].ToString();
                    string fechaFinal = parametros[2].ToString();
                    string serie = parametros[3].ToString();
                    string numero = parametros[4].ToString();
                    int usuario_creacion = Convert.ToInt32(parametros[5].ToString());

                    Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                    resul = obj_negocio.Set_anulandoNumero(id_ZonaVta, fechaInicial, fechaFinal, serie, numero, usuario_creacion);
                }
                else
                {
                    resul = "Opcion selecciona invalida";
                }
            }
            catch (Exception ex)
            {
                resul = ex.Message;
            }
            return resul;
        }
        
        [HttpPost]
        [Route("api/Cancelacion_masiva_doc/set_guardandoPagos")]
        public string set_guardandoPagos(List<detalle_cancelaciones_E> List_Detalle)
        {
            string resultado = "";
            try
            {
                Cancelacion_masiva_doc_BL obj_negocio = new Cancelacion_masiva_doc_BL();
                resultado = obj_negocio.Set_almacenandoDetalle_Cancelaciones(List_Detalle);
            }
            catch (Exception ex)
            {
                resultado = ex.Message;
            }
            return resultado;

        }

    }
}
