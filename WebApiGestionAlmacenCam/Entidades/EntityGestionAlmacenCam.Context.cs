﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class CAMGestionAlmacenEntities : DbContext
    {
        public CAMGestionAlmacenEntities()
            : base("name=CAMGestionAlmacenEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<tbl_Alm_Almacen> tbl_Alm_Almacen { get; set; }
        public virtual DbSet<tbl_Alm_DetalleVentas> tbl_Alm_DetalleVentas { get; set; }
        public virtual DbSet<tbl_Alm_Movimientos> tbl_Alm_Movimientos { get; set; }
        public virtual DbSet<tbl_Alm_ProductoCategoria> tbl_Alm_ProductoCategoria { get; set; }
        public virtual DbSet<tbl_Alm_ProductoLinea> tbl_Alm_ProductoLinea { get; set; }
        public virtual DbSet<tbl_Alm_ProductoMarca> tbl_Alm_ProductoMarca { get; set; }
        public virtual DbSet<tbl_Alm_ProductoModeloMarca> tbl_Alm_ProductoModeloMarca { get; set; }
        public virtual DbSet<tbl_Alm_ProductoSubLinea> tbl_Alm_ProductoSubLinea { get; set; }
        public virtual DbSet<tbl_Alm_Transferencia_Cab> tbl_Alm_Transferencia_Cab { get; set; }
        public virtual DbSet<tbl_Alm_UnidadMedida> tbl_Alm_UnidadMedida { get; set; }
        public virtual DbSet<Tbl_Cargo> Tbl_Cargo { get; set; }
        public virtual DbSet<Tbl_Clientes_Fotos> Tbl_Clientes_Fotos { get; set; }
        public virtual DbSet<Tbl_Clientes_Programados> Tbl_Clientes_Programados { get; set; }
        public virtual DbSet<tbl_Com_Canales_Negocio> tbl_Com_Canales_Negocio { get; set; }
        public virtual DbSet<tbl_Com_Cliente> tbl_Com_Cliente { get; set; }
        public virtual DbSet<tbl_Com_Cliente_Credito> tbl_Com_Cliente_Credito { get; set; }
        public virtual DbSet<tbl_Com_CondicionFacturacion> tbl_Com_CondicionFacturacion { get; set; }
        public virtual DbSet<Tbl_Com_Facturas_Cab> Tbl_Com_Facturas_Cab { get; set; }
        public virtual DbSet<tbl_Com_FormaPago> tbl_Com_FormaPago { get; set; }
        public virtual DbSet<tbl_Com_Giros_Negocio> tbl_Com_Giros_Negocio { get; set; }
        public virtual DbSet<tbl_Com_Pedidos_Cab> tbl_Com_Pedidos_Cab { get; set; }
        public virtual DbSet<Tbl_Com_Pedidos_Det> Tbl_Com_Pedidos_Det { get; set; }
        public virtual DbSet<tbl_Com_PuntoVenta> tbl_Com_PuntoVenta { get; set; }
        public virtual DbSet<tbl_Com_TipoDocumento> tbl_Com_TipoDocumento { get; set; }
        public virtual DbSet<Tbl_Cuadrilla_Personal> Tbl_Cuadrilla_Personal { get; set; }
        public virtual DbSet<Tbl_Cuadrillas> Tbl_Cuadrillas { get; set; }
        public virtual DbSet<tbl_Definicion_Opciones> tbl_Definicion_Opciones { get; set; }
        public virtual DbSet<Tbl_Distritos> Tbl_Distritos { get; set; }
        public virtual DbSet<tbl_Empresas> tbl_Empresas { get; set; }
        public virtual DbSet<TBL_EstadoCelular> TBL_EstadoCelular { get; set; }
        public virtual DbSet<tbl_Estados> tbl_Estados { get; set; }
        public virtual DbSet<Tbl_Fac_Facturas_Det> Tbl_Fac_Facturas_Det { get; set; }
        public virtual DbSet<Tbl_Fac_FormaPago> Tbl_Fac_FormaPago { get; set; }
        public virtual DbSet<tbl_Fac_ListaPrecios> tbl_Fac_ListaPrecios { get; set; }
        public virtual DbSet<Tbl_Fac_PuntosVenta> Tbl_Fac_PuntosVenta { get; set; }
        public virtual DbSet<Tbl_Fac_PuntosVenta_Series> Tbl_Fac_PuntosVenta_Series { get; set; }
        public virtual DbSet<tbl_fac_tipo_NC_ND_electronico> tbl_fac_tipo_NC_ND_electronico { get; set; }
        public virtual DbSet<tbl_GiroNegocio> tbl_GiroNegocio { get; set; }
        public virtual DbSet<Tbl_GrupoTabla_Cab> Tbl_GrupoTabla_Cab { get; set; }
        public virtual DbSet<Tbl_GrupoTabla_Det> Tbl_GrupoTabla_Det { get; set; }
        public virtual DbSet<tbl_Locales> tbl_Locales { get; set; }
        public virtual DbSet<TBL_MATERIALES_STOCK_AYUDA> TBL_MATERIALES_STOCK_AYUDA { get; set; }
        public virtual DbSet<tbl_Moneda> tbl_Moneda { get; set; }
        public virtual DbSet<tbl_MotivosAnulacion> tbl_MotivosAnulacion { get; set; }
        public virtual DbSet<TBL_Operarios_RegistroGPS> TBL_Operarios_RegistroGPS { get; set; }
        public virtual DbSet<TBL_Parametros> TBL_Parametros { get; set; }
        public virtual DbSet<tbl_Personal> tbl_Personal { get; set; }
        public virtual DbSet<tbl_serie_local> tbl_serie_local { get; set; }
        public virtual DbSet<tbl_TipoCambio> tbl_TipoCambio { get; set; }
        public virtual DbSet<Tbl_TipoDocumentos> Tbl_TipoDocumentos { get; set; }
        public virtual DbSet<tbl_Ubigeos> tbl_Ubigeos { get; set; }
        public virtual DbSet<tbl_Usuarios> tbl_Usuarios { get; set; }
        public virtual DbSet<tbl_Vehiculo> tbl_Vehiculo { get; set; }
        public virtual DbSet<tbl_vendedor> tbl_vendedor { get; set; }
        public virtual DbSet<tbl_Web_Aceesos> tbl_Web_Aceesos { get; set; }
        public virtual DbSet<Versiones> Versiones { get; set; }
        public virtual DbSet<Tbl_Com_Facturas_Det> Tbl_Com_Facturas_Det { get; set; }
        public virtual DbSet<tbl_numero_correlativo> tbl_numero_correlativo { get; set; }
        public virtual DbSet<tbl_Perfil> tbl_Perfil { get; set; }
        public virtual DbSet<tbl_Ubigeo> tbl_Ubigeo { get; set; }
        public virtual DbSet<tbl_Usuarios_Almacen> tbl_Usuarios_Almacen { get; set; }
        public virtual DbSet<tbl_Usuarios_Locales> tbl_Usuarios_Locales { get; set; }
        public virtual DbSet<tbl_Alm_Producto> tbl_Alm_Producto { get; set; }
        public virtual DbSet<Tbl_Clientes> Tbl_Clientes { get; set; }
        public virtual DbSet<tbl_Promocion_Productos> tbl_Promocion_Productos { get; set; }
        public virtual DbSet<tbl_Promocion_Productos_Configuracion> tbl_Promocion_Productos_Configuracion { get; set; }
        public virtual DbSet<tbl_Anexos> tbl_Anexos { get; set; }
        public virtual DbSet<tbl_Zonas_Venta> tbl_Zonas_Venta { get; set; }
        public virtual DbSet<tbl_Transportista> tbl_Transportista { get; set; }
        public virtual DbSet<tbl_Promocion_Canasta> tbl_Promocion_Canasta { get; set; }
        public virtual DbSet<tbl_Promocion_Canasta_Det> tbl_Promocion_Canasta_Det { get; set; }
        public virtual DbSet<tbl_Alm_Proveedor> tbl_Alm_Proveedor { get; set; }
        public virtual DbSet<Tbl_Fac_Facturas_Compras_det> Tbl_Fac_Facturas_Compras_det { get; set; }
        public virtual DbSet<Tbl_Com_Facturas_Cancelacion_Cab> Tbl_Com_Facturas_Cancelacion_Cab { get; set; }
        public virtual DbSet<tbl_Ruta_Venta> tbl_Ruta_Venta { get; set; }
        public virtual DbSet<Tbl_Fac_Facturas_Cab> Tbl_Fac_Facturas_Cab { get; set; }
        public virtual DbSet<Tbl_Fac_Pedidos_Cab> Tbl_Fac_Pedidos_Cab { get; set; }
        public virtual DbSet<tbl_Alm_Guias_Det> tbl_Alm_Guias_Det { get; set; }
        public virtual DbSet<tbl_Alm_Guias_Cab> tbl_Alm_Guias_Cab { get; set; }
        public virtual DbSet<Tbl_Bancos> Tbl_Bancos { get; set; }
        public virtual DbSet<tbl_ArqueoCaja_Cab> tbl_ArqueoCaja_Cab { get; set; }
        public virtual DbSet<tbl_ArqueoCaja_Cobranza> tbl_ArqueoCaja_Cobranza { get; set; }
        public virtual DbSet<tbl_ArqueoCaja_Devolucion> tbl_ArqueoCaja_Devolucion { get; set; }
        public virtual DbSet<tbl_ArqueoCaja_Moneda> tbl_ArqueoCaja_Moneda { get; set; }
        public virtual DbSet<tbl_ArqueoCaja_Ventas> tbl_ArqueoCaja_Ventas { get; set; }
        public virtual DbSet<tbl_BilleteMoneda> tbl_BilleteMoneda { get; set; }
        public virtual DbSet<Tbl_Fac_Pedidos_Det> Tbl_Fac_Pedidos_Det { get; set; }
        public virtual DbSet<tbl_ArqueoCaja_Depositos> tbl_ArqueoCaja_Depositos { get; set; }
        public virtual DbSet<tbl_ArqueoCaja_PagoProveedor> tbl_ArqueoCaja_PagoProveedor { get; set; }
        public virtual DbSet<tbl_ArqueoCaja_Egresos> tbl_ArqueoCaja_Egresos { get; set; }
        public virtual DbSet<Tbl_Fac_Facturas_Compras_cab> Tbl_Fac_Facturas_Compras_cab { get; set; }
        public virtual DbSet<tbl_Alm_Transferencia_Det> tbl_Alm_Transferencia_Det { get; set; }
    }
}