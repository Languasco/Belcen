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


namespace WebApiGestionAlmacenCam.Controllers
{
        [EnableCors("*", "*", "*")]
    public class tblVehiculoController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblVehiculo
        public IQueryable<tbl_Vehiculo> Gettbl_Vehiculo()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Vehiculo;
        }

        // GET: api/tblVehiculo/5
        [ResponseType(typeof(tbl_Vehiculo))]
        public IHttpActionResult Gettbl_Vehiculo(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            tbl_Vehiculo tbl_Vehiculo = db.tbl_Vehiculo.Find(id);
            if (tbl_Vehiculo == null)
            {
                return NotFound();
            }

            return Ok(tbl_Vehiculo);
        }

        // PUT: api/tblVehiculo/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Vehiculo(int id, tbl_Vehiculo Objct_ent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != Objct_ent.id_vehiculo)
            {
                return BadRequest();
            }

            tbl_Vehiculo Object_vehiculoR;
            Object_vehiculoR = db.tbl_Vehiculo.Where(v => v.id_vehiculo == Objct_ent.id_vehiculo).FirstOrDefault<tbl_Vehiculo>();
            Object_vehiculoR.id_vehiculo = Objct_ent.id_vehiculo;
            Object_vehiculoR.vehiculo_Placa = Objct_ent.vehiculo_Placa;
            Object_vehiculoR.marca_Vehiculo = Objct_ent.marca_Vehiculo;
            Object_vehiculoR.modelo_Vehiculo = Objct_ent.modelo_Vehiculo;
            Object_vehiculoR.descripcion_vehiculo = Objct_ent.descripcion_vehiculo;
            Object_vehiculoR.estado = Objct_ent.estado;
            Object_vehiculoR.usuario_Edicion = Objct_ent.usuario_Creacion;
            Object_vehiculoR.fecha_Edicion = DateTime.Now;

            db.Entry(Object_vehiculoR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_VehiculoExists(id))
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

        // POST: api/tblVehiculo
        [ResponseType(typeof(tbl_Vehiculo))]
        public IHttpActionResult Posttbl_Vehiculo(tbl_Vehiculo tbl_Vehiculo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_Vehiculo.fecha_Creacion = DateTime.Now;
            db.tbl_Vehiculo.Add(tbl_Vehiculo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Vehiculo.id_vehiculo }, tbl_Vehiculo);
        }

        // DELETE: api/tblVehiculo/5
        [ResponseType(typeof(tbl_Vehiculo))]
        public async Task<IHttpActionResult> Deletetbl_Vehiculo(int id)
        {

            tbl_Vehiculo object_ent = await db.tbl_Vehiculo.FindAsync(id);
            object_ent = db.tbl_Vehiculo.Where(v => v.id_vehiculo == id).FirstOrDefault<tbl_Vehiculo>();
            object_ent.estado = 0;

            db.Entry(object_ent).State = System.Data.Entity.EntityState.Modified;
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

        private bool tbl_VehiculoExists(int id)
        {
            return db.tbl_Vehiculo.Count(e => e.id_vehiculo == id) > 0;
        }
    }
}