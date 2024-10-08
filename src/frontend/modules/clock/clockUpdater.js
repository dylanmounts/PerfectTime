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
import { switchScheme } from '../managers/colorManager.js';
import * as sceneManagerJs from '../managers/sceneManager.js';
import { timeManager } from '../managers/timeManager.js';
import { updateTitleTime } from '../utils/uiUtils.js';
import { distanceToEdge, scaleValue } from '../utils/sizeUtils.js';
import * as materialsJs from '../visuals/materials.js'
import * as meshesJs from '../visuals/meshes.js';
import * as geometriesJs from '../visuals/geometries.js';
import { addClock, destroyClock } from './clockConstructor.js';


// Initialize state variables for the visibility of clock components
let dayDateExists = sceneManagerJs.initializeState('dayDateOption');
let digitalDisplayExists = sceneManagerJs.initializeState('digitalTimeOption');
let hourIndicatorsExist = sceneManagerJs.initializeState('hourIndicatorsOption');
let hourNumbersExist = sceneManagerJs.initializeState('hoursOption');
let hourHandExists = sceneManagerJs.initializeState('hourHandOption');
let minuteIndicatorsExist = sceneManagerJs.initializeState('minuteIndicatorsOption');
let minuteNumbersExist = sceneManagerJs.initializeState('minutesOption');
let minuteHandExists = sceneManagerJs.initializeState('minuteHandOption');
let secondHandExists = sceneManagerJs.initializeState('secondHandOption');
let sweepingSeconds = sceneManagerJs.initializeState('sweepingSecondsOption');

// State variables for tracking the perfect time and its displays.
export let language = 'en-US';
export let useDynamicClock = false;
export let useTwentyFourHour = false;
let currentTime = null;
let lastTime = new Date;
let lastSecond = null;
let lastDayDate = null;
let lastDayDateExists = null;
let lastDigitalDisplayExists = null;
let lastLanguage = null;
let lastTimeFormat = null;
let lastColorScheme = null;
let lastClockShape = null;
let minuteHandLength = null;
let useDarkScheme = true;
let resizeHandled = false;

/**
 * Main function to update the clock based on the current time retrieved from the
 * backend time server.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} digitalFont - The font used for the digital display
 * @param {Object} dayDateFont - The font used for the day/date display
 */
export function updateClock(scene, digitalFont, dayDateFont, hoursFont, minutesFont) {
    const foundTime = timeManager.getCurrentTime();

    if (!foundTime) {
        return;
    }

    // Ensure currentTime is a valid Date object; otherwise, use the current date.
    currentTime = foundTime instanceof Date && !isNaN(foundTime)
        ? foundTime
        : new Date();

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

    updateClockStyle(scene, hoursFont, minutesFont);
    updateLanguage();
    updateTimeFormat();
    sceneManagerJs.updateCameraSlider();
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
           (Math.PI / 21600) * seconds;
}

