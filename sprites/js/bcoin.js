(function() {
    if (typeof Mario === 'undefined')
    window.Mario = {};
  
    var Bcoin = Mario.Bcoin = function(pos) {
      Mario.Entity.call(this, {
        pos: pos,
        sprite: level.bcoinSprite(),
        hitbox: [0,0,16,16]
      });
    }
  
    // Объекст Bcoin наследуется от Mario.Entity
    Mario.Util.inherits(Bcoin, Mario.Entity);
  
   // Спавним
    Bcoin.prototype.spawn = function() {
      this.idx = level.items.length;
      level.items.push(this);
      this.active = true;
      this.vel = -12;
      this.targetpos = this.pos[1] - 32;
    }
  
    // Обновляем каждый кадр
    Bcoin.prototype.update = function(dt) {
      if (!this.active) return;
  
      if (this.vel > 0 && this.pos[1] >= this.targetpos) {
        player.coins += 1;
        // спавним много вещей
        delete level.items[this.idx];
      }
  
      this.acc = 0.75;
      this.vel += this.acc;
      this.pos[1] += this.vel;
      this.sprite.update(dt);
    }
  
    Bcoin.prototype.checkCollisions = function() {;}
  
  })();
  