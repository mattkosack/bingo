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
let darkMode = false;
if (document.cookie.split(";")[0].split("=")[1] === "true") {
    darkMode = true;
}

function newCard() {
    copy_phrases = phrases.map((x) => x); 
    for(var i=0; i < 24; i++) { setSquare(i); } 
    initEvents();
}

function setSquare(thisSquare) {
	var currSquare = "square"+thisSquare;
	var newNum, newPhrase;
	
	do {
        newPhrase = getNewPhrase()
	}
	while (usedNums[newNum]);
	
    usedPhrases[newNum] = true;
	document.getElementById(currSquare).innerHTML = newPhrase;
}

function getNewPhrase() {
    let num = Math.floor(Math.random() * copy_phrases.length)
    let phrase = copy_phrases[num];
    copy_phrases.splice(num, 1);
    return phrase; 
}

function anotherCard() {
	for(var i=1; i < usedNums.length; i++) { usedNums[i] = false; }
	newCard();
}

function onClick(e) {
    if (e.target.style.backgroundColor === "cyan") {
        e.target.style.backgroundColor = "white";
    } else if (e.target.style.backgroundColor === "white") {
        e.target.style.backgroundColor = "cyan";
    } else if (e.target.style.backgroundColor === "rgb(153, 170, 181)") {
        e.target.style.backgroundColor = "rgb(114, 137, 218)";
    } else if (e.target.style.backgroundColor === "rgb(114, 137, 218)") {
        e.target.style.backgroundColor = "rgb(153, 170, 181)";
    }
}

function initEvents() {
    var color = "rgb(153, 170, 181)";
    if (!darkMode) {
        color = "white";
    }
    for (let i=0; i < 24; i++) { 
        document.getElementById("square"+i).addEventListener("click", onClick);
        document.getElementById("square"+i).style.backgroundColor = color; 
    }
    setColorModeColors(darkMode);
}

function switchSquareColor(square) {
    if (square.style.backgroundColor === "white") {
        square.style.backgroundColor = "rgb(153, 170, 181)";
    } else if (square.style.backgroundColor === "rgb(153, 170, 181)") {
        square.style.backgroundColor = "white";
    } else if (square.style.backgroundColor === "cyan") {
        square.style.backgroundColor = "rgb(114, 137, 218)";
    } else if (square.style.backgroundColor === "rgb(114, 137, 218)") {
        square.style.backgroundColor = "cyan";
    }
}

function setColorModeColors(mode) {
    let button = document.querySelector("#colorMode");
    if (mode) {
        darkMode = true;
        document.body.style.backgroundColor= "#23272a";
        button.innerText = "Light Mode";
        document.querySelector("#squarefree").style.background = "rgb(114, 137, 218)";
    }
    else {
        darkMode = false;
        document.body.style.backgroundColor= "#1abc9c";
        button.innerText = "Dark Mode";
        document.querySelector("#squarefree").style.background = "cyan";
    }
}

function switchColorMode() {
    /* Swap text and color to change color mode */
    setColorModeColors(!darkMode);
    for (var i=0; i < 24; i++) {
        switchSquareColor(document.querySelector("#square" + i));
    }
   document.cookie = "darkMode=" + darkMode + "; SameSite=None; Secure";
}
