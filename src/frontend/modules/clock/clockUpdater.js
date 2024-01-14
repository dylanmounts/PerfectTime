import { monoFontManager } from '../managers/font_manager.js';
import { createDayDateMesh, MESHES } from '../visuals/meshes.js';
import { timeManager } from '../managers/timeManager.js';
import { createDayDateGeometry } from '../visuals/geometries.js';

let lastHour = null;

export function updateClock(scene) {
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

    if (hours !== lastHour) {
        const font = monoFontManager.getLoadedFont();
        if (font) {
            updateDayDateDisplay(scene, font);
            lastHour = hours;
        }
    }
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
    }

    // Create mesh for day and date
    const dayDateMesh = createDayDateMesh(dayDateGeometry);
    dayDateMesh.name = 'dayDateDisplay';

    // Position inside the existing Day/Date box
    dayDateMesh.position.x = MESHES.dayDateBox.position.x;
    dayDateMesh.position.y = MESHES.dayDateBox.position.y;
    dayDateMesh.position.z = MESHES.dayDateBox.position.z + 0.01;

    // Add to the scene
    scene.add(dayDateMesh);
}
