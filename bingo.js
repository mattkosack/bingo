let phrases = [
        "Green to Green", "Jeep Talk", "The Hands", 
        "Learning Cycle", "Unnoticed Typo", "Shouting", 
        "Comma", "Poor Spelling", "Talk About Weekend", "Public Shaming",
        "Condes- cension", "You Type Slow", "Abstraction", 
        "Send Me An Email", "Long Plickers","Uncle Bob",
        "Hiking", "Over Time", "Says he's a Geek", "Github Workflow",
        "REST API", "Profession- alism","Beer","Tea", "HTTP is Just Text",
        "gitkeeper", "'Word' Instead of Swear", "dotenv/ .env", "Thing is Thing",
        "Auto- magically", "Random Gibberish", "Not Calling on Regulars", "Waiting for Volunteers",
        "Multiple Ignored Texts", "Canvas Edits", "1Password", "Vague Question", "Unfunny Joke",
        "Didn't Say What he Wanted"
    ];

let isDarkMode = window.localStorage.getItem("darkMode") === "true";
let hasBingo = false, cardSize = 5, card = "";
let confettiTrig = false;
let imageExists = false;

// Audio Context utils
let context,
    gainNode,
    audioBuffer = null,
    audioSource,
    audioPlaying = false;

setupCard();

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

/**
 * Creates a new seed for random number generation.
 */
function reseed() {
    window.location.hash = Math.random().toString();
}

function confettiTrigger(){
    confettiTrig = !confettiTrig
    if (confettiTrig) {startConfetti();}
    else { stopConfetti(); } 
}

/**
 * Clear visible selection of squares.
 */
function clearSquareSelection() {
    for (let i = 0; i < cardSize*cardSize - 1; i++) {
        document.getElementById("square"+i).classList.remove("clicked");
    }
}

/**
 * Clear internal data structure of square selection.
 */
function clearInternalSquareSelection() {
    if (hasBingo) {
        stopConfetti();
        hasBingo = false;
    }
    setupCard();
}

/**
 * Clear bingo card by removing visible selection and internal data structure selection.
 */
function clearCard() {
    clearSquareSelection();
    clearInternalSquareSelection();
}

/**
 * Creates a new bingo card with values that are randomly selected from a set of available options.
 */
