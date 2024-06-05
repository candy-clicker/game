/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 594:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

if ((typeof localStorage === "undefined" ? "undefined" : _typeof(localStorage)) === 'object') {
  try {
    localStorage.setItem('localStorage_SAFARITEST', 1);
    localStorage.removeItem('localStorage_SAFARITEST');
  } catch (e) {
    Storage.prototype._setItem = Storage.prototype.setItem;

    Storage.prototype.setItem = function () {};
  }
}

JinnDash = {};
/*if (document.addEventListener) {
  document.addEventListener();
} else {

}*/

JinnDash.Background = function () {
  Phaser.Group.call(this, game);
  bg = this;
  this.bitmapDrawGroup = game.make.group();
  this.bg_left = game.make.image(-1, 0, 'background_left');
  this.bg_left.anchor.setTo(1, 0);
  this.bg_left2 = game.make.image(-639, 0, 'background_right');
  this.bg_left2.anchor.setTo(1, 0);
  this.bg_right = game.make.image(641, 0, 'background_right');
  this.bg_right2 = game.make.image(1278, 0, 'background_left');
  this.bg_center = game.make.image(-1, 0, 'background_back');
  this.border_left = game.make.image(-1, 0, 'ssheet', 'border_l');
  this.border_left.anchor.setTo(1, 0);
  this.border_right = game.make.image(641, 0, 'ssheet', 'border_r');
  this.bitmapDrawGroup.addMultiple([this.bg_left, this.bg_center, this.bg_right, this.border_left, this.border_right, this.bg_left2, this.bg_right2]);
  this.bitmapData = game.make.bitmapData(1920, game.height);
  this.bitmapDataImg = this.bitmapData.addToWorld();
  this.resize();
  this.gate = game.make.image(320, 480, 'background_gate');
  this.gate.anchor.setTo(0.5, 0.5);
  this.shakeObj = {
    shakeArray: [],
    shakeIndex: 0,
    active: false,
    start: function start() {
      this.active = true;
      this.shakeIndex = -1;
    },
    update: function update() {
      if (!this.active) return 0;else {
        this.shakeIndex++;

        if (this.shakeIndex == 19) {
          this.active = false;
        }

        return this.shakeArray[this.shakeIndex];
      }
    }
  };

  for (var i = 0; i < 20; i++) {
    this.shakeObj.shakeArray[i] = -1 + Math.random() * 2;
  }

  this.addMultiple([this.bitmapDataImg, this.gate]);
};

JinnDash.Background.prototype = Object.create(Phaser.Group.prototype);
JinnDash.Background.constructor = JinnDash.Background;

JinnDash.Background.prototype.update = function () {
  this.gate.angle = this.shakeObj.update();
};

JinnDash.Background.prototype.shake = function () {
  this.shakeObj.start();
};

JinnDash.Background.prototype.resize = function () {
  this.bitmapDrawGroup.visible = true;
  this.bitmapData.resize(game.width, game.height);
  this.bitmapData.clear();
  var offset = game.world.bounds.x * -1;
  this.bitmapDrawGroup.forEach(function (child) {
    child.x += offset;
  });
  this.bitmapData.drawGroup(this.bitmapDrawGroup);
  this.bitmapDrawGroup.forEach(function (child) {
    child.x -= offset;
  });
  this.bitmapDrawGroup.visible = false;
  this.bitmapDataImg.x = game.world.bounds;
};

JinnDash.Ball = function () {
  Phaser.Sprite.call(this, game, 0, 0, 'newgfx', 'ball');
  this.state = game.state.getCurrentState();
  this.blockGrid = this.state.blockGrid;
  this.rocket = this.state.rocket;
  this.anchor.setTo(0.5, 0.5);
  this.vel_x = 0;
  this.vel_y = 0;
  this.prev_x = 0;
  this.prev_y = 0;
  this.touching = {
    ld: false,
    rd: false,
    lu: false,
    ru: false
  };
  this.sticky = {
    caught: false,
    position: 0
  };
  this.fire = {
    active: false,
    hp: 5,
    animStep: 0,
    animEvery: 3
  };
  this.combo = 0;
  this.collRect = new Phaser.Rectangle(0, 0, 26, 26);
  this.init_speed = game.settings.ballInitSpeed;
  this.speed = this.init_speed;
  this.spdMultiplier = 1;
  JinnDash.SB.caughtBooster.add(function (booster) {
    if (!this.alive) return;

    if (booster.type == "faster") {
      this.spdMultiplier = 1.25;
      this.state.bgEffects.verySmallFlare(this.x, this.y);
    } else if (booster.type == "slower") {
      this.spdMultiplier = 0.75;
      this.state.bgEffects.verySmallFlare(this.x, this.y);
    } else if (booster.type == "fire") {
      this.changeIntoFire();
    } else {
      this.spdMultiplier = 1;
    }

    if (booster.type != 'fire' && this.fire.active) {
      this.turnOffFire();
    }
  }, this);
  this.kill();
};

JinnDash.Ball.prototype = Object.create(Phaser.Sprite.prototype);
JinnDash.Ball.prototype.constructor = JinnDash.Ball;

JinnDash.Ball.prototype.init = function (x, y, angle, spd) {
  this.revive();
  var spd = spd || this.init_speed;
  this.x = x;
  this.y = y;
  this.prev_x = this.x;
  this.prev_y = this.y;
  this.spdMultiplier = 1;
  this.sticky.caught = false;
  this.fire.active = false;
  this.combo = 0;
  this.vel_x = Utils.lengthdir_x(angle, spd);
  this.vel_y = Utils.lengthdir_y(angle, spd);
  this.speed = spd;
  this.loadTexture('newgfx', 'ball');
  this.bomb = false;
};

JinnDash.Ball.prototype.changeIntoFire = function () {
  this.state.bgEffects.verySmallFlare(this.x, this.y);
  this.loadTexture('ssheet', 'ball_bomb');
  this.fire.active = true;
  this.fire.hp = 5;
};

JinnDash.Ball.prototype.turnOffFire = function () {
  this.state.bgEffects.verySmallFlare(this.x, this.y);
  this.fire.active = false;
  this.loadTexture('newgfx', 'ball');
};

JinnDash.Ball.prototype.changeIntoBomb = function () {
  this.bomb = true;
  this.loadTexture('ssheet', 'ball_bomb');
  this.parent.onBombCreate.dispatch(this);
};

JinnDash.Ball.prototype.update = function () {
  if (!this.alive) return;
  if (this.state.pause) return;
  this.prev_x = this.x;
  this.prev_y = this.y;

  if (this.sticky.caught) {
    this.updateSticky();
  } else {
    var currentSpeed = this.speed * this.spdMultiplier;

    if (currentSpeed < 25) {
      this.updateStep(0.5);
      this.updateStep(0.5);
    } else if (this.spd < 50) {
      this.updateStep(0.25);
      this.updateStep(0.25);
      this.updateStep(0.25);
      this.updateStep(0.25);
    } else {
      this.updateStep(0.20);
      this.updateStep(0.20);
      this.updateStep(0.20);
      this.updateStep(0.20);
      this.updateStep(0.20);
    }
  }

  if (this.fire.active && ++this.fire.animStep % this.fire.animEvery == 0) {
    JinnDash.SB.fxFireParticle.dispatch(this.x + this.vel_x * -0.7, this.y + this.vel_y * -0.7);
  }
};

JinnDash.Ball.prototype.updateStep = function (multiplier) {
  if (!this.alive) return;
  this.x += this.vel_x * multiplier * this.state.timeflow * this.spdMultiplier;
  this.y += this.vel_y * multiplier * this.state.timeflow * this.spdMultiplier;
  this.checkBoundries();
  this.checkBlockCollisions();
  this.collRect.x = this.x - this.collRect.halfWidth;
  this.collRect.y = this.y - this.collRect.halfHeight;
  this.scale.setTo(Math.max(1, this.scale.x - 0.03 * multiplier));
  this.collWithRocket(this.rocket);

  if (this.y > game.height) {
    this.kill();
    this.parent.onBallDestroyed.dispatch(this);
  }
};

JinnDash.Ball.prototype.updateSticky = function () {
  this.x = this.rocket.x + this.rocket.collRect.halfWidth * this.sticky.position;
};

JinnDash.Ball.prototype.hit = function () {
  game.sfx['hit_' + game.rnd.between(1, 3)].play();
  this.speed += game.settings.ballSpeedIncreaseAfterEachBounce;
  this.speed = Math.min(game.settings.ballMaxSpeed, this.speed);
  this.randomizeAngle();
  this.scale.setTo(1.4); //this.emitter.explode(500, 10)
};

JinnDash.Ball.prototype.randomizeAngle = function () {
  var angle = this.getAngle();

  if (angle <= 180 && angle > 140) {
    angle -= 3;
  } else if (angle >= 0 && angle < 40) {
    angle += 3;
  } else if (angle < -160) {
    angle += 3;
  } else if (angle < 0 && angle > -20) {
    angle -= 3;
  }

  this.setVelocityByAngle(angle, this.speed);
};

JinnDash.Ball.prototype.getAngle = function () {
  return game.math.radToDeg(game.math.angleBetween(0, 0, this.vel_x, this.vel_y));
};

JinnDash.Ball.prototype.setVelocityByAngle = function (angle, speed) {
  this.vel_x = Utils.lengthdir_x(angle, speed, false);
  this.vel_y = Utils.lengthdir_y(angle, speed, false);
};

JinnDash.Ball.prototype.checkBoundries = function () {
  if (this.x - this.collRect.halfWidth < 0 || this.x + this.collRect.halfHeight > 640) {
    this.x = game.math.clamp(this.x, 8, 632);
    this.vel_x *= -1;
    this.hit();
  }

  if (this.y - this.collRect.halfHeight < 0) {
    this.y = game.math.clamp(this.y, 8, 517);
    this.vel_y *= -1;
    this.hit();
  }
};

JinnDash.Ball.prototype.checkBlockCollisions = function () {
  this.x_r = Math.floor(this.x + this.collRect.halfHeight);
  this.x_l = Math.floor(this.x - this.collRect.halfHeight);
  this.y_u = Math.floor(this.y - this.collRect.halfWidth);
  this.y_d = Math.floor(this.y + this.collRect.halfWidth);
  this.updateTouching();
  var numberOfCollisions = this.countCollisions();

  if (numberOfCollisions == 4) {
    this.x = this.prev_x + this.vel_x * -0.5;
    this.y = this.prev_y + this.vel_x * -0.5;
    return;
  }

  return this.resolveCollisions(numberOfCollisions);
};

JinnDash.Ball.prototype.checkRocketCollisions = function () {
  PlaySys.rocketDispenser.forEachAlive(this.collWithRocket, this);
};

JinnDash.Ball.prototype.updateTouching = function () {
  this.touching.ld = this.blockGrid.checkPosition(this.x_l, this.y_d);
  this.touching.rd = this.blockGrid.checkPosition(this.x_r, this.y_d);
  this.touching.lu = this.blockGrid.checkPosition(this.x_l, this.y_u);
  this.touching.ru = this.blockGrid.checkPosition(this.x_r, this.y_u);
};

JinnDash.Ball.prototype.countCollisions = function () {
  var result = 0;
  if (this.touching.ld) result++;
  if (this.touching.rd) result++;
  if (this.touching.lu) result++;
  if (this.touching.ru) result++;
  return result;
};

JinnDash.Ball.prototype.collWithRocket = function (rocket) {
  if (this.collRect.intersects(rocket.collRect)) {
    this.combo = 0;
    this.y = rocket.y - this.collRect.halfHeight;

    if (rocket.sticky) {
      rocket.stickyBalls.push(this);
      JinnDash.SB.fxStickyParticle.dispatch(this.x, this.y);
      this.sticky.caught = true;
      this.sticky.position = (this.x - rocket.x) / rocket.collRect.halfWidth;
    } else {
      var offset = (this.x - rocket.x) / rocket.collRect.halfWidth;
      var new_angle = 0;

      if (offset > 0) {
        new_angle = 90 - offset * 80;
      } else {
        new_angle = 90 + Math.abs(offset) * 80;
      }

      new_angle = game.math.clamp(new_angle, 10, 170);
      this.vel_x = Utils.lengthdir_x(new_angle, this.init_speed, false);
      this.vel_y = Utils.lengthdir_y(new_angle, this.init_speed, false) * -1;
      this.hit();
    }
  }
};

JinnDash.Ball.prototype.launchFromSticky = function () {
  if (!this.sticky.caught) return;
  this.sticky.caught = false;
  var new_angle = this.sticky.position > 0 ? 90 - this.sticky.position * 80 : 90 + Math.abs(this.sticky.position) * 80;
  new_angle = game.math.clamp(new_angle, 10, 170);
  this.vel_x = Utils.lengthdir_x(new_angle, this.init_speed, false);
  this.vel_y = Utils.lengthdir_y(new_angle, this.init_speed, false) * -1;
};

JinnDash.Ball.prototype.resolveCollisions = function (collision_number) {
  if (collision_number == 0) {
    return false;
  } else if (collision_number == 1) {
    this.resolve1coll();
  } else if (collision_number == 2) {
    this.resolve2coll();
  } else if (collision_number == 3) {
    this.resolve3coll();
  }

  return true;
};

JinnDash.Ball.prototype.resolve1coll = function () {
  if (this.touching.rd) {
    if (this.vel_x < 0 && this.vel_y > 0) {
      this.collDown(this.touching.rd);
    } else if (this.vel_x > 0 && this.vel_y < 0) {
      this.collRight(this.touching.rd);
    } else {
      var offset_x = this.touching.rd.left - this.x;
      var offset_y = this.touching.rd.top - this.y;

      if (offset_x < offset_y) {
        this.collDown(this.touching.rd);
      } else {
        this.collRight(this.touching.rd);
      }
    }

    this.hitBlock(1, this.touching.rd);
  }

  if (this.touching.ld) {
    if (this.vel_x < 0 && this.vel_y < 0) {
      this.collLeft(this.touching.ld);
    } else if (this.vel_x > 0 && this.vel_y > 0) {
      this.collDown(this.touching.ld);
    } else {
      var offset_x = this.x - this.touching.ld.right;
      var offset_y = this.touching.ld.top - this.y;

      if (offset_x < offset_y) {
        this.collDown(this.touching.ld);
      } else {
        this.collLeft(this.touching.ld);
      }
    }

    this.hitBlock(1, this.touching.ld);
  }

  if (this.touching.ru) {
    if (this.vel_x < 0 && this.vel_y < 0) {
      this.collUp(this.touching.ru);
    } else if (this.vel_x > 0 && this.vel_y > 0) {
      this.collRight(this.touching.ru);
    } else {
      var offset_x = this.touching.ru.left - this.x;
      var offset_y = this.y - this.touching.ru.bottom;

      if (offset_x < offset_y) {
        this.collUp(this.touching.ru);
      } else {
        this.collRight(this.touching.ru);
      }
    }

    this.hitBlock(1, this.touching.ru);
  }

  if (this.touching.lu) {
    if (this.vel_x < 0 && this.vel_y > 0) {
      this.collLeft(this.touching.lu);
    } else if (this.vel_x > 0 && this.vel_y < 0) {
      this.collUp(this.touching.lu);
    } else {
      var offset_x = this.x - this.touching.lu.right;
      var offset_y = this.y - this.touching.lu.bottom;

      if (offset_x < offset_y) {
        this.collUp(this.touching.lu);
      } else {
        this.collLeft(this.touching.lu);
      }
    }

    this.hitBlock(1, this.touching.lu);
  }
};

JinnDash.Ball.prototype.resolve2coll = function () {
  if (this.touching.lu && this.touching.ru) {
    this.collUp(this.touching.lu);
    this.hitClosestH(1, this.touching.lu, this.touching.ru);
    return;
  }

  if (this.touching.ld && this.touching.rd) {
    this.collDown(this.touching.ld);
    this.hitClosestH(1, this.touching.ld, this.touching.rd);
    return;
  }

  if (this.touching.lu && this.touching.ld) {
    this.collLeft(this.touching.lu);
    this.hitClosestH(1, this.touching.lu, this.touching.ld);
    return;
  }

  if (this.touching.rd && this.touching.ru) {
    this.collRight(this.touching.rd);
    this.hitClosestH(1, this.touching.rd, this.touching.ru);
    return;
  }

  if (this.touching.lu && this.touching.rd) {
    if (this.vel_x > 0 && this.vel_y < 0) {
      this.collRight(this.touching.rd);
      this.collUp(this.touching.lu);
    } else {
      this.collLeft(this.touching.lu);
      this.collDown(this.touching.rd);
    }

    this.hitBoth(1, this.touching.lu, this.touching.rd);
  }

  if (this.touching.ld && this.touching.ru) {
    if (this.vel_x < 0 && this.vel_y < 0) {
      this.collLeft(this.touching.ld);
      this.collUp(this.touching.ru);
    } else {
      this.collRight(this.touching.ru);
      this.collDown(this.touching.ld);
    }

    this.hitBoth(1, this.touching.ld, this.touching.ru);
  }
};

JinnDash.Ball.prototype.resolve3coll = function () {
  //this.x = this.prev_x;
  //this.y = this.prev_y;
  //this.vel_x *= -1;
  //this.vel_y *= -1;
  if (this.touching.lu && this.touching.rd) {
    if (this.vel_x > 0 && this.vel_y < 0) {
      this.collRight(this.touching.rd);
      this.collUp(this.touching.lu);
    } else {
      this.collLeft(this.touching.lu);
      this.collDown(this.touching.rd);
    }

    this.hitBoth(1, this.touching.lu, this.touching.rd);
  }

  if (this.touching.ld && this.touching.ru) {
    if (this.vel_x < 0 && this.vel_y < 0) {
      this.collLeft(this.touching.ld);
      this.collUp(this.touching.ru);
    } else {
      this.collRight(this.touching.ru);
      this.collDown(this.touching.ld);
    }

    this.hitBoth(1, this.touching.ld, this.touching.ru);
  }
};

JinnDash.Ball.prototype.collRight = function (block) {
  if (this.fire.active && this.fire.hp > 1 && !block.indestructable) return;
  this.x = block.left - this.collRect.halfWidth - 1;
  this.vel_x *= -1;
};

JinnDash.Ball.prototype.collLeft = function (block) {
  if (this.fire.active && this.fire.hp > 1 && !block.indestructable) return;
  this.x = block.right + this.collRect.halfWidth + 1;
  this.vel_x *= -1;
};

JinnDash.Ball.prototype.collUp = function (block) {
  if (this.fire.active && this.fire.hp > 1 && !block.indestructable) return;
  this.y = block.bottom + this.collRect.halfHeight + 1;
  this.vel_y *= -1;
};

JinnDash.Ball.prototype.collDown = function (block) {
  if (this.fire.active && this.fire.hp > 1 && !block.indestructable) return;
  this.y = block.top - this.collRect.halfHeight - 1;
  this.vel_y *= -1;
};

JinnDash.Ball.prototype.hitClosestV = function (dmg, block1, block2) {
  if (Math.abs(block1.y - this.y) < Math.abs(block2.y - this.y)) {
    this.hitBlock(dmg, block1);
  } else {
    this.hitBlock(dmg, block2);
  }
};

JinnDash.Ball.prototype.hitClosestH = function (dmg, block1, block2) {
  if (Math.abs(block1.x - this.x) < Math.abs(block2.x - this.x)) {
    this.hitBlock(dmg, block1);
  } else {
    this.hitBlock(dmg, block2);
  }
};

JinnDash.Ball.prototype.hitBlock = function (dmg, block) {
  if (this.bomb) {
    this.hit();
    game.sfx.explosion_2.play(); //PlaySys.bgEffects.halo(this.x,this.y);

    block.hit(999, this);
    var cellCord = this.blockGrid.findCellXY(block);
    var cell_x = cellCord[0];
    var cell_y = cellCord[1];
    this.tryHitCell(cell_x - 2, cell_y, 1);
    this.tryHitCell(cell_x + 2, cell_y, 1);
    this.tryHitCell(cell_x, cell_y - 2, 1);
    this.tryHitCell(cell_x, cell_y + 2, 1);
    this.tryHitCell(cell_x - 1, cell_y - 1, 2);
    this.tryHitCell(cell_x - 1, cell_y + 1, 2);
    this.tryHitCell(cell_x + 1, cell_y + 1, 2);
    this.tryHitCell(cell_x + 1, cell_y - 1, 2);
    this.tryHitCell(cell_x - 1, cell_y, 3);
    this.tryHitCell(cell_x + 1, cell_y, 3);
    this.tryHitCell(cell_x, cell_y - 1, 3);
    this.tryHitCell(cell_x, cell_y + 1, 3);
    this.state.fade.alpha = 0;
    game.add.tween(this.state.fade).from({
      alpha: 0.6
    }, 500, Phaser.Easing.Sinusoidal.In, true);
    this.loadTexture('newgfx', 'ball');
    this.state.bg.shake();
    this.bomb = false;
    this.parent.onBombExplosion.dispatch(this);
  } else if (this.fire.active) {
    block.hit(999, this);
    this.fire.hp--;
    this.fire.active = this.fire.hp > 0;
    if (!this.fire.active) this.loadTexture('newgfx', 'ball');
  } else {
    block.hit(dmg, this);
    this.hit();
  }
};

JinnDash.Ball.prototype.hitBoth = function (dmg, block1, block2) {
  this.hitBlock(dmg, block1);
  block2.hit(dmg, this);
};

JinnDash.Ball.prototype.tryHitCell = function (cell_x, cell_y, dmg) {
  var block = this.blockGrid.getCellXY(cell_x, cell_y);
  if (block) block.hit(dmg, this);
};

