
var canvas;
var stage = null;
var contentManager;
var platformerGame;
var enableShadows = false;
var enableRAF = true;

// Specific IE9 pinned site experience
// Buttons displayed in the thumnbail preview in the taskbar
var ieBtnLeft, ieBtnRight, ieBtnJump;

function restart() {
    if (stage == null) {
        // create a new stage and point it at our canvas:
        canvas = document.getElementById("platformerCanvas");
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        stage = new Stage(canvas);
        var bitmap = new createjs.Bitmap("assets/image/Backgrounds/fundo.png");
        stage.addChild(bitmap);
        this.ContentManager.imgInicio;

        // downloading all needed images ressources and preloading sounds & music
        contentManager = new ContentManager(stage, 800, 480);
        contentManager.SetDownloadCompleted(startGame);
        contentManager.StartDownload();
    }
    else {
        platformerGame.ReloadCurrentLevel();
    }
}

// Simuate keypress for touch devices & for the IE9 pinned thumbnail buttons
function jumpKey() {
    platformerGame.handleKeyDown({ "keyCode": 87 });

}

function leftKey() {
    platformerGame.handleKeyDown({ "keyCode": 37 });
}

function rightKey() {
    platformerGame.handleKeyDown({ "keyCode": 39 });
}

function changeShadows() {
    enableShadows = !enableShadows;
}

function changeRAF() {
    enableRAF = !enableRAF;
    Ticker.useRAF = enableRAF;
}

// Callback function once everything has been downloaded
function startGame() {

    platformerGame = new PlatformerGame(stage, contentManager, 800, 480, window.innerWidth, window.innerHeight);
    window.addEventListener("resize", OnResizeCalled, false);
    OnResizeCalled();
    DragDropLogic.monitorElement(canvas, platformerGame);
    
    addEventListener("mousedown",function (){
        
        platformerGame.StartGame();
    });

    
}

function initGameLogic() {
    setIE9PinnedModeExperience();
    restart();
}

function OnResizeCalled() {
    var gameWidth = window.innerWidth;
    var gameHeight = window.innerHeight;
    var scaleToFitX = gameWidth / 800;
    var scaleToFitY = gameHeight / 480;

    var currentScreenRatio = gameWidth / gameHeight;
    var optimalRatio = Math.min(scaleToFitX, scaleToFitY);

    // In 16/9 like screen, let's play fullscreen!
    if (currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) {
        canvas.style.width = gameWidth + "px";
        canvas.style.height = gameHeight + "px";
    }
    else {
        canvas.style.width = 800 * optimalRatio + "px";
        canvas.style.height = 480 * optimalRatio + "px";
    }
}

//********************************************************
// Specific code for IE9+ for the pinned mode experience
function setIE9PinnedModeExperience() {
    try {
        document.addEventListener('msthumbnailclick', processSelection, false);

        ieBtnLeft = window.external.msSiteModeAddThumbBarButton('icons/ie9left.ico', 'Left');
        ieBtnJump = window.external.msSiteModeAddThumbBarButton('icons/ie9jump.ico', 'Jump');
        ieBtnRight = window.external.msSiteModeAddThumbBarButton('icons/ie9right.ico', 'Right');

        window.external.msSiteModeShowThumbBar();
    }
    catch (e) { }
}




function processSelection(btn) {
    switch (btn.buttonID) {
        case ieBtnLeft:
            leftKey();
            break;

        case ieBtnRight:
            rightKey();
            break;

        case ieBtnJump:
            jumpKey();

            break;
    }
}
//********************************************************