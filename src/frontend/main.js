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


import '../frontend/scss/styles.scss';
import * as ClockUpdater from './modules/clock/clockUpdater';
import { initializeScene, onWindowResize } from './modules/managers/sceneManager';
import * as DeviceUtils from './modules/utils/deviceUtils';
import * as UIUtils from './modules/utils/uiUtils';

// Style functions for toast buttons
function styleButtonForToastVisible(btn) {
    if (DeviceUtils.isTouchDevice()) {
        btn.style.backgroundColor = "#585f63";
        btn.style.color = "#e8e6e3";
    }
}

function styleButtonForToastHidden(btn) {
    if (DeviceUtils.isTouchDevice()) {
        btn.style.backgroundColor = "transparent";
        btn.style.color = "#6c757d";
    }
}

// Initialize and configure UI components
UIUtils.setupToastToggle('optionsMenuBtn', 'optionsMenu', styleButtonForToastVisible, styleButtonForToastHidden);
UIUtils.setupToastToggle('infoMenuBtn', 'infoMenu', styleButtonForToastVisible, styleButtonForToastHidden);
UIUtils.setupZoomControls();

// Create checkbox event listeners for clock features
const clockOptions = [
    { id: 'dayDateOption', toggleFunction: ClockUpdater.toggleDayDate },
    { id: 'digitalTimeOption', toggleFunction: ClockUpdater.toggleDigitalDisplay },
    { id: 'hourIndicatorsOption', toggleFunction: ClockUpdater.toggleHourIndicators },
    { id: 'hoursOption', toggleFunction: ClockUpdater.toggleHourNumbers },
    { id: 'hourHandOption', toggleFunction: ClockUpdater.toggleHourHand },
    { id: 'minuteIndicatorsOption', toggleFunction: ClockUpdater.toggleMinuteIndicators },
    { id: 'minutesOption', toggleFunction: ClockUpdater.toggleMinuteNumbers },
    { id: 'minuteHandOption', toggleFunction: ClockUpdater.toggleMinuteHand },
    { id: 'secondHandOption', toggleFunction: ClockUpdater.toggleSecondHand },
    { id: 'sweepingSecondsOption', toggleFunction: ClockUpdater.toggleSweepingSeconds }
];
clockOptions.forEach(option => UIUtils.handleCheckboxChange(option.id, option.toggleFunction));

// Fullscreen and orientation change event listeners
document.getElementById('fullscreenBtn').addEventListener('click', DeviceUtils.toggleFullscreen);
document.addEventListener('fullscreenchange', () => {
    const isFullscreen = !!document.fullscreenElement;
    DeviceUtils.toggleGUI(isFullscreen);
    if (!isFullscreen) {
        DeviceUtils.handleOrientationChange();
    }
});
window.addEventListener("orientationchange", DeviceUtils.handleOrientationChange);
window.addEventListener('resize', onWindowResize);

// Responsive adjustments for touch devices
window.addEventListener('resize', DeviceUtils.applyTouchDeviceStyles);
window.addEventListener('orientationchange', DeviceUtils.applyTouchDeviceStyles);
DeviceUtils.applyTouchDeviceStyles();
DeviceUtils.adjustToastsForTouch();

// Tick tock run the clock
initializeScene();
