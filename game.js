let startTime = Date.now();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

let gameState = "menu"; 
let playerName = "";
let showNameInput = false;
let nameInputActive = false;

let touchControls = {
   leftArrow: { x: 50, y: 300, width: 40, height: 40, active: false },
   rightArrow: { x: 100, y: 300, width: 40, height: 40, active: false },
   jumpButton: { x: 710, y: 300, width: 40, height: 40, active: false },
   dialogLeft: { x: 50, y: 150, width: 40, height: 40, active: false },
   dialogRight: { x: 710, y: 150, width: 40, height: 40, active: false }
};

const menuImg = new Image();
menuImg.src = "menu.jpg";

const playerImg = new Image();
playerImg.src = "player.png";
const enemyImg = new Image();
enemyImg.src = "enemy.png";
const coinImg = new Image();
coinImg.src = "coin.png";
const crystalImg = new Image();
crystalImg.src = "crystal.png";
const wizardImg = new Image();
wizardImg.src = "wizard.png";
const birdImg = new Image();
birdImg.src = "bird.png";

const bgMusic = new Audio("bgmusic.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.2;

window.addEventListener("load", () => {
   localStorage.removeItem("playerName");
});
window.addEventListener("click", () => {
  if (gameState === "game" && bgMusic.paused) bgMusic.play();
});

const player = {
   x: 150, 
   y: 0,
   width: 20,
   height: 30,
   velocityX: 0,
   velocityY: 0,
   jumping: false,
};

const gravity = 0.5;
let keys = {};
let finished = false;
let showProposal = false;
const worldWidth = 4000;
let cameraX = 0;
let wizardDialogIndex = 0;
const wizardDialogs = [
  "Parabéns, aventureira! Você concluiu o primeiro nível com maestria!",
  "Essa foi apenas a fase de aquecimento... um gostinho do que vem por aí.",
  "Os próximos desafios serão ainda mais incríveis, e talvez um pouquinho mais difíceis.",
  "Mas afinal… estamos falando da maior missão de todas: a jornada da vida a dois.",
  "E então… você aceita avançar para o próximo nível ao meu lado?"
];

const groundY = 360;
const platforms = [
   { x: 0, y: groundY, width: 400, height: 40 },
   { x: 450, y: groundY, width: 200, height: 40 },
   { x: 700, y: groundY, width: 200, height: 40 },
   { x: 950, y: groundY, width: 200, height: 40 },
   { x: 1200, y: groundY, width: 200, height: 40 },
   { x: 1450, y: groundY, width: 200, height: 40 },
   { x: 1700, y: groundY, width: 200, height: 40 },
   { x: 1950, y: groundY, width: 200, height: 40 },
   { x: 2200, y: groundY, width: 200, height: 40 },
   { x: 2450, y: groundY, width: 200, height: 40 },
   { x: 2700, y: groundY, width: 200, height: 40 },
   { x: 2950, y: groundY, width: 200, height: 40 },
   { x: 3200, y: groundY, width: 200, height: 40 },
   { x: 3450, y: groundY, width: 200, height: 40 },
   { x: 3700, y: groundY, width: 300, height: 40 },
   
   { x: 300, y: 300, width: 80, height: 10 },
   { x: 500, y: 280, width: 60, height: 10 },
   { x: 650, y: 250, width: 80, height: 10 },
   { x: 800, y: 220, width: 60, height: 10 },
   { x: 950, y: 200, width: 80, height: 10 },
   { x: 1100, y: 180, width: 60, height: 10 },
   { x: 1250, y: 160, width: 80, height: 10 },
   { x: 1400, y: 140, width: 60, height: 10 },
   { x: 1550, y: 120, width: 80, height: 10 },
   { x: 1700, y: 100, width: 60, height: 10 },
   { x: 1850, y: 120, width: 80, height: 10 },
   { x: 2000, y: 140, width: 60, height: 10 },
   { x: 2150, y: 160, width: 80, height: 10 },
   { x: 2300, y: 180, width: 60, height: 10 },
   { x: 2450, y: 200, width: 80, height: 10 },
   { x: 2600, y: 220, width: 60, height: 10 },
   { x: 2750, y: 240, width: 80, height: 10 },
   { x: 2900, y: 260, width: 60, height: 10 },
   { x: 3050, y: 280, width: 80, height: 10 },
   { x: 3200, y: 300, width: 60, height: 10 },
   { x: 3350, y: 280, width: 80, height: 10 },
   { x: 3500, y: 260, width: 60, height: 10 },
   { x: 3650, y: 240, width: 80, height: 10 },
   { x: 3800, y: 220, width: 60, height: 10 },
   { x: 400, y: 280, width: 80, height: 10 },
   { x: 600, y: 260, width: 80, height: 10 },
   { x: 800, y: 240, width: 80, height: 10 },
   { x: 1000, y: 220, width: 80, height: 10 },
   { x: 1200, y: 200, width: 80, height: 10 },
   { x: 1400, y: 220, width: 80, height: 10 },
   { x: 1600, y: 240, width: 80, height: 10 },
   { x: 1800, y: 260, width: 80, height: 10 },
   { x: 2000, y: 240, width: 80, height: 10 },
   { x: 2200, y: 220, width: 80, height: 10 },
   { x: 2400, y: 200, width: 80, height: 10 },
   { x: 2600, y: 220, width: 80, height: 10 },
   { x: 2800, y: 240, width: 80, height: 10 },
   { x: 3000, y: 260, width: 80, height: 10 },
   { x: 3200, y: 240, width: 80, height: 10 },
   { x: 3400, y: 220, width: 80, height: 10 },
   { x: 3600, y: 200, width: 80, height: 10 },
   { x: 3800, y: 220, width: 80, height: 10 },
];

const holes = [
];

const spikes = [
   { x: 750, y: groundY - 15, width: 20, height: 15 },
   { x: 1650, y: groundY - 15, width: 20, height: 15 },
   { x: 2650, y: groundY - 15, width: 20, height: 15 },
   { x: 3650, y: groundY - 15, width: 20, height: 15 },
   { x: 700, y: 240, width: 20, height: 15 },
   { x: 1300, y: 150, width: 20, height: 15 },
   { x: 2200, y: 150, width: 20, height: 15 },
];

const crystals = [
   { x: 680, y: 150, collected: false }, 
   { x: 1280, y: 110, collected: false },
   { x: 1880, y: 70, collected: false }, 
   { x: 2480, y: 150, collected: false },
   { x: 3080, y: 230, collected: false },
   { x: 3680, y: 190, collected: false },
   { x: 420, y: 250, collected: false }, 
   { x: 1580, y: 90, collected: false }, 
   { x: 2780, y: 210, collected: false },
];

const coins = Array.from({ length: 30 }, (_, i) => ({
   x: 200 + i * 130, 
   y: [280, 240, 220, 190, 170, 150, 130, 110, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310, 280, 240, 220, 190, 170, 150, 130, 110, 90, 110][i % 30],
   collected: false,
}));

const specialCoins = [
   { x: 350, y: 250, collected: false },
   { x: 750, y: 200, collected: false },
   { x: 1150, y: 160, collected: false },
   { x: 1550, y: 120, collected: false },
   { x: 1950, y: 160, collected: false },
   { x: 2350, y: 200, collected: false },
   { x: 2750, y: 240, collected: false },
   { x: 3150, y: 280, collected: false },
   { x: 3550, y: 240, collected: false },
];

let coinCount = 0;

const enemies = Array.from({ length: 3 }, (_, i) => ({
   x: 400 + i * 900,
   y: 335,
   width: 20,
   height: 20,
   speed: Math.random() > 0.5 ? 1 : -1,
   alive: true,
}));

const birds = Array.from({ length: 2 }, (_, i) => ({
   x: 200 + i * 1200,
   y: 100 + Math.sin(i) * 50,
   width: 25,
   height: 15,
   speed: 1.2,
   alive: true,
   direction: Math.random() > 0.5 ? 1 : -1,
   amplitude: 30 + Math.random() * 40,
   frequency: 0.02 + Math.random() * 0.03,
   time: Math.random() * Math.PI * 2,
}));

function resetPlayer() {
   player.x = 150; 
   player.y = 0;
   player.velocityX = 0;
   player.velocityY = 0;
   
   enemies.forEach((enemy, i) => {
      enemy.x = 400 + i * 900;
      enemy.y = 335;
      enemy.alive = true;
      enemy.speed = Math.random() > 0.5 ? 1 : -1;
   });
   
   birds.forEach((bird, i) => {
      bird.x = 200 + i * 1200;
      bird.y = 100 + Math.sin(i) * 50;
      bird.alive = true;
      bird.direction = Math.random() > 0.5 ? 1 : -1;
      bird.time = Math.random() * Math.PI * 2;
   });
}

document.addEventListener("keydown", (e) => {
   keys[e.key] = true;
   
   if (gameState === "nameInput") {
      if (e.key === "Enter" && playerName.trim() !== "") {
         localStorage.setItem("playerName", playerName.trim());
         gameState = "game";
         startTime = Date.now();
         bgMusic.play().catch(() => {
            console.log("Clique na tela para iniciar a música");
         });
         return;
      }
      if (e.key === "Backspace") {
         playerName = playerName.slice(0, -1);
         return;
      }
      if (e.key.length === 1 && playerName.length < 20) {
         playerName += e.key;
         return;
      }
   }
   
   if (showProposal) {
      if (e.key === "ArrowRight" && wizardDialogIndex < wizardDialogs.length - 1)
         wizardDialogIndex++;
      if (e.key === "ArrowLeft" && wizardDialogIndex > 0) wizardDialogIndex--;
   }
   
   if (showProposal) {
      if (touchControls.dialogRight.active && wizardDialogIndex < wizardDialogs.length - 1) {
         wizardDialogIndex++;
         touchControls.dialogRight.active = false; 
      }
      if (touchControls.dialogLeft.active && wizardDialogIndex > 0) {
         wizardDialogIndex--;
         touchControls.dialogLeft.active = false; 
      }
   }
});
document.addEventListener("keyup", (e) => (keys[e.key] = false));

canvas.addEventListener("click", (e) => {
   if (gameState === "menu") {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x > 300 && x < 500 && y > 200 && y < 240) {
         gameState = "nameInput";
         nameInputActive = true;
         
         const savedName = localStorage.getItem("playerName");
         if (savedName) {
            playerName = savedName;
         }
      }
   }
});


