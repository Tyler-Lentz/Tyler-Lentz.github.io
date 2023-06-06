class AccordionContainer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = this.#makeStyleHTML() + this.#makeHTML();

        this.shadowRoot.querySelector('button').addEventListener('click', (e) => {
            let arrow = this.shadowRoot.querySelector('.arrow');

            let slot = this.shadowRoot.querySelector('slot');
            let elem  = slot.assignedElements()[0];

            if (elem.style.maxHeight === '') {
                elem.style.maxHeight = '50em'; // hard coded max height, probably should figure out a better way to determine this
                arrow.classList.remove('arrow-down');
                arrow.classList.add('arrow-up');
            } else {
                elem.style.maxHeight = '';
                arrow.classList.add('arrow-down');
                arrow.classList.remove('arrow-up');
            }
        });

    }

    #makeHTML() {
        return `
            <slot name="hidden"></slot>
            <button ><span class="arrow arrow-down"></span></button>
        `;
    }

    #makeStyleHTML() {
        return `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                ::slotted(*) {
                    transition: max-height 0.8s ease-in-out;
                    max-height: 0px;
                    overflow: hidden;
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

                button:is(:hover,.active) .arrow {
                    border-color: var(--ctp-frappe-mantle);
                }

                /* modified from https://www.w3schools.com/howto/howto_css_arrows.asp */
                .arrow {
                    border: solid var(--ctp-frappe-overlay0);
                    border-width: 0 .2em .2em 0;
                    display: inline-block;
                    padding: .2em;
                    transition: transform 0.3s ease-in-out;
                }

                .arrow-up {
                    transform: rotate(-135deg);
                }

                .arrow-down {
                    transform: rotate(45deg);
                }
            </style>
        `;
    }
}

customElements.define('accordion-container', AccordionContainer);