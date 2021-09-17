 
using Entidades.Reparto.Reporte;
using Negocio.Conexion;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Threading;
using Excel = OfficeOpenXml;
using Style = OfficeOpenXml.Style;

namespace Negocio.Reparto.Reporte
{
   public  class ReportePedidos_BL
    {

        public class Resultado
        {
            public bool ok { get; set; }
            public object data { get; set; }
        }


        public object generarReporteCobertura(int id_local, int id_almacen, int id_Vendedor, string fecha,  int id_usuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REPORTE_COBERTURA_DETALLADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_Vendedor", SqlDbType.Int).Value = id_Vendedor;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;
                                               
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
                                res.data = GenerarArchivoExcel_cobertura(dt_detalle, id_local, id_almacen, id_Vendedor, fecha, id_usuario);
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

        public string GenerarArchivoExcel_cobertura(DataTable dt_detalles, int id_local, int id_almacen, int id_Vendedor, string fecha, int id_usuario)
        {
            string Res = "";
            int _fila = 5;
            string FileRuta = "";
            string FileExcel = "";
            int ultimaColum = 0;

            try
            {

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/" + id_usuario + "ReporteCobertura.xlsx");
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + id_usuario + "ReporteCobertura.xlsx";
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }


                DataTable ListaProducto_Group = new DataTable();
                ListaProducto_Group = get_Cobertura_agrupadoProductos(id_local, id_almacen, id_Vendedor, fecha);

                DataTable ListaVendedor_Group = new DataTable();
                ListaVendedor_Group = get_Cobertura_agrupadoVendedor(id_local, id_almacen, id_Vendedor, fecha);


                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("Cobertura");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    int cantC = (ListaVendedor_Group.Rows.Count + 8);

                    oWs.Cells[1, 1, 1, cantC].Merge = true;  // combinar celdaS dt
                    oWs.Cells[1, 1].Value = "REPORTE DE COBERTURA";
                    oWs.Cells[1, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[1, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[1, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[1, 1].Style.Font.Bold = true; //Letra negrita




                    oWs.Cells[2, 1, 2, cantC].Merge = true;  // combinar celdaS dt
                    oWs.Cells[2, 1].Value = "FECHA : " + fecha;
                    oWs.Cells[2, 1].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[2, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[2, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[2, 1].Style.Font.Bold = true; //Letra negrita

                    for (int i = 1; i <= 5; i++)
                    {
                        oWs.Cells[4, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    }

                    oWs.Cells[4, 1].Value = "PESO";
                    oWs.Cells[4, 1].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                    oWs.Cells[4, 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGreen); // fondo de celda

                    oWs.Cells[4, 2].Value = "COD";
                    oWs.Cells[4, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                    oWs.Cells[4, 2].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGreen); // fondo de celda

                    oWs.Cells[4, 3].Value = "TIPO";
                    oWs.Cells[4, 3].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                    oWs.Cells[4, 3].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGreen); // fondo de celda

                    oWs.Cells[4, 4].Value = "MARCA";
                    oWs.Cells[4, 4].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                    oWs.Cells[4, 4].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGreen); // fondo de celda

                    oWs.Cells[4, 5].Value = "PRODUCTO";
                    oWs.Cells[4, 5].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                    oWs.Cells[4, 5].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGreen); // fondo de celda
                                                           

                    ultimaColum = 6;
                    foreach (DataRow itemV in ListaVendedor_Group.Rows)
                    {
                            oWs.Cells[4, ultimaColum].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[4, ultimaColum].Style.Font.Size = 8; //letra tamaño  2
                            oWs.Cells[4, ultimaColum].Style.Font.Bold = true; //Letra negrita
                            oWs.Cells[4, ultimaColum].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                            oWs.Cells[4, ultimaColum].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center; // alinear texto  
                            oWs.Cells[4, ultimaColum].Value = itemV["vendedor"].ToString();
                            ultimaColum = ultimaColum + 1;                   
                    }

                    // Columnas de Totales 
                    oWs.Cells[4, ultimaColum].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[4, ultimaColum].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[4, ultimaColum].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[4, ultimaColum].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                    oWs.Cells[4, ultimaColum].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlanchedAlmond); // fondo de celda
                    oWs.Cells[4, ultimaColum].Value = "TOTAL UNIDADES";
                    ultimaColum = ultimaColum + 1;

                    oWs.Cells[4, ultimaColum ].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[4, ultimaColum ].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[4, ultimaColum ].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[4, ultimaColum ].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                    oWs.Cells[4, ultimaColum ].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlanchedAlmond); // fondo de celda
                    oWs.Cells[4, ultimaColum ].Value = "TOTAL CAJAS";
                    ultimaColum = ultimaColum + 1;

                    oWs.Cells[4, ultimaColum ].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[4, ultimaColum ].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[4, ultimaColum ].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[4, ultimaColum ].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                    oWs.Cells[4, ultimaColum ].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlanchedAlmond); // fondo de celda
                    oWs.Cells[4, ultimaColum ].Value = "TOTAL PESO";
                    // Fin de Columnas Totales
                                                                                          

                    foreach (DataRow oBp in ListaProducto_Group.Rows)
                    {
                        oWs.Cells[_fila, 1].Value = oBp["peso"].ToString();
                        oWs.Cells[_fila, 2].Value = oBp["cod"].ToString();
                        oWs.Cells[_fila, 3].Value = oBp["tipo"].ToString();
                        oWs.Cells[_fila, 4].Value = oBp["marca"].ToString();
                        oWs.Cells[_fila, 5].Value = oBp["producto"].ToString();

                        ultimaColum = 6;
                        foreach (DataRow itemVend in ListaVendedor_Group.Rows)
                        {
                            oWs.Cells[_fila, ultimaColum].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                            oWs.Cells[_fila, ultimaColum].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right; // alinear texto 
                            oWs.Cells[_fila, ultimaColum].Style.Font.Size = 8; //letra tamaño 
                            oWs.Cells[_fila, ultimaColum].Style.Numberformat.Format = "#,##0";
                            oWs.Cells[_fila, ultimaColum].Value = Get_CantidadPedidoVendedor(dt_detalles, Convert.ToInt32(oBp["id_Producto"].ToString()), Convert.ToInt32(itemVend["id_vendedor"].ToString()));
                            ultimaColum = ultimaColum + 1;
                        }

                        object res_totalP = dt_detalles.Compute("sum(cantidad)", "id_Producto = " + Convert.ToInt32(oBp["id_Producto"].ToString()));         
                        
                        oWs.Cells[_fila, ultimaColum].Style.Font.Size = 8; //letra tamaño   
                        oWs.Cells[_fila, ultimaColum].Style.Font.Bold = true; //Letra negrita
                        oWs.Cells[_fila, ultimaColum].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                        oWs.Cells[_fila, ultimaColum].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlanchedAlmond); // fondo de celda
                        oWs.Cells[_fila, ultimaColum].Value = res_totalP;
                        ultimaColum = ultimaColum + 1;                       

                        _fila++;
                    }


                    ///----TOTALES POR FILA
                    ultimaColum = 6;
                    foreach (DataRow itemVend in ListaVendedor_Group.Rows)
                    {
                        object res_totalc = dt_detalles.Compute("sum(cantidad)", "id_vendedor = " + Convert.ToInt32(itemVend["id_vendedor"].ToString()));

                        oWs.Cells[_fila, ultimaColum].Style.Font.Size = 8; //letra tamaño   
                        oWs.Cells[_fila, ultimaColum].Style.Font.Bold = true; //Letra negrita
                        oWs.Cells[_fila, ultimaColum].Value = res_totalc;
                        ultimaColum = ultimaColum + 1;
                    }
                    ///---- FIN DE TOTALES POR FILA

                    oWs.Row(4).Style.Font.Bold = true;
                    oWs.Row(4).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(4).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 20; k++)
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


