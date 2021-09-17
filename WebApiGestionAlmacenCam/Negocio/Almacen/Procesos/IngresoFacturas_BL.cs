using Entidades.Almacen.Procesos;
using Negocio.Resultado;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

using Excel = OfficeOpenXml;
using Style = OfficeOpenXml.Style;
using System.Drawing;
using System.Configuration;
using Negocio.Conexion;
using System.IO;

namespace Negocio.Almacen.Procesos
{
    public class IngresoFacturas_BL
    {
        public object get_informacionIngresoFacturas_cab(int id_local, int  id_almacen, int  id_estado, string fecha_ini, string fecha_fin, int id_proveedor)
        {
            Resul res = new Resul();
            List<IngresoFacturas_E> obj_List = new List<IngresoFacturas_E>();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_FACTURAS_LISTADO_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_estado", SqlDbType.Int).Value = id_estado;

                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fecha_fin;
                        cmd.Parameters.Add("@id_proveedor", SqlDbType.Int).Value = id_proveedor;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                IngresoFacturas_E Entidad = new IngresoFacturas_E();

                                Entidad.id_GuiaCab = Convert.ToInt32(dr["id_GuiaCab"]);                
                                Entidad.nroDoc = dr["nroDoc"].ToString();
                                Entidad.nroGuia = dr["nroGuia"].ToString();
                                Entidad.nroCompra = dr["nroCompra"].ToString();
                                Entidad.fechaEmision = dr["fechaEmision"].ToString();

                                Entidad.almacen = dr["almacen"].ToString();
                                Entidad.razonSocial = dr["razonSocial"].ToString();
                                Entidad.tipoGuia = dr["tipoGuia"].ToString();
                                Entidad.idEstado = dr["idEstado"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                Entidad.TipoDoc = dr["TipoDoc"].ToString();

                                Entidad.subTotal = dr["subTotal"].ToString();
                                Entidad.igv = dr["igv"].ToString();
                                Entidad.total = dr["total"].ToString();

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

        public object get_buscarGuiasCab(string consulta, int idUsuario, int idAlmacen, int id_proveedor )
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_FACTURAS_LISTADO_GUIAS_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@consulta", SqlDbType.VarChar).Value = consulta;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idAlmacen", SqlDbType.Int).Value = idAlmacen;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = id_proveedor;

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
            
        public object get_agregarGuiasCab(string idGuiasMasivos,int idUsuario, int idGuiaCab)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_FACTURAS_AGREGAR_GUIAS_MASIVO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idGuiasMasivos", SqlDbType.VarChar).Value = idGuiasMasivos;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idGuiaCab", SqlDbType.Int).Value = idGuiaCab;
                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
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
        
        public object get_listarGuiasDet(int idGuiaCab)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_FACTURAS_LISTAR_GUIAS_DETALLE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idGuiaCab", SqlDbType.Int).Value = idGuiaCab;

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
        
        public object set_actualizar_cantidadGuiasDet( int id_GuiaDet, int cantidad, int  id_usuario )
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_FACTURAS_ACTUALIZAR_CANTIDAD_DET", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_GuiaDet", SqlDbType.Int).Value = id_GuiaDet;
                        cmd.Parameters.Add("@cantidad", SqlDbType.Int).Value = cantidad;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
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

        public object set_eliminar_cantidadGuiasDet(int id_GuiaDet,  int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_FACTURAS_ELIMINAR_GUIA_DET", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_GuiaDet", SqlDbType.Int).Value = id_GuiaDet;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
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

