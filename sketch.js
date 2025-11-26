let ornaments = [];
let selectedOrnament = 'red';
let targetOrnaments = 25;
let gameState = 'playing';
let sparkles = [];
let particles = [];
let snowflakes = [];
let combo = 0;
let comboTimer = 0;
let score = 0;
let lights = [];
let lightPulse = 0;

let ornamentTypes = {
  red: { color: [255, 20, 50], glow: [255, 100, 120], shimmer: [255, 180, 200], points: 10 },
  blue: { color: [0, 150, 255], glow: [100, 200, 255], shimmer: [200, 230, 255], points: 10 },
  gold: { color: [255, 200, 0], glow: [255, 230, 100], shimmer: [255, 245, 180], points: 15 },
  purple: { color: [180, 50, 255], glow: [210, 130, 255], shimmer: [235, 200, 255], points: 10 },
  pink: { color: [255, 50, 150], glow: [255, 130, 200], shimmer: [255, 200, 230], points: 10 },
  star: { color: [255, 240, 0], glow: [255, 250, 150], shimmer: [255, 255, 220], points: 25 },
  rainbow: { color: [255, 100, 150], glow: [150, 200, 255], shimmer: [255, 255, 180], points: 30 }
};

class Particle {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.vx = random(-3, 3);
    this.vy = random(-5, -2);
    this.alpha = 255;
    this.size = random(3, 8);
    this.color = col;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2;
    this.alpha -= 5;
  }
  
  show() {
    push();
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], this.alpha);
    circle(this.x, this.y, this.size);
    pop();
  }
  
  isDead() {
    return this.alpha <= 0;
  }
}

class Snowflake {
  constructor() {
    this.x = random(width);
    this.y = random(-100, -10);
    this.vx = random(-0.5, 0.5);
    this.vy = random(1, 3);
    this.size = random(2, 5);
    this.alpha = random(150, 255);
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx += random(-0.1, 0.1);
    
    if (this.y > height) {
      this.y = random(-100, -10);
      this.x = random(width);
    }
  }
  
  show() {
    push();
    noStroke();
    fill(255, 255, 255, this.alpha);
    circle(this.x, this.y, this.size);
    pop();
  }
}

function setup() {
  createCanvas(1000, 1000);
  
  // Create background sparkles
  for (let i = 0; i < 100; i++) {
    sparkles.push({
      x: random(width),
      y: random(height * 0.6),
      size: random(1, 4),
      twinkle: random(TWO_PI),
      speed: random(0.02, 0.08)
    });
  }
  
  // Create snowflakes
  for (let i = 0; i < 50; i++) {
    snowflakes.push(new Snowflake());
  }
  
  // Create string lights on tree
  createLights();
}

function createLights() {
  lights = [];
  // Lights spiral around tree
  for (let angle = 0; angle < TWO_PI * 4; angle += 0.3) {
    let y = map(angle, 0, TWO_PI * 4, 200, 650);
    let radius = map(y, 200, 650, 20, 200);
    let x = 450 + cos(angle) * radius;
    
    if (isPointInTree(x, y)) {
      lights.push({
        x: x,
        y: y,
        phase: random(TWO_PI),
        color: [random(200, 255), random(200, 255), random(150, 255)]
      });
    }
  }
}

