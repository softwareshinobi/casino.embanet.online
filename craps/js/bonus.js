const smallBonusNumbersEl = document.getElementById('smallBonusNumbers');
const tallBonusNumbersEl = document.getElementById('tallBonusNumbers');
const allBonusNumbersEl = document.getElementById('allBonusNumbers');

const smallBonusStatusEl = document.getElementById('smallBonusStatus');
const tallBonusStatusEl = document.getElementById('tallBonusStatus');
const allBonusStatusEl = document.getElementById('allBonusStatus');

const smallBonusBetArea = document.querySelector('.bonus-bet-area[data-bonus-target="small"]');
const tallBonusBetArea = document.querySelector('.bonus-bet-area[data-bonus-target="tall"]');
const allBonusBetArea = document.querySelector('.bonus-bet-area[data-bonus-target="all"]');

// --- Bonus Game State ---
let smallBonusNumbersHit = new Set();
let tallBonusNumbersHit = new Set();
let allBonusNumbersHit = new Set(); // Will combine small and tall

const SMALL_BONUS_TARGETS = new Set([2, 3, 4, 5, 6]);
const TALL_BONUS_TARGETS = new Set([8, 9, 10, 11, 12]);
const ALL_BONUS_TARGETS = new Set([...SMALL_BONUS_TARGETS, ...TALL_BONUS_TARGETS]);

// New: Bonus Bet Amounts
let smallBonusBet = 0;
let tallBonusBet = 0;
let allBonusBet = 0;


/**
    * Initializes the bonus numbers display.
    * Populates the 'All' bonus section dynamically.
    */
function initializeBonusDisplay() {
    // Populate All Bonus numbers dynamically
    ALL_BONUS_TARGETS.forEach(num => {
        const span = document.createElement('span');
        span.classList.add('badge', 'bg-secondary');
        span.textContent = num;
        span.dataset.bonusNum = num;
        allBonusNumbersEl.appendChild(span);
    });
    updateBonusDisplay(); // Set initial badge states
}

/**
    * Updates the visual representation of bonus numbers (hit/not hit) and status.
    */
function updateBonusDisplay() {
    // Small Bonus
    SMALL_BONUS_TARGETS.forEach(num => {
        const span = smallBonusNumbersEl.querySelector(`[data-bonus-num="${num}"]`);
        if (span) {
            if (smallBonusNumbersHit.has(num)) {
                span.classList.add('bg-primary', 'hit');
                span.classList.remove('bg-secondary');
            } else {
                span.classList.remove('bg-primary', 'hit');
                span.classList.add('bg-secondary');
            }
        }
    });
    if (smallBonusNumbersHit.size === SMALL_BONUS_TARGETS.size) {
        smallBonusStatusEl.textContent = "COMPLETED!";
        smallBonusStatusEl.style.color = "lightgreen";
    } else {
        smallBonusStatusEl.textContent = "In Progress";
        smallBonusStatusEl.style.color = "";
    }

    // Tall Bonus
    TALL_BONUS_TARGETS.forEach(num => {
        const span = tallBonusNumbersEl.querySelector(`[data-bonus-num="${num}"]`);
        if (span) {
            if (tallBonusNumbersHit.has(num)) {
                span.classList.add('bg-primary', 'hit');
                span.classList.remove('bg-secondary');
            } else {
                span.classList.remove('bg-primary', 'hit');
                span.classList.add('bg-secondary');
            }
        }
    });
    if (tallBonusNumbersHit.size === TALL_BONUS_TARGETS.size) {
        tallBonusStatusEl.textContent = "COMPLETED!";
        tallBonusStatusEl.style.color = "lightgreen";
    } else {
        tallBonusStatusEl.textContent = "In Progress";
        tallBonusStatusEl.style.color = "";
    }

    // All Bonus
    ALL_BONUS_TARGETS.forEach(num => {
        const span = allBonusNumbersEl.querySelector(`[data-bonus-num="${num}"]`);
        if (span) {
            if (allBonusNumbersHit.has(num)) {
                span.classList.add('bg-primary', 'hit');
                span.classList.remove('bg-secondary');
            } else {
                span.classList.remove('bg-primary', 'hit');
                span.classList.add('bg-secondary');
            }
        }
    });
    if (allBonusNumbersHit.size === ALL_BONUS_TARGETS.size) {
        allBonusStatusEl.textContent = "COMPLETED!";
        allBonusStatusEl.style.color = "lightgreen";
    } else {
        allBonusStatusEl.textContent = "In Progress";
        allBonusStatusEl.style.color = "";
    }
}

/**
    * Tracks the progress of Small, Tall, and All bonuses based on the rolled number.
    * Awards payout if a bonus is completed.
    * @param {number} roll - The sum of the two dice.
    */
function trackBonusProgress(roll) {
    if (SMALL_BONUS_TARGETS.has(roll)) {
        smallBonusNumbersHit.add(roll);
        allBonusNumbersHit.add(roll);
    }
    if (TALL_BONUS_TARGETS.has(roll)) {
        tallBonusNumbersHit.add(roll);
        allBonusNumbersHit.add(roll);
    }
    updateBonusDisplay(); // Update UI after each roll

    // Check for bonus completion and payout
    // Small Bonus Payout
    if (smallBonusNumbersHit.size === SMALL_BONUS_TARGETS.size && smallBonusBet > 0) {
        const payout = smallBonusBet * 30; // 20x payout for Small
        wallet += payout + smallBonusBet; // Return original bet + payout
        showStatusMessage(`Small Bonus Completed! You won +$${payout}!`, 3000); // Increased duration
        smallBonusBet = 0; // Clear the bet after payout
        updateWalletDisplayAndCookie();
        renderAllBets();
    }

    // Tall Bonus Payout
    if (tallBonusNumbersHit.size === TALL_BONUS_TARGETS.size && tallBonusBet > 0) {
        const payout = tallBonusBet * 30; // 20x payout for Tall
        wallet += payout + tallBonusBet; // Return original bet + payout
        showStatusMessage(`Tall Bonus Completed! You won +$${payout}!`, 3000); // Increased duration
        tallBonusBet = 0; // Clear the bet after payout
        updateWalletDisplayAndCookie();
        renderAllBets();
    }

    // All Bonus Payout
    if (allBonusNumbersHit.size === ALL_BONUS_TARGETS.size && allBonusBet > 0) {
        const payout = allBonusBet * 150; // 50x payout for All
        wallet += payout + allBonusBet; // Return original bet + payout
        showStatusMessage(`All Bonus Completed! You won +$${payout}!`, 3000); // Increased duration
        allBonusBet = 0; // Clear the bet after payout
        updateWalletDisplayAndCookie();
        renderAllBets();
    }
}

/**
    * Resets all bonus tracking sets and updates the display.
    * This is typically called when a "seven out" occurs.
    */
function resetBonusProgress() {
    smallBonusNumbersHit.clear();
    tallBonusNumbersHit.clear();
    allBonusNumbersHit.clear();
    updateBonusDisplay();
}



// Event listeners for Bonus View Toggle
btnToggleBonus.addEventListener('click', () => {
    gameConsoleEl.style.display = 'none';
    bonusTrackerPanelEl.style.display = 'flex'; // Use flex as defined in .game-console style
});

btnBackToGame.addEventListener('click', () => {
    gameConsoleEl.style.display = 'flex'; // Use flex as defined in .game-console style
    bonusTrackerPanelEl.style.display = 'none';
});

