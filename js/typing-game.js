class TypingGame extends HTMLElement {
    STARTING_WORDS = 100;
    COMMON_WORDS = ["the","be","to","of","and","a","in","that","have","I","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just","him","know","take","people","into","year","your","good","some","could","them","see","other","than","then","now","look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want","because","any","these","give","day","most","us","are","is","has","was","were","been","had","do","did","does","having","am","is","are","was","were","being","been","has","have","had","do","does","did","doing","an","a","the","and","or","but","if","as","until","while","of","at","by","for","with","about","against","between","into","through","during","before","after"];

    constructor() {
        super();

        this.sounds = [
            new Audio('../audio/type.wav'),
            new Audio('../audio/type.wav'),
        ]
        for (const sound of this.sounds) {
            sound.volume = 0.1;
        }
        this.currentSound = 0;
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            ${this.#makeStyleHTML()}
            <div id="game-container">
                ${this.#makeWordsHTML(this.STARTING_WORDS)}
            </div>
        `;

        this.gameContainer = this.shadowRoot.querySelector('#game-container');

    }

    start() {
        this.#init();
        this.#addEventListeners();
    }

    #init() {
        this.currentWord = 0; // index of the current word the user is on
        this.currentLetter = 0; // index of the current letter the user is on
        this.startTime = null; // set when first key is pressed

        this.#getCurrentLetterElem().toggleAttribute('current');
    }

    #playSound() {
        this.sounds[this.currentSound].currentTime = 0;
        this.sounds[this.currentSound].play();
        this.currentSound++;
        if (this.currentSound >= this.sounds.length) {
            this.currentSound = 0;
        }
    }

    #retractCurrentLetter() {
        this.#getCurrentLetterElem().toggleAttribute('current');

        this.currentLetter--;
        if (this.currentLetter < 0) {
            this.currentWord--;
            this.currentLetter = this.#getNumLettersInCurrentWord() - 1;
        }

        this.#getCurrentLetterElem().toggleAttribute('current');
    }

    #advanceCurrentLetter() {
        this.#getCurrentLetterElem().toggleAttribute('current');
        
        this.currentLetter++;
        if (this.currentLetter >= this.#getNumLettersInCurrentWord()) {
            this.currentLetter = 0;
            this.currentWord++;
            this.#checkForFinish();
        }

        this.#getCurrentLetterElem().toggleAttribute('current');
    }

    #checkForFinish() {
        if (this.currentWord >= this.gameContainer.children.length) {
            this.stopTime = Date.now();

            let time = (this.stopTime - this.startTime) / 1000;
            let charsCorrect = this.gameContainer.querySelectorAll('typing-letter[correct]').length;
            let charsIncorrect = this.gameContainer.querySelectorAll('typing-letter[incorrect]').length;
            let charsTotal = charsCorrect + charsIncorrect;
            let accuracy = charsCorrect / charsTotal * 100;
            let wpm = Math.round(charsCorrect / 5 / (time / 60));

            this.gameContainer.innerHTML = `
                <div id="results">
                    <h2>Results</h1>
                    <p>Time: ${time} seconds</p>
                    <p>Characters: ${charsCorrect} correct, ${charsIncorrect} incorrect, ${charsTotal} total</p>
                    <p>Accuracy: ${accuracy}%</p>
                    <p>WPM: ${wpm}</p>
                </div>
            `;
        }
    }


    #getNumLettersInCurrentWord() {
        return this.#getCurrentWord().length;
    }

    // the typing-word element representing the word the user is currently trying to type
    #getCurrentWordElem() {
        return this.gameContainer.querySelector(`typing-word:nth-child(${this.currentWord + 1})`);
    }

    // the word the user is currently trying to type
    #getCurrentWord() {
        return this.#getCurrentWordElem().getAttribute('word');
    }

    // the typing-letter element representing the letter the user is currently trying to type
    #getCurrentLetterElem() {
        let currentWord = this.#getCurrentWordElem();
        return currentWord.children[0].querySelector(`typing-letter:nth-child(${this.currentLetter + 1})`);
    }

    // the letter the user is currently trying to type
    #getCurrentLetter() {
        return this.#getCurrentLetterElem().getAttribute('letter');
    }

    #addEventListeners() {
        document.addEventListener('keydown', (event) => {

            if (event.key === 'Backspace') {
                this.#getCurrentLetterElem().removeAttribute('correct');
                this.#getCurrentLetterElem().removeAttribute('incorrect');

                this.#retractCurrentLetter();

                this.#getCurrentLetterElem().removeAttribute('correct');
                this.#getCurrentLetterElem().removeAttribute('incorrect');

                this.#playSound();
            } else if (event.key.length === 1) {
                if (this.startTime === null) {
                    this.startTime = Date.now();
                }

                if (event.key === this.#getCurrentLetter()) {
                    this.#getCurrentLetterElem().toggleAttribute('correct');
                    this.#advanceCurrentLetter();
                    this.#playSound();
                } else {
                    this.#getCurrentLetterElem().toggleAttribute('incorrect');
                    this.#advanceCurrentLetter();
                    this.#playSound();
                }
            }
        });
    }

    #makeWordsHTML(amount) {
        let words = ``;
        for (let i = 0; i < amount; i++) {
            const word = this.COMMON_WORDS[Math.floor(Math.random() * this.COMMON_WORDS.length)];
            words += `<typing-word word="${word}"></typing-word>`;
            if (i != amount - 1) {
                words += `<typing-word word=" "></typing-word>`;
            }
        }
        return words;
    }

    #makeStyleHTML() {
        return `
            <style>
                :host {
                    display: block;
                    padding: 0;

                    font-size: 1.5rem;
                }

                div#game-container {
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                }
            </style>
        `;
    }
}

class TypingWord extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `${this.#makeStyleHTML()}<slot name="word"></slot>`;
    }

    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'word':
                let letters = ``;
                for (const ch of newValue) {
                    letters += `<typing-letter letter="${ch}"></typing-letter>`;
                }
                this.innerHTML = `<span slot="word">${letters}</span>`;
                break;
        }
    }

    getNthLetterElem(n) {
        return this.shadowRoot.querySelector(`typing-letter:nth-child(${n})`);
    }

    static get observedAttributes() {
        return ['word'];
    }

    #makeStyleHTML() {
        return `
            <style>
                :host {
                    display: inline-block;
                    padding: 0;
                    margin: 0;
                }
            </style>
        `;
    }
}

