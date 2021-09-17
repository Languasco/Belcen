using Entidades;
using Entidades.Facturacion.Reporte;
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

namespace Negocio.Facturacion.Reporte
{
    public class PagosVendedor_BL
    {
        public List<PagosVendedor_E> Listando_PagosVendedor(int id_vendedor ,  string fecha_inicial ,string  fecha_final  )
        {
            try
            {
                List<PagosVendedor_E> obj_List = new List<PagosVendedor_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_FACTURACION_REPORTE_PAGOS_VENDEDOR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;
                        cmd.Parameters.Add("@fecha_inicial", SqlDbType.VarChar).Value = fecha_inicial;
                        cmd.Parameters.Add("@fecha_final", SqlDbType.VarChar).Value = fecha_final;
   

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                PagosVendedor_E Entidad = new PagosVendedor_E();

                                Entidad.id_Factura_Cab = Convert.ToInt32(row["id_Factura_Cab"].ToString());
                                    Entidad.id_vendedor=  Convert.ToInt32(row["id_vendedor"].ToString());
                                    Entidad.personal = row["personal"].ToString();
                                    Entidad.lugar_distribucion = row["lugar_distribucion"].ToString();
                                    Entidad.fecha = row["fecha"].ToString();
                                    Entidad.nro_recibo = row["nro_recibo"].ToString();
                                    Entidad.tipo = row["tipo"].ToString();
                                    Entidad.pago_recibo_cuenta = Convert.ToDecimal(row["pago_recibo_cuenta"].ToString());
                                    Entidad.saldo_total = Convert.ToDecimal(row["saldo_total"].ToString());
                                    Entidad.voucher = row["voucher"].ToString();
 
                                obj_List.Add(Entidad);
                            }
                        }
                    }
                    cn.Close();
                }

                return obj_List;
            }
            catch (Exception e)
            {

                throw e;
            }
        }
        public List<PagosVendedor_New_E> Listando_PagosCliente(int tipo, int id_busqueda, string nro_Doc, string fecha_inicial, string fecha_final, int idAnexo, int idZona)
        {
            try
            {
                List<PagosVendedor_New_E> obj_List = new List<PagosVendedor_New_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_FACTURACION_REPORTE_PAGOS_CLIENTE_II", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@tipo", SqlDbType.Int).Value = tipo;
                        cmd.Parameters.Add("@id_busqueda", SqlDbType.Int).Value = id_busqueda;
                        cmd.Parameters.Add("@Nro_Doc", SqlDbType.VarChar).Value = nro_Doc;
                        cmd.Parameters.Add("@fechaInicio", SqlDbType.VarChar).Value = fecha_inicial;

                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fecha_final;
                        cmd.Parameters.Add("@idAnexo", SqlDbType.Int).Value = idAnexo;
                        cmd.Parameters.Add("@idZona", SqlDbType.Int).Value = idZona;

                        using (SqlDataReader row = cmd.ExecuteReader())
                        {
                            while (row.Read())
                            {
                                PagosVendedor_New_E Entidad = new PagosVendedor_New_E();

                                Entidad.anexo = row["anexo"].ToString();
                                Entidad.zona = row["zona"].ToString();
                                Entidad.vendedor = row["vendedor"].ToString();
                                Entidad.fechaEmision = row["fechaEmision"].ToString();
                                Entidad.tipoDoc = row["tipoDoc"].ToString();

                                Entidad.serie = row["serie"].ToString();
                                Entidad.numero = row["numero"].ToString();
                                Entidad.docIdentidadCliente = row["docIdentidadCliente"].ToString();
                                Entidad.nombreCliente = row["nombreCliente"].ToString();
                                Entidad.totalFacturado = row["totalFacturado"].ToString();
                                Entidad.totalPagado = row["totalPagado"].ToString();
                                Entidad.saldoPendiente = row["saldoPendiente"].ToString();

                                obj_List.Add(Entidad);

                            }
                        }
                    }
                    cn.Close();
                }

                return obj_List;
            }
            catch (Exception e)
            {

                throw e;
            }
        }

        public List<PagosVendedor_E> Listando_CierreVentas_vendedor(int tipo, int id_busqueda, String nro_Doc, String fecha_inicial, String fecha_final, int idAnexo, int idZona)
        {
            try
            {
                List<PagosVendedor_E> obj_List = new List<PagosVendedor_E>();
                //Agregando 
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_FACTURACION_REPORTE_PAGOS_V_CIERRE_VENTA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@tipo", SqlDbType.Int).Value = tipo;
                        cmd.Parameters.Add("@id_cliente", SqlDbType.Int).Value = id_busqueda;
                        cmd.Parameters.Add("@Nro_Doc", SqlDbType.VarChar).Value = nro_Doc;
                        cmd.Parameters.Add("@fecha_inicial", SqlDbType.VarChar).Value = fecha_inicial;
                        cmd.Parameters.Add("@fecha_final", SqlDbType.VarChar).Value = fecha_final;
                        cmd.Parameters.Add("@idAnexo", SqlDbType.Int).Value = idAnexo;
                        cmd.Parameters.Add("@idZona", SqlDbType.Int).Value = idZona;

                        //subiendo cambios
                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                PagosVendedor_E Entidad = new PagosVendedor_E();
                                  
                                Entidad.fechaemision = row["fechaemision"].ToString();
                                Entidad.nrodoc = row["nrodoc"].ToString();
                                Entidad.razonSocial_Cliente = row["Cliente"].ToString();
                                Entidad.id_vendedor = Convert.ToInt32(row["id_vendedor"].ToString());
                                Entidad.Vendedor = row["Vendedor"].ToString();
                                Entidad.tipo = row["tipo"].ToString();
                                Entidad.monto = Convert.ToDecimal(row["monto"].ToString());
                                Entidad.pago_recibo_cuenta = Convert.ToDecimal(row["pago_recibo_cuenta"].ToString());
                                Entidad.saldo_total = Convert.ToDecimal(row["saldo_total"].ToString());
                                Entidad.nrovoucher = row["nrovoucher"].ToString();

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

        public List<PagosVendedor_E> get_ListaFotos(int idfactura)
        {
            try
            {
                List<PagosVendedor_E> obj_List = new List<PagosVendedor_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_FACTURACION_REPORTE_PAGOS_VOUCHER", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_FacCab", SqlDbType.Int).Value = idfactura;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                PagosVendedor_E Entidad = new PagosVendedor_E();

                                Entidad.url = row["url"].ToString();
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
        

        public object generarReporte_cuentasCobrar(int tipo, int id_busqueda, String nro_Doc, String fecha_inicial, String fecha_final, int idAnexo, int idZona)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_FACTURACION_REPORTE_PAGOS_COBRANZA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@tipo", SqlDbType.Int).Value = tipo;
                        cmd.Parameters.Add("@id_cliente", SqlDbType.Int).Value = id_busqueda;
                        cmd.Parameters.Add("@Nro_Doc", SqlDbType.VarChar).Value = nro_Doc;
                        cmd.Parameters.Add("@fecha_inicial", SqlDbType.VarChar).Value = fecha_inicial;
                        cmd.Parameters.Add("@fecha_final", SqlDbType.VarChar).Value = fecha_final;

                        cmd.Parameters.Add("@idAnexo", SqlDbType.Int).Value = idAnexo;
                        cmd.Parameters.Add("@idZona", SqlDbType.Int).Value = idZona;

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
                                res.data = GenerarArchivoExcel_cuentasCobrar(dt_detalle, 99);
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

        public string GenerarArchivoExcel_cuentasCobrar(DataTable dt_detalles, int id_usuario)
        {
            string Res = "";
            string correlativo = "";
            int _fila = 7;
            string FileRuta = "";
            string FileExcel = "";
            int idVendedor = 0;

            try
            {
                correlativo = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);        
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/cuentasPorCobrar" + correlativo);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "cuentasPorCobrar" + correlativo;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("cuentasXcobrar");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    oWs.Cells[4, 1,4, 14].Merge = true;  // combinar celdaS dt
                    oWs.Cells[4, 1].Value = dt_detalles.Rows[0]["tituloReporte"].ToString();
                    oWs.Cells[4, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[4, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[4, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[4, 1].Style.Font.Bold = true; //Letra negrita 

                    for (int i = 1; i <= 14; i++)
                    {
                        oWs.Cells[6, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    }

                    oWs.Cells[6, 1].Value = "Anexo";
                    oWs.Cells[6, 2].Value = "Zona de Venta";
                    oWs.Cells[6, 3].Value = "Vendedor";                            
                    oWs.Cells[6, 4].Value = "Fecha Emision";
                    oWs.Cells[6, 5].Value = "Tipo Doc.";

                    oWs.Cells[6, 6].Value = "Serie";                      
                    oWs.Cells[6, 7].Value = "Numero";
                    oWs.Cells[6, 8].Value = "Doc. Identidad Cliente";
                    oWs.Cells[6, 9].Value = "Nombre Cliente / Razon Social";

                    oWs.Cells[6, 10].Value = "Total Facturado";
                    oWs.Cells[6, 11].Value = "Total Pagado";
                    oWs.Cells[6, 12].Value = "Saldo Pendiente";
                       
                    oWs.Cells[6, 13].Value = "Tiempo Transcurrido";
                    oWs.Cells[6, 14].Value = "Fecha de Ultimo Pago";

                    int ac = 0;
                    int acumulador = 0; 
                    string nombreVendedor = "";
                    int codVendedor = 0; 

                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
 
                        if (idVendedor != Convert.ToInt32(oBj["idVendedor"].ToString()))
                        {
                            idVendedor = Convert.ToInt32(oBj["idVendedor"].ToString());
                            if (ac == 0)
                            {
                                ac = 1;
                            }
                            else
                            {
                                oWs.Cells[_fila, 1, _fila, 14].Style.Font.Bold = true; //Letra negrita 
                                oWs.Cells[_fila, 1].Value = "";
                                oWs.Cells[_fila, 2].Value = "";
                                oWs.Cells[_fila, 3].Value = "";
                                oWs.Cells[_fila, 4].Value = "";
                                oWs.Cells[_fila, 5].Value = "";
                                oWs.Cells[_fila, 6].Value = "";                                
                                oWs.Cells[_fila, 7].Value = "VENDEDOR : ";
                                oWs.Cells[_fila, 8].Value = nombreVendedor;
                                oWs.Cells[_fila, 9].Value = "TOTAL GENERAL";

                                oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0.00";
                                oWs.Cells[_fila, 10].Value = Math.Round(Convert.ToDecimal(dt_detalles.Compute("Sum(TotalFacturado)", "idVendedor =" + codVendedor)), 2);
                               
                                oWs.Cells[_fila, 11].Style.Numberformat.Format = "#,##0.00";
                                oWs.Cells[_fila, 11].Value = Math.Round(Convert.ToDecimal(dt_detalles.Compute("Sum(TotalPagado)", "idVendedor =" + codVendedor)), 2);
                                
                                oWs.Cells[_fila, 12].Style.Numberformat.Format = "#,##0.00";
                                oWs.Cells[_fila, 12].Value = Math.Round(Convert.ToDecimal(dt_detalles.Compute("Sum(SaldoPendiente)", "idVendedor =" + codVendedor)), 2);

                                oWs.Cells[_fila, 13].Value = "";
                                oWs.Cells[_fila, 14].Value = "";

                                idVendedor = Convert.ToInt32(oBj["idVendedor"].ToString());

                                _fila = _fila + 2;
                            }
                        }

                        codVendedor = Convert.ToInt32(oBj["idVendedor"].ToString());

                        if (idVendedor == Convert.ToInt32(oBj["idVendedor"].ToString()))
                        {
                            nombreVendedor = oBj["Vendedor"].ToString();

                            oWs.Cells[_fila, 1].Value = oBj["Anexo"].ToString();
                            oWs.Cells[_fila, 2].Value = oBj["ZonaVenta"].ToString();
                            oWs.Cells[_fila, 3].Value = oBj["Vendedor"].ToString();
                            oWs.Cells[_fila, 4].Value = oBj["FechaEmision"].ToString();
                            oWs.Cells[_fila, 5].Value = oBj["TipoDoc"].ToString();

                            oWs.Cells[_fila, 6].Value = oBj["Serie"].ToString();
                            oWs.Cells[_fila, 7].Value = oBj["Numero"].ToString();
                            oWs.Cells[_fila, 8].Value = oBj["DocIdentidadCliente"].ToString();
                            oWs.Cells[_fila, 9].Value = oBj["NombreClienteRazonSocial"].ToString();

                            oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0.00";
                            oWs.Cells[_fila, 10].Value = Math.Round(Convert.ToDecimal(oBj["TotalFacturado"]), 2);

                            oWs.Cells[_fila, 11].Style.Numberformat.Format = "#,##0.00";
                            oWs.Cells[_fila, 11].Value = Math.Round(Convert.ToDecimal(oBj["TotalPagado"]), 2);

                            oWs.Cells[_fila, 12].Style.Numberformat.Format = "#,##0.00";
                            oWs.Cells[_fila, 12].Value = Math.Round(Convert.ToDecimal(oBj["SaldoPendiente"]), 2);

                            oWs.Cells[_fila, 13].Value = oBj["TiempoVencimiento"].ToString();
                            oWs.Cells[_fila, 14].Value = oBj["FechaUltimoPago"].ToString();
                        }
                        acumulador += 1;

                        if (acumulador == dt_detalles.Rows.Count)
                        {
                            _fila++;

                            oWs.Cells[_fila, 1, _fila, 14].Style.Font.Bold = true; //Letra negrita 
                            oWs.Cells[_fila, 1].Value = "";
                            oWs.Cells[_fila, 2].Value = "";
                            oWs.Cells[_fila, 3].Value = "";
                            oWs.Cells[_fila, 4].Value = "";
        
                            oWs.Cells[_fila, 5].Value = "";
                            oWs.Cells[_fila, 7].Value = "VENDEDOR : ";
                            oWs.Cells[_fila, 8].Value = nombreVendedor;
                            oWs.Cells[_fila, 9].Value = "TOTAL GENERAL";

                            oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0.00";
                            oWs.Cells[_fila, 10].Value = Math.Round(Convert.ToDecimal(dt_detalles.Compute("Sum(TotalFacturado)", "idVendedor =" + codVendedor)), 2);
                            oWs.Cells[_fila, 11].Style.Numberformat.Format = "#,##0.00";
                            oWs.Cells[_fila, 11].Value = Math.Round(Convert.ToDecimal(dt_detalles.Compute("Sum(TotalPagado)", "idVendedor =" + codVendedor)), 2);
                            oWs.Cells[_fila, 12].Style.Numberformat.Format = "#,##0.00";
                            oWs.Cells[_fila, 12].Value = Math.Round(Convert.ToDecimal(dt_detalles.Compute("Sum(SaldoPendiente)", "idVendedor =" + codVendedor)), 2);

                            oWs.Cells[_fila, 13].Value = "";
                            oWs.Cells[_fila, 14].Value = "";
                        }
                         _fila++;
                    }

                    oWs.Row(6).Style.Font.Bold = true;
                    oWs.Row(6).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(6).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 14; k++)
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

        public object get_ayudaBusqueda(string filtroBusqueda, int id_zona)
        {
            Resul res = new Resul();
            try
            {
                List<Busqueda_E> obj_List = new List<Busqueda_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_REPORTE_PAGOS_AYUDA_VENDEDOR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@filtroBusqueda", SqlDbType.VarChar).Value = (filtroBusqueda==null) ? "" : filtroBusqueda.Trim();
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Busqueda_E Entidad = new Busqueda_E();

                                Entidad.id = Convert.ToInt32(dr["id"]);
                                Entidad.nroDoc = dr["nroDoc"].ToString();
                                Entidad.descripcion = dr["descripcion"].ToString();
                                obj_List.Add(Entidad);
                            }

                            res.ok = true;
                            res.data = obj_List;

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

        public List<PagosVendedor_New_E> get_reporteEstadosDocumentoVentas(int tipo, int id_busqueda, string nro_Doc, string fecha_inicial, string fecha_final, int idAnexo, int idZona)
        {
            try
            {
                List<PagosVendedor_New_E> obj_List = new List<PagosVendedor_New_E>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_REPORTE_COBRANZAS_ESTADO_DOCUMENTO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@tipo", SqlDbType.Int).Value = tipo;
                        cmd.Parameters.Add("@id_busqueda", SqlDbType.Int).Value = id_busqueda;
                        cmd.Parameters.Add("@Nro_Doc", SqlDbType.VarChar).Value = nro_Doc;
                        cmd.Parameters.Add("@fechaInicio", SqlDbType.VarChar).Value = fecha_inicial;

                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fecha_final;
                        cmd.Parameters.Add("@idAnexo", SqlDbType.Int).Value = idAnexo;
                        cmd.Parameters.Add("@idZona", SqlDbType.Int).Value = idZona;

                        using (SqlDataReader row = cmd.ExecuteReader())
                        {
                            while (row.Read())
                            {
                                PagosVendedor_New_E Entidad = new PagosVendedor_New_E();

                                Entidad.vendedor = row["vendedor"].ToString();
                                Entidad.fechaEmision = row["fechaEmision"].ToString();
                                Entidad.tipoDoc = row["tipoDoc"].ToString();

                                Entidad.serie = row["serie"].ToString();
                                Entidad.numero = row["numero"].ToString();
                                Entidad.docIdentidadCliente = row["docIdentidadCliente"].ToString();
                                Entidad.nombreCliente = row["nombreCliente"].ToString();
                                Entidad.totalFacturado = row["totalFacturado"].ToString();
                                Entidad.totalPagado = row["totalPagado"].ToString();
                                Entidad.saldoPendiente = row["saldoPendiente"].ToString();
                                Entidad.descripcionEstado = row["descripcionEstado"].ToString();

                                obj_List.Add(Entidad);

                            }
                        }
                    }
                    cn.Close();
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
