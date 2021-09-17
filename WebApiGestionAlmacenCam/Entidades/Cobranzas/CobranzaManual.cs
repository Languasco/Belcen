using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Cobranzas
{
    public class CobranzaManual
    {
        public int id_empresa { get; set; }
        public string Numero_Documento { get; set; }
        public int id_TipoDocumento { get; set; }
        public int id_puntoventa { get; set; }
        public int id_formapago { get; set; }
        public int diasvencimiento_factura_cab { get; set; }
        public int id_moneda { get; set; }
        public decimal tipocambio_factura_cab { get; set; }
        public int id_cuadrilla { get; set; }
        public int id_personalvendedor { get; set; }
        public string fechaemision_factura_cab { get; set; }
        public int id_cliente { get; set; }
        public string direccion_factura_cab { get; set; }
        public string fechaentrega_factura_cab { get; set; }
        public decimal porcentajeigv_factura_cab { get; set; }
        public string imprimeguiaremision_factura_cab { get; set; }
        public string observaciones_factura_cab { get; set; }
        public decimal sub_total_factura_cab { get; set; }
        public decimal total_igv_factura_cab { get; set; }
        public decimal total_neto_factura_cab { get; set; }
        public int id_pedido_cab { get; set; }
        public int id_almacen { get; set; }
        public int id_guia_cab { get; set; }
        public string numero_guia_cab { get; set; }
        public decimal total_pagos_factura_cab { get; set; }
        public decimal total_notacredito_factura_cab { get; set; }
        public string fechacancelacion_factura_cab { get; set; }
        public string fechaultimopago_factura_cab { get; set; }
        public int id_motivoanulacion { get; set; }
        public int estado { get; set; }
        public int usuario_creacion { get; set; }
        public int usuario_edicion { get; set; }
        public string codigointerno_cliente { get; set; }
        public string flag_impresion_factura_cab { get; set; }
        public string codigointerno_suministro { get; set; }
        public string factura_electronica_cdr { get; set; }
        public string factura_electronica_xml { get; set; }
        public string factura_electronica_pdf { get; set; }
        public string factura_electronica_qr { get; set; }
        public int id_tipo_nc_nd { get; set; }
        public int id_factura_cab_referencia { get; set; }
        public string afectostock { get; set; }
        public string factura_electronica_alertas { get; set; }
        public string flag_exonerada_igv { get; set; }
    public string flag_tipo_facturacion { get; set; }
    public string nro_serie { get; set; }
        public string numero { get; set; }
        public int id_anexo { get; set; }
public int id_transportista { get; set; }
        public int id_zonavta { get; set; }
        public string flag_docmanual { get; set; }
        public decimal cliente_tipo_sunat { get; set; }
        public decimal total_gravada_cab { get; set; }
        public decimal total_exonerada_cab { get; set; }
        public decimal total_inafecta_cab { get; set; }
        public decimal total_gratuita_cab { get; set; }
        public string desdocu_asunat { get; set; }
        public int generaguia { get; set; }

    }
}
