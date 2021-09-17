using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Facturacion.Procesos
{
    public class CancelacionDocumentosVendedor_E
    {
        public bool checkeado { get; set; } 
          public int  id_Factura_Cab { get; set; }
          public string  nombres_Cliente { get; set; }
          public string  fecha_doc { get; set; }
          public string  nro_documento { get; set; }
          public decimal total { get; set; }
          public decimal cuenta { get; set; }
          public decimal pago { get; set; }
          public decimal deuda { get; set; }
    }

    public class GeneracionDocumentos
    {
        public int id_PuntoVenta { get; set; }
        public int id_vendedor { get; set; }
        public string  fecha_emision { get; set; }

        public int id_TipoDocumento { get; set; }
        public int id_tipo_factura { get; set; }
        public string des_tipo_factura { get; set; }
        public int cant_pedidos { get; set; }
        public int nro_serie { get; set; }
        public int nro_inicial { get; set; }
        public int nro_final { get; set; }
        public string placa { get; set; }
        public bool indic_guia { get; set; }

    }
    
    public class DocumentosImprimir
    {

        public string IDCAB { get; set; }
        public string FECHA{ get; set; }
        public string PAGO{ get; set; }
        public string FECHAVEN{ get; set; }
        public string EMPRESA{ get; set; }
        public string DIRECCION { get; set; }
        public string RUC{ get; set; }
        public string GUIA{ get; set; }

        public string NRO_DOC { get; set; }
        public string CODIGO_PROD { get; set; }

        public string NOMBRE_PRODUCTO{ get; set; }
        public string CANTIDAD{ get; set; }
        public string IMPORTE { get; set; }
        public string UNIDAD { get; set; }
        public string TIPODOC { get; set; }
        public string PRECIO { get; set; }    
        public string OBSERVACION { get; set; }
        public string CODIGO_RQ { get; set; }

        public string RUC_EMPRESA_EMITE { get; set; }
        public string RAZON_SOCIAL_EMITE { get; set; }
        public string DEPARTAMENTO_EMITE { get; set; }

        public string PROVINCIA_EMITE { get; set; }
        public string DISTRITO_EMITE { get; set; }
        public string CALLE_EMITE { get; set; }

        public string CODIGO_OPERACION { get; set; }
        public string DESCRIPCION_OPERACION { get; set; }
        public string NRO_DOC_REF { get; set; }

        public string TIPODOC_REF { get; set; }
        public string FECHA_REF { get; set; }
        public string FLAG_EXONERA { get; set; }
        public string FLAG_TIPO_FACTURACION { get; set; }
        
    }


    public class DocumentosImprimir_masivo
    {
        public string idCab { get; set; }
        public string empresaTitulo { get; set; }
        public string descripcionEmpresa { get; set; }
        public string telefonoEmpresa { get; set; }
        public string emailEmpresa { get; set; }
        public string rucEmpresa { get; set; }
        public string nroDocEmpresa { get; set; }
        public string nombreCliente { get; set; }
        public string direccionCliente { get; set; }
        public string direccionEnvioCliente { get; set; }
        public string rucDniCliente { get; set; }
        public string codigoCliente { get; set; }
        public string moneda { get; set; }
        public string emision { get; set; }
        public string vencimiento { get; set; }
        public string condicion { get; set; }
        public string hora { get; set; }
        public string referencia { get; set; }
        public string vendedor { get; set; }
        public string celular { get; set; }
        public string codigoProducto { get; set; }
        public string descripcionProducto { get; set; }
        public string cantidadProducto { get; set; }
        public string unidad { get; set; }
        public string precio { get; set; }
        public string importeItem { get; set; }
        public string codigo_rq { get; set; }
        public string codigo_rq_base64 { get; set; }
        public string descripcionComprobante { get; set; }

        public string subTotal { get; set; }
        public string descuentoTotal { get; set; }
        public string operacionGrabada { get; set; }
        public string operacionExonerada { get; set; }
        public string operacionInafecta { get; set; }
        public string igv { get; set; }
        public string importeTotal { get; set; }

        public string direccionEmpresa { get; set; }
        public string sucursalEmpresa1 { get; set; }
        public string sucursalEmpresa2 { get; set; }
        public string sucursalEmpresa3 { get; set; }
        public string sucursalEmpresa4 { get; set; }

        public string factura_electronica_QR { get; set; }
        public string factura_electronica_alertas { get; set; }
    }





    public class Documentos_Electronicos
    {
        public string idcab { get; set; }
        public string nro_doc { get; set; }
        public string serie_doc { get; set; }
        public string observacion_anulacion { get; set; }

        public string cod_identificacion { get; set; }
        public string fecha_emision { get; set; }
        public string fecha_vencimiento { get; set; }        
        public string hora_emision { get; set; }
        public string tipo_doc_sunat { get; set; }
        public string tipo_moneda_sunat { get; set; }
        public string ruc_empresa_emite { get; set; }
        public string razon_social_emite { get; set; }
        public string tipo_doc_identidad_emite { get; set; }
        public string razon_social_receptora { get; set; }
        public string ruc_empresa_receptora { get; set; }
        public string tipo_doc_identidad_receptora { get; set; }
        public string monto_total_igv { get; set; }
        public string monto_total_inafecto { get; set; }
        public string monto_sub_total { get; set; }
        public string monto_total { get; set; }
        public string cantidad { get; set; }
        public string cod_unidad_sunat { get; set; }
        public string precio_venta { get; set; }

        public string monto_total_igv_det { get; set; }
        public string monto_sub_total_det { get; set; }
        public string monto_total_det { get; set; }
        public string codigo_producto { get; set; }
        public string nombre_producto { get; set; }
        public string nombreArchivo { get; set; }

        public string codigo_operacion { get; set; }
        public string descripcion_operacion { get; set; }
        public string nro_doc_ref { get; set; }
        public string identificador { get; set; }
        public string identificador_tipoDoc { get; set; }
        public string cod_unidad { get; set; }

        public string departamento_emite { get; set; } 
        public string provincia_emite { get; set; } 
        public string distrito_emite { get; set; } 
        public string calle_emite { get; set; } 

        public string departamento_receptora { get; set; } 
        public string provincia_receptora { get; set; } 
        public string distrito_receptora { get; set; } 
        public string calle_receptora { get; set; } 
        public string correo_receptora { get; set; }

        public string codigo_tipo_oper { get; set; }
        public string cod_establecimiento { get; set; }
        public string fecha_ref { get; set; }

        public string id_TipoDocumento { get; set; }
        public string Descripcion_TipoDocumento { get; set; }
        public string Numero_Documento { get; set; }

        public string cod_tributo { get; set; }
        public string nom_tributo { get; set; }
        public string tipo_tributo { get; set; }

        public string porc_igv { get; set; }
        public string cod_impuesto { get; set; }

    }



    public class Pedidos_Cab
    {
        public int id_Pedido_Cab { get; set; }         
        public string  Numero_Pedido { get; set; } 
        public int  id_Almacen { get; set; } 
        public string  descripcion_Almacen { get; set; }
        public string formaPago { get; set; } 
        public string  fecha_emision { get; set; } 
        public string  nombres_Cliente { get; set; } 
        public string  direccion_Pedido_Cab { get; set; }
        public string observaciones_Pedido_Cab { get; set; }
        public bool checkeado_guia { get; set; }
        public bool checkeado_pedido { get; set; } 
    }


    public class Pedidos_Det
    {
           public int  id_Pedido_Det { get; set; }
           public string  Numero_Pedido { get; set; }
           public int  id_Producto { get; set; }
           public string  codigo1_Producto { get; set; }
           public string  nombre_Producto { get; set; }
           public string  abreviatura_UnidadMedida { get; set; }
           public string  nombre_marcaproducto { get; set; }
           public decimal cantidad_Pedido_Det { get; set; }
           public decimal precioVenta_Pedido_Det { get; set; }
           public decimal total_Pedido_Det { get; set; }

    }

    public class Documentos_Electronicos_Det
    {
        public string idcab { get; set; }
        public string cantidad { get; set; }
        public string cod_unidad_sunat { get; set; }
        public string monto_total_igv_det { get; set; }
        public string monto_sub_total_det { get; set; }
        public string monto_total_det { get; set; }
        public string codigo_producto { get; set; }
        public string nombre_producto { get; set; }
    }

    public class Documentos_Electronicos_Cab
    {
        public string idcab { get; set; }
        public string nro_doc { get; set; }
        public string fecha_emision { get; set; }
        public string hora_emision { get; set; }
        public string tipo_doc_sunat { get; set; }
        public string tipo_moneda_sunat { get; set; }
        public string ruc_empresa_emite { get; set; }
        public string razon_social_emite { get; set; }
        public string tipo_doc_identidad_emite { get; set; }
        public string razon_social_receptora { get; set; }
        public string ruc_empresa_receptora { get; set; }
        public string tipo_doc_identidad_receptora { get; set; }
        public string monto_total_igv { get; set; }
        public string monto_total_inafecto { get; set; }
        public string monto_sub_total { get; set; }
        public string monto_total { get; set; }
        public List<Documentos_Electronicos_Det> listaDetalle { get; set; }   
    }



}
