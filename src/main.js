import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { addClock, fetchInitialTime, updateClock } from './frontend/modules/clock';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement);

function setupScene() {
    window.addEventListener('resize', onWindowResize);

    camera.position.z = 10;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const pointLight = new THREE.PointLight(0xffffff, 100);
    pointLight.position.set(0, 0, 7.5);

    scene.add(ambientLight);
    scene.add(pointLight);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    updateClock();

    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

fetchInitialTime().then(() => {
    setupScene()
    addClock(scene)
    animate()
});
