using Negocio.Conexion;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Excel = OfficeOpenXml;
using Style = OfficeOpenXml.Style;

namespace Negocio.Reparto.Procesos
{
   public class EntregaPedido_BL
    {
        OleDbConnection con;

        public class Resultado
        {
            public bool ok { get; set; }
            public object data { get; set; }
        }

        public object Listar_GenerarRutaEntrega(int id_local, int id_almacen, int id_Vendedor,int id_transportista , string fecha_ini)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_PROCESO_RUTA_ENTREGA_PEDIDO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_Vendedor", SqlDbType.Int).Value = id_Vendedor;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha_ini;


                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            res.ok = true;
                            res.data = dt_detalle;

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
               
        public object Listar_RegistroRutaEntregaVendedores(int id_vendedor, string fecha_ini, string fecha_fin)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_REPORTE_ENTREGA_PEDIDO_RUTA_VENDEDOR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Vendedor", SqlDbType.Int).Value = id_vendedor;
                        cmd.Parameters.Add("@Fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@Fecha_fin", SqlDbType.VarChar).Value = fecha_fin;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            res.ok = true;
                            res.data = dt_detalle;
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
        
        public object generarDescargaPedidos(int id_local, int id_almacen, int id_Vendedor, string fecha_ini, string fecha_fin, int id_usuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_PROCESOS_EXPORTAR_PEDIDOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_Vendedor", SqlDbType.Int).Value = id_Vendedor;
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
                                res.data = GenerarArchivoExcel_pedidos(dt_detalle, id_usuario);
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
        
        public string GenerarArchivoExcel_pedidos(DataTable dt_detalles, int id_usuario)
        {
            string Res = "";
            int _fila = 3;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
 
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/" + id_usuario + "RegistroPedidos.xlsx");
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + id_usuario + "RegistroPedidos.xlsx";
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("PlantillaPedidos");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));

                    for (int i = 1; i <= 29; i++)
                    {
                        oWs.Cells[2, i].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    }

                    for (int i = 1; i <= 2; i++)
                    {
                        oWs.Cells[i, 1].Value = "MOVIMIENTO";
                        oWs.Cells[i, 2].Value = "DOCUMENTO";
                        oWs.Cells[i, 3].Value = "SERIE";
                        oWs.Cells[i, 4].Value = "NUMERO";
                        oWs.Cells[i, 5].Value = "RUC O DNI";
                        oWs.Cells[i, 6].Value = "TIPO DOC";
                        oWs.Cells[i, 7].Value = "RAZON SOCIAL";
                        oWs.Cells[i, 8].Value = "DIRECCION";

                        oWs.Cells[i, 9].Value = "FECHA";
                        oWs.Cells[i, 10].Value = "F.VENCIMIENTO";
                        oWs.Cells[i, 11].Value = "F.AMAC.";
                        oWs.Cells[i, 12].Value = "PAGO";
                        oWs.Cells[i, 13].Value = "MONEDA";
                        oWs.Cells[i, 14].Value = "VENDEDOR";
                        oWs.Cells[i, 15].Value = "COND. PAGO";
                        oWs.Cells[i, 16].Value = "OTROS CONCEPTOS";
                        oWs.Cells[i, 17].Value = "T.CAMBIO";
                        oWs.Cells[i, 18].Value = "ALMACEN";
                        oWs.Cells[i, 19].Value = "MOTIVO";
                        oWs.Cells[i, 20].Value = "COD.PRODUCTO";
                        oWs.Cells[i, 21].Value = "DETALLE";
                        oWs.Cells[i, 22].Value = "U.MEDIDA";
                        oWs.Cells[i, 23].Value = "CANTIDAD";
                        oWs.Cells[i, 24].Value = "NFACTOR";
                        oWs.Cells[i, 25].Value = "PRECIO UNIT.";
                        oWs.Cells[i, 26].Value = "ADICIONAL 1";
                        oWs.Cells[i, 27].Value = "ADICIONAL 2";
                        oWs.Cells[i, 28].Value = "C.COSTOS1";
                        oWs.Cells[i, 29].Value = "C.COSTOS2";
                    }


 
  
