using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Facturacion.Procesos
{
    public class Pedidos_E
    {
        public int id_Pedido_Cab { get; set; }
        public int id_empresa { get; set; }
        public int id_Local { get; set; }
        public int id_cliente { get; set; }
        public string Numero_Pedido { get; set; }
        public string codigoInterno_Suministro { get; set; }

        public string nroDoc_Cliente { get; set; }
        public string nombres_Cliente { get; set; }

        public int id_Almacen { get; set; }
        public string descripcion_Almacen { get; set; }
        public int id_TipoDocumento { get; set; }
        public string Descripcion_TipoDocumento { get; set; }
        public int id_PuntoVenta { get; set; }
        public string descripcion_PuntoVenta { get; set; }
        public string id_cuadrilla { get; set; }
        public int id_PersonalVendedor { get; set; }
        public string personal { get; set; }
        public int id_FormaPago { get; set; }
        public string condicionFacturacion { get; set; }
        public string id_moneda { get; set; }
        public string fechaEmision_Pedido_Cab { get; set; }
        public string tipoCambio_Pedido_Cab { get; set; }
        public string codigoInterno_Cliente { get; set; }
        public string cliente { get; set; }
        public string direccion_Pedido_Cab { get; set; }
        public string fechaEntrega_Pedido_Cab { get; set; }
        public string porcentajeIGV_Pedido_Cab { get; set; }
        public string imprimeGuiaRemision_Pedido_Cab { get; set; }
        public string observaciones_Pedido_Cab { get; set; }
        public int estado { get; set; }
        public int usuario_creacion { get; set; }
        public decimal Sub_Total_Pedido_Cab { get; set; }
        public decimal total_Igv_Pedido_Cab { get; set; }
        public decimal total_Neto_Pedido_Cab { get; set; }
        public string Numero_Documento { get; set; }
        public string fechaFactura_Pedido_Cab { get; set; }

        public int id_producto { get; set; }
        public string descripcion_producto { get; set; }
        public string codigoInterno { get; set; }

        public decimal precioventa_listaprecios { get; set; }
        public decimal aplicaDescuento { get; set; }
        public decimal porceDescuento { get; set; }

        public decimal Stock { get; set; }
        public string unidadMedida { get; set; }
        public string nombre_marcaproducto { get; set; }
        public string flag_cancelacion { get; set; }
        public decimal saldoCuenta { get; set; }
        public String TipoGuiaRemision { get; set; }
        public string flag_exonerada_igv { get; set; }
        public string flag_tipo_facturacion { get; set; }
        public string id_CanalNegocio { get; set; }
        public string movLote { get; set; }
        public string nroLote { get; set; }

        public string id_Anexos { get; set; }
        public string id_ZonaVta { get; set; }
        public string id_PersonalTransportista { get; set; }

        public string Id_Unidad { get; set; }
        public string factorVenta { get; set; }
        public string generaGuia { get; set; }

        public string fechaProduccion { get; set; }
        public string fechaVencimiento { get; set; }

        public string flag_DocManual { get; set; }

        public string fecha_creacion { get; set; }
        public string usuario_edicion { get; set; }
        public string fecha_edicion { get; set; }


    }

    public class Factura_E
    {
        public int id_Factura_Cab { get; set; }
        public int id_empresa { get; set; }
        public int id_Local { get; set; }
        public string Numero_Documento { get; set; }
        public string codigoInterno_Suministro { get; set; }
        public string nroDoc_Cliente { get; set; }
        public string nombres_Cliente { get; set; }
        public int id_Almacen { get; set; }
        public string descripcion_Almacen { get; set; }
        public int id_TipoDocumento { get; set; }
        public string Descripcion_TipoDocumento { get; set; }
        public int id_PuntoVenta { get; set; }
        public string descripcion_PuntoVenta { get; set; }
        public int id_cuadrilla { get; set; }
        public int id_PersonalVendedor { get; set; }
        public string personal { get; set; }
        public int id_FormaPago { get; set; }
        public string condicionFacturacion { get; set; }
        public int id_moneda { get; set; }
        public string fechaEmision_Factura_Cab { get; set; }
        public string tipoCambio_Factura_Cab { get; set; }
        public string codigoInterno_Cliente { get; set; }
        public string cliente { get; set; }
        public string direccion_Factura_Cab { get; set; }
        public string fechaEntrega_Factura_Cab { get; set; }
        public string porcentajeIGV_Factura_Cab { get; set; }
        public string observaciones_Factura_Cab { get; set; }
        public int estado { get; set; }
        public int usuario_creacion { get; set; }
        public decimal Sub_Total_Factura_Cab { get; set; }
        public decimal total_Igv_Factura_Cab { get; set; }
        public decimal total_Neto_Factura_Cab { get; set; }
        public string id_tipo_nc_nd { get; set; }

        public string serie_correlativo { get; set; }
        public string numero_correlativo { get; set; }
        public string flag_tipo_facturacion { get; set; }

        public string id_ZonaVta { get; set; }
        public string id_Anexo { get; set; }

        public string fecha_creacion { get; set; }
        public string usuario_edicion { get; set; }
        public string fecha_edicion { get; set; }


    }

    public class Detalle_Factura_E
    {
        public int id_Producto { get; set; }
        public decimal precio { get; set; }
        public decimal cantidad { get; set; }
        public decimal total { get; set; }
        public int usuario { get; set; }
        public int id_doc_ref { get; set; }
        public string tipoIGV_Sunat { get; set; }
    }

    public class Stock_Notas_Debito
    {
        public string id_Factura_Det { get; set; }
        public string id_Factura_Cab { get; set; }
        public string Item_Factura_Det { get; set; }
        public string id_Producto { get; set; }
        public string codigo1_Producto { get; set; }
        public string nombre_Producto { get; set; }
        public string nombre_UnidadMedida { get; set; }
        public string precioVenta_Factura_Det { get; set; }
        public string porcentajeDescuentoFactura_Det { get; set; }
        public string Descuento_Factura_Det { get; set; }
        public string cantidad_Factura_Det { get; set; }
        public string porcentajeIGV_Factura_Det { get; set; }
        public string total_Factura_Det { get; set; }
        public string nombre_marcaproducto { get; set; }
        public string stock { get; set; }
    }




}
