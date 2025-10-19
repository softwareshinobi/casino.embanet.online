class HardwaysWatcher {

    constructor() {

        console.log("HardwaysWatcher initialized");

        events.subscribe('dieRolled', this.checkHardways.bind(this));

        console.log("HardwaysWatcher initialized");

    }

    checkHardways({ dieOne, dieTwo, dieTotal }) {

        console.log(`[HardwaysWatcher] Event Received: dieOne=${dieOne}, dieTwo=${dieTwo}, Total=${dieTotal}`);

        if (dieOne === dieTwo && [2, 3, 4, 5].includes(dieOne)) {

            // alert(`🔥 Hardways! Rolled doubles ${dieOne} + ${dieTwo} = ${dieTotal}`);

            console.log(`Hardways detected: ${dieOne} + ${dieTwo} = ${dieTotal}`);

        }

    }

}

new HardwaysWatcher();
