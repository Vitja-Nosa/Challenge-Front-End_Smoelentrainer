var elems = {}

var gameData = {
    isGameRunning: false,
    difficulty: 'easy',
    lives: 3,
    matchAmount : 6,
    totalTime: 0,
    score : 0,
    lastClickedBtn : undefined,
    lastClickedImg : undefined,
    timerInterval : undefined,
    currentTimeSec : undefined,
    wrongMatches: []
}

const GAMEDATACLONE = JSON.parse(JSON.stringify(gameData)) // cloning the original gameData object

window.onload = renderHTML(pages.preGameContainer)

function startSmoelentrainer() {
    gameData = JSON.parse(JSON.stringify(GAMEDATACLONE));
    gameData.isGameRunning = true;
    renderHTML(pages.gameContainer);
    shuffle(movies, 10)
    usedMovies = movies.slice(0, gameData.matchAmount)
    createElements(usedMovies);
    elems.lives.innerText = `Attempts left: ${gameData.lives}`;
    startTimer(gameData.totalTime)
}

function showResults(reason = 'Game Over') {
    endGame();
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
            console.log('still running')
            if(gameData.currentTimeSec == 0){
                gameData.currentTimeSec = 0;
                endGame();
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
        elem.dataset.id = arr[i]['id'] // giving id so we can match with btns later
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
        elem.innerText = arr[i]['movie'];
        elem.dataset.id = arr[i]['id']; // same id as matching img
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
            if (gameData.score == gameData.matchAmount) {
                endGame('You won');
            }
            
        }
        else {
            gameData.lives--
            gameData.wrongMatches.push(gameData.lastClickedImg.id);
            elems.lives.innerText = `Attempts left: ${gameData.lives}`;
            gameData.lastClickedImg.classList.remove('selectedImg')
            gameData.lastClickedBtn.classList.remove('selectedBtn')
            document.body.style.backgroundColor = '#FF7F7F';
            if (gameData.lives == 0) {
                endGame('No more attempts');
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
    document.getElementById('contentContainer').innerHTML = html;
    elems = {}
    document.querySelectorAll('[id]').forEach((value) => {
        elems[value.id] = value;
    })
}