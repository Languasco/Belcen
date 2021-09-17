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
using System.Web.Http.Cors;
using System.Threading.Tasks;
using Entidades;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Mantenimientos
{
    [EnableCors("*", "*", "*")]
    public class tbl_Alm_ProductoModeloMarcaController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tbl_Alm_ProductoModeloMarca
        public object Gettbl_Alm_ProductoModeloMarca()
        {
            var list = (from mc in db.tbl_Alm_ProductoModeloMarca
                        join pm in db.tbl_Alm_ProductoMarca on mc.id_marcaProducto equals pm.id_marcaProducto
                        select new
                        {
                            pm.id_marcaProducto,
                            pm.nombre_marcaproducto,
                            mc.id_modeloProducto,
                            mc.codigo_modeloProducto,
                            mc.nombre_modeloProducto,
                            mc.abreviatura_modeloProducto,
                            mc.estado,
                            mc.usuario_Creacion,
                            mc.usuario_Edicion,
                            mc.fecha_Creacion,
                            mc.fecha_Edicion
                        }).ToList();


            return list;
        }

        // GET: api/tbl_Alm_ProductoModeloMarca/5
        [ResponseType(typeof(tbl_Alm_ProductoModeloMarca))]
        public IQueryable<tbl_Alm_ProductoModeloMarca> Gettbl_Alm_ProductoModeloMarca(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Alm_ProductoModeloMarca.Where(l => l.id_marcaProducto == id );
        }

        // PUT: api/tbl_Alm_ProductoModeloMarca/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Alm_ProductoModeloMarca(int id, tbl_Alm_ProductoModeloMarca object_ent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != object_ent.id_modeloProducto)
            {
                return BadRequest();
            }
            tbl_Alm_ProductoModeloMarca object_MarcaP;
            object_MarcaP = db.tbl_Alm_ProductoModeloMarca.Where(m => m.id_modeloProducto == object_ent.id_modeloProducto).FirstOrDefault<tbl_Alm_ProductoModeloMarca>();
            object_MarcaP.id_modeloProducto = object_ent.id_modeloProducto;
            object_MarcaP.id_marcaProducto = object_ent.id_marcaProducto;
            object_MarcaP.codigo_modeloProducto = object_ent.codigo_modeloProducto;
            object_MarcaP.abreviatura_modeloProducto = object_ent.nombre_modeloProducto;
            object_MarcaP.abreviatura_modeloProducto = object_ent.abreviatura_modeloProducto;
            object_MarcaP.estado = object_ent.estado;
            object_MarcaP.usuario_Edicion = object_ent.usuario_Creacion;
            object_MarcaP.fecha_Edicion = DateTime.Now;

            db.Entry(object_MarcaP).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Alm_ProductoModeloMarcaExists(id))
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

        // POST: api/tbl_Alm_ProductoModeloMarca
        [ResponseType(typeof(tbl_Alm_ProductoModeloMarca))]
        public IHttpActionResult Posttbl_Alm_ProductoModeloMarca(tbl_Alm_ProductoModeloMarca tbl_Alm_ProductoModeloMarca)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_Alm_ProductoModeloMarca.fecha_Creacion = DateTime.Now;
            db.tbl_Alm_ProductoModeloMarca.Add(tbl_Alm_ProductoModeloMarca);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Alm_ProductoModeloMarca.id_modeloProducto }, tbl_Alm_ProductoModeloMarca);
        }

        // DELETE: api/tbl_Alm_ProductoModeloMarca/5
        [ResponseType(typeof(tbl_Alm_ProductoModeloMarca))]
        public async Task<IHttpActionResult> Deletetbl_Alm_ProductoModeloMarca(int id)
        {
            tbl_Alm_ProductoModeloMarca obj_entidad = await db.tbl_Alm_ProductoModeloMarca.FindAsync(id);

            obj_entidad = db.tbl_Alm_ProductoModeloMarca.Where(g => g.id_modeloProducto == id).FirstOrDefault<tbl_Alm_ProductoModeloMarca>();
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

        private bool tbl_Alm_ProductoModeloMarcaExists(int id)
        {
            return db.tbl_Alm_ProductoModeloMarca.Count(e => e.id_modeloProducto == id) > 0;
        }
    }
}