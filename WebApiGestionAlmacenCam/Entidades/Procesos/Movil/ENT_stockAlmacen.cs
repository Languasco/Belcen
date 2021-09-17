using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Procesos.Movil
{
    public class ENT_stockAlmacen
    {
        public int id { get; set; }
        public int id_producto { get; set; }
        public string codigoInterno { get; set; }
        public string descripcion_producto { get; set; }
        public string precio { get; set; }
        public string aplicaDescuento { get; set; }
        public string porceDescuento { get; set; }
        public string unidadMedida { get; set; }
        public string stock { get; set; }
        public string marca { get; set; }
    }
}
