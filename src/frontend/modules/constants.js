export const SEGMENTS = 128;

export const COLORS = {
    CLOCK_BEZEL: 0x212529,
    CLOCK_FACE: 0x343A40,
    COMPLICATION_NUMBERS: 0x2B3035,
    DAY_DATE_BOX: 0x7F8387,
    DIGITAL_DISPLAY_BOX: 0x7F8387,
    HOUR_HAND: 0x444444,
    HOUR_NUMBERS: 0xAEB2B6,
    INDICATORS: 0xAEB2B6,
    MINUTE_HAND: 0x555555,
    MINUTE_NUMBERS: 0x7F8387,
    POST: 0x000000,
    SECOND_HAND: 0x800000,
};

export const SIZES = {
    BEZEL_THICKNESS: 0.2,
    CLOCK_RADIUS: 5.0,
    COMPLICATION_FRAME_THICKNESS: 0.025,
    DAY_DATE_BOX_DEPTH: 0.05,
    DAY_DATE_BOX_HEIGHT: 0.5,
    DAY_DATE_BOX_WIDTH: 2.05,
    DIGITAL_DISPLAY_BOX_DEPTH: 0.05,
    DIGITAL_DISPLAY_BOX_HEIGHT: 0.65,
    DIGITAL_DISPLAY_BOX_WIDTH: 3.5,
    INDICATOR_HEIGHT: 0.1,
    INDICATOR_RADIUS: 0.1,
    NUMBER_HEIGHT: 0.05,
    NUMBER_SIZE: 0.5,
    POST_HEIGHT: 0.1,
    POST_RADIUS: 0.015
};

export const CLOCK_FONT = 'fonts/droid/droid_sans_regular.typeface.json';
export const CLOCK_FONT_MONO = 'fonts/droid/droid_sans_mono_regular.typeface.json';
export const CLOCK_OUTER_RADIUS = SIZES.CLOCK_RADIUS + SIZES.BEZEL_THICKNESS;
export const DAY_DATE_FRAME_HEIGHT = SIZES.DAY_DATE_BOX_HEIGHT + 2 * SIZES.COMPLICATION_FRAME_THICKNESS;
export const DAY_DATE_FRAME_WIDTH = SIZES.DAY_DATE_BOX_WIDTH + 2 * SIZES.COMPLICATION_FRAME_THICKNESS;
export const DAY_DATE_PARTS = [
    'dayDateBox',
    'dayDateTopFrame',
    'dayDateBottomFrame',
    'dayDateLeftFrame',
    'dayDateRightFrame',
]
export const DIGITAL_DISPLAY_FRAME_HEIGHT = SIZES.DIGITAL_DISPLAY_BOX_HEIGHT + 2 * SIZES.COMPLICATION_FRAME_THICKNESS;
export const DIGITAL_DISPLAY_FRAME_WIDTH = SIZES.DIGITAL_DISPLAY_BOX_WIDTH + 2 * SIZES.COMPLICATION_FRAME_THICKNESS;
export const DIGITAL_DISPLAY_PARTS = [
    'digitalDisplayBox',
    'digitalDisplayTopFrame',
    'digitalDisplayBottomFrame',
    'digitalDisplayLeftFrame',
    'digitalDisplayRightFrame',
]
export const INDICATORS = {};
export const HOUR_NUMBERS = {};
export const MINUTE_NUMBERS = {};
