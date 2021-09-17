using Entidades;
using Negocio.Facturacion.Procesos;
using Negocio.Resultado;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Facturacion.Procesos.RevisionPedido
{
    [EnableCors("*", "*", "*")]

    public class RevisionPedidoController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetRevisionPedidos(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_estados();
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_vendedor = Convert.ToInt32(parametros[2].ToString());
                    int id_Anexos = Convert.ToInt32(parametros[3].ToString());
                    string fechaIni = parametros[4].ToString();
                    string fechaFin = parametros[5].ToString();
                    int id_transportista = Convert.ToInt32(parametros[6].ToString());
                    int id_estado = Convert.ToInt32(parametros[7].ToString());
                    int flagFueraRuta = Convert.ToInt32(parametros[8].ToString());

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_revisionesPedidos(id_local, id_almacen, id_vendedor, id_Anexos, fechaIni, fechaFin, id_transportista, id_estado, flagFueraRuta);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int id_almacen = Convert.ToInt32(parametros[0].ToString());

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_anexos_almacen(id_almacen);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int idLocal = Convert.ToInt32(parametros[0].ToString());

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_vendedorLocal(idLocal);
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int idLocal = Convert.ToInt32(parametros[0].ToString());

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_transportistaLocal(idLocal);
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');

                    string fechaIni = parametros[0].ToString();
                    string fechaFin = parametros[1].ToString();
                    int id_zona = Convert.ToInt32(parametros[2].ToString());
                    int id_transportista = Convert.ToInt32(parametros[3].ToString());
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());
                    int idVendedor = Convert.ToInt32(parametros[5].ToString());

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_consolidadoMercaderia(fechaIni, fechaFin, id_zona, id_transportista, idUsuario, idVendedor);
                }
                else if (opcion == 7)
                {
                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_tiposDocumentos();
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');

                    int id_zona = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_vendedor = Convert.ToInt32(parametros[2].ToString());
                    int id_Anexos = Convert.ToInt32(parametros[3].ToString());
                    string fechaIni = parametros[4].ToString();
                    string fechaFin = parametros[5].ToString();
                    int id_transportista = Convert.ToInt32(parametros[6].ToString());
                    int id_tipoDoc = Convert.ToInt32(parametros[7].ToString());
 

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_facturasCabeceras(id_zona, id_almacen, id_vendedor, id_Anexos, fechaIni, fechaFin, id_transportista, id_tipoDoc);
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');

                    string fechaIni = parametros[0].ToString();
                    string fechaFin = parametros[1].ToString();
                    int id_zona = Convert.ToInt32(parametros[2].ToString());
                    int id_transportista = Convert.ToInt32(parametros[3].ToString());
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());
                    int idVendedor = Convert.ToInt32(parametros[5].ToString());

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_liquidacionTransportista(fechaIni, fechaFin, id_zona, id_transportista, idUsuario, idVendedor);
                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    int id_usuario = Convert.ToInt32(parametros[0].ToString());

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_anexos_usuarios(id_usuario);
                }
                else if (opcion == 11)
                {
                    string[] parametros = filtro.Split('|');
                    int id_usuario = Convert.ToInt32(parametros[0].ToString());

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_locales_usuarios(id_usuario);
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Anexos = Convert.ToInt32(parametros[0].ToString());
                    int id_Local = Convert.ToInt32(parametros[1].ToString());
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_almacen_anexo_local(id_Anexos, id_Local, id_usuario);
                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Anexos = Convert.ToInt32(parametros[0].ToString());
                    int id_Local = Convert.ToInt32(parametros[1].ToString());
                    int id_Almacen = Convert.ToInt32(parametros[2].ToString());
                    int id_usuario = Convert.ToInt32(parametros[3].ToString());

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_zonas_anexo_local_almacen(id_Anexos, id_Local, id_Almacen, id_usuario);
                }
                else if (opcion == 14)
                {
                    string[] parametros = filtro.Split('|');

                    string fechaIni = parametros[0].ToString();
                    string fechaFin = parametros[1].ToString();
                    int id_zona = Convert.ToInt32(parametros[2].ToString());
                    int id_transportista = Convert.ToInt32(parametros[3].ToString());
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());
                    int idVendedor = Convert.ToInt32(parametros[5].ToString());

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_planillaCobranza(fechaIni, fechaFin, id_zona, id_transportista, idUsuario, idVendedor);
                }
                else if (opcion == 15)
                {
                    string[] parametros = filtro.Split('|');
                    int idZona = Convert.ToInt32(parametros[0].ToString());

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_anexosZona(idZona);
                }
                else if (opcion == 16)
                {
                    string[] parametros = filtro.Split('|');
                    int id_usuario = Convert.ToInt32(parametros[0].ToString());

                    RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                    resul = obj_negocio.get_anexos_usuarios_modulo(id_usuario);
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
        [Route("api/RevisionPedido/post_aprobarRevisiones")]
        public object post_aprobarRevisiones(List<string> listIdPedidos, string filtro)
        {
            Resul res = new Resul();
            object resultado = null;
            try
            {
                string[] parametros = filtro.Split('|');
                string idPedidosMasivo = String.Join(",", listIdPedidos);

                int idusuario = Convert.ToInt32(parametros[0].ToString());

                RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                resultado = obj_negocio.set_grabar_asignacionTecnico(idPedidosMasivo, idusuario);               
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;

                resultado = res;
            }
            return resultado;
        }

        [HttpPost]
        [Route("api/RevisionPedido/post_despachosPDF")]
        public object post_despachosPDF(List<string> listIdPedidos, string filtro)
        {
            Resul res = new Resul();
            object resultado = null;
            try
            {
                string[] parametros = filtro.Split('|');
                string idPedidosMasivo = String.Join(",", listIdPedidos);

                string fechaInicio = parametros[0].ToString();
                string fechaFinal = parametros[1].ToString();
                int idusuario = Convert.ToInt32(parametros[2].ToString());

                RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                resultado = obj_negocio.get_despachoPDF(idPedidosMasivo, fechaInicio, fechaFinal,   idusuario);
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;

                resultado = res;
            }
            return resultado;
        }

        [HttpPost]
        [Route("api/RevisionPedido/post_reImpresionDocumentos")]
        public object post_reImpresionDocumentos(List<string> idFacturasCab, string filtro)
        {
            Resul res = new Resul();
            object resultado = null;
            try
            {
                string[] parametros = filtro.Split('|');
                string idFacturasMasivos = String.Join(",", idFacturasCab);

                int idTipoDoc = Convert.ToInt32(parametros[0].ToString());
                int idusuario = Convert.ToInt32(parametros[1].ToString());

                RevisionPedidos_BL obj_negocio = new RevisionPedidos_BL();
                resultado = obj_negocio.get_reImprimirMasivo(idFacturasMasivos, idTipoDoc, idusuario);
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;

                resultado = res;
            }
            return resultado;
        }


    }
}
