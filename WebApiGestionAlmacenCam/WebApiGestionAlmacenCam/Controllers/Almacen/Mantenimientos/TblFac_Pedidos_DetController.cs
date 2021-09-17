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
using Negocio.Facturacion.Procesos;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Mantenimientos
{
    [EnableCors("*", "*", "*")]
    public class TblFac_Pedidos_DetController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();
        // GET: api/TblFac_Pedidos_Det
        public IQueryable<Tbl_Fac_Pedidos_Det> GetTbl_Fac_Pedidos_Det()
        {
            return db.Tbl_Fac_Pedidos_Det;
        }
        // GET: api/TblFac_Pedidos_Det/5
        [ResponseType(typeof(Tbl_Fac_Pedidos_Det))]
        public IHttpActionResult GetTbl_Fac_Pedidos_Det(int id)
        {
            Tbl_Fac_Pedidos_Det tbl_Fac_Pedidos_Det = db.Tbl_Fac_Pedidos_Det.Find(id);
            if (tbl_Fac_Pedidos_Det == null)
            {
                return NotFound();
            }

            return Ok(tbl_Fac_Pedidos_Det);
        }
        // PUT: api/TblFac_Pedidos_Det/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTbl_Fac_Pedidos_Det(int id, Tbl_Fac_Pedidos_Det obj_entidad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != obj_entidad.id_Pedido_Det)
            {
                return BadRequest();
            }

            Tbl_Fac_Pedidos_Det Ent_Pedido_Det_R;
            Ent_Pedido_Det_R = db.Tbl_Fac_Pedidos_Det.Where(g => g.id_Pedido_Det == obj_entidad.id_Pedido_Det).FirstOrDefault<Tbl_Fac_Pedidos_Det>();

            Ent_Pedido_Det_R.precioVenta_Pedido_Det= obj_entidad.precioVenta_Pedido_Det;
            Ent_Pedido_Det_R.cantidad_Pedido_Det = obj_entidad.cantidad_Pedido_Det;
            Ent_Pedido_Det_R.total_Pedido_Det = obj_entidad.total_Pedido_Det;
            Ent_Pedido_Det_R.nroLote = obj_entidad.nroLote;
            Ent_Pedido_Det_R.id_UnidadMedida_Venta = obj_entidad.id_UnidadMedida_Venta;
            Ent_Pedido_Det_R.factorMultiplicacion_Venta = obj_entidad.factorMultiplicacion_Venta;
            Ent_Pedido_Det_R.fechaProduccion = obj_entidad.fechaProduccion;
            Ent_Pedido_Det_R.fechaVencimiento = obj_entidad.fechaVencimiento;

            db.Entry(Ent_Pedido_Det_R).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
                //----Calculando los Totales
                Pedidos_BL obj_negocio = new Pedidos_BL();
                obj_negocio.Set_CalculosTotales_Pedidos( Convert.ToInt32(obj_entidad.id_Pedido_Cab));
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Tbl_Fac_Pedidos_DetExists(id))
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
        // POST: api/TblFac_Pedidos_Det
        [ResponseType(typeof(Tbl_Fac_Pedidos_Det))]
        public IHttpActionResult PostTbl_Fac_Pedidos_Det(Tbl_Fac_Pedidos_Det tbl_Fac_Pedidos_Det)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.Tbl_Fac_Pedidos_Det.Add(tbl_Fac_Pedidos_Det);
            db.SaveChanges();

            //----Calculando los Totales
            Pedidos_BL obj_negocio = new Pedidos_BL();
            obj_negocio.Set_CalculosTotales_Pedidos(Convert.ToInt32(tbl_Fac_Pedidos_Det.id_Pedido_Cab) );


            return CreatedAtRoute("DefaultApi", new { id = tbl_Fac_Pedidos_Det.id_Pedido_Det }, tbl_Fac_Pedidos_Det);
        }
        // DELETE: api/TblFac_Pedidos_Det/5
        [ResponseType(typeof(Tbl_Fac_Pedidos_Det))]
        public IHttpActionResult DeleteTbl_Fac_Pedidos_Det(int id)
        {
            Tbl_Fac_Pedidos_Det tbl_Fac_Pedidos_Det = db.Tbl_Fac_Pedidos_Det.Find(id);
            if (tbl_Fac_Pedidos_Det == null)
            {
                return NotFound();
            }

            db.Tbl_Fac_Pedidos_Det.Remove(tbl_Fac_Pedidos_Det);
            db.SaveChanges();

            return Ok(tbl_Fac_Pedidos_Det);
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
        private bool Tbl_Fac_Pedidos_DetExists(int id)
        {
            return db.Tbl_Fac_Pedidos_Det.Count(e => e.id_Pedido_Det == id) > 0;
        }
    }
}