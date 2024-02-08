
/**
 * meshes.js - Defines meshes for the perfect clock.
 */

import * as THREE from 'three';

import * as CONSTANTS from '../constants.js';
import * as geometriesJs from './geometries.js'; 
import { MATERIALS } from './materials.js';


// Static clock parts
export const createClockBezel = () => {
    const clockBezel = new THREE.Mesh(
        geometriesJs.createClockBezel(),
        MATERIALS.clockBezel
    );
    clockBezel.name = 'clockBezel';
    clockBezel.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2;
    return clockBezel;
}

export const createClockFace = () => {
    const clockFace = new THREE.Mesh(
        geometriesJs.createClockFace(),
        MATERIALS.clockFace
    );
    clockFace.name = 'clockFace';
    clockFace.rotateX(Math.PI / 2);
    return clockFace;
}

export const createHourHand = (handLength) => {
    const hourHand = new THREE.Mesh(
        geometriesJs.createHourHandGeometry(handLength),
        MATERIALS.hourHand
    );
    hourHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - 0.005;
    hourHand.name = 'hourHand';
    return hourHand;
};

export const createOuterHourHand = (handLength) => {
    const outerHourHand = new THREE.Mesh(
        geometriesJs.createOuterHourHandGeometry(handLength),
        MATERIALS.outerHourHand
    );
    outerHourHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - 0.006;
    outerHourHand.name = 'outerHourHand';
    return outerHourHand;
};

export const createMinuteHand = (handLength) => {
    const minuteHand = new THREE.Mesh(
        geometriesJs.createMinuteHandGeometry(handLength),
        MATERIALS.minuteHand
    );
    minuteHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - 0.003;
    minuteHand.name = 'minuteHand';
    return minuteHand;
};

export const createOuterMinuteHand = (handLength) => {
    const outerMinuteHand = new THREE.Mesh(
        geometriesJs.createOuterMinuteHandGeometry(handLength),
        MATERIALS.outerMinuteHand
    );
    outerMinuteHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - 0.004;
    outerMinuteHand.name = 'outerMinuteHand';
    return outerMinuteHand;
};

export const post = new THREE.Mesh(geometriesJs.createPost(), MATERIALS.post);
post.rotation.x = Math.PI / 2
post.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT / 2;

export const createSecondHand = (handLength) => {
    const secondHand = new THREE.Mesh(
        geometriesJs.createSecondHandGeometry(handLength),
        MATERIALS.secondHand
    );
    secondHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - 0.001;
    secondHand.name = 'secondHand';
    return secondHand;
};

export const createOuterSecondHand = (handLength) => {
    const outerSecondHand = new THREE.Mesh(
        geometriesJs.createOuterSecondHandGeometry(handLength),
        MATERIALS.outerSecondHand
    );
    outerSecondHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - 0.002;
    outerSecondHand.name = 'outerSecondHand';
    return outerSecondHand;
};


// Dynamic clock parts
export const createDynamicClockFace = () => {
    const dynamicClockFace = new THREE.Mesh(
        geometriesJs.createDynamicClockFaceGeometry().center(), MATERIALS.clockFace
    );
    dynamicClockFace.name = "clockFace";
    return dynamicClockFace;
};

export const createDynamicClockBezel = () => {
    const dynamicClockBezel = new THREE.Mesh(
        geometriesJs.createDynamicClockBezelGeometry().center(), MATERIALS.clockBezel
    );
    dynamicClockBezel.name = "clockBezel";
    dynamicClockBezel.position.z = -0.01
    return dynamicClockBezel;
};

export const createDigitalDisplayBox = (width, height, isDynamic) => {
    const digitalDisplayBox = new THREE.Mesh(
        geometriesJs.createDigitalDisplayBoxGeometry(width, height, isDynamic),
        [MATERIALS.digitalDisplayBox, MATERIALS.complicationFrame]
    );
    digitalDisplayBox.name = "digitalDisplayBox";
    return digitalDisplayBox;
};

export const createDayDateBox = (width, height, isDynamic) => {
    const dayDateBox = new THREE.Mesh(
        geometriesJs.createDayDateBoxGeometry(width, height, isDynamic),
        [MATERIALS.dayDateBox, MATERIALS.complicationFrame]
    );
    dayDateBox.name = "dayDateBox";
    return dayDateBox;
};

/**
 * Removes a mesh by name from the specified Three.js.
 * 
 * @param {THREE.Scene} scene - The scene from which the object will be removed.
 * @param {string} name - The name of the object to remove.
 */
export function removeMeshByName(scene, name) {
    const selectedObject = scene.getObjectByName(name);
    if (selectedObject) {
        selectedObject.geometry.dispose();
        scene.remove(selectedObject);
    }
}

/**
 * Removes a group by its name from the scene and disposes of its resources.
 * 
 * @param {THREE.Scene} scene - The Three.js scene from which the group will be removed.
 * @param {string} groupName - The name of the group to remove.
 */
export function removeMeshByGroup(scene, groupName) {
    const selectedGroup = scene.getObjectByName(groupName);
    if (selectedGroup) {
        // Iterate over each mesh in the group and dispose of its resources
        selectedGroup.children.forEach(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                // If the material is an array, dispose of each material in the array
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    // If it's a single material, dispose of it directly
                    child.material.dispose();
                }
            }
        });
        // Remove the group from the scene
        scene.remove(selectedGroup);
    }
}

// Mesh used for the day/date display
export function createDayDateMesh(dayDateGeometry) {
    return new THREE.Mesh(dayDateGeometry, MATERIALS.dayDate);
}

// Mesh used to show the digital time
export function createDigitalDisplayMesh(digitalDisplayGeometry) {
    return new THREE.Mesh(digitalDisplayGeometry, MATERIALS.digitalDisplay);
}

// Mesh used for each hour number
export function createHourMesh(hourGeometry) {
    return new THREE.Mesh(hourGeometry, [MATERIALS.hourNumber, MATERIALS.outerHourNumber]);
}

// Mesh used for each minute number
export function createMinuteMesh(minuteGeometry) {
    return new THREE.Mesh(minuteGeometry, [MATERIALS.minuteNumber, MATERIALS.outerMinuteNumber]);
}

// Mesh used for each indicator (tick mark)
export function createIndicatorMesh(indicatorGeometry) {
    return new THREE.Mesh(indicatorGeometry, [MATERIALS.indicator, MATERIALS.outerIndicator]);
}
