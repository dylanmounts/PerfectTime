
/**
 * meshes.js - Defines meshes for the perfect clock.
 */

import * as THREE from 'three';

import { SIZES } from '../constants.js';
import { GEOMETRIES } from './geometries.js'; 
import { MATERIALS } from './materials.js';


// Static clock parts
const clockBezel = new THREE.Mesh(GEOMETRIES.clockBezel, MATERIALS.clockBezel);
clockBezel.position.z = 0;

const clockFace = new THREE.Mesh(GEOMETRIES.clockFace, MATERIALS.clockFace);
clockFace.position.z = 0;

const hourHand = new THREE.Mesh(GEOMETRIES.hourHand, MATERIALS.hourHand);
hourHand.position.z = SIZES.POST_HEIGHT - .005;
hourHand.name = 'hourHand';

const outerHourHand = new THREE.Mesh(GEOMETRIES.outerHourHand, MATERIALS.outerHourHand);
outerHourHand.position.z = SIZES.POST_HEIGHT - .006;
outerHourHand.name = 'outerHourHand';

const minuteHand = new THREE.Mesh(GEOMETRIES.minuteHand, MATERIALS.minuteHand);
minuteHand.position.z = SIZES.POST_HEIGHT - .003;
minuteHand.name = 'minuteHand';

const outerMinuteHand = new THREE.Mesh(GEOMETRIES.outerMinuteHand, MATERIALS.outerMinuteHand);
outerMinuteHand.position.z = SIZES.POST_HEIGHT - .004;
outerMinuteHand.name = 'outerMinuteHand';

const post = new THREE.Mesh(GEOMETRIES.post, MATERIALS.post);
post.rotation.x = Math.PI / 2
post.position.z = SIZES.POST_HEIGHT / 2;

const secondHand = new THREE.Mesh(GEOMETRIES.secondHand, MATERIALS.secondHand);
secondHand.position.z = SIZES.POST_HEIGHT - .001;
secondHand.name = 'secondHand';

const outerSecondHand = new THREE.Mesh(GEOMETRIES.outerSecondHand, MATERIALS.outerSecondHand);
outerSecondHand.position.z = SIZES.POST_HEIGHT - .002;
outerSecondHand.name = 'outerSecondHand';

const dayDateBox = new THREE.Mesh(GEOMETRIES.dayDateBox, MATERIALS.dayDateBox);
dayDateBox.name = 'dayDateBox';
const dayDateBoxAngle = (Math.PI / 6) * 3;
dayDateBox.position.x = Math.sin(dayDateBoxAngle) * SIZES.CLOCK_RADIUS * 3/4;
dayDateBox.position.y = Math.cos(dayDateBoxAngle) * SIZES.CLOCK_RADIUS * 3/4;
dayDateBox.position.z = 0;

const dayDateTopFrame = new THREE.Mesh(GEOMETRIES.dayDateFrameHorizontal, MATERIALS.complicationFrame);
dayDateTopFrame.name = 'dayDateTopFrame';
dayDateTopFrame.position.set(dayDateBox.position.x, dayDateBox.position.y + SIZES.DAY_DATE_BOX_HEIGHT / 2 + SIZES.COMPLICATION_FRAME_THICKNESS / 2, 0);

const dayDateBottomFrame = new THREE.Mesh(GEOMETRIES.dayDateFrameHorizontal, MATERIALS.complicationFrame);
dayDateBottomFrame.name = 'dayDateBottomFrame';
dayDateBottomFrame.position.set(dayDateBox.position.x, dayDateBox.position.y - SIZES.DAY_DATE_BOX_HEIGHT/2 - SIZES.COMPLICATION_FRAME_THICKNESS / 2, 0);

const dayDateLeftFrame = new THREE.Mesh(GEOMETRIES.dayDateFrameVertical, MATERIALS.complicationFrame);
dayDateLeftFrame.name = 'dayDateLeftFrame';
dayDateLeftFrame.position.set(dayDateBox.position.x - SIZES.DAY_DATE_BOX_WIDTH / 2 - SIZES.COMPLICATION_FRAME_THICKNESS / 2, dayDateBox.position.y, 0);

