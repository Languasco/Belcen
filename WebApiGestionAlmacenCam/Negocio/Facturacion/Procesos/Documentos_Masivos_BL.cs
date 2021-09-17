using Entidades;
using Entidades.Facturacion.Procesos;
using Negocio.Conexion;
using Negocio.Resultado;
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
using System.Web.Hosting;
using Excel = OfficeOpenXml;
using Style = OfficeOpenXml.Style;

namespace Negocio.Facturacion.Procesos
{
    public class Documentos_Masivos_BL
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();
        
        public string Exportar_packing(int puntoVenta, int estado, int vendedor, int tipodocumento, string fecha)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();

                    using (SqlCommand cmd = new SqlCommand("SP_S_REPORTE_DOC_MASIVOS_PICKING_PRODUCTO_GROUP", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@puntoVenta", SqlDbType.Int).Value = puntoVenta;
                        cmd.Parameters.Add("@estado", SqlDbType.Int).Value = estado;
                        cmd.Parameters.Add("@vendedor", SqlDbType.Int).Value = vendedor;
                        cmd.Parameters.Add("@tipodocumento", SqlDbType.Int).Value = tipodocumento;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count > 0)
                            {
                                resultado = GenerarArchivoExcel_Pickin(dt_detalle, puntoVenta, estado, vendedor, tipodocumento, fecha);
                            }
                            else
                            {
                                resultado = "0|No hay informacion para Mostrar.";
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                resultado = "0|" + ex.Message;
            }
            return resultado;

        }
        
