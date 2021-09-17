using Negocio.Reparto.Reporte;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Reparto.Reporte
{
    [EnableCors("*", "*", "*")]
    public class ReportePedidosController : ApiController
    {
        public object GetReportesPedido(int opcion, string filtro)
        {
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_Vendedor = Convert.ToInt32(parametros[2].ToString());    
                    string fecha = parametros[3].ToString();
                    int id_usuario = Convert.ToInt32(parametros[4].ToString());
                    ReportePedidos_BL obj_negocio = new ReportePedidos_BL();
                    resul = obj_negocio.generarReporteCobertura(id_local, id_almacen, id_Vendedor, fecha, id_usuario);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    string fecha_ini = parametros[1].ToString();
                    string fecha_fin = parametros[2].ToString();
                    string fecha_cierre = parametros[3].ToString();

                    double drop = Convert.ToDouble(parametros[4].ToString());
                    int efectividad = Convert.ToInt32(parametros[5].ToString());
                    int distribucion = Convert.ToInt32(parametros[6].ToString());
                    int id_usuario = Convert.ToInt32(parametros[7].ToString());

                    ReportePedidos_BL obj_negocio = new ReportePedidos_BL();
                    resul = obj_negocio.generarReporteKpi(id_local, fecha_ini, fecha_fin, fecha_cierre, drop, efectividad, distribucion,   id_usuario);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');

                    int id_almacen = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    ReportePedidos_BL obj_negocio = new ReportePedidos_BL();
                    resul = obj_negocio.get_reporteStock(id_almacen, id_usuario);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');

                    int id_almacen = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    ReportePedidos_BL obj_negocio = new ReportePedidos_BL();
                    resul = obj_negocio.get_descargarReporteStock(id_almacen, id_usuario);
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

    }
}
