/**
 * clockUpdater.js - Updates and manages the perfect clock's dynamic elements.
 *
 * This module contains functions to update the clock's hands, indicators, numbers,
 * and digital displays based on the current time.
 * 
 * TODO: Refactor module to reduce complexity and improve maintainability. There's
 *       just too much going on here. Probably ought to break out each clock element
 *       into its own updater or controller.
 */

import * as THREE from 'three';

import * as constantsJs from '../constants.js';
import * as meshesJs from '../visuals/meshes.js';
import { dynamicClockRatio, updateCameraSlider } from '../managers/sceneManager.js';
import { timeManager } from '../managers/timeManager.js';
import * as geometriesJs from '../visuals/geometries.js';
import { distanceToEdge, scaleValue } from '../utils/sizeUtils.js';


// State variables for the visibility of clock components.
let dayDateExists = document.getElementById('dayDateOption').checked;
let digitalDisplayExists = document.getElementById('digitalTimeOption').checked;
let hourIndicatorsExist = document.getElementById('hourIndicatorsOption').checked;
let hourNumbersExist = document.getElementById('hoursOption').checked;
let hourHandExists = document.getElementById('hourHandOption').checked;
let minuteIndicatorsExist = document.getElementById('minuteIndicatorsOption').checked;
let minuteNumbersExist = document.getElementById('minutesOption').checked;
let minuteHandExists = document.getElementById('minuteHandOption').checked;
let secondHandExists = document.getElementById('secondHandOption').checked;
let sweepingSeconds = document.getElementById('sweepingSecondsOption').checked;

// State variables for tracking the perfect time and its displays.
let currentTime = null;
let lastTime = new Date;
let lastSecond = null;
let lastDayDate = null;
let lastDayDateExists = null;
let lastDigitalDisplayExists = null;
let lastLanguage = null;
let language = 'en-US';
let lastTimeFormat = null;
let useTwentyFourHour = false;
let minuteHandLength = null;
let resizeHandled = false;

/**
 * Main function to update the clock based on the current time retrieved from the
 * backend time server.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} digitalFont - The font used for the digital display
 * @param {Object} dayDateFont - The font used for the day/date display
 */
export function updateClock(scene, digitalFont, dayDateFont) {
    currentTime = timeManager.getCurrentTime();

    if (!currentTime) {
        return;
    }

    // Reset the perfect time if the last times retrieved are off by more
    // than 10 seconds
    if (Math.abs(currentTime - lastTime) > 1000 * 10) {
        timeManager.fetchPerfectTime()
    }

    lastTime = currentTime;

    const hours = currentTime.getHours() % 12;
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const milliseconds = currentTime.getMilliseconds();

    const hourAngle = sweepingSeconds 
        ? calculateSweepingHourAngle(hours, minutes, seconds, milliseconds)
        : calculateHourAngle(hours, minutes, seconds);
    const minuteAngle = sweepingSeconds 
        ? calculateSweepingMinuteAngle(minutes, seconds, milliseconds)
        : calculateMinuteAngle(minutes, seconds);
    const secondAngle = sweepingSeconds 
        ? calculateSweepingSecondAngle(seconds, milliseconds)
        : calculateSecondAngle(seconds);

    updateLanguage();
    updateTimeFormat();
    updateCameraSlider();
    updateTimeOffset();
    updateDigitalDisplay(scene, digitalFont);
    updateDayDateDisplay(scene, dayDateFont);
    updateIndicators(scene);
    updateNumbers(scene);
    updateSecondHand(scene, secondAngle);
    updateMinuteHand(scene, minuteAngle);
    updateHourHand(scene, hourAngle);

    resizeHandled = true;
}

// Helper functions for calculating clock hand angles
function calculateHourAngle(hours, minutes, seconds) {
    return (Math.PI / 6) * hours + 
           (Math.PI / 360) * minutes + 
           (Math.PI / 21600) * seconds
}

function calculateMinuteAngle(minutes, seconds) {
    return (Math.PI / 30) * minutes + 
           (Math.PI / 1800) * seconds
}

function calculateSecondAngle(seconds) {
    return (Math.PI / 30) * seconds;
}

