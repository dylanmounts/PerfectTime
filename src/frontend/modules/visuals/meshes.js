
/**
 * meshes.js - Defines meshes for the perfect clock.
 */

import * as THREE from 'three';

import * as CONSTANTS from '../constants.js';
import * as geometriesJs from './geometries.js'; 
import { MATERIALS } from './materials.js';
import { distanceToEdge } from '../utils/sizeUtils.js';
import { dynamicClockRatio } from '../managers/sceneManager.js';


export const createClockBezel = (isDynamic) => {
    const clockBezel = new THREE.Mesh(
        geometriesJs.createClockBezel(isDynamic), MATERIALS.clockBezel
    )
    clockBezel.position.z = isDynamic 
        ? -0.01
        : CONSTANTS.SIZES.CLOCK_THICKNESS / 2;
    clockBezel.name = 'clockBezel';
    return clockBezel;
}

export const createClockFace = (isDynamic) => {
    const clockFace = new THREE.Mesh(
        geometriesJs.createClockFace(isDynamic), MATERIALS.clockFace
    )
    if (!isDynamic) clockFace.rotateX(Math.PI / 2);
    clockFace.name = 'clockFace';
    return clockFace;
}

export const createClockFrame = () => {
    const clockFrame = new THREE.Mesh(
        geometriesJs.createClockFrame(),
        MATERIALS.clockBezel
    );
    clockFrame.name = 'clockFrame';
    clockFrame.position.z = -.01;
    clockFrame.rotateX(Math.PI / 2);
    return clockFrame;
}

export const createHourHand = (isDynamic) => {
    const referenceAngle = dynamicClockRatio < 1 ? 0 : Math.PI / 2;
    const handLength = isDynamic
        ? distanceToEdge(referenceAngle) * 2/3
        : CONSTANTS.HOUR_HAND_BASE_LENGTH

    const hourHand = new THREE.Mesh(
        geometriesJs.createHourHandGeometry(handLength, isDynamic),
        MATERIALS.hourHand
    );

    hourHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - 0.005;
    hourHand.name = 'hourHand';
    return hourHand;
};

export const createOuterHourHand = (isDynamic) => {
    const referenceAngle = dynamicClockRatio < 1 ? 0 : Math.PI / 2;
    const handLength = isDynamic
        ? distanceToEdge(referenceAngle) * 2/3
        : CONSTANTS.HOUR_HAND_BASE_LENGTH

    const outerHourHand = new THREE.Mesh(
        geometriesJs.createOuterHourHandGeometry(handLength, isDynamic),
        MATERIALS.outerHourHand
    );

    outerHourHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - 0.006;
    outerHourHand.name = 'outerHourHand';
    return outerHourHand;
};

export const createMinuteHand = (isDynamic) => {
    const referenceAngle = dynamicClockRatio < 1 ? 0 : Math.PI / 2;
    const handLength = isDynamic
        ? distanceToEdge(referenceAngle)
        : CONSTANTS.MINUTE_HAND_BASE_LENGTH

    const minuteHand = new THREE.Mesh(
        geometriesJs.createMinuteHandGeometry(handLength, isDynamic),
        MATERIALS.minuteHand
    );

    minuteHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - 0.003;
    minuteHand.name = 'minuteHand';
    return minuteHand;
};

export const createOuterMinuteHand = (isDynamic) => {
    const referenceAngle = dynamicClockRatio < 1 ? 0 : Math.PI / 2;
    const handLength = isDynamic
        ? distanceToEdge(referenceAngle)
        : CONSTANTS.MINUTE_HAND_BASE_LENGTH

    const outerMinuteHand = new THREE.Mesh(
        geometriesJs.createOuterMinuteHandGeometry(handLength, isDynamic),
        MATERIALS.outerMinuteHand
    );

    outerMinuteHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - 0.004;
    outerMinuteHand.name = 'outerMinuteHand';
    return outerMinuteHand;
};

export const createSecondHand = (isDynamic) => {
    const referenceAngle = dynamicClockRatio < 1 ? 0 : Math.PI / 2;
    const handLength = isDynamic
        ? distanceToEdge(referenceAngle)
        : CONSTANTS.SECOND_HAND_BASE_LENGTH

    const secondHand = new THREE.Mesh(
        geometriesJs.createSecondHandGeometry(handLength, isDynamic),
        MATERIALS.secondHand
    );

    secondHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - 0.001;
    secondHand.name = 'secondHand';
    return secondHand;
};

export const createOuterSecondHand = (isDynamic) => {
    const referenceAngle = dynamicClockRatio < 1 ? 0 : Math.PI / 2;
    const handLength = isDynamic
        ? distanceToEdge(referenceAngle)
        : CONSTANTS.SECOND_HAND_BASE_LENGTH

    const outerSecondHand = new THREE.Mesh(
        geometriesJs.createOuterSecondHandGeometry(handLength, isDynamic),
        MATERIALS.outerSecondHand
    );

    outerSecondHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - 0.002;
    outerSecondHand.name = 'outerSecondHand';
    return outerSecondHand;
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

export const createBackdrop = () => new THREE.Mesh(
    geometriesJs.createBackdrop(), MATERIALS.backdrop
)

export const createPost = () => {
    const post = new THREE.Mesh(geometriesJs.createPost(), MATERIALS.post);
    post.rotation.x = Math.PI / 2
    post.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT / 2;
    return post
}

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
