const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const overlay = document.querySelector("#overlay");
const startButton = document.querySelector("#startButton");

const keys = new Set();
const justPressed = new Set();
const world = {
  width: 4300,
  height: 540,
  gravity: 2100,
  floor: 462,
  started: false,
  won: false,
  time: 0,
  camera: 0,
  shake: 0,
  message: "",
  messageTimer: 0
};

const player = {
  x: 72,
  y: 330,
  w: 42,
  h: 58,
  vx: 0,
  vy: 0,
  facing: 1,
  grounded: false,
  roll: 0,
  slam: false,
  invincible: 0,
  score: 0,
  health: 3
};

const platforms = [
  { x: 0, y: 462, w: 780, h: 100 },
  { x: 880, y: 434, w: 440, h: 130 },
  { x: 1410, y: 386, w: 340, h: 170 },
  { x: 1860, y: 456, w: 620, h: 110 },
  { x: 2600, y: 414, w: 350, h: 150 },
  { x: 3030, y: 370, w: 300, h: 190 },
  { x: 3420, y: 450, w: 660, h: 120 },
  { x: 4130, y: 424, w: 280, h: 140 },
  { x: 620, y: 330, w: 210, h: 24 },
  { x: 1180, y: 292, w: 180, h: 24 },
  { x: 1680, y: 268, w: 170, h: 24 },
  { x: 2210, y: 312, w: 220, h: 24 },
  { x: 2870, y: 262, w: 210, h: 24 },
  { x: 3360, y: 260, w: 170, h: 24 },
  { x: 3820, y: 316, w: 180, h: 24 }
];

const gems = [
  [220, 390], [305, 372], [392, 390], [670, 286], [760, 286],
  [1010, 360], [1245, 246], [1530, 326], [1740, 222], [2020, 390],
  [2300, 266], [2700, 348], [2960, 216], [3160, 324], [3470, 216],
  [3670, 384], [3890, 270], [4190, 360]
].map(([x, y]) => ({ x, y, r: 13, taken: false, bob: Math.random() * 6 }));

const enemies = [
  { x: 510, y: 418, w: 44, h: 34, min: 460, max: 690, vx: 74, stunned: 0 },
  { x: 1030, y: 390, w: 44, h: 34, min: 930, max: 1260, vx: 84, stunned: 0 },
  { x: 1970, y: 412, w: 44, h: 34, min: 1900, max: 2360, vx: 92, stunned: 0 },
  { x: 2740, y: 370, w: 44, h: 34, min: 2630, max: 2910, vx: 72, stunned: 0 },
  { x: 3550, y: 406, w: 44, h: 34, min: 3460, max: 3990, vx: 98, stunned: 0 }
];

