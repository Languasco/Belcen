using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Entidades;
using System.Web.Http.Cors;
using Negocio.Accesos;
using System.Data.SqlClient;
using Negocio.Conexion;
using static Negocio.Accesos.LogInAccess_BL;
using Entidades.Mantenimiento.usuarios;
using Negocio.Resultado;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Mantenimientos
{
     [EnableCors("*", "*", "*")]
    public class tblUsuariosController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblUsuarios
        public IQueryable<tbl_Usuarios> Gettbl_Usuarios()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Usuarios.Where( u=> u.estado == 1);
        }


        public object GetUsuarios(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul;
            try
            {
                if (opcion == 1)
                {
                    AccesosUsuario_BL obj_negocio = new AccesosUsuario_BL();
                    resul = obj_negocio.get_usuarios("", 1, 1);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');

                    string buscar = parametros[0].ToString();
                    int acceso = Convert.ToInt32(parametros[1].ToString());
                    int estado = Convert.ToInt32(parametros[2].ToString());

                    AccesosUsuario_BL obj_negocio = new AccesosUsuario_BL();
                    resul = obj_negocio.get_usuarios(buscar, acceso, estado);
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

        [HttpPost]
        [ResponseType(typeof(Usuario))]
        public object Posttbl_Usuarios(Usuario obj)
        {
            Resul res = new Resul();
            SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx());
            SqlCommand cmd = new SqlCommand();

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "PROC_W_USUARIOS_V2_AGREGAR";
            cmd.Parameters.Add("@nro_doc", SqlDbType.VarChar).Value = obj.nro_doc;
            cmd.Parameters.Add("@tipo_doc", SqlDbType.VarChar).Value = obj.tipo_doc;
            cmd.Parameters.Add("@apellidos", SqlDbType.VarChar).Value = obj.apellidos;
            cmd.Parameters.Add("@nombres", SqlDbType.VarChar).Value = obj.nombres;
            cmd.Parameters.Add("@email", SqlDbType.VarChar).Value = obj.email;
            cmd.Parameters.Add("@nro_celular", SqlDbType.VarChar).Value = obj.nro_celular;
            cmd.Parameters.Add("@adm", SqlDbType.VarChar).Value = obj.adm;
            cmd.Parameters.Add("@sys", SqlDbType.VarChar).Value = obj.sys;
            cmd.Parameters.Add("@id_cargo", SqlDbType.Int).Value = obj.id_cargo;
            cmd.Parameters.Add("@id_area", SqlDbType.Int).Value = obj.id_area;
            cmd.Parameters.Add("@tipo", SqlDbType.VarChar).Value = obj.tipo;
            cmd.Parameters.Add("@id_empresa_pertenece", SqlDbType.Int).Value = obj.id_empresa_pertenece;
            cmd.Parameters.Add("@fotourl", SqlDbType.VarChar).Value = obj.fotourl;
            cmd.Parameters.Add("@acceso_web", SqlDbType.VarChar).Value = obj.acceso_web;
            cmd.Parameters.Add("@acceso_movil", SqlDbType.VarChar).Value = obj.acceso_movil;
            cmd.Parameters.Add("@login_usuario", SqlDbType.VarChar).Value = obj.login_usuario;
            cmd.Parameters.Add("@contrasenia_usuario", SqlDbType.VarChar).Value = obj.contrasenia_usuario;
            cmd.Parameters.Add("@id_perfil", SqlDbType.Int).Value = obj.id_perfil;
            cmd.Parameters.Add("@fecha_cese", SqlDbType.VarChar).Value = obj.fecha_cese;
            cmd.Parameters.Add("@estado", SqlDbType.Int).Value = obj.estado;
            cmd.Parameters.Add("@usuario_creacion", SqlDbType.Int).Value = obj.usuario_creacion;
            cmd.Parameters.Add("@codigo", SqlDbType.VarChar).Value = obj.codigo;
            cmd.Parameters.Add("@envio_en_linea", SqlDbType.VarChar).Value = obj.envio_en_linea;
            cmd.Parameters.Add("@acceso_movil_tipo", SqlDbType.VarChar).Value = "S";
            cmd.Connection = cn;
            try
            {
                cn.Open();
                cmd.ExecuteNonQuery();

                res.ok = true;
                res.data = obj.nro_doc;

            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            finally
            {
                cn.Close();
                cn.Dispose();
            }
            return res;
        }


        [HttpPost]
        [Route("api/tblUsuarios/actualizar")]
        [ResponseType(typeof(Usuario))]
        public object Puttbl_Usuarios(Usuario obj)
        {
            Resul res = new Resul();
            SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx());
            SqlCommand cmd = new SqlCommand();

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "PROC_W_USUARIOS_V2_ACTUALIZAR";

            cmd.Parameters.Add("@id_Usuario", SqlDbType.Int).Value = obj.id_Usuario;
            cmd.Parameters.Add("@nro_doc", SqlDbType.VarChar).Value = obj.nro_doc;
            cmd.Parameters.Add("@tipo_doc", SqlDbType.VarChar).Value = obj.tipo_doc;
            cmd.Parameters.Add("@apellidos", SqlDbType.VarChar).Value = obj.apellidos;
            cmd.Parameters.Add("@nombres", SqlDbType.VarChar).Value = obj.nombres;
            cmd.Parameters.Add("@email", SqlDbType.VarChar).Value = obj.email;
            cmd.Parameters.Add("@nro_celular", SqlDbType.VarChar).Value = obj.nro_celular;
            cmd.Parameters.Add("@adm", SqlDbType.VarChar).Value = obj.adm;
            cmd.Parameters.Add("@sys", SqlDbType.VarChar).Value = obj.sys;
            cmd.Parameters.Add("@id_cargo", SqlDbType.Int).Value = obj.id_cargo;
            cmd.Parameters.Add("@id_area", SqlDbType.Int).Value = obj.id_area;
            cmd.Parameters.Add("@tipo", SqlDbType.VarChar).Value = obj.tipo;
            cmd.Parameters.Add("@id_empresa_pertenece", SqlDbType.Int).Value = obj.id_empresa_pertenece;
            cmd.Parameters.Add("@fotourl", SqlDbType.VarChar).Value = obj.fotourl;
            cmd.Parameters.Add("@acceso_web", SqlDbType.VarChar).Value = obj.acceso_web;
            cmd.Parameters.Add("@acceso_movil", SqlDbType.VarChar).Value = obj.acceso_movil;
            cmd.Parameters.Add("@login_usuario", SqlDbType.VarChar).Value = obj.login_usuario;
            cmd.Parameters.Add("@contrasenia_usuario", SqlDbType.VarChar).Value = obj.contrasenia_usuario;
            cmd.Parameters.Add("@id_perfil", SqlDbType.Int).Value = obj.id_perfil;
            cmd.Parameters.Add("@fecha_cese", SqlDbType.VarChar).Value = obj.fecha_cese;
            cmd.Parameters.Add("@estado", SqlDbType.Int).Value = obj.estado;
            cmd.Parameters.Add("@usuario_edicion", SqlDbType.Int).Value = obj.usuario_edicion;
            cmd.Parameters.Add("@codigo", SqlDbType.VarChar).Value = obj.codigo;
            cmd.Parameters.Add("@envio_en_linea", SqlDbType.VarChar).Value = obj.envio_en_linea;
            cmd.Connection = cn;
            try
            {
                cn.Open();
                cmd.ExecuteNonQuery();

                res.ok = true;
                res.data = "OK";

            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            finally
            {
                cn.Close();
                cn.Dispose();
            }
            return res;
        }

        [HttpDelete]
        public object Deletetbl_Usuarios(string nro_doc, int userId, int idRegistro, string tipoAcceso)
        {
            Resul res = new Resul();
            SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx());
            SqlCommand cmd = new SqlCommand();

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "PROC_W_USUARIOS_V2_ANULAR";
            //cmd.Parameters.Add("@nro_doc", SqlDbType.VarChar).Value = nro_doc;
            cmd.Parameters.Add("@usuario_edicion", SqlDbType.Int).Value = userId;
            cmd.Parameters.Add("@idRegistro", SqlDbType.Int).Value = idRegistro;
            cmd.Parameters.Add("@tipoAcceso", SqlDbType.VarChar).Value = tipoAcceso;

            cmd.Connection = cn;
            try
            {
                cn.Open();
                cmd.ExecuteNonQuery();

                res.ok = true;
                res.data = "OK";

            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            finally
            {
                cn.Close();
                cn.Dispose();
            }
            return res;
        }
    }
}