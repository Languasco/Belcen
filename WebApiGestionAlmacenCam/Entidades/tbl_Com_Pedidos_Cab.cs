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
    
    public partial class tbl_Com_Pedidos_Cab
    {
        public int id_Pedido_Cab { get; set; }
        public Nullable<int> id_empresa { get; set; }
        public string numero_pedido { get; set; }
        public Nullable<int> id_cliente { get; set; }
        public Nullable<int> id_almacen { get; set; }
        public Nullable<int> id_TipoDocumento { get; set; }
        public Nullable<int> id_PuntoVenta { get; set; }
        public Nullable<int> id_Personal { get; set; }
        public Nullable<int> id_CondicionFacturacion { get; set; }
        public Nullable<int> id_moneda { get; set; }
        public Nullable<System.DateTime> fechaEmision_Pedido_Cab { get; set; }
        public Nullable<decimal> tipoCambio_Pedido_Cab { get; set; }
        public string direccion_Pedido_Cab { get; set; }
        public Nullable<System.DateTime> fechaEntrega_Pedido_Cab { get; set; }
        public Nullable<decimal> porcentajeIGV_Pedido_Cab { get; set; }
        public string imprimeGuiaRemision_Pedido_Cab { get; set; }
        public string obs_Pedido_Cab { get; set; }
        public string latitud_Pedido_Cab { get; set; }
        public string longitud_Pedido_Cab { get; set; }
        public Nullable<decimal> Sub_Total_Pedido_Cab { get; set; }
        public Nullable<decimal> total_Igv_Pedido_Cab { get; set; }
        public Nullable<decimal> total_neto_Pedido_Cab { get; set; }
        public string numero_documento { get; set; }
        public Nullable<System.DateTime> fechaFacturacion_Pedido_Cab { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_creacion { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
        public Nullable<int> usuario_edicion { get; set; }
        public Nullable<System.DateTime> fecha_edicion { get; set; }
    
        public virtual tbl_Alm_Almacen tbl_Alm_Almacen { get; set; }
        public virtual tbl_Com_Cliente tbl_Com_Cliente { get; set; }
        public virtual tbl_Empresas tbl_Empresas { get; set; }
    }
}
