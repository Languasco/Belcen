using Entidades;
using Entidades.Facturacion.Procesos;
using Negocio.Conexion;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Facturacion.Procesos
{
    public class DocumentoVenta_BL
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();
        
        SqlCommand cmd = null;

        public List<DocumentoVenta_E> Listando_DocumentosVentas(int id_puntoVenta, int id_vendedor, int id_docVenta, int id_estado)
        {
            try
            {
                List<DocumentoVenta_E> obj_List = new List<DocumentoVenta_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_DOCUMENTO_VENTA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_puntoVenta", SqlDbType.Int).Value = id_puntoVenta;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;
                        cmd.Parameters.Add("@id_docVenta", SqlDbType.Int).Value = id_docVenta;
                        cmd.Parameters.Add("@id_estado", SqlDbType.Int).Value = id_estado;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                DocumentoVenta_E Entidad = new DocumentoVenta_E();
                                
                                if (string.IsNullOrEmpty(row["Numero_Documento"].ToString()) == true)
                                {
                                    Entidad.disabled = false;
                                    Entidad.Classdisabled = "";                                    
                                }
                                else {
                                    Entidad.disabled = true;
                                    Entidad.Classdisabled = "disabled";
                                }                 

                                Entidad.checkeado = false;                                
                                Entidad.id_Pedido_Cab = Convert.ToInt32(row["id_Pedido_Cab"].ToString());
                                Entidad.id_empresa = Convert.ToInt32(row["id_empresa"].ToString());
                                Entidad.Numero_Pedido = row["Numero_Pedido"].ToString();
                                Entidad.id_Almacen = Convert.ToInt32(row["id_Almacen"].ToString());
                                Entidad.id_TipoDocumento = Convert.ToInt32(row["id_TipoDocumento"].ToString());
                                Entidad.id_PuntoVenta = Convert.ToInt32(row["id_PuntoVenta"].ToString());

                                Entidad.id_cuadrilla = Convert.ToInt32(row["id_cuadrilla"].ToString());
                                Entidad.id_PersonalVendedor = Convert.ToInt32(row["id_PersonalVendedor"].ToString());
                                Entidad.id_FormaPago = Convert.ToInt32(row["id_FormaPago"].ToString());
                                Entidad.id_moneda = Convert.ToInt32(row["id_moneda"].ToString());

                                Entidad.fechaEmision_Pedido_Cab = row["fechaEmision_Pedido_Cab"].ToString();
                                Entidad.tipoCambio_Pedido_Cab = Convert.ToDecimal(row["tipoCambio_Pedido_Cab"].ToString());
                                Entidad.id_cliente = Convert.ToInt32(row["id_cliente"].ToString());
                                Entidad.nombre_cliente = row["nombre_cliente"].ToString();

                                Entidad.nombredocumento = row["nombredocumento"].ToString();
                                Entidad.direccion_Pedido_Cab = row["direccion_Pedido_Cab"].ToString();
                                Entidad.fechaEntrega_Pedido_Cab = row["fechaEntrega_Pedido_Cab"].ToString();
                                Entidad.porcentajeIGV_Pedido_Cab = Convert.ToDecimal(row["porcentajeIGV_Pedido_Cab"].ToString());

                                Entidad.imprimeGuiaRemision_Pedido_Cab = row["imprimeGuiaRemision_Pedido_Cab"].ToString();
                                Entidad.observaciones_Pedido_Cab = row["observaciones_Pedido_Cab"].ToString();
                                Entidad.latitud_Pedido_Cab = row["latitud_Pedido_Cab"].ToString();
                                Entidad.longitud_Pedido_Cab = row["longitud_Pedido_Cab"].ToString(); 
                                Entidad.estado = Convert.ToInt32(row["estado"].ToString());

                                Entidad.usuario_creacion = Convert.ToInt32(row["usuario_creacion"].ToString());
                                Entidad.vendedor = row["vendedor"].ToString();
                                Entidad.Sub_Total_Pedido_Cab = Convert.ToDecimal (row["Sub_Total_Pedido_Cab"].ToString());
                                Entidad.total_Igv_Pedido_Cab = Convert.ToDecimal(row["total_Igv_Pedido_Cab"].ToString());
                                Entidad.total_Neto_Pedido_Cab = Convert.ToDecimal(row["total_Neto_Pedido_Cab"].ToString());

                                Entidad.Numero_Documento = row["Numero_Documento"].ToString(); 

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

        public List<Tbl_Fac_Pedidos_Cab> UpdateListaPedido(string listPedido, int id_usuario)
        {
            try
            {
                List<Tbl_Fac_Pedidos_Cab> ltsfacpedidos = new List<Tbl_Fac_Pedidos_Cab>();
                Tbl_Fac_Pedidos_Cab Res = new Tbl_Fac_Pedidos_Cab();

                string[] PedidoArray = listPedido.Split(',');

                foreach (string item in PedidoArray)
                {
                    int a = Convert.ToInt32(item);
                    var resultado = db.Tbl_Fac_Pedidos_Cab.Where(g => g.id_Pedido_Cab == a && g.estado == 7).FirstOrDefault<Tbl_Fac_Pedidos_Cab>();

                    if (resultado != null)
                    {
                        try
                        {

                            using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                            {
                                con.Open();
                                using (cmd = new SqlCommand("SP_S_DOCUMENTO_VENTA_GENERAR_FACTURA", con))
                                {
                                    cmd.CommandTimeout = 0;
                                    cmd.CommandType = CommandType.StoredProcedure;
                                    cmd.Parameters.Add("@id_pedido", SqlDbType.VarChar).Value = resultado.Numero_Pedido;
                                    cmd.Parameters.Add("@documento", SqlDbType.Int).Value = resultado.id_TipoDocumento;
                                    cmd.Parameters.Add("@estado", SqlDbType.Int).Value = resultado.estado;
                                    cmd.Parameters.Add("@numerodoc", SqlDbType.NVarChar).Value = resultado.id_Pedido_Cab.ToString();
                                    cmd.Parameters.Add("@Id_PuntoVenta", SqlDbType.Int).Value = resultado.id_PuntoVenta;
                                    cmd.Parameters.Add("@Id_TipoDocumento", SqlDbType.Int).Value = resultado.id_TipoDocumento;
                                    cmd.Parameters.Add("@Usuario", SqlDbType.Int).Value = id_usuario;

                                    DataTable dt_detalle = new DataTable();

                                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                                    {
                                        da.Fill(dt_detalle);
                                        foreach (DataRow row in dt_detalle.Rows)
                                        {
                                            Tbl_Fac_Pedidos_Cab ofacpedidos = new Tbl_Fac_Pedidos_Cab();
                                            ofacpedidos.id_Pedido_Cab = Convert.ToInt32(row["id_Pedido_Cab"].ToString());
                                            ofacpedidos.Numero_Documento = row["Numero_Documento"].ToString();
                                            ofacpedidos.estado = Convert.ToInt32(row["estado"]);
                                            ofacpedidos.Sub_Total_Pedido_Cab = Convert.ToDecimal(string.IsNullOrEmpty(row["Sub_Total_Pedido_Cab"].ToString()) ? "0" : Convert.ToDecimal(row["Sub_Total_Pedido_Cab"]).ToString());
                                            ofacpedidos.total_Igv_Pedido_Cab = Convert.ToDecimal(string.IsNullOrEmpty(row["total_Igv_Pedido_Cab"].ToString()) ? "0" : Convert.ToDecimal(row["total_Igv_Pedido_Cab"]).ToString());
                                            ofacpedidos.total_Neto_Pedido_Cab = Convert.ToDecimal(string.IsNullOrEmpty(row["total_Neto_Pedido_Cab"].ToString()) ? "0" : Convert.ToDecimal(row["total_Neto_Pedido_Cab"]).ToString());
                                            ltsfacpedidos.Add(ofacpedidos);
                                        }
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
     
                    }

                }
                return ltsfacpedidos;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        
    }
}
