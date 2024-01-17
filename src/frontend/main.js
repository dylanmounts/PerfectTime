import { Toast } from 'bootstrap';

import '../frontend/scss/styles.scss'
import { initializeScene, onWindowResize } from './modules/managers/sceneManager';
import { toggleDayDate, toggleDigitalDisplay, toggleHourIndicators, toggleHourNumbers, toggleHourHand, toggleMinuteIndicators, toggleMinuteNumbers, toggleMinuteHand, toggleSecondHand, toggleSweepingSeconds } from './modules/clock/clockUpdater';


// Bootstrap
const optionsTrigger = document.getElementById('optionsMenuBtn')
const optionsMenu = document.getElementById('optionsMenu')
const infoTrigger = document.getElementById('infoMenuBtn')
const infoMenu = document.getElementById('infoMenu')

if (optionsTrigger) {
        const toastBootstrap = Toast.getOrCreateInstance(optionsMenu)
        optionsTrigger.addEventListener('click', () => {
            toastBootstrap.show()
    })
}
if (infoTrigger) {
        const toastBootstrap = Toast.getOrCreateInstance(infoMenu)
        infoTrigger.addEventListener('click', () => {
            toastBootstrap.show()
    })
}

function handleCheckboxChange(checkboxId, callback) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            callback(checkbox.checked);
        });
    }
}

// Three
initializeScene();
window.addEventListener('resize', onWindowResize);

handleCheckboxChange('dayDateOption', toggleDayDate);
handleCheckboxChange('digitalTimeOption', toggleDigitalDisplay);
handleCheckboxChange('hourIndicatorsOption', toggleHourIndicators);
handleCheckboxChange('hoursOption', toggleHourNumbers);
handleCheckboxChange('hourHandOption', toggleHourHand);
handleCheckboxChange('minuteIndicatorsOption', toggleMinuteIndicators);
handleCheckboxChange('minutesOption', toggleMinuteNumbers);
handleCheckboxChange('minuteHandOption', toggleMinuteHand);
handleCheckboxChange('secondHandOption', toggleSecondHand);
handleCheckboxChange('sweepingSecondsOption', toggleSweepingSeconds);
