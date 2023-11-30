// Recorded myself typing the site name "tyler-lentz.github.io" a bunch of time and recorded the milisecond delays
// between my key presses. 
const WAIT_TIMES = [
    [212, 300, 120, 35, 41, 199, 68, 93, 43, 36, 217, 204, 43, 184, 204, 36, 108, 108, 248, 32],
    [56, 152, 120, 32, 64, 180, 60, 112, 72, 32, 76, 164, 80, 68, 288, 20, 96, 68, 140, 32, 992, 12, 152],
    [56, 87, 141, 44, 48, 180, 72, 75, 49, 36, 68, 104, 75, 77, 112, 20, 96, 64, 136, 32],
    [36, 91, 104, 25, 56, 167, 64, 76, 67, 30, 80, 79, 71, 79, 141, 48, 76, 79, 132, 41],
    [44, 95, 109, 27, 76, 185, 64, 71, 65, 19, 64, 89, 88, 64, 79, 40, 108, 64, 145, 23],
    [47, 108, 108, 24, 81, 211, 80, 76, 44, 29, 103, 104, 80, 65, 83, 32, 56, 101, 127, 24],
    [44, 144, 56, 36, 116, 172, 68, 96, 80, 24, 72, 196, 60, 79, 153, 40, 92, 72, 124, 36],
    [200, 144, 132, 36, 128, 204, 120, 124, 116, 56, 104, 159, 113, 99, 88, 28, 116, 168, 204, 32],
    [172, 131, 196, 44, 209, 207, 116, 104, 117, 47, 80, 136, 152, 112, 116, 88, 136, 116, 168, 32],
];

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const WAIT_IDX = randomInteger(0, WAIT_TIMES.length - 1);

function setupTypewriter() {
    // Typewriter effect for h1
    let h1 = document.getElementById("type-h1");
    h1.style.display = "block";
    function typeLetter(i, text, elem) {
        if (i < text.length) {
            elem.innerHTML += text.charAt(i);
            setTimeout(() => {
                typeLetter(i + 1, text, elem);
            }, WAIT_TIMES[WAIT_IDX][i]);
        } else {
            h1.dataset['flicker'] = "true";
        }
    }
    typeLetter(0, "tyler-lentz.github.io", h1);
}


document.addEventListener("DOMContentLoaded", () => {
    setupTypewriter();

    let aboutNav = document.getElementById('about-nav');

});