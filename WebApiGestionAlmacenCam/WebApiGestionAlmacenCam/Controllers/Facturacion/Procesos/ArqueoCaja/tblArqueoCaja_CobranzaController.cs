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
    public class tblArqueoCaja_CobranzaController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblArqueoCaja_Cobranza
        public IQueryable<tbl_ArqueoCaja_Cobranza> Gettbl_ArqueoCaja_Cobranza()
        {
            return db.tbl_ArqueoCaja_Cobranza;
        }

        // GET: api/tblArqueoCaja_Cobranza/5
        [ResponseType(typeof(tbl_ArqueoCaja_Cobranza))]
        public IHttpActionResult Gettbl_ArqueoCaja_Cobranza(int id)
        {
            tbl_ArqueoCaja_Cobranza tbl_ArqueoCaja_Cobranza = db.tbl_ArqueoCaja_Cobranza.Find(id);
            if (tbl_ArqueoCaja_Cobranza == null)
            {
                return NotFound();
            }

            return Ok(tbl_ArqueoCaja_Cobranza);
        }

        // PUT: api/tbl_ArqueoCaja_Cobranza/5
        [HttpPut]
        [Route("api/tbl_ArqueoCaja_Cobranza/Puttbl_ArqueoCaja_Cobranza")]
        public object Puttbl_ArqueoCaja_Cobranza(int id, tbl_ArqueoCaja_Cobranza tbl_ArqueoCaja_Cobranza)
        {
            Resul res = new Resul();

            tbl_ArqueoCaja_Cobranza objReemplazar;
            objReemplazar = db.tbl_ArqueoCaja_Cobranza.Where(u => u.id_ArqueoCaja_Cobranza == id).FirstOrDefault<tbl_ArqueoCaja_Cobranza>();

            objReemplazar.id_zona = tbl_ArqueoCaja_Cobranza.id_zona;
            objReemplazar.fecha_cobranza = tbl_ArqueoCaja_Cobranza.fecha_cobranza;
            objReemplazar.id_Factura_Cab = tbl_ArqueoCaja_Cobranza.id_Factura_Cab;
            objReemplazar.id_TipoDocumento = tbl_ArqueoCaja_Cobranza.id_TipoDocumento;

            objReemplazar.serie_Documento = tbl_ArqueoCaja_Cobranza.serie_Documento;
            objReemplazar.numero_Documento = tbl_ArqueoCaja_Cobranza.numero_Documento;
            objReemplazar.importe_Documento = tbl_ArqueoCaja_Cobranza.importe_Documento;

            objReemplazar.cliente_Documento = tbl_ArqueoCaja_Cobranza.cliente_Documento;
            objReemplazar.id_MedidoPago = tbl_ArqueoCaja_Cobranza.id_MedidoPago;
            objReemplazar.id_Banco = tbl_ArqueoCaja_Cobranza.id_Banco;
            objReemplazar.nro_operacionBanco = tbl_ArqueoCaja_Cobranza.nro_operacionBanco;

            objReemplazar.importePago = tbl_ArqueoCaja_Cobranza.importePago;
            objReemplazar.observaciones = tbl_ArqueoCaja_Cobranza.observaciones;

            objReemplazar.usuario_edicion = tbl_ArqueoCaja_Cobranza.usuario_creacion;
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

        // POST: api/tbl_ArqueoCaja_Cobranza
        [HttpPost]
        [Route("api/tbl_ArqueoCaja_Cobranza/Posttbl_ArqueoCaja_Cobranza")]
        public object Posttbl_ArqueoCaja_Cobranza(tbl_ArqueoCaja_Cobranza tbl_ArqueoCaja_Cobranza)
        {
            Resul res = new Resul();
            try
            {
                tbl_ArqueoCaja_Cobranza.fecha_creacion = DateTime.Now;
                db.tbl_ArqueoCaja_Cobranza.Add(tbl_ArqueoCaja_Cobranza);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_ArqueoCaja_Cobranza.id_ArqueoCaja_Cobranza;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }


        [HttpPost]
        [Route("api/tbl_ArqueoCaja_Cobranza/UploadImageVoucherCobranza")]
        public object UploadImageVoucherCobranza(int id_ArqueoCaja_Cobranza, int idUsuario)
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
                    nombreFileServer = idUsuario + "_image_voucher_cobranza" + Guid.Parse(guidB) + extension;

                    //---almacenando la imagen--
                    path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagenes/" + nombreFileServer);
                    file.SaveAs(path);
                }

                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                    ///----validando que en servidor solo halla una sola foto---
                    tbl_ArqueoCaja_Egresos objectArqueo;
                    objectArqueo = db.tbl_ArqueoCaja_Egresos.Where(p => p.id_ArqueoCaja_Egresos == id_ArqueoCaja_Cobranza).FirstOrDefault<tbl_ArqueoCaja_Egresos>();

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    res.ok = true;
                    res.data = obj_negocio.Set_Actualizar_imagenComprobanteCobranza(id_ArqueoCaja_Cobranza, nombreFile, nombreFileServer);

                    //---si previamente habia una foto, al reemplazarla borramos la anterior
                    if (objectArqueo != null)
                    {
                        string urlFotoAntes = objectArqueo.nombreServidor;
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




        // DELETE: api/tblArqueoCaja_Cobranza/5
        [ResponseType(typeof(tbl_ArqueoCaja_Cobranza))]
        public IHttpActionResult Deletetbl_ArqueoCaja_Cobranza(int id)
        {
            tbl_ArqueoCaja_Cobranza tbl_ArqueoCaja_Cobranza = db.tbl_ArqueoCaja_Cobranza.Find(id);
            if (tbl_ArqueoCaja_Cobranza == null)
            {
                return NotFound();
            }

            db.tbl_ArqueoCaja_Cobranza.Remove(tbl_ArqueoCaja_Cobranza);
            db.SaveChanges();

            return Ok(tbl_ArqueoCaja_Cobranza);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_ArqueoCaja_CobranzaExists(int id)
        {
            return db.tbl_ArqueoCaja_Cobranza.Count(e => e.id_ArqueoCaja_Cobranza == id) > 0;
        }
    }
}