using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Facturacion.Reporte
{
    public class Registro_ventas
    {


        public int id_Factura_Cab { get; set; }  
        public int  id_vendedor { get; set; }  

        public string personal { get; set; } 
        public string lugar_distribucion { get; set; } 
        public string fecha { get; set; } 
        public string nro_recibo { get; set; } 
        public string tipo { get; set; } 
        public decimal pago_recibo_cuenta { get; set; }
        public decimal saldo_total { get; set; }

        public decimal monto { get; set; }
        public string fechaemision { get; set; } 
        public string nrodoc { get; set; } 
        public string razonSocial_Cliente { get; set; } 
        public string nrovoucher { get; set; }
        public string voucher { get; set; }
        public string url { get; set; } 
        public int id_cliente { get; set; }
        public String Cliente { get; set; }
        public String Vendedor { get; set; }

    }
}
