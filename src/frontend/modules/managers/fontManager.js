import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { CLOCK_FONT, CLOCK_FONT_MONO, SIZES, SEGMENTS } from '../constants';

class FontManager {
    constructor(url) {
        this.font = null;
        this.fontPromise = this.loadFont(url);
    }

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

    async getLoadedFont() {
        await this.fontPromise;
        return this.font;
    }
}

export const fontManager = new FontManager(CLOCK_FONT);
export const monoFontManager = new FontManager(CLOCK_FONT_MONO);
