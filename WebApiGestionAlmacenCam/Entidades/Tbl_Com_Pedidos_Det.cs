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
    
    public partial class Tbl_Com_Pedidos_Det
    {
        public int id_Pedido_Det { get; set; }
        public Nullable<int> id_Pedido_Cab { get; set; }
        public Nullable<int> item_Pedido_Det { get; set; }
        public Nullable<int> id_Producto { get; set; }
        public Nullable<decimal> precioVenta_Pedido_Det { get; set; }
        public Nullable<decimal> porcentajeDescuento_Pedido_Det { get; set; }
        public Nullable<decimal> Descuento_Pedido_Det { get; set; }
        public Nullable<decimal> cantidad_Pedido_Det { get; set; }
        public Nullable<decimal> porcentajeIGV_Pedido_Det { get; set; }
        public Nullable<decimal> total_Pedido_Det { get; set; }
        public string Numero_Pedido { get; set; }
    
        public virtual tbl_Alm_Producto tbl_Alm_Producto { get; set; }
    }
}
