using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Mantenimiento.Reportes
{
    public class ReporteStock_E
    {
        public string almacen { get; set; }
        public string local { get; set; }
        public string  codigo { get; set; }
        public string  descripcion { get; set; }
        public string MARCA { get; set; }        
        public string  rubro { get; set; }
        public string  um { get; set; }
        public decimal  ingresos { get; set; }
        public decimal  salidas { get; set; }
        public decimal stock { get; set; }
        public string fecha { get; set; }
        public string serie { get; set; }
        public string nroDoc { get; set; }
        public string movimiento { get; set; }

        public string E_COSTOUNITARIO { get; set; }
        public string E_COSTOTOTAL { get; set; }
        public string S_COSTOUNITARIO { get; set; }
        public string S_COSTOTOTAL { get; set; }
        public string F_COSTOUNITARIO { get; set; }
        public string F_COSTOTOTAL { get; set; }


    }
}
