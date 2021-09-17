using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Cobranzas
{
    public class CobranzaReporte_E
    {
        public string anexo { get; set; } 
        public string zona_venta { get; set; }
        public string vendedor { get; set; } 
        public string fecha_emision { get; set; }
        public string tipo_doc { get; set; }
        public string serie { get; set; }
        public string numero { get; set; } 
        public string tipo_factura { get; set; }
        public string doc_cliente { get; set; }
        public string nombre_cliente { get; set; }
        public string condicion_pago { get; set; }
        public string fecha_ultimo_pago { get; set; }
        public string total_facturado { get; set; }
        public string total_pagado { get; set; }
        public string saldo_pendiente { get; set; }
        public string tiempo_vencimiento { get; set; }

        public string numero_cobranza { get; set; }
        public string totalGeneral_Facturado { get; set; }
        public string totalGeneral_Pagado { get; set; }
        public string totalGeneral_Pendiente { get; set; }


    }

    public class Result
    {
        public bool ok { get; set; }
        public object data { get; set; }
    }
}
