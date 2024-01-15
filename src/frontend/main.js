import { Toast } from 'bootstrap';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import '../frontend/scss/styles.scss'
import { addClock } from './modules/clock/clockConstructor';
import { toggleDigitalDisplay, updateClock } from './modules/clock/clockUpdater';
import { timeManager } from './modules/managers/timeManager';


// Bootstrap
const optionsTrigger = document.getElementById('optionsMenuBtn')
const optionsMenu = document.getElementById('optionsMenu')
const infoTrigger = document.getElementById('infoMenuBtn')
const infoMenu = document.getElementById('infoMenu')

if (optionsTrigger) {
        const toastBootstrap = Toast.getOrCreateInstance(optionsMenu)
        optionsTrigger.addEventListener('click', () => {
            toastBootstrap.show()
    })
}
if (infoTrigger) {
        const toastBootstrap = Toast.getOrCreateInstance(infoMenu)
        infoTrigger.addEventListener('click', () => {
            toastBootstrap.show()
    })
}

function handleCheckboxChange(checkboxId, callback) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            callback(checkbox.checked);
        });
    }
}

// Three
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
    updateClock(scene);

    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

timeManager.fetchInitialTime('http://localhost:3000/time').then(() => {
    setupScene()
    addClock(scene)
    animate()
});

handleCheckboxChange('digitalTimeOption', toggleDigitalDisplay);
