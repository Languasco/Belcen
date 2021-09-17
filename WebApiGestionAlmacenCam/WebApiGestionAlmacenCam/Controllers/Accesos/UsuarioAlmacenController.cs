using Entidades;
using Negocio.Accesos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Accesos
{
        [EnableCors("*", "*", "*")]
    public class UsuarioAlmacenController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetUsuario_Almacenes(int opcion, string filtro)
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
                                 checkeado = false,
                                 c.id_Usuario,
                                 c.apellidos_usuario,
                                 c.nombres_usuario




                             }).ToList();
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int id_usuario = Convert.ToInt32(parametros[0].ToString());

                    UsuarioAlmacen_BL obj_negocio = new UsuarioAlmacen_BL();
                    resul = obj_negocio.Listando_AlmacenesUsuario(id_usuario);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    string obj_user = parametros[0].ToString();
                    string obj_almacen = parametros[1].ToString();
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    UsuarioAlmacen_BL obj_negocio = new UsuarioAlmacen_BL();
                    resul = obj_negocio.set_save_AlmacenesUsuario(obj_user, obj_almacen, id_usuario);
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
