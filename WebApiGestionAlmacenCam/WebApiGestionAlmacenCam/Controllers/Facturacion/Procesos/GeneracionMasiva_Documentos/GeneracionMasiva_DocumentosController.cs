using Entidades;
using Negocio.Conexion;
using Negocio.Facturacion.Procesos;
using Newtonsoft.Json;
using RestSharp;
using RestSharp.Authenticators;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Xml;
using ThoughtWorks.QRCode.Codec;

namespace WebApi_Ventas.Controllers.Facturacion.Procesos.GeneracionMasiva_Documentos
{
     [EnableCors("*", "*", "*")]
    public class GeneracionMasiva_DocumentosController : ApiController
    {
         private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();
         string rutaPDF, rutaCDR, rutaXML, rutaQR;
        //private Config config;

        public object GetReporteResumenVentaTotal(int opcion, string filtro)
        {
            //filtro puede tomar cualquier valor
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    int id_puntoVenta = Convert.ToInt32(parametros[0].ToString());
                    int id_estado = Convert.ToInt32(parametros[1].ToString());
                    int id_vendedor = Convert.ToInt32(parametros[2].ToString());
                    int id_tipoDocumentos = Convert.ToInt32(parametros[3].ToString());
                    string fecha = parametros[4].ToString();

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.Exportar_packing(id_puntoVenta, id_estado, id_vendedor, id_tipoDocumentos, fecha);

                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');

                    int id_puntoVenta = Convert.ToInt32(parametros[0].ToString());
                    int id_estado = Convert.ToInt32(parametros[1].ToString());
                    int id_vendedor = Convert.ToInt32(parametros[2].ToString());
                    int id_tipoDocumentos = Convert.ToInt32(parametros[3].ToString());
                    string fecha = parametros[4].ToString();

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.getDataGenerarDocumento(id_vendedor, id_puntoVenta, fecha);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');

                    int id_puntoVenta = Convert.ToInt32(parametros[0].ToString());
                    int id_estado = Convert.ToInt32(parametros[1].ToString());
                    int id_vendedor = Convert.ToInt32(parametros[2].ToString());
                    int id_tipoDocumentos = Convert.ToInt32(parametros[3].ToString());
                    string fecha = parametros[4].ToString();

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.getDocumentoImprimir(id_puntoVenta, id_vendedor, id_tipoDocumentos, fecha);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');

                    int id_puntoVenta = Convert.ToInt32(parametros[0].ToString());
                    int id_vendedor = Convert.ToInt32(parametros[1].ToString()); ;
                    string fecha = parametros[2].ToString();
                    string fecha_Factura = parametros[3].ToString();
                    int usuario = Convert.ToInt32(parametros[4].ToString());
                    int id_tipoDoc = Convert.ToInt32(parametros[5].ToString());
                    string serieDoc = parametros[6].ToString();
                    int cantidadDoc = Convert.ToInt32(parametros[7].ToString());
                    int correlativo_ini = Convert.ToInt32(parametros[8].ToString());


                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.Set_GenerarDocumentos_Venta(id_puntoVenta, id_vendedor, fecha, fecha_Factura, usuario, id_tipoDoc, serieDoc, cantidadDoc, correlativo_ini);
                }
                else if (opcion == 5) //----IMPRIMIR INDIVIDUAL
                {
                    string[] parametros = filtro.Split('|');
                    string nroDocumento = parametros[0].ToString();
                    int TipoDoc = Convert.ToInt32(parametros[1].ToString());

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.getDocumentoImprimir_individual(nroDocumento, TipoDoc);
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_vendedor = Convert.ToInt32(parametros[2].ToString());
                    string fecha = parametros[3].ToString();
                    int id_TipoDocumento = Convert.ToInt32(parametros[4].ToString());

                    int id_Anexos = Convert.ToInt32(parametros[5].ToString());
                    int id_transportista = Convert.ToInt32(parametros[6].ToString());


                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.getData_Pedidos_Cab(id_local, id_almacen, id_vendedor, fecha, id_TipoDocumento, id_Anexos, id_transportista);
                }

                else if (opcion == 7)
                {
                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.getData_Pedidos_Det(filtro);
                }

                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');

                    int id_pedidoDet = Convert.ToInt32(parametros[0].ToString());
                    decimal precio = Convert.ToDecimal(parametros[1].ToString());
                    string id_Pedido_Cab = parametros[2].ToString();

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.Set_Actualizando_Pedido(id_pedidoDet, precio, id_Pedido_Cab);
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');

