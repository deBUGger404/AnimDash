// Matter.js module aliases
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

class LetterRainSimulation {
    constructor() {
        this.engine = Engine.create();
        this.world = this.engine.world;
        this.isPaused = false;
        this.spawnInterval = null;
        
        this.setup();
        this.initializeControls();
    }

    setup() {
        // Create renderer
        this.render = Render.create({
            element: document.getElementById('canvas-container'),
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: "rgb(44, 62, 80)" // Match theme background
            }
        });

        // Create ground
        this.ground = Bodies.rectangle(
            window.innerWidth / 2,
            window.innerHeight + 30,
            window.innerWidth,
            60,
            {
                isStatic: true,
                render: { visible: false }
            }
        );

        World.add(this.world, this.ground);

        // Start the simulation
        Render.run(this.render);
        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);

        // Start spawning letters
        this.startSpawning();

        // Setup custom rendering
        this.setupCustomRendering();
    }

    startSpawning() {
        this.spawnInterval = setInterval(() => {
            if (!this.isPaused) {
                this.spawnLetter();
            }
        }, 300);
    }

    spawnLetter() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const x = Math.random() * window.innerWidth;
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const size = Math.random() * 25 + 20;

        const letterBody = Bodies.circle(x, -50, size / 2, {
            restitution: 0.2,
            friction: 0.05,
            density: 0.001,
            render: { visible: false }
        });

        letterBody.letter = letter;
        letterBody.color = this.getRandomColor();
        letterBody.size = size;
        letterBody.alpha = 1;

        World.add(this.world, letterBody);
    }

    getRandomColor() {
        const colors = [
            '#3498db', // blue
            '#2ecc71', // green
            '#e74c3c', // red
            '#f1c40f', // yellow
            '#9b59b6', // purple
            '#1abc9c', // turquoise
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    setupCustomRendering() {
        Events.on(this.render, 'afterRender', () => {
            const context = this.render.context;
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            this.world.bodies.forEach(body => {
                if (body.letter) {
                    if (body.position.y >= window.innerHeight - 40) {
                        body.alpha -= 0.005;
                        if (body.alpha <= 0) {
                            World.remove(this.world, body);
                        }
                    }

                    context.globalAlpha = body.alpha;
                    context.fillStyle = body.color;
                    context.font = `bold ${body.size}px Arial`;
                    context.fillText(body.letter, body.position.x, body.position.y);
                    context.globalAlpha = 1;
                }
            });
        });
    }

    initializeControls() {
        // Pause/Resume
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            const icon = pauseBtn.querySelector('i');
            icon.className = this.isPaused ? 'fas fa-play' : 'fas fa-pause';
            
            if (this.isPaused) {
                Runner.stop(this.runner);
            } else {
                Runner.start(this.runner, this.engine);
            }
        });

        // Reset simulation
        document.getElementById('resetBtn').addEventListener('click', () => {
            World.clear(this.world, false);
            World.add(this.world, this.ground);
        });

        //// Fullscreen toggle
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error('Error attempting to enable fullscreen:', err);
                });
                fullscreenBtn.querySelector('i').className = 'fas fa-compress';
            } else {
                document.exitFullscreen();
                fullscreenBtn.querySelector('i').className = 'fas fa-expand';
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.render.canvas.width = window.innerWidth;
            this.render.canvas.height = window.innerHeight;
            Body.setPosition(this.ground, {
                x: window.innerWidth / 2,
                y: window.innerHeight + 30
            });
        });
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
    html: await loadSnippet('snippet/letter-index.txt'),
    css: await loadSnippet('snippet/letter-style.txt'),
    js: await loadSnippet('snippet/letter-script.txt')
};
}
  
// Code Panel Implementation
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

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LetterRainSimulation();
    new CodePanel();
});