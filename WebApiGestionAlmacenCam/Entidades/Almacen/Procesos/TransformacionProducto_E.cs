using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Almacen.Procesos
{
    public class TransformacionProducto_E
    {
        public int id_GuiaCab { get; set; }
        public string fechaEmision { get; set; }
        public string localOrigen { get; set; }
        public string almacenOrigen { get; set; }
        public string localDestino { get; set; }
        public string almacenDestino { get; set; }
        public string nroTransaccion { get; set; }
        public string estado { get; set; }
        public string desEstado { get; set; }
        public string colorEstado { get; set; }

        public string usuario_creacion { get; set; }
        public string fecha_creacion { get; set; }
        public string usuario_edicion { get; set; }
        public string fecha_edicion { get; set; }

    }

    public class TransformacionProducto_Detalle_E
    {

        public int id_GuiaCab { get; set; }
        public int id_GuiaDet { get; set; }
        public string idProductoOrigen { get; set; }
        public string codigoProductoOrigen { get; set; }
        public string descripcionProductoOrigen { get; set; }
        public string idUMOrigen { get; set; }
        public string descripcionUMOrigen { get; set; }
        public string nroLoteOrigen { get; set; }
        public string fechaProduccionOrigen { get; set; }
        public string fechaVencimientoOrigen { get; set; }
        public string stock { get; set; }
        public string factorMultiplicacion_TransOrigen { get; set; }
        public string idProductoDestino { get; set; }
        public string codigoProductoDestino { get; set; }
        public string descripcionProductoDestino { get; set; }
        public string idUMDestino { get; set; }
        public string descripcionUMDestino { get; set; }
        public string nroLoteDestino { get; set; }
        public string fechaProduccionDestino { get; set; }
        public string fechaVencimientoDestino { get; set; }
        public string factorMultiplicacion_TransDestino { get; set; }
        public string cantidad { get; set; }
        public int usuario_creacion { get; set; }
    }


}
