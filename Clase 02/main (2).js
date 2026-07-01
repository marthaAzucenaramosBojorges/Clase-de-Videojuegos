import './style.css'; // <--- ¡Añade esta línea para que limpie la pantalla!
import * as THREE from 'three';

// 1. ESCENA
const scene = new THREE.Scene();

// 2. CÁMARA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// 3. RENDERIZADOR
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. CUBO
//const geometry = new THREE.BoxGeometry(1, 1, 1);
//const material = new THREE.MeshBasicMaterial({ color: 0xb65c6b });
//const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);
const geometry = new THREE.IcosahedronGeometry();
const material = new THREE.MeshBasicMaterial( { color:0xb65c6b } );
const icosahedron = new THREE.Mesh( geometry, material );
scene.add( icosahedron );


// Diccionario para registrar qué teclas están presionadas
const keys = {

w: false,
a: false,
s: false,
d: false,
shift: false

};

// 5. BUCLE DE ANIMACIÓN (Game Loop)



function animate() {
requestAnimationFrame(animate);
console.log(icosahedron.position.x);

// 1. CALCULAR VELOCIDAD (Si presiona Shift, corre al doble de velocidad)
let currentSpeed = 0.05;
if (keys.shift) {
currentSpeed = 0.12; // Velocidad de Sprint
}

// --- MECÁNICA DE MOVIMIENTO ---

if (keys.w) icosahedron.position.y += currentSpeed; // Arriba
if (keys.s) icosahedron.position.y -= currentSpeed; // Abajo
if (keys.a) icosahedron.position.x -= currentSpeed; // Izquierda
if (keys.d) icosahedron.position.x += currentSpeed; // Derecha

// --- LIMITAR LA POSICIÓN (Lógica de colisión con el borde) ---
// Límite Derecha (X positivo)
if (icosahedron.position.x > 5) {
icosahedron.position.x = 5;
}
// Límite Izquierda (X negativo)
else if (icosahedron.position.x < -5) {
icosahedron.position.x = -5;
}

// Límite Arriba (Y positivo)
if (icosahedron.position.y > 3) {
icosahedron.position.y = 3;
}
// Límite Abajo (Y negativo)
else if (icosahedron.position.y < -3) {
icosahedron.position.y = -3;
}

// Mantener una leve rotación para que se siga viendo en 3D
icosahedron.rotation.x += 0.005;
icosahedron.rotation.y += 0.005;


renderer.render(scene, camera);
}

animate();

// 6. AJUSTE DE PANTALLA (Hacer el juego responsivo)
window.addEventListener('resize', () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});

// Detectar cuando se presiona la tecla
window.addEventListener('keydown', (event) => {
let key = event.key.toLowerCase();

// Si presionaron cualquier Shift, lo normalizamos a 'shift'
if (key === 'shift') key = 'shift';

if (key in keys) {
keys[key] = true;
}
});

window.addEventListener('keyup', (event) => {
let key = event.key.toLowerCase();

if (key === 'shift') key = 'shift';

if (key in keys) {
keys[key] = false;
}
});