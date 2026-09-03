// js/shop.js
const Shop = {
    update() {
        if (Main.timeOfDay !== 'DAYTIME') return;

        // Compute distance from player to the storefront structure
        const dist = Player.yaw.position.distanceTo(Environment.shopMesh.position);
        const promptEl = document.getElementById('interaction-prompt');

        if (dist < 4) {
            promptEl.style.display = 'block';
            
            // Auto Trade Loops
            if (Player.fishCount > 0) {
                const payout = Player.fishCount * 5;
                Player.money += payout;
                Player.fishCount = 0;
                promptEl.innerText = `Sold fish! Made +$${payout}`;
            } else if (Player.money >= 4 && Player.ammoCount < 5) {
                Player.money -= 4;
                Player.ammoCount = 5;
                promptEl.innerText = "Bought Ammo Restock ($4)";
            } else {
                promptEl.innerText = "Shopkeeper: 'Fish out deep if you need cash.'";
            }
        }
    }
};
