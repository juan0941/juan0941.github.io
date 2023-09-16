const playBoard = document.querySelector(".play-board");
const scoreElemt = document.querySelector(".score");
const highscoreElemt = document.querySelector(".high-score");
let gameover = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;

highscoreElemt.innerHTML = `high-score: ${highScore}`;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handlegameover = () => {
    clearInterval(setIntervalId);
    alert("Game Over");
    location.reload();
}

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Agregar soporte para eventos táctiles
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Determinar la dirección basada en el desplazamiento táctil
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Desplazamiento horizontal
        if (deltaX > 0 && velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
        } else if (deltaX < 0 && velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
        }
    } else {
        // Desplazamiento vertical
        if (deltaY > 0 && velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (deltaY < 0 && velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
        }
    }

    // Limpiar los valores de inicio para evitar movimientos no deseados
    touchStartX = 0;
    touchStartY = 0;
}

const initGame = () => {
    if (gameover) return handlegameover();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX};" > </div>`;

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElemt.innerHTML = `Score: ${score}`;
        highscoreElemt.innerHTML = `high-score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameover = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]};" > </div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameover = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
