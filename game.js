const canvas = document.getElementById("game");
const ctx = canvas.getContext('2d');

let frames = 0;
const DEGREE = Math.PI / 180;

// Loading Images //

const Ball = new Image();
Ball.src = "images/ball.png";

const Ring = new Image();
Ring.src = "images/ring.png";

const gameState = {
  current: 0,
  ready: 0,
  game: 1,
  over: 2
};


const ball = {
  sX: 0,
  sY: 0,
  sw: 100,
  sh: 100,
  w: 20,
  h: 20,
  x: canvas.width / 2,
  y: canvas.height - 100,
  up: -20,
  down: 1,
  speed: 0,

  draw: function () {
    ctx.drawImage(Ball, this.sX, this.sY, this.sw, this.sh, this.x - 10, this.y - 10, this.w, this.h);
  },

  jump: function () {

    this.speed = this.up;
    this.y += this.speed;

    // ball upper Bound collision detection
    if (this.y + this.h / 2 <= canvas.height - 125) {
      this.y = canvas.height - this.h - 125;
      ring.downSpeed = 20;

    }


  },
  update: function () {

    if (gameState.current == gameState.game) {

      this.y += this.speed;

      //ball collision with bottom
      if (canvas.height <= this.y + this.h / 2) {
        this.y = canvas.height - this.h / 2;
        gameState.current = gameState.over;
      } else {
        this.speed = this.down;

      }
    }



  }

}

const ring = {
  sX: 0,
  sY: 0,
  sw: 197,
  sh: 197,
  w: 180,
  h: 180,
  position: [],
  angle: 0,
  rotatationSpeed: 2,
  downSpeed: 2,

  draw: function () {

    for (let i = 0; i < this.position.length; i++) {

      let p = this.position[i];
      p.angle += this.rotatationSpeed;

      p.angle %= 362;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle * DEGREE);

      ctx.drawImage(Ring, this.sX, this.sY, this.sw, this.sh, -this.w / 2, -this.h / 2, this.w, this.h);
      ctx.restore();

    }




  },

  update: function () {

    if (gameState.current != gameState.game) return;
    if (this.position.length == 0 || this.position[this.position.length - 1].y > 120) {
      this.position.push({
        x: 160,
        y: -180,
        angle: Math.random() * 100
      });
    }
    for (let i = 0; i < this.position.length; i++) {

      this.position[i].y += this.downSpeed;

    }
    this.downSpeed = 0;




  },

}

function update() {

  ball.update();
  ring.update();

}

function draw() {
  ctx.fillStyle = "black";

  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ball.draw();
  ring.draw();
}


canvas.addEventListener('click', (evt) => {


  if (gameState.current == gameState.ready) {

    gameState.current = gameState.game;

  } else if (gameState.current == gameState.game) {

    ball.jump();

  }

});



function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);


}

requestAnimationFrame(loop);

let p = setInterval(() => {

    for (let i = 0; i < ring.position.length; i++)
      console.log("Ring " + i + " = " + ring.position[i].angle);

  },
  1);