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
    public class tblLocalesController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblLocales
        public IQueryable<tbl_Locales> Gettbl_Locales()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Locales;
        }


        public object Gettbl_Locales(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                string[] parametros = filtro.Split('|');
                int id_usuario = Convert.ToInt32(parametros[0].ToString());

                    resul = (from a in db.tbl_Locales
                             join b in db.tbl_Usuarios_Locales on a.id_Local equals b.id_Local
                             where a.estado == 1 && b.id_Usuario == id_usuario
                             select new
                             {
                               a.id_Local,
                               a.nombre_Local,
                               a.direccion_Local,
                               a.estado,
                               a.usuario_Creacion,
                               a.fecha_Creacion,
                               a.usuario_Edicion,
                               a.fecha_Edicion
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
        public IHttpActionResult Puttbl_Locales(int id, tbl_Locales object_ent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != object_ent.id_Local)
            {
                return BadRequest();
            }

            tbl_Locales Object_localR;
            Object_localR = db.tbl_Locales.Where(l => l.id_Local==object_ent.id_Local).FirstOrDefault<tbl_Locales>();
            Object_localR.id_Local = object_ent.id_Local;
            Object_localR.nombre_Local = object_ent.nombre_Local;
            Object_localR.direccion_Local = object_ent.direccion_Local;
            Object_localR.estado = object_ent.estado;
            Object_localR.usuario_Edicion = object_ent.usuario_Creacion;
            Object_localR.fecha_Edicion = DateTime.Now;

            db.Entry(Object_localR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_LocalesExists(id))
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
        public IHttpActionResult Posttbl_Locales(tbl_Locales tbl_Locales)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_Locales.fecha_Creacion = DateTime.Now;
            db.tbl_Locales.Add(tbl_Locales);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Locales.id_Local }, tbl_Locales);
        }

        // DELETE: api/tblLocales/5
        [ResponseType(typeof(tbl_Locales))]
        public async Task<IHttpActionResult> Deletetbl_Locales(int id)
        {

            tbl_Locales objct_ent = await db.tbl_Locales.FindAsync(id);
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

        private bool tbl_LocalesExists(int id)
        {
            return db.tbl_Locales.Count(e => e.id_Local == id) > 0;
        }
    }
}