                    string opcionSelec = parametros[0].ToString();
                    string Numero_Pedido = parametros[1].ToString();

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.Set_Pedido_Flag_GeneraGuia(opcionSelec, Numero_Pedido);
                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');

                    string opcionSelec = parametros[0].ToString();
                    string Numero_Pedido = parametros[1].ToString();

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.Set_Pedido_Flag_ImprimePedido(opcionSelec, Numero_Pedido);
                }
                else if (opcion == 11) //---IMPRIMIR MASIVO
                {
                    string[] parametros = filtro.Split('|');

                    int id_usuario = Convert.ToInt32(parametros[0].ToString());
                    int id_tipoDocumentos = Convert.ToInt32(parametros[1].ToString());

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.getDocumentoImprimir_Masivo(id_usuario, id_tipoDocumentos);
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');
                    int TipoDoc = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.get_Documentos_Electronicos(TipoDoc, idUsuario);
                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');
                    int TipoDoc = Convert.ToInt32(parametros[0].ToString());
                    string nroDocumento = parametros[1].ToString();

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.get_Documentos_Electronicos_individual(TipoDoc, nroDocumento);
                }
                else if (opcion == 14)
                {
                    string[] parametros = filtro.Split('|');
                    int TipoDoc = Convert.ToInt32(parametros[0].ToString());
                    string nroDocumento = parametros[1].ToString();

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.get_Documentos_Electronicos_individual_anulacion(TipoDoc, nroDocumento);
                }
                else if (opcion == 15) //----IMPRIMIR INDIVIDUAL NOTA DE CREDITO FACTURA
                {
                    string[] parametros = filtro.Split('|');
                    string nroDocumento = parametros[0].ToString();
                    int TipoDoc = Convert.ToInt32(parametros[1].ToString());
                    int idfactura = Convert.ToInt32(parametros[2].ToString());

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.getDocumentoImprimir_individual_notas_facturas(nroDocumento, TipoDoc, idfactura);
                }
                else if (opcion == 16)
                {
                    string[] parametros = filtro.Split('|');
                    int TipoDoc = Convert.ToInt32(parametros[0].ToString());
                    string nroDocumento = parametros[1].ToString();
                    int id_cab_referencia = Convert.ToInt32(parametros[2].ToString());

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.get_Documentos_Electronicos_individual_notas(TipoDoc, nroDocumento, id_cab_referencia);
                }
                else if (opcion == 17)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_vendedor = Convert.ToInt32(parametros[2].ToString());
                    string fecha = parametros[3].ToString();

