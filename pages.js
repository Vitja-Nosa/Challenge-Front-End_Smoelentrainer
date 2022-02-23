const pages = {
    preGameContainer :  
    `<div id="preGameContainer">
        <div class="img-fluid text-center">
            <img src="images/allmovies.jpg" alt="chessboard" width="500">
        </div>
        <div class="text-center m-3">
            <button id="startBtn" onclick="startSmoelentrainer()" class="btn-lg btn-primary">Start</button>
        </div>
    </div>`,
    gameContainer : 
    `<div id="gameContainer">
        <div class="row text-center">
            <h2 class="col" id="score">Socre: 0</h2>
            <h2 class="col" id="lives">Attempts left: 0</h2>
        </div>
        <div id='imgContainer' class="img-container text-center my-3"></div>
        <div id='btnContainer' class="word-container text-center my-3"></div>
        <div class="row mt-5">
            <div id="timerContainer" class="progress my-5">
                <div id="timer" class="progress-bar"></div>
            </div>
        </div>   
    </div>`,
    postGameContainer :
    `<div class="row border border-dark" id="postGameContainer">
        <div class="row text-center my-4">
            <h1>Game over</h1>
        </div>
        <div class="row my-4">
            <div class="col-4 mx-auto">
                <h2 class='text-center mb-5' id="feedback"></h2>
                <h2 id="finalScore"></h2>
                <h2 id="finalLives"></h2>
                <h2 id="timeLeft"></h2>
            </div>
        </div>
        <div class="row mx-auto justify-content-center my-5">
            <button class="btn btn-primary col-2" onclick="renderHTML(pages.preGameContainer)">Play Again</button>
        </div>
    </div>`
}