canvas.addEventListener("mousemove", (e) => {
   if (gameState === "menu") {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x > 300 && x < 500 && y > 200 && y < 240) {
         canvas.style.cursor = "pointer";
      } else {
         canvas.style.cursor = "default";
      }
   } else {
      canvas.style.cursor = "default";
   }
});

canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchend", handleTouchEnd);
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMouseUp);

function handleTouchStart(e) {
   e.preventDefault();
   const rect = canvas.getBoundingClientRect();
   const touch = e.touches[0];
   const x = touch.clientX - rect.left;
   const y = touch.clientY - rect.top;
   
   checkTouchControls(x, y, true);
}

function handleTouchEnd(e) {
   e.preventDefault();
   resetTouchControls();
}

function handleMouseDown(e) {
   const rect = canvas.getBoundingClientRect();
   const x = e.clientX - rect.left;
   const y = e.clientY - rect.top;
   
   checkTouchControls(x, y, true);
}

function handleMouseUp(e) {
   resetTouchControls();
}

function checkTouchControls(x, y, active) {
   Object.keys(touchControls).forEach(key => {
      const control = touchControls[key];
      if (x >= control.x && x <= control.x + control.width &&
          y >= control.y && y <= control.y + control.height) {
         control.active = active;
      }
   });
}

