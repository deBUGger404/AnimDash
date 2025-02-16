"use strict";

// Matter.js module aliases
const { Engine, Render, Runner, Bodies, Body, Composite, Events } = Matter;

// Create Engine & World
const engine = Engine.create();
const world = engine.world;

// Renderer Setup
const width = window.innerWidth;
const height = window.innerHeight;
const render = Render.create({
  element: document.getElementById('canvas-container'),
  engine: engine,
  options: {
    width: width,
    height: height,
    wireframes: false,
    background: "rgb(44, 62, 80)"
  }
});
Render.run(render);

// Runner Setup
const runner = Runner.create();
Runner.run(runner, engine);

// Pause state
let isPaused = false;

// --- HEXAGON CONTAINER ---
const centerX = width / 2;
const centerY = height / 2;
const containerRadius = 200;
const numSides = 6;
const wallThickness = 4;

const walls = [];
for (let i = 0; i < numSides; i++) {
  const angle1 = (i / numSides) * 2 * Math.PI;
  const angle2 = ((i + 1) / numSides) * 2 * Math.PI;
  
  const x1 = centerX + containerRadius * Math.cos(angle1);
  const y1 = centerY + containerRadius * Math.sin(angle1);
  const x2 = centerX + containerRadius * Math.cos(angle2);
  const y2 = centerY + containerRadius * Math.sin(angle2);
  
  const wallCenterX = (x1 + x2) / 2;
  const wallCenterY = (y1 + y2) / 2;
  
  const length = Math.hypot(x2 - x1, y2 - y1);
  const wallAngle = Math.atan2(y2 - y1, x2 - x1);
  
  const wall = Bodies.rectangle(
    wallCenterX,
    wallCenterY,
    length,
    wallThickness,
    {
      isStatic: true,
      friction: 0.1,
      restitution: 0.7,
      render: {
        fillStyle: "transparent",
        strokeStyle: "#fff",
        lineWidth: 2,
      },
    }
  );
  Body.setAngle(wall, wallAngle);
  walls.push(wall);
}

const hexagonContainer = Body.create({
  parts: walls,
  isStatic: true,
});
Composite.add(world, hexagonContainer);

// --- BALLS (Supports Multiple Balls) ---
let balls = [];
function createBalls(count) {
  count = Math.max(1, Math.min(10, count)); // Ensure count is within limits
  
  // Clear previous balls
  balls.forEach(ball => Composite.remove(world, ball));
  balls = [];

  // Define some nice colors
  const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c", "#e67e22", "#2c3e50"];

  for (let i = 0; i < count; i++) {
    const randomX = centerX + Math.random() * 80 - 40;
    const randomY = centerY + Math.random() * 80 - 40;
    const randomColor = colors[i % colors.length];

    const ball = Bodies.circle(randomX, randomY, 15, {
      friction: 0,
      frictionAir: 0,
      restitution: 0.8,
      density: 0.0012,
      render: { fillStyle: randomColor },
    });

    balls.push(ball);
    Composite.add(world, ball);
  }
}

// Initialize with 1 ball
createBalls(1);

// Gravity & Rotation Speed (Dynamic from UI)
engine.gravity.y = 0.8;
let angularSpeed = 0.025;

Events.on(engine, "beforeUpdate", function () {
  Body.rotate(hexagonContainer, angularSpeed);
});

// --- UI Controls ---

// Pause/Resume Button
const pauseBtn = document.getElementById('pauseBtn');
pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  const icon = pauseBtn.querySelector('i');
  if (isPaused) {
    Runner.stop(runner);
    icon.className = 'fas fa-play';
  } else {
    Runner.run(runner, engine);
    icon.className = 'fas fa-pause';
  }
});

// Reset Functionality (Restart Animation)
function resetParameters() {
  engine.gravity.y = 0.8;
  angularSpeed = 0.025;
  document.getElementById('gravitySlider').value = 0.8;
  document.getElementById('bounceSlider').value = 0.8;
  document.getElementById('rotationSlider').value = 0.025;
  document.getElementById('ballCountInput').value = 1;

  createBalls(1);
}
document.getElementById('resetBtn').addEventListener('click', resetParameters);
document.getElementById('resetParametersButton').addEventListener('click', resetParameters);

