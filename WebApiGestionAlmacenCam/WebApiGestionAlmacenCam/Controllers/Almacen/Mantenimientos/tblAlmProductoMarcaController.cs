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
    public class tblAlmProductoMarcaController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblAlmProductoMarca
        public IQueryable<tbl_Alm_ProductoMarca> Gettbl_Alm_ProductoMarca()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Alm_ProductoMarca;
        }

        // GET: api/tblAlmProductoMarca/5
        [ResponseType(typeof(tbl_Alm_ProductoMarca))]
        public IQueryable Gettbl_Alm_ProductoMarca(int estado)
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Alm_ProductoMarca.Where(c => c.estado == estado);
        }
        
        // PUT: api/tblAlmProductoMarca/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Alm_ProductoMarca(int id, tbl_Alm_ProductoMarca object_Ent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != object_Ent.id_marcaProducto)
            {
                return BadRequest();
            }

            tbl_Alm_ProductoMarca Entidad_ProdMarcaR;
            Entidad_ProdMarcaR = db.tbl_Alm_ProductoMarca.Where(pc => pc.id_marcaProducto == object_Ent.id_marcaProducto).FirstOrDefault<tbl_Alm_ProductoMarca>();
            Entidad_ProdMarcaR.id_marcaProducto = object_Ent.id_marcaProducto;
            Entidad_ProdMarcaR.codigo_marcaproducto = object_Ent.codigo_marcaproducto;
            Entidad_ProdMarcaR.nombre_marcaproducto = object_Ent.nombre_marcaproducto;
            Entidad_ProdMarcaR.abreviatura_marcaproducto = object_Ent.abreviatura_marcaproducto;
            Entidad_ProdMarcaR.estado = object_Ent.estado;
            Entidad_ProdMarcaR.usuario_Edicion = object_Ent.usuario_Creacion;
            Entidad_ProdMarcaR.fecha_Edicion = DateTime.Now;

            db.Entry(Entidad_ProdMarcaR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Alm_ProductoMarcaExists(id))
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

        // POST: api/tblAlmProductoMarca
        [ResponseType(typeof(tbl_Alm_ProductoMarca))]
        public IHttpActionResult Posttbl_Alm_ProductoMarca(tbl_Alm_ProductoMarca tbl_Alm_ProductoMarca)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_Alm_ProductoMarca.fecha_Creacion = DateTime.Now;
            db.tbl_Alm_ProductoMarca.Add(tbl_Alm_ProductoMarca);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Alm_ProductoMarca.id_marcaProducto }, tbl_Alm_ProductoMarca);
        }

        // DELETE: api/tblAlmProductoMarca/5
        [ResponseType(typeof(tbl_Alm_ProductoMarca))]
        public async Task<IHttpActionResult> Deletetbl_Alm_ProductoMarca(int id)
        {
            tbl_Alm_ProductoMarca obj_Entidad = await db.tbl_Alm_ProductoMarca.FindAsync(id);
            obj_Entidad = db.tbl_Alm_ProductoMarca.Where(m => m.id_marcaProducto == id).FirstOrDefault<tbl_Alm_ProductoMarca>();
            obj_Entidad.estado = 0;
            db.Entry(obj_Entidad).State = System.Data.Entity.EntityState.Modified;
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

        private bool tbl_Alm_ProductoMarcaExists(int id)
        {
            return db.tbl_Alm_ProductoMarca.Count(e => e.id_marcaProducto == id) > 0;
        }
    }
}