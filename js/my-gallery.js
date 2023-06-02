class MyGallery extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.currentSlot = 0;

        this.shadowRoot.innerHTML = this.#makeStyleHTML() + this.#makeSlotsHTML();

        this.gallery = this.shadowRoot.querySelector('.gallery');

        this.gallery.addEventListener('click', (event) => {
            this.gallery.children[this.currentSlot].setAttribute('data-active', 'false');
            this.currentSlot++;
            if (this.currentSlot >= this.children.length) {
                this.currentSlot = 0;
            }
            this.gallery.children[this.currentSlot].setAttribute('data-active', 'true');
        })
    }

    disconnectedCallback() {
    }

    #makeStyleHTML() {
        return `
            <style>
                div.gallery {
                    display: flex;
                    padding: 1em;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid var(--ctp-frappe-overlay2);
                    border-radius: 0.5em;
                    width: fit-content;
                    margin: auto;
                }

                div.gallery > *[data-active="true"] {
                    display: block;
                }

                div.gallery > *[data-active="false"] {
                    display: none;
                }

            </style>
        `
    }

    #makeSlotsHTML() {
        let html = '<div class="gallery">';
        for (let i = 0; i < this.children.length; i++) {
            html += `<slot name="${i+1}" data-active="${this.currentSlot === i}"></slot>`;
        }
        html += `</div>`;
        return html;
    }
}

customElements.define('my-gallery', MyGallery);
