// js/input.js
const Input = {
    keys: {},
    mouse: { x: 0, y: 0 },
    isLocked: false,

    init() {
        // Keyboard tracking
        window.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
        window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });

        const canvas = document.querySelector('#game-container canvas');

        // FIX: Listen to the whole window for clicks. If playing, lock the cursor.
        window.addEventListener('click', () => {
            if (!this.isLocked && Main.state === 'PLAYING' && canvas) {
                canvas.requestPointerLock();
            }
        });

        document.addEventListener('pointerlockchange', () => {
            this.isLocked = (document.pointerLockElement === canvas);
        });

        // Mouse sensitivity movement
        document.addEventListener('mousemove', (e) => {
            if (this.isLocked) {
                Player.handleMouseLook(e.movementX, e.movementY);
            }
        });

        // Gameplay Actions
        window.addEventListener('mousedown', (e) => {
            if (!this.isLocked) return;
            if (e.button === 0) { // Left Click
                Items.usePrimaryItem();
            }
        });
    }
};
