
/**
 * shapes.js - Defines shapes for the perfect clock.
 */

import * as THREE from 'three';

import { SIZES } from '../constants.js';
import { scaleValue } from '../utils/uiUtils.js';


/**
 * Calculates the length of a clock hand.
 * 
 * @param {number} handLengthRatio - Proportional length of the clock hand relative to the clock's radius.
 * @param {number} scale - Scaling factor to adjust the overall size of the clock hand.
 * @returns {number} Length of the clock hand.
 */
export const calculateHandLength = (handLengthRatio, scale) => {
    const scaledClockRadius = SIZES.CLOCK_RADIUS * handLengthRatio;
    const piScaledIndicatorHeight = SIZES.MINUTE_HAND_TIP_WIDTH * SIZES.MINUTE_HAND_SCALE * Math.PI
    const bevelScaledIndicatorHeight = piScaledIndicatorHeight - SIZES.INDICATOR_BEVEL_SIZE / 1.25
    const lengthScale = scale === 1 ? 0 : SIZES.INDICATOR_BEVEL_SIZE;
    return scaledClockRadius + bevelScaledIndicatorHeight - lengthScale;
};

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
    const handLength = calculateHandLength(handLengthRatio, scale);
    const triangleHeight = tipWidth * Math.PI;

    baseWidth *= scale;
    baseOffset *= scale;
    tipWidth *= scale;

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

/**
 * Creates the indicators for the perfect clock.
 * 
 * @param {boolean} isFiveMinuteMark - Indicates if the indicator is for a five-minute mark.
 */
export const createIndicator = (isFiveMinuteMark) => {
    const scaledTipWidth = SIZES.MINUTE_HAND_TIP_WIDTH * 2 * SIZES.MINUTE_HAND_SCALE;
    const piScaledTipWidth = SIZES.MINUTE_HAND_TIP_WIDTH * Math.PI * SIZES.MINUTE_HAND_SCALE;
    
    let stubWidth, baseWidth, indicatorHeight;
    
    if (isFiveMinuteMark) {
        stubWidth = scaleValue(scaledTipWidth);
        baseWidth = stubWidth * 2;
        indicatorHeight = scaleValue(piScaledTipWidth * 2);
    } else {
        baseWidth = scaleValue(scaledTipWidth);
        stubWidth = baseWidth * 0.5;
        indicatorHeight = scaleValue(piScaledTipWidth);
    }

    const shape = new THREE.Shape();
    shape.moveTo(-baseWidth / 2, 0);
    shape.lineTo(-stubWidth / 2, -indicatorHeight);
    shape.lineTo(stubWidth / 2, -indicatorHeight);
    shape.lineTo(baseWidth / 2, 0);
    shape.closePath();

    return shape;
}