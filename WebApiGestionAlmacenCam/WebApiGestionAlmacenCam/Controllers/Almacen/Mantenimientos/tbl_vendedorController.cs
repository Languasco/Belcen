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
    public class tbl_vendedorController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tbl_vendedor
        public IQueryable<tbl_vendedor> Gettbl_vendedor()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_vendedor;
        }

        // GET: api/tbl_vendedor/5
        [ResponseType(typeof(tbl_vendedor))]
        public IHttpActionResult Gettbl_vendedor(int id)
        {
            tbl_vendedor tbl_vendedor = db.tbl_vendedor.Find(id);
            if (tbl_vendedor == null)
            {
                return NotFound();
            }

            return Ok(tbl_vendedor);
        }

        // PUT: api/tbl_vendedor/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_vendedor(int id, tbl_vendedor object_ent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != object_ent.id_vendedor)
            {
                return BadRequest();
            }

            tbl_vendedor object_vendedorR;
            object_vendedorR = db.tbl_vendedor.Where(v => v.id_vendedor == object_ent.id_vendedor).FirstOrDefault<tbl_vendedor>();
            object_vendedorR.id_vendedor = object_ent.id_vendedor;
            object_vendedorR.ape_PaternoVendedor = object_ent.ape_PaternoVendedor;
            object_vendedorR.ape_MaternoVendedor = object_ent.ape_MaternoVendedor;
            object_vendedorR.nombreVendedor = object_ent.nombreVendedor;
            object_vendedorR.ubicacionVendedor = object_ent.ubicacionVendedor;
            object_vendedorR.documentoVendedor = object_ent.documentoVendedor;
            object_vendedorR.estado = object_ent.estado;
            object_vendedorR.usuario_Edicion = object_ent.usuario_Creacion;
            object_vendedorR.fecha_Edicion = DateTime.Now;
            
            db.Entry(object_vendedorR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_vendedorExists(id))
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

        // POST: api/tbl_vendedor
        [ResponseType(typeof(tbl_vendedor))]
        public IHttpActionResult Posttbl_vendedor(tbl_vendedor tbl_vendedor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tbl_vendedor.fecha_Creacion = DateTime.Now;
            db.tbl_vendedor.Add(tbl_vendedor);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_vendedor.id_vendedor }, tbl_vendedor);
        }

        // DELETE: api/tbl_vendedor/5
        [ResponseType(typeof(tbl_vendedor))]
        public async Task<IHttpActionResult> Deletetbl_vendedor(int id)
        {
            tbl_vendedor obje_ent = await db.tbl_vendedor.FindAsync(id);
            obje_ent = db.tbl_vendedor.Where(v => v.id_vendedor == id).FirstOrDefault<tbl_vendedor>();
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

        private bool tbl_vendedorExists(int id)
        {
            return db.tbl_vendedor.Count(e => e.id_vendedor == id) > 0;
        }
    }
}