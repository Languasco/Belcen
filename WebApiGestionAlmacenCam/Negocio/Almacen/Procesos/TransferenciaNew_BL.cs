using Negocio.Resultado;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Almacen.Procesos
{
    public class TransferenciaNew_BL
    {
        public object get_zonaVentaArqueo(int idAnexo, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COMBO_ZONA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idAnexo", SqlDbType.Int).Value = idAnexo;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

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
        

        public object Set_insert_update_transferenciasCab(int Id_AlmTranCab, string nro_Transferencia, string fechaEmision_TranferenciaCab, string obs_TranferenciaCab, int origen_id_Local,
                                                          int origen_id_Almacen, int destino_id_Local, int destino_id_Almacen, int id_usuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_I_TRANFERENCIAS_GUARDAR_ACTUALIZAR", cn))
                    {
            
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Id_AlmTranCab", SqlDbType.Int).Value = Id_AlmTranCab;
                        cmd.Parameters.Add("@nro_Transferencia", SqlDbType.VarChar).Value = nro_Transferencia;
                        cmd.Parameters.Add("@fechaEmision_TranferenciaCab", SqlDbType.VarChar).Value = fechaEmision_TranferenciaCab;
                        cmd.Parameters.Add("@obs_TranferenciaCab", SqlDbType.VarChar).Value = obs_TranferenciaCab;

                        cmd.Parameters.Add("@origen_id_Local", SqlDbType.Int).Value = origen_id_Local;
                        cmd.Parameters.Add("@origen_id_Almacen", SqlDbType.Int).Value = origen_id_Almacen;
                        cmd.Parameters.Add("@destino_id_Local", SqlDbType.Int).Value = destino_id_Local;
                        cmd.Parameters.Add("@destino_id_Almacen", SqlDbType.Int).Value = destino_id_Almacen;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

                        cmd.Parameters.Add("@id_TranferenciaCab", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        int idTranferenciaCab = Convert.ToInt32(cmd.Parameters["@id_TranferenciaCab"].Value.ToString());

                        res.ok = true;
                        res.data = idTranferenciaCab;
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


        public object get_buscarProducto_codigo(int origen_id_Local, int origen_id_Almacen,string cod_producto, int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANFERENCIAS_STOCK_PRODUCTO_CODIGO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@origen_id_Local", SqlDbType.Int).Value = origen_id_Local;
                        cmd.Parameters.Add("@origen_id_Almacen", SqlDbType.Int).Value = origen_id_Almacen;

                        cmd.Parameters.Add("@cod_producto", SqlDbType.VarChar).Value = cod_producto;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

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


        public object get_buscarProducto_todos(int origen_id_Local, int origen_id_Almacen, string filtroBusqueda, int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANFERENCIAS_STOCK_PRODUCTO_TODOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@origen_id_Local", SqlDbType.Int).Value = origen_id_Local;
                        cmd.Parameters.Add("@origen_id_Almacen", SqlDbType.Int).Value = origen_id_Almacen;
                        cmd.Parameters.Add("@filtroBusqueda", SqlDbType.VarChar).Value = filtroBusqueda;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

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

        public object get_transferenciasDetalle(int id_transferenciaCab)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANFERENCIAS_LISTADO_DETALLE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_transferenciaCab", SqlDbType.Int).Value = id_transferenciaCab;
 
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

        public object get_buscarProducto_edicion( int origen_id_Local, int origen_id_Almacen, int  id_Material, int id_UnidadMedida_Ingreso, string nroLote, int id_usuario , string fechaProduccion)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANFERENCIAS_STOCK_PRODUCTO_EDICION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@origen_id_Local", SqlDbType.Int).Value = origen_id_Local;
                        cmd.Parameters.Add("@origen_id_Almacen", SqlDbType.Int).Value = origen_id_Almacen;
                        cmd.Parameters.Add("@id_Material", SqlDbType.Int).Value = id_Material;
                        cmd.Parameters.Add("@id_UnidadMedida_Ingreso", SqlDbType.Int).Value = id_UnidadMedida_Ingreso;

                        cmd.Parameters.Add("@nroLote", SqlDbType.VarChar).Value = nroLote;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.Parameters.Add("@fechaProduccion", SqlDbType.VarChar).Value = fechaProduccion;

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

        public object set_eliminar_transferenciaDet(  int Id_AlmTranDet)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANFERENCIAS_ELIMINAR_DET", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Id_AlmTranDet", SqlDbType.Int).Value = Id_AlmTranDet;
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

        public object set_cerrar_tranferenciasCab(int id_transferenciaCab, int id_usuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANFERENCIAS_CERRAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_transferenciaCab", SqlDbType.Int).Value = id_transferenciaCab;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

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


        public object set_reactivar_tranferenciasCab(int id_transferenciaCab, string flagGuia ,  int id_usuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANFERENCIAS_REACTIVAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_transferenciaCab", SqlDbType.Int).Value = id_transferenciaCab;
                        cmd.Parameters.Add("@flagGuia", SqlDbType.VarChar).Value = flagGuia;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

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

        public object get_buscarProducto_ayudaModal(int origen_id_Local, int origen_id_Almacen, string filtroBusqueda, int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_LISTADO_PRODUCTOS_MODAL_AYUDA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Local", SqlDbType.Int).Value = origen_id_Local;
                        cmd.Parameters.Add("@id_Almacen", SqlDbType.Int).Value = origen_id_Almacen;
                        cmd.Parameters.Add("@filtroBusqueda", SqlDbType.VarChar).Value = filtroBusqueda;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

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


        public object get_tipoDocumento_Guia()
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANFERENCIAS_COMBO_TIPO_DOCUMENTO_GUIA", cn))
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


    }
}
