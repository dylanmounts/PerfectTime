/**
 * deviceUtils.js - Utility functions for device-specific interactions in the perfect clock.
 * 
 * This module provides a set of functions to enhance the user experience on different devices.
 * It includes detecting touch devices, applying specific styles for touch-enabled interfaces,
 * managing fullscreen mode, and handling orientation changes.
 */


import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen';
import { Button } from 'bootstrap';
import { StatusBar } from '@capacitor/status-bar';

/**
 * Check if the current device is a touch device.
 * @returns {boolean} True if it's a touch device, otherwise false.
 */
export function isTouchDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
}

/**
 * Apply specific styles for touch devices.
 */
export function applyTouchDeviceStyles() {
    if (!isTouchDevice()) return;

    const configButtonContainer = document.querySelector('.config-button-container');
    const infoMenuBtn = document.getElementById('infoMenuBtn');

    if (configButtonContainer) {
        configButtonContainer.style.bottom = '25px';
        configButtonContainer.style.right = '15px';
        configButtonContainer.style.top = 'auto';
    }

    if (infoMenuBtn) {
        infoMenuBtn.style.bottom = '25px';
        infoMenuBtn.style.left = '15px';
        infoMenuBtn.style.top = 'auto';
    }
}

/**
 * Toggle fullscreen mode.
 */
export function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

/**
 * Handle GUI changes on fullscreen mode.
 * @param {boolean} isFullscreen - Indicates if fullscreen mode is active.
 */
export function toggleGUI(isFullscreen) {
    const btnEl = document.getElementById("fullscreenBtn");
    const btn = Button.getOrCreateInstance(btnEl);

    btn.toggle();
    if (isFullscreen) {
        if (isTouchDevice()) {
            StatusBar.hide();
            AndroidFullScreen.immersiveMode();
            btnEl.style.backgroundColor = "#585f63";
            btnEl.style.color = "#e8e6e3";
        }
    } else {
        if (isTouchDevice()) {
            StatusBar.show();
            AndroidFullScreen.showSystemUI();
            btnEl.style.backgroundColor = "transparent";
            btnEl.style.color = "#6c757d";
        }
    }
}

/**
 * Handle device orientation changes.
 */
export function handleOrientationChange() {
    const isPortrait = screen.orientation.angle === 0 || screen.orientation.angle === 180;
    if (!document.fullscreenElement) {
        isPortrait ? AndroidFullScreen.showSystemUI() : AndroidFullScreen.showUnderSystemUI();
    }
}

/**
 * Adjusts toast container positions for touch devices.
 */
export function adjustToastsForTouch() {
    if (isTouchDevice()) {
        const toastContainers = document.querySelectorAll('.toast-container');
        toastContainers.forEach(container => {
            container.classList.remove('top-0', 'start-0', 'end-0');
            container.classList.add('top-50', 'start-50', 'translate-middle');
        });
    }
}