function resetTouchControls() {
   Object.keys(touchControls).forEach(key => {
      touchControls[key].active = false;
   });
}

function update() {
   if (gameState !== "game" || finished) return;

   let moveRight = keys["ArrowRight"] || keys["d"] || touchControls.rightArrow.active;
   let moveLeft = keys["ArrowLeft"] || keys["a"] || touchControls.leftArrow.active;
   let jump = keys[" "] || keys["ArrowUp"] || keys["w"] || touchControls.jumpButton.active;

   player.velocityX = moveRight ? 2 : moveLeft ? -2 : 0;
   
   if (jump && !player.jumping) {
      player.velocityY = -11;
      player.jumping = true;
   }

   player.velocityY += gravity;
   player.x += player.velocityX;
   player.y += player.velocityY;

   let hitSpike = false;
   spikes.forEach((spike) => {
      if (
         player.x < spike.x + spike.width &&
         player.x + player.width > spike.x &&
         player.y < spike.y + spike.height &&
         player.y + player.height > spike.y
      ) {
         hitSpike = true;
      }
   });

   if (hitSpike) {
      resetPlayer();
      return;
   }

   let onPlatform = false;
   platforms.forEach((p) => {
      if (
         player.x + player.width > p.x &&
         player.x < p.x + p.width &&
         player.y + player.height >= p.y &&
         player.y + player.height <= p.y + 10 &&
         player.velocityY >= 0
      ) {
         player.y = p.y - player.height;
         player.velocityY = 0;
         player.jumping = false;
         onPlatform = true;
      }
   });
   if (!onPlatform) player.jumping = true;

   crystals.forEach((c) => {
      if (
         !c.collected &&
         player.x < c.x + 10 &&
         player.x + player.width > c.x - 10 &&
         player.y < c.y + 20 &&
         player.y + player.height > c.y
      ) {
         c.collected = true;
      }
   });

   coins.forEach((c) => {
      if (
         !c.collected &&
         player.x < c.x + 10 &&
         player.x + player.width > c.x &&
         player.y < c.y + 10 &&
         player.y + player.height > c.y
      ) {
         c.collected = true;
         coinCount++;
      }
   });

   specialCoins.forEach((c) => {
      if (
         !c.collected &&
         player.x < c.x + 10 &&
         player.x + player.width > c.x &&
         player.y < c.y + 10 &&
         player.y + player.height > c.y
      ) {
         c.collected = true;
         coinCount++;
      }
   });

   enemies.forEach((e) => {
      if (!e.alive) return;
      
      let obstacleAhead = false;
      const nextX = e.x + e.speed;
      
      spikes.forEach((spike) => {
         if (e.speed > 0 &&
             nextX + e.width > spike.x && 
             nextX < spike.x + spike.width &&
             e.y < spike.y + spike.height &&
             e.y + e.height > spike.y) {
            obstacleAhead = true;
         }
         if (e.speed < 0 &&
             nextX < spike.x + spike.width && 
             nextX + e.width > spike.x &&
             e.y < spike.y + spike.height &&
             e.y + e.height > spike.y) {
            obstacleAhead = true;
         }
      });
      
      if (obstacleAhead) {
         e.speed *= -1;
      } else {
         e.x += e.speed;
      }
      
      if (e.x < 0 || e.x + e.width > worldWidth) e.speed *= -1;

      if (
         player.x < e.x + e.width &&
         player.x + player.width > e.x &&
         player.y < e.y + e.height &&
         player.y + player.height > e.y
      ) {
         if (player.velocityY > 0 && player.y + player.height - e.y < 10) {
         e.alive = false;
         player.velocityY = -12;
         } else {
         resetPlayer();
         }
      }
   });

   birds.forEach((bird) => {
      if (!bird.alive) return;
      
      bird.time += bird.frequency;
      bird.y = 100 + Math.sin(bird.time) * bird.amplitude;
      bird.x += bird.speed * bird.direction;
      
      if (bird.x < 0 || bird.x > worldWidth) {
         bird.direction *= -1;
      }

      if (
         player.x < bird.x + bird.width &&
         player.x + player.width > bird.x &&
         player.y < bird.y + bird.height &&
         player.y + player.height > bird.y
      ) {
         resetPlayer();
      }
   });

   if (player.y > canvas.height) resetPlayer();

   if (player.x > worldWidth - 100) {
      finished = true;
      player.x -= 40;
      setTimeout(() => (showProposal = true), 1500);
   }
}

