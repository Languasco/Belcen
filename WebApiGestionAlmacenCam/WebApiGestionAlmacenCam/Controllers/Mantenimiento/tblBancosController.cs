using Entidades;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using System.Web.Mvc;

namespace WebApiGestionAlmacenCam.Controllers.Mantenimiento
{
    [EnableCors("*", "*", "*")]
    public class tblBancosController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblLocales
        public IQueryable<Tbl_Bancos> Gettbl_Bancos()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.Tbl_Bancos;
        }


        public object Gettbl_Bancos(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int estado = Convert.ToInt32(parametros[0].ToString());
                    string buscar = parametros[1].ToString();

                    resul = (from a in db.Tbl_Bancos
                             where a.estado == estado && a.nombreBanco.Contains(buscar) 
                             select new
                             {
                                 a.id_Banco,
                                 a.nombreBanco,
                                 a.estado,
                                 a.usuario_creacion,
                                 a.fecha_creacion,
                                 a.usuario_edicion,
                                 a.fecha_edicion
                             }).ToList();
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





        // PUT: api/tblLocales/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Banco(int id, Tbl_Bancos data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != data.id_Banco)
            {
                return BadRequest();
            }

            Tbl_Bancos Object_localR;
            Object_localR = db.Tbl_Bancos.Where(l => l.id_Banco == data.id_Banco).FirstOrDefault<Tbl_Bancos>();
            Object_localR.nombreBanco = data.nombreBanco;
            Object_localR.estado = data.estado;
            Object_localR.usuario_edicion = data.usuario_edicion;
            Object_localR.fecha_edicion = DateTime.Now;

            db.Entry(Object_localR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_BancosExists(id))
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

        // POST: api/tblLocales
        [ResponseType(typeof(tbl_Locales))]
        public IHttpActionResult Posttbl_Bancos(Tbl_Bancos data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            data.fecha_creacion = DateTime.Now;
            db.Tbl_Bancos.Add(data);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = data.id_Banco }, data);
        }

        // DELETE: api/tblLocales/5
        [ResponseType(typeof(tbl_Locales))]
        public async Task<IHttpActionResult> Deletetbl_Bancos(int id)
        {

            Tbl_Bancos objct_ent = await db.Tbl_Bancos.FindAsync(id);
            objct_ent.estado = 0;
            db.Entry(objct_ent).State = EntityState.Modified;
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

        private bool tbl_BancosExists(int id)
        {
            return db.Tbl_Bancos.Count(e => e.id_Banco == id) > 0;
        }
    }
}