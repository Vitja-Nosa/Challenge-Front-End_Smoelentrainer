var elems = {}
var gameHistory = []
var AllwrongMatches = []

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
    wrongMatches : []
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

function showResults(reason) {
    renderHTML(pages.postGameContainer);
    elems.finalScore.innerText = `Score: ${gameData.score}`;
    elems.finalLives.innerText = `Attempts left: ${gameData.lives}`;
    elems.timeLeft.innerText = `Time remaining: ${gameData.currentTimeSec}s`;
    elems.feedback.innerText = reason;
}

function showHistory() {
    renderHTML(pages.historyContainer);
    sortHistory();
}

function generateLog() {
    if (gameHistory.length > 0) {
        elems.log.innerHTML = "";
        gameHistory.forEach((value) => {
            var elem = document.createElement("li");
            elem.innerText = `Date: ${value.date}; Score: ${value.score}; Difficulty: ${value.difficulty}`;
            if (value.finished) {
                elem.style.backgroundColor = "#90EE90";
            } 
            else {
                elem.style.backgroundColor = "#FF7F7F";
            }
            elems.log.appendChild(elem);
        })
    }
}

function endGame(finished, reason = 'Game Over') {
    gameData.isGameRunning = false;
    if (gameData.timerInterval != undefined) {
        clearInterval(gameData.timerInterval);
    }
    AllwrongMatches.push(gameData.wrongMatches)
    if (AllwrongMatches.length > 5) {
        AllwrongMatches.splice(0,1)
    }
    showResults(reason);
    saveResults(finished);
}

function saveResults(finished) {
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear() + ' ' + today.getHours() + ":" + today.getMinutes();
    gameHistory.push(new Results(date, gameData.score, settings.difficulty, finished));
    if (gameHistory.length > 10) {
        gameHistory.splice(0, 1)
    }
}

class Results {
    constructor(date, score, difficulty, finished) {
        this.date = date;
        this.score = score;
        this.difficulty = difficulty;
        this.finished = finished;
    }
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
                endGame(false, 'Out of Time!');
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
        elem.dataset.match = arr[i][settings.guessBy] // giving id so we can match with btns later
        elem.dataset.id = arr[i]['id']
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
        elem.dataset.match = arr[i][settings.guessBy]; // same id as matching img
        elem.classList = 'btn btn-success my-2';
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
        if (gameData.lastClickedBtn.dataset.match == gameData.lastClickedImg.dataset.match) {
            gameData.score++
            elems.score.innerText = `Score: ${gameData.score}`;
            gameData.lastClickedBtn.remove();
            gameData.lastClickedImg.remove();
            document.body.style.backgroundColor = '#90EE90';
            if (gameData.score == settings.matchAmount) {
                endGame(true, 'You won');
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
                endGame(false, 'No more attempts');
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
    if (gameData.timerInterval != undefined) {
        clearInterval(gameData.timerInterval);
        gameData.isGameRunning = false;
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

function sortHistory() {
    if (elems.sortBy.value == 'score') {
        gameHistory.sort((a,b) => {
            return b.score - a.score 
        })
    }
    else {
        gameHistory.sort((a,b) => {
            return new Date(a.date) - new Date(b.date);
        })
    }
    generateLog()
}

layout = 'rows'
function changeLayout() {
    if (layout == 'rows') {
        elems.imgContainer.classList.add('col-4');
        elems.btnContainer.classList.add('col-4');
        elems.btnContainer.parentElement.style.justifyContent = "space-around"
        elems.btnContainer.querySelectorAll('button').forEach((value) => {
            value.style.display = 'block';
        })
        elems.imgContainer.querySelectorAll('img').forEach((value) => {
            value.style.display = 'block';
        })
        layout = 'cols'
    }
    else {
        layout = 'rows'
        elems.imgContainer.classList.remove('col-4');
        elems.btnContainer.classList.remove('col-4');
        elems.btnContainer.parentElement.style.justifyContent = "initial"
        elems.btnContainer.querySelectorAll('button').forEach((value) => {
            value.style.display = 'initial';
        })
    }
}

function showBlindSpot() {
    renderHTML(pages.blindSpotContainer);
    mismatches = []
    AllwrongMatches.forEach((arr) => {
        arr.forEach((value) => {
            mismatches.push(value)
        })
    })
    top3 = findMostCommon(mismatches)
    if (top3[0] == undefined) {
        renderHTML("<h2 class='text-center display-6'>You havn't made a mistake yet, good job!</h2>")
    }
    else {
        for (i=0; i<top3.length; i++) {
            if (top3[i] != undefined) {
                elem_container = document.createElement('div')
                elem_container.classList.add('col-4')
                elem_img = document.createElement('img')
                obj = movies.find( ({ id }) => id == top3[i] )
                elem_img.src = obj['img']
                elem_container.appendChild(elem_img)
                elem_h3 = document.createElement('h3')
                elem_h3.innerText = obj['character']
                elem_container.appendChild(elem_h3)
                elems.blindSpotSubContainer.appendChild(elem_container)
            }
        }
    }
}

function findMostCommon(arr) {
    top3 = []
    for (k=0; k<3; k++) {
      counted = []
      for(j=0; j<arr.length; j++) {
          count = 0
          for(i=0; i<arr.length; i++) {
              if (arr[i] == arr[j]) {
                  count++
              }
          }
          counted.push(count)
      }
      highestNumber = counted[0]
      for (i=0; i<counted.length; i++) {
          if (counted[i] > highestNumber) {
              highestNumber = counted[i]
          }
      }
      top3.push(arr[counted.indexOf(highestNumber)])
      for (i=arr.length; i>=0; i--) {
        if(arr[i] == arr[counted.indexOf(highestNumber)]) {
          arr.splice(i, 1)
        }
      }
    }
    return top3
}