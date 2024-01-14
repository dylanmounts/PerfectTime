import * as THREE from 'three';

import { COLORS } from '../constants.js';


const clockBezel = new THREE.MeshPhongMaterial({ color: COLORS.CLOCK_BEZEL });
const clockFace = new THREE.MeshPhongMaterial({ color: COLORS.CLOCK_FACE });
const complicationFrame = new THREE.MeshPhongMaterial({ color: COLORS.CLOCK_BEZEL });
const dayDate = new THREE.MeshPhongMaterial({ color: COLORS.HOUR_NUMBERS });
const dayDateBox = new THREE.MeshPhongMaterial({ color: COLORS.DAY_DATE_BOX });
const hourHand = new THREE.MeshPhongMaterial({ color: COLORS.HOUR_HAND });
const hourNumber = new THREE.MeshPhongMaterial({ color: COLORS.HOUR_NUMBERS });
const indicator = new THREE.MeshPhongMaterial({ color: COLORS.INDICATORS });
const minuteHand = new THREE.MeshPhongMaterial({ color: COLORS.MINUTE_HAND });
const minuteNumber = new THREE.MeshPhongMaterial({ color: COLORS.MINUTE_NUMBERS });
const post = new THREE.MeshPhongMaterial({ color: COLORS.POST });
const secondHand = new THREE.MeshPhongMaterial({ color: COLORS.SECOND_HAND });

export const MATERIALS = {
    clockBezel,
    clockFace,
    complicationFrame,
    dayDate,
    dayDateBox,
    hourHand,
    hourNumber,
    indicator,
    minuteHand,
    minuteNumber,
    post,
    secondHand,
};
