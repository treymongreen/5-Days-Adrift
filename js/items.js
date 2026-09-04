// js/items.js
const Items = {
    timeout: null,

    usePrimaryItem() {
        if (Player.isWatchingTV) return;

        // If holding a beer and feeling fatigued, drink it
        if (Player.beerCount > 0 && Player.awake < 75) {
            Player.beerCount--;
            Player.awake = Math.min(100, Player.awake + 40);
            this.triggerActionPrompt("Chugged cold beer. Adrenaline pulsing.");
            this.cameraImpactShake(0.15);
            return;
        } else if (Player.beerCount > 0 && Player.awake >= 75) {
            this.triggerActionPrompt("Not tired enough to drink yet.");
            return;
        }

        // Cast line near deep lake edge context zones
        if (Main.timeOfDay === 'DAYTIME' && Player.yaw.position.z < -30) {
            this.triggerActionPrompt("Casting line... waiting...");
            setTimeout(() => {
                if (Math.random() > 0.45) {
                    Player.fishCount++;
                    this.triggerActionPrompt("🎣 CAUGHT A TROUT! Ready to sell.");
                } else {
                    this.triggerActionPrompt("Nibble... but it got away.");
                }
            }, 1200);
            return;
        }

        // Fire Weapon System
        if (Main.timeOfDay === 'NIGHTTIME') {
            if (Player.ammoCount > 0) {
                Player.ammoCount--;
                this.triggerActionPrompt("💥 BANG!");
                this.cameraImpactShake(0.4); // Intense physical screen recoil recoil
                AI.checkRifleHit();
            } else {
                this.triggerActionPrompt("⚠️ *CLICK* Out of ammo!");
            }
        }
    },

    cameraImpactShake(amount) {
        Engine.camera.position.x += (Math.random() - 0.5) * amount;
        Engine.camera.position.y += (Math.random() - 0.5) * amount;
        setTimeout(() => {
            Engine.camera.position.set(0,0,0);
        }, 80);
    },

    triggerActionPrompt(text) {
        const el = document.getElementById('interaction-prompt');
        if (!el) return;
        el.innerText = text;
        el.style.display = 'block';
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => { el.style.display = 'none'; }, 2200);
    }
};
