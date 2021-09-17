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
using Newtonsoft.Json;
using System.Text;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Mantenimientos
{
        [EnableCors("*", "*", "*")]
    public class TblTipoDocumentosController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblTipoDocumentos
        public IQueryable<Tbl_TipoDocumentos> GetTbl_TipoDocumentos()
        {
            db.Configuration.ProxyCreationEnabled = false;
            IQueryable<Tbl_TipoDocumentos> tipoDocumento = db.Tbl_TipoDocumentos.AsQueryable<Tbl_TipoDocumentos>();
            return tipoDocumento;
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
        public IHttpActionResult PutTbl_TipoDocumentos(int id, Tbl_TipoDocumentos object_Ent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != object_Ent.id_TipoDocumento)
            {
                return BadRequest();
            }
            Tbl_TipoDocumentos object_tipoDocR;
            object_tipoDocR = db.Tbl_TipoDocumentos.Where(d => d.id_TipoDocumento == object_Ent.id_TipoDocumento).FirstOrDefault<Tbl_TipoDocumentos>();
            object_tipoDocR.id_TipoDocumento = object_Ent.id_TipoDocumento;
            object_tipoDocR.codigoInterno_TipoDocumento = object_Ent.codigoInterno_TipoDocumento;
            object_tipoDocR.TipoDocumento = object_Ent.TipoDocumento;
            object_tipoDocR.Descripcion_TipoDocumento = object_Ent.Descripcion_TipoDocumento;
            object_tipoDocR.codigoSunat_TipoDocumento = object_Ent.codigoSunat_TipoDocumento;
            object_tipoDocR.AfectoRetencion_TipoDocumento = object_Ent.AfectoRetencion_TipoDocumento;
            object_tipoDocR.estado = object_Ent.estado;
            object_tipoDocR.usuario_edicion = object_Ent.usuario_creacion;
            object_tipoDocR.fecha_edicion = DateTime.Now;

            db.Entry(object_tipoDocR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
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

            return Ok("Ok");
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
            Tbl_TipoDocumentos objct_Ent = await db.Tbl_TipoDocumentos.FindAsync(id);
            objct_Ent = db.Tbl_TipoDocumentos.Where(td => td.id_TipoDocumento == id).FirstOrDefault<Tbl_TipoDocumentos>();
            objct_Ent.estado = 0;

            Tbl_TipoDocumentos tbl_TipoDocumentos = db.Tbl_TipoDocumentos.Find(id);
            if (tbl_TipoDocumentos == null)
            {
                return NotFound();
            }

            db.Entry(objct_Ent).State = System.Data.Entity.EntityState.Modified;
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

        private bool Tbl_TipoDocumentosExists(int id)
        {
            return db.Tbl_TipoDocumentos.Count(e => e.id_TipoDocumento == id) > 0;
        }
    }
}