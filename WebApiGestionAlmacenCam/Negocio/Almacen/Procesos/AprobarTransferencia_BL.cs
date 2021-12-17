using Entidades;
using Negocio.Conexion;
using Negocio.Facturacion.Procesos;
using Negocio.Resultado;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Almacen.Procesos
{
    public class AprobarTransferencia_BL
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();               

        public string Set_AprobarTransferencia_SinGuia(int Id_AlmTranCab, int id_usuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_TRANF_APROBAR_SIN_GUIA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Id_AlmTranCab", SqlDbType.Int).Value = Id_AlmTranCab;
                        cmd.Parameters.Add("@Id_usuario", SqlDbType.Int).Value = id_usuario;
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

        public string Set_AprobarTransferencia_ConGuia(int Id_AlmTranCab,int  id_usuario, string serie,string  nroDocumento, string fecha_emision,int  id_Transportista, int id_vehiculo, int id_Proveedor,string fecha_traslado)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_TRANF_APROBAR_CON_GUIA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Id_AlmTranCab", SqlDbType.Int).Value = Id_AlmTranCab;
                        cmd.Parameters.Add("@Id_usuario", SqlDbType.Int).Value = id_usuario;

                        cmd.Parameters.Add("@serie", SqlDbType.VarChar).Value = serie;
                        cmd.Parameters.Add("@nroDocumento", SqlDbType.VarChar).Value = nroDocumento;
                        cmd.Parameters.Add("@fecha_emision", SqlDbType.VarChar).Value = fecha_emision;

                        cmd.Parameters.Add("@id_Transportista", SqlDbType.Int).Value = id_Transportista;
                        cmd.Parameters.Add("@id_vehiculo", SqlDbType.Int).Value = id_vehiculo;
                        cmd.Parameters.Add("@id_Proveedor", SqlDbType.Int).Value = id_Proveedor;
                        cmd.Parameters.Add("@fecha_traslado", SqlDbType.VarChar).Value = fecha_traslado;
                        
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
  
        public string Set_RechazarTransferencia(int Id_AlmTranCab, int id_usuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_TRANF_RECHAZAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Id_AlmTranCab", SqlDbType.Int).Value = Id_AlmTranCab;
                        cmd.Parameters.Add("@Id_usuario", SqlDbType.Int).Value = id_usuario;
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


        public DataTable get_impresion_transferencias(int id_transferencia,int id_estado)
        {
            DataTable dt_resultado = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_GET_DOCUMENTO_TRANSFERENCIA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_trans", SqlDbType.Int).Value = id_transferencia;
                        cmd.Parameters.Add("@estado", SqlDbType.Int).Value = id_estado;

                        //DataTable dt_detalle_transf = new DataTable();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_resultado);                              
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return dt_resultado;
        }

        public object Set_generarTransferencia_ConGuia(int Id_AlmTranCab, int id_usuario, string serie, string nroDocumento, string fecha_emision, int id_Transportista, int id_vehiculo, int id_Proveedor, string fecha_traslado)
        {

            int id_GuiaCab = 0;
            Resul res = new Resul();

            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_I_TRANSFERENCIAS_GENERAR_GUIA_NEW", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Id_AlmTranCab", SqlDbType.Int).Value = Id_AlmTranCab;
                        cmd.Parameters.Add("@Id_usuario", SqlDbType.Int).Value = id_usuario;

                        cmd.Parameters.Add("@serie", SqlDbType.VarChar).Value = serie;
                        cmd.Parameters.Add("@nroDocumento", SqlDbType.VarChar).Value = nroDocumento;
                        cmd.Parameters.Add("@fecha_emision", SqlDbType.VarChar).Value = fecha_emision;

                        cmd.Parameters.Add("@id_Transportista", SqlDbType.Int).Value = id_Transportista;
                        cmd.Parameters.Add("@id_vehiculo", SqlDbType.Int).Value = id_vehiculo;
                        cmd.Parameters.Add("@id_Proveedor", SqlDbType.Int).Value = id_Proveedor;
                        cmd.Parameters.Add("@fecha_traslado", SqlDbType.VarChar).Value = fecha_traslado;

                        cmd.Parameters.Add("@id_GuiaCab", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        id_GuiaCab = Convert.ToInt32(cmd.Parameters["@id_GuiaCab"].Value.ToString());

                        res.ok = true;
                        res.data = id_GuiaCab;



                        ////-- obteniendo los datos de la Guia ---------
                        //tbl_Alm_Guias_Cab objGuiaRemision = db.tbl_Alm_Guias_Cab.Where(g => g.id_GuiaCab == id_GuiaCab).SingleOrDefault();

                        //if (objGuiaRemision != null)
                        //{
                        //    if (string.IsNullOrEmpty(objGuiaRemision.id_Anexo.ToString()) == false) /// 
                        //    {
                        //        int idAnexo = Convert.ToInt32(objGuiaRemision.id_Anexo.ToString());
                        //        Pedidos_BL obj_negocio = new Pedidos_BL();

                        //        obj_negocio.GenerarComprobanteElectronico_otrosModulos_GuiaRemision_nubeFact(id_GuiaCab, idAnexo);

                        //        res.ok = true;
                        //        res.data = id_GuiaCab;
                        //    }
                        //    else
                        //    {
                        //        res.ok = false;
                        //        res.data = "No se encuentra  el id_Anexo en la tabla tbl_Alm_Guias_Cab para enviar a NubeFact  idGuia : " + id_GuiaCab;
                        //    }
                        //}
                        //else
                        //{
                        //    res.ok = false;
                        //    res.data = "No se encuentra el documento en la tabla tbl_Alm_Guias_Cab para Generar y enviar el Comprobante";
                        //}


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

        public object Set_actualizarCantTransferencia(int Id_TranfCab, int Id_TranfDet, string cant, int Id_usuario)
        {
            int id_GuiaCab = 0;
            Resul res = new Resul();

            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_U_TRANF_APROBAR_MODIFICAR_CANTIDAD", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Id_TranfCab", SqlDbType.Int).Value = Id_TranfCab;
                        cmd.Parameters.Add("@Id_TranfDet", SqlDbType.Int).Value = Id_TranfDet;
                        cmd.Parameters.Add("@cant", SqlDbType.VarChar).Value = cant;
                        cmd.Parameters.Add("@Id_usuario", SqlDbType.Int).Value = Id_usuario;
                        cmd.ExecuteNonQuery();

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

        public DataTable get_mostrandoTransferencias_porAprobar(int id_Local, int id_Almacen, int tipo_reporte)
        {
            DataTable dt_resultado = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_S_APROBAR_TRANSFERENCIA_LISTADO_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Local", SqlDbType.Int).Value = id_Local;
                        cmd.Parameters.Add("@id_Almacen", SqlDbType.Int).Value = id_Almacen;
                        cmd.Parameters.Add("@tipo_reporte", SqlDbType.Int).Value = tipo_reporte;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_resultado);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return dt_resultado;
        }

    }
}
