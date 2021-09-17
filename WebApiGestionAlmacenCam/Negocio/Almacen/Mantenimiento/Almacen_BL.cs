using Negocio.Conexion;
using Negocio.Resultado;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Almacen.Mantenimiento
{
    public class Almacen_BL
    {
       public string Set_Actualizar_Precio(int id_guiaDet, decimal precio)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_INGRESO_GUIAS_ACTUALIZAR_PRECIO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_guiaDet", SqlDbType.Int).Value = id_guiaDet;
                        cmd.Parameters.Add("@precio", SqlDbType.Decimal).Value = precio;
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


        public string Set_Actualizar_imagenProducto(int idProducto, string nombreFile , string nombreFileServer)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_MANT_PRODUCTO_FOTO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProducto", SqlDbType.Int).Value = idProducto;
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


        public object get_clientesCab(int id_TipoCliente, string doc_identidad,  string razon_social,  int id_zona, int id_vendedor, int id_condicionPago,string direccion_entrega, int id_estado)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_MANT_CLIENTE_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@id_TipoCliente", SqlDbType.Int).Value = id_TipoCliente;
                        cmd.Parameters.Add("@doc_identidad", SqlDbType.VarChar).Value = doc_identidad;
                        cmd.Parameters.Add("@razon_social", SqlDbType.VarChar).Value = razon_social;

                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;
                        cmd.Parameters.Add("@id_vendedor", SqlDbType.Int).Value = id_vendedor;
                        cmd.Parameters.Add("@id_condicionPago", SqlDbType.Int).Value = id_condicionPago;

                        cmd.Parameters.Add("@direccion_entrega", SqlDbType.VarChar).Value = direccion_entrega;
                        cmd.Parameters.Add("@id_estado", SqlDbType.Int).Value = id_estado;


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


        public object get_girosNegocio()
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_MANT_CLIENTE_COMBO_GIRO", cn))
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
        
        public object get_canalesNegocio()
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_MANT_CLIENTE_COMBO_CANALES", cn))
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

        public object get_zona()
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_MANT_CLIENTE_COMBO_ZONA", cn))
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

        public object get_ruta()
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_MANT_CLIENTE_COMBO_RUTA", cn))
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

        public object get_vendedor(int idRuta)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_MANT_CLIENTE_COMBO_VENDEDOR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idRuta", SqlDbType.Int).Value = idRuta;


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

        public object get_supervisor(int idRuta)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_MANT_CLIENTE_COMBO_SUPERVISOR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idRuta", SqlDbType.Int).Value = idRuta;


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

        public object Set_Actualizar_DistribucionCliente(int idCliente, int id_ZonaVta, int  id_RutaVta, int  idVendedor, int idSupervisor, string secuencia_Cliente, string  disDiaVisita, string motivodeNocompra, string  productoInteres )
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_MANT_CLIENTE_DISTRIBUCION_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idCliente", SqlDbType.Int).Value = idCliente;
                        cmd.Parameters.Add("@id_ZonaVta", SqlDbType.Int).Value = id_ZonaVta;
                        cmd.Parameters.Add("@id_RutaVta", SqlDbType.Int).Value = id_RutaVta;

                        cmd.Parameters.Add("@idVendedor", SqlDbType.Int).Value = idVendedor;
                        cmd.Parameters.Add("@idSupervisor", SqlDbType.Int).Value = idSupervisor;
                        cmd.Parameters.Add("@secuencia_Cliente", SqlDbType.VarChar).Value = secuencia_Cliente;

                        cmd.Parameters.Add("@disDiaVisita", SqlDbType.VarChar).Value = disDiaVisita;
                        cmd.Parameters.Add("@motivodeNocompra", SqlDbType.VarChar).Value = motivodeNocompra;
                        cmd.Parameters.Add("@productoInteres", SqlDbType.VarChar).Value = productoInteres;


                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
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
               
        public object Set_Actualizar_creditoCobranzaCliente(int idCliente, string importeMaxCredido, string obsrealizaCobranza, int cond_facturacion)
        {
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_MANT_CLIENTE_CREDITO_COBRANZA_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idCliente", SqlDbType.Int).Value = idCliente;
                        cmd.Parameters.Add("@importeMaxCredido", SqlDbType.VarChar).Value = importeMaxCredido;
                        cmd.Parameters.Add("@obsrealizaCobranza", SqlDbType.VarChar).Value = obsrealizaCobranza;
                        cmd.Parameters.Add("@cond_facturacion", SqlDbType.Int).Value = cond_facturacion;
                        cmd.ExecuteNonQuery();

                        res.ok = true;
                        res.data = "OK";
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


        public object get_listaPrecio(int idProducto)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_MANT_PRODUCTO_LISTA_PRECIO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProducto", SqlDbType.Int).Value = idProducto;


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

        public object get_anexos()
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_MANT_ALMACEN_COMBO_ANEXO", cn))
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

        public object set_habilitarGuia(int idGuiaCab, int  idUsuario )
        { 
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_INGRESO_GUIA_HABILITAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idGuiaCab", SqlDbType.Int).Value = idGuiaCab;
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

        public object get_almacenes_zona( int id_zona, int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_COMBO_ALMACEN_ZONA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_zona", SqlDbType.Int).Value = id_zona;
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


        public object get_almacenes_anexo(int id_zona, int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            Resul res = new Resul();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("PROC_S_FACTURACION_COMBO_ALMACEN", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_anexo", SqlDbType.Int).Value = id_zona;
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


    }
}