const dayDateRightFrame = new THREE.Mesh(GEOMETRIES.dayDateFrameVertical, MATERIALS.complicationFrame);
dayDateRightFrame.name = 'dayDateRightFrame';
dayDateRightFrame.position.set(dayDateBox.position.x + SIZES.DAY_DATE_BOX_WIDTH / 2 + SIZES.COMPLICATION_FRAME_THICKNESS / 2, dayDateBox.position.y, 0);

const digitalDisplayBox = new THREE.Mesh(GEOMETRIES.digitalDisplayBox, MATERIALS.digitalDisplayBox);
digitalDisplayBox.name = 'digitalDisplayBox';
digitalDisplayBox.position.x = Math.sin(0) * SIZES.CLOCK_RADIUS * 1/3;
digitalDisplayBox.position.y = Math.cos(0) * SIZES.CLOCK_RADIUS * 1/3;
digitalDisplayBox.position.z = 0;

const digitalDisplayTopFrame = new THREE.Mesh(GEOMETRIES.digitalDisplayFrameHorizontal, MATERIALS.complicationFrame);
digitalDisplayTopFrame.name = 'digitalDisplayTopFrame';
digitalDisplayTopFrame.position.set(digitalDisplayBox.position.x, digitalDisplayBox.position.y + SIZES.DIGITAL_DISPLAY_BOX_HEIGHT / 2 + SIZES.COMPLICATION_FRAME_THICKNESS / 2, 0);

const digitalDisplayBottomFrame = new THREE.Mesh(GEOMETRIES.digitalDisplayFrameHorizontal, MATERIALS.complicationFrame);
digitalDisplayBottomFrame.name = 'digitalDisplayBottomFrame';
digitalDisplayBottomFrame.position.set(digitalDisplayBox.position.x, digitalDisplayBox.position.y - SIZES.DIGITAL_DISPLAY_BOX_HEIGHT/2 - SIZES.COMPLICATION_FRAME_THICKNESS / 2, 0);

const digitalDisplayLeftFrame = new THREE.Mesh(GEOMETRIES.digitalDisplayFrameVertical, MATERIALS.complicationFrame);
digitalDisplayLeftFrame.name = 'digitalDisplayLeftFrame';
digitalDisplayLeftFrame.position.set(digitalDisplayBox.position.x - SIZES.DIGITAL_DISPLAY_BOX_WIDTH / 2 - SIZES.COMPLICATION_FRAME_THICKNESS / 2, digitalDisplayBox.position.y, 0);

const digitalDisplayRightFrame = new THREE.Mesh(GEOMETRIES.digitalDisplayFrameVertical, MATERIALS.complicationFrame);
digitalDisplayRightFrame.name = 'digitalDisplayRightFrame';
digitalDisplayRightFrame.position.set(digitalDisplayBox.position.x + SIZES.DIGITAL_DISPLAY_BOX_WIDTH / 2 + SIZES.COMPLICATION_FRAME_THICKNESS / 2, digitalDisplayBox.position.y, 0)

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

// Mesh used to show the day/date
export function createDayDateMesh(dayDateGeometry) {
    return new THREE.Mesh(dayDateGeometry, MATERIALS.dayDate);
}

// Mesh used to show the digital time
export function createDigitalDisplayMesh(digitalDisplayGeometry) {
    return new THREE.Mesh(digitalDisplayGeometry, MATERIALS.digitalDisplay);
}

// Mesh used for each hour number
export function createHourMesh(hourGeometry) {
    return new THREE.Mesh(hourGeometry, MATERIALS.hourNumber);
}

// Mesh used for each minute number
export function createMinuteMesh(minuteGeometry) {
    return new THREE.Mesh(minuteGeometry, MATERIALS.minuteNumber);
}

// Mesh used for each indactor (tick mark)
export function createIndicatorMesh(indicatorGeometry) {
    return new THREE.Mesh(indicatorGeometry, MATERIALS.indicator)
}