JinnDash.BallArrow = function (x, y, ballDispenser) {
  Phaser.Sprite.call(this, game, x, y, 'ssheet', 'ball_26');
  this.anchor.setTo(0.5);
  this.active = true;
  this.state = game.state.getCurrentState();
  this.tapToStartTxt = new JinnDash.OneLineText2(0, -70, 'font', game.lang.getText('Tap to start'), 40, 400, 0.5, 0.5);
  this.addChild(this.tapToStartTxt);
  game.add.tween(this.tapToStartTxt).to({
    alpha: 0.35
  }, 400, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
  this.ballDispenser = ballDispenser; //this.arrowTween = game.add.tween(this.arrowImg).to({angle: -170},800,Phaser.Easing.Cubic.InOut,true,0,-1,true);
  //this.addChild(this.arrowImg);

  this.state = game.state.getCurrentState();
  this.inputEnabled = true;
  this.hitArea = new Phaser.Circle(0, 0, 280); //this.input.useHandCursor = true;

  this.events.onInputDown.add(this.tryToLaunch, this);
  this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.space.onDown.add(this.tryToLaunch, this); //this.stop();
};

JinnDash.BallArrow.prototype = Object.create(Phaser.Sprite.prototype);
JinnDash.BallArrow.constructor = JinnDash.BallArrow;

JinnDash.BallArrow.prototype.update = function () {
  if (!this.alive) return;
  if (this.state.pause) return;
  this.alpha = Math.min(1, this.alpha + 0.03);
  if (this.alpha < 0.9) return;

  if (!this.state.rocket.lockedInput && (this.state.rocket.x < 300 || this.state.rocket.x > 340)) {
    this.launch();
    this.stop();
  }
};

JinnDash.BallArrow.prototype.start = function () {
  this.alpha = 0;
  this.active = true;
  game.sfx.whoosh.play();
  this.revive();
  this.state.helper.show = true;
};

JinnDash.BallArrow.prototype.stop = function () {
  this.active = false;
  this.kill();
  this.state.helper.show = false;
};

JinnDash.BallArrow.prototype.launch = function () {
  this.ballDispenser.initBall(this.x, this.y, -90 + (Math.random() * 8 - 4));
  this.state.bgEffects.verySmallFlare(this.x, this.y);
  this.stop();
};

JinnDash.BallArrow.prototype.tryToLaunch = function () {
  if (!this.active) return;
  if (this.state.pause) return;
  if (!this.alive) return;
  this.launch();
};

JinnDash.BallDispenser = function () {
  Phaser.Group.call(this, game);
  this.arrow = new JinnDash.BallArrow(320, 650, this);
  game.add.existing(this.arrow);
  this.state = game.state.getCurrentState();
  this.aliveBalls = 0;
  this.bombBalls = 0;
  this.onBallCreated = new Phaser.Signal();
  this.onBallDestroyed = new Phaser.Signal();
  this.onBombCreate = new Phaser.Signal();
  this.onBombExplosion = new Phaser.Signal();
  this.onAllBallsDestroyed = new Phaser.Signal();
  this.onBallDestroyed.add(function (ball) {
    this.aliveBalls--;
    this.state.bgEffects.makeSplash(ball.x);
    game.sfx.lost_ball.play();

    if (this.getFirstAlive() == null) {
      this.onAllBallsDestroyed.dispatch();
      JinnDash.SB.onAllBallsDestroyed.dispatch();
    }
  }, this);
  this.onBallCreated.add(function () {
    this.aliveBalls++;
    game.sfx.launch_ball.play();
  }, this);
  this.onBombCreate.add(function () {
    this.bombBalls++;
  }, this);
  this.onBombExplosion.add(function () {
    this.bombBalls--;
  }, this);
  JinnDash.SB.caughtBooster.add(function (booster) {
    if (booster.type == "extraBall") {
      this.initBall(booster.x, booster.y, (10 + Math.random() * 160) * -1);
    }
  }, this);
};

JinnDash.BallDispenser.prototype = Object.create(Phaser.Group.prototype);
JinnDash.BallDispenser.constructor = JinnDash.BallDispenser;

JinnDash.BallDispenser.prototype.initBall = function (x, y, angle, spd) {
  this.onBallCreated.dispatch();
  var freeBall = this.getFirstDead() || this.add(new JinnDash.Ball());
  if (freeBall == null) return;
  freeBall.init(x, y, angle, spd);
};

JinnDash.BallDispenser.prototype.arrowStart = function () {
  this.arrow.start();
};

JinnDash.BallDispenser.prototype.getHighestBall = function () {
  var highest_ball = null;
  var highest_y = 960;
  this.forEachAlive(function (child) {
    if (child.y < highest_y) {
      highest_y = child.y;
      highest_ball = child;
    }
  });
  return highest_ball;
};

JinnDash.BgEffects = function () {
  this.emitter = game.add.emitter(0, 0, 10);
  this.emitter.makeParticles('ssheet', 'flare');
  this.emitter.setSize(0, 0);
  this.emitter.setXSpeed(0, 0);
  this.emitter.setYSpeed(0, 0);
  this.emitter.setRotation(-10, 10);
  this.emitter.setScale(1, 2, 1, 2, 200);
  this.splash = game.add.group();

  for (var i = 0; i < 3; i++) {
    var spl = game.add.image(0, 960, 'ssheet', 'ball_splash');
    spl.anchor.setTo(0.5, 1);
    spl.kill();
    this.splash.add(spl);
  }
};

JinnDash.BgEffects.prototype.bigFlare = function (x, y) {
  this.emitter.setScale(2, 3.5, 2, 3.5, 200);
  this.emitter.setXSpeed(0, 0);
  this.emitter.setYSpeed(-0, 0);
  this.emitter.setAlpha(1, 0, 300);
  this.emitter.emitX = x;
  this.emitter.emitY = y;
  this.emitter.explode(200, 1);
};

JinnDash.BgEffects.prototype.medFlare = function (x, y) {
  this.emitter.setScale(1.5, 2, 1.5, 2, 200);
  this.emitter.setXSpeed(0, 0);
  this.emitter.setYSpeed(-0, 0);
  this.emitter.setAlpha(1, 0, 300);
  this.emitter.emitX = x;
  this.emitter.emitY = y;
  this.emitter.explode(200, 1);
};

JinnDash.BgEffects.prototype.smallFlare = function (x, y) {
  this.emitter.setScale(1, 1.5, 1, 1.5, 200);
  this.emitter.setXSpeed(0, 0);
  this.emitter.setYSpeed(-0, 0);
  this.emitter.setAlpha(1, 0, 300);
  this.emitter.emitX = x;
  this.emitter.emitY = y;
  this.emitter.explode(200, 1);
};

JinnDash.BgEffects.prototype.verySmallFlare = function (x, y) {
  this.emitter.setScale(1, 1, 1, 1, 200);
  this.emitter.setXSpeed(0, 0);
  this.emitter.setYSpeed(0, 0);
  this.emitter.setAlpha(1, 0, 150);
  this.emitter.emitX = x;
  this.emitter.emitY = y;
  this.emitter.explode(100, 1);
};

JinnDash.BgEffects.prototype.makeSplash = function (x) {
  var splash = this.splash.getFirstDead();
  if (splash == null) return;
  splash.revive();
  splash.alpha = 1;
  splash.x = x;
  splash.scale.setTo(0.5, 0);
  this.bigFlare(x, 960);
  game.add.tween(splash.scale).to({
    x: 1.25,
    y: 1.75
  }, 400, Phaser.Easing.Exponential.Out, true).onComplete.add(function () {
    splash.kill();
  });
  game.add.tween(splash).to({
    alpha: 0
  }, 400, Phaser.Easing.Sinusoidal.Out, true);
};

JinnDash.Block = function (x, y, width, height, nr, cellX, cellY) {
  this.hp = this.hpArray[nr - 1];
  this.state = game.state.getCurrentState();
  Phaser.Sprite.call(this, game, x, y);

  if (nr < 6) {
    JinnDash.changeTexture(this, 'brick_' + nr + '_' + this.hp);
  } else {
    JinnDash.changeTexture(this, 'brick_' + nr);
  }

  if (nr == 7) {
    this.tickImg = game.add.image(40, 16, 'newgfx', 'brick_7_tick');
    this.tickImg.anchor.setTo(0.5, 1);
    this.tickImg.angle = Math.floor(Math.random() * 360);
    game.add.tween(this.tickImg).to({
      angle: this.tickImg.angle + 360
    }, 2000, Phaser.Easing.Linear.None, true, 0, -1);
    this.addChild(this.tickImg);
  }

  this.cellX = cellX;
  this.cellY = cellY;
  this.nr = nr;
  this.bomb = nr == 7;
  this.indestructable = nr == 6;
  this.left = x;
  this.right = x + width;
  this.top = y;
  this.bottom = y + height;
  this.centerX = x + width * 0.5;
  this.centerY = y + height * 0.5;
  this.blockBounce = false;
};

JinnDash.Block.prototype = Object.create(Phaser.Sprite.prototype);
JinnDash.Block.constructor = JinnDash.Block;

JinnDash.Block.prototype.hit = function (dmg, ball) {
  if (this.indestructable) return;
  if (this.bomb) return this.hitBomb(ball);
  this.hp -= dmg;

  if (this.hp <= 0) {
    this.shatter(ball);
  } else {
    this.bounce();
    this.loadTexture('blocks', 'brick_' + this.nr + '_' + this.hp);
  }
};

JinnDash.Block.prototype.hitBomb = function (ball) {
  var toHit = [this.parent.getCellXY(this.cellX - 1, this.cellY), this.parent.getCellXY(this.cellX + 1, this.cellY), this.parent.getCellXY(this.cellX, this.cellY - 1), this.parent.getCellXY(this.cellX, this.cellY + 1), this.parent.getCellXY(this.cellX + 1, this.cellY + 1), this.parent.getCellXY(this.cellX - 1, this.cellY + 1), this.parent.getCellXY(this.cellX - 1, this.cellY - 1), this.parent.getCellXY(this.cellX + 1, this.cellY - 1)];
  this.shatter(ball);
  toHit.forEach(function (block, index) {
    if (block) {
      block.hit(index < 4 ? 2 : 1, ball);
    }
  });
};

JinnDash.Block.prototype.piecePosition = [[], [[61, 24], [11, 27], [30, 25], [51, 27], [11, 19], [11, 9], [24, 11], [40, 12], [59, 8], [69, 13]], [[40, 14], [12, 25], [28, 25], [48, 25], [66, 26], [9, 12], [27, 11], [42, 13], [67, 21], [68, 9]], [[57, 16], [12, 27], [30, 27], [45, 26], [62, 27], [13, 19], [12, 7], [23, 11], [37, 14], [53, 15]], [[64, 14], [13, 25], [34, 25], [51, 24], [64, 27], [11, 15], [13, 10], [30, 12], [41, 12], [61, 11]], [[65, 14], [14, 26], [32, 25], [45, 26], [60, 26], [65, 25], [13, 16], [15, 11], [28, 13], [49, 14]]];
JinnDash.Block.prototype.hpArray = [4, 5, 2, 1, 3];

JinnDash.Block.prototype.shatter = function (ball) {
  if (this.indestructable) return this.shatterIndestructable(ball);
  if (this.bomb) return this.shatterBomb(ball);
  var freePiece;

  for (var i = 0; i < 10; i++) {
    freePiece = this.parent.shatteredPieces.getFirstDead();
    if (freePiece == null) break;
    freePiece.init(this.x + this.piecePosition[this.nr][i][0], this.y + this.piecePosition[this.nr][i][1], 'brick_' + this.nr + '_part_0' + i, ball);
  }

  var chance = game.incentivise ? game.settings.chanceForCoinsFromBrick : game.settings.chanceForCoinsFromBrickWhenNotIncentivise;

  if (Math.random() < chance) {
    if (this.state.doubleCoins) {
      this.parent.dropCoin(this.x + 25, this.y + 20);
      this.parent.dropCoin(this.x + 55, this.y + 20);
    } else {
      this.parent.dropCoin(this.x + 40, this.y + 20);
    }
  }

  game.sfx.explosion_1.play();
  this.kill();
  ball.combo++;
  this.parent.onBlockDestroyed.dispatch(this);
  JinnDash.SB.onBrickDestroyed.dispatch(this, ball);
  this.destroy();
};

JinnDash.Block.prototype.shatterIndestructable = function (ball) {
  game.sfx.explosion_1.play();
  this.kill();
  ball.combo++;
  this.parent.onBlockDestroyed.dispatch(this);
  JinnDash.SB.onBrickDestroyed.dispatch(this, ball);
  this.destroy();
};

JinnDash.Block.prototype.shatterBomb = function (ball) {
  this.state.bg.shake();
  JinnDash.SB.fxExplosion.dispatch(this.x + 40, this.y + 18);
  game.sfx.explosion_1.play();
  this.kill();
  ball.combo++;
  this.parent.onBlockDestroyed.dispatch(this);
  JinnDash.SB.onBrickDestroyed.dispatch(this, ball);
  this.destroy();
};

JinnDash.Block.prototype.bounce = function () {
  if (!this.blockBounce) {
    var freePiece = this.parent.bounceBlocks.getFirstDead();
    if (freePiece == null) return;
    this.blockBounce = freePiece;
  }

  this.blockBounce.bounce(this.x, this.y, this.nr, this.hp + 1, this);
};

JinnDash.BlockBounce = function () {
  Phaser.Image.call(this, game, 0, 0, null);
  this.anchor.setTo(0.5);
  this.kill();
  this.sTween = false;
  this.aTween = false;
};

JinnDash.BlockBounce.prototype = Object.create(Phaser.Image.prototype);
JinnDash.BlockBounce.constructor = JinnDash.BlockBounce;

JinnDash.BlockBounce.prototype.bounce = function (x, y, nr, hp, block) {
  if (this.sTween) {
    this.sTween.stop();
  }

  if (this.aTween) this.aTween.stop();
  this.x = x + 40;
  this.y = y + 20;
  this.loadTexture('blocks', 'brick_' + nr + '_' + hp);
  this.scale.setTo(1, 1);
  this.alpha = 1;
  this.revive();
  this.block = block;
  this.sTween = game.add.tween(this.scale).to({
    x: 1.3,
    y: 1.3
  }, 150, Phaser.Easing.Cubic.Out, true, 0, 0, true);
  this.sTween.onComplete.add(function () {
    this.kill();
    if (this.block) this.block.blockBounce = false;
  }, this);
  this.aTween = game.add.tween(this).to({
    alpha: 0
  }, 300, Phaser.Easing.Sinusoidal.In, true);
};

JinnDash.BlockGrid = function () {
  Phaser.Group.call(this, game); //this.makeEmptyGrid(8,5);

  this.state = game.state.getCurrentState();
  this.block_w = 80;
  this.block_h = 35;
  this.margin_l = 0;
  this.margin_t = 100;
  this.fillRandom();
  this.bounceBlocks = game.add.group();
  this.shatteredPieces = game.add.group();
  this.coins = game.add.group();

  for (var i = 0; i < 40; i++) {
    if (i < 5) {
      var coin = game.make.image(0, 0, 'ssheet', 'coin_small');
      coin.anchor.setTo(0.5);
      coin.s = 1;

      coin.update = function () {
        this.scale.setTo(this.s);
      };

      coin.kill();
      this.coins.add(coin);
    }

    if (i < 10) {
      this.bounceBlocks.add(new JinnDash.BlockBounce());
    }

    this.shatteredPieces.add(new JinnDash.BlockPiece());
  }

  this.onBlockDestroyed = new Phaser.Signal();
  this.onAllBlockDestroyed = new Phaser.Signal();
  this.onBlockDestroyed.add(function (block) {
    this.state.bgEffects.smallFlare(block.x + 40, block.y + 18);

    if (this.getFirstAlive() == null) {
      this.onAllBlockDestroyed.dispatch();
      JinnDash.SB.onAllBricksDestroyed.dispatch();
    }
  }, this);
  this.goalAchieved = false;
  this.blockDestroyTimer = 30;
  JinnDash.SB.onGoalAchieved.add(function () {
    this.goalAchieved = true;
  }, this);
};

JinnDash.BlockGrid.prototype = Object.create(Phaser.Group.prototype);
JinnDash.BlockGrid.constructor = JinnDash.BlockGrid;

JinnDash.BlockGrid.prototype.update = function () {
  if (this.goalAchieved && this.children.length > 0 && this.blockDestroyTimer-- == 0) {
    this.blockDestroyTimer = 30;
    var blockToDestroy = this.children[Math.floor(Math.random() * this.children.length)];
    blockToDestroy.shatter({
      x: blockToDestroy.x + 40,
      y: blockToDestroy.y + 18,
      combo: 0
    });
  }
};

JinnDash.BlockGrid.prototype.makeEmptyGrid = function (width, height) {
  result = [];

  for (var w = 0; w < width; w++) {
    result[w] = [];

    for (var h = 0; h < height; h++) {
      result[w][h] = false;
    }
  }

  return result;
};

JinnDash.BlockGrid.prototype.calcProp = function () {
  this.grid_w = this.grid.length;
  this.grid_h = this.grid[0].length;
  this.margin_l = (640 - this.grid_w * this.block_w) * 0.5;
};

JinnDash.BlockGrid.prototype.loadLevel = function (levelArray) {
  var xx, yy;
  this.grid = this.makeEmptyGrid(levelArray.length, levelArray[0].length);
  this.calcProp();
  levelArray.forEach(function (collumn, x) {
    collumn.forEach(function (el, y) {
      if (!el) return;
      xx = this.margin_l + x * this.block_w;
      yy = this.margin_t + y * this.block_h;
      this.grid[x][y] = new JinnDash.Block(xx, yy, this.block_w, this.block_h, el, x, y);
      this.add(this.grid[x][y]);
    }, this);
  }, this);
};

JinnDash.BlockGrid.prototype.fillRandom = function (width, height) {
  var xx, yy;

  for (var w = 0; w < this.grid_w; w++) {
    for (var h = 0; h < this.grid_h; h++) {
      xx = this.margin_l + w * this.block_w;
      yy = this.margin_t + h * this.block_h;
      this.grid[w][h] = new JinnDash.Block(xx, yy, this.block_w, this.block_h, game.rnd.between(1, 5));
      this.add(this.grid[w][h]);
    }
  }
};

JinnDash.BlockGrid.prototype.checkPosition = function (x, y) {
  if (x > this.margin_l && x < this.margin_l + this.grid_w * this.block_w && y > this.margin_t && y < this.margin_t + this.grid_h * this.block_h) {
    var xx = Math.floor((x - this.margin_l) / this.block_w);
    var yy = Math.floor((y - this.margin_t) / this.block_h);

    if (this.grid[xx][yy]) {
      return this.grid[xx][yy].alive ? this.grid[xx][yy] : false;
    } else {
      return false;
    }
  }

  return false;
};

JinnDash.BlockGrid.prototype.exportLevel = function () {
  expArray = this.makeEmptyGrid(this.grid.length, this.grid[0].length);
  this.grid.forEach(function (coll, x) {
    coll.forEach(function (el, y) {
      if (el == false) {
        expArray[x][y] = 0;
      } else {
        expArray[x][y] = el.nr;
      }
    });
  }, this);
  console.log(JSON.stringify(expArray));
  return expArray;
};

JinnDash.BlockGrid.prototype._inRange = function (x, y) {
  if (x > this.margin_l && x < this.margin_l + this.grid_w * this.block_w && y > this.margin_t && y < this.margin_t + this.grid_h * this.block_h) {
    var xx = Math.floor((x - this.margin_l) / this.block_w);
    var yy = Math.floor((y - this.margin_t) / this.block_h);
    return [xx, yy, this.margin_l + xx * this.block_w, this.margin_t + yy * this.block_h];
  }

  return false;
};

JinnDash.BlockGrid.prototype.findCellXY = function (block) {
  var result;
  this.grid.forEach(function (coll, x) {
    coll.forEach(function (cell, y) {
      if (cell === block) result = [x, y];
    });
  });
  return result;
};

JinnDash.BlockGrid.prototype.getCellXY = function (c_x, c_y) {
  if (c_x < 0 || c_x >= this.grid_w) return false;
  if (c_y < 0 || c_y >= this.grid_h) return false;
  return this.grid[c_x][c_y].alive ? this.grid[c_x][c_y] : false;
};

JinnDash.BlockGrid.prototype.dropCoin = function (x, y) {
  var coin = this.coins.getFirstDead();
  if (coin == null) return;
  game.sfx.coin.play();
  coin.revive();
  coin.x = x;
  coin.y = y;
  coin.s = 1;
  coin.angle = -30;
  coin.alpha = 1;
  game.add.tween(coin).to({
    y: coin.y - 70,
    s: 1.3,
    angle: 30
  }, 700, Phaser.Easing.Quadratic.Out, true);
  game.add.tween(coin).to({
    alpha: 0
  }, 300, Phaser.Easing.Sinusoidal.In, true, 400).onComplete.add(function () {
    JinnDash.player.coin += game.settings.coinsFromBrick;
    JinnDash.saveGame();
    coin.kill();
  });
};

JinnDash.BlockPiece = function (x, y, width, height, nr) {
  Phaser.Image.call(this, game, 0, 0, null);
  this.anchor.setTo(0.5);
  this.state = game.state.getCurrentState();
  this.velX = 0;
  this.velY = 0;
  this.velR = 0;
  this.grav = 0.7;
  this.timeflow = 1;
  this.kill();
};

JinnDash.BlockPiece.prototype = Object.create(Phaser.Image.prototype);
JinnDash.BlockPiece.constructor = JinnDash.BlockPiece;

JinnDash.BlockPiece.prototype.update = function () {
  if (!this.alive) return;
  this.timeflow = this.state.timeflow;
  this.x += this.velX * this.timeflow;
  this.y += this.velY * this.timeflow;
  this.velY += this.grav * this.timeflow;
  this.rotation += this.velR * this.timeflow;
  this.alpha -= 0.015 * this.timeflow;

  if (this.x < 0 || this.x > 640) {
    this.x = game.math.clamp(this.x, 2, 638);
    this.velX *= -1;
    this.velR *= -1;
  }

  if (this.y < 0) {
    this.y = 2;
    this.velY *= -1;
    this.velR *= -1;
  }

  if (this.alpha <= 0) this.kill();
};

JinnDash.BlockPiece.prototype.init = function (x, y, sprite, explodePosition) {
  this.revive();
  this.x = x;
  this.y = y;
  this.alpha = 1;
  this.loadTexture('blocks', sprite);
  this.velX = -10 + Math.random() * 20;
  this.velY = Math.random() * -20;
  this.velR = Math.random() * 0.4;
};

JinnDash.Booster = function () {
  Phaser.Image.call(this, game);
  this.kill();
  this.state = game.state.getCurrentState();
  this.rocket = this.state.rocket;
  this.anchor.setTo(0.5);
  this.active = false;
  this.collW = 78;
  this.collH = 46;
  this.collRect = new Phaser.Rectangle(0, 0, this.collW, this.collH);
  this.spd = game.settings.boosterFallingSpeed;
};

JinnDash.Booster.prototype = Object.create(Phaser.Image.prototype);
JinnDash.Booster.prototype.types = [0, 'faster', 'slower', 'laser', 'narrower', 'fire', 'wider', 'sticky', 'extraBall', 'doubleCoins'];

JinnDash.Booster.prototype.update = function () {
  if (!this.alive) return;
  this.y += this.spd * this.state.timeflow;
  this.collRect.x = this.x - this.collW * 0.5;
  this.collRect.y = this.y - this.collH * 0.5;
  if (this.active) this.checkColl();

  if (this.y > game.height + this.collH) {
    this.kill();
  }
};

JinnDash.Booster.prototype.checkColl = function () {
  if (this.collRect.intersects(this.rocket.collRect)) {
    game.sfx.launch_ball.play();
    this.active = false;
    this.spd = 0;
    game.add.tween(this.scale).to({
      x: 0,
      y: 0
    }, 400, Phaser.Easing.Elastic.Out, true).onComplete.add(function () {
      this.kill();
    }, this);
    this.state.bgEffects.verySmallFlare(this.x, this.y);

    if (!this.state.won && this.state.ballDispenser.getFirstAlive()) {
      JinnDash.SB.caughtBooster.dispatch(this);
    }
  }

  ;
};

JinnDash.Booster.prototype.drop = function (brick) {
  this.revive();
  this.scale.setTo(1);
  this.x = brick.centerX;
  this.y = brick.centerY;
  this.spd = game.settings.boosterFallingSpeed;
  this.collRect.x = this.x - this.collW * 0.5;
  this.collRect.y = this.y - this.collH * 0.5;
  this.active = true;
  this.typeNr = game.rnd.between(1, 9);
  this.type = this.types[this.typeNr];
  this.loadTexture('newgfx', 'booster_icon_' + this.typeNr);
  game.add.tween(this.scale).from({
    x: 0,
    y: 0
  }, 400, Phaser.Easing.Elastic.Out, true);
};

JinnDash.BoosterGroup = function () {
  Phaser.Group.call(this, game);
  this.state = game.state.getCurrentState();
  JinnDash.SB.onBrickDestroyed.add(function (brick) {
    var random = Math.random();
    var chance = game.settings.chanceOfGettingBooster * game.settings.dropChanceLevels[this.state.dropChanceMultiLevel][0];

    if (random < chance) {
      this.dropBooster(brick);
    }
  }, this);
};

JinnDash.BoosterGroup.prototype = Object.create(Phaser.Group.prototype);

JinnDash.BoosterGroup.prototype.dropBooster = function (brick) {
  this.getAvailable().drop(brick);
};

JinnDash.BoosterGroup.prototype.getAvailable = function () {
  return this.getFirstDead() || this.add(new JinnDash.Booster());
};

JinnDash.Boot = function (game) {};

JinnDash.Boot.prototype = {
  init: function init() {
    game.canvas.oncontextmenu = function (e) {
      e.preventDefault();
    }; //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1


    game.desktop = game.device.desktop;
    this.input.maxPointers = 2;
    game.time.advancedTiming = true; //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:

    this.stage.disableVisibilityChange = false;
    this.stage.backgroundColor = 0xFF0000; //  This tells the game to resize the renderer to match the game dimensions (i.e. 100% browser width / height)

    if (Phaser.Device.desktop || isEmbed == true) {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
    } else {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
      game.tweens.frameBased = true;
      /*
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(false, true);
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
        if (global.landscape == true) this.scale.forceOrientation(true, false);
        else this.scale.forceOrientation(false, true);
        MyScaleManager.setNoBorder()
      */
    }

    if (game.device.iOS) {
      this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    }

    if (game.device.ie) {
      document.onfocusin = function () {
        console.log("hide");
        document.getElementById("catcher").style['display'] = "none";
      };

      document.onfocusout = function () {
        console.log("show");
        document.getElementById("catcher").style['display'] = "block";
      };
    }
    /*
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    game.tweens.frameBased = true;
    */


    this.scaleGameSizeUpdate = function () {
      if (game.device.iOS) return;
      var ratio;
      var state = game.state.getCurrentState();
      ratio = window.innerWidth / window.innerHeight;
      game.scale.setGameSize(game.math.clamp(Math.floor(960 * ratio), 640, 3000), 960);
      game.world.setBounds((game.width - 640) * -0.5, 0, game.width, 960);
      if (state.resize) state.resize();
    };

    SG_Hooks.setResizeHandler(this.scaleGameSizeUpdate);
    SG_Hooks.setOrientationHandler(this.scaleGameSizeUpdate);
    SG_Hooks.setPauseHandler(function () {
      game.paused = true;
    });
    SG_Hooks.setUnpauseHandler(function () {
      game.paused = false;
    });
    game.resizeGame = this.scaleGameSizeUpdate;
    this.scale.onSizeChange.add(this.scaleGameSizeUpdate);
    var scMan = this.scale;
    this.scale.setResizeCallback(function (context, bounds) {
      //console.log("Resizing")

      /*if (JinnDash.old_w != window.innerWidth || JinnDash.old_h != window.innerHeight) {
          JinnDash.old_w = window.innerWidth;
          JinnDash.old_h = window.innerHeight;
          game.resizeGame();
      }*/
      if (JinnDash.old_w != bounds.width || JinnDash.old_h != bounds.height) {
        if (scMan.scaleMode == Phaser.ScaleManager.USER_SCALE) {
          if (typeof scalingIteration === "undefined") scalingIteration = 0;

          if (scalingIteration == 0) {
            console.log("first scale");
            scMan.setUserScale(200 / game.width, 200 / game.height);
            scalingIteration++;
          } else if (scalingIteration == 1) {
            scalingIteration++;
            stump = {
              w: window.innerWidth - 10,
              h: window.innerHeight - 10
            };
            setTimeout(function () {
              var ratioW = (window.innerWidth - 10) / game.width;
              var ratioH = (window.innerHeight - 10) / game.height;
              var ratio = Math.min(ratioW, ratioH);
              scMan.setUserScale(ratio, ratio);
            }, 1000);
          }
        }

        JinnDash.old_w = bounds.width;
        JinnDash.old_h = bounds.height;
        game.resizeGame();
      }
    });

    if (game.device.iOS) {
      setInterval(function () {
        if (this.turnDevice == false && window.innerWidth > window.innerHeight) {
          this.turnDevice = game.add.existing(new JinnDash.TurnDevice());
          this.turnDevice = true;
        } else {
          this.turnDevice = false;
        }
      }.bind(this), 500);
    }
  },
  preload: function preload() {
    game.load.json('levels', 'json/levels.json');
    this.load.image('logo_softgames', 'images/logo_softgames.png');
    this.load.image('loadingbar_bg', 'images/loadingbar_bg.png');
    this.load.image('loadingbar', 'images/loadingbar.png');
    SG_Hooks.loadProgress(10);
  },
  create: function create() {
    game.ie10 = navigator.userAgent.indexOf("MSIE 10.0") > -1;
    this.state.start('Preloader');
  }
};

JinnDash.Button = function (x, y, sprite, callback, context) {
  Phaser.Button.call(this, game, x, y, null, this.click, this);
  this.state = game.state.getCurrentState();
  JinnDash.changeTexture(this, sprite);
  this.anchor.setTo(0.5);
  this.sfx = game.sfx.click;
  this.active = true;
  this.onClick = new Phaser.Signal();

  if (callback) {
    this.onClick.add(callback, context || this);
  }

  this.terms = [];
};

JinnDash.Button.prototype = Object.create(Phaser.Button.prototype);
JinnDash.Button.constructor = JinnDash.Button;

JinnDash.Button.prototype.click = function () {
  if (!this.active) return;

  for (var i = 0; i < this.terms.length; i++) {
    if (!this.terms[i][0].call(this.terms[i][1])) {
      return;
    }
  }

  this.active = false;
  this.onClick.dispatch();
  this.sfx.play();
  game.add.tween(this.scale).to({
    x: 1.2,
    y: 1.2
  }, 200, Phaser.Easing.Quadratic.Out, true).onComplete.add(function () {
    game.add.tween(this.scale).to({
      x: 1,
      y: 1
    }, 200, Phaser.Easing.Quadratic.Out, true).onComplete.add(function () {
      this.active = true;
    }, this);
  }, this);
};

JinnDash.Button.prototype.addTerm = function (callback, context) {
  this.terms.push([callback, context]);
};

JinnDash.CollDrawDbg = function () {
  this.dbgGraphics = game.add.graphics();
  this.state = game.state.getCurrentState();

  this.update = function () {
    this.dbgGraphics.clear();
    this.dbgGraphics.beginFill(0x00FF00, 0.5);
    this.dbgGraphics.drawRect(this.state.rocket.collRect.x, this.state.rocket.collRect.y, this.state.rocket.collRect.width, this.state.rocket.collRect.height);
    this.state.ballDispenser.forEach(function (child) {
      if (child.alive) {
        this.dbgGraphics.drawRect(child.collRect.x, child.collRect.y, child.collRect.width, child.collRect.height);
      }
    }, this);
    this.state.boosterGroup.forEach(function (child) {
      if (child.alive) {
        this.dbgGraphics.drawRect(child.collRect.x, child.collRect.y, child.collRect.width, child.collRect.height);
      }
    }, this);
  };
};
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */


var saveAs = saveAs || function (e) {
  "use strict";

  if ("undefined" == typeof navigator || !/MSIE [1-9]\./.test(navigator.userAgent)) {
    var t = e.document,
        n = function n() {
      return e.URL || e.webkitURL || e;
    },
        o = t.createElementNS("http://www.w3.org/1999/xhtml", "a"),
        r = ("download" in o),
        i = function i(e) {
      var t = new MouseEvent("click");
      e.dispatchEvent(t);
    },
        a = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent),
        c = e.webkitRequestFileSystem,
        f = e.requestFileSystem || c || e.mozRequestFileSystem,
        u = function u(t) {
      (e.setImmediate || e.setTimeout)(function () {
        throw t;
      }, 0);
    },
        d = "application/octet-stream",
        s = 0,
        l = 4e4,
        v = function v(e) {
      var t = function t() {
        "string" == typeof e ? n().revokeObjectURL(e) : e.remove();
      };

      setTimeout(t, l);
    },
        p = function p(e, t, n) {
      t = [].concat(t);

      for (var o = t.length; o--;) {
        var r = e["on" + t[o]];
        if ("function" == typeof r) try {
          r.call(e, n || e);
        } catch (i) {
          u(i);
        }
      }
    },
        w = function w(e) {
      return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["\uFEFF", e], {
        type: e.type
      }) : e;
    },
        y = function y(t, u, l) {
      l || (t = w(t));

      var y,
          m,
          S,
          h = this,
          R = t.type,
          O = !1,
          g = function g() {
        p(h, "writestart progress write writeend".split(" "));
      },
          b = function b() {
        if (m && a && "undefined" != typeof FileReader) {
          var o = new FileReader();
          return o.onloadend = function () {
            var e = o.result;
            m.location.href = "data:attachment/file" + e.slice(e.search(/[,;]/)), h.readyState = h.DONE, g();
          }, o.readAsDataURL(t), void (h.readyState = h.INIT);
        }

        if ((O || !y) && (y = n().createObjectURL(t)), m) m.location.href = y;else {
          var r = e.open(y, "_blank");
          void 0 === r && a && (e.location.href = y);
        }
        h.readyState = h.DONE, g(), v(y);
      },
          E = function E(e) {
        return function () {
          return h.readyState !== h.DONE ? e.apply(this, arguments) : void 0;
        };
      },
          N = {
        create: !0,
        exclusive: !1
      };

      return h.readyState = h.INIT, u || (u = "download"), r ? (y = n().createObjectURL(t), void setTimeout(function () {
        o.href = y, o.download = u, i(o), g(), v(y), h.readyState = h.DONE;
      })) : (e.chrome && R && R !== d && (S = t.slice || t.webkitSlice, t = S.call(t, 0, t.size, d), O = !0), c && "download" !== u && (u += ".download"), (R === d || c) && (m = e), f ? (s += t.size, void f(e.TEMPORARY, s, E(function (e) {
        e.root.getDirectory("saved", N, E(function (e) {
          var n = function n() {
            e.getFile(u, N, E(function (e) {
              e.createWriter(E(function (n) {
                n.onwriteend = function (t) {
                  m.location.href = e.toURL(), h.readyState = h.DONE, p(h, "writeend", t), v(e);
                }, n.onerror = function () {
                  var e = n.error;
                  e.code !== e.ABORT_ERR && b();
                }, "writestart progress write abort".split(" ").forEach(function (e) {
                  n["on" + e] = h["on" + e];
                }), n.write(t), h.abort = function () {
                  n.abort(), h.readyState = h.DONE;
                }, h.readyState = h.WRITING;
              }), b);
            }), b);
          };

          e.getFile(u, {
            create: !1
          }, E(function (e) {
            e.remove(), n();
          }), E(function (e) {
            e.code === e.NOT_FOUND_ERR ? n() : b();
          }));
        }), b);
      }), b)) : void b());
    },
        m = y.prototype,
        S = function S(e, t, n) {
      return new y(e, t, n);
    };

    return "undefined" != typeof navigator && navigator.msSaveOrOpenBlob ? function (e, t, n) {
      return n || (e = w(e)), navigator.msSaveOrOpenBlob(e, t || "download");
    } : (m.abort = function () {
      var e = this;
      e.readyState = e.DONE, p(e, "abort");
    }, m.readyState = m.INIT = 0, m.WRITING = 1, m.DONE = 2, m.error = m.onwritestart = m.onprogress = m.onwrite = m.onabort = m.onerror = m.onwriteend = null, S);
  }
}("undefined" != typeof self && self || "undefined" != typeof window && window || this.content);

 true && module.exports ? module.exports.saveAs = saveAs :  true && null !== __webpack_require__.amdD && null !== __webpack_require__.amdO && !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return saveAs;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

