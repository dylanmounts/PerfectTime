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

import { DAY_DATE_PARTS, DIGITAL_DISPLAY_PARTS, HOUR_NUMBERS, INDICATORS, OUTER_INDICATORS, MINUTE_NUMBERS, SIZES } from '../constants.js';
import { createDayDateMesh, createDigitalDisplayMesh, MESHES } from '../visuals/meshes.js';
import { timeManager } from '../managers/timeManager.js';
import { createDayDateGeometry, createDigitalTimeGeometry } from '../visuals/geometries.js';


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
let lastTime = null;
let lastSecond = null;
let lastDayDate = null;
let lastDayDateExists = null;
let lastDigitalDisplayExists = null;

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
    MESHES.outerHourHand.rotation.z = -hourAngle;
    MESHES.minuteHand.rotation.z = -minuteAngle;
    MESHES.outerMinuteHand.rotation.z = -minuteAngle;
    MESHES.secondHand.rotation.z = -secondAngle;
    MESHES.outerSecondHand.rotation.z = -secondAngle;

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

    const day = currentTime.toLocaleString('en-US', { weekday: 'short' });
    const date = currentTime.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    const dayDateStr = `${day.toUpperCase()} ${date}`;

    const shouldUpdate = dayDateStr !== lastDayDate || dayDateExists !== lastDayDateExists;

    if (shouldUpdate) {
        const prevDayDateDisplay = scene.getObjectByName('dayDateDisplay');
        if (prevDayDateDisplay) {
            prevDayDateDisplay.geometry.dispose();
            prevDayDateDisplay.material.dispose();
            scene.remove(prevDayDateDisplay);
        }

        // Remove the associated complication box if it exists and the day/date doesn't
        if (!dayDateExists) {
            for (const part of DAY_DATE_PARTS) {
                const prevPart = scene.getObjectByName(part);
                if (prevPart) {
                    scene.remove(prevPart);
                }
            }
        }

        if (dayDateExists) {
            // Create the new day/date display
            const dayDateGeometry = createDayDateGeometry(dayDateStr, font);
            dayDateGeometry.center();

            const dayDateMesh = createDayDateMesh(dayDateGeometry);
            dayDateMesh.name = 'dayDateDisplay';
            dayDateMesh.position.set(
                MESHES.dayDateBox.position.x,
                MESHES.dayDateBox.position.y,
                MESHES.dayDateBox.position.z + 0.01
            );

            scene.add(dayDateMesh);

            // Add complication box if necessary
            for (const part of DAY_DATE_PARTS) {
                if (!scene.getObjectByName(part)) {
                    scene.add(MESHES[part]);
                }
            }
        }

        lastDayDate = dayDateStr;
        lastDayDateExists = dayDateExists;
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

    const digitalTimeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const currentSecond = currentTime.getSeconds();

    const shouldUpdate = currentSecond !== lastSecond || digitalDisplayExists !== lastDigitalDisplayExists;

    if (shouldUpdate) {
        const prevDigitalDisplay = scene.getObjectByName('digitalDisplay');
        if (prevDigitalDisplay) {
            prevDigitalDisplay.geometry.dispose();
            prevDigitalDisplay.material.dispose();
            scene.remove(prevDigitalDisplay);
        }

        // Remove associated complication box if it exists and the digital time doesn't
        if (!digitalDisplayExists) {
            for (const part of DIGITAL_DISPLAY_PARTS) {
                const prevPart = scene.getObjectByName(part);
                if (prevPart) {
                    scene.remove(prevPart);
                }
            }
        }

        if (digitalDisplayExists) {
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
        }

        lastSecond = currentSecond;
        lastDigitalDisplayExists = digitalDisplayExists;
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
 * Due to the design choice of having the day/date window cover the 
 * 3 o'clock position, the logic here is particularly complex.
 * 
 * @param {Object} scene - The Three.js scene object.
 * @param {Object} font - The font used for the day-date display.
 */
function updateNumbers(scene) {
    for (let i = 1; i <= 12; i++) {
        const hourName = `hour${i}`;
        const outerHourName = `outerHour${i}`
        const minuteName = `minute${i * 5}`;

        const hourNumber = scene.getObjectByName(hourName);
        const outerHourNumber = scene.getObjectByName(outerHourName);
        const minuteNumber = scene.getObjectByName(minuteName);

        // Hours
        if (hourNumbersExist) {
            if (i === 3) {
                if (!dayDateExists && !hourNumber) {
                    scene.add(HOUR_NUMBERS[i]);
                } else if (dayDateExists && hourNumber) {
                    scene.remove(hourNumber);
                    scene.remove(outerHourNumber);
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

    let offsetInSeconds = (offset / 1000).toFixed(1);

    offsetNumberField.textContent = Math.abs(offsetInSeconds);
    offsetDirectionField.textContent = offset > 0 ? "behind" : "ahead";
}
