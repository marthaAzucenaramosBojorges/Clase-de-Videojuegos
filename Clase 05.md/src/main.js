// archivo bueno
import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// CONFIGURACIÓN DE LA ESCENA
const scene = new THREE.Scene();

const texturaFondo = new THREE.TextureLoader().load('/img/fondo dos.jpg');
scene.background = texturaFondo;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 2, 7);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LUCES
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// VARIABLES
let buenas = 0;
let malas = 0;

let vidas = 3;

let velocidadObstaculo = 0.15;

let jugando = false;

// memoria de la IA
let historialJugador = [];

const buenasTxt = document.getElementById('buenas-txt');
const malasTxt = document.getElementById('malas-txt');

const vidasTxt = document.getElementById('vidas-txt');
const pantallaInicio = document.getElementById('inicio');

// ANIMACIÓN DEL OBSTÁCULO
let mixerObstaculo = null;
const clock = new THREE.Clock();

// SUELO CON TEXTURA

const sueloGeo = new THREE.PlaneGeometry(10, 50);

const texturaSuelo = new THREE.TextureLoader().load('/img/camino je.jpg');

texturaSuelo.wrapS = THREE.RepeatWrapping;
texturaSuelo.wrapT = THREE.RepeatWrapping;

texturaSuelo.repeat.set(2, 10);

const sueloMat = new THREE.MeshStandardMaterial({
  map: texturaSuelo
});

const suelo = new THREE.Mesh(sueloGeo, sueloMat);

suelo.rotation.x = -Math.PI / 2;
suelo.position.z = -5;

scene.add(suelo);
// JUGADOR CON MODELO 3D
let jugador = null;

const loader = new GLTFLoader();

loader.load(
  '/models/sackboy-game.glb',
  (gltf) => {
    jugador = gltf.scene;

    jugador.scale.set(50,50,50);
    jugador.position.set(0, 0.6, 4);
    jugador.rotation.y = -Math.PI/2;

    scene.add(jugador);

    jugador.traverse((obj) => {
    console.log(obj.name, obj.type);
});

    console.log('Modelo del jugador cargado');
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
  },
  (error) => {
    console.error('Error al cargar el modelo:', error);
  }
);

// OBSTÁCULO CON MODELO 3D
let obstaculo = null;

loader.load(
  '/models/robot.glb',
  (gltf) => {

    obstaculo = gltf.scene;

    obstaculo.scale.set(2, 2, 2); // Ajusta este valor
    obstaculo.position.set(0, 0.5, -20);

    // Animación del robot
console.log("Animaciones del robot:", gltf.animations);

if (gltf.animations.length > 0) {

  mixerObstaculo = new THREE.AnimationMixer(obstaculo);

  const caminar = mixerObstaculo.clipAction(gltf.animations[0]);

  caminar.play();

  console.log("Animación del robot iniciada");

}

    scene.add(obstaculo);

    reiniciarObstaculo();

    console.log("Modelo del obstáculo cargado");
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

function reiniciarObstaculo() {

  if (!obstaculo) return;

  obstaculo.position.z = -20;
  obstaculo.position.x = (Math.random() - 0.5) * 6;
  obstaculo.position.y = 0.5;

}

// CONTROLES
const teclas = {
  Left: false,
  Right: false
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    teclas.Left = true;
  }

  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    teclas.Right = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    teclas.Left = false;
  }

  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    teclas.Right = false;
  }
});
//nuevo je 
window.addEventListener('keydown', (e)=>{

  if(e.code === "Space" && !jugando){

    jugando = true;

    pantallaInicio.style.display = "none";

  }

});

// ANIMACIÓN
function animate() {
  requestAnimationFrame(animate);
  //nuevo tmb
  if(jugando){

  velocidadObstaculo += 0.00002;

}
 //nuevo
 const delta = clock.getDelta();

if (mixerObstaculo) {
  mixerObstaculo.update(delta);
}

  if (jugador && jugando) {
    if (teclas.Left && jugador.position.x > -3) {
      jugador.position.x -= 0.1;
    }

    if (teclas.Right && jugador.position.x < 3) {
      jugador.position.x += 0.1;
    }

   if (obstaculo) {
  obstaculo.position.z += velocidadObstaculo;
}

    const distancia = jugador.position.distanceTo(obstaculo.position);

    if (distancia < 1.0) {
      malas++;
      vidas--;

vidasTxt.innerHTML = "❤️".repeat(vidas);


if(vidas <= 0){

  jugando = false;

  pantallaInicio.style.display = "block";

  pantallaInicio.innerHTML =
  "<h1>GAME OVER</h1><p>Presiona ESPACIO para reiniciar</p>";

  vidas = 3;

  buenas = 0;

  malas = 0;

}

      if (malasTxt) {
        malasTxt.innerText = malas;
      }

      reiniciarObstaculo();
    } 
    else if (obstaculo.position.z > jugador.position.z + 2) {
      buenas++;

      if (buenasTxt) {
        buenasTxt.innerText = buenas;
      }

      reiniciarObstaculo();
    }
  }

  renderer.render(scene, camera);
}

animate();

// AJUSTE DE PANTALLA
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});