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


/**
 * Get a random number generator, optionally based on a predetermined seed. The
 * seed can be a string (or really any object) in which case it is hashed or an
 * integer which is used directly.
 * @param {*} seed string or number to use to seed the generator
 * @returns a function that takes no arguments and returns a new random number
 * when called
 */
function random_generator(seed) {
    if (!Number.isInteger(seed)) {
        // Hash the string using MurmurHash3
        // Source: https://stackoverflow.com/a/19301306/582298
        seed = seed.toString();
        let h = 1779033703 ^ seed.length;
        for(let i = 0; i < seed.length; i++) {
            h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
            h = h << 13 | h >>> 19;
        }
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        seed = (h ^= h >>> 16) >>> 0;
    }

    // Creates a mulberry32 random number generator.
    // Source: https://stackoverflow.com/a/19301306/582298
    let rand = function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    // Mix up the initial state
    for (let i = 0; i < 15; i++) { rand(); }
    
    // return the random number generating function
    return rand;
}

function reseed() {
    window.location.hash = Math.random().toString();
}

function newCard() {
    if (!window.location.hash) { reseed(); }
    let rand = random_generator(window.location.hash);
    let shuffled = phrases.map(value => ({ value, sort: rand() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
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
