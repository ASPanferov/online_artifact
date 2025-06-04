// 3D background using three.js
function initBackground3D() {
    if (typeof THREE === 'undefined') {
        console.error('three.js not loaded');
        return;
    }
    const container = document.getElementById('three-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 70;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const objects = [];

    const geometries = [
        new THREE.IcosahedronGeometry(4, 1),
        new THREE.TorusKnotGeometry(3, 1, 100, 16),
        new THREE.CylinderGeometry(3, 3, 6, 32),
        new THREE.OctahedronGeometry(4, 1)
    ];

    for (let i = 0; i < 4; i++) {
        const material = new THREE.MeshStandardMaterial({
            color: 0x3399ff,
            metalness: 0.5,
            roughness: 0.2,
            transparent: true,
            opacity: 0.85
        });
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
        mesh.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02);
        scene.add(mesh);
        objects.push(mesh);
    }

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    function animate() {
        requestAnimationFrame(animate);
        objects.forEach(obj => {
            obj.position.add(obj.userData.velocity);
            obj.rotation.x += 0.005;
            obj.rotation.y += 0.005;
        });
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

document.addEventListener('DOMContentLoaded', initBackground3D);