function calculateSweepingHourAngle(hours, minutes, seconds, milliseconds) {
    return (Math.PI / 6) * hours + 
           (Math.PI / 360) * minutes + 
           (Math.PI / 21600) * seconds + 
           (Math.PI / 21600000) * milliseconds;
}

function calculateSweepingMinuteAngle(minutes, seconds, milliseconds) {
    return (Math.PI / 30) * minutes + 
           (Math.PI / 1800) * seconds + 
           (Math.PI / 1800000) * milliseconds;
}

function calculateSweepingSecondAngle(seconds, milliseconds) {
    return (Math.PI / 30) * seconds + 
           (Math.PI / 30000) * milliseconds;
}

/**
 * Updates the day/date display on the perfect clock.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} font - The font used for the day-date display.
 */
export function updateDayDateDisplay(scene, font) {
    if (!currentTime) {
        return;
    }

    const day = currentTime.toLocaleString(language, { weekday: 'short' }).toUpperCase();
    const month = currentTime.toLocaleString(language, { month: 'short' });
    const date = currentTime.toLocaleString(language, { day: 'numeric' });
    const dayDateStr = `\u007C\u200B${day.toUpperCase()} ${month} ${date}\u200B\u007C`;

    const shouldUpdate = (
        (dayDateStr !== lastDayDate || dayDateExists !== lastDayDateExists)
            || !resizeHandled
    );

    if (!shouldUpdate) {
        return;
    }

    meshesJs.removeMeshByName(scene, 'dayDateDisplay');

    // If the Date/Date isn't showing, we don't need to update it
    // TODO: Certainly don't need this anymore.
    if (!dayDateExists) {
        lastDayDate = dayDateStr;
        lastDayDateExists = dayDateExists;
        return;
    }

    const dayDateGroup = new THREE.Group();
    dayDateGroup.name = 'dayDateDisplay';

    // Create and add the Day/Date display
    const dayDateGeometry = geometriesJs.createDayDateGeometry(dayDateStr, font);
    const dayDateMesh = meshesJs.createDayDateMesh(dayDateGeometry);
    scene.add(dayDateMesh);

    // Position the display
    dayDateMesh.name = 'dayDateDisplay';
    dayDateMesh.position.x = 0;
    dayDateMesh.position.y = -constantsJs.DIGITAL_DISPLAY_CENTER_Y;
    dayDateMesh.position.z = constantsJs.SIZES.CLOCK_THICKNESS / 2;

    lastDayDate = dayDateStr;
    lastDayDateExists = dayDateExists;
}

export function toggleDayDate(isChecked) {
    dayDateExists = isChecked;
}

/**
 * Updates the digital time display on the perfect clock.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} font - The font used for the day-date display.
 */
