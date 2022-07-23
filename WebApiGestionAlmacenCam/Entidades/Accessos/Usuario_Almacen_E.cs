using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Accessos
{
    public class Usuario_Almacen_E
    {
       public bool  checkeado { get; set; }  
       public int id_Usuario_Almacen { get; set; }  
       public int id_Usuario { get; set; }  
       public int id_Almacen { get; set; }  
       public string descripcion_Almacen { get; set; }

        public int id_ZonaVta_Usuario { get; set; }
        public int id_ZonaVta { get; set; }
        public string  nombreZonaVta  { get; set; }

    }
}
