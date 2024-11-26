const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth / 1.5;
canvas.height = window.innerHeight / 1.5;

const shapes = [];
let currentShape = 'circle';
let currentColor = '#FF0000';
let currentSize = 25;
let currentSpeed = 5;
let currentAngle = 0;
const gravity = 0.1; // Gravity constant

const colorInput = document.getElementById('colorInput');
colorInput.addEventListener('input', (event) => {
    currentColor = event.target.value;
});

const shapeSelect = document.getElementById('shapes');
shapeSelect.addEventListener('change', (event) => {
    currentShape = event.target.value;
});

const sizeSlider = document.getElementById('myRange');
const sizeValue = document.getElementById('sizeValue');
sizeSlider.addEventListener('input', (event) => {
    currentSize = parseInt(event.target.value, 10);
    sizeValue.textContent = currentSize;
});

const speedSlider = document.getElementById('myRangeSpeed');
const speedValue = document.getElementById('speedValue');
speedSlider.addEventListener('input', (event) => {
    currentSpeed = parseInt(event.target.value, 10);
    speedValue.textContent = currentSpeed;
});

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
    ctx.fillStyle = 'black';
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


        shape.x += shape.velocityX;
        shape.y += shape.velocityY;


        if (shape.x - shape.radius < 0 || shape.x + shape.radius > canvas.width) {
            shape.velocityX = -shape.velocityX;
        }
        if (shape.y - shape.radius < 0 || shape.y + shape.radius > canvas.height) {
            shape.velocityY = -shape.velocityY;
        }


        shapes.forEach(otherShape => {
            if (shape !== otherShape) {
                const dx = shape.x - otherShape.x;
                const dy = shape.y - otherShape.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < shape.radius + otherShape.radius) {

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