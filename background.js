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
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const objects = [];

    const geometries = [
        new THREE.SphereGeometry(1, 16, 16),
        new THREE.TorusGeometry(1, 0.4, 16, 32),
        new THREE.BoxGeometry(1.4, 1.4, 1.4),
        new THREE.ConeGeometry(1, 1.5, 4)
    ];

    for (let i = 0; i < 25; i++) {
        const glow = Math.random() > 0.7;
        const material = new THREE.MeshPhongMaterial({
            color: 0x3399ff,
            emissive: glow ? 0x66aaff : 0x000000,
            shininess: 80,
            transparent: true,
            opacity: 0.7
        });
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60);
        mesh.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1);
        scene.add(mesh);
        objects.push(mesh);
    }

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 60);
    scene.add(pointLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    function animate() {
        requestAnimationFrame(animate);
        objects.forEach(obj => {
            obj.position.add(obj.userData.velocity);
            const limit = 30;
            if (obj.position.x > limit) obj.position.x = -limit;
            if (obj.position.x < -limit) obj.position.x = limit;
            if (obj.position.y > limit) obj.position.y = -limit;
            if (obj.position.y < -limit) obj.position.y = limit;
            if (obj.position.z > limit) obj.position.z = -limit;
            if (obj.position.z < -limit) obj.position.z = limit;
            obj.rotation.x += 0.01;
            obj.rotation.y += 0.01;
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
