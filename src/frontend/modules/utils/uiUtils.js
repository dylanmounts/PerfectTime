/**
 * uiUtils.js - User Interface utilities for the perfect clock.
 */


import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen';
import { Toast } from 'bootstrap';
import { StatusBar } from '@capacitor/status-bar';

import { language, useTwentyFourHour } from '../clock/clockUpdater';
import * as deviceUtils from './deviceUtils';
import { initializeState, updateCameraZoom } from '../managers/sceneManager';
import { timeManager } from '../managers/timeManager';
import * as colorManager from '../managers/colorManager';


let iOSFullscreen = false;
let interactionTimer;
let lastMinute = null;

/**
 * Sets up a toggle for a Bootstrap toast element and manages button styles.
 *
 * @param {string} buttonId - The ID of the button that triggers the toast.
 * @param {string} toastId - The ID of the toast element.
 */
export function setupToastToggle(buttonId, toastId) {
    const buttonEl = document.getElementById(buttonId);
    const toastEl = document.getElementById(toastId);
    if (!buttonEl || !toastEl) return;

    const toast = Toast.getOrCreateInstance(toastEl);

    buttonEl.addEventListener('click', () => {
        if (toastEl.classList.contains('show')) {
            toggleButton(buttonEl, 'active');
            toast.hide();
        } else {
            buttonEl.classList.remove('active');
            toggleButton(buttonEl, 'inactive');
            toast.show();
        }
    });

    toastEl.addEventListener('show.bs.toast', () => {
        if (!buttonEl.classList.contains('active')) {
            toggleButton(buttonEl, 'active');
        }
    });

    toastEl.addEventListener('hide.bs.toast', () => {
        if (buttonEl.classList.contains('active')) {
            toggleButton(buttonEl, 'inactive');
        }
    });

    document.addEventListener('click', function(e) {
        const toastShowing = toastEl.classList.contains('showing');
        const toastShown = toastEl.classList.contains('show');
        const toastClicked = toastEl.contains(e.target);

        if (toastShown && !toastShowing && !toastClicked) {
            toggleButton(buttonEl, 'inactive');
            toast.hide();
        }
    });
}

/**
 * Sets up the toggle for entering and exiting full screen.
 */
export function setupFullscreenToggle() {
    if (deviceUtils.isiPhone()) return;

    const fullscreenBtn = document.getElementById("fullscreenBtn");
    fullscreenBtn.addEventListener('click', () => {
        if (fullscreenBtn.classList.contains('active')) {
            toggleButton(fullscreenBtn, 'inactive');
        } else {
            toggleButton(fullscreenBtn, 'active');
        }
    });
}

/**
 * Handles changes on a checkbox and triggers a callback function.
 *
 * @param {string} checkboxId - The ID of the checkbox.
 * @param {Function} callback - The function to call when the checkbox state changes.
 */
export function handleCheckboxChange(checkboxId, callback) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            callback(checkbox.checked);
        });
    }
}

/**
 * Initializes zoom controls for the UI.
 */
export function setupZoomControls() {
    const zoomSlider = document.getElementById('zoomSlider');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');

    if (!zoomSlider || !zoomInBtn || !zoomOutBtn) return;

    zoomSlider.addEventListener('input', (event) => {
        const zoomLevel = parseFloat(event.target.value);
        updateCameraZoom(zoomLevel);
    });

    zoomInBtn.addEventListener('click', () => {
        const step = 10;
        const zoomLevel = Math.min(parseInt(zoomSlider.value) + step, parseInt(zoomSlider.max));
        updateCameraZoom(zoomLevel);
    });

    zoomOutBtn.addEventListener('click', () => {
        const step = 10;
        const zoomLevel = Math.max(parseInt(zoomSlider.value) - step, parseInt(zoomSlider.min));
        updateCameraZoom(zoomLevel);
    });
}

/**
 * Initializes the controls for toggling between light and dark color scheme.
 */
export function setupColorSchemeToggle() {
    const useDarkScheme = document.getElementById('useDarkScheme');

    useDarkScheme.addEventListener('change', () => {
        colorManager.switchScheme(useDarkScheme.checked ? 'dark' : 'light');
    });
}

/**
 * Initializes the controls for toggling between 12 and 24-hour time.
 */
export function setupTimeFormatToggle() {
    const twelveHour = document.getElementById('twelveHour');
    const twentyFourHour = document.getElementById('twentyFourHour');
    const useTwentyFourHour = document.getElementById('useTwentyFourHour');
    initializeState('useTwentyFourHour');

    twelveHour.addEventListener('click', () => {
        useTwentyFourHour.checked = false;
    });

    twentyFourHour.addEventListener('click', () => {
        useTwentyFourHour.checked = true;
    });
}

/**
 * Initializes the controls for toggling between classic and dynamic clock shapes.
 */
export function setupDynamicClockToggle() {
    const roundClock = document.getElementById('roundClock');
    const dynamicClock = document.getElementById('dynamicClock');
    const useDynamicClock = document.getElementById('useDynamicClock');

    const isDynamicClock = initializeState('useDynamicClock');
    useDynamicClock.checked = isDynamicClock;

    roundClock.addEventListener('click', () => {
        useDynamicClock.checked = false;
        localStorage.setItem('useDynamicClock', 'false');
    })

    dynamicClock.addEventListener('click', () => {
        useDynamicClock.checked = true;
        localStorage.setItem('useDynamicClock', 'true');
    })
}

/**
 * Sets the language based on the user's browser settings.
 */
export function setLanuage() {
    const userLanguage = navigator.language || navigator.userLanguage;
    localStorage.setItem('language', 'en-US')

    const selectElement = document.getElementById('languageSelect');
    for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];

        if (userLanguage.startsWith(option.value.split('-')[0])) {
            option.selected = true;
            localStorage.setItem('language', option.value);
            break;
        }
    }
}