function drawClouds() {
   ctx.fillStyle = "white";
   for (let i = 0; i < 12; i++) {
      let x = i * 350 + 100 - cameraX;
      ctx.beginPath();
      ctx.arc(x, 80, 20, 0, Math.PI * 2);
      ctx.arc(x + 20, 80, 25, 0, Math.PI * 2);
      ctx.arc(x + 40, 80, 20, 0, Math.PI * 2);
      ctx.fill();
   }
}

function drawMountains() {
   ctx.fillStyle = "#8B4513";
   for (let i = 0; i < 8; i++) {
      let x = i * 500 - cameraX;
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x + 100, groundY - 80);
      ctx.lineTo(x + 200, groundY);
      ctx.closePath();
      ctx.fill();
   }
}

function drawTrees() {
   ctx.fillStyle = "#228B22";
   for (let i = 0; i < 15; i++) {
      let x = i * 250 - cameraX;
      if (x > -50 && x < canvas.width + 50) {
         ctx.fillStyle = "#8B4513";
         ctx.fillRect(x + 5, groundY - 40, 10, 40);
         ctx.fillStyle = "#228B22";
         ctx.beginPath();
         ctx.arc(x + 10, groundY - 50, 20, 0, Math.PI * 2);
         ctx.fill();
      }
   }
}