                    foreach (DataRow oBj in dt_detalles.Rows)
                    {                         
                        oWs.Cells[_fila, 1].Value = Convert.ToString(oBj["Movimiento"]);                         
                        oWs.Cells[_fila, 2].Value = oBj["Documento"].ToString();                         
                        oWs.Cells[_fila, 3].Value = oBj["Serie"].ToString();                         
                        oWs.Cells[_fila, 4].Value = oBj["Numero"].ToString();                         
                        oWs.Cells[_fila, 5].Value = oBj["RUC_DNI"].ToString();                         
                        oWs.Cells[_fila, 6].Value =  Convert.ToInt32(oBj["TipoDoc"]);                         
                        oWs.Cells[_fila, 7].Value = oBj["razonSocial"].ToString();
                        oWs.Cells[_fila, 8].Value = oBj["direccion"].ToString();

                        oWs.Cells[_fila, 9].Value = oBj["Fecha"].ToString();                         
                        oWs.Cells[_fila, 10].Value = oBj["F_Vencimiento"].ToString();                          
                        oWs.Cells[_fila, 11].Value = oBj["F_Amac"].ToString();                          
                        oWs.Cells[_fila, 12].Value = oBj["Pago"].ToString();                         
                        oWs.Cells[_fila, 13].Value = oBj["Moneda"].ToString();                         
                        oWs.Cells[_fila, 14].Value = oBj["Vendedor"].ToString();                         
                        oWs.Cells[_fila, 15].Value = oBj["Cond_Pago"].ToString();                         
                        oWs.Cells[_fila, 16].Value = oBj["Otros_Conceptos"].ToString();                         
                        oWs.Cells[_fila, 17].Value = Math.Round(Convert.ToDecimal(oBj["T_Cambio"]), 2);                         
                        oWs.Cells[_fila, 18].Value = oBj["ALmacen"].ToString();                         
                        oWs.Cells[_fila, 19].Value = oBj["Motivo"].ToString();                         
                        oWs.Cells[_fila, 20].Value = oBj["Cod_Producto"].ToString();                         
                        oWs.Cells[_fila, 21].Value = oBj["Detalle"].ToString();                         
                        oWs.Cells[_fila, 22].Value = oBj["U_Medida"].ToString();                         
                        oWs.Cells[_fila, 23].Value = Math.Round(Convert.ToDecimal(oBj["Cantidad"]), 2);                        
                        oWs.Cells[_fila, 24].Value = Convert.ToDecimal(oBj["Nfactor"]);                        
                        oWs.Cells[_fila, 25].Value = Convert.ToDecimal(oBj["Precio_Unit"]);
                        oWs.Cells[_fila, 26].Value = oBj["Adicional_1"].ToString();
                        oWs.Cells[_fila, 27].Value = oBj["Adicional_2"].ToString();
                        oWs.Cells[_fila, 28].Value = oBj["C_Costos1"].ToString();
                        oWs.Cells[_fila, 28].Value = oBj["C_Costos2"].ToString();
 
                        _fila++;
                    }

                    oWs.Row(1).Style.Font.Bold = true;
                    oWs.Row(1).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(1).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    
                    oWs.Column(1).Style.Numberformat.Format = "@";
                    oWs.Column(2).Style.Numberformat.Format = "@";
                    oWs.Column(3).Style.Numberformat.Format = "@";
                    oWs.Column(4).Style.Numberformat.Format = "@";
                    oWs.Column(5).Style.Numberformat.Format = "@";
                    oWs.Column(6).Style.Numberformat.Format = "0";
                    oWs.Column(7).Style.Numberformat.Format = "@";
                    oWs.Column(8).Style.Numberformat.Format = "@";

