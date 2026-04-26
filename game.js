const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const overlay = document.querySelector("#overlay");
const startButton = document.querySelector("#startButton");
const overlayStage = overlay.querySelector(".stage-label");
const overlayTitle = overlay.querySelector("h2");
const overlayText = overlay.querySelector("p:last-of-type");

const keys = new Set();
const justPressed = new Set();

const stages = [
  {
    label: "STAGE 1",
    name: "サンリーフ渓谷",
    intro: "ジャンプ、ロール、地響きを使い分けてゴールの灯台へ。",
    startMessage: "コハクを集めて灯台へ!",
    clearMessage: "渓谷を突破!",
    worldWidth: 4300,
    goalX: 4050,
    theme: "valley",
    platforms: [
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
    ],
    gems: [
      [220, 390], [305, 372], [392, 390], [670, 286], [760, 286],
      [1010, 360], [1245, 246], [1530, 326], [1740, 222], [2020, 390],
      [2300, 266], [2700, 348], [2960, 216], [3160, 324], [3470, 216],
      [3670, 384], [3890, 270], [4190, 360]
    ],
    enemies: [
      { x: 510, y: 418, min: 460, max: 690, vx: 74 },
      { x: 1030, y: 390, min: 930, max: 1260, vx: 84 },
      { x: 1970, y: 412, min: 1900, max: 2360, vx: 92 },
      { x: 2740, y: 370, min: 2630, max: 2910, vx: 72 },
      { x: 3550, y: 406, min: 3460, max: 3990, vx: 98 }
    ],
    springs: [
      { x: 815, y: 410, w: 42, h: 20 },
      { x: 2478, y: 430, w: 42, h: 20 }
    ],
    hazards: []
  },
  {
    label: "STAGE 2",
    name: "ムーンタイド洞窟",
    intro: "潮の洞窟を駆け抜け、月の結晶を集めて奥の門を開けよう。",
    startMessage: "第2ステージ、洞窟へ!",
    clearMessage: "月の門を開いた!",
    worldWidth: 4700,
    goalX: 4440,
    theme: "cave",
    platforms: [
      { x: 0, y: 462, w: 520, h: 100 },
      { x: 640, y: 416, w: 310, h: 150 },
      { x: 1060, y: 358, w: 280, h: 210 },
      { x: 1460, y: 442, w: 460, h: 130 },
      { x: 2050, y: 398, w: 380, h: 170 },
      { x: 2570, y: 334, w: 300, h: 230 },
      { x: 3020, y: 434, w: 360, h: 140 },
      { x: 3520, y: 380, w: 310, h: 190 },
      { x: 3940, y: 456, w: 560, h: 120 },
      { x: 4550, y: 420, w: 260, h: 150 },
      { x: 460, y: 302, w: 150, h: 24 },
      { x: 930, y: 246, w: 170, h: 24 },
      { x: 1320, y: 282, w: 180, h: 24 },
      { x: 1840, y: 280, w: 210, h: 24 },
      { x: 2360, y: 242, w: 180, h: 24 },
      { x: 2860, y: 260, w: 170, h: 24 },
      { x: 3350, y: 284, w: 190, h: 24 },
      { x: 3830, y: 316, w: 170, h: 24 }
    ],
    gems: [
      [180, 392], [492, 258], [735, 354], [980, 202], [1190, 306],
      [1376, 238], [1588, 382], [1918, 236], [2150, 336], [2418, 198],
      [2706, 286], [2932, 218], [3154, 376], [3420, 240], [3636, 326],
      [3892, 270], [4150, 392], [4380, 382], [4590, 354]
    ],
    enemies: [
      { x: 760, y: 372, min: 672, max: 908, vx: 104 },
      { x: 1540, y: 398, min: 1490, max: 1840, vx: 116 },
      { x: 2160, y: 354, min: 2088, max: 2360, vx: 86 },
      { x: 3120, y: 390, min: 3050, max: 3320, vx: 120 },
      { x: 4050, y: 412, min: 3985, max: 4400, vx: 132 }
    ],
    springs: [
      { x: 1348, y: 418, w: 42, h: 20 },
      { x: 2888, y: 410, w: 42, h: 20 },
      { x: 3838, y: 432, w: 42, h: 20 }
    ],
    hazards: [
      { x: 530, y: 480, w: 96, h: 42 },
      { x: 960, y: 480, w: 98, h: 42 },
      { x: 1928, y: 480, w: 118, h: 42 },
      { x: 2445, y: 480, w: 116, h: 42 },
      { x: 3390, y: 480, w: 126, h: 42 }
    ]
  }
];