function drawFlag() {
   const baseX = worldWidth - 80 - cameraX;
   ctx.fillStyle = "black";
   ctx.fillRect(baseX, groundY - 100, 4, 100);
   ctx.fillStyle = "#ff0000";
   ctx.beginPath();
   ctx.moveTo(baseX + 4, groundY - 100);
   ctx.lineTo(baseX + 30, groundY - 90);
   ctx.lineTo(baseX + 4, groundY - 80);
   ctx.closePath();
   ctx.fill();
}

function wrapText(text, maxWidth) {
   const words = text.split(" ");
   const lines = [];
   let line = "";

   for (let word of words) {
      const testLine = line + word + " ";
      if (ctx.measureText(testLine).width > maxWidth - 30) {
         if (line.trim() !== "") {
            lines.push(line.trim());
         }
         line = word + " ";
      } else {
         line = testLine;
      }
   }
   if (line.trim() !== "") {
      lines.push(line.trim());
   }
   return lines;
}

function drawTextBox(text, x, y, width = 360) {
   const lines = wrapText(text, width);

   const boxHeight = 30 + lines.length * 18;

   ctx.globalAlpha = 0.85;
   ctx.fillStyle = "white";
   ctx.fillRect(x, y, width, boxHeight);
   ctx.globalAlpha = 1;

   ctx.fillStyle = "black";
   ctx.font = "14px Arial";
   lines.forEach((line, i) => {
      ctx.fillText(line, x + 10, y + 20 + i * 18);
   });

   if (wizardDialogIndex > 0) {
      ctx.fillStyle = "#0066CC";
      ctx.fillText("<", x + 10, y + boxHeight - 5);
   }
   if (wizardDialogIndex < wizardDialogs.length - 1) {
      ctx.fillStyle = "#0066CC";
      ctx.fillText(">", x + width - 20, y + boxHeight - 5);
   }
}

function drawMenu() {
   localStorage.removeItem("playerName");
   
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   
   ctx.drawImage(menuImg, 0, 0, canvas.width, canvas.height);
   
   ctx.fillStyle = "#4A4A4A";
   ctx.fillRect(300, 200, 200, 40);
   ctx.fillStyle = "#6A6A6A";
   ctx.fillRect(305, 205, 190, 30);
   
   ctx.fillStyle = "#FFFFFF";
   ctx.font = "bold 20px 'Courier New'";
   ctx.textAlign = "center";
   ctx.fillText("COMEÇAR", 400, 225);
   ctx.textAlign = "left";
   
   ctx.fillStyle = "#FFD700";
   ctx.font = "14px Arial";
   ctx.textAlign = "center";
   ctx.fillText("Toque ou clique para começar", 400, 260);
   ctx.textAlign = "left";
}

