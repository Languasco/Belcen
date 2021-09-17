using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GestionAlmacenCam.Controllers.AdministracionController
{
    public class HomeAdministracionController : Controller
    {
        // GET: Administracion
        public ActionResult HomeAdministracion()
        {
            return View();
        }

        public ActionResult AccesosUsuario()
        {
            return View();
        }

        public ActionResult UsuarioLocal_index()
        {
            return View();
        }
        public ActionResult UsuarioAlmacen_index()
        {
            return View();
        }
    }
}