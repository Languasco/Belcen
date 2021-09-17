using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Facturacion.Procesos
{
    public class revisionPedidoE
    {
        public bool checkeado { get; set; }        
        public int id_Pedido_Cab { get; set; }
        public string nroPedido { get; set; }
        public string fecha { get; set; }
        public string cliente { get; set; }

        public string nroDoc { get; set; }
        public string tipoDoc { get; set; }

        public string formaPago { get; set; }
        public string valorBruto { get; set; }
        public string igv { get; set; }
        public string importeNeto { get; set; }
        public string fueraRuta { get; set; }
        public string vendedor { get; set; }
        public string transportista { get; set; }
        public string estado { get; set; }
        public string descripcionEstado { get; set; }
 
    }

    public class FacturasE
    {
        public bool checkeado { get; set; }
        public int id_Factura_Cab { get; set; }
        public string idTipoDoc { get; set; }
        public string descripcionTipoDoc { get; set; }
        public string nrodocumento { get; set; }
        public string fecha { get; set; }
        public string cliente { get; set; }
        public string formaPago { get; set; }
        public string valorBruto { get; set; }
        public string igv { get; set; }
        public string importeNeto { get; set; }
        public string vendedor { get; set; }
    }

}
