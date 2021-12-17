using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.StockAlmacen
{
    public class StockAlmacen_Ent
    {
        public int id { get; set; }
        public int id_Producto { get; set; }
        public string codigo_Producto { get; set; }
        public string nombre_Producto { get; set; }
        public string um_Producto { get; set; }
        public string categoria_Producto { get; set; }
        public decimal stock_Producto { get; set; }
        public string marca_Producto { get; set; }
        public string cantidad_ingresada { get; set; }
        public string nroLote { get; set; }
        public string idUnidadMedida { get; set; }
        public string fechaProduccion { get; set; }
        public string fechaVencimiento { get; set; }
    }

    public class kardesAlmacen
    {

        public int id { get; set; }
        public string tipo { get; set; }
        public string fecha { get; set; }
        public string tipoMov { get; set; }
        public string nrodoc { get; set; }
        public string operacion { get; set; }
        public string cantidad { get; set; }
        public double cantidadAux{ get; set; }
        public string precio { get; set; }
        public string costoTotal { get; set; }
        public string saldoinicial { get; set; }
        public double saldoinicialAux { get; set; }
        public string codigo_producto { get; set; }
        public string nombre_producto { get; set; }
        public int id_Producto { get; set; }


        public string PrecioUnitario { get; set; }
        public string Almacen { get; set; }
        public string Responsable { get; set; }
        public string Estado { get; set; }
        public string UsuarioCreacion { get; set; }
 
    }
}