JinnDash.Editor = function (game) {
  //	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
  this.game; //	a reference to the currently running game

  this.add; //	used to add sprites, text, groups, etc

  this.camera; //	a reference to the game camera

  this.cache; //	the game cache

  this.input; //	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)

  this.load; //	for preloading assets

  this.math; //	lots of useful common math operations

  this.sound; //	the sound manager - add a sound, play one, set-up markers, etc

  this.stage; //	the game stage

  this.time; //	the clock

  this.tweens; //  the tween manager

  this.state; //	the state manager

  this.world; //	the game world

  this.particles; //	the particle manager

  this.physics; //	the physics manager

  this.rnd; //	the repeatable random number generator
  //	You can use any of these from any function within this State.
  //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
};

JinnDash.Editor.prototype = {
  init: function init(lvlNr) {
    this.lvlNr = lvlNr || 1;
  },
  create: function create() {
    this.pause = false; //	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

    this.bg = new JinnDash.Background();
    this.shader = game.add.image(0, 0, 'ssheet', 'shader');
    this.blockGrid = new JinnDash.BlockGrid();

    if (this.lvlNr) {
      this.lvl = JinnDash.levels[this.lvlNr];
      this.lvlData = this.lvl.level;
      this.blockGrid.grid = this.blockGrid.makeEmptyGrid(this.lvlData[0].length, this.lvlData[0][0].length);
      this.blockGrid.loadLevel(this.lvlData);
    } else {
      this.blockGrid.grid = this.blockGrid.makeEmptyGrid(parseInt(prompt("width Max8")), parseInt(prompt("height")));
    }

    this.blockGrid.calcProp();
    g = this.blockGrid;
    this.shader.y = this.blockGrid.margin_t;
    this.shader.x = this.blockGrid.margin_l;
    this.shader.width = this.blockGrid.grid_w * this.blockGrid.block_w;
    this.shader.height = this.blockGrid.grid_h * this.blockGrid.block_h;
    this.shader.alpha = 0.8;
    this.blockToPut = 0;
    this.blockImg = game.add.image(0, 0, null);
    this.blockImg.alpha = 0.6;
    this.cursors = game.input.keyboard.createCursorKeys();
    this.cursors.up.onDown.add(function () {
      this.blockToPut++;
      if (this.blockToPut == 8) this.blockToPut = 0;

      if (this.blockToPut != 0) {
        if (this.blockToPut < 6) {
          this.blockImg.loadTexture('blocks', 'brick_' + this.blockToPut + '_1');
        } else {
          this.blockImg.loadTexture('newgfx', 'brick_' + this.blockToPut);
        }
      } else {
        this.blockImg.loadTexture(null);
      }
    }, this);
    this.cursors.left.onDown.add(function () {
      game.state.start("Editor", true, false, Math.max(1, this.lvlNr - 1));
    }, this);
    this.cursors.right.onDown.add(function () {
      game.state.start("Editor", true, false, Math.min(30, this.lvlNr + 1));
    }, this);
    this.cursors.down.onDown.add(function () {
      this.blockToPut--;
      if (this.blockToPut == -1) this.blockToPut = 7;

      if (this.blockToPut != 0) {
        if (this.blockToPut < 6) {
          this.blockImg.loadTexture('blocks', 'brick_' + this.blockToPut + '_1');
        } else {
          this.blockImg.loadTexture('newgfx', 'brick_' + this.blockToPut);
        }
      } else {
        this.blockImg.loadTexture(null);
      }
    }, this);
    this.eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
    this.eKey.onDown.add(this["export"], this);
    this.input.onDown.add(function () {
      var inRange = this.blockGrid._inRange(game.input.activePointer.worldX, game.input.activePointer.worldY);

      if (inRange == false) return;
      var xx = inRange[2];
      var yy = inRange[3];

      if (this.blockGrid.grid[inRange[0]][inRange[1]] == false) {
        if (this.blockToPut == 0) return;
        this.blockGrid.grid[inRange[0]][inRange[1]] = new JinnDash.Block(xx, yy, this.block_w, this.block_h, this.blockToPut);
        this.blockGrid.add(this.blockGrid.grid[inRange[0]][inRange[1]]);
      } else {
        this.blockGrid.grid[inRange[0]][inRange[1]].destroy();
        this.blockGrid.grid[inRange[0]][inRange[1]] = false;

        if (this.blockToPut == 0) {
          this.blockGrid.grid[inRange[0]][inRange[1]] = false;
        } else {
          this.blockGrid.grid[inRange[0]][inRange[1]] = new JinnDash.Block(xx, yy, this.block_w, this.block_h, this.blockToPut);
          this.blockGrid.add(this.blockGrid.grid[inRange[0]][inRange[1]]);
        }
      }

      if (this.lvlNr) {
        JinnDash.levels[this.lvlNr].level = this.blockGrid.exportLevel();
      }
    }, this);
    this.resize();
  },
  "export": function _export() {
    var obj = [[]];

    for (var i = 1; i < JinnDash.levels.length; i++) {
      obj.push(JinnDash.levels[i].level);
    }

    var blob = new Blob([JSON.stringify(obj)], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, "levels.json");
  },
  update: function update() {
    var inRange = this.blockGrid._inRange(game.input.activePointer.worldX, game.input.activePointer.worldY);

    if (inRange == false) {
      this.blockImg.visible = false;
    } else {
      this.blockImg.visible = true;
      this.blockImg.x = inRange[2];
      this.blockImg.y = inRange[3];
    }
  },
  resize: function resize() {
    this.bg.resize();
  },
  render: function render() {
    game.debug.text('LEVEL ' + this.lvlNr, 2, 40, '#ffff00');
    /*
    game.debug.text(this.blockGrid.checkPosition(game.input.activePointer.worldX,game.input.activePointer.worldY), 2, 40, "#ffff00");
     this.game.debug.text(this.game);
    game.debug.text(game.time.fps || '--', 2, 10, "#ffff00");
    game.debug.text(this.blockGrid.checkPosition(game.input.activePointer.worldX,game.input.activePointer.worldY), 2, 40, "#ffff00");
    this.game.debug.text(this.game.width+'x'+this.game.height,10,70, "#00ff00");
    this.game.debug.text(bg.bitmapData.width+'x'+bg.bitmapData.height,10,100, "#00ff00");
     game.debug.text(game.input.activePointer.worldX+'x'+game.input.activePointer.worldY,10,130,'#ff0000');
    */
  }
};

JinnDash.FxGroup = function () {
  Phaser.Group.call(this, game);
  JinnDash.SB.fxFireParticle.add(function (x, y) {
    this.getAvailable().initFire(x, y);
  }, this);
  JinnDash.SB.fxExplosion.add(function (x, y) {
    this.getAvailable().initExplosion(x, y);
  }, this);
  JinnDash.SB.fxStickyParticle.add(function (x, y) {
    this.getAvailable().initSticky(x + (Math.random(26) - 13), y + 13);
    this.getAvailable().initSticky(x + (Math.random(26) - 13), y + 13);
    this.getAvailable().initSticky(x + (Math.random(26) - 13), y + 13);
  }, this);
};

JinnDash.FxGroup.prototype = Object.create(Phaser.Group.prototype);

JinnDash.FxGroup.prototype.getAvailable = function () {
  return this.getFirstDead() || this.add(new JinnDash.FxParticle());
};

JinnDash.FxParticle = function () {
  Phaser.Image.call(this, game);
  this.anchor.setTo(0.5);
  this.kill();

  this.updateFunction = function () {};
};

JinnDash.FxParticle.prototype = Object.create(Phaser.Image.prototype);

JinnDash.FxParticle.prototype.update = function () {
  if (!this.alive) return;
  this.updateFunction();
};

JinnDash.FxParticle.prototype.init = function (x, y) {
  this.x = x;
  this.y = y;
  this.alpha = 1;
  this.scale.setTo(1);
  this.angle = 0;
  this.revive();
};

JinnDash.FxParticle.prototype.initFire = function (x, y) {
  this.init(x, y);
  JinnDash.changeTexture(this, 'fire_part');
  this.updateFunction = this.updateFire;
};

JinnDash.FxParticle.prototype.updateFire = function () {
  this.y += 5;
  this.alpha -= 0.04;
  if (this.alpha < 0) this.kill();
};

JinnDash.FxParticle.prototype.initSticky = function (x, y) {
  this.init(x, y);
  this.velX = Math.random() * 8 - 4;
  this.velY = -3 - Math.random() * 3;
  JinnDash.changeTexture(this, 'gue_drop1');
  this.updateFunction = this.updateSticky;
};

JinnDash.FxParticle.prototype.updateSticky = function () {
  this.x += this.velX;
  this.velX *= 0.98;
  this.y += this.velY;
  this.velY += 0.3;
  this.scale.setTo(this.scale.x - 0.02);
  if (this.scale.x <= 0) this.kill();
};

JinnDash.FxParticle.prototype.initExplosion = function (x, y) {
  this.init(x, y);
  game.sfx.explosion_2.play();
  this.animIndex = 0;
  this.animTimer = 1;
  this.animTimerInterval = this.animTimer;
  this.loadTexture('explosionsheet', 'explosion_0');
  this.updateFunction = this.updateExplosion;
};

JinnDash.FxParticle.prototype.updateExplosion = function () {
  if (this.animTimer-- == 0) {
    this.animTimer = this.animTimerInterval;
    this.animIndex++;

    if (this.animIndex == 15) {
      this.kill();
    } else {
      this.loadTexture('explosionsheet', 'explosion_' + this.animIndex);
    }
  }
};

JinnDash.Game = function (game) {
  //	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
  this.game; //	a reference to the currently running game

  this.add; //	used to add sprites, text, groups, etc

  this.camera; //	a reference to the game camera

  this.cache; //	the game cache

  this.input; //	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)

  this.load; //	for preloading assets

  this.math; //	lots of useful common math operations

  this.sound; //	the sound manager - add a sound, play one, set-up markers, etc

  this.stage; //	the game stage

  this.time; //	the clock

  this.tweens; //  the tween manager

  this.state; //	the state manager

  this.world; //	the game world

  this.particles; //	the particle manager

  this.physics; //	the physics manager

  this.rnd; //	the repeatable random number generator
  //	You can use any of these from any function within this State.
  //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
};

