import * as Phaser from 'phaser-ce';

export default class Player extends Phaser.Sprite {
  onLadder: boolean;
  constructor ({ game, x, y, sprite} : {
    game: any, // Note: Phaser.Game, but cannot bind this to Phaser.Game type
    x: number,
    y: number,
    sprite: any
  }) {
    super(game, x, y, sprite);
     this.anchor.setTo(0.5);
     this.game.physics.arcade.enable(this);
     this.body.gravity.y = 500;
     this.body.setSize(12, 16, 8, 16);
     this.game.add.sprite(x, y, sprite);
     //
     let animVel = 15;

     this.animations.add('idle', Phaser.Animation.generateFrameNames('player/idle/player-idle-', 1, 4, '', 0), animVel - 3, true);
     this.animations.add('run', Phaser.Animation.generateFrameNames('player/run/player-run-', 1, 6, '', 0), animVel, true);
     this.animations.add('jump', ['player/jump/player-jump-1'], 1, false);
     this.animations.add('fall', ['player/jump/player-jump-2'], 1, false);
     this.animations.add('crouch', Phaser.Animation.generateFrameNames('player/crouch/player-crouch-', 1, 2, '', 0), 10, true);
     this.animations.add('hurt', Phaser.Animation.generateFrameNames('player/hurt/player-hurt-', 1, 2, '', 0), animVel, true);
     this.animations.add('climb', Phaser.Animation.generateFrameNames('player/climb/player-climb-', 1, 2, '', 0), 0, true );
     this.animations.play('idle');
  }
  wasd = {
      jump: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
      crouch: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP)
  }
  hurt() {
    this.animations.play('hurt');
  }
  update() {
    let vel = 150;

    if (this.wasd.jump.isDown && this.body.onFloor()) {
        this.body.velocity.y = -270;
    }
    if (this.onLadder) {
      this.animations.play('climb').frame = 0;
      this.body.gravity.y = 0;
      if (this.wasd.up.isDown) {
        this.body.velocity.y = -vel;
        this.animations.play('climb');
      } else if (this.wasd.crouch.isDown){
        this.body.velocity.y = +vel;
        this.animations.play('climb');
      }
    }
    if (this.wasd.left.isDown) {
        this.body.velocity.x = -vel;
        this.animations.play('run');
        this.scale.x = -1;
    } else if (this.wasd.right.isDown) {
        this.body.velocity.x = vel;
        this.animations.play('run');
        this.scale.x = 1;
    } else {
        this.body.velocity.x = 0;
        if (this.wasd.crouch.isDown) {
            this.animations.play('crouch');
        } else {
            this.animations.play('idle');
        }

    }

    // jump animation
    if (this.body.velocity.y < 0) {
        this.animations.play('jump');
    } else if (this.body.velocity.y > 0) {
        this.animations.play('fall');
    }
  }
}
