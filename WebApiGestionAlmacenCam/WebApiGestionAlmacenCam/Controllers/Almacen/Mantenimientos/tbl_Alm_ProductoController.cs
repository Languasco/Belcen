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
using System.Web.Http.Cors;
using System.Threading.Tasks;
using System.IO;
using Negocio.Almacen.Mantenimiento;
using System.Configuration;

namespace WebApi_Ventas.Controllers.Almacen.Mantenimientos
{
    [EnableCors("*", "*", "*")]
    public class tbl_Alm_ProductoController : ApiController
    {
         
        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        // GET: api/tbl_Alm_Producto
        public object Gettbl_Alm_Producto()
        {

            string rutaServer = ConfigurationManager.AppSettings["servidor_fotoProducto"];

            var list = (from pro in db.tbl_Alm_Producto
                       join un in db.tbl_Alm_UnidadMedida on pro.id_unidadMedida equals un.id_unidadMedida
                       join li in db.tbl_Alm_ProductoLinea on pro.id_lineaProducto equals li.id_lineaProducto
                       join sli in db.tbl_Alm_ProductoSubLinea on pro.id_subLineaProducto equals sli.id_subLineaProducto
                       join ma in db.tbl_Alm_ProductoMarca on pro.id_marcaProducto equals ma.id_marcaProducto
                       join ca in db.tbl_Alm_ProductoCategoria on pro.id_categoriaProducto equals ca.id_categoriaProducto
                       select new
                       {
                           pro.id_Producto,
                           pro.id_modeloProducto,
                           pro.codigo1_Producto,
                           pro.codigo2_Producto,
                           pro.CodigoBarra_Producto,
                           pro.nombre_Producto,
                           pro.preciocompra_producto,
                           pro.precioventa_producto,

                           pro.precioMay_Menor,
                           pro.precioMay_Mayor,

                           pro.RangoCaja_Horizontal,
                           pro.RangoCaja_Mayorista,

                           pro.descripcion_producto,                     
                           pro.abreviatura_Producto,

                           url_foto_Producto = string.IsNullOrEmpty(pro.url_foto_Producto) ? "../belcen/content/img/sinImagen.jpg" : rutaServer + pro.url_foto_Producto,

                           pro.fecha_Creacion,
                           pro.usuario_Creacion,
                           pro.usuario_Edicion,
                           pro.estado,
                           pro.peso_Producto,
                           pro.stockminimo_Producto,
                           pro.factorMultiplicacion_Alm,
                           pro.factorDivisor_Alm,
                           pro.factorMultiplicacion_Vta,
                           pro.factorDivisor_Vta,
                           pro.fecha_Edicion,
                           pro.tiempoVida_Producto,
                           un.id_unidadMedida,
                           un.nombre_UnidadMedida,
                           li.id_lineaProducto,
                           li.nombre_linea,
                           sli.id_subLineaProducto,
                           sli.nombre_SubLinea,
                           ma.id_marcaProducto,
                           ma.nombre_marcaproducto,
                           ca.id_categoriaProducto,
                           ca.nombre_Categoria,

                           pro.afectoIGV,
                           pro.afectoISC,
                           pro.aplicaDetraccion,
                           pro.aplicaPercepcion,
                           pro.movLote,
                           pro.aplicaFecVence,
                           pro.stockMinimo,
                           pro.id_unidadMedida_Cobertura,
                           pro.id_unidadMedida_Mayorista,


                       }).ToList();


            return list;
        }
              

        public object Gettbl_Alm_ProductoByCod(string filter)
        {
            filter = filter == null ? "" : filter;
            string rutaServer = ConfigurationManager.AppSettings["servidor_fotoProducto"];

