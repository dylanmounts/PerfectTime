/**
 * geometries.js - Defines various 3D geometries for the perfect clock.
 *
 */

import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import * as CONSTANTS from '../constants.js';
import { hourHandShape, minuteHandShape, secondHandShape } from './shapes.js';


// Static clock parts
const clockFace = new THREE.CircleGeometry(CONSTANTS.SIZES.CLOCK_RADIUS, CONSTANTS.SEGMENTS);
const clockBezel = new THREE.RingGeometry(CONSTANTS.SIZES.CLOCK_RADIUS, CONSTANTS.CLOCK_OUTER_RADIUS, CONSTANTS.SEGMENTS);
const dayDateFrameHorizontal = new THREE.BoxGeometry(CONSTANTS.DAY_DATE_FRAME_WIDTH, CONSTANTS.SIZES.COMPLICATION_FRAME_THICKNESS, CONSTANTS.SIZES.DAY_DATE_BOX_DEPTH);
const dayDateFrameVertical = new THREE.BoxGeometry(CONSTANTS.SIZES.COMPLICATION_FRAME_THICKNESS, CONSTANTS.DAY_DATE_FRAME_HEIGHT, CONSTANTS.SIZES.DAY_DATE_BOX_DEPTH);
const digitalDisplayFrameHorizontal = new THREE.BoxGeometry(CONSTANTS.DIGITAL_DISPLAY_FRAME_WIDTH, CONSTANTS.SIZES.COMPLICATION_FRAME_THICKNESS, CONSTANTS.SIZES.DAY_DATE_BOX_DEPTH);
const digitalDisplayFrameVertical = new THREE.BoxGeometry(CONSTANTS.SIZES.COMPLICATION_FRAME_THICKNESS, CONSTANTS.DIGITAL_DISPLAY_FRAME_HEIGHT, CONSTANTS.SIZES.DAY_DATE_BOX_DEPTH);
const dayDateBox = new THREE.BoxGeometry(CONSTANTS.SIZES.DAY_DATE_BOX_WIDTH, CONSTANTS.SIZES.DAY_DATE_BOX_HEIGHT, CONSTANTS.SIZES.DAY_DATE_BOX_DEPTH);
const digitalDisplayBox = new THREE.BoxGeometry(CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_WIDTH, CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_HEIGHT, CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_DEPTH);
const hourHand = new THREE.ShapeGeometry(hourHandShape());
const minuteHand = new THREE.ShapeGeometry(minuteHandShape());
const post = new THREE.CylinderGeometry(CONSTANTS.SIZES.POST_RADIUS, CONSTANTS.SIZES.POST_RADIUS, CONSTANTS.SIZES.POST_HEIGHT, CONSTANTS.SEGMENTS / 8);
const secondHand = new THREE.ShapeGeometry(secondHandShape());

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
    minuteHand,
    post,
    secondHand,
}

// Text geometry for the day/date display
export function createDayDateGeometry(dayDateStr, font) {
    return new TextGeometry(String(dayDateStr), {
        font: font,
        size: CONSTANTS.SIZES.DAY_DATE_SIZE,
        height: CONSTANTS.SIZES.COMPLICATION_NUMBER_HEIGHT,
        curveSegments: CONSTANTS.SEGMENTS / 8,
        bevelEnabled: false
    });
}

// Text geometry for the digital time display
export function createDigitalTimeGeometry(dayDateStr, font) {
    return new TextGeometry(String(dayDateStr), {
        font: font,
        size: CONSTANTS.SIZES.DIGITAL_TIME_SIZE,
        height: CONSTANTS.SIZES.COMPLICATION_NUMBER_HEIGHT,
        curveSegments: CONSTANTS.SEGMENTS / 8,
        bevelEnabled: false
    });
}

// Text geometries for each hour number
export function createHourGeometry(hour, font) {
    return new TextGeometry(String(hour), {
        font: font,
        size: CONSTANTS.SIZES.NUMBER_SIZE,
        height: CONSTANTS.SIZES.NUMBER_HEIGHT,
        curveSegments: CONSTANTS.SEGMENTS / 8,
        bevelEnabled: false
    });
}

// Text geometries for each minute number
export function createMinuteGeometry(minute, font) {
    return new TextGeometry(String(minute), {
        font: font,
        size: CONSTANTS.SIZES.NUMBER_SIZE / 2,
        height: CONSTANTS.SIZES.NUMBER_HEIGHT / 2,
        curveSegments: CONSTANTS.SEGMENTS / 8,
        bevelEnabled: false
    });
}

// Geometries for each indicator (tick mark)
export function createIndicatorGeometry(isFiveMinuteMark) {
    const regularIndicatorRadius = CONSTANTS.SIZES.INDICATOR_RADIUS * 1/2;
    const largeIndicatorRadius = CONSTANTS.SIZES.INDICATOR_RADIUS;
    const regularIndicatorHeight = CONSTANTS.SIZES.INDICATOR_HEIGHT * 2/3;
    const largeIndicatorHeight = CONSTANTS.SIZES.INDICATOR_HEIGHT;

    const indicatorRadius = isFiveMinuteMark ? largeIndicatorRadius : regularIndicatorRadius;
    const indicatorHeight = isFiveMinuteMark ? largeIndicatorHeight : regularIndicatorHeight;

    return new THREE.CylinderGeometry(indicatorRadius, indicatorRadius, indicatorHeight, CONSTANTS.SEGMENTS / 8);
}
