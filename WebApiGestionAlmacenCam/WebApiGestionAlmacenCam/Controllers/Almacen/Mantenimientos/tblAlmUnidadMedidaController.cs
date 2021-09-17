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
    [EnableCors("*", "*", "*")]
    public class tblAlmUnidadMedidaController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblAlmUnidadMedida
        public IQueryable<tbl_Alm_UnidadMedida> Gettbl_Alm_UnidadMedida()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Alm_UnidadMedida;
        }

        // GET: api/tblAlmUnidadMedida/5
        [ResponseType(typeof(tbl_Alm_UnidadMedida))]
        public IQueryable<tbl_Alm_UnidadMedida> Gettbl_Alm_UnidadMedida(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Alm_UnidadMedida.Where(l => l.id_unidadMedida == id );
        }

        // PUT: api/tblAlmUnidadMedida/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Alm_UnidadMedida(int id, tbl_Alm_UnidadMedida obj_entidad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != obj_entidad.id_unidadMedida)
            {
                return BadRequest();
            }

            tbl_Alm_UnidadMedida Ent_unidadR;
            Ent_unidadR = db.tbl_Alm_UnidadMedida.Where(g => g.id_unidadMedida == obj_entidad.id_unidadMedida).FirstOrDefault<tbl_Alm_UnidadMedida>();
            Ent_unidadR.id_unidadMedida = obj_entidad.id_unidadMedida;
            Ent_unidadR.codigo_UnidadMedida = obj_entidad.codigo_UnidadMedida;
            Ent_unidadR.nombre_UnidadMedida = obj_entidad.nombre_UnidadMedida;
            Ent_unidadR.abreviatura_UnidadMedida = obj_entidad.abreviatura_UnidadMedida;
            Ent_unidadR.estado = obj_entidad.estado;
            Ent_unidadR.usuario_Edicion = obj_entidad.usuario_Creacion;
            Ent_unidadR.fecha_Edicion = DateTime.Now;

            db.Entry(Ent_unidadR).State = EntityState.Modified;


            //db.Entry(tbl_Alm_UnidadMedida).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Alm_UnidadMedidaExists(id))
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

        // POST: api/tblAlmUnidadMedida
        [ResponseType(typeof(tbl_Alm_UnidadMedida))]
        public IHttpActionResult Posttbl_Alm_UnidadMedida(tbl_Alm_UnidadMedida tbl_Alm_UnidadMedida)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_Alm_UnidadMedida.fecha_Creacion = DateTime.Now;
            db.tbl_Alm_UnidadMedida.Add(tbl_Alm_UnidadMedida);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Alm_UnidadMedida.id_unidadMedida }, tbl_Alm_UnidadMedida);
        }

        // DELETE: api/tblAlmUnidadMedida/5
        [ResponseType(typeof(tbl_Alm_UnidadMedida))]
        public async Task<IHttpActionResult> Deletetbl_Alm_UnidadMedida(int id)
        {
            tbl_Alm_UnidadMedida obj_entidad = await db.tbl_Alm_UnidadMedida.FindAsync(id);

            obj_entidad = db.tbl_Alm_UnidadMedida.Where(g => g.id_unidadMedida == id).FirstOrDefault<tbl_Alm_UnidadMedida>();
            obj_entidad.estado = 0;
            db.Entry(obj_entidad).State = System.Data.Entity.EntityState.Modified;
            await db.SaveChangesAsync();

            return Ok("OK");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Alm_UnidadMedidaExists(int id)
        {
            return db.tbl_Alm_UnidadMedida.Count(e => e.id_unidadMedida == id) > 0;
        }
    }
}