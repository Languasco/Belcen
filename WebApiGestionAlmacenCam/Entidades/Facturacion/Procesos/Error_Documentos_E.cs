using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Facturacion.Procesos
{
    public class Error_Documentos_E
    {
        public int id_Factura_Cab { get; set; }
        public int id_Factura_Cab_Referencia { get; set; }
        public string  nombres_Cliente { get; set; }
        public int  id_TipoDocumento { get; set; }
        public string  Descripcion_TipoDocumento { get; set; }
        public string  Numero_Documento { get; set; }
        public string  forma_pago { get; set; }
        public string  fecha_emision { get; set; }
        public string  fecha_vencimiento { get; set; }
        public string  mensaje { get; set; }
        public bool checkeado { get; set; }
    }
}
