import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// Constants
const SEGMENTS = 128;

const COLORS = {
    CLOCK_BEZEL: 0x2a2a2a,
    CLOCK_FACE: 0xeeeeee,
    HOUR_HAND: 0x333333,
    HOUR_NUMBERS: 0x000000,
    INDICATORS: 0x000000,
    MINUTE_HAND: 0x666666,
    MINUTE_NUMBERS: 0x2a2a2a,
    POST: 0x000000,
    SECOND_HAND: 0x990000,
};

const SIZES = {
    BEZEL_THICKNESS: 0.2,
    CLOCK_RADIUS: 5.0,
    CRYSTAL_HEIGHT: 0.02,
    INDICATOR_HEIGHT: 0.1,
    INDICATOR_RADIUS: 0.1,
    NUMBER_HEIGHT: 0.05,
    NUMBER_SIZE: 0.5,
    POST_HEIGHT: 0.1,
    POST_RADIUS: 0.015
};

const CLOCK_OUTER_RADIUS = SIZES.CLOCK_RADIUS + SIZES.BEZEL_THICKNESS;

// Globals
let initialTime;
let systemTime;
let timeOffset;

// Shapes
const hourHandShape = new THREE.Shape();
hourHandShape.moveTo(0, -0.3);
hourHandShape.lineTo(-0.15, 0);
hourHandShape.lineTo(0, SIZES.CLOCK_RADIUS * 5/8);
hourHandShape.lineTo(0.15, 0);
hourHandShape.lineTo(0, -0.3);

const minuteHandShape = new THREE.Shape();
minuteHandShape.moveTo(0, -0.2);
minuteHandShape.lineTo(-0.1, 0);
minuteHandShape.lineTo(0, SIZES.CLOCK_RADIUS * 9/10);
minuteHandShape.lineTo(0.1, 0);
minuteHandShape.lineTo(0, -0.2);

const secondHandShape = new THREE.Shape();
secondHandShape.moveTo(0, -0.1);
secondHandShape.lineTo(-0.05, 0);
secondHandShape.lineTo(0, SIZES.CLOCK_RADIUS * 23/24);
secondHandShape.lineTo(0.05, 0);
secondHandShape.lineTo(0, -0.1);

// Materials
const clockFaceMaterial = new THREE.MeshPhongMaterial({ color: COLORS.CLOCK_FACE });
const clockBezelMaterial = new THREE.MeshPhongMaterial({ color: COLORS.CLOCK_BEZEL });
const postMaterial = new THREE.MeshPhongMaterial({ color: COLORS.POST });
const hourHandMaterial = new THREE.MeshPhongMaterial({ color: COLORS.HOUR_HAND });
const minuteHandMaterial = new THREE.MeshPhongMaterial({ color: COLORS.MINUTE_HAND });
const secondHandMaterial = new THREE.MeshPhongMaterial({ color: COLORS.SECOND_HAND });

// Geometries
const clockFaceGeometry = new THREE.CircleGeometry(SIZES.CLOCK_RADIUS, SEGMENTS);
const clockBezelGeometry = new THREE.RingGeometry(SIZES.CLOCK_RADIUS, CLOCK_OUTER_RADIUS, SEGMENTS);
const postGeometry = new THREE.CylinderGeometry(SIZES.POST_RADIUS, SIZES.POST_RADIUS, SIZES.POST_HEIGHT, SEGMENTS / 8);
const hourHandGeometry = new THREE.ShapeGeometry(hourHandShape);
const minuteHandGeometry = new THREE.ShapeGeometry(minuteHandShape);
const secondHandGeometry = new THREE.ShapeGeometry(secondHandShape);

// Meshes
const clockFace = new THREE.Mesh(clockFaceGeometry, clockFaceMaterial);
clockFace.position.z = 0;

const clockBezel = new THREE.Mesh(clockBezelGeometry, clockBezelMaterial);
clockBezel.position.z = 0;

const post = new THREE.Mesh(postGeometry, postMaterial);
post.rotation.x = Math.PI / 2
post.position.z = SIZES.POST_HEIGHT / 2;

const hourHand = new THREE.Mesh(hourHandGeometry, hourHandMaterial);
hourHand.position.z = SIZES.POST_HEIGHT - .003;

const minuteHand = new THREE.Mesh(minuteHandGeometry, minuteHandMaterial);
minuteHand.position.z = SIZES.POST_HEIGHT - .002;

const secondHand = new THREE.Mesh(secondHandGeometry, secondHandMaterial);
secondHand.position.z = SIZES.POST_HEIGHT - .001;

//Functions
function loadFonts(scene) {
    const loader = new FontLoader();
    loader.load(
        'fonts/droid/droid_sans_regular.typeface.json',
        function (font) {
            createNumbers(scene, font);
        }
    );
}

