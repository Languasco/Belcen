using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Procesos.Movil
{
    public class Ent_FacturacionCancelacion
    {

        public int id_cliente { get; set; }
        public string razonsocial_cliente { get; set; }
        public string nroDocumento { get; set; }
        public string direccion_cliente { get; set; }
        public string Total { get; set; }
        public string Pagado { get; set; }
        public string DeudaTotal { get; set; }
        public string FechaUltimo { get; set; }
    }
    public class Ent_FacturacionCancelacionDetalle
    {

        public int id_cliente { get; set; }
        public int id_factura_cab { get; set; }
        public string Numero_Documento { get; set; }
        public string Total { get; set; }
        public string Acuenta { get; set; }
        public string DeudaTotal { get; set; }
        public string FechaUltimo { get; set; }
    }
}
