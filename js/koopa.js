(function() {
  if (typeof Mario === "undefined") window.Mario = {};

  var Koopa = (Mario.Koopa = function(pos, sprite, para) {
    this.dying = false;
    this.shell = false;

    this.para = para; //para. As in, is it a paratroopa?

    //So, funny story. The actual hitboxes don't reach all the way to the ground.
    //What that means is, as long as I use them to keep things on the floor
    //making the hitboxes accurate will make enemies sink into the ground.
    Mario.Entity.call(this, {
      pos: pos,
      sprite: sprite,
      hitbox: [2, 8, 12, 24]
    });
    this.vel[0] = -0.5;
    this.idx = level.enemies.length;
  });
  // Отрисовка
  Koopa.prototype.render = function(ctx, vX, vY) {
    this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
  };
  // Обновление каждого кадра
  Koopa.prototype.update = function(dt, vX) {
    if (this.turn) {
      this.vel[0] = -this.vel[0];
      this.turn = false;
    }
    if (this.vel[0] != 0) {
      this.left = this.vel[0] < 0;
    }

    if (this.left) {
      this.sprite.img = "sprites/enemy.png";
    } else {
      this.sprite.img = "sprites/enemyr.png";
    }

    if (this.pos[0] - vX > 336) {
      // Если мы слишком далеко - не делаем ничего
      return;
    } else if (this.pos[0] - vX < -32) {
      delete level.enemies[this.idx];
    }

    if (this.dying) {
      this.dying -= 1;
      if (!this.dying) {
        delete level.enemies[this.idx];
      }
    }

    if (this.shell) {
      if (this.vel[0] == 0) {
        this.shell -= 1;
        if (this.shell < 120) {
          this.sprite.speed = 5;
        }
        if (this.shell == 0) {
          this.sprite = level.koopaSprite();
          this.hitbox = [2, 8, 12, 24];
          if (this.left) {
            this.sprite.img = "sprites/enemyr.png";
            this.vel[0] = 0.5;
            this.left = false;
          } else {
            this.vel[0] = -0.5;
            this.left = true;
          }
          this.pos[1] -= 16;
        }
      } else {
        this.shell = 360;
        this.sprite.speed = 0;
        this.sprite.setFrame(0);
      }
    }
    this.acc[1] = 0.2;
    this.vel[1] += this.acc[1];
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.sprite.update(dt);
  };
  // Столкнулись со стеной
  Koopa.prototype.collideWall = function() {
    // Это мешаем нам перевернуть один и тот же кадр, если столкнемся с несколькими плитами одновременно
    this.turn = true;
  };

  // Проверка столкновения
  Koopa.prototype.checkCollisions = function() {
    var h = this.shell ? 1 : 2;
    if (this.pos[1] % 16 !== 0) {
      h += 1;
    }
    var w = this.pos[0] % 16 === 0 ? 1 : 2;

    var baseX = Math.floor(this.pos[0] / 16);
    var baseY = Math.floor(this.pos[1] / 16);

    if (baseY + h > 15) {
      delete level.enemies[this.idx];
      return;
    }

    if (this.flipping) {
      return;
    }

    for (var i = 0; i < h; i++) {
      for (var j = 0; j < w; j++) {
        if (level.statics[baseY + i][baseX + j]) {
          level.statics[baseY + i][baseX + j].isCollideWith(this);
        }
        if (level.blocks[baseY + i][baseX + j]) {
          level.blocks[baseY + i][baseX + j].isCollideWith(this);
        }
      }
    }
    var that = this;
    level.enemies.forEach(function(enemy) {
      if (enemy === that) {
        // Не проверяем столкновение с самим собой.
        return;
      } else if (enemy.pos[0] - vX > 336) {
        // Прекращаем проверку если далеко
        return;
      } else {
        that.isCollideWith(enemy);
      }
    });
    this.isCollideWith(player);
  };

  // C кем-то столкнулись
  Koopa.prototype.isCollideWith = function(ent) {
    if (ent instanceof Mario.Player && (this.dying || ent.invincibility)) {
      return;
    }

    // Первые два элемента в hitbox - смещение, то найдём координаты
    var hpos1 = [this.pos[0] + this.hitbox[0], this.pos[1] + this.hitbox[1]];
    var hpos2 = [ent.pos[0] + ent.hitbox[0], ent.pos[1] + ent.hitbox[1]];

    // Если hibox перекрываются
    if (
      !(
        hpos1[0] > hpos2[0] + ent.hitbox[2] ||
        hpos1[0] + this.hitbox[2] < hpos2[0]
      )
    ) {
      if (
        !(
          hpos1[1] > hpos2[1] + ent.hitbox[3] ||
          hpos1[1] + this.hitbox[3] < hpos2[1]
        )
      ) {
        if (ent instanceof Mario.Player) {
          if (ent.vel[1] > 0) {
            player.bounce = true;
          }
          if (this.shell) {
            if (this.vel[0] === 0) {
              if (ent.left) {
                this.vel[0] = -4;
              } else {
                this.vel[0] = 4;
              }
            } else {
              if (ent.bounce) {
                this.vel[0] = 0;
              } else ent.damage();
            }
          } else if (ent.vel[1] > 0) {
            // существо "скуричевается"
            this.stomp();
          } else {
            // Игрок получает урон
            ent.damage();
          }
        } else {
          if (this.shell && ent instanceof Mario.Goomba) {
            ent.bump();
          } else this.collideWall();
        }
      }
    }
  };

  // Столкновение
  Koopa.prototype.stomp = function() {
    // Превращаемся в раковину, а если уже раковина, то наносим удар
    player.bounce = true;
    if (this.para) {
      this.para = false;
      this.sprite.pos[0] -= 32;
    } else {
      this.shell = 360;
      this.sprite.pos[0] += 64;
      this.sprite.pos[1] += 16;
      this.sprite.size = [16, 16];
      this.hitbox = [2, 0, 12, 16];
      this.sprite.speed = 0;
      this.frames = [0, 1];
      this.vel = [0, 0];
      this.pos[1] += 16;
    }
  };

  // Удар
  Koopa.prototype.bump = function() {
    if (this.flipping) return;
    this.flipping = true;
    this.sprite.pos = [160, 0];
    this.sprite.size = [16, 16];
    this.hitbox = [2, 0, 12, 16];
    this.sprite.speed = 0;
    this.vel[0] = 0;
    this.vel[1] = -2.5;
  };
})();
