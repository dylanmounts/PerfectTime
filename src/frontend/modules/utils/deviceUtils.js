/**
 * deviceUtils.js - Utility functions for device-specific interactions in the perfect clock.
 */


import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen';
import * as uiUtils from './uiUtils';

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
  * Check if the current device is in portait orientation.
  * @returns {boolean} True if portrait, false if landscape
  */
 export function isPortraitMode() {
    let isPortrait;

    try {
        isPortrait = screen.orientation.angle === 0 || screen.orientation.angle === 180;   
    } catch (error) {
        isPortrait = true;
    }

    return isPortrait;
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
 * Apply specific styles for the web (desktop) app.
 */
export function applyWebAppStyles() {
    if (!window.IS_WEB_APP) return ;

    const appStoresContainer = document.getElementById('appStoresContainer')
    if (appStoresContainer) appStoresContainer.classList.add('d-flex');
}

/**
 * Handle device orientation changes.
 */
export function handleOrientationChange() {
    const isPortrait = isPortraitMode()

    if (isiPhone()) {
        isPortrait ? uiUtils.toggleGUI(false) : uiUtils.toggleGUI(true);
    } else if (isTouchDevice() && !document.fullscreenElement) {
        isPortrait ? AndroidFullScreen.showSystemUI() : AndroidFullScreen.showUnderSystemUI();
    }

    uiUtils.toggleUIVisibility(true);
}

/**
 * Detects the user's preferred color scheme.
 *
 * @returns {string} 'light' or 'dark' based on the user's system. Defaults to dark.
 */
export function detectSystemColorScheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }

    return 'dark';
}
