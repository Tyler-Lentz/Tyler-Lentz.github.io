class SlideGallery extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = this.#makeStyleHTML() + this.#makeSlotsHTML() + this.#makeButtonsHTML();
        this.#init();
    }

    #init() {
        this.current = 0;
        this.leftButton = this.shadowRoot.getElementById("left-button");
        this.rightButton = this.shadowRoot.getElementById("right-button");

        this.#setClasses();

        // helper function from https://stackoverflow.com/questions/5353934/check-if-element-is-visible-on-screen
        function checkVisible(elm) {
            let rect = elm.getBoundingClientRect();
            let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
        }

        // Set up keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (checkVisible(this)) {
                if (e.key === "ArrowRight") {
                    e.preventDefault();
                    this.#scroll("right");
                    this.rightButton.classList.add("active");
                } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    this.#scroll("left");
                    this.leftButton.classList.add("active");
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === "ArrowRight") {
                this.rightButton.classList.remove("active");
            } else if (e.key === "ArrowLeft") {
                this.leftButton.classList.remove("active");
            }
        });

        // Set up button navigation
        this.leftButton.addEventListener("click", () => {
            this.#scroll("left");
        });
        this.rightButton.addEventListener("click", () => {
            this.#scroll("right");
        });
    }

    #scroll(direction) {
        if (direction === "left") {
            this.current--;
            if (this.current < 0) {
                this.current = 0;
            }
        } else if (direction === "right") {
            this.current++;
            if (this.current >= this.children.length) {
                this.current--;
            }
        }
        this.#setClasses();
    }

    #setClasses() {
        for (let i = 0; i < this.children.length; i++) {
            let elem = this.shadowRoot.querySelector(`slot[name="${i+1}"]`).assignedElements()[0];
            if (i < this.current) {
                elem.classList = "slide left";
            } else if (i > this.current) {
                elem.classList = "slide right";
            } else {
                elem.classList = "slide center";
            }
        }

        if (this.current === 0) {
            this.leftButton.setAttribute("disabled", "true");
        } else if (this.current === this.children.length - 1) {
            this.rightButton.setAttribute("disabled", "true");
        }
        else {
            this.leftButton.removeAttribute("disabled");
            this.rightButton.removeAttribute("disabled");
        }
    }

    #makeStyleHTML() {
        return `
            <style>
                .gallery {
                    overflow: hidden;
                    margin: auto;

                    display: grid;

                    padding: 0 3em;
                }

                ::slotted(.slide) {
                    transition: transform 0.75s ease-in-out;
                    overflow: hidden;
                    min-width: fit-content;

                    align-self: center;
                    
                    grid-row: 1;
                    grid-column: 1;
                }
                ::slotted(.left) {
                    transform: translateX(-125%);
                }
                ::slotted(.right) {
                    transform: translateX(125%);
                }
                ::slotted(.center) {
                    transform: translateX(0);
                }

                .button-container {
                    display: flex;
                    margin: 0.5em auto;
                    align-items: center;
                    justify-content: center;

                }

                button {
                    border: none;
                    background: none;
                    font-size: 2em;
                    cursor: pointer;

                    color: var(--ctp-frappe-overlay0);
                    
                    transition: opacity 0.5s ease-in-out;
                    opacity: 1;
                }

                button:first-child {
                    margin-right: 1em;
                }

                button:last-child {
                    margin-left: 1em;
                }

                button:is(:hover,.active) {
                    color: var(--ctp-frappe-mantle);

                    background-color: var(--button-hover-bkg);
                    border-radius: var(--button-border-radius);
                }

                button:is(:hover,.active) .arrow {
                    border-color: var(--ctp-frappe-mantle);
                }

                button[disabled] {
                    opacity: 0;
                    cursor: default;
                }

                button[disabled] .arrow {
                    opacity: 0;
                    cursor: default;
                }

                /* Cool looking arrow for buttons from https://www.w3schools.com/howto/howto_css_arrows.asp */
                .arrow {
                    border: solid var(--ctp-frappe-overlay0);
                    border-width: 0 .2em .2em 0;
                    display: inline-block;
                    padding: .2em;
                    height: min-content;

                    transition: opacity 0.5s ease-in-out;
                    opacity: 1;
                }

                .arrow-right {
                    transform: rotate(-45deg);
                }

                .arrow-left {
                    transform: rotate(135deg);
                }
            </style>
        `;
    }

    #makeSlotsHTML() {
        let html = '<div class="gallery">';
        for (let i = 0; i < this.children.length; i++) {
            html += `<slot name="${i+1}" ></slot>`;
        }
        html += `</div>`;
        console.log(html)
        return html;
    }

    // controls for the gallery at the bottom
    #makeButtonsHTML() {
        return `
            <div class="button-container">
                <button id="left-button"> <span class="arrow arrow-left"></span>— </button>
                <button id="right-button"> —<span class="arrow arrow-right"></> </button>
            </div>
        `;
    }
}

customElements.define("slide-gallery", SlideGallery);