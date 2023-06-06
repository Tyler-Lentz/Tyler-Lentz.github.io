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
        return `
            <img width="${this.size}" height="${this.size}" src="./images/projects/icons/${language}.svg" alt="${language}">
            <div>
                <span class="tooltip">${language}</span>
            </div>
        `;
    }

    #makeHTML() {

        // Language icons
        let languages = this.getAttribute("languages");
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
            github = `
                <a href="${github}">
                    <img width="${this.size}" height="${this.size}" src="./images/index/github.svg" alt="github">
                </a>
            `;
        }
        let tags = this.getAttribute("tags");
        if (tags === null) {
            tags = "";
        }
        tags = tags.split(" ").map((tag) => `<span class="tag">${tag}</span>`).join("");


        return `
            ${github}
            ${languages}
            ${tags}
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
                    flex-wrap: wrap;
                    align-items: center;
                    width: fit-content;
                    margin: auto;
                }

                :host > a {
                    padding-right: 1.0em;
                    margin-right: 1.0em;
                }

                :host > * {
                    margin-right: 0.5em;
                }

                :host > *:last-child {
                    margin-right: 0;
                }

                :host > a > img:hover {
                    opacity: 0.5;
                    filter: invert(85%) sepia(3%) saturate(1933%) hue-rotate(323deg) brightness(107%) contrast(90%);
                    /* based off var(--ctp-frappe-rosewater) */
                }

                span.tag {
                    color: var(--ctp-frappe-green);
                }

                span.tag {
                    padding-right: 0.5em;
                }

                img:is(:hover, :focus) + div > span.tooltip {
                    opacity: 1;
                    z-index: 10;
                }

                span.tooltip {
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                    display: block;
                    background: var(--ctp-frappe-overlay0);
                    color: var(--ctp-frappe-green);
                    padding: 0.5em;
                    position: absolute;
                    z-index: -1;
                    top: 0;
                    border-radius: 1em;
                    transform: translateX(-4em);
                    transform: translateY(4em);
                }
            </style>
        `;
    }
}

customElements.define('project-summary', ProjectSummary);