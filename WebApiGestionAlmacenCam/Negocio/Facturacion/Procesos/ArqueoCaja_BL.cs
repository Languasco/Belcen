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
 
namespace Negocio.Facturacion.Procesos
{
    public class ArqueoCaja_BL
    {
        public object get_zonaVentaArqueo(int idAnexo, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COMBO_ZONA", cn))
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

        public object get_centroCostoArqueo(int idAnexos, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COMBO_CENTRO_COSTO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idAnexos", SqlDbType.Int).Value = idAnexos;
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

        public object get_personalesArqueo(int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COMBO_PERSONALES", cn))
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

        public object get_billetesMonedasArqueo(int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_LISTA_MONEDAS_BILLETES", cn))
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

        public object set_guardar_billetesMonedasArqueo(int id_ArqueoCaja, int id_Tipo, int id_BilleteMoneda, string cantidad_Billete, string valor_Billete, string total_Billete, int idUsuario, int idZona )
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_GUARDAR_BILLETE_MONEDA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_ArqueoCaja", SqlDbType.Int).Value = id_ArqueoCaja;
                        cmd.Parameters.Add("@id_Tipo", SqlDbType.Int).Value = id_Tipo;
                        cmd.Parameters.Add("@id_BilleteMoneda", SqlDbType.Int).Value = id_BilleteMoneda;

                        cmd.Parameters.Add("@cantidad_Billete", SqlDbType.VarChar).Value = cantidad_Billete;
                        cmd.Parameters.Add("@valor_Billete", SqlDbType.VarChar).Value = valor_Billete;
                        cmd.Parameters.Add("@total_Billete", SqlDbType.VarChar).Value = total_Billete;

                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idZona", SqlDbType.Int).Value = idZona;

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

        public object get_informacionVentas_boletasFacturas(int id_Anexo, int id_ZonaVta, int id_CC, string fechaArqueoCaja, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();

            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_VENTAS_LISTADO_BOLETAS_FACTURAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Anexo", SqlDbType.Int).Value = id_Anexo;
                        cmd.Parameters.Add("@id_ZonaVta", SqlDbType.Int).Value = id_ZonaVta;
                        cmd.Parameters.Add("@id_CC", SqlDbType.Int).Value = id_CC;
                        cmd.Parameters.Add("@fechaArqueoCaja", SqlDbType.VarChar).Value = fechaArqueoCaja;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    res.ok = true;
                    res.data = dt_detalle;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object set_guardar_informacionVentas_boletasFacturas(int id_Anexo, int id_ZonaVta, int id_CC, string fechaArqueoCaja, int id_ArqueoCaja, int idUsuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_VENTAS_GUARDAR_BOLETAS_FACTURAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Anexo", SqlDbType.Int).Value = id_Anexo;
                        cmd.Parameters.Add("@id_ZonaVta", SqlDbType.Int).Value = id_ZonaVta;
                        cmd.Parameters.Add("@id_CC", SqlDbType.Int).Value = id_CC;
                        cmd.Parameters.Add("@fechaArqueoCaja", SqlDbType.VarChar).Value = fechaArqueoCaja;
                        cmd.Parameters.Add("@id_ArqueoCaja", SqlDbType.Int).Value = id_ArqueoCaja;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
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

        public object get_informacionDepositos(int idArqueoCaja, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_VENTAS_LISTADO_DEPOSITOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idArqueoCaja", SqlDbType.Int).Value = idArqueoCaja;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    res.ok = true;
                    res.data = dt_detalle;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }
        public object get_verificarNroOperacion(int id_banco, string nroOperacion, string fechaOperacion)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_DEPOSITOS_VALIDAR_NRO_OPERACION", cn))
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


        public string Set_Actualizar_imagenComprobanteDeposito(int idArqueoCaja_Deposito, string nombreFile, string nombreFileServer)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_GRABAR_IMAGEN_DEPOSITOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idArqueoCaja_Deposito", SqlDbType.Int).Value = idArqueoCaja_Deposito;
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

        public object get_proveedorArqueo(int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COMBO_PROVEEDOR", cn))
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

        public object get_verificarNroOperacionPagos(int id_banco, string nroOperacion, string fechaOperacion)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_PAGOS_VALIDAR_NRO_OPERACION", cn))
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

        public object get_informacionPagos(int idArqueoCaja, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_PAGOS_LISTADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idArqueoCaja", SqlDbType.Int).Value = idArqueoCaja;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    res.ok = true;
                    res.data = dt_detalle;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public string Set_Actualizar_imagenComprobantePago(int id_ArqueoCajaEgresos, string nombreFile, string nombreFileServer)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_GRABAR_IMAGEN_PAGOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_ArqueoCajaEgresos", SqlDbType.Int).Value = id_ArqueoCajaEgresos;
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

        public string Set_Actualizar_imagenComprobanteEgreso(int id_ArqueoCajaEgresos, string nombreFile, string nombreFileServer)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_GRABAR_IMAGEN_EGRESOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_ArqueoCajaEgresos", SqlDbType.Int).Value = id_ArqueoCajaEgresos;
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

        public object get_tiposEgresos()
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COMBO_TIPO_EGRESO", cn))
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

        public object get_tiposDocumentos()
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COMBO_TIPO_DOCUMENTO", cn))
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

        public object get_consultaRuc(string nroRuc, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_EGRESOS_CONSULTA_RUC", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@nroRuc", SqlDbType.VarChar).Value = nroRuc;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    res.ok = true;
                    res.data = dt_detalle;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object get_informacionEgresos(int idArqueoCaja, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_EGRESOS_LISTADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idArqueoCaja", SqlDbType.Int).Value = idArqueoCaja;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    res.ok = true;
                    res.data = dt_detalle;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object get_informacionVentas_cobranzas(int id_Anexo, int id_ZonaVta, int id_CC, string fechaArqueoCaja, int idUsuario)
        {
            DataTable dt_detalleCobranzas = new DataTable();
            DataTable dt_detalleCobranzasII = new DataTable();
            DataTable dt_resumenCobranzas = new DataTable();

            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COBRANZAS_LISTADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Anexo", SqlDbType.Int).Value = id_Anexo;
                        cmd.Parameters.Add("@id_ZonaVta", SqlDbType.Int).Value = id_ZonaVta;
                        cmd.Parameters.Add("@id_CC", SqlDbType.Int).Value = id_CC;
                        cmd.Parameters.Add("@fechaArqueoCaja", SqlDbType.VarChar).Value = fechaArqueoCaja;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalleCobranzas);
                        }
                    }
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COBRANZAS_NRO_2_LISTADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Anexo", SqlDbType.Int).Value = id_Anexo;
                        cmd.Parameters.Add("@id_ZonaVta", SqlDbType.Int).Value = id_ZonaVta;
                        cmd.Parameters.Add("@id_CC", SqlDbType.Int).Value = id_CC;
                        cmd.Parameters.Add("@fechaArqueoCaja", SqlDbType.VarChar).Value = fechaArqueoCaja;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalleCobranzasII);
                        }
                    }

                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COBRANZAS_RESUMEN", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Anexo", SqlDbType.Int).Value = id_Anexo;
                        cmd.Parameters.Add("@id_ZonaVta", SqlDbType.Int).Value = id_ZonaVta;
                        cmd.Parameters.Add("@id_CC", SqlDbType.Int).Value = id_CC;
                        cmd.Parameters.Add("@fechaArqueoCaja", SqlDbType.VarChar).Value = fechaArqueoCaja;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_resumenCobranzas);
                        }
                    }


