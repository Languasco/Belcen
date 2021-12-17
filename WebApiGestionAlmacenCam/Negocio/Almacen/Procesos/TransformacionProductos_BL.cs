using Entidades.Almacen.Procesos;
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
    public class TransformacionProductos_BL
    {
        public object get_transformacionProductos_cab(int id_local, int id_almacen, int id_estado, string fecha_ini, string fecha_fin)
        {
            Resul res = new Resul();
            List<TransformacionProducto_E> obj_List = new List<TransformacionProducto_E>();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANSF_PRODUCTOS_LISTADO_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_estado", SqlDbType.Int).Value = id_estado;

                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fecha_fin;
  

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                TransformacionProducto_E Entidad = new TransformacionProducto_E();

                                Entidad.id_GuiaCab = Convert.ToInt32(dr["id_GuiaCab"]);
                                Entidad.fechaEmision = dr["fechaEmision"].ToString();
                                Entidad.localOrigen = dr["localOrigen"].ToString();
                                Entidad.almacenOrigen = dr["almacenOrigen"].ToString();

                                Entidad.localDestino = dr["localDestino"].ToString();
                                Entidad.almacenDestino = dr["almacenDestino"].ToString();
                                Entidad.nroTransaccion = dr["nroTransaccion"].ToString();
                                Entidad.estado = dr["estado"].ToString();
                                Entidad.desEstado = dr["desEstado"].ToString();
                                Entidad.colorEstado = dr["colorEstado"].ToString();

                                Entidad.usuario_creacion = dr["usuario_creacion"].ToString();
                                Entidad.fecha_creacion = dr["fecha_creacion"].ToString();
                                Entidad.usuario_edicion = dr["usuario_edicion"].ToString();
                                Entidad.fecha_edicion = dr["fecha_edicion"].ToString();

                                obj_List.Add(Entidad);
                            }

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

        public object Set_insert_update_transformacionProductosCab(int id_GuiaCab,int idLocal, int idAlmacen, int idTipoDoc, string nroDoc, string fechaDoc, int idProveedor, int id_usuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_I_TRANSF_PRODUCTO_GUARDAR_ACTUALIZAR", cn))
                    {

                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_GuiaCab", SqlDbType.Int).Value = id_GuiaCab;
                        cmd.Parameters.Add("@idLocal", SqlDbType.Int).Value = idLocal;
                        cmd.Parameters.Add("@idAlmacen", SqlDbType.Int).Value = idAlmacen;
                        cmd.Parameters.Add("@idTipoDoc", SqlDbType.Int).Value = idTipoDoc;

                        cmd.Parameters.Add("@nroDoc", SqlDbType.VarChar).Value = nroDoc;
                        cmd.Parameters.Add("@fechaDoc", SqlDbType.VarChar).Value = fechaDoc;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.Parameters.Add("@idGuiaCab", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        int idGuiaCab = Convert.ToInt32(cmd.Parameters["@idGuiaCab"].Value.ToString());

                        res.ok = true;
                        res.data = idGuiaCab;
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

        public object Set_insert_update_transformacionProductosDet(TransformacionProducto_Detalle_E objEntidad)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_I_TRANSF_PRODUCTO_DETALLE_GUARDAR_ACTUALIZAR", cn))
                    {

                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@id_GuiaCab", SqlDbType.Int).Value = objEntidad.id_GuiaCab;
                        cmd.Parameters.Add("@id_GuiaDet", SqlDbType.Int).Value = objEntidad.id_GuiaDet;
                        cmd.Parameters.Add("@idProductoOrigen", SqlDbType.Int).Value = objEntidad.idProductoOrigen;
                        cmd.Parameters.Add("@idUMOrigen", SqlDbType.Int).Value = objEntidad.idUMOrigen;
                        cmd.Parameters.Add("@nroLoteOrigen", SqlDbType.VarChar).Value = objEntidad.nroLoteOrigen;
                        cmd.Parameters.Add("@fechaProduccionOrigen", SqlDbType.VarChar).Value = (objEntidad.fechaProduccionOrigen == null)? "" : objEntidad.fechaProduccionOrigen;
                        cmd.Parameters.Add("@fechaVencimientoOrigen", SqlDbType.VarChar).Value = (objEntidad.fechaVencimientoOrigen == null) ? "" : objEntidad.fechaVencimientoOrigen;
                        cmd.Parameters.Add("@stock", SqlDbType.VarChar).Value = objEntidad.stock;
                        cmd.Parameters.Add("@factorMultiplicacion_TransOrigen", SqlDbType.VarChar).Value = objEntidad.factorMultiplicacion_TransOrigen;
                        cmd.Parameters.Add("@idProductoDestino", SqlDbType.Int).Value = objEntidad.idProductoDestino;
                        cmd.Parameters.Add("@codigoProductoDestino", SqlDbType.VarChar).Value = objEntidad.codigoProductoDestino;
                        cmd.Parameters.Add("@descripcionProductoDestino", SqlDbType.VarChar).Value = objEntidad.descripcionProductoDestino;
                        cmd.Parameters.Add("@idUMDestino", SqlDbType.Int).Value = objEntidad.idUMDestino;
                        cmd.Parameters.Add("@nroLoteDestino", SqlDbType.VarChar).Value = objEntidad.nroLoteDestino;
                        cmd.Parameters.Add("@fechaProduccionDestino", SqlDbType.VarChar).Value = (objEntidad.fechaProduccionDestino == null) ? "" : objEntidad.fechaProduccionDestino;
                        cmd.Parameters.Add("@fechaVencimientoDestino", SqlDbType.VarChar).Value = (objEntidad.fechaVencimientoDestino == null) ? "" : objEntidad.fechaVencimientoDestino;
                        cmd.Parameters.Add("@factorMultiplicacion_TransDestino", SqlDbType.VarChar).Value = objEntidad.factorMultiplicacion_TransDestino;
                        cmd.Parameters.Add("@cantidad", SqlDbType.VarChar).Value = objEntidad.cantidad;
                        cmd.Parameters.Add("@usuario_creacion", SqlDbType.Int).Value = objEntidad.usuario_creacion;

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

        public object get_transformacionProductoDetalle(int id_GuiaCab)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANSF_PRODUCTO_DETALLE_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_GuiaCab", SqlDbType.Int).Value = id_GuiaCab;

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

        public object set_eliminar_transformacionProductoDetalle(int id_GuiaDet)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANSF_PRODUCTO_DETALLE_ELIMINAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_GuiaDet", SqlDbType.Int).Value = id_GuiaDet;
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

        public object get_transformacionProductoCab_edicion(int id_GuiaCab)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANSF_PRODUCTO_CAB_EDITAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_GuiaCab", SqlDbType.Int).Value = id_GuiaCab;

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

        public object set_cerrar_transformacionProducto(int id_GuiaCab, int id_usuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANSF_PRODUCTOS_CERRAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_GuiaCab", SqlDbType.Int).Value = id_GuiaCab;
                        cmd.Parameters.Add("@id_Usuario", SqlDbType.Int).Value = id_usuario;

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

        public object set_reactivar_transformacionProducto(int id_GuiaCab, int id_usuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_TRANSF_PRODUCTOS_REACTIVAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_GuiaCab", SqlDbType.Int).Value = id_GuiaCab;
                        cmd.Parameters.Add("@id_Usuario", SqlDbType.Int).Value = id_usuario;

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


    }
}
