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
    
    public partial class TBL_EstadoCelular
    {
        public int id_estadocelular { get; set; }
        public Nullable<int> id_operario { get; set; }
        public Nullable<int> GpsActivo { get; set; }
        public Nullable<int> estadoBateria { get; set; }
        public Nullable<System.DateTime> FechaHoraAndroid { get; set; }
        public Nullable<System.DateTime> FechaAgregaRegistro { get; set; }
        public Nullable<int> ModoAvion { get; set; }
        public Nullable<int> PlanDatos { get; set; }
    }
}