function calculateMinuteAngle(minutes, seconds) {
    return (Math.PI / 30) * minutes + 
           (Math.PI / 1800) * seconds;
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

function updateClockStyle(scene, hoursFont, minutesFont) {
    useDynamicClock = document.getElementById('useDynamicClock').checked;
    useDarkScheme = document.getElementById('useDarkScheme').checked;

    if (useDynamicClock === lastClockShape && useDarkScheme === lastColorScheme) {
        return;
    }

    if ((useDarkScheme !== lastColorScheme)) {
        switchScheme(useDarkScheme ? 'dark' : 'light');
        materialsJs.rebuildMaterials();
    }

    resizeHandled = false;
    destroyClock(scene);
    addClock(scene, hoursFont, minutesFont, useDynamicClock);
    sceneManagerJs.updateCamera(useDynamicClock);
    localStorage.setItem('useDynamicClock', useDynamicClock);

    lastClockShape = useDynamicClock;
    lastColorScheme = useDarkScheme;
}

/**
 * Updates the day/date display on the perfect clock.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} font - The font used for the day-date display.
 */
export function updateDayDateDisplay(scene, font) {
    // Function to update state before returning
    function updateState() {
        lastDayDate = dayDateStr;
        lastDayDateExists = dayDateExists;
    }

    const day = currentTime.toLocaleString(language, { weekday: 'short' }).toUpperCase();
    const month = currentTime.toLocaleString(language, { month: 'short' });
    const date = currentTime.toLocaleString(language, { day: 'numeric' });

    // These sneaky unicode characters are hidden by the digital time frame. They exist so
    // the time remains centered within its frame and doesn't shift slightly as the seconds tick.
    // It's either this or monospace fonts, and monospace fonts are gross.
    const dayDateStr = `\u007C\u200B${day.toUpperCase()} ${month} ${date}\u200B\u007C`;

    const shouldUpdate = (
        (dayDateStr !== lastDayDate || dayDateExists !== lastDayDateExists)
            || !resizeHandled
    );

    if (!shouldUpdate) return;

    meshesJs.removeMeshByName(scene, 'dayDateDisplay');
    meshesJs.removeMeshByName(scene, 'dayDateBox');

    // If the day/date dispaly doesn't exist then we don't need to update it.
    if (!dayDateExists) {
        updateState();
        return;
    }

    const dayDateGroup = new THREE.Group();
    dayDateGroup.name = 'dayDateDisplay';

    // Create and add the Day/Date display
    const dayDateGeometry = geometriesJs.createDayDateGeometry(dayDateStr, font, useDynamicClock);
    const dayDateMesh = meshesJs.createDayDateMesh(dayDateGeometry);
    scene.add(dayDateMesh);

    // Position the display
    let centerY;
    if (useDynamicClock) {
        centerY = sceneManagerJs.dynamicClockRatio < 1
            ? constantsJs.DAY_DATE_BASE_Y / sceneManagerJs.dynamicClockRatio
            : constantsJs.DAY_DATE_BASE_Y / (sceneManagerJs.dynamicClockRatio / 1.5)
    } else {
        centerY = constantsJs.DAY_DATE_BASE_Y * 2
    }

    // Limit how far the display can be placed from the center
    centerY = Math.max(centerY, -distanceToEdge(Math.PI / 2) * 5/6)

    dayDateMesh.name = 'dayDateDisplay';
    dayDateMesh.position.set(
        0,
        centerY,
        constantsJs.SIZES.CLOCK_THICKNESS / 2
    )

    // Put it in its box
    const width = dayDateMesh.geometry.boundingBox.max.x - dayDateMesh.geometry.boundingBox.min.x
    const height = dayDateMesh.geometry.boundingBox.max.y - dayDateMesh.geometry.boundingBox.min.y

    let dayDateBox;
    let dayDateDisplayY;
    if (useDynamicClock) {
        dayDateBox = meshesJs.createDayDateBox(width - scaleValue(0.039) * constantsJs.SIZES.COMPLICATION_BOX_SCALE, height + scaleValue(0.1), useDynamicClock);
        dayDateDisplayY = centerY + scaleValue(constantsJs.SIZES.DIGITAL_DISPLAY_BEVEL_SIZE);
    } else {
        dayDateBox = meshesJs.createDayDateBox(width - 0.039, height + 0.1, useDynamicClock);
        dayDateDisplayY = centerY + constantsJs.SIZES.DIGITAL_DISPLAY_BEVEL_SIZE;
    }
    dayDateBox.position.set(0, dayDateDisplayY, constantsJs.SIZES.CLOCK_THICKNESS / 2 - 0.01)
    scene.add(dayDateBox);

    updateState();
}

export function toggleDayDate(isChecked) {
    dayDateExists = isChecked;
    localStorage.setItem('dayDateOption', isChecked);
}

/**
 * Updates the digital time display on the perfect clock.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} font - The font used for the day-date display.
 */
export function updateDigitalDisplay(scene, font) {
    // Function to update state before returning
    function updateState() {
        lastSecond = currentTime.getSeconds();
        lastDigitalDisplayExists = digitalDisplayExists;
        lastLanguage = language;
        lastTimeFormat = useTwentyFourHour;
    }

    const currentSecond = currentTime.getSeconds();
    const shouldUpdate = (
        (currentSecond !== lastSecond || digitalDisplayExists !== lastDigitalDisplayExists)
            || language !== lastLanguage || useTwentyFourHour !== lastTimeFormat || !resizeHandled
    );

    if (!shouldUpdate) return;

    meshesJs.removeMeshByName(scene, 'digitalDisplay');
    meshesJs.removeMeshByName(scene, 'digitalDisplayBox');

    // If the digital time dispaly doesn't exist then we don't need to update it
    if (!digitalDisplayExists) {

        // Force the title time to update even if the digital display isn't showing
        if (language !== lastLanguage || useTwentyFourHour !== lastTimeFormat) {
            updateTitleTime(true);
        }

        updateState();
        return;
    }

    // Use the next digital time string, unless it needs to be updated
    let timeStr;
    if (language !== lastLanguage || useTwentyFourHour !== lastTimeFormat || !timeManager.currentTimeStr) {
        timeStr = timeManager.generateTimeString(currentTime);
        updateTitleTime(true);
    } else {
        timeStr = timeManager.currentTimeStr;
    }

    // Create and add new digital time display
    const digitalDisplayGeometry = geometriesJs.createDigitalDisplayGeometry(timeStr, font, useDynamicClock);
    const digitalDisplayMesh = meshesJs.createDigitalDisplayMesh(digitalDisplayGeometry);
    scene.add(digitalDisplayMesh);

    // Position the display
    let centerY;
    if (useDynamicClock) {
        centerY = sceneManagerJs.dynamicClockRatio < 1
            ? constantsJs.DIGITAL_DISPLAY_BASE_Y / sceneManagerJs.dynamicClockRatio
            : constantsJs.DIGITAL_DISPLAY_BASE_Y / (sceneManagerJs.dynamicClockRatio / 1.5)
    } else {
        centerY = constantsJs.DIGITAL_DISPLAY_BASE_Y * 2
    }

    // Limit how far the display can be placed from the center
    centerY = Math.min(centerY, distanceToEdge(Math.PI / 2) * 5/6)

    digitalDisplayMesh.name = 'digitalDisplay';
    digitalDisplayMesh.position.set(
        0,
        centerY,
        constantsJs.SIZES.CLOCK_THICKNESS / 2
    )

    // Put it in its box
    const width = digitalDisplayMesh.geometry.boundingBox.max.x - digitalDisplayMesh.geometry.boundingBox.min.x
    const height = digitalDisplayMesh.geometry.boundingBox.max.y - digitalDisplayMesh.geometry.boundingBox.min.y

    let digitalDisplayBox;
    let digitalDisplayY;
    if (useDynamicClock) {
        digitalDisplayBox = meshesJs.createDigitalDisplayBox(width - scaleValue(0.051) * constantsJs.SIZES.COMPLICATION_BOX_SCALE, height + scaleValue(0.15), useDynamicClock);
        digitalDisplayY = centerY + scaleValue(constantsJs.SIZES.DIGITAL_DISPLAY_BEVEL_SIZE)
    } else {
        digitalDisplayBox = meshesJs.createDigitalDisplayBox(width - 0.051, height + 0.15, useDynamicClock);
        digitalDisplayY = centerY + constantsJs.SIZES.DIGITAL_DISPLAY_BEVEL_SIZE
    }
    digitalDisplayBox.position.set(0, digitalDisplayY, constantsJs.SIZES.CLOCK_THICKNESS / 2 - 0.01)
    scene.add(digitalDisplayBox);

    updateState();
}

export function toggleDigitalDisplay(isChecked) {
    digitalDisplayExists = isChecked;
    localStorage.setItem('digitalTimeOption', isChecked);
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
    localStorage.setItem('hourIndicatorsOption', isChecked);
}

export function toggleMinuteIndicators(isChecked) {
    minuteIndicatorsExist = isChecked;
    localStorage.setItem('minuteIndicatorsOption', isChecked);
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
    localStorage.setItem('hoursOption', isChecked);
}

export function toggleMinuteNumbers(isChecked) {
    minuteNumbersExist = isChecked;
    localStorage.setItem('minutesOption', isChecked);
}

// Adds or removes the hour hand from the scene based user configurations
export function updateHourHand(scene, angle) {
    if (!hourHandExists) {
        meshesJs.removeMeshByName(scene, 'hourHand');
        meshesJs.removeMeshByName(scene, 'outerHourHand');
        return;
    }

    let hourHand = scene.getObjectByName('hourHand');
    let outerHourHand = scene.getObjectByName('outerHourHand');

    if (!hourHand) {
        scene.add(meshesJs.createHourHand(useDynamicClock));
        scene.add(meshesJs.createOuterHourHand(useDynamicClock));

        hourHand = scene.getObjectByName('hourHand');
        outerHourHand = scene.getObjectByName('outerHourHand');
    }

    const edgeScaledLength = useDynamicClock
        ? distanceToEdge(angle) * 2/3
        : constantsJs.HOUR_HAND_BASE_LENGTH;

    const minuteScaledLength = minuteHandLength * 2/3;

    const handLength = useDynamicClock
        ? Math.min(edgeScaledLength, minuteScaledLength)
        : edgeScaledLength;

    const baseHandLength = sceneManagerJs.dynamicClockRatio < 1
        ? distanceToEdge(0) * 2/3
        : distanceToEdge(Math.PI / 2) * 2/3; 

    const handLengthScale = handLength / baseHandLength

    const scaleFactor = useDynamicClock
        ? handLengthScale
        : 1
    
    hourHand.scale.y = scaleFactor;
    outerHourHand.scale.y = scaleFactor;

    hourHand.rotation.z = -angle;
    outerHourHand.rotation.z = -angle;
}

export function updateMinuteHand(scene, angle) {
    if (!minuteHandExists) {
        meshesJs.removeMeshByName(scene, 'minuteHand');
        meshesJs.removeMeshByName(scene, 'outerMinuteHand');
        return;
    }

    let minuteHand = scene.getObjectByName('minuteHand')
    let outerMinuteHand = scene.getObjectByName('outerMinuteHand');

    if (!minuteHand) {
        scene.add(meshesJs.createMinuteHand(useDynamicClock));
        scene.add(meshesJs.createOuterMinuteHand(useDynamicClock));

        minuteHand = scene.getObjectByName('minuteHand');
        outerMinuteHand = scene.getObjectByName('outerMinuteHand');
    }

    minuteHandLength = useDynamicClock
        ? distanceToEdge(angle)
        : constantsJs.MINUTE_HAND_BASE_LENGTH;

    const baseHandLength = sceneManagerJs.dynamicClockRatio < 1
        ? distanceToEdge(0)
        : distanceToEdge(Math.PI / 2);

    const handLengthScale = minuteHandLength / baseHandLength

    const scaleFactor = useDynamicClock
        ? handLengthScale
        : 1
    
    minuteHand.scale.y = scaleFactor;
    outerMinuteHand.scale.y = scaleFactor;

    minuteHand.rotation.z = -angle;
    outerMinuteHand.rotation.z = -angle;
}

// Adds or removes the second hand from the scene based user configurations
export function updateSecondHand(scene, angle) {
    if (!secondHandExists) {
        meshesJs.removeMeshByName(scene, 'secondHand');
        meshesJs.removeMeshByName(scene, 'outerSecondHand');
        return;
    }

    let secondHand = scene.getObjectByName('secondHand')
    let outerSecondHand = scene.getObjectByName('outerSecondHand');

    if (!secondHand) {
        scene.add(meshesJs.createSecondHand(useDynamicClock));
        scene.add(meshesJs.createOuterSecondHand(useDynamicClock));

        secondHand = scene.getObjectByName('secondHand');
        outerSecondHand = scene.getObjectByName('outerSecondHand');
    }

    const handLength = useDynamicClock
        ? distanceToEdge(angle)
        : constantsJs.SECOND_HAND_BASE_LENGTH;

    const baseHandLength = sceneManagerJs.dynamicClockRatio < 1
        ? distanceToEdge(0)
        : distanceToEdge(Math.PI / 2);

    const handLengthScale = handLength / baseHandLength

    const scaleFactor = useDynamicClock
        ? handLengthScale
        : 1
    
    secondHand.scale.y = scaleFactor;
    outerSecondHand.scale.y = scaleFactor;

    secondHand.rotation.z = -angle;
    outerSecondHand.rotation.z = -angle;
}

export function toggleHourHand(isChecked) {
    hourHandExists = isChecked;
    localStorage.setItem('hourHandOption', isChecked);
}

export function toggleMinuteHand(isChecked) {
    minuteHandExists = isChecked;
    localStorage.setItem('minuteHandOption', isChecked);
}

export function toggleSecondHand(isChecked) {
    secondHandExists = isChecked;
    localStorage.setItem('secondHandOption', isChecked);
}

export function toggleSweepingSeconds(isChecked) {
    sweepingSeconds = isChecked;
    localStorage.setItem('sweepingSecondsOption', isChecked);
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
    localStorage.setItem('language', language);
}

// Sets the time format (12 or 24-hour) for the digital display based on the selected value
function updateTimeFormat() {
    useTwentyFourHour = document.getElementById('useTwentyFourHour').checked;
    localStorage.setItem('useTwentyFourHour', useTwentyFourHour);
}

export function toggleResizeHandled(isHandled) {
    resizeHandled = isHandled;
}
