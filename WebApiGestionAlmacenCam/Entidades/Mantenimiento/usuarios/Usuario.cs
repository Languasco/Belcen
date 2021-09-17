using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Mantenimiento.usuarios
{
    public class Usuario
    {
        public int id_Usuario { get; set; }
        public string tipo_doc { get; set; }
        public string nro_doc { get; set; }
        public string apellidos { get; set; }
        public string nombres { get; set; }
        public string email { get; set; }
        public string nro_celular { get; set; }
        public string adm{ get; set; }
        public string sys { get; set; }
        public int id_cargo { get; set; }
        public int id_area { get; set; }
        public string tipo { get; set; }
        public int id_empresa_pertenece { get; set; }
        public string fotourl { get; set; }
        public bool acceso_web { get; set; }
        public bool acceso_movil { get; set; }
        public string login_usuario { get; set; }
        public string contrasenia_usuario { get; set; }
        public int id_perfil { get; set; }
        public string fecha_cese { get; set; }
        public int estado { get; set; }
        public int usuario_creacion { get; set; }
        public int usuario_edicion { get; set; }
        public string fecha_creacion { get; set; }
        public string fecha_edicion { get; set; }
        public string codigo { get; set; }
        public string envio_en_linea { get; set; }
    }
}
