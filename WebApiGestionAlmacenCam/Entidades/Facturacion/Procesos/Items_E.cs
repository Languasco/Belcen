using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Facturacion.Procesos
{
    public class Items_E
    {
        public string unidad_de_medida { get; set; }
        public string codigo { get; set; }
        public string descripcion { get; set; }
        public double cantidad { get; set; }
        public double valor_unitario { get; set; }
        public double precio_unitario { get; set; }
        public dynamic descuento { get; set; }
        public double subtotal { get; set; }
        public int tipo_de_igv { get; set; }
        public double igv { get; set; }      
        public double total { get; set; }
        //public bool anticipo_regularizacion { get; set; }
        public string anticipo_regularizacion { get; set; }
        public dynamic anticipo_comprobante_serie { get; set; }
        public dynamic anticipo_comprobante_numero { get; set; }
    }
}
