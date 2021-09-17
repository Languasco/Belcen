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
    public class tblAlmAlmacenController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblAlmAlmacen
        public IQueryable<tbl_Alm_Almacen> Gettbl_Alm_Almacen()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Alm_Almacen.Where( al => al.estado == 1);
        }

        // GET: api/tblAlmAlmacen/5
        [ResponseType(typeof(tbl_Alm_Almacen))]
        public IQueryable Gettbl_Alm_Almacen(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Alm_Almacen.Where(al => al.estado == 1 && al.id_Local == id);
        }

        // PUT: api/tblAlmAlmacen/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Alm_Almacen(int id, tbl_Alm_Almacen obj_entidad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != obj_entidad.id_Almacen)
            {
                return BadRequest();
            }

            tbl_Alm_Almacen Ent_AlmR;
            // DATA ACTUAL
            Ent_AlmR = db.tbl_Alm_Almacen.Where(g => g.id_Almacen == obj_entidad.id_Almacen).FirstOrDefault<tbl_Alm_Almacen>();
            
            ////Ent_AlmR.id_Empresa = obj_entidad.id_Empresa;
            Ent_AlmR.id_Anexos = obj_entidad.id_Anexos;
            Ent_AlmR.id_Local = obj_entidad.id_Local;
            Ent_AlmR.codigo_Almacen = obj_entidad.codigo_Almacen;
            Ent_AlmR.descripcion_Almacen = obj_entidad.descripcion_Almacen;
            Ent_AlmR.direccion_Almacen = obj_entidad.direccion_Almacen;
            Ent_AlmR.matNormal_Almacen = obj_entidad.matNormal_Almacen;
            Ent_AlmR.matBaja_Almacen = obj_entidad.matBaja_Almacen;
            Ent_AlmR.matConsignacion_Almacen = obj_entidad.matConsignacion_Almacen;

            Ent_AlmR.id_departamento = obj_entidad.id_departamento;
            Ent_AlmR.id_provincia = obj_entidad.id_provincia;
            Ent_AlmR.id_distrito = obj_entidad.id_distrito;

            Ent_AlmR.direccion_serie_sunat = obj_entidad.direccion_serie_sunat;
            Ent_AlmR.cod_establecimiento = obj_entidad.cod_establecimiento;

            Ent_AlmR.pedidosMovil_Almacen = obj_entidad.pedidosMovil_Almacen;
            Ent_AlmR.ventaMayorista = obj_entidad.ventaMayorista;

            Ent_AlmR.estado  = obj_entidad.estado;
            Ent_AlmR.usuario_Edicion  = obj_entidad.usuario_Creacion;
            Ent_AlmR.fecha_Edicion  = DateTime.Now;

            db.Entry(Ent_AlmR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Alm_AlmacenExists(id))
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

        // POST: api/tblAlmAlmacen
        [ResponseType(typeof(tbl_Alm_Almacen))]
        public IHttpActionResult Posttbl_Alm_Almacen(tbl_Alm_Almacen tbl_Alm_Almacen)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tbl_Alm_Almacen.fecha_Creacion = DateTime.Now;
            db.tbl_Alm_Almacen.Add(tbl_Alm_Almacen);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Alm_Almacen.id_Almacen }, tbl_Alm_Almacen);
        }

        //// DELETE: api/tblAlmAlmacen/5

        [ResponseType(typeof(tbl_Alm_Almacen))]
        public async Task<IHttpActionResult> Deletetbl_Alm_Almacen(int id)
        {
            tbl_Alm_Almacen obj_entidad = await db.tbl_Alm_Almacen.FindAsync(id);

            obj_entidad = db.tbl_Alm_Almacen.Where(g => g.id_Almacen == id).FirstOrDefault<tbl_Alm_Almacen>();
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

        private bool tbl_Alm_AlmacenExists(int id)
        {
            return db.tbl_Alm_Almacen.Count(e => e.id_Almacen == id) > 0;
        }
    }
}