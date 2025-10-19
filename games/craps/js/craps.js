$(document).ready(function () {

    updateButtonState('betting'); // Start in the betting phase

    updateActiveBetButton(currentBet); // Highlight initial bet amount

    renderAllBets(); // Display initial bet amounts (should be 0)

    updatePointIndicator(); // Initialize point indicators and bet area visibility

    // Set initial state of the Keep Bets button
    btnKeepBets.classList.toggle('active-toggle-button', keepWinningBets);

    initializeBonusDisplay(); // Initialize bonus UI elements

    resetBonusProgress(); // Ensure bonuses are reset at start of a new game session

});



// --- DOM Elements ---
const die1El = document.getElementById('die1');
const die2El = document.getElementById('die2');
const statusMessageEl = document.getElementById('statusMessage');
const btnRoll = document.getElementById('btnRoll');
const btnClearBets = document.getElementById('btnClearBets');
const btnKeepBets = document.getElementById('btnKeepBets');
const betButtons = document.querySelectorAll('.bet-value-button');
const betAmountEl = document.getElementById('betAmount');
const placeBetAreas = document.querySelectorAll('.bet-area[data-bet-type="place"]');
const passLineBetArea = document.getElementById('passLineBetArea');
const dontPassLineBetArea = document.getElementById('dontPassLineBetArea');
const fieldBetArea = document.getElementById('fieldBetArea');

// Bonus UI Elements
const gameConsoleEl = document.getElementById('gameConsole'); // Main game view
const bonusTrackerPanelEl = document.getElementById('bonusTrackerPanel');
const btnToggleBonus = document.getElementById('btnToggleBonus');
const btnBackToGame = document.getElementById('btnBackToGame');

// --- Game State ---
let wallet; // Initialized from cookie
let currentBet = 100;
let passLineBet = 0;
let dontPassBet = 0;
let fieldBet = 0;
let placeBets = { 4: 0, 5: 0, 6: 0, 8: 0, 9: 0, 10: 0 };
let point = 0; // 0 means point is OFF
let canRoll = false;
let keepWinningBets = true; // true by default

// --- Game Functions ---

function updateButtonState(state) {
    canRoll = state === 'readyToRoll';
    btnRoll.disabled = !canRoll;

    let canClear = false;
    if (point === 0) {
        // Can clear bets if there's any bet on Pass, Don't Pass, Field, or Bonus during come-out.
        if (passLineBet > 0 || dontPassBet > 0 || fieldBet > 0 || smallBonusBet > 0 || tallBonusBet > 0 || allBonusBet > 0) {
            canClear = true;
        }
    } else {
        // Can clear bets if there's any Place bet or Field bet during point-on.
        const hasPlaceBets = Object.values(placeBets).some(bet => bet > 0);
        if (fieldBet > 0 || hasPlaceBets) {
            canClear = true;
        }
    }
    btnClearBets.disabled = !canClear;
}

