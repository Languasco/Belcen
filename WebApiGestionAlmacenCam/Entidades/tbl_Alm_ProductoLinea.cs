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
    
    public partial class tbl_Alm_ProductoLinea
    {
        public tbl_Alm_ProductoLinea()
        {
            this.tbl_Alm_ProductoSubLinea = new HashSet<tbl_Alm_ProductoSubLinea>();
            this.tbl_Alm_Producto = new HashSet<tbl_Alm_Producto>();
        }
    
        public int id_lineaProducto { get; set; }
        public int id_categoriaProducto { get; set; }
        public string codigo_linea { get; set; }
        public string nombre_linea { get; set; }
        public string abreviatura_linea { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_Creacion { get; set; }
        public Nullable<System.DateTime> fecha_Creacion { get; set; }
        public Nullable<int> usuario_Edicion { get; set; }
        public Nullable<System.DateTime> fecha_Edicion { get; set; }
    
        public virtual tbl_Alm_ProductoCategoria tbl_Alm_ProductoCategoria { get; set; }
        public virtual ICollection<tbl_Alm_ProductoSubLinea> tbl_Alm_ProductoSubLinea { get; set; }
        public virtual ICollection<tbl_Alm_Producto> tbl_Alm_Producto { get; set; }
    }
}