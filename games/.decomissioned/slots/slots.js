
document.addEventListener('DOMContentLoaded', function() {

    const navbar = document.querySelector('.navbar.fixed-top');

    if (navbar) {

        const navbarHeight = navbar.offsetHeight;

        document.body.style.paddingTop = navbarHeight + 'px';

        window.addEventListener('resize', () => {

            const newNavbarHeight = navbar.offsetHeight;

            document.body.style.paddingTop = newNavbarHeight + 'px';

        });

    }

});

// --- DOM Elements ---
const reelColumns = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const statusMessageEl = document.getElementById('statusMessage');
const btnSpin = document.getElementById('btnSpin');
const betButtons = document.querySelectorAll('.bet-button');
const walletAmountEl = document.getElementById('walletAmount');
const betAmountEl = document.getElementById('betAmount');

// --- Game Config ---
const symbols = [
    { id: 'CHIP', text: '🔵', class: 'chip' },
    { id: 'DICE', text: '🎲', class: 'dice' },
    { id: 'BELL', text: '🔔', class: 'bell' },
    { id: 'CROWN', text: '👑', class: 'crown' },
    { id: 'WILD', text: 'WILD', class: 'wild' }, // Wild card
];
const payouts = {
    'CHIP': { 3: 10 },
    'DICE': { 3: 25 },
    'BELL': { 3: 50 },
    'CROWN': { 3: 100 },
    'WILD': { 3: 200 } // Jackpot
};
const spinDuration = 2000;
const spinIntervalTime = 80;

// --- Game State ---
let wallet;
let currentBet = 100;
let isSpinning = false;

// --- Cookie Functions ---
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

// --- Wallet Initialization ---
function initializeWallet() {
    const savedWallet = getCookie('casinoWallet');
    if (savedWallet && !isNaN(parseInt(savedWallet))) {
        wallet = parseInt(savedWallet);
    } else {
        wallet = 10000; // Default starting balance
        setCookie('casinoWallet', wallet, 365); // Create the cookie
        alert("Welcome! A new starting balance of $10,000 has been set for the casino.");
    }
    walletAmountEl.textContent = wallet;
}


function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function createSymbolElement(symbol) {
    const el = document.createElement('div');
    el.classList.add('reel-symbol', symbol.class);
    el.textContent = symbol.text;
    return el;
}

function showStatusMessage(message, duration = 1000) {
    statusMessageEl.innerHTML = message;
    statusMessageEl.style.display = 'block';
    setTimeout(() => statusMessageEl.style.display = 'none', duration);
}

function updateButtonState(spinning) {
    isSpinning = spinning;
    btnSpin.disabled = isSpinning;
    betButtons.forEach(btn => btn.disabled = isSpinning);
}

function updateActiveBetButton(selectedBet) {
        betButtons.forEach(btn => {
        if(btn.dataset.bet === 'max' && selectedBet === wallet) {
            btn.classList.add('active');
        } else if (parseInt(btn.dataset.bet) === selectedBet) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function checkWin(result) {
    const line = [result[0][1], result[1][1], result[2][1]]; // Middle symbols
    const lineIds = line.map(s => s.id);
    let winMultiplier = 0;
    let winMessage = '';

    // Check for 3 Wilds first (Jackpot)
    if (lineIds[0] === 'WILD' && lineIds[1] === 'WILD' && lineIds[2] === 'WILD') {
        winMultiplier = payouts['WILD'][3];
        winMessage = 'JACKPOT!';
    } else {
        // Check for other 3-of-a-kind, substituting wilds
        for (const symbolId in payouts) {
            if (symbolId === 'WILD') continue; // Skip wild check here, it's done above

            const count = lineIds.filter(id => id === symbolId || id === 'WILD').length;

            if (count === 3) {
                const currentMultiplier = payouts[symbolId][3];
                // Ensure we take the highest possible win
                if (currentMultiplier > winMultiplier) {
                    winMultiplier = currentMultiplier;
                    winMessage = `${symbolId} x3!`;
                }
            }
        }
    }

    if (winMultiplier > 0) {
        const winnings = currentBet * winMultiplier;
        wallet += winnings;
        showStatusMessage(`${winMessage}<br>+$${winnings}`, 1000);
    }

    walletAmountEl.textContent = wallet;
    setCookie('casinoWallet', wallet, 365); // Save wallet after win/loss check
}

function spinReels() {
    if (isSpinning) return;
    if (wallet < currentBet) {
        showStatusMessage("Not Enough Funds!");
        return;
    }

    wallet -= currentBet;
    walletAmountEl.textContent = wallet;
    setCookie('casinoWallet', wallet, 365); // Save wallet before spin
    updateButtonState(true);

    const finalResults = [];
    for(let i = 0; i < 3; i++) {
        finalResults.push([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
    }

    const spinIntervals = [];

    reelColumns.forEach((column, i) => {
        const interval = setInterval(() => {
            column.innerHTML = '';
            column.appendChild(createSymbolElement(getRandomSymbol()));
            column.appendChild(createSymbolElement(getRandomSymbol()));
            column.appendChild(createSymbolElement(getRandomSymbol()));
        }, spinIntervalTime);
        spinIntervals.push(interval);
    });

    // Stop reels sequentially
    reelColumns.forEach((column, i) => {
        setTimeout(() => {
            clearInterval(spinIntervals[i]);
            column.innerHTML = '';
            finalResults[i].forEach(symbol => {
                column.appendChild(createSymbolElement(symbol));
            });

            // If this is the last reel to stop
            if (i === reelColumns.length - 1) {
                    checkWin(finalResults);
                    updateButtonState(false);
                    if (wallet <= 0) showStatusMessage("Game Over!", 5000);
            }
        }, spinDuration + (i * 500));
    });
}

// --- Event Listeners ---
btnSpin.addEventListener('click', spinReels);

betButtons.forEach(button => {
    button.addEventListener('click', () => {
        if(isSpinning) return;
        const betValue = button.dataset.bet;
        if (betValue === 'max') {
            currentBet = wallet;
        } else {
            currentBet = parseInt(betValue);
        }
        if (currentBet > wallet) currentBet = wallet;
        betAmountEl.textContent = currentBet;
        updateActiveBetButton(currentBet);
    });
});

// --- Initial Setup ---
window.onload = () => {
    initializeWallet();
    updateButtonState(false);
    updateActiveBetButton(currentBet);
};

