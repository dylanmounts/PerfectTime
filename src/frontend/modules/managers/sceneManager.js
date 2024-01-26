/**
 * sceneManager.js - Manages the Three.js scene housing the perfect clock.
 * 
 * This module is responsible setting up and running the clock's scene. Camera, rendering, and
 * lighting should all go through here. The scene manager also kicks off the animation loop.
 */

import * as THREE from 'three';

import { PERFECT_TIME_SYNC_SECONDS } from '../constants';
import { fontManager, monoFontManager } from './fontManager';
import { timeManager } from './timeManager';
import { addClock } from '../clock/clockConstructor';
import { updateClock } from '../clock/clockUpdater';
import { MESHES } from '../visuals/meshes';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const container = document.getElementById('clockContainer');
const renderer = new THREE.WebGLRenderer({ antialias: true });

let regularFont = null;
let monoFont = null;

/**
 * Initializes and sets up the scene with lighting and renderer.
 */
function setupScene() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 5);
    scene.add(ambientLight);

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
}

/**
 * Updates the camera's position so that the clock takes up the full screen.
 */
function updateCamera() {
    const boundingBox = new THREE.Box3().setFromObject(MESHES.clockBezel);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    // Calculations for camera position
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 1.175 * Math.tan(fov / 2));
    if (camera.aspect < 1) cameraZ = cameraZ / camera.aspect;

    camera.position.set(center.x, center.y, center.z + cameraZ);
    camera.lookAt(center);
}

/**
 * Handles window resize events to keep the clock centered and full screen.
 */
export function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    renderer.setSize(container.clientWidth, container.clientHeight);

    updateCamera();
    camera.updateProjectionMatrix();
}

/**
 * Primary animation loop. Keeps the clock running.
 */
function animate() {
    updateClock(scene, monoFont);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

/**
 * Initializes the entire scene and its elements.
 */
export async function initializeScene() {
    setupScene();

    setInterval(() => {
        timeManager.fetchPerfectTime();
    }, PERFECT_TIME_SYNC_SECONDS * 1000);

    regularFont = await fontManager.getLoadedFont();
    monoFont = await monoFontManager.getLoadedFont();

    addClock(scene, regularFont, monoFont);
    animate();
    updateCamera();
}
