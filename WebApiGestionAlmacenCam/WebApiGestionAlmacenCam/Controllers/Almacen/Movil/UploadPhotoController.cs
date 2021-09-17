using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApiProyecto.Controllers.Movil
{
    [EnableCors("*", "*", "*")]
    public class UploadPhotoController : ApiController
    {
        [HttpPost] // This is from System.Web.Http, and not from System.Web.Mvc
        public HttpResponseMessage Upload(string nameFile)
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                this.Request.CreateResponse(HttpStatusCode.UnsupportedMediaType);
            }
            string filename = "";
            string path = System.Web.Hosting.HostingEnvironment.MapPath("~/FilesUpload/FotosClientes/");
            System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;
            for (int i = 0; i < files.Count; i++)
            {
                System.Web.HttpPostedFile file = files[i];
                filename = new FileInfo(file.FileName).Name;

                if (file.ContentLength > 0)
                {
                    //  Guid id = new Guid();

                    string modifiedFilename = nameFile;

                    file.SaveAs(path + Path.GetFileName(modifiedFilename));

                }
            }
            return this.Request.CreateResponse(HttpStatusCode.OK, new { success = "Upload Sucess" });
        }
    }
}
