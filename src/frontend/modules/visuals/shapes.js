
/**
 * shapes.js - Defines shapes for the perfect clock.
 */

import * as THREE from 'three';

import { SIZES } from '../constants.js';


// Shape for the hour hand of the clock.
export const hourHandShape = () => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.3);
    shape.lineTo(-0.15, 0);
    shape.lineTo(0, SIZES.CLOCK_RADIUS * 5/8);
    shape.lineTo(0.15, 0);
    shape.lineTo(0, -0.3);
    return shape;
};

// Shape for the minute hand of the clock.
export const minuteHandShape = () => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.2);
    shape.lineTo(-0.1, 0);
    shape.lineTo(0, SIZES.CLOCK_RADIUS * 9/10);
    shape.lineTo(0.1, 0);
    shape.lineTo(0, -0.2);
    return shape;
};

// Shape for the second hand of the clock.
export const secondHandShape = () => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.1);
    shape.lineTo(-0.05, 0);
    shape.lineTo(0, SIZES.CLOCK_RADIUS * 23/24);
    shape.lineTo(0.05, 0);
    shape.lineTo(0, -0.1);
    return shape;
};
