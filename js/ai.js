// js/ai.js
const AI = {
    monsterMesh: null,
    active: false,
    distanceToTarget: 40,
    speed: 2.8,

    init() {
        // Simple pixelated creepy block entity
        const geo = new THREE.BoxGeometry(1.5, 3.5, 1.5);
        const mat = new THREE.MeshBasicMaterial({ color: 0x330000 });
        this.monsterMesh = new THREE.Mesh(geo, mat);
        this.monsterMesh.position.set(0, -10, 0); // Hide below initially
        Engine.scene.add(this.monsterMesh);
    },

    spawn() {
        this.active = true;
        this.distanceToTarget = 35;
        // Move to edge perimeter of the camping site
        const angle = Math.random() * Math.PI * 2;
        this.monsterMesh.position.set(Math.cos(angle)*35, 1.75, Math.sin(angle)*35);
    },

    update(delta) {
        if (!this.active || Main.timeOfDay !== 'NIGHTTIME') return;

        // Target either the van or the vulnerable exposed player
        const targetPos = Player.isInsideVan ? Environment.vanMesh.position : Player.yaw.position;
        this.monsterMesh.lookAt(targetPos);
        
        // Creep forward closer towards destination targets
        this.monsterMesh.translateZ(this.speed * delta);
        
        const dist = this.monsterMesh.position.distanceTo(targetPos);
        if (dist < 2.5) {
            Main.gameOver("Something pulled you out into the dark forest.");
        }
    },

    checkRifleHit() {
        if (!this.active) return;
        // Simplistic direct check: if player looks generally near monster vector during close quarters
        const playerDir = new THREE.Vector3();
        Engine.camera.getWorldDirection(playerDir);
        
        const toMonster = new THREE.Vector3().subVectors(this.monsterMesh.position, Player.yaw.position).normalize();
        const dot = playerDir.dot(toMonster);

        if (dot > 0.92) { // Direct line of sight target lock hit
            Items.triggerActionPrompt("🎯 A hit! The creature screeches and flees.");
            this.despawn();
        }
    },

    despawn() {
        this.active = false;
        this.monsterMesh.position.set(0, -10, 0);
    }
};
