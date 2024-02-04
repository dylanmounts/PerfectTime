/**sizes.
 * geometries.js - Defines various 3D geometries for the perfect clock.
 *
 */

import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import * as CONSTANTS from '../constants.js';
import * as SHAPES from './shapes.js';


// Static clock parts
const clockFace = new THREE.CircleGeometry(
    CONSTANTS.SIZES.CLOCK_RADIUS,
    CONSTANTS.SEGMENTS
);
const clockBezel = new THREE.RingGeometry(
    CONSTANTS.SIZES.CLOCK_RADIUS,
    CONSTANTS.CLOCK_OUTER_RADIUS,
    CONSTANTS.SEGMENTS
);
const dayDateFrameHorizontal = new THREE.BoxGeometry(
    CONSTANTS.DAY_DATE_FRAME_WIDTH,
    CONSTANTS.SIZES.DAY_DATE_FRAME_THICKNESS,
    CONSTANTS.SIZES.DAY_DATE_FRAME_DEPTH
);
const dayDateFrameVertical = new THREE.BoxGeometry(
    CONSTANTS.SIZES.DAY_DATE_FRAME_THICKNESS,
    CONSTANTS.DAY_DATE_FRAME_HEIGHT,
    CONSTANTS.SIZES.DAY_DATE_FRAME_DEPTH
);
const digitalDisplayFrameHorizontal = new THREE.BoxGeometry(
    CONSTANTS.DIGITAL_DISPLAY_FRAME_WIDTH,
    CONSTANTS.SIZES.DIGITAL_TIME_FRAME_THICKNESS,
    CONSTANTS.SIZES.DIGITAL_TIME_FRAME_DEPTH
);
const digitalDisplayFrameVertical = new THREE.BoxGeometry(
    CONSTANTS.SIZES.DIGITAL_TIME_FRAME_THICKNESS,
    CONSTANTS.DIGITAL_DISPLAY_FRAME_HEIGHT,
    CONSTANTS.SIZES.DIGITAL_TIME_FRAME_DEPTH
);
const dayDateBox = new THREE.BoxGeometry(
    CONSTANTS.SIZES.DAY_DATE_BOX_WIDTH,
    CONSTANTS.SIZES.DAY_DATE_BOX_HEIGHT,
    CONSTANTS.SIZES.DAY_DATE_BOX_DEPTH
);
const digitalDisplayBox = new THREE.BoxGeometry(
    CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_WIDTH,
    CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_HEIGHT,
    CONSTANTS.SIZES.DIGITAL_TIME_BOX_DEPTH
);
const post = new THREE.CylinderGeometry(
    CONSTANTS.SIZES.POST_RADIUS,
    CONSTANTS.SIZES.POST_RADIUS,
    CONSTANTS.SIZES.POST_HEIGHT,
    CONSTANTS.SEGMENTS / 2
);
const hourHand = new THREE.ShapeGeometry(
    SHAPES.createClockHand(
        CONSTANTS.SIZES.HOUR_HAND_TIP_WIDTH,
        CONSTANTS.SIZES.HOUR_HAND_BASE_WIDTH,
        CONSTANTS.SIZES.HOUR_HAND_BASE_OFFSET,
        CONSTANTS.SIZES.HOUR_HAND_LENGTH_RATIO,
        CONSTANTS.SIZES.HOUR_HAND_SCALE
    ), CONSTANTS.SEGMENTS / 2
);
const outerHourHand = new THREE.ShapeGeometry(
    SHAPES.createClockHand(
        CONSTANTS.SIZES.HOUR_HAND_TIP_WIDTH,
        CONSTANTS.SIZES.HOUR_HAND_BASE_WIDTH,
        CONSTANTS.SIZES.HOUR_HAND_BASE_OFFSET,
        CONSTANTS.SIZES.HOUR_HAND_LENGTH_RATIO
    ), CONSTANTS.SEGMENTS / 2
);
const minuteHand = new THREE.ShapeGeometry(
    SHAPES.createClockHand(
        CONSTANTS.SIZES.MINUTE_HAND_TIP_WIDTH,
        CONSTANTS.SIZES.MINUTE_HAND_BASE_WIDTH,
        CONSTANTS.SIZES.MINUTE_HAND_BASE_OFFSET,
        CONSTANTS.SIZES.MINUTE_HAND_LENGTH_RATIO,
        CONSTANTS.SIZES.MINUTE_HAND_SCALE
    ), CONSTANTS.SEGMENTS / 2
);
const outerMinuteHand = new THREE.ShapeGeometry(
    SHAPES.createClockHand(
        CONSTANTS.SIZES.MINUTE_HAND_TIP_WIDTH,
        CONSTANTS.SIZES.MINUTE_HAND_BASE_WIDTH,
        CONSTANTS.SIZES.MINUTE_HAND_BASE_OFFSET,
        CONSTANTS.SIZES.MINUTE_HAND_LENGTH_RATIO
    ), CONSTANTS.SEGMENTS / 2
);
const secondHand = new THREE.ShapeGeometry(
    SHAPES.createClockHand(
        CONSTANTS.SIZES.SECOND_HAND_TIP_WIDTH,
        CONSTANTS.SIZES.SECOND_HAND_BASE_WIDTH,
        CONSTANTS.SIZES.SECOND_HAND_BASE_OFFSET,
        CONSTANTS.SIZES.SECOND_HAND_LENGTH_RATIO,
        CONSTANTS.SIZES.SECOND_HAND_SCALE
    ), CONSTANTS.SEGMENTS / 2
);
const outerSecondHand = new THREE.ShapeGeometry(
    SHAPES.createClockHand(
        CONSTANTS.SIZES.SECOND_HAND_TIP_WIDTH,
        CONSTANTS.SIZES.SECOND_HAND_BASE_WIDTH,
        CONSTANTS.SIZES.SECOND_HAND_BASE_OFFSET,
        CONSTANTS.SIZES.SECOND_HAND_LENGTH_RATIO
    ), CONSTANTS.SEGMENTS / 2
);
  

