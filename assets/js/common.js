const EVENT_KEYS = {

    DICE_ROLLED: 'dieRolled',
    
};

const KEY_COOKIE_WALLET = 'casinoWallet';

const DEFAULT_STARTING_WALLET = 1000000;

function setCookie(name, value, days) {

    let expires = "";

    if (days) {

        let date = new Date();

        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        expires = "; expires=" + date.toUTCString();

    }

    document.cookie = name + "=" + (value || "") + expires + "; path=/";

}

function getCookie(name) {

    let nameEQ = name + "=";

    let ca = document.cookie.split(';');

    for(let i=0; i < ca.length; i++) {

        let c = ca[i];

        while (c.charAt(0) === ' ') c = c.substring(1, c.length);

        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);

    }

    return null;

}

function showStatusMessage(message, duration = 1000) {
    statusMessageEl.innerHTML = message;
    statusMessageEl.style.display = 'block'; // Make it visible
    statusMessageEl.classList.remove('fade-out-animation'); // Ensure previous animation is reset
    statusMessageEl.classList.add('fade-in-animation'); // Trigger fade-in

    setTimeout(() => {
        statusMessageEl.classList.remove('fade-in-animation');
        statusMessageEl.classList.add('fade-out-animation'); // Trigger fade-out
        setTimeout(() => {
            statusMessageEl.style.display = 'none';
        }, 500); // Matches fade-out duration
    }, duration - 500); // Start fade-out 0.5s before total duration ends
}
