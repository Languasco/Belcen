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
    
    public partial class tbl_Web_Aceesos
    {
        public int id_Acceso { get; set; }
        public Nullable<int> id_Usuario { get; set; }
        public Nullable<int> id_Opcion { get; set; }
        public Nullable<int> id_WebPage { get; set; }
        public Nullable<int> id_WebEvento { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_creacion { get; set; }
        public string fecha_creacion { get; set; }
        public Nullable<int> usuario_edicion { get; set; }
        public string fecha_edicion { get; set; }
        public string eventos { get; set; }
    
        public virtual tbl_Definicion_Opciones tbl_Definicion_Opciones { get; set; }
        public virtual tbl_Usuarios tbl_Usuarios { get; set; }
    }
}
