using Entidades;
using Negocio.Almacen.Mantenimiento;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Almacen.Mantenimientos
{
    [EnableCors("*", "*", "*")]
    public class MantenimientoAlmacenController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetMantenimiento_Almacen(int opcion, string filtro)
        {
            //filtro puede tomar cualquier valor
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                string[] parametros = filtro.Split('|');
                string local="";

                if ( parametros[0].ToString()=="" || parametros[0].ToString()==null || parametros[0].ToString()=="0")
                {
                    local="";
                }else{
                    local = parametros[0].ToString();
                }
 
                 resul = ( from a in db.tbl_Alm_Almacen 
                           join b in db.tbl_Locales on a.id_Local equals  b.id_Local
                           join c in db.tbl_Anexos on a.id_Anexos equals c.id_Anexos
                           where a.id_Local.ToString().Contains(local) 
                           select new
                            {
                                a.id_Almacen,
                                a.id_Empresa,
                                a.id_Local,
                                b.nombre_Local ,
                                a.codigo_Almacen,
                                a.descripcion_Almacen,
                                a.direccion_Almacen,
                                a.matNormal_Almacen,
                                a.matBaja_Almacen,
                                a.matConsignacion_Almacen,
                                a.estado,
                                a.usuario_Creacion,
                                a.fecha_Creacion,
                                a.usuario_Edicion,
                                a.fecha_Edicion,
                                a.id_departamento,
                                a.id_provincia,
                                a.id_distrito,
                                a. cod_establecimiento,
                                a.direccion_serie_sunat,
                                a.id_Anexos,
                                c.nombreAnexo,
                                a.pedidosMovil_Almacen,
                                a.ventaMayorista
                           }).ToList();
                }
                else if (opcion == 2)
                {

                    string[] parametros = filtro.Split('|');

                    int id_local = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());


                    tbl_Zonas_Venta tblzonas = db.tbl_Zonas_Venta.Find(id_local);

                    if (string.IsNullOrEmpty(tblzonas.id_Local.ToString()) == false)
                    {
                        resul = (from a in db.tbl_Alm_Almacen
                                 join b in db.tbl_Usuarios_Almacen on a.id_Almacen equals b.id_Almacen
                                 where a.estado == 1 && a.id_Local == tblzonas.id_Local && b.id_Usuario == id_usuario
                                 select new
                                 {
                                     a.id_Almacen,
                                     a.id_Empresa,
                                     a.id_Local,
                                     a.codigo_Almacen,
                                     a.descripcion_Almacen,
                                     a.direccion_Almacen,
                                     a.matNormal_Almacen,
                                     a.matBaja_Almacen,
                                     a.matConsignacion_Almacen,
                                     a.estado,
                                     a.usuario_Creacion,
                                     a.fecha_Creacion,
                                     a.usuario_Edicion,
                                     a.fecha_Edicion,
                                     a.Alm_Movil
                                 }).ToList();
                    }

                }
                else if (opcion == 3) 
                {
                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.get_anexos();                
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');

                    int id_zona = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.get_almacenes_zona(id_zona, id_usuario);
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');

                    int id_anexo = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    Almacen_BL obj_negocio = new Almacen_BL();
                    resul = obj_negocio.get_almacenes_anexo(id_anexo, id_usuario);
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

    }
}
