using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GestionAlmacenCam.Controllers.Cobranza
{
    public class CobranzaController : Controller
    {
        // GET: Cobranza
        public ActionResult Cancelacion_masiva()
        {
            return View();
        }
        // GET: Cobranza
        public ActionResult Cancelacion_x_documento()
        {
            return View();
        }
        public ActionResult ReporteCobranza_index()
        {
            return View();
        }
        public ActionResult GeneracionManual_index()
        {
            return View();
        }
        public ActionResult AnularDocumento_index()
        {
            return View();
        }
    }
}