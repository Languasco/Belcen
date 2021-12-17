using Negocio.NubeFact;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
 
using System.Web.Http;

/// USAR LO SIGUIENTE 
using System.Text;


namespace WebApi_Ventas.Controllers.NubeFact
{
    public class GeneracionComprobantes_NubeFactController : ApiController
    {

        NubeFacT nubeFact = new NubeFacT();               
        public void  PostGenerarComprobante_Demo(int TipoDoc, string nroDocumento, int idcab)
        {
            string ruta = nubeFact.ruta;
            string token = nubeFact.token;
            Invoice invoice = new Invoice();

            /// --- --  CREAMOS EL JSON
            ///
            invoice.operacion = "generar_comprobante";
            invoice.tipo_de_comprobante = 1;
            invoice.serie = "FFF1";
            invoice.numero = 1;
            invoice.sunat_transaction = 1;
            invoice.cliente_tipo_de_documento = 6;
            invoice.cliente_numero_de_documento = "20600695771";
            invoice.cliente_denominacion = "NUBEFACT SA";
            invoice.cliente_direccion = "CALLE LIBERTAD 116 MIRAFLORES - LIMA - PERU";
            invoice.cliente_email = "";
            invoice.cliente_email_1 = "";
            invoice.cliente_email_2 = "";
            invoice.fecha_de_emision = DateTime.Now;
            invoice.fecha_de_vencimiento = DateTime.Now.AddDays(3);
            invoice.moneda = 1;
            invoice.tipo_de_cambio = "";
            invoice.porcentaje_de_igv = 18.00;
            invoice.descuento_global = "";
            invoice.total_descuento = "";
            invoice.total_anticipo = "";
            invoice.total_gravada = 600.0;
            invoice.total_inafecta = "";
            invoice.total_exonerada = "";
            invoice.total_igv = 108;
            invoice.total_gratuita = "";
            invoice.total_otros_cargos = "";
            invoice.total = 708;
            invoice.percepcion_tipo = "";
            invoice.percepcion_base_imponible = "";
            invoice.total_percepcion = "";
            invoice.detraccion = false;
            invoice.observaciones = "";
            invoice.documento_que_se_modifica_tipo = "";
            invoice.documento_que_se_modifica_serie = "";
            invoice.documento_que_se_modifica_numero = "";
            invoice.tipo_de_nota_de_credito = "";
            invoice.tipo_de_nota_de_debito = "";
            invoice.enviar_automaticamente_a_la_sunat = true;
            invoice.enviar_automaticamente_al_cliente = false;
            invoice.codigo_unico = "";
            invoice.condiciones_de_pago = "";
            invoice.medio_de_pago = "";
            invoice.placa_vehiculo = "";
            invoice.orden_compra_servicio = "";
            invoice.tabla_personalizada_codigo = "";
            invoice.formato_de_pdf = "";
            invoice.items = new List<Items>()
            {
                new Items()
                {
                    unidad_de_medida = "NIU",
                    codigo = "001",
                    descripcion = "DETALLE DEL PRODUCTO",
                    cantidad = 1,
                    valor_unitario = 500,
                    precio_unitario = 590,
                    descuento = "",
                    subtotal = 500,
                    tipo_de_igv = 1,
                    igv = 90,
                    total = 590,
                    anticipo_regularizacion = false,
                    anticipo_comprobante_serie = "",
                    anticipo_comprobante_numero = ""
                },
                new Items()
                {
                    unidad_de_medida = "ZZ",
                    codigo = "001",
                    descripcion = "DETALLE DEL SERVICIO",
                    cantidad = 5,
                    valor_unitario = 20,
                    precio_unitario = 23.60,
                    descuento = "",
                    subtotal = 100,
                    tipo_de_igv = 1,
                    igv = 18,
                    total = 118,
                    anticipo_regularizacion = false,
                    anticipo_comprobante_serie = "",
                    anticipo_comprobante_numero = ""
                },
            };

            ///--------------------------
            ///----generado el json-----
            ///--------------------------

            string json = JsonConvert.SerializeObject(invoice, Formatting.Indented);
            Console.WriteLine(json);
            byte[] bytes = Encoding.Default.GetBytes(json);
            string json_en_utf_8 = Encoding.UTF8.GetString(bytes);



            ///----------------------------------------
            ///---- Enviando  el json a nubeFact -----
            ///-------------------------- ------------
            
            string json_de_respuesta = nubeFact.SendJson(ruta, json_en_utf_8, token);
            dynamic r = JsonConvert.DeserializeObject<Respuesta>(json_de_respuesta);
            string r2 = JsonConvert.SerializeObject(r, Formatting.Indented);
            dynamic json_r_in = JsonConvert.DeserializeObject<Respuesta>(r2);

            ///----------------------------------------
            ///---- Respuesta nubeFact ----------------
            ///-------------------------- ------------

            dynamic leer_respuesta = JsonConvert.DeserializeObject<Respuesta>(json_de_respuesta);
            if (leer_respuesta.errors == null)
            {
                Console.WriteLine(json_r_in);
                Console.WriteLine();
                Console.WriteLine();
                Console.WriteLine("TIPO: " + leer_respuesta.tipo);
                Console.WriteLine("SERIE: " + leer_respuesta.serie);
                Console.WriteLine("NUMERO: " + leer_respuesta.numero);
                Console.WriteLine("URL: " + leer_respuesta.url);
                Console.WriteLine("ACEPTADA_POR_SUNAT: " + leer_respuesta.aceptada_por_sunat);
                Console.WriteLine("DESCRIPCION SUNAT: " + leer_respuesta.sunat_description);
                Console.WriteLine("NOTA SUNAT: " + leer_respuesta.sunat_note);
                Console.WriteLine("CODIGO RESPUESTA SUNAT: " + leer_respuesta.sunat_responsecode);
                Console.WriteLine("SUNAT ERROR SOAP: " + leer_respuesta.sunat_soap_error);
                Console.WriteLine("PDF EN BASE64: " + leer_respuesta.pdf_zip_base64);
                Console.WriteLine("XML EN BASE64: " + leer_respuesta.xml_zip_base64);
                Console.WriteLine("CDR EN BASE64: " + leer_respuesta.cdr_zip_base64);
                Console.WriteLine("CODIGO QR: " + leer_respuesta.cadena_para_codigo_qr);
                Console.WriteLine("CODIGO HASH: " + leer_respuesta.codigo_hash);
                Console.WriteLine("CODIGO DE BARRAS: " + leer_respuesta.codigo_de_barras);
                Console.ReadKey();
            }
            else
            {
                Console.WriteLine("ERRORES: " + leer_respuesta.errors);
                Console.ReadKey();
            }




        }




    }
}
