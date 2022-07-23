using Entidades;
using Negocio.Almacen.Procesos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Procesos.Transferencias
{
    [EnableCors("*", "*", "*")]
    public class AprobarTransferenciaController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetAprobarTransferencia(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int Id_AlmTranCab = Convert.ToInt32(parametros[0].ToString());

                    resul = (from det in db.tbl_Alm_Transferencia_Det
                             join pro in db.tbl_Alm_Producto on det.id_Material equals pro.id_Producto
                             //join um in db.tbl_Alm_UnidadMedida on pro.id_unidadMedida equals um.id_unidadMedida
                             join um in db.tbl_Alm_UnidadMedida on det.id_UnidadMedida_Ingreso equals um.id_unidadMedida
                             join cat in db.tbl_Alm_ProductoCategoria on pro.id_categoriaProducto equals cat.id_categoriaProducto
                             join mar in db.tbl_Alm_ProductoMarca on pro.id_marcaProducto equals mar.id_marcaProducto
                             where det.Id_AlmTranCab == Id_AlmTranCab
                             select new
                             {
                                 det.Id_AlmTranDet,
                                 det.Id_AlmTranCab,
                                 pro.nombre_Producto,
                                 pro.id_Producto,
                                 codigo_Producto = pro.codigo1_Producto,
                                 um_Producto = um.nombre_UnidadMedida,
                                 categoria_Producto = cat.nombre_Categoria,
                                 cantidad_ingresada = det.cantidad_TranferenciaDet,
                                 marca_Producto = mar.nombre_marcaproducto,
                                 det.nroLote,
                                 det.fechaProduccion,
                                 det.fechaVencimiento

                             }).ToList();

                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int Id_AlmTranCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    AprobarTransferencia_BL obj_negocio = new AprobarTransferencia_BL();
                    resul = obj_negocio.Set_AprobarTransferencia_SinGuia(Id_AlmTranCab, id_usuario);

                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int Id_AlmTranCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    string serie = parametros[2].ToString();
                    string nroDocumento = parametros[3].ToString();
                    string fecha_emision = parametros[4].ToString();

                    int id_Transportista = Convert.ToInt32(parametros[5].ToString());
                    int id_vehiculo = Convert.ToInt32(parametros[6].ToString());
                    int id_Proveedor = Convert.ToInt32(parametros[7].ToString());

                    string fecha_traslado = parametros[8].ToString();

                    AprobarTransferencia_BL obj_negocio = new AprobarTransferencia_BL();
                    resul = obj_negocio.Set_AprobarTransferencia_ConGuia(Id_AlmTranCab, id_usuario, serie, nroDocumento, fecha_emision, id_Transportista, id_vehiculo, id_Proveedor, fecha_traslado);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int Id_AlmTranCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    AprobarTransferencia_BL obj_negocio = new AprobarTransferencia_BL();
                    resul = obj_negocio.Set_RechazarTransferencia(Id_AlmTranCab, id_usuario);
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    string nroDocumento = parametros[0].ToString();
                    int id_Proveedor = Convert.ToInt32(parametros[1].ToString());

                    resul = db.tbl_Alm_Guias_Cab.Count(e => e.numero_GuiaCab == nroDocumento && e.id_Proveedor == id_Proveedor && (e.id_Movimiento == 8 || e.id_Movimiento == 11) && e.estado != 4);

                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|'); 
                    int id_transferencia = Convert.ToInt32(parametros[0].ToString());
                    int id_estado = Convert.ToInt32(parametros[1].ToString());

                    AprobarTransferencia_BL obj_negocio = new AprobarTransferencia_BL();
                    resul = obj_negocio.get_impresion_transferencias(id_transferencia, id_estado);

                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    int Id_AlmTranCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    string serie = parametros[2].ToString();
                    string nroDocumento = parametros[3].ToString();
                    string fecha_emision = parametros[4].ToString();

                    int id_Transportista = Convert.ToInt32(parametros[5].ToString());
                    int id_vehiculo = Convert.ToInt32(parametros[6].ToString());
                    int id_Proveedor = Convert.ToInt32(parametros[7].ToString());

                    string fecha_traslado = parametros[8].ToString();

                    AprobarTransferencia_BL obj_negocio = new AprobarTransferencia_BL();
                    resul = obj_negocio.Set_generarTransferencia_ConGuia(Id_AlmTranCab, id_usuario, serie, nroDocumento, fecha_emision, id_Transportista, id_vehiculo, id_Proveedor, fecha_traslado);
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    int Id_TranfCab = Convert.ToInt32(parametros[0].ToString());
                    int Id_TranfDet = Convert.ToInt32(parametros[1].ToString());
                    string cant =  parametros[2].ToString();
                    int Id_usuario= Convert.ToInt32(parametros[3].ToString());

                    AprobarTransferencia_BL obj_negocio = new AprobarTransferencia_BL();
                    resul = obj_negocio.Set_actualizarCantTransferencia(Id_TranfCab, Id_TranfDet, cant, Id_usuario);
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Local = Convert.ToInt32(parametros[0].ToString());
                    int id_Almacen = Convert.ToInt32(parametros[1].ToString());
                    int tipo_reporte = Convert.ToInt32(parametros[2].ToString());

                    AprobarTransferencia_BL obj_negocio = new AprobarTransferencia_BL();
                    resul = obj_negocio.get_mostrandoTransferencias_porAprobar(id_Local, id_Almacen, tipo_reporte);
                    
                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    int Id_AlmTranCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    string serie = parametros[2].ToString();
                    string nroDocumento = parametros[3].ToString();
                    string fecha_emision = parametros[4].ToString();

                    int id_Transportista = Convert.ToInt32(parametros[5].ToString());
                    int id_vehiculo = Convert.ToInt32(parametros[6].ToString());
                    int id_Proveedor = Convert.ToInt32(parametros[7].ToString());

                    string fecha_traslado = parametros[8].ToString();
                    int id_tipoDocumento = Convert.ToInt32(parametros[9].ToString());

                    AprobarTransferencia_BL obj_negocio = new AprobarTransferencia_BL();
                    resul = obj_negocio.Set_generarTransferencia_ConGuia_new(Id_AlmTranCab, id_usuario, serie, nroDocumento, fecha_emision, id_Transportista, id_vehiculo, id_Proveedor, fecha_traslado, id_tipoDocumento);
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
