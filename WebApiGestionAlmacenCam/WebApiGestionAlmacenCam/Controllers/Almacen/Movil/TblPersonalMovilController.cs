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
using System.Data.SqlClient;
using Entidades.Mantenimiento.Proceso;

namespace WebApiGestionAlmacenCam.Controllers.Mantenimientos
{
    [EnableCors("*", "*", "*")]
    public class TblPersonalMovilController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblPersonal
        public IQueryable<tbl_Personal> GetTbl_Personal()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return db.tbl_Personal;
        }

        public class dataPersonal {
            public List<PersonalNew> personalLocal { get; set; }
            public List<tbl_Alm_Almacen> personalAlmacen { get; set; }
        }
        // GET: api/TblPersonal/5
        [ResponseType(typeof(tbl_Personal))]
        public object GetTbl_Personal(string usu, string pass)
        {
            string cadenaCnx = "Data Source=173.248.174.16,1533;Initial Catalog=Comercial_DSIGE;user id=sa;password=VENTAS;APP=Gestion CCAM LDSª:) 0001 V. 4.25 | Usuario:" + usu + "";
            PersonalNew objPersonal = null;
            tbl_Alm_Almacen objPersonalAlm = null;
            List<PersonalNew> listObjPersonal = new List<PersonalNew>();
            List<tbl_Alm_Almacen> listObjPersonalAlm = new List<tbl_Alm_Almacen>();      
            // PERSONAL LOCAL
            using (SqlConnection cn = new SqlConnection(cadenaCnx))
            {
                cn.Open();
                using (SqlCommand cmd = new SqlCommand("SP_INICIO_SESION_PERSONAL", cn))
                {
                    cmd.CommandTimeout = 0;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@usu", SqlDbType.VarChar).Value = usu;
                    cmd.Parameters.Add("@pass", SqlDbType.VarChar).Value = pass;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        
                        
                        while (reader.Read())
                        {
                            objPersonal = new PersonalNew();
                            objPersonal.id_perfil = Convert.ToInt32(reader["id_perfil"]);
                            //objPersonal.empresa = 1;
                            objPersonal.id_personal = Convert.ToInt32(reader["id_personal"]);
                            objPersonal.nroDoc_personal = reader["nroDoc_personal"].ToString();
                            objPersonal.tipoDoc_personal = Convert.ToString(reader["tipoDoc_personal"]);
                            objPersonal.apellidos_personal = reader["apellidos_personal"].ToString();
                            objPersonal.nombres_personal = reader["nombres_personal"].ToString();
                            objPersonal.id_cargo_personal = 1;
                            objPersonal.nroCelular_personal = reader["nroCelular_personal"].ToString();
                            objPersonal.email_personal = reader["email_personal"].ToString();
                            objPersonal.nombreUsario_personal = reader["nombreUsario_personal"].ToString();
                            objPersonal.envio_enlinea_personal = reader["envio_enlinea_personal"].ToString();
                            objPersonal.id_cuadrilla = 1;
                            objPersonal.codigo_cuadrilla = 1;
                            objPersonal.id_local = Convert.ToInt32(reader["id_local"]);
                            objPersonal.nombre_local = reader["nombre_local"].ToString();                            
                            listObjPersonal.Add(objPersonal);
                        }
                    }
                }                
                cn.Close();
            }
            // PERSONAL ALMACEN
            using (SqlConnection cn = new SqlConnection(cadenaCnx))
            {
                cn.Open();
                using (SqlCommand cmd = new SqlCommand("SP_INICIO_SESION_PERSONAL_ALMACEN", cn))
                {
                    cmd.CommandTimeout = 0;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@usu", SqlDbType.VarChar).Value = usu;
                    cmd.Parameters.Add("@pass", SqlDbType.VarChar).Value = pass;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {


                        while (reader.Read())
                        {
                            objPersonalAlm = new tbl_Alm_Almacen();

                            objPersonalAlm.id_Almacen = Convert.ToInt32(reader["id_almacen"]);
                            objPersonalAlm.descripcion_Almacen = reader["descripcion_Almacen"].ToString();
                            listObjPersonalAlm.Add(objPersonalAlm);
                        }
                    }
                }
                cn.Close();
            }
            dataPersonal datapersonal = new dataPersonal();
            datapersonal.personalLocal = listObjPersonal;
            datapersonal.personalAlmacen = listObjPersonalAlm;

            return datapersonal;
        }

        
        // PUT: api/tblPersonalApi/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> Puttbl_Personal(int id, tbl_Personal tbl_Personal)
        {
            tbl_Personal.fecha_edicion = DateTime.Now;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Personal.id_personal)
            {
                return BadRequest();
            }

            tbl_Personal.fecha_edicion = DateTime.Now;
            tbl_Personal.usuario_edicion = tbl_Personal.usuario_creacion;

            db.Entry(tbl_Personal).State = EntityState.Modified;


            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Tbl_PersonalExists(id))
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

        // POST: api/TblPersonal
        [ResponseType(typeof(tbl_Personal))]
        public IHttpActionResult PostTbl_Personal(tbl_Personal tbl_Personal)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tbl_Personal.fecha_creacion = DateTime.Now;
            db.tbl_Personal.Add(tbl_Personal);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Personal.id_personal }, tbl_Personal);
        }

        // DELETE: api/TblPersonal/5
        [ResponseType(typeof(tbl_Personal))]
        public async Task<IHttpActionResult> Deletetbl_Personal(int id)
        {

            tbl_Personal tblPersonal = await db.tbl_Personal.FindAsync(id);
            tblPersonal = db.tbl_Personal.Where(g => g.id_personal == id).FirstOrDefault<tbl_Personal>();
            tblPersonal.estado = 0;
            db.Entry(tblPersonal).State = System.Data.Entity.EntityState.Modified;
            await db.SaveChangesAsync();
            return Ok("ok");
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Tbl_PersonalExists(int id)
        {
            return db.tbl_Personal.Count(e => e.id_personal == id) > 0;
        }
    }
}