const walletAmountEl = document.getElementById('walletAmount');

$(document).ready(function() {

    const savedWallet = getCookie('casinoWallet');

    if (savedWallet && !isNaN(parseInt(savedWallet))) { // Ensure it's a valid number

        wallet = parseInt(savedWallet);

    } else {
        
        wallet = 10000;

        setCookie('casinoWallet', wallet, 365);
        
    }

    updateWalletDisplayAndCookie();

});

function updateWalletDisplayAndCookie() {

    walletAmountEl.textContent = wallet.toLocaleString('en-US');

    setCookie('casinoWallet', wallet, 365); // Save for 365 days

}