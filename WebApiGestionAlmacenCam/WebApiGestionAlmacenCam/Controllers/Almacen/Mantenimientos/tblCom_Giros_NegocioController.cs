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
    public class tblCom_Giros_NegocioController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblCom_Giros_Negocio
        public IQueryable<tbl_Com_Giros_Negocio> Gettbl_Com_Giros_Negocio()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Com_Giros_Negocio;
        }

        // GET: api/tblCom_Giros_Negocio/5
        [ResponseType(typeof(tbl_Com_Giros_Negocio))]
        public IHttpActionResult Gettbl_Com_Giros_Negocio(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            tbl_Com_Giros_Negocio tbl_Com_Giros_Negocio = db.tbl_Com_Giros_Negocio.Find(id);
            if (tbl_Com_Giros_Negocio == null)
            {
                return NotFound();
            }

            return Ok(tbl_Com_Giros_Negocio);
        }

        // PUT: api/tblCom_Giros_Negocio/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Com_Giros_Negocio(int id, tbl_Com_Giros_Negocio objct_entidad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != objct_entidad.id_GiroNegocio)
            {
                return BadRequest();
            }
            tbl_Com_Giros_Negocio Object_GirosR;
            Object_GirosR = db.tbl_Com_Giros_Negocio.Where(gn => gn.id_GiroNegocio == objct_entidad.id_GiroNegocio).FirstOrDefault<tbl_Com_Giros_Negocio>();
            Object_GirosR.id_GiroNegocio = objct_entidad.id_GiroNegocio;
            Object_GirosR.Nombre_GiroNegocio = objct_entidad.Nombre_GiroNegocio;
            Object_GirosR.descripcion_GiroNegocio = objct_entidad.descripcion_GiroNegocio;
            Object_GirosR.abreviatura_GiroNegocio = objct_entidad.abreviatura_GiroNegocio;
            Object_GirosR.estado = objct_entidad.estado;
            Object_GirosR.usuario_Edicion = objct_entidad.usuario_Creacion;
            Object_GirosR.fecha_Edicion = DateTime.Now;


            db.Entry(Object_GirosR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Com_Giros_NegocioExists(id))
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

        // POST: api/tblCom_Giros_Negocio
        [ResponseType(typeof(tbl_Com_Giros_Negocio))]
        public IHttpActionResult Posttbl_Com_Giros_Negocio(tbl_Com_Giros_Negocio tbl_Com_Giros_Negocio)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tbl_Com_Giros_Negocio.fecha_Creacion = DateTime.Now;
            db.tbl_Com_Giros_Negocio.Add(tbl_Com_Giros_Negocio);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Com_Giros_Negocio.id_GiroNegocio }, tbl_Com_Giros_Negocio);
        }

        // DELETE: api/tblCom_Giros_Negocio/5
        [ResponseType(typeof(tbl_Com_Giros_Negocio))]
        public async Task<IHttpActionResult> Deletetbl_Com_Giros_Negocio(int id)
        {
            tbl_Com_Giros_Negocio objct_ent = await db.tbl_Com_Giros_Negocio.FindAsync(id);
            objct_ent = db.tbl_Com_Giros_Negocio.Where(gn => gn.id_GiroNegocio == id).FirstOrDefault<tbl_Com_Giros_Negocio>();
            objct_ent.estado = 0;

            db.Entry(objct_ent).State = System.Data.Entity.EntityState.Modified;
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

        private bool tbl_Com_Giros_NegocioExists(int id)
        {
            return db.tbl_Com_Giros_Negocio.Count(e => e.id_GiroNegocio == id) > 0;
        }
    }
}