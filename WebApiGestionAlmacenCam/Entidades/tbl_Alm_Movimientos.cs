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
    
    public partial class tbl_Alm_Movimientos
    {
        public tbl_Alm_Movimientos()
        {
            this.tbl_Alm_Guias_Cab = new HashSet<tbl_Alm_Guias_Cab>();
            this.Tbl_Fac_Facturas_Compras_cab = new HashSet<Tbl_Fac_Facturas_Compras_cab>();
        }
    
        public int id_Movimiento { get; set; }
        public string tipoMovimiento { get; set; }
        public string descripcion_Movimiento { get; set; }
        public string codigoSunat_Movimiento { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_Creacion { get; set; }
        public Nullable<System.DateTime> fecha_Creacion { get; set; }
        public Nullable<int> usuario_Edicion { get; set; }
        public Nullable<System.DateTime> fecha_Edicion { get; set; }
        public string afectaStock_movimiento { get; set; }
    
        public virtual ICollection<tbl_Alm_Guias_Cab> tbl_Alm_Guias_Cab { get; set; }
        public virtual ICollection<Tbl_Fac_Facturas_Compras_cab> Tbl_Fac_Facturas_Compras_cab { get; set; }
    }
}
