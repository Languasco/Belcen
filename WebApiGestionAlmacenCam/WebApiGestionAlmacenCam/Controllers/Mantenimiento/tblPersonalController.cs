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
    public class tblPersonalController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblPersonal
        public IQueryable<tbl_Personal> Gettbl_Personal()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Personal;
        }

        // GET: api/tblPersonal/5
        [ResponseType(typeof(tbl_Personal))]
        public IHttpActionResult Gettbl_Personal(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            tbl_Personal tbl_Personal = db.tbl_Personal.Find(id);
            if (tbl_Personal == null)
            {
                return NotFound();
            }

            return Ok(tbl_Personal);
        }

        // PUT: api/tblPersonal/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Personal(int id, tbl_Personal obj_entidad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != obj_entidad.id_personal)
            {
                return BadRequest();
            }

            tbl_Personal Ent_personalR;
            Ent_personalR = db.tbl_Personal.Where(g => g.nroDoc_personal == obj_entidad.nroDoc_personal).FirstOrDefault<tbl_Personal>();
            tbl_Usuarios Ent_Usuarios;
            Ent_Usuarios = db.tbl_Usuarios.Where(u => u.nrodoc_usuario == obj_entidad.nroDoc_personal).FirstOrDefault<tbl_Usuarios>();
            // PERSONAL
            Ent_personalR.id_personal = obj_entidad.id_personal;
            Ent_personalR.nroDoc_personal = obj_entidad.nroDoc_personal;
            Ent_personalR.tipoDoc_personal = obj_entidad.tipoDoc_personal;
            Ent_personalR.apellidos_personal = obj_entidad.apellidos_personal;
            Ent_personalR.nombres_personal = obj_entidad.nombres_personal;
            Ent_personalR.tip_personal = obj_entidad.tip_personal;
            Ent_personalR.id_cargo_personal = obj_entidad.id_cargo_personal;
            Ent_personalR.fotoUrl_personal = obj_entidad.fotoUrl_personal;
            Ent_personalR.nroCelular_personal = obj_entidad.nroCelular_personal;
            Ent_personalR.email_personal = obj_entidad.email_personal;
            Ent_personalR.nombreUsario_personal = obj_entidad.nombreUsario_personal;
            Ent_personalR.contrasenia_personal = obj_entidad.contrasenia_personal;
            Ent_personalR.envio_enlinea_personal = obj_entidad.envio_enlinea_personal;
            Ent_personalR.id_perfil = obj_entidad.id_perfil;
            Ent_personalR.estado = obj_entidad.estado;
            Ent_personalR.codigo_personal = obj_entidad.codigo_personal;
            Ent_personalR.usuario_edicion = obj_entidad.usuario_creacion;
            Ent_personalR.fecha_edicion = DateTime.Now;

            // USUARIOS
            if(Ent_Usuarios != null)
            {
                Ent_Usuarios.nrodoc_usuario = obj_entidad.nroDoc_personal;
                Ent_Usuarios.apellidos_usuario = obj_entidad.apellidos_personal;
                Ent_Usuarios.nombres_usuario = obj_entidad.nombres_personal;
                Ent_Usuarios.tipo_usuario = obj_entidad.tip_personal.ToString();
                Ent_Usuarios.id_Cargo = Convert.ToInt32(obj_entidad.id_cargo_personal);

                Ent_Usuarios.email_usuario = obj_entidad.email_personal;
                Ent_Usuarios.login_usuario = obj_entidad.nombreUsario_personal;
                Ent_Usuarios.contrasenia_usuario = obj_entidad.contrasenia_personal;
                Ent_Usuarios.id_Perfil = obj_entidad.id_perfil;
                Ent_Usuarios.estado = Convert.ToInt32(obj_entidad.estado);
                Ent_Usuarios.usuario_edicion = obj_entidad.usuario_creacion;
                Ent_Usuarios.fecha_edicion = DateTime.Now.ToString("dd/MM/dddd");

                // ACTUALIZAMOS EN EL ENTITY
                db.Entry(Ent_Usuarios).State = EntityState.Modified;
            }
            
            db.Entry(Ent_personalR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_PersonalExists(id))
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

        // POST: api/tblPersonal
        [ResponseType(typeof(tbl_Personal))]
        public IHttpActionResult Posttbl_Personal(tbl_Personal tbl_Personal)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tbl_Personal.fecha_cese = DateTime.Now;
            tbl_Personal.fecha_creacion = DateTime.Now;
      
            // AGREGAMOS VALORES OBJETO DE PERSONAL A USUARIO
            tbl_Usuarios objTbl_Usuarios = new tbl_Usuarios();
            objTbl_Usuarios.nrodoc_usuario = tbl_Personal.nroDoc_personal;
            objTbl_Usuarios.apellidos_usuario = tbl_Personal.apellidos_personal;
            objTbl_Usuarios.nombres_usuario = tbl_Personal.nombres_personal;
            objTbl_Usuarios.email_usuario = tbl_Personal.email_personal;
            objTbl_Usuarios.Adm_Usuario = "Ad";
            objTbl_Usuarios.Sys_Usuario = "Sy";
            objTbl_Usuarios.id_Cargo = Convert.ToInt32(tbl_Personal.id_cargo_personal);
            objTbl_Usuarios.id_Area = 1;
            objTbl_Usuarios.tipo_usuario = tbl_Personal.tip_personal.ToString();
            objTbl_Usuarios.id_Empresa_Pertenece = 1;
            objTbl_Usuarios.login_usuario = tbl_Personal.nombreUsario_personal;
            objTbl_Usuarios.contrasenia_usuario = tbl_Personal.contrasenia_personal;
            objTbl_Usuarios.id_Perfil = tbl_Personal.id_perfil;
            objTbl_Usuarios.estado = Convert.ToInt32(tbl_Personal.estado);
            objTbl_Usuarios.usuario_creacion = tbl_Personal.usuario_creacion;
            objTbl_Usuarios.fecha_creacion = DateTime.Now.ToString("dd/MM/yyyy");
            objTbl_Usuarios.Acceso_Movil_Tipo = "S";
            // AGREGAMOS OBJETO A LA BD
            db.tbl_Personal.Add(tbl_Personal);
            db.tbl_Usuarios.Add(objTbl_Usuarios);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Personal.id_personal }, tbl_Personal);
        }

        // DELETE: api/tblPersonal/5
        [ResponseType(typeof(tbl_Personal))]
        public async Task<IHttpActionResult> Deletetbl_Personal(int id)
        {
            tbl_Personal obj_entidad = await db.tbl_Personal.FindAsync(id);

            obj_entidad = db.tbl_Personal.Where(g => g.id_personal == id).FirstOrDefault<tbl_Personal>();
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

        private bool tbl_PersonalExists(int id)
        {
            return db.tbl_Personal.Count(e => e.id_personal == id) > 0;
        }
    }
}