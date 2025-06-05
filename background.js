let container, camera, scene, renderer, plane, clock;

function initBackground3D() {
    container = document.getElementById('three-container');
    if (!container || typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    const geometry = new THREE.PlaneGeometry(40, 40, 128, 128);
    const material = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1, roughness: 0.25 });
    plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 10);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    window.addEventListener('resize', onWindowResize);
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    const pos = plane.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const wave = Math.sin((x + time) * 1.5) * 0.3 + Math.cos((y + time) * 1.5) * 0.3;
        pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
    plane.geometry.computeVertexNormals();
    renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', initBackground3D);
