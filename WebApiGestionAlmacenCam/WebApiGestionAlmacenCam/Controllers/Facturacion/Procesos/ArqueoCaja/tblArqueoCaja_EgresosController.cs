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
    public class tblArqueoCaja_EgresosController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tbl_ArqueoCaja_Egresos
        public IQueryable<tbl_ArqueoCaja_Egresos> Gettbl_ArqueoCaja_Egresos()
        {
            return db.tbl_ArqueoCaja_Egresos;
        }

        // GET: api/tbl_ArqueoCaja_Egresos/5
        [ResponseType(typeof(tbl_ArqueoCaja_Egresos))]
        public IHttpActionResult Gettbl_ArqueoCaja_Egresos(int id)
        {
            tbl_ArqueoCaja_Egresos tbl_ArqueoCaja_Egresos = db.tbl_ArqueoCaja_Egresos.Find(id);
            if (tbl_ArqueoCaja_Egresos == null)
            {
                return NotFound();
            }

            return Ok(tbl_ArqueoCaja_Egresos);
        }

        // PUT: api/tbl_ArqueoCaja_Egresos/5
        [HttpPut]
        [Route("api/tbl_ArqueoCaja_Egresos/Puttbl_ArqueoCaja_Egresos")]
        public object Puttbl_ArqueoCaja_Egresos(int id, tbl_ArqueoCaja_Egresos tbl_ArqueoCaja_Egresos)
        {
            Resul res = new Resul();

            tbl_ArqueoCaja_Egresos objReemplazar;
            objReemplazar = db.tbl_ArqueoCaja_Egresos.Where(u => u.id_ArqueoCaja_Egresos == id).FirstOrDefault<tbl_ArqueoCaja_Egresos>();

            objReemplazar.id_TipoEgreso = tbl_ArqueoCaja_Egresos.id_TipoEgreso;
            objReemplazar.id_ZonaEgreso = tbl_ArqueoCaja_Egresos.id_ZonaEgreso;

            objReemplazar.fecha_Registro = tbl_ArqueoCaja_Egresos.fecha_Registro;
            objReemplazar.id_Anexo_Destino = tbl_ArqueoCaja_Egresos.id_Anexo_Destino;
            objReemplazar.id_CC_Destino = tbl_ArqueoCaja_Egresos.id_CC_Destino;

            objReemplazar.id_TipoDocumento = tbl_ArqueoCaja_Egresos.id_TipoDocumento;
            objReemplazar.serieDocumento = tbl_ArqueoCaja_Egresos.serieDocumento;
            objReemplazar.numeroDocumento = tbl_ArqueoCaja_Egresos.numeroDocumento;

            objReemplazar.rucProveedor = tbl_ArqueoCaja_Egresos.rucProveedor;
            objReemplazar.razonsocialProveedor = tbl_ArqueoCaja_Egresos.razonsocialProveedor;
            objReemplazar.importe_Egreso = tbl_ArqueoCaja_Egresos.importe_Egreso;
            objReemplazar.descripcionEgreso = tbl_ArqueoCaja_Egresos.descripcionEgreso;

            objReemplazar.id_TipoDocumento2 = tbl_ArqueoCaja_Egresos.id_TipoDocumento2;
            objReemplazar.observacionesEgreso = tbl_ArqueoCaja_Egresos.observacionesEgreso;

            objReemplazar.usuario_edicion = tbl_ArqueoCaja_Egresos.usuario_creacion;
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

        // POST: api/tbl_ArqueoCaja_Egresos
        [HttpPost]
        [Route("api/tbl_ArqueoCaja_Egresos/Posttbl_ArqueoCaja_Egresos")]
        public object Posttbl_ArqueoCaja_Egresos(tbl_ArqueoCaja_Egresos tbl_ArqueoCaja_Egresos)
        {
            Resul res = new Resul();
            try
            {
                tbl_ArqueoCaja_Egresos.fecha_creacion = DateTime.Now;
                db.tbl_ArqueoCaja_Egresos.Add(tbl_ArqueoCaja_Egresos);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_ArqueoCaja_Egresos.id_ArqueoCaja_Egresos;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        [HttpPost]
        [Route("api/tbl_ArqueoCaja_Egresos/UploadImageVoucherEgresos")]
        public object UploadImageVoucherEgresos(int id_ArqueoCaja_Egresos, int idUsuario)
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
                    nombreFileServer = idUsuario + "_image_voucher_egresos" + Guid.Parse(guidB) + extension;

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
                    objectArqueo = db.tbl_ArqueoCaja_Egresos.Where(p => p.id_ArqueoCaja_Egresos == id_ArqueoCaja_Egresos).FirstOrDefault<tbl_ArqueoCaja_Egresos>();

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    res.ok = true;
                    res.data = obj_negocio.Set_Actualizar_imagenComprobanteEgreso(id_ArqueoCaja_Egresos, nombreFile, nombreFileServer);

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



        // DELETE: api/tbl_ArqueoCaja_Egresos/5
        [ResponseType(typeof(tbl_ArqueoCaja_Egresos))]
        public IHttpActionResult Deletetbl_ArqueoCaja_Egresos(int id)
        {
            tbl_ArqueoCaja_Egresos tbl_ArqueoCaja_Egresos = db.tbl_ArqueoCaja_Egresos.Find(id);
            if (tbl_ArqueoCaja_Egresos == null)
            {
                return NotFound();
            }

            db.tbl_ArqueoCaja_Egresos.Remove(tbl_ArqueoCaja_Egresos);
            db.SaveChanges();

            return Ok(tbl_ArqueoCaja_Egresos);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_ArqueoCaja_EgresosExists(int id)
        {
            return db.tbl_ArqueoCaja_Egresos.Count(e => e.id_ArqueoCaja_Egresos == id) > 0;
        }
    }
}