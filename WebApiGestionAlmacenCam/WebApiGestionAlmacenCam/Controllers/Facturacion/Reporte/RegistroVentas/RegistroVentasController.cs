using Entidades;
using Negocio.Facturacion.Reporte;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Facturacion.Reporte.RegistroVentas
{
         [EnableCors("*", "*", "*")]
    public class RegistroVentasController : ApiController
    {

        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetReportePagosVendedor(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            { 
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');


                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen  = Convert.ToInt32(parametros[1].ToString());
                    int id_tipoDoc = Convert.ToInt32(parametros[2].ToString());
                    string fecha_inicial = parametros[3].ToString();
                    string fecha_final = parametros[4].ToString();

                    Registro_ventas_BL obj_negocio = new Registro_ventas_BL();
                    resul = obj_negocio.ExportarExcel_VentasCliente(id_local,id_almacen, id_tipoDoc, fecha_inicial, fecha_final);
                }
                else if (opcion == 2)  ///-- reporte resumen de ventas
                {
                    string[] parametros = filtro.Split('|');
 
                    int id_PuntoVenta = Convert.ToInt32(parametros[0].ToString());
                    int id_lineaProducto = Convert.ToInt32(parametros[1].ToString());
                    int id_marcaProducto = Convert.ToInt32(parametros[2].ToString());
                    
                    int id_Tiporep = Convert.ToInt32(parametros[3].ToString());
                    string fecha_inicial = parametros[4].ToString();
                    string fecha_final = parametros[5].ToString();
                    int id_usuario = Convert.ToInt32(parametros[6].ToString());

                    Registro_ventas_BL obj_negocio = new Registro_ventas_BL();
                    resul = obj_negocio.ExportarExcel_ResumenVentas(id_PuntoVenta, id_lineaProducto, id_marcaProducto, id_Tiporep, fecha_inicial, fecha_final, id_usuario);
                }
                else if (opcion == 3)  
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexos = Convert.ToInt32(parametros[0].ToString());
                    int id_local = Convert.ToInt32(parametros[1].ToString());
                    int id_almacen = Convert.ToInt32(parametros[2].ToString());
                    int id_zona = Convert.ToInt32(parametros[3].ToString());
                    string fechaIni = parametros[4].ToString();
                    string fechaFin = parametros[5].ToString();
                    int id_tipoDoc = Convert.ToInt32(parametros[6].ToString());
                    int id_usuario = Convert.ToInt32(parametros[7].ToString());

                    Registro_ventas_BL obj_negocio = new Registro_ventas_BL();
                    resul = obj_negocio.generarReporte_detalleDocumentos(id_Anexos, id_local, id_almacen, id_zona, fechaIni, fechaFin, id_tipoDoc, id_usuario);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexos = Convert.ToInt32(parametros[0].ToString());
                    int id_local = Convert.ToInt32(parametros[1].ToString());
                    int id_almacen = Convert.ToInt32(parametros[2].ToString());
                    int id_zona = Convert.ToInt32(parametros[3].ToString());          
                    string fechaIni = parametros[4].ToString();
                    string fechaFin = parametros[5].ToString();
                    int id_tipoDoc = Convert.ToInt32(parametros[6].ToString());
                    int id_usuario = Convert.ToInt32(parametros[7].ToString());

                    Registro_ventas_BL obj_negocio = new Registro_ventas_BL();
                    resul = obj_negocio.generarReporte_detalleArticulos(id_Anexos, id_local, id_almacen, id_zona, fechaIni, fechaFin, id_tipoDoc, id_usuario);
                }
                else if (opcion == 5)
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
                    int id_usuario = Convert.ToInt32(parametros[8].ToString());

                    Registro_ventas_BL obj_negocio = new Registro_ventas_BL();
                    resul = obj_negocio.generarReporte_detalleClientes(id_TipoCliente, doc_identidad, razon_social, id_zona, id_vendedor, id_condicionPago, direccion_entrega, id_estado, id_usuario);
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
