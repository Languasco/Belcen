using Entidades;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;

namespace WebApiGestionAlmacenCam.Controllers.Mantenimiento
{
    [EnableCors("*", "*", "*")]
    public class tblAnexosController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblAnexos
        public IQueryable<tbl_Anexos> Gettbl_Anexos()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Anexos;
        }

        public object Gettbl_AnexosFiltro(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    resul = (from a in db.tbl_Anexos
                             where a.estado == 1
                             select new
                             {
                                 a.id_Anexos,
                                 a.nombreGrupo,
                                 a.nombreAnexo,
                                 a.estado,
                                 a.direccionAnexo,
                                 a.emailAnexo,
                                 a.celularAnexo,
                                 a.RUTA,
                                 a.TOKEN,
                                 a.usuario_creacion,
                                 a.usuario_edicion

                             }).ToList().Take(20);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int id_estado = Convert.ToInt32(parametros[0].ToString());
                    string buscar = parametros[1].ToString();

                    if(buscar == "")
                    {
                        resul = (from a in db.tbl_Anexos
                                 where a.estado == id_estado
                                 select new
                                 {
                                     a.id_Anexos,
                                     a.nombreGrupo,
                                     a.nombreAnexo,
                                     a.estado,
                                     a.direccionAnexo,
                                     a.emailAnexo,
                                     a.celularAnexo,
                                     a.RUTA,
                                     a.TOKEN,
                                     a.usuario_creacion,
                                     a.usuario_edicion

                                 }).ToList().Take(20);
                    }
                    else
                    {
                        resul = (from a in db.tbl_Anexos
                                 where a.estado == id_estado && a.nombreGrupo.StartsWith(buscar) || a.nombreAnexo.StartsWith(buscar) || a.direccionAnexo.StartsWith(buscar) || a.emailAnexo.StartsWith(buscar)
                                 select new
                                 {
                                     a.id_Anexos,
                                     a.nombreGrupo,
                                     a.nombreAnexo,
                                     a.estado,
                                     a.direccionAnexo,
                                     a.emailAnexo,
                                     a.celularAnexo,
                                     a.RUTA,
                                     a.TOKEN,
                                     a.usuario_creacion,
                                     a.usuario_edicion

                                 }).ToList().Take(20);
                    }

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


        // PUT: api/tblAnexos/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Anexos(int id, tbl_Anexos data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != data.id_Anexos)
            {
                return BadRequest();
            }

            tbl_Anexos obj;
            obj = db.tbl_Anexos.Where(l => l.id_Anexos == data.id_Anexos).FirstOrDefault<tbl_Anexos>();
            obj.nombreAnexo = data.nombreAnexo;
            obj.nombreGrupo = data.nombreGrupo;
            obj.estado = data.estado;
            obj.usuario_edicion = data.usuario_edicion;
            obj.direccionAnexo = data.direccionAnexo;
            obj.emailAnexo = data.emailAnexo;
            obj.celularAnexo = data.celularAnexo;
            obj.RUTA = data.RUTA;
            obj.TOKEN = data.TOKEN;
            obj.fecha_edicion = DateTime.Now;
            db.Entry(obj).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_AnexosExists(id))
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

        // POST: api/tblAnexos
        [ResponseType(typeof(tbl_Anexos))]
        public IHttpActionResult Posttbl_Locales(tbl_Anexos data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            data.fecha_creacion = DateTime.Now;
            db.tbl_Anexos.Add(data);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = data.id_Anexos }, data);
        }

        // DELETE: api/tblAnexos/5
        [ResponseType(typeof(tbl_Anexos))]
        public async Task<IHttpActionResult> Deletetbl_Anexos(int id)
        {

            tbl_Anexos objct_ent = await db.tbl_Anexos.FindAsync(id);
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

        private bool tbl_AnexosExists(int id)
        {
            return db.tbl_Anexos.Count(e => e.id_Anexos == id) > 0;
        }
    }
}
