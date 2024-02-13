/**
 * clockConstructor.js - Constructs the clock elements for the perfect clock.
 *
 * This module builds the initial clock, assembling the various Three.js parts into the places
 * they're supposed to go.
 */


import * as CONSTANTS from '../constants.js';
import { createHourGeometry, createMinuteGeometry, createIndicatorGeometry } from '../visuals/geometries.js';
import * as meshesJs from '../visuals/meshes.js';
import { distanceToEdge } from '../utils/sizeUtils.js';
import { updateCameraZoom } from '../managers/sceneManager.js';


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
    mesh.position.z = (CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.BEZEL_RADIUS / 2) / 2
    mesh.name = meshName;
}

/**
 * Creates and places hour and minute numbers in the scene.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} hoursFont - The serif font used for the hours.
 * @param {Object} minutesFont - The sans font used for the minutes.
 * @param {boolean} [isDynamic=true] - Optional parameter to specify if clock is currently dynamic.
 */
function createNumbers(scene, hoursFont, minutesFont, isDyanmic = true) {
    for (let i = 1; i <= 12; i++) {
        const angle = (Math.PI / 6) * i;

        // Hours
        const distanceFromCenter = distanceToEdge(angle) * 3/4
        const hourGeometry = createHourGeometry(i, hoursFont, distanceFromCenter, isDyanmic);
        hourGeometry.center();

        const hourMesh = meshesJs.createHourMesh(hourGeometry)

        CONSTANTS.HOUR_NUMBERS[i] = hourMesh;

        // Minutes
        const minuteNumber = i * 5;

        const minuteDistanceFromCenter = distanceToEdge(angle) * 23/40
        const minuteGeometry = createMinuteGeometry(minuteNumber, minutesFont, distanceFromCenter, isDyanmic);
        minuteGeometry.center();

        const minuteMesh = meshesJs.createMinuteMesh(minuteGeometry);
        CONSTANTS.MINUTE_NUMBERS[minuteNumber] = minuteMesh;

        // Final configuration
        if (isDyanmic) {
            configureMesh(hourMesh, `hour${i}`, angle, distanceFromCenter)
            configureMesh(minuteMesh, `minute${minuteNumber}`, angle, minuteDistanceFromCenter);
        } else {
            configureMesh(hourMesh, `hour${i}`, angle, CONSTANTS.HOURS_BASE_DISTANCE)
            configureMesh(minuteMesh, `minute${minuteNumber}`, angle, CONSTANTS.MINUTES_BASE_DISTANCE);
        }
    
        scene.add(hourMesh);
        scene.add(minuteMesh);
    }
}

/**
 * Creates and places clock indicators (tick marks) in the scene
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {boolean} [isDynamic=true] - Optional parameter to specify if clock is currently dynamic.
 */
function createIndicators(scene, isDynamic = true) {
    const baseDistanceFromCenter = CONSTANTS.SIZES.CLOCK_RADIUS * 47 / 48;

    for (let i = 0; i < 60; i++) {  
        const angle = (Math.PI / 30) * i;
        const isFiveMinuteMark = i % 5 === 0;
        let distanceFromCenter;
        let adjustedDistanceFromCenter;

        const indicatorGeometry = createIndicatorGeometry(isFiveMinuteMark, isDynamic);
        indicatorGeometry.center();
        const indicatorThickness = indicatorGeometry.boundingBox.max.y - indicatorGeometry.boundingBox.min.y;

        if (isDynamic) {
            distanceFromCenter = distanceToEdge(angle);
            adjustedDistanceFromCenter = distanceFromCenter - indicatorThickness / 2;
        } else {
            adjustedDistanceFromCenter = baseDistanceFromCenter - indicatorThickness / 2;
        }

        const indicator = meshesJs.createIndicatorMesh(indicatorGeometry);
        configureMesh(indicator, `indicator${i}`, angle, adjustedDistanceFromCenter);
        indicator.rotation.z = -angle;
        CONSTANTS.INDICATORS[i] = indicator;

        scene.add(indicator);
    }
}

/**
 * Adds the clock to the scene.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} hoursFont - The serif font used for the hours. 
 * @param {Object} minutesFont - The sans font used for the minutes.
 * @param {boolean} [isDynamic=true] - Optional parameter to specify if clock is currently dynamic.
 */
export function addClock(scene, hoursFont, minutesFont, isDynamic = true) {
    scene.add(meshesJs.createClockFace(isDynamic));
    scene.add(meshesJs.createClockBezel(isDynamic));
    scene.add(meshesJs.createPost());
    scene.add(meshesJs.createBackdrop());
    if (isDynamic) scene.add(meshesJs.createClockFrame());

    createIndicators(scene, isDynamic);
    createNumbers(scene, hoursFont, minutesFont, isDynamic);
}

/**
 * Removes the clock from the scene.
 * 
 * @param {Object} scene - The Three.js scene object.
 */
export function destroyClock(scene) {
    updateCameraZoom(0);
    [
        'clockFace', 'clockBezel',
        'clockFrame', 'clockPost',
        'secondHand', 'outerSecondHand',
        'minuteHand', 'outerMinuteHand',
        'hourHand', 'outerHourHand'
    ].forEach(meshName => {
        meshesJs.removeMeshByName(scene, meshName);
    });

    for (const indicator in CONSTANTS.INDICATORS) {
        CONSTANTS.INDICATORS[indicator].geometry.dispose();
        scene.remove(CONSTANTS.INDICATORS[indicator]);
    }

    for (const number in CONSTANTS.HOUR_NUMBERS) {
        CONSTANTS.HOUR_NUMBERS[number].geometry.dispose();
        scene.remove(CONSTANTS.HOUR_NUMBERS[number]);
    }

    for (const number in CONSTANTS.MINUTE_NUMBERS) {
        CONSTANTS.MINUTE_NUMBERS[number].geometry.dispose();
        scene.remove(CONSTANTS.MINUTE_NUMBERS[number]);
    }
}
