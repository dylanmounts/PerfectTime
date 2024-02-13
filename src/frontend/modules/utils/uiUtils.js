/**
 * uiUtils.js - User Interface utilities for the perfect clock.
 */


import { Button, Toast } from 'bootstrap';
import { StatusBar } from '@capacitor/status-bar';

import * as deviceUtils from './deviceUtils';
import { updateCameraZoom } from '../managers/sceneManager';
import * as colorManager from '../managers/colorManager';


let iOSFullscreen = false;
let interactionTimer;

/**
 * Sets up a toggle for a Bootstrap toast element and manages button styles.
 *
 * @param {string} buttonId - The ID of the button that triggers the toast.
 * @param {string} toastId - The ID of the toast element.
 * @param {Function} styleVisible - Function to style the button when toast is visible.
 * @param {Function} styleHidden - Function to style the button when toast is hidden.
 */
export function setupToastToggle(buttonId, toastId, styleVisible, styleHidden) {
    const buttonEl = document.getElementById(buttonId);
    const toastEl = document.getElementById(toastId);
    if (!buttonEl || !toastEl) return;

    const toast = Toast.getOrCreateInstance(toastEl);

    buttonEl.addEventListener('click', () => {
        if (toastEl.classList.contains('show')) {
            buttonEl.classList.remove('active');
            toggleButton(buttonEl, 'inactive');
            toast.hide();
        } else {
            buttonEl.classList.add('active');
            toggleButton(buttonEl, 'active');
            toast.show();
        }
    });

    toastEl.addEventListener('show.bs.toast', () => {
        styleVisible(buttonEl);
        if (!buttonEl.classList.contains('active')) {
            buttonEl.classList.add('active');
            toggleButton(buttonEl, 'active');
        }
    });

    toastEl.addEventListener('hide.bs.toast', () => {
        styleHidden(buttonEl);
        if (buttonEl.classList.contains('active')) {
            buttonEl.classList.remove('active');
            toggleButton(buttonEl, 'inactive');
        }
    });

    document.addEventListener('click', function(e) {
        const toastShowing = toastEl.classList.contains('showing');
        const toastShown = toastEl.classList.contains('show');
        const toastClicked = toastEl.contains(e.target);

        if (toastShown && !toastShowing && !toastClicked) {
            toast.hide();
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
    const lightScheme = document.getElementById('lightScheme');
    const darkScheme = document.getElementById('darkScheme');
    const useDarkScheme = document.getElementById('useDarkScheme');

    lightScheme.addEventListener('click', () => {
        useDarkScheme.checked = false;
    });

    darkScheme.addEventListener('click', () => {
        useDarkScheme.checked = true;
    });
}

/**
 * Initializes the controls for toggling between 12 and 24-hour time.
 */
export function setupTimeFormatToggle() {
    const twelveHour = document.getElementById('twelveHour');
    const twentyFourHour = document.getElementById('twentyFourHour');
    const useTwentyFourHour = document.getElementById('useTwentyFourHour');

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

    roundClock.addEventListener('click', () => {
        useDynamicClock.checked = false;
    })

    dynamicClock.addEventListener('click', () => {
        useDynamicClock.checked = true;
    })
}

/**
 * Sets the language based on the user's browser settings.
 */
export function setLanuage() {
    const userLanguage = navigator.language || navigator.userLanguage;

    const selectElement = document.getElementById('languageSelect');
    for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];

        if (userLanguage.startsWith(option.value.split('-')[0])) {
            option.selected = true;
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
    if (!deviceUtils.isTouchDevice()) {
        Button.getOrCreateInstance(btnEl).toggle();
        return;
    }
    if (state === 'active') {
        btnEl.style.backgroundColor = colorManager.BUTTON_COLORS.ACTIVE_BG;
        btnEl.style.color = colorManager.BUTTON_COLORS.ACTIVE;
        btnEl.classList.add('active');
    } else {
        btnEl.style.backgroundColor = colorManager.BUTTON_COLORS.INACTIVE_BG;
        btnEl.style.color = colorManager.BUTTON_COLORS.INACTIVE;
        btnEl.classList.remove('active');
    }
}

/**
 *  Sets the color scheme based on the user's system preference.
 */
export function setColorScheme() {
    const colorScheme = deviceUtils.detectSystemColorScheme();
    const darkSchemeSelector = document.getElementById('useDarkScheme');
    if (colorScheme === 'light') {
        colorManager.switchScheme('light');
        darkSchemeSelector.checked = false;
    } else {
        colorManager.switchScheme('dark');
        darkSchemeSelector.checked = true;
    };
}

/**
 * Toggles the UI's visibilty.
 * 
 * @param {boolean} makeVisible - Whether or not the UI should be visible.
 */
function toggleUIVisibility(makeVisible) {
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
function handleInteractionTimer() {
    const fullScreenBtn = document.getElementById("fullscreenBtn");
    clearTimeout(interactionTimer);
    if (fullScreenBtn.classList.contains("active")) {
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
        if (deviceUtils.isAppleDevice()) {
            StatusBar.hide();
        } else if (deviceUtils.isTouchDevice()) {
            AndroidFullScreen.immersiveMode();
        }
        toggleButton(btnEl, "active");
    } else {
        if (deviceUtils.isAppleDevice()) {
            if (!deviceUtils.isiPhone()) {
                StatusBar.show();
                toggleButton(btnEl, "inactive");
            }
            else if (isPortrait && iOSFullscreen) {
                StatusBar.show();
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
    if (deviceUtils.isAppleDevice()) {
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

// Style functions for toast buttons
export function styleButtonForToastVisible(btn) {
    if (deviceUtils.isTouchDevice()) {
        btn.style.backgroundColor = colorManager.BUTTON_COLORS.ACTIVE_BG;
        btn.style.color = colorManager.BUTTON_COLORS.ACTIVE;
    }
}

export function styleButtonForToastHidden(btn) {
    if (deviceUtils.isTouchDevice()) {
        btn.style.backgroundColor = colorManager.BUTTON_COLORS.INACTIVE_BG;
        btn.style.color = colorManager.BUTTON_COLORS.INACTIVE;
    }
}
