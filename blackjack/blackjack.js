document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar.fixed-top');
    const bodyElement = document.body;

    if (navbar) {
        const updateLayout = () => {
            const navbarHeight = navbar.offsetHeight;
            // Set CSS variable for navbar height
            bodyElement.style.setProperty('--navbar-height', navbarHeight + 'px');

            // Apply padding to body based on navbar height
            bodyElement.style.paddingTop = navbarHeight + 'px';

            // For desktop (min-width: 769px assumed, or whatever Bootstrap's lg breakpoint is)
            if (window.innerWidth > 768) {
                bodyElement.style.alignItems = 'center'; /* Center game-console vertically */
                bodyElement.style.overflowY = 'hidden'; /* No scroll on desktop */
            } else { /* For mobile (max-width: 768px) */
                bodyElement.style.alignItems = 'flex-start'; /* Align to top */
                bodyElement.style.overflowY = 'auto'; /* Allow scroll on mobile */
            }
        };

        // Initial call and on resize
        updateLayout();
        window.addEventListener('resize', updateLayout);
    }
});

    // --- DOM Elements ---
    const dealerHandEl = document.getElementById('dealerHand');
    const playerHandEl = document.getElementById('playerHand');
    const dealerScoreEl = document.getElementById('dealerScore');
    const playerScoreEl = document.getElementById('playerScore');
    const statusMessageEl = document.getElementById('statusMessage');
    const btnHit = document.getElementById('btnHit');
    const btnStand = document.getElementById('btnStand');
    const btnDouble = document.getElementById('btnDouble');
    const btnDeal = document.getElementById('btnDeal');
    const btnClearBet = document.getElementById('btnClearBet');
    const betButtons = document.querySelectorAll('.bet-value-button');
    const walletAmountEl = document.getElementById('walletAmount');
    const betAmountEl = document.getElementById('betAmount');
    const playerActionButtonsEl = document.getElementById('playerActionButtons');

    // --- Game State Variables ---
    let deck = [], playerHand = [], dealerHand = [];
    let wallet;
    let currentBet = 0; // The player's bet amount being built for the next hand
    let handBet = 0; // The actual amount wagered on the current hand, including doubles
    let gameInProgress = false;

    // --- Utility function for scrolling ---
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    function getScore(hand) {
        let score = 0, aceCount = 0;
        for (let card of hand) {
            if (card.value === 'A') { aceCount++; score += 11; }
            else if (['K', 'Q', 'J'].includes(card.value)) score += 10;
            else score += parseInt(card.value);
        }
        while (score > 21 && aceCount > 0) { score -= 10; aceCount--; }
        return score;
    }

    function createCardElement(card, isHidden = false) {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        if (isHidden) { cardEl.classList.add('hidden'); }
        else {
            cardEl.classList.add((card.suit === '♥' || card.suit === '♦') ? 'red' : 'black');
            cardEl.innerHTML = `<div class="card-top"><span>${card.value}</span><span class="suit">${card.suit}</span></div><div class="card-bottom"><span>${card.value}</span><span class="suit">${card.suit}</span></div>`;
        }
        return cardEl;
    }

    function renderHands() {
        dealerHandEl.innerHTML = '';
        playerHandEl.innerHTML = '';
        dealerHand.forEach((c, i) => dealerHandEl.appendChild(createCardElement(c, gameInProgress && i === 0)));
        playerHand.forEach(c => playerHandEl.appendChild(createCardElement(c)));
        playerScoreEl.textContent = getScore(playerHand);
        dealerScoreEl.textContent = gameInProgress ? getScore([dealerHand[1]]) : getScore(dealerHand);
    }

    function showStatusMessage(message, duration = 1000) {
        statusMessageEl.innerHTML = message;
        statusMessageEl.style.display = 'block';
        setTimeout(() => statusMessageEl.style.display = 'none', duration);
    }

    function updateButtonState(state) {
        const isBetting = state === 'bet', isPlaying = state === 'play';

        btnDeal.style.display = isBetting ? 'block' : 'none';
        playerActionButtonsEl.style.display = isPlaying ? 'flex' : 'none';

        btnDeal.disabled = !isBetting;
        btnHit.disabled = !isPlaying;
        btnStand.disabled = !isPlaying;
        btnDouble.disabled = !(isPlaying && playerHand.length === 2 && wallet >= handBet);
        betButtons.forEach(btn => btn.disabled = !isBetting);
        btnClearBet.disabled = !isBetting;
    }

    function endGame() {
        gameInProgress = false;
        updateButtonState('bet');
        renderHands();

        const pScore = getScore(playerHand);
        const dScore = getScore(dealerHand);
        let msg = '';
        let winLossAmount = 0;

        if (pScore > 21) {
            msg = 'Player Busts!';
            winLossAmount = -handBet;
        } else if (dScore > 21 || pScore > dScore) {
            msg = 'Player Wins!';
            winLossAmount = handBet;
            wallet += handBet * 2;
        } else if (pScore < dScore) {
            msg = 'Dealer Wins!';
            winLossAmount = -handBet;
        } else {
            msg = 'Push!';
            winLossAmount = 0;
            wallet += handBet;
        }

        if (winLossAmount > 0) msg += ` +$${winLossAmount}`;
        else if (winLossAmount < 0) msg += ` -$${Math.abs(winLossAmount)}`;
        else msg += ` $0`;

        showStatusMessage(msg, 2000);
        walletAmountEl.textContent = wallet;
        setCookie('casinoWallet', wallet, 365);
        setCookie('lastBet', handBet, 365); // Store the last bet

        // currentBet = 0; // Removed to allow auto-applying previous bet
        // betAmountEl.textContent = currentBet; // Removed to allow auto-applying previous bet

        if (wallet <= 0) {
            setTimeout(() => {
                showStatusMessage("Game Over! Restarting with $1000.", 3000);
                wallet = 1000;
                walletAmountEl.textContent = wallet;
                setCookie('casinoWallet', wallet, 365);
                updateButtonState('bet');
            }, 2000);
        }
        scrollToTop();
    }

    function dealerTurn() {
        gameInProgress = false;
        renderHands();
        const dealerInterval = setInterval(() => {
            if (getScore(dealerHand) < 17) {
                dealerHand.push(deck.pop());
                renderHands();
            } else {
                clearInterval(dealerInterval);
                endGame();
            }
        }, 1000);
    }

    function dealNewHand() {
        if (currentBet === 0) { // Only auto-apply if no bet has been explicitly set for the new hand
            const lastBet = parseInt(getCookie('lastBet') || '0');
            if (lastBet > 0 && wallet >= lastBet) {
                currentBet = lastBet;
            } else if (wallet < lastBet && wallet > 0) { // If wallet is less than last bet, bet max wallet
                currentBet = wallet;
            } else {
                currentBet = 0; // Default to 0 if no last bet or wallet is 0
            }
        }

        if (currentBet <= 0 || wallet < currentBet) {
            showStatusMessage("Invalid bet amount!", 1500);
            return;
        }

        gameInProgress = true;
        handBet = currentBet;
        wallet -= handBet;
        setCookie('casinoWallet', wallet, 365);
        walletAmountEl.textContent = wallet;
        betAmountEl.textContent = handBet; // Update bet display with the actual handBet

        createDeck();
        shuffleDeck();
        playerHand = [deck.pop(), deck.pop()];
        dealerHand = [deck.pop(), deck.pop()];
        renderHands();
        updateButtonState('play');
        scrollToTop();

        if (getScore(playerHand) === 21) {
            const isBlackjack = true;
            processEndOfHand(isBlackjack);
        } else if (getScore(dealerHand) === 21) {
            processEndOfHand(false);
        }
    }

    function processEndOfHand(playerHasBlackjack = false) {
        gameInProgress = false;
        renderHands();
        const dealerScore = getScore(dealerHand);
        let msg = '';

        if (playerHasBlackjack) {
            if (dealerScore === 21) {
                msg = 'Push! Both have Blackjack. $0';
                wallet += handBet;
            } else {
                const blackjackWinnings = Math.floor(handBet * 1.5);
                msg = `Blackjack! +$${blackjackWinnings}`;
                wallet += handBet + blackjackWinnings;
            }
        } else { // Dealer Blackjack
            msg = `Dealer has Blackjack! -$${handBet}`;
        }

        showStatusMessage(msg, 2000);
        walletAmountEl.textContent = wallet;
        setCookie('casinoWallet', wallet, 365);
        setCookie('lastBet', handBet, 365); // Store the last bet

        setTimeout(() => {
            updateButtonState('bet');
            // currentBet = 0; // Removed to allow auto-applying previous bet
            // betAmountEl.textContent = currentBet; // Removed to allow auto-applying previous bet
            if (wallet <= 0) {
                showStatusMessage("Game Over! Restarting with $10000.", 3000);
                wallet = 10000;
                walletAmountEl.textContent = wallet;
                setCookie('casinoWallet', wallet, 365);
                updateButtonState('bet');
            }
            scrollToTop();
        }, 2000);
    }

    btnDeal.addEventListener('click', dealNewHand);

    btnHit.addEventListener('click', () => {
        if (!gameInProgress) return;
        playerHand.push(deck.pop());
        renderHands();
        updateButtonState('play');
        if (getScore(playerHand) > 21) {
            endGame();
        }
        scrollToTop();
    });

    btnStand.addEventListener('click', () => {
        if (gameInProgress) dealerTurn();
        scrollToTop();
    });

    btnDouble.addEventListener('click', () => {
        if (!gameInProgress || playerHand.length !== 2 || wallet < handBet) return;

        wallet -= handBet;
        setCookie('casinoWallet', wallet, 365);
        handBet += handBet;

        betAmountEl.textContent = handBet;
        walletAmountEl.textContent = wallet;

        playerHand.push(deck.pop());
        renderHands();

        btnHit.disabled = true;
        btnStand.disabled = true;
        btnDouble.disabled = true;

        if (getScore(playerHand) > 21) {
            endGame();
        } else {
            dealerTurn();
        }
        scrollToTop();
    });

    btnClearBet.addEventListener('click', () => {
        currentBet = 0;
        betAmountEl.textContent = currentBet;
    });

    betButtons.forEach(button => {
        button.addEventListener('click', () => {
            const betValueStr = button.dataset.bet;
            if (betValueStr === 'max') {
                currentBet = wallet;
            } else {
                const betToAdd = parseInt(betValueStr);
                if (currentBet + betToAdd > wallet) {
                    currentBet = wallet;
                } else {
                    currentBet += betToAdd;
                }
            }
            betAmountEl.textContent = currentBet;
        });
    });

    window.onload = () => {
        const savedWallet = getCookie('casinoWallet');
        if (savedWallet && !isNaN(parseInt(savedWallet))) {
            wallet = parseInt(savedWallet);
        } else {
            wallet = 10000;
        }
        setCookie('casinoWallet', wallet, 365);
        walletAmountEl.textContent = wallet;

        const lastBet = parseInt(getCookie('lastBet') || '0');
        if (lastBet > 0 && wallet >= lastBet) {
            currentBet = lastBet;
        } else if (wallet < lastBet && wallet > 0) {
            currentBet = wallet; // If wallet is less than last bet, bet max wallet
        } else {
            currentBet = 0; // No last bet or wallet is 0, start with 0 bet
        }
        betAmountEl.textContent = currentBet;

        updateButtonState('bet');
        playerHandEl.innerHTML = '';
        dealerHandEl.innerHTML = '';
        dealerScoreEl.textContent = '0';
        playerScoreEl.textContent = '0';
    };
