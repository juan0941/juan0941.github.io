const menu = document.querySelector('.menuNavegacion');
const navegacion = document.querySelector('.navegacion');
const imagenes = document.querySelectorAll('img');
const btnTodas = document.querySelector('.Todas')
const btnClubes = document.querySelector('.Clubes')
const btnSelecciones = document.querySelector('.Selecciones')
const btnRetro = document.querySelector('.Retro')
const contenedorCamisas = document.querySelector('.camisas')
document.addEventListener('DOMContentLoaded', () => {
    eventos();
    camisas();
});

const eventos = () => {
    menu.addEventListener('click', abrirMenu);
};

const abrirMenu = () => {
    navegacion.classList.remove('ocultar')
    botonCerrar();
};

const botonCerrar = () => {
    const btnCerrar = document.createElement('P');
    const overlay = document.createElement('div');
    overlay.classList.add('pantalla-completa');
    const body = document.querySelector('body'); 
    if(document.querySelectorAll('.pantalla-completa').length > 0) return
    body.appendChild(overlay); 
    btnCerrar.textContent = 'x';
    btnCerrar.classList.add('btn-cerrar');
    navegacion.appendChild(btnCerrar);
    cerrarMenu(btnCerrar, overlay);
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const imagen = entry.target;
            imagen.src = imagen.dataset.src;
            observer.unobserve(imagen);
        }
    });
});

imagenes.forEach(imagen => {
    observer.observe(imagen);
});


const cerrarMenu = (boton, overlay) => {
    boton.addEventListener('click',()=>{
      navegacion.classList.add('ocultar')
      overlay.remove();
      boton.remove();
    });

    overlay.onclick = function(){
        navegacion.classList.add('ocultar')
        overlay.remove();
        boton.remove();
    }
}

const obtenerCamisas = () => {
    const camisas = Array.from(document.querySelectorAll('.camisa'));
    const Clubes = camisas.filter(camisa => camisa.getAttribute('data-camisa') === 'Clubes');
    const Selecciones = camisas.filter(camisa => camisa.getAttribute('data-camisa') === 'Selecciones');
    const Retro = camisas.filter(camisa => camisa.getAttribute('data-camisa') === 'Retro');
    mostrarCamisas(Clubes, Selecciones, Retro, camisas);
}

const mostrarCamisas = (Clubes, Selecciones, Retro, todas) => {
    btnClubes.addEventListener('click', () => {
        contenedorCamisas.innerHTML = '';
        Clubes.forEach(camisa => contenedorCamisas.appendChild(camisa));
    });

    btnSelecciones.addEventListener('click', () => {
        contenedorCamisas.innerHTML = '';
        Selecciones.forEach(camisa => contenedorCamisas.appendChild(camisa));
    });

    btnRetro.addEventListener('click', () => {
        contenedorCamisas.innerHTML = '';
        Retro.forEach(camisa => contenedorCamisas.appendChild(camisa));
    });

    btnTodas.addEventListener('click', () => {
        contenedorCamisas.innerHTML = '';
        todas.forEach(camisa => contenedorCamisas.appendChild(camisa));
    });
}

obtenerCamisas();

