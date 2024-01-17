import * as THREE from 'three';

import { MESHES } from '../visuals/meshes';
import { fontManager, monoFontManager } from './fontManager';
import { timeManager } from './timeManager';
import { addClock } from '../clock/clockConstructor';
import { updateClock } from '../clock/clockUpdater';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

let regularFont = null;
let monoFont = null;

function setupScene() {
    window.addEventListener('resize', onWindowResize);

    const ambientLight = new THREE.AmbientLight(0xffffff, 5);

    scene.add(ambientLight);

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

export function onWindowResize() {
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

export async function initializeScene() {
    setupScene();

    await timeManager.fetchInitialTime('https://perfecttime.org/api/time');
    regularFont = await fontManager.getLoadedFont();
    monoFont = await monoFontManager.getLoadedFont();

    addClock(scene, regularFont, monoFont);
    updateCamera();
    animate();
}
