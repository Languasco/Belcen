using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Cobranzas
{
    public class detalle_cancelaciones_E
    {
        public string id_Factura_Cab { get; set; }
        public int id_usuario { get; set; }
           
        public string cod_ref { get; set; }
        public string fecha_cancelacion { get; set; }
        public decimal saldo_pendiente { get; set; }
        public decimal importe_pagar { get; set; }
                
        public string fechaOperacion { get; set; }
        public string nroOperacion { get; set; }
        public string id_banco { get; set; }
        public string nro_recibo { get; set; }
        public string cod_masivo { get; set; }

        public int id_vendedor { get; set; }
        public int id_transportista { get; set; }

    }
}
