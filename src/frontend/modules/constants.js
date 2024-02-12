export const SEGMENTS = 128;

export const SIZES = {
    BEZEL_THICKNESS: 0.2,
    BEZEL_RADIUS: 1.0,
    CLOCK_RADIUS: 5.0,
    CLOCK_THICKNESS: 1.0,
    COMPLICATION_BOX_SCALE: 1.15,
    DAY_DATE_BOX_DEPTH: 0.06,
    DAY_DATE_NUMBER_HEIGHT: 0.0125,
    DAY_DATE_SIZE: 0.28125,
    DAY_DATE_BEVEL_SIZE: .025,
    DAY_DATE_BEVEL_THICKNESS: 0.001,
    DIGITAL_DISPLAY_BEVEL_SIZE: .0275,
    DIGITAL_DISPLAY_BEVEL_THICKNESS: 0.001,
    DIGITAL_DISPLAY_BOX_DEPTH: 0.06,
    DIGITAL_DISPLAY_NUMBER_HEIGHT: 0.0125,
    DIGITAL_DISPLAY_SIZE: 0.375,
    INDICATOR_BEVEL_THICKNESS: 0.001,
    INDICATOR_BEVEL_SIZE: 0.02,
    INDICATOR_HEIGHT: 0.025,
    NUMBER_HEIGHT: 0.01,
    NUMBER_SIZE: 0.5,
    NUMBER_BEVEL_SIZE: 0.0275,
    NUMBER_BEVEL_THICKNESS: 0.01,
    POST_HEIGHT: 0.02,
    POST_RADIUS: 0.01,
    HOUR_HAND_SCALE: 0.75,
    HOUR_HAND_TIP_WIDTH: 0.048,
    HOUR_HAND_BASE_WIDTH: 0.51,
    HOUR_HAND_BASE_OFFSET: 0.3,
    MINUTE_HAND_SCALE: 0.80,
    MINUTE_HAND_TIP_WIDTH: 0.036,
    MINUTE_HAND_BASE_WIDTH: 0.3825,
    MINUTE_HAND_BASE_OFFSET: 0.3,
    SECOND_HAND_SCALE: 0.5,
    SECOND_HAND_TIP_WIDTH: 0.015,
    SECOND_HAND_BASE_WIDTH: 0.080,
    SECOND_HAND_BASE_OFFSET: 0.1,
};

export const CLOCK_HOURS_FONT = 'fonts/noto_serif_regular.typeface.json';
export const CLOCK_MINUTES_FONT = 'fonts/noto_sans_regular.typeface.json';
export const CLOCK_DAY_DATE_FONT = 'fonts/noto_serif_light_regular.typeface.json';
export const CLOCK_DIGITAL_FONT = 'fonts/noto_sans_light_regular.typeface.json';
export const CLOCK_OUTER_RADIUS = SIZES.CLOCK_RADIUS + SIZES.BEZEL_THICKNESS;
export const DAY_DATE_BASE_Y = -SIZES.CLOCK_RADIUS * 1/6;
export const DIGITAL_DISPLAY_BASE_Y = SIZES.CLOCK_RADIUS * 1/6;
export const HOURS_BASE_DISTANCE = SIZES.CLOCK_RADIUS * 5/6
export const MINUTES_BASE_DISTANCE = SIZES.CLOCK_RADIUS * 2/3
export const SECOND_HAND_BASE_DISTANCE = SIZES.CLOCK_RADIUS * 47/48;
export const INDICATORS = {};
export const HOUR_NUMBERS = {};
export const MINUTE_NUMBERS = {};
export const MAX_ZOOM = 16.84893;
export const ZOOM_EXPONENT = 1.1;
export const TIME_ENDPOINT = 'https://PerfectTime.org/api/time';
export const PERFECT_TIME_SYNC_SECONDS = 60;
