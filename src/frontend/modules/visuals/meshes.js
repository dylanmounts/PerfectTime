import * as THREE from 'three';

import { SIZES } from '../constants.js';
import { GEOMETRIES } from './geometries.js'; 
import { MATERIALS } from './materials.js';


const clockBezel = new THREE.Mesh(GEOMETRIES.clockBezel, MATERIALS.clockBezel);
clockBezel.position.z = 0;

const clockFace = new THREE.Mesh(GEOMETRIES.clockFace, MATERIALS.clockFace);
clockFace.position.z = 0;

const hourHand = new THREE.Mesh(GEOMETRIES.hourHand, MATERIALS.hourHand);
hourHand.position.z = SIZES.POST_HEIGHT - .003;

const minuteHand = new THREE.Mesh(GEOMETRIES.minuteHand, MATERIALS.minuteHand);
minuteHand.position.z = SIZES.POST_HEIGHT - .002;

const post = new THREE.Mesh(GEOMETRIES.post, MATERIALS.post);
post.rotation.x = Math.PI / 2
post.position.z = SIZES.POST_HEIGHT / 2;

const secondHand = new THREE.Mesh(GEOMETRIES.secondHand, MATERIALS.secondHand);
secondHand.position.z = SIZES.POST_HEIGHT - .001;

const dayDateBox = new THREE.Mesh(GEOMETRIES.dayDateBox, MATERIALS.dayDateBox);
dayDateBox.name = 'dayDateBox';
const dayDateBoxAngle = (Math.PI / 6) * 3;
dayDateBox.position.x = Math.sin(dayDateBoxAngle) * SIZES.CLOCK_RADIUS * 3/4;
dayDateBox.position.y = Math.cos(dayDateBoxAngle) * SIZES.CLOCK_RADIUS * 3/4;
dayDateBox.position.z = 0;

const dayDateTopFrame = new THREE.Mesh(GEOMETRIES.dayDateFrameHorizontal, MATERIALS.complicationFrame);
dayDateTopFrame.position.set(dayDateBox.position.x, dayDateBox.position.y + SIZES.DAY_DATE_BOX_HEIGHT / 2 + SIZES.COMPLICATION_FRAME_THICKNESS / 2, 0);

const dayDateBottomFrame = new THREE.Mesh(GEOMETRIES.dayDateFrameHorizontal, MATERIALS.complicationFrame);
dayDateBottomFrame.position.set(dayDateBox.position.x, dayDateBox.position.y - SIZES.DAY_DATE_BOX_HEIGHT/2 - SIZES.COMPLICATION_FRAME_THICKNESS / 2, 0);

const dayDateLeftFrame = new THREE.Mesh(GEOMETRIES.dayDateFrameVertical, MATERIALS.complicationFrame);
dayDateLeftFrame.position.set(dayDateBox.position.x - SIZES.DAY_DATE_BOX_WIDTH / 2 - SIZES.COMPLICATION_FRAME_THICKNESS / 2, dayDateBox.position.y, 0);

const dayDateRightFrame = new THREE.Mesh(GEOMETRIES.dayDateFrameVertical, MATERIALS.complicationFrame);
dayDateRightFrame.position.set(dayDateBox.position.x + SIZES.DAY_DATE_BOX_WIDTH / 2 + SIZES.COMPLICATION_FRAME_THICKNESS / 2, dayDateBox.position.y, 0);

export const dayDateParts = [
    dayDateBox,
    dayDateTopFrame,
    dayDateBottomFrame,
    dayDateLeftFrame,
    dayDateRightFrame,
]

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
    minuteHand,
    post,
    secondHand,
    dayDateTopFrame,
    dayDateBottomFrame,
    dayDateLeftFrame,
    dayDateRightFrame,
    digitalDisplayTopFrame,
    digitalDisplayBottomFrame,
    digitalDisplayLeftFrame,
    digitalDisplayRightFrame,
}

export function createDayDateMesh(dayDateGeometry) {
    return new THREE.Mesh(dayDateGeometry, MATERIALS.dayDate);
}

export function createDigitalDisplayMesh(digitalDisplayGeometry) {
    return new THREE.Mesh(digitalDisplayGeometry, MATERIALS.digitalDisplay);
}

export function createHourMesh(hourGeometry) {
    return new THREE.Mesh(hourGeometry, MATERIALS.hourNumber);
}

export function createMinuteMesh(minuteGeometry) {
    return new THREE.Mesh(minuteGeometry, MATERIALS.minuteNumber);
}

export function createIndicatorMesh(indicatorGeometry) {
    return new THREE.Mesh(indicatorGeometry, MATERIALS.indicator)
}
