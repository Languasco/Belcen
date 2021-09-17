using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GestionAlmacenCam.Controllers.Mantenimiento
{
    public class MantenimientoController : Controller
    {
        // GET: Mantenimiento
        public ActionResult Usuario_index()
        {
            return View();
        }

        public ActionResult Anexos_index()
        {
            return View();
        }

        public ActionResult RutasVentas_index()
        {
            return View();
        }
        public ActionResult ZonasVentas_index()
        {
            return View();
        }

        public ActionResult Bancos_index()
        {
            return View();
        }
    }
}
