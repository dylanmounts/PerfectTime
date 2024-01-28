/**
 * uiUtils.js - User Interface utilities for the perfect clock.
 * 
 * This module contains functions for managing UI elements and interactions within PerfectTime.
 * It includes setup for Bootstrap toast elements, handling checkbox changes for user settings,
 * and potentially more UI-related functionalities.
 */


import { Button, Toast } from 'bootstrap';

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

    const button = Button.getOrCreateInstance(buttonEl);
    const toast = Toast.getOrCreateInstance(toastEl);

    buttonEl.addEventListener('click', () => {
        button.toggle();
        if (toastEl.classList.contains('show')) {
            toast.hide();
        } else {
            toast.show();
        }
    });

    toastEl.addEventListener('show.bs.toast', () => {
        styleVisible(buttonEl);
        if (!buttonEl.classList.contains('active')) {
            button.toggle();
        }
    });

    toastEl.addEventListener('hidden.bs.toast', () => {
        styleHidden(buttonEl);
        if (buttonEl.classList.contains('active')) {
            button.toggle();
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
