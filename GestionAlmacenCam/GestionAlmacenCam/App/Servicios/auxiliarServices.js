angular.module('appGestion.auxiliarServices', [])

.factory('auxiliarServices', function ($http, $q, $http, $timeout) {

    var Result = {};
    // FUNCIÓN PARA CAMBIAR DE TITULO
    Result.changeTitle = function (value) {
        var title = document.getElementById('txtTitlePage');
        title.innerHTML = value;
    };
    // MOSTRAR Y OCULTAR EL MENU (ADMINISTRADOR, ALMACEN, FACTURACIÓN)
    Result.menuHideShow = function (val) {
        var contentMenu = document.getElementById('contentMenu');
        if (val == 1) {
            contentMenu.style.display = "";
        } else {
            contentMenu.style.display = "none";
        };
    }
    // GUARDA EN EL LOCALSTORAGE LOS DATOS DEL USUARIO LOGEADO (DATOS PERSONALES, PERMISOS EN MENU)
    Result.saveUserPermission = function (value) {
        localStorage.setItem("userPermission", JSON.stringify(value));
    }
    // DEVUELVE LOS DATOS PERSONALES DEL USUARIO LOGEADO
    Result.getUserInfo = function () {
        var userinfo = JSON.parse(localStorage.getItem("userPermission")).dataUsuario;
        return userinfo;
    }
    // VALIDAR SI EXISTE UNA SESIÓN INICIADA O NO
    Result.validateSession = function () {
        var userData = localStorage.getItem("userPermission");
        
    }
    // DEVUELVE LOS PERMISOS DEL USUARIO LOGEADO
    Result.getUserPermission = function (value) {
        var userpermission = JSON.parse(localStorage.getItem("userPermission")).listPermisos;
        var resultPermission = [];
        
        userpermission.forEach(function (item, index) {
            if (item.parent_id == value) {
                resultPermission.push(item);
            };
        })

        return resultPermission;
    }


    Result.set_moduloElegido = function (modulo) {
         ///--modulo = 1 , Administracion usuario ,     ///--modulo = 2 , Almacen   ///--modulo = 3 , Facturacion
        localStorage.setItem('moduloBelcen', modulo)
    }
    Result.get_moduloElegido = function () {
        const idModulo = JSON.parse(localStorage.getItem('moduloBelcen'));
        return idModulo;
    }


    // DEVUELVE EL ID DEL USUARIO LOGEADO
    Result.getUserId = function () {
        var userId = JSON.parse(localStorage.getItem("userPermission")).dataUsuario.id_Usuario;
        return userId;
    }
    // DEVUELVE SI TIENE PERMISO A ANULAR

    Result.getAnularDoc = function () {
        var anularDoc = JSON.parse(localStorage.getItem("userPermission")).dataUsuario.anular_documento;
        return anularDoc;
    }

    // DEVUELVE EL ID DEL PERFIL LOGEADO
    Result.getPerfilId = function () {
        var userId = JSON.parse(localStorage.getItem("userPermission")).dataUsuario.id_Perfil;
        return userId;
    }

    // VALIDA SI EXISTE UN USUARIO LOGEADO O NO
    Result.validateUserLog = function () {
        var userInfo = localStorage.getItem("userPermission");
        if (userInfo == null) {
            return false;
        } else {
            return true;
        }
    }
    // FUNCIÓN QUE CIERRA SESIÓN
    Result.closeSession = function () {
        localStorage.clear();
    }
    // CAMBIA EL NOMBRE DEL USUARIO EN EL HEADER
    Result.changeNameUser = function () {
        var userInfo = Result.getUserInfo();
        var nameUser = userInfo.nombres_usuario + ' ' + userInfo.apellidos_usuario;
        var txtnameuser = document.getElementById('txtNameUser');
        txtnameuser.innerHTML = nameUser;
    }

    // INICIALIZA EL FOOTABLE Y SU INPUT BUSCADOR
    Result.initFooTable = function (nameTable, nameInputSearch) {
        var addrow = $("#" + nameTable + "")
        $("#" + nameTable + "").footable({
            pageSize : 10,
            limitNavigation: 5
        });
        $("#" + nameInputSearch + "").on('input', function (e) {
            e.preventDefault();
            addrow.trigger('footable_filter', {
                filter: $(this).val()
            });
        });

   
    }

    // SWEET ALERTS

    // WANING SWEET 
    Result.initSweetAlert = function (params) {
        var q = $q.defer();
        if (params.type == "warning") {
            swal({
                title: params.title,
                text: params.text,
                type: params.type,
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si anular",
                cancelButtonText: "No anular",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                q.resolve(isConfirm);
                if (isConfirm) {
                    swal("Anulado!", "Acaba de anular.", "success");
                } else {
                    swal("Cancelado", "No se ha anulado", "error");
                }
            });
        } else if (params.type == "closeGuia") {

            swal({
                title: params.title,
                text: params.text,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si, cerrar guia",
                cancelButtonText: "No cerrar",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                q.resolve(isConfirm);
                swal.close();
            });
        } else if (params.type == "alert") {
            swal({
                title: params.title,
                text: params.text,
                imageUrl: "../plugins/images/check.png"
            }, function (res) {
                q.resolve(res);
            });
        } else if (params.type == "error") {

            swal({
                title: params.title,
                text: params.text,
                type: params.type
            }, function (res) {
                q.resolve(res);
            });
        } else if (params.type == "confirmationAlert") {

            swal({
                title: params.title,
                text: params.text,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                q.resolve(isConfirm);
                swal.close();
            });
        }

        return q.promise;
    }

    Result.NotificationMessage = function (title, message, type, colorloader, duration) {
        $.toast({
            heading: title,
            text: message,
            position: 'top-right',
            loaderBg: colorloader,
            icon: type,
            hideAfter: duration
        });
    }

    Result.formatDate = function (dateVal) {

        if (dateVal == null) {
            return "";
        }
        function padValue(value) {
            return (value < 10) ? "0" + value : value;
        }
        var newDate = new Date(dateVal);

        var sMonth = padValue(newDate.getMonth() + 1);
        var sDay = padValue(newDate.getDate());
        var sYear = newDate.getFullYear();
        var sHour = newDate.getUTCHours();
        var sMinute = padValue(newDate.getMinutes());
        var sAMPM = "AM";

        var iHourCheck = parseInt(sHour);
        

        
        if (iHourCheck > 12) {
            sAMPM = "PM";
            sHour = iHourCheck - 12;
        }
        else if (iHourCheck === 0) {
            sHour = "12";
        }

        sHour = padValue(sHour);

        return sDay + "-" + sMonth + "-" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
    }
    Result.getDateNow = function (dateVal) {

        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1;
        var yyyy = hoy.getFullYear();
        var hour = hoy.getHours();
        var minuts = hoy.getMinutes();
        var second = hoy.getSeconds();
        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        hoy = dd + '/' + mm + '/' + yyyy;
        return hoy;
    }
    Result.formatDateNotime = function (dateVal) {

        if (dateVal == null) {
            return "";
        }
        function padValue(value) {
            return (value < 10) ? "0" + value : value;
        }
        var newDate = new Date(dateVal);
        var sMonth = padValue(newDate.getMonth() + 1);
        var sDay = padValue(newDate.getDate());
        var sYear = newDate.getFullYear();
        return sDay + "/" + sMonth + "/" + sYear
    }

    Result.formatDateNow = function () {
        function padValue(value) {
            return (value < 10) ? "0" + value : value;
        }
        var newDate = new Date();
        var sMonth = padValue(newDate.getMonth() + 1);
        var sDay = padValue(newDate.getDate());
        var sYear = newDate.getFullYear();
        return sDay + "/" + sMonth + "/" + sYear
    }


    Result.paramsGuias = function (option, params) {
        if (option == "save") {
            var paramsGuia = params;
            localStorage.setItem('paramsGuias', JSON.stringify(paramsGuia));
            return 'save success';
        } else if (option == "get") {
            var paramsguia = JSON.parse(localStorage.getItem('paramsGuias'));
            return paramsguia;
        }
    }

    Result.paramsTransferencias = function (option, params) {
        if (option == "save") {
            var paramsGuia = params;
            localStorage.setItem('paramsTransferencias', JSON.stringify(paramsGuia));
            return 'save success';
        } else if (option == "get") {
            var paramsguia = JSON.parse(localStorage.getItem('paramsTransferencias'));
            return paramsguia;
        }
    }
    // FUNCIÓN QUE RECIBE UNA FECHA EN FORMATO DD/MM/YYYY Y LA CONVIERTE EN YYYY-MM-DD HH-MM-SS
    Result.changeFormatDate = function (value, fecha) {
        var fechaResult = fecha.split('/').reverse().join('-');
        var hoy = new Date();
        var hour = hoy.getHours();
        var minuts = hoy.getMinutes();
        var second = hoy.getSeconds();
        if (hour < 10) {
            hour = '0' + hour
        }

        if (minuts < 10) {
            minuts = '0' + minuts
        }
        if (value == 1) {
            fechaResult = fechaResult + ' ' + hour + ':' + minuts + ':' + second;
        } else if (value == 2) {
            fechaResult = fechaResult;
        }
        return fechaResult;
    }
    // FORMATEO DE NUMERO : EJEMPLO AMOUN = 1000 DECIMALS = 2 ENTONCES RETORNA 1,000.00
    Result.formatearNumero = function (amount, decimals) {
        amount += ''; // por si pasan un numero en vez de un string
        amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

        decimals = decimals || 0; // por si la variable no fue fue pasada

        // si no es un numero o es igual a cero retorno el mismo cero
        if (isNaN(amount) || amount === 0)
            return parseFloat(0).toFixed(decimals);

        // si es mayor o menor que cero retorno el valor formateado como numero
        amount = '' + amount.toFixed(decimals);

        var amount_parts = amount.split('.'),
            regexp = /(\d+)(\d{3})/;

        while (regexp.test(amount_parts[0]))
            amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

        return amount_parts.join('.');
    }

    Result.formatNumber = {
        separador: ",", // separador para los miles
        sepDecimal: '.', // separador para los decimales
        formatear: function (num) {
            num += '';
            var splitStr = num.split('.');
            var splitLeft = splitStr[0];
            var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
            var regx = /(\d+)(\d{3})/;
            while (regx.test(splitLeft)) {
                splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
            }
            return this.simbol + splitLeft + splitRight;
        },
        new: function (num, simbol) {
            this.simbol = simbol || '';
            return this.formatear(num);
        }
    }

    Result.getDateNow = function () {
        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1; //hoy es 0!
        var yyyy = hoy.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        hoy = dd + '/' + mm + '/' + yyyy;
        return hoy;
    }

    Result.getDateFormated = function (fecha) {
 
        var hoy = new Date(fecha);
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1; //hoy es 0!
        var yyyy = hoy.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        hoy = dd + '/' + mm + '/' + yyyy;
        return hoy;
    }



    Result.getHourNow = function () {

        var dn = "AM";
        var Formato_hora = '';
        var Digital = new Date();
        var hours = Digital.getHours();
        var minutes = Digital.getMinutes();
        var seconds = Digital.getSeconds();


        if (hours > 12) {
            dn = "PM";
            hours = hours - 12;
        }
        if (hours == 0) {
            hours = 12;
        }

        if (minutes <= 9) {
            minutes = "0" + minutes;
        }

        if (seconds <= 9) {
            seconds = "0" + seconds;
        }

        Formato_hora = hours + ":" + minutes + ":" + seconds + " " + dn
        return Formato_hora
    }

    Result.Formatear_CerosIzquierda = function (number, width) {
        var numberOutput = Math.abs(number); /* Valor absoluto del número */
        var length = number.toString().length; /* Largo del número */
        var zero = "0"; /* String de cero */

        if (width <= length) {
            if (number < 0) {
                return ("-" + numberOutput.toString());
            } else {
                return numberOutput.toString();
            }
        } else {
            if (number < 0) {
                return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
            } else {
                return ((zero.repeat(width - length)) + numberOutput.toString());
            }
        }
    }




    return Result;
});



