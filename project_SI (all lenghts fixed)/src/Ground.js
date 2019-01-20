//GROUND
var Ground = function(game,x,y,i){
    Phaser.Sprite.call(this,game,x,y,'ground');
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.scale.setTo(0.1,0.5);
    this.index = i;
}
Ground.prototype = Object.create(Phaser.Sprite.prototype);
Ground.prototype.constructor = Ground;
Ground.prototype.restart = function(game, x,y){
    this.reset(x,game.world.height+y);
    this.body.velocity.x= -200;

}
Ground.prototype.getX = function(){
    return this.world.x;
}

//TEXT
var Text = function(game, x, y, text){
    Phaser.Text.call(this,game,x, y, 'Gathering data...', { fontSize: '32px', fill: '#255' });
};

Text.prototype = Object.create(Phaser.Text.prototype);
Text.prototype.constructor = Text;
