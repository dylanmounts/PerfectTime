import { Toast } from 'bootstrap';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import '../frontend/scss/styles.scss'
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
const controls = new OrbitControls(camera, renderer.domElement);

let regularFont = null;
let monoFont = null;

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
    updateClock(scene, monoFont);

    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

async function initializeScene() {
    setupScene();

    await timeManager.fetchInitialTime('http://localhost:3000/time');
    regularFont = await fontManager.getLoadedFont();
    monoFont = await monoFontManager.getLoadedFont();

    addClock(scene, regularFont, monoFont);
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
