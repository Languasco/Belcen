using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GestionAlmacenCam.Controllers.RepartoController
{
    public class ReportesRepartoController : Controller
    {
        // GET: ReportesReparto
        public ActionResult reporteCobertura_index()
        {
            return View();
        }
        public ActionResult reporteKpi_index()
        {
            return View();
        }

        public ActionResult reporteStock_index()
        {
            return View();
        }

        
    }
}