function draw() {
  // Gradient background
  drawGradient(0, 0, width, height, color(5, 10, 40), color(20, 5, 35));
  
  // Update and draw snowflakes
  for (let flake of snowflakes) {
    flake.update();
    flake.show();
  }
  
  // Twinkling stars
  for (let s of sparkles) {
    s.twinkle += s.speed;
    let brightness = map(sin(s.twinkle), -1, 1, 100, 255);
    fill(255, 255, 200, brightness);
    noStroke();
    circle(s.x, s.y, s.size);
    
    // Occasional shooting star effect
    if (random(1) < 0.001) {
      stroke(255, 255, 200, brightness);
      strokeWeight(1);
      line(s.x, s.y, s.x - 10, s.y + 10);
    }
  }
  
  // Moon with glow
  push();
  fill(255, 255, 220, 50);
  circle(700, 150, 140);
  fill(255, 255, 220, 100);
  circle(700, 150, 110);
  fill(255, 255, 230, 200);
  circle(700, 150, 90);
  pop();
  
  // Snow ground with depth
  fill(255, 255, 255);
  noStroke();
  ellipse(width / 2, 850, width * 1.5, 200);
  
  // Snow texture
  for (let i = 0; i < 40; i++) {
    fill(240, 240, 255, random(100, 200));
    let sx = (i * 123) % width;
    circle(sx, 760 + random(-10, 20), random(3, 10));
  }
  
  drawTree();
  
  // Draw string lights with pulse effect
  lightPulse += 0.05;
  for (let light of lights) {
    let brightness = map(sin(light.phase + lightPulse), -1, 1, 100, 255);
    push();
    fill(light.color[0], light.color[1], light.color[2], brightness);
    noStroke();
    circle(light.x, light.y, 8);
    
    // Glow
    fill(light.color[0], light.color[1], light.color[2], brightness * 0.3);
    circle(light.x, light.y, 16);
    pop();
  }
  
  // Draw placed ornaments with bobbing animation
  for (let i = 0; i < ornaments.length; i++) {
    let orn = ornaments[i];
    let wobble = sin(frameCount * 0.05 + i) * 2;
    drawOrnament(orn.x, orn.y + wobble, orn.type, 1.0);
  }
  
  // Preview ornament at mouse with scale animation
  if (isPointInTree(mouseX, mouseY) && gameState === 'playing') {
    let pulseSize = 1 + sin(frameCount * 0.1) * 0.1;
    push();
    translate(mouseX, mouseY);
    scale(pulseSize);
    drawOrnament(0, 0, selectedOrnament, 0.6);
    pop();
  }
  
  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // Combo timer
  if (comboTimer > 0) {
    comboTimer--;
    if (comboTimer === 0) {
      combo = 0;
    }
  }
  
  drawUI();
  
  if (ornaments.length >= targetOrnaments && gameState === 'playing') {
    gameState = 'won';
    createFireworks();
  }
  
  if (gameState === 'won') {
    drawWinScreen();
  }
  
  // Enhanced cursor
  if (gameState === 'playing') {
    push();
    noFill();
    stroke(255, 200, 100, 200);
    strokeWeight(3);
    let cursorPulse = 20 + sin(frameCount * 0.1) * 5;
    circle(mouseX, mouseY, cursorPulse);
    
    stroke(255, 150);
    strokeWeight(1);
    line(mouseX - 15, mouseY, mouseX + 15, mouseY);
    line(mouseX, mouseY - 15, mouseX, mouseY + 15);
    pop();
  }
}

function drawGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

function drawTree() {
  // Tree shadow
  push();
  fill(0, 0, 0, 50);
  noStroke();
  ellipse(450, 770, 500, 60);
  pop();
  
  // Enhanced trunk with texture
  noStroke();
  fill(80, 40, 20);
  rect(420, 680, 60, 140);
  
  // Trunk details
  fill(100, 60, 30);
  rect(425, 680, 20, 140);
  fill(60, 30, 15);
  rect(460, 680, 10, 140);
  
  // Tree layers with darker green and depth
  fill(8, 60, 25);
  
  // Bottom layer
  triangle(450, 680, 150, 680, 750, 680);
  
  // Add depth shadows to tree
  fill(5, 40, 20);
  triangle(450, 680, 150, 680, 450, 640);
  
  fill(8, 60, 25);
  triangle(450, 550, 220, 660, 680, 660);
  fill(5, 40, 20);
  triangle(450, 550, 220, 660, 450, 510);
  
  fill(8, 60, 25);
  triangle(450, 430, 270, 540, 630, 540);
  fill(5, 40, 20);
  triangle(450, 430, 270, 540, 450, 390);
  
  fill(8, 60, 25);
  triangle(450, 310, 320, 420, 580, 420);
  fill(5, 40, 20);
  triangle(450, 310, 320, 420, 450, 270);
  
  fill(8, 60, 25);
  triangle(450, 230, 360, 320, 540, 320);
  
  // Add highlights for depth
  fill(20, 100, 40, 120);
  triangle(450, 680, 750, 680, 600, 640);
  triangle(450, 550, 680, 660, 580, 600);
  triangle(450, 430, 630, 540, 540, 480);
  triangle(450, 310, 580, 420, 510, 360);
  
  // Animated star topper
  push();
  translate(450, 200);
  rotate(sin(frameCount * 0.02) * 0.1);
  
  // Star glow layers
  fill(255, 240, 100, 100);
  drawStar(0, 0, 5, 50, 25);
  fill(255, 245, 150, 150);
  drawStar(0, 0, 5, 40, 20);
  fill(255, 250, 0);
  drawStar(0, 0, 5, 30, 15);
  fill(255, 255, 200);
  drawStar(0, 0, 5, 15, 8);
  pop();
}

