using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Facturacion.Procesos
{
   public  class DocumentoVenta_E
    {


        
       public string Classdisabled { get; set; } 
       public bool disabled { get; set; } 
       public bool checkeado { get; set; } 
        public int id_Pedido_Cab { get; set; } 
        public int id_empresa { get; set; } 
        public string Numero_Pedido { get; set; } 
        public int id_Almacen { get; set; } 
        public int id_TipoDocumento { get; set; }
        public int id_PuntoVenta { get; set; } 
        public int id_cuadrilla { get; set; } 
        public int id_PersonalVendedor { get; set; } 
        public int id_FormaPago { get; set; } 
        public int id_moneda { get; set; } 
        public string fechaEmision_Pedido_Cab { get; set; } 
        public decimal  tipoCambio_Pedido_Cab { get; set; } 
        public int id_cliente { get; set; }
        public string nombre_cliente { get; set; } 
        public string nombredocumento { get; set; } 
        public string direccion_Pedido_Cab { get; set; } 
        public string fechaEntrega_Pedido_Cab { get; set; } 
        public decimal  porcentajeIGV_Pedido_Cab { get; set; } 
        public string imprimeGuiaRemision_Pedido_Cab { get; set; } 
        public string observaciones_Pedido_Cab { get; set; } 
        public string latitud_Pedido_Cab { get; set; } 
        public string longitud_Pedido_Cab { get; set; } 
        public int estado { get; set; } 
        public int usuario_creacion { get; set; } 
        public string vendedor { get; set; } 
        public decimal Sub_Total_Pedido_Cab { get; set; } 
        public decimal total_Igv_Pedido_Cab { get; set; } 
        public decimal total_Neto_Pedido_Cab { get; set; } 
        public string  Numero_Documento  { get; set; } 
    }

    public class anularDocumento
    {
        public int id_zonaVenta { get; set; }
        public int id_almacen { get; set; }
        public int id_anexo { get; set; }
        public int id_tipoDoc { get; set; }
        public string serie { get; set; }
        public string numero { get; set; }
        public int id_usuario { get; set; }
    }
}
