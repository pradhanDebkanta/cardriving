const scoreContainer = document.querySelector('.score-container');
const gameContainer = document.querySelector('.game-container');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const bgm = new Audio('./carBgm.mp3');
const accident = new Audio('./Accident.mp3');
const horn = new Audio('./horn.mp3');

let isStart = false;
let ff = 0;
const formFactor = 20;
let lHScore;
if (window.localStorage.getItem('hScore')) {
    lHScore = window.localStorage.getItem('hScore');
} else {
    window.localStorage.setItem('hScore', 0);
    lHScore = 0;
}

// startScreen.addEventListener('mouseover', ()=>{console.log('mouse over')})
// startScreen.addEventListener('mouseleave', ()=>{console.log('mouse left')})

const gameBoundery = {
    top: null,
    bottom: null,
    left: null,
    right: null,
    height: null,
    width: null,
};
const player = {
    speedX: 3,
    speedY: 3,
    score: 0,
    highestScore: lHScore,
    x: null,
    y: null,
    width: null,
    height: 100,
};

let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
}
let audioKey = {
    m: false,
    p: false,
}

startScreen.addEventListener('click', start);
document.addEventListener('keydown', onPressKey);
document.addEventListener('keyup', onReleaseKey);

function carMove() {
    stickerMove();
    enemyCarmove();
    let mycar = document.querySelector('.car');
    let score = document.querySelector('.score');
    score.innerText = player.score;
    if (isStart) {
        if (keys.ArrowLeft && (player.x > 0)) {
            player.x -= player.speedX;
        }
        if (keys.ArrowRight && (player.x < gameBoundery.width - player.width)) {
            player.x += player.speedX;
        }
        if (keys.ArrowUp && (player.y > gameBoundery.top * 2.5)) {
            player.y -= player.speedY;
        }
        if (keys.ArrowDown && (player.y < gameBoundery.bottom - player.height)) {
            player.y += player.speedY;
        }
        mycar.style.left = player.x + 'px';
        mycar.style.top = player.y + 'px';

        window.requestAnimationFrame(carMove);
        ff++;
        player.score = Math.floor(ff / formFactor);

    }
}

function onPressKey(e) {
    e.preventDefault();
    keys[e.key] = true;
    if (e.key === 'm' || e.key === 'p') {
        audioKey[e.key] = !audioKey[e.key];
        if (e.key === 'm') {
            let audioIcon = document.querySelector('.audio-img');
            if (!audioKey.m) {
                audioIcon.classList.remove('fa-volume-mute');
                audioIcon.classList.add('fa-volume-down');
                bgm.muted = false;

            } else {
                audioIcon.classList.remove('fa-volume-down');
                audioIcon.classList.add('fa-volume-mute');
                bgm.muted = true;
            }
        }
        if (e.key === 'p' && isStart) {
            if (!audioKey.m) {
                horn.play();
            }
        }
    }
};

function onReleaseKey(e) {
    e.preventDefault();
    keys[e.key] = false;
    if (e.key === 'p' && isStart) {
        if (!audioKey.m) {
            horn.pause();
        }
    }
};

function roadStickers() {
    for (let i = 0; i < 9; i++) {
        let sticker = document.createElement('div');
        let streep1 = document.createElement('div');
        let streep2 = document.createElement('div');
        let streep3 = document.createElement('div');
        sticker.setAttribute('class', 'sticker');
        streep1.setAttribute('class', 'streep1');
        streep3.setAttribute('class', 'streep1');
        streep2.setAttribute('class', 'streep2');
        sticker.appendChild(streep1);
        sticker.appendChild(streep2);
        sticker.appendChild(streep3);

        sticker.y = i * 150;
        sticker.style.top = i * 150 + 'px';
        gameArea.appendChild(sticker);
    }
};

function stickerMove() {
    let stickers = document.querySelectorAll('.sticker');
    stickers.forEach((sticker) => {
        if (sticker.y >= 1350) {
            sticker.y -= 1350;
        }
        sticker.y += player.speedY;
        sticker.style.top = sticker.y + player.speedY + 'px';

    })
};

function randName() {
    let name = Math.random().toString(16).substr(-2);
    return name;
}

function enemyCar() {
    for (let i = 0; i < 12; i++) {
        let eCar = document.createElement('div');
        eCar.setAttribute('class', 'enemy');
        eCar.x = Math.floor(Math.random() * (gameBoundery.width - player.width));
        let randY = 0 - (220 + Math.floor(Math.random() * 100));
        eCar.y = randY * (i + 1);
        eCar.style.left = eCar.x + 'px';
        eCar.style.top = eCar.y + 'px';
        eCar.style.backgroundColor = randColor();
        eCar.innerHTML = `<span class="enemy-car-name" style=color:${randColor()}>${randName()}</span>`
        gameArea.appendChild(eCar);

    }
}
function enemyCarmove() {
    let enemys = document.querySelectorAll('.enemy');
    let myCar = document.querySelector('.car');
    enemys.forEach((enemy) => {
        let colideFlag = isColide(myCar, enemy);
        if (colideFlag) {
            gameOver();
        }
        if (enemy.y > 2000) {
            enemy.y -= 2700;
            enemy.x = Math.floor(Math.random() * (gameBoundery.width - player.width));
            enemy.style.left = enemy.x + 'px';
            let eCarName = enemy.children;
            eCarName[0].style.color = randColor();
            eCarName[0].innerText = randName();
        }
        enemy.y += 2 + Math.floor(Math.random() * 6);
        enemy.style.top = enemy.y + 'px';
    })
}
function isColide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !((aRect.top > bRect.bottom) || (aRect.bottom < bRect.top) || (aRect.left > bRect.right) || (aRect.right < bRect.left));

}