export function updateDigitalDisplay(scene, font) {
    if (!currentTime) {
        return;
    }

    let digitalTime = currentTime.toLocaleTimeString(language, {
        hour12: !useTwentyFourHour,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });
    digitalTime = digitalTime.replace(/^24/, '00');

    // These sneaky unicode characters are hidden by the digital time frame. They exist so
    // the time remains centered within its frame and doesn't shift slightly as the seconds tick.
    // It's either this or monospace fonts, and monospace fonts are gross.
    const digitalTimeStr = `(\u200B${digitalTime}\u200B)`;

    const currentSecond = currentTime.getSeconds();
    const shouldUpdate = (
        (currentSecond !== lastSecond || digitalDisplayExists !== lastDigitalDisplayExists)
            || language !== lastLanguage || useTwentyFourHour !== lastTimeFormat || !resizeHandled
    );

    if (!shouldUpdate) {
        return;
    }

    meshesJs.removeMeshByName(scene, 'digitalDisplay');

    // If the digital display isn't showing, we don't need to update it
    // TODO: This probably doesn't need to be here any more
    if (!digitalDisplayExists) {
        lastSecond = currentSecond;
        lastDigitalDisplayExists = digitalDisplayExists;
        lastLanguage = language;
        lastTimeFormat = useTwentyFourHour;
        return;
    }

    // Create and add new digital time display
    const digitalTimeGeometry = geometriesJs.createDigitalTimeGeometry(digitalTimeStr, font);
    const digitalDisplayMesh = meshesJs.createDigitalDisplayMesh(digitalTimeGeometry);
    scene.add(digitalDisplayMesh);

    // Position the display
    digitalDisplayMesh.name = 'digitalDisplay';
    digitalDisplayMesh.position.x = 0;
    digitalDisplayMesh.position.y = constantsJs.DIGITAL_DISPLAY_CENTER_Y;
    digitalDisplayMesh.position.z = constantsJs.SIZES.CLOCK_THICKNESS / 2;

    // Frame it
    const newLeftX = digitalDisplayMesh.geometry.boundingBox.min.x;
    const newRightX = digitalDisplayMesh.geometry.boundingBox.max.x;
    const newScaleX = (newRightX - newLeftX) / constantsJs.DIGITAL_DISPLAY_FRAME_WIDTH;

    const digitalDisplayBox = meshesJs.createDigitalTimeBox();
    digitalDisplayBox.position.set(0, constantsJs.DIGITAL_DISPLAY_CENTER_Y, constantsJs.SIZES.CLOCK_THICKNESS / 2 - .01)
    digitalDisplayBox.scale.x = newScaleX;

    // console.log(digitalDisplayBox.geometry.boundingBox.getSize(new THREE.Vector3));
    scene.add(digitalDisplayBox);

    lastSecond = currentSecond;
    lastDigitalDisplayExists = digitalDisplayExists;
    lastLanguage = language;
    lastTimeFormat = useTwentyFourHour;
}

export function toggleDigitalDisplay(isChecked) {
    digitalDisplayExists = isChecked;
}

/**
 * Updates the indicators display on the perfect clock.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} font - The font used for the day-date display.
 */
function updateIndicators(scene) {
    for (let i = 0; i < 60; i++) {
        const indicatorName = `indicator${i}`;
        const indicator = scene.getObjectByName(indicatorName);

        // Hours
        if (hourIndicatorsExist && i % 5 === 0) {
            scene.add(constantsJs.INDICATORS[i]);
        } else if (!hourIndicatorsExist && i % 5 === 0) {
            scene.remove(indicator);
        }

        // Minutes
        if (minuteIndicatorsExist && i % 5 != 0) {
            if (!indicator) {
                scene.add(constantsJs.INDICATORS[i]);
            }
        } else if (!minuteIndicatorsExist && i % 5 != 0) {
            scene.remove(indicator);
        }
    }
}

export function toggleHourIndicators(isChecked) {
    hourIndicatorsExist = isChecked;
}

export function toggleMinuteIndicators(isChecked) {
    minuteIndicatorsExist = isChecked;
}

/**
 * Updates the numbers on the perfect clock.
 * 
 * @param {Object} scene - The Three.js scene object.
 */
function updateNumbers(scene) {
    for (let i = 1; i <= 12; i++) {
        updateNumber(scene, i, constantsJs.HOUR_NUMBERS, 'hour', hourNumbersExist);
        updateNumber(scene, i, constantsJs.MINUTE_NUMBERS, 'minute', minuteNumbersExist, 5);
    }
}

/**
 * Updates a single number on the clock, either hour or minute.
 *
 * @param {Object} scene - The Three.js scene object.
 * @param {number} index - The index of the number to be updated.
 * @param {Array} numbersArray - The array containing the numbers.
 * @param {string} namePrefix - The prefix for the object name ('hour' or 'minute').
 * @param {boolean} numbersExist - Flag indicating if numbers exist.
 * @param {number} multiplier - Multiplier for minute number calculation (default is 1).
 */
function updateNumber(scene, index, numbersArray, namePrefix, numbersExist, multiplier = 1) {
    const name = `${namePrefix}${index * multiplier}`;
    const numberObject = scene.getObjectByName(name);

    if (numbersExist) {
        scene.add(numbersArray[index * multiplier]);
    } else {
        scene.remove(numberObject);
    }
}

export function toggleHourNumbers(isChecked) {
    hourNumbersExist = isChecked;
}

export function toggleMinuteNumbers(isChecked) {
    minuteNumbersExist = isChecked;
}

