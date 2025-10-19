let wallet;

savedWallet = getCookie('casinoWallet');

if (savedWallet && !isNaN(parseInt(savedWallet))) {

    wallet = parseInt(savedWallet);

} else {

    wallet = 10000;

    setCookie('casinoWallet', wallet, 365);

    alert("Welcome! A new starting balance of $10,000 has been set for the casino.");
}

window.onload = () => {

console.log("hello...")    ;

   savedWallet = getCookie('casinoWallet');

   console.log("savedWallet / ",savedWallet);



    createBettingMat();

    walletAmountEl.textContent = wallet;

    updateActiveBetButton(currentBetAmount);

    betButtons.forEach(button => {

        button.addEventListener('click', () => {

            const betValue = button.dataset.bet;

            currentBetAmount = (betValue === 'max') ? wallet : parseInt(betValue);

            if (currentBetAmount > wallet) currentBetAmount = wallet;

            updateActiveBetButton(currentBetAmount);
        });

    });

    btnSpin.addEventListener('click', handleSpin);

    btnClear.addEventListener('click', clearBets);

};

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

        const bettingMatContainer = document.getElementById('bettingMat');
        const walletAmountEl = document.getElementById('walletAmount');
        const totalBetAmountEl = document.getElementById('totalBetAmount');
        const betButtons = document.querySelectorAll('.bet-button');
        const btnSpin = document.getElementById('btnSpin');
        const btnClear = document.getElementById('btnClear');
        const winningNumberDisplay = document.getElementById('winningNumberDisplay');
        const statusMessageEl = document.getElementById('statusMessage');

        // --- Cookie Functions (Copied from Craps game) ---
        /**
         * Sets a browser cookie.
         * @param {string} name - The name of the cookie.
         * @param {string} value - The value to store.
         * @param {number} days - The number of days until the cookie expires.
         */
        function setCookie(name, value, days) {
            let expires = "";
            if (days) {
                let date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        /**
         * Gets the value of a browser cookie.
         * @param {string} name - The name of the cookie.
         * @returns {string|null} The cookie's value, or null if not found.
         */
        function getCookie(name) {
            let nameEQ = name + "=";
            let ca = document.cookie.split(';');
            for(let i=0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }




        let currentBetAmount = 100;
        let bets = {};
        let isSpinning = false;

        const wheelNumbers = [
            '0', '28', '9', '26', '30', '11', '7', '20', '32', '17', '5', '22', '34', '15', '3', '24', '36', '13', '1',
            '00', '27', '10', '25', '29', '12', '8', '19', '31', '18', '6', '21', '33', '16', '4', '23', '35', '14', '2'
        ];

        const numberProperties = {
            '0': { color: 'green' }, '00': { color: 'green' },
            '1': { color: 'red', col: 1, dozen: 1 }, '2': { color: 'black', col: 2, dozen: 1 }, '3': { color: 'red', col: 3, dozen: 1 }, '4': { color: 'black', col: 1, dozen: 1 }, '5': { color: 'red', col: 2, dozen: 1 }, '6': { color: 'black', col: 3, dozen: 1 }, '7': { color: 'red', col: 1, dozen: 1 }, '8': { color: 'black', col: 2, dozen: 1 }, '9': { color: 'red', col: 3, dozen: 1 }, '10': { color: 'black', col: 1, dozen: 1 }, '11': { color: 'black', col: 2, dozen: 1 }, '12': { color: 'red', col: 3, dozen: 1 }, '13': { color: 'black', col: 1, dozen: 2 }, '14': { color: 'red', col: 2, dozen: 2 }, '15': { color: 'black', col: 3, dozen: 2 }, '16': { color: 'red', col: 1, dozen: 2 }, '17': { color: 'black', col: 2, dozen: 2 }, '18': { color: 'red', col: 3, dozen: 2 }, '19': { color: 'red', col: 1, dozen: 2 }, '20': { color: 'black', col: 2, dozen: 2 }, '21': { color: 'red', col: 3, dozen: 2 }, '22': { color: 'black', col: 1, dozen: 3 }, '23': { color: 'red', col: 2, dozen: 3 }, '24': { color: 'black', col: 3, dozen: 3 }, '25': { color: 'red', col: 1, dozen: 3 }, '26': { color: 'black', col: 2, dozen: 3 }, '27': { color: 'red', col: 3, dozen: 3 }, '28': { color: 'black', col: 1, dozen: 3 }, '29': { color: 'black', col: 2, dozen: 3 }, '30': { color: 'red', col: 3, dozen: 3 }, '31': { color: 'black', col: 1, dozen: 3 }, '32': { color: 'red', col: 2, dozen: 3 }, '33': { color: 'black', col: 3, dozen: 3 }, '34': { color: 'red', col: 1, dozen: 3 }, '35': { color: 'black', col: 2, dozen: 3 }, '36': { color: 'red', col: 3, dozen: 3 }
        };

        function createBettingMat() {
            bettingMatContainer.innerHTML = '';
            const mainGrid = document.createElement('div');
            mainGrid.className = 'main-betting-grid';
            const zerosArea = document.createElement('div');
            zerosArea.className = 'zeros-area';
            const numbersAndColsContainer = document.createElement('div');
            numbersAndColsContainer.className = 'numbers-and-cols-container';
            const numbersArea = document.createElement('div');
            numbersArea.className = 'numbers-area';
            const colsArea = document.createElement('div');
            colsArea.className = 'cols-area';
            const outsideBetsContainer = document.createElement('div');
            outsideBetsContainer.className = 'outside-bets-container';

            zerosArea.appendChild(createBetArea('0', 'zero'));
            zerosArea.appendChild(createBetArea('00', 'zero'));

            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 12; col++) {
                    const num = 3 * col + (3 - row);
                    const numKey = num.toString();
                    const prop = numberProperties[numKey];
                    const el = createBetArea(numKey, `number ${prop.color}`);
                    numbersArea.appendChild(el);
                }
            }

            for (let i = 1; i <= 3; i++) {
                const el = createBetArea('2-1', 'col-bet');
                el.dataset.betType = `col${i}`;
                colsArea.appendChild(el);
            }

            const outsideBetsConfig = [
                { text: '1st 12', type: 'dozen1' }, { text: '2nd 12', type: 'dozen2' }, { text: '3rd 12', type: 'dozen3' },
                { text: '1-18', type: 'low' }, { text: 'EVEN', type: 'even' }, { text: 'RED', type: 'red', cls: 'red' },
                { text: 'BLACK', type: 'black', cls: 'black' }, { text: 'ODD', type: 'odd' }, { text: '19-36', type: 'high' }
            ];

            outsideBetsConfig.forEach(cfg => {
                const el = createBetArea(cfg.text, `outside-bet ${cfg.cls || ''}`);
                el.dataset.betType = cfg.type;
                outsideBetsContainer.appendChild(el);
            });

            numbersAndColsContainer.appendChild(numbersArea);
            numbersAndColsContainer.appendChild(colsArea);
            mainGrid.appendChild(zerosArea);
            mainGrid.appendChild(numbersAndColsContainer);
            bettingMatContainer.appendChild(mainGrid);
            bettingMatContainer.appendChild(outsideBetsContainer);
        }

        function createBetArea(text, className) {
            const el = document.createElement('div');
            el.className = `bet-area ${className}`;
            el.textContent = text;
            el.dataset.betType = text;
            el.addEventListener('click', () => placeBet(el.dataset.betType));
            return el;
        }

        function placeBet(betType) {
            if (isSpinning || currentBetAmount <= 0 || wallet < currentBetAmount) return;
            wallet -= currentBetAmount;
            bets[betType] = (bets[betType] || 0) + currentBetAmount;
            updateUI();
            setCookie('casinoWallet', wallet, 365); // Save wallet to cookie
        }

        function updateUI() {
            walletAmountEl.textContent = wallet;
            let totalBet = Object.values(bets).reduce((a, b) => a + b, 0);
            totalBetAmountEl.textContent = totalBet;

            document.querySelectorAll('.chip').forEach(c => c.remove());
            for(const betType in bets) {
                const area = bettingMatContainer.querySelector(`[data-bet-type="${betType}"]`);
                if (area) {
                    let chip = area.querySelector('.chip');
                    if (!chip) {
                        chip = document.createElement('span');
                        chip.className = 'chip';
                        area.appendChild(chip);
                    }
                    chip.textContent = bets[betType];
                }
            }
        }

        function updateActiveBetButton(selectedBet) {
             betButtons.forEach(btn => {
                btn.classList.remove('active');
                if(btn.dataset.bet === 'max' && selectedBet === wallet) {
                    btn.classList.add('active');
                } else if (parseInt(btn.dataset.bet) === selectedBet) {
                    btn.classList.add('active');
                }
            });
        }

        function showStatusMessage(message, duration = 1000) {
            statusMessageEl.innerHTML = message;
            statusMessageEl.style.display = 'block';
            setTimeout(() => {
                statusMessageEl.style.display = 'none';
            }, duration);
        }

        function clearBets() {
            if (isSpinning) return;
            let returnedAmount = Object.values(bets).reduce((a, b) => a + b, 0);
            wallet += returnedAmount;
            bets = {};
            updateUI();
            setCookie('casinoWallet', wallet, 365); // Save wallet to cookie
        }

        function handleSpin() {
            let totalBet = Object.values(bets).reduce((a, b) => a + b, 0);
            if (totalBet === 0) { showStatusMessage("Place a bet!"); return; }
            if (isSpinning) return;

            isSpinning = true;
            btnSpin.disabled = true;
            btnClear.disabled = true;

            let spinCount = 0;
            const spinInterval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * wheelNumbers.length);
                const randomNum = wheelNumbers[randomIndex];
                const prop = numberProperties[randomNum];
                winningNumberDisplay.textContent = randomNum;
                winningNumberDisplay.style.backgroundColor = prop.color === 'red' ? '#B71C1C' : prop.color === 'black' ? '#212121' : '#006847';
                spinCount++;
                if (spinCount > 20) {
                    clearInterval(spinInterval);
                    const winningIndex = Math.floor(Math.random() * wheelNumbers.length);
                    const winningNumber = wheelNumbers[winningIndex];
                    const finalProp = numberProperties[winningNumber];
                    winningNumberDisplay.textContent = winningNumber;
                    winningNumberDisplay.style.backgroundColor = finalProp.color === 'red' ? '#B71C1C' : finalProp.color === 'black' ? '#212121' : '#006847';

                    calculateWinnings(winningNumber);
                    isSpinning = false;
                    btnSpin.disabled = false;
                    btnClear.disabled = false;
                }
            }, 100);
        }

        function calculateWinnings(winningNumber) {
            let totalWinnings = 0;
            const prop = numberProperties[winningNumber];

            for(const betType in bets) {
                const betAmount = bets[betType];
                let win = false;
                let payoutRatio = 0;

                if (betType === winningNumber) { win = true; payoutRatio = 35; }
                else if (betType === 'red' && prop.color === 'red') { win = true; payoutRatio = 1; }
                else if (betType === 'black' && prop.color === 'black') { win = true; payoutRatio = 1; }
                else if (betType === 'even' && parseInt(winningNumber) % 2 === 0 && winningNumber !== '0' && winningNumber !== '00') { win = true; payoutRatio = 1; }
                else if (betType === 'odd' && parseInt(winningNumber) % 2 !== 0 && winningNumber !== '0' && winningNumber !== '00') { win = true; payoutRatio = 1; }
                else if (betType === 'low' && parseInt(winningNumber) >= 1 && parseInt(winningNumber) <= 18) { win = true; payoutRatio = 1; }
                else if (betType === 'high' && parseInt(winningNumber) >= 19 && parseInt(winningNumber) <= 36) { win = true; payoutRatio = 1; }
                else if (betType === 'dozen1' && prop.dozen === 1) { win = true; payoutRatio = 2; }
                else if (betType === 'dozen2' && prop.dozen === 2) { win = true; payoutRatio = 2; }
                else if (betType === 'dozen3' && prop.dozen === 3) { win = true; payoutRatio = 2; }
                else if (betType === 'col1' && prop.col === 1) { win = true; payoutRatio = 2; }
                else if (betType === 'col2' && prop.col === 2) { win = true; payoutRatio = 2; }
                else if (betType === 'col3' && prop.col === 3) { win = true; payoutRatio = 2; }

                if(win) {
                    const winnings = betAmount + (betAmount * payoutRatio);
                    totalWinnings += winnings;
                }
            }

            if (totalWinnings > 0) {
                wallet += totalWinnings;
                showStatusMessage(`WIN! +$${totalWinnings}`);
            } else {
                showStatusMessage('No win this round.');
            }
            bets = {};
            updateUI();
            setCookie('casinoWallet', wallet, 365); // Save wallet to cookie
            if(wallet <= 0) showStatusMessage("Game Over!", 5000)
        }


