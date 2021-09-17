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
    public class tblCom_FormaPagoController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblCom_FormaPago
        public IQueryable<tbl_Com_FormaPago> Gettbl_Com_FormaPago()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Com_FormaPago;
        }

        // GET: api/tblCom_FormaPago/5
        [ResponseType(typeof(tbl_Com_FormaPago))]
        public IHttpActionResult Gettbl_Com_FormaPago(int id)
        {
            tbl_Com_FormaPago tbl_Com_FormaPago = db.tbl_Com_FormaPago.Find(id);
            if (tbl_Com_FormaPago == null)
            {
                return NotFound();
            }

            return Ok(tbl_Com_FormaPago);
        }

        // PUT: api/tblCom_FormaPago/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Com_FormaPago(int id, tbl_Com_FormaPago Object_ent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != Object_ent.id_FormaPag)
            {
                return BadRequest();
            }

            tbl_Com_FormaPago object_formaPgR;

            object_formaPgR = db.tbl_Com_FormaPago.Where(p => p.id_FormaPag == Object_ent.id_FormaPag).FirstOrDefault<tbl_Com_FormaPago>();
            object_formaPgR.id_FormaPag = Object_ent.id_FormaPag;
            object_formaPgR.descripcion_FromaPag = Object_ent.descripcion_FromaPag;
            object_formaPgR.estado = Object_ent.estado;
            object_formaPgR.fecha_Edicion = DateTime.Now;

            db.Entry(object_formaPgR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Com_FormaPagoExists(id))
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

        // POST: api/tblCom_FormaPago
        [ResponseType(typeof(tbl_Com_FormaPago))]
        public IHttpActionResult Posttbl_Com_FormaPago(tbl_Com_FormaPago tbl_Com_FormaPago)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.tbl_Com_FormaPago.Add(tbl_Com_FormaPago);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Com_FormaPago.id_FormaPag }, tbl_Com_FormaPago);
        }

        // DELETE: api/tblCom_FormaPago/5
        [ResponseType(typeof(tbl_Com_FormaPago))]
        public async Task<IHttpActionResult> Deletetbl_Com_FormaPago(int id)
        {

            tbl_Com_FormaPago objet_ent = await db.tbl_Com_FormaPago.FindAsync(id);
            objet_ent = db.tbl_Com_FormaPago.Where(p => p.id_FormaPag == id).FirstOrDefault<tbl_Com_FormaPago>();
            objet_ent.estado = 0;
            db.Entry(objet_ent).State = System.Data.Entity.EntityState.Modified;
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

        private bool tbl_Com_FormaPagoExists(int id)
        {
            return db.tbl_Com_FormaPago.Count(e => e.id_FormaPag == id) > 0;
        }
    }
}