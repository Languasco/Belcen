using Entidades.Almacen.Procesos;
using Negocio.Almacen.Procesos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Procesos.TransformacionProductos
{

    [EnableCors("*", "*", "*")]
    public class TransformacionProductosController : ApiController
    {

        public object GetTransformacionProductos(int opcion, string filtro)
        {
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_estado = Convert.ToInt32(parametros[2].ToString());
                    string fecha_Ini = parametros[3].ToString();                  
                    string fecha_Fin = parametros[4].ToString();

                    TransformacionProductos_BL obj_negocio = new TransformacionProductos_BL();
                    resul = obj_negocio.get_transformacionProductos_cab(id_local, id_almacen, id_estado, fecha_Ini, fecha_Fin);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');

                    int id_GuiaCab = Convert.ToInt32(parametros[0].ToString());   
                    int idLocal = Convert.ToInt32(parametros[1].ToString());
                    int idAlmacen = Convert.ToInt32(parametros[2].ToString());
                    int idTipoDoc = Convert.ToInt32(parametros[3].ToString());
                    string nroDoc = parametros[4].ToString();

                    string fechaDoc = parametros[5].ToString();
                    int idProveedor = Convert.ToInt32(parametros[6].ToString());
                    int id_usuario = Convert.ToInt32(parametros[7].ToString());

                    TransformacionProductos_BL obj_negocio = new TransformacionProductos_BL();
                    resul = obj_negocio.Set_insert_update_transformacionProductosCab(id_GuiaCab, idLocal, idAlmacen, idTipoDoc, nroDoc, fechaDoc, idProveedor, id_usuario);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int id_GuiaCab = Convert.ToInt32(parametros[0].ToString());

                    TransformacionProductos_BL obj_negocio = new TransformacionProductos_BL();
                    resul = obj_negocio.get_transformacionProductoDetalle(id_GuiaCab);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int id_GuiaDet = Convert.ToInt32(parametros[0].ToString());


                    TransformacionProductos_BL obj_negocio = new TransformacionProductos_BL();
                    resul = obj_negocio.set_eliminar_transformacionProductoDetalle(id_GuiaDet);
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int id_GuiaCab = Convert.ToInt32(parametros[0].ToString());

                    TransformacionProductos_BL obj_negocio = new TransformacionProductos_BL();
                    resul = obj_negocio.get_transformacionProductoCab_edicion(id_GuiaCab);
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    int id_GuiaCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    TransformacionProductos_BL obj_negocio = new TransformacionProductos_BL();
                    resul = obj_negocio.set_cerrar_transformacionProducto(id_GuiaCab, id_usuario);
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    int id_GuiaCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    TransformacionProductos_BL obj_negocio = new TransformacionProductos_BL();
                    resul = obj_negocio.set_reactivar_transformacionProducto(id_GuiaCab, id_usuario);
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


        [HttpPost]
        [Route("api/TransformacionProductos/PostTransformacionProductos")]
        public object PostTransformacionProductos(TransformacionProducto_Detalle_E objEntidad)
        {
            object resul = null;

            try
            { 
                TransformacionProductos_BL obj_negocio = new TransformacionProductos_BL();
                resul = obj_negocio.Set_insert_update_transformacionProductosDet(objEntidad);
 
            }
            catch (Exception ex)
            {
                resul = ex.Message;
            }
            return resul;



        }


    }
}
