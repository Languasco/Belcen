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

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Procesos
{
    [EnableCors("*", "*", "*")]
    public class tblAlmGuiasCabController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblAlmGuiasCab
        public object Gettbl_Alm_Guias_Cab(string filter, string option)
        {

            string[] parameters = filter.Split('|');
            string idLocal = Convert.ToString(parameters[0]);
            idLocal = idLocal == "0" ? "" : idLocal;
            string idAlmacen = Convert.ToString(parameters[1]);
            idAlmacen = idAlmacen == "0" ? "" : idAlmacen;
            string estado = Convert.ToString(parameters[2]);
            estado = estado == "0" ? "" : estado;
            DateTime fechaini = Convert.ToDateTime(parameters[3]);
            DateTime fechafin = Convert.ToDateTime(parameters[4]);
            int idProceso = Convert.ToInt32(parameters[5]);
                                 

            db.Configuration.ProxyCreationEnabled = false;
            object listGuais = null;

            if (idProceso == 1)
            {
                listGuais = (from cab in db.tbl_Alm_Guias_Cab.AsEnumerable()
                             join pro in db.tbl_Alm_Proveedor on cab.id_Proveedor equals pro.id_Proveedor
                             join alm in db.tbl_Alm_Almacen on cab.id_Almacen equals alm.id_Almacen
                             join ti in db.Tbl_TipoDocumentos on cab.id_tipo_documento equals ti.id_TipoDocumento
                             join u in db.tbl_Usuarios on cab.usuario_creacion equals u.id_Usuario
                             join mov in db.tbl_Alm_Movimientos on cab.id_Movimiento equals mov.id_Movimiento
                             join mo in db.tbl_Moneda on cab.id_Moneda equals mo.id_Moneda
                             join es in db.tbl_Estados on cab.estado equals es.id_Estado

                             where cab.id_Movimiento == 1 && Convert.ToString(cab.id_Local).Contains(idLocal)
                             && Convert.ToString(cab.id_Almacen).Contains(idAlmacen) && Convert.ToString(cab.estado).Contains(estado)
                             && (cab.fechaEmision_GuiaCab >= fechaini && cab.fechaEmision_GuiaCab <= fechafin)
                             && cab.id_tipo_documento != 16
                             select new
                             {
                                 cab.id_GuiaCab,
                                 cab.estado,
                                 cab.numero_GuiaCab,
                                 fechaEmision_GuiaCab = Convert.ToDateTime(cab.fechaEmision_GuiaCab).ToString("dd/MM/yyyy"),
                                 cab.id_Almacen,
                                 cab.TipoMovimiento,
                                 cab.id_Proveedor,
                                 pro.nroDocumento_Proveedor,
                                 pro.razonSocial_Proveedor,
                                 alm.descripcion_Almacen,
                                 alm.direccion_Almacen,
                                 cab.id_Moneda,
                                 cab.tipoCambio_GuiaCab,
                                 cab.obs_GuiaCab,
                                 cab.id_Local,
                                 cab.nro_orden_compra,
                                 fecha_guia = Convert.ToDateTime(cab.fecha_guia).ToString("dd/MM/yyyy"),
                                 fecha_emision_oc = Convert.ToDateTime(cab.fecha_emision_oc).ToString("dd/MM/yyyy"),
                                 cab.nro_guia_remision,
                                 fecha_emision = Convert.ToDateTime(cab.fecha_emision).ToString("dd/MM/yyyy"),
                                 cab.nro_documento,
                                 cab.id_tipo_documento,
                                 fecha_creacion = Convert.ToDateTime(cab.fecha_creacion).ToString("dd/MM/yyyy hh:mm"),
                                 des_tipo_documento = ti.Descripcion_TipoDocumento,
                                 usuario_creacion = (u.apellidos_usuario + " " + u.nombres_usuario),
                                 des_movimiento = (mov.descripcion_Movimiento),
                                 des_moneda = mo.nombre_mone,
                                 des_estado = es.nombre_estado

                             }).ToList();
            }
            else {
                listGuais = (from cab in db.tbl_Alm_Guias_Cab.AsEnumerable()
                             join pro in db.tbl_Alm_Proveedor on cab.id_Proveedor equals pro.id_Proveedor
                             join alm in db.tbl_Alm_Almacen on cab.id_Almacen equals alm.id_Almacen
                             join ti in db.Tbl_TipoDocumentos on cab.id_tipo_documento equals ti.id_TipoDocumento
                             join u in db.tbl_Usuarios on cab.usuario_creacion equals u.id_Usuario
                             join mov in db.tbl_Alm_Movimientos on cab.id_Movimiento equals mov.id_Movimiento
                             join mo in db.tbl_Moneda on cab.id_Moneda equals mo.id_Moneda
                             join es in db.tbl_Estados on cab.estado equals es.id_Estado

                             where cab.id_Movimiento == 1 && Convert.ToString(cab.id_Local).Contains(idLocal)
                             && Convert.ToString(cab.id_Almacen).Contains(idAlmacen) && Convert.ToString(cab.estado).Contains(estado)
                             && (cab.fechaEmision_GuiaCab >= fechaini && cab.fechaEmision_GuiaCab <= fechafin) && cab.id_tipo_documento == 16
                             select new
                             {
                                 cab.id_GuiaCab,
                                 cab.estado,
                                 cab.numero_GuiaCab,
                                 fechaEmision_GuiaCab = Convert.ToDateTime(cab.fechaEmision_GuiaCab).ToString("dd/MM/yyyy"),
                                 cab.id_Almacen,
                                 cab.TipoMovimiento,
                                 cab.id_Proveedor,
                                 pro.nroDocumento_Proveedor,
                                 pro.razonSocial_Proveedor,
                                 alm.descripcion_Almacen,
                                 alm.direccion_Almacen,
                                 cab.id_Moneda,
                                 cab.tipoCambio_GuiaCab,
                                 cab.obs_GuiaCab,
                                 cab.id_Local,
                                 cab.nro_orden_compra,
                                 fecha_guia = Convert.ToDateTime(cab.fecha_guia).ToString("dd/MM/yyyy"),
                                 fecha_emision_oc = Convert.ToDateTime(cab.fecha_emision_oc).ToString("dd/MM/yyyy"),
                                 cab.nro_guia_remision,
                                 fecha_emision = Convert.ToDateTime(cab.fecha_emision).ToString("dd/MM/yyyy"),
                                 cab.nro_documento,
                                 cab.id_tipo_documento,
                                 fecha_creacion = Convert.ToDateTime(cab.fecha_creacion).ToString("dd/MM/yyyy hh:mm"),
                                 des_tipo_documento = ti.Descripcion_TipoDocumento,
                                 usuario_creacion = (u.apellidos_usuario + " " + u.nombres_usuario),
                                 des_movimiento = (mov.descripcion_Movimiento),
                                 des_moneda = mo.nombre_mone,
                                 des_estado = es.nombre_estado

                             }).ToList();
            }          




            return listGuais;
        }

        // GET: api/tblAlmGuiasCab/5
        [ResponseType(typeof(tbl_Alm_Guias_Cab))]
        public IHttpActionResult Gettbl_Alm_Guias_Cab(string nroGuia)
        {
            db.Configuration.ProxyCreationEnabled = false;
            tbl_Alm_Guias_Cab tbl_Alm_Guias_Cab = db.tbl_Alm_Guias_Cab.Where(g => g.nro_documento == nroGuia).FirstOrDefault();
            if (tbl_Alm_Guias_Cab == null)
            {
                return Ok(false);
            }

            return Ok(true);
        }

        // PUT: api/tblAlmGuiasCab/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Alm_Guias_Cab(int id, tbl_Alm_Guias_Cab tbl_Alm_Guias_Cab)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Alm_Guias_Cab.id_GuiaCab)
            {
                return BadRequest();
            }

            db.Entry(tbl_Alm_Guias_Cab).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Alm_Guias_CabExists(id))
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

        // POST: api/tblAlmGuiasCab
        [ResponseType(typeof(tbl_Alm_Guias_Cab))]
        public IHttpActionResult Posttbl_Alm_Guias_Cab(tbl_Alm_Guias_Cab objtbl_Alm_Guias_Cab)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.Configuration.ProxyCreationEnabled = false;
            tbl_Alm_Guias_Cab Entidad;
            Entidad = db.tbl_Alm_Guias_Cab.Where(det => det.id_GuiaCab == objtbl_Alm_Guias_Cab.id_GuiaCab).FirstOrDefault<tbl_Alm_Guias_Cab>();
            if (Entidad == null)
            {
                //if (objtbl_Alm_Guias_Cab.id_tipo_documento == 16)
                //{
                //    var objGuias = (from u in db.tbl_Alm_Guias_Cab
                //               where u.id_tipo_documento == 16
                //               orderby u.nro_documento descending
                //               select u).Take(1).ToList();

                //    if (objGuias.Count > 0)
                //    {
                //        int num = Convert.ToInt32(objGuias[0].nro_documento);
                //        int corr = (num + 1);
                //        objtbl_Alm_Guias_Cab.nro_documento = (corr).ToString();   
                //    }
                //    else {
                //        objtbl_Alm_Guias_Cab.nro_documento = "100";
                //    }
                //}

                // SI NO EXISTE, GUARDAMOS
                objtbl_Alm_Guias_Cab.fecha_creacion = DateTime.Now;
                db.tbl_Alm_Guias_Cab.Add(objtbl_Alm_Guias_Cab);
                db.SaveChanges();

                return CreatedAtRoute("DefaultApi", new { id = objtbl_Alm_Guias_Cab.id_GuiaCab }, objtbl_Alm_Guias_Cab);
            }
            else
            {
                Entidad.fechaEmision_GuiaCab = objtbl_Alm_Guias_Cab.fechaEmision_GuiaCab;
                Entidad.id_Moneda = objtbl_Alm_Guias_Cab.id_Moneda;
                Entidad.tipoCambio_GuiaCab = objtbl_Alm_Guias_Cab.tipoCambio_GuiaCab;
                Entidad.obs_GuiaCab = objtbl_Alm_Guias_Cab.obs_GuiaCab;
                Entidad.fecha_edicion = DateTime.Now;
                Entidad.usuario_edicion = objtbl_Alm_Guias_Cab.usuario_creacion;
                Entidad.id_Proveedor = objtbl_Alm_Guias_Cab.id_Proveedor;
                Entidad.id_tipo_documento = objtbl_Alm_Guias_Cab.id_tipo_documento;
                Entidad.nro_documento = objtbl_Alm_Guias_Cab.nro_documento;
                Entidad.nro_guia_remision = objtbl_Alm_Guias_Cab.nro_guia_remision;
                Entidad.fecha_emision = objtbl_Alm_Guias_Cab.fecha_emision;
                Entidad.nro_orden_compra = objtbl_Alm_Guias_Cab.nro_orden_compra;
                Entidad.fecha_guia = objtbl_Alm_Guias_Cab.fecha_guia;
                Entidad.fecha_emision_oc = objtbl_Alm_Guias_Cab.fecha_emision_oc;
                db.Entry(Entidad).State = EntityState.Modified;
                db.SaveChanges();
                return CreatedAtRoute("DefaultApi", new { id = objtbl_Alm_Guias_Cab.id_GuiaCab }, objtbl_Alm_Guias_Cab);
                // SI EXISTE , ACTUALIZAMOS
            }



        }

        // DELETE: api/tblAlmGuiasCab/5
        [ResponseType(typeof(tbl_Alm_Guias_Cab))]
        public IHttpActionResult Deletetbl_Alm_Guias_Cab(int id, int estado)
        {

            tbl_Alm_Guias_Cab Entidad;
            Entidad = db.tbl_Alm_Guias_Cab.Where(det => det.id_GuiaCab == id).FirstOrDefault<tbl_Alm_Guias_Cab>();
            Entidad.estado = estado;
            db.Entry(Entidad).State = EntityState.Modified;

            try
            {
                db.SaveChanges();

                return Ok("success");

            }
            catch (Exception)
            {

                return Ok("error");
            }

        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Alm_Guias_CabExists(int id)
        {
            return db.tbl_Alm_Guias_Cab.Count(e => e.id_GuiaCab == id) > 0;
        }
    }
}