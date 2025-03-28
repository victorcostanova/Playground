const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const clouds = document.querySelector(".clouds");
const scoreDisplay = document.getElementById("score");

let score = 0;
let hasPassed = false;

const jump = () => {
  mario.classList.add("jump");
  setTimeout(() => {
    mario.classList.remove("jump");
  }, 500);
};

const updateScore = () => {
  score++;
  scoreDisplay.innerText = `SCORE: ${score}`;
};
const loop = setInterval(() => {
  const pipePosition = pipe.offsetLeft;
  const cloudsPosition = clouds.offsetLeft;
  const marioPosition = +window
    .getComputedStyle(mario)
    .bottom.replace("px", "");

  console.log(pipePosition);
  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 88) {
    document.getElementById("gameover").style.display = "block";
    document.getElementById("reset").style.display = "block";
    clouds.style.animation = "none";
    clouds.style.left = `${cloudsPosition}px`;

    pipe.style.animation = "none";
    pipe.style.left = `${pipePosition}px`;

    mario.style.animation = "none";
    mario.style.bottom = `${marioPosition}px`;

    mario.src = "./images/game-over.png";
    mario.style.width = "80px";
    mario.style.marginLeft = "50px";

    clearInterval(loop);
  }

  if (pipePosition <= -50 && !hasPassed) {
    updateScore();
    hasPassed = true;
  }
  if (pipePosition > 300) {
    hasPassed = false;
  }
}, 10);

document.addEventListener("keydown", jump);

function resetGame() {
  location.reload();
}
