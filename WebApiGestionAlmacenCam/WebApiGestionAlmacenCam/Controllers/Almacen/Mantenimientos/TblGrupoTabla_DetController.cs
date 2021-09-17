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
    public class TblGrupoTabla_DetController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblGrupoTabla_Det

        public object GetTbl_GrupoTabla_Det()
        {
            var list = (from d in db.Tbl_GrupoTabla_Det
                        join c in db.Tbl_GrupoTabla_Cab on d.id_grupoTabla equals c.id_grupoTabla
                      select new
                      {
                           c.id_grupoTabla,
                           descripcionCab = c.descripcion_grupoTabla,
                           d.id_detalleTabla,
                           descripcionDet = d.descripcion_grupoTabla

                      }).ToList();

            return list;
        }

        // GET: api/TblGrupoTabla_Det/5
        [ResponseType(typeof(Tbl_GrupoTabla_Det))]
        public IQueryable<Tbl_GrupoTabla_Det> GetTbl_GrupoTabla_Det(int id)
        {
            // BUSQUEDA 
            db.Configuration.ProxyCreationEnabled = false;
            return db.Tbl_GrupoTabla_Det.Where(l => l.id_grupoTabla == id);
        }

        // PUT: api/TblGrupoTabla_Det/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTbl_GrupoTabla_Det(int id, Tbl_GrupoTabla_Det object_enti)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != object_enti.id_grupoTabla)
            {
                return BadRequest();
            }

            Tbl_GrupoTabla_Det object_GrupoR;

            object_GrupoR = db.Tbl_GrupoTabla_Det.Where(g => g.id_detalleTabla == object_enti.id_detalleTabla).FirstOrDefault<Tbl_GrupoTabla_Det>();
            object_GrupoR.id_detalleTabla = object_enti.id_detalleTabla;
            object_GrupoR.id_grupoTabla = object_enti.id_grupoTabla;
            object_GrupoR.codigo_detalleTabla = object_enti.codigo_detalleTabla;
            object_GrupoR.descripcion_grupoTabla = object_enti.descripcion_grupoTabla;
            object_GrupoR.estado = object_enti.estado;
            object_GrupoR.usuario_Edicion = object_enti.usuario_Creacion;
            object_GrupoR.fecha_Edicion = DateTime.Now;
            db.Entry(object_GrupoR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Tbl_GrupoTabla_DetExists(id))
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

        // POST: api/TblGrupoTabla_Det
        [ResponseType(typeof(Tbl_GrupoTabla_Det))]
        public IHttpActionResult PostTbl_GrupoTabla_Det(Tbl_GrupoTabla_Det tbl_GrupoTabla_Det)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_GrupoTabla_Det.fecha_Creacion = DateTime.Now;
            db.Tbl_GrupoTabla_Det.Add(tbl_GrupoTabla_Det);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (Tbl_GrupoTabla_DetExists(tbl_GrupoTabla_Det.id_grupoTabla))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = tbl_GrupoTabla_Det.id_grupoTabla }, tbl_GrupoTabla_Det);
        }

        // DELETE: api/TblGrupoTabla_Det/5
        [ResponseType(typeof(Tbl_GrupoTabla_Det))]
        public async  Task<IHttpActionResult> DeleteTbl_GrupoTabla_Det(int id)
        {

            Tbl_GrupoTabla_Det objet = await db.Tbl_GrupoTabla_Det.FindAsync(id);
            objet = db.Tbl_GrupoTabla_Det.Where(g => g.id_detalleTabla == id).FirstOrDefault<Tbl_GrupoTabla_Det>();
            objet.estado = 0;
            db.Entry(objet).State = System.Data.Entity.EntityState.Modified;
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

        private bool Tbl_GrupoTabla_DetExists(int id)
        {
            return db.Tbl_GrupoTabla_Det.Count(e => e.id_grupoTabla == id) > 0;
        }
    }
}