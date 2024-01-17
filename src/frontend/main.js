import { Toast } from 'bootstrap';
import * as THREE from 'three';

import '../frontend/scss/styles.scss'
import { MESHES } from './modules/visuals/meshes';
import { addClock } from './modules/clock/clockConstructor';
import { toggleDayDate, toggleDigitalDisplay, toggleHourIndicators, toggleHourNumbers, toggleHourHand, toggleMinuteIndicators, toggleMinuteNumbers, toggleMinuteHand, toggleSecondHand, toggleSweepingSeconds, updateClock } from './modules/clock/clockUpdater';
import { timeManager } from './modules/managers/timeManager';
import { fontManager, monoFontManager } from './modules/managers/fontManager';


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

let regularFont = null;
let monoFont = null;

function setupScene() {
    window.addEventListener('resize', onWindowResize);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const pointLight = new THREE.PointLight(0xffffff, 100);
    pointLight.position.set(0, 0, 7.5);

    scene.add(ambientLight);
    scene.add(pointLight);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function updateCamera() {
    const boundingBox = new THREE.Box3().setFromObject(MESHES.clockBezel);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    // Calculate the distance the camera should be from the clock
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 1.15 * Math.tan(fov / 2));

    // Adjust for aspect ratio
    const aspect = camera.aspect;
    if (aspect < 1) {
        cameraZ = cameraZ / aspect;
    }

    // Set camera position
    camera.position.set(center.x, center.y, center.z + cameraZ);

    // Look at the center of the clock
    camera.lookAt(center);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateCamera();
}

function animate() {
    updateClock(scene, monoFont);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

async function initializeScene() {
    setupScene();

    await timeManager.fetchInitialTime('https://perfecttime.org/api/time');
    regularFont = await fontManager.getLoadedFont();
    monoFont = await monoFontManager.getLoadedFont();

    addClock(scene, regularFont, monoFont);
    updateCamera();
    animate();
}

initializeScene();
handleCheckboxChange('dayDateOption', toggleDayDate);
handleCheckboxChange('digitalTimeOption', toggleDigitalDisplay);
handleCheckboxChange('hourIndicatorsOption', toggleHourIndicators);
handleCheckboxChange('hoursOption', toggleHourNumbers);
handleCheckboxChange('hourHandOption', toggleHourHand);
handleCheckboxChange('minuteIndicatorsOption', toggleMinuteIndicators);
handleCheckboxChange('minutesOption', toggleMinuteNumbers);
handleCheckboxChange('minuteHandOption', toggleMinuteHand);
handleCheckboxChange('secondHandOption', toggleSecondHand);
handleCheckboxChange('sweepingSecondsOption', toggleSweepingSeconds);
