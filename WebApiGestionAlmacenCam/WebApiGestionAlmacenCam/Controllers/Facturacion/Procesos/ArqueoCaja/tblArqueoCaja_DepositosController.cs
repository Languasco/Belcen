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

namespace WebApi_Ventas.Controllers.Facturacion.Procesos.ArqueoCaja
{
    [EnableCors("*", "*", "*")]
    public class tblArqueoCaja_DepositosController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblArqueoCaja_Depositos
        public IQueryable<tbl_ArqueoCaja_Depositos> Gettbl_ArqueoCaja_Depositos()
        {
            return db.tbl_ArqueoCaja_Depositos;
        }

        // GET: api/tblArqueoCaja_Depositos/5
        [ResponseType(typeof(tbl_ArqueoCaja_Depositos))]
        public IHttpActionResult Gettbl_ArqueoCaja_Depositos(int id)
        {
            tbl_ArqueoCaja_Depositos tbl_ArqueoCaja_Depositos = db.tbl_ArqueoCaja_Depositos.Find(id);
            if (tbl_ArqueoCaja_Depositos == null)
            {
                return NotFound();
            }

            return Ok(tbl_ArqueoCaja_Depositos);
        }

        // PUT: api/tblArqueoCaja_Depositos/5
        [HttpPut]
        [Route("api/tblArqueoCaja_Depositos/Puttbl_ArqueoCaja_Depositos")]
        public object Puttbl_ArqueoCaja_Depositos(int id, tbl_ArqueoCaja_Depositos tbl_ArqueoCaja_Depositos)
        {
            Resul res = new Resul();

            tbl_ArqueoCaja_Depositos objReemplazar;
            objReemplazar = db.tbl_ArqueoCaja_Depositos.Where(u => u.id_ArqueoCaja_Deposito == id).FirstOrDefault<tbl_ArqueoCaja_Depositos>();

            objReemplazar.fecha_Deposito = tbl_ArqueoCaja_Depositos.fecha_Deposito;
            objReemplazar.id_Banco = tbl_ArqueoCaja_Depositos.id_Banco;
            objReemplazar.nroOperario = tbl_ArqueoCaja_Depositos.nroOperario;
            objReemplazar.importe_Deposito = tbl_ArqueoCaja_Depositos.importe_Deposito;
            objReemplazar.observaciones = tbl_ArqueoCaja_Depositos.observaciones;
            objReemplazar.usuario_edicion = tbl_ArqueoCaja_Depositos.usuario_creacion;
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

         // POST: api/tblArqueoCaja_Depositos
        [HttpPost]
        [Route("api/tblArqueoCaja_Depositos/Posttbl_ArqueoCaja_Depositos")]
        public object Posttbl_ArqueoCaja_Depositos(tbl_ArqueoCaja_Depositos tbl_ArqueoCaja_Depositos)
        {
            Resul res = new Resul();
            try
            {
                tbl_ArqueoCaja_Depositos.fecha_creacion = DateTime.Now;
                db.tbl_ArqueoCaja_Depositos.Add(tbl_ArqueoCaja_Depositos);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_ArqueoCaja_Depositos.id_ArqueoCaja_Deposito; 
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        [HttpPost]
        [Route("api/tblArqueoCaja_Depositos/UploadImageVoucherDeposito")]
        public object UploadImageVoucherDeposito(int idArqueoCaja_Deposito, int idUsuario)
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
                    nombreFileServer = idUsuario + "_image_voucher_deposito" + Guid.Parse(guidB) + extension;

                    //---almacenando la imagen--
                    path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagenes/" + nombreFileServer);
                    file.SaveAs(path);
                }

                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                    ///----validando que en servidor solo halla una sola foto---
                    tbl_ArqueoCaja_Depositos object_Producto;
                    object_Producto = db.tbl_ArqueoCaja_Depositos.Where(p => p.id_ArqueoCaja_Deposito == idArqueoCaja_Deposito).FirstOrDefault<tbl_ArqueoCaja_Depositos>();

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    res.ok = true;
                    res.data = obj_negocio.Set_Actualizar_imagenComprobanteDeposito(idArqueoCaja_Deposito, nombreFile, nombreFileServer);

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



        // DELETE: api/tblArqueoCaja_Depositos/5
        [ResponseType(typeof(tbl_ArqueoCaja_Depositos))]
        public IHttpActionResult Deletetbl_ArqueoCaja_Depositos(int id)
        {
            tbl_ArqueoCaja_Depositos tbl_ArqueoCaja_Depositos = db.tbl_ArqueoCaja_Depositos.Find(id);
            if (tbl_ArqueoCaja_Depositos == null)
            {
                return NotFound();
            }

            db.tbl_ArqueoCaja_Depositos.Remove(tbl_ArqueoCaja_Depositos);
            db.SaveChanges();

            return Ok(tbl_ArqueoCaja_Depositos);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_ArqueoCaja_DepositosExists(int id)
        {
            return db.tbl_ArqueoCaja_Depositos.Count(e => e.id_ArqueoCaja_Deposito == id) > 0;
        }
    }
}