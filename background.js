let vantaEffect;
function initBackground3D() {
    const container = document.getElementById('three-container');
    if (!container || typeof VANTA === 'undefined' || !VANTA.BIRDS) {
        console.error('Vanta.js BIRDS not loaded');
        return;
    }
    if (vantaEffect) vantaEffect.destroy();
    vantaEffect = VANTA.BIRDS({
        el: container,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        backgroundAlpha: 0.0,
        color1: 0x3399ff,
        color2: 0x1e90ff,
        birdSize: 1.5,
        wingSpan: 20.0,
        separation: 40.0,
        alignment: 30.0,
        cohesion: 20.0,
        quantity: 4
    });
}

document.addEventListener('DOMContentLoaded', initBackground3D);
