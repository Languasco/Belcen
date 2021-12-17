using Entidades;
using Negocio.Reparto.Procesos;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Reparto.Procesos
{
    [EnableCors("*", "*", "*")]
    public class ImportarPedidoController : ApiController
    {
        public class resul
        {
            public bool ok { get; set; }
            public object data { get; set; }
        }
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetImportarPedido(int opcion, string filtro)
        {
            //filtro puede tomar cualquier valor
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {

                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int id_usuario = Convert.ToInt32(parametros[0].ToString()); 

                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    resul = obj_negocio.Listar_almacenesGenerales(id_usuario);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int opcionElegido = Convert.ToInt32(parametros[0].ToString());
                    string login =  parametros[1].ToString();
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    resul = obj_negocio.get_busquedaLogin(opcionElegido, login, id_usuario);

                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int opcionElegido = Convert.ToInt32(parametros[0].ToString());
                    string id_login = parametros[1].ToString();
                    int id_usuario = Convert.ToInt32(parametros[2].ToString());

                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    resul = obj_negocio.set_activarUsuario_sesion(opcionElegido, id_login, id_usuario);

                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int id_usuario = Convert.ToInt32(parametros[0].ToString());

                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    resul = obj_negocio.get_tiposMovimientos(id_usuario);
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int id_usuario = Convert.ToInt32(parametros[0].ToString());
                    int idLocal = Convert.ToInt32(parametros[1].ToString());
                    int idAlmacen = Convert.ToInt32(parametros[2].ToString());
                    string fecha = parametros[3].ToString();
                    int idMovimiento = Convert.ToInt32(parametros[4].ToString());
                    string nroDoc = parametros[5].ToString();

                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    resul = obj_negocio.set_almacenando_ajusteInventario(id_usuario, idLocal, idAlmacen, fecha, idMovimiento, nroDoc);

                }
                else
                {
                    resul = "Opcion selecciona invalida";
                }

            }
            catch (Exception ex)
            {
                resul = ex.Message;
            }
            return resul;
        }

 
        [HttpPost]
        [Route("api/ImportarPedido/post_archivoExcel_importarPedido")]
        public object post_archivoExcel_importarPedido(int idUsuario, string fechaAsignacion, int idLocal)
        {
            resul res = new resul();
            try
            {
                string path = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/ImportarPedido" + idUsuario + ".xlsx");
                System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;

                for (int i = 0; i < files.Count; i++)
                {
                    System.Web.HttpPostedFile file = files[i];
                    if (file.ContentLength > 0)
                    {
                        if (File.Exists(path))
                        {
                            File.Delete(path);
                        }
                        file.SaveAs(path);
                    }
                }
                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    res.ok = true;
                    res.data = obj_negocio.Get_ImportarArchivoPedido(idUsuario, fechaAsignacion, files[0].FileName, idLocal);
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo guardar el archivo en el servidor..";
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }

            return res;
        }
        

        [HttpPost]
        [Route("api/ImportarPedido/post_archivoExcel_stockAlmacen")]
        public object post_archivoExcel_stockAlmacen(int idUsuario, int idAlmacen)
        {
            resul res = new resul();
            try
            {
                string path = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/ImportarStockAlmacen" + idUsuario + ".xlsx");
                System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;

                for (int i = 0; i < files.Count; i++)
                {
                    System.Web.HttpPostedFile file = files[i];
                    if (file.ContentLength > 0)
                    {
                        if (File.Exists(path))
                        {
                            File.Delete(path);
                        }
                        file.SaveAs(path);
                    }
                }
                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    res.ok = true;
                    res.data = obj_negocio.Get_ImportarArchivoStockAlmacen(idUsuario,files[0].FileName, idAlmacen);
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo guardar el archivo en el servidor..";
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }

            return res;
        }


        [HttpPost]
        [Route("api/ImportarPedido/post_archivoExcel_precio")]
        public object post_archivoExcel_precio(int idUsuario, int tipoImportacion)
        {
            resul res = new resul();
            try
            {
                string path = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/ImportarPrecio" + idUsuario + ".xlsx");
                System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;

                for (int i = 0; i < files.Count; i++)
                {
                    System.Web.HttpPostedFile file = files[i];
                    if (file.ContentLength > 0)
                    {
                        if (File.Exists(path))
                        {
                            File.Delete(path);
                        }
                        file.SaveAs(path);
                    }
                }
                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    res.ok = true;
                    res.data = obj_negocio.Get_ImportarArchivoPrecio(idUsuario, files[0].FileName, tipoImportacion);
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo guardar el archivo en el servidor..";
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }

            return res;
        }



        [HttpPost]
        [Route("api/ImportarPedido/post_archivoExcel_ajusteInventario")]
        public object post_archivoExcel_ajusteInventario(int idUsuario)
        {
            resul res = new resul();
            string nombreFile = "";
            string nombreExcel= "";
            try
            {
                //-----generando clave unica---
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                nombreFile = idUsuario + "_Importacion_AjusteInventario_" + Guid.Parse(guidB);

                string path = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/" + nombreFile + ".xlsx");
                System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;

                for (int i = 0; i < files.Count; i++)
                {
                    System.Web.HttpPostedFile file = files[i];
                    nombreExcel = file.FileName;

                    if (file.ContentLength > 0)
                    {
                        if (File.Exists(path))
                        {
                            File.Delete(path);
                        }
                        file.SaveAs(path);
                    }
                }
                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                    EntregaPedido_BL obj_negocio = new EntregaPedido_BL();
                    string valor = obj_negocio.setAlmacenandoFile_Excel_ajusteInventario(path, nombreExcel, idUsuario);
                    if (valor == "OK")
                    {
                        res.ok = true;
                        res.data = obj_negocio.get_datosCargados_ajusteInventario(idUsuario);
                    }
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo almacenar el archivo en el servidor";
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
