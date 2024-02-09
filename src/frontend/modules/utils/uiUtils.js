/**
 * uiUtils.js - User Interface utilities for the perfect clock.
 * 
 * This module contains functions for managing UI elements and interactions within PerfectTime.
 * It includes setup for Bootstrap toast elements, handling checkbox changes for user settings,
 * and potentially more UI-related functionalities.
 */


import { Toast } from 'bootstrap';

import { updateCameraZoom } from '../managers/sceneManager';

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
    if (state === 'active') {
        btnEl.style.backgroundColor = '#585f63'
        btnEl.style.color = '#e8e6e3'
    } else {
        btnEl.style.backgroundColor = 'transparent'
        btnEl.style.color = '#6c757d'
    }
}
