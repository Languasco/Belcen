using Entidades;
using Entidades.Facturacion.Procesos;
using Negocio.Facturacion.Procesos;
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
using System.Web.Http.Description;

namespace WebApiGestionAlmacenCam.Controllers.Facturacion.Procesos.Pedidos
{
    [EnableCors("*", "*", "*")]
    public class PedidosController : ApiController
    {

        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetPedidos(int opcion, string filtro)
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
                    string fecha_ini = parametros[2].ToString();
                    string fecha_fin = parametros[3].ToString();
                    int id_vendedor = Convert.ToInt32(parametros[4].ToString());
                    int id_estado = Convert.ToInt32(parametros[5].ToString());
                    int id_Anexos = Convert.ToInt32(parametros[6].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Listando_Pedidos(id_local, id_almacen, fecha_ini, fecha_fin, id_vendedor, id_estado, id_Anexos);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    string nroDoc_cliente = parametros[0].ToString();

                    resul = (from c in db.Tbl_Clientes
                             where c.nroDoc_Cliente == nroDoc_cliente
                             select new
                             {
                                 c.id_cliente,
                                 c.codigoInterno_Cliente,
                                 c.nombres_Cliente,
                                 c.direccion_referencia,
                                 c.id_PersonalVendedor,

                             }).ToList();
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Almacen = Convert.ToInt32(parametros[0].ToString());
                    string cod_producto = parametros[1].ToString();
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Search_Producto(id_Almacen, cod_producto, id_usuario);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int idPedido = Convert.ToInt32(parametros[0].ToString());

                    resul = (from c in db.Tbl_Fac_Pedidos_Det
                             join d in db.Tbl_Fac_Pedidos_Cab on c.id_Pedido_Cab equals d.id_Pedido_Cab
                             join p in db.tbl_Alm_Producto on c.id_Producto equals p.id_Producto
                             join u in db.tbl_Alm_UnidadMedida on p.id_unidadMedida equals u.id_unidadMedida
                             join m in db.tbl_Alm_ProductoMarca on p.id_marcaProducto equals m.id_marcaProducto
                             join w in db.tbl_Alm_UnidadMedida on c.id_UnidadMedida_Venta equals w.id_unidadMedida
                             where c.id_Pedido_Cab == idPedido && d.estado != 12
                             select new
                             {
                                 c.id_Pedido_Det,
                                 c.id_Pedido_Cab,
                                 c.item_Pedido_Det,
                                 c.id_Producto,
                                 p.codigo1_Producto,
                                 p.nombre_Producto,
                                 u.nombre_UnidadMedida,
                                 c.precioVenta_Pedido_Det,
                                 c.porcentajeDescuento_Pedido_Det,
                                 c.Descuento_Pedido_Det,
                                 c.cantidad_Pedido_Det,
                                 c.porcentajeIGV_Pedido_Det,
                                 c.total_Pedido_Det,
                                 c.Numero_Pedido,
                                 m.nombre_marcaproducto,
                                 stock = 0,
                                 p.movLote,
                                 c.nroLote,
                                 c.factorMultiplicacion_Venta,
                                 c.id_UnidadMedida_Venta,
                                 nombre_UnidadMedida_Venta = w.nombre_UnidadMedida,
                                 c.fechaProduccion,
                                 c.fechaVencimiento

                             }).ToList();
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Pedido_Det = Convert.ToInt32(parametros[0].ToString());
                    string nroPedido = parametros[1].ToString();

                    Tbl_Fac_Pedidos_Det tbl_Fac_Pedidos_Det = db.Tbl_Fac_Pedidos_Det.Find(id_Pedido_Det);
                    if (tbl_Fac_Pedidos_Det == null)
                    {
                        return NotFound();
                    }

                    db.Tbl_Fac_Pedidos_Det.Remove(tbl_Fac_Pedidos_Det);
                    db.SaveChanges();

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    obj_negocio.Set_CalculosTotales_Pedidos(Convert.ToInt32(tbl_Fac_Pedidos_Det.id_Pedido_Cab) );

                    resul = "OK";

                }
                else if (opcion == 6)
                {
                    string Consulta = "";
                    Consulta = filtro;
                    if (filtro == null)
                    {
                        Consulta = "";
                    }

                    resul = (from c in db.Tbl_Clientes
                             where (c.nroDoc_Cliente + c.nombres_Cliente).Contains(Consulta)
                             orderby c.id_cliente ascending
                             select new
                             {
                                 c.id_cliente,
                                 c.codigoInterno_Cliente,
                                 c.nroDoc_Cliente,
                                 c.nombres_Cliente,
                                 c.direccion_referencia,
                                 c.id_PersonalVendedor
                             }).Take(10).ToList();
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Almacen = Convert.ToInt32(parametros[0].ToString());
                    string cod_producto = parametros[1].ToString();
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    string Consulta = "";
                    Consulta = cod_producto;
                    if (cod_producto == null)
                    {
                        Consulta = "";
                    }
                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Search_Ayuda_Producto(id_Almacen, Consulta, id_usuario);
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');

                    int idPedido = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());
                    int tipo_facturacion = Convert.ToInt32(parametros[2].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Set_GenerandoFacturacion(idPedido, id_usuario, tipo_facturacion);

                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Pedido_Cab = Convert.ToInt32(parametros[0].ToString());
                    string codRef = parametros[1].ToString();

                    decimal totalpago = Convert.ToDecimal(parametros[2].ToString());
                    decimal pagoCueta = Convert.ToDecimal(parametros[3].ToString());

                    int id_formaPago = Convert.ToInt32(parametros[4].ToString());
                    int id_banco = Convert.ToInt32(parametros[5].ToString());

                    string fechaOperacion = parametros[6].ToString();
                    string nroOperacion = parametros[7].ToString();

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Set_GenerandoPagos(id_Pedido_Cab, codRef, totalpago, pagoCueta, id_formaPago, id_banco, fechaOperacion, nroOperacion);

                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    string provincia = parametros[0].ToString();

                    resul = (from c in db.Tbl_Distritos
                             where c.CodProvincia == provincia
                             select new
                             {
                                 c.id_distrito,
                                 c.nombre_distrito
                             }).ToList();
                }
                else if (opcion == 11)
                {
                    resul = (from c in db.Tbl_Clientes
                             where c.nroDoc_Cliente == filtro
                             select new
                             {
                                 c.id_cliente
                             }).ToList();
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');

                    string numeroDocumento = parametros[0].ToString();
                    int id_TipoDoc = Convert.ToInt32(parametros[1].ToString());

                    resul = db.Tbl_Fac_Pedidos_Cab.Count(e => e.Numero_Documento == numeroDocumento && e.id_TipoDocumento == id_TipoDoc);
                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');

                    string numeroDoc = parametros[0].ToString();
                    int TipoDoc = Convert.ToInt32(parametros[1].ToString());
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Set_Rechazando_Pedido(numeroDoc, TipoDoc, id_usuario);

                }
                else if (opcion == 14)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Pedido_Cab = Convert.ToInt32(parametros[0].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.get_SaldoCuenta_Pedido(id_Pedido_Cab);

                }
                else if (opcion == 15)
                {
                    string[] parametros = filtro.Split('|');
                    string id_departamento = parametros[0].ToString();

                    resul = (from c in db.Tbl_GrupoTabla_Det
                             where c.id_grupoTabla == 3 && c.valor == id_departamento
                             select new
                             {
                                 c.id_detalleTabla,
                                 c.descripcion_grupoTabla
                             }).ToList();
                }
                else if (opcion == 16)
                {
                    string[] parametros = filtro.Split('|');
                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    string cod_producto = parametros[2].ToString();

                    string Consulta = "";
                    Consulta = cod_producto;
                    if (cod_producto == null)
                    {
                        Consulta = "";
                    }
                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Search_Ayuda_Producto_new(id_local, id_almacen, Consulta);
                }
                //----NOTA DE CREDITO DEBITO
                else if (opcion == 17)
                {
                    string[] parametros = filtro.Split('|');
                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    string fecha_ini = parametros[2].ToString();
                    string fecha_fin = parametros[3].ToString();
                    string nroDoc = parametros[4].ToString();
                    int id_Anexos = Convert.ToInt32(parametros[5].ToString());
                    int id_transportista = Convert.ToInt32(parametros[6].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Listando_facturas_Cab(id_local, id_almacen, fecha_ini, fecha_fin, nroDoc, id_Anexos, id_transportista);
                }
                else if (opcion == 18)
                {
                    string[] parametros = filtro.Split('|');
                    int id_facturaCab = Convert.ToInt32(parametros[0].ToString());
                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Listado_Stock_Notas_Credito(id_facturaCab);
                }
                else if (opcion == 19)
                {
                    string[] parametros = filtro.Split('|');
                    string id_TipoDocumento = parametros[0].ToString();

                    resul = (from c in db.tbl_fac_tipo_NC_ND_electronico
                             where c.tipo == id_TipoDocumento
                             select new
                             {
                                 c.id_tipo_nc_nd,
                                 c.descripcion
                             }).ToList();
                }
                else if (opcion == 20)
                {
                    string[] parametros = filtro.Split('|');
                    string id_factura_cab = parametros[0].ToString();
                    string fecha_emision = parametros[1].ToString();
                    string id_tipoDocumento = parametros[2].ToString();
                    string numero_documento = parametros[3].ToString();
                    string id_tipoOperacion = parametros[4].ToString();
                    string observacion = parametros[5].ToString();
                    int user = Convert.ToInt32(parametros[6].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.GenerandoNotaCredito_debito(id_factura_cab, fecha_emision, id_tipoDocumento, numero_documento, id_tipoOperacion, observacion, user);
                }
                else if (opcion == 21)
                {
                    string[] parametros = filtro.Split('|');

                    string numeroDocumento = parametros[0].ToString();
                    int id_TipoDoc = Convert.ToInt32(parametros[1].ToString());

                    resul = db.Tbl_Fac_Facturas_Cab.Count(e => e.Numero_Documento == numeroDocumento && e.id_TipoDocumento == id_TipoDoc);
                }
                else if (opcion == 22)  ///---consulta a la sunat por ruc...
                {
                    var httpWebRequest = (HttpWebRequest)WebRequest.Create("https://ruc.com.pe/api/v1/ruc");
                    httpWebRequest.ContentType = "application/json";
                    httpWebRequest.Method = "POST";

                    using (var streamWriter = new System.IO.StreamWriter(httpWebRequest.GetRequestStream()))
                    {
                        string Consulta_json = "{\"token\":\"8fe749b6-e682-4586-a949-3db9fe903ea1-617f960a-796c-4fc6-b499-ca92b7f0b22e\"," +
                                        "\"ruc\":\"10468100024\"}";

                        streamWriter.Write(Consulta_json);
                        streamWriter.Flush();
                        streamWriter.Close();
                    }

                    var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                    using (var streamReader = new System.IO.StreamReader(httpResponse.GetResponseStream()))
                    {
                        var result = streamReader.ReadToEnd();
                    }

                }
                else if (opcion == 23)
                {
   
                    string[] parametros = filtro.Split('|');
                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    string fecha_ini = parametros[2].ToString();
                    string fecha_fin = parametros[3].ToString();
                    string nroDoc = parametros[4].ToString();
                    int id_Anexos = Convert.ToInt32(parametros[5].ToString());
                    int id_transportista = Convert.ToInt32(parametros[6].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Listando_NotasCredito_Cab(id_local, id_almacen, fecha_ini, fecha_fin, nroDoc, id_Anexos, id_transportista);

                }
                else if (opcion == 24)
                {
                    string[] parametros = filtro.Split('|');
                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_tipoDoc = Convert.ToInt32(parametros[1].ToString());
                    int id_tipoDoc_Ref = Convert.ToInt32(parametros[2].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Get_numeroCorrelativo(id_local, id_tipoDoc, id_tipoDoc_Ref);
                }
                else if (opcion == 25)
                {
                    resul = (from c in db.Tbl_GrupoTabla_Det
                             where c.id_grupoTabla == 7
                             select new
                             {
                                 c.codigo_detalleTabla,
                                 c.descripcion_grupoTabla
                             }).ToList();
                }
                else if (opcion == 26)
                {
                    //string[] parametros = filtro.Split('|');
                    //int id_facturaCab = Convert.ToInt32(parametros[0].ToString());

                    //resul = (from c in db.Tbl_Fac_Facturas_Det
                    //         join p in db.tbl_Alm_Producto on c.id_Producto equals p.id_Producto
                    //         join u in db.tbl_Alm_UnidadMedida on c.id_UnidadMedida_Venta equals u.id_unidadMedida
                    //         join m in db.tbl_Alm_ProductoMarca on p.id_marcaProducto equals m.id_marcaProducto
                    //         where c.id_Factura_Cab == id_facturaCab
                    //         select new
                    //         {
                    //             c.id_Factura_Det,
                    //             c.id_Factura_Cab,
                    //             c.item_Factura_Det,
                    //             c.id_Producto,
                    //             p.codigo1_Producto,
                    //             p.nombre_Producto,
                    //             u.nombre_UnidadMedida,
                    //             nroLote = c.nroLote,
                    //             c.precioVenta_Factura_Det,
                    //             c.porcentajeDescuentoFactura_Det,
                    //             c.Descuento_Factura_Det,
                    //             c.cantidad_Factura_Det,
                    //             c.porcentajeIGV_Factura_Det,
                    //             c.total_Factura_Det,
                    //             m.nombre_marcaproducto,
                    //             stock = 0
                    //         }).ToList();



                    string[] parametros = filtro.Split('|');
                    int id_facturaCab = Convert.ToInt32(parametros[0].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.get_detalle_boletasFacturas(id_facturaCab);

                }
                else if (opcion == 27)
                {

                    string[] parametros = filtro.Split('|');
                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    string fecha_ini = parametros[2].ToString();
                    string fecha_fin = parametros[3].ToString();
                    int id_vendedor = Convert.ToInt32(parametros[4].ToString());
                    //int id_estado = Convert.ToInt32(parametros[5].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Listando_Pedidos_Aprobacion(id_local, id_almacen, fecha_ini, fecha_fin, id_vendedor);
                }
                else if (opcion == 28)
                {
                    string[] parametros = filtro.Split('|');

                    string numeroDoc = parametros[0].ToString();
                    int TipoDoc = Convert.ToInt32(parametros[1].ToString());
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());
                    int estado = Convert.ToInt32(parametros[3].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Set_Aprobar_Pedido(numeroDoc, TipoDoc, id_usuario, estado);

                }
                else if (opcion == 29)
                {
                    resul = (from c in db.Tbl_GrupoTabla_Det
                             where c.id_grupoTabla == 8
                             select new
                             {
                                 c.codigo_detalleTabla,
                                 c.descripcion_grupoTabla
                             }).ToList();
                }
                else if (opcion == 30)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Pedido_Cab = Convert.ToInt32(parametros[0].ToString());
                    string flag_exonerada_igv = parametros[1].ToString();


                    Tbl_Fac_Pedidos_Cab Ent_pedidoR;
                    Ent_pedidoR = db.Tbl_Fac_Pedidos_Cab.Where(g => g.id_Pedido_Cab == id_Pedido_Cab).FirstOrDefault<Tbl_Fac_Pedidos_Cab>();
                    Ent_pedidoR.flag_exonerada_igv = flag_exonerada_igv;

                    db.Entry(Ent_pedidoR).State = EntityState.Modified;
                    try
                    {
                        db.SaveChanges();
                        Pedidos_BL obj_negocio = new Pedidos_BL();
 
                        resul = obj_negocio.Set_CalculosTotales_Pedidos(id_Pedido_Cab);
                    }
                    catch (DbUpdateConcurrencyException e)
                    {
                        resul = e.Message;
                    }
                }
                else if (opcion == 31)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Pedido_Cab = Convert.ToInt32(parametros[0].ToString());
                    string flag_tipoFact = parametros[1].ToString();

                    Tbl_Fac_Pedidos_Cab Ent_pedidoR;
                    Ent_pedidoR = db.Tbl_Fac_Pedidos_Cab.Where(g => g.id_Pedido_Cab == id_Pedido_Cab).FirstOrDefault<Tbl_Fac_Pedidos_Cab>();
                    Ent_pedidoR.flag_tipo_facturacion = flag_tipoFact;

                    db.Entry(Ent_pedidoR).State = EntityState.Modified;
                    try
                    {
                        db.SaveChanges();
                        Pedidos_BL obj_negocio = new Pedidos_BL();
                        resul = obj_negocio.Set_CalculosTotales_Pedidos(id_Pedido_Cab);
                    }
                    catch (DbUpdateConcurrencyException e)
                    {
                        resul = e.Message;
                    }
                }
                else if (opcion == 32) // reenvio de documentos Boletas Facturas
                {
                    try
                    {
                        string[] parametros = filtro.Split('|');

                        int idTipoDoc = Convert.ToInt32(parametros[0].ToString());
                        string nroDocumento = parametros[1].ToString();

                        Pedidos_BL obj_negocio = new Pedidos_BL();

                        //-- obteniendo los datos de la factura ---------
                        Tbl_Fac_Facturas_Cab objFactura = db.Tbl_Fac_Facturas_Cab.Where(f => f.id_TipoDocumento == idTipoDoc && f.Numero_Documento == nroDocumento).SingleOrDefault();

                        if (string.IsNullOrEmpty(objFactura.id_Factura_Cab.ToString()) == false) /// si, si existe el documento ----
                        {
                            int idFactura = Convert.ToInt32(objFactura.id_Factura_Cab);
                            int tipo_facturacion = Convert.ToInt32(objFactura.flag_tipo_facturacion);

                            ///------el token esta por Anexos ----
                            if (string.IsNullOrEmpty(objFactura.id_Anexo.ToString()) == false)
                            {
                                int id_Anexo = Convert.ToInt32(objFactura.id_Anexo);
                                obj_negocio.GenerarComprobanteElectronico_nubeFact(idFactura, idTipoDoc, nroDocumento, tipo_facturacion, id_Anexo);

                                res.ok = true;
                                res.data = "OK";
                            }
                            else {
                                res.ok = false;
                                res.data = "El documento no tiene el ID ANEXO no se puede enviar a la Sunat";
                            }   
                        }
                        else
                        {
                            res.ok = false;
                            res.data = "No se encuentra el documento en la tabla Tbl_Fac_Facturas_Cab para Generar y enviar el Comprobante";
                        }
                    }
                    catch (Exception ex)
                    {
                        res.ok = false;
                        res.data = ex.Message;
                    
                    }

                    resul = res;
                }
                else if (opcion == 33) // reenvio de documentos Notas credito y debito
                {
                    string[] parametros = filtro.Split('|');
                    bool resSunat = true;

                    int idTipoDoc = Convert.ToInt32(parametros[0].ToString());
                    string nroDocumento = parametros[1].ToString();
                    int id_Factura_Cab_Ref = Convert.ToInt32(parametros[2].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();

                    // ---- DATOS DE LA FACTURA ------------------
                    Tbl_Fac_Facturas_Cab objFactura = db.Tbl_Fac_Facturas_Cab.Where(f => f.id_Factura_Cab == id_Factura_Cab_Ref ).SingleOrDefault();

                    if (objFactura != null )
                    {
                        int idFactura = Convert.ToInt32(objFactura.id_Factura_Cab.ToString());  
                        int id_Anexo = Convert.ToInt32(objFactura.id_Anexo);
                        int id_TipoDocumento = Convert.ToInt32(objFactura.id_TipoDocumento);
                        string serie_doc = objFactura.nro_Serie;
                        string numero_doc =  objFactura.numero;

                        if (objFactura.flag_DocManual != 1)
                        {
                            resSunat = obj_negocio.consultandoEstadoDocumentoSunat(idFactura, id_Anexo, id_TipoDocumento, serie_doc, numero_doc);
                        }
                 
                       //--obteniendo los datos de la nota de credito -------- -
                       Tbl_Fac_Facturas_Cab objNotasCredito = db.Tbl_Fac_Facturas_Cab.Where(f => f.id_Factura_Cab_Referencia == id_Factura_Cab_Ref && f.Numero_Documento == nroDocumento).SingleOrDefault();

                        if (resSunat == true)
                        {
                            if (objNotasCredito != null) /// si, si existe el documento ----
                            {
                                int idNotaCredito = Convert.ToInt32(objNotasCredito.id_Factura_Cab.ToString());
                                int id_tipoOperacion = Convert.ToInt32(objNotasCredito.id_tipo_nc_nd);

                                if (string.IsNullOrEmpty(objNotasCredito.id_Anexo.ToString()) == false)
                                {
                                    id_Anexo = Convert.ToInt32(objNotasCredito.id_Anexo);
                                    obj_negocio.GenerarComprobanteElectronico_NotaCredito_Debito_nubeFact(idNotaCredito, idTipoDoc, nroDocumento, id_tipoOperacion, id_Factura_Cab_Ref, id_Anexo);

                                    res.ok = true;
                                    res.data = "OK";
                                }
                                else
                                {
                                    res.ok = false;
                                    res.data = "El documento no tiene el ID ANEXO no se puede enviar a la Sunat";
                                }
                            }
                            else
                            {
                                res.ok = false;
                                res.data = "No se encuentra el documento en la tabla Tbl_Fac_Facturas_Cab para Generar y enviar el Comprobante";
                            }
                        }
                        else {

                            if (objNotasCredito != null) /// si, si existe el documento ----
                            {
                                int idNotaCredito = Convert.ToInt32(objNotasCredito.id_Factura_Cab.ToString());
                                obj_negocio.set_respuesta_sunatConsultas(idNotaCredito, 0, "La nota de credito, aun no puede ser enviada porque el documento origen no ha sido aceptada por la sunat ..");
                            }   
                            res.ok = false;
                            res.data = "Lo sentimos la Nota de Credito, todavia no se puede enviar a la sunat..";
                        }
                    }                
                    resul = res;
                }
                else if (opcion == 34) // reenvio de documentos Boletas Facturas masivas
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.get_GenerandoFacturacion_masiva(idUsuario);

                }
                else if (opcion == 35)
                {
                    string[] parametros = filtro.Split('|');
                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    string fecha_ini = parametros[2].ToString();
                    string fecha_fin = parametros[3].ToString();
                    string nroDoc = parametros[4].ToString();
                    int id_Anexos = Convert.ToInt32(parametros[5].ToString());
                    int id_transportista = Convert.ToInt32(parametros[6].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.ExportarExcel_resumenProductos(id_local, id_almacen, fecha_ini, fecha_fin, nroDoc, id_Anexos, id_transportista);
                }
                else if (opcion == 36)
                {
                    string[] parametros = filtro.Split('|');
                    int idPedido = Convert.ToInt32(parametros[0].ToString()); 

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Listando_Pedidos_ID(idPedido);
                }
                else if (opcion == 37)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Pedido_Cab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Set_anular_Pedido(id_Pedido_Cab, id_usuario);

                }
                else if (opcion == 38)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexos = Convert.ToInt32(parametros[0].ToString());
                    int id_TipoDocumento = Convert.ToInt32(parametros[1].ToString());
                    string Numero_Documento = parametros[2].ToString();

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.get_verificarNumeracionDocumentos(id_Anexos, id_TipoDocumento, Numero_Documento);
                }
                else if (opcion == 39)
                {
                    string[] parametros = filtro.Split('|');

                    int idPedido = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());
                    int tipo_facturacion = Convert.ToInt32(parametros[2].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Set_GenerandoFacturacion_Manual(idPedido, id_usuario, tipo_facturacion);

                }
                else if (opcion == 40)
                {
                    string[] parametros = filtro.Split('|');
                    string consulta_producto = parametros[0].ToString();
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    consulta_producto = (consulta_producto == null) ? "" : consulta_producto;


                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Search_Ayuda_Producto_normal(consulta_producto, id_usuario);
                }
                else if (opcion == 41)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Almacen = Convert.ToInt32(parametros[0].ToString());
                    string cod_producto = parametros[1].ToString();
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Search_Producto_manual(id_Almacen, cod_producto, id_usuario);
                }
                else if (opcion == 42)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Almacen = Convert.ToInt32(parametros[0].ToString());
                    string cod_producto = parametros[1].ToString();
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    string Consulta = "";
                    Consulta = cod_producto;
                    if (cod_producto == null)
                    {
                        Consulta = "";
                    }


                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Search_Ayuda_Producto(id_Almacen, Consulta, id_usuario);
                }
                else if (opcion == 43)
                {
                    string[] parametros = filtro.Split('|');
                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_almacen = Convert.ToInt32(parametros[1].ToString());
                    string fecha_ini = parametros[2].ToString();
                    string fecha_fin = parametros[3].ToString();
                    int id_vendedor = Convert.ToInt32(parametros[4].ToString());
                    int id_estado = Convert.ToInt32(parametros[5].ToString());
                    int id_Anexos = Convert.ToInt32(parametros[6].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Listando_Pedidos_manual(id_local, id_almacen, fecha_ini, fecha_fin, id_vendedor, id_estado, id_Anexos);
                }
                else if (opcion == 44)
                {
                    string[] parametros = filtro.Split('|');
                    int id_banco = Convert.ToInt32(parametros[0].ToString());
                    string nroOperacion = parametros[1].ToString();
                    string fechaOperacion = parametros[2].ToString();
                    
                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.get_verificarNroOperacion(id_banco, nroOperacion, fechaOperacion);
                }
                else if (opcion == 45)
                {
                    string[] parametros = filtro.Split('|');

                    string fechaIni = parametros[0].ToString();
                    string fechaFin = parametros[1].ToString();
                    int id_zona = Convert.ToInt32(parametros[2].ToString());
                    int id_transportista = Convert.ToInt32(parametros[3].ToString());
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Set_Generando_guiaRemisionConsolidado(fechaIni, fechaFin, id_zona, id_transportista, idUsuario);

                }
                else if (opcion == 46)
                {
                    string[] parametros = filtro.Split('|');
                    int id_usuario = Convert.ToInt32(parametros[0].ToString());
                    int id_material = Convert.ToInt32(parametros[1].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
           
                    res.ok = true;
                    res.data = obj_negocio.get_unidadMedidaFactor(id_usuario, id_material);

                    resul = res;

                }
                else if (opcion == 47)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Almacen = Convert.ToInt32(parametros[0].ToString());
                    string cod_producto = parametros[1].ToString();
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    string Consulta = "";
                    Consulta = cod_producto;
                    if (cod_producto == null)
                    {
                        Consulta = "";
                    }
                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Search_Ayuda_Producto_pasaje(id_Almacen, Consulta, id_usuario);
                }
                else if (opcion == 48)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Almacen = Convert.ToInt32(parametros[0].ToString());
                    string cod_producto = parametros[1].ToString();
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    resul = obj_negocio.Search_Producto_pasaje(id_Almacen, cod_producto, id_usuario);
                }
                else if (opcion == 999) { //// PRUEBAS CON EL API FACTUARACION

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    obj_negocio.GenerarComprobanteElectronico_nubeFact(17355, 1, "0001-0000039", 1,0);
                }
                else if (opcion == 1000)
                { //// PRUEBAS CON EL API FACTURACION GUIA REMISION 

                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    obj_negocio.GenerarComprobanteElectronico_GuiaRemision_nubeFact(17355, 1, "0001-0000039", 1);
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

        // PUT: api/TblFac_Pedidos_Cab/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTbl_Fac_Pedidos_Cab(int id, Tbl_Fac_Pedidos_Cab obj_entidad)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != obj_entidad.id_Pedido_Cab)
            {
                return BadRequest();
            }
            Tbl_Fac_Pedidos_Cab Ent_pedidoR;
            Ent_pedidoR = db.Tbl_Fac_Pedidos_Cab.Where(g => g.id_Pedido_Cab == id).FirstOrDefault<Tbl_Fac_Pedidos_Cab>();


            //Ent_pedidoR.Numero_Pedido = obj_entidad.Numero_Pedido;
            Ent_pedidoR.codigoInterno_Suministro = obj_entidad.codigoInterno_Suministro;

            tbl_Zonas_Venta tblzonas = db.tbl_Zonas_Venta.Find(obj_entidad.id_ZonaVta);

            if (string.IsNullOrEmpty(tblzonas.id_Local.ToString()) == false)
            {
                Ent_pedidoR.id_Local = tblzonas.id_Local;
            }
            else
            {
                Ent_pedidoR.id_Local = 0;
            }


            Ent_pedidoR.id_Almacen = obj_entidad.id_Almacen;
            Ent_pedidoR.id_TipoDocumento = obj_entidad.id_TipoDocumento;

            Ent_pedidoR.id_PuntoVenta = obj_entidad.id_PuntoVenta;
            Ent_pedidoR.id_CanalNegocio = obj_entidad.id_CanalNegocio;

            Ent_pedidoR.id_cuadrilla = obj_entidad.id_cuadrilla;
            Ent_pedidoR.id_PersonalVendedor = obj_entidad.id_PersonalVendedor;
            Ent_pedidoR.id_FormaPago = obj_entidad.id_FormaPago;
            Ent_pedidoR.id_moneda = obj_entidad.id_moneda;
            Ent_pedidoR.fechaEmision_Pedido_Cab = obj_entidad.fechaEmision_Pedido_Cab;

            Ent_pedidoR.tipoCambio_Pedido_Cab = obj_entidad.tipoCambio_Pedido_Cab;
            Ent_pedidoR.codigoInterno_Cliente = obj_entidad.codigoInterno_Cliente;
            Ent_pedidoR.direccion_Pedido_Cab = obj_entidad.direccion_Pedido_Cab;
            Ent_pedidoR.fechaEntrega_Pedido_Cab = obj_entidad.fechaEntrega_Pedido_Cab;

            Ent_pedidoR.porcentajeIGV_Pedido_Cab = obj_entidad.porcentajeIGV_Pedido_Cab;
            Ent_pedidoR.imprimeGuiaRemision_Pedido_Cab = obj_entidad.imprimeGuiaRemision_Pedido_Cab;
            Ent_pedidoR.observaciones_Pedido_Cab = obj_entidad.observaciones_Pedido_Cab;
            Ent_pedidoR.estado = obj_entidad.estado;

            //----no incluir entra en conflicto con el modulo de pedidos--
            //Ent_pedidoR.Sub_Total_Pedido_Cab = obj_entidad.Sub_Total_Pedido_Cab;
            //Ent_pedidoR.total_Igv_Pedido_Cab = obj_entidad.total_Igv_Pedido_Cab;
            //Ent_pedidoR.total_Neto_Pedido_Cab = obj_entidad.total_Neto_Pedido_Cab;
            Ent_pedidoR.Numero_Documento = obj_entidad.Numero_Documento;
            Ent_pedidoR.fechaFactura_Pedido_Cab = obj_entidad.fechaFactura_Pedido_Cab;
            Ent_pedidoR.flag_exonerada_igv = obj_entidad.flag_exonerada_igv;
            Ent_pedidoR.flag_tipo_facturacion = obj_entidad.flag_tipo_facturacion;

            Ent_pedidoR.id_Anexos = obj_entidad.id_Anexos;
            Ent_pedidoR.id_ZonaVta = obj_entidad.id_ZonaVta;
            Ent_pedidoR.id_PersonalTransportista = obj_entidad.id_PersonalTransportista;
            Ent_pedidoR.generaGuia = obj_entidad.generaGuia;

            Ent_pedidoR.usuario_edicion = obj_entidad.usuario_creacion;
            Ent_pedidoR.fecha_edicion = DateTime.Now;

            db.Entry(Ent_pedidoR).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return Ok("OK");
        }