function Unidades(num) {

    switch (num) {
        case 1: return "UN";
        case 2: return "DOS";
        case 3: return "TRES";
        case 4: return "CUATRO";
        case 5: return "CINCO";
        case 6: return "SEIS";
        case 7: return "SIETE";
        case 8: return "OCHO";
        case 9: return "NUEVE";
    }

    return "";
}//Unidades()

function Decenas(num) {

    decena = Math.floor(num / 10);
    unidad = num - (decena * 10);

    switch (decena) {
        case 1:
            switch (unidad) {
                case 0: return "DIEZ";
                case 1: return "ONCE";
                case 2: return "DOCE";
                case 3: return "TRECE";
                case 4: return "CATORCE";
                case 5: return "QUINCE";
                default: return "DIECI" + Unidades(unidad);
            }
        case 2:
            switch (unidad) {
                case 0: return "VEINTE";
                default: return "VEINTI" + Unidades(unidad);
            }
        case 3: return DecenasY("TREINTA", unidad);
        case 4: return DecenasY("CUARENTA", unidad);
        case 5: return DecenasY("CINCUENTA", unidad);
        case 6: return DecenasY("SESENTA", unidad);
        case 7: return DecenasY("SETENTA", unidad);
        case 8: return DecenasY("OCHENTA", unidad);
        case 9: return DecenasY("NOVENTA", unidad);
        case 0: return Unidades(unidad);
    }
}//Unidades()