                    int id_Anexos = Convert.ToInt32(parametros[4].ToString());
                    int id_CanalNegocio = Convert.ToInt32(parametros[5].ToString());

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.get_pedidos_movil(id_local, id_almacen, id_vendedor, fecha, id_Anexos, id_CanalNegocio);
                }
                else if (opcion == 18)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_vendedor = Convert.ToInt32(parametros[2].ToString());
                    string fecha = parametros[3].ToString();
                    int id_TipoDocumento = Convert.ToInt32(parametros[4].ToString());
                    int usuario = Convert.ToInt32(parametros[5].ToString());
                    string fecha_Factura = parametros[6].ToString();
                    string numero_documento = parametros[7].ToString();
                    string numero_pedido = parametros[8].ToString();

                    int id_Anexos = Convert.ToInt32(parametros[9].ToString());
                    int id_transportista = Convert.ToInt32(parametros[10].ToString());
                    
                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.Set_GenerarDocumentos_Venta_II(id_local, id_almacen, id_vendedor, fecha, id_TipoDocumento, usuario, fecha_Factura, numero_documento, numero_pedido, id_Anexos, id_transportista);
                }
                else if (opcion == 19) //---IMPRESION MASIVAS DE DOCUMENTOS
                {
                    string[] parametros = filtro.Split('|');

                    int id_usuario = Convert.ToInt32(parametros[0].ToString());
                    int id_tipoDocumentos = Convert.ToInt32(parametros[1].ToString());

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.getDocumentoImprimir_Masivo_II(id_usuario, id_tipoDocumentos);
                }
                else if (opcion == 20)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.get_facturas_Generadas_Masivos(idUsuario);
                }
                else if (opcion == 21) //---IMPRESION INDIVIDUAL DE DOCUMENTOS
                {
                    string[] parametros = filtro.Split('|');
                    string nroDocumento = parametros[0].ToString();
                    int TipoDoc = Convert.ToInt32(parametros[1].ToString());

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.getDocumentoImprimir_Individual_II(nroDocumento, TipoDoc);
                }
                else if (opcion == 22)
                {
                    string[] parametros = filtro.Split('|');
                    int idusuario = Convert.ToInt32(parametros[0].ToString());

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.get_zonasUsuario(idusuario);

                }
                else if (opcion == 23) //---  IMPRESION INDIVIDUAL  DE GUIA DE REMISION
                {
                    string[] parametros = filtro.Split('|');
                    string nroDocumento = parametros[0].ToString();
                    int TipoDoc = Convert.ToInt32(parametros[1].ToString());

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.getDocumentoImprimir_guiaRemision_sunat(nroDocumento, TipoDoc);
                }
                else if (opcion == 24) //---  IMPRESION INDIVIDUAL  DE GUIA DE REMISION OTROS MODULOS
                {
                    string[] parametros = filtro.Split('|');
                    int idGuia = Convert.ToInt32(parametros[0].ToString());

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.getDocumentoImprimir_otrosModulos_guiaRemision_sunat(idGuia);
                }
                else if (opcion == 25)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_vendedor = Convert.ToInt32(parametros[2].ToString());
                    string fecha = parametros[3].ToString();
                    int id_TipoDocumento = Convert.ToInt32(parametros[4].ToString());
                    int usuario = Convert.ToInt32(parametros[5].ToString());
                    string fecha_Factura = parametros[6].ToString();
                    string numero_documento = parametros[7].ToString();
                    string numero_pedido = parametros[8].ToString();

                    int id_Anexos = Convert.ToInt32(parametros[9].ToString());
                    int id_transportista = Convert.ToInt32(parametros[10].ToString());
                    int flagEnviarSunat = Convert.ToInt32(parametros[11].ToString());

                    Documentos_Masivos_BL obj_negocio = new Documentos_Masivos_BL();
                    resul = obj_negocio.Set_GenerarDocumentos_Venta_III(id_local, id_almacen, id_vendedor, fecha, id_TipoDocumento, usuario, fecha_Factura, numero_documento, numero_pedido, id_Anexos, id_transportista, flagEnviarSunat);
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

         public string get_DigestValues(string nombreDocumento)
         {
             var valor = "";
             string path = "";     
             XmlDocument xDoc = new XmlDocument();
             
             path = System.Web.Hosting.HostingEnvironment.MapPath("~/FACT_ELECT_XML/" + nombreDocumento + ".xml");

             xDoc.Load(path);
             XmlNodeList Digest = xDoc.GetElementsByTagName("ds:SignedInfo");
             XmlNodeList lista = ((XmlElement)Digest[0]).GetElementsByTagName("ds:DigestValue");

            foreach (XmlElement nodo in lista)
            {
                valor = nodo.InnerText;
            }

            return valor;
         }

         public string get_SignatureValue(string nombreDocumento)
         {
    
             var valor = "";
             string path = "";
             XmlDocument xDoc = new XmlDocument();

             path = System.Web.Hosting.HostingEnvironment.MapPath("~/FACT_ELECT_XML/" + nombreDocumento + ".xml");

             xDoc.Load(path);
             XmlNodeList Signature = xDoc.GetElementsByTagName("ds:SignatureValue");

             foreach (XmlElement nodo in Signature)
             {
                 valor = nodo.InnerText;
             }

             return valor;
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

         public DataTable get_Datos_CodigoHash(int id_cabecera)
         {
             DataTable dt_detalle = new DataTable();
             try
             {
                 using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                 {
                     cn.Open();
                     using (SqlCommand cmd = new SqlCommand("SP_S_FACTURACION_ELECTRONICA_CODIGO_HASH", cn))
                     {
                         cmd.CommandTimeout = 0;
                         cmd.CommandType = CommandType.StoredProcedure;
                         cmd.Parameters.Add("@id_cab", SqlDbType.Int).Value = id_cabecera;
                         
                         using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                         {
                             da.Fill(dt_detalle);
                         }
                     }
                 }
             }
             catch (Exception )
             {
                 throw;
             }
             return dt_detalle;
         }

        public string PostGenerar_archivo_json(object estructura_json, string nombreArchivo, int idCab, int flagAnulacion)
        {
            string path = "";
            string resultado = "";
            try
            {
                //-----guardando el documento en json en el servidor------
                path = System.Web.Hosting.HostingEnvironment.MapPath("~/Formatos_Json/" + nombreArchivo);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos_json"];

                if (File.Exists(path))
                {
                    File.Delete(path);
                    using (var tw = new StreamWriter(path, true))
                    {
                        tw.WriteLine(estructura_json.ToString());
                        tw.Close();
                    }
                }
                else
                {
                    using (var tw = new StreamWriter(path, true))
                    {
                        tw.WriteLine(estructura_json.ToString());
                        tw.Close();
                    }
                }

                //return resultado = "OK";

                //----- Fin  de guardando el documento en json en el servidor------

                //---- ------------------Obtener el token necesario para los demás métodos -----------------------------------------
                var responseToken = ObtenerToken_Async();

                var contentToken = responseToken.Result.Content; // raw content as string 
                dynamic jsonObj = JsonConvert.DeserializeObject(contentToken);
                var acceso_token = jsonObj["access_token"].ToString();

                //---- ------	Fin de Obtener el token necesario para los demás métodos -----------------------------------------

                //---------- Método para envíar documento y obtener el ticket ------------------------------------
                var httpResponse_ticket = ObtenerTicket_Async(acceso_token, path);

                string json = httpResponse_ticket.Result.Content.ToString();
                dynamic json_ticket = JsonConvert.DeserializeObject(json);

                var estado_tiket = json_ticket["code"].ToString();
                var description_tiket = json_ticket["description"].ToString();

                resultado = "description_tiket : " + description_tiket;

                //------- Fin de Método para envíar documento y obtener el ticket --------------------------                 
                if (httpResponse_ticket.Result.StatusCode.Equals(System.Net.HttpStatusCode.OK))
                {
                    //------suspendemos el hilo, y esperamos ..
                    System.Threading.Thread.Sleep(2000);

                    resultado = "System.Net.HttpStatusCode.OK";
                    // ///----------------------------------- Método para obtener el PDF ----------------------------------------
                    //generarPDF(nombreArchivo, acceso_token, description_tiket, idCab);
                    /////------------------- Fin de  Método para obtener el PDF -------------------------------------------------

                    if (flagAnulacion == 1)
                    {
                        ///------------------- Método para obtener el CDR ---------------------------------------------------------
                        resultado = generarCDR(nombreArchivo, acceso_token, description_tiket, idCab, 1);
                        ///------------------- Fin de  Método para obtener el CDR -------------------------------------------------   
                    }
                    else
                    {
                        ///------------------- Método para obtener el xml ---------------------------------------------------------
                        resultado = generarXML(nombreArchivo, acceso_token, description_tiket, idCab);
                        ///------------------- Fin de  Método para obtener el xml -------------------------------------------------

                        ///------------------- Método para obtener el CDR ---------------------------------------------------------
                        resultado = generarCDR(nombreArchivo, acceso_token, description_tiket, idCab, flagAnulacion);
                        ///------------------- Fin de  Método para obtener el CDR -------------------------------------------------   
                    }

                }
                else {
                    Set_Log_Alertas(idCab, resultado);
                }
            }
            catch (Exception ex)
            {
                resultado = ex.Message;
            }
            return resultado;
        }

        private async Task<IRestResponse> ObtenerToken_Async()
         {

            ////var client_Token = new RestClient("https://ose-gw1.efact.pe:443/api-efact-ose/oauth/token"); ---pruebas
            var client_Token = new RestClient("https://ose.efact.pe/api-efact-ose/oauth/token");
 
            client_Token.Authenticator = new HttpBasicAuthenticator("client", "secret");

             var request_token = new RestRequest(Method.POST);
             request_token.AddParameter("username", "20601832616");
            //request_token.AddParameter("password", "4412159425ab9ab85f345e898ed26692acfe145335faafcbe14f047b80962bc8");
            request_token.AddParameter("password", "30dc9610b9f34009f7878d3a9de08b9af1fd8fbba770f0dcae7809d64ae6a8b3");
            request_token.AddParameter("grant_type", "password");

             request_token.AddUrlSegment("client", "secret");
             request_token.AddHeader("Content-Type", "application/x-www-form-urlencoded");
             
             Task<IRestResponse> responseToken = client_Token.ExecuteTaskAsync(request_token);
             responseToken.Wait();

             var restResponse = await responseToken;

             return restResponse;

         }
         
         private async Task<IRestResponse> ObtenerTicket_Async(string acceso_token, string path)
         {

                                                 
            ////var client_ticket = new RestClient("https://ose-gw1.efact.pe:443/api-efact-ose/v1/document");  --pruebas
            var client_ticket = new RestClient("https://ose.efact.pe/api-efact-ose/v1/document");

            var request_ticket = new RestRequest(Method.POST)
                     .AddHeader("Accept", "application/json")
                     .AddHeader("Authorization", "Bearer " + acceso_token)
                     .AddHeader("Content-Type", "multipart/form-data");
             request_ticket.AddFile("file", path);

             Task<IRestResponse> httpResponse_ticket = client_ticket.ExecuteTaskAsync(request_ticket);
             httpResponse_ticket.Wait();

             var restResponse = await httpResponse_ticket; 

             return restResponse;
 
         }
         
         private async Task<IRestResponse> ObtenerPDF_Async(string acceso_token, string description_tiket)
         {
            //var clientPDF = new RestClient("https://ose-gw1.efact.pe:443/api-efact-ose/v1/pdf/" + description_tiket);
            var clientPDF = new RestClient("https://ose.efact.pe/api-efact-ose/v1/pdf/" + description_tiket);
            var requestPDF = new RestRequest(Method.GET)
                .AddHeader("Accept", "application/json")
                .AddHeader("Authorization", "Bearer " + acceso_token);

             Task<IRestResponse> httpResPDF = clientPDF.ExecuteTaskAsync(requestPDF);
             httpResPDF.Wait();

             var restResponse = await httpResPDF;

             return restResponse;

         }
                           
         private bool generarPDF(string nombreDocumento, string acceso_token, string description_tiket, int idCab)
         {
             string[] nroDoc = nombreDocumento.Split('.');
             rutaPDF = "";
             rutaPDF = System.Web.Hosting.HostingEnvironment.MapPath("~/FACT_ELECT_PDF/" + nroDoc[0]);

             try
             {
                //var httpResPDF = ObtenerPDF_Async(acceso_token, description_tiket);

                //var clientPDF = new RestClient("https://ose-gw1.efact.pe:443/api-efact-ose/v1/pdf/" + description_tiket);
                var clientPDF = new RestClient("https://ose.efact.pe/api-efact-ose/v1/pdf/" + description_tiket);
                 var requestPDF = new RestRequest(Method.GET)
                    .AddHeader("Accept", "application/json")
                    .AddHeader("Authorization", "Bearer " + acceso_token);

                 var httpResPDF = clientPDF.Execute(requestPDF);
                 
                 //------suspendemos el hilo, y esperamos ..
                 System.Threading.Thread.Sleep(1500);

                 if (httpResPDF.StatusCode.Equals(System.Net.HttpStatusCode.OK))
                 {
                     byte[] response_pdf = clientPDF.DownloadData(requestPDF);
                     using (FileStream Writer = new System.IO.FileStream(rutaPDF + ".pdf", FileMode.Create, FileAccess.Write))
                     {
                         Writer.Write(response_pdf, 0, response_pdf.Length);
                     }
                     Set_actualizando_Facturacion_Electronica(idCab, 3, nroDoc[0] + ".pdf", "");
                 }                 
                 return true;
             }
             catch (Exception)
             {
                return false;
             }
         }
         
         private string generarXML(string nombreDocumento, string acceso_token, string description_tiket, int idCab)
         {
             var res = "";

             string[] nroDoc = nombreDocumento.Split('.');
             rutaXML = "";
             rutaQR = "";

             rutaXML = System.Web.Hosting.HostingEnvironment.MapPath("~/FACT_ELECT_XML/" + nroDoc[0]);
             rutaQR = System.Web.Hosting.HostingEnvironment.MapPath("~/FACT_ELECT_QR/" + idCab);

             try
             {
                ////var clientXML = new RestClient("https://ose-gw1.efact.pe:443/api-efact-ose/v1/xml/" + description_tiket);
                var clientXML = new RestClient("https://ose.efact.pe/api-efact-ose/v1/xml/" + description_tiket);

                 var requestXML = new RestRequest(Method.GET)
                         .AddHeader("Accept", "application/json")
                         .AddHeader("Authorization", "Bearer " + acceso_token);
                 var httpResXML = clientXML.Execute(requestXML);
                                                         
                    if (httpResXML.StatusCode.Equals(System.Net.HttpStatusCode.OK))
                    {
                        res = "System.Net.HttpStatusCode.OK";
                        System.Threading.Thread.Sleep(2000);

                        byte[] response_XML = clientXML.DownloadData(requestXML);

                        using (FileStream Writer = new System.IO.FileStream(rutaXML + ".xml", FileMode.Create, FileAccess.Write))
                        {
                            Writer.Write(response_XML, 0, response_XML.Length);
                        }

                        ///------GENERANDO EL CODIGO QR------

                        var Codigo_Has = "";

                        DataTable dt_factura = new DataTable();
                        dt_factura = get_Datos_CodigoHash(idCab);

                        Codigo_Has = "20601832616|" + dt_factura.Rows[0]["tipo_documento"].ToString() + "|" + dt_factura.Rows[0]["serie"].ToString() + "|" + dt_factura.Rows[0]["numero_documento"].ToString() + "|";
                        Codigo_Has = Codigo_Has + dt_factura.Rows[0]["total_igv"].ToString() + "|" + dt_factura.Rows[0]["total"].ToString() + "|" + dt_factura.Rows[0]["fecha_emision"].ToString() + "|" + dt_factura.Rows[0]["tipo_documento_receptor"].ToString() + "|" + dt_factura.Rows[0]["nro_documento_receptor"].ToString() + "|";
                        Codigo_Has = Codigo_Has + get_DigestValues(nroDoc[0]) + "|";
                        Codigo_Has = Codigo_Has + get_SignatureValue(nroDoc[0]) + "|";

                        byte[] obj_codQR = GeneraCodigoQR(Codigo_Has);

                        res = "GeneraCodigoQR";

                        using (FileStream Writer = new System.IO.FileStream(rutaQR + ".gif", FileMode.Create, FileAccess.Write))
                        {
                            Writer.Write(obj_codQR, 0, obj_codQR.Length);
                        }
                        //---- FIN DE GENERACION CODIGO QR---------
                        res = Set_actualizando_Facturacion_Electronica(idCab, 2, nroDoc[0] + ".xml", idCab + ".gif");

                    } else {
                        res = "httpResXML : " + httpResXML.Content;

                        string json = httpResXML.Content.ToString();
                        dynamic json_xml = JsonConvert.DeserializeObject(json);

                        var estado_xml = json_xml["code"].ToString();
                        var description_xml = json_xml["description"].ToString();

                        if (estado_xml == "2108") /// error
                        {
                            Set_Log_Alertas(idCab, description_xml.Replace("\n", string.Empty));
                        }
                        else if (estado_xml == "2017") /// error
                        {
                            Set_Log_Alertas(idCab, description_xml.Replace("\n", string.Empty));
                        }
                    }    
             }
             catch (Exception ex)
             {
                 res = ex.Message;
             }
             return res;
         }

         private string generarCDR(string nombreDocumento, string acceso_token, string description_tiket, int idCab, int flagAnulacion)
         {
             string mensaje = "";
             string[] nroDoc = nombreDocumento.Split('.');
             rutaCDR = "";
             rutaCDR = System.Web.Hosting.HostingEnvironment.MapPath("~/FACT_ELECT_CDR/" + nroDoc[0]);
             try
             {
                //var clientCDR = new RestClient("https://ose-gw1.efact.pe:443/api-efact-ose/v1/cdr/" + description_tiket);
                var clientCDR = new RestClient("https://ose.efact.pe/api-efact-ose/v1/cdr/" + description_tiket);

                var requestCDR = new RestRequest(Method.GET)
                         .AddHeader("Accept", "application/json")
                         .AddHeader("Authorization", "Bearer " + acceso_token);
                 var httpResCDR = clientCDR.Execute(requestCDR);

                 var contentResp = httpResCDR.StatusCode; // raw content as string 
                 mensaje = "Error CDR : " + contentResp;

                 if (httpResCDR.StatusCode.Equals(System.Net.HttpStatusCode.OK))
                 {
                     byte[] response_CDR = clientCDR.DownloadData(requestCDR);

                     using (FileStream Writer = new System.IO.FileStream(rutaCDR + ".xml", FileMode.Create, FileAccess.Write))
                     {
                         Writer.Write(response_CDR, 0, response_CDR.Length);
                     }

                     if (flagAnulacion == 0)
                     {
                         mensaje = Set_actualizando_Facturacion_Electronica(idCab, 1, nroDoc[0] + ".xml", "");
                     }
                     else {
                         mensaje = Set_actualizando_Facturacion_Electronica(idCab, 1, nroDoc[0] + ".xml", "");
                     }          
                 }       
             }
             catch (Exception ex)
             {
                 mensaje = ex.Message;
             }
             return mensaje;
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
