document.addEventListener('DOMContentLoaded', () => {
    // Selección de elementos
    const menu = document.querySelector('.menuNavegacion');
    const logo = document.querySelector('.logo');
    const navegacion = document.querySelector('.navegacion');
    const slider = document.querySelector('.slider .list');
    const items = document.querySelectorAll('.slider .list .item');
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');
    const dots = document.querySelectorAll('.slider .dots li');

    let lengthItems = items.length - 1;
    let active = 0;
    let refreshInterval = setInterval(() => next.click(), 3000);

    // Función para mostrar el corazón
    function showHeart(element) {
        const heart = element.querySelector('.heart');
        heart.style.display = 'block';
        
        // Reiniciar la animación
        heart.style.animation = 'none';
        heart.offsetHeight; // Forzar el reflujo para reiniciar la animación
        heart.style.animation = 'fadeOut 2s forwards';
    
        // Ocultar el corazón después de la animación
        setTimeout(() => {
            heart.style.display = 'none';
        }, 2000);
    }

    // Funcionalidad para detectar doble toque en dispositivos táctiles
    document.querySelectorAll('.contenedor-corazon').forEach(element => {
        let touchCount = 0;
        element.addEventListener('touchstart', function() {
            touchCount++;
            if (touchCount === 1) {
                setTimeout(() => {
                    touchCount = 0;
                }, 300); // Tiempo para detectar un doble toque (300 ms)
            } else if (touchCount === 2) {
                showHeart(element);
                touchCount = 0; // Resetear el contador después del doble toque
            }
        });
    });

    // Funcionalidad del slider
    function updateSlider() {
        const itemWidth = items[0].offsetWidth;
        slider.style.transform = `translateX(-${active * itemWidth}px)`;

        // Actualiza los dots
        document.querySelector('.slider .dots li.active').classList.remove('active');
        dots[active].classList.add('active');

        clearInterval(refreshInterval);
        refreshInterval = setInterval(() => next.click(), 3000);
    }

    next.onclick = function() {
        active = (active + 1 <= lengthItems) ? active + 1 : 0;
        updateSlider();
    };

    prev.onclick = function() {
        active = (active - 1 >= 0) ? active - 1 : lengthItems;
        updateSlider();
    };

    dots.forEach((li, key) => {
        li.addEventListener('click', () => {
            active = key;
            updateSlider();
        });
    });

    window.addEventListener('resize', updateSlider);

    // Inicializa el slider al cargar la página
    updateSlider();

    // Configuración de eventos
    const setupEvents = () => {
        menu.addEventListener('click', abrirMenu);
        window.addEventListener('scroll', handleScroll);
    };

    const abrirMenu = () => {
        navegacion.classList.remove('ocultar');
        mostrarBotonCerrar();
    };

    const handleScroll = () => {
        if (window.scrollY > 50) {
            logo.classList.add('cerrar');
        } else {
            logo.classList.remove('cerrar');
        }
    };

    const mostrarBotonCerrar = () => {
        const btnCerrar = document.createElement('P');
        const overlay = document.createElement('div');
        const body = document.querySelector('body');

        overlay.classList.add('pantalla-completa');
        btnCerrar.textContent = 'x';
        btnCerrar.classList.add('btn-cerrar');
        
        if (document.querySelectorAll('.pantalla-completa').length > 0) return;

        body.appendChild(overlay);
        navegacion.appendChild(btnCerrar);
        
        cerrarMenu(btnCerrar, overlay);
    };

    const cerrarMenu = (boton, overlay) => {
        const cerrar = () => {
            navegacion.classList.add('ocultar');
            overlay.remove();
            boton.remove();
        };

        boton.addEventListener('click', cerrar);
        overlay.addEventListener('click', cerrar);
    };

    setupEvents();
});
