/**
 * materials.js - Defines various materials for the perfect clock.
 *
 */


import * as THREE from 'three';

import { getCurrentScheme } from '../managers/colorManager';

export let MATERIALS;

const buildMaterials = () => {
    const COLORS = getCurrentScheme();
    const materials = {
        backdrop: new THREE.MeshPhongMaterial({ color: COLORS.BACKDROP }),
        clockBezel: new THREE.MeshPhongMaterial({ color: COLORS.CLOCK_BEZEL }),
        clockFace: new THREE.MeshPhongMaterial({ color: COLORS.CLOCK_FACE }),
        complicationFrame: new THREE.MeshPhongMaterial({ color: COLORS.COMPLICATION_FRAME }),
        dayDate: new THREE.MeshPhongMaterial({ color: COLORS.COMPLICATION_NUMBERS }),
        dayDateBox: new THREE.MeshPhongMaterial({ color: COLORS.DAY_DATE_BOX }),
        digitalDisplay: new THREE.MeshPhongMaterial({ color: COLORS.COMPLICATION_NUMBERS }),
        digitalDisplayBox: new THREE.MeshPhongMaterial({ color: COLORS.DIGITAL_DISPLAY_BOX }),
        hourHand: new THREE.MeshPhongMaterial({ color: COLORS.HOUR_HAND }),
        outerHourHand: new THREE.MeshPhongMaterial({ color: COLORS.OUTER_HOUR_HAND }),
        hourNumber: new THREE.MeshPhongMaterial({ color: COLORS.HOUR_NUMBERS }),
        outerHourNumber: new THREE.MeshPhongMaterial({ color: COLORS.OUTER_HOUR_NUMBERS }),
        indicator: new THREE.MeshPhongMaterial({ color: COLORS.INDICATORS }),
        outerIndicator: new THREE.MeshPhongMaterial({ color: COLORS.OUTER_INDICATOR }),
        minuteHand: new THREE.MeshPhongMaterial({ color: COLORS.MINUTE_HAND }),
        outerMinuteHand: new THREE.MeshPhongMaterial({ color: COLORS.OUTER_MINUTE_HAND }),
        minuteNumber: new THREE.MeshPhongMaterial({ color: COLORS.MINUTE_NUMBERS }),
        outerMinuteNumber: new THREE.MeshPhongMaterial({ color: COLORS.OUTER_MINUTE_NUMBERS }),
        post: new THREE.MeshPhongMaterial({ color: COLORS.POST }),
        secondHand: new THREE.MeshPhongMaterial({ color: COLORS.SECOND_HAND }),
        outerSecondHand: new THREE.MeshPhongMaterial({ color: COLORS.OUTER_SECOND_HAND }),
    };

    MATERIALS = materials;
}
buildMaterials();

export const rebuildMaterials = () => {
    Object.keys(MATERIALS).forEach(materialKey => {
        MATERIALS[materialKey].dispose();
    });
    buildMaterials();
}