const springs = [
  { x: 815, y: 410, w: 42, h: 20 },
  { x: 2478, y: 430, w: 42, h: 20 }
];

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(640, Math.floor(rect.width * ratio));
  canvas.height = Math.max(360, Math.floor(rect.height * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function view() {
  return {
    w: canvas.width / Math.min(window.devicePixelRatio || 1, 2),
    h: canvas.height / Math.min(window.devicePixelRatio || 1, 2)
  };
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function resetGame() {
  Object.assign(player, {
    x: 72, y: 330, vx: 0, vy: 0, facing: 1, grounded: false,
    roll: 0, slam: false, invincible: 0, score: 0, health: 3
  });
  gems.forEach((gem) => gem.taken = false);
  enemies.forEach((enemy, index) => {
    enemy.x = [510, 1030, 1970, 2740, 3550][index];
    enemy.stunned = 0;
  });
  world.started = true;
  world.won = false;
  world.time = 0;
  world.camera = 0;
  world.message = "コハクを集めて灯台へ!";
  world.messageTimer = 2;
  overlay.classList.add("hidden");
}

function getInput(name) {
  if (name === "left") return keys.has("ArrowLeft") || keys.has("KeyA") || keys.has("left");
  if (name === "right") return keys.has("ArrowRight") || keys.has("KeyD") || keys.has("right");
  if (name === "jump") return justPressed.has("Space") || justPressed.has("KeyW") || justPressed.has("ArrowUp") || justPressed.has("jump");
  if (name === "roll") return keys.has("ShiftLeft") || keys.has("ShiftRight") || keys.has("roll");
  if (name === "slam") return keys.has("ArrowDown") || keys.has("KeyS") || justPressed.has("slam");
  return false;
}

function update(dt) {
  if (!world.started || world.won) return;

  world.time += dt;
  world.shake = Math.max(0, world.shake - dt * 18);
  world.messageTimer = Math.max(0, world.messageTimer - dt);
  player.invincible = Math.max(0, player.invincible - dt);
  player.roll = getInput("roll") ? Math.min(1, player.roll + dt * 6) : Math.max(0, player.roll - dt * 8);

  const accel = player.roll > .2 ? 2600 : 1700;
  const maxSpeed = player.roll > .2 ? 470 : 320;
  if (getInput("left")) {
    player.vx -= accel * dt;
    player.facing = -1;
  }
  if (getInput("right")) {
    player.vx += accel * dt;
    player.facing = 1;
  }
  if (!getInput("left") && !getInput("right")) {
    player.vx *= Math.pow(.0008, dt);
  }

  player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, player.vx));
  if (getInput("jump") && player.grounded) {
    player.vy = -760;
    player.grounded = false;
  }
  if (getInput("slam") && !player.grounded && player.vy > -200) {
    player.slam = true;
    player.vy = 1120;
  }

  player.vy += world.gravity * dt;
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.x = Math.max(0, Math.min(world.width - player.w, player.x));
  player.grounded = false;

  for (const p of platforms) {
    const prevBottom = player.y + player.h - player.vy * dt;
    if (player.x + player.w > p.x && player.x < p.x + p.w && prevBottom <= p.y && player.y + player.h >= p.y) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.grounded = true;
      if (player.slam) {
        world.shake = 1;
        enemies.forEach((enemy) => {
          const distance = Math.abs((enemy.x + enemy.w / 2) - (player.x + player.w / 2));
          if (distance < 210) enemy.stunned = 2.4;
        });
      }
      player.slam = false;
    }
  }

  if (player.y > 650) hurtPlayer(true);

  for (const spring of springs) {
    if (rectsOverlap(player, spring) && player.vy >= 0) {
      player.y = spring.y - player.h;
      player.vy = -980;
      player.grounded = false;
      world.message = "大ジャンプ!";
      world.messageTimer = .8;
    }
  }

  for (const enemy of enemies) {
    if (enemy.stunned > 0) {
      enemy.stunned -= dt;
    } else {
      enemy.x += enemy.vx * dt;
      if (enemy.x < enemy.min || enemy.x > enemy.max) enemy.vx *= -1;
    }

    if (!rectsOverlap(player, enemy)) continue;
    const stomp = player.vy > 130 && player.y + player.h - enemy.y < 26;
    if (stomp || player.roll > .55 || enemy.stunned > 0) {
      enemy.stunned = 999;
      enemy.y = 900;
      player.vy = stomp ? -510 : player.vy;
      player.score += 3;
      world.message = stomp ? "ふみつけ!" : "突破!";
      world.messageTimer = .9;
    } else {
      hurtPlayer(false);
    }
  }

  gems.forEach((gem) => {
    const box = { x: gem.x - gem.r, y: gem.y - gem.r, w: gem.r * 2, h: gem.r * 2 };
    if (!gem.taken && rectsOverlap(player, box)) {
      gem.taken = true;
      player.score += 1;
    }
  });

  if (player.x > 4050) {
    world.won = true;
    overlay.querySelector("h2").textContent = "ステージクリア!";
    overlay.querySelector("p:last-of-type").textContent = `集めたコハク ${player.score} 点。もう一度遊ぶ?`;
    startButton.textContent = "リトライ";
    overlay.classList.remove("hidden");
  }

  world.camera += (player.x - view().w * .38 - world.camera) * Math.min(1, dt * 7);
  world.camera = Math.max(0, Math.min(world.width - view().w, world.camera));
  justPressed.clear();
}

function hurtPlayer(fall) {
  if (player.invincible > 0 && !fall) return;
  player.health -= 1;
  player.invincible = 1.2;
  world.shake = 1;
  if (player.health <= 0 || fall) {
    player.health = 3;
    player.x = Math.max(72, player.x - 520);
    player.y = 250;
    player.vx = 0;
    player.vy = 0;
    world.message = "もう一度!";
  } else {
    player.vx = -player.facing * 360;
    player.vy = -420;
    world.message = "いたっ!";
  }
  world.messageTimer = 1.2;
}

function draw() {
  const { w, h } = view();
  const shakeX = (Math.random() - .5) * world.shake * 10;
  const cam = world.camera + shakeX;

  ctx.clearRect(0, 0, w, h);
  drawSky(w, h, cam);
  ctx.save();
  ctx.translate(-cam, 0);
  drawWorld();
  drawPlayer();
  ctx.restore();
  drawHud(w);
}

function drawSky(w, h, cam) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#74d8ff");
  sky.addColorStop(.48, "#73d18a");
  sky.addColorStop(1, "#4b2b11");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#fff4a3";
  ctx.beginPath();
  ctx.arc(w - 110, 86, 44, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 12; i++) {
    const x = (i * 420 - cam * .22) % (w + 460) - 120;
    drawHill(x, 352 + Math.sin(i) * 22, 250, "#276c52");
    drawHill(x + 120, 406, 310, "#1d573f");
  }

  for (let i = 0; i < 18; i++) {
    const x = (i * 260 - cam * .5) % (w + 300) - 80;
    drawPalm(x, 388 + (i % 3) * 14);
  }
}

function drawHill(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - r, 540);
  ctx.quadraticCurveTo(x, y - r * .62, x + r, 540);
  ctx.fill();
}

