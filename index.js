// some constant based on html divs 
const score = document.querySelector('.score');
const StartScreen = document.querySelector('.startScreen-button');
const gameArea = document.querySelector('.gameArea');
       
// some objects      
let player ={ speed: 5, score: 0, start: false, score: 0};
let keys = {ArrowUp:false, ArrowDown:false, ArrowRight: false, ArrowLeft:false};

//some event listeners
StartScreen.addEventListener('click', start);
document.addEventListener('keydown', pressOn);
document.addEventListener('keyup', pressOff);

// functions
function pressOn(e){
    e.preventDefault();
    keys[e.key]=true;
}

function pressOff(e){
    e.preventDefault();
    keys[e.key]=false;
}


function moveLines(){
    let lines = document.querySelectorAll('.line');
    lines.forEach( function (item) {
        if(item.y > 750){   // if line margin top becomes > 750, move them back up. (lines originally start at 150px margin top)
            item.y -=750
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';  // basically move lines down at speed of 5px/ frame
    });
}


function moveEnemies(car){
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach( function (enemy) {

        if(isCollide(car,enemy)){
            console.log('HIT')
            endGame();
        }
        if(enemy.y > 550){
            enemy.y -=950
            enemy.style.left = Math.floor(Math.random()*150) + 'px';
            enemy.style.backgroundColor = randomColor();
        }
        enemy.y += player.speed;
        enemy.style.top = enemy.y + 'px';
    });
}


function isCollide(a, b){
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        (aRect.bottom < bRect.top) ||
        (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right)
        
    )
}

function randomColor (){
    function c(){
        let hex = Math.floor(Math.random()*256).toString(16);
        return ('0'+ String(hex)).substr(-2)
    }
    return "#"+c()+c()+c()       
}

function playGame(){
    let car = document.querySelector('.car');
    let road = gameArea.getBoundingClientRect();
    console.log(road)

    moveLines();
    moveEnemies(car);
    
    if(player.start){

        StartScreen.classList.remove('hide');

        if(keys.ArrowUp && player.y > road.top - 110){
            player.y -=player.speed} // allow the player to move up by decreasing margin-top
        
        if(keys.ArrowDown && player.y < road.bottom){
            player.y +=player.speed}

        if(keys.ArrowLeft && player.x >0){
            player.x -=player.speed}

        if(keys.ArrowRight && player.x < (road.width-50)){
            player.x +=player.speed}
        
        car.style.left = player.x + 'px';
        car.style.top = player.y + 'px';

        player.score++;
        score.innerText = `Score: ${player.score}`;

        window.requestAnimationFrame(playGame);
        
    }
}       

function endGame() {
    player.start= false;
    score.innerText = `Game Over! Score was ${player.score}`
}


function start(){

    StartScreen.classList.add('hide');
    gameArea.classList.remove('hide');
    gameArea.innerHTML="";

    // create lines
    for(let x=0; x<5; x++){
        let div = document.createElement('div');
        div.classList.add('line');
        div.y = x*150;  //(y is an attribute of a object div we are creating)
        div.style.top = (x*150) + 'px'; // here we set css of line to div.y, .style.top = margin-top
        gameArea.appendChild(div);
    }

    // create car
    let car = document.createElement('div');
    car.setAttribute('class', 'car')
    car.style.top = '200px';
    car.style.left = '80px';
    gameArea.appendChild(car);
 
    // create enemies 
    for(let x=0; x<3; x++){
        let enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = ((x+1)*600)*-1;
        enemy.style.top = enemy.y + 'px';
        enemy.style.left = Math.floor(Math.random()*150)
            + 'px';
        enemy.style.backgroundColor= randomColor();
        gameArea.appendChild(enemy);
    }

    // set up player vals

    player.start = true;
    player.score = 0;
    player.x= car.offsetLeft;
    player.y = car.offsetTop;

    window.requestAnimationFrame(playGame);
}

