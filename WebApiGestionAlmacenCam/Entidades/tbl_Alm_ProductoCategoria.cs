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
    
    public partial class tbl_Alm_ProductoCategoria
    {
        public tbl_Alm_ProductoCategoria()
        {
            this.tbl_Alm_ProductoLinea = new HashSet<tbl_Alm_ProductoLinea>();
            this.tbl_Alm_ProductoSubLinea = new HashSet<tbl_Alm_ProductoSubLinea>();
            this.tbl_Alm_Producto = new HashSet<tbl_Alm_Producto>();
        }
    
        public int id_categoriaProducto { get; set; }
        public string codgoCategoria { get; set; }
        public string nombre_Categoria { get; set; }
        public string abreviacion_Categoria { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_Creacion { get; set; }
        public Nullable<System.DateTime> fecha_Creacion { get; set; }
        public Nullable<int> usuario_Edicion { get; set; }
        public Nullable<System.DateTime> fecha_Edicion { get; set; }
    
        public virtual ICollection<tbl_Alm_ProductoLinea> tbl_Alm_ProductoLinea { get; set; }
        public virtual ICollection<tbl_Alm_ProductoSubLinea> tbl_Alm_ProductoSubLinea { get; set; }
        public virtual ICollection<tbl_Alm_Producto> tbl_Alm_Producto { get; set; }
    }
}