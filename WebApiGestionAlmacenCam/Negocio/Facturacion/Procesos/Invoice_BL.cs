using Entidades.Facturacion.Procesos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Facturacion.Procesos
{
    public class Invoice_BL
    { 
            public string operacion { get; set; }
            public int tipo_de_comprobante { get; set; }
            public string serie { get; set; }
            public int numero { get; set; }
            public int sunat_transaction { get; set; }
            public int cliente_tipo_de_documento { get; set; }
            public string cliente_numero_de_documento { get; set; }
            public string cliente_denominacion { get; set; }
            public string cliente_direccion { get; set; }
            public string cliente_email { get; set; }
            public string cliente_email_1 { get; set; }
            public string cliente_email_2 { get; set; }
            public string fecha_de_emision { get; set; }
            public string fecha_de_vencimiento { get; set; }
            public int moneda { get; set; }
            public dynamic tipo_de_cambio { get; set; } //? MAKES NATURAL TYPES NULLABLE
            public double porcentaje_de_igv { get; set; }
            public dynamic descuento_global { get; set; }
            public dynamic total_descuento { get; set; }
            public dynamic total_anticipo { get; set; }
            public dynamic total_gravada { get; set; }
            public dynamic total_inafecta { get; set; }
            public dynamic total_exonerada { get; set; }
            public double total_igv { get; set; }
            public dynamic total_gratuita { get; set; }
            public dynamic total_otros_cargos { get; set; }
            public double total { get; set; }
            public dynamic percepcion_tipo { get; set; }
            public dynamic percepcion_base_imponible { get; set; }
            public dynamic total_percepcion { get; set; }
            public dynamic total_incluido_percepcion { get; set; }
        //public bool detraccion { get; set; }
            public string detraccion { get; set; }
            public string observaciones { get; set; }
            public dynamic documento_que_se_modifica_tipo { get; set; }
            public string documento_que_se_modifica_serie { get; set; }
            public dynamic documento_que_se_modifica_numero { get; set; }
            public dynamic tipo_de_nota_de_credito { get; set; }
            public dynamic tipo_de_nota_de_debito { get; set; }
        //public bool enviar_automaticamente_a_la_sunat { get; set; }
        //public bool enviar_automaticamente_al_cliente { get; set; }

        public string enviar_automaticamente_a_la_sunat { get; set; }
        public string enviar_automaticamente_al_cliente { get; set; }

        public string codigo_unico { get; set; }
            public string condiciones_de_pago { get; set; }
            public string medio_de_pago { get; set; }
            public string placa_vehiculo { get; set; }
            public string orden_compra_servicio { get; set; }
            public string tabla_personalizada_codigo { get; set; }
            public string formato_de_pdf { get; set; }
            public List<Items_E> items { get; set; }
            public List<Items_E> guias { get; set; }
 
    }
}