        // POST: api/TblFac_Pedidos_Cab
        [ResponseType(typeof(Tbl_Fac_Pedidos_Cab))]
        public IHttpActionResult PostTbl_Fac_Pedidos_Cab(Tbl_Fac_Pedidos_Cab tbl_Fac_Pedidos_Cab)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ///----obteniendo la numeracion----
            ////int id_local =  Convert.ToInt32(tbl_Fac_Pedidos_Cab.id_Local);
            ////int id_tipoDoc = Convert.ToInt32(tbl_Fac_Pedidos_Cab.id_TipoDocumento);
            ////int id_tipoDoc_Ref = 0;

            ////Pedidos_BL obj_negocio = new Pedidos_BL();
            ////var resul = obj_negocio.Get_numeroCorrelativo(id_local, id_tipoDoc, id_tipoDoc_Ref);
            ///////----Fin de obteniendo la numeracion----

            ////tbl_Fac_Pedidos_Cab.Numero_Documento = resul[0].serie_correlativo + "-" + resul[0].numero_correlativo;
            ///

            tbl_Zonas_Venta tblzonas = db.tbl_Zonas_Venta.Find(tbl_Fac_Pedidos_Cab.id_ZonaVta);

            if (string.IsNullOrEmpty(tblzonas.id_Local.ToString()) == false)
            {
                tbl_Fac_Pedidos_Cab.id_Local = tblzonas.id_Local;
            }
            else {
                tbl_Fac_Pedidos_Cab.id_Local = 0;
            }


