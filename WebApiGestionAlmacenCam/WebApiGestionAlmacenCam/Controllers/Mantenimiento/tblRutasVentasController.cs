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
    public class tblRutasVentasController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblRuta
        public IQueryable<tbl_Ruta_Venta> Gettbl_ruta()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Ruta_Venta.Where(al => al.estado == 1);
        }

        public object Gettbl_RutaZonas(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {

                    resul = (from a in db.tbl_Ruta_Venta
                             join b in db.tbl_Personal on a.id_Personal_Vendedor equals b.id_personal
                             join c in db.tbl_Zonas_Venta on a.id_ZonaVta equals c.id_ZonaVta
                             join d in db.tbl_Personal on a.id_Personal_Supervisor equals d.id_personal
                             join e in db.tbl_Estados on a.estado equals e.id_Estado
                             where a.estado == 1
                             select new
                             {
                                 a.id_RutaVta,
                                 a.nombreRutaVta,
                                 a.id_Personal_Vendedor,
                                 personal_vendedor_nombre = b.nombres_personal + " " + b.apellidos_personal,
                                 a.id_ZonaVta,
                                 c.nombreZonaVta,
                                 a.id_Personal_Supervisor,
                                 personal_supervisor_nombre = d.nombres_personal + " " + d.apellidos_personal,
                                 a.id_CanalNegocio,
                                 a.meta_vtauni,
                                 a.meta_vtasol,
                                 a.DropSize,
                                 a.ObjEfectividad,
                                 a.ObjAcumVisitas,
                                 a.ObjDistribucion,
                                 a.ObjNewClientes,
                                 a.estado,
                                 e.nombre_estado,
                                 a.usuario_creacion,
                                 a.usuario_edicion,
                                 usuario = b.nombreUsario_personal
                             }).ToList().Take(20);
                }
                else if (opcion == 2)
                {
 
                    string[] parametros = filtro.Split('|');
                    int id_zona = Convert.ToInt32(parametros[0].ToString());
                    int id_supervisor = Convert.ToInt32(parametros[1].ToString());
                    int id_estado = Convert.ToInt32(parametros[2].ToString());
                    string buscar = parametros[3].ToString();

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_listadoMantenimientoRutas(id_zona, id_supervisor, id_estado, buscar);
                }
                else if(opcion == 3)
                {
                    resul = (from a in db.tbl_Personal
                             where a.estado == 1
                             orderby a.id_personal descending
                             select new
                             {
                                 a.id_personal,
                                 a.codigo_personal,                              
                                 a.nombres_personal,
                                 a.apellidos_personal
                             }).ToList();
                }
                else if (opcion == 4)
                {
                    resul = (from a in db.tbl_Zonas_Venta
                             where a.estado == 1
                             orderby a.id_ZonaVta descending
                             select new
                             {
                                 a.id_ZonaVta,
                                 a.nombreZonaVta
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


        // GET: api/tblRutasVentas/5
        [ResponseType(typeof(tbl_Ruta_Venta))]
        public IQueryable Gettbl_RutaVenta(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Ruta_Venta.Where(al => al.estado == 1 && al.id_RutaVta == id);
        }

        // PUT: api/tblRutaVenta/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_rutaVenta(int id, tbl_Ruta_Venta data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != data.id_RutaVta)
            {
                return BadRequest();
            }

            tbl_Ruta_Venta obj;
            obj = db.tbl_Ruta_Venta.Where(g => g.id_RutaVta == data.id_RutaVta).FirstOrDefault<tbl_Ruta_Venta>();

            obj.nombreRutaVta = data.nombreRutaVta;
            obj.id_Personal_Vendedor = data.id_Personal_Vendedor;
            obj.id_ZonaVta = data.id_ZonaVta;
            obj.id_Personal_Supervisor = data.id_Personal_Supervisor;
            obj.id_CanalNegocio = data.id_CanalNegocio;
            obj.meta_vtauni = data.meta_vtauni;
            obj.meta_vtasol = data.meta_vtasol;
            obj.DropSize = data.DropSize;
            obj.ObjEfectividad = data.ObjEfectividad;
            obj.ObjDistribucion = data.ObjDistribucion;
            obj.ObjAcumVisitas = data.ObjAcumVisitas;
            obj.ObjNewClientes = data.ObjNewClientes;
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
                if (!tbl_RutaVentaExists(id))
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

        // POST: api/tblRutaVenta
        [ResponseType(typeof(tbl_Ruta_Venta))]
        public IHttpActionResult Posttbl_RutaVenta(tbl_Ruta_Venta data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            data.fecha_creacion = DateTime.Now;
            db.tbl_Ruta_Venta.Add(data);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = data.id_RutaVta }, data);
        }

        //// DELETE: api/tblRutaVenta/5
        [ResponseType(typeof(tbl_Ruta_Venta))]
        public async Task<IHttpActionResult> Deletetbl_RutaVenta(int id)
        {
            tbl_Ruta_Venta obj = await db.tbl_Ruta_Venta.FindAsync(id);

            obj = db.tbl_Ruta_Venta.Where(g => g.id_RutaVta == id).FirstOrDefault<tbl_Ruta_Venta>();
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

        private bool tbl_RutaVentaExists(int id)
        {
            return db.tbl_Ruta_Venta.Count(e => e.id_RutaVta == id) > 0;
        }
    }
}
