using Negocio.Conexion;
using Negocio.Resultado;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;

using Excel = OfficeOpenXml;
using Style = OfficeOpenXml.Style;

namespace Negocio.Almacen.Reportes
{
    public class ConsultaTransacciones_BL
    {
        public object get_almacenesAnexo(int idAnexo, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REPORTE_TRANSACCIONES_COMBO_ALMACEN", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idAnexo", SqlDbType.Int).Value = idAnexo;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

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

        public object get_consultaProducto(int idAnexo, int idAlmacen,  string codProducto )
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REPORTE_TRANSACCIONES_CONSULTA_PRODUCTO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idAnexo", SqlDbType.Int).Value = idAnexo;
                        cmd.Parameters.Add("@idAlmacen", SqlDbType.Int).Value = idAlmacen;
                        cmd.Parameters.Add("@codProducto", SqlDbType.VarChar).Value = codProducto;

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

        public object ExportarExcel_consultaTransacciones(int idAnexos, int idAlmacen, string fechaInicial,string fechaFinal, string  tipoReporte,string cod_producto)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REPORTE_TRANSACCIONES_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@anexo", SqlDbType.Int).Value = idAnexos;
                        cmd.Parameters.Add("@almacen", SqlDbType.Int).Value = idAlmacen;
                        cmd.Parameters.Add("@fechaInicio", SqlDbType.VarChar).Value = fechaInicial;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFinal;
                        cmd.Parameters.Add("@tipo", SqlDbType.Int).Value = tipoReporte;
                        cmd.Parameters.Add("@producto", SqlDbType.VarChar).Value = cod_producto;
 

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
                                res.data = GenerarArchivoExcel_consultaTransacciones(dt_detalle, tipoReporte);
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

        public string GenerarArchivoExcel_consultaTransacciones(DataTable dt_detalles,string tipoReporte)
        {
            string Res = "";
            string _servidor;

            int _fila = 8;
            string FileRuta = "";
            string FileExcel = "";
            string nombreLibro = "";
            try
            {
                _servidor = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/consultaTransacciones" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "consultaTransacciones" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                nombreLibro = (tipoReporte == "1" ? "Ingresos" : "Transferencias");

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add(nombreLibro);
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    oWs.Cells[1, 1].Value = dt_detalles.Rows[0]["empresaReporte"].ToString();
                    oWs.Cells[2, 1].Value = dt_detalles.Rows[0]["rucReporte"].ToString();
                    oWs.Cells[2, 17].Value = dt_detalles.Rows[0]["fechaReporte"].ToString();

                    oWs.Cells[3, 1, 3, 17].Merge = true;  // combinar celdaS dt
                    oWs.Cells[3, 1].Value = dt_detalles.Rows[0]["tituloReporte"].ToString();
                    oWs.Cells[3, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[3, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[3, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[3, 1].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[5, 1, 5, 17].Merge = true;  // combinar celdaS dt
                    oWs.Cells[5, 1].Value = "Del " + dt_detalles.Rows[0]["fechaInicial"].ToString()  + " al " + dt_detalles.Rows[0]["fechaFinal"].ToString();
                    oWs.Cells[5, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[5, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int i = 1; i <= 17; i++)
                    {
                        oWs.Cells[7, i].Style.Border.BorderAround(Excel.Style.ExcelBorderStyle.Thin);
                    }         

                    oWs.Cells[7, 1].Value = "LOCAL";
                    oWs.Cells[7, 2].Value = "ANEXO ";
                    oWs.Cells[7, 3].Value = "ALMACEN ";
                    oWs.Cells[7, 4].Value = "TIPO MOVIMIENTO ";
                    oWs.Cells[7, 5].Value = "FECHA EMISION ";
                    oWs.Cells[7, 6].Value = "NRO DOCUMENTO ";
                    
                    oWs.Cells[7, 7].Value = "CODIGO ";
                    oWs.Cells[7, 8].Value = "NOMBRE ";
                    oWs.Cells[7, 9].Value = "CATEGORIA ";
                    oWs.Cells[7, 10].Value = "MARCA ";
                    oWs.Cells[7, 11].Value = "UM ";
                    oWs.Cells[7, 12].Value = "CANTIDAD ";
                    oWs.Cells[7, 13].Value = "P.U";
                    oWs.Cells[7, 14].Value = "OBS ";
                    
                    oWs.Cells[7, 15].Value = "NRO LOTE ";
                    oWs.Cells[7, 16].Value = "FECHA PRODUCCION ";
                    oWs.Cells[7, 17].Value = "FECHA VENCIMIENTO ";

                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
                        oWs.Cells[_fila, 1].Value = oBj["local"].ToString();
                        oWs.Cells[_fila, 2].Value = oBj["anexo"].ToString();
                        oWs.Cells[_fila, 3].Value = oBj["almacen"].ToString();
                        oWs.Cells[_fila, 4].Value = oBj["tipoDocumento"].ToString();
                        oWs.Cells[_fila, 5].Value = oBj["fechaEmision"].ToString();
                        oWs.Cells[_fila, 6].Value = oBj["nroDocumento"].ToString();

                        oWs.Cells[_fila, 7].Value = oBj["codigo"].ToString();
                        oWs.Cells[_fila, 8].Value = oBj["nombre"].ToString();
                        oWs.Cells[_fila, 9].Value = oBj["categoria"].ToString();
                        oWs.Cells[_fila, 10].Value = oBj["marca"].ToString();
                        oWs.Cells[_fila, 11].Value = oBj["um"].ToString();

                        oWs.Cells[_fila, 12].Value = oBj["cantidad"].ToString();
                        oWs.Cells[_fila, 12].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        oWs.Cells[_fila, 12].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                        oWs.Cells[_fila, 13].Value = oBj["precioUnitario"].ToString();
                        oWs.Cells[_fila, 13].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        oWs.Cells[_fila, 13].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                        oWs.Cells[_fila, 14].Value = oBj["obs"].ToString();

                        oWs.Cells[_fila, 15].Value = oBj["nroLote"].ToString();
                        oWs.Cells[_fila, 16].Value = oBj["fechaProduccion"].ToString();
                        oWs.Cells[_fila, 17].Value = oBj["fechaVencimiento"].ToString();

                        _fila++;
                    }

                    oWs.Row(7).Style.Font.Bold = true;
                    oWs.Row(7).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(7).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 17; k++)
                    {
                        oWs.Column(k).AutoFit();
                    }
                    oEx.Save();
                }
                Res = FileExcel;
            }
            catch (Exception)
            {
                throw;
            }
            return Res;
        }


    }
}
