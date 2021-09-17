using Entidades.Cobranzas;
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
using System.Threading;
using System.Threading.Tasks;
using Excel = OfficeOpenXml;
using Style = OfficeOpenXml.Style;

namespace Negocio.Cobranza
{
    public class Reporte_BL
    {
        // GET: CobranzaReporte
        public List<CobranzaReporte_E> get_reporteCobranza(int id_Anexo, int id_ZonaVenta, int id_Vendedor, string buscarNombre, string fechaInicio, string fechaFinal)
        {
            List<CobranzaReporte_E> list_detalle = new List<CobranzaReporte_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_FACTURACION_COBRANZA_REPORTE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idAnexo", SqlDbType.Int).Value = id_Anexo;
                        cmd.Parameters.Add("@idZonaVenta", SqlDbType.Int).Value = id_ZonaVenta;
                        cmd.Parameters.Add("@idVendedor", SqlDbType.Int).Value = id_Vendedor;
                        cmd.Parameters.Add("@buscarNombre", SqlDbType.VarChar).Value = buscarNombre;
                        cmd.Parameters.Add("@fechaInicio", SqlDbType.VarChar).Value = fechaInicio;
                        cmd.Parameters.Add("@fechaFinal", SqlDbType.VarChar).Value = fechaFinal;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                CobranzaReporte_E obj_entidad = new CobranzaReporte_E();

                                obj_entidad.anexo = dr["anexo"].ToString();
                                obj_entidad.zona_venta = dr["zona_venta"].ToString();
                                obj_entidad.vendedor = dr["vendedor"].ToString();
                                obj_entidad.fecha_emision = dr["fecha_emision"].ToString();
                                obj_entidad.tipo_doc = dr["tipo_doc"].ToString();

                                obj_entidad.serie = dr["serie"].ToString();
                                obj_entidad.numero = dr["numero"].ToString();
                                obj_entidad.tipo_factura = dr["tipo_factura"].ToString();
                                obj_entidad.doc_cliente = dr["doc_cliente"].ToString();
                                obj_entidad.nombre_cliente = dr["nombre_cliente"].ToString();
                                                    
                                obj_entidad.total_facturado = dr["total_facturado"].ToString();
                                obj_entidad.total_pagado = dr["total_pagado"].ToString();
                                obj_entidad.saldo_pendiente = dr["saldo_pendiente"].ToString();

                                obj_entidad.fecha_ultimo_pago = dr["fecha_ultimo_pago"].ToString();
                                obj_entidad.tiempo_vencimiento = dr["tiempo_vencimiento"].ToString();
                                obj_entidad.numero_cobranza = dr["numero_cobranza"].ToString();

                                obj_entidad.totalGeneral_Facturado = dr["totalGeneral_Facturado"].ToString();
                                obj_entidad.totalGeneral_Pagado = dr["totalGeneral_Pagado"].ToString();
                                obj_entidad.totalGeneral_Pendiente = dr["totalGeneral_Pendiente"].ToString();

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


        public object get_descargarReporteCobranza(int id_Anexo, int id_ZonaVenta, int id_Vendedor, string buscarNombre, string fechaInicio, string fechaFinal, int id_Usuario)
        {
            Result res = new Result();
            try
            {

                List<CobranzaReporte_E> list_detalle = new List<CobranzaReporte_E>();

                list_detalle = get_reporteCobranza(id_Anexo, id_ZonaVenta, id_Vendedor, buscarNombre, fechaInicio, fechaFinal);

                if (list_detalle.Count <= 0)
                {
                    res.ok = false;
                    res.data = "0|No hay informacion disponible";
                }
                else
                {
                    res.ok = true;
                    res.data = GenerarArchivoExcel_reporteCobranza(list_detalle, id_Usuario, fechaInicio, fechaFinal);
                }

            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }


        public string GenerarArchivoExcel_reporteCobranza(List<CobranzaReporte_E> listDetalle, int id_usuario, string fechaInicio, string fechaFinal)
        {
            string Res = "";
            int _fila = 11;
            string FileRuta = "";
            string FileExcel = "";

            try
            {

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/" + id_usuario + "ReporteCobranza.xlsx");
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + id_usuario + "ReporteCobranza.xlsx";
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
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 9));

                    decimal facturado = 0;
                    decimal pagado = 0;
                    decimal pendiente = 0;


                    oWs.Cells[2, 1].Style.Font.Size = 15; //letra tamaño  2
                    oWs.Cells[2, 1].Value = "ANALISIS DE COBRANZAS POR VENDEDOR Y DOCUMENTO" ;
                    oWs.Cells[2, 1, 2, 12].Merge = true;  // combinar celdaS

                    oWs.Cells[4, 1].Style.Font.Size = 13;
                    oWs.Cells[4, 1].Value = "Rango de Fechas del " + fechaInicio + " al "+fechaFinal;
                    oWs.Cells[4, 1, 4, 12].Merge = true;  // combinar celdaS

                    oWs.Cells[6, 1].Value = "Anexo : " + listDetalle[0].anexo;
                    oWs.Cells[6, 1].Style.Font.Bold = true;
                    oWs.Cells[7, 1].Value = "Zona de Venta : " + listDetalle[0].zona_venta;
                    oWs.Cells[7, 1].Style.Font.Bold = true;
                    oWs.Cells[8, 1].Value = "Vendedor : " + listDetalle[0].vendedor;
                    oWs.Cells[8, 1].Style.Font.Bold = true;

                    oWs.Cells[10, 1].Value = "Fecha Emision";
                    oWs.Cells[10, 2].Value = "Tipo Doc.";
                    oWs.Cells[10, 3].Value = "Serie";
                    oWs.Cells[10, 4].Value = "Numero"; 
                    oWs.Cells[10, 5].Value = "Doc. Identidad Cliente";
                    oWs.Cells[10, 6].Value = "Nombre Cliente / Razon Social";
                    oWs.Cells[10, 7].Value = "Fecha de Ultimo Pago";
                
                    oWs.Cells[10, 8].Value = "Total Facturado";
                    oWs.Cells[10, 9].Value = "Total Pagado";
                    oWs.Cells[10, 10].Value = "Saldo Pendiente";
                    oWs.Cells[10, 11].Value = "Tiempo de Vencimiento";
                    oWs.Cells[10, 12].Value = "Número de Cobranza";

                    for (int i = 1; i <= 12; i++)
                    {
                        oWs.Cells[10, i].Style.Border.BorderAround(Style.ExcelBorderStyle.Thin);
                    }

                    foreach (var item in listDetalle)
                    {
                        //oWs.Cells[_fila, 1].Value = item.anexo;
                        //oWs.Cells[_fila, 2].Value = item.zona_venta;
                        //oWs.Cells[_fila, 3].Value = item.vendedor;

                        oWs.Cells[_fila, 1].Value = item.fecha_emision;
                        oWs.Cells[_fila, 2].Value = item.tipo_doc;
                        oWs.Cells[_fila, 3].Value = item.serie;
                        oWs.Cells[_fila, 4].Value = item.numero;
                        oWs.Cells[_fila, 5].Value = item.doc_cliente;
                        oWs.Cells[_fila, 6].Value = item.nombre_cliente; 
                        oWs.Cells[_fila, 7].Value = item.fecha_ultimo_pago;

                        oWs.Cells[_fila, 8].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 8].Value = Convert.ToDouble(item.total_facturado.ToString());
                        oWs.Cells[_fila, 8].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 9].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 9].Value = Convert.ToDouble(item.total_pagado.ToString());
                        oWs.Cells[_fila, 9].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 10].Value = Convert.ToDouble(item.saldo_pendiente.ToString());
                        oWs.Cells[_fila, 10].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 11].Value = item.tiempo_vencimiento;
                        oWs.Cells[_fila, 12].Value = item.numero_cobranza;

                        //facturado += item.total_facturado.ToString() != "" ? Convert.ToDecimal(item.total_facturado.ToString()) : 0;
                        //pagado += item.total_pagado.ToString() != "" ? Convert.ToDecimal(item.total_pagado.ToString()) : 0;
                        //pendiente += item.saldo_pendiente.ToString() != "" ? Convert.ToDecimal(item.saldo_pendiente.ToString()) : 0;                        

                        _fila++;
                    }


                    facturado = listDetalle[0].totalGeneral_Facturado.ToString() != "" ? Convert.ToDecimal(listDetalle[0].totalGeneral_Facturado.ToString()) : 0;
                    pagado = listDetalle[0].totalGeneral_Pagado.ToString() != "" ? Convert.ToDecimal(listDetalle[0].totalGeneral_Pagado.ToString()) : 0;
                    pendiente = listDetalle[0].totalGeneral_Pendiente.ToString() != "" ? Convert.ToDecimal(listDetalle[0].totalGeneral_Pendiente.ToString()) : 0;

                    oWs.Cells[_fila + 2, 7].Value = "Total General";
                    oWs.Cells[_fila + 2, 7].Style.Border.BorderAround(Style.ExcelBorderStyle.Thin);

                    oWs.Cells[_fila + 2, 8].Style.Font.Bold = true;
                    oWs.Cells[_fila + 2, 8].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila + 2, 8].Value = facturado;
                    oWs.Cells[_fila + 2, 8].Style.Border.BorderAround(Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila + 2, 8].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                    oWs.Cells[_fila + 2, 9].Style.Font.Bold = true;
                    oWs.Cells[_fila + 2, 9].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila + 2, 9].Value = pagado;
                    oWs.Cells[_fila + 2, 9].Style.Border.BorderAround(Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila + 2, 9].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                    oWs.Cells[_fila + 2, 10].Style.Font.Bold = true;
                    oWs.Cells[_fila + 2, 10].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila + 2, 10].Value = pendiente;
                    oWs.Cells[_fila + 2, 10].Style.Border.BorderAround(Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila + 2, 10].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                    oWs.Cells[_fila + 2, 7, _fila + 2, 10].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    oWs.Cells[_fila + 2, 7, _fila + 2, 10].Style.Fill.BackgroundColor.SetColor(Color.Yellow);
                    oWs.Cells[_fila + 2, 7, _fila + 2, 10].Style.Font.Bold = true;


                    oWs.Row(2).Style.Font.Bold = true;
                    oWs.Row(2).Style.Font.UnderLine = true;
                    oWs.Row(2).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(2).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Row(4).Style.Font.Bold = true;
                    oWs.Row(4).Style.Font.UnderLine = true;
                    oWs.Row(4).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(4).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;


                    oWs.Row(10).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(10).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Row(10).Style.Font.Bold = true;

                    for (int k = 1; k <= 13; k++)
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
