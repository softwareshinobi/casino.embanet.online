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
const bankerHandEl = document.getElementById('bankerHand'); // Tiger
const playerHandEl = document.getElementById('playerHand'); // Dragon
const bankerScoreEl = document.getElementById('bankerScore');
const playerScoreEl = document.getElementById('playerScore');
const statusMessageEl = document.getElementById('statusMessage');
const btnBetPlayer = document.getElementById('btnBetDragon'); // Dragon Button
const btnBetBanker = document.getElementById('btnBetTiger'); // Tiger Button
const btnBetTie = document.getElementById('btnBetTie');
const btnDeal = document.getElementById('btnDeal');
const btnClearBet = document.getElementById('btnClearBet');
const betTypeButtons = [btnBetPlayer, btnBetBanker, btnBetTie];
const betButtons = document.querySelectorAll('.bet-value-button');
//const walletAmountEl = document.getElementById('walletAmount');
const betAmountEl = document.getElementById('betAmount');

// --- Game State Variables ---
let deck = [], playerHand = [], bankerHand = [];
let wallet;
let currentBet = 0;
let playerBetType = null; 

// --- Top Card / Dragon Tiger Logic ---

function createDeck() {
    const s = ['♥','♦','♣','♠'];
    // Ranking: 2 is lowest (2), Ace is highest (14)
    const v = [
        {val: '2', rank: 2}, {val: '3', rank: 3}, {val: '4', rank: 4}, 
        {val: '5', rank: 5}, {val: '6', rank: 6}, {val: '7', rank: 7}, 
        {val: '8', rank: 8}, {val: '9', rank: 9}, {val: '10', rank: 10}, 
        {val: 'J', rank: 11}, {val: 'Q', rank: 12}, {val: 'K', rank: 13}, 
        {val: 'A', rank: 14}
    ];
    deck = [];
    for (let suit of s) {
        for (let item of v) {
            deck.push({ suit, value: item.val, rank: item.rank });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getHandScore(hand) {
    if (hand.length === 0) return 0;
    return hand[0].rank;
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
    // Display card values (e.g., "14" for Ace)
    playerScoreEl.textContent = playerHand.length ? playerHand[0].value : 0;
    bankerScoreEl.textContent = bankerHand.length ? bankerHand[0].value : 0;
}

function showStatusMessage(message, duration = 2000) {
    statusMessageEl.innerHTML = message;
    statusMessageEl.style.display = 'block';
    setTimeout(() => statusMessageEl.style.display = 'none', duration);
}

function updateButtonState(state) {
    const isBetting = state === 'betting';
    btnDeal.disabled = !isBetting || !playerBetType || currentBet <= 0;
    betTypeButtons.forEach(b => b.disabled = !isBetting);
    betButtons.forEach(b => b.disabled = !isBetting);
    btnClearBet.disabled = !isBetting;
}

function determineWinner() {
    const dScore = getHandScore(playerHand); // Dragon
    const tScore = getHandScore(bankerHand); // Tiger
    let outcome, msg;

    if (dScore > tScore) outcome = 'dragon';
    else if (tScore > dScore) outcome = 'tiger';
    else outcome = 'tie';

    if (outcome === playerBetType) {
        // WINNER
        let winnings = 0;
        if (outcome === 'tie') {
            winnings = currentBet * 11; // 11:1 Payout
            msg = `TIE! You win $${winnings}!`;
        } else {
            winnings = currentBet; // 1:1 Payout
            msg = `${outcome.toUpperCase()} Wins! You win $${winnings}!`;
        }
        wallet += currentBet + winnings;
    } else if (outcome === 'tie' && (playerBetType === 'player' || playerBetType === 'banker')) {
        // PUSH: Return half the bet
        const returnAmount = Math.floor(currentBet / 2);
        msg = `TIE! 1/2 bet ($${returnAmount}) returned.`;
        wallet += returnAmount;
    } else {
        // LOSS
        msg = `${outcome.toUpperCase()} Wins. You Lose.`;
    }

    showStatusMessage(msg, 2500);
    walletAmountEl.textContent = wallet;
    setCookie('casinoWallet', wallet, 365);

    // Reset for next round
    playerBetType = null;
    currentBet = 0;
    betAmountEl.textContent = currentBet;
    betTypeButtons.forEach(b => b.classList.remove('active'));

    setTimeout(() => {
        if (wallet <= 0) {
            showStatusMessage("Bankrupt! Resetting to $10000.", 3000);
            wallet = 10000;
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
    
    // Top Card: Only one card each
    playerHand = [deck.pop()];
    bankerHand = [deck.pop()];

    setTimeout(() => {
        renderHands();
        setTimeout(determineWinner, 1000);
    }, 500);
}

// --- Event Listeners ---
betTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const newBetType = button.id.replace('btnBet', '').toLowerCase();
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
    const surface = document.getElementById('playingSurface');
    if(surface) surface.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (currentBet === 0 || wallet < currentBet) {
        showStatusMessage("Invalid Bet!", 1500);
        return;
    }
    if (!playerBetType) {
        showStatusMessage("Select Dragon, Tiger, or Tie!", 1500);
        return;
    }
    
    wallet -= currentBet;
    walletAmountEl.textContent = wallet;
    setCookie('casinoWallet', wallet, 365);
    runGameSequence();
});

betButtons.forEach(button => {
    button.addEventListener('click', () => {
        const val = button.dataset.bet;
        if (val === 'max') {
            currentBet = wallet;
        } else {
            const amt = parseInt(val);
            currentBet = (currentBet + amt > wallet) ? wallet : currentBet + amt;
        }
        betAmountEl.textContent = currentBet;
        updateButtonState('betting');
    });
});

// --- Utility Helpers ---
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
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

window.onload = () => {
    const saved = getCookie('casinoWallet');
    wallet = (saved && !isNaN(parseInt(saved))) ? parseInt(saved) : 10000;
    walletAmountEl.textContent = wallet;
    betAmountEl.textContent = currentBet;
    updateButtonState('betting');
    renderHands();
};
