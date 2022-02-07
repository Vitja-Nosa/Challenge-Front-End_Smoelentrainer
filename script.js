const preGameContainer = document.getElementById('preGameContainer'),
gameContainer = document.getElementById('gameContainer'),
timer = document.getElementById('timer');

const startBtn = document.getElementById('startBtn')
startBtn.onclick = startGame;

function startGame(){
    preGameContainer.style.display = 'none';
    gameContainer.style.display = 'block'
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

startTimer(30)