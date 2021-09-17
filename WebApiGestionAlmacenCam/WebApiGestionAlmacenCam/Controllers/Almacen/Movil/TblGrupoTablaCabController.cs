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
    public class TblGrupoTablaCabController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblGrupoTablaCab
        public object GetTbl_GrupoTabla_Cab()
        {
            var list = (from cab in db.Tbl_GrupoTabla_Cab
                        join det in db.Tbl_GrupoTabla_Det on cab.id_grupoTabla equals det.id_grupoTabla
                        select new { 
                            cab.id_grupoTabla,
                            desCab = cab.descripcion_grupoTabla,
                            det.id_detalleTabla,
                            desDet = det.descripcion_grupoTabla,

                        }).ToList();


            return list;
        }

        // GET: api/TblGrupoTablaCab/5
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

        // PUT: api/TblGrupoTablaCab/5
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

        // POST: api/TblGrupoTablaCab
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

        // DELETE: api/TblGrupoTablaCab/5
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