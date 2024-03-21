// Makes all elems that should start hidden fade in on page load

window.addEventListener('load', () => {
    setTimeout(() => {
        Array.from(document.getElementsByClassName('fadein')).forEach((elem) => {
            elem.classList.remove('fadein');
        });
    }, 100);
});