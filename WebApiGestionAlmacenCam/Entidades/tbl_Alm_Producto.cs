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
    
    public partial class tbl_Alm_Producto
    {
        public tbl_Alm_Producto()
        {
            this.Tbl_Com_Pedidos_Det = new HashSet<Tbl_Com_Pedidos_Det>();
            this.Tbl_Fac_Facturas_Det = new HashSet<Tbl_Fac_Facturas_Det>();
            this.Tbl_Fac_Facturas_Compras_det = new HashSet<Tbl_Fac_Facturas_Compras_det>();
            this.Tbl_Fac_Facturas_Compras_det1 = new HashSet<Tbl_Fac_Facturas_Compras_det>();
            this.tbl_Alm_Guias_Det = new HashSet<tbl_Alm_Guias_Det>();
            this.tbl_Alm_Guias_Det1 = new HashSet<tbl_Alm_Guias_Det>();
            this.Tbl_Fac_Pedidos_Det = new HashSet<Tbl_Fac_Pedidos_Det>();
        }
    
        public int id_Producto { get; set; }
        public string codigo1_Producto { get; set; }
        public string codigo2_Producto { get; set; }
        public string CodigoBarra_Producto { get; set; }
        public string nombre_Producto { get; set; }
        public string descripcion_producto { get; set; }
        public Nullable<decimal> preciocompra_producto { get; set; }
        public Nullable<decimal> precioventa_producto { get; set; }
        public string abreviatura_Producto { get; set; }
        public Nullable<int> id_unidadMedida { get; set; }
        public string url_foto_Producto { get; set; }
        public Nullable<decimal> peso_Producto { get; set; }
        public Nullable<int> id_categoriaProducto { get; set; }
        public Nullable<int> id_lineaProducto { get; set; }
        public Nullable<int> id_subLineaProducto { get; set; }
        public Nullable<int> id_marcaProducto { get; set; }
        public Nullable<int> id_modeloProducto { get; set; }
        public Nullable<int> tiempoVida_Producto { get; set; }
        public Nullable<int> stockminimo_Producto { get; set; }
        public Nullable<decimal> factorMultiplicacion_Alm { get; set; }
        public Nullable<decimal> factorDivisor_Alm { get; set; }
        public Nullable<decimal> factorMultiplicacion_Vta { get; set; }
        public Nullable<decimal> factorDivisor_Vta { get; set; }
        public Nullable<int> estado { get; set; }
        public string usuario_Creacion { get; set; }
        public Nullable<System.DateTime> fecha_Creacion { get; set; }
        public string usuario_Edicion { get; set; }
        public Nullable<System.DateTime> fecha_Edicion { get; set; }
        public Nullable<decimal> precioMay_Menor { get; set; }
        public Nullable<decimal> precioMay_Mayor { get; set; }
        public Nullable<decimal> RangoCaja_Horizontal { get; set; }
        public Nullable<decimal> RangoCaja_Mayorista { get; set; }
        public Nullable<int> afectoIGV { get; set; }
        public Nullable<int> afectoISC { get; set; }
        public Nullable<int> aplicaDetraccion { get; set; }
        public Nullable<int> aplicaPercepcion { get; set; }
        public Nullable<int> movLote { get; set; }
        public Nullable<int> aplicaFecVence { get; set; }
        public Nullable<decimal> stockMinimo { get; set; }
        public Nullable<int> id_unidadMedida_Cobertura { get; set; }
        public Nullable<int> id_unidadMedida_Mayorista { get; set; }
        public Nullable<int> id_unidadMedida_General { get; set; }
        public Nullable<decimal> RangoCaja_Mayorista2 { get; set; }
    
        public virtual tbl_Alm_ProductoCategoria tbl_Alm_ProductoCategoria { get; set; }
        public virtual tbl_Alm_ProductoLinea tbl_Alm_ProductoLinea { get; set; }
        public virtual tbl_Alm_ProductoMarca tbl_Alm_ProductoMarca { get; set; }
        public virtual tbl_Alm_ProductoModeloMarca tbl_Alm_ProductoModeloMarca { get; set; }
        public virtual tbl_Alm_ProductoSubLinea tbl_Alm_ProductoSubLinea { get; set; }
        public virtual tbl_Alm_UnidadMedida tbl_Alm_UnidadMedida { get; set; }
        public virtual ICollection<Tbl_Com_Pedidos_Det> Tbl_Com_Pedidos_Det { get; set; }
        public virtual ICollection<Tbl_Fac_Facturas_Det> Tbl_Fac_Facturas_Det { get; set; }
        public virtual ICollection<Tbl_Fac_Facturas_Compras_det> Tbl_Fac_Facturas_Compras_det { get; set; }
        public virtual ICollection<Tbl_Fac_Facturas_Compras_det> Tbl_Fac_Facturas_Compras_det1 { get; set; }
        public virtual ICollection<tbl_Alm_Guias_Det> tbl_Alm_Guias_Det { get; set; }
        public virtual ICollection<tbl_Alm_Guias_Det> tbl_Alm_Guias_Det1 { get; set; }
        public virtual ICollection<Tbl_Fac_Pedidos_Det> Tbl_Fac_Pedidos_Det { get; set; }
    }
}
