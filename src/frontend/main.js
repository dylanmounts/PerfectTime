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

import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen';
import { Button, Toast } from 'bootstrap';

import '../frontend/scss/styles.scss'
import { initializeScene, onWindowResize } from './modules/managers/sceneManager';
import * as ClockUpdater from './modules/clock/clockUpdater';


// Bootstrap components
const optionsBtn = document.getElementById('optionsMenuBtn');
const optionsMenu = document.getElementById('optionsMenu');
const infoBtn = document.getElementById('infoMenuBtn');
const infoMenu = document.getElementById('infoMenu');

    
function isTouchDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
}

// Function to apply styles when the toast is shown
function styleButtonForToastVisible(btn) {
    if (isTouchDevice()) {
        console.log("here1");
        btn.style.backgroundColor = "#585f63";
        btn.style.color = "#e8e6e3";
    }
}

// Function to apply styles when the toast is hidden
function styleButtonForToastHidden(btn) {
    if (isTouchDevice()) {
        console.log("here2");
        btn.style.backgroundColor = "transparent";
        btn.style.color = "#6c757d";
    }
}

// Function to toggle toast visibility
function toggleToast(toastInstance, toastElement, btn) {
    if (toastElement.classList.contains('show')) {
        toastInstance.hide();
    } else {
        toastInstance.show();
        styleButtonForToastVisible(btn);
    }
}

// Initialize Bootstrap components and event listeners
if (optionsBtn && optionsMenu) {
    const optionsToast = Toast.getOrCreateInstance(optionsMenu);

    optionsBtn.addEventListener('click', () => {
        toggleToast(optionsToast, optionsMenu, optionsBtn);
    });

    optionsMenu.addEventListener('show.bs.toast', () => {
        styleButtonForToastVisible(optionsBtn);
    });

    optionsMenu.addEventListener('hidden.bs.toast', () => {
        styleButtonForToastHidden(optionsBtn);
    });
}

if (infoBtn && infoMenu) {
    const infoToast = Toast.getOrCreateInstance(infoMenu);

    infoBtn.addEventListener('click', () => {
        toggleToast(infoToast, infoMenu, infoBtn);
    });

    infoMenu.addEventListener('show.bs.toast', () => {
        styleButtonForToastVisible(infoBtn);
    });

    infoMenu.addEventListener('hidden.bs.toast', () => {
        styleButtonForToastHidden(infoBtn);
    });
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

// Create the checkbox event listeners
handleCheckboxChange('dayDateOption', ClockUpdater.toggleDayDate);
handleCheckboxChange('digitalTimeOption', ClockUpdater.toggleDigitalDisplay);
handleCheckboxChange('hourIndicatorsOption', ClockUpdater.toggleHourIndicators);
handleCheckboxChange('hoursOption', ClockUpdater.toggleHourNumbers);
handleCheckboxChange('hourHandOption', ClockUpdater.toggleHourHand);
handleCheckboxChange('minuteIndicatorsOption', ClockUpdater.toggleMinuteIndicators);
handleCheckboxChange('minutesOption', ClockUpdater.toggleMinuteNumbers);
handleCheckboxChange('minuteHandOption', ClockUpdater.toggleMinuteHand);
handleCheckboxChange('secondHandOption', ClockUpdater.toggleSecondHand);
handleCheckboxChange('sweepingSecondsOption', ClockUpdater.toggleSweepingSeconds);

// Fullscreen toggling
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);

function toggleGUI(isFullscreen) {
    const btn = document.getElementById("fullscreenBtn");
    const bootstrapBtn = Button.getOrCreateInstance(btn);

    if (isFullscreen) {
        bootstrapBtn.toggle();
        if (isTouchDevice()) {
            AndroidFullScreen.immersiveMode();
            btn.style.backgroundColor = "#585f63";
            btn.style.color = "#e8e6e3";
        }
    } else {
        bootstrapBtn.toggle();
        if (isTouchDevice()) {
            AndroidFullScreen.showSystemUI();
            btn.style.backgroundColor = "transparent";
            btn.style.color = "#6c757d";
        }
    }
}
function handleOrientationChange() {
    const isPortrait = screen.orientation.angle === 0 || screen.orientation.angle === 180;
    if (!document.fullscreenElement) {
        isPortrait ? AndroidFullScreen.showSystemUI() : AndroidFullScreen.showUnderSystemUI();
    }
}

document.addEventListener('fullscreenchange', () => {
    const isFullscreen = !!document.fullscreenElement;
    toggleGUI(isFullscreen);
    if (!isFullscreen) {
        handleOrientationChange();
    }
});

window.addEventListener("orientationchange", handleOrientationChange);
window.addEventListener('resize', onWindowResize);

function applyTouchDeviceStyles() {
    if (isTouchDevice()) {
        const buttonContainer = document.querySelector('.button-container');
        const configButtonContainer = document.querySelector('.config-button-container');
        const infoMenuBtn = document.getElementById('infoMenuBtn');

        if (buttonContainer) {
            buttonContainer.style.top = 'auto';
            buttonContainer.style.bottom = '10px';
        }

        if (configButtonContainer) {
            configButtonContainer.style.bottom = '10px';
            configButtonContainer.style.right = '10px';
            configButtonContainer.style.top = 'auto';
        }

        if (infoMenuBtn) {
            infoMenuBtn.style.bottom = '10px';
            infoMenuBtn.style.left = '10px';
            infoMenuBtn.style.top = 'auto';
        }
    }
}

// Call the function when the script loads
applyTouchDeviceStyles();

// Optionally, you might want to call this function on window resize or orientation change if the device capability might change
window.addEventListener('resize', applyTouchDeviceStyles);
window.addEventListener('orientationchange', applyTouchDeviceStyles);

// Tick tock run the clock
initializeScene();
