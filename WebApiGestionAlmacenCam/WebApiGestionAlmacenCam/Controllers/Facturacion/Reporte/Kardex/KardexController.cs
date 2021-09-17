using Negocio.StockAlmacen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Facturacion.Reporte.Kardex
{
    [EnableCors("*", "*", "*")]
    public class KardexController : ApiController
    {
        GetStockAlmacen_BL GetStockAlmacen_bl;
        //public object GetKardexReporte( string fechaini, string fechafin, int id_material)
        //{
        //    object result;
        //    GetStockAlmacen_bl = new GetStockAlmacen_BL();
        //    try
        //    {
        //        result = GetStockAlmacen_bl.getKardexAlmacen(fechaini,fechafin,id_material);
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        public object GetKardexReporte(string fechaini, string fechafin, int id_material, int tipo, int local, int almacen)
        {
            object result;
            GetStockAlmacen_bl = new GetStockAlmacen_BL();
            try
            {
                result = GetStockAlmacen_bl.getKardexAlmacen_new(fechaini, fechafin, id_material, tipo, local, almacen);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public object GetKardexReporteTodo(string fechaini, string fechafin, int tipo, int local, int almacen, int idMaterial)
        {
            object result;
            GetStockAlmacen_bl = new GetStockAlmacen_BL();
            try
            {
                result = GetStockAlmacen_bl.getKardexAlmacen_todo(fechaini, fechafin, tipo, local, almacen, idMaterial);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
