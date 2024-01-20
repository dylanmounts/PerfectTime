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

import { DAY_DATE_PARTS, DIGITAL_DISPLAY_PARTS, HOUR_NUMBERS, INDICATORS, MINUTE_NUMBERS } from '../constants.js';
import { createDayDateMesh, createDigitalDisplayMesh, MESHES } from '../visuals/meshes.js';
import { timeManager } from '../managers/timeManager.js';
import { createDayDateGeometry, createDigitalTimeGeometry } from '../visuals/geometries.js';


// State variables for the visibility of clock components.
let dayDateExists = true;
let digitalDisplayExists = true;
let hourIndicatorsExist = true;
let hourNumbersExist = true;
let hourHandExists = true;
let minuteIndicatorsExist = true;
let minuteNumbersExist = true;
let minuteHandExists = true;
let secondHandExists = true;
let sweepingSeconds = true;

// State variables for tracking the perfect time.
let currentTime = null;
let lastTime = null;

/**
 * Main function to update the clock based on the current time retrieved from the
 * backend time server.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} monoFont - The font used for monospaced elements.
 */
export function updateClock(scene, monoFont) {
    currentTime = timeManager.getCurrentTime();

    if (!currentTime) {
        return;
    }

    if (Math.abs(currentTime - lastTime) > 1000) {
        timeManager.fetchPerfectTime()
    }

    lastTime = currentTime;

    const hours = currentTime.getHours() % 12;
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const milliseconds = currentTime.getMilliseconds();

    const hourAngle = calculateHourAngle(hours, minutes, seconds, milliseconds);
    const minuteAngle = calculateMinuteAngle(minutes, seconds, milliseconds);
    const secondAngle = sweepingSeconds 
        ? calculateSweepingSecondAngle(seconds, milliseconds)
        : calculateSecondAngle(seconds);

    MESHES.hourHand.rotation.z = -hourAngle;
    MESHES.minuteHand.rotation.z = -minuteAngle;
    MESHES.secondHand.rotation.z = -secondAngle;

    updateTimeOffset();
    updateDigitalDisplay(scene, monoFont);
    updateDayDateDisplay(scene, monoFont);
    updateIndicators(scene);
    updateNumbers(scene);
    updateHourHand(scene);
    updateMinuteHand(scene);
    updateSecondHand(scene);
}

// Helper functions for calculating clock hand angles
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

function calculateSecondAngle(seconds) {
    return (Math.PI / 30) * seconds;
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

    // Get current date
    const day = currentTime.toLocaleString('en-US', { weekday: 'short' });
    const date = currentTime.toLocaleString('en-US', { month: 'short', day: 'numeric' });

    // Combine day and date
    const dayDateStr = `${day.toUpperCase()} ${date}`;

    // Remove previous day/date display if it exists
    const prevDayDateDisplay = scene.getObjectByName('dayDateDisplay');
    if (prevDayDateDisplay) {
        prevDayDateDisplay.geometry.dispose();
        prevDayDateDisplay.material.dispose();
        scene.remove(prevDayDateDisplay);

        for (const part of DAY_DATE_PARTS) {
            const prevPart = scene.getObjectByName(part);
            scene.remove(prevPart);
        }
    }

    // Create text geometry for day and date
    const dayDateGeometry = createDayDateGeometry(dayDateStr, font);
    dayDateGeometry.center();

    // Create mesh for day and date
    const dayDateMesh = createDayDateMesh(dayDateGeometry);
    dayDateMesh.name = 'dayDateDisplay'

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

    // Get current date
    const digitalTimeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Remove previous digital time display if it exists
    const prevDigitalDisplay = scene.getObjectByName('digitalDisplay');
    if (prevDigitalDisplay) {
        prevDigitalDisplay.geometry.dispose();
        prevDigitalDisplay.material.dispose();
        scene.remove(prevDigitalDisplay);

        for (const part of DIGITAL_DISPLAY_PARTS) {
            const prevPart = scene.getObjectByName(part);
            scene.remove(prevPart);
        }
    }

    // Create text geometry for digital time
    const digitalTimeGeometry = createDigitalTimeGeometry(digitalTimeStr, font);
    digitalTimeGeometry.center()

    // Create mesh for digital time
    const digitalDisplayMesh = createDigitalDisplayMesh(digitalTimeGeometry);
    digitalDisplayMesh.name = 'digitalDisplay';

    // Position inside the existing digital time box
    digitalDisplayMesh.position.x = Math.sin(0) * 5.0 * 1/3;
    digitalDisplayMesh.position.y = Math.cos(0) * 5.0 * 1/3;
    digitalDisplayMesh.position.z = 0 + 0.01;

    // Add to the scene
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
            if (i === 15) {
                if (!dayDateExists && !indicator) {
                    scene.add(INDICATORS[i]);
                } else if (dayDateExists && indicator) {
                    scene.remove(indicator);
                }
            } else {
                scene.add(INDICATORS[i]);
            }
        } else if (!hourIndicatorsExist && i % 5 === 0 && indicator) {
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
 * Due to the design choice of having the day/date window cover the 
 * 3 o'clock position, the logic here is particularly complex.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} font - The font used for the day-date display.
 */
function updateNumbers(scene) {
    for (let i = 1; i <= 12; i++) {
        const hourName = `hour${i}`;
        const minuteName = `minute${i * 5}`;

        const hourNumber = scene.getObjectByName(hourName);
        const minuteNumber = scene.getObjectByName(minuteName);

        // Hours
        if (hourNumbersExist) {
            if (i === 3) {
                if (!dayDateExists && !hourNumber) {
                    scene.add(HOUR_NUMBERS[i]);
                } else if (dayDateExists && hourNumber) {
                    scene.remove(hourNumber);
                }
            } else {
                scene.add(HOUR_NUMBERS[i]);
            }
        } else {
            scene.remove(hourNumber);
        }

        // Minutes
        if (minuteNumbersExist) {
            if (!minuteNumber) {
                scene.add(MINUTE_NUMBERS[i * 5]);
            }
        } else {
            scene.remove(minuteNumber);
        }
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
    if (hourHandExists && !hourHand) {
        scene.add(MESHES.hourHand);
    } else if (!hourHandExists && hourHand) {
        scene.remove(hourHand);
    }
}

// Adds or removes the minute hand from the scene based user configurations
export function updateMinuteHand(scene) {
    const minuteHand = scene.getObjectByName('minuteHand');
    if (minuteHandExists && !minuteHand) {
        scene.add(MESHES.minuteHand);
    } else if (!minuteHandExists && minuteHand) {
        scene.remove(minuteHand);
    }
}

// Adds or removes the second hand from the scene based user configurations
export function updateSecondHand(scene) {
    const secondHand = scene.getObjectByName('secondHand');
    if (secondHandExists && !secondHand) {
        scene.add(MESHES.secondHand);
    } else if (!secondHandExists && secondHand) {
        scene.remove(secondHand);
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

    let offsetInSeconds = (offset / 1000).toFixed(1);

    offsetNumberField.textContent = Math.abs(offsetInSeconds);
    offsetDirectionField.textContent = offset > 0 ? "behind" : "ahead";
}
