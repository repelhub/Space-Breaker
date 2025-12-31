const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

let player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 80,
  width: 40,
  height: 40,
  speed: 6,
  cooldown: 0
};

let bullets = [];
let enemies = [];
let score = 0;
let spawnTimer = 0;

function neon(color) {
  ctx.shadowBlur = 20;
  ctx.shadowColor = color;
  ctx.fillStyle = color;
}

function drawPlayer() {
  neon("#00eaff");
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.shadowBlur = 0;
}

function shoot() {
  if (player.cooldown <= 0) {
    bullets.push({
      x: player.x + player.width / 2 - 3,
      y: player.y,
      width: 6,
      height: 12,
      speed: 8
    });
    player.cooldown = 15;
  }
}

function drawBullets() {
  bullets.forEach(b => {
    neon("#ffffff");
    ctx.fillRect(b.x, b.y, b.width, b.height);
    ctx.shadowBlur = 0;
  });
}

function updateBullets() {
  bullets.forEach(b => b.y -= b.speed);
  bullets = bullets.filter(b => b.y > -20);
}

function spawnEnemy() {
  const size = 30;
  enemies.push({
    x: Math.random() * (canvas.width - size),
    y: -40,
    width: size,
    height: size,
    speed: 2 + Math.random() * 2,
    color: ["#ff0044", "#ff00ff", "#00ff88"][Math.floor(Math.random() * 3)]
  });
}

function drawEnemies() {
  enemies.forEach(e => {
    neon(e.color);
    ctx.fillRect(e.x, e.y, e.width, e.height);
    ctx.shadowBlur = 0;
  });
}

function updateEnemies() {
  enemies.forEach(e => e.y += e.speed);
  enemies = enemies.filter(e => e.y < canvas.height + 50);
}

function collision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function handleCollisions() {
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (collision(b, e)) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        score++;
      }
    });
  });

  enemies.forEach(e => {
    if (collision(player, e)) {
      alert("GAME OVER — Score: " + score);
      document.location.reload();
    }
  });
}

function drawScore() {
  ctx.fillStyle = "#00eaff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player movement
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  // Shooting
  if (keys[" "] || keys["Spacebar"]) shoot();
  if (player.cooldown > 0) player.cooldown--;

  // Spawning enemies
  spawnTimer++;
  if (spawnTimer > 40) {
    spawnEnemy();
    spawnTimer = 0;
  }

  updateBullets();
  updateEnemies();
  handleCollisions();

  drawPlayer();
  drawBullets();
  drawEnemies();
  drawScore();

  requestAnimationFrame(update);
}

update();
