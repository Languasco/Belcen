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
    
    public partial class Tbl_Fac_Compras_Cancelacion_Cab
    {
        public int id_cancelacion_cab { get; set; }
        public Nullable<int> id_factura_Compra_cab { get; set; }
        public Nullable<int> PagoMasivo { get; set; }
        public Nullable<int> id_Proveedor { get; set; }
        public Nullable<System.DateTime> fecha_cancelacion_movil { get; set; }
        public Nullable<System.DateTime> fecha_cancelacion_servidor { get; set; }
        public Nullable<decimal> totalpago { get; set; }
        public Nullable<decimal> pago_factura { get; set; }
        public Nullable<System.DateTime> fecha_operacion { get; set; }
        public string nro_operacion { get; set; }
        public Nullable<int> id_banco { get; set; }
        public Nullable<int> id_formaPago { get; set; }
        public Nullable<int> conformidad_Cancelacion { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> id_usuario_anulacion { get; set; }
        public Nullable<System.DateTime> fecha_anulacion { get; set; }
        public string url_foto_Pago { get; set; }
        public string nro_recibo { get; set; }
        public Nullable<int> usuario_genera { get; set; }
        public Nullable<System.DateTime> fecha_genera { get; set; }
    }
}