// Adds or removes the hour hand from the scene based user configurations
export function updateHourHand(scene, angle) {
    const hourHand = scene.getObjectByName('hourHand');
    const outerHourHand = scene.getObjectByName('outerHourHand');

    [hourHand, outerHourHand].forEach(hand => {
        if (hand) {
            hand.geometry.dispose();
            scene.remove(hand);
        }
    });

    if (!hourHandExists) return;

    const edgeScaledLength = distanceToEdge(angle) * 2/3
    const minuteScaledLength = minuteHandLength * 2/3
    const handLength = Math.min(edgeScaledLength, minuteScaledLength)

    meshesJs.MESHES.hourHand = meshesJs.createHourHand(handLength);
    meshesJs.MESHES.outerHourHand = meshesJs.createOuterHourHand(handLength);
    meshesJs.MESHES.hourHand.rotation.z = -angle;
    meshesJs.MESHES.outerHourHand.rotation.z = -angle;

    scene.add(meshesJs.MESHES['hourHand']);
    scene.add(meshesJs.MESHES['outerHourHand']);
}

// Adds or removes the minute hand from the scene based user configurations
export function updateMinuteHand(scene, angle) {
    const minuteHand = scene.getObjectByName('minuteHand');
    const outerMinuteHand = scene.getObjectByName('outerMinuteHand');

    [minuteHand, outerMinuteHand].forEach(hand => {
        if (hand) {
            hand.geometry.dispose();
            scene.remove(hand);
        }
    });

    if (!minuteHandExists) return;

    const handLength = distanceToEdge(angle)
    minuteHandLength = handLength;

    meshesJs.MESHES.minuteHand = meshesJs.createMinuteHand(handLength);
    meshesJs.MESHES.outerMinuteHand = meshesJs.createOuterMinuteHand(handLength);
    meshesJs.MESHES.minuteHand.rotation.z = -angle;
    meshesJs.MESHES.outerMinuteHand.rotation.z = -angle;

    scene.add(meshesJs.MESHES['minuteHand']);
    scene.add(meshesJs.MESHES['outerMinuteHand']);
}

// Adds or removes the second hand from the scene based user configurations
export function updateSecondHand(scene, angle) {
    const secondHand = scene.getObjectByName('secondHand');
    const outerSecondHand = scene.getObjectByName('outerSecondHand');

    [secondHand, outerSecondHand].forEach(hand => {
        if (hand) {
            hand.geometry.dispose();
            scene.remove(hand);
        }
    });

    if (!secondHandExists) return;

    const handLength = distanceToEdge(angle)

    meshesJs.MESHES.secondHand = meshesJs.createSecondHand(handLength);
    meshesJs.MESHES.outerSecondHand = meshesJs.createOuterSecondHand(handLength);
    meshesJs.MESHES.secondHand.rotation.z = -angle;
    meshesJs.MESHES.outerSecondHand.rotation.z = -angle;

    scene.add(meshesJs.MESHES['secondHand']);
    scene.add(meshesJs.MESHES['outerSecondHand']);
}

export function toggleHourHand(isChecked) {
    hourHandExists = isChecked;
}

export function toggleMinuteHand(isChecked) {
    minuteHandExists = isChecked;
}

export function toggleSecondHand(isChecked) {
    secondHandExists = isChecked;
}

export function toggleSweepingSeconds(isChecked) {
    sweepingSeconds = isChecked;
}

// Populates the field reporting how ahead/behind the user's device's clock is
export function updateTimeOffset() {
    let offset = timeManager.timeOffset
    const offsetNumberField = document.getElementById('timeOffsetNumber')
    const offsetDirectionField = document.getElementById('timeOffsetDirection')

    offsetNumberField.textContent = Math.abs(offset / 1000);
    offsetDirectionField.textContent = offset > 0 ? "behind" : "ahead";
}

// Sets the language for the clock's displays based on the selected value
function updateLanguage() {
    language = document.getElementById('languageSelect').value;
}

// Sets the time format (12 or 24-hour) for the digital display based on the selected value
function updateTimeFormat() {
    useTwentyFourHour = document.getElementById('useTwentyFourHour').checked;
}

export function toggleResizeHandled(isHandled) {
    resizeHandled = isHandled;
}
