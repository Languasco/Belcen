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
    public class tblCom_ClienteController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblCom_Cliente
        public IQueryable<tbl_Com_Cliente> Gettbl_Com_Cliente()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Com_Cliente;
        }

        // GET: api/tblCom_Cliente/5
        [ResponseType(typeof(tbl_Com_Cliente))]
        public IHttpActionResult Gettbl_Com_Cliente(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            tbl_Com_Cliente tbl_Com_Cliente = db.tbl_Com_Cliente.Find(id);
            if (tbl_Com_Cliente == null)
            {
                return NotFound();
            }

            return Ok(tbl_Com_Cliente);
        }

        // PUT: api/tblCom_Cliente/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Com_Cliente(int id, tbl_Com_Cliente obj_entidad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != obj_entidad.id_cliente)
            {
                return BadRequest();
            }
            tbl_Com_Cliente Ent_clienteR;
            Ent_clienteR = db.tbl_Com_Cliente.Where(g => g.id_cliente  == obj_entidad.id_cliente ).FirstOrDefault<tbl_Com_Cliente>();

            Ent_clienteR.codigo_cliente = obj_entidad.codigo_cliente;
            Ent_clienteR.tipoDocumento = obj_entidad.tipoDocumento;
            Ent_clienteR.nroDocumento = obj_entidad.nroDocumento;
            Ent_clienteR.razonSocial_Cliente = obj_entidad.razonSocial_Cliente;
            Ent_clienteR.razonComercial_Cliente = obj_entidad.razonComercial_Cliente;
            Ent_clienteR.contacto_Cliente = obj_entidad.contacto_Cliente;

            Ent_clienteR.id_GiroNegocio = obj_entidad.id_GiroNegocio;
            Ent_clienteR.id_CanalNegocio = obj_entidad.id_CanalNegocio;
            Ent_clienteR.direccion_Cliente = obj_entidad.direccion_Cliente;
            Ent_clienteR.id_ubigeo = obj_entidad.id_ubigeo;
            Ent_clienteR.referencia_Cliente = obj_entidad.referencia_Cliente;
            Ent_clienteR.direccionEntrega_Cliente = obj_entidad.direccionEntrega_Cliente;
            Ent_clienteR.id_ubigeoEntrega = obj_entidad.id_ubigeoEntrega;

            Ent_clienteR.referenciaEntrega_Cliente = obj_entidad.referenciaEntrega_Cliente;
            Ent_clienteR.telefono1_Cliente = obj_entidad.telefono1_Cliente;
            Ent_clienteR.telefono2_Cliente = obj_entidad.telefono2_Cliente;
            Ent_clienteR.email_Cliente = obj_entidad.email_Cliente;
            Ent_clienteR.importeMaximoCredito_Cliente = obj_entidad.importeMaximoCredito_Cliente; 

            Ent_clienteR.estado = obj_entidad.estado;
            Ent_clienteR.usuario_Edicion = obj_entidad.usuario_Creacion;
            Ent_clienteR.fecha_Edicion = DateTime.Now;

            db.Entry(Ent_clienteR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Com_ClienteExists(id))
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

        // POST: api/tblCom_Cliente
        [ResponseType(typeof(tbl_Com_Cliente))]
        public IHttpActionResult Posttbl_Com_Cliente(tbl_Com_Cliente tbl_Com_Cliente)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tbl_Com_Cliente.fecha_Creacion = DateTime.Now;
            db.tbl_Com_Cliente.Add(tbl_Com_Cliente);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Com_Cliente.id_cliente }, tbl_Com_Cliente);
        }

        // DELETE: api/tblCom_Cliente/5
        [ResponseType(typeof(tbl_Com_Cliente))]
        public async Task<IHttpActionResult> Deletetbl_Com_Cliente(int id)
        {
            tbl_Com_Cliente obj_entidad = await db.tbl_Com_Cliente.FindAsync(id);

            obj_entidad = db.tbl_Com_Cliente.Where(g => g.id_cliente  == id).FirstOrDefault<tbl_Com_Cliente>();
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

        private bool tbl_Com_ClienteExists(int id)
        {
            return db.tbl_Com_Cliente.Count(e => e.id_cliente == id) > 0;
        }
    }
}