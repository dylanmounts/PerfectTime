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

import { DAY_DATE_BOX_RIGHT_X, DAY_DATE_PARTS, DIGITAL_DISPLAY_PARTS, HOUR_NUMBERS, INDICATORS, OUTER_INDICATORS, MINUTE_NUMBERS, SIZES, DAY_DATE_BOX_TOP_Y, DAY_DATE_BOX_BOTTOM_Y, DAY_DATE_FRAME_WIDTH } from '../constants.js';
import { createDayDateMesh, createDigitalDisplayMesh, removeMeshByGroup, removeMeshByName, MESHES } from '../visuals/meshes.js';
import { updateCameraSlider } from '../managers/sceneManager.js';
import { timeManager } from '../managers/timeManager.js';
import { createDigitalTimeGeometry } from '../visuals/geometries.js';


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

/**
 * Main function to update the clock based on the current time retrieved from the
 * backend time server.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} regularFont - The font used for day/date elements.
 */
export function updateClock(scene, regularFont) {
    currentTime = timeManager.getCurrentTime();
    currentTime.setHours(22, 10, 2, 200);

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

    updateCameraSlider();
    updateTimeOffset();
    updateDigitalDisplay(scene, regularFont);
    updateDayDateDisplay(scene, regularFont);
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

    const language = document.getElementById('languageSelect').value;

    const day = currentTime.toLocaleString(language, { weekday: 'short' }).toUpperCase();
    const month = currentTime.toLocaleString(language, { month: 'short' });
    const date = currentTime.toLocaleString(language, { day: 'numeric' });
    const dayDateStr = `${day.toUpperCase()} ${month} ${date}`;

    const shouldUpdate = dayDateStr !== lastDayDate || dayDateExists !== lastDayDateExists;

    if (!shouldUpdate) {
        return;
    }

    removeMeshByGroup(scene, 'dayDateDisplay');

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
        }
    }

    // Initial position for the day mesh
    let currentPosition = {
        x: DAY_DATE_BOX_RIGHT_X - SIZES.COMPLICATION_FRAME_THICKNESS * 2 - SIZES.DAY_DATE_SPACING,
        y: (DAY_DATE_BOX_BOTTOM_Y + DAY_DATE_BOX_TOP_Y) / 2 - SIZES.DAY_DATE_SIZE / 2,
        z: MESHES.dayDateBox.position.z - SIZES.COMPLICATION_NUMBER_HEIGHT / 2
    };    

    const dayDateGroup = new THREE.Group();
    dayDateGroup.name = 'dayDateDisplay';

    // Create the Day/Date parts and add them to the scene
    createDayDateMesh(date.toString(), font, currentPosition, dayDateGroup);
    createDayDateMesh(month, font, currentPosition, dayDateGroup);
    const lastMeshX = createDayDateMesh(day, font, currentPosition, dayDateGroup);
    scene.add(dayDateGroup);

    // Adjust the Day/Date box to fit
    const newLeftX = lastMeshX - SIZES.DAY_DATE_SPACING;
    const newWidth = DAY_DATE_BOX_RIGHT_X - newLeftX;
    const newScale = newWidth / DAY_DATE_FRAME_WIDTH;

    MESHES.dayDateBox.scale.x = newScale;
    MESHES.dayDateBox.position.x = (DAY_DATE_BOX_RIGHT_X + newLeftX) / 2;

    // Adjust the Day/Date frames to fit
    MESHES.dayDateLeftFrame.position.x = newLeftX;
    ['dayDateTopFrame', 'dayDateBottomFrame'].forEach(frame => {
        MESHES[frame].position.x = MESHES.dayDateBox.position.x;
        MESHES[frame].scale.x = newScale;
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

    const digitalTimeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const currentSecond = currentTime.getSeconds();

    const shouldUpdate = currentSecond !== lastSecond || digitalDisplayExists !== lastDigitalDisplayExists;

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

    if (!digitalDisplayExists) {
        lastSecond = currentSecond;
        lastDigitalDisplayExists = digitalDisplayExists;
        return;
    }

    // Create and add new digital time display
    const digitalTimeGeometry = createDigitalTimeGeometry(digitalTimeStr, font);
    digitalTimeGeometry.center();

    const digitalDisplayMesh = createDigitalDisplayMesh(digitalTimeGeometry);
    digitalDisplayMesh.name = 'digitalDisplay';
    digitalDisplayMesh.position.x = 0
    digitalDisplayMesh.position.y = SIZES.CLOCK_RADIUS * 1/3;
    digitalDisplayMesh.position.z = 0.01;

    scene.add(digitalDisplayMesh);

    // Add complication box if necessary
    for (const part of DIGITAL_DISPLAY_PARTS) {
        if (!scene.getObjectByName(part)) {
            scene.add(MESHES[part]);
        }
    }

    lastSecond = currentSecond;
    lastDigitalDisplayExists = digitalDisplayExists;
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
        const outerIndicatorName = `outerIndicator${i}`;
        const indicator = scene.getObjectByName(indicatorName);
        const outerIndicator = scene.getObjectByName(outerIndicatorName);

        // Hours
        if (hourIndicatorsExist && i % 5 === 0) {
            if (i === 15) {
                if (!dayDateExists && !indicator) {
                    scene.add(INDICATORS[i]);
                    scene.add(OUTER_INDICATORS[i]);
                } else if (dayDateExists && indicator) {
                    scene.remove(indicator);
                    scene.remove(outerIndicator);
                }
            } else {
                scene.add(INDICATORS[i]);
                scene.add(OUTER_INDICATORS[i]);
            }
        } else if (!hourIndicatorsExist && i % 5 === 0 && indicator) {
            scene.remove(indicator);
            scene.remove(outerIndicator);
        }

        // Minutes
        if (minuteIndicatorsExist && i % 5 != 0) {
            if (!indicator) {
                scene.add(INDICATORS[i]);
                scene.add(OUTER_INDICATORS[i]);
            }
        } else if (!minuteIndicatorsExist && i % 5 != 0) {
            scene.remove(indicator);
            scene.remove(outerIndicator);
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
 * Due to the design choice of having the day/date window cover the
 * 3 o'clock position, the logic here is particularly complex.
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
        if (index === 3) {
            if (!dayDateExists && !numberObject) {
                scene.add(numbersArray[index * multiplier]);
            } else if (dayDateExists && numberObject) {
                scene.remove(numberObject);
            }
        } else {
            scene.add(numbersArray[index * multiplier]);
        }
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
