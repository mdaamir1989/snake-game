let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let primary = "#AF1E2D";
let secondary = "#FFCE00";

const grid = 32;
let count = 0;
let score = 0;
let highestScore = 0;

let snake = {
    x: grid * 5,
    y: grid * 5,

    vx: grid,
    vy: 0,

    cells: [],

    maxCells: 4
}

let apple = {
    x: grid * 10,
    y: grid * 10
};

function Update() {
    requestAnimationFrame(Update);

    if (++count < 4) {
        return;
    }

    count = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.vx;
    snake.y += snake.vy;

    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    snake.cells.unshift({
        x: snake.x,
        y: snake.y
    });

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Draw apple.
    ctx.fillStyle = secondary;
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // Draw snake
    ctx.fillStyle = primary;
    snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score++;

            // Horizontal blocks = canvas width/ 32
            apple.x = getRandomInt(0, 24) * grid;
            // Vertical blocks = canvas height/ 32
            apple.y = getRandomInt(0, 14) * grid;
        }

        // i + 1 because the head cannot collide with the head
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                highestScore = score;

                if (localStorage) {
                    localStorage.setItem('highestScore', highestScore);
                }

                window.location.reload();
            }
        }
    });

    // Display score
    ctx.font = "72px Helvetica";
    ctx.fillStyle = "rgba(255,255,255, 0.25)";
    ctx.textAlign = "center";
    ctx.fillText(score, canvas.width / 2, canvas.height / 2);

    // Display High Score
    ctx.font = "24px Helvetica";
    ctx.fillStyle = "#f3F3F3";
    ctx.textAlign = "end";

    highestScore = localStorage?.getItem('highestScore') || 0;
    ctx.fillText(`Highest Score : ${highestScore}`, canvas.width - (grid * 3), grid);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

document.addEventListener("keydown", evt => {
    if (evt.which === 37 && snake.vx === 0) {
        snake.vx = -grid;
        snake.vy = 0;
    } else if (evt.which === 38 && snake.vy === 0) {
        snake.vy = -grid;
        snake.vx = 0;
    } else if (evt.which === 39 && snake.vx === 0) {
        snake.vx = grid;
        snake.vy = 0;
    } else if (evt.which === 40 && snake.vy === 0) {
        snake.vy = grid;
        snake.vx = 0;
    }
});

// Starts the game
requestAnimationFrame(Update);