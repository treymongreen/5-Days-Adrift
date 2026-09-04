// js/environment.js
const Environment = {
    ambientLight: null,
    campFireLight: null,
    flashlight: null,
    vanMesh: null,
    shopMesh: null,
    trees: [],

    init() {
        this.ambientLight = new THREE.AmbientLight(0x050510, 0.3);
        Engine.scene.add(this.ambientLight);

        // Ground/Grass Layer
        const floorGeo = new THREE.PlaneGeometry(80, 80);
        const floorMat = new THREE.MeshBasicMaterial({ color: 0x141a12 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        Engine.scene.add(floor);

        // Lake Perimeter (Deep Blue Plane at the back boundary)
        const lakeGeo = new THREE.PlaneGeometry(80, 20);
        const lakeMat = new THREE.MeshBasicMaterial({ color: 0x0a1520 });
        const lake = new THREE.Mesh(lakeGeo, lakeMat);
        lake.rotation.x = -Math.PI / 2;
        lake.position.set(0, 0.01, -35); // Placed deep north
        Engine.scene.add(lake);

        // Flashlight (Attached to player view later)
        this.flashlight = new THREE.SpotLight(0xffffff, 0, 25, Math.PI / 5, 0.5, 1);
        Engine.scene.add(this.flashlight);

        // The Survival Van (Detailed Box with interior space)
        const vanGroup = new THREE.Group();
        const vanBodyGeo = new THREE.BoxGeometry(4, 3, 7);
        const vanBodyMat = new THREE.MeshBasicMaterial({ color: 0x3a424a });
        const vanBody = new THREE.Mesh(vanBodyGeo, vanBodyMat);
        vanGroup.add(vanBody);

        // Glowing TV screen block inside the back window
        const tvGeo = new THREE.PlaneGeometry(1.2, 0.9);
        this.tvMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const tv = new THREE.Mesh(tvGeo, this.tvMat);
        tv.position.set(0, 0.2, -3.49);
        tv.rotation.y = Math.PI;
        vanGroup.add(tv);

        vanGroup.position.set(-6, 1.5, 8);
        this.vanMesh = vanGroup;
        Engine.scene.add(this.vanMesh);

        // Low-Poly Trading Cabin Shop
        const shopGroup = new THREE.Group();
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 6), new THREE.MeshBasicMaterial({ color: 0x422a1d }));
        const roof = new THREE.Mesh(new THREE.ConeGeometry(5, 2, 4), new THREE.MeshBasicMaterial({ color: 0x22150e }));
        roof.position.y = 3;
        roof.rotation.y = Math.PI / 4;
        shopGroup.add(cabin, roof);
        shopGroup.position.set(10, 2, -8);
        this.shopMesh = shopGroup;
        Engine.scene.add(this.shopMesh);

        // Generate Low-Poly Forest Trees dynamically
        for (let i = 0; i < 45; i++) {
            const tree = this.createTree();
            tree.position.set((Math.random() - 0.5) * 70, 0, (Math.random() - 0.5) * 70);
            // Don't spawn directly on top of the campsite center
            if (tree.position.length() > 10 && tree.position.distanceTo(this.vanMesh.position) > 6) {
                Engine.scene.add(tree);
                this.trees.push(tree);
            }
        }

        // Active Campfire
        this.campFireLight = new THREE.PointLight(0xff5500, 2, 15);
        this.campFireLight.position.set(0, 0.5, 0);
        Engine.scene.add(this.campFireLight);
    },

    createTree() {
        const group = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 3, 4), new THREE.MeshBasicMaterial({ color: 0x2d1e18 }));
        trunk.position.y = 1.5;
        const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.5, 4, 4), new THREE.MeshBasicMaterial({ color: 0x0f1710 }));
        leaves.position.y = 4;
        group.add(trunk, leaves);
        return group;
    },

    setDaytime(isDay) {
        if (isDay) {
            this.ambientLight.color.setHex(0x778899);
            this.ambientLight.intensity = 0.6;
            this.flashlight.intensity = 0;
            Engine.scene.fog.color.setHex(0x4a5768);
            Engine.scene.fog.density = 0.02;
        } else {
            this.ambientLight.color.setHex(0x020206);
            this.ambientLight.intensity = 0.1;
            this.flashlight.intensity = 4.0; // Click! Flashlight turns on at night
            Engine.scene.fog.color.setHex(0x010103);
            Engine.scene.fog.density = 0.22;
        }
    }
};
