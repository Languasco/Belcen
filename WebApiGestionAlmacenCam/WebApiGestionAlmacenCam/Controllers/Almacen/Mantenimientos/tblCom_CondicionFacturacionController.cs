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
    public class tblCom_CondicionFacturacionController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblCom_CondicionFacturacion
        public IQueryable<tbl_Com_CondicionFacturacion> Gettbl_Com_CondicionFacturacion()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Com_CondicionFacturacion;
        }

        // GET: api/tblCom_CondicionFacturacion/5
        [ResponseType(typeof(tbl_Com_CondicionFacturacion))]
        public IHttpActionResult Gettbl_Com_CondicionFacturacion(int id)
        {
            tbl_Com_CondicionFacturacion tbl_Com_CondicionFacturacion = db.tbl_Com_CondicionFacturacion.Find(id);
            if (tbl_Com_CondicionFacturacion == null)
            {
                return NotFound();
            }

            return Ok(tbl_Com_CondicionFacturacion);
        }

        // PUT: api/tblCom_CondicionFacturacion/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Com_CondicionFacturacion(int id, tbl_Com_CondicionFacturacion tbl_Com_CondicionFacturacion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Com_CondicionFacturacion.id_CondicionFacturacion)
            {
                return BadRequest();
            }

            db.Entry(tbl_Com_CondicionFacturacion).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Com_CondicionFacturacionExists(id))
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

        // POST: api/tblCom_CondicionFacturacion
        [ResponseType(typeof(tbl_Com_CondicionFacturacion))]
        public IHttpActionResult Posttbl_Com_CondicionFacturacion(tbl_Com_CondicionFacturacion tbl_Com_CondicionFacturacion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.tbl_Com_CondicionFacturacion.Add(tbl_Com_CondicionFacturacion);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Com_CondicionFacturacion.id_CondicionFacturacion }, tbl_Com_CondicionFacturacion);
        }

        // DELETE: api/tblCom_CondicionFacturacion/5
        [ResponseType(typeof(tbl_Com_CondicionFacturacion))]
        public IHttpActionResult Deletetbl_Com_CondicionFacturacion(int id)
        {
            tbl_Com_CondicionFacturacion tbl_Com_CondicionFacturacion = db.tbl_Com_CondicionFacturacion.Find(id);
            if (tbl_Com_CondicionFacturacion == null)
            {
                return NotFound();
            }

            db.tbl_Com_CondicionFacturacion.Remove(tbl_Com_CondicionFacturacion);
            db.SaveChanges();

            return Ok(tbl_Com_CondicionFacturacion);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Com_CondicionFacturacionExists(int id)
        {
            return db.tbl_Com_CondicionFacturacion.Count(e => e.id_CondicionFacturacion == id) > 0;
        }
    }
}