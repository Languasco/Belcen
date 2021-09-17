using Entidades;
using Negocio.Facturacion.Procesos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Facturacion.Procesos.GeneracionDocumentoVenta
{
  [EnableCors("*", "*", "*")]
    public class DocumentoVentaController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetGeneracionDocumentoVenta(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int id_cargo = Convert.ToInt32(parametros[0].ToString());

                    resul = ( from c in db.tbl_Personal
                              where c.id_cargo_personal == id_cargo && c.estado ==1
                             select new
                             {
                                 c.id_personal,
                                 c.nroDoc_personal,
                                 c.apellidos_personal,
                                 c.nombres_personal
                             }).ToList();

                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int id_puntoVenta = Convert.ToInt32(parametros[0].ToString());
                    int id_vendedor = Convert.ToInt32(parametros[1].ToString()); 
                    int id_docVenta = Convert.ToInt32(parametros[2].ToString());
                    int id_estado = Convert.ToInt32(parametros[3].ToString());
 
                    DocumentoVenta_BL obj_negocio = new DocumentoVenta_BL();
                    resul = obj_negocio.Listando_DocumentosVentas(id_puntoVenta, id_vendedor, id_docVenta, id_estado);

                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    string list_pedido =  parametros[0].ToString();
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());
 
                    DocumentoVenta_BL obj_negocio = new DocumentoVenta_BL();
                    resul = obj_negocio.UpdateListaPedido(list_pedido, id_usuario);  
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int id_cargo = Convert.ToInt32(parametros[0].ToString());

                    resul = (from c in db.Tbl_Clientes
                             select new
                             {
                                 c.id_cliente  
                             }).ToList();
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
