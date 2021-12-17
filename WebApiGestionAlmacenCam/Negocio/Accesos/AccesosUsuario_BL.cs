using Entidades;
using Negocio.Conexion;
using Negocio.Resultado;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Accesos
{
    public class AccesosUsuario_BL
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object getAllAccesos()
        {
            db.Configuration.ProxyCreationEnabled = false;

            var Parents = new string[] { "1", "2","3", "75" };
            contentDataUsuario objCOntentDataUsuario = new contentDataUsuario();
            List<listJsonPermisos> newListaJson = new List<listJsonPermisos>();

            try
            {

                var listaAnt = (from od in db.tbl_Definicion_Opciones
                             orderby od.parentID ascending
                             where od.estado == 1 && Parents.Contains(od.parentID.ToString())  
                             select new listJsonPermisos
                             {
                                 id_opcion = od.id_Opcion,
                                 page_principal = od.nombre_opcion.ToLower(),
                                 parent_id = od.parentID,
                                 url = od.urlImagen_Opcion,
                                 modulo = od.nombreParentID
                             }).Distinct().ToList();

                var lista  = listaAnt.OrderByDescending(s => s.parent_id).ToList();


                listJsonPermisos listaJsonObj = null;
                foreach (var item in lista)
                {
                    listaJsonObj = new listJsonPermisos();

                    listaJsonObj.modulo = item.modulo;
                    listaJsonObj.id_opcion = item.id_opcion;
                    listaJsonObj.id_usuarios = item.id_usuarios;
                    listaJsonObj.url = item.url;
                    listaJsonObj.parent_id = item.parent_id;
                    listaJsonObj.page_principal = item.page_principal;
                    listaJsonObj.listWeb = (from od in db.tbl_Definicion_Opciones                                            
                                            where od.parentID == item.id_opcion && od.estado == 1
                                            select new listaWebs
                                            {
                                                modulo = item.modulo,
                                                nombre_page = od.nombre_opcion.ToLower(),
                                                url_page = od.url_opcion,
                                                orden = od.orden_Opcion,
                                                id_opcion = od.id_Opcion                                                

                                            })
                                    .Distinct()
                                    .ToList();
                    newListaJson.Add(listaJsonObj);
                }
                
                objCOntentDataUsuario.listPermisos = newListaJson.ToList();

            }
            catch (Exception ex)
            {
                return new ObjErrors
                {
                    type = 1,
                    message = ex.Message,
                    exception = ex.InnerException
                };
            }
            return objCOntentDataUsuario;
        }
        
        public object getUsuariosByPermission(int idOpcion)
        {
            db.Configuration.ProxyCreationEnabled = false;
            var listUsuarios = (from ac in db.tbl_Web_Aceesos
                                join de in db.tbl_Definicion_Opciones on ac.id_Opcion equals de.id_Opcion
                                where de.id_Opcion == idOpcion
                                select new {
                                    ac.id_Usuario,
                                    ac.id_Opcion,
                                    de.nombre_opcion,
                                    de.nombreParentID,
                                    ac.eventos
                                }).Distinct();

            return listUsuarios;
        }
        
        public object SaveAndUpdatePermissonUser(int id_usuario, int id_opcion, string eventos)
        {

            using (SqlConnection cnDB = new SqlConnection(bdConexion.cadenaBDcx()))
            {
                cnDB.Open();
                SqlCommand cmd = new SqlCommand("SP_GUARDAR_PERMISO_USUARIO", cnDB);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@id_opcion", SqlDbType.Int).Value = id_opcion;
                cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                cmd.Parameters.Add("@eventos", SqlDbType.VarChar, 50).Value = eventos;

                return cmd.ExecuteNonQuery();
            }

        }
        
        public object get_usuarios(string buscar,int acceso, int estado)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_W_USUARIOS_V2", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@buscar", SqlDbType.VarChar).Value = buscar;
                        cmd.Parameters.Add("@acceso", SqlDbType.Int).Value = acceso;
                        cmd.Parameters.Add("@estado", SqlDbType.Int).Value = estado;

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

        public object get_auditoria( int id_usuario, int id_usuario_edicion)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_AUDITORIAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.Parameters.Add("@id_usuario_edicion", SqlDbType.Int).Value = id_usuario_edicion;

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
