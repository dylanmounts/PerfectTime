import * as THREE from 'three';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { SEGMENTS, SIZES } from './constants.js';
import { MATERIALS } from './materials.js';
import { MESHES } from './meshes.js';


// Globals
let initialTime;
let systemTime;
let timeOffset;

//Functions
function loadFonts(scene) {
    const loader = new FontLoader();
    loader.load(
        'fonts/droid/droid_sans_regular.typeface.json',
        function (font) {
            createNumbers(scene, font);
            updateDayDateDisplay(scene, font);
        }
    );
}

function createNumbers(scene, font) {
    for (let i = 1; i <= 12; i++) {
        if (i === 3) {
            continue;
        }
        // Hours
        const hourGeometry = new TextGeometry(String(i), {
            font: font,
            size: SIZES.NUMBER_SIZE,
            height: SIZES.NUMBER_HEIGHT,
            curveSegments: SEGMENTS / 8,
            bevelEnabled: false
        });
        hourGeometry.center();
        
        const hourMesh = new THREE.Mesh(hourGeometry, MATERIALS.hourNumber);

        const angle = (Math.PI / 6) * i;
        const distanceFromCenter = SIZES.CLOCK_RADIUS * 5/6;  

        hourMesh.position.x = Math.sin(angle) * distanceFromCenter;
        hourMesh.position.y = Math.cos(angle) * distanceFromCenter;
        hourMesh.position.z = 0;
        
        scene.add(hourMesh);
        
        // Minutes
        const minuteNumber = i * 5;
        const minuteGeometry = new TextGeometry(String(minuteNumber), {
            font: font,
            size: SIZES.NUMBER_SIZE / 2,
            height: SIZES.NUMBER_HEIGHT / 2,
            curveSegments: SEGMENTS / 8,
            bevelEnabled: false
        });
        minuteGeometry.center();

        const minuteMesh = new THREE.Mesh(minuteGeometry, MATERIALS.minuteNumber);
        
        const minuteDistanceFromCenter = SIZES.CLOCK_RADIUS * 2/3;

        minuteMesh.position.x = Math.sin(angle) * minuteDistanceFromCenter;
        minuteMesh.position.y = Math.cos(angle) * minuteDistanceFromCenter;
        minuteMesh.position.z = 0;
        
        scene.add(minuteMesh);
    }
}

function createIndicators(scene) {
    const regularIndicatorRadius = SIZES.INDICATOR_RADIUS * 1/2;
    const largeIndicatorRadius = SIZES.INDICATOR_RADIUS;

    const regularIndicatorHeight = SIZES.INDICATOR_HEIGHT * 2/3;
    const largeIndicatorHeight = SIZES.INDICATOR_HEIGHT;

    const distanceFromCenter = SIZES.CLOCK_RADIUS * 23/24;

    for (let i = 0; i < 60; i++) {
        if (i === 15) {
            continue;
        }
        const isFiveMinuteMark = i % 5 === 0;
        const indicatorRadius = isFiveMinuteMark ? largeIndicatorRadius : regularIndicatorRadius;
        const indicatorHeight = isFiveMinuteMark ? largeIndicatorHeight : regularIndicatorHeight;

        const indicatorGeometry = new THREE.CylinderGeometry(indicatorRadius, indicatorRadius, indicatorHeight, SEGMENTS / 8);

        const angle = (Math.PI / 30) * i;

        const indicator = new THREE.Mesh(indicatorGeometry, MATERIALS.indicator);
        indicator.rotation.x = Math.PI / 2;

        indicator.position.x = Math.sin(angle) * distanceFromCenter;
        indicator.position.y = Math.cos(angle) * distanceFromCenter;
        indicator.position.z = 0;

        scene.add(indicator);
    }
}

export async function fetchInitialTime() {
    try {
        const response = await fetch('http://localhost:3000/time');
        const data = await response.json();
        initialTime = new Date(data.time);
        systemTime = new Date();
        timeOffset = initialTime - systemTime;
    } catch (error) {
        console.error('Error fetching initial time:', error);
        initialTime = new Date();
        timeOffset = 0;
    }
}

function getCurrentTime() {
    const corrected_now = Date.now() + timeOffset;
    return new Date(corrected_now);
}

function updateDayDateDisplay(scene, font) {
    // Get current date
    const now = getCurrentTime();
    const day = now.toLocaleString('en-US', { weekday: 'short' });
    const date = now.toLocaleString('en-US', { month: 'short', day: 'numeric' });

    // Combine day and date
    const dayDateStr = `${day.toUpperCase()} ${date}`;

    // Create text geometry for day and date
    const dayDateGeometry = new TextGeometry(dayDateStr, {
        font: font,
        size: 0.325,
        height: 0.05,
        curveSegments: SEGMENTS / 8,
        bevelEnabled: false
    });
    dayDateGeometry.center();

    // Remove previous day/date display if it exists
    if (scene.getObjectByName('dayDateDisplay')) {
        const prevDayDateDisplay = scene.getObjectByName('dayDateDisplay');
        scene.remove(prevDayDateDisplay);
    }

    // Create mesh for day and date
    const dayDateMesh = new THREE.Mesh(dayDateGeometry, MATERIALS.dayDate);
    dayDateMesh.name = 'dayDateDisplay';

    // Position inside the existing Day/Date box
    dayDateMesh.position.x = MESHES.dayDateBox.position.x;
    dayDateMesh.position.y = MESHES.dayDateBox.position.y;
    dayDateMesh.position.z = MESHES.dayDateBox.position.z + 0.01;

    // Add to the scene
    scene.add(dayDateMesh);
}

export function updateClock() {
    const date = getCurrentTime();
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    const hourAngle = 
        30 * hours + 
        0.5 * minutes + 
        (30 / 3600) * seconds + 
        (30 / 3600000) * milliseconds;

    const minuteAngle = 
        6 * minutes + 
        0.1 * seconds + 
        (0.1 / 1000) * milliseconds;

    const secondAngle = 
        6 * seconds + 
        0.006 * milliseconds;

    MESHES.hourHand.rotation.z = -THREE.MathUtils.degToRad(hourAngle);
    MESHES.minuteHand.rotation.z = -THREE.MathUtils.degToRad(minuteAngle);
    MESHES.secondHand.rotation.z = -THREE.MathUtils.degToRad(secondAngle);
}

export function addClock(scene) {
    loadFonts(scene);
    createIndicators(scene);

    for (const mesh in MESHES) {
        scene.add(MESHES[mesh])
    }
}
