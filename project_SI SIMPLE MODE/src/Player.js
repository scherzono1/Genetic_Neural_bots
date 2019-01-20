//PLAYER
var Player = function(game,x,y,index,FRAMES_PER_JUMP){
    
    this.index = index;
    this.score = 0;
    Phaser.Sprite.call(this,game,0,y,'dude');
    this.game.physics.arcade.enableBody(this);
    this.body.gravity.y = 300;
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.fitness = 0;
    this.fitness_prev  = 0;
    this.score_prev = 0;
    this.objectiveIndex = 1;
    this.distToTarget = 0;
    this.distToNextTarget = 0;
    this.distToNextNextTarget = 0;
    this.distToBorder = 0;
    this.heightDist = 0;
    this.alpha = 1;
    this.doubleJump = 0;
    this.frameCount = 0;
    this.FRAMES_PER_JUMP = FRAMES_PER_JUMP;
    this.heightToNextBorder = 0;
    this.heightToNextNextBorder = 0;
    this.isBest = false;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.jump = function(){
        if ( this.doubleJump == 0 ) {
                if(this.index != 0 )this.body.velocity.y = -400;
                else this.body.velocity.y = -400;
                this.doubleJump++;  }
        else if (this.doubleJump == 1 && this.frameCount >= this.FRAMES_PER_JUMP)
        {
                this.body.velocity.y = -400;
                this.doubleJump++;

        }

}
Player.prototype.moveRight = function(){
    this.body.velocity.x = 180;
    this.animations.play('right');
}
Player.prototype.moveLeft = function(){
    this.body.velocity.x = -180;
    this.animations.play('left');
}
Player.prototype.stopAll = function(){
        this.animations.stop();
        this.frame = 4;
        this.body.velocity.x = 0;
}
Player.prototype.restart = function(game,iteration){
    
    this.reset(0,game.world.height-60);

    this.fitness_prev = (iteration == 1) ? 0 : this.fitness;
    this.fitness = 0;

    this.score_prev = (iteration == 1) ? 0 : this.score; 
    this.score = 0;
    this.alpha = 1;
    this.bestPlayer = false;
    this.objectiveIndex = 1;
    this.distToTarget = 0;
    this.distToNextTarget = 0;
    this.distToBorder = 0;
    this.heightDist = 0;
    this.distToNextNextTarget = 0;
    this.frameCount = 0;
    this.heightToNextBorder = 0;
    this.heightToNextNextBorder = 0;
    this.isBest = false;

}
Player.prototype.death = function(){
    this.alpha = 0.5;
    this.score -=20;
    this.kill();
};
Player.prototype.stop = function(){
    this.body.velocity.x = 0;
}
