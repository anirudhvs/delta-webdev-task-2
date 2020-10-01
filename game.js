const canvas = document.getElementById("game");
const ctx = canvas.getContext('2d');

let frames = 0;
const DEGREE = Math.PI / 180;

// Loading Images //

const Ball = new Image();
Ball.src = "images/ball.png";

const Ring = new Image();
Ring.src = "images/ring.png";

const Start = new Image();
Start.src = "images/start.png";

const GameOver = new Image();
GameOver.src = "images/gameover.jpg";

const Pause = new Image();
Pause.src = "images/pause.png";

//Loading Sounds//

// const JUMP_S = new Audio();
// JUMP_S.src = "audio/jump.wav";

const GAMEOVER_S = new Audio();
GAMEOVER_S.src = "audio/gameover.wav";

const START_GAME = new Audio();
START_GAME.src = "audio/gamestart.wav";

//Game State//
const gameState = {
  current: 0,
  ready: 0,
  game: 1,
  over: 2,
  pause: 3
};

const score = {
  best: parseInt(localStorage.getItem("best")) || 0,
  value: 0,

  draw: function () {

    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, canvas.width, 25);


    ctx.drawImage(Pause, 0, 0, 286, 176, canvas.width / 2 - 15, 0, 35, 25)


    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#FFF";

    ctx.font = "normal  small-caps 900 20px Arial";
    ctx.fillText("Score: " + this.value, 15, 20);
    ctx.strokeText("Score: " + this.value, 15, 20);

    ctx.fillText("Best: " + this.best, canvas.width - 120, 20);
    ctx.strokeText("Best: " + this.best, canvas.width - 120, 20);


  },

  reset: function () {
    this.value = 0;

  }


}


const ball = {
  sX: 0,
  sY: 0,
  sw: 100,
  sh: 100,
  w: 20,
  h: 20,
  x: canvas.width / 2,
  y: canvas.height - 100,
  up: -25,
  down: 2,
  speed: 0,

  draw: function () {
    ctx.drawImage(Ball, this.sX, this.sY, this.sw, this.sh, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
  },

  jump: function () {


    this.speed = this.up;
    this.y += this.speed;

    // ball upper Bound collision detection
    if (this.y + this.h / 2 <= canvas.height - 125) {
      this.y = canvas.height - this.h - 125;
      ring.downSpeed = 10;
      score.value += 10;
      score.best = Math.max(score.value, score.best);
      localStorage.setItem("best", score.best);

    }
  },

  update: function () {

    if (gameState.current == gameState.game) {

      this.y += this.speed;

      //ball collision with bottom
      if (canvas.height <= this.y + this.h / 2) {
        this.y = canvas.height - this.h / 2;
        gameState.current = gameState.over;
        GAMEOVER_S.play();
      } else {
        this.speed = this.down;

      }
    }



  },

  reset: function () {
    this.x = canvas.width / 2;
    this.y = canvas.height - 100;
    this.draw();
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
  thickness: 20,

  draw: function () {

    if (gameState.current != gameState.game) {
      this.rotatationSpeed = 0;
    } else {
      this.rotatationSpeed = 2;
      if (this.position.length % 5 == 0)
        this.rotatationSpeed += this.position.length / 5;

    };

    for (let i = 0; i < this.position.length; i++) {

      let p = this.position[i];

      p.angle += Math.pow(-1, i) * this.rotatationSpeed;
      if (p.angle < 0) p.angle = 360;
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
    if (this.position.length == 0 || this.position[this.position.length - 1].y > 225) {
      this.position.push({
        x: 160,
        y: -75,
        angle: Math.random() * 100
      });
    }
    for (let i = 0; i < this.position.length; i++) {

      this.position[i].y += this.downSpeed;

      //collision with bottom of the ring
      let bottomOfRing = this.position[i].y + this.h / 2 + 17;
      if (ball.y <= bottomOfRing && ball.y + ball.h >= bottomOfRing - this.thickness - 7 && this.position[i].angle >= 180) {

        gameState.current = gameState.over;
        GAMEOVER_S.play();
      }


      //collision with top of the ring

      let topOfRing = this.position[i].y - this.h / 2;
      if (ball.y + ball.h / 2 - 5 >= topOfRing && ball.y - ball.h / 2 - 10 <= topOfRing + this.thickness && this.position[i].angle < 180) {
        gameState.current = gameState.over;
        GAMEOVER_S.play();
      }



    }
    this.downSpeed = 1;

  },

  reset: function () {
    this.position = [];
  }

}

const startGame = {

  sX: 0,
  sY: 0,
  sw: 543,
  sh: 389,
  w: 220,
  h: 100,
  x: 50,
  y: 200,

  draw: function () {
    if (gameState.current != gameState.ready) return;
    ctx.drawImage(Start, this.sX, this.sY, this.sw, this.sh, this.x, this.y, this.w, this.h);
  }


};




const endGame = {

  sX: 0,
  sY: 0,
  sw: 627,
  sh: 337,
  w: 220,
  h: 100,
  x: 50,
  y: 150,

  draw: function () {
    if (gameState.current != gameState.over) return;

    ctx.drawImage(GameOver, this.sX, this.sY, this.sw, this.sh, this.x, this.y, this.w, this.h);

    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";

    ctx.font = "normal  small-caps 900 20px Arial";
    ctx.fillText("Click Here Restart", this.x + 10, this.y + 1.5 * this.h);
    ctx.strokeText("Click Here Restart", this.x + 10, this.y + 1.5 * this.h);


  }

};

const pause = {
  x: 20,
  y: 150,

  draw: function () {
    if (gameState.current != gameState.pause) return;

    ctx.fillStyle = "#FFF";
    ctx.fillText("Paused Click to Resume", this.x + 10, canvas.height / 2);



  }
};



function update() {

  ball.update();
  ring.update();

}

function draw() {
  ctx.fillStyle = "black";

  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ball.draw();
  ring.draw();
  score.draw();
  startGame.draw();
  endGame.draw();
  pause.draw();
}


canvas.addEventListener('click', (evt) => {

  if (gameState.current == gameState.pause) {
    gameState.current = gameState.game;
    START_GAME.play();
  }
  let rect = canvas.getBoundingClientRect();
  let clickX = evt.clientX - rect.left;
  let clickY = evt.clientY - rect.top;

  if (clickX >= 150 && clickX <= 175 && clickY >= 0 && clickY <= 25)
    gameState.current = gameState.pause;

  if (gameState.current == gameState.ready) {

    gameState.current = gameState.game;
    START_GAME.play();

  }
  if (gameState.current == gameState.game) {

    ball.jump();

  }

  if (gameState.current == gameState.over &&
    clickX >= 60 && clickX <= 280 &&
    clickY >= 275 && clickY <= 305) {
    gameState.current = gameState.ready;
    ring.reset();
    score.reset();
    ball.reset();
  }


});


window.onkeydown = (e)=>{
	if(e.keyCode === 32)
		if (gameState.current == gameState.game) 
    		ball.jump();
}
function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);

}
loop();