function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
        return strSin + " Y " + Unidades(numUnidades)

    return strSin;
}//DecenasY()

function Centenas(num) {
    centenas = Math.floor(num / 100);
    decenas = num - (centenas * 100);

    switch (centenas) {
        case 1:
            if (decenas > 0)
                return "CIENTO " + Decenas(decenas);
            return "CIEN";
        case 2: return "DOSCIENTOS " + Decenas(decenas);
        case 3: return "TRESCIENTOS " + Decenas(decenas);
        case 4: return "CUATROCIENTOS " + Decenas(decenas);
        case 5: return "QUINIENTOS " + Decenas(decenas);
        case 6: return "SEISCIENTOS " + Decenas(decenas);
        case 7: return "SETECIENTOS " + Decenas(decenas);
        case 8: return "OCHOCIENTOS " + Decenas(decenas);
        case 9: return "NOVECIENTOS " + Decenas(decenas);
    }

    return Decenas(decenas);
}//Centenas()

function Seccion(num, divisor, strSingular, strPlural) {
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    letras = "";

    if (cientos > 0)
        if (cientos > 1)
            letras = Centenas(cientos) + " " + strPlural;
        else
            letras = strSingular;

    if (resto > 0)
        letras += "";

    return letras;
}//Seccion()

function Miles(num) {
    divisor = 1000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMiles = Seccion(num, divisor, "UN MIL", "MIL");
    strCentenas = Centenas(resto);

    if (strMiles == "")
        return strCentenas;

    return strMiles + " " + strCentenas;
}//Miles()

