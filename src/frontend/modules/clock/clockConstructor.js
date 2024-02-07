/**
 * clockConstructor.js - Constructs the clock elements for the perfect clock.
 *
 * This module builds the initial clock, assembling the various Three.js parts into the places
 * they're supposed to go.
 */


import { updateDayDateDisplay, updateDigitalDisplay } from './clockUpdater.js';
import { HOUR_NUMBERS, INDICATORS, MINUTE_NUMBERS, SIZES } from '../constants.js';
import { createHourGeometry, createMinuteGeometry, createIndicatorGeometry } from '../visuals/geometries.js';
import { createHourMesh, createMinuteMesh, createIndicatorMesh, MESHES } from '../visuals/meshes.js';


/**
 * Configures the position and name of a mesh object in the scene.
 *
 * @param {THREE.Mesh} mesh - The mesh object to configure.
 * @param {string} meshName - The name to assign to the mesh.
 * @param {number} meshAngle - The angle used to calculate the mesh's x and y positions.
 * @param {number} centerDistance - The distance from the center of the scene to the mesh.
 */
function configureMesh(mesh, meshName, meshAngle, centerDistance) {
    mesh.position.x = Math.sin(meshAngle) * centerDistance;
    mesh.position.y = Math.cos(meshAngle) * centerDistance;
    mesh.position.z = 0;
    mesh.name = meshName;
}

/**
 * Creates and places hour and minute numbers in the scene.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} hoursFont - The serif font used for the hours.
 * @param {Object} minutesFont - The sans font used for the minutes.
 */
function createNumbers(scene, hoursFont, minutesFont) {
    for (let i = 1; i <= 12; i++) {
        const angle = (Math.PI / 6) * i;

        // Hours
        const hourGeometry = createHourGeometry(i, hoursFont);
        hourGeometry.center();

        const hourMesh = createHourMesh(hourGeometry)
        const distanceFromCenter = SIZES.CLOCK_RADIUS * 5/6;

        configureMesh(hourMesh, `hour${i}`, angle, distanceFromCenter)
        HOUR_NUMBERS[i] = hourMesh;
        scene.add(hourMesh);

        // Minutes
        const minuteNumber = i * 5;

        const minuteGeometry = createMinuteGeometry(minuteNumber, minutesFont);
        minuteGeometry.center();

        const minuteMesh = createMinuteMesh(minuteGeometry);
        const minuteDistanceFromCenter = SIZES.CLOCK_RADIUS * 2/3;

        configureMesh(minuteMesh, `minute${minuteNumber}`, angle, minuteDistanceFromCenter);
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

        const indicatorGeometry = createIndicatorGeometry(isFiveMinuteMark, SIZES.INDICATOR_SCALE);
        indicatorGeometry.center();

        const indicatorThickness = indicatorGeometry.boundingBox.max.z - indicatorGeometry.boundingBox.min.z
        const adjustedDistanceFromCenter = isFiveMinuteMark 
            ? distanceFromCenter - indicatorThickness / 2
            : distanceFromCenter + indicatorThickness / 2;

        const indicator = createIndicatorMesh(indicatorGeometry);
        configureMesh(indicator, `indicator${i}`, angle, adjustedDistanceFromCenter)

        INDICATORS[i] = indicator;
        indicator.rotation.z = -angle

        scene.add(indicator);
    }
}

/**
 * Adds the complete clock to the scene, including indicators, numbers, and other displays.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} hoursFont - The serif font used for the hours.
 * @param {Object} minutesFont - The sans font used for the minutes.
 */
export function addClock(scene, hoursFont, minutesFont) {
    createIndicators(scene);
    createNumbers(scene, hoursFont, minutesFont);
    updateDayDateDisplay(scene, hoursFont);
    updateDigitalDisplay(scene, hoursFont);

    for (const mesh in MESHES) {
        scene.add(MESHES[mesh]);
    }
}
