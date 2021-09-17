using Negocio.Procesos.Movil;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Movil
{
    [EnableCors("*", "*", "*")]
    public class FacturaCancelacionController : ApiController
    {
        BL_FacturacionCancelacion bl_FacturacionCancelacion = null;
        public object GetSincroCancelacion(int cond,int idVendedor)
        {
            object result = null;
            bl_FacturacionCancelacion = new BL_FacturacionCancelacion();
            try
            {
                if (cond == 1)
                {
                    result = bl_FacturacionCancelacion.GetFacturaCancelarPendiente(idVendedor);
                }else if(cond == 2){
                    result = bl_FacturacionCancelacion.GetFacturaCancelarPendienteDetalle(idVendedor);
                }
                
            }
            catch (Exception)
            {
                return NotFound();                
            }
            
            return result;

        }
    }
}
