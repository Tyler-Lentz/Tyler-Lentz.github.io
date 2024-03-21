class PostSummary extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = this.#makeStyleHTML() + this.#makeHTML();
    }

    static get observedAttributes() {
        return ["date", "description", "imgsrc"];
    }

    attributeChangedCallback(name, _oldValue, newValue) {
        if (this.shadowRoot == null) {
            return; 
        }

        if (name == "imgsrc") {
            this.shadowRoot.getElementById("img").src = newValue;
        } else {
            this.shadowRoot.getElementById(name).innerText = newValue;
        }
    }

    #makeHTML() {
        return /*html*/`
            <div id="container">
                <img id="img" width=300 src="${this.getAttribute("imgsrc")}">
                <slot name="title"> 
                </slot> 
                <p id="date"> ${this.getAttribute("date")} </p>
                <p id="description"> ${this.getAttribute("description")} </p>
            </div>
        `;
    }

    #makeStyleHTML() {
        return /*css*/`
            <style>
                p {
                    margin: 0;
                    padding: 0;
                }

                #container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-size: 16pt;
                }

                #date {
                    font-size: 0.75em;
                    margin-bottom: 1em;
                }

                img {
                    border-radius: 20px;
                }

            </style>
        `;
    }
}

customElements.define('post-summary', PostSummary);