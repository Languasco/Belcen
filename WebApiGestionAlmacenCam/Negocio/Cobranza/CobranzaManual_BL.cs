using Entidades.Cobranzas;
using Negocio.Conexion;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Cobranza
{
    public class CobranzaManual_BL
    {
        public object get_cobranza(int id_Anexo, int id_ZonaVenta, int id_Vendedor, string fechaInicio, string fechaFinal)
        {
            DataTable dt_detalle = new DataTable();
            Result res = new Result();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_FACTURACION_COBRANZA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idZonaVenta", SqlDbType.Int).Value = id_ZonaVenta;
                        cmd.Parameters.Add("@idAnexo", SqlDbType.Int).Value = id_Anexo;
                        cmd.Parameters.Add("@idVendedor", SqlDbType.Int).Value = id_Vendedor;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaInicio;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFinal;


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
    }
}
