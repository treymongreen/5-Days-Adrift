// js/engine.js
const Engine = {
    scene: null,
    camera: null,
    renderer: null,
    clock: null,
    width: 320,  // Retro resolution
    height: 240,

    init() {
        this.scene = new THREE.Scene();
        // Pitch black, dense volumetric fog
        this.scene.fog = new THREE.FogExp2(0x020205, 0.18); 

        this.camera = new THREE.PerspectiveCamera(65, this.width / this.height, 0.1, 100);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: false, precision: "mediump" });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x020205);
        
        const container = document.getElementById('game-container');
        container.appendChild(this.renderer.domElement);
        
        this.clock = new THREE.Clock();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    },

    resizeCanvas() {
        const aspect = this.width / this.height;
        let w = window.innerWidth;
        let h = window.innerHeight;
        if (w / h > aspect) w = h * aspect; else h = w * aspect;
        this.renderer.domElement.style.width = `${w}px`;
        this.renderer.domElement.style.height = `${h}px`;
    },

    render() {
        // Subtle campfire flicker simulation
        if (Environment.campFireLight && Main.timeOfDay === 'NIGHTTIME') {
            Environment.campFireLight.intensity = 2.5 + Math.sin(this.clock.getElapsedTime() * 12) * 0.4;
        }
        this.renderer.render(this.scene, this.camera);
    }
};
