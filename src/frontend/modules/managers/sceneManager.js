/**
 * sceneManager.js - Manages the Three.js scene housing the perfect clock.
 * 
 * This module is responsible setting up and running the clock's scene. Camera, rendering, and
 * lighting should all go through here. The scene manager also kicks off the animation loop.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { PERFECT_TIME_SYNC_SECONDS, SIZES } from '../constants';
import { fontManager, monoFontManager } from './fontManager';
import { timeManager } from './timeManager';
import { addClock } from '../clock/clockConstructor';
import { updateClock } from '../clock/clockUpdater';
import { MESHES } from '../visuals/meshes';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
const container = document.getElementById('clockContainer');
const renderer = new THREE.WebGLRenderer({ antialias: true });

const controls = new OrbitControls(camera, renderer.domElement);
const minPan = new THREE.Vector3();
const maxPan = new THREE.Vector3();
let initialZoom = null;

let regularFont = null;
let monoFont = null;

/**
 * Initializes and sets up the scene with lighting and renderer.
 */
function setupScene() {
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableRotate = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = 0;
    controls.maxAzimuthAngle = 0;
    controls.minDistance = 1;
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
    };
    controls.touches = {
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_PAN
    }

    const originalUpdate = controls.update.bind(controls);
    controls.update = function() {
        originalUpdate();
        updatePanLimits();
        this.target.clamp(minPan, maxPan);
    };

    const ambientLight = new THREE.AmbientLight(0xffffff, 5);
    scene.add(ambientLight);

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
}

/**
 * Dynamically updates the panning limits of the camera based on its current zoom level.
 */
function updatePanLimits() {
    // Find the clock's bounding box
    const boundingBox = new THREE.Box3().setFromObject(MESHES.clockBezel);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    // Scale the clock size based on the screen size
    const paddingFactor = SIZES.CLOCK_RADIUS / (initialZoom * initialZoom)
    const scalingFactor = initialZoom * paddingFactor;
    const adjustedSize = size.clone().multiplyScalar(scalingFactor);

    // Calculate the ratio of current zoom level to the maximum zoom level
    const zoomRatio = controls.maxDistance / camera.position.distanceTo(center);

    // Calculate the original pan limits based on the object size
    const originalMinPan = center.clone().sub(adjustedSize);
    const originalMaxPan = center.clone().add(adjustedSize);

    // Linearly interpolate between the center and the original pan limits
    minPan.lerpVectors(center, originalMinPan, Math.max(0, zoomRatio - 1));
    maxPan.lerpVectors(center, originalMaxPan, Math.max(0, zoomRatio - 1));
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
    if (initialZoom === null) initialZoom = cameraZ;

    camera.position.set(center.x, center.y, center.z + cameraZ);
    camera.lookAt(center);

    // Set outer limits for camera controls
    controls.maxDistance = camera.position.z;
    controls.target = center;

    updatePanLimits();
}

/**
 * Maps the slider value to the camera zoom level.
 *
 * @param {number} sliderValue - The current value of the zoom slider.
 * @returns {number} The calculated camera zoom level.
 */
function mapZoomLevel(sliderValue) {
    return (100 - sliderValue) / 100 * (initialZoom - 1) + 1;
}

/**
 * Maps the camera zoom level back to the slider value.
 * @param {number} cameraZoom - The current zoom level of the camera.
 * @returns {number} The corresponding slider value.
 */
function unmapZoomLevel(cameraZoom) {
    return 100 - ((cameraZoom - 1) / (initialZoom - 1) * 100);
}

/**
 * Updates the camera's zoom level.
 *
 * @param {number} cameraZoom - The desired zoom level for the camera.
 */
export function updateCameraZoom(cameraZoom) {
    camera.position.z = mapZoomLevel(cameraZoom);
    controls.update();
}

/**
 * Updates the zoom slider to reflect the current camera zoom level.
 */
export function updateCameraSlider() {
    const zoomLevel = unmapZoomLevel(camera.position.z);
    document.getElementById('zoomSlider').value = zoomLevel;
}

/**
 * Handles window resize events to keep the clock centered and full screen.
 */
export function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    renderer.setSize(container.clientWidth, container.clientHeight);

    updateCamera();
    camera.updateProjectionMatrix();

    controls.update();
}

/**
 * Primary animation loop. Keeps the clock running.
 */
function animate() {
    updateClock(scene, monoFont);

    controls.update();
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
