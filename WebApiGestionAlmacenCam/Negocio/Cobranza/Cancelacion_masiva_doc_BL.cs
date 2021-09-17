using Entidades.Cobranzas;
using Negocio.Conexion;
using Negocio.Resultado;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Cobranza
{
    public class Cancelacion_masiva_doc_BL
    {
        public List<CancelacionMasiva_doc_E> Listando_Documentos_Cancelar(int id_local, int id_almacen, int  id_Anexos,   int  vendedor, int id_transportista, int id_tipoDoc, int id_tipoResponsable, string fechaIni, string fechaFin)
        {
            try
            {
                List<CancelacionMasiva_doc_E> obj_List = new List<CancelacionMasiva_doc_E>();
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_CANCELACION_MASIVA_DOC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;

                        cmd.Parameters.Add("@vendedor", SqlDbType.Int).Value = vendedor;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;
                        cmd.Parameters.Add("@id_tipoDoc", SqlDbType.Int).Value = id_tipoDoc;
                        cmd.Parameters.Add("@id_tipoResponsable", SqlDbType.Int).Value = id_tipoResponsable;

                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            List<string> archivo = new List<string>();

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                CancelacionMasiva_doc_E Entidad = new CancelacionMasiva_doc_E();

                                Entidad.id_Factura_Cab = Convert.ToInt32(row["id_Factura_Cab"].ToString());
                                Entidad.id_TipoDocumento =  row["id_TipoDocumento"].ToString();
                                Entidad.tipo_doc = row["tipo_doc"].ToString();
                                Entidad.nro_doc = row["nro_doc"].ToString();
                                Entidad.fechaDoc = row["fechaDoc"].ToString();

                                Entidad.id_cliente = row["id_cliente"].ToString();
                                Entidad.cliente = row["cliente"].ToString();             
                                Entidad.saldo_pendiente = Math.Round(Convert.ToDecimal(row["saldo_pendiente"]), 2).ToString("0.###");
                                Entidad.cancelar = false;
                                Entidad.importe_pagar = Math.Round(Convert.ToDecimal(row["importe_pagar"]), 2).ToString("0.###");
                                Entidad.nuevo_saldo = Math.Round(Convert.ToDecimal(row["nuevo_saldo"]), 2).ToString("0.###");
                                Entidad.id_formaPago = "0";
                                Entidad.FormaPago = "EFECTIVO";
                                Entidad.id_banco = "0";
                                Entidad.fechaOperacion = "";
                                Entidad.nroOperacion = "";

                                Entidad.totalCancelado = row["totalCancelado"].ToString();
                                Entidad.totalRetencion = row["totalRetencion"].ToString();
                                Entidad.totalDetraccion = row["totalDetraccion"].ToString();
                                Entidad.file = archivo;

                                Entidad.CondicionPago = row["CondicionPago"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }        

        public string Set_almacenandoDetalle_Cancelaciones(List<detalle_cancelaciones_E> List_Detalle)
        {

            string Resultado = null;
            bool flagCant = false;
            int user = 0;
            //---validacion de registros
            for (int i = 0; i < List_Detalle.Count; i++)
            {
                flagCant = true;
                break;
            }
            if (flagCant == false)
            {
                Resultado = "No se cargo la informacion correctamente, Actualice la pagina y vuelva a intentarlo";
                return Resultado;
            }

            user = List_Detalle[0].id_usuario;
 

            DataTable dt_detalle = new DataTable();
            try
            {
                try
                {
                    PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(detalle_cancelaciones_E));
                    foreach (PropertyDescriptor prop in properties)
                    {
                        dt_detalle.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
                    }

                    foreach (detalle_cancelaciones_E item in List_Detalle)
                    {
                        DataRow row = dt_detalle.NewRow();
                        foreach (PropertyDescriptor prop in properties)
                            row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                        dt_detalle.Rows.Add(row);
                    }
                }
                catch (Exception ex)
                {
                    Resultado = ex.Message;
                    return Resultado;
                }

                using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_D_TEMPORAL_DETALLE_PAGOS", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@usuario", SqlDbType.Int).Value = user;
                        cmd.ExecuteNonQuery();
                    }

                    //guardando al informacion de la importacion
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(bdConexion.cadenaBDcx()))
                    {

                        bulkCopy.BatchSize = 500;
                        bulkCopy.NotifyAfter = 1000;
                        bulkCopy.DestinationTableName = "T_TEMPORAL_DETALLE_PAGOS";
                        bulkCopy.WriteToServer(dt_detalle);
                    }

                    //----insertando tabla de cancelaciones ----
                    using (SqlCommand cmd = new SqlCommand("PROC_I_CANCELACION_MASIVA_DOC", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = user;
                        cmd.ExecuteNonQuery();
                    }

                    Resultado = "OK";
                }
            }
            catch (Exception ex)
            {
                Resultado = ex.Message;
            }

            return Resultado;

        }
        
        public string Set_rechazando_Cancelaciones(int id_usuario)
        {
           var Resultado = "";
           try
            {
                using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    //----insertando tabla de cancelaciones ----
                    using (SqlCommand cmd = new SqlCommand("PROC_U_CANCELACION_MASIVA_DOC_RECHAZAR", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.ExecuteNonQuery();
                    }

                    Resultado = "OK";
                }
            }
            catch (Exception ex)
            {
                Resultado = ex.Message;
            }

            return Resultado;

        }

        public List<CancelacionMasiva_doc_E> Listando_registro_pagos(int id_tipodoc,string nro_documento)
        {
            try
            {
                List<CancelacionMasiva_doc_E> obj_List = new List<CancelacionMasiva_doc_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REGISTRO_PAGOS_DOC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_tipoDoc", SqlDbType.Int).Value = id_tipodoc;
                        cmd.Parameters.Add("@nro_documento", SqlDbType.VarChar).Value = nro_documento ;
 

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                CancelacionMasiva_doc_E Entidad = new CancelacionMasiva_doc_E();
                                
                                Entidad.id_cancelacion_cab = Convert.ToInt32(row["id_cancelacion_cab"].ToString());
                                Entidad.id_Factura_Cab = Convert.ToInt32(row["id_Factura_Cab"].ToString());
                                Entidad.cod_ref = row["cod_ref"].ToString();                                
                                Entidad.Numero_Documento = row["Numero_Documento"].ToString();
                                Entidad.fecha_pago = row["fecha_pago"].ToString(); 
                                Entidad.FormaPago = row["FormaPago"].ToString();

                                Entidad.importe_total = Math.Round(Convert.ToDecimal(row["importe_total"]), 2).ToString("0.###");
                                Entidad.pago_factura = Math.Round(Convert.ToDecimal(row["pago_factura"]), 2).ToString("0.###"); 
                                Entidad.saldo_pendiente = Math.Round(Convert.ToDecimal(row["saldo_pendiente"]), 2).ToString("0.###");

                                Entidad.cobrador = row["cobrador"].ToString();
                                Entidad.nroOperacion = row["nroOperacion"].ToString();
                                Entidad.fechaOperacion = row["fechaOperacion"].ToString();
                                Entidad.voucher = row["voucher"].ToString();

                                Entidad.id_estado = Convert.ToInt32(row["id_estado"].ToString());
                                Entidad.estado = row["estado"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public List<CancelacionMasiva_doc_E> get_SaldoCuenta_Factura(int id_factura)
        {
            try
            {
                List<CancelacionMasiva_doc_E> obj_List = new List<CancelacionMasiva_doc_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_FACTURA_SALDOCUENTA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_factura", SqlDbType.Int).Value = id_factura;
                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                CancelacionMasiva_doc_E Entidad = new CancelacionMasiva_doc_E();
                                Entidad.saldoCuenta = Math.Round(Convert.ToDecimal(row["saldoCuenta"]), 2).ToString("0.###");
                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }
                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public string Set_Generando_Cancelacion(int id_factura, string codRef, decimal totalpago, decimal pagoCueta, int id_formaPago, int id_banco, string fechaOperacion, string nroOperacion)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_I_REGISTRO_PAGOS_DOC_PAGAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_factura", SqlDbType.Int).Value = id_factura;
                        cmd.Parameters.Add("@codRef", SqlDbType.VarChar).Value = codRef;
                        cmd.Parameters.Add("@totalpago", SqlDbType.Decimal).Value = totalpago;

                        cmd.Parameters.Add("@pagoCueta", SqlDbType.Decimal).Value = pagoCueta;
                        cmd.Parameters.Add("@id_formaPago", SqlDbType.Int).Value = id_formaPago;
                        cmd.Parameters.Add("@id_banco", SqlDbType.Int).Value = id_banco;

                        cmd.Parameters.Add("@fechaOperacion", SqlDbType.VarChar).Value = fechaOperacion;
                        cmd.Parameters.Add("@nroOperacion", SqlDbType.VarChar).Value = nroOperacion;

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

        public string Set_anulandoPago_individual(int id_cancelacion, int id_factura, int id_usuario)
        {
            var Resultado = "";
            try
            {
                using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    //----insertando tabla de cancelaciones ----
                    using (SqlCommand cmd = new SqlCommand("PROC_U_REGISTRO_PAGOS_ANULAR", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_cancelacion", SqlDbType.Int).Value = id_cancelacion;
                        cmd.Parameters.Add("@id_factura", SqlDbType.Int).Value = id_factura;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.ExecuteNonQuery();
                    }

                    Resultado = "OK";
                }
            }
            catch (Exception ex)
            {
                Resultado = ex.Message;
            }

            return Resultado;

        }

        public List<CancelacionMasiva_doc_E> get_ListaFotos_voucher(string nro_ref)
        {
            try
            {
                List<CancelacionMasiva_doc_E> obj_List = new List<CancelacionMasiva_doc_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REGISTRO_PAGOS_VOUCHER", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@cod_ref", SqlDbType.VarChar).Value = nro_ref;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                CancelacionMasiva_doc_E Entidad = new CancelacionMasiva_doc_E();

                                Entidad.url = row["url"].ToString();
                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {

                throw e;
            }
        }
                
        public object get_verificarNroRecibo(int idzona, string nroRecibo)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_PEDIDOS_VALIDAR_NRO_RECIBO_PAGOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idzona", SqlDbType.Int).Value = idzona;
                        cmd.Parameters.Add("@nroRecibo", SqlDbType.VarChar).Value = nroRecibo;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }

                        res.ok = true;
                        res.data = dt_detalle;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }
 
        public object get_detalladoDocumentos(int id_facturaCab)
        {
            DataTable dt_detallePagos = new DataTable();
            DataTable dt_detalleOtros = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_CANCELACION_MASIVA_DETALLE_PAGOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_facturaCab", SqlDbType.Int).Value = id_facturaCab;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detallePagos);
                        }
                    }

                    using (SqlCommand cmd = new SqlCommand("PROC_S_CANCELACION_MASIVA_DETALLE_PAGOS_OTROS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_facturaCab", SqlDbType.Int).Value = id_facturaCab;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalleOtros);
                        }
                    }

                    res.ok = true;
                    res.data = new
                    {
                      dt_detallePagos,
                      dt_detalleOtros
                    };
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object get_cierreVentas(string fechaInicial, string  fechaFinal , string nroRecibo)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_CANCELACION_MASIVA_REPORTE_CIERRE_PDF", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fecha_inicial", SqlDbType.VarChar).Value = fechaInicial;
                        cmd.Parameters.Add("@fecha_final", SqlDbType.VarChar).Value = fechaFinal;
                        cmd.Parameters.Add("@nro_recibo", SqlDbType.VarChar).Value = nroRecibo;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }

                        res.ok = true;
                        res.data = dt_detalle;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object get_reporteCobranzasPDF(string fechaInicial, string fechaFinal, string nroDoc)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REPORTE_COBRANZAS_PDF", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fecha_inicial", SqlDbType.VarChar).Value = fechaInicial;
                        cmd.Parameters.Add("@fecha_final", SqlDbType.VarChar).Value = fechaFinal;
                        cmd.Parameters.Add("@nroDoc", SqlDbType.VarChar).Value = nroDoc;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }

                        res.ok = true;
                        res.data = dt_detalle;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }


        public object get_verificarNro_documentoUsuario( string nroDocumento)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_W_USUARIOS_VERIFICAR_NRO_DOCUMENTO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@nroDocumento", SqlDbType.VarChar).Value = nroDocumento;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }

                        res.ok = true;
                        res.data = dt_detalle;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object Set_anulandoNumero(int id_ZonaVta, string fechaInicial, string fechaFinal, string serie, string numero, int usuario_creacion)
        {
 
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_ANULAR_NUMERO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@id_ZonaVta", SqlDbType.Int).Value = id_ZonaVta;
                        cmd.Parameters.Add("@fechaInicial", SqlDbType.VarChar).Value = fechaInicial;
                        cmd.Parameters.Add("@fechaFinal", SqlDbType.VarChar).Value = fechaFinal;

                        cmd.Parameters.Add("@serie", SqlDbType.VarChar).Value = serie;
                        cmd.Parameters.Add("@numero", SqlDbType.VarChar).Value = numero;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = usuario_creacion;
                        cmd.ExecuteNonQuery();
 

                        res.ok = true;
                        res.data = "ok";
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }



    }
}