                    oWs.Column(9).Style.Numberformat.Format = "@";
                    oWs.Column(10).Style.Numberformat.Format = "@";
                    oWs.Column(11).Style.Numberformat.Format = "@";
                    oWs.Column(12).Style.Numberformat.Format = "@";
                    oWs.Column(13).Style.Numberformat.Format = "@";
                    oWs.Column(14).Style.Numberformat.Format = "@";
                    oWs.Column(15).Style.Numberformat.Format = "@";
                    oWs.Column(16).Style.Numberformat.Format = "@";
                    oWs.Column(17).Style.Numberformat.Format = "#,##0.00";
                    oWs.Column(18).Style.Numberformat.Format = "@";
                    oWs.Column(19).Style.Numberformat.Format = "@";
                    oWs.Column(20).Style.Numberformat.Format = "@";
                    oWs.Column(21).Style.Numberformat.Format = "@";
                    oWs.Column(22).Style.Numberformat.Format = "@";
                    oWs.Column(23).Style.Numberformat.Format = "#,##0.00";
                    oWs.Column(24).Style.Numberformat.Format = "#,##0.00";
                    oWs.Column(25).Style.Numberformat.Format = "#,##0.0000";
                    oWs.Column(26).Style.Numberformat.Format = "@";
                    oWs.Column(27).Style.Numberformat.Format = "@";
                    oWs.Column(28).Style.Numberformat.Format = "@";
                    oWs.Column(29).Style.Numberformat.Format = "@";

                    for (int k = 2; k <= 28; k++)
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
               
