using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Cobranzas
{
    public class CancelacionMasiva_doc_E
    {        
        public int id_cancelacion_cab { get; set; }
        public int id_Factura_Cab  { get; set; }
        public string id_TipoDocumento { get; set; }
        public string tipo_doc { get; set; }
        public string nro_doc { get; set; }
        public string id_cliente { get; set; }
        public string cliente { get; set; }
        public string saldo_pendiente { get; set; }
        public string importe_total { get; set; }
        
        public bool cancelar { get; set; }
        public string importe_pagar { get; set; }
        public string nuevo_saldo { get; set; }
        public string condicion_pago { get; set; }
        public string id_formaPago { get; set; }
        public string FormaPago { get; set; }
        
        public string id_banco { get; set; }
        public string fechaOperacion { get; set; }
        public string nroOperacion { get; set; }

        
        public string cod_ref { get; set; }
        public string Numero_Documento { get; set; }
        public string fecha_pago { get; set; }
        public string pago_factura { get; set; }
        public string cobrador { get; set; }
        public string voucher { get; set; }
        public string saldoCuenta { get; set; }

        public int id_estado { get; set; }
        public string estado { get; set; }
        public string url { get; set; }

        public string totalCancelado { get; set; }
        public string totalRetencion { get; set; }
        public string totalDetraccion { get; set; }
        public List<string> file { get; set; }
        public string fechaDoc { get; set; }
        public string CondicionPago { get; set; }     

    }

    public class File {
        public object file { get; set; }
    }
}
