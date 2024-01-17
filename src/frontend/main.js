/**
 * main.js - The core script for PerfectTime.org.
 *
 * PerfectTime.org is an overengineered analog clock, rendered using Three.js,
 * designed to show perfectly accurate time, synchronized with the NTP pool. This
 * script serves as the entry point for the frontend, setting up the 3D clock
 * visualization and managing user interactions. It initializes the scene, 
 * configures event listeners, and handles UI elements for customizing the clock display.
 *
 * Features include:
 *  - 3D analog clock rendering.
 *  - Synchronization with NTP for accurate timekeeping.
 *  - User interface for various display options.
 *
 * Dependencies: 
 *  - Three.js for 3D rendering.
 *  - Bootstrap for UI components.
 *  - Clock and manager modules for functionality and scene management.
 */


import { Toast } from 'bootstrap';

import '../frontend/scss/styles.scss'
import { initializeScene, onWindowResize } from './modules/managers/sceneManager';
import { toggleDayDate, toggleDigitalDisplay, toggleHourIndicators, toggleHourNumbers, toggleHourHand, toggleMinuteIndicators, toggleMinuteNumbers, toggleMinuteHand, toggleSecondHand, toggleSweepingSeconds } from './modules/clock/clockUpdater';


// Bootstrap components
const optionsTrigger = document.getElementById('optionsMenuBtn')
const optionsMenu = document.getElementById('optionsMenu')
const infoTrigger = document.getElementById('infoMenuBtn')
const infoMenu = document.getElementById('infoMenu')

// Initialize Bootstrap Toasts, which serve as options and info menus
if (optionsTrigger) {
        const toastBootstrap = Toast.getOrCreateInstance(optionsMenu)
        optionsTrigger.addEventListener('click', () => {
            toastBootstrap.show()
    })
}
if (infoTrigger) {
        const toastBootstrap = Toast.getOrCreateInstance(infoMenu)
        infoTrigger.addEventListener('click', () => {
            toastBootstrap.show()
    })
}

/**
 * Adds an event listener to the checkbox.
 * 
 * @param {string} checkboxId - The HTML ID of the checkbox
 * @param {Function} callback - What to run on change
 */
function handleCheckboxChange(checkboxId, callback) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            callback(checkbox.checked);
        });
    }
}

// Create the event listeners
handleCheckboxChange('dayDateOption', toggleDayDate);
handleCheckboxChange('digitalTimeOption', toggleDigitalDisplay);
handleCheckboxChange('hourIndicatorsOption', toggleHourIndicators);
handleCheckboxChange('hoursOption', toggleHourNumbers);
handleCheckboxChange('hourHandOption', toggleHourHand);
handleCheckboxChange('minuteIndicatorsOption', toggleMinuteIndicators);
handleCheckboxChange('minutesOption', toggleMinuteNumbers);
handleCheckboxChange('minuteHandOption', toggleMinuteHand);
handleCheckboxChange('secondHandOption', toggleSecondHand);
handleCheckboxChange('sweepingSecondsOption', toggleSweepingSeconds);
window.addEventListener('resize', onWindowResize);

// Tick tock run the clock
initializeScene();
