using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using Entidades;
using Negocio.Facturacion.Procesos;
using Negocio.Resultado;

namespace WebApiGestionAlmacenCam.Controllers.Facturacion.Procesos.ArqueoCaja
{
    [EnableCors("*", "*", "*")]
    public class tblArqueoCaja_PagoProveedorController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblArqueoCaja_PagoProveedor
        public IQueryable<tbl_ArqueoCaja_PagoProveedor> Gettbl_ArqueoCaja_PagoProveedor()
        {
            return db.tbl_ArqueoCaja_PagoProveedor;
        }

        // GET: api/tblArqueoCaja_PagoProveedor/5
        [ResponseType(typeof(tbl_ArqueoCaja_PagoProveedor))]
        public IHttpActionResult Gettbl_ArqueoCaja_PagoProveedor(int id)
        {
            tbl_ArqueoCaja_PagoProveedor tbl_ArqueoCaja_PagoProveedor = db.tbl_ArqueoCaja_PagoProveedor.Find(id);
            if (tbl_ArqueoCaja_PagoProveedor == null)
            {
                return NotFound();
            }

            return Ok(tbl_ArqueoCaja_PagoProveedor);
        }

        // PUT: api/tbl_ArqueoCaja_PagoProveedor/5
        [HttpPut]
        [Route("api/tbl_ArqueoCaja_PagoProveedor/Puttbl_ArqueoCaja_PagoProveedor")]
        public object Puttbl_ArqueoCaja_PagoProveedor(int id, tbl_ArqueoCaja_PagoProveedor tbl_ArqueoCaja_PagoProveedor)
        {
            Resul res = new Resul();

            tbl_ArqueoCaja_PagoProveedor objReemplazar;
            objReemplazar = db.tbl_ArqueoCaja_PagoProveedor.Where(u => u.id_ArqueoCaja_Egresos == id).FirstOrDefault<tbl_ArqueoCaja_PagoProveedor>();

            objReemplazar.fecha_Registro = tbl_ArqueoCaja_PagoProveedor.fecha_Registro;
            objReemplazar.id_Anexo_Destino = tbl_ArqueoCaja_PagoProveedor.id_Anexo_Destino;
            objReemplazar.id_CC_Destino = tbl_ArqueoCaja_PagoProveedor.id_CC_Destino;
            objReemplazar.id_MedioPago = tbl_ArqueoCaja_PagoProveedor.id_MedioPago;
            objReemplazar.id_Banco = tbl_ArqueoCaja_PagoProveedor.id_Banco;
            objReemplazar.nroOperario = tbl_ArqueoCaja_PagoProveedor.nroOperario;

            objReemplazar.importe_Deposito = tbl_ArqueoCaja_PagoProveedor.importe_Deposito;
            objReemplazar.idProveedor = tbl_ArqueoCaja_PagoProveedor.idProveedor;
            objReemplazar.documentoReferencia = tbl_ArqueoCaja_PagoProveedor.documentoReferencia;
            objReemplazar.observaciones = tbl_ArqueoCaja_PagoProveedor.observaciones;
            objReemplazar.usuario_edicion = tbl_ArqueoCaja_PagoProveedor.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

            db.Entry(objReemplazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
                res.ok = true;
                res.data = "OK";
            }
            catch (DbUpdateConcurrencyException ex)
            {
                res.ok = false;
                res.data = ex.InnerException.Message;
            }

            return res;
        }

        // POST: api/tbl_ArqueoCaja_PagoProveedor
        [HttpPost]
        [Route("api/tblArqueoCaja_PagoProveedor/Posttbl_ArqueoCaja_PagoProveedor")]
        public object Posttbl_ArqueoCaja_PagoProveedor(tbl_ArqueoCaja_PagoProveedor tbl_ArqueoCaja_PagoProveedor)
        {
            Resul res = new Resul();
            try
            {
                tbl_ArqueoCaja_PagoProveedor.fecha_creacion = DateTime.Now;
                db.tbl_ArqueoCaja_PagoProveedor.Add(tbl_ArqueoCaja_PagoProveedor);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_ArqueoCaja_PagoProveedor.id_ArqueoCaja_Egresos;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        [HttpPost]
        [Route("api/tblArqueoCaja_PagoProveedor/UploadImageVoucherPago")]
        public object UploadImageVoucherPago(int id_ArqueoCajaEgresos, int idUsuario)
        {
            Resul res = new Resul();
            string nombreFile = "";
            string nombreFileServer = "";
            string path = "";
            try
            {
                System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;
                for (int i = 0; i < files.Count; i++)
                {
                    System.Web.HttpPostedFile file = files[i];
                    string extension = System.IO.Path.GetExtension(file.FileName);

                    nombreFile = file.FileName;

                    //-----generando clave unica---
                    var guid = Guid.NewGuid();
                    var guidB = guid.ToString("B");
                    nombreFileServer = idUsuario + "_image_voucher_pago" + Guid.Parse(guidB) + extension;

                    //---almacenando la imagen--
                    path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagenes/" + nombreFileServer);
                    file.SaveAs(path);
                }

                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                    ///----validando que en servidor solo halla una sola foto---
                    tbl_ArqueoCaja_PagoProveedor object_Producto;
                    object_Producto = db.tbl_ArqueoCaja_PagoProveedor.Where(p => p.id_ArqueoCaja_Egresos == id_ArqueoCajaEgresos).FirstOrDefault<tbl_ArqueoCaja_PagoProveedor>();

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    res.ok = true;
                    res.data = obj_negocio.Set_Actualizar_imagenComprobantePago(id_ArqueoCajaEgresos, nombreFile, nombreFileServer);

                    //---si previamente habia una foto, al reemplazarla borramos la anterior
                    if (object_Producto != null)
                    {
                        string urlFotoAntes = object_Producto.nombreServidor;
                        path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagenes/" + urlFotoAntes);

                        if (File.Exists(path))
                        {
                            File.Delete(path);
                        }
                    }
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo guardar el archivo en el servidor..";
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }

            return res;
        }


        // DELETE: api/tblArqueoCaja_PagoProveedor/5
        [ResponseType(typeof(tbl_ArqueoCaja_PagoProveedor))]
        public IHttpActionResult Deletetbl_ArqueoCaja_PagoProveedor(int id)
        {
            tbl_ArqueoCaja_PagoProveedor tbl_ArqueoCaja_PagoProveedor = db.tbl_ArqueoCaja_PagoProveedor.Find(id);
            if (tbl_ArqueoCaja_PagoProveedor == null)
            {
                return NotFound();
            }

            db.tbl_ArqueoCaja_PagoProveedor.Remove(tbl_ArqueoCaja_PagoProveedor);
            db.SaveChanges();

            return Ok(tbl_ArqueoCaja_PagoProveedor);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_ArqueoCaja_PagoProveedorExists(int id)
        {
            return db.tbl_ArqueoCaja_PagoProveedor.Count(e => e.id_ArqueoCaja_Egresos == id) > 0;
        }
    }
}