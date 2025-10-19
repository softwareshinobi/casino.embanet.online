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

            handleRollResult(d1 + d2);

        }

    }, 100);

    console.log("throwDice finished");

}