class TypingLetter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `${this.#makeStyleHTML()}<slot name="letter"></slot>`;
    }

    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'letter':
                this.innerHTML = `<span slot="letter">${newValue}</span>`;
                break;
        }
    }

    static get observedAttributes() {
        return ['letter'];
    }

    #makeStyleHTML() {
        return `
            <style>
            :host {
                display: inline-block;
                padding: 0;
                margin: 0;

                color: var(--ctp-frappe-text);
            }

            ::slotted(span) {
                white-space: pre;
            }

            :host([correct]) {
                color: var(--ctp-frappe-green);
            }

            :host([incorrect]) {
                color: var(--ctp-frappe-red);
                text-decoration: line-through;
            }
            
            :host([current]) ::slotted(span)::before {
                display: inline-block;
                content: ' ';
                white-space: pre;
                width: 0;
                padding: 0;
                margin: 0;
                outline: 1px solid var(--ctp-frappe-rosewater);
                animation: cursorFlicker 1s infinite;
            }

            :host([letter=' '][incorrect])::after {
                content: ' ';
                border-bottom: 1px solid var(--ctp-frappe-red);
            }
            </style>
        `;
    }
}

customElements.define('typing-game', TypingGame);
customElements.define('typing-word', TypingWord);
customElements.define('typing-letter', TypingLetter);