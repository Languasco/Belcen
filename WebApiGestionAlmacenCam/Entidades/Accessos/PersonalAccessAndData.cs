using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades
{
    public class listaWebs
    {

        public Nullable<int> id_opcion { get; set; }
        public string eventos { get; set; }
        public string nombre_page { get; set; }
        public string url_page { get; set; }
        public Nullable<int> orden { get; set; }

    }
    public class listJsonPermisos
    {

        public Nullable<int> id_opcion { get; set; }
        public Nullable<int> id_usuarios { get; set; }
        public string page_principal { get; set; }
        public Nullable<int> parent_id { get; set; }
        public List<listaWebs> listWeb { get; set; }        
        public string url { get; set; }
    }
    public class contentDataUsuario
    {

        public List<listJsonPermisos> listPermisos { get; set; }
        public tbl_Usuarios dataUsuario { get; set; }
    }
}
