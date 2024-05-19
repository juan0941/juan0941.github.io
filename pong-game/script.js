// Variables globales
var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

var rounds = [5, 5, 3, 3, 2];
var colors = ['#1abc9c', '#2ecc71', '#3498db', '#8c52ff', '#9b59b6'];

// Coordenadas de la bola en x y
var ballStartX, ballStartY;

// El objeto bola
var Ball = {
    new: function (incrementedSpeed) {
        ballStartX = (this.canvas.width / 2) - 9;
        ballStartY = (this.canvas.height / 2) - 9;
        return {
            width: 18,
            height: 18,
            x: ballStartX,
            y: ballStartY,
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
            speed: incrementedSpeed || 7 
        };
    }
};

// El objeto AI (Las dos líneas que se mueven hacia arriba y hacia abajo)
var Ai = {
    new: function (side) {
        return {
            width: 18,
            height: 180,
            x: side === 'left' ? 150 : this.canvas.width - 150,
            y: (this.canvas.height / 2) - 35,
            score: 0,
            move: DIRECTION.IDLE,
            speed: 8
        };
    }
};

var Game = {
    initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.width = 1400;
        this.canvas.height = 1000;

        this.canvas.style.width = (this.canvas.width / 2) + 'px';
        this.canvas.style.height = (this.canvas.height / 2) + 'px';

        this.player = Ai.new.call(this, 'left');
        this.ai = Ai.new.call(this, 'right');
        this.ball = Ball.new.call(this);

        this.ai.speed = 5;
        this.running = this.over = false;
        this.turn = this.ai;
        this.timer = this.round = 0;
        this.color = '#8c52ff';

        Pong.menu();
        Pong.listen();
    },

    endGameMenu: function (text) {
        // Cambiar el tamaño y el color
        Pong.context.font = '45px Courier New';
        Pong.context.fillStyle = this.color;

        // Dibuja el rectángulo detrás del texto "Presiona cualquier tecla para comenzar".
        Pong.context.fillRect(
            Pong.canvas.width / 2 - 350,
            Pong.canvas.height / 2 - 48,
            700,
            100
        );

        // Cambiar el color del lienzo
        Pong.context.fillStyle = '#ffffff';

        // Dibuja el texto del menú final del juego ('Game Over' y 'Ganador')
        Pong.context.fillText(text,
            Pong.canvas.width / 2,
            Pong.canvas.height / 2 + 15
        );

        setTimeout(function () {
            Pong = Object.assign({}, Game);
            Pong.initialize();
        }, 3000);
    },

    menu: function () {
        // Dibuja todos los objetos de Pong en su estado actual
        Pong.draw();

        // Cambiar el tamaño de la fuente y el color del lienzo
        this.context.font = '50px Courier New';
        this.context.fillStyle = this.color;

        // Dibuja el rectángulo detrás del texto 'Presione cualquier tecla para comenzar'.
        this.context.fillRect(
            this.canvas.width / 2 - 350,
            this.canvas.height / 2 - 48,
            700,
            100
        );

        // Cambiar el color del lienzo
        this.context.fillStyle = '#ffffff';

        // Dibuja el texto 'Presione cualquier tecla para comenzar'
        this.context.fillText('Presione cualquier tecla ',
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );
    },

    // Actualiza todos los objetos (mueve al jugador, ai, bola, incrementa la puntuación, etc.)
    update: function () {
        if (!this.over) {
            // Si la bola choca con los límites, corrige las coordenadas x e y.
            if (this.ball.x <= 0) Pong._resetTurn.call(this, this.ai, this.player);
            if (this.ball.x >= this.canvas.width - this.ball.width) Pong._resetTurn.call(this, this.player, this.ai);
            if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
            if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

            // Mueve al jugador si el valor de player.move fue actualizado por un evento de teclado
            if (this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
            else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

            // En un nuevo servicio (inicio de cada turno) mueve la bola al lado correcto
            // y aleatoriza la dirección para agregar desafío.
            if (Pong._turnDelayIsOver.call(this) && this.turn) {
                this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
                this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
                this.ball.y = Math.floor(Math.random() * (this.canvas.height - 200)) + 200;
                this.turn = null;
            }

            // Si el jugador choca con los límites, actualiza las coordenadas x e y.
            if (this.player.y <= 0) this.player.y = 0;
            else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

            // Mueve la bola en la dirección deseada según los valores de moveY y moveX
            if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
            else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
            if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
            else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

            // Maneja el movimiento de UP y DOWN del AI
            if (this.ai.y > this.ball.y - (this.ai.height / 2)) {
                if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y -= this.ai.speed / 1.25;
                else this.ai.y -= this.ai.speed / 4;
            }
            if (this.ai.y < this.ball.y - (this.ai.height / 2)) {
                if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y += this.ai.speed / 1.25;
                else this.ai.y += this.ai.speed / 4;
            }

            // Maneja la colisión del AI con la pared
            if (this.ai.y >= this.canvas.height - this.ai.height) this.ai.y = this.canvas.height - this.ai.height;
            else if (this.ai.y <= 0) this.ai.y = 0;

            // Maneja las colisiones jugador-bola
            if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
                if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
                    this.ball.x = (this.player.x + this.ball.width);
                    this.ball.moveX = DIRECTION.RIGHT;
                }
            }

            // Maneja las colisiones AI-bola
            if (this.ball.x - this.ball.width <= this.ai.x && this.ball.x >= this.ai.x - this.ai.width) {
                if (this.ball.y <= this.ai.y + this.ai.height && this.ball.y + this.ball.height >= this.ai.y) {
                    this.ball.x = (this.ai.x - this.ball.width);
                    this.ball.moveX = DIRECTION.LEFT;
                }
            }
        }

        // Maneja la transición al final de la ronda
        // Verifica si el jugador ganó la ronda.
        if (this.player.score === rounds[this.round]) {
            // Verifica si hay más rondas/niveles y muestra la pantalla de victoria si no hay más.
            if (!rounds[this.round + 1]) {
                this.over = true;
                setTimeout(function () { Pong.endGameMenu('¡Ganaste!'); }, 1000);
            } else {
                // Si hay otra ronda, restablece todos los valores e incrementa el número de ronda.
                this.color = this._generateRoundColor();
                this.player.score = this.ai.score = 0;
                this.player.speed += 0.5;
                this.ai.speed += 1;
                this.ball.speed += 1;
                this.round += 1;
            }
        }
        // Verifica si el AI ha ganado la ronda.
        else if (this.ai.score === rounds[this.round]) {
            this.over = true;
            setTimeout(function () { Pong.endGameMenu('¡Game Over!'); }, 1000);
        }
    },

    draw: function () {
        // Limpia el lienzo
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        // Establece el color de fondo
        this.context.fillStyle = this.color;

        // Dibuja el fondo
        this.context.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        // Establece el color de los objetos
        this.context.fillStyle = '#ffffff';

        // Dibuja al jugador
        this.context.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );

        // Dibuja al AI
        this.context.fillRect(
            this.ai.x,
            this.ai.y,
            this.ai.width,
            this.ai.height
        );

        // Dibuja la bola
        if (Pong._turnDelayIsOver.call(this)) {
            this.context.fillRect(
                this.ball.x,
                this.ball.y,
                this.ball.width,
                this.ball.height
            );
        }

        // Dibuja la red (línea vertical en el centro)
        this.context.beginPath();
        this.context.setLineDash([7, 15]);
        this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140);
        this.context.lineTo((this.canvas.width / 2), 140);
        this.context.lineWidth = 10;
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();

        // Establece el tamaño de la fuente y el color del texto
        this.context.font = '100px Courier New';
        this.context.textAlign = 'center';

        // Dibuja la puntuación de los jugadores
        this.context.fillText(
            this.player.score.toString(),
            (this.canvas.width / 2) - 300,
            200
        );

        // Dibuja la puntuación del AI
        this.context.fillText(
            this.ai.score.toString(),
            (this.canvas.width / 2) + 300,
            200
        );

        // Cambia el tamaño de la fuente para el texto de la ronda
        this.context.font = '30px Courier New';

        // Dibuja el número de ronda
        this.context.fillText(
            'Ronda ' + (Pong.round + 1),
            (this.canvas.width / 2),
            35
        );

        // Cambia el tamaño de la fuente para el texto de la velocidad de la bola
        this.context.font = '40px Courier';

        // Dibuja la velocidad de la bola
        this.context.fillText(
            this.ball.speed.toString(),
            (this.canvas.width / 2),
            this.canvas.height - 35
        );
    },

    loop: function () {
        Pong.update();
        Pong.draw();

        // Si el juego no ha terminado, vuelve a ejecutar el bucle
        if (!Pong.over) requestAnimationFrame(Pong.loop);
    },

    listen: function () {
        document.addEventListener('keydown', function (key) {
            // Mueve al jugador arriba
            if (key.keyCode === 38 || key.keyCode === 87) Pong.player.move = DIRECTION.UP;

            // Mueve al jugador abajo
            if (key.keyCode === 40 || key.keyCode === 83) Pong.player.move = DIRECTION.DOWN;

            // Si el juego no está en ejecución, comienza el juego.
            if (!Pong.running) {
                Pong.running = true;
                window.requestAnimationFrame(Pong.loop);
            }
        });

        // Detiene el movimiento del jugador al soltar las teclas
        document.addEventListener('keyup', function (key) { Pong.player.move = DIRECTION.IDLE; });
    },

    // Restablece la ronda de la partida
    _resetTurn: function(victor, loser) {
        this.ball = Ball.new.call(this, this.ball.speed);
        this.turn = loser;
        this.timer = (new Date()).getTime();

        victor.score++;
    },

    // Comprueba si el retraso de turno ha terminado (al inicio y después de un punto)
    _turnDelayIsOver: function() {
        return ((new Date()).getTime() - this.timer >= 1000);
    },

    // Genera un color aleatorio para cada ronda.
    _generateRoundColor: function () {
        var newColor = colors[Math.floor(Math.random() * colors.length)];
        if (newColor === this.color) return Pong._generateRoundColor();
        return newColor;
    }
};

var Pong = Object.assign({}, Game);
Pong.initialize();
