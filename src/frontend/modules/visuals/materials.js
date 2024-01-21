/**
 * materials.js - Defines various materials for the perfect clock.
 *
 */


import * as THREE from 'three';

import { COLORS } from '../constants.js';


const clockBezel = new THREE.MeshPhongMaterial({ color: COLORS.CLOCK_BEZEL });
const clockFace = new THREE.MeshPhongMaterial({ color: COLORS.CLOCK_FACE });
const complicationFrame = new THREE.MeshPhongMaterial({ color: COLORS.COMPLICATION_FRAME });
const dayDate = new THREE.MeshPhongMaterial({ color: COLORS.COMPLICATION_NUMBERS });
const dayDateBox = new THREE.MeshPhongMaterial({ color: COLORS.DAY_DATE_BOX });
const digitalDisplay = new THREE.MeshPhongMaterial({ color: COLORS.COMPLICATION_NUMBERS });
const digitalDisplayBox = new THREE.MeshPhongMaterial({ color: COLORS.DIGITAL_DISPLAY_BOX });
const hourHand = new THREE.MeshPhongMaterial({ color: COLORS.HOUR_HAND });
const outerHourHand = new THREE.MeshPhongMaterial({ color: COLORS.OUTER_HOUR_HAND });
const hourNumber = new THREE.MeshPhongMaterial({ color: COLORS.HOUR_NUMBERS });
const outerHourNumber = new THREE.MeshPhongMaterial({ color: COLORS.OUTER_HOUR_NUMBERS });
const indicator = new THREE.MeshPhongMaterial({ color: COLORS.INDICATORS });
const outerIndicator = new THREE.MeshPhongMaterial({ color: COLORS.OUTER_INDICATOR });
const minuteHand = new THREE.MeshPhongMaterial({ color: COLORS.MINUTE_HAND });
const outerMinuteHand = new THREE.MeshPhongMaterial({ color: COLORS.OUTER_MINUTE_HAND });
const minuteNumber = new THREE.MeshPhongMaterial({ color: COLORS.MINUTE_NUMBERS });
const post = new THREE.MeshPhongMaterial({ color: COLORS.POST });
const secondHand = new THREE.MeshPhongMaterial({ color: COLORS.SECOND_HAND });
const outerSecondHand = new THREE.MeshPhongMaterial({ color: COLORS.OUTER_SECOND_HAND });

export const MATERIALS = {
    clockBezel,
    clockFace,
    complicationFrame,
    dayDate,
    dayDateBox,
    digitalDisplay,
    digitalDisplayBox,
    hourHand,
    outerHourHand,
    hourNumber,
    outerHourNumber,
    indicator,
    outerIndicator,
    minuteHand,
    minuteNumber,
    outerMinuteHand,
    post,
    secondHand,
    outerSecondHand,
};
