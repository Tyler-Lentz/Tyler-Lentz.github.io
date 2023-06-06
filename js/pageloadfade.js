// Makes all elems that should start hidden fade in on page load

window.addEventListener('load', () => {
    setTimeout(() => {
        Array.from(document.getElementsByClassName('hidden')).forEach((elem) => {
            elem.classList.remove('hidden');
        });
    }, 100);
});