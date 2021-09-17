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
    public class TBLParametrosController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TBLParametros
        public IQueryable<TBL_Parametros> GetTBL_Parametros()
        {
            return db.TBL_Parametros;
        }

        // GET: api/TBLParametros/5
        [ResponseType(typeof(TBL_Parametros))]
        public IHttpActionResult GetTBL_Parametros(int id)
        {
            TBL_Parametros tBL_Parametros = db.TBL_Parametros.Find(id);
            if (tBL_Parametros == null)
            {
                return NotFound();
            }

            return Ok(tBL_Parametros);
        }

        // PUT: api/TBLParametros/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTBL_Parametros(int id, TBL_Parametros tBL_Parametros)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tBL_Parametros.id_configuracion)
            {
                return BadRequest();
            }

            db.Entry(tBL_Parametros).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TBL_ParametrosExists(id))
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

        // POST: api/TBLParametros
        [ResponseType(typeof(TBL_Parametros))]
        public IHttpActionResult PostTBL_Parametros(TBL_Parametros tBL_Parametros)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.TBL_Parametros.Add(tBL_Parametros);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tBL_Parametros.id_configuracion }, tBL_Parametros);
        }

        // DELETE: api/TBLParametros/5
        [ResponseType(typeof(TBL_Parametros))]
        public IHttpActionResult DeleteTBL_Parametros(int id)
        {
            TBL_Parametros tBL_Parametros = db.TBL_Parametros.Find(id);
            if (tBL_Parametros == null)
            {
                return NotFound();
            }

            db.TBL_Parametros.Remove(tBL_Parametros);
            db.SaveChanges();

            return Ok(tBL_Parametros);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TBL_ParametrosExists(int id)
        {
            return db.TBL_Parametros.Count(e => e.id_configuracion == id) > 0;
        }
    }
}