                    var listadosCab = new
                    {
                        cobranzas = dt_detalleCobranzas,
                        cobranzas_II = dt_detalleCobranzasII,
                        cobranzas_resumen = dt_resumenCobranzas
                    };

                    res.ok = true;
                    res.data = listadosCab;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object set_guardar_informacionVentas_cobranzasDevoluciones(int id_Anexo, int id_ZonaVta, int id_CC, string fechaArqueoCaja, int id_ArqueoCaja, int idUsuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_I_ARQUEO_CAJA_VENTAS_GUARDAR_COBRANZAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Anexo", SqlDbType.Int).Value = id_Anexo;
                        cmd.Parameters.Add("@id_ZonaVta", SqlDbType.Int).Value = id_ZonaVta;
                        cmd.Parameters.Add("@id_CC", SqlDbType.Int).Value = id_CC;
                        cmd.Parameters.Add("@fechaArqueoCaja", SqlDbType.VarChar).Value = fechaArqueoCaja;
                        cmd.Parameters.Add("@id_ArqueoCaja", SqlDbType.Int).Value = id_ArqueoCaja;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
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

        public object set_cerrar_arqueoCaja(int id_Anexo, int id_ZonaVta, int id_CC, string fechaArqueoCaja, int id_ArqueoCaja, int idUsuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_U_ARQUEO_CAJA_CERRAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Anexo", SqlDbType.Int).Value = id_Anexo;
                        cmd.Parameters.Add("@id_ZonaVta", SqlDbType.Int).Value = id_ZonaVta;
                        cmd.Parameters.Add("@id_CC", SqlDbType.Int).Value = id_CC;
                        cmd.Parameters.Add("@fechaArqueoCaja", SqlDbType.VarChar).Value = fechaArqueoCaja;
                        cmd.Parameters.Add("@id_ArqueoCaja", SqlDbType.Int).Value = id_ArqueoCaja;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
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


        public object ExportarExcel_arqueoCaja(int id_ArqueoCaja, int id_usuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_GENERAR_EXCEL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_ArqueoCaja", SqlDbType.Int).Value = id_ArqueoCaja;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

                        DataTable dt_cabecera = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_cabecera);
                            if (dt_cabecera.Rows.Count <= 0)
                            {
                                res.ok = false;
                                res.data = "0|No hay informacion disponible";
                            }
                            else
                            {
                                using (SqlCommand cmd2 = new SqlCommand("PROC_S_ARQUEO_CAJA_GENERAR_EXCEL_DETALLE", cn))
                                {
                                    cmd2.CommandTimeout = 0;
                                    cmd2.CommandType = CommandType.StoredProcedure;
                                    cmd2.Parameters.Add("@id_ArqueoCaja", SqlDbType.Int).Value = id_ArqueoCaja;
                                    cmd2.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

                                    DataTable dt_detalle = new DataTable();
                                    using (SqlDataAdapter da2 = new SqlDataAdapter(cmd2))
                                    {
                                        da2.Fill(dt_detalle);
                                        if (dt_detalle.Rows.Count <= 0)
                                        {
                                            res.ok = false;
                                            res.data = "0|No hay informacion en el Detalle";
                                        }
                                        else
                                        {
                                            res.ok = true;
                                            res.data = GenerarArchivoExcel_arqueoCaja(dt_cabecera, dt_detalle);
                                        }
                                    }
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

        public string GenerarArchivoExcel_arqueoCaja(DataTable dt_Cabecera, DataTable dt_detalle)
        {
            string Res = "";
            string _servidor;

            int _fila = 7;
            string FileRuta = "";
            string FileExcel = "";
            int ladoA = 0;
            int ladoB = 0;
            int _filaGuia = 7;

            double totalladoA = 0;
            double totalladoB = 0;

            try
            {
                _servidor = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/arqueoCaja" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];


                FileExcel = rutaServer + "arqueoCaja" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("controlCaja");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));
                    oWs.View.ShowGridLines = false;

                    oWs.Cells[1, 1, 1, 6].Merge = true;  // combinar celdaS dt
                    oWs.Cells[1, 1].Value = dt_Cabecera.Rows[0]["tituloReporte"].ToString();
                    oWs.Cells[1, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[1, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[1, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[1, 1].Style.Font.Bold = true; //Letra negrita


                    oWs.Cells[3, 1].Value = dt_Cabecera.Rows[0]["nombreEmpresa"].ToString();
                    oWs.Cells[4, 1].Value = dt_Cabecera.Rows[0]["rucEmpresa"].ToString();
                    oWs.Cells[5, 1].Value = dt_Cabecera.Rows[0]["establecimientoEmpresa"].ToString();

                    oWs.Cells[7, 1].Value = dt_Cabecera.Rows[0]["rinde"].ToString();
                    oWs.Cells[8, 1].Value = dt_Cabecera.Rows[0]["responsable"].ToString();
                    oWs.Cells[9, 1].Value = dt_Cabecera.Rows[0]["supervisor"].ToString();

                    oWs.Cells[10, 5].Value = "FECHA ARQUEO CAJA:";
                    oWs.Cells[10, 6].Value = dt_Cabecera.Rows[0]["fechaArqueo"].ToString();

                    oWs.Cells[12, 1].Value = "1. SALDO INICIAL :";
                    oWs.Cells[12, 1].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[12, 1].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[12, 6].Value = Convert.ToDouble(dt_Cabecera.Rows[0]["saldoInicial"].ToString());
                    oWs.Cells[12, 6].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[12, 6].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[12, 6].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[12, 6].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[12, 6].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                    oWs.Cells[12, 6].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[12, 6].Style.Fill.BackgroundColor.SetColor(Color.GreenYellow);// color fondo


                    oWs.Cells[13, 1].Value = dt_Cabecera.Rows[0]["descripcionSaldoInicial"].ToString();
                    oWs.Cells[13, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[13, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Cells[13, 5].Value = Convert.ToDouble(dt_Cabecera.Rows[0]["saldoInicial"].ToString());
                    oWs.Cells[13, 5].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    oWs.Cells[13, 5].Style.Fill.BackgroundColor.SetColor(Color.Yellow);
                    oWs.Cells[13, 5].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[13, 5].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[13, 5].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[13, 5].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[13, 5].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Dotted);


                    //AGRUPANDO LA INFORMACION DE UN DATATABLE
                    //DataTable dtLocal = dt_Cabecera.DefaultView.ToTable(true, "id_Local");
                    /// FIN DE AGRUPANDO
                    ///                 
                    totalladoA = 0;
                    totalladoB = 0;

                    totalladoA = Convert.ToDouble(dt_detalle.Compute("sum(importe)", "tabla ='1'"));
                    totalladoB = Convert.ToDouble(dt_detalle.Compute("sum(importe)", "tabla ='2'"));

                    oWs.Cells[14, 1].Value = "2. DOCUMENTOS :";
                    oWs.Cells[14, 1].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[14, 1].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[14, 6].Value = Convert.ToDouble(totalladoA - totalladoB);
                    oWs.Cells[14, 6].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[14, 6].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[14, 6].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[14, 6].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                    oWs.Cells[14, 6].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[14, 6].Style.Fill.BackgroundColor.SetColor(Color.GreenYellow);// color fondo


                    oWs.Cells[16, 1, 16, 2].Merge = true;  // combinar celdaS dt
                    oWs.Cells[16, 1].Value = "VENTAS - INGRESOS";
                    oWs.Cells[16, 1].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[16, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[16, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[16, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[16, 1, 16, 2].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                    oWs.Cells[16, 1, 16, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[16, 1, 16, 2].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo


                    //------ LADO A  -----------------
                    //--------------------------------
                    _fila = 17;
                    ladoA = 0;

                    foreach (DataRow obj in dt_detalle.Rows)
                    {
                        if (obj["tabla"].ToString() == "1")
                        {
                            oWs.Cells[_fila, 1].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, 1].Value = obj["concepto"].ToString();

                            oWs.Cells[_fila, 2].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, 2].Value = Convert.ToDouble(obj["importe"].ToString());
                            oWs.Cells[_fila, 2].Style.Numberformat.Format = "#,##0";
                            oWs.Cells[_fila, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                            _fila++;
                        }
                    }

                    oWs.Cells[_fila, 1].Value = "Total Ventas";
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Cells[_fila, 1, _fila, 2].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila, 2].Value = totalladoA;
                    oWs.Cells[_fila, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 2].Style.Font.Bold = true; //Letra negrita 

                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.BackgroundColor.SetColor(Color.LightGray);


                    ladoA = _fila;


                    //------ LADO B -----------------
                    //--------------------------------

                    oWs.Cells[16, 4, 16, 5].Merge = true;  // combinar celdaS dt
                    oWs.Cells[16, 4].Value = "PAGO PROV";
                    oWs.Cells[16, 4].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[16, 4].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[16, 4].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[16, 4].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[16, 4, 16, 5].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[16, 4, 16, 5].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[16, 4, 16, 5].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo


                    _fila = 17;
                    ladoB = 0;


                    foreach (DataRow obj in dt_detalle.Rows)
                    {
                        if (obj["tabla"].ToString() == "2")
                        {
                            oWs.Cells[_fila, 4].Value = obj["concepto"].ToString();
                            oWs.Cells[_fila, 4].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                            oWs.Cells[_fila, 5].Value = Convert.ToDouble(obj["importe"].ToString());
                            oWs.Cells[_fila, 5].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, 5].Style.Numberformat.Format = "#,##0";
                            oWs.Cells[_fila, 5].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                            _fila++;
                        }
                    }
                    oWs.Cells[_fila, 4].Value = "Total Ventas";
                    oWs.Cells[_fila, 4].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 4].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 4].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Cells[_fila, 4, _fila, 5].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila, 5].Value = totalladoB;
                    oWs.Cells[_fila, 5].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 5].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila, 4, _fila, 5].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila, 4, _fila, 5].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo


                    ladoB = _fila;

                    if (ladoA > ladoB)
                    {
                        _fila = ladoA + 2;
                    }
                    else {
                        _fila = ladoB + 2;
                    }

                    //-------- nueva seccion ----------------

                    totalladoA = 0;
                    totalladoB = 0;

                    totalladoA = Convert.ToDouble(dt_detalle.Compute("sum(importe)", "tabla ='3'"));
                    totalladoB = Convert.ToDouble(dt_detalle.Compute("sum(importe)", "tabla ='4'"));

                    oWs.Cells[_fila, 1].Value = "3. EFECTIVO :";
                    oWs.Cells[_fila, 1].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila, 6].Value = Convert.ToDouble(totalladoA + totalladoB);
                    oWs.Cells[_fila, 6].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 6].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 6].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 6].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                    oWs.Cells[_fila, 6].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    oWs.Cells[_fila, 6].Style.Fill.BackgroundColor.SetColor(Color.GreenYellow);// color fondo

