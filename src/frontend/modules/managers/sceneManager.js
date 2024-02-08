/**
 * sceneManager.js - Manages the Three.js scene housing the perfect clock.
 * 
 * This module is responsible setting up and running the clock's scene. Camera, rendering, and
 * lighting should all go through here. The scene manager also kicks off the animation loop.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { MINIMUM_ZOOM, PERFECT_TIME_SYNC_SECONDS, SIZES } from '../constants';
import { dayDateFontManager, digitalFontManager, hoursFontManager, minutesFontManager } from './fontManager';
import { timeManager } from './timeManager';
import { addClassicClock, addDynamicClock, destroyClock } from '../clock/clockConstructor';
import { useDynamicClock, toggleResizeHandled, updateClock } from '../clock/clockUpdater';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
const container = document.getElementById('clockContainer');
const renderer = new THREE.WebGLRenderer({ antialias: true });

const controls = new OrbitControls(camera, renderer.domElement);
const minPan = new THREE.Vector3();
const maxPan = new THREE.Vector3();

let hoursFont = null;
let minutesFont = null;
let dayDateFont = null;
let digitalFont = null;

export let dynamicClockWidth;
export let dynamicClockHeight;
export let dynamicClockRatio;

function setClockDimensions(width, height) {
    dynamicClockWidth = width;
    dynamicClockHeight = height;
    dynamicClockRatio = width / height;
}

export function calculateClockDimensions() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    let width, height;

    if (aspectRatio >= 1) {
        // Width is longer, set width to 10
        width = 10;
        height = 10 / aspectRatio; // Scale height to maintain aspect ratio
    } else {
        // Height is longer, set height to 10
        height = 10;
        width = 10 * aspectRatio; // Scale width to maintain aspect ratio
    }
    setClockDimensions(width, height);
    return [width, height];
}

/**
 * Initializes and sets up the scene with lighting, renderer, and controls.
 */
function setupScene() {
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.enableRotate = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = 0;
    controls.maxAzimuthAngle = 0;
    controls.minDistance = MINIMUM_ZOOM;
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN,
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
    const target = scene.getObjectByName('clockFace')
    const center = target.geometry.boundingBox.getCenter(new THREE.Vector3());
    const size = target.geometry.boundingBox.getSize(new THREE.Vector3());

    // Scale the clock size based on the screen size
    const paddingFactor = SIZES.CLOCK_RADIUS / (controls.maxDistance * controls.maxDistance)
    const scalingFactor = controls.maxDistance * paddingFactor;
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
 * Updates the camera's position to ensure the clock is appropriately framed on screen.
 * 
 @param {boolean} [isDynamic=true] - Optional parameter to specify if clock is currently dynamic..
 */
export function updateCamera(isDynamic = true) {
    const target = scene.getObjectByName('clockFace');
    const center = target.geometry.boundingBox.getCenter(new THREE.Vector3());
    const size = target.geometry.boundingBox.getSize(new THREE.Vector3());
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ;

    if (isDynamic) {
        if (dynamicClockRatio >= 1) {
            cameraZ = (dynamicClockHeight / 2) / Math.tan(fov / 2) * 1.075;
        } else {
            cameraZ = (dynamicClockWidth / 2) / Math.tan(fov / 2) / dynamicClockRatio * 1.01;
        }
    } else {
        const maxDim = Math.max(size.x, size.y, size.z);

        if (dynamicClockRatio >= 1) {
            cameraZ = Math.abs(maxDim / 2 * Math.tan(fov / 2) * 1.9);
        } else {
            cameraZ = Math.abs(maxDim / 2 * Math.tan(fov / 2) * 1.86);
        }

        if (camera.aspect < 1) cameraZ = cameraZ / camera.aspect;
    }

    camera.position.z = cameraZ + SIZES.BEZEL_THICKNESS * 1.5;
    camera.lookAt(center);
    camera.position.set(center.x, center.y, center.z + cameraZ);

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
    let value = (100 - sliderValue) / 100 * (controls.maxDistance - MINIMUM_ZOOM) + MINIMUM_ZOOM;
    return value
}

/**
 * Maps the camera zoom level back to the slider value.
 * @param {number} cameraZoom - The current zoom level of the camera.
 * @returns {number} The corresponding slider value.
 */
function unmapZoomLevel(cameraZoom) {
    return 100 - ((cameraZoom - MINIMUM_ZOOM) / (controls.maxDistance - MINIMUM_ZOOM) * 100);
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
    toggleResizeHandled(false);
    calculateClockDimensions();

    camera.aspect = container.clientWidth / container.clientHeight;
    renderer.setSize(container.clientWidth, container.clientHeight);

    destroyClock(scene);
    if (useDynamicClock) {
        addDynamicClock(scene, hoursFont, minutesFont);
    } else {
        addClassicClock(scene, hoursFont, minutesFont);
    }

    controls.update();
    updateCamera(useDynamicClock);
    camera.updateProjectionMatrix();
}

/**
 * Primary animation loop. Keeps the clock running.
 */
function animate() {
    updateClock(scene, digitalFont, dayDateFont, hoursFont, minutesFont);

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

    hoursFont = await hoursFontManager.getLoadedFont();
    minutesFont = await minutesFontManager.getLoadedFont();
    digitalFont = await digitalFontManager.getLoadedFont();
    dayDateFont = await dayDateFontManager.getLoadedFont();

    addDynamicClock(scene, hoursFont, minutesFont);
    animate();
    updateCamera();
    onWindowResize();
}