JinnDash.Game.prototype = {
  init: function init(lvl) {
    s = this;
    JinnDash.SB.clear();
    this.lvl = lvl;
    SG_Hooks.levelStarted(this.lvl);
    this.dropChanceMultiLevel = 0;
    this.doubleCoins = false;
    this.doubleCoinsTimer = 600;
  },
  create: function create() {
    if (!game.sfx.music.isPlaying && !game.sound.mute) game.sfx.music.play('', 0, game.ie10 ? 1 : 0.3, true);

    if (game.incentivise) {
      JinnDash.player.life = Math.max(JinnDash.player.life, game.settings.defaultLife);
    } else {
      JinnDash.player.life = Math.max(JinnDash.player.life, game.settings.defaultLifeWhenNotIncentivise);
    }

    this.pause = false;
    this.timeflow = 1;
    this.slowdownObj = {
      initTimer: 400,
      timer: 0
    };
    this.timer = 0;
    this.lostLife = false;
    this.won = false; //	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

    this.bg = new JinnDash.Background();
    this.paddleLine = game.add.image(320, 820, 'ssheet', 'paddle_line');
    this.paddleLine.anchor.setTo(0.5, 0);
    this.bgEffects = new JinnDash.BgEffects();
    this.blockGrid = new JinnDash.BlockGrid(); //this.powerUpLauncher = new JinnDash.PowerUpLauncher(700);

    this.ballDispenser = new JinnDash.BallDispenser();
    this.rocket = new JinnDash.Rocket(800);
    game.add.existing(this.rocket);
    this.blockGrid.onBlockDestroyed.add(this.bg.shake, this.bg);
    this.blockGrid.loadLevel(JinnDash.levels[this.lvl].level);
    this.laserGroup = new JinnDash.LaserGroup();
    this.boosterGroup = new JinnDash.BoosterGroup();
    this.fxGroup = new JinnDash.FxGroup();
    this.slowdownOverlay = game.add.image(-1, 0, 'slowdown_overlay'); //this.powerUpLauncher.set(this.rocket,this.ballDispenser);

    this.comboMsg = new JinnDash.ComboMsg();
    this.goalInfo = new JinnDash.GoalInfo();
    this.helper = game.add.group();
    this.helper.show = true;

    if (game.desktop) {
      this.arrowLeft = game.make.image(100, 900, 'keysheet', 'key_arrow_right');
      this.arrowLeft.anchor.setTo(0.5);
      this.arrowLeft.alpha = 0.2;
      this.arrowLeft.scale.x = -1;
      this.arrowRight = game.make.image(540, 900, 'keysheet', 'key_arrow_right');
      this.arrowRight.anchor.setTo(0.5);
      game.add.tween(this.arrowLeft).to({
        alpha: 1
      }, 700, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
      game.add.tween(this.arrowRight).to({
        alpha: 0.2
      }, 700, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
      this.helper.addMultiple([this.arrowLeft, this.arrowRight]);
    } else {
      this.hand = game.make.image(240, 850, 'ssheet', 'hand');
      game.add.tween(this.hand).to({
        x: 400
      }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 300, -1, true);
      this.helper.add(this.hand);
    }

    this.shader = game.add.image(-1180, 0, 'ssheet', 'shader');
    this.shader.width = 3000;
    this.shader.height = 960;
    this.shader.cacheAsBitmap = true;
    this.prejinn_fade = game.add.image(-1180, 0, 'ssheet', 'fade');
    this.prejinn_fade.width = 3000;
    this.prejinn_fade.height = 960;
    this.prejinn_fade.cacheAsBitmap = true;
    this.prejinn_fade.alpha = 0;
    this.jinn = game.add.image(320, 400, 'newgfx', 'ginn_map_2');
    this.jinn.anchor.setTo(0.5);
    this.jinn.visible = false;
    this.windowsGroup = game.add.group();
    this.windowsGroup.add(new JinnDash.Window('powerUpNoFade', true));
    this.UIbar = new JinnDash.UIBar(); //-------------------------------------------------------------------

    this.ballDispenser.onAllBallsDestroyed.add(function () {
      if (this.won) {
        this.slowdownObj.timer = 0;
        return;
      }

      JinnDash.player.life--;
      this.lostLife = true;
      if (this.slowdownObj.timer > 0) this.slowdownObj.timer = 0;

      if (JinnDash.player.life > 0) {
        this.rocket.lockedInput = true;
        this.ballDispenser.arrowStart();
        game.add.tween(this.rocket).to({
          x: 320
        }, 500, Phaser.Easing.Sinusoidal.InOut, true).onComplete.add(function () {
          this.rocket.lockedInput = false;
        }, this);
      } else {
        if (game.incentivise) {
          game.time.events.add(500, function () {
            this.windowsGroup.add(new JinnDash.Window('outOfLives'));
          }, this);
        } else {
          if (JinnDash.player.coin >= game.settings.costOfLife) {
            game.time.events.add(500, function () {
              this.windowsGroup.add(new JinnDash.Window('outOfLives'));
            }, this);
          } else {
            game.time.events.add(500, function () {
              this.windowsGroup.add(new JinnDash.Window('gameOver'));
            }, this);
          }
        }
      }
    }, this);
    JinnDash.SB.onGoalAchieved.add(function () {
      this.won = true; //this.levelComplete(this.timer,this.lostLife);
    }, this);
    JinnDash.SB.onAllBricksDestroyed.add(function () {
      this.levelComplete();
    }, this);
    this.fade = game.add.image(-1180, 0, 'ssheet', 'fade');
    this.fade.width = 3000;
    this.fade.height = 960;
    this.fade.alpha = 1;
    this.fade.cacheAsBitmap = true;
    game.add.tween(this.fade).to({
      alpha: 0
    }, 800, Phaser.Easing.Sinusoidal.In, true, 10);
    this.turnDevice = false;
    this.resize();
    JinnDash.SB.caughtBooster.add(function (booster) {
      if (booster.type == 'doubleCoins') {
        this.doubleCoins = true;
        this.doubleCoinsTimer = Math.floor(game.settings.doubleCoinsTimer * 60);
      } else {
        this.doubleCoins = false;
      }
    }, this);
    JinnDash.SB.onAllBallsDestroyed.add(function () {
      this.doubleCoins = false;
    }, this); //this.collDbg = new JinnDash.CollDrawDbg();
  },
  update: function update() {
    //this.collDbg.update();
    this.shader.alpha = this.windowsGroup.length > 0 ? Math.min(0.7, this.shader.alpha + 0.03) : Math.max(0, this.shader.alpha - 0.06);
    this.pause = this.shader.alpha > 0;
    this.slowdownOverlay.alpha = 1 - this.timeflow;
    this.helper.alpha = this.helper.show ? Math.min(1, this.helper.alpha + 0.03) : Math.max(0, this.helper.alpha - 0.03);

    if (!this.pause) {
      this.timeflow = this.slowdownObj.timer-- > 0 ? Math.max(0.3, this.timeflow - 0.02) : Math.min(1, this.timeflow + 0.01);
      this.timer += 1 * this.timeflow;

      if (this.doubleCoins && this.doubleCoinsTimer-- == 0) {
        this.doubleCoins = false;
      }
    }

    this.prejinn_fade.alpha = Math.max(0, this.prejinn_fade.alpha - 0.05);
  },
  resize: function resize() {
    this.bg.resize();

    if (!game.device.desktop && this.turnDevice == false) {
      this.turnDevice = game.add.existing(new JinnDash.TurnDevice());
    } else {
      this.turnDevice = false;
    }
  },
  render: function render() {},
  levelComplete: function levelComplete(time, lostLife) {
    game.sfx.win.play();
    this.won = true;
    this.UIbar.hide();
    this.jinn.visible = true;
    this.jinn.scale.setTo(0);
    var t_scale1 = game.add.tween(this.jinn.scale).to({
      x: 1.8,
      y: 1.8
    }, 800, Phaser.Easing.Sinusoidal.InOut);
    var t_scale2 = game.add.tween(this.jinn.scale).to({
      x: 1.6,
      y: 1.6
    }, 600, Phaser.Easing.Sinusoidal.InOut);
    t_scale1.chain(t_scale2);
    var t_angle1 = game.add.tween(this.jinn).to({
      angle: -30
    }, 800, Phaser.Easing.Sinusoidal.InOut);
    var t_angle2 = game.add.tween(this.jinn).to({
      angle: 0
    }, 600, Phaser.Easing.Sinusoidal.InOut);
    t_angle1.chain(t_angle2);
    t_scale1.start();
    t_angle1.start();
    game.time.events.add(300, function () {
      this.prejinn_fade.alpha = 1;
    }, this);
    game.time.events.add(500, function () {
      this.prejinn_fade.alpha = 1;
    }, this);
    game.time.events.add(1000, function () {
      var stars = this.UIbar.pointsController.starsGained;
      var old_stars = JinnDash.player.levels[this.lvl];
      var coins = (stars - old_stars) * game.settings.coinsForOneStar; // SG_Hooks.levelFinished(this.lvl, coins);

      JinnDash.player.levels[this.lvl] = stars;
      JinnDash.saveGame();
      game.add.tween(this.jinn).to({
        y: this.jinn.y + 30
      }, 800, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
      this.windowsGroup.add(new JinnDash.Window('finishedLevel', stars));

      if (coins > 0) {
        JinnDash.player.coin += coins;
        JinnDash.saveGame();
      }
    }, this);
  },
  startSlowdown: function startSlowdown() {
    this.slowdownObj.timer = this.slowdownObj.initTimer;
  }
};

JinnDash.GoalInfo = function () {
  Phaser.Group.call(this, game);
  this.state = game.state.getCurrentState();
  this.x = 320;
  this.y = game.height * 0.3;
  this.bg = game.make.image(0, 0, 'newgfx', 'goalinfo_bg');
  this.bg.alpha = 0.75;
  this.bg.anchor.setTo(0.5, 0.5);
  this.goalTxt = new JinnDash.OneLineText2(0, -20, 'font', game.lang.getText('Goal') + ':', 30, 300, 0.5, 1);
  var txt = game.selectedLang == 'ja' ? JinnDash.levels[this.state.lvl].goal.toString() + ' ' + game.lang.getText('Destroy') : game.lang.getText('Destroy') + ' ' + JinnDash.levels[this.state.lvl].goal;
  this.destroyTxt = new JinnDash.OneLineText2(0, 0, 'font', txt, 50, 600, 0, 0.5);
  this.bricksIco = game.add.image(0, 0, 'newgfx', 'ui_bricks_ico');
  this.bricksIco.anchor.setTo(0, 0.5);
  this.bricksIco.scale.setTo(1.5);
  var startX = (this.destroyTxt.width + 10 + this.bricksIco.width) * -0.5;
  this.destroyTxt.x = startX;
  this.bricksIco.x = this.destroyTxt.x + this.destroyTxt.width + 10;
  this.bg.width = Math.abs(startX) * 3;
  this.addMultiple([this.bg, this.goalTxt, this.destroyTxt, this.bricksIco]);
  this.scale.setTo(0, 1);
  this.started = false;
};

JinnDash.GoalInfo.prototype = Object.create(Phaser.Group.prototype);

JinnDash.GoalInfo.prototype.update = function () {
  if (!this.started && this.state.windowsGroup.children.length == 0) {
    this.started = true;
    game.add.tween(this.scale).to({
      x: 1
    }, 500, Phaser.Easing.Cubic.Out, true);
    game.add.tween(this).to({
      alpha: 0
    }, 500, Phaser.Easing.Cubic.Out, true, 2000).onComplete.add(function () {
      this.destroy();
    }, this);
  }
};

JinnDash.JinnMap = function (lvl) {
  Phaser.Sprite.call(this, game, 0, 0, 'ssheet', 'jinn_shadow');
  this.anchor.setTo(0.5, 0.5);
  this.state = game.state.getCurrentState();
  this.jinnImg = game.make.image(0, 0, 'newgfx', 'ginn_map_2');
  this.jinnImg.anchor.setTo(0.55, 1);
  this.jinnImg.scale.setTo(0.4, 0.4);
  this.addChild(this.jinnImg);
  this.z = 0;
  this.jumping = false;
  this.locked = false;
  this.tweenDataIndex = 1;
  this.tweenDataLength = this.tweenData.length;
};

JinnDash.JinnMap.prototype = Object.create(Phaser.Sprite.prototype);
JinnDash.JinnMap.constructor = JinnDash.JinnMap;
JinnDash.JinnMap.prototype.tweenData = [0.17037086855465844, 0.669872981077807, 1.4644660940672622, 2.5000000000000004, 3.705904774487397, 5.000000000000002, 6.294095225512606, 7.500000000000001, 8.535533905932738, 9.330127018922191, 9.82962913144534, 10, 10, 10, 10, 9.82962913144534, 9.330127018922191, 8.535533905932738, 7.500000000000001, 6.294095225512606, 5.000000000000002, 3.705904774487397, 2.5000000000000004, 1.4644660940672622, 0.669872981077807, 0.17037086855465844];

JinnDash.JinnMap.prototype.update = function () {
  this.jinnImg.y = -this.z;

  if (!this.jumping) {
    this.z = this.tweenData[this.tweenDataIndex];
    this.tweenDataIndex++;

    if (this.tweenDataIndex == this.tweenDataLength) {
      this.tweenDataIndex = 0;
    }
  }
};

JinnDash.JinnMap.prototype.init = function (lvl) {
  if (lvl < 29) {
    var lvl = lvl;
    this.jinnImg.scale.x *= game.math.sign(JinnDash.mapPointCord[lvl + 1][0] - JinnDash.mapPointCord[lvl][0]);
  } else {
    if (lvl == 29) {
      this.jinnImg.scale.x = -0.4;
    }
  }

  this.lvl = lvl;
  this.x = JinnDash.mapPointCord[lvl][0];
  this.y = JinnDash.mapPointCord[lvl][1];
};

JinnDash.JinnMap.prototype.jump = function (lvl) {
  if (this.jumping || this.lvl == lvl || this.locked) return false; //this.state.followJinn = true;

  game.sfx.jump.play();
  this.lvl = lvl;
  this.jinnImg.scale.x = 0.4 * game.math.sign(JinnDash.mapPointCord[lvl][0] - this.x);
  this.jumping = true;
  game.add.tween(this).to({
    x: JinnDash.mapPointCord[lvl][0],
    y: JinnDash.mapPointCord[lvl][1]
  }, 500, Phaser.Easing.Sinusoidal.InOut, true).onComplete.add(function () {
    this.jumping = false;
    this.jumpTo = null;
  }, this);
  game.add.tween(this).to({
    z: 50
  }, 250, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
  return true;
};

JinnDash.Laser = function () {
  Phaser.Image.call(this, game, 0, 0, 'newgfx', 'shot_3');
  this.anchor.setTo(0.5);
  this.spd = -20;
  this.state = game.state.getCurrentState();
  this.blockGrid = this.state.blockGrid;
  this.collRect = new Phaser.Rectangle(-6, 0, 12, 48);
  this.combo = 1;
  this.kill();
};

JinnDash.Laser.prototype = Object.create(Phaser.Image.prototype);

JinnDash.Laser.prototype.update = function () {
  if (!this.alive) return;
  this.y += this.spd * this.state.timeflow;
  this.collRect.x = this.x - this.collRect.halfWidth;
  this.collRect.y = this.y - this.collRect.halfHeight;
  this.checkCollisions();
  if (this.y + this.collRect.halfWidth < 0) this.kill();
};

JinnDash.Laser.prototype.shoot = function (x, y) {
  this.revive();
  this.x = x;
  this.y = y;
};

JinnDash.Laser.prototype.checkCollisions = function () {
  var block = this.blockGrid.checkPosition(this.x, this.y - this.collRect.halfHeight) || this.blockGrid.checkPosition(this.x - this.collRect.halfWidth, this.y - this.collRect.halfHeight) || this.blockGrid.checkPosition(this.x + this.collRect.halfWidth, this.y - this.collRect.halfHeight);

  if (block) {
    block.hit(1, this);
    this.kill();
  }
};

JinnDash.LaserGroup = function () {
  Phaser.Group.call(this, game);
  JinnDash.SB.shootLaser.add(this.shootLaser, this);
};

JinnDash.LaserGroup.prototype = Object.create(Phaser.Group.prototype);

JinnDash.LaserGroup.prototype.shootLaser = function (x, y) {
  this.getAvailable().shoot(x, y);
};

JinnDash.LaserGroup.prototype.getAvailable = function () {
  return this.getFirstDead() || this.add(new JinnDash.Laser());
};

JinnDash.MainMenu = function (game) {
  this.bg;
  this.spriteTopLeft;
  this.spriteTopRight;
  this.spriteBottomLeft;
  this.spriteBottomRight;
};

JinnDash.MainMenu.prototype = {
  create: function create() {
    SG_Hooks.start();
    if (!game.sfx.music.isPlaying && !game.sound.mute) game.sfx.music.play('', 0, game.ie10 ? 1 : 0.3, true);
    this.bg = new JinnDash.Background();

    if (game.selectedLang == "ja") {
      this.logo = game.add.group();
      this.logo.x = 320;
      this.logo.y = 250;
      this.logoImg = game.add.image(0, 0, 'ssheet', 'logo');
      this.logoImg.anchor.setTo(0.5);
      this.logoImg.scale.setTo(0.8);
      this.logoTxt = new JinnDash.OneLineText2(0, 130, 'font', game.lang.getText('logoSubtitle'), 80, 450, 0.5, 0.5);
      this.logo.addMultiple([this.logoImg, this.logoTxt]);
    } else {
      this.logo = game.add.image(320, 250, 'ssheet', 'logo');
      this.logo.anchor.setTo(0.5);
    }

    this.logo.angle = -10;
    game.add.tween(this.logo).to({
      angle: 10
    }, 3000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    game.add.tween(this.logo.scale).to({
      x: 1.2
    }, 2800, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    game.add.tween(this.logo.scale).to({
      x: 1.2
    }, 2600, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    this.menuWin = new JinnDash.Window('mainMenu');
    this.menuWin.y += 250;
    this.fade = game.add.image(-1180, 0, 'ssheet', 'fade');
    this.fade.width = 3000;
    this.fade.height = 960;
    this.fade.alpha = 1;
    this.fade.cacheAsBitmap = true;
    game.add.tween(this.fade).to({
      alpha: 0
    }, 800, Phaser.Easing.Sinusoidal.In, true);
    this.resize();
  },
  update: function update() {//	Do some nice funky main menu effect here
  },
  playButton: function playButton() {
    game.sfx.transition.play();
    game.add.tween(this.fade).to({
      alpha: 1
    }, 500, Phaser.Easing.Sinusoidal.In, true).onComplete.add(function () {
      game.state.start("WorldMap");
    }, this);
  },
  resize: function resize() {
    this.bg.resize();

    if (!game.device.desktop) {
      game.add.existing(new JinnDash.TurnDevice());
    }
  }
};

JinnDash.MultiLineText = function (x, y, font, text, size, max_width, max_height, align) {
  Phaser.BitmapText.call(this, game, x, y, font, '', size);
  var txt = text;
  var txtArray = [];
  var prevIndexOfSpace = 0;
  var indexOfSpace = 0;
  var widthOverMax = false;

  while (txt.length > 0) {
    prevIndexOfSpace = indexOfSpace;
    indexOfSpace = txt.indexOf(' ', indexOfSpace + 1);
    if (indexOfSpace == -1) this.setText(txt);else this.setText(txt.substring(0, indexOfSpace));
    this.updateText();

    if (this.width > max_width) {
      if (prevIndexOfSpace == 0 && indexOfSpace == -1) {
        txtArray.push(txt);
        txt = '';
        indexOfSpace = 0;
        continue;
      }

      if (prevIndexOfSpace == 0) {
        txtArray.push(txt.substring(0, indexOfSpace));
        txt = txt.substring(indexOfSpace + 1);
        indexOfSpace = 0;
        continue;
      }

      txtArray.push(txt.substring(0, prevIndexOfSpace));
      txt = txt.substring(prevIndexOfSpace + 1);
      indexOfSpace = 0;
    } else {
      //ostatnia linijka nie za dluga
      if (indexOfSpace == -1) {
        txtArray.push(txt);
        txt = '';
      }
    }
  }

  this.setText(txtArray.join('\n'));
  this.updateText();
  this.align = align || 'center';
  this.insertCoin(size);
  this.height = Math.min(this.height, max_height || this.height); //this.width = Math.min(this.width,max_width);

  this.cacheAsBitmap = true;
  this.x -= this.width * 0.5;
};

JinnDash.MultiLineText.prototype = Object.create(Phaser.BitmapText.prototype);

JinnDash.MultiLineText.prototype.insertCoin = function (size) {
  if (this.text.indexOf('$$') == -1) return;
  this.children.forEach(function (element, index, array) {
    if (!element.name) return;

    if (element.name == "$" && element.visible) {
      if (index + 1 <= array.length - 1 && array[index].name == '$') {
        var el = element;
        var el2 = array[index + 1];
        el.visible = false;
        el2.visible = false;
        coin = game.add.image(el.x + size * 0.05, el.y - size * 0.05, 'ssheet', 'coin_big');
        coin.width = size * 0.9;
        coin.height = size * 0.9;
        el.parent.addChild(coin);
      }
    }
  });
};

JinnDash.OneLineText = function (x, y, font, text, size, width) {
  Phaser.BitmapText.call(this, game, x, y, font, text, size, width);
  this.insertCoin(size);
  this.cacheAsBitmap = true;
  this.width = Math.min(this.width, width || this.width);
  this.x -= this.width * 0.5;
};

JinnDash.OneLineText.prototype = Object.create(Phaser.BitmapText.prototype);

JinnDash.OneLineText.prototype.insertCoin = function (size) {
  if (this.text.indexOf('$$') == -1) return;
  this.children.forEach(function (element, index, array) {
    if (!element.name) return;

    if (element.name == "$" && element.visible) {
      if (index + 1 <= array.length - 1 && array[index].name == '$') {
        var el = element;
        var el2 = array[index + 1];
        el.visible = false;
        el2.visible = false;
        coin = game.add.image(el.x + size * 0.05, el.y - size * 0.05, 'ssheet', 'coin_big');
        coin.width = size * 0.9;
        coin.height = size * 0.9;
        el.parent.addChild(coin);
      }
    }
  });
};

JinnDash.OneLineText2 = function (x, y, font, text, size, width, hAnchor, vAnchor) {
  Phaser.BitmapText.call(this, game, x, y, font, text, size, width);

  if (width) {
    while (this.width > width) {
      this.fontSize -= 2;
      this.updateText();
    }
  }

  this.orgFontSize = size;
  this.maxUserWidth = width;
  this.hAnchor = hAnchor;
  this.vAnchor = vAnchor;
  this.anchor.setTo(this.hAnchor, this.vAnchor);
  this.updateText();
  this.insertCoin(this.fontSize);
  this.cacheAsBitmap = true;
  this.updateCache(); //this._cachedSprite.anchor.setTo(typeof this.hAnchor == 'undefined' ? 0.5 : this.hAnchor,this.vAnchor || 0);
  //this.x -= Math.floor(this.width*0.5);
};

JinnDash.OneLineText2.prototype = Object.create(Phaser.BitmapText.prototype);

JinnDash.OneLineText2.prototype.insertCoin = function (size) {
  if (this.text.indexOf('$$') == -1) return;
  this.children.forEach(function (element, index, array) {
    if (!element.name) return;

    if (element.name == "$" && element.visible) {
      if (index + 1 <= array.length - 1 && array[index].name == '$') {
        var el = element;
        var el2 = array[index + 1];
        el.visible = false;
        el2.visible = false;
        coin = game.add.image(el.x + size * 0.05, el.y - size * 0.05, 'newgfx', 'ui_coin_ico');
        coin.width = size;
        coin.height = size;
        el.parent.addChild(coin);
      }
    }
  });
};

JinnDash.OneLineText2.prototype.setText = function (text) {
  Phaser.BitmapText.prototype.setText.call(this, text.toString());

  if (this.maxUserWidth) {
    this.fontSize = this.orgFontSize;
    this.updateText();

    while (this.width > this.maxUserWidth) {
      this.fontSize -= 1;
      this.updateText();
    }
  }

  this.updateCache(); //this._cachedSprite.anchor.setTo(this.hAnchor || 0.5,1);
};

JinnDash.OneLineText2.prototype.popUpAnimation = function () {
  this.cacheAsBitmap = false;
  var char_numb = this.children.length; //

  var delay_array = [];

  for (var i = 0; i < char_numb; i++) {
    delay_array[i] = i;
  }

  delay_array = Phaser.ArrayUtils.shuffle(delay_array);
  console.log(delay_array);
  delay_index = 0;
  this.activeTweens = 0;
  this.children.forEach(function (letter) {
    if (letter.anchor.x == 0) {
      letter.x = letter.x + letter.width * 0.5;
      letter.y = letter.y + letter.height;
      letter.anchor.setTo(0.5, 1);
    }

    var target_scale = letter.scale.x;
    letter.scale.setTo(0, 0);
    this.activeTweens++;
    var tween = game.add.tween(letter.scale).to({
      x: target_scale * 1.5,
      y: target_scale * 1.5
    }, 200, Phaser.Easing.Quadratic.In, false, delay_array[delay_index] * 25).to({
      x: target_scale,
      y: target_scale
    }, 200, Phaser.Easing.Sinusoidal.In);
    tween.onComplete.add(function () {
      this.activeTweens--;

      if (this.activeTweens == 0) {
        if (this.alive) this.cacheAsBitmap = true;
      }
    }, this);
    tween.start();
    delay_index++;
  }, this);
};

JinnDash.OneLineText2.prototype.pushAnimation = function (onComplete, context) {
  this.cacheAsBitmap = false;
  var char_numb = this.children.length;
  var delay_array = [];

  for (var i = 0; i < char_numb; i++) {
    delay_array[i] = i;
  }

  delay_index = 0;
  this.activeTweens = 0;
  this.children.forEach(function (letter) {
    if (letter.anchor.x == 0) {
      letter.x = letter.x + letter.width * 0.5;
      letter.y = letter.y + letter.height * 0.5;
      letter.anchor.setTo(0.5, 0.5);
    }

    var target_scale = letter.scale.x;
    letter.scale.setTo(0, 0);
    this.activeTweens++;
    var tween = game.add.tween(letter.scale).to({
      x: target_scale * 2,
      y: target_scale * 2
    }, 400, Phaser.Easing.Quadratic.Out, false, delay_array[delay_index] * 20).to({
      x: target_scale,
      y: target_scale
    }, 200, Phaser.Easing.Sinusoidal.In);
    tween.onComplete.add(function () {
      this.activeTweens--;

      if (this.activeTweens == 0) {
        this.cacheAsBitmap = true;
      }
    }, this);
    tween.start();
    delay_index++;
  }, this);
};

JinnDash.OneLineText2.prototype.scaleOut = function (onComplete, context) {
  this.cacheAsBitmap = false;
  this.activeTweens = 0;
  this.children.forEach(function (letter, index) {
    if (letter.anchor.x == 0) {
      letter.x = letter.x + letter.width * 0.5;
      letter.y = letter.y + letter.height * 0.5;
      letter.anchor.setTo(0.5, 0.5);
    }

    this.activeTweens++;
    letter.scale.setTo(letter.scale.x, letter.scale.y);
    var tween = game.add.tween(letter.scale).to({
      x: 0,
      y: 0
    }, 400, Phaser.Easing.Cubic.In, false, index * 20);
    tween.onComplete.add(function () {
      this.activeTweens--;

      if (this.activeTweens == 0) {
        this.destroy();
      }
    }, this);
    tween.start();
  }, this);
};

JinnDash.Points = function () {
  JinnDash.OneLineText2.call(this, 0, 0, 'font', '0', 40, 300, 0.5, 0.5);
  this.kill();
};

JinnDash.Points.prototype = Object.create(JinnDash.OneLineText2.prototype);

JinnDash.Points.prototype.init = function (x, y, points) {
  this.revive();
  this.alpha = 1;
  this.scale.setTo(0);
  this.x = x;
  this.y = y;
  this.setText('+' + points.toString());
};

JinnDash.Points.prototype.update = function () {
  if (!this.alive) return;
  this.scale.setTo(this.scale.x + 0.05);

  if (this.scale.x > 1) {
    this.alpha = 1 + (1 - this.scale.x) * 1.5;
    if (this.alpha < 0) this.kill();
  }
};

JinnDash.PowerUpButton = function (x, y, type, window) {
  Phaser.Group.call(this, game);
  this.x = x;
  this.y = y;
  this.state = game.state.getCurrentState();
  this.button = new JinnDash.Button(0, 0, 'btn_empty_sml');
  this.button.label = game.make.image(0, 0, null);
  this.button.label.anchor.setTo(0.5, 0.5);
  this.button.addChild(this.button.label);
  this.active = true;
  this.price = 0;
  this.add(this.button);
  this.init(type);
};

JinnDash.PowerUpButton.prototype = Object.create(Phaser.Group.prototype);
JinnDash.PowerUpButton.constructor = JinnDash.PowerUpButton;

JinnDash.PowerUpButton.prototype.update = function () {
  if (JinnDash.player.coin < this.price) {
    if (this.priceTxt.tint == 16777215) {
      this.priceTxt.cacheAsBitmap = false;
      this.priceTxt.tint = 0xDD0000;
      this.priceTxt.cacheAsBitmap = true;
    }
  }
};

JinnDash.PowerUpButton.prototype.fadeButton = function (immediately) {
  if (immediately) {
    this.button.alpha = 0.3;
  } else {
    game.add.tween(this).to({
      alpha: 0.3
    }, 500, Phaser.Easing.Sinusoidal.InOut, true);
  }
};

JinnDash.PowerUpButton.prototype.addPrice = function (price) {
  this.priceTxt = new JinnDash.OneLineText(4, 55, 'font', price.toString() + '$$', 40);
  this.add(this.priceTxt);
  this.price = price;
};

JinnDash.PowerUpButton.prototype.addQuantity = function (amount) {
  this.quantity = game.make.bitmapText(20, -55, 'font', amount.toString(), 40);
  this.button.label.x -= 10;
  this.button.label.y += 10;
  this.button.addChild(this.quantity);
};

JinnDash.PowerUpButton.prototype.refreshQuantity = function (amount) {
  this.quantity.setText(amount.toString());
};

JinnDash.PowerUpButton.prototype.spriteObj = {
  longpaddle: 'booster_2',
  slowdown: 'booster_5',
  bombball: 'booster_4',
  splitball: 'booster_1',
  life: 'booster_3'
};

JinnDash.PowerUpButton.prototype.init = function (type) {
  this.type = type.toLowerCase();
  this.cost = 'costOf' + type;
  this.button.label.loadTexture('ssheet', this.spriteObj[this.type]);
  this.addPrice(game.settings[this.cost]);
  this.button.addTerm(function () {
    return this.active && JinnDash.player[this.type] < 9;
  }, this);
  this.addQuantity(JinnDash.player[this.type]);
  this.button.onClick.add(function () {
    if (JinnDash.player.coin >= this.price) {
      game.sfx.cash_register.play();
      JinnDash.player.coin -= this.price;
      JinnDash.player[this.type]++;
      JinnDash.saveGame();
      this.refreshQuantity(JinnDash.player[this.type]);

      if (JinnDash.player[this.type] == 9) {
        this.fadeButton();
      }
    } else {
      if (game.incentivise) {
        this.state.windowsGroup.children[0].closeWindow();
        this.state.windowsGroup.add(new JinnDash.Window('notEnoughCash', 'powerUp'));
      }
    }
  }, this);

  if (JinnDash.player[this.type] == 9) {
    this.fadeButton(true);
  }
};

JinnDash.PowerUpLauncher = function (y) {
  Phaser.Group.call(this, game);
  this.y = y;
  this.state = game.state.getCurrentState();
  this.hl = game.make.image(0, 0, 'ssheet', 'powerup_hl');
  this.hl.anchor.setTo(0.5);
  this.hl.alpha = 0;
  this.add(this.hl);
  this.buttons = {};
  this.powerups = [];
};

JinnDash.PowerUpLauncher.prototype = Object.create(Phaser.Group.prototype);
JinnDash.PowerUpLauncher.constructor = JinnDash.PowerUpLauncher;

JinnDash.PowerUpLauncher.prototype.init = function () {
  this.powerups = [];

  for (var key in this.buttons) {
    if (this.buttons.hasOwnProperty(key)) {
      this.buttons[key].destroy();
    }
  }

  this.buttons = {};
  if (JinnDash.player.splitball > 0) this.powerups.push('splitball');
  if (JinnDash.player.bombball > 0) this.powerups.push('bombball');
  if (JinnDash.player.slowdown > 0) this.powerups.push('slowdown');
  if (JinnDash.player.longpaddle > 0) this.powerups.push('longpaddle');
  this.powerupsKeys = [];

  if (game.desktop) {
    this.powerupsKeys = ['Z', 'X', 'C', 'V'];
  }

  switch (this.powerups.length) {
    case 1:
      this.makePowerUpButton(320, this.powerups[0], this.powerupsKeys[0]);
      break;

    case 2:
      this.makePowerUpButton(180, this.powerups[0], this.powerupsKeys[0]);
      this.makePowerUpButton(460, this.powerups[1], this.powerupsKeys[1]);
      break;

    case 3:
      this.makePowerUpButton(320, this.powerups[1], this.powerupsKeys[0]);
      this.makePowerUpButton(120, this.powerups[0], this.powerupsKeys[1]);
      this.makePowerUpButton(520, this.powerups[2], this.powerupsKeys[2]);
      break;

    case 4:
      this.makePowerUpButton(100, this.powerups[0], this.powerupsKeys[0]);
      this.makePowerUpButton(240, this.powerups[1], this.powerupsKeys[1]);
      this.makePowerUpButton(400, this.powerups[2], this.powerupsKeys[2]);
      this.makePowerUpButton(540, this.powerups[3], this.powerupsKeys[3]);
      break;
  }
};

JinnDash.PowerUpLauncher.prototype.refresh = function () {
  this.init();
};

JinnDash.PowerUpLauncher.prototype.update = function () {
  if (this.buttons.slowdown) {
    this.buttons.slowdown.active = !this.state.pause && this.ballDispenser.aliveBalls > 0 && this.state.timeflow == 1;
  }

  if (this.buttons.splitball) {
    this.buttons.splitball.active = !this.state.pause && this.ballDispenser.aliveBalls > 0 && this.ballDispenser.aliveBalls < 5;
  }

  if (this.buttons.longpaddle) {
    this.buttons.longpaddle.active = !this.state.pause && this.ballDispenser.aliveBalls > 0 && !this.rocket["long"];
  }

  if (this.buttons.bombball) {
    this.buttons.bombball.active = !this.state.pause && this.ballDispenser.aliveBalls > 0 && this.ballDispenser.aliveBalls > this.ballDispenser.bombBalls;
  }

  this.forEach(function (child) {
    child.update();
  }, this);
};

JinnDash.PowerUpLauncher.prototype.makePowerUpButton = function (x, type, key) {
  var button = new JinnDash.Button(x, 0, 'powerup_circle', function () {
    this.parent[this.type + 'Fire']();
    JinnDash.player[this.type]--;
    JinnDash.saveGame();
    this.quantity.setText(JinnDash.player[this.type].toString());
    this.parent.hl.x = this.x;
    this.parent.hl.alpha = 1;
    game.time.events.add(100, function () {
      this.hl.alpha = 0;
    }, this.parent);
  });
  button.type = type;
  button.label = game.make.image(0, 0, 'ssheet', 'powerup_' + type);
  button.label.anchor.setTo(0.5);
  button.quantity = game.make.bitmapText(40, -40, 'font', JinnDash.player[type].toString(), 30);
  button.quantity.anchor.setTo(0.5);
  button.quantity.alpha = 0.4;
  button.addChild(button.label);
  button.addChild(button.quantity);
  button.alpha = 0.4;

  button.update = function () {
    if (JinnDash.player[this.type] == 0) this.active = false;
    this.alpha = this.active ? Math.min(0.4, this.alpha + 0.02) : Math.max(0.05, this.alpha - 0.02);
  };

  if (key) {
    button.key = game.input.keyboard.addKey(Phaser.Keyboard[key]);
    button.key.onDown.add(button.click, button);
    button.keyImg = game.make.image(0, 50, 'keysheet', 'key_' + key.toLowerCase());
    button.keyImg.anchor.setTo(0.5, 0);
    button.addChild(button.keyImg);
    this.y -= 20;
  }

  this.add(button);
  this.buttons[type] = button;
  return button;
};

JinnDash.PowerUpLauncher.prototype.set = function (rocket, ballDispenser) {
  this.ballDispenser = ballDispenser;
  this.rocket = rocket;
};

JinnDash.PowerUpLauncher.prototype.splitballFire = function () {
  var ball = this.ballDispenser.getHighestBall();
  if (ball == null) return;
  this.ballDispenser.initBall(ball.x, ball.y, ball.getAngle() + 20, ball.spd);
  this.state.bgEffects.medFlare(ball.x, ball.y);
};

JinnDash.PowerUpLauncher.prototype.bombballFire = function () {
  var ball = null;
  var heighest_y = 960;
  this.ballDispenser.forEachAlive(function (child) {
    if (child.y < heighest_y && !child.bomb) {
      ball = child;
      heighest_y = child.y;
    }
  });
  if (ball == null) return;
  this.state.bgEffects.medFlare(ball.x, ball.y);
  ball.changeIntoBomb();
};

JinnDash.PowerUpLauncher.prototype.slowdownFire = function () {
  this.state.startSlowdown();
};

JinnDash.PowerUpLauncher.prototype.longpaddleFire = function () {
  this.rocket.makeLonger();
};

JinnDash.Preloader = function (game) {
  this.background = null;
  this.preloadBar = null;
  this.ready = false;
};

observer = function observer(command) {
  this.state = game.state.getCurrentState();
  if (!command) return;

  switch (command.action) {
    case 'startGame':
      /*var level = command.data.level
      if (level <= 0) level = 1;
      if(SG_Hooks.getStorageItem("level_observer") == null) SG_Hooks.setStorageItem("level_observer", "1")
         console.log(parseInt(SG_Hooks.getStorageItem("level_observer")))
      if (parseInt(SG_Hooks.getStorageItem("level_observer")) >= level) {
          game.state.start("Game",true,false,level)
      } else {
          return;
      }*/
      break;
  }
};

JinnDash.Preloader.prototype = {
  preload: function preload() {
    this.graphics = game.add.graphics(0, 0);
    this.graphics.beginFill(0xFFFFFF, 1);
    this.graphics.drawRect(-1200, 0, 3400, 960);
    this.graphics.endFill();
    this.loading = game.add.button(320, 300, 'logo_softgames', function () {//window.top.location.href = "http://m.softgames.de";
    }, this);
    this.loading.anchor.setTo(0.5, 0.5);
    this.loadingComplete = false;
    this.preload_bg = game.add.image(70, 500, 'loadingbar_bg');
    this.preload_bar = game.add.image(320 - 236, 512, 'loadingbar');
    this.load.setPreloadSprite(this.preload_bar);
    this.load.image('background_back', 'images/background_back.png');
    this.load.image('background_left', 'images/background_left.png');
    this.load.image('background_right', 'images/background_right.png');
    this.load.image('background_gate', 'images/background_gate.png');
    this.load.image('slowdown_overlay', 'images/slowdown_overlay.png');
    this.load.image('map', 'images/map.png');
    game.load.onFileComplete.add(function (progress) {
      window._azerionIntegrationSDK.onLoadProgress(progress);
    });
    var gfxSuffix = SG.lang == "ja" ? "-ja" : "";
    game.load.atlasJSONHash('ssheet', 'images/spritesheet' + gfxSuffix + '.png', 'images/spritesheet.json');
    game.load.atlasJSONHash('newgfx', 'images/newgfx.png', 'images/newgfx.json');
    game.load.atlasJSONHash('blocks', 'images/blocks.png', 'images/blocks.json');
    game.load.atlasJSONHash('explosionsheet', 'images/explosionsheet.png', 'images/explosionsheet.json');

    if (game.device.desktop) {
      game.load.atlasJSONHash('keysheet', 'images/keysheet.png', 'images/keysheet.json');
    }

    game.load.bitmapFont('font', 'images/font.png', 'images/font.fnt');
    game.load.text('langJSON', 'json/languages.json');
    game.load.text('settingsJSON', 'json/settings.json');
    game.load.audio('cash_register', 'sfx/cash_register.mp3');
    game.load.audio('explosion_1', 'sfx/explosion_1.mp3');
    game.load.audio('explosion_2', 'sfx/explosion_2.mp3');
    game.load.audio('explosion_long', 'sfx/explosion_long.mp3');
    game.load.audio('hit_1', 'sfx/hit_1.mp3');
    game.load.audio('hit_2', 'sfx/hit_2.mp3');
    game.load.audio('hit_3', 'sfx/hit_3.mp3');
    game.load.audio('win', 'sfx/win.mp3');
    game.load.audio('coin', 'sfx/coin.mp3');
    game.load.audio('lose', 'sfx/lose.mp3');
    game.load.audio('music', 'sfx/jinndashmusic.mp3');
    game.load.audio('whoosh', 'sfx/whoosh.mp3');
    game.load.audio('transition', 'sfx/transition.mp3');
    game.load.audio('l_pop', 'sfx/l_pop.mp3');
    game.load.audio('jump', 'sfx/jump.mp3');
    game.load.audio('launch_ball', 'sfx/launch_ball.mp3');
    game.load.audio('lost_ball', 'sfx/lost_ball.mp3');
    game.load.audio('click', 'sfx/POP_Mouth_mono.mp3');
    game.load.audio('blaster', 'sfx/blaster.mp3');
  },
  create: function create() {
    JinnDash.levels = game.cache.getJSON('levels');
    JinnDash.levelWrapper();
    game.incentivise = SG_Hooks.isEnabledIncentiviseButton();
    this.loadingComplete = true;
    game.lang = {
      data: JSON.parse(game.cache.getText('langJSON')),
      lang: 'en',
      getText: function getText(text) {
        return this.data[this.lang][text];
      }
    };
    game.selectedLang = game.lang.lang = SG.lang; //SG_Hooks.getLanguage(Object.keys(game.lang.data));
    //game.selectedLang = game.lang.lang = SG_Hooks.getLanguage(['ja']);

    game.settings = JSON.parse(game.cache.getText('settingsJSON'));
    JinnDash.loadGame();
    game.sfx = {};
    game.sfx.cash_register = game.add.audio('cash_register');
    game.sfx.explosion_1 = game.add.audio('explosion_1');
    game.sfx.explosion_2 = game.add.audio('explosion_2');
    game.sfx.explosion_long = game.add.audio('explosion_long');
    game.sfx.hit_1 = game.add.audio('hit_1');
    game.sfx.hit_2 = game.add.audio('hit_2');
    game.sfx.hit_3 = game.add.audio('hit_3');
    game.sfx.music = game.add.audio('music');
    game.sfx.click = game.add.audio('click');
    game.sfx.whoosh = game.add.audio('whoosh');
    game.sfx.transition = game.add.audio('transition');
    game.sfx.win = game.add.audio('win');
    game.sfx.lose = game.add.audio('lose');
    game.sfx.l_pop = game.add.audio('l_pop');
    game.sfx.jump = game.add.audio('jump');
    game.sfx.coin = game.add.audio('coin');
    game.sfx.lost_ball = game.add.audio('lost_ball');
    game.sfx.launch_ball = game.add.audio('launch_ball');
    game.sfx.blaster = game.add.audio('blaster');

    for (var key in game.sfx) {
      if (game.sfx.hasOwnProperty(key)) {
        var sound = game.sfx[key];
        sound.playNorm = sound.play;

        sound.play = function () {
          if (!game.sound.mute) {
            this.playNorm.apply(this, arguments);
          }
        };
      }
    }

    if (!game.sound.mute) {
      game.sfx.music.play('', 0, game.ie10 ? 1 : 0.3, true);
    }

    ;

    try {
      SG_Hooks.registerObserver(observer);
    } catch (err) {
      console.log(err);
    }

    this.state.start('MainMenu');

    window._azerionIntegrationSDK.removeSplashLoader(function () {
      null;
    }.bind(this));
  },
  update: function update() {
    if (this.loadingComplete && this.cache.isSoundDecoded('music')) {
      this.state.start('MainMenu');
    }
  }
};

JinnDash.Rocket = function (y) {
  Phaser.Group.call(this, game);
  this.x = 320;
  this.y = y;
  this.laserLeft = game.make.image(-78, -20, 'newgfx', 'laser');
  this.laserLeft.anchor.setTo(0.5, 0);
  this.laserRight = game.make.image(78, -20, 'newgfx', 'laser');
  this.laserRight.anchor.setTo(0.5, 0);
  this.laserLeft.alpha = this.laserRight.alpha = 0;
  this.laserTargetAlpha = 0;
  this.laser = false;
  this.rocketLeft = game.make.image(-19, 0, 'newgfx', 'rocket_left');
  this.rocketRight = game.make.image(19, 0, 'newgfx', 'rocket_right');
  this.rocketMiddle = game.make.image(0, 0, 'newgfx', 'rocket_middle');
  this.rocketMiddle.width += 4;
  this.rocketLeft.anchor.setTo(1, 0);
  this.rocketMiddle.anchor.setTo(0.5, 0);
  this.stickyTop = game.make.image(0, -10, 'newgfx', 'sticky');
  this.stickyTop.width = 154;
  this.stickyTop.alpha = 0;
  this.stickyTop.anchor.setTo(0.5, 0);
  this.stickyBalls = [];
  this.sticky = false;
  this.button = new JinnDash.Button(0, 0, null, this.unstickBalls, this);
  this.button.loadTexture(null);
  this.button.addTerm(function () {
    return !this.state.pause;
  }, this);
  this.button.addTerm(function () {
    return !this.lockedInput;
  }, this);
  this.button.hitArea = new Phaser.Rectangle(-80, -20, 160, 60);
  this.add(this.button);
  this.normalWidth = 144;
  this.normalGfxWidth = 38;
  this.currentWidth = 144;
  this.sizeDifference = 0;
  this.addMultiple([this.laserLeft, this.laserRight, this.rocketMiddle, this.rocketLeft, this.rocketRight, this.stickyTop]);
  this.lockedInput = false;
  this.collRect = new Phaser.Rectangle(0, y, 144, 12);
  this.spriteArray = ['paddle_3_l', 'paddle_2_l', 'paddle_1_l', 'paddle_1', 'paddle_1_r', 'paddle_2_r', 'paddle_3_r'];
  this.velIndex = 0;
  this.state = game.state.getCurrentState();
  this.pointerPrevX = false;
  this.pointerId = -1;
  this.pointerRef = null;

  if (game.desktop) {
    this.cursors = game.input.keyboard.createCursorKeys();
    this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.space.onDown.add(function () {
      if (this.state.pause) return;
      if (this.lockedInput) return;
      this.unstickBalls();
    }, this);
    this.inputUpdate = this.keyboardInput;
  } else {
    this.inputUpdate = this.touchInput;
  }

  JinnDash.SB.caughtBooster.add(function (booster) {
    this.sizeDifference = 0;

    if (booster.type == "narrower") {
      this.sizeDifference = game.settings.rocketNarrowDifference;
    } else if (booster.type == "wider") {
      this.sizeDifference = game.settings.rocketWideDifference;
    } else if (booster.type == "laser") {
      this.laserStart();
    } else if (booster.type == "sticky") {
      this.sticky = true;
    }

    if (booster.type != "laser") {
      this.laserHide();
    }

    if (booster.type != "sticky") {
      this.turnOffSticky();
    }
  }, this);
  JinnDash.SB.onAllBallsDestroyed.add(function () {
    this.sizeDifference = 0;
    this.laserHide();
    this.turnOffSticky();
  }, this);
};

JinnDash.Rocket.prototype = Object.create(Phaser.Group.prototype);
JinnDash.Rocket.constructor = JinnDash.Rocket;

JinnDash.Rocket.prototype.unstickBalls = function () {
  for (var i = 0, len = this.stickyBalls.length; i < len; i++) {
    this.stickyBalls[i].launchFromSticky();
  }
};

JinnDash.Rocket.prototype.turnOffSticky = function () {
  this.sticky = false;
  this.unstickBalls();
};

JinnDash.Rocket.prototype.laserStart = function () {
  this.laserTimer = game.settings.laserTimer;
  this.lasersToShoot = game.settings.laserShoots;
  this.laser = true;
};

JinnDash.Rocket.prototype.laserHide = function () {
  this.laserTimer = -1;
  this.lasersToShoot = 0;
  this.laser = false;
};

JinnDash.Rocket.prototype.laserUpdate = function () {
  if (!this.laser) return;

  if (--this.laserTimer == 0 && this.lasersToShoot > 0) {
    game.sfx.blaster.play();
    JinnDash.SB.shootLaser.dispatch(this.x + this.laserLeft.x, this.y + this.laserLeft.y);
    JinnDash.SB.shootLaser.dispatch(this.x + this.laserRight.x, this.y + this.laserRight.y);
    this.laserTimer = game.settings.laserTimer;
    this.lasersToShoot--;
    this.laser = this.lasersToShoot > 0;
  }
};

JinnDash.Rocket.prototype.update = function () {
  this.sizeUpdate();
  this.stickyTop.alpha = this.sticky ? Math.min(1, this.stickyTop.alpha + 0.05) : Math.max(0, this.stickyTop.alpha - 0.05);
  this.laserRight.alpha = this.laserLeft.alpha = this.laser ? Math.min(1, this.laserLeft.alpha + 0.05) : Math.max(0, this.laserLeft.alpha - 0.05);

  if (this.state.pause) {
    this.pointerPrevX = false;
    this.pointerId = -1;
    return;
  }

  this.inputUpdate();
  this.collRect.x = this.x - this.collRect.halfWidth;
  this.x = game.math.clamp(this.x, this.collRect.halfWidth + 20, 640 - this.collRect.halfWidth - 20);
  this.collRect.x = this.x - this.collRect.halfWidth;
  this.laserUpdate();
};

JinnDash.Rocket.prototype.keyboardInput = function () {
  if (this.lockedInput) return;

  if (this.cursors.left.isDown) {
    this.x -= game.settings.arrowsKeyControllSpeed;

    if (this.stickyBalls.length > 0) {
      this.unstickBalls();
    }
  }

  if (this.cursors.right.isDown) {
    this.x += game.settings.arrowsKeyControllSpeed;

    if (this.stickyBalls.length > 0) {
      this.unstickBalls();
    }
  }

  this.collRect.x = this.x - this.collRect.halfWidth;
};

JinnDash.Rocket.prototype.touchInput = function () {
  if (this.lockedInput) return;

  if (game.input.activePointer.isDown && game.input.activePointer.worldY > 700 && this.pointerId == -1) {
    this.pointerId = game.input.activePointer.id;
    this.pointerRef = this.pointerId == 0 ? game.input.mousePointer : game.input['pointer' + this.pointerId];
    this.pointerPrevX = false;
  }

  if (this.pointerId != -1 && this.pointerRef.isDown && this.pointerRef.worldY > 700) {
    if (this.pointerPrevX == false) {
      this.pointerPrevX = this.pointerRef.worldX;
      return;
    }

    var offset = this.pointerRef.worldX - this.pointerPrevX;
    this.x += offset;
    this.x = game.math.clamp(this.x, this.h_width + 20, 640 - this.h_width - 20);
    this.pointerPrevX = this.pointerRef.worldX;
  } else {
    this.pointerPrevX = false;
    this.pointerId = -1;
    this.pointerRef = null;
  }

  this.collRect.x = this.x - this.collRect.halfWidth;
};

JinnDash.Rocket.prototype.sizeUpdate = function () {
  if (this.sizeDifference == 0 && this.currentWidth == this.normalWidth) return;
  if (this.currentWidth == this.normalWidth + this.sizeDifference) return;

  if (this.currentWidth < this.normalWidth + this.sizeDifference) {
    this.currentWidth += 8;
    this.currentWidth = Math.min(this.currentWidth, this.normalWidth + this.sizeDifference);
  }

  if (this.currentWidth > this.normalWidth + this.sizeDifference) {
    this.currentWidth -= 8;
    this.currentWidth = Math.max(this.currentWidth, this.normalWidth + this.sizeDifference);
  }

  var sizeDiff = this.currentWidth - this.normalWidth;
  this.collRect.width = this.normalWidth + sizeDiff;
  this.stickyTop.width = 154 + sizeDiff;
  this.rocketMiddle.width = this.normalGfxWidth + sizeDiff;
  if (this.rocketMiddle.width > this.normalGfxWidth) this.rocketMiddle.width += 4;
  this.rocketLeft.x = (this.rocketMiddle.width - 4) * -0.5;
  this.rocketRight.x = this.rocketLeft.x * -1;
  this.laserLeft.x = this.rocketLeft.x - 60;
  this.laserRight.x = this.rocketRight.x + 60;
};

JinnDash.SB = {
  onBrickDestroyed: new Phaser.Signal(),
  onAllBricksDestroyed: new Phaser.Signal(),
  onBallRocketBounce: new Phaser.Signal(),
  useBooster: new Phaser.Signal(),
  onAllBallsDestroyed: new Phaser.Signal(),
  onGoalAchieved: new Phaser.Signal(),
  showBrickPoints: new Phaser.Signal(),
  fxFireParticle: new Phaser.Signal(),
  fxExplosion: new Phaser.Signal(),
  fxStickyParticle: new Phaser.Signal(),
  bounceFromRocket: new Phaser.Signal(),
  shootLaser: new Phaser.Signal(),
  caughtBooster: new Phaser.Signal(),
  clear: function clear() {
    var keys = Object.keys(this);
    keys.forEach(function (child) {
      if (this[child].removeAll) {
        this[child].removeAll();
      }
    }, this);
  }
};

JinnDash.TurnDevice = function () {
  Phaser.Sprite.call(this, game, 0, 0, null);
  this.blackBg = game.make.image(-1000, 0, 'ssheet', 'black');
  this.blackBg.width = 3000;
  this.blackBg.height = 960;
  this.turnDevice = game.make.image(320, 480, 'ssheet', 'turn_device');
  this.turnDevice.anchor.setTo(0.5, 0.5);
  this.addChild(this.blackBg);
  this.addChild(this.turnDevice);
  if (typeof scalingIteration === "undefined") scalingIteration = 0;
};

JinnDash.TurnDevice.prototype = Object.create(Phaser.Sprite.prototype);
JinnDash.TurnDevice.constructor = JinnDash.TurnDevice;

JinnDash.TurnDevice.prototype.update = function () {
  if (window.innerWidth < window.innerHeight) {
    this.destroy();

    if (game.device.iOS) {
      setTimeout(function () {
        var ratioW = stump.w / game.width;
        var ratioH = stump.h / game.height;
        var ratio = Math.min(ratioW, ratioH);
        scMan.setUserScale(ratio, ratio);
      }, 1000);
    }
  }
};

JinnDash.UIBar = function () {
  Phaser.Group.call(this, game);
  this.state = game.state.getCurrentState();
  this.pointsController = new JinnDash.UI_PointsController();
  this.pointsController.x = 10;
  this.pointsController.y = 15;
  this.pointsGroup = new JinnDash.UI_PointsGroup();
  this.brickIco = game.make.image(225, 23, 'newgfx', 'ui_bricks_ico');
  this.bricksToDestroy = JinnDash.levels[this.state.lvl].goal;
  this.brickTxt = game.make.bitmapText(280, 20, 'font', JinnDash.levels[this.state.lvl].goal.toString(), 30);
  this.coinIco = game.make.image(350, 16, 'newgfx', 'ui_coin_ico');
  this.coinTxt = new JinnDash.OneLineText2(436, 36, 'font', JinnDash.player.coin.toString(), 30, 85, 0.5, 0.5);
  this.coin2x = new JinnDash.OneLineText2(368, 36, 'font', 'x2', 30, 85, 0.5, 0.5);
  this.coin2x.tint = 0xDD0000;
  this.coin2x.updateCache();
  this.coin2x.state = this.state;
  this.coin2x.alphaPulse = 1;
  this.coin2x.alphaMulti = 0;
  game.add.tween(this.coin2x).to({
    alphaPulse: 0.3
  }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
  this.coinAmount = JinnDash.player.coin;
  this.heartIco = game.make.image(485, 20, 'newgfx', 'ui_heart_ico');
  this.lifeAmount = JinnDash.player.life;
  this.heartTxt = game.make.bitmapText(550, 20, 'font', JinnDash.player.life.toString(), 30);
  this.heartTxt.anchor.setTo(1, 0);
  this.pauseButton = new JinnDash.Button(600, 43, 'pause_btn', function () {
    this.windowsGroup.add(new JinnDash.Window('pause'));
  }, this.state);
  this.pauseButton.addTerm(function () {
    return this.windowsGroup.length == 0;
  }, this.state);
  this.pauseButton.addTerm(function () {
    return !this.state.won;
  }, this.state);
  this.addMultiple([this.brickIco, this.brickTxt, this.coinIco, this.coin2x, this.coinTxt, this.heartIco, this.heartTxt, this.pauseButton]);
  JinnDash.SB.onBrickDestroyed.add(function () {
    this.bricksToDestroy--;
    this.brickTxt.setText(Math.max(0, this.bricksToDestroy).toString());

    if (this.bricksToDestroy == 0) {
      JinnDash.SB.onGoalAchieved.dispatch();
    }
  }, this);
};

JinnDash.UIBar.prototype = Object.create(Phaser.Group.prototype);
JinnDash.UIBar.constructor = JinnDash.UIBar;

JinnDash.UIBar.prototype.update = function () {
  if (JinnDash.player.coin != this.coinAmount) {
    this.coinAmount = JinnDash.player.coin;
    this.coinTxt.setText(this.coinAmount.toString());
  }

  if (JinnDash.player.life != this.lifeAmount) {
    this.lifeAmount = JinnDash.player.life;
    this.heartTxt.setText(this.lifeAmount.toString());
  }

  this.coin2x.alpha = this.coin2x.alphaMulti * this.coin2x.alphaPulse;
  this.coin2x.alphaMulti = this.state.doubleCoins ? Math.min(1, this.coin2x.alphaMulti + 0.02) : Math.max(0, this.coin2x.alphaMulti - 0.02);
};

JinnDash.UIBar.prototype.hide = function () {
  game.add.tween(this.pauseButton).to({
    alpha: 0
  }, 400, Phaser.Easing.Sinusoidal.Out, true);
  game.add.tween(this.heartIco).to({
    alpha: 0
  }, 400, Phaser.Easing.Sinusoidal.Out, true);
  game.add.tween(this.heartTxt).to({
    alpha: 0
  }, 400, Phaser.Easing.Sinusoidal.Out, true);
};

JinnDash.ComboMsg = function () {
  JinnDash.OneLineText2.call(this, 0, 0, 'font', '', 100, 620, 0.5, 0.5);
  this.alpha = 0;
  this.y = game.height * 0.5;
  this.x = 320;
  this.goalAchieved = false;
  JinnDash.SB.onBrickDestroyed.add(this.onBrickDestroyed, this);
  JinnDash.SB.onGoalAchieved.add(function () {
    this.goalAchieved = true;
    this.startAnimation(game.lang.getText('Stage clear!'));
  }, this);
  game.add.existing(this);
};

JinnDash.ComboMsg.prototype = Object.create(JinnDash.OneLineText2.prototype);

JinnDash.ComboMsg.prototype.startAnimation = function (text) {
  if (this.tween1) {
    this.tween1.stop();
    this.tween2.stop();
  }

  this.alpha = 1;
  this.setText(text);
  this.scale.setTo(0);
  this.tween1 = game.add.tween(this.scale).to({
    x: 1,
    y: 1
  }, 500, Phaser.Easing.Elastic.Out, true);
  this.tween2 = game.add.tween(this).to({
    alpha: 0
  }, 500, Phaser.Easing.Sinusoidal.Out, true, 1000);
};

JinnDash.ComboMsg.prototype.onBrickDestroyed = function (block, ball) {
  if (this.goalAchieved) return;
  if (ball.combo == 3) this.startAnimation(game.lang.getText('Good!'));
  if (ball.combo == 5) this.startAnimation(game.lang.getText('Nice!'));
  if (ball.combo == 7) this.startAnimation(game.lang.getText('Awesome!'));
};

JinnDash.UI_PointsController = function (x, y) {
  Phaser.Group.call(this, game);
  this.x = x;
  this.y = y;
  this.state = game.state.getCurrentState();
  this.points = 0;
  this.req = JinnDash.levels[this.state.lvl].req;
  this.ui_bg = game.make.image(0, 0, 'newgfx', 'ui_bar_bg');
  this.ui_fill = game.make.image(5, 5, 'newgfx', 'ui_bar_fill');
  this.ui_fill.cropRect = new Phaser.Rectangle(0, 0, 0, 24);
  this.ui_fill.updateCrop();
  this.maxPoints = this.req[2] * 1.2;
  this.poles = [];
  this.stars = [];
  this.starsGained = 0;

  for (var i = 0; i < 3; i++) {
    this.poles[i] = game.make.image(5 + this.req[i] / this.maxPoints * 176, 10, 'newgfx', 'ui_bar_starpole');
    this.poles[i].anchor.setTo(0.5, 0);
    this.stars[i] = game.make.image(5 + this.req[i] / this.maxPoints * 176, 5, 'newgfx', 'ui_bar_star');
    this.stars[i].empty = game.make.image(0, 0, 'newgfx', 'ui_bar_starempty');
    this.stars[i].empty.anchor.setTo(0.5);
    this.stars[i].addChild(this.stars[i].empty);
    this.stars[i].anchor.setTo(0.5);
    this.stars[i].passed = false;
  }

  ;
  this.pointsTxt = new JinnDash.OneLineText2(93, 35, 'font', '0', 25, 180, 0.5, 0);
  this.addMultiple([this.ui_bg, this.ui_fill, this.pointsTxt]);
  this.addMultiple(this.poles);
  this.addMultiple(this.stars);
  JinnDash.SB.onBrickDestroyed.add(function (brick, ball) {
    this.points += 10 * ball.combo;
    JinnDash.SB.showBrickPoints.dispatch(brick, 10 * ball.combo);

    for (var i = 0; i < 3; i++) {
      if (this.points >= this.req[i] && !this.stars[i].passed) {
        this.stars[i].passed = true;
        this.starsGained++;
        game.add.tween(this.stars[i]).to({
          angle: 720
        }, 700, Phaser.Easing.Cubic.Out, true);
        game.add.tween(this.stars[i].empty).to({
          alpha: 0
        }, 700, Phaser.Easing.Cubic.Out, true);
      }
    }

    ;
    this.pointsTxt.setText(this.points.toString());
    this.updateCropRect();
  }, this);
};

JinnDash.UI_PointsController.prototype = Object.create(Phaser.Group.prototype);

JinnDash.UI_PointsController.prototype.updateCropRect = function () {
  this.ui_fill.cropRect.width = Math.min(180, this.points / this.maxPoints * 176);
  this.ui_fill.updateCrop();
};

JinnDash.UI_PointsGroup = function () {
  Phaser.Group.call(this, game);
  JinnDash.SB.showBrickPoints.add(function (brick, points) {
    var freeTxt = this.getAvailable();
    freeTxt.init(brick.x + brick.width * 0.5, brick.y + brick.height * 0.5, points);
  }, this);
};

JinnDash.UI_PointsGroup.prototype = Object.create(Phaser.Group.prototype);

JinnDash.UI_PointsGroup.prototype.getAvailable = function () {
  return this.getFirstDead() || this.add(new JinnDash.Points());
};

JinnDash.player = {
  coin: 250,
  life: 2,
  levels: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  mute: false,
  splitball: 0,
  bombball: 0,
  slowdown: 0,
  longpaddle: 0
};

JinnDash.saveGame = function () {
  JinnDash.player.mute = game.sound.mute;
  SG_Hooks.setStorageItem('data', window.btoa(JSON.stringify(JinnDash.player)));
};

JinnDash.loadGame = function () {
  var data = SG_Hooks.getStorageItem('data');

  if (data !== null) {
    JinnDash.player = JSON.parse(window.atob(data));
    game.sound.mute = JinnDash.player.mute;
  }
};

JinnDash.mapPointCord = [[458, 1826], [381, 1767], [287, 1806], [240, 1691], [136, 1697], [200, 1597], [107, 1554], [218, 1500], [155, 1420], [275, 1394], [215, 1312], [333, 1275], [254, 1219], [345, 1131], [218, 1112], [276, 1018], [84, 915], [205, 875], [119, 791], [308, 800], [363, 649], [518, 682], [449, 554], [521, 470], [331, 491], [279, 381], [200, 450], [158, 332], [64, 349], [122, 259], [199, 192]];
JinnDash.levels = [[], [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 4, 4, 0, 0], [0, 0, 0, 0, 4, 4, 0, 0], [4, 4, 0, 0, 0, 0, 0, 0], [4, 4, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 4, 4, 0, 0], [0, 0, 0, 0, 4, 4, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0], [0, 4, 0, 0, 4, 0], [0, 4, 4, 4, 4, 0], [0, 4, 0, 0, 4, 0], [0, 4, 0, 0, 4, 0], [0, 4, 4, 4, 4, 0], [0, 4, 0, 0, 4, 0], [0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0], [0, 0, 4, 4, 3, 0], [0, 3, 4, 4, 3, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 3, 4, 4, 3, 0], [0, 0, 4, 4, 3, 0], [0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0], [0, 4, 0, 0, 5, 0], [0, 0, 3, 3, 4, 0], [0, 5, 4, 4, 0, 0], [0, 5, 4, 4, 0, 0], [0, 0, 3, 3, 4, 0], [0, 4, 0, 0, 5, 0], [0, 0, 0, 0, 0, 0]], [[0, 0, 0, 5, 3, 4], [0, 4, 3, 0, 0, 0], [0, 0, 0, 5, 3, 4], [0, 4, 3, 0, 0, 0], [0, 4, 3, 0, 0, 0], [0, 0, 0, 5, 3, 4], [0, 4, 3, 0, 0, 0], [0, 0, 0, 5, 3, 4]], [[0, 3, 0, 0, 0, 3, 0], [0, 0, 0, 4, 0, 0, 0], [5, 0, 3, 0, 3, 0, 5], [0, 3, 0, 5, 0, 3, 0], [0, 3, 0, 5, 0, 3, 0], [5, 0, 3, 0, 3, 0, 5], [0, 0, 0, 4, 0, 0, 0], [0, 3, 0, 0, 0, 3, 0]], [[3, 4, 0, 5, 4, 3], [0, 0, 0, 0, 0, 0], [5, 4, 3, 4, 5, 0], [0, 5, 4, 3, 4, 5], [0, 5, 4, 3, 4, 5], [5, 4, 3, 4, 5, 0], [0, 0, 0, 0, 0, 0], [3, 4, 0, 5, 4, 3]], [[2, 2, 2, 2, 2, 2, 2, 2], [0, 0, 0, 0, 0, 0, 0, 0], [2, 2, 2, 2, 2, 2, 2, 2], [4, 4, 4, 4, 4, 4, 4, 2], [4, 4, 4, 4, 4, 4, 4, 2], [4, 4, 4, 4, 4, 4, 4, 2], [4, 4, 4, 4, 4, 4, 4, 2], [4, 4, 4, 4, 4, 4, 4, 2]], [[0, 4, 3, 3, 4, 0], [4, 0, 2, 2, 0, 4], [3, 2, 3, 1, 2, 3], [3, 2, 4, 5, 2, 3], [4, 0, 2, 2, 0, 4], [0, 4, 3, 3, 4, 0]], [[0, 4, 4, 4, 4, 4, 4, 4], [0, 4, 2, 2, 4, 5, 5, 4], [0, 4, 2, 2, 4, 5, 5, 4], [0, 4, 4, 4, 4, 4, 4, 4], [0, 4, 4, 4, 4, 4, 4, 4], [0, 4, 1, 1, 4, 3, 3, 4], [0, 4, 1, 1, 4, 3, 3, 4], [0, 4, 4, 4, 4, 4, 4, 4]], [[0, 0, 0, 0, 0, 0, 0, 0], [0, 3, 3, 3, 3, 3, 3, 0], [3, 5, 4, 4, 5, 5, 4, 3], [3, 5, 4, 4, 5, 5, 4, 3], [3, 5, 4, 4, 5, 5, 4, 3], [3, 5, 4, 4, 5, 5, 4, 3], [0, 3, 3, 3, 3, 3, 3, 0], [0, 0, 0, 0, 0, 0, 0, 0]], [[4, 0, 3, 0, 5], [0, 4, 0, 5, 0], [3, 0, 5, 0, 3], [0, 5, 0, 4, 0], [3, 0, 5, 0, 3], [0, 4, 0, 5, 0], [3, 0, 5, 0, 3], [0, 5, 0, 4, 0]], [[2, 3, 4, 4, 4, 4, 4, 2], [0, 2, 3, 4, 3, 3, 3, 2], [0, 0, 2, 4, 2, 2, 2, 2], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 2, 4, 2, 2, 2, 2], [0, 2, 3, 4, 3, 3, 3, 2], [2, 3, 4, 4, 4, 4, 4, 2]], [[0, 0, 0, 3, 0, 0, 0], [1, 3, 3, 3, 1, 0, 0], [1, 5, 5, 3, 0, 0, 0], [1, 3, 3, 4, 3, 3, 1], [1, 3, 3, 4, 3, 3, 1], [1, 5, 5, 3, 0, 0, 0], [1, 3, 3, 3, 1, 0, 0], [0, 0, 0, 3, 0, 0, 0]], [[0, 0, 4, 4, 0, 0], [0, 4, 3, 3, 4, 0], [4, 3, 1, 1, 3, 4], [4, 3, 1, 1, 3, 4], [0, 4, 3, 3, 4, 0], [0, 0, 4, 4, 0, 0]], [[0, 0, 4, 5, 3, 5, 3], [4, 5, 3, 0, 0, 0, 0], [3, 3, 0, 0, 0, 0, 0], [3, 5, 0, 0, 1, 1, 0], [3, 5, 0, 0, 1, 1, 0], [3, 3, 0, 0, 0, 0, 0], [4, 5, 3, 0, 0, 0, 0], [0, 0, 4, 5, 3, 5, 3]], [[2, 1, 2, 1, 0], [1, 2, 1, 2, 1], [0, 1, 2, 1, 2], [0, 1, 2, 1, 2], [1, 2, 1, 2, 1], [2, 1, 2, 1, 0]], [[0, 0, 0, 4, 3, 5, 3, 4], [0, 0, 4, 3, 5, 3, 4, 0], [0, 4, 3, 5, 3, 4, 0, 0], [0, 4, 3, 5, 3, 4, 0, 0], [0, 0, 4, 3, 5, 3, 4, 0], [0, 0, 0, 4, 3, 5, 3, 4]], [[0, 2, 2, 1, 5, 3, 4], [0, 2, 2, 1, 5, 3, 4], [0, 2, 2, 1, 5, 3, 4], [0, 2, 2, 1, 5, 3, 4], [0, 2, 2, 1, 5, 3, 4], [0, 2, 2, 1, 5, 3, 4], [0, 2, 2, 1, 5, 3, 4], [0, 2, 2, 1, 5, 3, 4]], [[0, 1, 2, 2, 4, 2, 2, 1, 0], [3, 0, 0, 0, 0, 0, 0, 0, 3], [0, 1, 0, 5, 5, 5, 0, 1, 0], [0, 1, 0, 5, 5, 5, 0, 1, 0], [3, 0, 0, 0, 0, 0, 0, 0, 3], [0, 1, 2, 2, 4, 2, 2, 1, 0]], [[0, 3, 5, 5, 2, 2, 3], [0, 3, 4, 4, 1, 1, 3], [0, 3, 5, 5, 2, 2, 3], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 3, 5, 5, 2, 2, 3], [0, 3, 4, 4, 1, 1, 3], [0, 3, 5, 5, 2, 2, 3]], [[2, 1, 0, 0, 0, 2], [0, 2, 1, 0, 2, 1], [0, 0, 2, 1, 0, 0], [0, 1, 2, 1, 0, 0], [0, 0, 1, 2, 1, 0], [0, 0, 1, 2, 0, 0], [1, 2, 0, 1, 2, 0], [2, 0, 0, 0, 1, 2]], [[0, 0, 5, 3, 5, 4, 5, 0], [0, 0, 1, 3, 1, 4, 1, 0], [0, 0, 5, 3, 5, 4, 5, 0], [0, 0, 1, 3, 1, 4, 1, 0], [0, 0, 5, 3, 5, 4, 5, 0], [0, 0, 1, 3, 1, 4, 1, 0], [0, 0, 5, 3, 5, 4, 5, 0], [0, 0, 1, 3, 1, 4, 1, 0]], [[0, 0, 5, 5, 0, 0], [0, 5, 1, 1, 5, 0], [5, 1, 2, 2, 1, 5], [5, 1, 2, 2, 1, 5], [0, 5, 1, 1, 5, 0], [0, 0, 5, 5, 0, 0]], [[0, 0, 1, 1, 1, 1, 0, 0], [1, 1, 3, 2, 2, 4, 1, 0], [1, 1, 3, 2, 2, 4, 1, 0], [0, 0, 0, 5, 5, 4, 3, 2], [0, 0, 0, 5, 5, 4, 3, 2], [1, 1, 3, 2, 2, 4, 1, 0], [1, 1, 3, 2, 2, 4, 1, 0], [0, 0, 1, 1, 1, 1, 0, 0]], [[1, 2, 1, 2, 1], [0, 4, 4, 2, 0], [0, 4, 4, 2, 0], [0, 4, 4, 2, 0], [0, 4, 4, 2, 0], [1, 2, 1, 2, 1]], [[5, 5, 5, 5, 5, 5], [5, 4, 4, 5, 4, 5], [5, 4, 4, 4, 4, 5], [4, 4, 4, 4, 4, 4], [5, 5, 5, 5, 5, 5], [4, 4, 4, 5, 5, 5], [5, 5, 5, 5, 5, 5]], [[2, 2, 2, 2, 2, 2], [0, 0, 2, 2, 0, 0], [0, 0, 2, 2, 0, 1], [2, 2, 2, 2, 2, 2], [0, 0, 2, 2, 0, 0], [0, 0, 2, 2, 0, 0], [2, 2, 2, 2, 2, 2]], [[5, 5, 5, 4, 4, 3, 3, 3], [1, 2, 1, 2, 1, 2, 1, 2], [2, 1, 2, 1, 2, 1, 2, 1], [3, 3, 3, 4, 4, 5, 5, 5]], [[2, 0, 0, 0, 0, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 0, 2, 0, 2], [2, 0, 0, 0, 0, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 0, 2, 2, 2, 0], [0, 0, 2, 0, 0, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 0, 0, 0, 2], [2, 0, 2, 0, 2, 0, 2, 2, 2, 2]]];
Utils = {};

Utils.circle_coll = function (x1, y1, radius1, x2, y2, radius2) {
  var dist = game.math.distance(x1, y1, x2, y2);
  return dist < radius1 + radius2;
};

Utils.lengthdir_x = function (angle, length, rads) {
  var rads = rads || false;

  if (rads) {
    return Math.cos(angle) * length;
  } else {
    return Math.cos(game.math.degToRad(angle)) * length;
  }
};

Utils.lengthdir_y = function (angle, length, rads) {
  var rads = rads || false;

  if (rads) {
    return Math.sin(angle) * length;
  } else {
    return Math.sin(game.math.degToRad(angle)) * length;
  }
};

JinnDash.changeTexture = function (obj, sprite) {
  var sheet = JinnDash.checkSheet(sprite);

  if (sheet) {
    obj.loadTexture(sheet, sprite);
  } else {
    obj.loadTexture(sprite);
  }
};

JinnDash.checkSheet = function (frame) {
  if (game.cache.getFrameData('ssheet').getFrameByName(frame)) {
    return 'ssheet';
  } else if (game.cache.getFrameData('newgfx').getFrameByName(frame)) {
    return 'newgfx';
  } else if (game.cache.getFrameData('blocks').getFrameByName(frame)) {
    return 'blocks';
  }

  return '';
};

JinnDash.levelWrapper = function () {
  JinnDash.levels.forEach(function (level, index, array) {
    if (index == 0) return;
    var bricksNumber = 0;
    var destructableBricks = 0;

    for (var row = 0, len = level.length; row < len; row++) {
      for (var coll = 0, len2 = level[row].length; coll < len2; coll++) {
        if (level[row][coll] != 0) {
          bricksNumber++;

          if (level[row][coll] != '6') {
            destructableBricks++;
          }
        }
      }
    }

    var goal = Math.floor(destructableBricks * 0.9);
    var minReq = Math.floor(destructableBricks * 0.7) * 10;
    var medReq = Math.floor(destructableBricks * 0.8) * 10 + Math.floor(destructableBricks * 0.2) * 20;
    var highReq = Math.floor(destructableBricks * 0.5) * 10 + Math.floor(destructableBricks * 0.3) * 20 + Math.floor(destructableBricks * 0.2) * 30;
    array[index] = {
      req: [minReq, medReq, highReq],
      goal: goal,
      level: level
    };
  });
};

JinnDash.Window = function (type) {
  Phaser.Group.call(this, game);
  this.x = 320;
  this.y = 480;
  this.state = game.state.getCurrentState();
  this.bg = game.make.image(0, 0, 'ssheet', 'popup_backgr');
  this.bg.anchor.setTo(0.5);
  this.add(this.bg);
  this.buttonsGroup = game.add.group();
  this.add(this.buttonsGroup);
  this[type].apply(this, Array.prototype.slice.call(arguments, 1));

  if (type !== 'mainMenu' && type !== 'powerUpNoFade') {
    this.fadeIn();
  }
};

JinnDash.Window.prototype = Object.create(Phaser.Group.prototype);
JinnDash.Window.constructor = JinnDash.Window;

JinnDash.Window.prototype.lockInput = function (unlockTime) {
  this.buttonsGroup.forEach(function (child) {
    if (child.onInputUp) {
      child.onInputUp.active = false;
    } else {
      child.active = false;
    }
  });

  if (unlockTime) {
    game.time.events.add(unlockTime, this.unlockInput, this);
  }
};

JinnDash.Window.prototype.fadeIn = function () {
  game.sfx.whoosh.play();
  this.cacheAsBitmap = true;
  this.lockInput();
  game.add.tween(this).from({
    alpha: 0
  }, 300, Phaser.Easing.Sinusoidal.InOut, true);
  game.add.tween(this.scale).from({
    x: 1.5,
    y: 1.5
  }, 300, Phaser.Easing.Sinusoidal.InOut, true).onComplete.add(function () {
    this.unlockInput();
    this.cacheAsBitmap = false;
  }, this);
};

JinnDash.Window.prototype.unlockInput = function () {
  this.buttonsGroup.forEach(function (child) {
    if (child.onInputUp) {
      child.onInputUp.active = true;
    } else {
      child.active = true;
    }
  });
};

JinnDash.Window.prototype.closeWindow = function () {
  game.sfx.whoosh.play();
  this.lockInput();
  this.cacheAsBitmap = true;
  game.add.tween(this).to({
    alpha: 0
  }, 500, Phaser.Easing.Sinusoidal.InOut, true).onComplete.add(function () {
    this.destroy();
  }, this);
  game.add.tween(this.scale).to({
    x: 1.5,
    y: 1.5
  }, 300, Phaser.Easing.Sinusoidal.InOut, true);
};

JinnDash.Window.prototype.addCloseButton = function () {
  this.closeButton = new JinnDash.Button(205, -140, 'btn_exit', this.closeWindow, this);
  this.buttonsGroup.add(this.closeButton);
};

JinnDash.Window.prototype.gain = function (amount, windowToOpen) {
  this.headIco = game.make.image(0, -215, 'ssheet', 'coin_big');
  this.headIco.anchor.setTo(0.5);
  this.youGainedTxt = new JinnDash.OneLineText(0, -120, 'font', game.lang.getText("You gained"), 50, 400);
  var coinsTxtString = game.lang.getText("#AMOUNT coins");
  coinsTxtString = coinsTxtString.replace("#AMOUNT", amount.toString());
  this.coinsTxt = new JinnDash.OneLineText(0, -50, 'font', coinsTxtString, 65, 400);
  this.yesButton = new JinnDash.Button(0, 110, 'btn_ye', function () {
    JinnDash.player.coin += amount;
    JinnDash.saveGame();
    this.closeWindow();
    game.sfx.cash_register.play();

    if (windowToOpen) {
      this.state.windowsGroup.add(new JinnDash.Window(windowToOpen));
    }
  }, this);
  this.addMultiple([this.headIco, this.youGainedTxt, this.coinsTxt]);
  this.buttonsGroup.add(this.yesButton);
};

JinnDash.Window.prototype.mainMenu = function () {
  this.playButton = new JinnDash.Button(0, -80, 'btn_play', this.state.playButton, this.state);
  this.playButton.onClick.add(this.lockInput, this);
  this.moreGamesButton = new JinnDash.Button(160, 70, 'btn_moregames', function () {
    SG.redirectToPortal(); //window.top.location.href = "http://m.softgames.de";
  });
  this.moreGamesButton.visible = false;
  this.soundButton = new JinnDash.Button(0, 70, game.sound.mute ? 'btn_sound_off' : 'btn_sound_on', function () {
    game.sound.mute = !game.sound.mute;
    JinnDash.saveGame();
    this.loadTexture('ssheet', game.sound.mute ? 'btn_sound_off' : 'btn_sound_on');

    if (game.sound.mute) {
      game.sound.stopAll();
    } else {
      game.sfx.music.play('', 0, game.ie10 ? 1 : 0.3, true);
    }
  });
  this.buttonsGroup.addMultiple([this.playButton, this.soundButton, this.moreGamesButton]);
};

JinnDash.Window.prototype.outOfLives = function () {
  this.bg.height = 500;
  this.bg.cacheAsBitmap = true;
  this.outOfLivesTxt = new JinnDash.OneLineText(0, -160, 'font', game.lang.getText("Out of lives!"), 65, 380);
  var wouldYouLikeString = game.lang.getText('Would you like to continue for #AMOUNT$$?').replace('#AMOUNT', game.settings.costOfLife);
  this.wouldYouLikeTxt = new JinnDash.MultiLineText(0, -80, 'font', wouldYouLikeString, 45, 400, 120);
  this.addMultiple([this.outOfLivesTxt, this.wouldYouLikeTxt]);
  this.yesButton = new JinnDash.Button(0, 140, 'btn_empty', function () {
    this.yesButton.timer.active = false;

    if (JinnDash.player.coin >= game.settings.costOfLife) {
      JinnDash.player.coin -= 100;
      JinnDash.player.life++;
      this.state.rocket.lockedInput = true;
      this.state.ballDispenser.arrowStart();
      game.add.tween(this.state.rocket).to({
        x: 320
      }, 500, Phaser.Easing.Sinusoidal.InOut, true).onComplete.add(function () {
        this.rocket.lockedInput = false;
      }, this.state);
      this.closeWindow();
    } else {
      this.closeWindow();
      this.state.windowsGroup.add(new JinnDash.Window('needMoreMoney', 'outOfLives'));
    }
  }, this);
  this.yesButton.green = game.make.image(-71, -68, 'ssheet', 'btn_empty_green');
  this.yesButton.addChild(this.yesButton.green);
  this.yesButton.label = game.make.image(0, 0, 'ssheet', 'btn_empty_5');
  this.yesButton.label.anchor.setTo(0.5);
  this.yesButton.addChild(this.yesButton.label);
  this.yesButton.timer = {
    seconds: 5,
    secondsFrames: 60,
    active: true,
    cropY: 0,
    cropRect: new Phaser.Rectangle(0, 0, 143, 137)
  };

  this.yesButton.update = function () {
    if (!this.timer.active) return;
    this.timer.secondsFrames--;
    this.timer.cropY += 0.45;
    this.timer.cropRect.y = Math.floor(this.timer.cropY);
    this.green.y = -68 + Math.floor(this.timer.cropY);
    this.green.crop(this.timer.cropRect);

    if (this.timer.secondsFrames == 0) {
      this.timer.seconds--;
      this.timer.secondsFrames = 60;

      if (this.timer.seconds > 0) {
        this.label.loadTexture('ssheet', 'btn_empty_' + this.timer.seconds);
      }
    }

    if (this.timer.seconds == 0) {
      this.timer.active = false;
      this.parent.parent.closeWindow();
      this.parent.parent.state.windowsGroup.add(new JinnDash.Window('gameOver'));
    }
  };

  this.addCloseButton();
  this.closeButton.y -= 30;
  this.closeButton.onClick.add(function () {
    SG_Hooks.triggerMidrollAd(function () {
      this.yesButton.timer.active = false;
      this.state.windowsGroup.add(new JinnDash.Window('gameOver'));
    }.bind(this));
  }, this);
  this.buttonsGroup.add(this.yesButton);
};

JinnDash.Window.prototype.notEnoughCash = function (windowToOpen) {
  this.windowToOpen = windowToOpen;
  this.notEnoughCashTxt = new JinnDash.OneLineText(0, -135, 'font', game.lang.getText("Not enough cash!"), 60, 380);
  this.needMoreTxt = new JinnDash.OneLineText(0, -65, 'font', game.lang.getText("Need more?"), 50, 380);
  this.freeTxt = new JinnDash.OneLineText(0, -5, 'font', game.lang.getText("FREE $$"), 50, 380);
  this.addMultiple([this.notEnoughCashTxt, this.needMoreTxt, this.freeTxt]);
  this.watchButton = new JinnDash.Button(0, 120, 'btn_watch', function () {
    SG_Hooks.triggerIncentivise(function (result) {
      if (result) {
        this.closeWindow();
        this.state.windowsGroup.add(new JinnDash.Window('gain', game.settings.coinsForWatchingAd, this.windowToOpen));
      }
    }.bind(this));
  }, this);
  this.watchButton.addChild(new JinnDash.OneLineText(0, -30, 'font', game.lang.getText("WATCH"), 50, 190));
  this.closeButton = new JinnDash.Button(205, -140, 'btn_exit', function () {
    SG_Hooks.triggerMidrollAd(function () {
      this.closeWindow();
      this.state.windowsGroup.add(new JinnDash.Window(this.windowToOpen));
    }.bind(this));
  }, this);
  this.buttonsGroup.addMultiple([this.watchButton, this.closeButton]);
};

JinnDash.Window.prototype.needMoreMoney = function (windowToOpen) {
  this.windowToOpen = windowToOpen || 'powerUp';
  this.needMoreTxt = new JinnDash.OneLineText(0, -160, 'font', game.lang.getText("Get more coins"), 50, 380);
  this.movieIcon = game.make.image(-80, -40, 'newgfx', 'movie_icon');
  this.movieIcon.anchor.setTo(0.5);
  this.coinIcon1 = game.make.image(70, -30, 'newgfx', 'ui_coin_ico');
  this.coinIcon1.anchor.setTo(0.5);
  this.coinIcon2 = game.make.image(60, -50, 'newgfx', 'ui_coin_ico');
  this.coinIcon2.anchor.setTo(0.5);
  this.equalTxt = new JinnDash.OneLineText(0, -80, 'font', '=', 70, 380);
  this.freeTxt = new JinnDash.OneLineText(0, 25, 'font', game.lang.getText("Watch video to get #AMOUNT$$").replace("#AMOUNT", game.settings.coinsForWatchingAd.toString()), 30, 380);
  this.adNotAvailableText = new JinnDash.OneLineText(0, 25, 'font', game.lang.getText("ad_unavailable"), 30, 380);
  this.adNotAvailableText.visible = false;
  this.addMultiple([this.needMoreTxt, this.freeTxt, this.movieIcon, this.coinIcon1, this.coinIcon2, this.equalTxt, this.adNotAvailableText]);
  this.watchButton = new JinnDash.Button(0, 130, 'btn_big_green', function () {
    SG_Hooks.triggerIncentivise(function (result) {
      if (result) {
        this.closeWindow();
        this.state.windowsGroup.add(new JinnDash.Window('gain', game.settings.coinsForWatchingAd, this.windowToOpen));
      } else {
        this.adNotAvailableText.visible = true;
        this.freeTxt.visible = false;
        this.watchButton.alpha = 0.5;
        this.watchButton.input.enabled = false;
      }
    }.bind(this));
  }, this);
  this.closeButton = new JinnDash.Button(205, -140, 'btn_exit', function () {
    SG_Hooks.triggerMidrollAd(function () {
      this.adNotAvailableText.visible = false;
      this.freeTxt.visible = true;
      this.watchButton.alpha = 1;
      this.watchButton.input.enabled = true;
      this.closeWindow();
      this.state.windowsGroup.add(new JinnDash.Window(this.windowToOpen));
    }.bind(this));
  }, this);
  this.watchButton.addChild(new JinnDash.OneLineText(0, -30, 'font', game.lang.getText("Continue"), 50, 190));
  this.buttonsGroup.addMultiple([this.watchButton, this.closeButton]);
};

JinnDash.Window.prototype.gameOver = function () {
  SG_Hooks.gameOver(this.state.lvl, 0);
  game.sfx.lose.play();
  this.gameOverTxt = new JinnDash.OneLineText(0, -100, 'font', game.lang.getText("Game Over"), 70, 380);
  this.add(this.gameOverTxt);
  this.menuButton = new JinnDash.Button(-80, 90, 'btn_menu', function () {
    game.sfx.transition.play();
    this.lockInput();
    game.add.tween(this.state.fade).to({
      alpha: 1
    }, 500, Phaser.Easing.Sinusoidal.In, true).onComplete.add(function () {
      SG_Hooks.triggerMidrollAd(function () {
        game.state.start("WorldMap");
      }.bind(this));
    });
  }, this);
  this.replyButton = new JinnDash.Button(80, 90, 'btn_replay', function () {
    game.paused = true;
    SG_Hooks.playButtonPressed(function () {
      game.paused = false;
      game.sfx.transition.play();
      this.lockInput();
      game.add.tween(this.state.fade).to({
        alpha: 1
      }, 500, Phaser.Easing.Sinusoidal.In, true).onComplete.add(function () {
        SG_Hooks.triggerMidrollAd(function () {
          game.state.start("Game", true, false, this.state.lvl);
        }.bind(this));
      }, this);
    }.bind(this));
  }, this);
  this.replyButton.visible = false;
  SG_Hooks.beforePlayButtonDisplay(function () {
    this.replyButton.visible = true;
  }.bind(this));
  this.buttonsGroup.addMultiple([this.menuButton, this.replyButton]);
};

JinnDash.Window.prototype.pause = function () {
  this.gameOverTxt = new JinnDash.OneLineText(0, -180, 'font', game.lang.getText("Pause"), 70, 380);
  this.add(this.gameOverTxt);
  this.soundButton = new JinnDash.Button(-80, -30, game.sound.mute ? 'btn_sound_off' : 'btn_sound_on', function () {
    game.sound.mute = !game.sound.mute;
    JinnDash.saveGame();
    this.loadTexture('ssheet', game.sound.mute ? 'btn_sound_off' : 'btn_sound_on');

    if (game.sound.mute) {
      game.sound.stopAll();
    } else {
      game.sfx.music.play('', 0, game.ie10 ? 1 : 0.3, true);
    }
  });
  this.shopButton = new JinnDash.Button(80, -30, 'btn_shop', function () {
    this.closeWindow();
    this.state.windowsGroup.add(new JinnDash.Window('powerUp', false));
  }, this);
  this.menuButton = new JinnDash.Button(-160, 100, 'btn_menu', function () {
    this.lockInput();
    game.sfx.transition.play();
    game.add.tween(this.state.fade).to({
      alpha: 1
    }, 500, Phaser.Easing.Sinusoidal.In, true).onComplete.add(function () {
      SG_Hooks.triggerMidrollAd(function () {
        game.state.start("WorldMap");
      }.bind(this));
    });
  }, this);
  this.playButton = new JinnDash.Button(0, 100, 'btn_play_vsmall', function () {
    SG_Hooks.triggerMidrollAd(function () {
      this.closeWindow();
    }.bind(this));
  }, this);
  this.replyButton = new JinnDash.Button(160, 100, 'btn_replay', function () {
    this.lockInput();
    game.sfx.transition.play();
    game.add.tween(this.state.fade).to({
      alpha: 1
    }, 500, Phaser.Easing.Sinusoidal.In, true).onComplete.add(function () {
      SG_Hooks.triggerMidrollAd(function () {
        game.state.start("Game", true, false, this.state.lvl);
      }.bind(this));
    }, this);
  }, this);
  this.buttonsGroup.addMultiple([this.menuButton, this.replyButton, this.soundButton, this.playButton, this.shopButton]);
};

JinnDash.Window.prototype.level = function (lvl) {
  this.bg.scale.setTo(1.1);
  this.levelTxt = new JinnDash.OneLineText(0, -210, 'font', game.lang.getText("Level") + ' ' + lvl, 70, 380);
  var txt = game.selectedLang == 'ja' ? JinnDash.levels[lvl].goal.toString() + ' ' + game.lang.getText('Destroy') : game.lang.getText('Destroy') + ' ' + JinnDash.levels[lvl].goal;
  this.destroyTxt = new JinnDash.OneLineText2(0, -110, 'font', txt, 35, 600, 0, 0.5);
  this.bricksIco = game.add.image(0, -110, 'newgfx', 'ui_bricks_ico');
  this.bricksIco.anchor.setTo(0, 0.5);
  var startX = (this.destroyTxt.width + 10 + this.bricksIco.width) * -0.5;
  this.destroyTxt.x = startX;
  this.bricksIco.x = this.destroyTxt.x + this.destroyTxt.width + 10;
  this.addMultiple([this.levelTxt, this.destroyTxt, this.bricksIco]);
  this.stars_0 = game.make.image(-120, 5, 'ssheet', 'star');
  this.stars_2 = game.make.image(120, 5, 'ssheet', 'star');
  this.stars_1 = game.make.image(0, -15, 'ssheet', 'star');
  this.stars = [this.stars_0, this.stars_1, this.stars_2];
  this.stars.forEach(function (child, index) {
    child.anchor.setTo(0.5);

    if (!(index < JinnDash.player.levels[lvl])) {
      child.alpha = 0.3;
    }
  });
  this.addMultiple(this.stars);
  this.playButton = new JinnDash.Button(0, 140, 'btn_play_small', function (lvl) {
    return function () {
      this.lockInput();
      game.sfx.transition.play();
      game.add.tween(this.state.fade).to({
        alpha: 1
      }, 500, Phaser.Easing.Sinusoidal.In, true).onComplete.add(function () {
        game.state.start("Game", true, false, lvl);
      });
    };
  }(lvl), this);
  this.addCloseButton();
  this.closeButton.x += 15;
  this.closeButton.y -= 15;
  this.closeButton.onClick.add(function () {
    SG_Hooks.triggerMidrollAd(function () {}.bind(this));
  }, this);
  this.buttonsGroup.add(this.playButton);
};

JinnDash.Window.prototype.finishedLevel = function (stars) {
  this.y += 250;
  this.levelTxt = new JinnDash.OneLineText(0, -180, 'font', game.lang.getText("Level") + ' ' + this.state.lvl, 70, 380);
  this.add(this.levelTxt);
  this.starsNr = stars;
  this.stars_0 = game.make.image(-100, -30, 'ssheet', 'star');
  this.stars_2 = game.make.image(100, -30, 'ssheet', 'star');
  this.stars_1 = game.make.image(0, -50, 'ssheet', 'star');
  SG_Hooks.levelFinished(this.state.lvl, this.state.UIbar.pointsController.points);
  SG_Hooks.setStorageItem("level_observer", this.state.lvl + 1);
  this.scoreTxt = new JinnDash.OneLineText(0, 20, 'font', game.lang.getText("Score") + ': ' + this.state.UIbar.pointsController.points, 40, 380);
  this.scoreTxt.alpha = 0;
  this.add(this.scoreTxt);
  this.star_emitter = this.star_emitter = game.add.emitter(0, 0, 50);
  this.star_emitter.makeParticles('ssheet', 'star_emitter');
  this.star_emitter.setSize(25, 25);
  this.star_emitter.setXSpeed(-400, 400);
  this.star_emitter.setYSpeed(-800, 150);
  this.star_emitter.setRotation(-10, 10);
  this.star_emitter.setScale(2, 4, 2, 4, 1500);
  this.star_emitter.setAlpha(1, 0, 1500);
  this.star_emitter.gravity = 800;
  this.stars = [this.stars_0, this.stars_1, this.stars_2];
  this.stars.forEach(function (child, index) {
    child.anchor.setTo(0.5);
    child.scale.setTo(0);
    game.add.tween(child.scale).to({
      x: 0.8,
      y: 0.8
    }, 300, Phaser.Easing.Sinusoidal.Out, true, 800 + index * 300).onStart.add(function () {
      game.sfx.l_pop.play();
      var s = this['stars_' + index];

      if (s.alpha > 0.5) {
        this.star_emitter.emitX = 320 + s.x;
        this.star_emitter.emitY = s.parent.y + s.y;
        this.star_emitter.explode(1500, 10);
      }
    }, this);

    if (!(index < stars)) {
      child.alpha = 0.3;
    }
  }, this);
  this.addMultiple(this.stars);
  game.time.events.add(1700, function () {
    this.playButton = new JinnDash.Button(80, 130, 'btn_play_vsmall', function () {
      SG_Hooks.levelUp(this.state.lvl, this.state.UIbar.pointsController.points);
      game.paused = true;
      SG_Hooks.playButtonPressed(function () {
        game.paused = false;
        game.sfx.transition.play();
        this.lockInput();
        game.add.tween(this.state.fade).to({
          alpha: 1
        }, 500, Phaser.Easing.Sinusoidal.In, true).onComplete.add(function () {
          if (this.state.lvl == 30) {
            game.state.start("WorldMap");
          } else {
            game.state.start("Game", true, false, this.state.lvl + 1);
          }
        }, this);
      }.bind(this));
    }, this);
    this.buttonsGroup.add(this.playButton);
    this.playButton.visible = false;
    SG_Hooks.beforePlayButtonDisplay(function () {
      this.playButton.visible = true;
    }.bind(this));
    this.replayButton = new JinnDash.Button(-80, 130, 'btn_replay', function () {
      game.sfx.transition.play();
      this.lockInput();
      game.add.tween(this.state.fade).to({
        alpha: 1
      }, 500, Phaser.Easing.Sinusoidal.In, true).onComplete.add(function () {
        SG_Hooks.triggerMidrollAd(function () {
          game.state.start("Game", true, false, this.state.lvl);
        }.bind(this));
      }, this);
    }, this);
    this.playButton.scale.setTo(0);
    this.replayButton.scale.setTo(0);
    game.add.tween(this.replayButton.scale).to({
      x: 1,
      y: 1
    }, 300, Phaser.Easing.Sinusoidal.Out, true);
    game.add.tween(this.scoreTxt).to({
      alpha: 1
    }, 300, Phaser.Easing.Sinusoidal.Out, true);
    game.add.tween(this.playButton.scale).to({
      x: 1,
      y: 1
    }, 300, Phaser.Easing.Sinusoidal.Out, true);
    this.buttonsGroup.add(this.replayButton);
  }, this);
  this.addCloseButton();
  this.closeButton.onClick.add(function () {
    this.lockInput();
    game.sfx.transition.play();
    game.add.tween(this.state.fade).to({
      alpha: 1
    }, 500, Phaser.Easing.Sinusoidal.In, true).onComplete.add(function () {
      SG_Hooks.triggerMidrollAd(function () {
        game.state.start("WorldMap");
      }.bind(this));
    });
  }, this);
};

JinnDash.Window.prototype.youNeedToBuyALife = function () {
  this.youNeedTxt = new JinnDash.MultiLineText(0, -100, 'font', game.lang.getText("You need to buy a life to play!"), 50, 400, 180);
  this.add(this.youNeedTxt);
  this.okButton = new JinnDash.Button(0, 120, 'btn_watch', function () {
    this.state.windowsGroup.add(new JinnDash.Window('powerUp'));
    this.closeWindow();
  }, this);
  this.okButton.addChild(new JinnDash.OneLineText(0, -30, 'font', game.lang.getText("OK"), 50, 190));
  this.buttonsGroup.add(this.okButton);
};
/*

POWER UP with extra lives

JinnDash.Window.prototype.powerUp = function(backToMainScreen) {
	this.y -= 40;
	this.bg.height = 550;
	this.bg.y = 65;
	this.bg.cacheAsBitmap = true;


	this.dblDropBtn = new JinnDash.Button(0,-80,'btn_long_3',function() {
		game.sfx.cash_register.play();
		this.state.doubleDrop = true;
		JinnDash.player.coin -= game.settings.priceOfDoubleDrop;
		JinnDash.saveGame();

	},this);
	this.dblDropBtn.price = game.settings.priceOfDoubleDrop;
	this.dblDropBtn.addTerm(function() {return JinnDash.player.coin >= this.price},this.dblDropBtn);
	this.dblDropBtn.addTerm(function() {return !this.state.doubleDrop},this);
	this.dblDropBtn.update = function() {
		this.alpha = (JinnDash.player.coin < this.price || this.state.doubleDrop) ? Math.max(0.5,this.alpha-0.02) : Math.min(1,this.alpha+0.02);
	};

	this.dblDropTxt = new JinnDash.OneLineText2(0,0,'font',game.lang.getText('+50% drops!'),50,370,0.5,0.5);
	this.dblDropBtn.addChild(this.dblDropTxt);

	this.dblDropPrice = new JinnDash.OneLineText2(15,0,'font',game.settings.priceOfDoubleDrop+'$$',35,200,0.5,0.5);


	this.addLifesBtn = new JinnDash.Button(-80,90,'btn_long_2',function() {
		game.sfx.cash_register.play();
		JinnDash.player.coin -= game.settings.priceOfLives;
		JinnDash.player.life = Math.min(99,JinnDash.player.life+3);
		JinnDash.saveGame();
	},this);
	this.addLifesBtn.update = function() {
		this.alpha = JinnDash.player.coin < this.price ? Math.max(0.5,this.alpha-0.02) : Math.min(1,this.alpha+0.02);
	};
	this.addLifesBtn.addTerm(function() {return JinnDash.player.coin >= this.price},this.addLifesBtn);
	this.addLifesBtn.price = game.settings.priceOfLives;
	this.lifesLabelTxt = new JinnDash.OneLineText2(-35,0,'font','+3',60,200,0.5,0.5);
	this.addLifesBtn.addChild(this.lifesLabelTxt);
	this.lifesIco = game.make.image(35,0,'newgfx','ui_heart_ico');
	this.lifesIco.anchor.setTo(0.5,0.5);
	this.lifesIco.scale.x = -1.5;
	this.lifesIco.scale.y = 1.5;
	this.addLifesBtn.addChild(this.lifesIco);

	this.lifePrice = new JinnDash.OneLineText2(-65,170,'font',game.settings.priceOfLives+'$$',35,200,0.5,0.5);

	this.addMultiple([this.dblDropPrice,this.lifePrice]);


	if (game.incentivise) {
		this.extraMoneyB = new JinnDash.Button(140,90,'more_coin_green_btn',function() {
			this.closeWindow();
			this.state.windowsGroup.add(new JinnDash.Window('needMoreMoney'));
		},this);
		this.buttonsGroup.add(this.extraMoneyB);
	}


	this.playButton = new JinnDash.Button(0,260,'btn_play_vsmall',function() {
		this.closeWindow();
		//this.state.powerUpLauncher.refresh();
	},this);

	this.buttonsGroup.addMultiple([this.playButton,this.dblDropBtn,this.addLifesBtn]);

	this.addCloseButton();
	this.closeButton.x = 220;
	this.closeButton.y = -150;

	if (backToMainScreen) {
		this.closeButton.onClick.add(function(){
		this.lockInput();
		game.sfx.transition.play();
		game.add.tween(this.state.fade).to({alpha: 1}, 500,Phaser.Easing.Sinusoidal.In,true).onComplete.add(function() {
			game.state.start("WorldMap");
		});
		},this)
	}else {
		this.closeButton.onClick.add(function() {
			this.closeWindow();
			this.state.windowsGroup.add(new JinnDash.Window('pause'));
		},this)
	}

}

JinnDash.Window.prototype.powerUpNoFade = function(backToMainScreen) {
	this.powerUp(backToMainScreen);
};

*/


JinnDash.Window.prototype.powerUp = function (backToMainScreen) {
  this.y -= 40;
  this.bg.height = 550;
  this.bg.y = 65;
  this.bg.cacheAsBitmap = true;
  this.offerBg = game.make.image(0, 0, 'newgfx', 'offer_bg');
  this.offerBg.anchor.setTo(0.5);
  this.add(this.offerBg);
  this.dblDropTxt = new JinnDash.OneLineText2(0, -40, 'font', '', 60, 400, 0.5, 0.5);
  this.dblDropPrice = new JinnDash.OneLineText2(0, 40, 'font', '', 45, 200, 0, 0.5);
  this.dblDropIco = game.make.image(0, 40, 'newgfx', 'ui_coin_ico');
  this.dblDropIco.anchor.setTo(0, 0.5);
  this.dblDropIco.height = 45;
  this.dblDropIco.scale.x = this.dblDropIco.scale.y;
  this.addMultiple([this.dblDropTxt, this.dblDropPrice, this.dblDropIco]);
  this.powerUpUpdateDbl(this.state.dropChanceMultiLevel + 1);
  this.buyButton = new JinnDash.Button(-120, 210, 'btn_big_green', function () {
    var coins = game.settings.dropChanceLevels[this.state.dropChanceMultiLevel + 1][1];

    if (JinnDash.player.coin >= coins) {
      game.sfx.cash_register.play();
      JinnDash.player.coin -= coins;
      JinnDash.saveGame();
      this.state.dropChanceMultiLevel++;
      this.powerUpUpdateDbl(this.state.dropChanceMultiLevel + 1);
    } else {
      if (game.incentivise) {
        this.closeWindow();
        this.state.windowsGroup.add(new JinnDash.Window('needMoreMoney', 'powerUp'));
      }
    }
  }, this);

  this.buyButton.update = function () {
    if (this.state.dropChanceMultiLevel == game.settings.dropChanceLevels.length - 1) {
      this.alpha = 0.5;
    } else {
      this.alpha = 1;
    }
  };

  if (this.state.doubleDrop) {
    this.buyButton.alpha = 0.5;
    this.buyButton.inputEnabled = false;
  }

  this.buyButton.addTerm(function () {
    return this.state.dropChanceMultiLevel != game.settings.dropChanceLevels.length - 1;
  }, this);
  this.buyButton.label = new JinnDash.OneLineText2(0, 0, 'font', game.lang.getText('Buy'), 40, 200, 0.5, 0.5);
  this.buyButton.addChild(this.buyButton.label);
  this.continueButton = new JinnDash.Button(120, 210, 'btn_big_continue', function () {
    SG_Hooks.triggerMidrollAd(function () {
      this.closeWindow();

      if (!backToMainScreen) {
        this.state.windowsGroup.add(new JinnDash.Window('pause'));
      }
    }.bind(this));
  }, this);
  this.continueButton.label = new JinnDash.OneLineText2(0, 0, 'font', game.lang.getText('Continue'), 40, 200, 0.5, 0.5);
  this.continueButton.addChild(this.continueButton.label);
  this.buttonsGroup.addMultiple([this.buyButton, this.continueButton]);
  /*
  	this.addCloseButton();
  this.closeButton.x = 220;
  this.closeButton.y = -150;
  	if (backToMainScreen) {
  	this.closeButton.onClick.add(function(){
  		this.closeWindow();
  	},this)
  }else {
  	this.closeButton.onClick.add(function() {
  		this.closeWindow();
  		this.state.windowsGroup.add(new JinnDash.Window('pause'));
  	},this)
  }*/
};

JinnDash.Window.prototype.powerUpNoFade = function (backToMainScreen) {
  this.powerUp(backToMainScreen);
};

JinnDash.Window.prototype.powerUpUpdateDbl = function (level) {
  level = Math.min(level, game.settings.dropChanceLevels.length - 1);
  var txt = game.lang.getText('+50% drops!');
  var chances = (game.settings.dropChanceLevels[level][0] - 1) * 100;
  txt = txt.replace('50', chances);
  this.dblDropTxt.setText(txt);
  this.dblDropPrice.setText(game.settings.dropChanceLevels[level][1].toString());
  var startX = (this.dblDropPrice.width + 10 + this.dblDropIco.width) * -0.5;
  this.dblDropPrice.x = startX;
  this.dblDropIco.x = startX + this.dblDropPrice.width + 10;
};

JinnDash.WorldMap = function (game) {
  this.bg;
  this.spriteTopLeft;
  this.spriteTopRight;
  this.spriteBottomLeft;
  this.spriteBottomRight;
};

JinnDash.WorldMap.prototype = {
  create: function create() {
    this.mapBg = game.add.image(-1180, 0, 'ssheet', 'map_strip');
    this.mapBg.width = 3000;
    this.mapBg.cacheAsBitmap = true;
    this.mapHeight = game.cache.getFrame('map').height;
    this.mapGroup = game.add.group();
    this.map = game.add.image(320, 0, 'map');
    this.map.anchor.setTo(0.5, 0);
    this.mapGroup.add(this.map);
    this.pointHl = game.make.image(0, 0, 'ssheet', 'map_point_hl');
    this.pointHl.alpha = 0;
    this.pointHl.anchor.setTo(0.5, 0.45);
    this.mapGroup.add(this.pointHl);
    this.points = game.add.group();
    this.mapGroup.add(this.points);
    this.jinn = new JinnDash.JinnMap();
    this.mapGroup.add(this.jinn);
    this.followJinn = true;
    this.initPoints();
    var yOfLast = this.points.children[this.points.children.length - 1].y;
    this.mapGroup.y = (yOfLast - 400) * -1;
    this.mapGroup.y = game.math.clamp(this.mapGroup.y, 960 - this.mapHeight, 0);
    this.soundButton = new JinnDash.Button(570, 50, game.sound.mute ? 'btn_sound_off_small' : 'btn_sound_on_small', function () {
      game.sound.mute = !game.sound.mute;
      JinnDash.saveGame();
      this.loadTexture('ssheet', game.sound.mute ? 'btn_sound_off_small' : 'btn_sound_on_small');

      if (game.sound.mute) {
        game.sound.stopAll();
      } else {
        game.sfx.music.play('', 0, game.ie10 ? 1 : 0.3, true);
      }
    });
    this.soundButton.addTerm(function () {
      return this.windowsGroup.length == 0;
    }, this);
    game.add.existing(this.soundButton);
    this.backToScreen = new JinnDash.Button(470, 50, 'btn_menu_small', function () {
      game.sfx.transition.play();
      game.add.tween(this.fade).to({
        alpha: 1
      }, 500, Phaser.Easing.Sinusoidal.In, true).onComplete.add(function () {
        SG_Hooks.triggerMidrollAd(function () {
          game.state.start("MainMenu");
        }.bind(this));
      });
    }, this);
    this.backToScreen.addTerm(function () {
      return this.windowsGroup.length == 0;
    }, this);
    game.add.existing(this.backToScreen);
    this.shader = game.add.image(-1180, 0, 'ssheet', 'shader');
    this.shader.width = 3000;
    this.shader.height = 960;
    this.shader.cacheAsBitmap = true;
    this.shader.alpha = 0;
    this.windowsGroup = game.add.group();
    this.fade = game.add.image(-1180, 0, 'ssheet', 'fade');
    this.fade.width = 3000;
    this.fade.height = 960;
    this.fade.alpha = 1;
    this.fade.cacheAsBitmap = true;
    game.add.tween(this.fade).to({
      alpha: 0
    }, 800, Phaser.Easing.Sinusoidal.In, true);
    this.prevY = null;
    this.resize();
  },
  update: function update() {
    /*
    if (this.cursors.down.isDown) {
    	this.mapGroup.y -= 5;
    }
    	if (this.cursors.up.isDown) {
    	this.mapGroup.y += 5;
    }
    */
    this.shader.alpha = this.windowsGroup.length > 0 ? Math.min(0.7, this.shader.alpha + 0.03) : Math.max(0, this.shader.alpha - 0.06);

    if (game.input.activePointer.isDown && this.windowsGroup.children.length == 0) {
      this.followJinn = false;

      if (this.prevY != null) {
        this.mapGroup.y += (game.input.activePointer.y - this.prevY) * 2;
      }

      this.prevY = game.input.activePointer.y;
    } else {
      this.prevY = null;
    }

    if (this.followJinn) {
      this.mapGroup.y = -(this.jinn.y - 480);
    }

    this.mapGroup.y = game.math.clamp(this.mapGroup.y, 960 - this.mapHeight, 0);
  },
  highlightLevel: function highlightLevel(lvl) {
    this.pointHl.x = this.points.children[lvl].x;
    this.pointHl.y = this.points.children[lvl].y;
    game.add.tween(this.pointHl).to({
      alpha: 0.5
    }, 200, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
  },
  resize: function resize() {
    if (!game.device.desktop) {
      game.add.existing(new JinnDash.TurnDevice());
    }
  },
  initPoints: function initPoints() {
    var stars, xx, yy, point;

    for (var i = 0; i < 31; i++) {
      stars = JinnDash.player.levels[i];
      xx = JinnDash.mapPointCord[i][0];
      yy = JinnDash.mapPointCord[i][1];

      if (i == 0) {
        point = game.add.image(xx, yy, 'ssheet', 'map_lvl_point_start');
        point.scale.setTo(0.35);
        point.anchor.setTo(0.5);
        point.tint = 0xBBBBBB;
        this.points.add(point);
        continue;
      } else {
        point = game.add.button(xx, yy, null, function (lvl) {
          return function () {
            if (this.windowsGroup.length > 0) return;

            if (!this.jinn.jumping && this.jinn.lvl == lvl) {
              return this.windowsGroup.add(new JinnDash.Window('level', lvl));
            }

            if (!this.jinn.jumping && !this.jinn.locked) {
              this.highlightLevel(lvl);
              game.time.events.add(500, function () {
                this.windowsGroup.add(new JinnDash.Window('level', lvl));
              }, this);
              this.jinn.jump(lvl);
            }
          };
        }(i), this);
        point.lvl = i;
        point.scale.setTo(0.35);
        point.anchor.setTo(0.5);
        this.points.add(point);

        if (stars > 0) {
          point.loadTexture('ssheet', 'map_lvl_point_3stars');
          if (i == 30) this.jinn.init(i);
        } else {
          point.loadTexture('ssheet', 'map_lvl_point2');
          this.jinn.init(i);
          break;
          /*
          this.jinn.locked = true;
          game.time.events.add(1000,(function() {
          	return function() {
          	this.jinn.locked = false;
          	this.jinn.jump(i);
          	game.time.events.add(500,function() {
          		this.windowsGroup.add(new JinnDash.Window('level',i))
          	},this)
          	}
          })(i),this);
          }*/
        }
      }
    }
  }
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd define */
/******/ 	(() => {
/******/ 		__webpack_require__.amdD = function () {
/******/ 			throw new Error('define cannot be used indirect');
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(594);
/******/ 	
/******/ })()
;