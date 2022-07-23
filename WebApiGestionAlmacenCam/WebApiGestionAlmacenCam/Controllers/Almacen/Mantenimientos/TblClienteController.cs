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
using System.IO;
using Negocio.Almacen.Mantenimiento;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Mantenimientos
{
    [EnableCors("*", "*", "*")]
    public class TblClienteController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/TblClientes
        public IQueryable<Tbl_Clientes> GetTbl_Clientes()
        {
            return db.Tbl_Clientes;
        }
        
        public object GetTbl_Clientes(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int id_TipoCliente = Convert.ToInt32(parametros[0].ToString());
                    string doc_identidad = parametros[1].ToString();
                    string razon_social = parametros[2].ToString();

                    int id_zona = Convert.ToInt32(parametros[3].ToString());
                    int id_vendedor = Convert.ToInt32(parametros[4].ToString());
                    int id_condicionPago = Convert.ToInt32(parametros[5].ToString());

                    string direccion_entrega = parametros[6].ToString();
                    int id_estado = Convert.ToInt32(parametros[7].ToString());

                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.get_clientesCab(id_TipoCliente, doc_identidad, razon_social, id_zona, id_vendedor, id_condicionPago, direccion_entrega, id_estado);
                }
                else if (opcion == 2) ///------validacion Reniec en mantenimiento de personal
                {
                    string[] parametros = filtro.Split('|');
                    string nroDoc = parametros[0].ToString();
                    string resultado = "";
                    var url = "http://aplicaciones007.jne.gob.pe/srop_publico/Consulta/Afiliado/GetNombresCiudadano?DNI=" + nroDoc;
                    var web_request = System.Net.WebRequest.Create(url);

                    using (var response = web_request.GetResponse())
                    {
                        using (var reader = new StreamReader(response.GetResponseStream()))
                        {
                            resultado = reader.ReadToEnd().ToString();
                        }
                    }
                    resul = resultado;
                }
                else if (opcion == 3) ///----Giros
                {
                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.get_girosNegocio();
                }
                else if (opcion == 4) ///----canales
                {
                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.get_canalesNegocio();
                }
                else if (opcion == 5) 
                {
                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.get_zona();
                }
                else if (opcion == 6) 
                {
                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.get_ruta();
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    int idRuta = Convert.ToInt32(parametros[0].ToString());
                    
                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.get_vendedor(idRuta);
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    int idRuta = Convert.ToInt32(parametros[0].ToString());

                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.get_supervisor(idRuta);
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int idCliente = Convert.ToInt32(parametros[0].ToString());
                    int id_ZonaVta = Convert.ToInt32(parametros[1].ToString());
                    int id_RutaVta = Convert.ToInt32(parametros[2].ToString());
                    int idVendedor = Convert.ToInt32(parametros[3].ToString());
                    int idSupervisor = Convert.ToInt32(parametros[4].ToString());

                    string secuencia_Cliente = parametros[5].ToString();
                    string disDiaVisita = parametros[6].ToString();
                    string motivodeNocompra = parametros[7].ToString();
                    string productoInteres = parametros[8].ToString();

                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.Set_Actualizar_DistribucionCliente(idCliente, id_ZonaVta, id_RutaVta, idVendedor, idSupervisor, secuencia_Cliente, disDiaVisita, motivodeNocompra, productoInteres);
                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    int idCliente = Convert.ToInt32(parametros[0].ToString());
                    string importeMaxCredido = parametros[1].ToString();
                    string obsrealizaCobranza = parametros[2].ToString();
                    int cond_facturacion = Convert.ToInt32(parametros[3].ToString());

                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.Set_Actualizar_creditoCobranzaCliente(idCliente, importeMaxCredido, obsrealizaCobranza, cond_facturacion);
                }
                else if (opcion == 11)
                {
                    string[] parametros = filtro.Split('|');
                    int idProducto = Convert.ToInt32(parametros[0].ToString());

                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.get_listaPrecio(idProducto);
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');
                    int idProducto = Convert.ToInt32(parametros[0].ToString());

                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.get_UnidadMedidaVenta(idProducto);
                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');
                    int idProducto = Convert.ToInt32(parametros[0].ToString());
                    int idUnidadMedida = Convert.ToInt32(parametros[1].ToString());
                    string factor = parametros[2].ToString();
                    int idUsuario = Convert.ToInt32(parametros[3].ToString());

                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.save_UnidadMedidaVenta(idProducto, idUnidadMedida, factor, idUsuario);
                }
                else if (opcion == 14)
                {
                    string[] parametros = filtro.Split('|');
                    int id_UnidadMedida_Venta = Convert.ToInt32(parametros[0].ToString());

                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.eliminar_UnidadMedidaVenta(id_UnidadMedida_Venta);
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
        public IHttpActionResult PutTbl_Clientes(int id, Tbl_Clientes obj_entidad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != obj_entidad.id_cliente)
            {
                return BadRequest();
            }


            Tbl_Clientes Ent_ClienteR;
            Ent_ClienteR = db.Tbl_Clientes.Where(g => g.id_cliente == obj_entidad.id_cliente).FirstOrDefault<Tbl_Clientes>();
             
            Ent_ClienteR.id_DocumentoIdentidad = obj_entidad.id_DocumentoIdentidad;
            Ent_ClienteR.nroDoc_Cliente = obj_entidad.nroDoc_Cliente;
            Ent_ClienteR.nombres_Cliente = obj_entidad.nombres_Cliente;
            Ent_ClienteR.email_Cliente = obj_entidad.email_Cliente;
            Ent_ClienteR.id_departamento = obj_entidad.id_departamento;
            Ent_ClienteR.id_Provincia = obj_entidad.id_Provincia;
            Ent_ClienteR.id_distrito = obj_entidad.id_distrito;
            Ent_ClienteR.direccion_Cliente = obj_entidad.direccion_Cliente;
            Ent_ClienteR.id_PersonalVendedor = obj_entidad.id_PersonalVendedor;
            Ent_ClienteR.estado = obj_entidad.estado;
            Ent_ClienteR.usuario_edicion= obj_entidad.usuario_creacion;
            Ent_ClienteR.cond_facturacion = obj_entidad.cond_facturacion;

            Ent_ClienteR.id_GiroNegocio = obj_entidad.id_GiroNegocio;
            Ent_ClienteR.id_CanalNegocio = obj_entidad.id_CanalNegocio;
            Ent_ClienteR.direccion_referencia = obj_entidad.direccion_referencia;
            Ent_ClienteR.nroTelefono_Cliente = obj_entidad.nroTelefono_Cliente;

            Ent_ClienteR.id_ZonaVta = obj_entidad.id_ZonaVta;
            Ent_ClienteR.id_RutaVta = obj_entidad.id_RutaVta;
            Ent_ClienteR.id_Personal_Supervisor = obj_entidad.id_Personal_Supervisor;

            Ent_ClienteR.secuencia_Cliente = obj_entidad.secuencia_Cliente;
            Ent_ClienteR.disDiaVisita = obj_entidad.disDiaVisita;
            Ent_ClienteR.motivodeNocompra = obj_entidad.motivodeNocompra;
            Ent_ClienteR.productoInteres = obj_entidad.productoInteres;

            Ent_ClienteR.importeMaxCredido = obj_entidad.importeMaxCredido;
            Ent_ClienteR.obsrealizaCobranza = obj_entidad.obsrealizaCobranza;

            db.Entry(Ent_ClienteR).State = EntityState.Modified;

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

            return Ok("OK");
        }

        // POST: api/TblClientes
        [ResponseType(typeof(Tbl_Clientes))]
        public IHttpActionResult PostTbl_Clientes(Tbl_Clientes tbl_Clientes)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tbl_Clientes.fecha_creacion = DateTime.Now;
            db.Tbl_Clientes.Add(tbl_Clientes);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Clientes.id_cliente }, tbl_Clientes);
        }

        // DELETE: api/TblClientes/5


        [ResponseType(typeof(Tbl_Clientes))]
        public async Task<IHttpActionResult> DeleteTbl_Clientes(int id)
        {
            Tbl_Clientes obj_entidad = await db.Tbl_Clientes.FindAsync(id);

            obj_entidad = db.Tbl_Clientes.Where(g => g.id_cliente == id).FirstOrDefault<Tbl_Clientes>();
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

        private bool Tbl_ClientesExists(int id)
        {
            return db.Tbl_Clientes.Count(e => e.id_cliente == id) > 0;
        }
    }
}