function Millones(num) {
    divisor = 1000000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
    strMiles = Miles(resto);

    if (strMillones == "")
        return strMiles;

    return strMillones + " " + strMiles;
}//Millones()

function NumeroALetras(num) {
    var data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: "",
        letrasMonedaPlural: 'SOLES',//"PESOS", 'Dólares', 'Bolívares', 'etcs'
        letrasMonedaSingular: 'SOL', //"PESO", 'Dólar', 'Bolivar', 'etc'
        letrasMonedaCentavoPlural: "",
        letrasMonedaCentavoSingular: ""
        //letrasMonedaCentavoPlural: "CENTIMOS",
        //letrasMonedaCentavoSingular: "CENTIMO"
    };

    if (data.centavos > 0) {
        data.letrasCentavos = "CON " + (function () {
            if (data.centavos == 1)
                //return Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular;
                return data.centavos + ' /100' + " " + data.letrasMonedaCentavoSingular;
            else
                //return Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural;
                return data.centavos + '/100' + " " + data.letrasMonedaCentavoPlural;
        })();
    }
    if (data.centavos == '') {
        data.letrasCentavos = "CON " + (function () {
                return  '00 /100' + " " + data.letrasMonedaCentavoPlural;
        })();
    }

    if (data.enteros == 0)
        return "CERO " + " " + data.letrasCentavos + data.letrasMonedaPlural;
    if (data.enteros == 1)
        return Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
    else
        return Millones(data.enteros) + " " + data.letrasCentavos + " " + data.letrasMonedaPlural;
}