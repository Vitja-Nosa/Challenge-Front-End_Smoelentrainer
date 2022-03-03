var elems = {}
var gameHistory = []

var settings = {
    difficulty: 'easy',
    totalTime: 30,
    matchAmount : 6,
    guessBy: 'movie',
    dryMode: 'false'
}

var gameData = {
    isGameRunning: false,
    lives: 3,
    score : 0,
    lastClickedBtn : undefined,
    lastClickedImg : undefined,
    timerInterval : undefined,
    currentTimeSec : undefined,
    wrongMatches: []
}

const DIFFICULTIES = {
    easy: {
        time: 60,
        matchAmount: 6,
        guessBy: 1,
        color: '#90EE90'
    },
    medium: {
        time: 40,
        matchAmount: 10,
        guessBy: 2,
        color: '#FFD580'
    },
    hard: {
        time: 30,
        matchAmount: 12,
        guessBy: 3,
        color: '#FF7F7F'
    }
}

var gameDataDefault = JSON.parse(JSON.stringify(gameData)) // saving the default gameData

window.onload = function() {
    renderHTML(pages.preGameContainer);
    setSettings(); // changing default settings if anything is in localstorage
}

function startSmoelentrainer() {
    gameData = JSON.parse(JSON.stringify(gameDataDefault));
    renderHTML(pages.gameContainer);
    gameData.isGameRunning = true;
    shuffle(movies, 10)
    usedMovies = movies.slice(0, settings.matchAmount)
    createElements(usedMovies);
    elems.lives.innerText = `Attempts left: ${gameData.lives}`;
    startTimer(settings.totalTime)
}

function showResults(reason = 'Game Over') {
    renderHTML(pages.postGameContainer);
    elems.finalScore.innerText = `Score: ${gameData.score}`;
    elems.finalLives.innerText = `Attempts left: ${gameData.lives}`;
    elems.timeLeft.innerText = `Time remaining: ${gameData.currentTimeSec}s`;
    elems.feedback.innerText = reason;
}

function endGame() {
    gameData.isGameRunning = false;
    if (gameData.timerInterval != undefined) {
        clearInterval(gameData.timerInterval);
    }
}

function saveResults() {

}

function startTimer(time) {
    if (time !== 0) {
        elems.timer.style.width = '100%';
        const TOTALTIMER = time;
        gameData.currentTimeSec = TOTALTIMER-1
        var procent;
        gameData.timerInterval = setInterval(function(){
            console.log('timer running')
            if(gameData.currentTimeSec == -1){
                gameData.currentTimeSec = 0;
                showResults('Out of Time!');
            }
            else {
                procent = gameData.currentTimeSec / TOTALTIMER * 100
                elems.timer.style.width = procent + '%';
                gameData.currentTimeSec--;
            }
        }, 1000)
    }
    else {
        elems.timerContainer.style.display = 'none'
    }
    
}

function shuffle(arr, amt) {
    for (j=0; j<amt; j++) {
        for (i=0; i<arr.length; i++) {
            var randInt = 0;
            while (randInt == i) {
                randInt = Math.floor(Math.random() * arr.length);
            }
            randInt = Math.floor(Math.random() * arr.length);
            temp = arr[i]
            arr[i] = arr[randInt];
            arr[randInt] = temp;
        }
    }
}

function createElements(arr) {
    var qty = arr.length;
    shuffle(arr, 20)
    // creating the images
    for (i=0; i<qty; i++) {
        var elem = document.createElement('img');
        elem.src = arr[i]['img'];
        elem.dataset.id = arr[i][settings.guessBy] // giving id so we can match with btns later
        elem.onclick = function() {
            gameData.lastClickedImg = this; // remembering the last img we clicked for matching
            addLastClickedStyling(elems.imgContainer, 'selectedImg', this)
            checkMatch()
        }
        elems.imgContainer.appendChild(elem);
    }
    shuffle(arr, 20) // shuffling array so it's not the same pattern as imgs
    // creating the buttons
    for (i=0; i<qty; i++) {
        var elem = document.createElement('button');
        elem.innerText = arr[i][settings.guessBy];
        elem.dataset.id = arr[i][settings.guessBy]; // same id as matching img
        elem.classList = 'btn btn-success';
        elem.onclick = function() {
            gameData.lastClickedBtn = this
            addLastClickedStyling(elems.btnContainer, 'selectedBtn', this)
            checkMatch()
            
        }
        elems.btnContainer.appendChild(elem)
    }
}

