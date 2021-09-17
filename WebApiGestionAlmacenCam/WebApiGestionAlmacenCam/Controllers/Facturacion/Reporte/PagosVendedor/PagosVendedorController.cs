using Entidades;
using Negocio.Facturacion.Reporte;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiGestionAlmacenCam.Controllers.Facturacion.Reporte.PagosVendedor
{
  [EnableCors("*", "*", "*")]
    public class PagosVendedorController : ApiController
    {
      private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

      public object GetReportePagosVendedor(int opcion, string filtro)
      {
          db.Configuration.ProxyCreationEnabled = false;

          object resul = null;
          try
          {
              if (opcion == 1)
              {
                  string[] parametros = filtro.Split('|');
                  int id_cargo = Convert.ToInt32(parametros[0].ToString());

                  resul = (from c in db.tbl_Personal
                           where c.id_cargo_personal == id_cargo && c.estado == 1
                           select new
                           {
                               c.id_personal,
                               c.nroDoc_personal,
                               c.apellidos_personal,
                               c.nombres_personal
                           }).ToList();
              }
              else if (opcion == 2)
              {
                  string[] parametros = filtro.Split('|');

                  int id_vendedor = Convert.ToInt32(parametros[0].ToString());
                  string fecha_inicial = parametros[1].ToString();
                  string fecha_final = parametros[2].ToString();

                  PagosVendedor_BL obj_negocio = new PagosVendedor_BL();
                  resul = obj_negocio.Listando_PagosVendedor(id_vendedor, fecha_inicial, fecha_final);
              }
              else if (opcion == 3)
              {
                  string[] parametros = filtro.Split('|');

                    int tipo = Convert.ToInt32(parametros[0].ToString());
                    int id_busqueda = Convert.ToInt32(parametros[1].ToString());
                    String nro_Doc = parametros[2].ToString();
                    String fecha_inicial = parametros[3].ToString();
                    String fecha_final = parametros[4].ToString();
                    int idAnexo = Convert.ToInt32(parametros[5].ToString());
                    int idZonaVentas = Convert.ToInt32(parametros[6].ToString());

                    PagosVendedor_BL obj_negocio = new PagosVendedor_BL();
                  resul = obj_negocio.Listando_CierreVentas_vendedor(tipo, id_busqueda, nro_Doc, fecha_inicial, fecha_final, idAnexo, idZonaVentas);
              }
              else if (opcion == 4)
              {
                  string[] parametros = filtro.Split('|');
                  int idFactura = Convert.ToInt32(parametros[0].ToString());

                  PagosVendedor_BL obj_negocio = new PagosVendedor_BL();
                  resul = obj_negocio.get_ListaFotos(idFactura);
              }
              else if(opcion == 5)
                {
                    string[] parametros = filtro.Split('|');

                    int tipo = Convert.ToInt32(parametros[0].ToString());
                    int id_busqueda = Convert.ToInt32(parametros[1].ToString());
                    String nro_Doc = parametros[2].ToString();
                    String fecha_inicial = parametros[3].ToString();
                    String fecha_final = parametros[4].ToString();
                    int idAnexo = Convert.ToInt32(parametros[5].ToString());
                    int idZonaVentas = Convert.ToInt32(parametros[6].ToString());

                    PagosVendedor_BL obj_negocio = new PagosVendedor_BL();
                    resul = obj_negocio.Listando_PagosCliente(tipo, id_busqueda, nro_Doc, fecha_inicial, fecha_final, idAnexo, idZonaVentas);
              }
              else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');

                    int tipo = Convert.ToInt32(parametros[0].ToString());
                    int id_busqueda = Convert.ToInt32(parametros[1].ToString());
                    string nro_Doc = parametros[2].ToString();
                    string fecha_inicial = parametros[3].ToString();
                    string fecha_final = parametros[4].ToString();
                    int idAnexo = Convert.ToInt32(parametros[5].ToString());
                    int idZonaVentas = Convert.ToInt32(parametros[6].ToString());

                    PagosVendedor_BL obj_negocio = new PagosVendedor_BL();
                    resul = obj_negocio.generarReporte_cuentasCobrar(tipo, id_busqueda, nro_Doc, fecha_inicial, fecha_final, idAnexo, idZonaVentas);
               }
              else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    string filtroBusqueda = parametros[0].ToString();
                    int id_zona = Convert.ToInt32(parametros[1].ToString());

                    PagosVendedor_BL obj_negocio = new PagosVendedor_BL();
                    resul = obj_negocio.get_ayudaBusqueda(filtroBusqueda, id_zona);
              }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');

                    int tipo = Convert.ToInt32(parametros[0].ToString());
                    int id_busqueda = Convert.ToInt32(parametros[1].ToString());
                    string nro_Doc = parametros[2].ToString();
                    string fecha_inicial = parametros[3].ToString();
                    string fecha_final = parametros[4].ToString();
                    int idAnexo = Convert.ToInt32(parametros[5].ToString());
                    int idZonaVentas = Convert.ToInt32(parametros[6].ToString());

                    PagosVendedor_BL obj_negocio = new PagosVendedor_BL();
                    resul = obj_negocio.get_reporteEstadosDocumentoVentas(tipo, id_busqueda, nro_Doc, fecha_inicial, fecha_final, idAnexo, idZonaVentas);
                }
                else
              {
                  resul = "Opcion seleccionada invalida";
              }
          }
          catch (Exception ex)
          {
              resul = ex.Message;
          }
          return resul;
      }

    }
}
