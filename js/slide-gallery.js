class SlideGallery extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = this.#makeStyleHTML() + this.#makeSlotsHTML();
        this.#init();
    }

    #init() {
        this.current = 0;
        this.#setClasses();
        document.addEventListener('keydown', (e) => {
            if (e.key === "ArrowRight") {
                e.preventDefault();
                this.#scroll("right");
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                this.#scroll("left");
            }
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
    }

    #makeStyleHTML() {
        return `
            <style>
                .gallery {
                    overflow: hidden;
                    margin: auto;

                    display: grid;

                    border-left: var(--border);
                    border-right: var(--border);
                    border-radius: 1em;
                    padding: 0 0.5em;
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
                    transform: translateX(-110%);
                }
                ::slotted(.right) {
                    transform: translateX(110%);
                }
                ::slotted(.center) {
                    transform: translateX(0);
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
}

customElements.define("slide-gallery", SlideGallery);