function drawOrnament(x, y, type, opacity) {
  let ornament = ornamentTypes[type];
  let size = 32;
  
  push();
  
  if (type === 'rainbow') {
    // Special rainbow ornament
    let hueShift = (frameCount * 2) % 360;
    colorMode(HSB);
    
    noStroke();
    fill(hueShift, 80, 100, 60 * opacity);
    circle(x, y, size + 25);
    
    fill(hueShift, 90, 100, 255 * opacity);
    circle(x, y, size);
    
    fill((hueShift + 60) % 360, 80, 100, 150 * opacity);
    circle(x - size / 4, y - size / 4, size / 2);
    
    fill(0, 0, 100, 200 * opacity);
    circle(x - size / 3, y - size / 3, size / 4);
    
    colorMode(RGB);
  } else if (type === 'star') {
    fill(ornament.glow[0], ornament.glow[1], ornament.glow[2], 80 * opacity);
    drawStar(x, y, 5, size + 12, (size + 12) / 2);
    
    fill(ornament.color[0], ornament.color[1], ornament.color[2], 255 * opacity);
    drawStar(x, y, 5, size, size / 2);
    
    fill(ornament.shimmer[0], ornament.shimmer[1], ornament.shimmer[2], 200 * opacity);
    drawStar(x, y, 5, size / 2, size / 4);
  } else {
    noStroke();
    
    // Multiple glow layers
    fill(ornament.glow[0], ornament.glow[1], ornament.glow[2], 40 * opacity);
    circle(x, y, size + 30);
    
    fill(ornament.glow[0], ornament.glow[1], ornament.glow[2], 80 * opacity);
    circle(x, y, size + 15);
    
    fill(ornament.color[0], ornament.color[1], ornament.color[2], 255 * opacity);
    circle(x, y, size);
    
    fill(ornament.shimmer[0], ornament.shimmer[1], ornament.shimmer[2], 180 * opacity);
    circle(x - size / 4, y - size / 4, size / 2.2);
    
    fill(255, 255, 255, 220 * opacity);
    circle(x - size / 3, y - size / 3, size / 3.5);
    
    // Ornament cap
    stroke(180, 150, 80);
    strokeWeight(3);
    fill(200, 170, 100);
    arc(x, y - size / 2 - 4, 10, 10, 0, PI);
    
    // String
    stroke(100, 100, 100);
    strokeWeight(1);
    line(x, y - size / 2 - 9, x, y - size / 2 - 15);
  }
  
  pop();
}

function drawStar(cx, cy, points, outerRadius, innerRadius) {
  let angle = TWO_PI / points;
  let halfAngle = angle / 2.0;
  
  beginShape();
  for (let a = -PI / 2; a < TWO_PI - PI / 2; a += angle) {
    let sx = cx + cos(a) * outerRadius;
    let sy = cy + sin(a) * outerRadius;
    vertex(sx, sy);
    sx = cx + cos(a + halfAngle) * innerRadius;
    sy = cy + sin(a + halfAngle) * innerRadius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function drawUI() {
  // Main UI panel
  push();
  fill(15, 25, 50, 250);
  noStroke();
  rect(20, 20, 300, 320, 15);
  
  stroke(80, 120, 200);
  strokeWeight(4);
  noFill();
  rect(20, 20, 300, 320, 15);
  pop();
  
  // Title
  noStroke();
  fill(255, 220, 100);
  textSize(28);
  textStyle(BOLD);
  text('🎄 Tree Decorator Pro', 35, 55);
  
  // Score display
  fill(150, 255, 150);
  textSize(22);
  text('Score: ' + score, 35, 90);
  
  // Ornament counter
  fill(255);
  textSize(18);
  textStyle(NORMAL);
  text('Ornaments: ' + ornaments.length + '/' + targetOrnaments, 35, 120);
  
  // Progress bar with glow
  fill(30, 30, 60);
  rect(35, 135, 250, 20, 10);
  
  let progress = (ornaments.length / targetOrnaments) * 250;
  fill(100, 200, 255, 100);
  rect(33, 133, progress + 4, 24, 10);
  fill(80, 180, 255);
  rect(35, 135, progress, 20, 10);
  
  // Combo display
  if (combo > 1) {
    push();
    let comboScale = map(comboTimer, 0, 120, 1, 1.5);
    translate(170, 175);
    scale(comboScale);
    fill(255, 200, 0);
    textSize(24);
    textStyle(BOLD);
    text('COMBO x' + combo + '!', -50, 0);
    pop();
  }
  
  fill(180, 200, 255);
  textSize(16);
  text('Select ornament (1-7):', 35, 185);
  
  // Ornament selector with enhanced visuals
  let types = Object.keys(ornamentTypes);
  for (let i = 0; i < types.length; i++) {
    let type = types[i];
    let yPos = 210 + i * 24;
    
    if (type === selectedOrnament) {
      fill(255, 180, 0, 200);
      noStroke();
      rect(30, yPos - 18, 260, 22, 8);
      
      // Animated selection indicator
      fill(255, 220, 100);
      triangle(25, yPos - 10, 25, yPos - 2, 30, yPos - 6);
    }
    
    fill(255);
    textSize(15);
    textStyle(NORMAL);
    text((i + 1) + '. ' + type.toUpperCase(), 45, yPos);
    
    // Points display
    fill(100, 255, 150);
    textSize(12);
    text('+' + ornamentTypes[type].points + 'pts', 200, yPos);
    
    // Mini ornament preview (animated)
    push();
    translate(270, yPos - 8);
    let previewScale = type === selectedOrnament ? 0.7 + sin(frameCount * 0.1) * 0.1 : 0.6;
    scale(previewScale);
    drawOrnament(0, 0, type, 1.0);
    pop();
  }
  
  // Instructions at bottom
  fill(200, 200, 255, 200);
  textSize(12);
  text('Click on tree to place', 35, 305);
  text('R to reset', 35, 323);
}

function drawWinScreen() {
  // Firework particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // Dark overlay
  fill(0, 0, 0, 220);
  noStroke();
  rect(0, 0, width, height);
  
  // Victory panel
  push();
  fill(20, 80, 40, 250);
  rect(100, 250, 700, 400, 25);
  
  stroke(255, 215, 0);
  strokeWeight(6);
  noFill();
  rect(100, 250, 700, 400, 25);
  
  // Inner glow
  stroke(255, 215, 0, 100);
  strokeWeight(12);
  rect(100, 250, 700, 400, 25);
  pop();
  
  // Animated title
  push();
  let titleBounce = sin(frameCount * 0.1) * 10;
  translate(0, titleBounce);
  noStroke();
  fill(255, 215, 0);
  textSize(72);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('🎄 MASTERPIECE! 🎄', width / 2, 350);
  pop();
  
  fill(150, 255, 150);
  textSize(32);
  text('Final Score: ' + score, width / 2, 430);
  
  fill(200, 230, 255);
  textSize(24);
  text('You placed ' + ornaments.length + ' beautiful ornaments!', width / 2, 480);
  
  // Stats
  fill(255, 200, 100);
  textSize(20);
  text('Max Combo: x' + Math.max(combo, 1), width / 2, 530);
  
  fill(255);
  textSize(28);
  text('Press R to decorate again', width / 2, 600);
  
  textAlign(LEFT);
}

function createFireworks() {
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height / 2);
    let col = [random(200, 255), random(200, 255), random(100, 255)];
    particles.push(new Particle(x, y, col));
  }
}