export const GEOMETRIES = {
    clockFace,
    clockBezel,
    dayDateFrameHorizontal,
    dayDateFrameVertical,
    digitalDisplayFrameHorizontal,
    digitalDisplayFrameVertical,
    dayDateBox,
    digitalDisplayBox,
    hourHand,
    outerHourHand,
    minuteHand,
    outerMinuteHand,
    post,
    secondHand,
    outerSecondHand,
}

// Text geometry for the day/date display
export function createDayDateGeometry(dayDateStr, font) {
    const textGeometry = new TextGeometry(String(dayDateStr), {
        font: font,
        size: CONSTANTS.SIZES.DAY_DATE_SIZE,
        height: CONSTANTS.SIZES.DAY_DATE_NUMBER_HEIGHT,
        curveSegments: CONSTANTS.SEGMENTS / 8,
        bevelEnabled: false
    });
    textGeometry.computeBoundingBox();
    return textGeometry;
}

// Text geometry for the digital time display
export function createDigitalTimeGeometry(dayDateStr, font) {
    const textGeometry = new TextGeometry(String(dayDateStr), {
        font: font,
        size: CONSTANTS.SIZES.DIGITAL_TIME_SIZE,
        height: CONSTANTS.SIZES.DIGITAL_TIME_NUMBER_HEIGHT,
        curveSegments: CONSTANTS.SEGMENTS / 8,
        bevelEnabled: false
    });
    textGeometry.center();
    return textGeometry;
}

// Text geometries for each hour number
export function createHourGeometry(hour, font) {
    return new TextGeometry(String(hour), {
        font: font,
        size: CONSTANTS.SIZES.NUMBER_SIZE,
        height: CONSTANTS.SIZES.NUMBER_HEIGHT,
        curveSegments: CONSTANTS.SEGMENTS / 8,
        bevelEnabled: true,
        bevelThickness: CONSTANTS.SIZES.NUMBER_BEVEL_THICKNESS,
        bevelSize: CONSTANTS.SIZES.NUMBER_BEVEL_SIZE,
        bevelSegments: 1
    });
}

// Text geometries for each minute number
export function createMinuteGeometry(minute, font) {
    return new TextGeometry(String(minute), {
        font: font,
        size: CONSTANTS.SIZES.NUMBER_SIZE / 2,
        height: CONSTANTS.SIZES.NUMBER_HEIGHT / 2,
        curveSegments: CONSTANTS.SEGMENTS / 8,
        bevelEnabled: true,
        bevelThickness: CONSTANTS.SIZES.NUMBER_BEVEL_THICKNESS / 2,
        bevelSize: CONSTANTS.SIZES.NUMBER_BEVEL_SIZE * 5/6,
        bevelSegments: 1
    });
}

// Triangle geometries for each indicator (tick mark)
export function createIndicatorGeometry(isFiveMinuteMark) {
    const shape = SHAPES.createIndicator(isFiveMinuteMark);
    const extrudeSettings = {
        steps: 1,
        depth: CONSTANTS.SIZES.INDICATOR_HEIGHT / 2,
        bevelEnabled: true,
        bevelThickness: 0.001,
        bevelSize: 0.02,
        bevelSegments: 1
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}
