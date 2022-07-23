using Entidades;
using Negocio.Almacen.Procesos;
using Negocio.Resultado;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
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
                else if (opcion == 14)
                {
                    string[] parametros = filtro.Split('|');
                    int id_usuario = Convert.ToInt32(parametros[0].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.get_tipoOrden_usuario(id_usuario);
                }
                else if (opcion == 15)
                {
                    string[] parametros = filtro.Split('|');
                    int id_tipoOrden = Convert.ToInt32(parametros[0].ToString());
                    int id_anexo = Convert.ToInt32(parametros[1].ToString());

                    int id_almacen = Convert.ToInt32(parametros[2].ToString());
                    int id_estado = Convert.ToInt32(parametros[3].ToString());
                    string fecha_ini = parametros[4].ToString();
                    string fecha_fin = parametros[5].ToString();
                    int id_proveedor = Convert.ToInt32(parametros[6].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.get_informacionIngresoComprasServicios_cab(id_tipoOrden, id_anexo, id_almacen, id_estado, fecha_ini, fecha_fin, id_proveedor);
                }
                else if (opcion == 16)
                {
                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.get_unidadMedidaCompraServicio();
                }
                else if (opcion == 17)
                {
                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    string[] parametros = filtro.Split('|');

                    int id_TipoOrden = Convert.ToInt32(parametros[0].ToString());
                    int id_anexo = Convert.ToInt32(parametros[1].ToString());
                    int id_almacen = Convert.ToInt32(parametros[2].ToString());
                    string codigoProducto = parametros[3].ToString();
                    int id_usuario = Convert.ToInt32(parametros[4].ToString());

                    resul = obj_negocio.get_buscarProducto_codigo(id_TipoOrden, id_anexo, id_almacen, codigoProducto, id_usuario);
                }
                else if (opcion == 18)
                {
                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    string[] parametros = filtro.Split('|');

                    int id_TipoOrden = Convert.ToInt32(parametros[0].ToString());
                    int id_anexo = Convert.ToInt32(parametros[1].ToString());
                    int id_almacen = Convert.ToInt32(parametros[2].ToString());
                    string filtro_Producto = parametros[3].ToString();
                    int id_usuario = Convert.ToInt32(parametros[4].ToString());

                    resul = obj_negocio.get_buscarProducto_modal(id_TipoOrden, id_anexo, id_almacen, filtro_Producto, id_usuario);
                }
                else if (opcion == 19)
                {
                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    string[] parametros = filtro.Split('|');
                     
                    int id_GuiaCab = Convert.ToInt32(parametros[0].ToString());
                    int idProducto = Convert.ToInt32(parametros[1].ToString());
                    string codigoProducto = parametros[2].ToString();
                    string descripcionProducto = parametros[3].ToString();
                    int idUnidadMedida = Convert.ToInt32(parametros[4].ToString());
                    string cantidad = parametros[5].ToString();
                    string precio = parametros[6].ToString();
                    string importe = parametros[7].ToString();

                    int id_TipoOrden = Convert.ToInt32(parametros[8].ToString());
                    int id_usuario = Convert.ToInt32(parametros[9].ToString());

                    resul = obj_negocio.get_agregarGuiasDet(id_GuiaCab, idProducto, codigoProducto, descripcionProducto, idUnidadMedida, cantidad, precio, importe, id_TipoOrden, id_usuario);
                }
                else if (opcion == 20)
                {
                    string[] parametros = filtro.Split('|');
                    int idGuiaCab = Convert.ToInt32(parametros[0].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.get_listar_detalleComprasServicio(idGuiaCab);
                }
                else if (opcion == 21)
                {
                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    string[] parametros = filtro.Split('|');

                    int id_GuiaDet = Convert.ToInt32(parametros[0].ToString());
                    int idProducto = Convert.ToInt32(parametros[1].ToString());
                    string codigoProducto = parametros[2].ToString();
                    string descripcionProducto = parametros[3].ToString();
                    int idUnidadMedida = Convert.ToInt32(parametros[4].ToString());

                    string cantidad = parametros[5].ToString();
                    string precio = parametros[6].ToString();
                    string importe = parametros[7].ToString();
                    int id_usuario = Convert.ToInt32(parametros[8].ToString());

                    resul = obj_negocio.get_actualizarGuiasDet(id_GuiaDet, idProducto, codigoProducto, descripcionProducto, idUnidadMedida, cantidad, precio, importe,  id_usuario);
                }
                else if (opcion == 22)
                {
                    string[] parametros = filtro.Split('|');
                    int id_GuiaDet = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.set_eliminar_GuiasDet_comprasServicios(id_GuiaDet, id_usuario);
                }
                else if (opcion == 23)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Proveedor = Convert.ToInt32(parametros[0].ToString());
                    int tipoReporte = Convert.ToInt32(parametros[1].ToString());
                    int id_tipoDoc = Convert.ToInt32(parametros[2].ToString());
                    string nro_documento = parametros[3].ToString();
 

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.get_informacionPago_proveedores(id_Proveedor, tipoReporte, id_tipoDoc, nro_documento);
                }
                else if (opcion == 24)
                {
                    string[] parametros = filtro.Split('|');
                    int id_banco = Convert.ToInt32(parametros[0].ToString());
                    string nroOperacion = parametros[1].ToString();
                    string fechaOperacion = parametros[2].ToString();

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.get_verificarNroOperacionPagos(id_banco, nroOperacion, fechaOperacion);
                }
                else if (opcion == 25)
                {
                    string[] parametros = filtro.Split('|');
                    int idGuiaCab = Convert.ToInt32(parametros[0].ToString());
                    int idFormaPago = Convert.ToInt32(parametros[1].ToString());
                    int idBanco = Convert.ToInt32(parametros[2].ToString());

                    string fechaOperacion = parametros[3].ToString();
                    string nroOperacion = parametros[4].ToString();
                    string montoPago = parametros[5].ToString();
                    int idUsuario = Convert.ToInt32(parametros[6].ToString());
                    int esMasivo = Convert.ToInt32(parametros[7].ToString());

                    

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.Set_generarPagosCab(idGuiaCab, idFormaPago, idBanco, fechaOperacion, nroOperacion, montoPago, idUsuario, esMasivo);
                }
                else if (opcion == 26)
                {
                    string[] parametros = filtro.Split('|');
                    int idPago = Convert.ToInt32(parametros[0].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.get_detallePagos(idPago);
                }
                else if (opcion == 27)
                {
                    string[] parametros = filtro.Split('|');
                    
                    int tipoReporte = Convert.ToInt32(parametros[0].ToString());
                    int id_Proveedor = Convert.ToInt32(parametros[1].ToString());
                    int tipoDocumentos = Convert.ToInt32(parametros[2].ToString()); 
                    int idUsuario = Convert.ToInt32(parametros[3].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.ExportarExcel_reportePagos(tipoReporte, id_Proveedor, tipoDocumentos, idUsuario);
                }
                else if (opcion == 28)
                {
                    string[] parametros = filtro.Split('|');

                    int id_tipoOrden = Convert.ToInt32(parametros[0].ToString());
                    int id_anexo = Convert.ToInt32(parametros[1].ToString());

                    int id_almacen = Convert.ToInt32(parametros[2].ToString());
                    int id_estado = Convert.ToInt32(parametros[3].ToString());
                    string fecha_ini = parametros[4].ToString();
                    string fecha_fin = parametros[5].ToString();
                    int id_proveedor = Convert.ToInt32(parametros[6].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.ExportarExcel_IngresoFacturasCompraServicio(id_tipoOrden, id_anexo, id_almacen, id_estado, fecha_ini, fecha_fin, id_proveedor);

                }
                else if (opcion == 29)
                {
                    string[] parametros = filtro.Split('|');

                    int id_GuiaCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.set_anularIngresoFacturaCompraServicio(id_GuiaCab, id_usuario);
                }
                else if (opcion == 30)
                {
                    string[] parametros = filtro.Split('|');
                    int idGuiaCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    resul = obj_negocio.set_cerrarGuiacompraServicio(idGuiaCab, id_usuario);
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
 
            objReemplazar.id_TipoOrden = Tbl_Fac_Facturas_Compras_cab.id_TipoOrden;
            objReemplazar.id_anexos = Tbl_Fac_Facturas_Compras_cab.id_anexos;
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

            objReemplazar.porDetraccion = Tbl_Fac_Facturas_Compras_cab.porDetraccion;
            objReemplazar.ExoneradaIGV = Tbl_Fac_Facturas_Compras_cab.ExoneradaIGV;
            objReemplazar.porRetencion = Tbl_Fac_Facturas_Compras_cab.porRetencion;


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

        [HttpPost]
        [Route("api/IngresoFacturas/UploadImageVoucher")]
        public object UploadImageVoucherDeposito(int idGuiaCab, int idUsuario)
        {
            Resul res = new Resul();
            string nombreFile = "";
            string nombreFileServer = "";
            string path = "";
            try
            {
                System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;
                for (int i = 0; i < files.Count; i++)
                {
                    System.Web.HttpPostedFile file = files[i];
                    string extension = System.IO.Path.GetExtension(file.FileName);

                    nombreFile = file.FileName;

                    //-----generando clave unica---
                    var guid = Guid.NewGuid();
                    var guidB = guid.ToString("B");
                    nombreFileServer = idUsuario + "_image_voucher_compras_servicio" + Guid.Parse(guidB) + extension;

                    //---almacenando la imagen--
                    path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagenes/" + nombreFileServer);
                    file.SaveAs(path);
                }

                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                    ///----validando que en servidor solo halla una sola foto---
                    Tbl_Fac_Facturas_Compras_cab objectCompras;
                    objectCompras = db.Tbl_Fac_Facturas_Compras_cab.Where(p => p.id_GuiaCab == idGuiaCab).FirstOrDefault<Tbl_Fac_Facturas_Compras_cab>();

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    res.ok = true;
                    res.data = obj_negocio.Set_Actualizar_imagenComprobanteComprasServicio(idGuiaCab, nombreFile, nombreFileServer);

                    //---si previamente habia una foto, al reemplazarla borramos la anterior
                    if (objectCompras != null)
                    {
                        string urlFotoAntes = objectCompras.nombreArchivoServidor;
                        path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagenes/" + urlFotoAntes);

                        if (File.Exists(path))
                        {
                            File.Delete(path);
                        }
                    }
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo guardar el archivo en el servidor..";
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }

            return res;
        }



        [HttpPost]
        [Route("api/IngresoFacturas/UploadVoucherPago")]
        public object UploadVoucherPago(string idPago, int idUsuario, int esMasivo)
        {
            Resul res = new Resul();
            string nombreFile = "";
            string nombreFileServer = "";
            string path = "";
            try
            {
                System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;
                for (int i = 0; i < files.Count; i++)
                {
                    System.Web.HttpPostedFile file = files[i];
                    string extension = System.IO.Path.GetExtension(file.FileName);

                    nombreFile = file.FileName;

                    //-----generando clave unica---
                    var guid = Guid.NewGuid();
                    var guidB = guid.ToString("B");

                    if (esMasivo == 0) {
                        nombreFileServer = idUsuario + "_voucher_pagos" + Guid.Parse(guidB) + extension;
                    }
                    else //---- pago masivo
                    {
                        nombreFileServer = idUsuario + "_M_voucher_pagos" + Guid.Parse(guidB) + extension;
                    }        

                    //---almacenando la imagen--
                    path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagenes/" + nombreFileServer);
                    file.SaveAs(path);
                }

                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                    ///----validando que en servidor solo halla una sola foto---
                    //Tbl_Fac_Compras_Cancelacion_Cab objectPago;
                    //objectPago = db.Tbl_Fac_Compras_Cancelacion_Cab.Where(p => p.id_cancelacion_cab == idPago).FirstOrDefault<Tbl_Fac_Compras_Cancelacion_Cab>();

                    IngresoFacturas_BL obj_negocio = new IngresoFacturas_BL();
                    res.ok = true;

                    if (esMasivo == 0)
                    {
                        res.data = obj_negocio.Set_Actualizar_imagenComprobantePago(Convert.ToInt32(idPago), nombreFile, nombreFileServer);
                    }
                    if (esMasivo == 1) //---- pago masivo
                    {
                        res.data = obj_negocio.Set_Actualizar_imagenComprobantePago_masivo(idPago, nombreFile, nombreFileServer);
                    }

                    ////---si previamente habia una foto, al reemplazarla borramos la anterior
                    //if (objectPago != null)
                    //{
                    //    string urlFotoAntes = objectPago.url_foto_Pago;
                    //    path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagenes/" + urlFotoAntes);

                    //    if (File.Exists(path))
                    //    {
                    //        File.Delete(path);
                    //    }
                    //}
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo guardar el archivo en el servidor..";
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }

            return res;
        }


    }
}
