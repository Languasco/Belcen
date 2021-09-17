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
    public class TblCargoController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblCargo
        public IQueryable<Tbl_Cargo> GetTbl_Cargo()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.Tbl_Cargo;
        }

        // GET: api/TblCargo/5
        [ResponseType(typeof(Tbl_Cargo))]
        public IQueryable GetTbl_Cargo(int status)
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.Tbl_Cargo.Where(al => al.estado == status);
        }

        // PUT: api/TblCargo/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTbl_Cargo(int id, Tbl_Cargo object_ent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != object_ent.id_CargoPersonal)
            {
                return BadRequest();
            }
            Tbl_Cargo object_CargoR;
            object_CargoR = db.Tbl_Cargo.Where(c => c.id_CargoPersonal == object_ent.id_CargoPersonal).FirstOrDefault<Tbl_Cargo>();
            object_CargoR.id_CargoPersonal = object_ent.id_CargoPersonal;
            object_CargoR.codigoInterno_CargoPersonal = object_ent.codigoInterno_CargoPersonal;
            object_CargoR.descripcion_CargoPersonal = object_ent.descripcion_CargoPersonal;
            object_CargoR.estado = object_ent.estado;
            object_CargoR.usuario_edicion = object_ent.usuario_creacion;
            object_CargoR.fecha_edicion = DateTime.Now;

            db.Entry(object_CargoR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Tbl_CargoExists(id))
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

        // POST: api/TblCargo
        [ResponseType(typeof(Tbl_Cargo))]
        public IHttpActionResult PostTbl_Cargo(Tbl_Cargo tbl_Cargo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_Cargo.fecha_creacion = DateTime.Now;
            db.Tbl_Cargo.Add(tbl_Cargo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Cargo.id_CargoPersonal }, tbl_Cargo);
        }

        // DELETE: api/TblCargo/5
        [ResponseType(typeof(Tbl_Cargo))]
        public  async Task<IHttpActionResult> DeleteTbl_Cargo(int id)
        {

            Tbl_Cargo obje_ent = await db.Tbl_Cargo.FindAsync(id);
            obje_ent = db.Tbl_Cargo.Where(c => c.id_CargoPersonal == id).FirstOrDefault<Tbl_Cargo>();
            obje_ent.estado = 0;
            db.Entry(obje_ent).State = System.Data.Entity.EntityState.Modified;
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

        private bool Tbl_CargoExists(int id)
        {
            return db.Tbl_Cargo.Count(e => e.id_CargoPersonal == id) > 0;
        }
    }
}