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
using Negocio.Almacen.Mantenimiento;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Procesos
{
    [EnableCors("*", "*", "*")]
    public class tblAlmGuiasDetController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblAlmGuiasDet
        public object Gettbl_Alm_Guias_Det(string idGuiaCAb)
        {
            var listDetail = (from det in db.tbl_Alm_Guias_Det.AsEnumerable()
                              join pro in db.tbl_Alm_Producto on det.id_Producto equals pro.id_Producto
                              join um in db.tbl_Alm_UnidadMedida on pro.id_unidadMedida equals um.id_unidadMedida
                              join ma in db.tbl_Alm_ProductoMarca on pro.id_marcaProducto equals ma.id_marcaProducto
                              join umv in db.tbl_Alm_UnidadMedida on det.id_UnidadMedida_Ingreso equals umv.id_unidadMedida
                              where det.id_GuiaCab == Convert.ToInt32(idGuiaCAb)
                              select new
                              {
                                  det.id_GuiaCab,
                                  det.id_GuiaDet,
                                  det.id_Producto,
                                  det.precioCosto_GuiaDet,
                                  det.cantidad_GuiaDet,
                                  det.estado,
                                  pro.codigo1_Producto,
                                  pro.codigo2_Producto,
                                  pro.nombre_Producto,                                  
                                  pro.abreviatura_Producto,
                                  ma.nombre_marcaproducto,
                                  pro.id_unidadMedida,
                                  um.nombre_UnidadMedida,
                                  um.abreviatura_UnidadMedida,
                                  pro.movLote,
                                  det.nroLote,
                                  det.fechaProduccion,
                                  det.fechaVencimiento,
                                  det.id_UnidadMedida_Ingreso,
                                  nombre_UnidadMedidaI = umv.nombre_UnidadMedida,

                              }).ToList();

            return listDetail;
        }

        // GET: api/tblAlmGuiasDet/5
        //[ResponseType(typeof(tbl_Alm_Guias_Det))]
        //public IHttpActionResult Gettbl_Alm_Guias_Det(int id)
        //{
        //    db.Configuration.ProxyCreationEnabled = false;
        //    tbl_Alm_Guias_Det tbl_Alm_Guias_Det = db.tbl_Alm_Guias_Det.Find(id);
        //    if (tbl_Alm_Guias_Det == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(tbl_Alm_Guias_Det);
        //}

        public object Gettbl_Alm_Guias_Det(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int id_guiaDet = Convert.ToInt32(parametros[0].ToString());
                    decimal precio = Convert.ToDecimal(parametros[1].ToString());

                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.Set_Actualizar_Precio(id_guiaDet, precio);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idGuiaCab = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.set_habilitarGuia(idGuiaCab, idUsuario);
                }
                else
                {
                    resul = "Opcion selecciona invalida";
                }

            }
            catch (Exception ex)
            {
                resul = ex.Message;
            }
            return resul;
        }

        // PUT: api/tblAlmGuiasDet/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Alm_Guias_Det(int id, tbl_Alm_Guias_Det tbl_Alm_Guias_Det)
        {

            tbl_Alm_Guias_Det Entidad;
            Entidad = db.tbl_Alm_Guias_Det.Where(det => det.id_GuiaDet == id).FirstOrDefault<tbl_Alm_Guias_Det>();            
            Entidad.fecha_Edicion = DateTime.Now;
            Entidad.cantidad_GuiaDet = tbl_Alm_Guias_Det.cantidad_GuiaDet;
            Entidad.precioCosto_GuiaDet = tbl_Alm_Guias_Det.precioCosto_GuiaDet;

            Entidad.nroLote = tbl_Alm_Guias_Det.nroLote;
            Entidad.fechaProduccion = tbl_Alm_Guias_Det.fechaProduccion;
            Entidad.fechaVencimiento = tbl_Alm_Guias_Det.fechaVencimiento;
            Entidad.id_UnidadMedida_Ingreso = tbl_Alm_Guias_Det.id_UnidadMedida_Ingreso;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Alm_Guias_Det.id_GuiaDet)
            {
                return BadRequest();
            }

            db.Entry(Entidad).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Alm_Guias_DetExists(id))
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

        // POST: api/tblAlmGuiasDet
        [ResponseType(typeof(tbl_Alm_Guias_Det))]
        public IHttpActionResult Posttbl_Alm_Guias_Det(tbl_Alm_Guias_Det tbl_Alm_Guias_Det)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_Alm_Guias_Det.fecha_Creacion = DateTime.Now;
            tbl_Alm_Guias_Det.estado = 1;
            db.tbl_Alm_Guias_Det.Add(tbl_Alm_Guias_Det);
            db.SaveChanges();


            ///////----Actualizando numeracion----
            //////Pedidos_BL obj_negocio = new Pedidos_BL();
            ////obj_negocio.Set_numeroCorrelativo_actualizar(tbl_Alm_Guias_Det.id_GuiaDet , "N");
            ///////----Actualizando numeracion----

            return CreatedAtRoute("DefaultApi", new { id = tbl_Alm_Guias_Det.id_GuiaDet }, tbl_Alm_Guias_Det);
        }

        // DELETE: api/tblAlmGuiasDet/5
        [ResponseType(typeof(tbl_Alm_Guias_Det))]
        public IHttpActionResult Deletetbl_Alm_Guias_Det(int id)
        {
            tbl_Alm_Guias_Det tbl_Alm_Guias_Det = db.tbl_Alm_Guias_Det.Find(id);
            if (tbl_Alm_Guias_Det == null)
            {
                return NotFound();
            }

            db.tbl_Alm_Guias_Det.Remove(tbl_Alm_Guias_Det);
            db.SaveChanges();

            return Ok(tbl_Alm_Guias_Det);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Alm_Guias_DetExists(int id)
        {
            return db.tbl_Alm_Guias_Det.Count(e => e.id_GuiaDet == id) > 0;
        }
    }
}