// js/main.js
const Main = {
    state: 'MENU', // MENU, PLAYING, GAMEOVER
    day: 1,
    timeOfDay: 'DAYTIME', // DAYTIME vs NIGHTTIME
    cycleTimer: 0,
    cycleDuration: 60, // 60 seconds per cycle phase

    init() {
        Engine.init();
        Player.init();
        Environment.init();
        AI.init();
        Input.init();

        // UI Button Handlers
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => location.reload());

        // Kickoff game engine tick loop
        this.tick();
    },

    startGame() {
        this.state = 'PLAYING';
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('hud').classList.remove('hidden');
        Environment.setDaytime(true);

        // FIX: Force the browser to lock the pointer immediately upon clicking the button
        const canvas = document.querySelector('#game-container canvas');
        if (canvas) {
            canvas.requestPointerLock();
        }
    },

    tick() {
        requestAnimationFrame(() => this.tick());
        
        const delta = Engine.clock.getDelta();
        
        if (this.state === 'PLAYING') {
            Player.update(delta);
            AI.update(delta);
            Shop.update();
            this.updateTimeCycle(delta);
        }
        
        Engine.render();
    },

    updateTimeCycle(delta) {
        this.cycleTimer += delta;
        
        // UI Clock HUD calculations
        const pct = this.cycleTimer / this.cycleDuration;
        if (this.timeOfDay === 'DAYTIME') {
            document.getElementById('clock').innerText = `${Math.floor(8 + pct * 8)}:00 PM`;
        } else {
            document.getElementById('clock').innerText = `${Math.floor(12 + pct * 6)}:00 AM`;
        }

        if (this.cycleTimer >= this.cycleDuration) {
            this.cycleTimer = 0;
            if (this.timeOfDay === 'DAYTIME') {
                this.timeOfDay = 'NIGHTTIME';
                Environment.setDaytime(false);
                document.getElementById('day-counter').innerText = `DAY ${this.day} - NIGHTTIME`;
                AI.spawn();
            } else {
                this.day++;
                if (this.day > 5) {
                    this.victory();
                    return;
                }
                this.timeOfDay = 'DAYTIME';
                Environment.setDaytime(true);
                document.getElementById('day-counter').innerText = `DAY ${this.day} - DAYTIME`;
                AI.despawn();
            }
        }
    },

    gameOver(reason) {
        this.state = 'GAMEOVER';
        document.exitPointerLock();
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('game-over-title').innerText = "YOU DIED";
        document.getElementById('game-over-reason').innerText = reason;
    },

    victory() {
        this.state = 'GAMEOVER';
        document.exitPointerLock();
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('game-over-title').innerText = "YOU SURVIVED";
        document.getElementById('game-over-reason').innerText = "The morning of Day 6 arrives. Your van starts up. You leave this cursed forest behind.";
    }
};

// Window initialization engine bootstrap execution hook
window.addEventListener('DOMContentLoaded', () => Main.init());
