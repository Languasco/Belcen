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
    public class tblTransportistaController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblTransportista
       public object Gettbl_Transportista()
        {
            db.Configuration.ProxyCreationEnabled = false;
             var list =(from t in db.tbl_Transportista
 
                        select new {
                            t.id_Transportista,
                            t.nombre_Transportista,
                            //v.id_vehiculo,
                            //v.marca_Vehiculo,
                            //v.modelo_Vehiculo,
                            //v.vehiculo_Placa,
                            //t.documento_Transportista,
                            //t.telefono_Transportista,
                            //t.direcion_Transportista,
                            t.estado,
                            t.usuario_Creacion,
                            t.fecha_Creacion,
                            t.usuario_Edicion,
                            t.fecha_Edicion
                            }).ToList();
            return list;
        }
        // GET: api/tblTransportista/5
        [ResponseType(typeof(tbl_Transportista))]
        public IHttpActionResult Gettbl_Transportista(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            tbl_Transportista tbl_Transportista = db.tbl_Transportista.Find(id);
            if (tbl_Transportista == null)
            {
                return NotFound();
            }

            return Ok(tbl_Transportista);
        }

        // PUT: api/tblTransportista/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Transportista(int id, tbl_Transportista object_Ent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != object_Ent.id_Transportista)
            {
                return BadRequest();
            }
            tbl_Transportista Objct_transpR;

            Objct_transpR = db.tbl_Transportista.Where(t => t.id_Transportista == object_Ent.id_Transportista).FirstOrDefault<tbl_Transportista>();
            Objct_transpR.id_Transportista = object_Ent.id_Transportista;
            //Objct_transpR.id_vehiculo = object_Ent.id_vehiculo;
            Objct_transpR.nombre_Transportista = object_Ent.nombre_Transportista;
            //Objct_transpR.documento_Transportista = object_Ent.documento_Transportista;
            //Objct_transpR.telefono_Transportista = object_Ent.telefono_Transportista;
            //Objct_transpR.direcion_Transportista = object_Ent.direcion_Transportista;
            Objct_transpR.estado = object_Ent.estado;
            Objct_transpR.usuario_Edicion = object_Ent.usuario_Creacion;
            Objct_transpR.fecha_Edicion = DateTime.Now;

            db.Entry(Objct_transpR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_TransportistaExists(id))
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

        // POST: api/tblTransportista
        [ResponseType(typeof(tbl_Transportista))]
        public IHttpActionResult Posttbl_Transportista(tbl_Transportista tbl_Transportista)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_Transportista.fecha_Creacion = DateTime.Now;
            db.tbl_Transportista.Add(tbl_Transportista);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Transportista.id_Transportista }, tbl_Transportista);
        }

        // DELETE: api/tblTransportista/5
        [ResponseType(typeof(tbl_Transportista))]
        public async  Task<IHttpActionResult> Deletetbl_Transportista(int id)
        {

            tbl_Transportista objct_ent = await db.tbl_Transportista.FindAsync(id);
            objct_ent = db.tbl_Transportista.Where(t => t.id_Transportista == id).FirstOrDefault<tbl_Transportista>();
            objct_ent.estado = 0;

            db.Entry(objct_ent).State = System.Data.Entity.EntityState.Modified;
            await db.SaveChangesAsync();

            return Ok("Ok");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_TransportistaExists(int id)
        {
            return db.tbl_Transportista.Count(e => e.id_Transportista == id) > 0;
        }
    }
}