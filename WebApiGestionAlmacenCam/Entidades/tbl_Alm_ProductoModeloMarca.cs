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
    
    public partial class tbl_Alm_ProductoModeloMarca
    {
        public tbl_Alm_ProductoModeloMarca()
        {
            this.tbl_Alm_Producto = new HashSet<tbl_Alm_Producto>();
        }
    
        public int id_modeloProducto { get; set; }
        public Nullable<int> id_marcaProducto { get; set; }
        public string codigo_modeloProducto { get; set; }
        public string nombre_modeloProducto { get; set; }
        public string abreviatura_modeloProducto { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_Creacion { get; set; }
        public Nullable<System.DateTime> fecha_Creacion { get; set; }
        public Nullable<int> usuario_Edicion { get; set; }
        public Nullable<System.DateTime> fecha_Edicion { get; set; }
    
        public virtual tbl_Alm_ProductoMarca tbl_Alm_ProductoMarca { get; set; }
        public virtual ICollection<tbl_Alm_Producto> tbl_Alm_Producto { get; set; }
    }
}
