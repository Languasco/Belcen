using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Entidades;
using Entidades.Proceso;
using System.Web.Script.Serialization;
using System.Web.Http.Cors;


namespace WebApiGestionAlmacenCam.Controllers.Facturacion.Procesos.ListaPrecios
{
        [EnableCors("*", "*", "*")]
    public class tblFac_ListaPreciosController : ApiController
    {
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();
        JavaScriptSerializer serializer;

        // GET: api/tblFac_ListaPrecios
        public IQueryable<tbl_Fac_ListaPrecios> Gettbl_Fac_ListaPrecios()
        {
            return db.tbl_Fac_ListaPrecios;
        }

        // GET: api/tblFac_ListaPrecios/5

        public object Gettbl_Fac_ListaPrecios(int condicion, string parametros)
        {
            db.Configuration.ProxyCreationEnabled = false;

            var list = new object();
            if (condicion == 1)
            {
                ListaPrecio oListaPrecio = new ListaPrecio();
                serializer = new JavaScriptSerializer();
                oListaPrecio = serializer.Deserialize<ListaPrecio>(parametros);

                list = (from a in db.tbl_Fac_ListaPrecios
                        join b in db.tbl_Alm_Producto on a.id_Producto equals b.id_Producto
                        join c in db.tbl_Alm_ProductoCategoria on  b.id_categoriaProducto equals c.id_categoriaProducto
                        join d in db.tbl_Alm_ProductoMarca on b.id_marcaProducto equals d.id_marcaProducto
                        where c.id_categoriaProducto == oListaPrecio.categoria && a.id_CanalNegocio == oListaPrecio.canalNegocio
                        select new
                        {
                            id_Producto = a.id_Producto ,
                            id_listaPrecio = a.id_listaPrecios,
                            codigo = b.codigo1_Producto ,
                            categoria = c.nombre_Categoria,
                            descripcion = b.nombre_Producto ,
                            marca = d.nombre_marcaproducto ,
                            precioventa = a.precioVenta_listaPrecios,
                            aplicadescuento = a.aplicaDescuento_listaPrecios,
                            porcentajedescuento = a.porcentajeDescuento_listaPrecios,
                            a.rango_listaPrecios,
                            a.precioMenor_listaPrecios,
                            a.precioMayor_listaPrecios
                        }).ToList();
            }
            else if (condicion == 2)
            {
                ListaPrecio oListaPrecio = new ListaPrecio();
                serializer = new JavaScriptSerializer();
                oListaPrecio = serializer.Deserialize<ListaPrecio>(parametros);

                List<int> validValues = new List<int>();
                var listacontenido = (from a in db.tbl_Fac_ListaPrecios
                                      select new
                                      {
                                          id_Producto = a.id_Producto
                                      }).ToList();

                foreach (var item in listacontenido)
                {
                    validValues.Add((Int32)item.id_Producto);
                }

                list = (from a in db.tbl_Alm_Producto
                        join b in db.tbl_Alm_ProductoCategoria on a.id_categoriaProducto equals b.id_categoriaProducto
                        where !validValues.Contains(a.id_Producto) && a.id_categoriaProducto == oListaPrecio.categoria 
                        select new
                        {
                            id_Producto = a.id_Producto ,
                            id_listaPrecio = 0,
                            codigo = a.codigo1_Producto,
                            categoria = b.nombre_Categoria,
                            descripcion = a.nombre_Producto,
                            precioventa = 0,
                            aplicadescuento = "NO",
                            porcentajedescuento = 0,
                            id_empresa = 1,
                            idPuntoVenta = oListaPrecio.puntoventa,
                            rango_listaPrecios = 0,
                            precioMenor_listaPrecios = 0,
                            precioMayor_listaPrecios = 0
                        }).ToList();
            }
            return Ok(list);
        }       


