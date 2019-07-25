// Модуль сущностей
(function() {
	if (typeof Mario === 'undefined')
		window.Mario = {};

	var Entity = Mario.Entity = function(options) {
	  this.vel = [0,0];
	  this.acc = [0,0];
	  this.standing = true;
	  this.pos = options.pos;
	  this.sprite = options.sprite;
	  this.hitbox = options.hitbox;
	  this.left = false;
    }

    // Отрисовка сущности
	Entity.prototype.render = function(ctx, vX, vY) {
		this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY)
    }
    
    // Столкновение со стенками
	Entity.prototype.collideWall = function(wall) {
		//Стена всегда будет блоком 16х16 с hitbox [0,0,16,16].
		if (this.pos[0] > wall.pos[0]) {
			//с права
			this.pos[0] = wall.pos[0] + wall.hitbox[2] - this.hitbox[0];
			this.vel[0] = Math.max(0, this.vel[0]);
			this.acc[0] = Math.max(0, this.acc[0]);
		} else {
			this.pos[0] = wall.pos[0] + wall.hitbox[0] - this.hitbox[2] - this.hitbox[0];
			this.vel[0] = Math.min(0, this.vel[0]);
			this.acc[0] = Math.min(0, this.acc[0]);
		}
    }
    
    // Вообще не ебу что это
	Entity.prototype.bump = function() {;}
})();
