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
    public class Error_Documentos_BL
    {
        public List<Error_Documentos_E> Listando_Documentos_Erroneos(int id_local, int id_almacen, int id_Anexos, int  vendedor, int  id_transportista, int id_TipoDocumento)
        {
            try
            {
                List<Error_Documentos_E> obj_List = new List<Error_Documentos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ERROR_DOCUMENTOS_ELECTRONICO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;

                        cmd.Parameters.Add("@vendedor", SqlDbType.Int).Value = vendedor;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;
                        cmd.Parameters.Add("@id_TipoDocumento", SqlDbType.Int).Value = id_TipoDocumento;


                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Error_Documentos_E Entidad = new Error_Documentos_E();
                                Entidad.id_Factura_Cab = Convert.ToInt32(row["id_Factura_Cab"].ToString());
                                Entidad.id_Factura_Cab_Referencia = Convert.ToInt32(row["id_Factura_Cab_Referencia"].ToString());
                                Entidad.nombres_Cliente = row["nombres_Cliente"].ToString();                               

                                Entidad.id_TipoDocumento = Convert.ToInt32(row["id_TipoDocumento"].ToString());
                                Entidad.Descripcion_TipoDocumento = row["Descripcion_TipoDocumento"].ToString();
                                Entidad.forma_pago = row["forma_pago"].ToString();
                                Entidad.Numero_Documento = row["Numero_Documento"].ToString();
                                

                                Entidad.fecha_emision = row["fecha_emision"].ToString();
                                Entidad.fecha_vencimiento = row["fecha_vencimiento"].ToString();
                                Entidad.mensaje = row["mensaje"].ToString();
                                Entidad.checkeado = false;                     
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


        public List<Error_Documentos_E> Listando_DocumentosPendientesEnvio(int id_zona, int id_almacen, int id_Anexos)
        {
            try
            {
                List<Error_Documentos_E> obj_List = new List<Error_Documentos_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ENVIO_SUNAT_NOTAS_CREDITO_DEBITO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Error_Documentos_E Entidad = new Error_Documentos_E();
                                Entidad.id_Factura_Cab = Convert.ToInt32(row["id_Factura_Cab"].ToString());
                                Entidad.id_Factura_Cab_Referencia = Convert.ToInt32(row["id_Factura_Cab_Referencia"].ToString());
                                Entidad.nombres_Cliente = row["nombres_Cliente"].ToString();

                                Entidad.id_TipoDocumento = Convert.ToInt32(row["id_TipoDocumento"].ToString());
                                Entidad.Descripcion_TipoDocumento = row["Descripcion_TipoDocumento"].ToString();
                                Entidad.forma_pago = row["forma_pago"].ToString();
                                Entidad.Numero_Documento = row["Numero_Documento"].ToString();


                                Entidad.fecha_emision = row["fecha_emision"].ToString();
                                Entidad.fecha_vencimiento = row["fecha_vencimiento"].ToString();
                                Entidad.mensaje = row["mensaje"].ToString();
                                Entidad.checkeado = false;
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



    }
}
