using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entidades;
using Negocio.Conexion;

namespace Negocio.Accesos
{


    public class LogInAccess_BL
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();



        public class Resultado
        {
            public bool ok { get; set; }
            public object data { get; set; }
        }


        public object InitSession(string idUsuario, string passUsuario)
        {
            db.Configuration.ProxyCreationEnabled = false;
            var Parents = new string[] { "1", "2", "3", "75" };
            contentDataUsuario objCOntentDataUsuario = new contentDataUsuario();
            List<listJsonPermisos> newListaJson = new List<listJsonPermisos>();

            Resultado res = new Resultado();

            try
            {
                tbl_Usuarios objDataUsuario = db.tbl_Usuarios.Where(p => p.login_usuario == idUsuario && p.contrasenia_usuario == passUsuario ).SingleOrDefault();
                if (objDataUsuario == null)
                {
                    res.ok = false;
                    res.data = "El Usuario y/o contraseña incorrecto, verifique";
                }
                else {
                    if (objDataUsuario.estado == 0)
                    {
                        res.ok = false;
                        res.data = "El usuario no se encuentra Activo..";
                    }
                    else {
                        if (objDataUsuario.flag_conectado == 1)
                        {
                            res.ok = false;
                            res.data = "El Usuario se encuentra en Linea, no puede ingresar, verifique..";
                        }
                        else {

                            var lista = (from w in db.tbl_Web_Aceesos
                                         join od in db.tbl_Definicion_Opciones on w.id_Opcion equals od.id_Opcion
                                         join u in db.tbl_Usuarios on w.id_Usuario equals u.id_Usuario
                                         where u.id_Usuario == objDataUsuario.id_Usuario && Parents.Contains(od.parentID.ToString()) && od.estado == 1
                                         //where u.id_Usuario == objDataUsuario.id_Usuario && od.estado == 1
                                         select new listJsonPermisos
                                         {
                                             id_opcion = w.id_Opcion,
                                             id_usuarios = w.id_Usuario,
                                             page_principal = od.nombre_opcion,
                                             parent_id = od.parentID,
                                             url = od.urlImagen_Opcion
                                         }).Distinct();

                            listJsonPermisos listaJsonObj = null;
                            foreach (var item in lista)
                            {
                                listaJsonObj = new listJsonPermisos();
                                listaJsonObj.id_opcion = item.id_opcion;
                                listaJsonObj.id_usuarios = item.id_usuarios;
                                listaJsonObj.url = item.url;
                                listaJsonObj.parent_id = item.parent_id;
                                listaJsonObj.page_principal = item.page_principal;
                                listaJsonObj.listWeb = (from w in db.tbl_Web_Aceesos
                                                        join od in db.tbl_Definicion_Opciones on w.id_Opcion equals od.id_Opcion
                                                        join u in db.tbl_Usuarios on w.id_Usuario equals u.id_Usuario
                                                        where u.id_Usuario == objDataUsuario.id_Usuario && od.parentID == item.id_opcion && od.estado == 1
                                                        select new listaWebs
                                                        {
                                                            nombre_page = od.nombre_opcion,
                                                            url_page = od.url_opcion,
                                                            orden = od.orden_Opcion
                                                        })
                                                .Distinct()
                                                .ToList();

                                newListaJson.Add(listaJsonObj);
                            }
                            // LLENAMOS EL OBJETO QUE RETORNARA LA LISTA DE PERMISOS Y LA INFORMACIÓN DEL USUARIO LOGEADO

                            objCOntentDataUsuario.dataUsuario = objDataUsuario;
                            objCOntentDataUsuario.listPermisos = newListaJson.ToList();

                            res.ok = true;
                            res.data = objCOntentDataUsuario;
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

        public string set_ActivandoDesactivandoSesion(int idUsuario, int estado)
        {
            string Resultado = null;
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_SESION_USUARIO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@estado", SqlDbType.Int).Value = estado;
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



    }
}
