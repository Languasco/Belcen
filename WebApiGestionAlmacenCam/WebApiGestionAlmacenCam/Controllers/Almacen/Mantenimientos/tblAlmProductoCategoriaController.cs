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
    public class tblAlmProductoCategoriaController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblAlmProductoCategoria
        public IQueryable<tbl_Alm_ProductoCategoria> Gettbl_Alm_ProductoCategoria()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Alm_ProductoCategoria;
        }

        // GET: api/tblAlmProductoCategoria/5
        [ResponseType(typeof(tbl_Alm_ProductoCategoria))]
        public IHttpActionResult Gettbl_Alm_ProductoCategoria(int id)
        {
            tbl_Alm_ProductoCategoria tbl_Alm_ProductoCategoria = db.tbl_Alm_ProductoCategoria.Find(id);
            if (tbl_Alm_ProductoCategoria == null)
            {
                return NotFound();
            }

            return Ok(tbl_Alm_ProductoCategoria);
        }


        //public object Gettbl_Alm_ProductoCategoria(int opcion, string filtro)
        //{
        //    //filtro puede tomar cualquier valor
        //    db.Configuration.ProxyCreationEnabled = false;
        //    object resul = null;
        //    try
        //    {
        //        if (opcion == 1)
        //        {
        //            string[] parametros = filtro.Split('|');
        //            int id_empresa = Convert.ToInt32(parametros[0].ToString());

        //            ReporteStock_BL obj_negocio = new ReporteStock_BL();
        //            resul = obj_negocio.Listando_StockAlmacen(fecha, id_local, id_almacen);
        //        }
        //        else
        //        {
        //            resul = "Opcion selecciona invalida";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        resul = ex.Message;
        //    }
        //    return resul;
        //}

        // PUT: api/tblAlmProductoCategoria/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Alm_ProductoCategoria(int id, tbl_Alm_ProductoCategoria obj_Entidad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != obj_Entidad.id_categoriaProducto)
            {
                return BadRequest();
            }

            tbl_Alm_ProductoCategoria Enti_CateProductR;
            Enti_CateProductR = db.tbl_Alm_ProductoCategoria.Where(cp => cp.id_categoriaProducto == obj_Entidad.id_categoriaProducto).FirstOrDefault<tbl_Alm_ProductoCategoria>();
            Enti_CateProductR.id_categoriaProducto = obj_Entidad.id_categoriaProducto;
            Enti_CateProductR.codgoCategoria = obj_Entidad.codgoCategoria;
            Enti_CateProductR.nombre_Categoria = obj_Entidad.nombre_Categoria;
            Enti_CateProductR.abreviacion_Categoria = obj_Entidad.abreviacion_Categoria;
            Enti_CateProductR.estado = obj_Entidad.estado;
            Enti_CateProductR.usuario_Edicion = obj_Entidad.usuario_Creacion;
            Enti_CateProductR.fecha_Edicion = DateTime.Now;

            db.Entry(Enti_CateProductR).State = EntityState.Modified;

           // db.Entry(tbl_Alm_ProductoCategoria).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Alm_ProductoCategoriaExists(id))
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

        // POST: api/tblAlmProductoCategoria
        [ResponseType(typeof(tbl_Alm_ProductoCategoria))]
        public IHttpActionResult Posttbl_Alm_ProductoCategoria(tbl_Alm_ProductoCategoria tbl_Alm_ProductoCategoria)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_Alm_ProductoCategoria.fecha_Creacion = DateTime.Now;
            db.tbl_Alm_ProductoCategoria.Add(tbl_Alm_ProductoCategoria);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Alm_ProductoCategoria.id_categoriaProducto }, tbl_Alm_ProductoCategoria);
        }

        // DELETE: api/tblAlmProductoCategoria/5
        [ResponseType(typeof(tbl_Alm_ProductoCategoria))]
        public async Task<IHttpActionResult> Deletetbl_Alm_ProductoCategoria(int id)
        {
            tbl_Alm_ProductoCategoria obj_entidad = await db.tbl_Alm_ProductoCategoria.FindAsync(id);

            obj_entidad = db.tbl_Alm_ProductoCategoria.Where(g => g.id_categoriaProducto == id).FirstOrDefault<tbl_Alm_ProductoCategoria>();
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

        private bool tbl_Alm_ProductoCategoriaExists(int id)
        {
            return db.tbl_Alm_ProductoCategoria.Count(e => e.id_categoriaProducto == id) > 0;
        }
    }
}