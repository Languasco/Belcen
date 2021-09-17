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
    public class TblFacPedidosCabController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblFacPedidosCab
        public object GetTbl_Fac_Pedidos_Cab(string idPersonal, int estado)
        {
           
            int id_personal = Convert.ToInt32(idPersonal);
            DateTime fromDate = DateTime.Now;
            string dateConvert = fromDate.ToString("yyyy-MM-dd");
            fromDate = Convert.ToDateTime(dateConvert);
            var list = (from pca in db.Tbl_Fac_Pedidos_Cab
                        join cli in db.Tbl_Clientes on pca.codigoInterno_Suministro equals cli.codigoInterno_Cliente
                        join doc in db.Tbl_TipoDocumentos on pca.id_TipoDocumento equals doc.id_TipoDocumento
                        where pca.id_PersonalVendedor == id_personal && pca.estado == estado
                        //where pca.fechaEmision_Pedido_Cab >= fromDate && pca.id_PersonalVendedor == id_personal && pca.estado == estado
                        select new
                        {
                            pca.id_Pedido_Cab,
                            pca.id_Almacen,
                            pca.id_empresa,
                            pca.id_PuntoVenta,
                            pca.id_cuadrilla,
                            pca.id_PersonalVendedor,
                            pca.id_moneda,
                            pca.Sub_Total_Pedido_Cab,
                            pca.total_Igv_Pedido_Cab,
                            pca.total_Neto_Pedido_Cab,
                            pca.latitud_Pedido_Cab,
                            pca.longitud_Pedido_Cab,
                            pca.fechaEmision_Pedido_Cab,
                            cli.id_cliente,
                            cli.nroDoc_Cliente,
                            cli.apellidosNombre_Cliente,
                            cli.direccion_Cliente,
                            doc.id_TipoDocumento,
                            descripcion_TipoDocumento = doc.Descripcion_TipoDocumento,
                            pca.id_FormaPago,
                            pca.observaciones_Pedido_Cab,
                            pca.estado,
                            pca.codigoInterno_Cliente,
                            pca.Numero_Documento
                        }).ToList();

            return list;
        }

        // GET: api/TblFacPedidosCab/5
        [ResponseType(typeof(Tbl_Fac_Pedidos_Cab))]
        public IHttpActionResult GetTbl_Fac_Pedidos_Cab(int id)
        {
            Tbl_Fac_Pedidos_Cab tbl_Fac_Pedidos_Cab = db.Tbl_Fac_Pedidos_Cab.Find(id);
            if (tbl_Fac_Pedidos_Cab == null)
            {
                return NotFound();
            }

            return Ok(tbl_Fac_Pedidos_Cab);
        }

        // PUT: api/TblFacPedidosCab/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTbl_Fac_Pedidos_Cab(List<Tbl_Fac_Pedidos_Cab> tbl_Fac_Pedidos_Cab)
        {
            string fechaUltimoPago = "";
            foreach (var item in tbl_Fac_Pedidos_Cab)
            {
                int idcab = Convert.ToInt32(item.Numero_Pedido);
                Tbl_Fac_Pedidos_Cab TblFacPedidosCab = db.Tbl_Fac_Pedidos_Cab.Find(idcab);
                //tblClientes = db.Tbl_Clientes.Where(g => g.id_cliente == id).FirstOrDefault<Tbl_Clientes>();
                TblFacPedidosCab.estado = item.estado;
                db.Entry(TblFacPedidosCab).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                Tbl_Fac_Facturas_Cab tblFacFacturasCab = db.Tbl_Fac_Facturas_Cab.First(g => g.id_Pedido_Cab == idcab);
                tblFacFacturasCab.estado = item.estado;
                DateTime dateNow = DateTime.Now;
                fechaUltimoPago = dateNow.ToString("dd/MM/yyyy");
                tblFacFacturasCab.fechaCancelacion_Factura_Cab = DateTime.Now;
                //tblFacFacturasCab.fechaUltimoPago_Factura_Cab = fechaUltimoPago;
                tblFacFacturasCab.total_pagos_Factura_Cab = tblFacFacturasCab.total_Neto_Factura_Cab;
                db.Entry(tblFacFacturasCab).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
                
            }
            return Ok(fechaUltimoPago);
        }

        // POST: api/TblFacPedidosCab
        [ResponseType(typeof(Tbl_Fac_Pedidos_Cab))]
        public IHttpActionResult PostTbl_Fac_Pedidos_Cab(List<Tbl_Fac_Pedidos_Cab> tbl_Fac_Pedidos_Cab)
        {
/*            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }*/
            foreach (var item in tbl_Fac_Pedidos_Cab)
            {
                item.fecha_creacion = DateTime.Now;
                item.fechaEmision_Pedido_Cab = DateTime.Now;
                item.usuario_creacion = item.id_PersonalVendedor;
                item.fechaEntrega_Pedido_Cab = DateTime.Now;
                item.estado = 29;
                item.id_PuntoVenta = item.id_Local;
                item.imprime_pedido = "SI";
                /*item.id_Almacen = db.tbl_Alm_Almacen.Where(al => al.id_Local == item.id_Local && al.Alm_Movil == "SI")
                    .Select(al => al.id_Almacen).FirstOrDefault();*/
            }
            db.BulkInsert(tbl_Fac_Pedidos_Cab);
            db.SaveChanges();
            return CreatedAtRoute("DefaultApi", new { id = tbl_Fac_Pedidos_Cab[0].id_Pedido_Cab }, tbl_Fac_Pedidos_Cab);
        }

        // DELETE: api/TblFacPedidosCab/5
        [ResponseType(typeof(Tbl_Fac_Pedidos_Cab))]
        public IHttpActionResult DeleteTbl_Fac_Pedidos_Cab(List<Tbl_Fac_Pedidos_Cab> listPedidoCaB)
        {
            foreach (var item in listPedidoCaB)
            {
                Tbl_Fac_Pedidos_Cab TblFacPedidosCab = db.Tbl_Fac_Pedidos_Cab.Find(item.Numero_Pedido);
                //tblClientes = db.Tbl_Clientes.Where(g => g.id_cliente == id).FirstOrDefault<Tbl_Clientes>();
                TblFacPedidosCab.estado = item.estado;
                db.Entry(TblFacPedidosCab).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
            }
            return Ok("ok");

        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Tbl_Fac_Pedidos_CabExists(int id)
        {
            return db.Tbl_Fac_Pedidos_Cab.Count(e => e.id_Pedido_Cab == id) > 0;
        }
    }
}