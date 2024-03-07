
/**
 * shapes.js - Defines shapes for the perfect clock.
 */

import * as THREE from 'three';

import { SIZES } from '../constants.js';
import { scaleValue } from '../utils/sizeUtils.js';


/**
 * Adjusts the initial length of a clock hand.
 * 
 * @param {number} initialLength - The initial length of the clock hand before adjustment.
 * @param {number} scale - Scaling factor to further adjust the hand's length.
 * @returns {number} The adjusted length of the clock hand.
 */
export const adjustHandLength = (initialLength, scale) => {
    const scaledBevel = scaleValue(SIZES.INDICATOR_BEVEL_SIZE)
    const lengthScale = scale === 1 ? 0 : scaledBevel + (scaledBevel / initialLength);
    return initialLength - lengthScale;
}

/**
 * Creates the clock hands for the perfect clock.
 * 
 * @param {number} tipWidth - Width of the tip of the clock hand.
 * @param {number} baseWidth - Width of the base of the clock hand.
 * @param {number} baseOffset - Offset of the base of the clock hand from the clock's center.
 * @param {number} handLength - Length of the clock hand.
 * @param {number} [scale=1] - Optional scaling factor to adjust the overall size of the clock hand.
 * @param {boolean} [isDynamic=true] - Optional parameter to specify if clock is currently dynamic.
 * @returns {THREE.Shape} A THREE.Shape object representing the clock hand.
 */
export const createClockHand = (tipWidth, baseWidth, baseOffset, handLength, scale = 1, isDynamic = true) => {
    const adjustedLength = adjustHandLength(handLength, scale);
    const tipHeight = (tipWidth === SIZES.SECOND_HAND_TIP_WIDTH) 
        ? SIZES.SECOND_HAND_TIP_WIDTH * Math.PI
        : SIZES.MINUTE_HAND_TIP_WIDTH * Math.PI;
    const shape = new THREE.Shape();

    baseWidth = isDynamic
        ? scaleValue(baseWidth * scale)
        : baseWidth * scale;
    tipWidth = isDynamic
        ? scaleValue(tipWidth * scale)
        : tipWidth * scale;
    baseOffset *= scale

    shape.moveTo(0, -baseOffset);
    shape.lineTo(-baseWidth / 2, 0);

    // Start of triangle base
    shape.lineTo(-tipWidth, adjustedLength - tipHeight);

    // Triangle tip
    shape.lineTo(0, adjustedLength); // Point of the triangle
    shape.lineTo(tipWidth, adjustedLength - tipHeight);

    // End of triangle base and back to the start
    shape.lineTo(baseWidth / 2, 0);
    shape.lineTo(0, -baseOffset);

    return shape;
};

/**
 * Creates the indicators for the perfect clock.
 * 
 * @param {boolean} isFiveMinuteMark - Indicates if the indicator is for a five-minute mark.
 * @param {boolean} [isDynamic=true] - Optional parameter to specify if clock is currently dynamic.
 */
export const createIndicator = (isFiveMinuteMark, isDynamic = true) => {
    const scaledTipWidth = SIZES.MINUTE_HAND_TIP_WIDTH * 2 * SIZES.MINUTE_HAND_SCALE;
    const piScaledTipWidth = SIZES.MINUTE_HAND_TIP_WIDTH * Math.PI * SIZES.MINUTE_HAND_SCALE;
    
    let stubWidth, baseWidth, indicatorHeight;
    
    if (isFiveMinuteMark) {
        stubWidth = isDynamic ? scaleValue(scaledTipWidth) : scaledTipWidth;
        baseWidth = stubWidth * 2;
        indicatorHeight = isDynamic ? scaleValue(piScaledTipWidth * 2) : piScaledTipWidth * 2;
    } else {
        baseWidth = isDynamic ? scaleValue(scaledTipWidth) : scaledTipWidth;
        stubWidth = baseWidth * 0.5;
        indicatorHeight = isDynamic ? scaleValue(piScaledTipWidth) : piScaledTipWidth;
    }

    const shape = new THREE.Shape();
    shape.moveTo(-baseWidth / 2, 0);
    shape.lineTo(-stubWidth / 2, -indicatorHeight);
    shape.lineTo(stubWidth / 2, -indicatorHeight);
    shape.lineTo(baseWidth / 2, 0);
    shape.closePath();

    return shape;
}


// Creates the rounded box for containing the complication text.
export const createComplicationBox = (width, height, radius = 0.014) => {
    const shape = new THREE.Shape();

    shape.moveTo(0, radius);

    // Top left corner
    shape.absarc(radius, radius, radius, Math.PI, Math.PI * 1.5, false);

    // Top side
    shape.lineTo(width - radius, 0);

    // Top right corner
    shape.absarc(width - radius, radius, radius, Math.PI * 1.5, 0, false);

    // Right side
    shape.lineTo(width, height - radius);

    // Bottom right corner
    shape.absarc(width - radius, height - radius, radius, 0, Math.PI / 2, false);

    // Bottom side
    shape.lineTo(radius, height);

    // Bottom left corner
    shape.absarc(radius, height - radius, radius, Math.PI / 2, Math.PI, false);

    return shape;
}