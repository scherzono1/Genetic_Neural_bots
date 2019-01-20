//jfuzzylogic
window.onload = function () {
    var game = new Phaser.Game(3000, 1300, Phaser.CANVAS, 'game');
    game.state.add('Main', App.Main);
    game.state.start('Main');
};

var App = {};
App.Main = function(game){

    this.NUMBER_OF_PLAYERS = 500;
    this.NUMBER_OF_GROUND = 30;
    this.STATE_INIT = 1;
    this.STATE_START = 2;
    this.STATE_PLAY = 3;
    this.STATE_GAMEOVER = 4;
    this.BARRIER_DISTANCE = 350;
    this.FRAMES_PER_JUMP = 15;
    this.SCROLL_SPEED = 150;
    this.MAX_HEIGHT = -50;
    this.RANDOM_MODE = 1;
    this.SIMPLE_MODE = 2;
    this.ULTRA_SIMPLE_MODE = 3;
    this.MODE = this.ULTRA_SIMPLE_MODE;


}

App.Main.prototype = {

    preload : function(){
        this.game.load.image('sky', 'assets/sky.png');
        this.game.load.image('ground', 'assets/platform.png');
        this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    },
    
    create : function(){
    
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.distanceVect = new Array(this.NUMBER_OF_GROUND);
    this.heightVect =  new Array(this.NUMBER_OF_GROUND);

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignVertically = true;
    this.scale.pageAlignHorizontally = true;
    this.skyBox = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sky');

    this.skyBox.autoScroll(-this.SCROLL_SPEED, 0);

    this.game.stage.disableVisibilityChange = true;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1300;


    //GA
   this.GA = new GeneticAlgorithm(this.NUMBER_OF_PLAYERS, this.NUMBER_OF_PLAYERS*0.2); //(population, top who evolve)
    //GROUND
    this.groundGroup = this.game.add.group();
    this.groundGroup.enableBody = true;
    this.distanceVect[0] = 100;
    this.heightVect[0] = -10;
    for(var i = 0; i <this.NUMBER_OF_GROUND; i++){
        this.groundGroup.add( new Ground(this.game,0,0,i));
       if(i != 0) { this.distanceVect[i] = ( this.randomBetween(this.BARRIER_DISTANCE-100 ,this.BARRIER_DISTANCE+50) ); 
                    this.heightVect[i] = ( this.randomBetween( this.MAX_HEIGHT , -10 ) )


       }
    }

    //PLAYER

    this.playerGroup = this.game.add.group();
    for(var i = 0; i < this.NUMBER_OF_PLAYERS; i++){
        this.playerGroup.add(new Player(this.game,0,0,i,this.FRAMES_PER_JUMP));
    }

    
    this.myPlayer = this.playerGroup.getChildAt(0);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);

    
    this.textGroup = this.game.add.group();

    this.BestFitnessText = new Text(this.game,100,100, 'Player');
    this.GeneticText = new Text(this.game,100,200, 'Player');
    this.textGroup.add(this.BestFitnessText);
    this.textGroup.add(this.GeneticText);


    this.state = this.STATE_INIT;

    this.doubleJump = 0;
    this.jumpkey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    },

    
    update : function(){   

switch(this.state){   
   
    case this.STATE_INIT: // init genetic algorithm

                this.GA.reset();
                this.GA.createPopulation();
        
                this.state = this.STATE_START;
                break;  


    case this.STATE_START:        

           

            var i0 = 0;
            this.groundGroup.getAt(0).restart(this.game, 10, -10);
            this.groundGroup.forEach(function(ground){
                    if(i0!=0 && this.MODE == this.SIMPLE_MODE)
                        ground.restart(this.game, this.groundGroup.getAt(ground.index-1).world.x + this.distanceVect[i0], this.heightVect[i0]);
                    else if (i0!=0 && this.MODE == this.RANDOM_MODE) 
                        ground.restart(this.game, this.groundGroup.getAt(ground.index-1).world.x 
                        + this.randomBetween(this.BARRIER_DISTANCE-100 ,this.BARRIER_DISTANCE+50),  this.randomBetween( this.MAX_HEIGHT , -10 ) );
                    else if (i0!=0 && this.MODE == this.ULTRA_SIMPLE_MODE)
                        ground.restart(this.game, this.groundGroup.getAt(ground.index-1).world.x
                        + this.BARRIER_DISTANCE, -10);
                    //ground.restart(this.game, (i0*this.BARRIER_DISTANCE)*0.8 + Math.random()*0.5*this.BARRIER_DISTANCE);
                    i0++; 
            }, this);
            
            this.firstGround = this.groundGroup.getAt(0);
            this.lastGround = this.groundGroup.getAt(this.groundGroup.length -1);
            this.targetGround = this.groundGroup.getAt(0);;
                       
            this.playerGroup.forEach(function(player){
                player.restart(this.game,this.GA.iteration);
            },this);

            //UPDATE GA!!!!

            this.state = this.STATE_PLAY;
                        break;

    case this.STATE_PLAY:


            //TEXT LOOP
     

            if (this.firstGround.world.x < -this.firstGround.width){
                        if(this.MODE == this.SIMPLE_MODE)   
                            this.firstGround.restart(this.game, this.lastGround.world.x 
                                                    + this.distanceVect[this.firstGround.index],this.heightVect[this.firstGround.index]);  
                        else if (this.MODE == this.RANDOM_MODE)  
                            this.firstGround.restart(this.game, this.lastGround.world.x 
                                                    +this.randomBetween(this.BARRIER_DISTANCE-100 ,this.BARRIER_DISTANCE+50),
                                                     this.randomBetween( this.MAX_HEIGHT , -10 )); 

                        else if (this.MODE == this.ULTRA_SIMPLE_MODE)
                            this.firstGround.restart(this.game, this.lastGround.world.x
                                                    +this.BARRIER_DISTANCE, -10);
                        
                        this.firstGround = this.getNextBarrier(this.firstGround.index);
                        this.lastGround = this.getNextBarrier(this.lastGround.index);
                        }

           //PLAYER LOOP
            this.playerGroup.forEachAlive(function(player){
                if(player.frameCount<this.FRAMES_PER_JUMP && player.doubleJump != 0 ) 
                    player.frameCount++;
                    

                player.fitness = player.score;
                
                if(player.body.bottom >= this.world.bounds.bottom){
                    this.onDeath(player);
                } 
                this.game.physics.arcade.collide(player, this.groundGroup, this.nextTarget, null, this);

                player.distToTarget = this.game.physics.arcade.distanceBetween(player, this.groundGroup.getAt(player.objectiveIndex));
                indexMinusOne = player.objectiveIndex-1 < 0 ? this.NUMBER_OF_GROUND-1 : player.objectiveIndex-1;
                player.distToBorder =  this.groundGroup.getAt( indexMinusOne  ).world.x - player.world.x + this.groundGroup.getAt(indexMinusOne).width/2 ; //THIS NEEDS TWEAKING
                player.distToBorder = player.distToBorder < 0 ? 0 : player.distToBorder;
                player.heightDist = (this.game.world.height-58 - player.world.y );
                player.distToNextTarget = this.game.physics.arcade.distanceBetween(player, this.groundGroup.getAt((player.objectiveIndex+1)%this.NUMBER_OF_GROUND));
                player.distToNextNextTarget = this.game.physics.arcade.distanceBetween(player, this.groundGroup.getAt((player.objectiveIndex+2)%this.NUMBER_OF_GROUND));
                player.heightToNextBorder = this.groundGroup.getAt( player.objectiveIndex  ).world.y - player.world.y - 48;
                player.heightToNextNextBorder =  this.groundGroup.getAt( (player.objectiveIndex+1)%this.NUMBER_OF_GROUND ).world.y - player.world.y - 48;
                if (player.body.touching.down){
                    player.doubleJump=0;
                    player.frameCount=0;
                }
                if (player.alive && player.index != 0 ) this.GA.activateBrain(player,this.textGroup.getAt(1),player.distToBorder,player.distToTarget,player.heightDist
                                                                              ,player.heightToNextBorder);

                if(player.isBest || this.playerGroup.countLiving() == 1) this.textGroup.getAt(0).text = 'Current Best Player Index: ' + player.index
                    + ' fitness: ' + player.fitness;


            },this);




            if(this.resetKey.isDown){
                this.restartGame();

            }
             if(this.pauseKey.isDown){
                this.game.paused = !this.game.paused; }
            
                if (this.cursors.left.isDown)
                {
                    this.myPlayer.moveLeft();
                }
                else if (this.cursors.right.isDown)
                {
                    this.myPlayer.moveRight();
                }
                    else
                {
                    this.myPlayer.stopAll();
                } 

                if(this.cursors.up.isDown){
                    this.myPlayer.jump();
                }
            
               break;

    case this.STATE_GAMEOVER:    
                this.GA.evolvePopulation();
                this.GA.iteration++;
                this.state = this.STATE_START;
                break;

        }//end switch
    },//end update
    restartGame : function(){
        this.state = this.STATE_INIT;
    },
    getNextBarrier : function(index){
        return this.groundGroup.getAt((index + 1) % this.NUMBER_OF_GROUND);
    },
    nextTarget : function(player,ground){
        if (  player.objectiveIndex == ground.index ){  
            player.objectiveIndex = (player.objectiveIndex + 1)%this.NUMBER_OF_GROUND;
            player.score+=10;
        }
        if (  (player.objectiveIndex + 1)%this.NUMBER_OF_GROUND == ground.index) {
            player.score+=20;
            player.objectiveIndex = (player.objectiveIndex + 2)%this.NUMBER_OF_GROUND;       
        }
        if (  (player.objectiveIndex + 2)%this.NUMBER_OF_GROUND == ground.index) {
            player.score+=30;
            player.objectiveIndex = (player.objectiveIndex + 3)%this.NUMBER_OF_GROUND;       
        }
    },
    onDeath : function(player){
            this.GA.Population[player.index].fitness = player.fitness;
            this.GA.Population[player.index].score = player.score;
                        
            player.death();
            if (this.playerGroup.countLiving() == 0) { this.state = this.STATE_GAMEOVER; }
        },
    randomBetween : function(min,max){
        return  ( (Math.random()*(max-min))+ min  );
    }

}//end Main







