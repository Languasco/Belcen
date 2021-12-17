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

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Procesos.IngresoFacturas
{
    [EnableCors("*", "*", "*")]
    public class IngresoFacturasController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetIngresoFacturas(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Resul res = new Resul();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_estado = Convert.ToInt32(parametros[2].ToString());
                    string fecha_ini = parametros[3].ToString();
                    string fecha_fin = parametros[4].ToString();
                    int id_proveedor = Convert.ToInt32(parametros[5].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.get_informacionIngresoFacturas_cab(id_local, id_almacen, id_estado, fecha_ini, fecha_fin, id_proveedor);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    string consulta =  parametros[0].ToString();
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());
                    int id_almacen = Convert.ToInt32(parametros[2].ToString());
                    int id_proveedor = Convert.ToInt32(parametros[3].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.get_buscarGuiasCab(consulta, id_usuario, id_almacen, id_proveedor);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int idGuiaCab = Convert.ToInt32(parametros[0].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.get_listarGuiasDet(idGuiaCab);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int id_GuiaDet = Convert.ToInt32(parametros[0].ToString());
                    int cantidad = Convert.ToInt32(parametros[1].ToString());
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.set_actualizar_cantidadGuiasDet(id_GuiaDet, cantidad, id_usuario );
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int id_GuiaDet = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.set_eliminar_cantidadGuiasDet(id_GuiaDet, id_usuario);
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    int idGuiaCab = Convert.ToInt32(parametros[0].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.get_listarGuiasCabecera_ID(idGuiaCab);
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    int idGuiaCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.set_cerrarGuia(idGuiaCab, id_usuario);
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    int id_GuiaDet = Convert.ToInt32(parametros[0].ToString());
                    string precio = parametros[1].ToString();
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.set_actualizar_precioGuiasDet(id_GuiaDet, precio, id_usuario);
                }
                else if(opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    int id_estado = Convert.ToInt32(parametros[2].ToString());
                    string fecha_ini = parametros[3].ToString();
                    string fecha_fin = parametros[4].ToString();
                    int id_proveedor = Convert.ToInt32(parametros[5].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.ExportarExcel_ingresoFacturas(id_local, id_almacen, id_estado, fecha_ini, fecha_fin, id_proveedor);
                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');

                    int tipo_documento = Convert.ToInt32(parametros[0].ToString());
                    string nro_documento = parametros[1].ToString();
                    int id_Proveedor = Convert.ToInt32(parametros[2].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.get_verificarNroDoc(tipo_documento , nro_documento, id_Proveedor);
                }
                else if (opcion == 11)
                {
                    string[] parametros = filtro.Split('|');

                    int id_GuiaCab = Convert.ToInt32(parametros[0].ToString()); 
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.set_anularIngresoFactura(id_GuiaCab, id_usuario);
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');
 
                    int id_anexo = Convert.ToInt32(parametros[0].ToString());
                    string fecha_ini = parametros[1].ToString();
                    string fecha_fin = parametros[2].ToString();
                    int opcion_reporte = Convert.ToInt32(parametros[3].ToString());
                    int id_usuario = Convert.ToInt32(parametros[4].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();

                    if (opcion_reporte == 1)
                    {
                        resul = obj_negocio.ExportarExcel_reporteContableVentas(id_anexo, fecha_ini, fecha_fin, opcion_reporte, id_usuario);
                    }
                    if (opcion_reporte == 2)
                    {
                        resul = obj_negocio.ExportarExcel_reporteContableCompras(id_anexo, fecha_ini, fecha_fin, opcion_reporte, id_usuario);
                    }
                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');

                    int id_anexo = Convert.ToInt32(parametros[0].ToString());
                    string fecha_ini = parametros[1].ToString();
                    string fecha_fin = parametros[2].ToString();
                    int id_usuario = Convert.ToInt32(parametros[3].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.ExportarExcel_ventaAcumulada(id_anexo, fecha_ini, fecha_fin,  id_usuario);
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
        
        [HttpPost]
        [Route("api/IngresoFacturas/PostTbl_Fac_Facturas_Compras_cab")]
        public object PostTbl_Fac_Facturas_Compras_cab(Tbl_Fac_Facturas_Compras_cab Tbl_Fac_Facturas_Compras_cab)
        {
            Resul res = new Resul();
            try
            {
                Tbl_Fac_Facturas_Compras_cab.fecha_creacion = DateTime.Now;
                db.Tbl_Fac_Facturas_Compras_cab.Add(Tbl_Fac_Facturas_Compras_cab);
                db.SaveChanges();

                res.ok = true;
                res.data = Tbl_Fac_Facturas_Compras_cab.id_GuiaCab;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        [HttpPut]
        [Route("api/IngresoFacturas/PutTbl_Fac_Facturas_Compras_cab")]
        public object PutTbl_Fac_Facturas_Compras_cab(int id, Tbl_Fac_Facturas_Compras_cab Tbl_Fac_Facturas_Compras_cab)
        {
            Resul res = new Resul();

            Tbl_Fac_Facturas_Compras_cab objReemplazar;
            objReemplazar = db.Tbl_Fac_Facturas_Compras_cab.Where(u => u.id_GuiaCab == id).FirstOrDefault<Tbl_Fac_Facturas_Compras_cab>();                       
 
            objReemplazar.id_Local = Tbl_Fac_Facturas_Compras_cab.id_Local;
            objReemplazar.id_Almacen = Tbl_Fac_Facturas_Compras_cab.id_Almacen;
            objReemplazar.id_Moneda = Tbl_Fac_Facturas_Compras_cab.id_Moneda;
            objReemplazar.tipoCambio_GuiaCab = Tbl_Fac_Facturas_Compras_cab.tipoCambio_GuiaCab;
            objReemplazar.id_Proveedor = Tbl_Fac_Facturas_Compras_cab.id_Proveedor;
 
            objReemplazar.obs_GuiaCab = Tbl_Fac_Facturas_Compras_cab.obs_GuiaCab;
             objReemplazar.id_tipo_documento = Tbl_Fac_Facturas_Compras_cab.id_tipo_documento;
            objReemplazar.nro_documento = Tbl_Fac_Facturas_Compras_cab.nro_documento;
            objReemplazar.fecha_emision = Tbl_Fac_Facturas_Compras_cab.fecha_emision;

            objReemplazar.fecha_emision_oc = Tbl_Fac_Facturas_Compras_cab.fecha_emision_oc;
            objReemplazar.nro_orden_compra = Tbl_Fac_Facturas_Compras_cab.nro_orden_compra;
            objReemplazar.id_CondicionPago = Tbl_Fac_Facturas_Compras_cab.id_CondicionPago;
            objReemplazar.id_Banco = Tbl_Fac_Facturas_Compras_cab.id_Banco;
            objReemplazar.nroCuenta = Tbl_Fac_Facturas_Compras_cab.nroCuenta;
            objReemplazar.CCINro = Tbl_Fac_Facturas_Compras_cab.CCINro;
            objReemplazar.flag_tipo_facturacion = Tbl_Fac_Facturas_Compras_cab.flag_tipo_facturacion;

            objReemplazar.estado = Tbl_Fac_Facturas_Compras_cab.estado;
            objReemplazar.usuario_edicion = Tbl_Fac_Facturas_Compras_cab.usuario_creacion;
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
               
        [HttpPost]
        [Route("api/IngresoFacturas/post_agregarGuiasCab")]
        public object post_agregarGuiasCab(List<string> idGuiasCab, string filtro)
        {
            Resul res = new Resul();
            object resultado = null;
            try
            {
                string[] parametros = filtro.Split('|');
                string idGuiasMasivos = String.Join(",", idGuiasCab);

                int idusuario = Convert.ToInt32(parametros[0].ToString());
                int idGuiaCab = Convert.ToInt32(parametros[1].ToString());

                IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                resultado = obj_negocio.get_agregarGuiasCab(idGuiasMasivos,idusuario, idGuiaCab);
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
