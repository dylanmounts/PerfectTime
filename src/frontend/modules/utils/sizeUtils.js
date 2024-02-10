/**
 * sizeUtils.js - Utility functions for handling dynamic sizes in different aspect ratios.
 */

import * as sceneManager from "../managers/sceneManager";
import { SIZES } from "../constants";


// Function to scale values based on dynamicClockRatio
export function scaleValue(value) {
    return sceneManager.dynamicClockRatio < 1
        ? value * sceneManager.dynamicClockRatio
        : value / sceneManager.dynamicClockRatio;
}

/**
 * Calculates the shortest distance from the center to the edge of the dynamic clock along a given angle.
 * This accounts for adjustments due to the bezel radius, ensuring accurate placement within the clock face.
 * 
 * @param {number} angle - Angle in radians for which to calculate the distance.
 * @returns {number} Distance to the edge from the center along the specified angle.
 */
export function distanceToEdge(angle) {
    const adjustedWidth = sceneManager.dynamicClockWidth - SIZES.BEZEL_RADIUS;
    const adjustedHeight = sceneManager.dynamicClockHeight - SIZES.BEZEL_RADIUS;
  
    const halfWidth = adjustedWidth / 2;
    const halfHeight = adjustedHeight / 2;
  
    const absSin = Math.abs(Math.sin(angle));
    const absCos = Math.abs(Math.cos(angle));

    const distance = Math.min(halfWidth / absSin, halfHeight / absCos);

    return distance;
}