function newCard() {
    if (!window.location.hash) { reseed(); }
    let rand = random_generator(window.location.hash);
    let shuffled = phrases.map(value => ({ value, sort: rand() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
    for (let i = 0; i < cardSize*cardSize - 1; i++) {
        let elem = document.getElementById("square"+i);
        elem.innerHTML = shuffled[i];
        elem.classList.remove("clicked");
    }
    clearInternalSquareSelection();
}

/**
 * Performs initialization. This includes adding click listeners to all squares (except free space) and setting the color mode.
 * The click listeners will toggle whether the square is clicked or not (changing its appearance) and additionally check for bingo
 * and perform all actions associated with getting a bingo.
 */
function initEvents() {
    for (let i = 0; i < cardSize*cardSize - 1; i++) {
        document.getElementById("square"+i).addEventListener("click", (e) => {
            e.target.classList.toggle("clicked");
            let isSelected = Array.from(e.target.classList).indexOf("clicked") !== -1;
            let pos = (i > Math.floor(cardSize*cardSize/2) - 1) ? i+1 : i; // account for free space
            tallyClickedSquares(pos, isSelected ? 1 : -1);
            checkForBingo(isSelected);
        });
    }
    setColorModeColors(isDarkMode);
    
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    gainNode = context.createGain();
    loadSound()
}

/**
 * Create card and intialize values. The card keeps track of the number
 * of selected values in each row [0], column [1], and diagonal [2].
 */
function setupCard() {
    card = [new Array(cardSize).fill(0), new Array(cardSize).fill(0), new Array(2).fill(0)];
    // Add free space to tally
    card[0][Math.floor(cardSize / 2)] = 1; // In row 3
    card[1][Math.floor(cardSize / 2)] = 1; // In column 3
    card[2][0] = 1; // In diagonal, from top left
    card[2][1] = 1; // In diagonal, from top right
}

/**
 * Tallies up how many squares are clicked in each row, column, diagonal
 * @param pos location of square
 * @param val value to be added
 */
function tallyClickedSquares(pos, val) {
    let col = pos % cardSize, row = Math.floor(pos / cardSize);
    card[0][row] += val;
    card[1][col] += val;
    if (row === col) { card[2][0] += val; }
    else if (row + col === 4) { card[2][1] += val; }
}

/**
 * Checks for bingo and starts or stops confetti animation accordingly.
 * Toggles hasBingo if there is a bingo or not.
 * @param isSelected Whether or not the clicked piece is selected or not.
 * @returns true or false based on whether there is a bingo or not.
 */
function checkForBingo(isSelected) {
    let hadBingo = hasBingo;
    hasBingo = checkHorizontalVerticalBingo() || checkDiagonalBingo();
    if (hasBingo !== hadBingo) {
        if (hasBingo) { startConfetti(); }
        else { stopConfetti(); }
    }
    return hasBingo;
}

/** 
 * Checks for a horizontal or vertical bingo.
 * @returns true or false based on whether there is a bingo or not.
 */
function checkHorizontalVerticalBingo() {
    for (let i=0; i < 2; i++) {
        let arr = card[i];
        for (let j=0; j < arr.length; j++) {
            if (arr[j] === cardSize) { return true; }
        }
    }
    return false;
}

/** 
 * Checks for a diagonal bingo.
 * @returns true or false based on whether there is a bingo or not.
 */
function checkDiagonalBingo() {
    return card[2][0] === cardSize || card[2][1] === cardSize;
}

/**
 * Switches to the specified color mode.
 * @param mode A boolean that specifies dark mode if true and light mode if false.
 */
function setColorModeColors(mode) {
    document.getElementById("colorMode").innerText = mode ? "Light Mode" : "Dark Mode";
    isDarkMode = mode;
    if (isDarkMode) {
        document.body.classList.add('darkMode');
    }
    else {
        document.body.classList.remove('darkMode');
    }
}

/**
 * Swap text and color to change color mode
 */
function switchColorMode() {
    setColorModeColors(!isDarkMode);
    window.localStorage.setItem('darkMode', isDarkMode.toString());
}

/**
 * Load sound into the created audio context.
 */
function loadSound() {
    // Set the audio file's URL
    let audioURL = 'booamf.mp3';

    // Create a new request
    let request = new XMLHttpRequest();
    request.open("GET", audioURL, true);
    request.responseType= 'arraybuffer';
    request.onload = function () {
        // Take the audio from http request and decode it in an audio buffer
        context.decodeAudioData(request.response, function (buffer) {
            audioBuffer = buffer;
        });
    };
    request.send();
}

/**
 * Play the music file.
 */
function playSound() {
    // Creating source node
    audioSource = context.createBufferSource();
    // Passing in file
    audioSource.buffer = audioBuffer;
    audioSource.connect(gainNode);

    audioSource.loop = true;
    // Start playing
    gainNode.connect(context.destination);
    // Volume, 0 is mute
    gainNode.gain.setValueAtTime(0.5, context.currentTime);
    audioSource.start(0);
}

/**
 * Change whether or not the audio is playing.
 */
function changeAudioStatus() {
    window.localStorage.setItem('Music', audioPlaying.toString());
    document.getElementById("Music").innerText = audioPlaying ? "Music On" : "Music Off";
    if (audioPlaying) {
        // Stop the sound
        audioPlaying = false;
        audioSource.stop(0);
    } else {
        audioPlaying = true;
        playSound();
    }
}

/**
 * Converts HTML into an image and appends it to the page.
 * @param id The id of the element to be converted.
 * @param img_id The id of the new image created.
 * @param put_id The id of the element where the image is placed.
 */
function createImage(id, img_id, put_id) {
    html2canvas(document.querySelector(id)).then(canvas => {
        canvas.id = img_id;
        document.querySelector(put_id).appendChild(canvas);
    });
}

/**
 * Creates an image of the card or removes it if it already exists.
 */
 function htmlImage() {
    document.getElementById("imgButton").innerText = imageExists ? "Create Image" : "Remove Image";
    if (imageExists) {
        document.getElementById("#image").remove();
    } else {
        createImage("#bingotable", "#image", "#bottom");
    }
    imageExists = !imageExists;
}