        public string Get_ImportarArchivoPedido(int user, string fechaAsignacion, string nombrefile, int idLocal)
        {

            string Resultado = null;

            DataTable dt_detalle = new DataTable();
            try
            {
                string rutaExcel = "";
                rutaExcel = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/ImportarPedido" + user + ".xlsx");

                String strExcelConn = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + rutaExcel + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                OleDbConnection MyConnection;

                OleDbDataAdapter MyCommand = null;
                MyConnection = new OleDbConnection(strExcelConn);

                try
                {
                    MyCommand = new OleDbDataAdapter("select * from [Importar$]", MyConnection);
                    MyCommand.Fill(dt_detalle);
                }
                catch (Exception)
                {
                    throw;
                }

                using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_D_IMPORTAR_PEDIDO", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = user;
                        cmd.ExecuteNonQuery();
                    }

                    //guardando al informacion de la importacion
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(con))
                    {
                        bulkCopy.BatchSize = 500;
                        bulkCopy.NotifyAfter = 1000;
                        bulkCopy.DestinationTableName = "TEMP_IMPORTAR_PEDIDO";
                        bulkCopy.WriteToServer(dt_detalle);

                        //Actualizando campos 
                        string Sql = "UPDATE TEMP_IMPORTAR_PEDIDO SET  id_usuario_importa ='" + user + "', fecha_Asignacion ='" + fechaAsignacion + "' , nombre_Archivo ='" + nombrefile + "' ,  id_local=  '" + idLocal + "'   ,    fecha_Carga=getdate() WHERE id_usuario_importa IS NULL  ";

                        using (SqlCommand cmd = new SqlCommand(Sql, con))
                        {
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.Text;
                            cmd.ExecuteNonQuery();
                        }

                        using (SqlCommand cmd = new SqlCommand("PROC_I_IMPORTAR_PEDIDO", con))
                        {
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = user;
                            cmd.Parameters.Add("@fecha_asignacion", SqlDbType.VarChar).Value = fechaAsignacion;
                            cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = idLocal;
                            cmd.ExecuteNonQuery();
                        }

                    }
                    Resultado = "OK";
                }
            }
            catch (Exception)
            {
                throw;
            }
            return Resultado;
        }
               
        public object Listar_PedidoCab(int id_local, int id_almacen, int id_Vendedor, int id_transportista, int id_tipoEntrega, string fecha_ini)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_APROBAR_DEVOLUCION_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_Vendedor", SqlDbType.Int).Value = id_Vendedor;
                        cmd.Parameters.Add("@id_transportista", SqlDbType.Int).Value = id_transportista;
                        cmd.Parameters.Add("@id_tipoEntrega", SqlDbType.Int).Value = id_tipoEntrega;
                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha_ini;


                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            res.ok = true;
                            res.data = dt_detalle;

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

        public object Listar_PedidoDet(int idPedido)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_APROBAR_DEVOLUCION_DET", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Pedido_Cab", SqlDbType.Int).Value = idPedido;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            res.ok = true;
                            res.data = dt_detalle;

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

         public string set_Generar_AprobacionDevolucion(int idPedido, string fechaTransaccion, string nroNotaCredito, int usuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_GENERAR_APROBAR_DEVOLUCION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idPedido", SqlDbType.Int).Value = idPedido;
                        cmd.Parameters.Add("@fechaTransaccion", SqlDbType.VarChar).Value = fechaTransaccion;
                        cmd.Parameters.Add("@nroNotaCredito", SqlDbType.VarChar).Value = nroNotaCredito;
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
               
        public object Listar_almacenesGenerales(int id_usuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_IMPORTAR_STOCK_ALMACEN_COMBO_ALMACEN", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
 
                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            res.ok = true;
                            res.data = dt_detalle;

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


        public string Get_ImportarArchivoStockAlmacen(int user, string nombrefile, int idAlmacen)
        {

            string Resultado = null;

            DataTable dt_detalle = new DataTable();
            try
            {
                string rutaExcel = "";
                rutaExcel = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/ImportarStockAlmacen" + user + ".xlsx");

                String strExcelConn = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + rutaExcel + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                OleDbConnection MyConnection;

                OleDbDataAdapter MyCommand = null;
                MyConnection = new OleDbConnection(strExcelConn);

                try
                {
                    MyCommand = new OleDbDataAdapter("select * from [Importar$]", MyConnection);
                    MyCommand.Fill(dt_detalle);
                }
                catch (Exception)
                {
                    throw;
                }

                using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_D_TEMP_IMPORTAR_STOCK_ALMACEN", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = user;
                        cmd.ExecuteNonQuery();
                    }

                    //guardando al informacion de la importacion
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(con))
                    {
                        bulkCopy.BatchSize = 500;
                        bulkCopy.NotifyAfter = 1000;
                        bulkCopy.DestinationTableName = "TEMP_IMPORTAR_STOCK_ALMACEN";
                        bulkCopy.WriteToServer(dt_detalle);

                        //Actualizando campos 
                        string Sql = "UPDATE TEMP_IMPORTAR_STOCK_ALMACEN SET  id_usuario_importa ='" + user + "',  nombre_Archivo ='" + nombrefile + "' ,  id_almacen =  '" + idAlmacen + "'   ,    fecha_Carga=getdate() WHERE id_usuario_importa IS NULL  ";

                        using (SqlCommand cmd = new SqlCommand(Sql, con))
                        {
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.Text;
                            cmd.ExecuteNonQuery();
                        }

                        using (SqlCommand cmd = new SqlCommand("SP_S_IMPORTAR_STOCK_ALMACEN_GUARDAR_EXCEL", con))
                        {
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = user;
                            cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = idAlmacen;
                            cmd.ExecuteNonQuery();
                        }

                    }
                    Resultado = "OK";
                }
            }
            catch (Exception)
            {
                throw;
            }
            return Resultado;
        }


        public object get_busquedaLogin(int opcionElegido, string login, int  id_usuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_HABILITAR_USUARIO_BUSCAR_LOGIN", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@opcion", SqlDbType.Int).Value = opcionElegido;
                        cmd.Parameters.Add("@login", SqlDbType.VarChar).Value = login;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            res.ok = true;
                            res.data = dt_detalle;

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
               
        public object set_activarUsuario_sesion(int opcionElegido, string id_login, int id_usuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_HABILITAR_USUARIO_ACTIVAR_USUARIO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@opcion", SqlDbType.Int).Value = opcionElegido;
                        cmd.Parameters.Add("@id_login", SqlDbType.VarChar).Value = id_login;
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

        public string Get_ImportarArchivoPrecio(int user, string nombrefile, int tipoImportacion)
        {

            string Resultado = null;

            DataTable dt_detalle = new DataTable();
            try
            {
                string rutaExcel = "";
                rutaExcel = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/ImportarPrecio" + user + ".xlsx");

                String strExcelConn = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + rutaExcel + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                OleDbConnection MyConnection;

                OleDbDataAdapter MyCommand = null;
                MyConnection = new OleDbConnection(strExcelConn);

                try
                {
                    MyCommand = new OleDbDataAdapter("select * from [Importar$]", MyConnection);
                    MyCommand.Fill(dt_detalle);
                }
                catch (Exception)
                {
                    throw;
                }

                using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_D_TEMP_IMPORTAR_PRECIO", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = user;
                        cmd.ExecuteNonQuery();
                    }

                    //guardando al informacion de la importacion
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(con))
                    {
                        bulkCopy.BatchSize = 500;
                        bulkCopy.NotifyAfter = 1000;
                        bulkCopy.DestinationTableName = "TEMP_IMPORTAR_PRECIO";
                        bulkCopy.WriteToServer(dt_detalle);

                        //Actualizando campos 
                        string Sql = "UPDATE TEMP_IMPORTAR_PRECIO SET tipoImportacion ='" + tipoImportacion + "', id_usuario_importa ='" + user + "',  nombre_Archivo ='" + nombrefile + "' ,    fecha_Carga=getdate() WHERE id_usuario_importa IS NULL  ";

                        using (SqlCommand cmd = new SqlCommand(Sql, con))
                        {
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.Text;
                            cmd.ExecuteNonQuery();
                        }

                        using (SqlCommand cmd = new SqlCommand("PROC_I_IMPORTAR_PRECIO_GUARDAR_EXCEL", con))
                        {
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = user;
                            cmd.Parameters.Add("@tipoImportacion", SqlDbType.Int).Value = tipoImportacion;
                            cmd.ExecuteNonQuery();
                        }

                    }
                    Resultado = "OK";
                }
            }
            catch (Exception)
            {
                throw;
            }
            return Resultado;
        }
        
        public object generarDescargaPedidos_txt(int id_local, int id_almacen, int id_Vendedor, string fecha_ini, string fecha_fin, int id_usuario)
        {
            Resultado res = new Resultado();
            string FileExcel = "";
            string FileRuta = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_PROCESOS_EXPORTAR_PEDIDOS_TXT", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = id_almacen;
                        cmd.Parameters.Add("@id_Vendedor", SqlDbType.Int).Value = id_Vendedor;
                        cmd.Parameters.Add("@fecha_ini", SqlDbType.VarChar).Value = fecha_ini;
                        cmd.Parameters.Add("@fecha_fin", SqlDbType.VarChar).Value = fecha_fin;


                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            if (dt_detalle.Rows.Count <= 0)
                            {
                                res.ok = false;
                                res.data = "No hay informacion disponible";
                            }
                            else
                            {
                                string[] linesArchivo = new string[dt_detalle.Rows.Count];
                                int i = 0;

                                foreach (DataRow oBj in dt_detalle.Rows)
                                {
                                    linesArchivo[i] = Convert.ToString(oBj["Movimiento"]) + ';' +
                                                       oBj["Documento"].ToString() + ';' +
                                                       oBj["Serie"].ToString() + ';' +
                                                       oBj["Numero"].ToString() + ';' +
                                                       oBj["RUC_DNI"].ToString() + ';' +
                                                       Convert.ToInt32(oBj["TipoDoc"]) + ';' +
                                                       oBj["razonSocial"].ToString() + ';' +
                                                       oBj["direccion"].ToString() + ';' +

                                                       oBj["Fecha"].ToString() + ';' +
                                                       oBj["F_Vencimiento"].ToString() + ';' +
                                                       oBj["F_Amac"].ToString() + ';' +
                                                       oBj["Pago"].ToString() + ';' +
                                                       oBj["Moneda"].ToString() + ';' +
                                                       oBj["Vendedor"].ToString() + ';' +
                                                       oBj["Cond_Pago"].ToString() + ';' +
                                                       oBj["Otros_Conceptos"].ToString() + ';' +
                                                       Math.Round(Convert.ToDecimal(oBj["T_Cambio"]), 2) + ';' +
                                                       oBj["ALmacen"].ToString() + ';' +
                                                       oBj["Motivo"].ToString() + ';' +
                                                       oBj["Cod_Producto"].ToString() + ';' +
                                                       oBj["Detalle"].ToString() + ';' +
                                                       oBj["U_Medida"].ToString() + ';' +
                                                       Math.Round(Convert.ToDecimal(oBj["Cantidad"]), 2) + ';' +
                                                       Convert.ToDecimal(oBj["Nfactor"]) + ';' +
                                                       Convert.ToDecimal(oBj["Precio_Unit"]) + ';' +
                                                       oBj["Adicional_1"].ToString() + ';' +
                                                       oBj["Adicional_2"].ToString() + ';' +
                                                       oBj["C_Costos1"].ToString() + ';' +
                                                       oBj["C_Costos2"].ToString();
                                    i = i + 1;


                                }


                                //------creando el archivo ---
                                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/" + id_usuario + "RegistroPedidos.txt");
                                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                                FileExcel = rutaServer + id_usuario + "RegistroPedidos.txt";
                                FileInfo _file = new FileInfo(FileRuta);
                                if (_file.Exists)
                                {
                                    _file.Delete();
                                    _file = new FileInfo(FileRuta);
                                }

                                //---- almacenando la informacion ---           
                                //System.IO.File.WriteAllLines(FileRuta, linesArchivo);
                                System.IO.File.WriteAllLines(FileRuta, linesArchivo, Encoding.UTF8);

                                //-----            
                                if (_file.Exists)
                                {
                                    res.ok = true;
                                    res.data = FileExcel;
                                }
                                else {

                                    res.ok = false;
                                    res.data = "Lo sentimos no se pudo almacenar el archivo en el servidor ..";
                                }

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

        public object get_tiposMovimientos(int id_usuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_AJUSTE_INVENTARIO_COMBO_MOVIMIENTOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

                        DataTable dt_detalle = new DataTable();

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            res.ok = true;
                            res.data = dt_detalle;

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

        private OleDbConnection ConectarExcel(string rutaExcel)
        {
            con = new OleDbConnection();
            try
            {
                con.ConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + rutaExcel + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                con.Open();
                return con;
            }
            catch (Exception)
            {
                con.Close();
                throw;
            }
        }

        public DataTable ListaExcel(string fileLocation)
        {
            DataTable dt = new DataTable();
            try
            {
                string sql = "SELECT *FROM [Importar$]";

                OleDbDataAdapter da = new OleDbDataAdapter(sql, ConectarExcel(fileLocation));
                da.SelectCommand.CommandType = CommandType.Text;
                da.Fill(dt);
                con.Close();
            }
            catch (Exception)
            {
                con.Close();
                throw;
            }
            return dt;
        }



        public string setAlmacenandoFile_Excel_ajusteInventario(string fileLocation, string nombreArchivo,  int idUsuario)
        {
            string resultado = "";
            DataTable dt = new DataTable();

            try
            {

                dt = ListaExcel(fileLocation);

                using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();

                    //eliminando registros del usuario
                    using (SqlCommand cmd = new SqlCommand("SP_S_AJUSTE_INVENTARIO_D_TEMPORAL_AJUSTE_INVENTARIO", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = idUsuario;
                        cmd.ExecuteNonQuery();
                    }

                    //guardando al informacion de la importacion
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(con))
                    {

                        bulkCopy.BatchSize = 500;
                        bulkCopy.NotifyAfter = 1000;
                        bulkCopy.DestinationTableName = "TEMPORAL_AJUSTE_INVENTARIO";
                        bulkCopy.WriteToServer(dt);

                        //Actualizando campos 

                        string Sql = "UPDATE TEMPORAL_AJUSTE_INVENTARIO SET nombreArchivo='" + nombreArchivo + "',   usuario_importacion='" + idUsuario + "', fechaBD=getdate()   WHERE usuario_importacion IS NULL    ";

                        using (SqlCommand cmd = new SqlCommand(Sql, con))
                        {
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.Text;
                            cmd.ExecuteNonQuery();
                        }
                    }
                    resultado = "OK";
                }
            }
            catch (Exception)
            {
                throw;
            }
            return resultado;
        }

        public DataTable get_datosCargados_ajusteInventario(int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_AJUSTE_INVENTARIO_S_TEMPORAL_AJUSTE_INVENTARIO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }


        public object set_almacenando_ajusteInventario(int id_usuario, int idLocal, int  idAlmacen, string fecha, int  idMovimiento, string nroDoc)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_AJUSTE_INVENTARIO_INSERT_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = id_usuario;
                        cmd.Parameters.Add("@idLocal", SqlDbType.Int).Value = idLocal;
                        cmd.Parameters.Add("@idAlmacen", SqlDbType.Int).Value = idAlmacen;

                        cmd.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;
                        cmd.Parameters.Add("@idMovimiento", SqlDbType.Int).Value = idMovimiento;
                        cmd.Parameters.Add("@nroDoc", SqlDbType.VarChar).Value = nroDoc;

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