function gameOver() {
    isStart = false;
    horn.pause();
    bgm.pause();
    if (audioKey.m) {
        accident.muted = true;
    } else accident.muted = false;
    accident.currentTime = 2;
    accident.play();
    if (window.localStorage.getItem('hScore') < player.score) {
        window.localStorage.setItem('hScore', player.score);
    }
    let gameOverContainer = document.createElement('div');
    let modalBody = document.createElement('div');
    let modalHeading = document.createElement('div');
    let modalContent = document.createElement('div');
    let replayBtn = document.createElement('button');
    let cancleBtn = document.createElement('button');

    gameOverContainer.setAttribute('class', 'game-over-container');
    modalBody.setAttribute('class', 'modal-body');
    modalHeading.setAttribute('class', 'modal-heading');
    modalContent.setAttribute('class', 'modal-content');
    replayBtn.setAttribute('class', 'modal-btn replay-btn');
    cancleBtn.setAttribute('class', 'modal-btn cancle-btn');
    modalHeading.innerHTML = `Game Over!!! <br/> Score : ${player.score}`;
    replayBtn.innerText = 'Replay';
    cancleBtn.innerText = 'Cancle';

    modalBody.appendChild(modalHeading);
    modalContent.appendChild(replayBtn);
    modalContent.appendChild(cancleBtn);
    modalBody.appendChild(modalContent);
    gameOverContainer.appendChild(modalBody);
    let container = document.querySelector('.container');
    container.appendChild(gameOverContainer);


    cancleBtn.addEventListener('click', () => {
        lHScore = window.localStorage.getItem('hScore');
        player.highestScore = lHScore;
        gameOverContainer.remove();
        accident.pause();
        accident.currentTime = 0;
        bgm.play();
    });
    replayBtn.addEventListener('click', () => {
        gameArea.innerText = '';
        ff = 0;
        lHScore = window.localStorage.getItem('hScore');
        player.highestScore = lHScore;
        gameOverContainer.remove();
        start();
        accident.pause();
        accident.currentTime = 0;
        bgm.currentTime = 0;
    });




}

function randColor() {
    return '#' + Math.random().toString(16).substr(-6);
}

function bgMusic() {
    bgm.play();
    bgm.loop = true;
}

function hornMusic() {

}

function audioControl() {
    audioKey.m = !audioKey.m;
    let audioIcon = document.querySelector('.audio-img');
    if (!audioKey.m) {
        audioIcon.classList.remove('fa-volume-mute');
        audioIcon.classList.add('fa-volume-down');
        bgm.muted = false;
    } else {
        audioIcon.classList.remove('fa-volume-down');
        audioIcon.classList.add('fa-volume-mute');
        bgm.muted = true;

    }
}

function hornOn() {
    if (isStart && !audioKey.m) {
        horn.play();
    }
}
function hornOff() {
    if (isStart && !audioKey.m) {
        horn.pause();
    }}

function start() {
    isStart = true;
    startScreen.classList.add('hide');
    scoreContainer.innerHTML =
        `Score : <span class="score">${player.score}</span> 
     <span class="highest-score"> Highest Score: <span class="h-score">${player.highestScore}</span></span> `;
    scoreContainer.style.padding = 1 + 'rem';
    gameArea.classList.remove('hide');
    let scoreChieght = scoreContainer.getBoundingClientRect().height;
    let netHeight = window.innerHeight - scoreChieght - 2;
    gameArea.style.height = netHeight + 'px';
    let boundery = gameArea.getBoundingClientRect();
    gameBoundery.height = netHeight;
    gameBoundery.width = boundery.width;
    gameBoundery.top = boundery.top;
    gameBoundery.bottom = netHeight - 1;

    roadStickers();
    let myCar = document.createElement('div');
    myCar.setAttribute('class', 'car');
    myCar.style.backgroundColor = randColor();
    myCar.innerHTML = `<span class="car-name" style=color:${randColor()}>U</span>`;

    gameArea.appendChild(myCar);
    // console.log(myCar.offsetLeft, myCar.offsetTop)
    player.x = myCar.offsetLeft;
    player.y = myCar.offsetTop;
    player.width = myCar.offsetWidth;
    player.height = myCar.offsetHeight;
    enemyCar();

    let audioBox = document.createElement('div');
    let hornBox = document.createElement('div');
    let audioIcon = document.createElement('i');
    let hornIcon = document.createElement('i');
    audioBox.setAttribute('class', 'audio-holder');
    audioIcon.setAttribute('class', 'audio-img fas');
    hornBox.setAttribute('class', 'horn-holder');
    hornIcon.setAttribute('class', 'horn-img fas fa-bullhorn');
    hornBox.appendChild(hornIcon);
    hornBox.addEventListener('mouseover', hornOn);
    hornBox.addEventListener('mouseleave', hornOff);
    gameContainer.appendChild(hornBox);

    if (!audioKey.m) {
        audioIcon.classList.remove('fa-volume-mute');
        audioIcon.classList.add('fa-volume-down');
    } else {
        audioIcon.classList.remove('fa-volume-down');
        audioIcon.classList.add('fa-volume-mute');
    }
    audioBox.addEventListener('click', audioControl);
    audioBox.appendChild(audioIcon);
    gameContainer.appendChild(audioBox);

    bgMusic()
    window.requestAnimationFrame(carMove)
};

