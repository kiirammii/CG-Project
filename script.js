const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

const shapes = []; // array com todas as formas criadas
let currentShape = 'circle'; // forma inicial
let currentColor = '#757575'; // cor inicial
let currentSize = 25; // tamanho inicial
let currentSpeed = 5; // velocidade inicial
let currentAngle = 180; // angulo inicial é 180º 
const gravity = 0.1; // constante da gravidadade

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
const sizeSlider = document.getElementById('myRange'); // slider de tamanho
const sizeValue = document.getElementById('sizeValue');
sizeSlider.addEventListener('input', (event) => {
    currentSize = parseInt(event.target.value, 10);
    sizeValue.textContent = currentSize;
});

// pegar no valor da velocidade
const speedSlider = document.getElementById('myRangeSpeed'); // slider de velocidade
const speedValue = document.getElementById('speedValue');
speedSlider.addEventListener('input', (event) => {
    currentSpeed = parseInt(event.target.value, 10);
    speedValue.textContent = currentSpeed;
});

// pegar no valor do ângulo e ajustar a seta
const angleSlider = document.getElementById('angleRange'); // slider de ângulo
const angleValue = document.getElementById('angleValue');
const arrow = document.getElementById('arrow');
angleSlider.addEventListener('input', (event) => {
    const fixedAngle = currentAngle + 90;
    currentAngle = parseInt(event.target.value, 10);
    angleValue.textContent = currentAngle;
    arrow.style.transform = `rotate(${ 90 + currentAngle}deg)`;
});

arrow.style.transform = `rotate(${90 + currentAngle}deg)`; // ajustar posição da seta

canvas.addEventListener('click', (event) => { // criar o objeto
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const radians = (currentAngle ) * (Math.PI / 180); 
    const shape = { // propriedades da forma
        type: currentShape,
        color: currentColor,
        x: x,
        y: y,
        radius: currentSize,
        velocityX: currentSpeed * Math.cos(radians),
        velocityY: currentSpeed * Math.sin(radians),
        angle: currentAngle,
        speed: currentSpeed,
        rotationDirection: 1 
    };
    shapes.push(shape); // adiciona a forma ao array
});

const eraseAllButton = document.getElementById('eraseAllButton'); // apagar todos os objetos
eraseAllButton.addEventListener('click', () => {
    shapes.length = 0; // limpa o array com os objetos
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animationFrameId); // cancela as animações todas
    draw();
});

function draw() {
    ctx.fillStyle = '#b5b5b5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(shape => {
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.angle * Math.PI / 180);

        ctx.beginPath();
        switch (shape.type) {
            case 'circle':
                ctx.arc(0, 0, shape.radius, 0, Math.PI * 2);
                break;
            case 'square':
                ctx.rect(-shape.radius, -shape.radius, shape.radius * 2, shape.radius * 2);
                break;
            case 'rectangle':
                ctx.rect(-shape.radius, -shape.radius / 2, shape.radius * 2, shape.radius);
                break;
            case 'triangle':
                ctx.moveTo(0, -shape.radius);
                ctx.lineTo(-shape.radius, shape.radius);
                ctx.lineTo(shape.radius, shape.radius);
                ctx.closePath();
                break;
        }
        ctx.fillStyle = shape.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        shape.velocityY += gravity;
        shape.x += shape.velocityX;
        shape.y += shape.velocityY;

        // muda o angulo do objeto com base na velocidade
        shape.angle += shape.speed * shape.rotationDirection;
        shape.speed *= 0.99;

        if (shape.y - shape.radius < 0) {
            shape.y = shape.radius;
            shape.velocityY *= 0.8;
            shape.velocityY = -shape.velocityY;
            shape.rotationDirection = -shape.rotationDirection; 
        }

        if (shape.y + shape.radius > canvas.height) {
            shape.y = canvas.height - shape.radius;
            shape.velocityY *= 0.8;
            shape.velocityY = -shape.velocityY;
            shape.rotationDirection = -shape.rotationDirection; 
        }

        if (shape.x - shape.radius < 0) {
            shape.x = shape.radius;
            shape.velocityX *= 0.8;
            shape.velocityX = -shape.velocityX;
            shape.rotationDirection = -shape.rotationDirection; 
        }

        if (shape.x + shape.radius > canvas.width) {
            shape.x = canvas.width - shape.radius;
            shape.velocityX *= 0.8;
            shape.velocityX = -shape.velocityX;
            shape.rotationDirection = -shape.rotationDirection; 
        }

        
        shapes.forEach(otherShape => { // colisão entre objetos
            if (shape !== otherShape) {
                const dx = shape.x - otherShape.x;
                const dy = shape.y - otherShape.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                let shapeRadius = shape.radius;
                let otherShapeRadius = otherShape.radius;

                if (shape.type === 'rectangle') { // muda como funciona a colisão se for um retângulo ou triângulo
                    shapeRadius = shape.radius / 10;
                } else if (shape.type === 'triangle') {
                    shapeRadius = shape.radius / 2;
                }

                if (otherShape.type === 'rectangle') {
                    otherShapeRadius = otherShape.radius;
                } else if (otherShape.type === 'triangle') {
                    otherShapeRadius = otherShape.radius;
                }

                if (distance < shapeRadius + otherShapeRadius) {
                    const overlap = (shapeRadius + otherShapeRadius) - distance; // soma do raio das duas formas, calcula a distância onde as formas colidem

                    const angle = Math.atan2(dy, dx); // calcula o angulo entre as formas (gerado por I.A.)
                    const moveX = overlap * Math.cos(angle) / 2;
                    const moveY = overlap * Math.sin(angle) / 2;

                    shape.x += moveX;
                    shape.y += moveY;
                    otherShape.x -= moveX;
                    otherShape.y -= moveY;

                    shape.velocityX *= 0.99;
                    shape.velocityY *= 0.99;
                    otherShape.velocityX *= 0.99;
                    otherShape.velocityY *= 0.99;

                    const tempVx = shape.velocityX;
                    const tempVy = shape.velocityY;
                    shape.velocityX = otherShape.velocityX;
                    shape.velocityY = otherShape.velocityY;
                    otherShape.velocityX = tempVx;
                    otherShape.velocityY = tempVy;
                }
            }
        });
    });

    requestAnimationFrame(draw);
}

draw();