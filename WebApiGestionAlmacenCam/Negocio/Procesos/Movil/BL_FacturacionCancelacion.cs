using Entidades.Procesos.Movil;
using Negocio.Conexion;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Procesos.Movil
{
    public class BL_FacturacionCancelacion
    {
        bdConexion cn = null;
        SqlConnection con = null;
        SqlCommand cmd = null;
        SqlDataReader dr;
        Ent_FacturacionCancelacion objFacturacionCancelacion = null;
        Ent_FacturacionCancelacionDetalle objFacturacionCancelacionDetalle = null;

        public List<Ent_FacturacionCancelacion> GetFacturaCancelarPendiente(int idVendedor)
        {
            List<Ent_FacturacionCancelacion> listFacturacionCancelacion = new List<Ent_FacturacionCancelacion>();

            try
            {
                cn = new bdConexion();
                using (con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    using (cmd = new SqlCommand("DSIGE_Factura_Cancelar_Pendientes", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Vendedor", SqlDbType.Int).Value = idVendedor;                        
                        dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            objFacturacionCancelacion = new Ent_FacturacionCancelacion();
                            objFacturacionCancelacion.id_cliente = Convert.ToInt32(dr["id_cliente"]);
                            objFacturacionCancelacion.razonsocial_cliente = dr["razonsocial_cliente"].ToString();
                            objFacturacionCancelacion.nroDocumento = dr["nroDocumento"].ToString();
                            objFacturacionCancelacion.direccion_cliente = dr["direccion_cliente"].ToString();
                            objFacturacionCancelacion.Total = dr["Total"].ToString();
                            objFacturacionCancelacion.Pagado= dr["Pagado"].ToString();
                            objFacturacionCancelacion.DeudaTotal = dr["DeudaTotal"].ToString();
                            objFacturacionCancelacion.FechaUltimo = dr["FechaUltimo"].ToString();
                            listFacturacionCancelacion.Add(objFacturacionCancelacion);
                        }
                    }
                }                
            }
            catch (Exception ex)
            {
                
                throw;
            }
            return listFacturacionCancelacion;
        }



        public List<Ent_FacturacionCancelacionDetalle> GetFacturaCancelarPendienteDetalle(int idVendedor)
        {
            List<Ent_FacturacionCancelacionDetalle> listFacturacionCancelacion = new List<Ent_FacturacionCancelacionDetalle>();

            try
            {
                cn = new bdConexion();
                using (con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    using (cmd = new SqlCommand("DSIGE_Factura_Cancelar_Pendientes_Detalle", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Vendedor", SqlDbType.Int).Value = idVendedor;
                        cmd.Parameters.Add("@Cliente", SqlDbType.Int).Value = idVendedor;
                        dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            objFacturacionCancelacionDetalle = new Ent_FacturacionCancelacionDetalle();
                            objFacturacionCancelacionDetalle.id_cliente = Convert.ToInt32(dr["id_cliente"]);
                            objFacturacionCancelacionDetalle.id_factura_cab = Convert.ToInt32(dr["id_factura_cab"]);
                            objFacturacionCancelacionDetalle.Numero_Documento = dr["Numero_Documento"].ToString();
                            objFacturacionCancelacionDetalle.Total = dr["Total"].ToString();
                            objFacturacionCancelacionDetalle.Acuenta = dr["Acuenta"].ToString();
                            objFacturacionCancelacionDetalle.DeudaTotal = dr["DeudaTotal"].ToString();
                            objFacturacionCancelacionDetalle.FechaUltimo = dr["FechaUltimo"].ToString();
                            listFacturacionCancelacion.Add(objFacturacionCancelacionDetalle);
                        }
                    }
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return listFacturacionCancelacion;
        }
    }
}
