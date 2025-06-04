import { AsciiEffect } from './ascii_effect.js';

let camera, scene, renderer, effect, plane;
const IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/ai-lab-core.firebasestorage.app/o/AC.logo3.png?alt=media&token=bc0140ac-38ec-4344-a74f-a6b46175e09d';

function initBackground3D() {
    const container = document.getElementById('three-container');
    if (!container || typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    scene = new THREE.Scene();

    const texture = new THREE.TextureLoader().load(IMAGE_URL);
    plane = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshBasicMaterial({ map: texture }));
    scene.add(plane);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
    effect.setSize(window.innerWidth, window.innerHeight);
    effect.domElement.style.color = 'white';
    effect.domElement.style.backgroundColor = 'black';

    container.appendChild(effect.domElement);

    window.addEventListener('resize', onWindowResize);
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    if (plane) plane.rotation.z += 0.001;
    effect.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', initBackground3D);