        public List<GeneracionDocumentos> getDataGenerarDocumento(int id_vendedor, int id_puntoventa, string fecha)
        {
            try
            {
                List<GeneracionDocumentos> obj_List = new List<GeneracionDocumentos>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_GENERACION_DOCUMENTO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@ID_VENDEDOR", SqlDbType.Int).Value = id_vendedor;
                        cmd.Parameters.Add("@ID_PUNTOVENTA", SqlDbType.Int).Value = id_puntoventa;
                        cmd.Parameters.Add("@FECHA", SqlDbType.VarChar).Value = fecha;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                GeneracionDocumentos Entidad = new GeneracionDocumentos();

                                Entidad.id_PuntoVenta = Convert.ToInt32(row["id_PuntoVenta"].ToString());
                                Entidad.id_vendedor = Convert.ToInt32(row["id_vendedor"].ToString());
                                Entidad.fecha_emision = row["fecha_emision"].ToString();

                                Entidad.id_TipoDocumento = Convert.ToInt32(row["id_TipoDocumento"].ToString());
                                Entidad.des_tipo_factura = row["TIPODOCUMENTO"].ToString();
                                Entidad.cant_pedidos = Convert.ToInt32(row["PEDIDOS"].ToString());
                                Entidad.nro_serie = Convert.ToInt32(row["NRO_SERIES"].ToString());
                                Entidad.nro_inicial = Convert.ToInt32(row["NRO_INICIAL"].ToString());
                                Entidad.nro_final = Convert.ToInt32(row["NRO_FINAL"].ToString());

                                if (row["indic_guia"].ToString() == "SI")
                                {
                                    Entidad.indic_guia = true;
                                }
                                else {
                                    Entidad.indic_guia = false ;
                                }

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
        
        public List<DocumentosImprimir> getDocumentoImprimir(int id_puntoventa, int id_vendedor, int tipodoc, string fecha)
        {
            try
            {
                List<DocumentosImprimir> obj_List = new List<DocumentosImprimir>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_DOCUMENTOS_IMPRIMIR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@ID_PUNTOVENTA", SqlDbType.Int).Value = id_puntoventa;
                        cmd.Parameters.Add("@ID_PERSONALVENDEDOR", SqlDbType.Int).Value = id_vendedor;
                        cmd.Parameters.Add("@ID_TIPODOCUMENTO", SqlDbType.Int).Value = tipodoc;
                        cmd.Parameters.Add("@FECHA_FAC", SqlDbType.VarChar).Value = fecha;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                DocumentosImprimir Entidad = new DocumentosImprimir();
                                Entidad.IDCAB = row["IDCAB"].ToString();
                                Entidad.FECHA = row["FECHA"].ToString();
                                Entidad.PAGO = row["PAGO"].ToString();
                                Entidad.FECHAVEN = row["FECHAVEN"].ToString();
                                Entidad.EMPRESA = row["EMPRESA"].ToString();
                                Entidad.DIRECCION = row["DIRECCION"].ToString();
                                Entidad.RUC = row["RUC"].ToString();
                                Entidad.GUIA = row["GUIA"].ToString();
                                Entidad.NOMBRE_PRODUCTO = row["NOMBRE_PRODUCTO"].ToString();
                                Entidad.CANTIDAD = row["CANTIDAD"].ToString();
                                Entidad.IMPORTE = row["IMPORTE"].ToString();
                                Entidad.UNIDAD = row["UNIDAD"].ToString();
                                Entidad.TIPODOC = row["TIPODOC"].ToString();
                                Entidad.PRECIO = row["PRECIO"].ToString();                              

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

        public DataTable Get_DetalladoProductos(int puntoVenta, int estado, int vendedor, int tipodocumento, string fecha)
        {
            DataTable resultado = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_REPORTE_DOC_MASIVOS_PICKING_PRODUCTO_DETAIL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@puntoVenta", SqlDbType.Int).Value = puntoVenta;
                        cmd.Parameters.Add("@estado", SqlDbType.Int).Value = estado;
                        cmd.Parameters.Add("@vendedor", SqlDbType.Int).Value = vendedor;
                        cmd.Parameters.Add("@tipodocumento", SqlDbType.Int).Value = tipodocumento;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            resultado = dt_detalle;
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
        
        public DataTable Get_AgrupadoDocumentos(int puntoVenta, int estado, int vendedor, int tipodocumento, string fecha)
        {
            DataTable resultado = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_REPORTE_DOC_MASIVOS_PICKING_DOC_GROUP", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@puntoVenta", SqlDbType.Int).Value = puntoVenta;
                        cmd.Parameters.Add("@estado", SqlDbType.Int).Value = estado;
                        cmd.Parameters.Add("@vendedor", SqlDbType.Int).Value = vendedor;
                        cmd.Parameters.Add("@tipodocumento", SqlDbType.Int).Value = tipodocumento;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;

                        DataTable dt_detalle = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            resultado = dt_detalle;
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

        public double Get_CantidadProducto(DataTable Lista_Data, int idproducto, string nrodoc)
        {
            double res = 0;
            string result ="";
            for (int i = 0; i < Lista_Data.Rows.Count; i++)
            {
                if (Convert.ToInt32(Lista_Data.Rows[i]["id_Producto"].ToString()) == idproducto && Lista_Data.Rows[i]["Numero_Documento"].ToString() == nrodoc)
                {
                    result = Lista_Data.Rows[i]["cantidad"].ToString();
                    res = Convert.ToDouble(Lista_Data.Rows[i]["cantidad"].ToString());
                    break;
                }
            }
            return res;
        }
        
        public string GenerarArchivoExcel_Pickin(DataTable dt_Productos_Group, int puntoVenta, int estado, int vendedor, int tipodocumento, string fecha)
        {
            string Res = "";
            string _servidor;
            string _ruta;
            string resultado = "";
            int _fila = 2;
            string FileRuta = "";
            string FileExcel = "";
            int _ultimaColum = 0;
            var ac = 0;
            var inc = 0;
            double totalCantidad = 0;

            try
            {
                _servidor = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/Picking_" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "Picking_" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                DataTable dt_Productos_Detail = new DataTable();
                dt_Productos_Detail = Get_DetalladoProductos(puntoVenta, estado, vendedor, tipodocumento, fecha);

                DataTable dt_Documentos_group = new DataTable();
                dt_Documentos_group = Get_AgrupadoDocumentos(puntoVenta, estado, vendedor, tipodocumento, fecha);


                if (dt_Productos_Detail.Rows.Count <= 0)
                {
                    Res = "0|No hay informacion disponible";
                    return Res;
                }

                var obj_vendedor = (from a in db.tbl_Personal
                                        where a.id_personal == vendedor
                                    select new { a.apellidos_personal  , a.nombres_personal}).First();


                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("Picking");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 9));

                    oWs.Cells[2, 6].Value = "VENDEDOR: " + obj_vendedor.apellidos_personal + " " + obj_vendedor.nombres_personal  ;
                    oWs.Cells[2, 6, 2, 10].Merge = true;  // combinar celdaS 
                    
                    oWs.Cells[3, 1].Value = "DESCRIPCION DEL PRODUCTO";
                    oWs.Cells[3, 1, 3, 5].Merge = true;  // combinar celdaS 
                    oWs.Cells[3, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[3, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center; // alinear texto  


                    oWs.Cells[3, 6].Value = "UNIDAD DE TRANSPORTE:";
                    oWs.Cells[3, 6, 3, 10].Merge = true;  // combinar celdaS 

                    for (int i = 1; i <= 6; i++)
                    {
                        oWs.Cells[4, i].Style.Font.Size = 8; //letra tamaño   
                        oWs.Cells[4, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                        oWs.Cells[4, i].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                        oWs.Cells[4, i].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.IndianRed); // fondo de celda 
                    }

                    oWs.Cells[4, 1].Value = "ITEM";
                    oWs.Cells[4, 2].Value = "CODIGO";
                    oWs.Cells[4, 3].Value = "CLASIFICACION";
                    oWs.Cells[4, 4].Value = "MARCA";
                    oWs.Cells[4, 5].Value = "PRODUCTO";
                    oWs.Cells[4, 6].Value = "PRECIO_VENTA_CLIENTE";
                    
                    inc = 0;
                    _ultimaColum = 7;
                    foreach (DataRow item in dt_Documentos_group.Rows)
                    {
                        inc += 1;
                        oWs.Cells[4, _ultimaColum].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                        oWs.Cells[4, _ultimaColum].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.IndianRed); // fondo de celda 
                        oWs.Cells[4, _ultimaColum].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                        oWs.Cells[4, _ultimaColum].Style.Font.Size = 8; //letra tamaño  2
                        oWs.Cells[4, _ultimaColum].Style.Font.Bold = true; //Letra negrita
                        oWs.Cells[4, _ultimaColum].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                        oWs.Cells[4, _ultimaColum].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center; // alinear texto  
                        oWs.Cells[4, _ultimaColum].Value = item["TipoDocumento"].ToString() + " " + inc;
                        _ultimaColum = _ultimaColum + 1;
                    }
                    // Columnas de Totales 
                    oWs.Cells[4, _ultimaColum].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                    oWs.Cells[4, _ultimaColum].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Yellow); // fondo de celda 
                    oWs.Cells[4, _ultimaColum].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[4, _ultimaColum].Style.Font.Size = 9; //letra tamaño   
                    oWs.Cells[4, _ultimaColum].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[4, _ultimaColum].Value = "TOTAL PAQUETES (UND)";
                    
                    _fila = 5;
                    foreach (DataRow oBj in dt_Productos_Group.Rows)
                    {
                        ac +=1;
                        //-----Aplicando el marco---
                        for (int i = 1; i <= 6; i++)
                        {
                            oWs.Cells[_fila, i].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_fila, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                        }
                        //-----Fin de aplicando el marco---
                        oWs.Cells[_fila, 1].Value = ac;
                        oWs.Cells[_fila, 2].Value = oBj["codigo"].ToString();
                        oWs.Cells[_fila, 3].Value = oBj["clasificacion"].ToString();
                        oWs.Cells[_fila, 4].Value = oBj["marca"].ToString();
                        oWs.Cells[_fila, 5].Value = oBj["producto"].ToString();
                        oWs.Cells[_fila, 6].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right; // alinear texto  
                        //oWs.Cells[_fila, 6].Value = oBj["precio_venta"].ToString();

                        oWs.Cells[_fila, 6].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 6].Value = Math.Round(Convert.ToDecimal(oBj["precio_venta"].ToString()), 2);

                                                
                            _ultimaColum = 7;
                            totalCantidad = 0;
                            foreach (DataRow item in dt_Documentos_group.Rows)
                            {
                                oWs.Cells[_fila, _ultimaColum].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                                oWs.Cells[_fila, _ultimaColum].Style.Font.Size = 8; //letra tamaño  2
                                //oWs.Cells[_fila, _ultimaColum].Style.Font.Bold = true; //Letra negrita
                                oWs.Cells[_fila, _ultimaColum].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                                oWs.Cells[_fila, _ultimaColum].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right; // alinear texto  

                                totalCantidad = Get_CantidadProducto(dt_Productos_Detail, Convert.ToInt32(oBj["id_Producto"].ToString()), item["Numero_Documento"].ToString());

                                if (totalCantidad == 0)
                                {
                                    oWs.Cells[_fila, _ultimaColum].Value = "";
                                }
                                else {
                                    oWs.Cells[_fila, _ultimaColum].Value = totalCantidad;
                                }                 

                                _ultimaColum = _ultimaColum + 1;
                            }

                            // Columnas de Totales 
                            totalCantidad = 0;

                            oWs.Cells[_fila, _ultimaColum].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                            oWs.Cells[_fila, _ultimaColum].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Yellow); // fondo de celda 

                            oWs.Cells[_fila, _ultimaColum].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, _ultimaColum].Style.Font.Size = 9; //letra tamaño   
                            oWs.Cells[_fila, _ultimaColum].Style.Font.Bold = true; //Letra negrita
                           ///----Total productos Vertical---
                            object res_cantidadFila = dt_Productos_Detail.Compute("sum(cantidad)", "id_Producto ='" + oBj["id_Producto"].ToString() + "'");
                                                
                            //oWs.Cells[_fila, _ultimaColum].Style.Numberformat.Format = "#,##0.00";
                            //oWs.Cells[_fila, _ultimaColum].Value = Math.Round(Convert.ToDecimal(res_cantidadFila), 2);
                              oWs.Cells[_fila, _ultimaColum].Value =  Convert.ToDouble(res_cantidadFila);

                        _fila++;
                    }



                    oWs.Row(4).Style.Font.Bold = true;
                    oWs.Row(4).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(4).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Column(1).Style.Font.Bold = true;

                    for (int i = 1; i <= (7 + dt_Documentos_group.Rows.Count ); i++)
                    {
                        oWs.Column(i).AutoFit();
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
        
        public string Set_GenerarDocumentos_Venta(int id_puntoVenta, int id_vendedor, string fecha, string fecha_Factura,int usuario, int id_tipoDoc, string serieDoc, int cantidadDoc, int correlativo_ini)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_I_GENERAR_DOCUMENTOS_VENTAS_MASIVOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_puntoVenta", SqlDbType.Int).Value = id_puntoVenta;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;

                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;
                        cmd.Parameters.Add("@fecha_Factura", SqlDbType.VarChar).Value = fecha_Factura;

                        cmd.Parameters.Add("@id_tipoDoc", SqlDbType.Int).Value = id_tipoDoc;
                        cmd.Parameters.Add("@serieDoc", SqlDbType.VarChar).Value = serieDoc;

                        cmd.Parameters.Add("@cantidadDoc", SqlDbType.Int).Value = cantidadDoc;
                        cmd.Parameters.Add("@correlativo_ini", SqlDbType.Int).Value = correlativo_ini;
                        cmd.Parameters.Add("@usuario", SqlDbType.Int).Value = usuario;
 

                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }
        
        public List<DocumentosImprimir> getDocumentoImprimir_individual(string nro_documento, int TipoDoc)
        {
            try
            {
                List<DocumentosImprimir> obj_List = new List<DocumentosImprimir>();
                string ruta = ConfigurationManager.AppSettings["servidor_foto"];          

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_DOCUMENTOS_IMPRIMIR_INDIVIDUAL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@nro_documento", SqlDbType.VarChar).Value = nro_documento;
                        cmd.Parameters.Add("@TipoDocumento", SqlDbType.VarChar).Value = TipoDoc;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                DocumentosImprimir Entidad = new DocumentosImprimir();
                                Entidad.IDCAB = row["IDCAB"].ToString();
                                Entidad.FECHA = row["FECHA"].ToString();
                                Entidad.PAGO = row["PAGO"].ToString();
                                Entidad.FECHAVEN = row["FECHAVEN"].ToString();
                                Entidad.EMPRESA = row["EMPRESA"].ToString();
                                Entidad.DIRECCION = row["DIRECCION"].ToString();
                                Entidad.RUC = row["RUC"].ToString();

                                Entidad.NRO_DOC = row["NRO_DOC"].ToString();
                                Entidad.GUIA = row["GUIA"].ToString();

                                Entidad.CODIGO_PROD = row["CODIGO_PROD"].ToString();
                                Entidad.NOMBRE_PRODUCTO = row["NOMBRE_PRODUCTO"].ToString();
                                Entidad.CANTIDAD = row["CANTIDAD"].ToString();
                                Entidad.IMPORTE = row["IMPORTE"].ToString();
                                Entidad.UNIDAD = row["UNIDAD"].ToString();
                                Entidad.TIPODOC = row["TIPODOC"].ToString();
                                Entidad.PRECIO = row["PRECIO"].ToString();
                                Entidad.OBSERVACION = row["OBSERVACION"].ToString();
                                Entidad.CODIGO_RQ = ruta + row["CODIGO_RQ"].ToString();

                                Entidad.RUC_EMPRESA_EMITE = row["RUC_EMPRESA_EMITE"].ToString();
                                Entidad.RAZON_SOCIAL_EMITE = row["RAZON_SOCIAL_EMITE"].ToString();
                                Entidad.DEPARTAMENTO_EMITE = row["DEPARTAMENTO_EMITE"].ToString();

                                Entidad.PROVINCIA_EMITE = row["PROVINCIA_EMITE"].ToString();
                                Entidad.DISTRITO_EMITE = row["DISTRITO_EMITE"].ToString();
                                Entidad.CALLE_EMITE = row["CALLE_EMITE"].ToString();

                                Entidad.CODIGO_OPERACION = row["CODIGO_OPERACION"].ToString();
                                Entidad.DESCRIPCION_OPERACION = row["DESCRIPCION_OPERACION"].ToString();
                                Entidad.NRO_DOC_REF = row["NRO_DOC_REF"].ToString();

                                Entidad.TIPODOC_REF = row["TIPODOC_REF"].ToString();
                                Entidad.FECHA_REF = row["FECHA_REF"].ToString();
                                Entidad.FLAG_EXONERA = row["FLAG_EXONERA"].ToString();
                                Entidad.FLAG_TIPO_FACTURACION = row["FLAG_TIPO_FACTURACION"].ToString();

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
        
        public List<Pedidos_Cab> getData_Pedidos_Cab( int id_local, int id_almacen , int id_vendedor, string  fecha, int id_TipoDocumento, int id_Anexos, int id_transportista)
        {
            try
            {
                List<Pedidos_Cab> obj_List = new List<Pedidos_Cab>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_GENERACION_DOCUMENTO_PEDIDOS_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;
                        cmd.Parameters.Add("@id_TipoDocumento", SqlDbType.Int).Value = id_TipoDocumento;


                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_Cab Entidad = new Pedidos_Cab();

                                Entidad.id_Pedido_Cab = Convert.ToInt32(row["id_Pedido_Cab"].ToString());
                                Entidad.Numero_Pedido = row["Numero_Pedido"].ToString();
                                Entidad.id_Almacen = Convert.ToInt32(row["id_Almacen"].ToString());
                                Entidad.descripcion_Almacen = row["descripcion_Almacen"].ToString();
                                Entidad.formaPago = row["formaPago"].ToString();
                                Entidad.fecha_emision = row["fecha_emision"].ToString();
                                Entidad.nombres_Cliente = row["nombres_Cliente"].ToString();
                                Entidad.direccion_Pedido_Cab = row["direccion_Pedido_Cab"].ToString();
                                Entidad.observaciones_Pedido_Cab = row["observaciones_Pedido_Cab"].ToString();

                                if (row["genera_guia"].ToString() =="SI")
	                            {
		                          Entidad.checkeado_guia=true;
	                            }else{
                                  Entidad.checkeado_guia=false;
                                }

                                if (row["imprime_pedido"].ToString() =="SI")
	                            {
		                          Entidad.checkeado_pedido=true;
	                            }else{
                                  Entidad.checkeado_pedido=false;
                                }

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

        public List<Pedidos_Det> getData_Pedidos_Det(string id_Pedido_Cab)
        {
            try
            {
                List<Pedidos_Det> obj_List = new List<Pedidos_Det>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_GENERACION_DOCUMENTO_PEDIDOS_DET", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Pedido_Cab", SqlDbType.VarChar).Value = id_Pedido_Cab;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Pedidos_Det Entidad = new Pedidos_Det();

                                Entidad.id_Pedido_Det = Convert.ToInt32(row["id_Pedido_Det"].ToString());
                                Entidad.Numero_Pedido = row["Numero_Pedido"].ToString();
                                Entidad.id_Producto = Convert.ToInt32(row["id_Producto"].ToString());

                                Entidad.codigo1_Producto = row["codigo1_Producto"].ToString();
                                Entidad.nombre_Producto = row["nombre_Producto"].ToString();
                                Entidad.abreviatura_UnidadMedida = row["abreviatura_UnidadMedida"].ToString();
                                Entidad.nombre_marcaproducto = row["nombre_marcaproducto"].ToString();

                                Entidad.cantidad_Pedido_Det = Convert.ToDecimal(row["cantidad_Pedido_Det"].ToString());
                                Entidad.precioVenta_Pedido_Det = Convert.ToDecimal(row["precioVenta_Pedido_Det"].ToString());
                                Entidad.total_Pedido_Det = Convert.ToDecimal(row["total_Pedido_Det"].ToString());             
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
        
        public string Set_Actualizando_Pedido(int id_pedidoDet, decimal precio,string id_Pedido_Cab)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_GENERACION_DOCUMENTO_ACTUALIZAR_PRECIO_PEDIDO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Pedido_Det", SqlDbType.Int).Value = id_pedidoDet;
                        cmd.Parameters.Add("@precio", SqlDbType.Decimal).Value = precio;
                        cmd.Parameters.Add("@id_Pedido_Cab", SqlDbType.Int).Value = id_Pedido_Cab;
                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }

        public string Set_Pedido_Flag_GeneraGuia(string opcion,string  Numero_Pedido)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_GENERACION_DOCUMENTO_FLAG_GENERA_GUIA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@opcion", SqlDbType.VarChar).Value = opcion;
                        cmd.Parameters.Add("@Numero_Pedido", SqlDbType.VarChar).Value = Numero_Pedido;
                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }

        public string Set_Pedido_Flag_ImprimePedido(string opcion, string Numero_Pedido)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_GENERACION_DOCUMENTO_FLAG_IMPRIME_PEDIDO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@opcion", SqlDbType.VarChar).Value = opcion;
                        cmd.Parameters.Add("@Numero_Pedido", SqlDbType.VarChar).Value = Numero_Pedido;
                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }

        public List<DocumentosImprimir> getDocumentoImprimir_Masivo( int id_usuario, int id_tipoDocumentos)
        {
            try
            {
                List<DocumentosImprimir> obj_List = new List<DocumentosImprimir>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_DOCUMENTOS_IMPRIMIR_MASIVO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.Parameters.Add("@id_TipoDocumento", SqlDbType.Int).Value = id_tipoDocumentos; 

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                DocumentosImprimir Entidad = new DocumentosImprimir();
                                Entidad.IDCAB = row["IDCAB"].ToString();
                                Entidad.FECHA = row["FECHA"].ToString();
                                Entidad.PAGO = row["PAGO"].ToString();
                                Entidad.FECHAVEN = row["FECHAVEN"].ToString();
                                Entidad.EMPRESA = row["EMPRESA"].ToString();
                                Entidad.DIRECCION = row["DIRECCION"].ToString();
                                Entidad.RUC = row["RUC"].ToString();
                                Entidad.NRO_DOC = row["NRO_DOC"].ToString();
                                Entidad.GUIA = row["GUIA"].ToString();

                                Entidad.CODIGO_PROD = row["CODIGO_PROD"].ToString();
                                Entidad.NOMBRE_PRODUCTO = row["NOMBRE_PRODUCTO"].ToString();
                                Entidad.CANTIDAD = row["CANTIDAD"].ToString();
                                Entidad.IMPORTE = row["IMPORTE"].ToString();
                                Entidad.UNIDAD = row["UNIDAD"].ToString();
                                Entidad.TIPODOC = row["TIPODOC"].ToString();
                                Entidad.PRECIO = row["PRECIO"].ToString();
                                Entidad.CODIGO_RQ = row["CODIGO_RQ"].ToString();
                                
                                Entidad.RUC_EMPRESA_EMITE = row["RUC_EMPRESA_EMITE"].ToString();
                                Entidad.RAZON_SOCIAL_EMITE = row["RAZON_SOCIAL_EMITE"].ToString();
                                Entidad.DEPARTAMENTO_EMITE = row["DEPARTAMENTO_EMITE"].ToString();

                                Entidad.PROVINCIA_EMITE = row["PROVINCIA_EMITE"].ToString();
                                Entidad.DISTRITO_EMITE = row["DISTRITO_EMITE"].ToString();
                                Entidad.CALLE_EMITE = row["CALLE_EMITE"].ToString();

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

        public List<Documentos_Electronicos> get_Documentos_Electronicos(int TipoDoc, int idUsuario)
        {
            try
            {
                List<Documentos_Electronicos> obj_List = new List<Documentos_Electronicos>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_FACTURACION_ELECTRONICA_MASIVA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@TipoDocumento", SqlDbType.Int).Value = TipoDoc;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = idUsuario;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Documentos_Electronicos Entidad = new Documentos_Electronicos();

                                Entidad.idcab = row["idcab"].ToString();
                                Entidad.nro_doc = row["nro_doc"].ToString();
                                Entidad.fecha_emision = row["fecha_emision"].ToString();
                                Entidad.fecha_vencimiento = row["fecha_vencimiento"].ToString();

                                Entidad.hora_emision = row["hora_emision"].ToString();
                                Entidad.tipo_doc_sunat = row["tipo_doc_sunat"].ToString();
                                Entidad.tipo_moneda_sunat = row["tipo_moneda_sunat"].ToString();
                                Entidad.ruc_empresa_emite = row["ruc_empresa_emite"].ToString();
                                Entidad.razon_social_emite = row["razon_social_emite"].ToString();
                                Entidad.tipo_doc_identidad_emite = row["tipo_doc_identidad_emite"].ToString();
                                Entidad.razon_social_receptora = row["razon_social_receptora"].ToString();

                                Entidad.departamento_emite = row["departamento_emite"].ToString();
                                Entidad.provincia_emite = row["provincia_emite"].ToString();
                                Entidad.distrito_emite = row["distrito_emite"].ToString();
                                Entidad.calle_emite = row["calle_emite"].ToString();

                                Entidad.departamento_receptora = row["departamento_receptora"].ToString();
                                Entidad.provincia_receptora = row["provincia_receptora"].ToString();
                                Entidad.distrito_receptora = row["distrito_receptora"].ToString();
                                Entidad.calle_receptora = row["calle_receptora"].ToString();
                                Entidad.correo_receptora = row["correo_receptora"].ToString();


                                Entidad.ruc_empresa_receptora = row["ruc_empresa_receptora"].ToString();
                                Entidad.tipo_doc_identidad_receptora = row["tipo_doc_identidad_receptora"].ToString();
                                Entidad.monto_total_igv = row["monto_total_igv"].ToString();
                                Entidad.monto_total_inafecto = row["monto_total_inafecto"].ToString();
                                Entidad.monto_sub_total = row["monto_sub_total"].ToString();
                                Entidad.monto_total = row["monto_total"].ToString();

                                Entidad.cantidad = row["cantidad"].ToString();
                                Entidad.cod_unidad_sunat = row["cod_unidad_sunat"].ToString();
                                Entidad.precio_venta = row["precio_venta"].ToString();


                                Entidad.monto_total_igv_det = row["monto_total_igv_det"].ToString();
                                Entidad.monto_sub_total_det = row["monto_sub_total_det"].ToString();
                                Entidad.monto_total_det = row["monto_total_det"].ToString();
                                Entidad.codigo_producto = row["codigo_producto"].ToString();
                                Entidad.nombre_producto = row["nombre_producto"].ToString();
                                Entidad.nombreArchivo = row["nombreArchivo"].ToString();

                                Entidad.codigo_operacion = row["codigo_operacion"].ToString();
                                Entidad.descripcion_operacion = row["descripcion_operacion"].ToString();
                                Entidad.nro_doc_ref = row["nro_doc_ref"].ToString();
                                Entidad.identificador = row["identificador"].ToString();
                                Entidad.cod_unidad = row["cod_unidad"].ToString();


                                Entidad.cod_tributo = row["cod_tributo"].ToString();
                                Entidad.nom_tributo = row["nom_tributo"].ToString();
                                Entidad.tipo_tributo = row["tipo_tributo"].ToString();
                                Entidad.porc_igv = row["porc_igv"].ToString();
                                Entidad.cod_impuesto = row["cod_impuesto"].ToString();

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
                
        public string Set_Generar_Archivos_Json(string nro_documento, int TipoDoc)
        {
            var resultado = "";

            try
            {
                List<Documentos_Electronicos> obj_List = new List<Documentos_Electronicos>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_FACTURACION_ELECTRONICA_MASIVA_II", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@nro_documento", SqlDbType.VarChar).Value = nro_documento;
                        cmd.Parameters.Add("@TipoDocumento", SqlDbType.VarChar).Value = TipoDoc;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Documentos_Electronicos Entidad = new Documentos_Electronicos();

                                Entidad.idcab = row["idcab"].ToString();
                                Entidad.nro_doc = row["nro_doc"].ToString();
                                Entidad.fecha_emision = row["fecha_emision"].ToString();
                                Entidad.hora_emision = row["hora_emision"].ToString();
                                Entidad.tipo_doc_sunat = row["tipo_doc_sunat"].ToString();
                                Entidad.tipo_moneda_sunat = row["tipo_moneda_sunat"].ToString();
                                Entidad.ruc_empresa_emite = row["ruc_empresa_emite"].ToString();
                                Entidad.razon_social_emite = row["razon_social_emite"].ToString();
                                Entidad.tipo_doc_identidad_emite = row["tipo_doc_identidad_emite"].ToString();
                                Entidad.razon_social_receptora = row["razon_social_receptora"].ToString();

                                Entidad.ruc_empresa_receptora = row["ruc_empresa_receptora"].ToString();
                                Entidad.tipo_doc_identidad_receptora = row["tipo_doc_identidad_receptora"].ToString();
                                Entidad.monto_total_igv = row["monto_total_igv"].ToString();
                                Entidad.monto_total_inafecto = row["monto_total_inafecto"].ToString();
                                Entidad.monto_sub_total = row["monto_sub_total"].ToString();
                                Entidad.monto_total = row["monto_total"].ToString();

                                Entidad.cantidad = row["cantidad"].ToString();
                                Entidad.cod_unidad_sunat = row["cod_unidad_sunat"].ToString();
                                Entidad.monto_total_igv_det = row["monto_total_igv_det"].ToString();
                                Entidad.monto_sub_total_det = row["monto_sub_total_det"].ToString();
                                Entidad.monto_total_det = row["monto_total_det"].ToString();
                                Entidad.codigo_producto = row["codigo_producto"].ToString();
                                Entidad.nombre_producto = row["nombre_producto"].ToString();

                                obj_List.Add(Entidad);
                            }
                        }
                    }
                }


                ///// ----GENERANDO---
                

                var idCab = 0;
                List<int> List_id_Cabeceras = new List<int>();
                
                ///----- codigos de los documentos----
                for (int i = 0; i < obj_List.Count; i++)
                {
                    if (idCab != Convert.ToInt32(obj_List[i].idcab))
                    {
                        List_id_Cabeceras.Add(Convert.ToInt32(obj_List[i].idcab));
                    }
                   idCab = Convert.ToInt32(obj_List[i].idcab) ;
                }
                                
                List<Documentos_Electronicos_Cab> obj_Lista_Documentos = new List<Documentos_Electronicos_Cab>();

                for (int x = 0; x < List_id_Cabeceras.Count; x++)
                {
                    for (int y = 0; y < obj_List.Count; y++)///---lista de todos los documentos 
                    {
                        if (List_id_Cabeceras[x] == Convert.ToInt32(obj_List[y].idcab))
                        {
                            Documentos_Electronicos_Cab Entidad = new Documentos_Electronicos_Cab();

                            Entidad.idcab = obj_List[y].idcab;
                            Entidad.nro_doc = obj_List[y].nro_doc;
                            Entidad.fecha_emision = obj_List[y].fecha_emision;
                            Entidad.hora_emision = obj_List[y].hora_emision;
                            Entidad.tipo_doc_sunat = obj_List[y].tipo_doc_sunat;
                            Entidad.tipo_moneda_sunat = obj_List[y].tipo_moneda_sunat;
                            Entidad.ruc_empresa_emite = obj_List[y].ruc_empresa_emite;
                            Entidad.razon_social_emite = obj_List[y].razon_social_emite;
                            Entidad.tipo_doc_identidad_emite = obj_List[y].tipo_doc_identidad_emite;
                            Entidad.razon_social_receptora = obj_List[y].razon_social_receptora;
                            Entidad.ruc_empresa_receptora = obj_List[y].ruc_empresa_receptora;
                            Entidad.tipo_doc_identidad_receptora = obj_List[y].tipo_doc_identidad_receptora;
                            Entidad.monto_total_igv = obj_List[y].monto_total_igv;
                            Entidad.monto_total_inafecto = obj_List[y].monto_total_inafecto;
                            Entidad.monto_sub_total = obj_List[y].monto_sub_total;
                            Entidad.monto_total = obj_List[y].monto_total;

                            List<Documentos_Electronicos_Det> obj_Lista_Documentos_detalle = new List<Documentos_Electronicos_Det>();

                            for (int z = 0; z < obj_List.Count; z++) ///---lista de todos los documentos 
                            {
                               if (List_id_Cabeceras[x] == Convert.ToInt32(obj_List[z].idcab))
                                {
                                   Documentos_Electronicos_Det entidad_det = new Documentos_Electronicos_Det();

                                    entidad_det.idcab =  obj_List[z].idcab;
                                    entidad_det.cantidad = obj_List[z].cantidad;
                                    entidad_det.cod_unidad_sunat = obj_List[z].cod_unidad_sunat;
                                    entidad_det.monto_total_igv_det = obj_List[z].monto_total_igv_det;
      
                                    entidad_det.monto_sub_total_det  = obj_List[z].monto_sub_total_det;
                                    entidad_det.monto_total_det = obj_List[z].monto_total_det;
                                    entidad_det.codigo_producto = obj_List[z].codigo_producto;
                                    entidad_det.nombre_producto = obj_List[z].nombre_producto; 
                                   obj_Lista_Documentos_detalle.Add(entidad_det);
                                }      
                            }

                            //-------agregando el detalle----
                            Entidad.listaDetalle = obj_Lista_Documentos_detalle;
                            
                            //----agregando los datos del documento
                            obj_Lista_Documentos.Add(Entidad);    
                       }
                    }
                }


                ///-------- generar la estructura json por cada documento
                ///



                for (int a = 0; a < obj_Lista_Documentos.Count; a++)
                {
                    List<string> InvoiceLine_aux = new List<string>();

                    for (int b = 0; b < obj_Lista_Documentos[a].listaDetalle.Count; b++) {
                        //mensaje = obj_Lista_Documentos[a].listaDetalle[b].nombre_producto;  







  
                    }                  
                }




                resultado = "OK";
            }
            catch (Exception ex)
            {

                 resultado = ex.Message;
            }
            return resultado;
        }

        public List<Documentos_Electronicos> get_Documentos_Electronicos_individual(int TipoDoc, string nroDocumento)
        {
            try
            {
                List<Documentos_Electronicos> obj_List = new List<Documentos_Electronicos>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    //using (SqlCommand cmd = new SqlCommand("SP_GET_FACTURACION_ELECTRONICA", cn))
                    using (SqlCommand cmd = new SqlCommand("SP_GET_FACTURACION_ELECTRONICA_NEW", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@TipoDocumento", SqlDbType.Int).Value = TipoDoc;
                        cmd.Parameters.Add("@nro_documento", SqlDbType.VarChar).Value = nroDocumento;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Documentos_Electronicos Entidad = new Documentos_Electronicos();

                                Entidad.idcab = row["idcab"].ToString();
                                Entidad.nro_doc = row["nro_doc"].ToString();
                                Entidad.fecha_emision = row["fecha_emision"].ToString();
                                Entidad.fecha_vencimiento = row["fecha_vencimiento"].ToString();

                                Entidad.hora_emision = row["hora_emision"].ToString();
                                Entidad.tipo_doc_sunat = row["tipo_doc_sunat"].ToString();
                                Entidad.tipo_moneda_sunat = row["tipo_moneda_sunat"].ToString();
                                Entidad.ruc_empresa_emite = row["ruc_empresa_emite"].ToString();
                                Entidad.razon_social_emite = row["razon_social_emite"].ToString();
                                Entidad.tipo_doc_identidad_emite = row["tipo_doc_identidad_emite"].ToString();
                                Entidad.razon_social_receptora = row["razon_social_receptora"].ToString();
                                                                
                                Entidad.departamento_emite = row["departamento_emite"].ToString();
                                Entidad.provincia_emite = row["provincia_emite"].ToString();
                                Entidad.distrito_emite = row["distrito_emite"].ToString();
                                Entidad.calle_emite = row["calle_emite"].ToString();

                                Entidad.departamento_receptora = row["departamento_receptora"].ToString();
                                Entidad.provincia_receptora = row["provincia_receptora"].ToString();
                                Entidad.distrito_receptora = row["distrito_receptora"].ToString();
                                Entidad.calle_receptora = row["calle_receptora"].ToString();
                                Entidad.correo_receptora = row["correo_receptora"].ToString();


                                Entidad.ruc_empresa_receptora = row["ruc_empresa_receptora"].ToString();
                                Entidad.tipo_doc_identidad_receptora = row["tipo_doc_identidad_receptora"].ToString();
                                Entidad.monto_total_igv = row["monto_total_igv"].ToString();
                                Entidad.monto_total_inafecto = row["monto_total_inafecto"].ToString();
                                Entidad.monto_sub_total = row["monto_sub_total"].ToString();
                                Entidad.monto_total = row["monto_total"].ToString();

                                Entidad.cantidad = row["cantidad"].ToString();
                                Entidad.cod_unidad_sunat = row["cod_unidad_sunat"].ToString();
                                Entidad.precio_venta = row["precio_venta"].ToString();


                                Entidad.monto_total_igv_det = row["monto_total_igv_det"].ToString();
                                Entidad.monto_sub_total_det = row["monto_sub_total_det"].ToString();
                                Entidad.monto_total_det = row["monto_total_det"].ToString();
                                Entidad.codigo_producto = row["codigo_producto"].ToString();
                                Entidad.nombre_producto = row["nombre_producto"].ToString();
                                Entidad.nombreArchivo = row["nombreArchivo"].ToString();

                                Entidad.codigo_operacion = row["codigo_operacion"].ToString();
                                Entidad.descripcion_operacion = row["descripcion_operacion"].ToString();
                                Entidad.nro_doc_ref = row["nro_doc_ref"].ToString();
                                Entidad.identificador = row["identificador"].ToString();
                                Entidad.cod_unidad = row["cod_unidad"].ToString();

                                Entidad.codigo_tipo_oper = row["codigo_tipo_oper"].ToString();
                                Entidad.cod_establecimiento = row["cod_establecimiento"].ToString();
                                Entidad.fecha_ref = row["fecha_ref"].ToString();

                                Entidad.cod_tributo = row["cod_tributo"].ToString();
                                Entidad.nom_tributo = row["nom_tributo"].ToString();
                                Entidad.tipo_tributo = row["tipo_tributo"].ToString();
                                Entidad.porc_igv = row["porc_igv"].ToString();
                                Entidad.cod_impuesto = row["cod_impuesto"].ToString();

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

        public List<Documentos_Electronicos> get_Documentos_Electronicos_individual_anulacion(int TipoDoc, string nroDocumento)
        {
            try
            {
                List<Documentos_Electronicos> obj_List = new List<Documentos_Electronicos>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_FACTURACION_ELECTRONICA_ANULAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@TipoDocumento", SqlDbType.Int).Value = TipoDoc;
                        cmd.Parameters.Add("@nro_documento", SqlDbType.VarChar).Value = nroDocumento;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Documentos_Electronicos Entidad = new Documentos_Electronicos();
  
                                Entidad.idcab = row["idcab"].ToString();

                                Entidad.cod_identificacion = row["cod_identificacion"].ToString(); 
                                Entidad.fecha_emision = row["fecha_emision"].ToString(); 
                                Entidad.ruc_empresa_receptora = row["ruc_empresa_receptora"].ToString();
                                Entidad.razon_social_receptora = row["razon_social_receptora"].ToString();

                                Entidad.departamento_receptora = row["departamento_receptora"].ToString();
                                Entidad.provincia_receptora = row["provincia_receptora"].ToString();
                                Entidad.distrito_receptora = row["distrito_receptora"].ToString();
                                Entidad.calle_receptora = row["calle_receptora"].ToString();

                                Entidad.correo_receptora = row["correo_receptora"].ToString();
                                Entidad.tipo_doc_sunat = row["tipo_doc_sunat"].ToString();
                                Entidad.serie_doc = row["serie_doc"].ToString();
                                Entidad.nro_doc = row["nro_doc"].ToString();
                                Entidad.observacion_anulacion = row["observacion_anulacion"].ToString();
                                Entidad.nombreArchivo = row["nombreArchivo"].ToString(); 

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

        public List<DocumentosImprimir> getDocumentoImprimir_individual_notas_facturas(string nro_documento, int TipoDoc, int id_factura)
        {
            try
            {
                List<DocumentosImprimir> obj_List = new List<DocumentosImprimir>();
                string ruta = ConfigurationManager.AppSettings["servidor_foto"];

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_DOCUMENTOS_IMPRIMIR_INDIVIDUAL_II", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@nro_documento", SqlDbType.VarChar).Value = nro_documento;
                        cmd.Parameters.Add("@TipoDocumento", SqlDbType.VarChar).Value = TipoDoc;
                        cmd.Parameters.Add("@id_factura", SqlDbType.Int ).Value = id_factura;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                DocumentosImprimir Entidad = new DocumentosImprimir();
                                Entidad.IDCAB = row["IDCAB"].ToString();
                                Entidad.FECHA = row["FECHA"].ToString();
                                Entidad.PAGO = row["PAGO"].ToString();
                                Entidad.FECHAVEN = row["FECHAVEN"].ToString();
                                Entidad.EMPRESA = row["EMPRESA"].ToString();
                                Entidad.DIRECCION = row["DIRECCION"].ToString();
                                Entidad.RUC = row["RUC"].ToString();

                                Entidad.NRO_DOC = row["NRO_DOC"].ToString();
                                Entidad.GUIA = row["GUIA"].ToString();

                                Entidad.CODIGO_PROD = row["CODIGO_PROD"].ToString();
                                Entidad.NOMBRE_PRODUCTO = row["NOMBRE_PRODUCTO"].ToString();
                                Entidad.CANTIDAD = row["CANTIDAD"].ToString();
                                Entidad.IMPORTE = row["IMPORTE"].ToString();
                                Entidad.UNIDAD = row["UNIDAD"].ToString();
                                Entidad.TIPODOC = row["TIPODOC"].ToString();
                                Entidad.PRECIO = row["PRECIO"].ToString();
                                Entidad.OBSERVACION = row["OBSERVACION"].ToString();
                                Entidad.CODIGO_RQ = ruta + row["CODIGO_RQ"].ToString();

                                Entidad.RUC_EMPRESA_EMITE = row["RUC_EMPRESA_EMITE"].ToString();
                                Entidad.RAZON_SOCIAL_EMITE = row["RAZON_SOCIAL_EMITE"].ToString();
                                Entidad.DEPARTAMENTO_EMITE = row["DEPARTAMENTO_EMITE"].ToString();

                                Entidad.PROVINCIA_EMITE = row["PROVINCIA_EMITE"].ToString();
                                Entidad.DISTRITO_EMITE = row["DISTRITO_EMITE"].ToString();
                                Entidad.CALLE_EMITE = row["CALLE_EMITE"].ToString();

                                Entidad.CODIGO_OPERACION = row["CODIGO_OPERACION"].ToString();
                                Entidad.DESCRIPCION_OPERACION = row["DESCRIPCION_OPERACION"].ToString();
                                Entidad.NRO_DOC_REF = row["NRO_DOC_REF"].ToString();

                                Entidad.TIPODOC_REF = row["TIPODOC_REF"].ToString();
                                Entidad.FECHA_REF = row["FECHA_REF"].ToString();
                                Entidad.FLAG_EXONERA = row["FLAG_EXONERA"].ToString();
                                Entidad.FLAG_TIPO_FACTURACION = row["FLAG_TIPO_FACTURACION"].ToString();
                                
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


        public List<Documentos_Electronicos> get_Documentos_Electronicos_individual_notas(int TipoDoc, string nroDocumento, int id_cab_referencia)
        {
            try
            {
                List<Documentos_Electronicos> obj_List = new List<Documentos_Electronicos>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    //using (SqlCommand cmd = new SqlCommand("SP_GET_FACTURACION_ELECTRONICA_NOTA_CREDITO", cn))
                    using (SqlCommand cmd = new SqlCommand("SP_GET_FACTURACION_ELECTRONICA_NOTA_CREDITO_II", cn))                        
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@TipoDocumento", SqlDbType.Int).Value = TipoDoc;
                        cmd.Parameters.Add("@nro_documento", SqlDbType.VarChar).Value = nroDocumento;
                        cmd.Parameters.Add("@id_cab_referencia", SqlDbType.Int).Value = id_cab_referencia;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Documentos_Electronicos Entidad = new Documentos_Electronicos();

                                Entidad.idcab = row["idcab"].ToString();
                                Entidad.nro_doc = row["nro_doc"].ToString();
                                Entidad.fecha_emision = row["fecha_emision"].ToString();
                                Entidad.fecha_vencimiento = row["fecha_vencimiento"].ToString();

                                Entidad.hora_emision = row["hora_emision"].ToString();
                                Entidad.tipo_doc_sunat = row["tipo_doc_sunat"].ToString();
                                Entidad.tipo_moneda_sunat = row["tipo_moneda_sunat"].ToString();
                                Entidad.ruc_empresa_emite = row["ruc_empresa_emite"].ToString();
                                Entidad.razon_social_emite = row["razon_social_emite"].ToString();
                                Entidad.tipo_doc_identidad_emite = row["tipo_doc_identidad_emite"].ToString();
                                Entidad.razon_social_receptora = row["razon_social_receptora"].ToString();

                                Entidad.departamento_emite = row["departamento_emite"].ToString();
                                Entidad.provincia_emite = row["provincia_emite"].ToString();
                                Entidad.distrito_emite = row["distrito_emite"].ToString();
                                Entidad.calle_emite = row["calle_emite"].ToString();

                                Entidad.departamento_receptora = row["departamento_receptora"].ToString();
                                Entidad.provincia_receptora = row["provincia_receptora"].ToString();
                                Entidad.distrito_receptora = row["distrito_receptora"].ToString();
                                Entidad.calle_receptora = row["calle_receptora"].ToString();
                                Entidad.correo_receptora = row["correo_receptora"].ToString();


                                Entidad.ruc_empresa_receptora = row["ruc_empresa_receptora"].ToString();
                                Entidad.tipo_doc_identidad_receptora = row["tipo_doc_identidad_receptora"].ToString();
                                Entidad.monto_total_igv = row["monto_total_igv"].ToString();
                                Entidad.monto_total_inafecto = row["monto_total_inafecto"].ToString();
                                Entidad.monto_sub_total = row["monto_sub_total"].ToString();
                                Entidad.monto_total = row["monto_total"].ToString();

                                Entidad.cantidad = row["cantidad"].ToString();
                                Entidad.cod_unidad_sunat = row["cod_unidad_sunat"].ToString();
                                Entidad.precio_venta = row["precio_venta"].ToString();


                                Entidad.monto_total_igv_det = row["monto_total_igv_det"].ToString();
                                Entidad.monto_sub_total_det = row["monto_sub_total_det"].ToString();
                                Entidad.monto_total_det = row["monto_total_det"].ToString();
                                Entidad.codigo_producto = row["codigo_producto"].ToString();
                                Entidad.nombre_producto = row["nombre_producto"].ToString();
                                Entidad.nombreArchivo = row["nombreArchivo"].ToString();

                                Entidad.codigo_operacion = row["codigo_operacion"].ToString();
                                Entidad.descripcion_operacion = row["descripcion_operacion"].ToString();
                                Entidad.nro_doc_ref = row["nro_doc_ref"].ToString();
                                Entidad.identificador = row["identificador"].ToString();
                                Entidad.cod_unidad = row["cod_unidad"].ToString();

                                Entidad.codigo_tipo_oper = row["codigo_tipo_oper"].ToString();
                                Entidad.cod_establecimiento = row["cod_establecimiento"].ToString();
                                Entidad.fecha_ref = row["fecha_ref"].ToString();

                                Entidad.cod_tributo = row["cod_tributo"].ToString();
                                Entidad.nom_tributo = row["nom_tributo"].ToString();
                                Entidad.tipo_tributo = row["tipo_tributo"].ToString();
                                Entidad.porc_igv = row["porc_igv"].ToString();
                                Entidad.cod_impuesto = row["cod_impuesto"].ToString();

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

        public List<GeneracionDocumentos> get_pedidos_movil(int id_local,int id_almacen, int id_vendedor, string fecha, int id_Anexos,int id_CanalNegocio)
        {
            try
            {
                List<GeneracionDocumentos> obj_List = new List<GeneracionDocumentos>();

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_GENERACION_DOCUMENTO_PEDIDO_MOVL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;

                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;
                        cmd.Parameters.Add("@id_CanalNegocio", SqlDbType.Int).Value = id_CanalNegocio;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                GeneracionDocumentos Entidad = new GeneracionDocumentos();

                                Entidad.id_PuntoVenta = Convert.ToInt32(row["id_PuntoVenta"].ToString());
                                Entidad.id_vendedor = Convert.ToInt32(row["id_vendedor"].ToString());
                                Entidad.fecha_emision = row["fecha_emision"].ToString();

                                Entidad.id_TipoDocumento = Convert.ToInt32(row["id_TipoDocumento"].ToString());
                                Entidad.des_tipo_factura = row["TIPODOCUMENTO"].ToString();
                                Entidad.cant_pedidos = Convert.ToInt32(row["PEDIDOS"].ToString());
                                if (row["indic_guia"].ToString() == "SI")
                                {
                                    Entidad.indic_guia = true;
                                }
                                else
                                {
                                    Entidad.indic_guia = false;
                                }
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


        public string Set_GenerarDocumentos_Venta_II( int id_local, int  id_almacen, int id_vendedor, string fecha, int  id_TipoDocumento, int usuario, string fecha_Factura, string numero_documento,  string numero_pedido, int  id_Anexos, int id_transportista)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_DOCUMENTO_VENTA_FACTURACION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;

                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;
                        cmd.Parameters.Add("@id_tipoDoc", SqlDbType.Int).Value = id_TipoDocumento;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.VarChar).Value = usuario;
                        cmd.Parameters.Add("@fecha_Factura", SqlDbType.VarChar).Value = fecha_Factura;

                        cmd.Parameters.Add("@numero_documento", SqlDbType.VarChar).Value = numero_documento;
                        cmd.Parameters.Add("@numero_pedido", SqlDbType.VarChar).Value = numero_pedido;

                        cmd.Parameters.Add("@id_Anexos", SqlDbType.Int).Value = id_Anexos;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;

                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }
               
        public List<DocumentosImprimir_masivo> getDocumentoImprimir_Masivo_II(int id_usuario, int id_tipoDocumentos)
        {
            try
            {
                List<DocumentosImprimir_masivo> obj_List = new List<DocumentosImprimir_masivo>();
                string ruta = ConfigurationManager.AppSettings["servidor_foto"];


                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_DOCUMENTOS_IMPRIMIR_MASIVO_NEW", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.Parameters.Add("@id_TipoDocumento", SqlDbType.Int).Value = id_tipoDocumentos;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                DocumentosImprimir_masivo Entidad = new DocumentosImprimir_masivo();

                                Entidad.idCab = dr["idCab"].ToString();
                                Entidad.empresaTitulo = dr["empresaTitulo"].ToString();
                                Entidad.descripcionEmpresa = dr["descripcionEmpresa"].ToString();
                                Entidad.telefonoEmpresa = dr["telefonoEmpresa"].ToString();
                                Entidad.emailEmpresa = dr["emailEmpresa"].ToString();
                                Entidad.rucEmpresa = dr["rucEmpresa"].ToString();

                                Entidad.nroDocEmpresa = dr["nroDocEmpresa"].ToString();
                                Entidad.nombreCliente = dr["nombreCliente"].ToString();
                                Entidad.direccionCliente = dr["direccionCliente"].ToString();
                                Entidad.direccionEnvioCliente = dr["direccionEnvioCliente"].ToString();
                                Entidad.rucDniCliente = dr["rucDniCliente"].ToString();

                                Entidad.codigoCliente = dr["codigoCliente"].ToString();
                                Entidad.moneda = dr["moneda"].ToString();
                                Entidad.emision = dr["emision"].ToString();
                                Entidad.vencimiento = dr["vencimiento"].ToString();
                                Entidad.condicion = dr["condicion"].ToString();
                                Entidad.hora = dr["hora"].ToString();

                                Entidad.referencia = dr["referencia"].ToString();
                                Entidad.vendedor = dr["vendedor"].ToString();
                                Entidad.celular = dr["celular"].ToString();
                                Entidad.codigoProducto = dr["codigoProducto"].ToString();
                                Entidad.descripcionProducto = dr["descripcionProducto"].ToString();
                                Entidad.cantidadProducto = dr["cantidadProducto"].ToString();

                                Entidad.unidad = dr["unidad"].ToString();
                                Entidad.precio = dr["precio"].ToString();
                                Entidad.importeItem = dr["importeItem"].ToString();
                                Entidad.codigo_rq = dr["codigo_rq"].ToString();
                                Entidad.descripcionComprobante = dr["descripcionComprobante"].ToString();

                                Entidad.subTotal = dr["subTotal"].ToString();
                                Entidad.descuentoTotal = dr["descuentoTotal"].ToString();
                                Entidad.operacionGrabada = dr["operacionGrabada"].ToString();
                                Entidad.operacionExonerada = dr["operacionExonerada"].ToString();
                                Entidad.operacionInafecta = dr["operacionInafecta"].ToString();
                                Entidad.igv = dr["igv"].ToString();
                                Entidad.importeTotal = dr["importeTotal"].ToString();

                                Entidad.direccionEmpresa = dr["direccionEmpresa"].ToString();
                                Entidad.sucursalEmpresa1 = dr["sucursalEmpresa1"].ToString();
                                Entidad.sucursalEmpresa2 = dr["sucursalEmpresa2"].ToString();
                                Entidad.sucursalEmpresa3 = dr["sucursalEmpresa3"].ToString();
                                Entidad.sucursalEmpresa4 = dr["sucursalEmpresa4"].ToString();

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
        
        public List<DocumentosImprimir_masivo> getDocumentoImprimir_Individual_II(string nroDocumento, int TipoDoc )
        {
            try
            {
                List<DocumentosImprimir_masivo> obj_List = new List<DocumentosImprimir_masivo>();
                string ruta = ConfigurationManager.AppSettings["servidor_foto"];

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_DOCUMENTOS_IMPRIMIR_INDIVIDUAL_NEW", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@nroDocumento", SqlDbType.VarChar ).Value = nroDocumento;
                        cmd.Parameters.Add("@TipoDoc", SqlDbType.Int).Value = TipoDoc;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                DocumentosImprimir_masivo Entidad = new DocumentosImprimir_masivo();

                                Entidad.idCab = dr["idCab"].ToString();
                                Entidad.empresaTitulo = dr["empresaTitulo"].ToString();
                                Entidad.descripcionEmpresa = dr["descripcionEmpresa"].ToString();
                                Entidad.telefonoEmpresa = dr["telefonoEmpresa"].ToString();
                                Entidad.emailEmpresa = dr["emailEmpresa"].ToString();
                                Entidad.rucEmpresa = dr["rucEmpresa"].ToString();

                                Entidad.nroDocEmpresa = dr["nroDocEmpresa"].ToString();
                                Entidad.nombreCliente = dr["nombreCliente"].ToString();
                                Entidad.direccionCliente = dr["direccionCliente"].ToString();
                                Entidad.direccionEnvioCliente = dr["direccionEnvioCliente"].ToString();
                                Entidad.rucDniCliente = dr["rucDniCliente"].ToString();

                                Entidad.codigoCliente = dr["codigoCliente"].ToString();
                                Entidad.moneda = dr["moneda"].ToString();
                                Entidad.emision = dr["emision"].ToString();
                                Entidad.vencimiento = dr["vencimiento"].ToString();
                                Entidad.condicion = dr["condicion"].ToString();
                                Entidad.hora = dr["hora"].ToString();

                                Entidad.referencia = dr["referencia"].ToString();
                                Entidad.vendedor = dr["vendedor"].ToString();
                                Entidad.celular = dr["celular"].ToString();
                                Entidad.codigoProducto = dr["codigoProducto"].ToString();
                                Entidad.descripcionProducto = dr["descripcionProducto"].ToString();
                                Entidad.cantidadProducto = dr["cantidadProducto"].ToString();

                                Entidad.unidad = dr["unidad"].ToString();
                                Entidad.precio = dr["precio"].ToString();
                                Entidad.importeItem = dr["importeItem"].ToString();
                                Entidad.codigo_rq = dr["codigo_rq"].ToString();
                                Entidad.descripcionComprobante = dr["descripcionComprobante"].ToString();

                                Entidad.subTotal = dr["subTotal"].ToString();
                                Entidad.descuentoTotal = dr["descuentoTotal"].ToString();
                                Entidad.operacionGrabada = dr["operacionGrabada"].ToString();
                                Entidad.operacionExonerada = dr["operacionExonerada"].ToString();
                                Entidad.operacionInafecta = dr["operacionInafecta"].ToString();
                                Entidad.igv = dr["igv"].ToString();
                                Entidad.importeTotal = dr["importeTotal"].ToString();

                                Entidad.direccionEmpresa = dr["direccionEmpresa"].ToString();
                                Entidad.sucursalEmpresa1 = dr["sucursalEmpresa1"].ToString();
                                Entidad.sucursalEmpresa2 = dr["sucursalEmpresa2"].ToString();
                                Entidad.sucursalEmpresa3 = dr["sucursalEmpresa3"].ToString();
                                Entidad.sucursalEmpresa4 = dr["sucursalEmpresa4"].ToString();

                                Entidad.factura_electronica_QR = dr["factura_electronica_QR"].ToString();
                                Entidad.factura_electronica_alertas = dr["factura_electronica_alertas"].ToString();

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


        public DataTable  get_Documentos_Electronicos_individual_new(int TipoDoc, string nroDocumento)
        {
            try
            {
                DataTable obj_List = new DataTable();
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_COMPRABANTES_ELECTRONICOS_JSON", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@TipoDocumento", SqlDbType.Int).Value = TipoDoc;
                        cmd.Parameters.Add("@nro_documento", SqlDbType.VarChar).Value = nroDocumento;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            obj_List = dt_detalle;
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

        public DataTable get_Documentos_Electronicos_notas_individual_new(int TipoDoc, string nroDocumento, int id_cab_ref)
        {
            try
            {
                DataTable obj_List = new DataTable();
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_COMPRABANTES_ELECTRONICOS_NOTAS_JSON", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@TipoDocumento", SqlDbType.Int).Value = TipoDoc;
                        cmd.Parameters.Add("@nro_documento", SqlDbType.VarChar).Value = nroDocumento;
                        cmd.Parameters.Add("@id_cab_referencia", SqlDbType.Int).Value = id_cab_ref;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            obj_List = dt_detalle;
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
               
        public List<Documentos_Electronicos> get_facturas_Generadas_Masivos( int idUsuario)
        {
            try
            {
                List<Documentos_Electronicos> obj_List = new List<Documentos_Electronicos>();
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_FACTURAS_GENERADAS_MASIVOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = idUsuario;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            foreach (DataRow row in dt_detalle.Rows)
                            {
                                Documentos_Electronicos Entidad = new Documentos_Electronicos(); 
                                Entidad.id_TipoDocumento = row["id_TipoDocumento"].ToString();
                                Entidad.Descripcion_TipoDocumento = row["Descripcion_TipoDocumento"].ToString();
                                Entidad.Numero_Documento = row["Numero_Documento"].ToString(); 
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

        public object get_zonasUsuario(int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_DOCUMENTOS_MASIVOS_COMBO_ZONA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
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

        public object getDocumentoImprimir_guiaRemision_sunat(string nroDocumento, int TipoDoc)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_DOCUMENTOS_IMPRIMIR_GUIA_REMISION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@nroDocumento", SqlDbType.VarChar).Value = nroDocumento;
                        cmd.Parameters.Add("@TipoDoc", SqlDbType.Int).Value = TipoDoc;

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

        public object getDocumentoImprimir_otrosModulos_guiaRemision_sunat(int idGuia)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_DOCUMENTOS_IMPRIMIR_OTROS_MODULOS_GUIA_REMISION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idGuia", SqlDbType.Int).Value = idGuia;

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
