using Entidades.Facturacion.Procesos;
using Negocio.Conexion;
using Negocio.Facturacion.Procesos;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using ThoughtWorks.QRCode.Codec;

namespace WebApi_Ventas.Controllers.Facturacion.Procesos.Comprobantes_Electronicos
{
    [EnableCors("*", "*", "*")]
    public class Comprobantes_ElectronicosController : ApiController
    {

        /// # RUTA para enviar documentos
        public const string ruta = "https://api.nubefact.com/api/v1/3d9b0493-c86c-4033-8f68-d618bdfe78c7";

        /// # TOKEN para enviar documentos
        public const string token = "70b349be42794ae5a50436337af7c72f81b58130dc444f4fb7a9e9db78b61169";
        

        public string PostGenerar_archivo_json(int TipoDoc, string nroDocumento, int idcab) {
            string resultado = "";
            string rutaQR = "";
            int id_factura = 0;

            try
            {
                Invoice_BL invoice = new Invoice_BL();
                List<Items_E> list_Detalle = new List<Items_E>();
                Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                DataTable dt_comprobantes =new DataTable();

                if (TipoDoc == 1 || TipoDoc == 2)
                {
                    dt_comprobantes = obj_negocio.get_Documentos_Electronicos_individual_new(TipoDoc, nroDocumento);
                }
                else {
                    dt_comprobantes = obj_negocio.get_Documentos_Electronicos_notas_individual_new(TipoDoc, nroDocumento, idcab);
                }
      

                int idCabecera = 0;
                foreach (DataRow row in dt_comprobantes.Rows)
                {
                    if (idCabecera != Convert.ToInt32(row["id_Factura_Cab"])) {

                        rutaQR = System.Web.Hosting.HostingEnvironment.MapPath("~/FACT_ELECT_QR/" + Convert.ToInt32(row["id_Factura_Cab"]));
                        id_factura = Convert.ToInt32(row["id_Factura_Cab"]);

                        ///CREAMOS EL JSON
                        invoice.operacion = "generar_comprobante";
                        invoice.tipo_de_comprobante = Convert.ToInt32(row["tipo_de_comprobante"].ToString());
                        invoice.serie = row["serie"].ToString();
                        invoice.numero = Convert.ToInt32(row["numero"].ToString());
                        invoice.sunat_transaction = Convert.ToInt32(row["sunat_transaction"].ToString());
                        invoice.cliente_tipo_de_documento = Convert.ToInt32(row["cliente_tipo_de_documento"].ToString());
                        invoice.cliente_numero_de_documento = row["cliente_numero_de_documento"].ToString();
                        invoice.cliente_denominacion = row["cliente_denominacion"].ToString();

                        invoice.cliente_direccion = row["cliente_direccion"].ToString();
                        invoice.cliente_email = row["cliente_email"].ToString();
                        invoice.cliente_email_1 = row["cliente_email_1"].ToString();
                        invoice.cliente_email_2 = row["cliente_email_2"].ToString();
                        invoice.fecha_de_emision = row["fecha_de_emision"].ToString();
                        invoice.fecha_de_vencimiento = row["fecha_de_vencimiento"].ToString();

                        invoice.moneda = Convert.ToInt32(row["moneda"].ToString());
                        invoice.tipo_de_cambio = row["tipo_de_cambio"].ToString();
                        invoice.porcentaje_de_igv = Convert.ToDouble(row["porcentaje_de_igv"].ToString());
                        invoice.descuento_global = row["descuento_global"].ToString();
                        invoice.total_descuento = row["total_descuento"].ToString();
                        invoice.total_anticipo = row["total_anticipo"].ToString();
                        invoice.total_gravada = row["total_gravada"].ToString();
                        invoice.total_inafecta = row["total_inafecta"].ToString();
                   
                        invoice.total_exonerada = row["total_exonerada"].ToString();
                        invoice.total_igv = Convert.ToDouble( row["total_igv"].ToString());
                        invoice.total_gratuita = row["total_gratuita"].ToString();
                        invoice.total_otros_cargos = row["total_otros_cargos"].ToString();
                        invoice.total = Convert.ToDouble(row["total"].ToString());
                        invoice.percepcion_tipo = row["percepcion_tipo"].ToString();
                        invoice.percepcion_base_imponible = row["percepcion_base_imponible"].ToString();
                        invoice.total_percepcion = row["total_percepcion"].ToString();
                        invoice.detraccion = row["detraccion"].ToString();

                        invoice.observaciones = row["observaciones"].ToString();
                        invoice.documento_que_se_modifica_tipo =  row["documento_que_se_modifica_tipo"].ToString();
                        invoice.documento_que_se_modifica_serie = row["documento_que_se_modifica_serie"].ToString();
                        invoice.documento_que_se_modifica_numero = row["documento_que_se_modifica_numero"].ToString();
                        invoice.tipo_de_nota_de_credito = row["tipo_de_nota_de_credito"].ToString();
                        invoice.tipo_de_nota_de_debito = row["tipo_de_nota_de_debito"].ToString();
                        invoice.enviar_automaticamente_a_la_sunat = row["enviar_automaticamente_a_la_sunat"].ToString();
                        invoice.enviar_automaticamente_al_cliente = row["enviar_automaticamente_al_cliente"].ToString();

                        invoice.codigo_unico = row["codigo_unico"].ToString();
                        invoice.condiciones_de_pago = row["condiciones_de_pago"].ToString();
                        invoice.medio_de_pago = row["medio_de_pago"].ToString();
                        invoice.placa_vehiculo = row["placa_vehiculo"].ToString();
                        invoice.orden_compra_servicio = row["orden_compra_servicio"].ToString();
                        invoice.tabla_personalizada_codigo = row["tabla_personalizada_codigo"].ToString();
                        invoice.formato_de_pdf = "";

                        idCabecera = Convert.ToInt32(row["id_Factura_Cab"]);
              
                        foreach (DataRow fila in dt_comprobantes.Rows)
                        {
                            Items_E obj_entidad = new Items_E();            

                            if (idCabecera == Convert.ToInt32(row["id_Factura_Cab"])) {                        
                                obj_entidad.unidad_de_medida = fila["unidad_de_medida"].ToString();
                                obj_entidad.codigo = fila["codigo"].ToString();
                                obj_entidad.descripcion = fila["descripcion"].ToString();
                                obj_entidad.cantidad = Convert.ToDouble(fila["cantidad"].ToString());
                                obj_entidad.valor_unitario = Convert.ToDouble(fila["valor_unitario"].ToString());
                                obj_entidad.precio_unitario = Convert.ToDouble(fila["precio_unitario"].ToString());

                                obj_entidad.descuento = fila["descuento"].ToString();
                                obj_entidad.subtotal = Convert.ToDouble(fila["subtotal"].ToString());
                                obj_entidad.tipo_de_igv = Convert.ToInt32(fila["tipo_de_igv"].ToString());
                                obj_entidad.igv = Convert.ToDouble(fila["igv"].ToString());
                                obj_entidad.total = Convert.ToDouble(fila["total_det"].ToString());

                                obj_entidad.anticipo_regularizacion = fila["anticipo_regularizacion"].ToString();
                                obj_entidad.anticipo_comprobante_serie = fila["anticipo_comprobante_serie"].ToString();
                                obj_entidad.anticipo_comprobante_numero = fila["anticipo_comprobante_numero"].ToString();

                                list_Detalle.Add(obj_entidad);
                            }
                        }
                        invoice.items = list_Detalle;          
                    }
                }
                                                
                ///----generado el json-----
                string json = JsonConvert.SerializeObject(invoice, Formatting.Indented); 
                byte[] bytes = Encoding.Default.GetBytes(json);
                string json_en_utf_8 = Encoding.UTF8.GetString(bytes);

                //------ enviando el json a NubeFact               
                string json_de_respuesta = SendJson(ruta, json_en_utf_8, token);
                dynamic r = JsonConvert.DeserializeObject<Respuesta_E>(json_de_respuesta);
                string r2 = JsonConvert.SerializeObject(r, Formatting.Indented);
                dynamic json_r_in = JsonConvert.DeserializeObject<Respuesta_E>(r2);

                dynamic leer_respuesta = JsonConvert.DeserializeObject<Respuesta_E>(json_de_respuesta);
                if (leer_respuesta.errors == null)
                {
                    //Console.WriteLine(json_r_in);
                    //Console.WriteLine();
                    //Console.WriteLine();
                    //Console.WriteLine("TIPO: " + leer_respuesta.tipo);
                    //Console.WriteLine("SERIE: " + leer_respuesta.serie);
                    //Console.WriteLine("NUMERO: " + leer_respuesta.numero);
                    //Console.WriteLine("URL: " + leer_respuesta.url);
                    //Console.WriteLine("ACEPTADA_POR_SUNAT: " + leer_respuesta.aceptada_por_sunat);
                    //Console.WriteLine("DESCRIPCION SUNAT: " + leer_respuesta.sunat_description);
                    //Console.WriteLine("NOTA SUNAT: " + leer_respuesta.sunat_note);
                    //Console.WriteLine("CODIGO RESPUESTA SUNAT: " + leer_respuesta.sunat_responsecode);
                    //Console.WriteLine("SUNAT ERROR SOAP: " + leer_respuesta.sunat_soap_error);
                    //Console.WriteLine("PDF EN BASE64: " + leer_respuesta.pdf_zip_base64);
                    //Console.WriteLine("XML EN BASE64: " + leer_respuesta.xml_zip_base64);
                    //Console.WriteLine("CDR EN BASE64: " + leer_respuesta.cdr_zip_base64);
                    //Console.WriteLine("CODIGO QR: " + leer_respuesta.cadena_para_codigo_qr);
                    //Console.WriteLine("CODIGO HASH: " + leer_respuesta.codigo_hash);
                    //Console.WriteLine("CODIGO DE BARRAS: " + leer_respuesta.codigo_de_barras);
                    //Console.ReadKey();

                    ////----creando el Codigo QR
                    byte[] obj_codQR = GeneraCodigoQR(leer_respuesta.cadena_para_codigo_qr);
                    using (FileStream Writer = new System.IO.FileStream(rutaQR + ".gif", FileMode.Create, FileAccess.Write))
                    {
                        Writer.Write(obj_codQR, 0, obj_codQR.Length);
                    }
                    resultado = Set_actualizando_Facturacion_Electronica(id_factura, 2, TipoDoc + "_"+ nroDocumento + ".xml", id_factura + ".gif");     
                }
                else
                {
                    resultado = Set_Log_Alertas(id_factura, leer_respuesta.errors.Replace("\n", string.Empty));
 
               }
            }
            catch (Exception ex)
            {
                resultado = ex.Message;
            }
            return resultado;
        }


