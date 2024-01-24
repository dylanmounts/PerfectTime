
/**
 * shapes.js - Defines shapes for the perfect clock.
 */

import * as THREE from 'three';

import { SIZES } from '../constants.js';


/**
 * Creates the clock hands for the perfect clock.
 * 
 * @param {number} tipWidth - Width of the tip of the clock hand.
 * @param {number} baseWidth - Width of the base of the clock hand.
 * @param {number} baseOffset - Offset of the base of the clock hand from the clock's center.
 * @param {number} handLengthRatio - Proportional length of the clock hand relative to the clock's radius.
 * @param {number} [scale=1] - Optional scaling factor to adjust the overall size of the clock hand.
 * @returns {THREE.Shape} A THREE.Shape object representing the clock hand.
 */
export const createClockHand = (tipWidth, baseWidth, baseOffset, handLengthRatio, scale = 1) => {
    const lengthScale = scale === 1 ? scale : SIZES.OUTER_HAND_LENGTH_SCALE;
    const handLength = SIZES.CLOCK_RADIUS * handLengthRatio * lengthScale;
    const triangleHeight = tipWidth * 3;

    baseWidth = baseWidth * scale;
    baseOffset = baseOffset * scale;
    tipWidth = tipWidth * scale;

    const shape = new THREE.Shape();
    shape.moveTo(0, -baseOffset);
    shape.lineTo(-baseWidth / 2, 0);

    // Start of triangle base
    shape.lineTo(-tipWidth, handLength - triangleHeight);

    // Triangle tip
    shape.lineTo(0, handLength); // Point of the triangle
    shape.lineTo(tipWidth, handLength - triangleHeight);

    // End of triangle base and back to the start
    shape.lineTo(baseWidth / 2, 0);
    shape.lineTo(0, -baseOffset);

    return shape;
};
