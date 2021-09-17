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
    public class tblAlmProductoSubLineaController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblAlmProductoSubLinea
          public object Gettbl_Alm_ProductoSubLinea()
        {
            var list = (from ps in db.tbl_Alm_ProductoSubLinea
                        join pc in db.tbl_Alm_ProductoCategoria on ps.id_categoriaProducto equals pc.id_categoriaProducto
                        join pl in db.tbl_Alm_ProductoLinea on ps.id_lineaProducto equals pl.id_lineaProducto

                        select new
                        {
                            pc.id_categoriaProducto,
                            pc.nombre_Categoria,
                            pc.abreviacion_Categoria,
                            pl.id_lineaProducto,
                            pl.nombre_linea,
                            pl.abreviatura_linea,
                            ps.id_subLineaProducto,
                            ps.codigo_SubLinea,
                            ps.nombre_SubLinea,
                            ps.abreviatura_SubLinea,
                            ps.estado,
                            ps.usuario_Creacion,
                            ps.usuario_Edicion,
                            ps.fecha_Creacion,
                            ps.fecha_Edicion,
                        }).ToList();

              return list;
        }
        

        // GET: api/tblAlmProductoSubLinea/5
        [ResponseType(typeof(tbl_Alm_ProductoSubLinea))]
        public IQueryable<tbl_Alm_ProductoSubLinea> Gettbl_Alm_ProductoSubLinea(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Alm_ProductoSubLinea.Where(l => l.id_lineaProducto == id);
        }

        // PUT: api/tblAlmProductoSubLinea/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Alm_ProductoSubLinea(int id, tbl_Alm_ProductoSubLinea obj_entidad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != obj_entidad.id_subLineaProducto)
            {
                return BadRequest();
            }

            tbl_Alm_ProductoSubLinea Ent_subLineaR;
            Ent_subLineaR = db.tbl_Alm_ProductoSubLinea.Where(g => g.id_subLineaProducto == obj_entidad.id_subLineaProducto).FirstOrDefault<tbl_Alm_ProductoSubLinea>();

            Ent_subLineaR.id_subLineaProducto = obj_entidad.id_subLineaProducto;
            Ent_subLineaR.id_categoriaProducto = obj_entidad.id_categoriaProducto;
            Ent_subLineaR.id_lineaProducto = obj_entidad.id_lineaProducto;
            Ent_subLineaR.codigo_SubLinea = obj_entidad.codigo_SubLinea;
            Ent_subLineaR.nombre_SubLinea = obj_entidad.nombre_SubLinea;
            Ent_subLineaR.abreviatura_SubLinea = obj_entidad.abreviatura_SubLinea;


            Ent_subLineaR.estado = obj_entidad.estado;
            Ent_subLineaR.usuario_Edicion = obj_entidad.usuario_Creacion;
            Ent_subLineaR.fecha_Edicion = DateTime.Now;
            db.Entry(Ent_subLineaR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Alm_ProductoSubLineaExists(id))
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

        // POST: api/tblAlmProductoSubLinea
        [ResponseType(typeof(tbl_Alm_ProductoSubLinea))]
        public IHttpActionResult Posttbl_Alm_ProductoSubLinea(tbl_Alm_ProductoSubLinea tbl_Alm_ProductoSubLinea)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_Alm_ProductoSubLinea.fecha_Creacion = DateTime.Now;
            db.tbl_Alm_ProductoSubLinea.Add(tbl_Alm_ProductoSubLinea);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Alm_ProductoSubLinea.id_subLineaProducto }, tbl_Alm_ProductoSubLinea);
        }

        // DELETE: api/tblAlmProductoSubLinea/5
        [ResponseType(typeof(tbl_Alm_ProductoSubLinea))]

        public async Task<IHttpActionResult> Deletetbl_Alm_ProductoSubLinea(int id)
        {
            tbl_Alm_ProductoSubLinea obj_entidad = await db.tbl_Alm_ProductoSubLinea.FindAsync(id);

            obj_entidad = db.tbl_Alm_ProductoSubLinea.Where(g => g.id_subLineaProducto == id).FirstOrDefault<tbl_Alm_ProductoSubLinea>();
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

        private bool tbl_Alm_ProductoSubLineaExists(int id)
        {
            return db.tbl_Alm_ProductoSubLinea.Count(e => e.id_subLineaProducto == id) > 0;
        }
    }
}