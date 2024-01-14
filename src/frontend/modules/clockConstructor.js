import * as THREE from 'three';

import { updateDayDateDisplay } from './clockUpdater.js';
import { SEGMENTS, SIZES } from './constants.js';
import { fontManager } from './font_manager.js';
import { createHourGeometry, createMinuteGeometry } from './geometries.js';
import { MATERIALS } from './materials.js';
import { createHourMesh, createMinuteMesh, MESHES } from './meshes.js';


function createNumbers(scene, font) {
    for (let i = 1; i <= 12; i++) {
        if (i === 3) {
            continue;
        }
        const angle = (Math.PI / 6) * i;

        // Hours
        const hourGeometry = createHourGeometry(i, font);
        hourGeometry.center();

        const hourMesh = createHourMesh(hourGeometry)
        const distanceFromCenter = SIZES.CLOCK_RADIUS * 5/6;
        hourMesh.position.x = Math.sin(angle) * distanceFromCenter;
        hourMesh.position.y = Math.cos(angle) * distanceFromCenter;
        hourMesh.position.z = 0;

        scene.add(hourMesh);

        // Minutes
        const minuteNumber = i * 5;

        const minuteGeometry = createMinuteGeometry(minuteNumber, font);
        minuteGeometry.center();

        const minuteMesh = createMinuteMesh(minuteGeometry)
        const minuteDistanceFromCenter = SIZES.CLOCK_RADIUS * 2/3;
        minuteMesh.position.x = Math.sin(angle) * minuteDistanceFromCenter;
        minuteMesh.position.y = Math.cos(angle) * minuteDistanceFromCenter;
        minuteMesh.position.z = 0;

        scene.add(minuteMesh);
    }
}

function createIndicators(scene) {
    const regularIndicatorRadius = SIZES.INDICATOR_RADIUS * 1/2;
    const largeIndicatorRadius = SIZES.INDICATOR_RADIUS;

    const regularIndicatorHeight = SIZES.INDICATOR_HEIGHT * 2/3;
    const largeIndicatorHeight = SIZES.INDICATOR_HEIGHT;

    const distanceFromCenter = SIZES.CLOCK_RADIUS * 23/24;

    for (let i = 0; i < 60; i++) {
        if (i === 15) {
            continue;
        }
        const isFiveMinuteMark = i % 5 === 0;
        const indicatorRadius = isFiveMinuteMark ? largeIndicatorRadius : regularIndicatorRadius;
        const indicatorHeight = isFiveMinuteMark ? largeIndicatorHeight : regularIndicatorHeight;

        const indicatorGeometry = new THREE.CylinderGeometry(indicatorRadius, indicatorRadius, indicatorHeight, SEGMENTS / 8);

        const angle = (Math.PI / 30) * i;

        const indicator = new THREE.Mesh(indicatorGeometry, MATERIALS.indicator);
        indicator.rotation.x = Math.PI / 2;

        indicator.position.x = Math.sin(angle) * distanceFromCenter;
        indicator.position.y = Math.cos(angle) * distanceFromCenter;
        indicator.position.z = 0;

        scene.add(indicator);
    }
}

export async function addClock(scene) {
    fontManager.loadFont('fonts/droid/droid_sans_regular.typeface.json', (font) => {
        createNumbers(scene, font);
        updateDayDateDisplay(scene, font);
    });
    createIndicators(scene);

    for (const mesh in MESHES) {
        scene.add(MESHES[mesh])
    }
}
