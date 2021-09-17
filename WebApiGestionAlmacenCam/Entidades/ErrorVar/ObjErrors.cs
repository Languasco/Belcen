using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades
{
    public class ObjErrors
    {
        public int type { get; set; }
        public string message { get; set; }
        public Exception exception { get; set; }        
    }
}
