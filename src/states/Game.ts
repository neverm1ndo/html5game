declare var __DEV__: string;

import * as Phaser from 'phaser-ce'
import Platforms from '../sprites/platforms'
import Player from '../sprites/player'
import Opossum from '../sprites/opossum.enemy'
import Frog from '../sprites/frog.enemy'
import Eagle from '../sprites/eagle.enemy'

export default class extends Phaser.State {
  ladders: Phaser.Group;
  hurtTimer: any;
  animDeath: Phaser.Animation;
  enemyDeath: Phaser.Sprite;
  enemies: Phaser.Group;
  playerSprite: Phaser.Sprite;
  layer: Phaser.TilemapLayer;
  map: Phaser.Tilemap;
  platforms: Platforms;
  bg: Phaser.TileSprite;
  middle: Phaser.TileSprite;
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  player: Player;
  hurtFlag: boolean = false;

  init () {
    this.stage.backgroundColor = '#47f3ff';
  }
  preload () {
    this.load.image('sky', 'assets/environment/back.png');
    this.load.image('middle', 'assets/environment/middle.png');
    this.load.tilemap('map', 'assets/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tileset', 'assets/environment/tileset.png');
    this.load.atlasJSONArray('atlas', 'assets/atlas/atlas.png', 'assets/atlas/atlas.json');
    this.load.atlasJSONArray('atlas-props', 'assets/atlas/atlas-props.png', 'assets/atlas/atlas-props.json');
  }

  checkAgainstEnemies (player: Player, enemy: any) {
      if ((player.y + player.body.height * .5 < enemy.y ) && player.body.velocity.y > 0) {

          this.createEnemyDeath(enemy.x, enemy.y);
          enemy.kill();
          player.body.velocity.y = -200;
      } else {
          this.hurtPlayer();
      }

  }

  hurtPlayer () {
      // if (this.hurtFlag) {
      //     return;
      // }
      // this.hurtFlag = true;
      this.player.body.velocity.y = -100;

      this.player.body.velocity.x = (this.player.scale.x == 1) ? -100 : 100;
  }

  resetHurt() {
    this.hurtFlag = false;
  }

  createEnemyDeath(x: number, y: number) {
      this.enemyDeath = this.add.sprite(x, y, 'atlas');
      this.enemyDeath.anchor.setTo(0.5);
      this.animDeath = this.enemyDeath.animations.add('dead', Phaser.Animation.generateFrameNames('enemy-death/enemy-death-', 1, 6, '', 0), 16, false);
      this.enemyDeath.animations.play('dead');
      this.animDeath.onComplete.add(function () {
          this.enemyDeath.kill();
      }, this);
  }

  createOpossum(x: number, y: number) {
    this.enemies.add(new Opossum({
      game: this.game,
      x: x,
      y: y,
      sprite: 'atlas',
    }));
  }
  createFrog(x: number, y: number) {
    this.enemies.add(new Frog({
      game: this.game,
      x: x,
      y: y,
      sprite: 'atlas',
    }));
  }
  createEagle(x: number, y: number) {
    this.enemies.add(new Eagle({
      game: this.game,
      x: x,
      y: y,
      sprite: 'atlas'
    }));
  }

  createPlayer(x: number, y:number) {
    this.player = new Player({
      game: this.game,
      x: x,
      y: y,
      sprite: 'atlas'
    });
    this.add.existing(this.player);
  }
  isOnLadder() {
    this.player.onLadder = true;
  }

  create () {
        this.bg = this.add.tileSprite(0, 0, this.width, this.height, 'sky');
        this.middle = this.add.tileSprite(0, 80, this.width, this.height, 'middle');
        this.bg.fixedToCamera = true;
        this.middle.fixedToCamera = true;
        // tilemap
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('tileset');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
        // which tiles collide
        this.map.setCollision([27, 29, 31, 33, 35, 37, 77, 81, 86, 87, 127, 129, 131, 133, 134, 135, 83, 84, 502, 504, 505, 529, 530, 333, 335, 337, 339, 366, 368, 262, 191, 193, 195, 241, 245, 291, 293, 295]);

        this.add.image(31 * 16, 4 * 16 + 3, 'atlas-props', 'tree');
        this.add.image(48 * 16, 3 * 16 + 5, 'atlas-props', 'house');
        this.add.image(10 * 16, 8 * 16 + 4, 'atlas-props', 'bush');
        this.add.image(11 * 16, 19 * 16 - 4, 'atlas-props', 'sign');
        this.add.image(15 * 16, 19 * 16 + 6, 'atlas-props', 'skulls');
        this.add.image(23 * 16, 19 * 16, 'atlas-props', 'face-block');
        this.add.image(28 * 16, 20 * 16, 'atlas-props', 'shrooms');

        //add ladders group
        this.ladders = this.add.group();
        this.ladders.enableBody = true;
        // this.ladders.add();
        //add enemies group
        this.enemies = this.add.group();
        this.enemies.enableBody = true;

        //spawn player prefab
        this.createPlayer(40, 40);

        //spawn enemies
        this.createFrog(600, 100);
        this.createFrog(500, 100);
        this.createEagle(600, 100);
        this.createOpossum(400, 90);
        this.createOpossum(450, 90);

        //set camera and timers
        this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
        this.hurtTimer = this.time.create(false);
        this.hurtTimer.loop(500, this.resetHurt, this);
    }



  update() {
    this.physics.arcade.collide(this.player, this.layer);
    this.physics.arcade.collide(this.enemies, this.layer);
    this.physics.arcade.overlap(this.player, this.enemies, this.checkAgainstEnemies, null, this);
    this.physics.arcade.overlap(this.player, this.ladders, this.isOnLadder, null, this);
    this.enemies.children.forEach((enemy:any)=> {
      if (enemy.type == 'eagle') {
        enemy.target(this.player.x, this.player.y);
      }
    })
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.player, 10, 20);
      this.game.debug.spriteBounds(this.map.getTile(256, 258, 'Tile Layer 1', true), "#f00", false)
     }
  }
}
