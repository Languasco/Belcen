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
    
    public partial class w_tbl_Alm_Almacen
    {
        public int id_Almacen { get; set; }
        public Nullable<int> id_Empresa { get; set; }
        public Nullable<int> id_Anexos { get; set; }
        public Nullable<int> id_Local { get; set; }
        public string codigo_Almacen { get; set; }
        public string descripcion_Almacen { get; set; }
        public string direccion_Almacen { get; set; }
        public string matNormal_Almacen { get; set; }
        public string matBaja_Almacen { get; set; }
        public string matConsignacion_Almacen { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_Creacion { get; set; }
        public Nullable<System.DateTime> fecha_Creacion { get; set; }
        public Nullable<int> usuario_Edicion { get; set; }
        public Nullable<System.DateTime> fecha_Edicion { get; set; }
        public string Alm_Movil { get; set; }
        public Nullable<int> id_provincia { get; set; }
        public Nullable<int> id_distrito { get; set; }
        public string direccion_serie_sunat { get; set; }
        public string cod_establecimiento { get; set; }
        public Nullable<int> id_departamento { get; set; }
        public string pedidosMovil_Almacen { get; set; }
    }
}