function createNumbers(scene, font) {
    for (let i = 1; i <= 12; i++) {
        // Hours
        const hourGeometry = new TextGeometry(String(i), {
            font: font,
            size: SIZES.NUMBER_SIZE,
            height: SIZES.NUMBER_HEIGHT,
            curveSegments: SEGMENTS / 8,
            bevelEnabled: false
        });
        hourGeometry.center();
        
        const hourMaterial = new THREE.MeshPhongMaterial({ color: COLORS.HOUR_NUMBERS });
        const hourMesh = new THREE.Mesh(hourGeometry, hourMaterial);

        const angle = (Math.PI / 6) * i;
        const distanceFromCenter = SIZES.CLOCK_RADIUS * 5/6;  

        hourMesh.position.x = Math.sin(angle) * distanceFromCenter;
        hourMesh.position.y = Math.cos(angle) * distanceFromCenter;
        hourMesh.position.z = 0;
        
        scene.add(hourMesh);
        
        // Minutes
        const minuteNumber = i * 5;
        const minuteGeometry = new TextGeometry(String(minuteNumber), {
            font: font,
            size: SIZES.NUMBER_SIZE / 2,
            height: SIZES.NUMBER_HEIGHT / 2,
            curveSegments: SEGMENTS / 8,
            bevelEnabled: false
        });
        minuteGeometry.center();

        const minuteMaterial = new THREE.MeshPhongMaterial({ color: COLORS.MINUTE_NUMBERS });
        const minuteMesh = new THREE.Mesh(minuteGeometry, minuteMaterial);
        
        const minuteDistanceFromCenter = SIZES.CLOCK_RADIUS * 2/3;

        minuteMesh.position.x = Math.sin(angle) * minuteDistanceFromCenter;
        minuteMesh.position.y = Math.cos(angle) * minuteDistanceFromCenter;
        minuteMesh.position.z = 0;
        
        scene.add(minuteMesh);
    }
}

function createIndicators(scene) {
    const regularIndicatorRadius = SIZES.INDICATOR_RADIUS * 1/2;
    const largeIndicatorRadius = SIZES.INDICATOR_RADIUS;

    const regularIndicatorHeight = SIZES.INDICATOR_HEIGHT * 2/3;
    const largeIndicatorHeight = SIZES.INDICATOR_HEIGHT;

    const distanceFromCenter = SIZES.CLOCK_RADIUS * 23/24;

    const indicatorMaterial = new THREE.MeshPhongMaterial({ color: COLORS.INDICATORS });

    for (let i = 0; i < 60; i++) {
        const isFiveMinuteMark = i % 5 === 0;
        const indicatorRadius = isFiveMinuteMark ? largeIndicatorRadius : regularIndicatorRadius;
        const indicatorHeight = isFiveMinuteMark ? largeIndicatorHeight : regularIndicatorHeight;

        const indicatorGeometry = new THREE.CylinderGeometry(indicatorRadius, indicatorRadius, indicatorHeight, SEGMENTS / 8);

        const angle = (Math.PI / 30) * i;

        const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicator.rotation.x = Math.PI / 2;

        indicator.position.x = Math.sin(angle) * distanceFromCenter;
        indicator.position.y = Math.cos(angle) * distanceFromCenter;
        indicator.position.z = 0;

        scene.add(indicator);
    }
}

export async function fetchInitialTime() {
    try {
        const response = await fetch('http://localhost:3000/time');
        const data = await response.json();
        initialTime = new Date(data.time);
        systemTime = new Date();
        timeOffset = initialTime - systemTime;
    } catch (error) {
        console.error('Error fetching initial time:', error);
        initialTime = new Date();
        timeOffset = 0;
    }
}

function getCurrentTime() {
    const corrected_now = Date.now() + timeOffset;
    return new Date(corrected_now);
}

export function updateClock() {
    const date = getCurrentTime();
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    const hourAngle = 
        30 * hours + 
        0.5 * minutes + 
        (30 / 3600) * seconds + 
        (30 / 3600000) * milliseconds;

    const minuteAngle = 
        6 * minutes + 
        0.1 * seconds + 
        (0.1 / 1000) * milliseconds;

    const secondAngle = 
        6 * seconds + 
        0.006 * milliseconds;

    hourHand.rotation.z = -THREE.MathUtils.degToRad(hourAngle);
    minuteHand.rotation.z = -THREE.MathUtils.degToRad(minuteAngle);
    secondHand.rotation.z = -THREE.MathUtils.degToRad(secondAngle);
}

export function addClock(scene) {
    loadFonts(scene);
    createIndicators(scene);

    scene.add(clockFace);
    scene.add(clockBezel)
    scene.add(hourHand);
    scene.add(minuteHand);
    scene.add(secondHand);
    scene.add(post);
}
