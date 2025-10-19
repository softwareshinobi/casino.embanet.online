const rollHistoryArray = [];

function throwDice() {

    console.log("throwDice called");

    const { dieOne, dieTwo } = animateDiceRoll();

    console.log("Animated Dice Values:", dieOne, dieTwo);

    completeRollAndLog(dieOne, dieTwo);

    console.log("throwDice finished");

    handleRollResult(dieOne + dieTwo);

    console.log("handleRollResult finished");

}

function throwDiceRigged(riggedDieOne, riggedDieTwo) {

    console.log("throwRiggedDice called");
    console.log("Rigged Dice Values:", riggedDieOne, riggedDieTwo);

    const { dieOne, dieTwo } = animateDiceRoll();

    completeRollAndLog(riggedDieOne, riggedDieTwo);

    handleRollResult(dieOne + dieTwo);

}

function generateRandomDiceValues() {

    const d1 = Math.floor(Math.random() * 6) + 1;

    const d2 = Math.floor(Math.random() * 6) + 1;

    return { d1, d2 };

}

function animateDiceRoll() {

    const maxRolls = 10;

    let dieOne, dieTwo;

    for (let rollCount = 0; rollCount < maxRolls; rollCount++) {

        console.log("Animating roll:", rollCount + 1);

        const { d1, d2 } = generateRandomDiceValues();

        updateDieDisplay(d1, d2);

        dieOne = d1;

        dieTwo = d2;

    }

    console.log("Final Dice Values after animation:", dieOne, dieTwo);

    return { dieOne, dieTwo };

}

function updateDieDisplay(d1, d2) {

    die1El.textContent = d1;

    die2El.textContent = d2;

}

function completeRollAndLog(dieOne, dieTwo) {

    console.log("handleRollResult called with:", dieOne, dieTwo);

    die1El.textContent = dieOne;

    die2El.textContent = dieTwo;

    dieTotal = dieOne + dieTwo;

    events.publish('dieRolled', { dieOne, dieTwo, dieTotal });

    rollHistoryArray.push({ dieOne, dieTwo, dieTotal, timestamp: new Date() });
    
    rollHistory();

}

function throwDice1() {

    console.log("throwDice called");

    let rollCount = 0;

    const rollInterval = setInterval(() => {

        const d1 = Math.floor(Math.random() * 6) + 1;

        const d2 = Math.floor(Math.random() * 6) + 1;

        die1El.textContent = d1;

        die2El.textContent = d2;

        rollCount++;

        if (rollCount > 10) {

            clearInterval(rollInterval);

            const dieOne = Math.floor(Math.random() * 6) + 1;

            const dieTwo = Math.floor(Math.random() * 6) + 1;

            const dieTotal = dieOne + dieTwo;

            die1El.textContent = dieOne;

            die2El.textContent = dieTwo;

            //
            //
            //

            events.publish('dieRolled', { dieOne, dieTwo, dieTotal });

            // --- ADDED: Record the roll result ---
            // Push an object containing the individual dice values and the total
            rollHistoryArray.push({ die1: dieOne, die2: dieTwo, total: dieOne + dieTwo, timestamp: new Date() });
            // ------------------------------------

            completeRollAndLog(dieOne + dieTwo);

        }

    }, 100);

    console.log("throwDice finished");

}

function throwDiceRigged1(riggedDieOne, riggedDieTwo) {

    console.log("throwRiggedDice called");
    console.log("Rigged Dice Values:", riggedDieOne, riggedDieTwo);

    let rollCount = 0;

    const rollInterval = setInterval(() => {

        const d1 = ((riggedDieOne - 1) % 6) + 1;
        const d2 = ((riggedDieTwo - 1) % 6) + 1;

        die1El.textContent = d1;

        die2El.textContent = d2;

        rollCount++;

        if (rollCount > 10) {

            clearInterval(rollInterval);

            const dieOne = ((d1 - 1) % 6) + 1;

            const dieTwo = ((d2 - 1) % 6) + 1;

            const dieTotal = dieOne + dieTwo;

            die1El.textContent = dieOne;

            die2El.textContent = dieTwo;

            events.publish('dieRolled', { dieOne, dieTwo, dieTotal });

            rollHistoryArray.push({ dieOne, dieTwo, dieTotal, timestamp: new Date() });

            // ------------------------------------

            completeRollAndLog(dieOne + dieTwo);

        }

    }, 100);

    console.log("throwRiggedDice finished");

}

function rollHistory(rollCount = 20) {

    console.log("--- Last 20 Rolls ---");

    // Calculate the starting index: 
    // This starts from the array length minus 20, or 0 if there are less than 20 rolls.
    const startIndex = Math.max(0, rollHistoryArray.length - 20);

    // Use slice to get a new array containing only the last 20 (or fewer) elements
    const last20Rolls = rollHistoryArray.slice(startIndex);

    if (last20Rolls.length === 0) {
        console.log("No rolls recorded yet.");
        return;
    }

    // Iterate over the last rolls and log the details
    last20Rolls.forEach((roll, index) => {
        // Calculate the roll number based on the current history length
        const rollNumber = rollHistoryArray.length - last20Rolls.length + index + 1;

        // Format the timestamp for cleaner output
        const time = roll.timestamp.toLocaleTimeString();

console.log(
            `Roll #${rollNumber} (${time}): Die 1: ${roll.dieOne}, Die 2: ${roll.dieTwo}, Total: ${roll.dieTotal}`
        );        
    });

    console.log("-----------------------");
}