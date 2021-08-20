var gameState = "start";
var ball, pp, cp;
var ballvel;
var cursor, cursorIMG;
var movementmode = "mouse";
var ps = 0;
var cs = 0;
var winS, looseS, bounceS;
function preload(){
    cursorIMG = loadImage('./cursor.png');
    winS = loadSound('./Audio/Win.wav');
    looseS = loadSound('./Audio/Loss.wav');
    // bounceS = loadSound('Audio/BounceSound.mp3');
}

function setup(){
    var canvas = createCanvas(400, 400);
    ball = createSprite(200,200, 20, 20);
    ball.shapeColor = rgb(255,255,255);

    pp = createSprite(380, 200, 20, 100);
    pp.shapeColor = rgb(255, 0, 0);

    cp = createSprite(20, 200, 20, 110);
    cp.shapeColor = rgb(255, 0, 0);
    cp.setCollider("rectangle", 0,0,25,115)
    var balldr = [-8, 8]
    var rand = Math.round(random(0, 1));
    console.log(rand);
    ballvel = balldr[rand];
    cursor = createSprite(200,200,20,20);
    cursor.addImage(cursorIMG);
    cursor.scale = 0.15;
    cursor.visible = false;
}

function reset() {
    ball.x = 200;
    ball.y = 200;
    ball.velocityX = 0;
    ball.velocityY = 0;
    gameState = "serve";
  }

function draw(){
    var edge = createEdgeSprites();
    background(0);
    if(gameState==="start"){
        textSize(25);
        //1 = 49; 2 = 50;
        if(movementmode==="mouse"){
            fill("white");
            text("1: Mouse", 75, 380);
            fill(127,127,127)
            text("2: Keys", 225, 380);
        }
        if(movementmode==="arrow"){
            fill(127,127,127);
            text("1: Mouse", 75, 380);
            fill("white")
            text("2: Keys", 225, 380);
        }

        if(keyDown(49)){movementmode = "mouse"}
        if(keyDown(50)){movementmode = "arrow"}

        fill("white");
        text("Press Space or click ", 85, 150);
        text("To Start", 150, 175);
        if(keyDown(32) || mouseDown()){
            ball.setVelocity(ballvel, ballvel);
            gameState="play";
        }
    }
    else if(gameState==="serve"){
        textSize(25)
        fill("white");
        text("Press Space or click ", 85, 150);
        text("To Start", 150, 175);
        textSize(20)
        fill("white");
        text(ps, 215, 25);
        text(cs, 185, 25);
        if(keyDown(32) || mouseDown()){
            ball.setVelocity(ballvel, ballvel);
            gameState="play";
        }
    }
    else if(gameState==="play"){
        textSize(20);
        fill("white");
        text(ps, 215, 25);
        text(cs, 185, 25);
        if(ball.isTouching(pp) || ball.isTouching(cp)){
          //  bounceS.play();
        }
        ball.bounceOff(edge[2]);
        ball.bounceOff(edge[3]);
        ball.bounceOff(cp);
        ball.bounceOff(pp);

        if(movementmode==="mouse"){
            pp.y = mouseY; 
            cursor.visible = true; 
            cursor.x = mouseX;
            cursor.y = mouseY;
        }
        else if(movementmode==="arrow"){
            arrowMovement(pp, 15);
            pp.bounceOff(edge[2]);
            pp.bounceOff(edge[3]); 
            cursor.visible = false
        }

        moveTo(cp, ball.y+random(5, -5), 6);
        if(ball.isTouching(edge[0])){
            console.log("CompLost");
            ps++;
            reset();
        }else if(ball.isTouching(edge[1])){
            console.log("PlayerLost");
            cs++;
            reset();
        }
        if(cs===5){
            looseS.play();
            gameState = "lost"
        }else if(ps===5){
            winS.play();
            gameState = "won"
        }
    }
    else if(gameState==="lost"){
        textSize(25);
        fill(255);
        text("!! You Lost !!", 130, 150);
        text("Press 'R' to restart", 100, 175)
        //82 = r
        if(keyDown(82)){
            gameState = "start";
            ps = 0;
            cs = 0;
            reset();
        }
    }
    else if(gameState==="won"){
        textSize(25);
        fill(255);
        text("!! You Won !!", 130, 150);
        text("Press 'R' to restart", 100, 175)
        //82 = r
        if(keyDown(82)){
            gameState = "start";
            ps = 0;
            cs = 0;
            reset();
        }
    }
    drawSprites();
}

function arrowMovement(sprite, speed){
    //38 = up;
    //40 = down;
    //w = 87
    //s = 83
    if(keyDown(38) || keyDown(87)){
        sprite.y-= speed;
    }
    if(keyDown(40) || keyDown(83)){
        sprite.y+= speed;
    }
}

function moveTo(sprite, y, speed){
    if(sprite){
        if(sprite.y> y){
            sprite.y-= speed;
        }else if(sprite.y< y){
            sprite.y+= speed;
        }else if(sprite.y=== y){
            sprite.y+= random(speed, -speed)
        }
    }
}