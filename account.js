const accountIcon = document.getElementById('account-face');
const accountInfoBar = document.getElementById('account-info-bar');
const closeButton = document.querySelector('#account-info-bar .close-button');

accountIcon.addEventListener('click', () => {
    accountInfoBar.classList.add('show');
    document.body.style.overflow = 'hidden'; //prevent scroll
});

closeButton.addEventListener('click', () => {
    accountInfoBar.classList.remove('show');
    document.body.style.overflow = ''; //re-enable scroll
});

// Optional: Close the bar if the user clicks outside of it
document.addEventListener('click', (event) => {
    if (!accountInfoBar.contains(event.target) && event.target !== accountIcon) {
        accountInfoBar.classList.remove('show');
        document.body.style.overflow = '';
    }
});