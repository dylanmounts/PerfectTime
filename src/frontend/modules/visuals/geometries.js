/**sizes.
 * geometries.js - Defines various 3D geometries for the perfect clock.
 *
 */

import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import * as CONSTANTS from '../constants.js';
import * as SHAPES from './shapes.js';
import { calculateClockDimensions, dynamicClockHeight, dynamicClockWidth } from '../managers/sceneManager.js';
import { scaleValue } from '../utils/sizeUtils.js';

calculateClockDimensions();

// Static clock parts
export const createClockFace = () => {
    const clockFaceGeometry = new THREE.CylinderGeometry(
        CONSTANTS.SIZES.CLOCK_RADIUS,
        CONSTANTS.SIZES.CLOCK_RADIUS,
        CONSTANTS.SIZES.CLOCK_THICKNESS,
        CONSTANTS.SEGMENTS
    );
    clockFaceGeometry.center();
    return clockFaceGeometry;
}
export const createClockBezel = () => {
    const clockBezelGeometry = new THREE.RingGeometry(
        CONSTANTS.SIZES.CLOCK_RADIUS,
        CONSTANTS.CLOCK_OUTER_RADIUS,
        CONSTANTS.SEGMENTS
    );
    clockBezelGeometry.center();
    return clockBezelGeometry;
};
const dayDateBox = new THREE.BoxGeometry(
    CONSTANTS.SIZES.DAY_DATE_BOX_WIDTH,
    scaleValue(CONSTANTS.SIZES.DAY_DATE_BOX_HEIGHT),
    CONSTANTS.SIZES.DAY_DATE_BOX_DEPTH
);
const digitalDisplayBox = new THREE.BoxGeometry(
    CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_WIDTH,
    scaleValue(CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_HEIGHT),
    CONSTANTS.SIZES.DIGITAL_TIME_BOX_DEPTH
);
export const createPost = () => new THREE.CylinderGeometry(
    scaleValue(CONSTANTS.SIZES.POST_RADIUS),
    scaleValue(CONSTANTS.SIZES.POST_RADIUS),
    CONSTANTS.SIZES.POST_HEIGHT,
    CONSTANTS.SEGMENTS / 2
);
export const createHourHandGeometry = (handLength) => new THREE.ShapeGeometry(
    SHAPES.createClockHand(
        CONSTANTS.SIZES.HOUR_HAND_TIP_WIDTH,
        CONSTANTS.SIZES.HOUR_HAND_BASE_WIDTH,
        CONSTANTS.SIZES.HOUR_HAND_BASE_OFFSET,
        handLength,
        CONSTANTS.SIZES.HOUR_HAND_SCALE
    ), CONSTANTS.SEGMENTS / 2
);
export const createOuterHourHandGeometry = (handLength) => new THREE.ShapeGeometry(
    SHAPES.createClockHand(
        CONSTANTS.SIZES.HOUR_HAND_TIP_WIDTH,
        CONSTANTS.SIZES.HOUR_HAND_BASE_WIDTH,
        CONSTANTS.SIZES.HOUR_HAND_BASE_OFFSET,
        handLength
    ), CONSTANTS.SEGMENTS / 2
);
export const createMinuteHandGeometry = (handLength) => new THREE.ShapeGeometry(
    SHAPES.createClockHand(
        CONSTANTS.SIZES.MINUTE_HAND_TIP_WIDTH,
        CONSTANTS.SIZES.MINUTE_HAND_BASE_WIDTH,
        CONSTANTS.SIZES.MINUTE_HAND_BASE_OFFSET,
        handLength,
        CONSTANTS.SIZES.MINUTE_HAND_SCALE
    ), CONSTANTS.SEGMENTS / 2
);
export const createOuterMinuteHandGeometry = (handLength) => new THREE.ShapeGeometry(
    SHAPES.createClockHand(
        CONSTANTS.SIZES.MINUTE_HAND_TIP_WIDTH,
        CONSTANTS.SIZES.MINUTE_HAND_BASE_WIDTH,
        CONSTANTS.SIZES.MINUTE_HAND_BASE_OFFSET,
        handLength,
    ), CONSTANTS.SEGMENTS / 2
);
export const createSecondHandGeometry = (handLength) => new THREE.ShapeGeometry(
    SHAPES.createClockHand(
        CONSTANTS.SIZES.SECOND_HAND_TIP_WIDTH,
        CONSTANTS.SIZES.SECOND_HAND_BASE_WIDTH,
        CONSTANTS.SIZES.SECOND_HAND_BASE_OFFSET,
        handLength,
        CONSTANTS.SIZES.SECOND_HAND_SCALE
    ), CONSTANTS.SEGMENTS / 2
);
export const createOuterSecondHandGeometry = (handLength) => new THREE.ShapeGeometry(
    SHAPES.createClockHand(
        CONSTANTS.SIZES.SECOND_HAND_TIP_WIDTH,
        CONSTANTS.SIZES.SECOND_HAND_BASE_WIDTH,
        CONSTANTS.SIZES.SECOND_HAND_BASE_OFFSET,
        handLength,
    ), CONSTANTS.SEGMENTS / 2
);

