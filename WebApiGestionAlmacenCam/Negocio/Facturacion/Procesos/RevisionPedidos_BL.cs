using Entidades.Facturacion.Procesos;
using Negocio.Conexion;
using Negocio.Resultado;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Facturacion.Procesos
{
    public class RevisionPedidos_BL
    {
        public object get_estados()
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REVISION_PEDIDO_COMBO_ESTADOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

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

        public object get_revisionesPedidos(int id_local, int id_almacen, int id_vendedor, int id_Anexos, string fechaIni, string fechaFin, int id_transportista, int id_estado, int flagFueraRuta)
        {
            Resul res = new Resul();
            List<revisionPedidoE> obj_List = new List<revisionPedidoE>();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REVISION_PEDIDO_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;
                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;

                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;

                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;
                        cmd.Parameters.Add("@id_estado", SqlDbType.Int).Value = id_estado;
                        cmd.Parameters.Add("@flag_FueraRuta", SqlDbType.Int).Value = flagFueraRuta;


                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                revisionPedidoE Entidad = new revisionPedidoE();
 
                                Entidad.checkeado = false;
                                Entidad.id_Pedido_Cab = Convert.ToInt32(dr["id_Pedido_Cab"]);
                                Entidad.nroPedido = dr["nroPedido"].ToString();
                                Entidad.fecha = dr["fecha"].ToString();
                                Entidad.cliente = dr["cliente"].ToString();

                                Entidad.nroDoc = dr["nroDoc"].ToString();
                                Entidad.tipoDoc = dr["tipoDoc"].ToString();

                                Entidad.formaPago = dr["formaPago"].ToString();
                                Entidad.valorBruto = dr["valorBruto"].ToString();
                                Entidad.igv = dr["igv"].ToString();
                                Entidad.importeNeto = dr["importeNeto"].ToString();

                                Entidad.fueraRuta = dr["fueraRuta"].ToString();
                                Entidad.vendedor = dr["vendedor"].ToString();
                                Entidad.transportista = dr["transportista"].ToString();
                                Entidad.estado = dr["estado"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();

                                Entidad.usuario_creacion = dr["usuario_creacion"].ToString();
                                Entidad.fecha_creacion = dr["fecha_creacion"].ToString();
                                Entidad.usuario_edicion = dr["usuario_edicion"].ToString();
                                Entidad.fecha_edicion = dr["fecha_edicion"].ToString();

                                obj_List.Add(Entidad);

                            }

                            dr.Close();

                            res.ok = true;
                            res.data = obj_List;                            
                        }
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
        
        public object set_grabar_asignacionTecnico(string idOTs, int idusuario, int idanexo, int id_ZonaVta, int id_almacen)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_I_REVISION_PEDIDO_APROBAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idPedidosMasivos", SqlDbType.VarChar).Value = idOTs;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idusuario;
                        cmd.Parameters.Add("@idAnexo", SqlDbType.Int).Value = idanexo;
                        cmd.Parameters.Add("@idZonaVta", SqlDbType.Int).Value = id_ZonaVta;
                        cmd.Parameters.Add("@idAlmacen", SqlDbType.Int).Value = id_almacen;

                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
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

        public object get_despachoPDF(string idPedidosMasivos, string fechaInicio,string fechaFinal, int  idusuario)
        {
            DataTable dt_detalle = new DataTable();
            DataTable dt_resumen = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_I_REVISION_PEDIDO_GENERAR_DESPACHO_PDF", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idPedidosMasivos", SqlDbType.VarChar).Value = idPedidosMasivos;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idusuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    using (SqlCommand cmd = new SqlCommand("PROC_I_REVISION_PEDIDO_GENERAR_DESPACHO_RESUMEN_PDF", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idPedidosMasivos", SqlDbType.VarChar).Value = idPedidosMasivos;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idusuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_resumen);
                        }
                    }

                    object reporte = new
                    {
                        cabecera = dt_detalle,
                        resumen = dt_resumen,
                    };

                    res.ok = true;
                    res.data = reporte;

                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object get_anexos_almacen(int idAlmacen)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REVISION_PEDIDO_COMBO_ANEXO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idAlmacen", SqlDbType.Int).Value = idAlmacen;


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
        
        public object get_vendedorLocal(int idLocal)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REVISION_PEDIDO_COMBO_VENDEDOR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idLocal", SqlDbType.Int).Value = idLocal;


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

        public object get_transportistaLocal(int idLocal)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REVISION_PEDIDO_COMBO_TRANSPORTISTA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idLocal", SqlDbType.Int).Value = idLocal;


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

        public object get_consolidadoMercaderia(string fechaIni, string fechaFin, int id_zona, int  id_transportista, int idUsuario, int idVendedor)
        {
            DataTable dt_detalle = new DataTable();
            DataTable dt_resumen = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_CONSOLIDADO_MERCADERIA_PDF", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idVendedor", SqlDbType.Int).Value = idVendedor;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    using (SqlCommand cmd = new SqlCommand("PROC_S_CONSOLIDADO_MERCADERIA_RESUMEN_PDF", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_resumen);
                        }
                    }

                    object reporte = new
                    {
                        cabecera = dt_detalle,
                        resumen = dt_resumen,
                    };

                    res.ok = true;
                    res.data = reporte;

                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }
        
        public object get_tiposDocumentos()
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REIMPRESION_COMBO_TIPO_DOC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

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

        public object get_facturasCabeceras(int id_zona, int id_almacen, int id_vendedor, int id_Anexos, string fechaIni, string fechaFin, int id_transportista, int id_tipoDoc)
        {
            Resul res = new Resul();
            List<FacturasE> obj_List = new List<FacturasE>();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REIMPRESION_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;

                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;

                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;
                        cmd.Parameters.Add("@id_tipoDoc", SqlDbType.Int).Value = id_tipoDoc;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                FacturasE Entidad = new FacturasE();

                                Entidad.checkeado = false;
                                Entidad.id_Factura_Cab = Convert.ToInt32(dr["id_Factura_Cab"]);
                                Entidad.idTipoDoc = dr["idTipoDoc"].ToString();
                                Entidad.descripcionTipoDoc = dr["descripcionTipoDoc"].ToString();
                                Entidad.nrodocumento = dr["nrodocumento"].ToString();

                                Entidad.fecha = dr["fecha"].ToString();
                                Entidad.cliente = dr["cliente"].ToString();

                                Entidad.formaPago = dr["formaPago"].ToString();
                                Entidad.valorBruto = dr["valorBruto"].ToString();
                                Entidad.igv = dr["igv"].ToString();
                                Entidad.importeNeto = dr["importeNeto"].ToString();
                                Entidad.vendedor = dr["vendedor"].ToString();

                                obj_List.Add(Entidad);
                            }

                            dr.Close();

                            res.ok = true;
                            res.data = obj_List;
                        }
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
        
        public object get_reImprimirMasivo( string idFacturasMasivos, int  idTipoDoc, int  idusuario)
        {
            Resul res = new Resul();
            try
            {
                List<DocumentosImprimir_masivo> obj_List = new List<DocumentosImprimir_masivo>();
                string ruta = ConfigurationManager.AppSettings["servidor_foto"];

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_DOCUMENTOS_RE_IMPRIMIR_MASIVO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFacturasMasivos", SqlDbType.VarChar).Value = idFacturasMasivos;
                        cmd.Parameters.Add("@idTipoDoc", SqlDbType.Int).Value = idTipoDoc;
                        cmd.Parameters.Add("@idusuario", SqlDbType.Int).Value = idusuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                DocumentosImprimir_masivo Entidad = new DocumentosImprimir_masivo();

                                Entidad.idCab = dr["idCab"].ToString();
                                Entidad.empresaTitulo = dr["empresaTitulo"].ToString();
                                Entidad.descripcionEmpresa = dr["descripcionEmpresa"].ToString();
                                Entidad.telefonoEmpresa = dr["telefonoEmpresa"].ToString();
                                Entidad.emailEmpresa = dr["emailEmpresa"].ToString();
                                Entidad.rucEmpresa = dr["rucEmpresa"].ToString();

                                Entidad.nroDocEmpresa = dr["nroDocEmpresa"].ToString();
                                Entidad.nombreCliente = dr["nombreCliente"].ToString();
                                Entidad.direccionCliente = dr["direccionCliente"].ToString();
                                Entidad.direccionEnvioCliente = dr["direccionEnvioCliente"].ToString();
                                Entidad.rucDniCliente = dr["rucDniCliente"].ToString();

                                Entidad.codigoCliente = dr["codigoCliente"].ToString();
                                Entidad.moneda = dr["moneda"].ToString();
                                Entidad.emision = dr["emision"].ToString();
                                Entidad.vencimiento = dr["vencimiento"].ToString();
                                Entidad.condicion = dr["condicion"].ToString();
                                Entidad.hora = dr["hora"].ToString();

                                Entidad.referencia = dr["referencia"].ToString();
                                Entidad.vendedor = dr["vendedor"].ToString();
                                Entidad.celular = dr["celular"].ToString();
                                Entidad.codigoProducto = dr["codigoProducto"].ToString();
                                Entidad.descripcionProducto = dr["descripcionProducto"].ToString();
                                Entidad.cantidadProducto = dr["cantidadProducto"].ToString();

                                Entidad.unidad = dr["unidad"].ToString();
                                Entidad.precio = dr["precio"].ToString();
                                Entidad.importeItem = dr["importeItem"].ToString();

                                if (string.IsNullOrEmpty(dr["codigo_rq"].ToString()) == false)
                                {
                                    Entidad.codigo_rq = dr["codigo_rq"].ToString();
                                    Entidad.codigo_rq_base64 = Convert.ToBase64String(GetImage(dr["codigo_rq"].ToString()));
                                }
                                else {
                                    Entidad.codigo_rq = "";
                                    Entidad.codigo_rq_base64 = "";
                                }

                                Entidad.descripcionComprobante = dr["descripcionComprobante"].ToString();
                                Entidad.subTotal = dr["subTotal"].ToString();
                                Entidad.descuentoTotal = dr["descuentoTotal"].ToString();
                                Entidad.operacionGrabada = dr["operacionGrabada"].ToString();
                                Entidad.operacionExonerada = dr["operacionExonerada"].ToString();
                                Entidad.operacionInafecta = dr["operacionInafecta"].ToString();
                                Entidad.igv = dr["igv"].ToString();
                                Entidad.importeTotal = dr["importeTotal"].ToString();

                                Entidad.direccionEmpresa = dr["direccionEmpresa"].ToString();
                                Entidad.sucursalEmpresa1 = dr["sucursalEmpresa1"].ToString();
                                Entidad.sucursalEmpresa2 = dr["sucursalEmpresa2"].ToString();
                                Entidad.sucursalEmpresa3 = dr["sucursalEmpresa3"].ToString();
                                Entidad.sucursalEmpresa4 = dr["sucursalEmpresa4"].ToString();

                                obj_List.Add(Entidad);

                            }
                        }
                    }
                }

                res.ok = true;
                res.data = obj_List;

            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        private byte[] GetImage(string url)
        {
            Stream stream = null;
            byte[] buf;

            try
            {
                WebProxy myProxy = new WebProxy();
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);

                HttpWebResponse response = (HttpWebResponse)req.GetResponse();
                stream = response.GetResponseStream();

                using (BinaryReader br = new BinaryReader(stream))
                {
                    int len = (int)(response.ContentLength);
                    buf = br.ReadBytes(len);
                    br.Close();
                }

                stream.Close();
                response.Close();
            }
            catch (Exception exp)
            {
                buf = null;
            }

            return (buf);
        }

        public object get_liquidacionTransportista(string fechaIni, string fechaFin, int id_zona, int id_transportista, int idUsuario, int idVendedor)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_CONSOLIDADO_MERCADERIA_LIQ_TRANSPORTISTA_PDF", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idVendedor", SqlDbType.Int).Value = idVendedor;
                        

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                    res.ok = true;
                    res.data = dt_detalle;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }


        public object get_anexos_usuarios(int id_Usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REPORTE_REGISTROVENTA_COMBO_Anexos", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Usuario", SqlDbType.Int).Value = id_Usuario;


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

        public object get_locales_usuarios(int id_Usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REPORTE_REGISTROVENTA_COMBO_Locales", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Usuario", SqlDbType.Int).Value = id_Usuario;


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

        public object get_almacen_anexo_local(int id_Anexos, int id_Local, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REPORTE_REGISTROVENTA_COMBO_Almacen", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Usuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;
                        cmd.Parameters.Add("@id_Local", SqlDbType.Int).Value = id_Local;

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

        public object get_zonas_anexo_local_almacen(int id_Anexos, int id_Local, int id_Almacen,  int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REPORTE_REGISTROVENTA_COMBO_Zonas", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Usuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;
                        cmd.Parameters.Add("@id_Local", SqlDbType.Int).Value = id_Local;
                        cmd.Parameters.Add("@id_Almacen", SqlDbType.Int).Value = id_Almacen;

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
         
        public object get_planillaCobranza(string fechaIni, string fechaFin, int id_zona, int id_transportista, int idUsuario, int idVendedor)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_CONSOLIDADO_MERCADERIA_PLANILLA_COBRANZA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idVendedor", SqlDbType.Int).Value = idVendedor;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                    res.ok = true;
                    res.data = dt_detalle;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object get_anexosZona(int idZona)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ANEXOS_X_ZONAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idZona", SqlDbType.Int).Value = idZona;


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

        public object get_anexos_usuarios_modulo(int id_Usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_FACTURACION_COMBO_ANEXO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Usuario", SqlDbType.Int).Value = id_Usuario;

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


    }
}
