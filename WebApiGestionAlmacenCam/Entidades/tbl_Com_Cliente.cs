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
    
    public partial class tbl_Com_Cliente
    {
        public tbl_Com_Cliente()
        {
            this.tbl_Com_Pedidos_Cab = new HashSet<tbl_Com_Pedidos_Cab>();
            this.Tbl_Fac_Facturas_Compras_cab = new HashSet<Tbl_Fac_Facturas_Compras_cab>();
        }
    
        public int id_cliente { get; set; }
        public string codigo_cliente { get; set; }
        public string tipoDocumento { get; set; }
        public string nroDocumento { get; set; }
        public string razonSocial_Cliente { get; set; }
        public string razonComercial_Cliente { get; set; }
        public string contacto_Cliente { get; set; }
        public Nullable<int> id_GiroNegocio { get; set; }
        public Nullable<int> id_CanalNegocio { get; set; }
        public string direccion_Cliente { get; set; }
        public Nullable<int> id_ubigeo { get; set; }
        public string referencia_Cliente { get; set; }
        public string direccionEntrega_Cliente { get; set; }
        public Nullable<int> id_ubigeoEntrega { get; set; }
        public string referenciaEntrega_Cliente { get; set; }
        public string telefono1_Cliente { get; set; }
        public string telefono2_Cliente { get; set; }
        public string email_Cliente { get; set; }
        public Nullable<decimal> importeMaximoCredito_Cliente { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_Creacion { get; set; }
        public Nullable<System.DateTime> fecha_Creacion { get; set; }
        public Nullable<int> usuario_Edicion { get; set; }
        public Nullable<System.DateTime> fecha_Edicion { get; set; }
    
        public virtual tbl_Com_Canales_Negocio tbl_Com_Canales_Negocio { get; set; }
        public virtual tbl_Com_Giros_Negocio tbl_Com_Giros_Negocio { get; set; }
        public virtual ICollection<tbl_Com_Pedidos_Cab> tbl_Com_Pedidos_Cab { get; set; }
        public virtual ICollection<Tbl_Fac_Facturas_Compras_cab> Tbl_Fac_Facturas_Compras_cab { get; set; }
    }
}