            var list = (from pro in db.tbl_Alm_Producto
                        join un in db.tbl_Alm_UnidadMedida on pro.id_unidadMedida equals un.id_unidadMedida
                        join li in db.tbl_Alm_ProductoLinea on pro.id_lineaProducto equals li.id_lineaProducto
                        join sli in db.tbl_Alm_ProductoSubLinea on pro.id_subLineaProducto equals sli.id_subLineaProducto
                        join ma in db.tbl_Alm_ProductoMarca on pro.id_marcaProducto equals ma.id_marcaProducto
                        join ca in db.tbl_Alm_ProductoCategoria on pro.id_categoriaProducto equals ca.id_categoriaProducto
                        where pro.codigo1_Producto.Contains(filter) && pro.estado == 1
                        select new
                        {
                            pro.id_Producto,
                            pro.id_modeloProducto,
                            pro.codigo1_Producto,
                            pro.codigo2_Producto,
                            pro.CodigoBarra_Producto,
                            pro.nombre_Producto,
                            pro.preciocompra_producto,
                            pro.descripcion_producto,
                            pro.precioventa_producto,

                            pro.precioMay_Menor,
                            pro.precioMay_Mayor,

                            pro.RangoCaja_Horizontal,
                            pro.RangoCaja_Mayorista,

                            pro.abreviatura_Producto,
                            url_foto_Producto = string.IsNullOrEmpty(pro.url_foto_Producto) ? "../belcen/content/img/sinImagen.jpg" : rutaServer + pro.url_foto_Producto,
                            pro.fecha_Creacion,
                            pro.usuario_Creacion,
                            pro.usuario_Edicion,
                            pro.estado,
                            pro.peso_Producto,
                            pro.stockminimo_Producto,
                            pro.factorMultiplicacion_Alm,
                            pro.factorDivisor_Alm,
                            pro.factorMultiplicacion_Vta,
                            pro.factorDivisor_Vta,
                            pro.fecha_Edicion,
                            pro.tiempoVida_Producto,
                            un.id_unidadMedida,
                            un.nombre_UnidadMedida,
                            li.id_lineaProducto,
                            li.nombre_linea,
                            sli.id_subLineaProducto,
                            sli.nombre_SubLinea,
                            ma.id_marcaProducto,
                            ma.nombre_marcaproducto,
                            ca.id_categoriaProducto,
                            ca.nombre_Categoria,

                            pro.afectoIGV,
                            pro.afectoISC,
                            pro.aplicaDetraccion,
                            pro.aplicaPercepcion,
                            pro.movLote,
                            pro.aplicaFecVence,
                            pro.stockMinimo,
                            pro.id_unidadMedida_Cobertura,
                            pro.id_unidadMedida_Mayorista,


                        }).ToList();


            return list;
        }

        // GET: api/tbl_Alm_Producto/5
        [ResponseType(typeof(tbl_Alm_Producto))]
        public object Gettbl_Alm_Producto(String id, string idEstado = "")
        {

            string rutaServer = ConfigurationManager.AppSettings["servidor_fotoProducto"];

            string id_marca = "";
 

            if (id == "0")
            {
                id_marca = "";
            }
            else {
                id_marca = id;
            }

            db.Configuration.ProxyCreationEnabled = false;            
            {
                var list = (from pro in db.tbl_Alm_Producto
                            join un in db.tbl_Alm_UnidadMedida on pro.id_unidadMedida equals un.id_unidadMedida
                            join li in db.tbl_Alm_ProductoLinea on pro.id_lineaProducto equals li.id_lineaProducto
                            join sli in db.tbl_Alm_ProductoSubLinea on pro.id_subLineaProducto equals sli.id_subLineaProducto
                            join ma in db.tbl_Alm_ProductoMarca on pro.id_marcaProducto equals ma.id_marcaProducto
                            join ca in db.tbl_Alm_ProductoCategoria on pro.id_categoriaProducto equals ca.id_categoriaProducto
                            where   pro.id_marcaProducto.ToString().Contains(id_marca) && pro.estado.ToString().Contains(idEstado)
                            select new
                            {
                                pro.id_Producto,
                                pro.id_modeloProducto,
                                pro.codigo1_Producto,
                                pro.codigo2_Producto,
                                pro.CodigoBarra_Producto,
                                pro.nombre_Producto,
                                pro.preciocompra_producto,
                                pro.descripcion_producto,
                                pro.precioventa_producto,


                                pro.precioMay_Menor,
                                pro.precioMay_Mayor,

                                pro.RangoCaja_Horizontal,
                                pro.RangoCaja_Mayorista,

                                pro.abreviatura_Producto,
                                url_foto_Producto = string.IsNullOrEmpty(pro.url_foto_Producto) ? "../belcen/content/img/sinImagen.jpg" : rutaServer + pro.url_foto_Producto,
                                pro.fecha_Creacion,
                                pro.usuario_Creacion,
                                pro.usuario_Edicion,
                                pro.estado,
                                pro.peso_Producto,
                                pro.stockminimo_Producto,
                                pro.factorMultiplicacion_Alm,
                                pro.factorDivisor_Alm,
                                pro.factorMultiplicacion_Vta,
                                pro.factorDivisor_Vta,
                                pro.fecha_Edicion,
                                pro.tiempoVida_Producto,
                                un.id_unidadMedida,
                                un.nombre_UnidadMedida,
                                li.id_lineaProducto,
                                li.nombre_linea,
                                sli.id_subLineaProducto,
                                sli.nombre_SubLinea,
                                ma.id_marcaProducto,
                                ma.nombre_marcaproducto,
                                ca.id_categoriaProducto,
                                ca.nombre_Categoria,

                                pro.afectoIGV,
                                pro.afectoISC,
                                pro.aplicaDetraccion,
                                pro.aplicaPercepcion,
                                pro.movLote,
                                pro.aplicaFecVence,
                                pro.stockMinimo,
                                pro.id_unidadMedida_Cobertura,
                                pro.id_unidadMedida_Mayorista,


                            }).ToList();


                return list;

            }            
        }

