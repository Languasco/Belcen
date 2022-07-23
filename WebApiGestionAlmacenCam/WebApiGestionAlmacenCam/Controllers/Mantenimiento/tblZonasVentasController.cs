using Entidades;
using Negocio.Facturacion.Procesos;
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
    public class tblZonasVentasController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblLocales
        public IQueryable<tbl_Locales> Gettbl_local()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Locales.Where(al => al.estado == 1);
        }

        public object Gettbl_RutaZonas(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {

                    resul = (from a in db.tbl_Zonas_Venta
                             join b in db.tbl_Locales on a.id_Local equals b.id_Local
                             join c in db.tbl_Anexos on a.ID_ANEXOS equals c.id_Anexos
                             join d in db.tbl_Personal on a.id_Personal_Supervisor equals d.id_personal
                             join e in db.tbl_Transportista on a.id_Transportista equals e.id_Transportista
                             where a.estado == 1
                             select new
                             {
                                 a.id_ZonaVta,
                                 a.id_Local,
                                 b.nombre_Local,
                                 a.ID_ANEXOS,
                                 c.nombreAnexo,
                                 a.nombreZonaVta,
                                 a.id_Personal_Supervisor,
                                 personal_supervisor = d.nombres_personal + " " + d.apellidos_personal,
                                 a.id_Transportista,
                                 e.nombre_Transportista,
                                 a.id_CanalNegocio,
                                 a.obj_dropsize,
                                 a.obj_efectividad,
                                 a.obj_distribucion,
                                 a.estado,
                                 a.usuario_creacion,
                                 a.fecha_creacion,
                                 a.usuario_edicion,
                                 a.fecha_edicion
                             }).ToList().Take(20);
                }
                else if (opcion == 2)
                {
 
                    string[] parametros = filtro.Split('|');
                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_anexo = Convert.ToInt32(parametros[1].ToString());
                    int id_estado = Convert.ToInt32(parametros[2].ToString());
                    string buscar = parametros[3].ToString();

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_listadoMantenimiento_zonasVentas(id_local, id_anexo, id_estado, buscar);

                }
                else if (opcion == 3)
                {
                    resul = (from a in db.tbl_Transportista
                             where a.estado == 1
                             orderby a.id_Transportista descending
                             select new
                             {
                                 id = a.id_Transportista,
                                 descripcion = a.nombre_Transportista,
                                 a.modelo_vehiculo,
                                 a.nro_Placa
                             }).ToList();
                }
                else if (opcion == 4)
                {
                    resul = (from a in db.tbl_Anexos
                             where a.estado == 1
                             orderby a.id_Anexos descending
                             select new
                             {
                                id = a.id_Anexos,
                                descripcion = a.nombreAnexo
                             }).ToList();
                }
                else if (opcion == 5)
                {
                    resul = (from a in db.tbl_Personal
                             where a.estado == 1
                             orderby a.id_personal descending
                             select new
                             {
                                 id = a.id_personal,
                                 descripcion = a.nombres_personal +" "+ a.apellidos_personal
                             }).ToList();
                }
                else if (opcion == 6)
                {
                    resul = (from a in db.tbl_Locales
                             where a.estado == 1
                             orderby a.id_Local descending
                             select new
                             {
                                 id = a.id_Local,
                                 descripcion = a.nombre_Local
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


        // GET: api/tblZonasVentas/5
        [ResponseType(typeof(tbl_Zonas_Venta))]
        public IQueryable Gettbl_ZonasVentas(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Alm_Almacen.Where(al => al.estado == 1 && al.id_Local == id);
        }

        // PUT: api/tblZonaVenta/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_ZonaVenta(int id, tbl_Zonas_Venta data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //if (id != data.id_Local)
            //{
            //    return BadRequest();
            //}

            tbl_Zonas_Venta obj;
            obj = db.tbl_Zonas_Venta.Where(g => g.id_ZonaVta == data.id_ZonaVta).FirstOrDefault<tbl_Zonas_Venta>();

            obj.id_Local = data.id_Local;
            obj.ID_ANEXOS = data.ID_ANEXOS;
            obj.nombreZonaVta = data.nombreZonaVta;
            obj.id_Personal_Supervisor = data.id_Personal_Supervisor;
            obj.id_Transportista = data.id_Transportista;
            obj.id_CanalNegocio = data.id_CanalNegocio;
            obj.obj_dropsize = data.obj_dropsize;
            obj.obj_efectividad = data.obj_efectividad;
            obj.obj_distribucion = data.obj_distribucion;
            obj.estado = data.estado;
            obj.usuario_edicion = data.usuario_edicion;
            obj.fecha_edicion = DateTime.Now;

            db.Entry(obj).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_ZonaVentaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("OK");
        }

        // POST: api/tblZonaVenta
        [ResponseType(typeof(tbl_Zonas_Venta))]
        public IHttpActionResult Posttbl_Local(tbl_Zonas_Venta data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            data.fecha_creacion = DateTime.Now;
            db.tbl_Zonas_Venta.Add(data);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = data.id_ZonaVta }, data);
        }

        //// DELETE: api/tblZonaVenta/5
        [ResponseType(typeof(tbl_Locales))]
        public async Task<IHttpActionResult> Deletetbl_ZonaVenta(int id)
        {
            tbl_Zonas_Venta obj = await db.tbl_Zonas_Venta.FindAsync(id);

            obj = db.tbl_Zonas_Venta.Where(g => g.id_ZonaVta == id).FirstOrDefault<tbl_Zonas_Venta>();
            obj.estado = 0;
            db.Entry(obj).State = EntityState.Modified;
            await db.SaveChangesAsync();
            return Ok("OK");
        }



        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_ZonaVentaExists(int id)
        {
            return db.tbl_Zonas_Venta.Count(e => e.id_Local == id) > 0;
        }
    }
}
