using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GestionAlmacenCam.Controllers.AlmacenController
{
    public class ProcesosController : Controller
    {
        // GET: Procesos
        public ActionResult IngresoGuias()
        {
            return View();
        }
        public ActionResult IngresoGuiasOrdenCompra()
        {
            return View();
        }
        public ActionResult Transferencias()
        {
            return View();
        }
        public ActionResult IngresoTransferencias()
        {
            return View();
        }
        public ActionResult AprobacionTransferencias()
        {
            return View();
        }
        public ActionResult IngresoFacturas()
        {
            return View();
        }
        public ActionResult transferenciasNew()
        {
            return View();
        }

    }
}