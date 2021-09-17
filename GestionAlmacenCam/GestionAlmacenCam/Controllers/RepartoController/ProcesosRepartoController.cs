using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GestionAlmacenCam.Controllers.RepartoController
{
    public class ProcesosRepartoController : Controller
    {
        public ActionResult EntregaReparto_index()
        {
            return View();
        }
        public ActionResult ExportaPedido_index()
        {
            return View();
        }
        public ActionResult ImportaPedido_index()
        {
            return View();
        }
        public ActionResult AprobarDevolucion_index()
        {
            return View();
        }

        public ActionResult ImportaStockAlmacen_index()
        {
            return View();
        }


        public ActionResult HabilitarUsuario_index()
        {
            return View();
        }

        public ActionResult ImportarPrecio_index()
        {
            return View();
        }


    }
}