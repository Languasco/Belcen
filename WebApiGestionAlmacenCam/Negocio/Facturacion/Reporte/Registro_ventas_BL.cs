using Entidades;
using Entidades.Facturacion.Reporte;
using Negocio.Conexion;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Excel = OfficeOpenXml;
using Style = OfficeOpenXml.Style;

namespace Negocio.Facturacion.Reporte
{
    public class Registro_ventas_BL
    {
        public string ExportarExcel_VentasCliente(int id_local, int id_almacen, int  id_tipoDoc,string  fecha_inicial,string fecha_final)
        {
            string Res = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_REGISTRO_VENTAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_tipoDoc", SqlDbType.Int).Value = id_tipoDoc;
                        cmd.Parameters.Add("@fecha_inicial", SqlDbType.VarChar).Value = fecha_inicial;
                        cmd.Parameters.Add("@fecha_final", SqlDbType.VarChar).Value = fecha_final;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count <= 0)
                            {
                                Res = "0|No hay informacion disponible";
                            }
                            else
                            {
                                Res = GenerarArchivoExcel(dt_detalle);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Res = "-1|" + ex.Message;
            }
            return Res;
        }

        public string GenerarArchivoExcel(DataTable dt_detalles)
        {
            string Res = "";
            string _servidor;
            string _ruta;
            string resultado = "";
            int _fila = 2;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
                _servidor = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/RegistroVentas" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "RegistroVentas" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }
                
                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("RegistroVentas");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 9));

                    for (int i = 1; i <= 35; i++)
                    {
                        oWs.Cells[1, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    }

                        oWs.Cells[1, 1].Value = "Vou.Origen";
                        oWs.Cells[1, 2].Value = "Vou.Numero ";
                        oWs.Cells[1, 3].Value = "Vou.Fecha ";
                        oWs.Cells[1, 4].Value = "Doc ";
                        oWs.Cells[1, 5].Value = "Numero";
                        oWs.Cells[1, 6].Value = "Fec.Doc ";
                        oWs.Cells[1, 7].Value = "Fec.Venc.";
                        oWs.Cells[1, 8].Value = "Codigo";
                        oWs.Cells[1, 9].Value = "Valor Exp.";
                        oWs.Cells[1,10].Value = "B.Imponible";

                        oWs.Cells[1,11].Value = "Inafecto";
                        oWs.Cells[1,12].Value = "Exonerado";
                        oWs.Cells[1,13].Value = "I.S.C.";
                        oWs.Cells[1,14].Value = "IGV";
                        oWs.Cells[1,15].Value = "OTROS TRIB.";
                                        
                        oWs.Cells[1,16].Value = "Moneda";
                        oWs.Cells[1,17].Value = "TC";
                        oWs.Cells[1,18].Value = "Glosa";
                        oWs.Cells[1,19].Value = "Cta Ingreso";
                        oWs.Cells[1,20].Value = "Cta IGV";
   	  	 	    	 	 	  	 	        					  	   	       

                        oWs.Cells[1,21].Value = "Cta O. Trib.";
                        oWs.Cells[1,22].Value = "Cta x Cobrar ";
                        oWs.Cells[1,23].Value = "C.Costo ";
                        oWs.Cells[1,24].Value = "Presupuesto";
                        oWs.Cells[1,25].Value = "R.Doc";

                        oWs.Cells[1,26].Value = "R.numero";
                        oWs.Cells[1,27].Value = "R.Fecha ";
                        oWs.Cells[1,28].Value = "RUC";
                        oWs.Cells[1,29].Value = "R.Social";
                        oWs.Cells[1,30].Value = "Tipo";

                        oWs.Cells[1,31].Value = "Tip.Doc.Iden";
                        oWs.Cells[1,32].Value = "Medio de Pago";
                        oWs.Cells[1,33].Value = "Apellido 1 ";
                        oWs.Cells[1,34].Value = "Apellido 2";
                        oWs.Cells[1,35].Value = "Nombre";
 

                    int ac = 0;
                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
                        ac += 1;
                        for (int j = 1; j <= 35; j++)
                        {
                            oWs.Cells[_fila, j].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, j].Style.Font.Size = 8; //letra tamaño  2
                        }
 
                        oWs.Cells[_fila, 1].Value = oBj["vou_origen"].ToString();
                        oWs.Cells[_fila, 2].Value = ac;
                        oWs.Cells[_fila, 3].Value = oBj["vou_fecha"].ToString();
                        oWs.Cells[_fila, 4].Value = oBj["doc"].ToString();
                        oWs.Cells[_fila, 5].Value = oBj["numero"].ToString();
                        oWs.Cells[_fila, 6].Value = oBj["fec_doc"].ToString();
                        oWs.Cells[_fila, 7].Value = oBj["fec_venc"].ToString();
                        oWs.Cells[_fila, 8].Value = oBj["codigo"].ToString();
                        oWs.Cells[_fila, 9].Value = oBj["valor_exp"].ToString();
                                                
                        oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 10].Value = Math.Round(Convert.ToDecimal(oBj["b_imponible"]), 2);
     
                        oWs.Cells[_fila, 11].Value = oBj["inafecto"].ToString();
                        oWs.Cells[_fila, 12].Value = oBj["exonerado"].ToString();
                        oWs.Cells[_fila, 13].Value = oBj["i_s_c"].ToString();

                        oWs.Cells[_fila, 14].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 14].Value = Math.Round(Convert.ToDecimal(oBj["igv"]), 2);

                        oWs.Cells[_fila, 15].Value = oBj["otros_trib"].ToString();              
                        oWs.Cells[_fila, 16].Value = oBj["moneda"].ToString();
                        oWs.Cells[_fila, 17].Value = oBj["tc"].ToString();
                        oWs.Cells[_fila, 18].Value = oBj["glosa"].ToString();
                        oWs.Cells[_fila, 19].Value = oBj["cta_ingreso"].ToString();
                        oWs.Cells[_fila, 20].Value = oBj["cta_igv"].ToString();
                     
                        oWs.Cells[_fila, 21].Value = oBj["cta_o_trib"].ToString();
                        oWs.Cells[_fila, 22].Value = oBj["cta_x_cobrar"].ToString();
                        oWs.Cells[_fila, 23].Value = oBj["c_costo"].ToString();
                        oWs.Cells[_fila, 24].Value = oBj["presupuesto"].ToString();
                        oWs.Cells[_fila, 25].Value = oBj["r_doc"].ToString();
                   
                        oWs.Cells[_fila, 26].Value = oBj["r_numero"].ToString();
                        oWs.Cells[_fila, 27].Value = oBj["r_fecha"].ToString();
                        oWs.Cells[_fila, 28].Value = oBj["ruc"].ToString();
                        oWs.Cells[_fila, 29].Value = oBj["r_social"].ToString();
                        oWs.Cells[_fila, 30].Value = oBj["tipo"].ToString();
                  
                        oWs.Cells[_fila, 31].Value = oBj["tip_doc_iden"].ToString();
                        oWs.Cells[_fila, 32].Value = oBj["medio_pago"].ToString();
                        oWs.Cells[_fila, 33].Value = oBj["apellido_1"].ToString();
                        oWs.Cells[_fila, 34].Value = oBj["apellido_2"].ToString();
                        oWs.Cells[_fila, 35].Value = oBj["nombre"].ToString();

                       _fila++;
                    }

                    oWs.Row(1).Style.Font.Bold = true;
                    oWs.Row(1).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(1).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 35; k++)
                    {
                        oWs.Column(k).AutoFit();
                    }
                    oEx.Save();
                }

                Res = "1|" + FileExcel;
            }
            catch (Exception ex)
            {
                Res = "0|" + ex.Message;
            }
            return Res;
        }

        public string ExportarExcel_ResumenVentas(int id_PuntoVenta, int id_lineaProducto, int id_marcaProducto, int id_Tiporep, string fecha_inicial, string fecha_final, int id_usuario)
        {
            string Res = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_RESUMEN_VENTAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_PuntoVenta", SqlDbType.Int).Value = id_PuntoVenta;
                        cmd.Parameters.Add("@id_lineaProducto", SqlDbType.Int).Value = id_lineaProducto;
                        cmd.Parameters.Add("@id_marcaProducto", SqlDbType.Int).Value = id_marcaProducto;
                        cmd.Parameters.Add("@id_Tiporep", SqlDbType.Int).Value = id_Tiporep;
                        cmd.Parameters.Add("@fecha_inicial", SqlDbType.VarChar).Value = fecha_inicial;
                        cmd.Parameters.Add("@fecha_final", SqlDbType.VarChar).Value = fecha_final;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count <= 0)
                            {
                                Res = "0|No hay informacion disponible";
                            }
                            else
                            {
                                if (id_Tiporep == 1)  //---- detallados
                                {
                                    Res = GenerarArchivoExcel_detallado_ventas(dt_detalle, id_usuario);
                                }
                                else
                                { //---- Resumido
                                    Res = GenerarArchivoExcel_resumen_ventas(dt_detalle, id_usuario);
                                }

                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Res = "-1|" + ex.Message;
            }
            return Res;
        }
        
        public string GenerarArchivoExcel_detallado_ventas(DataTable dt_detalles, int id_usuario)
        {
            string Res = "";
            int _fila = 4;
            string FileRuta = "";
            string FileExcel = "";

            try
            {

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/" + id_usuario + "_Registro_Ventas_detalle.xlsx");
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + id_usuario + "_Registro_Ventas_detalle.xlsx";
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("Registro_Ventas_detalle");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 9));

                    for (int i = 1; i <= 15; i++)
                    {
                        oWs.Cells[1, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                        oWs.Cells[2, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                        oWs.Cells[3, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    }



                    oWs.Cells[1, 1].Style.Font.Size = 24; //letra tamaño  2
                    oWs.Cells[1, 1].Value = "REPORTE DE VENTAS";
                    oWs.Cells[1, 1, 1, 15].Merge = true;  // combinar celdaS

                    oWs.Cells[2, 1].Value = "";
                    oWs.Cells[2, 1, 2, 2].Merge = true;  // combinar celdaS

                    oWs.Cells[2, 3].Value = "INFORMACION DEL PRODUCTO";
                    oWs.Cells[2, 3, 2, 5].Merge = true;  // combinar celdaS

                    oWs.Cells[2, 6].Value = "COMPROBANTE DE VENTA";
                    oWs.Cells[2, 6, 2, 8].Merge = true;  // combinar celdaS

                    oWs.Cells[2, 9].Value = "CLIENTE";
                    oWs.Cells[2, 9, 2, 10].Merge = true;  // combinar celdaS 

                    oWs.Cells[2, 11].Value = "";
                    oWs.Cells[2, 11, 2, 15].Merge = true;  // combinar celdaS 

                    oWs.Cells[3, 1].Value = "PUNTO DE VENTA";
                    oWs.Cells[3, 2].Value = "ENCARGADO - VENDEDOR";
                    oWs.Cells[3, 3].Value = "FAMILIA";
                    oWs.Cells[3, 4].Value = "MARCA";
                    oWs.Cells[3, 5].Value = "DESCRIPCION";
                    oWs.Cells[3, 6].Value = "FECHA EMISION";
                    oWs.Cells[3, 7].Value = "TIPO";
                    oWs.Cells[3, 8].Value = "SERIE-NUM";
                    oWs.Cells[3, 9].Value = "DOC. IDENTIDAD";
                    oWs.Cells[3, 10].Value = "NOMBRE /RAZON SOCIAL";
                    oWs.Cells[3, 11].Value = "CANT.";
                    oWs.Cells[3, 12].Value = "P.U";
                    oWs.Cells[3, 13].Value = "SUB. TOTAL";
                    oWs.Cells[3, 14].Value = "IGV";
                    oWs.Cells[3, 15].Value = "TOTAL.";

                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
                        for (int j = 1; j <= 15; j++)
                        {
                            //oWs.Cells[_fila, j].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, j].Style.Font.Size = 8; //letra tamaño  2
                        }

                        oWs.Cells[_fila, 1].Value = oBj["punto_venta"].ToString();
                        oWs.Cells[_fila, 2].Value = oBj["vendedor"].ToString();
                        oWs.Cells[_fila, 3].Value = oBj["familia"].ToString();
                        oWs.Cells[_fila, 4].Value = oBj["marca"].ToString();
                        oWs.Cells[_fila, 5].Value = oBj["descripcion_producto"].ToString();
                        oWs.Cells[_fila, 6].Value = oBj["fecha_emision"].ToString();
                        oWs.Cells[_fila, 7].Value = oBj["tipo"].ToString();
                        oWs.Cells[_fila, 8].Value = oBj["serie_numero"].ToString();
                        oWs.Cells[_fila, 9].Value = oBj["doc_identidad"].ToString();
                        oWs.Cells[_fila, 10].Value = oBj["razon_social"].ToString();

                        oWs.Cells[_fila, 11].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 11].Value = Math.Round(Convert.ToDecimal(oBj["cantidad"]), 2);

                        oWs.Cells[_fila, 12].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 12].Value = Math.Round(Convert.ToDecimal(oBj["precio_unitario"]), 2);

                        oWs.Cells[_fila, 13].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 13].Value = Math.Round(Convert.ToDecimal(oBj["subtotal"]), 2);

                        oWs.Cells[_fila, 14].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 14].Value = Math.Round(Convert.ToDecimal(oBj["igv"]), 2);

                        oWs.Cells[_fila, 15].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 15].Value = Math.Round(Convert.ToDecimal(oBj["total"]), 2);

                        _fila++;
                    }

                    oWs.Cells[_fila, 13].Style.Font.Bold = true;
                    oWs.Cells[_fila, 13].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila, 13].Value = Convert.ToDecimal(dt_detalles.Compute("Sum(subtotal)", ""));

                    oWs.Cells[_fila, 14].Style.Font.Bold = true;
                    oWs.Cells[_fila, 14].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila, 14].Value = Convert.ToDecimal(dt_detalles.Compute("Sum(igv)", ""));

                    oWs.Cells[_fila, 15].Style.Font.Bold = true;
                    oWs.Cells[_fila, 15].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila, 15].Value = Convert.ToDecimal(dt_detalles.Compute("Sum(total)", ""));



                    oWs.Row(1).Style.Font.Bold = true;
                    oWs.Row(1).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(1).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Row(2).Style.Font.Bold = true;
                    oWs.Row(2).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(2).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Row(3).Style.Font.Bold = true;
                    oWs.Row(3).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(3).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 15; k++)
                    {
                        oWs.Column(k).AutoFit();
                    }
                    oEx.Save();
                }

                Res = "1|" + FileExcel;
            }
            catch (Exception ex)
            {
                Res = "0|" + ex.Message;
            }
            return Res;
        }
        
        public string GenerarArchivoExcel_resumen_ventas(DataTable dt_detalles, int id_usuario)
        {
            string Res = "";
            int _fila = 4;
            string FileRuta = "";
            string FileExcel = "";

            try
            {

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/"+ id_usuario + "_Registro_Ventas_resumen.xlsx");
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + id_usuario + "_Registro_Ventas_resumen.xlsx";
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("Registro_Ventas_resumen");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 9));

                    for (int i = 1; i <= 9; i++)
                    {
                        oWs.Cells[1, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                        oWs.Cells[2, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                        oWs.Cells[3, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    }

                    oWs.Cells[1, 1].Style.Font.Size = 24; //letra tamaño  2
                    oWs.Cells[1, 1].Value = "REPORTE DE VENTAS";
                    oWs.Cells[1, 1, 1, 9].Merge = true;  // combinar celdaS
                    
                    oWs.Cells[2, 1].Value = "";
                    oWs.Cells[2, 1, 2, 2].Merge = true;  // combinar celdaS

                    oWs.Cells[2, 3].Value = "INFORMACION DEL PRODUCTO";
                    oWs.Cells[2, 3, 2, 5].Merge = true;  // combinar celdaS


                    oWs.Cells[2, 6].Value = "";
                    oWs.Cells[2, 6, 2, 9].Merge = true;  // combinar celdaS 
                       
                    oWs.Cells[3, 1].Value = "PUNTO DE VENTA";
                    oWs.Cells[3, 2].Value = "ENCARGADO - VENDEDOR";
                    oWs.Cells[3, 3].Value = "FAMILIA";
                    oWs.Cells[3, 4].Value = "MARCA";
                    oWs.Cells[3, 5].Value = "DESCRIPCION";
                    oWs.Cells[3, 6].Value = "FECHA EMISION";
                       
                    oWs.Cells[3, 7].Value = "CANT.";
                    oWs.Cells[3, 8].Value = "P.U (Promedio)";
                    oWs.Cells[3, 9].Value = "TOTAL.";

                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
                        for (int j = 1; j <= 9; j++)
                        {
                            //oWs.Cells[_fila, j].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, j].Style.Font.Size = 8; //letra tamaño  2
                        }

                        oWs.Cells[_fila, 1].Value = oBj["punto_venta"].ToString();
                        oWs.Cells[_fila, 2].Value = oBj["vendedor"].ToString();
                        oWs.Cells[_fila, 3].Value = oBj["familia"].ToString();
                        oWs.Cells[_fila, 4].Value = oBj["marca"].ToString();
                        oWs.Cells[_fila, 5].Value = oBj["descripcion_producto"].ToString();
                        oWs.Cells[_fila, 6].Value = oBj["fecha_emision"].ToString();

                        oWs.Cells[_fila, 7].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 7].Value = Math.Round(Convert.ToDecimal(oBj["cantidad"]), 2);

                        oWs.Cells[_fila, 8].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 8].Value = Math.Round(Convert.ToDecimal(oBj["precio_unitario"]), 2);

                        oWs.Cells[_fila, 9].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 9].Value = Math.Round(Convert.ToDecimal(oBj["total"]), 2);

                        _fila++;
                    }

                    oWs.Cells[_fila, 9].Style.Font.Bold = true;
                    oWs.Cells[_fila, 9].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila, 9].Value = Convert.ToDecimal(dt_detalles.Compute("Sum(total)", ""));
                                       
                    oWs.Row(1).Style.Font.Bold = true;
                    oWs.Row(1).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(1).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Row(2).Style.Font.Bold = true;
                    oWs.Row(2).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(2).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Row(3).Style.Font.Bold = true;
                    oWs.Row(3).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(3).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 9; k++)
                    {
                        oWs.Column(k).AutoFit();
                    }
                    oEx.Save();
                }

                Res = "1|" + FileExcel;
            }
            catch (Exception ex)
            {
                Res = "0|" + ex.Message;
            }
            return Res;
        }
        
        public class Resultado
        {
            public bool ok { get; set; }
            public object data { get; set; }
        }

        public object generarReporte_detalleDocumentos(int id_Anexos, int id_local, int id_almacen, int id_zona, string fechaIni, string fechaFin, int id_tipoDoc, int id_usuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_REPORTE_DETALLE_DOCUMENTOS_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_anexo", SqlDbType.Int).Value = id_Anexos;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;

                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@tipo_doc", SqlDbType.Int).Value = id_tipoDoc;

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
                                res.data = GenerarArchivoExcel_detalleDocumentos(dt_detalle,id_usuario);
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

        public string GenerarArchivoExcel_detalleDocumentos(DataTable dt_detalles, int id_usuario)
        {
            string Res = "";
            int _fila = 8;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/" + id_usuario + "_detalleDocumentos.xlsx");
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + id_usuario + "_detalleDocumentos.xlsx";
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("detalleDocumentos");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));


                    oWs.Cells[1, 1].Value = dt_detalles.Rows[0]["empresa"].ToString();
                    oWs.Cells[2, 1].Value = dt_detalles.Rows[0]["ruc"].ToString();
                    oWs.Cells[3, 1].Value = dt_detalles.Rows[0]["periodo"].ToString();

                    oWs.Cells[5, 1, 5, 11].Merge = true;  // combinar celdaS dt
                    oWs.Cells[5, 1].Value = dt_detalles.Rows[0]["tituloReporte"].ToString();
                    oWs.Cells[5, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[5, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[5, 1].Style.Font.Bold = true; //Letra negrita 

                    for (int i = 1; i <= 11; i++)
                    {
                        oWs.Cells[7, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    } 

                    oWs.Cells[7, 1].Value = "FECHA";
                    oWs.Cells[7, 2].Value = "TIPO DOC";
                    oWs.Cells[7, 3].Value = "NRO DOC";
 
                    oWs.Cells[7, 4].Value = "VALOR VENTA";
                    oWs.Cells[7, 5].Value = "IMPUESTO IGV";
                    oWs.Cells[7, 6].Value = "IMPORTE TOTAL"; 
 
                    oWs.Cells[7, 7].Value = "NRO. DE RUC/DNI";
                    oWs.Cells[7, 8].Value = "RAZON  SOCIAL  ";
                    oWs.Cells[7, 9].Value = "VENDEDOR";
                    oWs.Cells[7, 10].Value = "NOMBRE VENDEDOR";
                    oWs.Cells[7, 11].Value = "ZONA";

                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
                        oWs.Cells[_fila, 1].Value = oBj["fecha"].ToString();
                        oWs.Cells[_fila, 2].Value = oBj["tipoDoc"].ToString();
                        oWs.Cells[_fila, 3].Value = oBj["nroDoc"].ToString();


                        oWs.Cells[_fila, 4].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 4].Value = Math.Round(Convert.ToDecimal(oBj["valorVenta"]), 2);

                        oWs.Cells[_fila, 5].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 5].Value = Math.Round(Convert.ToDecimal(oBj["impuestoIgv"]), 2);

                        oWs.Cells[_fila, 6].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 6].Value = Math.Round(Convert.ToDecimal(oBj["importeTotal"]), 2);

                        oWs.Cells[_fila, 7].Value = oBj["nroRuc"].ToString();
                        oWs.Cells[_fila, 8].Value = oBj["razonSocial"].ToString();
                        oWs.Cells[_fila, 9].Value = oBj["codigoVendedor"].ToString();
                        oWs.Cells[_fila, 10].Value = oBj["vendedor"].ToString();
                        oWs.Cells[_fila, 11].Value = oBj["zona"].ToString();

                        _fila++;
                    }

                    //oWs.Cells[_fila, 9].Style.Font.Bold = true;
                    //oWs.Cells[_fila, 9].Style.Numberformat.Format = "#,##0.00";
                    //oWs.Cells[_fila, 9].Value = Convert.ToDecimal(dt_detalles.Compute("Sum(total)", ""));

                    oWs.Row(7).Style.Font.Bold = true;
                    oWs.Row(7).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(7).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center; 

                    for (int k = 1; k <= 11; k++)
                    {
                        oWs.Column(k).AutoFit();
                    }
                    oEx.Save();
                }

                Res =  FileExcel;
            }
            catch (Exception)
            {
                throw;
            }
            return Res;
        }
        
        public object generarReporte_detalleArticulos(int id_Anexos, int  id_local, int id_almacen, int  id_zona, string fechaIni, string  fechaFin, int id_tipoDoc, int id_usuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_REPORTE_DETALLE_PRODUCTOS_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_anexo", SqlDbType.Int).Value = id_Anexos;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;

                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@tipo_doc", SqlDbType.Int).Value = id_tipoDoc;

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
                                res.data = GenerarArchivoExcel_detalleArticulos(dt_detalle, id_usuario);
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

        public string GenerarArchivoExcel_detalleArticulos(DataTable dt_detalles, int id_usuario)
        {
            string Res = "";
            int _fila = 8;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/" + id_usuario + "_detalleArticulos.xlsx");
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + id_usuario + "_detalleArticulos.xlsx";
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("detalleArticulos");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    
                    oWs.Cells[1, 1].Value = dt_detalles.Rows[0]["empresa"].ToString();
                    oWs.Cells[2, 1].Value = dt_detalles.Rows[0]["ruc"].ToString();
                    oWs.Cells[3, 1].Value = dt_detalles.Rows[0]["periodo"].ToString();
                    
                    oWs.Cells[5, 1, 5, 16].Merge = true;  // combinar celdaS dt
                    oWs.Cells[5, 1].Value = dt_detalles.Rows[0]["tituloReporte"].ToString();
                    oWs.Cells[5, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[5, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[5, 1].Style.Font.Bold = true; //Letra negrita 
                                          

                    for (int i = 1; i <= 16; i++)
                    {
                        oWs.Cells[7, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    }

                    oWs.Cells[7, 1].Value = "FECHA";
                    oWs.Cells[7, 2].Value = "TIPO DOC.";
                    oWs.Cells[7, 3].Value = "NRO. DOCUMENTO";
                    oWs.Cells[7, 4].Value = "COD. CLIENTE";
                    oWs.Cells[7, 5].Value = "RAZON  SOCIAL ";

                    oWs.Cells[7, 6].Value = "MARCA ";
                    oWs.Cells[7, 7].Value = "LINEA ";
                    
                    oWs.Cells[7, 8].Value = "COD. ART";
                    oWs.Cells[7, 9].Value = "DESCRIPCION ART.";
                    oWs.Cells[7, 10].Value = "UNIDAD MEDIDA VENTA";

                    oWs.Cells[7, 11].Value = "CANTIDAD";
                    oWs.Cells[7, 12].Value = "P. UNIT.";
                    oWs.Cells[7, 13].Value = "TOTAL";
                     
                    oWs.Cells[7, 14].Value = "VENDEDOR";
                    oWs.Cells[7, 15].Value = "NOMBRE DEL VENDEDOR";
                    oWs.Cells[7, 16].Value = "ZONA";
    
                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
                        oWs.Cells[_fila, 1].Value = oBj["fecha"].ToString();
                        oWs.Cells[_fila, 2].Value = oBj["tipoDoc"].ToString();
                        oWs.Cells[_fila, 3].Value = oBj["nroDoc"].ToString();
                        oWs.Cells[_fila, 4].Value = oBj["codCliente"].ToString();
                        oWs.Cells[_fila, 5].Value = oBj["razonSocial"].ToString();
                        oWs.Cells[_fila, 6].Value = oBj["marca"].ToString();
                        oWs.Cells[_fila, 7].Value = oBj["linea"].ToString();

                        oWs.Cells[_fila, 8].Value = oBj["codArticulo"].ToString();
                        oWs.Cells[_fila, 9].Value = oBj["descripcionArticulo"].ToString();
                        oWs.Cells[_fila, 10].Value = oBj["unidad"].ToString();              
       
                        oWs.Cells[_fila, 11].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 11].Value = Math.Round(Convert.ToDecimal(oBj["cantidad"]), 2);

                        oWs.Cells[_fila, 12].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 12].Value = Math.Round(Convert.ToDecimal(oBj["precioUnitario"]), 2);

                        oWs.Cells[_fila, 13].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 13].Value = Math.Round(Convert.ToDecimal(oBj["total"]), 2);
                         
                        oWs.Cells[_fila, 14].Value = oBj["codigoVendedor"].ToString();
                        oWs.Cells[_fila, 15].Value = oBj["vendedor"].ToString();
                        oWs.Cells[_fila, 16].Value = oBj["zona"].ToString();

                        _fila++;
                    }


                    oWs.Row(7).Style.Font.Bold = true;
                    oWs.Row(7).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(7).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 16; k++)
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
