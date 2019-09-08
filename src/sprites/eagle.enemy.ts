import * as Phaser from 'phaser-ce';
import * as Coordinates from '../interfaces/coordinates.interface';

export default class Frog extends Phaser.Sprite {
  type: any;
  targetCoord: any;
  speed: number;
  constructor ({ game, x, y, sprite } : {
    game: any, // Note: Phaser.Game, but cannot bind this to Phaser.Game type
    x: number,
    y: number,
    sprite: any
  }) {
    super(game, x, y, sprite);
    this.type = 'eagle';
    this.speed = 1.6;
    this.anchor.setTo(0.5);
    game.physics.arcade.enable(this);
    this.body.setSize(16, 13, 8, 20);
    //add animations
    this.animations.add('attack', Phaser.Animation.generateFrameNames('eagle/eagle-attack-', 1, 4, '', 0), 12, true);
    this.animations.play('attack');
    // tweens
    var VTween = game.add.tween(this).to({
        y: y + 20
    }, 1000, Phaser.Easing.Linear.None, true, 0, -1);
    VTween.yoyo(true);
  }
  checkDistanceToPLayer(coords: any, distance: number): boolean {
    return Math.sqrt(Math.pow(coords.x - this.x, 2) + Math.pow(coords.y - this.y, 2)) < distance;
  }
  isAbove():boolean {
    return this.y > this.targetCoord.y;
  }
  target(x:number, y:number) {
    this.targetCoord = {x: x, y: y};
  }
  move() {
    if (Math.round(this.x/10) != Math.round(this.targetCoord.x/10)) {
      this.x += -this.speed*this.scale.x;
      this.y += -this.speed*(+this.isAbove());
    }
  }
  update() {
    if (this.checkDistanceToPLayer(this.targetCoord, 200)) {
      if (this.x >= this.targetCoord.x) {
        this.scale.x = 1;
      } else {
        this.scale.x = -1;
      }
      this.move();
    }
  }
}
