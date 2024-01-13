import * as THREE from 'three';

import { CLOCK_OUTER_RADIUS, COMPLICATION_FRAME_HEIGHT, COMPLICATION_FRAME_WIDTH, SEGMENTS, SIZES } from './constants.js';
import { hourHandShape, minuteHandShape, secondHandShape } from './shapes.js';


const clockFace = new THREE.CircleGeometry(SIZES.CLOCK_RADIUS, SEGMENTS);
const clockBezel = new THREE.RingGeometry(SIZES.CLOCK_RADIUS, CLOCK_OUTER_RADIUS, SEGMENTS);
const complicationFrameHorizontal = new THREE.BoxGeometry(COMPLICATION_FRAME_WIDTH, SIZES.COMPLICATION_FRAME_THICKNESS, SIZES.DAY_DATE_BOX_DEPTH);
const complicationFrameVertical = new THREE.BoxGeometry(SIZES.COMPLICATION_FRAME_THICKNESS, COMPLICATION_FRAME_HEIGHT, SIZES.DAY_DATE_BOX_DEPTH);
const dayDateBox = new THREE.BoxGeometry(SIZES.DAY_DATE_BOX_WIDTH, SIZES.DAY_DATE_BOX_HEIGHT, SIZES.DAY_DATE_BOX_DEPTH);
const hourHand = new THREE.ShapeGeometry(hourHandShape());
const minuteHand = new THREE.ShapeGeometry(minuteHandShape());
const post = new THREE.CylinderGeometry(SIZES.POST_RADIUS, SIZES.POST_RADIUS, SIZES.POST_HEIGHT, SEGMENTS / 8);
const secondHand = new THREE.ShapeGeometry(secondHandShape());

export const GEOMETRIES = {
    clockFace,
    clockBezel,
    complicationFrameHorizontal,
    complicationFrameVertical,
    dayDateBox,
    hourHand,
    minuteHand,
    post,
    secondHand,
}
