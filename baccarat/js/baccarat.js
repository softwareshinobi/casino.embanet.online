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

// --- DOM Elements ---
const bankerHandEl = document.getElementById('bankerHand');
const playerHandEl = document.getElementById('playerHand');
const bankerScoreEl = document.getElementById('bankerScore');
const playerScoreEl = document.getElementById('playerScore');
const statusMessageEl = document.getElementById('statusMessage');
const btnBetPlayer = document.getElementById('btnBetPlayer');
const btnBetBanker = document.getElementById('btnBetBanker');
const btnBetTie = document.getElementById('btnBetTie');
const btnDeal = document.getElementById('btnDeal');
const btnClearBet = document.getElementById('btnClearBet');
const betTypeButtons = [btnBetPlayer, btnBetBanker, btnBetTie];
const betButtons = document.querySelectorAll('.bet-value-button');
const walletAmountEl = document.getElementById('walletAmount');
const betAmountEl = document.getElementById('betAmount');

// --- Game State Variables ---
let deck = [], playerHand = [], bankerHand = [];
let wallet;
let currentBet = 0;
let playerBetType = null; // 'player', 'banker', or 'tie'

// --- Baccarat Logic ---
function createDeck() {
const s = ['♥','♦','♣','♠'], v = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
deck = [];
for (let suit of s) for (let value of v) deck.push({ suit, value });
}

function shuffleDeck() {
for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
}
}

function getCardValue(cardValue) {
if (['K', 'Q', 'J', '10'].includes(cardValue)) return 0;
if (cardValue === 'A') return 1;
return parseInt(cardValue);
}

function getHandScore(hand) {
let total = hand.reduce((sum, card) => sum + getCardValue(card.value), 0);
return total % 10;
}

function createCardElement(card) {
const el = document.createElement('div');
el.className = 'card';
el.classList.add((card.suit === '♥' || card.suit === '♦') ? 'red' : 'black');
el.innerHTML = `<div class="card-top"><span>${card.value}</span><span class="suit">${card.suit}</span></div><div class="card-bottom"><span>${card.value}</span><span class="suit">${card.suit}</span></div>`;
return el;
}

function renderHands() {
bankerHandEl.innerHTML = '';
playerHandEl.innerHTML = '';
bankerHand.forEach(c => bankerHandEl.appendChild(createCardElement(c)));
playerHand.forEach(c => playerHandEl.appendChild(createCardElement(c)));
playerScoreEl.textContent = getHandScore(playerHand);
bankerScoreEl.textContent = getHandScore(bankerHand);
}

function showStatusMessage(message, duration = 2000) {
statusMessageEl.innerHTML = message;
statusMessageEl.style.display = 'block';
setTimeout(() => statusMessageEl.style.display = 'none', duration);
}

function updateButtonState(state) {
// States: 'betting', 'inprogress'
const isBetting = state === 'betting';
btnDeal.disabled = !playerBetType || !isBetting || currentBet === 0;
betTypeButtons.forEach(b => b.disabled = !isBetting);
betButtons.forEach(b => b.disabled = !isBetting);
btnClearBet.disabled = !isBetting;
}

function determineWinner() {
const pScore = getHandScore(playerHand);
const bScore = getHandScore(bankerHand);
let outcome, msg;

if (pScore > bScore) outcome = 'player';
else if (bScore > pScore) outcome = 'banker';
else outcome = 'tie';

if (outcome === playerBetType) {
    msg = `${outcome.charAt(0).toUpperCase() + outcome.slice(1)} Wins! You win!`;
    let winnings = 0;
    if (outcome === 'player') {
        winnings = currentBet; // 1:1 payout
        wallet += currentBet + winnings; // Return bet + winnings
    } else if (outcome === 'banker') {
        winnings = Math.floor(currentBet * 0.95); // Winnings are 95% of bet
        wallet += currentBet + winnings; // Return bet + winnings
    } else if (outcome === 'tie') {
        winnings = currentBet * 8; // 8:1 payout
        wallet += currentBet + winnings; // Return bet + winnings
    }
} else if (outcome === 'tie') {
    // This handles a PUSH when the user bet on Player or Banker.
    msg = "Push! It's a Tie. Your bet is returned.";
    wallet += currentBet; // Return the original bet.
}
else {
    // This handles a definitive loss.
    msg = `${outcome.charAt(0).toUpperCase() + outcome.slice(1)} Wins. You Lose.`;
    // No wallet action needed for loss, bet was already deducted.
}

showStatusMessage(msg, 2500);
walletAmountEl.textContent = wallet;
setCookie('casinoWallet', wallet, 365); // Save wallet to cookie

// Reset for next round
playerBetType = null;
currentBet = 0;
betAmountEl.textContent = currentBet;
betTypeButtons.forEach(b => b.classList.remove('active'));

setTimeout(() => {
    if (wallet <= 0) {
        showStatusMessage("Game Over! Restarting with $10000.", 3000);
        wallet = 10000; // Provide funds to continue playing
        walletAmountEl.textContent = wallet;
        setCookie('casinoWallet', wallet, 365);
    }
    updateButtonState('betting');
}, 2500);
}

