//escena, camara y renderer
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(3, 3, 5);

const renderer = new THREE.WebGLRenderer ({ antialias: true});
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
