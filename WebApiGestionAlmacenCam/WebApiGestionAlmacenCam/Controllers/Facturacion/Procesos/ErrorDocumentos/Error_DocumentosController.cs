using Entidades;
using Negocio.Facturacion.Procesos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Facturacion.Procesos.ErrorDocumentos
{
    [EnableCors("*", "*", "*")]
    public class Error_DocumentosController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetError_Documentos(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_Anexos = Convert.ToInt32(parametros[2].ToString());
                    int vendedor = Convert.ToInt32(parametros[3].ToString());
                    int id_transportista = Convert.ToInt32(parametros[4].ToString());
                    int id_TipoDocumento = Convert.ToInt32(parametros[5].ToString());

                    Error_Documentos_BL obj_negocio = new Error_Documentos_BL();
                    resul = obj_negocio.Listando_Documentos_Erroneos(id_local, id_almacen, id_Anexos, vendedor, id_transportista, id_TipoDocumento);
                }
               else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');

                    int id_zona = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_Anexos = Convert.ToInt32(parametros[2].ToString());

                    Error_Documentos_BL obj_negocio = new Error_Documentos_BL();
                    resul = obj_negocio.Listando_DocumentosPendientesEnvio(id_zona, id_almacen, id_Anexos);
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
