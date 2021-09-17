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
    public class UsuarioLocal_BL
    {
        public List<Usuario_Local_E> Listando_LocalesUsuario(int id_usuario)
        {
            try
            {
                List<Usuario_Local_E> obj_List = new List<Usuario_Local_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_USUARIOS_LOCALES", cn))
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
                                Usuario_Local_E Entidad = new Usuario_Local_E();

                                Entidad.checkeado = false;
                                if (row["checkeado"].ToString() == "true")
                                {
                                   Entidad.checkeado = true;
                                }
                                Entidad.id_Usuario_Local=  Convert.ToInt32(row["id_Usuario_Local"].ToString());
                                Entidad.id_Usuario=  Convert.ToInt32(row["id_Usuario"].ToString());
                                Entidad.id_Local=  Convert.ToInt32(row["id_Local"].ToString());
                                Entidad.nombre_Local = row["nombre_Local"].ToString(); 
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

        public string set_save_LocalesUsuario(string obj_user, string obj_locales,int  id_usuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_I_USUARIOS_LOCALES", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@codUser", SqlDbType.VarChar).Value = obj_user;
                        cmd.Parameters.Add("@codLocal", SqlDbType.VarChar).Value = obj_locales;
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
 
    }
}
