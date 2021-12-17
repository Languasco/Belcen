using Entidades;
using Negocio.Accesos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace webApiFacturacion.Controllers.Mantenimientos
{
    [EnableCors("*", "*", "*")]
    public class AuditarController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();
        
        public class PersonaA
        {
            public int id_personal { get; set; }
            public string nombre_personal { get; set; }
            public string apellido_personal { get; set; }

        }

        public object GetAuditoria(string id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            if (id.Equals("null"))
            {
                List<PersonaA> listPer = new List<PersonaA>();
                PersonaA account = new PersonaA
                {
                    id_personal = 0,
                    nombre_personal = "No Existe",
                    apellido_personal = ""
                };
                listPer.Add(account);
                return listPer;
            }
            else
            {
                int valor = Convert.ToInt32(id);
                var list = (from a in db.tbl_Personal
                            where a.id_personal == valor
                            select new
                            {
                                id_personal = a.id_personal,
                                nombre_personal = a.nombres_personal ,
                                apellido_personal = a.apellidos_personal,
                            }).ToList();

                return list;
            }

        }


        public object GetAuditoria(int opcion, string filtro)
        {
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int id_usuario = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario_edicion = Convert.ToInt32(parametros[1].ToString());


                    AccesosUsuario_BL obj_negocio = new AccesosUsuario_BL();
                    resul = obj_negocio.get_auditoria( id_usuario, id_usuario_edicion);
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
