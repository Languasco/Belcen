using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Almacen.Procesos
{
    public class PagoProveedor_E
    {
        public bool checkeado { get; set; }

        public int id_GuiaCab { get; set; }
        public string tipoOrden { get; set; }
        public string fechaEmision { get; set; }
        public string tipoDoc { get; set; }
        public string numero { get; set; }
        public string ordenCompra { get; set; }
        public string total { get; set; }
        public string porcDetraccion { get; set; }
        public string totalDetraccion { get; set; }
        public string porcRetencion { get; set; }
        public string totalRetencion { get; set; }
        public string totalPagar { get; set; }
        public string totalCancelado { get; set; }
        public string saldoPendiente { get; set; }
        public string saldoPendienteEditado { get; set; }
    }
}
