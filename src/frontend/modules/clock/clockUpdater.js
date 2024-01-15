import { DAY_DATE_PARTS, DIGITAL_DISPLAY_PARTS } from '../constants.js';
import { createDayDateMesh, createDigitalDisplayMesh, MESHES } from '../visuals/meshes.js';
import { timeManager } from '../managers/timeManager.js';
import { createDayDateGeometry, createDigitalTimeGeometry } from '../visuals/geometries.js';


let dayDateExists = true;
let digitalDisplayExists = true;

export function updateClock(scene, monoFont) {
    const date = timeManager.getCurrentTime();
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    const hourAngle = calculateHourAngle(hours, minutes, seconds, milliseconds);
    const minuteAngle = calculateMinuteAngle(minutes, seconds, milliseconds);
    const secondAngle = calculateSecondAngle(seconds, milliseconds);

    MESHES.hourHand.rotation.z = -hourAngle;
    MESHES.minuteHand.rotation.z = -minuteAngle;
    MESHES.secondHand.rotation.z = -secondAngle;

    updateDigitalDisplay(scene, monoFont);
    updateDayDateDisplay(scene, monoFont);
}

function calculateHourAngle(hours, minutes, seconds, milliseconds) {
    return (Math.PI / 6) * hours + 
           (Math.PI / 360) * minutes + 
           (Math.PI / 21600) * seconds + 
           (Math.PI / 21600000) * milliseconds;
}

function calculateMinuteAngle(minutes, seconds, milliseconds) {
    return (Math.PI / 30) * minutes + 
           (Math.PI / 1800) * seconds + 
           (Math.PI / 1800000) * milliseconds;
}

function calculateSecondAngle(seconds, milliseconds) {
    return (Math.PI / 30) * seconds + 
           (Math.PI / 30000) * milliseconds;
}

export function updateDayDateDisplay(scene, font) {
    // Get current date
    const now = timeManager.getCurrentTime();
    const day = now.toLocaleString('en-US', { weekday: 'short' });
    const date = now.toLocaleString('en-US', { month: 'short', day: 'numeric' });

    // Combine day and date
    const dayDateStr = `${day.toUpperCase()} ${date}`;

    // Create text geometry for day and date
    const dayDateGeometry = createDayDateGeometry(dayDateStr, font);
    dayDateGeometry.center();

    // Remove previous day/date display if it exists
    if (scene.getObjectByName('dayDateDisplay')) {
        const prevDayDateDisplay = scene.getObjectByName('dayDateDisplay');
        scene.remove(prevDayDateDisplay);

        for (const part of DAY_DATE_PARTS) {
            const prevPart = scene.getObjectByName(part);
            scene.remove(prevPart);
        }
    }

    // Create mesh for day and date
    const dayDateMesh = createDayDateMesh(dayDateGeometry);
    dayDateMesh.name = 'dayDateDisplay';

    // Position inside the existing Day/Date box
    dayDateMesh.position.x = MESHES.dayDateBox.position.x;
    dayDateMesh.position.y = MESHES.dayDateBox.position.y;
    dayDateMesh.position.z = MESHES.dayDateBox.position.z + 0.01;

    // Add to the scene
    if (dayDateExists) {
        scene.add(dayDateMesh);

        for (const part of DAY_DATE_PARTS) {
            scene.add(MESHES[part]);
        }
    }
}

export function toggleDayDate(isChecked) {
    dayDateExists = isChecked;
}

export function updateDigitalDisplay(scene, font) {
    const currentTime = timeManager.getCurrentTime();
    const digitalTimeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const digitalTimeGeometry = createDigitalTimeGeometry(digitalTimeStr, font);
    digitalTimeGeometry.center()
    
    if (scene.getObjectByName('digitalDisplay')) {
        const prevDisplay = scene.getObjectByName('digitalDisplay');
        scene.remove(prevDisplay);

        for (const part of DIGITAL_DISPLAY_PARTS) {
            const prevPart = scene.getObjectByName(part);
            scene.remove(prevPart);
        }
    }

    const digitalDisplayMesh = createDigitalDisplayMesh(digitalTimeGeometry);
    digitalDisplayMesh.name = 'digitalDisplay';

    digitalDisplayMesh.position.x = Math.sin(0) * 5.0 * 1/3;
    digitalDisplayMesh.position.y = Math.cos(0) * 5.0 * 1/3;
    digitalDisplayMesh.position.z = 0 + 0.01;

    if (digitalDisplayExists) {
        scene.add(digitalDisplayMesh);

        for (const part of DIGITAL_DISPLAY_PARTS) {
            scene.add(MESHES[part]);
        }
    }
}

export function toggleDigitalDisplay(isChecked) {
    digitalDisplayExists = isChecked;
}
