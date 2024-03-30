var listaNumeros = [];
var Citem = 0;

jQuery(document).ready(function() {
	cargarCarritoSS();
	actualizarTotal();
});

function generarNumeroAleatorioUnico() {
    // Obtener la fecha y hora actuales
    const ahora = new Date();

    // Convertir la fecha y hora a una cadena en formato de marca de tiempo
    // AñoMesDíaHoraMinutoSegundoMilisegundo
    const marcaDeTiempo = ahora.getFullYear().toString() +
    (ahora.getMonth() + 1).toString().padStart(2, '0') +
    ahora.getDate().toString().padStart(2, '0') +
    ahora.getHours().toString().padStart(2, '0') +
    ahora.getMinutes().toString().padStart(2, '0') +
    ahora.getSeconds().toString().padStart(2, '0') +
    ahora.getMilliseconds().toString().padStart(3, '0');
    
    // Generar un número aleatorio entre 1000 y 9999 (puedes ajustar estos valores)
    const aleatorio = Math.floor(100 + Math.random() * 900);

    // Combinar la marca de tiempo y el número aleatorio
    const numeroAleatorioUnico = marcaDeTiempo + aleatorio.toString();

    return numeroAleatorioUnico;
}

    var handler = ePayco.checkout.configure({
        key: '4a72563265e840d143383ca81d993ca5',
        test: true
    });

    var data = {
        name: "Raffles Inc",
        description: "Rifa: Ducati",
        invoice: generarNumeroAleatorioUnico(),
        currency: "cop",
        amount: "10000",
        tax_base: "0",
        tax: "0",
        country: "co",
        lang: "es",
        external: "true",
        response: "http://127.0.0.1:5500/respuesta.html",
        confirmation: "http://127.0.0.1:5500",
        mobile: true
    };

    document.getElementById('pagar-epayco').onclick = function(e) {
        e.preventDefault();
        handler.open(data);
    };

    document.getElementById('pagar-paypal').onclick = function(e) {
        e.preventDefault();
        document.getElementById('form_pay_paypal').submit();
    };

    jQuery("#numberInvoice").val(generarNumeroAleatorioUnico());

    var selectElement = document.getElementById('numberLotery');

    // Generar y añadir opciones del 01 al 100
    for (let i = 1; i <= 100; i++) {
      // Crear un nuevo elemento <option>
      var option = new Option(i.toString().padStart(2, '0'), i.toString().padStart(2, '0'));
      // Añadir el elemento <option> al <select>
      selectElement.add(option);
    }

    function guardarCarritoSS() {
        sessionStorage.setItem('cart_raffle', JSON.stringify(listaNumeros));
        cargarCarritoSS();
    }

    function cargarCarritoSS() {
        const carritoJSON = sessionStorage.getItem('cart_raffle');
        if (carritoJSON) {
            listaNumeros = JSON.parse(carritoJSON);
        } else {
            listaNumeros = [];
        }
        showCarrito();
    }
    
    function actualizarTotal() {
        let total = 0;
        const precio_boleta = parseInt(jQuery("#valorHidden").val());
        listaNumeros.forEach((element) => {
            total += precio_boleta
        });
        const totalFormateado = total.toLocaleString();
        jQuery("#total").text(totalFormateado);
    }

    function añadirNumero() {
        const numeroBoleta = jQuery("#numberLotery").val();
        if(numeroBoleta == undefined || numeroBoleta == "-1" || numeroBoleta == ""){
            toastWarning("Selecciona un numero");
            return;
        }
        const numeroIndex = listaNumeros.findIndex(item => item.numero_boleta === numeroBoleta);
        if (numeroIndex === -1) {
            const newItem = {
                item: ++Citem,
                numero_boleta: numeroBoleta
            };
            listaNumeros.push(newItem);
            jQuery('#numberLotery').selectpicker('val', '-1');
            actualizarTotal();
            guardarCarritoSS();
            toastSuccess("Numero: " + numeroBoleta + " agregado correctamente");
        } else {
            toastWarning("Ya seleccionaste este numero" );
        }
    }

    function eliminarNumero(numeroBoleta) {
        const numeroIndex = listaNumeros.findIndex(item => item.numero_boleta === numeroBoleta);
        if (numeroIndex !== -1) {
            listaNumeros.splice(numeroIndex, 1);
        } else {
            toastWarning("Este numero no se encuentra en la lista" );
        }
        if (listaNumeros.length < 1) {
            listaNumeros = [];
            jQuery("#contadorCarrito").text("0");
        }
        actualizarTotal();
        guardarCarritoSS();
    }

    function eliminarTodosNumeros() {
        listaNumeros = [];
        jQuery("#contadorCarrito").text("0");
        actualizarTotal();
        guardarCarritoSS();
    }

    function organizarItem() {
        Citem = 0;
        listaNumeros.forEach((element) => {
            ++Citem;
            element.item = Citem;
        });
    }

    function showCarrito() {
        if (listaNumeros.length > 0) {
            jQuery("#contadorCarrito").text(listaNumeros.length);
            organizarItem();
            jQuery("#divShopingCart").html("");
            let html = ``;
            listaNumeros.forEach((element) => {
                html += `<!--begin::Item-->
                <div class="d-flex align-items-center justify-content-between py-8">
                    <div class="d-flex flex-column mr-2">
                        <a class="font-weight-bold text-dark-75 font-size-lg text-hover-primary">
                            Numero ${element.item}
                        </a>
                        <span class="text-muted">
                            -- ${element.numero_boleta}
                        </span>
                    </div>
                    <a class="symbol symbol-70 flex-shrink-0">
                        <a onclick="eliminarNumero('${element.numero_boleta}');" class="btn btn-xs btn-light-success btn-icon mr-2">X</a>
                    </a>
                </div>
                <!--end::Item-->
                <!--begin::Separator-->
                <div class="separator separator-solid"></div>
                <!--end::Separator-->`;
            });
            jQuery("#divShopingCart").html(html);
        } else {
            const html = `<div class="mt-5 text-center"><span>Ningun numero seleccionado</span></div>`;
            jQuery("#contadorCarrito").text("0");
            jQuery("#divShopingCart").html(html);
        }
    }

    function toastSuccess(mensaje) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-center-modificado",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        toastr.success(mensaje);
    }
    
    function toastWarning(mensaje) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-center-modificado", // Usa la clase CSS personalizada
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        toastr.warning(mensaje);
    }