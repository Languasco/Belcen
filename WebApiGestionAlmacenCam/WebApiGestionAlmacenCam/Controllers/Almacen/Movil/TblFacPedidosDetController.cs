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
using EntityFramework.BulkInsert.Extensions;
namespace WebApiGestionAlmacenCam.Controllers.Procesos.Movil
{
    [EnableCors("*", "*", "*")]
    public class TblFacPedidosDetController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblFacPedidosDet
        public IQueryable<Tbl_Fac_Pedidos_Det> GetTbl_Fac_Pedidos_Det()
        {
            return db.Tbl_Fac_Pedidos_Det;
        }

        // GET: api/TblFacPedidosDet/5
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

        // PUT: api/TblFacPedidosDet/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTbl_Fac_Pedidos_Det(int id, Tbl_Fac_Pedidos_Det tbl_Fac_Pedidos_Det)
        {

            Tbl_Fac_Pedidos_Det tblFacPedidosDet = db.Tbl_Fac_Pedidos_Det.Find(id);
            tblFacPedidosDet.cantidad_Pedido_Det = tbl_Fac_Pedidos_Det.cantidad_Pedido_Det;
            tblFacPedidosDet.total_Pedido_Det = tbl_Fac_Pedidos_Det.total_Pedido_Det;
            db.Entry(tblFacPedidosDet).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();

            return Ok("ok");
        }

        // POST: api/TblFacPedidosDet
        [ResponseType(typeof(Tbl_Fac_Pedidos_Det))]
        public IHttpActionResult PostTbl_Fac_Pedidos_Det(List<Tbl_Fac_Pedidos_Det> tbl_Fac_Pedidos_Det)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.BulkInsert(tbl_Fac_Pedidos_Det);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Fac_Pedidos_Det[0].id_Pedido_Det }, tbl_Fac_Pedidos_Det);
        }

        // DELETE: api/TblFacPedidosDet/5
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