export const SEGMENTS = 128;

export const COLORS = {
    CLOCK_BEZEL: 0x2a2a2a,
    CLOCK_FACE: 0xeeeeee,
    DAY_DATE_BOX: 0xD3D3D3,
    HOUR_HAND: 0x333333,
    HOUR_NUMBERS: 0x000000,
    INDICATORS: 0x000000,
    MINUTE_HAND: 0x666666,
    MINUTE_NUMBERS: 0x2a2a2a,
    POST: 0x000000,
    SECOND_HAND: 0x990000,
};

export const SIZES = {
    BEZEL_THICKNESS: 0.2,
    CLOCK_RADIUS: 5.0,
    COMPLICATION_FRAME_THICKNESS: 0.025,
    DAY_DATE_BOX_DEPTH: 0.05,
    DAY_DATE_BOX_HEIGHT: 0.65,
    DAY_DATE_BOX_WIDTH: 2.1,
    INDICATOR_HEIGHT: 0.1,
    INDICATOR_RADIUS: 0.1,
    NUMBER_HEIGHT: 0.05,
    NUMBER_SIZE: 0.5,
    POST_HEIGHT: 0.1,
    POST_RADIUS: 0.015
};

export const CLOCK_OUTER_RADIUS = SIZES.CLOCK_RADIUS + SIZES.BEZEL_THICKNESS;
export const COMPLICATION_FRAME_HEIGHT = SIZES.DAY_DATE_BOX_HEIGHT + 2 * SIZES.COMPLICATION_FRAME_THICKNESS;
export const COMPLICATION_FRAME_WIDTH = SIZES.DAY_DATE_BOX_WIDTH + 2 * SIZES.COMPLICATION_FRAME_THICKNESS;