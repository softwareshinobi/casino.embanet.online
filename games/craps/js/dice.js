// A global array to store the results of all rolls
const rollHistory = [];

function throwDice() {

    console.log("throwDice called");

    let rollCount = 0;

    const rollInterval = setInterval(() => {

        die1El.textContent = Math.floor(Math.random() * 6) + 1;

        die2El.textContent = Math.floor(Math.random() * 6) + 1;

        rollCount++;

        if (rollCount > 10) {

            clearInterval(rollInterval);

            const d1 = Math.floor(Math.random() * 6) + 1;

            const d2 = Math.floor(Math.random() * 6) + 1;

            die1El.textContent = d1;

            die2El.textContent = d2;

                        // --- ADDED: Record the roll result ---
            // Push an object containing the individual dice values and the total
            rollHistory.push({ die1: d1, die2: d2, total: d1 + d2, timestamp: new Date() });
            // ------------------------------------

            handleRollResult(d1 + d2);

        }

    }, 100);

    console.log("throwDice finished");

}

/**
 * Displays the last 20 dice rolls in the console.
 */
function viewLast20Rolls() {
    console.log("--- Last 20 Rolls ---");

    // Calculate the starting index: 
    // This starts from the array length minus 20, or 0 if there are less than 20 rolls.
    const startIndex = Math.max(0, rollHistory.length - 20);

    // Use slice to get a new array containing only the last 20 (or fewer) elements
    const last20Rolls = rollHistory.slice(startIndex);

    if (last20Rolls.length === 0) {
        console.log("No rolls recorded yet.");
        return;
    }

    // Iterate over the last rolls and log the details
    last20Rolls.forEach((roll, index) => {
        // Calculate the roll number based on the current history length
        const rollNumber = rollHistory.length - last20Rolls.length + index + 1;

        // Format the timestamp for cleaner output
        const time = roll.timestamp.toLocaleTimeString();

        console.log(
            `Roll #${rollNumber} (${time}): Die 1: ${roll.die1}, Die 2: ${roll.die2}, Total: ${roll.total}`
        );
    });

    console.log("-----------------------");
}