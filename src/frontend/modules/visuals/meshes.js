
/**
 * meshes.js - Defines meshes for the perfect clock.
 */

import * as THREE from 'three';

import * as CONSTANTS from '../constants.js';
import * as geometriesJs from './geometries.js'; 
import { MATERIALS } from './materials.js';
import { scaleValue } from '../utils/sizeUtils.js';


// Static clock parts
const clockBezel = new THREE.Mesh(geometriesJs.GEOMETRIES.clockBezel, MATERIALS.clockBezel);
clockBezel.position.z = 0;

const clockFace = new THREE.Mesh(geometriesJs.GEOMETRIES.clockFace, MATERIALS.clockFace);
clockFace.position.z = 0;

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

const post = new THREE.Mesh(geometriesJs.GEOMETRIES.post, MATERIALS.post);
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

const dayDateBox = new THREE.Mesh(geometriesJs.GEOMETRIES.dayDateBox, MATERIALS.dayDateBox);
dayDateBox.name = 'dayDateBox';
dayDateBox.position.set(0, -CONSTANTS.SIZES.CLOCK_RADIUS * 1/6, 0)

const dayDateTopFrame = new THREE.Mesh(geometriesJs.GEOMETRIES.dayDateFrameHorizontal, MATERIALS.complicationFrame);
dayDateTopFrame.name = 'dayDateTopFrame';
dayDateTopFrame.position.set(
    dayDateBox.position.x,
    dayDateBox.position.y + scaleValue(CONSTANTS.SIZES.DAY_DATE_BOX_HEIGHT) / 2 + scaleValue(CONSTANTS.SIZES.DAY_DATE_FRAME_THICKNESS) / 2,
    0
);
const dayDateBottomFrame = new THREE.Mesh(geometriesJs.GEOMETRIES.dayDateFrameHorizontal, MATERIALS.complicationFrame);
dayDateBottomFrame.name = 'dayDateBottomFrame';
dayDateBottomFrame.position.set(
    dayDateBox.position.x,
    dayDateBox.position.y - scaleValue(CONSTANTS.SIZES.DAY_DATE_BOX_HEIGHT) / 2 - scaleValue(CONSTANTS.SIZES.DAY_DATE_FRAME_THICKNESS) / 2,
    0
);
const dayDateLeftFrame = new THREE.Mesh(geometriesJs.GEOMETRIES.dayDateFrameVertical, MATERIALS.complicationFrame);
dayDateLeftFrame.name = 'dayDateLeftFrame';
dayDateLeftFrame.position.set(CONSTANTS.DAY_DATE_BOX_LEFT_X, dayDateBox.position.y, 0);

const dayDateRightFrame = new THREE.Mesh(geometriesJs.GEOMETRIES.dayDateFrameVertical, MATERIALS.complicationFrame);
dayDateRightFrame.name = 'dayDateRightFrame';
dayDateRightFrame.position.set(scaleValue(CONSTANTS.DAY_DATE_BOX_RIGHT_X), dayDateBox.position.y, 0);

const digitalDisplayBox = new THREE.Mesh(geometriesJs.GEOMETRIES.digitalDisplayBox, MATERIALS.digitalDisplayBox);
digitalDisplayBox.name = 'digitalDisplayBox';
digitalDisplayBox.position.set(0, CONSTANTS.SIZES.CLOCK_RADIUS * 1/6, 0)

const digitalDisplayTopFrame = new THREE.Mesh(geometriesJs.GEOMETRIES.digitalDisplayFrameHorizontal, MATERIALS.complicationFrame);
digitalDisplayTopFrame.name = 'digitalDisplayTopFrame';
digitalDisplayTopFrame.position.set(
    digitalDisplayBox.position.x,
    digitalDisplayBox.position.y + scaleValue(CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_HEIGHT) / 2 + scaleValue(CONSTANTS.SIZES.DIGITAL_TIME_FRAME_THICKNESS) / 2,
    0
);
const digitalDisplayBottomFrame = new THREE.Mesh(geometriesJs.GEOMETRIES.digitalDisplayFrameHorizontal, MATERIALS.complicationFrame);
digitalDisplayBottomFrame.name = 'digitalDisplayBottomFrame';
digitalDisplayBottomFrame.position.set(
    digitalDisplayBox.position.x,
    digitalDisplayBox.position.y - scaleValue(CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_HEIGHT) / 2 - scaleValue(CONSTANTS.SIZES.DIGITAL_TIME_FRAME_THICKNESS) / 2,
    0
);
const digitalDisplayLeftFrame = new THREE.Mesh(geometriesJs.GEOMETRIES.digitalDisplayFrameVertical, MATERIALS.complicationFrame);
digitalDisplayLeftFrame.name = 'digitalDisplayLeftFrame';
digitalDisplayLeftFrame.position.set(
    digitalDisplayBox.position.x - CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_WIDTH / 2 - CONSTANTS.SIZES.DIGITAL_TIME_FRAME_THICKNESS / 2,
    digitalDisplayBox.position.y,
    0
);
const digitalDisplayRightFrame = new THREE.Mesh(geometriesJs.GEOMETRIES.digitalDisplayFrameVertical, MATERIALS.complicationFrame);
digitalDisplayRightFrame.name = 'digitalDisplayRightFrame';
digitalDisplayRightFrame.position.set(
    digitalDisplayBox.position.x + CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_WIDTH / 2 + CONSTANTS.SIZES.DIGITAL_TIME_FRAME_THICKNESS / 2,
    digitalDisplayBox.position.y,
    0
)

// Dynamic clock parts
const dynamicClockFace = new THREE.Mesh(geometriesJs.DYNAMIC_GEOMETRIES.dynamicClockFace, MATERIALS.clockFace);
const dynamicClockBezel = new THREE.Mesh(geometriesJs.DYNAMIC_GEOMETRIES.dynamicClockBezel, MATERIALS.clockBezel);
dynamicClockBezel.position.z = dynamicClockFace.position.z - 0.01

export const MESHES = {
    clockBezel,
    clockFace,
    dayDateBox,
    digitalDisplayBox,
    post,
    dayDateTopFrame,
    dayDateBottomFrame,
    dayDateLeftFrame,
    dayDateRightFrame,
    digitalDisplayTopFrame,
    digitalDisplayBottomFrame,
    digitalDisplayLeftFrame,
    digitalDisplayRightFrame,
}

export const DYNAMIC_MESHES = {
    dynamicClockFace,
    dynamicClockBezel,
    post
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
        selectedObject.material.dispose();
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
