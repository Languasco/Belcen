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
    
    public partial class Tbl_Com_Facturas_Cancelacion_Cab
    {
        public int id_cancelacion_cab { get; set; }
        public string cod_ref { get; set; }
        public Nullable<int> id_factura_cab { get; set; }
        public Nullable<int> id_cliente { get; set; }
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
        public string cod_masivo { get; set; }
        public Nullable<int> idCobradorVendedor { get; set; }
        public Nullable<int> idCobradorTransportista { get; set; }
        public Nullable<int> usuario_genera { get; set; }
        public Nullable<System.DateTime> fecha_genera { get; set; }
    }
}
