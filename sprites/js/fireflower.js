(function() {
  if (typeof Mario === "undefined") window.Mario = {};

  var Fireflower = (Mario.Fireflower = function(pos) {
    this.spawning = false;
    this.waiting = 0;

    Mario.Entity.call(this, {
      pos: pos,
      sprite: level.fireFlowerSprite,
      hitbox: [0, 0, 16, 16]
    });
  });

  // Объект Цветок наследуется от Mario.Entity
  Mario.Util.inherits(Fireflower, Mario.Entity);

  // Отрисовочка цветка
  Fireflower.prototype.render = function(ctx, vX, vY) {
    if (this.spawning > 1) return;
    this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
  };
  // Спавним на карту
  Fireflower.prototype.spawn = function() {
    this.idx = level.items.length;
    level.items.push(this);
    this.spawning = 12;
    this.targetpos = [];
    this.targetpos[0] = this.pos[0];
    this.targetpos[1] = this.pos[1] - 16;
  };

  // Обновляем каждый кадр
  Fireflower.prototype.update = function(dt) {
    if (this.spawning > 1) {
      this.spawning -= 1;
      if (this.spawning == 1) this.vel[1] = -0.5;
      return;
    }
    if (this.spawning) {
      if (this.pos[1] <= this.targetpos[1]) {
        this.pos[1] = this.targetpos[1];
        this.vel[1] = 0;
        this.spawning = 0;
      }
    }

    this.vel[1] += this.acc[1];
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.sprite.update(dt); // Рекурсия!
  };

  // Проверем столкновение
  Fireflower.prototype.checkCollisions = function() {
    if (this.spawning) {
      return; // Нет цветка - нет проблем
    }
    this.isPlayerCollided();
  };

  // Добрался ли до цветка игрок
  Fireflower.prototype.isPlayerCollided = function() {
    //Так как hitbox - это смещение, то сразу найдём координаты
    var hpos1 = [this.pos[0] + this.hitbox[0], this.pos[1] + this.hitbox[1]];
    var hpos2 = [
      player.pos[0] + player.hitbox[0],
      player.pos[1] + player.hitbox[1]
    ];

    //Если hitbox перекрывают друг друга
    if (
      !(
        hpos1[0] > hpos2[0] + player.hitbox[2] ||
        hpos1[0] + this.hitbox[2] < hpos2[0]
      )
    ) {
      if (
        !(
          hpos1[1] > hpos2[1] + player.hitbox[3] ||
          hpos1[1] + this.hitbox[3] < hpos2[1]
        )
      ) {
        // Увеличиваем игроку уровень
        player.powerUp(this.idx);
      }
    }
  };

  //Это нигде не использую, так как цветок статичен, но если захотеть...
  Fireflower.prototype.bump = function() {};
})();
