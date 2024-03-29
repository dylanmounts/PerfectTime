/**
 * colorManager.js - Manages the colors for the perfect Clock.
 */

let currentScheme;

const LIGHT_SECOND_HAND = 0xAE2E24;
const DARK_SECOND_HAND = 0xAE2E24;

const DARK_COLORS = {
    '-100': 0x101214,
    '0': 0x161A1D,
    '100': 0x1D2125,
    '200': 0x22272B,
    '250': 0x282E33,
    '300': 0x2C333A,
    '350': 0x38414A,
    '400': 0x454F59,
    '500': 0x596773,
    '600': 0x738496,
    '700': 0x8C9BAB,
    '800': 0x9FADBC,
    '900': 0xB6C2CF,
    '1000': 0xC7D1DB,
    '1100': 0xDEE4EA,
};

const LIGHT_COLORS = {
    '-100': 0xFFFFFF,
    '0': 0xFFFFFF,
    '100': 0xF7F8F9,
    '200': 0xF1F2F4,
    '250': 0xF1F2F4,
    '300': 0xDCDFE4,
    '350': 0xDCDFE4,
    '400': 0xB3B9C4,
    '500': 0x8590A2,
    '600': 0x758195,
    '700': 0x626F86,
    '800': 0x44546F,
    '900': 0x2C3E5D,
    '1000': 0x172B4D,
    '1100': 0x091E42
};

const DARK_SCHEME = {
    SCHEME: 'dark',
    BACKDROP: DARK_COLORS['-100'],
    CLOCK_BEZEL: DARK_COLORS['0'],
    CLOCK_FACE: DARK_COLORS['300'],
    COMPLICATION_FRAME: DARK_COLORS['100'],
    COMPLICATION_NUMBERS: DARK_COLORS['100'],
    DAY_DATE_BOX: DARK_COLORS['700'],
    DIGITAL_DISPLAY_BOX: DARK_COLORS['700'],
    HOUR_HAND: DARK_COLORS['900'],
    OUTER_HOUR_HAND: DARK_COLORS['-100'],
    HOUR_NUMBERS: DARK_COLORS['900'],
    OUTER_HOUR_NUMBERS: DARK_COLORS['0'],
    INDICATORS: DARK_COLORS['800'],
    OUTER_INDICATOR: DARK_COLORS['0'],
    MINUTE_HAND: DARK_COLORS['600'],
    OUTER_MINUTE_HAND: DARK_COLORS['-100'],
    MINUTE_NUMBERS: DARK_COLORS['600'],
    OUTER_MINUTE_NUMBERS: DARK_COLORS['0'],
    POST: DARK_COLORS['-100'],
    SECOND_HAND: DARK_SECOND_HAND,
    OUTER_SECOND_HAND: DARK_COLORS['-100'],
};

const LIGHT_SCHEME = {
    SCHEME: 'light',
    BACKDROP: LIGHT_COLORS['1000'],
    CLOCK_BEZEL: LIGHT_COLORS['900'],
    CLOCK_FACE: LIGHT_COLORS['700'],
    COMPLICATION_FRAME: LIGHT_COLORS['1000'],
    COMPLICATION_NUMBERS: LIGHT_COLORS['1000'],
    DAY_DATE_BOX: LIGHT_COLORS['300'],
    DIGITAL_DISPLAY_BOX: LIGHT_COLORS['300'],
    HOUR_HAND: LIGHT_COLORS['100'],
    OUTER_HOUR_HAND: LIGHT_COLORS['1100'],
    HOUR_NUMBERS: LIGHT_COLORS['100'],
    OUTER_HOUR_NUMBERS: LIGHT_COLORS['1000'],
    INDICATORS: LIGHT_COLORS['300'],
    OUTER_INDICATOR: LIGHT_COLORS['1000'],
    MINUTE_HAND: LIGHT_COLORS['400'],
    OUTER_MINUTE_HAND: LIGHT_COLORS['1100'],
    MINUTE_NUMBERS: LIGHT_COLORS['400'],
    OUTER_MINUTE_NUMBERS: LIGHT_COLORS['1000'],
    POST: LIGHT_COLORS['1000'],
    SECOND_HAND: LIGHT_SECOND_HAND,
    OUTER_SECOND_HAND: LIGHT_COLORS['1100'],
};

export function getCurrentScheme() {
    return currentScheme;
};

/**
 * Switches the website's color scheme between light and dark modes.
 * @param {string} [scheme] - The desired color scheme ('dark' or 'light').
 */
export function switchScheme(scheme) {
    if (!scheme) {
        scheme = localStorage.getItem('useDarkScheme') === 'false' ? 'light' : 'dark';
    }
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-bs-theme', scheme);
    currentScheme = scheme === 'dark' ? DARK_SCHEME : LIGHT_SCHEME;
    localStorage.setItem('useDarkScheme', scheme === 'dark' ? 'true' : 'false');
}
switchScheme();

export const BUTTON_COLORS = {
    ACTIVE: "#DCDFE4",
    ACTIVE_BG: "#626F86",
    INACTIVE: "#DCDFE4",
    INACTIVE_BG: "transparent",
};
