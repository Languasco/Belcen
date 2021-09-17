using Entidades;
using Entidades.StockAlmacen;
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
namespace Negocio.StockAlmacen
{
    public class GetStockAlmacen_BL
    {
        SqlDataReader dr;
        StockAlmacen_Ent objStockAlmacen;
        kardesAlmacen objStockKardex;
        List<kardesAlmacen> listKardexAlmacen;
        List<StockAlmacen_Ent> listStockAlmacen;

        public object getStockAlmacen(int idUsuario, int idLocal, int idAlmacen, string mov)
        {
            listStockAlmacen = new List<StockAlmacen_Ent>();
            using (SqlConnection cnDB = new SqlConnection(bdConexion.cadenaBDcx()))
            {
                cnDB.Open();
                SqlCommand cmd = new SqlCommand("SP_CALCULAR_STOCK_TRANSFERENCIAS", cnDB);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@ID_ALMACEN", SqlDbType.Int).Value = idAlmacen;
                cmd.Parameters.Add("@ID_LOCAL", SqlDbType.Int).Value = idLocal;
                cmd.Parameters.Add("@ID_USUARIO", SqlDbType.Int).Value = idUsuario;
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    objStockAlmacen = new StockAlmacen_Ent();
                    objStockAlmacen.id = Convert.ToInt32(dr["ID"]);
                    objStockAlmacen.id_Producto = Convert.ToInt32(dr["ID_PRODUCTO"]);
                    objStockAlmacen.codigo_Producto = dr["CODIGO_PRODUCTO"].ToString();
                    objStockAlmacen.nombre_Producto = dr["NOMBRE_PRODUCTO"].ToString();
                    objStockAlmacen.um_Producto = dr["UM"].ToString();
                    objStockAlmacen.categoria_Producto = dr["CATEGORIA"].ToString();
                    objStockAlmacen.stock_Producto = Convert.ToDecimal(dr["STOCK"]);
                    objStockAlmacen.marca_Producto = dr["MARCA"].ToString();
                    objStockAlmacen.cantidad_ingresada = "";
                    objStockAlmacen.nroLote = dr["nroLote"].ToString();
                    objStockAlmacen.idUnidadMedida = dr["idUnidadMedida"].ToString();
                    objStockAlmacen.fechaProduccion = dr["fechaProduccion"].ToString();
                    objStockAlmacen.fechaVencimiento = dr["fechaVencimiento"].ToString();

                    listStockAlmacen.Add(objStockAlmacen);
                }
            }
            return listStockAlmacen;
        }

