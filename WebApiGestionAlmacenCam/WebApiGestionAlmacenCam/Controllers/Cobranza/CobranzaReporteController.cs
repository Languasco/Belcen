using Entidades;
using Entidades.Cobranzas;
using Negocio.Cobranza;
using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Cobranza
{
    [EnableCors("*", "*", "*")]
    public class CobranzaReporteController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetCobranzaReporte(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Result res = new Result();

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    res.ok = true;
                    res.data = (from c in db.tbl_Anexos
                                where c.estado == 1
                                select new
                                {
                                    id = c.id_Anexos,
                                    descripcion = c.nombreAnexo
                                }).ToList();
                    resul = res;
                }
                else if (opcion == 2)
                {
                    // string[] parametros = filtro.Split('|');

                    //int id_Anexo = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = (from c in db.tbl_Zonas_Venta
                                where c.estado == 1
                                select new
                                {
                                    id = c.ID_ANEXOS,
                                    descripcion = c.nombreZonaVta
                                }).ToList();

                    resul = res;
                }
                else if (opcion == 3)
                {
                    res.ok = true;
                    res.data = (from c in db.tbl_Personal
                              where c.id_cargo_personal == 6 && c.estado == 1
                              select new
                              {
                                  id = c.id_personal,
                                  descripcion = c.nombres_personal +" "+ c.apellidos_personal,
                                  doc = c.nroDoc_personal,
                              }).ToList();

                    resul = res;
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexo = Convert.ToInt32(parametros[0].ToString());
                    int id_ZonaVenta = Convert.ToInt32(parametros[1].ToString());
                    int id_Vendedor = Convert.ToInt32(parametros[2].ToString());

                    string buscar = parametros[3].ToString();
                    string fechaIni = parametros[4].ToString();
                    string fechaFin = parametros[5].ToString();


                    Reporte_BL obj_negocio = new Reporte_BL();

                    res.ok = true;
                    res.data = obj_negocio.get_reporteCobranza(id_Anexo, id_ZonaVenta, id_Vendedor, buscar, fechaIni, fechaFin);

                    resul = res;
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexo = Convert.ToInt32(parametros[0].ToString());
                    int id_ZonaVenta = Convert.ToInt32(parametros[1].ToString());
                    int id_Vendedor = Convert.ToInt32(parametros[2].ToString());

                    string buscar = parametros[3].ToString();
                    string fechaIni = parametros[4].ToString();
                    string fechaFin = parametros[5].ToString();

                    int id_usuario = Convert.ToInt32(parametros[6].ToString());


                    Reporte_BL obj_negocio = new Reporte_BL();
                    resul = obj_negocio.get_descargarReporteCobranza(id_Anexo, id_ZonaVenta, id_Vendedor, buscar, fechaIni, fechaFin, id_usuario);
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
    }
}