function isPointInTree(x, y) {
  if (y < 230 || y > 680) return false;
  
  let leftBound, rightBound;
  
  if (y <= 320) {
    let ratio = (y - 230) / 90;
    leftBound = 450 - (90 * ratio);
    rightBound = 450 + (90 * ratio);
  } else if (y <= 420) {
    let ratio = (y - 230) / 190;
    leftBound = 450 - (130 * ratio);
    rightBound = 450 + (130 * ratio);
  } else if (y <= 540) {
    let ratio = (y - 310) / 230;
    leftBound = 450 - (180 * ratio);
    rightBound = 450 + (180 * ratio);
  } else if (y <= 660) {
    let ratio = (y - 430) / 230;
    leftBound = 450 - (230 * ratio);
    rightBound = 450 + (230 * ratio);
  } else {
    let ratio = (y - 550) / 130;
    leftBound = 450 - (300 * ratio);
    rightBound = 450 + (300 * ratio);
  }
  
  return x >= leftBound && x <= rightBound;
}

function mousePressed() {
  if (gameState === 'won') return;
  
  if (isPointInTree(mouseX, mouseY)) {
    let tooClose = false;
    for (let orn of ornaments) {
      let distance = dist(orn.x, orn.y, mouseX, mouseY);
      if (distance < 45) {
        tooClose = true;
        break;
      }
    }
    
    if (!tooClose) {
      ornaments.push({
        x: mouseX,
        y: mouseY,
        type: selectedOrnament
      });
      
      // Add points with combo multiplier
      combo++;
      comboTimer = 120;
      let points = ornamentTypes[selectedOrnament].points * combo;
      score += points;
      
      // Create particle burst
      let ornament = ornamentTypes[selectedOrnament];
      for (let i = 0; i < 15; i++) {
        particles.push(new Particle(mouseX, mouseY, ornament.color));
      }
    }
  }
}

function keyPressed() {
  let types = ['red', 'blue', 'gold', 'purple', 'pink', 'star', 'rainbow'];
  if (key >= '1' && key <= '7') {
    selectedOrnament = types[parseInt(key) - 1];
  }
  
  if (key === 'r' || key === 'R') {
    ornaments = [];
    gameState = 'playing';
    score = 0;
    combo = 0;
    comboTimer = 0;
    particles = [];
  }
}