// Slider Controls
document.getElementById('gravitySlider').addEventListener('input', (e) => {
  engine.gravity.y = parseFloat(e.target.value);
});

document.getElementById('rotationSlider').addEventListener('input', (e) => {
  angularSpeed = parseFloat(e.target.value);
});

// Ball Count Stepper Controls
const ballCountInput = document.getElementById('ballCountInput');
const decreaseBallCount = document.getElementById('decreaseBallCount');
const increaseBallCount = document.getElementById('increaseBallCount');
/** 
 * Safely updates the ball count within the [1, 10] range 
 * and calls createBalls() to rebuild them in the simulation.
 */
function updateBallCount(count) {
  count = Math.max(1, Math.min(10, count)); // Ensure count is between 1-10
  ballCountInput.value = count;
  createBalls(count);
}

// Increase Ball Count
increaseBallCount.addEventListener('click', () => {
  let count = parseInt(ballCountInput.value, 10) + 1;
  updateBallCount(count);
});

// Decrease Ball Count
decreaseBallCount.addEventListener('click', () => {
  let count = parseInt(ballCountInput.value, 10) - 1;
  updateBallCount(count);
});

// Manually Change Ball Count
ballCountInput.addEventListener('change', (e) => {
  const count = parseInt(e.target.value, 10);
  if (!isNaN(count)) {
    updateBallCount(count);
  }
});

// Handle Window Resize
window.addEventListener('resize', function () {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  
  Render.resize(render, newWidth, newHeight);
  render.bounds.max.x = newWidth;
  render.bounds.max.y = newHeight;
  
  Body.setPosition(hexagonContainer, { x: newWidth / 2, y: newHeight / 2 });
  balls.forEach(ball => {
    Body.setPosition(ball, { x: newWidth / 2, y: newHeight / 2 });
  });
});


// ================= Code Panel Implementation ================= //

class CodePanel {
  constructor() {
    this.codePanel = document.getElementById('codePanel');
    this.viewCodeBtn = document.getElementById('viewCodeBtn');
    this.closeCodePanel = document.getElementById('closeCodePanel');
    this.codeTabs = document.querySelectorAll('.code-tab');
    this.codeDisplay = document.getElementById('codeDisplay');
    this.copyCodeBtn = document.getElementById('copyCodeBtn');
    this.currentLang = 'html';
    this.codeSnippets = {}; // Will hold the loaded snippets
    this.loadSnippets();
    this.initializeEvents();

    this.initializeEvents();
  }

  async loadSnippets() {
    try {
      this.codeSnippets = await loadAllSnippets();
      // Optionally load default code
      this.loadCode(this.currentLang);
    } catch (error) {
      console.error('Error loading code snippets:', error);
    }
  }

  initializeEvents() {
    // View Code button
    this.viewCodeBtn.addEventListener('click', () => {
      this.codePanel.classList.add('open');
      this.loadCode(this.currentLang);
    });

    // Close button
    this.closeCodePanel.addEventListener('click', () => {
      this.codePanel.classList.remove('open');
    });

    // Tab switching
    this.codeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.codeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentLang = tab.dataset.lang;
        this.loadCode(this.currentLang);
      });
    });

    // Copy button
    this.copyCodeBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(this.codeSnippets[this.currentLang])
        .then(() => {
          this.copyCodeBtn.classList.add('copied');
          this.copyCodeBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
          setTimeout(() => {
            this.copyCodeBtn.classList.remove('copied');
            this.copyCodeBtn.innerHTML = '<i class="fas fa-copy"></i><span>Copy</span>';
          }, 1000);
        })
        .catch(err => console.error('Failed to copy code:', err));
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.codePanel.classList.contains('open')) {
        this.codePanel.classList.remove('open');
      }
    });
  }

  loadCode(lang) {
    this.codeDisplay.className = `language-${lang}`;
    this.codeDisplay.textContent = this.codeSnippets[lang];
    hljs.highlightElement(this.codeDisplay);
  }
}

async function loadSnippet(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  return await response.text();
}

async function loadAllSnippets() {
  return {
    html: await loadSnippet('./snippet/index.txt'),
    css: await loadSnippet('./snippet/style.txt'),
    js: await loadSnippet('./snippet/script.txt')
  };
}

// Initialize Code Panel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CodePanel();
});
