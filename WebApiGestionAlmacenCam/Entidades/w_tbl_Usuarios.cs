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
    
    public partial class w_tbl_Usuarios
    {
        public int id_Usuario { get; set; }
        public string nrodoc_usuario { get; set; }
        public string apellidos_usuario { get; set; }
        public string nombres_usuario { get; set; }
        public string email_usuario { get; set; }
        public string Adm_Usuario { get; set; }
        public string Sys_Usuario { get; set; }
        public int id_Cargo { get; set; }
        public int id_Area { get; set; }
        public string tipo_usuario { get; set; }
        public Nullable<int> id_Empresa_Pertenece { get; set; }
        public string fotoBase64 { get; set; }
        public string fotourl { get; set; }
        public string login_usuario { get; set; }
        public string contrasenia_usuario { get; set; }
        public Nullable<int> id_Perfil { get; set; }
        public int estado { get; set; }
        public Nullable<int> usuario_creacion { get; set; }
        public string fecha_creacion { get; set; }
        public Nullable<int> usuario_edicion { get; set; }
        public string fecha_edicion { get; set; }
        public string Acceso_Movil_Tipo { get; set; }
        public Nullable<int> anular_documento { get; set; }
        public Nullable<int> flag_conectado { get; set; }
        public Nullable<System.DateTime> fecha_conectado { get; set; }
        public string origen_conectado { get; set; }
    }
}
