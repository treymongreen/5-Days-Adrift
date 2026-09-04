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

        // INSTANTIATE TEXTURE LOADER
        const tl = new THREE.TextureLoader();

        // 1. Load and configure grass ground texture
        const grassTex = tl.load('textures/grass.png');
        grassTex.wrapS = THREE.RepeatWrapping;
        grassTex.wrapT = THREE.RepeatWrapping;
        grassTex.repeat.set(40, 40); // Repeat across the vast landscape
        grassTex.magFilter = THREE.NearestFilter; // CRITICAL: Gives the jagged PS1 pixel look
        grassTex.minFilter = THREE.NearestFilter;

        const floorGeo = new THREE.PlaneGeometry(80, 80);
        const floorMat = new THREE.MeshBasicMaterial({ map: grassTex });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        Engine.scene.add(floor);

        // 2. Load and configure lake pond water texture
        const waterTex = tl.load('textures/water.png');
        waterTex.wrapS = THREE.RepeatWrapping;
        waterTex.wrapT = THREE.RepeatWrapping;
        waterTex.repeat.set(10, 3);
        waterTex.magFilter = THREE.NearestFilter;
        waterTex.minFilter = THREE.NearestFilter;

        const lakeGeo = new THREE.PlaneGeometry(80, 20);
        const lakeMat = new THREE.MeshBasicMaterial({ map: waterTex });
        const lake = new THREE.Mesh(lakeGeo, lakeMat);
        lake.rotation.x = -Math.PI / 2;
        lake.position.set(0, 0.01, -35); 
        Engine.scene.add(lake);

        // Flashlight Rigging
        this.flashlight = new THREE.SpotLight(0xffffff, 0, 25, Math.PI / 5, 0.5, 1);
        Engine.scene.add(this.flashlight);

        // 3. Load and configure rusted metal texture for the Van
        const vanTex = tl.load('textures/van.png');
        vanTex.magFilter = THREE.NearestFilter;
        vanTex.minFilter = THREE.NearestFilter;

        const vanGroup = new THREE.Group();
        const vanBodyGeo = new THREE.BoxGeometry(4, 3, 7);
        const vanBodyMat = new THREE.MeshBasicMaterial({ map: vanTex });
        const vanBody = new THREE.Mesh(vanBodyGeo, vanBodyMat);
        vanGroup.add(vanBody);

        // Dashboard television interface screen inside van frame
        const tvGeo = new THREE.PlaneGeometry(1.2, 0.9);
        this.tvMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const tv = new THREE.Mesh(tvGeo, this.tvMat);
        tv.position.set(0, 0.2, -3.49);
        tv.rotation.y = Math.PI;
        vanGroup.add(tv);

        vanGroup.position.set(-6, 1.5, 8);
        this.vanMesh = vanGroup;
        Engine.scene.add(this.vanMesh);

        // 4. Load and configure cabin log wood texture
        const woodTex = tl.load('textures/wood.png');
        woodTex.wrapS = THREE.RepeatWrapping;
        woodTex.wrapT = THREE.RepeatWrapping;
        woodTex.repeat.set(2, 2);
        woodTex.magFilter = THREE.NearestFilter;
        woodTex.minFilter = THREE.NearestFilter;

        const shopGroup = new THREE.Group();
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 6), new THREE.MeshBasicMaterial({ map: woodTex }));
        const roof = new THREE.Mesh(new THREE.ConeGeometry(5, 2, 4), new THREE.MeshBasicMaterial({ map: woodTex }));
        roof.position.y = 3;
        roof.rotation.y = Math.PI / 4;
        shopGroup.add(cabin, roof);
        shopGroup.position.set(10, 2, -8);
        this.shopMesh = shopGroup;
        Engine.scene.add(this.shopMesh);

        // Generate dynamically textured low-poly wood trees
        for (let i = 0; i < 45; i++) {
            const tree = this.createTree(woodTex);
            tree.position.set((Math.random() - 0.5) * 70, 0, (Math.random() - 0.5) * 70);
            if (tree.position.length() > 10 && tree.position.distanceTo(this.vanMesh.position) > 6) {
                Engine.scene.add(tree);
                this.trees.push(tree);
            }
        }

        // Active Campfire point source configuration
        this.campFireLight = new THREE.PointLight(0xff5500, 2, 15);
        this.campFireLight.position.set(0, 0.5, 0);
        Engine.scene.add(this.campFireLight);
    },

    createTree(woodTex) {
        const group = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 3, 4), new THREE.MeshBasicMaterial({ map: woodTex }));
        trunk.position.y = 1.5;
        // Leaves use flat ambient green tones to match grounds
        const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.5, 4, 4), new THREE.MeshBasicMaterial({ color: 0x0c120d }));
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
            this.flashlight.intensity = 4.0; 
            Engine.scene.fog.color.setHex(0x010103);
            Engine.scene.fog.density = 0.22;
        }
    }
};
