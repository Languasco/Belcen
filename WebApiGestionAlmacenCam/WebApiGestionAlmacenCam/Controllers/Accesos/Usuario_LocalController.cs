using Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using Negocio.Accesos;

namespace WebApiGestionAlmacenCam.Controllers.Accesos
{
    [EnableCors("*", "*", "*")]
    public class Usuario_LocalController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetUsuario_Locales(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    resul = (from c in db.tbl_Usuarios 
                             where c.estado == 1
                             select new
                             {
                                 checkeado =false,
                                 c.id_Usuario,
                                 c.apellidos_usuario,
                                 c.nombres_usuario,

                             }).ToList();
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int id_usuario = Convert.ToInt32(parametros[0].ToString()); 

                    UsuarioLocal_BL obj_negocio = new UsuarioLocal_BL();
                    resul = obj_negocio.Listando_LocalesUsuario(id_usuario);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    string  obj_user = parametros[0].ToString();
                    string obj_locales = parametros[1].ToString();
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    UsuarioLocal_BL obj_negocio = new UsuarioLocal_BL();
                    resul = obj_negocio.set_save_LocalesUsuario(obj_user, obj_locales, id_usuario);
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

    }
}
