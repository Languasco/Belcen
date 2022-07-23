using Entidades;
using Entidades.Accessos;
using Entidades.Facturacion.Reporte;
using Negocio.Conexion;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Accesos
{
    public class UsuarioAlmacen_BL 
    {
        public List<Usuario_Almacen_E> Listando_AlmacenesUsuario(int id_usuario)
        {
            try
            {
                List<Usuario_Almacen_E> obj_List = new List<Usuario_Almacen_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_USUARIOS_ALMACEN", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Usuario_Almacen_E Entidad = new Usuario_Almacen_E();

                                Entidad.checkeado = false;
                                if (row["checkeado"].ToString() == "true")
                                {
                                   Entidad.checkeado = true;
                                }
                                Entidad.id_Usuario_Almacen=  Convert.ToInt32(row["id_Usuario_Almacen"].ToString());
                                Entidad.id_Usuario=  Convert.ToInt32(row["id_Usuario"].ToString());
                                Entidad.id_Almacen=  Convert.ToInt32(row["id_Almacen"].ToString());
                                Entidad.descripcion_Almacen = row["descripcion_Almacen"].ToString(); 
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

        public string set_save_AlmacenesUsuario(string obj_user, string obj_Almacen,int  id_usuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_I_USUARIOS_ALMACEN", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@codUser", SqlDbType.VarChar).Value = obj_user;
                        cmd.Parameters.Add("@codAlmacen", SqlDbType.VarChar).Value = obj_Almacen;
                        cmd.Parameters.Add("@idusuario", SqlDbType.Int).Value = id_usuario;
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


        public List<Usuario_Almacen_E> Listando_zonasLocalUsuario(int id_usuario, int id_local)
        {
            try
            {
                List<Usuario_Almacen_E> obj_List = new List<Usuario_Almacen_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_USUARIOS_ZONA_VENTA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Usuario_Almacen_E Entidad = new Usuario_Almacen_E();

                                Entidad.checkeado = false;
                                if (row["checkeado"].ToString() == "true")
                                {
                                    Entidad.checkeado = true;
                                }
                                Entidad.id_ZonaVta_Usuario = Convert.ToInt32(row["id_ZonaVta_Usuario"].ToString());
                                Entidad.id_Usuario = Convert.ToInt32(row["id_Usuario"].ToString());
                                Entidad.id_ZonaVta = Convert.ToInt32(row["id_ZonaVta"].ToString());
                                Entidad.nombreZonaVta = row["nombreZonaVta"].ToString();
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


        public string set_save_ZonasUsuario(string obj_user, string obj_zonas, int id_usuario, int id_local)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_I_USUARIOS_ZONA_VENTA_SAVE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@codUser", SqlDbType.VarChar).Value = obj_user;
                        cmd.Parameters.Add("@codZonas", SqlDbType.VarChar).Value = obj_zonas;
                        cmd.Parameters.Add("@idusuario", SqlDbType.Int).Value = id_usuario;
                        cmd.Parameters.Add("@idlocal", SqlDbType.Int).Value = id_local;
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