        public string Get_CantidadPedidoVendedor(DataTable Lista_Data, int id_producto, int id_vendedor)
        {
            double res = 0;
            string valor = "";

            for (int i = 0; i < Lista_Data.Rows.Count; i++)
            {
                if (id_producto == Convert.ToInt32(Lista_Data.Rows[i]["id_Producto"].ToString()) && Convert.ToInt32(Lista_Data.Rows[i]["id_vendedor"].ToString()) == id_vendedor)
                {
                    //res = Convert.ToInt32(Lista_Data.Rows[i]["cantidad"].ToString());
                    res = res + Convert.ToDouble(Lista_Data.Rows[i]["cantidad"].ToString());
                 }
            }

            valor = (res == 0) ? "" : res.ToString();
            return valor;
        }


 

        public DataTable get_Cobertura_agrupadoProductos(int id_local, int id_almacen, int id_Vendedor, string fecha)
        {
            DataTable resultado = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REPORTE_COBERTURA_AGRUPADO_PRODUCTOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_Vendedor", SqlDbType.Int).Value = id_Vendedor;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;
 
                        DataTable dt_detalleP = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalleP);
                            resultado = dt_detalleP;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return resultado;
        }

        public DataTable get_Cobertura_agrupadoVendedor(int id_local, int id_almacen, int id_Vendedor, string fecha)
        {
            DataTable resultado = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REPORTE_COBERTURA_AGRUPADO_VENDEDOR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_Vendedor", SqlDbType.Int).Value = id_Vendedor;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;

                        DataTable dt_detalleV = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalleV);
                            resultado = dt_detalleV;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return resultado;
        }


        public object generarReporteKpi(int id_local,string fecha_ini, string fecha_fin, string  fecha_cierre, double drop, int  efectividad,int distribucion,int id_usuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_REPORTE_KPI_DETALLADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local; 
                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fecha_fin;
                        cmd.Parameters.Add("@fecha_cierre", SqlDbType.VarChar).Value = fecha_cierre;
                        cmd.Parameters.Add("@drop", SqlDbType.Decimal).Value = drop;
                        cmd.Parameters.Add("@efectividad", SqlDbType.Int).Value = efectividad;
                        cmd.Parameters.Add("@distribucion", SqlDbType.Int).Value = distribucion;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                                                                                                              
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
                               res.data = GenerarArchivoExcel_kpi(dt_detalle, id_usuario);
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

        public string GenerarArchivoExcel_kpi(DataTable dt_detalles, int id_usuario)
        {
            string Res = "";
            int _fila = 8;
            string FileRuta = "";
            string FileExcel = "";
 
            try
            {
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/" + id_usuario + "ReporteKpi.xlsx");
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + id_usuario + "ReporteKpi.xlsx";
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }



                //AGRUPANDO LA INFORMACION DE UN DATATABLE
                DataTable dtLocal = dt_detalles.DefaultView.ToTable(true, "id_Local");
                /// FIN DE AGRUPANDO

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("Kpi");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));
                       
                    oWs.Cells[1, 1, 1, 22].Merge = true;  // combinar celdaS dt
                    oWs.Cells[1, 1].Value = dt_detalles.Rows[0]["tituloReporte"].ToString();
                    oWs.Cells[1, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[1, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[1, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[1, 1].Style.Font.Bold = true; //Letra negrita 

                    for (int i = 3; i <= 4; i++)
                    {
                        oWs.Row(i).Style.Font.Bold = true;
                        oWs.Row(i).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                        oWs.Row(i).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    }
                    
                    oWs.Cells[3, 1].Value = dt_detalles.Rows[0]["fechaUnoReporte"].ToString();
                    oWs.Cells[3, 3].Value = dt_detalles.Rows[0]["fechaDosReporte"].ToString();
                    
                    oWs.Cells[3, 8].Value = "Dias utiles en el periodo";
                    oWs.Cells[3, 10].Value = dt_detalles.Rows[0]["diasUtilesReporte"].ToString();
                    oWs.Cells[3, 12].Value = dt_detalles.Rows[0]["fechaUtilesReporte"].ToString();

                    oWs.Cells[3, 14].Value = "Rojo";
                    oWs.Cells[3, 14].Style.Font.Color.SetColor(Color.Red);
                    oWs.Cells[3, 15].Value = dt_detalles.Rows[0]["rojoReporte"].ToString();
                    
                    oWs.Cells[4, 8].Value = "Dias utiles en el transcurridos";
                    oWs.Cells[4, 10].Value = dt_detalles.Rows[0]["diasUtilesTranscurrioReporte"].ToString();
                    oWs.Cells[4, 12].Value = dt_detalles.Rows[0]["porcentajeUtilesTranscurrioReporte"].ToString();

                    oWs.Cells[4, 14].Value = "Azul";
                    oWs.Cells[4, 14].Style.Font.Color.SetColor(Color.Blue);
                    oWs.Cells[4, 15].Value = dt_detalles.Rows[0]["azulReporte"].ToString();
                    
                    oWs.Cells[6, 1, 6, 22].Merge = true;  // combinar celdaS dt
                    oWs.Cells[6, 1].Value = "Analisis de Grupo de Venta";
                    oWs.Cells[6, 1].Style.Font.Size = 12; //letra tamaño  
                    oWs.Cells[6, 1].Style.Font.Bold = true; //Letra negrita 
                                       
                    _fila = 8;

                    for (int i = 1; i <= 22; i++)
                    {
                        oWs.Cells[_fila, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    }

                    oWs.Cells[_fila, 1].Value = "Informacion";

                    oWs.Cells[_fila, 2, _fila, 5].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 2].Value = "Ventas"; 
                    oWs.Cells[_fila, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 2].Style.Font.Bold = true; //Letra negrita 
                    
                    oWs.Cells[_fila, 6, _fila, 9].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 6].Value = "Drop Size";
                    oWs.Cells[_fila, 6].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 6].Style.Font.Bold = true; //Letra negrita 

                    oWs.Cells[_fila, 10, _fila, 12].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 10].Value = "Efectividad";
                    oWs.Cells[_fila, 10].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 10].Style.Font.Bold = true; //Letra negrita 

                    oWs.Cells[_fila, 13, _fila, 19].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 13].Value = "Distribucion";
                    oWs.Cells[_fila, 13].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 13].Style.Font.Bold = true; //Letra negrita 

                    oWs.Cells[_fila, 20, _fila, 22].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 20].Value = "Activaciones";
                    oWs.Cells[_fila, 20].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 20].Style.Font.Bold = true; //Letra negrita  

                    _fila += 1;

                    oWs.Row(_fila).Style.Font.Bold = true;
                    oWs.Row(_fila).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(_fila).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int i = 1; i <= 22; i++)
                    {
                        oWs.Cells[_fila, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    }

                    oWs.Cells[_fila, 1].Value = "Vendedor";
                    oWs.Cells[_fila, 2].Value = "Obj. Venta Rutas";
                    oWs.Cells[_fila, 3].Value = "Vtas Real";
                    oWs.Cells[_fila, 4].Value = "Proy. Ventas";
                    oWs.Cells[_fila, 5].Value = "% Proy vs Obj. Venta";

                    //----------Drop Size
                    oWs.Cells[_fila, 6].Value = "Vta. Prom  x Cliente";
                    oWs.Cells[_fila, 7].Value = "Obj. Drop Size";
                    oWs.Cells[_fila, 8].Value = "Real Drop Size";
                    oWs.Cells[_fila, 9].Value = "% Cob Drop Size";

                    //----------Efectividad
                    oWs.Cells[_fila, 10].Value = "Obj. Efect";
                    oWs.Cells[_fila, 11].Value = "Real Efect";
                    oWs.Cells[_fila, 12].Value = "% Cob. Efect";
                    
                    //----------Distribucion
                    oWs.Cells[_fila, 13].Value = "Cliente x Ruta";
                    oWs.Cells[_fila, 14].Value = "Obj. Acum Visita";
                    oWs.Cells[_fila, 15].Value = "N Pedidos Validos";
                    oWs.Cells[_fila, 16].Value = "Cliente Manej";
                    oWs.Cells[_fila, 17].Value = "Obj. Distrib";
                    oWs.Cells[_fila, 18].Value = "Real Distrib";
                    oWs.Cells[_fila, 19].Value = "% Cob. Distrib";

                    //----------Activaciones
                    oWs.Cells[_fila, 20].Value = "Obj. Nuevos Client";
                    oWs.Cells[_fila, 21].Value = "Real Nvos Client";
                    oWs.Cells[_fila, 22].Value = "% Client";
                          
                    //// agrupamientos para el Local ------
                    ///
                    int cabName = 0;
                    _fila += 1;
                    foreach (DataRow row_local in dtLocal.Rows)
                    {
                        cabName = 0;
                        foreach (DataRow obj in dt_detalles.Rows)
                        {
                            if (Convert.ToInt32(obj["id_Local"].ToString()) == Convert.ToInt32(row_local["id_Local"].ToString()))
                            {
                                if (cabName == 0)
                                {
                                    oWs.Cells[_fila, 1].Value = obj["descripcionLocal"].ToString();
                                    oWs.Cells[_fila, 1].Style.Font.Size = 10; //letra tamaño  
                                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita 
                                    _fila++;
                                }             

                                if (Convert.ToInt32(obj["totalGrupo"].ToString()) == 0)
                                {
                                    oWs.Cells[_fila, 1].Value = obj["descripcionVendedor"].ToString();


                                    for (int i = 2; i <= 22; i++)
                                    {
                                        oWs.Cells[_fila, i].Style.Numberformat.Format = "#,##0";
                                        oWs.Cells[_fila, i].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                                    }

                                    oWs.Cells[_fila, 2].Value = obj["objVentaRuta"].ToString();
                                    oWs.Cells[_fila, 2].Style.Font.Color.SetColor(Color.Red);
                                    oWs.Cells[_fila, 2].Style.Numberformat.Format = "#,##0";

                                    oWs.Cells[_fila, 3].Value = obj["ventasReal"].ToString();
                                    oWs.Cells[_fila, 3].Style.Numberformat.Format = "#,##0";
                                    oWs.Cells[_fila, 3].Style.Font.Color.SetColor(Color.Blue);

                                    oWs.Cells[_fila, 4].Value = obj["ProyVentas"].ToString();
                                    oWs.Cells[_fila, 4].Style.Numberformat.Format = "#,##0";

                                    oWs.Cells[_fila, 5].Value = obj["porcenProyVSobjVenta"].ToString();
                                    oWs.Cells[_fila, 5].Style.Numberformat.Format = "#,##0";

                                    oWs.Cells[_fila, 6].Value = obj["VtaPromCliente"].ToString();
                                    oWs.Cells[_fila, 6].Style.Numberformat.Format = "#,##0";

                                    oWs.Cells[_fila, 7].Value = obj["objDropSize"].ToString();
                                    oWs.Cells[_fila, 7].Style.Numberformat.Format = "#,##0";
                                    oWs.Cells[_fila, 7].Style.Font.Color.SetColor(Color.Red);

                                    oWs.Cells[_fila, 8].Value = obj["realDropSize"].ToString();
                                    oWs.Cells[_fila, 8].Style.Numberformat.Format = "#,##0";

                                    oWs.Cells[_fila, 9].Value = obj["porcenCobDrop"].ToString();
                                    oWs.Cells[_fila, 9].Style.Numberformat.Format = "#,##0";

                                    oWs.Cells[_fila, 10].Value = obj["objEfectividad"].ToString();
                                    oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0";
                                    oWs.Cells[_fila, 10].Style.Font.Color.SetColor(Color.Red);

                                    oWs.Cells[_fila, 11].Value = obj["realEfectividad"].ToString();
                                    oWs.Cells[_fila, 11].Style.Numberformat.Format = "#,##0";

                                    oWs.Cells[_fila, 12].Value = obj["porcenCobEfect"].ToString();
                                    oWs.Cells[_fila, 12].Style.Numberformat.Format = "#,##0";

                                    oWs.Cells[_fila, 13].Value = obj["clientesRuta"].ToString();
                                    oWs.Cells[_fila, 13].Style.Numberformat.Format = "#,##0";
                                    oWs.Cells[_fila, 13].Style.Font.Color.SetColor(Color.Blue);

                                    oWs.Cells[_fila, 14].Value = obj["objAcumVisita"].ToString();
                                    oWs.Cells[_fila, 14].Style.Numberformat.Format = "#,##0";
                                    oWs.Cells[_fila, 14].Style.Font.Color.SetColor(Color.Blue);

                                    oWs.Cells[_fila, 15].Value = obj["nroPedidosValidos"].ToString();
                                    oWs.Cells[_fila, 15].Style.Numberformat.Format = "#,##0";
                                    oWs.Cells[_fila, 15].Style.Font.Color.SetColor(Color.Blue);

                                    oWs.Cells[_fila, 16].Value = obj["clientesManej"].ToString();
                                    oWs.Cells[_fila, 16].Style.Numberformat.Format = "#,##0";
                                    oWs.Cells[_fila, 16].Style.Font.Color.SetColor(Color.Blue);

                                    oWs.Cells[_fila, 17].Value = obj["objDistrib"].ToString();
                                    oWs.Cells[_fila, 17].Style.Numberformat.Format = "#,##0";
                                    oWs.Cells[_fila, 17].Style.Font.Color.SetColor(Color.Red);

                                    oWs.Cells[_fila, 18].Value = obj["realDistrib"].ToString();
                                    oWs.Cells[_fila, 18].Style.Numberformat.Format = "#,##0";

                                    oWs.Cells[_fila, 19].Value = obj["porcenCobDist"].ToString();
                                    oWs.Cells[_fila, 19].Style.Numberformat.Format = "#,##0";

                                    oWs.Cells[_fila, 20].Value = obj["objNvosClient"].ToString();
                                    oWs.Cells[_fila, 20].Style.Numberformat.Format = "#,##0";
                                    oWs.Cells[_fila, 20].Style.Font.Color.SetColor(Color.Red);

                                    oWs.Cells[_fila, 21].Value = obj["realNvosClient"].ToString();
                                    oWs.Cells[_fila, 21].Style.Numberformat.Format = "#,##0";
                                    oWs.Cells[_fila, 21].Style.Font.Color.SetColor(Color.Blue);

                                    oWs.Cells[_fila, 22].Value = obj["porcenClientes"].ToString();             

                                    _fila++;
                                }
                                if (Convert.ToInt32(obj["totalGrupo"].ToString()) == 1)  ///- ---TOTAL POR LOCAL
                                {
                                    oWs.Cells[_fila, 1].Value = obj["descripcionVendedor"].ToString();
                                    oWs.Cells[_fila, 1].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                                    for (int i = 2; i <= 22; i++)
                                    {
                                        oWs.Cells[_fila, i].Style.Numberformat.Format = "#,##0";
                                        oWs.Cells[_fila, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                                    }        

                                    oWs.Cells[_fila, 2].Value = obj["objVentaRuta"].ToString();              
                                    oWs.Cells[_fila, 3].Value = obj["ventasReal"].ToString();
                                    oWs.Cells[_fila, 4].Value = obj["ProyVentas"].ToString();
                                    oWs.Cells[_fila, 5].Value = obj["porcenProyVSobjVenta"].ToString();

                                    oWs.Cells[_fila, 6].Value = obj["VtaPromCliente"].ToString();
                                    oWs.Cells[_fila, 7].Value = obj["objDropSize"].ToString();
                                    oWs.Cells[_fila, 8].Value = obj["realDropSize"].ToString();
                                    oWs.Cells[_fila, 9].Value = obj["porcenCobDrop"].ToString();
                                    oWs.Cells[_fila, 10].Value = obj["objEfectividad"].ToString();

                                    oWs.Cells[_fila, 11].Value = obj["realEfectividad"].ToString();
                                    oWs.Cells[_fila, 12].Value = obj["porcenCobEfect"].ToString();
                                    oWs.Cells[_fila, 13].Value = obj["clientesRuta"].ToString();
                                    oWs.Cells[_fila, 14].Value = obj["objAcumVisita"].ToString();

                                    oWs.Cells[_fila, 15].Value = obj["nroPedidosValidos"].ToString();
                                    oWs.Cells[_fila, 16].Value = obj["clientesManej"].ToString();
                                    oWs.Cells[_fila, 17].Value = obj["objDistrib"].ToString();
                                    oWs.Cells[_fila, 18].Value = obj["realDistrib"].ToString();

                                    oWs.Cells[_fila, 19].Value = obj["porcenCobDist"].ToString();
                                    oWs.Cells[_fila, 20].Value = obj["objNvosClient"].ToString();
                                    oWs.Cells[_fila, 21].Value = obj["realNvosClient"].ToString();
                                    oWs.Cells[_fila, 22].Value = obj["porcenClientes"].ToString();

                                    oWs.Row(_fila).Style.Font.Bold = true;
                                    oWs.Row(_fila).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                                    oWs.Row(_fila).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                                    _fila += 2;
                                }

                                 if (Convert.ToInt32(obj["totalGrupo"].ToString()) == 2)  ///- ---TOTAL GENERAL
                                {

                                    _fila = _fila - 1;

                                    oWs.Cells[_fila, 1].Value = obj["descripcionVendedor"].ToString();
                                    oWs.Cells[_fila, 1].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                                    for (int i = 2; i <= 22; i++)
                                    {
                                        oWs.Cells[_fila, i].Style.Numberformat.Format = "#,##0";
                                        oWs.Cells[_fila, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                                    }

                                    oWs.Cells[_fila, 2].Value = obj["objVentaRuta"].ToString();
                                    oWs.Cells[_fila, 3].Value = obj["ventasReal"].ToString();
                                    oWs.Cells[_fila, 4].Value = obj["ProyVentas"].ToString();
                                    oWs.Cells[_fila, 5].Value = obj["porcenProyVSobjVenta"].ToString();

                                    oWs.Cells[_fila, 6].Value = obj["VtaPromCliente"].ToString();
                                    oWs.Cells[_fila, 7].Value = obj["objDropSize"].ToString();
                                    oWs.Cells[_fila, 8].Value = obj["realDropSize"].ToString();
                                    oWs.Cells[_fila, 9].Value = obj["porcenCobDrop"].ToString();
                                    oWs.Cells[_fila, 10].Value = obj["objEfectividad"].ToString();

                                    oWs.Cells[_fila, 11].Value = obj["realEfectividad"].ToString();
                                    oWs.Cells[_fila, 12].Value = obj["porcenCobEfect"].ToString();
                                    oWs.Cells[_fila, 13].Value = obj["clientesRuta"].ToString();
                                    oWs.Cells[_fila, 14].Value = obj["objAcumVisita"].ToString();

                                    oWs.Cells[_fila, 15].Value = obj["nroPedidosValidos"].ToString();
                                    oWs.Cells[_fila, 16].Value = obj["clientesManej"].ToString();
                                    oWs.Cells[_fila, 17].Value = obj["objDistrib"].ToString();
                                    oWs.Cells[_fila, 18].Value = obj["realDistrib"].ToString();

                                    oWs.Cells[_fila, 19].Value = obj["porcenCobDist"].ToString();
                                    oWs.Cells[_fila, 20].Value = obj["objNvosClient"].ToString();
                                    oWs.Cells[_fila, 21].Value = obj["realNvosClient"].ToString();
                                    oWs.Cells[_fila, 22].Value = obj["porcenClientes"].ToString();

                                    oWs.Row(_fila).Style.Font.Bold = true;
                                    oWs.Row(_fila).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                                    oWs.Row(_fila).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                                    _fila += 1;
                                }
                                cabName += 1;                     
                            }
                        }
                    }

                    for (int k = 1; k <= 22; k++)
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


        public List<ReporteStock_Reparto_E> get_reporteStock(int id_almacen, int idsuario)
        {
            List<Entidades.Reparto.Reporte.ReporteStock_Reparto_E> list_detalle = new List<Entidades.Reparto.Reporte.ReporteStock_Reparto_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_REPORTE_STOCK_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = idsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Entidades.Reparto.Reporte.ReporteStock_Reparto_E obj_entidad = new ReporteStock_Reparto_E();

                                obj_entidad.codigo = dr["codigo"].ToString();
                                obj_entidad.descripcion = dr["descripcion"].ToString();
                                obj_entidad.um = dr["um"].ToString();
                                obj_entidad.stock = dr["stock"].ToString();
                                obj_entidad.precioMenor = dr["precioMenor"].ToString();
                                obj_entidad.precioMayor = dr["precioMayor"].ToString();
                                obj_entidad.usuarioImporto = dr["usuarioImporto"].ToString();
                                obj_entidad.fechaImportacion = dr["fechaImportacion"].ToString();

                                list_detalle.Add(obj_entidad);
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return list_detalle;
        }


        public object get_descargarReporteStock(int id_almacen, int idsuario)
        {
            Resultado res = new Resultado();
            try
            {

                List<ReporteStock_Reparto_E> list_detalle = new List<ReporteStock_Reparto_E>();

                list_detalle = get_reporteStock(id_almacen, idsuario);

                if (list_detalle.Count <= 0)
                {
                    res.ok = false;
                    res.data = "0|No hay informacion disponible";
                }
                else
                {
                    res.ok = true;
                    res.data = GenerarArchivoExcel_reporteStock(list_detalle, idsuario);
                }

            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }


        public string GenerarArchivoExcel_reporteStock(List<ReporteStock_Reparto_E> listDetalle, int id_usuario)
        {
            string Res = "";
            int _fila = 4;
            string FileRuta = "";
            string FileExcel = "";

            try
            {

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/" + id_usuario + "ReporteStockReparto.xlsx");
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + id_usuario + "ReporteStockReparto.xlsx";
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }


                Thread.Sleep(1);

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("stockReparto");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));


                    oWs.Cells[1, 1].Style.Font.Size = 15; //letra tamaño  2
                    oWs.Cells[1, 1].Value = "REPORTE STOCK";
                    oWs.Cells[1, 1, 1, 8].Merge = true;  // combinar celdaS

                    oWs.Cells[3, 1].Value = "CODIGO";
                    oWs.Cells[3, 2].Value = "DESCRIPCION";
                    oWs.Cells[3, 3].Value = "UM";
                    oWs.Cells[3, 4].Value = "STOCK.";

                    oWs.Cells[3, 5].Value = "PRECIO MENOR.";
                    oWs.Cells[3, 6].Value = "PRECIO MAYOR ";
                    oWs.Cells[3, 7].Value = "USUARIO IMPORTO";
                    oWs.Cells[3, 8].Value = "FECHA IMPORTACION";
 


                    foreach (var item in listDetalle)
                    {
                        oWs.Cells[_fila, 1].Value = item.codigo.ToString();
                        oWs.Cells[_fila, 2].Value = item.descripcion.ToString();
                        oWs.Cells[_fila, 3].Value = item.um.ToString();
                        oWs.Cells[_fila, 4].Value = item.stock.ToString();
                        oWs.Cells[_fila, 4].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                        oWs.Cells[_fila, 4].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right; // alinear texto 


                        oWs.Cells[_fila, 5].Value = item.precioMenor.ToString();
                        oWs.Cells[_fila, 5].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                        oWs.Cells[_fila, 5].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right; // alinear texto 

                        oWs.Cells[_fila, 6].Value = item.precioMayor.ToString();
                        oWs.Cells[_fila, 6].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                        oWs.Cells[_fila, 6].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right; // alinear texto 

                        oWs.Cells[_fila, 7].Value = item.usuarioImporto.ToString();
                        oWs.Cells[_fila, 8].Value = item.fechaImportacion.ToString(); 

                        _fila++;
                    }


                    oWs.Row(1).Style.Font.Bold = true;
                    oWs.Row(1).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(1).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Row(3).Style.Font.Bold = true;
                    oWs.Row(3).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(3).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 8; k++)
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
