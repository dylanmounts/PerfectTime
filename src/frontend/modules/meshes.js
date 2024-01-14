import * as THREE from 'three';

import { SIZES } from './constants.js';
import { GEOMETRIES } from './geometries.js'; 
import { MATERIALS } from './materials.js';


const clockBezel = new THREE.Mesh(GEOMETRIES.clockBezel, MATERIALS.clockBezel);
clockBezel.position.z = 0;

const clockFace = new THREE.Mesh(GEOMETRIES.clockFace, MATERIALS.clockFace);
clockFace.position.z = 0;

const dayDateBox = new THREE.Mesh(GEOMETRIES.dayDateBox, MATERIALS.dayDateBox);
const dayDateBoxAngle = (Math.PI / 6) * 3;
dayDateBox.position.x = Math.sin(dayDateBoxAngle) * SIZES.CLOCK_RADIUS * 3/4;
dayDateBox.position.y = Math.cos(dayDateBoxAngle) * SIZES.CLOCK_RADIUS * 3/4;
dayDateBox.position.z = 0;

const hourHand = new THREE.Mesh(GEOMETRIES.hourHand, MATERIALS.hourHand);
hourHand.position.z = SIZES.POST_HEIGHT - .003;

const minuteHand = new THREE.Mesh(GEOMETRIES.minuteHand, MATERIALS.minuteHand);
minuteHand.position.z = SIZES.POST_HEIGHT - .002;

const post = new THREE.Mesh(GEOMETRIES.post, MATERIALS.post);
post.rotation.x = Math.PI / 2
post.position.z = SIZES.POST_HEIGHT / 2;

const secondHand = new THREE.Mesh(GEOMETRIES.secondHand, MATERIALS.secondHand);
secondHand.position.z = SIZES.POST_HEIGHT - .001;

const topFrame = new THREE.Mesh(GEOMETRIES.complicationFrameHorizontal, MATERIALS.complicationFrame);
topFrame.position.set(dayDateBox.position.x, dayDateBox.position.y + SIZES.DAY_DATE_BOX_HEIGHT / 2 + SIZES.COMPLICATION_FRAME_THICKNESS / 2, 0);

const bottomFrame = new THREE.Mesh(GEOMETRIES.complicationFrameHorizontal, MATERIALS.complicationFrame);
bottomFrame.position.set(dayDateBox.position.x, dayDateBox.position.y - SIZES.DAY_DATE_BOX_HEIGHT/2 - SIZES.COMPLICATION_FRAME_THICKNESS / 2, 0);

const leftFrame = new THREE.Mesh(GEOMETRIES.complicationFrameVertical, MATERIALS.complicationFrame);
leftFrame.position.set(dayDateBox.position.x - SIZES.DAY_DATE_BOX_WIDTH / 2 - SIZES.COMPLICATION_FRAME_THICKNESS / 2, dayDateBox.position.y, 0);

const rightFrame = new THREE.Mesh(GEOMETRIES.complicationFrameVertical, MATERIALS.complicationFrame);
rightFrame.position.set(dayDateBox.position.x + SIZES.DAY_DATE_BOX_WIDTH / 2 + SIZES.COMPLICATION_FRAME_THICKNESS / 2, dayDateBox.position.y, 0);

export const MESHES = {
    clockBezel,
    clockFace,
    dayDateBox,
    hourHand,
    minuteHand,
    post,
    secondHand,
    topFrame,
    bottomFrame,
    leftFrame,
    rightFrame,
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
