/**
 * clockConstructor.js - Constructs the clock elements for the perfect clock.
 *
 * This module builds the initial clock, assembling the various Three.js parts into the places
 * they're supposed to go.
 */


import { updateDayDateDisplay, updateDigitalDisplay } from './clockUpdater.js';
import * as CONSTANTS from '../constants.js';
import { createHourGeometry, createMinuteGeometry, createIndicatorGeometry } from '../visuals/geometries.js';
import * as meshesJs from '../visuals/meshes.js';
import { distanceToEdge } from '../utils/sizeUtils.js';


/**
 * Configures the position and name of a mesh object in the scene.
 *
 * @param {THREE.Mesh} mesh - The mesh object to configure.
 * @param {string} meshName - The name to assign to the mesh.
 * @param {number} meshAngle - The angle used to calculate the mesh's x and y positions.
 * @param {number} centerDistance - The distance from the center of the scene to the mesh.
 */
function configureDynamicMesh(mesh, meshName, meshAngle, centerDistance) {
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
 */
function createNumbers(scene, hoursFont, minutesFont) {
    for (let i = 1; i <= 12; i++) {
        const angle = (Math.PI / 6) * i;

        // Hours
        const hourGeometry = createHourGeometry(i, hoursFont);
        hourGeometry.center();

        const hourMesh = meshesJs.createHourMesh(hourGeometry)
        const distanceFromCenter = distanceToEdge(angle) * 3/4

        configureDynamicMesh(hourMesh, `hour${i}`, angle, distanceFromCenter)
        CONSTANTS.HOUR_NUMBERS[i] = hourMesh;
        scene.add(hourMesh);

        // Minutes
        const minuteNumber = i * 5;

        const minuteGeometry = createMinuteGeometry(minuteNumber, minutesFont);
        minuteGeometry.center();

        const minuteMesh = meshesJs.createMinuteMesh(minuteGeometry);
        const minuteDistanceFromCenter = distanceToEdge(angle) * 23/40

        configureDynamicMesh(minuteMesh, `minute${minuteNumber}`, angle, minuteDistanceFromCenter);
        CONSTANTS.MINUTE_NUMBERS[minuteNumber] = minuteMesh;
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

        const indicatorGeometry = createIndicatorGeometry(isFiveMinuteMark, CONSTANTS.SIZES.INDICATOR_SCALE);
        indicatorGeometry.center();

        const indicatorThickness = indicatorGeometry.boundingBox.max.z - indicatorGeometry.boundingBox.min.z
        const adjustedDistanceFromCenter = isFiveMinuteMark 
            ? distanceFromCenter - indicatorThickness / 2
            : distanceFromCenter + indicatorThickness / 2;

        const indicator = meshesJs.createIndicatorMesh(indicatorGeometry);
        configureDynamicMesh(indicator, `indicator${i}`, angle, adjustedDistanceFromCenter)

        CONSTANTS.INDICATORS[i] = indicator;
        indicator.rotation.z = -angle

        scene.add(indicator);
    }
}

/**
 * 
 * @param {Object} scene - The Three.js scene object.
 */
function createDynamicIndicators(scene) {
    for (let i = 0; i < 60; i++) {  
        const angle = (Math.PI / 30) * i;
        const isFiveMinuteMark = i % 5 === 0;

        const indicatorGeometry = createIndicatorGeometry(isFiveMinuteMark, CONSTANTS.SIZES.INDICATOR_SCALE);
        indicatorGeometry.center();

        const indicator = meshesJs.createIndicatorMesh(indicatorGeometry);
        const distanceFromCenter = distanceToEdge(angle);
        const indicatorThickness = indicatorGeometry.boundingBox.max.y - indicatorGeometry.boundingBox.min.y;
        const adjustedDistanceFromCenter = distanceFromCenter - indicatorThickness / 2

        configureDynamicMesh(indicator, `indicator${i}`, angle, adjustedDistanceFromCenter)
        indicator.rotation.z = -angle
        CONSTANTS.INDICATORS[i] = indicator;

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

    for (const mesh in meshesJs.MESHES) {
        scene.add(meshesJs.MESHES[mesh]);
    }
}

/**
 * Adds the dynamic clock to the scene.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} hoursFont - The serif font used for the hours. 
 * @param {Object} minutesFont - The sans font used for the minutes.
 */
export function addDynamicClock(scene, hoursFont, minutesFont) {
    let clockFace = meshesJs.createDynamicClockFace();
    let clockBezel = meshesJs.createDynamicClockBezel();

    scene.add(clockFace);
    scene.add(clockBezel);
    scene.add(meshesJs.post);

    createDynamicIndicators(scene);
    createNumbers(scene, hoursFont, minutesFont);
}

export function rebuildDynamicClock(scene, hoursFont, minutesFont) {
    ['dynamicClockFace', 'dynamicClockBezel'].forEach(meshName => {
        const mesh = scene.getObjectByName(meshName)
        if (mesh) {
            mesh.geometry.dispose();
            scene.remove(mesh);
        }
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

    addDynamicClock(scene, hoursFont, minutesFont);
}
