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
    public class tblAlmProductoLineaController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblAlmProductoLinea
        public object Gettbl_Alm_ProductoLinea()
        {
            db.Configuration.ProxyCreationEnabled = false;
            var list = (from pro in db.tbl_Alm_ProductoLinea
                        join ca in db.tbl_Alm_ProductoCategoria on pro.id_categoriaProducto equals ca.id_categoriaProducto
                        select new
                        {
                            ca.id_categoriaProducto,
                            ca.nombre_Categoria,
                            ca.abreviacion_Categoria,
                            pro.id_lineaProducto,
                            pro.codigo_linea,
                            pro.nombre_linea,
                            pro.abreviatura_linea,
                            pro.estado,
                            pro.usuario_Creacion,
                            pro.usuario_Edicion,
                            pro.fecha_Creacion,
                            pro.fecha_Edicion

                        }).ToList();


            return list;
        }

        // GET: api/tblAlmProductoLinea/5
        [ResponseType(typeof(tbl_Alm_ProductoLinea))]
        public IQueryable<tbl_Alm_ProductoLinea> Gettbl_Alm_ProductoLinea(int id)
        {
            // BUSQUEDA 
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Alm_ProductoLinea.Where(l => l.id_categoriaProducto == id);
        }

        // PUT: api/tblAlmProductoLinea/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Alm_ProductoLinea(int id, tbl_Alm_ProductoLinea objct_Enti)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != objct_Enti.id_lineaProducto)
            {
                return BadRequest();
            }
            tbl_Alm_ProductoLinea Enti_ProductLineR;
            Enti_ProductLineR = db.tbl_Alm_ProductoLinea.Where(l => l.id_lineaProducto == objct_Enti.id_lineaProducto).FirstOrDefault<tbl_Alm_ProductoLinea>();
            Enti_ProductLineR.id_lineaProducto = objct_Enti.id_lineaProducto;
            Enti_ProductLineR.id_categoriaProducto = objct_Enti.id_categoriaProducto;
            Enti_ProductLineR.codigo_linea = objct_Enti.codigo_linea;
            Enti_ProductLineR.nombre_linea = objct_Enti.nombre_linea;
            Enti_ProductLineR.abreviatura_linea = objct_Enti.abreviatura_linea;
            Enti_ProductLineR.usuario_Edicion = objct_Enti.usuario_Creacion;
            Enti_ProductLineR.estado = objct_Enti.estado;
            Enti_ProductLineR.fecha_Edicion = DateTime.Now;

            db.Entry(Enti_ProductLineR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Alm_ProductoLineaExists(id))
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

        // POST: api/tblAlmProductoLinea
        [ResponseType(typeof(tbl_Alm_ProductoLinea))]
        public IHttpActionResult Posttbl_Alm_ProductoLinea(tbl_Alm_ProductoLinea tbl_Alm_ProductoLinea)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tbl_Alm_ProductoLinea.fecha_Creacion = DateTime.Now;
            db.tbl_Alm_ProductoLinea.Add(tbl_Alm_ProductoLinea);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Alm_ProductoLinea.id_lineaProducto }, tbl_Alm_ProductoLinea);
        }

        // DELETE: api/tblAlmProductoLinea/5
        [ResponseType(typeof(tbl_Alm_ProductoLinea))]
        public async Task<IHttpActionResult> Deletetbl_Alm_ProductoLinea(int id)
        {
            tbl_Alm_ProductoLinea obj_entidad = await db.tbl_Alm_ProductoLinea.FindAsync(id);

            obj_entidad = db.tbl_Alm_ProductoLinea.Where(g => g.id_lineaProducto == id).FirstOrDefault<tbl_Alm_ProductoLinea>();
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

        private bool tbl_Alm_ProductoLineaExists(int id)
        {
            return db.tbl_Alm_ProductoLinea.Count(e => e.id_lineaProducto == id) > 0;
        }
    }
}