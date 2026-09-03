// js/environment.js
const Environment = {
    ambientLight: null,
    campFireLight: null,
    vanMesh: null,
    shopMesh: null,

    init() {
        // Flat, classic PS1 ambient lighting setup
        this.ambientLight = new THREE.AmbientLight(0x0a0a14, 0.4);
        Engine.scene.add(this.ambientLight);

        // Ground Floor
        const floorGeo = new THREE.PlaneGeometry(100, 100);
        const floorMat = new THREE.MeshBasicMaterial({ color: 0x112211, side: THREE.DoubleSide });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = Math.PI / 2;
        Engine.scene.add(floor);

        // Simple low-poly Van box structure
        const vanGeo = new THREE.BoxGeometry(4, 3, 7);
        const vanMat = new THREE.MeshBasicMaterial({ color: 0x444455 });
        this.vanMesh = new THREE.Mesh(vanGeo, vanMat);
        this.vanMesh.position.set(-5, 1.5, 5);
        Engine.scene.add(this.vanMesh);

        // Simple low-poly Shop structure
        const shopGeo = new THREE.BoxGeometry(6, 4, 6);
        const shopMat = new THREE.MeshBasicMaterial({ color: 0x553311 });
        this.shopMesh = new THREE.Mesh(shopGeo, shopMat);
        this.shopMesh.position.set(8, 2, -10);
        Engine.scene.add(this.shopMesh);

        // Campfire source
        const fireGeo = new THREE.ConeGeometry(0.5, 0.8, 4);
        const fireMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        const fire = new THREE.Mesh(fireGeo, fireMat);
        fire.position.set(0, 0.4, 0);
        Engine.scene.add(fire);

        this.campFireLight = new THREE.PointLight(0xff6600, 2, 12);
        this.campFireLight.position.set(0, 1, 0);
        Engine.scene.add(this.campFireLight);
    },

    setDaytime(isDay) {
        if (isDay) {
            this.ambientLight.color.setHex(0xaaaaaa);
            this.campFireLight.intensity = 0.5;
            Engine.scene.fog.color.setHex(0x778899);
            Engine.scene.fog.density = 0.02;
        } else {
            this.ambientLight.color.setHex(0x020205);
            this.campFireLight.intensity = 3;
            Engine.scene.fog.color.setHex(0x020205);
            Engine.scene.fog.density = 0.18; // Pitch black forest
        }
    }
};
