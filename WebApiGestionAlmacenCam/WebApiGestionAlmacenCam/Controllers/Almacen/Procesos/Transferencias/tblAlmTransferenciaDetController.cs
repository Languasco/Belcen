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

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Procesos.Transferencias
{
     [EnableCors("*", "*", "*")]
    public class tblAlmTransferenciaDetController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblAlmTransferenciaDet
        public object Gettbl_Alm_Transferencia_Det(string idTranCab)            
        {
            db.Configuration.ProxyCreationEnabled = false;
            int idAlmTran = Convert.ToInt32(idTranCab);
            var result = (from det in db.tbl_Alm_Transferencia_Det
                          join pro in db.tbl_Alm_Producto on det.id_Material equals pro.id_Producto
                          join um in db.tbl_Alm_UnidadMedida on pro.id_unidadMedida equals um.id_unidadMedida
                          join cat in db.tbl_Alm_ProductoCategoria on pro.id_categoriaProducto equals cat.id_categoriaProducto
                          join mar in db.tbl_Alm_ProductoMarca on pro.id_marcaProducto equals mar.id_marcaProducto
                          where det.Id_AlmTranCab == idAlmTran
                          select new
                          {
                              det.Id_AlmTranDet,
                              det.Id_AlmTranCab,
                              pro.nombre_Producto,
                              pro.id_Producto,
                              codigo_Producto = pro.codigo1_Producto,
                              um_Producto = um.nombre_UnidadMedida,
                              categoria_Producto = cat.nombre_Categoria,
                              cantidad_ingresada = det.cantidad_TranferenciaDet,
                              marca_Producto = mar.nombre_marcaproducto,
                              nroLote = det.nroLote,
                              det.fechaProduccion,
                              det.fechaVencimiento

                          }).ToList();
            return result;
        }

        [ResponseType(typeof(tbl_Alm_Transferencia_Det))]
        public IHttpActionResult Gettbl_Alm_Transferencia_Det(int id)
        {
            tbl_Alm_Transferencia_Det tbl_Alm_Transferencia_Det = db.tbl_Alm_Transferencia_Det.Find(id);
            if (tbl_Alm_Transferencia_Det == null)
            {
                return NotFound();
            }

            return Ok(tbl_Alm_Transferencia_Det);
        }

        // PUT: api/tblAlmTransferenciaDet/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Alm_Transferencia_Det(int id, tbl_Alm_Transferencia_Det tbl_Alm_Transferencia_Det)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Alm_Transferencia_Det.Id_AlmTranDet)
            {
                return BadRequest();
            }

            db.Entry(tbl_Alm_Transferencia_Det).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Alm_Transferencia_DetExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/tblAlmTransferenciaDet
        [ResponseType(typeof(tbl_Alm_Transferencia_Det))]
        public IHttpActionResult Posttbl_Alm_Transferencia_Det(tbl_Alm_Transferencia_Det tbl_Alm_Transferencia_Det)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.tbl_Alm_Transferencia_Det.Add(tbl_Alm_Transferencia_Det);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Alm_Transferencia_Det.Id_AlmTranDet }, tbl_Alm_Transferencia_Det);
        }

        // DELETE: api/tblAlmTransferenciaDet/5
        [ResponseType(typeof(tbl_Alm_Transferencia_Det))]
        public IHttpActionResult Deletetbl_Alm_Transferencia_Det(int id)
        {
            tbl_Alm_Transferencia_Det tbl_Alm_Transferencia_Det = db.tbl_Alm_Transferencia_Det.Find(id);
            if (tbl_Alm_Transferencia_Det == null)
            {
                return NotFound();
            }

            db.tbl_Alm_Transferencia_Det.Remove(tbl_Alm_Transferencia_Det);
            db.SaveChanges();

            return Ok(tbl_Alm_Transferencia_Det);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Alm_Transferencia_DetExists(int id)
        {
            return db.tbl_Alm_Transferencia_Det.Count(e => e.Id_AlmTranDet == id) > 0;
        }
    }
}