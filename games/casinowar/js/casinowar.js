document.addEventListener('DOMContentLoaded', function() {

const navbar = document.querySelector('.navbar.fixed-top');

if (navbar) {

    const navbarHeight = navbar.offsetHeight;

    // This line correctly sets the padding-top of the body to account for the fixed navbar
    document.body.style.paddingTop = navbarHeight + 'px';

    window.addEventListener('resize', () => {

        const newNavbarHeight = navbar.offsetHeight;

        document.body.style.paddingTop = newNavbarHeight + 'px';

    });

}

});


// --- DOM Elements ---
const dealerHandEl = document.getElementById('dealerHand');
const playerHandEl = document.getElementById('playerHand');
const statusMessageEl = document.getElementById('statusMessage');
const btnWar = document.getElementById('btnWar');
const btnSurrender = document.getElementById('btnSurrender');
const btnDeal = document.getElementById('btnDeal');
const betButtons = document.querySelectorAll('.bet-button');
//const walletAmountEl = document.getElementById('walletAmount');
const betAmountEl = document.getElementById('betAmount');

// --- Game State Variables ---
let deck = [], playerCard, dealerCard;
let wallet, currentBet = 100, warBet = 0;
let gameInProgress = false;

// Initialize wallet from cookie or set a new one
const savedWallet = getCookie('casinoWallet');
if (savedWallet && !isNaN(parseInt(savedWallet))) {
    wallet = parseInt(savedWallet);
} else {
    wallet = 10000; // Default starting balance
    setCookie('casinoWallet', wallet, 365); // Create the cookie
    alert("Welcome! A new starting balance of $10,000 has been set for the casino.");
}


// --- Game Logic ---
function createDeck() {
    const suits = ['♥', '♦', '♣', '♠'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    deck = [];
    for (let suit of suits) for (let value of values) deck.push({ suit, value });
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getCardValue(card) {
    const value = card.value;
    if (value === 'A') return 14;
    if (value === 'K') return 13;
    if (value === 'Q') return 12;
    if (value === 'J') return 11;
    return parseInt(value);
}

function createCardElement(card) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.classList.add((card.suit === '♥' || card.suit === '♦') ? 'red' : 'black');
    cardEl.innerHTML = `<div class="card-top"><span>${card.value}</span><span class="suit">${card.suit}</span></div><div class="card-bottom"><span>${card.value}</span><span class="suit">${card.suit}</span></div>`;
    return cardEl;
}

function renderHands(pCard, dCard) {
    playerHandEl.innerHTML = '';
    dealerHandEl.innerHTML = '';
    if (pCard) playerHandEl.appendChild(createCardElement(pCard));
    if (dCard) dealerHandEl.appendChild(createCardElement(dCard));
}

function showStatusMessage(message, duration = 1000) {
    statusMessageEl.innerHTML = message;
    statusMessageEl.style.display = 'block';
    setTimeout(() => statusMessageEl.style.display = 'none', duration);
}

function updateButtonState(state) {
    // States: 'deal', 'war', 'inprogress'
    btnDeal.disabled = state !== 'deal';
    btnWar.disabled = state !== 'war';
    btnSurrender.disabled = state !== 'war';
    betButtons.forEach(btn => btn.disabled = state !== 'deal');
}

function updateActiveBetButton(selectedBet) {
        betButtons.forEach(btn => {
        if(btn.dataset.bet === 'max' && selectedBet === wallet) btn.classList.add('active');
        else if (parseInt(btn.dataset.bet) === selectedBet) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function endRound(outcome) {
    let message = '';
    if(outcome === 'win') { message = "You Win!"; wallet += currentBet + warBet; }
    else if(outcome === 'loss') { message = "You Lose!"; wallet -= (currentBet + warBet); }
    else if(outcome === 'surrender') { message = "Surrendered"; wallet -= Math.ceil(currentBet/2); }

    showStatusMessage(message, 1000);
    walletAmountEl.textContent = wallet;
    setCookie('casinoWallet', wallet, 365); // Save wallet to cookie
    warBet = 0;
    updateButtonState('deal');
    if (wallet <= 0) {
        showStatusMessage("Game Over!", 5000);
    }
}

function compareCards(pCard, dCard, isWar = false) {
        const playerValue = getCardValue(pCard);
        const dealerValue = getCardValue(dCard);

        if(playerValue > dealerValue) endRound('win');
        else if (dealerValue > playerValue) endRound('loss');
        else { // Tie
        if(isWar) { endRound('win'); } // Tie on war is a win
        else {
            showStatusMessage('TIE! Go to War?', 2000);
            updateButtonState('war');
        }
        }
}

function handleSurrender() {
    endRound('surrender');
}

function handleWar() {
    if (wallet < currentBet) {
        showStatusMessage("Not enough for War!");
        return;
    }
    updateButtonState('inprogress');
    wallet -= currentBet; // Player places an additional bet
    walletAmountEl.textContent = wallet;
    setCookie('casinoWallet', wallet, 365); // Save wallet after placing war bet
    warBet = currentBet;

    showStatusMessage("Burning cards...", 1500);

    setTimeout(() => {
        if (deck.length < 5) { createDeck(); shuffleDeck(); } // Ensure enough cards
        deck.pop(); deck.pop(); deck.pop(); // Burn 3

        const playerWarCard = deck.pop();
        const dealerWarCard = deck.pop();
        renderHands(playerWarCard, dealerWarCard);

        setTimeout(() => compareCards(playerWarCard, dealerWarCard, true), 1000);

    }, 1500);
}

function dealNewHand() {
    if (currentBet === 0 || wallet < currentBet) {
        showStatusMessage("Invalid Bet!");
        return;
    }
    updateButtonState('inprogress');
    createDeck();
    shuffleDeck();
    playerCard = deck.pop();
    dealerCard = deck.pop();
    renderHands(playerCard, dealerCard);
    setTimeout(() => compareCards(playerCard, dealerCard), 1000);
}

btnDeal.addEventListener('click', dealNewHand);
btnWar.addEventListener('click', handleWar);
btnSurrender.addEventListener('click', handleSurrender);

betButtons.forEach(button => {
    button.addEventListener('click', () => {
        const betValue = button.dataset.bet;
        currentBet = (betValue === 'max') ? wallet : parseInt(betValue);
        if (currentBet > wallet) currentBet = wallet;
        betAmountEl.textContent = currentBet;
        updateActiveBetButton(currentBet);
    });
});

window.onload = () => {
    walletAmountEl.textContent = wallet; // Display wallet from cookie on load
    updateButtonState('deal');
    updateActiveBetButton(currentBet);
    playerHandEl.innerHTML = '';
    dealerHandEl.innerHTML = '';
};
