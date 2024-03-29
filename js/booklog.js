let wordToTD = new Map();
function addWord(td) {
    let word = td.textContent.toLowerCase();
    if (word === "") {
        return;
    }

    if (wordToTD.has(word)) {
        wordToTD.get(word).push(td);
    } else {
        wordToTD.set(word, [td]);
    }
}

function setupClickListener(td) {
    td.addEventListener("click", (e) => {
        // If already selected, set flag to only unselect
        let onlyUnselect = false;
        if (td.classList.contains("selected")) {
            onlyUnselect = true;
        }

        // Clear old selection
        removeAllSelections();

        if (onlyUnselect) {
            return;
        }

        // Set new selection
        let word = td.textContent.toLowerCase();
        setSelection(word);
    });
}

function removeAllSelections() {
    for (const td of document.querySelectorAll(".selected")) {
        td.classList.remove("selected");
    }

    clearNumHits();
}

function clearNumHits() {
    let elem = document.getElementById("num-hits");
    elem.innerText = "";
    elem.classList.remove("has-hits");
    elem.classList.remove("no-hits");
}

function setNumHits(numHits) {
    let elem = document.getElementById("num-hits");
    elem.innerText = numHits;
    if (numHits > 0) {
        elem.classList.add("has-hits");
        elem.classList.remove("no-hits");
    } else {
        elem.classList.remove("has-hits");
        elem.classList.add("no-hits");
    }
}

function setSelection(word) {
    let tds = wordToTD.get(word);
    let numHits = 0;
    for (const td of tds) {
        td.classList.add("selected");
        numHits++;
    }

    setNumHits(numHits);
}

function setSelectionSubstr(query) {
    let numHits = 0;
    for (const words of wordToTD.keys()) {
        if (words.includes(query)) {
            for (const td of wordToTD.get(words)) {
                td.classList.add("selected");
                numHits++;
            }
        }
    }

    setNumHits(numHits);
}

function setDataClass(index, td) {
    switch (index) {
        case 0:
            td.classList.add("title");
            break;
        case 1:
            td.classList.add("series");
            break;
        case 2:
            td.classList.add("world");
            break;
        case 3:
            td.classList.add("author");
            break;
        case 4:
            td.classList.add("words");
            break;
        case 5:
            td.classList.add("start");
            break;
        case 6:
            td.classList.add("finish");
            break;
        case 7:
            td.classList.add("notes");
            break;
    }
}

function makeTableHeader(firstLine) {
    let headings = firstLine.split("\t");

    let header = document.createElement("thead");
    let row = document.createElement("tr");
    for (const heading of headings) {
        let th = document.createElement("th");
        th.textContent = heading;
        th.scope = "col";
        row.appendChild(th);
    }

    header.appendChild(row);
    return header;
}

function makeTableBody(lines) {
    let body;

    lines = lines.reverse();
    
    let tbody = document.createElement("tbody");
    for (const line of lines) {
        let row = document.createElement("tr");
        let cells = line.split("\t");

        let i = 0;
        for (const cell of cells) {
            let td = document.createElement("td");
            td.textContent = cell;
            setDataClass(i, td);
            addWord(td);
            setupClickListener(td);
            row.appendChild(td);
            i++;
        }

        tbody.appendChild(row);
    }

    return tbody;
}

function parseCSV(text) {
    const lines = text.split("\n");

    let table = document.createElement('table');
    table.appendChild(makeTableHeader(lines.shift()));
    table.appendChild(makeTableBody(lines));

    return table;
}

fetch("/data/books.tsv")
    .then(r => r.text())
    .then(text => {
        let table = parseCSV(text);
        function loadAction() {
            document.querySelector('main').appendChild(table);
            setTimeout(() => {
                document.querySelectorAll('td').forEach(td => {
                    td.classList.add("loaded");
                });
            }, 100);
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {loadAction()});
        } else {
            loadAction();
        }
    });

// Handle search
document.addEventListener("DOMContentLoaded", () => {
    let search = document.querySelector(".search");
    search.addEventListener("keyup", (e) => {
        let query = search.value.toLowerCase();

        if (query === "" || query === " ") {
            removeAllSelections();
            return;
        }
    });
        
    search.addEventListener("keydown", (e) => {
        let query = search.value.toLowerCase();
        if (e.key == "Backspace") {
            query = query.slice(0, -1);
        } else if (e.key.length === 1) {
            query += e.key.toLowerCase();
        }

        removeAllSelections();

        if (query === "" || query === " ") {
            return;
        }
        
        setSelectionSubstr(query);
    });
});