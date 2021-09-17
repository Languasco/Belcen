using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GestionAlmacenCam.Controllers.FacturacionController
{
    public class ProcesosFacturacionController : Controller
    {
        // GET: Procesoss
        public ActionResult GeneracionDocumentoVenta_Index()
        {
            return View();
        }
        public ActionResult ListaPrecio_index()
        {
            return View();
        }
        public ActionResult CancelacionDocVendedor_index()
        {
            return View();
        }
        public ActionResult GeneracionMasivaDocumentos_Index()
        {
            return View();
        }
        public ActionResult GeneracionMasivaDocumentos_new()
        {
            return View();
        }
        public ActionResult Pedidos_Index()
        {
            return View();
        }
        public ActionResult Pedidos_new()
        {
            return View();
        }
        public ActionResult Pedidos_Directo_Index()
        {
            return View();
        }

        public ActionResult Pedidos_Directo_new()
        {
            return View();
        }

        public ActionResult NotaCreditoDebito_Index()
        {
            return View();
        }

        public ActionResult NotaCreditoDebito_new()
        {
            return View();
        }

        public ActionResult ReenvioDocumentos_Index() { 
            return View();
        }
        public ActionResult ReenvioDocumentos_new()
        {
            return View();
        }
        public ActionResult Pedidos_Aprobacion_Index()
        {
            return View();
        }


        public ActionResult CancelacionMasivaDocumentos_index()
        {
            return View();
        }

        public ActionResult Promociones_index()
        {
            return View();
        }

        public ActionResult RevisionPedidos_index()
        {
            return View();
        }
        public ActionResult ConsolidadoMercaderia_index()
        {
            return View();
        }

        public ActionResult ReimpresionDocumentos_index()
        {
            return View();
        }

        public ActionResult DocumentosManuales_index()
        {
            return View();
        }

        public ActionResult ArqueoCaja_index()
        {
            return View();
        }

        public ActionResult envioSunatNotasCreditoDebito_index()
        {
            return View();
        }

        public ActionResult Pedidos_II()
        {
            return View();
        }
        
        public ActionResult anularNumero_index()
        {
            return View();
        }

    }
    
}