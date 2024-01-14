
import * as THREE from 'three';

import { SIZES } from '../constants.js';


export const hourHandShape = () => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.3);
    shape.lineTo(-0.15, 0);
    shape.lineTo(0, SIZES.CLOCK_RADIUS * 5/8);
    shape.lineTo(0.15, 0);
    shape.lineTo(0, -0.3);
    return shape;
};

export const minuteHandShape = () => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.2);
    shape.lineTo(-0.1, 0);
    shape.lineTo(0, SIZES.CLOCK_RADIUS * 9/10);
    shape.lineTo(0.1, 0);
    shape.lineTo(0, -0.2);
    return shape;
};

export const secondHandShape = () => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.1);
    shape.lineTo(-0.05, 0);
    shape.lineTo(0, SIZES.CLOCK_RADIUS * 23/24);
    shape.lineTo(0.05, 0);
    shape.lineTo(0, -0.1);
    return shape;
};