function drawNameInput() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   
   ctx.drawImage(menuImg, 0, 0, canvas.width, canvas.height);
   
   ctx.drawImage(playerImg, 100, 150, 80, 120);
   
   ctx.fillStyle = "#4A4A4A";
   ctx.fillRect(250, 180, 300, 50);
   ctx.fillStyle = "#6A6A6A";
   ctx.fillRect(255, 185, 290, 40);
   
   ctx.fillStyle = "#FFFFFF";
   ctx.font = "bold 16px 'Courier New'";
   ctx.fillText("Digite seu nome:", 260, 200);
   
   ctx.fillStyle = "#FFFFFF";
   ctx.font = "bold 18px 'Courier New'";
   ctx.fillText(playerName + (Date.now() % 1000 < 500 ? "|" : ""), 260, 220);
   
   ctx.font = "14px 'Courier New'";
   ctx.fillText("Pressione ENTER ou toque no botão", 260, 250);
   
   ctx.fillStyle = "#4CAF50";
   ctx.fillRect(250, 280, 300, 40);
   ctx.fillStyle = "#FFFFFF";
   ctx.font = "bold 18px 'Courier New'";
   ctx.textAlign = "center";
   ctx.fillText("COMEÇAR JOGO", 400, 305);
   ctx.textAlign = "left";
   

   const savedName = localStorage.getItem("playerName");
   if (savedName && playerName === "") {
      ctx.fillStyle = "#888888";
      ctx.font = "14px 'Courier New'";
      ctx.fillText("Nome anterior: " + savedName, 260, 320);
   }
}