        // PUT: api/tbl_Alm_Producto/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Alm_Producto(int id, tbl_Alm_Producto objet_ent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != objet_ent.id_Producto)
            {
                return BadRequest();
            }

            tbl_Alm_Producto object_Producto;
            object_Producto = db.tbl_Alm_Producto.Where(p => p.id_Producto == objet_ent.id_Producto).FirstOrDefault<tbl_Alm_Producto>();
            object_Producto.id_Producto = objet_ent.id_Producto;
            object_Producto.codigo1_Producto = objet_ent.codigo1_Producto;
            //object_Producto.codigo2_Producto = objet_ent.codigo2_Producto;
            object_Producto.CodigoBarra_Producto = objet_ent.CodigoBarra_Producto;
            object_Producto.nombre_Producto = objet_ent.nombre_Producto;
            object_Producto.descripcion_producto = objet_ent.descripcion_producto;

            object_Producto.preciocompra_producto = objet_ent.preciocompra_producto;
            object_Producto.precioventa_producto = objet_ent.precioventa_producto;

            object_Producto.precioMay_Menor = objet_ent.precioMay_Menor;
            object_Producto.precioMay_Mayor = objet_ent.precioMay_Mayor;

            object_Producto.RangoCaja_Horizontal = objet_ent.RangoCaja_Horizontal;
            object_Producto.RangoCaja_Mayorista = objet_ent.RangoCaja_Mayorista;


            object_Producto.abreviatura_Producto = objet_ent.abreviatura_Producto;
            object_Producto.id_unidadMedida = objet_ent.id_unidadMedida;
            //object_Producto.peso_Producto = objet_ent.peso_Producto;
            object_Producto.id_categoriaProducto = objet_ent.id_categoriaProducto;
            object_Producto.id_lineaProducto = objet_ent.id_lineaProducto;
            object_Producto.id_subLineaProducto = objet_ent.id_subLineaProducto;
            object_Producto.id_marcaProducto = objet_ent.id_marcaProducto;
            object_Producto.id_modeloProducto = objet_ent.id_modeloProducto;
            //object_Producto.tiempoVida_Producto = objet_ent.tiempoVida_Producto;
            //object_Producto.stockminimo_Producto = objet_ent.stockminimo_Producto;
            object_Producto.factorMultiplicacion_Alm = objet_ent.factorMultiplicacion_Alm;
            object_Producto.factorDivisor_Alm = objet_ent.factorDivisor_Alm;
            object_Producto.factorMultiplicacion_Vta = objet_ent.factorMultiplicacion_Vta;
            object_Producto.factorDivisor_Vta = objet_ent.factorDivisor_Vta;
            object_Producto.estado = objet_ent.estado;
            object_Producto.usuario_Edicion = objet_ent.usuario_Creacion;
            object_Producto.fecha_Edicion = DateTime.Now;


