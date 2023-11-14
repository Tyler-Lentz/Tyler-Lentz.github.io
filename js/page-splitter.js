class PageSplitter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.currentSlot = 0;
        this.scrolling = false;

        this.shadowRoot.innerHTML = this.#makeStyleHTML() + this.#makeSlotsHTML();

        this.gallery = this.shadowRoot.querySelector('.container');

        for (const elem of this.gallery.children) {
            let current = elem.assignedElements()[0];
            current.style = "min-height: 100vh;";
        }

        document.addEventListener('keydown', (e) => {
            if (e.key == "ArrowDown") {
                e.preventDefault();
                this.#scroll("down");
            } else if (e.key == "ArrowUp") {
                e.preventDefault();
                this.#scroll("up");
            }
        });

        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (!this.scrolling) {
                if (e.deltaY > 0) {
                    this.#scroll("down");
                } else if (e.deltaY < 0) {
                    this.#scroll("up");
                }
            }
        }, {passive: false});

        this.prevScroll = null;

        this.scrollTimeout = null; // used to detect when scrolling is finished
        document.addEventListener("scroll", (e) => {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.scrolling = false;
            }, 100);

            if (!this.scrolling) {
                e.preventDefault();
            }

            this.prevScroll = window.scrollY;
        });
    }

    disconnectedCallback() {
    }

    #scroll(direction) {
        this.scrolling = true;

        if (direction === "up") {
            if (this.currentSlot === -1) {
                // edge case: already at top of screen so we don't want to trigger a scroll event
                // because this.scrolling won't get reset correctly.
                this.scrolling = false;
                return;
            }

            this.currentSlot--;
            if (this.currentSlot < 0) {
                this.currentSlot = -1;
                // edge case: scroll to absolute top of screen
                window.scroll({behavior: "smooth", top: 0});
                return;
            }
        } else if (direction === "down") {
            this.currentSlot++;
            if (this.currentSlot >= this.children.length) {
                this.currentSlot--;
                this.scrolling = false;
                return;
            }
        }
        let elem = this.gallery.children[this.currentSlot].assignedElements()[0];
        elem.scrollIntoView({behavior: "smooth"});
    }

    #makeStyleHTML() {
        return `
            <style>
                div.container {
                    display: flex;
                    padding: 1em;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: fit-content;
                    margin: auto;
                }
            </style>
        `
    }

    #makeSlotsHTML() {
        let html = '<div class="container">';
        for (let i = 0; i < this.children.length; i++) {
            html += `<slot name="${i+1}" ></slot>`;
        }
        html += `</div>`;
        return html;
    }
}

customElements.define('page-splitter', PageSplitter);
