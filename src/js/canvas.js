import {randomIntFromRange, randomColor, distance, resolveCollision} from './methods';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const colors = ['#EFBF4E', '#3FB098', '#292929', '#BA471A', '#CF8B17'];
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

// mouse move event listener
addEventListener('mousemove', (event)=>{
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

addEventListener('resize', () =>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

// object
function Circle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4
    };
    this.mass = 1;
    this.opacity = 0;

    this.draw = () => {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = this.color;
        c.fill();
        c.restore();
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();
    }

    this.update = (circles) => {
        this.draw();

        // getting the distance to all the circles nearby this circle
        for(let i = 0; i < circles.length; i++ ) {
        
            if(this === circles[i]) {
            continue;
            }
            if(distance(this.x, this.y, circles[i].x, circles[i].y) - this.radius * 2 < 0) {
                resolveCollision(this, circles[i]);
            }
        }

        // checking wethere it has hit the wall
        if(this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }
        else if (this.y + radius > canvas.height || this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }

        // mouse collusion
        if (distance(mouse.x, mouse.y, this.x, this.y) < 80 && this.opacity < 0.2) {
            this.opacity += 0.02;
        } else if (this.opacity > 0) {
            this.opacity -= 0.02;
    
            this.opacity = Math.max(0, this.opacity);
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

let circles = [];
function init() {
    circles = [];

    for(let i = 0; i < 150; i++) {
        var radius = 15;
        var x = randomIntFromRange(radius, canvas.width - radius);
        var y = randomIntFromRange(radius, canvas.height - radius);
        var color = randomColor(colors);

        // checking for overlaps
        if ( i !== 0) {
            for(let j = 0; j < circles.length; j++) {
    
            if(distance(x, y, circles[j].x, circles[j].y) - radius * 2 < 0) {
                x = randomIntFromRange(radius, canvas.width - radius);
                y = randomIntFromRange(radius, canvas.height - radius);
                j = -1;
            }
            }
        }

        circles.push(new Circle(x, y, radius, color));
    }
}

//animate loopFunction
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height)

    circles.forEach((circle) => {
        circle.update(circles);
    });
}

init();
animate();