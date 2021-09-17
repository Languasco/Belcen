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
using EntityFramework.BulkInsert.Extensions;

namespace WebApiGestionAlmacenCam.Controllers.Mantenimientos
{
    [EnableCors("*", "*", "*")]
    public class TblClientesController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblClientes
        public object GetTbl_Clientes(int vendedor)
        {
            object listClientes = "";
            db.Configuration.ProxyCreationEnabled = false;


            string fechaImporta = DateTime.Now.ToString("dd/MM/yyyy");
            listClientes = (from cli in db.Tbl_Clientes
                            where cli.id_PersonalVendedor == vendedor
                            select new
                            {
                                cli.id_cliente,
                                cli.id_empresa,
                                cli.codigoInterno_Cliente,
                                //cli.suministro_Cliente,
                                cli.id_TipoCliente,
                                cli.id_DocumentoIdentidad,
                                cli.nroDoc_Cliente,
                                cli.apellidosNombre_Cliente,
                                cli.apellidosPaterno_Cliente,
                                cli.apellidosMaterno_Cliente,
                                cli.nombres_Cliente,
                                cli.fechaNacimiento_Cliente,
                                cli.dir_tipoVia_Cliente,
                                cli.dir_via_Cliente,
                                cli.dir_numero_Cliente,
                                cli.dir_piso_Cliente,
                                cli.dir_departamento_Cliente,
                                cli.dir_manzana_Cliente,
                                cli.dir_lote_Cliente,
                                //cli.dir_tipoconjunto_cliente,
                                //cli.dir_conjuntohabitacional_cliente,
                                //cli.dir_SEZ_Cliente,
                                //cli.dir_DSEZ_Cliente,
                                cli.id_Provincia,
                                cli.id_distrito,
                                cli.direccion_referencia,
                                cli.nroTelefono_Cliente,
                                cli.nroTelefono2_Cliente,
                                cli.nroCelular_Cliente,
                                cli.nroCelular2_Cliente,
                                cli.email_Cliente,
                                cli.direccion_Cliente,
                                cli.id_PersonalVendedor,
                                cli.latitud_Cliente,
                                cli.longitud_Cliente,
                                //cli.ventaCredito,
                                cli.estado,
                                cli.usuario_creacion,
                                cli.fecha_creacion,
                                cli.usuario_edicion,
                                cli.fecha_edicion,
                                cli.cond_facturacion

                            }).ToList();

            return listClientes;
        }
        // GET: api/TblClientes/5

