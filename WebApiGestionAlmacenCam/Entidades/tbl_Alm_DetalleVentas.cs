//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Entidades
{
    using System;
    using System.Collections.Generic;
    
    public partial class tbl_Alm_DetalleVentas
    {
        public int id_detalle { get; set; }
        public string nombre_Producto { get; set; }
        public string descripcion_Producto { get; set; }
        public Nullable<decimal> cventas_Producto { get; set; }
        public Nullable<int> estado { get; set; }
        public string usuario_Cracion { get; set; }
        public Nullable<System.DateTime> fecha_Creacion { get; set; }
        public string usuario_Edicion { get; set; }
        public Nullable<System.DateTime> fecha_Edicion { get; set; }
    }
}
