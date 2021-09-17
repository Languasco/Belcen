using Negocio.Almacen.Reportes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Reportes.ConsultaTransacciones
{
    [EnableCors("*", "*", "*")]
    public class ConsultaTransaccionesController : ApiController
    {

        public object GetConsultaTransacciones(int opcion, string filtro)
        {
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int idAnexo = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    ConsultaTransacciones_BL obj_negocio = new ConsultaTransacciones_BL();
                    resul = obj_negocio.get_almacenesAnexo(idAnexo, idUsuario);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idAnexo = Convert.ToInt32(parametros[0].ToString());
                    int idAlmacen = Convert.ToInt32(parametros[1].ToString());
                    string codProducto =  parametros[2].ToString();

                    ConsultaTransacciones_BL obj_negocio = new ConsultaTransacciones_BL();
                    resul = obj_negocio.get_consultaProducto(idAnexo, idAlmacen, codProducto);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Anexos = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    string fechaInicial = parametros[2].ToString();
                    string fechaFinal = parametros[3].ToString();
                    string tipoReporte = parametros[4].ToString();
                    string cod_producto = parametros[5].ToString();

                    ConsultaTransacciones_BL obj_negocio = new ConsultaTransacciones_BL();
                    resul = obj_negocio.ExportarExcel_consultaTransacciones(id_Anexos, id_almacen, fechaInicial, fechaFinal, tipoReporte, cod_producto );
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
