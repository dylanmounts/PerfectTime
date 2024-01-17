/**
 * clockConstructor.js - Constructs the clock elements for the perfect clock.
 *
 * This module builds the initial clock, assembling the various Three.js parts into the places
 * they're supposed to go.
 */


import { updateDayDateDisplay, updateDigitalDisplay, updateTimeOffset } from './clockUpdater.js';
import { HOUR_NUMBERS, INDICATORS, MINUTE_NUMBERS, SIZES } from '../constants.js';
import { timeManager } from '../managers/timeManager.js';
import { createHourGeometry, createMinuteGeometry, createIndicatorGeometry } from '../visuals/geometries.js';
import { createHourMesh, createMinuteMesh, createIndicatorMesh, MESHES } from '../visuals/meshes.js';


/**
 * Creates and places hour and minute numbers in the scene.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} font - The font used for the numbers.
 */
function createNumbers(scene, font) {
    for (let i = 1; i <= 12; i++) {
        const angle = (Math.PI / 6) * i;

        // Hours
        const hourGeometry = createHourGeometry(i, font);
        hourGeometry.center();

        const hourMesh = createHourMesh(hourGeometry)
        const distanceFromCenter = SIZES.CLOCK_RADIUS * 5/6;
        hourMesh.position.x = Math.sin(angle) * distanceFromCenter;
        hourMesh.position.y = Math.cos(angle) * distanceFromCenter;
        hourMesh.position.z = 0;
        hourMesh.name = `hour${i}`;

        HOUR_NUMBERS[i] = hourMesh;
        scene.add(hourMesh);

        // Minutes
        const minuteNumber = i * 5;

        const minuteGeometry = createMinuteGeometry(minuteNumber, font);
        minuteGeometry.center();

        const minuteMesh = createMinuteMesh(minuteGeometry);
        const minuteDistanceFromCenter = SIZES.CLOCK_RADIUS * 2/3;
        minuteMesh.position.x = Math.sin(angle) * minuteDistanceFromCenter;
        minuteMesh.position.y = Math.cos(angle) * minuteDistanceFromCenter;
        minuteMesh.position.z = 0;
        minuteMesh.name = `minute${minuteNumber}`;

        MINUTE_NUMBERS[minuteNumber] = minuteMesh;
        scene.add(minuteMesh);
    }
}

/**
 * Creates and places clock indicators (tick marks) in the scene.
 * 
 * @param {Object} scene - The Three.js scene object.
 */
function createIndicators(scene) {
    const distanceFromCenter = SIZES.CLOCK_RADIUS * 23/24;

    for (let i = 0; i < 60; i++) {  
        const angle = (Math.PI / 30) * i;

        const isFiveMinuteMark = i % 5 === 0;
        const indicatorGeometry = createIndicatorGeometry(isFiveMinuteMark);

        const indicator = createIndicatorMesh(indicatorGeometry);
        indicator.rotation.x = Math.PI / 2;

        indicator.position.x = Math.sin(angle) * distanceFromCenter;
        indicator.position.y = Math.cos(angle) * distanceFromCenter;
        indicator.position.z = 0;
        indicator.name = `indicator${i}`;

        INDICATORS[i] = indicator;
        scene.add(indicator);
    }
}

/**
 * Adds the complete clock to the scene, including indicators, numbers, and other displays.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} regularFont - The regular font for the clock numbers.
 * @param {Object} monoFont - The monospace font for the digital display and date.
 */
export async function addClock(scene, regularFont, monoFont) {
    createIndicators(scene);
    createNumbers(scene, regularFont);
    updateDayDateDisplay(scene, monoFont);
    updateDigitalDisplay(scene, monoFont);
    updateTimeOffset(timeManager.timeOffset);

    for (const mesh in MESHES) {
        scene.add(MESHES[mesh]);
    }
}
