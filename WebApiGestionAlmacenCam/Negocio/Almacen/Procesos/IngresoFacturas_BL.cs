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
using OfficeOpenXml.Style;

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

                                Entidad.usuario_creacion = dr["usuario_creacion"].ToString();
                                Entidad.fecha_creacion = dr["fecha_creacion"].ToString();
                                Entidad.usuario_edicion = dr["usuario_edicion"].ToString();
                                Entidad.fecha_edicion = dr["fecha_edicion"].ToString();

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

        public object ExportarExcel_ventaAcumulada(int id_anexo, string fecha_ini, string fecha_fin, int id_usuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_R_VENTAS_ACUMULADAS_CLIENTES", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@anexo", SqlDbType.Int).Value = id_anexo;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fecha_fin;

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
                                res.data = GenerarArchivoExcel_reporteVentasAcumulada(dt_detalle );
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

        public string GenerarArchivoExcel_reporteVentasAcumulada(DataTable dt_detalles )
        {
            string Res = "";
            string _servidor;

            int _fila = 7;
            int pos = 1;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
                _servidor = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/ReporteVentaAcumulada" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "ReporteVentaAcumulada" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("ReporteVentaAcumulada");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));


                    oWs.Cells[2, 1, 2, 6].Merge = true;  // combinar celdaS dt
                    oWs.Cells[2, 1].Value = dt_detalles.Rows[0]["tituloReporte"].ToString();
                    oWs.Cells[2, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[2, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[2, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[2, 1].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[4, 1, 4, 6].Merge = true;  // combinar celdaS dt
                    oWs.Cells[4, 1].Value = "Desde " + dt_detalles.Rows[0]["fechaInicial"].ToString() + " Hasta " + dt_detalles.Rows[0]["fechaFinal"].ToString();
                    oWs.Cells[4, 1].Style.Font.Size = 12; //letra tamaño  
                    oWs.Cells[4, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[4, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[4, 1].Style.Font.Bold = true; //Letra negrita


                    oWs.Cells[6, pos].Value = "NRO"; pos += 1;
                    oWs.Cells[6, pos].Value = "ZONA"; pos += 1;
                    oWs.Cells[6, pos].Value = "CÓDIGO"; pos += 1;
                    oWs.Cells[6, pos].Value = "NOMBRE VENDEDOR"; pos += 1;
                    oWs.Cells[6, pos].Value = "VENTA ACUMULADA"; pos += 1;
                    oWs.Cells[6, pos].Value = "CLIENTES ATENDIDOS"; pos += 1; 
                    int ac = 0;
                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
                        pos = 1;
                        ac += 1;
                        oWs.Cells[_fila, pos].Value = ac; pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["nombreZonaVta"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["codigo_personal"].ToString(); pos += 1;
                        oWs.Cells[_fila, pos].Value = oBj["vendedor"].ToString(); pos += 1;                   
     
                        oWs.Cells[_fila, pos].Style.Numberformat.Format = "#,##0.0000";
                        oWs.Cells[_fila, pos].Value = Convert.ToDouble(oBj["monto"].ToString());
                        oWs.Cells[_fila, pos].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        pos += 1;
                        oWs.Cells[_fila, pos].Style.Numberformat.Format = "#";
                        oWs.Cells[_fila, pos].Value = Convert.ToInt32(oBj["clientes"].ToString());
                        oWs.Cells[_fila, pos].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                        _fila++;
                    }

                    oWs.Row(6).Style.Font.Bold = true;
                    oWs.Row(6).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(6).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 6; k++)
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

        public object get_tipoOrden_usuario(int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_COMPRAS_SERVICIO_COMBO_TIPO_ORDEN", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

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

        public object get_informacionIngresoComprasServicios_cab(int id_tipoOrden , int id_anexo, int id_almacen, int id_estado, string fecha_ini, string fecha_fin, int id_proveedor)
        {
            Resul res = new Resul();
            List<IngresoFacturas_E> obj_List = new List<IngresoFacturas_E>();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_COMPRAS_SERVICIO_LISTADO_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_tipoOrden", SqlDbType.Int).Value = id_tipoOrden;
                        cmd.Parameters.Add("@id_anexo", SqlDbType.Int).Value = id_anexo;
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

                                Entidad.tipoOC = dr["tipoOC"].ToString();

                                Entidad.TipoDoc = dr["TipoDoc"].ToString();
                                Entidad.nroDoc = dr["nroDoc"].ToString(); 
                                Entidad.nroCompra = dr["nroCompra"].ToString();
                                Entidad.fechaEmision = dr["fechaEmision"].ToString();

                                Entidad.almacen = dr["almacen"].ToString();
                                Entidad.razonSocial = dr["razonSocial"].ToString();
                                Entidad.tipoGuia = dr["tipoGuia"].ToString();
                                Entidad.idEstado = dr["idEstado"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
            

                                Entidad.subTotal = dr["subTotal"].ToString();
                                Entidad.igv = dr["igv"].ToString();
                                Entidad.total = dr["total"].ToString();

                                Entidad.usuario_creacion = dr["usuario_creacion"].ToString();
                                Entidad.fecha_creacion = dr["fecha_creacion"].ToString();
                                Entidad.usuario_edicion = dr["usuario_edicion"].ToString();
                                Entidad.fecha_edicion = dr["fecha_edicion"].ToString();

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

        public object get_unidadMedidaCompraServicio()
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_COMPRAS_SERVICIO_COMBO_UM", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

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

        public string Set_Actualizar_imagenComprobanteComprasServicio(int idGuiaCab, string nombreFile, string nombreFileServer)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_COMPRAS_SERVICIO_GRABAR_IMAGEN_DEPOSITOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idGuiaCab", SqlDbType.Int).Value = idGuiaCab;
                        cmd.Parameters.Add("@nombreFile", SqlDbType.VarChar).Value = nombreFile;
                        cmd.Parameters.Add("@nombreFileServer", SqlDbType.VarChar).Value = nombreFileServer;

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

        public object get_buscarProducto_codigo(int id_TipoOrden, int id_anexos, int id_Almacen, string codigo_Producto,int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_COMPRAS_SERVICIO_BUSQUEDA_PRODUCTO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@id_TipoOrden", SqlDbType.Int).Value = id_TipoOrden;
                        cmd.Parameters.Add("@id_anexos", SqlDbType.Int).Value = id_anexos;
                        cmd.Parameters.Add("@id_Almacen", SqlDbType.Int).Value = id_Almacen;

                        cmd.Parameters.Add("@codigo_Producto", SqlDbType.VarChar).Value = codigo_Producto;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

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


        public object get_buscarProducto_modal(int id_TipoOrden, int id_anexos, int id_Almacen, string filtro_Producto, int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_COMPRAS_SERVICIO_BUSQUEDA_PRODUCTO_MODAL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@id_TipoOrden", SqlDbType.Int).Value = id_TipoOrden;
                        cmd.Parameters.Add("@id_anexos", SqlDbType.Int).Value = id_anexos;
                        cmd.Parameters.Add("@id_Almacen", SqlDbType.Int).Value = id_Almacen;

                        cmd.Parameters.Add("@filtro_Producto", SqlDbType.VarChar).Value = filtro_Producto;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

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

        public object get_agregarGuiasDet(int id_GuiaCab, int idProducto, string codigoProducto,string  descripcionProducto, int idUnidadMedida, 
                                          string cantidad, string precio, string importe, int id_TipoOrden, int id_usuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_COMPRAS_SERVICIO_GRABAR_DETALLE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@id_TipoOrden", SqlDbType.Int).Value = id_TipoOrden;

                        cmd.Parameters.Add("@id_GuiaCab", SqlDbType.Int).Value = id_GuiaCab;
                        cmd.Parameters.Add("@idProducto", SqlDbType.Int).Value = idProducto;
                        cmd.Parameters.Add("@codigoProducto", SqlDbType.VarChar).Value = codigoProducto;
                        cmd.Parameters.Add("@descripcionProducto", SqlDbType.VarChar).Value = descripcionProducto;

                        cmd.Parameters.Add("@idUnidadMedida", SqlDbType.Int).Value = idUnidadMedida;
                        cmd.Parameters.Add("@cantidad", SqlDbType.VarChar).Value = cantidad;
                        cmd.Parameters.Add("@precio", SqlDbType.VarChar).Value = precio;
                        cmd.Parameters.Add("@importe", SqlDbType.VarChar).Value = importe;                
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


        public object get_listar_detalleComprasServicio(int idGuiaCab)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_COMPRAS_SERVICIO_LISTAR_DETALLE", cn))
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


        public object get_actualizarGuiasDet(int id_GuiaDet, int idProducto, string codigoProducto, string descripcionProducto, int idUnidadMedida,
                                  string cantidad, string precio, string importe, int id_usuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_COMPRAS_SERVICIO_ACTUALIZAR_DETALLE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_GuiaDet", SqlDbType.Int).Value = id_GuiaDet;
                        cmd.Parameters.Add("@idProducto", SqlDbType.Int).Value = idProducto;
                        cmd.Parameters.Add("@codigoProducto", SqlDbType.VarChar).Value = codigoProducto;
                        cmd.Parameters.Add("@descripcionProducto", SqlDbType.VarChar).Value = descripcionProducto;

                        cmd.Parameters.Add("@idUnidadMedida", SqlDbType.Int).Value = idUnidadMedida;
                        cmd.Parameters.Add("@cantidad", SqlDbType.VarChar).Value = cantidad;
                        cmd.Parameters.Add("@precio", SqlDbType.VarChar).Value = precio;
                        cmd.Parameters.Add("@importe", SqlDbType.VarChar).Value = importe;
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


        public object set_eliminar_GuiasDet_comprasServicios(int id_GuiaDet, int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_COMPRAS_SERVICIO_ELIMINAR_DETALLE", cn))
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


        public object get_informacionPago_proveedores(int id_Proveedor, int tipoReporte, int id_tipoDoc, string nro_documento)
        {
            Resul res = new Resul();
            List<PagoProveedor_E> obj_List = new List<PagoProveedor_E>();

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_PAGO_PROVEEDOR_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Proveedor", SqlDbType.Int).Value = id_Proveedor;
                        cmd.Parameters.Add("@tipoReporte", SqlDbType.Int).Value = tipoReporte;
                        cmd.Parameters.Add("@id_tipoDoc", SqlDbType.Int).Value = id_tipoDoc;
                        cmd.Parameters.Add("@nro_documento", SqlDbType.VarChar).Value = nro_documento;
 

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                PagoProveedor_E Entidad = new PagoProveedor_E();

                                Entidad.id_GuiaCab = Convert.ToInt32(dr["id_GuiaCab"]);
                                Entidad.checkeado = false;
                                Entidad.tipoOrden = dr["tipoOrden"].ToString();
                                Entidad.fechaEmision = dr["fechaEmision"].ToString();
                                Entidad.tipoDoc = dr["tipoDoc"].ToString();
                                Entidad.numero = dr["numero"].ToString();
                                Entidad.ordenCompra = dr["ordenCompra"].ToString();

                                Entidad.total = dr["total"].ToString();
                                Entidad.porcDetraccion = dr["porcDetraccion"].ToString();
                                Entidad.totalDetraccion = dr["totalDetraccion"].ToString();
                                Entidad.porcRetencion = dr["porcRetencion"].ToString();
                                Entidad.totalRetencion = dr["totalRetencion"].ToString();

                                Entidad.totalPagar = dr["totalPagar"].ToString();
                                Entidad.totalCancelado = dr["totalCancelado"].ToString();
                                Entidad.saldoPendiente = dr["saldoPendiente"].ToString();
                                Entidad.saldoPendienteEditado = dr["saldoPendienteEditado"].ToString();

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


        public object get_verificarNroOperacionPagos(int id_banco, string nroOperacion, string fechaOperacion)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_PAGO_PROVEEDOR_VALIDAR_NRO_OPERACION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idBanco", SqlDbType.Int).Value = id_banco;
                        cmd.Parameters.Add("@nroOperacion", SqlDbType.VarChar).Value = nroOperacion;
                        cmd.Parameters.Add("@fechaOperacion", SqlDbType.VarChar).Value = fechaOperacion;

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


        public object Set_generarPagosCab(int idGuiaCab, int idFormaPago, int idBanco, string fechaOperacion, string nroOperacion, string montoPago, int idUsuario, int esMasivo)
        {

            int id_GuiaCab = 0;
            Resul res = new Resul();

            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_I_PAGO_PROVEEDOR_GRABAR_PAGO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idGuiaCab", SqlDbType.Int).Value = idGuiaCab;
                        cmd.Parameters.Add("@idFormaPago", SqlDbType.Int).Value = idFormaPago;
                        cmd.Parameters.Add("@idBanco", SqlDbType.Int).Value = idBanco;
                        cmd.Parameters.Add("@fechaOperacion", SqlDbType.VarChar).Value = fechaOperacion;
                        cmd.Parameters.Add("@nroOperacion", SqlDbType.VarChar).Value = nroOperacion;
                        cmd.Parameters.Add("@montoPago", SqlDbType.VarChar).Value = montoPago;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@esMasivo", SqlDbType.Int).Value = esMasivo;

                        cmd.Parameters.Add("@id_PagoCab", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        id_GuiaCab = Convert.ToInt32(cmd.Parameters["@id_PagoCab"].Value.ToString());

                        res.ok = true;
                        res.data = id_GuiaCab;                         
                    }
                }
            }
            catch (Exception e)
            {
                res.ok = false;
                res.data = e.Message;
            }
            return res;
        }

        public string Set_Actualizar_imagenComprobantePago(int idPago, string nombreFile, string nombreFileServer)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_I_PAGO_PROVEEDOR_GRABAR_VOUCHER", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idPago", SqlDbType.Int).Value = idPago;
                        cmd.Parameters.Add("@nombreFile", SqlDbType.VarChar).Value = nombreFile;
                        cmd.Parameters.Add("@nombreFileServer", SqlDbType.VarChar).Value = nombreFileServer;

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


        public string Set_Actualizar_imagenComprobantePago_masivo(string listIdPagos , string nombreFile, string nombreFileServer)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_I_PAGO_PROVEEDOR_GRABAR_VOUCHER_MASIVO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idPagos", SqlDbType.VarChar).Value = listIdPagos;
                        cmd.Parameters.Add("@nombreFile", SqlDbType.VarChar).Value = nombreFile;
                        cmd.Parameters.Add("@nombreFileServer", SqlDbType.VarChar).Value = nombreFileServer;

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

        public object get_detallePagos(int idPago )
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_PAGO_PROVEEDOR_DETALLE_PAGOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idPago", SqlDbType.Int).Value = idPago;

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


        public object ExportarExcel_reportePagos(int tipoReporte, int  id_Proveedor, int tipoDocumentos, int idUsuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_REPORTE_PAGO_PROVEEDOR_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@tipoReporte", SqlDbType.Int).Value = tipoReporte;
                        cmd.Parameters.Add("@id_Proveedor", SqlDbType.Int).Value = id_Proveedor;
                        cmd.Parameters.Add("@tipoDocumentos", SqlDbType.Int).Value = tipoDocumentos;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

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
                                res.data = GenerarArchivoExcel_reportePagos(dt_detalle);
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


        public string GenerarArchivoExcel_reportePagos(DataTable dt_detalles )
        {
            string Res = "";
            string _servidor;

            int _fila = 8;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
                _servidor = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/pagosProveedores" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "pagosProveedores" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("PagoProveedor");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    oWs.Cells[1, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[1, 1].Value = dt_detalles.Rows[0]["nombreProveedor"].ToString();

                    oWs.Cells[2, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[2, 1].Value = dt_detalles.Rows[0]["rucProveedor"].ToString();

                    oWs.Cells[3, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[3, 1].Value = dt_detalles.Rows[0]["fechaProveedor"].ToString();

                    oWs.Cells[4, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[4, 1].Value = dt_detalles.Rows[0]["cuentaCorriente1"].ToString();

                    oWs.Cells[5, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[5, 1].Value = dt_detalles.Rows[0]["cuentaCorriente2"].ToString();

                    for (int i = 1; i <= 19; i++)
                    {
                        oWs.Cells[7, i].Style.Border.BorderAround(Excel.Style.ExcelBorderStyle.Thin);
                        oWs.Cells[7, i].Style.Font.Bold = true; //Letra negrita
                    }

                    oWs.Cells[7, 1, 7, 10].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    oWs.Cells[7, 1, 7, 10].Style.Fill.BackgroundColor.SetColor(Color.DarkBlue);
                    oWs.Cells[7, 1, 7, 10].Style.Font.Color.SetColor(Color.White);

                    oWs.Cells[7, 1].Value = "ITEMS";
                    oWs.Cells[7, 2].Value = "FECHA EMISIÓN";
                    oWs.Cells[7, 3].Value = "NÚMERO ORDEN DE COMPRA";
                    oWs.Cells[7, 4].Value = "DOCUMENTO";        
                    oWs.Cells[7, 5].Value = "SERIE - NÚMERO";
                    oWs.Cells[7, 6].Value = "DETALLE";
                    oWs.Cells[7, 7].Value = "IMPORTE EN SOLES";
                    oWs.Cells[7, 8].Value = "% DE DETRACCIÓN";
                    oWs.Cells[7, 9].Value = "DETRACCIONES 12% ";             
                    oWs.Cells[7, 10].Value = "POR PAGAR";
                     
                    oWs.Cells[6, 11, 6, 16].Merge = true;  // combinar celdaS dt
                    oWs.Cells[6, 11].Value = "DETALLE DE MEDIO DE PAGO";
                    oWs.Cells[6, 11].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[6, 11].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[6, 11].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[6, 11].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[6, 11, 6, 16].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    oWs.Cells[6, 11, 6, 16].Style.Fill.BackgroundColor.SetColor(Color.LightYellow);

                    oWs.Cells[7, 11, 7, 16].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    oWs.Cells[7, 11, 7, 16].Style.Fill.BackgroundColor.SetColor(Color.LightYellow);
                    oWs.Cells[7, 11].Value = "PAGO A CTA";
                    oWs.Cells[7, 12].Value = "FECHA DE PAGO";
                    oWs.Cells[7, 13].Value = "MEDIO DE PAGO";
                    oWs.Cells[7, 14].Value = "N° OPERACIÓN";
                    oWs.Cells[7, 15].Value = "BANCO";
                    oWs.Cells[7, 16].Value = "ESTADO";

                    oWs.Cells[6, 17, 6, 19].Merge = true;  // combinar celdaS dt
                    oWs.Cells[6, 17].Value = "DETALLE DE DETRACCONES";
                    oWs.Cells[6, 17].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[6, 17].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[6, 17].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[6, 17].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[6, 17, 6, 19].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    oWs.Cells[6, 17, 6, 19].Style.Fill.BackgroundColor.SetColor(Color.Orange);

                    oWs.Cells[7, 17, 7, 19].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    oWs.Cells[7, 17, 7, 19].Style.Fill.BackgroundColor.SetColor(Color.Orange);
                    oWs.Cells[7, 17].Value = "FECHA DE PAGO";
                    oWs.Cells[7, 18].Value = "N° CONSTANCIA";
                    oWs.Cells[7, 19].Value = "IMPORTE PAGADO";
 
                    double detracc12 = 0;
                    double porPagar = 0;
                    double pagoCuenta = 0;
                    int ac = 0;

                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
                        ac += 1;
                        oWs.Cells[_fila, 1].Value = ac;
                        oWs.Cells[_fila, 2].Value = oBj["fechaEmision"].ToString();
                        oWs.Cells[_fila, 3].Value = oBj["numeroOrdenCompra"].ToString();
                        oWs.Cells[_fila, 4].Value = oBj["documento"].ToString();
                        oWs.Cells[_fila, 5].Value = oBj["serieNumero"].ToString();
                        oWs.Cells[_fila, 6].Value = oBj["detalle"].ToString();
 
                        oWs.Cells[_fila, 7].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 7].Value = Convert.ToDouble(oBj["ImporteSoles"].ToString());
                        oWs.Cells[_fila, 7].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 8].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 8].Value = Convert.ToDouble(oBj["PorcDetraccion"].ToString());
                        oWs.Cells[_fila, 8].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 9].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 9].Value = Convert.ToDouble(oBj["detracciones12"].ToString());
                        oWs.Cells[_fila, 9].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 10].Value = Convert.ToDouble(oBj["porPagar"].ToString());
                        oWs.Cells[_fila, 10].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        //--------------DETALLE DE MEDIO DE PAGO
                        oWs.Cells[_fila, 11].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 11].Value = Convert.ToDouble(oBj["pagoCta"].ToString());
                        oWs.Cells[_fila, 11].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 12].Value = oBj["fechaPago"].ToString();
                        oWs.Cells[_fila, 13].Value = oBj["medioPago"].ToString();
                        oWs.Cells[_fila, 14].Value = oBj["nroOperacion"].ToString();
                        oWs.Cells[_fila, 15].Value = oBj["banco"].ToString();
                        oWs.Cells[_fila, 16].Value = oBj["estadoCanceladoPendiente"].ToString();

                        //-------------- DETALLE DE DETRACCONES
                        oWs.Cells[_fila, 17].Value = oBj["fechaPagoDetrac"].ToString();
                        oWs.Cells[_fila, 18].Value = oBj["nroConstanciaDetrac"].ToString();

                        oWs.Cells[_fila, 19].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 19].Value = Convert.ToDouble(oBj["importePagadoDetrac"].ToString());
                        oWs.Cells[_fila, 19].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        detracc12 += Convert.ToDouble(oBj["detracciones12"].ToString());
                        porPagar += Convert.ToDouble(oBj["porPagar"].ToString()); ;
                        pagoCuenta += Convert.ToDouble(oBj["pagoCta"].ToString()); ;

                        _fila++;
                    }

                    _fila += 1;

                    oWs.Row(_fila).Style.Font.Bold = true;
                    oWs.Row(_fila).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Row(_fila).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Cells[_fila, 8].Value = "TOTALES";
                    oWs.Cells[_fila, 9].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila, 9].Value = detracc12;

                    oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila, 10].Value = porPagar;

                    oWs.Cells[_fila, 11].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila, 11].Value = pagoCuenta;

                    _fila += 2;

                    oWs.Row(_fila).Style.Font.Bold = true;
                    oWs.Row(_fila).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Row(_fila).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Cells[_fila, 10].Value = "TOTAL A PAGAR";
                    oWs.Cells[_fila, 11].Style.Numberformat.Format = "#,##0.00";
                    oWs.Cells[_fila, 11].Value = porPagar- pagoCuenta;

                    for (int k = 1; k <= 19; k++)
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




        public object ExportarExcel_IngresoFacturasCompraServicio(int id_tipoOrden, int id_anexo, int id_almacen, int id_estado, string fecha_ini, string fecha_fin, int id_proveedor)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_COMPRAS_SERVICIO_LISTADO_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@id_tipoOrden", SqlDbType.Int).Value = id_tipoOrden;
                        cmd.Parameters.Add("@id_anexo", SqlDbType.Int).Value = id_anexo;
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
                                res.data = GenerarArchivoExcel__IngresoFacturasCompraServicio(dt_detalle);
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


        public string GenerarArchivoExcel__IngresoFacturasCompraServicio(DataTable dt_detalles)
        {
            string Res = "";
            string _servidor;

            int _fila = 2;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
                _servidor = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/ingresoFacturasCyS" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "ingresoFacturasCyS" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("ingresoFacturasCompraServicio");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    for (int i = 1; i <= 11; i++)
                    {
                        oWs.Cells[1, i].Style.Border.BorderAround(Excel.Style.ExcelBorderStyle.Thin);
                    }

                    oWs.Cells[1, 1].Value = "Tipo OC.";
                    oWs.Cells[1, 2].Value = "Tipo Doc.";
                    oWs.Cells[1, 3].Value = "Nro Doc.";
                    oWs.Cells[1, 4].Value = "Nro Compra";
                    
                    oWs.Cells[1, 5].Value = "FecEmisión";
                    oWs.Cells[1, 6].Value = "Almacen";
                    oWs.Cells[1, 7].Value = "Razon Social del Proveedor ";

                    oWs.Cells[1, 8].Value = "Sub Total";
                    oWs.Cells[1, 9].Value = "IGV ";                          
                    oWs.Cells[1, 10].Value = "Total";
                    oWs.Cells[1, 11].Value = "Estado";
           
                    foreach (DataRow oBj in dt_detalles.Rows)
                    {
                        oWs.Cells[_fila, 1].Value = oBj["tipoOC"].ToString();
                        oWs.Cells[_fila, 2].Value = oBj["TipoDoc"].ToString();
                        oWs.Cells[_fila, 3].Value = oBj["nroDoc"].ToString();
                        oWs.Cells[_fila, 4].Value = oBj["nroCompra"].ToString();

                        oWs.Cells[_fila, 5].Value = oBj["fechaEmision"].ToString();
                        oWs.Cells[_fila, 6].Value = oBj["almacen"].ToString();
                        oWs.Cells[_fila, 7].Value = oBj["razonSocial"].ToString();

                        oWs.Cells[_fila, 8].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 8].Value = Convert.ToDouble(oBj["subTotal"].ToString());
                        oWs.Cells[_fila, 8].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 9].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 9].Value = Convert.ToDouble(oBj["igv"].ToString());
                        oWs.Cells[_fila, 9].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 10].Style.Numberformat.Format = "#,##0.00";
                        oWs.Cells[_fila, 10].Value = Convert.ToDouble(oBj["total"].ToString());
                        oWs.Cells[_fila, 10].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 11].Value = oBj["descripcionEstado"].ToString();

                        _fila++;
                    } 

                    oWs.Row(1).Style.Font.Bold = true;
                    oWs.Row(1).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(1).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 11; k++)
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

        public object set_anularIngresoFacturaCompraServicio(int idGuiaCab, int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_COMPRAS_SERVICIO_ANULAR", cn))
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


        public object set_cerrarGuiacompraServicio(int idGuiaCab, int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_INGRESO_COMPRAS_SERVICIO_CERRAR_DOC", cn))
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

    }
}