        public object get_listarGuiasCabecera_ID(int idGuiaCab)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_FACTURAS_LISTADO_GUIAS_ID", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idGuiaCab", SqlDbType.Int).Value = idGuiaCab;

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

        public object set_cerrarGuia(int idGuiaCab, int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_FACTURAS_CERRAR_GUIA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_GuiaCab", SqlDbType.Int).Value = idGuiaCab;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
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

        public object set_actualizar_precioGuiasDet(int id_GuiaDet, string precio, int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_FACTURAS_ACTUALIZAR_PRECIO_DET", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_GuiaDet", SqlDbType.Int).Value = id_GuiaDet;
                        cmd.Parameters.Add("@precio", SqlDbType.VarChar).Value = precio;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
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
             
     public object ExportarExcel_ingresoFacturas(int id_local, int id_almacen, int id_estado, string fecha_ini, string fecha_fin, int id_proveedor)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_FACTURAS_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_estado", SqlDbType.Int).Value = id_estado;

                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fecha_fin;
                        cmd.Parameters.Add("@id_proveedor", SqlDbType.Int).Value = id_proveedor;

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
                                res.data = GenerarArchivoExcel_ingresoFacturas(dt_detalle, fecha_ini, fecha_fin);
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

        public string GenerarArchivoExcel_ingresoFacturas(DataTable dt_detalles, string fecha_ini, string fecha_fin)
        {
            string Res = "";
            string _servidor;

            int _fila = 5;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
                _servidor = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/ingresoFacturas" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "ingresoFacturas" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("compras");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));


                    //oWs.Cells[1, 7].Value = "Fecha y Hora de Reporte : " + dt_detalles.Rows[0]["fechaHoraReporte"].ToString();



                    oWs.Cells[2, 1, 2, 12].Merge = true;  // combinar celdaS dt
                    oWs.Cells[2, 1].Value = dt_detalles.Rows[0]["tituloReporte"].ToString();
                    oWs.Cells[2, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[2, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[2, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[2, 1].Style.Font.Bold = true; //Letra negrita
                    

                    for (int i = 1; i <= 12; i++)
                    {
                        oWs.Cells[4, i].Style.Border.BorderAround(Excel.Style.ExcelBorderStyle.Thin);
                    }

                    oWs.Cells[4, 1].Value = "F.EMIS.";
                    oWs.Cells[4, 2].Value = "D. ";
                    oWs.Cells[4, 3].Value = "NUMERO";
                    oWs.Cells[4, 4].Value = "R.U.C.";

                    oWs.Cells[4, 5].Value = "RAZON SOCIAL";
                    oWs.Cells[4, 6].Value = "No gravado";
                    oWs.Cells[4, 7].Value = "Otros T y C";
                    oWs.Cells[4, 8].Value = "Base Imp.";
                    oWs.Cells[4, 9].Value = "IGV ";

                    oWs.Cells[4, 10].Value = "Total";
                    oWs.Cells[4, 11].Value = "GLOSA";
                    oWs.Cells[4, 12].Value = "T/C";

                    double baseImp = 0;
                    double igv = 0;
                    double tot = 0;

                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
                        oWs.Cells[_fila, 1].Value = oBj["fechaEmision"].ToString();
                        oWs.Cells[_fila, 2].Value = oBj["dia"].ToString();
                        oWs.Cells[_fila, 3].Value = oBj["numeroDoc"].ToString(); 
                        oWs.Cells[_fila, 4].Value = oBj["ruc"].ToString();
                        oWs.Cells[_fila, 5].Value = oBj["razonSocial"].ToString();

                        oWs.Cells[_fila, 6].Value = oBj["nroGravado"].ToString();
                        oWs.Cells[_fila, 7].Value = oBj["otrosTC"].ToString();

                        oWs.Cells[_fila, 8].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 8].Value = Convert.ToDouble(oBj["baseImponible"].ToString());
                        oWs.Cells[_fila, 8].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 9].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 9].Value = Convert.ToDouble(oBj["igv"].ToString());
                        oWs.Cells[_fila, 9].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 10].Value = Convert.ToDouble(oBj["total"].ToString());
                        oWs.Cells[_fila, 10].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 11].Value = oBj["glosa"].ToString();
 
                        oWs.Cells[_fila, 12].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 12].Value = Convert.ToDouble(oBj["tipoCambio"].ToString());
                        oWs.Cells[_fila, 12].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;



                        baseImp += Convert.ToDouble(oBj["baseImponible"].ToString());
                        igv += Convert.ToDouble(oBj["igv"].ToString()); ;
                        tot += Convert.ToDouble(oBj["total"].ToString()); ;

                        _fila++;
                    }

                    _fila += 1;

                    oWs.Row(_fila).Style.Font.Bold = true;
                    oWs.Row(_fila).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Row(_fila).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Cells[_fila, 8].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila, 8].Value = baseImp;

                    oWs.Cells[_fila, 9].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila, 9].Value = igv;

                    oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila, 10].Value = tot;


                    oWs.Row(4).Style.Font.Bold = true;
                    oWs.Row(4).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(4).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 12; k++)
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

        public object get_verificarNroDoc(int tipo_documento , string nro_documento, int id_Proveedor)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_FACTURAS_VERIFICAR_NRODOC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@tipo_documento", SqlDbType.Int).Value = tipo_documento;
                        cmd.Parameters.Add("@nro_documento", SqlDbType.VarChar).Value = nro_documento;
                        cmd.Parameters.Add("@id_Proveedor", SqlDbType.Int).Value = id_Proveedor;

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

        public object set_anularIngresoFactura(int idGuiaCab, int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_FACTURAS_ANULAR_GUIA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_GuiaCab", SqlDbType.Int).Value = idGuiaCab;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
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


        public object ExportarExcel_reporteSinNombre()
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_FACTURAS_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        //cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;

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
                                res.data = GenerarArchivoExcel_reporteSinNombre(dt_detalle);
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

        public string GenerarArchivoExcel_reporteSinNombre(DataTable dt_detalles)
        {
            string Res = "";
            string _servidor;

            int _fila = 2;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
                _servidor = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/ingresoFacturas" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "ingresoFacturas" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("compras");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    for (int i = 1; i <= 12; i++)
                    {
                        oWs.Cells[1, i].Style.Border.BorderAround(Excel.Style.ExcelBorderStyle.Thin);
                    }

                    oWs.Cells[1, 1].Value = "CODIGO";
                    oWs.Cells[1, 2].Value = "CATEGORIA";
                    oWs.Cells[1, 3].Value = "MARCA";
                    oWs.Cells[1, 4].Value = "DESCRIPCION";
                              
                    oWs.Cells[1, 5].Value = "U. MEDIDA";
                    oWs.Cells[1, 6].Value = "FACTOR";
                              
                    oWs.Cells[1, 7].Value = "U. MEDIDA";
                    oWs.Cells[1, 8].Value = "FACTOR";
                              
                    oWs.Cells[1, 9].Value = "U. MEDIDA";
                    oWs.Cells[1, 10].Value = "FACTOR";
 

                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
                        oWs.Cells[_fila, 1].Value = oBj["codigo"].ToString();
                        oWs.Cells[_fila, 2].Value = oBj["categoria"].ToString();
                        oWs.Cells[_fila, 3].Value = oBj["marca"].ToString();
                        oWs.Cells[_fila, 4].Value = oBj["descripcion"].ToString();
                        
                        oWs.Cells[_fila, 5].Value = oBj["unidadMedida1"].ToString();
                        oWs.Cells[_fila, 6].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 6].Value = Convert.ToDouble(oBj["factor1"].ToString());
                        oWs.Cells[_fila, 6].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 7].Value = oBj["unidadMedida2"].ToString(); 
                        oWs.Cells[_fila, 8].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 8].Value = Convert.ToDouble(oBj["factor2"].ToString());
                        oWs.Cells[_fila, 8].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 9].Value = oBj["unidadMedida3"].ToString();
                        oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 10].Value = Convert.ToDouble(oBj["factor3"].ToString());
                        oWs.Cells[_fila, 10].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        _fila++;
                    }
                     
                    oWs.Row(1).Style.Font.Bold = true;
                    oWs.Row(1).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(1).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 10; k++)
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

        public object ExportarExcel_reporteContableVentas(int id_anexo, string fecha_ini, string fecha_fin, int  opcion_reporte, int id_usuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_REPORTE_CONTABLE_PLANILLA_VENTAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_anexo", SqlDbType.Int).Value = id_anexo;
                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fecha_fin;

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
                                res.data = GenerarArchivoExcel_reporteContable_ventas(dt_detalle);
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

        public string GenerarArchivoExcel_reporteContable_ventas(DataTable dt_detalles )
        {
            string Res = "";
            string _servidor;

            int _fila = 2;
            int pos = 1;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
                _servidor = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/planillaImportacionVentas" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "planillaImportacionVentas" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("Plantilla Salidas");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    oWs.Cells[1, pos].Value = "Movimiento"; pos += 1;
                    oWs.Cells[1, pos].Value = "Documento"; pos += 1;
                    oWs.Cells[1, pos].Value = "Serie"; pos += 1;
                    oWs.Cells[1, pos].Value = "Numero"; pos += 1;
                    oWs.Cells[1, pos].Value = "RUC o DNI"; pos += 1;
                    oWs.Cells[1, pos].Value = "Tipo Doc"; pos += 1;
                    oWs.Cells[1, pos].Value = "Razón Social"; pos += 1;
                    oWs.Cells[1, pos].Value = "Fecha"; pos += 1;
                    oWs.Cells[1, pos].Value = "F.Vencimiento"; pos += 1;
                    oWs.Cells[1, pos].Value = "F.Amac."; pos += 1;

                    oWs.Cells[1, pos].Value = "Pago"; pos += 1;
                    oWs.Cells[1, pos].Value = "Moneda"; pos += 1;
                    oWs.Cells[1, pos].Value = "Vendedor"; pos += 1;
                    oWs.Cells[1, pos].Value = "Cond. Pago"; pos += 1;
                    oWs.Cells[1, pos].Value = "Otros Conceptos"; pos += 1;
                    oWs.Cells[1, pos].Value = "T.Cambio"; pos += 1;
                    oWs.Cells[1, pos].Value = "ALmacen"; pos += 1;
                    oWs.Cells[1, pos].Value = "Cod.Producto"; pos += 1;
                    oWs.Cells[1, pos].Value = "Descripcion"; pos += 1;
                    oWs.Cells[1, pos].Value = "Detalle"; pos += 1;
                      
                    oWs.Cells[1, pos].Value = "U.Medida"; pos += 1;
                    oWs.Cells[1, pos].Value = "Cantidad"; pos += 1;
                    oWs.Cells[1, pos].Value = "Precio Unit."; pos += 1;
                    oWs.Cells[1, pos].Value = "Nfactor"; pos += 1;
                    oWs.Cells[1, pos].Value = "Adicional 1"; pos += 1;
                    oWs.Cells[1, pos].Value = "Adicional 2"; pos += 1;
                    oWs.Cells[1, pos].Value = "C.Costos1"; pos += 1;
                    oWs.Cells[1, pos].Value = "C.Costos2"; pos += 1;
                    oWs.Cells[1, pos].Value = "Doc. Ref."; pos += 1;
                    oWs.Cells[1, pos].Value = "Fec Doc.Ref."; pos += 1;
                         
                    oWs.Cells[1, pos].Value = "Ser Doc.Ref."; pos += 1;
                    oWs.Cells[1, pos].Value = "Num Doc.Ref."; pos += 1;
                    oWs.Cells[1, pos].Value = "Cod.Emis"; pos += 1;
                    oWs.Cells[1, pos].Value = "Motivo.Emis"; pos += 1;
                    oWs.Cells[1, pos].Value = "Mot.Tran Grat"; pos += 1;
                    oWs.Cells[1, pos].Value = "Importe Trans G."; pos += 1;
                    oWs.Cells[1, pos].Value = "Tipo Oper. Detra"; pos += 1;
                    oWs.Cells[1, pos].Value = "Estado_Belcen"; pos += 1;

                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
                        pos = 1;
                        oWs.Cells[_fila, pos].Value = oBj["Movimiento"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Documento"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Serie"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Numero"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["RUCDNI"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["TipoDoc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["RazonSocial"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Fecha"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["FVencimiento"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["FAmac"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Value = oBj["Pago"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Moneda"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Vendedor"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["CondPago"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["OtrosConceptos"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Style.Numberformat.Format = "#,##0.000000";
                        oWs.Cells[_fila, pos].Value = Convert.ToDouble(oBj["TCambio"].ToString());
                        oWs.Cells[_fila, pos].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        pos += 1;

                        oWs.Cells[_fila, pos].Value = oBj["ALmacen"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["CodProducto"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Descripcion"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Detalle"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Value = oBj["UMedida"].ToString(); pos += 1;
       
                        oWs.Cells[_fila, pos].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, pos].Value = Convert.ToDouble(oBj["Cantidad"].ToString());
                        oWs.Cells[_fila, pos].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        pos += 1;
                        oWs.Cells[_fila, pos].Style.Numberformat.Format = "#,##0.000000";
                        oWs.Cells[_fila, pos].Value = Convert.ToDouble(oBj["PrecioUnit"].ToString());
                        oWs.Cells[_fila, pos].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        pos += 1;
                        oWs.Cells[_fila, pos].Style.Numberformat.Format = "#,##0.0000";
                        oWs.Cells[_fila, pos].Value = Convert.ToDouble(oBj["Nfactor"].ToString());
                        oWs.Cells[_fila, pos].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        pos += 1;

                        oWs.Cells[_fila, pos].Value = oBj["Adicional1"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Adicional2"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["CCostos1"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["CCostos2"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["DocRef"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["FecDocRef"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Value = oBj["SerDocRef"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["NumDocRef"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["CodEmis"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["MotivoEmis"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["MotTranGrat"].ToString(); pos += 1;
                         
                        oWs.Cells[_fila, pos].Style.Numberformat.Format = "#,##0.000000";
                        oWs.Cells[_fila, pos].Value = Convert.ToDouble(oBj["ImporteTransG"].ToString());
                        oWs.Cells[_fila, pos].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["TipoOperDetra"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["estadoBelcen"].ToString(); pos += 1;

                        _fila++;
                    }
  
                    oWs.Row(1).Style.Font.Bold = true;
                    oWs.Row(1).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(1).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 38; k++)
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

        public object ExportarExcel_reporteContableCompras(int id_anexo, string fecha_ini, string fecha_fin, int opcion_reporte, int id_usuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_REPORTE_CONTABLE_PLANILLA_COMPRAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_anexo", SqlDbType.Int).Value = id_anexo;
                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fecha_fin;

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
                                res.data = GenerarArchivoExcel_reporteContable_compras(dt_detalle);
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



        public string GenerarArchivoExcel_reporteContable_compras(DataTable dt_detalles)
        {
            string Res = "";
            string _servidor;

            int _fila = 2;
            int pos = 1;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
                _servidor = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/planillaImportacionCompras" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "planillaImportacionCompras" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("Plantilla Ingresos");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    oWs.Cells[1, pos].Value = "Movimiento"; pos += 1;
                    oWs.Cells[1, pos].Value = "Documento"; pos += 1;
                    oWs.Cells[1, pos].Value = "Serie"; pos += 1;
                    oWs.Cells[1, pos].Value = "Numero"; pos += 1;
                    oWs.Cells[1, pos].Value = "RUC o DNI"; pos += 1;
                    oWs.Cells[1, pos].Value = "TIPO DOC"; pos += 1;
                    oWs.Cells[1, pos].Value = "Razón Social"; pos += 1;
                    oWs.Cells[1, pos].Value = "Fecha"; pos += 1;
                    oWs.Cells[1, pos].Value = "F.Vencimiento"; pos += 1;
                    oWs.Cells[1, pos].Value = "F.Amac."; pos += 1;

                    oWs.Cells[1, pos].Value = "Pago"; pos += 1;
                    oWs.Cells[1, pos].Value = "Moneda"; pos += 1;
                    oWs.Cells[1, pos].Value = "Otros Conceptos"; pos += 1;
                    oWs.Cells[1, pos].Value = "Cond. Pago"; pos += 1;
                    oWs.Cells[1, pos].Value = "T.Cambio"; pos += 1;
                    oWs.Cells[1, pos].Value = "ALmacen"; pos += 1;
                    oWs.Cells[1, pos].Value = "Cod.Producto"; pos += 1;
                    oWs.Cells[1, pos].Value = "Descripcion"; pos += 1;
                    oWs.Cells[1, pos].Value = "Detalle"; pos += 1;

                    oWs.Cells[1, pos].Value = "U.Medida"; pos += 1;
                    oWs.Cells[1, pos].Value = "Cantidad"; pos += 1;
                    oWs.Cells[1, pos].Value = "Nfactor"; pos += 1;
                    oWs.Cells[1, pos].Value = "Precio Unit."; pos += 1;            
                    oWs.Cells[1, pos].Value = "Adicional 1"; pos += 1;
                    oWs.Cells[1, pos].Value = "Adicional 2"; pos += 1;
                    oWs.Cells[1, pos].Value = "C.Costos1"; pos += 1;
                    oWs.Cells[1, pos].Value = "C.Costos2"; pos += 1;
                    oWs.Cells[1, pos].Value = "Doc. Ref."; pos += 1;
                    oWs.Cells[1, pos].Value = "Fec Doc.Ref."; pos += 1;
                    oWs.Cells[1, pos].Value = "Ser Doc.Ref."; pos += 1;
                    oWs.Cells[1, pos].Value = "Num Doc.Ref."; pos += 1;
                    oWs.Cells[1, pos].Value = "Estado_Belcen"; pos += 1;

                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
                        pos = 1;
                        oWs.Cells[_fila, pos].Value = oBj["Movimiento"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Documento"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Serie"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Numero"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["RUCDNI"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["TipoDoc"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["RazonSocial"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Fecha"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["FVencimiento"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["FAmac"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Value = oBj["Pago"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Moneda"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["OtrosConceptos"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["CondPago"].ToString(); pos += 1;


                        oWs.Cells[_fila, pos].Style.Numberformat.Format = "#,##0.000000";
                        oWs.Cells[_fila, pos].Value = Convert.ToDouble(oBj["TCambio"].ToString());
                        oWs.Cells[_fila, pos].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        pos += 1;

                        oWs.Cells[_fila, pos].Value = oBj["ALmacen"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["CodProducto"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Descripcion"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Detalle"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Value = oBj["UMedida"].ToString(); pos += 1;

                        oWs.Cells[_fila, pos].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, pos].Value = Convert.ToDouble(oBj["Cantidad"].ToString());
                        oWs.Cells[_fila, pos].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        pos += 1;

                        oWs.Cells[_fila, pos].Style.Numberformat.Format = "#,##0.0000";
                        oWs.Cells[_fila, pos].Value = Convert.ToDouble(oBj["Nfactor"].ToString());
                        oWs.Cells[_fila, pos].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        pos += 1;

                        oWs.Cells[_fila, pos].Style.Numberformat.Format = "#,##0.000000";
                        oWs.Cells[_fila, pos].Value = Convert.ToDouble(oBj["PrecioUnit"].ToString());
                        oWs.Cells[_fila, pos].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        pos += 1;

                        oWs.Cells[_fila, pos].Value = oBj["Adicional1"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["Adicional2"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["CCostos1"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["CCostos2"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["DocRef"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["FecDocRef"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["SerDocRef"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["NumDocRef"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["estadoBelcen"].ToString(); pos += 1;

                        _fila++;
                    }

                    oWs.Row(1).Style.Font.Bold = true;
                    oWs.Row(1).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(1).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 32; k++)
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