            tbl_Fac_Pedidos_Cab.imprime_pedido = "SI";
            tbl_Fac_Pedidos_Cab.fecha_creacion = DateTime.Now;
            db.Tbl_Fac_Pedidos_Cab.Add(tbl_Fac_Pedidos_Cab);
            db.SaveChanges();

             return CreatedAtRoute("DefaultApi", new { id = tbl_Fac_Pedidos_Cab.id_Pedido_Cab }, tbl_Fac_Pedidos_Cab);
        }


        [HttpPost]
        [Route("api/Pedidos/set_DetalleNotas")]
        public string set_DetalleNotas(List<Detalle_Factura_E> List_Detalle)
        {
            string resultado = "";
            try
            {
                Pedidos_BL obj_negocio = new Pedidos_BL();
                resultado = obj_negocio.Set_almacenandoDetalle_Notas(List_Detalle);
            }
            catch (Exception ex)
            {
                resultado = ex.Message;
            }
            return resultado;

        }

        [HttpPost]
        [Route("api/Pedidos/UploadImageVoucher")]
        public object UploadImageVoucher(int idPedidoCab, int idUsuario, int idFacturaCab, int idPago)
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
                    nombreFileServer = idUsuario + "_image_voucher_" + Guid.Parse(guidB) + extension;

