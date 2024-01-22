
/**
 * shapes.js - Defines shapes for the perfect clock.
 */

import * as THREE from 'three';

import { SIZES } from '../constants.js';


// Shape for the hour hand of the clock
export const hourHandShape = (scale = 1) => {
    const lengthScale = scale != 1 ? scale * 1.25 : scale;
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.3 * scale);
    shape.lineTo(-0.175 * scale, 0);
    shape.lineTo(0, SIZES.CLOCK_RADIUS * 5/8 * lengthScale);
    shape.lineTo(0.175 * scale, 0);
    shape.lineTo(0, -0.3 * scale);
    return shape;
};

// Shape for the minute hand of the clock
export const minuteHandShape = (scale = 1) => {
    const lengthScale = scale != 1 ? scale * 1.25 : scale;
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.2 * scale);
    shape.lineTo(-0.15 * scale, 0);
    shape.lineTo(0, SIZES.CLOCK_RADIUS * 23/24 * lengthScale);
    shape.lineTo(0.15 * scale, 0);
    shape.lineTo(0, -0.2 * scale);
    return shape;
};

// Shape for the second hand of the clock.
export const secondHandShape = (scale = 1) => {
    const lengthScale = scale != 1 ? scale * 1.25 : scale;
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.1 * scale);
    shape.lineTo(-0.05 * scale, 0);
    shape.lineTo(0, SIZES.CLOCK_RADIUS * 23/24 * lengthScale);
    shape.lineTo(0.05 * scale, 0);
    shape.lineTo(0, -0.1 * scale);
    return shape;
};
