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
    
    public partial class tbl_Estados
    {
        public int id_Estado { get; set; }
        public string nombre_estado { get; set; }
        public string descripcion_estado { get; set; }
        public string tipoProceso_estado { get; set; }
        public string descripcion_tipoProceso_estado { get; set; }
        public Nullable<int> id_modulo { get; set; }
        public Nullable<int> orden_estado { get; set; }
        public string backcolor_estado { get; set; }
        public string forecolor_estado { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_creacion { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
        public Nullable<int> usuario_edicion { get; set; }
        public Nullable<System.DateTime> fecha_edicion { get; set; }
    }
}
