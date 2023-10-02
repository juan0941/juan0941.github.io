const canvas = document.getElementById('girasolCanvas');
const context = canvas.getContext('2d');

// Dibuja el girasol
function dibujarGirasol() {
    // Código del girasol (el que proporcionaste)
    const phi = 137.508 * (Math.PI / 180.0);
    for (let i = 0; i < 200; i++) {
        const r = 4 * Math.sqrt(i);
        const theta = i * phi;
        const x = r * Math.cos(theta) + canvas.width / 2;
        const y = r * Math.sin(theta) + canvas.height / 2;
        context.fillStyle = i < 160 ? 'yellow' : 'brown';
        context.beginPath();
        context.arc(x, y, 2, 0, Math.PI * 2);
        context.fill();
    }

    // Escribe "Te Quiero" en la parte superior del girasol
    context.font = '24px Arial';
    context.fillStyle = 'purple';
    context.fillText('Te Amo', canvas.width / 2 - 40, 40);
}

// Dibuja el girasol cuando se carga la página
window.onload = function() {
    dibujarGirasol();
};
