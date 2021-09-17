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

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Mantenimientos
{
    [EnableCors("*", "*", "*")]
    public class tblEmpresasController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblEmpresas
        public IQueryable<tbl_Empresas> Gettbl_Empresas()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Empresas;
        }

        // GET: api/tblEmpresas/5
        [ResponseType(typeof(tbl_Empresas))]
        public IHttpActionResult Gettbl_Empresas(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            tbl_Empresas tbl_Empresas = db.tbl_Empresas.Find(id);
            if (tbl_Empresas == null)
            {
                return NotFound();
            }

            return Ok(tbl_Empresas);
        }

        // PUT: api/tblEmpresas/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Empresas(int id, tbl_Empresas tbl_Empresas)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Empresas.id_Empresa)
            {
                return BadRequest();
            }

            db.Entry(tbl_Empresas).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_EmpresasExists(id))
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

        // POST: api/tblEmpresas
        [ResponseType(typeof(tbl_Empresas))]
        public IHttpActionResult Posttbl_Empresas(tbl_Empresas tbl_Empresas)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.tbl_Empresas.Add(tbl_Empresas);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Empresas.id_Empresa }, tbl_Empresas);
        }

        // DELETE: api/tblEmpresas/5
        [ResponseType(typeof(tbl_Empresas))]
        public IHttpActionResult Deletetbl_Empresas(int id)
        {
            tbl_Empresas tbl_Empresas = db.tbl_Empresas.Find(id);
            if (tbl_Empresas == null)
            {
                return NotFound();
            }

            db.tbl_Empresas.Remove(tbl_Empresas);
            db.SaveChanges();

            return Ok(tbl_Empresas);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_EmpresasExists(int id)
        {
            return db.tbl_Empresas.Count(e => e.id_Empresa == id) > 0;
        }
    }
}