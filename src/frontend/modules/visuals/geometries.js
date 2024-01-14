import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { CLOCK_OUTER_RADIUS, COMPLICATION_FRAME_HEIGHT, COMPLICATION_FRAME_WIDTH, SEGMENTS, SIZES } from '../constants.js';
import { hourHandShape, minuteHandShape, secondHandShape } from './shapes.js';


const clockFace = new THREE.CircleGeometry(SIZES.CLOCK_RADIUS, SEGMENTS);
const clockBezel = new THREE.RingGeometry(SIZES.CLOCK_RADIUS, CLOCK_OUTER_RADIUS, SEGMENTS);
const complicationFrameHorizontal = new THREE.BoxGeometry(COMPLICATION_FRAME_WIDTH, SIZES.COMPLICATION_FRAME_THICKNESS, SIZES.DAY_DATE_BOX_DEPTH);
const complicationFrameVertical = new THREE.BoxGeometry(SIZES.COMPLICATION_FRAME_THICKNESS, COMPLICATION_FRAME_HEIGHT, SIZES.DAY_DATE_BOX_DEPTH);
const dayDateBox = new THREE.BoxGeometry(SIZES.DAY_DATE_BOX_WIDTH, SIZES.DAY_DATE_BOX_HEIGHT, SIZES.DAY_DATE_BOX_DEPTH);
const digitalDisplayBox = new THREE.BoxGeometry(SIZES.DIGITAL_DISPLAY_BOX_WIDTH, SIZES.DIGITAL_DISPLAY_BOX_HEIGHT, SIZES.DIGITAL_DISPLAY_BOX_DEPTH);
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
    digitalDisplayBox,
    hourHand,
    minuteHand,
    post,
    secondHand,
}

export function createDayDateGeometry(dayDateStr, font) {
    return new TextGeometry(String(dayDateStr), {
        font: font,
        size: 0.225,
        height: 0.05,
        curveSegments: SEGMENTS / 8,
        bevelEnabled: false
    });
}

export function createDigitalTimeGeometry(dayDateStr, font) {
    return new TextGeometry(String(dayDateStr), {
        font: font,
        size: 0.35,
        height: 0.05,
        curveSegments: SEGMENTS / 8,
        bevelEnabled: false
    });
}

export function createHourGeometry(hour, font) {
    return new TextGeometry(String(hour), {
        font: font,
        size: SIZES.NUMBER_SIZE,
        height: SIZES.NUMBER_HEIGHT,
        curveSegments: SEGMENTS / 8,
        bevelEnabled: false
    });
}

export function createMinuteGeometry(minute, font) {
    return new TextGeometry(String(minute), {
        font: font,
        size: SIZES.NUMBER_SIZE / 2,
        height: SIZES.NUMBER_HEIGHT / 2,
        curveSegments: SEGMENTS / 8,
        bevelEnabled: false
    });
}

export function createIndicatorGeometry(isFiveMinuteMark) {
    const regularIndicatorRadius = SIZES.INDICATOR_RADIUS * 1/2;
    const largeIndicatorRadius = SIZES.INDICATOR_RADIUS;
    const regularIndicatorHeight = SIZES.INDICATOR_HEIGHT * 2/3;
    const largeIndicatorHeight = SIZES.INDICATOR_HEIGHT;

    const indicatorRadius = isFiveMinuteMark ? largeIndicatorRadius : regularIndicatorRadius;
    const indicatorHeight = isFiveMinuteMark ? largeIndicatorHeight : regularIndicatorHeight;

    return new THREE.CylinderGeometry(indicatorRadius, indicatorRadius, indicatorHeight, SEGMENTS / 8);
}
