// js/player.js
const Player = {
    mesh: null,
    yaw: new THREE.Object3D(),
    pitch: new THREE.Object3D(),
    speed: 4.0,
    
    // Stats
    stamina: 100,
    awake: 100,
    beerCount: 6,
    ammoCount: 5,
    fishCount: 0,
    money: 10,
    
    isInsideVan: false,
    isWatchingTV: false,

    init() {
        // Hierarchical setup for camera rotation split
        this.yaw.position.set(0, 1.6, 15); // Start near camp
        this.pitch.add(Engine.camera);
        this.yaw.add(this.pitch);
        Engine.scene.add(this.yaw);
    },

    handleMouseLook(mx, my) {
        const sensitivity = 0.0025;
        this.yaw.rotation.y -= mx * sensitivity;
        this.pitch.rotation.x -= my * sensitivity;
        this.pitch.rotation.x = Math.max(-Math.PI/2.5, Math.min(Math.PI/2.5, this.pitch.rotation.x));
    },

    update(delta) {
        if (Main.state !== 'PLAYING') return;

        // Drain wakefulness (faster if watching distracting TV)
        const drainRate = this.isWatchingTV ? 4.5 : 1.5;
        this.awake -= drainRate * delta;
        if (this.awake <= 0) Main.gameOver("You fell asleep in the dark. Something found you.");

        // Regulate Movement
        if (!this.isInsideVan) {
            let moveX = 0;
            let moveZ = 0;

            if (Input.keys['KeyW']) moveZ -= 1;
            if (Input.keys['KeyS']) moveZ += 1;
            if (Input.keys['KeyA']) moveX -= 1;
            if (Input.keys['KeyD']) moveX += 1;

            if (moveX !== 0 || moveZ !== 0) {
                const forward = new THREE.Vector3(0, 0, moveZ).applyQuaternion(this.yaw.quaternion);
                const side = new THREE.Vector3(moveX, 0, 0).applyQuaternion(this.yaw.quaternion);
                const dir = new THREE.Vector3().addVectors(forward, side).normalize();
                
                this.yaw.position.addScaledVector(dir, this.speed * delta);
                
                // Bounds enforcement around campsite
                this.yaw.position.x = Math.max(-30, Math.min(30, this.yaw.position.x));
                this.yaw.position.z = Math.max(-30, Math.min(30, this.yaw.position.z));
            }
        }
        this.updateHUD();
    },

    updateHUD() {
        document.getElementById('awake-bar').style.width = `${Math.max(0, this.awake)}%`;
        document.getElementById('inventory-display').innerHTML = `
            <span>🍺 x${this.beerCount}</span> 
            <span>🎣 x${this.fishCount}</span> 
            <span>🏹 ${this.ammoCount}/5</span> 
            <span>💰 $${this.money}</span>
        `;
    }
};

