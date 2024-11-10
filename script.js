const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth / 1.5;     // centralizar o canvas horizontalmente
canvas.height = window.innerHeight / 1.5;   // centralizar o canvas verticalmente

const shapes = [];
let currentShape = 'circle';
let currentColor = 'red';

const colorSelect = document.getElementById('colors');
colorSelect.addEventListener('change', (event) => {
    currentColor = event.target.value;
})

const shapeSelect = document.getElementById('shapes');
shapeSelect.addEventListener('change', (event) => {
    currentShape = event.target.value;
})

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(shape => {
        ctx.beginPath();

        // desenha dependendo da forma selecionada
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
    });
}

function spawnShape(x, y) {
    shapes.push({ x, y, radius: 30, type: currentShape, color: currentColor });
    console.log("Shape spawned at:", x, y, "Shape:", currentShape, "Color:", currentColor);
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    spawnShape(x, y);
});

function animate() {
    draw();
    requestAnimationFrame(animate);
}

animate();