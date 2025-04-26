document.addEventListener('DOMContentLoaded', function () {
    // -------------------------------------------------------------------------
    // Funcionalidad del Menú de Navegación (Hamburguesa)
    // -------------------------------------------------------------------------
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const headerMenu = document.querySelector('.header-menu');

    hamburgerMenu.addEventListener('click', () => {
        headerMenu.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
        if (!headerMenu.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            headerMenu.classList.remove('show');
        }
    });

    document.querySelectorAll('.header-menu a').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 770) {
                headerMenu.classList.remove('show');
            }
        });
    });

    // -------------------------------------------------------------------------
    // Funcionalidad de la Sección de Preguntas Frecuentes (FAQ)
    // -------------------------------------------------------------------------
    const preguntas = document.querySelectorAll('.faq-pregunta');

    preguntas.forEach(pregunta => {
        pregunta.addEventListener('click', () => {
            const respuesta = pregunta.nextElementSibling;
            respuesta.classList.toggle('mostrar');
        });
    });

    // -------------------------------------------------------------------------
    // Funcionalidad de carrusel para comentario de los usuarios
    // -------------------------------------------------------------------------

    if (document.querySelector(".testimonios-galeria")) {
        // Solo ejecuta el código del carrusel si .testimonios-galeria existe

        const galeria = document.querySelector(".testimonios-galeria");
        const prevBtn = document.querySelector(".prev");
        const nextBtn = document.querySelector(".next");
        const indicadoresContainer = document.querySelector(".indicadores");

        if (galeria && prevBtn && nextBtn && indicadoresContainer) {
            let index = 0;
            const testimonios = document.querySelectorAll(".testimonio");
            const totalTestimonios = testimonios.length;
            let autoplayInterval;

            // Crear indicadores (dots)
            testimonios.forEach((_, i) => {
                const indicador = document.createElement("span");
                indicador.classList.add("indicador");
                if (i === 0) indicador.classList.add("activo");
                indicador.dataset.index = i;
                indicadoresContainer.appendChild(indicador);
            });

            const indicadores = document.querySelectorAll(".indicador");

            // Función para actualizar el carrusel
            function actualizarCarrusel() {
                galeria.style.transform = `translateX(-${index * 100}%)`;

                // Actualizar indicadores
                indicadores.forEach(dot => dot.classList.remove("activo"));
                indicadores[index].classList.add("activo");
            }

            // Botón siguiente
            nextBtn.addEventListener("click", function () {
                index = (index + 1) % totalTestimonios;
                actualizarCarrusel();
                reiniciarAutoplay();
            });
        
            // Botón anterior
            prevBtn.addEventListener("click", function () {
                index = (index - 1 + totalTestimonios) % totalTestimonios;
                actualizarCarrusel();
                reiniciarAutoplay();
            });
        
            // Evento para los indicadores
            indicadores.forEach(dot => {
                dot.addEventListener("click", function () {
                    index = parseInt(this.dataset.index);
                    actualizarCarrusel();
                    reiniciarAutoplay();
                });
            });

            // Autoplay
            function iniciarAutoplay() {
                autoplayInterval = setInterval(() => {
                    index = (index + 1) % totalTestimonios;
                    actualizarCarrusel();
                }, 3000);
            }

            function reiniciarAutoplay() {
                clearInterval(autoplayInterval);
                iniciarAutoplay();
            }

            iniciarAutoplay();

            // Swipe en móviles
            let startX = 0;

            galeria.addEventListener("touchstart", (e) => {
                startX = e.touches[0].clientX;
            });

            galeria.addEventListener("touchend", (e) => {
                let endX = e.changedTouches[0].clientX;
                let diff = startX - endX;

                if (diff > 50) {
                    index = (index + 1) % totalTestimonios;
                } else if (diff < -50) {
                    index = (index - 1 + totalTestimonios) % totalTestimonios;
                }

                actualizarCarrusel();
                reiniciarAutoplay();
            });
        }
    }

    // -------------------------------------------------------------------------
    // Funcionalidad de la Carga de Imágenes en el Formulario de Contacto
    // -------------------------------------------------------------------------

    if (document.querySelector('.formulario-contacto')) {
        const inputImagenes = document.getElementById('imagenes');
        const previewImagenes = document.getElementById('preview-imagenes');

        inputImagenes.addEventListener('change', () => {
            previewImagenes.innerHTML = ''; // Limpia las vistas previas anteriores

            if (inputImagenes.files) {
                Array.from(inputImagenes.files).forEach(file => {
                    const lector = new FileReader();

                    lector.onload = function (e) {
                        const imagenPreview = document.createElement('img');
                        imagenPreview.src = e.target.result;
                        imagenPreview.classList.add('imagen-preview');
                        previewImagenes.appendChild(imagenPreview);
                    };

                    lector.readAsDataURL(file);
                });
            }
        });
    }

    // -------------------------------------------------------------------------
    // Funcionalidad de la Página de Listado de Recetas (listado.html)
    // -------------------------------------------------------------------------

    if (document.querySelector('.recetas-listado')) {
        const recetasListado = document.querySelector('.recetas-listado');
        const recetasItems = document.querySelectorAll('.receta-item');
        const buscador = document.getElementById('buscador');
        const categoriaFiltro = document.getElementById('categoria-filtro');

        function ajustarScroll() {
            const elementosVisibles = Array.from(recetasItems).filter(item => {
                return window.getComputedStyle(item).display !== 'none';
            });

            const cantidadFilas = Math.ceil(elementosVisibles.length / Math.floor(recetasListado.offsetWidth / 270));

            if (cantidadFilas > 3) {
                recetasListado.style.maxHeight = '80vh';
                recetasListado.style.overflowY = 'auto';
            } else {
                recetasListado.style.maxHeight = 'none';
                recetasListado.style.overflowY = 'visible';
            }
        }

        function filtrarRecetas() {
            const textoBusqueda = buscador.value.toLowerCase();
            const categoriaSeleccionada = categoriaFiltro.value;

            recetasItems.forEach(item => {
                const titulo = item.querySelector('h2').textContent.toLowerCase();
                const categorias = item.dataset.categorias.split(', ');

                const coincideBusqueda = titulo.includes(textoBusqueda);
                const coincideCategoria = categoriaSeleccionada === '' || categorias.includes(categoriaSeleccionada);

                item.style.display = coincideBusqueda && coincideCategoria ? 'block' : 'none';
            });

            ajustarScroll();
        }

        buscador.addEventListener('input', filtrarRecetas);
        categoriaFiltro.addEventListener('change', filtrarRecetas);

        ajustarScroll();
        window.addEventListener('resize', ajustarScroll);
    }

    // -------------------------------------------------------------------------
    // Funcionalidad de los Botones "Ingredientes"
    // -------------------------------------------------------------------------
    const botonesIngredientes = document.querySelectorAll('.ingredientes-btn');

    botonesIngredientes.forEach(boton => {
        boton.addEventListener('click', function () {
            this.nextElementSibling.classList.toggle('oculto');
        });
    });

    // -------------------------------------------------------------------------
    // Funcionalidad de la Página de Receta Individual
    // -------------------------------------------------------------------------
    if (document.getElementById('cantidad-unidades')) {
        const cantidadUnidadesSelect = document.getElementById('cantidad-unidades');
        const ingredientesLista = document.querySelectorAll('.listado-ingredientes li');
        const cantidadBase = parseInt(cantidadUnidadesSelect.dataset.base);

        function formatearCantidad(cantidad, unidad) {
            if (unidad === 'g' && cantidad >= 1000) return parseFloat((cantidad / 1000).toFixed(2)) + ' kg';
            if (unidad === 'ml' && cantidad >= 1000) return parseFloat((cantidad / 1000).toFixed(2)) + ' L';
            return convertirAFraccion(cantidad) + ' ' + unidad;
        }

        function convertirAFraccion(numero) {
            if (numero >= 1) return Math.round(numero);

            const fracciones = [
                { valor: 1 / 8, simbolo: '⅛' },
                { valor: 1 / 4, simbolo: '¼' },
                { valor: 1 / 3, simbolo: '⅓' },
                { valor: 1 / 2, simbolo: '½' },
                { valor: 2 / 3, simbolo: '⅔' },
                { valor: 3 / 4, simbolo: '¾' },
            ];

            for (const fraccion of fracciones) {
                if (Math.abs(numero - fraccion.valor) < 0.02) return fraccion.simbolo;
            }

            return numero.toFixed(2);
        }

        function actualizarIngredientes(cantidadUnidades) {
            const factor = cantidadUnidades / cantidadBase;

            ingredientesLista.forEach(li => {
                const spanCantidad = li.querySelector('span');
                const cantidadBase = parseFloat(li.dataset.cantidad);
                const unidad = li.dataset.unidad;

                if (!isNaN(cantidadBase)) {
                    spanCantidad.textContent = formatearCantidad(cantidadBase * factor, unidad);
                }
            });
        }

        cantidadUnidadesSelect.addEventListener('change', function () {
            actualizarIngredientes(parseInt(this.value));
        });

        actualizarIngredientes(parseInt(cantidadUnidadesSelect.value));
    }

    // -------------------------------------------------------------------------
    // Funcionalidad de Widget
    // -------------------------------------------------------------------------
   
    const widget = document.querySelector('.herramientas-widget');
    const toggle = widget.querySelector('.widget-toggle');
    
    let isDragging = false;
    let offsetX, offsetY;
    
    widget.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        offsetX = e.clientX - widget.offsetLeft;
        offsetY = e.clientY - widget.offsetTop;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        widget.style.left = e.clientX - offsetX + 'px';
        widget.style.top = e.clientY - offsetY + 'px';
    });
    
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        widget.style.left = '20px'; // Ajusta la posición al lado izquierdo
    });
    
    toggle.addEventListener('click', () => {
        widget.classList.toggle('plegado');
    });

});