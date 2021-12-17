

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


namespace WebApi_Ventas.Controllers.Almacen.Mantenimientos
{
     [EnableCors("*", "*", "*")]
    public class tblAlmProveedorController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblAlmProveedor
        public IQueryable<tbl_Alm_Proveedor> Gettbl_Alm_Proveedor()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Alm_Proveedor;
        }

        // GET: api/tblAlmProveedor/5
        [ResponseType(typeof(tbl_Alm_Proveedor))]
        public IQueryable<tbl_Alm_Proveedor> Gettbl_Alm_Proveedor(string filter)
        {
            db.Configuration.ProxyCreationEnabled = false;
            if (filter == null || filter.Length == 0)
            {
                return db.tbl_Alm_Proveedor.Where(p => p.estado == 1);
            }
            else
            {
                return db.tbl_Alm_Proveedor.Where(p => p.estado == 1 && p.nroDocumento_Proveedor.Contains(filter));
            }
        }

        // PUT: api/tblAlmProveedor/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Alm_Proveedor(int id, tbl_Alm_Proveedor obj_entidad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != obj_entidad.id_Proveedor)
            {
                return BadRequest();
            }

            tbl_Alm_Proveedor Ent_proveedorR;
            Ent_proveedorR = db.tbl_Alm_Proveedor.Where(p=>p.id_Proveedor == obj_entidad.id_Proveedor).FirstOrDefault<tbl_Alm_Proveedor>();
            
 
            Ent_proveedorR.nroDocumento_Proveedor = obj_entidad.nroDocumento_Proveedor;
            Ent_proveedorR.tipoPersona_Proveedor = obj_entidad.tipoPersona_Proveedor;
            Ent_proveedorR.razonSocial_Proveedor = obj_entidad.razonSocial_Proveedor;
            Ent_proveedorR.direccion_Proveedor = obj_entidad.direccion_Proveedor;
            Ent_proveedorR.telefono1_Proveedor = obj_entidad.telefono1_Proveedor;
            Ent_proveedorR.telefono2_Proveedor = obj_entidad.telefono2_Proveedor;
            Ent_proveedorR.contacto_Proveedor = obj_entidad.contacto_Proveedor;
            Ent_proveedorR.estado = obj_entidad.estado;
            Ent_proveedorR.usuario_Edicion = obj_entidad.usuario_Creacion;
            Ent_proveedorR.fecha_Edicion = DateTime.Now;

            Ent_proveedorR.id_CondicionPago = obj_entidad.id_CondicionPago;
            Ent_proveedorR.id_Banco = obj_entidad.id_Banco;
            Ent_proveedorR.id_Moneda = obj_entidad.id_Moneda;

            Ent_proveedorR.nroCuenta = obj_entidad.nroCuenta;
            Ent_proveedorR.CCINro = obj_entidad.CCINro;
            Ent_proveedorR.email_Proveedor = obj_entidad.email_Proveedor;

            db.Entry(Ent_proveedorR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Alm_ProveedorExists(id))
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

        // POST: api/tblAlmProveedor
        [ResponseType(typeof(tbl_Alm_Proveedor))]
        public IHttpActionResult Posttbl_Alm_Proveedor(tbl_Alm_Proveedor tbl_Alm_Proveedor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            tbl_Alm_Proveedor.fecha_Creacion = DateTime.Now;
            db.tbl_Alm_Proveedor.Add(tbl_Alm_Proveedor);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Alm_Proveedor.id_Proveedor }, tbl_Alm_Proveedor);
        }

        // DELETE: api/tblAlmProveedor/5
        [ResponseType(typeof(tbl_Alm_Proveedor))]
        public async Task<IHttpActionResult> Deletetbl_Alm_Proveedor(int id)
        {
            tbl_Alm_Proveedor obj_entidad = await db.tbl_Alm_Proveedor.FindAsync(id);

            obj_entidad = db.tbl_Alm_Proveedor.Where(g => g.id_Proveedor == id).FirstOrDefault<tbl_Alm_Proveedor>();
            obj_entidad.estado = 0;
            db.Entry(obj_entidad).State = System.Data.Entity.EntityState.Modified;
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

        private bool tbl_Alm_ProveedorExists(int id)
        {
            return db.tbl_Alm_Proveedor.Count(e => e.id_Proveedor == id) > 0;
        }
    }
}