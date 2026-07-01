
//escena
const scene = new THREE.Scene();

//camera
const fov = 75;
const aspectRatio = window.innerWidth / window.innerHeight;
const near= 0.1;
const far = 1000;

const camera = new THREE.PerspectiveCamera(
    fov,
    aspectRatio,
    near,
    far
)

camera.position.z = 2; 

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Cubo
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true 
})
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.lookAt(cube.position);

//Render
renderer.render(scene, camera);

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();