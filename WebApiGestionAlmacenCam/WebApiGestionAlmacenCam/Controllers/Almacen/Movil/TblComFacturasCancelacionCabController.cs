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
using EntityFramework.BulkInsert.Extensions;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Movil
{

    [EnableCors("*", "*", "*")]
    public class TblComFacturasCancelacionCabController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblComFacturasCancelacionCab
        public IQueryable<Tbl_Com_Facturas_Cancelacion_Cab> GetTbl_Com_Facturas_Cancelacion_Cab()
        {
            return db.Tbl_Com_Facturas_Cancelacion_Cab;
        }

        // GET: api/TblComFacturasCancelacionCab/5
        [ResponseType(typeof(Tbl_Com_Facturas_Cancelacion_Cab))]
        public IHttpActionResult GetTbl_Com_Facturas_Cancelacion_Cab(int id)
        {
            Tbl_Com_Facturas_Cancelacion_Cab tbl_Com_Facturas_Cancelacion_Cab = db.Tbl_Com_Facturas_Cancelacion_Cab.Find(id);
            if (tbl_Com_Facturas_Cancelacion_Cab == null)
            {
                return NotFound();
            }

            return Ok(tbl_Com_Facturas_Cancelacion_Cab);
        }

        // PUT: api/TblComFacturasCancelacionCab/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTbl_Com_Facturas_Cancelacion_Cab(int id, Tbl_Com_Facturas_Cancelacion_Cab tbl_Com_Facturas_Cancelacion_Cab)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Com_Facturas_Cancelacion_Cab.id_cancelacion_cab)
            {
                return BadRequest();
            }

            db.Entry(tbl_Com_Facturas_Cancelacion_Cab).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Tbl_Com_Facturas_Cancelacion_CabExists(id))
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

        // POST: api/TblComFacturasCancelacionCab
        [ResponseType(typeof(Tbl_Com_Facturas_Cancelacion_Cab))]
        public IHttpActionResult PostTbl_Com_Facturas_Cancelacion_Cab(List<Tbl_Com_Facturas_Cancelacion_Cab> tbl_Com_Facturas_Cancelacion_Cab)
        {
            

            foreach (var item in tbl_Com_Facturas_Cancelacion_Cab)
            {
                item.fecha_cancelacion_servidor = DateTime.Now;
            }
            db.BulkInsert(tbl_Com_Facturas_Cancelacion_Cab);
            db.SaveChanges(); 

            return CreatedAtRoute("DefaultApi", new { id = tbl_Com_Facturas_Cancelacion_Cab[0].id_cancelacion_cab }, tbl_Com_Facturas_Cancelacion_Cab);
        }

        // DELETE: api/TblComFacturasCancelacionCab/5
        [ResponseType(typeof(Tbl_Com_Facturas_Cancelacion_Cab))]
        public IHttpActionResult DeleteTbl_Com_Facturas_Cancelacion_Cab(int id)
        {
            Tbl_Com_Facturas_Cancelacion_Cab tbl_Com_Facturas_Cancelacion_Cab = db.Tbl_Com_Facturas_Cancelacion_Cab.Find(id);
            if (tbl_Com_Facturas_Cancelacion_Cab == null)
            {
                return NotFound();
            }

            db.Tbl_Com_Facturas_Cancelacion_Cab.Remove(tbl_Com_Facturas_Cancelacion_Cab);
            db.SaveChanges();

            return Ok(tbl_Com_Facturas_Cancelacion_Cab);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Tbl_Com_Facturas_Cancelacion_CabExists(int id)
        {
            return db.Tbl_Com_Facturas_Cancelacion_Cab.Count(e => e.id_cancelacion_cab == id) > 0;
        }
    }
}