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
    
    public partial class w_tbl_Personal
    {
        public int id_personal { get; set; }
        public string nroDoc_personal { get; set; }
        public string tipoDoc_personal { get; set; }
        public string apellidos_personal { get; set; }
        public string nombres_personal { get; set; }
        public Nullable<int> tip_personal { get; set; }
        public Nullable<int> id_cargo_personal { get; set; }
        public string fotoUrl_personal { get; set; }
        public string nroCelular_personal { get; set; }
        public string email_personal { get; set; }
        public string nombreUsario_personal { get; set; }
        public string contrasenia_personal { get; set; }
        public string envio_enlinea_personal { get; set; }
        public Nullable<int> id_perfil { get; set; }
        public Nullable<System.DateTime> fecha_cese { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_creacion { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
        public Nullable<int> usuario_edicion { get; set; }
        public Nullable<System.DateTime> fecha_edicion { get; set; }
        public string codigo_personal { get; set; }
        public Nullable<int> flag_conectado { get; set; }
        public string IMEI { get; set; }
        public string version { get; set; }
    }
}