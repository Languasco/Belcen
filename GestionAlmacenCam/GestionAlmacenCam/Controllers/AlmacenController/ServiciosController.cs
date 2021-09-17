using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GestionAlmacenCam.Controllers.AlmacenController
{
    public class ServiciosController : Controller
    {
        public ActionResult Transportista_index()
        {
            return View();
        }
        public ActionResult Vehiculo_index()
        {
            return View();
        }
        public ActionResult locales_index()
        {
            return View();
        }
        public ActionResult Vendedor_index()
        {
            return View();
        }
        public ActionResult Cargo_index ()
        {
            return View();
        }
        public ActionResult FormaPago_index()
        {
            return View();
        }
        public ActionResult GrupoDet_index()
        {
            return View();
        }
    }
}