/**
 * sceneManager.js - Manages the Three.js scene housing the perfect clock.
 * 
 * This module is responsible setting up and running the clock's scene. Camera, rendering, and
 * lighting should all go through here. The scene manager also kicks off the animation loop.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { MAX_ZOOM, PERFECT_TIME_SYNC_SECONDS, SIZES, ZOOM_EXPONENT } from '../constants';
import { dayDateFontManager, digitalFontManager, hoursFontManager, minutesFontManager } from './fontManager';
import { timeManager } from './timeManager';
import { addClock, destroyClock } from '../clock/clockConstructor';
import { useDynamicClock, toggleResizeHandled, updateClock } from '../clock/clockUpdater';


const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const container = document.getElementById('clockContainer');

const controls = new OrbitControls(camera, renderer.domElement);
let minPan = new THREE.Vector3();
let maxPan = new THREE.Vector3();
const minimumZoom = 1;
const maximumZoom = 1.1;


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
    const aspectRatio = container.clientWidth / container.clientHeight;
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
    controls.minDistance = minimumZoom;
    controls.maxZoom = MAX_ZOOM;
    controls.enableDamping = true;
    controls.dampingFactor = 0.035;
    controls.enableRotate = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = 0;
    controls.maxAzimuthAngle = 0;
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
    const target = scene.getObjectByName('clockFace');
    const boundingBox = new THREE.Box3().setFromObject(target);

    // Define the original view extents based on the camera's settings at the initial zoom (zoom = 1)
    const originalLeft = boundingBox.min.x;
    const originalRight = boundingBox.max.x;
    const originalTop = boundingBox.max.y;
    const originalBottom = boundingBox.min.y;

    // Calculate the initial view width and height
    const initialWidth = originalRight - originalLeft;
    const initialHeight = originalTop - originalBottom;

    // Calculate the current view width and height based on zoom
    const currentWidth = initialWidth / camera.zoom;
    const currentHeight = initialHeight / camera.zoom;

    // Determine the difference between the initial and current view sizes
    const widthDiff = (initialWidth - currentWidth) / 2;
    const heightDiff = (initialHeight - currentHeight) / 2;

    // Adjust pan limits based on the difference, allowing panning within the original view boundaries
    controls.maxPan = new THREE.Vector3(widthDiff, heightDiff, 0);
    controls.minPan = new THREE.Vector3(-widthDiff, -heightDiff, 0);

    maxPan = new THREE.Vector3(widthDiff, heightDiff, 0);
    minPan = new THREE.Vector3(-widthDiff, -heightDiff, 0);
}

/**
 * Updates the camera's position to ensure the clock is appropriately framed on screen.
 */
export function updateCamera() {    
    let left, right, top, bottom;

    if (useDynamicClock) {
        if (dynamicClockRatio > 1) {
            // Wider than tall
            left = -dynamicClockWidth / 2 + SIZES.BEZEL_THICKNESS * 1.75;
            right = dynamicClockWidth / 2 - SIZES.BEZEL_THICKNESS * 1.75;
            top = dynamicClockWidth / (2 * dynamicClockRatio) - SIZES.BEZEL_THICKNESS * 1.75;
            bottom = -dynamicClockWidth / (2 * dynamicClockRatio) + SIZES.BEZEL_THICKNESS * 1.75;
        } else {
            // Taller than wide
            left = -dynamicClockHeight * dynamicClockRatio / 2 + SIZES.BEZEL_THICKNESS * 1.75;
            right = dynamicClockHeight * dynamicClockRatio / 2 - SIZES.BEZEL_THICKNESS * 1.75;
            top = dynamicClockHeight / 2 - SIZES.BEZEL_THICKNESS * 1.75;
            bottom = -dynamicClockHeight / 2 + SIZES.BEZEL_THICKNESS * 1.75;
        }
    } else {
        const radiusWithBezel = SIZES.CLOCK_RADIUS + SIZES.BEZEL_THICKNESS;
        const aspect = container.clientWidth / container.clientHeight;
        if (aspect >= 1) {
            // Wider than tall
            left = -radiusWithBezel * aspect;
            right = radiusWithBezel * aspect;
            top = radiusWithBezel;
            bottom = -radiusWithBezel;
        } else {
            // Taller than wide
            left = -radiusWithBezel;
            right = radiusWithBezel;
            top = radiusWithBezel / aspect;
            bottom = -radiusWithBezel / aspect;
        }
    }

    camera.left = left;
    camera.right = right;
    camera.top = top;
    camera.bottom = bottom;
    camera.updateProjectionMatrix();

    controls.minZoom = camera.zoom;
    updatePanLimits();
}

/**
 * Maps the slider value to the camera zoom level.
 *
 * @param {number} sliderValue - The current value of the zoom slider.
 * @returns {number} The calculated camera zoom level.
 */
function mapZoomLevel(sliderValue) {
    return Math.pow(sliderValue, ZOOM_EXPONENT) * (maximumZoom - minimumZoom) + minimumZoom;
}

/**
 * Maps the camera zoom level back to the slider value.
 * @param {number} cameraZoom - The current zoom level of the camera.
 * @returns {number} The corresponding slider value.
 */
function unmapZoomLevel(cameraZoom) {
    return Math.pow((cameraZoom - minimumZoom) / (maximumZoom - minimumZoom), 1 / ZOOM_EXPONENT);
}

/**
 * Updates the camera's zoom level.
 *
 * @param {number} cameraZoom - The desired zoom level for the camera.
 */
export function updateCameraZoom(cameraZoom) {
    camera.zoom = mapZoomLevel(cameraZoom);
    controls.update();
}

/**
 * Updates the zoom slider to reflect the current camera zoom level.
 */
export function updateCameraSlider() {
    const sliderValue = unmapZoomLevel(camera.zoom);
    document.getElementById('zoomSlider').value = sliderValue;
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
    addClock(scene, hoursFont, minutesFont, useDynamicClock);

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

    addClock(scene, hoursFont, minutesFont);
    animate();
    onWindowResize(); // To update the camera and renderer
}
