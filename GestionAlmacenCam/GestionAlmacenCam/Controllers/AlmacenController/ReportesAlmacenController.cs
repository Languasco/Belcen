using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GestionAlmacenCam.Controllers.AlmacenController
{
    public class ReportesAlmacenController : Controller
    {
        // GET: ReportesAlmacen
        public ActionResult Stock_index()
        {
            return View();
        }
        public ActionResult KardexAlmacen()
        {
            return View();
        }
        public ActionResult consultaTransacciones()
        {
            return View();
        }
        public ActionResult reportePagoProveedores()
        {
            return View();
        }
    }
}