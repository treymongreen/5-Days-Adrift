// js/player.js
const Player = {
    yaw: new THREE.Object3D(),
    pitch: new THREE.Object3D(),
    speed: 4.5,
    bobTimer: 0,
    
    // Detailed stats
    stamina: 100,
    awake: 100,
    beerCount: 6,
    ammoCount: 5,
    fishCount: 0,
    money: 12,
    
    isInsideVan: false,
    isWatchingTV: false,

    init() {
        this.yaw.position.set(0, 1.6, 12);
        this.pitch.add(Engine.camera);
        this.yaw.add(this.pitch);
        Engine.scene.add(this.yaw);
    },

    handleMouseLook(mx, my) {
        const sensitivity = 0.0022;
        this.yaw.rotation.y -= mx * sensitivity;
        this.pitch.rotation.x -= my * sensitivity;
        this.pitch.rotation.x = Math.max(-1.2, Math.min(1.2, this.pitch.rotation.x));
    },

    update(delta) {
        if (Main.state !== 'PLAYING') return;

        // Dynamic Wakefulness Draining State
        if (this.isWatchingTV) {
            this.awake -= 5.5 * delta; // TV drains focus fast
            // Flash screen static color
            Environment.tvMat.color.setHex(Math.random() > 0.5 ? 0xaaaaaa : 0x444444);
        } else {
            this.awake -= 1.6 * delta; // Constant exhaustion drop
            if (Player.isInsideVan) Environment.tvMat.color.setHex(0x111115);
        }

        if (this.awake <= 0) Main.gameOver("You fell unconscious from fatigue. You didn't wake up.");

        // Static Vector Calculations for Flashlight Orientation
        if (Environment.flashlight) {
            Environment.flashlight.position.copy(this.yaw.position);
            const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(Engine.camera.getWorldQuaternion(new THREE.Quaternion()));
            Environment.flashlight.target.position.copy(this.yaw.position).add(dir);
        }

        // Logic Check: Locked Inside Van States
        if (this.isInsideVan) {
            this.handleVanInteractionLogic();
        } else {
            this.handleNormalMovement(delta);
        }

        this.checkActionPrompts();
        this.updateHUD();
    },

    handleNormalMovement(delta) {
        let moveX = 0; let moveZ = 0;
        if (Input.keys['KeyW']) moveZ -= 1;
        if (Input.keys['KeyS']) moveZ += 1;
        if (Input.keys['KeyA']) moveX -= 1;
        if (Input.keys['KeyD']) moveX += 1;

        if (moveX !== 0 || moveZ !== 0) {
            const forward = new THREE.Vector3(0, 0, moveZ).applyQuaternion(this.yaw.quaternion);
            const side = new THREE.Vector3(moveX, 0, 0).applyQuaternion(this.yaw.quaternion);
            const dir = new THREE.Vector3().addVectors(forward, side).normalize();
            
            this.yaw.position.addScaledVector(dir, this.speed * delta);
            
            // Retro Camera Bobbing
            this.bobTimer += delta * 14;
            Engine.camera.position.y = Math.sin(this.bobTimer) * 0.05;

            // Boundaries
            this.yaw.position.x = Math.max(-36, Math.min(36, this.yaw.position.x));
            this.yaw.position.z = Math.max(-36, Math.min(36, this.yaw.position.z));
        } else {
            Engine.camera.position.y = 0;
        }
    },

    handleVanInteractionLogic() {
        // Constrain player positioning rigidly inside the driver cockpit frame
        this.yaw.position.copy(Environment.vanMesh.position);
        if (this.isWatchingTV) {
            // Force face down directly into the flickering dashboard television
            this.pitch.rotation.x = -0.5;
            this.yaw.rotation.y = Environment.vanMesh.rotation.y + Math.PI;
        }
    },

    checkActionPrompts() {
        const prompt = document.getElementById('interaction-prompt');
        
        // 1. Check Van Proximity
        const distToVan = this.yaw.position.distanceTo(Environment.vanMesh.position);
        if (!this.isInsideVan && distToVan < 4) {
            prompt.style.display = 'block';
            prompt.innerText = "Press [E] to hunker down inside the Van";
            if (Input.keys['KeyE']) {
                Input.keys['KeyE'] = false;
                this.isInsideVan = true;
                Items.triggerActionPrompt("Locked inside. Safe... for now.");
            }
            return;
        }

        // 2. Check Actions inside the Van Cockpit Window frame
        if (this.isInsideVan) {
            prompt.style.display = 'block';
            if (this.isWatchingTV) {
                prompt.innerText = "Watching static TV... Press [Q] to LOOK AT WINDOWS";
                if (Input.keys['KeyQ']) { this.isWatchingTV = false; Input.keys['KeyQ'] = false; }
            } else {
                prompt.innerText = "Scanning Windows. Press [E] to LEAVE VAN | Press [T] to WATCH TV";
                if (Input.keys['KeyE'] && Main.timeOfDay === 'DAYTIME') {
                    this.isInsideVan = false; Input.keys['KeyE'] = false;
                } else if (Input.keys['KeyE'] && Main.timeOfDay === 'NIGHTTIME') {
                    Items.triggerActionPrompt("Too dangerous to leave at night!");
                    Input.keys['KeyE'] = false;
                }
                if (Input.keys['KeyT']) { this.isWatchingTV = true; Input.keys['KeyT'] = false; }
            }
            return;
        }

        // 3. Check Lake Boundary for Fishing
        if (Main.timeOfDay === 'DAYTIME' && this.yaw.position.z < -30) {
            prompt.style.display = 'block';
            prompt.innerText = "Left Click to cast fishing line into the lake";
            return;
        }

        prompt.style.display = 'none';
    },

    updateHUD() {
        document.getElementById('awake-bar').style.width = `${Math.max(0, this.awake)}%`;
        document.getElementById('stamina-bar').style.width = `${this.isInsideVan ? (this.isWatchingTV ? '20' : '50') : '100'}%`;
        document.getElementById('stamina-bar').style.backgroundColor = this.isWatchingTV ? "#ff0000" : "#ffffff";
        
        document.getElementById('inventory-display').innerHTML = `
            <span>🍺 x${this.beerCount}</span> 
            <span>🎣 x${this.fishCount}</span> 
            <span>🏹 ${this.ammoCount}/5</span> 
            <span>💰 $${this.money}</span>
        `;
    }
};
