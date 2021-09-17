using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.NubeFact
{
    public class NubeFacT
    {
        /// # RUTA para enviar documentos
        //public   string ruta = "https://api.nubefact.com/api/v1/3efc12b7-fd39-4bca-93e1-48a14ba9c408";
        //public string ruta = "https://api.nubefact.com/api/v1/3d9b0493-c86c-4033-8f68-d618bdfe78c7";
        public string ruta = "https://www.pse.pe/api/v1/082a7bb9c5db4f58977a412c0fcc6210fdc543cae4d64ceeac435f501fa35b01";


        /// # TOKEN para enviar documentos
        //public   string token = "bf23de722ccf484e8aea527cba5c7a01db4955655a2c4e638fe1bf975c621261";
        //public string token = "70b349be42794ae5a50436337af7c72f81b58130dc444f4fb7a9e9db78b61169";
        public string token = "eyJhbGciOiJIUzI1NiJ9.IjgzM2JlMzQ0ZTM1MjQ1MDE4ZTc3Y2U1Mzg5MTg5Mjc4NWQ2NzZmNTc2NGU2NDI4OWI1MThhYWNhNWQwOTg1MGIi.iHTg6TDkWKGmSqyvoAlSpuikxansTX3ZvjgykPo2U0k";

        public string SendJson(string ruta, string json, string token)
        {
            try
            {
                using (var client = new WebClient())
                {
                    /// ESPECIFICAMOS EL TIPO DE DOCUMENTO EN EL ENCABEZADO
                    client.Headers[HttpRequestHeader.ContentType] = "application/json; charset=utf-8";
                    /// ASI COMO EL TOKEN UNICO
                    client.Headers[HttpRequestHeader.Authorization] = "Token token=" + token;
                    /// OBTENEMOS LA RESPUESTA
                    string respuesta = client.UploadString(ruta, "POST", json);
                    /// Y LA 'RETORNAMOS'
                    return respuesta;
                }
            }
            catch (WebException ex)
            {
                /// EN CASO EXISTA ALGUN ERROR, LO TOMAMOS
                var respuesta = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();
                /// Y LO 'RETORNAMOS'
                return respuesta;
            }
        }

    }
    
    /// CREAMOS LAS CLASES PARA CONSTRUIR EL JSON Y LEER LA RESPUESTA EN JSON
    public class Invoice
    {
        public string operacion { get; set; }
        public int tipo_de_comprobante { get; set; }
        public string serie { get; set; }
        public int numero { get; set; }
        public int sunat_transaction { get; set; }
        public int cliente_tipo_de_documento { get; set; }
        public string cliente_numero_de_documento { get; set; }
        public string cliente_denominacion { get; set; }
        public string cliente_direccion { get; set; }
        public string cliente_email { get; set; }
        public string cliente_email_1 { get; set; }
        public string cliente_email_2 { get; set; }
        public DateTime fecha_de_emision { get; set; }
        public DateTime fecha_de_vencimiento { get; set; }
        public int moneda { get; set; }
        public dynamic tipo_de_cambio { get; set; } //? MAKES NATURAL TYPES NULLABLE
        public double porcentaje_de_igv { get; set; }
        public dynamic descuento_global { get; set; }
        public dynamic total_descuento { get; set; }
        public dynamic total_anticipo { get; set; }
        public dynamic total_gravada { get; set; }
        public dynamic total_inafecta { get; set; }
        public dynamic total_exonerada { get; set; }
        public double total_igv { get; set; }
        public dynamic total_gratuita { get; set; }
        public dynamic total_otros_cargos { get; set; }
        public double total { get; set; }
        public dynamic percepcion_tipo { get; set; }
        public dynamic percepcion_base_imponible { get; set; }
        public dynamic total_percepcion { get; set; }
        public dynamic total_incluido_percepcion { get; set; }
        public bool detraccion { get; set; }
        public string observaciones { get; set; }
        public dynamic documento_que_se_modifica_tipo { get; set; }
        public string documento_que_se_modifica_serie { get; set; }
        public dynamic documento_que_se_modifica_numero { get; set; }
        public dynamic tipo_de_nota_de_credito { get; set; }
        public dynamic tipo_de_nota_de_debito { get; set; }
        public bool enviar_automaticamente_a_la_sunat { get; set; }
        public bool enviar_automaticamente_al_cliente { get; set; }
        public string codigo_unico { get; set; }
        public string condiciones_de_pago { get; set; }
        public string medio_de_pago { get; set; }
        public string placa_vehiculo { get; set; }
        public string orden_compra_servicio { get; set; }
        public string tabla_personalizada_codigo { get; set; }
        public string formato_de_pdf { get; set; }
        public List<Items> items { get; set; }
        public List<Guias> guias { get; set; }
    }

    public class Items
    {
        public string unidad_de_medida { get; set; }
        public string codigo { get; set; }
        public string descripcion { get; set; }
        public double cantidad { get; set; }
        public double valor_unitario { get; set; }
        public double precio_unitario { get; set; }
        public dynamic descuento { get; set; }
        public double subtotal { get; set; }
        public int tipo_de_igv { get; set; }
        public double igv { get; set; }
        public double total { get; set; }
        public bool anticipo_regularizacion { get; set; }
        public dynamic anticipo_comprobante_serie { get; set; }
        public dynamic anticipo_comprobante_numero { get; set; }
    }

    public class Guias
    {
        public int guia_tipo { get; set; }
        public string guia_serie_numero { get; set; }
    }

    public class Respuesta
    {
        public string errors { get; set; }
        public int tipo { get; set; }
        public string serie { get; set; }
        public int numero { get; set; }
        public string url { get; set; }
        public bool aceptada_por_sunat { get; set; }
        public string sunat_description { get; set; }
        public string sunat_note { get; set; }
        public string sunat_responsecode { get; set; }
        public string sunat_soap_error { get; set; }
        public string pdf_zip_base64 { get; set; }
        public string xml_zip_base64 { get; set; }
        public string cdr_zip_base64 { get; set; }
        public string cadena_para_codigo_qr { get; set; }
        public string codigo_hash { get; set; }
        public string codigo_de_barras { get; set; }
    }
       
    public class Guide
    {
        public string operacion { get; set; }
        public int tipo_de_comprobante { get; set; }
        public string serie { get; set; }
        public int numero { get; set; }
        public int cliente_tipo_de_documento { get; set; }
        public string cliente_numero_de_documento { get; set; }
        public string cliente_denominacion { get; set; }
        public string cliente_direccion { get; set; }
        public string cliente_email { get; set; }
        public string cliente_email_1 { get; set; }
        public string cliente_email_2 { get; set; }

        public DateTime fecha_de_emision { get; set; }
        public string observaciones { get; set; }
        public string motivo_de_traslado { get; set; }

        public decimal peso_bruto_total { get; set; }
        public int numero_de_bultos { get; set; }
        public string tipo_de_transporte { get; set; }
        public DateTime fecha_de_inicio_de_traslado { get; set; }
        public int transportista_documento_tipo { get; set; }
        public string transportista_documento_numero { get; set; }
        public string transportista_denominacion { get; set; }
        public string transportista_placa_numero { get; set; }
        public int conductor_documento_tipo { get; set; }

        public string conductor_documento_numero { get; set; }
        public string conductor_denominacion { get; set; }
        public string punto_de_partida_ubigeo { get; set; }
        public string punto_de_partida_direccion { get; set; }
        public string punto_de_llegada_ubigeo { get; set; }
        public string punto_de_llegada_direccion { get; set; }
        public bool enviar_automaticamente_a_la_sunat { get; set; }
        public bool enviar_automaticamente_al_cliente { get; set; }
        public string codigo_unico { get; set; }
        public string formato_de_pdf { get; set; }
               
        public List<ItemsGuide> items { get; set; }
    }

    public class ItemsGuide
    {
        public string unidad_de_medida { get; set; }
        public string codigo { get; set; }
        public string descripcion { get; set; }
        public double cantidad { get; set; }
    }

    public class RespuestaGuide
    {
        public string errors { get; set; }
        public int tipo_de_comprobante { get; set; }
        public string serie { get; set; }
        public int numero { get; set; }

        public string enlace { get; set; }
        public bool aceptada_por_sunat { get; set; }
        public string sunat_description { get; set; }
        public string sunat_note { get; set; }

        public string sunat_responsecode { get; set; }
        public string sunat_soap_error { get; set; }

        public string pdf_zip_base64 { get; set; }
        public string xml_zip_base64 { get; set; }
        public string cdr_zip_base64 { get; set; }

        public string enlace_del_pdf { get; set; }
        public string enlace_del_xml { get; set; }
        public string enlace_del_cdr { get; set; }
    }


    public class Consultation
    {
        public string operacion { get; set; }
        public int tipo_de_comprobante { get; set; }
        public string serie { get; set; }
        public string numero { get; set; }
       
    }


}
