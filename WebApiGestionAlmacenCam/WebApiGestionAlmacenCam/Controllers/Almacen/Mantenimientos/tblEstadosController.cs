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
    public class tblEstadosController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblEstados
        public IQueryable<tbl_Estados> Gettbl_Estados()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Estados.Where( e=> e.estado == 1);
        }

        // GET: api/tblEstados/5
        [ResponseType(typeof(tbl_Estados))]
        public IQueryable<tbl_Estados> Gettbl_Estados(string tipoProceso)
        {
            db.Configuration.ProxyCreationEnabled = false;


            return db.tbl_Estados.Where(e => e.tipoProceso_estado == tipoProceso);
        }

        // PUT: api/tblEstados/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Estados(int id, tbl_Estados tbl_Estados)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Estados.id_Estado)
            {
                return BadRequest();
            }

            db.Entry(tbl_Estados).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_EstadosExists(id))
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

        // POST: api/tblEstados
        [ResponseType(typeof(tbl_Estados))]
        public IHttpActionResult Posttbl_Estados(tbl_Estados tbl_Estados)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.tbl_Estados.Add(tbl_Estados);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Estados.id_Estado }, tbl_Estados);
        }

        // DELETE: api/tblEstados/5
        [ResponseType(typeof(tbl_Estados))]
        public IHttpActionResult Deletetbl_Estados(int id)
        {
            tbl_Estados tbl_Estados = db.tbl_Estados.Find(id);
            if (tbl_Estados == null)
            {
                return NotFound();
            }

            db.tbl_Estados.Remove(tbl_Estados);
            db.SaveChanges();

            return Ok(tbl_Estados);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_EstadosExists(int id)
        {
            return db.tbl_Estados.Count(e => e.id_Estado == id) > 0;
        }
    }
}