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
    public class tblCom_Canales_NegocioController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblCom_Canales_Negocio
        public IQueryable<tbl_Com_Canales_Negocio> Gettbl_Com_Canales_Negocio()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Com_Canales_Negocio;
        }

        // GET: api/tblCom_Canales_Negocio/5
        [ResponseType(typeof(tbl_Com_Canales_Negocio))]
        public IHttpActionResult Gettbl_Com_Canales_Negocio(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            tbl_Com_Canales_Negocio tbl_Com_Canales_Negocio = db.tbl_Com_Canales_Negocio.Find(id);
            if (tbl_Com_Canales_Negocio == null)
            {
                return NotFound();
            }

            return Ok(tbl_Com_Canales_Negocio);
        }

        // PUT: api/tblCom_Canales_Negocio/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Com_Canales_Negocio(int id, tbl_Com_Canales_Negocio obj_entidad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != obj_entidad.id_CanalNegocio)
            {
                return BadRequest();
            }

            tbl_Com_Canales_Negocio Ent_canalNegoR;
            Ent_canalNegoR = db.tbl_Com_Canales_Negocio.Where(g => g.id_CanalNegocio == obj_entidad.id_CanalNegocio).FirstOrDefault<tbl_Com_Canales_Negocio>();

            Ent_canalNegoR.id_CanalNegocio = obj_entidad.id_CanalNegocio;
            Ent_canalNegoR.Nombre_CanalNegocio = obj_entidad.Nombre_CanalNegocio;
            Ent_canalNegoR.descripcion_CanalNegocio = obj_entidad.descripcion_CanalNegocio;
            Ent_canalNegoR.abreviatura_CanalNegocio = obj_entidad.abreviatura_CanalNegocio;
            Ent_canalNegoR.estado = obj_entidad.estado;
            Ent_canalNegoR.usuario_Edicion = obj_entidad.usuario_Creacion;
            Ent_canalNegoR.fecha_Edicion = DateTime.Now;


            db.Entry(Ent_canalNegoR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Com_Canales_NegocioExists(id))
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

        // POST: api/tblCom_Canales_Negocio
        [ResponseType(typeof(tbl_Com_Canales_Negocio))]
        public IHttpActionResult Posttbl_Com_Canales_Negocio(tbl_Com_Canales_Negocio tbl_Com_Canales_Negocio)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tbl_Com_Canales_Negocio.fecha_Creacion = DateTime.Now;
            db.tbl_Com_Canales_Negocio.Add(tbl_Com_Canales_Negocio);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Com_Canales_Negocio.id_CanalNegocio }, tbl_Com_Canales_Negocio);
        }

        // DELETE: api/tblCom_Canales_Negocio/5
        [ResponseType(typeof(tbl_Com_Canales_Negocio))]
        public async Task<IHttpActionResult> Deletetbl_Com_Canales_Negocio(int id)
        {
            tbl_Com_Canales_Negocio objs_entidad = await db.tbl_Com_Canales_Negocio.FindAsync(id);

            objs_entidad = db.tbl_Com_Canales_Negocio.Where(c => c.id_CanalNegocio == id).FirstOrDefault<tbl_Com_Canales_Negocio>();
            objs_entidad.estado = 0;

            db.Entry(objs_entidad).State = System.Data.Entity.EntityState.Modified;
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

        private bool tbl_Com_Canales_NegocioExists(int id)
        {
            return db.tbl_Com_Canales_Negocio.Count(e => e.id_CanalNegocio == id) > 0;
        }
    }
}