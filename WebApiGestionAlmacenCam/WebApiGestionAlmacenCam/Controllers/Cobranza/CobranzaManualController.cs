using Entidades;
using Entidades.Cobranzas;
using Entidades.Facturacion.Procesos;
using Negocio.Cobranza;
using Negocio.Conexion;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using static Negocio.Facturacion.Reporte.Registro_ventas_BL;

namespace WebApiGestionAlmacenCam.Controllers.Cobranza
{
    [EnableCors("*", "*", "*")]
    public class CobranzaManualController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetCobranzaManual(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Result res = new Result();

            CobranzaManual_BL obj_cobranza = new CobranzaManual_BL();

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexo = Convert.ToInt32(parametros[0].ToString());
                    int id_ZonaVenta = Convert.ToInt32(parametros[1].ToString());
                    int id_Vendedor = Convert.ToInt32(parametros[2].ToString());

                    string fechaIni = parametros[3].ToString();
                    string fechaFin = parametros[4].ToString();

                    resul = obj_cobranza.get_cobranza(id_Anexo, id_ZonaVenta, id_Vendedor, fechaIni, fechaFin);
                    
                }
                else if(opcion == 2)
                {
                    string[] parametros = filtro.Split('|');

                    int id_Anexo = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = (from c in db.tbl_Alm_Almacen
                                where c.estado == 1 && c.id_Anexos == id_Anexo
                                select new
                                {
                                    id = c.id_Almacen,
                                    descripcion = c.descripcion_Almacen
                                }).ToList();

                    resul = res;
                }
                else if (opcion == 3)
                {

                    res.ok = true;
                    res.data = (from c in db.Tbl_TipoDocumentos
                                where c.estado == 1
                                select new
                                {
                                    id = c.id_TipoDocumento,
                                    descripcion = c.TipoDocumento
                                }).ToList();

                    resul = res;
                }
                else if (opcion == 4)
                {

                    res.ok = true;
                    res.data = (from c in db.Tbl_Fac_PuntosVenta
                                where c.estado == 1
                                select new
                                {
                                    id = c.id_PuntoVenta,
                                    descripcion = c.descripcion_PuntoVenta
                                }).ToList();

                    resul = res;
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
        // POST: api/Tbl_Fac_Facturas_Cab
        [HttpPost]
        [Route("api/CobranzaManual/agregar")]
        [ResponseType(typeof(Tbl_Fac_Facturas_Cab))]
        public object Post_CobranzaAgregar(Tbl_Fac_Facturas_Cab obj)
        {
            Resultado res = new Resultado();
            SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx());
            SqlCommand cmd = new SqlCommand();

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "SP_U_FACTURACION_MANUAL_AGREGAR";
            cmd.Parameters.Add("@id_empresa", SqlDbType.Int).Value = obj.id_empresa;
            cmd.Parameters.Add("@numero_documento", SqlDbType.VarChar).Value = obj.Numero_Documento;
            cmd.Parameters.Add("@id_tipodocumento", SqlDbType.Int).Value = obj.id_TipoDocumento;
            cmd.Parameters.Add("@id_puntoventa", SqlDbType.Int).Value = obj.id_PuntoVenta;
            cmd.Parameters.Add("@id_formapago", SqlDbType.Int).Value = obj.id_FormaPago;
            cmd.Parameters.Add("@diasvencimiento_factura_cab", SqlDbType.Int).Value = obj.diasVencimiento_Factura_Cab;
            cmd.Parameters.Add("@id_moneda", SqlDbType.VarChar).Value = obj.id_moneda;
            cmd.Parameters.Add("@tipocambio_factura_cab", SqlDbType.Decimal).Value = obj.tipoCambio_Factura_Cab;
            cmd.Parameters.Add("@id_cuadrilla", SqlDbType.Int).Value = obj.id_cuadrilla;
            cmd.Parameters.Add("@id_personalvendedor", SqlDbType.Int).Value = obj.id_PersonalVendedor;
            cmd.Parameters.Add("@fechaemision_factura_cab", SqlDbType.VarChar).Value = obj.fechaEmision_Factura_Cab;
            cmd.Parameters.Add("@id_cliente", SqlDbType.Int).Value = obj.id_cliente;
            cmd.Parameters.Add("@direccion_factura_cab", SqlDbType.VarChar).Value = obj.direccion_Factura_Cab;
            cmd.Parameters.Add("@fechaentrega_factura_cab", SqlDbType.VarChar).Value = obj.fechaEntrega_Factura_Cab;
            cmd.Parameters.Add("@porcentajeigv_factura_cab", SqlDbType.Decimal).Value = obj.porcentajeIGV_Factura_Cab;
            cmd.Parameters.Add("@imprimeguiaremision_factura_cab", SqlDbType.VarChar).Value = obj.imprimeGuiaRemision_Factura_Cab;
            cmd.Parameters.Add("@observaciones_factura_cab", SqlDbType.VarChar).Value = obj.observaciones_Factura_Cab;
            cmd.Parameters.Add("@sub_total_factura_cab", SqlDbType.Decimal).Value = obj.Sub_Total_Factura_Cab;
            cmd.Parameters.Add("@total_igv_factura_cab", SqlDbType.Decimal).Value = obj.total_Igv_Factura_Cab;
            cmd.Parameters.Add("@total_neto_factura_cab", SqlDbType.Decimal).Value = obj.total_Neto_Factura_Cab;
            cmd.Parameters.Add("@id_pedido_cab", SqlDbType.Int).Value = obj.id_Pedido_Cab;
            cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = obj.id_Almacen;
            cmd.Parameters.Add("@id_guia_cab", SqlDbType.Int).Value = obj.id_Guia_Cab;
            cmd.Parameters.Add("@numero_guia_cab", SqlDbType.VarChar).Value = obj.numero_Guia_Cab;
            cmd.Parameters.Add("@total_pagos_factura_cab", SqlDbType.Decimal).Value = obj.total_pagos_Factura_Cab;
            cmd.Parameters.Add("@total_notacredito_factura_cab", SqlDbType.Decimal).Value = obj.total_NotaCredito_Factura_Cab;
            cmd.Parameters.Add("@fechacancelacion_factura_cab", SqlDbType.VarChar).Value = obj.fechaCancelacion_Factura_Cab;
            cmd.Parameters.Add("@fechaultimopago_factura_cab", SqlDbType.VarChar).Value = obj.fechaUltimoPago_Factura_Cab;
            cmd.Parameters.Add("@id_motivoanulacion", SqlDbType.Int).Value = obj.id_MotivoAnulacion;
            cmd.Parameters.Add("@estado", SqlDbType.Int).Value = obj.estado;
            cmd.Parameters.Add("@usuario_creacion", SqlDbType.Int).Value = obj.usuario_creacion;

            cmd.Parameters.Add("@codigointerno_cliente", SqlDbType.VarChar).Value = obj.codigoInterno_Cliente;
            cmd.Parameters.Add("@flag_impresion_factura_cab", SqlDbType.VarChar).Value = obj.Flag_Impresion_Factura_Cab;
            cmd.Parameters.Add("@codigointerno_suministro", SqlDbType.VarChar).Value = obj.codigoInterno_Suministro;
            cmd.Parameters.Add("@factura_electronica_cdr", SqlDbType.VarChar).Value = obj.factura_electronica_cdr;
            cmd.Parameters.Add("@factura_electronica_xml", SqlDbType.VarChar).Value = obj.factura_electronica_xml;
            cmd.Parameters.Add("@factura_electronica_pdf", SqlDbType.VarChar).Value = obj.factura_electronica_pdf;
            cmd.Parameters.Add("@factura_electronica_qr", SqlDbType.VarChar).Value = obj.factura_electronica_QR;

            cmd.Parameters.Add("@id_tipo_nc_nd", SqlDbType.Int).Value = obj.id_tipo_nc_nd;
            cmd.Parameters.Add("@id_factura_cab_referencia", SqlDbType.Int).Value = obj.id_Factura_Cab_Referencia;
            cmd.Parameters.Add("@afectostock", SqlDbType.VarChar).Value = obj.afectoStock;
            cmd.Parameters.Add("@factura_electronica_alertas", SqlDbType.VarChar).Value = obj.factura_electronica_alertas;
            cmd.Parameters.Add("@flag_exonerada_igv", SqlDbType.VarChar).Value = obj.flag_exonerada_igv;
            cmd.Parameters.Add("@flag_tipo_facturacion", SqlDbType.VarChar).Value = obj.flag_tipo_facturacion;
            cmd.Parameters.Add("@nro_serie", SqlDbType.VarChar).Value = obj.nro_Serie;
            cmd.Parameters.Add("@numero", SqlDbType.VarChar).Value = obj.numero;
            cmd.Parameters.Add("@id_anexo", SqlDbType.Int).Value = obj.id_Anexo;
            cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = obj.id_Transportista;
            cmd.Parameters.Add("@id_zonavta", SqlDbType.Int).Value = obj.id_ZonaVta;
            cmd.Parameters.Add("@flag_docmanual", SqlDbType.VarChar).Value = obj.flag_DocManual;
            cmd.Parameters.Add("@cliente_tipo_sunat", SqlDbType.Decimal).Value = obj.cliente_tipo_Sunat;
            cmd.Parameters.Add("@total_gravada_cab", SqlDbType.Decimal).Value = obj.total_Gravada_Cab;
            cmd.Parameters.Add("@total_exonerada_cab", SqlDbType.Decimal).Value = obj.total_Exonerada_Cab;
            cmd.Parameters.Add("@total_inafecta_cab", SqlDbType.Decimal).Value = obj.total_Inafecta_Cab;
            cmd.Parameters.Add("@total_gratuita_cab", SqlDbType.Decimal).Value = obj.total_Gratuita_Cab;
            cmd.Parameters.Add("@desdocu_asunat", SqlDbType.VarChar).Value = obj.DesDocu_Asunat;
            cmd.Parameters.Add("@generaguia", SqlDbType.Int).Value = obj.generaGuia;
            cmd.Parameters.Add("@id", SqlDbType.Int).Direction = ParameterDirection.Output;
            cmd.Connection = cn;
            try
            {
                cn.Open();
                cmd.ExecuteNonQuery();
                string id = cmd.Parameters["@id"].Value.ToString();

                res.ok = true;
                res.data = id;

            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            finally
            {
                cn.Close();
                cn.Dispose();
            }
            return res;
        }
        // POST: api/Tbl_Fac_Facturas_Cab
        [HttpPost]
        [Route("api/CobranzaManual/actualizar")]
        [ResponseType(typeof(Tbl_Fac_Facturas_Cab))]
        public object Post_CobranzaActualizar(Tbl_Fac_Facturas_Cab obj)
        {
            Resultado res = new Resultado();
            SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx());
            SqlCommand cmd = new SqlCommand();

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "SP_U_FACTURACION_MANUAL_ACTUALIZAR";
            cmd.Parameters.Add("@id_factura_cab", SqlDbType.Int).Value = obj.id_Factura_Cab;

            cmd.Parameters.Add("@id_empresa", SqlDbType.Int).Value = obj.id_empresa;
            cmd.Parameters.Add("@numero_documento", SqlDbType.VarChar).Value = obj.Numero_Documento;
            cmd.Parameters.Add("@id_tipodocumento", SqlDbType.Int).Value = obj.id_TipoDocumento;
            cmd.Parameters.Add("@id_puntoventa", SqlDbType.Int).Value = obj.id_PuntoVenta;
            cmd.Parameters.Add("@id_formapago", SqlDbType.Int).Value = obj.id_FormaPago;
            cmd.Parameters.Add("@diasvencimiento_factura_cab", SqlDbType.Int).Value = obj.diasVencimiento_Factura_Cab;
            cmd.Parameters.Add("@id_moneda", SqlDbType.VarChar).Value = obj.id_moneda;
            cmd.Parameters.Add("@tipocambio_factura_cab", SqlDbType.Decimal).Value = obj.tipoCambio_Factura_Cab;
            cmd.Parameters.Add("@id_cuadrilla", SqlDbType.Int).Value = obj.id_cuadrilla;
            cmd.Parameters.Add("@id_personalvendedor", SqlDbType.Int).Value = obj.id_PersonalVendedor;
            cmd.Parameters.Add("@fechaemision_factura_cab", SqlDbType.VarChar).Value = obj.fechaEmision_Factura_Cab;
            cmd.Parameters.Add("@id_cliente", SqlDbType.Int).Value = obj.id_cliente;
            cmd.Parameters.Add("@direccion_factura_cab", SqlDbType.VarChar).Value = obj.direccion_Factura_Cab;
            cmd.Parameters.Add("@fechaentrega_factura_cab", SqlDbType.VarChar).Value = obj.fechaEntrega_Factura_Cab;
            cmd.Parameters.Add("@porcentajeigv_factura_cab", SqlDbType.Decimal).Value = obj.porcentajeIGV_Factura_Cab;
            cmd.Parameters.Add("@imprimeguiaremision_factura_cab", SqlDbType.VarChar).Value = obj.imprimeGuiaRemision_Factura_Cab;
            cmd.Parameters.Add("@observaciones_factura_cab", SqlDbType.VarChar).Value = obj.observaciones_Factura_Cab;
            cmd.Parameters.Add("@sub_total_factura_cab", SqlDbType.Decimal).Value = obj.Sub_Total_Factura_Cab;
            cmd.Parameters.Add("@total_igv_factura_cab", SqlDbType.Decimal).Value = obj.total_Igv_Factura_Cab;
            cmd.Parameters.Add("@total_neto_factura_cab", SqlDbType.Decimal).Value = obj.total_Neto_Factura_Cab;
            cmd.Parameters.Add("@id_pedido_cab", SqlDbType.Int).Value = obj.id_Pedido_Cab;
            cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = obj.id_Almacen;
            cmd.Parameters.Add("@id_guia_cab", SqlDbType.Int).Value = obj.id_Guia_Cab;
            cmd.Parameters.Add("@numero_guia_cab", SqlDbType.VarChar).Value = obj.numero_Guia_Cab;
            cmd.Parameters.Add("@total_pagos_factura_cab", SqlDbType.Decimal).Value = obj.total_pagos_Factura_Cab;
            cmd.Parameters.Add("@total_notacredito_factura_cab", SqlDbType.Decimal).Value = obj.total_NotaCredito_Factura_Cab;
            cmd.Parameters.Add("@fechacancelacion_factura_cab", SqlDbType.VarChar).Value = obj.fechaCancelacion_Factura_Cab;
            cmd.Parameters.Add("@fechaultimopago_factura_cab", SqlDbType.VarChar).Value = obj.fechaUltimoPago_Factura_Cab;
            cmd.Parameters.Add("@id_motivoanulacion", SqlDbType.Int).Value = obj.id_MotivoAnulacion;
            cmd.Parameters.Add("@estado", SqlDbType.Int).Value = obj.estado;
            cmd.Parameters.Add("@usuario_edicion", SqlDbType.Int).Value = obj.usuario_edicion;

            cmd.Parameters.Add("@codigointerno_cliente", SqlDbType.VarChar).Value = obj.codigoInterno_Cliente;
            cmd.Parameters.Add("@flag_impresion_factura_cab", SqlDbType.VarChar).Value = obj.Flag_Impresion_Factura_Cab;
            cmd.Parameters.Add("@codigointerno_suministro", SqlDbType.VarChar).Value = obj.codigoInterno_Suministro;
            cmd.Parameters.Add("@factura_electronica_cdr", SqlDbType.VarChar).Value = obj.factura_electronica_cdr;
            cmd.Parameters.Add("@factura_electronica_xml", SqlDbType.VarChar).Value = obj.factura_electronica_xml;
            cmd.Parameters.Add("@factura_electronica_pdf", SqlDbType.VarChar).Value = obj.factura_electronica_pdf;
            cmd.Parameters.Add("@factura_electronica_qr", SqlDbType.VarChar).Value = obj.factura_electronica_QR;

            cmd.Parameters.Add("@id_tipo_nc_nd", SqlDbType.Int).Value = obj.id_tipo_nc_nd;
            cmd.Parameters.Add("@id_factura_cab_referencia", SqlDbType.Int).Value = obj.id_Factura_Cab_Referencia;
            cmd.Parameters.Add("@afectostock", SqlDbType.VarChar).Value = obj.afectoStock;
            cmd.Parameters.Add("@factura_electronica_alertas", SqlDbType.VarChar).Value = obj.factura_electronica_alertas;
            cmd.Parameters.Add("@flag_exonerada_igv", SqlDbType.VarChar).Value = obj.flag_exonerada_igv;
            cmd.Parameters.Add("@flag_tipo_facturacion", SqlDbType.VarChar).Value = obj.flag_tipo_facturacion;
            cmd.Parameters.Add("@nro_serie", SqlDbType.VarChar).Value = obj.nro_Serie;
            cmd.Parameters.Add("@numero", SqlDbType.VarChar).Value = obj.numero;
            cmd.Parameters.Add("@id_anexo", SqlDbType.Int).Value = obj.id_Anexo;
            cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = obj.id_Transportista;
            cmd.Parameters.Add("@id_zonavta", SqlDbType.Int).Value = obj.id_ZonaVta;
            cmd.Parameters.Add("@flag_docmanual", SqlDbType.VarChar).Value = obj.flag_DocManual;
            cmd.Parameters.Add("@cliente_tipo_sunat", SqlDbType.Decimal).Value = obj.cliente_tipo_Sunat;
            cmd.Parameters.Add("@total_gravada_cab", SqlDbType.Decimal).Value = obj.total_Gravada_Cab;
            cmd.Parameters.Add("@total_exonerada_cab", SqlDbType.Decimal).Value = obj.total_Exonerada_Cab;
            cmd.Parameters.Add("@total_inafecta_cab", SqlDbType.Decimal).Value = obj.total_Inafecta_Cab;
            cmd.Parameters.Add("@total_gratuita_cab", SqlDbType.Decimal).Value = obj.total_Gratuita_Cab;
            cmd.Parameters.Add("@desdocu_asunat", SqlDbType.VarChar).Value = obj.DesDocu_Asunat;
            cmd.Parameters.Add("@generaguia", SqlDbType.Int).Value = obj.generaGuia;
            cmd.Connection = cn;
            try
            {
                cn.Open();
                cmd.ExecuteNonQuery();

                res.ok = true;
                res.data = "OK";

            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            finally
            {
                cn.Close();
                cn.Dispose();
            }
            return res;
        }


        //[HttpPost]
        //[Route("api/CobranzaManual/agregar")]
        //[ResponseType(typeof(tbl_Anexos))]
        //public IHttpActionResult PostTbl_Fac_Facturas_Cab(Tbl_Fac_Facturas_Cab data)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }
        //    data.fecha_creacion = DateTime.Now;
        //    db.Tbl_Fac_Facturas_Cab.Add(data);
        //    db.SaveChanges();

        //    return CreatedAtRoute("DefaultApi", new { id = data.id_Factura_Cab }, data);
        //}

        [HttpPost]
        [Route("api/documentoFactura/anular")]
        public object Puttbl_Usuarios(anularDocumento obj)
        {
            Resultado res = new Resultado();
            SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx());
            SqlCommand cmd = new SqlCommand();

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "SP_U_FACTURACION_ANULAR";
            cmd.Parameters.Add("@idZonaVenta", SqlDbType.Int).Value = obj.id_zonaVenta;
            cmd.Parameters.Add("@idAlmacen", SqlDbType.Int).Value = obj.id_almacen;
            cmd.Parameters.Add("@idAnexo", SqlDbType.Int).Value = obj.id_anexo;
            cmd.Parameters.Add("@tipoDoc", SqlDbType.Int).Value = obj.id_tipoDoc;
            cmd.Parameters.Add("@serie", SqlDbType.VarChar).Value = obj.serie;
            cmd.Parameters.Add("@numero", SqlDbType.VarChar).Value = obj.numero;
            cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = obj.id_usuario;
            cmd.Connection = cn;
            try
            {
                cn.Open();
                cmd.ExecuteNonQuery();

                res.ok = true;
                res.data = "OK";

            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            finally
            {
                cn.Close();
                cn.Dispose();
            }
            return res;
        }

        //// PUT: api/Tbl_Fac_Facturas_Cab/5
        //[ResponseType(typeof(void))]
        //public IHttpActionResult PutTbl_Fac_Facturas_Cab(int id, Tbl_Fac_Facturas_Cab data)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != data.id_Factura_Cab)
        //    {
        //        return BadRequest();
        //    }
        //    Tbl_Fac_Facturas_Cab Ent_pedidoR;
        //    Ent_pedidoR = db.Tbl_Fac_Facturas_Cab.Where(g => g.id_Factura_Cab == id).FirstOrDefault<Tbl_Fac_Facturas_Cab>();


        //    //Ent_pedidoR.Numero_Pedido = obj_entidad.Numero_Pedido;
        //    Ent_pedidoR.codigoInterno_Suministro = data.codigoInterno_Suministro;

        //    Ent_pedidoR.id_Almacen = data.id_Almacen;
        //    Ent_pedidoR.id_TipoDocumento = data.id_TipoDocumento;

        //    Ent_pedidoR.id_PuntoVenta = data.id_PuntoVenta;

        //    Ent_pedidoR.id_cuadrilla = data.id_cuadrilla;
        //    Ent_pedidoR.id_PersonalVendedor = data.id_PersonalVendedor;
        //    Ent_pedidoR.id_FormaPago = data.id_FormaPago;
        //    Ent_pedidoR.id_moneda = data.id_moneda;
        //    Ent_pedidoR.fechaEmision_Factura_Cab = data.fechaEmision_Factura_Cab;

        //    Ent_pedidoR.tipoCambio_Factura_Cab = data.tipoCambio_Factura_Cab;
        //    Ent_pedidoR.codigoInterno_Cliente = data.codigoInterno_Cliente;
        //    Ent_pedidoR.direccion_Factura_Cab = data.direccion_Factura_Cab;
        //    Ent_pedidoR.fechaEntrega_Factura_Cab = data.fechaEntrega_Factura_Cab;

        //    Ent_pedidoR.porcentajeIGV_Factura_Cab = data.porcentajeIGV_Factura_Cab;
        //    Ent_pedidoR.imprimeGuiaRemision_Factura_Cab = data.imprimeGuiaRemision_Factura_Cab;
        //    Ent_pedidoR.observaciones_Factura_Cab = data.observaciones_Factura_Cab;
        //    Ent_pedidoR.estado = data.estado;

        //    //----no incluir entra en conflicto con el modulo de pedidos--
        //    //Ent_pedidoR.Sub_Total_Pedido_Cab = obj_entidad.Sub_Total_Pedido_Cab;
        //    //Ent_pedidoR.total_Igv_Pedido_Cab = obj_entidad.total_Igv_Pedido_Cab;
        //    //Ent_pedidoR.total_Neto_Pedido_Cab = obj_entidad.total_Neto_Pedido_Cab;
        //    Ent_pedidoR.Numero_Documento = data.Numero_Documento;
        //    Ent_pedidoR.flag_exonerada_igv = data.flag_exonerada_igv;
        //    Ent_pedidoR.flag_tipo_facturacion = data.flag_tipo_facturacion;

        //    Ent_pedidoR.id_Anexo = data.id_Anexo;
        //    Ent_pedidoR.id_ZonaVta = data.id_ZonaVta;
        //    Ent_pedidoR.id_Transportista = data.id_Transportista;

        //    Ent_pedidoR.usuario_edicion = data.usuario_creacion;
        //    Ent_pedidoR.fecha_edicion = DateTime.Now;

        //    db.Entry(Ent_pedidoR).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        return NotFound();
        //    }

        //    return Ok("OK");
        //}

        //// DELETE: api/Tbl_Fac_Facturas_Cab/5
        [ResponseType(typeof(Tbl_Fac_Facturas_Cab))]
        public async Task<IHttpActionResult> DeleteTbl_Fac_Facturas_Cab(int id)
        {
            Tbl_Fac_Facturas_Cab obj = await db.Tbl_Fac_Facturas_Cab.FindAsync(id);

            obj = db.Tbl_Fac_Facturas_Cab.Where(g => g.id_Factura_Cab == id).FirstOrDefault<Tbl_Fac_Facturas_Cab>();
            obj.estado = 0;
            db.Entry(obj).State = EntityState.Modified;
            await db.SaveChangesAsync();
            return Ok("OK");
        }

    }
}