using Entidades;
using Negocio.Reparto.Procesos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Reparto.Procesos
{
    [EnableCors("*", "*", "*")]
    public class EntregaPedidoController : ApiController
    {

        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetEntregaPedido(int opcion, string filtro)
        {
            //filtro puede tomar cualquier valor
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {

                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_Vendedor = Convert.ToInt32(parametros[2].ToString());
                    int id_transportista = Convert.ToInt32(parametros[3].ToString());
                    string fecha_ini = parametros[4].ToString();

                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    resul = obj_negocio.Listar_GenerarRutaEntrega(id_local, id_almacen, id_Vendedor, id_transportista, fecha_ini);

                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');

                    int id_vendedor = Convert.ToInt32(parametros[0].ToString());
                    string fechaInicial = parametros[1].ToString();
                    string fechaFinal = parametros[2].ToString();

                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    resul = obj_negocio.Listar_RegistroRutaEntregaVendedores(id_vendedor, fechaInicial, fechaFinal);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_Vendedor = Convert.ToInt32(parametros[2].ToString());
                    string fecha_ini = parametros[3].ToString();
                    string fecha_fin = parametros[4].ToString();
                    int id_usuario = Convert.ToInt32(parametros[5].ToString());

                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    resul = obj_negocio.generarDescargaPedidos(id_local, id_almacen, id_Vendedor, fecha_ini, fecha_fin, id_usuario);
                }
                else if (opcion == 4)
                {

                    string[] parametros = filtro.Split('|');
                    int id_Cargo = Convert.ToInt32(parametros[0].ToString());

                    resul = (from a in db.tbl_Personal
                             where a.id_cargo_personal == id_Cargo && a.estado == 1
                             select new
                             {
                                 a.id_personal,
                                 a.nroDoc_personal,
                                 a.apellidos_personal,
                                 a.nombres_personal,
                             }).ToList();
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_Vendedor = Convert.ToInt32(parametros[2].ToString());
                    int id_transportista = Convert.ToInt32(parametros[3].ToString());
                    int id_tipoEntrega = Convert.ToInt32(parametros[4].ToString());
                    string fecha_ini = parametros[5].ToString();

                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    resul = obj_negocio.Listar_PedidoCab(id_local, id_almacen, id_Vendedor, id_transportista, id_tipoEntrega, fecha_ini);
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    int id_pedido = Convert.ToInt32(parametros[0].ToString()); 

                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    resul = obj_negocio.Listar_PedidoDet(id_pedido);

                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    int id_pedido = Convert.ToInt32(parametros[0].ToString());
                    string fechaTransaccion = parametros[1].ToString();
                    string nroNotaCredito = parametros[2].ToString();
                    int usuario = Convert.ToInt32(parametros[3].ToString());

                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    resul = obj_negocio.set_Generar_AprobacionDevolucion(id_pedido, fechaTransaccion, nroNotaCredito, usuario);

                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_Vendedor = Convert.ToInt32(parametros[2].ToString());
                    string fecha_ini = parametros[3].ToString();
                    string fecha_fin = parametros[4].ToString();
                    int id_usuario = Convert.ToInt32(parametros[5].ToString());

                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    resul = obj_negocio.generarDescargaPedidos_txt(id_local, id_almacen, id_Vendedor, fecha_ini, fecha_fin, id_usuario);
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