        public object GetDatosCliente(int opcion, string filtro)
        {
            //filtro puede tomar cualquier valor
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {

                    string[] parametros = filtro.Split('|');
                    int id_grupoTabla = Convert.ToInt32(parametros[0].ToString());

                    resul = (from a in db.Tbl_GrupoTabla_Det
                             where a.id_grupoTabla == id_grupoTabla
                             select new
                             {
                                 a.id_grupoTabla,
                                 a.id_detalleTabla,
                                 a.descripcion_grupoTabla
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


        // PUT: api/TblClientes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTbl_Clientes(int id, Tbl_Clientes obj_cliente)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Tbl_Clientes Ent_clienteR;
            // DATA ACTUAL
            Ent_clienteR = db.Tbl_Clientes.Where(g => g.codigoInterno_Cliente == obj_cliente.codigoInterno_Cliente).FirstOrDefault<Tbl_Clientes>();

            Ent_clienteR.id_empresa = obj_cliente.id_empresa;
            Ent_clienteR.codigoInterno_Cliente = obj_cliente.codigoInterno_Cliente;
            Ent_clienteR.id_TipoCliente = obj_cliente.id_TipoCliente;
            //Ent_clienteR.suministro_Cliente = obj_cliente.suministro_Cliente;
            Ent_clienteR.id_DocumentoIdentidad = obj_cliente.id_DocumentoIdentidad;
            Ent_clienteR.apellidosNombre_Cliente = obj_cliente.apellidosNombre_Cliente;
            Ent_clienteR.apellidosPaterno_Cliente = obj_cliente.apellidosPaterno_Cliente;
            Ent_clienteR.apellidosMaterno_Cliente = obj_cliente.apellidosMaterno_Cliente;
            Ent_clienteR.fechaNacimiento_Cliente = obj_cliente.fechaNacimiento_Cliente;
            Ent_clienteR.dir_tipoVia_Cliente = obj_cliente.dir_tipoVia_Cliente;
            Ent_clienteR.dir_via_Cliente = obj_cliente.dir_via_Cliente;
            Ent_clienteR.dir_numero_Cliente = obj_cliente.dir_numero_Cliente;
            Ent_clienteR.dir_piso_Cliente = obj_cliente.dir_piso_Cliente;
            Ent_clienteR.dir_departamento_Cliente = obj_cliente.dir_departamento_Cliente;
            Ent_clienteR.dir_manzana_Cliente = obj_cliente.dir_manzana_Cliente;
            Ent_clienteR.dir_lote_Cliente = obj_cliente.dir_lote_Cliente;
            //Ent_clienteR.dir_tipoconjunto_cliente = obj_cliente.dir_tipoconjunto_cliente;
            //Ent_clienteR.dir_conjuntohabitacional_cliente = obj_cliente.dir_conjuntohabitacional_cliente;
            //Ent_clienteR.dir_SEZ_Cliente = obj_cliente.dir_SEZ_Cliente;
            //Ent_clienteR.dir_DSEZ_Cliente = obj_cliente.dir_DSEZ_Cliente;
            Ent_clienteR.id_Provincia = obj_cliente.id_Provincia;
            Ent_clienteR.id_distrito = obj_cliente.id_distrito;
            Ent_clienteR.nombres_Cliente = obj_cliente.nombres_Cliente;
            Ent_clienteR.direccion_referencia = obj_cliente.direccion_referencia;
            Ent_clienteR.nroTelefono_Cliente = obj_cliente.nroTelefono_Cliente;
            Ent_clienteR.nroTelefono2_Cliente = obj_cliente.nroTelefono2_Cliente;
            Ent_clienteR.nroCelular_Cliente = obj_cliente.nroCelular_Cliente;
            Ent_clienteR.nroCelular2_Cliente = obj_cliente.nroCelular2_Cliente;
            Ent_clienteR.nroDoc_Cliente = obj_cliente.nroDoc_Cliente;
            Ent_clienteR.apellidosNombre_Cliente = obj_cliente.apellidosNombre_Cliente;
            Ent_clienteR.direccion_Cliente = obj_cliente.direccion_Cliente;
            Ent_clienteR.id_distrito = obj_cliente.id_distrito;
            Ent_clienteR.email_Cliente = obj_cliente.email_Cliente;
            Ent_clienteR.nroTelefono_Cliente = obj_cliente.nroTelefono_Cliente;
            Ent_clienteR.nroCelular_Cliente = obj_cliente.nroCelular_Cliente;
            Ent_clienteR.usuario_edicion = obj_cliente.usuario_creacion;
            Ent_clienteR.fecha_edicion = DateTime.Now;
            Ent_clienteR.estado = obj_cliente.estado;
            Ent_clienteR.cond_facturacion = obj_cliente.cond_facturacion;
            db.Entry(Ent_clienteR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Tbl_ClientesExists(id))
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

        // POST: api/TblClientes
        [ResponseType(typeof(Tbl_Clientes))]
        public IHttpActionResult PostTbl_Clientes(List<Tbl_Clientes> tbl_Clientes)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            foreach (var item in tbl_Clientes)
            {
                item.estado = 1;
                item.fecha_creacion = DateTime.Now;
                item.usuario_creacion = item.id_PersonalVendedor;
            }
            db.BulkInsert(tbl_Clientes);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Clientes[0].id_cliente }, tbl_Clientes);
        }

        // DELETE: api/TblClientes/5
        [ResponseType(typeof(Tbl_Clientes))]
        public IHttpActionResult DeleteTbl_Clientes(int id)
        {
            Tbl_Clientes tblClientes = db.Tbl_Clientes.Find(id);
            //tblClientes = db.Tbl_Clientes.Where(g => g.id_cliente == id).FirstOrDefault<Tbl_Clientes>();
            tblClientes.estado = 0;
            db.Entry(tblClientes).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
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

        private bool Tbl_ClientesExists(int id)
        {
            return db.Tbl_Clientes.Count(e => e.id_cliente == id) > 0;
        }
    }
}