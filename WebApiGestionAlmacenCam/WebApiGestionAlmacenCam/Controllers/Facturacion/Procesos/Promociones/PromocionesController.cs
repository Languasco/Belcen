using Entidades;
using Negocio.Facturacion.Procesos;
using Negocio.Resultado;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using static Negocio.Accesos.LogInAccess_BL;

namespace WebApiGestionAlmacenCam.Controllers.Facturacion.Procesos.Promociones
{
    [EnableCors("*", "*", "*")]
    public class PromocionesController : ApiController
    {

        private CAMGestionAlmacenEntities db = new CAMGestionAlmacenEntities();

        public object GetPromociones(int opcion, string filtro)
        {
            db.Configuration.ProxyCreationEnabled = false;

            object resul = null;
            try
            {                 
                if (opcion == 1)
                {
                    Promociones_BL obj_negocio = new Promociones_BL();
                    resul = obj_negocio.get_actividades();
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idCanasta = Convert.ToInt32(parametros[0].ToString());

                    Promociones_BL obj_negocio = new Promociones_BL();
                    resul = obj_negocio.get_buscarCanastaID(idCanasta);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    string codigoProducto =  parametros[0].ToString();

                    Promociones_BL obj_negocio = new Promociones_BL();
                    resul = obj_negocio.get_buscarCodigoProducto(codigoProducto);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int idPromocion = Convert.ToInt32(parametros[0].ToString());

                    Promociones_BL obj_negocio = new Promociones_BL();
                    resul = obj_negocio.get_configuracionDetalle(idPromocion);
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int idEstado = Convert.ToInt32(parametros[0].ToString());
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();

                    Promociones_BL obj_negocio = new Promociones_BL();
                    resul = obj_negocio.get_promocionCab(idEstado, fechaIni, fechaFin);
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    int idPromocion = Convert.ToInt32(parametros[0].ToString());

                    Promociones_BL obj_negocio = new Promociones_BL();
                    resul = obj_negocio.set_anularPromocion(idPromocion);
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Productos_Configuracion = Convert.ToInt32(parametros[0].ToString());

                    Promociones_BL obj_negocio = new Promociones_BL();
                    resul = obj_negocio.set_anularConfiguracion(id_Productos_Configuracion);
                }
                else if (opcion == 8)
                {
                    Promociones_BL obj_negocio = new Promociones_BL();
                    resul = obj_negocio.get_estados();
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int idCanasta = Convert.ToInt32(parametros[0].ToString());

                    Promociones_BL obj_negocio = new Promociones_BL();
                    resul = obj_negocio.get_canastasDetalle(idCanasta);
                }
                else
                {
                    resul = "Opcion selecciona invalida";
                }
            }
            catch (Exception ex)
            {
                resul = ex.Message;
            }
            return resul;
        }
        
        [HttpPost]
        [Route("api/Promociones/Posttbl_Promocion_Productos")]
        public object Posttbl_Promocion_Productos(tbl_Promocion_Productos tbl_Promocion_Productos)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Promocion_Productos.fecha_creacion = DateTime.Now;
                db.tbl_Promocion_Productos.Add(tbl_Promocion_Productos);
                db.SaveChanges();
                try
                {
                    int idPromo = tbl_Promocion_Productos.id_Promocion;

                    tbl_Promocion_Productos objReemplazar;
                    objReemplazar = db.tbl_Promocion_Productos.Where(u => u.id_Promocion == idPromo).FirstOrDefault<tbl_Promocion_Productos>();
                    objReemplazar.codigoPromocion = idPromo.ToString();
                    db.Entry(objReemplazar).State = EntityState.Modified;

                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {

                }

                res.ok = true;
                res.data = tbl_Promocion_Productos.id_Promocion;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        [HttpPut]
        [Route("api/Promociones/Puttbl_Promocion_Productos")]
        public object Puttbl_Promocion_Productos(int id, tbl_Promocion_Productos tbl_Promocion_Productos)
        {
            Resultado res = new Resultado();

            tbl_Promocion_Productos objReemplazar;
            objReemplazar = db.tbl_Promocion_Productos.Where(u => u.id_Promocion == id).FirstOrDefault<tbl_Promocion_Productos>();

            objReemplazar.codigoPromocion = tbl_Promocion_Productos.codigoPromocion;
            objReemplazar.id_ActividadPromocion = tbl_Promocion_Productos.id_ActividadPromocion;
            objReemplazar.nombrePromocion = tbl_Promocion_Productos.nombrePromocion;
            objReemplazar.descripcionPromocion = tbl_Promocion_Productos.descripcionPromocion;
            objReemplazar.fechaVigenciaDesde = tbl_Promocion_Productos.fechaVigenciaDesde;

            objReemplazar.fechaVigenciaHasta = tbl_Promocion_Productos.fechaVigenciaHasta;
            objReemplazar.topesUnidadesInicio = tbl_Promocion_Productos.topesUnidadesInicio;
            objReemplazar.topesUnidadesFin = tbl_Promocion_Productos.topesUnidadesFin;

            objReemplazar.id_CanalNegocio = tbl_Promocion_Productos.id_CanalNegocio;
            objReemplazar.id_FormaPago = tbl_Promocion_Productos.id_FormaPago;

            objReemplazar.estado = tbl_Promocion_Productos.estado;
            objReemplazar.usuario_edicion = tbl_Promocion_Productos.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

            db.Entry(objReemplazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
                res.ok = true;
                res.data = "OK";
            }
            catch (DbUpdateConcurrencyException ex)
            {
                res.ok = false;
                res.data = ex.InnerException.Message;
            }

            return res;
        }
        
        [HttpPost]
        [Route("api/Promociones/Posttbl_Promocion_Productos_Configuracion")]
        public object Posttbl_Promocion_Productos_Configuracion(tbl_Promocion_Productos_Configuracion tbl_Promocion_Productos_Configuracion)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Promocion_Productos_Configuracion.fecha_creacion = DateTime.Now;
                db.tbl_Promocion_Productos_Configuracion.Add(tbl_Promocion_Productos_Configuracion);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Promocion_Productos_Configuracion.id_Productos_Configuracion;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }
        
