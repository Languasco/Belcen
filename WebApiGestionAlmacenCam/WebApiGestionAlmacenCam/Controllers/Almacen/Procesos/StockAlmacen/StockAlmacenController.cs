using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using Negocio.StockAlmacen;
using Entidades;
using System.Text;
namespace WebApiGestionAlmacenCam.Controllers.Almacen.Procesos.Transferencias
{
    [EnableCors("*", "*", "*")]
    public class StockAlmacenController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        GetStockAlmacen_BL GetStockAlmacen_bl;
        public object getStockAlmacen(int idUsuario, int idLocal, int idAlmacen, string mov)
        {
            GetStockAlmacen_bl = new GetStockAlmacen_BL();
            var list = GetStockAlmacen_bl.getStockAlmacen(idUsuario, idLocal, idAlmacen, mov);
            return list;
        }
        [HttpGet]
        [Route("api/SaveMaterialRecepcion")]//Listar personal
        public object SaveMaterialRecepcion(string matricula, string descripcion, decimal cantidad, int usuario, string tipo, string nroLote,  int idAlmacen, int idUnidadMedida, string fechaProduccion, string fechaVencimiento)
        {
            GetStockAlmacen_bl = new GetStockAlmacen_BL();
            var result = GetStockAlmacen_bl.PostSaveMaterialRecepcion(matricula, descripcion, cantidad, usuario, tipo, nroLote, idAlmacen, idUnidadMedida, fechaProduccion, fechaVencimiento);
            return result;

        }
        [HttpPost]
        [Route("api/SaveTransferencia")]//Listar personal
        public IHttpActionResult SaveTransferencia(tbl_Alm_Transferencia_Cab objtbl_Alm_Transferencia_Cab)
        {
            object result;
            GetStockAlmacen_bl = new GetStockAlmacen_BL();
            try
            {
                result = GetStockAlmacen_bl.PostSaveTransferencia(objtbl_Alm_Transferencia_Cab);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }



        }


    }
}
