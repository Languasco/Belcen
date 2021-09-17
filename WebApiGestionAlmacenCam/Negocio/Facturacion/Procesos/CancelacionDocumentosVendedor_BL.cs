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
    public class CancelacionDocumentosVendedor_BL
    {
        public List<CancelacionDocumentosVendedor_E> Listando_CancelacionDocumentosVendedor(int id_vendedor, string fecha_inicial)
        {
            try
            {
                List<CancelacionDocumentosVendedor_E> obj_List = new List<CancelacionDocumentosVendedor_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_FACTURACION_CANCELACION_DOC_VENDEDOR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha_inicial;


                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                CancelacionDocumentosVendedor_E Entidad = new CancelacionDocumentosVendedor_E();

                                Entidad.checkeado = false;     
                                Entidad.id_Factura_Cab = Convert.ToInt32(row["id_Factura_Cab"].ToString());
                                Entidad.nombres_Cliente = row["nombres_Cliente"].ToString();
                                Entidad.fecha_doc = row["fecha_doc"].ToString();
                                Entidad.nro_documento = row["nro_documento"].ToString();                                
                                Entidad.total = Convert.ToDecimal(row["total"].ToString());
                                Entidad.cuenta = Convert.ToDecimal(row["cuenta"].ToString());
                                Entidad.pago = Convert.ToDecimal(row["pago"].ToString());
                                Entidad.deuda = Convert.ToDecimal(row["deuda"].ToString());

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
        
        public string ActualizandoPagosVendedores(string listFacturas, int id_usuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_I_CANCELACION_DOCUMENTOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@codFactura", SqlDbType.VarChar).Value = listFacturas;
                        cmd.Parameters.Add("@idusuario", SqlDbType.Int).Value = id_usuario;
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
        
    }
}
