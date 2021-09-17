using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Mantenimiento.Proceso
{
    public class PersonalNew
    {
        public int id_personal { get; set; }
        public string nroDoc_personal { get; set; }
        public string tipoDoc_personal { get; set; }
        public string apellidos_personal { get; set; }
        public string nombres_personal { get; set; }
        public Nullable<int> tip_personal { get; set; }
        public Nullable<int> id_cargo_personal { get; set; }
        public string fotoUrl_personal { get; set; }
        public string nroCelular_personal { get; set; }
        public string email_personal { get; set; }
        public string nombreUsario_personal { get; set; }
        public string contrasenia_personal { get; set; }
        public string envio_enlinea_personal { get; set; }
        public int empresa { get; set; }
        public int id_cuadrilla { get; set; }
        public int codigo_cuadrilla { get; set; }
        public int id_local { get; set; }
        public string nombre_local { get; set; }
        public Nullable<int> id_perfil { get; set; }
        public Nullable<System.DateTime> fecha_cese { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_creacion { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
        public Nullable<int> usuario_edicion { get; set; }
        public Nullable<System.DateTime> fecha_edicion { get; set; }
    }
}
