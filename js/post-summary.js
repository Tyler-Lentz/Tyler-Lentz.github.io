class PostSummary extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = this.#makeStyleHTML() + this.#makeHTML();

        const title = this.getAttribute("title");
        const date = this.getAttribute("date");
        const description = this.getAttribute("description");
        const img = this.getAttribute('imgsrc');
    }


    #makeHTML() {
        
    }

    #makeStyleHTML() {
        return `
            <style>
            </style>
        `;
    }
}

customElements.define('project-summary', ProjectSummary);