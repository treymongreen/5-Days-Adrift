// js/ai.js
const AI = {
    monsterMesh: null,
    active: false,
    distanceToTarget: 40,
    speed: 3.0,
    currentMonsterType: 'CREEPER',

    init: function() {
        const tl = new THREE.TextureLoader();
        const monsterTex = tl.load('textures/monster.png');
        monsterTex.magFilter = THREE.NearestFilter;
        monsterTex.minFilter = THREE.NearestFilter;

        const geo = new THREE.BoxGeometry(1.2, 3.8, 1.2);
        const mat = new THREE.MeshBasicMaterial({ map: monsterTex });
        this.monsterMesh = new THREE.Mesh(geo, mat);
        this.monsterMesh.position.set(0, -20, 0); 
        Engine.scene.add(this.monsterMesh);
    },

    spawn: function() {
        this.active = true;
        
        // Pick a random number to choose the monster type safely
        const rand = Math.random();
        if (rand < 0.33) {
            this.currentMonsterType = 'CREEPER';
            this.speed = 3.2;
            if (this.monsterMesh && this.monsterMesh.material) {
                this.monsterMesh.material.color.setHex(0x220505);
            }
        } else if (rand < 0.66) {
            this.currentMonsterType = 'STALKER';
            this.speed = 2.0;
            if (this.monsterMesh && this.monsterMesh.material) {
                this.monsterMesh.material.color.setHex(0x0a0a0a);
            }
        } else {
            this.currentMonsterType = 'CHARGER';
            this.speed = 5.2;
            if (this.monsterMesh && this.monsterMesh.material) {
                this.monsterMesh.material.color.setHex(0x550000);
            }
        }

        const angle = Math.random() * Math.PI * 2;
        this.monsterMesh.position.set(Math.cos(angle) * 35, 1.9, Math.sin(angle) * 35);
        Items.triggerActionPrompt("You hear an unnatural howl ring out from the forest trees...");
    },

    update: function(delta) {
        if (!this.active || Main.timeOfDay !== 'NIGHTTIME') return;

        const targetPos = Player.yaw.position;
        this.monsterMesh.lookAt(targetPos.x, this.monsterMesh.position.y, targetPos.z);
        
        this.monsterMesh.translateZ(this.speed * delta);
        
        const dist = this.monsterMesh.position.distanceTo(targetPos);

        if (dist < 12 && Math.random() < 0.01) {
            Items.triggerActionPrompt("👣 Heavy, rhythmic scraping footsteps are coming closer...");
        }

        if (dist < 2.5) {
            if (Player.isInsideVan && !Player.isWatchingTV) {
                Items.triggerActionPrompt("THE MONSTER IS AT THE GLASS! SHOOT IT!");
            } else {
                Main.gameOver(Player.isWatchingTV ? 
                    "You were entirely distracted by the television static. It shattered the van glass." : 
                    "It caught you out in the open brushwood. There was nowhere left to run.");
            }
        }
    },

    checkRifleHit: function() {
        if (!this.active) return;
        
        const playerDir = new THREE.Vector3();
        Engine.camera.getWorldDirection(playerDir);
        const toMonster = new THREE.Vector3().subVectors(this.monsterMesh.position, Player.yaw.position).normalize();
        const dot = playerDir.dot(toMonster);

        if (dot > 0.88) {
            Items.triggerActionPrompt("🎯 CRACK! Your bullet struck flesh! It runs back into the woods.");
            this.despawn();
        } else {
            Items.triggerActionPrompt("💥 Fired into the dark forest, but missed the silhouette.");
        }
    },

    despawn: function() {
        this.active = false;
        this.monsterMesh.position.set(0, -20, 0);
    }
};