const world = {
  started: false,
  won: false,
  campaignDone: false,
  time: 0,
  camera: 0,
  shake: 0,
  message: "",
  messageTimer: 0,
  stageIndex: 0,
  runScore: 0
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

let gems = [];
let enemies = [];

function activeStage() {
  return stages[world.stageIndex];
}

function cloneStageState() {
  const stage = activeStage();
  gems = stage.gems.map(([x, y]) => ({ x, y, r: 13, taken: false, bob: Math.random() * 6 }));
  enemies = stage.enemies.map((enemy) => ({
    ...enemy,
    startX: enemy.x,
    w: 44,
    h: 34,
    stunned: 0
  }));
}

function setOverlay(stage, title, text, buttonText) {
  overlayStage.textContent = stage;
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startButton.textContent = buttonText;
  overlay.classList.remove("hidden");
}

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

function resetPlayer(keepHealth = false) {
  Object.assign(player, {
    x: 72,
    y: 330,
    vx: 0,
    vy: 0,
    facing: 1,
    grounded: false,
    roll: 0,
    slam: false,
    invincible: 0,
    score: 0,
    health: keepHealth ? player.health : 3
  });
}

function startStage(index, keepRunScore = false) {
  world.stageIndex = index;
  const stage = activeStage();
  cloneStageState();
  resetPlayer(keepRunScore);
  player.score = keepRunScore ? world.runScore : 0;
  world.started = true;
  world.won = false;
  world.campaignDone = false;
  world.time = 0;
  world.camera = 0;
  world.message = stage.startMessage;
  world.messageTimer = 2;
  overlay.classList.add("hidden");
}

function resetCampaign() {
  world.runScore = 0;
  startStage(0, false);
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

  const stage = activeStage();
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

  player.vy += 2100 * dt;
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.x = Math.max(0, Math.min(stage.worldWidth - player.w, player.x));
  player.grounded = false;

  for (const platform of stage.platforms) {
    const prevBottom = player.y + player.h - player.vy * dt;
    if (player.x + player.w > platform.x && player.x < platform.x + platform.w && prevBottom <= platform.y && player.y + player.h >= platform.y) {
      player.y = platform.y - player.h;
      player.vy = 0;
      player.grounded = true;
      if (player.slam) {
        world.shake = 1;
        enemies.forEach((enemy) => {
          const distance = Math.abs((enemy.x + enemy.w / 2) - (player.x + player.w / 2));
          if (distance < 230) enemy.stunned = 2.4;
        });
      }
      player.slam = false;
    }
  }

  if (player.y > 650) hurtPlayer(true);

  for (const hazard of stage.hazards) {
    if (rectsOverlap(player, hazard)) hurtPlayer(false);
  }

  for (const spring of stage.springs) {
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

  if (player.x > stage.goalX) {
    clearStage();
  }

  world.camera += (player.x - view().w * .38 - world.camera) * Math.min(1, dt * 7);
  world.camera = Math.max(0, Math.min(stage.worldWidth - view().w, world.camera));
  justPressed.clear();
}

function clearStage() {
  const stage = activeStage();
  world.won = true;
  world.started = false;
  world.runScore = player.score;
  if (world.stageIndex < stages.length - 1) {
    setOverlay("NEXT STAGE", stage.clearMessage, `現在のスコア ${player.score} 点。次は ${stages[world.stageIndex + 1].name}。`, "第2ステージへ");
    return;
  }

  world.campaignDone = true;
  setOverlay("ALL CLEAR", "島の宝を取り戻した!", `最終スコア ${player.score} 点。2つのステージをクリアしました。`, "もう一度遊ぶ");
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
  const { w } = view();
  const shakeX = (Math.random() - .5) * world.shake * 10;
  const cam = world.camera + shakeX;

  ctx.clearRect(0, 0, view().w, view().h);
  drawSky(view().w, view().h, cam);
  ctx.save();
  ctx.translate(-cam, 0);
  drawWorld();
  drawPlayer();
  ctx.restore();
  drawHud(w);
}

function drawSky(w, h, cam) {
  const stage = activeStage();
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  if (stage.theme === "cave") {
    sky.addColorStop(0, "#101b3d");
    sky.addColorStop(.52, "#19315a");
    sky.addColorStop(1, "#172014");
  } else {
    sky.addColorStop(0, "#74d8ff");
    sky.addColorStop(.48, "#73d18a");
    sky.addColorStop(1, "#4b2b11");
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = stage.theme === "cave" ? "#d7efff" : "#fff4a3";
  ctx.beginPath();
  ctx.arc(w - 110, 86, stage.theme === "cave" ? 32 : 44, 0, Math.PI * 2);
  ctx.fill();

  if (stage.theme === "cave") {
    for (let i = 0; i < 18; i++) {
      const x = (i * 260 - cam * .28) % (w + 320) - 120;
      drawCrystal(x, 106 + (i % 4) * 52, i % 2 === 0 ? "#51d0ff" : "#8fffe4");
    }
    for (let i = 0; i < 10; i++) {
      const x = (i * 430 - cam * .16) % (w + 460) - 160;
      drawHill(x, 386 + Math.sin(i) * 18, 280, "#182a38");
      drawHill(x + 130, 430, 310, "#0f2327");
    }
    return;
  }

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

function drawCrystal(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - 30);
  ctx.lineTo(x + 18, y);
  ctx.lineTo(x, y + 48);
  ctx.lineTo(x - 18, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgb(255 255 255 / 32%)";
  ctx.fillRect(x - 3, y - 12, 6, 32);
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
  const stage = activeStage();
  const groundColor = stage.theme === "cave" ? "#334454" : "#7b4a1c";
  const grassColor = stage.theme === "cave" ? "#5ea7a4" : "#2d8c42";
  const trimColor = stage.theme === "cave" ? "#386f77" : "#1f6432";

  for (const platform of stage.platforms) {
    ctx.fillStyle = groundColor;
    ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
    ctx.fillStyle = grassColor;
    ctx.fillRect(platform.x, platform.y, platform.w, 18);
    ctx.fillStyle = trimColor;
    for (let x = platform.x + 12; x < platform.x + platform.w; x += 38) {
      ctx.beginPath();
      ctx.ellipse(x, platform.y + 17, 22, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  stage.hazards.forEach((hazard) => {
    ctx.fillStyle = "#17313a";
    ctx.fillRect(hazard.x, hazard.y + hazard.h - 12, hazard.w, 12);
    ctx.fillStyle = "#ff6c4f";
    for (let x = hazard.x + 8; x < hazard.x + hazard.w; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, hazard.y + hazard.h - 12);
      ctx.lineTo(x + 11, hazard.y);
      ctx.lineTo(x + 22, hazard.y + hazard.h - 12);
      ctx.closePath();
      ctx.fill();
    }
  });

  stage.springs.forEach((spring) => {
    ctx.fillStyle = "#ffdf57";
    ctx.fillRect(spring.x, spring.y, spring.w, spring.h);
    ctx.fillStyle = "#d44c2e";
    ctx.fillRect(spring.x + 6, spring.y + 5, spring.w - 12, 5);
  });

  gems.forEach((gem) => {
    if (gem.taken) return;
    const y = gem.y + Math.sin(world.time * 5 + gem.bob) * 5;
    ctx.fillStyle = stage.theme === "cave" ? "#86f7ff" : "#ffcf39";
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
    ctx.fillStyle = enemy.stunned > 0 ? "#90d4d4" : stage.theme === "cave" ? "#3a2a86" : "#5d2464";
    roundRect(enemy.x, enemy.y, enemy.w, enemy.h, 8);
    ctx.fillStyle = "#ffe169";
    ctx.fillRect(enemy.x + 9, enemy.y + 10, 8, 8);
    ctx.fillRect(enemy.x + enemy.w - 17, enemy.y + 10, 8, 8);
    ctx.fillStyle = "#32143a";
    ctx.fillRect(enemy.x + 7, enemy.y + 29, enemy.w - 14, 8);
  });

  drawGoal(stage);
}

function drawGoal(stage) {
  if (stage.theme === "cave") {
    ctx.fillStyle = "#8fffe4";
    ctx.fillRect(stage.goalX + 36, 254, 54, 176);
    ctx.fillStyle = "#203052";
    ctx.fillRect(stage.goalX + 48, 286, 30, 144);
    ctx.strokeStyle = "#d7efff";
    ctx.lineWidth = 6;
    ctx.strokeRect(stage.goalX + 28, 246, 70, 188);
    return;
  }

  ctx.fillStyle = "#ffe169";
  ctx.fillRect(stage.goalX + 55, 264, 42, 164);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(stage.goalX + 97, 272);
  ctx.lineTo(stage.goalX + 185, 306);
  ctx.lineTo(stage.goalX + 97, 340);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#37a4ff";
  ctx.fillRect(stage.goalX + 65, 214, 22, 52);
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
  const stage = activeStage();
  ctx.fillStyle = "rgb(9 32 32 / 78%)";
  roundRect(14, 14, 328, 50, 8);
  ctx.fillStyle = "#fff8de";
  ctx.font = "900 18px Segoe UI, sans-serif";
  ctx.fillText(`${stage.label}  宝 ${player.score}`, 30, 45);
  ctx.fillText(`HP ${"♥".repeat(player.health)}`, 218, 45);

  ctx.fillStyle = "rgb(9 32 32 / 78%)";
  roundRect(w - 190, 14, 176, 50, 8);
  ctx.fillStyle = "#ffdf57";
  ctx.fillText(`距離 ${Math.floor(player.x / 42)}m`, w - 174, 45);

  if (world.messageTimer > 0) {
    ctx.fillStyle = "rgb(255 223 87 / 92%)";
    roundRect(w / 2 - 130, 78, 260, 42, 8);
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

startButton.addEventListener("click", () => {
  if (world.won && world.stageIndex < stages.length - 1 && !world.campaignDone) {
    startStage(world.stageIndex + 1, true);
    return;
  }
  resetCampaign();
});

window.addEventListener("resize", resizeCanvas);
cloneStageState();
resizeCanvas();
requestAnimationFrame(loop);
