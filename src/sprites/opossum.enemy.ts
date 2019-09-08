import * as Phaser from 'phaser-ce';

export default class Opossum extends Phaser.Sprite {
  type: any;
  constructor ({ game, x, y, sprite} : {
    game: any, // Note: Phaser.Game, but cannot bind this to Phaser.Game type
    x: number,
    y: number,
    sprite: any
  }) {
    super(game, x, y, sprite);
    this.type = 'opossum';
    this.anchor.setTo(0.5);
    game.physics.arcade.enable(this);
    this.body.gravity.y = 500;
    this.body.setSize(16, 13, 8, 15);

    this.animations.add('run', Phaser.Animation.generateFrameNames('opossum/opossum-', 1, 6, '', 0), 12, true);
    this.animations.play('run');
    this.body.velocity.x = 60 * game.rnd.pick([1, -1]);
    this.body.bounce.x = 1;
  }
  update() {
    if (this.body.velocity.x < 0) {
        this.scale.x = 1;
    } else {
        this.scale.x = -1;
    }
  }
}