        // PUT: api/tblFac_ListaPrecios/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Fac_ListaPrecios(int id, tbl_Fac_ListaPrecios objListaPrecio)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (id == 0)
            {
                tbl_Fac_ListaPrecios resultado;
                resultado = db.tbl_Fac_ListaPrecios.Where(g => g.id_Producto  == objListaPrecio.id_Producto ).FirstOrDefault<tbl_Fac_ListaPrecios>();
                if (resultado != null)
                {
                    tbl_Fac_ListaPrecios ooListPrecio = new tbl_Fac_ListaPrecios();
                    // DATA ACTUAL

                    resultado.precioVenta_listaPrecios = objListaPrecio.precioVenta_listaPrecios;
                    resultado.aplicaDescuento_listaPrecios = objListaPrecio.aplicaDescuento_listaPrecios;
                    resultado.porcentajeDescuento_listaPrecios = objListaPrecio.porcentajeDescuento_listaPrecios;
                    resultado.fecha_edicion = DateTime.Now;
                    resultado.usuario_edicion = resultado.usuario_creacion;
                    db.Entry(resultado).State = EntityState.Modified;
                    try
                    {
                        db.SaveChanges();
                    }
                    catch (DbUpdateConcurrencyException)
                    {

                    }
                }
                else
                {
                    tbl_Fac_ListaPrecios newObjLista = new tbl_Fac_ListaPrecios();

                    newObjLista.id_empresa = objListaPrecio.id_empresa;
                    newObjLista.id_Producto = objListaPrecio.id_Producto;
                    newObjLista.precioVenta_listaPrecios = objListaPrecio.precioVenta_listaPrecios;
                    newObjLista.aplicaDescuento_listaPrecios = objListaPrecio.aplicaDescuento_listaPrecios;
                    newObjLista.porcentajeDescuento_listaPrecios = objListaPrecio.porcentajeDescuento_listaPrecios;
                    newObjLista.usuario_creacion = objListaPrecio.usuario_creacion;
                    newObjLista.fecha_creacion = DateTime.Now;
                    newObjLista.estado = 1;
                    newObjLista.id_PuntoVenta = objListaPrecio.id_PuntoVenta;
                    db.tbl_Fac_ListaPrecios.Add(newObjLista);
                    db.SaveChanges();
                }
            }
            else
            {
                tbl_Fac_ListaPrecios oListaPrecio;
                // DATA ACTUAL
                oListaPrecio = db.tbl_Fac_ListaPrecios.Where(g => g.id_listaPrecios == objListaPrecio.id_listaPrecios).FirstOrDefault<tbl_Fac_ListaPrecios>();

                oListaPrecio.precioVenta_listaPrecios = objListaPrecio.precioVenta_listaPrecios;
                oListaPrecio.aplicaDescuento_listaPrecios = objListaPrecio.aplicaDescuento_listaPrecios;
                oListaPrecio.porcentajeDescuento_listaPrecios = objListaPrecio.porcentajeDescuento_listaPrecios;
                oListaPrecio.fecha_edicion = DateTime.Now;
                oListaPrecio.usuario_edicion = oListaPrecio.usuario_creacion;
                db.Entry(oListaPrecio).State = EntityState.Modified;
                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!tbl_Fac_ListaPreciosExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return Ok("OK");
        }

            
        // POST: api/tblFac_ListaPrecios
        [ResponseType(typeof(tbl_Fac_ListaPrecios))]
        public IHttpActionResult Posttbl_Fac_ListaPrecios(tbl_Fac_ListaPrecios tbl_Fac_ListaPrecios)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.tbl_Fac_ListaPrecios.Add(tbl_Fac_ListaPrecios);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Fac_ListaPrecios.id_listaPrecios }, tbl_Fac_ListaPrecios);
        }

        // DELETE: api/tblFac_ListaPrecios/5
        [ResponseType(typeof(tbl_Fac_ListaPrecios))]
        public IHttpActionResult Deletetbl_Fac_ListaPrecios(int id)
        {
            tbl_Fac_ListaPrecios tbl_Fac_ListaPrecios = db.tbl_Fac_ListaPrecios.Find(id);
            if (tbl_Fac_ListaPrecios == null)
            {
                return NotFound();
            }

            db.tbl_Fac_ListaPrecios.Remove(tbl_Fac_ListaPrecios);
            db.SaveChanges();

            return Ok(tbl_Fac_ListaPrecios);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Fac_ListaPreciosExists(int id)
        {
            return db.tbl_Fac_ListaPrecios.Count(e => e.id_listaPrecios == id) > 0;
        }
    }
}