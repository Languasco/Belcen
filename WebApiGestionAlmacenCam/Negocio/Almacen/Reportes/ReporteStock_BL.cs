using Entidades.Mantenimiento.Reportes;
using Negocio.Conexion;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Almacen.Reportes
{
    public class ReporteStock_BL
    {
        public List<ReporteStock_E> Listando_StockAlmacen(string fecha, int id_local, int id_almacen, int id_opcion)
        {
            try
            {
                List<ReporteStock_E> obj_List = new List<ReporteStock_E>();
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_ALMACEN_REPORTE_STOCK_ALMACEN", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@opcion", SqlDbType.Int).Value = id_opcion;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                ReporteStock_E Entidad = new ReporteStock_E();
                                if (id_opcion == 1)
                                {// GENERAL

                                }
                                else if (id_opcion == 2)
                                {
                                    Entidad.local = row["local"].ToString();
                                }
                                else if (id_opcion == 3)
                                {
                                    Entidad.almacen = row["almacen"].ToString();
                                }

                                
                                Entidad.codigo = row["codigo"].ToString();
                                Entidad.descripcion = row["descripcion"].ToString();
                                Entidad.MARCA = row["MARCA"].ToString();
                                Entidad.rubro = row["rubro"].ToString();
                                Entidad.um = row["um"].ToString();
                                Entidad.ingresos = Convert.ToDecimal(row["ingresos"].ToString());
                                Entidad.salidas = Convert.ToDecimal(row["salidas"].ToString());
                                Entidad.stock = Convert.ToDecimal(row["stock"].ToString());
                                
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



        public List<ReporteStock_E> Listado_Kardex(string fecha, int id_local, int id_almacen, int id_opcion,int id_Material)
        {
            try
            {
                List<ReporteStock_E> obj_List = new List<ReporteStock_E>();
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_ALMACEN_REPORTE_KARDEX", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@opcion", SqlDbType.Int).Value = id_opcion;
                        cmd.Parameters.Add("@ID_PRODUCTO", SqlDbType.Int).Value = id_Material;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                ReporteStock_E Entidad = new ReporteStock_E();                               

                                Entidad.codigo = row["CODIGO_PRODUCTO"].ToString();
                                Entidad.descripcion = row["NOMBRE_PRODUCTO"].ToString();
                                Entidad.rubro = row["CATEGORIA"].ToString();
                                Entidad.um = row["UM"].ToString();                                
                                Entidad.movimiento = row["MOVIMIENTO"].ToString();
                                Entidad.stock = Convert.ToDecimal(row["STOCK"].ToString());
                                Entidad.fecha = row["FECHA"].ToString();
                                Entidad.nroDoc = row["NRODOC"].ToString();

                                Entidad.E_COSTOUNITARIO = row["E_COSTOUNITARIO"].ToString();
                                Entidad.E_COSTOTOTAL = row["E_COSTOTOTAL"].ToString();
                                Entidad.S_COSTOUNITARIO = row["S_COSTOUNITARIO"].ToString();
                                Entidad.S_COSTOTOTAL = row["S_COSTOTOTAL"].ToString();
                                Entidad.F_COSTOUNITARIO = row["F_COSTOUNITARIO"].ToString();
                                Entidad.F_COSTOTOTAL = row["F_COSTOTOTAL"].ToString();
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
