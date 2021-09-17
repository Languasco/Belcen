using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Facturacion.Reporte
{
    public class PagosVendedor_E
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

    public class Busqueda_E {
        public int id { get; set; }
        public string nroDoc { get; set; }
        public string descripcion { get; set; }
    }


    public class PagosVendedor_New_E
    {
        public string anexo { get; set; }
        public string zona { get; set; }
        public string vendedor { get; set; }
        public string fechaEmision { get; set; }
        public string tipoDoc { get; set; }
        public string serie { get; set; }
        public string numero { get; set; }
       public string docIdentidadCliente { get; set; }
        public string nombreCliente { get; set; }
        public string totalFacturado { get; set; }
        public string totalPagado { get; set; }
        public string saldoPendiente { get; set; }
        public string descripcionEstado { get; set; }

    }



}
