(function() {
  if (typeof Mario === "undefined") window.Mario = {};

  var Coin = (Mario.Coin = function(pos, sprite) {
    Mario.Entity.call(this, {
      pos: pos,
      sprite: sprite,
      hitbox: [0, 0, 16, 16]
    });
    this.idx = level.items.length;
  });

  // Объект Coin наследуется от Mario.Entity
  Mario.Util.inherits(Coin, Mario.Entity);

  // Подобрал ли игрок
  Coin.prototype.isPlayerCollided = function() {
    // Первые два элемента в hitbox - смещение, то найдём координаты
    var hpos1 = [this.pos[0] + this.hitbox[0], this.pos[1] + this.hitbox[1]];
    var hpos2 = [
      player.pos[0] + player.hitbox[0],
      player.pos[1] + player.hitbox[1]
    ];

    // Если hitbox перекрывается
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
        this.collect();
      }
    }
  };

  // Отрисовка
  Coin.prototype.render = function(ctx, vX, vY) {
    this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
  };

  // Денбгам плевать на гравитацию))) Обновление кажого кадра
  Coin.prototype.update = function(dt) {
    this.sprite.update(dt);
  };

  // Проверка столкновения
  Coin.prototype.checkCollisions = function() {
    this.isPlayerCollided();
  };

  // Подобрали монетку
  Coin.prototype.collect = function() {
    player.coins += 1;
    delete level.items[this.idx];
  };
})();
