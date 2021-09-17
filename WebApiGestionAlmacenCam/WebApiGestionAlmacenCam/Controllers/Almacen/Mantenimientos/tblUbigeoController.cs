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
    public class tblUbigeoController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblUbigeo
        public IQueryable<tbl_Ubigeo> Gettbl_Ubigeo()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Ubigeo;
        }

        // GET: api/tblUbigeo/5
        [ResponseType(typeof(tbl_Ubigeo))]
        public IHttpActionResult Gettbl_Ubigeo(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            tbl_Ubigeo tbl_Ubigeo = db.tbl_Ubigeo.Find(id);
            if (tbl_Ubigeo == null)
            {
                return NotFound();
            }

            return Ok(tbl_Ubigeo);
        }

        // PUT: api/tblUbigeo/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Ubigeo(int id, tbl_Ubigeo tbl_Ubigeo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Ubigeo.id_ubigeo)
            {
                return BadRequest();
            }

            db.Entry(tbl_Ubigeo).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_UbigeoExists(id))
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

        // POST: api/tblUbigeo
        [ResponseType(typeof(tbl_Ubigeo))]
        public IHttpActionResult Posttbl_Ubigeo(tbl_Ubigeo tbl_Ubigeo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.tbl_Ubigeo.Add(tbl_Ubigeo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Ubigeo.id_ubigeo }, tbl_Ubigeo);
        }

        // DELETE: api/tblUbigeo/5
        [ResponseType(typeof(tbl_Ubigeo))]
        public IHttpActionResult Deletetbl_Ubigeo(int id)
        {
            tbl_Ubigeo tbl_Ubigeo = db.tbl_Ubigeo.Find(id);
            if (tbl_Ubigeo == null)
            {
                return NotFound();
            }

            db.tbl_Ubigeo.Remove(tbl_Ubigeo);
            db.SaveChanges();

            return Ok(tbl_Ubigeo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_UbigeoExists(int id)
        {
            return db.tbl_Ubigeo.Count(e => e.id_ubigeo == id) > 0;
        }
    }
}