function checkMatch() {
    if (gameData.lastClickedImg != undefined && gameData.lastClickedBtn != undefined) {
        if (gameData.lastClickedBtn.dataset.id == gameData.lastClickedImg.dataset.id) {
            gameData.score++
            elems.score.innerText = `Score: ${gameData.score}`;
            gameData.lastClickedBtn.remove();
            gameData.lastClickedImg.remove();
            document.body.style.backgroundColor = '#90EE90';
            if (gameData.score == settings.matchAmount) {
                showResults('You won');
            }
            
        }
        else {
            gameData.lives--
            gameData.wrongMatches.push(gameData.lastClickedImg.dataset.id);
            elems.lives.innerText = `Attempts left: ${gameData.lives}`;
            gameData.lastClickedImg.classList.remove('selectedImg')
            gameData.lastClickedBtn.classList.remove('selectedBtn')
            document.body.style.backgroundColor = '#FF7F7F';
            if (gameData.lives == 0) {
                showResults('No more attempts');
            }
        }
        setTimeout(() => {
            document.body.style.backgroundColor = 'white';
        },300)
        gameData.lastClickedImg = gameData.lastClickedBtn = undefined
    }
}

function addLastClickedStyling(container, className, that) {
    for (i=0; i<container.children.length; i++) {
        crntElem = container.children[i];
        crntElem.classList.remove(className);
    }
    that.classList.add(className)
}

function renderHTML(html) {
    if (gameData.isGameRunning) {
        endGame();
    }
    document.getElementById('contentContainer').innerHTML = html;
    elems = {}
    document.querySelectorAll('[id]').forEach((value) => {
        elems[value.id] = value;
    })
}

function saveSettings() {
    elems.feedbackAlert.style.display = "block";
    if (elems.totalTime.value < 10) {
        elems.totalTime.value = 10;
    }
    if (elems.matchAmount.value < 5) {
        elems.matchAmount.value = 5
    }
    else if (elems.matchAmount.value > movies.length) {
        elems.matchAmount.value = movies.length
    }
    elems.settingsContainer.querySelectorAll('.setting').forEach((elem) => {
        localStorage.setItem(elem.id, elem.value);
    })
    localStorage.setItem('dryMode', elems.dryMode.checked);
    setSettings();
}

function setSettings() {
    for (key in localStorage) {
        if (settings[key]) {
            settings[key] = localStorage.getItem(key)
        }
    }
}

function loadSettingsPage() {
    renderHTML(pages.settingsContainer);
    elems.settingsContainer.querySelectorAll('.setting').forEach((elem) => {
        if (elem != elems.difficulty) {
            elem.onchange = function() {
                elems.feedbackAlert.style.display = 'none'
            }
        }  
    })
    elems.matchAmount.max = movies.length
    if (localStorage.length > 0) {
        elems[localStorage.getItem('difficulty')].selected = true
        if (localStorage.getItem('difficulty') == 'custom') {
            elems.totalTime.value = localStorage.getItem('totalTime');
            elems.matchAmount.value = localStorage.getItem('matchAmount');
            for(i=0; i<elems.guessBy.children.length; i++) {
                if (elems.guessBy.children[i].value == localStorage.getItem('guessBy')) {
                    elems.guessBy.children[i].selected = true;
                }
            }
        }
        elems.dryMode.checked = (localStorage.getItem('dryMode') == 'true')
    }
    setDifficulty()
}

function setDifficulty() {
    if (elems.difficulty.value != 'custom') {
        elems.difficulty.style.backgroundColor = DIFFICULTIES[elems.difficulty.value]["color"]
        elems.totalTime.readOnly = true
        elems.totalTime.style.backgroundColor = DIFFICULTIES[elems.difficulty.value]["color"]
        elems.matchAmount.readOnly = true
        elems.matchAmount.style.backgroundColor = DIFFICULTIES[elems.difficulty.value]["color"]
        elems.guessBy.style.backgroundColor = DIFFICULTIES[elems.difficulty.value]["color"]
        for (i=0; i<elems.guessBy.children.length; i++) {
            elems.guessBy.children[i].disabled = true;
        }
        if (DIFFICULTIES[elems.difficulty.value]) {
            elems.totalTime.value = DIFFICULTIES[elems.difficulty.value]["time"];
            elems.matchAmount.value = DIFFICULTIES[elems.difficulty.value]["matchAmount"]
            elems.guessBy.children[DIFFICULTIES[elems.difficulty.value]["guessBy"]].selected = 'selected'
        }
    }
    else {
        elems.difficulty.style.backgroundColor = '#fff'
        elems.totalTime.readOnly = false
        elems.totalTime.style.backgroundColor = '#fff'
        elems.matchAmount.readOnly = false
        elems.matchAmount.style.backgroundColor = '#fff'
        elems.guessBy.style.backgroundColor = '#fff'
        for (i=0; i<elems.guessBy.children.length; i++) {
            elems.guessBy.children[i].disabled = false;
        }
    }
}
