/**
 * deviceUtils.js - Utility functions for device-specific interactions in the perfect clock.
 * 
 * This module provides a set of functions to enhance the user experience on different devices.
 * It includes detecting touch devices, applying specific styles for touch-enabled interfaces,
 * managing fullscreen mode, and handling orientation changes.
 */


import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen';
import { StatusBar } from '@capacitor/status-bar';

let iOSFullscreen = false;

/**
 * Check if the current device is a touch device.
 * @returns {boolean} True if it's a touch device, otherwise false.
 */
export function isTouchDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
}

/** Check if the current device is an Apple device.
* @returns {boolean} True if it's an Apple device, otherwise false.
*/
export function isAppleDevice() {
   const userAgent = navigator.userAgent.toLowerCase();
   return /iphone|ipad|ipod|mac|os x/.test(userAgent);
}

/** Check if the current device is an iPhone.
* @returns {boolean} True if it's an iPhone, otherwise false.
*/
export function isiPhone() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /iphone/.test(userAgent);
 }

/**
 * Apply specific styles for touch devices.
 */
export function applyTouchDeviceStyles() {
    if (!(isTouchDevice() || isAppleDevice())) return;

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
    if (isAppleDevice()) {
        toggleGUI(!iOSFullscreen)
    } else if (!document.fullscreenElement) {
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
    let isPortrait
    try {
        isPortrait = screen.orientation.angle === 0 || screen.orientation.angle === 180;   
    } catch (error) {
        isPortrait = true;
    }

    const btnEl = document.getElementById("fullscreenBtn");
    const btnColorActive = "#e8e6e3"
    const btnColorInactive = "#6c757d"
    const btnBackgroundActive = "#585f63"
    const btnBackgroundInactive = "transparent"

    if (isFullscreen) {
        if (isAppleDevice()) {
            StatusBar.hide();
        } else if (isTouchDevice()) {
            AndroidFullScreen.immersiveMode();
        }
        btnEl.style.backgroundColor = btnBackgroundActive;
        btnEl.style.color = btnColorActive;
    } else {
        if (isAppleDevice()) {
            if (!isiPhone()) {
                StatusBar.show();
                btnEl.style.backgroundColor = btnBackgroundInactive;
                btnEl.style.color = btnColorInactive;
            }
            else if (isPortrait && iOSFullscreen) {
                StatusBar.show();
                btnEl.style.backgroundColor = btnBackgroundInactive;
                btnEl.style.color = btnColorInactive;
            }
        } else {
            if (isTouchDevice()) {
                AndroidFullScreen.showSystemUI();
            }
            btnEl.style.backgroundColor = btnBackgroundInactive;
            btnEl.style.color = btnColorInactive;
        }
    }

    iOSFullscreen = isFullscreen;
}

/**
 * Handle device orientation changes.
 */
export function handleOrientationChange() {
    let isPortrait
    try {
        isPortrait = screen.orientation.angle === 0 || screen.orientation.angle === 180;   
    } catch (error) {
        isPortrait = true;
    }
    if (isiPhone()) {
        isPortrait ? toggleGUI(false) : toggleGUI(true);
    } else if (isTouchDevice() && !document.fullscreenElement) {
        isPortrait ? AndroidFullScreen.showSystemUI() : AndroidFullScreen.showUnderSystemUI();
    }
}

/**
 * Adjusts toast container positions for touch devices.
 */
export function adjustToastsForTouch() {
    if (isTouchDevice() || isAppleDevice()) {
        const toastContainers = document.querySelectorAll('.toast-container');
        toastContainers.forEach(container => {
            container.classList.remove('top-0', 'start-0', 'end-0');
            container.classList.add('top-50', 'start-50', 'translate-middle');
        });
    }
}
