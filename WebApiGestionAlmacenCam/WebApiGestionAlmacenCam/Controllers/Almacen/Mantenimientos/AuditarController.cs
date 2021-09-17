using Entidades;
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

    }
}
