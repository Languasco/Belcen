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
    
    public partial class tbl_Anexos
    {
        public int id_Anexos { get; set; }
        public string nombreGrupo { get; set; }
        public string nombreAnexo { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_creacion { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
        public Nullable<int> usuario_edicion { get; set; }
        public Nullable<System.DateTime> fecha_edicion { get; set; }
        public string direccionAnexo { get; set; }
        public string emailAnexo { get; set; }
        public string celularAnexo { get; set; }
        public string RUTA { get; set; }
        public string TOKEN { get; set; }
    }
}
