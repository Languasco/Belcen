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
    
    public partial class w_tbl_Com_Canales_Negocio
    {
        public int id_CanalNegocio { get; set; }
        public string Nombre_CanalNegocio { get; set; }
        public string descripcion_CanalNegocio { get; set; }
        public string abreviatura_CanalNegocio { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_Creacion { get; set; }
        public Nullable<System.DateTime> fecha_Edicion { get; set; }
        public Nullable<int> usuario_Edicion { get; set; }
        public Nullable<System.DateTime> fecha_Creacion { get; set; }
    }
}