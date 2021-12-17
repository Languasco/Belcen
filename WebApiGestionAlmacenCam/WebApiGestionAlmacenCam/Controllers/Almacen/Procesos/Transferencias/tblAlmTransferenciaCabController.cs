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
    public class tblAlmTransferenciaCabController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblAlmTransferenciaCab
        public object Gettbl_Alm_Transferencia_Cab(string value, string filter)
        {
            object list = null;
            if (value == "1")
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
                db.Configuration.ProxyCreationEnabled = false;

                list = (from cab in db.tbl_Alm_Transferencia_Cab.AsEnumerable()
                            join oloc in db.tbl_Locales on cab.origen_id_Local equals oloc.id_Local
                            join dloc in db.tbl_Locales on cab.destino_id_Local equals dloc.id_Local
                            join oalm in db.tbl_Alm_Almacen on cab.origen_id_Almacen equals oalm.id_Almacen
                            join dalm in db.tbl_Alm_Almacen on cab.destino_id_Almacen equals dalm.id_Almacen
                            where Convert.ToString(cab.origen_id_Local).Contains(idLocal) &&
                            Convert.ToString(cab.origen_id_Almacen).Contains(idAlmacen) &&
                            Convert.ToString(cab.estado).Contains(estado) && (cab.fechaEmision_TranferenciaCab >= fechaini && cab.fechaEmision_TranferenciaCab <= fechafin)
                            select new
                            {

                                cab.Id_AlmTranCab,
                                fechaEmision_TranferenciaCab = Convert.ToDateTime(cab.fechaEmision_TranferenciaCab).ToString("dd/MM/yyyy"),
                                //ORIGEN LOCAL Y ALMACEN
                                cab.origen_id_Local,
                                nombre_Local_Origen = oloc.nombre_Local,
                                cab.origen_id_Almacen,
                                nombre_Almacen_Origen = oalm.descripcion_Almacen,
                                // DESTINO LOCAL Y ALMACEN
                                cab.destino_id_Local,
                                nombre_Local_Destino = dloc.nombre_Local,
                                cab.destino_id_Almacen,
                                nombre_Almacen_Destino = dalm.descripcion_Almacen,
                                //
                                nro_transaccion =  (cab.origen_id_Local == cab.destino_id_Local) ? cab.nro_Transferencia : cab.NroDocumento_Alm_Guias_Ingreso,
                                cab.obs_TranferenciaCab,
                                cab.usuario_creacion,
                                cab.fecha_creacion,
                                cab.estado,
                                cab.NroDocumento_Alm_Guias_Ingreso,

                                cab.usuario_edicion,
                                cab.fecha_edicion


                            }).ToList();
            }
            else if(value == "2")
            {
                string[] parameters = filter.Split('|');
                string idLocal = Convert.ToString(parameters[0]);
                idLocal = idLocal == "0" ? "" : idLocal;
                string idAlmacen = Convert.ToString(parameters[1]);
                idAlmacen = idAlmacen == "0" ? "" : idAlmacen;
                int opcion = Convert.ToInt32(parameters[2]);

                db.Configuration.ProxyCreationEnabled = false;

                if (opcion == 1)
                {
                    list = (from cab in db.tbl_Alm_Transferencia_Cab.AsEnumerable()
                            join oloc in db.tbl_Locales on cab.origen_id_Local equals oloc.id_Local
                            join dloc in db.tbl_Locales on cab.destino_id_Local equals dloc.id_Local
                            join oalm in db.tbl_Alm_Almacen on cab.origen_id_Almacen equals oalm.id_Almacen
                            join dalm in db.tbl_Alm_Almacen on cab.destino_id_Almacen equals dalm.id_Almacen
                            where cab.estado == 24 && Convert.ToString(cab.origen_id_Almacen).Contains(idAlmacen)
                            && Convert.ToString(cab.origen_id_Local).Contains(idLocal)
                            select new
                            {
                                cab.Id_AlmTranCab,
                                fechaEmision_TranferenciaCab = Convert.ToDateTime(cab.fechaEmision_TranferenciaCab).ToString("dd/MM/yyyy"),
                                //ORIGEN LOCAL Y ALMACEN
                                cab.origen_id_Local,
                                nombre_Local_Origen = oloc.nombre_Local,
                                cab.origen_id_Almacen,
                                nombre_Almacen_Origen = oalm.descripcion_Almacen,
                                // DESTINO LOCAL Y ALMACEN
                                cab.destino_id_Local,
                                nombre_Local_Destino = dloc.nombre_Local,
                                cab.destino_id_Almacen,
                                nombre_Almacen_Destino = dalm.descripcion_Almacen,
                                //
                                cab.obs_TranferenciaCab,
                                cab.usuario_creacion,
                                cab.estado,
                                NroDocumento_Alm_Guias_Ingreso = ""
                            }).ToList();
                }
                if (opcion == 2)
                {
                    list = (from cab in db.tbl_Alm_Transferencia_Cab.AsEnumerable()
                            join oloc in db.tbl_Locales on cab.origen_id_Local equals oloc.id_Local
                            join dloc in db.tbl_Locales on cab.destino_id_Local equals dloc.id_Local
                            join oalm in db.tbl_Alm_Almacen on cab.origen_id_Almacen equals oalm.id_Almacen
                            join dalm in db.tbl_Alm_Almacen on cab.destino_id_Almacen equals dalm.id_Almacen
                            where cab.estado == 37 && Convert.ToString(cab.destino_id_Almacen).Contains(idAlmacen)
                            && Convert.ToString(cab.destino_id_Local).Contains(idLocal)
                            select new
                            {
                                cab.Id_AlmTranCab,
                                fechaEmision_TranferenciaCab = Convert.ToDateTime(cab.fechaEmision_TranferenciaCab).ToString("dd/MM/yyyy"),
                                //ORIGEN LOCAL Y ALMACEN
                                cab.origen_id_Local,
                                nombre_Local_Origen = oloc.nombre_Local,
                                cab.origen_id_Almacen,
                                nombre_Almacen_Origen = oalm.descripcion_Almacen,
                                // DESTINO LOCAL Y ALMACEN
                                cab.destino_id_Local,
                                nombre_Local_Destino = dloc.nombre_Local,
                                cab.destino_id_Almacen,
                                nombre_Almacen_Destino = dalm.descripcion_Almacen,
                                //
                                cab.obs_TranferenciaCab,
                                cab.usuario_creacion,
                                cab.estado,
                                cab.NroDocumento_Alm_Guias_Ingreso
                            }).ToList();
                }



            }
   

            return list;
        }

        // GET: api/tblAlmTransferenciaCab/5
        [ResponseType(typeof(tbl_Alm_Transferencia_Cab))]
        public IHttpActionResult Gettbl_Alm_Transferencia_Cab(int id)
        {
            tbl_Alm_Transferencia_Cab tbl_Alm_Transferencia_Cab = db.tbl_Alm_Transferencia_Cab.Find(id);
            if (tbl_Alm_Transferencia_Cab == null)
            {
                return NotFound();
            }

            return Ok(tbl_Alm_Transferencia_Cab);
        }

        // PUT: api/tblAlmTransferenciaCab/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Alm_Transferencia_Cab(int id, tbl_Alm_Transferencia_Cab tbl_Alm_Transferencia_Cab)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Alm_Transferencia_Cab.Id_AlmTranCab)
            {
                return BadRequest();
            }

            db.Entry(tbl_Alm_Transferencia_Cab).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Alm_Transferencia_CabExists(id))
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

        // POST: api/tblAlmTransferenciaCab
        [ResponseType(typeof(tbl_Alm_Transferencia_Cab))]
        public IHttpActionResult Posttbl_Alm_Transferencia_Cab(tbl_Alm_Transferencia_Cab tbl_Alm_Transferencia_Cab)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tbl_Alm_Transferencia_Cab.fecha_creacion = DateTime.Now;

            db.tbl_Alm_Transferencia_Cab.Add(tbl_Alm_Transferencia_Cab);
            try
            {
                db.SaveChanges();
                return CreatedAtRoute("DefaultApi", new { id = tbl_Alm_Transferencia_Cab.Id_AlmTranCab }, tbl_Alm_Transferencia_Cab);
            }
            catch (Exception)
            {
                return NotFound();                
            }            

            
        }

        // DELETE: api/tblAlmTransferenciaCab/5
        [ResponseType(typeof(tbl_Alm_Transferencia_Cab))]
        public IHttpActionResult Deletetbl_Alm_Transferencia_Cab(int id)
        {
            tbl_Alm_Transferencia_Cab tbl_Alm_Transferencia_Cab = db.tbl_Alm_Transferencia_Cab.Find(id);
            if (tbl_Alm_Transferencia_Cab == null)
            {
                return NotFound();
            }

            db.tbl_Alm_Transferencia_Cab.Remove(tbl_Alm_Transferencia_Cab);
            db.SaveChanges();

            return Ok(tbl_Alm_Transferencia_Cab);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Alm_Transferencia_CabExists(int id)
        {
            return db.tbl_Alm_Transferencia_Cab.Count(e => e.Id_AlmTranCab == id) > 0;
        }
    }
}