export const SEGMENTS = 128;

export const COLORS = {
    CLOCK_BEZEL: 0x161A1D,
    CLOCK_FACE: 0x2C333A,
    COMPLICATION_FRAME: 0x161A1D,
    COMPLICATION_NUMBERS: 0x161A1D,
    DAY_DATE_BOX: 0x8C9BAB,
    DIGITAL_DISPLAY_BOX: 0x8C9BAB,
    HOUR_HAND: 0xB6C2CF,
    OUTER_HOUR_HAND: 0x101214,
    HOUR_NUMBERS: 0xB6C2CF,
    OUTER_HOUR_NUMBERS: 0x1D2125,
    INDICATORS: 0x9FADBC,
    OUTER_INDICATOR: 0x1D2125,
    MINUTE_HAND: 0x738496,
    OUTER_MINUTE_HAND: 0x101214,
    MINUTE_NUMBERS: 0x738496,
    OUTER_MINUTE_NUMBERS: 0x161A1D,
    POST: 0x101214,
    SECOND_HAND: 0x822622,
    OUTER_SECOND_HAND: 0x101214,
};

export const SIZES = {
    BEZEL_THICKNESS: 0.2,
    BEZEL_RADIUS: 1.0,
    CLOCK_RADIUS: 5.0,
    CLOCK_THICKNESS: 1.0,
    DAY_DATE_BOX_DEPTH: 0.05,
    DAY_DATE_FRAME_DEPTH: 0.0575,
    DAY_DATE_FRAME_THICKNESS: 0.02,
    DAY_DATE_NUMBER_HEIGHT: 0.0125,
    DAY_DATE_SIZE: 0.28125,
    DAY_DATE_SPACING: 0.145,
    DAY_DATE_BOX_HEIGHT: 0.45,
    DAY_DATE_BOX_WIDTH: 2.2,
    DAY_DATE_BEVEL_SIZE: .025,
    DAY_DATE_BEVEL_THICKNESS: 0.001,
    DIGITAL_DISPLAY_BEVEL_SIZE: .0275,
    DIGITAL_DISPLAY_BEVEL_THICKNESS: 0.001,
    DIGITAL_DISPLAY_BOX_DEPTH: 0.05,
    DIGITAL_DISPLAY_BOX_HEIGHT: 0.725,
    DIGITAL_DISPLAY_BOX_WIDTH: 2.8925,
    DIGITAL_DISPLAY_NUMBER_HEIGHT: 0.0125,
    DIGITAL_DISPLAY_SIZE: 0.375,
    INDICATOR_BEVEL_THICKNESS: 0.001,
    INDICATOR_BEVEL_SIZE: 0.02,
    INDICATOR_HEIGHT: 0.025,
    INDICATOR_RADIUS: 0.15,
    INDICATOR_SCALE: 0.8,
    NUMBER_HEIGHT: 0.01,
    NUMBER_SIZE: 0.5,
    NUMBER_BEVEL_SIZE: 0.0275,
    NUMBER_BEVEL_THICKNESS: 0.01,
    POST_HEIGHT: 0.02,
    POST_RADIUS: 0.015,
    HOUR_HAND_SCALE: 0.75,
    HOUR_HAND_TIP_WIDTH: 0.048,
    HOUR_HAND_BASE_WIDTH: 0.51,
    HOUR_HAND_BASE_OFFSET: 0.3,
    HOUR_HAND_LENGTH_RATIO: 5/8,
    MINUTE_HAND_SCALE: 0.80,
    MINUTE_HAND_TIP_WIDTH: 0.036,
    MINUTE_HAND_BASE_WIDTH: 0.3825,
    MINUTE_HAND_BASE_OFFSET: 0.3,
    MINUTE_HAND_LENGTH_RATIO: 23/24,
    SECOND_HAND_SCALE: 0.5,
    SECOND_HAND_TIP_WIDTH: 0.015,
    SECOND_HAND_BASE_WIDTH: 0.080,
    SECOND_HAND_BASE_OFFSET: 0.1,
    SECOND_HAND_LENGTH_RATIO: 23/24,
    OUTER_HAND_LENGTH_SCALE: 0.9925
};

export const CLOCK_HOURS_FONT = 'fonts/noto_serif_regular.typeface.json';
export const CLOCK_MINUTES_FONT = 'fonts/noto_sans_regular.typeface.json';
export const CLOCK_DAY_DATE_FONT = 'fonts/noto_serif_light_regular.typeface.json';
export const CLOCK_DIGITAL_FONT = 'fonts/noto_sans_light_regular.typeface.json';
export const CLOCK_OUTER_RADIUS = SIZES.CLOCK_RADIUS + SIZES.BEZEL_THICKNESS;
export const DAY_DATE_BASE_Y = -SIZES.CLOCK_RADIUS * 1/6;
export const DIGITAL_DISPLAY_BASE_Y = SIZES.CLOCK_RADIUS * 1/6;
export const INDICATORS = {};
export const HOUR_NUMBERS = {};
export const MINUTE_NUMBERS = {};
export const TIME_ENDPOINT = 'https://PerfectTime.org/api/time';
export const PERFECT_TIME_SYNC_SECONDS = 60;