function draw() {
   if (gameState === "menu") {
      drawMenu();
      return;
   }
   
   if (gameState === "nameInput") {
      drawNameInput();
      return;
   }
   
   if (gameState === "game") {
      drawTouchControls();
   }
   
   cameraX = player.x - 100;
   if (cameraX < 0) cameraX = 0;
   if (cameraX > worldWidth - canvas.width) cameraX = worldWidth - canvas.width;

   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.fillStyle = "#87CEEB";
   ctx.fillRect(0, 0, canvas.width, canvas.height);
   drawClouds();
   drawMountains();
   drawTrees();

   holes.forEach((hole) => {
   });

   ctx.fillStyle = "#FF0000";
   spikes.forEach((spike) => {
      ctx.beginPath();
      ctx.moveTo(spike.x - cameraX, spike.y + spike.height);
      ctx.lineTo(spike.x - cameraX + spike.width/2, spike.y);
      ctx.lineTo(spike.x - cameraX + spike.width, spike.y + spike.height);
      ctx.closePath();
      ctx.fill();
   });

   platforms.forEach((p) => {
      ctx.fillStyle = "#228B22";
      ctx.fillRect(p.x - cameraX, p.y, p.width, 5);
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(p.x - cameraX, p.y + 5, p.width, p.height - 5);
   });

   coins.forEach(
      (c) =>
         !c.collected && ctx.drawImage(coinImg, c.x - cameraX - 6, c.y - 6, 16, 16)
   );
   
   specialCoins.forEach(
      (c) =>
         !c.collected && ctx.drawImage(coinImg, c.x - cameraX - 6, c.y - 6, 16, 16)
   );
   crystals.forEach(
      (c) =>
         !c.collected &&
         ctx.drawImage(crystalImg, c.x - cameraX - 6, c.y - 6, 16, 16)
   );
   enemies.forEach(
      (e) =>
         e.alive &&
         ctx.drawImage(enemyImg, e.x - cameraX, e.y, e.width + 10, e.height + 10)
   );

   birds.forEach((bird) => {
      if (bird.alive) {
         ctx.fillStyle = "#8B4513";
         ctx.fillRect(bird.x - cameraX, bird.y, bird.width, bird.height);
         ctx.fillStyle = "#A0522D";
         ctx.fillRect(bird.x - cameraX + 5, bird.y - 5, 8, 5);
         ctx.fillRect(bird.x - cameraX + 12, bird.y - 5, 8, 5);
      }
   });

   ctx.fillStyle = "black";
   ctx.font = "14px Arial";
   ctx.fillText("Gold: " + coinCount, 20, 20);
   const timeNow = Math.floor((Date.now() - startTime) / 1000);
   ctx.fillText("Timer: " + timeNow + "s", 20, 40);
   
   const collectedCrystals = crystals.filter(c => c.collected).length;
   ctx.fillText("Cristais: " + collectedCrystals + "/" + crystals.length, 20, 70);
   
   for (let i = 0; i < crystals.length; i++) {
      const x = 20 + (i * 30);
      const y = 85;
      
      if (crystals[i].collected) {
         ctx.drawImage(crystalImg, x, y, 20, 20);
      } else {
          ctx.strokeStyle = "#666666";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, 20, 20);
          ctx.fillStyle = "#CCCCCC";
          ctx.fillRect(x + 2, y + 2, 16, 16);
          
          ctx.fillStyle = "#999999";
          ctx.font = "bold 12px Arial";
          ctx.textAlign = "center";
          ctx.fillText("?", x + 10, y + 15);
          ctx.textAlign = "left";
       }
   }

   ctx.drawImage(
      playerImg,
      player.x - cameraX - 20,
      player.y - 35,
      player.width + 40,
      player.height + 55
   );
   drawFlag();

   if (finished || showProposal) {
      const wx = worldWidth - 40 - cameraX;
      ctx.drawImage(wizardImg, wx, 300, 30, 60);
      
      const savedPlayerName = localStorage.getItem("playerName") || "Aventureiro";
      let currentDialog = wizardDialogs[wizardDialogIndex];
      
      if (currentDialog.includes("${playerName}")) {
         currentDialog = currentDialog.replace("${playerName}", savedPlayerName);
      }
      
      drawTextBox(currentDialog, canvas.width / 2 - 180, 100);
      
      ctx.fillStyle = "#666666";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${wizardDialogIndex + 1} de ${wizardDialogs.length}`, canvas.width / 2, 90);
      ctx.textAlign = "left";
   }
}

function drawTouchControls() {
   if (gameState === "game") {
      ctx.fillStyle = touchControls.leftArrow.active ? "#4CAF50" : "#2196F3";
      ctx.fillRect(touchControls.leftArrow.x, touchControls.leftArrow.y, touchControls.leftArrow.width, touchControls.leftArrow.height);
      ctx.fillStyle = "white";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText("←", touchControls.leftArrow.x + 20, touchControls.leftArrow.y + 27);
      
      ctx.fillStyle = touchControls.rightArrow.active ? "#4CAF50" : "#2196F3";
      ctx.fillRect(touchControls.rightArrow.x, touchControls.rightArrow.y, touchControls.rightArrow.width, touchControls.rightArrow.height);
      ctx.fillStyle = "white";
      ctx.fillText("→", touchControls.rightArrow.x + 20, touchControls.rightArrow.y + 27);
      
      ctx.fillStyle = touchControls.jumpButton.active ? "#FF9800" : "#FF5722";
      ctx.fillRect(touchControls.jumpButton.x, touchControls.jumpButton.y, touchControls.jumpButton.width, touchControls.jumpButton.height);
      ctx.fillStyle = "white";
      ctx.fillText("↑", touchControls.jumpButton.x + 20, touchControls.jumpButton.y + 27);
   }
   
   if (finished || showProposal) {
      if (wizardDialogIndex > 0) {
         ctx.fillStyle = touchControls.dialogLeft.active ? "#4CAF50" : "#9C27B0";
         ctx.fillRect(touchControls.dialogLeft.x, touchControls.dialogLeft.y, touchControls.dialogLeft.width, touchControls.dialogLeft.height);
         ctx.fillStyle = "white";
         ctx.font = "bold 20px Arial";
         ctx.textAlign = "center";
         ctx.fillText("←", touchControls.dialogLeft.x + 20, touchControls.dialogLeft.y + 27);
      }
      
      if (wizardDialogIndex < wizardDialogs.length - 1) {
         ctx.fillStyle = touchControls.dialogRight.active ? "#4CAF50" : "#9C27B0";
         ctx.fillRect(touchControls.dialogRight.x, touchControls.dialogRight.y, touchControls.dialogRight.width, touchControls.dialogRight.height);
         ctx.fillStyle = "white";
         ctx.font = "bold 20px Arial";
         ctx.textAlign = "center";
         ctx.fillText("→", touchControls.dialogRight.x + 20, touchControls.dialogRight.y + 27);
      }
   }
   
   ctx.textAlign = "left";
}

function loop() {
   update();
   draw();
   requestAnimationFrame(loop);
}
loop();
