import { AsciiEffect } from './ascii_effect.js';

let camera, scene, renderer, effect, plane;
const IMAGE_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgIBwYHCAgHCAcGBgoPBwcHCA8ICQcKFREiFiARHx8YHSggGBolGxMTITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0NDw0PDysZFRkrNy03KysrLSsrNy0rNzcrKy03NysrLSstNysrKysrKysrNysrKysrKysrKysrKysrK//AABEIAKoBKQMBEQACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAAAAQMEBv/EABcQAQEBAQAAAAAAAAAAAAAAAAARASH/xAAaAQEBAQEBAQEAAAAAAAAAAAAAAQIDBAcF/8QAHREBAQEBAQEBAQEBAAAAAAAAABEBEgIhYVGBQf/aAAwDAQACEQMRAD8A8+/Wr66FBaBRSgUCgUD6CzQT/REBIACgAAAAAAAAAAlBkBRZqC8gvIQ5wJhx5/gQ4wInIHOgzo2rNcGLq7gABBYvKEXkOL8Cp0FTrVRAAAAAIEWaLDnUIvIQ5CLyEOcCEwITAi8/gROQhxgsa5z+BF5/Ahz+BDn8CJyEOSpDgInIJvnQ6zuaqM6Nma4MWprurUAoVehKlBKAAEWaLDnUIvIRecFWAAAAAAoRc86EXjRY1xiCzBCYKQFAAAAAABAQARndUSDZmY4udzdwAAgsXnUIvIRZgqgAAAAAoLNA5CNZ5RY1nkGoKCIAAAAAAAAACUEAETdBlQAGzLiwjHLsRrkVYAAAAAAACzQa5BecRVBYCwVqAQQgJAiwE5BYBAIBAIBASAkAgJBGdzQic6oTQQEGzLgxV3AAAAAAGudBeRWogsCLyLGuMBqYgAAUEAAAAAAAABKoAggCAAAlBAABsy4MGHoAAAGs86LGs8IRrkFgKKuYDUQUAEBAAAAAAAAASqAICgCJ9AmgTQSATQhzoReNKQ40pNTj0VrNY49ONYsO5Fzzosbzx/UGszBVAABYDUQUEAoIAAAAAAAABAIoQFiAAEXnQhyLF5wIc4CwFABBAAbMuLByzMd1UAAAGoCoFAoIAAAAAABAWAQAFAFWAvIEBYAAAAACACAAAA2ZcWDlXcKBQX6K0gAAAAAAAAsAgKAAKQF5CNcgswAAEAAAABABAAAUAAGzMcHO5PQEBrMFVAAAABKoAsQWAoAAqwFgLBWoBREBAAAAAAQFgEAgLAAAAKCDdlwczk9CrQKBQAAQFgLAVBQBSA1AWCrBACggAAAAEBYBAAAAAAAAAPoE0CI2ZjiwcXoAAAFAgNRBQABVgKCgAtBAAAAICwAAAAAAAFRSAsAAAUAAEbMuLned6ABQWAqCgACr8AoH0FgKAACAsBYAAAAAAACoqwCAoIAAoAAlBKIlG6ODmrz9PQNUWr0FOgp0B9BUFoANQVQAAWAQFAAAAAAAFWILAUAEAAUASglEQAAAbsuDmcHoFABYCwVUAGswGgBQFgKAAAAAAACoqwFABAKCUCqiUCggAAAAAA3ZcHM870DUBoUoLQVBoFooCwFAAAAAoAFAFWIKACUQUQAEoAAAAAAAAAINqlcHO5R6FAAXMBqIKKsBYCgAAAAAAAQVrMQVRKBREoFBAAAAAAAAAQAAQAGzLixc3cUFzAaRVgKCgAAAAAAACtfAKIlBKAAAAAAAACAACAAoCwCIQgEGyOLncPr0K1QaxFaoLQSgtAoAAAFBKCgoAAAAICggAAAgAAKBF51CNcixZgAAAAA2ZcXM8+PQraBQUAEAAAoFBAazAaAAAAAAAAAAAAFAjXKLFmA0BAIBAIBAICADVlxYOLuAAIAoIKAAAGLgNgAAAAAAAAAAAmip/wBFdsQawFAAAAAAAAAGzLg//9k=';

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
