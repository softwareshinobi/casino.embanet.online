class HardwaysWatcher {

    constructor() {

        console.log("HardwaysWatcher initialized");

        events.subscribe('dieRolled', this.checkHardways.bind(this));

        console.log("HardwaysWatcher initialized");

    }

    checkHardways({ d1, d2 }) {

        if (d1 === d2 && [2, 3, 4, 5].includes(d1)) {

            const total = d1 + d2;

            alert(`🔥 Hardways! Rolled doubles ${d1} + ${d2} = ${total}`);

            console.log(`Hardways detected: ${d1} + ${d2} = ${total}`);

        }

    }

}

new HardwaysWatcher();
