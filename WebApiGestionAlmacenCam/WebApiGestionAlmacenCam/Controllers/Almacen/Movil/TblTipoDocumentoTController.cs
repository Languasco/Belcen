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

namespace WebApiGestionAlmacenCam.Controllers.Mantenimientos
{
    [EnableCors("*", "*", "*")]
    public class TblTipoDocumentoTController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblTipoDocumentoT
        public IQueryable<Tbl_TipoDocumentos> GetTbl_TipoDocumentos()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.Tbl_TipoDocumentos;
        }   

    
        // GET: api/TblTipoDocumentos/5
        [ResponseType(typeof(Tbl_TipoDocumentos))]
        public IHttpActionResult GetTbl_TipoDocumentos(int id)
        {

            db.Configuration.ProxyCreationEnabled = false;

            Tbl_TipoDocumentos tbl_TipoDocumentos = db.Tbl_TipoDocumentos.Find(id);
            if (tbl_TipoDocumentos == null)
            {
                return NotFound();
            }

            return Ok(tbl_TipoDocumentos);
        }

        // PUT: api/TblTipoDocumentos/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult>  PutTbl_TipoDocumentos(int id, Tbl_TipoDocumentos tbl_TipoDocumentos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_TipoDocumentos.id_TipoDocumento)
            {
                return BadRequest();
            }
            tbl_TipoDocumentos.fecha_edicion = DateTime.Now;
            tbl_TipoDocumentos.usuario_edicion = tbl_TipoDocumentos.usuario_creacion;
            db.Entry(tbl_TipoDocumentos).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Tbl_TipoDocumentosExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("OK");
        }

        // POST: api/TblTipoDocumentos
        [ResponseType(typeof(Tbl_TipoDocumentos))]
        public IHttpActionResult PostTbl_TipoDocumentos(Tbl_TipoDocumentos tbl_TipoDocumentos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_TipoDocumentos.fecha_creacion = DateTime.Now;
            db.Tbl_TipoDocumentos.Add(tbl_TipoDocumentos);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_TipoDocumentos.id_TipoDocumento }, tbl_TipoDocumentos);
        }
                
        // DELETE: api/TblTipoDocumentos/5
        [ResponseType(typeof(Tbl_TipoDocumentos))]
        public async Task<IHttpActionResult> DeleteTbl_TipoDocumentos(int id)
        {

            Tbl_TipoDocumentos tbl_tipoDocumento = await db.Tbl_TipoDocumentos.FindAsync(id);
            tbl_tipoDocumento = db.Tbl_TipoDocumentos.Where(g => g.id_TipoDocumento == id).FirstOrDefault<Tbl_TipoDocumentos>();
            tbl_tipoDocumento.estado = 0;
            db.Entry(tbl_tipoDocumento).State = System.Data.Entity.EntityState.Modified;
            await db.SaveChangesAsync();
            return Ok("ok");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Tbl_TipoDocumentosExists(int id)
        {
            return db.Tbl_TipoDocumentos.Count(e => e.id_TipoDocumento == id) > 0;
        }
    }
}