        public object getKardexAlmacen(string fechaini, string fechafin, int id_material)
        {
            listKardexAlmacen = new List<kardesAlmacen>();
            using (SqlConnection cnDB = new SqlConnection(bdConexion.cadenaBDcx()))
            {
                cnDB.Open();
                SqlCommand cmd = new SqlCommand("SP_GET_KARDEX", cnDB);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@FECHAINI", SqlDbType.VarChar).Value = fechaini;
                cmd.Parameters.Add("@FECHAFIN", SqlDbType.VarChar).Value = fechafin;
                cmd.Parameters.Add("@ID_MATERIAL", SqlDbType.Int).Value = id_material;
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    objStockKardex = new kardesAlmacen();
                    objStockKardex.id = Convert.ToInt32(dr["ID"]);
                    objStockKardex.tipo = dr["tipo"].ToString();
                    objStockKardex.fecha = dr["fecha"].ToString();
                    objStockKardex.tipoMov = dr["tipoMov"].ToString();
                    objStockKardex.nrodoc = dr["nrodoc"].ToString();
                    objStockKardex.operacion = dr["operacion"].ToString();
                    objStockKardex.cantidad = dr["cantidad"].ToString();
                    objStockKardex.precio = dr["precio"].ToString();
                    objStockKardex.costoTotal = dr["costoTotal"].ToString();
                    listKardexAlmacen.Add(objStockKardex);
                }
            }
            return listKardexAlmacen;
        }

        public object getKardexAlmacen_new(string fechaini, string fechafin, int id_material, int tipo, int local, int almacen)
        {
            listKardexAlmacen = new List<kardesAlmacen>();
            using (SqlConnection cnDB = new SqlConnection(bdConexion.cadenaBDcx()))
            {
                cnDB.Open();
                SqlCommand cmd = new SqlCommand("SP_GET_KARDEX_new", cnDB);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@FECHAINI", SqlDbType.VarChar).Value = fechaini;
                cmd.Parameters.Add("@FECHAFIN", SqlDbType.VarChar).Value = fechafin;
                cmd.Parameters.Add("@ID_MATERIAL", SqlDbType.Int).Value = id_material;
                cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = local;
                cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = almacen;

                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    objStockKardex = new kardesAlmacen();
                    objStockKardex.id = Convert.ToInt32(dr["ID"]);
                    objStockKardex.tipo = dr["tipo"].ToString();
                    objStockKardex.fecha = dr["fecha"].ToString();
                    objStockKardex.tipoMov = dr["tipoMov"].ToString();
                    objStockKardex.nrodoc = dr["nrodoc"].ToString();
                    objStockKardex.operacion = dr["operacion"].ToString();
                    objStockKardex.cantidad = dr["cantidad"].ToString();
                    objStockKardex.precio = dr["precio"].ToString();
                    objStockKardex.costoTotal = dr["costoTotal"].ToString();
                    objStockKardex.saldoinicial = dr["inicial"].ToString();
                    listKardexAlmacen.Add(objStockKardex);
                }
            }
            return listKardexAlmacen;
        }





        public object getKardexAlmacen_todo(string fechaini, string fechafin, int tipo, int local, int almacen, int idMaterial)
        {
            listKardexAlmacen = new List<kardesAlmacen>();
            string result = "";
            using (SqlConnection cnDB = new SqlConnection(bdConexion.cadenaBDcx()))
            {
                cnDB.Open();
                SqlCommand cmd = new SqlCommand("SP_GET_KARDEX_TODO", cnDB);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@FECHAINI", SqlDbType.VarChar).Value = fechaini;
                cmd.Parameters.Add("@FECHAFIN", SqlDbType.VarChar).Value = fechafin;
                cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = local;
                cmd.Parameters.Add("@id_almacen", SqlDbType.Int).Value = almacen;
                cmd.Parameters.Add("@id_material", SqlDbType.Int).Value = idMaterial;


                dr = cmd.ExecuteReader();
                int idPro = 0;
                double saldoInicialAux = 0;
                double cantidad = 0;
                while (dr.Read())
                {
                    objStockKardex = new kardesAlmacen();
                    objStockKardex.id = Convert.ToInt32(dr["ID"]);
                    objStockKardex.tipo = dr["tipo"].ToString();
                    objStockKardex.fecha = dr["fecha"].ToString();
                    objStockKardex.tipoMov = dr["tipoMov"].ToString();
                    objStockKardex.nrodoc = dr["nrodoc"].ToString();
                    objStockKardex.operacion = dr["operacion"].ToString();
                    objStockKardex.cantidadAux = Convert.ToDouble(dr["cantidad"].ToString());
                    objStockKardex.precio = dr["precio"].ToString();
                    objStockKardex.costoTotal = dr["costoTotal"].ToString();
                    objStockKardex.codigo_producto = dr["codigo1_producto"].ToString();
                    objStockKardex.nombre_producto = dr["nombre_producto"].ToString();
                    objStockKardex.saldoinicial = "";
                    objStockKardex.id_Producto = Convert.ToInt32(dr["id_producto"].ToString());
                    if (idPro != Convert.ToInt32(dr["id_producto"].ToString()))
                    {
                        saldoInicialAux = 0;
                        cantidad = 0;
                        idPro = Convert.ToInt32(dr["id_producto"].ToString());
                        DataTable newDtSaldoInicial = new DataTable();
                        newDtSaldoInicial = getSaldoInicial(fechaini, idPro, local, almacen);
                        DataRow dtRow = newDtSaldoInicial.Rows[0];
                        string saldoInnicial = dtRow[0].ToString() == "" ? "0" : dtRow[0].ToString();
                        objStockKardex.saldoinicialAux = Convert.ToDouble(saldoInnicial);
                        objStockKardex.saldoinicial = saldoInnicial;
                        saldoInicialAux = objStockKardex.saldoinicialAux == 0 ? 0 : objStockKardex.saldoinicialAux;
                    }


                    if (objStockKardex.tipo == "I")
                    {
                        cantidad = cantidad + objStockKardex.cantidadAux;
                        objStockKardex.saldoinicialAux = saldoInicialAux + cantidad;
                    }
                    else if (objStockKardex.tipo == "S")
                    {
                        cantidad = cantidad - objStockKardex.cantidadAux;
                        objStockKardex.saldoinicialAux = saldoInicialAux + cantidad;
                    }

                    listKardexAlmacen.Add(objStockKardex);
                }
                result = generarExcelKardex(listKardexAlmacen, fechaini);
            }
            return result;
        }


        public string generarExcelKardex(List<kardesAlmacen> listKardexAlmacen, string fechaini)
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
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/" + "kardex_" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "kardex_" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }


                if (listKardexAlmacen.Count <= 0)
                {
                    Res = "0|No hay informacion disponible";
                    return Res;
                }



                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("kardex");


                    oWs.Cells[1, 1].Value = "REPORTE KARDEX: ";
                    oWs.Cells[1, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center; // alinear texto  
                    oWs.Cells[1, 1, 1, 18].Merge = true;  // combinar celdaS 
                    oWs.Cells[1, 1].Style.Font.Size = 15; //letra tamaño   

                    oWs.Cells[2, 1].Value = "Fecha : " + fechaini;
                    oWs.Cells[2, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center; // alinear texto  
                    oWs.Cells[2, 1, 2, 18].Merge = true;  // combinar celdaS 
                    oWs.Cells[2, 1].Style.Font.Size = 8; //letra tamaño   


                    oWs.Cells[4, 3].Value = "DOCUMENTO";
                    oWs.Cells[4, 3, 4, 6].Merge = true;  // combinar celdaS 
                    oWs.Cells[4, 3].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[4, 3].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    //oWs.Column(3).Width = 500;



                    
                    oWs.Cells[4, 7].Value = "Tipo de Operación";
                    oWs.Cells[4, 7, 5, 7].Merge = true;  // combinar celdaS 
                    oWs.Cells[4, 7].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[4, 7].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[4, 7].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                    oWs.Column(7).Width = 14;

                    oWs.Cells[4, 8].Value = "Entradas";
                    oWs.Cells[4, 8, 4, 10].Merge = true;  // combinar celdaS 
                    oWs.Cells[4, 8].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[4, 8].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    //oWs.Column(3).Width = 500;

                    oWs.Cells[5, 8].Value = "Cantidad";
                    oWs.Cells[5, 8].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 8].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 8].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[5, 9].Value = "Costo Unit";
                    oWs.Cells[5, 9].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 9].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 9].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[5, 10].Value = "Costo Total";
                    oWs.Cells[5, 10].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 10].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 10].Style.Font.Bold = true; //Letra negrita


                    oWs.Cells[4, 11].Value = "Salidas";
                    oWs.Cells[4, 11, 4, 13].Merge = true;  // combinar celdaS 
                    oWs.Cells[4, 11].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[4, 11].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    //oWs.Column(3).Width = 500;



                    oWs.Cells[5, 11].Value = "Cantidad";
                    oWs.Cells[5, 11].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 11].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 11].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[5, 12].Value = "Costo Unit";
                    oWs.Cells[5, 12].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 12].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 12].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[5, 13].Value = "Costo Total";
                    oWs.Cells[5, 13].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 13].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 13].Style.Font.Bold = true; //Letra negrita



                    oWs.Cells[4, 14].Value = "Saldo Final";
                    oWs.Cells[4, 14, 4, 16].Merge = true;  // combinar celdaS 
                    oWs.Cells[4, 14].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[4, 14].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    //oWs.Column(3).Width = 500;



                    oWs.Cells[5, 14].Value = "Cantidad";
                    oWs.Cells[5, 14].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 14].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 14].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[5, 15].Value = "Costo Unit";
                    oWs.Cells[5, 15].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 15].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 15].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[5, 16].Value = "Costo Total";
                    oWs.Cells[5, 16].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 16].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 16].Style.Font.Bold = true; //Letra negrita




                    oWs.Cells[5, 1].Value = "Codigo";
                    oWs.Cells[5, 1].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[5, 1].Merge = true;  // combinar celdaS 
                

                    oWs.Cells[5, 2].Value = "Nombre";
                    oWs.Cells[5, 2].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 2].Style.Font.Bold = true; //Letra negrita
                    oWs.Column(2).Width = 38;

                    oWs.Cells[5, 3].Value = "Fecha";
                    oWs.Cells[5, 3].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 3].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 3].Style.Font.Bold = true; //Letra negrita


                    oWs.Cells[5, 4].Value = "Tipo Tabla";
                    oWs.Cells[5, 4].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 4].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 4].Style.Font.Bold = true; //Letra negrita
                    oWs.Column(4).Width = 14;

                    oWs.Cells[5, 5].Value = "Serie";
                    oWs.Cells[5, 5].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 5].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 5].Style.Font.Bold = true; //Letra negrita


                    oWs.Cells[5, 6].Value = "Número";
                    oWs.Cells[5, 6].Style.Font.Size = 8; //letra tamaño   
                    oWs.Cells[5, 6].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[5, 6].Style.Font.Bold = true; //Letra negrita


                    inc = 0;
                    _ultimaColum = 6;
                    int _ultimaRow = 6;
                    double TotalCantidadI = 0;
                    double TotalCantidadS = 0;

                    decimal TotalCostoI = 0;
                    decimal TotalCostoS = 0;
                    double TotalSaldoUnit = 0;
                    double TotalSaldoCosto = 0;
                    int count = 0;
                    foreach (var item in listKardexAlmacen)
                    {
                        count++;
                        if (item.saldoinicial.Length > 0)
                        {

                            if (count != 1)
                            {

                                // SALIDAAA
                                //TOTAL TEXT
                                oWs.Cells[_ultimaRow, 2].Value = "Total";
                                oWs.Cells[_ultimaRow, 2].Style.Font.Size = 8; //letra tamaño   
                                oWs.Cells[_ultimaRow, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                                oWs.Cells[_ultimaRow, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                                oWs.Cells[_ultimaRow, 2].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlueViolet);
                                oWs.Cells[_ultimaRow, 2].Style.Font.Color.SetColor(Color.White);
                                oWs.Cells[_ultimaRow, 2].Style.Font.Bold = true; //Letra negrita


                                //TOTAL CANTIDAD
                                oWs.Cells[_ultimaRow, 11].Value = TotalCantidadS;
                                oWs.Cells[_ultimaRow, 11].Style.Font.Size = 8; //letra tamaño   
                                oWs.Cells[_ultimaRow, 11].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                                oWs.Cells[_ultimaRow, 11].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                                oWs.Cells[_ultimaRow, 11].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlueViolet);
                                oWs.Cells[_ultimaRow, 11].Style.Font.Color.SetColor(Color.White);
                                oWs.Cells[_ultimaRow, 11].Style.Font.Bold = true; //Letra negrita
                                //SALDO COSTO
                                oWs.Cells[_ultimaRow, 13].Value = TotalCostoS.ToString("0.##");
                                oWs.Cells[_ultimaRow, 13].Style.Font.Size = 8; //letra tamaño   
                                oWs.Cells[_ultimaRow, 13].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                                oWs.Cells[_ultimaRow, 13].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                                oWs.Cells[_ultimaRow, 13].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlueViolet);
                                oWs.Cells[_ultimaRow, 13].Style.Font.Color.SetColor(Color.White);
                                oWs.Cells[_ultimaRow, 13].Style.Font.Bold = true; //Letra negrita

                                // INGRESO

                                //TOTAL CANTIDAD
                                oWs.Cells[_ultimaRow, 8].Value = TotalCantidadI;
                                oWs.Cells[_ultimaRow, 8].Style.Font.Size = 8; //letra tamaño   
                                oWs.Cells[_ultimaRow, 8].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                                oWs.Cells[_ultimaRow, 8].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                                oWs.Cells[_ultimaRow, 8].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlueViolet);
                                oWs.Cells[_ultimaRow, 8].Style.Font.Color.SetColor(Color.White);
                                oWs.Cells[_ultimaRow, 8].Style.Font.Bold = true; //Letra negrita
                                //SALDO COSTO
                                oWs.Cells[_ultimaRow, 10].Value = TotalCostoI.ToString("0.##");
                                oWs.Cells[_ultimaRow, 10].Style.Font.Size = 8; //letra tamaño   
                                oWs.Cells[_ultimaRow, 10].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                                oWs.Cells[_ultimaRow, 10].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                                oWs.Cells[_ultimaRow, 10].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlueViolet);
                                oWs.Cells[_ultimaRow, 10].Style.Font.Color.SetColor(Color.White);
                                oWs.Cells[_ultimaRow, 10].Style.Font.Bold = true; //Letra negrita


                                _ultimaRow += 2;
                                TotalCantidadS = 0;
                                TotalCostoS = 0;
                                TotalCantidadI = 0;
                                TotalCostoI = 0;
                            }
                            //DateTime dateAnterior = Convert.ToDateTime(fechaini);


                            DateTime dateAnterior = DateTime.ParseExact(fechaini, "dd/MM/yyyy", null);


                            dateAnterior = dateAnterior.AddDays(-1);
                            string fechaAnterior = dateAnterior.ToString("dd/MM/yyyy");
                            // FECHA
                            //oWs.Cells[4, _ultimaColum].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.IndianRed); // fondo de celda                             
                            oWs.Cells[_ultimaRow, 1].Value = fechaAnterior;
                            oWs.Cells[_ultimaRow, 1].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            oWs.Cells[_ultimaRow, 1].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                            oWs.Cells[_ultimaRow, 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.IndianRed);
                            oWs.Cells[_ultimaRow, 1].Style.Font.Color.SetColor(Color.White);
                            oWs.Cells[_ultimaRow, 1].Style.Font.Bold = true; //Letra negrita
                            //CODIGO_PRO
                            oWs.Cells[_ultimaRow, 7].Value = "Saldo Inicial";
                            oWs.Cells[_ultimaRow, 7].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 7].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            oWs.Cells[_ultimaRow, 7].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                            oWs.Cells[_ultimaRow, 7].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.IndianRed);
                            oWs.Cells[_ultimaRow, 7].Style.Font.Color.SetColor(Color.White);
                            oWs.Cells[_ultimaRow, 7].Style.Font.Bold = true; //Letra negrita

                      
                            //CODIGO PRODUCTO
                            oWs.Cells[_ultimaRow, 1].Value = item.codigo_producto;
                            oWs.Cells[_ultimaRow, 1].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            oWs.Cells[_ultimaRow, 1].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                            oWs.Cells[_ultimaRow, 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.IndianRed);
                            oWs.Cells[_ultimaRow, 1].Style.Font.Color.SetColor(Color.White);
                            oWs.Cells[_ultimaRow, 1].Style.Font.Bold = true; //Letra negrita

                            //NOMBRE PRODUCTO
                            oWs.Cells[_ultimaRow, 2].Value = item.nombre_producto;
                            oWs.Cells[_ultimaRow, 2].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            oWs.Cells[_ultimaRow, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                            oWs.Cells[_ultimaRow, 2].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.IndianRed);
                            oWs.Cells[_ultimaRow, 2].Style.Font.Color.SetColor(Color.White);
                            oWs.Cells[_ultimaRow, 2].Style.Font.Bold = true; //Letra negrita

                            //SALDO INICIAL
                            oWs.Cells[_ultimaRow, 14].Value = item.saldoinicial;
                            oWs.Cells[_ultimaRow, 14].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 14].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            oWs.Cells[_ultimaRow, 14].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                            oWs.Cells[_ultimaRow, 14].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.IndianRed);
                            oWs.Cells[_ultimaRow, 14].Style.Font.Color.SetColor(Color.White);
                            oWs.Cells[_ultimaRow, 14].Style.Font.Bold = true; //Letra negrita

                            
                            TotalSaldoUnit = item.saldoinicial == "0" ? 0 : 1;
                            //SALDO FINAL COSTO UNIT
                            oWs.Cells[_ultimaRow, 15].Value = TotalSaldoUnit;
                            oWs.Cells[_ultimaRow, 15].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 15].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            oWs.Cells[_ultimaRow, 15].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                            oWs.Cells[_ultimaRow, 15].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.IndianRed);
                            oWs.Cells[_ultimaRow, 15].Style.Font.Color.SetColor(Color.White);
                            oWs.Cells[_ultimaRow, 15].Style.Font.Bold = true; //Letra negrita


                            TotalSaldoCosto = (Convert.ToDouble(item.saldoinicial) * TotalSaldoUnit);
                            //SALDO FINAL COSTO TOTAL
                            oWs.Cells[_ultimaRow, 16].Value = TotalSaldoCosto;
                            oWs.Cells[_ultimaRow, 16].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 16].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            oWs.Cells[_ultimaRow, 16].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                            oWs.Cells[_ultimaRow, 16].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.IndianRed);
                            oWs.Cells[_ultimaRow, 16].Style.Font.Color.SetColor(Color.White);
                            oWs.Cells[_ultimaRow, 16].Style.Font.Bold = true; //Letra negrita



                            _ultimaRow++;
                        }
                        if (item.tipo == "S")
                        {
                         

                            // PRECIOS COSTO FIANAL

                            //SALDO FINAL COSTO UNIT

                            oWs.Cells[_ultimaRow, 15].Value = TotalSaldoUnit;
                            oWs.Cells[_ultimaRow, 15].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 15].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;

                            double TotalSaldoCostoFinal = (TotalSaldoUnit * item.saldoinicialAux);
                            oWs.Cells[_ultimaRow, 16].Value = TotalSaldoCostoFinal;
                            oWs.Cells[_ultimaRow, 16].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 16].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            //

                            // SUMA DE CANTIDADES SALIDA
                            double costoTotalAux = item.cantidadAux * TotalSaldoUnit;
                            TotalCantidadS += Convert.ToDouble(item.cantidadAux);
                            // TOTAL COSTO SALIDA
                            TotalCostoS += Convert.ToDecimal(costoTotalAux);
                            
                        }
                        else if(item.tipo == "I"){
                            // SUMA DE CANTIDADES SALIDA
                            TotalCantidadI += Convert.ToDouble(item.cantidadAux);
                            // TOTAL COSTO SALIDA
                            TotalCostoI += Convert.ToDecimal(item.costoTotal);
                            //
                            TotalSaldoUnit = (TotalSaldoCosto + Convert.ToDouble(TotalCostoI)) / TotalCantidadI;

                            // PRECIOS COSTO FIANAL

                            //SALDO FINAL COSTO UNIT

                            oWs.Cells[_ultimaRow, 15].Value = TotalSaldoUnit;
                            oWs.Cells[_ultimaRow, 15].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 15].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;

                            double TotalSaldoCostoFinal = (TotalSaldoUnit * item.saldoinicialAux);
                            oWs.Cells[_ultimaRow, 16].Value = TotalSaldoCostoFinal;
                            oWs.Cells[_ultimaRow, 16].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 16].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;



                        }
                  

                        // FECHA
                        oWs.Cells[_ultimaRow, 3].Value = item.fecha;
                        oWs.Cells[_ultimaRow, 3].Style.Font.Size = 8; //letra tamaño   
                        oWs.Cells[_ultimaRow, 3].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;

                        //CODIGO PRODUCTO

                        oWs.Cells[_ultimaRow, 1].Value = item.codigo_producto;
                        oWs.Cells[_ultimaRow, 1].Style.Font.Size = 8; //letra tamaño   
                        oWs.Cells[_ultimaRow, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;

                        //NOMBRE PRODUCTO

                        /*oWs.Cells[_ultimaRow, 2].Value = item.nombre_producto;
                        oWs.Cells[_ultimaRow, 2].Style.Font.Size = 8; //letra tamaño   
                        //oWs.Cells[_ultimaRow, 3].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                        */
                        // TIPO DE TABLA

                        oWs.Cells[_ultimaRow, 4].Value = item.tipoMov;
                        oWs.Cells[_ultimaRow, 4].Style.Font.Size = 8; //letra tamaño   
                        oWs.Cells[_ultimaRow, 4].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;

                        // SERIE y DOCUMENTO
                        string[] Documento = item.nrodoc.Split('-');
                        string serie, documento;

                        serie = Documento[0];

                        oWs.Cells[_ultimaRow, 5].Value = serie;
                        oWs.Cells[_ultimaRow, 5].Style.Font.Size = 8; //letra tamaño   
                        oWs.Cells[_ultimaRow, 5].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                        
                        documento = Documento.Length == 2 ? Documento[1] : "";
                        oWs.Cells[_ultimaRow, 6].Value = documento;
                        oWs.Cells[_ultimaRow, 6].Style.Font.Size = 8; //letra tamaño   
                        oWs.Cells[_ultimaRow, 6].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;

                        // TIPO DE OPERACIÓN

                        oWs.Cells[_ultimaRow, 7].Value = item.operacion;
                        oWs.Cells[_ultimaRow, 7].Style.Font.Size = 8; //letra tamaño   
                        oWs.Cells[_ultimaRow, 7].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;


                        if (item.tipo == "S")
                        {
                            // SALIDA
                            //CANTIDAD
                            oWs.Cells[_ultimaRow, 11].Value = item.cantidadAux;
                            oWs.Cells[_ultimaRow, 11].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 11].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            // COSTO UNIT
                            oWs.Cells[_ultimaRow, 12].Value = TotalSaldoUnit;
                            oWs.Cells[_ultimaRow, 12].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 12].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            // COSTO TOTAL
                            double costoTotalAux = item.cantidadAux * TotalSaldoUnit;
                            oWs.Cells[_ultimaRow, 13].Value = costoTotalAux;                            
                            oWs.Cells[_ultimaRow, 13].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 13].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                        }
                        else if (item.tipo == "I")
                        {
                            // INGRESO
                            //CANTIDAD
                            oWs.Cells[_ultimaRow, 8].Value = item.cantidadAux;
                            oWs.Cells[_ultimaRow, 8].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 8].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            // COSTO UNIT
                            oWs.Cells[_ultimaRow, 9].Value = item.precio;
                            oWs.Cells[_ultimaRow, 9].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 9].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            // COSTO TOTAL
                            oWs.Cells[_ultimaRow, 10].Value = item.costoTotal;
                            oWs.Cells[_ultimaRow, 10].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 10].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                        }



                        // SALDO FINAL

                        oWs.Cells[_ultimaRow, 14].Value = item.saldoinicialAux;
                        oWs.Cells[_ultimaRow, 14].Style.Font.Size = 8; //letra tamaño   
                        oWs.Cells[_ultimaRow, 14].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                        _ultimaRow++;




                        if (listKardexAlmacen.Count == count)
                        {
                            // TOTAL FINAL
                            // SALIDAAA
                            //TOTAL TEXT
                            oWs.Cells[_ultimaRow, 2].Value = "Total";
                            oWs.Cells[_ultimaRow, 2].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            oWs.Cells[_ultimaRow, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                            oWs.Cells[_ultimaRow, 2].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlueViolet);
                            oWs.Cells[_ultimaRow, 2].Style.Font.Color.SetColor(Color.White);
                            oWs.Cells[_ultimaRow, 2].Style.Font.Bold = true; //Letra negrita


                            //TOTAL CANTIDAD
                            oWs.Cells[_ultimaRow, 11].Value = TotalCantidadS;
                            oWs.Cells[_ultimaRow, 11].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 11].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            oWs.Cells[_ultimaRow, 11].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                            oWs.Cells[_ultimaRow, 11].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlueViolet);
                            oWs.Cells[_ultimaRow, 11].Style.Font.Color.SetColor(Color.White);
                            oWs.Cells[_ultimaRow, 11].Style.Font.Bold = true; //Letra negrita
                            //SALDO COSTO
                            oWs.Cells[_ultimaRow, 13].Value = TotalCostoS.ToString("0.##");
                            oWs.Cells[_ultimaRow, 13].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 13].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            oWs.Cells[_ultimaRow, 13].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                            oWs.Cells[_ultimaRow, 13].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlueViolet);
                            oWs.Cells[_ultimaRow, 13].Style.Font.Color.SetColor(Color.White);
                            oWs.Cells[_ultimaRow, 13].Style.Font.Bold = true; //Letra negrita

                            // INGRESO

                            //TOTAL CANTIDAD
                            oWs.Cells[_ultimaRow, 8].Value = TotalCantidadI;
                            oWs.Cells[_ultimaRow, 8].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 8].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            oWs.Cells[_ultimaRow, 8].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                            oWs.Cells[_ultimaRow, 8].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlueViolet);
                            oWs.Cells[_ultimaRow, 8].Style.Font.Color.SetColor(Color.White);
                            oWs.Cells[_ultimaRow, 8].Style.Font.Bold = true; //Letra negrita
                            //SALDO COSTO
                            oWs.Cells[_ultimaRow, 10].Value = TotalCostoI.ToString("0.##");
                            oWs.Cells[_ultimaRow, 10].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, 10].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                            oWs.Cells[_ultimaRow, 10].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;   // fondo de celda
                            oWs.Cells[_ultimaRow, 10].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.BlueViolet);
                            oWs.Cells[_ultimaRow, 10].Style.Font.Color.SetColor(Color.White);
                            oWs.Cells[_ultimaRow, 10].Style.Font.Bold = true; //Letra negrita


                        }
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


        public DataTable getSaldoInicial(string fechaini, int idPro, int local, int almacen)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    string query = "SELECT DBO.GET_SALDO_INICIAL('" + fechaini + "'," + idPro + "," + local + ", " + almacen + ")";
                    using (SqlCommand cmd = new SqlCommand(query, cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.Text;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                throw;
            }
            return dt_detalle;
        }

                //cantidad: "4"
                //descripcion: "ACEITE DE SOYA BELINI X 200 ML X 24 UND                                         "
                //matricula: "01050001"
                //nroLote: ""
                //tipo: "trans"
                //usuario: 1

        public object PostSaveMaterialRecepcion(string matricula, string descripcion, decimal cantidad, int usuario, string tipo, string nroLote, int idAlmacen, int idUnidadMedida, string fechaProduccion, string fechaVencimiento)
        {
            using (SqlConnection cnDB = new SqlConnection(bdConexion.cadenaBDcx()))
            {
                cnDB.Open();
                SqlCommand cmd = new SqlCommand("SP_GUARDAR_PRODUCTOS_RECEPCION_II", cnDB);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@MATRICULA", SqlDbType.VarChar, 100).Value = matricula;
                cmd.Parameters.Add("@DESCRIPCION", SqlDbType.VarChar, 250).Value = descripcion;
                cmd.Parameters.Add("@CANTIDAD", SqlDbType.Decimal).Value = cantidad;
                cmd.Parameters.Add("@USUARIO", SqlDbType.Int).Value = usuario;
                cmd.Parameters.Add("@TIPO", SqlDbType.VarChar, 20).Value = tipo;
                cmd.Parameters.Add("@NRO_LOTE", SqlDbType.VarChar, 50).Value = (nroLote == "xxx")? "" : nroLote;
                cmd.Parameters.Add("@ID_ALMACEN", SqlDbType.Int).Value = idAlmacen;
                cmd.Parameters.Add("@ID_UNIDAD_MEDIDA", SqlDbType.Int).Value = idUnidadMedida;
                cmd.Parameters.Add("@FECHA_PRODUCCION", SqlDbType.VarChar, 10).Value = (fechaProduccion == "xxx") ? "" : fechaProduccion;
                cmd.Parameters.Add("@FECHA_VENCIMIENTO", SqlDbType.VarChar, 10).Value = (fechaVencimiento == "xxx") ? "" : fechaVencimiento;

                try
                {
                    var result = cmd.ExecuteNonQuery();
                    return result;
                }
                catch (Exception ex)
                {

                    return ex.Message;
                }

            }
        }

        public object PostSaveTransferencia(tbl_Alm_Transferencia_Cab objtbl_Alm_Transferencia_Cab)
        {

            using (SqlConnection cnDB = new SqlConnection(bdConexion.cadenaBDcx()))
            {
                cnDB.Open();
                string result = "";
                SqlCommand cmd = new SqlCommand("SP_GUARDAR_TRANSFERENCIA_II", cnDB);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@ID_ALMTRANCAB", SqlDbType.Int).Value = objtbl_Alm_Transferencia_Cab.Id_AlmTranCab;
                cmd.Parameters.Add("@FECHAEMISION_TRANFERENCIACAB", SqlDbType.DateTime).Value = objtbl_Alm_Transferencia_Cab.fechaEmision_TranferenciaCab;
                cmd.Parameters.Add("@ORIGEN_ID_LOCAL", SqlDbType.Int).Value = objtbl_Alm_Transferencia_Cab.origen_id_Local;
                cmd.Parameters.Add("@ORIGEN_ID_ALMACEN", SqlDbType.Int).Value = objtbl_Alm_Transferencia_Cab.origen_id_Almacen;
                cmd.Parameters.Add("@DESTINO_ID_LOCAL", SqlDbType.Int, 20).Value = objtbl_Alm_Transferencia_Cab.destino_id_Local;
                cmd.Parameters.Add("@DESTINO_ID_ALMACEN", SqlDbType.Int, 20).Value = objtbl_Alm_Transferencia_Cab.destino_id_Almacen;
                cmd.Parameters.Add("@OBS_TRANFERENCIACAB", SqlDbType.VarChar, 200).Value = objtbl_Alm_Transferencia_Cab.obs_TranferenciaCab;
                cmd.Parameters.Add("@USUARIO_CREACION", SqlDbType.Int).Value = objtbl_Alm_Transferencia_Cab.usuario_creacion;

                cmd.Parameters.Add("@NRO_TRANSFERENCIA", SqlDbType.VarChar).Value = objtbl_Alm_Transferencia_Cab.nro_Transferencia;
                try
                {
                    dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {
                        result = dr["LASTID"].ToString();
                    }

                    return result;
                }
                catch (Exception ex)
                {
                    throw;
                }

            }
        }

    }
}