// Dynamic clock parts
export const createDynamicClockFaceGeometry = () => new RoundedBoxGeometry(
    dynamicClockWidth,
    dynamicClockHeight,
    CONSTANTS.SIZES.CLOCK_THICKNESS,
    CONSTANTS.SEGMENTS / 8,
    CONSTANTS.SIZES.BEZEL_RADIUS
);

export const createDynamicClockBezelGeometry = () => new RoundedBoxGeometry(
    dynamicClockWidth + CONSTANTS.SIZES.BEZEL_THICKNESS,
    dynamicClockHeight + CONSTANTS.SIZES.BEZEL_THICKNESS,
    CONSTANTS.SIZES.CLOCK_THICKNESS,
    CONSTANTS.SEGMENTS / 8,
    CONSTANTS.SIZES.BEZEL_RADIUS
);

export const createDigitalDisplayBoxGeometry = (width, height) => {
    const shape = SHAPES.createComplicationBox(width, height)
    const extrudeSettings = {
        steps: 1,
        depth: CONSTANTS.SIZES.DIGITAL_DISPLAY_BOX_DEPTH / 2,
        bevelEnabled: true,
        bevelThickness: CONSTANTS.SIZES.DIGITAL_DISPLAY_BEVEL_THICKNESS,
        bevelSize: scaleValue(CONSTANTS.SIZES.DIGITAL_DISPLAY_BEVEL_SIZE),
        bevelSegments: 1
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings).center();
};

export const createDayDateBoxGeometry = (width, height) => {
    const shape = SHAPES.createComplicationBox(width, height)
    const extrudeSettings = {
        steps: 1,
        depth: CONSTANTS.SIZES.DAY_DATE_BOX_DEPTH / 2,
        bevelEnabled: true,
        bevelThickness: CONSTANTS.SIZES.DAY_DATE_BEVEL_THICKNESS,
        bevelSize: scaleValue(CONSTANTS.SIZES.DAY_DATE_BEVEL_SIZE),
        bevelSegments: 1
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings).center();
};

// Text geometry for the day/date display
export function createDayDateGeometry(dayDateStr, font) {
    const textGeometry = new TextGeometry(String(dayDateStr), {
        font: font,
        size: scaleValue(CONSTANTS.SIZES.DAY_DATE_SIZE),
        height: CONSTANTS.SIZES.DAY_DATE_NUMBER_HEIGHT,
        curveSegments: CONSTANTS.SEGMENTS / 8,
        bevelEnabled: false
    });
    textGeometry.center();
    return textGeometry;
}

// Text geometry for the digital time display
export function createDigitalDisplayGeometry(dayDateStr, font) {
    const textGeometry = new TextGeometry(String(dayDateStr), {
        font: font,
        size: scaleValue(CONSTANTS.SIZES.DIGITAL_DISPLAY_SIZE),
        height: CONSTANTS.SIZES.DIGITAL_DISPLAY_NUMBER_HEIGHT,
        curveSegments: CONSTANTS.SEGMENTS / 8,
        bevelEnabled: false
    });
    textGeometry.center();
    return textGeometry;
}

export function createHourGeometry(hour, font) {
    return new TextGeometry(String(hour), {
        font: font,
        size: scaleValue(CONSTANTS.SIZES.NUMBER_SIZE),
        height: scaleValue(CONSTANTS.SIZES.NUMBER_HEIGHT),
        curveSegments: CONSTANTS.SEGMENTS / 8,
        bevelEnabled: true,
        bevelThickness: scaleValue(CONSTANTS.SIZES.NUMBER_BEVEL_THICKNESS),
        bevelSize: scaleValue(CONSTANTS.SIZES.NUMBER_BEVEL_SIZE),
        bevelSegments: 1
    });
}

// Text geometries for each minute number
export function createMinuteGeometry(minute, font) {
    return new TextGeometry(String(minute), {
        font: font,
        size: scaleValue(CONSTANTS.SIZES.NUMBER_SIZE / 2),
        height: scaleValue(CONSTANTS.SIZES.NUMBER_HEIGHT / 2),
        curveSegments: CONSTANTS.SEGMENTS / 8,
        bevelEnabled: true,
        bevelThickness: scaleValue(CONSTANTS.SIZES.NUMBER_BEVEL_THICKNESS / 2),
        bevelSize: scaleValue(CONSTANTS.SIZES.NUMBER_BEVEL_SIZE * 5/6),
        bevelSegments: 1
    });
}

// Triangle geometries for each indicator (tick mark)
export const createIndicatorGeometry = (isFiveMinuteMark, isDynamic = true) => {
    const shape = SHAPES.createIndicator(isFiveMinuteMark, isDynamic);
    const extrudeSettings = {
        steps: 1,
        depth: CONSTANTS.SIZES.INDICATOR_HEIGHT / 2,
        bevelEnabled: true,
        bevelThickness: CONSTANTS.SIZES.INDICATOR_BEVEL_THICKNESS,
        bevelSize: isDynamic 
            ? scaleValue(CONSTANTS.SIZES.INDICATOR_BEVEL_SIZE)
            : CONSTANTS.SIZES.INDICATOR_BEVEL_SIZE,
        bevelSegments: 1
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}
