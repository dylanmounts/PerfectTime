
/**
 * meshes.js - Defines meshes for the perfect clock.
 */

import * as THREE from 'three';

import * as CONSTANTS from '../constants.js';
import { DYNAMIC_GEOMETRIES, GEOMETRIES } from './geometries.js'; 
import { MATERIALS } from './materials.js';
import { scaleValue } from '../utils/uiUtils.js';


// Static clock parts
const clockBezel = new THREE.Mesh(GEOMETRIES.clockBezel, MATERIALS.clockBezel);
clockBezel.position.z = 0;

const clockFace = new THREE.Mesh(GEOMETRIES.clockFace, MATERIALS.clockFace);
clockFace.position.z = 0;

const hourHand = new THREE.Mesh(GEOMETRIES.hourHand, MATERIALS.hourHand);
hourHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - .005;
hourHand.name = 'hourHand';

const outerHourHand = new THREE.Mesh(GEOMETRIES.outerHourHand, MATERIALS.outerHourHand);
outerHourHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - .006;
outerHourHand.name = 'outerHourHand';

const minuteHand = new THREE.Mesh(GEOMETRIES.minuteHand, MATERIALS.minuteHand);
minuteHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - .003;
minuteHand.name = 'minuteHand';

const outerMinuteHand = new THREE.Mesh(GEOMETRIES.outerMinuteHand, MATERIALS.outerMinuteHand);
outerMinuteHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - .004;
outerMinuteHand.name = 'outerMinuteHand';

const post = new THREE.Mesh(GEOMETRIES.post, MATERIALS.post);
post.rotation.x = Math.PI / 2
post.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT / 2;

const secondHand = new THREE.Mesh(GEOMETRIES.secondHand, MATERIALS.secondHand);
secondHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - .001;
secondHand.name = 'secondHand';

const outerSecondHand = new THREE.Mesh(GEOMETRIES.outerSecondHand, MATERIALS.outerSecondHand);
outerSecondHand.position.z = CONSTANTS.SIZES.CLOCK_THICKNESS / 2 + CONSTANTS.SIZES.POST_HEIGHT - .002;
outerSecondHand.name = 'outerSecondHand';

const dayDateBox = new THREE.Mesh(GEOMETRIES.dayDateBox, MATERIALS.dayDateBox);
dayDateBox.name = 'dayDateBox';
dayDateBox.position.set(0, -CONSTANTS.SIZES.CLOCK_RADIUS * 1/6, 0)

const dayDateTopFrame = new THREE.Mesh(GEOMETRIES.dayDateFrameHorizontal, MATERIALS.complicationFrame);
dayDateTopFrame.name = 'dayDateTopFrame';
dayDateTopFrame.position.set(
    dayDateBox.position.x,
    dayDateBox.position.y + scaleValue(CONSTANTS.SIZES.DAY_DATE_BOX_HEIGHT) / 2 + scaleValue(CONSTANTS.SIZES.DAY_DATE_FRAME_THICKNESS) / 2,
    0
);
const dayDateBottomFrame = new THREE.Mesh(GEOMETRIES.dayDateFrameHorizontal, MATERIALS.complicationFrame);
dayDateBottomFrame.name = 'dayDateBottomFrame';
dayDateBottomFrame.position.set(
    dayDateBox.position.x,
    dayDateBox.position.y - scaleValue(CONSTANTS.SIZES.DAY_DATE_BOX_HEIGHT) / 2 - scaleValue(CONSTANTS.SIZES.DAY_DATE_FRAME_THICKNESS) / 2,
    0
);
const dayDateLeftFrame = new THREE.Mesh(GEOMETRIES.dayDateFrameVertical, MATERIALS.complicationFrame);
dayDateLeftFrame.name = 'dayDateLeftFrame';
dayDateLeftFrame.position.set(CONSTANTS.DAY_DATE_BOX_LEFT_X, dayDateBox.position.y, 0);

const dayDateRightFrame = new THREE.Mesh(GEOMETRIES.dayDateFrameVertical, MATERIALS.complicationFrame);
dayDateRightFrame.name = 'dayDateRightFrame';
dayDateRightFrame.position.set(scaleValue(CONSTANTS.DAY_DATE_BOX_RIGHT_X), dayDateBox.position.y, 0);

const digitalDisplayBox = new THREE.Mesh(GEOMETRIES.digitalDisplayBox, MATERIALS.digitalDisplayBox);
digitalDisplayBox.name = 'digitalDisplayBox';
digitalDisplayBox.position.set(0, CONSTANTS.SIZES.CLOCK_RADIUS * 1/6, 0)

const digitalDisplayTopFrame = new THREE.Mesh(GEOMETRIES.digitalDisplayFrameHorizontal, MATERIALS.complicationFrame);
digitalDisplayTopFrame.name = 'digitalDisplayTopFrame';
digitalDisplayTopFrame.position.set(
    digitalDisplayBox.position.x,
    digitalDisplayBox.position.y + scaleValue(CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_HEIGHT) / 2 + scaleValue(CONSTANTS.SIZES.DIGITAL_TIME_FRAME_THICKNESS) / 2,
    0
);
const digitalDisplayBottomFrame = new THREE.Mesh(GEOMETRIES.digitalDisplayFrameHorizontal, MATERIALS.complicationFrame);
digitalDisplayBottomFrame.name = 'digitalDisplayBottomFrame';
digitalDisplayBottomFrame.position.set(
    digitalDisplayBox.position.x,
    digitalDisplayBox.position.y - scaleValue(CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_HEIGHT) / 2 - scaleValue(CONSTANTS.SIZES.DIGITAL_TIME_FRAME_THICKNESS) / 2,
    0
);
const digitalDisplayLeftFrame = new THREE.Mesh(GEOMETRIES.digitalDisplayFrameVertical, MATERIALS.complicationFrame);
digitalDisplayLeftFrame.name = 'digitalDisplayLeftFrame';
digitalDisplayLeftFrame.position.set(
    digitalDisplayBox.position.x - CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_WIDTH / 2 - CONSTANTS.SIZES.DIGITAL_TIME_FRAME_THICKNESS / 2,
    digitalDisplayBox.position.y,
    0
);
const digitalDisplayRightFrame = new THREE.Mesh(GEOMETRIES.digitalDisplayFrameVertical, MATERIALS.complicationFrame);
digitalDisplayRightFrame.name = 'digitalDisplayRightFrame';
digitalDisplayRightFrame.position.set(
    digitalDisplayBox.position.x + CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_WIDTH / 2 + CONSTANTS.SIZES.DIGITAL_TIME_FRAME_THICKNESS / 2,
    digitalDisplayBox.position.y,
    0
)

// Dynamic clock parts
const dynamicClockFace = new THREE.Mesh(DYNAMIC_GEOMETRIES.dynamicClockFace, MATERIALS.clockFace);
const dynamicClockBezel = new THREE.Mesh(DYNAMIC_GEOMETRIES.dynamicClockBezel, MATERIALS.clockBezel);
dynamicClockBezel.position.z = dynamicClockFace.position.z - 0.01

export const MESHES = {
    clockBezel,
    clockFace,
    dayDateBox,
    digitalDisplayBox,
    hourHand,
    outerHourHand,
    minuteHand,
    outerMinuteHand,
    post,
    secondHand,
    outerSecondHand,
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
