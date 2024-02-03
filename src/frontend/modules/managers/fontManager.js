/**
 * fontManager.js - Manages font resources for the perfect clock.
 */


import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { CLOCK_COMPLICATIONS_FONT, CLOCK_HOURS_FONT, CLOCK_MINUTES_FONT, SIZES, SEGMENTS } from '../constants';

class FontManager {
    constructor(url) {
        this.font = null;
        this.fontPromise = this.loadFont(url);
    }

    /**
     * Asynchronously loads a font from the provided URL.
     * 
     * @param {string} url - The URL of the font to load.
     * @returns {Promise} A promise that resolves to the loaded font.
     */
    loadFont(url) {
        return new Promise((resolve, reject) => {
            const loader = new FontLoader();
            loader.load(url, (loadedFont) => {
                this.font = loadedFont;
                resolve(loadedFont);
            }, undefined, function (error) {
                console.error('Error loading font:', error);
                reject(error);
            });
        });
    }

    /**
     * Creates a text mesh using the loaded font.
     * 
     * @param {string} text - The text to display with the mesh.
     * @param {Object} options - Options for creating the text mesh.
     * @returns {THREE.Mesh} A Three.js mesh displaying the text.
     */
    createTextMesh(text, options) {
        if (!this.font) {
            console.error('Font not loaded');
            return null;
        }

        const geometry = new TextGeometry(text, {
            font: this.font,
            size: options.size || SIZES.NUMBER_SIZE,
            height: options.height || SIZES.NUMBER_HEIGHT,
            curveSegments: SEGMENTS / 8,
            bevelEnabled: options.bevelEnabled || false
        });

        geometry.center();

        return new THREE.Mesh(geometry, options.material);
    }

    /**
     * Ensures the font is loaded and returns it.
     * 
     * @returns {THREE.Font} The loaded Three.js font.
     */
    async getLoadedFont() {
        await this.fontPromise;
        return this.font;
    }
}

export const complicationsFontManager = new FontManager(CLOCK_COMPLICATIONS_FONT);
export const hoursFontManager = new FontManager(CLOCK_HOURS_FONT);
export const minutesFontManager = new FontManager(CLOCK_MINUTES_FONT);
