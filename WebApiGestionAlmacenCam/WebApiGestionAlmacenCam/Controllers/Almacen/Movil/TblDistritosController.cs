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

namespace WebApiGestionAlmacenCam.Controllers.Mantenimientos
{
    [EnableCors("*", "*", "*")]
    public class TblDistritosController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblDistritos
        public IQueryable<Tbl_Distritos> GetTbl_Distritos()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.Tbl_Distritos.Take(20);
        }

        // GET: api/TblDistritos/5
        [ResponseType(typeof(Tbl_Distritos))]
        public IHttpActionResult GetTbl_Distritos(int id)
        {
            Tbl_Distritos tbl_Distritos = db.Tbl_Distritos.Find(id);
            if (tbl_Distritos == null)
            {
                return NotFound();
            }

            return Ok(tbl_Distritos);
        }

        // PUT: api/TblDistritos/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTbl_Distritos(int id, Tbl_Distritos tbl_Distritos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Distritos.id_distrito)
            {
                return BadRequest();
            }

            db.Entry(tbl_Distritos).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Tbl_DistritosExists(id))
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

        // POST: api/TblDistritos
        [ResponseType(typeof(Tbl_Distritos))]
        public IHttpActionResult PostTbl_Distritos(Tbl_Distritos tbl_Distritos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Tbl_Distritos.Add(tbl_Distritos);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Distritos.id_distrito }, tbl_Distritos);
        }

        // DELETE: api/TblDistritos/5
        [ResponseType(typeof(Tbl_Distritos))]
        public IHttpActionResult DeleteTbl_Distritos(int id)
        {
            Tbl_Distritos tbl_Distritos = db.Tbl_Distritos.Find(id);
            if (tbl_Distritos == null)
            {
                return NotFound();
            }

            db.Tbl_Distritos.Remove(tbl_Distritos);
            db.SaveChanges();

            return Ok(tbl_Distritos);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Tbl_DistritosExists(int id)
        {
            return db.Tbl_Distritos.Count(e => e.id_distrito == id) > 0;
        }
    }
}