using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entidades.Procesos.Movil;
using System.Data.SqlClient;

using System.Data;
using Negocio.Conexion;
namespace Negocios.Procesos.Movil
{
    public class BL_stockAlmacen
    {
        bdConexion cn = null;
        SqlConnection con = null;
        SqlCommand cmd = null;
        SqlDataReader dr;
        public List<ENT_stockAlmacen> getStockAlmacen(int id_cuadrilla, int id_vendedor, int idAlmacen)
        {
            List<ENT_stockAlmacen> listStockAlmacen = null;
            try
            {
                listStockAlmacen = new List<ENT_stockAlmacen>();
                ENT_stockAlmacen objStockAlmacen = null;
                cn = new bdConexion();
                using (con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    using (cmd = new SqlCommand("SP_GET_STOCK", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_cuadrilla", SqlDbType.Int).Value = id_cuadrilla;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = idAlmacen;
                        dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            objStockAlmacen = new ENT_stockAlmacen();
                            objStockAlmacen.id_producto = Int32.Parse(dr[0].ToString());
                            objStockAlmacen.descripcion_producto = dr[1].ToString();
                            objStockAlmacen.codigoInterno = dr[2].ToString();
                            objStockAlmacen.precio = dr[3].ToString();
                            objStockAlmacen.aplicaDescuento = dr[4].ToString();
                            objStockAlmacen.porceDescuento = dr[5].ToString();
                            objStockAlmacen.stock = dr[6].ToString();
                            objStockAlmacen.unidadMedida = dr[7].ToString();
                            objStockAlmacen.marca = dr[8].ToString();
                            listStockAlmacen.Add(objStockAlmacen);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                dr.Close();
                cmd.Dispose();
                con.Close();
            }

            return listStockAlmacen;
        }
        public List<ENT_stockAlmacen> getStockAlmacenByTop(int id_cuadrilla, int condicion, int cant, string filter, int idAlmacen)
        {
            List<ENT_stockAlmacen> listStockAlmacen = null;
            try
            {
                listStockAlmacen = new List<ENT_stockAlmacen>();
                ENT_stockAlmacen objStockAlmacen = null;
                cn = new bdConexion();
                 filter = filter == null ? "" : filter;

                 using (con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    using (cmd = new SqlCommand("SP_GET_STOCK_TOP6", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_cuadrilla", SqlDbType.Int).Value = id_cuadrilla;
                        cmd.Parameters.Add("@cant", SqlDbType.Int).Value = cant;
                        cmd.Parameters.Add("@filter", SqlDbType.VarChar).Value = filter;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = idAlmacen;
                        dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            objStockAlmacen = new ENT_stockAlmacen();                            
                            objStockAlmacen.id_producto = Int32.Parse(dr[0].ToString());
                            objStockAlmacen.descripcion_producto = dr[1].ToString();
                            objStockAlmacen.codigoInterno = dr[2].ToString();
                            objStockAlmacen.precio = dr[3].ToString();
                            objStockAlmacen.aplicaDescuento = dr[4].ToString();
                            objStockAlmacen.porceDescuento = dr[5].ToString();
                            objStockAlmacen.stock = dr[6].ToString();
                            listStockAlmacen.Add(objStockAlmacen);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                dr.Close();
                cmd.Dispose();
                con.Close();
            }

            return listStockAlmacen;
        }
    }
}
