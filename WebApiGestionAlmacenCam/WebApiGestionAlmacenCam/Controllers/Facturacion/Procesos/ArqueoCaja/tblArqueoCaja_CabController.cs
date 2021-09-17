using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using Entidades;
using Negocio.Facturacion.Procesos;
using Negocio.Resultado;
using static Negocio.Accesos.LogInAccess_BL;

namespace WebApiGestionAlmacenCam.Controllers.Facturacion.Procesos.ArqueoCaja
{
    [EnableCors("*", "*", "*")]

    public class tblArqueoCaja_CabController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tblArqueoCaja_Cab
        public IQueryable<tbl_ArqueoCaja_Cab> Gettbl_ArqueoCaja_Cab()
        {
            return db.tbl_ArqueoCaja_Cab;
        }


        public object GetArqueoCajas(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
               if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int idAnexo = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_zonaVentaArqueo(idAnexo, idUsuario);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idAnexos = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_centroCostoArqueo(idAnexos, idUsuario);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_personalesArqueo( idUsuario);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_billetesMonedasArqueo(idUsuario);
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
 
                    int id_ArqueoCaja = Convert.ToInt32(parametros[0].ToString());
                    int id_Tipo = Convert.ToInt32(parametros[1].ToString());
                    int id_BilleteMoneda = Convert.ToInt32(parametros[2].ToString());
                    string cantidad_Billete = parametros[3].ToString();
                    string valor_Billete = parametros[4].ToString();
                    string total_Billete = parametros[5].ToString();
                    int idUsuario = Convert.ToInt32(parametros[6].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.set_guardar_billetesMonedasArqueo(id_ArqueoCaja, id_Tipo, id_BilleteMoneda, cantidad_Billete, valor_Billete, total_Billete, idUsuario);
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexo = Convert.ToInt32(parametros[0].ToString());
                    int id_ZonaVta = Convert.ToInt32(parametros[1].ToString());
                    int id_CC = Convert.ToInt32(parametros[2].ToString());
                    string fechaArqueoCaja = parametros[3].ToString();
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_informacionVentas_boletasFacturas(id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja,idUsuario);
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexo = Convert.ToInt32(parametros[0].ToString());
                    int id_ZonaVta = Convert.ToInt32(parametros[1].ToString());
                    int id_CC = Convert.ToInt32(parametros[2].ToString());
                    string fechaArqueoCaja = parametros[3].ToString();
                    int id_ArqueoCaja = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.set_guardar_informacionVentas_boletasFacturas(id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja, id_ArqueoCaja ,idUsuario);
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    int id_ArqueoCaja = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_informacionDepositos(id_ArqueoCaja, idUsuario);
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int id_banco = Convert.ToInt32(parametros[0].ToString());
                    string nroOperacion = parametros[1].ToString();
                    string fechaOperacion = parametros[2].ToString();

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_verificarNroOperacion(id_banco, nroOperacion, fechaOperacion);
                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_proveedorArqueo(idUsuario);
                }
                else if (opcion == 11)
                {
                    string[] parametros = filtro.Split('|');
                    int id_banco = Convert.ToInt32(parametros[0].ToString());
                    string nroOperacion = parametros[1].ToString();
                    string fechaOperacion = parametros[2].ToString();

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_verificarNroOperacionPagos(id_banco, nroOperacion, fechaOperacion);
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');
                    int id_ArqueoCaja = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_informacionPagos(id_ArqueoCaja, idUsuario);
                }
                else if (opcion == 13)
                {
                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_tiposEgresos();
                }
                else if (opcion == 14)
                {
                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_tiposDocumentos();
                }
                else if (opcion == 15)
                {
                    string[] parametros = filtro.Split('|');
                    string nroRuc = parametros[0].ToString();
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_consultaRuc(nroRuc, idUsuario);
                }
                else if (opcion == 16)
                {
                    string[] parametros = filtro.Split('|');
                    int id_ArqueoCaja = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_informacionEgresos(id_ArqueoCaja, idUsuario);
                }
               else if (opcion == 19)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexo = Convert.ToInt32(parametros[0].ToString());
                    int id_ZonaVta = Convert.ToInt32(parametros[1].ToString());
                    int id_CC = Convert.ToInt32(parametros[2].ToString());
                    string fechaArqueoCaja = parametros[3].ToString();
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_informacionVentas_cobranzasDevoluciones(id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja, idUsuario);

                }
                else if (opcion == 20)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexo = Convert.ToInt32(parametros[0].ToString());
                    int id_ZonaVta = Convert.ToInt32(parametros[1].ToString());
                    int id_CC = Convert.ToInt32(parametros[2].ToString());
                    string fechaArqueoCaja = parametros[3].ToString();
                    int id_ArqueoCaja = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.set_guardar_informacionVentas_cobranzasDevoluciones(id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja, id_ArqueoCaja, idUsuario);
                }
                else if (opcion == 21)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexo = Convert.ToInt32(parametros[0].ToString());
                    int id_ZonaVta = Convert.ToInt32(parametros[1].ToString());
                    int id_CC = Convert.ToInt32(parametros[2].ToString());
                    string fechaArqueoCaja = parametros[3].ToString();
                    int id_ArqueoCaja = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.set_cerrar_arqueoCaja(id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja, id_ArqueoCaja, idUsuario);
                }
                else if (opcion == 22)
                {
                    string[] parametros = filtro.Split('|');
                    int id_ArqueoCaja = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.ExportarExcel_arqueoCaja(id_ArqueoCaja, idUsuario);
                }
                else if (opcion == 23)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexo = Convert.ToInt32(parametros[0].ToString());
                    int id_ZonaVta = Convert.ToInt32(parametros[1].ToString());
                    int id_CC = Convert.ToInt32(parametros[2].ToString());
                    string fechaArqueoCaja = parametros[3].ToString();
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_informacionVentas_Devoluciones(id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja, idUsuario);

                }
                else if (opcion == 24)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexo = Convert.ToInt32(parametros[0].ToString());
                    int id_ZonaVta = Convert.ToInt32(parametros[1].ToString());
                    int id_CC = Convert.ToInt32(parametros[2].ToString());
                    string fechaArqueoCaja = parametros[3].ToString();
                    int id_ArqueoCaja = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.set_guardar_informacionVentas_Devoluciones(id_Anexo, id_ZonaVta, id_CC, fechaArqueoCaja, id_ArqueoCaja, idUsuario);
                }
                else if (opcion == 25)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_estados( idUsuario);
                }
                else if (opcion == 26)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexo = Convert.ToInt32(parametros[0].ToString());
                    int id_ZonaVta = Convert.ToInt32(parametros[1].ToString());
                    int id_CC = Convert.ToInt32(parametros[2].ToString());
                    string fechaini = parametros[3].ToString();
                    string fechafin = parametros[4].ToString();
                    int idEstado = Convert.ToInt32(parametros[5].ToString());
                    int idUsuario = Convert.ToInt32(parametros[6].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_informacion_arqueoCajaCab(id_Anexo, id_ZonaVta, id_CC, fechaini, fechafin, idEstado, idUsuario);
                }
                else if (opcion == 27)
                {
                    string[] parametros = filtro.Split('|');
                    int id_ArqueoCaja = Convert.ToInt32(parametros[0].ToString()); 
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_arqueoCajaCab_edicion(id_ArqueoCaja, idUsuario);
                }
                else if (opcion == 28)
                {
                    string[] parametros = filtro.Split('|');
                    int id_ArqueoCaja = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_arqueoCajaCab_billetesMonedas_edicion(id_ArqueoCaja, idUsuario);
                }
                else if (opcion == 29)
                {
                    string[] parametros = filtro.Split('|');
                    int id_ArqueoCaja = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_arqueoCajaCab_ventas_edicion(id_ArqueoCaja, idUsuario);
                }
                else if (opcion == 30)
                {
                    string[] parametros = filtro.Split('|');
                    int id_ArqueoCaja = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_arqueoCajaCab_cobranzas_edicion(id_ArqueoCaja, idUsuario);
                }
                else if (opcion == 31)
                {
                    string[] parametros = filtro.Split('|');
                    int id_ArqueoCaja = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.get_arqueoCajaCab_devoluciones_edicion(id_ArqueoCaja, idUsuario);
                }
                else if (opcion == 32)
                {
                    string[] parametros = filtro.Split('|');
                    int id_ArqueoCaja = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ArqueoCaja_BL obj_negocio = new ArqueoCaja_BL();
                    resul = obj_negocio.set_anularArqueoCaja(id_ArqueoCaja, idUsuario);
                }
                else
                {
                    resul = "Opcion seleccionada invalida";
                }
            }
            catch (Exception ex)
            {
                resul = ex.Message;
            }
            return resul;
        }

        [HttpPost]
        [Route("api/Arqueocaja/Posttbl_ArqueoCaja_Cab")]
        public object Posttbl_ArqueoCaja_Cab(tbl_ArqueoCaja_Cab tbl_ArqueoCaja_Cab)
        {
            Resul res = new Resul();
            try
            {
                string Date = DateTime.Now.ToString("ddMMyyyy");
                var objArqueo = (from u in db.tbl_ArqueoCaja_Cab
                                orderby u.nroArqueoCaja descending
                                select u).Take(1).ToList();

                if (objArqueo.Count > 0)
                {
                    string corrArqueo = objArqueo[0].nroArqueoCaja;
                    string[] corrArqueoF = corrArqueo.Split('-');

                    int num = Convert.ToInt32(corrArqueoF[1]);
                    int corr = (num + 1);
                    tbl_ArqueoCaja_Cab.nroArqueoCaja = Date + "-"+ (corr).ToString();
                }
                else
                {
                    tbl_ArqueoCaja_Cab.nroArqueoCaja = Date + "-1" ;
                }  


                tbl_ArqueoCaja_Cab.fecha_creacion = DateTime.Now;
                db.tbl_ArqueoCaja_Cab.Add(tbl_ArqueoCaja_Cab);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_ArqueoCaja_Cab.id_ArqueoCaja + "|" + tbl_ArqueoCaja_Cab.nroArqueoCaja;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        [HttpPut]
        [Route("api/Arqueocaja/Puttbl_ArqueoCaja_Cab")]
        public object Puttbl_ArqueoCaja_Cab(int id, tbl_ArqueoCaja_Cab tbl_ArqueoCaja_Cab)
        {
            Resultado res = new Resultado();

            tbl_ArqueoCaja_Cab objReemplazar;
            objReemplazar = db.tbl_ArqueoCaja_Cab.Where(u => u.id_ArqueoCaja == id).FirstOrDefault<tbl_ArqueoCaja_Cab>();

            objReemplazar.id_ZonaVta = tbl_ArqueoCaja_Cab.id_ZonaVta;
            objReemplazar.id_Anexo = tbl_ArqueoCaja_Cab.id_Anexo;
            objReemplazar.id_CC = tbl_ArqueoCaja_Cab.id_CC;
            objReemplazar.fechaArqueoCaja = tbl_ArqueoCaja_Cab.fechaArqueoCaja;

            objReemplazar.id_Personal_Rinde = tbl_ArqueoCaja_Cab.id_Personal_Rinde;
            objReemplazar.id_Personal_Responsable = tbl_ArqueoCaja_Cab.id_Personal_Responsable;
            objReemplazar.id_Personal_Supervisor = tbl_ArqueoCaja_Cab.id_Personal_Supervisor;
            objReemplazar.fechaSaldoInicial = tbl_ArqueoCaja_Cab.fechaSaldoInicial;
            objReemplazar.importeSaldoInicial = tbl_ArqueoCaja_Cab.importeSaldoInicial;

            objReemplazar.usuario_edicion = tbl_ArqueoCaja_Cab.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

            db.Entry(objReemplazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
                res.ok = true;
                res.data = "OK";
            }
            catch (DbUpdateConcurrencyException ex)
            {
                res.ok = false;
                res.data = ex.InnerException.Message;
            }

            return res;
        }

        

        // DELETE: api/tblArqueoCaja_Cab/5
        [ResponseType(typeof(tbl_ArqueoCaja_Cab))]
        public IHttpActionResult Deletetbl_ArqueoCaja_Cab(int id)
        {
            tbl_ArqueoCaja_Cab tbl_ArqueoCaja_Cab = db.tbl_ArqueoCaja_Cab.Find(id);
            if (tbl_ArqueoCaja_Cab == null)
            {
                return NotFound();
            }

            db.tbl_ArqueoCaja_Cab.Remove(tbl_ArqueoCaja_Cab);
            db.SaveChanges();

            return Ok(tbl_ArqueoCaja_Cab);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_ArqueoCaja_CabExists(int id)
        {
            return db.tbl_ArqueoCaja_Cab.Count(e => e.id_ArqueoCaja == id) > 0;
        }
    }
}