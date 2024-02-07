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

import { DAY_DATE_PARTS, DIGITAL_DISPLAY_PARTS, DAY_DATE_FRAME_WIDTH, DIGITAL_DISPLAY_FRAME_WIDTH, HOUR_NUMBERS, INDICATORS, MINUTE_NUMBERS, SIZES } from '../constants.js';
import { createDayDateMesh, createDigitalDisplayMesh, removeMeshByName, MESHES } from '../visuals/meshes.js';
import { dynamicClockRatio, updateCameraSlider } from '../managers/sceneManager.js';
import { timeManager } from '../managers/timeManager.js';
import { createDayDateGeometry, createDigitalTimeGeometry } from '../visuals/geometries.js';
import { scaleValue } from '../utils/uiUtils.js';


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

    MESHES.hourHand.rotation.z = -hourAngle;
    MESHES.outerHourHand.rotation.z = -hourAngle;
    MESHES.minuteHand.rotation.z = -minuteAngle;
    MESHES.outerMinuteHand.rotation.z = -minuteAngle;
    MESHES.secondHand.rotation.z = -secondAngle;
    MESHES.outerSecondHand.rotation.z = -secondAngle;

    updateLanguage();
    updateTimeFormat();
    updateCameraSlider();
    updateTimeOffset();
    updateDigitalDisplay(scene, digitalFont);
    updateDayDateDisplay(scene, dayDateFont);
    updateIndicators(scene);
    updateNumbers(scene);
    updateHourHand(scene);
    updateMinuteHand(scene);
    updateSecondHand(scene);
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

    const shouldUpdate = dayDateStr !== lastDayDate || dayDateExists !== lastDayDateExists;

    if (!shouldUpdate) {
        return;
    }

    removeMeshByName(scene, 'dayDateDisplay');

    // Remove the associated complication box if it exists and the day/date doesn't
    if (!dayDateExists) {
        for (const part of DAY_DATE_PARTS) {
            const prevPart = scene.getObjectByName(part);
            if (prevPart) {
                scene.remove(prevPart);
            }
        }
    }

    // If the Date/Date isn't showing, we don't need to update it
    if (!dayDateExists) {
        lastDayDate = dayDateStr;
        lastDayDateExists = dayDateExists;
        return;
    }
    
    // Add complication box if necessary
    for (const part of DAY_DATE_PARTS) {
        if (!scene.getObjectByName(part)) {
            scene.add(MESHES[part]);
            MESHES[part].position.z = SIZES.CLOCK_THICKNESS / 2 - SIZES.DAY_DATE_BOX_DEPTH / 2 + 0.001; 
        }
    }

    const dayDateGroup = new THREE.Group();
    dayDateGroup.name = 'dayDateDisplay';

    // Create and add the Day/Date display
    const dayDateGeometry = createDayDateGeometry(dayDateStr, font);
    const dayDateMesh = createDayDateMesh(dayDateGeometry);
    scene.add(dayDateMesh);

    // Position the display
    dayDateMesh.name = 'dayDateDisplay';
    dayDateMesh.position.x = 0;
    dayDateMesh.position.y = MESHES.dayDateBox.position.y - scaleValue(SIZES.DAY_DATE_FRAME_THICKNESS) * 2
    dayDateMesh.position.z = SIZES.CLOCK_THICKNESS / 2  + SIZES.DAY_DATE_BOX_DEPTH / 2 - SIZES.DAY_DATE_NUMBER_HEIGHT / 2;

    // Find the new dimensions and scale for the display
    const newLeftX = dayDateMesh.geometry.boundingBox.min.x + scaleValue(SIZES.DAY_DATE_FRAME_THICKNESS) / 2;
    const newRightX = dayDateMesh.geometry.boundingBox.max.x - scaleValue(SIZES.DAY_DATE_FRAME_THICKNESS) / 2;
    const newScaleX = (newRightX - newLeftX + scaleValue(SIZES.DAY_DATE_FRAME_THICKNESS)) / DAY_DATE_FRAME_WIDTH;

    // Adjust the box to fit
    MESHES.dayDateBox.scale.x = newScaleX;

    // Adjust the Day/Date frames to fit
    MESHES.dayDateLeftFrame.position.x = newLeftX;
    MESHES.dayDateRightFrame.position.x = newRightX;
    ['dayDateTopFrame', 'dayDateBottomFrame'].forEach(frame => {
        if (dynamicClockRatio > 1) {
            MESHES[frame].scale.x = newScaleX * dynamicClockRatio;
        } else {
            MESHES[frame].scale.x = newScaleX / dynamicClockRatio;
        }
    });

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
    const digitalTimeStr = `\u007C\u200B${digitalTime}\u200B\u007C`;

    const currentSecond = currentTime.getSeconds();
    const shouldUpdate = (
        (currentSecond !== lastSecond || digitalDisplayExists !== lastDigitalDisplayExists)
            || language !== lastLanguage || useTwentyFourHour !== lastTimeFormat
    );

    if (!shouldUpdate) {
        return;
    }

    removeMeshByName(scene, 'digitalDisplay');

    // Remove associated complication box if it exists and the digital time doesn't
    if (!digitalDisplayExists) {
        for (const part of DIGITAL_DISPLAY_PARTS) {
            const prevPart = scene.getObjectByName(part);
            if (prevPart) {
                scene.remove(prevPart);
            }
        }
    }

    // If the digital display isn't showing, we don't need to update it
    if (!digitalDisplayExists) {
        lastSecond = currentSecond;
        lastDigitalDisplayExists = digitalDisplayExists;
        lastLanguage = language;
        lastTimeFormat = useTwentyFourHour;
        return;
    }

    // Add complication box if necessary
    for (const part of DIGITAL_DISPLAY_PARTS) {
        if (!scene.getObjectByName(part)) {
            scene.add(MESHES[part]);
            MESHES[part].position.z = SIZES.CLOCK_THICKNESS / 2 - SIZES.DIGITAL_TIME_BOX_DEPTH / 2 + 0.001; 
        }
    }

    // Create and add new digital time display
    const digitalTimeGeometry = createDigitalTimeGeometry(digitalTimeStr, font);
    const digitalDisplayMesh = createDigitalDisplayMesh(digitalTimeGeometry);
    scene.add(digitalDisplayMesh);

    // Position the dispaly
    digitalDisplayMesh.name = 'digitalDisplay';
    digitalDisplayMesh.position.x = 0;
    digitalDisplayMesh.position.y = MESHES.digitalDisplayBox.position.y - scaleValue(SIZES.DIGITAL_TIME_FRAME_THICKNESS) * 2
    digitalDisplayMesh.position.z = SIZES.CLOCK_THICKNESS / 2  + SIZES.DIGITAL_TIME_BOX_DEPTH / 2 - SIZES.DIGITAL_TIME_NUMBER_HEIGHT / 2;

    // Find the new dimensions and scale for the display
    const newLeftX = digitalDisplayMesh.geometry.boundingBox.min.x + scaleValue(SIZES.DIGITAL_TIME_FRAME_THICKNESS) / 2;
    const newRightX = digitalDisplayMesh.geometry.boundingBox.max.x - scaleValue(SIZES.DIGITAL_TIME_FRAME_THICKNESS) / 2;
    const newScaleX = (newRightX - newLeftX + scaleValue(SIZES.DIGITAL_TIME_FRAME_THICKNESS)) / DIGITAL_DISPLAY_FRAME_WIDTH;

    // Adjust the digital display box to fit
    MESHES.digitalDisplayBox.scale.x = newScaleX;

    // Adjust the digital display frames to fit
    MESHES.digitalDisplayLeftFrame.position.x = newLeftX
    MESHES.digitalDisplayRightFrame.position.x = newRightX;
    ['digitalDisplayTopFrame', 'digitalDisplayBottomFrame'].forEach(frame => {
        if (dynamicClockRatio > 1) {
            MESHES[frame].scale.x = newScaleX * dynamicClockRatio;
        } else {
            MESHES[frame].scale.x = newScaleX / dynamicClockRatio;
        }
    });

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
            scene.add(INDICATORS[i]);
        } else if (!hourIndicatorsExist && i % 5 === 0) {
            scene.remove(indicator);
        }

        // Minutes
        if (minuteIndicatorsExist && i % 5 != 0) {
            if (!indicator) {
                scene.add(INDICATORS[i]);
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
        updateNumber(scene, i, HOUR_NUMBERS, 'hour', hourNumbersExist);
        updateNumber(scene, i, MINUTE_NUMBERS, 'minute', minuteNumbersExist, 5);
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
export function updateHourHand(scene) {
    const hourHand = scene.getObjectByName('hourHand');
    const outerHourHand = scene.getObjectByName('outerHourHand');
    if (hourHandExists && !hourHand) {
        scene.add(MESHES.hourHand);
        scene.add(MESHES.outerHourHand);
    } else if (!hourHandExists && hourHand) {
        scene.remove(hourHand);
        scene.remove(outerHourHand);
    }
}

// Adds or removes the minute hand from the scene based user configurations
export function updateMinuteHand(scene) {
    const minuteHand = scene.getObjectByName('minuteHand');
    const outerMinuteHand = scene.getObjectByName('outerMinuteHand');
    if (minuteHandExists && !minuteHand) {
        scene.add(MESHES.minuteHand);
        scene.add(MESHES.outerMinuteHand);
    } else if (!minuteHandExists && minuteHand) {
        scene.remove(minuteHand);
        scene.remove(outerMinuteHand);
    }
}

// Adds or removes the second hand from the scene based user configurations
export function updateSecondHand(scene) {
    const secondHand = scene.getObjectByName('secondHand');
    const outerSecondHand = scene.getObjectByName('outerSecondHand');
    if (secondHandExists && !secondHand) {
        scene.add(MESHES.secondHand);
        scene.add(MESHES.outerSecondHand);
    } else if (!secondHandExists && secondHand) {
        scene.remove(secondHand);
        scene.remove(outerSecondHand);
    }
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
