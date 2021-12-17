using Entidades;
using Negocio.Accesos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_Ventas.Controllers.Accesos
{
      [EnableCors("*", "*", "*")]
    public class UsuarioAccesosController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();
        LogInAccess_BL LogInAccess_bl;
        AccesosUsuario_BL AccesosUsuario_bl;

        public object GetOperationsAccess(int option, string filters)
        {
            object result = null;
            db.Configuration.ProxyCreationEnabled = false;
          
            
            string[] arrayFilters = filters.Split('|');
            try
            {

                if (option == 1)
                {  
                    LogInAccess_bl = new LogInAccess_BL();
                    string idUsuario = arrayFilters[0].ToString();
                    string passUsuario = arrayFilters[1].ToString();
                    result = LogInAccess_bl.InitSession(idUsuario, passUsuario);
                }
                else if (option == 2)
                {
                    AccesosUsuario_bl = new AccesosUsuario_BL();
                    result = AccesosUsuario_bl.getAllAccesos();
                }else if(option == 3)
                {
                    // RETORN CUANTOS USUARIOS TIENEN EL PERMISO SELECCIONADO
                    AccesosUsuario_bl = new AccesosUsuario_BL();
                    result = AccesosUsuario_bl.getUsuariosByPermission(Convert.ToInt32(arrayFilters[0]));
                }
                else if (option == 4)
                {
                    int id_usuario = Convert.ToInt32(arrayFilters[0]);
                    int id_opcion = Convert.ToInt32(arrayFilters[1]);
                    string eventos = arrayFilters[2].ToString();
                    AccesosUsuario_bl = new AccesosUsuario_BL();
                    result = AccesosUsuario_bl.SaveAndUpdatePermissonUser(id_usuario,id_opcion,eventos);

                }
                else if (option == 5)
                {
                    int idUsuario = Convert.ToInt32(arrayFilters[0]);
                    int estado = Convert.ToInt32(arrayFilters[1]);

                    LogInAccess_bl = new LogInAccess_BL();
                    result = LogInAccess_bl.set_ActivandoDesactivandoSesion(idUsuario, estado);
                }
                else if (option == 6)
                {
                    string email =  arrayFilters[0].ToString();

                    LogInAccess_bl = new LogInAccess_BL();
                    result = LogInAccess_bl.set_envioCorreo_recuperarContrasenia(email);
                }
            }
            catch (Exception ex)
            {
                return new ObjErrors
                {
                    type = 0,
                    message = ex.Message,
                    exception = ex.InnerException
                };
            }
            return result;

        }
    }
}