/**
 * Toggles a given button to be active or inactive.
 * @param {HTMLElement} btnEl - The button element to toggle.
 * @param {string} state - The state to set the button, either 'active' or 'inactive'
 */
export function toggleButton(btnEl, state) {
    const isActive = state === 'active';
    btnEl.classList.toggle('active', isActive);

    if (deviceUtils.isTouchDevice() || deviceUtils.isAppleDevice()) {
        const colors = colorManager.BUTTON_COLORS;
        btnEl.style.backgroundColor = isActive ? colors.ACTIVE_BG : colors.INACTIVE_BG;
        btnEl.style.color = isActive ? colors.ACTIVE : colors.INACTIVE;
    }
}

/**
 * Sets the color scheme based on the user or system preference.
 */
export function setColorScheme() {
    let preferredScheme = localStorage.getItem('useDarkScheme');
    const darkSchemeSelector = document.getElementById('useDarkScheme');

    // If user preference exists in localStorage, apply it
    if (preferredScheme !== null) {
        preferredScheme = preferredScheme === 'true';
        colorManager.switchScheme(preferredScheme ? 'dark' : 'light');
        darkSchemeSelector.checked = preferredScheme;
    } else {
        // Otherwise, use system preference
        const systemScheme = deviceUtils.detectSystemColorScheme();
        colorManager.switchScheme(systemScheme);
        darkSchemeSelector.checked = (systemScheme === 'dark');
    }
}

/**
 * Toggles the UI's visibilty.
 * 
 * @param {boolean} makeVisible - Whether or not the UI should be visible.
 */
export function toggleUIVisibility(makeVisible) {
    const uiContainer = document.getElementById('uiContainer')
    if (makeVisible) {
        uiContainer.style.opacity = '1';
    } else {
        uiContainer.style.opacity = '0';
    }
    handleInteractionTimer();
}

/**
 * Sets or clears the timer which toggles the UI depending on user interaction.
 */
export function handleInteractionTimer() {
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    clearTimeout(interactionTimer);
    if (fullscreenBtn.classList.contains("active")) {
        interactionTimer = setTimeout(() => toggleUIVisibility(false), 2500);
    }
}

/**
 * Handle GUI changes on fullscreen mode.
 * @param {boolean} isFullscreen - Indicates if fullscreen mode is active.
 */
export function toggleGUI(isFullscreen) {
    const isPortrait = deviceUtils.isPortraitMode()
    const btnEl = document.getElementById("fullscreenBtn");

    if (isFullscreen) {
        if (deviceUtils.isAppleDevice() && !window.IS_WEB_APP) {
            StatusBar.hide();
        } else if (deviceUtils.isTouchDevice() && !window.IS_WEB_APP) {
            AndroidFullScreen.immersiveMode();
        }
        toggleButton(btnEl, "active");
    } else {
        if (deviceUtils.isAppleDevice()) {
            if (!deviceUtils.isiPhone() && !window.IS_WEB_APP) {
                StatusBar.show();
                toggleButton(btnEl, "inactive");
            } else if (isPortrait && iOSFullscreen && !window.IS_WEB_APP) {
                StatusBar.show();
                toggleButton(btnEl, "inactive");
            } else if (deviceUtils.isiPhone() && window.IS_WEB_APP) {
                toggleButton(btnEl, "inactive");
            }
        } else {
            if (deviceUtils.isTouchDevice()) {
                AndroidFullScreen.showSystemUI();
            }
            toggleButton(btnEl, "inactive");
        }
    }

    handleInteractionTimer();
    document.addEventListener('mousemove', () => toggleUIVisibility(true));
    document.addEventListener('touchstart', () => toggleUIVisibility(true));
    document.addEventListener('keypress', () => toggleUIVisibility(true));

    iOSFullscreen = isFullscreen;
}

/**
 * Toggle fullscreen mode.
 */
export function toggleFullscreen() {
    if (deviceUtils.isAppleDevice() && !window.IS_WEB_APP) {
        toggleGUI(!iOSFullscreen)
    } else if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

/**
 * Adjusts toast container positions for touch devices.
 */
export function adjustToastsForTouch() {
    if (deviceUtils.isTouchDevice() || deviceUtils.isAppleDevice()) {
        const toastContainers = document.querySelectorAll('.toast-container');
        toastContainers.forEach(container => {
            container.classList.remove('top-0', 'start-0', 'end-0');
            container.classList.add('top-50', 'start-50', 'translate-middle');
        });
    }
}

/**
 * Handles changes when the app becomes visible after being inactive
 */
function handleVisibilityChange() {
    if (!document.hidden) {
        updateTitleTime();
    }
}

/**
 * Sets the interval for updating the time displayed in the HTML title.
 */
export function setupTitleTime() {
    setInterval(() => {
        updateTitleTime();
    }, 250);
    document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
    );
}

/**
 * Updates the HTML title to reflect the current time.
 * @param {boolean} forceUpdate - If true, forces an update even if the minute hasn't changed.
 */
export function updateTitleTime(forceUpdate = false) {
    const foundTime = timeManager.getCurrentTime()

    const shouldUpdate = (
        foundTime !== null
            && (forceUpdate || lastMinute !== foundTime.getMinutes())
    );

    if (!shouldUpdate) return;

    let titleString = foundTime.toLocaleTimeString(language, {
        hour12: !useTwentyFourHour,
        hour: 'numeric',
        minute: '2-digit',
    });
    titleString += " | PerfectTime.org"

    document.title = titleString;

    lastMinute = foundTime.getMinutes();
}
