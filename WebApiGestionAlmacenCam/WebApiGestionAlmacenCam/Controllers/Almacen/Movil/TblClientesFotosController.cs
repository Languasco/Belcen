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

namespace WebApiGestionAlmacenCam.Controllers.Mantenimientos
{
     [EnableCors("*", "*", "*")]
    public class TblClientesFotosController : ApiController
    {
         private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblClientesFotos
        public object GetTbl_Clientes_Fotos(string idPersonal)
        {
            int idPer = Convert.ToInt32(idPersonal);
            var list = (from a in db.Tbl_Clientes_Fotos
                        join cli in db.Tbl_Clientes on a.codigoInterno_Cliente equals cli.codigoInterno_Cliente
                        where cli.id_PersonalVendedor == idPer
                        select new
                        {
                            a.id_cliente_foto,
                            a.id_cliente,
                            a.nom_foto,
                            a.url_foto,
                            a.fecha_creacion,
                            a.estado,
                            a.codigoInterno_Cliente

                        }).ToList();

            return db.Tbl_Clientes_Fotos;
        }

        // GET: api/TblClientesFotos/5
        [ResponseType(typeof(Tbl_Clientes_Fotos))]
        public IHttpActionResult GetTbl_Clientes_Fotos(int id,string codigoInterno)
        {
            db.Configuration.ProxyCreationEnabled = false;
            IEnumerable<Tbl_Clientes_Fotos> tbl_Clientes_Fotos = db.Tbl_Clientes_Fotos.Where(g => g.codigoInterno_Cliente == codigoInterno);
            if (tbl_Clientes_Fotos == null)
            {
                return NotFound();
            }

            return Ok(tbl_Clientes_Fotos);
        }

        // PUT: api/TblClientesFotos/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTbl_Clientes_Fotos(int id, Tbl_Clientes_Fotos tbl_Clientes_Fotos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Clientes_Fotos.id_cliente_foto)
            {
                return BadRequest();
            }

            db.Entry(tbl_Clientes_Fotos).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Tbl_Clientes_FotosExists(id))
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

        // POST: api/TblClientesFotos
        [ResponseType(typeof(Tbl_Clientes_Fotos))]
        public IHttpActionResult PostTbl_Clientes_Fotos(List<Tbl_Clientes_Fotos> tbl_Clientes_Fotos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            foreach (var item in tbl_Clientes_Fotos)
            {
                item.fecha_creacion = DateTime.Now;
                item.estado = 1;                
            }
            db.BulkInsert(tbl_Clientes_Fotos);
            db.SaveChanges();          
            return CreatedAtRoute("DefaultApi", new { id = tbl_Clientes_Fotos[0].id_cliente_foto }, tbl_Clientes_Fotos);
        }

        // DELETE: api/TblClientesFotos/5
        [ResponseType(typeof(Tbl_Clientes_Fotos))]
        public IHttpActionResult DeleteTbl_Clientes_Fotos(int id)
        {
            Tbl_Clientes_Fotos tbl_Clientes_Fotos = db.Tbl_Clientes_Fotos.Find(id);
            if (tbl_Clientes_Fotos == null)
            {
                return NotFound();
            }

            db.Tbl_Clientes_Fotos.Remove(tbl_Clientes_Fotos);
            db.SaveChanges();

            return Ok(tbl_Clientes_Fotos);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Tbl_Clientes_FotosExists(int id)
        {
            return db.Tbl_Clientes_Fotos.Count(e => e.id_cliente_foto == id) > 0;
        }
    }
}