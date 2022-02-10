

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
    if (e.target.style.backgroundColor === 'cyan') {
        e.target.style.backgroundColor = 'white';
    } else { e.target.style.backgroundColor = 'cyan'; }
}

function initEvents() {
    for (let i=0; i<24; i++) { 
        document.getElementById('square'+i).addEventListener('click', onClick);
        document.getElementById('square'+i).style.backgroundColor = 'white'; 
    }
}