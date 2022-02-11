let phrases = [
        "Green to Green", "Jeep Talk", "The Hands", 
        "Learning Cycle", "Unnoticed Typo", "Shouting", 
        "Comma", "Poor Spelling", "Talk About Weekend", "Public Shaming",
        "Condes- cension", "You Type Slow", "Abstraction", 
        "Send Me An Email", "Long Plickers","Uncle Bob",
        "Hiking", "Over Time", "Says he's a Geek", "Github Workflow",
        "REST API", "Profession- alism","Beer","Tea", "HTTP is Just Text",
        "gitkeeper", "'word' instead of swear", "dotenv/ .env", "thing <b>is</b> thing",
        "auto-magically", "Random Gibberish", "Not Calling on Regulars", "Waiting for Volunteers",
        "Multiple Ignored Texts", "Canvas Edits", "1Password"
    ];

let darkMode = window.localStorage.getItem("darkMode") === "true";

function newCard() {
    let shuffled = phrases.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
    for (let i = 0; i < 24; i++) {
        let elem = document.getElementById("square"+i);
        elem.innerHTML = shuffled[i];
        elem.classList.remove("clicked");
    }
}

function initEvents() {
    for (let i = 0; i < 24; i++) {
        document.getElementById("square"+i).addEventListener("click", (e) => {
            e.target.classList.toggle("clicked");
        });
    }
    setColorModeColors(darkMode);
}

function setColorModeColors(mode) {
    document.getElementById("colorMode").innerText = mode ? "Light Mode" : "Dark Mode";
    darkMode = mode;
    if (darkMode) {
        document.body.classList.add('darkMode');
    }
    else {
        document.body.classList.remove('darkMode');
    }
}

function switchColorMode() {
    /* Swap text and color to change color mode */
    setColorModeColors(!darkMode);
    window.localStorage.setItem('darkMode', darkMode.toString());
}
