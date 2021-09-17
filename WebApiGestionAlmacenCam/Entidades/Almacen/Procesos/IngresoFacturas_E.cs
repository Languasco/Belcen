using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Almacen.Procesos
{
    public class IngresoFacturas_E
    {
        public int id_GuiaCab { get; set; }
        public string nroDoc { get; set; }
        public string nroGuia { get; set; }
        public string nroCompra { get; set; }
        public string fechaEmision { get; set; }
        public string almacen { get; set; }
        public string razonSocial { get; set; }
        public string tipoGuia { get; set; }
        public string idEstado { get; set; }
        public string TipoDoc { get; set; }
        public string descripcionEstado { get; set; }

        public string subTotal { get; set; }
        public string igv { get; set; }
        public string total { get; set; }


    }
}
