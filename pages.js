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
        <div class="row mt-5" id="timerContainer">
            <div class="progress my-5">
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
    </div>`,
    settingsContainer :
    `<div id="settingsContainer" class="col-6">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <label class="input-group-text" for="difficulty">Difficulty</label>
            </div>
            <select id="difficulty" class="custom-select setting" onchange="setDifficulty()">
                <option id="easy" value="easy">easy</option>
                <option id="medium" value="medium">medium</option>
                <option id="hard" value="hard">hard</option>
                <option id="custom" value="custom">custom</option>
            </select>
        </div>
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Total time</span>
            </div>
            <input id="totalTime" type="number" min="10" value="10" class="form-control setting" placeholder="0 for endless time" aria-describedby="basic-addon1">
            <div class="input-group-append">
                <span class="input-group-text">sec</span>
            </div>
        </div>
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Match amount</span>
            </div>
            <input id="matchAmount" type="number" min="5" value="5" class="form-control setting" placeholder="match amount" aria-describedby="basic-addon1">
        </div>
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <label class="input-group-text" for="guessBy">Guess the</label>
            </div>
            <select class="custom-select setting" id="guessBy" class="setting">
                <option selected>Choose...</option>
                <option value="movie">movie name</option>
                <option value="character">character name</option>
                <option value="actor">actor name</option>
            </select>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="dryMode">
            <label class="form-check-label" for="flexCheckDefault">
                Don't show my already corrected matches
            </label>
        </div>
        <button onclick="saveSettings()" class="btn btn-primary my-4">Save</button>
    </div>
    `
}




