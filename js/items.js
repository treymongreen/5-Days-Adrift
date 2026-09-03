// js/items.js
const Items = {
    activeItemIndex: 0, // 0: Rifle, 1: Fishing Rod, 2: Beer

    usePrimaryItem() {
        if (Player.isWatchingTV) return;

        // Action 1: Take a Sip of Beer
        if (Player.beerCount > 0 && Player.awake < 85) {
            Player.beerCount--;
            Player.awake = Math.min(100, Player.awake + 35);
            this.triggerActionPrompt("Chugged a beer. Heart is racing.");
            return;
        } else if (Player.beerCount === 0) {
            this.triggerActionPrompt("Out of beer!");
        }

        // Action 2: Go Fishing (Must be daytime near the perimeter boundary edge)
        if (Main.timeOfDay === 'DAYTIME' && Player.yaw.position.length() > 22) {
            if (Math.random() > 0.4) {
                Player.fishCount++;
                this.triggerActionPrompt("Caught a fish! Can sell this at shop.");
            } else {
                this.triggerActionPrompt("Nothing bit standard bait...");
            }
            return;
        }

        // Action 3: Fire Hunting Rifle
        if (Main.timeOfDay === 'NIGHTTIME' && Player.ammoCount > 0) {
            Player.ammoCount--;
            this.triggerActionPrompt("💥 BANG!");
            AI.checkRifleHit();
            return;
        }
    },

    triggerActionPrompt(text) {
        const el = document.getElementById('interaction-prompt');
        el.innerText = text;
        el.style.display = 'block';
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => { el.style.display = 'none'; }, 2000);
    }
};
