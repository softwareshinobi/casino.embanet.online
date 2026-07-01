class BonusWatcher {

    constructor() {

        console.log("BonusWatcher initialized");

        events.subscribe('dieRolled', this.checkHardways2.bind(this));

        console.log("BonusWatcher initialized");

    }

    checkHardways2({ dieOne, dieTwo, dieTotal }) {

        console.log(`[BonusWatcher] Event Received: dieOne=${dieOne}, dieTwo=${dieTwo}, Total=${dieTotal}`);

        //updateBonusDisplay2();

    }

}

new BonusWatcher();
