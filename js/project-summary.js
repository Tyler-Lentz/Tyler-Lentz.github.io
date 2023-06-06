class ProjectSummary extends HTMLElement {
    constructor() {
        super();
        this.size = 48;
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = this.#makeStyleHTML() + this.#makeHTML();
    }


    // Returns a src for img tag based on language
    // Icons sourced from https://devicon.dev/
    #getIconFromLanguage(language) {
        return `<img width="${this.size}" height="${this.size}" src="./images/projects/icons/${language}.svg" alt="${language}">`;
    }

    #makeHTML() {

        // Language icons
        let languages = this.getAttribute("language");
        if (languages === null) {
            languages = "";
        }
        languages = languages.split(" ").map((language) => this.#getIconFromLanguage(language)).join("");
        languages = `${languages}`;
        // Link to project
        let github = this.getAttribute("github");
        if (github === null) {
            github = "";
        } else {
            github = `<a href="${github}"><img width="${this.size}" height="${this.size}" src="./images/index/github.svg" alt="github"></a>`;
        }

        return `
            ${github}
            ${languages}
        `;
    }

    #makeStyleHTML() {
        return `
            <style>
                :host {
                    padding: 0.5em;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    width: fit-content;
                    margin: auto;
                }

                :host > a {
                    padding-right: 1.0em;
                    margin-right: 1.0em;
                }

                :host > img {
                    margin-right: 0.5em;
                }

                :host > img:last-child {
                    margin-right: 0;
                }

                :host > a > img:hover {
                    opacity: 0.5;
                    filter: invert(85%) sepia(3%) saturate(1933%) hue-rotate(323deg) brightness(107%) contrast(90%);
                    /* based off var(--ctp-frappe-rosewater) */
                }
            </style>
        `;
    }
}

customElements.define('project-summary', ProjectSummary);