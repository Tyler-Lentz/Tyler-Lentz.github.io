document.addEventListener('DOMContentLoaded', () => {
    let tagToCount = new Map();
    Array.from(document.getElementsByTagName('project-summary')).forEach((elem) => {

        let languages = elem.getAttribute("languages");
        if (languages === null) {
            languages = "";
        }

        let tags = elem.getAttribute("tags");
        if (tags === null) {
            tags = "";
        }
        tags += " " + languages;

        tags.split(" ").map((tag) => {
            if (tagToCount.has(tag)) {
                tagToCount.set(tag, tagToCount.get(tag) + 1);
            } else {
                tagToCount.set(tag, 1);
            }
        });

    });

    let tagToCountSorted = new Map([...tagToCount.entries()].sort((a, b) => b[1] - a[1]));
    

    let tagsHTML = ``;
    for (let [tag, count] of tagToCountSorted) {
        tagsHTML += `
            <div>
                <span class="tag">${tag}: </span><span class="tag-count">${count}</span>
            </div>
        `;
    }

    document.getElementById("overview-output").innerHTML = tagsHTML;
});