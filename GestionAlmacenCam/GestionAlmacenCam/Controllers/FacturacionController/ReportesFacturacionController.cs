using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GestionAlmacenCam.Controllers.FacturacionController
{
    public class ReportesFacturacionController : Controller
    {
        // GET: ReportesFacturacion
        public ActionResult PagosVendedor_index()
        {
            return View();
        }

        public ActionResult RegistroVentas_Index()
        {
            return View();
        }
        public ActionResult ResumenVentas_Index()
        {
            return View();
        }

        public ActionResult ReporteContable_Index()
        {
            return View();
        }
        public ActionResult estadoDocumento_index()
        {
            return View();
        }




    }
}