using Entidades;
using Negocio.Almacen.Procesos;
using Negocio.Resultado;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Procesos.TransferenciaNew
{
    [EnableCors("*", "*", "*")]

    public class TransferenciasNewController : ApiController
    {

        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetTransferenciasNew(int opcion, string filtro)
        {

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
 
                    int Id_AlmTranCab = Convert.ToInt32(parametros[0].ToString());
                    string nro_Transferencia = parametros[1].ToString();
                    string fechaEmision_TranferenciaCab = parametros[2].ToString();
                    string obs_TranferenciaCab = parametros[3].ToString();
                    int origen_id_Local = Convert.ToInt32(parametros[4].ToString());
                    int origen_id_Almacen = Convert.ToInt32(parametros[5].ToString());

                    int destino_id_Local = Convert.ToInt32(parametros[6].ToString());
                    int destino_id_Almacen = Convert.ToInt32(parametros[7].ToString());
                    int id_usuario = Convert.ToInt32(parametros[8].ToString());

                    TransferenciaNew_BL obj_negocio = new TransferenciaNew_BL();
                    resul = obj_negocio.Set_insert_update_transferenciasCab(Id_AlmTranCab, nro_Transferencia, fechaEmision_TranferenciaCab, obs_TranferenciaCab, origen_id_Local, origen_id_Almacen, destino_id_Local, destino_id_Almacen, id_usuario);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
 
                    int origen_id_Local = Convert.ToInt32(parametros[0].ToString());
                    int origen_id_Almacen = Convert.ToInt32(parametros[1].ToString());
                    string cod_producto = parametros[2].ToString();
                    int id_usuario = Convert.ToInt32(parametros[3].ToString());

                    TransferenciaNew_BL obj_negocio = new TransferenciaNew_BL();
                    resul = obj_negocio.get_buscarProducto_codigo(origen_id_Local, origen_id_Almacen, cod_producto, id_usuario);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');

                    int origen_id_Local = Convert.ToInt32(parametros[0].ToString());
                    int origen_id_Almacen = Convert.ToInt32(parametros[1].ToString());
                    string filtroBusqueda = parametros[2].ToString();
                    int id_usuario = Convert.ToInt32(parametros[3].ToString());

                    TransferenciaNew_BL obj_negocio = new TransferenciaNew_BL();
                    resul = obj_negocio.get_buscarProducto_todos(origen_id_Local, origen_id_Almacen, filtroBusqueda, id_usuario);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int id_transferenciaCab = Convert.ToInt32(parametros[0].ToString());
 
                    TransferenciaNew_BL obj_negocio = new TransferenciaNew_BL();
                    resul = obj_negocio.get_transferenciasDetalle(id_transferenciaCab);
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');

                    int origen_id_Local = Convert.ToInt32(parametros[0].ToString());
                    int origen_id_Almacen = Convert.ToInt32(parametros[1].ToString());

                    int id_Material = Convert.ToInt32(parametros[2].ToString());
                    int id_UnidadMedida_Ingreso = Convert.ToInt32(parametros[3].ToString());
                    string nroLote = parametros[4].ToString();

                    int id_usuario = Convert.ToInt32(parametros[5].ToString());
                    string fechaProduccion = parametros[6].ToString();

                    TransferenciaNew_BL obj_negocio = new TransferenciaNew_BL();
                    resul = obj_negocio.get_buscarProducto_edicion(origen_id_Local, origen_id_Almacen, id_Material, id_UnidadMedida_Ingreso, nroLote, id_usuario, fechaProduccion);
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    int Id_AlmTranDet = Convert.ToInt32(parametros[0].ToString());
 

                    TransferenciaNew_BL obj_negocio = new TransferenciaNew_BL();
                    resul = obj_negocio.set_eliminar_transferenciaDet(Id_AlmTranDet);
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    int id_transferenciaCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    TransferenciaNew_BL obj_negocio = new TransferenciaNew_BL();
                    resul = obj_negocio.set_cerrar_tranferenciasCab(id_transferenciaCab, id_usuario);
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    int id_transferenciaCab = Convert.ToInt32(parametros[0].ToString());
                    string flagGuia = parametros[1].ToString();
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    TransferenciaNew_BL obj_negocio = new TransferenciaNew_BL();
                    resul = obj_negocio.set_reactivar_tranferenciasCab(id_transferenciaCab, flagGuia, id_usuario);
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');

                    int origen_id_Local = Convert.ToInt32(parametros[0].ToString());
                    int origen_id_Almacen = Convert.ToInt32(parametros[1].ToString());
                    string filtroBusqueda = parametros[2].ToString();
                    int id_usuario = Convert.ToInt32(parametros[3].ToString());

                    TransferenciaNew_BL obj_negocio = new TransferenciaNew_BL();
                    resul = obj_negocio.get_buscarProducto_ayudaModal(origen_id_Local, origen_id_Almacen, filtroBusqueda, id_usuario);
                }
                else if (opcion == 10)
                {
                    TransferenciaNew_BL obj_negocio = new TransferenciaNew_BL();
                    resul = obj_negocio.get_tipoDocumento_Guia();
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

        //---- DETALLE

        [HttpPost]
        [Route("api/TransferenciasNew/Posttbl_transferencias_det")]
        public object Posttbl_transferencias_det( tbl_Alm_Transferencia_Det tbl_Alm_Transferencia_Det)
        {
            Resul res = new Resul();
            try
            {
                tbl_Alm_Transferencia_Det.fecha_creacion = DateTime.Now;
                db.tbl_Alm_Transferencia_Det.Add(tbl_Alm_Transferencia_Det);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Alm_Transferencia_Det.Id_AlmTranDet;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        [HttpPut]
        [Route("api/TransferenciasNew/Putttbl_transferencias_det")]
        public object Putttbl_transferencias_det(int id, tbl_Alm_Transferencia_Det tbl_Alm_Transferencia_Det)
        {
            Resul res = new Resul();

            tbl_Alm_Transferencia_Det objReemplazar;
            objReemplazar = db.tbl_Alm_Transferencia_Det.Where(u => u.Id_AlmTranDet == id).FirstOrDefault<tbl_Alm_Transferencia_Det>();

            objReemplazar.cantidad_TranferenciaDet = tbl_Alm_Transferencia_Det.cantidad_TranferenciaDet;
            objReemplazar.usuario_edicion = tbl_Alm_Transferencia_Det.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

            db.Entry(objReemplazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
                res.ok = true;
                res.data = "OK";
            }
            catch (DbUpdateConcurrencyException ex)
            {
                res.ok = false;
                res.data = ex.InnerException.Message;
            }
            return res;
        }



    }
}
