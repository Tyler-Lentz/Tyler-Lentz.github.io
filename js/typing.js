const commonWords = ["the","be","to","of","and","a","in","that","have","I","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just","him","know","take","people","into","year","your","good","some","could","them","see","other","than","then","now","look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want","because","any","these","give","day","most","us","are","is","has","was","were","been","had","do","did","does","having","am","is","are","was","were","being","been","has","have","had","do","does","did","doing","an","a","the","and","or","but","if","as","until","while","of","at","by","for","with","about","against","between","into","through","during","before","after"];

let currentSound = 0;

class Game {
    constructor() {
        this.wordToTypeElem = document.getElementById('word-to-type');
        this.typedWordElem = document.getElementById('typed-word');
        this.prevWordsElem = document.getElementById('prev-words');
        this.started = false;
        this.numWordsToDisplay = 15;

        this.sounds = [
            new Audio('audio/type.wav'),
            new Audio('audio/type.wav'),
            new Audio('audio/type.wav'),
        ]
        this.currentSound = 0;

        document.addEventListener('keydown', (e) => {
            if (this.started) {
                if (e.key.length === 1) {
                    e.preventDefault();
                    this.typedWordElem.innerText += e.key;
                    this.playSound();
                } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    this.typedWordElem.innerText = this.typedWordElem.innerText.slice(0, -1);
                    this.playSound();
                }

                if (this.typedWordElem.innerText === this.wordToTypeElem.innerText.split(' ')[0]) {
                    this.setNewWord();
                }
            }
        });
    }

    start() {
        this.words = [];
        this.prevWords = [];
        this.currentWord = 0;
        for (let i = 0; i < this.numWordsToDisplay; i++) {
            this.words.push(this.#getRandomWord());
        }

        this.started = true;
        this.setNewWord();
    }

    setNewWord() {
        this.prevWords.push(this.words.shift());
        if (this.prevWords.length > this.numWordsToDisplay) {
            this.prevWords.splice(0, 1);
        }
        this.words.push(this.#getRandomWord());

        this.prevWordsElem.innerText = this.prevWords.join(' ');
        this.wordToTypeElem.innerText = this.words.join(' ');

        this.typedWordElem.innerText = '';
        this.typedWordElem.focus();
    }

    #getRandomWord() {
        return commonWords[Math.floor(Math.random() * commonWords.length)];
    }

    playSound() {
        this.sounds[this.currentSound].currentTime = 0;
        this.sounds[this.currentSound].play();
        this.currentSound = (this.currentSound + 1) % this.sounds.length;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("loaded");
    let game = new Game();
    game.start();
});
