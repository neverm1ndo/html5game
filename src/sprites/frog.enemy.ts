import * as Phaser from 'phaser-ce';

export default class Frog extends Phaser.Sprite {
  frogTimer: any;
  type: any;
  side: string = 'right';
  frogJumpSide: string = 'left';
  constructor ({ game, x, y, sprite} : {
    game: any, // Note: Phaser.Game, but cannot bind this to Phaser.Game type
    x: number,
    y: number,
    sprite: any
  }) {
    super(game, x, y, sprite);
    this.type = 'frog';
    this.anchor.setTo(0.5);
    game.physics.arcade.enable(this);
    this.body.gravity.y = 500;
    this.body.setSize(16, 16, 8, 11);

    this.animations.add('idle', Phaser.Animation.generateFrameNames('frog/idle/frog-idle-', 1, 4, '', 0), 6, true);
    this.animations.add('jump', ['frog/jump/frog-jump-1'], 6, false);
    this.animations.add('fall', ['frog/jump/frog-jump-2'], 6, false);
    this.animations.play('idle');

    this.body.velocity.x = 60 * game.rnd.pick([1, -1]);
    this.body.bounce.x = 1;
    this.frogTimer = game.time.create(false);
    this.frogTimer.loop(2000, this.switchFrogJump, this);
    this.frogTimer.start();
  }

  switchFrogJump () {
      this.frogJumpSide = (this.frogJumpSide == 'left') ? 'right' : 'left';
  }

  update() {
    if (this.side == 'left' && this.frogJumpSide == 'right') {
        this.scale.x = 1;
        this.side = 'right';
        this.body.velocity.y = -200;
        this.body.velocity.x = -100;
    } else if (this.side == 'right' && this.frogJumpSide == 'left') {
        this.scale.x = -1;
        this.side = 'left';
        this.body.velocity.y = -200;
        this.body.velocity.x = 100;
    } else if (this.body.onFloor()) {
        this.body.velocity.x = 0;
    }
    // animations
    if (this.body.velocity.y < 0) {
        this.animations.play('jump');
    } else if (this.body.velocity.y > 0) {
        this.animations.play('fall');
    } else {
        this.animations.play('idle');
    }
  }
}
