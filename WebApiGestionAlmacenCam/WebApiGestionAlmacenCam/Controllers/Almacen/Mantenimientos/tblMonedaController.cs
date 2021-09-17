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

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Mantenimientos
{
     [EnableCors("*", "*", "*")]
    public class tblMonedaController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblMoneda
        public IQueryable<tbl_Moneda> Gettbl_Moneda()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Moneda.Where(m=> m.estado==1);
        }

        // GET: api/tblMoneda/5
        [ResponseType(typeof(tbl_Moneda))]
        public IHttpActionResult Gettbl_Moneda(int id)
        {
            tbl_Moneda tbl_Moneda = db.tbl_Moneda.Find(id);
            if (tbl_Moneda == null)
            {
                return NotFound();
            }

            return Ok(tbl_Moneda);
        }

        // PUT: api/tblMoneda/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Moneda(int id, tbl_Moneda tbl_Moneda)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Moneda.id_Moneda)
            {
                return BadRequest();
            }

            db.Entry(tbl_Moneda).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_MonedaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/tblMoneda
        [ResponseType(typeof(tbl_Moneda))]
        public IHttpActionResult Posttbl_Moneda(tbl_Moneda tbl_Moneda)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.tbl_Moneda.Add(tbl_Moneda);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Moneda.id_Moneda }, tbl_Moneda);
        }

        // DELETE: api/tblMoneda/5
        [ResponseType(typeof(tbl_Moneda))]
        public IHttpActionResult Deletetbl_Moneda(int id)
        {
            tbl_Moneda tbl_Moneda = db.tbl_Moneda.Find(id);
            if (tbl_Moneda == null)
            {
                return NotFound();
            }

            db.tbl_Moneda.Remove(tbl_Moneda);
            db.SaveChanges();

            return Ok(tbl_Moneda);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_MonedaExists(int id)
        {
            return db.tbl_Moneda.Count(e => e.id_Moneda == id) > 0;
        }
    }
}