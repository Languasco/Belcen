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
    
    public partial class tbl_Promocion_Productos
    {
        public int id_Promocion { get; set; }
        public string codigoPromocion { get; set; }
        public Nullable<int> id_ActividadPromocion { get; set; }
        public string nombrePromocion { get; set; }
        public string descripcionPromocion { get; set; }
        public Nullable<System.DateTime> fechaVigenciaDesde { get; set; }
        public Nullable<System.DateTime> fechaVigenciaHasta { get; set; }
        public Nullable<decimal> topesUnidadesInicio { get; set; }
        public Nullable<decimal> topesUnidadesFin { get; set; }
        public Nullable<int> id_CanalNegocio { get; set; }
        public Nullable<int> id_FormaPago { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_creacion { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
        public Nullable<int> usuario_edicion { get; set; }
        public Nullable<System.DateTime> fecha_edicion { get; set; }
    }
}
