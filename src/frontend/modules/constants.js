export const SEGMENTS = 128;

export const COLORS = {
    CLOCK_BEZEL: 0x161A1D,
    CLOCK_FACE: 0x2C333A,
    COMPLICATION_FRAME: 0x161A1D,
    COMPLICATION_NUMBERS: 0x1D2125,
    DAY_DATE_BOX: 0x596773,
    DIGITAL_DISPLAY_BOX: 0x596773,
    HOUR_HAND: 0xB6C2CF,
    OUTER_HOUR_HAND: 0x101214,
    HOUR_NUMBERS: 0xB6C2CF,
    OUTER_HOUR_NUMBERS: 0x1D2125,
    INDICATORS: 0x9FADBC,
    OUTER_INDICATOR: 0x1D2125,
    MINUTE_HAND: 0x738496,
    OUTER_MINUTE_HAND: 0x101214,
    MINUTE_NUMBERS: 0x738496,
    OUTER_MINUTE_NUMBERS: 0x1D2125,
    POST: 0x101214,
    SECOND_HAND: 0x800000,
    OUTER_SECOND_HAND: 0x101214,
};

export const SIZES = {
    BEZEL_THICKNESS: 0.2,
    CLOCK_RADIUS: 5.0,
    COMPLICATION_BOX_DEPTH: 0.03,
    COMPLICATION_FRAME_THICKNESS: 0.025,
    COMPLICATION_NUMBER_HEIGHT: 0.06,
    DAY_DATE_SIZE: 0.225,
    DAY_DATE_BOX_HEIGHT: 0.5,
    DAY_DATE_BOX_WIDTH: 2.05,
    DIGITAL_TIME_SIZE: 0.35,
    DIGITAL_DISPLAY_BOX_HEIGHT: 0.65,
    DIGITAL_DISPLAY_BOX_WIDTH: 3.5,
    INDICATOR_HEIGHT: 0.074,
    INDICATOR_RADIUS: 0.09,
    INDICATOR_SCALE: 0.8,
    NUMBER_HEIGHT: 0.05,
    NUMBER_SIZE: 0.5,
    NUMBER_BEVEL_SIZE: 0.0275,
    NUMBER_BEVEL_THICKNESS: 0.01,
    POST_HEIGHT: 0.045,
    POST_RADIUS: 0.015,
    HOUR_HAND_SCALE: 0.75,
    HOUR_HAND_TIP_WIDTH: 0.048,
    HOUR_HAND_BASE_WIDTH: 0.4,
    HOUR_HAND_BASE_OFFSET: 0.3,
    HOUR_HAND_LENGTH_RATIO: 5/8,
    MINUTE_HAND_SCALE: 0.75,
    MINUTE_HAND_TIP_WIDTH: 0.036,
    MINUTE_HAND_BASE_WIDTH: 0.3,
    MINUTE_HAND_BASE_OFFSET: 0.3,
    MINUTE_HAND_LENGTH_RATIO: 23/24,
    SECOND_HAND_SCALE: 0.375,
    SECOND_HAND_TIP_WIDTH: 0.009,
    SECOND_HAND_BASE_WIDTH: 0.075,
    SECOND_HAND_BASE_OFFSET: 0.1,
    SECOND_HAND_LENGTH_RATIO: 23/24,
    OUTER_HAND_LENGTH_SCALE: 0.9925
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
export const OUTER_INDICATORS = {};
export const HOUR_NUMBERS = {};
export const MINUTE_NUMBERS = {};
export const TIME_ENDPOINT = 'https://PerfectTime.org/api/time';
export const PERFECT_TIME_SYNC_SECONDS = 60
