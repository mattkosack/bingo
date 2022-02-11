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

let copy_phrases;
let usedNums = new Array(phrases.length);
let usedPhrases = new Array(phrases.length);

let darkMode = window.localStorage.getItem("darkMode") === "true";

function newCard() {
    copy_phrases = phrases.map((x) => x); 
    for (let i = 0; i < 24; i++) { setSquare(i); } 
}

function setSquare(thisSquare) {
	let currSquare = "square"+thisSquare;
	let newNum, newPhrase;
	
	do {
        newPhrase = getNewPhrase()
	} while (usedNums[newNum]);
	
    usedPhrases[newNum] = true;
	document.getElementById(currSquare).innerHTML = newPhrase;
    document.getElementById(currSquare).classList.remove("clicked");
}

function getNewPhrase() {
    let num = Math.floor(Math.random() * copy_phrases.length)
    let phrase = copy_phrases[num];
    copy_phrases.splice(num, 1);
    return phrase; 
}

function anotherCard() {
	for (let i = 1; i < usedNums.length; i++) { usedNums[i] = false; }
	newCard();
}

function onClick(e) {
    e.target.classList.toggle("clicked");
}

function initEvents() {
    for (let i = 0; i < 24; i++) {
        document.getElementById("square"+i).addEventListener("click", onClick);
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
