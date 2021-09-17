using Entidades.Procesos.Movil;
using Negocios.Procesos.Movil;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Procesos.Movil
{
    [EnableCors("*", "*", "*")]
    public class StockAlmacenMovilController : ApiController
    {

        public List<ENT_stockAlmacen> GetENT_stockAlmacen(int id_cuadrilla, int condicion, int cant, string filter,int id_vendedor, int idAlmacen)
        {
            List<ENT_stockAlmacen> listStockAlmacen = new List<ENT_stockAlmacen>();
            BL_stockAlmacen BLstockAlmacen = new BL_stockAlmacen();
            if (condicion == 1)
            {
                //SINCRONIZACIÓN TOTAL
                listStockAlmacen = BLstockAlmacen.getStockAlmacen(id_cuadrilla, id_vendedor, idAlmacen);
            }
            else if (condicion == 2)
            {
                // TRAER DATOS POR ID TOP 6
                listStockAlmacen = BLstockAlmacen.getStockAlmacenByTop(id_cuadrilla, condicion, cant, filter, idAlmacen);
            }

            return listStockAlmacen;
        }
    }
}