                    _fila += 2;

                    oWs.Cells[_fila, 1, _fila, 2].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 1].Value = "GASTOS";
                    oWs.Cells[_fila, 1].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 1, _fila, 2].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo

                    _fila += 1;
                    _filaGuia = _fila;

                    //------ LADO A  -----------------
                    //--------------------------------
                    _fila = _filaGuia; ///---- inicializando --
                    ladoA = 0;

                    foreach (DataRow obj in dt_detalle.Rows)
                    {
                        if (obj["tabla"].ToString() == "3")
                        {
                            oWs.Cells[_fila, 1].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, 1].Value = obj["concepto"].ToString();

                            oWs.Cells[_fila, 2].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, 2].Value = Convert.ToDouble(obj["importe"].ToString());
                            oWs.Cells[_fila, 2].Style.Numberformat.Format = "#,##0";
                            oWs.Cells[_fila, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                            _fila++;
                        }
                    }

                    oWs.Cells[_fila, 1].Value = "Total Monedas";
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Cells[_fila, 1, _fila, 2].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila, 2].Value = totalladoA;
                    oWs.Cells[_fila, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 2].Style.Font.Bold = true; //Letra negrita 

                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo

                    ladoA = _fila;

                    //------ LADO B -----------------
                    //--------------------------------

                    _fila = _filaGuia; ///---- inicializando --

                    oWs.Cells[_fila - 1, 4, _fila - 1, 5].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila - 1, 4].Value = "VENTA CRÉDITO";
                    oWs.Cells[_fila - 1, 4].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[_fila - 1, 4].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila - 1, 4].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila - 1, 4].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila - 1, 4, _fila - 1, 5].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila - 1, 4, _fila - 1, 5].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila - 1, 4, _fila - 1, 5].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo

                    ladoB = 0;

                    foreach (DataRow obj in dt_detalle.Rows)
                    {
                        if (obj["tabla"].ToString() == "4")
                        {
                            oWs.Cells[_fila, 4].Value = obj["concepto"].ToString();
                            oWs.Cells[_fila, 4].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                            oWs.Cells[_fila, 5].Value = Convert.ToDouble(obj["importe"].ToString());
                            oWs.Cells[_fila, 5].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, 5].Style.Numberformat.Format = "#,##0";
                            oWs.Cells[_fila, 5].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                            _fila++;
                        }
                    }
                    oWs.Cells[_fila, 4].Value = "Total CREDITO";
                    oWs.Cells[_fila, 4].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 4].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 4].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Cells[_fila, 4, _fila, 5].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila, 5].Value = totalladoB;
                    oWs.Cells[_fila, 5].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 5].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila, 4, _fila, 5].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila, 4, _fila, 5].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo


                    ladoB = _fila;

                    if (ladoA > ladoB)
                    {
                        _fila = ladoA + 2;
                    }
                    else
                    {
                        _fila = ladoB + 2;
                    }


                    //-------- nueva seccion  3 ----------------

                    totalladoA = 0;
                    totalladoB = 0;
                    _filaGuia = 0;

                    totalladoA = Convert.ToDouble(dt_detalle.Compute("sum(importe)", "tabla ='5'"));
                    totalladoB = Convert.ToDouble(dt_detalle.Compute("sum(importe)", "tabla ='6'"));

                    oWs.Cells[_fila, 1].Value = "4. EQUIVALENTE DE EFECTIVO :";
                    oWs.Cells[_fila, 1].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila, 6].Value = Convert.ToDouble(totalladoA + totalladoB);
                    oWs.Cells[_fila, 6].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 6].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 6].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 6].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila, 6].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila, 6].Style.Fill.BackgroundColor.SetColor(Color.GreenYellow);// color fondo


                    _fila += 2;

                    oWs.Cells[_fila, 1, _fila, 2].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 1].Value = "TRANSFERENCIA";
                    oWs.Cells[_fila, 1].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 1, _fila, 2].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo

                    _fila += 1;
                    _filaGuia = _fila;

                    //------ LADO A  -----------------
                    //--------------------------------
                    _fila = _filaGuia; ///---- inicializando --

                    oWs.Cells[_fila, 1].Value = "BANCO";
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 1].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                    oWs.Cells[_fila, 2].Value = "TOTAL";
                    oWs.Cells[_fila, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 2].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 2].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 2].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo

                    _fila += 1;

                    ladoA = 0;

                    foreach (DataRow obj in dt_detalle.Rows)
                    {
                        if (obj["tabla"].ToString() == "5")
                        {
                            oWs.Cells[_fila, 1].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, 1].Value = obj["concepto"].ToString();

                            oWs.Cells[_fila, 2].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, 2].Value = Convert.ToDouble(obj["importe"].ToString());
                            oWs.Cells[_fila, 2].Style.Numberformat.Format = "#,##0";
                            oWs.Cells[_fila, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                            _fila++;
                        }
                    }

                    oWs.Cells[_fila, 1].Value = "Total Cheques";
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Cells[_fila, 1, _fila, 2].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila, 2].Value = totalladoA;
                    oWs.Cells[_fila, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 2].Style.Font.Bold = true; //Letra negrita 
                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo


                    ladoA = _fila;

                    //------ LADO B -----------------
                    //--------------------------------

                    _fila = _filaGuia; ///---- inicializando --

                    oWs.Cells[_fila - 1, 4, _fila - 1, 5].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila - 1, 4].Value = "DEPOSITOS BANCO ";
                    oWs.Cells[_fila - 1, 4].Style.Font.Size = 10; //letra tamaño  
                    oWs.Cells[_fila - 1, 4].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila - 1, 4].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila - 1, 4].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila - 1, 4, _fila - 1, 5].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                    oWs.Cells[_fila - 1, 4, _fila - 1, 5].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila - 1, 4, _fila - 1, 5].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo

                    oWs.Cells[_fila, 4].Value = "BANCO";
                    oWs.Cells[_fila, 4].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 4].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 4].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila, 5].Value = "TOTAL";
                    oWs.Cells[_fila, 5].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 5].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 5].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 5].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                    oWs.Cells[_fila, 4, _fila, 5].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila, 4, _fila, 5].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo

                    _fila += 1;

                    ladoB = 0;

                    foreach (DataRow obj in dt_detalle.Rows)
                    {
                        if (obj["tabla"].ToString() == "6")
                        {
                            oWs.Cells[_fila, 4].Value = obj["concepto"].ToString();
                            oWs.Cells[_fila, 4].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                            oWs.Cells[_fila, 5].Value = Convert.ToDouble(obj["importe"].ToString());
                            oWs.Cells[_fila, 5].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, 5].Style.Numberformat.Format = "#,##0";
                            oWs.Cells[_fila, 5].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                            _fila++;
                        }
                    }
                    oWs.Cells[_fila, 4].Value = "Total Otros";
                    oWs.Cells[_fila, 4].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 4].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 4].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Cells[_fila, 4, _fila, 5].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila, 5].Value = totalladoB;
                    oWs.Cells[_fila, 5].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 5].Style.Font.Bold = true; //Letra negrita

                    oWs.Cells[_fila, 4, _fila, 5].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila, 4, _fila, 5].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo


                    ladoB = _fila;

                    if (ladoA > ladoB)
                    {
                        _fila = ladoA + 2;
                    }
                    else
                    {
                        _fila = ladoB + 2;
                    }

                    //-------- nueva seccion  4 ----------------

                    totalladoA = 0;
                    totalladoB = 0;
                    _filaGuia = 0;

                    totalladoA = Convert.ToDouble(dt_detalle.Compute("sum(importe)", "tabla ='7'"));

                    _filaGuia = _fila;

                    oWs.Cells[_fila, 1, _fila, 2].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 1].Value = "RESUMEN";
                    oWs.Cells[_fila, 1].Style.Font.Size = 15; //letra tamaño  
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 1, _fila, 2].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);

                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo

                    _fila += 1;

                    //------ LADO A  -----------------
                    //--------------------------------

                    ladoA = 0;

                    foreach (DataRow obj in dt_detalle.Rows)
                    {
                        if (obj["tabla"].ToString() == "7")
                        {
                            oWs.Cells[_fila, 1].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, 1].Value = obj["concepto"].ToString();

                            oWs.Cells[_fila, 2].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                            oWs.Cells[_fila, 2].Value = Convert.ToDouble(obj["importe"].ToString());
                            oWs.Cells[_fila, 2].Style.Numberformat.Format = "#,##0";
                            oWs.Cells[_fila, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                            _fila++;
                        }
                    }

                    oWs.Cells[_fila, 1].Value = "RESULTADO ESPERADO";
                    oWs.Cells[_fila, 1].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 1].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Cells[_fila, 1, _fila, 2].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila, 2].Value = totalladoA;
                    oWs.Cells[_fila, 2].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;
                    oWs.Cells[_fila, 2].Style.Font.Bold = true; //Letra negrita 
                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila, 1, _fila, 2].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo


                    ladoA = _fila;

                    //------ LADO B -----------------
                    //--------------------------------

                    _fila = _filaGuia; ///---- inicializando --

                    oWs.Cells[_fila, 4, _fila, 5].Merge = true;  // combinar celdaS dt
                    oWs.Cells[_fila, 4].Value = "OBSERVACIONES: ";
                    oWs.Cells[_fila, 4].Style.Font.Size = 13; //letra tamaño  
                    oWs.Cells[_fila, 4].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Cells[_fila, 4].Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;
                    oWs.Cells[_fila, 4].Style.Font.Bold = true; //Letra negrita
                    oWs.Cells[_fila, 4, _fila, 5].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);
                    oWs.Cells[_fila, 4, _fila, 5].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid; // color fondo
                    oWs.Cells[_fila, 4, _fila, 5].Style.Fill.BackgroundColor.SetColor(Color.LightGray);// color fondo

                    _fila += 1;

                    ladoB = 0;

                    oWs.Cells[_fila, 4].Value = dt_Cabecera.Rows[0]["observaciones"].ToString(); ;
                    oWs.Cells[_fila, 4].Style.Font.Bold = true; //Letra negrita



                    //oWs.Row(6).Style.Font.Bold = true;
                    //oWs.Row(6).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    //oWs.Row(6).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

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


        public object get_informacionVentas_Devoluciones(int id_Anexo, int id_ZonaVta, int id_CC, string fechaArqueoCaja, int idUsuario)
        {
            DataTable dt_detalleDevoluciones = new DataTable(); 

            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_DEVOLUCIONES_LISTADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Anexo", SqlDbType.Int).Value = id_Anexo;
                        cmd.Parameters.Add("@id_ZonaVta", SqlDbType.Int).Value = id_ZonaVta;
                        cmd.Parameters.Add("@id_CC", SqlDbType.Int).Value = id_CC;
                        cmd.Parameters.Add("@fechaArqueoCaja", SqlDbType.VarChar).Value = fechaArqueoCaja;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalleDevoluciones);
                        }
                    }
      
                    var listadosCab = new
                    {
                        Devoluciones = dt_detalleDevoluciones
                    };

                    res.ok = true;
                    res.data = listadosCab;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object set_guardar_informacionVentas_Devoluciones(int id_Anexo, int id_ZonaVta, int id_CC, string fechaArqueoCaja, int id_ArqueoCaja, int idUsuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_I_ARQUEO_CAJA_VENTAS_GUARDAR_DEVOLUCIONES", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Anexo", SqlDbType.Int).Value = id_Anexo;
                        cmd.Parameters.Add("@id_ZonaVta", SqlDbType.Int).Value = id_ZonaVta;
                        cmd.Parameters.Add("@id_CC", SqlDbType.Int).Value = id_CC;
                        cmd.Parameters.Add("@fechaArqueoCaja", SqlDbType.VarChar).Value = fechaArqueoCaja;
                        cmd.Parameters.Add("@id_ArqueoCaja", SqlDbType.Int).Value = id_ArqueoCaja;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
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

        public object get_estados (int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_LISTADO_ARQUEOCAJA_COMBO_ESTADOS", cn))
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

        public object get_informacion_arqueoCajaCab(int id_Anexo, int id_ZonaVta, int id_CC, string fechaini,string fechafin, int idEstado, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();

            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_LISTADO_ARQUEOCAJA_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Anexo", SqlDbType.Int).Value = id_Anexo;
                        cmd.Parameters.Add("@id_ZonaVta", SqlDbType.Int).Value = id_ZonaVta;
                        cmd.Parameters.Add("@id_CC", SqlDbType.Int).Value = id_CC;
                        cmd.Parameters.Add("@fechaini", SqlDbType.VarChar).Value = fechaini;
                        cmd.Parameters.Add("@fechafin", SqlDbType.VarChar).Value = fechafin;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    res.ok = true;
                    res.data = dt_detalle;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object get_arqueoCajaCab_edicion(int id_ArqueoCaja , int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_LISTADO_ARQUEOCAJA_CAB_EDICION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_ArqueoCaja", SqlDbType.Int).Value = id_ArqueoCaja;
                        cmd.Parameters.Add("@id_Usuario", SqlDbType.Int).Value = idUsuario;

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

        public object get_arqueoCajaCab_billetesMonedas_edicion(int idArqueoCaja, int idUsuario, int idZona)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_LISTA_MONEDAS_BILLETES_EDICION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idArqueoCaja", SqlDbType.Int).Value = idArqueoCaja;
                        cmd.Parameters.Add("@idZona", SqlDbType.Int).Value = idZona;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    res.ok = true;
                    res.data = dt_detalle;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object get_arqueoCajaCab_ventas_edicion(int idArqueoCaja, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();

            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_LISTADO_VENTAS_EDICION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idArqueoCaja", SqlDbType.Int).Value = idArqueoCaja;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    res.ok = true;
                    res.data = dt_detalle;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object get_arqueoCajaCab_cobranzas_edicion(int idArqueoCaja , int idUsuario)
        {
            DataTable dt_detalleCobranzas = new DataTable();
             DataTable dt_resumenCobranzas = new DataTable();

            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_LISTADO_COBRANZAS_EDICION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idArqueoCaja", SqlDbType.Int).Value = idArqueoCaja;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalleCobranzas);
                        }
                    }

                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COBRANZAS_RESUMEN_EDICION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idArqueoCaja", SqlDbType.Int).Value = idArqueoCaja;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_resumenCobranzas);
                        }
                    }
                    var listadosCab = new
                    {
                        cobranzas = dt_detalleCobranzas,
                        cobranzas_resumen = dt_resumenCobranzas
                    };

                    res.ok = true;
                    res.data = listadosCab;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }
 
        public object get_arqueoCajaCab_devoluciones_edicion(int idArqueoCaja, int idUsuario)
        {
            DataTable dt_detalleDevoluciones = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_LISTADO_DEVOLUCIONES_EDICION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idArqueoCaja", SqlDbType.Int).Value = idArqueoCaja;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalleDevoluciones);
                        }
                    } 

                    var listadosCab = new
                    {
                        Devoluciones = dt_detalleDevoluciones
                    };

                    res.ok = true;
                    res.data = listadosCab;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object set_anularArqueoCaja(int id_ArqueoCaja, int idUsuario)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_U_ARQUEO_CAJA_ANULAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_ArqueoCaja", SqlDbType.Int).Value = id_ArqueoCaja;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
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


        public object get_listadoMantenimientoRutas(int id_zona, int id_supervisor, int id_estado, string buscar)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_MANT_RUTAS_VENTAS_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;
                        cmd.Parameters.Add("@id_supervisor", SqlDbType.Int).Value = id_supervisor;
                        cmd.Parameters.Add("@id_estado", SqlDbType.Int).Value = id_estado;
                        cmd.Parameters.Add("@buscar", SqlDbType.VarChar).Value = buscar;

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

        public object get_tiposEgresos_usuario(int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COMBO_TIPO_EGRESO_X_USUARIO", cn))
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

        public string Set_Actualizar_imagenComprobanteCobranza(int id_ArqueoCaja_Cobranza, string nombreFile, string nombreFileServer)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_GRABAR_IMAGEN_COBRANZA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_ArqueoCajaCobranza", SqlDbType.Int).Value = id_ArqueoCaja_Cobranza;
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

        public object get_buscarDocumento_cobranzas(int id_zona, int id_TipoDocumento, string serie_Documento,string numero_Documento, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COBRANZAS_BUSCAR_DOCUMENTO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;
                        cmd.Parameters.Add("@id_TipoDocumento", SqlDbType.Int).Value = id_TipoDocumento;
                        cmd.Parameters.Add("@serie_Documento", SqlDbType.VarChar).Value = serie_Documento;
                        cmd.Parameters.Add("@numero_Documento", SqlDbType.VarChar).Value = numero_Documento;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    res.ok = true;
                    res.data = dt_detalle;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        public object get_cobranzas_edicion(int id_ArqueoCaja_Cobranza, int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_ARQUEO_CAJA_COBRANZAS_EDICION_REGISTRO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_ArqueoCaja_Cobranza", SqlDbType.Int).Value = id_ArqueoCaja_Cobranza;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }

                    res.ok = true;
                    res.data = dt_detalle;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }
                 
        public object get_listadoMantenimiento_zonasVentas(int id_local, int id_anexo, int id_estado, string buscar)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_MANT_ZONAS_VENTA_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
                        cmd.Parameters.Add("@id_anexo", SqlDbType.Int).Value = id_anexo;
                        cmd.Parameters.Add("@id_estado", SqlDbType.Int).Value = id_estado;
                        cmd.Parameters.Add("@buscar", SqlDbType.VarChar).Value = buscar;

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
