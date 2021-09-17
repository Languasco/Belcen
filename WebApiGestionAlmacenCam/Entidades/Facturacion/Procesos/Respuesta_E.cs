using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Facturacion.Procesos
{
    public class Respuesta_E
    {
        public string errors { get; set; }
        public int tipo { get; set; }
        public string serie { get; set; }
        public int numero { get; set; }
        public string url { get; set; }
        public bool aceptada_por_sunat { get; set; }
        public string sunat_description { get; set; }
        public string sunat_note { get; set; }
        public string sunat_responsecode { get; set; }
        public string sunat_soap_error { get; set; }
        public string pdf_zip_base64 { get; set; }
        public string xml_zip_base64 { get; set; }
        public string cdr_zip_base64 { get; set; }
        public string cadena_para_codigo_qr { get; set; }
        public string codigo_hash { get; set; }
        public string codigo_de_barras { get; set; }
    }
}