function updateActiveBetButton(selectedBet) {
    betButtons.forEach(btn => {
        if (btn.dataset.bet === 'max' && selectedBet === wallet) btn.classList.add('active');
        else if (parseInt(btn.dataset.bet) === selectedBet) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function updatePointIndicator() {
    // First, ensure all 'point-on' highlights are removed
    placeBetAreas.forEach(area => {
        area.classList.remove('point-on');
    });

    if (point === 0) { // Come-Out Roll Phase (Point is OFF)
        // SHOW Pass Line, Don't Pass Line, Field
        passLineBetArea.classList.remove('d-none');
        dontPassLineBetArea.classList.remove('d-none');
        fieldBetArea.classList.remove('d-none');

        // ENABLE Pass Line, Don't Pass Line for new bets (logic in handleBetPlacement prevents invalid combinations)
        passLineBetArea.classList.remove('disabled');
        dontPassLineBetArea.classList.remove('disabled');

        // HIDE and DISABLE all Place Bets for interaction
        placeBetAreas.forEach(area => {
            area.classList.add('d-none');
            area.classList.add('disabled');
        });

        // Enable bonus bets during come-out roll
        smallBonusBetArea.classList.remove('disabled');
        tallBonusBetArea.classList.remove('disabled');
        allBonusBetArea.classList.remove('disabled');

    } else { // Point is ON Phase
        // HIDE Pass Line, Don't Pass Line
        passLineBetArea.classList.add('d-none');
        dontPassLineBetArea.classList.add('d-none');
        fieldBetArea.classList.remove('d-none'); // Field is always visible

        // SHOW and ENABLE all Place Bets for interaction
        placeBetAreas.forEach(area => {
            area.classList.remove('d-none');
            area.classList.remove('disabled');
            const number = parseInt(area.dataset.number);
            if (point === number) {
                area.classList.add('point-on'); // Highlight the active point number
            }
        });

        // Disable bonus bets once point is established
        smallBonusBetArea.classList.add('disabled');
        tallBonusBetArea.classList.add('disabled');
        allBonusBetArea.classList.add('disabled');
    }
    // Field bet is always enabled for interaction
    fieldBetArea.classList.remove('disabled');
}

function renderAllBets() {
    document.getElementById('passLineBetAmount').textContent = passLineBet > 0 ? `$${passLineBet}` : '';
    document.getElementById('dontPassBetAmount').textContent = dontPassBet > 0 ? `$${dontPassBet}` : '';
    document.getElementById('fieldBetAmount').textContent = fieldBet > 0 ? `$${fieldBet}` : '';
    for (const num in placeBets) {
        document.getElementById(`placeBetAmount${num}`).textContent = placeBets[num] > 0 ? `$${placeBets[num]}` : '';
    }
    // New: Render bonus bet amounts
    document.getElementById('smallBonusBetAmount').textContent = smallBonusBet > 0 ? `$${smallBonusBet}` : '';
    document.getElementById('tallBonusBetAmount').textContent = tallBonusBet > 0 ? `$${tallBonusBet}` : '';
    document.getElementById('allBonusBetAmount').textContent = allBonusBet > 0 ? `$${allBonusBet}` : '';
}

function clearBoardForNewRound() {

    //alert("clearing board!");

    passLineBet = 0;

    dontPassBet = 0;

    fieldBet = 0;

    for (const num in placeBets) { placeBets[num] = 0; }

    point = 0; // Reset point

    renderAllBets();

    updatePointIndicator(); // Update UI for come-out roll phase

    updateButtonState('betting'); // Re-enable betting phase

    updateWalletDisplayAndCookie(); // Update wallet display and cookie

    if (wallet <= 0) showStatusMessage("Game Over", 2000);

}

function clearActiveBets() {

    //   alert("clear active bets?");

    let returnedAmount = 0;

    returnedAmount += fieldBet;
    fieldBet = 0;

    for (const num in placeBets) {
        returnedAmount += placeBets[num];
        placeBets[num] = 0;
    }

    if (point === 0) { // Only clear line and bonus bets if point is OFF (come out roll phase)
        returnedAmount += passLineBet;
        returnedAmount += dontPassBet;
        returnedAmount += smallBonusBet;
        returnedAmount += tallBonusBet;
        returnedAmount += allBonusBet;

        passLineBet = 0;
        dontPassBet = 0;
        smallBonusBet = 0;
        tallBonusBet = 0;
        allBonusBet = 0;
    } else {
        // Line and bonus bets cannot be removed if point is set, they are resolved by roll.
        showStatusMessage("Pass/Don't Pass and Bonus bets cannot be cleared while point is set.", 2000);
    }

    if (returnedAmount > 0) {
        wallet += returnedAmount;
        updateWalletDisplayAndCookie(); // Update wallet display and cookie
        renderAllBets();
        showStatusMessage(`Bets cleared: +$${returnedAmount}`);
        // After clearing, check if any bets remain to determine if game is ready to roll or betting.
        const hasBets = passLineBet > 0 || dontPassBet > 0 || fieldBet > 0 || smallBonusBet > 0 || tallBonusBet > 0 || allBonusBet > 0 || Object.values(placeBets).some(b => b > 0);
        updateButtonState(hasBets ? 'readyToRoll' : 'betting');
    } else {
        showStatusMessage("No bets to clear.", 1000);
    }
    updatePointIndicator(); // Re-evaluate disabled/visibility state for all bets
}

function handleRollResult(roll) {
    let messages = [];

    // Track bonus progress for any non-7 roll
    if (roll !== 7) {
        trackBonusProgress(roll);
    }

    // --- Resolve one-roll field bet first ---
    if (fieldBet > 0) {
        const bet = fieldBet;
        let payout = 0;
        let isWin = false;

        if ([3, 4, 9, 10, 11].includes(roll)) {
            payout = bet; // 1:1 payout
            isWin = true;
            messages.push(`Field bet wins <span style="color:#ffc107;">+$${payout}!</span>`);
        } else if (roll === 2) { // Specific payout for 2
            payout = bet * 2; // 2:1 payout
            isWin = true;
            messages.push(`Field bet wins <span style="color:#ffc107;">+$${payout}</span> on ${roll}!`);
        } else if (roll === 12) { // Specific payout for 12 (TRIPLE)
            payout = bet * 3; // 3:1 payout
            isWin = true;
            messages.push(`Field bet wins <span style="color:#ffc107;">+$${payout}</span> on ${roll}!`);
        }

        if (isWin) {
            wallet += payout; // Add winnings
            if (!keepWinningBets) {
                wallet += bet; // Return original bet if not keeping
                fieldBet = 0; // Clear field bet if not keeping
            }
            // If keepWinningBets is true, fieldBet remains on the table.
        } else {
            messages.push(`Field bet loses.`);
            fieldBet = 0; // Field bet is always lost and removed
        }
    }

    // --- POINT IS ON (After Come-Out Roll) ---
    if (point !== 0) {
        // Resolve Place Bets
        for (const num in placeBets) {
            const bet = placeBets[num];
            if (bet > 0) {
                if (parseInt(num) === roll) { // This place bet hits
                    let payout = 0;
                    if ([4, 10].includes(roll)) payout = Math.floor(bet * 9 / 5);
                    else if ([5, 9].includes(roll)) payout = Math.floor(bet * 7 / 5);
                    else if ([6, 8].includes(roll)) payout = Math.floor(bet * 7 / 6);

                    wallet += payout; // Add only the winnings
                    messages.push(`Place ${roll} wins <span style="color:#ffc107;">+$${payout}!</span>`);

                    if (!keepWinningBets) {
                        wallet += bet; // Return the original bet to the wallet
                        placeBets[num] = 0; // Clear the bet from the table
                    }
                }
            }
        }

        if (roll === point) {
            messages.push(`Point ${point} Hit! Pass Line Wins!`);
            if (passLineBet > 0) wallet += passLineBet * 2; // Win original bet + payout
            if (dontPassBet > 0) messages.push("Don't Pass loses.");

            // All remaining Place bets are returned (not paid, just returned) when point hits
            let returnedPlaceBets = 0;
            for (const num in placeBets) {
                returnedPlaceBets += placeBets[num];
                placeBets[num] = 0; // Clear all place bets
            }
            if (returnedPlaceBets > 0) {
                wallet += returnedPlaceBets;
                messages.push(`Remaining place bets returned: +$${returnedPlaceBets}`);
            }
            clearBoardForNewRound(); // Reset game state for new come-out roll

        } else if (roll === 7) {
            messages.push(`Seven Out! Pass Line and Place Bets Lose.`);
            if (dontPassBet > 0) {
                wallet += dontPassBet * 2; // Win original bet + payout
                messages.push("Don't Pass Wins!");
            }
            // Bonus bets are lost on 7-out if not already won
            if (smallBonusBet > 0) { showStatusMessage("Small Bonus bet loses."); smallBonusBet = 0; }
            if (tallBonusBet > 0) { showStatusMessage("Tall Bonus bet loses."); tallBonusBet = 0; }
            if (allBonusBet > 0) { showStatusMessage("All Bonus bet loses."); allBonusBet = 0; }

            resetBonusProgress(); // Reset bonus tracking on Seven Out
            clearBoardForNewRound(); // Reset game state for new come-out roll

        }
    }
    // --- COME-OUT ROLL ---
    else {
        if ([7, 11].includes(roll)) {
            messages.push(`${roll}! Pass Line Wins!`);
            if (passLineBet > 0) wallet += passLineBet * 2;
            if (dontPassBet > 0) messages.push("Don't Pass loses.");
            clearBoardForNewRound();
        } else if ([2, 3].includes(roll)) {
            messages.push(`${roll}! Craps! Pass loses.`);
            if (dontPassBet > 0) { wallet += dontPassBet * 2; messages.push("Don't Pass wins!"); }
            clearBoardForNewRound();
        } else if (roll === 12) {
            messages.push(`12! Pass loses. Don't Pass PUSH.`);
            if (dontPassBet > 0) wallet += dontPassBet; // Push (return original bet)
            clearBoardForNewRound();
        } else {
            point = roll;
            messages.push(`Point is now ${point}.`);
            updatePointIndicator(); // Switch to point-on UI
        }
    }

    showStatusMessage(messages.length > 0 ? messages.join('<br>') : `Rolled ${roll}.`);
    updateWalletDisplayAndCookie(); // Update wallet display and cookie
    renderAllBets();

    // Determine if ready for next roll or back to betting phase
    const hasBets = passLineBet > 0 || dontPassBet > 0 || fieldBet > 0 || smallBonusBet > 0 || tallBonusBet > 0 || allBonusBet > 0 || (point !== 0 && Object.values(placeBets).some(b => b > 0));
    if (point !== 0) updateButtonState('readyToRoll'); // If point is set, you can always roll
    else if (hasBets) updateButtonState('readyToRoll'); // If no point, but still have bets (e.g. field), you can roll
    else updateButtonState('betting'); // If no point and no bets, go to betting phase
}

function rollDice() {

    const hasLineBet = passLineBet > 0 || dontPassBet > 0;
    const hasOtherBets = fieldBet > 0 || Object.values(placeBets).some(b => b > 0);
    const hasBonusBets = smallBonusBet > 0 || tallBonusBet > 0 || allBonusBet > 0;

    // Can only roll if there's a Pass/Don't Pass bet (if point is off)
    // Or if there are any bets at all (if point is on or if it's a field bet or bonus bet)
    if (point === 0 && !hasLineBet && !hasOtherBets && !hasBonusBets) { // No point, and no line bets to set a point
        showStatusMessage("Place a Pass Line or Don't Pass bet to start!");
        return;
    } else if (point !== 0 && !hasLineBet && !hasOtherBets && !hasBonusBets) { // Point is on, but no bets remain (e.g., cleared them all)
        showStatusMessage("Place a bet to continue the round!");
        return;
    }

    const gameConsoleEl = document.getElementById('playingSurface');

    gameConsoleEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Scroll to the top of the game console so dice are visible
    //die1El.scrollIntoView({ behavior: 'smooth', block: 'center' });

    updateButtonState('inProgress'); // Disable buttons during roll animation

    throwDice();

}

function handleBetPlacement(area) {
    const type = area.dataset.betType;
    const number = parseInt(area.dataset.number); // For place bets
    const bonusTarget = area.dataset.bonusTarget; // For bonus bets

    if (currentBet <= 0 || wallet < currentBet) {
        showStatusMessage("Insufficient funds or invalid bet amount!");
        return;
    }

    // Prevent placing bets if the area is visually disabled (d-none)
    if (area.classList.contains('d-none')) {
        showStatusMessage("This bet cannot be placed at this time.", 1000);
        return;
    }

    // Specific rules for bet placement based on game state
    if (type === 'pass') {
        if (point !== 0) { showStatusMessage("Pass Line bets can only be placed on a Come-Out roll.", 1000); return; }
        if (dontPassBet > 0) { showStatusMessage("Cannot bet Pass and Don't Pass at the same time.", 1000); return; }
        passLineBet += currentBet;
    } else if (type === 'dontpass') {
        if (point !== 0) { showStatusMessage("Don't Pass bets can only be placed on a Come-Out roll.", 1000); return; }
        if (passLineBet > 0) { showStatusMessage("Cannot bet Pass and Don't Pass at the same time.", 1000); return; }
        dontPassBet += currentBet;
    } else if (type === 'place') {
        if (point === 0) { showStatusMessage("A point must be set before placing Place bets.", 1000); return; }
        placeBets[number] = (placeBets[number] || 0) + currentBet;
    } else if (type === 'field') {
        fieldBet += currentBet;
    } else if (type === 'bonus') {
        if (point !== 0) { showStatusMessage("Bonus bets can only be placed on a Come-Out roll.", 1000); return; }
        if (bonusTarget === 'small') {
            if (smallBonusBet > 0) { showStatusMessage("You already have a Small Bonus bet placed.", 1000); return; }
            smallBonusBet += currentBet;
        } else if (bonusTarget === 'tall') {
            if (tallBonusBet > 0) { showStatusMessage("You already have a Tall Bonus bet placed.", 1000); return; }
            tallBonusBet += currentBet;
        } else if (bonusTarget === 'all') {
            if (allBonusBet > 0) { showStatusMessage("You already have an All Bonus bet placed.", 1000); return; }
            allBonusBet += currentBet;
        }
    }

    wallet -= currentBet;
    updateWalletDisplayAndCookie(); // Update wallet display and cookie
    renderAllBets();
    updateButtonState('readyToRoll'); // Game is ready to roll once bets are placed
    updatePointIndicator(); // Re-evaluate UI state after placing a bet
}

const bettingLayoutElements = document.querySelectorAll('.bet-area');
bettingLayoutElements.forEach(area => {
    area.addEventListener('click', () => {
        handleBetPlacement(area);
    });
});

// New: Event delegation for bonus bet areas
const bonusBettingElements = document.querySelectorAll('.bonus-bet-area');
bonusBettingElements.forEach(area => {
    area.addEventListener('click', () => {
        handleBetPlacement(area);
    });
});

btnRoll.addEventListener('click', rollDice);

btnClearBets.addEventListener('click', clearActiveBets);

// Event listener for the Keep Bets button (toggle functionality)
btnKeepBets.addEventListener('click', () => {
    keepWinningBets = !keepWinningBets; // Toggle the boolean
    btnKeepBets.classList.toggle('active-toggle-button', keepWinningBets); // Toggle the class for visual feedback
    showStatusMessage(keepWinningBets ? "Winning bets will stay up." : "Winning bets will be returned.", 1000);
});

// Event listeners for bet value selection buttons
betButtons.forEach(button => {
    button.addEventListener('click', () => {
        const betValue = button.dataset.bet;
        currentBet = (betValue === 'max') ? wallet : parseInt(betValue);
        if (currentBet > wallet) currentBet = wallet; // Cap bet at wallet amount
        betAmountEl.textContent = currentBet.toLocaleString('en-US'); updateActiveBetButton(currentBet);
    });
});