           object_Producto.afectoIGV = objet_ent.afectoIGV;
           object_Producto.afectoISC = objet_ent.afectoISC;
           object_Producto.aplicaDetraccion = objet_ent.aplicaDetraccion;
           object_Producto.aplicaPercepcion = objet_ent.aplicaPercepcion;
           object_Producto.movLote = objet_ent.movLote;
           object_Producto.aplicaFecVence = objet_ent.aplicaFecVence;
           object_Producto.stockMinimo = objet_ent.stockMinimo;

            object_Producto.id_unidadMedida_Cobertura = objet_ent.id_unidadMedida_Cobertura;
            object_Producto.id_unidadMedida_Mayorista = objet_ent.id_unidadMedida_Mayorista;

            db.Entry(object_Producto).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Alm_ProductoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Ok");
        }

        // POST: api/tbl_Alm_Producto
        [ResponseType(typeof(tbl_Alm_Producto))]
        public IHttpActionResult Posttbl_Alm_Producto(tbl_Alm_Producto tbl_Alm_Producto)
        {
            tbl_Alm_Producto.fecha_Creacion = DateTime.Now;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tbl_Alm_Producto.fecha_Creacion = DateTime.Now;
            db.tbl_Alm_Producto.Add(tbl_Alm_Producto);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Alm_Producto }, tbl_Alm_Producto);
        }

        // DELETE: api/tbl_Alm_Producto/5
        [ResponseType(typeof(tbl_Alm_Producto))]
        public async Task<IHttpActionResult> Deletetbl_Alm_Producto(int id)
        {

            tbl_Alm_Producto object_pro = await db.tbl_Alm_Producto.FindAsync(id);
            object_pro = db.tbl_Alm_Producto.Where(p => p.id_Producto == id).FirstOrDefault<tbl_Alm_Producto>();
            object_pro.estado = 0;
            db.Entry(object_pro).State = System.Data.Entity.EntityState.Modified;
            await db.SaveChangesAsync();


            return Ok("Ok");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Alm_ProductoExists(int id)
        {
            return db.tbl_Alm_Producto.Count(e => e.id_Producto == id) > 0;
        }


        public class resul
        {
            public bool ok { get; set; }
            public object data { get; set; }
        }

        [HttpPost]
        [Route("api/tbl_Alm_Producto/UploadImageProduct")]
        public object UploadImageProduct(int idProducto,  int idUsuario)
        {
            resul res = new resul();
            string nombreFile = "";
            string nombreFileServer = "";
            string path = "";
            try
            {
                System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files; 
                for (int i = 0; i < files.Count; i++)
                {
                    System.Web.HttpPostedFile file = files[i];
                    string extension = System.IO.Path.GetExtension(file.FileName);

                    nombreFile = file.FileName;

                    //-----generando clave unica---
                    var guid = Guid.NewGuid();
                    var guidB = guid.ToString("B");
                    nombreFileServer = idUsuario + "_image_product_" + Guid.Parse(guidB) + extension;

                    //---almacenando la imagen--
                    path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagenes/"+ nombreFileServer);                                       
                    file.SaveAs(path);                
                }

                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                     ///----validando que en servidor solo halla una sola foto---
                    tbl_Alm_Producto object_Producto;
                    object_Producto = db.tbl_Alm_Producto.Where(p => p.id_Producto == idProducto).FirstOrDefault<tbl_Alm_Producto>();                    
                    string urlFotoAntes = object_Producto.url_foto_Producto;

                    Almacen_BL obj_negocio = new Almacen_BL();
                    res.ok = true;
                    res.data = obj_negocio.Set_Actualizar_imagenProducto(idProducto, nombreFile , nombreFileServer);

                    //---si previamente habia una foto, al reemplazarla borramos la anterior
                    if (urlFotoAntes.Length > 0)
                    {
                        path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagenes/" + urlFotoAntes);

                        if (File.Exists(path))
                        {
                            File.Delete(path);
                        }
                    }
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo guardar el archivo en el servidor..";
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }

            return res;
        }




    }
}