using Entidades;
using Negocio.Almacen.Reportes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Reportes.Stock
{
    [EnableCors("*", "*", "*")]
    public class StockController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();
        public object GetReporteStock(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    string fecha = parametros[0].ToString();
                    int id_local = Convert.ToInt32(parametros[1].ToString());
                    int id_almacen = Convert.ToInt32(parametros[2].ToString());
                    int id_opcion = Convert.ToInt32(parametros[3].ToString());
                    ReporteStock_BL obj_negocio = new ReporteStock_BL();
                    resul = obj_negocio.Listando_StockAlmacen(fecha, id_local, id_almacen, id_opcion);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');

                    string fecha = parametros[0].ToString();
                    int id_local = Convert.ToInt32(parametros[1].ToString());
                    int id_almacen = Convert.ToInt32(parametros[2].ToString());
                    int id_opcion = Convert.ToInt32(parametros[3].ToString());
                    int id_Material = Convert.ToInt32(parametros[4].ToString());
                    ReporteStock_BL obj_negocio = new ReporteStock_BL();
                    resul = obj_negocio.Listado_Kardex(fecha, id_local, id_almacen, id_opcion, id_Material);
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

