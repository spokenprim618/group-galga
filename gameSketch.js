let state = 0;
let score =0;

//loading images
let playerImage, enemyImage, temp;
let groupAlien = [];
function preload(){
    playerImage  = loadImage("images/player.png");
    enemyImage = loadImage("images/enemy.png");
}
 


//Player Blueprint
class Player{ 
    constructor(x, y, image) {
        this.xPos = x;
        this.yPos = y;
        this.image = image;
    }
}
     

//Enemy blueprint
class Alien{
    constructor(x, y, image){
        this.xPos = x;
        this.yPos = y;
        this.image = image;
    }
}

//Title screen and initilizing aliens
function setup(){
    createCanvas(500, 500);
    background(0);
    for(let i=0; i<5; i++){
        temp = new Alien(i*75, 20, enemyImage);
        groupAlien.push(temp);
    }
}
let player = new Player(250, 400, playerImage);
function draw(){
    if(state==0){
        fill(255, 255, 255);
        text("GALAGA", 200, 200);
        fill(0, 255, 0);
        rect(250, 400, 100, 50);
        fill(0);
        text("START", 270, 420);
    }
    
    if(state==1){
        background(0);
        fill(0, 255, 0);
        rect(player.xPos, player.yPos, 50, 50);
        for(let i=0; i<groupAlien.length; i++){
        image(groupAlien[i].image, groupAlien[i].xPos, groupAlien[i].yPos, 50, 50);
        groupAlien[i].yPos += 3;
        }

    }
        //Players Controls
        if(keyIsDown(LEFT_ARROW)){
            player.xPos -= 3;   
           }
           if(keyIsDown(RIGHT_ARROW)){
            player.xPos += 3;   
           }
           if(keyIsDown(DOWN_ARROW)){
            player.yPos += 3;   
           }
           if(keyIsDown(UP_ARROW)){
            player.yPos -= 3;
           }

//stae 3 = game over screen
    if (state == 3){
        background(0);
        
        textSize(20);
        
        fill (220,220,220);
        
        rect (200,300,100,100);
        
        stroke(0,255,0);
        
        text("try again",240,350);
        
        fill(0);
        
        rect(200,400,100,100);
        
        text("main menu",240,450)
        
        stroke (255,0,0);
        
        text('GAME OVER',200,100);
        
        stroke(255,255,255);
        
        text(score, 200, 200);

        
    }
}

function mouseClicked(){
    //back to game 
if ((state == 3)&&mouseX > 200 && mouseX < 300 && mouseY>300 &&mouseY <400){
state = 1;
}

if((state==3)&&mouseX>200&&mouseX<300&&mouseY>400&&mouseY<500){
    state = 0;
}

//click START button to begin game
if((state==0)&&(mouseX>=250)&&(mouseX<=350)){
    background(0);
    state = 1;
}
}