                    //---almacenando la imagen--
                    path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagenes/" + nombreFileServer);
                    file.SaveAs(path);
                }

                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                    Pedidos_BL obj_negocio = new Pedidos_BL();
                    res.ok = true;
                    res.data = obj_negocio.Set_Actualizar_imagenComprobante(idPago, nombreFile, nombreFileServer);
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
        [Route("api/Pedidos/UploadImageVoucher_II")]
        public object UploadImageVoucher_II(int id_Factura_Cab, string cod_masivo, int id_usuario)
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
                    nombreFileServer = id_usuario + "_image_Masivo_voucher_" + Guid.Parse(guidB) + extension;

                    //---almacenando la imagen--
                    path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagenes/" + nombreFileServer);
                    file.SaveAs(path);
                }

                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                    ///----validando que en servidor solo halla una sola foto---
                    
                    Tbl_Com_Facturas_Cancelacion_Cab object_Pago = null;

                    object_Pago = db.Tbl_Com_Facturas_Cancelacion_Cab.Where(p => p.id_factura_cab == id_Factura_Cab && p.cod_masivo == cod_masivo ).FirstOrDefault<Tbl_Com_Facturas_Cancelacion_Cab>();
   
                    if (object_Pago != null)
                    {
                        string urlFotoAntes = object_Pago.url_foto_Pago;

                        Pedidos_BL obj_negocio = new Pedidos_BL();
                        res.ok = true;
                        res.data = obj_negocio.Set_Actualizar_imagenComprobante(object_Pago.id_cancelacion_cab  , nombreFile, nombreFileServer);

                        //---si previamente habia una foto, al reemplazarla borramos la anterior
                        if (urlFotoAntes != null)
                        {
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
                        res.data = "En la Tabla de Pagos no hay ese Documento..";
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


    }
}