function runGameSequence() {
updateButtonState('inprogress');
createDeck();
shuffleDeck();
playerHand = [deck.pop(), deck.pop()];
bankerHand = [deck.pop(), deck.pop()];
renderHands();

setTimeout(() => {
    const pScore = getHandScore(playerHand);
    const bScore = getHandScore(bankerHand);

    // Natural win check
    if (pScore >= 8 || bScore >= 8) {
        determineWinner();
        return;
    }

    let playerDraws = false;
    if (pScore <= 5) {
        playerDraws = true;
        playerHand.push(deck.pop());
    }

    setTimeout(() => {
        renderHands();
        const playerThirdCardValue = playerDraws ? getCardValue(playerHand[2].value) : null;
        const newBScore = getHandScore(bankerHand);

        let bankerDraws = false;
        if (newBScore <= 2) bankerDraws = true;
        else if (newBScore === 3 && playerThirdCardValue !== 8) bankerDraws = true;
        else if (newBScore === 4 && [2,3,4,5,6,7].includes(playerThirdCardValue)) bankerDraws = true;
        else if (newBScore === 5 && [4,5,6,7].includes(playerThirdCardValue)) bankerDraws = true;
        else if (newBScore === 6 && [6,7].includes(playerThirdCardValue)) bankerDraws = true;

        if (!playerDraws && newBScore <= 5) bankerDraws = true;

        if(bankerDraws) {
                setTimeout(() => {
                bankerHand.push(deck.pop());
                renderHands();
                setTimeout(determineWinner, 1000);
                }, 1000);
        } else {
                setTimeout(determineWinner, 1000);
        }
    }, 1000);

}, 1000);
}

// Event Listeners
betTypeButtons.forEach(button => {
button.addEventListener('click', () => {
    const newBetType = button.id.replace('btnBet', '').toLowerCase();
    // If switching bet type, reset the current bet amount
    if (playerBetType !== newBetType) {
        currentBet = 0;
        betAmountEl.textContent = currentBet;
    }
    betTypeButtons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    playerBetType = newBetType;
    updateButtonState('betting');
});
});

btnClearBet.addEventListener('click', () => {
currentBet = 0;
betAmountEl.textContent = currentBet;
showStatusMessage("Bet Cleared", 1000);
updateButtonState('betting');
});

btnDeal.addEventListener('click', () => {

const gameConsoleEl = document.getElementById('playingSurface');

gameConsoleEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

if (currentBet === 0 || wallet < currentBet) {
    showStatusMessage("Invalid Bet Amount!", 1500);
    return;
}
if (!playerBetType) {
    showStatusMessage("Select a Bet Type first!", 1500);
    return;
}
wallet -= currentBet; // Deduct bet immediately upon dealing
walletAmountEl.textContent = wallet;
setCookie('casinoWallet', wallet, 365); // Save wallet state
runGameSequence();
});

betButtons.forEach(button => {
button.addEventListener('click', () => {
    if (!playerBetType) {
        showStatusMessage("Select Player, Banker, or Tie first!", 1500);
        return;
    }
    const betValueStr = button.dataset.bet;
    if (betValueStr === 'max') {
        currentBet = wallet;
    } else {
        const betToAdd = parseInt(betValueStr);
        if (currentBet + betToAdd > wallet) {
            currentBet = wallet; // If adding exceeds wallet, just bet the max
        } else {
            currentBet += betToAdd;
        }
    }
    betAmountEl.textContent = currentBet;
    updateButtonState('betting');
});
});

window.onload = () => {
const savedWallet = getCookie('casinoWallet');
if (savedWallet && !isNaN(parseInt(savedWallet))) {
    wallet = parseInt(savedWallet);
} else {
    wallet = 10000; // Default starting wallet
}
walletAmountEl.textContent = wallet;
setCookie('casinoWallet', wallet, 365); // Ensure cookie is set on load

betAmountEl.textContent = currentBet;
updateButtonState('betting');
renderHands(); // Render empty hands on load
};