function drawPalm(x, y) {
  ctx.fillStyle = "#6f3d1d";
  ctx.fillRect(x + 44, y - 84, 18, 94);
  ctx.fillStyle = "#155f3b";
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.translate(x + 53, y - 84);
    ctx.rotate((i / 6) * Math.PI * 2);
    ctx.beginPath();
    ctx.ellipse(42, 0, 52, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawWorld() {
  for (const p of platforms) {
    ctx.fillStyle = "#7b4a1c";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#2d8c42";
    ctx.fillRect(p.x, p.y, p.w, 18);
    ctx.fillStyle = "#1f6432";
    for (let x = p.x + 12; x < p.x + p.w; x += 38) {
      ctx.beginPath();
      ctx.ellipse(x, p.y + 17, 22, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  springs.forEach((spring) => {
    ctx.fillStyle = "#ffdf57";
    ctx.fillRect(spring.x, spring.y, spring.w, spring.h);
    ctx.fillStyle = "#d44c2e";
    ctx.fillRect(spring.x + 6, spring.y + 5, spring.w - 12, 5);
  });

  gems.forEach((gem) => {
    if (gem.taken) return;
    const y = gem.y + Math.sin(world.time * 5 + gem.bob) * 5;
    ctx.fillStyle = "#ffcf39";
    ctx.beginPath();
    ctx.moveTo(gem.x, y - gem.r);
    ctx.lineTo(gem.x + gem.r, y);
    ctx.lineTo(gem.x, y + gem.r);
    ctx.lineTo(gem.x - gem.r, y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fff6a7";
    ctx.lineWidth = 3;
    ctx.stroke();
  });

  enemies.forEach((enemy) => {
    if (enemy.y > 800) return;
    ctx.fillStyle = enemy.stunned > 0 ? "#90d4d4" : "#5d2464";
    roundRect(enemy.x, enemy.y, enemy.w, enemy.h, 8);
    ctx.fillStyle = "#ffe169";
    ctx.fillRect(enemy.x + 9, enemy.y + 10, 8, 8);
    ctx.fillRect(enemy.x + enemy.w - 17, enemy.y + 10, 8, 8);
    ctx.fillStyle = "#32143a";
    ctx.fillRect(enemy.x + 7, enemy.y + 29, enemy.w - 14, 8);
  });

  ctx.fillStyle = "#ffe169";
  ctx.fillRect(4105, 264, 42, 164);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(4147, 272);
  ctx.lineTo(4235, 306);
  ctx.lineTo(4147, 340);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#37a4ff";
  ctx.fillRect(4115, 214, 22, 52);
}

function drawPlayer() {
  const blink = player.invincible > 0 && Math.floor(world.time * 18) % 2 === 0;
  if (blink) return;
  const x = player.x;
  const y = player.y;
  const squash = player.roll > .45 ? 12 : 0;
  ctx.fillStyle = "#f28e2b";
  roundRect(x, y + squash, player.w, player.h - squash, 12);
  ctx.fillStyle = "#fff1b0";
  roundRect(x + 8, y + 14 + squash, 26, 26, 8);
  ctx.fillStyle = "#243328";
  ctx.fillRect(x + (player.facing > 0 ? 29 : 8), y + 18 + squash, 6, 6);
  ctx.fillStyle = "#2c5f45";
  ctx.fillRect(x + 8, y - 8 + squash, 28, 12);
  ctx.fillStyle = "#754116";
  ctx.fillRect(x + 6, y + player.h - 8, 12, 8);
  ctx.fillRect(x + 25, y + player.h - 8, 12, 8);
}

function drawHud(w) {
  ctx.fillStyle = "rgb(9 32 32 / 78%)";
  roundRect(14, 14, 272, 50, 8);
  ctx.fillStyle = "#fff8de";
  ctx.font = "900 18px Segoe UI, sans-serif";
  ctx.fillText(`コハク ${player.score}`, 30, 45);
  ctx.fillText(`HP ${"♥".repeat(player.health)}`, 144, 45);

  ctx.fillStyle = "rgb(9 32 32 / 78%)";
  roundRect(w - 190, 14, 176, 50, 8);
  ctx.fillStyle = "#ffdf57";
  ctx.fillText(`距離 ${Math.floor(player.x / 42)}m`, w - 174, 45);

  if (world.messageTimer > 0) {
    ctx.fillStyle = "rgb(255 223 87 / 92%)";
    roundRect(w / 2 - 110, 78, 220, 42, 8);
    ctx.fillStyle = "#261407";
    ctx.textAlign = "center";
    ctx.fillText(world.message, w / 2, 105);
    ctx.textAlign = "left";
  }
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(.033, (now - last) / 1000);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
    event.preventDefault();
  }
  if (!keys.has(event.code)) justPressed.add(event.code);
  keys.add(event.code);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

document.querySelectorAll("[data-hold]").forEach((button) => {
  const value = button.dataset.hold;
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    keys.add(value);
    button.setPointerCapture(event.pointerId);
  });
  button.addEventListener("pointerup", () => keys.delete(value));
  button.addEventListener("pointercancel", () => keys.delete(value));
});

document.querySelectorAll("[data-tap]").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    justPressed.add(button.dataset.tap);
  });
});

startButton.addEventListener("click", resetGame);
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(loop);