        [HttpPut]
        [Route("api/Promociones/Puttbl_Promocion_Productos_Configuracion")]
        public object Puttbl_Promocion_Productos_Configuracion(int id, tbl_Promocion_Productos_Configuracion tbl_Promocion_Productos_Configuracion)
        {
            Resultado res = new Resultado();

            tbl_Promocion_Productos_Configuracion objReemplazar;
            objReemplazar = db.tbl_Promocion_Productos_Configuracion.Where(u => u.id_Productos_Configuracion == id).FirstOrDefault<tbl_Promocion_Productos_Configuracion>();

            objReemplazar.id_Canasta = tbl_Promocion_Productos_Configuracion.id_Canasta;
            objReemplazar.id_Producto = tbl_Promocion_Productos_Configuracion.id_Producto;
            objReemplazar.id_unidadMedida = tbl_Promocion_Productos_Configuracion.id_unidadMedida;
            objReemplazar.cantidad_Promocion = tbl_Promocion_Productos_Configuracion.cantidad_Promocion;
            objReemplazar.estado = tbl_Promocion_Productos_Configuracion.estado;
            objReemplazar.usuario_edicion = tbl_Promocion_Productos_Configuracion.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

            db.Entry(objReemplazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
                res.ok = true;
                res.data = "OK";
            }
            catch (DbUpdateConcurrencyException ex)
            {
                res.ok = false;
                res.data = ex.InnerException.Message;
            }

            return res;
        }

        //----  CABECERA

        [HttpPost]
        [Route("api/Promociones/Posttbl_Promocion_ProductosCanastas")]
        public object Posttbl_Promocion_ProductosCanastas(tbl_Promocion_Canasta tbl_Promocion_Canasta)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Promocion_Canasta.fecha_creacion = DateTime.Now;
                db.tbl_Promocion_Canasta.Add(tbl_Promocion_Canasta);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Promocion_Canasta.id_Canasta;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        [HttpPut]
        [Route("api/Promociones/Putttbl_Promocion_ProductosCanastas")]
        public object Putttbl_Promocion_ProductosCanastas(int id, tbl_Promocion_Canasta tbl_Promocion_Canasta)
        {
            Resultado res = new Resultado();

            tbl_Promocion_Canasta objReemplazar;
            objReemplazar = db.tbl_Promocion_Canasta.Where(u => u.id_Canasta == id).FirstOrDefault<tbl_Promocion_Canasta>();

            objReemplazar.descripcionCanasta = tbl_Promocion_Canasta.descripcionCanasta;
            objReemplazar.usuario_edicion = tbl_Promocion_Canasta.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

            db.Entry(objReemplazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
                res.ok = true;
                res.data = "OK";
            }
            catch (DbUpdateConcurrencyException ex)
            {
                res.ok = false;
                res.data = ex.InnerException.Message;
            }

            return res;
        }



        //---- DETALLE

        [HttpPost]
        [Route("api/Promociones/Posttbl_Promocion_ProductosCanastas_det")]
        public object Posttbl_Promocion_ProductosCanastas_det(tbl_Promocion_Canasta_Det tbl_Promocion_Canasta_Det)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Promocion_Canasta_Det.fecha_creacion = DateTime.Now;
                db.tbl_Promocion_Canasta_Det.Add(tbl_Promocion_Canasta_Det);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Promocion_Canasta_Det.id_CanastaDet;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }

        [HttpPut]
        [Route("api/Promociones/Putttbl_Promocion_ProductosCanastas_det")]
        public object Putttbl_Promocion_ProductosCanastas_det(int id, tbl_Promocion_Canasta_Det tbl_Promocion_Canasta_Det)
        {
            Resultado res = new Resultado();

            tbl_Promocion_Canasta_Det objReemplazar;
            objReemplazar = db.tbl_Promocion_Canasta_Det.Where(u => u.id_CanastaDet == id).FirstOrDefault<tbl_Promocion_Canasta_Det>();                
 
            objReemplazar.id_Producto = tbl_Promocion_Canasta_Det.id_Producto; 
            objReemplazar.usuario_edicion = tbl_Promocion_Canasta_Det.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

            db.Entry(objReemplazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
                res.ok = true;
                res.data = "OK";
            }
            catch (DbUpdateConcurrencyException ex)
            {
                res.ok = false;
                res.data = ex.InnerException.Message;
            }

            return res;
        }
               
    }
}
