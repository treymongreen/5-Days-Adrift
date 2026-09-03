// js/engine.js
const Engine = {
    scene: null,
    camera: null,
    renderer: null,
    clock: null,
    width: 320,  // Native PS1 resolution width
    height: 240, // Native PS1 resolution height

    init() {
        // Setup 3D Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x050508, 0.15); // Dark, claustrophobic fog

        // Setup Camera (Lower FOV for retro crunchiness)
        this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 1000);
        
        // Setup WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: false, precision: "mediump" });
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = false; // PS1 had no real shadow mapping
        
        // Attach downscaled canvas to UI container
        const container = document.getElementById('game-container');
        container.appendChild(this.renderer.domElement);
        
        this.clock = new THREE.Clock();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    },

    resizeCanvas() {
        // Force the canvas back to the low-res 4:3 canvas bounding ratios
        const aspect = this.width / this.height;
        let w = window.innerWidth;
        let h = window.innerHeight;
        
        if (w / h > aspect) {
            w = h * aspect;
        } else {
            h = w / aspect;
        }
        
        this.renderer.domElement.style.width = `${w}px`;
        this.renderer.domElement.style.height = `${h}px`;
    },

    render() {
        this.renderer.render(this.scene, this.camera);
    }
};
