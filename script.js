const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

const shapes = [];
let currentShape = 'circle';
let currentColor = '#757575';
let currentSize = 25;
let currentSpeed = 5;
let currentAngle = 0;
const gravity = 0.1; // gravidade constante

// pegar no valor da cor
const colorInput = document.getElementById('colorInput');
colorInput.addEventListener('input', (event) => {
    currentColor = event.target.value;
    colorInput.style.backgroundColor = currentColor
});

//pegar no valor da forma
const shapeButtons = document.querySelectorAll('.shape-btn');
const shapeName = document.getElementById('shapeValue');
shapeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        shapeButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        currentShape = event.target.getAttribute('data-shape');
        shapeName.innerHTML = currentShape.charAt(0).toUpperCase() + currentShape.slice(1);
    });
});

// pegar no valor do tamanho
const sizeSlider = document.getElementById('myRange');
const sizeValue = document.getElementById('sizeValue');
sizeSlider.addEventListener('input', (event) => {
    currentSize = parseInt(event.target.value, 10);
    sizeValue.textContent = currentSize;
});

// pegar no valor da velocidade
const speedSlider = document.getElementById('myRangeSpeed');
const speedValue = document.getElementById('speedValue');
speedSlider.addEventListener('input', (event) => {
    currentSpeed = parseInt(event.target.value, 10);
    speedValue.textContent = currentSpeed;
});

// pegar no valor do ângulo e ajustar a seta
const angleSlider = document.getElementById('angleRange');
const angleValue = document.getElementById('angleValue');
const arrow = document.getElementById('arrow');
angleSlider.addEventListener('input', (event) => {
    currentAngle = parseInt(event.target.value, 10);
    angleValue.textContent = currentAngle;
    arrow.style.transform = `rotate(${currentAngle}deg)`;
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const adjustedAngle = currentAngle - 90; 
    const radians = adjustedAngle * (Math.PI / 180);
    const shape = {
        type: currentShape,
        color: currentColor,
        x: x,
        y: y,
        radius: currentSize,
        velocityX: currentSpeed * Math.cos(radians),
        velocityY: currentSpeed * Math.sin(radians)
    };
    shapes.push(shape);
});

function draw() {
    ctx.fillStyle = '#b5b5b5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(shape => {
        ctx.beginPath();


        switch (shape.type) {
            case 'circle':
                ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
                break;
            case 'square':
                ctx.rect(shape.x - shape.radius, shape.y - shape.radius, shape.radius * 2, shape.radius * 2);
                break;
            case 'rectangle':
                ctx.rect(shape.x - shape.radius, shape.y - shape.radius / 2, shape.radius * 2, shape.radius);
                break;
            case 'triangle':
                ctx.moveTo(shape.x, shape.y - shape.radius);
                ctx.lineTo(shape.x - shape.radius, shape.y + shape.radius);
                ctx.lineTo(shape.x + shape.radius, shape.y + shape.radius);
                ctx.closePath();
                break;
        }
        ctx.fillStyle = shape.color;
        ctx.fill();
        ctx.closePath();

       
            shape.velocityY += gravity;

            // shape.velocityX *= 0.99
            // shape.velocityY *= 0.99
            shape.x += shape.velocityX;
            shape.y += shape.velocityY;
        
        


        if (shape.x - shape.radius < 0 || shape.x + shape.radius > canvas.width) {
            shape.velocityX *= 0.8
            shape.velocityX = -shape.velocityX;
        }
        if (shape.y - shape.radius < 0 || shape.y + shape.radius > canvas.height) {
            shape.y = canvas.height- shape.radius  
            shape.velocityY *= 0.8
            shape.velocityY = -shape.velocityY;
        }

       

        shapes.forEach(otherShape => {
            if (shape !== otherShape) {
                const dx = shape.x - otherShape.x;
                const dy = shape.y - otherShape.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < shape.radius + otherShape.radius) {
// tb diminuir aqui!
                    shape.velocityX = -shape.velocityX;
                    shape.velocityY = -shape.velocityY;
                    otherShape.velocityX = -otherShape.velocityX;
                    otherShape.velocityY = -otherShape.velocityY;
                }
            }
        });


       
    });

    requestAnimationFrame(draw);
}

draw();