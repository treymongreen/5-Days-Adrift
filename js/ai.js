// js/ai.js
const AI = {
    monsterMesh: null,
    active: false,
    distanceToTarget: 40,
    speed: 3.0,
    currentMonsterType: 'CREEPER', // CREEPER, STALKER, CHARGER

    init() {
        const geo = new THREE.BoxGeometry(1.2, 3.8, 1.2);
        const mat = new THREE.MeshBasicMaterial({ color: 0x1f0505 });
        this.monsterMesh = new THREE.Mesh(geo, mat);
        this.monsterMesh.position.set(0, -20, 0); 
        Engine.scene.add(this.monsterMesh);
    },

    spawn() {
        this.active = true;
        
        // Randomize Monster Archetypes per night
        const types = ['CREEPER', 'STALKER', 'CHARGER'];
        this.currentMonsterType = types[Math.floor(Math.random() * types.length)];
        
        if (this.currentMonsterType === 'CHARGER') {
            this.speed = 5.2; // Blazing fast rush down entity
            this.monsterMesh.material.color.setHex(0x550000); 
        } else if (this.currentMonsterType === 'STALKER') {
            this.speed = 2.0; // Slow, silent creeping entity
            this.monsterMesh.material.color.setHex(0x0a0a0a); 
        } else {
            this.speed = 3.2;
            this.monsterMesh.material.color.setHex(0x220505);
        }

        const angle = Math.random() * Math.PI * 2;
        this.monsterMesh.position.set(Math.cos(angle) * 35, 1.9, Math.sin(angle) * 35);
        Items.triggerActionPrompt("You hear an unnatural howl ring out from the forest trees...");
    },

    update(delta) {
        if (!this.active || Main.timeOfDay !== 'NIGHTTIME') return;

        const targetPos = Player.yaw.position;
        this.monsterMesh.lookAt(targetPos.x, this.monsterMesh.position.y, targetPos.z);
        
        // Move towards player
        this.monsterMesh.translateZ(this.speed * delta);
        
        const dist = this.monsterMesh.position.distanceTo(targetPos);

        // Audio cues represented via retro action warnings based on proximity
        if (dist < 12 && Math.random() < 0.01) {
            Items.triggerActionPrompt("👣 Heavy, rhythmic scraping footsteps are coming closer...");
        }

        if (dist < 2.5) {
            if (Player.isInsideVan && !Player.isWatchingTV) {
                // If you are actively looking out the windows, you can spot and shoot it safely!
                Items.triggerActionPrompt("THE MONSTER IS AT THE GLASS! SHOOT IT!");
            } else {
                Main.gameOver(Player.isWatchingTV ? 
                    "You were entirely distracted by the television static. It shattered the van glass." : 
                    "It caught you out in the open brushwood. There was nowhere left to run.");
            }
        }
    },

    checkRifleHit() {
        if (!this.active) return;
        
        const playerDir = new THREE.Vector3();
        Engine.camera.getWorldDirection(playerDir);
        const toMonster = new THREE.Vector3().subVectors(this.monsterMesh.position, Player.yaw.position).normalize();
        const dot = playerDir.dot(toMonster);

        // If aiming accurately down-sight at target vector
        if (dot > 0.88) {
            Items.triggerActionPrompt("🎯 CRACK! Your bullet struck flesh! It runs back into the woods.");
            this.despawn();
        } else {
            Items.triggerActionPrompt("💥 Fired into the dark forest, but missed the silhouette.");
        }
    },

    despawn() {
        this.active = false;
        this.monsterMesh.position.set(0, -20, 0);
    }
};
