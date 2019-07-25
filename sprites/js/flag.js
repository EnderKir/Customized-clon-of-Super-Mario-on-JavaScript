(function() {
  if (typeof Mario === "undefined") window.Mario = {};

  Flag = Mario.Flag = function(pos) {
    // флаги всегда имеют одинаковую Y позицию
    this.pos = [pos, 49];
    this.hitbox = [0, 0, 0, 0];
    this.vel = [0, 0];
    this.acc = [0, 0];
  };

  // Заготовочка для стлокновения со стеной, не знаю нафига))0
  Flag.prototype.collideWall = function() {};

  // Обновление каждого кадра
  Flag.prototype.update = function(dt) {
    if (!this.done && this.pos[1] >= 170) {
      this.vel = [0, 0];
      this.pos[1] = 170;
      player.exit();
      this.done = true;
    }
    this.pos[1] += this.vel[1];
  };

  // Поиск столкновений ( с игроком )
  Flag.prototype.checkCollisions = function() {
    this.isPlayerCollided();
  };

  // Столкнулись с игроком?
  Flag.prototype.isPlayerCollided = function() {
    if (this.hit) return;
    if (player.pos[0] + 8 >= this.pos[0]) {
      this.hit = true;
      player.flag();
      this.vel = [0, 2];
    }
  };

  // Отрисовочка
  Flag.prototype.render = function() {
    level.flagpoleSprites[2].render(ctx, this.pos[0] - 8, this.pos[1], vX, vY);
  };
})();
