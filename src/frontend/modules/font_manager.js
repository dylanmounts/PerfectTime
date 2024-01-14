import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { SIZES, SEGMENTS } from './constants.js';

class FontManager {
    constructor() {
        this.font = null;
    }

    loadFont(url, onLoadCallback) {
        const loader = new FontLoader();
        loader.load(url, (loadedFont) => {
            this.font = loadedFont;
            if (typeof onLoadCallback === 'function') {
                onLoadCallback(loadedFont);
            }
        }, undefined, function (error) {
            console.error('Error loading font:', error);
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

    getLoadedFont() {
        return this.font;
    }
}

export const fontManager = new FontManager();
export const monoFontManager = new FontManager();
