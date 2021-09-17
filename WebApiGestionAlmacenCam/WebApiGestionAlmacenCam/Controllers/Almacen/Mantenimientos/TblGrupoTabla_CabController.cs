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
    [EnableCors("*","*","*")]
    public class TblGrupoTabla_CabController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblGrupoTabla_Cab
        public IQueryable<Tbl_GrupoTabla_Cab> GetTbl_GrupoTabla_Cab()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.Tbl_GrupoTabla_Cab;
        }

        // GET: api/TblGrupoTabla_Cab/5
        [ResponseType(typeof(Tbl_GrupoTabla_Cab))]
        public IHttpActionResult GetTbl_GrupoTabla_Cab(int id)
        {
            Tbl_GrupoTabla_Cab tbl_GrupoTabla_Cab = db.Tbl_GrupoTabla_Cab.Find(id);
            if (tbl_GrupoTabla_Cab == null)
            {
                return NotFound();
            }

            return Ok(tbl_GrupoTabla_Cab);
        }

        // PUT: api/TblGrupoTabla_Cab/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTbl_GrupoTabla_Cab(int id, Tbl_GrupoTabla_Cab tbl_GrupoTabla_Cab)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_GrupoTabla_Cab.id_grupoTabla)
            {
                return BadRequest();
            }

            db.Entry(tbl_GrupoTabla_Cab).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Tbl_GrupoTabla_CabExists(id))
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

        // POST: api/TblGrupoTabla_Cab
        [ResponseType(typeof(Tbl_GrupoTabla_Cab))]
        public IHttpActionResult PostTbl_GrupoTabla_Cab(Tbl_GrupoTabla_Cab tbl_GrupoTabla_Cab)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Tbl_GrupoTabla_Cab.Add(tbl_GrupoTabla_Cab);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (Tbl_GrupoTabla_CabExists(tbl_GrupoTabla_Cab.id_grupoTabla))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = tbl_GrupoTabla_Cab.id_grupoTabla }, tbl_GrupoTabla_Cab);
        }

        // DELETE: api/TblGrupoTabla_Cab/5
        [ResponseType(typeof(Tbl_GrupoTabla_Cab))]
        public IHttpActionResult DeleteTbl_GrupoTabla_Cab(int id)
        {
            Tbl_GrupoTabla_Cab tbl_GrupoTabla_Cab = db.Tbl_GrupoTabla_Cab.Find(id);
            if (tbl_GrupoTabla_Cab == null)
            {
                return NotFound();
            }

            db.Tbl_GrupoTabla_Cab.Remove(tbl_GrupoTabla_Cab);
            db.SaveChanges();

            return Ok(tbl_GrupoTabla_Cab);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Tbl_GrupoTabla_CabExists(int id)
        {
            return db.Tbl_GrupoTabla_Cab.Count(e => e.id_grupoTabla == id) > 0;
        }
    }
}