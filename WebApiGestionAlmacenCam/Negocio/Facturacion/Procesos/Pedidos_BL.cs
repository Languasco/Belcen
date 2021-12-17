using Entidades;
using Entidades.Facturacion.Procesos;
using Negocio.Conexion;
using Negocio.NubeFact;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
/// USAR LO SIGUIENTE 
 
using Newtonsoft.Json;
using System.IO;
using Negocio.Resultado;

using ThoughtWorks.QRCode.Codec;

using Excel = OfficeOpenXml;
using Style = OfficeOpenXml.Style;
using System.Drawing;
using System.Configuration;

namespace Negocio.Facturacion.Procesos
{
    public class Pedidos_BL
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();
        
        SqlCommand cmd = null;

        public List<Pedidos_E> Listando_Pedidos(int id_local, int id_almacen, string fecha_ini, string fecha_fin, int  id_vendedor, int id_estado, int id_Anexos)
        {
            try
            {
                List<Pedidos_E> obj_List = new List<Pedidos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_PEDIDOS_LISTADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fecha_fin;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;
                        cmd.Parameters.Add("@id_estado", SqlDbType.Int).Value = id_estado;
                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_E Entidad = new Pedidos_E();
                                
                                 Entidad.id_Pedido_Cab = Convert.ToInt32(row["id_Pedido_Cab"].ToString());

                                Entidad.id_empresa = Convert.ToInt32(row["id_empresa"].ToString());
                                Entidad.id_Local = Convert.ToInt32(row["id_Local"].ToString());
                                Entidad.Numero_Pedido = row["Numero_Pedido"].ToString();
                                Entidad.id_cliente = Convert.ToInt32(row["id_cliente"].ToString());
                                Entidad.codigoInterno_Suministro = row["codigoInterno_Suministro"].ToString();

                                Entidad.nroDoc_Cliente = row["nroDoc_Cliente"].ToString();
                                Entidad.nombres_Cliente = row["nombres_Cliente"].ToString();

                                Entidad.id_Almacen = Convert.ToInt32(row["id_Almacen"].ToString());
                                Entidad.descripcion_Almacen = row["descripcion_Almacen"].ToString();
                                Entidad.id_TipoDocumento = Convert.ToInt32(row["id_TipoDocumento"].ToString());
                                Entidad.Descripcion_TipoDocumento = row["Descripcion_TipoDocumento"].ToString();

                                Entidad.id_PuntoVenta = Convert.ToInt32(row["id_PuntoVenta"].ToString());
                                Entidad.descripcion_PuntoVenta = row["descripcion_PuntoVenta"].ToString();
                                Entidad.id_cuadrilla = row["id_cuadrilla"].ToString();
                                Entidad.id_PersonalVendedor = Convert.ToInt32(row["id_PersonalVendedor"].ToString());
                                Entidad.personal = row["personal"].ToString();

                                Entidad.id_FormaPago = Convert.ToInt32(row["id_FormaPago"].ToString());
                                Entidad.condicionFacturacion = row["condicionFacturacion"].ToString();
                                Entidad.id_moneda = row["id_moneda"].ToString();
                                Entidad.fechaEmision_Pedido_Cab = row["fechaEmision_Pedido_Cab"].ToString();

                                Entidad.tipoCambio_Pedido_Cab = row["tipoCambio_Pedido_Cab"].ToString();
                                Entidad.codigoInterno_Cliente = row["codigoInterno_Cliente"].ToString();
                                Entidad.cliente = row["cliente"].ToString();
                                Entidad.direccion_Pedido_Cab = row["direccion_Pedido_Cab"].ToString(); 

                                Entidad.fechaEntrega_Pedido_Cab = row["fechaEntrega_Pedido_Cab"].ToString();                       
                                Entidad.porcentajeIGV_Pedido_Cab = row["porcentajeIGV_Pedido_Cab"].ToString();   
                                Entidad.imprimeGuiaRemision_Pedido_Cab = row["imprimeGuiaRemision_Pedido_Cab"].ToString();   
                                Entidad.observaciones_Pedido_Cab = row["observaciones_Pedido_Cab"].ToString();
                                Entidad.estado = Convert.ToInt32(row["estado"].ToString());

                                Entidad.usuario_creacion = Convert.ToInt32(row["usuario_creacion"].ToString());
                                Entidad.Sub_Total_Pedido_Cab = Convert.ToDecimal(row["Sub_Total_Pedido_Cab"].ToString());
                                Entidad.total_Igv_Pedido_Cab = Convert.ToDecimal(row["total_Igv_Pedido_Cab"].ToString()); 
                                Entidad.total_Neto_Pedido_Cab = Convert.ToDecimal(row["total_Neto_Pedido_Cab"].ToString()); 

                                Entidad.Numero_Documento = row["Numero_Documento"].ToString();   
                                Entidad.fechaFactura_Pedido_Cab = row["fechaFactura_Pedido_Cab"].ToString();
                                Entidad.flag_cancelacion = row["flag_cancelacion"].ToString();
                                Entidad.TipoGuiaRemision = row["TipoGuiaRemision"].ToString();
                                Entidad.flag_exonerada_igv = row["flag_exonerada_igv"].ToString();
                                Entidad.flag_tipo_facturacion = row["flag_tipo_facturacion"].ToString();
                                Entidad.id_CanalNegocio = row["id_CanalNegocio"].ToString();
                                Entidad.id_Anexos = row["id_Anexos"].ToString();
                                Entidad.id_ZonaVta = row["id_ZonaVta"].ToString();
                                Entidad.id_PersonalTransportista = row["id_PersonalTransportista"].ToString();
                                Entidad.generaGuia = row["generaGuia"].ToString();

                                Entidad.fecha_creacion = row["fecha_creacion"].ToString();
                                Entidad.usuario_edicion = row["usuario_edicion"].ToString();
                                Entidad.fecha_edicion = row["fecha_edicion"].ToString();


                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public List<Pedidos_E> Listando_Pedidos_manual(int id_local, int id_almacen, string fecha_ini, string fecha_fin, int id_vendedor, int id_estado, int id_Anexos)
        {
            try
            {
                List<Pedidos_E> obj_List = new List<Pedidos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_PEDIDOS_LISTADO_MANUAL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fecha_fin;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;
                        cmd.Parameters.Add("@id_estado", SqlDbType.Int).Value = id_estado;
                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_E Entidad = new Pedidos_E();

                                Entidad.id_Pedido_Cab = Convert.ToInt32(row["id_Pedido_Cab"].ToString());

                                Entidad.id_empresa = Convert.ToInt32(row["id_empresa"].ToString());
                                Entidad.id_Local = Convert.ToInt32(row["id_Local"].ToString());
                                Entidad.Numero_Pedido = row["Numero_Pedido"].ToString();
                                Entidad.id_cliente = Convert.ToInt32(row["id_cliente"].ToString());
                                Entidad.codigoInterno_Suministro = row["codigoInterno_Suministro"].ToString();

                                Entidad.nroDoc_Cliente = row["nroDoc_Cliente"].ToString();
                                Entidad.nombres_Cliente = row["nombres_Cliente"].ToString();

                                Entidad.id_Almacen = Convert.ToInt32(row["id_Almacen"].ToString());
                                Entidad.descripcion_Almacen = row["descripcion_Almacen"].ToString();
                                Entidad.id_TipoDocumento = Convert.ToInt32(row["id_TipoDocumento"].ToString());
                                Entidad.Descripcion_TipoDocumento = row["Descripcion_TipoDocumento"].ToString();

                                Entidad.id_PuntoVenta = Convert.ToInt32(row["id_PuntoVenta"].ToString());
                                Entidad.descripcion_PuntoVenta = row["descripcion_PuntoVenta"].ToString();
                                Entidad.id_cuadrilla = row["id_cuadrilla"].ToString();
                                Entidad.id_PersonalVendedor = Convert.ToInt32(row["id_PersonalVendedor"].ToString());
                                Entidad.personal = row["personal"].ToString();

                                Entidad.id_FormaPago = Convert.ToInt32(row["id_FormaPago"].ToString());
                                Entidad.condicionFacturacion = row["condicionFacturacion"].ToString();
                                Entidad.id_moneda = row["id_moneda"].ToString();
                                Entidad.fechaEmision_Pedido_Cab = row["fechaEmision_Pedido_Cab"].ToString();

                                Entidad.tipoCambio_Pedido_Cab = row["tipoCambio_Pedido_Cab"].ToString();
                                Entidad.codigoInterno_Cliente = row["codigoInterno_Cliente"].ToString();
                                Entidad.cliente = row["cliente"].ToString();
                                Entidad.direccion_Pedido_Cab = row["direccion_Pedido_Cab"].ToString();

                                Entidad.fechaEntrega_Pedido_Cab = row["fechaEntrega_Pedido_Cab"].ToString();
                                Entidad.porcentajeIGV_Pedido_Cab = row["porcentajeIGV_Pedido_Cab"].ToString();
                                Entidad.imprimeGuiaRemision_Pedido_Cab = row["imprimeGuiaRemision_Pedido_Cab"].ToString();
                                Entidad.observaciones_Pedido_Cab = row["observaciones_Pedido_Cab"].ToString();
                                Entidad.estado = Convert.ToInt32(row["estado"].ToString());

                                Entidad.usuario_creacion = Convert.ToInt32(row["usuario_creacion"].ToString());
                                Entidad.Sub_Total_Pedido_Cab = Convert.ToDecimal(row["Sub_Total_Pedido_Cab"].ToString());
                                Entidad.total_Igv_Pedido_Cab = Convert.ToDecimal(row["total_Igv_Pedido_Cab"].ToString());
                                Entidad.total_Neto_Pedido_Cab = Convert.ToDecimal(row["total_Neto_Pedido_Cab"].ToString());

                                Entidad.Numero_Documento = row["Numero_Documento"].ToString();
                                Entidad.fechaFactura_Pedido_Cab = row["fechaFactura_Pedido_Cab"].ToString();
                                Entidad.flag_cancelacion = row["flag_cancelacion"].ToString();
                                Entidad.TipoGuiaRemision = row["TipoGuiaRemision"].ToString();
                                Entidad.flag_exonerada_igv = row["flag_exonerada_igv"].ToString();
                                Entidad.flag_tipo_facturacion = row["flag_tipo_facturacion"].ToString();
                                Entidad.id_CanalNegocio = row["id_CanalNegocio"].ToString();
                                Entidad.id_Anexos = row["id_Anexos"].ToString();
                                Entidad.id_ZonaVta = row["id_ZonaVta"].ToString();
                                Entidad.id_PersonalTransportista = row["id_PersonalTransportista"].ToString();
                                Entidad.generaGuia = row["generaGuia"].ToString();
                                Entidad.flag_DocManual = row["flag_DocManual"].ToString();

                                Entidad.fecha_creacion = row["fecha_creacion"].ToString();
                                Entidad.usuario_edicion = row["usuario_edicion"].ToString();
                                Entidad.fecha_edicion = row["fecha_edicion"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public List<Pedidos_E> Listando_Pedidos_Aprobacion(int id_local, int id_almacen, string fecha_ini, string fecha_fin, int id_vendedor)
        {
            try
            {
                List<Pedidos_E> obj_List = new List<Pedidos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_PEDIDOS_LISTADO_APROBACION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fecha_fin;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;                        

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_E Entidad = new Pedidos_E();

                                Entidad.id_Pedido_Cab = Convert.ToInt32(row["id_Pedido_Cab"].ToString());

                                Entidad.id_empresa = Convert.ToInt32(row["id_empresa"].ToString());
                                Entidad.id_Local = Convert.ToInt32(row["id_Local"].ToString());
                                Entidad.Numero_Pedido = row["Numero_Pedido"].ToString();
                                Entidad.codigoInterno_Suministro = row["codigoInterno_Suministro"].ToString();

                                Entidad.nroDoc_Cliente = row["nroDoc_Cliente"].ToString();
                                Entidad.nombres_Cliente = row["nombres_Cliente"].ToString();

                                Entidad.id_Almacen = Convert.ToInt32(row["id_Almacen"].ToString());
                                Entidad.descripcion_Almacen = row["descripcion_Almacen"].ToString();
                                Entidad.id_TipoDocumento = Convert.ToInt32(row["id_TipoDocumento"].ToString());
                                Entidad.Descripcion_TipoDocumento = row["Descripcion_TipoDocumento"].ToString();

                                Entidad.id_PuntoVenta = Convert.ToInt32(row["id_PuntoVenta"].ToString());
                                Entidad.descripcion_PuntoVenta = row["descripcion_PuntoVenta"].ToString();
                                Entidad.id_cuadrilla = row["id_cuadrilla"].ToString();
                                Entidad.id_PersonalVendedor = Convert.ToInt32(row["id_PersonalVendedor"].ToString());
                                Entidad.personal = row["personal"].ToString();

                                Entidad.id_FormaPago = Convert.ToInt32(row["id_FormaPago"].ToString());
                                Entidad.condicionFacturacion = row["condicionFacturacion"].ToString();
                                Entidad.id_moneda = row["id_moneda"].ToString();
                                Entidad.fechaEmision_Pedido_Cab = row["fechaEmision_Pedido_Cab"].ToString();

                                Entidad.tipoCambio_Pedido_Cab = row["tipoCambio_Pedido_Cab"].ToString();
                                Entidad.codigoInterno_Cliente = row["codigoInterno_Cliente"].ToString();
                                Entidad.cliente = row["cliente"].ToString();
                                Entidad.direccion_Pedido_Cab = row["direccion_Pedido_Cab"].ToString();

                                Entidad.fechaEntrega_Pedido_Cab = row["fechaEntrega_Pedido_Cab"].ToString();
                                Entidad.porcentajeIGV_Pedido_Cab = row["porcentajeIGV_Pedido_Cab"].ToString();
                                Entidad.imprimeGuiaRemision_Pedido_Cab = row["imprimeGuiaRemision_Pedido_Cab"].ToString();
                                Entidad.observaciones_Pedido_Cab = row["observaciones_Pedido_Cab"].ToString();
                                Entidad.estado = Convert.ToInt32(row["estado"].ToString());

                                Entidad.usuario_creacion = Convert.ToInt32(row["usuario_creacion"].ToString());
                                Entidad.Sub_Total_Pedido_Cab = Convert.ToDecimal(row["Sub_Total_Pedido_Cab"].ToString());
                                Entidad.total_Igv_Pedido_Cab = Convert.ToDecimal(row["total_Igv_Pedido_Cab"].ToString());
                                Entidad.total_Neto_Pedido_Cab = Convert.ToDecimal(row["total_Neto_Pedido_Cab"].ToString());

                                Entidad.Numero_Documento = row["Numero_Documento"].ToString();
                                Entidad.fechaFactura_Pedido_Cab = row["fechaFactura_Pedido_Cab"].ToString();
                                Entidad.flag_cancelacion = row["flag_cancelacion"].ToString();
                                Entidad.TipoGuiaRemision = row["TipoGuiaRemision"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        
        public List<Pedidos_E> Search_Producto(int id_Almacen, string cod_producto, int id_usuario)
        {
            try
            {
                List<Pedidos_E> obj_List = new List<Pedidos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_STOCK_SEARCH", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Almacen", SqlDbType.Int).Value = id_Almacen;
                        cmd.Parameters.Add("@Cod_producto", SqlDbType.VarChar).Value = cod_producto;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_E Entidad = new Pedidos_E();

                                Entidad.id_producto = Convert.ToInt32(row["id_producto"].ToString());
                                Entidad.descripcion_producto = row["descripcion_producto"].ToString();
                                Entidad.codigoInterno =  row["codigoInterno"].ToString();
                                Entidad.precioventa_listaprecios = Convert.ToDecimal(row["precioventa_listaprecios"].ToString());
                                Entidad.aplicaDescuento = Convert.ToDecimal(row["aplicaDescuento"].ToString());
                                Entidad.porceDescuento = Convert.ToDecimal(row["porceDescuento"].ToString());
                                Entidad.Stock = Convert.ToDecimal(row["Stock"].ToString());
                                Entidad.unidadMedida = row["unidadMedida"].ToString();
                                Entidad.nombre_marcaproducto = row["nombre_marcaproducto"].ToString();
                                Entidad.movLote = row["movLote"].ToString();
                                Entidad.nroLote = row["nroLote"].ToString();

                                Entidad.Id_Unidad = row["Id_Unidad"].ToString();
                                Entidad.factorVenta = row["factorVenta"].ToString();

                                Entidad.fechaProduccion = row["fechaProduccion"].ToString();
                                Entidad.fechaVencimiento = row["fechaVencimiento"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }
                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public List<Pedidos_E> Search_Producto_pasaje(int id_Almacen, string cod_producto, int id_usuario)
        {
            try
            {
                List<Pedidos_E> obj_List = new List<Pedidos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_STOCK_SEARCH_Pasaje", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Almacen", SqlDbType.Int).Value = id_Almacen;
                        cmd.Parameters.Add("@Cod_producto", SqlDbType.VarChar).Value = cod_producto;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_E Entidad = new Pedidos_E();

                                Entidad.id_producto = Convert.ToInt32(row["id_producto"].ToString());
                                Entidad.descripcion_producto = row["descripcion_producto"].ToString();
                                Entidad.codigoInterno = row["codigoInterno"].ToString();
                                Entidad.precioventa_listaprecios = Convert.ToDecimal(row["precioventa_listaprecios"].ToString());
                                Entidad.aplicaDescuento = Convert.ToDecimal(row["aplicaDescuento"].ToString());
                                Entidad.porceDescuento = Convert.ToDecimal(row["porceDescuento"].ToString());
                                Entidad.Stock = Convert.ToDecimal(row["Stock"].ToString());
                                Entidad.unidadMedida = row["unidadMedida"].ToString();
                                Entidad.nombre_marcaproducto = row["nombre_marcaproducto"].ToString();
                                Entidad.movLote = row["movLote"].ToString();
                                Entidad.nroLote = row["nroLote"].ToString();

                                Entidad.Id_Unidad = row["Id_Unidad"].ToString();
                                Entidad.factorVenta = row["factorVenta"].ToString();

                                Entidad.fechaProduccion = row["fechaProduccion"].ToString();
                                Entidad.fechaVencimiento = row["fechaVencimiento"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }
                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public List<Pedidos_E> Search_Ayuda_Producto( int id_Almacen, string cod_producto, int idUsuario)
        {
            try
            {
                List<Pedidos_E> obj_List = new List<Pedidos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_STOCK_SEARCH_HELP", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@id_Almacen", id_Almacen);
                        cmd.Parameters.AddWithValue("@cod_producto",  cod_producto);
                        cmd.Parameters.AddWithValue("@id_usuario", idUsuario);
                        cmd.ExecuteNonQuery();

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_E Entidad = new Pedidos_E();

                                Entidad.id_producto = Convert.ToInt32(row["id_producto"].ToString());
                                Entidad.descripcion_producto = row["descripcion_producto"].ToString();
                                Entidad.codigoInterno = row["codigoInterno"].ToString();
                                Entidad.precioventa_listaprecios = Convert.ToDecimal(row["precioventa_listaprecios"].ToString());
                                Entidad.aplicaDescuento = Convert.ToDecimal(row["aplicaDescuento"].ToString());
                                Entidad.porceDescuento = Convert.ToDecimal(row["porceDescuento"].ToString());
                                Entidad.Stock = Convert.ToDecimal(row["Stock"].ToString());
                                Entidad.unidadMedida = row["unidadMedida"].ToString();
                                Entidad.nombre_marcaproducto = row["nombre_marcaproducto"].ToString();
                                Entidad.movLote = row["movLote"].ToString();
                                Entidad.nroLote = row["nroLote"].ToString();

                                Entidad.Id_Unidad = row["Id_Unidad"].ToString();
                                Entidad.factorVenta = row["factorVenta"].ToString();

                                Entidad.fechaProduccion = row["fechaProduccion"].ToString();
                                Entidad.fechaVencimiento = row["fechaVencimiento"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }
                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public List<Pedidos_E> Search_Ayuda_Producto_pasaje(int id_Almacen, string cod_producto, int idUsuario)
        {
            try
            {
                List<Pedidos_E> obj_List = new List<Pedidos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_STOCK_SEARCH_HELP_Pasaje", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@id_Almacen", id_Almacen);
                        cmd.Parameters.AddWithValue("@cod_producto", cod_producto);
                        cmd.Parameters.AddWithValue("@id_usuario", idUsuario);
                        cmd.ExecuteNonQuery();

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_E Entidad = new Pedidos_E();

                                Entidad.id_producto = Convert.ToInt32(row["id_producto"].ToString());
                                Entidad.descripcion_producto = row["descripcion_producto"].ToString();
                                Entidad.codigoInterno = row["codigoInterno"].ToString();
                                Entidad.precioventa_listaprecios = Convert.ToDecimal(row["precioventa_listaprecios"].ToString());
                                Entidad.aplicaDescuento = Convert.ToDecimal(row["aplicaDescuento"].ToString());
                                Entidad.porceDescuento = Convert.ToDecimal(row["porceDescuento"].ToString());
                                Entidad.Stock = Convert.ToDecimal(row["Stock"].ToString());
                                Entidad.unidadMedida = row["unidadMedida"].ToString();
                                Entidad.nombre_marcaproducto = row["nombre_marcaproducto"].ToString();
                                Entidad.movLote = row["movLote"].ToString();
                                Entidad.nroLote = row["nroLote"].ToString();

                                Entidad.Id_Unidad = row["Id_Unidad"].ToString();
                                Entidad.factorVenta = row["factorVenta"].ToString();

                                Entidad.fechaProduccion = row["fechaProduccion"].ToString();
                                Entidad.fechaVencimiento = row["fechaVencimiento"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }
                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public List<Pedidos_E> Search_Ayuda_Producto_new(int id_local,int id_almacen, string cod_producto)
        {
            try
            {
                List<Pedidos_E> obj_List = new List<Pedidos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_STOCK_IIII", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@cod_producto", SqlDbType.VarChar).Value = cod_producto;
                        

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_E Entidad = new Pedidos_E();

                                Entidad.id_producto = Convert.ToInt32(row["id_producto"].ToString());
                                Entidad.descripcion_producto = row["descripcion_producto"].ToString();
                                Entidad.codigoInterno = row["codigoInterno"].ToString();
                                Entidad.precioventa_listaprecios = Convert.ToDecimal(row["precioventa_listaprecios"].ToString());
                                Entidad.aplicaDescuento = Convert.ToDecimal(row["aplicaDescuento"].ToString());
                                Entidad.porceDescuento = Convert.ToDecimal(row["porceDescuento"].ToString());
                                Entidad.Stock = Convert.ToDecimal(row["Stock"].ToString());
                                Entidad.unidadMedida = row["unidadMedida"].ToString();
                                Entidad.nombre_marcaproducto = row["nombre_marcaproducto"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }
                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        } 

        public string Set_CalculosTotales_Pedidos(int id_pedido)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    //using (SqlCommand cmd = new SqlCommand("SP_U_PEDIDOS_CALCULO_TOTALES", cn))
                    using (SqlCommand cmd = new SqlCommand("SP_U_PEDIDOS_CALCULO_TOTALES_NEW", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_pedido", SqlDbType.Int).Value = id_pedido;
 
                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }

        public object Set_GenerandoFacturacion(int idPedido, int id_usuario, int tipo_facturacion)
        {
            string nroDoc = "";
            int idTipoDoc = 0;
            Resul res = new Resul();

            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_PEDIDOS_INSERT_FACTURAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Pedido", SqlDbType.Int).Value = idPedido;
                        cmd.Parameters.Add("@Usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.Parameters.Add("@numero_correlativo", SqlDbType.VarChar, 40).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        nroDoc = cmd.Parameters["@numero_correlativo"].Value.ToString();

                        ///----obteniendo el tipo doc del pedido ----
                        Tbl_Fac_Pedidos_Cab objPedido = db.Tbl_Fac_Pedidos_Cab.Where( p => p.id_Pedido_Cab == idPedido).SingleOrDefault();

                        if (string.IsNullOrEmpty(objPedido.id_Pedido_Cab.ToString()) == false) {

                            idTipoDoc = Convert.ToInt32(objPedido.id_TipoDocumento);

                            //-- obteniendo los datos de la factura ---------
                            Tbl_Fac_Facturas_Cab objFactura = db.Tbl_Fac_Facturas_Cab.Where(f => f.id_TipoDocumento == idTipoDoc && f.Numero_Documento == nroDoc).SingleOrDefault();

                            if (string.IsNullOrEmpty(objFactura.id_Factura_Cab.ToString()) == false) /// si, si existe el documento ----
                            {
                                int idFactura = Convert.ToInt32(objFactura.id_Factura_Cab);
                                int id_Anexo = Convert.ToInt32(objFactura.id_Anexo);

                                GenerarComprobanteElectronico_nubeFact(idFactura, idTipoDoc, nroDoc, tipo_facturacion, id_Anexo);
                                
                                //------verificando si tiene activo la opcion de  la guia de remision electronica ----
                                if (string.IsNullOrEmpty(objFactura.generaGuia.ToString()) == false) ///  
                                {
                                    int flag_generaGuia = Convert.ToInt32(objFactura.generaGuia);
                                    if (flag_generaGuia == 1)
                                    {
                                        GenerarComprobanteElectronico_GuiaRemision_nubeFact(idFactura, idTipoDoc, nroDoc, id_Anexo);
                                    }
                                }
                            }
                            else
                            {
                                res.ok = false;
                                res.data = "No se encuentra el documento en la tabla Tbl_Fac_Facturas_Cab para Generar y enviar el Comprobante";
                            }
                        }

                        res.ok = true;
                        res.data = nroDoc;
                    }
                }
            }
            catch (Exception e)
            {
                res.ok = false;
                res.data = e.Message;
            }
            return res;
        }
               
        //public string Set_GenerandoPagos(int id_Pedido_Cab, string codRef, decimal totalpago, decimal pagoCueta,int  id_formaPago, int id_banco, string fechaOperacion, string nroOperacion)
        //{
        //    string resultado = "";
        //    try
        //    {
        //        using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
        //        {
        //            cn.Open();
        //            using (SqlCommand cmd = new SqlCommand("SP_U_PEDIDOS_INSERT_CANCELACIONES", cn))
        //            {
        //                cmd.CommandTimeout = 0;
        //                cmd.CommandType = CommandType.StoredProcedure;
        //                cmd.Parameters.Add("@id_Pedido_Cab", SqlDbType.Int).Value = id_Pedido_Cab;
        //                cmd.Parameters.Add("@codRef", SqlDbType.VarChar).Value = codRef;
        //                cmd.Parameters.Add("@totalpago", SqlDbType.Decimal).Value = totalpago;

        //                cmd.Parameters.Add("@pagoCueta", SqlDbType.Decimal).Value = pagoCueta;
        //                cmd.Parameters.Add("@id_formaPago", SqlDbType.Int).Value = id_formaPago;
        //                cmd.Parameters.Add("@id_banco", SqlDbType.Int).Value = id_banco;

        //                cmd.Parameters.Add("@fechaOperacion", SqlDbType.VarChar).Value = fechaOperacion;
        //                cmd.Parameters.Add("@nroOperacion", SqlDbType.VarChar).Value = nroOperacion;

        //                cmd.Parameters.Add("@id_pago", SqlDbType.Int).Direction = ParameterDirection.Output;

        //                cmd.ExecuteNonQuery();
        //                nroDoc = cmd.Parameters["@id_pago"].Value.ToString();


     
        //                resultado = "OK";
        //            }
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        resultado = e.Message;
        //    }
        //    return resultado;
        //}


        public object Set_GenerandoPagos(int id_Pedido_Cab, string codRef, decimal totalpago, decimal pagoCueta, int id_formaPago, int id_banco, string fechaOperacion, string nroOperacion)
        {
            string idPago = "";
            Resul res = new Resul();

            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_PEDIDOS_INSERT_CANCELACIONES", cn))
                    {
 
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Pedido_Cab", SqlDbType.Int).Value = id_Pedido_Cab;
                        cmd.Parameters.Add("@codRef", SqlDbType.VarChar).Value = codRef;
                        cmd.Parameters.Add("@totalpago", SqlDbType.Decimal).Value = totalpago;

                        cmd.Parameters.Add("@pagoCueta", SqlDbType.Decimal).Value = pagoCueta;
                        cmd.Parameters.Add("@id_formaPago", SqlDbType.Int).Value = id_formaPago;
                        cmd.Parameters.Add("@id_banco", SqlDbType.Int).Value = id_banco;

                        cmd.Parameters.Add("@fechaOperacion", SqlDbType.VarChar).Value = fechaOperacion;
                        cmd.Parameters.Add("@nroOperacion", SqlDbType.VarChar).Value = nroOperacion;

                        cmd.Parameters.Add("@id_pago", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        idPago = cmd.Parameters["@id_pago"].Value.ToString();

                        res.ok = true;
                        res.data = idPago;
                    }
                }
            }
            catch (Exception e)
            {
                res.ok = false;
                res.data = e.Message;
            }
            return res;
        }





        public string Set_Rechazando_Pedido(string numeroDoc, int TipoDoc, int id_usuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_PEDIDOS_RECHAZAR_NEW", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Numero_Documento", SqlDbType.VarChar).Value = numeroDoc;
                        cmd.Parameters.Add("@Tipo_Documento", SqlDbType.Int).Value = TipoDoc;
                        cmd.Parameters.Add("@Usuario", SqlDbType.Int).Value = id_usuario;

                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }

        public string Set_Aprobar_Pedido(string numeroDoc, int TipoDoc, int id_usuario,int estado)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_PEDIDOS_APROBAR_NEW", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Numero_Documento", SqlDbType.VarChar).Value = numeroDoc;
                        cmd.Parameters.Add("@Tipo_Documento", SqlDbType.Int).Value = TipoDoc;
                        cmd.Parameters.Add("@Usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.Parameters.Add("@estado", SqlDbType.Int).Value = estado;

                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }

        public List<Pedidos_E> get_SaldoCuenta_Pedido(int id_pedidoCab)
        {
            try
            {
                List<Pedidos_E> obj_List = new List<Pedidos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_PEDIDOS_SALDOCUENTA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Pedido_Cab", SqlDbType.Int).Value = id_pedidoCab;
                         DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_E Entidad = new Pedidos_E();

                                Entidad.saldoCuenta = Convert.ToDecimal(row["saldoCuenta"].ToString()); 
                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }
                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
                     
        public object GenerandoNotaCredito_debito(string id_factura_cab, string fecha_emision, string id_tipoDocumento, string numero_documento, string id_tipoOperacion, string observacion, int user)
        {
            string nroDoc = "";
            Resul res = new Resul();

            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GENERAR_NOTA_CREDITO_NEW", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_cab", SqlDbType.Int).Value = Convert.ToInt32(id_factura_cab);
                        cmd.Parameters.Add("@fecha_emision", SqlDbType.VarChar).Value = fecha_emision;
                        cmd.Parameters.Add("@id_tipo_doc", SqlDbType.Int).Value = Convert.ToInt32(id_tipoDocumento);
                        cmd.Parameters.Add("@numero_documento", SqlDbType.VarChar).Value = numero_documento;
                        cmd.Parameters.Add("@id_tipo_operacion", SqlDbType.Int).Value = id_tipoOperacion;
                        cmd.Parameters.Add("@observacion", SqlDbType.VarChar).Value = observacion;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@numero_correlativo", SqlDbType.VarChar, 40).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        nroDoc = cmd.Parameters["@numero_correlativo"].Value.ToString();      

                        int idFact = Convert.ToInt32(id_factura_cab);
 
                        Tbl_Fac_Facturas_Cab objFactura = db.Tbl_Fac_Facturas_Cab.Where(f => f.id_Factura_Cab == idFact).SingleOrDefault();

                        if (objFactura != null)
                        {
                            if (objFactura.id_TipoDocumento == 1) // ----las facturas se envian directamente 
                            {
                                //--obteniendo los datos de la factura, esta parte se ha comentado porque no se enviara directamente a la sunat-------- -

                                Tbl_Fac_Facturas_Cab objNotaCredito = db.Tbl_Fac_Facturas_Cab.Where(f => f.id_Factura_Cab_Referencia == idFact  && f.Numero_Documento == nroDoc).SingleOrDefault();

                                if (string.IsNullOrEmpty(objNotaCredito.id_Factura_Cab.ToString()) == false) /// si, si existe el documento ----
                                {
                                    int idNotaCredito = Convert.ToInt32(objNotaCredito.id_Factura_Cab.ToString());
                                    int idTipoDoc = Convert.ToInt32(objNotaCredito.id_TipoDocumento.ToString());
                                    string nroDocumento = objNotaCredito.Numero_Documento.ToString();
                                    nroDoc = nroDoc + "-" + idNotaCredito;

                                    ///------el token esta por Anexos ----
                                    if (string.IsNullOrEmpty(objNotaCredito.id_Anexo.ToString()) == false)
                                    {
                                        int id_Anexo = Convert.ToInt32(objNotaCredito.id_Anexo);
                                        GenerarComprobanteElectronico_NotaCredito_Debito_nubeFact(idNotaCredito, idTipoDoc, nroDocumento, Convert.ToInt32(id_tipoOperacion), idFact, id_Anexo);

                                        res.ok = true;
                                        res.data = nroDoc;
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
                            else {  //---- las boletas tienen que ser aceptadas por la sunat ---
                                res.ok = true;
                                res.data = nroDoc;
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                res.ok = false;
                res.data = e.Message;
            }
            return res;
        }


        public List<Factura_E> Listando_facturas_Cab(int id_local, int id_almacen, string fecha_ini, string fecha_fin, string nrodoc, int id_Anexos, int id_transportista)
        {
            try
            {
                List<Factura_E> obj_List = new List<Factura_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_FACTURAS_LISTADO_II", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fecha_fin;
                        cmd.Parameters.Add("@nrodoc", SqlDbType.VarChar).Value = nrodoc;
                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Factura_E Entidad = new Factura_E();

                                Entidad.id_Factura_Cab = Convert.ToInt32(row["id_Factura_Cab"].ToString());

                                Entidad.id_empresa = Convert.ToInt32(row["id_empresa"].ToString());
                                Entidad.id_Local = Convert.ToInt32(row["id_Local"].ToString());
                                Entidad.Numero_Documento = row["Numero_Documento"].ToString();
                                Entidad.codigoInterno_Suministro = row["codigoInterno_Suministro"].ToString();

                                Entidad.nroDoc_Cliente = row["nroDoc_Cliente"].ToString();
                                Entidad.nombres_Cliente = row["nombres_Cliente"].ToString();

                                Entidad.id_Almacen = Convert.ToInt32(row["id_Almacen"].ToString());
                                Entidad.descripcion_Almacen = row["descripcion_Almacen"].ToString();
                                Entidad.id_TipoDocumento = Convert.ToInt32(row["id_TipoDocumento"].ToString());
                                Entidad.Descripcion_TipoDocumento = row["Descripcion_TipoDocumento"].ToString();

                                Entidad.id_PuntoVenta = Convert.ToInt32(row["id_PuntoVenta"].ToString());
                                Entidad.descripcion_PuntoVenta = row["descripcion_PuntoVenta"].ToString();
                                Entidad.id_cuadrilla = Convert.ToInt32(row["id_cuadrilla"].ToString());
                                Entidad.id_PersonalVendedor = Convert.ToInt32(row["id_PersonalVendedor"].ToString());
                                Entidad.personal = row["personal"].ToString();

                                Entidad.id_FormaPago = Convert.ToInt32(row["id_FormaPago"].ToString());
                                Entidad.condicionFacturacion = row["condicionFacturacion"].ToString();
                                Entidad.id_moneda = Convert.ToInt32(row["id_moneda"].ToString());
                                Entidad.fechaEmision_Factura_Cab = row["fechaEmision_Factura_Cab"].ToString();

                                Entidad.tipoCambio_Factura_Cab = row["tipoCambio_Factura_Cab"].ToString();
                                Entidad.codigoInterno_Cliente = row["codigoInterno_Cliente"].ToString();
                                Entidad.cliente = row["cliente"].ToString();
                                Entidad.direccion_Factura_Cab = row["direccion_Factura_Cab"].ToString();

                                Entidad.fechaEntrega_Factura_Cab = row["fechaEntrega_Factura_Cab"].ToString();
                                Entidad.porcentajeIGV_Factura_Cab = row["porcentajeIGV_Factura_Cab"].ToString();

                                Entidad.observaciones_Factura_Cab = row["observaciones_Factura_Cab"].ToString();
                                Entidad.estado = Convert.ToInt32(row["estado"].ToString());

                                Entidad.usuario_creacion = Convert.ToInt32(row["usuario_creacion"].ToString());
                                Entidad.Sub_Total_Factura_Cab = Convert.ToDecimal(row["Sub_Total_Factura_Cab"].ToString());
                                Entidad.total_Igv_Factura_Cab = Convert.ToDecimal(row["total_Igv_Factura_Cab"].ToString());
                                Entidad.total_Neto_Factura_Cab = Convert.ToDecimal(row["total_Neto_Factura_Cab"].ToString());
                                Entidad.flag_tipo_facturacion = row["flag_tipo_facturacion"].ToString();

                                Entidad.id_ZonaVta = row["id_ZonaVta"].ToString();
                                Entidad.id_Anexo = row["id_Anexo"].ToString();

                                Entidad.fecha_creacion = row["fecha_creacion"].ToString();
                                Entidad.usuario_edicion = row["usuario_edicion"].ToString();
                                Entidad.fecha_edicion = row["fecha_edicion"].ToString();
 

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public List<Factura_E> Listando_NotasCredito_Cab(int id_local, int id_almacen, string fecha_ini, string fecha_fin, string nrodoc, int id_Anexos, int id_transportista)
        {
            try
            {
                List<Factura_E> obj_List = new List<Factura_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_NOTAS_CREDITO_LISTADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fecha_fin;
                        cmd.Parameters.Add("@nrodoc", SqlDbType.VarChar).Value = nrodoc;
                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Factura_E Entidad = new Factura_E();

                                Entidad.id_Factura_Cab = Convert.ToInt32(row["id_Factura_Cab"].ToString());

                                Entidad.id_empresa = Convert.ToInt32(row["id_empresa"].ToString());
                                Entidad.id_Local = Convert.ToInt32(row["id_Local"].ToString());
                                Entidad.Numero_Documento = row["Numero_Documento"].ToString();
                                Entidad.codigoInterno_Suministro = row["codigoInterno_Suministro"].ToString();

                                Entidad.nroDoc_Cliente = row["nroDoc_Cliente"].ToString();
                                Entidad.nombres_Cliente = row["nombres_Cliente"].ToString();

                                Entidad.id_Almacen = Convert.ToInt32(row["id_Almacen"].ToString());
                                Entidad.descripcion_Almacen = row["descripcion_Almacen"].ToString();
                                Entidad.id_TipoDocumento = Convert.ToInt32(row["id_TipoDocumento"].ToString());
                                Entidad.Descripcion_TipoDocumento = row["Descripcion_TipoDocumento"].ToString();

                                Entidad.id_PuntoVenta = Convert.ToInt32(row["id_PuntoVenta"].ToString());
                                Entidad.descripcion_PuntoVenta = row["descripcion_PuntoVenta"].ToString();
                                Entidad.id_cuadrilla = Convert.ToInt32(row["id_cuadrilla"].ToString());
                                Entidad.id_PersonalVendedor = Convert.ToInt32(row["id_PersonalVendedor"].ToString());
                                Entidad.personal = row["personal"].ToString();

                                Entidad.id_FormaPago = Convert.ToInt32(row["id_FormaPago"].ToString());
                                Entidad.condicionFacturacion = row["condicionFacturacion"].ToString();
                                Entidad.id_moneda = Convert.ToInt32(row["id_moneda"].ToString());
                                Entidad.fechaEmision_Factura_Cab = row["fechaEmision_Factura_Cab"].ToString();

                                Entidad.tipoCambio_Factura_Cab = row["tipoCambio_Factura_Cab"].ToString();
                                Entidad.codigoInterno_Cliente = row["codigoInterno_Cliente"].ToString();
                                Entidad.cliente = row["cliente"].ToString();
                                Entidad.direccion_Factura_Cab = row["direccion_Factura_Cab"].ToString();

                                Entidad.fechaEntrega_Factura_Cab = row["fechaEntrega_Factura_Cab"].ToString();
                                Entidad.porcentajeIGV_Factura_Cab = row["porcentajeIGV_Factura_Cab"].ToString();

                                Entidad.observaciones_Factura_Cab = row["observaciones_Factura_Cab"].ToString();
                                Entidad.estado = Convert.ToInt32(row["estado"].ToString());

                                Entidad.usuario_creacion = Convert.ToInt32(row["usuario_creacion"].ToString());
                                Entidad.Sub_Total_Factura_Cab = Convert.ToDecimal(row["Sub_Total_Factura_Cab"].ToString());
                                Entidad.total_Igv_Factura_Cab = Convert.ToDecimal(row["total_Igv_Factura_Cab"].ToString());
                                Entidad.total_Neto_Factura_Cab = Convert.ToDecimal(row["total_Neto_Factura_Cab"].ToString());

                                Entidad.id_tipo_nc_nd = row["id_tipo_nc_nd"].ToString();
                                Entidad.flag_tipo_facturacion = row["flag_tipo_facturacion"].ToString();


                                Entidad.id_ZonaVta = row["id_ZonaVta"].ToString();
                                Entidad.id_Anexo = row["id_Anexo"].ToString();


                                Entidad.fecha_creacion = row["fecha_creacion"].ToString();
                                Entidad.usuario_edicion = row["usuario_edicion"].ToString();
                                Entidad.fecha_edicion = row["fecha_edicion"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public List<Stock_Notas_Debito> Listado_Stock_Notas_Credito(int id_Factura_Cab)
        {
            try
            {
                List<Stock_Notas_Debito> obj_List = new List<Stock_Notas_Debito>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_STOCK_NOTAS_CREDITO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Factura_Cab", SqlDbType.Int).Value = id_Factura_Cab;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Stock_Notas_Debito Entidad = new Stock_Notas_Debito();

                                Entidad.id_Factura_Det = row["id_Factura_Det"].ToString();
                                Entidad.id_Factura_Cab = row["id_Factura_Cab"].ToString();
                                Entidad.Item_Factura_Det = row["Item_Factura_Det"].ToString();
                                Entidad.id_Producto = row["Id_Producto"].ToString();
                                Entidad.codigo1_Producto = row["codigo1_Producto"].ToString();
                                Entidad.nombre_Producto = row["nombre_Producto"].ToString();
                                Entidad.nombre_UnidadMedida = row["nombre_UnidadMedida"].ToString();
                                Entidad.precioVenta_Factura_Det = row["precioVenta_Factura_Det"].ToString();
                                Entidad.porcentajeDescuentoFactura_Det = row["porcentajeDescuentoFactura_Det"].ToString();
                                Entidad.Descuento_Factura_Det = row["Descuento_Factura_Det"].ToString();
                                Entidad.cantidad_Factura_Det = row["cantidad_Factura_Det"].ToString();
                                Entidad.porcentajeIGV_Factura_Det = row["porcentajeIGV_Factura_Det"].ToString();
                                Entidad.total_Factura_Det = row["total_Factura_Det"].ToString();
                                Entidad.nombre_marcaproducto = row["nombre_marcaproducto"].ToString();
                                Entidad.stock = row["stock"].ToString();
                               


                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public List<Stock_Notas_Debito> Listado_detalle_Notas_Credito(int id_Factura_Cab)
        {
            try
            {
                List<Stock_Notas_Debito> obj_List = new List<Stock_Notas_Debito>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_STOCK_NOTAS_CREDITO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Factura_Cab", SqlDbType.Int).Value = id_Factura_Cab;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Stock_Notas_Debito Entidad = new Stock_Notas_Debito();

                                Entidad.id_Factura_Det = row["id_Factura_Det"].ToString();
                                Entidad.id_Factura_Cab = row["id_Factura_Cab"].ToString();
                                Entidad.Item_Factura_Det = row["Item_Factura_Det"].ToString();
                                Entidad.id_Producto = row["Id_Producto"].ToString();
                                Entidad.codigo1_Producto = row["codigo1_Producto"].ToString();
                                Entidad.nombre_Producto = row["nombre_Producto"].ToString();
                                Entidad.nombre_UnidadMedida = row["nombre_UnidadMedida"].ToString();
                                Entidad.precioVenta_Factura_Det = row["precioVenta_Factura_Det"].ToString();
                                Entidad.porcentajeDescuentoFactura_Det = row["porcentajeDescuentoFactura_Det"].ToString();
                                Entidad.Descuento_Factura_Det = row["Descuento_Factura_Det"].ToString();
                                Entidad.cantidad_Factura_Det = row["cantidad_Factura_Det"].ToString();
                                Entidad.porcentajeIGV_Factura_Det = row["porcentajeIGV_Factura_Det"].ToString();
                                Entidad.total_Factura_Det = row["total_Factura_Det"].ToString();
                                Entidad.nombre_marcaproducto = row["nombre_marcaproducto"].ToString();
                                Entidad.stock = row["stock"].ToString();



                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public string Set_almacenandoDetalle_Notas(List<Detalle_Factura_E> List_Detalle)
        {

            string Resultado = null;
            bool flagCant = false;
            int user = 0;
            int id_doc_ref = 0;

            //---validacion de registros
            for (int i = 0; i < List_Detalle.Count; i++)
            {
                flagCant = true;
                break;
            }
            if (flagCant == false)
            {
                Resultado = "No se cargo la informacion correctamente, Actualice la pagina y vuelva a intentarlo";
                return Resultado;
            }
 
            user = List_Detalle[0].usuario;
            id_doc_ref = List_Detalle[0].usuario;
     
            DataTable dt_detalle = new DataTable();
            try
            {
                try
                {
                    PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(Detalle_Factura_E));
                    foreach (PropertyDescriptor prop in properties)
                    {
                        dt_detalle.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
                    }

                    foreach (Detalle_Factura_E item in List_Detalle)
                    {
                        DataRow row = dt_detalle.NewRow();
                        foreach (PropertyDescriptor prop in properties)
                            row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                        dt_detalle.Rows.Add(row);
                    }
                }
                catch (Exception ex)
                {
                    Resultado = ex.Message;
                    return Resultado;
                }

                using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_D_NOTAS_CREDITO_DEBITO_II", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@usuario", SqlDbType.Int).Value = user;
                        cmd.ExecuteNonQuery();
                    }

                    //guardando al informacion de la importacion
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(bdConexion.cadenaBDcx()))
                    {

                        bulkCopy.BatchSize = 500;
                        bulkCopy.NotifyAfter = 1000;
                        bulkCopy.DestinationTableName = "T_TEMPORAL_DETALLE_NOTAS_II";
                        bulkCopy.WriteToServer(dt_detalle);
                    }

                    Resultado = "OK";
                }
            }
            catch (Exception ex)
            {
                Resultado =  ex.Message;
            }

            return Resultado;

        }

        public List<Factura_E> Get_numeroCorrelativo(int id_local, int id_tipoDoc, int id_tipoDoc_Ref)
        {
            try
            {
                List<Factura_E> obj_List = new List<Factura_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_NUMERO_CORRELATIVO_Anexos", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Anexo", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_tipoDoc", SqlDbType.Int).Value = id_tipoDoc;
                        cmd.Parameters.Add("@id_tipoDoc_Ref", SqlDbType.Int).Value = id_tipoDoc_Ref;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Factura_E Entidad = new Factura_E();
                                Entidad.serie_correlativo = row["serie_correlativo"].ToString();
                                Entidad.numero_correlativo = row["numero_correlativo"].ToString();
                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public string Set_numeroCorrelativo_actualizar(int id_local, int id_tipoDoc, int id_tipoDoc_Ref)
        {
            string Resultado = "";
            try 
	        {	   
                using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_NUMERO_CORRELATIVO_ACTUALIZAR", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_tipoDoc", SqlDbType.Int).Value = id_tipoDoc;
                        cmd.Parameters.Add("@id_tipoDoc_Ref", SqlDbType.Int).Value = id_tipoDoc_Ref;
                        cmd.ExecuteNonQuery();
                    }
                    Resultado = "OK";
                }
            }
            catch (Exception ex)
            {
                Resultado = ex.Message;
            }
            return Resultado;

        }
        

        ///------ GENERAR ENVIO DE DOCUMENTO  NUBEFACT ---


        NubeFacT nubeFact = new NubeFacT();
 
        public void GenerarComprobanteElectronico_nubeFact(int idFactura, int TipoDoc, string nroDocumento, int idTipoFacturacion, int id_Anexo)
        {
            try
            {
                string rutaQR = "";
                string ruta = "";
                string token = "";

                ///----- obtener los token por Anexo ----
                tbl_Anexos anexo = db.tbl_Anexos.Find(id_Anexo);
                if (string.IsNullOrEmpty(anexo.RUTA.ToString()) == false)
                {
                    ruta = anexo.RUTA;
                    token = anexo.TOKEN;
                }
                else
                {
                    throw new Exception("No se configuro la ruta y el Token de envio al Api de Facturación..");
                }

                 DataTable dt_comprobantes = new DataTable();
                 dt_comprobantes = get_detalleDocumento_boletasFacturas(idFactura, idTipoFacturacion);

                if (dt_comprobantes.Rows.Count == 0)
                {
                    throw new Exception("No hay informacion para armar Json.. SP_S_NUBE_FACT_JSON_BOLETA_FACTURA " + idFactura + ","+ idTipoFacturacion);
                }
                

                  //string ruta = nubeFact.ruta;
                  //string token = nubeFact.token;

                    Invoice invoice = new Invoice();
                    List<Items> list_Detalle = new List<Items>();

                    /// --- --  CREAMOS EL JSON-----

                    int idCabecera = 0;
                    foreach (DataRow row in dt_comprobantes.Rows)
                    {
                        if (idCabecera != Convert.ToInt32(row["id_Factura_Cab"]))
                        {
                            rutaQR = System.Web.Hosting.HostingEnvironment.MapPath("~/FACT_ELECT_QR/" + idFactura);

                            ///CREAMOS EL JSON
                            invoice.operacion = "generar_comprobante";
                            invoice.tipo_de_comprobante = Convert.ToInt32(row["tipo_de_comprobante"].ToString());
                            invoice.serie = row["serie"].ToString();
                            invoice.numero = Convert.ToInt32(row["numero"].ToString());
                            invoice.sunat_transaction = Convert.ToInt32(row["sunat_transaction"].ToString());
                            invoice.cliente_tipo_de_documento = Convert.ToInt32(row["cliente_tipo_de_documento"].ToString());
                            invoice.cliente_numero_de_documento = row["cliente_numero_de_documento"].ToString();
                            invoice.cliente_denominacion = row["cliente_denominacion"].ToString();

                            invoice.cliente_direccion = row["cliente_direccion"].ToString();
                            invoice.cliente_email = row["cliente_email"].ToString();
                            invoice.cliente_email_1 = row["cliente_email_1"].ToString();
                            invoice.cliente_email_2 = row["cliente_email_2"].ToString();
                            invoice.fecha_de_emision = Convert.ToDateTime(row["fecha_de_emision"].ToString());
                            invoice.fecha_de_vencimiento = Convert.ToDateTime(row["fecha_de_emision"].ToString());

                            invoice.moneda = Convert.ToInt32(row["moneda"].ToString());
                            invoice.tipo_de_cambio = row["tipo_de_cambio"].ToString();
                            invoice.porcentaje_de_igv = Convert.ToDouble(row["porcentaje_de_igv"].ToString());
                            invoice.descuento_global = row["descuento_global"].ToString();
                            invoice.total_descuento = row["total_descuento"].ToString();
                            invoice.total_anticipo = row["total_anticipo"].ToString();
                            invoice.total_gravada = row["total_gravada"].ToString();
                            invoice.total_inafecta = row["total_inafecta"].ToString();

                            invoice.total_exonerada = row["total_exonerada"].ToString();
                            invoice.total_igv = Convert.ToDouble(row["total_igv"].ToString());
                            invoice.total_gratuita = row["total_gratuita"].ToString();
                            invoice.total_otros_cargos = row["total_otros_cargos"].ToString();
                            invoice.total = Convert.ToDouble(row["total"].ToString());
                            invoice.percepcion_tipo = row["percepcion_tipo"].ToString();
                            invoice.percepcion_base_imponible = row["percepcion_base_imponible"].ToString();
                            invoice.total_percepcion = row["total_percepcion"].ToString();
                            invoice.detraccion = (row["detraccion"].ToString() == "true") ? true : false;

                            invoice.observaciones = row["observaciones"].ToString();
                            invoice.documento_que_se_modifica_tipo = row["documento_que_se_modifica_tipo"].ToString();
                            invoice.documento_que_se_modifica_serie = row["documento_que_se_modifica_serie"].ToString();
                            invoice.documento_que_se_modifica_numero = row["documento_que_se_modifica_numero"].ToString();
                            invoice.tipo_de_nota_de_credito = row["tipo_de_nota_de_credito"].ToString();
                            invoice.tipo_de_nota_de_debito = row["tipo_de_nota_de_debito"].ToString();
                            invoice.enviar_automaticamente_a_la_sunat = (row["enviar_automaticamente_a_la_sunat"].ToString() == "true") ? true : false;
                            invoice.enviar_automaticamente_al_cliente = (row["enviar_automaticamente_al_cliente"].ToString() == "true") ? true : false;

                            invoice.codigo_unico = row["codigo_unico"].ToString();
                            invoice.condiciones_de_pago = row["condiciones_de_pago"].ToString();
                            invoice.medio_de_pago = row["medio_de_pago"].ToString();
                            invoice.placa_vehiculo = row["placa_vehiculo"].ToString();
                            invoice.orden_compra_servicio = row["orden_compra_servicio"].ToString();
                            invoice.tabla_personalizada_codigo = row["tabla_personalizada_codigo"].ToString();
                            invoice.formato_de_pdf = "";

                            idCabecera = Convert.ToInt32(row["id_Factura_Cab"]);

                            foreach (DataRow fila in dt_comprobantes.Rows)
                            {
                                Items obj_entidad = new Items();

                                if (idCabecera == Convert.ToInt32(row["id_Factura_Cab"]))
                                {
                                    obj_entidad.unidad_de_medida = fila["unidad_de_medida"].ToString();
                                    obj_entidad.codigo = fila["codigo"].ToString();
                                    obj_entidad.descripcion = fila["descripcion"].ToString();
                                    obj_entidad.cantidad = Convert.ToDouble(fila["cantidad"].ToString());
                                    obj_entidad.valor_unitario = Convert.ToDouble(fila["valor_unitario"].ToString());
                                    obj_entidad.precio_unitario = Convert.ToDouble(fila["precio_unitario"].ToString());

                                    obj_entidad.descuento = fila["descuento"].ToString();
                                    obj_entidad.subtotal = Convert.ToDouble(fila["subtotal"].ToString());
                                    obj_entidad.tipo_de_igv = Convert.ToInt32(fila["tipo_de_igv"].ToString());
                                    obj_entidad.igv = Convert.ToDouble(fila["igv"].ToString());
                                    obj_entidad.total = Convert.ToDouble(fila["total_det"].ToString());

                                    obj_entidad.anticipo_regularizacion = (fila["anticipo_regularizacion"].ToString() == "true") ? true : false;
                                    obj_entidad.anticipo_comprobante_serie = fila["anticipo_comprobante_serie"].ToString();
                                    obj_entidad.anticipo_comprobante_numero = fila["anticipo_comprobante_numero"].ToString();

                                    list_Detalle.Add(obj_entidad);
                                }
                            }
                            invoice.items = list_Detalle;
                        }
                    }
                    

                    ///--------------------------
                    ///----generado el json-----
                    ///--------------------------

                    string json = JsonConvert.SerializeObject(invoice, Formatting.Indented);
                    Console.WriteLine(json);
                    byte[] bytes = Encoding.Default.GetBytes(json);
                    string json_en_utf_8 = Encoding.UTF8.GetString(bytes);


                    ///----------------------------------------
                    ///---- Enviando  el json a nubeFact -----
                    ///-------------------------- ------------

                    string json_de_respuesta = nubeFact.SendJson(ruta, json_en_utf_8, token);
                    dynamic r = JsonConvert.DeserializeObject<Respuesta>(json_de_respuesta);
                    string r2 = JsonConvert.SerializeObject(r, Formatting.Indented);
                    dynamic json_r_in = JsonConvert.DeserializeObject<Respuesta>(r2);

                    ///----------------------------------------
                    ///---- Respuesta nubeFact ----------------
                    ///-------------------------- ------------

                    dynamic leer_respuesta = JsonConvert.DeserializeObject<Respuesta>(json_de_respuesta);
                    if (leer_respuesta.errors == null)
                    {
                    //Console.WriteLine(json_r_in);
                    //Console.WriteLine();
                    //Console.WriteLine();
                    //Console.WriteLine("TIPO: " + leer_respuesta.tipo);
                    //Console.WriteLine("SERIE: " + leer_respuesta.serie);
                    //Console.WriteLine("NUMERO: " + leer_respuesta.numero);
                    //Console.WriteLine("URL: " + leer_respuesta.url);
                    //Console.WriteLine("ACEPTADA_POR_SUNAT: " + leer_respuesta.aceptada_por_sunat);
                    //Console.WriteLine("DESCRIPCION SUNAT: " + leer_respuesta.sunat_description);
                    //Console.WriteLine("NOTA SUNAT: " + leer_respuesta.sunat_note);
                    //Console.WriteLine("CODIGO RESPUESTA SUNAT: " + leer_respuesta.sunat_responsecode);
                    //Console.WriteLine("SUNAT ERROR SOAP: " + leer_respuesta.sunat_soap_error);
                    //Console.WriteLine("PDF EN BASE64: " + leer_respuesta.pdf_zip_base64);
                    //Console.WriteLine("XML EN BASE64: " + leer_respuesta.xml_zip_base64);
                    //Console.WriteLine("CDR EN BASE64: " + leer_respuesta.cdr_zip_base64);
                    //Console.WriteLine("CODIGO QR: " + leer_respuesta.cadena_para_codigo_qr);
                    //Console.WriteLine("CODIGO HASH: " + leer_respuesta.codigo_hash);
                    //Console.WriteLine("CODIGO DE BARRAS: " + leer_respuesta.codigo_de_barras);
                    //Console.ReadKey();

                    ////----creando el Codigo QR
                    //byte[] obj_codQR = GeneraCodigoQR(leer_respuesta.codigo_de_barras);

                    if (String.IsNullOrEmpty(leer_respuesta.codigo_de_barras) == true)
                        {
                            if (String.IsNullOrEmpty(leer_respuesta.codigo_hash) == false)
                            {
                                byte[] obj_codQR = GeneraCodigoQR(leer_respuesta.codigo_hash);
                                using (FileStream Writer = new System.IO.FileStream(rutaQR + ".gif", FileMode.Create, FileAccess.Write))
                                {
                                    Writer.Write(obj_codQR, 0, obj_codQR.Length);
                                }
                                Set_actualizando_Facturacion_Electronica(idFactura, 2, TipoDoc + "_" + nroDocumento + ".xml", idFactura + ".gif");
                            }
                        }
                        else {
                            byte[] obj_codQR = GeneraCodigoQR(leer_respuesta.codigo_de_barras);
                            using (FileStream Writer = new System.IO.FileStream(rutaQR + ".gif", FileMode.Create, FileAccess.Write))
                            {
                                Writer.Write(obj_codQR, 0, obj_codQR.Length);
                            }
                            Set_actualizando_Facturacion_Electronica(idFactura, 2, TipoDoc + "_" + nroDocumento + ".xml", idFactura + ".gif");
                        }
                    }
                else
                {
                    Set_Log_Alertas(idFactura, leer_respuesta.errors.Replace("\n", string.Empty));
                }
     
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public DataTable get_detalleDocumento_boletasFacturas(int idFactura, int idTipoFacturacion)
        {
            try
            {
                DataTable obj_List = new DataTable();
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_NUBE_FACT_JSON_BOLETA_FACTURA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFactura", SqlDbType.Int).Value = idFactura;
                        cmd.Parameters.Add("@idTipoFacturacion", SqlDbType.Int).Value = idTipoFacturacion;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            obj_List = dt_detalle;
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        
        public byte[] GeneraCodigoQR(string TextoCodificar)
        {
            //Instancia del objeto encargado de codificar el codigo QR
            QRCodeEncoder CodigoQR = new QRCodeEncoder();

            CodigoQR.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.BYTE;
            CodigoQR.QRCodeScale = 4;
            CodigoQR.QRCodeErrorCorrect = ThoughtWorks.QRCode.Codec.QRCodeEncoder.ERROR_CORRECTION.M;
            CodigoQR.QRCodeVersion = 0;
            CodigoQR.QRCodeBackgroundColor = System.Drawing.Color.White;
            CodigoQR.QRCodeForegroundColor = System.Drawing.Color.Black;

            //Se retorna el Codigo QR codificado en formato de arreglo de bytes.
            return imageToByteArray(CodigoQR.Encode(TextoCodificar, System.Text.Encoding.UTF8));
        }

        public byte[] imageToByteArray(System.Drawing.Image imageIn)
        {
            System.IO.MemoryStream ms = new System.IO.MemoryStream();
            imageIn.Save(ms, System.Drawing.Imaging.ImageFormat.Gif);
            return ms.ToArray();
        }

        public void Set_actualizando_Facturacion_Electronica(int id_cabecera, int id_tipo, string nombreArchivo, string nombreArchivo2)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_FACTURACION_ELECTRONICA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_cabecera", SqlDbType.Int).Value = id_cabecera;
                        cmd.Parameters.Add("@id_tipo", SqlDbType.Int).Value = id_tipo;
                        cmd.Parameters.Add("@nombreArchivo", SqlDbType.VarChar).Value = nombreArchivo;
                        cmd.Parameters.Add("@nombreArchivo_2", SqlDbType.VarChar).Value = nombreArchivo2;
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception)
            {
                throw;
            } 
        }

        public void Set_Log_Alertas(int id_cabecera, string mensaje_error)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_FACTURACION_ELECTRONICA_LOG_ERROR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_cabecera", SqlDbType.Int).Value = id_cabecera;
                        cmd.Parameters.Add("@mensaje", SqlDbType.VarChar).Value = mensaje_error;

                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        //----------------------------------
        //NOTAS DE CREDITO Y NOTAS DE DEBITOS
        //--------- -------------------
               
        public void GenerarComprobanteElectronico_NotaCredito_Debito_nubeFact(int idNotaCredito, int TipoDocNotaCredito , string nroDocumentoNotaCredito , int id_tipoOperacion, int id_facturaRef, int id_Anexo)
        {
            try
            {
                string rutaQR = "";
                string ruta = "";
                string token = "";


                    ///----- obtener los token por Anexo ----
                    tbl_Anexos anexo = db.tbl_Anexos.Find(id_Anexo);
                    if (string.IsNullOrEmpty(anexo.RUTA.ToString()) == false)
                    {
                        ruta = anexo.RUTA;
                        token = anexo.TOKEN;
                    }
                    else
                    {
                        throw new Exception("No se configuro la ruta y el Token de envio al Api de Facturación..");
                    }
                    
                    DataTable dt_comprobantes = new DataTable();
                    dt_comprobantes = get_detalleDocumento_notasCreditoDebito(idNotaCredito, id_facturaRef, id_tipoOperacion);

                    if (dt_comprobantes.Rows.Count == 0)
                    {
                        throw new Exception("No hay informacion para armar Json.. SP_S_NUBE_FACT_JSON_NOTAS_CREDITO_DEBITO " + idNotaCredito + "," + id_facturaRef + "," + id_tipoOperacion);
                    }                    

                    Invoice invoice = new Invoice();
                    List<Items> list_Detalle = new List<Items>();

                    /// --- --  CREAMOS EL JSON-----

                    int idCabecera = 0;
                    foreach (DataRow row in dt_comprobantes.Rows)
                    {
                        if (idCabecera != Convert.ToInt32(row["id_Factura_Cab"]))
                        {
                            rutaQR = System.Web.Hosting.HostingEnvironment.MapPath("~/FACT_ELECT_QR/" + idNotaCredito);

                            ///CREAMOS EL JSON
                            invoice.operacion = "generar_comprobante";
                            invoice.tipo_de_comprobante = Convert.ToInt32(row["tipo_de_comprobante"].ToString());
                            invoice.serie = row["serie"].ToString();
                            invoice.numero = Convert.ToInt32(row["numero"].ToString());
                            invoice.sunat_transaction = Convert.ToInt32(row["sunat_transaction"].ToString());
                            invoice.cliente_tipo_de_documento = Convert.ToInt32(row["cliente_tipo_de_documento"].ToString());
                            invoice.cliente_numero_de_documento = row["cliente_numero_de_documento"].ToString();
                            invoice.cliente_denominacion = row["cliente_denominacion"].ToString();

                            invoice.cliente_direccion = row["cliente_direccion"].ToString();
                            invoice.cliente_email = row["cliente_email"].ToString();
                            invoice.cliente_email_1 = row["cliente_email_1"].ToString();
                            invoice.cliente_email_2 = row["cliente_email_2"].ToString();
                            invoice.fecha_de_emision = Convert.ToDateTime(row["fecha_de_emision"].ToString());
                            invoice.fecha_de_vencimiento = Convert.ToDateTime(row["fecha_de_emision"].ToString());

                            invoice.moneda = Convert.ToInt32(row["moneda"].ToString());
                            invoice.tipo_de_cambio = row["tipo_de_cambio"].ToString();
                            invoice.porcentaje_de_igv = Convert.ToDouble(row["porcentaje_de_igv"].ToString());
                            invoice.descuento_global = row["descuento_global"].ToString();
                            invoice.total_descuento = row["total_descuento"].ToString();
                            invoice.total_anticipo = row["total_anticipo"].ToString();
                            invoice.total_gravada = row["total_gravada"].ToString();
                            invoice.total_inafecta = row["total_inafecta"].ToString();

                            invoice.total_exonerada = row["total_exonerada"].ToString();
                            invoice.total_igv = Convert.ToDouble(row["total_igv"].ToString());
                            invoice.total_gratuita = row["total_gratuita"].ToString();
                            invoice.total_otros_cargos = row["total_otros_cargos"].ToString();
                            invoice.total = Convert.ToDouble(row["total"].ToString());
                            invoice.percepcion_tipo = row["percepcion_tipo"].ToString();
                            invoice.percepcion_base_imponible = row["percepcion_base_imponible"].ToString();
                            invoice.total_percepcion = row["total_percepcion"].ToString();
                            invoice.detraccion = (row["detraccion"].ToString() == "true") ? true : false;

                            invoice.observaciones = row["observaciones"].ToString();
                            invoice.documento_que_se_modifica_tipo = row["documento_que_se_modifica_tipo"].ToString();
                            invoice.documento_que_se_modifica_serie = row["documento_que_se_modifica_serie"].ToString();
                            invoice.documento_que_se_modifica_numero = row["documento_que_se_modifica_numero"].ToString();
                            invoice.tipo_de_nota_de_credito = row["tipo_de_nota_de_credito"].ToString();
                            invoice.tipo_de_nota_de_debito = row["tipo_de_nota_de_debito"].ToString();
                            invoice.enviar_automaticamente_a_la_sunat = (row["enviar_automaticamente_a_la_sunat"].ToString() == "true") ? true : false;
                            invoice.enviar_automaticamente_al_cliente = (row["enviar_automaticamente_al_cliente"].ToString() == "true") ? true : false;

                            invoice.codigo_unico = row["codigo_unico"].ToString();
                            invoice.condiciones_de_pago = row["condiciones_de_pago"].ToString();
                            invoice.medio_de_pago = row["medio_de_pago"].ToString();
                            invoice.placa_vehiculo = row["placa_vehiculo"].ToString();
                            invoice.orden_compra_servicio = row["orden_compra_servicio"].ToString();
                            invoice.tabla_personalizada_codigo = row["tabla_personalizada_codigo"].ToString();
                            invoice.formato_de_pdf = "";

                            idCabecera = Convert.ToInt32(row["id_Factura_Cab"]);

                            foreach (DataRow fila in dt_comprobantes.Rows)
                            {
                                Items obj_entidad = new Items();

                                if (idCabecera == Convert.ToInt32(row["id_Factura_Cab"]))
                                {
                                    obj_entidad.unidad_de_medida = fila["unidad_de_medida"].ToString();
                                    obj_entidad.codigo = fila["codigo"].ToString();
                                    obj_entidad.descripcion = fila["descripcion"].ToString();
                                    obj_entidad.cantidad = Convert.ToDouble(fila["cantidad"].ToString());
                                    obj_entidad.valor_unitario = Convert.ToDouble(fila["valor_unitario"].ToString());
                                    obj_entidad.precio_unitario = Convert.ToDouble(fila["precio_unitario"].ToString());

                                    obj_entidad.descuento = fila["descuento"].ToString();
                                    obj_entidad.subtotal = Convert.ToDouble(fila["subtotal"].ToString());
                                    obj_entidad.tipo_de_igv = Convert.ToInt32(fila["tipo_de_igv"].ToString());
                                    obj_entidad.igv = Convert.ToDouble(fila["igv"].ToString());
                                    obj_entidad.total = Convert.ToDouble(fila["total_det"].ToString());

                                    obj_entidad.anticipo_regularizacion = (fila["anticipo_regularizacion"].ToString() == "true") ? true : false;
                                    obj_entidad.anticipo_comprobante_serie = fila["anticipo_comprobante_serie"].ToString();
                                    obj_entidad.anticipo_comprobante_numero = fila["anticipo_comprobante_numero"].ToString();

                                    list_Detalle.Add(obj_entidad);
                                }
                            }
                            invoice.items = list_Detalle;
                        }
                    }


                    ///--------------------------
                    ///----generado el json-----
                    ///--------------------------

                    string json = JsonConvert.SerializeObject(invoice, Formatting.Indented);
                    Console.WriteLine(json);
                    byte[] bytes = Encoding.Default.GetBytes(json);
                    string json_en_utf_8 = Encoding.UTF8.GetString(bytes);


                    ///----------------------------------------
                    ///---- Enviando  el json a nubeFact -----
                    ///-------------------------- ------------

                    string json_de_respuesta = nubeFact.SendJson(ruta, json_en_utf_8, token);
                    dynamic r = JsonConvert.DeserializeObject<Respuesta>(json_de_respuesta);
                    string r2 = JsonConvert.SerializeObject(r, Formatting.Indented);
                    dynamic json_r_in = JsonConvert.DeserializeObject<Respuesta>(r2);

                    ///----------------------------------------
                    ///---- Respuesta nubeFact ----------------
                    ///-------------------------- ------------

                    dynamic leer_respuesta = JsonConvert.DeserializeObject<Respuesta>(json_de_respuesta);
                    if (leer_respuesta.errors == null)
                    { 
                        if (String.IsNullOrEmpty(leer_respuesta.codigo_de_barras) == true)
                        {
                            if (String.IsNullOrEmpty(leer_respuesta.codigo_hash) == false)
                            {
                                byte[] obj_codQR = GeneraCodigoQR(leer_respuesta.codigo_hash);
                                using (FileStream Writer = new System.IO.FileStream(rutaQR + ".gif", FileMode.Create, FileAccess.Write))
                                {
                                    Writer.Write(obj_codQR, 0, obj_codQR.Length);
                                }
                                Set_actualizando_Facturacion_Electronica(idNotaCredito, 2, TipoDocNotaCredito + "_" + nroDocumentoNotaCredito + ".xml", idNotaCredito + ".gif");
                            }
                        }
                        else
                        {
                            byte[] obj_codQR = GeneraCodigoQR(leer_respuesta.codigo_de_barras);
                            using (FileStream Writer = new System.IO.FileStream(rutaQR + ".gif", FileMode.Create, FileAccess.Write))
                            {
                                Writer.Write(obj_codQR, 0, obj_codQR.Length);
                            }
                            Set_actualizando_Facturacion_Electronica(idNotaCredito, 2, TipoDocNotaCredito + "_" + nroDocumentoNotaCredito + ".xml", idNotaCredito + ".gif");
                        }

                    }
                    else
                    {
                        Set_Log_Alertas(idNotaCredito, leer_respuesta.errors.Replace("\n", string.Empty));
                    }
 
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public DataTable get_detalleDocumento_notasCreditoDebito(int idNotaCredito, int id_facturaRef, int id_tipoOperacion)
        {
            try
            {
                DataTable obj_List = new DataTable();
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_NUBE_FACT_JSON_NOTAS_CREDITO_DEBITO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idNotaCredito", SqlDbType.Int).Value = idNotaCredito;
                        cmd.Parameters.Add("@id_facturaRef", SqlDbType.Int).Value = id_facturaRef;
                        cmd.Parameters.Add("@id_tipoOperacion", SqlDbType.Int).Value = id_tipoOperacion;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            obj_List = dt_detalle;
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
               
        public object get_GenerandoFacturacion_masiva( int idUsuario)
        {
            Resul res = new Resul();

            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_ARCHIVOS_MASIVOS_DOCUMENTOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Usuario", SqlDbType.Int).Value = idUsuario;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            foreach (DataRow row in dt_detalle.Rows)
                            {

                                int idFactura = Convert.ToInt32(row["id_Factura_Cab"].ToString());
                                int idTipoDoc = Convert.ToInt32(row["id_TipoDocumento"].ToString());
                                string nroDoc = row["Numero_Documento"].ToString();
                                int tipo_facturacion = Convert.ToInt32(row["flag_tipo_facturacion"].ToString());
                                int id_Anexo = Convert.ToInt32(row["id_Anexo"].ToString());

                                if (string.IsNullOrEmpty(id_Anexo.ToString()) == false)
                                {
                                    try
                                    {
                                        GenerarComprobanteElectronico_nubeFact(idFactura, idTipoDoc, nroDoc, tipo_facturacion, id_Anexo);
                                    }
                                    catch (Exception)
                                    {
                                        continue;
                                    }
                                }             
                            }
                        }                   

                        res.ok = true;
                        res.data = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                res.ok = false;
                res.data = e.Message;
            }
            return res;
        }
        
        public object ExportarExcel_resumenProductos(int id_local, int id_almacen, string fecha_ini, string fecha_fin, string nrodoc, int id_Anexos, int id_transportista)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_NOTAS_CREDITO_DEBITO_RESUME_PRODUCTO_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fecha_fin;
                        cmd.Parameters.Add("@nrodoc", SqlDbType.VarChar).Value = nrodoc;
                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count <= 0)
                            {
                                res.ok = false;
                                res.data = "0|No hay informacion disponible";
                            }
                            else
                            {
                                res.ok = true;
                                res.data = GenerarArchivoExcel_resumenProductos(dt_detalle, fecha_ini, fecha_fin);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }
               
        public string GenerarArchivoExcel_resumenProductos(DataTable dt_detalles, string fecha_ini, string fecha_fin)
        {
            string Res = "";
            string _servidor;
 
            int _fila = 7;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
                _servidor = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/resumenProductos" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "resumenProductos" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("resumenProductos");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));


                    oWs.Cells[1, 7].Value = "Fecha y Hora de Reporte : " + dt_detalles.Rows[0]["fechaHoraReporte"].ToString();



                    oWs.Cells[2, 1, 2, 4].Merge = true;  // combinar celdaS dt
                    oWs.Cells[2, 1].Value = dt_detalles.Rows[0]["tituloReporte"].ToString();
                    oWs.Cells[2, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[2, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[2, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[2, 1].Style.Font.Bold = true; //Letra negrita


                    oWs.Cells[4, 2].Value = "Del " + fecha_ini + " al " + fecha_fin;
                    oWs.Cells[4, 2].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[4, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[4, 2].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;


                    for (int i = 1; i <= 4; i++)
                    {
                        oWs.Cells[6, i].Style.Border.BorderAround(Excel.Style.ExcelBorderStyle.Thin);
                    }

                    oWs.Cells[6, 1].Value = "Codigo";
                    oWs.Cells[6, 2].Value = "Descripcion ";
                    oWs.Cells[6, 3].Value = "Cantidad de Venta ";
                    oWs.Cells[6, 4].Value = "Cantidad Equivalente ";                    

 
                    foreach (DataRow oBj in dt_detalles.Rows)
                    { 
                        oWs.Cells[_fila, 1].Value = oBj["codigo"].ToString();
                        oWs.Cells[_fila, 2].Value = oBj["descripcion"].ToString();
                        oWs.Cells[_fila, 3].Value = oBj["cantidadVenta"].ToString();
                        oWs.Cells[_fila, 4].Value = oBj["cantidadEquivalente"].ToString();         

                        _fila++;
                    }

                    oWs.Row(6).Style.Font.Bold = true;
                    oWs.Row(6).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(6).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 4; k++)
                    {
                        oWs.Column(k).AutoFit();
                    }
                    oEx.Save();
                }
                Res = FileExcel;
            }
            catch (Exception )
            {
                throw;
            }
            return Res;
        }

        public List<Pedidos_E> Listando_Pedidos_ID(int id_pedido )
        {
            try
            {
                List<Pedidos_E> obj_List = new List<Pedidos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_PEDIDOS_LISTADO_ID", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_pedido", SqlDbType.Int).Value = id_pedido;
 
                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_E Entidad = new Pedidos_E();

                                Entidad.id_Pedido_Cab = Convert.ToInt32(row["id_Pedido_Cab"].ToString());

                                Entidad.id_empresa = Convert.ToInt32(row["id_empresa"].ToString());
                                Entidad.id_Local = Convert.ToInt32(row["id_Local"].ToString());
                                Entidad.Numero_Pedido = row["Numero_Pedido"].ToString();
                                Entidad.id_cliente = Convert.ToInt32(row["id_cliente"].ToString());
                                Entidad.codigoInterno_Suministro = row["codigoInterno_Suministro"].ToString();

                                Entidad.nroDoc_Cliente = row["nroDoc_Cliente"].ToString();
                                Entidad.nombres_Cliente = row["nombres_Cliente"].ToString();

                                Entidad.id_Almacen = Convert.ToInt32(row["id_Almacen"].ToString());
                                Entidad.descripcion_Almacen = row["descripcion_Almacen"].ToString();
                                Entidad.id_TipoDocumento = Convert.ToInt32(row["id_TipoDocumento"].ToString());
                                Entidad.Descripcion_TipoDocumento = row["Descripcion_TipoDocumento"].ToString();

                                Entidad.id_PuntoVenta = Convert.ToInt32(row["id_PuntoVenta"].ToString());
                                Entidad.descripcion_PuntoVenta = row["descripcion_PuntoVenta"].ToString();
                                Entidad.id_cuadrilla = row["id_cuadrilla"].ToString();
                                Entidad.id_PersonalVendedor = Convert.ToInt32(row["id_PersonalVendedor"].ToString());
                                Entidad.personal = row["personal"].ToString();

                                Entidad.id_FormaPago = Convert.ToInt32(row["id_FormaPago"].ToString());
                                Entidad.condicionFacturacion = row["condicionFacturacion"].ToString();
                                Entidad.id_moneda = row["id_moneda"].ToString();
                                Entidad.fechaEmision_Pedido_Cab = row["fechaEmision_Pedido_Cab"].ToString();

                                Entidad.tipoCambio_Pedido_Cab = row["tipoCambio_Pedido_Cab"].ToString();
                                Entidad.codigoInterno_Cliente = row["codigoInterno_Cliente"].ToString();
                                Entidad.cliente = row["cliente"].ToString();
                                Entidad.direccion_Pedido_Cab = row["direccion_Pedido_Cab"].ToString();

                                Entidad.fechaEntrega_Pedido_Cab = row["fechaEntrega_Pedido_Cab"].ToString();
                                Entidad.porcentajeIGV_Pedido_Cab = row["porcentajeIGV_Pedido_Cab"].ToString();
                                Entidad.imprimeGuiaRemision_Pedido_Cab = row["imprimeGuiaRemision_Pedido_Cab"].ToString();
                                Entidad.observaciones_Pedido_Cab = row["observaciones_Pedido_Cab"].ToString();
                                Entidad.estado = Convert.ToInt32(row["estado"].ToString());

                                Entidad.usuario_creacion = Convert.ToInt32(row["usuario_creacion"].ToString());
                                Entidad.Sub_Total_Pedido_Cab = Convert.ToDecimal(row["Sub_Total_Pedido_Cab"].ToString());
                                Entidad.total_Igv_Pedido_Cab = Convert.ToDecimal(row["total_Igv_Pedido_Cab"].ToString());
                                Entidad.total_Neto_Pedido_Cab = Convert.ToDecimal(row["total_Neto_Pedido_Cab"].ToString());

                                Entidad.Numero_Documento = row["Numero_Documento"].ToString();
                                Entidad.fechaFactura_Pedido_Cab = row["fechaFactura_Pedido_Cab"].ToString();
                                Entidad.flag_cancelacion = row["flag_cancelacion"].ToString();
                                Entidad.TipoGuiaRemision = row["TipoGuiaRemision"].ToString();
                                Entidad.flag_exonerada_igv = row["flag_exonerada_igv"].ToString();
                                Entidad.flag_tipo_facturacion = row["flag_tipo_facturacion"].ToString();
                                Entidad.id_CanalNegocio = row["id_CanalNegocio"].ToString();
                                Entidad.id_Anexos = row["id_Anexos"].ToString();
                                Entidad.id_ZonaVta = row["id_ZonaVta"].ToString();
                                Entidad.id_PersonalTransportista = row["id_PersonalTransportista"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        
        public string Set_anular_Pedido(  int id_Pedido_Cab, int id_usuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REVISION_PEDIDO_ANULAR_PEDIDO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Pedido_Cab", SqlDbType.Int).Value = id_Pedido_Cab;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }

        public object get_verificarNumeracionDocumentos(int id_Anexos, int id_TipoDocumento, string Numero_Documento)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_PEDIDOS_VERIFICACION_NUMERACION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;
                        cmd.Parameters.Add("@id_TipoDocumento", SqlDbType.Int).Value = id_TipoDocumento;
                        cmd.Parameters.Add("@Numero_Documento", SqlDbType.VarChar).Value = Numero_Documento;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }

                        res.ok = true;
                        res.data = dt_detalle;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object Set_GenerandoFacturacion_Manual(int idPedido, int id_usuario, int tipo_facturacion)
        {
            string nroDoc = "";
            Resul res = new Resul();

            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_PEDIDOS_INSERT_FACTURAS_MANUAL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Pedido", SqlDbType.Int).Value = idPedido;
                        cmd.Parameters.Add("@Usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.ExecuteNonQuery(); 

                        res.ok = true;
                        res.data = nroDoc;
                    }
                }
            }
            catch (Exception e)
            {
                res.ok = false;
                res.data = e.Message;
            }
            return res;
        }
        
        public List<Pedidos_E> Search_Ayuda_Producto_normal(string consulta_producto, int idUsuario)
        {
            try
            {
                List<Pedidos_E> obj_List = new List<Pedidos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_PROMOCIONES_BUSCAR_PRODUCTO_AYUDA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@consulta_producto", consulta_producto);
                        cmd.ExecuteNonQuery();

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_E Entidad = new Pedidos_E();
                                Entidad.id_producto = Convert.ToInt32(row["id"].ToString());
                                Entidad.codigoInterno = row["codigo"].ToString();
                                Entidad.descripcion_producto = row["descripcion"].ToString();
                                Entidad.Id_Unidad = row["id_um"].ToString();
                                Entidad.unidadMedida = row["descripcion_um"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }
                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public List<Pedidos_E> Search_Producto_manual(int id_Almacen, string cod_producto, int id_usuario)
        {
            try
            {
                List<Pedidos_E> obj_List = new List<Pedidos_E>();
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_STOCK_SEARCH_MANUAL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Almacen", SqlDbType.Int).Value = id_Almacen;
                        cmd.Parameters.Add("@Cod_producto", SqlDbType.VarChar).Value = cod_producto;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_E Entidad = new Pedidos_E();

                                Entidad.id_producto = Convert.ToInt32(row["id_producto"].ToString());
                                Entidad.descripcion_producto = row["descripcion_producto"].ToString();
                                Entidad.codigoInterno = row["codigoInterno"].ToString();
                                Entidad.precioventa_listaprecios = Convert.ToDecimal(row["precioventa_listaprecios"].ToString());
                                Entidad.aplicaDescuento = Convert.ToDecimal(row["aplicaDescuento"].ToString());
                                Entidad.porceDescuento = Convert.ToDecimal(row["porceDescuento"].ToString());
                                Entidad.Stock = Convert.ToDecimal(row["Stock"].ToString());
                                Entidad.unidadMedida = row["unidadMedida"].ToString();
                                Entidad.nombre_marcaproducto = row["nombre_marcaproducto"].ToString();
                                Entidad.movLote = row["movLote"].ToString();
                                Entidad.nroLote = row["nroLote"].ToString();
                                Entidad.Id_Unidad = row["Id_Unidad"].ToString();
                                Entidad.factorVenta = row["factorVenta"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }
                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public List<Pedidos_E> Search_Ayuda_Producto_manual(int id_Almacen, string cod_producto, int idUsuario)
        {
            try
            {
                List<Pedidos_E> obj_List = new List<Pedidos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_STOCK_SEARCH_HELP_MANUAL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@id_Almacen", id_Almacen);
                        cmd.Parameters.AddWithValue("@cod_producto", cod_producto);
                        cmd.Parameters.AddWithValue("@id_usuario", idUsuario);
                        cmd.ExecuteNonQuery();

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_E Entidad = new Pedidos_E();

                                Entidad.id_producto = Convert.ToInt32(row["id_producto"].ToString());
                                Entidad.descripcion_producto = row["descripcion_producto"].ToString();
                                Entidad.codigoInterno = row["codigoInterno"].ToString();
                                Entidad.precioventa_listaprecios = Convert.ToDecimal(row["precioventa_listaprecios"].ToString());
                                Entidad.aplicaDescuento = Convert.ToDecimal(row["aplicaDescuento"].ToString());
                                Entidad.porceDescuento = Convert.ToDecimal(row["porceDescuento"].ToString());
                                Entidad.Stock = Convert.ToDecimal(row["Stock"].ToString());
                                Entidad.unidadMedida = row["unidadMedida"].ToString();
                                Entidad.nombre_marcaproducto = row["nombre_marcaproducto"].ToString();
                                Entidad.movLote = row["movLote"].ToString();
                                Entidad.nroLote = row["nroLote"].ToString();

                                Entidad.Id_Unidad = row["Id_Unidad"].ToString();
                                Entidad.factorVenta = row["factorVenta"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }
                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        
        public object get_verificarNroOperacion(int id_banco, string nroOperacion,string fechaOperacion)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_PEDIDOS_VALIDAR_NRO_OPERACION_PAGOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idBanco", SqlDbType.Int).Value = id_banco;
                        cmd.Parameters.Add("@nroOperacion", SqlDbType.VarChar).Value = nroOperacion;
                        cmd.Parameters.Add("@fechaOperacion", SqlDbType.VarChar).Value = fechaOperacion;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }

                        res.ok = true;
                        res.data = dt_detalle;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }
        
        public string Set_Actualizar_imagenComprobante(int idPago, string nombreFile, string nombreFileServer)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_PEDIDOS_GRABAR_IMAGEN_PAGOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idPago", SqlDbType.Int).Value = idPago;
                        cmd.Parameters.Add("@nombreFile", SqlDbType.VarChar).Value = nombreFile;
                        cmd.Parameters.Add("@nombreFileServer", SqlDbType.VarChar).Value = nombreFileServer;

                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }


        public DataTable get_detalleDocumento_guiasRemision(int idFactura)
        {
            try
            {
                DataTable obj_List = new DataTable();
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_NUBE_FACT_JSON_GUIA_REMISION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFactura", SqlDbType.Int).Value = idFactura;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            obj_List = dt_detalle;
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public void Set_Log_Alertas_guiasRemision(int id_cabecera, string mensaje_error)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_FACTURACION_ELECTRONICA_GUIAS_LOG_ERROR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFactura", SqlDbType.Int).Value = id_cabecera;
                        cmd.Parameters.Add("@mensaje", SqlDbType.VarChar).Value = mensaje_error;

                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public void GenerarComprobanteElectronico_GuiaRemision_nubeFact(int idFactura, int TipoDoc, string nroDocumento, int id_Anexo)
        {
            try
            {

                string ruta = "";
                string token = "";

                ///----- obtener los token por Anexo ----
 
                tbl_Anexos anexo = db.tbl_Anexos.Find(id_Anexo);
                if (string.IsNullOrEmpty(anexo.RUTA.ToString()) == false)
                {
                    ruta = anexo.RUTA;
                    token = anexo.TOKEN;
                }
                else
                {
                    throw new Exception("No se configuro la ruta y el Token de envio al Api de Facturación..");
                }

                DataTable dt_comprobantes = new DataTable();
                dt_comprobantes = get_detalleDocumento_guiasRemision(idFactura);

                if (dt_comprobantes.Rows.Count == 0)
                {
                    throw new Exception("No hay informacion para armar Json.. SP_S_NUBE_FACT_JSON_GUIA_REMISION " + idFactura );
                }

                Guide guide = new Guide();
                List<ItemsGuide> list_Detalle = new List<ItemsGuide>();

                /// --- --  CREAMOS EL JSON-----
                foreach (DataRow row in dt_comprobantes.Rows)
                {
                        ///CREAMOS EL JSON

                        guide.operacion = row["operacion"].ToString();
                        guide.tipo_de_comprobante = Convert.ToInt32( row["tipo_de_comprobante"].ToString());
                        guide.serie = row["serie"].ToString();
                        guide.numero = Convert.ToInt32(row["numero"].ToString());
                        guide.cliente_tipo_de_documento = Convert.ToInt32(row["cliente_tipo_de_documento"].ToString());
                        guide.cliente_numero_de_documento =  row["cliente_numero_de_documento"].ToString();

                        guide.cliente_denominacion = row["cliente_denominacion"].ToString();
                        guide.cliente_direccion = row["cliente_direccion"].ToString();
                        guide.cliente_email = row["cliente_email"].ToString();
                        guide.cliente_email_1 = row["cliente_email_1"].ToString();
                        guide.cliente_email_2 = row["cliente_email_2"].ToString();
                        guide.fecha_de_emision = Convert.ToDateTime( row["fecha_de_emision"].ToString());
                        guide.observaciones = row["observaciones"].ToString();

                        guide.motivo_de_traslado = row["motivo_de_traslado"].ToString();
                        guide.peso_bruto_total = Convert.ToDecimal(row["peso_bruto_total"].ToString());
                        guide.numero_de_bultos = Convert.ToInt32(row["numero_de_bultos"].ToString());
                        guide.tipo_de_transporte = row["tipo_de_transporte"].ToString();
                        guide.fecha_de_inicio_de_traslado = Convert.ToDateTime(row["fecha_de_inicio_de_traslado"].ToString());
                        guide.transportista_documento_tipo = Convert.ToInt32(row["transportista_documento_tipo"].ToString());
                        guide.transportista_documento_numero = row["transportista_documento_numero"].ToString();

                        guide.transportista_denominacion = row["transportista_denominacion"].ToString();
                        guide.transportista_placa_numero = row["transportista_placa_numero"].ToString();
                        guide.conductor_documento_tipo = Convert.ToInt32(row["conductor_documento_tipo"].ToString());
                        guide.conductor_documento_numero = row["conductor_documento_numero"].ToString();
                        guide.conductor_denominacion = row["conductor_denominacion"].ToString();
                        guide.punto_de_partida_ubigeo = row["punto_de_partida_ubigeo"].ToString();
                        guide.punto_de_partida_direccion = row["punto_de_partida_direccion"].ToString();
                        guide.punto_de_llegada_ubigeo = row["punto_de_llegada_ubigeo"].ToString();
                        guide.punto_de_llegada_direccion = row["punto_de_llegada_direccion"].ToString();
                        guide.enviar_automaticamente_a_la_sunat = (row["enviar_automaticamente_a_la_sunat"].ToString() == "true") ? true : false;
                        guide.enviar_automaticamente_al_cliente = (row["enviar_automaticamente_al_cliente"].ToString() == "true") ? true : false;
                        guide.codigo_unico = row["codigo_unico"].ToString();
                        guide.formato_de_pdf = row["formato_de_pdf"].ToString();
 
                        foreach (DataRow fila in dt_comprobantes.Rows)
                        {
                            ItemsGuide obj_entidad = new ItemsGuide();
                                    
                            obj_entidad.unidad_de_medida = fila["unidad_de_medida"].ToString();
                            obj_entidad.codigo = fila["codigo"].ToString();
                            obj_entidad.descripcion = fila["descripcion"].ToString();
                            obj_entidad.cantidad = Convert.ToDouble(fila["cantidad"].ToString());
                            list_Detalle.Add(obj_entidad);                      
                        }
                        guide.items = list_Detalle;
                        break;            
                }


                ///--------------------------
                ///----generado el json-----
                ///--------------------------

                string json = JsonConvert.SerializeObject(guide, Formatting.Indented);

                byte[] bytes = Encoding.Default.GetBytes(json);
                string json_en_utf_8 = Encoding.UTF8.GetString(bytes);


                ///----------------------------------------
                ///---- Enviando  el json a nubeFact -----
                ///-------------------------- ------------

                string json_de_respuesta = nubeFact.SendJson(ruta, json_en_utf_8, token);
                dynamic r = JsonConvert.DeserializeObject<RespuestaGuide>(json_de_respuesta);
                string r2 = JsonConvert.SerializeObject(r, Formatting.Indented);
                dynamic json_r_in = JsonConvert.DeserializeObject<RespuestaGuide>(r2);

                ///----------------------------------------
                ///---- Respuesta nubeFact ----------------
                ///-------------------------- ------------

                dynamic leer_respuesta = JsonConvert.DeserializeObject<RespuestaGuide>(json_de_respuesta);
                if (leer_respuesta.errors == null)
                {
                    //Console.WriteLine(json_r_in);
                    Set_actualizando_Facturacion_Electronica_Guia_Remision(idFactura, TipoDoc , nroDocumento, leer_respuesta.enlace_del_pdf, leer_respuesta.enlace_del_xml, leer_respuesta.enlace_del_cdr);      
                }
                else
                {
                    Set_Log_Alertas_guiasRemision(idFactura, leer_respuesta.errors.Replace("\n", string.Empty));
                }

            }
            catch (Exception ex)
            {
                throw new Exception("Error Guia Remision:" + ex.Message ); 
            }
        }


        public void Set_actualizando_Facturacion_Electronica_Guia_Remision(int idFactura, int TipoDoc , string nroDocumento,string  pdf, string xml, string cdr)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_FACTURACION_ELECTRONICA_GUIAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFactura", SqlDbType.Int).Value = idFactura;
                        cmd.Parameters.Add("@tipoDoc", SqlDbType.Int).Value = TipoDoc;
                        cmd.Parameters.Add("@nroDocumento", SqlDbType.VarChar).Value = nroDocumento;

                        cmd.Parameters.Add("@pdf", SqlDbType.VarChar).Value = pdf;
                        cmd.Parameters.Add("@xml", SqlDbType.VarChar).Value = xml;
                        cmd.Parameters.Add("@cdr", SqlDbType.VarChar).Value = (cdr == null) ? "" : cdr;
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }


        /// <summary>
        /// /- CONSOLIDADO --- GUIAS DE REMISION  
        /// <returns></returns>

        public object Set_Generando_guiaRemisionConsolidado(string fechaIni, string fechaFin, int id_zona, int id_transportista, int idUsuario)
        {
            int id_GuiaCab = 0;
            Resul res = new Resul();

            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_CONSOLIDADO_MERCADERIA_INSERT_GUIA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = fechaFin;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        cmd.Parameters.Add("@id_GuiaCab", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        id_GuiaCab = Convert.ToInt32(cmd.Parameters["@id_GuiaCab"].Value.ToString());


                        //-- obteniendo los datos de la Guia ---------
                        tbl_Alm_Guias_Cab objGuiaRemision = db.tbl_Alm_Guias_Cab.Where(g => g.id_GuiaCab == id_GuiaCab).SingleOrDefault();

                        if (objGuiaRemision != null)
                        {
                            if (string.IsNullOrEmpty(objGuiaRemision.id_Anexo.ToString()) == false) /// 
                            {
                                int idAnexo = Convert.ToInt32(objGuiaRemision.id_Anexo.ToString());
                                GenerarComprobanteElectronico_otrosModulos_GuiaRemision_nubeFact(id_GuiaCab, idAnexo);

                                res.ok = true;
                                res.data = id_GuiaCab;
                            }
                            else {
                                res.ok = false;
                                res.data = "No se encuentra  el id_Anexo en la tabla tbl_Alm_Guias_Cab para enviar a NubeFact  idGuia : " + id_GuiaCab;
                            }
                        }
                        else
                        {
                            res.ok = false;
                            res.data = "No se encuentra el documento en la tabla tbl_Alm_Guias_Cab para Generar y enviar el Comprobante";
                        }


                    }
                }
            }
            catch (Exception e)
            {
                res.ok = false;
                res.data = e.Message;
            }
            return res;
        }

        public void GenerarComprobanteElectronico_otrosModulos_GuiaRemision_nubeFact(int id_GuiaCab, int id_Anexo)
        {
            try
            {
                string ruta = "";
                string token = "";

                ///----- obtener los token por Anexo ----

                tbl_Anexos anexo = db.tbl_Anexos.Find(id_Anexo);
                if (string.IsNullOrEmpty(anexo.RUTA.ToString()) == false)
                {
                    ruta = anexo.RUTA;
                    token = anexo.TOKEN;
                }
                else
                {
                    throw new Exception("No se configuro la ruta y el Token de envio de la Guia de Remision..");
                }

                DataTable dt_comprobantes = new DataTable();
                dt_comprobantes = get_detalleDocumento_otrosModulos_guiasRemision(id_GuiaCab);

                if (dt_comprobantes.Rows.Count == 0)
                {
                    throw new Exception("No hay informacion para armar Json.. SP_S_NUBE_FACT_JSON_OTROS_MODULOS_GUIA_REMISION  idGuia : " + id_GuiaCab);
                }

                Guide guide = new Guide();
                List<ItemsGuide> list_Detalle = new List<ItemsGuide>();

                /// --- --  CREAMOS EL JSON-----
                foreach (DataRow row in dt_comprobantes.Rows)
                {
                    ///CREAMOS EL JSON

                    guide.operacion = row["operacion"].ToString();
                    guide.tipo_de_comprobante = Convert.ToInt32(row["tipo_de_comprobante"].ToString());
                    guide.serie = row["serie"].ToString();
                    guide.numero = Convert.ToInt32(row["numero"].ToString());
                    guide.cliente_tipo_de_documento = Convert.ToInt32(row["cliente_tipo_de_documento"].ToString());
                    guide.cliente_numero_de_documento = row["cliente_numero_de_documento"].ToString();

                    guide.cliente_denominacion = row["cliente_denominacion"].ToString();
                    guide.cliente_direccion = row["cliente_direccion"].ToString();
                    guide.cliente_email = row["cliente_email"].ToString();
                    guide.cliente_email_1 = row["cliente_email_1"].ToString();
                    guide.cliente_email_2 = row["cliente_email_2"].ToString();
                    guide.fecha_de_emision = Convert.ToDateTime(row["fecha_de_emision"].ToString());
                    guide.observaciones = row["observaciones"].ToString();

                    guide.motivo_de_traslado = row["motivo_de_traslado"].ToString();
                    guide.peso_bruto_total = Convert.ToDecimal(row["peso_bruto_total"].ToString());
                    guide.numero_de_bultos = Convert.ToInt32(row["numero_de_bultos"].ToString());
                    guide.tipo_de_transporte = row["tipo_de_transporte"].ToString();
                    guide.fecha_de_inicio_de_traslado = Convert.ToDateTime(row["fecha_de_inicio_de_traslado"].ToString());
                    guide.transportista_documento_tipo = Convert.ToInt32(row["transportista_documento_tipo"].ToString());
                    guide.transportista_documento_numero = row["transportista_documento_numero"].ToString();

                    guide.transportista_denominacion = row["transportista_denominacion"].ToString();
                    guide.transportista_placa_numero = row["transportista_placa_numero"].ToString();
                    guide.conductor_documento_tipo = Convert.ToInt32(row["conductor_documento_tipo"].ToString());
                    guide.conductor_documento_numero = row["conductor_documento_numero"].ToString();
                    guide.conductor_denominacion = row["conductor_denominacion"].ToString();
                    guide.punto_de_partida_ubigeo = row["punto_de_partida_ubigeo"].ToString();
                    guide.punto_de_partida_direccion = row["punto_de_partida_direccion"].ToString();
                    guide.punto_de_llegada_ubigeo = row["punto_de_llegada_ubigeo"].ToString();
                    guide.punto_de_llegada_direccion = row["punto_de_llegada_direccion"].ToString();
                    guide.enviar_automaticamente_a_la_sunat = (row["enviar_automaticamente_a_la_sunat"].ToString() == "true") ? true : false;
                    guide.enviar_automaticamente_al_cliente = (row["enviar_automaticamente_al_cliente"].ToString() == "true") ? true : false;
                    guide.codigo_unico = row["codigo_unico"].ToString();
                    guide.formato_de_pdf = row["formato_de_pdf"].ToString();

                    foreach (DataRow fila in dt_comprobantes.Rows)
                    {
                        ItemsGuide obj_entidad = new ItemsGuide();

                        obj_entidad.unidad_de_medida = fila["unidad_de_medida"].ToString();
                        obj_entidad.codigo = fila["codigo"].ToString();
                        obj_entidad.descripcion = fila["descripcion"].ToString();
                        obj_entidad.cantidad = Convert.ToDouble(fila["cantidad"].ToString());
                        list_Detalle.Add(obj_entidad);
                    }
                    guide.items = list_Detalle;
                    break;
                }


                ///--------------------------
                ///----generado el json-----
                ///--------------------------

                string json = JsonConvert.SerializeObject(guide, Formatting.Indented);

                byte[] bytes = Encoding.Default.GetBytes(json);
                string json_en_utf_8 = Encoding.UTF8.GetString(bytes);


                ///----------------------------------------
                ///---- Enviando  el json a nubeFact -----
                ///-------------------------- ------------

                string json_de_respuesta = nubeFact.SendJson(ruta, json_en_utf_8, token);
                dynamic r = JsonConvert.DeserializeObject<RespuestaGuide>(json_de_respuesta);
                string r2 = JsonConvert.SerializeObject(r, Formatting.Indented);
                dynamic json_r_in = JsonConvert.DeserializeObject<RespuestaGuide>(r2);

                ///----------------------------------------
                ///---- Respuesta nubeFact ----------------
                ///-------------------------- ------------

                dynamic leer_respuesta = JsonConvert.DeserializeObject<RespuestaGuide>(json_de_respuesta);
                if (leer_respuesta.errors == null)
                {
                    Set_actualizando_otrosModulos_Guia_Remision(id_GuiaCab, leer_respuesta.enlace_del_pdf, leer_respuesta.enlace_del_xml, leer_respuesta.enlace_del_cdr);
                }
                else
                {
                    Set_Log_Alertas_otrosModulos_guiasRemision(id_GuiaCab, leer_respuesta.errors.Replace("\n", string.Empty));
                }

            }
            catch (Exception ex)
            {
                throw new Exception("Error Guia Remision:" + ex.Message);
            }
        }

        public DataTable get_detalleDocumento_otrosModulos_guiasRemision(int id_GuiaCab)
        {
            try
            {
                DataTable obj_List = new DataTable();
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_NUBE_FACT_JSON_OTROS_MODULOS_GUIA_REMISION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idGuiaCab", SqlDbType.Int).Value = id_GuiaCab;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            obj_List = dt_detalle;
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public void Set_actualizando_otrosModulos_Guia_Remision(int idGuia, string pdf, string xml, string cdr)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_FACTURACION_ELECTRONICA_OTROS_MODULOS_GUIAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idGuia", SqlDbType.Int).Value = idGuia;
                        cmd.Parameters.Add("@pdf", SqlDbType.VarChar).Value = pdf;
                        cmd.Parameters.Add("@xml", SqlDbType.VarChar).Value = xml;
                        cmd.Parameters.Add("@cdr", SqlDbType.VarChar).Value = (cdr == null) ? "" : cdr;
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void Set_Log_Alertas_otrosModulos_guiasRemision(int id_GuiaCab, string mensaje_error)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_FACTURACION_ELECTRONICA_OTROS_MODULOS_GUIAS_LOG_ERROR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idGuia", SqlDbType.Int).Value = id_GuiaCab;
                        cmd.Parameters.Add("@mensaje", SqlDbType.VarChar).Value = mensaje_error;

                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
 

        public bool consultandoEstadoDocumentoSunat(int id_factura, int id_Anexo, int id_TipoDocumento ,string serie_doc, string numero_doc)
        {
            bool resultados = false;
            try
            {
                string ruta = "";
                string token = "";
                ///----- obtener los token por Anexo ----
                tbl_Anexos anexo = db.tbl_Anexos.Find(id_Anexo);
                if (string.IsNullOrEmpty(anexo.RUTA.ToString()) == false)
                {
                    ruta = anexo.RUTA;
                    token = anexo.TOKEN;
                }
                else
                {
                    throw new Exception("No se configuro la ruta y el Token de envio al Api de Facturación..");
                }

                Consultation invoice = new Consultation();
                /// --- --  CREAMOS EL JSON-----

                ///CREAMOS EL JSON
                invoice.operacion = "consultar_comprobante";
                invoice.tipo_de_comprobante = Convert.ToInt32(id_TipoDocumento);
                invoice.serie = serie_doc;
                invoice.numero = numero_doc;

                ///--------------------------
                ///----generado el json-----
                ///--------------------------

                string json = JsonConvert.SerializeObject(invoice, Formatting.Indented);
                byte[] bytes = Encoding.Default.GetBytes(json);
                string json_en_utf_8 = Encoding.UTF8.GetString(bytes);

                ///----------------------------------------
                ///---- Enviando  el json a nubeFact -----
                ///-------------------------- ------------

                string json_de_respuesta = nubeFact.SendJson(ruta, json_en_utf_8, token);
                dynamic r = JsonConvert.DeserializeObject<Respuesta>(json_de_respuesta);
                string r2 = JsonConvert.SerializeObject(r, Formatting.Indented);
                dynamic json_r_in = JsonConvert.DeserializeObject<Respuesta>(r2);

                ///----------------------------------------
                ///---- Respuesta nubeFact ----------------
                ///-------------------------- ------------

                dynamic leer_respuesta = JsonConvert.DeserializeObject<Respuesta>(json_de_respuesta);
                if (leer_respuesta.errors == null)
                {
                    if ( leer_respuesta.aceptada_por_sunat == true )
                    {
                        set_respuesta_sunatConsultas(id_factura, 1, (leer_respuesta.sunat_description==null)? "" : leer_respuesta.sunat_description);
                        resultados = true;
                    }
                    else
                    {
                        set_respuesta_sunatConsultas(id_factura , 0, leer_respuesta.sunat_description == null ? "El Documento aun no sido Aceptada por la Sunat para generar Notas Credito" : leer_respuesta.sunat_description);
                        resultados = false;
                    }
                }
                else
                {
                    Set_Log_Alertas(id_factura, leer_respuesta.errors.Replace("\n", string.Empty));
                }
            }
            catch (Exception)
            {
                throw;
            }
            return resultados;
        }

        public void set_respuesta_sunatConsultas(int id_cabecera, int flagSunat , string mensaje_error)
        {
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_FACTURACION_ELECTRONICA_CONS_NOTAS_CREDITO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_cabecera", SqlDbType.Int).Value = id_cabecera;
                        cmd.Parameters.Add("@flagSunat", SqlDbType.Int).Value = flagSunat;
                        cmd.Parameters.Add("@mensaje", SqlDbType.VarChar).Value = mensaje_error ;

                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DataTable get_unidadMedidaFactor(int id_usuario, int id_material)
        {
            try
            {
                DataTable obj_List = new DataTable();
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_UNIDAD_MEDIDA_FACTOR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.Parameters.Add("@id_material", SqlDbType.Int).Value = id_material;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            obj_List = dt_detalle;
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }



        public DataTable get_detalle_boletasFacturas(int id_facturaCab)
        {
            try
            {
                DataTable obj_List = new DataTable();
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_NOTAS_CREDITO_DETALLE_DOC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idFactura", SqlDbType.Int).Value = id_facturaCab;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            obj_List = dt_detalle;
                        }
                    }
                }

                return obj_List;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


    }
}
