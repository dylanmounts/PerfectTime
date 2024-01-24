
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
    shape.lineTo(-0.2 * scale, 0);
    shape.lineTo(0, SIZES.CLOCK_RADIUS * 5/8 * lengthScale);
    shape.lineTo(0.2 * scale, 0);
    shape.lineTo(0, -0.3 * scale);
    return shape;
};

// Shape for the minute hand of the clock
export const minuteHandShape = (scale = 1) => {
    const lengthScale = scale === 1 ? scale : 0.995;
    const tipLength = SIZES.CLOCK_RADIUS * 23/24 * lengthScale;
    const tipWidth = 0.036 * scale;
    const triangleHeight = tipWidth * 2;

    const shape = new THREE.Shape();
    shape.moveTo(0, -0.3 * scale);
    shape.lineTo(-0.15 * scale, 0);

    // Start of triangle base
    shape.lineTo(-tipWidth, tipLength - triangleHeight);

    // Triangle tip
    shape.lineTo(0, tipLength); // Point of the triangle
    shape.lineTo(tipWidth, tipLength - triangleHeight);

    // End of triangle base and back to the start
    shape.lineTo(0.15 * scale, 0);
    shape.lineTo(0, -0.3 * scale);
    return shape;
};

// Shape for the second hand of the clock.
export const secondHandShape = (scale = 1) => {
    const lengthScale = scale === 1 ? scale : 0.995;
    const tipLength = SIZES.CLOCK_RADIUS * 23/24 * lengthScale;
    const tipWidth = 0.01 * scale;
    const triangleHeight = tipWidth * 2;

    const shape = new THREE.Shape();
    shape.moveTo(0, -0.1 * scale);
    shape.lineTo(-0.04 * scale, 0);

    // Start of triangle base
    shape.lineTo(-tipWidth, tipLength - triangleHeight);

    // Triangle tip
    shape.lineTo(0, tipLength); // Point of the triangle
    shape.lineTo(tipWidth, tipLength - triangleHeight);

    // End of triangle base and back to the start
    shape.lineTo(0.04 * scale, 0);
    shape.lineTo(0, -0.1 * scale);

    return shape;
};

/**
 * Creates the clock hands for the perfect clock.
 * 
 * @param {number} tipWidth - Width of the tip of the clock hand.
 * @param {number} baseWidth - Width of the base of the clock hand.
 * @param {number} baseOffset - Offset of the base of the clock hand from the clock's center.
 * @param {number} handLength - Proportional length of the clock hand relative to the clock's radius.
 * @param {number} [scale=1] - Optional scaling factor to adjust the overall size of the clock hand.
 * @returns {THREE.Shape} A THREE.Shape object representing the clock hand.
 */
export const createClockHand = (tipWidth, baseWidth, baseOffset, handLength, scale = 1) => {
    const lengthScale = scale === 1 ? scale : 0.9925;
    baseWidth = baseWidth * scale;
    baseOffset = baseOffset * scale;
    const tipLength = SIZES.CLOCK_RADIUS * handLength * lengthScale;
    tipWidth = tipWidth * scale;
    const triangleHeight = tipWidth * 2;

    const shape = new THREE.Shape();
    shape.moveTo(0, -baseOffset);
    shape.lineTo(-baseWidth / 2, 0);

    // Start of triangle base
    shape.lineTo(-tipWidth, tipLength - triangleHeight);

    // Triangle tip
    shape.lineTo(0, tipLength); // Point of the triangle
    shape.lineTo(tipWidth, tipLength - triangleHeight);

    // End of triangle base and back to the start
    shape.lineTo(baseWidth / 2, 0);
    shape.lineTo(0, -baseOffset);

    return shape;
};
