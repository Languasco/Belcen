using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Entidades;
using System.Web.Http.Cors;
using System.Threading.Tasks;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Mantenimientos
{
        [EnableCors("*", "*", "*")]
    public class tblCom_PuntoVentaController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblCom_PuntoVenta
        public object Gettbl_Com_PuntoVenta()
        {
            db.Configuration.ProxyCreationEnabled = false;
            var list = (from pv in db.tbl_Com_PuntoVenta
                        join em in db.tbl_Empresas on pv.id_Empresa equals em.id_Empresa
                        select new
                        {
                            em.nombre_Empresa,
                            em.direccion_Empresa,
                            pv.id_PuntoVenta,
                            pv.id_Empresa,
                            pv.direccion_PuntoVenta,
                            pv.descripcion_PuntoVenta,
                            pv.estado,
                            pv.usuario_Creacion,
                            pv.usuario_Edicion,
                            pv.fecha_Creacion,
                            pv.fecha_Edicion

                        }).ToList();


            return list;
        }

        // GET: api/tblCom_PuntoVenta/5
        [ResponseType(typeof(tbl_Com_PuntoVenta))]
        public IHttpActionResult Gettbl_Com_PuntoVenta(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            tbl_Com_PuntoVenta tbl_Com_PuntoVenta = db.tbl_Com_PuntoVenta.Find(id);
            if (tbl_Com_PuntoVenta == null)
            {
                return NotFound();
            }

            return Ok(tbl_Com_PuntoVenta);
        }

        // PUT: api/tblCom_PuntoVenta/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Com_PuntoVenta(int id, tbl_Com_PuntoVenta object_Ent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != object_Ent.id_PuntoVenta)
            {
                return BadRequest();
            }

            tbl_Com_PuntoVenta object_puntoVentaR;
            object_puntoVentaR = db.tbl_Com_PuntoVenta.Where(pv => pv.id_PuntoVenta == object_Ent.id_PuntoVenta).FirstOrDefault<tbl_Com_PuntoVenta>();
            object_puntoVentaR.id_PuntoVenta = object_Ent.id_PuntoVenta;
            object_puntoVentaR.id_Empresa = object_Ent.id_Empresa;
            object_puntoVentaR.direccion_PuntoVenta = object_Ent.direccion_PuntoVenta;
            object_puntoVentaR.descripcion_PuntoVenta = object_Ent.descripcion_PuntoVenta;
            object_puntoVentaR.estado = object_Ent.estado;
            object_puntoVentaR.usuario_Edicion = object_Ent.usuario_Creacion;
            object_puntoVentaR.fecha_Edicion = DateTime.Now;


            db.Entry(object_puntoVentaR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Com_PuntoVentaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Ok");
        }

        // POST: api/tblCom_PuntoVenta
        [ResponseType(typeof(tbl_Com_PuntoVenta))]
        public IHttpActionResult Posttbl_Com_PuntoVenta(tbl_Com_PuntoVenta tbl_Com_PuntoVenta)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_Com_PuntoVenta.fecha_Creacion = DateTime.Now;

            db.tbl_Com_PuntoVenta.Add(tbl_Com_PuntoVenta);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Com_PuntoVenta.id_PuntoVenta }, tbl_Com_PuntoVenta);
        }

        // DELETE: api/tblCom_PuntoVenta/5
        [ResponseType(typeof(tbl_Com_PuntoVenta))]
        public async Task<IHttpActionResult> Deletetbl_Com_PuntoVenta(int id)
        {
            tbl_Com_PuntoVenta objct = await db.tbl_Com_PuntoVenta.FindAsync(id);

            objct = db.tbl_Com_PuntoVenta.Where(pv => pv.id_PuntoVenta == id).FirstOrDefault<tbl_Com_PuntoVenta>();
            objct.estado = 0;
            db.Entry(objct).State = System.Data.Entity.EntityState.Modified;
           await db.SaveChangesAsync();

            return Ok("Ok");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Com_PuntoVentaExists(int id)
        {
            return db.tbl_Com_PuntoVenta.Count(e => e.id_PuntoVenta == id) > 0;
        }
    }
}