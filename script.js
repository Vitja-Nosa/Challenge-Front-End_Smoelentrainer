const imgContainer = document.getElementById('imgContainer')
const btnContainer = document.getElementById('btnContainer');
const scoreElem = document.getElementById('score');
const livesElem = document.getElementById('livesElem');

const preGameContainer = document.getElementById('preGameContainer'),
gameContainer = document.getElementById('gameContainer'),
timer = document.getElementById('timer');

const startBtn = document.getElementById('startBtn')
startBtn.onclick = startGame;

var lastClickedImg;
var lastClickedBtn;

var imgAmount = 10;
var score = 0;
var lives = 3;

function startGame(){
    preGameContainer.style.display = 'none';
    gameContainer.style.display = 'block'
    livesElem.innerText = `Attempts left: ${lives}`;
    shuffle(movies, 10)
    usedMovies = movies.splice(0,imgAmount)
    createElements(usedMovies);
}

function startTimer(time) {
    timer.style.width = '100%';
    const TOTALTIMER = time;
    var currentTimeSec = TOTALTIMER-1
    var procent;
    var timerInterval = setInterval(function(){
        if(currentTimeSec == 0){
            clearInterval(timerInterval)
            setTimeout(function(){  
                setTimeout(function(){
                    timer.style.display = "none";
                },500)
            }, 1000)
        }
        procent = currentTimeSec / TOTALTIMER * 100
        timer.style.width = procent + '%';
        currentTimeSec--;
    }, 1000)
}

function shuffle(arr, amt) {
    for (j=0; j<amt; j++) {
        for (i=0; i<arr.length; i++) {
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
            lastClickedImg = this; // remembering the last img we clicked for matching
            addLastClickedStyling(imgContainer, 'selectedImg', this)
            checkMatch()
        }
        imgContainer.appendChild(elem);
    }
    shuffle(arr, 20) // shuffling array so it's not the same pattern as imgs
    // creating the buttons
    for (i=0; i<qty; i++) {
        var elem = document.createElement('button');
        elem.innerText = arr[i]['movie'];
        elem.dataset.id = arr[i]['id']; // same id as matching img
        elem.classList = 'btn btn-success';
        elem.onclick = function() {
            lastClickedBtn = this
            addLastClickedStyling(btnContainer, 'selectedBtn', this)
            checkMatch()
            
        }
        btnContainer.appendChild(elem)
    }
}

function checkMatch() {
    if (lastClickedImg != undefined && lastClickedBtn != undefined) {
        if (lastClickedBtn.dataset.id == lastClickedImg.dataset.id) {
            score++
            scoreElem.innerText = `Score: ${score}`;
            lastClickedBtn.remove();
            lastClickedImg.remove();
            document.body.style.backgroundColor = '#90EE90';
            
        }
        else {
            lives--
            livesElem.innerText = `Attempts left: ${lives}`;
            lastClickedImg.classList.remove('selectedImg')
            lastClickedBtn.classList.remove('selectedBtn')
            document.body.style.backgroundColor = '#FF7F7F';
        }
        setTimeout(() => {
            document.body.style.backgroundColor = 'white';
        },300)
        lastClickedImg = lastClickedBtn = undefined
       
        
        
    }
}
function addLastClickedStyling(container, className, that) {
    for (i=0; i<container.children.length; i++) {
        crntElem = container.children[i];
        crntElem.classList.remove(className);
    }
    that.classList.add(className)
}
startTimer(60)