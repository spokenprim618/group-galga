let state = 0;
let lives = 3;
let score = 0;
//loading images
let playerImage, enemyImage, temp, player, bullet, bulletImage;

let groupAlien = [];

let groupBullet = [];

function preload(){
    
    playerImage  = loadImage("images/player.png");
    
    enemyImage = loadImage("images/enemy.png");
    
    bulletImage= loadImage("images/bullet.png");
}
// blueprints for character alien and bullet 
class Bullet{ 
   
    constructor(x, y, image) {
        
        this.xPos = x;
        
        this.yPos = y;
        
        this.image = image;
    }
}


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
    
    createCanvas(1000, 640);
    
    background(0);
    
    player = new Player(250, 400, playerImage);

    for(let i=0; i<5; i++){
    
        temp = new Alien(i*75, 20, enemyImage);
    
        groupAlien.push(temp);
    
    }
    
}

function draw(){
    if(state==0){
        fill(255, 255, 255);
    
        text("GALAGA", 210, 100);
    
        text("Your score", 20, 20);
        
        text(score, 80,20);

        fill(0, 255, 0);
    
        rect(185, 190, 100, 50);
    
        fill(0);
    
        text("START", 215, 220);

    }
   
    if(state==1){
    
        background(0);
        
        fill(255,255,255);

        text("lives", 950, 20);

        text(lives, 980,20);

        image(player.image, player.xPos, player.yPos, 50, 50);
    
        for(let i=0; i<groupAlien.length; i++){
    
            image(groupAlien[i].image, groupAlien[i].xPos, groupAlien[i].yPos, 50, 50);
    
            groupAlien[i].yPos += 3;
            console.log(groupAlien.length);
           
            if(groupAlien[i].yPos>650){ 
     
                groupAlien[i].yPos=0;
     
                lives-=1;
                
                console.log(lives);
                return lives;
            }  
        
        }
        if(lives<=0){
           
            background(0);
            state=3;
           
        }
    }
        //Players Controls

        if(keyIsDown(LEFT_ARROW)){

            player.xPos -= 5;   

        }

        if(keyIsDown(RIGHT_ARROW)){

            player.xPos += 5;   

        }

        if(keyIsDown(DOWN_ARROW)){

            player.yPos += 5;   

        }

        if(keyIsDown(UP_ARROW)){

            player.yPos -= 5;

        }
    

        if(keyIsDown(32)){

            for(let i=0; i<1; i++){

                bullet = new Bullet(player.xPos,player.yPos,bulletImage);

                groupBullet.push(bullet);
            }

                for(let i=0; i<groupBullet.length; i++){

                    image(groupBullet[i].image, groupBullet[i].xPos, groupBullet[i].yPos, 50, 50);

                    groupBullet[i].yPos -= 3;
                }

        }
          
    
          
        //    if(bullet.yPos==0){

        //    }

//stae 3 = game over screen
    if (state == 3){
        fill(0);
        text("lives", 950, 20);

        text(lives, 980,20);
        rect (200,300,100,100);
        rect(200,400,100,100);
        fill(255, 255, 255);
        
        text("try again",240,350);
        
        text("main menu",240,450);
        
        text('GAME OVER',200,100);
        
        text(score, 200, 200);

    }
    //leaderboards
    if(state == 4){}
}



function mouseClicked(){
    //back to game 

    if ((state == 3)&&mouseX > 200 && mouseX < 300 && mouseY>300 &&mouseY <400){
background(0);
        state = 1;
        lives = 3;
  
}

if((state==3)&&mouseX>200&&mouseX<300&&mouseY>400&&mouseY<500){
    background(0);
    state = 0;
    

}

//click START button to begin game
if((state==0)&&(mouseX>=185)&&(mouseX<=285)&&(mouseY>=190)&&(mouseY<=240)){

    background(0);
    lives = 3;
    state = 1;
}
}