        public byte[] GeneraCodigoQR(string TextoCodificar)
        {
            //Instancia del objeto encargado de codificar el codigo QR
            QRCodeEncoder CodigoQR = new QRCodeEncoder();

            CodigoQR.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.BYTE;
            CodigoQR.QRCodeScale = 4;
            CodigoQR.QRCodeErrorCorrect = ThoughtWorks.QRCode.Codec.QRCodeEncoder.ERROR_CORRECTION.M;
            CodigoQR.QRCodeVersion = 0;
            CodigoQR.QRCodeBackgroundColor = System.Drawing.Color.White;
            CodigoQR.QRCodeForegroundColor = System.Drawing.Color.Black;

            //Se retorna el Codigo QR codificado en formato de arreglo de bytes.
            return imageToByteArray(CodigoQR.Encode(TextoCodificar, System.Text.Encoding.UTF8));
        }

        public byte[] imageToByteArray(System.Drawing.Image imageIn)
        {
            System.IO.MemoryStream ms = new System.IO.MemoryStream();
            imageIn.Save(ms, System.Drawing.Imaging.ImageFormat.Gif);
            return ms.ToArray();
        }

        static string SendJson(string ruta, string json, string token)
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

        public string Set_actualizando_Facturacion_Electronica(int id_cabecera, int id_tipo, string nombreArchivo, string nombreArchivo2)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_FACTURACION_ELECTRONICA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_cabecera", SqlDbType.Int).Value = id_cabecera;
                        cmd.Parameters.Add("@id_tipo", SqlDbType.Int).Value = id_tipo;
                        cmd.Parameters.Add("@nombreArchivo", SqlDbType.VarChar).Value = nombreArchivo;
                        cmd.Parameters.Add("@nombreArchivo_2", SqlDbType.VarChar).Value = nombreArchivo2;
                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }

        public string Set_Log_Alertas(int id_cabecera, string mensaje_error)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_FACTURACION_ELECTRONICA_LOG_ERROR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_cabecera", SqlDbType.Int).Value = id_cabecera;
                        cmd.Parameters.Add("@mensaje", SqlDbType.VarChar).Value = mensaje_error;

                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }


    }
}
